import express from "express";
import { farmController } from "../controllers/farm.js";
import { check, validationResult } from "express-validator";
import { authMiddleware } from "../middlewares/auth.js";

class FarmRoutes {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  validateRequest(validations) {
    return async (req, res, next) => {
      await Promise.all(validations.map((validation) => validation.run(req)));
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    };
  }

  initializeRoutes() {
    /**
     * @swagger
     * /api/farms/{id}:
     *   get:
     *     summary: Get a farm by ID
     *     tags: [Farms]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: header
     *         name: auth
     *         required: true
     *         schema:
     *           type: string
     *           example: Bearer your_jwt_token
     *         description: Bearer token to authorize the request
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           example: "60d21b4667d0d8992e610c85"
     *         required: true
     *         description: The farm ID
     *     responses:
     *       200:
     *         description: Farm data
     *       401:
     *         description: Unauthorized - Invalid or missing token
     *       404:
     *         description: Farm not found
     *       500:
     *         description: Internal server error
     */
    this.router.get("/:id", authMiddleware.verifyToken(), (req, res) =>
      farmController.getFarmById(req, res),
    );

    /**
     * @swagger
     * /api/farms:
     *   post:
     *     summary: Create a new farm
     *     tags: [Farms]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: header
     *         name: auth
     *         required: true
     *         schema:
     *           type: string
     *           example: Bearer your_jwt_token
     *         description: Bearer token to authorize the request
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               farmer_id:
     *                 type: string
     *                 example: "60d21b4667d0d8992e610c85"
     *                 description: The ID of the farmer associated with the farm
     *               name:
     *                 type: string
     *                 example: "Green Valley Farm"
     *                 description: The name of the farm
     *               location:
     *                 type: object
     *                 properties:
     *                   lat:
     *                     type: number
     *                     example: -23.5505
     *                     description: Latitude of the farm
     *                   lng:
     *                     type: number
     *                     example: -46.6333
     *                     description: Longitude of the farm
     *               distance_to_factory_km:
     *                 type: number
     *                 example: 15.2
     *                 description: The distance of the farm to the factory in kilometers
     *     responses:
     *       201:
     *         description: Farm successfully created
     *       401:
     *         description: Unauthorized - Invalid or missing token
     *       400:
     *         description: Bad request, validation failed
     *       500:
     *         description: Internal server error
     */
    this.router.post(
      "/",
      authMiddleware.verifyToken(),
      this.validateRequest([
        check("farmer_id").notEmpty().withMessage("Farmer ID cannot be empty"),
        check("name").notEmpty().withMessage("Farm name cannot be empty"),
        check("location.lat")
          .isFloat()
          .withMessage("Latitude must be a number"),
        check("location.lng")
          .isFloat()
          .withMessage("Longitude must be a number"),
        check("distance_to_factory_km")
          .isFloat()
          .withMessage("Distance to factory must be a number"),
      ]),
      (req, res) => farmController.createFarm(req, res),
    );

    /**
     * @swagger
     * /api/farms/{id}:
     *   patch:
     *     summary: Update farm information
     *     tags: [Farms]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: header
     *         name: auth
     *         required: true
     *         schema:
     *           type: string
     *           example: Bearer your_jwt_token
     *         description: Bearer token to authorize the request
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           example: "60d21b4667d0d8992e610c85"
     *         required: true
     *         description: The farm ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: "Blue Hills Farm"
     *                 description: The name of the farm
     *               location:
     *                 type: object
     *                 properties:
     *                   lat:
     *                     type: number
     *                     example: -24.5505
     *                     description: Latitude of the farm
     *                   lng:
     *                     type: number
     *                     example: -47.6333
     *                     description: Longitude of the farm
     *               distance_to_factory_km:
     *                 type: number
     *                 example: 20.5
     *                 description: The distance of the farm to the factory in kilometers
     *     responses:
     *       200:
     *         description: Farm successfully updated
     *       401:
     *         description: Unauthorized - Invalid or missing token
     *       400:
     *         description: Bad request, validation failed
     *       404:
     *         description: Farm not found
     *       500:
     *         description: Internal server error
     */
    this.router.patch(
      "/:id",
      authMiddleware.verifyToken(),
      this.validateRequest([
        check("name")
          .optional()
          .notEmpty()
          .withMessage("Farm name cannot be empty"),
        check("location.lat")
          .optional()
          .isFloat()
          .withMessage("Latitude must be a number"),
        check("location.lng")
          .optional()
          .isFloat()
          .withMessage("Longitude must be a number"),
        check("distance_to_factory_km")
          .optional()
          .isFloat()
          .withMessage("Distance to factory must be a number"),
      ]),
      (req, res) => farmController.updateFarm(req, res),
    );

    /**
     * @swagger
     * /api/farms/{id}:
     *   delete:
     *     summary: Delete a farm by ID
     *     tags: [Farms]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: header
     *         name: auth
     *         required: true
     *         schema:
     *           type: string
     *           example: Bearer your_jwt_token
     *         description: Bearer token to authorize the request
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           example: "60d21b4667d0d8992e610c85"
     *         required: true
     *         description: The farm ID
     *     responses:
     *       200:
     *         description: Farm successfully deleted
     *       401:
     *         description: Unauthorized - Invalid or missing token
     *       404:
     *         description: Farm not found
     *       500:
     *         description: Internal server error
     */
    this.router.delete("/:id", authMiddleware.verifyToken(), (req, res) =>
      farmController.deleteFarm(req, res),
    );
  }

  getRouter() {
    return this.router;
  }
}

export const farmRoutes = new FarmRoutes().getRouter();
