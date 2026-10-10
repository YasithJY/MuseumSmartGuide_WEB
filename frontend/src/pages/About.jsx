import React, { useContext } from 'react';
import { LangContext } from '../context/LangContext';
import { MdGroups, MdSupervisorAccount, MdEmail } from 'react-icons/md';

const CONTACT_EMAIL = 'it22100498@my.sliit.lk';

import uvinduMendis from '../assets/Uvindu induwara mendis.png';
import janithKavinda from '../assets/janith kavinda.jpeg';
import mithulaIlayperuma from '../assets/mithula ilayperuma.jpeg';
import yasithJayasundara from '../assets/yasith jayasundara.png';
import arunaIsharaGamage from '../assets/aruna ishara gamage.jpg';

const developers = [
  { name: 'Uvindu Mendis', image: uvinduMendis },
  { name: 'Janith Kavinda', image: janithKavinda },
  { name: 'Mithula Ilayperuma', image: mithulaIlayperuma },
  { name: 'Yasith Jayasundara', image: yasithJayasundara },
];

const supervisors = [
  { name: 'Mr. Aruna Ishara Gamage', image: arunaIsharaGamage },
];

const PersonCard = ({ name, image, featured = false }) => (
  <div className="flex flex-col items-center text-center gap-4 group bg-white dark:bg-stone-800/60 rounded-2xl shadow-md hover:shadow-xl border border-stone-100 dark:border-stone-700 p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 w-full">
    <div className={`rounded-full overflow-hidden border-4 border-gold shadow-lg group-hover:scale-105 transition-transform duration-300 ${featured ? 'w-40 h-40 sm:w-48 sm:h-48' : 'w-32 h-32 sm:w-36 sm:h-36'}`}>
      <img src={image} alt={name} className="w-full h-full object-cover object-top" />
    </div>
    <span className="font-heading font-bold text-base sm:text-lg text-primary dark:text-parchment uppercase tracking-wide leading-snug">
      {name}
    </span>
  </div>
);

const About = () => {
  const { t } = useContext(LangContext);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-24">
      {/* Header */}
      <div className="text-center space-y-5">
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-primary dark:text-parchment uppercase tracking-wide">
          {t('aboutUs')}
        </h1>
        <div className="w-24 h-1.5 bg-gold mx-auto rounded-full"></div>
        <p className="max-w-3xl mx-auto text-base sm:text-lg text-stone-500 dark:text-stone-300 leading-relaxed">
          {t('aboutUsSubtitle')}
        </p>
      </div>

      {/* Developed By */}
      <section className="space-y-10">
        <div className="flex items-center justify-center gap-3">
          <MdGroups className="text-gold w-8 h-8 sm:w-9 sm:h-9" />
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-primary dark:text-parchment uppercase tracking-widest">
            {t('developedBy')}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {developers.map((dev) => (
            <PersonCard key={dev.name} name={dev.name} image={dev.image} />
          ))}
        </div>
      </section>

      {/* Supervised By */}
      <section className="space-y-10">
        <div className="flex items-center justify-center gap-3">
          <MdSupervisorAccount className="text-gold w-8 h-8 sm:w-9 sm:h-9" />
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-primary dark:text-parchment uppercase tracking-widest">
            {t('supervisedBy')}
          </h2>
        </div>
        <div className="flex justify-center max-w-xs mx-auto">
          {supervisors.map((sup) => (
            <PersonCard key={sup.name} name={sup.name} image={sup.image} featured />
          ))}
        </div>
      </section>

      {/* Contact Us */}
      <section className="text-center space-y-7 bg-primary text-parchment rounded-3xl py-16 px-6 sm:px-12 shadow-xl border-2 border-gold/50">
        <div className="w-16 h-16 rounded-full bg-gold/15 border-2 border-gold flex items-center justify-center mx-auto">
          <MdEmail className="w-8 h-8 text-gold" />
        </div>
        <h2 className="font-heading font-bold text-2xl sm:text-3xl uppercase tracking-widest">
          {t('contactUsTitle')}
        </h2>
        <p className="max-w-xl mx-auto text-base sm:text-lg text-stone-300 leading-relaxed">
          {t('contactUsSubtitle')}
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex items-center gap-2.5 bg-gold text-primary px-8 py-4 rounded-xl font-bold text-sm sm:text-base uppercase tracking-wide hover:bg-yellow-600 hover:scale-105 transition-all duration-300 shadow-md"
        >
          <MdEmail className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>{t('contactDevelopers')}</span>
        </a>
      </section>
    </div>
  );
};

export default About;
