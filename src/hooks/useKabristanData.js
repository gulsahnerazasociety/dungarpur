import { useEffect, useState } from "react";

const CACHE_KEY = "kabristan_all_data";
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hour

// | Duration         | Value in code (ms)    |
// | ---------------- | --------------------- |
// | 1 hour           | `1 * 60 * 60 * 1000`  |
// | 6 hours          | `6 * 60 * 60 * 1000`  |
// | 12 hours         | `12 * 60 * 60 * 1000` |
// | 24 hours (1 day) | `24 * 60 * 60 * 1000` |

// 🎥 YouTube URL → Embed
const getEmbedUrl = (url) => {
  if (!url) return "";
  if (url.includes("shorts/"))
    return `https://www.youtube.com/embed/${url.split("shorts/")[1]}`;
  if (url.includes("watch?v="))
    return `https://www.youtube.com/embed/${url.split("watch?v=")[1]}`;
  return "";
};

export default function useKabristanData() {
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);

    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_DURATION) {
        setAllRows(parsed.data);
        setLoading(false);
        return;
      }
    }
// https://script.google.com/macros/s/AKfycbwXg1FPObXU7boW9KdQycmPMje2TEpjRai5UqR2thlzUMquT5BRrPwKAw394Tbqsnks/exec without cache link
    fetch(
      "https://script.google.com/macros/s/AKfycbx0yP6tQ-vVYX0Zs7kD7bdqPOpsepLYhSrxxsgmIM3tGNHbIg2ttTjFx0e_ktIdaTXc/exec"
    )
      .then((res) => res.json())
      .then((data) => {
        const cleaned = data.map((r) => {
          const d = new Date(r.Date);
          return {
            ...r,
            Year: d.getFullYear().toString(),
            Month: String(d.getMonth() + 1).padStart(2, "0"),
            DisplayDate: `${String(d.getDate()).padStart(2, "0")}/${String(
              d.getMonth() + 1
            ).padStart(2, "0")}/${d.getFullYear()}`,
            Amount: Number(r.Amount),
            EmbedUrl: getEmbedUrl(r.YouTube),
          };
        });

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: cleaned, timestamp: Date.now() })
        );

        setAllRows(cleaned);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setLoading(false);
      });
  }, []); // ✅ ESLint safe

  return { allRows, loading };
}
