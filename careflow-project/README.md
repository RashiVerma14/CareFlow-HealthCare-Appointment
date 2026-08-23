# CareFlow

CareFlow is an AI-powered healthcare appointment and follow-up manager built for the assignment in `Healthcare_Appointment_Manager (1) (2).pdf`.

## What is included

- React + Vite + Tailwind frontend with patient, doctor, and admin workflows.
- Spring Boot backend source tree under `backend/`.
- MongoDB document model notes, API docs, LLM prompts, Google Calendar setup, and system design write-up under `docs/`.
- `.env.example` for local and deployed configuration.

## Frontend setup

```bash
npm install
npm run dev
```

The current UI runs as a polished local demo and models the full CareFlow workflows: doctor search, slot selection, symptom collection, AI pre-visit summary, doctor notes, prescription, reminders, leave handling, notification retries, and Google Calendar sync status.

## Backend setup

Install Java 21 and Maven, then run:

```bash
cd backend
mvn spring-boot:run
```

The backend is structured as a modular monolith:

```text
com.careflow
├── auth
├── user
├── doctor
├── appointment
├── ai
├── notification
├── calendar
├── config
├── common
└── exception
```

## Assignment docs

- API documentation: `docs/API.md`
- Database schema: `docs/DB_SCHEMA.md`
- LLM prompts: `docs/LLM_PROMPTS.md`
- Google Calendar setup: `docs/GOOGLE_CALENDAR.md`
- System design write-up: `docs/SYSTEM_DESIGN.md`

## Deployment

- Frontend: Vercel
- Backend: Render or Railway
- Database: MongoDB Atlas

Configure environment variables from `.env.example` in each deployment target.
