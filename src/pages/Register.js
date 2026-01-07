import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    father: "",
    aadhaar: "",
    dob: "",
    age: "",
    ageGroup: "",
    phone: "",
    address: "",
    competition: "",
    paymentStatus: "Pending",
    fees: ""
  });

  const [ageError, setAgeError] = useState("");
  const [loading, setLoading] = useState(false); // 🔒 submit lock

  // ---------------------------
  // Handle Input Change
  // ---------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === "dob") {
      calculateAgeAndGroup(value);
    }
  };

  // ---------------------------
  // Age Calculation
  // ---------------------------
  const calculateAgeAndGroup = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    let group = "";
    let fees = "";

    if (age >= 8 && age <= 12) {
      group = "Group A";
      fees = 350;
    } else if (age >= 13 && age <= 17) {
      group = "Group B";
      fees = 350;
    } else if (age >= 18 && age <= 22) {
      group = "Group C";
      fees = 350;
    } else if (age >= 23 && age <= 70) {
      group = "Group D";
      fees = 500;
    } else {
      setAgeError("❌ Not Participating in this Competition");
      setFormData((prev) => ({
        ...prev,
        age: age,
        ageGroup: "",
        fees: ""
      }));
      return;
    }

    setAgeError("");
    setFormData((prev) => ({
      ...prev,
      age: age,
      ageGroup: group,
      fees: fees
    }));
  };

  // ---------------------------
  // Submit Form
  // ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // 🚫 double click block

    if (ageError) {
      alert("यह आयु इस प्रतियोगिता के लिए मान्य नहीं है ❌");
      return;
    }

    const aadhaar = formData.aadhaar.trim();
    if (aadhaar.length !== 12 || !/^[0-9]{12}$/.test(aadhaar)) {
      alert("आधार नंबर 12 अंकों का होना चाहिए ❗");
      return;
    }

    try {
      setLoading(true); // 🔒 button disable

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbybdpcSfdkxIjPVtRlNAyMPoPg4DQ_XTCTdZ-VvzNdURKCWMyrdGvCFHOwegZAz2_zu/exec",
        {
          method: "POST",
          body: JSON.stringify(formData)
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("पंजीकरण सफल 🎉 आपका फॉर्म नंबर है: " + result.formNo);

        navigate("/payment", {
          state: {
            formNo: result.formNo,
            name: formData.name,
            fees: formData.fees
          }
        });
      } else {
        alert(result.message || "Server Error ❗");
      }
    } catch (err) {
      alert("Network Error ❗");
    } finally {
      setLoading(false); // 🔓 unlock after response
    }
  };

  // ---------------------------
  // JSX
  // ---------------------------
  return (
    <div className="registration-box">
      <h1>गुलशन-ए-रज़ा सोसाइटी</h1>
      <h2>प्रतियोगिता पंजीकरण फॉर्म</h2>

      <form onSubmit={handleSubmit}>
        <label>विद्यार्थी का नाम</label>
        <input name="name" required onChange={handleChange} />

        <label>पिता / अभिभावक का नाम</label>
        <input name="father" required onChange={handleChange} />

        <label>आधार कार्ड नंबर</label>
        <input
          name="aadhaar"
          maxLength="12"
          pattern="[0-9]{12}"
          required
          onChange={handleChange}
        />

        <label>जन्म तिथि (DOB)</label>
        <input type="date" name="dob" required onChange={handleChange} />

        <label>आयु</label>
        <input
          value={formData.age ? `${formData.age} Years` : ""}
          readOnly
        />

        <label>आयु समूह</label>
        <input value={formData.ageGroup} readOnly />

        {ageError && (
          <p style={{ color: "red", fontWeight: "bold" }}>
            {ageError}
          </p>
        )}

        <label>मोबाइल नंबर</label>
        <input name="phone" required onChange={handleChange} />

        <label>पता</label>
        <textarea name="address" rows="3" required onChange={handleChange} />

        <label>प्रतियोगिता</label>
        <select name="competition" required onChange={handleChange}>
          <option value="">चुनें</option>
          <option>कुरान, हदीस व दीनी मालुमात प्रश्नोत्तरी</option>
        </select>

        <label>पंजीकरण शुल्क</label>
        <input value={formData.fees} readOnly />

        <button
          type="submit"
          className="register-btn"
          disabled={loading}
          style={{
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Submitting..." : "पंजीकरण जमा करें"}
        </button>
      </form>
    </div>
  );
}
