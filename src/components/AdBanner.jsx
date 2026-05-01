// components/AdBanner.jsx
import { useEffect } from "react";

export default function AdBanner() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div style={{ margin: "20px 0", textAlign: "center" }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-6868300706935180"
        data-ad-slot="8953957057"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}