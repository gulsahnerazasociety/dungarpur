import { useState } from "react";
import { Link } from "react-router-dom";
const API =
  "https://script.google.com/macros/s/AKfycbyLSS0hpDi5xGPf43Ac-FM4C2TElFEhVcWki5DPLDyRn1qv-ud6xJe5FGcBC_w55zJZ/exec";

// 🔹 Date formatter
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-IN");
};

export default function ViewParticipant() {
  const [formNo, setFormNo] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!formNo || aadhaar.length !== 12) {
      alert("Form No और पूरा 12 digit Aadhaar जरूरी है ❗");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${API}?action=getByFormAadhaar&formNo=${formNo}&aadhaar=${aadhaar}`
      );
      const json = await res.json();

      if (!json.success) {
        alert(json.message);
        setData(null);
        return;
      }

      setData(json);
    } catch {
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exam-container">

      {/* SEARCH */}
      <div className="search-box no-print">
        <input
          placeholder="Form No"
          value={formNo}
          onChange={(e) => setFormNo(e.target.value.trim())}
        />
        <input
          placeholder="Full Aadhaar (12 digits)"
          maxLength="12"
          value={aadhaar}
          onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
        />
        <button onClick={fetchData} disabled={loading}>
          {loading ? "Checking..." : "View Form"}
        </button>
      </div>

      {/* ⚠️ PHOTO NOT UPLOADED MESSAGE */}
      {data && !data.photo && (
        <div className="photo-warning">
          <h3>⚠️ फोटो अपलोड नहीं मिली</h3>
          <p>
            कृपया पहले अपनी <strong>Passport Size Photo</strong> और
            आवश्यक <strong>Documents</strong> अपलोड करें।
          </p>
          <p>
            फोटो अपलोड होने के बाद ही आप अपना फॉर्म देख और डाउनलोड कर सकते हैं।
          </p>
          <Link to="/upload-documents">
                Please Upload Your Photo and Document as a adhar card
          </Link>
        </div>
      )}

      {/* ✅ FORM ONLY WHEN PHOTO EXISTS */}
      {data && data.photo && (
        <>
          {/* DOWNLOAD BUTTON */}
          <div className="download-wrap no-print">
            <button className="print-btn" onClick={() => window.print()}>
              ⬇️ Download PDF
            </button>
          </div>

          {/* PRINTABLE AREA */}
          <div className="print-area">

            {/* HEADER */}
            <div className="admit-header">
              <img src="/logo.webp" className="logos" alt="Society logo" />

              <div className="title">
                <h1>गुलशन-ए-रज़ा सोसाइटी, डूंगरपुर</h1>
                <h3>Quiz & Islamic Competition 2026</h3>
                <p className="sub">SUBMITTED FORM</p>
              </div>

              <div className="qr-box">
                <img src="/logo.webp" className="qr-img" alt="QR code" />
              </div>
            </div>

            {/* FORM */}
            <div className="exam-form">
              <div className="form-left">
                <div className="row"><span>Form No</span><strong>{data.formNo}</strong></div>
                <div className="row"><span>Student Name</span><strong>{data.name}</strong></div>
                <div className="row"><span>Father Name</span><strong>{data.father}</strong></div>
                <div className="row"><span>Date of Birth</span><strong>{formatDate(data.dob)}</strong></div>
                <div className="row"><span>Age</span><strong>{data.age}</strong></div>
                <div className="row"><span>Address</span><strong>{data.address}</strong></div>
                <div className="row"><span>Mobile</span><strong>{data.phone}</strong></div>
                <div className="row"><span>Aadhaar No.</span><strong>{String(data.aadhaar)}</strong></div>

                <h3>Competition Details</h3>
                <div className="row">
                  <span>Competition</span>
                  <strong>{data.competition}</strong>
                </div>
              </div>

              <div className="form-right">
                <img
                  src={data.photo}
                  alt={`${data.name} photograph`}
                  onError={(e) => {
                    e.target.src = "/placeholder.jpg";
                    console.warn("Photo failed:", data.photo);
                  }}
                  style={{ objectFit: "cover" }}
                />
                <p>Passport Size Photo</p>
              </div>
            </div>

            {/* SIGNATURE TABLE */}
            <table className="signature-table">
              <tbody>
                <tr>
                  <td>
                    <strong>Student Signature</strong>
                    <div className="signature-box"></div>
                  </td>
                  <td>
                    <strong>Guardian Signature</strong>
                    <div className="signature-box"></div>
                  </td>
                  <td>
                    <strong>Date</strong>
                    <div className="signature-box">
                     
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <hr className="cut-line" />

            {/* RECEIPT */}
            <h3 className="receipt-title">Participant Receipt</h3>
            <table className="signature-table">
              <tbody>
                <tr>
                  <td>
                    <strong>Student Name</strong>
                    <div className="receipt-value">{data.name}</div>
                  </td>
                  <td>
                    <strong>Payment Mode</strong>
                    <div className="signature-box"></div>
                  </td>
                  <td>
                    <strong>Date</strong>
                    <div className="signature-box">
                    
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

          </div>
        </>
      )}
    </div>
  );
}