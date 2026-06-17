# SHOPEZE – Smart Product Comparison & Shopping Platform

**SHOPEZE** is a production-grade, internship-ready MERN stack e-commerce application. It features a complete Node.js + Express REST API backend, secure JWT authentication, Mongoose database models, and a responsive React client utilizing a premium custom Vanilla CSS styling system. 

The highlight of the platform is its **Smart Product Comparison Matrix**, which evaluates multiple products side-by-side and uses an algorithm to recommend the best choice based on price, user ratings, and value-for-money metrics.

---

## Technical Features

### 1. Smart Product Comparison (Unique Feature)
- Compare up to 3 products side-by-side across specifications (Brand, Weight, Color, Warranty), price, and customer rating.
- Renders an automated **Best Choice Recommendation** banner, highlighting the ideal choice and explaining the decision (e.g., lowest price, highest quality feedback, or value-for-money ratio).

### 2. Product Management
- Displays products categorized with images, prices, descriptions, and ratings.
- Categorized filters (Electronics, Accessories, Home & Kitchen, Apparel), price range sliders, and active catalog search.
- Tab-based specifications and customer reviews interface on details page.

### 3. Shopping Cart & Wishlist
- Session cart with quantity selectors, live tax/shipping calculations, and coupon vouchers (`SHOPSAVE10`, `SHOPSAVE20`).
- Persistent wishlist to save favorites and transfer them directly to the shopping cart.
- Syncs cart and wishlist to MongoDB upon login, falling back to localStorage if offline.

### 4. JWT Authentication
- Encrypted password storage via `bcryptjs`.
- Security guards for user profiles, transaction checkouts, and admin actions.
- Easy testing shortcuts on the Login page to pre-fill admin/customer credentials.

### 5. Admin Panel
- Graphical widgets tracking total sales revenue, order volumes, products catalog, and user registrations.
- CRUD database forms to add, edit, or delete products.
- Order management portal to update delivery stages (Pending, Shipped, Delivered).
### 6.Responsive Design

- Optimized for desktop, tablet, and mobile devices.
- Modern and user-friendly interface.

### 7.MongoDB Integration

- Cloud database support using MongoDB Atlas.
- Efficient data storage and retrieval using Mongoose.

### 8.REST API Architecture

- Well-structured Express.js backend.
- Secure API endpoints with role-based access control.

---

## Folder Architecture

```
SHOPEZE-AG/
│
├── client/                     # React Frontend
│   ├── public/                 # Favicons and static assets
│   └── src/
│       ├── assets/             # Logo and hero banners
│       ├── components/         # Shared components (Navbar, Footer, ProductCard, Router Guards)
│       ├── context/            # ShopContext.jsx (dual-persistence state manager)
│       ├── pages/              # Views (Home, Catalog, Details, Cart, Wishlist, Auth, Checkout, Admin)
│       ├── services/           # api.js (centralized fetch client)
│       ├── App.jsx             # Routes layout configuration
│       └── main.jsx            # DOM renderer entry point
│
├── server/                     # Node.js + Express Backend
│   ├── config/                 # db.js (MongoDB Mongoose connection)
│   ├── controllers/            # Auth, Product, Cart, Wishlist, and Order controllers
│   ├── middleware/             # Auth guards, error handlers, and input validators
│   ├── models/                 # Mongoose schemas (User, Product, Cart, Wishlist, Order)
│   ├── routes/                 # Express REST endpoints definition
│   └── server.js               # Express server entry point
│
└── README.md                   # Platform documentation
```

---

## REST API Endpoints Map

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | Register new customer |
| **POST** | `/api/auth/login` | Public | Credentials verify & token return |
| **GET** | `/api/auth/profile` | Protected | Fetch current user info |
| **PUT** | `/api/auth/profile` | Protected | Update profile name / address |
| **GET** | `/api/auth/users` | Admin | Get list of all users |
| **GET** | `/api/products` | Public | Get all catalog items |
| **GET** | `/api/products/:id` | Public | Get product by numeric ID / ObjectId |
| **POST** | `/api/products` | Admin | Create a new catalog item |
| **PUT** | `/api/products/:id` | Admin | Modify product details |
| **DELETE**| `/api/products/:id` | Admin | Remove product from DB |
| **POST** | `/api/products/seed` | Public | Populate DB with default catalog items |
| **POST** | `/api/orders` | Protected | Finalize checkout & place order |
| **GET** | `/api/orders/my` | Protected | Get personal transaction history |
| **GET** | `/api/orders` | Admin | Monitor all transactions |
| **PUT** | `/api/orders/:id/status`| Admin | Transition order status |

---

## Installation & Launch

### Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or Atlas connection string)

### Step 1: Backend Server Setup
1. Open your terminal in the `server` directory:
   ```bash
   cd server
   ```
2. Configure environment variables inside `.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/shopeze
   JWT_SECRET=shopeze_super_secret_key_12345
   NODE_ENV=development
   ```
3. Boot up the server:
   ```bash
   npm run dev
   ```

### Step 2: Frontend Client Setup
1. Open a new terminal in the `client` directory:
   ```bash
   cd client
   ```
2. Run the Vite development server:
   ```bash
   npm run dev
   ```
3. Load `http://localhost:5173` in your browser.

---

## Test Accounts Credentials

- **Customer Test Account**:
  - **Email**: `user@shopeze.com`
  - **Password**: `user123`
- **Admin Test Account**:
  - **Email**: `admin@shopeze.com`
  - **Password**: `admin123`

*(Alternatively, use the **Quick Reviewer Shortcuts** widget box visible directly on the Login Page to log in with a single click!)*
