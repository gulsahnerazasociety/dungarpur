import { useState } from "react";

export default function Admin() {

  const [formNo, setFormNo] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState("");

  const scriptURL = "https://script.google.com/macros/s/AKfycbwG49ITACXn2-nCo1OAXuY1jjqiY-6BwJeV7kB9M1ArDMvXlcnBE3zFGF3JdezTt-Ko/exec";

  const fetchData = async () => {

    if(password !== "admin123"){
      alert("गलत Admin Password ❌");
      return;
    }

    const res = await fetch(`${scriptURL}?formNo=${formNo}`);
    const result = await res.json();

    if(result.success){
      setData(result);
      setMsg("");
    } else {
      setMsg("Form नहीं मिला ❗");
      setData(null);
    }
  };

  const verifyPayment = async () => {
    
    const res = await fetch(scriptURL,{
      method:"POST",
      body: JSON.stringify({
        action:"verify",
        formNo: formNo
      })
    });

    const result = await res.json();

    if(result.success){
      alert("Payment Verified ✔️");
      window.location.reload();
    } else {
      alert("Form नहीं मिला ❌");
    }
  };

  return (
    <div className="registration-box">

      <h1>Admin Panel</h1>
      <h2>Payment Verify System</h2>

      <input placeholder="Admin Password"
        type="password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <input 
        placeholder="Form Number डालें"
        onChange={(e)=>setFormNo(e.target.value)}
      />

      <button onClick={fetchData}>Search</button>

      {msg && <p style={{color:"red"}}>{msg}</p>}

      {data && (
        <div className="receipt">

          <h3>Participant Details</h3>

          <p><b>Name:</b> {data.name}</p>
          <p><b>Competition:</b> {data.competition}</p>
          <p><b>Status:</b> {data.status}</p>

         {data.status && data.status.toString().trim().toLowerCase() !== "paid" ? (
            <button onClick={verifyPayment} style={{background:"green"}}>
                Verify Payment ✔️
            </button>
            ) : (
            <h3 style={{color:"green"}}>Already Paid ✔️</h3>
         )}


        </div>
      )}

    </div>
  );
}
