/* ==========================================
   STRATIVO ACADEMY
   Lesson 3 Quiz Engine v2.1
   State-Safe / Separate Quiz File
========================================== */

const quiz = [
    {
        question: "1. Riya wants to SELL the EUR/USD currency pair. Which price will her trade be executed at?",
        options: [
            "Bid Price",
            "Ask Price",
            "Average Price",
            "Market Price"
        ],
        answer: 0,
        explanation:
            "Correct! Every SELL order is executed at the Bid Price.\n\n" +
            "Remember the simple rule:\n\n" +
            "Bid = Sell."
    },

    {
        question: "2. Arjun wants to BUY GBP/USD. Which price will his trade be executed at?",
        options: [
            "Average Price",
            "Closing Price",
            "Ask Price",
            "Bid Price"
        ],
        answer: 2,
        explanation:
            "Correct! Every BUY order is executed at the Ask Price.\n\n" +
            "Remember the simple rule:\n\n" +
            "Ask = Buy."
    },

    {
        question: "3. Neha sees EUR/USD quoted with a Bid Price of 1.1050 and an Ask Price of 1.1053. What is the Spread?",
        options: [
            "0.0030",
            "0.0003",
            "0.0001",
            "0.0002"
        ],
        answer: 1,
        explanation:
            "Correct!\n\n" +
            "The Spread is calculated by subtracting the Bid Price from the Ask Price.\n\n" +
            "1.1053 − 1.1050 = 0.0003."
    },

    {
        question: "4. Rahul opens a BUY trade on EUR/USD. Immediately after opening the trade, he notices that it starts with a small negative value. What is the most likely reason?",
        options: [
            "The broker made a mistake",
            "The market closed immediately",
            "His account has insufficient funds",
            "He entered at the Ask Price and paid the Spread"
        ],
        answer: 3,
        explanation:
            "Correct!\n\n" +
            "Every BUY trade is executed at the Ask Price, while the chart often shows the Bid Price.\n\n" +
            "The difference between these prices is the Spread, so a new trade usually starts with a small negative value."
    },

    {
        question: "5. Priya is looking at the currency pair USD/JPY. She wants to place a SELL order. Which price will be used to execute her trade?",
        options: [
            "Bid Price",
            "Ask Price",
            "Highest Price of the Day",
            "Average Market Price"
        ],
        answer: 0,
        explanation:
            "Correct!\n\n" +
            "Every SELL order is executed at the Bid Price because it is the price buyers are willing to pay.\n\n" +
            "Remember:\n\n" +
            "Bid = Sell."
    },

    {
        question: "6. A broker is showing EUR/USD with a Bid Price of 1.1205 and an Ask Price of 1.1207. Which statement is correct?",
        options: [
            "The Bid Price is higher than the Ask Price",
            "Both prices should always be the same",
            "The Spread is 0.0002",
            "The Spread is 0.0005"
        ],
        answer: 2,
        explanation:
            "Correct!\n\n" +
            "The Spread is the difference between the Ask Price and the Bid Price.\n\n" +
            "1.1207 − 1.1205 = 0.0002.\n\n" +
            "The Ask Price is normally slightly higher than the Bid Price."
    },

    {
        question: "7. Vikram compares two currency pairs before placing a trade. Pair A has a very low spread, while Pair B has a much higher spread. Which pair is generally more cost-effective to trade?",
        options: [
            "The spread has no effect on trading costs",
            "Pair A because it has a lower spread",
            "Pair B because a higher spread means higher profits",
            "Both pairs always cost the same"
        ],
        answer: 1,
        explanation:
            "Correct!\n\n" +
            "A lower spread means lower trading costs.\n\n" +
            "Professional traders often prefer currency pairs with lower spreads because they reduce the cost of entering a trade."
    },

    {
        question: "8. A trader notices that the spread on GBP/USD becomes much larger during an important economic news announcement. What is the most likely reason?",
        options: [
            "The Bid Price disappeared",
            "The Forex market changed to the stock market",
            "The currency pair stopped trading permanently",
            "Market volatility increased, causing the spread to widen"
        ],
        answer: 3,
        explanation:
            "Correct!\n\n" +
            "During major news events, market volatility can increase and brokers may temporarily widen the spread to reflect changing market conditions."
    },

    {
        question:
            "9. Ananya sees the following prices on her trading platform:\n\n" +
            "Bid Price = 1.3050\n" +
            "Ask Price = 1.3052\n\n" +
            "She wants to BUY the currency pair. At which price will her trade be executed?",
        options: [
            "1.3052 (Ask Price)",
            "1.3050 (Bid Price)",
            "1.3048",
            "The average of both prices"
        ],
        answer: 0,
        explanation:
            "Correct!\n\n" +
            "Every BUY order is executed at the Ask Price.\n\n" +
            "In this example, Ananya will buy at 1.3052.\n\n" +
            "Remember:\n\n" +
            "Ask = Buy."
    },

    {
        question: "10. Coach Strativo asks: Which statement best summarizes the most important lesson about Bid Price, Ask Price and Spread?",
        options: [
            "The Spread is the profit earned by every trader when opening a trade.",
            "Buy trades use the Ask Price, Sell trades use the Bid Price, and the Spread is the difference between them.",
            "The Bid Price is always higher than the Ask Price.",
            "Buy and Sell trades always use the same price, and the Spread changes the currency pair."
        ],
        answer: 1,
        explanation:
            "Excellent!\n\n" +
            "You have understood the core concept of this lesson.\n\n" +
            "BUY orders are executed at the Ask Price, SELL orders are executed at the Bid Price, and the Spread is the difference between these two prices.\n\n" +
            "Mastering these concepts is an essential step toward becoming a confident Forex trader."
    }
];


/* =========================================================
   QUIZ STATE
========================================================= */

let currentQuestion = 0;
let selectedAnswers = [];


/* =========================================================
   STORAGE
========================================================= */

const QUIZ_PREFIX = getQuizPrefix();
const QUIZ_STATE_KEY = `${QUIZ_PREFIX}_quizState`;


/* =========================================================
   GET LESSON PREFIX
========================================================= */

function getQuizPrefix() {
    const path = window.location.pathname || "";
    const pageName =
        path.substring(path.lastIndexOf("/") + 1);

    const match =
        pageName.match(/lesson\d+/i);

    return match
        ? match[0].toLowerCase()
        : "lesson3";
}


/* =========================================================
   HELPERS
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
        console.warn(
            "Quiz state could not be saved.",
            error
        );
    }
}


/* =========================================================
   LOAD QUIZ STATE
========================================================= */

function loadQuizState() {
    try {
        const raw =
            localStorage.getItem(
                QUIZ_STATE_KEY
            );

        if (!raw) {
            return;
        }

        const saved =
            JSON.parse(raw);

        if (
            !saved ||
            typeof saved !== "object"
        ) {
            return;
        }

        if (
            Number.isInteger(
                saved.currentQuestion
            )
        ) {
            currentQuestion =
                Math.min(
                    Math.max(
                        saved.currentQuestion,
                        0
                    ),
                    quiz.length - 1
                );
        }

        if (
            Array.isArray(
                saved.selectedAnswers
            )
        ) {
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
   CLEAR CURRENT ATTEMPT
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
   SHOW RESULT
========================================================= */

function setQuizResult(message) {

    const result =
        getElement("quiz-result");

    if (result) {
        result.innerHTML = message;
    }
}


/* =========================================================
   LOCK ANSWERS
========================================================= */

function lockAnswerButtons(locked) {

    for (
        let i = 0;
        i < 4;
        i += 1
    ) {

        const button =
            getElement(
                `option${i}`
            );

        if (!button) {
            continue;
        }

        button.disabled = locked;

        button.setAttribute(
            "aria-disabled",
            locked
                ? "true"
                : "false"
        );
    }
}


/* =========================================================
   UPDATE QUESTION BUTTONS
========================================================= */

function updateQuestionButtons() {

    const previousButton =
        getElement(
            "prevQuestionBtn"
        );

    const nextButton =
        getElement(
            "nextQuestionBtn"
        );

    const answered =
        selectedAnswers[
            currentQuestion
        ] !== undefined;


    if (previousButton) {

        previousButton.disabled =
            currentQuestion === 0;
    }


    if (nextButton) {

        nextButton.disabled =
            !answered;

        nextButton.textContent =
            currentQuestion ===
            quiz.length - 1
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


    currentQuestion =
        Math.min(
            Math.max(
                currentQuestion,
                0
            ),
            quiz.length - 1
        );


    const current =
        quiz[currentQuestion];


    const questionElement =
        getElement("question");

    const counterElement =
        getElement(
            "question-counter"
        );


    if (questionElement) {

        /*
         * Use textContent for the
         * question itself.
         */
        questionElement.textContent =
            current.question;
    }


    if (counterElement) {

        counterElement.textContent =
            `Question ${
                currentQuestion + 1
            } of ${
                quiz.length
            }`;
    }


    /*
     * Reset answer buttons.
     */
    for (
        let i = 0;
        i < 4;
        i += 1
    ) {

        const button =
            getElement(
                `option${i}`
            );

        if (!button) {
            continue;
        }

        button.textContent =
            current.options[i] ||
            "";

        button.classList.remove(
            "correct",
            "wrong"
        );

        button.disabled =
            false;

        button.setAttribute(
            "aria-disabled",
            "false"
        );
    }


    setQuizResult("");


    /*
     * Restore previously selected
     * answer after refresh/navigation.
     */
    const selected =
        selectedAnswers[
            currentQuestion
        ];


    if (
        selected !== undefined
    ) {

        const correct =
            current.answer;


        const correctButton =
            getElement(
                `option${correct}`
            );


        const selectedButton =
            getElement(
                `option${selected}`
            );


        /*
         * Always show correct answer.
         */
        if (correctButton) {

            correctButton.classList.add(
                "correct"
            );
        }


        /*
         * Show wrong selected answer.
         */
        if (
            selected !== correct &&
            selectedButton
        ) {

            selectedButton.classList.add(
                "wrong"
            );
        }


        /*
         * Prevent changing the answer.
         */
        lockAnswerButtons(
            true
        );


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

        lockAnswerButtons(
            false
        );
    }


    updateQuestionButtons();

    saveQuizState();
}


/* =========================================================
   CHECK ANSWER
========================================================= */

function checkAnswer(index) {

    /*
     * Prevent changing an answer.
     */
    if (
        selectedAnswers[
            currentQuestion
        ] !== undefined
    ) {
        return;
    }


    /*
     * Validate selected option.
     */
    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >=
            quiz[currentQuestion]
                .options.length
    ) {
        return;
    }


    selectedAnswers[
        currentQuestion
    ] = index;


    const correct =
        quiz[
            currentQuestion
        ].answer;


    const correctButton =
        getElement(
            `option${correct}`
        );


    const selectedButton =
        getElement(
            `option${index}`
        );


    /*
     * Mark correct answer.
     */
    if (correctButton) {

        correctButton.classList.add(
            "correct"
        );
    }


    /*
     * Mark wrong answer.
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
     * Lock buttons.
     */
    lockAnswerButtons(
        true
    );


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
            quiz[
                currentQuestion
            ].explanation
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
     * Student must answer.
     */
    if (
        selectedAnswers[
            currentQuestion
        ] === undefined
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

    if (
        currentQuestion <= 0
    ) {
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
            (
                finalScore /
                quiz.length
            ) * 100
        );


    const passed =
        percentage >= 70;


    /*
     * Save completion/mastery state.
     */
    if (
        typeof window.unlockedStep !==
        "undefined"
    ) {

        window.unlockedStep =
            10;
    }


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
     * Best score.
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
     * Attempts.
     */
    const attempts =
        Number.parseInt(
            localStorage.getItem(
                `${QUIZ_PREFIX}_quizAttempts`
            ) || "0",
            10
        ) + 1;


    localStorage.setItem(
        `${QUIZ_PREFIX}_quizAttempts`,
        String(attempts)
    );


    /*
     * Find Step 10 result box.
     */
    const step10 =
        getElement("step10");


    let resultBox =
        document.querySelector(
            "#step10 .quiz-final-result"
        );


    /*
     * Create result box if
     * it does not already exist.
     */
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
     * Fallback if Step 10 cannot
     * be found.
     */
    if (!resultBox) {

        setQuizResult(

            `<strong>${
                getScoreMessage(
                    percentage
                )
            }</strong><br><br>` +

            `Score: ${finalScore} / ${quiz.length}<br>` +

            `Percentage: ${percentage}%`
        );

        return;
    }


    /*
     * Continue button only if
     * student passed.
     */
    const continueButton =
        passed

            ? `
                <a
                    href="lesson4.html"
                    class="btn btn-primary"
                >
                    🚀 Continue to Lesson 4
                </a>
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
                        ? "Lesson 3 Quiz Passed!"
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
                ${getStars(
                    percentage
                )}
            </h3>


            <p style="
                line-height:1.7;
            ">
                ${
                    getScoreMessage(
                        percentage
                    )
                }
            </p>


            <p style="
                margin-top:12px;
                color:#aebdd0;
                line-height:1.7;
            ">
                ${
                    passed
                        ? "You have passed the Lesson 3 mastery target. Review your mistakes if necessary, then continue to Lesson 4."
                        : "The mastery target is 70%. Review Lesson 3 and retry the quiz when you are ready."
                }
            </p>


            <div style="
                display:flex;
                justify-content:center;
                align-items:center;
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

        window.showStep(
            10
        );
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    saveQuizState();
}


/* =========================================================
   RETRY QUIZ
========================================================= */

function retryQuiz() {

    /*
     * Reset current attempt.
     * Best score and historical
     * attempts remain saved.
     */
    clearQuizAttemptState();


    if (
        typeof window.showStep ===
        "function"
    ) {

        window.showStep(
            9
        );
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