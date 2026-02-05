import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./dashboard.css";
import KABRISTAN_MAP from "../data/kabristanMap.json";

const MONTH_NAMES = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];
const formatAmount = (num) => {
  return Number(num || 0).toFixed(2);
};

// 🎥 YouTube URL → Embed
const getEmbedUrl = (url) => {
  if (!url) return "";
  if (url.includes("shorts/")) {
    return `https://www.youtube.com/embed/${url.split("shorts/")[1]}`;
  }
  if (url.includes("watch?v=")) {
    return `https://www.youtube.com/embed/${url.split("watch?v=")[1]}`;
  }
  return "";
};

export default function KabristanDashboard() {
  const { kabristanId } = useParams();
  const KABRISTAN_ID = kabristanId;

  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");

  const [view, setView] = useState("summary");
  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbwXg1FPObXU7boW9KdQycmPMje2TEpjRai5UqR2thlzUMquT5BRrPwKAw394Tbqsnks/exec")
      .then(res => res.json())
      .then(data => {
        const cleaned = data
          .filter(r => r.Kabristan_ID === KABRISTAN_ID)
          .map(r => {
            const d = new Date(r.Date);
            return {
              ...r,
              Year: d.getFullYear().toString(),
              Month: String(d.getMonth() + 1).padStart(2, "0"),
              DisplayDate: `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`,
              Amount: Number(r.Amount),
              EmbedUrl: getEmbedUrl(r.YouTube)
            };
          });
        setRows(cleaned);
      });
  }, [KABRISTAN_ID]);

  /* ================= HELPERS ================= */
  const sum = list => list.reduce((s,r)=>s+r.Amount,0);

  const searchFilter = (r) => {
    if (!search) return true;
    const t = search.toLowerCase();
    return (
      r.Category?.toLowerCase().includes(t) ||
      r.Sub_Sub_Category?.toLowerCase().includes(t) ||
      r["Person/Work"]?.toLowerCase().includes(t) ||
      r.DisplayDate?.includes(t) ||
      String(r.Amount).includes(t)
    );
  };

  const dataByType = rows.filter(r => r.Type === type).filter(searchFilter);

  /* ================= TOTALS ================= */
  const totalIncome = sum(rows.filter(r => r.Type === "IN"));
  const totalExpense = sum(rows.filter(r => r.Type === "OUT"));
  const balance = totalIncome - totalExpense;

  /* ================= UI ================= */
  return (
    <div className="dashboard">

      <div className="header">
        <h2>🌙 {KABRISTAN_MAP[KABRISTAN_ID]?.title}</h2>
        <small>{KABRISTAN_MAP[KABRISTAN_ID]?.baba}</small><br/>
        <small>Fund Management Dashboard</small>
      </div>

      {/* 🔍 SEARCH */}
      {view !== "summary" && (
        <input
          className="search-box"
          placeholder="🔍 Search category, work, amount..."
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
      )}

      {/* SUMMARY */}
      {view==="summary" && (
        <div className="cards">
          <div className="card income" onClick={()=>{setType("IN");setView("category")}}>
            <h3>Total Funds Receive (कुल प्राप्‍त इमदाद)</h3>
            <div className="amount">₹{formatAmount(totalIncome)}</div>
          </div>
          <div className="card expense" onClick={()=>{setType("OUT");setView("category")}}>
            <h3>Total Expenses (कुल इमदादी खर्च)</h3>
            <div className="amount">₹{formatAmount(totalExpense)}</div>
          </div>
          <div className="card balance">
            <h3>Available Fund (शेष बची कुल इमदाद)</h3>
            <div className="amount">₹{formatAmount(balance)}</div>
          </div>
        </div>
      )}

      {/* CATEGORY */}
      {view==="category" && (
        <div className="list">
          <h3>Category Wise</h3>

          {[...new Set(dataByType.map(r=>r.Category))]
            .sort()
            .map(c=>{
              const total = sum(dataByType.filter(r=>r.Category===c));
              return total>0 && (
                <div key={c} className="list-item" onClick={()=>{setCategory(c);setView("subcategory")}}>
                  <span>{c}</span>
                 <span className="amount-tag">₹{formatAmount(total)}</span>
                </div>
              );
            })}

          <button className="back-btn" onClick={()=>setView("summary")}>⬅ Back</button>
        </div>
      )}

      {/* SUB CATEGORY */}
      {view==="subcategory" && (
        <div className="list">
          <h3>{category} – Sub Category</h3>

          {[...new Set(dataByType.filter(r=>r.Category===category).map(r=>r.Sub_Sub_Category))]
            .sort()
            .map(sc=>{
              const total = sum(dataByType.filter(r=>r.Category===category && r.Sub_Sub_Category===sc));
              return total>0 && (
                <div key={sc} className="list-item" onClick={()=>{setSubCategory(sc);setView("year")}}>
                  <span>{sc}</span>
                  <span className="amount-tag">₹{formatAmount(total)}</span>
                </div>
              );
            })}

          <button className="back-btn" onClick={()=>setView("category")}>⬅ Back</button>
        </div>
      )}

      {/* YEAR */}
      {view==="year" && (
        <div className="list">
          <h3>Year Wise</h3>

          {[...new Set(dataByType.map(r=>r.Year))]
            .sort()
            .map(y=>{
              const total = sum(dataByType.filter(r=>r.Year===y && r.Category===category && r.Sub_Sub_Category===subCategory));
              return total>0 && (
                <div key={y} className="list-item" onClick={()=>{setYear(y);setView("month")}}>
                  <span>{y}</span>
                  <span className="amount-tag">₹{total}</span>
                </div>
              );
            })}

          <button className="back-btn" onClick={()=>setView("subcategory")}>⬅ Back</button>
        </div>
      )}

      {/* MONTH */}
      {view==="month" && (
        <div className="list">
          <h3>{year} – Month Wise</h3>

          {[...new Set(dataByType.filter(r=>r.Year===year).map(r=>r.Month))]
            .sort()
            .map(m=>{
              const total = sum(
                dataByType.filter(r =>
                  r.Year===year &&
                  r.Month===m &&
                  r.Category===category &&
                  r.Sub_Sub_Category===subCategory
                )
              );
              return total>0 && (
                <div key={m} className="list-item" onClick={()=>{setMonth(m);setView("details")}}>
                  <span>{MONTH_NAMES[m-1]}</span>
                  <span className="amount-tag">₹{total}</span>
                </div>
              );
            })}

          <button className="back-btn" onClick={()=>setView("year")}>⬅ Back</button>
        </div>
      )}

      {/* DETAILS */}
      {view==="details" && (
        <div className="detail">
          <h3>{subCategory} – Details</h3>

          <table className="detail-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Work</th>
                <th>Amount</th>
                <th>Video</th>
              </tr>
            </thead>
            <tbody>
              {dataByType
                .filter(r =>
                  r.Year===year &&
                  r.Month===month &&
                  r.Category===category &&
                  r.Sub_Sub_Category===subCategory
                )
                .map((r,i)=>(
                  <tr key={i}>
                    <td>{r.DisplayDate}</td>
                    <td>{r["Person/Work"] || "—"}</td>
                    <td>₹{formatAmount(r.Amount)}</td>
                    <td>
                      {r.EmbedUrl
                        ? <button className="video-btn" onClick={()=>{setVideoUrl(r.EmbedUrl);setShowVideo(true)}}>▶ View</button>
                        : "—"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <button className="back-btn" onClick={()=>setView("month")}>⬅ Back</button>
        </div>
      )}

      {/* VIDEO MODAL */}
      {showVideo && (
        <div className="video-modal">
          <div className="video-box">
            <button className="close-btn" onClick={()=>setShowVideo(false)}>✖</button>
            <iframe src={videoUrl} title="YouTube Video" allowFullScreen />
          </div>
        </div>
      )}

    </div>
  );
}
