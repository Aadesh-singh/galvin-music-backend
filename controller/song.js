require("dotenv").config();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3"); // Import S3Client and PutObjectCommand
const { Upload } = require("@aws-sdk/lib-storage"); // For streaming uploads
const fs = require("fs");
const path = require("path");

// AWS S3 v3 configuration (use S3Client)
const s3Client = new S3Client({
  region: process.env.AWS_REGION, // Example: 'us-east-1'
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadSong = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  // 1. Get the song from multer
  // Read the uploaded file
  const filePath = req.file.path; // Path to the uploaded song
  try {
    const body = req.body;
    // 2. Sanitize the form inputs- pending

    // Read the file
    const fileStream = fs.createReadStream(filePath);

    // 3. Upload song on AWS S3
    // S3 upload parameters
    const uploadParams = {
      Bucket: "galvinsongs",
      Key: `song_${Date.now()}-${req.file.originalname}`,
      Body: fileStream,
      ContentType: req.file.mimetype,
      //   ACL: "public-read",
    };

    // Use the AWS SDK v3 `Upload` helper class for uploading
    const uploadToS3 = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    // Await the completion of the upload
    const s3Response = await uploadToS3.done();
    console.log("s3 Reponse: ", s3Response);
    // 4. Get the public url of song
    console.log("s3 Reponse url: ", s3Response.Location);

    // 5. Destructure the Song Obj with public/avalilability url
    // 6. Feed to MongoDB
    // 7. Return success response.
    // Clean up: Remove the local file
    fs.unlinkSync(filePath);
    return res.status(200).json({ message: "Song uploaded successfully" });
  } catch (error) {
    console.log("Error in uploading song", error);
    return res
      .status(500)
      .json({ message: "Error in uploading song", code: "SERVER_ERR" });
  }
};

module.exports = {
  uploadSong,
};
