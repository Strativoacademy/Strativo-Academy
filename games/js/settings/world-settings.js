/* ==========================================================================
   STRATIVO WORLD — SHARED GAME SETTINGS ENGINE (PHASE 2.4)
   Namespace: window.StrativoWorldSettings
   Description:
   - Centralized, independent settings storage namespace (strativo_world_settings)
   - Versioned schema (v1.0) with safe backward-compatible migration
   - Audio volume calculation & mute interfaces
   - Controls sensitivity & vibration preferences
   - Graphics quality, particle/glow toggles & reduced motion detection
   - Global accessibility classes & DOM binding (.strativo-large-text, .strativo-high-contrast)
   - Event-driven architecture (strativo:worldSettingsChanged)
   ========================================================================== */

"use strict";

(function () {
    const SETTINGS_KEY = "strativo_world_settings";
    const SCHEMA_VERSION = 1;

    // Sensible Default Settings
    const DEFAULT_SETTINGS = {
        version: SCHEMA_VERSION,

        audio: {
            master: 1.0,
            music: 0.7,
            sfx: 0.8,
            muted: false
        },

        controls: {
            joystickSensitivity: 1.0,
            aimSensitivity: 1.0,
            cameraSensitivity: 1.0,
            vibration: true
        },

        graphics: {
            quality: "medium", // "low" | "medium" | "high"
            particles: true,
            glow: true,
            reducedMotion: false
        },

        gameplay: {
            showHints: true,
            showQuestMarkers: true
        },

        accessibility: {
            largeText: false,
            highContrast: false
        }
    };

    // Deep clone helper
    function cloneDeep(obj) {
        if (obj === null || typeof obj !== "object") return obj;
        if (Array.isArray(obj)) return obj.map(cloneDeep);
        const copy = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                copy[key] = cloneDeep(obj[key]);
            }
        }
        return copy;
    }

    // Value validators & clamps
    function clampNumber(val, min, max, defaultVal) {
        const num = parseFloat(val);
        if (isNaN(num)) return defaultVal;
        return Math.max(min, Math.min(max, num));
    }

    function sanitizeBoolean(val, defaultVal) {
        if (typeof val === "boolean") return val;
        if (val === "true" || val === 1 || val === "1") return true;
        if (val === "false" || val === 0 || val === "0") return false;
        return defaultVal;
    }

    function sanitizeQuality(val, defaultVal) {
        if (typeof val === "string") {
            const v = val.toLowerCase().trim();
            if (v === "low" || v === "medium" || v === "high") return v;
        }
        return defaultVal;
    }

    // Validate and sanitize entire settings object
    function validateSettings(raw) {
        const base = cloneDeep(DEFAULT_SETTINGS);
        if (!raw || typeof raw !== "object") return base;

        // Preserve unknown top-level future extensions where safe
        const result = { ...raw, version: SCHEMA_VERSION };

        // Audio
        result.audio = {
            master: clampNumber(raw.audio?.master, 0.0, 1.0, base.audio.master),
            music: clampNumber(raw.audio?.music, 0.0, 1.0, base.audio.music),
            sfx: clampNumber(raw.audio?.sfx, 0.0, 1.0, base.audio.sfx),
            muted: sanitizeBoolean(raw.audio?.muted, base.audio.muted)
        };

        // Controls
        result.controls = {
            joystickSensitivity: clampNumber(raw.controls?.joystickSensitivity, 0.5, 2.0, base.controls.joystickSensitivity),
            aimSensitivity: clampNumber(raw.controls?.aimSensitivity, 0.5, 2.0, base.controls.aimSensitivity),
            cameraSensitivity: clampNumber(raw.controls?.cameraSensitivity, 0.5, 2.0, base.controls.cameraSensitivity),
            vibration: sanitizeBoolean(raw.controls?.vibration, base.controls.vibration)
        };

        // Graphics
        result.graphics = {
            quality: sanitizeQuality(raw.graphics?.quality, base.graphics.quality),
            particles: sanitizeBoolean(raw.graphics?.particles, base.graphics.particles),
            glow: sanitizeBoolean(raw.graphics?.glow, base.graphics.glow),
            reducedMotion: sanitizeBoolean(raw.graphics?.reducedMotion, base.graphics.reducedMotion)
        };

        // Gameplay
        result.gameplay = {
            showHints: sanitizeBoolean(raw.gameplay?.showHints, base.gameplay.showHints),
            showQuestMarkers: sanitizeBoolean(raw.gameplay?.showQuestMarkers, base.gameplay.showQuestMarkers)
        };

        // Accessibility
        result.accessibility = {
            largeText: sanitizeBoolean(raw.accessibility?.largeText, base.accessibility.largeText),
            highContrast: sanitizeBoolean(raw.accessibility?.highContrast, base.accessibility.highContrast)
        };

        return result;
    }

    // In-Memory Cache
    let cachedSettings = null;

    function getStorage() {
        if (typeof window !== "undefined" && window.localStorage) {
            return window.localStorage;
        }
        if (typeof global !== "undefined" && global.localStorage) {
            return global.localStorage;
        }
        return null;
    }

    // Load settings from storage with migration
    function loadSettings() {
        if (cachedSettings) return cloneDeep(cachedSettings);

        const storage = getStorage();
        if (!storage) {
            cachedSettings = cloneDeep(DEFAULT_SETTINGS);
            return cloneDeep(cachedSettings);
        }

        try {
            const rawStr = storage.getItem(SETTINGS_KEY);
            if (!rawStr) {
                cachedSettings = cloneDeep(DEFAULT_SETTINGS);
                storage.setItem(SETTINGS_KEY, JSON.stringify(cachedSettings));
                return cloneDeep(cachedSettings);
            }

            const parsed = JSON.parse(rawStr);
            cachedSettings = validateSettings(parsed);
            return cloneDeep(cachedSettings);
        } catch (e) {
            console.warn("StrativoWorldSettings: Error loading settings, falling back to defaults.", e);
            cachedSettings = cloneDeep(DEFAULT_SETTINGS);
            return cloneDeep(cachedSettings);
        }
    }

    // Save settings to storage & apply
    function saveSettings(newSettings, notify = true, changedPath = null, changedValue = undefined) {
        const validated = validateSettings(newSettings);
        cachedSettings = cloneDeep(validated);

        const storage = getStorage();
        if (storage) {
            try {
                storage.setItem(SETTINGS_KEY, JSON.stringify(validated));
            } catch (e) {
                console.error("StrativoWorldSettings: Failed to persist to localStorage.", e);
            }
        }

        applyAccessibilityToDOM();

        if (notify && typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
            window.dispatchEvent(new CustomEvent("strativo:worldSettingsChanged", {
                detail: {
                    settings: cloneDeep(validated),
                    path: changedPath,
                    value: changedValue,
                    timestamp: Date.now()
                }
            }));
        }

        return cloneDeep(validated);
    }

    // Reset settings to defaults
    function resetSettings() {
        return saveSettings(DEFAULT_SETTINGS, true, "*", DEFAULT_SETTINGS);
    }

    // Update specific dot-notated setting path e.g. "audio.master"
    function updateSetting(path, value) {
        if (!path || typeof path !== "string") return getSettings();

        const current = getSettings();
        const parts = path.split(".");
        let cursor = current;

        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!cursor[part] || typeof cursor[part] !== "object") {
                cursor[part] = {};
            }
            cursor = cursor[part];
        }

        cursor[parts[parts.length - 1]] = value;
        return saveSettings(current, true, path, value);
    }

    // Get specific setting with fallback
    function getSetting(path, fallback = undefined) {
        if (!path || typeof path !== "string") return fallback;

        const current = getSettings();
        const parts = path.split(".");
        let cursor = current;

        for (let i = 0; i < parts.length; i++) {
            if (cursor === undefined || cursor === null) return fallback;
            cursor = cursor[parts[i]];
        }

        return cursor !== undefined ? cursor : fallback;
    }

    function getSettings() {
        return loadSettings();
    }

    // DOM Accessibility & Reduced Motion Applier
    function applyAccessibilityToDOM(root = null) {
        if (typeof document === "undefined") return;

        const target = root || document.documentElement;
        if (!target || !target.classList) return;

        const settings = getSettings();

        // Large text
        if (settings.accessibility.largeText) {
            target.classList.add("strativo-large-text");
        } else {
            target.classList.remove("strativo-large-text");
        }

        // High contrast
        if (settings.accessibility.highContrast) {
            target.classList.add("strativo-high-contrast");
        } else {
            target.classList.remove("strativo-high-contrast");
        }

        // Reduced motion
        const sysPrefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (settings.graphics.reducedMotion || sysPrefersReduced) {
            target.classList.add("strativo-reduced-motion");
        } else {
            target.classList.remove("strativo-reduced-motion");
        }
    }

    // Auto-apply on load in browser environments
    if (typeof document !== "undefined") {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => applyAccessibilityToDOM());
        } else {
            applyAccessibilityToDOM();
        }
    }

    // ======================================================================
    // REUSABLE AUDIO INTERFACE
    // ======================================================================
    const StrativoWorldAudio = {
        getMasterVolume() {
            const s = getSettings();
            if (s.audio.muted) return 0.0;
            return s.audio.master;
        },

        getMusicVolume() {
            const s = getSettings();
            if (s.audio.muted) return 0.0;
            return Math.max(0.0, Math.min(1.0, s.audio.master * s.audio.music));
        },

        getSfxVolume() {
            const s = getSettings();
            if (s.audio.muted) return 0.0;
            return Math.max(0.0, Math.min(1.0, s.audio.master * s.audio.sfx));
        },

        setMasterVolume(val) {
            return updateSetting("audio.master", clampNumber(val, 0.0, 1.0, 1.0));
        },

        setMusicVolume(val) {
            return updateSetting("audio.music", clampNumber(val, 0.0, 1.0, 0.7));
        },

        setSfxVolume(val) {
            return updateSetting("audio.sfx", clampNumber(val, 0.0, 1.0, 0.8));
        },

        setMuted(isMuted) {
            return updateSetting("audio.muted", sanitizeBoolean(isMuted, false));
        },

        isMuted() {
            return getSetting("audio.muted", false);
        }
    };

    // ======================================================================
    // REUSABLE CONTROLS INTERFACE
    // ======================================================================
    const StrativoWorldControls = {
        getJoystickSensitivity() {
            return getSetting("controls.joystickSensitivity", 1.0);
        },

        getAimSensitivity() {
            return getSetting("controls.aimSensitivity", 1.0);
        },

        getCameraSensitivity() {
            return getSetting("controls.cameraSensitivity", 1.0);
        },

        isVibrationEnabled() {
            return getSetting("controls.vibration", true);
        },

        setJoystickSensitivity(val) {
            return updateSetting("controls.joystickSensitivity", clampNumber(val, 0.5, 2.0, 1.0));
        },

        setAimSensitivity(val) {
            return updateSetting("controls.aimSensitivity", clampNumber(val, 0.5, 2.0, 1.0));
        },

        setCameraSensitivity(val) {
            return updateSetting("controls.cameraSensitivity", clampNumber(val, 0.5, 2.0, 1.0));
        },

        setVibrationEnabled(enabled) {
            return updateSetting("controls.vibration", sanitizeBoolean(enabled, true));
        }
    };

    // ======================================================================
    // REUSABLE GRAPHICS INTERFACE
    // ======================================================================
    const StrativoWorldGraphics = {
        getQuality() {
            return getSetting("graphics.quality", "medium");
        },

        isGraphicsEffectEnabled(effectName) {
            const quality = this.getQuality();
            if (quality === "low") {
                // Low quality disables heavy bloom & particles
                if (effectName === "particles" || effectName === "glow") return false;
            }

            if (effectName === "particles") {
                return getSetting("graphics.particles", true);
            }
            if (effectName === "glow") {
                return getSetting("graphics.glow", true);
            }
            return true;
        },

        isReducedMotion() {
            const settingVal = getSetting("graphics.reducedMotion", false);
            const sysPrefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            return Boolean(settingVal || sysPrefersReduced);
        },

        setQuality(q) {
            return updateSetting("graphics.quality", sanitizeQuality(q, "medium"));
        },

        setParticlesEnabled(enabled) {
            return updateSetting("graphics.particles", sanitizeBoolean(enabled, true));
        },

        setGlowEnabled(enabled) {
            return updateSetting("graphics.glow", sanitizeBoolean(enabled, true));
        },

        setReducedMotion(reduced) {
            return updateSetting("graphics.reducedMotion", sanitizeBoolean(reduced, false));
        }
    };

    // Export API to Global Scope
    const StrativoWorldSettings = {
        getSettings,
        saveSettings,
        resetSettings,
        updateSetting,
        getSetting,
        applyAccessibilityToDOM,
        DEFAULT_SETTINGS: cloneDeep(DEFAULT_SETTINGS),
        SCHEMA_VERSION
    };

    if (typeof window !== "undefined") {
        window.StrativoWorldSettings = StrativoWorldSettings;
        window.StrativoWorldAudio = StrativoWorldAudio;
        window.StrativoWorldControls = StrativoWorldControls;
        window.StrativoWorldGraphics = StrativoWorldGraphics;
    }

    if (typeof module !== "undefined" && module.exports) {
        module.exports = {
            StrativoWorldSettings,
            StrativoWorldAudio,
            StrativoWorldControls,
            StrativoWorldGraphics,
            DEFAULT_SETTINGS
        };
    }
})();
