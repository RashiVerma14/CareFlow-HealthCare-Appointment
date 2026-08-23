# Google Calendar OAuth Setup

1. Create a Google Cloud project.
2. Enable the Google Calendar API.
3. Configure OAuth consent screen.
4. Create OAuth 2.0 web credentials.
5. Add redirect URI:

```text
http://localhost:8080/api/calendar/oauth/callback
```

6. Set environment variables:

```bash
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:8080/api/calendar/oauth/callback
```

## Calendar Behavior

- Booking creates calendar events for patient and doctor.
- Reschedule updates both event IDs.
- Cancellation deletes both event IDs.
- Calendar failure does not roll back a successful appointment.
- Failed sync is stored as retryable integration work.
