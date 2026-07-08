function showSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "flex";
}

function hideSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "none";
}

// Dark/Light Theme Switching Logic with 180° spin animation
const themeToggleBtn = document.querySelector(".theme-toggle");
const themeIcon = document.getElementById("theme-icon");

function toggleTheme() {
  // Add the rotation class to execute the CSS spin transformation
  themeToggleBtn.classList.add("flip");

  // Swap asset images exactly halfway through the 180-degree turn
  setTimeout(() => {
    if (document.body.classList.contains("dark-theme")) {
      document.body.classList.remove("dark-theme");
      themeIcon.src = "sun.webp";
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.add("dark-theme");
      themeIcon.src = "moon.webp";
      localStorage.setItem("theme", "dark");
    }
  }, 200); // 200ms is exactly halfway through the 0.4s CSS transition

  // Reset the rotation class after completion so it can be spun again on next click
  setTimeout(() => {
    themeToggleBtn.classList.remove("flip");
  }, 400);
}

// Check local storage setting when window loads up
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    themeIcon.src = "moon.webp";
  } else {
    document.body.classList.remove("dark-theme");
    themeIcon.src = "sun.webp";
  }
});
