import { getMongoInstance } from "../config/database.js";
import { farmerModel } from "../models/farmer.js";

class FarmerRepository {
  constructor() {
    this.collectionName = farmerModel.collectionName;
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

  getAllFarmers() {
    return this._executeQuery(async (collection) => {
      return await collection.find().sort({ createdAt: -1 }).toArray();
    });
  }

  getFarmerById(farmerId) {
    return this._executeQuery(async (collection) => {
      const result = await collection
        .aggregate([
          {
            $match: { _id: farmerId },
          },
          {
            $lookup: {
              from: "farms",
              let: { farmerId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$farmer_id", "$$farmerId"] },
                  },
                },
                {
                  $sort: { createdAt: -1 },
                },
              ],
              as: "farms",
            },
          },
        ])
        .toArray();

      return result[0] || null;
    });
  }

  createFarmer(farmerData) {
    return this._executeQuery(async (collection) => {
      return await collection.insertOne({
        ...farmerData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }

  updateFarmer(farmerId, farmerData) {
    return this._executeQuery(async (collection) => {
      return await collection.updateOne(
        {
          _id: farmerId,
        },
        {
          $set: {
            ...farmerData,
            updatedAt: new Date(),
          },
        },
      );
    });
  }

  deleteFarmer(farmerId) {
    return this._executeQuery(async (collection) => {
      return await collection.deleteOne({
        _id: farmerId,
      });
    });
  }
}

export const farmerRepository = new FarmerRepository();
