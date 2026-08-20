/* ==========================================================================
   STRATIVO ACADEMY
   GLOBAL HEADER CONTROLLER
   Version 3.0
   ========================================================================== */

"use strict";

(function () {


    /* ======================================================================
       HELPERS
       ====================================================================== */

    function getRootPath() {

        const path =
            (window.location.pathname || "")
                .replace(/\\/g, "/")
                .toLowerCase();

        if (
            path.includes("/lessons/") ||
            path.includes("/notes/") ||
            path.includes("/season-exercise/") ||
            path.includes("/quizzes/")
        ) {
            return "../../";
        }

        if (
            path.includes("/dashboard/") ||
            path.includes("/legal/") ||
            path.includes("/settings/") ||
            path.includes("/profile/") ||
            path.includes("/auth/") ||
            path.includes("/community/") ||
            path.includes("/modules/") ||
            path.includes("/tools/") ||
            path.includes("/games/")
        ) {
            return "../";
        }

        const parts =
            path.split("/").filter(Boolean);

        const lastSegment =
            parts[parts.length - 1] || "";

        const hasFileExtension =
            /\.[a-z0-9]+$/i.test(
                lastSegment
            );

        const depth = hasFileExtension
            ? parts.length - 1
            : parts.length;

        if (depth > 0 && depth <= 3) {
            return "../".repeat(depth);
        }

        return "./";

    }


    function goTo(path) {

        if (!path) {

            return;

        }


        /*
         * If the path is already an absolute URL,
         * use it directly.
         */

        if (
            /^https?:\/\//i.test(path) ||
            path.startsWith("/")
        ) {

            window.location.href = path;

            return;

        }


        window.location.href =
            `${getRootPath()}${path}`;

    }


    /* ======================================================================
       ROUTE RESOLUTION
       ====================================================================== */

    function getRoute(routeName) {

        if (
            window.StrativoRoutes &&
            routeName
        ) {

            /*
             * Direct route:
             *
             * home
             * beginner
             * dashboard
             * settings
             * profile
             */

            if (
                typeof window.StrativoRoutes[routeName] === "string"
            ) {

                return window.StrativoRoutes[routeName];

            }

        }


        /*
         * Nested legal routes.
         */

        if (
            window.StrativoRoutes &&
            window.StrativoRoutes.legal &&
            typeof window.StrativoRoutes.legal[routeName] === "string"
        ) {

            return window.StrativoRoutes.legal[routeName];

        }


        return null;

    }


    /* ======================================================================
       NAVIGATION ROUTES
       ====================================================================== */

    const NAVIGATION_ROUTES = {

        /*
         * Main pages
         */

        home: function () {

            return getRoute("home") ||
                "index.html";

        },


        beginner: function () {

            return getRoute("beginner") ||
                "beginner.html";

        },


        dashboard: function () {

            return getRoute("dashboard") ||
                "dashboard/dashboard.html";

        },


        settings: function () {

            return getRoute("settings") ||
                "settings/settings.html";

        },


        profile: function () {

            return getRoute("profile") ||
                "profile/profile.html";

        },


        /*
         * Homepage sections
         */

        courses: function () {

            return "index.html#courses";

        },


        "why-us": function () {

            return "index.html#why-choose";

        },


        "trading-tools": function () {

            return "index.html#market-intelligence";

        },


        "live-charts": function () {

            /*
             * The current homepage contains the trading/practice
             * chart area. We route Live Charts there for now.
             */

            return "index.html#practice";

        },


        contact: function () {

            return "index.html#contact";

        },


        /*
         * Future course tiers
         *
         * These sections do not currently have separate pages.
         * They therefore return to the course area.
         */

        intermediate: function () {

            return "index.html#courses";

        },


        advanced: function () {

            return "index.html#courses";

        }

    };


    function resolveNavigationRoute(routeName) {

        if (
            NAVIGATION_ROUTES[routeName] &&
            typeof NAVIGATION_ROUTES[routeName] === "function"
        ) {

            return NAVIGATION_ROUTES[routeName]();

        }


        return getRoute(routeName);

    }


    /* ======================================================================
       NAVIGATION
       ====================================================================== */

    function initializeNavigation() {

        const navigationLinks =
            document.querySelectorAll(
                "[data-route]"
            );


        if (!navigationLinks.length) {

            return;

        }


        navigationLinks.forEach(
            function (link) {

                /*
                 * Prevent duplicate event listeners.
                 */

                if (
                    link.dataset.routeInitialized === "true"
                ) {

                    return;

                }


                link.dataset.routeInitialized =
                    "true";

                const resolvedRoute =
                    resolveNavigationRoute(link.dataset.route);

                if (resolvedRoute) {

                    link.setAttribute(
                        "href",
                        `${getRootPath()}${resolvedRoute}`
                    );

                }


                link.addEventListener(
                    "click",
                    function (event) {

                        const routeName =
                            this.dataset.route;


                        if (!routeName) {

                            return;

                        }


                        const route =
                            resolveNavigationRoute(
                                routeName
                            );


                        /*
                         * No known route.
                         */

                        if (!route) {

                            console.warn(
                                `Strativo Academy: Route "${routeName}" is not defined.`
                            );

                            return;

                        }


                        event.preventDefault();


                        /*
                         * Close mobile menu if present.
                         */

                        closeMobileMenu();


                        /*
                         * Close course dropdown if open.
                         */

                        closeAllDropdowns();


                        /*
                         * Navigate.
                         */

                        goTo(route);

                    }
                );

            }
        );

    }


    /* ======================================================================
       MOBILE MENU
       ====================================================================== */

    function initializeMobileMenu() {

        const toggle =
            document.getElementById(
                "mobile-menu-toggle"
            );


        if (!toggle) {

            return;

        }


        /*
         * Prevent duplicate initialization.
         */

        if (
            toggle.dataset.menuInitialized === "true"
        ) {

            return;

        }


        toggle.dataset.menuInitialized =
            "true";


        toggle.addEventListener(
            "click",
            function () {

                if (
                    document.body.classList.contains(
                        "mobile-menu-open"
                    )
                ) {

                    closeMobileMenu();

                } else {

                    openMobileMenu();

                }

            }
        );


        /*
         * Close menu when a navigation link is clicked.
         */

        document.querySelectorAll(
            ".header-nav-link:not(.courses-dropdown-trigger), .dropdown-menu a"
        ).forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        closeMobileMenu();

                    }
                );

            }
        );


        /*
         * Escape closes mobile menu.
         */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape"
                ) {

                    closeMobileMenu();

                }

            }
        );

    }

        /* ======================================================================
   SETTINGS
   ====================================================================== */
    
    function updateMobileMenuState(isOpen) {

        const toggle =
            document.getElementById(
                "mobile-menu-toggle"
            );


        if (!toggle) return;

        document.body.classList.toggle(
            "mobile-menu-open",
            isOpen
        );

        toggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        toggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

        const icon = toggle.querySelector("i");

        if (icon) {

            icon.classList.toggle("fa-bars", !isOpen);
            icon.classList.toggle("fa-xmark", isOpen);

        }

    }


    function openMobileMenu() {

        updateMobileMenuState(true);

    }


    function closeMobileMenu() {

        const toggle =
            document.getElementById(
                "mobile-menu-toggle"
            );


        updateMobileMenuState(false);

    }


    /* ======================================================================
       DROPDOWN MENU
       ====================================================================== */

    function initializeDropdowns() {

        const dropdownItems =
            document.querySelectorAll(
                ".header-nav-item.dropdown"
            );


        if (!dropdownItems.length) {

            return;

        }


        dropdownItems.forEach(
            function (dropdown) {

                if (
                    dropdown.dataset.dropdownInitialized === "true"
                ) {

                    return;

                }


                dropdown.dataset.dropdownInitialized =
                    "true";


                const trigger =
                    dropdown.querySelector(
                        ".header-nav-link"
                    );


                if (!trigger) {

                    return;

                }


                trigger.addEventListener(
                    "click",
                    function (event) {

                        /*
                         * Courses is a dropdown toggle button.
                         * Clicking it toggles open/close state.
                         */

                        event.preventDefault();
                        event.stopPropagation();


                        const isOpen =
                            dropdown.classList.contains(
                                "dropdown-open"
                            );


                        closeAllDropdowns();


                        if (!isOpen) {

                            dropdown.classList.add(
                                "dropdown-open"
                            );


                            trigger.setAttribute(
                                "aria-expanded",
                                "true"
                            );

                        }

                    }
                );

            }
        );


        if (
            document.body.dataset.dropdownListenersInitialized !== "true"
        ) {

            document.body.dataset.dropdownListenersInitialized =
                "true";

            document.addEventListener(
                "click",
                function (event) {

                    if (
                        !event.target.closest(
                            ".header-nav-item.dropdown"
                        )
                    ) {

                        closeAllDropdowns();

                    }

                }
            );

            document.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Escape"
                    ) {

                        const openDropdowns =
                            document.querySelectorAll(
                                ".header-nav-item.dropdown.dropdown-open"
                            );

                        if (openDropdowns.length > 0) {

                            closeAllDropdowns();

                            const firstTrigger =
                                openDropdowns[0].querySelector(
                                    ".header-nav-link"
                                );

                            if (firstTrigger) {

                                firstTrigger.focus();

                            }

                        }

                    }

                }
            );

        }

    }


    function closeAllDropdowns() {

        document.querySelectorAll(
            ".header-nav-item.dropdown"
        ).forEach(
            function (dropdown) {

                dropdown.classList.remove(
                    "dropdown-open"
                );


                const trigger =
                    dropdown.querySelector(
                        ".header-nav-link"
                    );


                if (trigger) {

                    trigger.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }
        );

    }


    /* ======================================================================
       SEARCH DATABASE
       ====================================================================== */

    const SEARCH_DATA = [

        /* ================================================================
           COURSES
           ================================================================ */

        {
            id: "beginner",
            title: "Beginner Forex Course",
            description:
                "Start learning Forex from the fundamentals.",
            type: "Course",
            url:
                window.StrativoRoutes &&
                window.StrativoRoutes.beginner
                    ? window.StrativoRoutes.beginner
                    : "beginner.html"
        },


        /* ================================================================
           MODULE 1 — FOREX BASICS
           ================================================================ */

        {
            id: "lesson1",
            title: "Lesson 1 — What is Forex?",
            description:
                "Learn the fundamentals of the Forex market.",
            type: "Lesson • Module 1",
            url:
                window.StrativoRoutes.module1.lesson1
        },


        {
            id: "lesson2",
            title: "Lesson 2 — Currency Pairs & Exchange Rates",
            description:
                "Understand major, minor and exotic currency pairs.",
            type: "Lesson • Module 1",
            url:
                window.StrativoRoutes.module1.lesson2
        },


        {
            id: "lesson3",
            title: "Lesson 3 — Market Sessions & Trading Hours",
            description:
                "Learn when the major Forex sessions operate.",
            type: "Lesson • Module 1",
            url:
                window.StrativoRoutes.module1.lesson3
        },


        {
            id: "lesson4",
            title: "Lesson 4 — Who Trades Forex?",
            description:
                "Learn about the participants in the Forex market.",
            type: "Lesson • Module 1",
            url:
                window.StrativoRoutes.module1.lesson4
        },


        {
            id: "lesson5",
            title: "Lesson 5 — What is a Pip?",
            description:
                "Understand pips and Forex price movement.",
            type: "Lesson • Module 1",
            url:
                window.StrativoRoutes.module1.lesson5
        },


        {
            id: "lesson6",
            title: "Lesson 6 — Lot Sizes & Position Sizing",
            description:
                "Learn lot sizes and position sizing in Forex.",
            type: "Lesson • Module 1",
            url:
                window.StrativoRoutes.module1.lesson6
        },


        {
            id: "lesson7",
            title: "Lesson 7 — Leverage & Margin Explained",
            description:
                "Understand leverage, margin and trading risk.",
            type: "Lesson • Module 1",
            url:
                window.StrativoRoutes.module1.lesson7
        },


        {
            id: "lesson8",
            title: "Lesson 8 — Bid, Ask & The Spread",
            description:
                "Understand bid price, ask price and the spread.",
            type: "Lesson • Module 1",
            url:
                window.StrativoRoutes.module1.lesson8
        },


        {
            id: "lesson9",
            title: "Lesson 9 — Types of Orders",
            description:
                "Learn the main Forex order types.",
            type: "Lesson • Module 1",
            url:
                window.StrativoRoutes.module1.lesson9
        },


        {
            id: "lesson10",
            title: "Lesson 10 — Introduction to MetaTrader",
            description:
                "Learn the basics of using MetaTrader.",
            type: "Lesson • Module 1",
            url:
                window.StrativoRoutes.module1.lesson10
        },


        /* ================================================================
           PLATFORM
           ================================================================ */

        {
            id: "dashboard",
            title: "Dashboard",
            description:
                "Open your Strativo Academy student dashboard.",
            type: "Platform",
            url:
                window.StrativoRoutes.dashboard
        },


        {
            id: "tools",
            title: "Trading Tools",
            description:
                "Explore the Strativo Academy trading tools.",
            type: "Tools",
            url:
                "index.html#market-intelligence"
        },


        {
            id: "whyus",
            title: "Why Choose Strativo Academy?",
            description:
                "Learn about the Strativo Academy learning approach.",
            type: "Information",
            url:
                "index.html#why-choose"
        },


        {
            id: "contact",
            title: "Contact",
            description:
                "Get in touch with Strativo Academy.",
            type: "Contact",
            url:
                "index.html#contact"
        }

    ];


    /* ======================================================================
       SEARCH
       ====================================================================== */

    function initializeSearch() {

        const searchButton =
            document.getElementById(
                "header-search-button"
            );


        if (!searchButton) {

            return;

        }


        /*
         * Prevent duplicate initialization.
         */

        if (
            searchButton.dataset.searchInitialized === "true"
        ) {

            return;

        }


        searchButton.dataset.searchInitialized =
            "true";


        function openSearch() {

            /*
             * Don't create more than one search panel.
             */

            const existing =
                document.getElementById(
                    "strativo-search-panel"
                );


            if (existing) {

                const input =
                    existing.querySelector(
                        "#strativo-search-input"
                    );


                if (input) {

                    input.focus();

                }


                return;

            }


            /* ==========================================================
               SEARCH PANEL
               ========================================================== */

            const panel =
                document.createElement("div");


            panel.id =
                "strativo-search-panel";


            panel.className =
                "strativo-search-panel";


            panel.innerHTML = `

                <div
                    class="strativo-search-panel-inner"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="strativo-search-title"
                >

                    <div class="strativo-search-panel-header">

                        <div>

                            <span class="strativo-search-eyebrow">
                                STRATIVO ACADEMY
                            </span>

                            <h2 id="strativo-search-title">
                                Search Academy
                            </h2>

                        </div>


                        <button
                            type="button"
                            class="strativo-search-close"
                            id="strativo-search-close"
                            aria-label="Close search"
                        >

                            <i
                                class="fas fa-times"
                                aria-hidden="true"
                            ></i>

                        </button>

                    </div>


                    <div class="strativo-search-input-wrapper">

                        <i
                            class="fas fa-search"
                            aria-hidden="true"
                        ></i>

                        <input
                            type="search"
                            id="strativo-search-input"
                            placeholder="Search lessons, courses, tools..."
                            autocomplete="off"
                        >

                    </div>


                    <div
                        class="strativo-search-results"
                        id="strativo-search-results"
                    >

                        <div class="strativo-search-empty">

                            <i
                                class="fas fa-compass"
                                aria-hidden="true"
                            ></i>

                            <strong>
                                Search Strativo Academy
                            </strong>

                            <span>
                                Find lessons, courses and learning resources.
                            </span>

                        </div>

                    </div>

                </div>

            `;


            document.body.appendChild(
                panel
            );


            /* ==========================================================
               ELEMENTS
               ========================================================== */

            const input =
                document.getElementById(
                    "strativo-search-input"
                );


            const results =
                document.getElementById(
                    "strativo-search-results"
                );


            const closeButton =
                document.getElementById(
                    "strativo-search-close"
                );


            /* ==========================================================
               RENDER RESULTS
               ========================================================== */

            function renderResults(query) {

                const value =
                    query
                        .trim()
                        .toLowerCase();


                if (!value) {

                    results.innerHTML = `

                        <div class="strativo-search-empty">

                            <i
                                class="fas fa-compass"
                                aria-hidden="true"
                            ></i>

                            <strong>
                                Search Strativo Academy
                            </strong>

                            <span>
                                Find lessons, courses and learning resources.
                            </span>

                        </div>

                    `;

                    return;

                }


                const matches =
                    SEARCH_DATA.filter(
                        function (item) {

                            const searchableText = [

                                item.id || "",
                                item.title || "",
                                item.description || "",
                                item.type || ""

                            ]
                                .join(" ")
                                .toLowerCase();


                            const normalizedSearch =
                                value
                                    .replace(/\s+/g, "")
                                    .toLowerCase();


                            const normalizedText =
                                searchableText
                                    .replace(/\s+/g, "");


                            return (
                                searchableText.includes(value) ||
                                normalizedText.includes(
                                    normalizedSearch
                                )
                            );

                        }
                    );


                if (!matches.length) {

                    results.innerHTML = `

                        <div class="strativo-search-empty">

                            <i
                                class="fas fa-search"
                                aria-hidden="true"
                            ></i>

                            <strong>
                                No results found
                            </strong>

                            <span>
                                Try another lesson, course or keyword.
                            </span>

                        </div>

                    `;

                    return;

                }


                results.innerHTML =
                    matches
                        .map(
                            function (item) {

                                return `

                                    <button
                                        type="button"
                                        class="strativo-search-result"
                                        data-search-url="${item.url}"
                                    >

                                        <span class="strativo-search-result-icon">

                                            <i class="fas ${
                                                item.type.includes("Course")
                                                    ? "fa-book"
                                                    : item.type.includes("Lesson")
                                                    ? "fa-graduation-cap"
                                                    : item.type.includes("Tools")
                                                    ? "fa-toolbox"
                                                    : item.type.includes("Platform")
                                                    ? "fa-chart-line"
                                                    : "fa-compass"
                                            }"></i>

                                        </span>


                                        <span class="strativo-search-result-content">

                                            <strong>
                                                ${item.title}
                                            </strong>

                                            <small>
                                                ${item.description}
                                            </small>

                                        </span>


                                        <span class="strativo-search-result-type">
                                            ${item.type}
                                        </span>

                                    </button>

                                `;

                            }
                        )
                        .join("");


                results
                    .querySelectorAll(
                        ".strativo-search-result"
                    )
                    .forEach(
                        function (resultButton) {

                            resultButton.addEventListener(
                                "click",
                                function () {

                                    const route =
                                        this.dataset.searchUrl;


                                    if (!route) {

                                        return;

                                    }


                                    goTo(route);

                                }
                            );

                        }
                    );

            }


            /* ==========================================================
               INPUT
               ========================================================== */

            input.addEventListener(
                "input",
                function () {

                    renderResults(
                        this.value
                    );

                }
            );


            /* ==========================================================
               ENTER KEY
               ========================================================== */

            input.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();


                        const firstResult =
                            results.querySelector(
                                ".strativo-search-result"
                            );


                        if (firstResult) {

                            firstResult.click();

                        }

                    }

                }
            );


            /* ==========================================================
               CLOSE BUTTON
               ========================================================== */

            closeButton.addEventListener(
                "click",
                closeSearch
            );


            /* ==========================================================
               CLICK OUTSIDE
               ========================================================== */

            panel.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target === panel
                    ) {

                        closeSearch();

                    }

                }
            );


            /* ==========================================================
               ESCAPE KEY
               ========================================================== */

            function handleEscape(event) {

                if (
                    event.key === "Escape"
                ) {

                    closeSearch();

                }

            }


            document.addEventListener(
                "keydown",
                handleEscape
            );


            /* ==========================================================
               CLOSE
               ========================================================== */

            function closeSearch() {

                document.removeEventListener(
                    "keydown",
                    handleEscape
                );


                panel.remove();

            }


            /* ==========================================================
               FOCUS
               ========================================================== */

            requestAnimationFrame(
                function () {

                    input.focus();

                }
            );

        }


        /* ==============================================================
           SEARCH BUTTON CLICK
           ============================================================== */

        searchButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                openSearch();

            }
        );

    }


    /* ======================================================================
       STUDENT MENU
       ====================================================================== */

    function initializeStudentMenu() {

        const userButton =
            document.getElementById(
                "header-user-button"
            );


        const userMenu =
            document.getElementById(
                "header-user-menu"
            );


        const profileButton =
            document.getElementById(
                "header-profile-button"
            );


        const settingsButton =
            document.getElementById(
                "header-menu-settings-button"
            );


        const logoutButton =
            document.getElementById(
                "header-logout-button"
            );


        if (!userButton || !userMenu) {

            return;

        }


        if (
            userButton.dataset.menuInitialized === "true"
        ) {

            return;

        }


        userButton.dataset.menuInitialized =
            "true";


        function closeMenu() {

            userMenu.hidden =
                true;


            userButton.setAttribute(
                "aria-expanded",
                "false"
            );


            userMenu.setAttribute(
                "aria-hidden",
                "true"
            );

        }


        function openMenu() {

            if (
                window.StrativoNotifications &&
                typeof window.StrativoNotifications.close === "function"
            ) {

                window.StrativoNotifications.close();

            }

            userMenu.hidden =
                false;


            userButton.setAttribute(
                "aria-expanded",
                "true"
            );


            userMenu.setAttribute(
                "aria-hidden",
                "false"
            );

            const firstMenuItem =
                userMenu.querySelector(
                    '[role="menuitem"]'
                );

            if (firstMenuItem) {

                firstMenuItem.focus();

            }

        }


        userButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                if (userMenu.hidden) {

                    openMenu();

                } else {

                    closeMenu();

                }

            }
        );


        if (profileButton) {

            profileButton.addEventListener(
                "click",
                function () {

                    closeMenu();

                    openProfile();

                }
            );

        }


        if (settingsButton) {

            settingsButton.addEventListener(
                "click",
                function () {

                    closeMenu();

                    openSettings();

                }
            );

        }


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                function () {

                    closeMenu();


                    /*
                     * No backend authentication system is being
                     * changed here.
                     */

                    console.info(
                        "Strativo Academy: Logout requested."
                    );

                }
            );

        }


        document.addEventListener(
            "click",
            function (event) {

                if (
                    !userMenu.contains(
                        event.target
                    ) &&
                    !userButton.contains(
                        event.target
                    )
                ) {

                    closeMenu();

                }

            }

        );


        document.addEventListener(
            "keydown",
            function (event) {

                const menuItems = Array.from(
                    userMenu.querySelectorAll(
                        '[role="menuitem"]'
                    )
                );

                if (
                    !userMenu.hidden &&
                    (
                        event.key === "ArrowDown" ||
                        event.key === "ArrowUp"
                    ) &&
                    menuItems.length
                ) {

                    event.preventDefault();

                    const activeIndex =
                        menuItems.indexOf(document.activeElement);

                    const currentIndex =
                        activeIndex >= 0
                            ? activeIndex
                            : event.key === "ArrowDown"
                                ? -1
                                : 0;

                    const offset =
                        event.key === "ArrowDown" ? 1 : -1;

                    const nextIndex =
                        (currentIndex + offset + menuItems.length) %
                        menuItems.length;

                    menuItems[nextIndex].focus();

                    return;

                }

                if (
                    event.key === "Escape"
                ) {

                    const wasOpen = !userMenu.hidden;

                    closeMenu();

                    if (wasOpen) {

                        userButton.focus();

                    }

                }

            }
        );

    }


    /* ======================================================================
       SETTINGS
       ====================================================================== */

    function openSettings() {

        const route =
            resolveNavigationRoute(
                "settings"
            );


        if (route) {

            goTo(route);

        }

    }


    /* ======================================================================
       PROFILE
       ====================================================================== */

    function openProfile() {

        const route =
            resolveNavigationRoute(
                "profile"
            );


        if (route) {

            goTo(route);

        }

    }


    /* ======================================================================
       SETTINGS BUTTON
       ====================================================================== */

    function initializeSettingsButton() {

        const button =
            document.getElementById(
                "header-settings-button"
            );


        if (!button) {

            return;

        }


        if (
            button.dataset.settingsInitialized === "true"
        ) {

            return;

        }


        button.dataset.settingsInitialized =
            "true";


        button.addEventListener(
            "click",
            function () {

                openSettings();

            }
        );

    }


    /* ======================================================================
       NOTIFICATION BUTTON
       ====================================================================== */

    function initializeNotificationButton() {

        const button =
            document.getElementById(
                "header-notification-button"
            );


        if (!button) {

            return;

        }


        if (
            button.dataset.notificationInitialized === "true"
        ) {

            return;

        }


        button.dataset.notificationInitialized =
            "true";


        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                /*
                 * Use the notification controller's TOGGLE API.
                 *
                 * First click  → open notification panel.
                 * Second click → close notification panel.
                 */

                if (
                    window.StrativoNotifications &&
                    typeof window.StrativoNotifications.toggle === "function"
                ) {

                    window.StrativoNotifications.toggle();

                    return;

                }


                /*
                 * Notification controller is not available.
                 */

                console.info(
                    "Strativo Academy: Notification controller is not available."
                );

            }
        );

    }


    /* ======================================================================
       AI ASSISTANCE BUTTON
       ====================================================================== */

    function initializeAIButton() {

        const button =
            document.getElementById(
                "header-ai-assistance-button"
            );


        if (!button) {

            return;

        }


        if (
            button.dataset.aiInitialized === "true"
        ) {

            return;

        }


        button.dataset.aiInitialized =
            "true";


        button.addEventListener(
            "click",
            function () {

                /*
                 * AI Assistance is not connected to a dedicated
                 * page/system yet.
                 *
                 * Do not create a fake route.
                 */

                console.info(
                    "Strativo Academy: AI Assistance requested."
                );

            }
        );

    }


    /* ======================================================================
       ASSET PATHS
       ====================================================================== */

    function initializeAssetPaths() {

        document.querySelectorAll(
            "[data-asset]"
        ).forEach(
            function (asset) {

                asset.setAttribute(
                    "src",
                    `${getRootPath()}${asset.dataset.asset}`
                );

            }
        );

    }


    /* ======================================================================
       MAIN INITIALIZATION
       ====================================================================== */

    function initializeHeader() {

        /*
         * The header component may load before the navbar component.
         * Navigation is therefore initialized both here and after
         * the navbar component loads.
         */

        initializeAssetPaths();

        initializeSearch();

        initializeStudentMenu();

        initializeSettingsButton();

        initializeNotificationButton();

        initializeAIButton();

        initializeMobileMenu();

        initializeDropdowns();

        initializeNavigation();


        console.info(
            "Strativo Academy: Global header initialized."
        );

    }


    /* ======================================================================
       NAVBAR COMPONENT SUPPORT
       ====================================================================== */

    document.addEventListener(
        "strativo:component-loaded",
        function (event) {

            if (
                !event.detail
            ) {

                return;

            }


            /*
             * Header loaded.
             */

            if (
                event.detail.name === "header"
            ) {

                initializeHeader();
            initializeAssetPaths();

            }


            /*
             * Navbar loaded after header.
             *
             * This is important because navbar.html is mounted
             * inside header.html.
             */

            if (
                event.detail.name === "navbar"
            ) {

                initializeNavigation();

                initializeDropdowns();

                initializeMobileMenu();

            }

        }
    );


    /* ======================================================================
       COMPONENTS READY SUPPORT
       ====================================================================== */

    document.addEventListener(
        "strativo:components-ready",
        function () {

            initializeHeader();

        }
    );


    /* ======================================================================
       NORMAL PAGE INITIALIZATION
       ====================================================================== */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            function () {

                initializeHeader();

            }
        );

    } else {

        initializeHeader();

    }


    /* ======================================================================
       PUBLIC API
       ====================================================================== */

    window.StrativoHeader = {

        openSearch: function () {

            const searchButton =
                document.getElementById(
                    "header-search-button"
                );


            if (searchButton) {

                searchButton.click();

            }

        },


        openSettings:
            openSettings,


        openProfile:
            openProfile,


        navigate: function (routeName) {

            const route =
                resolveNavigationRoute(
                    routeName
                );


            if (route) {

                goTo(route);

            }

        },


        closeMobileMenu:
            closeMobileMenu,


        closeDropdowns:
            closeAllDropdowns

    };

})();