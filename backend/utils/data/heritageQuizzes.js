import mongoose from 'mongoose';
import { HERITAGE_IDS } from './heritageExhibits.js';

// Per-exhibit quizzes for the four heritage exhibits (QUIZ_new_exhibits.pdf),
// in English with Sinhala and Tamil translations. Shared by utils/seeder.js
// (fresh database) and utils/addHeritageQuizzes.js (existing database).
//
// `options` and `correctAnswer` stay in English — that is what answers are
// scored against. Translated options are listed in the same order and are
// only shown to the visitor.

const oid = (hex) => new mongoose.Types.ObjectId(hex);

const TRUE_FALSE = {
  options: ['True', 'False'],
  si: ['සත්‍ය', 'අසත්‍ය'],
  ta: ['உண்மை', 'பொய்'],
};

const mcq = (_id, en, si, ta, options, correctAnswer) => ({
  _id: oid(_id),
  text: en,
  type: 'multiple-choice',
  options: options.map(o => o[0]),
  correctAnswer,
  points: 10,
  translations: {
    si: { text: si, options: options.map(o => o[1]) },
    ta: { text: ta, options: options.map(o => o[2]) },
  },
});

const trueFalse = (_id, en, si, ta, correctAnswer) => ({
  _id: oid(_id),
  text: `True or False: ${en}`,
  type: 'true-false',
  options: TRUE_FALSE.options,
  correctAnswer,
  points: 10,
  translations: {
    si: { text: `සත්‍ය හෝ අසත්‍ය: ${si}`, options: TRUE_FALSE.si },
    ta: { text: `உண்மையா அல்லது பொய்யா: ${ta}`, options: TRUE_FALSE.ta },
  },
});

const quiz = (_id, exhibitKey, museumKey, en, si, ta, questions) => ({
  _id: oid(_id),
  exhibitId: HERITAGE_IDS.exhibits[exhibitKey],
  galleryId: HERITAGE_IDS.galleries[museumKey],
  museumKey,
  title: en.title,
  description: en.description,
  difficulty: 'easy',
  pointsReward: questions.length * 10,
  translations: { si, ta },
  questions,
});

export const HERITAGE_QUIZZES = [
  quiz('65d75c0f66f50b2984950039', 'nadungamuwaRaja', 'colombo',
    { title: 'Nadungamuwa Raja Quiz', description: 'Test your knowledge of Nadungamuwa Raja, bearer of the Sacred Tooth Relic casket.' },
    { title: 'නැදුන්ගමුවේ රාජා ප්‍රශ්නාවලිය', description: 'සධාතුක කරඬුව වැඩම කළ නැදුන්ගමුවේ රාජා ඇතා පිළිබඳ ඔබේ දැනුම පරීක්ෂා කරන්න.' },
    { title: 'நெதுங்கமுவே ராஜா வினாடி வினா', description: 'புனித தந்த தாதுப் பேழையைச் சுமந்த நெதுங்கமுவே ராஜா பற்றிய உங்கள் அறிவைச் சோதியுங்கள்.' },
    [
      mcq('65d75d0d66f50b2984950061',
        'In which year did Nadungamuwa Raja first take on the sacred duty of carrying the Golden Casket at the Kandy Esala Perahera?',
        'නැදුන්ගමුවේ රාජා ඇතා මහනුවර ශ්‍රී දළදා පෙරහරේ සධාතුක කරඬුව වැඩම කරවීමේ උතුම් කාර්යභාරය ප්‍රථම වරට භාර ගත්තේ කුමන වර්ෂයේදීද?',
        'நெதுங்கமுவே ராஜா கண்டி எசல பெரஹராவில் தங்கப் பேழையைச் சுமக்கும் புனிதப் பொறுப்பை முதன்முதலில் எந்த ஆண்டில் ஏற்றார்?',
        [['1978', '1978', '1978'], ['2005', '2005', '2005'], ['2019', '2019', '2019'], ['2022', '2022', '2022']],
        '2005'),
      trueFalse('65d75d0d66f50b2984950062',
        'Because of his advanced age, Raja was transported to Kandy every year by a heavy transport truck.',
        'වයස්ගත වීම හේතුවෙන් රාජා ඇතා සෑම වසරකම මහනුවරට රැගෙන ගියේ බර ප්‍රවාහන ට්‍රක් රථයකිනි.',
        'முதுமை காரணமாக ராஜா ஒவ்வொரு ஆண்டும் கனரக போக்குவரத்து லொறியில் கண்டிக்குக் கொண்டு செல்லப்பட்டார்.',
        'False'),
    ]),

  quiz('65d75c0f66f50b298495003a', 'isurumuniyaLovers', 'polonnaruwa',
    { title: 'Isurumuniya Lovers Quiz', description: 'Test your knowledge of the famous Isurumuniya Lovers rock carving.' },
    { title: 'ඉසුරුමුණි පෙම් යුවළ ප්‍රශ්නාවලිය', description: 'සුප්‍රසිද්ධ ඉසුරුමුණි පෙම් යුවළ ශිලා කැටයම පිළිබඳ ඔබේ දැනුම පරීක්ෂා කරන්න.' },
    { title: 'இஸுருமுனிய காதலர்கள் வினாடி வினா', description: 'புகழ்பெற்ற இஸுருமுனிய காதலர்கள் பாறைச் சிற்பம் பற்றிய உங்கள் அறிவைச் சோதியுங்கள்.' },
    [
      mcq('65d75d0d66f50b2984950063',
        'According to popular folklore, which couple does the Isurumuniya Lovers carving depict?',
        'ජනප්‍රවාදයට අනුව ඉසුරුමුණි පෙම් යුවළ කැටයමෙන් නිරූපණය වන්නේ කුමන යුවළද?',
        'நாட்டுப்புறக் கதைகளின்படி இஸுருமுனிய காதலர்கள் சிற்பம் எந்தத் தம்பதியைச் சித்தரிக்கிறது?',
        [
          ['Prince Saliya and Asokamala', 'සාලිය කුමරු සහ අශෝකමාලා', 'சாலிய இளவரசரும் அசோகமாலாவும்'],
          ['King Dutugemunu and Queen Viharamahadevi', 'දුටුගැමුණු රජු සහ විහාරමහාදේවිය', 'மன்னன் துட்டகைமுனுவும் அரசி விகாரமகாதேவியும்'],
          ['Prince Vijaya and Kuveni', 'විජය කුමරු සහ කුවේණිය', 'இளவரசர் விஜயனும் குவேனியும்'],
          ['King Parakramabahu and his queen', 'පරාක්‍රමබාහු රජු සහ ඔහුගේ බිසව', 'மன்னன் பராக்கிரமபாகுவும் அவரது அரசியும்'],
        ],
        'Prince Saliya and Asokamala'),
      trueFalse('65d75d0d66f50b2984950064',
        'In the Isurumuniya Lovers carving, the male figure sits in a relaxed posture (lalitasana) with a sword resting across his lap.',
        'ඉසුරුමුණි පෙම් යුවළ කැටයමේ පුරුෂ රූපය කඩුවක් උකුළ මත තබාගෙන සැහැල්ලු ඉරියව්වකින් (ලලිතාසනයෙන්) අසුන්ගෙන සිටී.',
        'இஸுருமுனிய காதலர்கள் சிற்பத்தில் ஆண் உருவம் மடியில் வாளை வைத்தபடி தளர்வான தோரணையில் (லலிதாசனம்) அமர்ந்துள்ளது.',
        'True'),
    ]),

  quiz('65d75c0f66f50b298495003b', 'nagarajaGuardstone', 'polonnaruwa',
    { title: 'Nagaraja Guardstone Quiz', description: 'Test your knowledge of the Nagaraja guardstone of the Ratna Prasada.' },
    { title: 'නාගරාජ මුරගල ප්‍රශ්නාවලිය', description: 'රත්න ප්‍රාසාදයේ නාගරාජ මුරගල පිළිබඳ ඔබේ දැනුම පරීක්ෂා කරන්න.' },
    { title: 'நாகராஜா காவல் சிற்பம் வினாடி வினா', description: 'ரத்ன பிரசாதத்தின் நாகராஜா காவல் சிற்பம் பற்றிய உங்கள் அறிவைச் சோதியுங்கள்.' },
    [
      mcq('65d75d0d66f50b2984950065',
        'Which king built the Ratna Prasada (Gem Palace) in Anuradhapura, at whose entrance the Nagaraja Guardstone stands?',
        'නාගරාජ මුරගල පිහිටි අනුරාධපුර රත්න ප්‍රාසාදය (මැණික් මාලිගය) ඉදිකරවන ලද්දේ කුමන රජතුමා විසිනිද?',
        'நாகராஜா காவல் சிற்பம் அமைந்துள்ள அநுராதபுர ரத்ன பிரசாதத்தை (மாணிக்க மாளிகை) கட்டிய மன்னர் யார்?',
        [
          ['King Dutugemunu', 'දුටුගැමුණු රජතුමා', 'துட்டகைமுனு மன்னன்'],
          ['King Mahasen', 'මහසෙන් රජතුමා', 'மகாசேன மன்னன்'],
          ['King Dhatusena', 'ධාතුසේන රජතුමා', 'தாதுசேன மன்னன்'],
          ['King Kanittha Tissa', 'කනිට්ඨතිස්ස රජතුමා', 'கனிட்ட திஸ்ஸ மன்னன்'],
        ],
        'King Kanittha Tissa'),
      trueFalse('65d75d0d66f50b2984950066',
        'Guardstones were traditionally placed at building entrances to symbolise protection, prosperity and auspiciousness.',
        'සම්ප්‍රදායට අනුව මුරගල් ගොඩනැගිලිවල පිවිසුම් ස්ථානවල තැන්පත් කළේ ආරක්ෂාව, සෞභාග්‍යය සහ ශුභ සංකේතවත් කිරීමටය.',
        'பாரம்பரியமாக காவல் கற்கள் கட்டிடங்களின் நுழைவாயில்களில் பாதுகாப்பு, செழிப்பு மற்றும் மங்களகரமான தன்மையைக் குறிக்க நிறுவப்பட்டன.',
        'True'),
    ]),

  quiz('65d75c0f66f50b298495003c', 'parakramabahuStatue', 'polonnaruwa',
    { title: 'Statue of King Parakramabahu Quiz', description: 'Test your knowledge of the great rock-cut statue of Polonnaruwa.' },
    { title: 'පරාක්‍රමබාහු රජුගේ ප්‍රතිමාව ප්‍රශ්නාවලිය', description: 'පොළොන්නරුවේ ශිලාවේ නෙළූ මහා ප්‍රතිමාව පිළිබඳ ඔබේ දැනුම පරීක්ෂා කරන්න.' },
    { title: 'பராக்கிரமபாகு மன்னரின் சிலை வினாடி வினா', description: 'பொலன்னறுவையின் பாறையில் செதுக்கப்பட்ட பெரும் சிலை பற்றிய உங்கள் அறிவைச் சோதியுங்கள்.' },
    [
      mcq('65d75d0d66f50b2984950067',
        'If the statue represents an ancient sage (Pulastya or Agastya), what is the object in his hands believed to be?',
        'ප්‍රතිමාවෙන් පුලස්ති හෝ අගස්ති ඍෂිවරයෙකු නිරූපණය වේ නම්, ඔහුගේ දෑත්වල ඇති වස්තුව ලෙස සැලකෙන්නේ කුමක්ද?',
        'இச்சிலை புலஸ்திய அல்லது அகத்திய முனிவரைச் சித்தரிக்கிறது என்றால், அதன் கைகளில் உள்ள பொருள் எது எனக் கருதப்படுகிறது?',
        [
          ['A plough yoke', 'නගුලක වියගසක්', 'கலப்பையின் நுகத்தடி'],
          ['A royal sceptre', 'රාජ දණ්ඩක්', 'அரச செங்கோல்'],
          ['An ola (palm-leaf) manuscript', 'පුස්කොළ පොතක් (තල්පත් ග්‍රන්ථයක්)', 'ஓலைச்சுவடிக் கையெழுத்துப் பிரதி'],
          ['A lotus flower', 'නෙළුම් මලක්', 'தாமரை மலர்'],
        ],
        'An ola (palm-leaf) manuscript'),
      trueFalse('65d75d0d66f50b2984950068',
        'The statue wears a crown and ornate royal jewellery.',
        'මෙම ප්‍රතිමාව කිරුළක් සහ අලංකාර රාජකීය ආභරණ පැළඳ සිටී.',
        'இச்சிலை கிரீடத்தையும் அலங்கார அரச ஆபரணங்களையும் அணிந்துள்ளது.',
        'False'),
    ]),
];

// Split into the documents to save: `questions` holds full question docs, and
// each quiz references them by ID. `museumIds` is { colombo, polonnaruwa }.
export const buildHeritageQuizzes = (museumIds) =>
  HERITAGE_QUIZZES.map(({ museumKey, questions, ...fields }) => ({
    quiz: { ...fields, museumId: museumIds[museumKey], questions: questions.map(q => q._id) },
    questions,
  }));
