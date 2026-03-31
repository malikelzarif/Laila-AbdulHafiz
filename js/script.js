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
  }

  const reviewsEn = document.getElementById("Reviews-en");
  const reviewsAr = document.getElementById("Reviews-ar");

  const sampleReviews = [
    {
      name: "Sara M.",
      rating: 5,
      text: "Amazing teacher. My child improved so much in a short time.",
      date: "2026"
    },
    {
      name: "Ahmed K.",
      rating: 5,
      text: "Very patient and professional teaching style.",
      date: "2026"
    },
    {
      name: "فاطمة",
      rating: 5,
      text: "أسلوب شرح رائع وصبر كبير مع الأطفال.",
      date: "2026"
    }
  ];

  function renderReviews(container, emptyText) {
    if (!container) return;

    container.innerHTML = sampleReviews.slice(0, 3).map(function (review) {
      return `
        <article class="review-card">
          <div class="review-header">
            <div class="review-name">${review.name}</div>
            <div class="review-stars">${"★".repeat(review.rating)}</div>
          </div>
          <p class="review-text">${review.text}</p>
          <div class="review-date">${review.date}</div>
        </article>
      `;
    }).join("");
  }

  if (reviewsEn) renderReviews(reviewsEn, "No reviews yet.");
  if (reviewsAr) renderReviews(reviewsAr, "لا توجد تقييمات بعد.");
});