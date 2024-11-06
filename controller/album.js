require("dotenv").config();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3"); // Import S3Client and PutObjectCommand
const { Upload } = require("@aws-sdk/lib-storage"); // For streaming uploads
const fs = require("fs");
const Album = require("../model/Album");
const User = require("../model/user");

// AWS S3 v3 configuration (use S3Client)
const s3Client = new S3Client({
  region: process.env.AWS_REGION, // Example: 'us-east-1'
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const albumTitleExist = async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res
        .status(401)
        .json({ code: "BAD_PAYLOAD", message: "Please send a valid payload" });
    }
    const albums = await Album.find({
      name: { $regex: `^${title}$`, $options: "i" },
    });
    console.log(title, albums);
    console.log(title, albums.length);
    if (albums.length > 0) {
      return res
        .status(200)
        .json({ available: false, message: "Album name already exist" });
    } else {
      return res
        .status(200)
        .json({ available: true, message: "Album name is available" });
    }
  } catch (error) {
    console.log("Error in checking album title: ", error);
    return res
      .status(500)
      .json({ code: "SERVER_ERROR", message: "Error in checking album title" });
  }
};

const createAlbum = async (req, res) => {
  try {
    console.log("req.file: ", req.file);

    console.log("req.body: ", req.body);
    console.log("req.user: ", req.user);
    const { name, hashtags, description } = req.body;
    const album = await Album.find({ name: name });
    console.log(album);
    if (album.length > 0) {
      return res.status(403).json({
        code: "Bad payload",
        message: "Album with same name already exist",
      });
    }
    let songObj = {
      name: name,
      hashtags: hashtags,
      description: description,
      owner: req.user.id,
      users: [req.user.id],
    };

    const coverPhotoFile = req.file;
    if (coverPhotoFile) {
      const coverUploadParams = {
        Bucket: "galvinsongs",
        Key: `cover/cover_${Date.now()}-${coverPhotoFile.originalname}`, // Use `cover/` prefix
        Body: fs.createReadStream(coverPhotoFile.path),
        ContentType: coverPhotoFile.mimetype,
      };

      const coverUpload = new Upload({
        client: s3Client,
        params: coverUploadParams,
      });
      const coverS3Response = await coverUpload.done();
      songObj.coverPhotoUrl = coverS3Response.Location; // Add cover URL to the song object

      // Clean up: Remove the local cover photo file
      fs.unlinkSync(coverPhotoFile.path);
    }

    const albumCreated = await Album.create(songObj);
    console.log("album created: ", albumCreated);
    await User.updateOne(
      { _id: req.user.id },
      { $push: { albums: albumCreated._id } }
    );
    return res.status(200).json({ message: "Album created successfully" });
  } catch (error) {
    console.log("Error in creating Album: ", error);
    return res
      .status(500)
      .json({ code: "SERVER_ERROR", message: "Error in creating Album" });
  }
};

module.exports = {
  createAlbum,
  albumTitleExist,
};
