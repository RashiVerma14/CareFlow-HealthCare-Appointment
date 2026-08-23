package com.careflow.patient;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/patients")
public class PatientController {
  private final PatientRepository patients;

  public PatientController(PatientRepository patients) {
    this.patients = patients;
  }

  @GetMapping
  public List<Patient> list() {
    return patients.findAll();
  }

  @GetMapping("/{id}")
  public Patient get(@PathVariable String id) {
    return patients.findById(id).orElseThrow();
  }

  @PostMapping
  public Patient save(@RequestBody Patient patient) {
    return patients.save(patient);
  }
}
