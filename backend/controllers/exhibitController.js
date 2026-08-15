import Exhibit from '../models/Exhibit.js';
import Gallery from '../models/Gallery.js';
import Favourite from '../models/Favourite.js';
import VisitHistory from '../models/VisitHistory.js';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

/**
 * Apply multilingual translations to an exhibit document.
 * If lang is 'si' or 'ta', overlay translated fields on top of English defaults.
 * Falls back to English for any missing translated field.
 */
const applyExhibitTranslation = (exhibit, lang) => {
  if (!lang || lang === 'en') return exhibit;

  const doc = exhibit.toObject ? exhibit.toObject() : { ...exhibit };
  const t = doc.translations?.[lang];
  if (!t) return doc;

  if (t.title) doc.title = t.title;
  if (t.description) doc.description = t.description;
  if (t.historicalInfo) doc.historicalInfo = t.historicalInfo;

  // Translate timeline events (merge by index)
  if (t.timeline && t.timeline.length > 0 && doc.timeline) {
    doc.timeline = doc.timeline.map((event, idx) => {
      const translatedEvent = t.timeline[idx];
      if (!translatedEvent) return event;
      return {
        ...event,
        title: translatedEvent.title || event.title,
        description: translatedEvent.description || event.description
      };
    });
  }

  return doc;
};

export const getExhibits = async (req, res) => {
  const { categoryId, galleryId, museumId, search, period, lang } = req.query;
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

    // Apply multilingual translations if requested
    const data = lang ? exhibits.map(e => applyExhibitTranslation(e, lang)) : exhibits;

    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getExhibitById = async (req, res) => {
  const { lang } = req.query;
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
      // Apply multilingual translations if requested
      const data = lang ? applyExhibitTranslation(exhibit, lang) : exhibit;
      res.json({ success: true, data });
    } else {
      res.status(404).json({ success: false, message: 'Exhibit not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createExhibit = async (req, res) => {
  try {
    const { title, description, historicalInfo, timeline, images, audioUrl, videoUrl, categoryId, galleryId, museumId, relatedArtifacts, translations } = req.body;
    
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
      relatedArtifacts,
      translations
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

// QR Code scanning - resolve a QR code value to an exhibit
export const getExhibitByQR = async (req, res) => {
  const { qrValue } = req.query;
  const lang = req.query.lang;
  try {
    if (!qrValue) {
      return res.status(400).json({ success: false, message: 'qrValue query parameter is required' });
    }

    // The QR code encodes a URL like http://localhost:5173/exhibit/<exhibitId>
    // Extract the exhibit ID from the URL, or accept a raw ObjectId directly
    let exhibitId = qrValue;

    // Try to extract ID from a URL pattern: .../exhibit/<id>
    const urlMatch = qrValue.match(/\/exhibit\/([a-fA-F0-9]{24})/);
    if (urlMatch) {
      exhibitId = urlMatch[1];
    }

    // Also support matching by qrCodeUrl field directly
    let exhibit = null;
    if (exhibitId.match(/^[a-fA-F0-9]{24}$/)) {
      exhibit = await Exhibit.findById(exhibitId)
        .populate('categoryId', 'name')
        .populate('galleryId', 'name')
        .populate('museumId', 'name')
        .populate('relatedArtifacts', 'title coverImage images');
    }

    // Fallback: try matching by qrCodeUrl
    if (!exhibit) {
      exhibit = await Exhibit.findOne({ qrCodeUrl: { $regex: qrValue, $options: 'i' } })
        .populate('categoryId', 'name')
        .populate('galleryId', 'name')
        .populate('museumId', 'name')
        .populate('relatedArtifacts', 'title coverImage images');
    }

    if (exhibit) {
      const data = lang ? applyExhibitTranslation(exhibit, lang) : exhibit;
      res.json({ success: true, data });
    } else {
      res.status(404).json({ success: false, message: 'No exhibit found for this QR code' });
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
