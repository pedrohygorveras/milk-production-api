import { paymentService } from "../services/payment.js";
import { logger } from "../utils/logger.js";

class PaymentController {
  async _handleRequest(serviceMethod, successStatus, req, res, logMessage) {
    try {
      logger.info(logMessage);
      const result = await serviceMethod();
      return res.status(successStatus).json(result);
    } catch (error) {
      logger.error(`${logMessage} failed: ${error.message}`);
      return res
        .status(500)
        .json({ error: `${logMessage} failed: ${error?.message}` });
    }
  }

  async getPricePerLiterByFarmAndMonth(req, res) {
    const { id } = req.params;
    const { year, month } = req.query;

    try {
      const result = await paymentService.getPricePerLiterByFarmAndMonth(
        id,
        parseInt(year),
        parseInt(month),
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getPricePerLiterByFarmAndYear(req, res) {
    const { id } = req.params;
    const { year } = req.query;

    try {
      const result = await paymentService.getPricePerLiterByFarmAndYear(
        id,
        parseInt(year),
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  createPayment(req, res) {
    const paymentData = req.body;
    return this._handleRequest(
      () => paymentService.createPayment(paymentData),
      201,
      req,
      res,
      "Creating a new payment record",
    );
  }

  updatePayment(req, res) {
    const paymentId = req.params.id;
    const paymentData = req.body;
    return this._handleRequest(
      () => paymentService.updatePayment(paymentId, paymentData),
      200,
      req,
      res,
      `Updating payment record with ID: ${paymentId}`,
    );
  }

  deletePayment(req, res) {
    const paymentId = req.params.id;
    return this._handleRequest(
      () => paymentService.deletePayment(paymentId),
      200,
      req,
      res,
      `Deleting payment record with ID: ${paymentId}`,
    );
  }
}

export const paymentController = new PaymentController();
