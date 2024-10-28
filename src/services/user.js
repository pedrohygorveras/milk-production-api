import { ObjectId } from "mongodb";
import { userRepository } from "../repositories/user.js";

class UserService {
  /**
   * Converts a string ID to ObjectId format. Logs an error if the format is invalid.
   * @param {string} id - ID to format.
   * @returns {ObjectId} - Formatted ObjectId.
   * @throws {Error} - If the ID format is invalid.
   */
  _formatObjectId(id) {
    try {
      return ObjectId.createFromHexString(id);
    } catch (error) {
      logger.error(error);
      throw new Error(`Invalid ID format: ${id}`);
    }
  }

  /**
   * Retrieves all users from the database.
   * @returns {Promise<Array>} - List of all users.
   */
  async getAllUsers() {
    return await userRepository.getAllUsers();
  }

  /**
   * Deletes a user by ID. Throws an error if the user is not found.
   * @param {string} userId - ID of the user to delete.
   * @returns {Promise<Object>} - Result of the deletion operation.
   * @throws {Error} - If the user is not found.
   */
  async deleteUser(userId) {
    const formattedId = this._formatObjectId(userId);
    const deletedUser = await userRepository.deleteUser(formattedId);
    if (!deletedUser.deletedCount) {
      throw new Error("User not found");
    }
    return deletedUser;
  }
}

export const userService = new UserService();
