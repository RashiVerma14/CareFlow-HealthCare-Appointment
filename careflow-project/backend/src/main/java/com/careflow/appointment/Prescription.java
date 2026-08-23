package com.careflow.appointment;

import java.util.ArrayList;
import java.util.List;

public class Prescription {
  public String medicine;
  public String dosage;
  public String frequency;
  public String duration;
  public List<String> reminderTimes = new ArrayList<>();
}
