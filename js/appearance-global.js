/* ==========================================================
   STRATIVO ACADEMY
   Global Appearance Loader v1.0

   Purpose:
   - Apply saved Appearance settings before page interaction
   - Make theme preferences global across the platform
   - Apply font size
   - Apply high contrast
   - Apply compact layout
   - Apply Focus Mode preference

   This file does NOT create the Appearance settings UI.
   That remains the responsibility of appearance.js.
========================================================== */

"use strict";

(function () {

    const STORAGE_KEYS = {
        theme: "strativo_theme",
        fontSize: "strativo_font_size",
        highContrast: "strativo_high_contrast",
        compactLayout: "strativo_compact_layout",
        focusMode: "strativo_focus_mode",
        autoCollapseSidebar: "strativo_auto_collapse_sidebar"
    };


    const DEFAULTS = {
        theme: "dark",
        fontSize: "default",
        highContrast: false,
        compactLayout: false,
        focusMode: false,
        autoCollapseSidebar: false
    };


    /* ======================================================
       SAFE STORAGE
    ====================================================== */

    function getValue(key, fallback) {

        try {

            const value =
                localStorage.getItem(key);

            return value !== null
                ? value
                : fallback;

        } catch (error) {

            return fallback;

        }

    }


    function getBoolean(key, fallback) {

        return getValue(
            key,
            String(fallback)
        ) === "true";

    }


    /* ======================================================
       SYSTEM THEME
    ====================================================== */

    function resolveTheme(theme) {

        if (theme !== "system") {

            return theme;

        }


        try {

            return window.matchMedia(
                "(prefers-color-scheme: light)"
            ).matches
                ? "light"
                : "dark";

        } catch (error) {

            return "dark";

        }

    }


    /* ======================================================
       APPLY GLOBAL SETTINGS
    ====================================================== */

    function applyGlobalAppearance() {

        const html =
            document.documentElement;


        const theme =
            getValue(
                STORAGE_KEYS.theme,
                DEFAULTS.theme
            );


        const fontSize =
            getValue(
                STORAGE_KEYS.fontSize,
                DEFAULTS.fontSize
            );


        const highContrast =
            getBoolean(
                STORAGE_KEYS.highContrast,
                DEFAULTS.highContrast
            );


        const compactLayout =
            getBoolean(
                STORAGE_KEYS.compactLayout,
                DEFAULTS.compactLayout
            );


        const focusMode =
            getBoolean(
                STORAGE_KEYS.focusMode,
                DEFAULTS.focusMode
            );


        const autoCollapseSidebar =
            getBoolean(
                STORAGE_KEYS.autoCollapseSidebar,
                DEFAULTS.autoCollapseSidebar
            );


        /* Theme */

        html.dataset.theme =
            resolveTheme(theme);


        html.dataset.themePreference =
            theme;


        /* Font Size */

        html.dataset.fontSize =
            fontSize;


        /* Accessibility */

        if (highContrast) {

            html.dataset.highContrast =
                "true";

        } else {

            delete html.dataset.highContrast;

        }


        /* Compact Layout */

        if (compactLayout) {

            html.dataset.compactLayout =
                "true";

        } else {

            delete html.dataset.compactLayout;

        }


        /* Focus Mode */

        if (focusMode) {

            html.dataset.focusMode =
                "true";

        } else {

            delete html.dataset.focusMode;

        }


        /* Sidebar Preference */

        if (autoCollapseSidebar) {

            html.dataset.autoCollapseSidebar =
                "true";

        } else {

            delete html.dataset.autoCollapseSidebar;

        }

    }


    /* ======================================================
       SYSTEM THEME LISTENER
    ====================================================== */

    function watchSystemTheme() {

        if (
            !window.matchMedia
        ) {

            return;

        }


        const mediaQuery =
            window.matchMedia(
                "(prefers-color-scheme: light)"
            );


        const update =
            function () {

                const savedTheme =
                    getValue(
                        STORAGE_KEYS.theme,
                        DEFAULTS.theme
                    );


                if (
                    savedTheme === "system"
                ) {

                    applyGlobalAppearance();

                }

            };


        if (
            typeof mediaQuery.addEventListener ===
            "function"
        ) {

            mediaQuery.addEventListener(
                "change",
                update
            );

        } else if (
            typeof mediaQuery.addListener ===
            "function"
        ) {

            mediaQuery.addListener(
                update
            );

        }

    }


    /* ======================================================
       PUBLIC API
    ====================================================== */

    window.StrativoGlobalAppearance = {

        apply:
            applyGlobalAppearance,

        getTheme:
            function () {

                return getValue(
                    STORAGE_KEYS.theme,
                    DEFAULTS.theme
                );

            }

    };


    /* ======================================================
       APPLY IMMEDIATELY
    ====================================================== */

    applyGlobalAppearance();

    watchSystemTheme();

})();