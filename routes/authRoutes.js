const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

//                           REGISTRATION

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//                           LOGIN

router.post("/login",async(req,res)=>{
    const{email,password} =req.body;

    try{
      const user=await User.findOne({email});   //if email exist nhi karta hai then user will be null
      if(!user){
        return res.status(400).json({message:"User not found"});
      }

      const isMatch=await bcrypt.compare(password,user.password); //here password is the plain text password and user.password is the hashed password of the user (stored in the database for that user.)
      if(!isMatch){
        return res.json(400).json({message:"Invalid Password"});
      }

      //create JWT token

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      //  Send response
      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  

});

module.exports = router;
