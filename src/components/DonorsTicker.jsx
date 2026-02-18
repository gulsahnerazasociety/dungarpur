import React, { useEffect, useState, useRef, useMemo, useCallback, useLayoutEffect } from "react";
import confetti from "canvas-confetti"; // Install this: npm install canvas-confetti
import "./DonorsTicker.css";

const DONOR_API = "https://script.google.com/macros/s/AKfycby_fZ3DiszDjdwp4zh3fgj7G9vDkTL1IdMOy2_0APNcTDeIDHY6VW8juaqX1MZWEaGJ/exec";
const CACHE_KEY = "donors_list_data";
const CACHE_TIME_KEY = "donors_list_timestamp";
const EXPIRE_TIME = 15 * 60 * 1000;

const DonorsTicker = () => {
  const [donors, setDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 1. WhatsApp Share Function
  const shareOnWhatsApp = (donor) => {
    const message = `🎉 *Shukriya ${donor.name} Bhai!* 🎉%0A%0AAapka ₹${donor.amount} का योगदान हमें मिला, आप जैसे मुसलमान भाई की वजह से ही समाज बदल रहा है. 🤲 %0A%0ACheck here: ${window.location.href}`;
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  // 2. Confetti (Crackers) Effect
// Confetti (Crackers) Effect - Modal ke upar dikhne ke liye
  const fireConfetti = () => {
    const duration = 3 * 1000; // 3 seconds tak chalega
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 }; // Z-Index high rakha hai

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Do jagah se footenge crackers (Left aur Right side se box ke upar)
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const res = await fetch(DONOR_API);
        const data = await res.json();
        if (Array.isArray(data)) {
          setDonors(data);
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
          localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
        }
      } catch (err) {
        const saved = localStorage.getItem(CACHE_KEY);
        if (saved) setDonors(JSON.parse(saved));
      }
    };
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    if (cachedData && cachedTime && (Date.now() - parseInt(cachedTime) < EXPIRE_TIME)) {
      setDonors(JSON.parse(cachedData));
    } else {
      fetchDonors();
    }
  }, []);

  // 3. Modal Open hone par Confetti chalao
  useEffect(() => {
    if (selectedDonor) {
      document.body.style.overflow = 'hidden';
      fireConfetti();
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedDonor]);

  const displayList = useMemo(() => {
    if (donors.length === 0) return [];
    return [...donors, ...donors]; 
  }, [donors]);

  useLayoutEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;
    const handleTouchMove = (e) => {
      if (!isDragging) return;
      e.preventDefault(); 
      const x = e.touches[0].pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    };
    slider.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => slider.removeEventListener('touchmove', handleTouchMove);
  }, [isDragging, startX, scrollLeft]);

  const startDragging = (e) => {
    setIsDragging(true);
    const pageX = e.pageX || (e.touches ? e.touches[0].pageX : 0);
    setStartX(pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const stopDragging = useCallback(() => setIsDragging(false), []);

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; 
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  if (donors.length === 0) return null;

  return (
    <div className="donors-ticker-container">
      <div className="ticker-badge">LATEST DONATIONS</div>
      <div 
        className={`ticker-window ${isDragging ? "active" : ""}`}
        ref={scrollRef}
        onMouseDown={startDragging}
        onMouseLeave={stopDragging}
        onMouseUp={stopDragging}
        onMouseMove={onMouseMove}
        onTouchStart={startDragging}
        onTouchEnd={stopDragging}
      >
        <div className={`ticker-track ${isDragging ? "paused" : ""}`}>
          {displayList.map((d, i) => (
            <div key={`${d.name}-${i}`} className="donor-card-item">
              <div className="donor-avatar" onClick={() => setSelectedDonor(d)}>
                <img src={d.photo || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt={d.name} loading="lazy" />
              </div>
              <div className="donor-details">
                <span className="donor-name">{d.name}</span>
                <p className="donor-amt-highlight">₹{d.amount}</p>
              </div>
              <span className="ticker-separator">•</span>
            </div>
          ))}
        </div>
      </div>

  {selectedDonor && (
  <div className="donor-modal-overlay" onClick={() => setSelectedDonor(null)}>
    <div className="donor-modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="close-btn" onClick={() => setSelectedDonor(null)}>&times;</button>
      
      <img src={selectedDonor.photo || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="Donor" />
      
      <h2 style={{color: '#0b2239', margin: '15px 0 10px 0', fontSize: '22px'}}>
        "जररा नवाजी के लिए दिल ❤️ से शुक्रिया!"
      </h2>
      
      <p style={{fontSize: '15px', color: '#555', lineHeight: '1.6', padding: '0 10px'}}>
        आपका यह <b>₹{selectedDonor.amount}</b> रुपये का <b>तावुन</b>, नेक व काबिले तारीफ है। <br/>
        अल्लाह आपको खूब नवाज़े। आमीन 🤲
      </p>

      <div className="modal-amt">₹{selectedDonor.amount}</div>
      
      {/* WhatsApp Share Button */}
      <button className="wa-share-btn" onClick={() => shareOnWhatsApp(selectedDonor)}>
        नेकी का पैगाम शेयर करें 📱
      </button>
      
      <div className="modal-info-grid">
        <p className="modal-cause"><b>बाबत:</b> {selectedDonor.cause || "खिदमत-ए-खल्क"}</p>
        <small className="modal-date"><b>तारीख:</b> {selectedDonor.date}</small>
      </div>

    </div>
  </div>
)}
    </div>
  );
};

export default DonorsTicker;