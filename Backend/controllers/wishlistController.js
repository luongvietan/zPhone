const Wishlist = require("../models/wishlistModel");

exports.getWishlist = async (req, res) => {
  try {
    const user_id = req.user._id;
    let wishlist = await Wishlist.findOne({ user_id });
    if (!wishlist) {
      wishlist = new Wishlist({ user_id, items: [] });
      await wishlist.save();
    }
    res.json({ items: wishlist.items });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: "Error fetching wishlist" });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { product_id, product_name, price, product_image } = req.body;
    let wishlist = await Wishlist.findOne({ user_id });
    if (!wishlist) {
      wishlist = new Wishlist({ user_id, items: [] });
    }
    const exists = wishlist.items.some(
      (item) => item.product_id === product_id
    );
    if (exists) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }
    wishlist.items.push({ product_id, product_name, price, product_image });
    await wishlist.save();
    res.json({ items: wishlist.items });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Error adding to wishlist" });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { product_id } = req.body;
    let wishlist = await Wishlist.findOne({ user_id });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    wishlist.items = wishlist.items.filter(
      (item) => item.product_id !== product_id
    );
    await wishlist.save();
    res.json({ items: wishlist.items });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ message: "Error removing from wishlist" });
  }
};
