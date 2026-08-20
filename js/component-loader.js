/*
============================================================
STRATIVO ACADEMY
Shared Component Loader
Version 1.1 Beta

Purpose:
- Load reusable HTML components
- Load global notification system automatically
- Prevent duplicated header/navbar/footer markup
- Support components across pages at different folder depths
- Provide a central component-loading system

Supported HTML components:
- header
- navbar
- lesson-header
- sidebar
- footer
- loading
- modal
- toast

Supported global assets:
- notifications.css
- notifications.js

IMPORTANT:
This loader handles shared components and global systems.

It does NOT replace:
- lesson.js
- module.js
- progress.js
- course.js
- quiz files
- other feature-specific JavaScript
============================================================
*/

"use strict";


/* ==========================================================
   COMPONENT CONFIGURATION
========================================================== */

const StrativoComponents = {

    basePath: "components/",

    available: [
        "header",
        "navbar",
        "lesson-header",
        "sidebar",
        "footer",
        "loading",
        "modal",
        "toast"
    ],

    loaded: new Set(),

    failed: new Set()

};


const StrativoComponentAssets = {

    "lesson-header": {
        css: "css/lesson-header.css",
        js: "js/lesson-header.js"
    }

};


/* ==========================================================
   GLOBAL ASSET CONFIGURATION
========================================================== */

const StrativoGlobalAssets = {

    css: [
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
        "css/header.css",
        "css/notifications.css"
    ],

    js: [
        "js/notifications.js",
        "js/header.js",
        "js/analytics.js"
    ],

    loadedCSS: new Set(),

    loadedJS: new Set(),

    failedCSS: new Set(),

    failedJS: new Set()

};


/* ==========================================================
   PATH RESOLUTION
========================================================== */

function getPageDepth() {

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
        return 2;
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
        return 1;
    }

    const segments =
        path
            .split("/")
            .filter(Boolean);

    const lastSegment =
        segments[segments.length - 1] || "";

    const hasFileExtension =
        /\.[a-z0-9]+$/i.test(
            lastSegment
        );

    const depth = hasFileExtension
        ? segments.length - 1
        : segments.length;

    return (depth > 0 && depth <= 3) ? depth : 0;

}


/* ==========================================================
   PROJECT ROOT PATH
========================================================== */

function getProjectRootPath() {

    const directoryDepth =
        getPageDepth();


    return "../".repeat(
        directoryDepth
    );

}


/* ==========================================================
   COMPONENT BASE PATH
========================================================== */

function getComponentBasePath() {

    return (
        getProjectRootPath() +
        StrativoComponents.basePath
    );

}


/* ==========================================================
   GLOBAL ASSET PATH
========================================================== */

function getGlobalAssetPath(
    assetPath
) {

    if (
        /^https?:\/\//i.test(assetPath)
    ) {

        return assetPath;

    }

    return (
        getProjectRootPath() +
        assetPath
    );

}


/* ==========================================================
   COMPONENT TARGET DISCOVERY
========================================================== */

function findComponentTarget(
    componentName
) {

    return document.querySelector(
        `[data-component="${componentName}"]`
    );

}


/* ==========================================================
   CHECK WHETHER CSS IS ALREADY LOADED
========================================================== */

function isCSSLoaded(
    assetPath
) {

    const links =
        document.querySelectorAll(
            'link[rel="stylesheet"]'
        );


    return Array.from(
        links
    ).some(
        link =>
            link.href.includes(
                assetPath
            )
    );

}


/* ==========================================================
   CHECK WHETHER JS IS ALREADY LOADED
========================================================== */

function isJSScriptLoaded(
    assetPath
) {

    const scripts =
        document.querySelectorAll(
            "script[src]"
        );


    return Array.from(
        scripts
    ).some(
        script =>
            script.src.includes(
                assetPath
            )
    );

}


/* ==========================================================
   LOAD GLOBAL CSS
========================================================== */

function loadGlobalCSS(
    assetPath
) {

    return new Promise(
        function (resolve) {

            const fullPath =
                getGlobalAssetPath(
                    assetPath
                );


            /*
             * Already tracked.
             */

            if (
                StrativoGlobalAssets.loadedCSS.has(
                    assetPath
                )
            ) {

                resolve(true);

                return;

            }


            /*
             * Already present in HTML.
             */

            if (
                isCSSLoaded(
                    assetPath
                )
            ) {

                if (
                    assetPath ===
                    "css/header.css"
                ) {

                    const existingHeaderCSS =
                        Array.from(
                            document.querySelectorAll(
                                'link[rel="stylesheet"]'
                            )
                        ).find(
                            link =>
                                link.href.includes(
                                    assetPath
                                )
                        );

                    if (existingHeaderCSS) {
                        document.head.appendChild(
                            existingHeaderCSS
                        );
                    }
                }

                StrativoGlobalAssets.loadedCSS.add(
                    assetPath
                );

                resolve(true);

                return;

            }


            const link =
                document.createElement(
                    "link"
                );


            link.rel =
                "stylesheet";


            link.href =
                fullPath;


            link.dataset.strativoGlobalAsset =
                "true";


            link.onload =
                function () {

                    StrativoGlobalAssets.loadedCSS.add(
                        assetPath
                    );

                    StrativoGlobalAssets.failedCSS.delete(
                        assetPath
                    );


                    resolve(true);

                };


            link.onerror =
                function () {

                    StrativoGlobalAssets.failedCSS.add(
                        assetPath
                    );


                    console.error(
                        `Strativo Academy: Failed to load global CSS "${fullPath}".`
                    );


                    resolve(false);

                };


            document.head.appendChild(
                link
            );

        }
    );

}


/* ==========================================================
   LOAD GLOBAL JAVASCRIPT
========================================================== */

function loadGlobalJS(
    assetPath
) {

    return new Promise(
        function (resolve) {

            const fullPath =
                getGlobalAssetPath(
                    assetPath
                );


            /*
             * Already tracked.
             */

            if (
                StrativoGlobalAssets.loadedJS.has(
                    assetPath
                )
            ) {

                resolve(true);

                return;

            }


            /*
             * Already included directly by the page.
             */

            if (
                isJSScriptLoaded(
                    assetPath
                )
            ) {

                StrativoGlobalAssets.loadedJS.add(
                    assetPath
                );

                resolve(true);

                return;

            }


            const script =
                document.createElement(
                    "script"
                );


            script.src =
                fullPath;


            script.dataset.strativoGlobalAsset =
                "true";


            /*
             * Do NOT use async.
             *
             * We want the notification controller
             * available before the component system
             * announces that initialization is complete.
             */

            script.async =
                false;


            script.onload =
                function () {

                    StrativoGlobalAssets.loadedJS.add(
                        assetPath
                    );

                    StrativoGlobalAssets.failedJS.delete(
                        assetPath
                    );


                    resolve(true);

                };


            script.onerror =
                function () {

                    StrativoGlobalAssets.failedJS.add(
                        assetPath
                    );


                    console.error(
                        `Strativo Academy: Failed to load global JavaScript "${fullPath}".`
                    );


                    resolve(false);

                };


            document.head.appendChild(
                script
            );

        }
    );

}


/* ==========================================================
   LOAD GLOBAL SYSTEMS
========================================================== */

async function initializeGlobalAssets() {

    /*
     * --------------------------------------------------------
     * STEP 1
     *
     * Load global notification styling.
     * --------------------------------------------------------
     */

    for (
        const cssFile
        of StrativoGlobalAssets.css
    ) {

        await loadGlobalCSS(
            cssFile
        );

    }


    /*
     * --------------------------------------------------------
     * STEP 2
     *
     * Load global notification controller.
     *
     * This creates:
     *
     * window.StrativoNotifications
     *
     * before components-ready is dispatched.
     * --------------------------------------------------------
     */

    for (
        const jsFile
        of StrativoGlobalAssets.js
    ) {

        await loadGlobalJS(
            jsFile
        );

    }


    /*
     * --------------------------------------------------------
     * STEP 3
     *
     * Tell the application that global assets
     * are ready.
     * --------------------------------------------------------
     */

    document.dispatchEvent(
        new CustomEvent(
            "strativo:global-assets-ready",
            {
                detail: {

                    cssLoaded: [
                        ...StrativoGlobalAssets.loadedCSS
                    ],

                    jsLoaded: [
                        ...StrativoGlobalAssets.loadedJS
                    ],

                    cssFailed: [
                        ...StrativoGlobalAssets.failedCSS
                    ],

                    jsFailed: [
                        ...StrativoGlobalAssets.failedJS
                    ]

                }
            }
        )
    );

}


/* ==========================================================
   LOAD SINGLE COMPONENT
========================================================== */

async function loadComponent(
    componentName
) {

    if (
        !StrativoComponents.available.includes(
            componentName
        )
    ) {

        console.warn(
            `Strativo Academy: Unknown component "${componentName}".`
        );


        return false;

    }


    const target =
        findComponentTarget(
            componentName
        );


    /*
     * No mount point means there is nothing to load.
     */

    if (!target) {

        return false;

    }


    /*
     * Prevent accidental duplicate loading.
     */

    if (
        StrativoComponents.loaded.has(
            componentName
        )
    ) {

        return true;

    }


    const basePath =
        getComponentBasePath();


    const componentPath =
        `${basePath}${componentName}.html`;

    const componentAssets =
        StrativoComponentAssets[componentName];


    try {

        const response =
            await fetch(
                componentPath
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const html =
            await response.text();


        if (!html.trim()) {

            throw new Error(
                "Component file is empty."
            );

        }

        if (
            componentAssets &&
            componentAssets.css
        ) {

            await loadGlobalCSS(
                componentAssets.css
            );

        }


        /*
         * Insert component HTML.
         */

        target.innerHTML =
            html;


        /*
         * Store successful loading state.
         */

        StrativoComponents.loaded.add(
            componentName
        );


        /*
         * Remove previous failure state.
         */

        StrativoComponents.failed.delete(
            componentName
        );


        /*
         * Debug information.
         */

        target.dataset.componentLoaded =
            "true";


        target.dataset.componentPath =
            componentPath;

        if (
            componentAssets &&
            componentAssets.js
        ) {

            await loadGlobalJS(
                componentAssets.js
            );

        }


        /*
         * Tell the rest of the application
         * that this component is ready.
         */

        document.dispatchEvent(
            new CustomEvent(
                "strativo:component-loaded",
                {
                    detail: {

                        name:
                            componentName,

                        path:
                            componentPath,

                        target:
                            target

                    }
                }
            )
        );


        return true;

    } catch (error) {

        StrativoComponents.failed.add(
            componentName
        );


        console.error(
            `Strativo Academy: Failed to load "${componentName}".`,
            error
        );


        target.dataset.componentLoaded =
            "false";


        target.dataset.componentError =
            "true";


        return false;

    }

}


/* ==========================================================
   LOAD MULTIPLE COMPONENTS
========================================================== */

async function loadComponents(
    componentNames = []
) {

    const results = {};


    for (
        const componentName
        of componentNames
    ) {

        results[componentName] =
            await loadComponent(
                componentName
            );

    }


    return results;

}


/* ==========================================================
   LOAD DEFAULT COMPONENTS
========================================================== */

async function initializeComponents() {

    /*
     * --------------------------------------------------------
     * STEP 1
     *
     * Load global systems FIRST.
     *
     * This is the important fix.
     *
     * The notification controller exists before
     * header initialization and before components-ready.
     * --------------------------------------------------------
     */

    await initializeGlobalAssets();


    /*
     * --------------------------------------------------------
     * STEP 2
     *
     * Load the main page-level components.
     * --------------------------------------------------------
     */

    const primaryComponents = [

        "header",
        "lesson-header",
        "footer",
        "loading",
        "modal",
        "toast"

    ];


    await loadComponents(
        primaryComponents
    );


    /*
     * --------------------------------------------------------
     * STEP 3
     *
     * Navbar is loaded separately because some pages
     * place its mount point inside the header component.
     * --------------------------------------------------------
     */

    await loadComponent(
        "navbar"
    );


    /*
     * --------------------------------------------------------
     * STEP 4
     *
     * Notify the application that the complete component
     * initialization process has finished.
     * --------------------------------------------------------
     */

    document.dispatchEvent(
        new CustomEvent(
            "strativo:components-ready",
            {
                detail: {

                    loaded: [
                        ...StrativoComponents.loaded
                    ],

                    failed: [
                        ...StrativoComponents.failed
                    ],

                    globalAssets: {

                        cssLoaded: [
                            ...StrativoGlobalAssets.loadedCSS
                        ],

                        jsLoaded: [
                            ...StrativoGlobalAssets.loadedJS
                        ],

                        cssFailed: [
                            ...StrativoGlobalAssets.failedCSS
                        ],

                        jsFailed: [
                            ...StrativoGlobalAssets.failedJS
                        ]

                    }

                }
            }
        )
    );

}


/* ==========================================================
   PUBLIC COMPONENT API
========================================================== */

window.StrativoComponents =
    StrativoComponents;


window.StrativoGlobalAssets =
    StrativoGlobalAssets;


window.loadComponent =
    loadComponent;


window.loadComponents =
    loadComponents;


window.initializeComponents =
    initializeComponents;


window.initializeGlobalAssets =
    initializeGlobalAssets;


/* ==========================================================
   AUTOMATIC INITIALIZATION
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeComponents();

    }
);