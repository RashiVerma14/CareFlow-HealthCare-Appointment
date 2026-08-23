package com.careflow.doctor;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("doctors")
public class Doctor {
  @Id public String id;
  public String userId;
  public String name;
  @Indexed public String specialization;
  public LocalTime workStart;
  public LocalTime workEnd;
  public int slotDurationMinutes;
  public List<DayOfWeek> workingDays = new ArrayList<>();
  public List<LocalDate> leaveDays = new ArrayList<>();
}
