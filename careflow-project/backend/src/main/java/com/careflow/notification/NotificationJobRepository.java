package com.careflow.notification;

import java.time.Instant;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NotificationJobRepository extends MongoRepository<NotificationJob, String> {
  List<NotificationJob> findByStatusAndNextAttemptAtBefore(String status, Instant now);
}
