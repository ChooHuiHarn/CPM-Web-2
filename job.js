

const API_URL =
  "https://script.google.com/macros/s/AKfycbxQBx4JvjiaqWRjl_Uq86z-kfxSgsB4wLbRgEZOonNf6yczHxkBlSA50Zx_1lqpMKHt/exec";


const descriptions = {
  R: "You enjoy practical, hands-on activities and solving real-world problems.",
  I: "You enjoy analysing, researching, and discovering new ideas.",
  A: "You enjoy expressing yourself through creativity and imagination.",
  S: "You enjoy helping, teaching, and working with other people.",
  E: "You enjoy leading, persuading, and managing people or projects.",
  C: "You enjoy organising, planning, and working with structure.",
};

const heroImage = document.getElementById("job-image");

const jobTitle = document.getElementById("job-title");

const jobDescription = document.getElementById("job-description");

const personalityContainer = document.getElementById(
  "personality-container",
);

const salaryStart = document.getElementById("salary-start");

const salaryEnd = document.getElementById("salary-end");

const pathway = document.getElementById("pathway");

const schoolsList = document.getElementById("school-list");

const startNow = document.getElementById("start-now");


window.addEventListener("DOMContentLoaded", loadJob);
window.addEventListener("hashchange", loadJob);

const pageLoader = document.getElementById("page-loader");

function hideLoader() {
  if (pageLoader) pageLoader.classList.add("hidden");
}

async function loadJob() {
  const jobID = window.location.hash.slice(1) || null;

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (!jobID) {
    hideLoader();
    jobTitle.textContent = "Job Not Found";
    jobDescription.textContent = "No job ID was provided in the URL.";
    return;
  }

  if (pageLoader) pageLoader.classList.remove("hidden");

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


function displayJob(data) {

  heroImage.src = data.image;

  heroImage.alt = data.title;

  jobTitle.textContent = data.title;

  jobDescription.textContent = data.shortDescription;

  /* Personality */

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

  loadQuiz(data.quiz);

  /* Related Jobs */
  loadRelatedJobs(data.relatedJobs);
}


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


function createPathway(path) {
  if (!path) return "<p>Pathway information not available.</p>";

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

const quizQuestion = document.getElementById("quiz-question");

const quizOptions = document.getElementById("quiz-options");

const quizProgress = document.getElementById("quiz-progress");

const quizProgressFill = document.getElementById("quiz-progress-fill");

const quizNext = document.getElementById("quiz-next");



let quizData = [];

let currentQuiz = 0;

let selectedAnswer = null;

let score = 0;


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


function updateQuizProgress() {
  quizProgress.textContent = `Question ${currentQuiz + 1} / ${quizData.length}`;

  quizProgressFill.style.width = ((currentQuiz + 1) / quizData.length) * 100 +
    "%";
}

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


function finishQuiz() {
  quizQuestion.textContent = `You scored ${score} / ${quizData.length}!`;

  quizOptions.innerHTML = "";

  quizProgress.textContent = "Completed";

  quizProgressFill.style.width = "100%";

  quizNext.style.display = "none";

  const button = document.createElement("button");

  button.className = "quiz-option";

  button.textContent = "Try Again";

  button.addEventListener("click", () => {
    loadQuiz(quizData);
  });

  quizOptions.appendChild(button);
}

const relatedJobsContainer = document.getElementById("related-jobs");


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
      window.location.href = `job.html#${job.id}`;
    });

  return card;
}

const previousRelated = document.getElementById("previous-related");

const nextRelated = document.getElementById("next-related");

const CARD_SCROLL = 320; 

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
