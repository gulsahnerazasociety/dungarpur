import { Link } from "react-router-dom";
import NoticeBoard from "../components/NoticeBoard";
import GAStats from "../components/GAStats";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import useKabristanData from "../hooks/useKabristanData";
import FundPieChart from "../components/FundPieChart";
import AdBanner from "../components/AdBanner.jsx";

import "swiper/css";
import "swiper/css/pagination";
import "./home.css";

export default function Home() {
  const formatAmount = (num) => Number(num || 0).toFixed(2);
  const [committeeData, setCommitteeData] = useState([]);
 const { allRows, loading } = useKabristanData();

useEffect(() => {
fetch("https://raw.githubusercontent.com/gulsahnerazasociety/dungarpur/main/committee.json?"+Date.now())

.then(res => res.json())
.then(data => setCommitteeData(data))
.catch(err => console.error("Committee JSON error:", err));
}, []);

 if (loading) {
    return <p>Loading data...</p>;
  }
const sumBy = (id, type) =>
  allRows
    .filter(r => r.Kabristan_ID === id && r.Type === type)
    .reduce((s, r) => s + r.Amount, 0);

// latest record निकालो
const latestRecord = allRows.length
  ? [...allRows].sort(
      (a, b) => new Date(b.Date) - new Date(a.Date)
    )[0]
  : null;

const lastEntryDate = latestRecord
  ? latestRecord.DisplayDate
  : "—";




// if (allRows.length > 0) {
//     console.log("K1 Total IN:", inK1);
//     console.log("K1 Total OUT:", outK1);
//   }




  const totalReceived = allRows
    .filter(r => r.Type === "IN")
    .reduce((sum, r) => sum + r.Amount, 0);

  const totalExpense = allRows
    .filter(r => r.Type === "OUT")
    .reduce((sum, r) => sum + r.Amount, 0);

  const availableFund = totalReceived - totalExpense;
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
      <AdBanner />
< NoticeBoard />

      {/* PRIZE SECTION */}
      <section className="info">
        <h2>🎯 प्रतियोगिता के 🏆 पुरस्कार व इनआमात</h2>

        <div className="info-grid">
          <div className="card">
            <span style={{fontSize:"60px"}}> 🕋</span> FREE UMRAH (शर्तों के साथ)
          </div>
          <div className="card">
            <span style={{fontSize:"50px"}}> 💻</span> Laptop
          </div>
          <div className="card">
             <span style={{fontSize:"50px"}}> 📱</span> Tablet
          </div>
          <div className="card">
             <span style={{fontSize:"50px"}}> 🚴🏿‍♂️</span> Bicycle
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
          
        <div
          className="card"
          onClick={() =>
            window.open(
              "https://drive.google.com/uc?id=1S6heQOjSP4sZhbr4WOewBG3hURUsTkM7&export=download",
              "_blank"
            )
          }
        >
          🎤 दीनी मालुमात प्रतियोगिता (Syllabus Book) Download
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

    <section className="notice-section">
     <div className="home-dashboard">
      <h2>📊 Fund Overview <span>Last Updated Data: {lastEntryDate}</span></h2>

      <div className="cardsing">
        <div className="carding green">₹{formatAmount(totalReceived)}<span>Received </span><span>(कुल इम्‍दाद राशि)</span></div>
        <div className="carding red">₹{formatAmount(totalExpense)}<span>Expense</span><span>(कुल उपयोग की गई राशि)</span></div>
        <div className="carding blue">₹{formatAmount(availableFund)}<span>Available</span><span>(कुल बचत इम्‍दाद राशि)</span></div>
      </div>

      <div className="chart-box">
        <FundPieChart
          received={totalReceived}
          expense={totalExpense}
          available={availableFund}
        />
      </div>
    </div>
    </section>
<AdBanner />
      <section className="kabristan-section">
      <h2 className="section-title">उपरोक्‍त फण्‍ड का उपयोग किस प्रकार हुआ है, उसे आप यहा से देख सकते हैा</h2>

      <div className="kabristan-grid" id="kabristanGrid">
        <Link to="/dashboard/K1" className="kabristan-card">
          <span className="icon">🕌</span>
          <h3>1st - डूंगरपुर शहर कब्रस्‍तान </h3><p>(डूंगरपुर शहर कब्रस्‍तान)</p>
          <div style={{fontSize:'12px'}}>
            <p style={{color:'green'}}>कुल इम्‍दाद राशि: {formatAmount(sumBy("K1", "IN"))}</p>
            <span style={{color:'red'}}>कुल उपयोग की गई राशि: {formatAmount(sumBy("K1", "OUT"))}</span>
            <p style={{color:'blue'}}>कुल बचत इम्‍दाद राशि: {formatAmount(sumBy("K1", "IN")- sumBy("K1", "OUT"))}</p>
          </div>
        </Link>

        <Link to="/dashboard/K2" className="kabristan-card">
          <span className="icon">🕌</span>
            <h3>2nd -मेवा फरोश कब्रस्‍तान </h3><p>(मेवा फरोश कब्रस्‍तान)</p>
         <div style={{fontSize:'12px'}}>
            <p style={{color:'green'}}>कुल इम्‍दाद राशि: {formatAmount(sumBy("K2", "IN"))}</p>
            <span style={{color:'red'}}>कुल उपयोग की गई राशि: {formatAmount(sumBy("K2", "OUT"))}</span>
            <p style={{color:'blue'}}>कुल बचत इम्‍दाद राशि: {formatAmount(sumBy("K2", "IN")- sumBy("K2", "OUT"))}</p>
          </div>
        </Link>

        <Link to="/dashboard/K3" className="kabristan-card">
          <span className="icon">🕌</span>
           <h3>3rd - निचला कब्रस्‍तान </h3><p>(आशिक अली शाह बाबा)</p>
          <div style={{fontSize:'12px'}}>
            <p style={{color:'green'}}>कुल इम्‍दाद राशि: {formatAmount(sumBy("K3", "IN"))}</p>
            <span style={{color:'red'}}>कुल उपयोग की गई राशि: {formatAmount(sumBy("K3", "OUT"))}</span>
            <p style={{color:'blue'}}>कुल बचत इम्‍दाद राशि: {formatAmount(sumBy("K3", "IN")- sumBy("K3", "OUT"))}</p>
          </div>
        </Link>

        <Link to="/dashboard/K4" className="kabristan-card">
          <span className="icon">🕌</span>
          <h3>4th - उपर वाला कब्रस्‍तान </h3><p>(मस्‍तान शाह बाबा)</p>
          <div style={{fontSize:'12px'}}>
            <p style={{color:'green'}}>कुल इम्‍दाद राशि: {formatAmount(sumBy("K4", "IN"))}</p>
            <span style={{color:'red'}}>कुल उपयोग की गई राशि: {formatAmount(sumBy("K4", "OUT"))}</span>
            <p style={{color:'blue'}}>कुल बचत इम्‍दाद राशि: {formatAmount(sumBy("K4", "IN")- sumBy("K4", "OUT"))}</p>
          </div>
        </Link>
        <Link to="/dashboard/K5" className="kabristan-card">
          <span className="icon">🕌</span>
          <h3>5th - सामाजिक कार्य </h3><p>(डूंगरपुर)</p>
           <div style={{fontSize:'12px'}}>
            <p style={{color:'green'}}>कुल इम्‍दाद राशि: {formatAmount(sumBy("K5", "IN"))}</p>
            <span style={{color:'red'}}>कुल उपयोग की गई राशि: {formatAmount(sumBy("K5", "OUT"))}</span>
            <p style={{color:'blue'}}>कुल बचत इम्‍दाद राशि: {formatAmount(sumBy("K5", "IN")- sumBy("K5", "OUT"))}</p>
          </div>
        </Link>
        <Link to="/dashboard/K6" className="kabristan-card">
          <span className="icon">🕌</span>
          <h3>6th - मुकाबलाती इम्तिहान </h3><p>(2025-26)</p>
           <div style={{fontSize:'12px'}}>
            <p style={{color:'green'}}>कुल इम्‍दाद राशि: {formatAmount(sumBy("K6", "IN"))}</p>
            <span style={{color:'red'}}>कुल उपयोग की गई राशि: {formatAmount(sumBy("K6", "OUT"))}</span>
            <p style={{color:'blue'}}>कुल बचत इम्‍दाद राशि: {formatAmount(sumBy("K6", "IN")- sumBy("K6", "OUT"))}</p>
          </div>
        </Link>

        <Link to="/dashboard/K7" className="kabristan-card">
          <span className="icon">🕌</span>
          <h3>7th - जकात से प्राप्‍त आवक </h3><p>(2025-26)</p>
           <div style={{fontSize:'12px'}}>
            <p style={{color:'green'}}>कुल इम्‍दाद राशि: {formatAmount(sumBy("K7", "IN"))}</p>
            <span style={{color:'red'}}>कुल उपयोग की गई राशि: {formatAmount(sumBy("K7", "OUT"))}</span>
            <p style={{color:'blue'}}>कुल बचत इम्‍दाद राशि: {formatAmount(sumBy("K7", "IN")- sumBy("K7", "OUT"))}</p>
          </div>
        </Link>
      </div>
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
<AdBanner />
      <footer>
        © December 2022 Gulshan-E-Raza Society, Dungarpur |
        Developed by <a href="https://www.aetmyweb.com" target="_blank" rel="noopener noreferrer">AR Expert Team</a>  
  
      </footer>
    </>
  );
}
