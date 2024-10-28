import { authService } from "../services/auth.js";
import { logger } from "../utils/logger.js";

class AuthController {
  async register(req, res) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      logger.error(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { token } = await authService.login(email, password);
      res.status(200).json({ token });
    } catch (error) {
      logger.error(error.message);
      res.status(400).json({ error: error.message });
    }
  }
}

export const authController = new AuthController();
