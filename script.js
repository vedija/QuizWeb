const progressBar = document.querySelector(".progress-bar"),
  progressText = document.querySelector(".progress-text");

let questions = [],
  time = 30,
  score = 0,
  currentQuestion,
  timer;

const startBtn = document.querySelector(".start"),
  numQuestions = document.querySelector("#num-questions"),
  category = document.querySelector("#category"),
  difficulty = document.querySelector("#difficulty"),
  timePerQuestion = document.querySelector("#time"),
  quiz = document.querySelector(".quiz"),
  startscreen = document.querySelector(".start-screen");

const startQuiz = () => {
  const num = numQuestions.value;
  const cat = category.value;
  const diff = difficulty.value;
  // api url
  const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      questions = data.results;
      startscreen.classList.add("hide");
      quiz.classList.remove("hide");
      currentQuestion = 1;
      showQuestion(questions[0]);
    });
};

startBtn.addEventListener("click", startQuiz);

const submitBtn = document.querySelector(".submit"),
  nextbtn = document.querySelector(".next");

const showQuestion = (question) => {
  const questionText = document.querySelector(".question"),
    answersWrapper = document.querySelector(".answer-wrapper"),
    questionNumber = document.querySelector(".number");

  questionText.innerHTML = question.question;

  // Combine correct and incorrect answers and shuffle them
  const answers = [
    ...question.incorrect_answers,
    question.correct_answer.toString(),
  ];
  answers.sort(() => Math.random() - 0.5);
  answersWrapper.innerHTML = "";
  answers.forEach((answer) => {
    answersWrapper.innerHTML += `
      <div class="answer">
        <span class="text">${answer}</span>
        <span class="checkbox">
          <span class="icon"><span>&#10003;</span></span>
        </span>
      </div>
    `;
  });
  questionNumber.innerHTML = `
    Question <span class="current">${questions.indexOf(question) + 1}</span>
    <span class="total">/${questions.length}</span>
  `;

  // Add event listener to answers
  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.addEventListener("click", () => {
      if (!answer.classList.contains("checked")) {
        answersDiv.forEach((answer) => answer.classList.remove("selected"));
        answer.classList.add("selected");
        submitBtn.disabled = false;
      }
    });
  });

  // Start timer for the question
  time = parseInt(timePerQuestion.value);
  startTimer(time);
};

const startTimer = (time) => {
  timer = setInterval(() => {
    if (time >= 0) {
      // Update progress bar and time
      progress(time);
      time--;
    } else {
      // Time is up
      checkAnswer();
    }
  }, 1000);
};

const progress = (value) => {
  const percentage = (value / parseInt(timePerQuestion.value)) * 100;
  progressBar.style.width = `${percentage}%`;
  progressText.innerHTML = `${value}`;
};

submitBtn.addEventListener("click", () => {
  checkAnswer();
});

const checkAnswer = () => {
  clearInterval(timer);

  const selectedAnswer = document.querySelector(".answer.selected");
  if (selectedAnswer) {
    const selectedText = selectedAnswer.querySelector(".text").textContent.trim();
    const correctAnswerText = questions[currentQuestion - 1].correct_answer.trim();

    if (selectedText === correctAnswerText) {
      score++;
      selectedAnswer.classList.add("correct");
    } else {
      selectedAnswer.classList.add("wrong");
      document.querySelectorAll(".answer").forEach((answer) => {
        const answerText = answer.querySelector(".text").textContent.trim();
        if (answerText === correctAnswerText) {
          answer.classList.add("correct");
        }
      });
    }
  } else {
    document.querySelectorAll(".answer").forEach((answer) => {
      const answerText = answer.querySelector(".text").textContent.trim();
      if (answerText === questions[currentQuestion - 1].correct_answer.trim()) {
        answer.classList.add("correct");
      }
    });
  }

  // Disable further selection
  document.querySelectorAll(".answer").forEach((answer) => {
    answer.classList.add("checked");
  });

  submitBtn.style.display = "none";
  nextbtn.style.display = "block";
};

nextbtn.addEventListener("click", () => {
  nextQuestion();
  nextbtn.style.display = "none";
  submitBtn.style.display = "block";
});

const nextQuestion = () => {
  if (currentQuestion < questions.length) {
    currentQuestion++;
    showQuestion(questions[currentQuestion - 1]);
  } else {
    showScore();
  }
};

const endScreen = document.querySelector(".end-screen"),
  finalScore = document.querySelector(".final-score"),
  totalScore = document.querySelector(".total-score");

const showScore = () => {
  endScreen.classList.remove("hide");
  quiz.classList.add("hide");
  finalScore.innerHTML = score;
  totalScore.innerHTML = `/${questions.length}`;
};

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
  window.location.reload();
});
