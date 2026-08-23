package com.careflow.appointment;

import com.careflow.ai.LLMService;
import com.careflow.calendar.CalendarService;
import com.careflow.doctor.Doctor;
import com.careflow.doctor.DoctorRepository;
import com.careflow.exception.ConflictException;
import com.careflow.exception.NotFoundException;
import com.careflow.notification.EmailService;
import com.careflow.patient.Patient;
import com.careflow.patient.PatientRepository;
import com.careflow.user.AppUser;
import com.careflow.user.UserRepository;

import java.time.Instant;
import java.util.List;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class AppointmentService {

    private final AppointmentRepository appointments;
    private final DoctorRepository doctors;
    private final PatientRepository patients;
    private final UserRepository users;
    private final LLMService llm;
    private final EmailService email;
    private final CalendarService calendar;

    public AppointmentService(
            AppointmentRepository appointments,
            DoctorRepository doctors,
            PatientRepository patients,
            UserRepository users,
            LLMService llm,
            EmailService email,
            CalendarService calendar) {

        this.appointments = appointments;
        this.doctors = doctors;
        this.patients = patients;
        this.users = users;
        this.llm = llm;
        this.email = email;
        this.calendar = calendar;
    }

    public Appointment book(
            String patientId,
            BookAppointmentRequest request) {

        Doctor doctor = doctors.findById(request.doctorId())
                .orElseThrow(() ->
                        new NotFoundException("Doctor not found"));

        if (doctor.leaveDays.contains(
                request.slotStart().toLocalDate())) {

            throw new ConflictException(
                    "Doctor is on leave for the selected date");
        }

        Appointment appointment = new Appointment();

        appointment.patientId = patientId;
        appointment.doctorId = doctor.id;
        appointment.slotStart = request.slotStart();

        appointment.slotEnd = request.slotStart()
                .plusMinutes(doctor.slotDurationMinutes);

        appointment.holdExpiresAt =
                Instant.now().plusSeconds(300);

        appointment.symptoms = request.symptoms();
        appointment.status = AppointmentStatus.CONFIRMED;

        try {

            Appointment saved = appointments.save(appointment);

            try {

                saved.preVisitSummary =
                        llm.preVisitSummary(request.symptoms());

            } catch (RuntimeException error) {

                saved.preVisitSummary =
                        failedSummary(
                                "Pre-visit AI summary is pending because the LLM provider failed."
                        );
            }

            saved.updatedAt = Instant.now();

            saved = appointments.save(saved);

            notifyBooking(saved);

            return saved;

        } catch (DuplicateKeyException error) {

            throw new ConflictException(
                    "This appointment slot is already booked. Please choose another slot.");
        }
    }

    public Appointment completeVisit(
            String appointmentId,
            VisitCompleteRequest request) {

        Appointment appointment =
                appointments.findById(appointmentId)
                        .orElseThrow(() ->
                                new NotFoundException(
                                        "Appointment not found"));

        appointment.clinicalNotes =
                request.clinicalNotes();

        appointment.prescriptions =
                request.prescriptions() == null
                        ? List.of()
                        : request.prescriptions();

        try {

            appointment.postVisitSummary =
                    llm.postVisitSummary(
                            request.clinicalNotes());

        } catch (RuntimeException error) {

            appointment.postVisitSummary =
                    failedSummary(
                            "Post-visit AI summary is pending because the LLM provider failed."
                    );
        }

        appointment.status =
                AppointmentStatus.COMPLETED;

        appointment.updatedAt = Instant.now();

        return appointments.save(appointment);
    }

    public Appointment cancel(String appointmentId) {

        Appointment appointment =
                appointments.findById(appointmentId)
                        .orElseThrow(() ->
                                new NotFoundException(
                                        "Appointment not found"));

        appointment.status =
                AppointmentStatus.CANCELLED;

        appointment.updatedAt = Instant.now();

        Appointment saved =
                appointments.save(appointment);

        calendar.deleteEvents(saved);

        String patientEmail = getPatientEmail(saved.patientId);

        email.send(
                patientEmail,
                "CareFlow appointment cancelled",
                "Your CareFlow appointment has been cancelled."
        );

        return saved;
    }

    @Scheduled(fixedDelay = 60000)
    public void expireHeldSlots() {

        appointments
                .findByStatusAndHoldExpiresAtBefore(
                        AppointmentStatus.HELD,
                        Instant.now())
                .forEach(appointment -> {

                    appointment.status =
                            AppointmentStatus.CANCELLED;

                    appointment.updatedAt =
                            Instant.now();

                    appointments.save(appointment);
                });
    }

    private void notifyBooking(
            Appointment appointment) {

        calendar.createEvents(appointment);

        String patientEmail =
                getPatientEmail(appointment.patientId);

        String doctorEmail =
                getDoctorEmail(appointment.doctorId);

        email.send(
                patientEmail,
                "CareFlow booking confirmed",
                "Your CareFlow appointment has been confirmed."
        );

        email.send(
                doctorEmail,
                "New CareFlow appointment",
                "A patient has booked an appointment with you."
        );
    }

    private String getPatientEmail(String patientId) {

        Patient patient =
                patients.findById(patientId)
                        .orElseThrow(() ->
                                new NotFoundException(
                                        "Patient not found"));

        AppUser user =
                users.findById(patient.userId)
                        .orElseThrow(() ->
                                new NotFoundException(
                                        "Patient user account not found"));

        return user.email;
    }

    private String getDoctorEmail(String doctorId) {

        AppUser doctorUser =
                users.findByDoctorId(doctorId)
                        .orElseThrow(() ->
                                new NotFoundException(
                                        "Doctor user account not found"));

        return doctorUser.email;
    }

    private AiVisitSummary failedSummary(
            String reason) {

        AiVisitSummary summary =
                new AiVisitSummary();

        summary.generated = false;
        summary.failureReason = reason;
        summary.generatedAt = Instant.now();

        return summary;
    }
}
