import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretmuseum150tokenkey', {
    expiresIn: '30d'
  });
};

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'visitor'
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        earnedBadges: user.earnedBadges
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          points: user.points,
          earnedBadges: user.earnedBadges
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const { name, profileImage } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (name) user.name = name;
    if (profileImage !== undefined) user.profileImage = profileImage;
    await user.save();
    res.json({
      success: true,
      user: {
        _id: user._id, name: user.name, email: user.email,
        role: user.role, points: user.points,
        earnedBadges: user.earnedBadges, profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserPointsAndBadges = async (req, res) => {
  const { points, newBadge } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      if (points) user.points += points;
      if (newBadge) {
        const exists = user.earnedBadges.some(b => b.badgeId === newBadge.badgeId);
        if (!exists) user.earnedBadges.push(newBadge);
      }
      await user.save();
      res.json({ success: true, user: { _id: user._id, points: user.points, earnedBadges: user.earnedBadges } });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

