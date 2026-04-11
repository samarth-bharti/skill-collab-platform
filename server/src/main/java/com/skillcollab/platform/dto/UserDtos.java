package com.skillcollab.platform.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.Instant;
import java.util.List;

public final class UserDtos {

    private UserDtos() {
    }

    public record UserSummary(
            String id,
            String fullName,
            String name,
            String email,
            String role,
            String location,
            String college,
            String headline,
            String status,
            String bio,
            String availability,
            List<String> topSkills,
            List<String> interests,
            int skillsVerified,
            int endorsements,
            int githubScore,
            String github,
            String linkedin,
            String twitter,
            String profilePicture,
            Instant createdAt,
            String initials
    ) {
    }

    public record UpdateProfileRequest(
            @NotBlank String fullName,
            @NotBlank String role,
            String bio,
            String location,
            String college,
            String availability,
            String headline,
            String github,
            String linkedin,
            String twitter,
            List<String> skills,
            List<String> interests
    ) {
    }

    public record ConnectionRequestView(
            String id,
            UserSummary sender,
            UserSummary receiver,
            String status,
            Instant createdAt,
            Instant respondedAt
    ) {
    }
}
