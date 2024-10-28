import { ObjectId } from "mongodb";
import { userRepository } from "../repositories/user.js";

class UserService {
  _formatObjectId(id) {
    try {
      return ObjectId.createFromHexString(id);
    } catch (error) {
      logger.error(error);
      throw new Error(`Invalid ID format: ${id}`);
    }
  }

  async getAllUsers() {
    return await userRepository.getAllUsers();
  }

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
