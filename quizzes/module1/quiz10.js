/**
 * ============================================================
 * STRATIVO ACADEMY
 * quiz10.js — Lesson 10 Quiz Engine
 * ============================================================
 *
 * Lesson:
 *   Lesson 10 — Chart Patterns
 *
 * Features:
 *   - 15 Lesson 10 questions
 *   - Fresh option shuffle on retry
 *   - Answer validation
 *   - Persistent quiz state
 *   - 70% passing score
 *   - Central learning-system synchronization
 *   - Lesson 10 completion
 *   - Module 1 completion
 *   - +50 XP exactly once
 *   - Level / badge synchronization
 *   - Retry support
 *
 * IMPORTANT:
 *   Lesson 10 is the final lesson of Module 1.
 *   Passing this quiz completes Module 1.
 */


/* ============================================================
   1. BASE QUIZ DATA
============================================================ */

const BASE_QUIZ_DATA = [

    {
        question:
            "1. What do chart patterns mainly represent?",

        options: [
            "Random market movements",
            "The psychology of buyers and sellers",
            "Only indicator signals",
            "Broker manipulation"
        ],

        answer: 1,

        explanation:
            "Chart patterns reflect the ongoing battle between buyers and sellers. They help traders understand market psychology."
    },


    {
        question:
            "2. Which pattern usually signals a bearish reversal?",

        options: [
            "Double Bottom",
            "Ascending Triangle",
            "Double Top",
            "Bull Flag"
        ],

        answer: 2,

        explanation:
            "A Double Top forms after an uptrend and often signals that buyers are losing strength while sellers are taking control."
    },


    {
        question:
            "3. A Double Bottom usually forms after a:",

        options: [
            "Strong uptrend",
            "Sideways market",
            "Strong downtrend",
            "Random market"
        ],

        answer: 2,

        explanation:
            "A Double Bottom appears after a downtrend and signals a possible bullish reversal."
    },


    {
        question:
            "4. Which part confirms a Head & Shoulders pattern?",

        options: [
            "The Head",
            "The Left Shoulder",
            "The Neckline Break",
            "The Right Shoulder"
        ],

        answer: 2,

        explanation:
            "The pattern is confirmed only when price breaks below the neckline."
    },


    {
        question:
            "5. An Ascending Triangle usually indicates:",

        options: [
            "Bearish continuation",
            "Bullish continuation",
            "Market crash",
            "No trend"
        ],

        answer: 1,

        explanation:
            "An Ascending Triangle usually forms during an uptrend and often leads to a bullish breakout."
    },


    {
        question:
            "6. A Descending Triangle is normally considered:",

        options: [
            "Bullish continuation",
            "Bearish continuation",
            "Always a reversal",
            "Random pattern"
        ],

        answer: 1,

        explanation:
            "A Descending Triangle generally appears during a downtrend and suggests bearish continuation."
    },


    {
        question:
            "7. A Symmetrical Triangle should be traded:",

        options: [
            "Before breakout",
            "Only after confirmation",
            "Immediately after formation",
            "Without Stop Loss"
        ],

        answer: 1,

        explanation:
            "Since the breakout direction is unknown, traders should always wait for confirmation."
    },


    {
        question:
            "8. A Falling Wedge often signals:",

        options: [
            "Potential bullish move",
            "Strong bearish trend only",
            "Market manipulation",
            "No trading opportunity"
        ],

        answer: 0,

        explanation:
            "A Falling Wedge often signals weakening selling pressure and a possible bullish breakout."
    },


    {
        question:
            "9. A Rectangle Pattern represents:",

        options: [
            "Market consolidation",
            "Guaranteed reversal",
            "Immediate breakout",
            "High volatility only"
        ],

        answer: 0,

        explanation:
            "A Rectangle Pattern shows consolidation where buyers and sellers are temporarily balanced."
    },


    {
        question:
            "10. What should traders always wait for?",

        options: [
            "A random candle",
            "Confirmation",
            "A social media signal",
            "Broker advice"
        ],

        answer: 1,

        explanation:
            "Waiting for confirmation helps reduce false breakouts and improves trading decisions."
    },


    {
        question:
            "11. Which tool should always be used to protect your account?",

        options: [
            "Take Profit only",
            "Stop Loss",
            "More leverage",
            "Bigger lot size"
        ],

        answer: 1,

        explanation:
            "A Stop Loss limits potential losses and is an essential part of risk management."
    },


    {
        question:
            "12. Which is a common beginner mistake?",

        options: [
            "Waiting for confirmation",
            "Using risk management",
            "Trading before the pattern is complete",
            "Following a trading plan"
        ],

        answer: 2,

        explanation:
            "Entering before the pattern is complete often results in false signals and unnecessary losses."
    },


    {
        question:
            "13. Professional traders usually:",

        options: [
            "Trade every pattern",
            "Wait patiently for quality setups",
            "Ignore risk",
            "Never use confirmation"
        ],

        answer: 1,

        explanation:
            "Professional traders focus on high-quality setups instead of taking every possible trade."
    },


    {
        question:
            "14. The strongest chart patterns are usually combined with:",

        options: [
            "Support and Resistance",
            "Random guessing",
            "Luck",
            "Only indicators"
        ],

        answer: 0,

        explanation:
            "Combining chart patterns with support, resistance, trend analysis, and risk management improves trade quality."
    },


    {
        question:
            "15. What is the most important lesson from this chapter?",

        options: [
            "Every pattern wins",
            "Chart patterns predict the future",
            "Chart patterns improve probability, not certainty",
            "Never use Stop Loss"
        ],

        answer: 2,

        explanation:
            "Chart patterns increase the probability of successful trades, but no pattern guarantees a winning trade."
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
    "lesson10_quiz_state";

const QUIZ_SCORE_KEY =
    "lesson10_quiz_score";

const QUIZ_PERCENTAGE_KEY =
    "lesson10_quiz_percentage";

const QUIZ_PASSED_KEY =
    "lesson10_quiz_passed";

const QUIZ_ATTEMPTS_KEY =
    "lesson10_quiz_attempts";


/* ============================================================
   4. CENTRAL STRATIVO PROFILE
============================================================ */

const STRATIVO_PROFILE_KEY =
    "strativo_student_profile";


const LESSON_ID =
    10;


const LESSON_XP =
    50;


const MODULE_ID =
    1;


const TOTAL_MODULE_LESSONS =
    10;


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
        [
            "🥉 Forex Rookie"
        ],

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
   6. PROFILE LOAD / SAVE
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
            "Lesson 10 could not load Strativo profile.",
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
            "Lesson 10 could not save Strativo profile.",
            error
        );

    }

}


/* ============================================================
   7. LEVEL CALCULATION
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
   8. BADGE CALCULATION
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
   9. COMPLETE LESSON 10
============================================================ */

function completeLesson10InCentralProfile(
    score,
    percentage
) {

    /*
     * If the official learning engine is
     * available, use it first.
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


            profile.quizScores.lesson10 = {

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
             * Lesson 10 is the last lesson.
             * Make sure Module 1 is marked complete.
             */

            if (
                !Array.isArray(
                    profile.completedModules
                )
            ) {

                profile.completedModules =
                    [];

            }


            if (
                !profile.completedModules.includes(
                    MODULE_ID
                )
            ) {

                profile.completedModules.push(
                    MODULE_ID
                );

            }


            /*
             * Move the student to the next module
             * when available.
             *
             * We do not invent a Module 2 lesson here.
             */

            profile.currentModule =
                1;


            profile.currentLesson =
                LESSON_ID;


            profile.lastVisitedLesson =
                LESSON_ID;


            saveProfile(
                profile
            );


            return true;

        }
        catch (error) {

            console.warn(
                "Official Lesson 10 completion failed. Using fallback.",
                error
            );

        }

    }


    /*
     * Fallback for standalone Lesson 10.
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
        !Array.isArray(
            profile.completedModules
        )
    ) {

        profile.completedModules =
            [];

    }


    if (
        !Array.isArray(
            profile.achievements
        )
    ) {

        profile.achievements =
            [];

    }


    if (
        !profile.quizScores ||
        typeof profile.quizScores !==
            "object"
    ) {

        profile.quizScores =
            {};

    }


    /*
     * Save final quiz result.
     */

    profile.quizScores.lesson10 = {

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
     * Check whether XP was already awarded.
     */

    const alreadyCompleted =
        profile.completedLessons.includes(
            LESSON_ID
        );


    /*
     * Complete Lesson 10 and award XP
     * exactly once.
     */

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
     * Lesson 10 is completed, therefore
     * all ten lessons are unlocked/completed.
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


    /*
     * Complete Module 1.
     */

    if (
        profile.completedLessons.length >=
        TOTAL_MODULE_LESSONS
    ) {

        if (
            !profile.completedModules.includes(
                MODULE_ID
            )
        ) {

            profile.completedModules.push(
                MODULE_ID
            );

        }

    }


    /*
     * Achievement.
     */

    if (
        !profile.achievements.includes(
            "lesson10_complete"
        )
    ) {

        profile.achievements.push(
            "lesson10_complete"
        );

    }


    if (
        profile.completedLessons.length >=
        TOTAL_MODULE_LESSONS
    ) {

        if (
            !profile.achievements.includes(
                "module1_complete"
            )
        ) {

            profile.achievements.push(
                "module1_complete"
            );

        }

    }


    profile.currentModule =
        MODULE_ID;


    profile.currentLesson =
        LESSON_ID;


    profile.lastVisitedLesson =
        LESSON_ID;


    profile.lastVisitDate =
        new Date()
            .toISOString()
            .split("T")[0];


    /*
     * Keep arrays clean.
     */

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


    saveProfile(
        profile
    );


    /*
     * Notify open Strativo pages.
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
            "Lesson 10 profile event could not be dispatched.",
            error
        );

    }


    return true;

}


/* ============================================================
   10. QUIZ PREPARATION
============================================================ */

function prepareQuiz() {

    workingQuizData =
        BASE_QUIZ_DATA.map(
            question => ({

                ...question,

                options:
                    [
                        ...question.options
                    ]

            })
        );


    /*
     * Shuffle answers for every question.
     */

    workingQuizData.forEach(
        question => {

            const correctAnswer =
                question.options[
                    question.answer
                ];


            for (
                let i =
                    question.options.length - 1;

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
                    question.options[i],
                    question.options[j]
                ] = [

                    question.options[j],
                    question.options[i]

                ];

            }


            /*
             * Find the correct answer's
             * new index after shuffle.
             */

            question.answer =
                question.options.indexOf(
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
   11. QUIZ STATE STORAGE
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
            "Lesson 10 quiz state could not be saved.",
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
         * Because options are shuffled on every
         * retry, we only restore the state if the
         * saved answer array matches the quiz length.
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
            "Lesson 10 quiz state could not be restored.",
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

    let messageBox =
        getElement(
            "quiz-message"
        );


    if (!messageBox) {

        const container =
            getElement(
                "quiz-container"
            );


        if (!container) {

            return;

        }


        messageBox =
            document.createElement(
                "div"
            );


        messageBox.id =
            "quiz-message";


        messageBox.className =
            "info-box warning";


        messageBox.style.marginTop =
            "20px";


        container.appendChild(
            messageBox
        );

    }


    messageBox.style.display =
        "block";


    messageBox.innerHTML =
        `<strong>⚠️ Notice:</strong> ${text}`;

}


function hideMessage() {

    const messageBox =
        getElement(
            "quiz-message"
        );


    if (
        messageBox
    ) {

        messageBox.style.display =
            "none";

    }

}


/* ============================================================
   13. BUILD QUIZ INTERFACE
============================================================ */

function renderQuizUI() {

    const container =
        getElement(
            "quiz-container"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <div
            class="question-counter"
            id="question-counter"
        >
            Question 1 of 15
        </div>


        <h2 id="question">
            Loading Question...
        </h2>


        <div
            class="quiz-options"
            id="quiz-options"
        >

            <button
                type="button"
                class="quiz-btn"
                id="option0"
            ></button>


            <button
                type="button"
                class="quiz-btn"
                id="option1"
            ></button>


            <button
                type="button"
                class="quiz-btn"
                id="option2"
            ></button>


            <button
                type="button"
                class="quiz-btn"
                id="option3"
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
            style="
                display:none;
                margin-top:15px;
            "
        ></div>


        <div class="quiz-navigation">

            <button
                type="button"
                class="secondary-btn"
                id="prevQuestionBtn"
            >
                ← Previous Question
            </button>


            <button
                type="button"
                class="btn btn-primary"
                id="nextQuestionBtn"
            >
                Next Question →
            </button>

        </div>

    `;


    /*
     * Attach answer handlers.
     */

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const button =
            getElement(
                `option${i}`
            );


        if (button) {

            button.addEventListener(
                "click",
                () =>
                    checkAnswer(
                        i
                    )
            );

        }

    }


    const next =
        getElement(
            "nextQuestionBtn"
        );


    if (next) {

        next.addEventListener(
            "click",
            nextQuestion
        );

    }


    const previous =
        getElement(
            "prevQuestionBtn"
        );


    if (previous) {

        previous.addEventListener(
            "click",
            previousQuestion
        );

    }

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


    if (
        counter
    ) {

        counter.textContent =
            `Question ${
                currentQuestion + 1
            } of ${
                workingQuizData.length
            }`;

    }


    if (
        question
    ) {

        question.textContent =
            q.question;

    }


    const buttons = [

        getElement(
            "option0"
        ),

        getElement(
            "option1"
        ),

        getElement(
            "option2"
        ),

        getElement(
            "option3"
        )

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


            button.disabled =
                false;


            button.className =
                "quiz-btn";

        }
    );


    const result =
        getElement(
            "quiz-result"
        );


    if (
        result
    ) {

        result.textContent =
            "";


        result.className =
            "quiz-result";

    }


    const explanation =
        getElement(
            "quiz-explanation"
        );


    if (
        explanation
    ) {

        explanation.textContent =
            "";


        explanation.style.display =
            "none";

    }


    hideMessage();


    /*
     * Restore answer if it exists.
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
                    q.answer
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


        if (
            result
        ) {

            result.textContent =

                savedAnswer ===
                q.answer

                    ? "✅ Correct! Excellent work!"

                    : "❌ Incorrect. Review the explanation below.";


            result.className =

                savedAnswer ===
                q.answer

                    ? "quiz-result correct"

                    : "quiz-result wrong";

        }


        if (
            explanation
        ) {

            explanation.textContent =
                "💡 " +
                q.explanation;


            explanation.style.display =
                "block";

        }

    }


    /*
     * Navigation.
     */

    const previous =
        getElement(
            "prevQuestionBtn"
        );


    const next =
        getElement(
            "nextQuestionBtn"
        );


    if (
        previous
    ) {

        previous.disabled =
            currentQuestion ===
            0;

    }


    if (
        next
    ) {

        next.textContent =

            currentQuestion ===
            workingQuizData.length - 1

                ? "Finish Quiz"

                : "Next Question →";


        next.disabled =
            savedAnswer ===
                null ||

            savedAnswer ===
                undefined;

    }


    saveQuizState();

}


/* ============================================================
   15. CHECK ANSWER
============================================================ */

function checkAnswer(
    index
) {

    /*
     * Do not allow a second answer.
     */

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
        )
    ) {

        return;

    }


    userAnswers[
        currentQuestion
    ] =
        index;


    const buttons = [

        getElement(
            "option0"
        ),

        getElement(
            "option1"
        ),

        getElement(
            "option2"
        ),

        getElement(
            "option3"
        )

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
                q.answer
            ) {

                button.classList.add(
                    "correct"
                );

            }


            if (
                buttonIndex ===
                    index &&
                index !==
                    q.answer
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


    if (
        result
    ) {

        if (
            index ===
            q.answer
        ) {

            result.textContent =
                "✅ Correct! Excellent work!";


            result.className =
                "quiz-result correct";

        }
        else {

            result.textContent =
                "❌ Incorrect. Review the explanation below.";


            result.className =
                "quiz-result wrong";

        }

    }


    const explanation =
        getElement(
            "quiz-explanation"
        );


    if (
        explanation
    ) {

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


    if (
        next
    ) {

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
        ] ===
        null ||
        userAnswers[
            currentQuestion
        ] ===
        undefined
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

    /*
     * Make sure every question has been answered.
     */

    const unanswered =
        userAnswers.some(
            answer =>
                answer ===
                null ||
                answer ===
                undefined
        );


    if (
        unanswered
    ) {

        showMessage(
            "Please answer every question before finishing the quiz."
        );


        return;

    }


    /*
     * Calculate score.
     */

    const score =
        userAnswers.filter(
            (
                answer,
                index
            ) =>

                answer ===
                workingQuizData[
                    index
                ].answer

        ).length;


    const percentage =
        Math.round(

            (
                score /
                workingQuizData.length
            ) * 100

        );


    const passed =
        percentage >=
        70;


    /*
     * Save quiz result.
     */

    localStorage.setItem(
        QUIZ_SCORE_KEY,
        String(
            score
        )
    );


    localStorage.setItem(
        QUIZ_PERCENTAGE_KEY,
        String(
            percentage
        )
    );


    localStorage.setItem(
        QUIZ_PASSED_KEY,
        String(
            passed
        )
    );


    const attempts =
        Number.parseInt(
            localStorage.getItem(
                QUIZ_ATTEMPTS_KEY
            ) ||
            "0",
            10
        ) + 1;


    localStorage.setItem(
        QUIZ_ATTEMPTS_KEY,
        String(
            attempts
        )
    );


    /*
     * Passing the final lesson.
     */

    if (
        passed
    ) {

        completeLesson10InCentralProfile(
            score,
            percentage
        );

    }


    /*
     * Show result.
     */

    const result =
        getElement(
            "quiz-result"
        );


    if (
        result
    ) {

        result.textContent =

            passed

                ? `🎉 Congratulations! You scored ${score}/${workingQuizData.length} (${percentage}%). You passed Lesson 10 and completed Module 1.`

                : `You scored ${score}/${workingQuizData.length} (${percentage}%). You need at least 70% to pass. Please retry the quiz.`;


        result.className =

            passed

                ? "quiz-result correct"

                : "quiz-result wrong";

    }


    const explanation =
        getElement(
            "quiz-explanation"
        );


    if (
        explanation
    ) {

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


    if (
        next
    ) {

        next.disabled =
            true;

    }


    if (
        previous
    ) {

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


    /*
     * If lesson.js exposes showStep,
     * leave the student on the quiz step
     * rather than automatically navigating away.
     */

    if (
        typeof window.showStep ===
        "function"
    ) {

        try {

            window.showStep(
                19
            );

        }
        catch (error) {

            console.warn(
                "Could not move to Lesson 10 completion step.",
                error
            );

        }

    }

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


    if (
        !container
    ) {

        return;

    }


    let finalCard =
        getElement(
            "quiz-final-result"
        );


    if (!finalCard) {

        finalCard =
            document.createElement(
                "div"
            );


        finalCard.id =
            "quiz-final-result";


        finalCard.className =
            "info-box " +
            (
                passed
                    ? "success"
                    : "warning"
            );


        finalCard.style.marginTop =
            "20px";


        container.appendChild(
            finalCard
        );

    }


    finalCard.innerHTML = `

        <h3>

            ${
                passed
                    ? "🏆 Module 1 Complete!"
                    : "📚 Keep Practicing"
            }

        </h3>


        <p>

            Score:
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

                        ✅ Lesson 10 has been completed.

                        <br><br>

                        🏆 Module 1 has been completed.

                        <br><br>

                        🎁 +50 XP was awarded on
                        the first successful completion.

                    </p>


                    <a
                        href="../../beginner.html"
                        class="primary-btn"
                    >
                        📚 Back to Beginner Course
                    </a>

                `

                : `

                    <p>

                        The mastery target is 70%.
                        Review Lesson 10 and try again.

                    </p>


                    <button
                        type="button"
                        class="secondary-btn"
                        id="retryFinalQuizBtn"
                    >
                        🔄 Retry Quiz
                    </button>

                `

        }

    `;


    /*
     * Attach retry handler without relying
     * on inline onclick.
     */

    const retryButton =
        getElement(
            "retryFinalQuizBtn"
        );


    if (
        retryButton
    ) {

        retryButton.addEventListener(
            "click",
            retryQuiz
        );

    }

}


/* ============================================================
   20. RETRY QUIZ
============================================================ */

function retryQuiz() {

    /*
     * Retry resets only the current attempt.
     *
     * It never removes:
     *   - completedLessons
     *   - completedModules
     *   - XP
     *   - level
     *   - badge
     */

    prepareQuiz();


    /*
     * Remove only the temporary quiz-result
     * values from the current attempt.
     */

    localStorage.removeItem(
        QUIZ_SCORE_KEY
    );


    localStorage.removeItem(
        QUIZ_PERCENTAGE_KEY
    );


    localStorage.removeItem(
        QUIZ_PASSED_KEY
    );


    const finalCard =
        getElement(
            "quiz-final-result"
        );


    if (
        finalCard
    ) {

        finalCard.remove();

    }


    renderQuizUI();


    loadQuestion();


    hideMessage();


    const container =
        getElement(
            "quiz-container"
        );


    if (
        container
    ) {

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
   21. INITIALIZATION
============================================================ */

function initQuiz() {

    /*
     * Create a fresh quiz.
     */

    prepareQuiz();


    /*
     * Build the interface because the
     * current Lesson 10 HTML provides
     * the quiz section but not the
     * question controls.
     */

    renderQuizUI();


    /*
     * Load current question.
     */

    loadQuestion();

}


/* ============================================================
   22. DOM READY
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    initQuiz
);


/* ============================================================
   23. GLOBAL EXPORTS
============================================================ */

window.checkAnswer =
    checkAnswer;

window.nextQuestion =
    nextQuestion;

window.previousQuestion =
    previousQuestion;

window.retryQuiz =
    retryQuiz;