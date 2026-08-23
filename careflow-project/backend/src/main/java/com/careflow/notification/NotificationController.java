package com.careflow.notification;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
  private final NotificationJobRepository jobs;

  public NotificationController(NotificationJobRepository jobs) {
    this.jobs = jobs;
  }

  @GetMapping
  public List<NotificationJob> list() {
    return jobs.findAll();
  }

  @PutMapping("/retry-failed")
  public List<NotificationJob> retryFailed() {
    return jobs.findAll().stream().peek(job -> {
      if (!"SENT".equals(job.status)) {
        job.status = "PENDING";
        job.lastError = null;
      }
    }).map(jobs::save).toList();
  }

  @PostMapping("/seed-demo")
  public NotificationJob seedDemo() {
    NotificationJob job = new NotificationJob();
    job.userId = "demo-user";
    job.type = "APPOINTMENT_REMINDER";
    job.channel = "EMAIL";
    job.subject = "CareFlow appointment reminder";
    job.body = "Your appointment is tomorrow.";
    return jobs.save(job);
  }
}
