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
        exhibitsCount: 8,
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
      }
    ]);

    console.log('Galleries seeded.');

    // 5. Seed Exhibits (with explicit ObjectIds)
    const exhibits = await Exhibit.create([
      {
        _id: new mongoose.Types.ObjectId('65d75b0a66f50b2984950021'),
        title: 'Wind-Powered Steel Smelting',
        description: 'A revolutionary ancient iron smelting system powered by natural monsoon winds.',
        historicalInfo: 'Surveys (in 1988) for the Samanalawewa Hydro Power Project revealed 139 sites relating to iron-working, spanning 2000 years. Of these, a remarkable 77 iron smelting sites were identified located on the exposed western ridges and hill tops and ridges that experience strong desiccating winds during the southwest monsoon. The slag waste found at these sites indicated an unusual furnace design with evidence of many such furnaces at each site: over 40 furnaces were examined at one site alone. There was no recorded evidence of these furnaces prior to this.\n\nThe furnaces had a consistent orientation to the high-velocity monsoon winds from the west. Abundant high grade iron ore and renewable charcoal supplies from Syzygium trees were readily available. The furnace proportions and front wall orientation created a unique wind pressure system that allowed smelting to consistently produce high carbon steel. The system has no other known parallels in ferrous technology.\n\nArchaeological evidence from the 3rd century BC to 1st century AD Samanalawewa furnaces and the 1st century BC to the 3rd century AD Sigiriya furnaces show optimising of the cross-section, and the front wall progressively lengthened to over 2m. The zenith of production was from the 9th to early 11th century AD. There is no archaeological evidence of the industry after that.',
        timeline: [
          { year: '300 BC', title: 'Early Samanalawewa Furnaces', description: 'Evidence of early wind-powered furnaces optimized for wind direction.' },
          { year: '100 BC', title: 'Sigiriya Furnaces', description: 'Optimization of furnace cross-section and lengthening of front walls to over 2m.' },
          { year: '850 AD', title: 'Zenith of Production', description: 'Peak era of high carbon steel production during the 9th to 11th centuries AD.' },
          { year: '1988 AD', title: 'Samanalawewa Survey', description: 'Rediscovery and survey of 139 smelting sites during the Samanalawewa project.' }
        ],
        images: [
          '/uploads/wind-furnace.jpeg'
        ],
        audioUrl: '/uploads/wind-furnace-audio.mp3',
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
            historicalInfo: 'සමනල වැව ජල විදුලි යෝජනා ක්‍රමය සඳහා මූලික මිණුම් කටයුතු (1988 දී ) කිරීමේදී වසර 2000ක් පැරණි යකඩ සම්බන්ධ නිර්මාණ තිබෙන කලාප කලාපීයව ගත් කළ ස්ථාන 139ක් පිළිබඳව තොරතුරු අනාවරණය විය. මෙම සිද්ධි අතරින් විශේෂිතම සිද්ධිය නම් 77ක් හඳුනාගත හැකිවූයේ නිරිත දිග මෝසම් සුළඟ දැඩිව හමන බටහිර කඳු මුදුන් වලය. මෙම ස්ථාන වල එකතු වී ඇති යකඩ අපද්‍රව්‍ය මගින් මෙම ස්ථානයන්හි සුවිශේෂී උදුන් පිහිටුවා ඇති බව පෙනේ. මේ අනුව තනි වැඩබිමක මෙවැනි උදුන් හතළිහකට වැඩි ප්‍රමාණයක් තිබී ඇති බව නිරීක්ෂණය විය. 40 කට වැඩි උදුන් ප්‍රමාණයක් එකී තනි වැඩ බිමකින් සොයා ගත හැකිවිය. මීට පෙර මෙවැනි උදුන් පිළිබඳව වාර්තාගත සාක්ෂි කිසිවක් දක්නට නැත.\n\nනිරිත දිගින් හමන ප්‍රබල මෝසම් සුළඟට ඉදිරියෙන් මුහුණලා බටහිර දිශානුගතව මෙම උදුන් නිර්මාණය කර ඇත. මෙහි උසස් තත්ත්වයේ යකඩ නිධි බහුලව පවතින අතර නැවත ජනනය කළ හැකි දැවමය කාබන් වන දන් ගස්වලින් හෝ (Syzygium) වලින් ලබාගත හැකි විය. උදුනක මිනුම් අතර අනුපාතය සහ එහි ඉදිරිපස බිත්තියේ දිශානතිය මගින් ක්‍රියාත්මක සුවිශේෂී වායුපීඩන පද්ධතියක් ගොඩනැගුන අතර ඒ මගින් යකඩ නිෂ්පාදන ක්‍රියාවලිය අඛණ්ඩව කාබන් ප්‍රමාණාත්මක වානේ නිෂ්පාදනය විය. මීට සමාන යකඩ නිෂ්පාදන ක්‍රමයක් මෙතෙක් හමුවී නැත.\n\nක්‍රි.පූ. 3 වන සියවසේ සිට ක්‍රි.ව. 1 වන සියවස දක්වා කාල පරාසයක තොරතුරු සමනලවැව උදුන් වලින් සහ ක්‍රි.පූ. 1 වන සියවසේ සිට ක්‍රි.ව. 3 වන සියවස දක්වා පැවති සීගිරි උදුන් සම්බන්ධ පුරාවිද්‍යා සාධකවලින් උදුන්වල හරස්කඩ ප්‍රශස්ත බව පෙන්නුම් කරන අතර එහි ඉදිරිපස බිත්තියේ දිග මීටර් 2 ඉක්මවා යන සේ ක්‍රමයෙන් දික් කර ඇති බව පෙනේ. මෙම කාර්මික නිෂ්පාදනයේ ස්වර්ණමය යුගය ලෙසින් සැලකෙන්නේ ක්‍රි.ව. 9 වන සියවසේ සිට 11 වන සියවසේ මුල් කාලය දක්වා වූ යුගයයි. ඉන් පසු කාලවකවානුවේදී මෙම යකඩ තාක්ෂණය පිළිබඳ කිසිඳු පුරාවිද්‍යාත්මක සාක්ෂියක් සාධක හමු වී නැත.',
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
            historicalInfo: 'சமணல நீர்மின் திட்டத்துக்காக 1988இல் மேற்கொள்ளப்பட்ட முன்னாராய்வுகள், 2000 வருடத் தொல்லியற்புடைய 139 இரும்பு வேலைத்தலங்களைக் காட்டின. இவற்றுள் 77, தனித்துவமானவையாக, தென்மேற்குப் பருவப்பெயர்ச்சிக் காலத்தின் வலிய, உலர்த்தும் காற்றுப் படும் மேற்கு நோக்கிய மலை முடிகளிலும், முகடுகளிலும் இருந்தன. அங்கு காணப்பட்ட கழிவுகள், வழமைக்கு மாறான உலை அமைப்பைக் காட்டின. ஒவ்வொரு வேலைத்தளத்திலும் இத்தகைய உலைகள் பல இருந்தன: ஒரு தலத்தில் மட்டும் 40க்கு மேற்பட்ட உலைகள் சோதிக்கப்பட்டன. இதற்கு முன்பு இவ்வுலைகள் பற்றிப் பதிவான சான்று ஏதேனும் இருக்கவில்லை.\n\nஇவ்வுலைகள், ஒரேசீராக, மேற்கிலிருந்து மிக வேகமாக வீசும் பருவக்காற்றை நோக்கியவையாயிருந்தன. பெருமளவு இரும்புத்தாதும் புதுப்பிக்கக்கூடிய சைஸீஜியம் (Syzygium) மரங்களிலிருந்து பெற்ற எரிப்புக் கரியும் இங்கு இலகுவாகக் கிடைக்கக் கூடியவையாயிருந்தன. உலையின் உயர அகல விகிதங்களும் முன் சுவரின் நோக்கு திசையும் உருவாக்கிய தனித்துவமான காற்றமுக்க முறை ஒரேசீரான உயர் கார்பன் உருக்கை உருக்கி வழங்கியது. இரும்புத் தொழில்நுட்பவியலில் இதையொத்த ஏற்பாடெதுவும் இதுவரையும் அறியப்படவில்லை.\n\nகி.மு. 3ம் நூற்றாண்டு முதல் கி.பி. 1ம் நூற்றாண்டு வரையிலான தொல்லியற் சான்றுகளின்படி சமனலவெவ உலைகளினதும் கி.மு. 1ம் நூற்றாண்டு முதல் கி.பி. 3ம் நூற்றாண்டு வரை சீகிரிய உலைகளினதும் வெட்டுமுகம் செம்மையடைந்து, முன் சுவர் படிப்படியாக 2 மீ வரை நீடிக்கப் பெற்றது. கி.பி. 9ம் நூற்றாண்டிலிருந்து கி.பி. 11ம் நூற்றாண்டின் முற்பகுதி வரை உற்பத்தி உச்சமடைந்தது. அதன் பின் இவ்வுற்பத்திமுறை பற்றிய தொல்லியற் சான்று எதுவுமில்லை.',
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
        historicalInfo: 'Shown here is the Elephant Lamp discovered at the Kotavehera in Dedigama, crafted during the reign of King Parakramabahu I (1153 – 1186 AD). For an oil lamp that operates via a wick, the height difference between the burning tip of the wick and the oil level in the reservoir must not be significant. If this height difference becomes too large, oil will stop being drawn up through the wick, causing the wick to burn out. However, storing a substantial amount of oil requires sufficient depth in the container, which would eventually cause the oil level to drop significantly and burn the wick out. Designing a lamp that can hold a large volume of oil without letting the burning surface level drop significantly is a difficult task. The Elephant Lamp clearly demonstrates how masterfully and artistically this engineering challenge was resolved.\n\nOil is stored inside the elephant\'s chamber marked "R" as shown in the diagram. The elephant is detached from the frame, turned upside down, and filled with oil via the tube (P) running through its front leg. When the elephant is repositioned as shown, oil flows out from the genital aperture (O) into the bottom basin (C) containing the wicks. Once the oil level in the basin rises enough to submerge the lower opening of tube (P), air entry into the upper chamber is cut off, creating a partial vacuum (pressure lower than atmospheric pressure) inside the chamber, which halts the oil flow. As a result, the oil basin never overflows. As the oil burns and the level drops, the opening of tube (P) is exposed to air again, resuming the oil flow.\n\nThis maintains a steady, shallow oil level continuously in the wick basin, replenishing oil strictly at the rate it is consumed. This design represents an ingenious method to store a large volume of oil without increasing the depth of the burning tray. Even if the wicks are extinguished, the oil will not overflow. The flow of oil from the aperture stops when the air pressure inside the elephant\'s reservoir drops below atmospheric pressure by an amount equivalent to the hydrostatic pressure exerted by the oil column height (H).',
        timeline: [
          { year: '1153 AD', title: 'Reign of King Parakramabahu I', description: 'The lamp is crafted by royal artisans as a masterclass of artistic and engineering skill.' },
          { year: '1950s AD', title: 'Excavation of Kotavehera', description: 'The unique lamp is excavated from the ruins of the Kotavehera stupa in Dedigama.' }
        ],
        images: [
          '/uploads/ath-pahana-1.jpg',
          '/uploads/ath-pahana-2.jpg'
        ],
        audioUrl: '/uploads/elephant-lamp-audio.mp3',
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
            historicalInfo: 'ඇත් පහණ මෙහි ඇත්තේ පළමුවන පරාක්‍රමබාහු රජතුමා විසින් කළ දැනට දැදිගම ප්‍රදේශයේ පිහිටි කොටවෙහෙරෙන් හමු වූ ඇත් පහණය (ක්‍රි:ව: 1153 - 1186). තිරයක අග තෙල් දැවී ක්‍රියාකෙරෙන පහණක් සඳහා, තෙල් දැවෙන තිරය අග සහ තෙල් බඳුනේ තෙල් මට්ටම අතර උසහි එතරම් වෙනසක් නොතිබිය යුතුය. මේ උස වැඩිවුවහොත් තිරය දිගේ තෙල් ඇදී ඒම නැවතී පහන් තිරය දැවීයනු ඇත. එහෙත් තෙල් සෑහෙන පමණ ගබඩා කිරීමට නම් බඳුනේ සෑහෙන උසකට තෙල් අඩංගු විය යුතුය. එවිට බඳුනේ තෙල් මට්ටම පහළට යත්ම තිරය දැවී යනු ඇත. ඒ අනුව තෙල් මට්ටම එතරම් පහළට නොයන පරිදි විශාල තෙල් ප්‍රමාණයක් එකවර දැමිය හැකි පහණක් නිමැවීම දුෂ්කර කාර්යයකි. මේ දුෂ්කර කාර්යය ඉතා විශිෂ්ට ලෙස, කලාත්මකව ඉටුකර ඇති අයුරු ඇත් පහණෙන් පැහැදිලි වෙයි.\n\nමෙහි තෙල් ගබඩා කෙරෙන්නේ රූපයේ දක්වා ඇති පරිදි "R" නම් ඇත් ගර්භයෙහිය. ඇතා ඇටවුමෙන් ගලවා උඩු යටිකුරු කොට ඉදිරි පාදය ඔස්සේ ඇති බටයෙන් (P) මීට තෙල් ඇතුළු කෙරේ. ඇතා රූපයේ පරිදි තැබූ විට ලිඟුවෙන් (O) තෙල් පහළ ඇති පහන් වැටි සහිත තැටියට (C) වැහේ. දැන් මේ තැටියේ තෙල් මට්ටම (P) බටයේ පහළ කෙළවර වැසී යන පරිදි ඉහළ ගියහොත් ගර්භයට වාතය ඇතුළු වීම නතර වී එහි වායුගෝලයට වඩා අඩු පීඩන තත්ත්වයක් ඇතිවී ලිඟුවෙන් තෙල් වැස්සීම නැවතේ. මේ අනුව තැටියේ තෙල් පිරී උතුරා යන්නේ නැත. තෙල් දැවී මට්ටම පහළ ගොස් "P" බටයේ කෙළවර විවරය විවෘත වූ විට නැවත තෙල් වැස්සීම ඇරඹේ.\n\nමේ අනුව පහන් වැටි සහිත තැටියේ තෙල් මට්ටම නොගැඹුරුව දිගටම පවතින අතර දැවෙන තෙල් ප්‍රමාණය අනුව ඊට තෙල් වැහේ. මේ අනුව එකවර විශාල තෙල් ප්‍රමාණයක් අදාළ පහන් වැටි සහිත බඳුනේ තෙල් ගැඹුර වැඩි නොවන පරිදි ගබඩා කිරීමේ කදිම ක්‍රමයකි මෙය. ඉහත ක්‍රියාවලිය නිසා පහන් වැටි නිවී ගියද තැටියේ තෙල් මට්ටම වැඩි වී උතුරා යන්නේ නැත. ලිඟුවෙන් තෙල් වැස්සීම නතර වන්නේ ඇත් ගර්භයේ වායු පීඩනය වායුගෝලීය පීඩනයට වඩා ඇත් ගර්භයේ තෙල් කඳේ උසට (H) සරිලන පීඩනයකින් අඩු වූ විටය.',
            timeline: [
              { year: '1153 AD', title: 'පළමුවන පරාක්‍රමබාහු රජ යුගය', description: 'කලාත්මක සහ තාක්ෂණික කුසලතා විදහා දක්වමින් රාජකීය ශිල්පීන් විසින් නිමවන ලදී.' },
              { year: '1950s AD', title: 'කොටවෙහෙර කැණීම්', description: 'දැදිගම කොටවෙහෙර ස්තූපයේ කැණීම් කටයුතු වලින් මෙම වටිනා පහන සොයාගැනීම.' }
            ]
          },
          ta: {
            title: 'யானை விளக்கு (ඇත් පහණ)',
            description: 'நீர்ம அழுத்த சமநிலையை பயன்படுத்தி வடிவமைக்கப்பட்ட ஒரு விசித்திரமான விளக்கு.',
            historicalInfo: 'முதலாம் பராக்கிரமபாகு மன்னரின் ஆட்சிக் காலத்தில் (கி.பி. 1153 – 1186) உருவாக்கப்பட்டதும், தெதிகம பகுதியிலுள்ள கொட்டவெஹெர ஸ்தூபியிலிருந்து கண்டெடுக்கப்பட்டதுமான யானை விளக்கு இங்கு காட்டப்பட்டுள்ளது. திரியின் முனையில் எண்ணெய் எரிந்து இயங்கும் ஒரு விளக்கில், திரியின் எரிமுனைக்கும் எண்ணெய் மட்டத்திற்கும் இடையிலான உயர வித்தியாசம் அதிகமாக இருக்கக்கூடாது. இந்த உயரம் அதிகரிக்கும் போது, திரியின் வழியே எண்ணெய் உறிஞ்சப்படுவது நின்று திரி கருகிவிடும். எனினும், போதுமான அளவு எண்ணெயைச் சேமிக்க வேண்டுமாயின் பாத்திரத்தில் ஆழமாக எண்ணெய் நிரப்பப்பட வேண்டும். அவ்வாறு நிரப்பும்போது எண்ணெய் மட்டம் குறையக் குறைய திரி எரிந்துபோகும் அபாயம் ஏற்படும். எனவே, எண்ணெய் மட்டம் அதிகம் குறையாதவாறு அதிகளவு எண்ணெயை ஒரே நேரத்தில் நிரப்பக்கூடிய ஒரு விளக்கை வடிவமைப்பது மிகவும் கடினமான செயலாகும். இந்த சவாலான காரியத்தை மிகச் சிறந்த முறையிலும் கலைநயத்துடனும் தீர்த்துள்ள விதம் இந்த யானை விளக்கின் மூலம் தெளிவாகிறது.\n\nஇங்கு வரைபடத்தில் காட்டப்பட்டுள்ளவாறு "R" எனப்படும் யானையின் உடற்பகுதியினுள் (வயிற்றுப் பகுதி) எண்ணெய் சேமிக்கப்படுகிறது. யானையை அடிப்பாகத்திலிருந்து கழற்றி, தலைகீழாக மாற்றி, அதன் முன் கால் வழியே செல்லும் குழாய் (P) ஊடாக எண்ணெய் நிரப்பப்படுகிறது. யானையை வரைபடத்தில் உள்ளவாறு நிலைநிறுத்தும்போது, அதன் உறுப்புப் பகுதியிலுள்ள புனல் (O) வழியாக எண்ணெய் கீழ் உள்ள திரித்தட்டுக்கு (C) வழிகிறது. தட்டிலுள்ள எண்ணெய் மட்டம் உயர்ந்து, (P) குழாயின் கீழ் முனையை மூடும் போது, வயிற்றுப் பகுதிக்குள் காற்று செல்வது தடைப்பட்டு வளிமண்டல அழுத்தத்தை விடக் குறைந்த காற்றழுத்தம் அங்கு உருவாகிறது. இதனால் எண்ணெய் வழிவது உடனே நின்றுவிடுகிறது. எனவே எண்ணெய் தட்டிலிருந்து வழிந்து வெளியேறுவதில்லை. எண்ணெய் எரிந்து மட்டம் குறையும் போது, (P) குழாயின் திறப்பு மீண்டும் காற்றுடன் தொடர்புகொண்டு எண்ணெய் வழியத் தொடங்கும்.\n\nஇதன் மூலம் தட்டிலுள்ள எண்ணெய் மட்டம் தொடர்ந்து ஒரே சீரான ஆழத்தில் பராமரிக்கப்பட்டு, எரியும் அளவிற்கு ஏற்ப எண்ணெய் நிரப்பப்படுகிறது. ஒரே நேரத்தில் அதிகளவு எண்ணெயைச் சேமித்து வைக்கவும், அதேவேளை எரியும் தட்டின் எண்ணெய் ஆழம் அதிகரிக்காமல் பாதுகாக்கவும் இதுவொரு மிகச் சிறந்த நுட்பமாகும். விளக்கு அணைக்கப்பட்டாலும் கூட எண்ணெய் நிரம்பி வழியாது. யானையின் உடற்பகுதியிலுள்ள காற்றழுத்தமானது, வளிமண்டல அழுத்தத்தை விட எண்ணெய் உயரத்திற்கு (H) சமனான அழுத்த அளவினால் குறையும் போது, எண்ணெய் வழிவது முற்றிலும் நின்றுவிடுகிறது.',
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
        historicalInfo: 'The construction of the colossal Stupa of Jetavana is attributed to King Mahasen [275-301 AD]. It is said to be the biggest Stupa ever built, perhaps anywhere in the Buddhist world, and the third largest building of its time. Its height is given in the Chulavamsa as 160 vadu riyan, which is equivalent to 400 feet (122.0m) if 1 vadu riyana is equivalent to 30 inches, to the tip of its spire, and 370 feet (113.0m) across its base; its present height is estimated to be 252 feet (77.0m). During the archaeological investigations, it has been found that the interior of the Jetavana Stupa is constituted of different materials arranged in different orders.\n\n1. Foundation of the Jetavana Stupa\n2. Basel Rings\n3. Outer Most Part of the Dome\n4. The Zone Next to the Outer Most Part of the Dome\n5. The Interior Zone Consisting of Wall Segments\n6. Central Zone of the Dome\n\nFoundation of the Jetavana Stupa: The bricks used for construction of the foundation were fully burnt full size bricks (46x24x5cm, 43x24x5cm, 42x20x5cm and 38x20x5cm), and this has been started from the bedrock, 7.0m-8.8m (23-29ft.) below the stone terrace. Where the rock surface was not even, it has been leveled using very hard clay layers. A very thin clay mortar has been used as a bonding material between brick layers. The foundation has been constructed in two levels: the 1st level started in a circular manner from the bedrock 1.7m to 2.7m below the original ground level, and the 2nd level started 2.05m inside the outer surface of the 1st level, constructed up to the stone terrace with a height of 3.8m. At a certain place, bricks are arranged in a "T" shape and the surrounding space has been filled with brickbats and a clay/soil mix, with normal stretcher courses above and below this arrangement.\n\nBasel Rings: Unlike in the great stupas such as Ruwanweli Maha Seya and Abhayagiriya, where the basel rings were constructed after the dome, at Jetavana Stupa the basel rings were constructed simultaneously with the dome. Fully burnt bricks measuring 60 x 35 x 5 cm were mainly used, along with additional bricks sized 30 x 20 x 5 cm and 45 x 35 x 5 cm. The basel rings were built upward starting from the stone terrace level, indented 4.05m inward from the outer edge of the foundation.',
        timeline: [
          { year: '276 AD', title: 'Initiation of Jetavana Stupa', description: 'Construction initiated under King Mahasen, mobilizing thousands of artisans.' },
          { year: '301 AD', title: 'Completion of Stupa', description: 'Stupa completed as the tallest brick structure in the ancient world.' },
          { year: '1909 AD', title: 'Archaeological Survey', description: 'Surveys of the ruins confirming the unique foundation construction levels.' }
        ],
        images: [
          '/uploads/jethawanaya-1.jpg',
          '/uploads/jethawanaya-2.jpg'
        ],
        audioUrl: '/uploads/jethawana-audio.mp3',
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
            historicalInfo: 'මහසෙන් රජතුමා විසින් ක්‍රි.ව. 275 - 301 ත් අතර කාලයේ දී ඉදිකරන ලද ජේතවන දාගැබ ලොව විශාලතම ස්තූපය වන අතර, එය ඉදිකරන ලද අවධියේ ලොව තෙවන විශාලතම ඉදිකිරීම විය. එහි උස චූල වංශයේ සඳහන් වන ආකාරයට වඩුරියන් 160 කි. ඒ අනුව වඩු රියනක දිග අඟල් 30 ක් වශයෙන් සැලකුවහොත් එහි උස අඩි 400 (මීටර 122) ක් විය යුතුය. අද එහි කොත් කැරැල්ල දක්වා සලපතල මළුවේ සිට ඇති උස අඩි 252 (මීටර 77) කි. ස්තූපයේ විෂ්කම්භය සලපතල මළුව මට්ටමේ දී අඩි 370 (මීටර 113) කි. දාගැබ ඉදිකිරීමේදී විවිධ ඉදිකිරීමේ ද්‍රව්‍ය විවිධාකාරයෙන් පෙල ගැස්වීමක් දක්නට ලැබේ.\n\n01 ස්තූපයේ අත්තිවාරම\n02 පේසාව ඉදිකිරීම\n03 ගර්භයේ පිටතම කලාපය\n04 ගර්භයේ පිටතම ස්ථරයට ඇතුලින් ඊට ආසන්නයේ ඇති කලාපය\n05 පිටත ස්ථරයට ඇතුලින් ඇති හරස් බැමි සහිත කලාපය\n06 ගර්භය මැද කලාපය\n\nස්තූපයේ අත්තිවාරම: සලපතල මළුවේ සිට මීටර 7 - 8.8 (අඩි 23 - 29) දක්වා පොළව අභ්‍යන්තරයේ පිහිටි ගලේ සිට අත්තිවාරම ඉදිකිරීම් අරඹා ඇත. ඒ සඳහා මනාව පුළුස්සන ලද පැතලි ශක්තිමත් විවිධ දිග පළල සහිත ගඩොල් (සෙ.මී. 46 x 24 x 5, සෙ.මී. 43 x 24 x 5, සෙ.මී. 42 x 20 x 5 සහ සෙ.මී. 38 x 20 x 5) භාවිතා කර ඇත. පිහිටි ගලේ සමතලා නොවන තැන් සමතලා කිරීම සඳහා ශක්තිමත් මැටි වර්‍ගයක් භාවිතා කර ඇත. අත්තිවාරම ඉදි කිරීම අදියර දෙකකින් සිදුකර ඇත. පළමු අදියර පිහිටි ගලෙන් පටන් ගෙන මීටර 1.7 - 2.7 අතර උසට එනම් මළුව බිම් දක්වා රවුම් හැඩයට ඉදිකර, දෙවන අදියර එතැන් පටන් මීටර 2.05 ක් ඇතුලට වන්නට පටන් ගෙන සලපතල මළුව මට්ටම දක්වා තවත් මීටර 3.80 ක් උසට ඉදිකර ඇත. එක් තැනක ගඩොල් පේලිය ඉංග්‍රීසි "T" අකුරේ හැඩයට බෙදා ඒ අතර පස්, මැටි සහ කුඩා ගඩොල් කැබිලි සහිත සංයුතියකින් පුරවා ඇත. එම පේලියට ඉහලින් සහ පහලින් සාමාන්‍ය බඩ ගඩොල් ආකාරයට බැඳ ඇත.\n\nපේසාව ඉදිකිරීම: රුවන්වැලි මහා සෑය, අභයගිරිය වැනි මහා ස්තූප වල පේසාව, ගර්භය ඉදිකිරීමෙන් පසුව සිදු කර ඇතත් ජේතවන දාගැබ ඉදිකිරීමේ දී ගර්භය ඉදිකිරීමට සමගාමීව පේසාව ඉදිකිරීම ද සිදු කර ඇත. මනාව පුළුස්සන ලද සෙ.මී. 60 x 35 x 5 ප්‍රමාණයේ ගඩොල් බහුල වශයෙන් ද, සෙ.මී. 30 x 20 x 5 හා සෙ.මී. 45 x 35 x 5 ප්‍රමාණයේ ගඩොල් අමතර වශයෙන් ද මේ සඳහා යොදා ගෙන ඇත. අත්තිවාරමේ පිටත දාරයට මීටර් 4.05 ක් ඇතුලට වන්නට සලපතල මළුව මට්ටමේ සිට ඉහලට පේසාව ඉදිකර ඇත.',
            timeline: [
              { year: '276 AD', title: 'ජේතවන ඉදිකිරීම් ඇරඹීම', description: 'මහසෙන් රජුගේ නියෝගයෙන් දහස් ගණන් ශිල්පීන් සමඟ ස්තූපයේ වැඩ ඇරඹීම.' },
              { year: '301 AD', title: 'ස්තූපය නිම කිරීම', description: 'පුරාණ ලෝකයේ උසම ගඩොල් ඉදිකිරීම් ලෙස මහා ස්තූපයේ වැඩ අවසන් වීම.' },
              { year: '1909 AD', title: 'පුරාවිද්‍යා සමීක්ෂණ', description: 'ස්තූපයේ අත්තිවාරම් මට්ටම් සහ ගඩොල් ප්‍රමාණයන් පිළිබඳව විද්‍යාත්මකව තහවුරු කරගැනීම.' }
            ]
          },
          ta: {
            title: 'ஜேதவன தூபி (ஜேதவனாராமய)',
            description: 'பண்டைய உலகின் மிகப்பெரிய செங்கல் கட்டிடம் மற்றும் அதன் கட்டமைப்பு பொறியியல்.',
            historicalInfo: 'ஜேதவன தூபி என்னும் பிரம்மாண்டமான கட்டுமானம் மகாஸேன மன்னனால் (275-301 கி.பி.) கட்டப்பட்டதாக அறியப்படுகிறது. பௌத்தம் பரவிய நாடுகளிற் கட்டப்பட்ட தூபிகளுள் மிகப்பெரியதென்றும் கட்டிய காலத்தில் உலகின் கட்டிடங்களில் அளவில் மூன்றாவதுமெனவும் சொல்லப் படுகிறது. சூலவம்ஸத்தில் அதன் உயரம் 160 "வடு ரியன்" எனத் தரப்பட்டுள்ளது. ஒரு "வடு ரியன்" 30 அங்குலமாயின், நுனி வரையிலான உயரம் 400 அடி (122 மீ) எனவும் தளத்துக்குக் குறுக்காக அகலம் 370 அடி (113 மீ) எனவும் அமையும். அதன் இப்போதைய உயரம் 252 அடி (77 மீ) என மதிப்பிடப்பட்டுள்ளது. தொல்லியல் ஆராய்ச்சிகளின் போது, ஜேதவன தூபியின் உட்புறம் வெவ்வேறு வரிசைமுறைகளில் அடுக்கப்பட்ட வெவ்வேறு மூலப்பொருட்களால் ஆனதெனக் கண்டுபிடிக்கப்பட்டுள்ளது.\n\n01 ஜேதவன தூபியின் அத்திவாரம்\n02 அடி வளையங்கள்\n03 குவிமாடத்தின் வெளிப்புறக் கட்டமைப்பு\n04 குவிமாடத்தின் வெளிப்புறக் கட்டமைப்பை அடுத்த வலயம்\n05 சுவர்ந் துண்டங்கள் உள்ள உட்புறக் கட்டமைப்பு\n06 குவிமாடத்தின் மத்திய வலயம்\n\nஅத்திவாரம்: தூபியின் அத்திவாரம் அமைப்பதற்கு, முற்றாகச் சுடப்பட்ட முழு அளவுச் செங்கற்கள் (46X24X5 செ.மீ, 43X24X5 செ.மீ, 42X20X5 செ.மீ, 38X20X5 செ.மீ.) பயன்பட்டுள்ளன. கல் முகப்புமேடைக்குக் கீழே 23-29 அடி ஆழத்திலிருந்த அடிநிலப்பாறையிலிருந்து தொடங்கி அவை உபயோகிக்கப்பட்டுள்ளன. சீரற்ற அடிநிலப்பாறை மிகக்கெட்டியான களிமண் அடுக்குகளால் மட்டப்படுத்தப்பட்டுள்ளது. செங்கல் அடுக்குகளிடையே பிணைப்பு மூலப்பொருளாக மிக மெல்லிய களிமண் சாந்து பயன்பட்டது. அத்திவாரம் இரு மட்டங்களிற் கட்டப்பட்டுள்ளது. முதலாம் மட்டம், கட்டப்பட்ட காலத்துத் தரைமட்டத்திலிருந்து 1.7-2.7 மீ ஆழத்தில் அடிநிலப்பாறையிலிருந்து வட்டவடிவமாகத் தொடங்குகிறது. இரண்டாம் மட்டம், முதலாமவதின் வெளி எல்லையினின்று 2.05 மீற்றர் உள்ளாகத் தொடங்கி, 3.8 மீ உயரத்துக்குக் கல் முகப்புமேடை வரை கட்டப்பட்டுள்ளது. ஓரிடத்தில் செங்கற்கள் "T" வடிவத்தில் அடுக்கப்பட்டுச் சூழவுள்ள பகுதி, உடைந்த செங்கற்கட்டிகளும் களிமண்ணுஞ் சேர்ந்த கலவையால் நிரப்பப்பட்டிருக்கிறது. அதற்கு மேலும் கீழும் செங்கல் அடுக்குக்கள் வழமையான நீளவாட்டு வரி அடுக்குகளாம்.\n\nஅடி வளையங்கள்: அடி வளையங்கள் அத்திவாரத்தின் தொடர்ச்சியாகக் கட்டப்பட்டுள்ளன. மாறாக, அபயகிரி, ருவன்வெலி மகாசேய போன்ற மாபெரும் தூபிகள் குவிமாடத்தைக் கட்டிய பின்பு கட்டப்பட்டவை. (இங்கு) அவை, அத்திவாரத்தின் இரண்டாம் மட்டத்திற்கு மேல் எழுப்பப்பட்டுள்ளன. முற்றாகச் சுடப்பட்ட 60x35x5 செ.மீ. முழு அளவுடைய செங்கற்கள் பயன்பட்டுள்ளன.',
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
        title: 'Sigiriya',
        description: 'An ancient rock fortress showcasing sophisticated water management engineering and one of Asia\'s earliest landscaped gardens.',
        historicalInfo: 'Water Management Technology\n\nSigiriya is well known for its water management systems. The main problem encountered during the design of a water garden system would have been sourcing of the required amount of water throughout the year. Accordingly, Sigiriya Engineers constructed collection ponds in strategic locations, to retain the rain water.\n\nPonds and water retaining structures thus constructed were:\n1. One large pond and two small ponds at the summit\n2. A large "Geliya" to convey excess water to the pond at the south-west end\n3. Octagonal pond\n4. Ponds in water garden\n5. The outer moat\n\nThe water retained in the above facilities had been meticulously arranged to feed the following: the Palace complex, Garden No. 3, Garden No. 2, Garden No. 1, the Micro Water Garden and the Inner Moat.\n\nPlanning and Landscaping Technology\n\nFrom the remains of the ruins, it could be decided that the site plan was according to a fixed measuring system. Overall lengths, widths and inter structural relationships are denoting a specific space pattern. Therefore Sigiriya could be categorized as an ancient planned city.\n\nThe Sigiri gardens are unique, being the earliest landscaped gardens in Asia. Their most distinctive feature is the combination of symmetrical or geometrical elements with asymmetrical or organic elements, and its use of micro-hydraulic and rock-associated architecture.\n\nThe basic geometrical pattern followed in Sigiriya space planning is the rectangular shape. The entire city is oriented in the East-West direction in a span of 1500m (approximately), with a width in the North-South direction of 1000m (approximately). The center-line running through the east and west entrance gates divides the city into two symmetrical parts. This would have been the datum line used by ancient Sigiriya engineers when planning the city.\n\nConsidering these facts, it is evident that Sigiriya is a site depicting our ancient engineering ingenuity across many branches such as water management, construction and landscape planning.',
        timeline: [
          { year: '477 AD', title: 'Reign of King Kasyapa Begins', description: 'Construction of the rock fortress, palace and water gardens commences under King Kasyapa I.' },
          { year: '495 AD', title: 'End of the Royal Capital', description: 'Following King Kasyapa\'s death, Sigiriya ceases to function as the capital and is later used as a monastery.' },
          { year: '1831 AD', title: 'Rediscovery by British Surveyors', description: 'The overgrown rock fortress is brought to wider attention during British colonial surveys.' },
          { year: '1982 AD', title: 'UNESCO World Heritage Site', description: 'Sigiriya is designated a UNESCO World Heritage Site in recognition of its engineering and artistic legacy.' }
        ],
        images: [
          '/uploads/sigiriya-1.png',
          '/uploads/sigiriya-2.png'
        ],
        audioUrl: '/uploads/sigiriya-audio.mp3',
        videoUrl: '',
        categoryId: categories[1]._id,
        galleryId: galleries[0]._id,
        museumId: colomboMuseum._id,
        qrCodeUrl: '/uploads/qr-sigiriya.png',
        relatedArtifacts: [],
        translations: {
          si: {
            title: 'සීගිරිය',
            description: 'සූක්ෂම ජල කළමනාකරණ ඉංජිනේරු විද්‍යාවක් හා ආසියාවේ පැරණිතම භූ දර්ශන උද්‍යානයක් විදහා දක්වන පුරාණ ගිරි දුර්ගයකි.',
            historicalInfo: 'ජල කළමනාකරණ තාක්ෂණය\n\nසීගිරිය එහි ජල කළමනාකරණය පිළිබඳ ප්‍රසිද්ධියක් උසුලයි. ජල උද්‍යාන සැලසුම්කරණයේදී, මුළු අවුරුද්දේ පුරාම අවශ්‍ය ජල ප්‍රමාණය සපයාගැනීමේ ගැටලුව ප්‍රධාන වශයෙන් මතුවන්නට ඇත. ඒ සඳහා සීගිරි ඉංජිනේරුවන් විසින් වැසි ජලය රැස්කර තබා ගැනීම සඳහා උපායමාර්ගික ස්ථානවල පොකුණු ඉදිකරන ලදි.\n\nමෙසේ ඉදිකරන ලද ජලය රඳවන ස්ථාන සහ ඉදිකිරීම් පහත පරිදි වේ:\n1. මුදුනෙහි එක් විශාල පොකුණක් සහ කුඩා පොකුණු දෙකක්\n2. අතිරික්ත ජලය නිරිතදිග කෙළවරේ පිහිටි විශාල පොකුණට යොමුකරන සුවිසල් ගැලියක්\n3. අෂ්ටාශ්‍ර පොකුණ\n4. ජල උද්‍යාන වල පොකුණු\n5. පිටත දිය අගල\n\nඉහත ස්ථානවලින් රැස්කර ගත් ජලයෙන් ක්‍රමානුකූලව මාළිගා සංකීර්ණය, උද්‍යාන අංක 03, උද්‍යාන අංක 02, උද්‍යාන අංක 01, ක්ෂුද්‍ර ජල උද්‍යානය සහ ඇතුළු දිය අගල වෙත ජලය සැපයීම සිදුකරන ලදී.\n\nසැලසුම්කරණය හා භූමි දර්ශන තාක්ෂණය\n\nදැනට ඇති නටබුන් වලින් පෙනී යන්නේ සීගිරිය නියමිත මිනුම් පද්ධතියකට අනුව නිර්මාණය කර ඇති බවය. සමස්ත දිග, පළල හා ගොඩනැගිලි අතර සම්බන්ධතාවය විශේෂ වූ අවකාශ රටාවක් දක්වයි. එම නිසා සීගිරිය පුරාණ සැලසුම් කරන ලද නගරයක් ලෙස වර්ගීකරණය කළ හැක.\n\nආසියාවේ දක්නට ලැබෙන පැරණිතම භූමි දර්ශන උද්‍යාන ලෙස සීගිරි උද්‍යාන හැඳින්විය හැක. සීගිරි උද්‍යාන වල විශේෂීම ලක්ෂණය වන්නේ, සමමිතික හා ජ්‍යාමිතික හැඩතල, අසමමිතික හා ස්වභාවික හැඩතල සමග මැනවින් සංයෝජනය කර තිබීමයි. මීට අමතරව ක්ෂුද්‍ර ජල විද්‍යාව හා පාෂාණ ආශ්‍රිත ගෘහ නිර්මාණ ශිල්පය ද විශේෂ ලක්ෂණයක් වේ.\n\nසීගිරියේ අවකාශීය සැලසුම්කරණයේ දී මූලික ජ්‍යාමිතික රටාව ලෙස සෘජුකෝණාශ්‍රය භාවිත කර ඇත. මුළු නගරයම නැගෙනහිර - බටහිර දිශා ඔස්සේ මීටර් 1500 ක (ආසන්න වශයෙන්) පමණ කලාපයක පැතිර පවති. එහි උතුරු - දකුණු පළල මීටර් 1000 ක් (ආසන්න වශයෙන්) පමණ වේ. නැගෙනහිර - බටහිර පිවිසුම් දොරටු හරහා ගමන් කරන මධ්‍ය රේඛාව නගරය සමමිතික කොටස් දෙකකට බෙදයි.',
            timeline: [
              { year: '477 AD', title: 'කාශ්‍යප රජුගේ පාලන සමය', description: 'කාශ්‍යප රජු යටතේ ගිරි දුර්ගය, මාළිගය සහ ජල උද්‍යාන ඉදිකිරීම ආරම්භ වේ.' },
              { year: '495 AD', title: 'රාජධානියේ අවසානය', description: 'කාශ්‍යප රජුගේ මරණයෙන් පසු සීගිරිය අගනුවර ලෙස කටයුතු කිරීම නවතී, පසුව එය ආරාමයක් ලෙස භාවිත වේ.' },
              { year: '1831 AD', title: 'බ්‍රිතාන්‍ය සමීක්ෂකයන් විසින් නැවත සොයාගැනීම', description: 'බ්‍රිතාන්‍ය යටත් විජිත සමීක්ෂණ අතරතුර වැඩුණු ලැව්පඳුරු මධ්‍යයේ ගිරි දුර්ගය අවධානයට ලක් වේ.' },
              { year: '1982 AD', title: 'යුනෙස්කෝ ලෝක උරුම ස්ථානය', description: 'එහි ඉංජිනේරු හා කලාත්මක උරුමය පිළිගනිමින් සීගිරිය යුනෙස්කෝ ලෝක උරුම ස්ථානයක් ලෙස නම් කරනු ලැබේ.' }
            ]
          },
          ta: {
            title: 'சீகிரியா',
            description: 'நுட்பமான நீர் முகாமைத்துவப் பொறியியலையும் ஆசியாவின் மிகப் பழமையான நிலக்காட்சிப் பூங்காக்களில் ஒன்றையும் வெளிப்படுத்தும் பண்டைய பாறைக் கோட்டை.',
            historicalInfo: 'நீர் முகாமைத்துவத் தொழில்நுட்பம்\n\nசீகிரியா அதன் நீர் முகாமைத்துவத் திட்டத்திற்காகப் புகழ்பெற்றதாகும். நீர்ப்பூங்கா முகைமைப்பை வடிவமைக்கையில், வருடம் முழுவதும் தேவையான நீரைப் பெறுதல் முக்கியப் பிரச்சினையாக இருந்திருக்கும். அதற்கமைய, சீகிரியப் பொறியியலாளர்கள் மழை நீரைச் சேகரிக்கும் தடாகங்களை மூலோபாயமான இடங்களில் கட்டினர்.\n\nஇவ்வாறு கட்டப்பட்ட தடாகங்களும் நீர் தேக்கும் அமைப்புக்களும் பின்வருமாறு:\n1. சிகரத்தில் ஒரு பெரிய தடாகமும் இரு சிறிய தடாகங்களும்\n2. மேலதிக நீரைத் தென்மேற்கிலுள்ள தடாகத்துக்குச் செலுத்தும் பெரியதொரு கான் அமைப்பு\n3. எண்கோணத் தடாகம்\n4. நீர்ப்பூங்காவிலுள்ள தடாகங்கள்\n5. வெளி அகழி\n\nமேற்கூறிய வழிகளில் தேக்கிய நீரானது அரண்மனைத் தொகுதி, 3வது பூங்கா, 2வது பூங்கா, 1வது பூங்கா, சிற்றளவு நீர்ப் பூங்கா மற்றும் உள் அகழி ஆகியவற்றிற்கு ஒழுங்கான முறையில் விநியோகிக்கப்பட்டது.\n\nதிட்டமிடல், நிலக்காட்சி அமைப்புத் தொழில்நுட்பம்\n\nநகர அமைப்பு திட்டமிடலான ஒரு அளவைமுறைக்கிணங்க அமைந்துள்ளதென்பது எஞ்சியுள்ள சிதைவுகளின் எச்சங்களிலிருந்து தீர்மானிக்கக்கூடியது. ஒட்டுமொத்த நீளங்களும் அகலங்களும் அமைப்புக்களுக்கிடையிலான உறவுகளும் குறிப்பான இடைவெளிக் கோலத்தைக் குறிக்கின்றன. எனவே சீகிரியாவைத் திட்டமிடப்பட்ட புராதன நகரமாக வகைப்படுத்த முடியும்.\n\nஆசியாவின் ஆதி அமைப்பான பூங்காக்களில் மிக முக்கியமானது என்ற வகையில் சீகிரியப் பூங்காக்கள் தனித்துவமானவை. இதற்காதாரமான மிகத் தெளிவான சான்று ஒத்தமைந்த சமச்சீரான அல்லது வடிவியல் கூறுகள் சமச்சீரற்ற அல்லது உயிரியற்பொருட்களுடனான கூறுகளுடன் இணைக்கப்பட்டுள்ளமையும் நுண் நீரியல், பாறைத் தொடர்புள்ள கட்டிடக்கலைகளைப் பயன்படுத்தியுள்ளமையுமே அதன் தனித்துவமான பண்புகளாகும்.\n\nசீகிரியாவின் இடப்பரப்புத் திட்டமிடலிற் பின்பற்றப்பட்ட அடிப்படையான வடிவியல் செவ்வக வடிவமாகும். முழு நகரமுமே கிழக்கு-மேற்காக ஏறத்தாழ 1500 மீற்றர் நீளத்தில் அமைக்கப்பட்டுள்ளது. அதன் அகலம் வடக்கு-தெற்காக ஏறத்தாழ 1000 மீற்றராகும். கிழக்கு, மேற்கு நுழைவாயில்களின் ஊடாகச் செல்லும் மையக்கோடு, நகரத்தை சமச்சீரான இரு பகுதிகளாகப் பிரிக்கிறது.',
            timeline: [
              { year: '477 AD', title: 'காசியப்ப மன்னரின் ஆட்சி தொடக்கம்', description: 'காசியப்ப மன்னரின் கீழ் பாறைக் கோட்டை, அரண்மனை மற்றும் நீர்ப்பூங்காக்களின் கட்டுமானம் தொடங்குகிறது.' },
              { year: '495 AD', title: 'அரச தலைநகர் முடிவு', description: 'காசியப்பரின் மரணத்தை அடுத்து சீகிரியா தலைநகராகச் செயல்படுவதை நிறுத்தி, பின்னர் ஒரு துறவற மையமாகப் பயன்படுத்தப்படுகிறது.' },
              { year: '1831 AD', title: 'பிரித்தானிய அளவையாளர்களால் மீள்கண்டுபிடிப்பு', description: 'பிரித்தானிய காலனித்துவ அளவையியல் பணிகளின் போது புதரால் மூடப்பட்டிருந்த பாறைக் கோட்டை மீண்டும் கவனத்திற்கு வருகிறது.' },
              { year: '1982 AD', title: 'யுனெஸ்கோ உலக பாரம்பரிய தளம்', description: 'அதன் பொறியியல் மற்றும் கலைப் பாரம்பரியத்தை அங்கீகரித்து சீகிரியா யுனெஸ்கோ உலக பாரம்பரியத் தளமாக அறிவிக்கப்படுகிறது.' }
            ]
          }
        }
      },
      {
        _id: new mongoose.Types.ObjectId('65d75b0a66f50b2984950025'),
        title: 'Eng. Bamunusinghearachchige Don Rampala',
        description: 'Pioneering Sri Lankan railway engineer who modernized the Ceylon Government Railway during its "Golden Era".',
        historicalInfo: 'Bamunusinghearachchige Don Rampala, educated at Ananda and Nalanda Colleges, Colombo, and the Colombo University College (1928–1930) joined the Ceylon Government Railway (CGR) as a Special Apprentice in 1931. He obtained a BSc (London) externally in 1933. He underwent practical training at the Great Indian Peninsula Railway (1934-1936), and qualified for Associate Membership of the Institution of Mechanical Engineers in 1935.\n\nHe was the first Sri Lankan to become Chief Mechanical Engineer, CGR (1949) and General Manager of Railways (1955). His 15 year tenure as GMR is considered the \'Golden Era of the CGR\'.\n\nHe introduced observation cars, 55 ft long coaches, Diesel locomotives and the long distance express trains, Yal Devi, Udarata Menike and Ruhunu Kumari, and drove the latter to Matara on its first voyage.\n\nHe achieved many firsts, building \'Diesel Shunting Locomotives\' locally, introducing \'Colour Lights Signalling with Centralised Traffic Control\' and installing a network of \'Radio Transreceivers\'.\n\nHe was appointed a Member of the Order of the British Empire (MBE) - a rare honour, by King George VI (1952). In 1956, his paper on "Diesel Electric Traction in Ceylon" presented to the Institution of Locomotive Engineers, UK was awarded. He served as the President of the Institution of Engineers, Ceylon (1958–1959) and passed away in 1994 at the age of 84.',
        timeline: [
          { year: '1931 AD', title: 'Joins the Ceylon Government Railway', description: 'Begins his career as a Special Apprentice with the Ceylon Government Railway (CGR).' },
          { year: '1949 AD', title: 'First Sri Lankan Chief Mechanical Engineer', description: 'Becomes the first Sri Lankan to be appointed Chief Mechanical Engineer of the CGR.' },
          { year: '1952 AD', title: 'Appointed MBE', description: 'Honoured as a Member of the Order of the British Empire by King George VI.' },
          { year: '1955 AD', title: 'General Manager of Railways', description: 'Appointed General Manager, ushering in the 15-year "Golden Era of the CGR".' },
          { year: '1994 AD', title: 'Passing', description: 'Passed away at the age of 84, leaving behind a legacy of railway modernization.' }
        ],
        images: [
          '/uploads/rampala-1.jpg'
        ],
        audioUrl: '/uploads/rampala-audio.mp3',
        videoUrl: '',
        categoryId: categories[3]._id,
        galleryId: galleries[0]._id,
        museumId: colomboMuseum._id,
        qrCodeUrl: '/uploads/qr-rampala.png',
        relatedArtifacts: [],
        translations: {
          si: {
            title: 'ඉංජිනේරු බමුණුසිංහආරච්චිගේ දොන් රම්පාල',
            description: 'ලංකා දුම්රිය සේවයේ "ස්වර්ණමය යුගය" නිර්මාණය කළ පුරෝගාමී ශ්‍රී ලාංකික යාන්ත්‍රික ඉංජිනේරුවෙකි.',
            historicalInfo: 'ආනන්ද හා නාලන්ද විද්‍යාල වලින් උගත් බී. ඩී. රම්පාල මහතා කොළඹ විශ්ව විද්‍යාල කොලීජියෙන් සමත්ව (1928-1930) විශේෂ ආධුනිකයෙකු ලෙස 1931 දී එවකට පැවති ලංකා දුම්රිය සේවයට බැඳුණේය. ඔහු 1933 විද්‍යාවේදී ඉංජිනේරු උපාධියක් ද ලබාගන්නා ලදී. අනතුරුව මහා ඉන්දියානු අර්ධද්වීප දුම්රිය සේවයේ (1934-1936) ප්‍රායෝගික පුහුණුව ලබාගෙන 1935 දී යාන්ත්‍රික ඉංජිනේරු ආයතනයේ සහකාර සාමාජිකත්වය සඳහා සුදුසුකම් ලැබිය.\n\n1949 දී ඔහු ලංකා දුම්රිය සේවයේ ප්‍රථම ශ්‍රී ලාංකික ප්‍රධාන යාන්ත්‍රික ඉංජිනේරුවා බවට පත්වූ අතර, 1955 දී එම ආයතනයේ සාමාන්‍යාධිකාරී බවට පත්විය. එතුමා සාමාන්‍යාධිකාරී තනතුර හෙබවූ 15 අවුරුදු වකවානුව ලංකා දුම්රිය සේවයේ ස්වර්ණමය යුගය ලෙස සැලකේ.\n\nපිරික්සුම් දුම්රිය එන්ජින්, අඩි 55 ක් දිගැති දුම්රිය මැදිරි, නැරඹුම් මැදිරි ආදිය ද, රුහුණු කුමාරි, උඩරට මැණිකේ සහ යාල් දේවී වැනි අධි දුර ධාවන සීඝ්‍රගාමී දුම්රිය සේවය ද හඳුන්වා දුන් අතර මෙතුමන් රුහුණු කුමාරියේ මංගල ධාවනය තමා විසින්ම මෙහෙය වූහ.\n\nදේශීය දුම්රිය ඩීසල් එන්ජින්, මැදිරියක ගමනාගමන පාලනයක් සහිත වර්ණ විදුලි සංඥා පද්ධතිය, ගුවන් විදුලි සංඥා ග්‍රාහක ජාලය යන ඒවා ප්‍රථමයෙන් හඳුන්වා දීම ආදිය ඔහුගේ විශිෂ්ට ඉංජිනේරුමය දායකත්වයන් කිහිපයකි.\n\nඅතිශය දුර්ලභ අවස්ථාවක් වන බ්‍රිතාන්‍ය අධිරාජ්‍ය සාමාජිකත්වයට 6 වැනි ජෝර්ජ් රජු විසින් හෙතෙම (1952) පත්කරනු ලැබීය. 1956 දී \'ලංකාවේ ඩීසල් විදුලි ප්‍රකර්ෂණය\' යන මැයෙන් පත්‍රිකාවක් ඔහු විසින් බ්‍රිතාන්‍ය දුම්රිය ඉංජිනේරු සංගමය වෙත ඉදිරිපත් කරන ලද අතර එයට සම්මානයක් ද හිමි විය.\n\nඉංජිනේරු රම්පාල මහතා 1958 - 1959 කාල වකවානුවේ දී ශ්‍රී ලංකා ඉංජිනේරු ආයතනයේ සභාපතිවරයා ලෙස කටයුතු කළේය. 1994 දී දැයෙන් සමුගන්නා විට ඔහුගේ වයස අවුරුදු 84 ක් විය.',
            timeline: [
              { year: '1931 AD', title: 'ලංකා දුම්රිය සේවයට බැඳීම', description: 'විශේෂ ආධුනිකයෙකු ලෙස ලංකා දුම්රිය සේවයේ (CGR) සේවය ආරම්භ කළේය.' },
              { year: '1949 AD', title: 'ප්‍රථම ශ්‍රී ලාංකික ප්‍රධාන යාන්ත්‍රික ඉංජිනේරු', description: 'ලංකා දුම්රිය සේවයේ ප්‍රථම ශ්‍රී ලාංකික ප්‍රධාන යාන්ත්‍රික ඉංජිනේරුවා බවට පත් විය.' },
              { year: '1952 AD', title: 'MBE සම්මානයට පත්වීම', description: '6 වැනි ජෝර්ජ් රජු විසින් බ්‍රිතාන්‍ය අධිරාජ්‍ය සාමාජිකත්වයෙන් පිදුම් ලැබීය.' },
              { year: '1955 AD', title: 'සාමාන්‍යාධිකාරී තනතුරට පත්වීම', description: 'දුම්රිය සේවයේ සාමාන්‍යාධිකාරී ලෙස පත්වී අවුරුදු 15ක "ස්වර්ණමය යුගය" ඇරඹීය.' },
              { year: '1994 AD', title: 'අභාවප්‍රාප්තිය', description: 'වයස අවුරුදු 84 දී අභාවප්‍රාප්ත වූ අතර දුම්රිය නවීකරණයේ උරුමයක් තැබීය.' }
            ]
          },
          ta: {
            title: 'பொறியியலாளர் பமுனுசிங்ஹஆராச்சிகே டொன் ரம்பால',
            description: 'இலங்கை புகையிரத சேவையின் "பொன்னான காலத்தை" உருவாக்கிய முன்னோடி இலங்கை பொறியியலாளர்.',
            historicalInfo: 'பொறியியலாளர் பி.டி. ரம்பால அவர்கள் கொழும்பு ஆனந்த, நாளந்த கல்லூரிகளிலும் பல்கலைக்கழகக் கல்லூரியிலும் (1928-1930) படித்து 1931இல் இலங்கை அரசாங்கப் புகையிரத நிறுவனத்தில் விசேடப் பணிப்பயில்வாராகச் சேர்ந்தார். அவர் 1933இல் வெளிவாரியாக லண்டன் பல்கலைக்கழகத்தின் பி.எஸ்.சி. பட்டத்தைப் பெற்றார். மகா இந்திய தீபகற்பப் புகையிரத நிறுவனத்தில் செயல்முறைப் பயிற்சி (1934-1936) பெற்ற காலத்தில் எந்திரவியல் பொறியியலாளர் நிறுவனத்தின் உறுப்பினராவதற்குத் தேவையான சோதனைகளில் சித்தி பெற்றார்.\n\nஅரசாங்கப் புகையிரத நிறுவனத்தில், 1949இல் தலைமை இயந்திரப் பொறியியலாளராகவும் 1955இல் அந்நிறுவனத்தின் பொது முகாமையாளராகவும் பதவியேற்ற முதலாவது இலங்கையராவார். அவர் பொது முகாமையாளராகப் பணிபுரிந்த காலம் அந்நிறுவனத்தின் பொன்னான காலமெனக் கருதப்படுகிறது.\n\nபொறியியலாளர் ரம்பாலவின் முன்னோக்கு அறிவால், பார்வையாளர் வண்டிகளும் 55 அடி நீளமான புகையிரதப் பெட்டிகளும் டீசல் புகையிரத இயந்திரங்களும் யாழ்தேவி, உடரட்ட மெனிக்கே, ருஹுணு குமாரி போன்ற நீண்டதூரப் புகையிரதச் சேவைகளும் அறிமுகப்படுத்தப்பட்டன. ருஹுணு குமாரி சேவையின் ஆரம்பப் பயணத்தில் புகையிரதத்தை அவரே செலுத்தினார்.\n\nஉள்நாட்டில் டீசல் புகையிரத இயந்திர உற்பத்தி, மத்திய நிலையக் கட்டுப்பாட்டுடனான வண்ணவிளக்கு சைகையின் அறிமுகம், வானொலிச் செய்தி வாங்கியை நிறுவுதல் போன்ற பலவற்றை முதலில் செய்தவர் அவரே.\n\nஆ.ப.உ (MBE) எனும் அரிய நன்மதிப்பு அவருக்கு ஆறாவது ஜோர்ஜ் மன்னரால் 1952இல் வழங்கப்பட்டது. 1956இல் \'இலங்கையில் டீசல் மின் இழுவை\' பற்றி அவர் எழுதிய கட்டுரைக்குத் தொடர்வண்டி இயக்கு பொறியியலாளர் நிறுவனத்தின் பரிசு கிடைத்தது.\n\nஇலங்கைப் பொறியியலாளர் நிறுவனத் தலைவராக 1958 முதல் 1959 வரை அவர் பதவிவகித்தார். அவர் 1994இல் தனது 84ம் வயதில் உயிரிழந்தார்.',
            timeline: [
              { year: '1931 AD', title: 'இலங்கை புகையிரத சேவையில் சேர்க்கை', description: 'விசேட பயிற்சியாளராக இலங்கை அரசாங்க புகையிரத சேவையில் இணைந்தார்.' },
              { year: '1949 AD', title: 'முதலாவது இலங்கையர் தலைமைப் பொறியியலாளர்', description: 'இலங்கை புகையிரத சேவையின் முதலாவது இலங்கையர் தலைமை இயந்திரப் பொறியியலாளராக பதவியேற்றார்.' },
              { year: '1952 AD', title: 'MBE பட்டம் வழங்கப்பட்டது', description: 'ஆறாவது ஜோர்ஜ் மன்னரால் பிரித்தானிய பேரரசு உறுப்பினர் பட்டத்தால் கௌரவிக்கப்பட்டார்.' },
              { year: '1955 AD', title: 'பொது முகாமையாளர் பதவியேற்பு', description: 'புகையிரத சேவையின் பொது முகாமையாளராகப் பதவியேற்று 15 ஆண்டு "பொன்னான காலத்தைத்" தொடங்கினார்.' },
              { year: '1994 AD', title: 'காலமானார்', description: 'தனது 84வது வயதில் காலமானார், புகையிரத நவீனமயமாக்கலின் பாரம்பரியத்தை விட்டுச் சென்றார்.' }
            ]
          }
        }
      },
      {
        _id: new mongoose.Types.ObjectId('65d75b0a66f50b2984950026'),
        title: 'Arumadura Nandasena de Silva Kulasinghe',
        description: 'Deshabandu Vidyajothi engineer whose pre-stressed concrete innovations reshaped Sri Lanka\'s maritime and civil structures.',
        historicalInfo: 'Deshabandu Vidyajothi Eng. (Dr) ANS Kulasinghe\'s inventions in Civil, Mechanical, Marine, Electrical and Environmental Engineering are too numerous to enumerate. His work led to 24 patents, the most outstanding being the CPC Kulasinghe System of Pre-stressing.\n\nBorn in 1919, he held a B.Sc. Engineering Degree from the London University. He obtained the membership of the Institution of Civil Engineers and the Institution of Mechanical Engineers, both of the United Kingdom, in 1946.\n\nHis first appointment (1940) was to the Hydro-Electric Scheme, Norton Bridge. Later, he joined the Colombo Port Commission (CPC), becoming the Port Commissioner in 1968. He was the founder Chairman of the State Engineering Corporation, Chairman of the Central Engineering Consultancy Bureau, National Engineering Research and Development Centre, Bureau of Ceylon Standards, National Science Council and was a Commissioner of the Inventors Commission of Sri Lanka.\n\nHe introduced pre-stressed concrete for maritime structures and diversified its application to many other civil engineering structures. He was responsible for the design and the construction of the Colombo Planetarium, Colombo Port, the Kalutara Chaitya, the Sambuddha Jayanthi Chaitya, the Kothmale Maha Seya and many other high rise buildings built in nineteen sixties.\n\nHe was a Past President of the Institution of Engineers, Sri Lanka, the Sri Lanka Association for the Advancement of Science, the Association of Consulting Engineers, Sri Lanka and the National Academy of Science. He was conferred the honorary degree of Doctor of Science by the University of Moratuwa and the Open University of Sri Lanka.\n\nHe passed away in the year 2005 and was accorded a state funeral.',
        timeline: [
          { year: '1919 AD', title: 'Birth', description: 'Born in Sri Lanka, later earning a B.Sc. Engineering degree from the University of London.' },
          { year: '1940 AD', title: 'First Appointment', description: 'Assigned to the Hydro-Electric Scheme at Norton Bridge, marking the start of his engineering career.' },
          { year: '1968 AD', title: 'Colombo Port Commissioner', description: 'Becomes Port Commissioner of the Colombo Port Commission, pioneering pre-stressed concrete for maritime structures.' },
          { year: '1971 AD', title: 'CPC Kulasinghe System', description: 'Develops the CPC Kulasinghe System of Pre-stressing, the most outstanding of his 24 patents.' },
          { year: '2005 AD', title: 'Passing', description: 'Passed away and was accorded a state funeral in recognition of his engineering legacy.' }
        ],
        images: [
          '/uploads/nandasena-1.jpg'
        ],
        audioUrl: '/uploads/kulasinghe-audio.mp3',
        videoUrl: '',
        categoryId: categories[3]._id,
        galleryId: galleries[0]._id,
        museumId: colomboMuseum._id,
        qrCodeUrl: '/uploads/qr-kulasinghe.png',
        relatedArtifacts: [],
        translations: {
          si: {
            title: 'ඉංජිනේරු ආචාර්ය අරුමදුර නන්දසේන ද සිල්වා කුලසිංහ',
            description: 'ලංකාවේ සාගරාශ්‍රිත හා සිවිල් ඉදිකිරීම් වෙනස් කළ පෙර සිවි කොන්ක්‍රීට් නවෝත්පාදනවල නිර්මාතෘ, දේශබන්ධු විද්‍යාජෝති ඉංජිනේරුවෙකි.',
            historicalInfo: 'දේශබන්ධු විද්‍යාජෝති ඉංජිනේරු ආචාර්ය ඒ.එන්.එස්. කුලසිංහගේ සිවිල්, යාන්ත්‍රික, සාගර, විදුලි හා පාරිසරික ඉංජිනේරු විද්‍යා හා සම්බන්ධිත සොයා ගැනීම් ගිණිය නොහැකි තරම් සුවිශාල ය. ඔහුගේ නවනිපැයුම් 24කට පේටන්ට් බලපත්‍ර ලැබී ඇති අතර ඉන් ප්‍රධාන වන්නේ පෙර සව් කොන්ක්‍රීට් නිමවීම සඳහා හඳුන්වාදුන් CPC කුලසිංහ ක්‍රමයයි.\n\n1919 දී ජන්ම ලාභය ලද මෙතුමා ලන්ඩන් විශ්වවිද්‍යාලයෙන් බී.එස්.සී. ඉංජිනේරු උපාධිය ලබා ගත්තේය. 1946 දී ඔහු එක්සත් රාජධානියේ සිවිල් ඉංජිනේරු ආයතනයේ හා යාන්ත්‍රික ඉංජිනේරු ආයතනයේ සාමාජිකත්වය ලබා ගත්තේය.\n\nඑතුමා නෝර්ටන්බ්‍රිජ් ජල විදුලි යෝජනා ක්‍රමය සඳහා 1940 දී ප්‍රථම පත්වීම ලැබීය. ඉන්පසුව, කොළඹ වරාය කොමිසමට බැඳී 1968 දී එහි කොමසාරිස්වරයා බවට පත්විය. ඔහු රාජ්‍ය ඉංජිනේරු සංස්ථාවේ ආරම්භක සභාපතිවරයා විය. එමෙන්ම ඔහු මධ්‍යම ඉංජිනේරු උපදේශක කාර්යාංශය, ජාතික ඉංජිනේරු පර්යේෂණ හා සංවර්ධන මධ්‍යස්ථානය, ශ්‍රී ලංකා ප්‍රමිති ආයතනය, ජාතික විද්‍යා සභාව යන ආයතන වල සභාපතිධුරය හෙබවූ අතර, ශ්‍රී ලංකා නව නිපැයුම් කොමිසමේ කොමසාරිස්වරයා ද හෙබවීය.\n\nසාගරාශ්‍රිත ඉදිකිරීම් සඳහා පෙර සව් කොන්ක්‍රීට් මොහු විසින් හඳුන්වාදෙනු ලැබූ අතර පසුව අනෙකුත් සිවිල් ඉංජිනේරු නිර්මාණයන් සඳහා ද එය ව්‍යාප්ත විය. කොළඹ ග්‍රහලෝකාගාරය, කොළඹ වරාය, කළුතර චෛත්‍යය, සම්බුද්ධත්ව ජයන්ති චෛත්‍යය, කොත්මලේ මහාසෑය සහ 1960 දශකයේ ඉදිවූ උස් ගොඩනැගිලි බොහොමයක සැලසුම් හා ගොඩනැගීම මෙතුමා අතින් සිදුවිය.\n\nඔහු ශ්‍රී ලංකා ඉංජිනේරු ආයතනය, ශ්‍රී ලංකා විද්‍යාවර්ධන සංගමය, සහ ජාතික විද්‍යා ඇකඩමිය යන ආයතනයන්හි සභාපතිවරයා ලෙස කටයුතු කර ඇත්තේය. විවෘත විශ්වවිද්‍යාලයෙන් හා මොරටුව විශ්වවිද්‍යාලයෙන් එතුමා ගෞරව ආචාර්ය උපාධියක්ගෙන් පිදුම් ලැබුවේය.\n\n2005 වසරේ දී ඔහු අභාවප්‍රාප්ත වූ අතර, අවමංගල්‍ය සඳහා රාජ්‍ය ගෞරවය ලබාදෙනු ලැබීය.',
            timeline: [
              { year: '1919 AD', title: 'උපත', description: 'ශ්‍රී ලංකාවේ උපත ලැබූ අතර පසුව ලන්ඩන් විශ්වවිද්‍යාලයෙන් බී.එස්.සී. ඉංජිනේරු උපාධිය ලබා ගත්තේය.' },
              { year: '1940 AD', title: 'ප්‍රථම පත්වීම', description: 'නෝර්ටන්බ්‍රිජ් ජල විදුලි යෝජනා ක්‍රමයට පත්වීමෙන් ඔහුගේ ඉංජිනේරු ජීවිතය ඇරඹුණි.' },
              { year: '1968 AD', title: 'කොළඹ වරාය කොමසාරිස්', description: 'කොළඹ වරාය කොමිසමේ කොමසාරිස්වරයා බවට පත්වී සාගරාශ්‍රිත ඉදිකිරීම් සඳහා පෙර සව් කොන්ක්‍රීට් හඳුන්වා දුන්නේය.' },
              { year: '1971 AD', title: 'CPC කුලසිංහ ක්‍රමය', description: 'ඔහුගේ පේටන්ට් 24 අතුරින් වඩාත්ම කැපී පෙනෙන CPC කුලසිංහ පෙර සව් ක්‍රමය සකස් කරන ලදී.' },
              { year: '2005 AD', title: 'අභාවප්‍රාප්තිය', description: 'අභාවප්‍රාප්ත වූ අතර ඔහුගේ ඉංජිනේරුමය උරුමය අගය කරමින් රාජ්‍ය අවමංගල්‍යයක් පවත්වන ලදී.' }
            ]
          },
          ta: {
            title: 'பொறியியலாளர் அருமதுர நந்தசேன டி சில்வா குலசிங்க',
            description: 'இலங்கையின் கடல்சார் மற்றும் சிவில் நிர்மாணிப்புகளை மாற்றிய முன்தைக்க கொன்கிறீற்று கண்டுபிடிப்புகளின் தந்தை, தேசபந்து வித்தியாஜோதி பொறியியலாளர்.',
            historicalInfo: 'தேசபந்து வித்தியாஜோதி பொறியியலாளர் கலாநிதி ஏ.என்.எஸ். குலசிங்க அவர்களின் குடிசார், பொறிமுறை, கடல்சார், மின், சுற்றாடற்சார் பொறியியற் கண்டுபிடிப்புக்கள் அளவற்றனவை. அவரது 24 காப்புரிமை பட்டயங்களுள் சி.பி.சி. குலசிங்க காங்கிரீற்று முன்தைகைத்தல் முறை முதன்மையானது.\n\n1919இல் பிறந்த இவர், லண்டன் பல்கலைக்கழகத்தின் பி.எஸ்.சி. பொறியியல் பட்டத்தைப் பெற்றார். 1946ம் ஆண்டில் பிரித்தானிய குடிசார் எந்திரவியல், பொறிமுறை எந்திரவியல் நிறுவனங்களின் உறுப்பினர் நிலையைப் பெற்றார்.\n\nமுதலாவதாக 1940இல் நோர்ட்டன் பிரிஜ் நீர்மின்வலுத் திட்டத்திற் பணிபுரிந்தார். பின்பு கொழும்புத் துறைமுக ஆணைச்சபையைச் சேர்ந்து, 1968இல் துறைமுக ஆணையாளரானார். அரச பொறியிற் கூட்டுத்தாபனத்தை நிறுவி அதன் ஆரம்பத் தலைவராகவும், மத்திய பொறியியல் கலந்தாலோசனை பணியகம், தேசிய பொறியியல் ஆய்வு விருத்தி மையம், இலங்கை தரதாறப்பணியகம், தேசிய விஞ்ஞான மன்றம் ஆகியவற்றின் தலைவராகவும் பணியாற்றி, இலங்கை புத்திரிவாநோர் ஆணைக்குழுவின் ஆணையாளராகவும் பணியாற்றியுள்ளார்.\n\nகடல்சார் நிர்மாணிப்புகள் தொடர்பாக முன்தைகைத்த கொன்கிறீற்றை அறிமுகப்படுத்தி, பின்பு வேறு பல குடிசார் நிர்மாணிப்புகளுக்கும் அதன் உபயோகத்தை பலவகைப்படுத்தினார். கொழும்பு ஆகாய நிலையம், களுத்துறை தூபி, சம்புத்த ஜயந்தி சைத்தியம், கொத்மலை மகா சேயா, 1960இல் நிர்மாணிக்கப்பட்ட பல உயர் கட்டிடங்கள் எனப் பலவற்றின் திட்டமிடல், நிர்மாணிப்புப் பணிகளுக்கு அவர் பொறுப்பேற்றார்.\n\nஅவர் இலங்கை பொறியியலாளர் நிறுவனம், இலங்கை விஞ்ஞான அபிவிருத்திச் சங்கம், இலங்கைப் பொறியியலாளர் கலந்தாலோசனைப் பணியகம், தேசிய விஞ்ஞான மன்றம் ஆகிய நிறுவனங்களில் தலைவராக செயற்பட்டுள்ளார். மொறட்டுவ பல்கலைக்கழகமும், இலங்கை திறந்த பல்கலைக்கழகமும் இவருக்கு விஞ்ஞான கலாநிதி பட்டம் வழங்கிக் கௌரவித்தன.\n\n2005இல் அவர் இறந்த போது அவருடைய இறுதிக்கிரியைகள் அரச மரியாதையுடன் நடத்தப்பட்டன.',
            timeline: [
              { year: '1919 AD', title: 'பிறப்பு', description: 'இலங்கையில் பிறந்து, பின்னர் லண்டன் பல்கலைக்கழகத்தில் பி.எஸ்.சி. பொறியியல் பட்டம் பெற்றார்.' },
              { year: '1940 AD', title: 'முதலாவது பணிநியமனம்', description: 'நோர்ட்டன் பிரிஜ் நீர்மின்வலுத் திட்டத்தில் பணிபுரிந்து தனது பொறியியல் வாழ்க்கையைத் தொடங்கினார்.' },
              { year: '1968 AD', title: 'கொழும்புத் துறைமுக ஆணையாளர்', description: 'கொழும்புத் துறைமுக ஆணைச்சபையின் ஆணையாளராகி, கடல்சார் நிர்மாணங்களுக்கு முன்தைகைத்த கொன்கிறீற்றை அறிமுகப்படுத்தினார்.' },
              { year: '1971 AD', title: 'சி.பி.சி. குலசிங்க முறை', description: 'அவரது 24 காப்புரிமைகளில் மிகச் சிறந்ததான சி.பி.சி. குலசிங்க முன்தைகைத்தல் முறையை உருவாக்கினார்.' },
              { year: '2005 AD', title: 'காலமானார்', description: 'காலமானார், அவரது பொறியியல் பாரம்பரியத்தை கௌரவித்து அரச மரியாதையுடன் இறுதிக்கிரியைகள் நடத்தப்பட்டன.' }
            ]
          }
        }
      },
      {
        _id: new mongoose.Types.ObjectId('65d75b0a66f50b2984950027'),
        title: 'Devapura Jayasena Wimalasurendra',
        description: 'The Father of Hydro-Electricity in Sri Lanka, whose advocacy launched the Laxapana Power Project.',
        historicalInfo: 'Eng. D J Wimalasurendra, considered "The Father of Hydro-Electricity in Sri Lanka", holds an unparalleled record in the annals of the history of civil and electrical engineering fields in the country. He was the eldest son of the master craftsman, Muhandiram Don Juan Devapura Wimalasurendra, born on the 17th September 1874 in the village of Galwadugoda, Galle. Having had his early school education at Ananda College, Colombo, young Wimalasurendra qualified in Civil Engineering at the Technical College in 1896 and soon afterwards went on to qualify in Electrical Engineering as well.\n\nThe foundation to his multi-faceted carrier was laid in 1901 when he was assigned the task of prospecting for minerals in the Kelani Valley. This assignment afforded him the opportunity of studying the power generating potential of Laxapana and Aberdeen Falls. His subsequent submission of a technical case study on "Economics of power utilization in Ceylon" to the Engineering Association of Ceylon in 1918, presently known as the Institution of Engineers, Sri Lanka, led the Public Works Department (PWD) to commence the Laxapana Power Project in 1923. He held the post of Chief Engineer, PWD, from 1926 until 1929. The contractual preparations for the Power Project had commenced before he retired from public service having reached the age of 55.\n\nHe was elected to the Ratnapura seat of the State Council in 1931 and from this position he continued to advocate hydro electricity generation, which later made the Government name the Norton Bridge Hydro Power Station after Eng. Wimalasurendra. He will always be remembered for the "loop in the loop" at Demodara on the up country railway line, the Hiyare Reservoir in Galle, the Kandy water augmentation scheme and Ruwanvaliseya restoration work among many other works that stand testimony to his engineering skills. He passed away in 1953 at the age of 79.',
        timeline: [
          { year: '1874 AD', title: 'Birth', description: 'Born on 17th September 1874 in the village of Galwadugoda, Galle.' },
          { year: '1896 AD', title: 'Qualifies in Engineering', description: 'Qualifies in Civil Engineering, and soon after in Electrical Engineering, at the Technical College.' },
          { year: '1918 AD', title: 'Technical Case Study Presented', description: 'Submits "Economics of power utilization in Ceylon" to the Engineering Association of Ceylon.' },
          { year: '1923 AD', title: 'Laxapana Power Project Begins', description: 'The Public Works Department commences the Laxapana Power Project based on his advocacy.' },
          { year: '1953 AD', title: 'Passing', description: 'Passed away at the age of 79, remembered as the Father of Hydro-Electricity in Sri Lanka.' }
        ],
        images: [
          '/uploads/wimalasurendra-1.jpg'
        ],
        audioUrl: '/uploads/wimalasurendra-audio.mp3',
        videoUrl: '',
        categoryId: categories[3]._id,
        galleryId: galleries[0]._id,
        museumId: colomboMuseum._id,
        qrCodeUrl: '/uploads/qr-wimalasurendra.png',
        relatedArtifacts: [],
        translations: {
          si: {
            title: 'දේවපුර ජයසේන විමලසුරේන්ද්‍ර',
            description: 'ශ්‍රී ලංකාවේ ජල විදුලියේ පියා ලෙස සැලකෙන, ලක්ෂපාන ජල විදුලි ව්‍යාපෘතිය ඇරඹීමට හේතු වූ ඉංජිනේරුවෙකි.',
            historicalInfo: 'ශ්‍රී ලංකාවේ "ජල විදුලියේ පියා" යන විරුදාවලිය ලත් ඩී.ජේ. විමලසුරේන්ද්‍ර මහතා මේ රටේ සිවිල් හා විදුලි ඉංජිනේරු විද්‍යාව පිළිබඳ ඉතිහාස ප්‍රවෘත්තියේ අසම සම වාර්තාවක් පිහිටුවෙමින්. ගාල්ලේ, ගල්වඩුගොඩ ගම්මානයේ ප්‍රවීණ කර්මාන්ත ශිල්පියෙකු වූ දොන් ජුවාන් දේවපුර විමලසුරේන්ද්‍ර මුහන්දිරම්තුමාගේ ජ්‍යෙෂ්ඨ පුත් රත්නය ලෙස 1874 සැප්තැම්බර් මස 17 වැනි දින උපත ලැබීය. කොළඹ ආනන්ද විද්‍යාලයෙන් මූලික පාසැල් අධ්‍යාපනය හදාරන විමලසුරේන්ද්‍ර මහතා අනතුරුව කාර්මික විද්‍යාලයට බැඳී 1896 වර්ෂයේ දී සිවිල් ඉංජිනේරු අංශයෙන් සුදුසුකම් ලබා ඉන් ඉක්බිතිව විදුලි ඉංජිනේරු අංශයෙන් ද සුදුසුකම් ලබා ගත්තේය.\n\nවිවිධ අංශ වලට විහිදී ගිය ඔහුගේ වෘත්තීය ජීවිතයේ පදනම වැටුණේ 1901 දී කැළණි මිටියාවතේ ඛනිජ මැව් ගවේෂණය කිරීමේ කාර්යය එතුමාට පැවරීමෙනි. මේ ව්‍යාපෘතිය නිසා ලක්ෂපාන දිය ඇල්ලෙහි හා ඇබර්ඩීන් දිය ඇල්ලෙහි බල ශක්තිය ජනනය කිරීමට ඇති විභවය අධ්‍යයනය කිරීමට එතුමාට අවස්ථාව උදාවිය. ඉන්පසු එතුමා විසින් ශ්‍රී ලංකාවේ ඉංජිනේරු සංගමයට 1918 වර්ෂයේ දී "ශ්‍රී ලංකාවේ බලශක්ති භාවිතයේ ආර්ථික විද්‍යාත්මකභාවය" යන මැයෙන් තාක්ෂණික නිබන්ධනයක් ඉදිරිපත් කරන ලදි. ප්‍රසිද්ධ වැඩ දෙපාර්තමේන්තුව (PWD) විසින් 1923 දී "ලක්ෂපාන විදුලිබල ව්‍යාපෘතිය" ආරම්භ කිරීමට මේ නිබන්ධනය හේතු පාදක විය. 1926 සිට 1929 දක්වා ප්‍රසිද්ධ වැඩ දෙපාර්තමේන්තුවේ (PWD) ප්‍රධාන ඉංජිනේරුවරයා ලෙස එතුමා රාජකාරි කළේය. එතුමාගේ විශ්‍රාම දිවි එනම් වයස අවුරුදු 55 දී රාජ්‍ය සේවයෙන් විශ්‍රාම ගැනීමට පෙර මේ බලශක්ති ව්‍යාපෘතියේ ගිවිසුම් සකස් කිරීම ආරම්භ කිරීමට එතුමාට හැකි විය.\n\n1931 වර්ෂයේ දී එතුමා රාජ්‍ය මන්ත්‍රණ සභාවේ රත්නපුර ආසනයට තේරී පත්වූ අතර ඒ තනතුරු දරමින් සිටියදී ජල විදුලිය ජනනය පිළිබඳ දිගටම මහත් උද්‍යෝගයෙන් කථා කළේය. මේ නිසාම නෝර්ටන් බ්‍රිජ් විදුලි බලාගාරය විමලසුරේන්ද්‍ර ඉංජිනේරු මහතාගේ නමින් හැඳින්වීමට රජය තීරණය කළේය. උඩරට දුම්රිය මාර්ගයේ දෙමෝදර පිහිටි "දුම්රිය වළල්ල", ගාල්ලේ හියාරේ පිහිටි ජලාශය, මහනුවර ජල සම්පාදනය සංවර්ධනය කිරීමේ යෝජනා ක්‍රමය, රුවන්වැලි සෑය ප්‍රතිසංස්කරණය කිරීම සහ එතුමාගේ ඉංජිනේරු ශිල්ප කෞශල්‍යයට සාක්ෂි දරන එවැනි තවත් බොහෝ කාර්යයන් එතුමා සදාමතක් කිරීමට හේතු වනු ඇත. 1953 වර්ෂයේ දී වයස අවුරුදු 79 දී එතුමා අභාවප්‍රාප්ත විය.',
            timeline: [
              { year: '1874 AD', title: 'උපත', description: 'ගාල්ලේ ගල්වඩුගොඩ ගම්මානයේ 1874 සැප්තැම්බර් 17 වැනි දින උපත ලැබීය.' },
              { year: '1896 AD', title: 'ඉංජිනේරු සුදුසුකම් ලැබීම', description: 'සිවිල් ඉංජිනේරු අංශයෙන් සුදුසුකම් ලබා, ඉක්බිතිව විදුලි ඉංජිනේරු අංශයෙන් ද සුදුසුකම් ලැබීය.' },
              { year: '1918 AD', title: 'තාක්ෂණික නිබන්ධනය ඉදිරිපත් කිරීම', description: '"ශ්‍රී ලංකාවේ බලශක්ති භාවිතයේ ආර්ථික විද්‍යාත්මකභාවය" නමැති නිබන්ධනය ඉංජිනේරු සංගමයට ඉදිරිපත් කළේය.' },
              { year: '1923 AD', title: 'ලක්ෂපාන ව්‍යාපෘතිය ආරම්භය', description: 'එතුමාගේ උද්‍යෝගය හේතුවෙන් ප්‍රසිද්ධ වැඩ දෙපාර්තමේන්තුව ලක්ෂපාන විදුලිබල ව්‍යාපෘතිය ආරම්භ කළේය.' },
              { year: '1953 AD', title: 'අභාවප්‍රාප්තිය', description: 'වයස අවුරුදු 79 දී අභාවප්‍රාප්ත වූ අතර, ශ්‍රී ලංකාවේ ජල විදුලියේ පියා ලෙස සදාතනිකව සිහිපත් වේ.' }
            ]
          },
          ta: {
            title: 'பொறியியலாளர் தேவபுர ஜயசேன விமலசுரேந்திர',
            description: 'இலங்கை நீர்மின் தொழில்நுட்பத்தின் பிதாவெனக் கருதப்படும், லக்ஷபான நீர்மின் திட்டத்தைத் தொடங்க வைத்த பொறியியலாளர்.',
            historicalInfo: 'இலங்கை நீர்மின் தொழில்நுட்பத்தின் பிதாவென கருதப்படும் பொறியியலாளர் தேவபுர ஜயசேன விமலசுரேந்திர இலங்கையின் குடிசார், மின் பொறியியல் வரலாற்று ஏடுகளில் இணையற்ற உச்சம் அடைந்திருக்கிறார். அவர் காலி கல்வடுகொட கிராமத்தில் ஒரு தலைமை கைவினைஞரான முகாந்திரம் டொன் ஜுவான் தேவபுர விமலசுரேந்திரவுக்கு 1874ம் ஆண்டு செப்டெம்பர் மாதம் 17 ஆந் திகதி மூத்த மகனாக பிறந்தார். அவர் கொழும்பு ஆனந்த கல்லூரியில் ஆரம்பக் கல்வியைப் பெற்று, பின்னர் சுயமாக 1896ல் குடிசார் பொறியியலிலும் பின்பு விரைவில் மின் பொறியியலிலும் தகைமை பெற்றார்.\n\n1901இல் இலங்கை களனி பள்ளத்தாக்கின் நிலத்தின் கீழ்க் கனிப்பொருட்களுக்காகத் தேடும் ஆராய்வை மேற்கொள்ளும் பொறுப்பு அவரிடம் சாற்றப்பட்டமை, அவர் சகலதுறைச் செய்தொழில்களிலும் ஈடுபடுவதற்கான அடிப்படையாயிருந்தது. இக் கற்கை அவருக்கு லக்ஷபான, அபர்டீன் நீர்வீழ்ச்சிகளிலிருந்து மின் உற்பத்தி பெறக்கூடிய இயல்தகுதியை ஆராய்வதற்கு வாய்ப்புக் கொடுத்தது. இதன் பயனாக 1918ம் ஆண்டில் இலங்கையில் மின் சக்தி பாவனை சிக்கனம் பற்றிய தொழில் நுட்ப கட்டுரையை இலங்கை பொறியியற் சங்கம், அதாவது இப்போதைய இலங்கை பொறியியலாளர்கள் நிறுவனத்துக்குச் சமர்ப்பித்தார். அதன் விளைவாக அரச பொது வேலைகள் திணைக்களம் 1923ம் ஆண்டு லக்ஷபான நீர்மின்திட்ட வேலைகளை ஆரம்பிப்பதற்கு விதித்திட்டது. அவர் 1926ம் ஆண்டிலிருந்து 1929ம் ஆண்டு வரை அரச பொது வேலைகள் திணைக்களத்தில் தலைமைப் பொறியியலாளராகப் பணியாற்றினார். தனது 55வது வயதில் அவர் பொதுச் சேவையிலிருந்து ஓய்வு பெறும் காலத்தில் இந் நீர்மின்திட்ட செயற்பாடுகள் தொடங்கி விட்டன.\n\nஅவர் 1931ல் இரத்தினபுரியில் அரசு மன்றத்துக்குத் தெரிவாகி நீர்மின் உற்பத்தியைத் தொடர்ந்து முன்னெடுக்க முயன்றதனால் நோர்டன் பிரிஜ் நீர்மின் நிலையத்திற்கு விமலசுரேந்திர நீர்மின் நிலையமென அரசாங்கம் பின்னர் பெயரிட்டியது. மலையக புகையிரதப் பாதையில் தெமோதரவில் "வளைய" இணைப்பு வழி, காலி கியாரி நீர்த்தேக்கம், கண்டி நீர்விநியோக பெருக்கும் திட்டம், ருவன்வெலிசேய புனரமைப்பு பணிகள் போன்ற பல நிர்மாணிப்புகள் இவரது பொறியியல் திறமைகளுக்கு சான்று பகர்கின்றன. அவர் 1953ம் ஆண்டு 79வயதில் காலமானார்.',
            timeline: [
              { year: '1874 AD', title: 'பிறப்பு', description: 'காலி கல்வடுகொட கிராமத்தில் 1874 செப்டெம்பர் 17 அன்று பிறந்தார்.' },
              { year: '1896 AD', title: 'பொறியியல் தகைமை பெறுதல்', description: 'குடிசார் பொறியியலிலும், பின்னர் மின் பொறியியலிலும் தகைமை பெற்றார்.' },
              { year: '1918 AD', title: 'தொழில்நுட்ப கட்டுரை சமர்ப்பிப்பு', description: '"இலங்கையில் மின் சக்தி பாவனை சிக்கனம்" பற்றிய கட்டுரையை பொறியியலாளர் சங்கத்திற்குச் சமர்ப்பித்தார்.' },
              { year: '1923 AD', title: 'லக்ஷபான திட்டம் தொடக்கம்', description: 'அவரது முயற்சியால் அரச பொது வேலைகள் திணைக்களம் லக்ஷபான நீர்மின்திட்டத்தைத் தொடங்கியது.' },
              { year: '1953 AD', title: 'காலமானார்', description: 'தனது 79வது வயதில் காலமானார், இலங்கை நீர்மின் தொழில்நுட்பத்தின் பிதாவாக நினைவுகூரப்படுகிறார்.' }
            ]
          }
        }
      },
      {
        _id: new mongoose.Types.ObjectId('65d75b0a66f50b2984950028'),
        title: 'Bisokotuwa',
        description: 'An ingenious ancient valve pit that controlled and issued water from high-head reservoirs without eroding the embankment.',
        historicalInfo: 'The Bisokotuwa, developed around 2000 years ago by the engineers of ancient Sri Lanka, was used to control and issue water from reservoirs that generally had high heads.\n\nIt was a pit, often rectangular in size, with its longer side parallel to the bund and housing the inlet and outlet conduit openings. It enabled the reduction of the potentially destructive kinetic energy of the incoming water, which could have eroded the structure, as any seepage would have caused the collapse of the embankment. Built of stone on brickwork of excellent quality and substantial thickness, and surrounded by a backing of very good clay puddle, the Bisokotuwa was watertight. The walls and the floor of the Bisokotuwa were lined with long thin granite slabs, placed on the edges of the walls and carefully fitted together. The conduits had granite linings, usually with a rough surface finish, to facilitate energy dissipation.\n\nAlthough it would not have been essential, in order to control the speed and pressure of water, there would have been some type of gates within the Bisokotuwa. The remains of the control system used have not been found, but details of socket holes and slots found when the Bisokotuwa at Giritale was excavated confirmed that wooden structures had been used for such gates and related lifting mechanisms.',
        timeline: [
          { year: '100 BC', title: 'Early Development', description: 'Ancient Sri Lankan hydraulic engineers develop the Bisokotuwa valve-pit design to safely control reservoir outflow.' },
          { year: '1st Century AD', title: 'Widespread Use in Reservoirs', description: 'The design is adopted across major irrigation reservoirs to prevent embankment erosion from high-head water release.' },
          { year: '20th Century AD', title: 'Excavation at Giritale', description: 'Archaeological excavation of the Giritale Bisokotuwa uncovers socket holes and slots confirming the use of wooden sluice gates.' }
        ],
        images: [
          '/uploads/bisokotuwa-1.jpg',
          '/uploads/bisokotuwa-2.jpg'
        ],
        audioUrl: '/uploads/bisokotuwa-audio.mp3',
        videoUrl: '',
        categoryId: categories[1]._id,
        galleryId: galleries[0]._id,
        museumId: colomboMuseum._id,
        qrCodeUrl: '/uploads/qr-bisokotuwa.png',
        relatedArtifacts: [],
        translations: {
          si: {
            title: 'බිසෝ කොටුව',
            description: 'උස් වැව්වලින් ජලය පාලනය කරමින් වැඩ කණ්ඩට හානි නොවී පිටතට නිකුත් කිරීමට යොදාගත් සුවිශේෂී පුරාණ නිමැවුමකි.',
            historicalInfo: 'වැඩි උසකට ජලය රඳවූ වැව්වලින් වැව් කණ්ඩට හානි නොවී වැව් කණ්ඩ හරහා ජලය පිටතට ගැනීමට අපේ පුරාණ ඉංජිනේරුවන් විසින් වසර 2000කට පමණ පෙර කළ මනහර නිමැවුමකි බිසෝ කොටුව.\n\nවැඩි වැඩි කණ්ඩේ ජලය ඇති පැත්තේ සෘජුකෝණාශ්‍රාකාර පිඳුමක් ලෙස බිසෝ කොටුව පවතී. වැවේ ඇතුළු වන සොරොව්ව හරහා බිසෝ කොටුවට ජලය ඇතුළු වේ. අනතුරුව මෙම ජලය බිසෝ කොටුවට විවර වී ඇති වැව් කණ්ඩ හරහා යන පිට වන සොරොව්ව තුළින් හෝ වැවෙන් පිටවේ. මෙසේ කිරීමෙන් වැව් කණ්ඩට හානියක් නොවන පරිදි වැඩි උසකට ජලය රැඳූ වැව් වලින් වැව් කණ්ඩ හරහා ජලය පිටකර ගත හැක.\n\nගඩොල් හා මැටි භාවිතා කොට ව්‍යූහයන් ගොඩනැඟීමේදී බලාපොරොත්තු වූයේ ලක්ෂ්‍යමය බර හෝ විසිරී යන බර හා ආතතීන් ව්‍යූහය තුළ විසිරවාලමින් එම බර යටතේ ව්‍යූහය කැඩී බිඳී යාම වළක්වාලීමයි. සිගිරියේ භාවිතා කරන ලද බදාම සංයෝග දෙයාකාර විය. බර දරන බිත්ති සඳහා වැලි මුලිකව සැදූ බදාම භාවිතා කරනු ලැබූ අතර මැටි පදනම් කරගෙන ජලය රඳවා පවතින බිත්ති සඳහා භාවිතා කරනු ලැබූ බදාම ජලය කාන්දු වීම වළක්වා ඇත. චූන කවුඩු දහනය කිරීමෙන් බදාම වලට අවශ්‍ය හුණු සපයාගෙන ඇත.\n\nජලයේ වේගය හෝ පීඩනය පාලනය කිරීම සඳහා අනිවාර්ය නොවුනද, බිසෝ කොටුව තුළ යම් ආකාරයක දොරටු තිබී ඇති බව සිතිය හැක. පාලන පද්ධතියේ නටබුන් හමු වී නැතත්, ගිරිතලේ බිසෝ කොටුව කැණීමේදී හමු වූ සොකට් සිදුරු සහ තුනී තුඩුවලින් ලී ව්‍යූහයන් එවැනි දොරටු සඳහා භාවිතා කර ඇති බව තහවුරු වේ.',
            timeline: [
              { year: '100 BC', title: 'මුල් යුගයේ නිර්මාණය', description: 'වැව් වලින් ජලය ආරක්ෂිතව පිට කිරීම සඳහා පුරාණ ශ්‍රී ලාංකික ජල ඉංජිනේරුවන් බිසෝ කොටු නිර්මාණය කරති.' },
              { year: 'ක්‍රි.ව. 1 සියවස', title: 'වැඩි වැව්වල ව්‍යාප්තිය', description: 'උස් ජල මට්ටම් සහිත ප්‍රධාන වැව් රැසක වැව් කණ්ඩ ආරක්ෂා කිරීමට මෙම නිර්මාණය භාවිතාවට ගැනේ.' },
              { year: '20 වන සියවස', title: 'ගිරිතලේ කැණීම්', description: 'ගිරිතලේ බිසෝ කොටුවේ පුරාවිද්‍යා කැණීම් මගින් ලී දොරටු භාවිතා කළ බවට සාක්ෂි වන සොකට් සිදුරු සොයාගනී.' }
            ]
          },
          ta: {
            title: 'பிசோகொட்டுவ',
            description: 'உயர் மட்ட நீர்த்தேக்கங்களிலிருந்து அணைக்கட்டுக்கு சேதமின்றி நீரைக் கட்டுப்படுத்தி வெளியேற்றிய பண்டைய நுட்பமான அமைப்பு.',
            historicalInfo: '2000 ஆண்டுகட்கு முன்பு பிராதன இலங்கையின் பொறியியலாளர்கள் விருத்திசெய்த பிசோகொட்டுவ, பொதுவாக நீர்மட்டம் உயர்ந்த நீர்த்தேக்கங்களிலிருந்து நீரைக் கட்டுப்படுத்தி வழங்கப் பயன்பட்டுள்ளது.\n\nஅது, பெரும்பாலும், தன் நீண்ட பக்கங்கள் அணைக்கட்டுக்குச் சமாந்தரமாக அமைந்த செவ்வக வடிவமுடையதும் உட்புகல், வெளியேற்றும் குழாய்க் கால்வாய்களைத் தன்னுட்கொண்டுள்ளதுமான ஒரு தொட்டியாகும். எவ்விதமான நீர்க்கசிவும் அணைக்கட்டின் வீழ்ச்சிக்குக் காரணமாகலாம் என்பதால், அமைப்பில் அரிப்பேற்படுத்தக்கூடிய அதிவேகமுடைய உட்புகும் நீரின் இயக்கப்பணிபுச் சக்தியைக் குறைப்பதே அது இயலுமாக்கியது. உன்னதமான தரமுடையதும் கணிசமான தடிப்புடையதுமான செங்கற்களின் மீது கல்லால் கட்டப்பட்டு, மிகத் தரமான களிமண் குழம்பால் சூழப்பட்ட பிசோகொட்டுவ, நீரைக் கசியவிடாததாக இருந்தது. பிசோகொட்டுவவின் சுவர்களும் தரையும் ஒன்றோடு ஒன்றாக வைக்கப்பட்டுக் கவனமாகப் பொருத்தப்பட்ட நீண்ட மெல்லிய கருங்கல் தட்டுக்களால் இழைக்கப்பட்டிருந்தன.\n\nஅத்தியாவசியமானதாக இருந்திராவிடினும், நீரின் வேகத்தை அல்லது அழுத்தத்தைக் கட்டுப்படுத்த ஏதோவகையான படலைகள் பிசோகொட்டுவுக்குள் இருந்திருக்கும். கட்டுப்பாட்டுத் தொகுதியின் எச்சங்கள் கண்டுபிடிக்கப்படவில்லை. ஆயினும், கிரித்தலையில் பிசோகொட்டுவ அகழப்பட்டபோது காணப்பட்ட தாங்குகுழிகளும் வசிலுகளும் அத்தகைய படலைகட்கும் அவை சார்ந்த உயர்த்தும் பொறிமுறைகட்கும் மரத்தாலான அமைப்புக்கள் பயன்பட்டதை உறுதிபடுத்தியுள்ளன.',
            timeline: [
              { year: '100 BC', title: 'ஆரம்பகால வடிவமைப்பு', description: 'நீர்த்தேக்கங்களிலிருந்து அணைக்கட்டுக்குச் சேதமின்றி நீரை வெளியேற்ற பண்டைய இலங்கை பொறியியலாளர்கள் பிசோகொட்டுவவை வடிவமைத்தனர்.' },
              { year: 'கி.பி. 1ஆம் நூற்றாண்டு', title: 'பெரும் நீர்த்தேக்கங்களில் பயன்பாடு', description: 'உயர் நீர்மட்டம் கொண்ட முக்கிய நீர்த்தேக்கங்களில் அணைக்கட்டைப் பாதுகாக்க இந்த அமைப்பு பரவலாகப் பயன்படுத்தப்பட்டது.' },
              { year: '20ஆம் நூற்றாண்டு', title: 'கிரித்தலை அகழ்வாராய்ச்சி', description: 'கிரித்தலையில் பிசோகொட்டுவ அகழப்பட்டபோது மரத்தாலான படலைகள் பயன்பட்டதற்கான சான்றான தாங்குகுழிகள் கண்டுபிடிக்கப்பட்டன.' }
            ]
          }
        }
      },
    ]);

    // Cross-link related artifacts using their fixed ObjectIds
    exhibits[0].relatedArtifacts.push(exhibits[1]._id, exhibits[2]._id, exhibits[3]._id, exhibits[4]._id, exhibits[5]._id, exhibits[6]._id, exhibits[7]._id);
    exhibits[1].relatedArtifacts.push(exhibits[0]._id, exhibits[2]._id, exhibits[3]._id, exhibits[4]._id, exhibits[5]._id, exhibits[6]._id, exhibits[7]._id);
    exhibits[2].relatedArtifacts.push(exhibits[0]._id, exhibits[1]._id, exhibits[3]._id, exhibits[4]._id, exhibits[5]._id, exhibits[6]._id, exhibits[7]._id);
    exhibits[3].relatedArtifacts.push(exhibits[0]._id, exhibits[1]._id, exhibits[2]._id, exhibits[4]._id, exhibits[5]._id, exhibits[6]._id, exhibits[7]._id);
    exhibits[4].relatedArtifacts.push(exhibits[0]._id, exhibits[1]._id, exhibits[2]._id, exhibits[3]._id, exhibits[5]._id, exhibits[6]._id, exhibits[7]._id);
    exhibits[5].relatedArtifacts.push(exhibits[0]._id, exhibits[1]._id, exhibits[2]._id, exhibits[3]._id, exhibits[4]._id, exhibits[6]._id, exhibits[7]._id);
    exhibits[6].relatedArtifacts.push(exhibits[0]._id, exhibits[1]._id, exhibits[2]._id, exhibits[3]._id, exhibits[4]._id, exhibits[5]._id, exhibits[7]._id);
    exhibits[7].relatedArtifacts.push(exhibits[0]._id, exhibits[1]._id, exhibits[2]._id, exhibits[3]._id, exhibits[4]._id, exhibits[5]._id, exhibits[6]._id);

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
      text: 'Who is credited with the construction of the colossal Jetavana Stupa?',
      type: 'multiple-choice',
      options: ['King Mahasen', 'King Kasyapa', 'King Parakramabahu I', 'King Dutugemunu'],
      correctAnswer: 'King Mahasen',
      points: 10
    });

    const q4 = await QuizQuestion.create({
      _id: new mongoose.Types.ObjectId('65d75d0d66f50b2984950044'),
      text: 'What is the basic geometrical shape followed in the space planning of Sigiriya?',
      type: 'multiple-choice',
      options: ['Circle', 'Rectangle', 'Octagon', 'Triangle'],
      correctAnswer: 'Rectangle',
      points: 10
    });

    const q5 = await QuizQuestion.create({
      _id: new mongoose.Types.ObjectId('65d75d0d66f50b2984950045'),
      text: 'Which express train did Eng. D. Rampala personally drive on its first voyage to Matara?',
      type: 'multiple-choice',
      options: ['Yal Devi', 'Udarata Menike', 'Ruhunu Kumari', 'Podi Menike'],
      correctAnswer: 'Ruhunu Kumari',
      points: 10
    });

    const q6 = await QuizQuestion.create({
      _id: new mongoose.Types.ObjectId('65d75d0d66f50b2984950046'),
      text: 'What is the CPC Kulasinghe System, the most notable of Eng. ANS Kulasinghe\'s 24 patents?',
      type: 'multiple-choice',
      options: ['A radio signalling network', 'A pre-stressed concrete method', 'A hydro-electric turbine design', 'A steel smelting furnace'],
      correctAnswer: 'A pre-stressed concrete method',
      points: 10
    });

    const q7 = await QuizQuestion.create({
      _id: new mongoose.Types.ObjectId('65d75d0d66f50b2984950047'),
      text: 'Which power station was named after Eng. D. J. Wimalasurendra in recognition of his advocacy for hydro-electricity?',
      type: 'multiple-choice',
      options: ['Laxapana Power Station', 'Norton Bridge Hydro Power Station', 'Victoria Power Station', 'Kotmale Power Station'],
      correctAnswer: 'Norton Bridge Hydro Power Station',
      points: 10
    });

    const q8 = await QuizQuestion.create({
      _id: new mongoose.Types.ObjectId('65d75d0d66f50b2984950048'),
      text: 'What was the primary purpose of the Bisokotuwa in ancient Sri Lankan reservoirs?',
      type: 'multiple-choice',
      options: ['Storing drinking water', 'Controlling and issuing water without eroding the embankment', 'Generating hydro-electric power', 'Filtering silt from irrigation water'],
      correctAnswer: 'Controlling and issuing water without eroding the embankment',
      points: 10
    });

    const quiz1 = await Quiz.create({
      _id: new mongoose.Types.ObjectId('65d75c0f66f50b2984950031'),
      title: 'Ancient Engineering Heritage',
      description: 'Test your knowledge on ancient Sri Lankan metallurgy, hydrostatics, stupa architecture, city planning, and modern engineering pioneers.',
      difficulty: 'medium',
      pointsReward: 100,
      museumId: colomboMuseum._id,
      galleryId: galleries[0]._id,
      questions: [q1._id, q2._id, q3._id, q4._id, q5._id, q6._id, q7._id, q8._id]
    });

    // 7. Seed per-exhibit quizzes (accessible via a "Quiz" button on the exhibit page)
    const windQ1 = await QuizQuestion.create({
      _id: new mongoose.Types.ObjectId('65d75d0d66f50b2984950049'),
      text: 'Which natural wind phenomenon was harnessed by the ancient iron smelting furnaces at Samanalawewa?',
      type: 'multiple-choice',
      options: ['Local sea breezes', 'Northeast monsoon', 'Southwest monsoon', 'Cyclonic storms'],
      correctAnswer: 'Southwest monsoon',
      points: 10
    });
    const windQ2 = await QuizQuestion.create({
      _id: new mongoose.Types.ObjectId('65d75d0d66f50b2984950050'),
      text: 'True or False: Renewable charcoal for the wind-powered furnaces was produced from Syzygium trees.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 'True',
      points: 10
    });
    const windQuiz = await Quiz.create({
      _id: new mongoose.Types.ObjectId('65d75c0f66f50b2984950032'),
      title: 'Wind-Powered Steel Smelting Quiz',
      description: 'Test your knowledge of the ancient monsoon-powered iron furnaces of Samanalawewa.',
      difficulty: 'easy',
      pointsReward: 20,
      museumId: colomboMuseum._id,
      galleryId: galleries[0]._id,
      exhibitId: exhibits[0]._id,
      questions: [windQ1._id, windQ2._id]
    });

    const elephantQ1 = await QuizQuestion.create({
      _id: new mongoose.Types.ObjectId('65d75d0d66f50b2984950051'),
      text: 'At which archaeological site was the famous ancient Elephant Lamp discovered?',
      type: 'multiple-choice',
      options: ['Kotavehera in Dedigama', 'Rankoth Vehera in Polonnaruwa', 'Mihintale Stupa', 'Sigiriya Royal Palace'],
      correctAnswer: 'Kotavehera in Dedigama',
      points: 10
    });
    const elephantQ2 = await QuizQuestion.create({
      _id: new mongoose.Types.ObjectId('65d75d0d66f50b2984950052'),
      text: 'True or False: Oil ceases to flow into the basin when the lower opening of tube P is covered by oil, creating high pressure in the chamber.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 'False',
      points: 10
    });
    const elephantQuiz = await Quiz.create({
      _id: new mongoose.Types.ObjectId('65d75c0f66f50b2984950033'),
      title: 'Elephant Lamp Quiz',
      description: 'Test your knowledge of the hydrostatic engineering behind the Elephant Lamp (Ath Pahana).',
      difficulty: 'easy',
      pointsReward: 20,
      museumId: colomboMuseum._id,
      galleryId: galleries[0]._id,
      exhibitId: exhibits[1]._id,
      questions: [elephantQ1._id, elephantQ2._id]
    });

    const jetavanaQ1 = await QuizQuestion.create({
      _id: new mongoose.Types.ObjectId('65d75d0d66f50b2984950053'),
      text: 'Which Sri Lankan king is credited with the construction of the colossal Jetavana Stupa?',
      type: 'multiple-choice',
      options: ['King Dhatusena', 'King Mahasen', 'King Dutugemunu', 'King Walagamba'],
      correctAnswer: 'King Mahasen',
      points: 10
    });
    const jetavanaQ2 = await QuizQuestion.create({
      _id: new mongoose.Types.ObjectId('65d75d0d66f50b2984950054'),
      text: 'True or False: At Jetavana Stupa, the basal rings were constructed after the dome.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 'False',
      points: 10
    });
    const jetavanaQuiz = await Quiz.create({
      _id: new mongoose.Types.ObjectId('65d75c0f66f50b2984950034'),
      title: 'Jetavana Stupa Quiz',
      description: 'Test your knowledge of the construction methodology behind the colossal Jetavana Stupa.',
      difficulty: 'easy',
      pointsReward: 20,
      museumId: colomboMuseum._id,
      galleryId: galleries[0]._id,
      exhibitId: exhibits[2]._id,
      questions: [jetavanaQ1._id, jetavanaQ2._id]
    });

    const bisokotuwaQ1 = await QuizQuestion.create({
      _id: new mongoose.Types.ObjectId('65d75d0d66f50b2984950055'),
      text: 'What is the primary hydraulic purpose of the Bisokotuwa (cistern sluice) in ancient reservoirs?',
      type: 'multiple-choice',
      options: ['Filtering mineral salts', 'Measuring seasonal rainfall', 'Dissipating water kinetic energy', 'Heating reservoir water'],
      correctAnswer: 'Dissipating water kinetic energy',
      points: 10
    });
    const bisokotuwaQ2 = await QuizQuestion.create({
      _id: new mongoose.Types.ObjectId('65d75d0d66f50b2984950056'),
      text: 'True or False: Excavation at the Giritale Bisokotuwa revealed socket holes confirming the use of wooden gates.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 'True',
      points: 10
    });
    const bisokotuwaQuiz = await Quiz.create({
      _id: new mongoose.Types.ObjectId('65d75c0f66f50b2984950035'),
      title: 'Bisokotuwa Quiz',
      description: 'Test your knowledge of the ancient valve-pit engineering used to control reservoir outflow.',
      difficulty: 'easy',
      pointsReward: 20,
      museumId: colomboMuseum._id,
      galleryId: galleries[0]._id,
      exhibitId: exhibits[7]._id,
      questions: [bisokotuwaQ1._id, bisokotuwaQ2._id]
    });

    const sigiriyaQ1 = await QuizQuestion.create({
      _id: new mongoose.Types.ObjectId('65d75d0d66f50b2984950057'),
      text: 'Why did ancient Sigiriya builders specifically use clay-based mortar for water-retaining structures?',
      type: 'multiple-choice',
      options: ['To prevent water seepage', 'To provide bright white coloration', 'To accelerate mortar drying speed', 'To reduce building weight'],
      correctAnswer: 'To prevent water seepage',
      points: 10
    });
    const sigiriyaQ2 = await QuizQuestion.create({
      _id: new mongoose.Types.ObjectId('65d75d0d66f50b2984950058'),
      text: 'True or False: The corbelled arch at Sigiriya is formed by brick courses that progressively overlap until they meet.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 'True',
      points: 10
    });
    const sigiriyaQuiz = await Quiz.create({
      _id: new mongoose.Types.ObjectId('65d75c0f66f50b2984950036'),
      title: 'Sigiriya Quiz',
      description: 'Test your knowledge of the water management, planning, and construction technology of Sigiriya.',
      difficulty: 'easy',
      pointsReward: 20,
      museumId: colomboMuseum._id,
      galleryId: galleries[0]._id,
      exhibitId: exhibits[3]._id,
      questions: [sigiriyaQ1._id, sigiriyaQ2._id]
    });

    const rampalaQ1 = await QuizQuestion.create({
      _id: new mongoose.Types.ObjectId('65d75d0d66f50b2984950059'),
      text: 'Which famous express train was personally driven by Eng. B. D. Rampala on its inaugural journey to Matara?',
      type: 'multiple-choice',
      options: ['Udarata Menike', 'Podi Menike', 'Ruhunu Kumari', 'Yal Devi'],
      correctAnswer: 'Ruhunu Kumari',
      points: 10
    });
    const rampalaQuiz = await Quiz.create({
      _id: new mongoose.Types.ObjectId('65d75c0f66f50b2984950037'),
      title: 'Eng. D. Rampala Quiz',
      description: 'Test your knowledge of the railway pioneer who ushered in the "Golden Era" of the Ceylon Government Railway.',
      difficulty: 'easy',
      pointsReward: 10,
      museumId: colomboMuseum._id,
      galleryId: galleries[0]._id,
      exhibitId: exhibits[4]._id,
      questions: [rampalaQ1._id]
    });

    const kulasingheQ1 = await QuizQuestion.create({
      _id: new mongoose.Types.ObjectId('65d75d0d66f50b2984950060'),
      text: 'True or False: The CPC Pre-stressing System was invented and patented by Eng. Dr. A. N. S. Kulasinghe.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 'True',
      points: 10
    });
    const kulasingheQuiz = await Quiz.create({
      _id: new mongoose.Types.ObjectId('65d75c0f66f50b2984950038'),
      title: 'Eng. Dr. A. N. S. Kulasinghe Quiz',
      description: 'Test your knowledge of the engineer behind the CPC Kulasinghe System of Pre-stressing.',
      difficulty: 'easy',
      pointsReward: 10,
      museumId: colomboMuseum._id,
      galleryId: galleries[0]._id,
      exhibitId: exhibits[5]._id,
      questions: [kulasingheQ1._id]
    });

    console.log('Exhibit-specific quizzes seeded.');

    console.log('Quizzes & questions seeded.');

    console.log('Database Seeding Completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
