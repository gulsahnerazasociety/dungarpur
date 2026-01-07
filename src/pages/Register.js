import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwS370s2D55qZLrJDLHoDCCrIEeT39NwMKbnRnLDOD1n7ZEMFBA9futVbg35vdf52fD/exec";

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
  const [regAllowed, setRegAllowed] = useState(false);
  const [regMsg, setRegMsg] = useState("Checking registration status...");

  // 🔹 CHECK REGISTRATION DATE FROM GOOGLE SHEET
useEffect(() => {
  const checkRegistrationDate = async () => {
    try {
      const res = await fetch(
        `${SCRIPT_URL}?action=registrationDates`
      );

      const data = await res.json();

      if (!data.success) {
        setRegMsg("Registration information unavailable ❌");
        return;
      }

      const today = new Date();
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      if (isNaN(start) || isNaN(end)) {
        setRegMsg("Registration dates invalid ❌");
        return;
      }

      if (today >= start && today <= end) {
        setRegAllowed(true);
        setRegMsg("");
      } else {
        setRegAllowed(false);
        setRegMsg(
          `पंजीकरण बंद है ❌  
पंजीकरण की तिथि: 
${start.toLocaleDateString("hi-IN")} से ${end.toLocaleDateString("hi-IN")}`
        );
      }
    } catch (err) {
      setRegAllowed(false);
      setRegMsg("Server error ❌ कृपया बाद में प्रयास करें");
    }
  };

  checkRegistrationDate();
}, []);



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
      setAgeError("❌ Not Participating in this Competition");
      setFormData(prev => ({
        ...prev,
        age,
        ageGroup: "",
        fees: ""
      }));
      return;
    }

    setAgeError("");
    setFormData(prev => ({
      ...prev,
      age,
      ageGroup: group,
      fees
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!regAllowed) {
      alert("पंजीकरण की अवधि समाप्त हो चुकी है ❌");
      return;
    }

    if (ageError) {
      alert("यह आयु इस प्रतियोगिता के लिए मान्य नहीं है ❌");
      return;
    }

    const aadhaar = formData.aadhaar.trim();
    if (aadhaar.length !== 12 || !/^[0-9]+$/.test(aadhaar)) {
      alert("आधार नंबर 12 अंकों का होना चाहिए ❗");
      return;
    }

    try {
      const response = await fetch(SCRIPT_URL, {
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

      {!regAllowed && (
        <p style={{ color: "red", fontWeight: "bold" }}>{regMsg}</p>
      )}

      <form onSubmit={handleSubmit}>
        <fieldset disabled={!regAllowed} style={{ border: "none", padding: 0 }}>
          
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
            <p style={{ color: "red", fontWeight: "bold" }}>{ageError}</p>
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
        </fieldset>
      </form>
    </div>
  );
}
