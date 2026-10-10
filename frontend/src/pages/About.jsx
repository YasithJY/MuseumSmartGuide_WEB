import React, { useContext } from 'react';
import { LangContext } from '../context/LangContext';
import { MdGroups, MdSupervisorAccount } from 'react-icons/md';

import uvinduMendis from '../assets/uvindu mendis.jpeg';
import janithKavinda from '../assets/janith kavinda.jpeg';
import mithulaIlayperuma from '../assets/mithula ilayperuma.jpeg';
import yasithJayasundara from '../assets/yasith jayasundara.png';
import arunaIsharaGamage from '../assets/aruna ishara gamage.jpg';
import nushkanNismi from '../assets/Mr. Nushkan Nismi-W2da3Fhl.png';

const developers = [
  { name: 'Uvindu Mendis', image: uvinduMendis },
  { name: 'Janith Kavinda', image: janithKavinda },
  { name: 'Mithula Ilayperuma', image: mithulaIlayperuma },
  { name: 'Yasith Jayasundara', image: yasithJayasundara },
];

const supervisors = [
  { name: 'Mr. Aruna Ishara Gamage', image: arunaIsharaGamage },
  { name: 'Mr. Nushkan Nisme', image: nushkanNismi },
];

const PersonCard = ({ name, image, featured = false }) => (
  <div className="flex flex-col items-center text-center gap-3 group">
    <div className={`rounded-full overflow-hidden border-4 border-gold shadow-md group-hover:scale-105 transition-transform duration-300 ${featured ? 'w-36 h-36' : 'w-28 h-28'}`}>
      <img src={image} alt={name} className="w-full h-full object-cover object-top" />
    </div>
    <span className="font-heading font-bold text-sm sm:text-base text-primary dark:text-parchment uppercase tracking-wide">
      {name}
    </span>
  </div>
);

const About = () => {
  const { t } = useContext(LangContext);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3 border-b border-stone-200 dark:border-stone-700 pb-8">
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-primary dark:text-parchment uppercase">
          {t('aboutUs')}
        </h1>
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          {t('aboutUsSubtitle')}
        </p>
      </div>

      {/* Developed By */}
      <section className="space-y-8">
        <div className="flex items-center justify-center gap-2">
          <MdGroups className="text-gold w-6 h-6" />
          <h2 className="font-heading font-bold text-lg sm:text-xl text-primary dark:text-parchment uppercase tracking-widest">
            {t('developedBy')}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 justify-items-center">
          {developers.map((dev) => (
            <PersonCard key={dev.name} name={dev.name} image={dev.image} />
          ))}
        </div>
      </section>

      {/* Supervised By */}
      <section className="space-y-8">
        <div className="flex items-center justify-center gap-2">
          <MdSupervisorAccount className="text-gold w-6 h-6" />
          <h2 className="font-heading font-bold text-lg sm:text-xl text-primary dark:text-parchment uppercase tracking-widest">
            {t('supervisedBy')}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-10 justify-items-center max-w-md mx-auto">
          {supervisors.map((sup) => (
            <PersonCard key={sup.name} name={sup.name} image={sup.image} featured />
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
