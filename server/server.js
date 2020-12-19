const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
//const authRoutes = require("./routes/auth");

require("dotenv").config();

connectDB();

const app = express();

// Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(cors());

// Routes Middleware
fs.readdirSync("./routes").map((r) =>
  app.use("/api", require("./routes/" + r))
);

// Listen
const PORT = process.env.PORT || 8000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
