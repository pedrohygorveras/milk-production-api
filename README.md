# BovControl API - Milk Production Management

Welcome to the **BovControl API**! This RESTful API was developed for the BovControl challenge and is designed to efficiently manage farms, farmers, and daily milk production data. The API enables you to register daily production, query volumes, and calculate prices, all based on specific business rules.

## 🌐 Production Environment
The BovControl API is accessible at the following link:

[Production Environment](http://178.128.204.65:8030/api/docs)

## 🚀 Technologies Used
- **JavaScript (ES6)**: Backend logic.
- **Node.js**: Runtime environment for JavaScript.
- **Express**: Framework for building RESTful APIs.
- **Swagger**: API documentation and testing interface.
- **MongoDB**: NoSQL database for data storage.
- **JWT**: Authentication and authorization.
- **Currency Converter**: Converts BRL to USD in real-time.
- **Winston**: Structured logging.
- **SOLID Principles**: Ensures scalable, maintainable, and testable code.
- **Docker**: Containerization for consistent environments and simplified deployment.

## 📁 Project Structure
The project follows **SOLID principles** for high maintainability and scalability:
```
api/
├── src/
│   ├── config/              - Database connection configurations
│   ├── controllers/         - Handles HTTP requests
│   ├── logs/                - Application logs
│   ├── middlewares/         - Authentication, validation, and error handling
│   ├── models/              - Data models
│   ├── repositories/        - Database queries
│   ├── routes/              - Express routes
│   ├── services/            - Business logic
│   └── utils/               - Helper functions
├── app.js                   - Server configuration
├── package.json             - Project metadata and dependencies
└── README.md                - Project documentation
```

## 🏗 ESLint and Prettier Configuration
Code quality and formatting are maintained with **ESLint** and **Prettier**:
- **ESLint**: Enforces best practices.
- **Prettier**: Ensures consistent code formatting.

### Key ESLint Rules
- **No console logs**: `"no-console": "warn"`.
- **Strict equality checks**: `"eqeqeq": "error"`.
- **Prefer `const`**: `"prefer-const": "error"`.
- **Clean unused imports**: `"unused-imports/no-unused-imports": "error"`.

## 📦 Installation and Setup
Follow these steps to set up and run the BovControl API locally:

### 1. Clone the Repository
Clone the project from GitHub:
```bash
git clone https://github.com/pedrohygorveras/milk-production-api.git
```

### 2. Navigate to the Project Directory
```bash
cd milk-production-api
```

### 3. Install Dependencies
Install all required dependencies:
```bash
npm install
```

### 4. Configure Environment Variables
Create a **.env** file based on `.env.example` and add necessary environment variables like `PORT`, `MONGO_URI`, and `JWT_SECRET`:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/milk_production
JWT_SECRET=your_jwt_secret
```

### 5. Run the Application
Start the server:
```bash
npm start
```
You should see:
- "MongoDB connected successfully"
- "Server is running on http://localhost:3000"

### 6. Access the API
Swagger documentation is available at: [http://localhost:3000/api/docs](http://localhost:3000/api/docs).

### 7. Development Mode
For development, use **nodemon** to automatically restart the server when files change:
```bash
npm run dev
```

### 8. Running with Docker
To run the BovControl API using Docker:

1. **Build the Docker Image**:
   ```bash
   docker build -t milk-production-api .
   ```

2. **Run the Docker Container**:
   ```bash
   docker run -p 3000:3000 --name api milk-production-api
   ```

The API will now be accessible at: [http://localhost:3000](http://localhost:3000).

## 🚢 Deploying with Docker Compose
To simplify deployment, use Docker Compose:

1. **Run Docker Compose**:
   ```bash
   docker-compose up -d
   ```
   This command will spin up the service with the configuration provided in the `docker-compose.yml` file.

2. **Check Running Containers**:
   ```bash
   docker ps
   ```
   Verify that the container is running successfully.

## 💡 Key Features
- Register farms and farmers.
- Record and manage daily milk production.
- Query milk volumes and calculate pricing in both BRL and USD.

## 🔗 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## Swagger: API Documentation
![screencapture-localhost-3000-api-docs-2024-10-28-14_02_49](https://github.com/user-attachments/assets/164ab1c0-768c-4d92-a5f7-626cc321cf6b)
