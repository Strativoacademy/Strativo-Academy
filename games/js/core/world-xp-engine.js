/* ==========================================================================
   STRATIVO WORLD — XP & PROGRESSION ENGINE
   Version: 2.0 (Phase 2.3 Real Gameplay Progression, Mastery & Rewards)
   Responsibilities:
   - Calculate Levels, XP Progress, and Rank Titles
   - Manage Skill Mastery (0-100%) dynamically from verified activity
   - Track Real Activity Streaks
   - Idempotent Blitz Match Result Processing & Anti-Duplication
   - Track Individual Pattern Familiarity & Archive Exploration Progress
   - Process Real Achievement Requirements & Data-Driven Missions
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
       WORLD ACHIEVEMENTS REGISTRY (REAL REQUIREMENTS)
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
            id: "candle_scout",
            title: "Candle Scout",
            description: "Inspect your first candlestick formation in Candle City.",
            icon: "fa-eye",
            category: "EXPLORATION"
        },
        {
            id: "pattern_apprentice",
            title: "Pattern Apprentice",
            description: "Correctly identify your first pattern in Candle Blitz.",
            icon: "fa-wand-magic-sparkles",
            category: "RECOGNITION"
        },
        {
            id: "rapid_reader",
            title: "Rapid Reader",
            description: "Complete a fast recognition match with average reaction under 1.8s.",
            icon: "fa-bolt-lightning",
            category: "SPEED"
        },
        {
            id: "candle_specialist",
            title: "Candle Specialist",
            description: "Achieve Grade S or A (80%+ accuracy) in a Candle Blitz match.",
            icon: "fa-award",
            category: "ACCURACY"
        },
        {
            id: "candle_master",
            title: "Candle Master",
            description: "Attain 50%+ Candlestick Mastery and explore 20+ patterns.",
            icon: "fa-crown",
            category: "MASTERY"
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
       XP MODIFICATION & ANTI-DUPLICATION
       ====================================================================== */

    function addWorldXP(amount, reason = "Activity", eventId = null) {
        const state = getState();
        if (!state) return null;

        const xpDelta = safeNumber(amount, 0);
        if (xpDelta <= 0) return state;

        // Idempotent event check: prevent duplicate reward grants
        if (eventId) {
            if (state.processedEvents && state.processedEvents.includes(eventId)) {
                return state;
            }
            state.processedEvents = state.processedEvents || [];
            state.processedEvents.push(eventId);
        }

        const oldLevel = state.level || 1;
        state.xp = (state.xp || 0) + xpDelta;

        const levelInfo = calculateLevelInfo(state.xp);
        state.level = levelInfo.level;
        state.rank = levelInfo.rank;

        // Record qualifying activity
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
            if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
                window.dispatchEvent(new CustomEvent(eventName, { detail }));
            }
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

        const uniqueDates = Array.from(new Set(state.activityDates)).sort().reverse();
        let streak = 0;
        let checkDate = new Date();

        for (const dateStr of uniqueDates) {
            const expectedStr = checkDate.toISOString().slice(0, 10);
            if (dateStr === expectedStr) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
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
       CANDLESTICK MASTERY CALCULATION
       ====================================================================== */

    function recalculateCandleMastery(state) {
        state.mastery = state.mastery || {};
        const viewed = (state.viewedPatterns || []).length;
        const correctPatterns = Object.values(state.patternMastery || {}).filter(p => p.correct > 0).length;
        const accuracy = (state.blitzStats && state.blitzStats.totalAttempts > 0)
            ? (state.blitzStats.totalCorrect / state.blitzStats.totalAttempts)
            : 0;

        // 1. Exploration component: up to 25% (viewed/44 * 25)
        const exploreScore = Math.round((Math.min(44, viewed) / 44) * 25);

        // 2. Recognition coverage component: up to 55% (correctUnique/44 * 55)
        const recogScore = Math.round((Math.min(44, correctPatterns) / 44) * 55);

        // 3. Accuracy bonus component: up to 20%
        const accScore = Math.round(accuracy * 20);

        const calculatedMastery = Math.min(100, exploreScore + recogScore + accScore);
        state.mastery.candlesticks = Math.max(state.mastery.candlesticks || 0, calculatedMastery);
        return state.mastery.candlesticks;
    }

    /* ======================================================================
       PIP & POSITION MASTERY CALCULATION
       ====================================================================== */

    function recalculatePipPositionMastery(state) {
        state.mastery = state.mastery || {};
        state.pipStats = state.pipStats || {
            measurementsSolved: 0,
            jpySolved: 0,
            fractionalSolved: 0,
            rulesCompleted: 0,
            forgeCompleted: 0,
            leverageCompleted: 0,
            arenaCompleted: 0,
            blitzMatches: 0,
            blitzCorrect: 0,
            blitzAttempts: 0
        };

        const ms = state.pipStats;
        // 1. Basic measurement & ladder progress: up to 25%
        const measureScore = Math.min(25, Math.round((ms.measurementsSolved / 5) * 25));

        // 2. Specialized precision (JPY + Fractional + Rules): up to 25%
        const specScore = Math.min(25, (ms.jpySolved ? 10 : 0) + Math.min(10, ms.fractionalSolved * 2) + (ms.rulesCompleted ? 5 : 0));

        // 3. Risk Forge & Leverage Tower: up to 25%
        const riskScore = Math.min(25, Math.min(15, ms.forgeCompleted * 5) + (ms.leverageCompleted ? 5 : 0) + (ms.arenaCompleted ? 5 : 0));

        // 4. Pip Blitz accuracy & matches: up to 25%
        const blitzAcc = ms.blitzAttempts > 0 ? (ms.blitzCorrect / ms.blitzAttempts) : 0;
        const blitzScore = Math.min(25, Math.min(10, ms.blitzMatches * 5) + Math.round(blitzAcc * 15));

        const calculatedMastery = Math.min(100, measureScore + specScore + riskScore + blitzScore);
        state.mastery.pipPosition = Math.max(state.mastery.pipPosition || 0, calculatedMastery);
        return state.mastery.pipPosition;
    }

    /* ======================================================================
       MARKET STRUCTURE MASTERY CALCULATION
       ====================================================================== */

    function recalculateMarketStructureMastery(state) {
        state.mastery = state.mastery || {};
        state.marketStats = state.marketStats || {
            swingsSolved: 0,
            trendsSolved: 0,
            sequencesSolved: 0,
            rangesSolved: 0,
            breakoutsSolved: 0,
            fakeoutsSolved: 0,
            theaterCompleted: 0,
            arenaCompleted: 0,
            blitzMatches: 0,
            blitzCorrect: 0,
            blitzAttempts: 0
        };

        const ms = state.marketStats;
        // 1. Swing & Structure Academy drills: up to 25%
        const swingScore = Math.min(25, Math.round((ms.swingsSolved / 3) * 25));

        // 2. Trend Stadium & Range detection: up to 25%
        const trendScore = Math.min(25, Math.min(15, ms.trendsSolved * 3) + Math.min(10, ms.rangesSolved * 2));

        // 3. Breakout/Fakeout Zone & Chart Theater: up to 25%
        const breakoutScore = Math.min(25, Math.min(10, ms.breakoutsSolved * 2) + Math.min(10, ms.fakeoutsSolved * 2) + (ms.theaterCompleted ? 5 : 0));

        // 4. Market Blitz accuracy & matches: up to 25%
        const blitzAcc = ms.blitzAttempts > 0 ? (ms.blitzCorrect / ms.blitzAttempts) : 0;
        const blitzScore = Math.min(25, Math.min(10, ms.blitzMatches * 5) + Math.round(blitzAcc * 15));

        const calculatedMastery = Math.min(100, swingScore + trendScore + breakoutScore + blitzScore);
        state.mastery.marketStructure = Math.max(state.mastery.marketStructure || 0, calculatedMastery);
        return state.mastery.marketStructure;
    }

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
       PATTERN VIEW TRACKING (ARCHIVE & PODS)
       ====================================================================== */

    function recordPatternView(patternId) {
        const state = getState();
        if (!state || !patternId) return null;

        state.viewedPatterns = state.viewedPatterns || [];
        let isNew = false;

        if (!state.viewedPatterns.includes(patternId)) {
            state.viewedPatterns.push(patternId);
            isNew = true;

            // Update First Light mission
            state.missions = state.missions || {};
            if (state.missions.first_light && !state.missions.first_light.completed) {
                state.missions.first_light.progress = Math.min(state.missions.first_light.target, state.viewedPatterns.length);
            }

            // Recalculate Mastery
            recalculateCandleMastery(state);

            // Record qualifying learning activity
            recordActivityInternal(state);

            // Check Achievements (e.g. candle_scout)
            checkAchievementsInternal(state);

            saveState(state);
            dispatchWorldEvent("strativo:worldStateChanged", { state });
        }

        return { isNew, totalViewed: state.viewedPatterns.length };
    }

    /* ======================================================================
       CANDLE BLITZ MATCH RESULT PROCESSING (IDEMPOTENT REWARD TRANSACTION)
       ====================================================================== */

    function recordCandleBlitzResult(matchData = {}) {
        const state = getState();
        if (!state) return null;

        const matchId = matchData.matchId || `blitz_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

        // Anti-Duplication: reject already processed match ID
        if (state.processedEvents && state.processedEvents.includes(matchId)) {
            return { duplicate: true, state };
        }

        state.processedEvents = state.processedEvents || [];
        state.processedEvents.push(matchId);

        // 1. Calculate XP: Base 10 + Performance (0-20) + Learning (0-10) -> Max 40 XP
        const baseXP = 10;
        const perfXP = Math.min(20, Math.round((matchData.correctCount || 0) * 2));
        const learnXP = Math.min(10, Math.floor((matchData.bestCombo || 0) * 1));
        const matchXP = Math.min(40, baseXP + perfXP + learnXP);

        // 2. Update blitzStats
        state.blitzStats = state.blitzStats || {
            matchesPlayed: 0,
            patternsIdentified: 0,
            totalCorrect: 0,
            totalAttempts: 0,
            bestCombo: 0,
            bestScore: 0,
            avgReactionMs: 0
        };

        state.blitzStats.matchesPlayed = (state.blitzStats.matchesPlayed || 0) + 1;
        state.blitzStats.totalCorrect = (state.blitzStats.totalCorrect || 0) + (matchData.correctCount || 0);
        state.blitzStats.totalAttempts = (state.blitzStats.totalAttempts || 0) + (matchData.totalRounds || 10);
        state.blitzStats.patternsIdentified = (state.blitzStats.patternsIdentified || 0) + (matchData.correctCount || 0);
        state.blitzStats.bestCombo = Math.max(state.blitzStats.bestCombo || 0, matchData.bestCombo || 0);
        state.blitzStats.bestScore = Math.max(state.blitzStats.bestScore || 0, matchData.score || 0);

        if (matchData.avgReactionMs > 0) {
            state.blitzStats.avgReactionMs = state.blitzStats.matchesPlayed === 1
                ? matchData.avgReactionMs
                : Math.round((state.blitzStats.avgReactionMs + matchData.avgReactionMs) / 2);
        }

        // 3. Update individual patternMastery
        state.patternMastery = state.patternMastery || {};
        if (Array.isArray(matchData.patternResults)) {
            matchData.patternResults.forEach(pr => {
                if (pr && pr.id) {
                    state.patternMastery[pr.id] = state.patternMastery[pr.id] || { seen: 0, correct: 0 };
                    state.patternMastery[pr.id].seen = (state.patternMastery[pr.id].seen || 0) + 1;
                    if (pr.correct) {
                        state.patternMastery[pr.id].correct = (state.patternMastery[pr.id].correct || 0) + 1;
                    }
                }
            });
        }

        // 4. Update Missions (rapid_eye & pattern_hunter)
        state.missions = state.missions || {};
        if (state.missions.rapid_eye && !state.missions.rapid_eye.completed) {
            state.missions.rapid_eye.progress = Math.min(state.missions.rapid_eye.target, (state.missions.rapid_eye.progress || 0) + 1);
        }
        if (state.missions.pattern_hunter && !state.missions.pattern_hunter.completed) {
            state.missions.pattern_hunter.progress = Math.min(state.missions.pattern_hunter.target, (state.missions.pattern_hunter.progress || 0) + (matchData.correctCount || 0));
        }

        // 5. Recalculate Candlestick Mastery
        const newMastery = recalculateCandleMastery(state);

        // 6. Record Activity
        recordActivityInternal(state);

        // 7. Add XP
        const oldLevel = state.level || 1;
        state.xp = (state.xp || 0) + matchXP;
        const levelInfo = calculateLevelInfo(state.xp);
        state.level = levelInfo.level;
        state.rank = levelInfo.rank;

        // 8. Check Achievements
        const newAchievements = checkAchievementsInternal(state);

        saveState(state);

        // 9. Dispatch events
        dispatchWorldEvent("strativo:worldXPChanged", {
            amount: matchXP,
            totalXP: state.xp,
            level: state.level,
            rank: state.rank,
            reason: `Candle Blitz Match (${matchData.accuracy || 0}%)`
        });

        if (state.level > oldLevel) {
            dispatchWorldEvent("strativo:worldLevelUp", {
                oldLevel,
                newLevel: state.level,
                rank: state.rank
            });
        }

        dispatchWorldEvent("strativo:candlestickMastery", {
            score: matchData.score,
            accuracy: matchData.accuracy,
            grade: matchData.grade,
            candlestickMastery: newMastery,
            bestCombo: matchData.bestCombo,
            completedAt: Date.now()
        });

        dispatchWorldEvent("strativo:worldStateChanged", { state });

        return {
            duplicate: false,
            xpGained: matchXP,
            newMastery: newMastery,
            newAchievements: newAchievements,
            state: state
        };
    }

    /* ======================================================================
       PIP BLITZ MATCH RESULT PROCESSING (IDEMPOTENT REWARD TRANSACTION)
       ====================================================================== */

    function recordPipBlitzResult(matchData = {}) {
        const state = getState();
        if (!state) return null;

        const matchId = matchData.matchId || `pip_blitz_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

        // Anti-Duplication: reject already processed match ID
        if (state.processedEvents && state.processedEvents.includes(matchId)) {
            return { duplicate: true, state };
        }

        state.processedEvents = state.processedEvents || [];
        state.processedEvents.push(matchId);

        // 1. Calculate XP: Base 10 + Performance (0-20) + Learn (0-10) -> Max 40 XP
        const baseXP = 10;
        const perfXP = Math.min(20, Math.round((matchData.correctCount || 0) * 2));
        const learnXP = Math.min(10, Math.floor((matchData.bestCombo || 0) * 1));
        const matchXP = Math.min(40, baseXP + perfXP + learnXP);

        // 2. Update pipStats
        state.pipStats = state.pipStats || {
            measurementsSolved: 0,
            jpySolved: 0,
            fractionalSolved: 0,
            rulesCompleted: 0,
            forgeCompleted: 0,
            leverageCompleted: 0,
            arenaCompleted: 0,
            blitzMatches: 0,
            blitzCorrect: 0,
            blitzAttempts: 0
        };

        state.pipStats.blitzMatches = (state.pipStats.blitzMatches || 0) + 1;
        state.pipStats.blitzCorrect = (state.pipStats.blitzCorrect || 0) + (matchData.correctCount || 0);
        state.pipStats.blitzAttempts = (state.pipStats.blitzAttempts || 0) + (matchData.totalRounds || 10);
        state.pipStats.measurementsSolved = (state.pipStats.measurementsSolved || 0) + (matchData.correctCount || 0);

        // 3. Update Missions
        state.missions = state.missions || {};
        if (state.missions.pip_blitz && !state.missions.pip_blitz.completed) {
            state.missions.pip_blitz.progress = Math.min(state.missions.pip_blitz.target, (state.missions.pip_blitz.progress || 0) + 1);
        }
        if (state.missions.precision_test && !state.missions.precision_test.completed) {
            state.missions.precision_test.progress = Math.min(state.missions.precision_test.target, (state.missions.precision_test.progress || 0) + (matchData.correctCount || 0));
        }

        // 4. Recalculate Pip & Position Mastery
        const newMastery = recalculatePipPositionMastery(state);

        // 5. Record Activity
        recordActivityInternal(state);

        // 6. Add XP
        const oldLevel = state.level || 1;
        state.xp = (state.xp || 0) + matchXP;
        const levelInfo = calculateLevelInfo(state.xp);
        state.level = levelInfo.level;
        state.rank = levelInfo.rank;

        // 7. Check Achievements
        const newAchievements = checkAchievementsInternal(state);

        saveState(state);

        // 8. Dispatch events
        dispatchWorldEvent("strativo:worldXPChanged", {
            amount: matchXP,
            totalXP: state.xp,
            level: state.level,
            rank: state.rank,
            reason: `Pip Blitz Match (${matchData.accuracy || 0}%)`
        });

        if (state.level > oldLevel) {
            dispatchWorldEvent("strativo:worldLevelUp", {
                oldLevel,
                newLevel: state.level,
                rank: state.rank
            });
        }

        dispatchWorldEvent("strativo:pipPositionMastery", {
            score: matchData.score,
            accuracy: matchData.accuracy,
            grade: matchData.grade,
            pipPositionMastery: newMastery,
            bestCombo: matchData.bestCombo,
            completedAt: Date.now()
        });

        dispatchWorldEvent("strativo:worldStateChanged", { state });

        return {
            duplicate: false,
            xpGained: matchXP,
            newMastery: newMastery,
            newAchievements: newAchievements,
            state: state
        };
    }

    /* ======================================================================
       MARKET BLITZ MATCH RESULT PROCESSING (IDEMPOTENT REWARD TRANSACTION)
       ====================================================================== */

    function recordMarketBlitzResult(matchData = {}) {
        const state = getState();
        if (!state) return null;

        const matchId = matchData.matchId || `market_blitz_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

        // Anti-Duplication: reject already processed match ID
        if (state.processedEvents && state.processedEvents.includes(matchId)) {
            return { duplicate: true, state };
        }

        state.processedEvents = state.processedEvents || [];
        state.processedEvents.push(matchId);

        // 1. Calculate XP: Base 10 + Performance (0-20) + Learn (0-10) -> Max 40 XP
        const baseXP = 10;
        const perfXP = Math.min(20, Math.round((matchData.correctCount || 0) * 2));
        const learnXP = Math.min(10, Math.floor((matchData.bestCombo || 0) * 1));
        const matchXP = Math.min(40, baseXP + perfXP + learnXP);

        // 2. Update marketStats
        state.marketStats = state.marketStats || {
            swingsSolved: 0,
            trendsSolved: 0,
            sequencesSolved: 0,
            rangesSolved: 0,
            breakoutsSolved: 0,
            fakeoutsSolved: 0,
            theaterCompleted: 0,
            arenaCompleted: 0,
            blitzMatches: 0,
            blitzCorrect: 0,
            blitzAttempts: 0
        };

        state.marketStats.blitzMatches = (state.marketStats.blitzMatches || 0) + 1;
        state.marketStats.blitzCorrect = (state.marketStats.blitzCorrect || 0) + (matchData.correctCount || 0);
        state.marketStats.blitzAttempts = (state.marketStats.blitzAttempts || 0) + (matchData.totalRounds || 10);
        state.marketStats.trendsSolved = (state.marketStats.trendsSolved || 0) + Math.min(5, matchData.correctCount || 0);

        // 3. Update Missions
        state.missions = state.missions || {};
        if (state.missions.market_blitz && !state.missions.market_blitz.completed) {
            state.missions.market_blitz.progress = Math.min(state.missions.market_blitz.target, (state.missions.market_blitz.progress || 0) + 1);
        }
        if (state.missions.find_the_trend && !state.missions.find_the_trend.completed) {
            state.missions.find_the_trend.progress = Math.min(state.missions.find_the_trend.target, (state.missions.find_the_trend.progress || 0) + Math.min(5, matchData.correctCount || 0));
        }

        // 4. Recalculate Market Structure Mastery
        const newMastery = recalculateMarketStructureMastery(state);

        // 5. Record Activity
        recordActivityInternal(state);

        // 6. Add XP
        const oldLevel = state.level || 1;
        state.xp = (state.xp || 0) + matchXP;
        const levelInfo = calculateLevelInfo(state.xp);
        state.level = levelInfo.level;
        state.rank = levelInfo.rank;

        // 7. Check Achievements
        const newAchievements = checkAchievementsInternal(state);

        saveState(state);

        // 8. Dispatch events
        dispatchWorldEvent("strativo:worldXPChanged", {
            amount: matchXP,
            totalXP: state.xp,
            level: state.level,
            rank: state.rank,
            reason: `Market Blitz Match (${matchData.accuracy || 0}%)`
        });

        if (state.level > oldLevel) {
            dispatchWorldEvent("strativo:worldLevelUp", {
                oldLevel,
                newLevel: state.level,
                rank: state.rank
            });
        }

        dispatchWorldEvent("strativo:marketStructureMastery", {
            score: matchData.score,
            accuracy: matchData.accuracy,
            grade: matchData.grade,
            marketStructureMastery: newMastery,
            bestCombo: matchData.bestCombo,
            completedAt: Date.now()
        });

        dispatchWorldEvent("strativo:worldStateChanged", { state });

        return {
            duplicate: false,
            xpGained: matchXP,
            newMastery: newMastery,
            newAchievements: newAchievements,
            state: state
        };
    }

    /* ======================================================================
       ACHIEVEMENTS SYNCHRONIZATION & CRITERIA EVALUATION
       ====================================================================== */

    function checkAchievementsInternal(state) {
        state.achievements = state.achievements || [];
        const unlockedSet = new Set(state.achievements);
        const newlyUnlocked = [];

        function grant(id) {
            if (!unlockedSet.has(id)) {
                state.achievements.push(id);
                unlockedSet.add(id);
                newlyUnlocked.push(id);
                dispatchWorldEvent("strativo:achievementUnlocked", { achievementId: id });
            }
        }

        // Real Criteria Checks:
        // 1. Candle Scout: Inspected at least 1 candle formation
        if ((state.viewedPatterns || []).length >= 1) {
            grant("candle_scout");
        }

        // 2. Pattern Apprentice: Correctly identified at least 1 pattern in Blitz
        if (state.blitzStats && state.blitzStats.totalCorrect >= 1) {
            grant("pattern_apprentice");
        }

        // 3. Rapid Reader: Avg reaction under 1.8s in a completed match
        if (state.blitzStats && state.blitzStats.matchesPlayed >= 1 && state.blitzStats.avgReactionMs > 0 && state.blitzStats.avgReactionMs < 1800) {
            grant("rapid_reader");
        }

        // 4. Candle Specialist: Accuracy >= 80% with at least 1 match played
        if (state.blitzStats && state.blitzStats.matchesPlayed >= 1) {
            const acc = state.blitzStats.totalCorrect / Math.max(1, state.blitzStats.totalAttempts);
            if (acc >= 0.8) {
                grant("candle_specialist");
            }
        }

        // 5. Candle Master: Candlestick Mastery >= 50% AND 20+ patterns viewed
        if ((state.mastery && state.mastery.candlesticks >= 50) && (state.viewedPatterns && state.viewedPatterns.length >= 20)) {
            grant("candle_master");
        }

        // Check Academy lesson progress safely
        try {
            if (typeof localStorage !== "undefined") {
                if (localStorage.getItem("lesson1_completed") === "true") grant("first_lesson");
                if (localStorage.getItem("lesson1_quizPassed") === "true" || localStorage.getItem("lesson1_quizCompleted") === "true") grant("first_quiz");
                if (localStorage.getItem("lesson10_completed") === "true") grant("risk_learner");
            }
        } catch {
            // Ignore
        }

        return newlyUnlocked;
    }

    /* ======================================================================
       SAFE ACADEMY DATA BRIDGE & INITIAL SYNC
       ====================================================================== */

    function syncAcademyData() {
        const state = getState();
        if (!state) return;

        let modified = false;

        try {
            if (typeof localStorage !== "undefined") {
                for (let i = 1; i <= 10; i++) {
                    if (localStorage.getItem(`lesson${i}_completed`) === "true") {
                        const eventKey = `academy_lesson_${i}`;
                        if (!state.processedEvents.includes(eventKey)) {
                            state.processedEvents.push(eventKey);
                            state.xp = (state.xp || 0) + 20;
                            modified = true;
                        }
                    }
                }
            }

            if (modified) {
                const info = calculateLevelInfo(state.xp);
                state.level = info.level;
                state.rank = info.rank;
            }
        } catch (e) {
            console.warn("Strativo World: Academy sync encountered non-critical error.", e);
        }

        recalculateCandleMastery(state);
        checkAchievementsInternal(state);
        saveState(state);
    }

    /* ======================================================================
       ACADEMY EVENT BRIDGE LISTENERS
       ====================================================================== */

    function attachAcademyListeners() {
        if (typeof window === "undefined") return;

        window.addEventListener("strativo:lessonCompleted", function (e) {
            const lessonNum = e.detail && (e.detail.lessonNumber || e.detail.lesson);
            const eventKey = `academy_event_lesson_${lessonNum || Date.now()}`;
            addWorldXP(20, `Completed Academy Lesson ${lessonNum || ""}`, eventKey);
        });

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
        syncAcademyData();
        attachAcademyListeners();
        console.info("Strativo World: XP & Progression Engine ready (Phase 2.3).");
    }

    if (typeof document !== "undefined") {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initializeEngine);
        } else {
            initializeEngine();
        }
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
        recalculateCandleMastery,
        recalculatePipPositionMastery,
        recalculateMarketStructureMastery,
        recordPatternView,
        recordCandleBlitzResult,
        recordPipBlitzResult,
        recordMarketBlitzResult,
        syncAcademyData
    };

})();
