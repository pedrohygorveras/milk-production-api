import { getMongoInstance } from "../config/database.js";
import { milkProductionModel } from "../models/milkProduction.js";

class MilkProductionRepository {
  constructor() {
    this.collectionName = milkProductionModel.collectionName;
    this.dbInstance = getMongoInstance();
  }

  async _executeQuery(callback) {
    let client;
    try {
      client = await this.dbInstance.connect();
      const collection = client.collection(this.collectionName);
      return await callback(collection);
    } catch (error) {
      throw new Error(`Database operation failed: ${error.message}`);
    }
  }

  getAllMilkProductionsByFarmId(farmId) {
    return this._executeQuery(async (collection) => {
      return await collection
        .find({
          farm_id: farmId,
        })
        .sort({ date: -1 })
        .toArray();
    });
  }

  getMilkProductionsByYearAndMonth(farmId, startOfMonth, endOfMonth) {
    return this._executeQuery(async (collection) => {
      return await collection
        .aggregate([
          {
            $match: {
              farm_id: farmId,
              date: {
                $gte: startOfMonth,
                $lte: endOfMonth,
              },
            },
          },
          {
            $sort: { date: 1 },
          },
          {
            $project: {
              date: 1,
              volume_liters: 1,
            },
          },
        ])
        .toArray();
    });
  }

  createMilkProduction(farmData) {
    return this._executeQuery(async (collection) => {
      return await collection.insertOne({
        ...farmData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }

  updateMilkProduction(milkProductionId, farmData) {
    return this._executeQuery(async (collection) => {
      return await collection.updateOne(
        {
          _id: milkProductionId,
        },
        {
          $set: {
            ...farmData,
            updatedAt: new Date(),
          },
        },
      );
    });
  }

  deleteMilkProduction(milkProductionId) {
    return this._executeQuery(async (collection) => {
      return await collection.deleteOne({
        _id: milkProductionId,
      });
    });
  }

  deleteAllMilkProductionsByFarmerId(farmerId) {
    return this._executeQuery(async (collection) => {
      return await collection.deleteMany({
        farmer_id: farmerId,
      });
    });
  }

  deleteAllMilkProductionsByFarmId(farmId) {
    return this._executeQuery(async (collection) => {
      return await collection.deleteMany({
        farm_id: farmId,
      });
    });
  }
}

export const milkProductionRepository = new MilkProductionRepository();
