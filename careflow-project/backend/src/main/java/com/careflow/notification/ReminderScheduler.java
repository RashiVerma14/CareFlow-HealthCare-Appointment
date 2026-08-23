package com.careflow.notification;

import com.careflow.medication.MedicationReminderRepository;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ReminderScheduler {
  private static final Logger log = LoggerFactory.getLogger(ReminderScheduler.class);
  private final MedicationReminderRepository medicationReminders;
  private final NotificationJobRepository notificationJobs;

  public ReminderScheduler(MedicationReminderRepository medicationReminders, NotificationJobRepository notificationJobs) {
    this.medicationReminders = medicationReminders;
    this.notificationJobs = notificationJobs;
  }

  @Scheduled(fixedDelay = 300000)
  public void sendDueMedicationAndAppointmentReminders() {
    medicationReminders.findByActiveTrueAndNextRunAtBefore(Instant.now()).forEach(reminder -> {
      log.info("Medication reminder due patient={} medicine={}", reminder.patientId, reminder.medicine);
      reminder.nextRunAt = Instant.now().plusSeconds(3600);
      medicationReminders.save(reminder);
    });
    notificationJobs.findByStatusAndNextAttemptAtBefore("PENDING", Instant.now()).forEach(job -> {
      log.info("Retrying notification job={} channel={}", job.id, job.channel);
      job.attemptCount++;
      job.status = "SENT";
      notificationJobs.save(job);
    });
  }
}
