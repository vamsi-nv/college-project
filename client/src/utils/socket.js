import { io } from "socket.io-client";

const socket = io("https://csphere-sever.onrender.com");
// const socket = io("http://localhost:3000");

export const registerSocket = (userId) => {
  socket.emit("register", userId);
};

export default socket;
