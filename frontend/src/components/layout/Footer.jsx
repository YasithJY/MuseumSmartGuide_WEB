import React, { useContext } from 'react';
import { LangContext } from '../../context/LangContext';
import { MdLocationOn, MdPhone, MdPublic } from 'react-icons/md';
import { FaFacebook, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const { t } = useContext(LangContext);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary dark:bg-stone-950 text-parchment border-t-4 border-gold pt-12 pb-6 mt-16 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Info Column */}
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-lg text-gold tracking-widest uppercase">
            National Museum
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed font-light">
            Colombo, Sri Lanka's largest library and antiquities hub, preserving the cultural heritage of our island nation for future generations.
          </p>
          <p className="text-xs text-stone-400 flex items-center">
            <MdLocationOn className="mr-1 text-gold" /> Sir Marcus Fernando Mawatha, Colombo 07
          </p>
        </div>

        {/* Opening Hours Column */}
        <div className="space-y-4">
          <h4 className="font-heading font-bold text-sm text-gold tracking-wider uppercase">
            Opening Hours
          </h4>
          <ul className="text-xs text-stone-300 space-y-2 font-light">
            <li className="flex justify-between border-b border-stone-800 pb-1">
              <span>Weekdays:</span>
              <span className="font-semibold">09:00 AM - 05:00 PM</span>
            </li>
            <li className="flex justify-between border-b border-stone-800 pb-1">
              <span>Weekends:</span>
              <span className="font-semibold">09:00 AM - 06:00 PM</span>
            </li>
            <li className="flex justify-between pb-1">
              <span>Public Holidays:</span>
              <span className="text-gold font-semibold">Closed</span>
            </li>
          </ul>
        </div>

        {/* Contacts Column */}
        <div className="space-y-4">
          <h4 className="font-heading font-bold text-sm text-gold tracking-wider uppercase">
            Contact Us
          </h4>
          <p className="text-xs text-stone-300 font-light flex flex-col gap-1">
            <span className="flex items-center"><MdPhone className="mr-1 text-gold" /> Phone: +94 11 269 4767</span>
            <span>📧 Email: info@museum.gov.lk</span>
          </p>
          <div className="flex space-x-3 pt-2">
            <MdPublic className="text-xl cursor-pointer hover:text-gold" />
            <FaFacebook className="text-xl cursor-pointer hover:text-gold" />
            <FaTwitter className="text-xl cursor-pointer hover:text-gold" />
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-stone-800 text-center">
        <p className="text-[11px] text-stone-400 font-light">
          &copy; {currentYear} Department of National Museums, Sri Lanka. University Capstone Project.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
