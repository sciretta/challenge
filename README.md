# Challenge Application

This is a NestJS and MongoDB application that provides a GraphQL API for querying vehicles and their types. It uses data from an external API, stores it in MongoDB, and allows filtered querying of vehicle makes and types. This guide explains the setup, configuration, and how to run the project both locally and in production.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Project Structure](#project-structure)
- [Testing](#testing)

---

## Requirements

- **Node.js**: 22.x or higher
- **Docker** and **Docker Compose** for containerized environment
- **Nest CLI** (optional, for local development)

## Installation

1. Clone the repository and install project dependencies:

   ```bash
   git clone https://github.com/sciretta/challenge.git
   cd challenge
   npm install
   ```

2. Ensure Docker is installed and running on your system.

---

## Configuration

1. Create a `.env` file in the project root directory for environment variables. The file should include:

   ```env
   MONGODB_URI=mongodb://mongo:27017/mydatabase
   ```

2. The `docker-compose.yml` file configures MongoDB and the application containers. The app connects to MongoDB using the `mongo` service name.

3. The MongoDB configuration in the code uses the `MONGODB_URI` environment variable to establish the database connection.

---

## Local Development

To run the app locally with Docker Compose, follow these steps:

1. **Start mongo container with**:

   ```bash
   docker run -d --name mongodb -p 27017:27017 mongo
   ```

2. **Build and start the environment**:
   ```bash
   npm run start:dev
   ```

## Production Deployment

To deploy the application in production, follow these steps:

1. **Environment Variables**:

   - Configure `MONGODB_URI` in your `.env` file or directly on your production server environment to connect the application to MongoDB.

2. **Start Containers**:

   - On your production server, start the application with Docker Compose:
     ```bash
     docker-compose up
     ```

3. **Log Monitoring**:
   - Verify that the containers are running properly with:
     ```bash
     docker-compose logs -f
     ```

## Project Structure

The following describes the main files and directories in this project:

- **Dockerfile**: Specifies the steps to build the application container, including installing dependencies, the NestJS CLI, and building the production files.

- **docker-compose.yml**: Defines the services required by Docker Compose, setting up both the application and MongoDB containers.

- **.env**: Contains environment variables used for configuring the application, such as `MONGODB_URI` for MongoDB connection.

- **src/**: Contains the main source code of the NestJS application, including modules, services, resolvers, and DTOs.

  - **src/modules/**: Houses feature-specific modules, such as `VehicleModule`, to keep related files organized.
  - **src/providers/**: Contains common services and database configurations used across modules.
  - **src/common/utils/**: Utility files, like XML parsers, that support the application’s functionality.

- **dist/**: Contains the compiled JavaScript files after building the application with `npm run build`. This is the code executed in production.

This project structure supports a modular and maintainable application design, with well-organized source files and configuration settings.

## Testing

Here are some commands to run testing cases:

- **Without coverage**:

  ```bash
  npm test
  ```

- **With coverage**:

  ```bash
  npm run test:cov
  ```

  To watch the coverage you can go to the following path

- **.\coverage\lcov-report\index.html**
