const express = require("express");
const { indexRoute } = require("../controller/home");
const user = require("./user");
const router = express.Router();

router.get("/", indexRoute);
router.use("/user", user);

module.exports = router;
