import GoogleUsers from "../../models/GoogleUsers.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "solvio.app@gmail.com",
        pass: process.env.APP_PWD,
    },
});

export async function sendEmailForAnswer(userID, problemID) {
    try {
        let link = `http://localhost:8080/showresults/${problemID}?forwarded=true`;

        const user = await GoogleUsers.findOne({ _id: userID });
        console.log("USER", user);
        if (user) {
            const info = await transporter.sendMail({
                from: '"Solvio App" <solvio.app@gmail.com>', // sender address
                to: user.email, // list of receivers
                subject: "Solvio : Your problem has been solved", // Subject line
                html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #ffffff; padding: 20px; border-radius: 10px;">
            <p style="color: #555555; line-height: 1.6;">Hello <strong>${user.username}</strong>,</p>
            <p style="color: #555555; line-height: 1.6;">Your problem has been solved. You can see the results by visiting the following link:</p>
            <p style="color: #555555; line-height: 1.6;"><a href="${link}" style="color: #a36c3d; text-decoration: none;">${link}</a></p>
            <p style="color: #555555; line-height: 1.6;">Best wishes,<br><span style="color: #a36c3d;"><em>Solvio team</em></span></p>
          </div>
          <div style="text-align: center; padding-top: 20px;">
            <p style="color: #777777; font-size: 12px;">&copy; 2024 Solvio. All rights reserved.</p>
          </div>
        </div>
      `, // html body
            });

            console.log("Email was sent! Message sent: %s", info.messageId);
        } else {
            console.log("Not a google user");
        }
    } catch (error) {
        console.log(error);
    }
};