import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { MdWarning } from 'react-icons/md';

// Translates the raw browser/library error text into something a visitor can act on.
const friendlyCameraError = (rawText) => {
  const text = String(rawText || '');
  if (/NotAllowedError|Permission denied|PermissionDenied/i.test(text)) {
    return 'Camera access was blocked. Click the camera/lock icon in your browser\'s address bar and allow camera access for this site, then try again.';
  }
  if (/NotFoundError|no camera|OverconstrainedError/i.test(text)) {
    return 'No camera was found on this device. Try a different device, or check that your webcam is connected.';
  }
  if (/NotReadableError|Could not start video source|TrackStartError/i.test(text)) {
    return 'Your camera seems to be in use by another app (e.g. a video call). Close it and try again.';
  }
  if (/NotSupportedError|not supported/i.test(text)) {
    return 'Camera scanning isn\'t supported in this browser, or this page isn\'t loaded over a secure (https) connection.';
  }
  return text ? `Couldn't access the camera: ${text}` : "Couldn't access the camera. Check your browser/OS camera permissions and try again.";
};

const QRScanner = () => {
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(true);
  const [retryKey, setRetryKey] = useState(0);
  const scannerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError(
        window.isSecureContext === false
          ? "Camera access needs a secure (https) connection. This page isn't secure."
          : "This browser doesn't support camera access."
      );
      setScanning(false);
      return;
    }

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

    let observer;
    if (scanning) {
      scanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = scanner;

      // html5-qrcode reports camera/permission failures inside its own DOM node rather
      // than through a callback, so mirror that text into our banner where visitors will
      // actually notice it.
      const headerMessage = document.getElementById('qr-reader__header_message');
      if (headerMessage) {
        observer = new MutationObserver(() => {
          const isWarning = headerMessage.style.color === 'rgb(203, 36, 49)';
          if (isWarning && headerMessage.innerText.trim()) {
            setError(friendlyCameraError(headerMessage.innerText.trim()));
          } else if (headerMessage.innerText.trim() === '') {
            setError('');
          }
        });
        observer.observe(headerMessage, { attributes: true, childList: true, characterData: true, subtree: true });
      }
    }

    return () => {
      if (observer) observer.disconnect();
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.warn("Failed to clear scanner on unmount:", err));
      }
    };
  }, [scanning, retryKey, navigate]);

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
        {error && scanning && (
          <button
            onClick={() => {
              setError('');
              setRetryKey(k => k + 1);
            }}
            className="bg-gold text-primary font-bold px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-xs"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
