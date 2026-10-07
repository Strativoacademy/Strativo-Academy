/* ==========================================================================
   STRATIVO WORLD — REUSABLE HAPTICS HELPER (PHASE 2.4)
   Namespace: window.StrativoWorldHaptics
   Description:
   - Safe device vibration capability detection
   - Strict respect for global user controls.vibration setting
   - Standard vibration profiles for tap, hit, error, reward & warning
   - Safe execution across desktop & mobile browsers
   ========================================================================== */

"use strict";

(function () {
    // Vibration Pattern Profiles (ms)
    const HAPTIC_PROFILES = {
        tap: 18,
        select: 25,
        hit: 30,
        success: 35,
        miss: [40, 30, 40],
        error: [50, 40, 50],
        warning: [60, 50],
        reward: [60, 40, 80],
        levelUp: [70, 40, 90, 40, 110],
        pulse: 15
    };

    function getNavigator() {
        if (typeof navigator !== "undefined") return navigator;
        if (typeof window !== "undefined" && window.navigator) return window.navigator;
        if (typeof global !== "undefined" && global.navigator) return global.navigator;
        return null;
    }

    function isVibrationSupported() {
        const nav = getNavigator();
        return nav !== null && typeof nav.vibrate === "function";
    }

    function isVibrationEnabled() {
        if (typeof window !== "undefined" && window.StrativoWorldSettings) {
            return window.StrativoWorldSettings.getSetting("controls.vibration", true);
        }
        return true;
    }

    function triggerHaptic(type = "tap") {
        const enabled = isVibrationEnabled();
        const supported = isVibrationSupported();
        const nav = getNavigator();

        const pattern = HAPTIC_PROFILES[type] || HAPTIC_PROFILES.tap;
        let fired = false;

        if (enabled && supported && nav) {
            try {
                fired = Boolean(nav.vibrate(pattern));
            } catch (err) {
                // Ignore platform vibration restrictions safely
                fired = false;
            }
        }

        if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
            window.dispatchEvent(new CustomEvent("strativo:hapticEvent", {
                detail: {
                    type,
                    pattern,
                    fired,
                    enabled,
                    supported,
                    timestamp: Date.now()
                }
            }));
        }

        return fired;
    }

    const StrativoWorldHaptics = {
        triggerHaptic,
        isVibrationSupported,
        isVibrationEnabled,
        HAPTIC_PROFILES
    };

    if (typeof window !== "undefined") {
        window.StrativoWorldHaptics = StrativoWorldHaptics;
    }

    if (typeof module !== "undefined" && module.exports) {
        module.exports = StrativoWorldHaptics;
    }
})();
