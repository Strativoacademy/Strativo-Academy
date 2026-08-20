/* ==========================================================
   STRATIVO ACADEMY
   Notification Preference Engine v1.0

   Responsibilities:
   - Save notification preferences
   - Restore preferences after refresh
   - Provide a global notification preference API
   - Keep notification settings independent from
     actual notification delivery
========================================================== */

"use strict";

(function () {

    /* ======================================================
       STORAGE KEYS
    ====================================================== */

    const STORAGE_KEYS = {

        learningReminders:
            "strativo_notifications_learning_reminders",

        quizResults:
            "strativo_notifications_quiz_results",

        achievementUnlocks:
            "strativo_notifications_achievement_unlocks",

        xpLevel:
            "strativo_notifications_xp_level",

        courseUpdates:
            "strativo_notifications_course_updates",

        community:
            "strativo_notifications_community",

        sound:
            "strativo_notifications_sound"

    };


    /* ======================================================
       DEFAULT SETTINGS
    ====================================================== */

    const DEFAULTS = {

        learningReminders: true,

        quizResults: true,

        achievementUnlocks: true,

        xpLevel: true,

        courseUpdates: true,

        community: true,

        sound: true

    };


    /* ======================================================
       DOM CACHE
    ====================================================== */

    const DOM = {

        learningReminders:
            null,

        quizResults:
            null,

        achievementUnlocks:
            null,

        xpLevel:
            null,

        courseUpdates:
            null,

        community:
            null,

        sound:
            null

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
                "Strativo Notifications: Unable to read preference.",
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
                "Strativo Notifications: Unable to save preference.",
                error
            );


            return false;

        }

    }


    /* ======================================================
       GET ALL SETTINGS
    ====================================================== */

    function getNotificationSettings() {

        return {

            learningReminders:
                getPreference(
                    STORAGE_KEYS.learningReminders,
                    DEFAULTS.learningReminders
                ),

            quizResults:
                getPreference(
                    STORAGE_KEYS.quizResults,
                    DEFAULTS.quizResults
                ),

            achievementUnlocks:
                getPreference(
                    STORAGE_KEYS.achievementUnlocks,
                    DEFAULTS.achievementUnlocks
                ),

            xpLevel:
                getPreference(
                    STORAGE_KEYS.xpLevel,
                    DEFAULTS.xpLevel
                ),

            courseUpdates:
                getPreference(
                    STORAGE_KEYS.courseUpdates,
                    DEFAULTS.courseUpdates
                ),

            community:
                getPreference(
                    STORAGE_KEYS.community,
                    DEFAULTS.community
                ),

            sound:
                getPreference(
                    STORAGE_KEYS.sound,
                    DEFAULTS.sound
                )

        };

    }


    /* ======================================================
       CACHE DOM
    ====================================================== */

    function cacheDOM() {

        DOM.learningReminders =
            document.getElementById(
                "learning-reminders-toggle"
            );


        DOM.quizResults =
            document.getElementById(
                "quiz-results-toggle"
            );


        DOM.achievementUnlocks =
            document.getElementById(
                "achievement-unlocks-toggle"
            );


        DOM.xpLevel =
            document.getElementById(
                "xp-level-toggle"
            );


        DOM.courseUpdates =
            document.getElementById(
                "course-updates-toggle"
            );


        DOM.community =
            document.getElementById(
                "community-notifications-toggle"
            );


        DOM.sound =
            document.getElementById(
                "notification-sound-toggle"
            );

    }


    /* ======================================================
       RESTORE SAVED SETTINGS
    ====================================================== */

    function restoreSettings() {

        const settings =
            getNotificationSettings();


        if (DOM.learningReminders) {

            DOM.learningReminders.checked =
                settings.learningReminders;

        }


        if (DOM.quizResults) {

            DOM.quizResults.checked =
                settings.quizResults;

        }


        if (DOM.achievementUnlocks) {

            DOM.achievementUnlocks.checked =
                settings.achievementUnlocks;

        }


        if (DOM.xpLevel) {

            DOM.xpLevel.checked =
                settings.xpLevel;

        }


        if (DOM.courseUpdates) {

            DOM.courseUpdates.checked =
                settings.courseUpdates;

        }


        if (DOM.community) {

            DOM.community.checked =
                settings.community;

        }


        if (DOM.sound) {

            DOM.sound.checked =
                settings.sound;

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


                console.info(
                    "Strativo notification preference updated:",
                    storageKey,
                    element.checked
                );

            }
        );

    }


    /* ======================================================
       CONNECT ALL TOGGLES
    ====================================================== */

    function connectControls() {

        connectToggle(
            DOM.learningReminders,
            STORAGE_KEYS.learningReminders
        );


        connectToggle(
            DOM.quizResults,
            STORAGE_KEYS.quizResults
        );


        connectToggle(
            DOM.achievementUnlocks,
            STORAGE_KEYS.achievementUnlocks
        );


        connectToggle(
            DOM.xpLevel,
            STORAGE_KEYS.xpLevel
        );


        connectToggle(
            DOM.courseUpdates,
            STORAGE_KEYS.courseUpdates
        );


        connectToggle(
            DOM.community,
            STORAGE_KEYS.community
        );


        connectToggle(
            DOM.sound,
            STORAGE_KEYS.sound
        );

    }


    /* ======================================================
       PUBLIC NOTIFICATION API
    ====================================================== */

    function isEnabled(
        notificationType
    ) {

        const settings =
            getNotificationSettings();


        if (
            !Object.prototype.hasOwnProperty.call(
                settings,
                notificationType
            )
        ) {

            return false;

        }


        return settings[
            notificationType
        ];

    }


    /* ======================================================
       INITIALIZE
    ====================================================== */

    function initializeNotifications() {

        cacheDOM();

        restoreSettings();

        connectControls();


        console.info(
            "Strativo Academy: Notification Engine initialized."
        );

    }


    /* ======================================================
       GLOBAL API
    ====================================================== */

    window.StrativoNotifications = {

        getSettings:
            getNotificationSettings,

        isEnabled:
            isEnabled

    };


    /* ======================================================
       DOM READY
    ====================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeNotifications
        );

    } else {

        initializeNotifications();

    }

})();