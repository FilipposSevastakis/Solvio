import GoogleUsers from "../../models/GoogleUsers.js";
import nodemailer from "nodemailer";

// create the nodemailer transporter - define the necessary params
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

// adds a new email user and sends welcome message
export async function addUser(user) {
  try {
    let existingUser = await GoogleUsers.findOne({ email: user.email });
    if (!existingUser) {
      console.log("USER DOES NOT EXIST", existingUser);
      let createdUser = await GoogleUsers.create({
        _id: user._id,
        username: user.username,
        email: user.email,
      });
      const info = await transporter.sendMail({
        from: '"Solvio App" <solvio.app@gmail.com>', // sender address
        to: user.email, // list of receivers
        subject: "Welcome to solvio!", // Subject line
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #ffffff; padding: 20px; border-radius: 10px;">
              <h2 style="color: #333333; text-align: center;">Welcome to Solvio!</h2>
              <p style="color: #555555; line-height: 1.6;">Hello <strong>${user.username}</strong>,</p>
              <p style="color: #555555; line-height: 1.6;">Welcome to Solvio! We are excited to have you on board.</p>
              <p style="color: #555555; line-height: 1.6;">
                Visit our website, submit your problems, and receive the answers you need! You will need 1 credit for every second you use the solver. You will be awarded 10 credits for every minute you use the solver we provide!
              </p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="http://localhost:8080/landing" style="background-color: #a36c3d; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit Solvio</a>
              </div>
              <p style="color: #555555; line-height: 1.6;">Best wishes,<br><span style="color: #a36c3d;"><em>Solvio team</em></span></p>
            </div>
            <div style="text-align: center; padding-top: 20px;">
              <p style="color: #777777; font-size: 12px;">&copy; 2024 Solvio. All rights reserved.</p>
            </div>
          </div>
        `, // html body
      });

      console.log("Message sent: %s", info.messageId);
      return { message: "Google user was saved" };
    } else {
      return { message: "Existing Google user" };
    }
  } catch (error) {
    console.log(error);
  }
};