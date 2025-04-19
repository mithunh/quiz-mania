const quizData = {
  categories: [
    {
      id: "javascript",
      name: "JavaScript Basics",
      questions: [
        {
          question: "What does 'var' declare?",
          options: ["A function", "A constant", "A variable", "An object"],
          answer: 2,
        },
        {
          question: "Which method converts JSON to an object?",
          options: [
            "JSON.parse()",
            "JSON.stringify()",
            "JSON.convert()",
            "JSON.objectify()",
          ],
          answer: 0,
        },
      ],
    },
    {
      id: "react",
      name: "React Basics",
      questions: [
        {
          question: "What hook is used for side-effects?",
          options: ["useState", "useEffect", "useMemo", "useRef"],
          answer: 1,
        },
        {
          question: "JSX stands for?",
          options: [
            "JavaScript XML",
            "JavaScript Extension",
            "Java Syntax Extra",
            "None of these",
          ],
          answer: 0,
        },
      ],
    },
  ],
};

let currentCategory = null;
let currentQuestionIndex = 0;
let score = 0;
let unanswered = 0;
let timer;
let timeLeft = 10;
let userSelectedIndex = null;
let selectedCategoryId = null;
let username = "";

// DOM refs
const nameInput = document.getElementById("username-input");
const categoryButtons = document.querySelectorAll("#category-buttons button");
const startQuizBtn = document.getElementById("start-quiz-btn");
const categoryScreen = document.getElementById("category-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const categoryTitle = document.getElementById("category-title");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const timeLeftDisplay = document.getElementById("time-left");
const nextBtn = document.getElementById("next-btn");
const skipBtn = document.getElementById("skip-btn");
const scoreText = document.getElementById("score-text");
const feedback = document.getElementById("feedback");

// Enable Start when both name & category selected
function updateStartButtonState() {
  startQuizBtn.disabled = !(nameInput.value.trim() && selectedCategoryId);
}
nameInput.addEventListener("input", updateStartButtonState);
document.querySelectorAll('input[name="category"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    selectedCategoryId = radio.value;
    updateStartButtonState();
  });
});

startQuizBtn.addEventListener("click", () => {
  username = nameInput.value.trim();
  startQuiz(selectedCategoryId);
});

// Start quiz
function startQuiz(categoryId) {
  currentCategory = quizData.categories.find((c) => c.id === categoryId);
  currentQuestionIndex = 0;
  score = 0;
  unanswered = 0;
  categoryScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  categoryTitle.textContent = `Hello, ${username}! — ${currentCategory.name}`;
  loadQuestion();
}

// Load question
function loadQuestion() {
  resetState();
  const q = currentCategory.questions[currentQuestionIndex];
  questionText.textContent = q.question;
  q.options.forEach((opt, idx) => {
    const wrapper = document.createElement("div");
    wrapper.className = "flex items-center gap-2";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "option";
    radio.id = `option-${idx}`;
    radio.value = idx;
    radio.className = "peer hidden";

    const label = document.createElement("label");
    label.setAttribute("for", `option-${idx}`);
    label.textContent = opt;
    label.className =
      "peer-checked:ring-2 peer-checked:ring-blue-500 option-btn py-2 px-4 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer w-full";

    radio.addEventListener("change", () => {
      userSelectedIndex = parseInt(radio.value);
      nextBtn.disabled = false;
    });

    wrapper.appendChild(radio);
    wrapper.appendChild(label);
    optionsContainer.appendChild(wrapper);
  });

  nextBtn.disabled = true;
  skipBtn.disabled = false;
  startTimer();
}

// Select answer
function selectAnswer(idx, btn) {
  userSelectedIndex = idx;
  optionsContainer
    .querySelectorAll(".option-btn")
    .forEach((b) => b.classList.remove("selected"));
  btn.classList.add("selected");
  nextBtn.disabled = false;
}

// Next & Skip
nextBtn.addEventListener("click", () => {
  clearInterval(timer);
  const correct = currentCategory.questions[currentQuestionIndex].answer;
  if (userSelectedIndex === correct) score++;
  goToNext();
});
skipBtn.addEventListener("click", () => {
  clearInterval(timer);
  unanswered++;
  goToNext();
});
function goToNext() {
  currentQuestionIndex++;
  if (currentQuestionIndex < currentCategory.questions.length) loadQuestion();
  else showResult();
}

// Timer & reset
function resetState() {
  optionsContainer.innerHTML = "";
  timeLeft = 10;
  timeLeftDisplay.textContent = timeLeft;
  userSelectedIndex = null;
}
function startTimer() {
  timeLeftDisplay.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timeLeftDisplay.textContent = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timer);
      unanswered++;
      goToNext();
    }
  }, 1000);
}

// Show results
function showResult() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  scoreText.textContent = `${username}, you got ${score} / ${currentCategory.questions.length} correct.`;

  // Assign the appropriate class based on the score
  const feedbackClass =
    score === currentCategory.questions.length
      ? "good-feedback" // class for great job
      : score >= currentCategory.questions.length / 2
      ? "average-feedback" // class for good attempt
      : "bad-feedback"; // class for keep practicing

  // Set the feedback message dynamically using the ID
  const feedback = document.getElementById("feedback");
  feedback.textContent =
    score === currentCategory.questions.length
      ? "🎉 Great job!"
      : score >= currentCategory.questions.length / 2
      ? "👍 Good attempt!"
      : "💡 Keep practicing!";

  // Dynamically add the class to the result-screen element
  resultScreen.classList.add(feedbackClass); // Add the class directly to #result-screen
}
