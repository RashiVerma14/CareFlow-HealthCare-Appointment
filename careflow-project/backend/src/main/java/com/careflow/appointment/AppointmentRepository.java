package com.careflow.appointment;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AppointmentRepository extends MongoRepository<Appointment, String> {
  boolean existsByDoctorIdAndSlotStartAndStatusIn(String doctorId, LocalDateTime slotStart, List<AppointmentStatus> statuses);
  List<Appointment> findByStatusAndHoldExpiresAtBefore(AppointmentStatus status, Instant now);
  List<Appointment> findByDoctorIdAndSlotStartBetweenAndStatusIn(String doctorId, LocalDateTime from, LocalDateTime to, List<AppointmentStatus> statuses);
}
