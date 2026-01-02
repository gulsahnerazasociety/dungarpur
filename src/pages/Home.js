import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
  
      {/* HERO SECTION */}
      <section className="hero-section">

        <img 
          src={process.env.PUBLIC_URL + "/logo.webp"} 
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

      {/* INFO SECTION */}
      <section className="info">
        <h2>🎯 प्रतियोगिता की जानकारी</h2>

        <div className="info-grid">
          <div className="card">
            📘 General Knowledge Quiz
          </div>
          <div className="card">
            📖 कुरआन प्रश्नोत्तरी
          </div>
          <div className="card">
            🎤 नात / तिलावत प्रतियोगिता
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
      </section>

      <footer>
        © {new Date().getFullYear()} Gulshan-E-Raza Society | Dungarpur
      </footer>
    </>
  );
}
