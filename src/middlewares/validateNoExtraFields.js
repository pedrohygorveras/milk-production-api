/**
 * Middleware class for validating fields in the request body.
 * Ensures that only the specified fields are present in the request body.
 * If any extra or unexpected fields are found, an appropriate error response is returned.
 */
class ValidateNoExtraFieldsMiddleware {
  /**
   * Constructor for ValidateNoExtraFieldsMiddleware.
   * @param {Array<string>} allowedFields - An array of strings representing the allowed fields in the request body.
   */
  constructor(allowedFields) {
    this.allowedFields = allowedFields;
  }

  /**
   * Returns an Express middleware function that validates fields in the request body.
   * This function checks if any fields are present in the request body that are not listed in allowedFields.
   * If invalid fields are detected, it returns a 400 response with an error message specifying the invalid fields.
   * @returns {Function} - The Express middleware function to validate the request body fields.
   */
  validate() {
    return (req, res, next) => {
      // Extracts all keys from the request body
      const keys = Object.keys(req.body);

      // Identifies any keys that are not allowed based on the allowedFields array
      const invalidFields = keys.filter(
        (key) => !this.allowedFields.includes(key),
      );

      // If there are invalid fields, respond with a 400 error and a detailed message
      if (invalidFields.length > 0) {
        return res.status(400).json({
          error: `Invalid fields: ${invalidFields.join(", ")}`,
        });
      }

      // If all fields are valid, proceed to the next middleware
      next();
    };
  }
}

export { ValidateNoExtraFieldsMiddleware };
