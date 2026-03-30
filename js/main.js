const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuToggle && mobileMenu) {
  const mobileLinks = mobileMenu.querySelectorAll("a");

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.classList.toggle("is-open");
    document.body.classList.toggle("menu-open");
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = mobileMenu.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle && mobileMenu.classList.contains("is-open")) {
      mobileMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMenu.classList.contains("is-open")) {
      mobileMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    }
  });
}

async function loadReviews() {
  const reviewsContainerEn = document.getElementById("Reviews-en");
  const reviewsContainerAr = document.getElementById("Reviews-ar");

  if (!reviewsContainerEn && !reviewsContainerAr) return;

  try {
    const response = await fetch("/api/reviews");
    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }

    const reviews = await response.json();

    const renderReviews = (container, emptyText) => {
      if (!container) return;

      if (!Array.isArray(reviews) || reviews.length === 0) {
        container.innerHTML = `
          <article class="review-card">
            <p class="review-text">${emptyText}</p>
          </article>
        `;
        return;
      }

      container.innerHTML = reviews
        .slice(0, 3)
        .map((review) => `
          <article class="review-card">
            <div class="review-header">
              <div class="review-name">${review.name || "Anonymous"}</div>
              <div class="review-stars">${"★".repeat(review.rating || 5)}</div>
            </div>
            <p class="review-text">${review.text || ""}</p>
            <div class="review-date">${review.date || ""}</div>
          </article>
        `)
        .join("");
    };

    renderReviews(reviewsContainerEn, "No reviews available yet.");
    renderReviews(reviewsContainerAr, "لا توجد تقييمات حالياً.");
  } catch (error) {
    if (reviewsContainerEn) {
      reviewsContainerEn.innerHTML = `
        <article class="review-card">
          <p class="review-text">Unable to load reviews right now.</p>
        </article>
      `;
    }

    if (reviewsContainerAr) {
      reviewsContainerAr.innerHTML = `
        <article class="review-card">
          <p class="review-text">تعذر تحميل التقييمات حالياً.</p>
        </article>
      `;
    }
  }
}

loadReviews();