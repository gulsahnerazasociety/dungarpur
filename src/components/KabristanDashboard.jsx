import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./dashboard.css";
import KABRISTAN_MAP from "../data/kabristanMap.json";
import KABRISTAN_CONFIG from "../data/kabristanConfig";

const MONTH_NAMES = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];


const CACHE_KEY = "kabristan_all_data";
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour cache

const formatAmount = (num) => Number(num || 0).toFixed(2);

// 🎥 YouTube URL → Embed
const getEmbedUrl = (url) => {
  if (!url) return "";
  if (url.includes("shorts/")) return `https://www.youtube.com/embed/${url.split("shorts/")[1]}`;
  if (url.includes("watch?v=")) return `https://www.youtube.com/embed/${url.split("watch?v=")[1]}`;
  return "";
};

export default function KabristanDashboard() {
  const navigate = useNavigate();
  const { kabristanId } = useParams();
  const KABRISTAN_ID = kabristanId;

const [allRows, setAllRows] = useState([]); // dono properly define hain

  const [rows, setRows] = useState([]);       // Filtered by Kabristan_ID
  const [search, setSearch] = useState("");

  const [view, setView] = useState("summary");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subSubCategory, setSubSubCategory] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");

  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

// YouTube URL → Embed Playlist Video Configure 
const playlistId = KABRISTAN_CONFIG[KABRISTAN_ID]?.playlistId;
const getPlaylistEmbedUrl = (playlistId) =>
  `https://www.youtube.com/embed/videoseries?list=${playlistId}`;

  /* ================= FETCH & CACHE ================= */
useEffect(() => {
  const cached = localStorage.getItem(CACHE_KEY);
  let data = [];

  if (cached) {
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp < CACHE_DURATION) {
      data = parsed.data;
    }
  }

  if (data.length === 0) {
    fetch("https://script.google.com/macros/s/AKfycbx0yP6tQ-vVYX0Zs7kD7bdqPOpsepLYhSrxxsgmIM3tGNHbIg2ttTjFx0e_ktIdaTXc/exec")
      .then(res => res.json())
      .then(fetchedData => {
        const cleaned = fetchedData.map(r => {
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
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: cleaned, timestamp: Date.now() }));
        data = cleaned;
        setAllRows(cleaned);
        setRows(cleaned.filter(r => r.Kabristan_ID === KABRISTAN_ID));
      })
      .catch(err => console.error("Fetch Error:", err));
  } else {
    setAllRows(data);
    setRows(data.filter(r => r.Kabristan_ID === KABRISTAN_ID));
  }
}, [KABRISTAN_ID], allRows);


  /* ================= HELPERS ================= */
  const sum = list => list.reduce((s,r)=>s+r.Amount,0);
  const searchFilter = (r) => {
    if (!search) return true;
    const t = search.toLowerCase();
    return (
      r.Category?.toLowerCase().includes(t) ||
      r.Sub_Category?.toLowerCase().includes(t) ||
      r.Sub_Sub_Category?.toLowerCase().includes(t) ||
      r["Person/Work"]?.toLowerCase().includes(t) ||
      r.DisplayDate?.includes(t) ||
      String(r.Amount).includes(t)
    );
  };
  const dataByType = rows.filter(r => r.Type === type).filter(searchFilter);

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
          {[...new Set(dataByType.map(r=>r.Category))].sort().map(c=>{
            const total = sum(dataByType.filter(r=>r.Category===c));
            return total>0 && (
              <div key={c} className="list-item" onClick={()=>{setCategory(c);setView("subcategory")}}>
                <span>{c}</span>
                <span className="amount-tag">₹{formatAmount(total)}</span>
              </div>
            )
          })}
          <button className="back-btn" onClick={()=>setView("summary")}>⬅ Back</button>
        </div>
      )}

      {/* SUB_CATEGORY */}
      {view==="subcategory" && (
        <div className="list">
          <h3>{category} – Sub Category</h3>
          {[...new Set(dataByType.filter(r=>r.Category===category).map(r=>r.Sub_Category))]
            .sort()
            .map(sc=>{
              const total = sum(dataByType.filter(r=>r.Category===category && r.Sub_Category===sc));
              return total>0 && (
                <div key={sc} className="list-item" onClick={()=>{setSubCategory(sc);setView("subsubcategory")}}>
                  <span>{sc}</span>
                  <span className="amount-tag">₹{formatAmount(total)}</span>
                </div>
              )
            })}
          <button className="back-btn" onClick={()=>setView("category")}>⬅ Back</button>
        </div>
      )}

      {/* SUB_SUB_CATEGORY */}
      {view==="subsubcategory" && (
        <div className="list">
          <h3>{subCategory} – Sub Sub Category</h3>
          {[...new Set(dataByType.filter(r=>r.Category===category && r.Sub_Category===subCategory).map(r=>r.Sub_Sub_Category))]
            .sort()
            .map(ssc=>{
              const total = sum(dataByType.filter(r=>r.Category===category && r.Sub_Category===subCategory && r.Sub_Sub_Category===ssc));
              return total>0 && (
                <div key={ssc} className="list-item" onClick={()=>{setSubSubCategory(ssc);setView("year")}}>
                  <span>{ssc}</span>
                  <span className="amount-tag">₹{formatAmount(total)}</span>
                </div>
              )
            })}
          <button className="back-btn" onClick={()=>setView("subcategory")}>⬅ Back</button>
        </div>
      )}

      {/* YEAR */}
      {view==="year" && (
        <div className="list">
          <h3>Year Wise</h3>
          {[...new Set(dataByType.map(r=>r.Year))].sort().map(y=>{
            const total = sum(dataByType.filter(r=>
              r.Year===y &&
              r.Category===category &&
              r.Sub_Category===subCategory &&
              r.Sub_Sub_Category===subSubCategory
            ));
            return total>0 && (
              <div key={y} className="list-item" onClick={()=>{setYear(y);setView("month")}}>
                <span>{y}</span>
                <span className="amount-tag">₹{formatAmount(total)}</span>
              </div>
            )
          })}
          <button className="back-btn" onClick={()=>setView("subsubcategory")}>⬅ Back</button>
        </div>
      )}

      {/* MONTH */}
      {view==="month" && (
        <div className="list">
          <h3>{year} – Month Wise</h3>
          {[...new Set(dataByType.filter(r=>r.Year===year).map(r=>r.Month))].sort().map(m=>{
            const total = sum(dataByType.filter(r =>
              r.Year===year &&
              r.Month===m &&
              r.Category===category &&
              r.Sub_Category===subCategory &&
              r.Sub_Sub_Category===subSubCategory
            ));
            return total>0 && (
              <div key={m} className="list-item" onClick={()=>{setMonth(m);setView("details")}}>
                <span>{MONTH_NAMES[m-1]}</span>
                <span className="amount-tag">₹{formatAmount(total)}</span>
              </div>
            )
          })}
          <button className="back-btn" onClick={()=>setView("year")}>⬅ Back</button>
        </div>
      )}

      {/* DETAILS */}
      {view==="details" && (
        <div className="detail">
          <h3>{subSubCategory} – Details</h3>
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
                  r.Sub_Category===subCategory &&
                  r.Sub_Sub_Category===subSubCategory
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
{/* yaha per YouTube PlayList dikhegi */}
{playlistId && (
  <div className="playlist-wrapper">
    <h3 className="playlist-title">
      🎥 Kabristan {KABRISTAN_ID} – Video Updates
    </h3>

    <div className="playlist-frame">
      <iframe
        src={getPlaylistEmbedUrl(playlistId)}
        title="Kabristan Playlist"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
        

        </div>
        <a
      href={`https://www.youtube.com/playlist?list=${playlistId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="youtube-link"
    >
      ▶️ View Full Playlist on YouTube
    </a>
      </div>
    )}


 <br></br>
<button onClick={() => navigate("/")}>
  Go to Home Page
</button>

    </div>
  );
}
