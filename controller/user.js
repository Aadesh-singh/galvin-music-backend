require("dotenv").config();
const { sendEmail } = require("../config/emailService");
const {
  getToken,
  authenticateToken,
  checkToken,
} = require("../middleware/auth");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const { verifyGoogleToken } = require("../utils/googleAuth");

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      return res.status(422).json({ message: "Bad Payload" });
    }
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res
        .status(400)
        .json({ message: "User Already exist, Please login instead" });
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
      message: "User created successfully",
      userEmail: email,
    });
  } catch (error) {
    console.log("Error in registering user: ", error);
    return res.status(500).json({
      message: "Error in registering user",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid username password combination.",
        code: "INCR_USER_OR_PASSWORD",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("incorrect password");
      return res.status(401).json({
        message: "Invalid username password combination.",
        code: "INCR_USER_OR_PASSWORD",
      });
    }
    if (!user.emailVerified) {
      return res
        .status(401)
        .json({ message: "Email not verified", code: "EMAIL_NOT_VERIFIED" });
    }
    const payload = {
      id: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
    const token = await getToken(payload);
    return res.status(200).json({
      message: "User logged in successfully",
      user: user,
      token: token,
    });
  } catch (error) {
    console.log("Error in login: ", error);
    return res.status(500).json({ message: "Error in login" });
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
        message: "Email verified successfully",
      });
    } else {
      return res.status(200).json({
        message: "Token expired",
        code: "TOKEN_EXP",
      });
    }
  } catch (err) {
    console.log("Error in verifying email", err);
    return res
      .status(401)
      .json({ code: "SERVER_ERR", message: "Error in verifying email." });
  }
};

const sendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid username password combination.",
        code: "INCR_USER_OR_PASSWORD",
      });
    } else {
      const payload = {
        id: user._id,
        email: user.email,
        phoneNumber: user.phoneNumber,
      };
      const send = await sendEmail("resend_verify", payload);
      console.log("Email sent successfully:", send);
      return res.status(200).json({
        code: "EMAIL_SENT",
        message: "Email Sent Successfully",
      });
    }
  } catch (error) {
    console.log("Error in sending verification email", err);
    return res.status(401).json({
      code: "SERVER_ERR",
      message: "Error in sending verification email.",
    });
  }
};

const googleLogin = async (req, res) => {
  console.log("req.body: ", req.body);
  const { userDetails } = req.body;
  const payload = userDetails;

  try {
    // const { email, payload } = await verifyGoogleToken(token);
    const { email } = payload;
    console.log("email: ", email, payload);
    // Find or create the user in your database
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log("user not available");
      // user doesnot exist create a user
      const userObj = {
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: email.toLowerCase(),
        emailVerified: true,
        profileUrl: payload.picture,
        password: "",
        phoneNumber: "-1",
        accountType: "google",
      };
      const user = await User.create(userObj);
      const payload_jwt = {
        id: user._id,
        email: user.email,
        phoneNumber: user.phoneNumber,
      };
      const token = await getToken(payload_jwt);
      const send = await sendEmail("register_with_google", payload_jwt);
      console.log("Email sent successfully:", send);

      return res
        .status(200)
        .json({ message: "User logged in successfully", token, user });
    } else if (!user.emailVerified) {
      console.log("email not verified");
      return res
        .status(401)
        .json({ code: "EMAIL_NOT_VERIFIED", message: "Email not verified" });
    } else {
      const payload = {
        id: user._id,
        email: user.email,
        phoneNumber: user.phoneNumber,
      };
      const token = await getToken(payload);
      return res
        .status(200)
        .json({ message: "User logged in successfully", token: token, user });
    }
  } catch (error) {
    console.log("error in google login: ", error);
    res.status(401).json({ message: "Google login failed" });
  }
};

const sendForgotPasswordLink = async (req, res) => {
  try {
    const { email } = req.query;
    console.log(email);
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid username password combination.",
        code: "INCR_USER_OR_PASSWORD",
      });
    } else {
      const payload = {
        id: user._id,
        email: user.email,
        phoneNumber: user.phoneNumber,
      };
      const send = await sendEmail("passwordReset", payload);
      console.log("Email sent successfully:", send);
      return res.status(200).json({
        code: "EMAIL_SENT",
        message: "Email Sent Successfully",
      });
    }
  } catch (error) {
    console.log("Error in sending verification email", err);
    return res.status(401).json({
      code: "SERVER_ERR",
      message: "Error in sending verification email.",
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    console.log("body: ", req.body);
    const { token, newPassword } = req.body;
    const verified = await checkToken(token);
    console.log("verified token: ", verified);
    if (verified.id) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const user = await User.findByIdAndUpdate(
        verified.id,
        { password: hashedPassword },
        { new: true }
      );
      console.log("password update success");
      return res.status(200).json({
        message: "Password Updated successfully",
      });
    } else {
      return res.status(403).json({
        message: "Token Expired",
        code: "TOKEN_EXPIRED",
      });
    }
  } catch (error) {
    console.log("Error in updating password", error);
    return res.status(500).json({
      code: "SERVER_ERR",
      message: "Error in updating password",
    });
  }
};

module.exports = {
  register,
  login,
  verifyemail,
  sendVerificationEmail,
  googleLogin,
  sendForgotPasswordLink,
  updatePassword,
};
