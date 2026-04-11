package com.skillcollab.platform.service;

import com.skillcollab.platform.domain.ConnectionRequest;
import com.skillcollab.platform.domain.ConnectionRequestStatus;
import com.skillcollab.platform.domain.NotificationType;
import com.skillcollab.platform.domain.UserAccount;
import com.skillcollab.platform.dto.UserDtos;
import com.skillcollab.platform.exception.ApiException;
import com.skillcollab.platform.repository.ConnectionRequestRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ConnectionService {

    private final ConnectionRequestRepository connectionRequestRepository;
    private final UserService userService;
    private final DtoMapper dtoMapper;
    private final NotificationService notificationService;

    public ConnectionService(ConnectionRequestRepository connectionRequestRepository,
                             UserService userService,
                             DtoMapper dtoMapper,
                             NotificationService notificationService) {
        this.connectionRequestRepository = connectionRequestRepository;
        this.userService = userService;
        this.dtoMapper = dtoMapper;
        this.notificationService = notificationService;
    }

    @Transactional
    public UserDtos.ConnectionRequestView sendRequest(UserAccount currentUser, String targetUserId) {
        if (currentUser.getId().equals(targetUserId)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "You cannot send a request to yourself.");
        }

        UserAccount target = userService.findById(targetUserId);
        connectionRequestRepository.findBySenderAndReceiver(currentUser, target)
                .ifPresent(existing -> {
                    if (existing.getStatus() != ConnectionRequestStatus.DECLINED) {
                        throw new ApiException(HttpStatus.BAD_REQUEST, "Request already exists.");
                    }
                });

        ConnectionRequest request = new ConnectionRequest();
        request.setSender(currentUser);
        request.setReceiver(target);
        request.setStatus(ConnectionRequestStatus.PENDING);
        connectionRequestRepository.save(request);

        notificationService.notify(
                target,
                NotificationType.REQUEST,
                "New connection request",
                currentUser.getFullName() + " sent you a connection request.",
                "/dashboard/discover"
        );
        return dtoMapper.toConnectionRequestView(request);
    }

    @Transactional
    public UserDtos.ConnectionRequestView respond(UserAccount currentUser, String requestId, boolean accept) {
        ConnectionRequest request = userService.getConnectionRequest(requestId);
        if (!request.getReceiver().getId().equals(currentUser.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You cannot respond to this request.");
        }

        request.setStatus(accept ? ConnectionRequestStatus.ACCEPTED : ConnectionRequestStatus.DECLINED);
        request.setRespondedAt(java.time.Instant.now());
        connectionRequestRepository.save(request);

        if (accept) {
            notificationService.notify(
                    request.getSender(),
                    NotificationType.CONNECTION,
                    "Connection accepted",
                    currentUser.getFullName() + " accepted your connection request.",
                    "/dashboard/chat"
            );
        }
        return dtoMapper.toConnectionRequestView(request);
    }
}
