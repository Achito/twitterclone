import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    // Checking inputs
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already taken" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password need to contain at least 6 characters" });
    }

    // Hash the user pwd
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    // If user sign up correctly --> Register the new User and send the JSON
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
        message: "User created successfully",
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (errors) {
    console.log("Error in the Signup controller", error.message);

    res.status(500).json({ error: "Internal Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    ); // Need to add "" in case Password is undefined so Bcrypt don't crash

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res
      .status(200)
      .json({
      _id: user._id,
      fullname: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
      message: "Login successfully",
      });


  } catch (error) {
    console.log("Error in the Login controller", error.message);

    res.status(500).json({ error: "Internal Server error" });
  }
};

export const logout = async (req, res) => {
  
  try {
    res.cookie("jwt", "",{maxAge:0});
    res.status(200).json({message: "Logged out successfully"});
  } catch (error) {
    console.log("Error in the Logout controller", error.message);

    res.status(500).json({ error: "Internal Server error" });
  }

};

// Get user info using JWT from req
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in the Logout controller", error.message);

    return res.status(500).json({ error: "Internal Server error" });
    
  }
}
