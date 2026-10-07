/**
 * ============================================================
 * STRATIVO ACADEMY
 * quiz7.js — Lesson 7 Quiz Engine
 * ============================================================
 *
 * Lesson:
 *   Lesson 7 — Reading Forex Charts
 *
 * Features:
 *   - 10 original Lesson 7 questions
 *   - Answer feedback
 *   - Correct answer reveal
 *   - 70% passing score
 *   - Quiz score persistence
 *   - Retry support
 *   - Permanent Lesson 8 unlock
 *   - Central student profile synchronization
 *   - +50 XP exactly once
 *   - Level / badge synchronization
 *
 * IMPORTANT:
 *   This file owns the Lesson 7 quiz only.
 *   It does NOT replace lesson.js.
 */


/* ============================================================
   1. BASE QUIZ DATA
============================================================ */

const BASE_QUIZ_DATA = [

    {
        question:
            "What does OHLC stand for?",

        options: [
            "Open, High, Low, Close",
            "Order, High, Low, Close",
            "Open, High, Limit, Close",
            "Open, High, Low, Currency"
        ],

        correct: 0,

        explanation:
            "OHLC stands for Open, High, Low, Close — the four key prices of a candlestick."
    },


    {
        question:
            "A bullish candle indicates that:",

        options: [
            "The price closed higher than it opened.",
            "The price closed lower than it opened.",
            "The price did not change.",
            "The market is sideways."
        ],

        correct: 0,

        explanation:
            "A bullish (green) candle means the close price is higher than the open — buyers won the session."
    },


    {
        question:
            "What does a long upper wick suggest?",

        options: [
            "Sellers pushed the price down from the high.",
            "Buyers pushed the price up.",
            "The market was indecisive.",
            "Strong buying pressure."
        ],

        correct: 0,

        explanation:
            "A long upper wick shows that price reached a high but sellers pushed it back down — rejection from above."
    },


    {
        question:
            "Which candle shape indicates indecision and weakness?",

        options: [
            "A small body with wicks on both sides.",
            "A long green body.",
            "A long red body.",
            "A doji with no wicks."
        ],

        correct: 0,

        explanation:
            "A small body, especially with wicks on both sides, shows that buyers and sellers fought to a draw — indecision."
    },


    {
        question:
            "In an uptrend, you would see:",

        options: [
            "Higher Highs and Higher Lows.",
            "Lower Highs and Lower Lows.",
            "Higher Highs and Lower Lows.",
            "Sideways movement."
        ],

        correct: 0,

        explanation:
            "An uptrend is defined by a series of Higher Highs (HH) and Higher Lows (HL)."
    },


    {
        question:
            "What does a long lower wick tell you?",

        options: [
            "Buyers stepped in and pushed price up from the low.",
            "Sellers pushed price down.",
            "Price closed at the low.",
            "The market is trending down."
        ],

        correct: 0,

        explanation:
            "A long lower wick shows that price dropped but buyers aggressively pushed it back up — rejection of lower prices."
    },


    {
        question:
            "Which chart type is the industry standard for Forex?",

        options: [
            "Candlestick chart",
            "Line chart",
            "Bar chart",
            "Point & Figure chart"
        ],

        correct: 0,

        explanation:
            "Candlestick charts are the most popular because they provide rich information (OHLC) in a clear visual format."
    },


    {
        question:
            "What does a large green body indicate?",

        options: [
            "Strong buying pressure.",
            "Strong selling pressure.",
            "Indecision.",
            "A reversal."
        ],

        correct: 0,

        explanation:
            "A large green body means buyers controlled the session — strong upward momentum."
    },


    {
        question:
            "What is a 'sideways' market?",

        options: [
            "Price moves within a range without a clear trend.",
            "Price moves up continuously.",
            "Price moves down continuously.",
            "Price does not move at all."
        ],

        correct: 0,

        explanation:
            "A sideways market is when price oscillates between a support and resistance level — no clear trend."
    },


    {
        question:
            "Why should you avoid trading a single candle in isolation?",

        options: [
            "Because you need confirmation from other candles.",
            "Because single candles are always wrong.",
            "Because you should only trade on daily charts.",
            "Because it's against the rules."
        ],

        correct: 0,

        explanation:
            "Always wait for confirmation — a single candle can be a false signal. Look for the next candle to validate the move."
    }

];


/* ============================================================
   2. QUIZ STATE
============================================================ */

let currentQuestion = 0;

let userAnswers = [];

let quizCompleted = false;


/* ============================================================
   3. QUIZ DATA
   Keep question order stable so saved answers remain valid.
============================================================ */

let workingQuizData = [];


/* ============================================================
   4. STORAGE KEYS
============================================================ */

const QUIZ_PREFIX =
    "lesson7";


const QUIZ_STATE_KEY =
    "lesson7_quiz_state";


const QUIZ_SCORE_KEY =
    "lesson7_quiz_score";


const QUIZ_PERCENTAGE_KEY =
    "lesson7_quiz_percentage";


const QUIZ_PASSED_KEY =
    "lesson7_quiz_passed";


const LESSON8_UNLOCK_KEY =
    "lesson8_unlocked";


/* ============================================================
   5. CENTRAL STRATIVO PROFILE
============================================================ */

const STRATIVO_PROFILE_KEY =
    "strativo_student_profile";


const LESSON_ID =
    7;


const NEXT_LESSON_ID =
    8;


const LESSON_XP =
    50;


/* ============================================================
   6. DEFAULT PROFILE FALLBACK
============================================================ */

const DEFAULT_STRATIVO_PROFILE = {

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
   7. PROFILE LOAD
============================================================ */

function loadStrativoProfile() {

    try {

        const stored =
            localStorage.getItem(
                STRATIVO_PROFILE_KEY
            );


        if (!stored) {

            return {
                ...DEFAULT_STRATIVO_PROFILE
            };

        }


        const parsed =
            JSON.parse(
                stored
            );


        return {

            ...DEFAULT_STRATIVO_PROFILE,

            ...parsed

        };

    }
    catch (error) {

        console.warn(
            "Strativo profile could not be loaded.",
            error
        );


        return {
            ...DEFAULT_STRATIVO_PROFILE
        };

    }

}


/* ============================================================
   8. PROFILE SAVE
============================================================ */

function saveStrativoProfile(
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
            "Strativo profile could not be saved.",
            error
        );

    }

}


/* ============================================================
   9. LEVEL CALCULATION
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
   10. BADGE CALCULATION
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
   11. SYNC LESSON 7 COMPLETION
============================================================ */

function syncLesson7Completion(
    score,
    percentage
) {

    const profile =
        loadStrativoProfile();


    /*
     * Make sure arrays/objects exist.
     */

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
     * Save the Lesson 7 quiz result
     * into the central profile.
     */

    profile.quizScores.lesson7 = {

        score:
            score,

        total:
            BASE_QUIZ_DATA.length,

        percentage:
            percentage,

        passed:
            true,

        completedAt:
            new Date().toISOString()

    };


    /*
     * IMPORTANT:
     *
     * XP is awarded ONLY when Lesson 7
     * was never completed before.
     */

    const alreadyCompleted =
        profile.completedLessons.includes(
            LESSON_ID
        );


    /*
     * Complete Lesson 7.
     */

    if (
        !alreadyCompleted
    ) {

        profile.completedLessons.push(
            LESSON_ID
        );

    }


    /*
     * Clean completed lesson list.
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


    /*
     * Preserve previous unlocks
     * and unlock Lesson 8.
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


    /*
     * Clean unlock list.
     */

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


    /*
     * Move current learning position
     * to Lesson 8.
     */

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


    /*
     * Award +50 XP only once.
     */

    if (
        !alreadyCompleted
    ) {

        const oldXP =
            Number(
                profile.totalXP
            ) || 0;


        profile.totalXP =
            oldXP +
            LESSON_XP;


        profile.currentXP =
            profile.totalXP;


        /*
         * Recalculate level.
         */

        profile.currentLevel =
            calculateLevel(
                profile.totalXP
            );


        /*
         * Recalculate badge.
         */

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
     * First-time lesson achievement.
     */

    if (
        !profile.achievements.includes(
            "lesson7_complete"
        )
    ) {

        profile.achievements.push(
            "lesson7_complete"
        );

    }


    /*
     * Save central profile.
     */

    saveStrativoProfile(
        profile
    );


    /*
     * Preserve the old local unlock key
     * for compatibility with existing UI.
     */

    localStorage.setItem(
        LESSON8_UNLOCK_KEY,
        "true"
    );


    /*
     * Ask the browser to notify any open
     * Strativo pages that the profile changed.
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

        /*
         * Non-fatal. localStorage was already saved.
         */

        console.warn(
            "Profile storage event could not be dispatched.",
            error
        );

    }


    return {
        alreadyCompleted,
        profile
    };

}


/* ============================================================
   12. PREPARE QUIZ
============================================================ */

function prepareQuiz() {

    /*
     * Deep clone the base quiz.
     */

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
     * Stable order.
     *
     * We intentionally do NOT shuffle the questions/options
     * here because saved answers must remain valid after refresh.
     */

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
   13. SAVE QUIZ STATE
============================================================ */

function saveQuizState() {

    try {

        localStorage.setItem(

            QUIZ_STATE_KEY,

            JSON.stringify({

                currentQuestion:
                    currentQuestion,

                userAnswers:
                    userAnswers,

                quizCompleted:
                    quizCompleted,

                savedAt:
                    Date.now()

            })

        );

    }
    catch (error) {

        console.warn(
            "Lesson 7 quiz state could not be saved.",
            error
        );

    }

}


/* ============================================================
   14. LOAD QUIZ STATE
============================================================ */

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


        if (
            Array.isArray(
                saved.userAnswers
            )
        ) {

            userAnswers =
                saved.userAnswers
                    .slice(
                        0,
                        workingQuizData.length
                    );


            while (
                userAnswers.length <
                workingQuizData.length
            ) {

                userAnswers.push(
                    null
                );

            }

        }


        if (
            typeof saved.quizCompleted ===
            "boolean"
        ) {

            quizCompleted =
                saved.quizCompleted;

        }


        return true;

    }
    catch (error) {

        console.warn(
            "Lesson 7 quiz state could not be loaded.",
            error
        );


        return false;

    }

}


/* ============================================================
   15. DOM HELPERS
============================================================ */

function getElement(
    id
) {

    return document.getElementById(
        id
    );

}


/* ============================================================
   16. MESSAGE HELPERS
============================================================ */

function showMessage(
    text
) {

    let msgBox =
        getElement(
            "quiz-message"
        );


    if (!msgBox) {

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


        const container =
            getElement(
                "quiz-container"
            );


        if (container) {

            container.appendChild(
                msgBox
            );

        }

    }


    if (!msgBox) {

        return;

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
   17. LOAD QUESTION
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
     * Restore an existing answer.
     */

    const savedAnswer =
        userAnswers[
            currentQuestion
        ];


    if (
        savedAnswer !==
        null &&
        savedAnswer !==
        undefined
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


    if (previous) {

        previous.disabled =
            currentQuestion ===
            0;

    }


    if (next) {

        next.textContent =

            currentQuestion ===
            workingQuizData.length - 1

                ? "Finish Quiz →"

                : "Next →";


        /*
         * The student must answer the
         * current question before moving.
         */

        next.disabled =
            savedAnswer ===
            null ||
            savedAnswer ===
            undefined;

    }


    saveQuizState();

}


/* ============================================================
   18. CHECK ANSWER
============================================================ */

function checkAnswer(
    index
) {

    if (
        userAnswers[
            currentQuestion
        ] !==
        null &&
        userAnswers[
            currentQuestion
        ] !==
        undefined
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
                q.correct
            ) {

                button.classList.add(
                    "correct"
                );

            }


            if (
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
   19. NEXT QUESTION
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
   20. PREVIOUS QUESTION
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
   21. FINISH QUIZ
============================================================ */

function finishQuiz() {

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
            "Please answer the final question before finishing."
        );


        return;

    }


    let score =
        0;


    for (
        let i = 0;
        i < workingQuizData.length;
        i++
    ) {

        if (
            userAnswers[i] ===
            workingQuizData[i].correct
        ) {

            score++;

        }

    }


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
     * Save quiz-specific results.
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


    /*
     * Also preserve compatibility with
     * older versions.
     */

    localStorage.setItem(

        "lesson7_completed",

        String(passed)

    );


    /*
     * PASSING QUIZ
     */

    if (passed) {

        /*
         * Permanent old unlock flag.
         */

        localStorage.setItem(

            LESSON8_UNLOCK_KEY,

            "true"

        );


        /*
         * CENTRAL STRATIVO SYSTEM
         *
         * This is the important part.
         */

        syncLesson7Completion(

            score,

            percentage

        );


        /*
         * Unlock Chart District in Strativo World State
         */

        try {

            if (
                window.StrativoWorldState &&
                typeof window.StrativoWorldState.get === "function"
            ) {

                const ws =
                    window.StrativoWorldState.get();

                const districts =
                    new Set(ws.unlockedDistricts || []);

                districts.add("chart-district");

                window.StrativoWorldState.patch({
                    unlockedDistricts:
                        Array.from(districts)
                });

            } else {

                const wsRaw =
                    localStorage.getItem(
                        "strativo_world_state"
                    );

                const ws =
                    wsRaw
                        ? JSON.parse(wsRaw)
                        : {
                            unlockedDistricts: [
                                "candle-city",
                                "pip-district",
                                "market-arena"
                            ]
                        };

                const districts =
                    new Set(ws.unlockedDistricts || []);

                districts.add("chart-district");

                ws.unlockedDistricts =
                    Array.from(districts);

                localStorage.setItem(
                    "strativo_world_state",
                    JSON.stringify(ws)
                );

            }

        } catch (err) {

            console.warn(
                "Could not sync Chart District unlock to World State:",
                err
            );

        }


        /*
         * Update Lesson 8 / District 4 button if the
         * current page has its config.
         */

        if (
            typeof lesson8Config !==
            "undefined"
        ) {

            lesson8Config.status =
                "unlocked";

            lesson8Config.url =
                "../../games/districts/chart-district.html";

            lesson8Config.labelUnlocked =
                "🚀 Enter Chart District (District 4)";


            if (
                typeof renderLesson8Button ===
                "function"
            ) {

                renderLesson8Button();

            }

        }

    }


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
            "🎉 You passed! Chart District (District 4) is now unlocked. Entering Chart District...";

    }
    else {

        message +=
            "You need at least 70% to pass. Please retry the quiz.";

    }


    const result =
        getElement(
            "quiz-result"
        );


    if (result) {

        let extraCta = "";

        if (passed) {

            extraCta = `
                <div style="margin-top:14px;">
                    <a
                        href="../../games/districts/chart-district.html"
                        id="directChartDistrictBtn"
                        class="lesson-action-btn unlocked"
                        style="display:inline-block; padding:12px 24px; background:#00e5a8; color:#0a1424; font-weight:800; border-radius:8px; text-decoration:none; box-shadow:0 4px 15px rgba(0,229,168,0.35);"
                    >
                        🚀 Enter Chart District Now
                    </a>
                </div>
            `;

        }

        result.innerHTML =
            `<div>${message}</div>${extraCta}`;


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


    /*
     * Direct automatic navigation on confirmed success
     */

    if (passed) {

        if (!window.__strativoChartNavigating) {

            window.__strativoChartNavigating =
                true;

            setTimeout(
                function () {

                    window.location.href =
                        "../../games/districts/chart-district.html";

                },
                1500
            );

        }

    }

}


/* ============================================================
   22. RETRY QUIZ
============================================================ */

function retryQuiz() {

    /*
     * IMPORTANT:
     *
     * We reset only the current quiz attempt.
     *
     * We DO NOT delete:
     *
     *   completedLessons
     *   unlockedLessons
     *   XP
     *   level
     *   badge
     *   Lesson 8 unlock
     *
     * Therefore an already completed Lesson 7
     * cannot accidentally become locked again.
     */

    prepareQuiz();


    loadQuestion();


    hideMessage();


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


    /*
     * Restore Lesson 8 unlock status.
     */

    if (
        typeof lesson8Config !==
        "undefined"
    ) {

        const unlocked =
            localStorage.getItem(
                LESSON8_UNLOCK_KEY
            ) ===
            "true";


        lesson8Config.status =
            unlocked
                ? "unlocked"
                : "coming-soon";


        if (
            typeof renderLesson8Button ===
            "function"
        ) {

            renderLesson8Button();

        }

    }


    const quizContainer =
        getElement(
            "quiz-container"
        );


    if (
        quizContainer
    ) {

        quizContainer.scrollIntoView({
            behavior:
                "smooth",

            block:
                "start"
        });

    }


    saveQuizState();

}


/* ============================================================
   23. INITIALIZATION
============================================================ */

function initQuiz() {

    /*
     * Prepare default quiz data.
     */

    prepareQuiz();


    /*
     * Try to restore a previous attempt.
     *
     * Because the question order remains stable,
     * the saved answer indexes remain valid.
     */

    loadQuizState();


    /*
     * Load current question.
     */

    loadQuestion();


    /*
     * Restore permanent Lesson 8 unlock.
     */

    if (
        localStorage.getItem(
            LESSON8_UNLOCK_KEY
        ) ===
        "true"
    ) {

        if (
            typeof lesson8Config !==
            "undefined"
        ) {

            lesson8Config.status =
                "unlocked";

            lesson8Config.url =
                "../../games/districts/chart-district.html";

            lesson8Config.labelUnlocked =
                "🚀 Enter Chart District (District 4)";


            if (
                typeof renderLesson8Button ===
                "function"
            ) {

                renderLesson8Button();

            }

        }

    }

}


/* ============================================================
   24. DOM READY
============================================================ */

document.addEventListener(

    "DOMContentLoaded",

    initQuiz

);


/* ============================================================
   25. GLOBAL EXPORTS
============================================================ */

/*
 * Required by lesson7.html inline onclick handlers.
 */

window.checkAnswer =
    checkAnswer;


window.nextQuestion =
    nextQuestion;


window.previousQuestion =
    previousQuestion;


window.retryQuiz =
    retryQuiz;
