package com.skillcollab.platform.service;

import com.skillcollab.platform.domain.UserAccount;
import com.skillcollab.platform.domain.UserSettings;
import com.skillcollab.platform.dto.SettingsDtos;
import com.skillcollab.platform.exception.ApiException;
import com.skillcollab.platform.repository.UserSettingsRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SettingsService {

    private final UserSettingsRepository userSettingsRepository;
    private final DtoMapper dtoMapper;

    public SettingsService(UserSettingsRepository userSettingsRepository, DtoMapper dtoMapper) {
        this.userSettingsRepository = userSettingsRepository;
        this.dtoMapper = dtoMapper;
    }

    @Transactional(readOnly = true)
    public SettingsDtos.SettingsView getSettings(UserAccount user) {
        return dtoMapper.toSettingsView(entity(user));
    }

    @Transactional
    public SettingsDtos.SettingsView updateSettings(UserAccount user, SettingsDtos.SettingsView request) {
        UserSettings settings = entity(user);
        settings.setProfileVisibility(request.profileVisibility());
        settings.setShowEmail(request.showEmail());
        settings.setLoginAlerts(request.loginAlerts());
        settings.setTwoFactorEnabled(request.twoFactorEnabled());
        settings.setOpenToConnections(request.openToConnections());
        settings.setShowAvailability(request.showAvailability());
        settings.setAllowProjectInvites(request.allowProjectInvites());
        settings.setPushEnabled(request.pushEnabled());
        settings.setPushMessages(request.pushMessages());
        settings.setPushProjectUpdates(request.pushProjectUpdates());
        settings.setPushFriendRequests(request.pushFriendRequests());
        settings.setEmailEnabled(request.emailEnabled());
        settings.setWeeklyDigest(request.weeklyDigest());
        settings.setTheme(request.theme());
        settings.setAccentColor(request.accentColor());
        settings.setCompactMode(request.compactMode());
        settings.setAnimations(request.animations());
        settings.setIntegrationJson(dtoMapper.writeIntegrations(request.integrations()));
        userSettingsRepository.save(settings);
        return dtoMapper.toSettingsView(settings);
    }

    private UserSettings entity(UserAccount user) {
        return userSettingsRepository.findByUser(user)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User settings not found."));
    }
}
