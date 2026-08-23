# System Design

CareFlow is a modular monolith with React on Vercel, Spring Boot on Render or Railway, and MongoDB Atlas. The backend keeps explicit modules for auth, doctors, appointments, AI, email, calendar, notifications, and exception handling. Controllers accept DTOs, services own business rules, and repositories persist MongoDB documents.

Double-booking is handled at the database boundary, not only in application memory. Each appointment stores `doctorId`, `slotStart`, `slotEnd`, and `status`. The production index should be a partial unique index on `doctorId + slotStart` for active statuses such as `HELD`, `CONFIRMED`, and `COMPLETED`. During booking, the service first rejects doctor leave days, generates or falls back from the AI pre-visit summary, then saves the appointment. If two patients submit the same slot concurrently, MongoDB allows only one insert; the loser receives HTTP 409. This keeps correctness even when multiple backend instances run.

Slot holds prevent abandoned booking flows from blocking inventory forever. A held appointment gets `holdExpiresAt`, and a scheduled job cancels expired holds. Confirmation emails and calendar sync run after persistence. If SendGrid or Google Calendar fails, the appointment remains valid and a retryable job records the failed side effect. This avoids corrupting the core booking transaction because of an external outage.

Doctor leave conflict handling is explicit. Admins can add leave days to a doctor profile. When a leave day is added, the service queries appointments for that doctor and date, then notifies affected patients so they can reschedule. A stricter production version can automatically place affected appointments in a `RESCHEDULE_REQUIRED` state and block new booking for that date.

LLM outputs are persisted as first-class appointment data. Pre-visit summaries include urgency, chief complaint, and three doctor questions. Post-visit summaries include patient-friendly explanation, medication schedule, and follow-up steps. LLM failure never blocks booking or clinical note submission; CareFlow stores the raw input, marks generation failed, and allows retry.

Medication reminders and email retries are background jobs. Prescription data is structured so reminder timing does not depend on generated prose. OAuth tokens for Google Calendar should be encrypted at rest and scoped only to calendar event management.
