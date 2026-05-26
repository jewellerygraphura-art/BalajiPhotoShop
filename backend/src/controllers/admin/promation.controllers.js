import subscriberModel from "../../models/common/subscriber.models.js";
import nodemailer from "nodemailer";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js"
import SibApiV3Sdk from "sib-api-v3-sdk";

const promation = async (req, res) => {
  try {
    const { subject, message, code, percent, expiresAt } = req.body;

    if (!global.PROMO_COUPONS) global.PROMO_COUPONS = {};

    if (!subject || !message) {
      return res.status(400).json(new ApiError(400, "Subject and message are required."));
    }

    const promoCode = code?.toUpperCase();

    if (promoCode && !percent) {
      return res.status(400).json(new ApiError(400, "Percent is required for promo coupon"));
    }

    if (promoCode && !expiresAt) {
      return res.status(400).json(new ApiError(400, "Expiry date is required for promo coupon"));
    }

    const expiry = new Date(expiresAt);
    if (promoCode && isNaN(expiry.getTime())) {
      return res.status(400).json(new ApiError(400, "Invalid expiry date"));
    }

    const subscribers = await subscriberModel.find({ confirmed: true });
    const emails = subscribers.map(s => ({ email: s.email }));

    if (!emails.length) {
      return res.status(400).json(new ApiError(400, "No confirmed subscribers found."));
    }

    // ===== BREVO CONFIG =====
    const client = SibApiV3Sdk.ApiClient.instance;
    client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const htmlContent = promoCode
      ? `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #fff8f2; padding: 30px; border-radius: 10px; border: 1px solid #f5e3d8; max-width: 600px; margin: auto;">
          <div style="text-align: center;">
            <h1 style="color: #c19b6b;">Exclusive Offer from Balaji Gift Shop ✨</h1>
            <p>${message}</p>
          </div>

          <div style="background:#fff; padding:18px; border-radius:8px; text-align:center;">
            <h2>${promoCode}</h2>
            <p><strong>${percent}% OFF</strong></p>
            <p>Valid until: <strong>${expiry.toDateString()}</strong></p>
          </div>

          <div style="text-align:center; margin-top:20px;">
            <a href="https://g-crown-vert.vercel.app/"
              style="padding:12px 26px; background:#c19b6b; color:#fff; text-decoration:none; border-radius:6px;">
              Explore Balaji Gift Shop
            </a>
          </div>
        </div>
      `
      : `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; padding:30px;">
          <h2>A Special Note from Balaji Gift Shop ✨</h2>
          <p style="white-space:pre-line;">${message}</p>

          <div style="text-align:center; margin-top:20px;">
            <a href="https://g-crown-vert.vercel.app/"
              style="padding:12px 26px; background:#c19b6b; color:#fff; text-decoration:none; border-radius:6px;">
              Explore Balaji Gift Shop
            </a>
          </div>
        </div>
      `;

    await apiInstance.sendTransacEmail({
      sender: {
        name: "Balaji Gift Shop",
        email: process.env.BREVO_SENDER_EMAIL || process.env.ADMIN_EMAIL || "jewellery.graphura@gmail.com", // MUST be verified in Brevo
      },
      to: emails, // Brevo supports multiple recipients
      subject,
      htmlContent,
    });

    // Save promo code
    if (promoCode) {
      global.PROMO_COUPONS[promoCode] = {
        percent,
        expiresAt: expiry,
      };
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        null,
        promoCode
          ? `Promotion with code ${promoCode} sent successfully!`
          : "Promotion sent to all subscribers!"
      )
    );

  } catch (err) {
    console.log("Brevo Promotion Error:", err.response?.body || err);
    return res.status(500).json(new ApiError(500, err.message));
  }
};



export { promation }