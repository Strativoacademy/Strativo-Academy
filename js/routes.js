/* ==========================================================================
   STRATIVO ACADEMY
   CENTRAL ROUTE SYSTEM
   Version 1.2
   ========================================================================== */

"use strict";

(function () {

    const routes = {

        /* ==============================================================
           MAIN PAGES
           ============================================================== */

        home: "index.html",

        beginner: "beginner.html",

        dashboard: "dashboard/dashboard.html",


        /* ==============================================================
           MODULE 1 — FOREX BASICS
           ============================================================== */

        module1: {

            lesson1: "lessons/module1/lesson1.html",

            lesson2: "lessons/module1/lesson2.html",

            lesson3: "lessons/module1/lesson3.html",

            lesson4: "lessons/module1/lesson4.html",

            lesson5: "lessons/module1/lesson5.html",

            lesson6: "lessons/module1/lesson6.html",

            lesson7: "lessons/module1/lesson7.html",

            lesson8: "lessons/module1/lesson8.html",

            lesson9: "lessons/module1/lesson9.html",

            lesson10: "lessons/module1/lesson10.html"

        },


        /* ==============================================================
           MODULE 2
           ============================================================== */

        module2: {

            lesson1: "lessons/module2/lesson1.html",

            lesson2: "lessons/module2/lesson2.html",

            lesson3: "lessons/module2/lesson3.html",

            lesson4: "lessons/module2/lesson4.html",

            lesson5: "lessons/module2/lesson5.html",

            lesson6: "lessons/module2/lesson6.html",

            lesson7: "lessons/module2/lesson7.html",

            lesson8: "lessons/module2/lesson8.html",

            lesson9: "lessons/module2/lesson9.html",

            lesson10: "lessons/module2/lesson10.html"

        },


        /* ==============================================================
           MODULE 3
           ============================================================== */

        module3: {

            lesson1: "lessons/module3/lesson1.html",

            lesson2: "lessons/module3/lesson2.html",

            lesson3: "lessons/module3/lesson3.html",

            lesson4: "lessons/module3/lesson4.html",

            lesson5: "lessons/module3/lesson5.html",

            lesson6: "lessons/module3/lesson6.html",

            lesson7: "lessons/module3/lesson7.html",

            lesson8: "lessons/module3/lesson8.html",

            lesson9: "lessons/module3/lesson9.html",

            lesson10: "lessons/module3/lesson10.html"

        },


        /* ==============================================================
           MODULE 4
           ============================================================== */

        module4: {

            lesson1: "lessons/module4/lesson1.html",

            lesson2: "lessons/module4/lesson2.html",

            lesson3: "lessons/module4/lesson3.html",

            lesson4: "lessons/module4/lesson4.html",

            lesson5: "lessons/module4/lesson5.html",

            lesson6: "lessons/module4/lesson6.html",

            lesson7: "lessons/module4/lesson7.html",

            lesson8: "lessons/module4/lesson8.html",

            lesson9: "lessons/module4/lesson9.html",

            lesson10: "lessons/module4/lesson10.html"

        },


        /* ==============================================================
           PLATFORM
           ============================================================== */

        settings: "settings/settings.html",

        profile: "profile/profile.html",


        /* ==============================================================
           LEGAL
           ============================================================== */

        legal: {

    riskDisclosure: "legal/risk-disclosure.html",

    privacyPolicy: "legal/privacy-policy.html",

    terms: "legal/terms.html"

}

    };


    /* ==============================================================
       GLOBAL ROUTE OBJECT
       ============================================================== */

    window.StrativoRoutes = routes;


    /* ==============================================================
       DEBUG
       ============================================================== */

    console.info(
        "Strativo Academy: Central route system loaded.",
        window.StrativoRoutes
    );

})();