package com.skillcollab.platform.dto;

import java.time.Instant;
import java.util.List;

public final class DashboardDtos {

    private DashboardDtos() {
    }

    public record MetricCard(
            int current,
            int target,
            int growth
    ) {
    }

    public record TimelineItem(
            String id,
            String user,
            String action,
            String target,
            Instant time,
            String avatar,
            String type
    ) {
    }

    public record NotificationView(
            String id,
            String type,
            String title,
            String text,
            String actionPath,
            boolean unread,
            Instant createdAt
    ) {
    }

    public record DashboardSnapshot(
            UserDtos.UserSummary profile,
            MetricCard projectsActive,
            MetricCard collaborators,
            MetricCard tasksDone,
            MetricCard profileStrength,
            List<UserDtos.ConnectionRequestView> pendingRequests,
            List<ProjectDtos.ProjectRequestView> projectInvites,
            List<ProjectDtos.ProjectRequestView> incomingProjectRequests,
            List<UserDtos.UserSummary> connections,
            List<NotificationView> notifications,
            List<TimelineItem> timeline,
            List<ProjectDtos.ProjectView> myProjects,
            ProjectDtos.ProjectView activeProject
    ) {
    }
}
