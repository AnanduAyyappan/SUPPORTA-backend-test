const User = require("../Models/userModel");

function generateUserId(number) {
  return `USER${String(number).padStart(3, '0')}`;
}

exports.registerController = async (req, res) => {
  console.log(" Inside User Registration");

  const { name, email, password } = req.body;
  console.log("Received:", name, email, password);

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: email.trim() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const lastUser = await User.findOne({ role: 'user' })
      .sort({ userId: -1 })
      .lean();

    let newUserId;
    if (!lastUser || !lastUser.userId) {
      newUserId = 'USER001';
    } else {
      const lastNumber = parseInt(lastUser.userId.replace('USER', '')) || 0;
      newUserId = generateUserId(lastNumber + 1);
    }

    const newUser = new User({
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role: "user",
      userId: newUserId
    });

    await newUser.save();

    res.status(201).json({ message: " User registered successfully", userId: newUserId });
  } catch (err) {
    console.error(" Registration error:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
