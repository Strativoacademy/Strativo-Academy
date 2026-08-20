/* ==========================================================
   STRATIVO ACADEMY
   Appearance & Accessibility Engine v1.0

   Responsibilities:
   - Theme preference
   - Font size preference
   - High contrast
   - Compact layout
   - Keyboard shortcuts preference
   - Focus / Zen Mode
   - Auto-collapse sidebar preference
   - Hotkey cheat sheet
   - Persistent localStorage settings

   IMPORTANT:
   This file controls appearance preferences only.
========================================================== */

"use strict";

(function () {

    /* ======================================================
       STORAGE KEYS
    ====================================================== */

    const STORAGE_KEYS = {

        theme:
            "strativo_theme",

        fontSize:
            "strativo_font_size",

        highContrast:
            "strativo_high_contrast",

        compactLayout:
            "strativo_compact_layout",

        keyboardShortcuts:
            "strativo_keyboard_shortcuts",

        focusMode:
            "strativo_focus_mode",

        autoCollapseSidebar:
            "strativo_auto_collapse_sidebar"

    };


    /* ======================================================
       DEFAULT SETTINGS
    ====================================================== */

    const DEFAULTS = {

        theme:
            "dark",

        fontSize:
            "default",

        highContrast:
            false,

        compactLayout:
            false,

        keyboardShortcuts:
            true,

        focusMode:
            false,

        autoCollapseSidebar:
            false

    };


    /* ======================================================
       DOM CACHE
    ====================================================== */

    const DOM = {

        themeButtons:
            [],

        fontSizeButtons:
            [],

        highContrastToggle:
            null,

        compactLayoutToggle:
            null,

        keyboardShortcutsToggle:
            null,

        focusModeToggle:
            null,

        autoCollapseSidebarToggle:
            null,

        cheatSheetButton:
            null

    };


    /* ======================================================
       SAFE STORAGE HELPERS
    ====================================================== */

    function getStorage(key, fallback) {

        try {

            const value =
                localStorage.getItem(key);

            return value !== null
                ? value
                : fallback;

        } catch (error) {

            console.warn(
                "Strativo Appearance: Unable to read localStorage.",
                error
            );

            return fallback;

        }

    }


    function setStorage(key, value) {

        try {

            localStorage.setItem(
                key,
                String(value)
            );

            return true;

        } catch (error) {

            console.warn(
                "Strativo Appearance: Unable to save setting.",
                error
            );

            return false;

        }

    }


    /* ======================================================
       VALUE HELPERS
    ====================================================== */

    function getBoolean(
        key,
        fallback
    ) {

        const value =
            getStorage(
                key,
                String(fallback)
            );

        return value === "true";

    }


    function getCurrentSettings() {

        return {

            theme:
                getStorage(
                    STORAGE_KEYS.theme,
                    DEFAULTS.theme
                ),

            fontSize:
                getStorage(
                    STORAGE_KEYS.fontSize,
                    DEFAULTS.fontSize
                ),

            highContrast:
                getBoolean(
                    STORAGE_KEYS.highContrast,
                    DEFAULTS.highContrast
                ),

            compactLayout:
                getBoolean(
                    STORAGE_KEYS.compactLayout,
                    DEFAULTS.compactLayout
                ),

            keyboardShortcuts:
                getBoolean(
                    STORAGE_KEYS.keyboardShortcuts,
                    DEFAULTS.keyboardShortcuts
                ),

            focusMode:
                getBoolean(
                    STORAGE_KEYS.focusMode,
                    DEFAULTS.focusMode
                ),

            autoCollapseSidebar:
                getBoolean(
                    STORAGE_KEYS.autoCollapseSidebar,
                    DEFAULTS.autoCollapseSidebar
                )

        };

    }


    /* ======================================================
       APPLY THEME
    ====================================================== */

    function applyTheme(theme) {

        const html =
            document.documentElement;


        let appliedTheme =
            theme;


        if (
            theme === "system"
        ) {

            const prefersLight =
                window.matchMedia(
                    "(prefers-color-scheme: light)"
                ).matches;

            appliedTheme =
                prefersLight
                    ? "light"
                    : "dark";

        }


        html.dataset.theme =
            appliedTheme;


        html.dataset.themePreference =
            theme;


        updatePressedState(
            DOM.themeButtons,
            "theme",
            theme
        );

    }


    /* ======================================================
       APPLY FONT SIZE
    ====================================================== */

    function applyFontSize(
        fontSize
    ) {

        document.documentElement.dataset.fontSize =
            fontSize;


        updatePressedState(
            DOM.fontSizeButtons,
            "font-size",
            fontSize
        );

    }


    /* ======================================================
       APPLY BOOLEAN SETTINGS
    ====================================================== */

    function applyBooleanSetting(
        attribute,
        value
    ) {

        const html =
            document.documentElement;


        if (value) {

            html.dataset[attribute] =
                "true";

        } else {

            delete html.dataset[
                attribute
            ];

        }

    }


    /* ======================================================
       UPDATE BUTTON PRESSED STATE
    ====================================================== */

    function updatePressedState(
        buttons,
        attribute,
        currentValue
    ) {

        buttons.forEach(
            button => {

                const value =
                    button.dataset[
                        attribute
                    ];


                button.setAttribute(
                    "aria-pressed",
                    value === currentValue
                        ? "true"
                        : "false"
                );

            }
        );

    }


    /* ======================================================
       CACHE DOM
    ====================================================== */

    function cacheDOM() {

        DOM.themeButtons =
            Array.from(
                document.querySelectorAll(
                    "[data-theme]"
                )
            );


        DOM.fontSizeButtons =
            Array.from(
                document.querySelectorAll(
                    "[data-font-size]"
                )
            );


        DOM.highContrastToggle =
            document.getElementById(
                "high-contrast-toggle"
            );


        DOM.compactLayoutToggle =
            document.getElementById(
                "compact-layout-toggle"
            );


        DOM.keyboardShortcutsToggle =
            document.getElementById(
                "keyboard-shortcuts-toggle"
            );


        DOM.focusModeToggle =
            document.getElementById(
                "focus-mode-toggle"
            );


        DOM.autoCollapseSidebarToggle =
            document.getElementById(
                "auto-collapse-sidebar-toggle"
            );


        DOM.cheatSheetButton =
            document.getElementById(
                "open-hotkey-cheat-sheet"
            );

    }


    /* ======================================================
       APPLY ALL SAVED SETTINGS
    ====================================================== */

    function applyAllSettings() {

        const settings =
            getCurrentSettings();


        applyTheme(
            settings.theme
        );


        applyFontSize(
            settings.fontSize
        );


        applyBooleanSetting(
            "highContrast",
            settings.highContrast
        );


        applyBooleanSetting(
            "compactLayout",
            settings.compactLayout
        );


        applyBooleanSetting(
            "focusMode",
            settings.focusMode
        );


        applyBooleanSetting(
            "autoCollapseSidebar",
            settings.autoCollapseSidebar
        );


        if (
            DOM.highContrastToggle
        ) {

            DOM.highContrastToggle.checked =
                settings.highContrast;

        }


        if (
            DOM.compactLayoutToggle
        ) {

            DOM.compactLayoutToggle.checked =
                settings.compactLayout;

        }


        if (
            DOM.keyboardShortcutsToggle
        ) {

            DOM.keyboardShortcutsToggle.checked =
                settings.keyboardShortcuts;

        }


        if (
            DOM.focusModeToggle
        ) {

            DOM.focusModeToggle.checked =
                settings.focusMode;

        }


        if (
            DOM.autoCollapseSidebarToggle
        ) {

            DOM.autoCollapseSidebarToggle.checked =
                settings.autoCollapseSidebar;

        }

    }


    /* ======================================================
       THEME EVENTS
    ====================================================== */

    function setupThemeControls() {

        DOM.themeButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const theme =
                            button.dataset.theme;


                        if (
                            !theme
                        ) {

                            return;

                        }


                        setStorage(
                            STORAGE_KEYS.theme,
                            theme
                        );


                        applyTheme(
                            theme
                        );

                    }
                );

            }
        );

    }


    /* ======================================================
       FONT SIZE EVENTS
    ====================================================== */

    function setupFontSizeControls() {

        DOM.fontSizeButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const fontSize =
                            button.dataset.fontSize;


                        if (
                            !fontSize
                        ) {

                            return;

                        }


                        setStorage(
                            STORAGE_KEYS.fontSize,
                            fontSize
                        );


                        applyFontSize(
                            fontSize
                        );

                    }
                );

            }
        );

    }


    /* ======================================================
       TOGGLE EVENTS
    ====================================================== */

    function setupToggle(
        element,
        storageKey,
        attribute
    ) {

        if (!element) {

            return;

        }


        element.addEventListener(
            "change",
            () => {

                const enabled =
                    element.checked;


                setStorage(
                    storageKey,
                    enabled
                );


                applyBooleanSetting(
                    attribute,
                    enabled
                );

            }
        );

    }


    /* ======================================================
       KEYBOARD SHORTCUTS
    ====================================================== */

    function handleKeyboardShortcut(
        event
    ) {

        const enabled =
            getBoolean(
                STORAGE_KEYS.keyboardShortcuts,
                DEFAULTS.keyboardShortcuts
            );


        if (!enabled) {

            return;

        }


        /*
         * Never trigger shortcuts while
         * typing in form fields.
         */

        const target =
            event.target;


        if (
            target instanceof
                HTMLInputElement ||
            target instanceof
                HTMLTextAreaElement ||
            target instanceof
                HTMLSelectElement ||
            target.isContentEditable
        ) {

            return;

        }


        /*
         * ? = Hotkey Cheat Sheet
         */

        if (
            event.key === "?"
        ) {

            event.preventDefault();

            openHotkeyCheatSheet();

            return;

        }


        /*
         * F = Focus Mode
         */

        if (
            event.key.toLowerCase() === "f"
        ) {

            event.preventDefault();

            toggleFocusMode();

            return;

        }


        /*
         * N = Next Lesson
         */

        if (
            event.key.toLowerCase() === "n"
        ) {

            const nextButton =
                document.querySelector(
                    "[data-action='next-lesson'], #next-lesson, .next-lesson-button"
                );


            if (nextButton) {

                event.preventDefault();

                nextButton.click();

            }

            return;

        }


        /*
         * P = Previous Lesson
         */

        if (
            event.key.toLowerCase() === "p"
        ) {

            const previousButton =
                document.querySelector(
                    "[data-action='previous-lesson'], #previous-lesson, .previous-lesson-button"
                );


            if (previousButton) {

                event.preventDefault();

                previousButton.click();

            }

        }

    }


    /* ======================================================
       FOCUS MODE
    ====================================================== */

    function toggleFocusMode() {

        if (
            !DOM.focusModeToggle
        ) {

            return;

        }


        DOM.focusModeToggle.checked =
            !DOM.focusModeToggle.checked;


        DOM.focusModeToggle.dispatchEvent(
            new Event(
                "change",
                {
                    bubbles: true
                }
            )
        );

    }


    /* ======================================================
       HOTKEY CHEAT SHEET
    ====================================================== */

    function openHotkeyCheatSheet() {

        const existing =
            document.getElementById(
                "strativo-hotkey-modal"
            );


        if (existing) {

            existing.remove();

            return;

        }


        const modal =
            document.createElement(
                "div"
            );


        modal.id =
            "strativo-hotkey-modal";


        modal.className =
            "strativo-hotkey-modal";


        modal.innerHTML = `

            <div
                class="strativo-hotkey-backdrop"
                data-hotkey-close="true"
            ></div>


            <div
                class="strativo-hotkey-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="strativo-hotkey-title"
            >

                <div class="strativo-hotkey-header">

                    <div>

                        <span class="settings-section-label">
                            KEYBOARD
                        </span>

                        <h2 id="strativo-hotkey-title">
                            Hotkey Cheat Sheet
                        </h2>

                    </div>


                    <button
                        type="button"
                        class="strativo-hotkey-close"
                        data-hotkey-close="true"
                        aria-label="Close shortcut guide"
                    >

                        <i
                            class="fas fa-xmark"
                            aria-hidden="true"
                        ></i>

                    </button>

                </div>


                <div class="strativo-hotkey-list">

                    <div class="strativo-hotkey-row">

                        <span>
                            Next Lesson
                        </span>

                        <kbd>N</kbd>

                    </div>


                    <div class="strativo-hotkey-row">

                        <span>
                            Previous Lesson
                        </span>

                        <kbd>P</kbd>

                    </div>


                    <div class="strativo-hotkey-row">

                        <span>
                            Focus Mode
                        </span>

                        <kbd>F</kbd>

                    </div>


                    <div class="strativo-hotkey-row">

                        <span>
                            Hotkey Cheat Sheet
                        </span>

                        <kbd>?</kbd>

                    </div>


                    <div class="strativo-hotkey-row">

                        <span>
                            Space
                        </span>

                        <kbd>Space</kbd>

                    </div>

                </div>


                <p class="strativo-hotkey-note">

                    Keyboard shortcuts are disabled while
                    typing in input fields.

                </p>

            </div>

        `;


        document.body.appendChild(
            modal
        );


        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target.closest(
                        "[data-hotkey-close='true']"
                    )
                ) {

                    modal.remove();

                }

            }
        );

    }


    /* ======================================================
       CHEAT SHEET BUTTON
    ====================================================== */

    function setupCheatSheet() {

        if (
            !DOM.cheatSheetButton
        ) {

            return;

        }


        DOM.cheatSheetButton.addEventListener(
            "click",
            openHotkeyCheatSheet
        );

    }


    /* ======================================================
       SYSTEM THEME CHANGE
    ====================================================== */

    function watchSystemTheme() {

        const mediaQuery =
            window.matchMedia(
                "(prefers-color-scheme: light)"
            );


        const updateSystemTheme =
            () => {

                const savedTheme =
                    getStorage(
                        STORAGE_KEYS.theme,
                        DEFAULTS.theme
                    );


                if (
                    savedTheme === "system"
                ) {

                    applyTheme(
                        "system"
                    );

                }

            };


        if (
            typeof mediaQuery.addEventListener ===
            "function"
        ) {

            mediaQuery.addEventListener(
                "change",
                updateSystemTheme
            );

        } else if (
            typeof mediaQuery.addListener ===
            "function"
        ) {

            mediaQuery.addListener(
                updateSystemTheme
            );

        }

    }


    /* ======================================================
       INITIALIZE
    ====================================================== */

    function initializeAppearance() {

        cacheDOM();

        applyAllSettings();

        setupThemeControls();

        setupFontSizeControls();


        setupToggle(
            DOM.highContrastToggle,
            STORAGE_KEYS.highContrast,
            "highContrast"
        );


        setupToggle(
            DOM.compactLayoutToggle,
            STORAGE_KEYS.compactLayout,
            "compactLayout"
        );


        setupToggle(
            DOM.keyboardShortcutsToggle,
            STORAGE_KEYS.keyboardShortcuts,
            "keyboardShortcuts"
        );


        setupToggle(
            DOM.focusModeToggle,
            STORAGE_KEYS.focusMode,
            "focusMode"
        );


        setupToggle(
            DOM.autoCollapseSidebarToggle,
            STORAGE_KEYS.autoCollapseSidebar,
            "autoCollapseSidebar"
        );


        setupCheatSheet();

        watchSystemTheme();


        document.addEventListener(
            "keydown",
            handleKeyboardShortcut
        );


        console.info(
            "Strativo Academy: Appearance Engine initialized."
        );

    }


    /* ======================================================
       PUBLIC API
    ====================================================== */

    window.StrativoAppearance = {

        getSettings:
            getCurrentSettings,

        apply:
            applyAllSettings,

        openHotkeyCheatSheet:
            openHotkeyCheatSheet,

        toggleFocusMode:
            toggleFocusMode

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
            initializeAppearance
        );

    } else {

        initializeAppearance();

    }

})();