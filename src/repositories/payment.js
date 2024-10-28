import { getMongoInstance } from "../config/database.js";
import { paymentModel } from "../models/payment.js";

class PaymentRepository {
  constructor() {
    this.collectionName = paymentModel.collectionName;
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

  async getPricePerLiterByFarmAndMonth(farmId, year, month) {
    return this._executeQuery(async (collection) => {
      return await collection.findOne({
        farm_id: farmId,
        year: year,
        month: month,
      });
    });
  }

  async getPricePerLiterByFarmAndYear(farmId, year) {
    return this._executeQuery(async (collection) => {
      return await collection
        .find({
          farm_id: farmId,
          year: year,
        })
        .sort({ month: 1 })
        .toArray();
    });
  }

  createPayment(paymentData) {
    return this._executeQuery(async (collection) => {
      return await collection.insertOne({
        ...paymentData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }

  updatePayment(paymentId, paymentData) {
    return this._executeQuery(async (collection) => {
      return await collection.updateOne(
        {
          _id: paymentId,
        },
        {
          $set: {
            ...paymentData,
            updatedAt: new Date(),
          },
        },
      );
    });
  }

  deletePayment(paymentId) {
    return this._executeQuery(async (collection) => {
      return await collection.deleteOne({
        _id: paymentId,
      });
    });
  }
}

export const paymentRepository = new PaymentRepository();
