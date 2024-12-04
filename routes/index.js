const express = require("express");
const { indexRoute, verifyToken } = require("../controller/home");
const authRoutes = require("./auth");
const songRoutes = require("./song");
const playlistRoutes = require("./playlist");
const albumRoutes = require("./album");
const artistRoutes = require("./artist");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

//Home routes
router.get("/", indexRoute);

//Route specifically for verifying token
router.post("/verifyToken", verifyToken);

// ------------------------------------ Roues other than Home compoment -----------------------------

//Routes related to Authentication
router.use("/auth", authRoutes);

//Routes related to Songs
router.use("/song", authenticateToken, songRoutes);

//Routes related to Playlists
router.use("/playlist", playlistRoutes);

//Routes related to Albums
router.use("/album", albumRoutes);

//Routes related to Artists
router.use("/artist", artistRoutes);

module.exports = router;
