/* ==========================================
   STRATIVO ACADEMY
   Lesson 4 Quiz Engine v2.1
   State-Safe / Separate Quiz File
========================================== */

const quiz = [
    {
        question: "1. Rahul opens a Forex chart and notices that EUR/USD moved from 1.1050 to 1.1060. What does this movement represent?",
        options: [
            "A movement of 10 Pips",
            "A movement of 1 Pip",
            "A movement of 100 Pips",
            "A movement of 5 Pips"
        ],
        answer: 0,
        explanation:
            "Correct!\n\n" +
            "EUR/USD moved from 1.1050 to 1.1060, which is a difference of 0.0010 or 10 Pips.\n\n" +
            "Traders use Pips to measure price movement in the Forex market."
    },

    {
        question: "2. Priya wants to measure how much the GBP/USD currency pair has moved during the day. Which unit should she use?",
        options: [
            "Lots",
            "Spread",
            "Pips",
            "Leverage"
        ],
        answer: 2,
        explanation:
            "Correct!\n\n" +
            "Pips are the standard unit used to measure price movement in the Forex market.\n\n" +
            "Traders use Pips to describe how far a currency pair has moved."
    },

    {
        question: "3. Arjun tells his friend, 'A Pip tells me how much money I will earn.' Which statement correctly explains what a Pip actually measures?",
        options: [
            "A Pip measures the size of your trade.",
            "A Pip measures how much the price of a currency pair has moved.",
            "A Pip measures the amount of leverage used.",
            "A Pip measures the total balance in a trading account."
        ],
        answer: 1,
        explanation:
            "Correct!\n\n" +
            "A Pip is the standard unit used to measure price movement in the Forex market.\n\n" +
            "It does not measure trade size, leverage, or account balance."
    },

    {
        question: "4. Neha opens two trades that both gain 20 Pips. She uses a Micro Lot on the first trade and a Standard Lot on the second trade. Why will the profits be different?",
        options: [
            "Because Pips change their value every minute.",
            "Because the currency pair decides the profit automatically.",
            "Because both trades will always make the same profit.",
            "Because the Lot Size determines how much each Pip is worth."
        ],
        answer: 3,
        explanation:
            "Correct!\n\n" +
            "Both trades gained the same number of Pips, but the Lot Size determines the value of each Pip.\n\n" +
            "A larger Lot Size means each Pip is worth more money, resulting in a larger profit or loss."
    },

    {
        question: "5. Vikram has just opened his first Forex trading account. He wants to keep his risk as low as possible while gaining real trading experience. Which Lot Size is the BEST choice?",
        options: [
            "Micro Lot (1,000 units)",
            "Standard Lot (100,000 units)",
            "Mini Lot (10,000 units)",
            "The largest Lot Size available"
        ],
        answer: 0,
        explanation:
            "Correct!\n\n" +
            "A Micro Lot (1,000 units) is generally a smaller trade size than a Mini or Standard Lot.\n\n" +
            "It can help a beginner gain market experience while keeping potential profits and losses smaller."
    },

    {
        question: "6. Riya places a trade using a Mini Lot. The market moves 10 Pips in her favour. Why will she earn more money than a trader using a Micro Lot with the same 10-Pip movement?",
        options: [
            "Because the market moved more Pips for the Mini Lot.",
            "Because Mini Lots always guarantee higher profits.",
            "Because each Pip is worth more when trading a Mini Lot.",
            "Because the broker gives extra money for Mini Lots."
        ],
        answer: 2,
        explanation:
            "Correct!\n\n" +
            "Both traders captured the same 10 Pips, but the Mini Lot has a higher Pip Value than the Micro Lot.\n\n" +
            "This means each Pip is worth more money, resulting in a larger profit or loss."
    },

    {
        question: "7. Aman says, 'If I use a Standard Lot instead of a Micro Lot, I will have a better chance of winning the trade.' What is the correct response?",
        options: [
            "Correct. A larger Lot Size increases the chance of winning.",
            "Incorrect. A larger Lot Size only changes how much money each Pip is worth, not the probability of winning.",
            "Correct. Standard Lots always make more profitable trades.",
            "Incorrect. Lot Size only changes the spread."
        ],
        answer: 1,
        explanation:
            "Correct!\n\n" +
            "Lot Size does not determine whether a trade wins or loses.\n\n" +
            "It changes how much money you gain or lose for each Pip the market moves.\n\n" +
            "Good trading decisions and risk management determine long-term success."
    },

    {
        question: "8. Sarah opens a trade using a Standard Lot. The market moves 15 Pips against her. Which statement is correct?",
        options: [
            "She will lose less money than if she had used a Micro Lot.",
            "The 15-Pip movement will automatically become 30 Pips.",
            "Lot Size has no effect on the amount of money lost.",
            "She will lose more money because each Pip is worth more with a Standard Lot."
        ],
        answer: 3,
        explanation:
            "Correct!\n\n" +
            "The market moved the same 15 Pips, but a Standard Lot has a much higher Pip Value than a Micro Lot.\n\n" +
            "This means each Pip is worth more money, so the total loss is larger."
    },

    {
        question: "9. Two traders each capture 25 Pips on the EUR/USD currency pair. Trader A uses a Micro Lot, while Trader B uses a Mini Lot. Which statement is correct?",
        options: [
            "Trader B will make more money because a Mini Lot has a higher Pip Value.",
            "Both traders will always make exactly the same amount of money.",
            "Trader A will make more money because a Micro Lot is safer.",
            "The number of Pips changes depending on the Lot Size."
        ],
        answer: 0,
        explanation:
            "Correct!\n\n" +
            "Both traders captured the same 25 Pips, but a Mini Lot has a higher Pip Value than a Micro Lot.\n\n" +
            "Therefore, Trader B earns more money even though the market moved the same number of Pips."
    },

    {
        question: "10. Coach Strativo asks: Which statement best summarizes the relationship between Pips and Lots in Forex trading?",
        options: [
            "A Pip measures trade size, while a Lot measures price movement.",
            "A Pip measures price movement, while a Lot measures trade size. Together they determine your potential profit or loss.",
            "A Pip and a Lot always have the same monetary value.",
            "The Lot Size changes the number of Pips the market moves."
        ],
        answer: 1,
        explanation:
            "Excellent!\n\n" +
            "A Pip measures how far the market moves, while a Lot measures the size of your trade.\n\n" +
            "Together, these concepts help determine how much money you may gain or lose on a trade.\n\n" +
            "Understanding both is a fundamental Forex skill."
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
        : "lesson4";
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
        quiz[currentQuestion];


    const questionElement =
        getElement("question");


    const counterElement =
        getElement(
            "question-counter"
        );


    if (questionElement) {

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
     * Reset buttons.
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
            current.options[i] || "";


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
     * Restore previous answer
     * if one was already selected.
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
     * Prevent changing an answer
     * after selection.
     */

    if (
        selectedAnswers[
            currentQuestion
        ] !== undefined
    ) {

        return;
    }


    /*
     * Validate option.
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
     * Correct answer.
     */

    if (correctButton) {

        correctButton.classList.add(
            "correct"
        );

    }


    /*
     * Wrong answer.
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
     * Lock all answers.
     */

    lockAnswerButtons(
        true
    );


    /*
     * Explain result.
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
   STARS
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
     * Mark lesson mastery.
     */

    if (
        typeof window.unlockedStep !==
        "undefined"
    ) {

        window.unlockedStep =
            10;

    }


    /*
     * Save quiz data.
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
     * Step 10 result box.
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
     * Fallback result.
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
     * Continue to Lesson 5
     * only after passing.
     */

    const continueButton =
        passed

            ? `
                <a
                    href="lesson5.html"
                    class="btn btn-primary"
                >
                    🚀 Continue to Lesson 5
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
                        ? "Lesson 4 Quiz Passed!"
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

                        ? "You have passed the Lesson 4 mastery target. Review your mistakes if necessary, then continue to Lesson 5."

                        : "The mastery target is 70%. Review Lesson 4 and retry the quiz when you are ready."
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
     * Go to Step 10.
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
     * Reset only the current attempt.
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

        if (
            !getElement("question")
        ) {

            return;
        }


        loadQuizState();

        loadQuestion();

    }
);