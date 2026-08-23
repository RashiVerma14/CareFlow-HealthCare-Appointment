package com.careflow.notification;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SendGridEmailService implements EmailService {

    private static final Logger log =
            LoggerFactory.getLogger(SendGridEmailService.class);

    @Value("${sendgrid.api-key}")
    private String apiKey;

    @Value("${sendgrid.from-email}")
    private String fromEmail;

    @Value("${sendgrid.from-name:CareFlow}")
    private String fromName;

    @Override
    public void send(String to, String subject, String body) {

        if (apiKey == null || apiKey.isBlank()) {
            log.warn("SendGrid API key is not configured");
            return;
        }

        try {

            Email from = new Email(fromEmail, fromName);
            Email recipient = new Email(to);

            Content content =
                    new Content("text/plain", body);

            Mail mail =
                    new Mail(
                            from,
                            subject,
                            recipient,
                            content
                    );

            SendGrid sendGrid =
                    new SendGrid(apiKey);

            Request request =
                    new Request();

            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response =
                    sendGrid.api(request);

            int statusCode =
                    response.getStatusCode();

            if (statusCode >= 200 && statusCode < 300) {

                log.info(
                        "Email sent successfully to={} subject={}",
                        to,
                        subject
                );

            } else {

                log.error(
                        "SendGrid failed. status={} body={}",
                        statusCode,
                        response.getBody()
                );
            }

        } catch (IOException error) {

            log.error(
                    "Failed to send email to={}",
                    to,
                    error
            );
        }
    }
}
