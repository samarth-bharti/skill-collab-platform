package com.skillcollab.platform.service;

import com.skillcollab.platform.domain.DirectMessage;
import com.skillcollab.platform.domain.NotificationType;
import com.skillcollab.platform.domain.UserAccount;
import com.skillcollab.platform.dto.ChatDtos;
import com.skillcollab.platform.exception.ApiException;
import com.skillcollab.platform.repository.DirectMessageRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    private final DirectMessageRepository directMessageRepository;
    private final UserService userService;
    private final DtoMapper dtoMapper;
    private final NotificationService notificationService;

    public ChatService(DirectMessageRepository directMessageRepository,
                       UserService userService,
                       DtoMapper dtoMapper,
                       NotificationService notificationService) {
        this.directMessageRepository = directMessageRepository;
        this.userService = userService;
        this.dtoMapper = dtoMapper;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public ChatDtos.ConversationListResponse getConversations(UserAccount currentUser) {
        List<DirectMessage> messages = directMessageRepository.findBySenderOrReceiverOrderByCreatedAtDesc(currentUser, currentUser);
        Map<String, DirectMessage> latestByConversation = new LinkedHashMap<>();
        messages.forEach(message -> latestByConversation.putIfAbsent(message.getConversationId(), message));

        List<ChatDtos.ConversationView> conversations = latestByConversation.values().stream()
                .map(message -> {
                    UserAccount other = message.getSender().getId().equals(currentUser.getId()) ? message.getReceiver() : message.getSender();
                    boolean unread = !message.isRead() && message.getReceiver().getId().equals(currentUser.getId());
                    return new ChatDtos.ConversationView(
                            message.getConversationId(),
                            dtoMapper.toUserSummary(other),
                            message.getContent(),
                            message.getCreatedAt(),
                            unread
                    );
                })
                .sorted(Comparator.comparing(ChatDtos.ConversationView::lastMessageTime).reversed())
                .toList();

        return new ChatDtos.ConversationListResponse(
                conversations,
                directMessageRepository.countByReceiverAndReadIsFalse(currentUser)
        );
    }

    @Transactional(readOnly = true)
    public List<ChatDtos.MessageView> getConversation(UserAccount currentUser, String otherUserId) {
        UserAccount other = userService.findById(otherUserId);
        String conversationId = conversationId(currentUser.getId(), other.getId());
        return directMessageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId).stream()
                .map(dtoMapper::toMessageView)
                .toList();
    }

    @Transactional
    public ChatDtos.MessageView sendMessage(UserAccount currentUser, String receiverId, String content) {
        UserAccount receiver = userService.findById(receiverId);
        DirectMessage message = new DirectMessage();
        message.setSender(currentUser);
        message.setReceiver(receiver);
        message.setConversationId(conversationId(currentUser.getId(), receiver.getId()));
        message.setContent(content);
        message.setRead(false);
        directMessageRepository.save(message);

        notificationService.notify(
                receiver,
                NotificationType.MESSAGE,
                "New message",
                currentUser.getFullName() + ": " + truncate(content),
                "/dashboard/chat"
        );
        return dtoMapper.toMessageView(message);
    }

    @Transactional
    public ChatDtos.MessageView markAsRead(UserAccount currentUser, String messageId) {
        DirectMessage message = directMessageRepository.findById(messageId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Message not found."));
        if (!message.getReceiver().getId().equals(currentUser.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You cannot mark this message as read.");
        }
        message.setRead(true);
        directMessageRepository.save(message);
        return dtoMapper.toMessageView(message);
    }

    private String conversationId(String first, String second) {
        return first.compareTo(second) < 0 ? first + "_" + second : second + "_" + first;
    }

    private String truncate(String content) {
        return content.length() > 60 ? content.substring(0, 60) : content;
    }
}
