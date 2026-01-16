import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

export default function Participants() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const sheetURL =
    "https://script.google.com/macros/s/AKfycbwXcIMjOOhmX2VtIKFQFNZQiXU_ZiwQ10qhd315BPDzo4j8wP3O2uyqfzM4cxNTbxye/exec?action=getAll";

  // ================= FETCH DATA WITH CACHE =================
  useEffect(() => {
    const CACHE_KEY = "participantsData";
    const CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 घंटा

    // Cached data को check करो
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { data: cachedRows, timestamp } = JSON.parse(cachedData);
      const now = new Date().getTime();

      // अगर cache 1 घंटे से पुराना नहीं है तो use करो
      if (now - timestamp < CACHE_DURATION) {
        setData(cachedRows);
        setLoading(false);
        return;
      }
    }

    // Cache expired या नहीं है - Google Sheet से fetch करो
    fetch(sheetURL)
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          const dataToStore = {
            data: result.data,
            timestamp: new Date().getTime()
          };
          localStorage.setItem(CACHE_KEY, JSON.stringify(dataToStore));
          setData(result.data);
        }
        setLoading(false);
      })
      .catch(() => {
        // अगर API fail हो तो पुराना cache use करो
        if (cachedData) {
          const { data: cachedRows } = JSON.parse(cachedData);
          setData(cachedRows);
        }
        setLoading(false);
      });
  }, []);

  // ================= MASK HELPERS =================
  const maskPhone = (phone) => {
    if (!phone) return "";
    const str = phone.toString();
    return "XXXXXX" + str.slice(-4);
  };

  const maskAadhaar = (aadhaar) => {
    if (!aadhaar) return "";
    const str = aadhaar.toString();
    return "XXXXXXXX" + str.slice(-4);
  };

  // ================= FILTER (useMemo) =================
  const filtered = useMemo(() => {
    return data.filter((item) => {

      const textMatch =
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.formNo?.toLowerCase().includes(search.toLowerCase()) ||
        String(item.phone || "").includes(search) ||
        String(item.aadhaar || "").includes(search);

      const groupMatch =
        filterGroup === "" || item.ageGroup === filterGroup;

      const statusMatch =
        filterStatus === "" || item.status === filterStatus;

      return textMatch && groupMatch && statusMatch;
    });
  }, [data, search, filterGroup, filterStatus]);

  // ================= EXPORT =================
  const exportExcel = () => {
    const table = document.getElementById("participantsTable").outerHTML;
    const blob = new Blob([table], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "participants.xls";
    a.click();
  };

  const exportPDF = () => window.print();

  return (
    <div className="participant-box">

      <h1>Registered Participants</h1>
      <p>गुलशन-ए-रज़ा सोसाइटी – Quiz / Islamic Competition</p>

      <p style={{ color: "red" }}>
        नोट :- यदि किसी का पेमेन्‍ट स्‍टेटस गलत है तो रसीद WhatsApp करें:
        <b> 94147 23722</b>
      </p>

      <p style={{ 
        color: "white", 
        background: "#2196F3", 
        padding: "12px", 
        borderRadius: "5px",
        marginBottom: "15px"
      }}>
        ℹ️ <b>महत्वपूर्ण:</b> यदि आपने अभी रजिस्ट्रेशन किया है, तो आपका डेटा इस सूची में <b>1 घंटे बाद</b> दिखाई देगा। कृपया कुछ समय प्रतीक्षा करें।
      </p>
      <p style={{ 
        color: "white", 
        background: "#4ca51d", 
        padding: "12px", 
        borderRadius: "5px",
        marginBottom: "15px"
      }}>
        ℹ️ <b>नोट:</b> यदि आपने अपना फोटो एवं डोक्‍युमेट अपलोड नही किया है तो "Not Uploaded ❌" बटन पर क्लिक करके, कर सकते है।
        फोटो एवं डोक्‍युमेंट अपलोड करने के आप अपना फोर्म नम्‍बर एवं आधार नंबर का उपयाेग करेंगे, जिसके आधार नंबर इस लिस्‍ट में अपडेट नही है वे सब व्‍हॉटस नंबर पर संपंर्क कर अपना आधार नंबर या कोई और डिटेल बदलवा सकते हैा
      </p>

      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <>
          {/* SEARCH */}
          <input
            className="search"
            placeholder="Search by Name / Form No / Phone / Aadhaar"
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* FILTERS */}
          <select className="search" onChange={(e) => setFilterGroup(e.target.value)}>
            <option value="">All Groups</option>
            <option value="Group A">Group A</option>
            <option value="Group B">Group B</option>
            <option value="Group C">Group C</option>
            <option value="Group D">Group D</option>
          </select>

          <select className="search" onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>

          {/* EXPORT */}
          <div style={{ marginTop: 10 }}>
            <button onClick={exportExcel}>⬇️ Export Excel</button>
            <button onClick={exportPDF} style={{ marginLeft: 10 }}>
              ⬇️ Export PDF
            </button>
          </div>

          {/* TABLE */}
          <div className="table-area">
            <table id="participantsTable">
              <thead>
                <tr>
                  <th>Form No</th>
                  <th>Name</th>
                  <th>Father</th>
                  <th>Age</th>
                  <th>Address</th>
                  <th>Aadhaar</th>
                  <th>Phone</th>
                  <th>Group</th>
                  <th>Competition</th>
                  <th>Fees</th>
                  <th>Status</th>
                  <th>Photo</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((row, i) => {

                  // ✅ PHOTO LOGIC (FINAL)
                  const photoUploaded =
                    (row.photo && row.photo.toString().trim() !== "") ||
                    row.DocsUploaded === "YES";

                  return (
                    <tr key={i}>
                      <td>{row.formNo}</td>
                      <td>{row.name}</td>
                      <td>{row.father}</td>
                      <td>{row.age}</td>
                      <td>{row.address}</td>
                      <td>{maskAadhaar(row.aadhaar)}</td>
                      <td>{maskPhone(row.phone)}</td>
                      <td>{row.ageGroup}</td>
                      <td>{row.competition}</td>
                      <td>₹{row.fees}</td>

                      <td
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          background: row.status === "Paid" ? "green" : "red",
                          borderRadius: 5,
                          textAlign: "center"
                        }}
                      >
                        {row.status}
                      </td>

                      <td style={{ fontWeight: "bold", textAlign: "center" }}>
                        {photoUploaded ? (
                          <span style={{ color: "green" }}>
                            Photo Uploaded ✅
                          </span>
                        ) : (
                          <Link to="/upload-documents" style={{ color: "red" }}>
                            Not Uploaded ❌
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
