import express from "express";
import { logger } from "../utils/logger.js";

/**
 * Configures middlewares for the Express application.
 * This function sets up JSON parsing, logging, and any other global middlewares.
 */
export const configureMiddlewares = (app) => {
  // Middleware for JSON parsing
  app.use(express.json());

  // Middleware for URL-encoded data parsing (useful for form submissions)
  app.use(express.urlencoded({ extended: true }));

  // Middleware for logging requests (using logger)
  app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
  });
};
