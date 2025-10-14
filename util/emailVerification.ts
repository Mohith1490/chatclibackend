import nodemailer from "nodemailer";

export default function sendMail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    })

    let mailOption = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email Verification Chat Cli",
        html: `
          <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Your OTP Code</title>
                <style>
                body {
                    font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
                    background-color: #f4f6f8;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }

                .container {
                    max-width: 480px;
                    background: #ffffff;
                    margin: 10px auto;
                    border-radius: 12px;
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
                    overflow: hidden;
                }

                .header {
                    background: linear-gradient(135deg, #007bff, #00b4d8);
                    color: #fff;
                    text-align: center;
                    padding: 28px 20px;
                    font-size: 22px;
                    font-weight: bold;
                }

                .content {
                    padding: 30px 25px;
                    text-align: center;
                }

                .content h1 {
                    font-size: 24px;
                    color: #222;
                    margin-bottom: 12px;
                }

                .otp-box {
                    display: inline-block;
                    background: #f0f4ff;
                    color: #0044cc;
                    font-size: 32px;
                    letter-spacing: 8px;
                    font-weight: bold;
                    padding: 16px 24px;
                    border-radius: 10px;
                    margin: 20px 0;
                    border: 2px dashed #0044cc;
                }

                .text-muted {
                    color: #777;
                    font-size: 14px;
                    margin-top: 16px;
                }

                .footer {
                    background: #f8f9fa;
                    text-align: center;
                    padding: 16px;
                    font-size: 13px;
                    color: #777;
                }

                @media (max-width: 600px) {
                    .container {
                    margin: 20px;
                    }
                    .otp-box {
                    font-size: 26px;
                    letter-spacing: 4px;
                    }
                }
                </style>
            </head>

            <body>
                <div class="container">
                <div class="header">🔐 Verify Your Email</div>

                <div class="content">
                    <h1>Your One-Time Password (OTP)</h1>
                    <p>Please use the following OTP to verify your email address.</p>

                    <div class="otp-box">${otp}</div>

                    <p>This code will expire in <strong>5 minutes</strong>.</p>
                    <p class="text-muted">If you did not request this, you can safely ignore this email.</p>
                </div>

                <div class="footer">
                    © ${new Date().getFullYear()} ChatCLI | Secure Verification System
                </div>
                </div>
            </body>
            </html>
        `
    }

    transporter.sendMail(mailOption, (error, data) => {
        if (error) {
            console.log("something went wrong sending mail ", error);
        } else {
            console.log("mail sent successfully ");
        }
    })
}
