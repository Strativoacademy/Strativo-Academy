/* ==========================================================
   STRATIVO ACADEMY
   Sound & Audio Preference Engine v1.0

   Responsibilities:
   - Save sound preferences
   - Restore preferences after refresh
   - Handle "Mute All Sounds"
   - Provide a global sound API

   IMPORTANT:
   This engine manages preferences only.
   Actual audio playback will be connected later.
========================================================== */

"use strict";

(function () {

    /* ======================================================
       STORAGE KEYS
    ====================================================== */

    const STORAGE_KEYS = {

        soundEffects:
            "strativo_sound_effects",

        learningSounds:
            "strativo_learning_sounds",

        achievementSounds:
            "strativo_achievement_sounds",

        notificationSounds:
            "strativo_notification_sounds",

        muteAll:
            "strativo_mute_all"

    };


    /* ======================================================
       DEFAULT SETTINGS
    ====================================================== */

    const DEFAULTS = {

        soundEffects: true,

        learningSounds: true,

        achievementSounds: true,

        notificationSounds: true,

        muteAll: false

    };


    /* ======================================================
       DOM REFERENCES
    ====================================================== */

    const DOM = {

        soundEffects: null,

        learningSounds: null,

        achievementSounds: null,

        notificationSounds: null,

        muteAll: null

    };


    /* ======================================================
       SAFE STORAGE
    ====================================================== */

    function getPreference(
        key,
        fallback
    ) {

        try {

            const saved =
                localStorage.getItem(key);


            if (saved === null) {

                return fallback;

            }


            return saved === "true";

        } catch (error) {

            console.warn(
                "Strativo Sound: Unable to read preference.",
                error
            );

            return fallback;

        }

    }


    function savePreference(
        key,
        value
    ) {

        try {

            localStorage.setItem(
                key,
                String(Boolean(value))
            );

            return true;

        } catch (error) {

            console.warn(
                "Strativo Sound: Unable to save preference.",
                error
            );

            return false;

        }

    }


    /* ======================================================
       GET ALL SOUND SETTINGS
    ====================================================== */

    function getSoundSettings() {

        return {

            soundEffects:
                getPreference(
                    STORAGE_KEYS.soundEffects,
                    DEFAULTS.soundEffects
                ),

            learningSounds:
                getPreference(
                    STORAGE_KEYS.learningSounds,
                    DEFAULTS.learningSounds
                ),

            achievementSounds:
                getPreference(
                    STORAGE_KEYS.achievementSounds,
                    DEFAULTS.achievementSounds
                ),

            notificationSounds:
                getPreference(
                    STORAGE_KEYS.notificationSounds,
                    DEFAULTS.notificationSounds
                ),

            muteAll:
                getPreference(
                    STORAGE_KEYS.muteAll,
                    DEFAULTS.muteAll
                )

        };

    }


    /* ======================================================
       CACHE DOM
    ====================================================== */

    function cacheDOM() {

        DOM.soundEffects =
            document.getElementById(
                "sound-effects-toggle"
            );


        DOM.learningSounds =
            document.getElementById(
                "learning-sounds-toggle"
            );


        DOM.achievementSounds =
            document.getElementById(
                "achievement-sounds-toggle"
            );


        DOM.notificationSounds =
            document.getElementById(
                "notification-sounds-toggle"
            );


        DOM.muteAll =
            document.getElementById(
                "mute-all-sounds-toggle"
            );

    }


    /* ======================================================
       RESTORE SETTINGS
    ====================================================== */

    function restoreSettings() {

        const settings =
            getSoundSettings();


        if (DOM.soundEffects) {

            DOM.soundEffects.checked =
                settings.soundEffects;

        }


        if (DOM.learningSounds) {

            DOM.learningSounds.checked =
                settings.learningSounds;

        }


        if (DOM.achievementSounds) {

            DOM.achievementSounds.checked =
                settings.achievementSounds;

        }


        if (DOM.notificationSounds) {

            DOM.notificationSounds.checked =
                settings.notificationSounds;

        }


        if (DOM.muteAll) {

            DOM.muteAll.checked =
                settings.muteAll;

        }


        updateMuteVisualState(
            settings.muteAll
        );

    }


    /* ======================================================
       MUTE VISUAL STATE
    ====================================================== */

    function updateMuteVisualState(
        muted
    ) {

        const page =
            document.body;


        if (!page) {

            return;

        }


        page.dataset.muted =
            muted ? "true" : "false";

    }


    /* ======================================================
       CONNECT NORMAL TOGGLE
    ====================================================== */

    function connectToggle(
        element,
        storageKey
    ) {

        if (!element) {

            return;

        }


        element.addEventListener(
            "change",
            function () {

                savePreference(
                    storageKey,
                    element.checked
                );

            }
        );

    }


    /* ======================================================
       CONNECT MUTE CONTROL
    ====================================================== */

    function connectMuteControl() {

        if (!DOM.muteAll) {

            return;

        }


        DOM.muteAll.addEventListener(
            "change",
            function () {

                const muted =
                    DOM.muteAll.checked;


                savePreference(
                    STORAGE_KEYS.muteAll,
                    muted
                );


                updateMuteVisualState(
                    muted
                );

            }
        );

    }


    /* ======================================================
       CHECK IF SOUND IS ENABLED
    ====================================================== */

    function isEnabled(
        soundType
    ) {

        const settings =
            getSoundSettings();


        /*
         * Master mute always wins.
         */

        if (settings.muteAll) {

            return false;

        }


        switch (soundType) {

            case "effects":

                return settings.soundEffects;


            case "learning":

                return settings.learningSounds;


            case "achievement":

                return settings.achievementSounds;


            case "notification":

                return settings.notificationSounds;


            default:

                return false;

        }

    }


    /* ======================================================
       PUBLIC API
    ====================================================== */

    window.StrativoSound = {

        getSettings:
            getSoundSettings,

        isEnabled:
            isEnabled,

        isMuted:
            function () {

                return getSoundSettings().muteAll;

            }

    };


    /* ======================================================
       INITIALIZE
    ====================================================== */

    function initializeSound() {

        cacheDOM();

        restoreSettings();


        connectToggle(
            DOM.soundEffects,
            STORAGE_KEYS.soundEffects
        );


        connectToggle(
            DOM.learningSounds,
            STORAGE_KEYS.learningSounds
        );


        connectToggle(
            DOM.achievementSounds,
            STORAGE_KEYS.achievementSounds
        );


        connectToggle(
            DOM.notificationSounds,
            STORAGE_KEYS.notificationSounds
        );


        connectMuteControl();


        console.info(
            "Strativo Academy: Sound Engine initialized."
        );

    }


    /* ======================================================
       DOM READY
    ====================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeSound
        );

    } else {

        initializeSound();

    }

})();