/* ==========================================================
   STRATIVO ACADEMY
   Security Preferences Engine v1.0

   Responsibilities:
   - Save security alert preference
   - Restore preference after refresh
   - Provide a global security API

   IMPORTANT:
   This is only a frontend preference for now.
   Real authentication, password management, 2FA and
   device sessions will be connected when the backend exists.
========================================================== */

"use strict";

(function () {

    /* ======================================================
       STORAGE
    ====================================================== */

    const STORAGE_KEY =
        "strativo_security_alerts";


    const DEFAULT_VALUE =
        true;


    /* ======================================================
       DOM
    ====================================================== */

    let securityAlertsToggle = null;


    /* ======================================================
       READ PREFERENCE
    ====================================================== */

    function getSecurityAlertsPreference() {

        try {

            const saved =
                localStorage.getItem(
                    STORAGE_KEY
                );


            if (saved === null) {

                return DEFAULT_VALUE;

            }


            return saved === "true";

        } catch (error) {

            console.warn(
                "Strativo Security: Unable to read preference.",
                error
            );

            return DEFAULT_VALUE;

        }

    }


    /* ======================================================
       SAVE PREFERENCE
    ====================================================== */

    function saveSecurityAlertsPreference(
        enabled
    ) {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                String(Boolean(enabled))
            );

            return true;

        } catch (error) {

            console.warn(
                "Strativo Security: Unable to save preference.",
                error
            );

            return false;

        }

    }


    /* ======================================================
       RESTORE
    ====================================================== */

    function restoreSecurityAlerts() {

        if (!securityAlertsToggle) {

            return;

        }


        securityAlertsToggle.checked =
            getSecurityAlertsPreference();

    }


    /* ======================================================
       CONNECT
    ====================================================== */

    function connectSecurityAlerts() {

        if (!securityAlertsToggle) {

            return;

        }


        securityAlertsToggle.addEventListener(
            "change",
            function () {

                saveSecurityAlertsPreference(
                    securityAlertsToggle.checked
                );

                console.info(
                    "Strativo security alerts:",
                    securityAlertsToggle.checked
                );

            }
        );

    }


    /* ======================================================
       PUBLIC API
    ====================================================== */

    window.StrativoSecurity = {

        areSecurityAlertsEnabled:
            function () {

                return getSecurityAlertsPreference();

            },

        getSettings:
            function () {

                return {

                    securityAlerts:
                        getSecurityAlertsPreference()

                };

            }

    };


    /* ======================================================
       INITIALIZE
    ====================================================== */

    function initializeSecurity() {

        securityAlertsToggle =
            document.getElementById(
                "security-alerts-toggle"
            );


        restoreSecurityAlerts();

        connectSecurityAlerts();


        console.info(
            "Strativo Academy: Security Engine initialized."
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
            initializeSecurity
        );

    } else {

        initializeSecurity();

    }

})();