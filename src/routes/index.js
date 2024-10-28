import express from "express";
import { authRoutes } from "./auth.js";
import { userRoutes } from "./user.js";
import { farmerRoutes } from "./farmer.js";
import { farmRoutes } from "./farm.js";
import { milkProductionRoutes } from "./milkProduction.js";
import { swaggerRoutes } from "./swagger.js";
import { paymentRoutes } from "./payment.js";

/**
 * Class responsible for configuring and managing the main router for the application.
 * This class aggregates all resource-specific routers (e.g., farmer, farm, milk production).
 * All routes defined in this router will be prefixed by '/api'.
 */
class MainRouter {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  /**
   * Initializes all resource-specific routes.
   * Mounts each resource-specific route under the appropriate endpoint.
   */
  initializeRoutes() {
    // Mount each resource-specific route
    this.router.use("/", swaggerRoutes);
    this.router.use("/auth", authRoutes);
    this.router.use("/users", userRoutes);
    this.router.use("/farmers", farmerRoutes);
    this.router.use("/farms", farmRoutes);
    this.router.use("/milk-productions", milkProductionRoutes);
    this.router.use("/payments", paymentRoutes);
  }

  /**
   * Returns the configured router instance.
   * @returns {Router} - The main express router instance with all routes configured.
   */
  getRouter() {
    return this.router;
  }
}

// Export an instance of MainRouter
export const mainRouter = new MainRouter().getRouter();
