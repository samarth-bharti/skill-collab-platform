package com.skillcollab.platform.repository;

import com.skillcollab.platform.domain.DirectMessage;
import com.skillcollab.platform.domain.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DirectMessageRepository extends JpaRepository<DirectMessage, String> {

    List<DirectMessage> findByConversationIdOrderByCreatedAtAsc(String conversationId);

    List<DirectMessage> findBySenderOrReceiverOrderByCreatedAtDesc(UserAccount sender, UserAccount receiver);

    long countByReceiverAndReadIsFalse(UserAccount receiver);
}
