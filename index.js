require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const connectDB = require("./config/mongoose");

const app = express();
connectDB();

// Use CORS to allow requests from specific origins
app.use(
  cors({
    origin: "http://localhost:3000", // Allow only your frontend's origin
    methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
    allowedHeaders: "Content-Type, Authorization", // Allowed headers
  })
);

app.use(express.urlencoded());
app.use(express.json());

app.use("/", routes);

app.listen(process.env.PORT, () => {
  console.log(`server is up and running at ${process.env.PORT}`);
});
