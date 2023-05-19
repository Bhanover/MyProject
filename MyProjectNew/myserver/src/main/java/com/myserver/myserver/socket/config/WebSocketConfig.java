package com.myserver.myserver.socket.config;


import com.myserver.myserver.exception.InvalidJwtException;
import com.myserver.myserver.security.jwt.JwtUtils;
import com.myserver.myserver.security.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    /*Configura las rutas de mensajes. */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue","/user");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");

    }


    /*Configura los endpoints STOMP*/
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/mywebsocket").setAllowedOrigins("http://localhost:5173").withSockJS();

    }
    /*: Este método retorna un ChannelInterceptor que intercepta los
     mensajes antes de que sean enviados. En este caso, si el comando es CONNECT,
     extrae el token de las cabeceras, valida el token, extrae el nombre de usuario del token,
      carga los detalles del usuario y establece el objeto de autenticación en el contexto de seguridad.*/
    private ChannelInterceptor jwtAuthChannelInterceptor() {
        return new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
                if (accessor.getCommand() == StompCommand.CONNECT) {
                    String token = accessor.getFirstNativeHeader("Authorization");
                    try {
                        if (token != null && jwtUtils.validateToken(token)) {
                            String username = jwtUtils.getUsernameFromToken(token);
                            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                        }
                    } catch (InvalidJwtException e) {
                        throw new RuntimeException(e);
                    }
                }
                return message;
            }
        };
    }

    /* Este método registra el interceptor creado en jwtAuthChannelInterceptor() para ser aplicado a los mensajes entrantes.*/
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(jwtAuthChannelInterceptor());

    }




}


