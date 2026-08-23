package com.careflow.auth;

import com.careflow.user.AppUser;
import com.careflow.user.Role;
import com.careflow.user.UserRepository;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
  private final UserRepository users;
  private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

  public AuthController(UserRepository users) {
    this.users = users;
  }

  @PostMapping("/register")
  public AppUser register(@RequestBody RegisterRequest request) {
    AppUser user = new AppUser();
    user.email = request.email();
    user.fullName = request.fullName();
    user.passwordHash = encoder.encode(request.password());
    user.role = request.role() == null ? Role.PATIENT : request.role();
    return users.save(user);
  }

  @PostMapping("/login")
  public AuthResponse login(@RequestBody LoginRequest request) {
    AppUser user = users.findByEmail(request.email()).orElseThrow();
    if (!encoder.matches(request.password(), user.passwordHash)) {
      throw new IllegalArgumentException("Invalid credentials");
    }
    return new AuthResponse("demo-jwt-token-replace-with-signed-token", user.role.name(), user.id);
  }

  public record RegisterRequest(@Email String email, @NotBlank String password, @NotBlank String fullName, Role role) {}
  public record LoginRequest(@Email String email, @NotBlank String password) {}
  public record AuthResponse(String token, String role, String userId) {}
}
