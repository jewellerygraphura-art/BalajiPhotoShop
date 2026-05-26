import SibApiV3Sdk from "sib-api-v3-sdk";

export const sendOrderConfirmationMail = async ({
    to,
    userName,
    orderId,
    invoiceNo,
    total,
    products,
    address,
}) => {
    try {
        const client = SibApiV3Sdk.ApiClient.instance;
        client.authentications["api-key"].apiKey =
            process.env.BREVO_API_KEY;

        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        const productRows = products
            .map(
                (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.qty}</td>
          <td>₹${item.price}</td>
        </tr>
      `
            )
            .join("");

        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        sendSmtpEmail.sender = {
            name: "Balaji Gift Shop",
            email: process.env.ADMIN_EMAIL, 
        };

        sendSmtpEmail.to = [
            {
                email: to,
                name: userName,
            },
        ];

        sendSmtpEmail.subject = `Order Confirmation - ${orderId}`;

        sendSmtpEmail.htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Order Confirmation</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; padding:20px 0;">
    <tr>
      <td align="center">
        
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 5px 15px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background:#111111; padding:25px;">
              <h1 style="color:#D4AF37; margin:0; font-size:28px; letter-spacing:1px;">
                Balaji Gift Shop
              </h1>
              <p style="color:#ffffff; margin:5px 0 0;">Premium Curated Gifts</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:30px;">
              <h2 style="margin-top:0;">Hi ${userName},</h2>
              <p style="font-size:15px; color:#555;">
                🎉 Thank you for your purchase! Your order has been successfully placed.
                We’re preparing your gifts with utmost care.
              </p>

              <!-- Order Box -->
              <table width="100%" cellpadding="10" cellspacing="0" style="background:#fafafa; border:1px solid #eee; border-radius:8px;">
                <tr>
                  <td><strong>Order ID:</strong></td>
                  <td align="right">${orderId}</td>
                </tr>
                <tr>
                  <td><strong>Invoice No:</strong></td>
                  <td align="right">${invoiceNo}</td>
                </tr>
                <tr>
                  <td><strong>Total Amount:</strong></td>
                  <td align="right" style="color:#D4AF37; font-size:16px;"><strong>₹${total}</strong></td>
                </tr>
              </table>

              <!-- Shipping -->
              <h3 style="margin-top:30px; border-bottom:2px solid #D4AF37; padding-bottom:5px;">
                Shipping Address
              </h3>
              <p style="color:#555; line-height:1.6;">
                ${address.fullName}<br/>
                ${(address.street)?address.street:""}<br/>
                ${address.city}, ${address.state} - ${address.pincode}<br/>
                📞 ${address.mobile}
              </p>

              <!-- Products -->
              <h3 style="margin-top:30px; border-bottom:2px solid #D4AF37; padding-bottom:5px;">
                Order Summary
              </h3>

              <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse:collapse;">
                <thead>
                  <tr style="background:#111; color:#fff;">
                    <th align="left">Product</th>
                    <th align="center">Qty</th>
                    <th align="right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${productRows}
                </tbody>
              </table>

              <p style="margin-top:25px; font-size:14px; color:#777;">
                We will notify you once your order is shipped.
              </p>

              <!-- CTA Button -->
              <div style="text-align:center; margin:30px 0;">
                <a href="https://yourwebsite.com/orders"
                   style="background:#D4AF37; color:#000; padding:12px 25px; 
                          text-decoration:none; border-radius:25px; font-weight:bold;">
                  Track Your Order
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background:#111; padding:20px; color:#aaa; font-size:12px;">
              © ${new Date().getFullYear()} Balaji Gift Shop. All rights reserved.<br/>
              Crafted with ❤️ for timeless gifting.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;

        await apiInstance.sendTransacEmail(sendSmtpEmail);

    } catch (error) {
        console.error(
            "Brevo Email Error:",
            error.response?.body || error.message
        );
    }
};