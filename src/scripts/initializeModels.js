import { initializeFarmModel } from "../models/farm.js";
import { initializeFarmerModel } from "../models/farmer.js";
import { initializeMilkProductionModel } from "../models/milkProduction.js";
import { initializeMonthlyPaymentModel } from "../models/monthlyPayments.js";
import { logger } from "../utils/logger.js";

/**
 * Initializes all models in the application.
 * This function ensures that collections are created if they don't exist and that
 * necessary indexes are applied to each collection, optimizing performance and
 * enforcing data integrity. It follows the modular approach, making it easy to
 * add new models in the future by simply extending the initialization list.
 *
 * @async
 * @function initializeModels
 * @returns {Promise<void>} - Resolves when all models are initialized successfully.
 * @throws {Error} - If any model initialization fails, the error is logged, and the process exits.
 */
export const initializeModels = async () => {
  try {
    // Initialize each model independently
    await initializeFarmerModel();
    await initializeFarmModel();
    await initializeMilkProductionModel();
    await initializeMonthlyPaymentModel();

    logger.info("All models initialized successfully.");
  } catch (error) {
    logger.error("Error during model initialization:", error);

    // Exits the application if there is an issue initializing models
    process.exit(1);
  }
};
