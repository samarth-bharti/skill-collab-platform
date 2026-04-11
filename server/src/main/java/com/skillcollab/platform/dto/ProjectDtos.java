package com.skillcollab.platform.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public final class ProjectDtos {

    private ProjectDtos() {
    }

    public record CreateProjectRequest(
            @NotBlank String name,
            String tagline,
            @NotBlank String description,
            String category,
            String status,
            String visibility,
            LocalDate dueDate,
            int budget,
            String repoUrl,
            List<String> requiredSkills,
            List<String> lookingFor
    ) {
    }

    public record AddTaskRequest(
            @NotBlank String title,
            String priority,
            String assigneeId,
            LocalDate dueDate
    ) {
    }

    public record AddUpdateRequest(@NotBlank String text) {
    }

    public record InviteRequest(@NotBlank String userId) {
    }

    public record ProjectTaskView(
            String id,
            String title,
            boolean completed,
            String priority,
            UserDtos.UserSummary assignee,
            LocalDate dueDate
    ) {
    }

    public record ProjectUpdateView(
            String id,
            UserDtos.UserSummary author,
            String text,
            Instant createdAt
    ) {
    }

    public record ProjectMessageView(
            String id,
            UserDtos.UserSummary author,
            String text,
            Instant createdAt
    ) {
    }

    public record ProjectRequestView(
            String id,
            String type,
            String status,
            UserDtos.UserSummary sender,
            UserDtos.UserSummary receiver,
            String projectId,
            String projectName,
            Instant createdAt,
            Instant respondedAt
    ) {
    }

    public record ProjectView(
            String id,
            String name,
            String tagline,
            String description,
            String category,
            String status,
            String visibility,
            String repoUrl,
            int budget,
            int progress,
            LocalDate dueDate,
            UserDtos.UserSummary owner,
            List<UserDtos.UserSummary> members,
            List<String> requiredSkills,
            List<String> lookingFor,
            List<ProjectTaskView> tasks,
            List<ProjectUpdateView> updates,
            List<ProjectMessageView> discussions,
            String membership
    ) {
    }
}
