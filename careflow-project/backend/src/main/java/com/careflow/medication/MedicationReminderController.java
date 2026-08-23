package com.careflow.medication;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/medication-reminders")
public class MedicationReminderController {
  private final MedicationReminderRepository reminders;

  public MedicationReminderController(MedicationReminderRepository reminders) {
    this.reminders = reminders;
  }

  @GetMapping("/patient/{patientId}")
  public List<MedicationReminder> byPatient(@PathVariable String patientId) {
    return reminders.findByPatientId(patientId);
  }

  @PostMapping
  public MedicationReminder save(@RequestBody MedicationReminder reminder) {
    return reminders.save(reminder);
  }

  @PutMapping("/{id}/toggle")
  public MedicationReminder toggle(@PathVariable String id) {
    MedicationReminder reminder = reminders.findById(id).orElseThrow();
    reminder.active = !reminder.active;
    return reminders.save(reminder);
  }
}
