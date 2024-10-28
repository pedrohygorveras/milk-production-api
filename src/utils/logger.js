import { createLogger, format, transports } from "winston";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Logger Class
 * Configures and provides a logger instance using Winston.
 * The logger supports different levels (e.g., info, warn, error),
 * outputs logs to both the console and a file, and includes timestamps for clarity.
 * Log levels and file output can be controlled via environment variables.
 */
class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || "info";
    this.logDirectory = path.resolve(__dirname, "../logs");
    this.logger = this.createLoggerInstance();
  }

  /**
   * Creates a Winston logger instance with the defined configuration.
   * @returns {Logger} - Configured Winston logger instance.
   */
  createLoggerInstance() {
    return createLogger({
      level: this.logLevel,
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.errors({ stack: true }),
        format.printf(({ timestamp, level, message, stack }) => {
          return stack
            ? `${timestamp} [${level.toUpperCase()}]: ${message} - ${stack}`
            : `${timestamp} [${level.toUpperCase()}]: ${message}`;
        }),
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ timestamp, level, message, stack }) => {
              return stack
                ? `${timestamp} [${level.toUpperCase()}]: ${message} - ${stack}`
                : `${timestamp} [${level.toUpperCase()}]: ${message}`;
            }),
          ),
        }),
        new transports.File({
          filename: path.join(this.logDirectory, "app.log"),
          level: this.logLevel,
          maxsize: 5 * 1024 * 1024,
          maxFiles: 5,
        }),
      ],
      exceptionHandlers: [
        new transports.File({
          filename: path.join(this.logDirectory, "exceptions.log"),
        }),
      ],
      rejectionHandlers: [
        new transports.File({
          filename: path.join(this.logDirectory, "rejections.log"),
        }),
      ],
    });
  }

  /**
   * Provides access to the logger instance.
   * @returns {Logger} - The configured Winston logger instance.
   */
  getInstance() {
    return this.logger;
  }
}

// Export an instance of the Logger class
export const logger = new Logger().getInstance();
