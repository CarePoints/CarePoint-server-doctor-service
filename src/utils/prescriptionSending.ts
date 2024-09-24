

import nodemailer from "nodemailer";

async function sendPrescription(
  patientEmail: string,
  originalname: string,
  buffer: any
) {
  console.log("patientEmail:", patientEmail);
  console.log("originalname:", originalname);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "akbarhaleel508@gmail.com",
      pass: "ejev ngqr qtxb khwn",
    },
  });

  const mailOptions = {
    from: "akbarhaleel508@gmail.com",
    to: patientEmail,
    subject: "Your Medical Prescription",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Medical Prescription</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f6f9fc; margin: 0; padding: 0;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <tr>
            <td style="background: linear-gradient(135deg, #0061f2 0%, #00c6f9 100%); padding: 30px 0; text-align: center;">
                <img src="/api/placeholder/200/60" alt="CarePoint Logo" style="max-width: 200px; height: auto;" />
            </td>
        </tr>
        <tr>
            <td style="padding: 40px 30px;">
                <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px;">Your Medical Prescription</h1>
                <p style="color: #555555; font-size: 16px; line-height: 1.6;">Hello,</p>
                <p style="color: #555555; font-size: 16px; line-height: 1.6;">We hope this email finds you well. Your medical prescription has been carefully prepared and is attached to this email for your convenience.</p>
                <p style="color: #555555; font-size: 16px; line-height: 1.6;">Please review the prescription carefully and follow the instructions provided by your healthcare provider. If you have any questions or concerns, don't hesitate to reach out to us.</p>
                <div style="background-color: #f0f7ff; border-left: 4px solid #0061f2; padding: 15px; margin: 30px 0;">
                    <p style="color: #0061f2; font-size: 16px; margin: 0;">Remember: Your health is our priority. Always consult with your doctor before making any changes to your medication regimen.</p>
                </div>
                <p style="color: #555555; font-size: 16px; line-height: 1.6;">Wishing you the best in health,</p>
                <p style="color: #555555; font-size: 16px; line-height: 1.6;">The CarePoint Team</p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f6f9fc; padding: 20px 30px; text-align: center;">
                <p style="color: #888888; font-size: 14px; margin: 0;">&copy; ${new Date().getFullYear()} CarePoint. All rights reserved.</p>
                <p style="color: #888888; font-size: 14px; margin: 10px 0 0;">
                    <a href="#" style="color: #0061f2; text-decoration: none;">Privacy Policy</a> | 
                    <a href="#" style="color: #0061f2; text-decoration: none;">Terms of Service</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>        `,
    attachments: [
      {
        filename: originalname,
        content: buffer,
        contentType: "application/pdf",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Prescription email sent successfully");
  } catch (error) {
    console.error("Error sending prescription email:", error);
    throw new Error("Error sending prescription email");
  }

  return null;
}

export default sendPrescription;
