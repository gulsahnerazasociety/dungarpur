import { useState } from "react";

export default function AdmitCard(){

  const [formNo, setFormNo] = useState("");
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");

  const scriptURL =
    "https://script.google.com/macros/s/AKfycbwjnwHZHGT0uOLlMwBM3BOQ1PpBU74StwdPeju2jqhGDKjlKcwM-8K939s1-HhA5xE8/exec";

  // 🔒 Admit Card Open Date (CHANGE HERE)
  const ADMIT_OPEN_DATE = new Date("2026-01-16"); // YYYY-MM-DD

  const getAdmit = async () => {

    if(!formNo){
      setMessage("❌ कृपया Form Number दर्ज करें");
      return;
    }

    try{
      const res = await fetch(
        `${scriptURL}?action=getAdmit&formNo=${formNo}`
      );
      const result = await res.json();

      if(!result.success){
        setMessage("❌ रिकॉर्ड नहीं मिला");
        setData(null);
        return;
      }

      // ⏳ Date Check
      const today = new Date();
      if(today < ADMIT_OPEN_DATE){
        setMessage("⏳ Admit Card अभी जारी नहीं हुआ है");
        setData(null);
        return;
      }

      // 💰 Payment Check
      if(result.status.toLowerCase() !== "paid"){
        setMessage("❌ आपने अभी तक फीस जमा नहीं की है");
        setData(null);
        return;
      }

      // ✅ All OK
      setData(result);
      setMessage("");

    }catch{
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
        onChange={(e)=>setFormNo(e.target.value)}
      />

      <button onClick={getAdmit}>Get Admit Card</button>

      {message && <p className="error">{message}</p>}

      {data && (
        <div className="admit-card" id="printArea">
          <h3 style={{color:"red"}}><b>Roll No: </b>{data.rollno}</h3>
          {/* LOGO */}
          <img
            src={process.env.PUBLIC_URL + "/logo.webp"}
            alt="Logo"
            className="admit-logo"
          />

          <h2>गुलशन-ए-रज़ा सोसाइटी, डूंगरपुर</h2>
          <h3>Quiz & Islamic Competition 2026</h3>

          <div className="admit-details">
            <p><b>Form No:</b> {data.formNo}</p>
            <p><b>Name:</b> {data.name}</p>
            <p><b>Father:</b> {data.father}</p>
            <p><b>Address:</b> {data.address}</p>
            <p><b>Age:</b> {data.age} years</p>
            <p><b>Group:</b> {data.ageGroup}</p>
            <p><b>Competition:</b> {data.competition}</p>
            <p className="paid">Status: PAID ✔️</p>
            <p className="paid"><b>Exam Center :</b> {data.examcent}</p>
          </div>

          <button onClick={()=>window.print()}>
            Print / Download PDF
          </button>

        </div>
      )}

    </div>
  );
}
