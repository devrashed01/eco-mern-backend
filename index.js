const express = require("express");
const cors = require("cors");
const connectDB = require("./config/dbConnect");
const morgan = require("morgan");
require("express-async-errors");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads/"));
const corsOptions = {
  origin: "https://eco-mern-frontend.vercel.app/",
};
app.use(cors(corsOptions));

app.use("/api", require("./routes/api"));

app.get("/", (req, res) => {
  res.json({
    message: "Server is on 🔥",
  });
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
