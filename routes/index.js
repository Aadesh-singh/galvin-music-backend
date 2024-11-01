const express = require("express");
const { indexRoute, verifyToken } = require("../controller/home");
const authController = require("./auth");
const songController = require("./song");
const playlistController = require("./playlist");
const albumController = require("./album");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

//Home routes
router.get("/", indexRoute);

//Route specifically for verifying token
router.post("/verifyToken", verifyToken);

// ------------------------------------ Roues other than Home compoment -----------------------------

//Routes related to Authentication
router.use("/auth", authController);

//Routes related to Songs
router.use("/song", authenticateToken, songController);

//Routes related to Playlists
router.use("/playlist", playlistController);

//Routes related to Albums
router.use("/album", albumController);

module.exports = router;
