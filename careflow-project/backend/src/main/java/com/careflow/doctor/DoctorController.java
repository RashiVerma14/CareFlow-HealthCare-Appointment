package com.careflow.doctor;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/doctors")
public class DoctorController {
  private final DoctorService service;

  public DoctorController(DoctorService service) {
    this.service = service;
  }

  @GetMapping
  public List<Doctor> search(@RequestParam(required = false) String specialization) {
    return service.search(specialization);
  }

  @PostMapping
  public Doctor create(@Valid @RequestBody Doctor doctor) {
    return service.save(doctor);
  }

  @PutMapping("/{id}/leave-days/{date}")
  public Doctor leave(@PathVariable String id, @PathVariable LocalDate date) {
    return service.addLeaveDay(id, date);
  }
}
