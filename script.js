// =====================
// Careers Carousel
// =====================
(function () {
  const CAREERS_API =
    "https://script.google.com/macros/s/AKfycbxQBx4JvjiaqWRjl_Uq86z-kfxSgsB4wLbRgEZOonNf6yczHxkBlSA50Zx_1lqpMKHt/exec";

  const BADGE = {
    R: { cls: "badge-blue",   label: "Realistic" },
    I: { cls: "badge-purple", label: "Investigative" },
    A: { cls: "badge-pink",   label: "Artistic" },
    S: { cls: "badge-green",  label: "Social" },
    E: { cls: "badge-orange", label: "Enterprising" },
    C: { cls: "badge-yellow", label: "Conventional" },
  };

  const carousel = document.getElementById("careers-carousel");
  const prevBtn  = document.getElementById("careers-prev");
  const nextBtn  = document.getElementById("careers-next");

  if (!carousel) return; // not on home page

  const CARD_W = 260; // card width + gap

  if (prevBtn) prevBtn.addEventListener("click", () => carousel.scrollBy({ left: -CARD_W * 3, behavior: "smooth" }));
  if (nextBtn) nextBtn.addEventListener("click", () => carousel.scrollBy({ left:  CARD_W * 3, behavior: "smooth" }));

  async function fetchCareers() {
    const TYPES = ["R", "I", "A", "S", "E", "C"];
    const responses = await Promise.all(
      TYPES.map((t) =>
        fetch(`${CAREERS_API}?action=results&primary=${t}&secondary=R`).then((r) => r.json())
      )
    );

    const seen = new Set();
    const jobs = [];
    responses.forEach((data) => {
      [...(data.topMatches || []), ...(data.otherJobs || [])].forEach((job) => {
        if (job.id && !seen.has(job.id)) {
          seen.add(job.id);
          jobs.push(job);
        }
      });
    });

    jobs.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    return jobs;
  }

  function buildCard(job) {
    // Results API returns `category` (e.g. "R"); job detail API returns `primary`
    const type = job.primary || job.category || "";
    const badge = BADGE[type] || { cls: "badge-blue", label: type };
    const salary = (job.salaryStart && job.salaryEnd)
      ? `${job.salaryStart} – ${job.salaryEnd}`
      : (job.salary || "");

    const a = document.createElement("a");
    a.className = "career-card";
    a.href = `job.html#${job.id}`;
    a.innerHTML = `
      <h3>${job.title || ""}</h3>
      <p>${job.shortDescription || job.description || ""}</p>
      <div class="career-footer">
        ${salary ? `<span class="salary">${salary}</span>` : "<span></span>"}
        <span class="career-badge ${badge.cls}">${badge.label}</span>
      </div>`;
    return a;
  }

  fetchCareers()
    .then((jobs) => {
      carousel.innerHTML = "";
      if (!jobs.length) {
        carousel.innerHTML = "<p style='padding:20px;color:var(--text);opacity:.6'>No careers found.</p>";
        return;
      }
      jobs.forEach((job) => carousel.appendChild(buildCard(job)));
    })
    .catch(() => {
      carousel.innerHTML = "<p style='padding:20px;color:var(--text);opacity:.6'>Could not load careers.</p>";
    });
})();

// =====================
// FAQ Modal
// =====================
document.querySelectorAll(".faq-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.getElementById("faqModalAnswer").textContent = btn.dataset.answer;

    const overlay = document.getElementById("faqModal");
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
  });
});

document
  .getElementById("faqModalClose")
  ?.addEventListener("click", closeFaqModal);

document.getElementById("faqModal")?.addEventListener("click", (e) => {
  if (e.target === e.currentTarget) {
    closeFaqModal();
  }
});

function closeFaqModal() {
  const overlay = document.getElementById("faqModal");
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
}

// =====================
// Hero Animation
// =====================
window.addEventListener("load", () => {
  const hero = document.querySelector(".hero-section");
  if (!hero) return;

  const heroRect = hero.getBoundingClientRect();
  const heroCenterX = heroRect.left + heroRect.width / 2;
  const heroCenterY = heroRect.top + heroRect.height / 2;

  const title = hero.querySelector(".hero-title");
  const decorations = [...hero.querySelectorAll(".decorations img")];

  title.animate(
    [
      { transform: "scale(0.2)", opacity: 0 },
      { transform: "scale(1)", opacity: 1 },
    ],
    {
      duration: 600,
      delay: 100,
      easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      fill: "both",
    }
  );

  decorations.forEach((el, i) => {
    const r = el.getBoundingClientRect();

    const dx = heroCenterX - (r.left + r.width / 2);
    const dy = heroCenterY - (r.top + r.height / 2);

    el.animate(
      [
        {
          transform: `translate(${dx}px, ${dy}px) scale(0.15)`,
          opacity: 0,
        },
        {
          transform: "translate(0,0) scale(1)",
          opacity: 1,
        },
      ],
      {
        duration: 700,
        delay: 150 + i * 60,
        easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        fill: "both",
      }
    );
  });

  const totalAnimMs =
    150 + (decorations.length - 1) * 60 + 700 + 200;

  setTimeout(() => {
    decorations.forEach((el) =>
      el.getAnimations().forEach((a) => a.cancel())
    );

    void hero.offsetHeight;

    const centers = decorations.map((el) => {
      const r = el.getBoundingClientRect();
      return {
        x: r.left + r.width / 2,
        y: r.top + r.height / 2,
      };
    });

    decorations.forEach((el) => {
      el.style.transition = "transform .35s ease-out";
    });

    const RADIUS = 150;
    const MAX_SHIFT = 20;

    hero.addEventListener("mousemove", (e) => {
      decorations.forEach((el, i) => {
        const dx = e.clientX - centers[i].x;
        const dy = e.clientY - centers[i].y;
        const dist = Math.hypot(dx, dy);

        if (dist < RADIUS && dist > 0) {
          const s = ((1 - dist / RADIUS) * MAX_SHIFT) / dist;
          el.style.transform = `translate(${dx * s}px, ${dy * s}px)`;
        } else {
          el.style.transform = "";
        }
      });
    });

    hero.addEventListener("mouseleave", () => {
      decorations.forEach((el) => {
        el.style.transform = "";
      });
    });
  }, totalAnimMs);
});

// =====================
// Contact Form (Web3Forms)
// =====================
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  function showFormMessage(text, type) {
    const existing = contactForm.querySelector(".form-message");
    if (existing) existing.remove();

    const msg = document.createElement("div");
    msg.className = `form-message form-message-${type}`;
    msg.textContent = text;

    contactForm.appendChild(msg);

    setTimeout(() => {
      msg.remove();
    }, 5000);
  }

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const subject = document.getElementById("contactSubject").value;
    const message = document.getElementById("contactMessage").value.trim();

    if (!name || !email || !subject || !message) {
      showFormMessage("Please fill in all fields.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      showFormMessage("Please enter a valid email address.", "error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const formData = {
      access_key: "6c803d2e-b85e-44f2-9a8f-a7d795b4ffb8",
      name,
      email,
      subject,
      message,
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        showFormMessage(
          "Message sent successfully! We'll get back to you soon.",
          "success"
        );

        contactForm.reset();
      } else {
        showFormMessage(
          result.message || "Failed to send message.",
          "error"
        );
      }
    } catch (error) {
      showFormMessage(
        "Network error. Please try again later.",
        "error"
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}
