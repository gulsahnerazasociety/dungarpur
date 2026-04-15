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
          <span>Part A : 🟢 08 – 12 वर्ष</span>
          <span>Part B : 🟢 13 – 17 वर्ष</span>
          <span>Part C : 🟢 18 – 22 वर्ष</span>
          <span>Part D : 🟠 23 वर्ष से ज्‍यादा</span>
        </div>
      </section>

      {/* FEES */}
      <section className="card">
        <h2>💰 रजिस्ट्रेशन फीस</h2>
        <div className="grid">
          <span>08 – 22 वर्ष: <b>₹350</b></span>
          <span>23 वर्ष से ज्‍यादा: <b>₹500</b></span>
        </div>
      </section>

      {/* EXAM PATTERN */}
      <section className="card">
        <h2>📝 इम्तिहान पैटर्न</h2>
        <ul>
          <li>100 Objective प्रश्न (हर प्रश्न 1 अंक)</li>
          <li>Question Paper केवल हिंदी भाषा में</li>
          <li>4 Options होंगे – A, B, C, D</li>
          <li>15–20 दिन पहले Syllabus/Book दी जाएगी</li>
          <li>Paper उसी Book/Syllabus से आएगा</li>
          <li>Transparency हेतु YouTube Live की कोशिश</li>
          <li>Exam केवल Dungarpur District Level</li>
        </ul>
      </section>

      {/* PRIZES */}
      <section className="card prize">
        <h2>🏆 पुरस्कार</h2>
        <h4>🔹 Part A (7 – 22 साल)</h4>
        <ul>
          <li>🥇 Umrah – 3 Members (बच्चे के साथ वाल्देन)</li>
          <li>🥈 Laptop</li>
          <li>🥉 Tablet</li>
          <li>🏅 Cycle</li>
          <li>💰 ₹3,100</li>
          <li>💰 6th–10th: ₹1,100</li>
        </ul>

        <h4>🔹 Part B (22 साल + 1 महीना)</h4>
        <ul>
          <li>🥇 Umrah – 2 Members (1 के साथ 1 Free)</li>
        </ul>
      </section>

      {/* DATES */}
      <section className="card date-card">
        <h2>📅 प्रतियोगिता अवधि</h2>
        <p>🗓 Sunday 28 December 2025 से 31 May 2026 तक</p>

        <div className="admit-date">
          🎫 <b>Exam and Admit Card जारी होने की तिथि आपको इस वेबसाईट पर जारी कर दी जाएगी</b><br/>
          {/* <span>16 January 2026</span> */}
        </div>
      </section>

      {/* RULES */}
      <section className="card">
        <h2>📌 महत्वपूर्ण नियम</h2>
        <ul>
          <li>Registration Fee Refund नहीं होगी</li>
          <li>Age Group अनुसार अलग-अलग Exam होगा</li>
          <li>बराबर अंक आने पर 20 Marks का Extra Test (20 मिनट)</li>
          <li>Extra Test से Final 1st Position तय होगी</li>
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
