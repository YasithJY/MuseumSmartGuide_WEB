import Museum from '../models/Museum.js';

export const getMuseums = async (req, res) => {
  try {
    const museums = await Museum.find({});
    res.json({ success: true, count: museums.length, data: museums });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMuseumById = async (req, res) => {
  try {
    const museum = await Museum.findById(req.params.id);
    if (museum) {
      res.json({ success: true, data: museum });
    } else {
      res.status(404).json({ success: false, message: 'Museum not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createMuseum = async (req, res) => {
  try {
    const { name, description, coverImage, openingHours, location } = req.body;
    const museum = await Museum.create({ name, description, coverImage, openingHours, location });
    res.status(201).json({ success: true, data: museum });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMuseum = async (req, res) => {
  try {
    const museum = await Museum.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (museum) {
      res.json({ success: true, data: museum });
    } else {
      res.status(404).json({ success: false, message: 'Museum not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMuseum = async (req, res) => {
  try {
    const museum = await Museum.findByIdAndDelete(req.params.id);
    if (museum) {
      res.json({ success: true, message: 'Museum deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Museum not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
