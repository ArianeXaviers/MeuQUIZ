// Quiz - main logic

// ============================================
// QUESTIONS — edit here to change the quiz
// ============================================
// Each question has:
//   statement    -> the question text
//   alternatives -> list of answers (3, 4, 5... whatever)
//   correct      -> index of the correct answer (0 = first, 1 = second, ...)
const questions = [
    {
        statement: "Pergunta de exemplo 1?",
        alternatives: [
            "Alternativa A",
            "Alternativa B",
            "Alternativa C"
        ],
        correct: 0
    },
    {
        statement: "Pergunta de exemplo 2?",
        alternatives: [
            "Alternativa A",
            "Alternativa B",
            "Alternativa C",
            "Alternativa D"
        ],
        correct: 2
    },
    {
        statement: "Pergunta de exemplo 3?",
        alternatives: [
            "Alternativa A",
            "Alternativa B",
            "Alternativa C"
        ],
        correct: 1
    }
];

const bau = ['1', '2']
// ============================================
// DOM ELEMENTS
// ============================================

// Screens
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");

// Buttons
const playButton = document.getElementById("play-button");
const nextButton = document.getElementById("next-button");
const restartButton = document.getElementById("restart-button");

// Quiz UI
const currentQuestionEl = document.getElementById("current-question");
const totalQuestionsEl = document.getElementById("total-questions");
const progressBar = document.getElementById("progress-bar");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers");

// Results UI
const resultNumber = document.getElementById("result-number");
const resultHits = document.getElementById("result-hits");
const resultTotal = document.getElementById("result-total");
const kpiHits = document.getElementById("kpi-hits");
const kpiMisses = document.getElementById("kpi-misses");
const kpiScore = document.getElementById("kpi-score");

// ============================================
// STATE
// ============================================
let currentQuestion = 0;       // index in `questions`
let hits = 0;                  // correct answers count
let selectedAnswer = null;     // index of clicked alternative or null
let userAnswers = [];          // user's selected index per question
let isReviewMode = false;      // true when showing the answer key

// ============================================
// FLOW
// ============================================
function startQuiz() {
    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    renderQuestion();
}

function renderQuestion() {
    const question = questions[currentQuestion];

    // counter + progress bar
    currentQuestionEl.textContent = currentQuestion + 1;
    totalQuestionsEl.textContent = questions.length;
    progressBar.style.width = ((currentQuestion + 1) / questions.length) * 100 + "%";

    // statement
    questionText.textContent = question.statement;

    // alternatives — clear and rebuild
    answersContainer.innerHTML = "";

    question.alternatives.forEach((text, index) => {
        const alternative = document.createElement("div");
        alternative.classList.add("alternative");

        const letter = document.createElement("span");
        letter.textContent = String.fromCharCode(65 + index); // A, B, C...

        const label = document.createElement("p");
        label.textContent = text;

        alternative.appendChild(letter);
        alternative.appendChild(label);

        if (isReviewMode) {
            const userAnswer = userAnswers[currentQuestion];
            if (index === question.correct) {
                alternative.classList.add("correct");
            } else if (index === userAnswer) {
                alternative.classList.add("wrong");
            }
        } else {
            alternative.addEventListener("click", () => selectAnswer(index, alternative));
        }

        answersContainer.appendChild(alternative);
    });

    // reset selection for this question
    selectedAnswer = null;
}

function selectAnswer(index, element) {
    const allAlternatives = answersContainer.querySelectorAll(".alternative");
    allAlternatives.forEach((el) => el.classList.remove("selected"));

    element.classList.add("selected");
    selectedAnswer = index;
}

function goToNextQuestion() {
    if (isReviewMode) {
        currentQuestion++;
        if (currentQuestion >= questions.length) {
            isReviewMode = false;
            quizScreen.classList.add("hidden");
            resultsScreen.classList.remove("hidden");
        } else {
            renderQuestion();
        }
        return;
    }

    if (selectedAnswer === null) return;

    userAnswers[currentQuestion] = selectedAnswer;

    if (selectedAnswer === questions[currentQuestion].correct) {
        hits++;
    }

    currentQuestion++;

    if (currentQuestion >= questions.length) {
        showResults();
    } else {
        renderQuestion();
    }
}

function showResults() {
    quizScreen.classList.add("hidden");
    resultsScreen.classList.remove("hidden");

    const misses = questions.length - hits;
    const score = Math.round((hits / questions.length) * 100);

    resultNumber.textContent = hits;
    resultHits.textContent = hits;
    resultTotal.textContent = questions.length;

    kpiHits.textContent = hits;
    kpiMisses.textContent = misses;
    kpiScore.textContent = score + "%";
}

function restartQuiz() {
    currentQuestion = 0;
    hits = 0;
    selectedAnswer = null;
    userAnswers = [];
    isReviewMode = false;

    resultsScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    renderQuestion();
}

function startReview() {
    isReviewMode = true;
    currentQuestion = 0;

    resultsScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    renderQuestion();
}

const reviewButton = document.getElementById("answer-key-button");

playButton.addEventListener("click", startQuiz);
nextButton.addEventListener("click", goToNextQuestion);
restartButton.addEventListener("click", restartQuiz);
reviewButton.addEventListener("click", startReview);
