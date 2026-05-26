import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import customerAuthRoutes from "./routers/customer/auth.route.js";
import customerProductRoutes from "./routers/customer/product.route.js";
import wishListRoutes from "./routers/customer/wishlist.route.js";
import customerStoreRoutes from "./routers/customer/store.route.js";
import cartRoutes from "./routers/customer/cart.route.js";
import subscribeRoutes from "./routers/customer/subcribe&coupon.route.js";

import adminAuthRoutes from "./routers/admin/auth.route.js";
import adminProductRoutes from "./routers/admin/product.route.js";
import adminStoreRoutes from "./routers/admin/store.route.js";
import adminPromationRoutes from "./routers/admin/promation.route.js";
import seedRoutes from "./routers/admin/seed.route.js";
import adminB2bRoutes from "./routers/admin/b2bAdmin.route.js";

import userOrderRoutes from "./routers/order/userOrder.route.js";
import orderRoutes from "./routers/order/order.routes.js";
import adminOrderRoutes from "./routers/order/adminOrderRoutes.js";
import commonSearchRoutes from "./routers/common/search.route.js";
import InquiryRoute from "./routers/common/inquirry.route.js"

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://g-crown-vert.vercel.app",
  "https://www.newbalajiphotoframeandgift.com",
  "https://newbalajiphotoframeandgift.com"
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1")
      ) {
        return callback(null, true);
      }

      console.error(`⚠️ CORS BLOCK: Blocked origin is: "${origin}"`);
      return callback(new Error(`Not allowed by CORS: "${origin}"`));
    },
    credentials: true,
  })
);


app.get("/api/test", (req, res) => {
  res.json({ message: "Rewrite working 🚀" });
});

app.use(cookieParser());

app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "100mb" }));

app.use("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

app.use("/api/v1/customer/auth", customerAuthRoutes);
app.use("/api/v1/customer/product", customerProductRoutes);
app.use("/api/v1/customer/wishlist", wishListRoutes);
app.use("/api/v1/customer/store", customerStoreRoutes);
app.use("/api/v1/customer/cart", cartRoutes);
app.use("/api/v1/customer/subscribe&coupon", subscribeRoutes);

app.use("/api/v1/admin/auth", adminAuthRoutes);
app.use("/api/v1/admin/product", adminProductRoutes);
app.use("/api/v1/admin/store", adminStoreRoutes);
app.use("/api/v1/admin/order", adminOrderRoutes);
app.use("/api/v1/admin/prom", adminPromationRoutes);
app.use("/api/v1/admin/seed", seedRoutes);
app.use("/api/v1/admin/b2b", adminB2bRoutes);

app.use("/api/v1/customer/order", orderRoutes);

app.use("/api/v1/common", commonSearchRoutes);
app.use("/api/v1/inquiry", InquiryRoute);



export default app;
