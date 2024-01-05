# API Documentation

This document provides an overview of the available API endpoints and their functionalities.

## Endpoints

### User Routes

- **POST /register**: Register a new user.
- **POST /login**: Log in an existing user.
- **GET /logout**: Log out the current user.
- **GET /admin-dashboard**: Access the admin dashboard.
- **POST /reset-password-request**: Request a password reset.
- **POST /reset-password/:token**: Reset the password with a valid token.
- **GET /api/sessions/current**: Get information about the current user.

### Document Routes

- **POST /:uid/documents**: Upload documents for a specific user.

## Authentication

API routes are protected using JWT (JSON Web Token) authentication. Users need to include their token in the Authorization header for secured endpoints.

