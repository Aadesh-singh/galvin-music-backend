require("dotenv").config();
const User = require("../model/user");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber } = req.body;
  if (!firstName || !lastName || !email || !password || !phoneNumber) {
    return res.status(422).json({ msg: "Bad Payload" });
  }
  const userExist = await User.findOne({ email: email });
  if (userExist) {
    return res
      .status(400)
      .json({ msg: "User Already exist, Please login instead" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    ...req.body,
    password: hashedPassword,
  };
  const user = await User.create(newUser);
  return res.status(200).json({
    msg: "User created successfully",
    userEmail: email,
  });
};

module.exports = {
  register,
};
