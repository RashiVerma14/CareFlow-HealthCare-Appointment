package com.careflow.appointment;

import com.careflow.ai.LLMService;
import com.careflow.calendar.CalendarService;
import com.careflow.doctor.Doctor;
import com.careflow.doctor.DoctorRepository;
import com.careflow.exception.ConflictException;
import com.careflow.exception.NotFoundException;
import com.careflow.notification.EmailService;
import java.time.Instant;
import java.util.List;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class AppointmentService {
  private final AppointmentRepository appointments;
  private final DoctorRepository doctors;
  private final LLMService llm;
  private final EmailService email;
  private final CalendarService calendar;

  public AppointmentService(AppointmentRepository appointments, DoctorRepository doctors, LLMService llm, EmailService email, CalendarService calendar) {
    this.appointments = appointments;
    this.doctors = doctors;
    this.llm = llm;
    this.email = email;
    this.calendar = calendar;
  }

 public Appointment book(String patientId, BookAppointmentRequest request) {

    Doctor doctor = doctors.findById(request.doctorId())
            .orElseThrow(() -> new NotFoundException("Doctor not found"));

    if (doctor.leaveDays.contains(request.slotStart().toLocalDate())) {
        throw new ConflictException(
                "Doctor is on leave for the selected date"
        );
    }

    Appointment appointment = new Appointment();

    appointment.patientId = patientId;
    appointment.doctorId = doctor.id;
    appointment.slotStart = request.slotStart();
    appointment.slotEnd =
            request.slotStart().plusMinutes(doctor.slotDurationMinutes);
    appointment.holdExpiresAt = Instant.now().plusSeconds(300);
    appointment.symptoms = request.symptoms();
    appointment.status = AppointmentStatus.CONFIRMED;

    /*
     * Save first.
     *
     * MongoDB's unique partial index guarantees that
     * two active appointments cannot occupy the same slot.
     */
    try {

        Appointment saved = appointments.save(appointment);

        /*
         * Generate the AI summary only after the slot
         * has been successfully reserved.
         */
        try {
            saved.preVisitSummary =
                    llm.preVisitSummary(request.symptoms());
        } catch (RuntimeException error) {

            saved.preVisitSummary = failedSummary(
                    "Pre-visit AI summary is pending because the LLM provider failed."
            );
        }

        saved.updatedAt = Instant.now();

        saved = appointments.save(saved);

        notifyBooking(saved);

        return saved;

    } catch (DuplicateKeyException error) {

        throw new ConflictException(
                "This appointment slot is already booked. Please choose another slot."
        );
    }
}

    Appointment appointment = new Appointment();
    appointment.patientId = patientId;
    appointment.doctorId = doctor.id;
    appointment.slotStart = request.slotStart();
    appointment.slotEnd = request.slotStart().plusMinutes(doctor.slotDurationMinutes);
    appointment.holdExpiresAt = Instant.now().plusSeconds(300);
    appointment.symptoms = request.symptoms();

    try {
      appointment.preVisitSummary = llm.preVisitSummary(request.symptoms());
    } catch (RuntimeException error) {
      appointment.preVisitSummary = failedSummary("Pre-visit AI summary is pending because the LLM provider failed.");
    }

    try {
      appointment.status = AppointmentStatus.CONFIRMED;
      Appointment saved = appointments.save(appointment);
      notifyBooking(saved);
      return saved;
    } catch (DuplicateKeyException error) {
      throw new ConflictException("This appointment slot was just booked by another patient");
    }
  }

  public Appointment completeVisit(String appointmentId, VisitCompleteRequest request) {
    Appointment appointment = appointments.findById(appointmentId).orElseThrow(() -> new NotFoundException("Appointment not found"));
    appointment.clinicalNotes = request.clinicalNotes();
    appointment.prescriptions = request.prescriptions() == null ? List.of() : request.prescriptions();
    try {
      appointment.postVisitSummary = llm.postVisitSummary(request.clinicalNotes());
    } catch (RuntimeException error) {
      appointment.postVisitSummary = failedSummary("Post-visit AI summary is pending because the LLM provider failed.");
    }
    appointment.status = AppointmentStatus.COMPLETED;
    appointment.updatedAt = Instant.now();
    return appointments.save(appointment);
  }

  public Appointment cancel(String appointmentId) {
    Appointment appointment = appointments.findById(appointmentId).orElseThrow(() -> new NotFoundException("Appointment not found"));
    appointment.status = AppointmentStatus.CANCELLED;
    appointment.updatedAt = Instant.now();
    Appointment saved = appointments.save(appointment);
    calendar.deleteEvents(saved);
    email.send("patient@example.com", "CareFlow appointment cancelled", "Your appointment has been cancelled.");
    return saved;
  }

  @Scheduled(fixedDelay = 60000)
  public void expireHeldSlots() {
    appointments.findByStatusAndHoldExpiresAtBefore(AppointmentStatus.HELD, Instant.now()).forEach(appointment -> {
      appointment.status = AppointmentStatus.CANCELLED;
      appointment.updatedAt = Instant.now();
      appointments.save(appointment);
    });
  }

  private void notifyBooking(Appointment appointment) {
    calendar.createEvents(appointment);
    email.send("patient@example.com", "CareFlow booking confirmed", "Your appointment is confirmed.");
    email.send("doctor@example.com", "New CareFlow appointment", "A patient booked an appointment and shared symptoms.");
  }

  private AiVisitSummary failedSummary(String reason) {
    AiVisitSummary summary = new AiVisitSummary();
    summary.generated = false;
    summary.failureReason = reason;
    summary.generatedAt = Instant.now();
    return summary;
  }
}
