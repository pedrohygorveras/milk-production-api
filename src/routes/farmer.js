import express from "express";
import { farmerController } from "../controllers/farmer.js";
import { check, validationResult } from "express-validator";
import { authMiddleware } from "../middlewares/auth.js";

class FarmerRoutes {
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
     * /api/farmers:
     *   get:
     *     summary: Retrieve a list of all farmers
     *     tags: [Farmers]
     *     security:
     *       - bearerAuth: []
     *     description: Retrieve a list of all farmers. Requires a valid JWT token.
     *     parameters:
     *       - in: header
     *         name: auth
     *         required: true
     *         schema:
     *           type: string
     *           example: Bearer your_jwt_token
     *         description: Bearer token to authorize the request
     *     responses:
     *       200:
     *         description: A list of farmers
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   _id:
     *                     type: string
     *                   name:
     *                     type: string
     *                   email:
     *                     type: string
     *                   phone:
     *                     type: string
     *                   createdAt:
     *                     type: string
     *                     format: date-time
     *                   updatedAt:
     *                     type: string
     *                     format: date-time
     *       400:
     *         description: Error Bad Request
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     */
    this.router.get("/", authMiddleware.verifyToken(), (req, res) =>
      farmerController.getAllFarmers(req, res),
    );

    /**
     * @swagger
     * /api/farmers/{id}:
     *   get:
     *     summary: Get a farmer by ID
     *     tags: [Farmers]
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
     *         description: The farmer ID
     *     responses:
     *       200:
     *         description: Farmer data
     *       400:
     *         description: Error Bad Request
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     */
    this.router.get("/:id", authMiddleware.verifyToken(), (req, res) =>
      farmerController.getFarmer(req, res),
    );

    /**
     * @swagger
     * /api/farmers:
     *   post:
     *     summary: Create a new farmer
     *     tags: [Farmers]
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
     *               name:
     *                 type: string
     *                 example: "John Doe"
     *               email:
     *                 type: string
     *                 example: "john.doe@example.com"
     *               phone:
     *                 type: string
     *                 example: "+1234567890"
     *     responses:
     *       201:
     *         description: The farmer was successfully created
     *       400:
     *         description: Error Bad Request
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     */
    this.router.post(
      "/",
      authMiddleware.verifyToken(),
      this.validateRequest([
        check("name").notEmpty().withMessage("Name cannot be empty"),
        check("email").isEmail().withMessage("Valid email is required"),
        check("phone").notEmpty().withMessage("Phone number cannot be empty"),
      ]),
      (req, res) => farmerController.createFarmer(req, res),
    );

    /**
     * @swagger
     * /api/farmers/{id}:
     *   patch:
     *     summary: Partially update a farmer by ID
     *     tags: [Farmers]
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
     *         description: The farmer ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: "Jane Doe"
     *               email:
     *                 type: string
     *                 example: "jane.doe@example.com"
     *               phone:
     *                 type: string
     *                 example: "+1987654321"
     *     responses:
     *       200:
     *         description: The farmer was successfully updated
     *       400:
     *         description: Error Bad Request
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     */
    this.router.patch(
      "/:id",
      authMiddleware.verifyToken(),
      this.validateRequest([
        check("name").optional().notEmpty().withMessage("Name cannot be empty"),
        check("email")
          .optional()
          .isEmail()
          .withMessage("Valid email is required"),
        check("phone")
          .optional()
          .notEmpty()
          .withMessage("Phone number cannot be empty"),
      ]),
      (req, res) => farmerController.updateFarmer(req, res),
    );

    /**
     * @swagger
     * /api/farmers/{id}:
     *   delete:
     *     summary: Delete a farmer by ID
     *     tags: [Farmers]
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
     *         description: The farmer ID
     *     responses:
     *       200:
     *         description: Farmer deleted successfully
     *       400:
     *         description: Error Bad Request
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     */
    this.router.delete("/:id", authMiddleware.verifyToken(), (req, res) =>
      farmerController.deleteFarmerCascade(req, res),
    );
  }

  getRouter() {
    return this.router;
  }
}

export const farmerRoutes = new FarmerRoutes().getRouter();
