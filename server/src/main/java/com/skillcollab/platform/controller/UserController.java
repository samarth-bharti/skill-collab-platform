package com.skillcollab.platform.controller;

import com.skillcollab.platform.dto.UserDtos;
import com.skillcollab.platform.service.ConnectionService;
import com.skillcollab.platform.service.CurrentUserService;
import com.skillcollab.platform.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final CurrentUserService currentUserService;
    private final UserService userService;
    private final ConnectionService connectionService;

    public UserController(CurrentUserService currentUserService, UserService userService, ConnectionService connectionService) {
        this.currentUserService = currentUserService;
        this.userService = userService;
        this.connectionService = connectionService;
    }

    @GetMapping("/me")
    public UserDtos.UserSummary me() {
        return userService.getProfile(currentUserService.requireCurrentUser());
    }

    @PutMapping("/me/profile")
    public UserDtos.UserSummary updateProfile(@Valid @RequestBody UserDtos.UpdateProfileRequest request) {
        return userService.updateProfile(currentUserService.requireCurrentUser(), request);
    }

    @GetMapping("/discover")
    public List<UserDtos.UserSummary> discover(@RequestParam(required = false, defaultValue = "") String q) {
        return userService.discover(currentUserService.requireCurrentUser(), q);
    }

    @GetMapping("/connections")
    public List<UserDtos.UserSummary> connections() {
        return userService.getConnections(currentUserService.requireCurrentUser());
    }

    @GetMapping("/requests/pending")
    public List<UserDtos.ConnectionRequestView> pendingRequests() {
        return userService.getPendingRequests(currentUserService.requireCurrentUser());
    }

    @GetMapping("/requests/sent")
    public List<UserDtos.ConnectionRequestView> sentRequests() {
        return userService.getSentRequests(currentUserService.requireCurrentUser());
    }

    @PostMapping("/{userId}/friend-request")
    public UserDtos.ConnectionRequestView sendFriendRequest(@PathVariable String userId) {
        return connectionService.sendRequest(currentUserService.requireCurrentUser(), userId);
    }

    @PatchMapping("/friend-requests/{requestId}/accept")
    public UserDtos.ConnectionRequestView acceptFriendRequest(@PathVariable String requestId) {
        return connectionService.respond(currentUserService.requireCurrentUser(), requestId, true);
    }

    @PatchMapping("/friend-requests/{requestId}/decline")
    public UserDtos.ConnectionRequestView declineFriendRequest(@PathVariable String requestId) {
        return connectionService.respond(currentUserService.requireCurrentUser(), requestId, false);
    }
}
