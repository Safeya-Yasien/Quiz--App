const question = document.querySelector(".question"),
  answerButtons = document.querySelector(".answers"),
  nextButton = document.querySelector(".next-btn");

let data,
  currentQuestionIndex = 0,
  score = 0;

async function getQuestions() {
  const response = await fetch("data/questions.json");
  data = await response.json();

  shuffle(data);
  startQuiz();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;

  nextButton.innerHTML = "Next";
  displayQuestions();
}

function displayQuestions() {
  reseteState();
  let currentQuestion = data[currentQuestionIndex];
  question.innerHTML = `${currentQuestion.question}`;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.classList.add("btn");
    button.innerHTML = answer.text;
    answerButtons.appendChild(button);

    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
  });

  console.log();
}

function reseteState() {
  nextButton.style.display = "none";
  answerButtons.innerHTML = "";
}

function selectAnswer(e) {
  const selectedButton = e.target,
    isCorrect = selectedButton.dataset.correct === "true";

  if (isCorrect) {
    selectedButton.classList.add("correct");
    score++;
  } else {
    selectedButton.classList.add("wrong");
  }

  Array.from(answerButtons.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  nextButton.style.display = "block";
}

function handleNextButton() {
  currentQuestionIndex++;

  if (currentQuestionIndex < data.length) {
    displayQuestions();
  } else {
    showScore();
  }
}

function showScore() {
  reseteState();
  question.innerHTML = `You scored ${score} out of ${data.length}`;
  nextButton.innerHTML = "Restart Again";
  nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < data.length) {
    handleNextButton();
  } else {
    startQuiz();
  }
});

getQuestions();
