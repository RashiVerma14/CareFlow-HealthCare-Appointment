package com.careflow.medication;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("medication_reminders")
public class MedicationReminder {
  @Id public String id;
  @Indexed public String patientId;
  @Indexed public String appointmentId;
  public String medicine;
  public String dosage;
  public String frequency;
  public List<String> reminderTimes = new ArrayList<>();
  public boolean active = true;
  public Instant nextRunAt;
}
