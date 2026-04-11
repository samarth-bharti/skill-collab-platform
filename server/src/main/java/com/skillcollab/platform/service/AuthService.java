package com.skillcollab.platform.service;

import com.skillcollab.platform.domain.PasswordResetToken;
import com.skillcollab.platform.domain.UserAccount;
import com.skillcollab.platform.domain.UserSettings;
import com.skillcollab.platform.dto.AuthDtos;
import com.skillcollab.platform.dto.SettingsDtos;
import com.skillcollab.platform.exception.ApiException;
import com.skillcollab.platform.repository.PasswordResetTokenRepository;
import com.skillcollab.platform.repository.UserAccountRepository;
import com.skillcollab.platform.repository.UserSettingsRepository;
import com.skillcollab.platform.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final DtoMapper dtoMapper;

    public AuthService(UserAccountRepository userAccountRepository,
                       UserSettingsRepository userSettingsRepository,
                       PasswordResetTokenRepository passwordResetTokenRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       DtoMapper dtoMapper) {
        this.userAccountRepository = userAccountRepository;
        this.userSettingsRepository = userSettingsRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.dtoMapper = dtoMapper;
    }

    @Transactional
    public AuthDtos.AuthResponse signup(AuthDtos.SignupRequest request) {
        userAccountRepository.findByEmailIgnoreCase(request.email()).ifPresent(existing -> {
            throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists.");
        });

        UserAccount user = new UserAccount();
        user.setEmail(request.email().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName());
        user.setRole("Student Builder");
        user.setStatus("online");
        user.setLocation("");
        user.setCollege("");
        user.setHeadline("");
        user.setBio("");
        user.setAvailability("Open to collaborating");
        user.setTopSkills(List.of());
        user.setInterests(List.of());
        userAccountRepository.save(user);
        userSettingsRepository.save(defaultSettings(user));

        return new AuthDtos.AuthResponse(jwtService.generateToken(user.getId()), dtoMapper.toUserSummary(user));
    }

    @Transactional(readOnly = true)
    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        UserAccount user = userAccountRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password."));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }
        return new AuthDtos.AuthResponse(jwtService.generateToken(user.getId()), dtoMapper.toUserSummary(user));
    }

    @Transactional
    public AuthDtos.PasswordResetResponse requestPasswordReset(AuthDtos.ForgotPasswordRequest request) {
        UserAccount user = userAccountRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "No account matches that email address."));

        PasswordResetToken token = passwordResetTokenRepository.findTopByUserOrderByExpiresAtDesc(user)
                .orElseGet(PasswordResetToken::new);
        token.setUser(user);
        token.setSecret(UUID.randomUUID().toString().replace("-", "").substring(0, 8));
        token.setExpiresAt(Instant.now().plus(30, ChronoUnit.MINUTES));
        token.setUsed(false);
        passwordResetTokenRepository.save(token);

        return new AuthDtos.PasswordResetResponse(true, user.getEmail(), token.getSecret());
    }

    @Transactional
    public AuthDtos.PasswordResetResponse resetPassword(AuthDtos.ResetPasswordRequest request) {
        UserAccount user = userAccountRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Reset request not found."));
        PasswordResetToken token = passwordResetTokenRepository.findByUserAndSecretAndUsedIsFalse(user, request.secret())
                .filter(candidate -> candidate.getExpiresAt().isAfter(Instant.now()))
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Reset request not found."));

        user.setPasswordHash(passwordEncoder.encode(request.password()));
        token.setUsed(true);
        userAccountRepository.save(user);
        passwordResetTokenRepository.save(token);

        return new AuthDtos.PasswordResetResponse(true, user.getEmail(), request.secret());
    }

    private UserSettings defaultSettings(UserAccount user) {
        UserSettings settings = new UserSettings();
        settings.setUser(user);
        settings.setProfileVisibility("community");
        settings.setShowEmail(false);
        settings.setLoginAlerts(true);
        settings.setTwoFactorEnabled(false);
        settings.setOpenToConnections(true);
        settings.setShowAvailability(true);
        settings.setAllowProjectInvites(true);
        settings.setPushEnabled(true);
        settings.setPushMessages(true);
        settings.setPushProjectUpdates(true);
        settings.setPushFriendRequests(true);
        settings.setEmailEnabled(false);
        settings.setWeeklyDigest(true);
        settings.setTheme("dark");
        settings.setAccentColor("green");
        settings.setCompactMode(false);
        settings.setAnimations(true);
        settings.setIntegrationJson(dtoMapper.writeIntegrations(List.of(
                new SettingsDtos.IntegrationView("GitHub", true, "student-builder"),
                new SettingsDtos.IntegrationView("LinkedIn", false, ""),
                new SettingsDtos.IntegrationView("Portfolio", false, "")
        )));
        return settings;
    }
}
