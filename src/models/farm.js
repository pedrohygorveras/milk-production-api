import { ObjectId } from "mongodb";
import { initializeModel } from "../scripts/initializeModel.js";

/**
 * Represents a Farm in the system.
 * Each farm belongs to a single farmer and is associated with a location.
 * @typedef {Object} Farm
 * @property {ObjectId} _id - Unique identifier for the farm.
 * @property {ObjectId} farmer_id - Reference to the farmer who owns the farm.
 * @property {string} name - Name of the farm.
 * @property {Object} location - Geographical location of the farm.
 * @property {number} distance_to_factory_km - Distance to the factory in kilometers.
 * @property {Date} createdAt - Timestamp of when the register was added.
 * @property {Date} updatedAt - Timestamp of the last update on the register data.
 */
export const FarmSchema = {
  _id: ObjectId,
  farmer_id: {
    type: ObjectId,
    required: true,
    ref: "Farmers",
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  distance_to_factory_km: {
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
 * Initializes the Farm collection in MongoDB.
 * This function sets up the collection and necessary indexes for performance and search capabilities.
 */
export const initializeFarmModel = async () => {
  const collectionName = "farms";

  // Define the indexes for the Farm collection
  const indexes = [
    { fields: { farmer_id: 1 } }, // Index on farmer_id
    { fields: { name: 1 } }, // Index on name
    { fields: { "location.lat": 1, "location.lng": 1 } }, // Compound index on location
    { fields: { distance_to_factory_km: 1 } }, // Index on distance_to_factory_km
  ];

  // Call the generic initialize function
  await initializeModel(collectionName, indexes);
};
