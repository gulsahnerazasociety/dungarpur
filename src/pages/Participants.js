import { useEffect, useState } from "react";

export default function Participants() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const sheetURL =
    "https://script.google.com/macros/s/AKfycbwXcIMjOOhmX2VtIKFQFNZQiXU_ZiwQ10qhd315BPDzo4j8wP3O2uyqfzM4cxNTbxye/exec?action=getAll";

  // ================= FETCH DATA =================
  useEffect(() => {
    fetch(sheetURL)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setData(result.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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

  // ================= FILTER =================
  const filtered = data.filter((item) => {
    return (
      (item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.formNo?.toLowerCase().includes(search.toLowerCase()) ||
        String(item.phone || "").includes(search) ||
        String(item.aadhaar || "").includes(search)) &&
      (filterGroup === "" || item.ageGroup === filterGroup) &&
      (filterStatus === "" || item.status === filterStatus)
    );
  });

  // ================= EXCEL EXPORT =================
  const exportExcel = () => {
    const table = document.getElementById("participantsTable").outerHTML;
    const blob = new Blob([table], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "participants.xls";
    a.click();
  };

  // ================= PDF EXPORT =================
  const exportPDF = () => window.print();

  return (
    <div className="participant-box">

      <h1>Registered Participants</h1>
      <p>गुलशन-ए-रज़ा सोसाइटी – Quiz / Islamic Competition</p>

      <p style={{ color: "red" }}>
        नोट :- यदि किसी का पेमेन्‍ट स्‍टेटस गलत है तो रसीद WhatsApp करें:
        <b> 94147 23722</b>
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
                  <th>Aadhaar</th>
                  <th>Phone</th>
                  <th>Age</th>
                  <th>Group</th>
                  <th>Competition</th>
                  <th>Fees</th>
                  <th>Status</th>
                  <th>Photo</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((row, i) => (
                  <tr key={i}>
                    <td>{row.formNo}</td>
                    <td>{row.name}</td>
                    <td>{row.father}</td>
                    <td>{maskAadhaar(row.aadhaar)}</td>
                    <td>{maskPhone(row.phone)}</td>
                    <td>{row.age}</td>
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

                    {/* ✅ PHOTO STATUS */}
                    <td
                      style={{
                        fontWeight: "bold",
                        color: row.photo ? "green" : "red",
                        textAlign: "center"
                      }}
                    >
                      {row.photo ? (
                        <a
                          href={row.photo}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "green" }}
                        >
                          Photo Uploaded ✅
                        </a>
                      ) : (
                        "Not Uploaded ❌"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
