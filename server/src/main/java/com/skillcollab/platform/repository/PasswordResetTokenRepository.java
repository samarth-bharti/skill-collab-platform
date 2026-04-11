package com.skillcollab.platform.repository;

import com.skillcollab.platform.domain.PasswordResetToken;
import com.skillcollab.platform.domain.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, String> {

    Optional<PasswordResetToken> findTopByUserOrderByExpiresAtDesc(UserAccount user);

    Optional<PasswordResetToken> findByUserAndSecretAndUsedIsFalse(UserAccount user, String secret);
}
