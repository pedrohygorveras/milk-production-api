import { getMongoInstance } from "../config/database.js";
import { farmModel } from "../models/farm.js";

class FarmRepository {
  constructor() {
    this.collectionName = farmModel.collectionName;
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

  getAllFarmsByFarmerId(farmerId) {
    return this._executeQuery(async (collection) => {
      return await collection
        .find({
          farmer_id: farmerId,
        })
        .sort({ createdAt: -1 })
        .toArray();
    });
  }

  getFarmById(farmId) {
    return this._executeQuery(async (collection) => {
      const result = await collection
        .aggregate([
          {
            $match: { _id: farmId },
          },
          {
            $lookup: {
              from: "milk_production",
              let: { farmId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$farm_id", "$$farmId"] },
                  },
                },
                {
                  $sort: { date: -1 },
                },
              ],
              as: "milk_production",
            },
          },
        ])
        .toArray();

      return result[0] || null;
    });
  }

  createFarm(farmData) {
    return this._executeQuery(async (collection) => {
      return await collection.insertOne({
        ...farmData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }

  updateFarm(farmId, farmData) {
    return this._executeQuery(async (collection) => {
      return await collection.updateOne(
        {
          _id: farmId,
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

  deleteFarm(farmId) {
    return this._executeQuery(async (collection) => {
      return await collection.deleteOne({
        _id: farmId,
      });
    });
  }

  deleteAllFarmsByFarmId(farmId) {
    return this._executeQuery(async (collection) => {
      return await collection.deleteMany({
        farm_id: farmId,
      });
    });
  }

  deleteAllFarmsByFarmerId(farmerId) {
    return this._executeQuery(async (collection) => {
      return await collection.deleteMany({
        farmer_id: farmerId,
      });
    });
  }
}

export const farmRepository = new FarmRepository();
