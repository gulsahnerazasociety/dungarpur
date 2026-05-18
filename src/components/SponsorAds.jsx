import "./SponsorAds.css";

import { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function SponsorAds() {

  // =========================
  // STATES
  // =========================

  const [selectedAd, setSelectedAd] = useState(null);

  const [ads, setAds] = useState([]);

  // =========================
  // FETCH ADS FROM GOOGLE SHEET API
  // =========================

useEffect(() => {

  const CACHE_KEY = "sponsor_ads_cache";

  const CACHE_TIME_KEY =
    "sponsor_ads_cache_time";

  const CACHE_DURATION =
    1000 * 60 * 60 * 12;
  // 12 HOURS

  // =====================
  // LOAD CACHE FIRST
  // =====================

  const cachedAds =
    localStorage.getItem(CACHE_KEY);

  const cacheTime =
    localStorage.getItem(
      CACHE_TIME_KEY
    );

  const isCacheValid =

    cachedAds &&
    cacheTime &&
    (
      Date.now() - Number(cacheTime)
      <
      CACHE_DURATION
    );

  // =====================
  // SHOW CACHE INSTANTLY
  // =====================

  if (isCacheValid) {

    try {

      const parsedAds =
        JSON.parse(cachedAds);

      setAds(parsedAds);

    } catch (err) {

      console.error(
        "Cache Parse Error:",
        err
      );

    }

  }

  // =====================
  // ALWAYS FETCH FRESH DATA
  // =====================

  fetch(
    "https://script.google.com/macros/s/AKfycbwD2kAzoAx_YnQAu5VlDUTW9ANy4NqQrc--JDgh7trWXmtxZ3sY5lZ7bzhfMlWKfgtS/exec"
  )

    .then((res) => res.json())

    .then((data) => {

      setAds(data);

      // SAVE CACHE

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify(data)
      );

      localStorage.setItem(
        CACHE_TIME_KEY,
        Date.now()
      );

    })

    .catch((err) => {

      console.error(
        "Ads Fetch Error:",
        err
      );

    });

}, []);

  // =========================
  // REMOVE EXPIRED & INACTIVE ADS
  // =========================

  const activeAds = ads.filter((ad) => {

    return (

      (
        ad.active === true ||
        ad.active === "TRUE"
      )

      &&

      new Date(ad.expiry) >= new Date()

    );

  });

  // =========================
  // PRIORITY ORDER
  // =========================

  const priorityOrder = {
    platinum: 1,
    gold: 2,
    premium: 3,
    normal: 4
  };

  // =========================
  // SORT + RANDOMIZE
  // =========================

  const shuffledAds = [...activeAds]

    .sort((a, b) => {

      const pa =
        priorityOrder[a.priority] || 99;

      const pb =
        priorityOrder[b.priority] || 99;

      // PRIORITY FIRST
      if (pa !== pb) {

        return pa - pb;

      }

      // SAME PRIORITY → RANDOM
      return Math.random() - 0.5;

    });

  // =========================
  // LABELS
  // =========================

  const getSponsorLabel = (priority) => {

    switch (priority) {

      case "platinum":
        return "👑 Platinum Sponsor";

      case "gold":
        return "🥇 Gold Sponsor";

      case "premium":
        return "⭐ Premium Sponsor";

      default:
        return "Sponsored Partner";
    }
  };

  // =========================
  // UI
  // =========================

  return (

    <section className="sponsor-section">

      {/* HEADER */}

      <div className="sponsor-header">

        <h2>
          ⭐ Sponsored Partners
        </h2>

        <p>
          हमारे सहयोगी एवं विज्ञापनदाता
        </p>

      </div>

      {/* NO ADS */}

      {shuffledAds.length === 0 && (

        <div className="no-ads">

          No Sponsored Ads Available

        </div>

      )}

      {/* SLIDER */}

      {shuffledAds.length > 0 && (

        <Swiper
          modules={[
            Autoplay,
            Pagination
          ]}

          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}

          pagination={{
            clickable: true
          }}

          loop={true}

          spaceBetween={20}

          breakpoints={{
            0: {
              slidesPerView: 1
            },

            768: {
              slidesPerView: 2
            },

            1200: {
              slidesPerView: 3
            }
          }}
        >

          {shuffledAds.map((ad) => (

            <SwiperSlide key={ad.id}>

              <div
                className={`sponsor-card ${ad.priority}`}
                onClick={() =>
                  setSelectedAd(ad)
                }
              >

                {/* IMAGE */}

                <img
                  src={ad.image}
                  alt={ad.title}
                  loading="lazy"
                />

                {/* OVERLAY */}

                <div className="sponsor-overlay">

                  <div>

                    <h3>
                      {ad.title}
                    </h3>

                    <span>

                      {getSponsorLabel(
                        ad.priority
                      )}

                    </span>

                  </div>

                </div>

              </div>

            </SwiperSlide>

          ))}

        </Swiper>

      )}

      {/* POPUP MODAL */}

      {selectedAd && (

        <div
          className="ad-modal"
          onClick={() =>
            setSelectedAd(null)
          }
        >

          <div
            className="ad-modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* CLOSE BUTTON */}

            <button
              className="close-btn"
              onClick={() =>
                setSelectedAd(null)
              }
            >
              ✖
            </button>

            {/* FULL IMAGE */}

            <img
              src={selectedAd.image}
              alt={selectedAd.title}
            />

            {/* INFO */}

            <div className="ad-modal-info">

              <h2>
                {selectedAd.title}
              </h2>

              <p>
                {
                  getSponsorLabel(
                    selectedAd.priority
                  )
                }
              </p>

              <a
                href={selectedAd.link}
                target="_blank"
                rel="noopener noreferrer"
                className="visit-btn"
              >
                Visit Sponsor
              </a>

            </div>

          </div>

        </div>

      )}

    </section>

  );
}