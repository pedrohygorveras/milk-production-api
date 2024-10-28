import { farmerService } from "../services/farmer.js";
import { logger } from "../utils/logger.js";

class FarmerController {
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

  getAllFarmers(req, res) {
    return this._handleRequest(
      () => farmerService.getAllFarmers(),
      200,
      req,
      res,
      "Fetching all farmers",
    );
  }

  getFarmer(req, res) {
    const farmerId = req.params.id;
    return this._handleRequest(
      () => farmerService.getFarmerById(farmerId),
      200,
      req,
      res,
      `Fetching farmer with ID: ${farmerId}`,
    );
  }

  createFarmer(req, res) {
    const farmerData = req.body;
    return this._handleRequest(
      () => farmerService.createFarmer(farmerData),
      201,
      req,
      res,
      "Creating a new farmer",
    );
  }

  updateFarmer(req, res) {
    const farmerId = req.params.id;
    const farmerData = req.body;
    return this._handleRequest(
      () => farmerService.updateFarmer(farmerId, farmerData),
      200,
      req,
      res,
      `Updating farmer with ID: ${farmerId}`,
    );
  }

  deleteFarmerCascade(req, res) {
    const farmerId = req.params.id;
    return this._handleRequest(
      () => farmerService.deleteFarmerCascade(farmerId),
      200,
      req,
      res,
      `Deleting farmer with ID: ${farmerId}`,
    );
  }
}

export const farmerController = new FarmerController();
