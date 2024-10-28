import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/auth.js";
import dotenv from "dotenv";
import { logger } from "../utils/logger.js";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

class AuthService {
  async register(userData) {
    const existingUser = await userRepository.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    return await userRepository.createUser(userData);
  }

  async login(email, password) {
    const user = await userRepository.getUserByEmail(email);
    if (!user || user.password !== password) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "1h",
    });
    return { token };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (error) {
      logger.error(error);
      throw new Error("Invalid token");
    }
  }
}

export const authService = new AuthService();
