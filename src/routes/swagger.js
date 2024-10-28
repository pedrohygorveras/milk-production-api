import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

/**
 * Class responsible for configuring and managing Swagger documentation.
 * This class initializes Swagger and sets it up on the specified endpoint,
 * providing a user-friendly interface for API documentation and testing.
 */
class SwaggerConfig {
  /**
   * Constructor initializes Swagger configuration options and sets up the routes.
   */
  constructor() {
    // Swagger configuration options
    this.options = {
      definition: {
        openapi: "3.0.0", // Specifies the OpenAPI version
        info: {
          title: "API Documentation", // Title of the API
          version: "1.0.0", // Version of the API documentation
          description: this.getDescription(), // Detailed HTML description of the API
        },
        servers: [
          {
            url: "http://64.227.27.236:8030/",
            description: "Production",
          },
          {
            url: "http://localhost:3000/",
            description: "Local server",
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: [
          {
            name: "Auth",
            description: "Operations related to auth", // Tag for auth-related endpoints
          },
          {
            name: "Users",
            description: "Operations related to users", // Tag for user-related endpoints
          },
          {
            name: "Farmers",
            description: "Operations related to farmers", // Tag for farmer-related endpoints
          },
          {
            name: "Farms",
            description: "Operations related to farms", // Tag for farm-related endpoints
          },
          {
            name: "MilkProductions",
            description: "Operations related to milk productions", // Tag for milk-production-related endpoints
          },
          {
            name: "Payments",
            description: "Operations related to payments", // Tag for payment-related endpoints
          },
        ],
      },
      apis: ["./src/routes/*.js"], // Path to the API routes for Swagger documentation generation
    };

    // Generates Swagger specification based on options
    this.swaggerSpec = swaggerJsdoc(this.options);

    // Creates a new router instance for handling Swagger UI
    this.router = express.Router();

    // Initializes the Swagger UI routes
    this.initializeRoutes();
  }

  /**
   * Constructs the HTML description for the API documentation.
   * This method is responsible for organizing and structuring the API details,
   * including features, rules, and technologies used.
   *
   * @returns {string} - The HTML description used in the Swagger documentation.
   */
  getDescription() {
    return (
      "<h3>Milk Production and Payment Management API - Bovcontrol</h3>" +
      "<p>This API was developed to manage the milk production delivered by farmers " +
      "and calculate the payment according to specific rules throughout the year.</p>" +
      "<h4>API Features:</h4>" +
      "<ul>" +
      "<li><strong>Farmer and Farm Registration</strong>: Allows registering farmers and their respective farms, " +
      "storing essential information for production and payment control.</li>" +
      "<li><strong>Daily Milk Production Logging</strong>: Records the amount of milk produced daily " +
      "by each farm, enabling monitoring of production over time.</li>" +
      "<li><strong>Daily Volume and Monthly Average Query</strong>: Provides the ability to query the volume of milk delivered " +
      "on a specific day and calculate the monthly average production per farm.</li>" +
      "<li><strong>Price per Liter Query</strong>: Calculates and returns the price paid per liter of milk based on the month " +
      "and production volume, following the price and bonus rules.</li>" +
      "<li><strong>Monthly Payment Query</strong>: Allows checking the price paid for each month of the year based on milk production, " +
      "taking into account the distance from the farm to the factory and other rules.</li>" +
      "</ul>" +
      "<h4>Rules for Milk Price Calculation</h4>" +
      "<table border='0'>" +
      "<thead>" +
      "<tr>" +
      "<th>Criteria</th>" +
      "<th>First Semester - Jan to Jun</th>" +
      "<th>Second Semester - Jul to Dec</th>" +
      "</tr>" +
      "</thead>" +
      "<tbody>" +
      "<tr><td>Base price per liter</td><td>$1.80</td><td>$1.95</td></tr>" +
      "<tr><td>Cost per KM up to 50KM</td><td>$0.05</td><td>-</td></tr>" +
      "<tr><td>Cost per KM above 50KM</td><td>$0.06</td><td>-</td></tr>" +
      "<tr><td>Bonus for production above 10,000 L</td><td>-</td><td>$0.01</td></tr>" +
      "</tbody>" +
      "</table>" +
      "<h4>Technologies Used:</h4>" +
      "<ul>" +
      "<li>JavaScript (ES6)</li>" +
      "<li>Express for route creation and management</li>" +
      "<li>Swagger for API documentation and testing</li>" +
      "<li>Node.js as the runtime environment</li>" +
      "<li>MongoDB as the database, using the native MongoDB driver for data manipulation</li>" +
      "</ul>" +
      "<h4>Development Restrictions:</h4>" +
      "<p>Technologies <strong>not</strong> used:</p>" +
      "<ul>" +
      "<li>TypeScript</li>" +
      "<li>Nest.js</li>" +
      "<li>Mongoose</li>" +
      "</ul>" +
      "<h4>Final Remarks:</h4>" +
      "<p>The interpretation of the problem and the implementation of the described rules are part of the challenge, and the developer is expected to apply good programming practices, ensuring scalability and maintainability of the API.</p>" +
      "<h2>How to Test the API:</h2>" +
      "<ol>" +
      "<li><strong>Create a User</strong>: Create a user with an email and password that meet minimum security criteria.</li>" +
      "<li><strong>Log in</strong>: Authenticate the user to obtain a JWT token, necessary to access protected API resources.</li>" +
      "<li><strong>Add a Farmer</strong>: Register a farmer by providing information such as name, email, and phone number.</li>" +
      "<li><strong>Add a Farm</strong>: Link the farm to the farmer and provide details such as location (latitude and longitude) and distance to the factory.</li>" +
      "<li><strong>Record Milk Production</strong>: Log the daily production in liters, specifying the date, farmer, and associated farm.</li>" +
      "<li><strong>Query Milk Production</strong>: Check the daily volume and monthly average of milk delivered by the farm for a specific period.</li>" +
      "<li><strong>Check Payments</strong>: The price per liter of milk is dynamically generated, taking into consideration the following factors:" +
      "<ul>" +
      "<li>The volume produced in the month, which determines the base price.</li>" +
      "<li>The distance from the farm to the factory, applying a cost per kilometer traveled.</li>" +
      "<li>Bonus for production exceeding 10,000 liters in the second half of the year.</li>" +
      "</ul>" +
      "Based on these factors, the system calculates the final amount paid to the farmer, displaying the price in both Brazilian and English numeric formats for easy understanding and international reporting." +
      "</li>" +
      "</ol>"
    );
  }

  /**
   * Initializes the Swagger route.
   * This method sets up the '/docs' endpoint for Swagger UI, allowing
   * users to access and interact with the API documentation.
   */
  initializeRoutes() {
    this.router.use(
      "/docs",
      swaggerUi.serve,
      swaggerUi.setup(this.swaggerSpec),
    );
  }

  /**
   * Returns the configured router instance for Swagger.
   * This allows other modules to use the Swagger routes by importing the instance.
   *
   * @returns {express.Router} - The express router instance with Swagger setup.
   */
  getRouter() {
    return this.router;
  }
}

// Export an instance of SwaggerConfig to be used in the main application
export const swaggerRoutes = new SwaggerConfig().getRouter();
