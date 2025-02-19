const express = require("express");
const router = express.Router();
const Cart = require("./cartModel"); // Import the Cart model

// ✅ Get cart for a user
router.get("/cart/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart || { userId: req.params.userId, items: [] }); // Return empty cart if not found
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add to cart
router.post("/cart", async (req, res) => {
  try {
    const { userId, productId, name, price, image, quantity } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, image, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Remove from cart
router.delete("/cart/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.productId !== productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
