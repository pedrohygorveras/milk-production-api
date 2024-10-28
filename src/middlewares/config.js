import express from "express";
import { logger } from "../utils/logger.js";

/**
 * Class responsible for configuring middlewares for the Express application.
 * This class sets up JSON parsing, URL-encoded data parsing, logging, and any other global middlewares.
 */
class MiddlewareConfig {
  /**
   * Configures all middlewares for the provided Express application instance.
   * @param {Express} app - The Express application instance to configure middlewares for.
   */
  static configure(app) {
    // Middleware for JSON parsing
    app.use(express.json());

    // Middleware for URL-encoded data parsing (useful for form submissions)
    app.use(express.urlencoded({ extended: true }));

    // Middleware for logging requests (using logger)
    app.use((req, res, next) => {
      logger.info(`Incoming request: ${req.method} ${req.url}`);
      next();
    });
  }
}

export { MiddlewareConfig };
