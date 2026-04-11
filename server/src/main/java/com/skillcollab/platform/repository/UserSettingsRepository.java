package com.skillcollab.platform.repository;

import com.skillcollab.platform.domain.UserAccount;
import com.skillcollab.platform.domain.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserSettingsRepository extends JpaRepository<UserSettings, String> {

    Optional<UserSettings> findByUser(UserAccount user);
}
