/* ==========================================
   STRATIVO ACADEMY
   Lesson 6 Quiz Engine v2.2
   State-Safe / Separate Quiz File
========================================== */

const quiz = [

    {
        question:
            "1. Rahul wants to start trading Forex but doesn't know how to interact with his broker. What exactly is an 'Order' in trading?",

        options: [
            "A fee charged by the broker for opening an account.",
            "An instruction you send to your broker to place a trade.",
            "A type of Forex chart used by professionals.",
            "A tool used to measure how many pips a currency moves."
        ],

        answer: 1,

        explanation:
            "Correct!\n\n" +
            "An Order is simply your instruction to the broker.\n\n" +
            "It tells them exactly what you want to buy or sell, and how you want to do it."
    },


    {
        question:
            "2. Priya sees a major breaking news event and wants to enter a EUR/USD buy trade immediately before the price jumps higher. Which order type should she use?",

        options: [
            "Buy Stop",
            "Buy Limit",
            "Market Order",
            "Take Profit"
        ],

        answer: 2,

        explanation:
            "Correct!\n\n" +
            "A Market Order is used when you want to buy or sell RIGHT NOW at the current available price.\n\n" +
            "It is the best choice for instant action."
    },


    {
        question:
            "3. Aman is going to sleep but wants his broker to automatically open a trade if the price reaches a specific level overnight. What should he use?",

        options: [
            "Pending Order",
            "Instant Execution",
            "Market Order",
            "Stop Loss"
        ],

        answer: 0,

        explanation:
            "Correct!\n\n" +
            "A Pending Order tells the broker to wait patiently.\n\n" +
            "It will only open the trade automatically if the market reaches the specific price Aman chose."
    },


    {
        question:
            "4. Sarah believes the price of Gold will drop to $2,000, hit a floor, and then bounce back up. Which order should she place at $2,000 to catch this move?",

        options: [
            "Buy Stop",
            "Buy Limit",
            "Sell Limit",
            "Sell Stop"
        ],

        answer: 1,

        explanation:
            "Correct!\n\n" +
            "You use a Buy Limit when you expect the price to drop to a certain level and then bounce back up.\n\n" +
            "It lets you buy at a cheaper price."
    },


    {
        question:
            "5. Vikram notices the price is climbing towards a strong ceiling (resistance). He expects the price to hit the ceiling and fall back down. Which order should he use?",

        options: [
            "Buy Limit",
            "Sell Stop",
            "Buy Stop",
            "Sell Limit"
        ],

        answer: 3,

        explanation:
            "Correct!\n\n" +
            "A Sell Limit is placed above the current price.\n\n" +
            "It is used when you expect the market to go up, hit a ceiling, and reverse downwards."
    },


    {
        question:
            "6. The market is pushing higher. Neha believes if the price breaks above 1.1050, it will explode even higher. She wants to jump in only if it breaks that line. What order should she use?",

        options: [
            "Buy Stop",
            "Sell Limit",
            "Market Order",
            "Buy Limit"
        ],

        answer: 0,

        explanation:
            "Correct!\n\n" +
            "A Buy Stop is placed above the current price.\n\n" +
            "You use it when you expect the price to break through a level and keep going up without stopping."
    },


    {
        question:
            "7. Raj is watching a downtrend. He thinks if the price drops below a specific floor (1.0500), it will crash much lower. He wants to enter a sell trade automatically if it crosses that floor. Which order is best?",

        options: [
            "Buy Limit",
            "Sell Limit",
            "Sell Stop",
            "Market Order"
        ],

        answer: 2,

        explanation:
            "Correct!\n\n" +
            "A Sell Stop is placed below the current price.\n\n" +
            "It triggers a sell trade when the price breaks down through a level and keeps falling."
    },


    {
        question:
            "8. Why is a Stop Loss (SL) considered the most important tool for a trader?",

        options: [
            "It automatically closes a losing trade to protect the account from huge losses.",
            "It guarantees every trade you take will make money.",
            "It increases the leverage on the account.",
            "It forces the broker to give you a better entry price."
        ],

        answer: 0,

        explanation:
            "Correct!\n\n" +
            "A Stop Loss is your safety net.\n\n" +
            "If a trade goes against you, the Stop Loss cuts the trade early so you only lose a small amount, helping protect your account."
    },


    {
        question:
            "9. Tina opens a trade and sets a Take Profit (TP). What happens when the price hits her TP level?",

        options: [
            "Her trade is cancelled.",
            "The trade reverses direction immediately.",
            "Her broker calls to ask if she wants to stay in the trade.",
            "Her trade automatically closes and her winnings are locked into her account balance."
        ],

        answer: 3,

        explanation:
            "Correct!\n\n" +
            "A Take Profit automatically closes the trade when the market reaches your target.\n\n" +
            "This helps secure your planned profit before the market can reverse."
    },


    {
        question:
            "10. Coach Strativo asks: 'You bought EUR/USD at 1.1000. You want to secure your profit at 1.1050, but you want to cut your losses safely if it drops to 1.0980.' Where should your SL and TP be?",

        options: [
            "SL at 1.1050, TP at 1.0980",
            "SL at 1.1000, TP at 1.1050",
            "SL at 1.0980, TP at 1.1050",
            "SL and TP both at 1.1000"
        ],

        answer: 2,

        explanation:
            "Excellent!\n\n" +
            "Since you bought at 1.1000:\n\n" +
            "Stop Loss goes below the entry price at 1.0980.\n\n" +
            "Take Profit goes above the entry price at 1.1050.\n\n" +
            "This protects the trade on the downside while targeting profit on the upside."
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
        : "lesson6";
}


/* =========================================================
   HELPERS
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
            "Lesson 6 quiz state could not be saved.",
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
            "Lesson 6 quiz state could not be loaded.",
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
            "Lesson 6 quiz attempt could not be cleared.",
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
   LOCK ANSWER BUTTONS
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
        quiz[
            currentQuestion
        ];


    const questionElement =
        getElement(
            "question"
        );


    const counterElement =
        getElement(
            "question-counter"
        );


    /*
     * New standardized HTML.
     */

    if (questionElement) {

        questionElement.textContent =
            current.question;

    }


    /*
     * Old HTML fallback.
     */

    const oldQuestionElement =
        getElement(
            "question-title"
        );


    if (
        !questionElement &&
        oldQuestionElement
    ) {

        oldQuestionElement.textContent =
            current.question;

    }


    /*
     * Question counter.
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
     * Reset standard buttons.
     */

    const standardButtonsExist =
        !!getElement("option0");


    if (standardButtonsExist) {

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
                "wrong",
                "answered"
            );


            button.disabled =
                false;


            button.removeAttribute(
                "style"
            );


            button.setAttribute(
                "aria-disabled",
                "false"
            );

        }

    }


    /*
     * Old HTML fallback.
     */

    const answersContainer =
        getElement(
            "answers-container"
        );


    if (
        !standardButtonsExist &&
        answersContainer
    ) {

        answersContainer.innerHTML =
            "";


        for (
            let i = 0;
            i < 4;
            i += 1
        ) {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "quiz-option";


            button.id =
                `option${i}`;


            button.textContent =
                current.options[i] ||
                "";


            button.addEventListener(
                "click",
                function () {

                    checkAnswer(i);

                }
            );


            answersContainer.appendChild(
                button
            );

        }

    }


    /*
     * Clear old result.
     */

    setQuizResult("");


    /*
     * Restore selected answer
     * after refresh/navigation.
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
         * Show wrong selection.
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
         * Disable all answers.
         */

        lockAnswerButtons(
            true
        );


        /*
         * Explanation.

         */

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
     * Don't allow a second answer.
     */

    if (
        selectedAnswers[
            currentQuestion
        ] !== undefined
    ) {

        return;

    }


    /*
     * Validate index.
     */

    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >=
            quiz[
                currentQuestion
            ].options.length
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


        /*
         * Fallback styling for
         * old quiz CSS.

         */

        correctButton.style.background =
            "rgba(0, 229, 168, 0.10)";

        correctButton.style.borderColor =
            "#00e5a8";

        correctButton.style.color =
            "#00e5a8";

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


        selectedButton.style.background =
            "rgba(239, 68, 68, 0.10)";

        selectedButton.style.borderColor =
            "#ef4444";

        selectedButton.style.color =
            "#ef4444";

    }


    /*
     * Lock answers.

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
     * Require an answer.

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
     * Finish on the last question.

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

    if (
        percentage >= 90
    ) {

        return "🌟 Outstanding!";

    }


    if (
        percentage >= 70
    ) {

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

    if (
        percentage === 100
    ) {

        return "⭐⭐⭐⭐⭐";

    }


    if (
        percentage >= 80
    ) {

        return "⭐⭐⭐⭐☆";

    }


    if (
        percentage >= 70
    ) {

        return "⭐⭐⭐☆☆";

    }


    if (
        percentage >= 60
    ) {

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
     * Save full score data.
     */

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
     * Mark lesson summary as
     * unlocked after passing.
     */

    if (passed) {

        localStorage.setItem(
            `${QUIZ_PREFIX}_unlockedStep`,
            "10"
        );


        if (
            typeof window.unlockedStep !==
            "undefined"
        ) {

            window.unlockedStep =
                10;

        }

    }


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
     * Find/create Step 10 result box.
     */

    const step10 =
        getElement(
            "step10"
        );


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
     * Fallback.

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
     * Continue button.

     */

    const continueButton =
        passed

            ? `
                <a
                    href="lesson7.html"
                    class="btn btn-primary"
                >
                    🚀 Continue to Lesson 7
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
                        ? "Lesson 6 Quiz Passed!"
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
                ${
                    getStars(
                        percentage
                    )
                }
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

                        ? "You have passed the Lesson 6 mastery target. Review your mistakes if necessary, then continue to Lesson 7."

                        : "The mastery target is 70%. Review Lesson 6 and retry the quiz when you are ready."

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
     * Show Step 10.
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
     * Reset current attempt only.
     *
     * Best score and attempt history
     * remain saved.
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
         * Standard Lesson 6 HTML uses #question.
         *
         * Old markup fallback uses #question-title.
         */

        if (
            !getElement("question") &&
            !getElement("question-title")
        ) {

            return;

        }


        loadQuizState();

        loadQuestion();

    }
);