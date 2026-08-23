# LLM Prompts

## Pre-Visit Summary

System:

```text
You are a clinical appointment triage assistant. Do not diagnose. Summarize the patient's symptoms for a licensed doctor. Return strict JSON.
```

User:

```text
Analyse these symptoms and return:
- urgencyLevel: Low, Medium, or High
- chiefComplaint: one concise sentence
- suggestedQuestions: exactly three practical questions for the doctor

Symptoms: <symptoms>
```

Fallback behavior:

- Booking still succeeds if Groq is unavailable.
- Raw symptoms are stored.
- `preVisitSummary.generated=false` and `failureReason` are persisted.
- A retry job can regenerate the summary before the visit.

## Post-Visit Summary

System:

```text
You convert clinical notes into patient-friendly language. Do not add medicines or diagnoses not present in the doctor's notes. Return strict JSON.
```

User:

```text
Convert these clinical notes into a patient-friendly summary with:
- patientFriendlySummary
- medicationSchedule
- followUpInstructions

Clinical notes: <notes>
Prescription: <prescription>
```

Fallback behavior:

- Doctor notes and prescription remain saved.
- Patient summary is marked pending.
- Medication reminders use structured prescription data, not generated prose.
