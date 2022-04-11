const { StatusCodes } = require("http-status-codes");
const User = require("../Model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../../common/services/sendEmail");
const templateUserVerification = require("../../../common/Templates/userVerification");
const pagination = require("../../../common/services/pagination");
const searchWhenGet = require("../../../common/services/searchWhenGet");

const getUser = async (req, res) => {
  const { id } = req.params;
  let { search, page, size } = req.query;
  const { limit, skip } = pagination(page, size);

  try {
      const { data, total, totalPages } = await searchWhenGet(
        User,
        skip,
        limit,
        id,
        search,
        ["username", "email"]
      );
      if(!data) {
        res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Not Found Data" });
      }
      res.status(StatusCodes.OK).json({
        message: "success",
        total,
        totalPages,
        currentPage: page,
        data,
      });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "error", error });
  }
};

const addUser = async (req, res) => {
  const { username, email, password, age, address, role } = req.body;
  // console.log(req.file);
  try {
    //check email
    const user = await User.findOne({ email });
    if (user) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ massage: "email is already exist" });
    } else {
      const userData = new User({
        username,
        email,
        password,
        age,
        address,
        role,
        userImage: `${process.env.SERVERLINK}/${req.file.path}`,
      });
      // const data = await User.insertMany({username, email, password, age, address, role})
      const data = await userData.save();
      // console.log(data);
      let token = jwt.sign({ _id: data._id }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      const info = await sendEmail(
        [email],
        "Email Verification",
        templateUserVerification(`verifiy/${token}`)
      );
      // console.log(info.messageId);
      if (info.messageId) {
        res
          .status(StatusCodes.CREATED)
          .json({ message: "added success", data });
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Email cannot be sent" });
      }
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "error", error });
  }
};

const verifiyAddUser = async (req, res) => {
  const { token } = req.params;
  let decoded = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findOne({ _id: decoded._id });
  if (user) {
    const updateUser = await User.updateOne(
      { _id: decoded._id },
      { verified: true }
    );
    res.status(StatusCodes.OK).json({ message: "verified success" });
  } else {
    res.status(StatusCodes.FORBIDDEN).json({ message: "FORBIDDEN" });
  }
};

const logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    //check email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(StatusCodes.BAD_REQUEST).json({ massage: "invalid email" });
    } else {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        if (!user.verified) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: " email is not verified " });
        } else {
          let token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
            expiresIn: "1h",
          });
          const data = await User.findOne({ email }).select("-password");
          res
            .status(StatusCodes.OK)
            .json({ message: "login success", token, data });
        }
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: " this password is wrong " });
      }
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "error", error });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, age, address } = req.body;
  try {
    const data = await User.updateMany({
      username,
      email,
      password,
      age,
      address,
    }).where({ _id: id });
    if (data) {
      res
        .status(StatusCodes.CREATED)
        .json({ message: "updated success", data });
    } else {
      res.json({ message: "error data" });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "error", error });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await User.deleteMany({ _id: id });
    res.status(StatusCodes.OK).json({ message: "deleted success", data });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "error", error });
  }
};

// get users who live in Cairo
const getUsersCairo = async (req, res) => {
  try {
    // const data = await User.find({}).where('address').equals('cairo')
    const data = await User.find({}).where({ address: "cairo" });
    res.status(StatusCodes.OK).json({ message: "success", data });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "error", error });
  }
};

module.exports = {
  getUser,
  addUser,
  verifiyAddUser,
  logIn,
  updateUser,
  deleteUser,
  getUsersCairo,
};
