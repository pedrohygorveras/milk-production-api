import { milkProductionRepository } from "../repositories/milkProduction.js";
import { logger } from "../utils/logger.js";
import { ObjectId } from "mongodb";

class MilkProductionService {
  /**
   * Converts a string ID to ObjectId format, logging an error if the format is invalid.
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
   * Retrieves milk production data for a specified farm, year, and month.
   * @param {string} farmId - The ID of the farm.
   * @param {number} year - The year to filter records.
   * @param {number} month - The month to filter records.
   * @returns {Promise<Object>} - Daily milk production and average liters produced.
   */
  async getMilkProductionByYearAndMonth(farmId, year, month) {
    const farmIdFormatted = this._formatObjectId(farmId);

    // Define the start and end dates for the month
    const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59));

    // Fetch milk production data for the given period
    const milkProductions =
      await milkProductionRepository.getMilkProductionsByYearAndMonth(
        farmIdFormatted,
        startOfMonth,
        endOfMonth,
      );

    if (milkProductions.length === 0) {
      return { message: "No milk production data found for this period" };
    }

    // Calculate total and average liters of milk produced
    const totalLiters = milkProductions.reduce(
      (total, production) => total + production.volume_liters,
      0,
    );
    const averageLiters = totalLiters / milkProductions.length;

    return {
      dailyProductions: milkProductions,
      averageLiters: parseFloat(averageLiters).toFixed(2),
    };
  }

  /**
   * Creates a new milk production record in the database.
   * @param {Object} milkProductionData - Data for the new record.
   * @returns {Promise<Object>} - The created milk production data.
   */
  async createMilkProduction(milkProductionData) {
    logger.info("Creating a new milk production record");
    const { farm_id, farmer_id, date, ...rest } = milkProductionData;
    const dateFormatted = new Date(date);
    const farmIdFormatted = this._formatObjectId(farm_id);
    const farmerIdFormatted = this._formatObjectId(farmer_id);

    const milkProductionDataFormatted = {
      ...rest,
      date: dateFormatted,
      farm_id: farmIdFormatted,
      farmer_id: farmerIdFormatted,
    };

    return await milkProductionRepository.createMilkProduction(
      milkProductionDataFormatted,
    );
  }

  /**
   * Updates an existing milk production record.
   * @param {string} milkProductionId - ID of the record to update.
   * @param {Object} milkProductionData - Updated data for the record.
   * @returns {Promise<Object>} - The updated milk production data.
   */
  async updateMilkProduction(milkProductionId, milkProductionData) {
    logger.info(`Updating milk production record with ID: ${milkProductionId}`);
    const milkProductionIdFormatted = this._formatObjectId(milkProductionId);

    return await milkProductionRepository.updateMilkProduction(
      milkProductionIdFormatted,
      milkProductionData,
    );
  }

  /**
   * Deletes a milk production record from the database.
   * @param {string} milkProductionId - ID of the record to delete.
   * @returns {Promise<Object>} - Result of the deletion.
   */
  async deleteMilkProduction(milkProductionId) {
    logger.info(`Deleting milk production record with ID: ${milkProductionId}`);
    const milkProductionIdFormatted = this._formatObjectId(milkProductionId);

    return await milkProductionRepository.deleteMilkProduction(
      milkProductionIdFormatted,
    );
  }
}

export const milkProductionService = new MilkProductionService();
