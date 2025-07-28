import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import rateLimit from "express-rate-limit";
import sanitize from "express-mongo-sanitize";
import { Server } from "socket.io";
import connectDB from "./config/dbConfig.js";
import clubRouter from "./routes/clubRoutes.js";
import eventRouter from "./routes/eventRoutes.js";
import announcementRouter from "./routes/announcementRoutes.js";
import userRouter from "./routes/authRoutes.js";
import socketHandler from "./socket.js";
import notificationRouter from "./routes/notificationRoutes.js";
import exploreRouter from "./routes/exploreRoutes.js";

const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);

connectDB();

// middleware
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const allowedOrigins = [
  "https://csphere-connect.vercel.app",
  "http://localhost:5173",
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(helmet());
app.use(sanitize());
// app.use(limiter);

const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
});

app.set("io", io);

socketHandler(io);

// routes
app.get("/", (req, res) => {
  res.send("Api Working");
});

app.use("/api/user", userRouter);
app.use("/api/clubs", clubRouter);
app.use("/api/events", eventRouter);
app.use("/api/announcements", announcementRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/explore", exploreRouter);

server.listen(port, () => {
  console.log("Server is up and running on port : " + port);
});
