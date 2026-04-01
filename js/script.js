document.addEventListener("DOMContentLoaded", function () {
  console.log("script loaded");

  const REVIEWS_URL = "https://script.google.com/macros/s/AKfycbxePXS-q4_nRk0BrclyYfkpPMwZYJVs206QcnrOPYOKQo7JIs0a9dieg8-LFoPWTPMkYg/exec";

  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      const isOpen = mobileMenu.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.classList.toggle("menu-open", isOpen);
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      });
    });

    document.addEventListener("click", function (event) {
      const clickedInsideMenu = mobileMenu.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle && mobileMenu.classList.contains("is-open")) {
        mobileMenu.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && mobileMenu.classList.contains("is-open")) {
        mobileMenu.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      }
    });
  }

  const reviewsEn = document.getElementById("Reviews-en");
  const reviewsAr = document.getElementById("Reviews-ar");

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatDate(timestamp, lang) {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
      month: "short",
      year: "numeric"
    });
  }

  function getValue(review, possibleKeys) {
    for (var i = 0; i < possibleKeys.length; i++) {
      if (review[possibleKeys[i]] !== undefined) {
        return review[possibleKeys[i]];
      }
    }
    return "";
  }

  function getPublishValue(review) {
    const possibleKeys = [
      "Can we publish this review on the website? | هل يمكننا نشر هذه المراجعة على الموقع الإلكتروني؟",
      "Can we publish this review on the website? | هل يمكننا نشر هذه المراجعة على الموقع الإلكتروني؟ ",
      "Can we publish this review on the website?",
      "Publish"
    ];

    return getValue(review, possibleKeys);
  }

  function getApprovedReviews(reviews) {
    if (!Array.isArray(reviews)) return [];

    return reviews
      .filter(function (review) {
        const approved = String(review["Approved"] || "")
          .trim()
          .toLowerCase()
          .includes("yes");

        const publish = String(getPublishValue(review) || "")
          .trim()
          .toLowerCase()
          .includes("yes");

        return approved && publish;
      })
      .sort(function (a, b) {
        return new Date(b["Timestamp"] || 0) - new Date(a["Timestamp"] || 0);
      });
  }

  function renderReviews(container, reviews, lang) {
    if (!container) return;

    const approvedReviews = getApprovedReviews(reviews).slice(0, 3);

    if (!approvedReviews.length) {
      container.innerHTML = `
        <article class="review-card">
          <p class="review-text">${lang === "ar" ? "لا توجد تقييمات معتمدة بعد." : "No approved reviews yet."}</p>
        </article>
      `;
      return;
    }

    container.innerHTML = approvedReviews
      .map(function (review) {
        const name = escapeHtml(
          getValue(review, [
            "Full Name | الأسم كامل",
            "Full Name | الاسم كامل",
            "Full Name"
          ]) || "Anonymous"
        );

        const rating = Math.max(
          1,
          Math.min(
            Number(
              getValue(review, [
                "Rating | التقيم (1 to 5)",
                "Rating | التقييم (1 to 5)",
                "Rating (1 to 5)",
                "Rating"
              ]) || 5
            ),
            5
          )
        );

        const text = escapeHtml(
          getValue(review, [
            "Your Review | تقيم",
            "Your Review | تقييم",
            "Your Review",
            "Review"
          ]) || ""
        );

        const date = escapeHtml(formatDate(review["Timestamp"], lang));

        return `
          <article class="review-card">
            <div class="review-header">
              <div class="review-name">${name}</div>
              <div class="review-stars" aria-label="${rating} out of 5 stars">${"★".repeat(rating)}</div>
            </div>
            <p class="review-text">${text}</p>
            <div class="review-date">${date}</div>
          </article>
        `;
      })
      .join("");
  }

  function renderErrorState() {
    if (reviewsEn) {
      reviewsEn.innerHTML = `
        <article class="review-card">
          <p class="review-text">Unable to load reviews right now.</p>
        </article>
      `;
    }

    if (reviewsAr) {
      reviewsAr.innerHTML = `
        <article class="review-card">
          <p class="review-text">تعذر تحميل التقييمات حالياً.</p>
        </article>
      `;
    }
  }

  if (!reviewsEn && !reviewsAr) return;

  fetch(REVIEWS_URL)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      return response.json();
    })
    .then(function (reviews) {
      console.log("reviews loaded:", reviews);
      renderReviews(reviewsEn, reviews, "en");
      renderReviews(reviewsAr, reviews, "ar");
    })
    .catch(function (error) {
      console.error("Reviews error:", error);
      renderErrorState();
    });
});