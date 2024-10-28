import { getMongoInstance } from "../config/database.js";
import { userModel } from "../models/user.js";

class UserRepository {
  constructor() {
    this.collectionName = userModel.collectionName;
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

  async getAllUsers() {
    return this._executeQuery(async (collection) => {
      return await collection
        .find({}, { projection: { email: 1 } })
        .sort({ createdAt: -1 })
        .toArray();
    });
  }

  async deleteUser(userId) {
    return this._executeQuery(async (collection) => {
      return await collection.deleteOne({ _id: userId });
    });
  }
}

export const userRepository = new UserRepository();
