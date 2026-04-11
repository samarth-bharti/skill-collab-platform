package com.skillcollab.platform.dto;

import java.util.List;

public final class SettingsDtos {

    private SettingsDtos() {
    }

    public record IntegrationView(
            String service,
            boolean connected,
            String username
    ) {
    }

    public record SettingsView(
            String profileVisibility,
            boolean showEmail,
            boolean loginAlerts,
            boolean twoFactorEnabled,
            boolean openToConnections,
            boolean showAvailability,
            boolean allowProjectInvites,
            boolean pushEnabled,
            boolean pushMessages,
            boolean pushProjectUpdates,
            boolean pushFriendRequests,
            boolean emailEnabled,
            boolean weeklyDigest,
            String theme,
            String accentColor,
            boolean compactMode,
            boolean animations,
            List<IntegrationView> integrations
    ) {
    }
}
