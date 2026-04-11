package com.skillcollab.platform.repository;

import com.skillcollab.platform.domain.ConnectionRequest;
import com.skillcollab.platform.domain.ConnectionRequestStatus;
import com.skillcollab.platform.domain.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, String> {

    List<ConnectionRequest> findByReceiverAndStatusOrderByCreatedAtDesc(UserAccount receiver, ConnectionRequestStatus status);

    List<ConnectionRequest> findBySenderAndStatusOrderByCreatedAtDesc(UserAccount sender, ConnectionRequestStatus status);

    List<ConnectionRequest> findByStatusAndSenderOrStatusAndReceiver(ConnectionRequestStatus senderStatus, UserAccount sender,
                                                                     ConnectionRequestStatus receiverStatus, UserAccount receiver);

    Optional<ConnectionRequest> findBySenderAndReceiver(UserAccount sender, UserAccount receiver);
}
