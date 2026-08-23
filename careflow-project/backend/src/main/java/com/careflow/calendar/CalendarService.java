package com.careflow.calendar;

import com.careflow.appointment.Appointment;

public interface CalendarService {
  void createEvents(Appointment appointment);
  void updateEvents(Appointment appointment);
  void deleteEvents(Appointment appointment);
}
