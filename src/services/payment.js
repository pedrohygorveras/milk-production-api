import { ObjectId } from "mongodb";
import { paymentRepository } from "../repositories/payment.js";
import { logger } from "../utils/logger.js";
import { farmRepository } from "../repositories/farm.js";
import { milkProductionRepository } from "../repositories/milkProduction.js";
import CC from "currency-converter-lt";

class PaymentService {
  /**
   * Converts a string ID to ObjectId format, logging an error if the format is invalid.
   * @param {string} id - ID to format.
   * @returns {ObjectId} - Formatted ObjectId.
   * @throws {Error} - If the ID format is invalid.
   */
  _formatObjectId(id) {
    try {
      return ObjectId.createFromHexString(id);
    } catch (error) {
      logger.error(error);
      throw new Error(`Invalid ID format: ${id}`);
    }
  }

  /**
   * Calculates the price per liter based on farm details and monthly volume.
   * Includes transport cost and seasonal bonuses.
   * @param {Object} farm - The farm data.
   * @param {number} volume - Total milk volume in liters.
   * @param {number} month - The month for which the price is calculated.
   * @returns {number} - Calculated price per liter.
   */
  _calculatePricePerLiter(farm, volume, month) {
    const isFirstSemester = month >= 1 && month <= 6;
    const basePrice = isFirstSemester ? 1.8 : 1.95;
    const bonus = !isFirstSemester && volume > 10000 ? 0.01 : 0;

    const distance = farm.distance_to_factory_km;
    const costPerKm = distance <= 50 ? 0.05 : 0.06;
    const transportCost = costPerKm * distance;

    const pricePerLiter = basePrice - transportCost + (bonus * volume) / volume;
    return pricePerLiter;
  }

  /**
   * Retrieves the price per liter for a farm for a specific month and year,
   * and converts the price to USD.
   * @param {string} farmId - The ID of the farm.
   * @param {number} year - The year for the calculation.
   * @param {number} month - The month for the calculation.
   * @returns {Promise<Object>} - Price per liter in BRL and USD, total payment, and total volume.
   */
  async getPricePerLiterByFarmAndMonth(farmId, year, month) {
    const farmIdFormatted = this._formatObjectId(farmId);
    const farm = await farmRepository.getFarmById(farmIdFormatted);

    if (!farm) {
      return { message: "Farm not found" };
    }

    const payment = await paymentRepository.getPricePerLiterByFarmAndMonth(
      farmIdFormatted,
      year,
      month,
    );

    if (!payment) {
      return { message: "No payment data found for this period" };
    }

    const pricePerLiter = this._calculatePricePerLiter(
      farm,
      payment.total_volume_liters,
      month,
    );

    const priceBR = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(pricePerLiter);

    const currencyConverter = new CC({
      from: "BRL",
      to: "USD",
      amount: pricePerLiter,
    });

    try {
      const convertedPriceUSD = await currencyConverter.convert();
      const priceEN = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(convertedPriceUSD);

      return {
        price_per_liter: {
          BRL: priceBR,
          USD: priceEN,
        },
        total_payment: parseFloat(payment.total_payment).toFixed(2),
        total_volume_liters: parseFloat(payment.total_volume_liters).toFixed(2),
      };
    } catch (error) {
      logger.error(`Currency conversion failed: ${error.message}`);
      throw new Error("Currency conversion failed");
    }
  }

  /**
   * Retrieves the price per liter for each month of a specified year for a farm,
   * converting each monthly price to USD.
   * @param {string} farmId - The ID of the farm.
   * @param {number} year - The year for the calculations.
   * @returns {Promise<Array>} - Monthly prices per liter and total volumes in BRL and USD.
   */
  async getPricePerLiterByFarmAndYear(farmId, year) {
    const farmIdFormatted = this._formatObjectId(farmId);
    const farm = await farmRepository.getFarmById(farmIdFormatted);

    if (!farm) {
      return { message: "Farm not found" };
    }

    const payments = await paymentRepository.getPricePerLiterByFarmAndYear(
      farmIdFormatted,
      year,
    );

    if (payments.length === 0) {
      return { message: "No payment data found for this year" };
    }

    const convertedPayments = await Promise.all(
      payments.map(async (payment) => {
        const pricePerLiter = this._calculatePricePerLiter(
          farm,
          payment.total_volume_liters,
          payment.month,
        );

        const priceBR = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(pricePerLiter);

        const currencyConverter = new CC({
          from: "BRL",
          to: "USD",
          amount: pricePerLiter,
        });

        try {
          const convertedPriceUSD = await currencyConverter.convert();
          const priceEN = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(convertedPriceUSD);

          return {
            month: payment.month,
            price_per_liter: {
              BRL: priceBR,
              USD: priceEN,
            },
            total_payment: parseFloat(payment.total_payment).toFixed(2),
            total_volume_liters: parseFloat(
              payment.total_volume_liters,
            ).toFixed(2),
          };
        } catch (error) {
          logger.error(
            `Currency conversion failed for month ${payment.month}: ${error.message}`,
          );
          throw new Error("Currency conversion failed");
        }
      }),
    );

    return convertedPayments;
  }

  /**
   * Creates a new payment record, calculating total volume and payment.
   * @param {Object} paymentData - Data for the payment record.
   * @returns {Promise<Object>} - The created payment data.
   */
  async createPayment(paymentData) {
    logger.info("Creating a new payment record");
    const { farm_id, year, month } = paymentData;
    const farmIdFormatted = this._formatObjectId(farm_id);
    const farm = await farmRepository.getFarmById(farmIdFormatted);

    if (!farm) {
      throw new Error("Farm not found");
    }

    const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59));

    const milkProductions =
      await milkProductionRepository.getMilkProductionsByYearAndMonth(
        farmIdFormatted,
        startOfMonth,
        endOfMonth,
      );

    if (milkProductions.length === 0) {
      throw new Error("No milk production data found for this period");
    }

    const totalVolumeLiters = milkProductions.reduce(
      (sum, prod) => sum + prod.volume_liters,
      0,
    );

    const pricePerLiter = this._calculatePricePerLiter(
      farm,
      totalVolumeLiters,
      month,
    );

    const totalPayment = pricePerLiter * totalVolumeLiters;

    const paymentDataFormatted = {
      ...paymentData,
      farm_id: farmIdFormatted,
      price_per_liter: pricePerLiter,
      total_volume_liters: totalVolumeLiters,
      total_payment: totalPayment,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await paymentRepository.createPayment(paymentDataFormatted);
  }

  /**
   * Updates a payment record with new data.
   * @param {string} paymentId - ID of the payment to update.
   * @param {Object} paymentData - Updated payment data.
   * @returns {Promise<Object>} - The updated payment data.
   */
  async updatePayment(paymentId, paymentData) {
    logger.info(`Updating payment with ID: ${paymentId}`);
    const paymentIdFormatted = this._formatObjectId(paymentId);
    return await paymentRepository.updatePayment(
      paymentIdFormatted,
      paymentData,
    );
  }

  /**
   * Deletes a payment record.
   * @param {string} paymentId - ID of the payment to delete.
   * @returns {Promise<Object>} - Result of the deletion.
   */
  async deletePayment(paymentId) {
    logger.info(`Deleting payment with ID: ${paymentId}`);
    const paymentIdFormatted = this._formatObjectId(paymentId);
    return await paymentRepository.deletePayment(paymentIdFormatted);
  }
}

export const paymentService = new PaymentService();
