/* =========================================================
   STRATIVO ACADEMY
   MODULE LABS SYSTEM
   BUILD 001 — FOUNDATION
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       LAB DATABASE
    ===================================================== */

    const TRADING_LABS = [

        {
            id: "pip-position",

            title: "Pip & Position Lab",

            description:
                "Learn pips, Stop Loss distance, position size, risk and trade calculations through interactive practice.",

            icon:
                "fa-solid fa-calculator",

            category:
                "Risk & Position",

            status:
                "available",

            buttonText:
                "Open Lab",

            link:
                "../tools/pip-calculator.html"
        },


        {
            id: "risk-management",

            title: "Risk Management Lab",

            description:
                "Learn how account risk, position size, leverage, drawdown and multiple trades affect your trading plan.",

            icon:
                "fa-solid fa-shield-halved",

            category:
                "Risk Management",

            status:
                "available",

            buttonText:
                "Open Lab",

            link:
                "../tools/risk-management.html"
        },


        {
            id: "trade-planning",

            title: "R:R & Trade Planning Lab",

            description:
                "Learn how to plan Entry, Stop Loss, Take Profit and Risk-to-Reward before taking a trade.",

            icon:
                "fa-solid fa-scale-balanced",

            category:
                "Trade Planning",

            status:
                "coming-soon",

            buttonText:
                "Coming Soon",

            link:
                "#"
        },


        {
            id: "trade-journal",

            title: "Trade Journal Lab",

            description:
                "Learn how to record trades, review performance and identify patterns in your trading decisions.",

            icon:
                "fa-solid fa-book-open",

            category:
                "Performance",

            status:
                "coming-soon",

            buttonText:
                "Coming Soon",

            link:
                "#"
        },


        {
            id: "trading-psychology",

            title: "Trading Psychology Lab",

            description:
                "Explore discipline, FOMO, revenge trading, emotional decisions and the psychology behind trading.",

            icon:
                "fa-solid fa-brain",

            category:
                "Psychology",

            status:
                "coming-soon",

            buttonText:
                "Coming Soon",

            link:
                "#"
        }

    ];


    /* =====================================================
       LAB CONTAINER
    ===================================================== */

    function getLabContainer() {

        return document.getElementById(
            "tradingLabsContainer"
        );

    }


    /* =====================================================
       CREATE LAB CARD
    ===================================================== */

    function createLabCard(lab) {

        const card =
            document.createElement("article");

        card.className =
            "module-lab-card";

        card.dataset.labId =
            lab.id;

        card.dataset.status =
            lab.status;


        const isAvailable =
            lab.status === "available";


        card.innerHTML = `

            <div class="module-lab-card-top">

                <div class="module-lab-icon">

                    <i class="${lab.icon}"></i>

                </div>

                <span class="module-lab-status ${isAvailable ? "available" : "coming-soon"}">

                    ${
                        isAvailable
                            ? "AVAILABLE"
                            : "COMING SOON"
                    }

                </span>

            </div>


            <div class="module-lab-content">

                <span class="module-lab-category">

                    ${lab.category}

                </span>


                <h3>

                    ${lab.title}

                </h3>


                <p>

                    ${lab.description}

                </p>

            </div>


            <div class="module-lab-footer">

                ${
                    isAvailable

                        ? `

                            <a
                                href="${lab.link}"
                                class="module-lab-button"
                            >

                                <span>
                                    ${lab.buttonText}
                                </span>

                                <i class="fa-solid fa-arrow-right"></i>

                            </a>

                          `

                        : `

                            <button
                                type="button"
                                class="module-lab-button disabled"
                                disabled
                            >

                                <span>
                                    ${lab.buttonText}
                                </span>

                                <i class="fa-solid fa-lock"></i>

                            </button>

                          `
                }

            </div>

        `;


        return card;

    }


    /* =====================================================
       RENDER ALL LABS
    ===================================================== */

    function renderTradingLabs() {

        const container =
            getLabContainer();


        if (!container) {

            console.warn(
                "Module Labs: #tradingLabsContainer was not found."
            );

            return;

        }


        container.innerHTML = "";


        TRADING_LABS.forEach(
            function (lab) {

                const card =
                    createLabCard(lab);


                container.appendChild(
                    card
                );

            }
        );

    }


    /* =====================================================
       PUBLIC LAB ACCESS
    ===================================================== */

    window.StrativoTradingLabs = {

        getAll:
            function () {

                return [
                    ...TRADING_LABS
                ];

            },


        getAvailable:
            function () {

                return TRADING_LABS.filter(
                    function (lab) {

                        return lab.status ===
                            "available";

                    }
                );

            },


        getById:
            function (id) {

                return TRADING_LABS.find(
                    function (lab) {

                        return lab.id ===
                            id;

                    }
                );

            },


        render:
            renderTradingLabs

    };


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function initializeModuleLabs() {

        renderTradingLabs();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeModuleLabs
        );

    }
    else {

        initializeModuleLabs();

    }

})();