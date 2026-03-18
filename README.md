# Task Tracker

A full-stack task management application with a Java Spring Boot backend and a React frontend.

## Features

- **Task Lists:** Create, edit, and delete lists of tasks.
- **Task Management:** Add tasks to specific lists with titles, descriptions, due dates, and priority levels.
- **Priority System:** Categorize tasks as LOW, MEDIUM, or HIGH priority.
- **Progress Tracking:** Visual progress bars showing the completion status of each task list.
- **Detailed Views:** Focus on a single task list to manage its specific tasks.

---

## Prerequisites

Before you begin, ensure you have the following installed:
- [Java 21 JDK](https://www.oracle.com/java/technologies/downloads/#java21)
- [Node.js (v18+) & npm](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for PostgreSQL database)

---

## Getting Started

### 1. Database Setup (Docker)

The backend uses a PostgreSQL database. A `docker-compose.yml` file is provided in the `task-backend` directory.

1.  Open a terminal and navigate to the backend directory:
    ```bash
    cd task-backend
    ```
2.  Start the database container:
    ```bash
    docker-compose up -d
    ```
    *This will start a PostgreSQL instance on port `5433` as configured in `application.properties`.*

### 2. Backend Execution (Spring Boot)

1.  While still in the `task-backend` directory, run the application using the Maven wrapper:
    ```bash
    ./mvnw spring-boot:run
    ```
    *The API will be available at `http://localhost:8080`.*

### 3. Frontend Execution (React + Vite)

1.  Open a new terminal window and navigate to the frontend directory:
    ```bash
    cd task-frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    *The application will be accessible at `http://localhost:5173`.*

---

## Project Structure

- `task-backend/`: Spring Boot 4.0.2 application (Java 21).
- `task-frontend/`: React 19 application built with Vite and Vanilla CSS.

## Development Notes

- **CORS:** The backend is configured to allow requests from `http://localhost:5173`.
- **Persistence:** Uses Spring Data JPA with Hibernate. The schema is automatically updated on startup (`ddl-auto=update`).
- **Mappers:** Manual DTO mapping is located in `com.quan.tasks.mappers`.
