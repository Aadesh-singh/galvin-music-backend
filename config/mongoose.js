require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connection to database(MongoDB) status: Success");
  } catch (err) {
    console.log("connection to database(MongoDB) status: Failed");
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
