import SibApiV3Sdk from "sib-api-v3-sdk";


const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();


const sendContactMail = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Name, Email and Message are required",
    });
  }

  try {
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 5px 20px rgba(0,0,0,0.08);">
              
              <tr>
                <td style="background:#1C3A2C; padding:25px; text-align:center;">
                  <h1 style="color:#ffffff; margin:0;">📩 New Inquiry Received</h1>
                </td>
              </tr>

              <tr>
                <td style="padding:30px;">
                  <p>You received a new message from your website.</p>

                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Subject:</strong> ${subject || "General Inquiry"}</p>

                  <div style="margin-top:15px; padding:15px; background:#f9fafb; border-left:4px solid #1C3A2C;">
                    ${message}
                  </div>

                  <p style="margin-top:20px; font-size:12px; color:#999;">
                    Auto generated from contact form.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px;">
                  © ${new Date().getFullYear()} Your Company
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

  
    await apiInstance.sendTransacEmail({
      sender: {
        email: process.env.ADMIN_EMAIL,
        name: process.env.comapnyName,
      },
      to: [
        {
          email: process.env.ADMIN_EMAIL,
          name: "Admin",
        },
      ],
      replyTo: {
        email: email,
        name: name,
      },
      subject: subject || "New Contact Inquiry",
      htmlContent: htmlTemplate,
    });

    await apiInstance.sendTransacEmail({
      sender: {
        email: process.env.ADMIN_EMAIL,
        name: process.env.comapnyName,
      },
      to: [
        {
          email: email,
          name: name,
        },
      ],
      subject: "We Received Your Message ✅",
      htmlContent: `
        <h2>Hello ${name},</h2>
        <p>Thank you for contacting us. We will reply shortly.</p>
        <p><strong>Your Message:</strong></p>
        <p>${message}</p>
        <br/>
        <p>Best Regards,<br/>Your Company Team</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Inquiry sent successfully",
    });

  } catch (error) {
    console.error("Email Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
};

const sendConsultationMail = async (req, res) => {
  const { name, email, preferredDate, preferredTime } = req.body;

  if (!name || !email || !preferredDate || !preferredTime) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const adminTemplate = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 5px 20px rgba(0,0,0,0.08);">
              
              <tr>
                <td style="background:#1C3A2C; padding:25px; text-align:center;">
                  <h1 style="color:#ffffff; margin:0;">📅 New Consultation Booking</h1>
                </td>
              </tr>

              <tr>
                <td style="padding:30px;">
                  <p>A new consultation request has been submitted.</p>

                  <p><strong>Full Name:</strong> ${name}</p>
                  <p><strong>Email Address:</strong> ${email}</p>
                  <p><strong>Preferred Date:</strong> ${preferredDate}</p>
                  <p><strong>Preferred Time:</strong> ${preferredTime}</p>

                  <p style="margin-top:20px; font-size:12px; color:#999;">
                    Auto generated from Book a Consultation form.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px;">
                  © ${new Date().getFullYear()} ${process.env.COMPANY_NAME}
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    await apiInstance.sendTransacEmail({
      sender: {
        email: process.env.ADMIN_EMAIL,
        name: process.env.COMPANY_NAME,
      },
      to: [
        {
          email: process.env.ADMIN_EMAIL,
          name: "Admin",
        },
      ],
      replyTo: {
        email: email,
        name: name,
      },
      subject: "📅 New Consultation Booking",
      htmlContent: adminTemplate,
    });

    const userTemplate = `
      <h2>Hello ${name},</h2>
      <p>Thank you for booking a consultation with us.</p>

      <p><strong>Your Requested Slot:</strong></p>
      <p>Date: ${preferredDate}</p>
      <p>Time: ${preferredTime}</p>

      <p>Our concierge will confirm your session shortly.</p>

      <br/>
      <p>Best Regards,<br/>${process.env.COMPANY_NAME} Team</p>
    `;

    await apiInstance.sendTransacEmail({
      sender: {
        email: process.env.ADMIN_EMAIL,
        name: process.env.COMPANY_NAME,
      },
      to: [
        {
          email: email,
          name: name,
        },
      ],
      subject: "Consultation Request Received ✅",
      htmlContent: userTemplate,
    });

    return res.status(200).json({
      success: true,
      message: "Consultation request sent successfully",
    });

  } catch (error) {
    console.error("Email Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send consultation email",
    });
  }
};

export {sendContactMail, sendConsultationMail}