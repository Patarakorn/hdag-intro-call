import next from "next";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();
  server.use(express.json());

  // Mount API routes
  server.use("/api/users", userRoutes);

  // Delegate all other requests to Next.js
  server.all("/{*splat}", (req, res) => handle(req, res));

  // Connect to MongoDB
  mongoose
    .connect(process.env.MONGODB_URI!)
    .then(() => {
      console.log("🗄️ MongoDB connected");
      server.listen(PORT, () =>
        console.log(`🚀 Server ready at http://localhost:${PORT}`)
      );
    })
    .catch((err) => console.error("❌ DB connection error:", err));
});
