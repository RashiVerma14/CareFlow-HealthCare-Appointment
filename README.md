# CareFlow-HealthCare-Appointment
CareFlow — AI-powered healthcare appointment and follow-up management platform built with React, Spring Boot, MongoDB, JWT authentication, AI-assisted visit summaries, automated reminders, and Google Calendar integration.
CareFlow is a full-stack AI-powered healthcare management platform designed to simplify the complete patient–doctor appointment lifecycle. It enables patients to discover doctors, book appointments, provide symptoms before visits, receive AI-generated pre-visit summaries, manage prescriptions and medication reminders, and synchronize appointments with Google Calendar.

The platform combines a modern React + Vite + Tailwind CSS frontend with a secure and modular Spring Boot backend, MongoDB, JWT authentication, AI-powered processing through Groq LLM, automated email notifications, and Google Calendar integration.

✨ Key Features
🔐 Secure Authentication & Authorization using Spring Security and JWT
👨‍⚕️ Doctor Discovery & Management
📅 Appointment Booking & Scheduling
📝 Pre-Visit Symptom Collection
🤖 AI-Powered Pre-Visit Summaries using Groq LLM
💊 Digital Prescriptions & Medication Reminders
🔔 Automated Appointment & Medication Notifications
📧 Email Notification System with Retry Handling
🗓️ Google Calendar Integration
👤 Patient, Doctor & Admin Workflows
⚡ RESTful Backend APIs
📚 OpenAPI/Swagger API Documentation
🛡️ Global Exception Handling & Request Validation
📊 Appointment and Follow-Up Management
📱 Responsive Modern Healthcare UI
🛠️ Tech Stack
Frontend
React
Vite
Tailwind CSS
React Router
Axios
Lucide React
Backend
Java 21
Spring Boot 3.3.4
Spring Web
Spring Security
Spring Data MongoDB
Bean Validation
Maven
JWT
Database & Services
MongoDB / MongoDB Atlas
Groq LLM
Google Calendar API
SendGrid Email API
Documentation & Deployment
Swagger / OpenAPI
Vercel
Render / Railway
Environment-based configuration
🏗️ Architecture

CareFlow follows a modular monolithic architecture, keeping the backend organized into independent functional modules while maintaining a simple and scalable deployment model.

CareFlow
│
├── React + Vite Frontend
│       │
│       └── REST API / Axios
│
├── Spring Boot Backend
│       ├── Authentication
│       ├── User Management
│       ├── Doctor Management
│       ├── Appointment Management
│       ├── AI Services
│       ├── Notifications
│       ├── Calendar Integration
│       └── Exception Handling
│
├── MongoDB
│
└── External Services
        ├── Groq LLM
        ├── Google Calendar
        └── SendGrid
🤖 AI Integration

CareFlow uses an LLM-powered service to transform patient-provided symptoms and appointment information into a structured pre-visit summary.

This allows doctors to quickly understand the patient's reported concerns before the consultation, reducing repetitive information gathering and improving preparation for the appointment.

🔔 Smart Notification System

The application includes an automated notification workflow for important healthcare events such as:

Upcoming appointments
Medication reminders
Follow-up activities
Failed notification retries

This helps patients stay consistent with their appointments and medication schedules.

🗓️ Google Calendar Integration

CareFlow can integrate scheduled appointments with Google Calendar, allowing patients and doctors to keep healthcare appointments synchronized with their existing schedules.

🔐 Security

Security is implemented using:

Spring Security
JWT-based authentication
Role-based access control
Request validation
Centralized exception handling
Environment variables for sensitive configuration

Secrets such as database credentials, JWT secrets, API keys, and OAuth credentials are intentionally kept outside the source code.

📂 Project Structure
careflow/
│
├── src/                       # React frontend
│   ├── components/
│   ├── pages/
│   ├── api/
│   ├── context/
│   └── utils/
│
├── backend/                   # Spring Boot backend
│   └── src/main/java/com/careflow/
│       ├── auth/
│       ├── user/
│       ├── patient/
│       ├── doctor/
│       ├── appointment/
│       ├── medication/
│       ├── notification/
│       ├── calendar/
│       ├── ai/
│       ├── config/
│       └── exception/
│
├── docs/
│   ├── API.md
│   ├── DB_SCHEMA.md
│   ├── LLM_PROMPTS.md
│   ├── GOOGLE_CALENDAR.md
│   └── SYSTEM_DESIGN.md
│
├── .env.example
└── README.md
🚀 Getting Started
Frontend
npm install
npm run dev
Backend

Make sure Java 21, Maven, and MongoDB are installed.

cd backend
mvn spring-boot:run

Configure the required environment variables before starting the backend.

🌐 Deployment

The application can be deployed using:

Frontend: Vercel
Backend: Render / Railway
Database: MongoDB Atlas

Environment variables should be configured separately for development and production environments.

🎯 Project Goal

CareFlow aims to demonstrate how modern full-stack technologies and AI can be combined to build a practical healthcare application that improves appointment management, doctor preparation, patient follow-ups, and healthcare communication.
