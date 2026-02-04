import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./dashboard.css";

const MONTH_NAMES = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const KABRISTAN_MAP = {
  K1: { title: "1st - डूंगरपुर शहर कब्रस्‍तान", baba: "डूंगरपुर शहर कब्रस्‍तान" },
  K2: { title: "2nd - मेवा फरोश कब्रस्‍तान", baba: "मेवा फरोश कब्रस्‍तान" },
  K3: { title: "3rd - निचला कब्रस्‍तान", baba: "आशिक अली शाह बाबा" },
  K4: { title: "4th - उपर वाला कब्रस्‍तान", baba: "मस्‍तान शाह बाबा" },
  K5: { title: "5th - सामाजिक कार्य", baba: "डूंगरपुर" },
  K6: { title: "6th - मुकाबलाती इम्तिहान 2025-26", baba: "2025-26" },
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
              MonthName: MONTH_NAMES[d.getMonth()],
              DisplayDate: `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`,
              Amount: Number(r.Amount),
              EmbedUrl: getEmbedUrl(r.YouTube)
            };
          });

        setRows(cleaned);
      });
  }, [KABRISTAN_ID]);

  /* ================= TOTALS ================= */
  const totalIncome = rows.filter(r => r.Type === "IN").reduce((s,r)=>s+r.Amount,0);
  const totalExpense = rows.filter(r => r.Type === "OUT").reduce((s,r)=>s+r.Amount,0);
  const balance = totalIncome - totalExpense;

  const dataByType = rows.filter(r => r.Type === type);
  const sum = list => list.reduce((s,r)=>s+r.Amount,0);

  const years = [...new Set(dataByType.map(r=>r.Year))];
  const months = [...new Set(dataByType.filter(r=>r.Year===year).map(r=>r.Month))];
  const categories = [...new Set(
    dataByType.filter(r=>r.Year===year && r.Month===month).map(r=>r.Category)
  )];

  const subCategories = [...new Set(
    dataByType.filter(r =>
      r.Year===year &&
      r.Month===month &&
      r.Category===category
    ).map(r => r.Sub_Sub_Category).filter(Boolean)
  )];

  const finalList = dataByType.filter(
    r =>
      r.Year===year &&
      r.Month===month &&
      r.Category===category &&
      r.Sub_Sub_Category===subCategory
  );

  /* ================= UI ================= */
  return (
    <div className="dashboard">

      <div className="header">
        <h2>🌙 {KABRISTAN_MAP[KABRISTAN_ID]?.title}</h2>
        <small>{KABRISTAN_MAP[KABRISTAN_ID]?.baba}</small><br/>
        <small>Fund Management Dashboard</small>
      </div>

      {/* SUMMARY */}
      {view==="summary" && (
        <div className="cards">
          <div className="card income" onClick={()=>{setType("IN");setView("year")}}>
            <h3>Total Income</h3>
            <div className="amount">₹{totalIncome}</div>
          </div>
          <div className="card expense" onClick={()=>{setType("OUT");setView("year")}}>
            <h3>Total Expense</h3>
            <div className="amount">₹{totalExpense}</div>
          </div>
          <div className="card balance">
            <h3>Available Fund</h3>
            <div className="amount">₹{balance}</div>
          </div>
        </div>
      )}

      {/* YEAR */}
      {view==="year" && (
        <div className="list">
          <h3>Year Wise</h3>
          {years.map(y=>(
            <div key={y} className="list-item" onClick={()=>{setYear(y);setView("month")}}>
              <span>📅 {y}</span>
              <span className="amount-tag">₹{sum(dataByType.filter(r=>r.Year===y))}</span>
            </div>
          ))}
          <button className="back-btn" onClick={()=>setView("summary")}>⬅ Back</button>
        </div>
      )}

      {/* MONTH */}
      {view==="month" && (
        <div className="list">
          <h3>{year} – Month Wise</h3>
          {months.map(m=>(
            <div key={m} className="list-item" onClick={()=>{setMonth(m);setView("category")}}>
              <span>📆 {MONTH_NAMES[m-1]}</span>
              <span className="amount-tag">₹{sum(dataByType.filter(r=>r.Year===year && r.Month===m))}</span>
            </div>
          ))}
          <button className="back-btn" onClick={()=>setView("year")}>⬅ Back</button>
        </div>
      )}

      {/* CATEGORY */}
      {view==="category" && (
        <div className="list">
          <h3>Category Wise</h3>
          {categories.map(c=>(
            <div key={c} className="list-item" onClick={()=>{setCategory(c);setView("subcategory")}}>
              <span>{c}</span>
              <span className="amount-tag">₹{sum(dataByType.filter(r=>r.Category===c && r.Month===month))}</span>
            </div>
          ))}
          <button className="back-btn" onClick={()=>setView("month")}>⬅ Back</button>
        </div>
      )}

      {/* SUB CATEGORY */}
      {view==="subcategory" && (
        <div className="list">
          <h3>{category} – Sub Category</h3>
          {subCategories.map(sc=>(
            <div key={sc} className="list-item" onClick={()=>{setSubCategory(sc);setView("details")}}>
              <span>{sc}</span>
              <span className="amount-tag">
                ₹{sum(dataByType.filter(r=>r.Sub_Sub_Category===sc))}
              </span>
            </div>
          ))}
          <button className="back-btn" onClick={()=>setView("category")}>⬅ Back</button>
        </div>
      )}

      {/* DETAILS */}
      {view==="details" && (
        <div className="detail">
          <h3>{subCategory} – Day Wise</h3>

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
              {finalList.map((r,i)=>(
                <tr key={i}>
                  <td>{r.DisplayDate}</td>
                  <td>{r["Person/Work"] || "—"}</td>
                  <td>₹{r.Amount}</td>
                  <td>
                    {r.EmbedUrl ? (
                      <button className="video-btn" onClick={()=>{setVideoUrl(r.EmbedUrl);setShowVideo(true)}}>▶ View</button>
                    ) : (
                      <span className="no-video">No Video</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="back-btn" onClick={()=>setView("subcategory")}>⬅ Back</button>
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
