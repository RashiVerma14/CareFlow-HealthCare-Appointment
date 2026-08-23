package com.careflow.appointment;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record VisitCompleteRequest(
    @NotBlank String clinicalNotes,
    List<Prescription> prescriptions
) {}
