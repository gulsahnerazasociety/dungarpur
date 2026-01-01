import { useState } from "react";

export default function Receipt() {

  const [formNo, setFormNo] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const fetchReceipt = async () => {

    if(!formNo){
      alert("कृपया अपना फॉर्म नंबर दर्ज करें");
      return;
    }

    const url = `https://script.google.com/macros/s/AKfycbwG49ITACXn2-nCo1OAXuY1jjqiY-6BwJeV7kB9M1ArDMvXlcnBE3zFGF3JdezTt-Ko/exec?formNo=${formNo}`;

    const res = await fetch(url);
    const result = await res.json();

    if(result.success){
      setData(result);
      setError("");
    } else {
      setError("फॉर्म नंबर नहीं मिला ❗");
      setData(null);
    }
  }

  const printReceipt = () => {
    window.print();
  }

  return (
    <div className="registration-box">

      <h1>गुलशन-ए-रज़ा सोसाइटी</h1>
      <h2>Receipt / भुगतान स्थिति</h2>

      <input 
        placeholder="अपना Form Number डालें (जैसे GRF-0005)"
        value={formNo}
        onChange={(e)=>setFormNo(e.target.value)}
      />

      <button onClick={fetchReceipt}>Receipt देखें</button>

      {error && <p style={{color:"red"}}>{error}</p>}

      {data && (
        <div className="receipt">

          <h3>🎫 Registration Receipt</h3>

          <p><b>फॉर्म नंबर:</b> {data.formNo}</p>
          <p><b>नाम:</b> {data.name}</p>
          <p><b>पिता का नाम:</b> {data.father}</p>
          <p><b>मोबाइल:</b> {data.phone}</p>
          <p><b>प्रतियोगिता:</b> {data.competition}</p>

          <p>
            <b>Status:</b> 
            {data.status === "Paid" 
              ? <span style={{color:"green"}}>✔️ Paid</span> 
              : <span style={{color:"orange"}}>⏳ Pending</span>}
          </p>

          <button onClick={printReceipt}>Print / Download</button>

        </div>
      )}

    </div>
  );
}
