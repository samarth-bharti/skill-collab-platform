package com.skillcollab.platform.service;

import com.skillcollab.platform.domain.ConnectionRequest;
import com.skillcollab.platform.domain.ConnectionRequestStatus;
import com.skillcollab.platform.domain.UserAccount;
import com.skillcollab.platform.dto.UserDtos;
import com.skillcollab.platform.exception.ApiException;
import com.skillcollab.platform.repository.ConnectionRequestRepository;
import com.skillcollab.platform.repository.UserAccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class UserService {

    private final UserAccountRepository userAccountRepository;
    private final ConnectionRequestRepository connectionRequestRepository;
    private final DtoMapper dtoMapper;

    public UserService(UserAccountRepository userAccountRepository,
                       ConnectionRequestRepository connectionRequestRepository,
                       DtoMapper dtoMapper) {
        this.userAccountRepository = userAccountRepository;
        this.connectionRequestRepository = connectionRequestRepository;
        this.dtoMapper = dtoMapper;
    }

    @Transactional(readOnly = true)
    public UserAccount findById(String userId) {
        return userAccountRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found."));
    }

    @Transactional(readOnly = true)
    public UserDtos.UserSummary getProfile(UserAccount user) {
        return dtoMapper.toUserSummary(user);
    }

    @Transactional(readOnly = true)
    public List<UserDtos.UserSummary> discover(UserAccount currentUser, String query) {
        String normalized = query == null ? "" : query.toLowerCase(Locale.ROOT);
        return userAccountRepository.findAll().stream()
                .filter(user -> !user.getId().equals(currentUser.getId()))
                .filter(user -> normalized.isBlank()
                        || user.getFullName().toLowerCase(Locale.ROOT).contains(normalized)
                        || user.getRole().toLowerCase(Locale.ROOT).contains(normalized)
                        || user.getTopSkills().stream().anyMatch(skill -> skill.toLowerCase(Locale.ROOT).contains(normalized)))
                .map(dtoMapper::toUserSummary)
                .sorted(Comparator.comparing(UserDtos.UserSummary::fullName))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserDtos.UserSummary> getConnections(UserAccount currentUser) {
        Set<UserAccount> connected = new LinkedHashSet<>();
        connectionRequestRepository.findByStatusAndSenderOrStatusAndReceiver(
                        ConnectionRequestStatus.ACCEPTED,
                        currentUser,
                        ConnectionRequestStatus.ACCEPTED,
                        currentUser
                )
                .forEach(request -> {
                    if (request.getSender().getId().equals(currentUser.getId())) {
                        connected.add(request.getReceiver());
                    } else {
                        connected.add(request.getSender());
                    }
                });

        return connected.stream()
                .map(dtoMapper::toUserSummary)
                .sorted(Comparator.comparing(UserDtos.UserSummary::fullName))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserDtos.ConnectionRequestView> getPendingRequests(UserAccount currentUser) {
        return connectionRequestRepository.findByReceiverAndStatusOrderByCreatedAtDesc(currentUser, ConnectionRequestStatus.PENDING)
                .stream()
                .map(dtoMapper::toConnectionRequestView)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserDtos.ConnectionRequestView> getSentRequests(UserAccount currentUser) {
        return connectionRequestRepository.findBySenderAndStatusOrderByCreatedAtDesc(currentUser, ConnectionRequestStatus.PENDING)
                .stream()
                .map(dtoMapper::toConnectionRequestView)
                .toList();
    }

    @Transactional
    public UserDtos.UserSummary updateProfile(UserAccount currentUser, UserDtos.UpdateProfileRequest request) {
        currentUser.setFullName(request.fullName());
        currentUser.setRole(request.role());
        currentUser.setBio(request.bio());
        currentUser.setLocation(request.location());
        currentUser.setCollege(request.college());
        currentUser.setAvailability(request.availability());
        currentUser.setHeadline(request.headline());
        currentUser.setGithub(request.github());
        currentUser.setLinkedin(request.linkedin());
        currentUser.setTwitter(request.twitter());
        currentUser.setTopSkills(request.skills() == null ? List.of() : request.skills());
        currentUser.setInterests(request.interests() == null ? List.of() : request.interests());
        userAccountRepository.save(currentUser);
        return dtoMapper.toUserSummary(currentUser);
    }

    public ConnectionRequest getConnectionRequest(String id) {
        return connectionRequestRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Connection request not found."));
    }
}
