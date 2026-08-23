package com.careflow.appointment;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {
  private final AppointmentService service;

  public AppointmentController(AppointmentService service) {
    this.service = service;
  }

  @PostMapping
  public Appointment book(@RequestHeader(value = "X-Patient-Id", defaultValue = "demo-patient") String patientId, @Valid @RequestBody BookAppointmentRequest request) {
    return service.book(patientId, request);
  }

  @PostMapping("/{id}/complete")
  public Appointment complete(@PathVariable String id, @Valid @RequestBody VisitCompleteRequest request) {
    return service.completeVisit(id, request);
  }

  @DeleteMapping("/{id}")
  public Appointment cancel(@PathVariable String id) {
    return service.cancel(id);
  }
}
