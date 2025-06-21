import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import connectDB from "./config/db.js";

const app = express();
const port = process.env.PORT || 4000;

connectDB()

// middleware
app.use(express.json({ limit: "16kb" }));
app.use(cors({ credentials: true }));

// routes
app.get("/", (req, res) => {

  res.send("Api Working");
});

app.use("/api/auth", authRouter);


app.listen(port, () => {
  console.log("Server is up and running on port : " + port);
});
