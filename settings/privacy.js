/* ==========================================================
   STRATIVO ACADEMY
   Privacy & Data Engine v1.0

   Responsibilities:
   - Save privacy preferences
   - Restore preferences after refresh
   - Provide a global privacy API
   - Safely clear local learning data

   IMPORTANT:
   This currently manages browser/local data only.
   Server-side account data will be handled later when
   the Strativo backend is connected.
========================================================== */

"use strict";

(function () {

    /* ======================================================
       STORAGE KEYS
    ====================================================== */

    const STORAGE_KEYS = {

        saveProgress:
            "strativo_privacy_save_progress",

        saveQuizData:
            "strativo_privacy_save_quiz_data",

        saveAchievementData:
            "strativo_privacy_save_achievement_data"

    };


    /* ======================================================
       DEFAULT SETTINGS
    ====================================================== */

    const DEFAULTS = {

        saveProgress: true,

        saveQuizData: true,

        saveAchievementData: true

    };


    /* ======================================================
       DOM
    ====================================================== */

    const DOM = {

        saveProgress:
            null,

        saveQuizData:
            null,

        saveAchievementData:
            null,

        clearLocalDataButton:
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

            const value =
                localStorage.getItem(key);


            if (value === null) {

                return fallback;

            }


            return value === "true";

        } catch (error) {

            console.warn(
                "Strativo Privacy: Unable to read preference.",
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
                "Strativo Privacy: Unable to save preference.",
                error
            );

            return false;

        }

    }


    /* ======================================================
       GET PRIVACY SETTINGS
    ====================================================== */

    function getPrivacySettings() {

        return {

            saveProgress:
                getPreference(
                    STORAGE_KEYS.saveProgress,
                    DEFAULTS.saveProgress
                ),

            saveQuizData:
                getPreference(
                    STORAGE_KEYS.saveQuizData,
                    DEFAULTS.saveQuizData
                ),

            saveAchievementData:
                getPreference(
                    STORAGE_KEYS.saveAchievementData,
                    DEFAULTS.saveAchievementData
                )

        };

    }


    /* ======================================================
       CACHE DOM
    ====================================================== */

    function cacheDOM() {

        DOM.saveProgress =
            document.getElementById(
                "save-progress-toggle"
            );


        DOM.saveQuizData =
            document.getElementById(
                "save-quiz-data-toggle"
            );


        DOM.saveAchievementData =
            document.getElementById(
                "save-achievement-data-toggle"
            );


        DOM.clearLocalDataButton =
            document.getElementById(
                "clear-local-data-button"
            );

    }


    /* ======================================================
       RESTORE SETTINGS
    ====================================================== */

    function restoreSettings() {

        const settings =
            getPrivacySettings();


        if (DOM.saveProgress) {

            DOM.saveProgress.checked =
                settings.saveProgress;

        }


        if (DOM.saveQuizData) {

            DOM.saveQuizData.checked =
                settings.saveQuizData;

        }


        if (DOM.saveAchievementData) {

            DOM.saveAchievementData.checked =
                settings.saveAchievementData;

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
       LOCAL DATA IDENTIFICATION
       
       Only learning-related data should be removed.

       We deliberately DO NOT remove:
       - Appearance settings
       - Notification settings
       - Learning preference settings
       - Account/profile settings
       
       This prevents "Clear Learning Data" from
       unexpectedly resetting the whole application.
    ====================================================== */

    function isLearningDataKey(
        key
    ) {

        const learningPrefixes = [

            "lesson",

            "quiz",

            "progress",

            "achievement",

            "xp",

            "gamification",

            "bookmark",

            "study",

            "note"

        ];


        const normalizedKey =
            key.toLowerCase();


        return learningPrefixes.some(
            prefix =>
                normalizedKey.startsWith(prefix)
        );

    }


    /* ======================================================
       CLEAR LOCAL LEARNING DATA
    ====================================================== */

    function clearLocalLearningData() {

        const keysToRemove = [];


        for (
            let index = 0;
            index < localStorage.length;
            index++
        ) {

            const key =
                localStorage.key(index);


            if (
                key &&
                isLearningDataKey(key)
            ) {

                keysToRemove.push(key);

            }

        }


        keysToRemove.forEach(
            key => {

                localStorage.removeItem(
                    key
                );

            }
        );


        return keysToRemove.length;

    }


    /* ======================================================
       CONFIRMATION
    ====================================================== */

    function clearDataWithConfirmation() {

        const confirmed =
            window.confirm(
                "Clear locally stored learning data?\n\n" +
                "This can remove lesson progress, quiz data, " +
                "achievements, XP, bookmarks and study notes " +
                "stored in this browser.\n\n" +
                "Your Appearance and Notification settings " +
                "will not be removed."
            );


        if (!confirmed) {

            return;

        }


        const removedCount =
            clearLocalLearningData();


        window.alert(
            removedCount > 0
                ? "Your local learning data has been cleared."
                : "No local learning data was found."
        );


        /*
         * Reload so every visible page state reflects
         * the reset learning data.
         */

        window.location.reload();

    }


    /* ======================================================
       CONNECT CLEAR BUTTON
    ====================================================== */

    function connectClearButton() {

        if (
            !DOM.clearLocalDataButton
        ) {

            return;

        }


        DOM.clearLocalDataButton.addEventListener(
            "click",
            clearDataWithConfirmation
        );

    }


    /* ======================================================
       PUBLIC API
    ====================================================== */

    window.StrativoPrivacy = {

        getSettings:
            getPrivacySettings,

        isEnabled:
            function (preferenceName) {

                const settings =
                    getPrivacySettings();


                if (
                    !Object.prototype.hasOwnProperty.call(
                        settings,
                        preferenceName
                    )
                ) {

                    return false;

                }


                return settings[
                    preferenceName
                ];

            },

        clearLearningData:
            clearLocalLearningData

    };


    /* ======================================================
       INITIALIZE
    ====================================================== */

    function initializePrivacy() {

        cacheDOM();

        restoreSettings();


        connectToggle(
            DOM.saveProgress,
            STORAGE_KEYS.saveProgress
        );


        connectToggle(
            DOM.saveQuizData,
            STORAGE_KEYS.saveQuizData
        );


        connectToggle(
            DOM.saveAchievementData,
            STORAGE_KEYS.saveAchievementData
        );


        connectClearButton();


        console.info(
            "Strativo Academy: Privacy Engine initialized."
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
            initializePrivacy
        );

    } else {

        initializePrivacy();

    }

})();