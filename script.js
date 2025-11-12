let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let mistakes = 0;
let difficulty = 2;
const MAX_QUESTIONS = 20;

// Carrega o arquivo questions.json
async function loadQuestions() {
    try {
        const response = await fetch("questions.json");
        questions = await response.json();

        // Embaralha e limita ao máximo definido
        shuffleQuestions();
        questions = questions.slice(0, MAX_QUESTIONS);
    } catch (error) {
        console.error("Erro ao carregar questions.json:", error);
    }
}

function shuffleQuestions() {
    questions.sort(() => Math.random() - 0.5);
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endGame();
        return;
    }

    const questionObj = questions[currentQuestionIndex];
    document.getElementById("question-image").src = questionObj.image;
    document.getElementById("question").textContent = questionObj.questionText || "De que material é feito esse item da foto?";
    document.getElementById("question-number").textContent = `${currentQuestionIndex + 1} de ${questions.length}`;

    let answers = new Set();
    answers.add(questionObj.answer);

    while (answers.size < difficulty) {
        let randomAnswer = questions[Math.floor(Math.random() * questions.length)].answer;
        answers.add(randomAnswer);
    }

    let answersArray = Array.from(answers).sort(() => Math.random() - 0.5);

    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";
    answersArray.forEach(ans => {
        let btn = document.createElement("button");
        btn.textContent = ans;
        btn.onclick = () => checkAnswer(ans);
        answersDiv.appendChild(btn);
    });
}

function startGame() {
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden");

    const level = document.getElementById("difficulty").value;
    difficulty = level === "easy" ? 2 : level === "medium" ? 3 : 4;

    currentQuestionIndex = 0;
    score = 0;
    mistakes = 0;
    document.getElementById("score").textContent = "0";
    document.getElementById("mistakes").textContent = "0";

    loadQuestion();
}

function checkAnswer(selected) {
    const correctAnswer = questions[currentQuestionIndex].answer;

    if (selected === correctAnswer) {
        document.getElementById("correct-sound").play();
        score++;
        document.getElementById("score").textContent = score;
    } else {
        document.getElementById("wrong-sound").play();
        mistakes++;
        document.getElementById("mistakes").textContent = mistakes;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex === questions.length) {
        setTimeout(() => endGame(), 500);
    } else {
        loadQuestion();
    }
}

function showFireworks() {
    const fireworksDiv = document.getElementById("fireworks");
    if (!fireworksDiv) return;

    fireworksDiv.classList.add("show");

    setTimeout(() => {
        fireworksDiv.classList.remove("show");
        resetGame();
    }, 5000);
}

function resetGame() {
    currentQuestionIndex = 0;
    score = 0;
    mistakes = 0;
    document.getElementById("score").textContent = "0";
    document.getElementById("mistakes").textContent = "0";
    document.getElementById("game-container").classList.add("hidden");
    document.getElementById("start-screen").classList.remove("hidden");

    // Recarrega as questões
    loadQuestions();
}

function endGame() {
    if (mistakes === 0) {
        showFireworks();
    } else {
        alert(`Fim do jogo! Você acertou ${score} de ${questions.length} e cometeu ${mistakes} erros.`);
        resetGame();
    }
}

// Carrega as perguntas assim que a página abrir
window.onload = loadQuestions;
