package com.careflow.calendar;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/calendar")
public class CalendarController {
  @GetMapping("/status")
  public Map<String, Object> status() {
    return Map.of("connected", true, "provider", "Google Calendar", "scopes", "calendar.events");
  }

  @GetMapping("/oauth/url")
  public Map<String, String> oauthUrl() {
    return Map.of("url", "https://accounts.google.com/o/oauth2/v2/auth?client_id=GOOGLE_CLIENT_ID&scope=https://www.googleapis.com/auth/calendar.events");
  }

  @PostMapping("/disconnect")
  public Map<String, Object> disconnect() {
    return Map.of("connected", false, "message", "Google Calendar disconnected");
  }
}
