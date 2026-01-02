import { useLocation } from "react-router-dom";

export default function Payment() {

  const location = useLocation();
  const { formNo, name, fees } = location.state || {};

  return (
    <div className="registration-box">

      <h1>गुलशन-ए-रज़ा सोसाइटी</h1>
      <h2>पंजीकरण शुल्क भुगतान</h2>

      {!formNo ? (
        <h3 style={{color:"red"}}>❌ सीधा Payment Page पर मत आइए। पहले Registration करें।</h3>
      ) : (

      <>
        <p><b>फॉर्म नंबर:</b> {formNo}</p>
        <p><b>नाम:</b> {name}</p>
        <p><b>शुल्क:</b> ₹{fees}</p>

        <h3>📌 कृपया नीचे दिए गए QR Code से भुगतान करें</h3>

        <img 
          src={process.env.PUBLIC_URL + "/qr.webp"} 
          alt="UPI QR" 
          style={{width:"250px", margin:"20px auto", display:"block"}} 
        />


        <p>✔️ Payment करने के बाद Status “Pending” रहेगा</p>
        <p>✔️ Event Team Bank Statement से Verify करेगी</p>

        <h3 style={{color:"green"}}>पेमेंट करने के बाद आप सफलतापूर्वक Registered हैं 🎉</h3>
      </>
      )}
    </div>
  );
}
