// FILE:
// src/components/AdvertisementPlans.jsx

import "./AdvertisementPlans.css";

export default function AdvertisementPlans() {

  const plans = [

    {
      id: 1,
      title: "👑 Platinum Sponsor",
      price: "₹2000+",
      duration: "6 Months",
      visibility: "Homepage First Position",
      description:
        "सबसे पहले दिखाई देगा और सबसे ज्यादा visibility मिलेगी।",
      className: "platinum"
    },

    {
      id: 2,
      title: "🥇 Gold Sponsor",
      price: "₹1500+",
      duration: "4 Months",
      visibility: "Top Rotation Visibility",
      description:
        "High priority sponsor rotation और बेहतर reach।",
      className: "gold"
    },

    {
      id: 3,
      title: "⭐ Premium Sponsor",
      price: "₹1000+",
      duration: "2 Months",
      visibility: "Featured Placement",
      description:
        "Highlighted sponsor section में display होगा।",
      className: "premium"
    },

    {
      id: 4,
      title: "📢 Standard Sponsor",
      price: "₹500+",
      duration: "1 Month",
      visibility: "Normal Rotation",
      description:
        "Regular sponsor listing एवं visibility।",
      className: "normal"
    }

  ];

  return (

    <section className="ad-plans-section">

      {/* HEADER */}

      <div className="ad-plan-header">

        <h2>
          📢 Advertisement Plans
        </h2>

        <p>
          अपनी दुकान, व्यापार या संस्था का प्रचार
          हमारी वेबसाइट पर करवाएं
        </p>

      </div>

      {/* GRID */}

      <div className="plans-grid">

        {plans.map((plan) => (

          <div
            key={plan.id}
            className={`plan-card ${plan.className}`}
          >

            {/* TITLE */}

            <h3>
              {plan.title}
            </h3>

            {/* PRICE */}

            <div className="plan-price">

              {plan.price}

            </div>

            {/* DESCRIPTION */}

            <p className="plan-description">

              {plan.description}

            </p>

            {/* DETAILS */}

            <div className="plan-details">

              <span>
                ⏳ {plan.duration}
              </span>

              <span>
                🚀 {plan.visibility}
              </span>

            </div>

            {/* BUTTON */}

            <a
              href="https://wa.me/919414723722"
              target="_blank"
              rel="noopener noreferrer"
              className="plan-btn"
            >
              Contact Now
            </a>

          </div>

        ))}

      </div>

    </section>

  );
}