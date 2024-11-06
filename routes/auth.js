const express = require("express");
const multer = require("multer");
const {
  register,
  login,
  verifyemail,
  sendVerificationEmail,
  googleLogin,
  sendForgotPasswordLink,
  updatePassword,
  fetchUserData,
  updateUserData,
} = require("../controller/user");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Configure Multer for file upload
const upload = multer({ dest: "uploads/" }); // Files are stored temporarily

router.post("/register", register);
router.post("/login", login);
router.post("/verifyemail", verifyemail);
router.post("/sendVerificationEmail", sendVerificationEmail);
router.post("/google-login", googleLogin);
router.post("/sendForgotPasswordLink", sendForgotPasswordLink);
router.post("/updatePassword", updatePassword);
router.get("/fetchUserData", authenticateToken, fetchUserData);
router.put(
  "/updateUserData",
  authenticateToken,
  upload.single("profilePhoto"),
  updateUserData
);

module.exports = router;
