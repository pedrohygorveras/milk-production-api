import { logger } from "../utils/logger.js";
import { MongoClient } from "mongodb";

/**
 * Class responsible for managing the MongoDB connection.
 * This class follows the Singleton pattern to ensure only one
 * instance of MongoDBConnection exists at a time.
 */
class MongoDBConnection {
  /**
   * Creates a MongoDBConnection instance.
   * @param {string} uri - MongoDB connection URI.
   * @param {string} dbName - Name of the database to connect to.
   */
  constructor(uri, dbName) {
    if (!uri || !dbName) {
      throw new Error("MongoDB URI and database name must be provided.");
    }

    this.uri = uri;
    this.dbName = dbName;
    this.client = null;
    this.db = null;
  }

  /**
   * Establishes a connection to MongoDB and initializes the database instance.
   * If the connection already exists, it returns the current instance.
   * @returns {Promise<Db>} - The connected MongoDB database instance.
   * @throws {Error} - If connection fails or MongoDB URI/Database name is missing.
   */
  async connect() {
    if (this.db) {
      logger.info(
        "MongoDB already connected. Returning the existing database instance.",
      );
      return this.db;
    }
    try {
      this.client = new MongoClient(this.uri);

      await this.client.connect();

      this.db = this.client.db(this.dbName);

      logger.info("Connected to MongoDB Atlas successfully!");

      return this.db;
    } catch (error) {
      logger.error("Failed to connect to MongoDB:", error);
      process.exit(1); // Exit if MongoDB fails to connect
    }
  }

  /**
   * Returns the current MongoDB database instance.
   * Ensures that a connection is established before accessing the database.
   * @returns {Db} - The connected MongoDB database instance.
   * @throws {Error} - If no connection has been established.
   */
  getDatabase() {
    if (!this.db) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.db;
  }

  /**
   * Closes the MongoDB connection.
   * @returns {Promise<void>}
   */
  async close() {
    if (this.client) {
      await this.client.close();
      logger.info("MongoDB connection closed.");
      this.db = null;
      this.client = null;
    }
  }
}

// Singleton instance to ensure a single connection
let mongoInstance = null;

/**
 * Returns the MongoDBConnection singleton instance.
 * If it doesn't exist, it creates one with environment variables.
 * @returns {MongoDBConnection} - The MongoDBConnection instance.
 */
const getMongoInstance = () => {
  if (!mongoInstance) {
    mongoInstance = new MongoDBConnection(
      process.env.MONGO_URI,
      process.env.DB_NAME,
    );
  }
  return mongoInstance;
};

export { getMongoInstance };
