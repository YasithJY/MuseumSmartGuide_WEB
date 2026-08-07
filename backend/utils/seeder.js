import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Museum from '../models/Museum.js';
import Gallery from '../models/Gallery.js';
import Exhibit from '../models/Exhibit.js';
import Category from '../models/Category.js';
import Quiz from '../models/Quiz.js';
import QuizQuestion from '../models/QuizQuestion.js';
import Favourite from '../models/Favourite.js';
import VisitHistory from '../models/VisitHistory.js';
import Notification from '../models/Notification.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to DB
    await connectDB();

    // Clear existing collections
    await User.deleteMany();
    await Museum.deleteMany();
    await Gallery.deleteMany();
    await Exhibit.deleteMany();
    await Category.deleteMany();
    await Quiz.deleteMany();
    await QuizQuestion.deleteMany();
    await Favourite.deleteMany();
    await VisitHistory.deleteMany();
    await Notification.deleteMany();

    console.log('Database cleared.');

    // 1. Seed Users
    const users = await User.create([
      {
        name: 'Super Admin',
        email: 'admin@museum150.gov.lk',
        password: 'admin123',
        role: 'admin',
        points: 0
      },
      {
        name: 'Yasith Perera',
        email: 'visitor@museum150.lk',
        password: 'visitor123',
        role: 'visitor',
        points: 120,
        earnedBadges: [
          { badgeId: 'first_quiz', title: 'Quiz Explorer', icon: '🏆' }
        ]
      }
    ]);

    console.log('Users seeded.');

    // 2. Seed Categories
    const categories = await Category.create([
      { name: 'Ancient Sculptures', description: 'Carvings and status in stone, wood, or bronze' },
      { name: 'Royal Antiquities', description: 'Artifacts, crowns, and weapons belonging to ancient kings' },
      { name: 'Prehistoric Sri Lanka', description: 'Tools and evidence of early human settlements' },
      { name: 'Traditional Costumes', description: 'Heritage jewelry, clothes, and regalia' }
    ]);

    console.log('Categories seeded.');

    // 3. Seed Museum
    const colomboMuseum = await Museum.create({
      name: 'National Museum of Colombo',
      description: 'Established in 1877, the National Museum of Colombo stands as the guardian of Sri Lanka\'s rich historical legacy. Housing thousands of antiquities, it exhibits the cultural, artistic, and social evolution of the island from prehistoric eras up to the Kandyan kingdom.',
      coverImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800',
      openingHours: {
        weekdays: '09:00 AM - 05:00 PM',
        weekends: '09:00 AM - 06:00 PM'
      },
      location: {
        address: 'Sir Marcus Fernando Mawatha, Colombo 00700, Sri Lanka',
        lat: 6.9113,
        lng: 79.8654
      },
      galleriesCount: 4
    });

    console.log('Colombo Museum seeded.');

    // 4. Seed Galleries
    const galleries = await Gallery.create([
      {
        name: 'Stone Antiquities Gallery',
        description: 'Features masterpieces of Sri Lankan stone carvings including guard stones, moonstones, and statues dating from the Anuradhapura and Polonnaruwa periods.',
        coverImage: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=600',
        museumId: colomboMuseum._id,
        exhibitsCount: 2
      },
      {
        name: 'Kandyan Kingdom Gallery',
        description: 'Exhibits regalia, royal swords, throne, and traditional jewelry of the last independent kingdom of Sri Lanka.',
        coverImage: 'https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?auto=format&fit=crop&q=80&w=600',
        museumId: colomboMuseum._id,
        exhibitsCount: 2
      },
      {
        name: 'Prehistoric & Protohistoric Gallery',
        description: 'Walk through the life of Balangoda Man and early settlements with ancient pottery, beads, and stone axes.',
        coverImage: 'https://images.unsplash.com/photo-1569783046476-0f33923ef1e2?auto=format&fit=crop&q=80&w=600',
        museumId: colomboMuseum._id,
        exhibitsCount: 1
      },
      {
        name: 'Bronzes and Art Gallery',
        description: 'Displays a rich collection of Hindu and Buddhist bronzes dating from the 5th to the 12th century AD.',
        coverImage: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&q=80&w=600',
        museumId: colomboMuseum._id,
        exhibitsCount: 1
      }
    ]);

    console.log('Galleries seeded.');

    // 5. Seed Exhibits
    const exhibits = await Exhibit.create([
      {
        title: 'The Toluvila Buddha Statue',
        description: 'One of the most famous seated Buddha statues in Sri Lanka, displaying the supreme calm of the Samadhi meditative posture.',
        historicalInfo: 'Discovered in Toluvila, Anuradhapura in 1900, this statue is carved from a single block of granite. It belongs to the late Anuradhapura period (circa 4th-5th century AD). The statue showcases the elegant simplicity of early Buddhist sculpture on the island.',
        timeline: [
          { year: '450 AD', title: 'Carving of the Statue', description: 'Sculpted by expert stonemasons using local granite during the Anuradhapura Golden Age.' },
          { year: '1900 AD', title: 'Excavation & Retrieval', description: 'Excavated from the Toluvila monastery ruins by British archaeologists.' },
          { year: '1901 AD', title: 'Museum Installation', description: 'Transported to the Colombo Museum where it occupies the central foyer entrance.' }
        ],
        images: [
          'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=600'
        ],
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Sample audio guide
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        categoryId: categories[0]._id, // Ancient Sculptures
        galleryId: galleries[0]._id,   // Stone Antiquities Gallery
        museumId: colomboMuseum._id,
        qrCodeUrl: '/uploads/qr-toluvila-buddha.png',
        relatedArtifacts: []
      },
      {
        title: 'Anuradhapura Moonstone (Sandakada Pahana)',
        description: 'A beautifully carved semi-circular stone slab placed at the foot of temple stairways, symbolizing the cycle of Samsara.',
        historicalInfo: 'This moonstone is widely considered the finest example of Anuradhapura stone craftsmanship. Its concentric bands feature carving of ducks, creepers, four animals (elephant, horse, lion, bull), and central lotus petals, detailing the stages of worldly suffering and ultimate nirvana.',
        timeline: [
          { year: '600 AD', title: 'Royal Temple Entrance Placement', description: 'Created for the entrance of the Mahavihara monastery.' },
          { year: '1880 AD', title: 'Rediscovered in Ancient Forest', description: 'Located by early antiquarian surveyors.' }
        ],
        images: [
          'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=600'
        ],
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        videoUrl: '',
        categoryId: categories[0]._id,
        galleryId: galleries[0]._id,
        museumId: colomboMuseum._id,
        qrCodeUrl: '/uploads/qr-moonstone.png',
        relatedArtifacts: []
      },
      {
        title: 'Throne of the Last King of Kandy',
        description: 'The golden throne of King Sri Vikrama Rajasinha, the last monarch of Sri Lanka.',
        historicalInfo: 'Constructed in Kandy, this magnificent throne is covered with gold sheets and decorated with intricate filigree and red rubies. It features symbols of the sun and moon representing absolute sovereignty. The throne was taken to Windsor Castle in 1815 after the fall of Kandy and returned by King George V in 1934.',
        timeline: [
          { year: '1798 AD', title: 'Royal Coronation Use', description: 'Used during the coronation of King Sri Vikrama Rajasinha.' },
          { year: '1815 AD', title: 'Exile to Britain', description: 'Shipped to Windsor Castle following the signing of the Kandyan Convention.' },
          { year: '1934 AD', title: 'Repatriation to Sri Lanka', description: 'Returned to Colombo with royal honors by the British Crown.' }
        ],
        images: [
          'https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?auto=format&fit=crop&q=80&w=600'
        ],
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        videoUrl: '',
        categoryId: categories[1]._id, // Royal Antiquities
        galleryId: galleries[1]._id,   // Kandyan Kingdom Gallery
        museumId: colomboMuseum._id,
        qrCodeUrl: '/uploads/qr-king-throne.png',
        relatedArtifacts: []
      },
      {
        title: 'Royal Crown of Kandy',
        description: 'The crown worn by King Sri Vikrama Rajasinha, encrusted with diamonds, emeralds, and rubies.',
        historicalInfo: 'The royal crown is a unique heptagonal hat style adorned with gold lace and precious gems. It marks the pinnacle of Kandyan metalwork and royal identity, combining traditional motifs with European textile influences.',
        timeline: [
          { year: '1815 AD', title: 'Captured by British Forces', description: 'Removed from the palace and kept as treasury war loot.' },
          { year: '1934 AD', title: 'Returned to the Public', description: 'Repatriated along with the royal throne and placed in the Colombo Museum.' }
        ],
        images: [
          'https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&q=80&w=600'
        ],
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        videoUrl: '',
        categoryId: categories[1]._id,
        galleryId: galleries[1]._id,
        museumId: colomboMuseum._id,
        qrCodeUrl: '/uploads/qr-royal-crown.png',
        relatedArtifacts: []
      }
    ]);

    // Cross-link some related artifacts
    exhibits[0].relatedArtifacts.push(exhibits[1]._id);
    exhibits[1].relatedArtifacts.push(exhibits[0]._id);
    exhibits[2].relatedArtifacts.push(exhibits[3]._id);
    exhibits[3].relatedArtifacts.push(exhibits[2]._id);

    await exhibits[0].save();
    await exhibits[1].save();
    await exhibits[2].save();
    await exhibits[3].save();

    console.log('Exhibits seeded.');

    // 6. Seed Quiz questions and Quizzes
    const q1 = await QuizQuestion.create({
      text: 'Where was the Toluvila Buddha Statue discovered?',
      type: 'multiple-choice',
      options: ['Anuradhapura', 'Polonnaruwa', 'Kandy', 'Colombo'],
      correctAnswer: 'Anuradhapura',
      points: 10
    });

    const q2 = await QuizQuestion.create({
      text: 'Which century does the Toluvila Buddha Statue belong to?',
      type: 'multiple-choice',
      options: ['12th Century', '4th-5th Century', '18th Century', '1st Century BC'],
      correctAnswer: '4th-5th Century',
      points: 10
    });

    const q3 = await QuizQuestion.create({
      text: 'The Toluvila Buddha statue is carved from a single block of granite.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 'True',
      points: 10
    });

    const quiz1 = await Quiz.create({
      title: 'Anuradhapura Sculptures Masterclass',
      description: 'Test your knowledge about the seated Toluvila Buddha and early Sinhala carvings.',
      difficulty: 'medium',
      pointsReward: 50,
      museumId: colomboMuseum._id,
      galleryId: galleries[0]._id,
      questions: [q1._id, q2._id, q3._id]
    });

    // Quiz 2: Kandyan Kingdom
    const q4 = await QuizQuestion.create({
      text: 'In which year did the Kingdom of Kandy fall to the British?',
      type: 'multiple-choice',
      options: ['1505', '1658', '1815', '1948'],
      correctAnswer: '1815',
      points: 15
    });

    const q5 = await QuizQuestion.create({
      text: 'Who returned the Royal Throne of Kandy to Sri Lanka in 1934?',
      type: 'multiple-choice',
      options: ['Queen Victoria', 'King George V', 'Lord Mountbatten', 'Queen Elizabeth II'],
      correctAnswer: 'King George V',
      points: 15
    });

    const quiz2 = await Quiz.create({
      title: 'Regalia of the last Kandyan Monarchy',
      description: 'Journey to the hill country and test your knowledge on royal crowns and thrones.',
      difficulty: 'hard',
      pointsReward: 80,
      museumId: colomboMuseum._id,
      galleryId: galleries[1]._id,
      questions: [q4._id, q5._id]
    });

    console.log('Quizzes & questions seeded.');

    console.log('Database Seeding Completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
