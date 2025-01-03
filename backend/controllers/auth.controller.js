import User from "../models/user.model.js"
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {

  try {
    const {fullName, username, email, password} = req.body;
    
    // Checking inputs
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}

    const existingUser = await User.findOne({username});
    if (existingUser){
        return res.status(400).json({error: "Username already taken"});
    }

    const existingEmail = await User.findOne({email});
    if (existingEmail){
        return res.status(400).json({error: "Email already taken"});
    }

    // Hash the user pwd
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({fullName,
        username,
        email,
        password: hashedPassword

    })
    
    // If user sign up correctly --> Register the new User and send the JSON 
    if(newUser){
    
        generateTokenAndSetCookie(newUser._id, res)
        await newUser.save();

        res.status(201).json({message:"User created successfully"})

    } else {
        
    }
    
  } catch (errors) {}
};

export const login = async (req, res) => {
  res.send("You hit the login endpoint");
};

export const logout = async (req, res) => {
  res.send("You hit the logout endpoint");
};
