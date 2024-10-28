# BovControl API - Milk Production Management

This project is a RESTful API developed for the BovControl challenge. The API enables the management of farms and farmers, with functionality to register daily milk production, query volumes, and calculate prices based on specific business rules.

## 🚀 Technologies Used

- **JavaScript (ES6)**: Language for the backend logic.
- **Node.js**: Runtime environment for executing JavaScript code.
- **Express**: Framework for building RESTful APIs.
- **Swagger**: API documentation and testing interface.
- **MongoDB**: NoSQL database for data storage, using the native driver.
- **JWT**: For authentication and authorization.
- **Currency Converter (currency-converter-lt)**: Library for converting currencies in real-time, used for converting BRL to USD.
- **Winston**: For logging, providing structured and efficient log management throughout the application.
- **SOLID Principles**: Adherence to SOLID design principles for building scalable, maintainable, and testable code.
- **Docker**: Containerization of the application for consistent environments, simplified deployment, and scalability.

## 📚 Project Structure - SOLID Principles

The project is organized following the SOLID principles to ensure best practices, maintainability, and scalability:

## API Overview

```
api/
├── .vscode/
│   └── settings.json        - VSCode settings specific to this project
├── node_modules/            - Node.js modules (dependencies)
├── src/
│   ├── config/              - Database connection configurations
│   ├── controllers/         - Handles HTTP requests
│   ├── logs/                - Manages application logging to keep track of events, errors, and debug
│   ├── middlewares/         - Handles functions such as authentication, validation, and error management
│   ├── models/              - Data models (interfaces or types if needed)
│   ├── repositories/        - Database connections and queries (each entity has its own repository)
│   ├── routes/              - Express routing files
│   ├── services/            - Business logic and pricing rules
│   └── utils/               - Helper functions (number formatting, etc.)
├── app.js                   - Server configuration
├── .editorconfig            - Configuration for code style consistency across different IDEs
├── .gitignore               - Specifies which files and directories should be ignored by Git
├── .prettierignore          - Files and directories ignored by Prettier
├── .prettierrc              - Prettier configuration for code formatting
├── eslint.config.js         - ESLint configuration for linting JavaScript/Node.js code
├── package.json             - Project metadata and dependencies
└── README.md                - Documentation file for the project
```

The structure ensures that each layer has a single responsibility, making the application easier to test, maintain, and extend.


## 🏗 ESLint and Prettier Configuration

To maintain code quality and formatting standards, **ESLint** and **Prettier** are configured:

- **ESLint**: Enforces code quality and best practices.
- **Prettier**: Ensures consistent code formatting.
- **Plugins**: Includes plugins like `unused-imports` to clean up the codebase.

### ESLint Rules Highlights

- `"prettier/prettier": "error"`: Enforces Prettier formatting.
- `"no-console": "warn"`: Discourages usage of console logs.
- `"eqeqeq": "error"`: Enforces strict equality checks.
- `"no-var": "error"`: Disallows `var`, favoring `let` and `const`.
- `"prefer-const": "error"`: Suggests using `const` where possible.
- `"unused-imports/no-unused-imports": "error"`: Cleans up unused imports.

## 📦 Installation and Setup

To set up and run the BovControl API locally, follow the steps below:

1. Clone the Repository:
   Clone the project from the GitHub repository:
   ```bash
   git clone https://github.com/pedrohygorveras/milk-production-api.git
   ```

2. Navigate to the Project Directory:
   ```bash
   cd milk-production-api
   ```

3. Install Dependencies:
   Install all the required dependencies using npm:
   ```bash
   npm install
   ```

4. Configure Environment Variables:
   - Create a **.env** file based on the .env.example file located in the root of the project.
   - Add the necessary environment variables like PORT, MONGO_URI, and other configurations required for the application.

   Example:

   ```
     PORT=3000
     MONGO_URI=mongodb://localhost:27017/milk_production
     JWT_SECRET=your_jwt_secret
   ```

5. Run the Application:
   Start the server using the following command:

   ```
   npm start
   ```

   This will launch the application, and you should see the following output:
   MongoDB connected successfully
   Routes configured successfully.

   Server is running on http://localhost:3000

6. Access the API:
   - Swagger documentation is available at http://localhost:3000/api/docs/.

7. Verify Database Connection:
   Make sure MongoDB is running locally or remotely according to your configuration. The application connects to the MongoDB instance using the connection string provided in the .env file.

9. Development Mode:
   - For development purposes, you can use nodemon to automatically restart the server when files change:
   ```
     npm run dev
   ```

This setup ensures the application is ready to be developed, tested, and extended further following the SOLID principles for maintainability and scalability.


## Swagger: API Documentation
![screencapture-localhost-3000-api-docs-2024-10-28-14_02_49](https://github.com/user-attachments/assets/164ab1c0-768c-4d92-a5f7-626cc321cf6b)


