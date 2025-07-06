const activeUsers = new Map();

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("A user connected : ", socket.id);

    socket.on("register", (userId) => {
      activeUsers.set(userId, socket.id);
      console.log("User registered : ", userId);
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of activeUsers) {
        if (socketId === socket.id) {
          activeUsers.delete(userId);
          console.log("User disconnected : ", userId);
          break;
        }
      }
    });
  });

  io.sendNotification = (userId, data) => {
    const socketId = activeUsers.get(userId);
    if (socketId) {
      io.to(socketId).emit("notification", data);
    }
  };
}
