const Order = require('../models/Order');
const Cart = require('../models/Cart');

const orderCtrl = {
  // ==========================================
  // 🟢 USER ROUTES (Protected by 'authenticate')
  // ==========================================

  // 1. Place a new order
  // 1. Place a new order
  createOrder: async (req, res) => {
    try {
      // FIX: Add 'utrNumber' to this destructured list!
      const { items, totalAmount, shippingAddress, utrNumber } = req.body;
      
      const secureUserId = req.user.id;
      const secureEmail = req.user.email;

      if (!items || items.length === 0) {
        return res.status(400).json({ message: "No items in the order." });
      }

      // Create the order
      const newOrder = new Order({
        userId: secureUserId,
        email: secureEmail,
        items,
        totalAmount,
        shippingAddress,
        utrNumber // FIX: Tell Mongoose to save the UTR here!
      });

      await newOrder.save();

      // Once the order is placed, empty the user's cart
      await Cart.findOneAndUpdate(
        { userId: secureUserId },
        { items: [] }
      );

      res.status(201).json({ message: "Order placed successfully!", order: newOrder });
    } catch (error) {
      console.error("Create Order Error:", error);
      res.status(500).json({ message: "Server error placing order" });
    }
  },

  // 2. Get orders for the logged-in user
  getUserOrders: async (req, res) => {
    try {
      const secureUserId = req.user.id;
      
      // Fetch only the orders belonging to this user, sorted by newest first
      const orders = await Order.find({ userId: secureUserId }).sort({ createdAt: -1 });
      
      res.status(200).json(orders);
    } catch (error) {
      console.error("Get User Orders Error:", error);
      res.status(500).json({ message: "Server error fetching orders" });
    }
  },

  // ==========================================
  // 🔴 ADMIN ROUTES (Protected by 'protectAdmin')
  // ==========================================

  // 3. Get ALL orders from everyone
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find({}).sort({ createdAt: -1 });
      res.status(200).json(orders);
    } catch (error) {
      console.error("Get All Orders Error:", error);
      res.status(500).json({ message: "Server error fetching all orders" });
    }
  },

  // 4. Update the status of an order
  updateOrderStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const orderId = req.params.id;

      const validStatuses = ['Pending Approval', 'Approved', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status update" });
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId, 
        { status: status }, 
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({ message: `Order marked as ${status}`, order: updatedOrder });
    } catch (error) {
      console.error("Update Status Error:", error);
      res.status(500).json({ message: "Server error updating status" });
    }
  }
};

module.exports = orderCtrl;