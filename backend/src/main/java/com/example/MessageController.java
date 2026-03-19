package com.example;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/trigger")
    public void handleTrigger() {
        messagingTemplate.convertAndSend(
                "/queue/messages",
                "Hello from Spring Boot!"
        );
    }
}