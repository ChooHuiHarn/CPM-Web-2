
const API_URL =
  "https://script.google.com/macros/s/AKfycbxQBx4JvjiaqWRjl_Uq86z-kfxSgsB4wLbRgEZOonNf6yczHxkBlSA50Zx_1lqpMKHt/exec";

const TYPES = ["R", "I", "A", "S", "E", "C"];


const jobsGrid    = document.getElementById("jobs-grid");
const jobsLoader  = document.getElementById("jobs-loader");
const noResults   = document.getElementById("no-results");
const searchInput = document.getElementById("search-input");


let allJobs = [];


window.addEventListener("DOMContentLoaded", fetchAllJobs);


async function fetchAllJobs() {
  try {
    const responses = await Promise.all(
      TYPES.map((t) =>
        fetch(`${API_URL}?action=results&primary=${t}&secondary=R`)
          .then((r) => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
          .catch(() => ({ topMatches: [], otherJobs: [] }))
      )
    );

    const seen = new Set();
    const jobs = [];

    responses.forEach((data) => {
      const batch = [
        ...(data.topMatches || []),
        ...(data.otherJobs  || []),
      ];
      batch.forEach((job) => {
        if (job.id && !seen.has(job.id)) {
          seen.add(job.id);
          jobs.push(job);
        }
      });
    });

    jobs.sort((a, b) => (a.title || "").localeCompare(b.title || ""));

    allJobs = jobs;
    renderGrid(allJobs);
  } catch (err) {
    console.error(err);
    jobsLoader.innerHTML =
      `<p style="color:var(--text);opacity:.7">Could not load careers — please try again later.</p>`;
  }
}


const template = document.getElementById("job-card-template");

function renderGrid(jobs) {
  jobsLoader.classList.add("hidden");
  jobsGrid.innerHTML = "";

  if (jobs.length === 0) {
    noResults.classList.remove("hidden");
    return;
  }
  noResults.classList.add("hidden");

  jobs.forEach((job) => {
    const clone = template.content.cloneNode(true);
    const card  = clone.querySelector(".jb-card");

    const img = clone.querySelector(".jb-card-image img");
    if (job.image) {
      img.src = job.image;
    } else {
      img.src = `img/${job.id}.png`;
    }
    img.alt = job.title || "";
    img.onerror = () => { img.style.display = "none"; };

    clone.querySelector(".jb-card-title").textContent =
      job.title || "";
    clone.querySelector(".jb-card-desc").textContent  =
      job.description || job.shortDescription || "";

    const btn = clone.querySelector(".jb-learn-more");
    btn.addEventListener("click", () => {
      window.location.href = `job.html#${job.id}`;
    });

    card.addEventListener("click", (e) => {
      if (e.target.closest(".jb-learn-more")) return;
      window.location.href = `job.html#${job.id}`;
    });

    jobsGrid.appendChild(clone);
  });
}


searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();

  if (!q) {
    renderGrid(allJobs);
    return;
  }

  const filtered = allJobs.filter(
    (job) =>
      (job.title       || "").toLowerCase().includes(q) ||
      (job.description || "").toLowerCase().includes(q)
  );

  renderGrid(filtered);
});
