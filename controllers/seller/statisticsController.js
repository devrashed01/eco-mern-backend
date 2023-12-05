const Sale = require("../../models/Sale");
const User = require("../../models/User");

exports.statistics = async (req, res) => {
  let statistics = await Sale.aggregate([
    {
      $match: {
        role: "seller",
      },
    },
    {
      $group: {
        _id: null,
        totalSalesCount: { $sum: 1 },
        totalPrice: { $sum: "$total" },
      },
    },
  ]);
  let adminCommission = await User.aggregate([
    {
      $match: {
        role: "seller",
      },
    },
    {
      $group: {
        _id: null,
        adminCommission: { $sum: "$commission" },
      },
    },
  ]);

  const { totalSalesCount, totalPrice } = statistics[0];

  return res.json({
    totalSalesCount,
    totalPrice,
    adminCommission: adminCommission?.[0]?.adminCommission || 0,
  });
};
