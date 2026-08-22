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

    // 2. Seed Categories (with explicit ObjectIds and translations)
    const categories = await Category.create([
      {
        _id: new mongoose.Types.ObjectId('65d7593c66f50b2984950001'),
        name: 'Metallurgy & Manufacturing',
        description: 'Ancient Sri Lankan metalwork, furnace technology, and tool craftsmanship',
        translations: {
          si: { name: 'ලෝහ කර්මාන්තය සහ නිෂ්පාදන', description: 'පුරාණ ශ්‍රී ලාංකීය ලෝහ කර්මාන්තය, උදුන් තාක්ෂණය සහ මෙවලම් නිර්මාණය' },
          ta: { name: 'உலோகவியல் மற்றும் உற்பத்தி', description: 'பண்டைய இலங்கை உலோக வேலைப்பாடு, உலை தொழில்நுட்பம் மற்றும் கருவி கைவினைத்திறன்' }
        }
      },
      {
        _id: new mongoose.Types.ObjectId('65d7593c66f50b2984950002'),
        name: 'Hydraulics & Urban Planning',
        description: 'Ancient irrigation networks, reservoir construction, and city planning systems',
        translations: {
          si: { name: 'ජල විද්‍යාව සහ නාගරික සැලසුම්කරණය', description: 'පුරාණ වාරිමාර්ග ජාල, වැව් ඉදිකිරීම් සහ නගර සැලසුම් පද්ධති' },
          ta: { name: 'நீரியல் மற்றும் நகர்ப்புற திட்டமிடல்', description: 'பண்டைய நீர்ப்பாசன வலையமைப்புகள், நீர்த்தேக்கக் கட்டுமானம் மற்றும் நகர திட்டமிடல் அமைப்புகள்' }
        }
      },
      {
        _id: new mongoose.Types.ObjectId('65d7593c66f50b2984950003'),
        name: 'Monumental Architecture',
        description: 'Engineering and construction methodology behind massive brick stupas and rock fortresses',
        translations: {
          si: { name: 'මහා පරිමාණ ස්මාරක වාස්තු විද්‍යාව', description: 'යෝධ ගඩොල් ස්තූප සහ ගිරි දුර්ග පිටුපස ඇති ඉංජිනේරු හා ඉදිකිරීම් ක්‍රමවේද' },
          ta: { name: 'பிரம்மாண்டமான கட்டிடக்கலை', description: 'பிரம்மாண்டமான செங்கல் ஸ்தூபிகள் மற்றும் பாறை கோட்டைகளின் பின்னணியில் உள்ள பொறியியல் மற்றும் கட்டுமான முறை' }
        }
      },
      {
        _id: new mongoose.Types.ObjectId('65d7593c66f50b2984950004'),
        name: 'Modern Engineering Pioneers',
        description: 'Leading Sri Lankan engineers who revolutionized modern infrastructure, railways, and power grids',
        translations: {
          si: { name: 'නවීන ඉංජිනේරු පුරෝගාමීන්', description: 'නවීන යටිතල පහසුකම්, දුම්රිය සහ විදුලි පද්ධති නවීකරණය කළ ශ්‍රී ලාංකීය ඉංජිනේරුවන්' },
          ta: { name: 'நவீன பொறியியல் முன்னோடிகள்', description: 'நவீன உள்கட்டமைப்பு, புகையிரதம் மற்றும் மின்சார வலைப்பின்னல்களில் புரட்சியை ஏற்படுத்திய முன்னணி இலங்கை பொறியாளர்கள்' }
        }
      }
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
      galleriesCount: 2,
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

    // 4. Seed Galleries (with explicit ObjectIds)
    const galleries = await Gallery.create([
      {
        _id: new mongoose.Types.ObjectId('65d75a1d66f50b2984950011'),
        name: 'Ancient Engineering & Technology',
        description: 'Explore the advanced metallurgical, hydraulic, and structural engineering wonders of ancient Sri Lanka.',
        coverImage: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=600',
        museumId: colomboMuseum._id,
        exhibitsCount: 5,
        translations: {
          si: {
            name: 'පුරාණ ඉංජිනේරු විද්‍යාව සහ තාක්ෂණය',
            description: 'පුරාණ ශ්‍රී ලංකාවේ දියුණු ලෝහ කර්මාන්තය, වාරිමාර්ග සහ ගොඩනැගිලි ඉංජිනේරු විශ්මයන් ගවේෂණය කරන්න.'
          },
          ta: {
            name: 'பண்டைய பொறியியல் மற்றும் தொழில்நுட்பம்',
            description: 'பண்டைய இலங்கையின் மேம்பட்ட உலோகவியல், நீரியல் மற்றும் கட்டமைப்பு பொறியியல் அதிசயங்களை ஆராயுங்கள்.'
          }
        }
      },
      {
        _id: new mongoose.Types.ObjectId('65d75a1d66f50b2984950012'),
        name: 'Modern Engineering Pioneers',
        description: 'Celebrate the lives and legacy of the engineers who laid the foundations of modern Sri Lanka\'s infrastructure.',
        coverImage: 'https://images.unsplash.com/photo-1542647389-5e34e24ae7d7?auto=format&fit=crop&q=80&w=600',
        museumId: colomboMuseum._id,
        exhibitsCount: 3,
        translations: {
          si: {
            name: 'නවීන ඉංජිනේරු පුරෝගාමීන්',
            description: 'නවීන ශ්‍රී ලංකාවේ යටිතල පහසුකම් සඳහා අඩිතාලම දැමූ විශිෂ්ට ඉංජිනේරුවන්ගේ ජීවිත සහ උරුමය සැමරීම.'
          },
          ta: {
            name: 'நவீன பொறியியல் முன்னோடிகள்',
            description: 'நவீன இலங்கையின் உள்கட்டமைப்பிற்கு அடித்தளம் அமைத்த பொறியாளர்களின் வாழ்க்கை மற்றும் பாரம்பரியத்தை கொண்டாடுங்கள்.'
          }
        }
      }
    ]);

    console.log('Galleries seeded.');

    // 5. Seed Exhibits (with explicit ObjectIds)
    const exhibits = await Exhibit.create([
      {
        _id: new mongoose.Types.ObjectId('65d75b0a66f50b2984950021'),
        title: 'Wind-Powered Steel Smelting',
        description: 'A revolutionary ancient iron smelting system powered by natural monsoon winds.',
        historicalInfo: 'Surveys (in 1988) for the Samanalawewa Hydro Power Project revealed 139 sites relating to iron-working, spanning 2000 years. Of these, a remarkable 77 iron smelting sites were identified located on the exposed western ridges and hill tops that experience strong desiccating winds during the southwest monsoon. The furnace design utilized monsoon winds to create a unique wind pressure system, allowing the consistent production of high carbon steel. It has no other known parallels in ferrous technology.',
        timeline: [
          { year: '300 BC', title: 'Early Samanalawewa Furnaces', description: 'Evidence of early wind-powered furnaces optimized for wind direction.' },
          { year: '100 BC', title: 'Sigiriya Furnaces', description: 'Optimization of furnace cross-section and lengthening of front walls to over 2m.' },
          { year: '850 AD', title: 'Zenith of Production', description: 'Peak era of high carbon steel production during the 9th to 11th centuries AD.' },
          { year: '1988 AD', title: 'Samanalawewa Survey', description: 'Rediscovery and survey of 139 smelting sites during the Samanalawewa project.' }
        ],
        images: [
          'https://images.unsplash.com/photo-1518152006812-cdab29b069a8?auto=format&fit=crop&q=80&w=600'
        ],
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        videoUrl: '',
        categoryId: categories[0]._id,
        galleryId: galleries[0]._id,
        museumId: colomboMuseum._id,
        qrCodeUrl: '/uploads/qr-wind-steel.png',
        relatedArtifacts: [],
        translations: {
          si: {
            title: 'ශ්‍රී ලංකාවේ පුරාණ සුළං බලයෙන් ක්‍රියාත්මක යකඩ උදුන්',
            description: 'ස්වාභාවික මෝසම් සුළං බලයෙන් ක්‍රියාත්මක වූ ලෝකයේ අද්විතීය පුරාණ යකඩ නිෂ්පාදන පද්ධතියක්.',
            historicalInfo: 'සමනල වැව ජල විදුලි යෝජනා ක්‍රමය සඳහා මූලික මිණුම් කටයුතු (1988 දී) කිරීමේදී වසර 2000ක් පැරණි යකඩ සම්බන්ධ නිර්මාණ තිබෙන ස්ථාන 139ක් පිළිබඳව තොරතුරු අනාවරණය විය. මෙයින් සිද්ධි 77ක් නිරිදිග මෝසම් සුළඟ දැඩිව හමන බටහිර කඳු මුදුන් වල පිහිටා තිබුණි. මෙම සුවිශේෂී උදුන් මඟින් වායුපීඩන පද්ධතියක් ගොඩනැගුන අතර ඒ මඟින් අඛණ්ඩව කාබන් ප්‍රමාණාත්මක වානේ නිෂ්පාදනය විය.',
            timeline: [
              { year: '300 BC', title: 'මුල් සමනලවැව උදුන්', description: 'සුළඟේ දිශාවට ගැලපෙන සේ සැකසූ මුල්ම සුළං බලැති යකඩ උදුන් පිළිබඳ සාධක.' },
              { year: '100 BC', title: 'සීගිරි උදුන්', description: 'උදුන්වල හරස්කඩ ප්‍රශස්ත කිරීම සහ ඉදිරිපස බිත්ති මීටර් 2 ඉක්මවා දික් කිරීම.' },
              { year: '850 AD', title: 'නිෂ්පාදනයේ ස්වර්ණමය යුගය', description: 'ක්‍රි.ව. 9 - 11 සියවස් අතර කාලයේ සිදුවූ උසස් තත්ත්වයේ වානේ නිෂ්පාදනය.' },
              { year: '1988 AD', title: 'සමනලවැව සමීක්ෂණය', description: 'සමනලවැව ව්‍යාපෘතිය අතරතුර පැරණි උදුන් ස්ථාන 139ක් සොයාගැනීම.' }
            ]
          },
          ta: {
            title: 'இலங்கையின் பண்டைய காற்றால் இயக்கப்பட்ட இரும்பு உலைகள்',
            description: 'தென்மேற்கு பருவக்காற்றின் மூலம் இயக்கப்பட்ட பண்டைய இலங்கையின் தனித்துவமான இரும்பு உருக்கு முறை.',
            historicalInfo: '1988 ஆம் ஆண்டில் சமணலவெவ நீர்மின் திட்டத்தின் போது மேற்கொள்ளப்பட்ட ஆய்வுகளில் 2000 ஆண்டுகள் பழமையான 139 இரும்பு உருக்கு இடங்கள் கண்டறியப்பட்டன. இவற்றில் 77 உலைகள் தென்மேற்கு பருவக்காற்று பலமாக வீசும் மேற்கு மலை உச்சிகளில் அமைந்திருந்தன. இந்த உலைகளின் வடிவமைப்பு பருவக்காற்றை பயன்படுத்தி ஒரு தனித்துவமான காற்று அழுத்த அமைப்பை உருவாக்கி, உயர்தர எஃகு உற்பத்தி செய்ய உதவியது.',
            timeline: [
              { year: '300 BC', title: 'ஆரம்பகால சமணலவெவ உலைகள்', description: 'காற்றின் திசைக்கு ஏற்ப வடிவமைக்கப்பட்ட ஆரம்பகால காற்றாலை உலைகளின் சான்றுகள்.' },
              { year: '100 BC', title: 'சிகிரியா உலைகள்', description: 'உலையின் குறுக்கு வெட்டு மேம்படுத்தப்பட்டு, முன் சுவர் 2 மீட்டருக்கும் அதிகமாக நீட்டிக்கப்பட்டது.' },
              { year: '850 AD', title: 'உற்பத்தியின் உச்சம்', description: 'கி.பி 9 முதல் 11 ஆம் நூற்றாண்டு வரை எஃகு உற்பத்தியின் பொற்காலம்.' },
              { year: '1988 AD', title: 'சமணலவெவ ஆய்வு', description: 'சமணலவெவ திட்டத்தின் போது 139 இரும்பு உருக்கு இடங்கள் கண்டுபிடிக்கப்பட்டு ஆய்வு செய்யப்பட்டன.' }
            ]
          }
        }
      },
      {
        _id: new mongoose.Types.ObjectId('65d75b0a66f50b2984950022'),
        title: 'Elephant Lamp (Ath Pahana)',
        description: 'An ingenious ancient oil lamp showcasing masterfully resolved hydrostatic engineering.',
        historicalInfo: 'Shown here is the Elephant Lamp discovered at the Kotavehera in Dedigama, crafted during the reign of King Parakramabahu I (1153 – 1186 AD). For an oil lamp that operates via a wick, the height difference between the burning tip of the wick and the oil level in the reservoir must not be significant. If this height difference becomes too large, oil will stop being drawn up through the wick, causing the wick to burn out. Designing a lamp that can hold a large volume of oil without letting the burning surface level drop significantly is a difficult task. The Elephant Lamp clearly demonstrates how masterfully and artistically this engineering challenge was resolved by utilizing a smart hydrostatic vacuum principle within the elephant\'s hollow body.',
        timeline: [
          { year: '1153 AD', title: 'Reign of King Parakramabahu I', description: 'The lamp is crafted by royal artisans as a masterclass of artistic and engineering skill.' },
          { year: '1950s AD', title: 'Excavation of Kotavehera', description: 'The unique lamp is excavated from the ruins of the Kotavehera stupa in Dedigama.' }
        ],
        images: [
          'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&q=80&w=600'
        ],
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        videoUrl: '',
        categoryId: categories[0]._id,
        galleryId: galleries[0]._id,
        museumId: colomboMuseum._id,
        qrCodeUrl: '/uploads/qr-elephant-lamp.png',
        relatedArtifacts: [],
        translations: {
          si: {
            title: 'ඇත් පහණ',
            description: 'ජල පීඩන තාක්ෂණය සහ කලාත්මක බව මනාව සංකලනය කරමින් නිපදවූ සුවිශේෂී පුරාණ පහනක්.',
            historicalInfo: 'පළමුවන පරාක්‍රමබාහු රජතුමා විසින් කරවන ලද, දැනට දැදිගම කොටවෙහෙරෙන් හමු වූ ඇත් පහණ (ක්‍රි.ව. 1153 - 1186). මෙහි තෙල් ගබඩා කෙරෙන්නේ ඇතුගේ කුහරය (R) තුළය. තෙල් දහනය වන විට ද්‍රවස්ථිතික පීඩන මූලධර්මයක් මඟින් පහන් තැටියට තෙල් ස්වයංක්‍රීයව ගලා ඒම පාලනය වේ.',
            timeline: [
              { year: '1153 AD', title: 'පළමුවන පරාක්‍රමබාහු රජ යුගය', description: 'කලාත්මක සහ තාක්ෂණික කුසලතා විදහා දක්වමින් රාජකීය ශිල්පීන් විසින් නිමවන ලදී.' },
              { year: '1950s AD', title: 'කොටවෙහෙර කැණීම්', description: 'දැදිගම කොටවෙහෙර ස්තූපයේ කැණීම් කටයුතු වලින් මෙම වටිනා පහන සොයාගැනීම.' }
            ]
          },
          ta: {
            title: 'யானை விளக்கு (ඇත් පහණ)',
            description: 'நீர்ம அழுத்த சமநிலையை பயன்படுத்தி வடிவமைக்கப்பட்ட ஒரு விசித்திரமான விளக்கு.',
            historicalInfo: 'முதலாம் பராக்கிரமபாகு மன்னரின் ஆட்சிக்காலத்தில் (கி.பி. 1153 – 1186) உருவாக்கப்பட்ட இந்த விளக்கு தெதிகம கொட்டவெஹெர ஸ்தூபியிலிருந்து கண்டெடுக்கப்பட்டது. யானையின் வெற்று உடலுக்குள் நீர்ம அழுத்த வெற்றிடக் கொள்கையைப் பயன்படுத்தி இந்த பொறியியல் சவால் தீர்க்கப்பட்டுள்ளது.',
            timeline: [
              { year: '1153 AD', title: 'முதலாம் பராக்கிரமபாகு மன்னரின் ஆட்சி', description: 'கலை மற்றும் பொறியியல் திறனின் உச்சமாக அரச கைவினைஞர்களால் இந்த விளக்கு உருவாக்கப்பட்டது.' },
              { year: '1950s AD', title: 'கொட்டவெஹெர அகழ்வாராய்ச்சி', description: 'தெதிகமவில் உள்ள கொட்டவெஹெர ஸ்தூபியின் இடிபாடுகளிலிருந்து இந்த தனித்துவமான விளக்கு தோண்டி எடுக்கப்பட்டது.' }
            ]
          }
        }
      },
      {
        _id: new mongoose.Types.ObjectId('65d75b0a66f50b2984950023'),
        title: 'Jetavana Stupa (Jethawanarama)',
        description: 'One of the largest colossal monuments of the ancient world, showcasing massive structural brick engineering.',
        historicalInfo: 'The construction of the colossal Stupa of Jetavana is attributed to King Mahasen [275-301 AD]. It is said to be the biggest Stupa ever built, perhaps anywhere in the Buddhist world, and the third largest building of its time. Its height is given in the Chulavamsa as 160 vadu riyan, which is equivalent to 400 feet (122.0m) to the tip of its spire, and 370 feet (113.0m) across its base. During the archaeological investigations, it has been found that the interior of the Jetavana Stupa is constituted of different materials arranged in different orders, beginning from the bedrock 7.0m-8.8m below the terrace, constructed in two levels using fully burnt bricks and a very thin clay mortar.',
        timeline: [
          { year: '276 AD', title: 'Initiation of Jetavana Stupa', description: 'Construction initiated under King Mahasen, mobilizing thousands of artisans.' },
          { year: '301 AD', title: 'Completion of Stupa', description: 'Stupa completed as the tallest brick structure in the ancient world.' },
          { year: '1909 AD', title: 'Archaeological Survey', description: 'Surveys of the ruins confirming the unique foundation construction levels.' }
        ],
        images: [
          'https://images.unsplash.com/photo-1590050752117-238cb061295a?auto=format&fit=crop&q=80&w=600'
        ],
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        videoUrl: '',
        categoryId: categories[2]._id,
        galleryId: galleries[0]._id,
        museumId: colomboMuseum._id,
        qrCodeUrl: '/uploads/qr-jetavana-stupa.png',
        relatedArtifacts: [],
        translations: {
          si: {
            title: 'ජේතවන මහා ස්තූපය',
            description: 'පුරාණ ලෝකයේ ගඩොලින් කළ විශාලතම ඉදිකිරීම වන ජේතවනාරාමයේ ඉංජිනේරු විද්‍යාත්මක ක්‍රමවේදය.',
            historicalInfo: 'මහසෙන් රජතුමා විසින් ක්‍රි.ව. 275 - 301 අතර කාලයේ ඉදිකරන ලදී. මෙය ලොව විශාලතම ස්තූපය වන අතර එකල ලොව තෙවන විශාලතම ඉදිකිරීම විය. උස අඩි 400ක් (මීටර 122) සහ පාදමේ විෂ්කම්භය අඩි 370කි. අත්තිවාරම පොළොව මට්ටමෙන් මීටර් 7 - 8.8 ක් ගැඹුරින් පිහිටි ගල මත මට්ටම් දෙකක් යටතේ ඉදිකර ඇත.',
            timeline: [
              { year: '276 AD', title: 'ජේතවන ඉදිකිරීම් ඇරඹීම', description: 'මහසෙන් රජුගේ නියෝගයෙන් දහස් ගණන් ශිල්පීන් සමඟ ස්තූපයේ වැඩ ඇරඹීම.' },
              { year: '301 AD', title: 'ස්තූපය නිම කිරීම', description: 'පුරාණ ලෝකයේ උසම ගඩොල් ඉදිකිරීම් ලෙස මහා ස්තූපයේ වැඩ අවසන් වීම.' },
              { year: '1909 AD', title: 'පුරාවිද්‍යා සමීක්ෂණ', description: 'ස්තූපයේ අත්තිවාරම් මට්ටම් සහ ගඩොල් ප්‍රමාණයන් පිළිබඳව විද්‍යාත්මකව තහවුරු කරගැනීම.' }
            ]
          },
          ta: {
            title: 'ஜேதவன தூபி (ஜேதவனாராமய)',
            description: 'பண்டைய உலகின் மிகப்பெரிய செங்கல் கட்டிடம் மற்றும் அதன் கட்டமைப்பு பொறியியல்.',
            historicalInfo: 'ஜேதவன தூபி மகாசேன மன்னரால் (கி.பி. 275-301) கட்டப்பட்டது. இது பௌத்த உலகில் இதுவரை கட்டப்பட்ட மிகப்பெரிய ஸ்தூபியாகும். இதன் ஆரம்ப உயரம் 400 அடி (122 மீட்டர்) ஆகும். தொல்பொருள் ஆய்வுகளின்படி, ஜேதவன ஸ்தூபியின் உட்புறம் வெவ்வேறு கட்டமைப்பு வரிசைகளில் அடுக்கப்பட்ட வெவ்வேறு பொருட்களால் ஆனது.',
            timeline: [
              { year: '276 AD', title: 'ஸ்தூபி கட்டுமானம் தொடக்கம்', description: 'மகாசேன மன்னரின் கீழ் பல்லாயிரக்கணக்கான கைவினைஞர்களுடன் ஸ்தூபியின் கட்டுமானம் தொடங்கியது.' },
              { year: '301 AD', title: 'கட்டுமானம் நிறைவு', description: 'பண்டைய உலகின் மிக உயரமான செங்கல் அமைப்பாக ஸ்தூபி கட்டி முடிக்கப்பட்டது.' },
              { year: '1909 AD', title: 'தொல்பொருள் ஆய்வு', description: 'ஸ்தூபியின் இடிபாடுகளை ஆய்வு செய்து அதன் தனித்துவமான அடித்தள கட்டுமான நிலைகளை உறுதிப்படுத்தினர்.' }
            ]
          }
        }
      },
      {
        _id: new mongoose.Types.ObjectId('65d75b0a66f50b2984950024'),
        title: 'Bisokotuwa (Reservoir Sluice Gate)',
        description: 'The grandfather of modern sluice gates, used to regulate water release in ancient reservoirs.',
        historicalInfo: 'Developed around 2000 years ago by the engineers of ancient Sri Lanka, the Bisokotuwa was used to control and issue water from reservoirs, that generally had high heads. It was a rectangular pit lined with long, thin granite slabs built parallel to the reservoir bund, housing the inlet and outlet conduits. It enabled to reduce the potentially destructive kinetic energy of the incoming water which could have eroded the structure, preventing the collapse of the embankment. The system shows early mastership of hydraulics.',
        timeline: [
          { year: '100 BC', title: 'First Hydraulic Sluices', description: 'Early construction of Bisokotuwa systems in Anuradhapura reservoirs.' },
          { year: '1900 AD', title: 'Irrigation Surveys', description: 'Detailed engineering analysis of ancient sluice gate ruins.' }
        ],
        images: [
          'https://images.unsplash.com/photo-1508873696983-2df519f0397e?auto=format&fit=crop&q=80&w=600'
        ],
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        videoUrl: '',
        categoryId: categories[1]._id,
        galleryId: galleries[0]._id,
        museumId: colomboMuseum._id,
        qrCodeUrl: '/uploads/qr-bisokotuwa.png',
        relatedArtifacts: [],
        translations: {
          si: {
            title: 'බිසෝ කොටුව',
            description: 'වැව් කණ්ඩිය ආරක්ෂා කරමින් ජලය මුදා හැරීම පාලනය කළ විශිෂ්ට පුරාණ වාරි තාක්ෂණික නිර්මාණය.',
            historicalInfo: 'වැව් බැම්මට හානි නොවන පරිදි ජලය පිටතට ලබාගැනීම සඳහා වාරි ඉංජිනේරුවන් විසින් මීට වසර 2000කට පෙර ඉදිකළ බිසෝ කොටුව වාරි නිර්මාණ වල සන්ධිස්ථානයකි. ජලයේ අධික වේගය සහ පීඩනය බිඳ දැමීම මඟින් වැව් කණ්ඩිය ආරක්ෂා කරගැනීමට මෙය බෙහෙවින් උපකාරී විය.',
            timeline: [
              { year: '100 BC', title: 'පළමු වාරි සොරොව්ව', description: 'අනුරාධපුර යුගයේ මුල් වැව් නිර්මාණ වලදී බිසෝ කොටු තාක්ෂණය යොදාගැනීම.' },
              { year: '1900 AD', title: 'වාරිමාර්ග සමීක්ෂණ', description: 'පැරණි බිසෝ කොටු නිර්මාණ වල තාක්ෂණික ලක්ෂණ පිළිබඳව වාරි ඉංජිනේරුවන් විසින් කළ අධ්‍යයන.' }
            ]
          },
          ta: {
            title: 'பிஸோகொட்டுவ (மதகு மதிலை)',
            description: 'நீர்த்தேக்கங்களிலிருந்து நீரை ஒழுங்குபடுத்தி வெளியேற்ற உதவும் பண்டைய நீர்ப்பாசன தொழில்நுட்பம்.',
            historicalInfo: '2000 ஆண்டுகளுக்கு முன்பு பண்டைய இலங்கை பொறியாளர்களால் நீர்த்தேக்கங்களின் நீர் அழுத்தத்தை கட்டுப்படுத்த வடிவமைக்கப்பட்ட ஒரு கல் தொட்டியாகும். அணைக்கட்டின் சுவர்கள் அரிப்பினால் சரிவதைத் தடுக்கவும், நீரின் வேகத்தை குறைக்கவும் இது பயன்படுத்தப்பட்டது.',
            timeline: [
              { year: '100 BC', title: 'முதல் ஹைட்ராலிக் மதகுகள்', description: 'அனுராதபுர நீர்த்தேக்கங்களில் ஆரம்பகால பிஸோகொட்டுவ அமைப்புகளின் கட்டுமானம்.' },
              { year: '1900 AD', title: 'நீர்ப்பாசன ஆய்வுகள்', description: 'பண்டைய மதகு மதிலை இடிபாடுகளின் விரிவான பொறியியல் பகுப்பாய்வு.' }
            ]
          }
        }
      },
      {
        _id: new mongoose.Types.ObjectId('65d75b0a66f50b2984950025'),
        title: 'Sigiriya Water Management Technology',
        description: 'An outstanding example of ancient urban planning, micro-hydraulics, and symmetrical landscape gardens.',
        historicalInfo: 'Sigiriya is well known for its water management systems. The main problem encountered during the design of a water garden system would have been sourcing of the required amount of water throughout the year. Accordingly, Sigiriya Engineers constructed collection ponds in strategic locations, to retain the rain water. The water retained in these facilities had been meticulously arranged to feed the palace complex, gardens, and moats. The system uses a network of underground clay pipes and gravity pressure to feed fountains that still operate during the rainy season.',
        timeline: [
          { year: '477 AD', title: 'Construction of Sigiriya', description: 'King Kasyapa selects the Sigiriya rock and initiates the garden layout.' },
          { year: '495 AD', title: 'Operation of Fountains', description: 'Completion of the gravity-fed hydraulic systems and water fountains.' }
        ],
        images: [
          'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&q=80&w=600'
        ],
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        videoUrl: '',
        categoryId: categories[1]._id,
        galleryId: galleries[0]._id,
        museumId: colomboMuseum._id,
        qrCodeUrl: '/uploads/qr-sigiriya-water.png',
        relatedArtifacts: [],
        translations: {
          si: {
            title: 'සීගිරි ජල කළමනාකරණ තාක්ෂණය',
            description: 'මයික්‍රෝ-හයිඩ්‍රොලික් සහ සමමිතික භූ දර්ශන උද්‍යාන භාවිතයෙන් නිර්මාණය කළ විශිෂ්ට පැරණි නාගරික සැලසුම්කරණයක්.',
            historicalInfo: 'සීගිරි ජල කළමනාකරණය පිළිබඳ ලොව පුරා ප්‍රසිද්ධය. සීගිරි ඉංජිනේරුවන් විසින් වැසි ජලය රැස් කිරීම සඳහා උපායමාර්ගික ස්ථාන වල පොකුණු ඉදිකළහ. භූගත මැටි නල සහ ගුරුත්වාකර්ෂණ බලයෙන් ක්‍රියාත්මක වන දියමල් මඟින් දිය අගල් සහ උද්‍යාන සඳහා අඛණ්ඩව ජලය සැපයීය.',
            timeline: [
              { year: '477 AD', title: 'සීගිරිය ඉදිකිරීම ඇරඹීම', description: 'කාශ්‍යප රජු විසින් සීගිරි පර්වතය තෝරාගෙන උද්‍යානවල සැලසුම් ඇරඹීම.' },
              { year: '495 AD', title: 'දියමල් ක්‍රියාත්මක කිරීම', description: 'ගුරුත්වාකර්ෂණ බලයෙන් ක්‍රියාත්මක වන ජල පද්ධතිය සහ දියමල්වල වැඩ අවසන් වීම.' }
            ]
          },
          ta: {
            title: 'சிகிரியா நீர் மேலாண்மை தொழில்நுட்பம்',
            description: 'பண்டைய நகர்ப்புற திட்டமிடல், நுண்-நீரியல் மற்றும் சமச்சீர் பூங்காக்களின் சிறந்த எடுத்துக்காட்டு.',
            historicalInfo: 'சிகிரியா அதன் நீர் மேலாண்மை அமைப்புகளுக்கு பெயர் பெற்றது. ஆண்டு முழுவதும் தேவையான நீரை சேமித்து வைப்பதற்காக சிகிரியா பொறியாளர்கள் மூலோபாய இடங்களில் குளங்களை அமைத்தனர். இந்த அமைப்புகள் அரண்மனை வளாகம், பூங்காக்கள் மற்றும் அகழிகளுக்கு நீர் வழங்கின. நீரூற்றுகள் இன்றும் மழைக்காலத்தில் ஈர்ப்பு அழுத்தத்தின் மூலம் இயங்குகின்றன.',
            timeline: [
              { year: '477 AD', title: 'சிகிரியா கட்டுமானம்', description: 'காசியப்ப மன்னர் சிகிரியா பாறையைத் தேர்ந்தெடுத்து பூங்காக்களின் அமைப்பைத் தொடங்கினார்.' },
              { year: '495 AD', title: 'நீரூற்றுகளின் இயக்கம்', description: 'ஈர்ப்பு அழுத்த நீரியல் அமைப்புகள் மற்றும் நீரூற்றுகளின் கட்டுமானம் நிறைவடைந்தது.' }
            ]
          }
        }
      },
      {
        _id: new mongoose.Types.ObjectId('65d75b0a66f50b2984950026'),
        title: 'Eng. D. J. Wimalasurendra',
        description: 'The visionary pioneer known as the \'Father of Hydro-Electricity\' in Sri Lanka.',
        historicalInfo: 'Eng. D J Wimalasurendra considered the \'Father of Hydro-Electricity in Sri Lanka\' holds an unparalleled record in the annals of the history of civil and electrical engineering fields in the country. He was the eldest son of the master craftsman, Muhandiram Don Juan Devapura Wimalasurendra, born on the 17th September 1874 in the village of Galwadugoda, Galle. He surveyed the Kelani Valley in 1901 and recognized the hydro-power potential of Laxapana and Aberdeen Falls. His subsequent submission of a technical case study on \'Economics of power utilization in Ceylon\' in 1918 led to the Laxapana Power Project. He also designed the unique "loop-loop" railway track at Demodara.',
        timeline: [
          { year: '1874 AD', title: 'Birth of Wimalasurendra', description: 'Born in Galle to a traditional master craftsman family.' },
          { year: '1901 AD', title: 'Laxapana Discovery', description: 'Surveyed the Kelani Valley and identified the hydro-power potential.' },
          { year: '1918 AD', title: 'Hydro-Power Proposal', description: 'Submitted his landmark paper on Sri Lankan hydro-electricity economics.' },
          { year: '1950 AD', title: 'Laxapana Commissioning', description: 'First stage of the Laxapana Hydro-Power Project successfully commissioned.' }
        ],
        images: [
          'https://images.unsplash.com/photo-1473877947094-13107d85acf9?auto=format&fit=crop&q=80&w=600'
        ],
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        videoUrl: '',
        categoryId: categories[3]._id,
        galleryId: galleries[1]._id,
        museumId: colomboMuseum._id,
        qrCodeUrl: '/uploads/qr-wimalasurendra.png',
        relatedArtifacts: [],
        translations: {
          si: {
            title: 'ඉංජිනේරු ඩී. ජේ. විමලසුරේන්ද්‍ර',
            description: 'ශ්‍රී ලංකාවේ ජල විදුලි බල ක්ෂේත්‍රයේ නිර්මාතෘ සහ පුරෝගාමියා.',
            historicalInfo: '1874 උපත ලැබූ දේවපුර ජයසේන විමලසුරේන්ද්‍ර මහතා ලංකාවේ ජල විදුලියේ පියා ලෙස හැඳින්වේ. 1901 දී ලක්ෂපාන දිය ඇල්ලේ ජල විදුලි විභවය හඳුනාගත් ඔහු ලක්ෂපාන ව්‍යාපෘතියේ සැලසුම් සකස් කළේය. දෙමෝදර දුම්රිය වටරවුම (loop-loop) ද එතුමාගේ විශිෂ්ට නිර්මාණයකි.',
            timeline: [
              { year: '1874 AD', title: 'විමලසුරේන්ද්‍ර මහතාගේ උපත', description: 'ගාල්ලේ සාම්ප්‍රදායික ශිල්පී පවුලක උපත ලැබීම.' },
              { year: '1901 AD', title: 'ලක්ෂපාන ජල විභවය හඳුනාගැනීම', description: 'කැළණි නිම්නය සමීක්ෂණය කර ජල විදුලි විභවය හඳුනාගැනීම.' },
              { year: '1918 AD', title: 'ජල විදුලි යෝජනාව', description: 'ලංකාවේ විදුලි බලය උපයෝගී කරගැනීමේ ආර්ථික විද්‍යාත්මක වාර්තාව ඉදිරිපත් කිරීම.' },
              { year: '1950 AD', title: 'ලක්ෂපාන බලාගාරය ඇරඹීම', description: 'ලක්ෂපාන ව්‍යාපෘතියේ පළමු අදියර සාර්ථකව විවෘත කිරීම.' }
            ]
          },
          ta: {
            title: 'பொறியியலாளர் தே. ஜ. விமலசுரேந்திர',
            description: 'இலங்கையின் நீர்மின்சார உற்பத்தியின் தந்தை மற்றும் முன்னோடி.',
            historicalInfo: 'இலங்கையின் நீர்மின்சாரத்தின் தந்தையாகக் கருதப்படும் பொறியியலாளர் டி. ஜே. விமலசுரேந்திரா 1874 செப்டம்பர் 17 அன்று காலியில் பிறந்தார். அவர் 1901 ஆம் ஆண்டில் களனி பள்ளத்தாக்கை ஆய்வு செய்து, லக்ஷபான நீர்வீழ்ச்சியின் நீர்மின் திறனை கண்டறிந்தார். 1918 இல் அவர் சமர்ப்பித்த அறிக்கை லக்ஷபான நீர்மின் திட்டத்திற்கு வழிவகுத்தது. தெமோதர ரயில் வளைவையும் (loop-loop) அவரே வடிவமைத்தார்.',
            timeline: [
              { year: '1874 AD', title: 'விமலசுரேந்திராவின் பிறப்பு', description: 'காலியில் ஒரு பாரம்பரிய கைவினைஞர் குடும்பத்தில் பிறந்தார்.' },
              { year: '1901 AD', title: 'லக்ஷபான கண்டுபிடிப்பு', description: 'களனி பள்ளத்தாக்கை ஆய்வு செய்து நீர்மின் திறனைக் கண்டறிந்தார்.' },
              { year: '1918 AD', title: 'நீர்மின்சாரத் திட்டம்', description: 'இலங்கையின் நீர்மின்சாரப் பயன்பாடு குறித்த தனது மைல்கல் திட்டத்தைச் சமர்ப்பித்தார்.' },
              { year: '1950 AD', title: 'லக்ஷபான தொடக்கம்', description: 'லக்ஷபான நீர்மின் திட்டத்தின் முதல் கட்டம் வெற்றிகரமாகத் தொடங்கப்பட்டது.' }
            ]
          }
        }
      },
      {
        _id: new mongoose.Types.ObjectId('65d75b0a66f50b2984950027'),
        title: 'Eng. B. D. Rampala',
        description: 'The legendary chief mechanical engineer who revolutionized Sri Lankan railways during its \'Golden Era\'.',
        historicalInfo: 'Eng. Bamunusinghearachchige Don Rampala, educated at Ananda and Nalanda Colleges, Colombo, joined the Ceylon Government Railway (CGR) as a Special Apprentice in 1931. He became the first Sri Lankan Chief Mechanical Engineer in 1949 and General Manager in 1955. His 15-year tenure is regarded as the Golden Era of the CGR. He dieselized the railway, introduced observation cars, 55 ft long coaches, and the famous long-distance express trains: Yal Devi, Udarata Menike, and Ruhunu Kumari.',
        timeline: [
          { year: '1931 AD', title: 'Railway Service Entry', description: 'Joined the Ceylon Government Railway as a Special Apprentice.' },
          { year: '1949 AD', title: 'Chief Mechanical Engineer', description: 'Appointed as the first Sri Lankan Chief Mechanical Engineer.' },
          { year: '1955 AD', title: 'General Manager of Railways', description: 'Assumed duties as General Manager, initiating massive modernization.' },
          { year: '1956 AD', title: 'Dieselization Launch', description: 'Successfully transitioned Sri Lankan railways from steam to diesel locomotives.' }
        ],
        images: [
          'https://images.unsplash.com/photo-1542647389-5e34e24ae7d7?auto=format&fit=crop&q=80&w=600'
        ],
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        videoUrl: '',
        categoryId: categories[3]._id,
        galleryId: galleries[1]._id,
        museumId: colomboMuseum._id,
        qrCodeUrl: '/uploads/qr-rampala.png',
        relatedArtifacts: [],
        translations: {
          si: {
            title: 'ඉංජිනේරු බී. ඩී. රම්පාල',
            description: 'ශ්‍රී ලංකාවේ දුම්රිය සේවය නවීකරණය කර ස්වර්ණමය යුගයක් බිහි කළ විශිෂ්ට ඉංජිනේරුවා.',
            historicalInfo: 'බමුණුසිංහආරච්චිගේ දොන් රම්පාල මහතා 1949 දී ලංකා දුම්රිය සේවයේ ප්‍රථම ලාංකික ප්‍රධාන යාන්ත්‍රික ඉංජිනේරු බවට පත් විය. දුම්රිය ඩීසල්කරණය කිරීම, යාල් දේවී, උඩරට මැණිකේ සහ රුහුණු කුමාරි වැනි සීඝ්‍රගාමී දුම්රිය හඳුන්වා දීම එතුමා අතින් සිදු විය. 1955-1970 කාලය ලංකා දුම්රිය සේවයේ ස්වර්ණමය යුගය ලෙස සැලකේ.',
            timeline: [
              { year: '1931 AD', title: 'දුම්රිය සේවයට බැඳීම', description: 'විශේෂ ආධුනිකයෙකු ලෙස ලංකා දුම්රිය සේවයට බැඳීම.' },
              { year: '1949 AD', title: 'ප්‍රධාන යාන්ත්‍රික ඉංජිනේරු', description: 'ප්‍රථම ලාංකික ප්‍රධාන යාන්ත්‍රික ඉංජිනේරු ලෙස පත්වීම.' },
              { year: '1955 AD', title: 'දුම්රිය සාමාන්‍යාධිකාරී', description: 'දුම්රිය සාමාන්‍යාධිකාරී ධුරයට පත්වෙමින් දුම්රිය සේවය නවීකරණය කිරීම.' },
              { year: '1956 AD', title: 'ඩීසල් දුම්රිය ඇරඹීම', description: 'වාෂ්ප එන්ජින් වෙනුවට ඩීසල් දුම්රිය එන්ජින් සාර්ථකව හඳුන්වා දීම.' }
            ]
          },
          ta: {
            title: 'பொறியியலாளர் பெ. டி. ரம்பால',
            description: 'இலங்கை புகையிரத சேவையை நவீனமயமாக்கி அதன் பொற்காலத்தை உருவாக்கியவர்.',
            historicalInfo: 'பி. டி. ரம்பால 1931 இல் இலங்கை புகையிரத சேவையில் சேர்ந்தார். 1949 இல் முதன் முதலாக இலங்கையின் பிரதம இயந்திர பொறியியலாளரானார் மற்றும் 1955 இல் பொது மேலாளரானார். அவரது 15 ஆண்டுகால ஆட்சிக்காலம் புகையிரத சேவையின் பொற்காலமாகக் கருதப்படுகிறது. அவர் டீசல் என்ஜின்கள் மற்றும் யாழ்தேவி, உடரட்ட மெனிகே போன்ற புகையிரத சேவைகளை அறிமுகப்படுத்தினார்.',
            timeline: [
              { year: '1931 AD', title: 'புகையிரத சேவை நுழைவு', description: 'இலங்கை புகையிரத சேவையில் சிறப்பு பயிற்சி பெறுநராக சேர்ந்தார்.' },
              { year: '1949 AD', title: 'பிரதம இயந்திர பொறியியலாளர்', description: 'முதல் இலங்கை பிரதம இயந்திர பொறியியலாளராக நியமிக்கப்பட்டார்.' },
              { year: '1955 AD', title: 'புகையிரத பொது மேலாளர்', description: 'பொது மேலாளராக பொறுப்பேற்று, நவீனமயமாக்கலைத் தொடங்கினார்.' },
              { year: '1956 AD', title: 'டீசல்மயமாக்கல்', description: 'நீராவி என்ஜின்களிலிருந்து டீசல் என்ஜின்களுக்கான மாற்றத்தை வெற்றிகரமாக மேற்கொண்டார்.' }
            ]
          }
        }
      },
      {
        _id: new mongoose.Types.ObjectId('65d75b0a66f50b2984950028'),
        title: 'Eng. A. N. S. Kulasinghe',
        description: 'The pioneer of pre-stressed concrete and maritime structural engineering in Sri Lanka.',
        historicalInfo: 'Arumadura Nandasena de Silva Kulasinghe obtained a BSc (London) in 1933 and qualified for membership in civil and mechanical engineering institutions. He pioneered the use of pre-stressed concrete in Sri Lanka, developing the CPC Kulasinghe System of Pre-stressing. He was responsible for the design and construction of the Colombo Planetarium, Colombo Port, the Kalutara Chaitya (hollow dome), the Sambuddha Jayanthi Chaitya, and the Kothmale Maha Seya, obtaining 24 patents.',
        timeline: [
          { year: '1919 AD', title: 'Birth of Kulasinghe', description: 'Born in Sri Lanka, showing early mechanical and mathematical aptitude.' },
          { year: '1946 AD', title: 'Professional Engineering Status', description: 'Obtained membership in UK civil and mechanical engineering institutions.' },
          { year: '1960s AD', title: 'Landmark Constructions', description: 'Designed and built the Colombo Planetarium and Kalutara Chaitya hollow dome.' },
          { year: '2005 AD', title: 'State Honors', description: 'Passed away and was accorded a state funeral for his lifelong engineering contributions.' }
        ],
        images: [
          'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&q=80&w=600'
        ],
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        videoUrl: '',
        categoryId: categories[3]._id,
        galleryId: galleries[1]._id,
        museumId: colomboMuseum._id,
        qrCodeUrl: '/uploads/qr-kulasinghe.png',
        relatedArtifacts: [],
        translations: {
          si: {
            title: 'ඉංජිනේරු ඒ. එන්. එස්. කුලසිංහ',
            description: 'පෙරසවි කොන්ක්‍රීට් තාක්ෂණය සහ සාගර ඉංජිනේරු විද්‍යාවේ ශ්‍රී ලාංකික පුරෝගාමියා.',
            historicalInfo: 'අරුමදුර නන්දසේන ද සිල්වා කුලසිංහ මහතා පෙරසවි කොන්ක්‍රීට් තාක්ෂණය ලංකාවට හඳුන්වා දුන් අතර පේටන්ට් බලපත්‍ර 24ක් හිමിക്കර ගත්තේය. කොළඹ ග්‍රහලෝකාගාරය, කොළඹ වරාය, කළුතර චෛත්‍යය (කුහර ඩෝමය) සහ කොත්මලේ මහා සෑය එතුමාගේ විශිෂ්ට නිර්මාණයන් වේ.',
            timeline: [
              { year: '1919 AD', title: 'කුලසිංහ මහතාගේ උපත', description: 'ශ්‍රී ලංකාවේ උපත ලැබීම.' },
              { year: '1946 AD', title: 'වෘත්තීය ඉංජිනේරු සුදුසුකම්', description: 'එක්සත් රාජධානියේ සිවිල් හා යාන්ත්‍රික ඉංජිනේරු ආයතනවල සාමාජිකත්වය ලබා ගැනීම.' },
              { year: '1960s AD', title: 'සුවිශේෂී ඉදිකිරීම්', description: 'කොළඹ ග්‍රහලෝකාගාරය සහ කළුතර චෛත්‍යය වැනි සුවිශේෂී නිර්මාණ සැලසුම් කර නිමවීම.' },
              { year: '2005 AD', title: 'රාජ්‍ය ගෞරව', description: 'අභාවප්‍රාප්ත වූ එතුමා වෙනුවෙන් රාජ්‍ය අනුග්‍රහය සහිත අවමංගල්‍ය උත්සවයක් පැවැත්වීම.' }
            ]
          },
          ta: {
            title: 'பொறியியலாளர் ஏ. என். எஸ். குலசிங்க',
            description: 'இலங்கையில் முன்கூட்டியே வார்க்கப்பட்ட காங்கிரீட் தொழில்நுட்பத்தின் முன்னோடி.',
            historicalInfo: 'ஏ. என். எஸ். குலசிங்க லண்டனில் பொறியியல் பட்டம் பெற்றார். அவர் இலங்கையில் முன்கூட்டியே வார்க்கப்பட்ட காங்கிரீட் பயன்பாட்டின் முன்னோடியாக விளங்கினார். கொழும்பு கோளரங்கம், கொழும்பு துறைமுகம், களுத்துறை சைத்யா (வெற்று குவிமாடம்) போன்றவற்றைออกแบบத்து 24 காப்புரிமைகளைப் பெற்றார்.',
            timeline: [
              { year: '1919 AD', title: 'குலசிங்கவின் பிறப்பு', description: 'இலங்கையில் பிறந்து, ஆரம்பத்திலிருந்தே பொறியியல் ஆர்வம் கொண்டவர்.' },
              { year: '1946 AD', title: 'தொழில்முறை பொறியியலாளர் தகுதி', description: 'பிரிட்டனின் சிவில் மற்றும் இயந்திர பொறியியல் நிறுவனங்களின் உறுப்பினர் தகுதியைப் பெற்றார்.' },
              { year: '1960s AD', title: 'மைல்கல் கட்டுமானங்கள்', description: 'கொழும்பு கோளரங்கம் மற்றும் களுத்துறை சைத்யாவின் வெற்று குவிமாடம் ஆகியவற்றை வடிவமைத்துக் கட்டினார்.' },
              { year: '2005 AD', title: 'அரச மரியாதை', description: 'அவரது வாழ்நாள் பொறியியல் பங்களிப்புகளுக்காக அரச மரியாதையுடன் இறுதிச் சடங்குகள் நடத்தப்பட்டன.' }
            ]
          }
        }
      }
    ]);

    // Cross-link related artifacts using their fixed ObjectIds
    exhibits[0].relatedArtifacts.push(exhibits[1]._id);
    exhibits[1].relatedArtifacts.push(exhibits[0]._id);
    exhibits[2].relatedArtifacts.push(exhibits[3]._id);
    exhibits[2].relatedArtifacts.push(exhibits[4]._id);
    exhibits[3].relatedArtifacts.push(exhibits[2]._id);
    exhibits[3].relatedArtifacts.push(exhibits[4]._id);
    exhibits[4].relatedArtifacts.push(exhibits[2]._id);
    exhibits[4].relatedArtifacts.push(exhibits[3]._id);

    exhibits[5].relatedArtifacts.push(exhibits[6]._id);
    exhibits[5].relatedArtifacts.push(exhibits[7]._id);
    exhibits[6].relatedArtifacts.push(exhibits[5]._id);
    exhibits[6].relatedArtifacts.push(exhibits[7]._id);
    exhibits[7].relatedArtifacts.push(exhibits[5]._id);
    exhibits[7].relatedArtifacts.push(exhibits[6]._id);

    await exhibits[0].save();
    await exhibits[1].save();
    await exhibits[2].save();
    await exhibits[3].save();
    await exhibits[4].save();
    await exhibits[5].save();
    await exhibits[6].save();
    await exhibits[7].save();

    console.log('Exhibits seeded.');

    // 6. Seed Quiz questions and Quizzes (with explicit ObjectIds)
    const q1 = await QuizQuestion.create({
      _id: new mongoose.Types.ObjectId('65d75d0d66f50b2984950041'),
      text: 'Which natural force powered the ancient steel smelting furnaces of Samanalawewa?',
      type: 'multiple-choice',
      options: ['Water power', 'Monsoon winds', 'Solar heat', 'Geothermal steam'],
      correctAnswer: 'Monsoon winds',
      points: 10
    });

    const q2 = await QuizQuestion.create({
      _id: new mongoose.Types.ObjectId('65d75d0d66f50b2984950042'),
      text: 'Where was the hydrostatic Elephant Lamp (Ath Pahana) discovered?',
      type: 'multiple-choice',
      options: ['Dedigama', 'Sigiriya', 'Anuradhapura', 'Polonnaruwa'],
      correctAnswer: 'Dedigama',
      points: 10
    });

    const q3 = await QuizQuestion.create({
      _id: new mongoose.Types.ObjectId('65d75d0d66f50b2984950043'),
      text: 'What is the primary function of a Bisokotuwa in ancient Sri Lankan reservoirs?',
      type: 'multiple-choice',
      options: ['To filter drinking water', 'To regulate water release and prevent erosion', 'To breed fresh-water fish', 'To measure water volume'],
      correctAnswer: 'To regulate water release and prevent erosion',
      points: 10
    });

    const quiz1 = await Quiz.create({
      _id: new mongoose.Types.ObjectId('65d75c0f66f50b2984950031'),
      title: 'Ancient Engineering Heritage',
      description: 'Test your knowledge on ancient Sri Lankan metallurgy, hydraulics, and stupa architecture.',
      difficulty: 'medium',
      pointsReward: 50,
      museumId: colomboMuseum._id,
      galleryId: galleries[0]._id,
      questions: [q1._id, q2._id, q3._id]
    });

    // Quiz 2: Modern Engineering Pioneers
    const q4 = await QuizQuestion.create({
      _id: new mongoose.Types.ObjectId('65d75d0d66f50b2984950044'),
      text: 'Who is recognized as the \'Father of Hydro-Electricity\' in Sri Lanka?',
      type: 'multiple-choice',
      options: ['B. D. Rampala', 'A. N. S. Kulasinghe', 'D. J. Wimalasurendra', 'Dr. Ray Wijewardene'],
      correctAnswer: 'D. J. Wimalasurendra',
      points: 15
    });

    const q5 = await QuizQuestion.create({
      _id: new mongoose.Types.ObjectId('65d75d0d66f50b2984950045'),
      text: 'Which express train was introduced by Eng. B. D. Rampala during the CGR Golden Era?',
      type: 'multiple-choice',
      options: ['Udarata Menike', 'Yal Devi', 'Ruhunu Kumari', 'All of the above'],
      correctAnswer: 'All of the above',
      points: 15
    });

    const quiz2 = await Quiz.create({
      _id: new mongoose.Types.ObjectId('65d75c0f66f50b2984950032'),
      title: 'Modern Engineering Pioneers',
      description: 'Test your knowledge on the visionaries who built modern Sri Lankan infrastructure and transport.',
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
