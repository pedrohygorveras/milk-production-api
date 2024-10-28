import express from "express";
import { paymentController } from "../controllers/payment.js";
import { check, validationResult } from "express-validator";
import { authMiddleware } from "../middlewares/auth.js";

class PaymentRoutes {
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
     * /api/payments/{id}/price-per-liter:
     *   get:
     *     summary: Get the price per liter of milk for a specific farm by month and year
     *     tags: [Payments]
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
     *         description: The year of the payment
     *       - in: query
     *         name: month
     *         schema:
     *           type: integer
     *           minimum: 1
     *           maximum: 12
     *           example: 5
     *         required: true
     *         description: The month of the payment (1-12)
     *     responses:
     *       200:
     *         description: The price per liter data for the specified farm, year, and month
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 price_per_liter:
     *                   type: object
     *                   properties:
     *                     br:
     *                       type: string
     *                       example: "R$ 1.80"
     *                     en:
     *                       type: string
     *                       example: "$0.35"
     *                 total_payment:
     *                   type: number
     *                   example: 1050.75
     *                 total_volume_liters:
     *                   type: number
     *                   example: 3000
     *       401:
     *         description: Unauthorized - Invalid or missing token
     *       400:
     *         description: Bad request, validation failed
     *       404:
     *         description: Payment data not found
     *       500:
     *         description: Internal server error
     */
    this.router.get(
      "/:id/price-per-liter",
      authMiddleware.verifyToken(),
      this.validateRequest([
        check("id").notEmpty().withMessage("Farm ID cannot be empty"),
        check("year")
          .isInt({ min: 1900 })
          .withMessage("Year must be a valid integer"),
        check("month")
          .isInt({ min: 1, max: 12 })
          .withMessage("Month must be between 1 and 12"),
      ]),
      (req, res) => paymentController.getPricePerLiterByFarmAndMonth(req, res),
    );

    /**
     * @swagger
     * /api/payments/{id}/price-per-liter-year:
     *   get:
     *     summary: Get the price per liter of milk for each month of a specific year for a farm
     *     tags: [Payments]
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
     *         description: The year for which to fetch the payment data
     *     responses:
     *       200:
     *         description: The price per liter data for each month of the specified year
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   month:
     *                     type: integer
     *                     example: 5
     *                   price_per_liter:
     *                     type: object
     *                     properties:
     *                       br:
     *                         type: string
     *                         example: "R$ 1.85"
     *                       en:
     *                         type: string
     *                         example: "$0.36"
     *                   total_payment:
     *                     type: number
     *                     example: 1100.50
     *                   total_volume_liters:
     *                     type: number
     *                     example: 3100
     *       401:
     *         description: Unauthorized - Invalid or missing token
     *       400:
     *         description: Bad request, validation failed
     *       404:
     *         description: Payment data not found
     *       500:
     *         description: Internal server error
     */
    this.router.get(
      "/:id/price-per-liter-year",
      authMiddleware.verifyToken(),
      this.validateRequest([
        check("id").notEmpty().withMessage("Farm ID cannot be empty"),
        check("year")
          .isInt({ min: 1900 })
          .withMessage("Year must be a valid integer"),
      ]),
      (req, res) => paymentController.getPricePerLiterByFarmAndYear(req, res),
    );

    /**
     * @swagger
     * /api/payments:
     *   post:
     *     summary: Create a new payment
     *     tags: [Payments]
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
     *               farm_id:
     *                 type: string
     *                 example: "60d21b4667d0d8992e610c85"
     *               year:
     *                 type: number
     *                 example: 2023
     *               month:
     *                 type: number
     *                 example: 5
     *     responses:
     *       201:
     *         description: Payment successfully created
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
        check("farm_id").notEmpty().withMessage("Farm ID cannot be empty"),
        check("year").isInt().withMessage("Year must be a number"),
        check("month").isInt().withMessage("Month must be a number"),
      ]),
      (req, res) => paymentController.createPayment(req, res),
    );

    /**
     * @swagger
     * /api/payments/{id}:
     *   patch:
     *     summary: Partially update a payment by ID
     *     tags: [Payments]
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
     *           example: "60d21b4667d0d8992e610c86"
     *         required: true
     *         description: The payment ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               year:
     *                 type: number
     *                 example: 2023
     *               month:
     *                 type: number
     *                 example: 5
     *               price_per_liter:
     *                 type: number
     *                 example: 1.85
     *               total_volume_liters:
     *                 type: number
     *                 example: 3500
     *               total_payment:
     *                 type: number
     *                 example: 6475.50
     *     responses:
     *       200:
     *         description: Payment successfully updated
     *       401:
     *         description: Unauthorized - Invalid or missing token
     *       400:
     *         description: Bad request, validation failed
     *       404:
     *         description: Payment not found
     *       500:
     *         description: Internal server error
     */
    this.router.patch(
      "/:id",
      authMiddleware.verifyToken(),
      this.validateRequest([
        check("year").optional().isInt().withMessage("Year must be a number"),
        check("month").optional().isInt().withMessage("Month must be a number"),
        check("price_per_liter")
          .optional()
          .isFloat()
          .withMessage("Price per liter must be a number"),
        check("total_volume_liters")
          .optional()
          .isFloat()
          .withMessage("Total volume must be a number"),
        check("total_payment")
          .optional()
          .isFloat()
          .withMessage("Total payment must be a number"),
      ]),
      (req, res) => paymentController.updatePayment(req, res),
    );

    /**
     * @swagger
     * /api/payments/{id}:
     *   delete:
     *     summary: Delete a payment by ID
     *     tags: [Payments]
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
     *         description: The payment ID
     *     responses:
     *       200:
     *         description: Payment successfully deleted
     *       401:
     *         description: Unauthorized - Invalid or missing token
     *       404:
     *         description: Payment not found
     *       500:
     *         description: Internal server error
     */
    this.router.delete("/:id", authMiddleware.verifyToken(), (req, res) =>
      paymentController.deletePayment(req, res),
    );
  }

  getRouter() {
    return this.router;
  }
}

export const paymentRoutes = new PaymentRoutes().getRouter();
