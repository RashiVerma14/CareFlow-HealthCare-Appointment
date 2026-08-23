package com.careflow.appointment;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("appointments")
public class Appointment {

    @Id
    public String id;

    @Indexed
    public String patientId;

    @Indexed
    public String doctorId;

    public LocalDateTime slotStart;
    public LocalDateTime slotEnd;

    public AppointmentStatus status = AppointmentStatus.HELD;

    public Instant holdExpiresAt;

    public String symptoms;

    public AiVisitSummary preVisitSummary;

    public String clinicalNotes;

    public List<Prescription> prescriptions = new ArrayList<>();

    public AiVisitSummary postVisitSummary;

    public String patientCalendarEventId;

    public String doctorCalendarEventId;

    public Instant createdAt = Instant.now();

    public Instant updatedAt = Instant.now();
}
