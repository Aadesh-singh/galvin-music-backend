require("dotenv").config();
const { sendEmail } = require("../config/emailService");
const {
  getToken,
  authenticateToken,
  checkToken,
} = require("../middleware/auth");
const User = require("../model/user");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      return res.status(422).json({ msg: "Bad Payload" });
    }
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res
        .status(400)
        .json({ msg: "User Already exist, Please login instead" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      ...req.body,
      password: hashedPassword,
    };
    const user = await User.create(newUser);
    const payload = {
      id: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
    const send = await sendEmail("register", payload);
    console.log("Email sent successfully:", send);
    return res.status(200).json({
      msg: "User created successfully",
      userEmail: email,
    });
  } catch (error) {
    console.log("Error in registering user: ", error);
    return res.status(500).json({
      msg: "Error in registering user",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(401)
        .json({ msg: "Invalid user", code: "INCR_USER_OR_PASSWORD" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("incorrect password");
      return res
        .status(401)
        .json({ msg: "Invalid user", code: "INCR_USER_OR_PASSWORD" });
    }
    if (!user.emailVerified) {
      return res
        .status(401)
        .json({ msg: "Email not verified", code: "EMAIL_NOT_VERIFIED" });
    }
    const payload = {
      id: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
    const token = await getToken(payload);
    return res.status(200).json({
      msg: "User logged in successfully",
      token: token,
    });
  } catch (error) {
    console.log("Error in login: ", error);
    return res.status(500).json({ msg: "Error in login" });
  }
};

const verifyemail = async (req, res) => {
  try {
    const token = req.query.token;

    const verifyToken = await checkToken(token);
    console.log("verifyUser: ", verifyToken);
    if (verifyToken.email) {
      let user = await User.updateOne(
        { _id: verifyToken.id },
        { emailVerified: true }
      );
      return res.status(200).json({
        msg: "Email verified successfylly",
      });
    } else {
      return res.status(200).json({
        msg: "Token expired",
        code: "TOKEN_EXP",
      });
    }
  } catch (err) {
    console.log("Error in verifying email", err);
    return res
      .status(401)
      .json({ code: "SERVER_ERR", msg: "Error in verifying email." });
  }
};

module.exports = {
  register,
  login,
  verifyemail,
};
