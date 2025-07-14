require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const shopProductsRouter = require("./routes/shop/product-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes")
const adminOrderRouter = require("./routes/admin/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const reviewRoutes = require("./routes/shop/review-routes");
const commonFeatureRoutes = require("./routes/common/feature-routes");
mongoose.connect(process.env.MONGODB_URL).then(() => {console.log('Connected to MongoDB');}).catch((err) => {console.error('MongoDB connection error:', err);});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,  // exact match
    credentials: true,                // allow cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.get("/api/test", (req, res) => {
  res.json({ message: "CORS working" });
});



app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart",shopCartRouter);
app.use("/api/shop/address",shopAddressRouter);
app.use("/api/shop/order",shopOrderRouter)
app.use("/api/admin/orders",adminOrderRouter)
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", reviewRoutes);
app.use("/api/common/feature", commonFeatureRoutes);
app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));