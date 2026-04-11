package com.skillcollab.platform.service;

import com.skillcollab.platform.domain.ConnectionRequest;
import com.skillcollab.platform.domain.ConnectionRequestStatus;
import com.skillcollab.platform.domain.Project;
import com.skillcollab.platform.domain.ProjectUpdate;
import com.skillcollab.platform.domain.UserAccount;
import com.skillcollab.platform.dto.DashboardDtos;
import com.skillcollab.platform.dto.ProjectDtos;
import com.skillcollab.platform.dto.UserDtos;
import com.skillcollab.platform.repository.ConnectionRequestRepository;
import com.skillcollab.platform.repository.ProjectRepository;
import com.skillcollab.platform.repository.ProjectTaskRepository;
import com.skillcollab.platform.repository.ProjectUpdateRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class DashboardService {

    private final UserService userService;
    private final ProjectService projectService;
    private final NotificationService notificationService;
    private final ConnectionRequestRepository connectionRequestRepository;
    private final ProjectRepository projectRepository;
    private final ProjectTaskRepository projectTaskRepository;
    private final ProjectUpdateRepository projectUpdateRepository;
    private final DtoMapper dtoMapper;

    public DashboardService(UserService userService,
                            ProjectService projectService,
                            NotificationService notificationService,
                            ConnectionRequestRepository connectionRequestRepository,
                            ProjectRepository projectRepository,
                            ProjectTaskRepository projectTaskRepository,
                            ProjectUpdateRepository projectUpdateRepository,
                            DtoMapper dtoMapper) {
        this.userService = userService;
        this.projectService = projectService;
        this.notificationService = notificationService;
        this.connectionRequestRepository = connectionRequestRepository;
        this.projectRepository = projectRepository;
        this.projectTaskRepository = projectTaskRepository;
        this.projectUpdateRepository = projectUpdateRepository;
        this.dtoMapper = dtoMapper;
    }

    @Transactional(readOnly = true)
    public DashboardDtos.DashboardSnapshot snapshot(UserAccount currentUser) {
        List<Project> myProjects = projectRepository.findDistinctByMembersContainingOrOwnerOrderByCreatedAtDesc(currentUser, currentUser);
        int completedTasks = myProjects.stream()
                .flatMap(project -> projectTaskRepository.findByProjectOrderByCreatedAtAsc(project).stream())
                .mapToInt(task -> task.isCompleted() ? 1 : 0)
                .sum();

        List<ProjectDtos.ProjectView> projectViews = myProjects.stream()
                .map(project -> projectService.getProject(currentUser, project.getId()))
                .toList();

        return new DashboardDtos.DashboardSnapshot(
                userService.getProfile(currentUser),
                new DashboardDtos.MetricCard(myProjects.size(), Math.max(4, myProjects.size() + 1), 12),
                new DashboardDtos.MetricCard(userService.getConnections(currentUser).size(), 8, 18),
                new DashboardDtos.MetricCard(completedTasks, Math.max(10, completedTasks + 3), 9),
                new DashboardDtos.MetricCard(profileStrength(currentUser), 100, 6),
                userService.getPendingRequests(currentUser),
                projectService.getInvites(currentUser),
                projectService.getIncomingJoinRequests(currentUser),
                userService.getConnections(currentUser),
                notificationService.getNotifications(currentUser),
                timeline(currentUser),
                projectViews,
                projectViews.isEmpty() ? null : projectViews.get(0)
        );
    }

    private int profileStrength(UserAccount user) {
        int base = 45;
        if (user.getBio() != null && !user.getBio().isBlank()) {
            base += 15;
        }
        base += Math.min(20, user.getTopSkills().size() * 5);
        if (user.getGithub() != null && !user.getGithub().isBlank()) {
            base += 10;
        }
        if (user.getLinkedin() != null && !user.getLinkedin().isBlank()) {
            base += 10;
        }
        return Math.min(base, 100);
    }

    private List<DashboardDtos.TimelineItem> timeline(UserAccount currentUser) {
        List<DashboardDtos.TimelineItem> items = new ArrayList<>();

        connectionRequestRepository.findByStatusAndSenderOrStatusAndReceiver(
                        ConnectionRequestStatus.ACCEPTED,
                        currentUser,
                        ConnectionRequestStatus.ACCEPTED,
                        currentUser
                )
                .forEach(request -> {
                    UserAccount other = request.getSender().getId().equals(currentUser.getId()) ? request.getReceiver() : request.getSender();
                    items.add(dtoMapper.toTimelineItem(
                            request.getId(),
                            other.getFullName(),
                            "connected with",
                            currentUser.getFullName(),
                            request.getRespondedAt() == null ? request.getCreatedAt() : request.getRespondedAt(),
                            "connection"
                    ));
                });

        projectRepository.findDistinctByMembersContainingOrOwnerOrderByCreatedAtDesc(currentUser, currentUser)
                .forEach(project -> projectUpdateRepository.findByProjectOrderByCreatedAtDesc(project).stream()
                        .limit(3)
                        .map(ProjectUpdate::getAuthor)
                        .forEach(author -> {
                        }));

        projectRepository.findDistinctByMembersContainingOrOwnerOrderByCreatedAtDesc(currentUser, currentUser)
                .forEach(project -> projectUpdateRepository.findByProjectOrderByCreatedAtDesc(project).stream()
                        .limit(3)
                        .forEach(update -> items.add(dtoMapper.toTimelineItem(
                                update.getId(),
                                update.getAuthor().getFullName(),
                                "posted an update in",
                                project.getName(),
                                update.getCreatedAt(),
                                "project"
                        ))));

        return items.stream()
                .sorted(Comparator.comparing(DashboardDtos.TimelineItem::time).reversed())
                .limit(8)
                .toList();
    }
}
