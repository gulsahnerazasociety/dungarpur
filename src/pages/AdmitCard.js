import { useState } from "react";

export default function AdmitCard(){

  const [formNo, setFormNo] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const scriptURL = 
  "https://script.google.com/macros/s/AKfycbyYxvRqqCzxCVzba0HOYiQR0ENrZwamtborGD15SOiOPt3xodH54H7aUMUnDGOrADtI/exec";

  const getAdmit = async () => {

    if(formNo === ""){
      alert("Form Number दर्ज करें");
      return;
    }

    try{
      const res = await fetch(`${scriptURL}?action=getAdmit&formNo=${formNo}`);
      const result = await res.json();

      if(result.success){
        setData(result);
        setError("");
      }else{
        setError("Record Not Found");
        setData(null);
      }

    }catch{
      setError("Server Error Try Again");
    }
  };


  return (
    <div className="admit-box">

      <h1>Admit Card Download</h1>
      <p>Form Number डालकर Admit Card प्राप्त करें</p>

      <input 
        placeholder="Enter Form Number (ex: GRF-0005)"
        onChange={(e)=>setFormNo(e.target.value)}
      />

      <button onClick={getAdmit}>Get Admit Card</button>

      {error && <p className="error">{error}</p>}


      {data && (
        <div className="admit-card" id="printArea">

          <h2>Gulshan-E-Raza Society</h2>
          <h3>Competition Admit Card</h3>

          <p><b>Form No:</b> {data.formNo}</p>
          <p><b>Name:</b> {data.name}</p>
          <p><b>Father:</b> {data.father}</p>
          <p><b>Age:</b> {data.age}</p>
          <p><b>Group:</b> {data.ageGroup}</p>
          <p><b>Competition:</b> {data.competition}</p>
          <p><b>Status:</b> {data.status}</p>

          <button onClick={()=>window.print()}>
            Print / Download PDF
          </button>

        </div>
      )}

    </div>
  );
}
