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

    if (!reviews || !reviews.length) {
      container.innerHTML = `
        <article class="review-card">
          <p class="review-text">${emptyText}</p>
        </article>
      `;
      return;
    }

    container.innerHTML = reviews.slice(0, 3).map(function (review) {
      return `
        <article class="review-card">
          <div class="review-header">
            <div class="review-name">${review.name || "Anonymous"}</div>
            <div class="review-stars">${"★".repeat(Number(review.rating) || 5)}</div>
          </div>
          <p class="review-text">${review.text || ""}</p>
          <div class="review-date">${review.date || ""}</div>
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
      renderReviews(reviewsEn, reviews, "No reviews yet.");
      renderReviews(reviewsAr, reviews, "لا توجد تقييمات بعد.");
    })
    .catch(function (error) {
      console.error("Reviews error:", error);
      renderReviews(reviewsEn, [], "Unable to load reviews right now.");
      renderReviews(reviewsAr, [], "تعذر تحميل التقييمات حالياً.");
    });
});