import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const WebSocketService = {
  stompClient: null,

  connect: function (jwtToken, onConnect, onDisconnect) {
    const socket = new SockJS('http://localhost:8081/mywebsocket');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect(
      { Authorization: jwtToken },
      (frame) => {
        onConnect(frame);
        this.stompClient.subscribe('/topic/online', (message) => {
          const parsedMessage = JSON.parse(message.body);
          console.log('Message received:', parsedMessage);
        });

        this.stompClient.subscribe('/topic/offline', (message) => {
          const parsedMessage = JSON.parse(message.body);
          console.log('Message received:', parsedMessage);
        });
      },
      (error) => {
        onDisconnect(error);
      }
    );
  },

  disconnect: function () {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  },

  sendOnline: function (userId) {
    this.stompClient.send('/app/online', {}, JSON.stringify({ userId }));
  },

  sendOffline: function (userId) {
    this.stompClient.send('/app/offline', {}, JSON.stringify({ userId }));
  },
};

export default WebSocketService;
