package com.careflow.notification;

import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("notification_jobs")
public class NotificationJob {
  @Id public String id;
  @Indexed public String userId;
  public String type;
  public String channel;
  public String subject;
  public String body;
  public String status = "PENDING";
  public int attemptCount;
  public Instant nextAttemptAt = Instant.now();
  public String lastError;
}
