package com.careflow.appointment;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record BookAppointmentRequest(
    @NotBlank String doctorId,
    @NotNull @Future LocalDateTime slotStart,
    @NotBlank String symptoms
) {}
