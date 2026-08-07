import Gallery from '../models/Gallery.js';
import Museum from '../models/Museum.js';

export const getGalleries = async (req, res) => {
  const { museumId } = req.query;
  try {
    const filter = museumId ? { museumId } : {};
    const galleries = await Gallery.find(filter).populate('museumId', 'name');
    res.json({ success: true, count: galleries.length, data: galleries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getGalleryById = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id).populate('museumId', 'name');
    if (gallery) {
      res.json({ success: true, data: gallery });
    } else {
      res.status(404).json({ success: false, message: 'Gallery not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createGallery = async (req, res) => {
  try {
    const { name, description, coverImage, museumId } = req.body;
    const gallery = await Gallery.create({ name, description, coverImage, museumId });
    
    // Update galleriesCount on Museum
    await Museum.findByIdAndUpdate(museumId, { $inc: { galleriesCount: 1 } });
    
    res.status(201).json({ success: true, data: gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (gallery) {
      res.json({ success: true, data: gallery });
    } else {
      res.status(404).json({ success: false, message: 'Gallery not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (gallery) {
      const museumId = gallery.museumId;
      await Gallery.findByIdAndDelete(req.params.id);
      
      // Update galleriesCount on Museum
      await Museum.findByIdAndUpdate(museumId, { $inc: { galleriesCount: -1 } });
      
      res.json({ success: true, message: 'Gallery deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Gallery not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
