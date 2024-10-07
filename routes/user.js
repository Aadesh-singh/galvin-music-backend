const express = require("express");
const { register, login, verifyemail } = require("../controller/user");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verifyemail", verifyemail);

module.exports = router;
