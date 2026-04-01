document.addEventListener("DOMContentLoaded", function () {
  console.log("menu js loaded");

  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("is-open");

      const isOpen = mobileMenu.classList.contains("is-open");
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

  function renderReviews(container, reviews, emptyText) {
    if (!container) return;

    const approvedReviews = reviews.filter(function (review) {
      const approvedValue = String(review.Approved || "").trim().toLowerCase();
      const publishValue = String(review["Can we publish this review on the website? | هل يمكننا نشر هذه المراجعة على الموقع الإلكتروني؟"] || "").trim().toLowerCase();

      return approvedValue === "yes" && publishValue === "yes";
    });

    if (!approvedReviews.length) {
      container.innerHTML = `
        <article class="review-card">
          <p class="review-text">${emptyText}</p>
        </article>
      `;
      return;
    }

    container.innerHTML = approvedReviews.slice(0, 3).map(function (review) {
      const name =
        review["Full Name | الأسم كامل"] ||
        review.name ||
        "Anonymous";

      const rating =
        Number(review["Rating | التقيم (1 to 5)"] || review.rating || 5);

      const reviewText =
        review["Your Review | تقيم"] ||
        review.text ||
        review.review ||
        review.message ||
        review.feedback ||
        "No review text provided.";

      const rawDate = review.Timestamp || "";
      let formattedDate = "";

      if (rawDate) {
        const dateObj = new Date(rawDate);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric"
          });
        }
      }

      return `
        <article class="review-card">
          <div class="review-header">
            <div class="review-name">${name}</div>
            <div class="review-stars">${"★".repeat(Math.max(1, Math.min(rating, 5)))}</div>
          </div>
          <p class="review-text">${reviewText}</p>
          <div class="review-date">${formattedDate}</div>
        </article>
      `;
    }).join("");
  }

  fetch("https://script.google.com/macros/s/AKfycbwx954xWnZ5jG6AGGAgvrymsi5mKEUzEUoECh9SBjo3CVcJ-ZUULdgJtsmjlebkDsudOg/exec")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load reviews");
      }
      return response.json();
    })
    .then(function (reviews) {
      console.log("reviews data:", reviews);
      renderReviews(reviewsEn, reviews, "No reviews yet.");
      renderReviews(reviewsAr, reviews, "لا توجد تقييمات بعد.");
    })
    .catch(function (error) {
      console.error("Reviews error:", error);
      renderReviews(reviewsEn, [], "Unable to load reviews right now.");
      renderReviews(reviewsAr, [], "تعذر تحميل التقييمات حالياً.");
    });
});