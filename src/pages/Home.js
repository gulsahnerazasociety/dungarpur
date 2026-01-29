import { Link } from "react-router-dom";
import NoticeBoard from "../components/NoticeBoard";
import GAStats from "../components/GAStats";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";



export default function Home() {
  const [committeeData, setCommitteeData] = useState([]);


useEffect(() => {
fetch("https://raw.githubusercontent.com/gulsahnerazasociety/dungarpur/main/committee.json?"+Date.now())

.then(res => res.json())
.then(data => setCommitteeData(data))
.catch(err => console.error("Committee JSON error:", err));
}, []);
  return (
    <>

      {/* HERO SECTION */}

      <section className="hero-section">

        <img
          src={"/logo.webp"}
          alt="Society Logo"
          style={{
            width: "140px",
            marginBottom: "10px",
            borderRadius:"50%"
          }}
        />

        <h1>गुलशन-ए-रज़ा सोसाइटी</h1>
        <h2>Quiz & Islamic Competition 2026</h2>
        <p>
          शिक्षा • दीन • जागरूकता
          बच्चों और युवाओं के लिए सुनहरा अवसर!
        </p>

        <div className="hero-buttons">
          <Link to="/register" className="btn primary">Register Now</Link>
          <Link to="/receipt" className="btn secondary">Check Receipt</Link>
        </div>
      </section>
< NoticeBoard />
      {/* PRIZE SECTION */}
      <section className="info">
        <h2>🎯 प्रतियोगिता के 🏆 पुरस्कार व इनआमात</h2>

        <div className="info-grid">
          <div className="card">
            <span style={{fontSize:"50px"}}>🥇</span> FREE UMRAH (शर्तों के साथ)
          </div>
          <div className="card">
            <span style={{fontSize:"50px"}}>🥈</span> Laptop
          </div>
          <div className="card">
             <span style={{fontSize:"50px"}}>🥉</span> Tablet
          </div>
          <div className="card">
             <span style={{fontSize:"50px"}}>🏅</span> Bicycle
          </div><div className="card">
             <span style={{fontSize:"50px"}}>💵</span> ₹3100
          </div><div className="card">
             <span style={{fontSize:"50px"}}>🎁</span> ₹1100
          </div>
        </div>

        <p className="note">
          आप सभी डूंगरपुर जिला निवासी से गुजारीश है कि ज्‍यादा से ज्‍यादा हिस्‍सा लेकर दीन की मालुमात में इजाफा करेा
        </p>
      </section>

      {/* INFO SECTION */}
      <section className="info">
        <h2>🎯 प्रतियोगिता की जानकारी</h2>
        <Link to="/competition" className="big-card">
          🎯 प्रतियोगिता किस प्रकार होगी?
        </Link>
        <div className="info-grid">
          <div className="card">
            📖 कुरआन प्रश्नोत्तरी
          </div>
          <div className="card">
            📖 हदीस प्रश्नोत्तरी
          </div>
          <div className="card">
            🎤 दीनी मालुमात प्रतियोगिता
          </div>
        </div>

        <p className="note">
          आयु के अनुसार Group तय • Fees Auto Apply • Online Receipt Available
        </p>
      </section>

      {/* QUICK LINKS */}
      <section className="links-area">
        <Link to="/participants" className="big-card">
          🎟 Registered Participants List
        </Link>

        <Link to="/admit-card" className="big-card">
          🧾 Download Admit Card
        </Link>

        <Link to="/payment" className="big-card">
          💰 Payment / Fees Details
        </Link>
         <Link to="/view" className="big-card">
          🧾 आप अपना भरा हुआ फोर्म यहा से निकाल सकते हैा
        </Link>
       
      </section>

{/* COMMITTEE SWIPER SECTION */}
<section className="committee-section">
  <h2>🕌 Committee Details</h2>

  {committeeData.map((group, index) => (
    <div key={index} className="committee-block">
      <h3>{group.title}</h3>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          autoplay={{ delay: 10000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >

        {group.members.map((m, i) => (
       <SwiperSlide key={i}>
        <div className="committee-card">

          <div className="member-box">

            {/* 🔹 FRONT VIEW (default) */}
            <div className="member-front">
              <h3>{m.post}</h3>
              <p className="member-name">{m.name}</p>
              <small className="member-place">{m.place}</small>
              <span className="tap-hint">Tap to view Photo</span>
            </div>

            {/* 🔹 HOVER / TAP VIEW */}
            <div className="member-hover">
              {m.photo && <img src={m.photo} alt={m.name} />}

              <div className="member-info">
                <p className="member-name">{m.name}</p>
                <strong>{m.qualification}</strong>
            
              </div>
            </div>

          </div>

          {m.new && <span className="new-badge">NEW</span>}
        </div>
      </SwiperSlide>


        ))}
      </Swiper>
    </div>
  ))}

  <p className="motto">
    Service • Transparency • Unity <br />
    <strong>Gulshan-e-Raza Society, Dungarpur</strong>
  </p>
</section>


{/* SOCIAL & COMMUNITY LINKS */}
<section className="social-links-section">
  <h2>📢 Updates & Community</h2>

  <div className="social-links-grid">

    <a
      href="https://chat.whatsapp.com/Fma5j6UmxI42INu2PbQGA8"
      target="_blank"
      rel="noopener noreferrer"
      className="social-card whatsapp"
    >
      📲 Join Official WhatsApp Group  
      <small>Competition Updates & Notices</small>
    </a>

    <a
      href="https://www.youtube.com/@GulshanERazasociety"
      target="_blank"
      rel="noopener noreferrer"
      className="social-card youtube"
    >
      ▶️ Subscribe Our YouTube Channel  
      <small>Quiz • Programs • Result Videos</small>
    </a>

  </div>
</section>
< GAStats />

      <footer>
        © December 2022 Gulshan-E-Raza Society | Dungarpur
      </footer>
    </>
  );
}
