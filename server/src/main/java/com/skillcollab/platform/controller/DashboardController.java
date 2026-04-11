package com.skillcollab.platform.controller;

import com.skillcollab.platform.dto.DashboardDtos;
import com.skillcollab.platform.service.CurrentUserService;
import com.skillcollab.platform.service.DashboardService;
import com.skillcollab.platform.service.NotificationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DashboardController {

    private final CurrentUserService currentUserService;
    private final DashboardService dashboardService;
    private final NotificationService notificationService;

    public DashboardController(CurrentUserService currentUserService,
                               DashboardService dashboardService,
                               NotificationService notificationService) {
        this.currentUserService = currentUserService;
        this.dashboardService = dashboardService;
        this.notificationService = notificationService;
    }

    @GetMapping("/dashboard")
    public DashboardDtos.DashboardSnapshot dashboard() {
        return dashboardService.snapshot(currentUserService.requireCurrentUser());
    }

    @GetMapping("/notifications")
    public List<DashboardDtos.NotificationView> notifications() {
        return notificationService.getNotifications(currentUserService.requireCurrentUser());
    }

    @PatchMapping("/notifications/{notificationId}/read")
    public List<DashboardDtos.NotificationView> markNotificationRead(@PathVariable String notificationId) {
        return notificationService.markAsRead(currentUserService.requireCurrentUser(), notificationId);
    }
}
