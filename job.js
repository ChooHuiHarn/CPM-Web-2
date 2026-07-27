/*==================================================
        Job Page
        Part 1
==================================================*/

/*------------------------------------
Google Apps Script URL
------------------------------------*/

const API_URL =
  "https://script.google.com/macros/s/AKfycbxQBx4JvjiaqWRjl_Uq86z-kfxSgsB4wLbRgEZOonNf6yczHxkBlSA50Zx_1lqpMKHt/exec";

/*------------------------------------
Personality Descriptions (local)
These are used in the "Does this job
match me?" section so they always
load instantly, without depending on
the API returning description fields.
------------------------------------*/

const descriptions = {
  R: "You enjoy practical, hands-on activities and solving real-world problems.",
  I: "You enjoy analysing, researching, and discovering new ideas.",
  A: "You enjoy expressing yourself through creativity and imagination.",
  S: "You enjoy helping, teaching, and working with other people.",
  E: "You enjoy leading, persuading, and managing people or projects.",
  C: "You enjoy organising, planning, and working with structure.",
};

/*------------------------------------
Read Job ID
Example:
job.html?id=accountant
------------------------------------*/

const params = new URLSearchParams(window.location.search);

const jobID = params.get("id");

/*------------------------------------
HTML Elements
------------------------------------*/

// FIX: was "hero-image" — the <img> in job.html is id="job-image"
const heroImage = document.getElementById("job-image");

const jobTitle = document.getElementById("job-title");

const jobDescription = document.getElementById("job-description");

// FIX: job.html doesn't have individual personality-1/2 elements,
// just one container that JS is meant to fill in.
const personalityContainer = document.getElementById(
  "personality-container",
);

const salaryStart = document.getElementById("salary-start");

const salaryEnd = document.getElementById("salary-end");

// FIX: was "career-pathway" — the container div in job.html is id="pathway"
const pathway = document.getElementById("pathway");

// FIX: was "schools-list" — the <ul> in job.html is id="school-list"
const schoolsList = document.getElementById("school-list");

const startNow = document.getElementById("start-now");

/*------------------------------------
Load Job
------------------------------------*/

window.addEventListener("DOMContentLoaded", loadJob);

/*------------------------------------
Fetch Job Data
------------------------------------*/

const pageLoader = document.getElementById("page-loader");

function hideLoader() {
  if (pageLoader) pageLoader.classList.add("hidden");
}

async function loadJob() {
  if (!jobID) {
    hideLoader();
    jobTitle.textContent = "Job Not Found";
    jobDescription.textContent = "No job ID was provided in the URL.";
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}?action=job&id=${jobID}`,
    );

    const data = await response.json();

    if (data.error) {
      hideLoader();
      jobTitle.textContent = "Job Not Found";
      jobDescription.textContent = data.error;
      return;
    }

    displayJob(data);
    hideLoader();
  } catch (error) {
    console.error(error);
    hideLoader();
    jobTitle.textContent = "Error";
    jobDescription.textContent =
      "Could not load job data. Please try again later.";
  }
}

/*------------------------------------
Display Job
------------------------------------*/

function displayJob(data) {
  /* Banner */

  heroImage.src = data.image;

  heroImage.alt = data.title;

  jobTitle.textContent = data.title;

  jobDescription.textContent = data.shortDescription;

  /* Personality */

  // FIX: build the two personality entries into the single
  // container instead of targeting elements that don't exist.
  // Use local descriptions so they always show — the API does
  // not return primaryDescription / secondaryDescription fields.
  personalityContainer.innerHTML = `
    <div class="personality-tag">
      <h3>${personalityName(data.primary)}</h3>
      <p>${descriptions[data.primary] || data.primaryDescription || "Description not available."}</p>
    </div>
    <div class="personality-tag">
      <h3>${personalityName(data.secondary)}</h3>
      <p>${descriptions[data.secondary] || data.secondaryDescription || "Description not available."}</p>
    </div>
  `;

  /* Salary */

  salaryStart.textContent = data.salaryStart;

  salaryEnd.textContent = data.salaryEnd;

  /* Pathway */

  pathway.innerHTML = createPathway(data.pathway);

  /* Start Now */

  startNow.textContent = data.startNow;

  /* Suggested Schools */

  schoolsList.innerHTML = "";

  if (data.schools && data.schools.length > 0) {
    data.schools.forEach((school) => {
      const li = document.createElement("li");

      li.textContent = school;

      schoolsList.appendChild(li);
    });
  } else {
    schoolsList.innerHTML = "<li>No schools listed yet.</li>";
  }

  /* Job Knowledge Quiz */

  // FIX: this was never called, so the quiz section stayed empty.
  loadQuiz(data.quiz);

  /* Related Jobs */

  // FIX: this was never called either.
  loadRelatedJobs(data.relatedJobs);
}

/*------------------------------------
Convert Personality Letter
------------------------------------*/

function personalityName(letter) {
  switch (letter) {
    case "R":
      return "Realistic";

    case "I":
      return "Investigative";

    case "A":
      return "Artistic";

    case "S":
      return "Social";

    case "E":
      return "Enterprising";

    case "C":
      return "Conventional";

    default:
      return letter || "Unknown";
  }
}

/*------------------------------------
Create Pathway
Example:

SPM
↓
Degree
↓
Master
------------------------------------*/

function createPathway(path) {
  if (!path) return "<p>Pathway information not available.</p>";

  // FIX: API returns → (Unicode arrow U+2192), not > (ASCII)
  const items = path.split("→");

  let html = "";

  items.forEach((step, index) => {
    const text = step.trim();
    if (text) {
      html += `<div>${text}</div>`;

      if (index < items.length - 1) {
        html += `<div class="pathway-arrow">↓</div>`;
      }
    }
  });

  return html;
}

/*==================================================
        Job Page
        Part 2
        Job Knowledge Quiz
==================================================*/

/*------------------------------------
Quiz Elements
------------------------------------*/

const quizQuestion = document.getElementById("quiz-question");

const quizOptions = document.getElementById("quiz-options");

const quizProgress = document.getElementById("quiz-progress");

const quizProgressFill = document.getElementById("quiz-progress-fill");

const quizNext = document.getElementById("quiz-next");

/*------------------------------------
Quiz Variables
------------------------------------*/

let quizData = [];

let currentQuiz = 0;

let selectedAnswer = null;

let score = 0;

/*------------------------------------
Start Quiz
------------------------------------*/

function loadQuiz(questions) {
  quizData = questions;

  currentQuiz = 0;

  score = 0;

  if (!quizData || quizData.length === 0) {
    quizQuestion.textContent = "No quiz available for this job yet.";

    quizOptions.innerHTML = "";

    quizProgress.textContent = "";

    quizProgressFill.style.width = "0%";

    quizNext.style.display = "none";

    return;
  }

  quizNext.style.display = "";

  showQuizQuestion();
}

/*------------------------------------
Display Question
------------------------------------*/

function showQuizQuestion() {
  selectedAnswer = null;

  const question = quizData[currentQuiz];

  quizQuestion.textContent = question.question;

  quizOptions.innerHTML = "";

  const options = [
    question.option1,

    question.option2,
  ];

  options.forEach((option) => {
    const button = document.createElement("button");

    button.textContent =
      typeof option === "boolean"
        ? option ? "True" : "False"
        : option;

    button.className = "quiz-option";

    button.addEventListener("click", () => {
      document
        .querySelectorAll(".quiz-option")
        .forEach((btn) => {
          btn.classList.remove("selected");
        });

      button.classList.add("selected");

      selectedAnswer = option;
    });

    quizOptions.appendChild(button);
  });

  updateQuizProgress();
}

/*------------------------------------
Progress Bar
------------------------------------*/

function updateQuizProgress() {
  quizProgress.textContent = `Question ${currentQuiz + 1} / ${quizData.length}`;

  quizProgressFill.style.width = ((currentQuiz + 1) / quizData.length) * 100 +
    "%";
}

/*------------------------------------
Next Button
------------------------------------*/

quizNext.addEventListener("click", () => {
  if (selectedAnswer === null) {
    alert("Please choose an answer.");

    return;
  }

  if (
    selectedAnswer ===
      quizData[currentQuiz].correct
  ) {
    score++;
  }

  currentQuiz++;

  if (currentQuiz < quizData.length) {
    showQuizQuestion();
  } else {
    finishQuiz();
  }
});

/*------------------------------------
Quiz Finished
------------------------------------*/

function finishQuiz() {
  quizQuestion.textContent = `You scored ${score} / ${quizData.length}!`;

  quizOptions.innerHTML = "";

  quizProgress.textContent = "Completed";

  quizProgressFill.style.width = "100%";

  const button = document.createElement("button");

  button.className = "quiz-option";

  button.textContent = "Try Again";

  button.addEventListener("click", () => {
    loadQuiz(quizData);
  });

  quizOptions.appendChild(button);
}
/*==================================================
        Job Page
        Part 3
        Related Jobs
==================================================*/

/*------------------------------------
HTML Elements
------------------------------------*/

const relatedJobsContainer = document.getElementById("related-jobs");

/*------------------------------------
Load Related Jobs
------------------------------------*/

function loadRelatedJobs(jobs) {
  relatedJobsContainer.innerHTML = "";

  if (!jobs || jobs.length === 0) {
    relatedJobsContainer.innerHTML = "<p>No related careers found.</p>";

    return;
  }

  jobs.forEach((job) => {
    const card = createRelatedCard(job);

    relatedJobsContainer.appendChild(card);
  });
}

/*------------------------------------
Create Card
------------------------------------*/

function createRelatedCard(job) {
  const card = document.createElement("div");

  card.className = "job-card";

  card.innerHTML = `

        <img
            src="${job.image}"
            alt="${job.title}"
        >

        <div class="job-card-content">

            <h3>${job.title}</h3>

            <p>${job.description}</p>

            <button
                class="learn-more-btn"
            >

                Learn More →

            </button>

        </div>

    `;

  card
    .querySelector(".learn-more-btn")
    .addEventListener("click", () => {
      window.location.href = `job.html?id=${job.id}`;
    });

  return card;
}

/*------------------------------------
Carousel Arrows
------------------------------------*/

const previousRelated = document.getElementById("previous-related");

const nextRelated = document.getElementById("next-related");

const CARD_SCROLL = 320; /* card width (300px) + gap (20px) */

if (previousRelated) {
  previousRelated.addEventListener("click", () => {
    relatedJobsContainer.scrollBy({ left: -CARD_SCROLL, behavior: "smooth" });
  });
}

if (nextRelated) {
  nextRelated.addEventListener("click", () => {
    relatedJobsContainer.scrollBy({ left: CARD_SCROLL, behavior: "smooth" });
  });
}
