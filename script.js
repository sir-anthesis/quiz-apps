// 
let questions;
const apiUrl = 'https://opentdb.com/api.php?amount=5&type=multiple';

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    questions = formatQuestions(data.results);
    console.log(questions);
    startQuiz();
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });

function formatQuestions(apiResults) {
  return apiResults.map(apiQuestion => {
    const formattedQuestion = {
      question: apiQuestion.question,
      answers: shuffleAnswers([
        { text: apiQuestion.correct_answer, correct: true },
        ...apiQuestion.incorrect_answers.map(answer => ({ text: answer, correct: false }))
      ])
    };
    return formattedQuestion;
  });
}

function shuffleAnswers(answers) {
  // Function to shuffle the order of answers (using Fisher-Yates algorithm)
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }
  return answers;
}


const home = document.getElementById("home");
const quiz = document.getElementById("quiz");
const scoreDisplay = document.getElementById("text");
const questionsElement = document.getElementById('question');
const answersBtn = document.getElementById('answers');
const ctaBtn = document.getElementById('cta');

let currentQuestionIndex = 0;
let score = 0;
let play = false

ctaBtn.addEventListener('click', function () {
    if (play == false) {
        play = true
        home.style.display = "none";
        quiz.style.display = "inline";
        ctaBtn.innerText = "Next"
        showQuestion();
    } else if (play == "finish") {
        const result = score/questions.length * 100;

        home.style.display = "inline";
        quiz.style.display = "none";
        ctaBtn.style.display = "none";
        scoreDisplay.innerText = `Your score is ${result}`;
    } else {
        while (answersBtn.firstChild) {
            answersBtn.removeChild(answersBtn.firstChild);
        }
        currentQuestionIndex += 1;
        showQuestion();
    }
})

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
}

function showQuestion() {
    ctaBtn.style.visibility = "hidden";
    let currentQuestion = questions[currentQuestionIndex];
    let questionNumber = currentQuestionIndex + 1;
    questionsElement.innerHTML = questionNumber + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add('btn', 'answer');
        answersBtn.appendChild(button);

        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }

        button.addEventListener('click', selectedAnswer);
    })

    if (questionNumber == questions.length) {
        play = "finish"
        ctaBtn.innerText = "Finish"
    }
}

function selectedAnswer(e) {
    ctaBtn.style.visibility = "visible";
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add('correct');
        score += 1;
    } else {
        selectedBtn.classList.add('incorrect');
    }

    Array.from(answersBtn.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add('correct');
        };
        button.style.pointerEvents = "none";
    });
}
