require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const connectDB = require("./config/mongoose");

const app = express();
connectDB();

app.use(express.urlencoded());
app.use(express.json());

app.use("/", routes);

app.listen(process.env.PORT, () => {
  console.log(`server is up and running at ${process.env.PORT}`);
});
