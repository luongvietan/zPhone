const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Đảm bảo biến môi trường này được cấu hình
    pass: process.env.EMAIL_PASS, // Đảm bảo biến môi trường này được cấu hình
  },
});

const sendOrderConfirmationEmail = async (userEmail, order) => {
  try {
    // Log: Chuẩn bị nội dung email
    console.log("[EMAIL] Preparing email content for:", userEmail);

    const itemsList = order.items
      .map(
        (item) => `
      <li>
        ${item.product_name} (${item.storage}) - 
        Số lượng: ${item.quantity} - 
        Giá: ${(item.price * 1000000).toLocaleString()} VND
      </li>
    `
      )
      .join("");

    const mailOptions = {
      from: `Shop Name <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Xác nhận đơn hàng thành công",
      html: `
        <h1>Cảm ơn bạn đã đặt hàng!</h1>
        <p>Mã giao dịch: <strong>${order.transactionId}</strong></p>
        <p>Ngày đặt hàng: ${new Date(order.orderDate).toLocaleString(
          "vi-VN"
        )}</p>
        <h3>Chi tiết đơn hàng:</h3>
        <ul>${itemsList}</ul>
        <p>Tổng cộng: <strong>${(
          order.total * 1000000
        ).toLocaleString()} VND</strong></p>
      `,
    };

    // Log: Thử gửi email
    console.log("[EMAIL] Attempting to send email...");

    const info = await transporter.sendMail(mailOptions);

    // Log: Email đã được gửi thành công
    console.log("[EMAIL] Email delivered:", {
      messageId: info.messageId,
      to: userEmail,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Log: Lỗi gửi email
    console.error("[EMAIL] Failed to send email:", {
      error: error.message,
      stack: error.stack,
      mailOptions: {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
      },
    });
  }
};

module.exports = { sendOrderConfirmationEmail };
