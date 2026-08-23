package com.careflow.patient;

import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("patients")
public class Patient {
  @Id public String id;
  @Indexed public String userId;
  public String fullName;
  public int age;
  public String phone;
  public String emergencyContact;
  public String conditionSummary;
  public String riskLevel;
  public Instant createdAt = Instant.now();
}
