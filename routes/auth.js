const express = require("express");
const {
  register,
  login,
  verifyemail,
  sendVerificationEmail,
} = require("../controller/user");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verifyemail", verifyemail);
router.post("/sendVerificationEmail", sendVerificationEmail);

module.exports = router;
