import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function VerifyAdmit() {

  const [params] = useSearchParams();
  const formNo = params.get("formNo");

  const [data, setData] = useState(null);
  const [message, setMessage] = useState("Verifying...");
  const [error, setError] = useState(false);

  const scriptURL =
    "https://script.google.com/macros/s/AKfycbwjW7R817t6Cc3atPoK_5DGaXJoYX9vLUV5SLP5F928GLJhsuDmMIk8Aph6Xz1Ro89c/exec";

  useEffect(() => {

    if (!formNo) {
      setMessage("Invalid QR Code");
      setError(true);
      return;
    }

    fetch(`${scriptURL}?action=verify&formNo=${formNo}`)
      .then(res => res.json())
      .then(result => {

        if (!result.valid) {
          setMessage(result.message || "Fake Admit Card");
          setError(true);
          return;
        }

        setData(result);
        setMessage("");
      })
      .catch(() => {
        setMessage("Server Error");
        setError(true);
      });

  }, [formNo]);

  return (
    <div className="verify-box">

      <h1>Admit Card Verification</h1>

      {message && <p className={error ? "fake" : ""}>{message}</p>}

      {data && (
        <div className="verify-card">
          <h2 className="real">✅ VALID ADMIT CARD</h2>
        <img
        src={data.photo}
        alt={`${data.name} photograph`}
        className="verify-photo"
        />
          <p><b>Form No:</b> {data.formNo}</p>
          <p><b>Name:</b> {data.name}</p>
          <p><b>Father:</b> {data.father}</p>
          <p><b>Roll No:</b> {data.rollno}</p>
          <p><b>Competition:</b> {data.competition}</p>
          <p><b>Exam Center:</b> {data.examcent}</p>
        </div>
      )}

    </div>
  );
}