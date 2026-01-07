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
  const [uploading, setUploading] = useState(false); // 🔒 NEW

  // 🔐 STEP-1: Verify + Token Generate
  const generateToken = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "uploadDocs",
          formNo,
          aadhaar,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Verification failed");
        return;
      }

      setToken(data.token);
      alert("Verified ✅ अब documents upload करें");

    } catch (err) {
      alert("Server error, try again");
    } finally {
      setLoading(false);
    }
  };

  // 📤 STEP-2: Upload Documents (SAFE)
  const uploadFiles = async () => {
    // 🔒 Prevent multiple clicks
    if (uploading) return;

    if (!photo || !document) {
      alert("Photo और Document दोनों जरूरी हैं");
      return;
    }

    setUploading(true);
    setLoading(true);

    try {
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
      alert(data.message || "Upload completed");

      // ✅ Upload success ke baad form lock/reset
      setPhoto(null);
      setDocument(null);
      setToken("");

    } catch (err) {
      alert("Upload failed, try again");
    } finally {
      setLoading(false);
      setUploading(false);
    }
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
          disabled={loading || uploading}
        />

        <input
          type="text"
          placeholder="Aadhaar (Full 12 digits)"
          maxLength="12"
          value={aadhaar}
          onChange={(e) => setAadhaar(e.target.value)}
          disabled={loading || uploading}
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
              disabled={uploading}
              onChange={(e) => setPhoto(e.target.files[0])}
            />

            <input
              type="file"
              accept=".pdf,.jpg,.png"
              disabled={uploading}
              onChange={(e) => setDocument(e.target.files[0])}
            />

            <button
              className="upload-btn"
              onClick={uploadFiles}
              disabled={loading || uploading}
            >
              {uploading ? "Uploading..." : "Upload Documents"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
