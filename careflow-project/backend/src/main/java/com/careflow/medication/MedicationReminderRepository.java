package com.careflow.medication;

import java.time.Instant;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MedicationReminderRepository extends MongoRepository<MedicationReminder, String> {
  List<MedicationReminder> findByPatientId(String patientId);
  List<MedicationReminder> findByActiveTrueAndNextRunAtBefore(Instant now);
}
