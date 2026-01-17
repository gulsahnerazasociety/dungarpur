import { useEffect, useState } from "react";
import "./NoticeBoard.css";
import ConsoleText from "./ConsoleText";

const API =
  "https://script.google.com/macros/s/AKfycbxMHLXnesB0NV8RAKlg4FQIJ4alG4-3DZ6EAh9oXqs2_ztBfNT45FVXRwThYiMENJep/exec";

function NoticeBoard() {
  const [notice, setNotice] = useState([]);
  const [headmaster, setHeadmaster] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const storedUpdate = localStorage.getItem("notice_last_updated");
    const storedContent = localStorage.getItem("notice_content");

    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        // 🔹 Data updated OR first time
        if (data.lastUpdated !== storedUpdate) {
          localStorage.setItem(
            "notice_last_updated",
            data.lastUpdated
          );
          localStorage.setItem(
            "notice_content",
            JSON.stringify(data.content)
          );
          applyData(data.content);
        }
        // 🔹 Same data → page refresh
        else if (storedContent) {
          applyData(JSON.parse(storedContent));
        }
      })
      .catch(() => {
        // 🔹 API fail but cache exists
        if (storedContent) {
          applyData(JSON.parse(storedContent));
        }
      });
  }, []);

  const applyData = (content) => {
    setNotice(content[1]);
    setHeadmaster(`${content[2][1]} , ${content[3][1]}`);
    setDate(
      new Date(content[3][0]).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    );

  };

  return (
    <section className="services" id="suchna-board">
      <div className="noticeboard">
        <h2>:: महत्‍वपूर्ण सूचना बोर्ड ::</h2>

        <ConsoleText words={notice} />

        <h4>last_updated: {date}</h4>

        <h5>
          {headmaster}
          <br />
          Gulshan-E-Raza-Society,
          <br />
          Dungarpur (Raj.)
        </h5>
      </div>
    </section>
  );
}

export default NoticeBoard;
