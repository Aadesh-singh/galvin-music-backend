const express = require("express");
const { indexRoute, verifyToken } = require("../controller/home");
const auth = require("./auth");
const song = require("./song");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

router.get("/", indexRoute);
router.use("/auth", auth);
router.use("/song", authenticateToken, song);
router.post("/verifyToken", verifyToken);

module.exports = router;
