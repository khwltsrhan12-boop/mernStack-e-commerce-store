import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// Utility Function
function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );

      if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(`Product not found: ${itemFromClient._id}`);
      }

      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id username");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateTotalSales = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calcualteTotalSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsPaid = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
     if (paymentMethod === 'TestPayment') {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
        id: 'test_transaction_12345',
        status: 'success',
        update_time: new Date().toISOString(),
        email_address: 'mock_user@example.com',
          };
     } else if (paymentMethod === 'PayPal') {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
          };
         } else {

 res.status(400);
 throw new Error("Invalid payment method");
 }


      const updateOrder = await order.save();
      res.status(200).json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // تحقق من حالة الدفع قبل التسليم
    if (!order.isPaid) {
      res.status(400);
      throw new Error("Cannot mark as delivered: Order is not paid");
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update order to paid/delivered manually by Admin
// @route   PUT /api/orders/:id/pay-deliver-mock
// @access  Private/Admin 
const markOrderAsPaidAndDeliveredMock = async (req, res) => {
  try {
    // 1. العثور على الطلب:
    const order = await Order.findById(req.params.id);

    if (order) {
      // 2. تحديث الحقول لمحاكاة الدفع الناجح:
      if (!order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
      }

      // 3. تحديث الحقول لمحاكاة التسليم:
      if (!order.isDelivered) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
      
      // إضافة تفاصيل دفع وهمية
      if (!order.paymentResult || !order.paymentResult.status) {
          order.paymentResult = {
              id: `MOCK_PAY_DELIVER_${Date.now()}`,
              status: 'COMPLETED',
              update_time: new Date().toISOString(),
              email_address: 'admin_mock@example.com',
          };
      }

      // 5. حفظ التغييرات:
      const updatedOrder = await order.save();
       res.status(200).json(updatedOrder);

    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getSalesByMonth = async (req, res) => {
    try {
        const sales = await Order.aggregate([
            {
                $match: {
                    isPaid: true,
                    isDelivered: true, 
                },
            },
            {
                $group: {
                    _id: { 
                        year: { $year: "$paidAt" }, 
                        month: { $month: "$paidAt" } 
                    },
                    totalSales: { $sum: "$totalPrice" }, // إجمالي المبيعات
                    count: { $sum: 1 }, // عدد الطلبات
                },
            },
            {
                $addFields: {
                    formattedDate: {
                        $dateToString: { 
                            format: "%Y-%m", 
                            date: { 
                                $dateFromParts: { 
                                    year: "$_id.year", 
                                    month: "$_id.month", 
                                    day: 1 
                                } 
                            } 
                        }
                    }
                }
            },
            // 4. الترتيب ($sort): لترتيب النتائج من الأقدم إلى الأحدث
            {
                $sort: { "formattedDate": 1 }
            },
        ]);

        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
  markOrderAsPaidAndDeliveredMock,
  getSalesByMonth,
};