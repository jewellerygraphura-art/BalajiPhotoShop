
import Order from "../../models/order/Order.js";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import razorpay from "../../configs/razorpay.js";

import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import {ApiError} from "../../utils/api-error.js"

// Get My Orders

export const getAllOrders = async (req, res) => {

  const { role } = req.user;

  if (role) {
    return res.status(401).json(new ApiError(401, "Your are not Customer"));
  }

  const orders = await Order.find({});
  res.json(orders);
};

export const getOrders = async (req, res) => {

  const { role } = req.user;

  if (role) {
    return res.status(401).json(new ApiError(401, "Your are not Customer"));
  }

  const orders = await Order.find({ userId: req.user._id });
  res.json(orders);
};

export const createOrder = async (req, res) => {

  const { role } = req.user;

  if (role) {
    return res.status(401).json(new ApiError(401, "Your are not Customer"));
  }

  const displayOrderId = "GC-" + Date.now();

  const products = req.body.products.map(p => ({
    name: p.name,
    price: p.price,
    qty: p.qty,
    productImage: p.productImage   // 🔥 ही line add कर
  }));

  const newOrder = new Order({
    ...req.body,
    products,
    displayOrderId,
    userId: req.user._id,
    orderStatus: "Accepted"
  });

  await newOrder.save();
  res.json(newOrder);
};


// Update Status
export const updateOrderStatus = async (req, res) => {

  const { role } = req.user;

  if (!role) {
    return res.status(401).json(new ApiError(401, "No Auth"));
  }

  await Order.findByIdAndUpdate(req.params.id, {
    orderStatus: req.body.status,
    statusText: req.body.statusText
  });
  res.json({ message: "Order Status Updated" });
};

export const generateInvoice = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid order id");
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send("Order not found");

    const templatePath = path.join(__dirname, "../../templates/invoice.html");
    let html = fs.readFileSync(templatePath, "utf8");

    const escapeHtml = (value = "") =>
      String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");

    const products = Array.isArray(order.products) ? order.products : [];
    const invoiceDate = order.date
      ? new Date(order.date).toLocaleDateString("en-IN")
      : new Date().toLocaleDateString("en-IN");
    const total = Number(order.total || 0);

    const shippingName = order.address ? order.address.fullName : "Customer";
    const shippingEmail = order.userEmail || "Not Available";
    const shippingPhone = order.address?.mobile
      ? `Ph: +91 ${order.address.mobile}`
      : "Ph: Not Available";
    const shippingAddress = order.address
      ? `${order.address.addressLine}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`
      : "Not Available";
    const paymentStatus = order.orderStatus === "Cancelled" ? "CANCELLED" : "PAID";
    const paymentMethod = order.method || "Online Transfer";
    const paymentRef = order.paymentId || order.razorpayOrderId || order._id.toString().slice(-8).toUpperCase();

    // 1. Calculate Values
    const subTotal = total / 1.03;
    const gstAmount = total - subTotal;
    const shippingCharge = 0; // Agar koi shipping charge fix hai toh yahan daalein

    // 2. Generate Product Rows
    let rows = "";
    products.forEach((p) => {
      const name = escapeHtml(p?.name || "Product");
      const qty = Number(p?.qty || 0);
      const price = Number(p?.price || 0);
      rows += `
        <tr>
          <td>${name}</td>
          <td align="center">${qty}</td>
          <td>₹${price.toLocaleString("en-IN")}</td>
          <td align="right">₹${Number(qty * price).toLocaleString("en-IN")}</td>
        </tr>
      `;
    });

    if (!rows) {
      rows = `
        <tr>
          <td>Order Items</td>
          <td align="center">-</td>
          <td>₹0</td>
          <td align="right">₹0</td>
        </tr>
      `;
    }

    // 3. Replace all placeholders (Matching with the new Template)
    html = html
      .replace("{{invoiceNo}}", escapeHtml(order.invoiceNo || "INV-GC-" + order._id.toString().slice(-6)))
      .replace("{{orderId}}", escapeHtml(order.displayOrderId || order._id.toString()))
      .replace("{{invoiceDate}}", escapeHtml(invoiceDate))
      .replace("{{billingName}}", "GC Jewellery Pvt Ltd")
      .replace("{{billingAddress}}", "FC Road, Pune, Maharashtra - 411004")
      .replace("{{shippingName}}", escapeHtml(shippingName || "Customer"))
      .replace("{{shippingEmail}}", escapeHtml(shippingEmail))
      .replace("{{shippingAddress}}", escapeHtml(shippingAddress || "Not Available"))
      .replace("{{shippingPhone}}", escapeHtml(shippingPhone))
      .replace("{{productRows}}", rows)
      .replace("{{subTotal}}", subTotal.toFixed(2))
      .replace("{{gstAmount}}", gstAmount.toFixed(2))
      .replace("{{shippingCharge}}", shippingCharge.toFixed(2))
      .replace("{{grandTotal}}", total.toLocaleString("en-IN"))
      .replace("{{paymentStatus}}", escapeHtml(paymentStatus))
      .replace("{{paymentMethod}}", escapeHtml(paymentMethod))
      .replace("{{paymentRef}}", escapeHtml(paymentRef));

    let browser = null;
    const launchArgs = [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process"
    ];

    const launchAttempts = [
      {
        name: "default bundled chromium",
        options: { headless: true, args: launchArgs }
      },
      {
        name: "env executable path",
        options: {
          headless: true,
          executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
          args: launchArgs
        }
      },
      {
        name: "system chrome channel",
        options: { headless: true, channel: "chrome", args: launchArgs }
      }
    ];

    let lastLaunchError = null;
    for (const attempt of launchAttempts) {
      if (attempt.name === "env executable path" && !attempt.options.executablePath) {
        continue;
      }

      try {
        browser = await puppeteer.launch(attempt.options);
        break;
      } catch (launchErr) {
        lastLaunchError = launchErr;
        console.log(`PUPPETEER LAUNCH FAILED (${attempt.name}) =>`, launchErr?.message || launchErr);
      }
    }

    if (!browser) {
      console.log("PUPPETEER ALL LAUNCH ATTEMPTS FAILED =>", lastLaunchError?.message || lastLaunchError);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(200).send(html);
    }

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "12mm",
          right: "12mm",
          bottom: "12mm",
          left: "12mm"
        }
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=invoice-${order.displayOrderId || order._id}.pdf`
      );
      return res.status(200).send(pdfBuffer);
    } catch (pdfError) {
      console.log("PDF ERROR =>", pdfError);

      // Fallback: still show invoice content so user can print/save.
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(200).send(html);
    } finally {
      if (browser) {
        await browser.close();
      }
    }

  } catch (err) {
    console.log("INVOICE ERROR => ", err);
    res.status(500).send("Error generating invoice");
  }
};
export const saveOrder = async (req, res) => {
  try {
    const displayOrderId = "GC-" + Date.now();

    const products = req.body.products.map(p => ({
      name: p.name,
      price: p.price,
      qty: p.qty,
      productImage: p.productImage   // 🔥 THIS LINE IS MAIN
    }));

    const order = new Order({
      ...req.body,
      products: products,
      displayOrderId,
      userId: req.user._id,
      orderStatus: "Accepted"
    });

    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const cancelOrder = async (req, res) => {
  try {

    const { role } = req.user;

    if (role) {
      return res.status(401).json(new ApiError(401, "Your are not Customer"));
    }

    await Order.findByIdAndUpdate(req.params.id, {
      orderStatus: "Cancelled",   // ✅ योग्य field
      statusText: "Your order has been cancelled by user"
    });

    res.json({ success: true, message: "Order Cancelled" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const requestRefund = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Refund reason is required"
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.orderStatus === "Refund Requested") {
      return res.status(400).json({
        success: false,
        message: "Refund already requested"
      });
    }

    order.orderStatus = "Refund Requested";
    order.statusText = "Your order is Refund Requested";
    order.refundRequest = {
      reason,
      status: "Pending",
      requestedAt: new Date()
    };

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Refund request submitted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const processRefund = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    if (order.orderStatus !== "Refund Requested")
      return res.status(400).json({ message: "Refund not requested" });

    if (!order.paymentId)
      return res.status(400).json({ message: "No Razorpay payment ID found" });

    const refund = await razorpay.payments.refund(order.paymentId, {
      amount: order.total * 100,
      speed: "normal"
    });

    order.orderStatus = "Refunded";
    order.refundAmount = order.total;
    order.refundDate = new Date();
    order.refundTransactionId = refund.id;
    order.refundRequest = {
      status: "Approved",
      requestedAt: new Date()
    };

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      refundId: refund.id
    });

  } catch (error) {
    console.error("Refund processing error:", {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      body: error.body,
      orderId: req.params.orderId
    });
    
    // Handle specific Razorpay errors
    if (error.statusCode === 400 && error.body?.error?.code === "BAD_REQUEST_ERROR") {
      return res.status(400).json({
        message: "Invalid payment ID or already refunded",
        error: error.body?.error?.description || error.message
      });
    }
    
    if (error.code === "RAZORPAY_ERROR") {
      return res.status(400).json({
        message: "Razorpay error",
        error: error.message
      });
    }
    
    return res.status(500).json({
      message: "Refund processing failed",
      error: error.message || "Unknown error occurred"
    });
  }
};
