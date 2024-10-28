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

  async createUser(userData) {
    return this._executeQuery(async (collection) => {
      return await collection.insertOne({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }

  async getUserByEmail(email) {
    return this._executeQuery(async (collection) => {
      return await collection.findOne({ email });
    });
  }
}

export const userRepository = new UserRepository();
