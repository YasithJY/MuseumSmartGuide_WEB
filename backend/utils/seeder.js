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

    // 2. Seed Categories (with Sinhala & Tamil translations)
    const categories = await Category.create([
      {
        name: 'Ancient Sculptures',
        description: 'Carvings and statues in stone, wood, or bronze',
        translations: {
          si: { name: 'පුරාණ මූර්ති', description: 'ගල්, ලී හෝ ලෝකඩ වලින් නිර්මාණය කළ කැටයම් සහ පිළිම' },
          ta: { name: 'பண்டைய சிற்பங்கள்', description: 'கல், மரம் அல்லது வெண்கலத்தில் செய்யப்பட்ட சிற்பங்கள் மற்றும் உருவங்கள்' }
        }
      },
      {
        name: 'Royal Antiquities',
        description: 'Artifacts, crowns, and weapons belonging to ancient kings',
        translations: {
          si: { name: 'රාජකීය පුරාවස්තු', description: 'පුරාණ රජවරුන්ට අයත් පුරාවස්තු, මුදුන් මාල සහ ආයුධ' },
          ta: { name: 'அரச பழம்பொருட்கள்', description: 'பண்டைய மன்னர்களுக்குரிய தொல்பொருட்கள், மகுடங்கள் மற்றும் ஆயுதங்கள்' }
        }
      },
      {
        name: 'Prehistoric Sri Lanka',
        description: 'Tools and evidence of early human settlements',
        translations: {
          si: { name: 'ප්‍රාග් ඓතිහාසික ශ්‍රී ලංකාව', description: 'මුල් මානව ජනාවාස වල මෙවලම් සහ සාක්ෂි' },
          ta: { name: 'வரலாற்றுக்கு முந்தைய இலங்கை', description: 'ஆரம்பகால மனித குடியிருப்புகளின் கருவிகள் மற்றும் சான்றுகள்' }
        }
      },
      {
        name: 'Traditional Costumes',
        description: 'Heritage jewelry, clothes, and regalia',
        translations: {
          si: { name: 'සාම්ප්‍රදායික ඇඳුම් පැළඳුම්', description: 'උරුම ආභරණ, ඇඳුම් සහ රාජකීය සැරසිලි' },
          ta: { name: 'பாரம்பரிய ஆடைகள்', description: 'பாரம்பரிய நகைகள், ஆடைகள் மற்றும் அரச அணிகலன்கள்' }
        }
      }
    ]);

    console.log('Categories seeded.');

    // 3. Seed Museum (with Sinhala & Tamil translations)
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
      galleriesCount: 4,
      translations: {
        si: {
          name: 'කොළඹ ජාතික කෞතුකාගාරය',
          description: '1877 දී ස්ථාපිත කොළඹ ජාතික කෞතුකාගාරය ශ්‍රී ලංකාවේ පොහොසත් ඓතිහාසික උරුමයේ ආරක්ෂකයා ලෙස පවතී. දහස් ගණන් පුරාවස්තු නිවාස කරමින්, එය ප්‍රාග් ඓතිහාසික යුගයේ සිට කන්දඋඩරට රාජධානිය දක්වා දිවයිනේ සංස්කෘතික, කලාත්මක සහ සමාජ පරිණාමය ප්‍රදර්ශනය කරයි.'
        },
        ta: {
          name: 'கொழும்பு தேசிய அருங்காட்சியகம்',
          description: '1877 இல் நிறுவப்பட்ட கொழும்பு தேசிய அருங்காட்சியகம் இலங்கையின் வளமான வரலாற்று பாரம்பரியத்தின் பாதுகாவலராக உள்ளது. ஆயிரக்கணக்கான தொல்பொருட்களைக் கொண்டு, வரலாற்றுக்கு முந்தைய காலம் முதல் கண்டி இராச்சியம் வரை தீவின் கலாச்சார, கலை மற்றும் சமூக பரிணாமத்தை இது காட்சிப்படுத்துகிறது.'
        }
      }
    });

    console.log('Colombo Museum seeded.');

    // 4. Seed Galleries (with Sinhala & Tamil translations)
    const galleries = await Gallery.create([
      {
        name: 'Stone Antiquities Gallery',
        description: 'Features masterpieces of Sri Lankan stone carvings including guard stones, moonstones, and statues dating from the Anuradhapura and Polonnaruwa periods.',
        coverImage: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=600',
        museumId: colomboMuseum._id,
        exhibitsCount: 2,
        translations: {
          si: {
            name: 'ගල් පුරාවස්තු ගැලරිය',
            description: 'අනුරාධපුර සහ පොළොන්නරුව යුගයන්ට අයත් මුරගල්, සඳකඩ පහන සහ පිළිම ඇතුළු ශ්‍රී ලංකීය ගල් කැටයම් කලාකෘති ප්‍රදර්ශනය කරයි.'
          },
          ta: {
            name: 'கல் தொல்பொருட்கள் கேலரி',
            description: 'அனுராதபுரம் மற்றும் பொலன்னறுவை காலங்களைச் சேர்ந்த காவல் கற்கள், சந்திரக் கற்கள் மற்றும் சிலைகள் உள்ளிட்ட இலங்கை கல் செதுக்கல் தலைசிறந்த படைப்புகளை இது காட்சிப்படுத்துகிறது.'
          }
        }
      },
      {
        name: 'Kandyan Kingdom Gallery',
        description: 'Exhibits regalia, royal swords, throne, and traditional jewelry of the last independent kingdom of Sri Lanka.',
        coverImage: 'https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?auto=format&fit=crop&q=80&w=600',
        museumId: colomboMuseum._id,
        exhibitsCount: 2,
        translations: {
          si: {
            name: 'කන්දඋඩරට රාජධානි ගැලරිය',
            description: 'ශ්‍රී ලංකාවේ අවසාන ස්වාධීන රාජධානියේ රාජකීය සැරසිලි, රාජකීය කඩු, සිංහාසනය සහ සාම්ප්‍රදායික ආභරණ ප්‍රදර්ශනය කරයි.'
          },
          ta: {
            name: 'கண்டி இராச்சிய கேலரி',
            description: 'இலங்கையின் கடைசி சுதந்திர இராச்சியத்தின் அரச அணிகலன்கள், அரச வாள்கள், சிம்மாசனம் மற்றும் பாரம்பரிய நகைகளை காட்சிப்படுத்துகிறது.'
          }
        }
      },
      {
        name: 'Prehistoric & Protohistoric Gallery',
        description: 'Walk through the life of Balangoda Man and early settlements with ancient pottery, beads, and stone axes.',
        coverImage: 'https://images.unsplash.com/photo-1569783046476-0f33923ef1e2?auto=format&fit=crop&q=80&w=600',
        museumId: colomboMuseum._id,
        exhibitsCount: 1,
        translations: {
          si: {
            name: 'ප්‍රාග් ඓතිහාසික සහ ප්‍රාථමික ඓතිහාසික ගැලරිය',
            description: 'පුරාණ මැටි බඳුන්, මුතු ඇට සහ ගල් පොරව සමඟ බලංගොඩ මානවයාගේ සහ මුල් ජනාවාස වල ජීවිතය හරහා ගමන් කරන්න.'
          },
          ta: {
            name: 'வரலாற்றுக்கு முந்தைய கேலரி',
            description: 'பண்டைய மட்பாண்டங்கள், மணிகள் மற்றும் கல் கோடரிகளுடன் பலன்கொடா மனிதன் மற்றும் ஆரம்பகால குடியிருப்புகளின் வாழ்க்கையை அனுபவியுங்கள்.'
          }
        }
      },
      {
        name: 'Bronzes and Art Gallery',
        description: 'Displays a rich collection of Hindu and Buddhist bronzes dating from the 5th to the 12th century AD.',
        coverImage: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&q=80&w=600',
        museumId: colomboMuseum._id,
        exhibitsCount: 1,
        translations: {
          si: {
            name: 'ලෝකඩ හා කලා ගැලරිය',
            description: 'ක්‍රි.ව. 5 වන සිට 12 වන සියවස දක්වා කාලයට අයත් හින්දු සහ බෞද්ධ ලෝකඩ පිළිම එකතුවක් ප්‍රදර්ශනය කරයි.'
          },
          ta: {
            name: 'வெண்கலங்கள் மற்றும் கலை கேலரி',
            description: 'கி.பி. 5ஆம் நூற்றாண்டு முதல் 12ஆம் நூற்றாண்டு வரையிலான இந்து மற்றும் பௌத்த வெண்கல சிலைகளின் பணக்கார தொகுப்பை காட்சிப்படுத்துகிறது.'
          }
        }
      }
    ]);

    console.log('Galleries seeded.');

    // 5. Seed Exhibits (with Sinhala & Tamil translations)
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
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        categoryId: categories[0]._id,
        galleryId: galleries[0]._id,
        museumId: colomboMuseum._id,
        qrCodeUrl: '/uploads/qr-toluvila-buddha.png',
        relatedArtifacts: [],
        translations: {
          si: {
            title: 'තෝලුවිල බුද්ධ ප්‍රතිමාව',
            description: 'ශ්‍රී ලංකාවේ වඩාත්ම ප්‍රසිද්ධ වාඩිවී සිටින බුදු පිළිමවලින් එකක් වන මෙය සමාධි භාවනා ඉරියව්වේ උත්තම සන්සුන්භාවය පෙන්නුම් කරයි.',
            historicalInfo: '1900 දී අනුරාධපුර, තෝලුවිල දී සොයාගත් මෙම ප්‍රතිමාව තනි ග්‍රැනයිට් ගල් කැබැල්ලකින් කැටයම් කර ඇත. එය අනුරාධපුර යුගයේ අග භාගයට (ක්‍රි.ව. 4-5 වන සියවස) අයත් වේ.',
            timeline: [
              { year: '450 AD', title: 'ප්‍රතිමාව කැටයම් කිරීම', description: 'අනුරාධපුර ස්වර්ණ යුගයේ දී දේශීය ග්‍රැනයිට් භාවිතයෙන් ප්‍රවීණ ගල් කර්මාන්තකරුවන් විසින් නිර්මාණය කරන ලදී.' },
              { year: '1900 AD', title: 'කැණීම් සහ සොයාගැනීම', description: 'බ්‍රිතාන්‍ය පුරාවිද්‍යාඥයන් විසින් තෝලුවිල ආරාම භූමියෙන් කැණීම් කර ලදී.' },
              { year: '1901 AD', title: 'කෞතුකාගාරයේ ස්ථාපනය', description: 'කොළඹ කෞතුකාගාරයට ගෙන ගොස් ප්‍රධාන පිවිසුම් ශාලාවේ තැබීම.' }
            ]
          },
          ta: {
            title: 'தோலுவில புத்தர் சிலை',
            description: 'இலங்கையின் மிகவும் பிரபலமான அமர்ந்த நிலை புத்தர் சிலைகளில் ஒன்றான இது சமாதி தியான நிலையின் உயர்ந்த அமைதியை வெளிப்படுத்துகிறது.',
            historicalInfo: '1900 இல் அனுராதபுரம், தோலுவிலவில் கண்டுபிடிக்கப்பட்ட இந்த சிலை ஒற்றை கிரானைட் கல் தொகுதியிலிருந்து செதுக்கப்பட்டது. இது அனுராதபுர காலத்தின் பிற்பகுதியைச் சேர்ந்தது (கி.பி. 4-5ஆம் நூற்றாண்டு).',
            timeline: [
              { year: '450 AD', title: 'சிலை செதுக்குதல்', description: 'அனுராதபுர பொற்காலத்தில் உள்ளூர் கிரானைட் பயன்படுத்தி நிபுணர் கல் செதுக்குநர்களால் உருவாக்கப்பட்டது.' },
              { year: '1900 AD', title: 'அகழ்வாராய்ச்சி', description: 'பிரிட்டிஷ் தொல்பொருள் ஆராய்ச்சியாளர்களால் தோலுவில மடாலய இடிபாடுகளிலிருந்து தோண்டி எடுக்கப்பட்டது.' },
              { year: '1901 AD', title: 'அருங்காட்சியக நிறுவல்', description: 'கொழும்பு அருங்காட்சியகத்திற்கு கொண்டு செல்லப்பட்டு மைய நுழைவாயில் மண்டபத்தில் வைக்கப்பட்டது.' }
            ]
          }
        }
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
        relatedArtifacts: [],
        translations: {
          si: {
            title: 'අනුරාධපුර සඳකඩ පහන',
            description: 'විහාර පඩි පෙළ අඩියේ තබා ඇති සුන්දර ලෙස කැටයම් කළ අර්ධ වෘත්තාකාර ගල් තහඩුවක් වන මෙය සංසාර චක්‍රය සංකේතවත් කරයි.',
            historicalInfo: 'මෙම සඳකඩ පහන අනුරාධපුර ගල් කැටයම් ශිල්පයේ හොඳම නිදසුන ලෙස පුළුල් ලෙස සලකනු ලැබේ. එහි සමකේන්ද්‍රික තීරු වල හංස, වැල් මල්, සතුන් සිව්දෙනා (ඇතා, අශ්වයා, සිංහයා, ගොනා) සහ මධ්‍ය නෙළුම් පෙති කැටයම් අඩංගු වේ.',
            timeline: [
              { year: '600 AD', title: 'රාජකීය විහාර පිවිසුමේ ස්ථාපනය', description: 'මහාවිහාරයේ පිවිසුම සඳහා නිර්මාණය කරන ලදී.' },
              { year: '1880 AD', title: 'පුරාණ වනයේ නැවත සොයාගැනීම', description: 'මුල් පුරාවිද්‍යා සමීක්ෂකයින් විසින් සොයාගන්නා ලදී.' }
            ]
          },
          ta: {
            title: 'அனுராதபுர சந்திரக்கல் (சந்தகட பஹன)',
            description: 'கோயில் படிக்கட்டுகளின் அடிவாரத்தில் வைக்கப்பட்ட அழகாக செதுக்கப்பட்ட அரைவட்ட கல் பலகை, சம்சாரச் சுழற்சியை குறிக்கிறது.',
            historicalInfo: 'இந்த சந்திரக்கல் அனுராதபுர கல் கைவினைத்திறனின் சிறந்த எடுத்துக்காட்டாக பரவலாகக் கருதப்படுகிறது. அன்னங்கள், கொடிகள், நான்கு விலங்குகள் (யானை, குதிரை, சிங்கம், காளை) மற்றும் மைய தாமரை இதழ்களின் செதுக்கல்கள் அடங்கியுள்ளன.',
            timeline: [
              { year: '600 AD', title: 'அரச கோயில் நுழைவாயில் அமைப்பு', description: 'மகாவிகாரையின் நுழைவாயிலுக்காக உருவாக்கப்பட்டது.' },
              { year: '1880 AD', title: 'பண்டைய காட்டில் மீண்டும் கண்டுபிடிப்பு', description: 'ஆரம்பகால தொல்பொருள் ஆய்வாளர்களால் கண்டுபிடிக்கப்பட்டது.' }
            ]
          }
        }
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
        categoryId: categories[1]._id,
        galleryId: galleries[1]._id,
        museumId: colomboMuseum._id,
        qrCodeUrl: '/uploads/qr-king-throne.png',
        relatedArtifacts: [],
        translations: {
          si: {
            title: 'කන්දඋඩරට අවසන් රජුගේ සිංහාසනය',
            description: 'ශ්‍රී ලංකාවේ අවසාන නරපතියා වූ ශ්‍රී වික්‍රම රාජසිංහ රජුගේ රන් සිංහාසනය.',
            historicalInfo: 'මහනුවර නිර්මාණය කරන ලද මෙම විශිෂ්ට සිංහාසනය රන් පත් වලින් ආවරණය වී ඇති අතර සියුම් තම්බවැඩ සහ රතු මැණිකෙන් අලංකාර කර ඇත. නිරපේක්ෂ පරමාධිපත්‍යය නියෝජනය කරන හිරු සහ සඳු සංකේත එහි දක්නට ලැබේ.',
            timeline: [
              { year: '1798 AD', title: 'රාජකීය මුදුන් පැලඳවීමේ උත්සවය', description: 'ශ්‍රී වික්‍රම රාජසිංහ රජුගේ මුදුන් පැලඳවීමේ උත්සවයේ දී භාවිතා කරන ලදී.' },
              { year: '1815 AD', title: 'බ්‍රිතාන්‍යයට නිර්වාසනය', description: 'කන්දඋඩරට ගිවිසුම අත්සන් කිරීමෙන් පසු වින්ඩ්සර් මාලිගාවට යවන ලදී.' },
              { year: '1934 AD', title: 'ශ්‍රී ලංකාවට ප්‍රත්‍යර්පණය', description: 'බ්‍රිතාන්‍ය ඔටුන්න විසින් රාජකීය ගෞරවයන් සහිතව කොළඹට ආපසු ලබා දෙන ලදී.' }
            ]
          },
          ta: {
            title: 'கண்டியின் கடைசி மன்னரின் சிம்மாசனம்',
            description: 'இலங்கையின் கடைசி மன்னரான ஸ்ரீ விக்கிரம ராஜசிங்க மன்னரின் தங்க சிம்மாசனம்.',
            historicalInfo: 'கண்டியில் கட்டப்பட்ட இந்த அற்புதமான சிம்மாசனம் தங்கத் தகடுகளால் மூடப்பட்டு நுட்பமான வேலைப்பாடுகள் மற்றும் சிவப்பு மாணிக்கங்களால் அலங்கரிக்கப்பட்டுள்ளது. முழுமையான இறையாண்மையை குறிக்கும் சூரியன் மற்றும் சந்திரன் சின்னங்கள் உள்ளன.',
            timeline: [
              { year: '1798 AD', title: 'அரச முடிசூட்டு விழா', description: 'ஸ்ரீ விக்கிரம ராஜசிங்க மன்னரின் முடிசூட்டு விழாவின் போது பயன்படுத்தப்பட்டது.' },
              { year: '1815 AD', title: 'பிரிட்டனுக்கு நாடுகடத்தல்', description: 'கண்டி உடன்படிக்கை கையெழுத்தான பின் வின்ட்சர் கோட்டைக்கு அனுப்பப்பட்டது.' },
              { year: '1934 AD', title: 'இலங்கைக்கு திருப்பி அனுப்புதல்', description: 'பிரிட்டிஷ் அரசால் அரச மரியாதைகளுடன் கொழும்புக்கு திருப்பி அனுப்பப்பட்டது.' }
            ]
          }
        }
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
        relatedArtifacts: [],
        translations: {
          si: {
            title: 'කන්දඋඩරට රාජකීය මුකුටය',
            description: 'දියමන්ති, මරකත සහ මැණික් වලින් සරසන ලද ශ්‍රී වික්‍රම රාජසිංහ රජු පැළඳ සිටි මුකුටය.',
            historicalInfo: 'රාජකීය මුකුටය රන් ලේස් සහ වටිනා මැණික් වලින් අලංකාර කරන ලද අද්විතීය සත්කෝණාකාර තොප්පි ශෛලියකි. එය සාම්ප්‍රදායික මෝස්තර සමඟ යුරෝපීය රෙදි බලපෑම් ඒකාබද්ධ කරමින් කන්දඋඩරට ලෝහ කර්මාන්තයේ සහ රාජකීය අනන්‍යතාවයේ උත්තුංගය සනිටුහන් කරයි.',
            timeline: [
              { year: '1815 AD', title: 'බ්‍රිතාන්‍ය හමුදාව විසින් අල්ලාගැනීම', description: 'මාලිගාවෙන් ඉවත් කර භාණ්ඩාගාර යුද කොල්ලයක් ලෙස තබා ගන්නා ලදී.' },
              { year: '1934 AD', title: 'මහජනතාවට ආපසු ලබාදීම', description: 'රාජකීය සිංහාසනය සමඟ ප්‍රත්‍යර්පණය කර කොළඹ කෞතුකාගාරයේ තැබීම.' }
            ]
          },
          ta: {
            title: 'கண்டி அரச மகுடம்',
            description: 'வைரங்கள், மரகதங்கள் மற்றும் மாணிக்கங்கள் பதிக்கப்பட்ட ஸ்ரீ விக்கிரம ராஜசிங்க மன்னர் அணிந்த மகுடம்.',
            historicalInfo: 'அரச மகுடம் தங்க சரிகை மற்றும் விலையுயர்ந்த கற்களால் அலங்கரிக்கப்பட்ட தனித்துவமான ஏழுகோண தொப்பி பாணியாகும். பாரம்பரிய வடிவங்களை ஐரோப்பிய ஜவுளி தாக்கங்களுடன் இணைத்து கண்டி உலோக வேலைப்பாட்டின் உச்சத்தை குறிக்கிறது.',
            timeline: [
              { year: '1815 AD', title: 'பிரிட்டிஷ் படைகளால் கைப்பற்றல்', description: 'அரண்மனையிலிருந்து அகற்றப்பட்டு கருவூல போர் கொள்ளையாக வைக்கப்பட்டது.' },
              { year: '1934 AD', title: 'பொதுமக்களுக்கு திருப்பி அளித்தல்', description: 'அரச சிம்மாசனத்துடன் திருப்பி அனுப்பப்பட்டு கொழும்பு அருங்காட்சியகத்தில் வைக்கப்பட்டது.' }
            ]
          }
        }
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
