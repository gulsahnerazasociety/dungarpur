import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function Payment() {

  const location = useLocation();
  const stateData = location.state || {};

  const [formNo, setFormNo] = useState(stateData.formNo || "");
  const [name, setName] = useState(stateData.name || "");
  const [fees, setFees] = useState(stateData.fees || "");
  const [txn, setTxn] = useState("");
  const [loaded, setLoaded] = useState(!!stateData.formNo);
  const [saving, setSaving] = useState(false);
  const [txnSaved, setTxnSaved] = useState(false);

  const fetchDetails = async () => {
    if(!formNo){
      alert("Form Number दर्ज करें");
      return;
    }

    const url =
      `https://script.google.com/macros/s/AKfycbwNpFdyasM93VN5kMUbCZ1L9Y_qpB76GqfZyJQf-GOyNUI8evVRvBhRUrNEPRYYcW46/exec?action=getAdmit&formNo=${formNo}`;

    try{
      const res = await fetch(url);
      const data = await res.json();

      if(data.success){
        setName(data.name);
        setFees(data.fees);
        setLoaded(true);
      }else{
        alert("Form Not Found ❌");
      }

    }catch(err){
      alert("Server Error ❌");
    }
  };


  const submitTxn = async () => {
    if(!txn){
      alert("Transaction ID दर्ज करें");
      return;
    }

    setSaving(true);

    try{
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbwNpFdyasM93VN5kMUbCZ1L9Y_qpB76GqfZyJQf-GOyNUI8evVRvBhRUrNEPRYYcW46/exec",
        {
          method: "POST",
          body: JSON.stringify({
            action: "saveTxn",
            formNo,
            txnId: txn
          })
        }
      );

      const data = await res.json();

      if(data.success){
        alert("Transaction ID Saved ✅");
        setTxn("");
        setTxnSaved(true);
      } else {
        alert("Error ❌");
      }

    }catch(err){
      alert("Server Error ❌");
    }

    setSaving(false);
  };

  return (
    <div className="registration-box">

      <h1>गुलशन-ए-रज़ा सोसाइटी</h1>
      <h2>पंजीकरण शुल्क भुगतान</h2>


      {/* ================= Direct Aaye User ================= */}
      {!loaded && (
        <>
          <h3>अगर आपने Registration पहले किया है तो Form No डालें</h3>

          <input 
            placeholder="Enter Form No"
            value={formNo}
            onChange={(e)=>setFormNo(e.target.value)}
          />

          <button onClick={fetchDetails}>
            Get Details
          </button>
        </>
      )}


      {/* ================= Data Loaded ================= */}
      {loaded && (
        <>
          <p><b>फॉर्म नंबर:</b> {formNo}</p>
          <p><b>नाम:</b> {name}</p>
          <p><b>शुल्क:</b> ₹{fees}</p>

          <h3>📌 QR से भुगतान करें</h3>

          <img 
            src={process.env.PUBLIC_URL + "/qr.webp"}
            alt="UPI QR"
            style={{width:"250px", margin:"20px auto", display:"block"}} 
          />

          <p>QR Payment करते समय "Note" में Form No लिखें</p>

          {!txnSaved ? (
            <>
              <h3>अगर Payment Done है तो Transaction ID दर्ज करें</h3>

              <input 
                placeholder="UPI Transaction ID"
                value={txn}
                onChange={(e)=>setTxn(e.target.value)}
              />

              <button onClick={submitTxn} disabled={saving}>
                {saving ? "Saving..." : "Submit Transaction ID"}
              </button>
            </>
          ) : (
            <h3 style={{color:"green"}}>Transaction ID Saved Successfully ✅</h3>
          )}

          <p>✔️ Payment के बाद Status “Pending” रहेगा</p>
          <p>✔️ Team Bank Statement से Verify करेगी</p>
        </>
      )}

    </div>
  );
}
