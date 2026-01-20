import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";


export default function AdmitCard() {

  const [formNo, setFormNo] = useState("");
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");

  const scriptURL =
    "https://script.google.com/macros/s/AKfycbwy0SyeywJvofF294F3iSdwEsJaZM3LsnFa_ETCLpuwYoiBejHmMkHK7xm2D-9FnvE/exec";

  // 🔒 Admit Card Open Date
  const ADMIT_OPEN_DATE = new Date("2026-05-05");

  // 🔲 QR Value
  const getQRValue = (data) =>
    `https://gulshanerazasociety.aetmyweb.com/verify?formNo=${data.formNo}`;

  const getAdmit = async () => {

    if (!formNo) {
      setMessage("❌ कृपया Form Number दर्ज करें");
      return;
    }

    try {
      const res = await fetch(
        `${scriptURL}?action=getAdmit&formNo=${formNo}`
      );
      const result = await res.json();

      if (!result.success) {
        setMessage("❌ रिकॉर्ड नहीं मिला");
        setData(null);
        return;
      }

      // ⏳ Date Check
      const today = new Date();
      if (today < ADMIT_OPEN_DATE) {
        setMessage("⏳ Admit Card अभी जारी नहीं हुआ है");
        setData(null);
        return;
      }

      // 💰 Payment Check
      if (result.status.toLowerCase() !== "paid") {
        setMessage("❌ आपने अभी तक फीस जमा नहीं की है");
        setData(null);
        return;
      }

      // ✅ All OK
      setData(result);
      setMessage("");

    } catch {
      setMessage("❌ Server Error, फिर से प्रयास करें");
    }
  };

  return (
    <div className="admit-box">

      <h1>Admit Card Download</h1>
      <p>Form Number डालकर Admit Card प्राप्त करें</p>

      <input
        placeholder="Enter Form Number (ex: GRF-0005)"
        value={formNo}
        onChange={(e) => setFormNo(e.target.value)}
      />

      <button onClick={getAdmit}>Get Admit Card</button>

      {message && <p className="error">{message}</p>}

      {data && (
        <div className="admit-wrapper" id="printArea">

          {/* HEADER */}
          <div className="admit-header">
            <img
              src="/logo.webp"
              className="logos"
              alt="Gulshan-e-Raza Society Logo"
            />
            <div className="title">
              <h1>गुलशन-ए-रज़ा सोसाइटी, डूंगरपुर</h1>
              <h3>Quiz & Islamic Competition 2026</h3>
              <p className="sub">ADMIT CARD</p>
            </div>
             {/* QR CODE */}
              <div className="qr-box">
                <QRCodeSVG
                  value={getQRValue(data)}
                  size={90}
                  includeMargin={true}
                  aria-label={`Verification QR code for Form Number ${data.formNo}`}
                />

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

            {/* LEFT */}
            <div className="left">
              <p><b>Name:</b> {data.name}</p>
              <p><b>Father’s Name:</b> {data.father}</p>
              <p><b>Address:</b> {data.address}</p>
              <p><b>Age:</b> {data.age}</p>
              <p><b>Competition:</b> {data.competition}</p>
              <p><b>Exam Center:</b> {data.examcent}</p>
              <p className="paid">Status: PAID ✔</p>
            </div>

            {/* RIGHT */}
            <div className="right">

              {/* PHOTO */}
              <img
                src={data.photo}
                className="photo"
                alt={`${data.name} Photograph`}
              />

             

              {/* SIGN */}
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
