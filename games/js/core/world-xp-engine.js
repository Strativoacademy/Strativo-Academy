/* ==========================================================================
   STRATIVO WORLD — XP & PROGRESSION ENGINE
   Version: 1.0
   Responsibilities:
   - Calculate Levels, XP Progress, and Rank Titles
   - Manage Skill Mastery (0-100%)
   - Track Real Activity Streaks
   - Listen to Academy Events (strativo:lessonCompleted, strativo:quizCompleted)
   - Dispatch World Events (strativo:worldXPChanged, strativo:worldLevelUp)
   ========================================================================== */

"use strict";

(function () {

    /* ======================================================================
       LEVEL & RANK CONFIGURATION
       ====================================================================== */

    const LEVEL_THRESHOLDS = [
        { level: 1,  xpRequired: 0,    rank: "Novice Chartist" },
        { level: 2,  xpRequired: 100,  rank: "Novice Chartist" },
        { level: 3,  xpRequired: 250,  rank: "Apprentice Trader" },
        { level: 4,  xpRequired: 450,  rank: "Apprentice Trader" },
        { level: 5,  xpRequired: 700,  rank: "Market Technician" },
        { level: 6,  xpRequired: 1000, rank: "Pattern Artisan" },
        { level: 7,  xpRequired: 1400, rank: "Risk Commander" },
        { level: 8,  xpRequired: 1900, rank: "Tactical Strategist" },
        { level: 9,  xpRequired: 2500, rank: "Strategy Architect" },
        { level: 10, xpRequired: 3200, rank: "Strativo Market Master" }
    ];

    /* ======================================================================
       WORLD ACHIEVEMENTS REGISTRY
       ====================================================================== */

    const WORLD_ACHIEVEMENTS = [
        {
            id: "world_welcome",
            title: "World Explorer",
            description: "Entered the Strativo World Hub for the first time.",
            icon: "fa-compass",
            category: "EXPLORATION"
        },
        {
            id: "first_lesson",
            title: "First Step",
            description: "Complete your first lesson in Strativo Academy.",
            icon: "fa-book-open",
            category: "LEARNING"
        },
        {
            id: "first_quiz",
            title: "Knowledge Check",
            description: "Passed your first Academy quiz.",
            icon: "fa-circle-question",
            category: "QUIZ"
        },
        {
            id: "candle_beginner",
            title: "Candle Novice",
            description: "Entered Candle City and began price action training.",
            icon: "fa-fire-flame-curved",
            category: "DISTRICT"
        },
        {
            id: "risk_learner",
            title: "Risk Mindset",
            description: "Completed Risk Management fundamentals in the Academy.",
            icon: "fa-shield-halved",
            category: "MASTERY"
        }
    ];

    /* ======================================================================
       HELPER UTILITIES
       ====================================================================== */

    function getTodayString() {
        return new Date().toISOString().slice(0, 10);
    }

    function safeNumber(val, fallback = 0) {
        const num = Number.parseInt(val, 10);
        return Number.isFinite(num) ? Math.max(0, num) : fallback;
    }

    /* ======================================================================
       CORE ENGINE METHODS
       ====================================================================== */

    function getState() {
        if (!window.StrativoWorldState) {
            console.error("Strativo World: StrativoWorldState not loaded.");
            return null;
        }
        return window.StrativoWorldState.get();
    }

    function saveState(state) {
        if (!window.StrativoWorldState) return false;
        return window.StrativoWorldState.save(state);
    }

    function calculateLevelInfo(totalXP) {
        const xp = safeNumber(totalXP, 0);
        let currentTier = LEVEL_THRESHOLDS[0];
        let nextTier = LEVEL_THRESHOLDS[1];

        for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
            if (xp >= LEVEL_THRESHOLDS[i].xpRequired) {
                currentTier = LEVEL_THRESHOLDS[i];
                nextTier = LEVEL_THRESHOLDS[i + 1] || null;
                break;
            }
        }

        const level = currentTier.level;
        const rank = currentTier.rank;

        if (!nextTier) {
            // Max level reached
            return {
                level,
                rank,
                currentLevelBaseXP: currentTier.xpRequired,
                nextLevelXP: currentTier.xpRequired,
                currentLevelXP: xp - currentTier.xpRequired,
                requiredXPForNext: 0,
                percentage: 100
            };
        }

        const currentLevelBaseXP = currentTier.xpRequired;
        const nextLevelXP = nextTier.xpRequired;
        const requiredXPForNext = nextLevelXP - currentLevelBaseXP;
        const currentLevelXP = xp - currentLevelBaseXP;
        const percentage = Math.min(100, Math.max(0, Math.round((currentLevelXP / requiredXPForNext) * 100)));

        return {
            level,
            rank,
            currentLevelBaseXP,
            nextLevelXP,
            currentLevelXP,
            requiredXPForNext,
            percentage
        };
    }

    /* ======================================================================
       XP MODIFICATION & EVENTS
       ====================================================================== */

    function addWorldXP(amount, reason = "Activity", eventId = null) {
        const state = getState();
        if (!state) return null;

        const xpDelta = safeNumber(amount, 0);
        if (xpDelta <= 0) return state;

        // Check if event was already processed to avoid duplicate awards
        if (eventId) {
            if (state.processedEvents && state.processedEvents.includes(eventId)) {
                return state;
            }
            state.processedEvents = state.processedEvents || [];
            state.processedEvents.push(eventId);
        }

        const oldLevel = state.level || 1;
        state.xp = (state.xp || 0) + xpDelta;

        // Recalculate level and rank
        const levelInfo = calculateLevelInfo(state.xp);
        state.level = levelInfo.level;
        state.rank = levelInfo.rank;

        // Record activity for today
        recordActivityInternal(state);

        // Check for achievements
        checkAchievementsInternal(state);

        saveState(state);

        // Dispatch events
        dispatchWorldEvent("strativo:worldXPChanged", {
            amount: xpDelta,
            totalXP: state.xp,
            level: state.level,
            rank: state.rank,
            reason: reason
        });

        if (state.level > oldLevel) {
            dispatchWorldEvent("strativo:worldLevelUp", {
                oldLevel,
                newLevel: state.level,
                rank: state.rank
            });
        }

        dispatchWorldEvent("strativo:worldStateChanged", { state });

        return state;
    }

    function dispatchWorldEvent(eventName, detail = {}) {
        try {
            window.dispatchEvent(new CustomEvent(eventName, { detail }));
        } catch (err) {
            console.warn("Strativo World: Event dispatch error:", err);
        }
    }

    /* ======================================================================
       ACTIVITY & STREAK TRACKING
       ====================================================================== */

    function recordActivityInternal(state) {
        const today = getTodayString();
        state.activityDates = state.activityDates || [];

        if (!state.activityDates.includes(today)) {
            state.activityDates.push(today);
        }

        state.lastActiveDate = today;

        // Calculate consecutive daily streak
        const uniqueDates = Array.from(new Set(state.activityDates)).sort().reverse();
        let streak = 0;
        let checkDate = new Date();

        for (const dateStr of uniqueDates) {
            const expectedStr = checkDate.toISOString().slice(0, 10);
            if (dateStr === expectedStr) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                // If today hasn't been active yet, allow yesterday as streak continuation
                if (streak === 0) {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    if (dateStr === yesterday.toISOString().slice(0, 10)) {
                        streak++;
                        checkDate = new Date(yesterday);
                        checkDate.setDate(checkDate.getDate() - 1);
                        continue;
                    }
                }
                break;
            }
        }

        state.streak = streak;
        state.bestStreak = Math.max(state.bestStreak || 0, streak);
    }

    function recordActivity() {
        const state = getState();
        if (!state) return 0;
        recordActivityInternal(state);
        saveState(state);
        return state.streak;
    }

    /* ======================================================================
       SKILL MASTERY UPDATES
       ====================================================================== */

    function updateMastery(skillKey, valueOrDelta, isAbsolute = false) {
        const state = getState();
        if (!state) return null;

        state.mastery = state.mastery || {};
        const current = safeNumber(state.mastery[skillKey], 0);

        let newValue = current;
        if (isAbsolute) {
            newValue = safeNumber(valueOrDelta, 0);
        } else {
            newValue = current + safeNumber(valueOrDelta, 0);
        }

        state.mastery[skillKey] = Math.min(100, Math.max(0, newValue));
        saveState(state);

        dispatchWorldEvent("strativo:worldStateChanged", { state });
        return state.mastery;
    }

    /* ======================================================================
       ACHIEVEMENTS SYNCHRONIZATION
       ====================================================================== */

    function checkAchievementsInternal(state) {
        state.achievements = state.achievements || [];
        const unlockedSet = new Set(state.achievements);

        // Safely check real Academy lesson progress
        try {
            const hasLesson1 = localStorage.getItem("lesson1_completed") === "true";
            if (hasLesson1 && !unlockedSet.has("first_lesson")) {
                state.achievements.push("first_lesson");
                unlockedSet.add("first_lesson");
            }

            const hasQuiz1 = localStorage.getItem("lesson1_quizPassed") === "true" ||
                             localStorage.getItem("lesson1_quizCompleted") === "true";
            if (hasQuiz1 && !unlockedSet.has("first_quiz")) {
                state.achievements.push("first_quiz");
                unlockedSet.add("first_quiz");
            }

            const hasLesson10 = localStorage.getItem("lesson10_completed") === "true";
            if (hasLesson10 && !unlockedSet.has("risk_learner")) {
                state.achievements.push("risk_learner");
                unlockedSet.add("risk_learner");
            }
        } catch {
            // Ignore if localStorage unavailable
        }
    }

    /* ======================================================================
       SAFE ACADEMY DATA BRIDGE & INITIAL SYNC
       ====================================================================== */

    function syncAcademyData() {
        const state = getState();
        if (!state) return;

        let modified = false;

        // Check if Academy achievements exist and reflect real mastery safely
        try {
            let completedLessonsCount = 0;
            for (let i = 1; i <= 10; i++) {
                if (localStorage.getItem(`lesson${i}_completed`) === "true") {
                    completedLessonsCount++;
                    const eventKey = `academy_lesson_${i}`;
                    if (!state.processedEvents.includes(eventKey)) {
                        state.processedEvents.push(eventKey);
                        state.xp = (state.xp || 0) + 20;
                        modified = true;
                    }
                }
            }

            // Sync beginner mastery percentages conservatively from verified progress
            if (completedLessonsCount >= 1) {
                // Lessons 1 & 2 teach candlesticks & price action
                const candleMastery = Math.min(100, completedLessonsCount * 10);
                if (state.mastery.candlesticks < candleMastery) {
                    state.mastery.candlesticks = candleMastery;
                    modified = true;
                }
            }

            if (completedLessonsCount >= 3) {
                // Lesson 3 teaches pips
                const pipMastery = Math.min(100, (completedLessonsCount - 2) * 12);
                if (state.mastery.pipPosition < pipMastery) {
                    state.mastery.pipPosition = pipMastery;
                    modified = true;
                }
            }

            // Update level info if XP was updated
            if (modified) {
                const info = calculateLevelInfo(state.xp);
                state.level = info.level;
                state.rank = info.rank;
            }
        } catch (e) {
            console.warn("Strativo World: Academy sync encountered non-critical error.", e);
        }

        checkAchievementsInternal(state);
        saveState(state);
    }

    /* ======================================================================
       ACADEMY EVENT BRIDGE LISTENERS
       ====================================================================== */

    function attachAcademyListeners() {
        // Listen to lesson completed event
        window.addEventListener("strativo:lessonCompleted", function (e) {
            const lessonNum = e.detail && (e.detail.lessonNumber || e.detail.lesson);
            const eventKey = `academy_event_lesson_${lessonNum || Date.now()}`;
            addWorldXP(20, `Completed Academy Lesson ${lessonNum || ""}`, eventKey);
        });

        // Listen to quiz completed event
        window.addEventListener("strativo:quizCompleted", function (e) {
            const lessonNum = e.detail && (e.detail.lesson || "general");
            const isPassed = e.detail && e.detail.passed;
            const xpReward = isPassed ? 25 : 15;
            const eventKey = `academy_event_quiz_${lessonNum}_${Date.now()}`;
            addWorldXP(xpReward, `Completed Academy Quiz (${lessonNum})`, eventKey);
        });
    }

    /* ======================================================================
       INITIALIZATION
       ====================================================================== */

    function initializeEngine() {
        // Initial sync of verified Academy achievements
        syncAcademyData();

        // Record visit activity
        recordActivity();

        // Attach event listeners
        attachAcademyListeners();

        console.info("Strativo World: XP & Progression Engine ready.");
    }

    // Auto-init on DOM or immediate
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeEngine);
    } else {
        initializeEngine();
    }

    /* ======================================================================
       PUBLIC XP ENGINE API
       ====================================================================== */

    window.StrativoWorldXPEngine = {
        LEVEL_THRESHOLDS,
        ACHIEVEMENTS_LIST: WORLD_ACHIEVEMENTS,
        getWorldState: getState,
        getXP: () => (getState() ? getState().xp : 0),
        getLevel: () => (getState() ? getState().level : 1),
        getLevelProgress: (xp) => calculateLevelInfo(xp !== undefined ? xp : (getState() ? getState().xp : 0)),
        getXPToNextLevel: () => {
            const info = calculateLevelInfo(getState() ? getState().xp : 0);
            return info.requiredXPForNext - info.currentLevelXP;
        },
        addWorldXP,
        recordActivity,
        updateMastery,
        syncAcademyData
    };

})();
