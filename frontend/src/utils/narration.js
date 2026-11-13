// Narration tracks for each exhibit in English, Sinhala and Tamil. Shared by
// the exhibit page and the chat guide so both play the same recordings.
import tamilAudioSmelting from '../assets/audio/Audio - Tamil/Ancient Wind-Powered Iron Furnaces in Sri Lanka.mp3?url';
import tamilAudioKulasinghe from '../assets/audio/Audio - Tamil/Arumadura Nandasena de Silva Kulasinghe.mp3?url';
import tamilAudioBisokotuwa from '../assets/audio/Audio - Tamil/Bisokotuwa.mp3?url';
import tamilAudioWimalasurendra from '../assets/audio/Audio - Tamil/Devapura Jayasena Wimalasurendra.mp3?url';
import tamilAudioElephantLamp from '../assets/audio/Audio - Tamil/Elephant Lamp.mp3?url';
import tamilAudioRampala from '../assets/audio/Audio - Tamil/Eng. Bamunusinghearachchige Don Rampala.mp3?url';
import tamilAudioJetavana from '../assets/audio/Audio - Tamil/Jetavana Stupa.mp3?url';
import tamilAudioSigiriya from '../assets/audio/Audio - Tamil/Sigiriya.mp3?url';
import sinhalaAudioSmelting from '../assets/audio/Audio-Sinhala/New Project - Smelting.mp3?url';
import sinhalaAudioElephantLamp from '../assets/audio/Audio-Sinhala/New Project - Ath pahana.mp3?url';
import sinhalaAudioJetavana from '../assets/audio/Audio-Sinhala/New Project - Jethwanarama.mp3?url';
import sinhalaAudioSigiriya from '../assets/audio/Audio-Sinhala/New Project - Sigiriya.mp3?url';
import sinhalaAudioRampala from '../assets/audio/Audio-Sinhala/New Project - B d rampala.mp3?url';
import sinhalaAudioKulasinghe from '../assets/audio/Audio-Sinhala/New Project - Kulasinha.mp3?url';
import sinhalaAudioWimalasurendra from '../assets/audio/Audio-Sinhala/New Project - Wimlsurendr.mp3?url';
import sinhalaAudioBisokotuwa from '../assets/audio/Audio-Sinhala/New Project - Bisokotuwa.mp3?url';
import englishAudioNadungamuwa from '../assets/audio/Audio-English/Nadungamuwa Raja.mp3?url';
import englishAudioIsurumuniya from '../assets/audio/Audio-English/Isurumuniya Lovers.mp3?url';
import englishAudioNagaraja from '../assets/audio/Audio-English/Nagaraja Guardstone.mp3?url';
import englishAudioParakramabahu from '../assets/audio/Audio-English/King Parakramabahu.mp3?url';
import tamilAudioNadungamuwa from '../assets/audio/Audio - Tamil/Nadungamuwa Raja.mp3?url';
import tamilAudioIsurumuniya from '../assets/audio/Audio - Tamil/Isurumuniya Lovers.mp3?url';
import tamilAudioNagaraja from '../assets/audio/Audio - Tamil/Nagaraja Guardstone.mp3?url';
import tamilAudioParakramabahu from '../assets/audio/Audio - Tamil/King Parakramabahu.mp3?url';
import sinhalaAudioNadungamuwa from '../assets/audio/Audio-Sinhala/Nadungamuwa Raja.mp3?url';
import sinhalaAudioIsurumuniya from '../assets/audio/Audio-Sinhala/Isurumuniya Lovers.mp3?url';
import sinhalaAudioNagaraja from '../assets/audio/Audio-Sinhala/Nagaraja Guardstone.mp3?url';
import sinhalaAudioParakramabahu from '../assets/audio/Audio-Sinhala/King Parakramabahu.mp3?url';

// Tamil audio narration, keyed by exhibit _id. The backend only stores one
// (English) audioUrl per exhibit, so the Tamil/Sinhala tracks are swapped in
// on the frontend when the visitor selects that language tab.
const TAMIL_AUDIO_BY_EXHIBIT_ID = {
  '65d75b0a66f50b2984950021': tamilAudioSmelting, // Wind-Powered Steel Smelting
  '65d75b0a66f50b2984950022': tamilAudioElephantLamp, // Elephant Lamp (Ath Pahana)
  '65d75b0a66f50b2984950023': tamilAudioJetavana, // Jetavana Stupa (Jethawanarama)
  '65d75b0a66f50b2984950024': tamilAudioSigiriya, // Sigiriya
  '65d75b0a66f50b2984950025': tamilAudioRampala, // Eng. Bamunusinghearachchige Don Rampala
  '65d75b0a66f50b2984950026': tamilAudioKulasinghe, // Arumadura Nandasena de Silva Kulasinghe
  '65d75b0a66f50b2984950027': tamilAudioWimalasurendra, // Devapura Jayasena Wimalasurendra
  '65d75b0a66f50b2984950028': tamilAudioBisokotuwa, // Bisokotuwa
  '65d75b0a66f50b2984950029': tamilAudioNadungamuwa, // Nadungamuwa Raja
  '65d75b0a66f50b298495002a': tamilAudioIsurumuniya, // Isurumuniya Lovers
  '65d75b0a66f50b298495002b': tamilAudioNagaraja, // Nagaraja Guardstone
  '65d75b0a66f50b298495002c': tamilAudioParakramabahu, // Statue of King Parakramabahu
};

// Sinhala audio narration, keyed by exhibit _id. Swapped in on the frontend
// when the visitor selects the Sinhala language tab, same as the Tamil track.
const SINHALA_AUDIO_BY_EXHIBIT_ID = {
  '65d75b0a66f50b2984950021': sinhalaAudioSmelting, // Wind-Powered Steel Smelting
  '65d75b0a66f50b2984950022': sinhalaAudioElephantLamp, // Elephant Lamp (Ath Pahana)
  '65d75b0a66f50b2984950023': sinhalaAudioJetavana, // Jetavana Stupa (Jethawanarama)
  '65d75b0a66f50b2984950024': sinhalaAudioSigiriya, // Sigiriya
  '65d75b0a66f50b2984950025': sinhalaAudioRampala, // Eng. Bamunusinghearachchige Don Rampala
  '65d75b0a66f50b2984950026': sinhalaAudioKulasinghe, // Arumadura Nandasena de Silva Kulasinghe
  '65d75b0a66f50b2984950027': sinhalaAudioWimalasurendra, // Devapura Jayasena Wimalasurendra
  '65d75b0a66f50b2984950028': sinhalaAudioBisokotuwa, // Bisokotuwa
  '65d75b0a66f50b2984950029': sinhalaAudioNadungamuwa, // Nadungamuwa Raja
  '65d75b0a66f50b298495002a': sinhalaAudioIsurumuniya, // Isurumuniya Lovers
  '65d75b0a66f50b298495002b': sinhalaAudioNagaraja, // Nagaraja Guardstone
  '65d75b0a66f50b298495002c': sinhalaAudioParakramabahu, // Statue of King Parakramabahu
};

// English narration for exhibits whose database record has no audioUrl (the
// heritage exhibits added by addHeritageExhibits.js). An audioUrl set from
// the dashboard still takes priority.
const ENGLISH_AUDIO_BY_EXHIBIT_ID = {
  '65d75b0a66f50b2984950029': englishAudioNadungamuwa, // Nadungamuwa Raja
  '65d75b0a66f50b298495002a': englishAudioIsurumuniya, // Isurumuniya Lovers
  '65d75b0a66f50b298495002b': englishAudioNagaraja, // Nagaraja Guardstone
  '65d75b0a66f50b298495002c': englishAudioParakramabahu, // Statue of King Parakramabahu
};

export const getEnglishAudio = (exhibit) => exhibit.audioUrl || ENGLISH_AUDIO_BY_EXHIBIT_ID[exhibit._id];

export const NARRATION_BY_LANG = { ta: TAMIL_AUDIO_BY_EXHIBIT_ID, si: SINHALA_AUDIO_BY_EXHIBIT_ID };

// The narration for one exhibit in the given language, falling back to the
// English track when that language has no recording.
export const getNarration = (exhibit, lang) =>
  (lang !== 'en' && NARRATION_BY_LANG[lang]?.[exhibit._id]) || getEnglishAudio(exhibit);
