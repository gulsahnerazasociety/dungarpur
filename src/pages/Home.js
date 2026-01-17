import { Link } from "react-router-dom";
import NoticeBoard from "../components/NoticeBoard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const committeeData = [
  {
    title: "Committee Office Bearers",
    members: [
      { post: "President", name: "Raees Ahmed", place: "MewaFarosh, Shastri Colony" },
      { post: "Vice President", name: "Abdul Hakim Qureshi", place: "Amir Colony" },
      { post: "General Secretary", name: "Vahid Hussain", place: "Hajipura (Ghanti)" },
      { post: "Joint Secretary", name: "Abid Hussain Malik", place: "Sheikhwada (Ghanti)" },
      { post: "Treasurer (Cashier)", name: "Mukammil Ahmed Qureshi", place: "Kandharwadi" },
      { post: "Joint Cashier", name: "Mahfooz Hussain Sheikh", place: "Shastri Colony" },
    ],
  },
  {
    title: "Program Management",
    members: [
      { name: "Hasinuddin Qureshi", place: "Lalpura" },
      { name: "Javed Khan Pathan", place: "Chamanpura" },
    ],
  },
  {
    title: "Audit / Accounts Members",
    members: [
      { name: "Zakir Hussain", place: "Madar Fali (Kuwait)" },
      { name: "Mustakim Gouri", place: "Alipura (Kuwait)" },
      { name: "Dr. Kalim", place: "Udaipur (Ghanti) (Kuwait)" },
      { name: "Mohammed Ayyub", place: "Madaar Colony (Kuwait)" },
      { name: "Mohammed Irfan", place: "Hasni Gali (Kuwait)" },
      { name: "Mohammed Julfikar", place: "Amir Colony (Kuwait)" },
      { name: "Abdul Zahid Hussain", place: "Amir Colony (Kuwait)" },
      { name: "Ziauddin Qureshi", place: "Amir Colony (Kuwait)", new: true },
      { name: "Saddam Hussain (Mudassar)", place: "Faraswara" },
      { name: "Mohammad Rizwan Malik", place: "Patela, Dungarpur" },
      { name: "Mohammed Aasif", place: "Hajipura (Ghanti)", new: true },
    ],
  },
  {
    title: "Media / Publicity In-Charge",
    members: [
      { name: "Mohammed Mohshin", place: "Madar Colony (Kuwait)" },
      { name: "Anwar Mukhtar", place: "Kandharwadi (Kuwait)" },
      { name: "Mohammed Ali", place: "Shastri Colony" },
    ],
  },
  {
    title: "Advisory Board",
    members: [
      { name: "Janab Asrar Ahmed Ji (Advocate)", place: "Lalpura" },
      { name: "Janab Riyaz Ahmed Qureshi", place: "Madar Colony, Ghanti" },
      { name: "Janab Mohammed Irfan Makrani", place: "Shastri Colony" },
      { name: "Janab Sayyed Zabir Ali", place: "Kandharwadi" },
      { name: "Janab Maqbool Hussain Pathan", place: "Madar Colony, Ghanti" },
      { name: "Janab Rahamatullah Khan", place: "Garibnawaz Colony" },
      { name: "Janab Mohammed Rafiq Ji", place: "Mewafarosh" },
    ],
  },
  {
    title: "Religious Advisor",
    members: [
      { name: "Janab Qari Mohammed Irfan", place: "Huseni Chowk" },
    ],
  },
];

export default function Home() {
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
        autoplay={{ delay: 2500 }}
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
              {m.post && <h4>{m.post}</h4>}
              <p>{m.name}</p>
              <small>{m.place}</small>
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


      <footer>
        © December 2022 Gulshan-E-Raza Society | Dungarpur
      </footer>
    </>
  );
}
