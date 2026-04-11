package com.skillcollab.platform.service;

import com.skillcollab.platform.domain.Notification;
import com.skillcollab.platform.domain.NotificationType;
import com.skillcollab.platform.domain.UserAccount;
import com.skillcollab.platform.dto.DashboardDtos;
import com.skillcollab.platform.exception.ApiException;
import com.skillcollab.platform.repository.NotificationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final DtoMapper dtoMapper;

    public NotificationService(NotificationRepository notificationRepository, DtoMapper dtoMapper) {
        this.notificationRepository = notificationRepository;
        this.dtoMapper = dtoMapper;
    }

    @Transactional
    public void notify(UserAccount user, NotificationType type, String title, String text, String actionPath) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setText(text);
        notification.setActionPath(actionPath);
        notification.setUnread(true);
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<DashboardDtos.NotificationView> getNotifications(UserAccount user) {
        return notificationRepository.findTop25ByUserOrderByCreatedAtDesc(user).stream()
                .map(dtoMapper::toNotificationView)
                .toList();
    }

    @Transactional
    public List<DashboardDtos.NotificationView> markAsRead(UserAccount user, String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Notification not found."));
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You cannot modify this notification.");
        }
        notification.setUnread(false);
        notificationRepository.save(notification);
        return getNotifications(user);
    }
}
