/* ==========================================================
   STRATIVO ACADEMY
   Notification Controller
   Version 2.1

   Responsibilities:
   - Notification dropdown
   - Notification badge
   - Open / close notification panel
   - Notification Settings navigation
   - Notification preference API
   - Existing toast notification support

   IMPORTANT:
   The header.js file owns the notification bell click.
   This controller owns the notification panel.
========================================================== */

"use strict";

(function () {

    /* ======================================================
       CONFIGURATION
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
       DOM REFERENCES
    ====================================================== */

    let notificationButton = null;

    let notificationPanel = null;

    let notificationClose = null;

    let notificationSettings = null;

    let notificationBadge = null;

    let notificationCount = null;

    let notificationWrapper = null;


    /* ======================================================
       STORAGE
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
       GET SETTINGS
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
       CHECK NOTIFICATION PREFERENCE
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
       CACHE DOM
    ====================================================== */

    function cacheDOM() {

        notificationWrapper =
            document.getElementById(
                "header-notification-wrapper"
            );


        notificationButton =
            document.getElementById(
                "header-notification-button"
            );


        notificationPanel =
            document.getElementById(
                "header-notification-panel"
            );


        notificationClose =
            document.getElementById(
                "header-notification-close"
            );


        notificationSettings =
            document.getElementById(
                "header-notification-settings"
            );


        notificationBadge =
            document.getElementById(
                "header-notification-badge"
            );


        notificationCount =
            document.getElementById(
                "header-notification-count"
            );

    }


    /* ======================================================
       UPDATE BADGE
    ====================================================== */

    function updateBadge() {

        if (!notificationBadge) {

            return;

        }


        /*
         * There are currently no real unread
         * notifications in the system.
         */

        const unreadCount = 0;


        notificationBadge.textContent =
            String(unreadCount);


        if (unreadCount > 0) {

            notificationBadge.hidden =
                false;

        } else {

            notificationBadge.hidden =
                true;

        }


        if (notificationCount) {

            notificationCount.textContent =
                unreadCount > 0
                    ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                    : "No new notifications";

        }

    }


    /* ======================================================
       OPEN NOTIFICATIONS
    ====================================================== */

    function openNotifications() {

        /*
         * Re-cache in case the header was loaded
         * after this controller initialized.
         */

        if (!notificationPanel) {

            cacheDOM();

        }


        if (!notificationPanel) {

            console.warn(
                "Strativo Academy: Notification panel not found."
            );

            return;

        }


        notificationPanel.hidden =
            false;


        notificationPanel.setAttribute(
            "aria-hidden",
            "false"
        );


        if (notificationButton) {

            notificationButton.setAttribute(
                "aria-expanded",
                "true"
            );

        }


        if (notificationWrapper) {

            notificationWrapper.classList.add(
                "is-open"
            );

        }

    }


    /* ======================================================
       CLOSE NOTIFICATIONS
    ====================================================== */

    function closeNotifications() {

        if (!notificationPanel) {

            return;

        }


        notificationPanel.hidden =
            true;


        notificationPanel.setAttribute(
            "aria-hidden",
            "true"
        );


        if (notificationButton) {

            notificationButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }


        if (notificationWrapper) {

            notificationWrapper.classList.remove(
                "is-open"
            );

        }

    }


    /* ======================================================
       TOGGLE NOTIFICATIONS
    ====================================================== */

    function toggleNotifications() {

        if (!notificationPanel) {

            cacheDOM();

        }


        if (!notificationPanel) {

            return;

        }


        if (notificationPanel.hidden) {

            openNotifications();

        } else {

            closeNotifications();

        }

    }


    /* ======================================================
       NOTIFICATION SETTINGS
    ====================================================== */

    function openNotificationSettings() {

        /*
         * Correct filename:
         * settings/notifications.html
         */

        const settingsPath =
            "settings/notifications.html";


        window.location.href =
            settingsPath;

    }


    /* ======================================================
       EVENT LISTENERS
    ====================================================== */

    function connectEvents() {

        /*
         * IMPORTANT:
         *
         * There is intentionally NO click listener
         * here for notificationButton.
         *
         * header.js owns the bell click.
         *
         * This prevents two click handlers from
         * opening and immediately closing the panel.
         */


        /* --------------------------------------------------
           CLOSE BUTTON
        -------------------------------------------------- */

        if (notificationClose) {

            notificationClose.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    closeNotifications();

                }
            );

        }


        /* --------------------------------------------------
           SETTINGS BUTTON
        -------------------------------------------------- */

        if (notificationSettings) {

            notificationSettings.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    openNotificationSettings();

                }
            );

        }


        /* --------------------------------------------------
           CLICK OUTSIDE
        -------------------------------------------------- */

        document.addEventListener(
            "click",
            function (event) {

                if (!notificationWrapper) {

                    return;

                }


                if (
                    !notificationWrapper.contains(
                        event.target
                    )
                ) {

                    closeNotifications();

                }

            }
        );


        /* --------------------------------------------------
           ESCAPE KEY
        -------------------------------------------------- */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape"
                ) {

                    closeNotifications();

                }

            }
        );

    }


    /* ======================================================
       INITIALIZE
    ====================================================== */

    function initializeNotifications() {

        cacheDOM();

        updateBadge();

        connectEvents();


        console.info(
            "Strativo Academy: Notification controller initialized."
        );

    }


    /* ======================================================
       PUBLIC API
    ====================================================== */

    window.StrativoNotifications = {

        open:
            openNotifications,

        close:
            closeNotifications,

        toggle:
            toggleNotifications,

        getSettings:
            getNotificationSettings,

        isEnabled:
            isEnabled

    };


    /* ======================================================
       COMPONENT-BASED INITIALIZATION
    ====================================================== */

    /*
     * The header is loaded asynchronously by
     * component-loader.js.
     *
     * Initialize after header.html is loaded.
     */

    document.addEventListener(
        "strativo:component-loaded",
        function (event) {

            if (
                event.detail &&
                event.detail.name === "header"
            ) {

                initializeNotifications();

            }

        }
    );


    /* ======================================================
       FALLBACK INITIALIZATION
    ====================================================== */

    function initializeNotificationsSafely() {

        const header =
            document.getElementById(
                "header-notification-button"
            );


        const panel =
            document.getElementById(
                "header-notification-panel"
            );


        if (
            header &&
            panel
        ) {

            initializeNotifications();

        }

    }


    /* ======================================================
       DOM READY FALLBACK
    ====================================================== */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            function () {

                initializeNotificationsSafely();

            }
        );

    } else {

        initializeNotificationsSafely();

    }


})();