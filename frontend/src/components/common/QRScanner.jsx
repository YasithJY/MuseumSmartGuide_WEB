import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { MdWarning } from 'react-icons/md';

const QRScanner = () => {
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(true);
  const scannerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize html5-qrcode scanner
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        supportedScanTypes: [0] // Camera scan only
      },
      /* verbose= */ false
    );

    const onScanSuccess = (decodedText) => {
      // Deconstruct URL to check for /exhibit/ID
      try {
        setScanning(false);
        scanner.clear();
        
        const url = new URL(decodedText);
        const pathSegments = url.pathname.split('/');
        const exhibitIndex = pathSegments.indexOf('exhibit');
        
        if (exhibitIndex !== -1 && pathSegments[exhibitIndex + 1]) {
          const exhibitId = pathSegments[exhibitIndex + 1];
          navigate(`/exhibit/${exhibitId}`);
        } else {
          setError('Invalid QR code format. Please scan an exhibit QR code.');
          setScanning(true);
        }
      } catch (err) {
        // Handle raw ID scan fallback
        if (decodedText.match(/^[0-9a-fA-F]{24}$/)) {
          navigate(`/exhibit/${decodedText}`);
        } else {
          setError('Could not read QR code. Make sure it points to a valid Museum 150 exhibit.');
          setTimeout(() => setError(''), 4000);
        }
      }
    };

    const onScanFailure = (error) => {
      // Fail silently to prevent console pollution
    };

    if (scanning) {
      scanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.warn("Failed to clear scanner on unmount:", err));
      }
    };
  }, [scanning, navigate]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white/60 backdrop-blur-md rounded-xl border-2 border-stone-200/80 shadow-inner w-full max-w-md mx-auto">
      <h3 className="font-heading text-lg font-bold text-primary mb-2 text-center">
        Scan Exhibit QR Code
      </h3>
      <p className="text-xs text-stone-500 text-center mb-6">
        Position the QR code inside the box to automatically open the audio and visual guide.
      </p>

      {error && (
        <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-xs font-semibold">
          <MdWarning className="inline w-4 h-4 mr-1" /> {error}
        </div>
      )}

      {/* Reader Container */}
      <div id="qr-reader" className="w-full rounded-lg overflow-hidden border border-stone-300"></div>

      <div className="mt-6 flex gap-4">
        {!scanning && (
          <button
            onClick={() => setScanning(true)}
            className="bg-gold text-primary font-bold px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-xs"
          >
            Restart Camera
          </button>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
