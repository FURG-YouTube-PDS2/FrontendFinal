import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { API_URL } from "../../../util/Api";

//pegar da API
const SOCKET_SERVER_URL = API_URL;

const useChat = (room_id, username) => {
  const [messages, setMessages] = useState([]); // Sent and received messages
  const [error, setError] = useState(null);
  const socketRef = useRef();

  useEffect(() => {
    /*
      server events:
        message
        changeUsername
        newClient
        quitClient

      client events:
        message
        changeUsername
        newClient
        quitClient

      command is for AIC4

    */
    // Creates a WebSocket connection

    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { room_id, username },
    });

    // Listens for incoming messages
    socketRef.current.on("message", (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.sender_id === socketRef.current.id,
        text: true,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    socketRef.current.on("err", (err) => {
      setError(err);
    });

    socketRef.current.on("command", (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.sender_id === socketRef.current.id,
        type: 1,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    // Listens for incoming messages
    socketRef.current.on("newClient", (message) => {
      const incomingMessage = {
        ...message,
        text: false,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    // Listens for incoming messages
    socketRef.current.on("quitClient", (message) => {
      const incomingMessage = {
        ...message,
        text: false,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    // Destroys the socket reference
    // when the connection is closed
    return () => {
      socketRef.current.disconnect();
    };
  }, [room_id]);

  // Sends a message to the server that
  // forwards it to all users in the same room
  const send = (messageBody, event = "message") => {
    socketRef.current.emit(event, {
      body: messageBody,
      sender_id: socketRef.current.id,
    });
  };

  const shiftMessages = () => {
    var aux = [...messages];
    aux.shift();
    setMessages(aux);
  };

  const clearMessages = () => {
    var aux = [];
    setMessages(aux);
  };

  return { messages, send, shiftMessages, clearMessages, error };
};

export default useChat;
