import { userService } from "../services/user.js";
import { logger } from "../utils/logger.js";

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    const userId = req.params.id;
    try {
      await userService.deleteUser(userId);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      logger.error(error.message);
      res.status(404).json({ error: error.message });
    }
  }
}

export const userController = new UserController();
