import { ObjectId } from "mongodb";
import { initializeModel } from "../scripts/initializeModel.js";

/**
 * Represents a Farmer in the system with their respective farms.
 * Each farmer can own multiple farms.
 * @typedef {Object} Farmer
 * @property {ObjectId} _id - Unique identifier for the farmer.
 * @property {string} name - Name of the farmer.
 * @property {string} email - Email address of the farmer.
 * @property {string} phone - Phone number of the farmer.
 * @property {Date} createdAt - Timestamp of when the register was added.
 * @property {Date} updatedAt - Timestamp of the last update on the register data.
 */
export const FarmerSchema = {
  _id: ObjectId,
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
};

/**
 * Initializes the Farmer collection in MongoDB.
 * This function sets up the collection and necessary indexes for performance and search capabilities.
 */
export const initializeFarmerModel = async () => {
  const collectionName = "farmers";

  // Define the indexes for the Farmer collection
  const indexes = [
    { fields: { email: 1 }, options: { unique: true } }, // Unique index on email
  ];

  // Call the generic initialize function
  await initializeModel(collectionName, indexes);
};
