import { ObjectId } from "mongodb";
import { initializeModel } from "../scripts/initializeModel.js";

/**
 * Represents the monthly payment data for a farm based on production and price rules.
 * @typedef {Object} MonthlyPayment
 * @property {ObjectId} _id - Unique identifier for the monthly payment record.
 * @property {ObjectId} farm_id - Reference to the farm associated with this payment.
 * @property {number} year - Year corresponding to the payment record.
 * @property {number} month - Month corresponding to the payment record.
 * @property {number} price_per_liter - Final price per liter of milk for the month, calculated based on current pricing rules.
 * @property {number} total_volume_liters - Total volume of milk delivered by the farm during the month.
 * @property {number} total_payment - Total amount paid to the farm for milk production in the month, after applying pricing rules and bonuses.
 * @property {Date} createdAt - Timestamp of when the payment record was created.
 * @property {Date} updatedAt - Timestamp of the last update on the payment record.
 */
export const MonthlyPaymentSchema = {
  _id: ObjectId,
  farm_id: {
    type: ObjectId,
    required: true,
    ref: "Farms",
  },
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  price_per_liter: {
    type: Number,
    required: true,
  },
  total_volume_liters: {
    type: Number,
    required: true,
  },
  total_payment: {
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
 * Initializes the MonthlyPayment collection in MongoDB.
 * This function sets up the collection and necessary indexes for performance and data integrity.
 */
export const initializeMonthlyPaymentModel = async () => {
  const collectionName = "monthly_payments";

  // Define the indexes for the MonthlyPayment collection
  const indexes = [
    { fields: { farm_id: 1 } }, // Index on farm_id for farm-based queries
    { fields: { year: 1, month: 1 } }, // Compound index on year and month for time period queries
  ];

  // Call the generic initialize function
  await initializeModel(collectionName, indexes);
};
