/* ==========================================
   STRATIVO ACADEMY
   Lesson 2 Quiz Engine v2.1
   State-Safe / Separate Quiz File
========================================== */

const quiz = [
    {
        question: "1. Rahul is travelling from India to the United States. Before boarding his flight, he exchanges Indian Rupees (INR) for US Dollars (USD). What has Rahul just done?",
        options: [
            "A bank loan",
            "A Forex transaction",
            "A cryptocurrency trade",
            "A stock market trade"
        ],
        answer: 1,
        explanation:
            "Correct! Rahul exchanged one currency (INR) for another currency (USD).\n\n" +
            "Whenever one currency is exchanged for another, it is a Forex transaction.\n\n" +
            "Millions of travellers, businesses and banks perform similar transactions every day."
    },

    {
        question: "2. Priya opens her trading platform and decides to BUY EUR/USD. Which statement correctly describes her trade?",
        options: [
            "She is buying both Euros and US Dollars",
            "She is selling both Euros and US Dollars",
            "She is buying Euros and selling US Dollars",
            "She is buying US Dollars and selling Euros"
        ],
        answer: 2,
        explanation:
            "✅ Correct!\n\n" +
            "When you BUY EUR/USD, you are buying the Euro and selling the US Dollar.\n\n" +
            "💡 Why?\n\n" +
            "Every Forex trade contains two currencies.\n\n" +
            "🌍 Remember\n\n" +
            "The first currency is the Base Currency and the second currency is the Quote Currency."
    },

    {
        question: "3. Aman sees the price GBP/USD = 1.2500 on his trading platform. What does this price mean?",
        options: [
            "1 British Pound equals 1.2500 US Dollars",
            "1 US Dollar equals 1.2500 British Pounds",
            "1 British Pound equals 125 US Dollars",
            "The Forex market is closed"
        ],
        answer: 0,
        explanation:
            "The first currency (GBP) is the Base Currency and the second currency (USD) is the Quote Currency.\n\n" +
            "A price of 1.2500 means 1 British Pound is worth 1.2500 US Dollars."
    },

    {
        question: "4. Sarah is a new Forex trader. She wants to trade a currency pair with high liquidity and lower spreads to reduce her trading costs. Which pair should she choose?",
        options: [
            "USD/TRY",
            "GBP/ZAR",
            "EUR/USD",
            "EUR/TRY"
        ],
        answer: 2,
        explanation:
            "EUR/USD is a Major Currency Pair and is the most traded pair in the world.\n\n" +
            "It has high liquidity, lower spreads and is considered one of the best choices for beginners."
    },

    {
        question: "5. Arjun is analysing the currency pair EUR/GBP. He notices that it does not contain the US Dollar (USD). Which type of currency pair is EUR/GBP?",
        options: [
            "Major Currency Pair",
            "Minor (Cross) Currency Pair",
            "Exotic Currency Pair",
            "Cryptocurrency Pair"
        ],
        answer: 1,
        explanation:
            "EUR/GBP is a Minor (Cross) Currency Pair because it combines two major currencies without including the US Dollar (USD).\n\n" +
            "Minor pairs are traded less than Major pairs and usually have slightly higher spreads."
    },

    {
        question: "6. Neha is searching for a currency pair that may have larger price movements but also higher trading costs. Which pair is she most likely looking at?",
        options: [
            "EUR/USD",
            "GBP/USD",
            "USD/TRY",
            "AUD/USD"
        ],
        answer: 2,
        explanation:
            "USD/TRY is an Exotic Currency Pair because it combines a major currency (US Dollar) with the Turkish Lira, the currency of an emerging economy.\n\n" +
            "Exotic pairs usually have lower liquidity, larger spreads, and higher volatility than Major Currency Pairs."
    },

    {
        question: "7. A trader is looking at the currency pair AUD/JPY. Which statement is correct?",
        options: [
            "AUD is the Base Currency and JPY is the Quote Currency",
            "JPY is the Base Currency and AUD is the Quote Currency",
            "Both AUD and JPY are Base Currencies",
            "The pair has no Base Currency"
        ],
        answer: 0,
        explanation:
            "In every Forex currency pair, the first currency is the Base Currency and the second currency is the Quote Currency.\n\n" +
            "Therefore, in AUD/JPY, AUD (Australian Dollar) is the Base Currency and JPY (Japanese Yen) is the Quote Currency."
    },

    {
        question: "8. Rohan opens his trading platform and sees EUR/USD trading at 1.1050. What does this price mean?",
        options: [
            "1 Euro is worth 1.1050 US Dollars",
            "1 US Dollar is worth 1.1050 Euros",
            "The Euro is weaker than the US Dollar",
            "The Forex market is closed"
        ],
        answer: 0,
        explanation:
            "EUR is the Base Currency and USD is the Quote Currency.\n\n" +
            "A price of 1.1050 means that 1 Euro can be exchanged for 1.1050 US Dollars.\n\n" +
            "The Forex price tells you how much Quote Currency is needed to buy one unit of the Base Currency."
    },

    {
        question: "9. A beginner trader says, 'EUR/GBP is a Major Currency Pair because both the Euro and British Pound are major currencies.' What is the correct response?",
        options: [
            "Correct, it is a Major Currency Pair",
            "Incorrect. EUR/GBP is a Minor (Cross) Currency Pair because it does not include the US Dollar (USD).",
            "Incorrect. EUR/GBP is an Exotic Currency Pair.",
            "There is not enough information to decide."
        ],
        answer: 1,
        explanation:
            "This is a common beginner mistake.\n\n" +
            "Even though both EUR and GBP are major currencies, EUR/GBP is NOT a Major Currency Pair because it does not include the US Dollar (USD).\n\n" +
            "It is classified as a Minor (Cross) Currency Pair."
    },

    {
        question: "10. Vikram has just completed his first Forex lesson. He wants to choose a currency pair that is suitable for a beginner. Which option is the BEST choice?",
        options: [
            "EUR/USD because it is a Major Currency Pair with high liquidity and lower spreads.",
            "USD/TRY because Exotic Pairs always have lower trading costs.",
            "GBP/ZAR because all currency pairs are equally suitable for beginners.",
            "EUR/GBP because Minor Currency Pairs always have lower spreads than Major Pairs."
        ],
        answer: 0,
        explanation:
            "Excellent!\n\n" +
            "EUR/USD is one of the world's most traded Major Currency Pairs.\n\n" +
            "It offers high liquidity, lower spreads, and plenty of educational resources, making it a strong beginner example.\n\n" +
            "Exotic pairs usually have higher spreads and greater volatility, while Minor pairs may be better suited to traders with more experience."
    }
];


/* =========================================================
   QUIZ STATE
========================================================= */

let currentQuestion = 0;
let selectedAnswers = [];


/* =========================================================
   QUIZ PREFIX / STORAGE
========================================================= */

const QUIZ_PREFIX = getQuizPrefix();
const QUIZ_STATE_KEY = `${QUIZ_PREFIX}_quizState`;

function getQuizPrefix() {
    const path = window.location.pathname || "";
    const pageName = path.substring(path.lastIndexOf("/") + 1);

    const match = pageName.match(/lesson\d+/i);

    return match
        ? match[0].toLowerCase()
        : "lesson2";
}


/* =========================================================
   BASIC HELPERS
========================================================= */

function getElement(id) {
    return document.getElementById(id);
}

function formatExplanation(text) {
    return String(text).replace(/\n/g, "<br>");
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
        const raw = localStorage.getItem(
            QUIZ_STATE_KEY
        );

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
            selectedAnswers =
                saved.selectedAnswers.slice(
                    0,
                    quiz.length
                );
        }
    } catch (error) {
        console.warn(
            "Quiz state could not be loaded.",
            error
        );
    }
}


/* =========================================================
   CLEAR CURRENT QUIZ ATTEMPT
========================================================= */

function clearQuizAttemptState() {

    currentQuestion = 0;
    selectedAnswers = [];

    try {
        localStorage.removeItem(
            QUIZ_STATE_KEY
        );
    } catch (error) {
        console.warn(
            "Quiz attempt state could not be cleared.",
            error
        );
    }
}


/* =========================================================
   RESULT MESSAGE
========================================================= */

function setQuizResult(message) {

    const result =
        getElement("quiz-result");

    if (result) {
        result.innerHTML = message;
    }
}


/* =========================================================
   LOCK ANSWER BUTTONS
========================================================= */

function lockAnswerButtons(locked) {

    for (let i = 0; i < 4; i += 1) {

        const button =
            getElement(`option${i}`);

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
   QUESTION NAVIGATION BUTTONS
========================================================= */

function updateQuestionButtons() {

    const previousButton =
        getElement("prevQuestionBtn");

    const nextButton =
        getElement("nextQuestionBtn");

    const answered =
        selectedAnswers[currentQuestion] !== undefined;


    if (previousButton) {

        previousButton.disabled =
            currentQuestion === 0;
    }


    if (nextButton) {

        nextButton.disabled =
            !answered;

        nextButton.textContent =
            currentQuestion === quiz.length - 1
                ? "Finish Quiz →"
                : "Next Question →";
    }
}


/* =========================================================
   LOAD QUESTION
========================================================= */

function loadQuestion() {

    if (!quiz.length) {
        return;
    }


    currentQuestion = Math.min(
        Math.max(currentQuestion, 0),
        quiz.length - 1
    );


    const current =
        quiz[currentQuestion];


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

        const button =
            getElement(`option${i}`);

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


    /*
     * Restore an existing answer
     * after page refresh/navigation.
     */
    const selected =
        selectedAnswers[currentQuestion];


    if (selected !== undefined) {

        const correct =
            current.answer;

        const correctButton =
            getElement(`option${correct}`);

        const selectedButton =
            getElement(`option${selected}`);


        if (correctButton) {

            correctButton.classList.add(
                "correct"
            );
        }


        if (
            selected !== correct &&
            selectedButton
        ) {

            selectedButton.classList.add(
                "wrong"
            );
        }


        lockAnswerButtons(true);


        setQuizResult(
            (
                selected === correct
                    ? "✅ <strong>Correct!</strong><br><br>"
                    : "❌ <strong>Incorrect.</strong><br><br>"
            ) +
            formatExplanation(
                current.explanation
            )
        );

    } else {

        lockAnswerButtons(false);
    }


    updateQuestionButtons();

    saveQuizState();
}


/* =========================================================
   CHECK ANSWER
========================================================= */

function checkAnswer(index) {

    /*
     * Prevent changing an answer
     * after selection.
     */
    if (
        selectedAnswers[currentQuestion] !==
        undefined
    ) {

        return;
    }


    /*
     * Validate answer index.
     */
    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >=
            quiz[currentQuestion].options.length
    ) {

        return;
    }


    selectedAnswers[currentQuestion] =
        index;


    const correct =
        quiz[currentQuestion].answer;

    const correctButton =
        getElement(`option${correct}`);

    const selectedButton =
        getElement(`option${index}`);


    /*
     * Always show correct answer.
     */
    if (correctButton) {

        correctButton.classList.add(
            "correct"
        );
    }


    /*
     * Highlight wrong selected answer.
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
     * Lock all answer buttons.
     */
    lockAnswerButtons(true);


    /*
     * Show explanation.
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
        selectedAnswers[currentQuestion] ===
        undefined
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

function getScoreMessage(
    percentage
) {

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

function getStars(
    percentage
) {

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
   FINAL SCORE
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
     * 70% is a mastery target,
     * not a hard navigation lock.
     */
    if (
        typeof window.unlockedStep !==
        "undefined"
    ) {

        window.unlockedStep = 10;
    }


    /*
     * Save score data.
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
     * Preserve best score.
     */
    const bestScore =
        Number.parseInt(
            localStorage.getItem(
                `${QUIZ_PREFIX}_bestScore`
            ) || "0",
            10
        );


    if (
        finalScore >
        bestScore
    ) {

        localStorage.setItem(
            `${QUIZ_PREFIX}_bestScore`,
            String(finalScore)
        );
    }


    /*
     * Preserve attempt count.
     */
    const previousAttempts =
        Number.parseInt(
            localStorage.getItem(
                `${QUIZ_PREFIX}_quizAttempts`
            ) || "0",
            10
        );


    localStorage.setItem(
        `${QUIZ_PREFIX}_quizAttempts`,
        String(
            previousAttempts + 1
        )
    );


    /*
     * Find/create Step 10
     * result box.
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
            `<strong>${getScoreMessage(
                percentage
            )}</strong><br><br>` +
            `Score: ${finalScore} / ${quiz.length}<br>` +
            `Percentage: ${percentage}%`
        );

        return;
    }


    const continueButton =
        passed
            ? `
                <button
                    type="button"
                    class="btn btn-primary"
                    onclick="window.location.href='lesson3.html'"
                >
                    🚀 Continue to Lesson 3
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
                ${
                    passed
                        ? "Lesson 2 Quiz Passed!"
                        : "Keep Practicing"
                }
            </h2>


            <p>
                <strong>Your Score</strong>
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
                ${getScoreMessage(
                    percentage
                )}
            </p>


            <p style="
                margin-top:12px;
                color:#aebdd0;
                line-height:1.7;
            ">
                ${
                    passed
                        ? "You have passed the Lesson 2 mastery target. Review your mistakes if necessary, then continue to Lesson 3."
                        : "The mastery target is 70%. Review Lesson 2 and retry the quiz when you are ready."
                }
            </p>


            <div style="
                display:flex;
                justify-content:center;
                flex-wrap:wrap;
                gap:10px;
                margin-top:20px;
            ">

                <button
                    type="button"
                    class="secondary-btn"
                    onclick="retryQuiz()"
                >
                    🔄 Retry Quiz
                </button>

                ${continueButton}

            </div>

        </div>
    `;


    /*
     * Move to Step 10.
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

    /*
     * Reset current attempt.
     * Best score and history stay saved.
     */
    clearQuizAttemptState();


    if (
        typeof window.showStep ===
        "function"
    ) {

        window.showStep(9);
    }


    loadQuestion();
}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (
            !getElement("question")
        ) {

            return;
        }


        loadQuizState();

        loadQuestion();
    }
);