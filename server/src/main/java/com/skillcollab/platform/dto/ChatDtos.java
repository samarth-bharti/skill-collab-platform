package com.skillcollab.platform.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.Instant;
import java.util.List;

public final class ChatDtos {

    private ChatDtos() {
    }

    public record SendMessageRequest(@NotBlank String content) {
    }

    public record MessageView(
            String id,
            String conversationId,
            UserDtos.UserSummary sender,
            UserDtos.UserSummary receiver,
            String content,
            boolean isRead,
            Instant createdAt
    ) {
    }

    public record ConversationView(
            String conversationId,
            UserDtos.UserSummary otherUser,
            String lastMessage,
            Instant lastMessageTime,
            boolean unread
    ) {
    }

    public record ConversationListResponse(
            List<ConversationView> conversations,
            long unreadCount
    ) {
    }
}
