package com.skillcollab.platform.controller;

import com.skillcollab.platform.dto.ChatDtos;
import com.skillcollab.platform.dto.ProjectDtos;
import com.skillcollab.platform.service.CurrentUserService;
import com.skillcollab.platform.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final CurrentUserService currentUserService;
    private final ProjectService projectService;

    public ProjectController(CurrentUserService currentUserService, ProjectService projectService) {
        this.currentUserService = currentUserService;
        this.projectService = projectService;
    }

    @GetMapping
    public List<ProjectDtos.ProjectView> projects() {
        return projectService.getProjects(currentUserService.requireCurrentUser());
    }

    @PostMapping
    public ProjectDtos.ProjectView create(@Valid @RequestBody ProjectDtos.CreateProjectRequest request) {
        return projectService.createProject(currentUserService.requireCurrentUser(), request);
    }

    @GetMapping("/{projectId}")
    public ProjectDtos.ProjectView project(@PathVariable String projectId) {
        return projectService.getProject(currentUserService.requireCurrentUser(), projectId);
    }

    @PostMapping("/{projectId}/tasks")
    public ProjectDtos.ProjectTaskView addTask(@PathVariable String projectId, @Valid @RequestBody ProjectDtos.AddTaskRequest request) {
        return projectService.addTask(currentUserService.requireCurrentUser(), projectId, request);
    }

    @PatchMapping("/{projectId}/tasks/{taskId}/toggle")
    public ProjectDtos.ProjectView toggleTask(@PathVariable String projectId, @PathVariable String taskId) {
        return projectService.toggleTask(currentUserService.requireCurrentUser(), projectId, taskId);
    }

    @PostMapping("/{projectId}/updates")
    public ProjectDtos.ProjectUpdateView addUpdate(@PathVariable String projectId, @Valid @RequestBody ProjectDtos.AddUpdateRequest request) {
        return projectService.addUpdate(currentUserService.requireCurrentUser(), projectId, request);
    }

    @GetMapping("/{projectId}/messages")
    public List<ProjectDtos.ProjectMessageView> messages(@PathVariable String projectId) {
        return projectService.getMessages(currentUserService.requireCurrentUser(), projectId);
    }

    @PostMapping("/{projectId}/messages")
    public ProjectDtos.ProjectMessageView sendMessage(@PathVariable String projectId, @Valid @RequestBody ChatDtos.SendMessageRequest request) {
        return projectService.sendMessage(currentUserService.requireCurrentUser(), projectId, request.content());
    }

    @PostMapping("/{projectId}/join-request")
    public ProjectDtos.ProjectRequestView requestToJoin(@PathVariable String projectId) {
        return projectService.requestToJoin(currentUserService.requireCurrentUser(), projectId);
    }

    @PostMapping("/{projectId}/invite")
    public ProjectDtos.ProjectRequestView invite(@PathVariable String projectId, @Valid @RequestBody ProjectDtos.InviteRequest request) {
        return projectService.invite(currentUserService.requireCurrentUser(), projectId, request.userId());
    }

    @GetMapping("/requests/incoming")
    public List<ProjectDtos.ProjectRequestView> incomingJoinRequests() {
        return projectService.getIncomingJoinRequests(currentUserService.requireCurrentUser());
    }

    @GetMapping("/requests/invites")
    public List<ProjectDtos.ProjectRequestView> invites() {
        return projectService.getInvites(currentUserService.requireCurrentUser());
    }

    @PatchMapping("/requests/{requestId}/accept")
    public ProjectDtos.ProjectRequestView accept(@PathVariable String requestId) {
        return projectService.respondToRequest(currentUserService.requireCurrentUser(), requestId, true);
    }

    @PatchMapping("/requests/{requestId}/decline")
    public ProjectDtos.ProjectRequestView decline(@PathVariable String requestId) {
        return projectService.respondToRequest(currentUserService.requireCurrentUser(), requestId, false);
    }
}
