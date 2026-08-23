package com.careflow.calendar;

import com.careflow.appointment.Appointment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class GoogleCalendarService implements CalendarService {
  private static final Logger log = LoggerFactory.getLogger(GoogleCalendarService.class);

  @Override
  public void createEvents(Appointment appointment) {
    log.info("Google Calendar create requested for appointment={}", appointment.id);
  }

  @Override
  public void updateEvents(Appointment appointment) {
    log.info("Google Calendar update requested for appointment={}", appointment.id);
  }

  @Override
  public void deleteEvents(Appointment appointment) {
    log.info("Google Calendar delete requested for appointment={}", appointment.id);
  }
}
