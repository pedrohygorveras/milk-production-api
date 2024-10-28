import { ObjectId } from "mongodb";
import { farmRepository } from "../repositories/farm.js";
import { milkProductionRepository } from "../repositories/milkProduction.js";
import { logger } from "../utils/logger.js";

class FarmService {
  /**
   * Converts a string ID to an ObjectId format, logging an error if the format is invalid.
   * @param {string} id - The ID to format.
   * @returns {ObjectId} - The formatted ObjectId.
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
   * Fetches farm details by ID.
   * @param {string} farmId - The farm ID to fetch.
   * @returns {Promise<Object>} - The farm data.
   */
  async getFarmById(farmId) {
    logger.info(`Fetching farm and milk production with ID: ${farmId}`);
    const farmIdFormatted = this._formatObjectId(farmId);
    return await farmRepository.getFarmById(farmIdFormatted);
  }

  /**
   * Creates a new farm entry in the database.
   * @param {Object} farmData - Data for the new farm.
   * @returns {Promise<Object>} - The created farm data.
   */
  async createFarm(farmData) {
    logger.info("Creating a new farm");
    const { farmer_id, ...rest } = farmData;
    const farmerIdFormatted = this._formatObjectId(farmer_id);
    const farmDataFormatted = {
      ...rest,
      farmer_id: farmerIdFormatted,
    };
    return await farmRepository.createFarm(farmDataFormatted);
  }

  /**
   * Updates an existing farm's details.
   * @param {string} farmId - The ID of the farm to update.
   * @param {Object} farmData - The updated farm data.
   * @returns {Promise<Object>} - The updated farm data.
   */
  async updateFarm(farmId, farmData) {
    logger.info(`Updating farm with ID: ${farmId}`);
    const farmIdFormatted = this._formatObjectId(farmId);
    return await farmRepository.updateFarm(farmIdFormatted, farmData);
  }

  /**
   * Deletes a farm and associated milk production records.
   * @param {string} farmId - The ID of the farm to delete.
   * @returns {Promise<Object>} - Result of deletion for farm and milk production data.
   */
  async deleteFarm(farmId) {
    logger.info(`Deleting farm with ID: ${farmId}`);
    const farmIdFormatted = this._formatObjectId(farmId);
    const [farms, milk_production] = await Promise.all([
      farmRepository.deleteFarm(farmIdFormatted),
      milkProductionRepository.deleteAllMilkProductionsByFarmId(
        farmIdFormatted,
      ),
    ]);
    return { farms, milk_production };
  }
}

export const farmService = new FarmService();
