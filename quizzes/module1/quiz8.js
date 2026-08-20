/**
 * ============================================================
 * STRATIVO ACADEMY
 * quiz8.js — Lesson 8 Quiz Engine
 * ============================================================
 *
 * Lesson:
 *   Lesson 8 — Support & Resistance
 *
 * Features:
 *   - 10 original Lesson 8 questions
 *   - Fresh option shuffle
 *   - Answer feedback
 *   - Correct answer reveal
 *   - 70% passing score
 *   - Quiz result persistence
 *   - Retry support
 *   - Permanent Lesson 9 unlock
 *   - Central Strativo profile synchronization
 *   - +50 XP exactly once
 *   - Level / badge synchronization
 *   - Dynamic quiz UI
 *
 * IMPORTANT:
 *   This file owns the Lesson 8 quiz.
 *   It does not replace lesson.js.
 */


/* ============================================================
   1. BASE QUIZ DATA
============================================================ */

const BASE_QUIZ_DATA = [

    {
        question:
            "What is the main purpose of a Support level in Forex trading?",

        options: [
            "To guarantee the market will reverse upward.",
            "To identify where buyers may become stronger than sellers.",
            "To show where traders should always sell.",
            "To identify the highest price of the day."
        ],

        correct: 1,

        explanation:
            "Support is a price area where buying pressure often becomes stronger than selling pressure, increasing the chance of a bounce."
    },


    {
        question:
            "Which statement best describes a Resistance level?",

        options: [
            "It is always the highest price on the chart.",
            "It guarantees a bearish trend.",
            "It is a price area where selling pressure may stop or slow an upward move.",
            "It is where buyers enter aggressively."
        ],

        correct: 2,

        explanation:
            "Resistance is an area where sellers become more active, making it difficult for price to continue rising."
    },


    {
        question:
            "Why do experienced traders draw Support and Resistance as zones instead of single lines?",

        options: [
            "Because price usually reacts within an area rather than at one exact price.",
            "Because charting software cannot draw straight lines.",
            "Because every broker requires it.",
            "Because indicators only work with zones."
        ],

        correct: 0,

        explanation:
            "Price rarely reverses at one exact level. Zones better represent real market behavior."
    },


    {
        question:
            "Which factor makes a Support or Resistance level stronger?",

        options: [
            "It appears on only one candle.",
            "It is drawn randomly.",
            "It is close to the current price.",
            "Price has respected the level multiple times."
        ],

        correct: 3,

        explanation:
            "The more times price respects a level, the stronger and more reliable it becomes."
    },


    {
        question:
            "What is meant by 'Role Reversal' in technical analysis?",

        options: [
            "Changing from Forex to Cryptocurrency.",
            "A broken Resistance becomes Support, or a broken Support becomes Resistance.",
            "Switching from buying to selling every trade.",
            "Using different trading sessions."
        ],

        correct: 1,

        explanation:
            "After a breakout, previous resistance often acts as new support, and previous support often becomes new resistance."
    },


    {
        question:
            "What is a breakout?",

        options: [
            "Price moving sideways inside a range.",
            "The market closing for the day.",
            "Price moving strongly beyond an important Support or Resistance level.",
            "A candlestick with long wicks."
        ],

        correct: 2,

        explanation:
            "A breakout happens when price successfully moves beyond an important level with momentum."
    },


    {
        question:
            "Which situation is the best example of a false breakout?",

        options: [
            "Price breaks resistance and continues higher.",
            "Price stays inside a range all day.",
            "Price forms a doji candle.",
            "Price briefly breaks a level but quickly returns back inside."
        ],

        correct: 3,

        explanation:
            "False breakouts trap traders before reversing back into the previous trading range."
    },


    {
        question:
            "Why do professional traders use Multi-Timeframe Analysis when marking Support and Resistance?",

        options: [
            "To identify stronger and more reliable levels on higher timeframes.",
            "To remove all trading risk.",
            "To predict every market movement.",
            "To avoid using candlestick charts."
        ],

        correct: 0,

        explanation:
            "Higher timeframes usually provide stronger and more reliable Support and Resistance zones."
    },


    {
        question:
            "Which of the following is a common beginner mistake?",

        options: [
            "Waiting for confirmation before entering.",
            "Using higher timeframe analysis.",
            "Drawing too many unnecessary Support and Resistance levels.",
            "Looking for strong price reactions."
        ],

        correct: 2,

        explanation:
            "Too many levels create confusion. Focus only on the most important price zones."
    },


    {
        question:
            "Before entering a trade near Support or Resistance, what should a professional trader do?",

        options: [
            "Enter immediately without confirmation.",
            "Wait for confirmation such as rejection candles or a valid breakout.",
            "Ignore the overall market trend.",
            "Trade only because price touched the level."
        ],

        correct: 1,

        explanation:
            "Professional traders wait for confirmation before entering a trade to reduce false signals."
    }

];


/* ============================================================
   2. QUIZ STATE
============================================================ */

let currentQuestion = 0;

let userAnswers = [];

let quizCompleted = false;

let workingQuizData = [];


/* ============================================================
   3. STORAGE KEYS
============================================================ */

const QUIZ_STATE_KEY =
    "lesson8_quiz_state";

const QUIZ_SCORE_KEY =
    "lesson8_quiz_score";

const QUIZ_PERCENTAGE_KEY =
    "lesson8_quiz_percentage";

const QUIZ_PASSED_KEY =
    "lesson8_quiz_passed";

const QUIZ_ATTEMPTS_KEY =
    "lesson8_quiz_attempts";

const LESSON9_UNLOCK_KEY =
    "lesson9_unlocked";


/* ============================================================
   4. CENTRAL STRATIVO PROFILE
============================================================ */

const STRATIVO_PROFILE_KEY =
    "strativo_student_profile";


const LESSON_ID =
    8;


const NEXT_LESSON_ID =
    9;


const LESSON_XP =
    50;


/* ============================================================
   5. DEFAULT PROFILE FALLBACK
============================================================ */

const DEFAULT_PROFILE = {

    studentName:
        "Alex Trader",

    avatar:
        null,

    currentLevel:
        1,

    totalXP:
        0,

    currentXP:
        0,

    currentModule:
        1,

    currentLesson:
        1,

    completedLessons:
        [],

    unlockedLessons:
        [1],

    completedModules:
        [],

    badges:
        ["🥉 Forex Rookie"],

    streak:
        0,

    studyMinutes:
        0,

    quizScores:
        {},

    bookmarks:
        [],

    notes:
        {},

    lastVisitedLesson:
        null,

    lastVisitDate:
        null,

    dailyGoal: {
        type:
            "lessons",

        target:
            2,

        current:
            0
    },

    achievements:
        [],

    studyDays:
        []

};


/* ============================================================
   6. PROFILE HELPERS
============================================================ */

function loadProfile() {

    try {

        const raw =
            localStorage.getItem(
                STRATIVO_PROFILE_KEY
            );


        if (!raw) {

            return {
                ...DEFAULT_PROFILE
            };

        }


        const parsed =
            JSON.parse(
                raw
            );


        return {

            ...DEFAULT_PROFILE,

            ...parsed

        };

    }
    catch (error) {

        console.warn(
            "Lesson 8 could not load Strativo profile.",
            error
        );


        return {
            ...DEFAULT_PROFILE
        };

    }

}


function saveProfile(
    profile
) {

    try {

        localStorage.setItem(

            STRATIVO_PROFILE_KEY,

            JSON.stringify(
                profile
            )

        );

    }
    catch (error) {

        console.warn(
            "Lesson 8 could not save Strativo profile.",
            error
        );

    }

}


/* ============================================================
   7. LEVEL SYSTEM
============================================================ */

function calculateLevel(
    totalXP
) {

    const thresholds = [

        0,
        100,
        250,
        500,
        1000,
        2000,
        3500,
        5000,
        7500,
        10000

    ];


    let level =
        1;


    for (
        let i = 0;
        i < thresholds.length;
        i++
    ) {

        if (
            totalXP >=
            thresholds[i]
        ) {

            level =
                i + 1;

        }
        else {

            break;

        }

    }


    return level;

}


/* ============================================================
   8. BADGE SYSTEM
============================================================ */

function calculateBadge(
    level
) {

    if (
        level >= 10
    ) {

        return "👑 Strativo Legend";

    }


    if (
        level >= 7
    ) {

        return "💎 Elite Trader";

    }


    if (
        level >= 4
    ) {

        return "🥇 Chart Master";

    }


    if (
        level >= 2
    ) {

        return "🥈 Market Explorer";

    }


    return "🥉 Forex Rookie";

}


/* ============================================================
   9. CENTRAL COMPLETION BRIDGE
============================================================ */

function completeLesson8InCentralProfile(
    score,
    percentage
) {

    /*
     * Prefer the official central completion
     * function when it is available.
     */
    if (
        typeof window.strativoCompleteLesson ===
        "function"
    ) {

        try {

            window.strativoCompleteLesson(
                LESSON_ID
            );


            const profile =
                loadProfile();


            if (
                !profile.quizScores ||
                typeof profile.quizScores !==
                    "object"
            ) {

                profile.quizScores =
                    {};

            }


            profile.quizScores.lesson8 = {

                score:

                    score,

                total:

                    BASE_QUIZ_DATA.length,

                percentage:

                    percentage,

                passed:

                    true,

                completedAt:

                    new Date()
                        .toISOString()

            };


            saveProfile(
                profile
            );


            return;

        }
        catch (error) {

            console.warn(
                "Official lesson completion function failed. Using profile bridge.",
                error
            );

        }

    }


    /*
     * Fallback for lesson pages where
     * module1.js is not loaded.
     */

    const profile =
        loadProfile();


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


    /*
     * Save quiz result in the
     * central profile.
     */

    profile.quizScores.lesson8 = {

        score:

            score,

        total:

            BASE_QUIZ_DATA.length,

        percentage:

            percentage,

        passed:

            true,

        completedAt:

            new Date()
                .toISOString()

    };


    /*
     * XP must only be awarded once.
     */

    const alreadyCompleted =
        profile.completedLessons.includes(
            LESSON_ID
        );


    if (
        !alreadyCompleted
    ) {

        profile.completedLessons.push(
            LESSON_ID
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


        profile.currentLevel =
            calculateLevel(
                profile.totalXP
            );


        profile.badge =
            calculateBadge(
                profile.currentLevel
            );


        if (
            !Array.isArray(
                profile.badges
            )
        ) {

            profile.badges =
                [];

        }


        if (
            !profile.badges.includes(
                profile.badge
            )
        ) {

            profile.badges.push(
                profile.badge
            );

        }

    }


    /*
     * Lesson 9 becomes available.
     */

    if (
        !profile.unlockedLessons.includes(
            LESSON_ID
        )
    ) {

        profile.unlockedLessons.push(
            LESSON_ID
        );

    }


    if (
        !profile.unlockedLessons.includes(
            NEXT_LESSON_ID
        )
    ) {

        profile.unlockedLessons.push(
            NEXT_LESSON_ID
        );

    }


    profile.completedLessons =

        [
            ...new Set(
                profile.completedLessons
                    .filter(
                        Number.isInteger
                    )
            )
        ]

        .sort(
            (
                a,
                b
            ) =>
                a - b
        );


    profile.unlockedLessons =

        [
            ...new Set(
                profile.unlockedLessons
                    .filter(
                        Number.isInteger
                    )
            )
        ]

        .sort(
            (
                a,
                b
            ) =>
                a - b
        );


    profile.currentModule =
        1;


    profile.currentLesson =
        NEXT_LESSON_ID;


    profile.lastVisitedLesson =
        NEXT_LESSON_ID;


    profile.lastVisitDate =
        new Date()
            .toISOString()
            .split("T")[0];


    if (
        !profile.achievements.includes(
            "lesson8_complete"
        )
    ) {

        profile.achievements.push(
            "lesson8_complete"
        );

    }


    saveProfile(
        profile
    );


    /*
     * Preserve the old V1 unlock key.
     */

    localStorage.setItem(
        LESSON9_UNLOCK_KEY,
        "true"
    );


    /*
     * Tell open Strativo pages that
     * the central profile changed.
     */

    try {

        window.dispatchEvent(

            new StorageEvent(
                "storage",
                {
                    key:
                        STRATIVO_PROFILE_KEY,

                    newValue:
                        JSON.stringify(
                            profile
                        )
                }
            )

        );

    }
    catch (error) {

        console.warn(
            "Lesson 8 could not dispatch profile storage event.",
            error
        );

    }

}


/* ============================================================
   10. QUIZ PREPARATION
============================================================ */

function prepareQuiz() {

    workingQuizData =

        BASE_QUIZ_DATA.map(
            q => ({

                ...q,

                options:
                    [...q.options]

            })
        );


    /*
     * Shuffle each question's options.
     * Correct answer index is updated.
     */

    workingQuizData.forEach(
        q => {

            const correctAnswer =
                q.options[
                    q.correct
                ];


            for (
                let i =
                    q.options.length - 1;

                i > 0;

                i--
            ) {

                const j =
                    Math.floor(
                        Math.random() *
                        (
                            i + 1
                        )
                    );


                [
                    q.options[i],
                    q.options[j]
                ] = [

                    q.options[j],
                    q.options[i]

                ];

            }


            q.correct =
                q.options.indexOf(
                    correctAnswer
                );

        }
    );


    currentQuestion =
        0;


    userAnswers =

        new Array(
            workingQuizData.length
        )
        .fill(
            null
        );


    quizCompleted =
        false;

}


/* ============================================================
   11. QUIZ STATE
============================================================ */

function saveQuizState() {

    try {

        localStorage.setItem(

            QUIZ_STATE_KEY,

            JSON.stringify({

                currentQuestion,

                userAnswers,

                quizCompleted,

                savedAt:
                    Date.now()

            })

        );

    }
    catch (error) {

        console.warn(
            "Lesson 8 quiz state could not be saved.",
            error
        );

    }

}


function loadQuizState() {

    try {

        const raw =
            localStorage.getItem(
                QUIZ_STATE_KEY
            );


        if (!raw) {

            return false;

        }


        const saved =
            JSON.parse(
                raw
            );


        if (
            !saved ||
            typeof saved !==
                "object"
        ) {

            return false;

        }


        /*
         * A new retry creates a new shuffle.
         * Therefore saved answers only restore when
         * the answer array matches the current quiz.
         */

        if (
            Array.isArray(
                saved.userAnswers
            ) &&
            saved.userAnswers.length ===
                workingQuizData.length
        ) {

            userAnswers =
                saved.userAnswers;

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

                    workingQuizData.length - 1

                );

        }


        quizCompleted =
            saved.quizCompleted ===
            true;


        return true;

    }
    catch (error) {

        console.warn(
            "Lesson 8 quiz state could not be restored.",
            error
        );


        return false;

    }

}


/* ============================================================
   12. DOM HELPERS
============================================================ */

function getElement(
    id
) {

    return document.getElementById(
        id
    );

}


function showMessage(
    text
) {

    let msgBox =
        getElement(
            "quiz-message"
        );


    if (!msgBox) {

        const container =
            getElement(
                "quiz-container"
            );


        if (!container) {

            return;

        }


        msgBox =
            document.createElement(
                "div"
            );


        msgBox.id =
            "quiz-message";


        msgBox.className =
            "info-box warning";


        msgBox.style.marginTop =
            "20px";


        container.appendChild(
            msgBox
        );

    }


    msgBox.style.display =
        "block";


    msgBox.innerHTML =
        `<strong>⚠️ Notice:</strong> ${text}`;

}


function hideMessage() {

    const msgBox =
        getElement(
            "quiz-message"
        );


    if (msgBox) {

        msgBox.style.display =
            "none";

    }

}


/* ============================================================
   13. BUILD QUIZ UI
============================================================ */

function renderQuizUI() {

    const container =
        getElement(
            "quiz-container"
        );


    if (!container) {

        return;

    }


    /*
     * Do not duplicate the UI.
     */

    if (
        getElement(
            "question-counter"
        )
    ) {

        return;

    }


    container.innerHTML = `

        <div
            class="question-counter"
            id="question-counter"
        >
            Question 1 of ${workingQuizData.length}
        </div>


        <h2 id="question">
            Loading Question...
        </h2>


        <div class="quiz-options">

            <button
                type="button"
                class="quiz-btn"
                id="option0"
                onclick="checkAnswer(0)"
            ></button>


            <button
                type="button"
                class="quiz-btn"
                id="option1"
                onclick="checkAnswer(1)"
            ></button>


            <button
                type="button"
                class="quiz-btn"
                id="option2"
                onclick="checkAnswer(2)"
            ></button>


            <button
                type="button"
                class="quiz-btn"
                id="option3"
                onclick="checkAnswer(3)"
            ></button>

        </div>


        <div
            id="quiz-result"
            class="quiz-result"
            aria-live="polite"
        ></div>


        <div
            id="quiz-explanation"
            class="quiz-explanation"
            style="display:none;"
        ></div>


        <div class="quiz-navigation">

            <button
                type="button"
                class="secondary-btn"
                id="prevQuestionBtn"
                onclick="previousQuestion()"
            >
                ← Previous
            </button>


            <button
                type="button"
                class="btn btn-primary"
                id="nextQuestionBtn"
                onclick="nextQuestion()"
            >
                Next →
            </button>

        </div>

    `;

}


/* ============================================================
   14. LOAD QUESTION
============================================================ */

function loadQuestion() {

    if (
        !workingQuizData.length
    ) {

        return;

    }


    const q =
        workingQuizData[
            currentQuestion
        ];


    const counter =
        getElement(
            "question-counter"
        );


    const question =
        getElement(
            "question"
        );


    if (counter) {

        counter.textContent =
            `Question ${
                currentQuestion + 1
            } of ${
                workingQuizData.length
            }`;

    }


    if (question) {

        question.textContent =
            q.question;

    }


    const buttons = [

        getElement("option0"),
        getElement("option1"),
        getElement("option2"),
        getElement("option3")

    ];


    buttons.forEach(
        (
            button,
            index
        ) => {

            if (!button) {

                return;

            }


            button.textContent =
                q.options[index];


            button.className =
                "quiz-btn";


            button.disabled =
                false;

        }
    );


    const result =
        getElement(
            "quiz-result"
        );


    if (result) {

        result.textContent =
            "";


        result.className =
            "quiz-result";

    }


    const explanation =
        getElement(
            "quiz-explanation"
        );


    if (explanation) {

        explanation.textContent =
            "";


        explanation.style.display =
            "none";

    }


    hideMessage();


    /*
     * Restore saved answer.
     */

    const savedAnswer =
        userAnswers[
            currentQuestion
        ];


    if (
        savedAnswer !== null &&
        savedAnswer !== undefined
    ) {

        buttons.forEach(
            (
                button,
                index
            ) => {

                if (!button) {

                    return;

                }


                button.disabled =
                    true;


                if (
                    index ===
                    q.correct
                ) {

                    button.classList.add(
                        "correct"
                    );

                }
                else if (
                    index ===
                    savedAnswer
                ) {

                    button.classList.add(
                        "wrong"
                    );

                }

            }
        );


        if (result) {

            if (
                savedAnswer ===
                q.correct
            ) {

                result.textContent =
                    "✅ Correct! Excellent work!";


                result.className =
                    "quiz-result correct";

            }
            else {

                result.textContent =
                    "❌ Not quite. Review the explanation below.";


                result.className =
                    "quiz-result wrong";

            }

        }


        if (explanation) {

            explanation.textContent =
                "💡 " +
                q.explanation;


            explanation.style.display =
                "block";

        }

    }


    const previous =
        getElement(
            "prevQuestionBtn"
        );


    const next =
        getElement(
            "nextQuestionBtn"
        );


    if (previous) {

        previous.disabled =
            currentQuestion === 0;

    }


    if (next) {

        next.textContent =

            currentQuestion ===
            workingQuizData.length - 1

                ? "Finish Quiz →"

                : "Next →";


        next.disabled =

            savedAnswer === null ||
            savedAnswer === undefined;

    }


    saveQuizState();

}


/* ============================================================
   15. CHECK ANSWER
============================================================ */

function checkAnswer(
    index
) {

    if (
        userAnswers[
            currentQuestion
        ] !== null &&
        userAnswers[
            currentQuestion
        ] !== undefined
    ) {

        return;

    }


    const q =
        workingQuizData[
            currentQuestion
        ];


    if (
        !q ||
        !Number.isInteger(
            index
        ) ||
        index < 0 ||
        index >=
            q.options.length
    ) {

        return;

    }


    userAnswers[
        currentQuestion
    ] =
        index;


    const buttons = [

        getElement("option0"),
        getElement("option1"),
        getElement("option2"),
        getElement("option3")

    ];


    buttons.forEach(
        (
            button,
            buttonIndex
        ) => {

            if (!button) {

                return;

            }


            button.disabled =
                true;


            if (
                buttonIndex ===
                q.correct
            ) {

                button.classList.add(
                    "correct"
                );

            }
            else if (
                buttonIndex ===
                    index &&
                index !==
                    q.correct
            ) {

                button.classList.add(
                    "wrong"
                );

            }

        }
    );


    const result =
        getElement(
            "quiz-result"
        );


    if (result) {

        if (
            index ===
            q.correct
        ) {

            result.textContent =
                "✅ Correct! Excellent work!";


            result.className =
                "quiz-result correct";

        }
        else {

            result.textContent =
                "❌ Not quite. Review the explanation below.";


            result.className =
                "quiz-result wrong";

        }

    }


    const explanation =
        getElement(
            "quiz-explanation"
        );


    if (explanation) {

        explanation.textContent =
            "💡 " +
            q.explanation;


        explanation.style.display =
            "block";

    }


    const next =
        getElement(
            "nextQuestionBtn"
        );


    if (next) {

        next.disabled =
            false;

    }


    hideMessage();


    saveQuizState();

}


/* ============================================================
   16. NEXT QUESTION
============================================================ */

function nextQuestion() {

    if (
        userAnswers[
            currentQuestion
        ] === null ||
        userAnswers[
            currentQuestion
        ] === undefined
    ) {

        showMessage(
            "Please answer the question before proceeding."
        );


        return;

    }


    if (
        currentQuestion ===
        workingQuizData.length - 1
    ) {

        finishQuiz();


        return;

    }


    currentQuestion++;


    loadQuestion();

}


/* ============================================================
   17. PREVIOUS QUESTION
============================================================ */

function previousQuestion() {

    if (
        currentQuestion ===
        0
    ) {

        return;

    }


    currentQuestion--;


    loadQuestion();

}


/* ============================================================
   18. FINISH QUIZ
============================================================ */

function finishQuiz() {

    if (
        userAnswers[
            currentQuestion
        ] === null ||
        userAnswers[
            currentQuestion
        ] === undefined
    ) {

        showMessage(
            "Please answer the final question before finishing."
        );


        return;

    }


    const score =
        userAnswers.filter(
            (
                answer,
                index
            ) =>
                answer ===
                workingQuizData[index].correct
        ).length;


    const percentage =
        Math.round(

            (
                score /
                workingQuizData.length
            ) * 100

        );


    const passed =
        percentage >= 70;


    /*
     * Save quiz result.
     */

    localStorage.setItem(
        QUIZ_SCORE_KEY,
        String(score)
    );


    localStorage.setItem(
        QUIZ_PERCENTAGE_KEY,
        String(percentage)
    );


    localStorage.setItem(
        QUIZ_PASSED_KEY,
        String(passed)
    );


    const attempts =
        Number.parseInt(
            localStorage.getItem(
                QUIZ_ATTEMPTS_KEY
            ) || "0",
            10
        ) + 1;


    localStorage.setItem(
        QUIZ_ATTEMPTS_KEY,
        String(
            attempts
        )
    );


    /*
     * Passing score.
     */

    if (passed) {

        /*
         * Permanent Lesson 9 unlock.
         */

        localStorage.setItem(
            LESSON9_UNLOCK_KEY,
            "true"
        );


        /*
         * Sync to central Strativo profile.
         */

        completeLesson8InCentralProfile(
            score,
            percentage
        );


        updateLesson9Button();

    }


    const result =
        getElement(
            "quiz-result"
        );


    let message =

        `You scored ${
            score
        }/${
            workingQuizData.length
        } (${
            percentage
        }%). `;


    if (passed) {

        message +=
            "🎉 You passed! Lesson 9 is now unlocked.";

    }
    else {

        message +=
            "You need at least 70% to pass. Review Lesson 8 and retry the quiz.";

    }


    if (result) {

        result.textContent =
            message;


        result.className =
            "quiz-result " +
            (
                passed
                    ? "correct"
                    : "wrong"
            );

    }


    const explanation =
        getElement(
            "quiz-explanation"
        );


    if (explanation) {

        explanation.style.display =
            "none";

    }


    const next =
        getElement(
            "nextQuestionBtn"
        );


    const previous =
        getElement(
            "prevQuestionBtn"
        );


    if (next) {

        next.disabled =
            true;

    }


    if (previous) {

        previous.disabled =
            true;

    }


    quizCompleted =
        true;


    saveQuizState();


    renderFinalResult(
        score,
        percentage,
        passed
    );

}


/* ============================================================
   19. FINAL RESULT
============================================================ */

function renderFinalResult(
    score,
    percentage,
    passed
) {

    const container =
        getElement(
            "quiz-container"
        );


    if (!container) {

        return;

    }


    let resultCard =
        getElement(
            "quiz-final-result"
        );


    if (!resultCard) {

        resultCard =
            document.createElement(
                "div"
            );


        resultCard.id =
            "quiz-final-result";


        resultCard.className =
            "info-box " +
            (
                passed
                    ? "success"
                    : "warning"
            );


        resultCard.style.marginTop =
            "20px";


        container.appendChild(
            resultCard
        );

    }


    resultCard.innerHTML = `

        <h3>

            ${
                passed

                    ? "🏆 Lesson 8 Complete!"

                    : "📚 Keep Practicing"

            }

        </h3>


        <p>

            Your Score:

            <strong>
                ${score}/${workingQuizData.length}
            </strong>

            <br>

            Percentage:

            <strong>
                ${percentage}%
            </strong>

        </p>


        ${
            passed

                ? `

                    <p>
                        ✅ Lesson 8 has been completed.
                        Lesson 9 is now unlocked.
                        You earned +50 XP on the first successful completion.
                    </p>


                    <a
                        href="lesson9.html"
                        class="lesson-action-btn unlocked"
                    >
                        🚀 Continue to Lesson 9
                    </a>

                `

                : `

                    <p>
                        You need at least 70%.
                        Review Lesson 8 and try again.
                    </p>


                    <button
                        type="button"
                        class="secondary-btn"
                        onclick="retryQuiz()"
                    >
                        🔄 Retry Quiz
                    </button>

                `
        }

    `;

}


/* ============================================================
   20. LESSON 9 BUTTON
============================================================ */

function updateLesson9Button() {

    const container =
        getElement(
            "lesson9ButtonContainer"
        );


    /*
     * Fallback for an older Lesson 8 HTML.
     */

    const fallback =
        getElement(
            "lesson8ButtonContainer"
        );


    const target =
        container ||
        fallback;


    if (!target) {

        return;

    }


    const unlocked =
        localStorage.getItem(
            LESSON9_UNLOCK_KEY
        ) ===
        "true";


    if (unlocked) {

        target.innerHTML = `

            <a
                href="lesson9.html"
                class="lesson-action-btn unlocked"
            >
                🚀 Continue to Lesson 9
            </a>

        `;

    }
    else {

        target.innerHTML =
            "";

    }

}


/* ============================================================
   21. RETRY
============================================================ */

function retryQuiz() {

    /*
     * Retry clears only the current attempt.
     *
     * It does NOT remove:
     * - Lesson 8 completion
     * - Lesson 9 unlock
     * - XP
     * - level
     * - badge
     */

    prepareQuiz();


    renderQuizUI();


    loadQuestion();


    hideMessage();


    updateLesson9Button();


    const container =
        getElement(
            "quiz-container"
        );


    if (container) {

        container.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });

    }


    saveQuizState();

}


/* ============================================================
   22. START QUIZ
============================================================ */

function startQuiz() {

    const container =
        getElement(
            "quiz-container"
        );


    if (container) {

        container.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });

    }


    renderQuizUI();


    loadQuestion();

}


/* ============================================================
   23. INITIALIZATION
============================================================ */

function initQuiz() {

    prepareQuiz();


    /*
     * Build the quiz UI because the
     * Lesson 8 HTML provides an empty
     * #quiz-container.
     */

    renderQuizUI();


    /*
     * Load the first question.
     */

    loadQuestion();


    /*
     * Restore an existing permanent
     * Lesson 9 unlock.
     */

    updateLesson9Button();

}


document.addEventListener(
    "DOMContentLoaded",
    initQuiz
);


/* ============================================================
   24. GLOBAL EXPORTS
============================================================ */

window.checkAnswer =
    checkAnswer;


window.nextQuestion =
    nextQuestion;


window.previousQuestion =
    previousQuestion;


window.retryQuiz =
    retryQuiz;


window.startQuiz =
    startQuiz;