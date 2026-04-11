package com.skillcollab.platform.controller;

import com.skillcollab.platform.dto.SettingsDtos;
import com.skillcollab.platform.service.CurrentUserService;
import com.skillcollab.platform.service.SettingsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final CurrentUserService currentUserService;
    private final SettingsService settingsService;

    public SettingsController(CurrentUserService currentUserService, SettingsService settingsService) {
        this.currentUserService = currentUserService;
        this.settingsService = settingsService;
    }

    @GetMapping("/me")
    public SettingsDtos.SettingsView getSettings() {
        return settingsService.getSettings(currentUserService.requireCurrentUser());
    }

    @PutMapping("/me")
    public SettingsDtos.SettingsView updateSettings(@RequestBody SettingsDtos.SettingsView request) {
        return settingsService.updateSettings(currentUserService.requireCurrentUser(), request);
    }
}
