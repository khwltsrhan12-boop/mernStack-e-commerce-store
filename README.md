# 🛒 Full-Stack E-Commerce Platform (MERN Stack)

[![Status](https://img.shields.io/badge/Status-Complete-brightgreen)]()
[![License](https://img.shields.io/badge/License-MIT-blue)]()

## 🖼️ Project Showcase

![E-Commerce Platform Main Interface](image_390241.jpg)

## 🚀 Overview

A robust, feature-rich E-commerce platform built from scratch using the **MERN** stack (MongoDB, Express, React, Node.js). This project demonstrates proficiency in developing **scalable RESTful APIs**, **secure authentication**, and managing complex business logic. A key implementation challenge was integrating a **Mock Payment Gateway** to simulate secure, real-world transactions in a sandbox environment.

**Key Features:** Role-Based Admin Portal (RBAC), Full CRUD, Advanced Filtering, Redux State Management.

---

## ✨ Features & Technical Achievements

### 🏪 **Customer UI & State Management**
- **🔍 Advanced Filtering:** Implemented efficient multi-criteria product filtering by **Category**, **Brand**, and **Price Range**, optimized using complex **MongoDB Query Operators**.
- **💳 Mock Payment Flow:** Complete, secure checkout sequence integrated with a **Test Payment Sandbox API** (as seen in Order Summary) and comprehensive order tracking.
- **❤️ Redux Toolkit State:** Utilized **Redux Toolkit** for predictable and centralized state management of application features like the Shopping Cart, Favorites, and User Authentication status.
- **⭐ Reviews & Ratings System:** Designed a robust customer feedback system with product rating aggregation and display.

### 🔧 **Admin Portal (Backend & Control)**
- **👥 Role-Based Access Control (RBAC):** Built secure, restricted access logic to manage user permissions (Admin/User), demonstrating competence in authorization logic.
- **📊 Sales Analytics Dashboard:** Integrated **Charting Libraries** (ApexCharts) to visualize sales trends, KPIs, and revenue metrics.
- **📦 Full CRUD & Inventory:** Developed full **CRUD** (Create, Read, Update, Delete) functionality for Products and Categories, including secure image upload handling (**Multer**).
- **📋 Order Fulfillment:** Implemented a dedicated system for tracking and updating order status (e.g., Paid, Delivered) from the Admin side.

---

## ⚙️ Tech Stack

**Frontend**:
* **React.js** / **Redux Toolkit** (State Management)
* **Tailwind CSS** (Styling, **Modern Dark Mode UI**)
* React Router / Axios
* ApexCharts (Data Visualization)

**Backend**:
* **Node.js** / **Express.js** (RESTful API)
* **MongoDB** (NoSQL Database) / **Mongoose** (ODM)
* **Security:** **JWT** (Authentication) • **Bcrypt** (Password Hashing)
* **Tools:** Multer (File Uploads)

---


## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/khawlasarhan92-dev/FullStack-ECommerce-Store.git
cd e-commerce
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
touch .env
```

Add the following environment variables to `.env`:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id_or_mock_key

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Start the Application
```bash
# Start backend server (from backend directory)
npm start

# Start frontend development server (from frontend directory)
npm run dev
```

The application will be available at:
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5000`


## 🔧 API Endpoints

### **Authentication**
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout

### **Products**
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product with reviews
- `POST /api/products/:id/reviews` - Add product review
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### **Orders**
- `GET /api/orders/mine` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/pay` - Mark order as paid

### **Users** (Admin Only)
- `GET /api/users` - Get all users
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/:id` - Update user

##  Future Enhancements

- [ ] **Multi-language support**
- [ ] **Advanced product filtering**
- [ ] **Inventory management**
- [ ] **Email notifications**
- [ ] **Social media integration**


---
## 🔗 Links & Contact Information

| Resource | Link | Notes |
| :--- | :--- | :--- |
| **Live Demo (Client UI)** | [Try the live application here!]([YOUR_LIVE_DEMO_URL]) | **Highly Recommended** |
| **Admin Demo Credentials** | Email: `admin@test.com` / Password: `123456` | For testing the Admin Portal features (RBAC) |
| **Author Portfolio** | [Your Portfolio Link]([YOUR_PORTFOLIO_URL]) | Link to your professional portfolio site |

## 👨‍💻 Author

khawla sarhan

---

⭐ **Star this repository if you found it helpful!** ⭐