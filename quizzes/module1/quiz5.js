/* ==========================================
   STRATIVO ACADEMY
   Lesson 5 Quiz Engine v2.2
   State-Safe / Separate Quiz File
========================================== */

const quiz = [
    {
        question:
            "1. Rahul wants to open a Forex trade worth $10,000, but he only has $100 available as Margin. Which Forex feature allows him to control this larger trading position?",
        options: [
            "Leverage",
            "Spread",
            "Pip Value",
            "Lot Size"
        ],
        answer: 0,
        explanation:
            "Correct!\n\n" +
            "Leverage allows traders to control a larger trading position using only a small amount of money called Margin.\n\n" +
            "It increases both potential profits and potential losses."
    },

    {
        question:
            "2. Priya wants to understand what Margin is before placing her first Forex trade. Which statement correctly describes Margin?",
        options: [
            "Margin is the profit earned from a successful trade.",
            "Margin is a fee charged by the broker for every trade.",
            "Margin is the amount of money required to open and maintain a leveraged trade.",
            "Margin is the difference between the Bid and Ask Price."
        ],
        answer: 2,
        explanation:
            "Correct!\n\n" +
            "Margin is the amount of money you must have in your trading account to open and maintain a leveraged trade.\n\n" +
            "It acts like a security deposit and is not a trading fee."
    },

    {
        question:
            "3. Aman opens a Forex trade using 1:100 Leverage. Which statement is correct about what this leverage does?",
        options: [
            "It guarantees that the trade will be profitable.",
            "It allows Aman to control a larger trading position with a smaller amount of Margin.",
            "It removes all trading risk.",
            "It changes the direction of the market."
        ],
        answer: 1,
        explanation:
            "Correct!\n\n" +
            "Leverage allows traders to control a larger trading position by using a smaller amount of their own money as Margin.\n\n" +
            "It does not guarantee profits or remove trading risk."
    },

    {
        question:
            "4. Sarah has a trading account with $1,000. She compares two brokers: one offers 1:10 Leverage and the other offers 1:100 Leverage. Which statement is correct?",
        options: [
            "Both brokers require exactly the same Margin for every trade.",
            "1:10 Leverage always produces higher profits than 1:100 Leverage.",
            "Leverage changes the direction of the Forex market.",
            "The broker offering 1:100 Leverage requires less Margin to control the same trade size."
        ],
        answer: 3,
        explanation:
            "Correct!\n\n" +
            "Higher Leverage means less Margin is required to control the same trading position.\n\n" +
            "However, higher Leverage also increases potential risk because profits and losses are calculated on the full trade size."
    },

    {
        question:
            "5. Vikram wants to reduce his trading risk while learning Forex. Which approach is the BEST choice when using Leverage?",
        options: [
            "Use lower Leverage and follow proper risk management.",
            "Always choose the highest Leverage available.",
            "Ignore Margin because Leverage removes trading risk.",
            "Increase Leverage after every winning trade."
        ],
        answer: 0,
        explanation:
            "Correct!\n\n" +
            "Lower Leverage combined with good risk management helps traders protect their capital.\n\n" +
            "Professional traders focus on managing risk rather than using the highest Leverage available."
    },

    {
        question:
            "6. Neha wants to open a Forex trade worth $20,000. Her broker offers 1:100 Leverage. Approximately how much Margin is required to open this trade?",
        options: [
            "$20,000",
            "$2,000",
            "$200",
            "$20"
        ],
        answer: 2,
        explanation:
            "Correct!\n\n" +
            "Margin is calculated by dividing the Trade Size by the Leverage.\n\n" +
            "$20,000 ÷ 100 = $200.\n\n" +
            "Higher Leverage reduces the Margin required to control the same trade size."
    },

    {
        question:
            "7. Aman says, 'If I use the highest Leverage available, I will definitely become a better trader.' What is the correct response?",
        options: [
            "Correct. Higher Leverage automatically makes traders more successful.",
            "Incorrect. Leverage only increases trading power. Success depends on strategy, discipline, and risk management.",
            "Correct. Professional traders always use the highest Leverage available.",
            "Incorrect. Leverage has no effect on trading at all."
        ],
        answer: 1,
        explanation:
            "Correct!\n\n" +
            "Leverage is simply a trading tool.\n\n" +
            "It does not improve your trading skills or guarantee profits.\n\n" +
            "Long-term success comes from having a good strategy, proper risk management, and emotional discipline."
    },

    {
        question:
            "8. Riya opens a leveraged Forex trade. Shortly after, the market moves against her position. Which statement is correct?",
        options: [
            "Leverage protects her from all trading losses.",
            "Leverage guarantees the market will reverse in her favour.",
            "Only her Margin is affected; the trade cannot lose more.",
            "Leverage can increase the size of both profits and losses because they are based on the full trade size."
        ],
        answer: 3,
        explanation:
            "Correct!\n\n" +
            "Leverage increases your market exposure.\n\n" +
            "Although you only deposit a small amount of Margin, your profits and losses are calculated using the full trade size.\n\n" +
            "This is why leverage can magnify both gains and losses."
    },

    {
        question:
            "9. Two traders open the same Forex trade worth $10,000. Trader A uses 1:10 Leverage, while Trader B uses 1:100 Leverage. Which statement is correct?",
        options: [
            "Trader B needs less Margin to open the same trade because higher Leverage requires less Margin.",
            "Trader A and Trader B both need exactly the same Margin.",
            "Trader A needs less Margin because lower Leverage always requires less money.",
            "Leverage changes the size of the Forex market."
        ],
        answer: 0,
        explanation:
            "Correct!\n\n" +
            "Higher Leverage reduces the amount of Margin required to control the same trade size.\n\n" +
            "Although both traders control a $10,000 position, Trader B needs less Margin because of the higher Leverage."
    },

    {
        question:
            "10. Coach Strativo asks: Which statement best summarizes the purpose of Leverage and Margin in Forex trading?",
        options: [
            "Leverage guarantees higher profits, and Margin removes all trading risk.",
            "Leverage allows traders to control larger positions with less capital, while Margin is the money required to open and maintain those positions.",
            "Leverage changes the direction of the market, while Margin determines currency prices.",
            "Leverage and Margin are only used by professional traders and are not available to beginners."
        ],
        answer: 1,
        explanation:
            "Excellent!\n\n" +
            "Leverage allows traders to control larger trading positions using a smaller amount of their own money.\n\n" +
            "Margin is the amount required to open and maintain those leveraged positions.\n\n" +
            "Both are powerful tools that must always be used with proper risk management."
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

    const path =
        window.location.pathname || "";

    const pageName =
        path.substring(
            path.lastIndexOf("/") + 1
        );

    const match =
        pageName.match(/lesson\d+/i);

    return match
        ? match[0].toLowerCase()
        : "lesson5";
}


/* =========================================================
   BASIC HELPERS
========================================================= */

function getElement(id) {

    return document.getElementById(id);

}


function formatExplanation(text) {

    return String(text)
        .replace(/\n/g, "<br>");

}


/* =========================================================
   SAVE QUIZ STATE
========================================================= */

function saveQuizState() {

    try {

        localStorage.setItem(
            QUIZ_STATE_KEY,
            JSON.stringify({

                currentQuestion:
                    currentQuestion,

                selectedAnswers:
                    selectedAnswers,

                savedAt:
                    Date.now()

            })
        );

    } catch (error) {

        console.warn(
            "Lesson 5 quiz state could not be saved.",
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
            "Lesson 5 quiz state could not be loaded.",
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
            "Lesson 5 quiz attempt could not be cleared.",
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

        result.innerHTML =
            message;

    }

}


/* =========================================================
   LOCK ANSWERS
========================================================= */

function lockAnswerButtons(
    locked
) {

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


        button.disabled =
            locked;


        button.setAttribute(
            "aria-disabled",
            locked
                ? "true"
                : "false"
        );

    }

}


/* =========================================================
   UPDATE NAVIGATION BUTTONS
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


    /*
     * Question text.
     */

    if (questionElement) {

        questionElement.textContent =
            current.question;

    }


    /*
     * Question number.
     */

    if (counterElement) {

        counterElement.textContent =
            `Question ${
                currentQuestion + 1
            } of ${
                quiz.length
            }`;

    }


    /*
     * Reset all answer buttons.
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
     * Restore existing answer
     * after reload/navigation.
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
         * Always reveal the
         * correct answer.
         */

        if (correctButton) {

            correctButton.classList.add(
                "correct"
            );

        }


        /*
         * Mark the selected wrong
         * answer if applicable.
         */

        if (
            selected !== correct &&
            selectedButton
        ) {

            selectedButton.classList.add(
                "wrong"
            );

        }


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
     * Don't allow an answer
     * to be changed.
     */

    if (
        selectedAnswers[
            currentQuestion
        ] !== undefined
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
     * Highlight correct answer.
     */

    if (correctButton) {

        correctButton.classList.add(
            "correct"
        );

    }


    /*
     * Highlight wrong selected
     * answer.
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

    lockAnswerButtons(
        true
    );


    /*
     * Give immediate feedback.
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
     * Student must answer
     * before continuing.
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
   STAR RATING
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
     * Lesson mastery.
     */

    if (
        typeof window.unlockedStep !==
        "undefined"
    ) {

        window.unlockedStep =
            10;

    }


    /*
     * Save score information.
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
     * Attempt count.
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
     * Fallback if Step 10
     * doesn't exist.
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
     * Continue to Lesson 6
     * only after passing.
     */

    const continueButton =
        passed

            ? `
                <a
                    href="lesson6.html"
                    class="btn btn-primary"
                >
                    🚀 Continue to Lesson 6
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
                ${
                    passed
                        ? "🏆"
                        : "📚"
                }
            </div>


            <h2>
                ${
                    passed
                        ? "Lesson 5 Quiz Passed!"
                        : "Keep Practicing"
                }
            </h2>


            <p>
                <strong>
                    Your Score
                </strong>
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
                <strong>
                    Percentage
                </strong>
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

                        ? "You have passed the Lesson 5 mastery target. Review your mistakes if necessary, then continue to Lesson 6."

                        : "The mastery target is 70%. Review Lesson 5 and retry the quiz when you are ready."
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
     * Reset the current attempt
     * without deleting historical
     * best score / attempts.
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

        /*
         * Lesson 5 standardized HTML
         * uses #question.
         */

        if (
            !getElement("question")
        ) {

            return;
        }


        loadQuizState();

        loadQuestion();

    }
);