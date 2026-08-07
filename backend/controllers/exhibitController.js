import Exhibit from '../models/Exhibit.js';
import Gallery from '../models/Gallery.js';
import Favourite from '../models/Favourite.js';
import VisitHistory from '../models/VisitHistory.js';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

export const getExhibits = async (req, res) => {
  const { categoryId, galleryId, museumId, search, period } = req.query;
  try {
    let query = {};
    if (categoryId) query.categoryId = categoryId;
    if (galleryId) query.galleryId = galleryId;
    if (museumId) query.museumId = museumId;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { historicalInfo: { $regex: search, $options: 'i' } }
      ];
    }
    // Simple mock historical period mapping if query.period matches timeline titles or details
    if (period) {
      query.$or = [
        { title: { $regex: period, $options: 'i' } },
        { description: { $regex: period, $options: 'i' } },
        { 'timeline.title': { $regex: period, $options: 'i' } }
      ];
    }

    const exhibits = await Exhibit.find(query)
      .populate('categoryId', 'name')
      .populate('galleryId', 'name')
      .populate('museumId', 'name');

    res.json({ success: true, count: exhibits.length, data: exhibits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getExhibitById = async (req, res) => {
  try {
    const exhibit = await Exhibit.findById(req.params.id)
      .populate('categoryId', 'name')
      .populate('galleryId', 'name')
      .populate('museumId', 'name')
      .populate('relatedArtifacts', 'title coverImage images');
      
    if (exhibit) {
      // Optional: Log visit history if user is logged in
      if (req.user) {
        await VisitHistory.create({
          userId: req.user._id,
          exhibitId: exhibit._id
        });
      }
      res.json({ success: true, data: exhibit });
    } else {
      res.status(404).json({ success: false, message: 'Exhibit not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createExhibit = async (req, res) => {
  try {
    const { title, description, historicalInfo, timeline, images, audioUrl, videoUrl, categoryId, galleryId, museumId, relatedArtifacts } = req.body;
    
    // Create preliminary document first to obtain ID
    const exhibit = new Exhibit({
      title,
      description,
      historicalInfo,
      timeline,
      images,
      audioUrl,
      videoUrl,
      categoryId,
      galleryId,
      museumId,
      relatedArtifacts
    });

    const savedExhibit = await exhibit.save();

    // Generate QR Code containing visitor client url pointing to /exhibit/:id
    const clientUrl = `http://localhost:5173/exhibit/${savedExhibit._id}`;
    const qrFilename = `qr-${savedExhibit._id}.png`;
    const qrPath = path.join('uploads', qrFilename);

    await QRCode.toFile(qrPath, clientUrl, {
      color: {
        dark: '#4E342E',  // Dark brown
        light: '#F7F2E9' // Parchment background
      }
    });

    savedExhibit.qrCodeUrl = `/uploads/${qrFilename}`;
    await savedExhibit.save();

    // Increment exhibitsCount on Gallery
    await Gallery.findByIdAndUpdate(galleryId, { $inc: { exhibitsCount: 1 } });

    res.status(201).json({ success: true, data: savedExhibit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateExhibit = async (req, res) => {
  try {
    const exhibit = await Exhibit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (exhibit) {
      res.json({ success: true, data: exhibit });
    } else {
      res.status(404).json({ success: false, message: 'Exhibit not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteExhibit = async (req, res) => {
  try {
    const exhibit = await Exhibit.findById(req.params.id);
    if (exhibit) {
      const galleryId = exhibit.galleryId;
      await Exhibit.findByIdAndDelete(req.params.id);
      
      // Decrement exhibitsCount on Gallery
      await Gallery.findByIdAndUpdate(galleryId, { $inc: { exhibitsCount: -1 } });

      res.json({ success: true, message: 'Exhibit deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Exhibit not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Favorites management
export const toggleFavourite = async (req, res) => {
  const { exhibitId } = req.body;
  const userId = req.user._id;
  try {
    const existing = await Favourite.findOne({ userId, exhibitId });
    if (existing) {
      await Favourite.findByIdAndDelete(existing._id);
      return res.json({ success: true, isFavourite: false, message: 'Removed from favourites' });
    } else {
      await Favourite.create({ userId, exhibitId });
      return res.json({ success: true, isFavourite: true, message: 'Added to favourites' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFavourites = async (req, res) => {
  try {
    const favourites = await Favourite.find({ userId: req.user._id }).populate('exhibitId');
    const exhibits = favourites.map(f => f.exhibitId).filter(e => e !== null);
    res.json({ success: true, count: exhibits.length, data: exhibits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
