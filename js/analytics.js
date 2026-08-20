/* ==========================================================
   STRATIVO ACADEMY
   Analytics & AdSense Controller
   Version 1.0

   Configuration Instructions:
   1. When you create your Google Analytics 4 property, replace
      "G-XXXXXXXXXX" with your real Measurement ID and set gaEnabled: true.
   2. When your Google AdSense account is approved, replace
      "ca-pub-XXXXXXXXXXXXXXXX" with your real Publisher ID and set adsenseEnabled: true.
========================================================== */

"use strict";

(function () {

    const STRATIVO_CONFIG = {
        // Google Analytics 4 Measurement ID
        gaMeasurementId: "G-XXXXXXXXXX",
        gaEnabled: false,

        // Google AdSense Publisher ID
        adsensePublisherId: "ca-pub-XXXXXXXXXXXXXXXX",
        adsenseEnabled: false
    };

    /* ======================================================
       GOOGLE ANALYTICS 4
       ====================================================== */
    function initializeGoogleAnalytics() {
        if (
            !STRATIVO_CONFIG.gaEnabled ||
            !STRATIVO_CONFIG.gaMeasurementId ||
            STRATIVO_CONFIG.gaMeasurementId.includes("XXXX")
        ) {
            // GA4 is pending configuration with a real Measurement ID
            return;
        }

        if (window.__strativo_ga_initialized) {
            return;
        }
        window.__strativo_ga_initialized = true;

        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(STRATIVO_CONFIG.gaMeasurementId)}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() {
            window.dataLayer.push(arguments);
        }
        window.gtag = gtag;

        gtag("js", new Date());
        gtag("config", STRATIVO_CONFIG.gaMeasurementId, {
            anonymize_ip: true,
            send_page_view: true
        });
    }

    /* ======================================================
       GOOGLE ADSENSE
       ====================================================== */
    function initializeGoogleAdSense() {
        if (
            !STRATIVO_CONFIG.adsenseEnabled ||
            !STRATIVO_CONFIG.adsensePublisherId ||
            STRATIVO_CONFIG.adsensePublisherId.includes("XXXX")
        ) {
            // AdSense is pending configuration with a real Publisher ID
            return;
        }

        if (window.__strativo_adsense_initialized) {
            return;
        }
        window.__strativo_adsense_initialized = true;

        const script = document.createElement("script");
        script.async = true;
        script.crossOrigin = "anonymous";
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(STRATIVO_CONFIG.adsensePublisherId)}`;
        document.head.appendChild(script);

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            // Safe fallback
        }
    }

    /* ======================================================
       PUBLIC API & EDUCATIONAL TRACKING
       ====================================================== */
    window.StrativoAnalytics = {
        config: STRATIVO_CONFIG,

        trackEvent: function (eventName, eventParams) {
            if (typeof window.gtag === "function" && STRATIVO_CONFIG.gaEnabled) {
                window.gtag("event", eventName, eventParams || {});
            }
        },

        trackLessonStart: function (lessonId) {
            this.trackEvent("lesson_start", {
                lesson_id: String(lessonId || ""),
                non_interaction: true
            });
        },

        trackLessonComplete: function (lessonId) {
            this.trackEvent("lesson_complete", {
                lesson_id: String(lessonId || "")
            });
        },

        trackQuizStart: function (quizId) {
            this.trackEvent("quiz_start", {
                quiz_id: String(quizId || ""),
                non_interaction: true
            });
        },

        trackQuizComplete: function (quizId, score) {
            this.trackEvent("quiz_complete", {
                quiz_id: String(quizId || ""),
                score: typeof score === "number" ? score : 0
            });
        }
    };

    window.StrativoAds = {
        config: STRATIVO_CONFIG,
        refreshAds: function () {
            if (STRATIVO_CONFIG.adsenseEnabled && typeof window.adsbygoogle !== "undefined") {
                try {
                    document.querySelectorAll(".adsbygoogle").forEach(function () {
                        (window.adsbygoogle = window.adsbygoogle || []).push({});
                    });
                } catch (e) {
                    // Safe fallback
                }
            }
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            initializeGoogleAnalytics();
            initializeGoogleAdSense();
        });
    } else {
        initializeGoogleAnalytics();
        initializeGoogleAdSense();
    }

})();
