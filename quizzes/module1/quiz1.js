/* ==========================================
   STRATIVO ACADEMY
   Quiz Engine v2.1 — Lesson 1
   Separate quiz engine for lesson1.html
========================================== */

const quiz = [
    {
        question: "1. What does Forex stand for?",
        options: [
            "Foreign Exchange",
            "Future Exchange",
            "Financial Export",
            "Foreign Export"
        ],
        answer: 0,
        explanation:
            "Forex stands for Foreign Exchange.\n\n" +
            "💡 Why?\n" +
            "Forex is the global marketplace where currencies are exchanged.\n\n" +
            "📌 Remember:\n" +
            "Every Forex trade always involves two currencies."
    },

    {
        question: "2. What is traded in the Forex market?",
        options: [
            "Gold",
            "Currencies",
            "Cars",
            "Houses"
        ],
        answer: 1,
        explanation:
            "Forex is the market where currencies are traded."
    },

    {
        question: "3. Which market is the largest financial market?",
        options: [
            "Crypto",
            "Stock",
            "Forex",
            "Commodity"
        ],
        answer: 2,
        explanation:
            "Forex is the largest financial market in the world."
    },

    {
        question: "4. Currencies are traded in?",
        options: [
            "Pairs",
            "Boxes",
            "Lots",
            "Bundles"
        ],
        answer: 0,
        explanation:
            "Currencies are always traded in pairs."
    },

    {
        question: "5. Which is NOT a Forex currency?",
        options: [
            "USD",
            "EUR",
            "BTC",
            "JPY"
        ],
        answer: 2,
        explanation:
            "BTC is a cryptocurrency, not a traditional fiat currency."
    },

    {
        question: "6. Which is a major currency pair?",
        options: [
            "EUR/USD",
            "USD/PKR",
            "USD/BDT",
            "USD/LKR"
        ],
        answer: 0,
        explanation:
            "EUR/USD is a major Forex currency pair."
    },

    {
        question: "7. Forex market opens:",
        options: [
            "24 Hours Monday-Friday",
            "Weekends Only",
            "Morning Only",
            "Night Only"
        ],
        answer: 0,
        explanation:
            "Forex generally operates 24 hours a day from Monday to Friday."
    },

    {
        question: "8. Who trades Forex?",
        options: [
            "Banks",
            "Companies",
            "Retail Traders",
            "All of these"
        ],
        answer: 3,
        explanation:
            "Banks, companies and retail traders all participate in the Forex market."
    },

    {
        question: "9. Why do exchange rates change?",
        options: [
            "Luck",
            "Supply and Demand",
            "Weather",
            "Random Numbers"
        ],
        answer: 1,
        explanation:
            "Exchange rates change because supply and demand, along with other market factors, affect relative currency values."
    },

    {
        question: "10. Before trading real money you should:",
        options: [
            "Learn First",
            "Use Maximum Leverage",
            "Copy Everyone",
            "Trade Immediately"
        ],
        answer: 0,
        explanation:
            "Always learn and practice before risking real money."
    }
];

/* =========================================================
   QUIZ STATE
========================================================= */

let currentQuestion = 0;
let selectedAnswers = [];

/*
 * The quiz automatically uses the current lesson number.
 * For Lesson 1 this becomes:
 *
 * lesson1_quizState
 */
const getQuizPrefix = () => {
    const path = window.location.pathname || "";
    const pageName = path.substring(path.lastIndexOf("/") + 1);

    const match = pageName.match(/lesson\d+/i);

    return match ? match[0].toLowerCase() : "lesson1";
};

const QUIZ_PREFIX = getQuizPrefix();
const QUIZ_STATE_KEY = `${QUIZ_PREFIX}_quizState`;

/* =========================================================
   BASIC HELPERS
========================================================= */

function getElement(id) {
    return document.getElementById(id);
}

/* =========================================================
   SAVE QUIZ STATE
========================================================= */

function saveQuizState() {
    try {
        localStorage.setItem(
            QUIZ_STATE_KEY,
            JSON.stringify({
                currentQuestion: currentQuestion,
                selectedAnswers: selectedAnswers,
                savedAt: Date.now()
            })
        );
    } catch (error) {
        console.warn("Quiz state could not be saved.", error);
    }
}

/* =========================================================
   LOAD QUIZ STATE
========================================================= */

function loadQuizState() {
    try {
        const raw = localStorage.getItem(QUIZ_STATE_KEY);

        if (!raw) {
            return;
        }

        const saved = JSON.parse(raw);

        if (!saved || typeof saved !== "object") {
            return;
        }

        if (Number.isInteger(saved.currentQuestion)) {
            currentQuestion = Math.min(
                Math.max(saved.currentQuestion, 0),
                quiz.length - 1
            );
        }

        if (Array.isArray(saved.selectedAnswers)) {
            selectedAnswers = saved.selectedAnswers.slice(
                0,
                quiz.length
            );
        }
    } catch (error) {
        console.warn("Quiz state could not be loaded.", error);
    }
}

/* =========================================================
   CLEAR QUIZ STATE
========================================================= */

function clearQuizState() {
    currentQuestion = 0;
    selectedAnswers = [];

    try {
        localStorage.removeItem(QUIZ_STATE_KEY);
    } catch (error) {
        console.warn("Quiz state could not be cleared.", error);
    }
}

/* =========================================================
   FORMAT EXPLANATION
========================================================= */

function formatExplanation(text) {
    return String(text).replace(/\n/g, "<br>");
}

/* =========================================================
   SHOW RESULT MESSAGE
========================================================= */

function setQuizResult(message) {
    const result = getElement("quiz-result");

    if (result) {
        result.innerHTML = message;
    }
}

/* =========================================================
   LOCK / UNLOCK ANSWERS
========================================================= */

function setAnswerButtonsLocked(locked) {
    for (let i = 0; i < 4; i += 1) {
        const button = getElement(`option${i}`);

        if (!button) {
            continue;
        }

        button.disabled = locked;

        button.setAttribute(
            "aria-disabled",
            locked ? "true" : "false"
        );
    }
}

/* =========================================================
   UPDATE QUESTION NAVIGATION BUTTONS
========================================================= */

function updateQuestionButtons() {
    const previousButton = getElement("prevQuestionBtn");
    const nextButton = getElement("nextQuestionBtn");

    const answered =
        selectedAnswers[currentQuestion] !== undefined;

    if (previousButton) {
        previousButton.disabled = currentQuestion === 0;
    }

    if (nextButton) {
        nextButton.disabled = !answered;

        nextButton.textContent =
            currentQuestion === quiz.length - 1
                ? "Finish Quiz →"
                : "Next Question →";
    }
}

/* =========================================================
   RESTORE ANSWER STATE
========================================================= */

function restoreSelectedAnswer() {
    const selected = selectedAnswers[currentQuestion];

    if (selected === undefined) {
        setAnswerButtonsLocked(false);
        return;
    }

    const correct = quiz[currentQuestion].answer;

    for (let i = 0; i < 4; i += 1) {
        const button = getElement(`option${i}`);

        if (!button) {
            continue;
        }

        button.classList.remove(
            "correct",
            "wrong"
        );

        if (i === correct) {
            button.classList.add("correct");
        }

        if (
            i === selected &&
            selected !== correct
        ) {
            button.classList.add("wrong");
        }
    }

    setAnswerButtonsLocked(true);

    setQuizResult(
        (
            selected === correct
                ? "✅ <strong>Correct!</strong><br><br>"
                : "❌ <strong>Incorrect.</strong><br><br>"
        ) +
        formatExplanation(
            quiz[currentQuestion].explanation
        )
    );
}

/* =========================================================
   LOAD CURRENT QUESTION
========================================================= */

function loadQuestion() {
    if (!quiz.length) {
        return;
    }

    currentQuestion = Math.min(
        Math.max(currentQuestion, 0),
        quiz.length - 1
    );

    const current = quiz[currentQuestion];

    const questionElement =
        getElement("question");

    const counterElement =
        getElement("question-counter");

    if (questionElement) {
        questionElement.textContent =
            current.question;
    }

    if (counterElement) {
        counterElement.textContent =
            `Question ${currentQuestion + 1} of ${quiz.length}`;
    }

    for (let i = 0; i < 4; i += 1) {
        const button = getElement(`option${i}`);

        if (!button) {
            continue;
        }

        button.textContent =
            current.options[i] || "";

        button.classList.remove(
            "correct",
            "wrong"
        );

        button.disabled = false;

        button.setAttribute(
            "aria-disabled",
            "false"
        );
    }

    setQuizResult("");

    restoreSelectedAnswer();

    updateQuestionButtons();

    saveQuizState();
}

/* =========================================================
   CHECK ANSWER
========================================================= */

function checkAnswer(index) {

    /*
     * Prevent selecting another answer
     * after one has already been chosen.
     */
    if (
        selectedAnswers[currentQuestion] !== undefined
    ) {
        return;
    }

    /*
     * Make sure the answer index is valid.
     */
    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >=
            quiz[currentQuestion].options.length
    ) {
        return;
    }

    selectedAnswers[currentQuestion] = index;

    const correct =
        quiz[currentQuestion].answer;

    const correctButton =
        getElement(`option${correct}`);

    const selectedButton =
        getElement(`option${index}`);

    /*
     * Always show the correct answer.
     */
    if (correctButton) {
        correctButton.classList.add(
            "correct"
        );
    }

    /*
     * If wrong, highlight the
     * student's selected answer too.
     */
    if (
        index !== correct &&
        selectedButton
    ) {
        selectedButton.classList.add(
            "wrong"
        );
    }

    /*
     * Prevent multiple answers.
     */
    setAnswerButtonsLocked(true);

    /*
     * Feedback.
     */
    setQuizResult(
        (
            index === correct
                ? "✅ <strong>Correct!</strong><br><br>"
                : "❌ <strong>Incorrect.</strong><br><br>"
        ) +
        formatExplanation(
            quiz[currentQuestion].explanation
        )
    );

    updateQuestionButtons();

    saveQuizState();
}

/* =========================================================
   NEXT QUESTION
========================================================= */

function nextQuestion() {

    /*
     * Student must answer first.
     */
    if (
        selectedAnswers[currentQuestion] === undefined
    ) {
        setQuizResult(
            "⚠️ <strong>Please select an answer first.</strong>"
        );

        return;
    }

    /*
     * Last question.
     */
    if (
        currentQuestion ===
        quiz.length - 1
    ) {
        showFinalScore();
        return;
    }

    currentQuestion += 1;

    loadQuestion();
}

/* =========================================================
   PREVIOUS QUESTION
========================================================= */

function previousQuestion() {

    if (currentQuestion <= 0) {
        return;
    }

    currentQuestion -= 1;

    loadQuestion();
}

/* =========================================================
   CALCULATE SCORE
========================================================= */

function calculateScore() {

    let score = 0;

    for (
        let i = 0;
        i < quiz.length;
        i += 1
    ) {

        if (
            selectedAnswers[i] ===
            quiz[i].answer
        ) {
            score += 1;
        }
    }

    return score;
}

/* =========================================================
   SCORE MESSAGE
========================================================= */

function getScoreMessage(percentage) {

    if (percentage >= 90) {
        return "🌟 Outstanding!";
    }

    if (percentage >= 70) {
        return "🎉 Great Job!";
    }

    return "📚 Keep Practicing!";
}

/* =========================================================
   SCORE STARS
========================================================= */

function getStars(percentage) {

    if (percentage === 100) {
        return "⭐⭐⭐⭐⭐";
    }

    if (percentage >= 80) {
        return "⭐⭐⭐⭐☆";
    }

    if (percentage >= 70) {
        return "⭐⭐⭐☆☆";
    }

    if (percentage >= 60) {
        return "⭐⭐☆☆☆";
    }

    return "⭐☆☆☆☆";
}

/* =========================================================
   SHOW FINAL SCORE
========================================================= */

function showFinalScore() {

    const finalScore =
        calculateScore();

    const percentage =
        Math.round(
            (finalScore / quiz.length) * 100
        );

    const passed =
        percentage >= 70;

    /*
     * 70% is the mastery/pass target.
     * It does NOT block access to the other lessons.
     */
    if (
        typeof window.unlockedStep !==
        "undefined"
    ) {
        window.unlockedStep = 10;
    }

    /*
     * Save quiz result.
     */
    localStorage.setItem(
        `${QUIZ_PREFIX}_unlockedStep`,
        "10"
    );

    localStorage.setItem(
        `${QUIZ_PREFIX}_quizScore`,
        String(finalScore)
    );

    localStorage.setItem(
        `${QUIZ_PREFIX}_quizTotal`,
        String(quiz.length)
    );

    localStorage.setItem(
        `${QUIZ_PREFIX}_quizPercentage`,
        String(percentage)
    );

    localStorage.setItem(
        `${QUIZ_PREFIX}_quizPassed`,
        String(passed)
    );

    localStorage.setItem(
        `${QUIZ_PREFIX}_completed`,
        String(passed)
    );

    /*
     * Create the final result box
     * inside Step 10.
     */
    const step10 =
        getElement("step10");

    let resultBox =
        document.querySelector(
            "#step10 .quiz-final-result"
        );

    if (
        !resultBox &&
        step10
    ) {

        resultBox =
            document.createElement(
                "div"
            );

        resultBox.className =
            "quiz-final-result note-box";

        resultBox.setAttribute(
            "aria-live",
            "polite"
        );

        const card =
            step10.querySelector(
                ".card"
            );

        if (card) {

            const heading =
                card.querySelector(
                    "h1"
                );

            if (heading) {

                heading.insertAdjacentElement(
                    "afterend",
                    resultBox
                );

            } else {

                card.prepend(
                    resultBox
                );
            }

        } else {

            step10.prepend(
                resultBox
            );
        }
    }

    /*
     * Safe fallback.
     */
    if (!resultBox) {

        setQuizResult(
            `<strong>${getScoreMessage(percentage)}</strong><br><br>` +
            `Score: ${finalScore} / ${quiz.length}<br>` +
            `Percentage: ${percentage}%`
        );

        return;
    }

    const retryButton = `
        <button
            type="button"
            class="secondary-btn"
            onclick="retryQuiz()"
        >
            🔄 Retry Quiz
        </button>
    `;

    const nextButton =
        passed
            ? `
                <button
                    type="button"
                    class="btn btn-primary"
                    onclick="window.location.href='lesson2.html'"
                >
                    🚀 Start Lesson 2
                </button>
            `
            : "";

    resultBox.innerHTML = `
        <div style="
            text-align:center;
            padding:18px;
        ">

            <div style="
                font-size:28px;
                margin-bottom:8px;
            ">
                ${passed ? "🏆" : "📚"}
            </div>

            <h2>
                ${passed
                    ? "Quiz Passed!"
                    : "Keep Practicing"}
            </h2>

            <p>
                <strong>Score</strong>
            </p>

            <div style="
                font-size:42px;
                font-weight:900;
                color:#00e5a8;
                margin:8px 0;
            ">
                ${finalScore} / ${quiz.length}
            </div>

            <p>
                <strong>Percentage</strong>
            </p>

            <h2>
                ${percentage}%
            </h2>

            <h3 style="
                margin:14px 0;
            ">
                ${getStars(percentage)}
            </h3>

            <p style="
                line-height:1.7;
            ">
                ${getScoreMessage(percentage)}
            </p>

            <p style="
                margin-top:12px;
                color:#aebdd0;
                line-height:1.7;
            ">
                ${
                    passed
                        ? "You have passed the Lesson 1 quiz. You can continue to Lesson 2."
                        : "The mastery target is 70%. Review Lesson 1 and try the quiz again."
                }
            </p>

            <div style="
                display:flex;
                justify-content:center;
                flex-wrap:wrap;
                gap:10px;
                margin-top:20px;
            ">
                ${retryButton}
                ${nextButton}
            </div>

        </div>
    `;

    /*
     * Move the student to Step 10
     * after the final result.
     */
    if (
        typeof window.showStep ===
        "function"
    ) {

        window.showStep(10);
    }

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

    saveQuizState();
}

/* =========================================================
   RETRY QUIZ
========================================================= */

function retryQuiz() {

    clearQuizState();

    /*
     * Return to Step 9.
     */
    if (
        typeof window.showStep ===
        "function"
    ) {

        window.showStep(9);
    }

    loadQuestion();
}

/* =========================================================
   INITIALIZE QUIZ
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
         * If this quiz script is accidentally loaded
         * on a page without a quiz container, stop safely.
         */
        if (!getElement("question")) {
            return;
        }

        loadQuizState();

        loadQuestion();
    }
);