import subscriberModel from "../../models/common/subscriber.models.js";
import nodemailer from "nodemailer";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js"

import SibApiV3Sdk from "sib-api-v3-sdk";

const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json(new ApiError(400, "Invalid email"));
    }

    let subscriber = await subscriberModel.findOne({ email });

    if (subscriber) {
      return res
        .status(400)
        .json(new ApiError(400, "You have already subscribed to Balaji Gift Shop."));
    }

    subscriber = await subscriberModel.create({
      email,
      confirmed: true,
      usedCodes: []
    });

    // ===== BREVO CONFIG =====
    const client = SibApiV3Sdk.ApiClient.instance;
    client.authentications["api-key"].apiKey =
      process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    await apiInstance.sendTransacEmail({
      sender: {
        name: "Balaji Gift Shop",
        email: process.env.BREVO_SENDER_EMAIL || process.env.ADMIN_EMAIL || "jewellery.graphura@gmail.com", // MUST be verified in Brevo
      },
      to: [{ email: subscriber.email }],
      subject: "Subscription Confirmed 🎉",
      htmlContent: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #fff8f2; padding: 30px; border-radius: 10px; border: 1px solid #f5e3d8; max-width: 600px; margin: auto;">
          <div style="text-align: center;">
            <h1 style="color: #c19b6b;">Welcome to Balaji Gift Shop ✨</h1>
            <p>Discover Heritage. Embrace Curation.</p>
          </div>

          <p>
            Thank you for joining our exclusive community of gift lovers!
            <strong>Balaji Gift Shop</strong> brings you the finest curated pieces.
          </p>

          <div style="background:#fff; padding:18px; border-radius:8px; text-align:center;">
            <h2>WELCOME20</h2>
            <p><strong>20% OFF</strong> on your first purchase.</p>
          </div>

          <div style="text-align:center; margin-top:20px;">
            <a href="https://g-crown-vert.vercel.app/"
               style="padding:12px 26px; background:#c19b6b; color:#fff; text-decoration:none; border-radius:6px;">
              Explore Balaji Gift Shop
            </a>
          </div>

          <p style="text-align:center; font-size:12px; margin-top:25px;">
            With Love & Craftsmanship — Balaji Gift Shop Family
          </p>
        </div>
      `,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Subscribed successfully & welcome code sent!"));

  } catch (err) {
    console.log("Brevo Subscribe Error:", err.response?.body || err);

    return res.status(500).json(
      new ApiError(500, err.message, [{ message: err.message, name: err.name }])
    );
  }
};



const userCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const { email } = req.user;

    if (!code) {
      return res.status(400).json(new ApiError(400, "Coupon code required"));
    }

    const coupon = code.toUpperCase();
    const subscriber = await subscriberModel.findOne({ email });

    if (!subscriber) {
      return res.status(404).json(new ApiError(404, "User not subscribed"));
    }

    const defaultCoupons = { WELCOME20: 20 };

    let percent = defaultCoupons[coupon];

    const dynamicCoupon = global.PROMO_COUPONS?.[coupon];

    if (dynamicCoupon) {

      if (dynamicCoupon.expiresAt) {
        const now = new Date();
        const expiry = new Date(dynamicCoupon.expiresAt);
        if (now > expiry) {
          return res.status(400).json(new ApiError(400, "Coupon expired"));
        }
      }

      if (subscriber.usedCodes.includes(coupon)) {
        return res.status(400).json(new ApiError(400, `${coupon} already used`));
      }

      percent = dynamicCoupon.percent;
      subscriber.usedCodes.push(coupon);
      await subscriber.save();
    }

    if (!percent) {
      return res.status(400).json(new ApiError(400, "Invalid coupon code"));
    }

    if (coupon === "WELCOME20") {
      if (subscriber.usedCodes.includes(coupon)) {
        return res.status(400).json(new ApiError(400, `${coupon} already used`));
      }
      subscriber.usedCodes.push(coupon);
      await subscriber.save();
    }

    return res
      .status(200)
      .json(new ApiResponse(200, percent, `${coupon} applied successfully!`));

  } catch (err) {
    return res
      .status(500)
      .json(new ApiError(500, err.message));
  }
};




export { subscribe, userCoupon };



