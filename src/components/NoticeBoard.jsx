import { useEffect, useState } from "react";
import "./NoticeBoard.css";
import ConsoleText from "./ConsoleText";

const API =
  "https://script.google.com/macros/s/AKfycbwTw8WE_iruJat_a3gsgx2n4X-mfG0WSYCjQZMA30wZs6zNzXGbB2hwjp6E9Xm7KlVq/exec";

function NoticeBoard() {
  const [notice, setNotice] = useState([]);
  const [headmaster, setHeadmaster] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        const s = data.content;
        setNotice(s[1]);
        setHeadmaster(`${s[2][1]} , ${s[3][1]}`);
        setDate(new Date(s[3][0]).toLocaleDateString());
      });
  }, []);

  return (
    <section className="services" id="suchna-board">
      <div className="noticeboard">
        <h2>:: महत्‍वपूर्ण सूचना बोर्ड ::</h2>

        <ConsoleText words={notice} />

        <h4>Issue Date: {date}</h4>

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
