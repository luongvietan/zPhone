const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user_id: req.user._id });

    if (!cart) {
      cart = new Cart({ user_id: req.user._id, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { product_id, storage, quantity = 1 } = req.body;

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findOne({ product_id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const variant = product.variants.find((v) => v.storage === storage);
    if (!variant || variant.stock < quantity) {
      // Kiểm tra stock của variant
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Tìm hoặc tạo giỏ hàng
    let cart = await Cart.findOne({ user_id: req.user._id });
    if (!cart) {
      cart = new Cart({ user_id: req.user._id, items: [] });
    }

    // Kiểm tra sản phẩm đã có trong giỏ
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product_id === product_id && item.storage === storage
    );

    if (existingItemIndex > -1) {
      // Cập nhật số lượng nếu sản phẩm đã tồn tại
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Thêm sản phẩm mới
      cart.items.push({
        product_id,
        product_name: product.product_name,
        storage,
        price: variant.product_price,
        quantity,
        product_image: product.product_image[0],
      });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res
      .status(500)
      .json({ message: "Error adding to cart", error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { product_id, storage, quantity } = req.body;

    const cart = await Cart.findOne({ user_id: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Kiểm tra tồn kho
    const product = await Product.findOne({ product_id });
    const variant = product.variants.find((v) => v.storage === storage);
    if (!variant || variant.stock < quantity) {
      // Kiểm tra stock
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product_id === product_id && item.storage === storage
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity < 1) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating cart", error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { product_id, storage } = req.body;

    const cart = await Cart.findOne({ user_id: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => !(item.product_id === product_id && item.storage === storage)
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing from cart", error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user_id: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error clearing cart", error: error.message });
  }
};
