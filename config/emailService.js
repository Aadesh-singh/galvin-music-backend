require("dotenv").config();
const nodemailer = require("nodemailer");
const { getToken } = require("../middleware/auth");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GALVIN_EMAIL,
    pass: process.env.GALVIN_EMAIL_PASSWORD,
  },
  logger: true,
  // debug: true,
});

const getTemplate = async (type, payload) => {
  switch (type) {
    case "register":
      let token = await getToken(payload);
      let link = `${process.env.VERIFY_LINK}?token=${token}`;
      return `
            <h1>Welcome to Galvin Music</h1>
            <p>Thanks for registering with Galvin music, Please use below button to Verify you email. </p>
            <a style="color: black; background-color: #4CB050; padding: 10px 20px; text-decoration: none; font-weight: 700; border-radius: 7px; display: inline-block;" href="${link}">Verify Email</a>

            <p>Happy Entertainment</p>
            <p>Galvin Music Company</p>
            `;
      break;
    case "resend_verify":
      let resend_verify_token = await getToken(payload);
      let resend_verify_link = `${process.env.VERIFY_LINK}?token=${resend_verify_token}`;
      return `
            <h1>Welcome Again to Galvin Music!!!</h1>
            <p>Thanks for registering with Galvin music, Please use below button to Verify you email. </p>
            <a style="color: black; background-color: #4CB050; padding: 10px 20px; text-decoration: none; font-weight: 700; border-radius: 7px; display: inline-block;" href="${resend_verify_link}">Verify Email</a>

            <p>Happy Entertainment</p>
            <p>Galvin Music Company</p>
            `;
      break;
    case "register_with_google":
      let register_with_google_token = await getToken(payload);
      let register_with_google_link = `${
        process.env.FRONTEND_BASE_URL
      }/check-token-type?type=${"googleRegister"}&token=${register_with_google_token}`;
      return `
            <h1>Welcome to Galvin Music!!!</h1>
            <p>Thanks for registering with Galvin music, Please use below button to Verify you email. </p>
            <p>Please have a moment and create a password using below button, which is valid for 1h from now.</p>
            <a style="color: black; background-color: #4CB050; padding: 10px 20px; text-decoration: none; font-weight: 700; border-radius: 7px; display: inline-block;" href="${register_with_google_link}">Update Password</a>

            <p>Happy Entertainment</p>
            <p>Galvin Music Company</p>
            `;
      break;
    case "passwordReset":
      let passwordReset_token = await getToken(payload);
      let passwordReset_link = `${
        process.env.FRONTEND_BASE_URL
      }/check-token-type?type=${"passwordReset"}&token=${passwordReset_token}`;
      return `
            <h1>Welcome to Galvin Music!!!</h1>
            <p>Oops you forgot your Password Don't worry!</p>
            <p>Please have a moment and create a password using below button, which is valid for 1h from now.</p>
            <a style="color: black; background-color: #4CB050; padding: 10px 20px; text-decoration: none; font-weight: 700; border-radius: 7px; display: inline-block;" href="${passwordReset_link}">Update Password</a>

            <p>Happy Entertainment</p>
            <p>Galvin Music Company</p>
            `;
      break;

    default:
      break;
  }
};

const sendEmail = async (type, payload) => {
  try {
    const template = await getTemplate(type, payload);
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Galvin music" <thegalvin00@gmail.com>', // sender address
      to: payload.email, // list of receivers
      subject: "Welcome to Galvin Music", // Subject line
      text: "", // plain text body
      html: template, // html body
    });
    return info.response;
  } catch (error) {
    console.log("error in sending email", error);
    return new Error(error);
  }
};

module.exports = { sendEmail };
