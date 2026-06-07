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
        statement: "O que significa a sigla PO?",
        alternatives: [
            "Process Owner",
            "Project Operator",
            "Product Owner"
        ],
        correct: 3
    },
    {
        statement: "O que é um 'Épico' no Azure DevOps?",
        alternatives: [
            "Um bug crítico registrado no sistema",
            "Agrupamento macro de funcionalidades ou temas do projeto",
            "Um caso de teste detalhado",
        ],
        correct: 1
    },
    {
        statement: "O que é Homologação?",
        alternatives: [
            "Criação de histórias no Azure DevOps",
            "Registro de bugs encontrados em testes",
            "Validação da solução antes da subida para produção",
        ],
        correct: 2
    },
    {
        statement: "O que deve conter obrigatoriamente um card/história no Azure DevOps?",
        alternatives: [
            "Nome, contexto, regras de negócio e critérios de aceite",
            "Apenas o nome da funcionalidade e o responsável",
            "Somente os critérios de aceite e o prazo de entrega",
        ],
        correct: 0
    },
    {
        statement: "Quando uma história pode seguir para desenvolvimento?",
        alternatives: [
            "Assim que for criada pela equipe de processos",
            "Após validação do PO",
            "Após o refinamento técnico do time de desenvolvimento",
        ],
        correct: 1
    },

    {
        statement: "O que significa o status 'Blocked' em um teste?",
        alternatives:
        [
            "Teste executado com falha",
            "Teste ainda não iniciado",
            "Teste bloqueado por ausência de entrega, falha anterior ou dependência",
        ],
        correct: 2
    },
    {
        statement: "O que deve conter um bug registrado no Azure DevOps?",
        alternatives: [
            "Apenas o título e o responsável pela correção",
            "Nome, história relacionada, etapa da falha, resultado esperado, obtido e evidências",
            "Somente as evidências e comentários explicativos",
        ],
        correct: 1
    },
    {
        statement: "Qual é o fluxo correto de validação em QA?",
        alternatives: [
            "PO testa primeiro, depois o QA interno valida ",
            "O time de desenvolvimento entrega, QA interno valida, depois o PO executa os testes",
            "A área de negócio valida antes do QA interno"
        ],
        correct: 1
    },
    {
        statement: "O que é necessário antes de iniciar o registro no Azure DevOps?",
        alternatives: [
            "Apenas a especificação funcional elaborada",
            "Somente as regras de negócio mapeadas",
            "Reuniões de entendimento, fluxograma, especificação funcional e regras de negócio mapeadas"
        ],
        correct: 2
    },
    {
        statement: "O que significa o status 'Passed' em um teste?",
        alternatives: [
            "Teste em execução",
            "Teste executado e aprovado",
            "Teste bloqueado por dependência técnica",
        ],
        correct: 1
    },

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
