const express = require("express");
const cors = require("cors");
const connectDB = require("./config/dbConnect");
const morgan = require("morgan");
const User = require("./models/User");
require("express-async-errors");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads/"));
app.use(morgan("dev"));

app.use("/api", require("./routes/api"));

app.get("/", async (req, res) => {
  // find users
  const users = await User.find();
  return res.json(users);
  // res.json({
  //   message: "Server is on 🔥",
  // });
});
app.all("*", (req, res, next) => {
  res
    .status(404)
    .json(`Can't find route ${req.originalUrl} on this Node server`);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);

  connectDB();
});
