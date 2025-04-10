const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");

exports.loginController = async (req, res) => {
  console.log("Inside User Login");

  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email.trim() });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (existingUser.password== password.trim()) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        userId: existingUser._id,
        role: existingUser.role,
        userIdTag: existingUser.userId, 
      },
      process.env.JWTPASSWORD,
      { expiresIn: "1h" }
    );
    console.log(existingUser.role);
    
    const privileges = existingUser.role == "admin"
    ? "You have admin privileges"
    : "You are logged in as a normal user";

  res.status(200).json({
    message: "Login successful",
    token,
    role: User.role,
    privileges,
  });
  } catch (err) {
    console.error(" Login Error:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
