/* ==========================================================================
   STRATIVO WORLD — CORE STATE MANAGER
   Version: 2.0 (Phase 2.3 Gameplay Progression & Mastery Extension)
   Namespace: strativo_world_state
   ========================================================================== */

"use strict";

(function () {

    /* ======================================================================
       STORAGE CONFIGURATION
       ====================================================================== */

    const STORAGE_KEY = "strativo_world_state";
    const SCHEMA_VERSION = 2;

    /* ======================================================================
       DEFAULT WORLD STATE SCHEMA (VERSION 2)
       ====================================================================== */

    const DEFAULT_STATE = {
        version: SCHEMA_VERSION,
        handle: "Student",
        avatar: "fa-user-astronaut",
        avatarFrame: "frame-default",
        xp: 0,
        level: 1,
        rank: "Novice Chartist",
        streak: 0,
        bestStreak: 0,
        lastActiveDate: null,
        activityDates: [],
        mastery: {
            candlesticks: 0,
            pipPosition: 0,
            marketStructure: 0,
            chartReading: 0,
            riskManagement: 0,
            psychology: 0
        },
        achievements: [],
        unlockedDistricts: ["candle-city"],
        processedEvents: [],

        // Phase 2.3 Progression & Mastery Extension
        viewedPatterns: [],
        patternMastery: {},
        blitzStats: {
            matchesPlayed: 0,
            patternsIdentified: 0,
            totalCorrect: 0,
            totalAttempts: 0,
            bestCombo: 0,
            bestScore: 0,
            avgReactionMs: 0
        },
        missions: {
            first_light: {
                id: "first_light",
                title: "First Light",
                description: "Inspect 3 candle patterns in the Archive or exhibits.",
                target: 3,
                progress: 0,
                completed: false
            },
            rapid_eye: {
                id: "rapid_eye",
                title: "Rapid Eye",
                description: "Complete 1 full Candle Blitz match (10 rounds).",
                target: 1,
                progress: 0,
                completed: false
            },
            pattern_hunter: {
                id: "pattern_hunter",
                title: "Pattern Hunter",
                description: "Correctly identify 10 candlestick patterns.",
                target: 10,
                progress: 0,
                completed: false
            }
        },
        uniqueLocations: []
    };

    /* ======================================================================
       SAFE STORAGE & MIGRATION HANDLERS
       ====================================================================== */

    function loadState() {
        try {
            if (typeof localStorage === "undefined") {
                return JSON.parse(JSON.stringify(DEFAULT_STATE));
            }

            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return initializeDefaultState();
            }

            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== "object") {
                return initializeDefaultState();
            }

            // Safe backward-compatible merge preserving all previous v1 state
            const merged = {
                ...DEFAULT_STATE,
                ...parsed,
                version: SCHEMA_VERSION,
                mastery: {
                    ...DEFAULT_STATE.mastery,
                    ...(parsed.mastery || {})
                },
                unlockedDistricts: Array.isArray(parsed.unlockedDistricts) && parsed.unlockedDistricts.length > 0
                    ? parsed.unlockedDistricts
                    : ["candle-city"],
                activityDates: Array.isArray(parsed.activityDates)
                    ? parsed.activityDates
                    : [],
                achievements: Array.isArray(parsed.achievements)
                    ? parsed.achievements
                    : [],
                processedEvents: Array.isArray(parsed.processedEvents)
                    ? parsed.processedEvents
                    : [],
                viewedPatterns: Array.isArray(parsed.viewedPatterns)
                    ? parsed.viewedPatterns
                    : [],
                patternMastery: typeof parsed.patternMastery === "object" && parsed.patternMastery !== null
                    ? parsed.patternMastery
                    : {},
                blitzStats: {
                    ...DEFAULT_STATE.blitzStats,
                    ...(parsed.blitzStats || {})
                },
                missions: {
                    ...DEFAULT_STATE.missions,
                    ...(parsed.missions || {})
                },
                uniqueLocations: Array.isArray(parsed.uniqueLocations)
                    ? parsed.uniqueLocations
                    : []
            };

            return merged;
        } catch (err) {
            console.warn("Strativo World State: Error reading localStorage, falling back to default.", err);
            return initializeDefaultState();
        }
    }

    function saveState(state) {
        try {
            if (typeof localStorage === "undefined") return false;
            if (!state || typeof state !== "object") return false;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            return true;
        } catch (err) {
            console.error("Strativo World State: Failed to save to localStorage.", err);
            return false;
        }
    }

    function initializeDefaultState() {
        const fresh = JSON.parse(JSON.stringify(DEFAULT_STATE));
        saveState(fresh);
        return fresh;
    }

    function patchState(patchObj) {
        const current = loadState();
        const updated = {
            ...current,
            ...patchObj,
            mastery: patchObj.mastery
                ? { ...current.mastery, ...patchObj.mastery }
                : current.mastery,
            blitzStats: patchObj.blitzStats
                ? { ...current.blitzStats, ...patchObj.blitzStats }
                : current.blitzStats,
            missions: patchObj.missions
                ? { ...current.missions, ...patchObj.missions }
                : current.missions,
            uniqueLocations: Array.isArray(patchObj.uniqueLocations)
                ? patchObj.uniqueLocations
                : current.uniqueLocations
        };
        saveState(updated);
        return updated;
    }

    function resetState() {
        if (typeof localStorage !== "undefined") {
            localStorage.removeItem(STORAGE_KEY);
        }
        return initializeDefaultState();
    }

    /* ======================================================================
       PUBLIC STATE API
       ====================================================================== */

    window.StrativoWorldState = {
        STORAGE_KEY,
        SCHEMA_VERSION,
        get: loadState,
        getState: loadState,
        save: saveState,
        saveState: saveState,
        patch: patchState,
        updateState: patchState,
        reset: resetState,
        resetState: resetState
    };

    console.info("Strativo World: State Engine initialized (Schema v2.0).");

})();
