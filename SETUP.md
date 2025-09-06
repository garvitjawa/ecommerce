# E-Commerce App Setup Instructions

## Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file in the backend directory with the following content:**
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/ecommerce-app
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Make sure MongoDB is running on your system**

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

## Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

## Testing the Login

1. Open your browser and go to `http://localhost:5173` (or the port shown in the terminal)
2. You should see the login page
3. Click "Sign up" to create a new account
4. After signing up, you'll be automatically logged in
5. You can also test the login functionality with existing credentials

## Features

- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Modern, responsive UI
- ✅ Form validation
- ✅ Error handling
- ✅ Shopping cart functionality (backend ready)
- ✅ Product catalog (backend ready)

## API Endpoints

- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `GET /user/getAllProducts` - Get all products (protected)
- `GET /user/getCart` - Get user's cart (protected)
- `POST /user/addToCart` - Add product to cart (protected)
- `DELETE /user/removeFromCart` - Remove product from cart (protected)
