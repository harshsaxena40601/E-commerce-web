require("dotenv").config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Ensure MONGO_URI is loaded
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env file!");
  process.exit(1);
}

// ✅ Connect to MongoDB (without deprecated options)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Product Schema
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
});
const Product = mongoose.model("Product", ProductSchema);

// ✅ User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);

// ✅ Get Products
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ✅ Add Product (Admin only)
app.post("/products", verifyToken, async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

// ✅ Delete Product (Admin only)
app.delete("/products/:id", verifyToken, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

// ✅ Register User
app.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    username: req.body.username,
    password: hashedPassword,
  });
  await user.save();
  res.json({ message: "User registered" });
});

// ✅ Login User
app.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

// ✅ Middleware to Verify Token
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.userId = decoded.userId;
    next();
  });
}

// ✅ Import & Use Cart Routes
const cartRoutes = require("./cartRoutes"); // Import cart route
app.use("/api", cartRoutes); // Use cart routes

// ✅ Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
