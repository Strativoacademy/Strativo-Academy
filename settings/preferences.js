/* ==========================================================
   STRATIVO ACADEMY
   Learning & Practice Preferences Engine v1.0

   Responsibilities:
   - Save learning preferences
   - Restore preferences after refresh
   - Provide a global preferences API
   - Keep learning preferences separate from Appearance

   IMPORTANT:
   Theme and Font Size are NOT managed here.
   They are controlled globally by appearance.js /
   appearance-global.js.
========================================================== */

"use strict";

(function () {

    /* ======================================================
       STORAGE KEYS
    ====================================================== */

    const STORAGE_KEYS = {

        continueLastPosition:
            "strativo_learning_continue_last_position",

        completionConfirmation:
            "strativo_learning_completion_confirmation",

        lessonSidebar:
            "strativo_learning_lesson_sidebar",

        quizFeedback:
            "strativo_learning_quiz_feedback",

        quizRetry:
            "strativo_learning_quiz_retry",

        learningHints:
            "strativo_learning_hints",

        studyNotes:
            "strativo_learning_study_notes"

    };


    /* ======================================================
       DEFAULT SETTINGS
    ====================================================== */

    const DEFAULTS = {

        continueLastPosition: true,

        completionConfirmation: true,

        lessonSidebar: true,

        quizFeedback: true,

        quizRetry: true,

        learningHints: true,

        studyNotes: true

    };


    /* ======================================================
       DOM CACHE
    ====================================================== */

    const DOM = {

        continueLastPosition: null,

        completionConfirmation: null,

        lessonSidebar: null,

        quizFeedback: null,

        quizRetry: null,

        learningHints: null,

        studyNotes: null

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
                "Strativo Preferences: Unable to read preference.",
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
                "Strativo Preferences: Unable to save preference.",
                error
            );

            return false;

        }

    }


    /* ======================================================
       GET ALL LEARNING PREFERENCES
    ====================================================== */

    function getLearningPreferences() {

        return {

            continueLastPosition:
                getPreference(
                    STORAGE_KEYS.continueLastPosition,
                    DEFAULTS.continueLastPosition
                ),

            completionConfirmation:
                getPreference(
                    STORAGE_KEYS.completionConfirmation,
                    DEFAULTS.completionConfirmation
                ),

            lessonSidebar:
                getPreference(
                    STORAGE_KEYS.lessonSidebar,
                    DEFAULTS.lessonSidebar
                ),

            quizFeedback:
                getPreference(
                    STORAGE_KEYS.quizFeedback,
                    DEFAULTS.quizFeedback
                ),

            quizRetry:
                getPreference(
                    STORAGE_KEYS.quizRetry,
                    DEFAULTS.quizRetry
                ),

            learningHints:
                getPreference(
                    STORAGE_KEYS.learningHints,
                    DEFAULTS.learningHints
                ),

            studyNotes:
                getPreference(
                    STORAGE_KEYS.studyNotes,
                    DEFAULTS.studyNotes
                )

        };

    }


    /* ======================================================
       CACHE DOM
    ====================================================== */

    function cacheDOM() {

        DOM.continueLastPosition =
            document.getElementById(
                "continue-last-position-toggle"
            );


        DOM.completionConfirmation =
            document.getElementById(
                "completion-confirmation-toggle"
            );


        DOM.lessonSidebar =
            document.getElementById(
                "lesson-sidebar-toggle"
            );


        DOM.quizFeedback =
            document.getElementById(
                "quiz-feedback-toggle"
            );


        DOM.quizRetry =
            document.getElementById(
                "quiz-retry-toggle"
            );


        DOM.learningHints =
            document.getElementById(
                "learning-hints-toggle"
            );


        DOM.studyNotes =
            document.getElementById(
                "study-notes-toggle"
            );

    }


    /* ======================================================
       RESTORE SAVED SETTINGS
    ====================================================== */

    function restoreSettings() {

        const settings =
            getLearningPreferences();


        if (DOM.continueLastPosition) {

            DOM.continueLastPosition.checked =
                settings.continueLastPosition;

        }


        if (DOM.completionConfirmation) {

            DOM.completionConfirmation.checked =
                settings.completionConfirmation;

        }


        if (DOM.lessonSidebar) {

            DOM.lessonSidebar.checked =
                settings.lessonSidebar;

        }


        if (DOM.quizFeedback) {

            DOM.quizFeedback.checked =
                settings.quizFeedback;

        }


        if (DOM.quizRetry) {

            DOM.quizRetry.checked =
                settings.quizRetry;

        }


        if (DOM.learningHints) {

            DOM.learningHints.checked =
                settings.learningHints;

        }


        if (DOM.studyNotes) {

            DOM.studyNotes.checked =
                settings.studyNotes;

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
                    "Strativo learning preference updated:",
                    storageKey,
                    element.checked
                );

            }
        );

    }


    /* ======================================================
       CONNECT ALL CONTROLS
    ====================================================== */

    function connectControls() {

        connectToggle(
            DOM.continueLastPosition,
            STORAGE_KEYS.continueLastPosition
        );


        connectToggle(
            DOM.completionConfirmation,
            STORAGE_KEYS.completionConfirmation
        );


        connectToggle(
            DOM.lessonSidebar,
            STORAGE_KEYS.lessonSidebar
        );


        connectToggle(
            DOM.quizFeedback,
            STORAGE_KEYS.quizFeedback
        );


        connectToggle(
            DOM.quizRetry,
            STORAGE_KEYS.quizRetry
        );


        connectToggle(
            DOM.learningHints,
            STORAGE_KEYS.learningHints
        );


        connectToggle(
            DOM.studyNotes,
            STORAGE_KEYS.studyNotes
        );

    }


    /* ======================================================
       CHECK INDIVIDUAL PREFERENCE
    ====================================================== */

    function isEnabled(
        preferenceName
    ) {

        const settings =
            getLearningPreferences();


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

    }


    /* ======================================================
       PUBLIC API
    ====================================================== */

    window.StrativoLearningPreferences = {

        getSettings:
            getLearningPreferences,

        isEnabled:
            isEnabled

    };


    /* ======================================================
       INITIALIZE
    ====================================================== */

    function initializePreferences() {

        cacheDOM();

        restoreSettings();

        connectControls();


        console.info(
            "Strativo Academy: Learning Preferences Engine initialized."
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
            initializePreferences
        );

    } else {

        initializePreferences();

    }

})();