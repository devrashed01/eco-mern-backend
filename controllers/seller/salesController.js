const { validationResult } = require("express-validator");
const Sale = require("../../models/Sale");
const User = require("../../models/User");
const { ObjectId } = require("mongoose").Types;

function calculateCommission(totalSalesAmount, userType) {
  let commissionPercentage;

  if (userType === "admin") {
    // Admin commission (fixed percentage)
    commissionPercentage = 0.05; // 5%
  } else if (userType === "seller") {
    // Seller commission (base percentage)
    commissionPercentage = 0.02; // 2%

    // Bonus commission for high performers (optional)
    if (totalSalesAmount > 10000) {
      commissionPercentage += 0.01; // Additional 1% for sales exceeding $10,000
    }
  } else {
    // Default commission for other user types
    commissionPercentage = 0;
  }

  // Calculate commission
  const commission = totalSalesAmount * commissionPercentage;
  return commission;
}

exports.create = async (req, res) => {
  // check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { customerName, products, extras, discount } = req.body;

  // Calculate total
  const vat =
    0.12 *
    products.reduce((acc, curr) => {
      return acc + curr.price * curr.quantity;
    }, 0);
  const subtotal = products.reduce((acc, curr) => {
    const extrasTotal = curr?.extras?.reduce((acc, curr) => {
      return acc + curr.price * curr.quantity;
    }, 0);
    return acc + curr.price * curr.quantity + extrasTotal;
  }, 0);

  const total = subtotal + vat - discount;

  let userId = req.user._id;

  const sale = await new Sale({
    customerName,
    products,
    extras,
    subtotal,
    vat,
    discount,
    total,
    user: userId,
  });

  const newSale = await sale.save();

  // Get user
  const seller = await User.findById(userId);

  if (!seller) {
    return res.status(404).json({
      error: "Seller not found",
    });
  }

  // Calculate commission
  const commission = calculateCommission(total, seller.role);
  seller.commission += commission;
  await seller.save();

  // update admin's total commission
  const admin = await User.findOne({ role: "superadmin" });
  const adminCommission = calculateCommission(total, admin.role);
  admin.commission += adminCommission;
  await admin.save();

  return res.json({
    data: newSale,
    message: "Sale created successfully",
  });
};

exports.list = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  let userId = new ObjectId(req.user._id);

  let aggregatedQuery = Sale.aggregate([
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $match: {
        $or: [
          { customerName: { $regex: search, $options: "i" } },
          { "products.name": { $regex: search, $options: "i" } },
          { "extras.name": { $regex: search, $options: "i" } },
          { total: { $regex: search, $options: "i" } },
        ],
        user: userId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              name: 1,
              email: 1,
              phone: 1,
              address: 1,
              role: 1,
            },
          },
        ],
      },
    },
  ]);

  let options = {
    page,
    limit,
  };
  if (limit === -1) {
    options.limit = 100000000000;
  }

  const sales = await Sale.aggregatePaginate(aggregatedQuery, options);
  return res.json(sales);
};

exports.details = async (req, res) => {
  let query = {};
  query = { _id: req.params.id, user: req.user._id };
  const sales = await Sale.findOne(query).populate("user", "name email");
  return res.json({
    data: sales,
  });
};

exports.deleteSale = async (req, res) => {
  const sale = await Sale.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!sale) {
    return res.status(404).json({
      error: "Invalid sale",
    });
  }

  await sale.deleteOne();

  return res.json({
    sale,
    message: "Sale deleted successfully",
  });
};
