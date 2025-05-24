# 🍽️ Restaurant Management Server

This is the **server-side** codebase of the MERN Stack based **Restaurant Management Website**, built using **Express.js**, **MongoDB**, and **Firebase Authentication**. This server handles RESTful API endpoints, authentication with JWT, and database operations for managing food items, orders, and users.

## 🔗 Live Server URL

[https://server-site-restaurant.vercel.app/users](https://server-site-restaurant.vercel.app/users)

---

## ✅ Purpose

This backend API supports a restaurant management system where:
- Users can add, update, purchase, and view food items.
- Admins can manage food inventory and track orders.
- Users must be authenticated to access private routes (JWT protected).

---

## 🛠️ Key Features

- 🔒 **JWT Authentication**: Secure private routes using JSON Web Tokens.
- 🔐 **Firebase Token Verification**: Authenticates users with Firebase before issuing JWT.
- 🍱 **CRUD Operations**: Add, update, delete, and retrieve food items.
- 🛍️ **Order Management**: Users can purchase food, and their orders are stored in the database.
- 🧑‍🍳 **User-Specific Operations**: Each user can manage only their added foods and orders.
- 🔄 **Quantity Validation**: Prevents users from purchasing more than available quantity.
- 🧾 **Purchase History**: Stores purchase time (formatted using `moment`) with order details.
- 🔍 **Search & Filter Support**: Server-side filtering and search capability (by name, category, etc.)
- 🔃 **Pagination**: Server-side pagination for food items.
- ⚠️ **Error Handling**: Includes middleware for catching and responding to invalid requests.
- 🌐 **CORS Enabled**: Proper CORS configuration for frontend/backend communication.

---

## ⚙️ Technologies & Packages Used

| Package           | Purpose                                   |
|-------------------|-------------------------------------------|
| express           | Web server framework                      |                             |
| cors              | Enable CORS                               |
| dotenv            | Environment variable configuration        |
| jsonwebtoken      | JWT token creation and verification       |
| firebase-admin    | Firebase Admin SDK for token validation   |
| moment            | Time and date formatting                  |
| cookie-parser     | Parsing cookies                           |

---

## 🔐 Environment Variables

Create a `.env` file in your root folder with the following:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key (Make sure to format escaped \n properly)
