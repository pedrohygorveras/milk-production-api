import express from "express";
import dotenv from "dotenv";
import { getMongoInstance } from "./config/database.js";
import { logger } from "./utils/logger.js";
import { initializeModels } from "./scripts/initializeModels.js";
import { configureMiddlewares } from "./middlewares/index.js";

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Initializes the server and establishes a MongoDB connection.
 * Uses a singleton MongoDBConnection instance to maintain a single active connection.
 * Sets up the application middlewares and routes before starting the server.
 */
const startServer = async () => {
  try {
    // Initialize models and apply database schema changes if necessary
    await initializeModels();

    // Connect to MongoDB
    const mongoInstance = getMongoInstance();
    await mongoInstance.connect();
    logger.info("MongoDB connected successfully");

    // Configure middlewares
    configureMiddlewares(app);

    // Start the Express server
    app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start the server or connect to MongoDB:", error);
    process.exit(1); // Exit process if the server fails to start
  }
};

// Start the server
startServer();
