import express from "express";
import { authController } from "../controllers/auth.js";
import { check } from "express-validator";
import { ValidateNoExtraFieldsMiddleware } from "../middlewares/validateExtraFields.js";

class AuthRoutes {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Allowed fields for the register route
    const allowedFieldsForRegister = ["email", "password"];

    // Instance of the middleware to validate extra fields
    const validateRegisterFields = new ValidateNoExtraFieldsMiddleware(
      allowedFieldsForRegister,
    );

    /**
     * @swagger
     * /api/auth/register:
     *   post:
     *     summary: Register a new user
     *     tags: [Auth]
     *     description: Register a new user with email and password. The password must be at least 8 characters long.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 description: The email address of the user
     *                 example: user@example.com
     *               password:
     *                 type: string
     *                 format: password
     *                 description: The password of the user minimum length 8 characters
     *                 example: password123
     *     responses:
     *       201:
     *         description: User registered successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: User registered successfully
     *                 user:
     *                   type: object
     *                   properties:
     *                     acknowledged:
     *                       type: boolean
     *                       example: true
     *                     insertedId:
     *                       type: string
     *                       example: 671f77672d0b2f1c584cc1bd
     *       400:
     *         description: Error Bad Request
     *       500:
     *         description: Internal server error
     */
    this.router.post(
      "/register",
      [
        check("email").isEmail().withMessage("Invalid email format"),
        check("password")
          .isLength({ min: 8 })
          .withMessage("Password must be at least 8 characters"),
        validateRegisterFields.validate(),
      ],
      (req, res) => authController.register(req, res),
    );

    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     summary: Authenticate a user
     *     tags: [Auth]
     *     description: Log in a user using their email and password to receive a JWT token.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 description: The email address of the user
     *                 example: user@example.com
     *               password:
     *                 type: string
     *                 format: password
     *                 description: The password of the user
     *                 example: password123
     *     responses:
     *       200:
     *         description: User logged in successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     *       400:
     *         description: Invalid credentials
     *       500:
     *         description: Internal server error
     */
    this.router.post(
      "/login",
      [
        check("email").isEmail().withMessage("Invalid email format"),
        check("password").notEmpty().withMessage("Password is required"),
      ],
      (req, res) => authController.login(req, res),
    );
  }

  getRouter() {
    return this.router;
  }
}

export const authRoutes = new AuthRoutes().getRouter();
