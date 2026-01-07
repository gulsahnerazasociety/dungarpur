import { useState } from "react";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzWTi-PndBr0tPnlSGa3EGwn6GCZGnxj8x6Sp6EwXkX427xQjkC1LESM5R2ak6QsTbE/exec";

// 🔁 File → Base64
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function UploadDocuments() {
  const [formNo, setFormNo] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [photo, setPhoto] = useState(null);
  const [document, setDocument] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 STEP-1: Verify + Token Generate
  const generateToken = async () => {
    setLoading(true);

    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "uploadDocs",
        formNo,
        aadhaar,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      alert(data.message || "Verification failed");
      return;
    }

    setToken(data.token);
    alert("Verified ✅ अब documents upload करें");
  };

  // 📤 STEP-2: Upload Documents
  const uploadFiles = async () => {
    if (!photo || !document) {
      alert("Photo और Document दोनों जरूरी हैं");
      return;
    }

    setLoading(true);

    const photo64 = await toBase64(photo);
    const doc64 = await toBase64(document);

    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "uploadFiles",
        formNo,
        token,
        photo: photo64,
        photoType: photo.type,
        document: doc64,
        docType: document.type,
      }),
    });

    const data = await res.json();
    setLoading(false);

    alert(data.message || "Upload completed");
  };

return (
  <div className="upload-page">
    <div className="upload-card">
      <h3>Document Upload</h3>

      <input
        type="text"
        placeholder="Form No"
        value={formNo}
        onChange={(e) => setFormNo(e.target.value)}
      />

      <input
        type="text"
        placeholder="Aadhaar (Full 12 digits)"
        maxLength="12"
        value={aadhaar}
        onChange={(e) => setAadhaar(e.target.value)}
      />

      {!token && (
        <button
          className="verify-btn"
          onClick={generateToken}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      )}

      {token && (
        <>
          <hr />

          <div className="file-hint">
            📷 Photo (JPG / PNG) <br />
            📄 Document (PDF / Image)
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
          />

          <input
            type="file"
            accept=".pdf,.jpg,.png"
            onChange={(e) => setDocument(e.target.files[0])}
          />

          <button
            className="upload-btn"
            onClick={uploadFiles}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Documents"}
          </button>
        </>
      )}
    </div>
  </div>
);

}
