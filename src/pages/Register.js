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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    if (name === "dob") {
      calculateAgeAndGroup(value);
    }
  };

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

    // ✅ AGE VALIDATION
    if (age >= 8 && age <= 12) {
      group = "Group A";
      fees = 350;
    } else if (age >= 13 && age <= 17) {
      group = "Group B";
      fees = 350;
    } else if (age >= 18 && age <= 22) {
      group = "Group C";
      fees = 350;
    } else if (age >= 23 && age <= 45) {
      group = "Group D";
      fees = 500;
    } else {
      // ❌ INVALID AGE
      setAgeError("❌ Not Participating in this Competition");
      setFormData(prev => ({
        ...prev,
        age: age,
        ageGroup: "",
        fees: ""
      }));
      return;
    }

    // ✅ VALID AGE
    setAgeError("");
    setFormData(prev => ({
      ...prev,
      age: age,
      ageGroup: group,
      fees: fees
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❌ AGE ERROR BLOCK
    if (ageError) {
      alert("यह आयु इस प्रतियोगिता के लिए मान्य नहीं है ❌");
      return;
    }

    try {
      // Aadhaar Validation
      const aadhaar = formData.aadhaar.trim();

      if (aadhaar.length !== 12 || !/^[0-9]+$/.test(aadhaar)) {
        alert("आधार नंबर 12 अंकों का होना चाहिए ❗");
        return;
      }

      const scriptURL =
        "https://script.google.com/macros/s/AKfycbzVOFcgoFN6aRIG9iv_7VObJVtrZrj2wuMmrC2azUWvd21cNuy91J2pSPuZbjU2hHe5/exec";

      const response = await fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(formData)
      });

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
    }
  };

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
          required
          maxLength="12"
          pattern="[0-9]{12}"
          onChange={handleChange}
        />

        <label>जन्म तिथि (DOB)</label>
        <input type="date" name="dob" required onChange={handleChange} />

        <label>आयु</label>
        <input value={formData.age} readOnly />

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

        <button type="submit" className="register-btn">
          पंजीकरण जमा करें
        </button>
      </form>
    </div>
  );
}

