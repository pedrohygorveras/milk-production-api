import { authService } from "../services/auth.js";
import { logger } from "../utils/logger.js";

/**
 * Middleware class for handling authentication and authorization.
 * Verifies the JWT token from the request header and ensures the user is authenticated.
 * If the token is valid, the user data is attached to the request object for further processing.
 * If the token is missing or invalid, an appropriate error response is returned.
 */
class AuthMiddleware {
  /**
   * Middleware function to verify the JWT token.
   * Ensures that the user is authenticated before proceeding to the next middleware or route handler.
   * @returns {Function} - The Express middleware function to verify the token.
   */
  verifyToken() {
    return (req, res, next) => {
      // Extracts the token from the auth header
      const token = req.headers.auth?.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ error: "Access denied. No token provided." });
      }

      try {
        // Verifies the token using the auth service
        const decoded = authService.verifyToken(token);
        // Attaches the decoded user data to the request object
        req.user = decoded;
        // Proceeds to the next middleware or route handler
        next();
      } catch (error) {
        logger.error(error);
        // Returns a 401 response if the token is invalid
        return res.status(401).json({ error: "Invalid token." });
      }
    };
  }
}

export const authMiddleware = new AuthMiddleware();
