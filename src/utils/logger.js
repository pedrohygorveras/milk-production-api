import { createLogger, format, transports } from "winston";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configures and creates a logger instance using Winston.
 * The logger will support different levels (e.g., info, warn, error),
 * output logs to both the console and a file, and include timestamps for clarity.
 * Log levels and file output can be controlled via environment variables.
 */

// Define log level based on environment variables or default to 'info'
const logLevel = process.env.LOG_LEVEL || "info";

// Define log directory based on environment variable or default to 'logs' inside 'src'
const logDirectory = path.resolve(__dirname, "../logs");

/**
 * Usage:
 * Import this logger instance in any file within the application and use it as follows:
 *
 * import { logger } from '@/utils/logger.js';
 * logger.info('Informational message');
 * logger.warn('Warning message');
 * logger.error('Error message');
 *
 * Configuration:
 * - Set LOG_LEVEL environment variable to control the logging level globally.
 * - Customize the log file path, rotation settings, and log level as needed.
 */

// Define the logger instance
export const logger = createLogger({
  // Set the minimum level for logging (e.g., 'info', 'warn', 'error')
  level: logLevel,

  // Define log format
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Add timestamp to each log entry
    format.errors({ stack: true }), // Include stack trace with errors
    format.printf(({ timestamp, level, message, stack }) => {
      // Define structured log format for consistency
      return stack
        ? `${timestamp} [${level.toUpperCase()}]: ${message} - ${stack}` // Log error stack if present
        : `${timestamp} [${level.toUpperCase()}]: ${message}`;
    }),
  ),

  // Define where logs should be output
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(), // Colorize console output for readability
        format.printf(({ timestamp, level, message, stack }) => {
          return stack
            ? `${timestamp} [${level.toUpperCase()}]: ${message} - ${stack}`
            : `${timestamp} [${level.toUpperCase()}]: ${message}`;
        }),
      ),
    }),

    // Output logs to a file for persistent storage
    new transports.File({
      filename: path.join(logDirectory, "app.log"), // Log file location
      level: logLevel, // Log level for file output
      maxsize: 5 * 1024 * 1024, // Maximum file size before rotation (5MB)
      maxFiles: 5, // Keep last 5 log files for historical reference
    }),
  ],

  // Handle uncaught exceptions to prevent application crashes
  exceptionHandlers: [
    new transports.File({
      filename: path.join(logDirectory, "exceptions.log"),
    }),
  ],

  // Handle unhandled promise rejections
  rejectionHandlers: [
    new transports.File({
      filename: path.join(logDirectory, "rejections.log"),
    }),
  ],
});
