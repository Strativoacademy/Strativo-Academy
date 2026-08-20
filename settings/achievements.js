/* ==========================================================
   STRATIVO ACADEMY
   Achievements Page Controller v1.0

   Purpose:
   - Connect achievement-engine.js to achievements.html
   - Display XP, level, streak and achievement information
   - Update the visual page only

   IMPORTANT:
   This file does NOT calculate XP or own achievement data.

   The core logic belongs to:
   - ../js/achievement-engine.js
========================================================== */

"use strict";

(function () {

    /* ======================================================
       DOM CACHE
    ====================================================== */

    const DOM = {

        totalXP:
            null,

        currentLevel:
            null,

        achievementCount:
            null,

        learningStreak:
            null,

        currentXP:
            null,

        nextLevelXP:
            null,

        levelProgressLabel:
            null,

        levelProgressFill:
            null,

        levelProgressTrack:
            null,

        lessonsCompleted:
            null,

        quizzesCompleted:
            null,

        practiceSessions:
            null,

        earnedAchievements:
            null

    };


    /* ======================================================
       CACHE DOM
    ====================================================== */

    function cacheDOM() {

        DOM.totalXP =
            document.getElementById(
                "total-xp"
            );

        DOM.currentLevel =
            document.getElementById(
                "current-level"
            );

        DOM.achievementCount =
            document.getElementById(
                "achievement-count"
            );

        DOM.learningStreak =
            document.getElementById(
                "learning-streak"
            );

        DOM.currentXP =
            document.getElementById(
                "current-xp"
            );

        DOM.nextLevelXP =
            document.getElementById(
                "next-level-xp"
            );

        DOM.levelProgressLabel =
            document.getElementById(
                "level-progress-label"
            );

        DOM.levelProgressFill =
            document.getElementById(
                "level-progress-fill"
            );

        DOM.levelProgressTrack =
            document.querySelector(
                ".achievement-progress-track"
            );

        DOM.lessonsCompleted =
            document.getElementById(
                "lessons-completed"
            );

        DOM.quizzesCompleted =
            document.getElementById(
                "quizzes-completed"
            );

        DOM.practiceSessions =
            document.getElementById(
                "practice-sessions"
            );

        DOM.earnedAchievements =
            document.getElementById(
                "earned-achievements"
            );

    }


    /* ======================================================
       ENGINE CHECK
    ====================================================== */

    function getEngine() {

        if (
            !window.StrativoAchievementEngine
        ) {

            console.error(
                "Strativo Academy: Achievement Engine is not loaded."
            );

            return null;

        }

        return (
            window.StrativoAchievementEngine
        );

    }


    /* ======================================================
       UPDATE OVERVIEW
    ====================================================== */

    function updateOverview(state) {

        if (!state) {

            return;

        }


        /* TOTAL XP */

        if (DOM.totalXP) {

            DOM.totalXP.textContent =
                Number(
                    state.xp || 0
                ).toLocaleString();

        }


        /* CURRENT LEVEL */

        if (DOM.currentLevel) {

            DOM.currentLevel.textContent =
                `Level ${state.level || 1}`;

        }


        /* ACHIEVEMENT COUNT */

        if (DOM.achievementCount) {

            const achievements =
                Array.isArray(
                    state.achievements
                )
                    ? state.achievements
                    : [];

            const unlockedCount =
                achievements.filter(
                    achievement =>
                        achievement.unlocked
                ).length;

            DOM.achievementCount.textContent =
                unlockedCount;

        }


        /* LEARNING STREAK */

        if (DOM.learningStreak) {

            const streak =
                Number(
                    state.learningStreak || 0
                );

            DOM.learningStreak.textContent =
                `${streak} ${
                    streak === 1
                        ? "day"
                        : "days"
                }`;

        }


        /* LESSONS */

        if (DOM.lessonsCompleted) {

            DOM.lessonsCompleted.textContent =
                Number(
                    state.completedLessons || 0
                );

        }


        /* QUIZZES */

        if (DOM.quizzesCompleted) {

            /*
             * Quiz tracking will be connected
             * when quiz-engine.js receives its
             * official completion system.
             */

            DOM.quizzesCompleted.textContent =
                "0";

        }


        /* PRACTICE */

        if (DOM.practiceSessions) {

            /*
             * Practice tracking will be connected
             * when the practice system exists.
             */

            DOM.practiceSessions.textContent =
                "0";

        }

    }


    /* ======================================================
       UPDATE LEVEL PROGRESS
    ====================================================== */

    function updateLevelProgress(state) {

        if (!state) {

            return;

        }


        const level =
            Number(
                state.level || 1
            );

        const xp =
            Number(
                state.xp || 0
            );

        const nextLevelXP =
            Number(
                state.nextLevelXP || 100
            );

        const percentage =
            Math.min(
                100,
                Math.max(
                    0,
                    Number(
                        state.levelPercentage || 0
                    )
                )
            );


        /* LEVEL LABEL */

        if (DOM.levelProgressLabel) {

            DOM.levelProgressLabel.textContent =
                `Level ${level}`;

        }


        /* CURRENT XP */

        if (DOM.currentXP) {

            DOM.currentXP.textContent =
                `${xp.toLocaleString()} XP`;

        }


        /* NEXT LEVEL XP */

        if (DOM.nextLevelXP) {

            DOM.nextLevelXP.textContent =
                `${nextLevelXP.toLocaleString()} XP`;

        }


        /* PROGRESS BAR */

        if (DOM.levelProgressFill) {

            DOM.levelProgressFill.style.width =
                `${percentage}%`;

        }


        /* ACCESSIBILITY */

        if (DOM.levelProgressTrack) {

            DOM.levelProgressTrack.setAttribute(
                "aria-valuenow",
                Math.round(
                    percentage
                ).toString()
            );

        }

    }


    /* ======================================================
       CREATE EARNED ACHIEVEMENT CARD
    ====================================================== */

    function createEarnedAchievementCard(
        achievement
    ) {

        const article =
            document.createElement(
                "article"
            );

        article.className =
            "achievement-card achievement-earned";

        article.dataset.achievementId =
            achievement.id;


        article.innerHTML = `

            <div class="achievement-icon">

                <i
                    class="fas ${achievement.icon}"
                    aria-hidden="true"
                ></i>

            </div>


            <div class="achievement-card-content">

                <span class="achievement-category">
                    ${achievement.category}
                </span>

                <h3 class="achievement-card-title">
                    ${achievement.title}
                </h3>

                <p class="achievement-card-description">
                    ${achievement.description}
                </p>

            </div>


            <div
                class="achievement-earned-icon"
                aria-label="Achievement unlocked"
            >

                <i
                    class="fas fa-check"
                    aria-hidden="true"
                ></i>

            </div>

        `;


        return article;

    }


    /* ======================================================
       RENDER EARNED ACHIEVEMENTS
    ====================================================== */

    function renderEarnedAchievements(
        achievements
    ) {

        if (
            !DOM.earnedAchievements
        ) {

            return;

        }


        const unlocked =
            Array.isArray(
                achievements
            )
                ? achievements.filter(
                    achievement =>
                        achievement.unlocked
                )
                : [];


        /* EMPTY STATE */

        if (
            unlocked.length === 0
        ) {

            DOM.earnedAchievements.innerHTML = `

                <div class="achievements-empty-state">

                    <div class="achievements-empty-icon">

                        <i
                            class="fas fa-medal"
                            aria-hidden="true"
                        ></i>

                    </div>


                    <h3>
                        Your first achievement is waiting
                    </h3>


                    <p>
                        Complete your first learning
                        milestone to unlock an achievement.
                    </p>

                </div>

            `;

            return;

        }


        /*
         * Clear current earned cards.
         */

        DOM.earnedAchievements.innerHTML =
            "";


        /*
         * Render cards.
         */

        unlocked.forEach(
            achievement => {

                DOM.earnedAchievements.appendChild(
                    createEarnedAchievementCard(
                        achievement
                    )
                );

            }
        );

    }


    /* ======================================================
       UPDATE LOCKED ACHIEVEMENT CARDS
    ====================================================== */

    function updateLockedAchievements(
        achievements
    ) {

        const list =
            Array.isArray(
                achievements
            )
                ? achievements
                : [];


        const achievementMap =
            new Map(
                list.map(
                    achievement => [
                        achievement.id,
                        achievement
                    ]
                )
            );


        /*
         * Find all static locked cards.
         */

        const cards =
            document.querySelectorAll(
                ".achievement-card.is-locked"
            );


        cards.forEach(
            card => {

                const title =
                    card.querySelector(
                        ".achievement-card-title"
                    );


                if (!title) {

                    return;

                }


                const titleText =
                    title.textContent
                        .trim()
                        .toLowerCase();


                let achievementId =
                    null;


                if (
                    titleText ===
                    "first step"
                ) {

                    achievementId =
                        "first_lesson";

                }


                else if (
                    titleText ===
                    "knowledge check"
                ) {

                    achievementId =
                        "first_quiz";

                }


                else if (
                    titleText ===
                    "building momentum"
                ) {

                    achievementId =
                        "three_day_streak";

                }


                else if (
                    titleText ===
                    "first 100 xp"
                ) {

                    achievementId =
                        "first_100_xp";

                }


                if (!achievementId) {

                    return;

                }


                const achievement =
                    achievementMap.get(
                        achievementId
                    );


                if (
                    achievement &&
                    achievement.unlocked
                ) {

                    unlockCard(
                        card
                    );

                }

            }
        );

    }


    /* ======================================================
       UNLOCK STATIC CARD
    ====================================================== */

    function unlockCard(card) {

        if (!card) {

            return;

        }


        card.classList.remove(
            "is-locked"
        );


        card.classList.add(
            "is-unlocked"
        );


        const status =
            card.querySelector(
                ".achievement-status"
            );


        if (status) {

            status.innerHTML = `

                <i
                    class="fas fa-check"
                    aria-hidden="true"
                ></i>

                Unlocked

            `;

        }

    }


    /* ======================================================
       MAIN REFRESH
    ====================================================== */

    function refreshAchievements() {

        cacheDOM();


        const engine =
            getEngine();


        if (!engine) {

            return;

        }


        /*
         * Ask the engine to update its
         * internal state.
         */

        engine.refresh();


        /*
         * Get the latest state.
         */

        const state =
            engine.getState();


        if (!state) {

            return;

        }


        /*
         * Update page.
         */

        updateOverview(
            state
        );


        updateLevelProgress(
            state
        );


        renderEarnedAchievements(
            state.achievements
        );


        updateLockedAchievements(
            state.achievements
        );


        console.info(
            "Strativo Academy: Achievement page updated."
        );

    }


    /* ======================================================
       PUBLIC API
    ====================================================== */

    window.StrativoAchievements = {

        refresh:
            refreshAchievements

    };


    /* ======================================================
       DOM READY
    ====================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        refreshAchievements
    );


})();