/* ==========================================================================
   STRATIVO WORLD — SHARED AUDIO MANAGER (PHASE 2.5)
   Namespace: window.StrativoWorldAudio (alias window.StrativoAudioManager)
   Description:
   - Centralized, reusable audio engine for all Strativo World games and districts
   - Seamlessly integrates with StrativoWorldSettings (strativo_world_settings)
   - Volume hierarchy: Master Volume * Music/SFX Volume
   - Event-driven audio triggers (countdown, hit, combo, XP reward, level-up)
   - Resilient, safe error handling: missing assets fail silently with safe no-op
   - Autoplay policy gesture unlocking and dynamic path resolution
   ========================================================================== */

"use strict";

(function () {
    // Relative path resolver for subdirectories vs root
    function resolveAssetUrl(relPath) {
        if (!relPath || typeof relPath !== "string") return relPath;
        if (relPath.startsWith("http://") || relPath.startsWith("https://") || relPath.startsWith("data:") || relPath.startsWith("blob:") || relPath.startsWith("/")) {
            return relPath;
        }

        if (typeof window !== "undefined" && window.location && typeof window.location.pathname === "string") {
            const pathname = window.location.pathname.replace(/\\/g, "/");
            if (pathname.includes("/districts/") || pathname.includes("/prototype/")) {
                return "../" + relPath;
            }
        }
        return relPath;
    }

    // Default canonical sound asset registry mappings (Phase 2.5)
    const DEFAULT_SOUND_PATHS = {
        // UI
        button: "assets/audio/ui/button.wav",
        ui_button_click: "assets/audio/ui/button.wav",
        interaction: "assets/audio/ui/interaction.wav",
        ui_dialog_open: "assets/audio/ui/interaction.wav",

        // Candle City District
        ambience: "assets/audio/districts/candle-city/ambience.wav",
        ambient_candle_city: "assets/audio/districts/candle-city/ambience.wav",
        footsteps: "assets/audio/districts/candle-city/footsteps.wav",
        sfx_footsteps: "assets/audio/districts/candle-city/footsteps.wav",
        portal: "assets/audio/districts/candle-city/portal.wav",
        sfx_portal_warp: "assets/audio/districts/candle-city/portal.wav",

        // Candle Blitz
        countdown: "assets/audio/blitz/countdown.wav",
        countdownTick: "assets/audio/blitz/countdown.wav",
        countdownGo: "assets/audio/blitz/countdown.wav",
        blitz_countdown: "assets/audio/blitz/countdown.wav",
        targetHit: "assets/audio/blitz/target-hit.wav",
        blitz_target_hit: "assets/audio/blitz/target-hit.wav",
        correct: "assets/audio/blitz/correct.wav",
        correctHit: "assets/audio/blitz/correct.wav",
        blitz_correct: "assets/audio/blitz/correct.wav",
        incorrect: "assets/audio/blitz/incorrect.wav",
        wrongHit: "assets/audio/blitz/incorrect.wav",
        blitz_incorrect: "assets/audio/blitz/incorrect.wav",
        combo: "assets/audio/blitz/combo.wav",
        comboUp: "assets/audio/blitz/combo.wav",
        blitz_combo: "assets/audio/blitz/combo.wav",
        roundComplete: "assets/audio/blitz/round-complete.wav",
        blitz_round_complete: "assets/audio/blitz/round-complete.wav",
        matchComplete: "assets/audio/blitz/match-complete.wav",
        blitz_match_complete: "assets/audio/blitz/match-complete.wav",

        // Rewards & Progression
        xpReward: "assets/audio/rewards/xp.wav",
        reward_xp: "assets/audio/rewards/xp.wav",
        achievement: "assets/audio/rewards/achievement.wav",
        reward_achievement: "assets/audio/rewards/achievement.wav",
        levelUp: "assets/audio/rewards/level-up.wav",
        reward_level_up: "assets/audio/rewards/level-up.wav"
    };

    // Sound registry for custom runtime asset overrides
    const soundRegistry = {
        sfx: {},
        music: {}
    };

    // Active music state
    let currentMusicTrack = null;
    let currentMusicAudio = null;
    let audioContext = null;
    let isAudioUnlocked = false;

    // Default event to sound mapping
    const DEFAULT_EVENT_MAP = {
        interaction: "interaction",
        targetSelect: "targetHit",
        countdownTick: "countdown",
        countdownGo: "countdown",
        correctHit: "correct",
        targetHit: "targetHit",
        wrongHit: "incorrect",
        comboUp: "combo",
        roundComplete: "roundComplete",
        matchComplete: "matchComplete",
        xpEarned: "xpReward",
        worldLevelUp: "levelUp",
        achievementUnlocked: "achievement"
    };

    // Safe clamped volume helper
    function clampVol(val, defaultVal = 1.0) {
        const num = parseFloat(val);
        if (isNaN(num)) return defaultVal;
        return Math.max(0.0, Math.min(1.0, num));
    }

    function isAudioPathOrUrl(str) {
        if (!str || typeof str !== "string") return false;
        const s = str.toLowerCase().trim();
        return s.endsWith(".mp3") || s.endsWith(".ogg") || s.endsWith(".wav") || s.endsWith(".m4a") ||
               s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:audio") || s.startsWith("blob:");
    }

    // Settings Bridge Helpers
    function getSettings() {
        if (typeof window !== "undefined" && window.StrativoWorldSettings && typeof window.StrativoWorldSettings.getSettings === "function") {
            return window.StrativoWorldSettings.getSettings();
        }
        return {
            audio: {
                master: 1.0,
                music: 0.7,
                sfx: 0.8,
                muted: false
            }
        };
    }

    function updateSetting(path, value) {
        if (typeof window !== "undefined" && window.StrativoWorldSettings && typeof window.StrativoWorldSettings.updateSetting === "function") {
            window.StrativoWorldSettings.updateSetting(path, value);
        }
    }

    // ==========================================================================
    // VOLUME GETTERS & SETTERS (Calculated with Master scaling & Mute)
    // ==========================================================================
    function isMuted() {
        const s = getSettings();
        return Boolean(s.audio?.muted);
    }

    function getMasterVolume() {
        const s = getSettings();
        if (s.audio?.muted) return 0.0;
        return clampVol(s.audio?.master, 1.0);
    }

    function getMusicVolume() {
        const s = getSettings();
        if (s.audio?.muted) return 0.0;
        const master = clampVol(s.audio?.master, 1.0);
        const music = clampVol(s.audio?.music, 0.7);
        return Math.max(0.0, Math.min(1.0, master * music));
    }

    function getSfxVolume() {
        const s = getSettings();
        if (s.audio?.muted) return 0.0;
        const master = clampVol(s.audio?.master, 1.0);
        const sfx = clampVol(s.audio?.sfx, 0.8);
        return Math.max(0.0, Math.min(1.0, master * sfx));
    }

    function setMasterVolume(val) {
        const v = clampVol(val, 1.0);
        updateSetting("audio.master", v);
        _syncCurrentMusicVolume();
        return v;
    }

    function setMusicVolume(val) {
        const v = clampVol(val, 0.7);
        updateSetting("audio.music", v);
        _syncCurrentMusicVolume();
        return v;
    }

    function setSfxVolume(val) {
        const v = clampVol(val, 0.8);
        updateSetting("audio.sfx", v);
        return v;
    }

    function setMuted(muted) {
        const isM = Boolean(muted);
        updateSetting("audio.muted", isM);
        _syncCurrentMusicVolume();
        return isM;
    }

    function mute() {
        return setMuted(true);
    }

    function unmute() {
        return setMuted(false);
    }

    function _syncCurrentMusicVolume() {
        if (currentMusicAudio) {
            try {
                currentMusicAudio.volume = getMusicVolume();
            } catch {
                // Ignore audio volume errors safely
            }
        }
    }

    // ==========================================================================
    // SOUND REGISTRATION & PATH RESOLUTION
    // ==========================================================================
    function registerSound(name, url, type = "sfx") {
        if (!name || typeof name !== "string") return;
        const targetGroup = type === "music" ? soundRegistry.music : soundRegistry.sfx;
        targetGroup[name] = url || null;
    }

    function registerSounds(soundMap, type = "sfx") {
        if (!soundMap || typeof soundMap !== "object") return;
        for (const key in soundMap) {
            registerSound(key, soundMap[key], type);
        }
    }

    function getRegisteredSound(name, type = "sfx") {
        const targetGroup = type === "music" ? soundRegistry.music : soundRegistry.sfx;
        if (targetGroup[name]) return resolveAssetUrl(targetGroup[name]);
        if (DEFAULT_SOUND_PATHS[name]) return resolveAssetUrl(DEFAULT_SOUND_PATHS[name]);
        return null;
    }

    // ==========================================================================
    // PLAYBACK API (SFX & MUSIC)
    // ==========================================================================

    /**
     * Play a sound effect by registered name or custom URL
     * Safe no-op when file does not exist or device audio is muted.
     */
    function playSFX(nameOrUrl, options = {}) {
        const effectiveVolume = getSfxVolume();
        if (effectiveVolume <= 0 || isMuted()) {
            return { sound: nameOrUrl, played: false, reason: "muted_or_zero_volume" };
        }

        let url = getRegisteredSound(nameOrUrl, "sfx");
        if (!url && isAudioPathOrUrl(nameOrUrl)) {
            url = resolveAssetUrl(nameOrUrl);
        }

        if (!url || typeof url !== "string" || url.trim() === "") {
            // Safe fallback: No asset registered yet (normal during development)
            return { sound: nameOrUrl, played: false, reason: "no_asset_file" };
        }

        try {
            const AudioConstructor = (typeof window !== "undefined" && window.Audio) || (typeof Audio !== "undefined" ? Audio : null);
            if (typeof AudioConstructor === "function") {
                const audio = new AudioConstructor(url);
                const scale = clampVol(options.volume !== undefined ? options.volume : 1.0, 1.0);
                audio.volume = Math.max(0.0, Math.min(1.0, effectiveVolume * scale));

                if (options.playbackRate) {
                    audio.playbackRate = options.playbackRate;
                }

                if (options.loop) {
                    audio.loop = true;
                }

                const playPromise = audio.play();
                if (playPromise !== undefined && typeof playPromise.catch === "function") {
                    playPromise.catch(() => {
                        // Fail silently on autoplay restriction or missing codec/file
                    });
                }

                return {
                    sound: nameOrUrl,
                    played: true,
                    audioInstance: audio,
                    stop: () => {
                        try { audio.pause(); audio.currentTime = 0; } catch {}
                    }
                };
            }
        } catch {
            // Environment without HTML5 Audio support (e.g. headless test runner)
        }

        return { sound: nameOrUrl, played: false, reason: "audio_unsupported" };
    }

    /**
     * Play background music track by registered name or custom URL
     */
    function playMusic(nameOrUrl, options = {}) {
        const effectiveVolume = getMusicVolume();
        let url = getRegisteredSound(nameOrUrl, "music");
        if (!url && isAudioPathOrUrl(nameOrUrl)) {
            url = resolveAssetUrl(nameOrUrl);
        }

        if (currentMusicAudio && currentMusicTrack === nameOrUrl) {
            _syncCurrentMusicVolume();
            return { track: nameOrUrl, playing: true };
        }

        stopMusic();

        currentMusicTrack = nameOrUrl;

        if (!url || typeof url !== "string" || url.trim() === "") {
            return { track: nameOrUrl, playing: false, reason: "no_asset_file" };
        }

        try {
            const AudioConstructor = (typeof window !== "undefined" && window.Audio) || (typeof Audio !== "undefined" ? Audio : null);
            if (typeof AudioConstructor === "function") {
                const audio = new AudioConstructor(url);
                audio.loop = options.loop !== undefined ? options.loop : true;
                audio.volume = effectiveVolume;

                const playPromise = audio.play();
                if (playPromise !== undefined && typeof playPromise.catch === "function") {
                    playPromise.catch(() => {
                        // Fail silently on autoplay restriction
                    });
                }

                currentMusicAudio = audio;
                return { track: nameOrUrl, playing: true, audioInstance: audio };
            }
        } catch {
            // Fail safely in test/unsupported environments
        }

        return { track: nameOrUrl, playing: false, reason: "audio_unsupported" };
    }

    /**
     * Stop currently playing background music
     */
    function stopMusic() {
        if (currentMusicAudio) {
            try {
                currentMusicAudio.pause();
                currentMusicAudio.currentTime = 0;
            } catch {}
            currentMusicAudio = null;
        }
        const prev = currentMusicTrack;
        currentMusicTrack = null;
        return { stoppedTrack: prev };
    }

    function getCurrentMusicTrack() {
        return currentMusicTrack;
    }

    // ==========================================================================
    // AUTOMATIC EVENT DISPATCHER LISTENERS
    // ==========================================================================
    function setupEventListeners() {
        if (typeof window === "undefined" || typeof window.addEventListener !== "function") return;

        // 1. In-Game Audio Events Dispatcher (Candle Blitz, Candle City, etc.)
        window.addEventListener("strativo:gameAudioEvent", (e) => {
            const eventType = e.detail?.event;
            if (!eventType) return;

            const soundName = DEFAULT_EVENT_MAP[eventType] || eventType;
            playSFX(soundName, e.detail?.data || {});
        });

        // 2. XP Reward Gained
        window.addEventListener("strativo:worldXPChanged", (e) => {
            playSFX("xpReward", e.detail || {});
        });

        // 3. Level Up Milestone
        window.addEventListener("strativo:worldLevelUp", (e) => {
            playSFX("levelUp", e.detail || {});
        });

        // 4. Achievement Unlocked
        window.addEventListener("strativo:achievementUnlocked", (e) => {
            playSFX("achievement", e.detail || {});
        });

        // 5. Settings Changed Reaction
        window.addEventListener("strativo:worldSettingsChanged", () => {
            _syncCurrentMusicVolume();
        });

        // 6. User Gesture Autoplay Unlock
        const unlockAudio = () => {
            if (isAudioUnlocked) return;
            isAudioUnlocked = true;

            try {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass && !audioContext) {
                    audioContext = new AudioContextClass();
                    if (audioContext.state === "suspended") {
                        audioContext.resume().catch(() => {});
                    }
                }
            } catch {}

            window.removeEventListener("touchstart", unlockAudio, { passive: true });
            window.removeEventListener("mousedown", unlockAudio, { passive: true });
            window.removeEventListener("keydown", unlockAudio, { passive: true });
        };

        window.addEventListener("touchstart", unlockAudio, { passive: true });
        window.addEventListener("mousedown", unlockAudio, { passive: true });
        window.addEventListener("keydown", unlockAudio, { passive: true });
    }

    // Auto-initialize event listeners in browser
    if (typeof window !== "undefined") {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", setupEventListeners);
        } else {
            setupEventListeners();
        }
    }

    // ==========================================================================
    // EXPORT API
    // ==========================================================================
    const StrativoWorldAudio = {
        // Volume & Mute API
        getMasterVolume,
        getMusicVolume,
        getSfxVolume,
        setMasterVolume,
        setMusicVolume,
        setSfxVolume,
        setMuted,
        mute,
        unmute,
        isMuted,

        // Playback API
        playSFX,
        playMusic,
        stopMusic,
        getCurrentMusicTrack,

        // Registry API
        registerSound,
        registerSounds,
        getRegisteredSound,

        // Internal Sound Registry & Event Map references
        soundRegistry,
        DEFAULT_SOUND_PATHS,
        DEFAULT_EVENT_MAP
    };

    if (typeof window !== "undefined") {
        window.StrativoWorldAudio = StrativoWorldAudio;
        window.StrativoAudioManager = StrativoWorldAudio; // Reusable alias
    }

    if (typeof module !== "undefined" && module.exports) {
        module.exports = StrativoWorldAudio;
    }
})();
