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
        exhibitsCount: 3,
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
    ]);

    // Cross-link related artifacts using their fixed ObjectIds
    exhibits[0].relatedArtifacts.push(exhibits[1]._id, exhibits[2]._id);
    exhibits[1].relatedArtifacts.push(exhibits[0]._id, exhibits[2]._id);
    exhibits[2].relatedArtifacts.push(exhibits[0]._id, exhibits[1]._id);

    await exhibits[0].save();
    await exhibits[1].save();
    await exhibits[2].save();

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

    const quiz1 = await Quiz.create({
      _id: new mongoose.Types.ObjectId('65d75c0f66f50b2984950031'),
      title: 'Ancient Engineering Heritage',
      description: 'Test your knowledge on ancient Sri Lankan metallurgy, hydrostatics, and stupa architecture.',
      difficulty: 'medium',
      pointsReward: 50,
      museumId: colomboMuseum._id,
      galleryId: galleries[0]._id,
      questions: [q1._id, q2._id, q3._id]
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
