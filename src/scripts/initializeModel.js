import { getMongoInstance } from "../config/database.js";
import { logger } from "../utils/logger.js";

/**
 * Initializes a collection in MongoDB.
 * Ensures the collection exists, creates it if not present,
 * and sets up necessary indexes for performance and data integrity.
 *
 * @async
 * @function initializeModel
 * @param {string} collectionName - The name of the collection to initialize.
 * @param {Array<Object>} indexes - An array of index configurations.
 * @returns {Promise<void>} - Resolves when the model is initialized successfully.
 * @throws {Error} - If any database operation fails, the error will be logged and rethrown.
 */
export const initializeModel = async (collectionName, indexes = []) => {
  try {
    const mongoInstance = getMongoInstance();
    const db = await mongoInstance.connect();
    const collection = db.collection(collectionName);

    // Check if the collection already exists
    const collectionExists = await db
      .listCollections({ name: collectionName })
      .hasNext();

    // Create the collection if it doesn't exist
    if (!collectionExists) {
      logger.info(`Creating collection: ${collectionName}`);
      await db.createCollection(collectionName);
    } else {
      logger.info(
        `Collection '${collectionName}' already exists. Skipping creation.`,
      );
    }

    // Apply each index configuration
    for (const index of indexes) {
      await collection.createIndex(index.fields, index.options || {});
      logger.info(
        `Index on '${JSON.stringify(index.fields)}' for '${collectionName}' created or already exists.`,
      );
    }

    logger.info(`Model '${collectionName}' initialized successfully.`);
  } catch (error) {
    logger.error(`Error initializing model '${collectionName}':`, error);
    throw error;
  }
};
