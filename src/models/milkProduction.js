import { ObjectId } from "mongodb";
import { initializeModel } from "../scripts/initializeModel.js";

/**
 * Represents a daily milk production record for a specific farm.
 * @typedef {Object} MilkProduction
 * @property {ObjectId} _id - Unique identifier for the milk production record.
 * @property {ObjectId} farm_id - Reference to the associated farm.
 * @property {Date} date - Date of milk production.
 * @property {number} volume_liters - Volume of milk produced on the specified date.
 * @property {Date} createdAt - Timestamp of when the register was added.
 * @property {Date} updatedAt - Timestamp of the last update on the register data.
 */
export const MilkProductionSchema = {
  _id: ObjectId,
  farm_id: {
    type: ObjectId,
    required: true,
    ref: "Farms",
  },
  date: {
    type: Date,
    required: true,
  },
  volume_liters: {
    type: Number,
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
 * Initializes the MilkProduction collection in MongoDB.
 * This function sets up the collection and necessary indexes for performance and search capabilities.
 */
export const initializeMilkProductionModel = async () => {
  const collectionName = "milk_production";

  // Define the indexes for the MilkProduction collection
  const indexes = [
    { fields: { farm_id: 1 } }, // Index on farm_id for farm-based queries
    { fields: { date: 1 } }, // Index on date for production date queries
  ];

  // Call the generic initialize function
  await initializeModel(collectionName, indexes);
};
