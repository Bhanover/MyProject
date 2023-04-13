package com.billy.spring.project.socket.controller;


import com.billy.spring.project.payload.response.MessageResponse;
import com.billy.spring.project.socket.models.Greeting;
import com.billy.spring.project.socket.models.HelloMessage;
import com.billy.spring.project.socket.models.MessageRequest;

import com.billy.spring.project.socket.models.MessagesResponse;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;

import javax.annotation.security.PermitAll;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/mywebsocket")
public class WebSocketController {

    @MessageMapping("/chat/general")
    @SendTo("/topic/chat/general")
    public MessagesResponse sendToGeneralChat(MessageRequest message) throws Exception {
        return new MessagesResponse(message.getMessage(),message.getSender());
    }
}








