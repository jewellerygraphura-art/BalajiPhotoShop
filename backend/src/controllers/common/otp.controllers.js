import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import SibApiV3Sdk from "sib-api-v3-sdk";

const otp = async (req, res) => {

    try {
        const rawEmail = req.body?.email;
        const email = rawEmail?.trim()?.toLowerCase();

        if (!email) {
            return res.status(400).json(new ApiError(400, "Email is required"));
        }

        if (!process.env.BREVO_API_KEY) {
            return res.status(500).json(new ApiError(500, "BREVO_API_KEY is not configured"));
        }

        // Generate 6-digit OTP properly
        const OTP = Math.floor(100000 + Math.random() * 900000).toString();

        const client = SibApiV3Sdk.ApiClient.instance;

        // Add Brevo API Key
        client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.ADMIN_EMAIL || "jewellery.graphura@gmail.com";
        const senderName = process.env.BREVO_SENDER_NAME || "Balaji Gift Shop";

        const emailData = {
            sender: {
                name: senderName,
                email: senderEmail,
            },
            to: [
                {
                    email,
                },
            ],
            replyTo: {
                email: senderEmail,
                name: senderName,
            },
            subject: "Your Balaji Gift Shop Verification Code",
            htmlContent: `
<div style="margin:0;padding:0;background:#fdf8ef;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="500" cellpadding="0" cellspacing="0" 
          style="background:#ffffff;border-radius:12px;
          box-shadow:0 8px 24px rgba(0,0,0,0.08);overflow:hidden;">

          <tr>
            <td style="background:linear-gradient(135deg,#1C3A2C,#CBA135);
              padding:25px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;letter-spacing:1px;">
                BALAJI
              </h1>
              <p style="color:#fdf8ef;margin:5px 0 0;font-size:13px;">
                Premium Curated Gifts
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:35px 30px;text-align:center;color:#333;">
              <h2 style="margin:0 0 15px;color:#1C3A2C;">
                Verify Your Account
              </h2>

              <p style="font-size:14px;color:#555;margin-bottom:25px;">
                Use the verification code below to complete your login.
              </p>

              <div style="
                display:inline-block;
                padding:18px 40px;
                background:#f4efe4;
                border-radius:10px;
                border:2px dashed #CBA135;
                font-size:32px;
                font-weight:bold;
                letter-spacing:6px;
                color:#1C3A2C;
              ">
                ${OTP}
              </div>

              <p style="margin-top:25px;font-size:13px;color:#666;">
                This OTP will expire in <b>5 minutes</b>.
              </p>

              <p style="margin-top:10px;font-size:12px;color:#999;">
                For security reasons, do not share this code with anyone.
              </p>
            </td>
          </tr>

          <tr>
            <td style="
              background:#f9f4e8;
              padding:18px;
              text-align:center;
              font-size:12px;
              color:#777;
            ">
              © ${new Date().getFullYear()} Balaji Gift Shop. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</div>
`,
        };

        await apiInstance.sendTransacEmail(emailData);

        return res
            .status(200)
            .json(new ApiResponse(200, OTP, "Otp Sent Successfully."));

    }
    catch (err) {
        console.error("OTP send failed:", {
            message: err?.message,
            code: err?.code,
            status: err?.status,
            response: err?.response?.body || err?.response?.text,
        });

        const providerMessage =
            err?.response?.body?.message ||
            err?.response?.body?.code ||
            err?.message ||
            "Unable to send OTP email";

        return res.status(500).json(
            new ApiError(500, "OTP delivery failed", [{ message: providerMessage, name: err?.name || "BrevoError" }])
        );
    }
}

export default otp;