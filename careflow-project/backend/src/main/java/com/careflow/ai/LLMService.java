package com.careflow.ai;

import com.careflow.appointment.AiVisitSummary;

public interface LLMService {
  AiVisitSummary preVisitSummary(String symptoms);
  AiVisitSummary postVisitSummary(String clinicalNotes);
}
