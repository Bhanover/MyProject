import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:8081');
    setSocket(socket);

    socket.on('connect', () => {
      console.log('Conectado al servidor');
    });

    socket.on('disconnect', () => {
      console.log('Desconectado del servidor');
    });

    socket.on('/queue/messages', (data) => {
      // Aquí es donde recibirías los mensajes enviados por el servidor
      console.log('Mensaje recibido:', data);
      setMessages((messages) => [...messages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    const message = {
      senderId: '123', // Reemplaza con el ID del remitente
      recipientId: '456', // Reemplaza con el ID del destinatario
      text: '¡Hola mundo!',
    };
    socket.emit('/chat', message);
  };

  return (
    // Renderiza el componente del chat aquí
    <div>
      {messages.map((message) => (
        <div key={message.id}>{message.text}</div>
      ))}
      <button onClick={handleSendMessage}>Enviar mensaje</button>
    </div>
  );
};

export default Chat;