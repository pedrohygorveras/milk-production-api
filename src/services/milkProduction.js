import { milkProductionRepository } from "../repositories/milkProduction.js";
import { logger } from "../utils/logger.js";
import { ObjectId } from "mongodb";

class MilkProductionService {
  _formatObjectId(id) {
    try {
      return ObjectId.createFromHexString(id);
    } catch (error) {
      logger.error(error);
      throw new Error(`Invalid ID format: ${id}`);
    }
  }

  async getMilkProductionByYearAndMonth(farmId, year, month) {
    const farmIdFormatted = this._formatObjectId(farmId);

    const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59));

    const milkProductions =
      await milkProductionRepository.getMilkProductionsByYearAndMonth(
        farmIdFormatted,
        startOfMonth,
        endOfMonth,
      );

    if (milkProductions.length === 0) {
      return { message: "No milk production data found for this period" };
    }

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

  async updateMilkProduction(milkProductionId, milkProductionData) {
    logger.info(`Updating milk production record with ID: ${milkProductionId}`);
    const milkProductionIdFormatted = this._formatObjectId(milkProductionId);

    return await milkProductionRepository.updateMilkProduction(
      milkProductionIdFormatted,
      milkProductionData,
    );
  }

  async deleteMilkProduction(milkProductionId) {
    logger.info(`Deleting milk production record with ID: ${milkProductionId}`);
    const milkProductionIdFormatted = this._formatObjectId(milkProductionId);

    return await milkProductionRepository.deleteMilkProduction(
      milkProductionIdFormatted,
    );
  }
}

export const milkProductionService = new MilkProductionService();
