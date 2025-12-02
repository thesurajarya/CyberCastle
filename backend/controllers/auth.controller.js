const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Check if user already exists (lowercase email for comparison)
    const existingUser = await User.findOne({ 
      $or: [{ email: email.toLowerCase() }, { username }] 
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Create new user (email will be lowercased by schema)
    const user = new User({ username, email: email.toLowerCase(), password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if ((!email && !username) || !password) {
      return res.status(400).json({ message: 'Email/Username and password are required' });
    }

    const user = await User.findOne({
      $or: [
        { email: email ? email.toLowerCase() : undefined },
        { username }
      ]
    });

    if (!user) return res.status(401).json({ message: 'Invalid email/username or password' });

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) return res.status(401).json({ message: 'Invalid email/username or password' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};
