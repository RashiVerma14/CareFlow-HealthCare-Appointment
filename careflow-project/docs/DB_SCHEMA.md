# MongoDB Schema

## `users`

- `email`: unique index
- `passwordHash`
- `fullName`
- `role`: `PATIENT`, `DOCTOR`, `ADMIN`
- `doctorId`
- `createdAt`

## `doctors`

- `specialization`: indexed for patient search
- `workStart`, `workEnd`
- `slotDurationMinutes`
- `workingDays`
- `leaveDays`

## `appointments`

- `patientId`: indexed
- `doctorId`
- `slotStart`, `slotEnd`
- `status`: `HELD`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `RESCHEDULED`
- `holdExpiresAt`
- `symptoms`
- `preVisitSummary`
- `clinicalNotes`
- `prescriptions`
- `postVisitSummary`
- `patientCalendarEventId`, `doctorCalendarEventId`

Important index:

```text
doctorId + slotStart + status unique
```

Production hardening should use a partial unique index for active statuses only (`HELD`, `CONFIRMED`, `COMPLETED`) so cancelled slots can be reused cleanly.

## `notification_jobs`

Recommended production collection:

- `type`: booking, reminder, cancellation, medication
- `recipientUserId`
- `payload`
- `status`: pending, sent, failed, retrying
- `attemptCount`
- `nextAttemptAt`
- `lastError`

Implemented in backend as `NotificationJob`.

## `patients`

- `userId`: indexed
- `fullName`
- `age`
- `phone`
- `emergencyContact`
- `conditionSummary`
- `riskLevel`
- `createdAt`

## `medication_reminders`

- `patientId`: indexed
- `appointmentId`: indexed
- `medicine`
- `dosage`
- `frequency`
- `reminderTimes`
- `active`
- `nextRunAt`

## `calendar_tokens`

Recommended production collection:

- `userId`
- encrypted `accessToken`
- encrypted `refreshToken`
- `expiresAt`
- `scopes`
