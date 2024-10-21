const express = require("express");
const { indexRoute, verifyToken } = require("../controller/home");
const auth = require("./auth");
const router = express.Router();

router.get("/", indexRoute);
router.use("/auth", auth);
router.post("/verifyToken", verifyToken);

module.exports = router;
