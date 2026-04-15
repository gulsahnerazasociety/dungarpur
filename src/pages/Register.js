import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();

  // ⛔ Registration deadline
  const REGISTRATION_END_DATE = new Date("2026-05-31T23:59:59");
  const isRegistrationClosed = new Date() > REGISTRATION_END_DATE;

  const [formData, setFormData] = useState({
    name: "",
    father: "",
    gender: "",        // ✅ ADDED
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
  const [loading, setLoading] = useState(false);

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

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const prevMonthDays = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      ).getDate();
      days += prevMonthDays;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const runningAge = years + 1;

    let group = "";
    let fees = "";

    if (runningAge >= 8 && runningAge <= 12) {
      group = "Group A (8–12 वर्ष)";
      fees = 350;
    } else if (runningAge >= 13 && runningAge <= 17) {
      group = "Group B (13–17 वर्ष)";
      fees = 350;
    } else if (runningAge >= 18 && runningAge <= 22) {
      group = "Group C (18–22 वर्ष)";
      fees = 350;
    } else if (runningAge >= 23) {
      group = "Group D (23 वर्ष से ज्‍यादा)";
      fees = 500;
    } else {
      setAgeError("❌ Not Participating in this Competition");
      setFormData((prev) => ({
        ...prev,
        age: "",
        ageGroup: "",
        fees: ""
      }));
      return;
    }

    setAgeError("");
    setFormData((prev) => ({
      ...prev,
      age: `${years} वर्ष ${months} महीने ${days} दिन`,
      ageGroup: group,
      fees: fees
    }));
  };

  // ---------------------------
  // Submit Form
  // ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
      // ✅ Gender validation
      if (!formData.gender) {
        alert("कृपया अपना लिंग (Gender) चुनें ❗");
        return;
      }

      if (!["Male", "Female"].includes(formData.gender)) {
        alert("अमान्य Gender चयन ❌");
        return;
      }

    // ⛔ Deadline block
    if (isRegistrationClosed) {
      alert("❌ पंजीकरण की समय सीमा समाप्त हो गई है");
      return;
    }

    if (loading) return;

    if (ageError) {
      alert("यह आयु इस प्रतियोगिता के लिए मान्य नहीं है ❌");
      return;
    }

    const aadhaar = formData.aadhaar.trim();
    if (!/^[0-9]{12}$/.test(aadhaar)) {
      alert("आधार नंबर 12 अंकों का होना चाहिए ❗");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzk2istRmboIKkOACb10EbYTcSc5CTYnDZnBwUG1qNPMQ58Qm0i1auMc25Pq--xl4XL/exec",
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
      setLoading(false);
    }
  };

  // ---------------------------
  // JSX
  // ---------------------------
  return (
    <div className="registration-box">
      <h1>गुलशन-ए-रज़ा सोसाइटी</h1>
      <h2>प्रतियोगिता पंजीकरण फॉर्म</h2>

      {isRegistrationClosed && (
        <div
          style={{
            background: "#ffe6e6",
            color: "#b30000",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            fontWeight: "bold",
            textAlign: "center"
          }}
        >
          ⛔ पंजीकरण की समय सीमा 31 मार्च 2025 को समाप्त हो चुकी है
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>विद्यार्थी का नाम</label>
        <input name="name" required onChange={handleChange} />

        <label>पिता / सरपरस्‍त का नाम</label>
        <input name="father" required onChange={handleChange} />

        <label>लिंग (Gender)</label>
          <select name="gender" required onChange={handleChange}>
            <option value="">चुनें</option>
            <option value="Male">पुरुष (Male)</option>
            <option value="Female">महिला (Female)</option>
          </select>


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

        <button
          type="submit"
          className="register-btn"
          disabled={loading || isRegistrationClosed}
          style={{
            opacity: loading || isRegistrationClosed ? 0.6 : 1,
            cursor:
              loading || isRegistrationClosed ? "not-allowed" : "pointer"
          }}
        >
          {isRegistrationClosed
            ? "पंजीकरण बंद है"
            : loading
            ? "Submitting..."
            : "पंजीकरण जमा करें"}
        </button>
      </form>
    </div>
  );
}
