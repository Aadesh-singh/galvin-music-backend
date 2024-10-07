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
            <p>We got your back, Please verify your account to get started with adfree music experience.</p>
            <a href="${link}">Verify Email</a>
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
      subject: "Hello", // Subject line
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
