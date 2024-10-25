# BovControl API - Milk Production Management

This project is a RESTful API developed for the BovControl challenge. The API enables the management of farms and farmers, with functionality to register daily milk production, query volumes, and calculate prices based on specific business rules.

## API Overview

```
api/
├── .vscode/
│   └── settings.json        - VSCode settings specific to this project
├── node_modules/            - Node.js modules (dependencies)
├── src/
│   ├── config/              - Database connection configurations
│   ├── controllers/         - Handles HTTP requests
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
