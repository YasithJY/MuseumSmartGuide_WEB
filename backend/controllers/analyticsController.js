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

// ─── User Analytics Endpoint ──────────────────────────────────────────────────
export const getUserAnalytics = async (req, res) => {
  try {
    // 1. Total registered users (all roles) & breakdown
    const totalUsers = await User.countDocuments();
    const totalVisitors = await User.countDocuments({ role: 'visitor' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    // 2. Monthly registration trend (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const registrationTrend = await User.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Fill in missing months with 0
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const registrationChart = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1; // 1-indexed
      const found = registrationTrend.find(r => r._id.year === year && r._id.month === month);
      registrationChart.push({
        label: `${months[month - 1]} ${year}`,
        month: months[month - 1],
        users: found ? found.count : 0
      });
    }

    // 3. QR scan counts per exhibit (using VisitHistory as proxy for scans)
    const qrScanStats = await VisitHistory.aggregate([
      { $group: { _id: '$exhibitId', scanCount: { $sum: 1 } } },
      { $sort: { scanCount: -1 } }
    ]);
    const qrScansPopulated = await Exhibit.populate(qrScanStats, {
      path: '_id',
      select: 'title qrCodeUrl images'
    });

    // Format QR scan data
    const qrScans = qrScansPopulated
      .filter(item => item._id) // filter out deleted exhibits
      .map(item => ({
        exhibitId: item._id._id,
        exhibitTitle: item._id.title,
        hasQR: !!item._id.qrCodeUrl,
        scanCount: item.scanCount,
        image: item._id.images?.[0] || ''
      }));

    // Total scans
    const totalScans = qrScans.reduce((sum, item) => sum + item.scanCount, 0);

    // 4. Daily scan trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const dailyScanTrend = await VisitHistory.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          scans: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Fill in 30 days
    const scanChart = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const found = dailyScanTrend.find(
        r => r._id.year === year && r._id.month === month && r._id.day === day
      );
      scanChart.push({
        date: `${months[month - 1]} ${day}`,
        scans: found ? found.scans : 0
      });
    }

    // 5. Recent registrations (last 10)
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email role createdAt');

    res.json({
      success: true,
      data: {
        totalUsers,
        totalVisitors,
        totalAdmins,
        totalScans,
        registrationChart,
        qrScans,
        scanChart,
        recentUsers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
