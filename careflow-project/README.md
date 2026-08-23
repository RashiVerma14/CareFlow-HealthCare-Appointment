# 🩺 CareFlow — Healthcare Appointment & Follow-Up Platform

<p align="center">
  <strong>A full-stack healthcare appointment and follow-up management platform</strong>
</p>

<p align="center">
  Built with React, Spring Boot, Java, and MongoDB
</p>

---

## 🌐 Live Deployment

### 🚀 Live Application
👉 **https://intelligent-education-production-a773.up.railway.app**

### ⚙️ Backend API
👉 **https://careflow-healthcare-appointment-production.up.railway.app**

### 📚 API / Swagger Documentation
👉 **https://careflow-healthcare-appointment-production.up.railway.app/api/swagger-ui.html**

---

## 📌 Overview

**CareFlow** is a full-stack healthcare appointment and follow-up management platform designed to simplify interactions between patients, doctors, and administrators.

The platform provides a centralized system for managing appointments, doctor availability, patient information, follow-ups, reminders, and healthcare-related workflows.

CareFlow focuses on providing a clean, intuitive, and role-based experience while maintaining a scalable backend architecture.

---

## ✨ Key Features

### 👤 Patient Portal

- Patient registration and login
- Secure authentication
- Patient profile management
- Browse available doctors
- View doctor information
- Book appointments
- View upcoming appointments
- Track appointment history
- Manage follow-ups
- Receive reminders
- Cancel appointments
- View healthcare-related information

### 👨‍⚕️ Doctor Portal

- Doctor authentication
- Doctor profile management
- View appointments
- Manage appointment schedules
- View patient information
- Manage follow-ups
- Track upcoming consultations
- Update appointment status

### 🛡️ Admin Portal

- Secure administrator authentication
- Manage doctors
- Manage patients
- Manage appointments
- Monitor platform activity
- Manage healthcare platform data

---

## 🔐 Authentication & Security

CareFlow implements role-based authentication and authorization.

### Supported Roles

- **Patient**
- **Doctor**
- **Admin**

The backend uses Spring Security for authentication and authorization, with JWT-based authentication for securing protected APIs.

Sensitive configuration such as database credentials and authentication secrets are stored using environment variables rather than being hardcoded into the source code.

---

## 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │       User           │
                         │ Patient / Doctor /   │
                         │       Admin          │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   React + Vite       │
                         │    Frontend          │
                         │      Railway         │
                         └──────────┬───────────┘
                                    │
                              REST API / HTTPS
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Spring Boot        │
                         │      Backend         │
                         │       Railway        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    MongoDB Atlas     │
                         │      Database        │
                         └──────────────────────┘


Live Demo
🚀 Try CareFlow

Frontend:
https://intelligent-education-production-a773.up.railway.app

Backend:
https://careflow-healthcare-appointment-production.up.railway.app

Swagger API Documentation:
https://careflow-healthcare-appointment-production.up.railway.app/api/swagger-ui.html
