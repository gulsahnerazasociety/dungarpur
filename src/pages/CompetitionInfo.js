export default function CompetitionInfo() {
  return (
    <div className="competition-container">

      {/* HEADER */}
      <div className="header-card">
        <h1>गुलशन-ए-रज़ा सोसायटी, डूंगरपुर</h1>
        <h2>Quiz & Islamic Competition 2026</h2>
        <p className="highlight">
          🎉 बच्चों और युवाओं में दीन, इल्म, तालीम और जागरूकता को बढ़ावा देने की एक भव्य पहल
        </p>
      </div>

      {/* AGE GROUP */}
      <section className="card">
        <h2>📚 आयु वर्ग (Age Group)</h2>
        <div className="grid">
          <span>🟢 08 – 12 वर्ष</span>
          <span>🟢 13 – 17 वर्ष</span>
          <span>🟢 18 – 22 वर्ष</span>
          <span>🟠 23 – 70 वर्ष</span>
        </div>
      </section>

      {/* FEES */}
      <section className="card">
        <h2>💰 रजिस्ट्रेशन फीस</h2>
        <div className="grid">
          <span>08 – 22 वर्ष : <b>₹350</b></span>
          <span>23 – 70 वर्ष : <b>₹500</b></span>
        </div>
      </section>

      {/* EXAM PATTERN */}
      <section className="card">
        <h2>📝 इम्तिहान पैटर्न</h2>
        <ul>
          <li>100 प्रश्न (हर प्रश्न 1 अंक)</li>
          <li>Syllabus आधारित प्रश्नपत्र</li>
          <li>15 दिन की तैयारी का समय</li>
          <li>बेहतर वातावरण और Proper Management</li>
          <li>Exam Dungarpur शहर में आयोजित</li>
        </ul>
      </section>

      {/* PRIZES */}
      <section className="card prize">
        <h2>🏆 पुरस्कार</h2>
        <ul>
          <li>🥇 FREE UMRAH (शर्तों के साथ)</li>
          <li>🥈 Laptop</li>
          <li>🥉 Tablet</li>
          <li>🏅 Bicycle</li>
          <li>💵 ₹3100</li>
          <li>🎁 ₹1100</li>
        </ul>
      </section>

      {/* DATES */}
      <section className="card date-card">
        <h2>📅 प्रतियोगिता अवधि</h2>
        <p>🗓 Sunday 28 December 2025 से 15 January 2026 तक</p>

        <div className="admit-date">
          🎫 <b>Exam and Admit Card जारी होने की तिथि आपको इस वेबसाईट पर जारी कर दी जाएगी</b><br/>
          {/* <span>16 January 2026</span> */}
        </div>
      </section>

      {/* RULES */}
      <section className="card">
        <h2>📌 महत्वपूर्ण नियम</h2>
        <ul>
          <li>Registration के बाद फीस Refund नहीं होगी</li>
          <li>उम्र के अनुसार Group तय होगा</li>
          <li>23 – 45 Group के लिए Special Umrah Draw</li>
        </ul>
      </section>

      {/* TEAM */}
      <section className="card">
        <h2>🤝 आयोजन एवं प्रबंधन</h2>
        <ul>
          <li>गुलशन-ए-रज़ा सोसायटी (Dungarpur)</li>
          <li>उलेमा-ए-किराम की देखरेख</li>
          <li>समर्पित Team Members</li>
        </ul>
      </section>

      {/* SPONSOR */}
      <section className="card sponsor">
        <h3>❤️ विशेष धन्यवाद – Sponsors & Supporters</h3>
        <div className="grid">
          <span>समाजसेवी</span>
          <span>तालीमी घराने</span>
          <span>नगर के जिम्मेदार लोग</span>
          <span>Gulshan-e-Raza Team</span>
        </div>
      </section>

      <div className="note">
        💡 Registration Online / Offline दोनों Available
      </div>

    </div>
  );
}
