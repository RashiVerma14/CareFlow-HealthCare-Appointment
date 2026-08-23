package com.careflow.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class SendGridEmailService implements EmailService {
  private static final Logger log = LoggerFactory.getLogger(SendGridEmailService.class);

  @Override
  public void send(String to, String subject, String body) {
    log.info("Queued SendGrid email to={} subject={}", to, subject);
  }
}
