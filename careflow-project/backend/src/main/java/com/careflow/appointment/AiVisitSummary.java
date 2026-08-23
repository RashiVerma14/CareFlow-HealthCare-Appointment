package com.careflow.appointment;

import java.time.Instant;
import java.util.List;

public class AiVisitSummary {
  public String urgencyLevel;
  public String chiefComplaint;
  public List<String> suggestedQuestions;
  public String patientFriendlySummary;
  public String medicationSchedule;
  public String followUpInstructions;
  public boolean generated;
  public String failureReason;
  public Instant generatedAt;
}
