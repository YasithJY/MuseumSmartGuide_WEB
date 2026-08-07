import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LangContext } from '../../context/LangContext';
import { ThemeContext } from '../../context/ThemeContext';
import { 
  MdTranslate, 
  MdOutlineDarkMode, 
  MdOutlineLightMode, 
  MdContrast, 
  MdFormatSize, 
  MdMenu, 
  MdClose,
  MdQrCodeScanner
} from 'react-icons/md';

const Navbar = () => {
  const { user, logout, guestMode } = useContext(AuthContext);
  const { lang, setLang, t } = useContext(LangContext);
  const { darkMode, setDarkMode, highContrast, setHighContrast, largeText, setLargeText } = useContext(ThemeContext);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'si' : lang === 'si' ? 'ta' : 'en';
    setLang(nextLang);
  };

  return (
    <nav className="sticky top-0 z-50 bg-primary/95 text-parchment border-b-2 border-gold/70 shadow-md backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🏛️</span>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-base sm:text-lg tracking-wider text-gold gold-text-glow uppercase">
                Museum 150
              </span>
              <span className="text-[10px] tracking-widest text-stone-300 font-light uppercase">
                National Museum Guide
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-gold transition-colors font-medium">{t('home')}</Link>
            <Link to="/museums" className="hover:text-gold transition-colors font-medium">{t('museums')}</Link>
            <Link to="/search" className="hover:text-gold transition-colors font-medium">{t('search')}</Link>
            <Link to="/quiz" className="hover:text-gold transition-colors font-medium">{t('quiz')}</Link>
            
            {user?.role === 'admin' && (
              <Link to="/dashboard" className="bg-gold/25 border border-gold text-gold px-3 py-1 rounded-md text-sm font-semibold hover:bg-gold/40 transition-all">
                Dashboard
              </Link>
            )}
            
            {(user || guestMode) ? (
              <Link to="/profile" className="hover:text-gold transition-colors font-medium">{t('profile')}</Link>
            ) : (
              <Link to="/login" className="bg-gold text-primary px-4 py-1.5 rounded-md font-semibold hover:bg-yellow-600 transition-all">
                {t('login')}
              </Link>
            )}
          </div>

          {/* Quick Toolbar */}
          <div className="hidden lg:flex items-center space-x-4 border-l border-stone-600 pl-4">
            {/* Scan Shortcut */}
            <Link to="/scan" title={t('scanQR')} className="p-1.5 rounded-full hover:bg-stone-700/50 text-gold transition-colors">
              <MdQrCodeScanner className="w-5 h-5" />
            </Link>
            
            {/* Language */}
            <button onClick={toggleLanguage} title={t('language')} className="p-1.5 rounded-full hover:bg-stone-700/50 transition-colors flex items-center gap-1">
              <MdTranslate className="w-5 h-5 text-gold" />
              <span className="text-xs font-bold uppercase">{lang}</span>
            </button>

            {/* Contrast */}
            <button onClick={() => setHighContrast(!highContrast)} title={t('highContrast')} className={`p-1.5 rounded-full hover:bg-stone-700/50 transition-colors ${highContrast ? 'text-yellow-400' : 'text-stone-300'}`}>
              <MdContrast className="w-5 h-5" />
            </button>

            {/* Text Scale */}
            <button onClick={() => setLargeText(!largeText)} title={t('largeText')} className={`p-1.5 rounded-full hover:bg-stone-700/50 transition-colors ${largeText ? 'text-yellow-400' : 'text-stone-300'}`}>
              <MdFormatSize className="w-5 h-5" />
            </button>

            {/* Dark Mode */}
            <button onClick={() => setDarkMode(!darkMode)} title="Toggle Dark/Light Mode" className="p-1.5 rounded-full hover:bg-stone-700/50 text-stone-300 transition-colors">
              {darkMode ? <MdOutlineLightMode className="w-5 h-5 text-yellow-400" /> : <MdOutlineDarkMode className="w-5 h-5" />}
            </button>

            {user && (
              <button onClick={logout} className="text-xs text-stone-300 hover:text-red-400 font-semibold uppercase">
                {t('logout')}
              </button>
            )}
          </div>

          {/* Mobile Menu & Scanner Toggle */}
          <div className="flex items-center space-x-3 md:hidden">
            <Link to="/scan" className="p-2 rounded-full bg-gold/15 text-gold hover:bg-gold/30">
              <MdQrCodeScanner className="w-5 h-5" />
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-stone-300 hover:text-white">
              {mobileMenuOpen ? <MdClose className="w-6 h-6" /> : <MdMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary/98 border-t border-gold/40 px-4 pt-2 pb-6 space-y-3 flex flex-col text-center">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-stone-800 text-parchment hover:text-gold">{t('home')}</Link>
          <Link to="/museums" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-stone-800 text-parchment hover:text-gold">{t('museums')}</Link>
          <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-stone-800 text-parchment hover:text-gold">{t('search')}</Link>
          <Link to="/quiz" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-stone-800 text-parchment hover:text-gold">{t('quiz')}</Link>
          
          {user?.role === 'admin' && (
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-stone-800 text-gold">
              Admin Dashboard
            </Link>
          )}

          {(user || guestMode) ? (
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-stone-800 text-parchment hover:text-gold">{t('profile')}</Link>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="py-2 text-gold font-bold">{t('login')}</Link>
          )}

          {/* Quick Access Grid */}
          <div className="grid grid-cols-4 gap-2 pt-4">
            <button onClick={toggleLanguage} className="flex flex-col items-center p-2 bg-stone-800/40 rounded-lg">
              <MdTranslate className="w-5 h-5 text-gold mb-1" />
              <span className="text-[10px] uppercase font-bold">{lang}</span>
            </button>
            <button onClick={() => setHighContrast(!highContrast)} className={`flex flex-col items-center p-2 bg-stone-800/40 rounded-lg ${highContrast ? 'text-gold' : 'text-stone-300'}`}>
              <MdContrast className="w-5 h-5 mb-1" />
              <span className="text-[10px]">Contrast</span>
            </button>
            <button onClick={() => setLargeText(!largeText)} className={`flex flex-col items-center p-2 bg-stone-800/40 rounded-lg ${largeText ? 'text-gold' : 'text-stone-300'}`}>
              <MdFormatSize className="w-5 h-5 mb-1" />
              <span className="text-[10px]">Size</span>
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className="flex flex-col items-center p-2 bg-stone-800/40 rounded-lg text-stone-300">
              {darkMode ? <MdOutlineLightMode className="w-5 h-5 text-yellow-400 mb-1" /> : <MdOutlineDarkMode className="w-5 h-5 mb-1" />}
              <span className="text-[10px]">Mode</span>
            </button>
          </div>

          {user && (
            <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full mt-4 bg-red-800/35 border border-red-700 text-red-200 py-2 rounded-lg font-semibold">
              {t('logout')}
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
