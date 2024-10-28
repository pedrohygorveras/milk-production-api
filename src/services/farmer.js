import { farmerRepository } from "../repositories/farmer.js";
import { farmRepository } from "../repositories/farm.js";
import { logger } from "../utils/logger.js";
import { ObjectId } from "mongodb";
import { milkProductionRepository } from "../repositories/milkProduction.js";

class FarmerService {
  /**
   * Converts a string ID to ObjectId format. Logs an error if the format is invalid.
   * @param {string} id - ID to format.
   * @returns {ObjectId} - Formatted ObjectId.
   * @throws {Error} - If the ID format is invalid.
   */
  _formatObjectId(id) {
    try {
      return ObjectId.createFromHexString(id);
    } catch (error) {
      logger.error(error);
      throw new Error(`Invalid ID format: ${id}`);
    }
  }

  /**
   * Fetches all farmers from the database.
   * @returns {Promise<Array>} - List of all farmers.
   */
  async getAllFarmers() {
    logger.info("Fetching all farmers");
    return await farmerRepository.getAllFarmers();
  }

  /**
   * Fetches a farmer by ID, including their farms.
   * @param {string} farmerId - ID of the farmer to fetch.
   * @returns {Promise<Object>} - Farmer data.
   */
  async getFarmerById(farmerId) {
    logger.info(`Fetching farmer and farms with ID: ${farmerId}`);
    const farmerIdFormatted = this._formatObjectId(farmerId);
    return await farmerRepository.getFarmerById(farmerIdFormatted);
  }

  /**
   * Creates a new farmer entry in the database.
   * @param {Object} farmerData - Data for the new farmer.
   * @returns {Promise<Object>} - The created farmer data.
   */
  async createFarmer(farmerData) {
    logger.info("Creating a new farmer");
    return await farmerRepository.createFarmer(farmerData);
  }

  /**
   * Updates an existing farmer's details.
   * @param {string} farmerId - ID of the farmer to update.
   * @param {Object} farmerData - Updated farmer data.
   * @returns {Promise<Object>} - Updated farmer data.
   */
  async updateFarmer(farmerId, farmerData) {
    logger.info(`Updating farmer with ID: ${farmerId}`);
    const farmerIdFormatted = this._formatObjectId(farmerId);
    return await farmerRepository.updateFarmer(farmerIdFormatted, farmerData);
  }

  /**
   * Deletes a farmer and all related farms and milk production records.
   * @param {string} farmerId - ID of the farmer to delete.
   * @returns {Promise<Object>} - Result of deletion for farmer, farms, and milk production data.
   */
  async deleteFarmerCascade(farmerId) {
    logger.info(`Deleting farmer and farms with ID: ${farmerId}`);
    const farmerIdFormatted = this._formatObjectId(farmerId);
    const [farmer, farms, milk_production] = await Promise.all([
      farmerRepository.deleteFarmer(farmerIdFormatted),
      farmRepository.deleteAllFarmsByFarmerId(farmerIdFormatted),
      milkProductionRepository.deleteAllMilkProductionsByFarmerId(
        farmerIdFormatted,
      ),
    ]);
    return { farmer, farms, milk_production };
  }
}

export const farmerService = new FarmerService();
