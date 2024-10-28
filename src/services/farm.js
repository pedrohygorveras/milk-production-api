import { ObjectId } from "mongodb";
import { farmRepository } from "../repositories/farm.js";
import { milkProductionRepository } from "../repositories/milkProduction.js";
import { logger } from "../utils/logger.js";

class FarmService {
  _formatObjectId(id) {
    try {
      return ObjectId.createFromHexString(id);
    } catch (error) {
      logger.error(error);
      throw new Error(`Invalid ID format: ${id}`);
    }
  }

  async getFarmById(farmId) {
    logger.info(`Fetching farm and production milk with ID: ${farmId}`);
    const farmIdFormatted = this._formatObjectId(farmId);
    return await farmRepository.getFarmById(farmIdFormatted);
  }

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

  async updateFarm(farmId, farmData) {
    logger.info(`Updating farm with ID: ${farmId}`);
    const farmIdFormatted = this._formatObjectId(farmId);
    return await farmRepository.updateFarm(farmIdFormatted, farmData);
  }

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
