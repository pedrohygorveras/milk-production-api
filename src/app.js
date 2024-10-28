import express from "express";
import dotenv from "dotenv";
import { getMongoInstance } from "./config/database.js";
import { logger } from "./utils/logger.js";
import { MiddlewareConfig } from "./middlewares/config.js";
import { mainRouter } from "./routes/index.js";

dotenv.config();

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.mongoInstance = getMongoInstance();
  }

  async initialize() {
    try {
      await this.mongoInstance.connect();
      logger.info("MongoDB connected successfully");

      MiddlewareConfig.configure(this.app);

      this.configureRoutes();

      this.start();
    } catch (error) {
      logger.error("Failed to start the server or connect to MongoDB:", error);
      process.exit(1);
    }
  }

  configureRoutes() {
    try {
      this.app.use("/api", mainRouter);
      logger.info("Routes configured successfully.");
    } catch (error) {
      logger.error("Error configuring routes:", error);
    }
  }

  start() {
    this.app.listen(this.port, () => {
      logger.info(`Server is running on http://localhost:${this.port}`);
    });
  }
}

export const server = new Server();

server.initialize();
