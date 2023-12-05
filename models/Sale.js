const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const saleSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    customerName: {
      type: String,
      required: true,
    },
    products: [
      {
        product: {
          type: String,
          required: true,
        },
        variant: {
          type: String,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        extras: [
          {
            name: {
              type: String,
              required: true,
            },
            price: {
              type: Number,
              required: true,
            },
            quantity: {
              type: Number,
              default: 1,
            },
          },
        ],
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    vat: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

saleSchema.plugin(aggregatePaginate);
const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;
