package com.skillcollab.platform.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillcollab.platform.domain.ConnectionRequest;
import com.skillcollab.platform.domain.DirectMessage;
import com.skillcollab.platform.domain.Notification;
import com.skillcollab.platform.domain.Project;
import com.skillcollab.platform.domain.ProjectMessage;
import com.skillcollab.platform.domain.ProjectRequest;
import com.skillcollab.platform.domain.ProjectTask;
import com.skillcollab.platform.domain.ProjectUpdate;
import com.skillcollab.platform.domain.UserAccount;
import com.skillcollab.platform.domain.UserSettings;
import com.skillcollab.platform.dto.ChatDtos;
import com.skillcollab.platform.dto.DashboardDtos;
import com.skillcollab.platform.dto.ProjectDtos;
import com.skillcollab.platform.dto.SettingsDtos;
import com.skillcollab.platform.dto.UserDtos;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Component
public class DtoMapper {

    private final ObjectMapper objectMapper;

    public DtoMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public UserDtos.UserSummary toUserSummary(UserAccount user) {
        if (user == null) {
            return null;
        }
        return new UserDtos.UserSummary(
                user.getId(),
                user.getFullName(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getLocation(),
                user.getCollege(),
                user.getHeadline(),
                user.getStatus(),
                user.getBio(),
                user.getAvailability(),
                nullSafeList(user.getTopSkills()),
                nullSafeList(user.getInterests()),
                user.getSkillsVerified(),
                user.getEndorsements(),
                user.getGithubScore(),
                user.getGithub(),
                user.getLinkedin(),
                user.getTwitter(),
                user.getProfilePicture(),
                user.getCreatedAt(),
                initials(user.getFullName())
        );
    }

    public UserDtos.ConnectionRequestView toConnectionRequestView(ConnectionRequest request) {
        return new UserDtos.ConnectionRequestView(
                request.getId(),
                toUserSummary(request.getSender()),
                toUserSummary(request.getReceiver()),
                request.getStatus().name(),
                request.getCreatedAt(),
                request.getRespondedAt()
        );
    }

    public ChatDtos.MessageView toMessageView(DirectMessage message) {
        return new ChatDtos.MessageView(
                message.getId(),
                message.getConversationId(),
                toUserSummary(message.getSender()),
                toUserSummary(message.getReceiver()),
                message.getContent(),
                message.isRead(),
                message.getCreatedAt()
        );
    }

    public ProjectDtos.ProjectTaskView toTaskView(ProjectTask task) {
        return new ProjectDtos.ProjectTaskView(
                task.getId(),
                task.getTitle(),
                task.isCompleted(),
                task.getPriority(),
                toUserSummary(task.getAssignee()),
                task.getDueDate()
        );
    }

    public ProjectDtos.ProjectUpdateView toUpdateView(ProjectUpdate update) {
        return new ProjectDtos.ProjectUpdateView(
                update.getId(),
                toUserSummary(update.getAuthor()),
                update.getText(),
                update.getCreatedAt()
        );
    }

    public ProjectDtos.ProjectMessageView toProjectMessageView(ProjectMessage message) {
        return new ProjectDtos.ProjectMessageView(
                message.getId(),
                toUserSummary(message.getAuthor()),
                message.getText(),
                message.getCreatedAt()
        );
    }

    public ProjectDtos.ProjectRequestView toProjectRequestView(ProjectRequest request) {
        return new ProjectDtos.ProjectRequestView(
                request.getId(),
                request.getType().name(),
                request.getStatus().name(),
                toUserSummary(request.getSender()),
                toUserSummary(request.getReceiver()),
                request.getProject().getId(),
                request.getProject().getName(),
                request.getCreatedAt(),
                request.getRespondedAt()
        );
    }

    public ProjectDtos.ProjectView toProjectView(Project project,
                                                 List<ProjectTask> tasks,
                                                 List<ProjectUpdate> updates,
                                                 List<ProjectMessage> messages,
                                                 String membership) {
        List<UserDtos.UserSummary> members = project.getMembers().stream()
                .map(this::toUserSummary)
                .sorted(Comparator.comparing(UserDtos.UserSummary::fullName))
                .toList();

        return new ProjectDtos.ProjectView(
                project.getId(),
                project.getName(),
                project.getTagline(),
                project.getDescription(),
                project.getCategory(),
                project.getStatus(),
                project.getVisibility(),
                project.getRepoUrl(),
                project.getBudget(),
                project.getProgress(),
                project.getDueDate(),
                toUserSummary(project.getOwner()),
                members,
                nullSafeList(project.getRequiredSkills()),
                nullSafeList(project.getLookingFor()),
                tasks.stream().map(this::toTaskView).toList(),
                updates.stream().map(this::toUpdateView).toList(),
                messages.stream().map(this::toProjectMessageView).toList(),
                membership
        );
    }

    public DashboardDtos.NotificationView toNotificationView(Notification notification) {
        return new DashboardDtos.NotificationView(
                notification.getId(),
                notification.getType().name(),
                notification.getTitle(),
                notification.getText(),
                notification.getActionPath(),
                notification.isUnread(),
                notification.getCreatedAt()
        );
    }

    public SettingsDtos.SettingsView toSettingsView(UserSettings settings) {
        return new SettingsDtos.SettingsView(
                settings.getProfileVisibility(),
                settings.isShowEmail(),
                settings.isLoginAlerts(),
                settings.isTwoFactorEnabled(),
                settings.isOpenToConnections(),
                settings.isShowAvailability(),
                settings.isAllowProjectInvites(),
                settings.isPushEnabled(),
                settings.isPushMessages(),
                settings.isPushProjectUpdates(),
                settings.isPushFriendRequests(),
                settings.isEmailEnabled(),
                settings.isWeeklyDigest(),
                settings.getTheme(),
                settings.getAccentColor(),
                settings.isCompactMode(),
                settings.isAnimations(),
                readIntegrations(settings.getIntegrationJson())
        );
    }

    public String writeIntegrations(List<SettingsDtos.IntegrationView> integrations) {
        try {
            return objectMapper.writeValueAsString(integrations);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Failed to serialize integrations", exception);
        }
    }

    public List<SettingsDtos.IntegrationView> readIntegrations(String json) {
        if (json == null || json.isBlank()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<>() {
            });
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Failed to deserialize integrations", exception);
        }
    }

    public DashboardDtos.TimelineItem toTimelineItem(String id, String user, String action, String target, java.time.Instant time, String type) {
        return new DashboardDtos.TimelineItem(id, user, action, target, time, initials(user), type);
    }

    private List<String> nullSafeList(List<String> values) {
        return values == null ? Collections.emptyList() : values;
    }

    private String initials(String name) {
        if (name == null || name.isBlank()) {
            return "U";
        }
        return List.of(name.split(" ")).stream()
                .filter(part -> !part.isBlank())
                .map(part -> String.valueOf(part.charAt(0)))
                .limit(2)
                .reduce("", String::concat)
                .toUpperCase();
    }
}
