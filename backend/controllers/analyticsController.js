import Museum from '../models/Museum.js';
import Gallery from '../models/Gallery.js';
import Exhibit from '../models/Exhibit.js';
import User from '../models/User.js';
import Quiz from '../models/Quiz.js';
import VisitHistory from '../models/VisitHistory.js';
import Favourite from '../models/Favourite.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalMuseums = await Museum.countDocuments();
    const totalGalleries = await Gallery.countDocuments();
    const totalExhibits = await Exhibit.countDocuments();
    const totalVisitors = await User.countDocuments({ role: 'visitor' });
    const totalQuizzes = await Quiz.countDocuments();

    // Top visited exhibits aggregation
    const visitStats = await VisitHistory.aggregate([
      { $group: { _id: '$exhibitId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    const popularExhibits = await Exhibit.populate(visitStats, { path: '_id', select: 'title coverImage images' });

    // Favourites aggregation
    const favStats = await Favourite.aggregate([
      { $group: { _id: '$exhibitId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    const topFavourited = await Exhibit.populate(favStats, { path: '_id', select: 'title coverImage images' });

    // Mock visitor analytics charts (simulate past 7 days)
    const visitorTraffic = [
      { day: 'Mon', visitors: 120 },
      { day: 'Tue', visitors: 150 },
      { day: 'Wed', visitors: 180 },
      { day: 'Thu', visitors: 220 },
      { day: 'Fri', visitors: 270 },
      { day: 'Sat', visitors: 430 },
      { day: 'Sun', visitors: 390 }
    ];

    res.json({
      success: true,
      stats: {
        totalMuseums,
        totalGalleries,
        totalExhibits,
        totalVisitors,
        totalQuizzes
      },
      popularExhibits: popularExhibits.map(item => ({
        exhibit: item._id,
        visits: item.count
      })),
      topFavourited: topFavourited.map(item => ({
        exhibit: item._id,
        favourites: item.count
      })),
      visitorTraffic
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
