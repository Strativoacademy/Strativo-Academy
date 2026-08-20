/*
============================================================
STRATIVO ACADEMY
Global Application Bootstrap
Version 1.0 Beta
============================================================

Purpose:
- Initialize shared application systems
- Provide a safe global startup point
- Detect the current page
- Prepare the project for reusable components
- Avoid duplicating lesson, quiz, module, or progress logic

IMPORTANT:
This file does NOT replace:
- lesson.js
- module.js
- progress.js
- course.js
- quiz files
- script.js

Those systems remain responsible for their own features.
============================================================
*/

"use strict";


/* ==========================================================
   APPLICATION STATE
========================================================== */

const StrativoApp = {

    version: "1.0-beta",

    initialized: false,

    page: {
        name: "",
        path: "",
        type: ""
    }

};


/* ==========================================================
   PAGE DETECTION
========================================================== */

function detectCurrentPage() {

    const path =
        window.location.pathname;


    const fileName =
        path.substring(
            path.lastIndexOf("/") + 1
        ) || "index.html";


    StrativoApp.page.path =
        path;

    StrativoApp.page.name =
        fileName;


    if (
        fileName === "index.html" ||
        fileName === ""
    ) {

        StrativoApp.page.type =
            "home";

    } else if (
        fileName === "beginner.html"
    ) {

        StrativoApp.page.type =
            "course";

    } else if (
        /^lesson\d+\.html$/i.test(fileName)
    ) {

        StrativoApp.page.type =
            "lesson";

    } else if (
        /^module\d+\.html$/i.test(fileName)
    ) {

        StrativoApp.page.type =
            "module";

    } else if (
        fileName === "dashboard.html"
    ) {

        StrativoApp.page.type =
            "dashboard";

    } else {

        StrativoApp.page.type =
            "other";

    }

}


/* ==========================================================
   APPLICATION INITIALIZATION
========================================================== */

function initializeStrativoApp() {

    /*
     * Prevent duplicate initialization.
     */

    if (
        StrativoApp.initialized
    ) {

        return;
    }


    /*
     * Detect current page.
     */

    detectCurrentPage();


    /*
     * Mark application as initialized.
     */

    StrativoApp.initialized =
        true;


    /*
     * Add global readiness state.
     */

    document.documentElement.dataset.strativoReady =
        "true";


    console.info(
        "Strativo Academy initialized:",
        StrativoApp.page.type
    );

}


/* ==========================================================
   PUBLIC APPLICATION API
========================================================== */

window.StrativoApp =
    StrativoApp;

window.detectCurrentPage =
    detectCurrentPage;

window.initializeStrativoApp =
    initializeStrativoApp;


/* ==========================================================
   DOM READY
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeStrativoApp();

    }
);