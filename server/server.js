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

const app = express();
const port = process.env.PORT || 4000;

connectDB();

// middleware
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

app.use(limiter);
app.use(helmet());
app.use(sanitize());
app.use(cors({ credentials: true }));
app.use(express.json({ limit: "16kb" }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
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

server.listen(port, () => {
  console.log("Server is up and running on port : " + port);
});
