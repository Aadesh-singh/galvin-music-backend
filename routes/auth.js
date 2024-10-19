const express = require("express");
const {
  register,
  login,
  verifyemail,
  sendVerificationEmail,
  googleLogin,
} = require("../controller/user");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verifyemail", verifyemail);
router.post("/sendVerificationEmail", sendVerificationEmail);
router.post("/google-login", googleLogin);

module.exports = router;
