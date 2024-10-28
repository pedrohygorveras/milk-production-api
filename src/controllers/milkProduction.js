import { milkProductionService } from "../services/milkProduction.js";
import { logger } from "../utils/logger.js";

class MilkProductionController {
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

  getMilkProductionByYearAndMonth(req, res) {
    const farmId = req.params.id;
    const { year, month } = req.query;
    return this._handleRequest(
      () =>
        milkProductionService.getMilkProductionByYearAndMonth(
          farmId,
          parseInt(year),
          parseInt(month),
        ),
      200,
      req,
      res,
      `Fetching milk production for farm with ID: ${farmId}, year: ${year}, and month: ${month}`,
    );
  }

  createMilkProduction(req, res) {
    const milkProductionData = req.body;
    return this._handleRequest(
      () => milkProductionService.createMilkProduction(milkProductionData),
      201,
      req,
      res,
      "Creating a new milk production record",
    );
  }

  updateMilkProduction(req, res) {
    const milkProductionId = req.params.id;
    const milkProductionData = req.body;
    return this._handleRequest(
      () =>
        milkProductionService.updateMilkProduction(
          milkProductionId,
          milkProductionData,
        ),
      200,
      req,
      res,
      `Updating milk production record with ID: ${milkProductionId}`,
    );
  }

  deleteMilkProduction(req, res) {
    const milkProductionId = req.params.id;
    return this._handleRequest(
      () => milkProductionService.deleteMilkProduction(milkProductionId),
      200,
      req,
      res,
      `Deleting milk production record with ID: ${milkProductionId}`,
    );
  }
}

export const milkProductionController = new MilkProductionController();
