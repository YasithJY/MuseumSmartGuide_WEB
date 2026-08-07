import React from 'react';
import QRScanner from '../components/common/QRScanner';

const ScanPage = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="font-heading font-extrabold text-2xl text-primary uppercase">Smart QR Guide</h2>
        <p className="text-xs text-stone-500">Hold your device camera up to the QR code placard next to any museum display exhibit.</p>
      </div>

      <QRScanner />
    </div>
  );
};

export default ScanPage;
