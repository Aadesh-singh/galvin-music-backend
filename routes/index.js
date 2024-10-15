const express = require("express");
const { indexRoute } = require("../controller/home");
const auth = require("./auth");
const router = express.Router();

router.get("/", indexRoute);
router.use("/auth", auth);

module.exports = router;
