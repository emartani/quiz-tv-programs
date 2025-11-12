let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let mistakes = 0;
let difficulty = 2;
const MAX_QUESTIONS = 20; // Define o número máximo de questões a serem usadas

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endGame(); // Call endGame here to handle win/loss condition
        return;
    }

    const questionObj = questions[currentQuestionIndex];
    document.getElementById("question-image").src = questionObj.image;
    // ALTERAÇÃO AQUI: Usa o questionText do objeto da questão, se existir, senão usa o padrão.
    document.getElementById("question").textContent = questionObj.questionText || "De que material é feito esse item da foto?"; 

    // Atualizar o número da questão exibido
    document.getElementById("question-number").textContent = `${currentQuestionIndex + 1} de ${questions.length}`;

    let answers = new Set();
    answers.add(questionObj.answer);

    while (answers.size < difficulty) {
        let randomAnswer = questions[Math.floor(Math.random() * questions.length)].answer;
        if (!answers.has(randomAnswer)) {
            answers.add(randomAnswer);
        }
    }

    let answersArray = Array.from(answers);
    answersArray.sort(() => Math.random() - 0.5);

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

    // Embaralha todas as questões e pega apenas as primeiras MAX_QUESTIONS
    shuffleQuestions(); // Isso embaralha a lista completa de perguntas
    questions = questions.slice(0, MAX_QUESTIONS); // Limita para as primeiras 20 questões após o embaralhamento

    currentQuestionIndex = 0;
    score = 0; // Reset score on new game
    mistakes = 0; // Reset mistakes on new game
    document.getElementById("score").textContent = "0";
    document.getElementById("mistakes").textContent = "0";
    loadQuestion();
}

function shuffleQuestions() {
    questions.sort(() => Math.random() - 0.5);
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endGame(); // Call endGame here to handle win/loss condition
        return;
    }

    const questionObj = questions[currentQuestionIndex];
    document.getElementById("question-image").src = questionObj.image;
    document.getElementById("question").textContent = "De que material é feito esse item da foto?";

    // Atualizar o número da questão exibido
    document.getElementById("question-number").textContent = `${currentQuestionIndex + 1} de ${questions.length}`;

    let answers = new Set();
    answers.add(questionObj.answer);

    while (answers.size < difficulty) {
        let randomAnswer = questions[Math.floor(Math.random() * questions.length)].answer;
        if (!answers.has(randomAnswer)) {
            answers.add(randomAnswer);
        }
    }

    let answersArray = Array.from(answers);
    answersArray.sort(() => Math.random() - 0.5);

    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";
    answersArray.forEach(ans => {
        let btn = document.createElement("button");
        btn.textContent = ans;
        btn.onclick = () => checkAnswer(ans);
        answersDiv.appendChild(btn);
    });
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
        setTimeout(() => {
            endGame();
        }, 500);
    } else {
        loadQuestion();
    }
}

function showFireworks() {
    const fireworksDiv = document.getElementById("fireworks");

    if (!fireworksDiv) {
        console.error("Elemento fireworks não encontrado!");
        return;
    }

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

    // Recarrega as questões e reinicia o jogo para pegar um novo conjunto aleatório de 20
    loadQuestions();
}

function stopBounceAfter5Seconds() {
    setTimeout(() => {
        const startScreen = document.getElementById("start-screen");
        if (startScreen) {
            startScreen.classList.remove("bounce");
        }
    }, 5000);
}

function endGame() {
    if (mistakes === 0) {
        showFireworks();
    } else {
        alert(`Fim do jogo! Você acertou ${score} de ${questions.length} e cometeu ${mistakes} erros. Tente novamente para acertar todas!`);
        resetGame();
    }
}

window.onload = loadQuestions;