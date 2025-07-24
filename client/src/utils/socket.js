import { io } from "socket.io-client";

const socket = io("https://csphere-server.onrender.com/");

export const registerSocket = (userId) => {
  socket.emit("register", userId);
};

export default socket;
