"use strict";

/*
 * ============================================================
 * STRATIVO ACADEMY
 * Lesson 9 Quiz — Trendlines & Channels
 *
 * 10 Questions
 * Pass: 70%
 * Reward: +50 XP once
 * Unlock: Lesson 10
 * ============================================================
 */


/* ============================================================
   QUIZ DATA
============================================================ */

const QUIZ9_DATA = [

    {
        question:
            "What is the main purpose of a trendline?",

        options: [
            "To predict exact future prices",
            "To identify the direction of price movement",
            "To calculate trading volume",
            "To measure market volatility"
        ],

        correct: 1,

        explanation:
            "Trendlines help identify the direction of the market trend."
    },

    {
        question:
            "A bullish trendline is normally created by connecting:",

        options: [
            "Lower highs",
            "Random candles",
            "Higher lows",
            "Closing prices only"
        ],

        correct: 2,

        explanation:
            "A bullish trendline connects important higher lows."
    },

    {
        question:
            "A bearish trendline is normally created by connecting:",

        options: [
            "Higher highs",
            "Lower highs",
            "Higher lows",
            "Random wicks"
        ],

        correct: 1,

        explanation:
            "A bearish trendline connects important lower highs."
    },

    {
        question:
            "Which generally makes a trendline stronger?",

        options: [
            "More valid touches",
            "Changing it every candle",
            "Drawing many random lines",
            "Ignoring swing points"
        ],

        correct: 0,

        explanation:
            "Multiple valid reactions from price can make a trendline more meaningful."
    },

    {
        question:
            "What is a price channel?",

        options: [
            "A single support line",
            "A moving average",
            "Two parallel trendlines containing price",
            "A candlestick pattern"
        ],

        correct: 2,

        explanation:
            "A price channel uses two parallel trendlines."
    },

    {
        question:
            "What should you normally do before trading a breakout?",

        options: [
            "Enter immediately",
            "Wait for confirmation",
            "Ignore market structure",
            "Trade every breakout"
        ],

        correct: 1,

        explanation:
            "Waiting for confirmation can help reduce false breakout entries."
    },

    {
        question:
            "A false breakout occurs when:",

        options: [
            "Price continues strongly",
            "Price quickly returns inside the trendline",
            "Volume increases",
            "The trend accelerates"
        ],

        correct: 1,

        explanation:
            "A false breakout fails and price returns back inside the previous structure."
    },

    {
        question:
            "Which practice improves trendline trading?",

        options: [
            "Using trendlines alone",
            "Ignoring higher timeframes",
            "Combining trendlines with support and resistance",
            "Trading every touch"
        ],

        correct: 2,

        explanation:
            "Combining multiple forms of confirmation creates stronger confluence."
    },

    {
        question:
            "Why should traders avoid forcing a trendline?",

        options: [
            "It can create inaccurate analysis",
            "It makes charts faster",
            "It increases volume",
            "It guarantees profits"
        ],

        correct: 0,

        explanation:
            "A forced trendline may not represent real market structure."
    },

    {
        question:
            "What is the best approach when price touches a trendline?",

        options: [
            "Trade immediately",
            "Wait for confirmation",
            "Ignore the trend",
            "Always sell"
        ],

        correct: 1,

        explanation:
            "A trendline touch alone is not enough; confirmation improves trade quality."
    }

];


/* ============================================================
   CONSTANTS
============================================================ */

const QUIZ9_STATE_KEY =
    "lesson9_quiz_state";

const QUIZ9_SCORE_KEY =
    "lesson9_quiz_score";

const QUIZ9_PERCENT_KEY =
    "lesson9_quiz_percentage";

const QUIZ9_PASS_KEY =
    "lesson9_quiz_passed";

const QUIZ9_ATTEMPTS_KEY =
    "lesson9_quiz_attempts";

const LESSON10_UNLOCK_KEY =
    "lesson10_unlocked";

const PROFILE_KEY =
    "strativo_student_profile";

const PASS_PERCENTAGE = 70;

const LESSON_XP = 50;


/* ============================================================
   STATE
============================================================ */

let quiz9Questions = [];
let quiz9Current = 0;
let quiz9Answers = [];
let quiz9Finished = false;


/* ============================================================
   HELPERS
============================================================ */

function quiz9Get(id) {
    return document.getElementById(id);
}


/* ============================================================
   SHUFFLE
============================================================ */

function shuffleArray(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];
    }

    return array;
}


/* ============================================================
   PREPARE QUIZ
============================================================ */

function prepareQuiz9() {

    quiz9Questions =
        QUIZ9_DATA.map(
            question => {

                const correctText =
                    question.options[
                        question.correct
                    ];

                const options =
                    shuffleArray(
                        [...question.options]
                    );

                return {
                    question:
                        question.question,

                    options,

                    correct:
                        options.indexOf(
                            correctText
                        ),

                    explanation:
                        question.explanation
                };
            }
        );

    quiz9Current = 0;

    quiz9Answers =
        new Array(
            quiz9Questions.length
        ).fill(null);

    quiz9Finished = false;
}


/* ============================================================
   SAVE
============================================================ */

function saveQuiz9State() {

    try {

        localStorage.setItem(
            QUIZ9_STATE_KEY,
            JSON.stringify({

                current:
                    quiz9Current,

                answers:
                    quiz9Answers,

                finished:
                    quiz9Finished,

                savedAt:
                    Date.now()
            })
        );

    } catch (error) {

        console.warn(
            "Lesson 9 quiz state could not be saved.",
            error
        );
    }
}


/* ============================================================
   LOAD
============================================================ */

function loadQuiz9State() {

    try {

        const raw =
            localStorage.getItem(
                QUIZ9_STATE_KEY
            );

        if (!raw) {
            return;
        }

        const state =
            JSON.parse(raw);

        if (
            Array.isArray(
                state.answers
            ) &&
            state.answers.length ===
                quiz9Questions.length
        ) {

            quiz9Answers =
                state.answers;
        }

        if (
            Number.isInteger(
                state.current
            )
        ) {

            quiz9Current =
                Math.min(
                    Math.max(
                        state.current,
                        0
                    ),
                    quiz9Questions.length - 1
                );
        }

        quiz9Finished =
            state.finished === true;

    } catch (error) {

        console.warn(
            "Lesson 9 quiz state could not be loaded.",
            error
        );
    }
}


/* ============================================================
   DISPLAY QUESTION
============================================================ */

function renderQuiz9Question() {

    const question =
        quiz9Questions[
            quiz9Current
        ];

    if (!question) {
        return;
    }

    const questionElement =
        quiz9Get("question");

    const answersElement =
        quiz9Get("answers");

    const nextButton =
        quiz9Get("nextQuestionBtn");

    const result =
        quiz9Get("quizResult");

    if (
        !questionElement ||
        !answersElement
    ) {
        return;
    }

    questionElement.textContent =
        `Question ${quiz9Current + 1} of ${quiz9Questions.length}: ${question.question}`;

    answersElement.innerHTML =
        "";

    question.options.forEach(
        (option, index) => {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "quiz-btn";

            button.textContent =
                option;

            button.dataset.index =
                String(index);

            button.addEventListener(
                "click",
                () => {
                    answerQuiz9(index);
                }
            );

            answersElement.appendChild(
                button
            );
        }
    );

    if (result) {

        result.style.display =
            "none";

        result.textContent =
            "";

        result.className =
            "quiz-result";
    }

    if (nextButton) {

        nextButton.disabled =
            quiz9Answers[
                quiz9Current
            ] === null;

        nextButton.textContent =
            quiz9Current ===
            quiz9Questions.length - 1
                ? "Finish Quiz →"
                : "Next Question →";
    }

    /*
     * Restore previous answer if present.
     */

    const savedAnswer =
        quiz9Answers[
            quiz9Current
        ];

    if (
        savedAnswer !== null &&
        savedAnswer !== undefined
    ) {

        const buttons =
            answersElement.querySelectorAll(
                "button"
            );

        buttons.forEach(
            (button, index) => {

                button.disabled =
                    true;

                if (
                    index ===
                    question.correct
                ) {

                    button.classList.add(
                        "correct"
                    );
                }

                if (
                    index ===
                        savedAnswer &&
                    index !==
                        question.correct
                ) {

                    button.classList.add(
                        "wrong"
                    );
                }
            }
        );
    }

    saveQuiz9State();
}


/* ============================================================
   ANSWER
============================================================ */

function answerQuiz9(index) {

    if (
        quiz9Answers[
            quiz9Current
        ] !== null
    ) {
        return;
    }

    const question =
        quiz9Questions[
            quiz9Current
        ];

    if (!question) {
        return;
    }

    quiz9Answers[
        quiz9Current
    ] =
        index;

    const buttons =
        document.querySelectorAll(
            "#answers button"
        );

    buttons.forEach(
        (button, buttonIndex) => {

            button.disabled =
                true;

            if (
                buttonIndex ===
                question.correct
            ) {

                button.classList.add(
                    "correct"
                );
            }

            if (
                buttonIndex === index &&
                index !== question.correct
            ) {

                button.classList.add(
                    "wrong"
                );
            }
        }
    );

    let explanation =
        quiz9Get(
            "quiz-explanation"
        );

    if (!explanation) {

        explanation =
            document.createElement(
                "div"
            );

        explanation.id =
            "quiz-explanation";

        explanation.style.marginTop =
            "16px";

        explanation.className =
            "lesson-card tip";

        const box =
            quiz9Get("quiz-box");

        if (box) {
            box.appendChild(
                explanation
            );
        }
    }

    if (explanation) {

        explanation.innerHTML =
            `
            <strong>💡 Explanation</strong>
            <br><br>
            ${question.explanation}
            `;

        explanation.style.display =
            "block";
    }

    const result =
        quiz9Get("quizResult");

    if (result) {

        result.style.display =
            "block";

        if (
            index ===
            question.correct
        ) {

            result.className =
                "quiz-result correct";

            result.textContent =
                "✅ Correct! Excellent work.";

        } else {

            result.className =
                "quiz-result wrong";

            result.textContent =
                "❌ Incorrect. Review the highlighted answer.";
        }
    }

    const nextButton =
        quiz9Get(
            "nextQuestionBtn"
        );

    if (nextButton) {

        nextButton.disabled =
            false;
    }

    saveQuiz9State();
}


/* ============================================================
   NEXT
============================================================ */

function nextQuiz9() {

    if (
        quiz9Answers[
            quiz9Current
        ] === null
    ) {
        return;
    }

    if (
        quiz9Current >=
        quiz9Questions.length - 1
    ) {

        finishQuiz9();

        return;
    }

    quiz9Current++;

    renderQuiz9Question();
}


/* ============================================================
   SCORE
============================================================ */

function calculateQuiz9Score() {

    let score = 0;

    quiz9Answers.forEach(
        (answer, index) => {

            if (
                answer ===
                quiz9Questions[index].correct
            ) {

                score++;
            }
        }
    );

    return score;
}


/* ============================================================
   PROFILE / XP
============================================================ */

function awardQuiz9Completion(
    score,
    percentage
) {

    let profile;

    try {

        const raw =
            localStorage.getItem(
                PROFILE_KEY
            );

        profile =
            raw
                ? JSON.parse(raw)
                : {};

    } catch (error) {

        profile = {};
    }

    if (
        !Array.isArray(
            profile.completedLessons
        )
    ) {

        profile.completedLessons =
            [];
    }

    if (
        !Array.isArray(
            profile.unlockedLessons
        )
    ) {

        profile.unlockedLessons =
            [1];
    }

    if (
        !profile.quizScores ||
        typeof profile.quizScores !==
            "object"
    ) {

        profile.quizScores =
            {};
    }

    if (
        !Array.isArray(
            profile.achievements
        )
    ) {

        profile.achievements =
            [];
    }

    profile.quizScores.lesson9 = {

        score,

        total:
            quiz9Questions.length,

        percentage,

        passed:
            true,

        completedAt:
            new Date().toISOString()
    };


    /*
     * Give XP only if Lesson 9
     * has never been completed before.
     */

    if (
        !profile.completedLessons.includes(
            9
        )
    ) {

        profile.completedLessons.push(
            9
        );

        profile.totalXP =
            (
                Number(
                    profile.totalXP
                ) || 0
            ) +
            LESSON_XP;

        profile.currentXP =
            profile.totalXP;
    }


    /*
     * Unlock Lesson 9 and Lesson 10.
     */

    if (
        !profile.unlockedLessons.includes(
            9
        )
    ) {

        profile.unlockedLessons.push(
            9
        );
    }

    if (
        !profile.unlockedLessons.includes(
            10
        )
    ) {

        profile.unlockedLessons.push(
            10
        );
    }


    profile.currentModule =
        1;

    profile.currentLesson =
        10;

    profile.lastVisitedLesson =
        10;

    profile.lastVisitDate =
        new Date()
            .toISOString()
            .split("T")[0];


    if (
        !profile.achievements.includes(
            "lesson9_complete"
        )
    ) {

        profile.achievements.push(
            "lesson9_complete"
        );
    }


    localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify(
            profile
        )
    );

    /*
     * Legacy unlock flag.
     */

    localStorage.setItem(
        LESSON10_UNLOCK_KEY,
        "true"
    );


    /*
     * Prefer the central completion
     * engine if the project provides it.
     */

    if (
        typeof window.strativoCompleteLesson ===
        "function"
    ) {

        try {

            window.strativoCompleteLesson(
                9
            );

        } catch (error) {

            console.warn(
                "Central completion engine failed.",
                error
            );
        }
    }
}


/* ============================================================
   FINISH
============================================================ */

function finishQuiz9() {

    const score =
        calculateQuiz9Score();

    const percentage =
        Math.round(
            (
                score /
                quiz9Questions.length
            ) * 100
        );

    const passed =
        percentage >=
        PASS_PERCENTAGE;


    localStorage.setItem(
        QUIZ9_SCORE_KEY,
        String(score)
    );

    localStorage.setItem(
        QUIZ9_PERCENT_KEY,
        String(percentage)
    );

    localStorage.setItem(
        QUIZ9_PASS_KEY,
        String(passed)
    );


    const attempts =
        Number.parseInt(
            localStorage.getItem(
                QUIZ9_ATTEMPTS_KEY
            ) || "0",
            10
        ) + 1;

    localStorage.setItem(
        QUIZ9_ATTEMPTS_KEY,
        String(attempts)
    );


    if (passed) {

        awardQuiz9Completion(
            score,
            percentage
        );
    }


    quiz9Finished =
        true;

    saveQuiz9State();


    const result =
        quiz9Get("quizResult");

    const scoreText =
        quiz9Get("scoreText");

    if (result) {

        result.style.display =
            "block";

        result.className =
            "quiz-result " +
            (
                passed
                    ? "correct"
                    : "wrong"
            );
    }


    if (scoreText) {

        scoreText.textContent =
            passed
                ? `🎉 You scored ${score}/${quiz9Questions.length} (${percentage}%). You passed! Lesson 10 is now unlocked.`
                : `You scored ${score}/${quiz9Questions.length} (${percentage}%). You need at least 70% to unlock Lesson 10.`;
    }


    const nextButton =
        quiz9Get(
            "nextQuestionBtn"
        );

    if (nextButton) {
        nextButton.disabled =
            true;
    }


    updateLesson10Button9();
}


/* ============================================================
   LESSON 10 BUTTON
============================================================ */

function updateLesson10Button9() {

    const container =
        quiz9Get(
            "lesson10ButtonContainer"
        );

    if (!container) {
        return;
    }

    const unlocked =
        localStorage.getItem(
            LESSON10_UNLOCK_KEY
        ) === "true";

    if (unlocked) {

        container.innerHTML =
            `
            <a
                href="lesson10.html"
                class="primary-btn"
            >
                🚀 Continue to Lesson 10
            </a>
            `;

    } else {

        container.innerHTML =
            `
            <button
                type="button"
                class="primary-btn"
                disabled
            >
                🔒 Pass the quiz to unlock Lesson 10
            </button>
            `;
    }
}


/* ============================================================
   RETRY
============================================================ */

function retryQuiz9() {

    prepareQuiz9();

    localStorage.removeItem(
        QUIZ9_SCORE_KEY
    );

    localStorage.removeItem(
        QUIZ9_PERCENT_KEY
    );

    localStorage.removeItem(
        QUIZ9_PASS_KEY
    );

    localStorage.removeItem(
        QUIZ9_STATE_KEY
    );

    const result =
        quiz9Get("quizResult");

    const scoreText =
        quiz9Get("scoreText");

    const explanation =
        quiz9Get(
            "quiz-explanation"
        );

    if (result) {

        result.style.display =
            "none";

        result.textContent =
            "";
    }

    if (scoreText) {

        scoreText.textContent =
            "";
    }

    if (explanation) {

        explanation.remove();
    }

    updateLesson10Button9();

    renderQuiz9Question();
}


/* ============================================================
   INIT
============================================================ */

function initQuiz9() {

    prepareQuiz9();

    loadQuiz9State();

    renderQuiz9Question();

    updateLesson10Button9();
}


/* ============================================================
   GLOBAL EXPORTS
============================================================ */

window.checkAnswer =
    answerQuiz9;

window.nextQuestion =
    nextQuiz9;

window.retryQuiz =
    retryQuiz9;

window.startLesson9Quiz =
    initQuiz9;


/* ============================================================
   START
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    initQuiz9
);