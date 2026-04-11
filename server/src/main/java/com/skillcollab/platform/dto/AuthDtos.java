package com.skillcollab.platform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {

    private AuthDtos() {
    }

    public record SignupRequest(
            @NotBlank String fullName,
            @Email @NotBlank String email,
            @Size(min = 8) String password
    ) {
    }

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password
    ) {
    }

    public record ForgotPasswordRequest(
            @Email @NotBlank String email
    ) {
    }

    public record ResetPasswordRequest(
            @NotBlank String email,
            @NotBlank String secret,
            @Size(min = 8) String password
    ) {
    }

    public record AuthResponse(
            String token,
            UserDtos.UserSummary user
    ) {
    }

    public record PasswordResetResponse(
            boolean ok,
            String email,
            String secret
    ) {
    }
}
