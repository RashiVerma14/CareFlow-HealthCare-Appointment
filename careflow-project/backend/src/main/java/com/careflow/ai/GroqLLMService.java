package com.careflow.ai;

import com.careflow.appointment.AiVisitSummary;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class GroqLLMService implements LLMService {
  @Override
  public AiVisitSummary preVisitSummary(String symptoms) {
    AiVisitSummary summary = new AiVisitSummary();
    summary.generated = true;
    summary.generatedAt = Instant.now();
    summary.urgencyLevel = symptoms.toLowerCase().matches(".*(chest|breath|faint|severe).*") ? "Medium" : "Low";
    summary.chiefComplaint = symptoms.length() > 90 ? symptoms.substring(0, 90) + "..." : symptoms;
    summary.suggestedQuestions = List.of(
        "When did the symptoms start and what makes them better or worse?",
        "Are there red flag symptoms such as breathlessness, fainting, or severe pain?",
        "Which current medicines, allergies, or past diagnoses should be reviewed?"
    );
    return summary;
  }

  @Override
  public AiVisitSummary postVisitSummary(String clinicalNotes) {
    AiVisitSummary summary = new AiVisitSummary();
    summary.generated = true;
    summary.generatedAt = Instant.now();
    summary.patientFriendlySummary = "Your doctor reviewed your symptoms and shared a care plan. Follow medicines as prescribed and watch for worsening symptoms.";
    summary.medicationSchedule = "Use the prescription frequencies entered by the doctor. Reminder jobs will send due medication alerts.";
    summary.followUpInstructions = "Book a follow-up if symptoms persist, worsen, or the doctor requested review.";
    return summary;
  }
}
