// What the chat guide knows besides the exhibits themselves: visitor
// information, help with the site, and the guide's own wording, each in
// English (en), Sinhala (si) and Tamil (ta).
//
// Keywords are matched against the visitor's question after it has been
// lowercased and stripped of punctuation (see chatEngine.js):
//   - a plain string matches a whole English word, or the start of one when
//     it is 4+ letters ("open" matches "opening"); Sinhala and Tamil keywords
//     match anywhere in the text, since those words take suffixes
//   - a string with spaces matches that phrase
//   - an array matches only when every part is present (["where", "museum"])
// Facts that the museum may change (hours, phone) live in MUSEUM below so
// there is one place to update them.

export const MUSEUM = {
  phone: '+94 11 269 4767',
  email: 'info@museum.gov.lk',
  address: 'Sir Marcus Fernando Mawatha, Colombo 07',
};

export const TOPICS = [
  {
    id: 'greeting',
    smallTalk: true,
    keywords: ['hi', 'hello', 'hey', 'ayubowan', 'vanakkam', 'good morning', 'good afternoon', 'good evening', 'ආයුබෝවන්', 'හලෝ', 'හායි', 'வணக்கம்', 'ஹலோ'],
    answer: {
      en: 'Ayubowan! 🙏 What would you like to know? You can ask about any exhibit, or about visiting the museum.',
      si: 'ආයුබෝවන්! 🙏 ඔබට දැනගැනීමට අවශ්‍ය කුමක්ද? ඕනෑම ප්‍රදර්ශනයක් ගැන හෝ කෞතුකාගාරය නැරඹීම ගැන විමසන්න.',
      ta: 'வணக்கம்! 🙏 நீங்கள் என்ன தெரிந்துகொள்ள விரும்புகிறீர்கள்? எந்தக் காட்சிப்பொருள் பற்றியும் அல்லது அருங்காட்சியக வருகை பற்றியும் கேளுங்கள்.',
    },
  },
  {
    id: 'thanks',
    smallTalk: true,
    keywords: ['thanks', 'thank you', 'thank', 'thx', 'ස්තූතියි', 'ස්තුතියි', 'බොහොම ස්තූතියි', 'நன்றி'],
    answer: {
      en: "You're welcome! Enjoy your visit. Ask me anything else whenever you like.",
      si: 'ඔබව සාදරයෙන් පිළිගනිමු! ඔබේ සංචාරය රසවිඳින්න. වෙනත් ඕනෑම දෙයක් ඕනෑම වේලාවක අහන්න.',
      ta: 'மகிழ்ச்சி! உங்கள் வருகையை அனுபவியுங்கள். வேறு எதுவும் வேண்டுமானால் எப்போது வேண்டுமானாலும் கேளுங்கள்.',
    },
  },
  {
    id: 'bye',
    smallTalk: true,
    keywords: ['bye', 'goodbye', 'see you', 'ගිහින් එන්නම්', 'ආයුබෝවන් ගිහින්', 'போய் வருகிறேன்', 'பிறகு சந்திப்போம்'],
    answer: {
      en: 'Goodbye, and thank you for visiting the Colombo National Museum!',
      si: 'ගිහින් එන්න! කොළඹ ජාතික කෞතුකාගාරය නැරඹීමට පැමිණීම ගැන ස්තූතියි!',
      ta: 'போய் வாருங்கள்! கொழும்பு தேசிய அருங்காட்சியகத்திற்கு வருகை தந்தமைக்கு நன்றி!',
    },
  },
  {
    id: 'help',
    keywords: ['help', 'what can you do', 'who are you', 'what are you', 'how does this work', 'what can i ask', 'උදව්', 'ඔබ කවුද', 'මොනවද කරන්න පුළුවන්', 'உதவி', 'நீங்கள் யார்', 'என்ன செய்ய முடியும்'],
    answer: {
      en: "I'm the museum's chat guide. I can tell you about every exhibit — its story, dates, where to find it — play its audio guide, and open it in 3D. I can also help with opening hours, tickets, getting here and using this website.",
      si: 'මම කෞතුකාගාරයේ කතාබහ මාර්ගෝපදේශකයා. සෑම ප්‍රදර්ශනයක් ගැනම — එහි කතාව, දිනයන්, එය සොයාගත හැකි තැන — කියන්නත්, එහි ශ්‍රව්‍ය මාර්ගෝපදේශය වාදනය කරන්නත්, එය ත්‍රිමාණව විවෘත කරන්නත් මට පුළුවන්. විවෘත වේලාවන්, ප්‍රවේශ පත්‍ර, මෙහි පැමිණෙන ආකාරය සහ මෙම වෙබ් අඩවිය භාවිතය ගැනත් උදව් කළ හැකියි.',
      ta: 'நான் அருங்காட்சியகத்தின் உரையாடல் வழிகாட்டி. ஒவ்வொரு காட்சிப்பொருளின் கதை, காலம், அது இருக்கும் இடம் ஆகியவற்றைச் சொல்லவும், அதன் ஒலி வழிகாட்டியை இயக்கவும், முப்பரிமாணத்தில் திறக்கவும் முடியும். திறக்கும் நேரம், நுழைவுச்சீட்டு, இங்கு வருவது மற்றும் இந்தத் தளத்தைப் பயன்படுத்துவது பற்றியும் உதவ முடியும்.',
    },
  },
  {
    id: 'hours',
    keywords: ['open', 'close', 'closed', 'closing', 'hours', 'timing', 'timings', 'what time', 'today', 'sunday', 'saturday', 'weekend', 'holiday', 'holidays', 'විවෘත', 'වේලාව', 'වෙලාව', 'වසා', 'ඇරෙන්නේ', 'ඇරලා', 'වහන්නේ', 'නිවාඩු', 'நேரம்', 'திறந்து', 'திறக்கும்', 'மூடும்', 'மூடப்', 'விடுமுறை'],
    answer: {
      en: 'The museum is open 9:00 AM – 5:00 PM on weekdays and 9:00 AM – 6:00 PM on weekends. It is closed on public holidays.',
      si: 'කෞතුකාගාරය සතියේ දිනවල පෙ.ව. 9:00 – ප.ව. 5:00 දක්වාත්, සති අන්තයේ පෙ.ව. 9:00 – ප.ව. 6:00 දක්වාත් විවෘතයි. රජයේ නිවාඩු දිනවල වසා ඇත.',
      ta: 'அருங்காட்சியகம் வார நாட்களில் காலை 9:00 – மாலை 5:00 வரையும், வார இறுதியில் காலை 9:00 – மாலை 6:00 வரையும் திறந்திருக்கும். பொது விடுமுறை நாட்களில் மூடப்பட்டிருக்கும்.',
    },
  },
  {
    id: 'tickets',
    keywords: ['ticket', 'tickets', 'price', 'prices', 'fee', 'fees', 'cost', 'entrance', 'entry', 'admission', 'free', 'ටිකට්', 'ප්‍රවේශ', 'ගාස්තු', 'මිල', 'டிக்கெட்', 'கட்டணம்', 'விலை', 'நுழைவு'],
    answer: {
      en: `Tickets are sold at the entrance counter. Prices are set by the Department of National Museums and differ for Sri Lankans, foreign visitors, students and children, so please check at the counter or call ${MUSEUM.phone} for current prices.`,
      si: `ප්‍රවේශ පත්‍ර ප්‍රධාන දොරටුවේ කවුළුවෙන් මිලදී ගත හැකියි. මිල ගණන් ජාතික කෞතුකාගාර දෙපාර්තමේන්තුව විසින් තීරණය කරන අතර ශ්‍රී ලාංකිකයන්, විදේශිකයන්, සිසුන් සහ ළමුන් සඳහා වෙනස් වේ. වත්මන් මිල ගණන් සඳහා කවුළුවෙන් විමසන්න, නැතහොත් ${MUSEUM.phone} අමතන්න.`,
      ta: `நுழைவுச்சீட்டுகள் நுழைவாயில் கருமபீடத்தில் விற்கப்படுகின்றன. கட்டணங்களை தேசிய அருங்காட்சியகத் திணைக்களம் நிர்ணயிக்கிறது; இலங்கையர், வெளிநாட்டவர், மாணவர்கள் மற்றும் சிறுவர்களுக்கு வேறுபடும். தற்போதைய கட்டணங்களுக்கு கருமபீடத்தில் கேளுங்கள் அல்லது ${MUSEUM.phone} ஐ அழையுங்கள்.`,
    },
  },
  {
    id: 'location',
    keywords: ['address', 'directions', 'how to get', 'get there', 'get to the museum', 'reach the museum', ['where', 'museum'], 'location of the museum', 'bus', 'taxi', 'tuk', 'ලිපිනය', 'පැමිණෙන්නේ', ['කොහෙද', 'කෞතුකාගාර'], 'முகவரி', ['எங்கே', 'அருங்காட்சியக'], 'எப்படி வருவது'],
    answer: {
      en: `The Colombo National Museum is on ${MUSEUM.address}, next to Viharamahadevi Park. Most buses, taxis and tuk-tuks know it as the "National Museum".`,
      si: `කොළඹ ජාතික කෞතුකාගාරය පිහිටා ඇත්තේ ${MUSEUM.address}, විහාරමහාදේවී උද්‍යානය අසලයි. බොහෝ බස්, කුලී රථ සහ ත්‍රීරෝද රියදුරන් එය "ජාතික කෞතුකාගාරය" ලෙස හඳුනති.`,
      ta: `கொழும்பு தேசிய அருங்காட்சியகம் ${MUSEUM.address} இல், விகாரமகாதேவி பூங்காவுக்கு அருகில் அமைந்துள்ளது. பெரும்பாலான பேருந்து, டாக்ஸி மற்றும் முச்சக்கர வண்டி ஓட்டுநர்களுக்கு இது "தேசிய அருங்காட்சியகம்" என்று தெரியும்.`,
    },
  },
  {
    id: 'contact',
    keywords: ['phone', 'call', 'contact', 'email', 'telephone', 'number', 'දුරකථන', 'අමතන්න', 'ඊමේල්', 'සම්බන්ධ', 'தொலைபேசி', 'தொடர்பு', 'மின்னஞ்சல்', 'அழை'],
    answer: {
      en: `You can call the museum on ${MUSEUM.phone} or email ${MUSEUM.email}.`,
      si: `කෞතුකාගාරය ${MUSEUM.phone} ඔස්සේ ඇමතිය හැකියි, නැතහොත් ${MUSEUM.email} වෙත ඊමේල් කරන්න.`,
      ta: `அருங்காட்சியகத்தை ${MUSEUM.phone} இல் அழைக்கலாம் அல்லது ${MUSEUM.email} க்கு மின்னஞ்சல் அனுப்பலாம்.`,
    },
  },
  {
    id: 'museumHistory',
    keywords: ['founded', 'established', 'history of the museum', ['old', 'museum'], ['when', 'museum', 'built'], ['when', 'museum', 'open'], 'museum 150', '150 years', 'gregory', ['ආරම්භ', 'කෞතුකාගාර'], ['ඉතිහාසය', 'කෞතුකාගාර'], ['நிறுவப்', 'அருங்காட்சியக'], ['வரலாறு', 'அருங்காட்சியக']],
    answer: {
      en: 'The Colombo National Museum opened on 1 January 1877, founded under the British Governor Sir William Henry Gregory. It is the largest museum in Sri Lanka — and "Museum 150" celebrates its 150th anniversary in 2027.',
      si: 'කොළඹ ජාතික කෞතුකාගාරය 1877 ජනවාරි 1 වන දින, බ්‍රිතාන්‍ය ආණ්ඩුකාර ශ්‍රීමත් විලියම් හෙන්රි ග්‍රෙගරි යටතේ විවෘත කෙරිණි. එය ශ්‍රී ලංකාවේ විශාලතම කෞතුකාගාරයයි — "Museum 150" මගින් 2027 දී එහි 150 වන සංවත්සරය සමරනු ලැබේ.',
      ta: 'கொழும்பு தேசிய அருங்காட்சியகம் 1877 ஜனவரி 1 அன்று, பிரித்தானிய ஆளுநர் சேர் வில்லியம் ஹென்றி கிரகரியின் காலத்தில் திறக்கப்பட்டது. இது இலங்கையின் மிகப்பெரிய அருங்காட்சியகம் — "Museum 150" 2027 இல் அதன் 150 ஆவது ஆண்டு நிறைவைக் கொண்டாடுகிறது.',
    },
  },
  {
    id: 'photography',
    keywords: ['photo', 'photos', 'photograph', 'picture', 'pictures', 'camera', 'selfie', 'flash', 'video recording', 'ඡායාරූප', 'ෆොටෝ', 'කැමරා', 'புகைப்பட', 'கேமரா', 'படம் எடு'],
    answer: {
      en: 'Photography rules can differ between galleries, so please look for the signs or ask a member of staff. Please never use flash near delicate artifacts.',
      si: 'ඡායාරූප ගැනීමේ නීති ගැලරියෙන් ගැලරියට වෙනස් විය හැකි නිසා, කරුණාකර දැන්වීම් පරීක්ෂා කරන්න හෝ කාර්ය මණ්ඩලයෙන් විමසන්න. සියුම් කෞතුක භාණ්ඩ අසල කිසිවිටෙක ෆ්ලෑෂ් භාවිතා නොකරන්න.',
      ta: 'புகைப்பட விதிகள் காட்சியகத்துக்குக் காட்சியகம் மாறுபடலாம்; அறிவிப்புகளைப் பாருங்கள் அல்லது ஊழியர்களிடம் கேளுங்கள். நுட்பமான கலைப்பொருட்களுக்கு அருகில் ஒருபோதும் ஃபிளாஷ் பயன்படுத்த வேண்டாம்.',
    },
  },
  {
    id: 'facilities',
    keywords: ['toilet', 'toilets', 'restroom', 'washroom', 'bathroom', 'cafe', 'canteen', 'food', 'eat', 'drinking water', 'parking', 'park my', 'wheelchair', 'lift', 'elevator', 'shop', 'souvenir', 'locker', 'වැසිකිළි', 'ආපනශාලා', 'කෑම', 'වාහන නැවැත්වීම', 'රෝද පුටු', 'கழிப்பறை', 'உணவு', 'சிற்றுண்டி', 'வாகன நிறுத்த', 'சக்கர நாற்காலி'],
    answer: {
      en: `For toilets, parking, food and wheelchair access, please ask at the information counter by the entrance — the staff will point you the right way. You can also call ${MUSEUM.phone} before your visit.`,
      si: `වැසිකිළි, වාහන නැවැත්වීම, ආහාර සහ රෝද පුටු පහසුකම් ගැන ප්‍රධාන දොරටුව අසල තොරතුරු කවුළුවෙන් විමසන්න — කාර්ය මණ්ඩලය ඔබට මග පෙන්වනු ඇත. පැමිණීමට පෙර ${MUSEUM.phone} ඇමතීමටද පුළුවන්.`,
      ta: `கழிப்பறை, வாகன நிறுத்தம், உணவு மற்றும் சக்கர நாற்காலி வசதிகள் பற்றி நுழைவாயிலில் உள்ள தகவல் கருமபீடத்தில் கேளுங்கள் — ஊழியர்கள் வழிகாட்டுவார்கள். வருகைக்கு முன் ${MUSEUM.phone} ஐயும் அழைக்கலாம்.`,
    },
  },
  {
    id: 'scan',
    keywords: ['scan', 'scanner', 'qr', 'qr code', 'placard', 'ස්කෑන්', 'ස්කෑන් කර', 'ஸ்கேன்', 'qr குறியீ'],
    answer: {
      en: 'Tap the Scan button in the top bar, allow camera access, and point your phone at the QR code on the placard next to a display. The exhibit page opens straight away, with its story, audio guide and 3D view.',
      si: 'ඉහළ තීරුවේ Scan බොත්තම ඔබා, කැමරාවට අවසර දී, ප්‍රදර්ශනය අසල ඇති පුවරුවේ QR කේතය දෙසට ඔබේ දුරකථනය යොමු කරන්න. එහි කතාව, ශ්‍රව්‍ය මාර්ගෝපදේශය සහ ත්‍රිමාණ දර්ශනය සමඟ ප්‍රදර්ශන පිටුව වහාම විවෘත වේ.',
      ta: 'மேல் பட்டியில் உள்ள Scan பொத்தானைத் தட்டி, கேமரா அனுமதி வழங்கி, காட்சிப்பொருளின் அருகிலுள்ள அட்டையில் உள்ள QR குறியீட்டை நோக்கி உங்கள் தொலைபேசியைக் காட்டுங்கள். அதன் கதை, ஒலி வழிகாட்டி மற்றும் முப்பரிமாணக் காட்சியுடன் காட்சிப்பொருள் பக்கம் உடனே திறக்கும்.',
    },
    link: { to: '/scan', label: { en: 'Open the scanner', si: 'ස්කෑනරය විවෘත කරන්න', ta: 'ஸ்கேனரைத் திற' } },
  },
  {
    id: 'ar',
    keywords: ['ar', '3d', 'augmented', 'augmented reality', 'my room', 'my space', 'ත්‍රිමාණ', 'முப்பரிமாண'],
    answer: {
      en: 'Open any exhibit and tap "AR View" to spin its 3D model and zoom in. On supported phones, "View in your space" places it life-size in your room through the camera. Tell me an exhibit name and I can open it for you.',
      si: 'ඕනෑම ප්‍රදර්ශනයක් විවෘත කර "AR View" ඔබන්න — එහි ත්‍රිමාණ ආකෘතිය කරකවා විශාලනය කළ හැකියි. සහාය දක්වන දුරකථනවල "View in your space" මගින් කැමරාව හරහා එය ඔබේ කාමරයේ සැබෑ ප්‍රමාණයෙන් තැබිය හැකියි. ප්‍රදර්ශනයක නම කියන්න, මම එය විවෘත කරන්නම්.',
      ta: 'எந்தக் காட்சிப்பொருளையும் திறந்து "AR View" ஐத் தட்டினால் அதன் முப்பரிமாண மாதிரியைச் சுழற்றி பெரிதாக்கலாம். ஆதரிக்கப்படும் தொலைபேசிகளில் "View in your space" கேமரா வழியாக அதை உங்கள் அறையில் உண்மையான அளவில் வைக்கும். ஒரு காட்சிப்பொருளின் பெயரைச் சொல்லுங்கள், நான் திறந்து தருகிறேன்.',
    },
  },
  {
    id: 'audio',
    keywords: ['audio', 'audio guide', 'listen', 'narration', 'narrator', 'headphones', 'ශ්‍රව්‍ය', 'සවන්', 'ஒலி வழிகாட்டி', 'ஒலி'],
    answer: {
      en: 'Every exhibit has an audio guide in English, Sinhala and Tamil. Open an exhibit and press play, or tell me which exhibit and I\'ll play it here.',
      si: 'සෑම ප්‍රදර්ශනයකටම ඉංග්‍රීසි, සිංහල සහ දෙමළ භාෂාවලින් ශ්‍රව්‍ය මාර්ගෝපදේශයක් ඇත. ප්‍රදර්ශනයක් විවෘත කර වාදනය ඔබන්න, නැතහොත් කුමන ප්‍රදර්ශනයදැයි කියන්න — මම එය මෙහිම වාදනය කරන්නම්.',
      ta: 'ஒவ்வொரு காட்சிப்பொருளுக்கும் ஆங்கிலம், சிங்களம் மற்றும் தமிழில் ஒலி வழிகாட்டி உள்ளது. ஒரு காட்சிப்பொருளைத் திறந்து இயக்குங்கள், அல்லது எந்தக் காட்சிப்பொருள் என்று சொல்லுங்கள் — இங்கேயே இயக்குகிறேன்.',
    },
  },
  {
    id: 'quiz',
    keywords: ['quiz', 'quizzes', 'points', 'badge', 'badges', 'rank', 'score', 'ප්‍රශ්නාවලි', 'ලකුණු', 'ලාංඡන', 'வினாடி வினா', 'புள்ளி', 'பதக்க'],
    answer: {
      en: 'Take the history quizzes to earn points and badges — your rank goes up from Heritage Explorer all the way to Master Historian. You need to be logged in to save your score.',
      si: 'ලකුණු සහ ලාංඡන දිනා ගැනීමට ඉතිහාස ප්‍රශ්නාවලි කරන්න — ඔබේ තරාතිරම Heritage Explorer සිට Master Historian දක්වා ඉහළ යයි. ලකුණු සුරැකීමට ඔබ ලොග් වී සිටිය යුතුයි.',
      ta: 'வரலாற்று வினாடி வினாக்களில் பங்கேற்று புள்ளிகளும் பதக்கங்களும் பெறுங்கள் — உங்கள் தரம் Heritage Explorer இலிருந்து Master Historian வரை உயரும். மதிப்பெண்ணைச் சேமிக்க உள்நுழைந்திருக்க வேண்டும்.',
    },
    link: { to: '/quiz', label: { en: 'Go to quizzes', si: 'ප්‍රශ්නාවලි වෙත', ta: 'வினாடி வினாக்களுக்குச் செல்' } },
  },
  {
    id: 'account',
    keywords: ['login', 'log in', 'sign in', 'sign up', 'register', 'account', 'profile', 'password', 'save', 'saved', 'bookmark', 'favourite', 'favorite', 'ලොග්', 'ලියාපදිංචි', 'ගිණුම', 'සුරකින්න', 'உள்நுழை', 'பதிவு', 'கணக்கு', 'சேமி'],
    answer: {
      en: 'Create a free account to save exhibits, keep your visit history and earn quiz points. You can also browse everything as a guest without an account.',
      si: 'ප්‍රදර්ශන සුරැකීමට, ඔබේ සංචාර ඉතිහාසය තබා ගැනීමට සහ ප්‍රශ්නාවලි ලකුණු දිනා ගැනීමට නොමිලේ ගිණුමක් සාදන්න. ගිණුමක් නොමැතිව අමුත්තෙකු ලෙසද සියල්ල නැරඹිය හැකියි.',
      ta: 'காட்சிப்பொருட்களைச் சேமிக்க, வருகை வரலாற்றை வைத்திருக்க, வினாடி வினா புள்ளிகள் பெற இலவசக் கணக்கு ஒன்றை உருவாக்குங்கள். கணக்கு இல்லாமல் விருந்தினராகவும் அனைத்தையும் பார்க்கலாம்.',
    },
    link: { to: '/register', label: { en: 'Create an account', si: 'ගිණුමක් සාදන්න', ta: 'கணக்கை உருவாக்கு' } },
  },
  {
    id: 'language',
    keywords: ['language', 'languages', 'sinhala', 'tamil', 'english', 'translate', 'භාෂාව', 'සිංහල', 'දෙමළ', 'மொழி', 'தமிழ்', 'சிங்கள'],
    answer: {
      en: 'Use the language button in the top bar to switch the whole site between English, Sinhala and Tamil. You can also just type to me in Sinhala or Tamil and I\'ll reply in the same language.',
      si: 'මුළු වෙබ් අඩවියම ඉංග්‍රීසි, සිංහල සහ දෙමළ අතර මාරු කිරීමට ඉහළ තීරුවේ භාෂා බොත්තම භාවිතා කරන්න. ඔබට මට සිංහලෙන් හෝ දෙමළෙන් ලිවිය හැකියි — මම එම භාෂාවෙන්ම පිළිතුරු දෙන්නම්.',
      ta: 'முழுத் தளத்தையும் ஆங்கிலம், சிங்களம், தமிழ் இடையே மாற்ற மேல் பட்டியில் உள்ள மொழிப் பொத்தானைப் பயன்படுத்துங்கள். நீங்கள் சிங்களத்திலோ தமிழிலோ எழுதினால் அதே மொழியில் பதிலளிப்பேன்.',
    },
  },
  {
    id: 'siteAccessibility',
    keywords: ['accessibility', 'large text', 'bigger text', 'font size', 'contrast', 'dark mode', 'light mode', 'hard to read', 'අකුරු', 'අඳුරු', 'எழுத்து அளவு', 'இருண்ட'],
    answer: {
      en: 'In the top bar you can turn on high contrast, large text, and dark or light mode. On a phone, they are in the menu.',
      si: 'ඉහළ තීරුවේ ඉහළ ප්‍රතිවිරෝධතාව, විශාල අකුරු සහ අඳුරු හෝ ආලෝකමත් ප්‍රකාරය සක්‍රිය කළ හැකියි. දුරකථනයේ නම් ඒවා මෙනුවේ ඇත.',
      ta: 'மேல் பட்டியில் உயர் வேறுபாடு, பெரிய எழுத்து, இருண்ட அல்லது ஒளி பயன்முறையை இயக்கலாம். தொலைபேசியில் அவை மெனுவில் இருக்கும்.',
    },
  },
  {
    id: 'galleries',
    keywords: ['galleries', 'map', 'floor plan', 'museums', 'ගැලරි', 'සිතියම', 'காட்சியகங்கள்', 'வரைபட'],
    answer: {
      en: 'The Museums page has an interactive map of the grounds and every gallery, with its artifacts.',
      si: 'Museums පිටුවේ භූමියේ අන්තර්ක්‍රියාකාරී සිතියමක් සහ සෑම ගැලරියක්ම එහි කෞතුක භාණ්ඩ සමඟ ඇත.',
      ta: 'Museums பக்கத்தில் வளாகத்தின் ஊடாடும் வரைபடமும் ஒவ்வொரு காட்சியகமும் அதன் கலைப்பொருட்களுடன் உள்ளன.',
    },
    link: { to: '/museums', label: { en: 'Open the map', si: 'සිතියම විවෘත කරන්න', ta: 'வரைபடத்தைத் திற' } },
  },
  {
    id: 'about',
    keywords: ['who made this website', 'who made this site', 'who built this website', 'developers', 'developed', 'about us', 'team', 'website made', 'සංවර්ධක', 'කණ්ඩායම', 'உருவாக்கியவர்', 'குழு'],
    answer: {
      en: 'Museum 150 was developed by Uvindu Mendis, Janith Kavinda, Mithula Ilayperuma and Yasith Jayasundara, supervised by Mr. Aruna Ishara Gamage.',
      si: 'Museum 150 සංවර්ධනය කළේ උවිඳු මෙන්ඩිස්, ජනිත් කවින්ද, මිතුල ඉලයපෙරුම සහ යසිත් ජයසුන්දර විසින්, අරුණ ඉෂාර ගමගේ මහතාගේ අධීක්ෂණය යටතේයි.',
      ta: 'Museum 150 ஐ உவிந்து மெண்டிஸ், ஜனித் கவிந்த, மிதுல இளயபெரும மற்றும் யசித் ஜயசுந்தர ஆகியோர் திரு. அருண இஷார கமகே அவர்களின் மேற்பார்வையில் உருவாக்கினர்.',
    },
    link: { to: '/about', label: { en: 'About us', si: 'අප ගැන', ta: 'எங்களைப் பற்றி' } },
  },
  {
    id: 'listExhibits',
    action: 'listExhibits',
    keywords: ['all exhibits', 'show exhibits', 'list exhibits', 'what exhibits', 'which exhibits', 'show all', 'list all', 'what can i see', 'what is there', "what's there", 'artifacts', 'artefacts', 'collection', 'exhibits', 'සියලු ප්‍රදර්ශන', 'ප්‍රදර්ශන මොනවාද', 'ප්‍රදර්ශන', 'කෞතුක භාණ්ඩ', 'அனைத்து காட்சிப்பொருட்', 'காட்சிப்பொருட்கள்', 'கலைப்பொருட்கள்'],
  },
  {
    id: 'recommend',
    action: 'recommend',
    keywords: ['recommend', 'suggest', 'must see', 'must-see', 'highlights', 'best', 'popular', 'favourite exhibit', 'where should i start', 'what should i see', 'short on time', 'නිර්දේශ', 'අනිවාර්යයෙන්', 'හොඳම', 'பரிந்துரை', 'சிறந்த', 'கட்டாயம் பார்க்க'],
  },
];

// Words that ask a particular kind of question about an exhibit. When the
// visitor names an exhibit (or is already talking about one) these decide
// which part of its story to answer with.
export const QUESTION_TYPES = {
  audio: ['audio', 'listen', 'narration', 'narrate', 'hear', 'play', 'voice', 'ශ්‍රව්‍ය', 'සවන්', 'වාදනය', 'ஒலி', 'கேட்க', 'இயக்கு'],
  ar: ['ar', '3d', 'augmented', 'model', 'my room', 'my space', 'ත්‍රිමාණ', 'முப்பரிமாண'],
  quiz: ['quiz', 'test me', 'ප්‍රශ්නාවලි', 'வினாடி'],
  where: ['where', 'which gallery', 'located', 'find it', 'find this', 'floor', 'room', 'කොහෙද', 'කොහේද', 'කොතැන', 'කොහෙන්ද', 'කුමන ගැලරිය', 'எங்கே', 'எங்கு', 'எந்தக் காட்சியக', 'எந்த காட்சியக'],
  who: ['who', 'whom', 'whose', 'built by', 'made by', 'created by', 'කවුද', 'කවුරු', 'කාගේ', 'யார்', 'யாருடைய'],
  why: ['why', 'important', 'importance', 'significant', 'significance', 'special', 'famous', 'unique', 'matter', 'ඇයි', 'වැදගත්', 'විශේෂ', 'ප්‍රසිද්ධ', 'ஏன்', 'முக்கிய', 'சிறப்பு', 'பிரபல'],
  when: ['when', 'year', 'years', 'old', 'age', 'date', 'dated', 'century', 'era', 'period', 'ago', 'timeline', 'කවදා', 'කොපමණ පැරණි', 'පැරණිද', 'අවුරුදු', 'වර්ෂ', 'සියවස', 'යුගය', 'කාලරේඛා', 'எப்போது', 'ஆண்டு', 'பழமை', 'நூற்றாண்டு', 'காலம்', 'காலவரிசை'],
  more: ['more', 'else', 'continue', 'detail', 'details', 'go on', 'keep going', 'තව', 'තවත්', 'වැඩිදුර', 'විස්තර', 'மேலும்', 'இன்னும்', 'விவரம்', 'விளக்க'],
};

// Words meaning "the exhibit we were just talking about".
export const REFERS_BACK = ['it', 'its', 'this', 'that', 'this one', 'these', 'මෙය', 'මේක', 'ඒක', 'එය', 'මෙහි', 'ඒකේ', 'இது', 'இதன்', 'இதை', 'அது', 'அதன்', 'அதை'];

// Words to skip when looking for an exhibit's name in a question.
export const STOPWORDS = new Set(`a an the and or but is are was were be been being am do does did doing have has had
  i me my we our you your he she they them their what which who whom whose when where why how
  of in on at to for from by with about as into than then so if not no yes can could would should will
  please tell show give know let lets want like see look there here any some all much many very just also
  thing things one museum national colombo exhibit exhibits artifact artifacts artefact gallery sri lanka
  ancient guide hi hello hey thanks thank
  ගැන කියන්න කියලා කියන මට මගේ මම ඔබ ඔබේ මේ ඒ මෙම එම සහ හා නම් එක ද කරුණාකර මොකක්ද මොනවාද මොනවද කොහොමද
  පෙන්වන්න දෙන්න පිළිබඳ තියෙන්නේ තිබෙන්නේ ඇති
  பற்றி சொல்லுங்கள் சொல்லு கூறுங்கள் என்ன எனக்கு நான் நீங்கள் இந்த அந்த ஒரு மற்றும் காட்டு காட்டுங்கள்
  தயவுசெய்து எப்படி உள்ளது இருக்கிறது`.split(/\s+/).filter(Boolean));

// Extra names visitors may use for an exhibit, keyed by exhibit _id. The
// exhibit's own titles in all three languages are always included too.
export const EXHIBIT_ALIASES = {
  '65d75b0a66f50b2984950021': ['iron smelting', 'smelting', 'furnace', 'furnaces', 'steel', 'iron', 'wind furnace', 'යකඩ', 'උදුන', 'இரும்பு', 'உலை'],
  '65d75b0a66f50b2984950022': ['elephant lamp', 'ath pahana', 'athpahana', 'lamp', 'elephant', 'ඇත් පහණ', 'පහණ', 'யானை விளக்கு', 'விளக்கு'],
  '65d75b0a66f50b2984950023': ['jetavana', 'jethawana', 'jethawanaramaya', 'jetavanaramaya', 'jethawanarama', 'stupa', 'dagoba', 'ජේතවන', 'ජේතවනාරාම', 'ஜேதவன', 'தூபி'],
  '65d75b0a66f50b2984950024': ['sigiriya', 'sigiri', 'lion rock', 'සීගිරිය', 'සීගිරි', 'சிகிரியா', 'சீகிரியா'],
  '65d75b0a66f50b2984950025': ['rampala', 'railway', 'railways', 'ceylon government railway', 'රම්පාල', 'දුම්රිය', 'ரம்பால', 'ரயில்'],
  '65d75b0a66f50b2984950026': ['kulasinghe', 'ans kulasinghe', 'prestressed concrete', 'pre-stressed concrete', 'කුලසිංහ', 'குலசிங்க'],
  '65d75b0a66f50b2984950027': ['wimalasurendra', 'wimalasurendre', 'hydro power', 'hydroelectric', 'hydro electricity', 'hydro-electricity', 'laxapana', 'විමලසුරේන්ද්‍ර', 'ජල විදුලි', 'விமலசுரேந்திர', 'நீர்மின்'],
  '65d75b0a66f50b2984950028': ['bisokotuwa', 'biso kotuwa', 'sluice', 'valve pit', 'බිසෝ කොටුව', 'බිසෝකොටුව', 'பிசோகொட்டுவ'],
  '65d75b0a66f50b2984950029': ['nadungamuwa raja', 'nadungamuwa', 'raja', 'tusker', 'elephant', 'නැදුන්ගමුවේ රාජා', 'රාජා', 'ராஜா', 'நெதுங்கமுவே'],
  '65d75b0a66f50b298495002a': ['isurumuniya', 'isurumuni', 'lovers', 'pem yuwala', 'ඉසුරුමුණි', 'පෙම් යුවළ', 'இஸுருமுனிய', 'காதலர்கள்'],
  '65d75b0a66f50b298495002b': ['nagaraja', 'guardstone', 'guard stone', 'muragala', 'mura gala', 'cobra king', 'නාගරාජ', 'මුරගල', 'நாகராஜா', 'காவல் சிற்பம்'],
  '65d75b0a66f50b298495002c': ['parakramabahu', 'parakrama', 'king parakramabahu', 'පරාක්‍රමබාහු', 'பராக்கிரமபாகு'],
};

// Sentences that mention these words are preferred for "who" and "why"
// questions when the question itself gives nothing more specific to go on.
export const ANSWER_HINTS = {
  who: ['built', 'made', 'king', 'commissioned', 'founded', 'designed', 'engineer', 'born', 'crafted', 'carved', 'රජ', 'ඉදි', 'නිර්මාණ', 'ඉංජිනේරු', 'උපත', 'மன்னன்', 'மன்னர்', 'கட்டி', 'உருவா', 'பொறியியலாளர்', 'பிறந்'],
  why: ['important', 'significant', 'unique', 'famous', 'first', 'largest', 'oldest', 'only', 'symbol', 'treasure', 'remarkable', 'වැදගත්', 'විශේෂ', 'පළමු', 'විශාලතම', 'එකම', 'முக்கிய', 'சிறப்பு', 'முதல்', 'மிகப்பெரிய', 'ஒரே'],
};

// The guide's own wording. {title}, {gallery} and {museum} are filled in.
export const TEXT = {
  en: {
    title: 'Museum Guide',
    subtitle: 'Ask about exhibits or your visit',
    placeholder: 'Ask a question…',
    send: 'Send',
    open: 'Open chat guide',
    close: 'Close chat guide',
    reset: 'New chat',
    openExhibit: 'Open exhibit',
    listen: 'Listen',
    audioGuide: 'Audio Guide',
    arView: 'AR View',
    quiz: 'Quiz',
    welcome: "Ayubowan! I'm your museum guide. Ask me about any exhibit, opening hours, tickets, or how to use this site.",
    contextWelcome: 'You\'re looking at {title}. Ask me anything about it — like "how old is it?"',
    whereAnswer: '{title} is in the {gallery} gallery{museum}.',
    whereMuseum: ' at the {museum}',
    whereUnknown: "I don't have the gallery for {title}, but its page has everything else.",
    whenIntro: 'Key dates for {title}:',
    audioIntro: 'Here is the audio guide for {title}:',
    noAudio: "{title} doesn't have an audio guide yet.",
    arIntro: 'See {title} in 3D — on supported phones you can also place it in your own space.',
    quizIntro: 'Test what you know about {title}:',
    moreEnd: "That's everything I have on {title}. Its page has the photos, full timeline and audio guide.",
    listIntro: 'These are the exhibits in the guide. Tap one to ask about it:',
    recommendIntro: 'A few highlights to start with:',
    whichOne: 'Which one do you mean?',
    whichExhibit: 'Which exhibit do you mean? Here are a few:',
    fallback: "Sorry, I'm not sure about that. I can answer questions about the exhibits and visiting the museum — try one of these:",
    loadError: "I couldn't load the exhibits just now, so I can only answer general questions. Please try again in a moment.",
    loading: 'Loading the exhibits…',
    suggestions: ['Show all exhibits', 'What are the opening hours?', 'Tell me about Sigiriya', 'How do I scan a QR code?'],
    exhibitSuggestions: ['How old is it?', 'Why is it important?', 'Where can I find it?', 'Play the audio guide'],
    aboutExhibit: 'Tell me about {title}',
  },
  si: {
    title: 'කෞතුකාගාර මාර්ගෝපදේශකයා',
    subtitle: 'ප්‍රදර්ශන හෝ ඔබේ සංචාරය ගැන විමසන්න',
    placeholder: 'ප්‍රශ්නයක් අහන්න…',
    send: 'යවන්න',
    open: 'කතාබහ මාර්ගෝපදේශකයා විවෘත කරන්න',
    close: 'කතාබහ මාර්ගෝපදේශකයා වසන්න',
    reset: 'නව කතාබහ',
    openExhibit: 'ප්‍රදර්ශනය බලන්න',
    listen: 'සවන් දෙන්න',
    audioGuide: 'ශ්‍රව්‍ය මාර්ගෝපදේශය',
    arView: 'AR දර්ශනය',
    quiz: 'ප්‍රශ්නාවලිය',
    welcome: 'ආයුබෝවන්! මම ඔබේ කෞතුකාගාර මාර්ගෝපදේශකයා. ඕනෑම ප්‍රදර්ශනයක්, විවෘත වේලාවන්, ප්‍රවේශ පත්‍ර හෝ මෙම වෙබ් අඩවිය භාවිතා කරන ආකාරය ගැන මගෙන් අහන්න.',
    contextWelcome: 'ඔබ දැන් නරඹන්නේ {title}. ඒ ගැන ඕනෑම දෙයක් අහන්න — උදාහරණයක් ලෙස "මෙය කොපමණ පැරණිද?"',
    whereAnswer: '{title} ප්‍රදර්ශනය කර ඇත්තේ {museum}{gallery} ගැලරියේයි.',
    whereMuseum: '{museum} හි ',
    whereUnknown: '{title} ඇති ගැලරිය මා සතුව නැත, නමුත් එහි පිටුවේ අනෙක් සියල්ල ඇත.',
    whenIntro: '{title} පිළිබඳ වැදගත් දිනයන්:',
    audioIntro: '{title} සඳහා ශ්‍රව්‍ය මාර්ගෝපදේශය:',
    noAudio: '{title} සඳහා තවමත් ශ්‍රව්‍ය මාර්ගෝපදේශයක් නැත.',
    arIntro: '{title} ත්‍රිමාණව නරඹන්න — සහාය දක්වන දුරකථනවල එය ඔබේම අවකාශයේ තැබිය හැකියි.',
    quizIntro: '{title} ගැන ඔබේ දැනුම පරීක්ෂා කරන්න:',
    moreEnd: '{title} ගැන මා සතු සියල්ල එයයි. ඡායාරූප, සම්පූර්ණ කාලරේඛාව සහ ශ්‍රව්‍ය මාර්ගෝපදේශය එහි පිටුවේ ඇත.',
    listIntro: 'මාර්ගෝපදේශයේ ඇති ප්‍රදර්ශන මේවායි. ඕනෑම එකක් ගැන විමසීමට එය ඔබන්න:',
    recommendIntro: 'ආරම්භ කිරීමට විශේෂ ප්‍රදර්ශන කිහිපයක්:',
    whichOne: 'ඔබ අදහස් කරන්නේ කුමක්ද?',
    whichExhibit: 'ඔබ අදහස් කරන්නේ කුමන ප්‍රදර්ශනයද? මෙන්න කිහිපයක්:',
    fallback: 'සමාවන්න, ඒ ගැන මට විශ්වාස නැහැ. ප්‍රදර්ශන සහ කෞතුකාගාරය නැරඹීම ගැන ප්‍රශ්නවලට මට පිළිතුරු දිය හැකියි — මේවායින් එකක් උත්සාහ කරන්න:',
    loadError: 'දැනට ප්‍රදර්ශන තොරතුරු ලබාගත නොහැකි වූ නිසා පොදු ප්‍රශ්නවලට පමණක් පිළිතුරු දිය හැකියි. කරුණාකර මොහොතකින් නැවත උත්සාහ කරන්න.',
    loading: 'ප්‍රදර්ශන පූරණය වෙමින්…',
    suggestions: ['සියලු ප්‍රදර්ශන පෙන්වන්න', 'විවෘත වේලාවන් මොනවාද?', 'සීගිරිය ගැන කියන්න', 'QR කේතයක් ස්කෑන් කරන්නේ කොහොමද?'],
    exhibitSuggestions: ['මෙය කොපමණ පැරණිද?', 'මෙය වැදගත් වන්නේ ඇයි?', 'මෙය කොහෙද තියෙන්නේ?', 'ශ්‍රව්‍ය මාර්ගෝපදේශය වාදනය කරන්න'],
    aboutExhibit: '{title} ගැන කියන්න',
  },
  ta: {
    title: 'அருங்காட்சியக வழிகாட்டி',
    subtitle: 'காட்சிப்பொருட்கள் அல்லது உங்கள் வருகை பற்றிக் கேளுங்கள்',
    placeholder: 'ஒரு கேள்வி கேளுங்கள்…',
    send: 'அனுப்பு',
    open: 'உரையாடல் வழிகாட்டியைத் திற',
    close: 'உரையாடல் வழிகாட்டியை மூடு',
    reset: 'புதிய உரையாடல்',
    openExhibit: 'காட்சிப்பொருளைத் திற',
    listen: 'கேளுங்கள்',
    audioGuide: 'ஒலி வழிகாட்டி',
    arView: 'AR காட்சி',
    quiz: 'வினாடி வினா',
    welcome: 'வணக்கம்! நான் உங்கள் அருங்காட்சியக வழிகாட்டி. எந்தக் காட்சிப்பொருள், திறக்கும் நேரம், நுழைவுச்சீட்டு அல்லது இந்தத் தளத்தைப் பயன்படுத்துவது பற்றி என்னிடம் கேளுங்கள்.',
    contextWelcome: 'நீங்கள் இப்போது {title} ஐப் பார்க்கிறீர்கள். அதைப் பற்றி எதையும் கேளுங்கள் — உதாரணமாக "இது எவ்வளவு பழமையானது?"',
    whereAnswer: '{title} {museum}{gallery} காட்சியகத்தில் காட்சிப்படுத்தப்பட்டுள்ளது.',
    whereMuseum: '{museum} இன் ',
    whereUnknown: '{title} எந்தக் காட்சியகத்தில் உள்ளது என்று என்னிடம் தகவல் இல்லை, ஆனால் அதன் பக்கத்தில் மற்ற அனைத்தும் உள்ளன.',
    whenIntro: '{title} தொடர்பான முக்கிய காலக்கட்டங்கள்:',
    audioIntro: '{title} க்கான ஒலி வழிகாட்டி:',
    noAudio: '{title} க்கு இன்னும் ஒலி வழிகாட்டி இல்லை.',
    arIntro: '{title} ஐ முப்பரிமாணத்தில் பாருங்கள் — ஆதரிக்கப்படும் தொலைபேசிகளில் உங்கள் இடத்திலேயே வைக்கலாம்.',
    quizIntro: '{title} பற்றிய உங்கள் அறிவைச் சோதியுங்கள்:',
    moreEnd: '{title} பற்றி என்னிடம் உள்ளது அவ்வளவுதான். புகைப்படங்கள், முழு காலவரிசை மற்றும் ஒலி வழிகாட்டி அதன் பக்கத்தில் உள்ளன.',
    listIntro: 'வழிகாட்டியில் உள்ள காட்சிப்பொருட்கள் இவை. ஒன்றைப் பற்றிக் கேட்க அதைத் தட்டுங்கள்:',
    recommendIntro: 'தொடங்குவதற்கு சில சிறப்பம்சங்கள்:',
    whichOne: 'நீங்கள் எதைக் குறிப்பிடுகிறீர்கள்?',
    whichExhibit: 'நீங்கள் எந்தக் காட்சிப்பொருளைக் குறிப்பிடுகிறீர்கள்? சில இதோ:',
    fallback: 'மன்னிக்கவும், அது பற்றி எனக்கு உறுதியாகத் தெரியவில்லை. காட்சிப்பொருட்கள் மற்றும் அருங்காட்சியக வருகை பற்றிய கேள்விகளுக்குப் பதிலளிக்க முடியும் — இவற்றில் ஒன்றை முயற்சிக்கவும்:',
    loadError: 'இப்போது காட்சிப்பொருட்களை ஏற்ற முடியவில்லை, எனவே பொதுவான கேள்விகளுக்கு மட்டுமே பதிலளிக்க முடியும். சிறிது நேரத்தில் மீண்டும் முயற்சிக்கவும்.',
    loading: 'காட்சிப்பொருட்கள் ஏற்றப்படுகின்றன…',
    suggestions: ['அனைத்து காட்சிப்பொருட்களையும் காட்டு', 'திறக்கும் நேரம் என்ன?', 'சீகிரியா பற்றி சொல்லுங்கள்', 'QR குறியீட்டை எப்படி ஸ்கேன் செய்வது?'],
    exhibitSuggestions: ['இது எவ்வளவு பழமையானது?', 'இது ஏன் முக்கியமானது?', 'இதை எங்கே காணலாம்?', 'ஒலி வழிகாட்டியை இயக்கு'],
    aboutExhibit: '{title} பற்றி சொல்லுங்கள்',
  },
};
