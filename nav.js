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
