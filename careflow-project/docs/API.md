# CareFlow API

Base path: `/api`

## Auth

`POST /auth/register`

```json
{
  "email": "patient@example.com",
  "password": "StrongPass123!",
  "fullName": "Priyanshu Singh",
  "role": "PATIENT"
}
```

`POST /auth/login`

```json
{
  "email": "patient@example.com",
  "password": "StrongPass123!"
}
```

Returns a JWT-ready auth response. The checked-in demo uses a placeholder token; production should sign with `JWT_SECRET`.

## Doctors

`GET /doctors?specialization=Cardiology`

Searches doctor profiles by specialization.

`POST /doctors`

Creates or updates doctor profile fields: specialization, working hours, slot duration, working days, and leave days.

`PUT /doctors/{id}/leave-days/{yyyy-mm-dd}`

Marks a doctor on leave and notifies affected bookings.

## Appointments

`POST /appointments`

```json
{
  "doctorId": "doctor-id",
  "slotStart": "2026-08-24T10:30:00",
  "symptoms": "Chest tightness after walking upstairs"
}
```

Creates a booking after checking doctor leave and the unique doctor-slot constraint. Stores the AI pre-visit summary even when generated fallback data is used.

`POST /appointments/{id}/complete`

```json
{
  "clinicalNotes": "Vitals stable. ECG advised.",
  "prescriptions": [
    {
      "medicine": "Pantoprazole",
      "dosage": "40 mg",
      "frequency": "OD",
      "duration": "5 days",
      "reminderTimes": ["08:00"]
    }
  ]
}
```

Stores clinical notes, prescription, medication schedule inputs, and AI patient-friendly summary.

`DELETE /appointments/{id}`

Cancels an appointment, queues cancellation email, and requests calendar deletion.

## OpenAPI

Run the backend and open `/api/swagger-ui.html`.

## Patients

`GET /patients`

Lists patient registry records for doctor/admin views.

`POST /patients`

Creates a patient profile with demographic and risk summary fields.

## Medication Reminders

`GET /medication-reminders/patient/{patientId}`

Lists medication reminders for a patient.

`PUT /medication-reminders/{id}/toggle`

Pauses or resumes a medication reminder.

## Notifications

`GET /notifications`

Lists queued notification jobs.

`PUT /notifications/retry-failed`

Moves failed or queued notification jobs back into retry state.

## Calendar

`GET /calendar/status`

Returns Google Calendar connection status.

`GET /calendar/oauth/url`

Returns the OAuth authorization URL.
