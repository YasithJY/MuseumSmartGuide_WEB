import mongoose from 'mongoose';

// Content for the "Art, Sculpture & Cultural Heritage" gallery, shared by
// utils/seeder.js (fresh database) and utils/addHeritageExhibits.js (adds
// these records to an existing database without touching anything else).
// IDs are fixed so the frontend's per-exhibit maps (3D models, narration)
// and printed QR codes keep pointing at the same records.

const oid = (hex) => new mongoose.Types.ObjectId(hex);
const paras = (...parts) => parts.join('\n\n');

export const HERITAGE_IDS = {
  categories: {
    sculpture: oid('65d7593c66f50b2984950005'),
    culture: oid('65d7593c66f50b2984950006'),
  },
  gallery: oid('65d75a1d66f50b2984950014'),
  exhibits: {
    nadungamuwaRaja: oid('65d75b0a66f50b2984950029'),
    isurumuniyaLovers: oid('65d75b0a66f50b298495002a'),
    nagarajaGuardstone: oid('65d75b0a66f50b298495002b'),
    parakramabahuStatue: oid('65d75b0a66f50b298495002c'),
  },
};

export const HERITAGE_CATEGORIES = [
  {
    _id: HERITAGE_IDS.categories.sculpture,
    name: 'Sculpture & Stone Carving',
    description: 'Masterpieces of ancient Sri Lankan rock relief, guardstones and stone statuary',
    translations: {
      si: { name: 'මූර්ති සහ ශිලා කැටයම්', description: 'පුරාණ ශ්‍රී ලාංකික ගල් කැටයම්, මුරගල් සහ ශිලා ප්‍රතිමා කලාවේ විශිෂ්ට නිර්මාණ' },
      ta: { name: 'சிற்பம் மற்றும் கற்செதுக்கல்', description: 'பண்டைய இலங்கையின் பாறைப் புடைப்புச் சிற்பங்கள், காவல் கற்கள் மற்றும் கற்சிலைகளின் தலைசிறந்த படைப்புகள்' }
    }
  },
  {
    _id: HERITAGE_IDS.categories.culture,
    name: 'Cultural & Religious Heritage',
    description: 'Living traditions, ceremonies and national treasures of Sri Lanka\'s Buddhist heritage',
    translations: {
      si: { name: 'සංස්කෘතික සහ ආගමික උරුමය', description: 'ශ්‍රී ලාංකික බෞද්ධ උරුමයේ ජීවමාන සම්ප්‍රදායන්, උත්සව සහ ජාතික වස්තු' },
      ta: { name: 'கலாசார மற்றும் சமய பாரம்பரியம்', description: 'இலங்கையின் பௌத்த பாரம்பரியத்தின் வாழும் மரபுகள், சடங்குகள் மற்றும் தேசிய பொக்கிஷங்கள்' }
    }
  }
];

export const buildHeritageGallery = (museumId) => ({
  _id: HERITAGE_IDS.gallery,
  name: 'Art, Sculpture & Cultural Heritage',
  description: 'Masterpieces of ancient Sri Lankan stone sculpture alongside icons of the island\'s living Buddhist and cultural heritage.',
  coverImage: '/uploads/isurumuniya-temple.jpg',
  museumId,
  exhibitsCount: 4,
  translations: {
    si: {
      name: 'කලාව, මූර්ති සහ සංස්කෘතික උරුමය',
      description: 'පුරාණ ශ්‍රී ලාංකික ශිලා මූර්ති කලාවේ විශිෂ්ට නිර්මාණ සහ දිවයිනේ බෞද්ධ හා සංස්කෘතික උරුමයේ සංකේත ගවේෂණය කරන්න.'
    },
    ta: {
      name: 'கலை, சிற்பம் மற்றும் கலாசார பாரம்பரியம்',
      description: 'பண்டைய இலங்கையின் கற்சிற்பக் கலையின் தலைசிறந்த படைப்புகளையும் தீவின் பௌத்த மற்றும் கலாசார பாரம்பரியத்தின் அடையாளங்களையும் ஆராயுங்கள்.'
    }
  }
});

// ─── Nadungamuwa Raja ────────────────────────────────────────────────────────
const nadungamuwaRaja = {
  _id: HERITAGE_IDS.exhibits.nadungamuwaRaja,
  categoryKey: 'culture',
  title: 'Nadungamuwa Raja',
  description: 'Nadungamuwa Raja (c. 1953 – 7 March 2022) was one of Sri Lanka\'s most famous and revered ceremonial tuskers. Widely considered the largest tamed tusker in Asia during his lifetime, he held immense cultural and religious significance in the country, most notably serving as the main casket bearer for the Sacred Tooth Relic at the historic Kandy Esala Perahera.',
  historicalInfo: paras(
    '1. Origins and Background',
    'Birth: Raja was born around 1953 in the stables of the Maharaja of Mysore in India.',
    'Journey to Sri Lanka: He was one of two baby elephants gifted by the Mysore Maharaja to a veteran Sri Lankan physician monk (residing at the Nilammahara Temple in Piliyandala) as a token of gratitude for successfully curing a relative\'s long-standing illness.',
    'Acquisition: After passing through a couple of owners, including a stint at a timber factory, he was purchased in 1978 by an eminent Ayurvedic physician, Dr. Dharmavijaya Veda Ralahamy of Nadungamuwa, for Rs. 75,000. Following the doctor\'s passing, the elephant was looked after by his son, Dr. Harsha Dharmavijaya.',
    '2. Physical Characteristics & Auspicious Signs',
    'Raja was a magnificent specimen, standing approximately 10.5 feet tall. In traditional Sri Lankan culture, elephants chosen for sacred duties must display specific auspicious physical characteristics (lakshana). Raja possessed these markers of greatness:\n• A broad, flat back.\n• A high, unbowed head posture.\n• Long, beautifully curved tusks.\n• The rare "seven extremities" trait, meaning his four legs, trunk, tail, and male organ could all touch the ground simultaneously when standing.',
    '3. Role in the Kandy Esala Perahera',
    'Beginning in 2005, upon the request of the Diyawadana Nilame, Raja took on the prestigious and sacred duty of carrying the Golden Casket containing the Sacred Tooth Relic of the Buddha during the grand finale of the Kandy Esala Perahera. He carried the casket 13 times over the years, up until 2021.',
    'Because of his frail health and advanced age in his later years, and due to his aversion to travelling in heavy transport trucks, Raja famously journeyed on foot from his home in Weliweriya (Gampaha District) all the way to Kandy and back, a gruelling 90 km trek each way. These journeys typically took place leisurely at night under military security and police protection.',
    '4. Cultural Impact and Legacy',
    'National Treasure: In recognition of his immense service to the country\'s Buddhist heritage, the Sri Lankan government issued a commemorative postage stamp and first-day cover in his honour in December 2019.',
    'Death and State Honours: Nadungamuwa Raja passed away on 7 March 2022, at the age of approximately 68, following a brief illness. Upon his death, then-President Gotabaya Rajapaksa declared him a national treasure and accorded him a full state funeral.',
    'Preservation: In accordance with state directives, his mortal remains were taxidermied and placed on public display at the Colombo National Museum so that future generations could witness his majestic stature.',
    'His lifelong bond with his primary caregiver, Wilson Kodithuwakku (affectionately known as "Kalu Mama"), also captured the hearts of the public, symbolising a deep harmony between humans and gentle giants.'
  ),
  timeline: [
    { year: 'c. 1953', title: 'Born in Mysore', description: 'Born in the stables of the Maharaja of Mysore, India, and later gifted to a Sri Lankan physician monk.' },
    { year: '1978', title: 'Arrives at Nadungamuwa', description: 'Purchased for Rs. 75,000 by Ayurvedic physician Dr. Dharmavijaya Veda Ralahamy of Nadungamuwa.' },
    { year: '2005', title: 'Bearer of the Sacred Casket', description: 'Begins carrying the Golden Casket of the Sacred Tooth Relic at the Kandy Esala Perahera.' },
    { year: 'Dec 2019', title: 'Commemorative Stamp', description: 'The government issues a postage stamp and first-day cover in his honour.' },
    { year: '2021', title: 'Thirteenth Perahera', description: 'Carries the Sacred Casket for the 13th and final time.' },
    { year: '7 Mar 2022', title: 'National Treasure', description: 'Passes away aged about 68; declared a national treasure and given a full state funeral, then preserved for display at the Colombo National Museum.' }
  ],
  images: [
    '/uploads/nadungamuwa-raja-1.jpg',
    '/uploads/nadungamuwa-raja-2.jpg',
    '/uploads/nadungamuwa-raja-3.jpg',
    '/uploads/nadungamuwa-raja-4.jpg'
  ],
  translations: {
    si: {
      title: 'නැදුන්ගමුවේ විජය රාජා',
      description: 'නැදුන්ගමුවේ විජය රාජා (1953 පමණ – 2022 මාර්තු 7) ශ්‍රී ලංකාවේ සිටි වඩාත් ප්‍රසිද්ධියට සහ ගෞරවයට පාත්‍ර වූ සංස්කෘතික හා ආගමික පෙරහර ඇතුන්ගෙන් එක් අයෙකි. ඔහු ජීවත්ව සිටි කාලයේ ආසියාවේ සිටි විශාලතම හීලෑ දළ ඇතා ලෙස සැලකුණු අතර, විශේෂයෙන්ම ඓතිහාසික මහනුවර ශ්‍රී දළදා පෙරහරේදී සධාතුක කරඬුව වැඩම කරවීමේ උතුම් කාර්යභාරය ඉටු කළේය. ඒ හේතුවෙන් ඔහුට ශ්‍රී ලාංකික බෞද්ධ සංස්කෘතිය තුළ සුවිශේෂී ස්ථානයක් හිමි විය.',
      historicalInfo: paras(
        '1. ආරම්භය සහ පසුබිම',
        'උපත: රාජා ඇතා 1953 වර්ෂයේ පමණ ඉන්දියාවේ මයිසූර් මහරාජාගේ ඇත්ගාලේදී උපත ලබා ඇත.',
        'ශ්‍රී ලංකාවට පැමිණීම: මයිසූර් මහරාජාගේ ඥාතියෙකු දිගු කලක් පැවති රෝගී තත්ත්වයකින් සුවපත් කිරීම වෙනුවෙන් කෘතගුණ සැලකීමක් ලෙස, ශ්‍රී ලංකාවේ ප්‍රවීණ වෛද්‍ය භික්ෂූන් වහන්සේ නමකට ඇත් පැටවුන් දෙදෙනෙකු තෑගි කර තිබේ. එම ඇත් පැටවුන් දෙදෙනාගෙන් එක් අයෙකු වූයේ රාජා ඇතාය. එම භික්ෂූන් වහන්සේ පදිංචිව සිටියේ පිළියන්දල නිලම්මහර විහාරස්ථානයේය.',
        'අයිතියට පත්වීම: හිමිකරුවන් කිහිපදෙනෙකු අතින් පසු වූ රාජා ඇතා කලක් දැව කර්මාන්ත ශාලාවක ද සේවය කර ඇත. අනතුරුව 1978 වර්ෂයේදී නැදුන්ගමුවේ පදිංචි කීර්තිමත් ආයුර්වේද වෛද්‍යවරයෙකු වූ ධර්මවිජය වෙද රාළහාමි මහතා විසින් රුපියල් 75,000ක මුදලකට මිලදී ගන්නා ලදී. එතුමාගේ අභාවයෙන් පසුව ඔහුගේ පුත් වෛද්‍ය හර්ෂ ධර්මවිජය මහතා විසින් රාජා ඇතා රැකබලා ගන්නා ලදී.',
        '2. ශාරීරික ලක්ෂණ සහ සුවිශේෂී සලකුණු',
        'රාජා ඇතා අඩි 10.5ක පමණ උසකින් යුත් අතිවිශාල දේහයකින් සමන්විත විය. ශ්‍රී ලාංකික සම්ප්‍රදායට අනුව ආගමික පෙරහර සඳහා තෝරාගනු ලබන ඇතුන් සතුව විශේෂ සුබ ලක්ෂණ පැවතීම වැදගත් වේ. රාජා ඇතා සතුව එවැනි සුවිශේෂී ලක්ෂණ කිහිපයක්ම දක්නට ලැබුණි.\n• පළල් සහ සමතලා වූ පිට ප්‍රදේශයක් තිබීම.\n• හිස ඉහළට ඔසවාගෙන ගමන් කිරීමේ ස්වභාවය.\n• දිගු, මනාව වක්‍ර වූ අලංකාර දළ යුගලයක් තිබීම.\n• පාද හතර, හොඬවැල, වලිගය සහ පුරුෂ ලිංගය යන අවයව හතම එකවර පොළොව ස්පර්ශ කළ හැකි සුවිශේෂී ශාරීරික ලක්ෂණය පිහිටීම.',
        'මෙවැනි ලක්ෂණ හේතුවෙන් රාජා ඇතා ආගමික පෙරහර සඳහා ඉතා සුදුසු සුවිශේෂී ඇතෙකු ලෙස සැලකුණි.',
        '3. මහනුවර ශ්‍රී දළදා පෙරහරේ කාර්යභාරය',
        '2005 වර්ෂයේ සිට දියවඩන නිලමේතුමාගේ ඉල්ලීම පරිදි මහනුවර ශ්‍රී දළදා පෙරහරේ අවසන් රන්දෝලි පෙරහරේදී සධාතුක කරඬුව වැඩම කරවීමේ උතුම් වගකීම රාජා ඇතාට පැවරුණි. 2021 වර්ෂය දක්වා වසර ගණනාවක් පුරා අවස්ථා 13කදී ඔහු මෙම භාරදූර කාර්යය ඉටු කළේය.',
        'වයස්ගත වීම සහ සෞඛ්‍ය තත්ත්වය දුර්වල වීම හේතුවෙන් පසුකාලීනව ඔහුට බර වාහනවලින් ගමන් කිරීම අපහසු විය. එබැවින් තම වාසස්ථානය වූ ගම්පහ දිස්ත්‍රික්කයේ වැලිවේරිය ප්‍රදේශයේ සිට මහනුවර දක්වාත් නැවතත් සිය වාසස්ථානය වෙතත් පාගමනින් ගමන් කිරීම සුවිශේෂී විය.',
        'එක් ගමන් වාරයකදී කිලෝමීටර් 90කට ආසන්න දුරක් එක් දිශාවකට ගෙවා දැමීමට ඔහුට සිදු විය. මෙම දීර්ඝ ගමන් සාමාන්‍යයෙන් රාත්‍රී කාලයේදී සිදු වූ අතර, ඒ සඳහා යුද හමුදා සහ පොලිස් ආරක්ෂාව ද ලබා දෙන ලදී.',
        '4. සංස්කෘතික වැදගත්කම සහ උරුමය',
        'ජාතික වස්තුවක් ලෙස පිළිගැනීම: ශ්‍රී ලංකාවේ බෞද්ධ උරුමය වෙනුවෙන් ඉටු කළ අමිල සේවය අගය කරමින් 2019 වර්ෂයේ දෙසැම්බර් මාසයේදී ශ්‍රී ලංකා රජය විසින් රාජා ඇතා වෙනුවෙන් සමරු මුද්දරයක් සහ මුල් දින කවරයක් නිකුත් කරන ලදී.',
        'අභාවය සහ රාජ්‍ය ගෞරව: කෙටි කලක් පැවති රෝගී තත්ත්වයකින් පසුව 2022 මාර්තු 7 වන දින වයස අවුරුදු 68ක් පමණ වන විට රාජා ඇතා මෙලොවින් සමුගත්තේය. ඔහුගේ අභාවයෙන් අනතුරුව එවකට ජනාධිපති ගෝඨාභය රාජපක්ෂ මහතා විසින් රාජා ඇතා ජාතික වස්තුවක් ලෙස ප්‍රකාශයට පත් කර පූර්ණ රාජ්‍ය ගෞරව සහිත අවමංගල්‍ය උත්සවයක් පැවැත්වීමට කටයුතු කරන ලදී.',
        'අනාගත පරපුර වෙනුවෙන් සංරක්ෂණය: රජයේ උපදෙස් අනුව රාජා ඇතාගේ දේහය සංරක්ෂණය කර, පිරවූ ආකෘතියක් ලෙස සකස් කර කොළඹ ජාතික කෞතුකාගාරයේ මහජන ප්‍රදර්ශනය සඳහා තැන්පත් කරන ලදී. එමඟින් අනාගත පරපුරට ද මෙම සුවිශේෂී ඇතාගේ අභිමානවත් ස්වරූපය දැකබලා ගැනීමට අවස්ථාව සැලසී ඇත.',
        'රාජා ඇතාගේ ප්‍රධාන භාරකරු වූ විල්සන් කොඩිතුවක්කු මහතා, ආදරයෙන් \'කළු මාමා\' ලෙස හැඳින්වූ අතර, ඔවුන් දෙදෙනා අතර පැවති සමීප බැඳීම ද මහජනතාවගේ හදවත් දිනා ගැනීමට සමත් විය. එම බැඳීම මිනිසා සහ සත්ත්වයා අතර පැවතිය හැකි ආදරය, විශ්වාසය සහ සහජීවනය මැනවින් පිළිබිඹු කළ සුවිශේෂී උදාහරණයක් විය.',
        'නැදුන්ගමුවේ විජය රාජා යනු හුදෙක් පෙරහරක සධාතුක කරඬුව වැඩම කළ ඇතෙකු පමණක් නොව, ශ්‍රී ලාංකික බෞද්ධ උරුමය, සංස්කෘතිය සහ ජනතාවගේ ගෞරවය දිනාගත් අමරණීය සංකේතයකි.'
      ),
      timeline: [
        { year: 'c. 1953', title: 'මයිසූරුවේ උපත', description: 'ඉන්දියාවේ මයිසූර් මහරාජාගේ ඇත්ගාලේ උපත ලැබූ අතර පසුව ශ්‍රී ලාංකික වෛද්‍ය භික්ෂූන් වහන්සේ නමකට තෑගි කරන ලදී.' },
        { year: '1978', title: 'නැදුන්ගමුවට පැමිණීම', description: 'නැදුන්ගමුවේ ආයුර්වේද වෛද්‍ය ධර්මවිජය වෙද රාළහාමි මහතා විසින් රුපියල් 75,000කට මිලදී ගන්නා ලදී.' },
        { year: '2005', title: 'සධාතුක කරඬුව වැඩම කරවීම', description: 'මහනුවර ඇසළ පෙරහරේදී ශ්‍රී දන්ත ධාතූන් වහන්සේ වැඩ සිටින රන් කරඬුව වැඩම කරවීම ආරම්භ කළේය.' },
        { year: 'Dec 2019', title: 'සමරු මුද්දරය', description: 'රජය විසින් රාජා ඇතා වෙනුවෙන් සමරු මුද්දරයක් සහ මුල් දින කවරයක් නිකුත් කරන ලදී.' },
        { year: '2021', title: 'දහතුන්වන පෙරහර', description: '13 වන සහ අවසන් වරට සධාතුක කරඬුව වැඩම කරවීය.' },
        { year: '7 Mar 2022', title: 'ජාතික වස්තුවක්', description: 'වයස අවුරුදු 68ක් පමණ වියදී අභාවප්‍රාප්ත වූ අතර ජාතික වස්තුවක් ලෙස ප්‍රකාශයට පත් කර රාජ්‍ය ගෞරව සහිතව අවමංගල්‍යය පවත්වා, කොළඹ ජාතික කෞතුකාගාරයේ ප්‍රදර්ශනය සඳහා සංරක්ෂණය කරන ලදී.' }
      ]
    },
    ta: {
      title: 'நெதுங்கமுவே விஜய ராஜா',
      description: 'நெதுங்கமுவே விஜய ராஜா (சுமார் 1953 – 2022 மார்ச் 7) இலங்கையின் மிகவும் புகழ்பெற்ற மற்றும் மதிப்பிற்குரிய சடங்கு ஊர்வல யானைகளில் ஒன்றாக விளங்கினார். அவர் உயிருடன் இருந்த காலத்தில் ஆசியாவிலேயே மிகப்பெரிய பழக்கப்பட்ட தந்தங்களைக் கொண்ட யானையாகக் கருதப்பட்டார். இலங்கையின் கலாசார மற்றும் மத பாரம்பரியத்தில் அவர் மிகுந்த முக்கியத்துவம் பெற்றிருந்தார். குறிப்பாக, வரலாற்றுச் சிறப்புமிக்க கண்டி எசல பெரஹராவின் இறுதி ஊர்வலத்தில் புத்தபெருமானின் புனித தந்த தாதுவை உள்ளடக்கிய புனிதப் பேழையைச் சுமந்து செல்லும் முதன்மை யானையாகப் பணியாற்றினார்.',
      historicalInfo: paras(
        '1. தோற்றமும் பின்னணியும்',
        'பிறப்பு: ராஜா சுமார் 1953ஆம் ஆண்டு இந்தியாவின் மைசூர் மகாராஜாவின் யானைகள் பராமரிப்பு நிலையத்தில் பிறந்தார்.',
        'இலங்கைக்கான பயணம்: மைசூர் மகாராஜாவின் உறவினர் ஒருவர் நீண்டகாலமாகப் பாதிக்கப்பட்டிருந்த நோயிலிருந்து குணமடையச் செய்தமைக்காக நன்றியுணர்வின் அடையாளமாக, இலங்கையைச் சேர்ந்த மூத்த வைத்தியத் துறவி ஒருவருக்கு இரண்டு யானைக் குட்டிகள் அன்பளிப்பாக வழங்கப்பட்டன. அந்தத் துறவி பிலியந்தலை நிலம்மஹர விகாரையில் வசித்து வந்தார். அந்த இரண்டு யானைக் குட்டிகளில் ஒன்றே ராஜா ஆவார்.',
        'உரிமைக்கு வந்த விதம்: சில உரிமையாளர்களைக் கடந்து, ஒரு காலப்பகுதியில் மரத்தொழிற்சாலையிலும் பணியாற்றிய பின்னர், 1978ஆம் ஆண்டு நெதுங்கமுவையைச் சேர்ந்த புகழ்பெற்ற ஆயுர்வேத வைத்தியரான டாக்டர் தர்மவிஜய வேத ராளஹாமி அவர்களால் 75,000 ரூபாய்க்கு ராஜா வாங்கப்பட்டார். வைத்தியரின் மறைவுக்குப் பின்னர், அவரது மகனான டாக்டர் ஹர்ஷ தர்மவிஜய ராஜாவைப் பராமரித்து வந்தார்.',
        '2. உடல் அமைப்பும் மங்களகரமான இலட்சணங்களும்',
        'ராஜா சுமார் 10.5 அடி உயரம் கொண்ட கம்பீரமான யானையாக விளங்கினார். இலங்கை பாரம்பரியத்தின்படி, புனிதமான சமயக் கடமைகளுக்காகத் தேர்ந்தெடுக்கப்படும் யானைகள் குறிப்பிட்ட மங்களகரமான உடல் இலட்சணங்களைக் கொண்டிருக்க வேண்டும். அவ்வாறான பல சிறப்பம்சங்கள் ராஜாவிடம் காணப்பட்டன.\n• அகலமான மற்றும் சமதளமான முதுகுப் பகுதியைக் கொண்டிருந்தார்.\n• தலையை உயர்த்திய நிலையில் கம்பீரமாக நிற்கும் தன்மையைக் கொண்டிருந்தார்.\n• நீளமான, அழகாக வளைந்த தந்தங்களைக் கொண்டிருந்தார்.\n• அரிதாகக் காணப்படும் ஏழு உறுப்புகளும் ஒரே நேரத்தில் நிலத்தைத் தொடும் சிறப்பியல்பைக் கொண்டிருந்தார். அதாவது, அவரது நான்கு கால்கள், தும்பிக்கை, வால் மற்றும் ஆண் உறுப்பு ஆகிய ஏழு உறுப்புகளும் ஒரே நேரத்தில் தரையைத் தொடக்கூடிய தன்மையைக் கொண்டிருந்தன.',
        '3. கண்டி எசல பெரஹராவில் ஆற்றிய பங்கு',
        '2005ஆம் ஆண்டு முதல் தியவடன நிலமே அவர்களின் வேண்டுகோளுக்கு இணங்க, கண்டி ஸ்ரீ தலதா மாளிகையின் எசல பெரஹராவின் இறுதி ரந்தோலி பெரஹராவில் புத்தபெருமானின் புனித தந்த தாதுவை உள்ளடக்கிய தங்கப் பேழையைச் சுமந்து செல்லும் புனிதமான பொறுப்பு ராஜாவிடம் ஒப்படைக்கப்பட்டது. 2021ஆம் ஆண்டு வரை பல ஆண்டுகளில் மொத்தம் 13 முறை அவர் இந்தப் புனிதப் பணியை நிறைவேற்றினார்.',
        'தனது இறுதிக் காலங்களில் முதுமை மற்றும் பலவீனமான உடல்நிலை காரணமாகவும், கனரக வாகனங்களில் பயணம் செய்வதை விரும்பாததாலும், ராஜா தனது வசிப்பிடமான கம்பஹா மாவட்டத்தின் வெலிவேரிய பகுதியிலிருந்து கண்டி வரை கால்நடையாகப் பயணம் செய்து மீண்டும் தனது இருப்பிடத்திற்குத் திரும்புவது வழக்கமாக இருந்தது.',
        'ஒவ்வொரு பயணத்திலும் ஒரு திசையில் சுமார் 90 கிலோமீட்டர் தூரத்தை அவர் கடந்து சென்றார். இந்த நீண்ட பயணங்கள் பொதுவாக இரவு நேரங்களில் மெதுவாக மேற்கொள்ளப்பட்டதுடன், இராணுவம் மற்றும் பொலிஸாரின் பாதுகாப்பும் வழங்கப்பட்டது.',
        '4. கலாசாரத் தாக்கமும் மரபுரிமையும்',
        'தேசிய பொக்கிஷம்: நாட்டின் பௌத்த பாரம்பரியத்திற்காக அவர் ஆற்றிய அளப்பரிய சேவையைப் பாராட்டி, 2019ஆம் ஆண்டு டிசம்பர் மாதம் இலங்கை அரசாங்கத்தினால் ராஜாவின் நினைவாக நினைவு தபால் முத்திரையும் முதல் நாள் அட்டையும் வெளியிடப்பட்டன.',
        'மரணமும் அரச மரியாதையும்: குறுகியகால நோய்வாய்ப்பாட்டைத் தொடர்ந்து, சுமார் 68 வயதில் 2022 மார்ச் 7ஆம் திகதி நெதுங்கமுவே ராஜா உயிரிழந்தார். அவரது மறைவையடுத்து, அப்போதைய ஜனாதிபதி கோட்டாபய ராஜபக்ஷ அவரை ஒரு தேசிய பொக்கிஷமாக அறிவித்ததுடன், முழுமையான அரச மரியாதையுடன் இறுதிச் சடங்குகளும் நடத்தப்பட்டன.',
        'எதிர்கால சந்ததியினருக்கான பாதுகாப்பு: அரசாங்கத்தின் அறிவுறுத்தலுக்கு அமைவாக, ராஜாவின் உடல் பதப்படுத்தப்பட்டு, அவரது கம்பீரமான தோற்றத்தை எதிர்கால சந்ததியினரும் காணும் வகையில் கொழும்பு தேசிய அருங்காட்சியகத்தில் பொதுமக்களின் பார்வைக்காகக் காட்சிப்படுத்தப்பட்டது.',
        'ராஜாவின் வாழ்நாள் முழுவதும் அவரை அன்புடன் பராமரித்து வந்த வில்சன் கொடிதுவக்கு அவர்கள், \'களு மாமா\' எனப் பாசத்துடன் அழைக்கப்பட்டார். அவருக்கும் ராஜாவுக்கும் இடையில் நிலவிய ஆழமான பாசப்பிணைப்பு பொதுமக்களின் மனங்களையும் வெகுவாகக் கவர்ந்தது. மனிதர்களுக்கும் மென்மையான இயல்புடைய விலங்குகளுக்கும் இடையில் நிலவக்கூடிய அன்பு, நம்பிக்கை மற்றும் நல்லிணக்கத்திற்கு அவர்களது உறவு ஒரு சிறந்த எடுத்துக்காட்டாக அமைந்தது.',
        'நெதுங்கமுவே விஜய ராஜா ஒரு பெரஹராவில் புனிதப் பேழையைச் சுமந்து சென்ற யானை மட்டுமல்ல. அவர் இலங்கையின் பௌத்த பாரம்பரியம், கலாசாரம் மற்றும் மக்களின் மதிப்பையும் அன்பையும் பெற்ற ஒரு அழியாத அடையாளமாகத் திகழ்கிறார்.'
      ),
      timeline: [
        { year: 'c. 1953', title: 'மைசூரில் பிறப்பு', description: 'இந்தியாவின் மைசூர் மகாராஜாவின் யானை நிலையத்தில் பிறந்து, பின்னர் இலங்கை வைத்தியத் துறவி ஒருவருக்கு அன்பளிப்பாக வழங்கப்பட்டார்.' },
        { year: '1978', title: 'நெதுங்கமுவைக்கு வருகை', description: 'நெதுங்கமுவையைச் சேர்ந்த ஆயுர்வேத வைத்தியர் டாக்டர் தர்மவிஜய வேத ராளஹாமி அவர்களால் 75,000 ரூபாய்க்கு வாங்கப்பட்டார்.' },
        { year: '2005', title: 'புனிதப் பேழையைச் சுமத்தல்', description: 'கண்டி எசல பெரஹராவில் புனித தந்த தாதுவின் தங்கப் பேழையைச் சுமக்கத் தொடங்கினார்.' },
        { year: 'Dec 2019', title: 'நினைவு தபால் முத்திரை', description: 'அவரின் நினைவாக அரசாங்கம் தபால் முத்திரையும் முதல் நாள் அட்டையும் வெளியிட்டது.' },
        { year: '2021', title: 'பதின்மூன்றாவது பெரஹரா', description: '13ஆவது மற்றும் இறுதி முறையாகப் புனிதப் பேழையைச் சுமந்தார்.' },
        { year: '7 Mar 2022', title: 'தேசிய பொக்கிஷம்', description: 'சுமார் 68 வயதில் உயிரிழந்தார்; தேசிய பொக்கிஷமாக அறிவிக்கப்பட்டு அரச மரியாதையுடன் இறுதிச் சடங்குகள் நடத்தப்பட்டு, கொழும்பு தேசிய அருங்காட்சியகத்தில் காட்சிக்காகப் பாதுகாக்கப்பட்டார்.' }
      ]
    }
  }
};

// ─── Isurumuniya Lovers ──────────────────────────────────────────────────────
const isurumuniyaLovers = {
  _id: HERITAGE_IDS.exhibits.isurumuniyaLovers,
  categoryKey: 'sculpture',
  title: 'Isurumuniya Lovers',
  description: 'The Isurumuni Pem Yuwala (commonly known as the Isurumuniya Lovers) is one of ancient Sri Lanka\'s most celebrated and enigmatic stone carvings. Located at the historic Isurumuniya Temple in Anuradhapura, this low-relief sculpture dates back to the Anuradhapura Kingdom (circa 5th or 6th century AD) and is admired for its artistic mastery and expressive emotion.',
  historicalInfo: paras(
    'Artistic Composition',
    'The sculpture depicts a man and a woman in a gentle, affectionate embrace. The male figure is seated in a relaxed posture (lalitasana) with a sword resting across his lap, while the female figure sits on his lap, leaning back slightly with a subtle, modest expression of shyness.',
    'Cultural and Historical Theories',
    'Archaeologists and historians have debated the identities behind the carving. Popular folklore links the figures to Prince Saliya (son of King Dutugemunu) and his lower-caste consort Asokamala, for whom the prince famously renounced his claim to the throne. Other scholarly theories suggest the carving represents Hindu deities such as Shiva and Parvati or a royal noble couple.',
    'Location Context',
    'Housed within the sacred site of Isurumuniya, situated near the Tissa Wewa reservoir in Anuradhapura, the sculpture is displayed alongside other world-renowned rock carvings like the Isurumuniya "Royal Family" and the "Man and Horse" rock relief.'
  ),
  timeline: [
    { year: '2nd century BC', title: 'Prince Saliya and Asokamala', description: 'Folklore places the love story of Prince Saliya, son of King Dutugemunu, and Asokamala in this era.' },
    { year: '5th – 6th century AD', title: 'Carving of the Lovers', description: 'The low-relief sculpture is carved during the Anuradhapura Kingdom, in the Isurumuniya temple complex near Tissa Wewa.' }
  ],
  images: [
    '/uploads/isurumuniya-lovers-1.jpg',
    '/uploads/isurumuniya-lovers-2.jpg',
    '/uploads/isurumuniya-temple.jpg'
  ],
  translations: {
    si: {
      title: 'ඉසුරුමුණි පෙම් යුවළ',
      description: 'ඉසුරුමුණි පෙම් යුවළ යනු පුරාණ ශ්‍රී ලංකාවේ වඩාත් ප්‍රසිද්ධියට පත් වූත්, අභිරහස් බවින් යුක්ත වූත් ශිලා කැටයම් නිර්මාණයකි. අනුරාධපුරයේ ඓතිහාසික ඉසුරුමුණි විහාරස්ථානයේ පිහිටා ඇති මෙම කැටයම ක්‍රිස්තු වර්ෂ 5 වන හෝ 6 වන සියවසට පමණ අයත් වන අතර, අනුරාධපුර රාජධානි සමයට අයත් කලා නිර්මාණයක් ලෙස සැලකේ. එහි ඇති විශිෂ්ට කලාත්මක නිර්මාණශීලීත්වය සහ හැඟීම් ප්‍රකාශ කිරීමේ අපූර්වත්වය හේතුවෙන් මෙම කැටයම ඉමහත් ප්‍රසිද්ධියක් උසුලයි.',
      historicalInfo: paras(
        '1. කලාත්මක නිර්මාණය',
        'මෙම ශිලා කැටයමෙන් පුරුෂයෙකු සහ කාන්තාවක එකිනෙකාට සමීපව, ආදරණීය ඉරියව්වකින් සිටින ආකාරය නිරූපණය කර ඇත. පුරුෂ රූපය සැහැල්ලු ඉරියව්වකින් (ලලිතාසනයෙන්) අසුන්ගෙන සිටින අතර, ඔහුගේ උකුළ මත කඩුවක් ද තබා ඇත. කාන්තා රූපය ඔහුගේ උකුළ මත අසුන්ගෙන මඳක් පිටුපසට නැඹුරු වී සිටින අතර, ඇගේ මුහුණෙන් ලැජ්ජාශීලී සහ සංයමශීලී ස්වභාවයක් ප්‍රකාශ වේ.',
        '2. සංස්කෘතික හා ඓතිහාසික මතවාද',
        'මෙම කැටයමෙන් නිරූපණය වන පුද්ගලයන් කවුරුන්ද යන්න පිළිබඳව පුරාවිද්‍යාඥයන් සහ ඉතිහාසඥයන් අතර විවිධ මතවාද පවතී.',
        'ජනප්‍රවාදයට අනුව, මෙම රූප දෙක දුටුගැමුණු රජුගේ පුත් සාලිය කුමරු සහ ඔහුගේ පහත් කුලයකට අයත් පෙම්වතිය වූ අශෝකමාලා නිරූපණය කරන බව පැවසේ. අශෝකමාලා කෙරෙහි ඇති වූ ආදරය හේතුවෙන් සාලිය කුමරු රාජ්‍යත්වයට ඇති තම උරුමය පවා අත්හැර දැමූ බව ප්‍රකට කතාවකි.',
        'කෙසේ වෙතත්, තවත් විද්වත් මතයකට අනුව මෙම කැටයමෙන් හින්දු දෙවිවරුන් වන ශිව සහ පාර්වතී නිරූපණය වන බවට හෝ රාජකීය යුවළක් නිරූපණය වන බවට ද අදහස් ඉදිරිපත් වී ඇත.',
        '3. පිහිටීම සහ ඓතිහාසික පසුබිම',
        'මෙම සුවිශේෂී ශිලා කැටයම අනුරාධපුරයේ තිසා වැව ආසන්නයේ පිහිටි පූජනීය ඉසුරුමුණි විහාරස්ථානයේදී දැකගත හැකිය.',
        'ඉසුරුමුණි පෙම් යුවළ කැටයමට අමතරව, ලෝක ප්‍රසිද්ධියට පත් ඉසුරුමුණි රාජකීය පවුල සහ මිනිසා හා අශ්වයා දැක්වෙන ශිලා කැටයම් ද මෙම විහාරස්ථානයේ පිහිටා ඇත.',
        'ඉසුරුමුණි පෙම් යුවළ යනු පුරාණ ශ්‍රී ලාංකික ශිල්පීන්ගේ අසමසම නිර්මාණශීලීත්වය, කලාත්මක හැකියාව සහ මානව හැඟීම් ගල් මත ජීවමාන කිරීමට තිබූ අපූර්ව හැකියාව මැනවින් පිළිබිඹු කරන වටිනා ඓතිහාසික කලා නිර්මාණයකි.'
      ),
      timeline: [
        { year: '2nd century BC', title: 'සාලිය කුමරු සහ අශෝකමාලා', description: 'ජනප්‍රවාදයට අනුව දුටුගැමුණු රජුගේ පුත් සාලිය කුමරු සහ අශෝකමාලාගේ ප්‍රේම කතාව මෙම යුගයට අයත් වේ.' },
        { year: '5th – 6th century AD', title: 'පෙම් යුවළ කැටයම් කිරීම', description: 'අනුරාධපුර රාජධානි සමයේදී තිසා වැව අසල ඉසුරුමුණි විහාරස්ථානයේ මෙම ශිලා කැටයම නිර්මාණය කරන ලදී.' }
      ]
    },
    ta: {
      title: 'இஸுருமுனிய காதலர்கள்',
      description: 'இஸுருமுனிய காதலர்கள் என்பது பண்டைய இலங்கையின் மிகவும் புகழ்பெற்ற மற்றும் மர்மம் நிறைந்த கற்சிற்பங்களில் ஒன்றாகும். அநுராதபுரத்தில் அமைந்துள்ள வரலாற்றுச் சிறப்புமிக்க இஸுருமுனிய விகாரையில் காணப்படும் இச்சிற்பம், அநுராதபுர இராச்சியக் காலத்தைச் சேர்ந்ததாகும். இது கி.பி. 5 அல்லது 6ஆம் நூற்றாண்டில் உருவாக்கப்பட்டதாகக் கருதப்படுகிறது. சிறந்த கலைத்திறனையும் மனித உணர்வுகளை வெளிப்படுத்தும் நுட்பத்தையும் கொண்டுள்ளதால் இச்சிற்பம் பெரிதும் போற்றப்படுகிறது.',
      historicalInfo: paras(
        '1. கலைநயமிக்க சிற்ப அமைப்பு',
        'இந்தச் சிற்பத்தில் ஓர் ஆணும் பெண்ணும் மென்மையான, அன்பு நிறைந்த அணைப்பில் இருப்பது போன்று சித்தரிக்கப்பட்டுள்ளனர். ஆண் உருவம் லலிதாசன நிலையில் (Lalitasana) சற்றுத் தளர்வான தோரணையில் அமர்ந்துள்ளது. அவரது மடியில் ஒரு வாளும் வைக்கப்பட்டுள்ளது. பெண் உருவம் அவரது மடியில் அமர்ந்து சற்றுப் பின்னால் சாய்ந்த நிலையில் காணப்படுகிறது. அவரது முகத்தில் மென்மையான வெட்கமும் அடக்கமான உணர்வும் வெளிப்படுகின்றன.',
        '2. கலாசார மற்றும் வரலாற்று ஆய்வுக் கருத்துகள்',
        'இந்தச் சிற்பத்தில் சித்தரிக்கப்பட்டுள்ள நபர்கள் யார் என்பது குறித்து தொல்பொருள் ஆய்வாளர்கள் மற்றும் வரலாற்று அறிஞர்களிடையே பல்வேறு கருத்துகள் நிலவுகின்றன.',
        'பிரபலமான நாட்டுப்புறக் கதைகளின்படி, இந்த உருவங்கள் மன்னர் துட்டகைமுனுவின் மகனான சாலிய இளவரசரையும், அவருடைய காதலியான அசோகமாலாவையும் பிரதிபலிப்பதாகக் கூறப்படுகிறது. அசோகமாலா தாழ்ந்த குலத்தைச் சேர்ந்தவர் என்பதால், அவரைத் திருமணம் செய்வதற்காக சாலிய இளவரசர் தனது அரச உரிமையையும் அரியணை ஏறும் வாய்ப்பையும் துறந்ததாகப் புகழ்பெற்ற வரலாற்றுக் கதை கூறுகிறது.',
        'எனினும், வேறு சில ஆய்வுக் கருத்துகளின்படி, இச்சிற்பம் இந்து தெய்வங்களான சிவன் மற்றும் பார்வதியை அல்லது ஓர் அரச குடும்பத்தைச் சேர்ந்த உயர்குடி தம்பதியினரைச் சித்தரிப்பதாகவும் கருதப்படுகிறது.',
        '3. அமைவிடம் மற்றும் வரலாற்றுப் பின்னணி',
        'இந்தச் சிறப்புமிக்க கற்சிற்பம், அநுராதபுரத்தில் திஸ்ஸ வாவி நீர்த்தேக்கத்திற்கு அருகில் அமைந்துள்ள புனிதமான இஸுருமுனிய விகாரை வளாகத்தில் காணப்படுகிறது.',
        'இஸுருமுனிய காதலர்கள் சிற்பத்துடன், உலகப் புகழ்பெற்ற இஸுருமுனிய அரச குடும்பச் சிற்பம் மற்றும் மனிதன் மற்றும் குதிரை ஆகியவற்றைச் சித்தரிக்கும் பாறைச் சிற்பம் போன்ற பிற வரலாற்றுச் சிறப்புமிக்க கலைப்படைப்புகளும் இவ்விகாரை வளாகத்தில் காட்சிப்படுத்தப்பட்டுள்ளன.',
        'இஸுருமுனிய காதலர்கள் சிற்பம் என்பது பண்டைய இலங்கைச் சிற்பிகளின் ஒப்பற்ற படைப்பாற்றலையும் கலைத்திறனையும், மனித உணர்வுகளை கல்லில் உயிர்ப்பிக்கும் அவர்களின் அற்புதமான ஆற்றலையும் வெளிப்படுத்தும் ஒரு பெறுமதிமிக்க வரலாற்றுக் கலைப்படைப்பாகும்.'
      ),
      timeline: [
        { year: '2nd century BC', title: 'சாலிய இளவரசரும் அசோகமாலாவும்', description: 'நாட்டுப்புறக் கதைகளின்படி, மன்னர் துட்டகைமுனுவின் மகன் சாலிய இளவரசர் மற்றும் அசோகமாலாவின் காதல் கதை இக்காலத்தைச் சேர்ந்தது.' },
        { year: '5th – 6th century AD', title: 'காதலர் சிற்பம் செதுக்கப்படல்', description: 'அநுராதபுர இராச்சியக் காலத்தில் திஸ்ஸ வாவிக்கு அருகிலுள்ள இஸுருமுனிய விகாரையில் இப்புடைப்புச் சிற்பம் செதுக்கப்பட்டது.' }
      ]
    }
  }
};

// ─── Nagaraja Guardstone at the Ratna Prasada ────────────────────────────────
const nagarajaGuardstone = {
  _id: HERITAGE_IDS.exhibits.nagarajaGuardstone,
  categoryKey: 'sculpture',
  title: 'Nagaraja Guardstone',
  description: 'The Nagaraja Guardstone (often referred to as the guardstone or mura gala with a cobra king figure) found at the ruins of Ratna Prasada in Anuradhapura is widely considered the finest and most well-preserved specimen of ancient Sri Lankan sculptural art.',
  historicalInfo: paras(
    'Architectural and Cultural Significance',
    'Located at the entrance of the ancient Ratna Prasada (Gem Palace), a multi-storey monastic building constructed by King Kanitta Tissa in the 2nd century AD. These guardstones were traditionally placed at building thresholds to symbolise protection, prosperity, and auspiciousness.',
    'Iconography',
    'The sculpture depicts a majestic Nagaraja (King of Cobras) standing in a graceful, royal posture. He is adorned with ornate jewellery, a multi-headed cobra hood (phan) radiating behind his head like a halo, and holds a punakalasa (pot of abundance) in one hand and a flowering branch in the other.',
    'The Dwarf Guardians (Ganas)',
    'Flanking the main figure or carved nearby are playful dwarf figures (ganas), often depicted holding attributes like money bags or expressing various humorous emotions, representing wealth and attendants to the protective deity.',
    'Artistic Mastery',
    'The carving exemplifies the pinnacle of Anuradhapura-period stone masonry, showcasing intricate detailing in the headdress, drapery, and facial expression, conveying a sense of serene authority and divine protection.'
  ),
  timeline: [
    { year: '2nd century AD', title: 'Ratna Prasada Built', description: 'King Kanitta Tissa constructs the Ratna Prasada (Gem Palace), a multi-storey monastic building in Anuradhapura.' },
    { year: 'Anuradhapura Period', title: 'Guardian at the Threshold', description: 'The Nagaraja guardstone is set at the entrance, a high point of Anuradhapura-period stone carving.' }
  ],
  images: [
    '/uploads/nagaraja-guardstone-1.jpg'
  ],
  translations: {
    si: {
      title: 'රත්න ප්‍රාසාදයේ නාගරාජ මුරගල',
      description: 'අනුරාධපුරයේ රත්න ප්‍රාසාද නටබුන් අතරින් හමුවන නාගරාජ මුරගල (නාග රජුගේ රුව සහිත මුරගල හෙවත් මුරගල) පුරාණ ශ්‍රී ලාංකික මූර්ති කලාවේ විශිෂ්ටතම සහ වඩාත් හොඳින් සංරක්ෂණය වී ඇති නිර්මාණයක් ලෙස සැලකේ.',
      historicalInfo: paras(
        '1. වාස්තු විද්‍යාත්මක හා සංස්කෘතික වැදගත්කම',
        'මෙම මුරගල පිහිටා ඇත්තේ ක්‍රිස්තු වර්ෂ දෙවන සියවසේදී කනිට්ඨතිස්ස රජු විසින් ඉදිකරන ලද බහුමහල් සංඝාරාම ගොඩනැගිල්ලක් වන පුරාණ රත්න ප්‍රාසාදයේ (මැණික් මාලිගය) පිවිසුම් දොරටුව අසලය.',
        'පුරාණ සම්ප්‍රදායට අනුව ගොඩනැගිලිවල පිවිසුම් ස්ථාන දෙපස මුරගල් තැන්පත් කර තිබුණි. ඒවා මඟින් ආරක්ෂාව, සෞභාග්‍යය සහ ශුභ සංකේතවත් කිරීම අපේක්ෂා කරන ලදී.',
        '2. මූර්තිමය නිරූපණය',
        'මෙම මූර්තියෙන් රාජකීය ගාම්භීරත්වයකින් යුතුව අලංකාර ඉරියව්වකින් සිටින නාගරාජයෙකු නිරූපණය කර ඇත. ඔහු විවිධ අලංකාර ආභරණවලින් සැරසී සිටින අතර, හිස පිටුපසින් විහිදෙන බහු ශීර්ෂ සහිත නාග පෙණය ප්‍රභාමණ්ඩලයක් මෙන් දිස්වේ.',
        'එක් අතක සෞභාග්‍යය හා සම්පත් සංකේතවත් කරන පූර්ණ ඝටය හෙවත් පුණ්‍යකලසය ද, අනෙක් අතෙහි මල් පිපුණු අත්තක් ද රඳවාගෙන සිටින අයුරින් මෙම රුව නිර්මාණය කර ඇත.',
        '3. වාමන ආරක්ෂක රූප (ගණයන්)',
        'ප්‍රධාන නාගරාජ රූපය දෙපස හෝ ඊට ආසන්න ප්‍රදේශවල විවිධ ඉරියව්වලින් යුත් වාමන රූප හෙවත් ගණ රූප ද කැටයම් කර ඇත.',
        'මෙම රූප ඇතැම් විට ධන මලු අතැතිව හෝ හාස්‍යජනක හැඟීම් ප්‍රකාශ කරන ඉරියව්වලින් නිරූපණය කර තිබේ. ඒවා ධනය හා සෞභාග්‍යය නියෝජනය කරන අතර, ආරක්ෂක දේවතාවාගේ සහායකයන් ලෙස ද සැලකේ.',
        '4. කලාත්මක විශිෂ්ටත්වය',
        'මෙම මුරගල අනුරාධපුර යුගයේ ගල් කැටයම් කලාවේ ඉහළම නිපුණත්වය මැනවින් විදහා දක්වන නිර්මාණයකි. හිස් පළඳනාව, ඇඳුම්වල නැමීම් සහ මුහුණේ ඉරියව් ඉතා සියුම්ව හා විස්තරාත්මකව කැටයම් කර තිබීම එහි විශේෂත්වයකි.',
        'මෙම නිර්මාණය තුළින් සන්සුන් රාජකීය ගාම්භීරත්වයක් මෙන්ම දිව්‍යමය ආරක්ෂාව පිළිබඳ හැඟීමක් ද මැනවින් ප්‍රකාශ වේ.',
        'රත්න ප්‍රාසාදයේ නාගරාජ මුරගල යනු පුරාණ ශ්‍රී ලාංකිකයන්ගේ ආගමික විශ්වාසයන්, වාස්තු විද්‍යාත්මක සම්ප්‍රදායන් සහ අසමසම ශිල්පීය හැකියාවන් එකට කැටි වූ වටිනා ඓතිහාසික කලා නිර්මාණයකි.'
      ),
      timeline: [
        { year: '2nd century AD', title: 'රත්න ප්‍රාසාදය ඉදිකිරීම', description: 'කනිට්ඨතිස්ස රජු විසින් අනුරාධපුරයේ බහුමහල් සංඝාරාම ගොඩනැගිල්ලක් වන රත්න ප්‍රාසාදය (මැණික් මාලිගය) ඉදිකරන ලදී.' },
        { year: 'Anuradhapura Period', title: 'පිවිසුමේ ආරක්ෂකයා', description: 'අනුරාධපුර යුගයේ ගල් කැටයම් කලාවේ උච්චතම අවස්ථාවක් වන නාගරාජ මුරගල පිවිසුම් දොරටුව අසල තැන්පත් කරන ලදී.' }
      ]
    },
    ta: {
      title: 'ரத்ன பிரசாதத்தின் நாகராஜா காவல் சிற்பம்',
      description: 'அநுராதபுரத்தில் அமைந்துள்ள ரத்ன பிரசாதத்தின் இடிபாடுகளுக்கு அருகில் காணப்படும் நாகராஜா காவல் சிற்பம் (நாக அரசனின் உருவம் பொறிக்கப்பட்ட காவல் கல் அல்லது முரகல) பண்டைய இலங்கையின் சிற்பக் கலையில் மிகச்சிறந்ததும் சிறப்பாகப் பாதுகாக்கப்பட்டதுமான கலைப்படைப்புகளில் ஒன்றாகக் கருதப்படுகிறது.',
      historicalInfo: paras(
        '1. கட்டிடக்கலை மற்றும் கலாசார முக்கியத்துவம்',
        'இந்தக் காவல் சிற்பம், கி.பி. இரண்டாம் நூற்றாண்டில் கனிட்ட திஸ்ஸ மன்னரால் நிர்மாணிக்கப்பட்ட பல மாடிகளைக் கொண்ட பௌத்த மடாலயக் கட்டிடமான பண்டைய ரத்ன பிரசாதத்தின் (மாணிக்க மாளிகை) நுழைவாயிலில் அமைந்துள்ளது.',
        'பண்டைய மரபின்படி, கட்டிடங்களின் நுழைவாயில்களில் பாதுகாப்புக் கற்கள் அல்லது முரகல்கள் நிறுவப்பட்டன. இவை பாதுகாப்பு, செழிப்பு மற்றும் மங்களகரமான தன்மையின் அடையாளங்களாகக் கருதப்பட்டன.',
        '2. சிற்ப வடிவமைப்பு',
        'இந்தச் சிற்பத்தில் நாகராஜா (நாகங்களின் அரசன்) கம்பீரமான அரச தோரணையுடன் அழகிய நிலையில் நின்றிருப்பது போன்று சித்தரிக்கப்பட்டுள்ளார்.',
        'அவர் நுணுக்கமான அலங்கார ஆபரணங்களால் அலங்கரிக்கப்பட்டுள்ளார். அவரது தலைக்குப் பின்னால் பல தலைகளைக் கொண்ட நாகப்படம் ஒளிவட்டம் போன்ற தோற்றத்தில் விரிந்து காணப்படுகிறது.',
        'அவரது ஒரு கையில் செல்வச் செழிப்பையும் வளத்தையும் குறிக்கும் பூரண கலசமும் (புண்ண கலசம்), மற்றொரு கையில் மலர்கள் பூத்த கிளையொன்றும் காணப்படுகின்றன.',
        '3. குள்ளக் காவலர் உருவங்கள் (கணங்கள்)',
        'பிரதான நாகராஜா உருவத்தின் இருபுறங்களிலும் அல்லது அதற்கு அருகிலுள்ள பகுதிகளிலும் விளையாட்டுத்தனமான தோற்றமுடைய குள்ள உருவங்களான கணங்கள் செதுக்கப்பட்டுள்ளன.',
        'இந்த உருவங்கள் சிலவற்றில் பணப்பைகள் போன்றவற்றை ஏந்தியவாறும், வேறு சிலவற்றில் நகைச்சுவையான முகபாவனைகளை வெளிப்படுத்தியவாறும் காணப்படுகின்றன. இவை செல்வத்தையும் வளத்தையும் பிரதிநிதித்துவப்படுத்துவதுடன், பாதுகாவல் தெய்வத்தின் உதவியாளர்களாகவும் கருதப்படுகின்றன.',
        '4. கலைத்திறனின் மேன்மை',
        'இந்தச் சிற்பம் அனுராதபுர காலத்தின் கற்சிற்பக் கலையின் உச்சக்கட்டத் திறமையை வெளிப்படுத்தும் சிறந்த எடுத்துக்காட்டாகும்.',
        'தலை அலங்காரங்கள், ஆடைகளின் மடிப்புகள் மற்றும் முகபாவனைகள் போன்றவை மிக நுணுக்கமாகவும் விரிவான விவரங்களுடனும் செதுக்கப்பட்டுள்ளன. இச்சிற்பம் அமைதியான அரச கம்பீரத்தையும் தெய்வீகப் பாதுகாப்பையும் ஒருங்கே வெளிப்படுத்துகிறது.',
        'ரத்ன பிரசாதத்தின் நாகராஜா காவல் சிற்பம் என்பது பண்டைய இலங்கையர்களின் சமய நம்பிக்கைகள், கட்டிடக்கலை மரபுகள் மற்றும் ஒப்பற்ற சிற்பத் திறன்களை ஒருங்கிணைத்து வெளிப்படுத்தும் பெறுமதிமிக்க வரலாற்றுக் கலைப்படைப்பாகும்.'
      ),
      timeline: [
        { year: '2nd century AD', title: 'ரத்ன பிரசாதம் நிர்மாணம்', description: 'கனிட்ட திஸ்ஸ மன்னர் அநுராதபுரத்தில் பல மாடிகளைக் கொண்ட பௌத்த மடாலயக் கட்டிடமான ரத்ன பிரசாதத்தை (மாணிக்க மாளிகை) நிர்மாணித்தார்.' },
        { year: 'Anuradhapura Period', title: 'நுழைவாயிலின் காவலர்', description: 'அனுராதபுர காலக் கற்சிற்பக் கலையின் உச்சமாக விளங்கும் நாகராஜா காவல் சிற்பம் நுழைவாயிலில் நிறுவப்பட்டது.' }
      ]
    }
  }
};

// ─── Statue of King Parakramabahu ────────────────────────────────────────────
const parakramabahuStatue = {
  _id: HERITAGE_IDS.exhibits.parakramabahuStatue,
  categoryKey: 'sculpture',
  title: 'Statue of King Parakramabahu',
  description: 'The Statue of King Parakramabahu is an 11.5-foot (3.5-metre) tall stone sculpture carved directly into a large granite boulder near the Potgul Vehera in Polonnaruwa, Sri Lanka. Dating back to the 12th century, it remains one of the most iconic and debated works of ancient Sri Lankan art.',
  historicalInfo: paras(
    'Physical Features',
    'The figure is carved in high relief, depicting a dignified man with a prominent beard, a rounded belly, and a serene expression. He wears a simple lower garment (dhoti) and lacks traditional royal jewellery or a crown. His hair is tied in an ascetic, matted style.',
    'The Identity Mystery',
    'Despite its popular name, historians and archaeologists remain divided on who the statue actually represents.',
    'King Parakramabahu I: Local tradition strongly identifies the figure as the great king. Under this interpretation, the object he holds in his hands is seen as a yoke, symbolising the heavy burden of kingship and statecraft.',
    'A Revered Sage: Many scholars argue the statue represents an ancient Hindu sage, likely Pulastya (from whom Polonnaruwa derives its ancient name, Pulastipura) or Agastya. This theory suggests the object in his hands is an ola (palm-leaf) manuscript, fitting the scholarly, unadorned aesthetic of the figure.',
    'Artistic Significance',
    'The sculpture is celebrated as a masterpiece of the Polonnaruwa era. Unlike the highly stylised and rigid statues of earlier periods, this figure relies on realistic human proportions and conveys a powerful sense of weight, maturity, and intellectual depth.'
  ),
  timeline: [
    { year: '1153 AD', title: 'Reign of Parakramabahu I', description: 'King Parakramabahu I begins his reign (1153 – 1186 AD), the golden age of the Polonnaruwa Kingdom.' },
    { year: '12th century AD', title: 'Statue Carved', description: 'The 3.5 m figure is carved in high relief into a granite boulder near the Potgul Vehera.' }
  ],
  images: [
    '/uploads/parakramabahu-1.jpg',
    '/uploads/parakramabahu-2.jpg'
  ],
  translations: {
    si: {
      title: 'පරාක්‍රමබාහු රජුගේ ප්‍රතිමාව',
      description: 'පරාක්‍රමබාහු රජුගේ ප්‍රතිමාව යනු ශ්‍රී ලංකාවේ පොළොන්නරුවේ පොත්ගුල් වෙහෙර ආසන්නයේ පිහිටි විශාල කළුගල් පර්වතයක සෘජුවම නෙළා නිර්මාණය කරන ලද අඩි 11.5ක් (මීටර් 3.5ක්) පමණ උසැති ශිලා ප්‍රතිමාවකි. 12 වන සියවසට අයත් මෙම ප්‍රතිමාව පුරාණ ශ්‍රී ලාංකික කලා ඉතිහාසයේ වඩාත් ප්‍රකට මෙන්ම විවිධ මතවාදයන්ට තුඩු දී ඇති නිර්මාණයකි.',
      historicalInfo: paras(
        '1. ශාරීරික ලක්ෂණ',
        'මෙම ප්‍රතිමාව උස් කැටයම් ක්‍රමයට නිර්මාණය කර ඇති අතර, කැපී පෙනෙන රැවුලක්, තරමක් ඉදිරියට නෙරා ඇති උදරයක් සහ සන්සුන් මුහුණකින් යුත් ගෞරවාන්විත පුරුෂ රුවක් නිරූපණය කරයි.',
        'ඔහු සරල යටිකය වස්ත්‍රයක් (ධෝතියක්) හැඳ සිටින අතර, සාම්ප්‍රදායික රාජකීය ආභරණ හෝ කිරුළක් පැළඳ නොසිටියි. ඔහුගේ හිසකෙස් තාපසයන්ගේ ස්වරූපයට අනුව ගැටගසා ඇත.',
        '2. ප්‍රතිමාවෙන් නිරූපණය වන්නේ කවුරුන්ද යන අභිරහස',
        'මෙම ප්‍රතිමාව ජනප්‍රියව පරාක්‍රමබාහු රජුගේ ප්‍රතිමාව ලෙස හැඳින්වුවද, එයින් සැබවින්ම නිරූපණය වන්නේ කවුරුන්ද යන්න පිළිබඳව ඉතිහාසඥයන් සහ පුරාවිද්‍යාඥයන් අතර විවිධ මත පවතී.',
        'පළමුවන පරාක්‍රමබාහු රජු: දේශීය ජනප්‍රවාද සහ සම්ප්‍රදායන්ට අනුව මෙම ප්‍රතිමාවෙන් නිරූපණය වන්නේ මහා පරාක්‍රමබාහු රජුය. මෙම මතයට අනුව ඔහුගේ දෑත්වල රඳවාගෙන සිටින වස්තුව නගුලක වියගසක් ලෙස සැලකේ. එය රාජ්‍ය පාලනයේ සහ රජකම දැරීමේදී පැවරෙන විශාල වගකීම හා බර සංකේතවත් කරන බවට අදහස් කෙරේ.',
        'පූජනීය ඍෂිවරයෙකු: තවත් බොහෝ විද්වතුන්ගේ මතය වන්නේ මෙම ප්‍රතිමාවෙන් පුරාණ හින්දු ඍෂිවරයෙකු නිරූපණය වන බවයි. ඒ අනුව ඔහු පුලස්ති ඍෂිවරයා හෝ අගස්ති ඍෂිවරයා විය හැකි බවට විශ්වාස කෙරේ. පොළොන්නරුවේ පැරණි නාමය වූ පුලස්තිපුර යන්න පුලස්ති ඍෂිවරයාගේ නාමයෙන් බිඳී ආ බවට ද මතයක් පවතී.',
        'මෙම මතයට අනුව ප්‍රතිමාවේ දෑත්වල රඳවාගෙන සිටින වස්තුව තල්පත් ග්‍රන්ථයක් හෙවත් පුස්කොළ පොතක් විය හැකිය. එය ප්‍රතිමාවේ දක්නට ලැබෙන විද්වත් පෙනුමට සහ සරල, අලංකාරයෙන් තොර ස්වරූපයට ගැළපේ.',
        '3. කලාත්මක වැදගත්කම',
        'මෙම ප්‍රතිමාව පොළොන්නරු යුගයේ මූර්ති කලාවේ විශිෂ්ටතම නිර්මාණයක් ලෙස සැලකේ.',
        'මීට පෙර යුගවල දක්නට ලැබුණු දැඩි රටාවන්ට අනුව නිර්මාණය කළ ප්‍රතිමාවලට වඩා වෙනස්ව, මෙම නිර්මාණය සැබෑ මිනිස් සිරුරේ ස්වාභාවික හැඩතල සහ සමානුපාතයන් මත පදනම් වී ඇත. එමඟින් මිනිස් දේහයේ බර, පරිණතභාවය සහ ගැඹුරු බුද්ධිමය ස්වභාවය මැනවින් ප්‍රකාශ වේ.'
      ),
      timeline: [
        { year: '1153 AD', title: 'පළමුවන පරාක්‍රමබාහු රජුගේ පාලනය', description: 'පොළොන්නරු රාජධානියේ ස්වර්ණමය යුගය වූ පළමුවන පරාක්‍රමබාහු රජුගේ පාලනය (ක්‍රි.ව. 1153 – 1186) ආරම්භ විය.' },
        { year: '12th century AD', title: 'ප්‍රතිමාව නෙළීම', description: 'පොත්ගුල් වෙහෙර අසල කළුගල් පර්වතයක මීටර් 3.5ක් උස මෙම ප්‍රතිමාව උස් කැටයම් ක්‍රමයට නෙළන ලදී.' }
      ]
    },
    ta: {
      title: 'பராக்கிரமபாகு மன்னரின் சிலை',
      description: 'பராக்கிரமபாகு மன்னரின் சிலை என்பது இலங்கையின் பொலன்னறுவையில் உள்ள பொத்துகல் விகாரைக்கு அருகிலுள்ள பாரிய கருங்கல் பாறையில் நேரடியாகச் செதுக்கப்பட்டுள்ள சுமார் 11.5 அடி (3.5 மீட்டர்) உயரமான கற்சிலையாகும். 12ஆம் நூற்றாண்டைச் சேர்ந்த இச்சிலை, பண்டைய இலங்கையின் கலை வரலாற்றில் மிகவும் புகழ்பெற்றதும் பல்வேறு விவாதங்களுக்கு உட்பட்டதுமான சிற்பங்களில் ஒன்றாகத் திகழ்கிறது.',
      historicalInfo: paras(
        '1. உடல் அமைப்பும் தோற்றமும்',
        'இந்தச் சிலை புடைப்புச் சிற்ப முறையில் செதுக்கப்பட்டுள்ளது. இதில் அடர்த்தியான தாடியையும், சற்றே பருத்த வயிற்றையும், அமைதியான முகபாவனையையும் கொண்ட கம்பீரமான ஆண் உருவம் சித்தரிக்கப்பட்டுள்ளது.',
        'அவர் எளிமையான கீழாடையான வேட்டியை அணிந்துள்ளார். பாரம்பரிய அரச ஆபரணங்களோ அல்லது கிரீடமோ அணியாதவராகக் காணப்படுகிறார். அவரது தலைமுடி துறவிகளின் தோற்றத்தைப் பிரதிபலிக்கும் வகையில் சடைபோல் கட்டப்பட்டுள்ளது.',
        '2. சிலையின் அடையாளம் குறித்த மர்மம்',
        'பொதுவாக இச்சிலை பராக்கிரமபாகு மன்னரின் சிலை என அழைக்கப்பட்டாலும், உண்மையில் இதில் சித்தரிக்கப்பட்டுள்ள நபர் யார் என்பது குறித்து வரலாற்று அறிஞர்கள் மற்றும் தொல்பொருள் ஆய்வாளர்களிடையே பல்வேறு கருத்துகள் நிலவுகின்றன.',
        'முதலாம் பராக்கிரமபாகு மன்னர்: உள்ளூர் மரபுகளின்படி, இந்தச் சிலை இலங்கையை ஆட்சி செய்த புகழ்பெற்ற முதலாம் பராக்கிரமபாகு மன்னரைச் சித்தரிப்பதாகக் கருதப்படுகிறது. இந்தக் கருத்தின்படி, அவரது கைகளில் காணப்படும் பொருள் கலப்பையின் நுகத்தடி என அடையாளம் காணப்படுகிறது. இது அரசாட்சியையும் நாட்டை நிர்வகிப்பதையும் சுமக்க வேண்டிய மிகப்பெரிய பொறுப்பையும் கடமையையும் குறிக்கிறது எனக் கருதப்படுகிறது.',
        'மதிப்பிற்குரிய முனிவர்: வேறு பல அறிஞர்களின் கருத்துப்படி, இந்தச் சிலை பண்டைய இந்து முனிவர் ஒருவரைச் சித்தரிக்கிறது. குறிப்பாக, பொலன்னறுவையின் பண்டைய பெயரான புலஸ்திபுரத்துடன் தொடர்புடைய புலஸ்திய முனிவராகவோ அல்லது அகத்திய முனிவராகவோ இருக்கலாம் எனக் கருதப்படுகிறது.',
        'இந்தக் கருத்தின்படி, சிலையின் கைகளில் காணப்படும் பொருள் ஓலைச்சுவடிக் கையெழுத்துப் பிரதியாக இருக்கலாம். இது அந்த உருவத்தின் அறிவார்ந்த தோற்றத்திற்கும் எளிமையான, ஆடம்பரமற்ற அமைப்பிற்கும் பொருத்தமானதாக அமைகிறது.',
        '3. கலைத்துறை முக்கியத்துவம்',
        'இந்தச் சிலை பொலன்னறுவை காலத்தின் சிற்பக் கலையில் உருவாக்கப்பட்ட மிகச்சிறந்த கலைப்படைப்புகளில் ஒன்றாகப் போற்றப்படுகிறது.',
        'முந்தைய காலகட்டங்களில் காணப்பட்ட இறுக்கமான மற்றும் அலங்காரமயமான சிற்ப வடிவங்களிலிருந்து மாறுபட்டு, இந்தச் சிற்பம் மனித உடலின் இயற்கையான வடிவங்களையும் சரியான உடல் விகிதங்களையும் அடிப்படையாகக் கொண்டு உருவாக்கப்பட்டுள்ளது. இதன் மூலம் மனித உடலின் கம்பீரம், முதிர்ச்சி மற்றும் ஆழமான அறிவாற்றல் ஆகியவை மிகத் தத்ரூபமாக வெளிப்படுத்தப்பட்டுள்ளன.',
        'பொத்துகல் விகாரைக்கு அருகில் அமைந்துள்ள இந்தச் சிலை, பண்டைய இலங்கைச் சிற்பிகளின் படைப்பாற்றல், நுணுக்கமான கைவினைத்திறன் மற்றும் மனித உருவத்தை இயற்கையான முறையில் கல்லில் வடிக்கும் அவர்களின் அசாதாரண ஆற்றலை வெளிப்படுத்தும் பெறுமதிமிக்க வரலாற்றுக் கலைப்படைப்பாகும்.'
      ),
      timeline: [
        { year: '1153 AD', title: 'முதலாம் பராக்கிரமபாகுவின் ஆட்சி', description: 'பொலன்னறுவை இராச்சியத்தின் பொற்காலமான முதலாம் பராக்கிரமபாகு மன்னரின் ஆட்சி (கி.பி. 1153 – 1186) ஆரம்பமானது.' },
        { year: '12th century AD', title: 'சிலை செதுக்கப்படல்', description: 'பொத்துகல் விகாரைக்கு அருகிலுள்ள கருங்கல் பாறையில் 3.5 மீட்டர் உயரமான இச்சிலை புடைப்புச் சிற்பமாகச் செதுக்கப்பட்டது.' }
      ]
    }
  }
};

const HERITAGE_EXHIBIT_CONTENT = [nadungamuwaRaja, isurumuniyaLovers, nagarajaGuardstone, parakramabahuStatue];

// Returns plain exhibit documents ready for Exhibit.create / upsert. Each
// exhibit lists the other three as related artifacts.
export const buildHeritageExhibits = (museumId) => {
  const allIds = HERITAGE_EXHIBIT_CONTENT.map(e => e._id);
  return HERITAGE_EXHIBIT_CONTENT.map(({ categoryKey, ...exhibit }) => ({
    ...exhibit,
    videoUrl: '',
    categoryId: HERITAGE_IDS.categories[categoryKey],
    galleryId: HERITAGE_IDS.gallery,
    museumId,
    qrCodeUrl: `/uploads/qr-${exhibit._id}.png`,
    relatedArtifacts: allIds.filter(id => !id.equals(exhibit._id)),
  }));
};
