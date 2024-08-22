"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: 'akbarhaleel508@gmail.com',
        pass: 'ejev ngqr qtxb khwn',
    },
});
const otpSending = (userEmail, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Your OTP Code',
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #007bff;
                    color: #ffffff;
                    padding: 10px 20px;
                    border-radius: 8px 8px 0 0;
                    text-align: center;
                }
                .content {
                    padding: 20px;
                    text-align: center;
                }
                .otp {
                    font-size: 24px;
                    font-weight: bold;
                    color: #007bff;
                    margin: 20px 0;
                }
                .footer {
                    font-size: 12px;
                    color: #555555;
                    text-align: center;
                    padding: 10px 0;
                }
            </style>
            <title>OTP Code</title>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>CarePoint</h1>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>Your OTP code is:</p>
                    <div class="otp">${otp}</div>
                    <p>Please use this code to complete your verification.</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} CarePoint. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `
    };
    try {
        yield transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
    }
    catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Error sending OTP email');
    }
});
exports.default = otpSending;
