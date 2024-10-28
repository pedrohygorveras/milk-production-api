import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/auth.js";
import dotenv from "dotenv";
import { logger } from "../utils/logger.js";

// Load environment variables from .env file
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

/**
 * AuthService Class
 * Handles user registration, login, and token verification with JWT.
 */
class AuthService {
  /**
   * Registers a new user if not already in the database.
   * @param {Object} userData - User data to register.
   * @returns {Promise<Object>} - The newly created user data.
   * @throws {Error} - If user already exists.
   */
  async register(userData) {
    const existingUser = await userRepository.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    return await userRepository.createUser(userData);
  }

  /**
   * Authenticates a user and generates a JWT if credentials are valid.
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   * @returns {Promise<Object>} - Object with the generated JWT.
   * @throws {Error} - If credentials are invalid.
   */
  async login(email, password) {
    const user = await userRepository.getUserByEmail(email);
    if (!user || user.password !== password) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT with user ID and expiration
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "1h",
    });
    return { token };
  }

  /**
   * Verifies the validity of a JWT.
   * @param {string} token - JWT to verify.
   * @returns {Object} - Decoded payload if valid.
   * @throws {Error} - If token is invalid or expired.
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (error) {
      logger.error(error);
      throw new Error("Invalid token");
    }
  }
}

// Export an instance of AuthService
export const authService = new AuthService();
