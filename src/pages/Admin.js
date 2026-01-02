import { useState } from "react";

export default function Admin() {

  const [formNo, setFormNo] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const scriptURL =
    "https://script.google.com/macros/s/AKfycbwNpFdyasM93VN5kMUbCZ1L9Y_qpB76GqfZyJQf-GOyNUI8evVRvBhRUrNEPRYYcW46/exec";

  const fetchData = async () => {

    if (password !== "admin123") {
      setMsg("❌ गलत Admin Password");
      return;
    }

    if (!formNo) {
      setMsg("❗ Form Number दर्ज करें");
      return;
    }

    setLoading(true);
    setMsg("");
    setData(null);

    try {
     const res = await fetch(`${scriptURL}?action=getAdmit&formNo=${formNo}`);

      const result = await res.json();

      if (result.success) {
        setData(result);
      } else {
        setMsg("❌ Form नहीं मिला");
      }

    } catch (err) {
      setMsg("❌ Server Error");
    }

    setLoading(false);
  };

  const verifyPayment = async () => {
    setVerifying(true);

    try {
      const res = await fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify({
          action: "verify",
          formNo: formNo
        })
      });

      const result = await res.json();

      if (result.success) {
        alert("✔ Payment Verified");
        window.location.reload();
      } else {
        alert("❌ Form नहीं मिला");
      }
    } catch (err) {
      alert("❌ Server Error");
    }

    setVerifying(false);
  };

  return (
    <div className="registration-box">

      <h1>🔐 Admin Panel</h1>
      <h2>Payment Verification</h2>

      <input
        placeholder="Admin Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        placeholder="Form Number"
        onChange={(e) => setFormNo(e.target.value)}
      />

      <button onClick={fetchData} disabled={loading}>
        {loading ? "⏳ Searching..." : "Search"}
      </button>

      {msg && <p style={{ color: "red", fontWeight: "bold" }}>{msg}</p>}

      {data && (
        <div className="receipt">

          <h3>Participant Details</h3>

          <p><b>Name:</b> {data.name}</p>
          <p><b>Competition:</b> {data.competition}</p>

          <p>
            <b>Status:</b>{" "}
            <span
              style={{
                color:
                  data.status.toLowerCase() === "Paid"
                    ? "green"
                    : "red",
                fontWeight: "bold"
              }}
            >
              {data.status}
            </span>
          </p>
          <p><b>TXN ID:</b> {data.txnId}</p>


          {data.status.toLowerCase() !== "Paid" ? (
            <button
              onClick={verifyPayment}
              style={{ background: "green" }}
              disabled={verifying}
            >
              {verifying ? "⏳ Verifying..." : "Verify Payment ✔"}
            </button>
          ) : (
            <h3 style={{ color: "green" }}>✔ Already Paid</h3>
          )}
        </div>
      )}
    </div>
  );
}
