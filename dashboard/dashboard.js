/* ==========================================================
   STRATIVO ACADEMY
   STUDENT DASHBOARD ENGINE
   Version 1.4

   CONNECTED SYSTEMS
   ----------------------------------------------------------
   ✓ Course Progress
   ✓ Quiz Results
   ✓ Continue Learning
   ✓ Resume Lesson
   ✓ XP & Level
   ✓ Learning Statistics
   ✓ Achievement Engine
   ✓ Achievement Preview
   ✓ Learning Activity
   ✓ Learning Streak
   ✓ Learning Days
   ✓ Last Activity
   ✓ Appearance Sync
========================================================== */

"use strict";

(function () {

    /* ======================================================
       CONFIGURATION
    ====================================================== */

    const TOTAL_LESSONS = 10;

    const LESSONS = Array.from(
        { length: TOTAL_LESSONS },
        (_, index) => index + 1
    );


    /* ======================================================
       DOM HELPER
    ====================================================== */

    function get(id) {

        return document.getElementById(id);

    }


    /* ======================================================
       SAFE NUMBER
    ====================================================== */

    function number(value) {

        const result =
            Number.parseInt(value, 10);

        return Number.isFinite(result)
            ? result
            : 0;

    }


    /* ======================================================
       LESSON PATH
    ====================================================== */

    function getLessonPath(lessonNumber) {

        return `../lessons/module1/lesson${lessonNumber}.html`;

    }


    /* ======================================================
       LESSON CURRENT STEP
    ====================================================== */

    function getLessonCurrentStep(lessonNumber) {

        const value =
            localStorage.getItem(
                `lesson${lessonNumber}_currentStep`
            );


        const step =
            Number.parseInt(
                value,
                10
            );


        if (
            Number.isFinite(step) &&
            step > 0
        ) {

            return step;

        }


        return 1;

    }


    /* ======================================================
       LESSON RESUME STATE
    ====================================================== */

    function getLessonResumeState(lessonNumber) {

        const step =
            getLessonCurrentStep(
                lessonNumber
            );


        const completed =
            localStorage.getItem(
                `lesson${lessonNumber}_completed`
            ) === "true";


        const started =
            localStorage.getItem(
                `lesson${lessonNumber}_currentStep`
            ) !== null;


        return {

            lesson:
                lessonNumber,

            step:
                step,

            started:
                started,

            completed:
                completed

        };

    }


    /* ======================================================
       COMPLETED LESSONS
    ====================================================== */

    function getCompletedLessons() {

        return LESSONS.filter(
            function (lesson) {

                return (
                    localStorage.getItem(
                        `lesson${lesson}_completed`
                    ) === "true"
                );

            }
        );

    }


    /* ======================================================
       NEXT INCOMPLETE LESSON
    ====================================================== */

    function getNextIncompleteLesson() {

        for (
            const lesson of LESSONS
        ) {

            const completed =
                localStorage.getItem(
                    `lesson${lesson}_completed`
                ) === "true";


            if (!completed) {

                return lesson;

            }

        }


        return null;

    }


    /* ======================================================
       CONTINUE LEARNING STATE
    ====================================================== */

    function getContinueLearningState() {

        const nextLesson =
            getNextIncompleteLesson();


        if (
            nextLesson === null
        ) {

            return {

                lesson:
                    null,

                step:
                    null,

                started:
                    false,

                completed:
                    true

            };

        }


        const resume =
            getLessonResumeState(
                nextLesson
            );


        return {

            lesson:
                nextLesson,

            step:
                resume.step,

            started:
                resume.started,

            completed:
                false

        };

    }


    /* ======================================================
       RESUME DESCRIPTION
    ====================================================== */

    function getResumeDescription(state) {

        if (
            !state ||
            state.lesson === null
        ) {

            return (
                "More learning content will be added " +
                "as the Academy expands."
            );

        }


        if (
            state.started &&
            state.step > 1
        ) {

            return (
                `Resume Lesson ${state.lesson} ` +
                `from Step ${state.step}.`
            );

        }


        if (state.started) {

            return (
                `Continue Lesson ${state.lesson} ` +
                `from where you left off.`
            );

        }


        return (
            `Begin Lesson ${state.lesson} and continue ` +
            `your structured forex learning journey.`
        );

    }


    /* ======================================================
       QUIZ RESULTS
    ====================================================== */

    function getQuizResults() {

        const results = [];


        LESSONS.forEach(
            function (lesson) {

                /* ------------------------------------------
                   STANDARD FORMAT
                ------------------------------------------ */

                const standardScore =
                    localStorage.getItem(
                        `lesson${lesson}_quizScore`
                    );


                const standardTotal =
                    localStorage.getItem(
                        `lesson${lesson}_quizTotal`
                    );


                const standardPercentage =
                    localStorage.getItem(
                        `lesson${lesson}_quizPercentage`
                    );


                if (
                    standardScore !== null &&
                    standardTotal !== null
                ) {

                    const score =
                        number(
                            standardScore
                        );


                    const total =
                        number(
                            standardTotal
                        );


                    if (
                        total > 0
                    ) {

                        let percentage =
                            standardPercentage !== null

                                ? number(
                                    standardPercentage
                                )

                                : Math.round(
                                    (
                                        score /
                                        total
                                    ) * 100
                                );


                        percentage =
                            Math.min(
                                100,
                                Math.max(
                                    0,
                                    percentage
                                )
                            );


                        results.push({

                            lesson:
                                lesson,

                            score:
                                score,

                            total:
                                total,

                            percentage:
                                percentage

                        });


                        return;

                    }

                }


                /* ------------------------------------------
                   MODERN FORMAT
                ------------------------------------------ */

                const modernScore =
                    localStorage.getItem(
                        `lesson${lesson}_quiz_score`
                    );


                const modernPercentage =
                    localStorage.getItem(
                        `lesson${lesson}_quiz_percentage`
                    );


                if (
                    modernScore !== null
                ) {

                    const score =
                        number(
                            modernScore
                        );


                    let percentage =
                        modernPercentage !== null

                            ? number(
                                modernPercentage
                            )

                            : 0;


                    percentage =
                        Math.min(
                            100,
                            Math.max(
                                0,
                                percentage
                            )
                        );


                    results.push({

                        lesson:
                            lesson,

                        score:
                            score,

                        total:
                            null,

                        percentage:
                            percentage

                    });

                }

            }
        );


        return results;

    }


    /* ======================================================
       COURSE DATA
    ====================================================== */

    function getCourseData() {

        const completedLessons =
            getCompletedLessons();


        const quizResults =
            getQuizResults();


        let averageQuizScore =
            null;


        if (
            quizResults.length > 0
        ) {

            const totalPercentage =
                quizResults.reduce(
                    function (
                        sum,
                        result
                    ) {

                        return (
                            sum +
                            result.percentage
                        );

                    },
                    0
                );


            averageQuizScore =
                Math.round(
                    totalPercentage /
                    quizResults.length
                );

        }


        return {

            completedLessons:
                completedLessons,

            completedCount:
                completedLessons.length,

            quizResults:
                quizResults,

            quizzesTaken:
                quizResults.length,

            averageQuizScore:
                averageQuizScore

        };

    }


    /* ======================================================
       COURSE PROGRESS
    ====================================================== */

    function updateCourseProgress(data) {

        const percentage =
            Math.min(
                100,
                Math.max(
                    0,
                    Math.round(
                        (
                            data.completedCount /
                            TOTAL_LESSONS
                        ) * 100
                    )
                )
            );


        const progressText =
            get(
                "dashboard-page-progress"
            );


        const lessons =
            get(
                "dashboard-page-lessons"
            );


        const grade =
            get(
                "dashboard-page-grade"
            );


        const progressCircle =
            get(
                "dashboard-page-progress-circle"
            );


        if (progressText) {

            progressText.textContent =
                `${percentage}%`;

        }


        if (lessons) {

            lessons.textContent =
                `${data.completedCount} / ${TOTAL_LESSONS}`;

        }


        if (grade) {

            grade.textContent =
                data.averageQuizScore === null

                    ? "--%"

                    : `${data.averageQuizScore}%`;

        }


        if (progressCircle) {

            const radius =
                76;


            const circumference =
                2 *
                Math.PI *
                radius;


            progressCircle.style.strokeDasharray =
                circumference;


            progressCircle.style.strokeDashoffset =
                circumference -
                (
                    circumference *
                    percentage
                ) /
                100;

        }

    }


    /* ======================================================
       SET CONTINUE BUTTON
    ====================================================== */

    function setContinueButton(
        button,
        continueState,
        completedCount
    ) {

        if (!button) {

            return;

        }


        /* ----------------------------------------------
           COURSE COMPLETE
        ---------------------------------------------- */

        if (
            !continueState ||
            continueState.lesson === null
        ) {

            if (
                button.tagName === "A"
            ) {

                button.href =
                    "../beginner.html";

            }


            button.innerHTML =
                'Review Course <i class="fas fa-arrow-right" aria-hidden="true"></i>';

            return;

        }


        /* ----------------------------------------------
           LESSON LINK
        ---------------------------------------------- */

        if (
            button.tagName === "A"
        ) {

            button.href =
                getLessonPath(
                    continueState.lesson
                );

        }


        /* ----------------------------------------------
           FIRST LESSON
        ---------------------------------------------- */

        if (
            completedCount === 0
        ) {

            button.innerHTML =
                continueState.started

                    ? 'Continue Lesson 1 <i class="fas fa-arrow-right" aria-hidden="true"></i>'

                    : 'Start Learning <i class="fas fa-arrow-right" aria-hidden="true"></i>';

            return;

        }


        /* ----------------------------------------------
           NEXT LESSON
        ---------------------------------------------- */

        button.innerHTML =
            continueState.started

                ? `Continue Lesson ${continueState.lesson} <i class="fas fa-arrow-right" aria-hidden="true"></i>`

                : `Start Lesson ${continueState.lesson} <i class="fas fa-arrow-right" aria-hidden="true"></i>`;

    }


    /* ======================================================
       FIND CONTINUE BUTTONS
    ====================================================== */

    function findAllContinueButtons() {

        const buttons = [];


        const knownIds = [

            "dashboard-continue-btn",

            "dashboard-action-btn",

            "dash-action-btn",

            "dashboard-welcome-continue-btn",

            "dashboard-next-lesson-btn"

        ];


        knownIds.forEach(
            function (id) {

                const element =
                    get(id);


                if (
                    element &&
                    !buttons.includes(
                        element
                    )
                ) {

                    buttons.push(
                        element
                    );

                }

            }
        );


        const candidates =
            document.querySelectorAll(
                "a[href], button"
            );


        candidates.forEach(
            function (element) {

                const text =
                    element.textContent
                        .trim()
                        .toLowerCase();


                if (
                    text.includes(
                        "continue learning"
                    ) ||
                    text.includes(
                        "start learning"
                    ) ||
                    text.includes(
                        "start lesson"
                    ) ||
                    text === "continue"
                ) {

                    if (
                        !buttons.includes(
                            element
                        )
                    ) {

                        buttons.push(
                            element
                        );

                    }

                }

            }
        );


        return buttons;

    }


    /* ======================================================
       UPDATE ALL CONTINUE BUTTONS
    ====================================================== */

    function updateAllContinueButtons(data) {

        const continueState =
            getContinueLearningState();


        const buttons =
            findAllContinueButtons();


        buttons.forEach(
            function (button) {

                setContinueButton(
                    button,
                    continueState,
                    data.completedCount
                );

            }
        );

    }


    /* ======================================================
       CONTINUE LEARNING
    ====================================================== */

    function updateContinueLearning(data) {

        const continueState =
            getContinueLearningState();


        const status =
            get(
                "dashboard-page-status"
            );


        const description =
            get(
                "dashboard-page-status-text"
            );


        const nextLessonText =
            get(
                "dashboard-next-lesson"
            );


        const nextDescription =
            get(
                "dashboard-next-description"
            );


        /* ----------------------------------------------
           COURSE COMPLETE
        ---------------------------------------------- */

        if (
            continueState.lesson === null
        ) {

            if (status) {

                status.textContent =
                    "Module 1 Completed!";

            }


            if (description) {

                description.textContent =
                    "Excellent work! You have completed all currently available Module 1 lessons.";

            }


            if (nextLessonText) {

                nextLessonText.textContent =
                    "Module 1 Complete";

            }


            if (nextDescription) {

                nextDescription.textContent =
                    "More learning content will be added as the Academy expands.";

            }


            updateAllContinueButtons(
                data
            );


            return;

        }


        /* ----------------------------------------------
           CURRENT LESSON
        ---------------------------------------------- */

        const lesson =
            continueState.lesson;


        const step =
            continueState.step;


        const started =
            continueState.started;


        if (status) {

            status.textContent =
                data.completedCount === 0 &&
                !started

                    ? "Starting Your Journey"

                    : `Lesson ${lesson} Ready`;

        }


        if (description) {

            description.textContent =
                getResumeDescription(
                    continueState
                );

        }


        if (nextLessonText) {

            nextLessonText.textContent =
                started &&
                step > 1

                    ? `Lesson ${lesson} • Step ${step}`

                    : `Lesson ${lesson}`;

        }


        if (nextDescription) {

            nextDescription.textContent =
                started &&
                step > 1

                    ? `Resume Lesson ${lesson} from Step ${step}.`

                    : started

                        ? `Continue Lesson ${lesson} from where you left off.`

                        : `Begin Lesson ${lesson} and continue your structured forex learning journey.`;

        }


        updateAllContinueButtons(
            data
        );

    }


    /* ======================================================
       ACHIEVEMENT ENGINE STATE
    ====================================================== */

    function getAchievementState() {

        if (
            window.StrativoAchievementEngine
        ) {

            try {

                if (
                    typeof
                    window.StrativoAchievementEngine
                        .refresh ===
                    "function"
                ) {

                    window
                        .StrativoAchievementEngine
                        .refresh();

                }

            } catch (error) {

                console.warn(
                    "Strativo Dashboard: Achievement Engine refresh failed.",
                    error
                );

            }


            try {

                if (
                    typeof
                    window.StrativoAchievementEngine
                        .getState ===
                    "function"
                ) {

                    const state =
                        window
                            .StrativoAchievementEngine
                            .getState();


                    if (state) {

                        return state;

                    }

                }

            } catch (error) {

                console.warn(
                    "Strativo Dashboard: Could not read Achievement Engine state.",
                    error
                );

            }

        }


        return {

            xp:
                0,

            level:
                1,

            currentLevelXP:
                0,

            nextLevelXP:
                100,

            levelPercentage:
                0,

            completedLessons:
                0,

            learningStreak:
                0,

            achievements:
                []

        };

    }


    /* ======================================================
       XP & LEVEL
    ====================================================== */

    function updateGamification(
        state
    ) {

        const xp =
            number(
                state.xp
            );


        const level =
            number(
                state.level
            ) || 1;


        const currentLevelXP =
            number(
                state.currentLevelXP
            );


        const nextLevelXP =
            number(
                state.nextLevelXP
            );


        let percentage =
            0;


        if (
            nextLevelXP >
            currentLevelXP
        ) {

            percentage =
                (
                    (
                        xp -
                        currentLevelXP
                    ) /
                    (
                        nextLevelXP -
                        currentLevelXP
                    )
                ) * 100;

        }


        percentage =
            Math.min(
                100,
                Math.max(
                    0,
                    percentage
                )
            );


        const xpElement =
            get(
                "dashboard-page-xp"
            );


        const levelElement =
            get(
                "dashboard-page-level"
            );


        const xpFill =
            get(
                "dashboard-page-xp-fill"
            );


        const xpPercent =
            get(
                "dashboard-page-xp-percent"
            );


        const nextXP =
            get(
                "dashboard-page-xp-next"
            );


        if (xpElement) {

            xpElement.textContent =
                xp.toLocaleString();

        }


        if (levelElement) {

            levelElement.textContent =
                `Level ${level}`;

        }


        if (xpFill) {

            xpFill.style.width =
                `${percentage}%`;

        }


        if (xpPercent) {

            xpPercent.textContent =
                `${Math.round(percentage)}%`;

        }


        if (nextXP) {

            if (
                nextLevelXP > 0 &&
                xp < nextLevelXP
            ) {

                nextXP.textContent =
                    `Next Level: ${nextLevelXP.toLocaleString()} XP`;

            } else {

                nextXP.textContent =
                    "Next level unlocked";

            }

        }

    }


    /* ======================================================
       LEARNING STATISTICS
    ====================================================== */

    function updateStatistics(
        data,
        state
    ) {

        const lessons =
            get(
                "dashboard-stat-lessons"
            );


        const quizzes =
            get(
                "dashboard-stat-quizzes"
            );


        const average =
            get(
                "dashboard-stat-average"
            );


        const streak =
            get(
                "dashboard-stat-streak"
            );


        if (lessons) {

            lessons.textContent =
                data.completedCount;

        }


        if (quizzes) {

            quizzes.textContent =
                data.quizzesTaken;

        }


        if (average) {

            average.textContent =
                data.averageQuizScore === null

                    ? "--%"

                    : `${data.averageQuizScore}%`;

        }


        if (streak) {

            streak.textContent =
                number(
                    state.learningStreak
                );

        }

    }


    /* ======================================================
       REAL ACHIEVEMENTS
    ====================================================== */

    function getRealAchievements(
        state
    ) {

        if (
            state &&
            Array.isArray(
                state.achievements
            )
        ) {

            return state.achievements;

        }


        if (
            window.StrativoAchievementEngine &&
            typeof
            window.StrativoAchievementEngine
                .getAchievements ===
            "function"
        ) {

            try {

                const achievements =
                    window
                        .StrativoAchievementEngine
                        .getAchievements();


                if (
                    Array.isArray(
                        achievements
                    )
                ) {

                    return achievements;

                }

            } catch (error) {

                console.warn(
                    "Strativo Dashboard: Could not read achievements.",
                    error
                );

            }

        }


        return [];

    }


    /* ======================================================
       ACHIEVEMENT PREVIEW
    ====================================================== */

    function updateAchievementsPreview(
        state
    ) {

        const unlockedElement =
            get(
                "dashboard-achievements-unlocked"
            );


        const xpElement =
            get(
                "dashboard-achievement-xp"
            );


        const nextElement =
            get(
                "dashboard-next-achievement"
            );


        const achievements =
            getRealAchievements(
                state
            );


        const unlocked =
            achievements.filter(
                function (
                    achievement
                ) {

                    return (
                        achievement &&
                        achievement.unlocked === true
                    );

                }
            );


        const locked =
            achievements.filter(
                function (
                    achievement
                ) {

                    return !(
                        achievement &&
                        achievement.unlocked === true
                    );

                }
            );


        if (
            unlockedElement
        ) {

            unlockedElement.textContent =
                unlocked.length;

        }


        if (
            xpElement
        ) {

            xpElement.textContent =
                `${number(
                    state.xp
                ).toLocaleString()} XP`;

        }


        if (
            nextElement
        ) {

            if (
                locked.length > 0
            ) {

                const nextAchievement =
                    locked[0];


                const title =
                    nextAchievement.title ||
                    nextAchievement.name ||
                    "Next Achievement";


                nextElement.textContent =
                    title;

            }

            else {

                nextElement.textContent =
                    "All Available Unlocked";

            }

        }

    }


    /* ======================================================
       GET LEARNING DATES
       ------------------------------------------------------
       The Achievement Engine is the source of truth.
    ====================================================== */

    function getLearningDates() {

        /* ------------------------------------------------
           Prefer Achievement Engine API if available.
        ------------------------------------------------ */

        if (
            window.StrativoAchievementEngine
        ) {

            try {

                const state =
                    window
                        .StrativoAchievementEngine
                        .getState();


                /*
                 * Current Achievement Engine exposes
                 * learningStreak through getState().
                 *
                 * Learning dates themselves are stored
                 * under the central engine namespace.
                 */

            } catch (error) {

                console.warn(
                    "Strativo Dashboard: Could not read learning activity state.",
                    error
                );

            }

        }


        /* ------------------------------------------------
           Same central storage key used by the engine:
           
           strativo_learning_dates
        ------------------------------------------------ */

        try {

            const stored =
                localStorage.getItem(
                    "strativo_learning_dates"
                );


            if (
                !stored
            ) {

                return [];

            }


            const parsed =
                JSON.parse(
                    stored
                );


            if (
                Array.isArray(
                    parsed
                )
            ) {

                return parsed;

            }

        } catch (error) {

            console.warn(
                "Strativo Dashboard: Could not read learning dates.",
                error
            );

        }


        return [];

    }


    /* ======================================================
       FORMAT ACTIVITY DATE
    ====================================================== */

    function formatActivityDate(
        dateString
    ) {

        if (
            !dateString
        ) {

            return "No activity";

        }


        const date =
            new Date(
                `${dateString}T00:00:00`
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "Unknown";

        }


        return date.toLocaleDateString(
            undefined,
            {
                day:
                    "numeric",

                month:
                    "short",

                year:
                    "numeric"
            }
        );

    }


    /* ======================================================
       LEARNING ACTIVITY
       ------------------------------------------------------
       Uses the same learning dates and streak source
       as Achievement Engine.
    ====================================================== */

    function updateLearningActivity(
        state
    ) {

        const streakElement =
            get(
                "dashboard-learning-streak"
            );


        const daysElement =
            get(
                "dashboard-learning-days"
            );


        const lastActivityElement =
            get(
                "dashboard-last-activity"
            );


        /* ------------------------------------------------
           STREAK
        ------------------------------------------------ */

        const streak =
            number(
                state.learningStreak
            );


        if (
            streakElement
        ) {

            streakElement.textContent =
                `${streak} ${
                    streak === 1
                        ? "Day"
                        : "Days"
                }`;

        }


        /* ------------------------------------------------
           LEARNING DATES
        ------------------------------------------------ */

        const learningDates =
            getLearningDates();


        /* ------------------------------------------------
           UNIQUE DATES
        ------------------------------------------------ */

        const uniqueDates =
            Array.from(
                new Set(
                    learningDates
                )
            );


        /* ------------------------------------------------
           LEARNING DAYS
        ------------------------------------------------ */

        if (
            daysElement
        ) {

            daysElement.textContent =
                `${uniqueDates.length} ${
                    uniqueDates.length === 1
                        ? "Day"
                        : "Days"
                }`;

        }


        /* ------------------------------------------------
           LAST ACTIVITY
        ------------------------------------------------ */

        if (
            lastActivityElement
        ) {

            if (
                uniqueDates.length === 0
            ) {

                lastActivityElement.textContent =
                    "No activity";

            }

            else {

                const sortedDates =
                    [...uniqueDates]
                        .sort()
                        .reverse();


                const latestDate =
                    sortedDates[0];


                lastActivityElement.textContent =
                    formatActivityDate(
                        latestDate
                    );

            }

        }

    }


    /* ======================================================
       MAIN DASHBOARD UPDATE
    ====================================================== */

    function updateDashboard() {

        /* ------------------------------------------------
           COURSE DATA
        ------------------------------------------------ */

        const data =
            getCourseData();


        /* ------------------------------------------------
           ACHIEVEMENT ENGINE
        ------------------------------------------------ */

        const achievementState =
            getAchievementState();


        /* ------------------------------------------------
           COURSE PROGRESS
        ------------------------------------------------ */

        updateCourseProgress(
            data
        );


        /* ------------------------------------------------
           CONTINUE LEARNING
        ------------------------------------------------ */

        updateContinueLearning(
            data
        );


        /* ------------------------------------------------
           XP / LEVEL
        ------------------------------------------------ */

        updateGamification(
            achievementState
        );


        /* ------------------------------------------------
           STATISTICS
        ------------------------------------------------ */

        updateStatistics(
            data,
            achievementState
        );


        /* ------------------------------------------------
           ACHIEVEMENTS
        ------------------------------------------------ */

        updateAchievementsPreview(
            achievementState
        );


        /* ------------------------------------------------
           LEARNING ACTIVITY
        ------------------------------------------------ */

        updateLearningActivity(
            achievementState
        );


        /* ------------------------------------------------
           DEBUG
        ------------------------------------------------ */

        console.info(
            "Strativo Academy Dashboard:",
            {

                lessons:
                    data.completedCount,

                quizzes:
                    data.quizzesTaken,

                average:
                    data.averageQuizScore,

                xp:
                    achievementState.xp,

                level:
                    achievementState.level,

                streak:
                    achievementState.learningStreak,

                learningDates:
                    getLearningDates(),

                achievements:
                    achievementState.achievements

            }
        );

    }


    /* ======================================================
       PUBLIC DASHBOARD API
    ====================================================== */

    window.StrativoDashboard = {

        refresh:
            updateDashboard,

        getCourseData:
            getCourseData,

        getAchievementState:
            getAchievementState,

        getNextIncompleteLesson:
            getNextIncompleteLesson,

        getRealAchievements:
            getRealAchievements,

        getContinueLearningState:
            getContinueLearningState,

        getLessonCurrentStep:
            getLessonCurrentStep,

        getLearningDates:
            getLearningDates

    };


    /* ======================================================
       INITIALIZE
    ====================================================== */

    function initialize() {

        updateDashboard();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    }

    else {

        initialize();

    }


    /* ======================================================
       LIVE APPEARANCE SYNC
    ====================================================== */

    window.addEventListener(
        "storage",
        function (event) {

            if (

                event.key ===
                    "strativo_theme" ||

                event.key ===
                    "strativo_font_size" ||

                event.key ===
                    "strativo_high_contrast" ||

                event.key ===
                    "strativo_compact_layout" ||

                event.key ===
                    "strativo_focus_mode" ||

                event.key ===
                    "strativo_auto_collapse_sidebar"

            ) {

                if (

                    window.StrativoGlobalAppearance &&

                    typeof
                    window.StrativoGlobalAppearance
                        .apply ===
                    "function"

                ) {

                    window
                        .StrativoGlobalAppearance
                        .apply();

                }

            }

        }
    );


})();