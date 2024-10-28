import express from "express";
import { milkProductionController } from "../controllers/milkProduction.js";
import { check, validationResult } from "express-validator";
import { authMiddleware } from "../middlewares/auth.js";

class MilkProductionRoutes {
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
     * /api/milk-productions/{id}:
     *   get:
     *     summary: Get milk production for a farm by year and month
     *     tags: [MilkProductions]
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
     *       - in: query
     *         name: year
     *         schema:
     *           type: integer
     *           example: 2023
     *         required: true
     *         description: The year for which to fetch milk production (e.g., 2023)
     *       - in: query
     *         name: month
     *         schema:
     *           type: integer
     *           example: 5
     *         required: true
     *         description: The month for which to fetch milk production (1-12)
     *     responses:
     *       200:
     *         description: Milk production data
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 dailyProductions:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       _id:
     *                         type: string
     *                         example: "671fb60052aeb10e9dbd1f01"
     *                       volume_liters:
     *                         type: number
     *                         example: 120.5
     *                       date:
     *                         type: string
     *                         format: date-time
     *                         example: "2023-05-10T14:30:00.000Z"
     *                 averageLiters:
     *                   type: string
     *                   example: "120.50"
     *       401:
     *         description: Unauthorized - Invalid or missing token
     *       404:
     *         description: Farm not found
     *       500:
     *         description: Internal server error
     */
    this.router.get(
      "/:id",
      authMiddleware.verifyToken(),
      this.validateRequest([
        check("id").notEmpty().withMessage("Farm ID cannot be empty"),
        check("year").isInt({ min: 1900 }).withMessage("Invalid year"),
        check("month")
          .isInt({ min: 1, max: 12 })
          .withMessage("Month must be between 1 and 12"),
      ]),
      (req, res) =>
        milkProductionController.getMilkProductionByYearAndMonth(req, res),
    );

    /**
     * @swagger
     * /api/milk-productions:
     *   post:
     *     summary: Create a new milk production record
     *     tags: [MilkProductions]
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
     *                 description: The ID of the farmer associated with the production
     *               farm_id:
     *                 type: string
     *                 example: "60d21b4667d0d8992e610c86"
     *                 description: The ID of the farm associated with the production
     *               date:
     *                 type: string
     *                 format: date-time
     *                 example: "2023-05-15T14:30:00Z"
     *                 description: The date of the milk production
     *               volume_liters:
     *                 type: number
     *                 example: 120.5
     *                 description: The volume of milk produced in liters
     *     responses:
     *       201:
     *         description: Milk production record created successfully
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
        check("farm_id").notEmpty().withMessage("Farm ID cannot be empty"),
        check("date").isISO8601().withMessage("Valid date is required"),
        check("volume_liters")
          .isFloat({ gt: 0 })
          .withMessage("Volume in liters must be a positive number"),
      ]),
      (req, res) => milkProductionController.createMilkProduction(req, res),
    );

    /**
     * @swagger
     * /api/milk-productions/{id}:
     *   patch:
     *     summary: Update a milk production record by ID
     *     tags: [MilkProductions]
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
     *           example: "60d21b4667d0d8992e610c87"
     *         required: true
     *         description: The milk production record ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               date:
     *                 type: string
     *                 format: date-time
     *                 example: "2023-05-16T14:30:00Z"
     *                 description: The date of the milk production
     *               volume_liters:
     *                 type: number
     *                 example: 135.0
     *                 description: The volume of milk produced in liters
     *     responses:
     *       200:
     *         description: Milk production record updated successfully
     *       401:
     *         description: Unauthorized - Invalid or missing token
     *       400:
     *         description: Bad request, validation failed
     *       404:
     *         description: Milk production record not found
     *       500:
     *         description: Internal server error
     */
    this.router.patch(
      "/:id",
      authMiddleware.verifyToken(),
      this.validateRequest([
        check("date")
          .optional()
          .isISO8601()
          .withMessage("Valid date is required"),
        check("volume_liters")
          .optional()
          .isFloat({ gt: 0 })
          .withMessage("Volume in liters must be a positive number"),
      ]),
      (req, res) => milkProductionController.updateMilkProduction(req, res),
    );

    /**
     * @swagger
     * /api/milk-productions/{id}:
     *   delete:
     *     summary: Delete a milk production record by ID
     *     tags: [MilkProductions]
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
     *           example: "60d21b4667d0d8992e610c88"
     *         required: true
     *         description: The milk production record ID
     *     responses:
     *       200:
     *         description: Milk production record deleted successfully
     *       401:
     *         description: Unauthorized - Invalid or missing token
     *       404:
     *         description: Milk production record not found
     *       500:
     *         description: Internal server error
     */
    this.router.delete("/:id", authMiddleware.verifyToken(), (req, res) =>
      milkProductionController.deleteMilkProduction(req, res),
    );
  }

  getRouter() {
    return this.router;
  }
}

export const milkProductionRoutes = new MilkProductionRoutes().getRouter();
