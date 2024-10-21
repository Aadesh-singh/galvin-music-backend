const express = require("express");
const {
  register,
  login,
  verifyemail,
  sendVerificationEmail,
  googleLogin,
  sendForgotPasswordLink,
  updatePassword,
} = require("../controller/user");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verifyemail", verifyemail);
router.post("/sendVerificationEmail", sendVerificationEmail);
router.post("/google-login", googleLogin);
router.post("/sendForgotPasswordLink", sendForgotPasswordLink);
router.post("/updatePassword", updatePassword);

module.exports = router;
