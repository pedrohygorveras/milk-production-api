import { farmService } from "../services/farm.js";
import { logger } from "../utils/logger.js";

class FarmController {
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

  getFarmById(req, res) {
    const farmId = req.params.id;
    return this._handleRequest(
      () => farmService.getFarmById(farmId),
      200,
      req,
      res,
      `Fetching farm and production milk with ID: ${farmId}`,
    );
  }

  createFarm(req, res) {
    const farmData = req.body;
    return this._handleRequest(
      () => farmService.createFarm(farmData),
      201,
      req,
      res,
      "Creating a new farm",
    );
  }

  updateFarm(req, res) {
    const farmId = req.params.id;
    const farmData = req.body;
    return this._handleRequest(
      () => farmService.updateFarm(farmId, farmData),
      200,
      req,
      res,
      `Updating farm with ID: ${farmId}`,
    );
  }

  deleteFarm(req, res) {
    const farmId = req.params.id;
    return this._handleRequest(
      () => farmService.deleteFarm(farmId),
      200,
      req,
      res,
      `Deleting farm with ID: ${farmId}`,
    );
  }
}

export const farmController = new FarmController();
