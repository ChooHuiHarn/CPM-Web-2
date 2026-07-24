const API_URL =
  "https://script.google.com/macros/s/AKfycbzsb-VLM7taaypQRg39awukXG2am7MbbvKmpc3Z5VpkxJ2Yq58iN9VQ3vJsQxqo0SACCw/exec";
 
const quiz = [
  {
    question: "Which do you like to do most?",
    answers: [
      { text: "Organising the plan for an outing", type: "C" },
      { text: "Building things", type: "R" },
      { text: "Resolving conflicts between people", type: "S" },
      { text: "Researching topics of interest", type: "I" },
      { text: "Being in charge of a group", type: "E" },
      { text: "Drawing and painting", type: "A" },
    ],
  },
 
  {
    question: "Which do you like to do most?",
    answers: [
      { text: "Reading, writing, and wordplay", type: "A" },
      { text: "Keeping a journal or daily planner", type: "C" },
      { text: "Taking care of animals", type: "R" },
      { text: "Meeting and getting to know people", type: "S" },
      { text: "Organising an event", type: "E" },
      { text: "Watching documentaries and science videos", type: "I" },
    ],
  },
 
  {
    question: "Which do you like to do most?",
    answers: [
      { text: "Solving puzzles or mysteries", type: "I" },
      { text: "Playing musical instruments", type: "A" },
      { text: "Learning a new language", type: "C" },
      { text: "Making sure those around me are okay", type: "S" },
      { text: "Negotiating and making deals", type: "E" },
      { text: "Exploring nature and being outdoors", type: "R" },
    ],
  },
 
  {
    question: "Which do you like to do most?",
    answers: [
      { text: "Taking and editing pictures", type: "A" },
      { text: "Public speaking and debate", type: "E" },
      { text: "Fixing and taking things apart", type: "R" },
      { text: "Volunteering with a charity", type: "S" },
      { text: "Solving maths equations", type: "I" },
      { text: "Conducting recipe-based cooking", type: "C" },
    ],
  },
 
  {
    question: "Which do you like to do most?",
    answers: [
      { text: "Acting, performing, or dancing", type: "A" },
      { text: "Fighting for a cause", type: "E" },
      { text: "Understanding how people behave", type: "I" },
      { text: "Working with a group", type: "S" },
      { text: "Managing money", type: "C" },
      { text: "Playing sports or working out", type: "R" },
    ],
  },
 
  {
    question: "Which do you like to do most?",
    answers: [
      { text: "Playing board games or card games", type: "C" },
      { text: "Hanging out with people online", type: "S" },
      { text: "Running or managing a business", type: "E" },
      { text: "Doing DIY projects", type: "R" },
      { text: "Designing or crafting", type: "A" },
      { text: "Conducting experiments", type: "I" },
    ],
  },
 
  {
    question: "Which do you like to do most?",
    answers: [
      { text: "Gardening or working on a farm", type: "R" },
      { text: "Teaching or guiding others", type: "S" },
      { text: "Exploring coding and programming", type: "I" },
      { text: "Being a school club committee", type: "E" },
      { text: "Organising and arranging stuff", type: "C" },
      { text: "Making films or videos", type: "A" },
    ],
  },
];
 
/*-------------------------------------
Personality Descriptions
-------------------------------------*/
 
const descriptions = {
  R: "You enjoy practical, hands-on activities and solving real-world problems.",
 
  I: "You enjoy analysing, researching, and discovering new ideas.",
 
  A: "You enjoy expressing yourself through creativity and imagination.",
 
  S: "You enjoy helping, teaching, and working with other people.",
 
  E: "You enjoy leading, persuading, and managing people or projects.",
 
  C: "You enjoy organising, planning, and working with structure.",
};
 
/* Score Object */
 
let scores = {
  R: 0,
  I: 0,
  A: 0,
  S: 0,
  E: 0,
  C: 0,
};
let currentQuestion = 0;
let selectedAnswer = null;
 
/* Elements */
 
const landingPage = document.getElementById("landing-page");
const quizPage = document.getElementById("quiz-page");
const resultPage = document.getElementById("result-page");
 
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
 
const question = document.getElementById("question");
const answers = document.getElementById("answers");
 
const progress = document.getElementById("progress");
const progressText = document.getElementById("progress-text");
 
const primaryName = document.getElementById("primary-name");
 
const secondaryName = document.getElementById("secondary-name");
 
const primaryDescription = document.getElementById("primary-description");
 
const secondaryDescription = document.getElementById("secondary-description");
 
const topMatches = document.getElementById("top-matches");
 
const otherJobsList = document.getElementById("other-jobs-list");
 
/* Quiz*/
 
startBtn.addEventListener("click", () => {
  landingPage.classList.remove("active");
  quizPage.classList.add("active");
 
  loadQuestion();
});
 
/* Load Question */
 
function loadQuestion() {
  selectedAnswer = null;
 
  question.textContent = quiz[currentQuestion].question;
 
  answers.innerHTML = "";
 
  quiz[currentQuestion].answers.forEach((answer) => {
    const button = document.createElement("button");
 
    button.classList.add("answer-btn");
 
    button.textContent = answer.text;
 
    button.addEventListener("click", () => {
      document.querySelectorAll(".answer-btn").forEach((btn) => {
        btn.classList.remove("selected");
      });
 
      button.classList.add("selected");
 
      selectedAnswer = answer.type;
    });
 
    answers.appendChild(button);
  });
 
  updateProgress();
}
 
/* Progress Bar */
 
function updateProgress() {
  const percentage = ((currentQuestion + 1) / quiz.length) * 100;
 
  progress.style.width = percentage + "%";
 
  progressText.textContent = `Question ${currentQuestion + 1} / ${quiz.length}`;
}
 

/* Next Button */
 
nextBtn.addEventListener("click", () => {
  if (selectedAnswer === null) {
    alert("Please select an answer before continuing.");
 
    return;
  }
  scores[selectedAnswer]++;

  currentQuestion++;
 
  if (currentQuestion < quiz.length) {
    loadQuestion();
  } 
  else {
    showResults();
  }
});
 
/* Show Results */
 
function showResults() {
  quizPage.classList.remove("active");
  resultPage.classList.add("active");
 
  const ranking = Object.entries(scores)
    .sort((a, b) => b[1] - a[1]);
 
  const primary = ranking[0][0];
  const secondary = ranking[1][0];
 
  loadCareerResults(primary, secondary);
}
  
function personalityNames(letter) {
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
      return "";
  }
}
 
/* Reset */
 
restartBtn.addEventListener("click", () => {
  localStorage.removeItem("careerResults");
 
  scores = {
    R: 0,
    I: 0,
    A: 0,
    S: 0,
    E: 0,
    C: 0,
  };
 
  currentQuestion = 0;
  selectedAnswer = null;
 
  resultPage.classList.remove("active");
  quizPage.classList.remove("active");
  landingPage.classList.add("active");
});
/* Career Results */
function renderResults(data) {
  primaryName.textContent = personalityNames(data.primary);
 
  secondaryName.textContent = personalityNames(data.secondary);
 
  primaryDescription.textContent = data.primaryDescription;
  secondaryDescription.textContent = data.secondaryDescription;
 
  topMatches.innerHTML = "";
 
  otherJobsList.innerHTML = "";
 
  displayTopMatches(data.topMatches);
 
  displayOtherJobs(data.otherJobs);
 
  const heading = document.querySelector(".other-jobs h2");
 
  heading.textContent = `Other ${personalityNames(data.primary)} Careers`;
}
 
function displayTopMatches(jobs) {
  topMatches.innerHTML = "";
 
  jobs.forEach((job, index) => {
    const card = document.createElement("div");
 
    card.className = "career-card top-match";
 
    card.innerHTML = `
 
            <div class="career-info">
 
                <h3>${job.title}</h3>
 
                <p>${job.description}</p>
 
                <span class="badge">
 
                  ${
      index === 0
        ? "Top Match"
        : index === 1
        ? "Top Match"
        : "Top Match"
    }
 
</span>
 
            </div>
 
            <button
                class="learn-more-btn"
                data-link="${job.link}"
            >
 
                Learn More →
 
            </button>
 
        `;
 
    card
      .querySelector(".learn-more-btn")
      .addEventListener("click", () => {
        window.location.href = `job.html?id=${job.id}`;
      });
 
    topMatches.appendChild(card);
  });
}
 
function displayOtherJobs(jobs) {
  otherJobsList.innerHTML = "";
 
  jobs.forEach((job, index) => {
    const card = document.createElement("div");
 
    card.className = "career-card";
 
    card.innerHTML = `
 
            <div class="career-info">
 
                <h3>${job.title}</h3>
 
                <p>${job.description}</p>
 
            </div>
 
            <button
                class="learn-more-btn"
                data-link="${job.link}"
            >
 
                Learn More →
 
            </button>
 
        `;
 
    card
      .querySelector(".learn-more-btn")
      .addEventListener("click", () => {
        window.location.href = job.link;
      });
 
    otherJobsList.appendChild(card);
  });
}
window.addEventListener("load", () => {
  const saved = localStorage.getItem("careerResults");
 
  if (!saved) return;
 
  const data = JSON.parse(saved);
 
  landingPage.classList.remove("active");
  quizPage.classList.remove("active");
  resultPage.classList.add("active");
 
  renderResults(data);
  currentQuestion = 0;
  selectedAnswer = null;
});
 
async function loadCareerResults(primary, secondary) {
  try {
    const response = await fetch(
      `${API_URL}?primary=${primary}&secondary=${secondary}`,
    );
 
    if (!response.ok) {
      throw new Error("Failed to fetch career data.");
    }
 
    const data = await response.json();
 
    data.primary = primary;
    data.secondary = secondary;

    data.primaryDescription = descriptions[primary];
    data.secondaryDescription = descriptions[secondary];
 
    localStorage.setItem(
      "careerResults",
      JSON.stringify(data),
    );
 
    renderResults(data);
  } catch (error) {
    console.error(error);
 
    topMatches.innerHTML = `
    <div class="career-card">
        <h3>Unable to load careers.</h3>
        <p>Please try again later.</p>
    </div>
`;
 
    otherJobsList.innerHTML = "";
  }
}
