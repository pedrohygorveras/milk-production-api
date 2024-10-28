import { farmerRepository } from "../repositories/farmer.js";
import { farmRepository } from "../repositories/farm.js";
import { logger } from "../utils/logger.js";
import { ObjectId } from "mongodb";
import { milkProductionRepository } from "../repositories/milkProduction.js";

class FarmerService {
  _formatObjectId(id) {
    try {
      return ObjectId.createFromHexString(id);
    } catch (error) {
      logger.error(error);
      throw new Error(`Invalid ID format: ${id}`);
    }
  }

  async getAllFarmers() {
    logger.info("Fetching all farmers");
    return await farmerRepository.getAllFarmers();
  }

  async getFarmerById(farmerId) {
    logger.info(`Fetching farmer and farms with ID: ${farmerId}`);
    const farmerIdFormatted = this._formatObjectId(farmerId);
    return await farmerRepository.getFarmerById(farmerIdFormatted);
  }

  async createFarmer(farmerData) {
    logger.info("Creating a new farmer");
    return await farmerRepository.createFarmer(farmerData);
  }

  async updateFarmer(farmerId, farmerData) {
    logger.info(`Updating farmer with ID: ${farmerId}`);
    const farmerIdFormatted = this._formatObjectId(farmerId);
    return await farmerRepository.updateFarmer(farmerIdFormatted, farmerData);
  }

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
