import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

// ✅ PHOTO VALIDATION HELPER
const hasValidPhoto = (photo) => {
  return (
    photo &&
    typeof photo === "string" &&
    photo.trim() !== "" &&
    photo !== "NA" &&
    photo !== "Not Uploaded"
  );
};


export default function AdmitCard() {
  const [formNo, setFormNo] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

 // https://script.google.com/macros/s/AKfycbwu5IRrz-Z4PZopQZRG6IlNikKGX9aWCnlMUdt5evyi23glJ5jxT_KLPh40tcQEZPSD/exec  this api is without cache api

  
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbwOsXsAveNj588Mh9poVZJNwAYAIehvkeyt0WEo_Kx3CuiL8YhzKaJJOO8xs0Lb2fo/exec";

  // 🔒 Admit Card Open Date (LOCK)
  const ADMIT_OPEN_DATE = new Date("2026-04-10");

  // 🔲 QR Value (safe – no aadhaar)
  const getQRValue = (data) =>
    `https://gulshanerazasociety.aetmyweb.com/verify?formNo=${data.formNo}`;

  const getAdmit = async () => {
    // 🔐 Basic Validation
    if (!formNo || aadhaar.length !== 12) {
      setMessage("❌ Form No और 12 अंकों का Aadhaar जरूरी है");
      return;
    }

    // ⏳ Date Lock Check
    const today = new Date();
    if (today < ADMIT_OPEN_DATE) {
      setMessage("⏳ Admit Card अभी जारी नहीं हुआ है");
      return;
    }

    setLoading(true);
    setMessage("");
    setData(null);

    try {
      const res = await fetch(
        `${scriptURL}?action=getAdmit&formNo=${formNo}&aadhaar=${aadhaar}`
      );

      const result = await res.json();

      if (!result.success) {
        setMessage(result.message || "❌ रिकॉर्ड नहीं मिला");
        return;
      }

      // ✅ Backend already verified:
      // - FormNo
      // - Aadhaar
      // - Payment
      setData(result);

    } catch (err) {
      console.error(err);
      setMessage("❌ Network / Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admit-box">
      <h1>Admit Card Download</h1>
      <p>Form Number और Aadhaar डालकर Admit Card प्राप्त करें</p>

      <input
        placeholder="Enter Form Number (ex: GRF-0011)"
        value={formNo}
        onChange={(e) => setFormNo(e.target.value)}
      />

      <input
        placeholder="Enter Aadhaar Number"
        value={aadhaar}
        maxLength={12}
        onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
      />

      <button onClick={getAdmit} disabled={loading}>
        {loading ? "Loading..." : "Get Admit Card"}
      </button>

      {message && <p className="error">{message}</p>}

      {/* 🔄 Loading Indicator */}
      {loading && (
        <div className="loader">
          ⏳ Admit Card लोड हो रहा है...
        </div>
      )}

      {data && (
        <div className="admit-wrapper" id="printArea">
          {/* HEADER */}
          <div className="admit-header">
            <img src="/logo.webp" className="logos" alt="Logo" />

            <div className="title">
              <h1>गुलशन-ए-रज़ा सोसाइटी, डूंगरपुर</h1>
              <h3>Quiz & Islamic Competition 2026</h3>
              <p className="sub">ADMIT CARD</p>
            </div>

            <div className="qr-box">
              <QRCodeSVG value={getQRValue(data)} size={90} />
              <p className="qr-text">Scan for Verification</p>
            </div>
          </div>

          {/* INFO BAR */}
          <div className="info-bar">
            <div><b>Form No:</b> {data.formNo}</div>
            <div><b>Roll No:</b> {data.rollno}</div>
            <div><b>Group:</b> {data.ageGroup}</div>
          </div>

          {/* BODY */}
          <div className="admit-body">
            <div className="left">
              <p><b>Name:</b> {data.name}</p>
              <p><b>Father’s Name:</b> {data.father}</p>
              <p><b>Address:</b> {data.address}</p>
              <p><b>Age:</b> {data.age}</p>
              <p><b>Competition:</b> {data.competition}</p>
              <p><b>Exam Center:</b> {data.examcent}</p>
              <p className="paid">Status: PAID ✔</p>
            </div>

           <div className="right">
              {hasValidPhoto(data.photo) && (
                <img
                  src={data.photo}
                  className="photo"
                  alt={data.name}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              )}

              {/* PHOTO PLACEHOLDER */}
              <div
                className="photo-placeholder"
                style={{
                  display: hasValidPhoto(data.photo) ? "none" : "flex"
                }}
              >
                AFFIXED  
                <br />
                YOUR
                <br />
                PHOTO
              </div>

              <div className="sign-box">
                <p>Controller of Examination</p>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="admit-footer">
            <p>📌 Admit Card परीक्षा केंद्र पर लाना अनिवार्य है</p>
          </div>

          <button onClick={() => window.print()} className="print-btn">
            Print / Download PDF
          </button>
        </div>
      )}
    </div>
  );
}
