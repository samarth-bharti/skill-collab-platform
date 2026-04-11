package com.skillcollab.platform.controller;

import com.skillcollab.platform.dto.ChatDtos;
import com.skillcollab.platform.service.ChatService;
import com.skillcollab.platform.service.CurrentUserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final CurrentUserService currentUserService;
    private final ChatService chatService;

    public ChatController(CurrentUserService currentUserService, ChatService chatService) {
        this.currentUserService = currentUserService;
        this.chatService = chatService;
    }

    @GetMapping("/conversations")
    public ChatDtos.ConversationListResponse conversations() {
        return chatService.getConversations(currentUserService.requireCurrentUser());
    }

    @GetMapping("/direct/{otherUserId}")
    public List<ChatDtos.MessageView> conversation(@PathVariable String otherUserId) {
        return chatService.getConversation(currentUserService.requireCurrentUser(), otherUserId);
    }

    @PostMapping("/direct/{otherUserId}")
    public ChatDtos.MessageView send(@PathVariable String otherUserId, @Valid @RequestBody ChatDtos.SendMessageRequest request) {
        return chatService.sendMessage(currentUserService.requireCurrentUser(), otherUserId, request.content());
    }

    @PatchMapping("/messages/{messageId}/read")
    public ChatDtos.MessageView markRead(@PathVariable String messageId) {
        return chatService.markAsRead(currentUserService.requireCurrentUser(), messageId);
    }
}
