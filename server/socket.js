const activeUsers = new Map();

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    socket.on("register", (userId) => {
      activeUsers.set(userId, socket.id);
    });

    socket.on("joinRoom", (clubId) => {
      socket.join(clubId);
    });

    socket.on("leaveRoom", (clubId) => {
      socket.leave(clubId);
    });

    socket.on("sendMessage", ({ room, message, sender }) => {
      if (!room || !message || !sender) return;
      socket.to(room).emit("message", {
        message,
        sender,
        createdAt: new Date().toISOString(),
      });
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of activeUsers.entries()) {
        if (socketId === socket.id) {
          activeUsers.delete(userId);
          console.log(`User ${userId} disconnected`);
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

  io.updateUnreadCount = (userId) => {
    const socketId = activeUsers.get(userId);
    if (socketId) {
      io.to(socketId).emit("updateUnreadCount");
    }
  };
}
