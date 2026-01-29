import React, { useEffect, useState, useRef } from "react";
import "./GAStats.css";
import Odometer from "./Odometer";

function GAStats() {
  const [liveUsers, setLiveUsers] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [status, setStatus] = useState("loading");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [open, setOpen] = useState(false);

  const footerRef = useRef(null);

  async function fetchGA() {
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 5000);

      const res = await fetch("https://services.aetmyweb.com/ga/analytics", {
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      const now = new Date().toLocaleString();

      setLiveUsers(data.liveUsers);
      setTotalUsers(data.totalUsers);
      setLastUpdated(now);
      setStatus("ok");

      localStorage.setItem(
        "ga_cache",
        JSON.stringify({ ...data, lastUpdated: now })
      );
    } catch (err) {
      const cache = localStorage.getItem("ga_cache");
      if (cache) {
        const data = JSON.parse(cache);
        setLiveUsers(data.liveUsers);
        setTotalUsers(data.totalUsers);
        setLastUpdated(data.lastUpdated);
        setStatus("cached");
      } else {
        setStatus("error");
      }
    }
  }

  useEffect(() => {
    fetchGA();
    const interval = setInterval(fetchGA, 7200000);
    return () => clearInterval(interval);
  }, []);

  /* 👇 OUTSIDE TAP = CLOSE (mobile fix) */
  useEffect(() => {
    function handleOutsideClick(e) {
      if (footerRef.current && !footerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("click", handleOutsideClick);
    return () =>
      document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <>
      {/* 📌 FOOTER LIVE USERS */}
      <div
        ref={footerRef}
        className={`live-footer ${open ? "active" : ""}`}
      >
        {/* HANDLE */}
        <div
          className="live-handle"
          onClick={(e) => {
            e.stopPropagation(); // 🔥 very important
            setOpen((prev) => !prev);
          }}
        >
          🟢 Live Users
        </div>

        {/* CONTENT */}
        <div className="live-content">
          <div className="live-ring">
            <Odometer value={liveUsers} />
          </div>
          <div className="live-label">
            Users online right now
          </div>
        </div>
      </div>

      {/* 📊 MAIN CARD */}
      <div className="ga-card">
        <h3 className="ga-title">📊 Website Analytics</h3>

        <div className="ga-box">
          <span className="ga-label">Total Visitors</span>
          <Odometer value={totalUsers} />
        </div>

        {lastUpdated && (
          <div className="ga-time">
            Last updated: {lastUpdated}
          </div>
        )}

        {status === "cached" && (
          <div className="ga-warning">Showing cached data</div>
        )}

        {status === "error" && (
          <div className="ga-error">Stats temporarily unavailable</div>
        )}
      </div>
    </>
  );
}

export default GAStats;
