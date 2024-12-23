require("dotenv").config();
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3"); // Import S3Client and PutObjectCommand
const { Upload } = require("@aws-sdk/lib-storage"); // For streaming uploads
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const fs = require("fs");
const path = require("path");
const Song = require("../model/song");
const Album = require("../model/Album");
const Playlist = require("../model/Playlist");
const bucketName = process.env.AWS_BUCKET_NAME;
const bucketAccessDuration = 3600;

// AWS S3 v3 configuration (use S3Client)
const s3Client = new S3Client({
  region: process.env.AWS_REGION, // Example: 'us-east-1'
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to generate a pre-signed URL
const generateSignedUrl = async (bucketName, key, expiresIn = 60) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
  return signedUrl;
};

// async function abc() {
//   const spath =
//     "song_1730906469260-02 Angreji Beat Ft. Gippy Grewal - Yo Yo Honey Singh.mp3";
//   const url = await generateSignedUrl(bucketName, spath, 3600);
//   console.log("SUrl: ", url);
// }

const fetchSong = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);
    if (!id) {
      return res.status(500).json({
        status: 400,
        message: "Invalid Request: Id not Available",
      });
    }
    let song = await Song.findById(id);

    const playableUrl = await generateSignedUrl(
      bucketName,
      song.songKey,
      bucketAccessDuration
    );
    const songData = song.toObject(); // Use `toJSON()` if needed
    songData.playableUrl = playableUrl || "";
    console.log(songData);
    return res.status(200).json({
      status: 200,
      message: "Song Fetched Successfully",
      song: songData,
    });
  } catch (error) {
    console.log("Error in fetching song: ", error);
    return res.status(500).json({
      status: 500,
      message: "Error in fetching song",
      error: error.message,
    });
  }
};

//create song
const uploadSong = async (req, res) => {
  // console.log("req.file: ", req.file);
  // console.log("req.files: ", req.files);
  if (!req.files) {
    return res.status(400).send("No file uploaded");
  }
  // 1. Get the song from multer
  // Read the uploaded file
  const songFile = req.files?.song?.[0]; // Path to the uploaded song
  // console.log("req.files: ", req.files);
  const coverPhotoFile = req.files?.coverPhoto?.[0];
  try {
    // console.log("req.body: ", req.body);
    const {
      name,
      lyricsby,
      musicby,
      singers,
      lyrics,
      miscInfo,
      createUnder,
      playlist,
      album,
    } = req.body;
    // 2. Sanitize the form inputs
    const songObj = {
      name: name.trim(),
      lyricsby: JSON.parse(lyricsby).map((i) => i.trim()),
      musicby: JSON.parse(musicby).map((i) => i.trim()),
      singers: JSON.parse(singers).map((i) => i.trim()),
      lyrics,
      miscInfo,
    };

    // Read the file
    const fileStream = fs.createReadStream(songFile.path);

    // 3. Upload song on AWS S3
    // S3 upload parameters
    let songKey = `song_${Date.now()}-${songFile.originalname.trim()}`;
    const uploadParams = {
      Bucket: "galvinsongs",
      Key: songKey,
      Body: fileStream,
      ContentType: songFile.mimetype,
      //   ACL: "public-read",
    };

    // Use the AWS SDK v3 `Upload` helper class for uploading
    const uploadToS3 = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    // Await the completion of the upload
    const s3Response = await uploadToS3.done();
    console.log("------File upload done-------");
    console.log("S3 Reponse: ", s3Response);
    // 4. Get the public url of song
    console.log("S3 Reponse url: ", s3Response.Location);
    const songUrl = s3Response.Location;
    songObj.songUrl = songUrl;
    songObj.songKey = songKey;
    songObj.owner = req.user.id;

    // 3. Upload cover photo file to S3 (if available)
    if (coverPhotoFile) {
      const coverKey = `cover/cover_${Date.now()}-${coverPhotoFile.originalname.trim()}`; // Use `cover/` prefix
      const coverUploadParams = {
        Bucket: "galvinsongs",
        Key: coverKey,
        Body: fs.createReadStream(coverPhotoFile.path),
        ContentType: coverPhotoFile.mimetype,
      };

      const coverUpload = new Upload({
        client: s3Client,
        params: coverUploadParams,
      });
      const coverS3Response = await coverUpload.done();
      songObj.coverPhotoUrl = coverS3Response.Location; // Add cover URL to the song object
      songObj.coverKey = coverKey;

      // Clean up: Remove the local cover photo file
      fs.unlinkSync(coverPhotoFile.path);
    }

    if (createUnder == "album") {
      songObj.albums = [album];
    } else {
      songObj.playlists = [playlist];
    }

    // console.log("SongObj: ", songObj);

    const song = await Song.create(songObj);
    if (createUnder == "album") {
      await Album.updateOne({ _id: album }, { $push: { songs: song._id } });
    } else {
      await Playlist.updateOne(
        { _id: playlist },
        { $push: { songs: song._id } }
      );
    }

    // 5. Destructure the Song Obj with public/avalilability url
    // 6. Feed to MongoDB
    // 7. Return success response.
    // Clean up: Remove the local file
    fs.unlinkSync(songFile.path);
    return res.status(200).json({ message: "Song uploaded successfully" });
  } catch (error) {
    // console.log("Error in Uploading a Song", error);
    return res
      .status(500)
      .json({ message: "Error in Uploading Song", code: "SERVER_ERR" });
  }
};

const getAllSongs = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const allSongs = await Song.find({})
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit); //logic for trending pending
    return res.status(200).json({
      status: 200,
      message: "All Songs Fetched successfully",
      songs: allSongs,
    });
  } catch (error) {
    console.log("Error in fetching all songs: ", error);
    return res.status(500).json({
      status: 500,
      message: "Error in fetching all Songs",
      error: error?.message,
    });
  }
};

module.exports = {
  uploadSong,
  getAllSongs,
  fetchSong,
};
