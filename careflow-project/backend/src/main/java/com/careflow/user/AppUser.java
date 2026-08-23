package com.careflow.user;

import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("users")
public class AppUser {
  @Id public String id;
  @Indexed(unique = true) public String email;
  public String passwordHash;
  public String fullName;
  public Role role;
  public String doctorId;
  public Instant createdAt = Instant.now();
}
