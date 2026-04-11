package com.skillcollab.platform.service;

import com.skillcollab.platform.domain.NotificationType;
import com.skillcollab.platform.domain.Project;
import com.skillcollab.platform.domain.ProjectMessage;
import com.skillcollab.platform.domain.ProjectRequest;
import com.skillcollab.platform.domain.ProjectRequestStatus;
import com.skillcollab.platform.domain.ProjectRequestType;
import com.skillcollab.platform.domain.ProjectTask;
import com.skillcollab.platform.domain.ProjectUpdate;
import com.skillcollab.platform.domain.UserAccount;
import com.skillcollab.platform.dto.ProjectDtos;
import com.skillcollab.platform.exception.ApiException;
import com.skillcollab.platform.repository.ProjectMessageRepository;
import com.skillcollab.platform.repository.ProjectRepository;
import com.skillcollab.platform.repository.ProjectRequestRepository;
import com.skillcollab.platform.repository.ProjectTaskRepository;
import com.skillcollab.platform.repository.ProjectUpdateRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectTaskRepository projectTaskRepository;
    private final ProjectUpdateRepository projectUpdateRepository;
    private final ProjectMessageRepository projectMessageRepository;
    private final ProjectRequestRepository projectRequestRepository;
    private final UserService userService;
    private final NotificationService notificationService;
    private final DtoMapper dtoMapper;

    public ProjectService(ProjectRepository projectRepository,
                          ProjectTaskRepository projectTaskRepository,
                          ProjectUpdateRepository projectUpdateRepository,
                          ProjectMessageRepository projectMessageRepository,
                          ProjectRequestRepository projectRequestRepository,
                          UserService userService,
                          NotificationService notificationService,
                          DtoMapper dtoMapper) {
        this.projectRepository = projectRepository;
        this.projectTaskRepository = projectTaskRepository;
        this.projectUpdateRepository = projectUpdateRepository;
        this.projectMessageRepository = projectMessageRepository;
        this.projectRequestRepository = projectRequestRepository;
        this.userService = userService;
        this.notificationService = notificationService;
        this.dtoMapper = dtoMapper;
    }

    @Transactional(readOnly = true)
    public List<ProjectDtos.ProjectView> getProjects(UserAccount currentUser) {
        return projectRepository.findAll().stream()
                .sorted(Comparator.comparing(Project::getCreatedAt).reversed())
                .map(project -> toProjectView(project, membership(project, currentUser)))
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectDtos.ProjectView getProject(UserAccount currentUser, String projectId) {
        Project project = entity(projectId);
        return toProjectView(project, membership(project, currentUser));
    }

    @Transactional
    public ProjectDtos.ProjectView createProject(UserAccount currentUser, ProjectDtos.CreateProjectRequest request) {
        Project project = new Project();
        project.setName(request.name());
        project.setTagline(request.tagline());
        project.setDescription(request.description());
        project.setCategory(request.category());
        project.setStatus(request.status() == null || request.status().isBlank() ? "Planning" : request.status());
        project.setVisibility(request.visibility() == null || request.visibility().isBlank() ? "Public" : request.visibility());
        project.setOwner(currentUser);
        project.setMembers(Set.of(currentUser));
        project.setRequiredSkills(request.requiredSkills());
        project.setLookingFor(request.lookingFor());
        project.setDueDate(request.dueDate());
        project.setBudget(request.budget());
        project.setRepoUrl(request.repoUrl());
        project.setProgress(0);
        projectRepository.save(project);

        ProjectUpdate update = new ProjectUpdate();
        update.setProject(project);
        update.setAuthor(currentUser);
        update.setText("Project created and workspace opened for collaborators.");
        projectUpdateRepository.save(update);

        return toProjectView(project, "owner");
    }

    @Transactional
    public ProjectDtos.ProjectTaskView addTask(UserAccount currentUser, String projectId, ProjectDtos.AddTaskRequest request) {
        Project project = entity(projectId);
        requireMember(project, currentUser);

        ProjectTask task = new ProjectTask();
        task.setProject(project);
        task.setTitle(request.title());
        task.setPriority(request.priority() == null || request.priority().isBlank() ? "Medium" : request.priority());
        task.setDueDate(request.dueDate());
        if (request.assigneeId() != null && !request.assigneeId().isBlank()) {
            task.setAssignee(userService.findById(request.assigneeId()));
        }
        projectTaskRepository.save(task);
        updateProjectProgress(project);
        return dtoMapper.toTaskView(task);
    }

    @Transactional
    public ProjectDtos.ProjectView toggleTask(UserAccount currentUser, String projectId, String taskId) {
        Project project = entity(projectId);
        requireMember(project, currentUser);

        ProjectTask task = projectTaskRepository.findById(taskId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Task not found."));
        if (!task.getProject().getId().equals(project.getId())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Task does not belong to this project.");
        }
        task.setCompleted(!task.isCompleted());
        projectTaskRepository.save(task);
        updateProjectProgress(project);
        return toProjectView(project, membership(project, currentUser));
    }

    @Transactional
    public ProjectDtos.ProjectUpdateView addUpdate(UserAccount currentUser, String projectId, ProjectDtos.AddUpdateRequest request) {
        Project project = entity(projectId);
        requireMember(project, currentUser);

        ProjectUpdate update = new ProjectUpdate();
        update.setProject(project);
        update.setAuthor(currentUser);
        update.setText(request.text());
        projectUpdateRepository.save(update);
        return dtoMapper.toUpdateView(update);
    }

    @Transactional(readOnly = true)
    public List<ProjectDtos.ProjectMessageView> getMessages(UserAccount currentUser, String projectId) {
        Project project = entity(projectId);
        requireMember(project, currentUser);
        return projectMessageRepository.findByProjectOrderByCreatedAtAsc(project).stream()
                .map(dtoMapper::toProjectMessageView)
                .toList();
    }

    @Transactional
    public ProjectDtos.ProjectMessageView sendMessage(UserAccount currentUser, String projectId, String text) {
        Project project = entity(projectId);
        requireMember(project, currentUser);

        ProjectMessage message = new ProjectMessage();
        message.setProject(project);
        message.setAuthor(currentUser);
        message.setText(text);
        projectMessageRepository.save(message);
        return dtoMapper.toProjectMessageView(message);
    }

    @Transactional
    public ProjectDtos.ProjectRequestView requestToJoin(UserAccount currentUser, String projectId) {
        Project project = entity(projectId);
        if (project.getMembers().stream().anyMatch(member -> member.getId().equals(currentUser.getId()))) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "You are already a member.");
        }
        projectRequestRepository.findByProjectAndSenderAndReceiverAndTypeAndStatus(
                project,
                currentUser,
                project.getOwner(),
                ProjectRequestType.JOIN_REQUEST,
                ProjectRequestStatus.PENDING
        ).ifPresent(existing -> {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Join request already sent.");
        });

        ProjectRequest request = new ProjectRequest();
        request.setProject(project);
        request.setSender(currentUser);
        request.setReceiver(project.getOwner());
        request.setType(ProjectRequestType.JOIN_REQUEST);
        projectRequestRepository.save(request);

        notificationService.notify(
                project.getOwner(),
                NotificationType.PROJECT_REQUEST,
                "New project join request",
                currentUser.getFullName() + " wants to join " + project.getName() + ".",
                "/dashboard/projects/" + project.getId()
        );

        return dtoMapper.toProjectRequestView(request);
    }

    @Transactional
    public ProjectDtos.ProjectRequestView invite(UserAccount currentUser, String projectId, String userId) {
        Project project = entity(projectId);
        requireOwner(project, currentUser);
        UserAccount target = userService.findById(userId);
        if (project.getMembers().stream().anyMatch(member -> member.getId().equals(target.getId()))) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "User is already a project member.");
        }
        projectRequestRepository.findByProjectAndSenderAndReceiverAndTypeAndStatus(
                project,
                currentUser,
                target,
                ProjectRequestType.INVITE,
                ProjectRequestStatus.PENDING
        ).ifPresent(existing -> {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invite already sent.");
        });

        ProjectRequest request = new ProjectRequest();
        request.setProject(project);
        request.setSender(currentUser);
        request.setReceiver(target);
        request.setType(ProjectRequestType.INVITE);
        projectRequestRepository.save(request);

        notificationService.notify(
                target,
                NotificationType.PROJECT_INVITE,
                "Project invite",
                currentUser.getFullName() + " invited you to join " + project.getName() + ".",
                "/dashboard/projects/" + project.getId()
        );

        return dtoMapper.toProjectRequestView(request);
    }

    @Transactional(readOnly = true)
    public List<ProjectDtos.ProjectRequestView> getIncomingJoinRequests(UserAccount currentUser) {
        return projectRepository.findDistinctByMembersContainingOrOwnerOrderByCreatedAtDesc(currentUser, currentUser).stream()
                .filter(project -> project.getOwner().getId().equals(currentUser.getId()))
                .flatMap(project -> projectRequestRepository
                        .findByProjectAndReceiverAndTypeAndStatusOrderByCreatedAtDesc(project, currentUser, ProjectRequestType.JOIN_REQUEST, ProjectRequestStatus.PENDING)
                        .stream())
                .map(dtoMapper::toProjectRequestView)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProjectDtos.ProjectRequestView> getInvites(UserAccount currentUser) {
        return projectRequestRepository.findByReceiverAndTypeAndStatusOrderByCreatedAtDesc(
                        currentUser,
                        ProjectRequestType.INVITE,
                        ProjectRequestStatus.PENDING
                ).stream()
                .map(dtoMapper::toProjectRequestView)
                .toList();
    }

    @Transactional
    public ProjectDtos.ProjectRequestView respondToRequest(UserAccount currentUser, String requestId, boolean accept) {
        ProjectRequest request = projectRequestRepository.findById(requestId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Project request not found."));
        if (!request.getReceiver().getId().equals(currentUser.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You cannot respond to this request.");
        }

        request.setStatus(accept ? ProjectRequestStatus.ACCEPTED : ProjectRequestStatus.DECLINED);
        request.setRespondedAt(Instant.now());
        projectRequestRepository.save(request);

        if (accept) {
            Project project = request.getProject();
            UserAccount memberToAdd = request.getType() == ProjectRequestType.INVITE ? request.getReceiver() : request.getSender();
            project.getMembers().add(memberToAdd);
            projectRepository.save(project);

            notificationService.notify(
                    request.getSender(),
                    NotificationType.PROJECT,
                    request.getType() == ProjectRequestType.INVITE ? "Invite accepted" : "Join request approved",
                    currentUser.getFullName() + " approved access to " + project.getName() + ".",
                    "/dashboard/projects/" + project.getId()
            );
        }
        return dtoMapper.toProjectRequestView(request);
    }

    @Transactional(readOnly = true)
    public String membership(Project project, UserAccount user) {
        if (project.getOwner().getId().equals(user.getId())) {
            return "owner";
        }
        if (project.getMembers().stream().anyMatch(member -> member.getId().equals(user.getId()))) {
            return "member";
        }
        boolean requested = projectRequestRepository.findByProjectAndSenderAndReceiverAndTypeAndStatus(
                project,
                user,
                project.getOwner(),
                ProjectRequestType.JOIN_REQUEST,
                ProjectRequestStatus.PENDING
        ).isPresent();
        if (requested) {
            return "requested";
        }
        boolean invited = projectRequestRepository.findByProjectAndSenderAndReceiverAndTypeAndStatus(
                project,
                project.getOwner(),
                user,
                ProjectRequestType.INVITE,
                ProjectRequestStatus.PENDING
        ).isPresent();
        if (invited) {
            return "invited";
        }
        return "visitor";
    }

    @Transactional(readOnly = true)
    public Project entity(String projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Project not found."));
    }

    private ProjectDtos.ProjectView toProjectView(Project project, String membership) {
        List<ProjectTask> tasks = projectTaskRepository.findByProjectOrderByCreatedAtAsc(project);
        List<ProjectUpdate> updates = projectUpdateRepository.findByProjectOrderByCreatedAtDesc(project);
        List<ProjectMessage> messages = projectMessageRepository.findByProjectOrderByCreatedAtAsc(project);
        return dtoMapper.toProjectView(project, tasks, updates, messages, membership);
    }

    private void updateProjectProgress(Project project) {
        List<ProjectTask> tasks = projectTaskRepository.findByProjectOrderByCreatedAtAsc(project);
        if (tasks.isEmpty()) {
            project.setProgress(0);
        } else {
            long complete = tasks.stream().filter(ProjectTask::isCompleted).count();
            project.setProgress((int) Math.round((complete * 100.0) / tasks.size()));
        }
        projectRepository.save(project);
    }

    private void requireOwner(Project project, UserAccount currentUser) {
        if (!project.getOwner().getId().equals(currentUser.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the project owner can perform this action.");
        }
    }

    private void requireMember(Project project, UserAccount currentUser) {
        if (!project.getMembers().stream().anyMatch(member -> member.getId().equals(currentUser.getId()))
                && !project.getOwner().getId().equals(currentUser.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You must join the project first.");
        }
    }
}
