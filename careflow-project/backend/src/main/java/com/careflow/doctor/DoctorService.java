package com.careflow.doctor;

import com.careflow.appointment.AppointmentRepository;
import com.careflow.appointment.AppointmentStatus;
import com.careflow.exception.NotFoundException;
import com.careflow.notification.EmailService;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class DoctorService {
  private final DoctorRepository doctors;
  private final AppointmentRepository appointments;
  private final EmailService email;

  public DoctorService(DoctorRepository doctors, AppointmentRepository appointments, EmailService email) {
    this.doctors = doctors;
    this.appointments = appointments;
    this.email = email;
  }

  public List<Doctor> search(String specialization) {
    if (specialization == null || specialization.isBlank()) {
      return doctors.findAll();
    }
    return doctors.findBySpecializationContainingIgnoreCase(specialization);
  }

  public Doctor save(Doctor doctor) {
    return doctors.save(doctor);
  }

  public Doctor addLeaveDay(String doctorId, LocalDate leaveDate) {
    Doctor doctor = doctors.findById(doctorId).orElseThrow(() -> new NotFoundException("Doctor not found"));
    if (!doctor.leaveDays.contains(leaveDate)) {
      doctor.leaveDays.add(leaveDate);
    }
    Doctor saved = doctors.save(doctor);
    notifyAffectedPatients(doctorId, leaveDate);
    return saved;
  }

  private void notifyAffectedPatients(String doctorId, LocalDate leaveDate) {
    LocalDateTime from = leaveDate.atStartOfDay();
    LocalDateTime to = leaveDate.plusDays(1).atStartOfDay();
    appointments.findByDoctorIdAndSlotStartBetweenAndStatusIn(
        doctorId,
        from,
        to,
        List.of(AppointmentStatus.CONFIRMED, AppointmentStatus.HELD)
    ).forEach(appointment -> email.send(
        "patient@example.com",
        "CareFlow appointment needs rescheduling",
        "Your doctor is on leave. Please reschedule your appointment."
    ));
  }
}
