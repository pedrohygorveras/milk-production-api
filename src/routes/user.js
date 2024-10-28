import express from "express";
import { userController } from "../controllers/user.js";
import { authMiddleware } from "../middlewares/auth.js";

class UserRoutes {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    /**
     * @swagger
     * /api/users:
     *   get:
     *     summary: Get all users
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     description: Retrieve a list of all users. Requires a valid JWT token.
     *     responses:
     *       200:
     *         description: A list of users
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   email:
     *                     type: string
     *                     example: user@example.com
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
      userController.getAllUsers(req, res),
    );

    /**
     * @swagger
     * /api/users/{id}:
     *   delete:
     *     summary: Delete a user by ID
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     description: Deletes a user by their ID. Requires a valid JWT token.
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: The user ID
     *     responses:
     *       200:
     *         description: User deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 acknowledged:
     *                   type: boolean
     *                   example: true
     *                 deletedCount:
     *                   type: integer
     *                   example: 1
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
      userController.deleteUser(req, res),
    );
  }

  getRouter() {
    return this.router;
  }
}

export const userRoutes = new UserRoutes().getRouter();
