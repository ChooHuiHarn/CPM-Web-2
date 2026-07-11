(function () {
  const navEl = document.querySelector("nav");
  if (!navEl) return;

  let isHovering = false;
  let hideTimer = null;
  const HIDE_DELAY = 1200;
  
  const isMobile = () => window.innerWidth <= 800;

  function showNav() {
    navEl.classList.remove("nav-hidden");
  }

  function scheduleHide() {
    clearTimeout(hideTimer);

    if (isMobile()) {
      showNav();
      return;
    }

    hideTimer = setTimeout(() => {
      if (!isHovering) {
        navEl.classList.add("nav-hidden");
      }
    }, HIDE_DELAY);
  }

  window.addEventListener(
    "scroll",
    () => {
      showNav();
      scheduleHide();
    },
    { passive: true },
  );

  navEl.addEventListener("mouseenter", () => {
    if (isMobile()) return;
    isHovering = true;
    clearTimeout(hideTimer);
    showNav();
  });

  navEl.addEventListener("mouseleave", () => {
    if (isMobile()) return;
    isHovering = false;
    scheduleHide();
  });

  const HOVER_ZONE_HEIGHT = 12; 
  document.addEventListener(
    "mousemove",
    (e) => {
      if (isMobile()) return;

      if (e.clientY <= navEl.offsetHeight + HOVER_ZONE_HEIGHT) {
        isHovering = true;
        clearTimeout(hideTimer);
        showNav();
      } else if (isHovering) {
        isHovering = false;
        scheduleHide();
      }
    },
    { passive: true },
  );

  navEl.addEventListener("touchstart", () => {
    if (isMobile()) return;
    isHovering = true;
    clearTimeout(hideTimer);
    showNav();
  });

  if (isMobile()) {
    showNav();
  } else {
    scheduleHide();
  }
})();

function showSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "flex";
}

function hideSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "none";
}

const themeToggleBtn = document.querySelector(".theme-toggle");
const themeIcon = document.getElementById("theme-icon");

function toggleTheme() {
  themeToggleBtn.classList.add("flip");

  setTimeout(() => {
    if (document.body.classList.contains("dark-theme")) {
      document.body.classList.remove("dark-theme");
      themeIcon.src = "img/sun.png";
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.add("dark-theme");
      themeIcon.src = "img/moon.png";
      localStorage.setItem("theme", "dark");
    }
  }, 200);

  setTimeout(() => {
    themeToggleBtn.classList.remove("flip");
  }, 400);
}

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    themeIcon.src = "img/moon.png";
  } else {
    document.body.classList.remove("dark-theme");
    themeIcon.src = "img/sun.png";
  }
});
