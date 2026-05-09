const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER USER
exports.register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      status,
    } = req.body;

    // CHECK EXISTING EMAIL
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // CREATE USER
    const user = new User({
      name,
      email,
      password,
      role,
      status,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    next(err);
  }
};

// LOGIN USER
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // FIND USER
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // BLOCK INACTIVE USERS
    if (user.status === "Inactive") {
      return res.status(403).json({
        error: "Account is inactive",
      });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // CREATE TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1h",
      }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    next(err);
  }
};