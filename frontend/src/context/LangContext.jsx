import React, { createContext, useState, useEffect } from 'react';

export const LangContext = createContext();

const translations = {
  en: {
    title: "Museum 150 Smart Guide",
    home: "Home",
    museums: "Museums",
    search: "Search",
    quiz: "Quiz",
    profile: "Profile",
    login: "Login",
    register: "Register",
    logout: "Logout",
    guestMode: "Guest Mode",
    welcome: "Welcome to Colombo National Museum",
    heroSubtitle: "Embark on a digital exploration of Sri Lanka's 2,500 years of glorious historical legacy.",
    featuredExhibits: "Featured Exhibits",
    exploreMuseums: "Explore Galleries",
    timeline: "Historical Timeline",
    audioGuide: "Audio Guide",
    play: "Play Audio",
    pause: "Pause Audio",
    quizScore: "Quiz Performance",
    earnedBadges: "Earned Badges",
    points: "Points",
    viewDetails: "View Details",
    scanQR: "Scan Exhibit QR",
    language: "Language",
    difficulty: "Difficulty",
    startQuiz: "Start Quiz",
    correct: "Correct",
    incorrect: "Incorrect",
    score: "Score",
    myFavourites: "My Saved Favourites",
    visitHistory: "My Visit History",
    highContrast: "High Contrast Mode",
    largeText: "Large Text Mode"
  },
  si: {
    title: "කෞතුකාගාර 150 ස්මාර්ට් මාර්ගෝපදේශය",
    home: "ප්‍රධාන පිටුව",
    museums: "කෞතුකාගාර",
    search: "සෙවීම්",
    quiz: "ප්‍රශ්න විචාරාත්මක",
    profile: "ගිණුම",
    login: "ඇතුල් වන්න",
    register: "ලියාපදිංචි වන්න",
    logout: "පිටවීම",
    guestMode: "අමුත්තන්ගේ ප්‍රකාරය",
    welcome: "කොළඹ ජාතික කෞතුකාගාරය වෙත සාදරයෙන් පිළිගනිමු",
    heroSubtitle: "ශ්‍රී ලංකාවේ වසර 2500කට වඩා පැරණි කීර්තිමත් ඓතිහාසික උරුමය පිළිබඳ ඩිජිටල් ගවේෂණයක්.",
    featuredExhibits: "විශේෂිත ප්‍රදර්ශන භාණ්ඩ",
    exploreMuseums: "ගැලරි ගවේෂණය කරන්න",
    timeline: "ඓතිහාසික කාලරේඛාව",
    audioGuide: "ශ්‍රව්‍ය මාර්ගෝපදේශය",
    play: "වාදනය කරන්න",
    pause: "නවත්වා තබන්න",
    quizScore: "ප්‍රශ්නාවලි දක්ෂතා",
    earnedBadges: "දිනාගත් පදක්කම්",
    points: "ලකුණු",
    viewDetails: "විස්තර බලන්න",
    scanQR: "QR කේතය ස්කෑන් කරන්න",
    language: "භාෂාව",
    difficulty: "අපහසුතා මට්ටම",
    startQuiz: "ප්‍රශ්නාවලිය අරඹන්න",
    correct: "නිවැරදි",
    incorrect: "වැරදි",
    score: "ලකුණු ප්‍රමාණය",
    myFavourites: "මගේ ප්‍රියතම එකතුව",
    visitHistory: "නැරඹුම් ඉතිහාසය",
    highContrast: "ඉහළ ප්‍රතිභේදනය",
    largeText: "විශාල අකුරු ප්‍රකාරය"
  },
  ta: {
    title: "அருங்காட்சியகம் 150 ஸ்மார்ட் வழிகாட்டி",
    home: "முகப்பு",
    museums: "அருங்காட்சியகங்கள்",
    search: "தேடல்",
    quiz: "வினாடி வினா",
    profile: "சுயவிவரம்",
    login: "உள்நுழைக",
    register: "பதிவு செய்க",
    logout: "வெளியேறுக",
    guestMode: "விருந்தினர் பயன்முறை",
    welcome: "கொழும்பு தேசிய அருங்காட்சியகத்திற்கு வரவேற்கிறோம்",
    heroSubtitle: "இலங்கையின் 2500 ஆண்டுகளுக்கும் மேலான புகழ்பெற்ற வரலாற்று பாரம்பரியத்தின் டிஜிட்டல் ஆய்வு.",
    featuredExhibits: "சிறப்பு கண்காட்சிகள்",
    exploreMuseums: "கேலரிகளை ஆராயுங்கள்",
    timeline: "வரலாற்று காலவரிசை",
    audioGuide: "ஒலி வழிகாட்டி",
    play: "ஒலியை இயக்கு",
    pause: "ஒலியை நிறுத்து",
    quizScore: "வினாடி வினா செயல்திறன்",
    earnedBadges: "வென்ற பேட்ஜ்கள்",
    points: "புள்ளிகள்",
    viewDetails: "விவரங்களைக் காண்க",
    scanQR: "QR குறியீட்டை ஸ்கேன் செய்க",
    language: "மொழி",
    difficulty: "சிரமம்",
    startQuiz: "வினாடி வினா தொடங்கவும்",
    correct: "சரி",
    incorrect: "தவறு",
    score: "மதிப்பெண்",
    myFavourites: "என் பிடித்தவை",
    visitHistory: "விஜய வரலாறு",
    highContrast: "உயர் மாறுபாடு",
    largeText: "பெரிய உரை பயன்முறை"
  }
};

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
};
