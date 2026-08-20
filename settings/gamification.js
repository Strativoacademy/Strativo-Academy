/* ==========================================================
   STRATIVO ACADEMY
   Gamification Preference Engine v1.0

   Responsibilities:
   - Save gamification preferences
   - Restore preferences after refresh
   - Provide a global gamification API

   IMPORTANT:
   This currently manages local preferences only.
   Community visibility will be enforced by the backend
   when the account/community system is connected.
========================================================== */

"use strict";

(function () {

    /* ======================================================
       STORAGE KEYS
    ====================================================== */

    const STORAGE_KEYS = {

        showXPLevel:
            "strativo_gamification_show_xp_level",

        showLearningProgress:
            "strativo_gamification_show_learning_progress",

        communityProfile:
            "strativo_gamification_community_profile",

        communityActivity:
            "strativo_gamification_community_activity",

        leaderboardVisibility:
            "strativo_gamification_leaderboard_visibility"

    };


    /* ======================================================
       DEFAULT SETTINGS
    ====================================================== */

    const DEFAULTS = {

        showXPLevel: true,

        showLearningProgress: true,

        communityProfile: true,

        communityActivity: true,

        leaderboardVisibility: true

    };


    /* ======================================================
       DOM REFERENCES
    ====================================================== */

    const DOM = {

        showXPLevel: null,

        showLearningProgress: null,

        communityProfile: null,

        communityActivity: null,

        leaderboardVisibility: null

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
                "Strativo Gamification: Unable to read preference.",
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
                "Strativo Gamification: Unable to save preference.",
                error
            );

            return false;

        }

    }


    /* ======================================================
       GET ALL SETTINGS
    ====================================================== */

    function getGamificationSettings() {

        return {

            showXPLevel:
                getPreference(
                    STORAGE_KEYS.showXPLevel,
                    DEFAULTS.showXPLevel
                ),

            showLearningProgress:
                getPreference(
                    STORAGE_KEYS.showLearningProgress,
                    DEFAULTS.showLearningProgress
                ),

            communityProfile:
                getPreference(
                    STORAGE_KEYS.communityProfile,
                    DEFAULTS.communityProfile
                ),

            communityActivity:
                getPreference(
                    STORAGE_KEYS.communityActivity,
                    DEFAULTS.communityActivity
                ),

            leaderboardVisibility:
                getPreference(
                    STORAGE_KEYS.leaderboardVisibility,
                    DEFAULTS.leaderboardVisibility
                )

        };

    }


    /* ======================================================
       CACHE DOM
    ====================================================== */

    function cacheDOM() {

        DOM.showXPLevel =
            document.getElementById(
                "show-xp-level-toggle"
            );


        DOM.showLearningProgress =
            document.getElementById(
                "show-learning-progress-toggle"
            );


        DOM.communityProfile =
            document.getElementById(
                "community-profile-toggle"
            );


        DOM.communityActivity =
            document.getElementById(
                "community-activity-toggle"
            );


        DOM.leaderboardVisibility =
            document.getElementById(
                "leaderboard-visibility-toggle"
            );

    }


    /* ======================================================
       RESTORE SETTINGS
    ====================================================== */

    function restoreSettings() {

        const settings =
            getGamificationSettings();


        if (DOM.showXPLevel) {

            DOM.showXPLevel.checked =
                settings.showXPLevel;

        }


        if (DOM.showLearningProgress) {

            DOM.showLearningProgress.checked =
                settings.showLearningProgress;

        }


        if (DOM.communityProfile) {

            DOM.communityProfile.checked =
                settings.communityProfile;

        }


        if (DOM.communityActivity) {

            DOM.communityActivity.checked =
                settings.communityActivity;

        }


        if (DOM.leaderboardVisibility) {

            DOM.leaderboardVisibility.checked =
                settings.leaderboardVisibility;

        }

    }


    /* ======================================================
       CONNECT TOGGLE
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
       CHECK INDIVIDUAL SETTING
    ====================================================== */

    function isEnabled(
        settingName
    ) {

        const settings =
            getGamificationSettings();


        if (
            !Object.prototype.hasOwnProperty.call(
                settings,
                settingName
            )
        ) {

            return false;

        }


        return settings[
            settingName
        ];

    }


    /* ======================================================
       PUBLIC API
    ====================================================== */

    window.StrativoGamification = {

        getSettings:
            getGamificationSettings,

        isEnabled:
            isEnabled

    };


    /* ======================================================
       INITIALIZE
    ====================================================== */

    function initializeGamification() {

        cacheDOM();

        restoreSettings();


        connectToggle(
            DOM.showXPLevel,
            STORAGE_KEYS.showXPLevel
        );


        connectToggle(
            DOM.showLearningProgress,
            STORAGE_KEYS.showLearningProgress
        );


        connectToggle(
            DOM.communityProfile,
            STORAGE_KEYS.communityProfile
        );


        connectToggle(
            DOM.communityActivity,
            STORAGE_KEYS.communityActivity
        );


        connectToggle(
            DOM.leaderboardVisibility,
            STORAGE_KEYS.leaderboardVisibility
        );


        console.info(
            "Strativo Academy: Gamification Engine initialized."
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
            initializeGamification
        );

    } else {

        initializeGamification();

    }

})();