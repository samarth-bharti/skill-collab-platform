package com.skillcollab.platform.repository;

import com.skillcollab.platform.domain.Notification;
import com.skillcollab.platform.domain.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, String> {

    List<Notification> findTop25ByUserOrderByCreatedAtDesc(UserAccount user);
}
