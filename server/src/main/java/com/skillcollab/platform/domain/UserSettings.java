package com.skillcollab.platform.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_settings")
public class UserSettings {

    @Id
    private String id;

    @OneToOne(optional = false)
    private UserAccount user;

    private String profileVisibility;
    private boolean showEmail;
    private boolean loginAlerts;
    private boolean twoFactorEnabled;
    private boolean openToConnections;
    private boolean showAvailability;
    private boolean allowProjectInvites;
    private boolean pushEnabled;
    private boolean pushMessages;
    private boolean pushProjectUpdates;
    private boolean pushFriendRequests;
    private boolean emailEnabled;
    private boolean weeklyDigest;
    private String theme;
    private String accentColor;
    private boolean compactMode;
    private boolean animations;

    @Column(length = 4000)
    private String integrationJson;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public UserAccount getUser() {
        return user;
    }

    public void setUser(UserAccount user) {
        this.user = user;
    }

    public String getProfileVisibility() {
        return profileVisibility;
    }

    public void setProfileVisibility(String profileVisibility) {
        this.profileVisibility = profileVisibility;
    }

    public boolean isShowEmail() {
        return showEmail;
    }

    public void setShowEmail(boolean showEmail) {
        this.showEmail = showEmail;
    }

    public boolean isLoginAlerts() {
        return loginAlerts;
    }

    public void setLoginAlerts(boolean loginAlerts) {
        this.loginAlerts = loginAlerts;
    }

    public boolean isTwoFactorEnabled() {
        return twoFactorEnabled;
    }

    public void setTwoFactorEnabled(boolean twoFactorEnabled) {
        this.twoFactorEnabled = twoFactorEnabled;
    }

    public boolean isOpenToConnections() {
        return openToConnections;
    }

    public void setOpenToConnections(boolean openToConnections) {
        this.openToConnections = openToConnections;
    }

    public boolean isShowAvailability() {
        return showAvailability;
    }

    public void setShowAvailability(boolean showAvailability) {
        this.showAvailability = showAvailability;
    }

    public boolean isAllowProjectInvites() {
        return allowProjectInvites;
    }

    public void setAllowProjectInvites(boolean allowProjectInvites) {
        this.allowProjectInvites = allowProjectInvites;
    }

    public boolean isPushEnabled() {
        return pushEnabled;
    }

    public void setPushEnabled(boolean pushEnabled) {
        this.pushEnabled = pushEnabled;
    }

    public boolean isPushMessages() {
        return pushMessages;
    }

    public void setPushMessages(boolean pushMessages) {
        this.pushMessages = pushMessages;
    }

    public boolean isPushProjectUpdates() {
        return pushProjectUpdates;
    }

    public void setPushProjectUpdates(boolean pushProjectUpdates) {
        this.pushProjectUpdates = pushProjectUpdates;
    }

    public boolean isPushFriendRequests() {
        return pushFriendRequests;
    }

    public void setPushFriendRequests(boolean pushFriendRequests) {
        this.pushFriendRequests = pushFriendRequests;
    }

    public boolean isEmailEnabled() {
        return emailEnabled;
    }

    public void setEmailEnabled(boolean emailEnabled) {
        this.emailEnabled = emailEnabled;
    }

    public boolean isWeeklyDigest() {
        return weeklyDigest;
    }

    public void setWeeklyDigest(boolean weeklyDigest) {
        this.weeklyDigest = weeklyDigest;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public String getAccentColor() {
        return accentColor;
    }

    public void setAccentColor(String accentColor) {
        this.accentColor = accentColor;
    }

    public boolean isCompactMode() {
        return compactMode;
    }

    public void setCompactMode(boolean compactMode) {
        this.compactMode = compactMode;
    }

    public boolean isAnimations() {
        return animations;
    }

    public void setAnimations(boolean animations) {
        this.animations = animations;
    }

    public String getIntegrationJson() {
        return integrationJson;
    }

    public void setIntegrationJson(String integrationJson) {
        this.integrationJson = integrationJson;
    }

    @PrePersist
    void prePersist() {
        if (id == null) {
            id = EntityIds.next("settings");
        }
    }
}
