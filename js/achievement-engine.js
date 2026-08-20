/* ==========================================================
   STRATIVO ACADEMY
   Achievement Engine v1.0
   ----------------------------------------------------------
   Purpose:
   - Manage XP
   - Manage levels
   - Detect completed lessons
   - Detect unlocked achievements
   - Store achievement state
   - Provide a central API for the Academy
   - Remain independent from progress.js and quiz-engine.js

   IMPORTANT:
   This engine does NOT replace:
   - progress.js
   - lesson.js
   - quiz-engine.js
   - module.js
========================================================== */

"use strict";

(function () {

    /* ======================================================
       CONFIGURATION
    ====================================================== */

    const CONFIG = {

        /* XP earned for one completed lesson */
        xpPerLesson: 25,

        /* XP required to move from one level to the next */
        xpPerLevel: 100,

        /* Number of lessons the engine currently scans */
        maxLessonsToScan: 100,

        /* Storage namespace */
        storagePrefix: "strativo_"

    };


    /* ======================================================
       STORAGE KEYS
    ====================================================== */

    const STORAGE = {

        totalXP:
            `${CONFIG.storagePrefix}total_xp`,

        awardedLessons:
            `${CONFIG.storagePrefix}xp_awarded_lessons`,

        unlockedAchievements:
            `${CONFIG.storagePrefix}unlocked_achievements`,

        learningDates:
            `${CONFIG.storagePrefix}learning_dates`

    };


    /* ======================================================
       ACHIEVEMENT DEFINITIONS
    ====================================================== */

    const ACHIEVEMENTS = {

        firstLesson: {

            id: "first_lesson",

            title: "First Step",

            description:
                "Complete your first lesson.",

            category: "LEARNING",

            icon: "fa-book"

        },


        firstQuiz: {

            id: "first_quiz",

            title: "Knowledge Check",

            description:
                "Complete your first quiz.",

            category: "QUIZ",

            icon: "fa-circle-question"

        },


        threeDayStreak: {

            id: "three_day_streak",

            title: "Building Momentum",

            description:
                "Maintain a 3-day learning streak.",

            category: "CONSISTENCY",

            icon: "fa-fire"

        },


        first100XP: {

            id: "first_100_xp",

            title: "First 100 XP",

            description:
                "Earn your first 100 XP.",

            category: "XP",

            icon: "fa-star"

        }

    };


    /* ======================================================
       SAFE NUMBER
    ====================================================== */

    function safeNumber(value) {

        const number =
            Number.parseInt(value, 10);

        if (!Number.isFinite(number)) {

            return 0;

        }

        return Math.max(0, number);

    }


    /* ======================================================
       GET TOTAL XP
    ====================================================== */

    function getTotalXP() {

        return safeNumber(
            localStorage.getItem(
                STORAGE.totalXP
            )
        );

    }


    /* ======================================================
       SAVE TOTAL XP
    ====================================================== */

    function saveTotalXP(xp) {

        const safeXP =
            safeNumber(xp);

        localStorage.setItem(
            STORAGE.totalXP,
            safeXP.toString()
        );

        return safeXP;

    }


    /* ======================================================
       ADD XP
    ====================================================== */

    function addXP(amount) {

        const safeAmount =
            safeNumber(amount);

        if (safeAmount <= 0) {

            return getTotalXP();

        }

        const currentXP =
            getTotalXP();

        const newXP =
            currentXP + safeAmount;

        saveTotalXP(newXP);

        return newXP;

    }


    /* ======================================================
       GET COMPLETED LESSONS
    ====================================================== */

    function getCompletedLessons() {

        const completed = [];

        for (
            let i = 1;
            i <= CONFIG.maxLessonsToScan;
            i++
        ) {

            const key =
                `lesson${i}_completed`;

            if (
                localStorage.getItem(key)
                === "true"
            ) {

                completed.push(
                    `lesson${i}`
                );

            }

        }

        return completed;

    }


    /* ======================================================
       GET COMPLETED LESSON COUNT
    ====================================================== */

    function getCompletedLessonCount() {

        return getCompletedLessons().length;

    }


    /* ======================================================
       XP AWARDED LESSONS
    ====================================================== */

    function getAwardedLessons() {

        try {

            const stored =
                localStorage.getItem(
                    STORAGE.awardedLessons
                );

            if (!stored) {

                return [];

            }

            const parsed =
                JSON.parse(stored);

            return Array.isArray(parsed)
                ? parsed
                : [];

        } catch (error) {

            console.warn(
                "Strativo Achievement Engine: Could not read awarded lessons.",
                error
            );

            return [];

        }

    }


    /* ======================================================
       SAVE AWARDED LESSONS
    ====================================================== */

    function saveAwardedLessons(lessons) {

        localStorage.setItem(
            STORAGE.awardedLessons,
            JSON.stringify(lessons)
        );

    }


    /* ======================================================
       AWARD XP FOR COMPLETED LESSONS
    ====================================================== */

    function processLessonXP() {

        const completedLessons =
            getCompletedLessons();

        const awardedLessons =
            getAwardedLessons();

        const awardedSet =
            new Set(awardedLessons);

        let xpAdded = 0;

        completedLessons.forEach(
            lessonId => {

                if (
                    awardedSet.has(
                        lessonId
                    )
                ) {

                    return;

                }

                addXP(
                    CONFIG.xpPerLesson
                );

                awardedSet.add(
                    lessonId
                );

                xpAdded +=
                    CONFIG.xpPerLesson;

            }
        );

        const updatedAwardedLessons =
            Array.from(awardedSet);

        saveAwardedLessons(
            updatedAwardedLessons
        );

        return {

            xpAdded,

            totalXP:
                getTotalXP(),

            processedLessons:
                updatedAwardedLessons

        };

    }


    /* ======================================================
       LEVEL CALCULATION
    ====================================================== */

    function getLevel(xp = getTotalXP()) {

        const safeXP =
            safeNumber(xp);

        return (
            Math.floor(
                safeXP /
                CONFIG.xpPerLevel
            ) + 1
        );

    }


    /* ======================================================
       LEVEL PROGRESS
    ====================================================== */

    function getLevelProgress(
        xp = getTotalXP()
    ) {

        const safeXP =
            safeNumber(xp);

        const level =
            getLevel(safeXP);

        const previousLevelXP =
            (level - 1) *
            CONFIG.xpPerLevel;

        const nextLevelXP =
            level *
            CONFIG.xpPerLevel;

        const currentLevelXP =
            Math.max(
                0,
                safeXP -
                previousLevelXP
            );

        const percentage =
            Math.min(
                100,
                Math.max(
                    0,
                    (
                        currentLevelXP /
                        CONFIG.xpPerLevel
                    ) * 100
                )
            );

        return {

            level,

            currentXP:
                currentLevelXP,

            requiredXP:
                CONFIG.xpPerLevel,

            nextLevelXP,

            percentage

        };

    }


    /* ======================================================
       LEARNING DATES
       ------------------------------------------------------
       Used for future streak functionality.
    ====================================================== */

    function getLearningDates() {

        try {

            const stored =
                localStorage.getItem(
                    STORAGE.learningDates
                );

            if (!stored) {

                return [];

            }

            const parsed =
                JSON.parse(stored);

            return Array.isArray(parsed)
                ? parsed
                : [];

        } catch {

            return [];

        }

    }


    /* ======================================================
       SAVE TODAY AS LEARNING DAY
    ====================================================== */

    function recordLearningActivity() {

        const today =
            new Date()
                .toISOString()
                .slice(0, 10);

        const dates =
            getLearningDates();

        if (!dates.includes(today)) {

            dates.push(today);

            localStorage.setItem(
                STORAGE.learningDates,
                JSON.stringify(dates)
            );

        }

        return dates;

    }


    /* ======================================================
       LEARNING STREAK
    ====================================================== */

    function getLearningStreak() {

        const dates =
            getLearningDates();

        if (!dates.length) {

            return 0;

        }

        const uniqueDates =
            Array.from(
                new Set(dates)
            ).sort().reverse();

        let streak = 0;

        let expectedDate =
            new Date();

        for (
            const dateString
            of uniqueDates
        ) {

            const expected =
                expectedDate
                    .toISOString()
                    .slice(0, 10);

            if (
                dateString === expected
            ) {

                streak++;

                expectedDate.setDate(
                    expectedDate.getDate() - 1
                );

            } else {

                break;

            }

        }

        return streak;

    }


    /* ======================================================
       GET STORED UNLOCKED ACHIEVEMENTS
    ====================================================== */

    function getStoredAchievements() {

        try {

            const stored =
                localStorage.getItem(
                    STORAGE.unlockedAchievements
                );

            if (!stored) {

                return [];

            }

            const parsed =
                JSON.parse(stored);

            return Array.isArray(parsed)
                ? parsed
                : [];

        } catch {

            return [];

        }

    }


    /* ======================================================
       SAVE UNLOCKED ACHIEVEMENTS
    ====================================================== */

    function saveUnlockedAchievements(
        achievements
    ) {

        localStorage.setItem(
            STORAGE.unlockedAchievements,
            JSON.stringify(
                achievements
            )
        );

    }


    /* ======================================================
       CALCULATE AVAILABLE ACHIEVEMENTS
    ====================================================== */

    function calculateUnlockedAchievements() {

        const completedLessons =
            getCompletedLessonCount();

        const totalXP =
            getTotalXP();

        const streak =
            getLearningStreak();

        const unlocked = [];


        /* FIRST LESSON */

        if (
            completedLessons >= 1
        ) {

            unlocked.push(
                ACHIEVEMENTS.firstLesson
            );

        }


        /* FIRST 100 XP */

        if (
            totalXP >= 100
        ) {

            unlocked.push(
                ACHIEVEMENTS.first100XP
            );

        }


        /* THREE DAY STREAK */

        if (
            streak >= 3
        ) {

            unlocked.push(
                ACHIEVEMENTS.threeDayStreak
            );

        }


        /*
         * QUIZ ACHIEVEMENT
         *
         * Not activated yet because
         * quiz-engine.js currently has
         * no official completion data.
         */


        return unlocked;

    }


    /* ======================================================
       SAVE NEW ACHIEVEMENTS
    ====================================================== */

    function processAchievements() {

        const current =
            calculateUnlockedAchievements();

        const stored =
            getStoredAchievements();

        const storedIDs =
            new Set(
                stored
            );

        const newlyUnlocked = [];

        current.forEach(
            achievement => {

                if (
                    !storedIDs.has(
                        achievement.id
                    )
                ) {

                    stored.push(
                        achievement.id
                    );

                    newlyUnlocked.push(
                        achievement
                    );

                }

            }
        );

        saveUnlockedAchievements(
            stored
        );

        return {

            all:
                current,

            newlyUnlocked

        };

    }


    /* ======================================================
       GET ACHIEVEMENT DATA
    ====================================================== */

    function getAchievements() {

        const unlocked =
            calculateUnlockedAchievements();

        const storedIDs =
            new Set(
                getStoredAchievements()
            );

        return unlocked.map(
            achievement => ({

                ...achievement,

                unlocked:
                    storedIDs.has(
                        achievement.id
                    )

            })
        );

    }


    /* ======================================================
       GET ENGINE STATE
    ====================================================== */

    function getState() {

        const totalXP =
            getTotalXP();

        const level =
            getLevelProgress(
                totalXP
            );

        return {

            xp:
                totalXP,

            level:
                level.level,

            currentLevelXP:
                level.currentXP,

            nextLevelXP:
                level.nextLevelXP,

            levelPercentage:
                level.percentage,

            completedLessons:
                getCompletedLessonCount(),

            learningStreak:
                getLearningStreak(),

            achievements:
                getAchievements()

        };

    }


    /* ======================================================
       REFRESH ENGINE
    ====================================================== */

    function refresh() {

        /*
         * Record that the student is
         * currently using the Academy.
         */

        recordLearningActivity();


        /*
         * Award XP for newly completed
         * lessons.
         */

        const xpResult =
            processLessonXP();


        /*
         * Check achievement conditions.
         */

        const achievementResult =
            processAchievements();


        return {

            xp:
                xpResult,

            achievements:
                achievementResult,

            state:
                getState()

        };

    }


    /* ======================================================
       RESET ENGINE
       ------------------------------------------------------
       Useful during development/testing.
    ====================================================== */

    function reset() {

        localStorage.removeItem(
            STORAGE.totalXP
        );

        localStorage.removeItem(
            STORAGE.awardedLessons
        );

        localStorage.removeItem(
            STORAGE.unlockedAchievements
        );

        localStorage.removeItem(
            STORAGE.learningDates
        );

        console.info(
            "Strativo Achievement Engine: Reset complete."
        );

    }


    /* ======================================================
       PUBLIC API
    ====================================================== */

    window.StrativoAchievementEngine = {

        version:
            "1.0",

        config:
            CONFIG,

        achievements:
            ACHIEVEMENTS,

        refresh:
            refresh,

        getState:
            getState,

        getTotalXP:
            getTotalXP,

        addXP:
            addXP,

        getLevel:
            getLevel,

        getLevelProgress:
            getLevelProgress,

        getCompletedLessons:
            getCompletedLessons,

        getCompletedLessonCount:
            getCompletedLessonCount,

        getLearningStreak:
            getLearningStreak,

        getAchievements:
            getAchievements,

        recordLearningActivity:
            recordLearningActivity,

        processAchievements:
            processAchievements,

        reset:
            reset

    };


    /* ======================================================
       READY
    ====================================================== */

    console.info(
        "Strativo Academy: Achievement Engine loaded."
    );


})();