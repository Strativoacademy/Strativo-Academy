/* ==========================================================================
   STRATIVO WORLD — CORE STATE MANAGER
   Version: 1.0
   Namespace: strativo_world_state
   ========================================================================== */

"use strict";

(function () {

    /* ======================================================================
       STORAGE CONFIGURATION
       ====================================================================== */

    const STORAGE_KEY = "strativo_world_state";
    const SCHEMA_VERSION = 1;

    /* ======================================================================
       DEFAULT WORLD STATE SCHEMA
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
        processedEvents: []
    };

    /* ======================================================================
       SAFE STORAGE HANDLERS
       ====================================================================== */

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return initializeDefaultState();
            }

            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== "object") {
                return initializeDefaultState();
            }

            // Merge with defaults to ensure all keys exist
            const merged = {
                ...DEFAULT_STATE,
                ...parsed,
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
                : current.mastery
        };
        saveState(updated);
        return updated;
    }

    function resetState() {
        localStorage.removeItem(STORAGE_KEY);
        return initializeDefaultState();
    }

    /* ======================================================================
       PUBLIC STATE API
       ====================================================================== */

    window.StrativoWorldState = {
        STORAGE_KEY,
        SCHEMA_VERSION,
        get: loadState,
        save: saveState,
        patch: patchState,
        reset: resetState
    };

    console.info("Strativo World: State Engine initialized.");

})();
