/* =========================================================
   STRATIVO ACADEMY
   PIP & POSITION LAB
   BUILD 003
   GUIDED TRADE & RISK LAB
========================================================= */


/* =========================================================
   GLOBAL INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initPipPositionLab();

    }
);


/* =========================================================
   MAIN INITIALIZER
========================================================= */

function initPipPositionLab() {

    initCalculator();

    initPipSimulator();

    initLearningNavigation();

    initConceptExplanations();

    initBuild002();

    initBuild003();

}


/* =========================================================
   UTILITY FUNCTIONS
========================================================= */

function getPipSize(pair) {

    if (pair === "USDJPY") {

        return 0.01;

    }

    return 0.0001;

}


function formatNumber(value, decimals = 2) {

    if (!Number.isFinite(value)) {

        return "0";

    }

    return new Intl.NumberFormat(
        "en-US",
        {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }
    ).format(value);

}


function formatMoney(value) {

    if (!Number.isFinite(value)) {

        return "$0.00";

    }

    return (
        value >= 0 ? "+" : "-"
    ) +
    "$" +
    Math.abs(value).toFixed(2);

}


/* =========================================================
   BUILD 001
   MAIN CALCULATOR
========================================================= */

function initCalculator() {

    const pairInput =
        document.getElementById("pair");

    const entryInput =
        document.getElementById("entryPrice");

    const exitInput =
        document.getElementById("exitPrice");

    const lotsInput =
        document.getElementById("lots");

    const contractInput =
        document.getElementById("contractSize");

    const stopInput =
        document.getElementById("stopLoss");

    const takeProfitInput =
        document.getElementById("takeProfit");


    const pipResult =
        document.getElementById("pipResult");

    const quantityResult =
        document.getElementById("quantityResult");

    const pipValueResult =
        document.getElementById("pipValueResult");

    const plResult =
        document.getElementById("plResult");

    const riskResult =
        document.getElementById("riskResult");

    const rrResult =
        document.getElementById("rrResult");


    if (
        !pairInput ||
        !entryInput ||
        !exitInput ||
        !lotsInput ||
        !contractInput ||
        !stopInput ||
        !takeProfitInput
    ) {

        return;

    }


    function calculate() {

        const pair =
            pairInput.value;

        const entry =
            Number(entryInput.value);

        const exit =
            Number(exitInput.value);

        const lots =
            Number(lotsInput.value);

        const contractSize =
            Number(contractInput.value);

        const stopPips =
            Number(stopInput.value);

        const targetPips =
            Number(takeProfitInput.value);


        if (
            entry <= 0 ||
            exit <= 0 ||
            lots <= 0 ||
            contractSize <= 0
        ) {

            return;

        }


        const pipSize =
            getPipSize(pair);


        const pipMovement =
            (exit - entry) /
            pipSize;


        const quantity =
            lots *
            contractSize;


        let pipValue;


        if (pair === "USDJPY") {

            pipValue =
                (
                    quantity *
                    pipSize
                ) / exit;

        }
        else {

            pipValue =
                quantity *
                pipSize;

        }


        const estimatedPL =
            pipMovement *
            pipValue;


        const plannedRisk =
            stopPips *
            pipValue;


        let rrText = "—";


        if (
            stopPips > 0 &&
            targetPips > 0
        ) {

            rrText =
                "1 : " +
                (
                    targetPips /
                    stopPips
                ).toFixed(2);

        }


        const movementSign =
            pipMovement >= 0
                ? "+"
                : "";


        pipResult.textContent =
            movementSign +
            pipMovement.toFixed(1) +
            " pips";


        quantityResult.textContent =
            formatNumber(quantity, 0);


        pipValueResult.textContent =
            "$" +
            pipValue.toFixed(2) +
            " / pip";


        plResult.textContent =
            formatMoney(
                estimatedPL
            );


        riskResult.textContent =
            "-$" +
            Math.abs(
                plannedRisk
            ).toFixed(2);


        rrResult.textContent =
            rrText;


        plResult.classList.remove(
            "pip-lab-profit",
            "pip-lab-loss"
        );


        if (estimatedPL >= 0) {

            plResult.classList.add(
                "pip-lab-profit"
            );

        }
        else {

            plResult.classList.add(
                "pip-lab-loss"
            );

        }

    }


    const inputs = [

        pairInput,
        entryInput,
        exitInput,
        lotsInput,
        contractInput,
        stopInput,
        takeProfitInput

    ];


    inputs.forEach(
        function (input) {

            input.addEventListener(
                "input",
                calculate
            );


            input.addEventListener(
                "change",
                calculate
            );

        }
    );


    calculate();

}


/* =========================================================
   BUILD 001
   PIP MOVEMENT SIMULATOR
========================================================= */

function initPipSimulator() {

    const pipPair =
        document.getElementById("pipPair");

    const slider =
        document.getElementById(
            "pipMovementSlider"
        );

    const startPriceElement =
        document.getElementById(
            "simStartPrice"
        );

    const currentPriceElement =
        document.getElementById(
            "simCurrentPrice"
        );

    const pipSizeElement =
        document.getElementById(
            "pipSizeDisplay"
        );

    const sliderValueElement =
        document.getElementById(
            "sliderPipValue"
        );

    const bigResultElement =
        document.getElementById(
            "bigPipResult"
        );

    const directionElement =
        document.getElementById(
            "pipDirectionText"
        );

    const progressElement =
        document.getElementById(
            "movementProgress"
        );

    const markerElement =
        document.getElementById(
            "movementMarker"
        );

    const resetButton =
        document.getElementById(
            "resetPipSimulator"
        );


    if (
        !pipPair ||
        !slider ||
        !startPriceElement ||
        !currentPriceElement ||
        !pipSizeElement ||
        !sliderValueElement ||
        !bigResultElement ||
        !directionElement ||
        !progressElement ||
        !markerElement ||
        !resetButton
    ) {

        return;

    }


    const startingPrices = {

        EURUSD: 1.10000,

        GBPUSD: 1.30000,

        USDJPY: 150.000

    };


    function formatPrice(
        pair,
        price
    ) {

        if (pair === "USDJPY") {

            return price.toFixed(3);

        }

        return price.toFixed(5);

    }


    function updateSimulator() {

        const pair =
            pipPair.value;

        const startPrice =
            startingPrices[pair];

        const pipSize =
            getPipSize(pair);

        const pipMovement =
            Number(slider.value);


        const currentPrice =
            startPrice +
            (
                pipMovement *
                pipSize
            );


        startPriceElement.textContent =
            formatPrice(
                pair,
                startPrice
            );


        currentPriceElement.textContent =
            formatPrice(
                pair,
                currentPrice
            );


        pipSizeElement.textContent =
            pipSize.toString();


        const sign =
            pipMovement > 0
                ? "+"
                : "";


        sliderValueElement.textContent =
            sign +
            pipMovement +
            " pips";


        bigResultElement.textContent =
            sign +
            pipMovement.toFixed(1) +
            " pips";


        if (pipMovement > 0) {

            directionElement.textContent =
                "Price moved upward by " +
                Math.abs(pipMovement) +
                " pips.";

        }
        else if (pipMovement < 0) {

            directionElement.textContent =
                "Price moved downward by " +
                Math.abs(pipMovement) +
                " pips.";

        }
        else {

            directionElement.textContent =
                "Price has not moved.";

        }


        const min =
            Number(slider.min);

        const max =
            Number(slider.max);

        const range =
            max - min;

        const normalized =
            (
                pipMovement - min
            ) / range;


        const percentage =
            normalized * 100;


        markerElement.style.left =
            percentage + "%";


        if (pipMovement >= 0) {

            const width =
                (
                    pipMovement /
                    max
                ) * 50;


            progressElement.style.left =
                "50%";

            progressElement.style.width =
                width + "%";

        }
        else {

            const width =
                (
                    Math.abs(pipMovement) /
                    Math.abs(min)
                ) * 50;


            progressElement.style.left =
                (
                    50 - width
                ) + "%";

            progressElement.style.width =
                width + "%";

        }


        if (pipMovement > 0) {

            bigResultElement.style.color =
                "#34d399";

            markerElement.style.background =
                "#34d399";

            progressElement.style.background =
                "#34d399";

        }
        else if (pipMovement < 0) {

            bigResultElement.style.color =
                "#fb7185";

            markerElement.style.background =
                "#fb7185";

            progressElement.style.background =
                "#fb7185";

        }
        else {

            bigResultElement.style.color =
                "#60a5fa";

            markerElement.style.background =
                "#60a5fa";

            progressElement.style.background =
                "#60a5fa";

        }

    }


    slider.addEventListener(
        "input",
        updateSimulator
    );


    pipPair.addEventListener(
        "change",
        function () {

            slider.value =
                50;

            updateSimulator();

        }
    );


    resetButton.addEventListener(
        "click",
        function () {

            pipPair.value =
                "EURUSD";

            slider.value =
                50;

            updateSimulator();

        }
    );


    updateSimulator();

}


/* =========================================================
   LEARNING NAVIGATION
========================================================= */

function initLearningNavigation() {

    const buttons =
        document.querySelectorAll(
            "[data-scroll-target]"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const targetId =
                        button.dataset.scrollTarget;


                    const target =
                        document.getElementById(
                            targetId
                        );


                    if (!target) {

                        return;

                    }


                    target.scrollIntoView({

                        behavior:
                            "smooth",

                        block:
                            "start"

                    });

                }
            );

        }
    );

}


/* =========================================================
   CONCEPT EXPLANATIONS
========================================================= */

function initConceptExplanations() {

    const explanationButtons =
        document.querySelectorAll(
            "[data-explain]"
        );


    const explanations = {

        pip: {

            title:
                "What is a Pip?",

            text:
                "A pip is a standardized unit used to describe a small movement in a Forex price. It tells you how far price moved. A pip does not automatically mean a specific amount of money."

        },


        lot: {

            title:
                "What is a Lot?",

            text:
                "A lot is a common way Forex platforms express position size. A larger lot generally represents a larger position, so the same price movement can have a larger monetary effect."

        },


        quantity: {

            title:
                "What is Quantity?",

            text:
                "Quantity describes how many units are represented by your position under the instrument's contract specification. It helps connect a platform's trade-size number to the actual units involved."

        },


        position: {

            title:
                "What is Position Size?",

            text:
                "Position size describes how large your market position is. Two traders can experience the same price movement but different monetary results when their positions are different sizes."

        },


        pipvalue: {

            title:
                "What is Pip Value?",

            text:
                "Pip value tells you approximately how much one pip is worth for a particular position. It connects price movement to the monetary effect of the trade."

        },


        risk: {

            title:
                "What is Risk?",

            text:
                "Risk is about the amount of money you plan to put at risk if your planned stop level is reached. Risk is different from simply saying how many pips your stop is."

        }

    };


    explanationButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const key =
                        button.dataset.explain;


                    const explanation =
                        explanations[key];


                    if (!explanation) {

                        return;

                    }


                    showExplanationModal(
                        explanation.title,
                        explanation.text
                    );

                }
            );

        }
    );

}


/* =========================================================
   EXPLANATION MODAL
========================================================= */

function showExplanationModal(
    title,
    text
) {

    const existing =
        document.querySelector(
            ".pip-lab-explanation-modal"
        );


    if (existing) {

        existing.remove();

    }


    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "pip-lab-explanation-modal";


    modal.innerHTML = `

        <div class="pip-lab-modal-backdrop"></div>

        <div
            class="pip-lab-modal"
            role="dialog"
            aria-modal="true"
        >

            <button
                type="button"
                class="pip-lab-modal-close"
            >

                <i class="fa-solid fa-xmark"></i>

            </button>


            <div class="pip-lab-modal-icon">

                <i class="fa-solid fa-lightbulb"></i>

            </div>


            <span class="pip-lab-modal-label">
                SIMPLE EXPLANATION
            </span>


            <h3>
                ${title}
            </h3>


            <p>
                ${text}
            </p>


            <button
                type="button"
                class="pip-lab-modal-understood"
            >
                Got it
            </button>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    const closeButton =
        modal.querySelector(
            ".pip-lab-modal-close"
        );


    const understoodButton =
        modal.querySelector(
            ".pip-lab-modal-understood"
        );


    const backdrop =
        modal.querySelector(
            ".pip-lab-modal-backdrop"
        );


    function closeModal() {

        modal.remove();

    }


    closeButton.addEventListener(
        "click",
        closeModal
    );


    understoodButton.addEventListener(
        "click",
        closeModal
    );


    backdrop.addEventListener(
        "click",
        closeModal
    );

}


/* =========================================================
   BUILD 002
   LOT & QUANTITY EXPLORER
========================================================= */

function initBuild002() {

    const simulator =
        document.getElementById(
            "pip-simulator"
        );


    if (!simulator) {

        return;

    }


    if (
        document.getElementById(
            "build002LotExplorer"
        )
    ) {

        return;

    }


    createBuild002Markup(
        simulator
    );


    setupBuild002();

}


/* =========================================================
   BUILD 002 MARKUP
========================================================= */

function createBuild002Markup(
    simulator
) {

    const section =
        document.createElement(
            "section"
        );


    section.className =
        "pip-lab-build002";


    section.id =
        "build002LotExplorer";


    section.innerHTML = `

        <div class="pip-lab-build002-header">

            <span class="pip-lab-build002-badge">

                <i class="fa-solid fa-layer-group"></i>

                Build 002

            </span>


            <h2>
                Lot &amp; Quantity Explorer
            </h2>


            <p>
                Keep the price movement the same and change the
                position size. Watch how lot size changes quantity,
                pip value and the monetary effect of the same trade.
            </p>

        </div>


        <div class="pip-lab-build002-panel">


            <div class="pip-lab-build002-top">


                <div class="pip-lab-build002-trade">

                    <span class="pip-lab-build002-label">
                        Same Example Trade
                    </span>


                    <div class="pip-lab-build002-trade-pair">

                        <strong id="build002Pair">
                            EUR/USD
                        </strong>

                        <span
                            class="pip-lab-build002-label"
                            id="build002PriceMove"
                        >
                            +50 pips
                        </span>

                    </div>


                    <div class="pip-lab-build002-pips">

                        <span>
                            Price movement stays the same
                        </span>

                        <strong>
                            50 pips
                        </strong>

                        <span>
                            We are changing only the position size.
                        </span>

                    </div>

                </div>



                <div class="pip-lab-build002-control">

                    <div class="pip-lab-build002-control-heading">

                        <label for="build002LotSlider">
                            Position Size — Lots
                        </label>


                        <strong
                            class="pip-lab-build002-lot-value"
                            id="build002LotValue"
                        >
                            0.10 lot
                        </strong>

                    </div>


                    <input
                        type="range"
                        id="build002LotSlider"
                        min="0.01"
                        max="1.00"
                        step="0.01"
                        value="0.10"
                    >


                    <div class="pip-lab-build002-slider-scale">

                        <span>
                            0.01
                        </span>

                        <span>
                            0.50
                        </span>

                        <span>
                            1.00
                        </span>

                    </div>


                    <div
                        class="pip-lab-build002-presets"
                        id="build002Presets"
                    >

                        <button
                            type="button"
                            class="pip-lab-build002-preset"
                            data-lot="0.01"
                        >
                            0.01
                        </button>


                        <button
                            type="button"
                            class="pip-lab-build002-preset active"
                            data-lot="0.10"
                        >
                            0.10
                        </button>


                        <button
                            type="button"
                            class="pip-lab-build002-preset"
                            data-lot="0.50"
                        >
                            0.50
                        </button>


                        <button
                            type="button"
                            class="pip-lab-build002-preset"
                            data-lot="1.00"
                        >
                            1.00
                        </button>

                    </div>

                </div>

            </div>



            <div class="pip-lab-build002-results">


                <div class="pip-lab-build002-result">

                    <div class="pip-lab-build002-result-icon">
                        <i class="fa-solid fa-cubes"></i>
                    </div>

                    <span class="pip-lab-build002-result-label">
                        Quantity
                    </span>

                    <strong
                        class="pip-lab-build002-result-value"
                        id="build002Quantity"
                    >
                        10,000 units
                    </strong>

                    <p class="pip-lab-build002-result-description">
                        Units represented by the position.
                    </p>

                </div>



                <div class="pip-lab-build002-result">

                    <div class="pip-lab-build002-result-icon">
                        <i class="fa-solid fa-coins"></i>
                    </div>

                    <span class="pip-lab-build002-result-label">
                        Pip Value
                    </span>

                    <strong
                        class="pip-lab-build002-result-value"
                        id="build002PipValue"
                    >
                        $1.00 / pip
                    </strong>

                    <p class="pip-lab-build002-result-description">
                        Approximate value of one pip.
                    </p>

                </div>



                <div class="pip-lab-build002-result">

                    <div class="pip-lab-build002-result-icon">
                        <i class="fa-solid fa-money-bill-trend-up"></i>
                    </div>

                    <span class="pip-lab-build002-result-label">
                        50 Pip Effect
                    </span>

                    <strong
                        class="pip-lab-build002-result-value"
                        id="build002MoneyEffect"
                    >
                        $50.00
                    </strong>

                    <p class="pip-lab-build002-result-description">
                        Approximate monetary effect of the same 50-pip move.
                    </p>

                </div>

            </div>



            <div class="pip-lab-build002-lesson">

                <div class="pip-lab-build002-lesson-heading">

                    <i class="fa-solid fa-lightbulb"></i>

                    <strong>
                        THE IMPORTANT PART
                    </strong>

                </div>


                <h3>
                    Same 50 pips. Different position. Different money.
                </h3>


                <p>

                    Imagine two traders both catch the exact same
                    50-pip movement. If one trader uses a smaller
                    position and the other uses a larger position,
                    their monetary results will not be the same.

                    <br><br>

                    The number of pips did not change.

                    <b>
                        The position size changed.
                    </b>

                </p>


                <div class="pip-lab-build002-comparison">

                    <div class="pip-lab-build002-comparison-item">

                        <strong>0.01 lot</strong>

                        <span>1,000 units</span>

                        <b>≈ $0.10 / pip</b>

                    </div>


                    <div class="pip-lab-build002-comparison-item">

                        <strong>0.10 lot</strong>

                        <span>10,000 units</span>

                        <b>≈ $1.00 / pip</b>

                    </div>


                    <div class="pip-lab-build002-comparison-item">

                        <strong>0.50 lot</strong>

                        <span>50,000 units</span>

                        <b>≈ $5.00 / pip</b>

                    </div>


                    <div class="pip-lab-build002-comparison-item">

                        <strong>1.00 lot</strong>

                        <span>100,000 units</span>

                        <b>≈ $10.00 / pip</b>

                    </div>

                </div>

            </div>



            <div class="pip-lab-build002-why">

                <div class="pip-lab-build002-why-icon">

                    <i class="fa-solid fa-question"></i>

                </div>


                <div>

                    <strong>
                        Why do we need lot size?
                    </strong>


                    <p>

                        A pip only tells you how far price moved.
                        Lot size helps describe how large the position is.
                        Because position size changes, the same price
                        movement can have a different monetary effect.

                    </p>

                </div>

            </div>

        </div>

    `;


    simulator.insertAdjacentElement(
        "afterend",
        section
    );

}


/* =========================================================
   BUILD 002 LOGIC
========================================================= */

function setupBuild002() {

    const slider =
        document.getElementById(
            "build002LotSlider"
        );

    const lotValue =
        document.getElementById(
            "build002LotValue"
        );

    const quantity =
        document.getElementById(
            "build002Quantity"
        );

    const pipValue =
        document.getElementById(
            "build002PipValue"
        );

    const moneyEffect =
        document.getElementById(
            "build002MoneyEffect"
        );

    const pairDisplay =
        document.getElementById(
            "build002Pair"
        );

    const presets =
        document.querySelectorAll(
            ".pip-lab-build002-preset"
        );


    if (
        !slider ||
        !lotValue ||
        !quantity ||
        !pipValue ||
        !moneyEffect
    ) {

        return;

    }


    const STANDARD_CONTRACT =
        100000;

    const PIP_MOVEMENT =
        50;


    function getCurrentPair() {

        const pair =
            document.getElementById(
                "pair"
            );


        return pair &&
            pair.value
            ? pair.value
            : "EURUSD";

    }


    function getPipValue(
        pair,
        lots
    ) {

        if (
            pair === "EURUSD" ||
            pair === "GBPUSD"
        ) {

            return lots * 10;

        }


        if (pair === "USDJPY") {

            const exit =
                Number(
                    document.getElementById(
                        "exitPrice"
                    )?.value
                ) || 150;


            return (
                lots *
                STANDARD_CONTRACT *
                0.01
            ) / exit;

        }


        return lots * 10;

    }


    function update() {

        const lots =
            Number(slider.value);

        const pair =
            getCurrentPair();


        const units =
            lots *
            STANDARD_CONTRACT;


        const currentPipValue =
            getPipValue(
                pair,
                lots
            );


        const money =
            currentPipValue *
            PIP_MOVEMENT;


        lotValue.textContent =
            lots.toFixed(2) +
            " lot";


        quantity.textContent =
            formatNumber(
                units,
                0
            ) +
            " units";


        pipValue.textContent =
            "$" +
            currentPipValue.toFixed(2) +
            " / pip";


        moneyEffect.textContent =
            "$" +
            money.toFixed(2);


        if (pairDisplay) {

            const names = {

                EURUSD: "EUR/USD",

                GBPUSD: "GBP/USD",

                USDJPY: "USD/JPY"

            };


            pairDisplay.textContent =
                names[pair] ||
                pair;

        }


        presets.forEach(
            function (button) {

                const value =
                    Number(
                        button.dataset.lot
                    );


                button.classList.toggle(
                    "active",
                    Math.abs(
                        value - lots
                    ) < 0.001
                );

            }
        );

    }


    slider.addEventListener(
        "input",
        update
    );


    presets.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    slider.value =
                        button.dataset.lot;

                    update();

                }
            );

        }
    );


    document
        .getElementById("pair")
        ?.addEventListener(
            "change",
            update
        );


    document
        .getElementById("exitPrice")
        ?.addEventListener(
            "input",
            update
        );


    update();

}


/* =========================================================
   BUILD 003
   GUIDED TRADE & RISK LAB
========================================================= */

function initBuild003() {

    if (
        document.getElementById(
            "build003RiskLab"
        )
    ) {

        return;

    }


    const calculator =
        document.getElementById(
            "calculator"
        );


    if (!calculator) {

        return;

    }


    createBuild003Markup(
        calculator
    );


    setupBuild003();

}


/* =========================================================
   BUILD 003 MARKUP
========================================================= */

function createBuild003Markup(
    calculator
) {

    const section =
        document.createElement(
            "section"
        );


    section.id =
        "build003RiskLab";


    section.className =
        "pip-lab-build003";


    section.innerHTML = `

        <div class="pip-lab-build003-header">

            <span class="pip-lab-build003-badge">

                <i class="fa-solid fa-shield-halved"></i>

                Build 003

            </span>


            <h2>
                Guided Trade &amp; Risk Lab
            </h2>


            <p>
                Don't just get a number. Build the trade step by step
                and understand what every number means.
            </p>

        </div>



        <div class="pip-lab-build003-panel">


            <!-- =========================================
                 STEP 1
            ========================================== -->

            <div class="pip-lab-build003-step">

                <div class="pip-lab-build003-step-number">
                    01
                </div>


                <div class="pip-lab-build003-step-content">

                    <span class="pip-lab-build003-step-label">
                        STEP 1
                    </span>


                    <h3>
                        Start With Your Account
                    </h3>


                    <p>
                        First tell the calculator how much money
                        is available in the trading account.
                    </p>


                    <div class="pip-lab-build003-input-grid">

                        <div class="pip-lab-build003-field">

                            <label for="build003Balance">
                                Account Balance
                            </label>


                            <div class="pip-lab-build003-input-wrap">

                                <span>$</span>

                                <input
                                    id="build003Balance"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value="1000"
                                >

                            </div>


                            <small>
                                Example: $1,000
                            </small>

                        </div>


                        <div class="pip-lab-build003-field">

                            <label for="build003RiskPercent">
                                Risk Per Trade
                            </label>


                            <div class="pip-lab-build003-input-wrap">

                                <input
                                    id="build003RiskPercent"
                                    type="number"
                                    min="0.01"
                                    max="100"
                                    step="0.1"
                                    value="1"
                                >

                                <span>%</span>

                            </div>


                            <small>
                                Example: 1%
                            </small>

                        </div>

                    </div>


                    <div class="pip-lab-build003-explanation">

                        <i class="fa-solid fa-lightbulb"></i>

                        <div>

                            <strong>
                                What does risk % mean?
                            </strong>

                            <p>
                                If you choose 1% risk on a $1,000 account,
                                you are planning to risk up to $10 if the
                                planned stop is reached.
                            </p>

                        </div>

                    </div>

                </div>

            </div>



            <!-- =========================================
                 STEP 2
            ========================================== -->

            <div class="pip-lab-build003-step">

                <div class="pip-lab-build003-step-number">
                    02
                </div>


                <div class="pip-lab-build003-step-content">

                    <span class="pip-lab-build003-step-label">
                        STEP 2
                    </span>


                    <h3>
                        Choose Your Entry
                    </h3>


                    <p>
                        Entry is the price where you plan to open
                        the trade.
                    </p>


                    <div class="pip-lab-build003-single-input">

                        <label for="build003Entry">
                            Entry Price
                        </label>


                        <input
                            id="build003Entry"
                            type="number"
                            step="0.00001"
                            value="1.10000"
                        >

                    </div>


                    <div class="pip-lab-build003-explanation">

                        <i class="fa-solid fa-location-dot"></i>

                        <div>

                            <strong>
                                Entry is a price, not money.
                            </strong>

                            <p>
                                For example, 1.10000 is the price level
                                where the trade begins. We later measure
                                other price levels from this point.
                            </p>

                        </div>

                    </div>

                </div>

            </div>



            <!-- =========================================
                 STEP 3
            ========================================== -->

            <div class="pip-lab-build003-step">

                <div class="pip-lab-build003-step-number">
                    03
                </div>


                <div class="pip-lab-build003-step-content">

                    <span class="pip-lab-build003-step-label">
                        STEP 3
                    </span>


                    <h3>
                        Set Your Stop Loss
                    </h3>


                    <p>
                        A stop-loss distance tells us how far price can
                        move against the trade before the planned exit.
                    </p>


                    <div class="pip-lab-build003-stop-grid">

                        <div class="pip-lab-build003-field">

                            <label for="build003StopPips">
                                Stop Loss Distance
                            </label>


                            <div class="pip-lab-build003-input-wrap">

                                <input
                                    id="build003StopPips"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value="30"
                                >

                                <span>
                                    pips
                                </span>

                            </div>

                        </div>


                        <div class="pip-lab-build003-price-box">

                            <span>
                                Buy Example Stop Price
                            </span>


                            <strong
                                id="build003StopPrice"
                            >
                                1.09700
                            </strong>

                        </div>

                    </div>


                    <div class="pip-lab-build003-visual">

                        <div>

                            <span>
                                ENTRY
                            </span>

                            <strong
                                id="build003EntryVisual"
                            >
                                1.10000
                            </strong>

                        </div>


                        <div class="pip-lab-build003-visual-line">

                            <span>
                                30 pips
                            </span>

                            <div></div>

                        </div>


                        <div>

                            <span>
                                STOP
                            </span>

                            <strong
                                id="build003StopVisual"
                            >
                                1.09700
                            </strong>

                        </div>

                    </div>


                    <div class="pip-lab-build003-explanation warning">

                        <i class="fa-solid fa-circle-info"></i>

                        <div>

                            <strong>
                                Important: 30 pips does NOT mean $30.
                            </strong>

                            <p>
                                Pips describe price distance.
                                The money effect depends on position size
                                and pip value.
                            </p>

                        </div>

                    </div>

                </div>

            </div>



            <!-- =========================================
                 STEP 4
            ========================================== -->

            <div class="pip-lab-build003-step">

                <div class="pip-lab-build003-step-number">
                    04
                </div>


                <div class="pip-lab-build003-step-content">

                    <span class="pip-lab-build003-step-label">
                        STEP 4
                    </span>


                    <h3>
                        Set Your Take Profit
                    </h3>


                    <p>
                        Take profit is the planned target distance
                        from your entry.
                    </p>


                    <div class="pip-lab-build003-stop-grid">

                        <div class="pip-lab-build003-field">

                            <label for="build003TargetPips">
                                Take Profit Distance
                            </label>


                            <div class="pip-lab-build003-input-wrap">

                                <input
                                    id="build003TargetPips"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value="60"
                                >

                                <span>
                                    pips
                                </span>

                            </div>

                        </div>


                        <div class="pip-lab-build003-price-box reward">

                            <span>
                                Buy Example Target Price
                            </span>


                            <strong
                                id="build003TargetPrice"
                            >
                                1.10600
                            </strong>

                        </div>

                    </div>


                    <div class="pip-lab-build003-explanation reward">

                        <i class="fa-solid fa-bullseye"></i>

                        <div>

                            <strong>
                                Take profit is also a price distance.
                            </strong>

                            <p>
                                A 60-pip target does not automatically mean
                                $60. The monetary result depends on position size
                                and pip value.
                            </p>

                        </div>

                    </div>

                </div>

            </div>



            <!-- =========================================
                 STEP 5
            ========================================== -->

            <div class="pip-lab-build003-step">

                <div class="pip-lab-build003-step-number">
                    05
                </div>


                <div class="pip-lab-build003-step-content">

                    <span class="pip-lab-build003-step-label">
                        STEP 5
                    </span>


                    <h3>
                        Let the Lab Calculate Your Planned Risk
                    </h3>


                    <p>
                        Now the calculator connects your account,
                        risk percentage and stop-loss distance.
                    </p>


                    <div class="pip-lab-build003-summary-grid">


                        <div class="pip-lab-build003-summary-card">

                            <span>
                                Account
                            </span>

                            <strong
                                id="build003AccountResult"
                            >
                                $1,000.00
                            </strong>

                        </div>


                        <div class="pip-lab-build003-summary-card">

                            <span>
                                Risk
                            </span>

                            <strong
                                id="build003RiskResult"
                            >
                                1%
                            </strong>

                        </div>


                        <div class="pip-lab-build003-summary-card highlight">

                            <span>
                                Maximum Planned Risk
                            </span>

                            <strong
                                id="build003MaxRisk"
                            >
                                $10.00
                            </strong>

                        </div>


                        <div class="pip-lab-build003-summary-card">

                            <span>
                                Stop
                            </span>

                            <strong
                                id="build003StopResult"
                            >
                                30 pips
                            </strong>

                        </div>

                    </div>


                    <div class="pip-lab-build003-formula">

                        <span>
                            The calculation
                        </span>


                        <strong>
                            Account Balance × Risk % = Maximum Planned Risk
                        </strong>


                        <p id="build003FormulaExample">
                            $1,000 × 1% = $10
                        </p>

                    </div>

                </div>

            </div>



            <!-- =========================================
                 STEP 6
            ========================================== -->

            <div class="pip-lab-build003-step">

                <div class="pip-lab-build003-step-number">
                    06
                </div>


                <div class="pip-lab-build003-step-content">

                    <span class="pip-lab-build003-step-label">
                        STEP 6
                    </span>


                    <h3>
                        Position Size
                    </h3>


                    <p>
                        Now we determine how large the position can be
                        while keeping the planned risk close to the amount
                        selected above.
                    </p>


                    <div class="pip-lab-build003-position-result">

                        <div>

                            <span>
                                EDUCATIONAL POSITION SIZE
                            </span>


                            <strong
                                id="build003PositionSize"
                            >
                                0.03 lot
                            </strong>

                        </div>


                        <div>

                            <span>
                                QUANTITY
                            </span>


                            <strong
                                id="build003Quantity"
                            >
                                3,333 units
                            </strong>

                        </div>

                    </div>


                    <div class="pip-lab-build003-explanation">

                        <i class="fa-solid fa-scale-balanced"></i>

                        <div>

                            <strong>
                                Why does position size change?
                            </strong>

                            <p>
                                If the stop gets wider while your allowed
                                monetary risk stays the same, the position
                                generally needs to become smaller.
                                If the stop gets tighter, the calculated
                                position can generally become larger.
                            </p>

                        </div>

                    </div>

                </div>

            </div>



            <!-- =========================================
                 STEP 7
            ========================================== -->

            <div class="pip-lab-build003-step">

                <div class="pip-lab-build003-step-number">
                    07
                </div>


                <div class="pip-lab-build003-step-content">

                    <span class="pip-lab-build003-step-label">
                        STEP 7
                    </span>


                    <h3>
                        Understand Pip Value
                    </h3>


                    <p>
                        Pip value connects the price movement to money.
                    </p>


                    <div class="pip-lab-build003-pip-value-box">

                        <span>
                            Estimated Pip Value
                        </span>


                        <strong
                            id="build003PipValue"
                        >
                            $0.33 / pip
                        </strong>


                        <p>
                            This is an educational approximation for the
                            selected example and account currency.
                        </p>

                    </div>


                    <div class="pip-lab-build003-formula">

                        <span>
                            Think of it like this
                        </span>


                        <strong>
                            Pips × Pip Value = Approximate Money Effect
                        </strong>


                        <p id="build003PipFormula">
                            30 pips × $0.33 ≈ $10
                        </p>

                    </div>

                </div>

            </div>



            <!-- =========================================
                 STEP 8
            ========================================== -->

            <div class="pip-lab-build003-step">

                <div class="pip-lab-build003-step-number">
                    08
                </div>


                <div class="pip-lab-build003-step-content">

                    <span class="pip-lab-build003-step-label">
                        STEP 8
                    </span>


                    <h3>
                        Risk : Reward
                    </h3>


                    <p>
                        Compare the distance to your stop with the distance
                        to your target.
                    </p>


                    <div class="pip-lab-build003-rr">

                        <div>

                            <span>
                                RISK
                            </span>

                            <strong
                                id="build003RRRisk"
                            >
                                30 pips
                            </strong>

                        </div>


                        <div class="pip-lab-build003-rr-arrow">

                            <i class="fa-solid fa-arrow-right"></i>

                        </div>


                        <div>

                            <span>
                                REWARD
                            </span>

                            <strong
                                id="build003RRReward"
                            >
                                60 pips
                            </strong>

                        </div>


                        <div class="pip-lab-build003-rr-main">

                            <span>
                                RISK : REWARD
                            </span>

                            <strong
                                id="build003RRValue"
                            >
                                1 : 2.00
                            </strong>

                        </div>

                    </div>


                    <div class="pip-lab-build003-explanation reward">

                        <i class="fa-solid fa-scale-balanced"></i>

                        <div>

                            <strong>
                                What does 1 : 2 mean?
                            </strong>

                            <p>
                                It means the planned target distance is
                                twice the stop distance. It is a comparison
                                of distances; it is not a guarantee that
                                the trade will win.
                            </p>

                        </div>

                    </div>

                </div>

            </div>



            <!-- =========================================
                 FINAL SUMMARY
            ========================================== -->

            <div class="pip-lab-build003-final">

                <div class="pip-lab-build003-final-icon">

                    <i class="fa-solid fa-graduation-cap"></i>

                </div>


                <span>
                    YOUR TRADE EXPLAINED
                </span>


                <h3>
                    Now you can see how the numbers connect.
                </h3>


                <div class="pip-lab-build003-final-grid">

                    <div>

                        <small>
                            ACCOUNT
                        </small>

                        <strong
                            id="build003FinalAccount"
                        >
                            $1,000
                        </strong>

                    </div>


                    <div>

                        <small>
                            PLANNED RISK
                        </small>

                        <strong
                            id="build003FinalRisk"
                        >
                            $10
                        </strong>

                    </div>


                    <div>

                        <small>
                            STOP
                        </small>

                        <strong
                            id="build003FinalStop"
                        >
                            30 pips
                        </strong>

                    </div>


                    <div>

                        <small>
                            POSITION
                        </small>

                        <strong
                            id="build003FinalPosition"
                        >
                            0.03 lot
                        </strong>

                    </div>


                    <div>

                        <small>
                            TARGET
                        </small>

                        <strong
                            id="build003FinalTarget"
                        >
                            60 pips
                        </strong>

                    </div>


                    <div>

                        <small>
                            R:R
                        </small>

                        <strong
                            id="build003FinalRR"
                        >
                            1 : 2
                        </strong>

                    </div>

                </div>


                <p>

                    Remember:
                    <b>
                        pips describe price distance,
                    </b>
                    while position size and pip value help determine
                    the monetary effect of that movement.

                </p>

            </div>


        </div>

    `;


    calculator.insertAdjacentElement(
        "afterend",
        section
    );

}


/* =========================================================
   BUILD 003 LOGIC
========================================================= */

function setupBuild003() {

    const balanceInput =
        document.getElementById(
            "build003Balance"
        );

    const riskInput =
        document.getElementById(
            "build003RiskPercent"
        );

    const entryInput =
        document.getElementById(
            "build003Entry"
        );

    const stopInput =
        document.getElementById(
            "build003StopPips"
        );

    const targetInput =
        document.getElementById(
            "build003TargetPips"
        );


    if (
        !balanceInput ||
        !riskInput ||
        !entryInput ||
        !stopInput ||
        !targetInput
    ) {

        return;

    }


    function updateBuild003() {

        const balance =
            Number(
                balanceInput.value
            );

        const riskPercent =
            Number(
                riskInput.value
            );

        const entry =
            Number(
                entryInput.value
            );

        const stopPips =
            Number(
                stopInput.value
            );

        const targetPips =
            Number(
                targetInput.value
            );


        if (
            balance <= 0 ||
            riskPercent <= 0 ||
            entry <= 0 ||
            stopPips <= 0 ||
            targetPips <= 0
        ) {

            return;

        }


        /* =========================================
           PAIR
        ========================================== */

        const pair =
            document.getElementById(
                "pair"
            )?.value ||
            "EURUSD";


        const pipSize =
            getPipSize(pair);


        /* =========================================
           MAXIMUM PLANNED RISK
        ========================================== */

        const maximumRisk =
            balance *
            (
                riskPercent /
                100
            );


        /* =========================================
           STOP PRICE
           
           Buy example:
           Entry - stop distance
        ========================================== */

        const stopPrice =
            entry -
            (
                stopPips *
                pipSize
            );


        /* =========================================
           TARGET PRICE
           
           Buy example:
           Entry + target distance
        ========================================== */

        const targetPrice =
            entry +
            (
                targetPips *
                pipSize
            );


        /* =========================================
           EDUCATIONAL POSITION SIZE
           
           For EUR/USD and GBP/USD
           with USD account:

           $10 per pip per 1 lot.

           lot =
           allowed risk /
           (stop pips × $10)
        ========================================== */

        let pipValuePerLot;


        if (
            pair === "EURUSD" ||
            pair === "GBPUSD"
        ) {

            pipValuePerLot =
                10;

        }
        else if (
            pair === "USDJPY"
        ) {

            const referencePrice =
                targetPrice;


            pipValuePerLot =
                (
                    100000 *
                    0.01
                ) /
                referencePrice;

        }
        else {

            pipValuePerLot =
                10;

        }


        let positionLots =
            maximumRisk /
            (
                stopPips *
                pipValuePerLot
            );


        /* =========================================
           KEEP EDUCATIONAL RESULT REASONABLE
        ========================================== */

        if (
            !Number.isFinite(positionLots) ||
            positionLots < 0
        ) {

            positionLots =
                0;

        }


        /*
           Broker lot increments are commonly
           expressed in steps such as 0.01.

           We round DOWN for educational risk
           protection rather than rounding upward.
        */

        positionLots =
            Math.floor(
                positionLots *
                100
            ) / 100;


        if (
            positionLots < 0.01
        ) {

            positionLots =
                0.01;

        }


        /* =========================================
           QUANTITY
        ========================================== */

        const contractSize =
            Number(
                document.getElementById(
                    "contractSize"
                )?.value
            ) ||
            100000;


        const quantity =
            positionLots *
            contractSize;


        /* =========================================
           ACTUAL EDUCATIONAL PIP VALUE
        ========================================== */

        let pipValue;


        if (
            pair === "EURUSD" ||
            pair === "GBPUSD"
        ) {

            pipValue =
                positionLots *
                10;

        }
        else if (
            pair === "USDJPY"
        ) {

            pipValue =
                (
                    quantity *
                    pipSize
                ) /
                targetPrice;

        }
        else {

            pipValue =
                positionLots *
                10;

        }


        /* =========================================
           ESTIMATED RISK
        ========================================== */

        const estimatedRisk =
            stopPips *
            pipValue;


        /* =========================================
           ESTIMATED REWARD
        ========================================== */

        const estimatedReward =
            targetPips *
            pipValue;


        /* =========================================
           RISK REWARD
        ========================================== */

        const rr =
            targetPips /
            stopPips;


        /* =========================================
           UPDATE ACCOUNT
        ========================================== */

        setText(
            "build003AccountResult",
            "$" +
            formatNumber(
                balance,
                2
            )
        );


        setText(
            "build003RiskResult",
            riskPercent.toFixed(2) +
            "%"
        );


        setText(
            "build003MaxRisk",
            "$" +
            maximumRisk.toFixed(2)
        );


        setText(
            "build003StopResult",
            stopPips +
            " pips"
        );


        setText(
            "build003FormulaExample",
            "$" +
            formatNumber(
                balance,
                2
            ) +
            " × " +
            riskPercent.toFixed(2) +
            "% = $" +
            maximumRisk.toFixed(2)
        );


        /* =========================================
           STOP PRICE
        ========================================== */

        setText(
            "build003StopPrice",
            formatPriceForPair(
                pair,
                stopPrice
            )
        );


        setText(
            "build003EntryVisual",
            formatPriceForPair(
                pair,
                entry
            )
        );


        setText(
            "build003StopVisual",
            formatPriceForPair(
                pair,
                stopPrice
            )
        );


        /* =========================================
           TARGET
        ========================================== */

        setText(
            "build003TargetPrice",
            formatPriceForPair(
                pair,
                targetPrice
            )
        );


        /* =========================================
           POSITION
        ========================================== */

        setText(
            "build003PositionSize",
            positionLots.toFixed(2) +
            " lot"
        );


        setText(
            "build003Quantity",
            formatNumber(
                quantity,
                0
            ) +
            " units"
        );


        /* =========================================
           PIP VALUE
        ========================================== */

        setText(
            "build003PipValue",
            "$" +
            pipValue.toFixed(2) +
            " / pip"
        );


        setText(
            "build003PipFormula",
            stopPips +
            " pips × $" +
            pipValue.toFixed(2) +
            " ≈ $" +
            estimatedRisk.toFixed(2)
        );


        /* =========================================
           R:R
        ========================================== */

        setText(
            "build003RRRisk",
            stopPips +
            " pips"
        );


        setText(
            "build003RRReward",
            targetPips +
            " pips"
        );


        setText(
            "build003RRValue",
            "1 : " +
            rr.toFixed(2)
        );


        /* =========================================
           FINAL SUMMARY
        ========================================== */

        setText(
            "build003FinalAccount",
            "$" +
            formatNumber(
                balance,
                0
            )
        );


        setText(
            "build003FinalRisk",
            "$" +
            estimatedRisk.toFixed(2)
        );


        setText(
            "build003FinalStop",
            stopPips +
            " pips"
        );


        setText(
            "build003FinalPosition",
            positionLots.toFixed(2) +
            " lot"
        );


        setText(
            "build003FinalTarget",
            targetPips +
            " pips"
        );


        setText(
            "build003FinalRR",
            "1 : " +
            rr.toFixed(2)
        );

    }


    function formatPriceForPair(
        pair,
        value
    ) {

        if (
            pair === "USDJPY"
        ) {

            return value.toFixed(3);

        }


        return value.toFixed(5);

    }


    function setText(
        id,
        value
    ) {

        const element =
            document.getElementById(
                id
            );


        if (element) {

            element.textContent =
                value;

        }

    }


    const inputs = [

        balanceInput,
        riskInput,
        entryInput,
        stopInput,
        targetInput

    ];


    inputs.forEach(
        function (input) {

            input.addEventListener(
                "input",
                updateBuild003
            );


            input.addEventListener(
                "change",
                updateBuild003
            );

        }
    );


    /* =========================================
       SYNC WITH MAIN PAIR
    ========================================== */

    const mainPair =
        document.getElementById(
            "pair"
        );


    if (mainPair) {

        mainPair.addEventListener(
            "change",
            updateBuild003
        );

    }


    /* =========================================
       INITIAL RESULT
    ========================================== */

    updateBuild003();

}

/* =========================================================
   BUILD 004
   TRADE SCENARIO SIMULATOR
   ========================================================= */

function initBuild004() {

    if (
        document.getElementById(
            "build004ScenarioLab"
        )
    ) {
        return;
    }

    const calculator =
        document.getElementById(
            "calculator"
        );

    if (!calculator) {
        return;
    }

    createBuild004Markup(
        calculator
    );

    setupBuild004();
}


/* =========================================================
   BUILD 004 MARKUP
   ========================================================= */

function createBuild004Markup(
    calculator
) {

    const section =
        document.createElement(
            "section"
        );

    section.id =
        "build004ScenarioLab";

    section.className =
        "pip-lab-build004";

    section.innerHTML = `

        <div class="pip-lab-build004-header">

            <span class="pip-lab-build004-badge">

                <i class="fa-solid fa-flask"></i>

                Build 004

            </span>

            <h2>
                Trade Scenario Simulator
            </h2>

            <p>
                Change one part of the trade and see how the
                rest of the numbers react.
            </p>

        </div>


        <!-- =================================================
             MAIN SIMULATOR
        ================================================== -->

        <div class="pip-lab-build004-panel">


            <!-- =============================================
                 CONTROL AREA
            ============================================== -->

            <div class="pip-lab-build004-controls">

                <div class="pip-lab-build004-section-title">

                    <span>
                        SCENARIO CONTROLS
                    </span>

                    <strong>
                        Change the trade
                    </strong>

                </div>


                <div class="pip-lab-build004-input-grid">


                    <!-- ACCOUNT -->

                    <div class="pip-lab-build004-field">

                        <label for="build004Balance">
                            Account Balance
                        </label>

                        <div class="pip-lab-build004-input-wrap">

                            <span>$</span>

                            <input
                                id="build004Balance"
                                type="number"
                                min="1"
                                step="1"
                                value="1000"
                            >

                        </div>

                    </div>


                    <!-- RISK -->

                    <div class="pip-lab-build004-field">

                        <label for="build004Risk">
                            Risk Per Trade
                        </label>

                        <div class="pip-lab-build004-input-wrap">

                            <input
                                id="build004Risk"
                                type="number"
                                min="0.01"
                                max="100"
                                step="0.1"
                                value="1"
                            >

                            <span>%</span>

                        </div>

                    </div>


                    <!-- STOP -->

                    <div class="pip-lab-build004-field">

                        <label for="build004Stop">
                            Stop Loss
                        </label>

                        <div class="pip-lab-build004-input-wrap">

                            <input
                                id="build004Stop"
                                type="number"
                                min="1"
                                step="1"
                                value="30"
                            >

                            <span>pips</span>

                        </div>

                    </div>


                    <!-- TARGET -->

                    <div class="pip-lab-build004-field">

                        <label for="build004Target">
                            Take Profit
                        </label>

                        <div class="pip-lab-build004-input-wrap">

                            <input
                                id="build004Target"
                                type="number"
                                min="1"
                                step="1"
                                value="60"
                            >

                            <span>pips</span>

                        </div>

                    </div>

                </div>


                <div class="pip-lab-build004-hint">

                    <i class="fa-solid fa-lightbulb"></i>

                    <div>

                        <strong>
                            Experiment
                        </strong>

                        <p>
                            Try changing only the stop loss.
                            Watch how position size and pip value react.
                        </p>

                    </div>

                </div>

            </div>


            <!-- =============================================
                 BEFORE / AFTER
            ============================================== -->

            <div class="pip-lab-build004-comparison">


                <!-- BEFORE -->

                <div class="pip-lab-build004-card">

                    <div class="pip-lab-build004-card-header">

                        <span>
                            BASE SCENARIO
                        </span>

                        <i class="fa-solid fa-chart-line"></i>

                    </div>


                    <div class="pip-lab-build004-card-title">

                        Current Trade

                    </div>


                    <div class="pip-lab-build004-metrics">


                        <div>
                            <span>STOP</span>

                            <strong
                                id="build004BaseStop"
                            >
                                30 pips
                            </strong>
                        </div>


                        <div>
                            <span>POSITION</span>

                            <strong
                                id="build004BasePosition"
                            >
                                0.03 lot
                            </strong>
                        </div>


                        <div>
                            <span>PIP VALUE</span>

                            <strong
                                id="build004BasePipValue"
                            >
                                $0.30
                            </strong>
                        </div>


                        <div>
                            <span>RISK</span>

                            <strong
                                id="build004BaseRisk"
                            >
                                $9.00
                            </strong>
                        </div>


                        <div>
                            <span>TARGET</span>

                            <strong
                                id="build004BaseTarget"
                            >
                                60 pips
                            </strong>
                        </div>


                        <div>
                            <span>REWARD</span>

                            <strong
                                id="build004BaseReward"
                            >
                                $18.00
                            </strong>
                        </div>


                    </div>

                </div>


                <!-- ARROW -->

                <div class="pip-lab-build004-change">

                    <div class="pip-lab-build004-change-icon">

                        <i class="fa-solid fa-arrow-right"></i>

                    </div>

                    <span>
                        CHANGE
                    </span>

                    <strong
                        id="build004ChangeText"
                    >
                        Scenario
                    </strong>

                </div>


                <!-- AFTER -->

                <div class="pip-lab-build004-card result">

                    <div class="pip-lab-build004-card-header">

                        <span>
                            NEW SCENARIO
                        </span>

                        <i class="fa-solid fa-wand-magic-sparkles"></i>

                    </div>


                    <div class="pip-lab-build004-card-title">

                        Updated Trade

                    </div>


                    <div class="pip-lab-build004-metrics">


                        <div>
                            <span>STOP</span>

                            <strong
                                id="build004NewStop"
                            >
                                30 pips
                            </strong>
                        </div>


                        <div>
                            <span>POSITION</span>

                            <strong
                                id="build004NewPosition"
                            >
                                0.03 lot
                            </strong>
                        </div>


                        <div>
                            <span>PIP VALUE</span>

                            <strong
                                id="build004NewPipValue"
                            >
                                $0.30
                            </strong>
                        </div>


                        <div>
                            <span>RISK</span>

                            <strong
                                id="build004NewRisk"
                            >
                                $9.00
                            </strong>
                        </div>


                        <div>
                            <span>TARGET</span>

                            <strong
                                id="build004NewTarget"
                            >
                                60 pips
                            </strong>
                        </div>


                        <div>
                            <span>REWARD</span>

                            <strong
                                id="build004NewReward"
                            >
                                $18.00
                            </strong>
                        </div>


                    </div>

                </div>

            </div>


            <!-- =============================================
                 DIFFERENCE
            ============================================== -->

            <div class="pip-lab-build004-difference">

                <div class="pip-lab-build004-difference-heading">

                    <i class="fa-solid fa-arrows-left-right"></i>

                    <div>

                        <span>
                            WHAT CHANGED?
                        </span>

                        <strong>
                            Compare the two scenarios
                        </strong>

                    </div>

                </div>


                <div class="pip-lab-build004-difference-grid">


                    <div>

                        <span>
                            POSITION SIZE
                        </span>

                        <strong
                            id="build004PositionDifference"
                        >
                            0.00 lot
                        </strong>

                    </div>


                    <div>

                        <span>
                            RISK
                        </span>

                        <strong
                            id="build004RiskDifference"
                        >
                            $0.00
                        </strong>

                    </div>


                    <div>

                        <span>
                            REWARD
                        </span>

                        <strong
                            id="build004RewardDifference"
                        >
                            $0.00
                        </strong>

                    </div>


                    <div>

                        <span>
                            R:R
                        </span>

                        <strong
                            id="build004RRDifference"
                        >
                            1 : 2.00
                        </strong>

                    </div>

                </div>

            </div>


            <!-- =============================================
                 EDUCATIONAL EXPLANATION
            ============================================== -->

            <div class="pip-lab-build004-explanation">

                <div class="pip-lab-build004-explanation-icon">

                    <i class="fa-solid fa-graduation-cap"></i>

                </div>


                <div>

                    <span>
                        TRADE LESSON
                    </span>

                    <h3
                        id="build004LessonTitle"
                    >
                        Your trade has not changed yet.
                    </h3>

                    <p
                        id="build004LessonText"
                    >
                        Change one of the scenario values to see
                        how the trade reacts.
                    </p>

                </div>

            </div>


            <!-- =============================================
                 KEY RELATIONSHIP
            ============================================== -->

            <div class="pip-lab-build004-relationship">

                <div>

                    <span>
                        STOP GETS WIDER
                    </span>

                    <strong>
                        ↓
                    </strong>

                    <p>
                        Position generally gets smaller
                        when planned monetary risk stays fixed.
                    </p>

                </div>


                <div>

                    <span>
                        STOP GETS TIGHTER
                    </span>

                    <strong>
                        ↑
                    </strong>

                    <p>
                        Position can generally become larger
                        when planned monetary risk stays fixed.
                    </p>

                </div>


                <div>

                    <span>
                        TARGET GETS LARGER
                    </span>

                    <strong>
                        ↑
                    </strong>

                    <p>
                        Potential reward increases if
                        position size and pip value remain unchanged.
                    </p>

                </div>

            </div>


            <!-- =============================================
                 FINAL SUMMARY
            ============================================== -->

            <div class="pip-lab-build004-final">

                <div class="pip-lab-build004-final-icon">

                    <i class="fa-solid fa-flask-vial"></i>

                </div>

                <span>
                    SCENARIO RESULT
                </span>

                <h3
                    id="build004FinalTitle"
                >
                    Ready to experiment
                </h3>

                <p
                    id="build004FinalText"
                >
                    Change the values above and observe
                    what happens to the trade.
                </p>

            </div>

        </div>
    `;


    calculator.insertAdjacentElement(
        "afterend",
        section
    );
}


/* =========================================================
   BUILD 004 LOGIC
   ========================================================= */

function setupBuild004() {

    const balanceInput =
        document.getElementById(
            "build004Balance"
        );

    const riskInput =
        document.getElementById(
            "build004Risk"
        );

    const stopInput =
        document.getElementById(
            "build004Stop"
        );

    const targetInput =
        document.getElementById(
            "build004Target"
        );


    if (
        !balanceInput ||
        !riskInput ||
        !stopInput ||
        !targetInput
    ) {
        return;
    }


    /*
       -----------------------------------------
       BASE SCENARIO
       -----------------------------------------
    */

    const baseBalance = 1000;
    const baseRisk = 1;
    const baseStop = 30;
    const baseTarget = 60;


    function calculateScenario(
        balance,
        riskPercent,
        stopPips,
        targetPips
    ) {

        const maximumRisk =
            balance *
            (
                riskPercent /
                100
            );


        /*
           Educational EUR/USD-style
           pip value per standard lot.
        */

        const pipValuePerLot = 10;


        let positionLots =
            maximumRisk /
            (
                stopPips *
                pipValuePerLot
            );


        if (
            !Number.isFinite(
                positionLots
            ) ||
            positionLots < 0
        ) {

            positionLots = 0;

        }


        /*
           Keep the same educational
           0.01 lot increment used in Build 003.
        */

        positionLots =
            Math.floor(
                positionLots *
                100
            ) / 100;


        if (
            positionLots < 0.01
        ) {

            positionLots = 0.01;

        }


        const pipValue =
            positionLots *
            pipValuePerLot;


        const plannedRisk =
            stopPips *
            pipValue;


        const potentialReward =
            targetPips *
            pipValue;


        const rr =
            targetPips /
            stopPips;


        const quantity =
            positionLots *
            100000;


        return {

            balance:
                balance,

            riskPercent:
                riskPercent,

            stopPips:
                stopPips,

            targetPips:
                targetPips,

            maximumRisk:
                maximumRisk,

            positionLots:
                positionLots,

            pipValue:
                pipValue,

            plannedRisk:
                plannedRisk,

            potentialReward:
                potentialReward,

            rr:
                rr,

            quantity:
                quantity

        };

    }


    function money(
        value
    ) {

        return (
            "$" +
            value.toFixed(2)
        );

    }


    function lots(
        value
    ) {

        return (
            value.toFixed(2) +
            " lot"
        );

    }


    function pips(
        value
    ) {

        return (
            value +
            " pips"
        );

    }


    function setText(
        id,
        value
    ) {

        const element =
            document.getElementById(
                id
            );

        if (element) {

            element.textContent =
                value;

        }

    }


    function updateBuild004() {

        const balance =
            Number(
                balanceInput.value
            );

        const riskPercent =
            Number(
                riskInput.value
            );

        const stopPips =
            Number(
                stopInput.value
            );

        const targetPips =
            Number(
                targetInput.value
            );


        if (
            balance <= 0 ||
            riskPercent <= 0 ||
            stopPips <= 0 ||
            targetPips <= 0
        ) {

            return;

        }


        const base =
            calculateScenario(
                baseBalance,
                baseRisk,
                baseStop,
                baseTarget
            );


        const current =
            calculateScenario(
                balance,
                riskPercent,
                stopPips,
                targetPips
            );


        /* =========================================
           BASE
        ========================================== */

        setText(
            "build004BaseStop",
            pips(
                base.stopPips
            )
        );


        setText(
            "build004BasePosition",
            lots(
                base.positionLots
            )
        );


        setText(
            "build004BasePipValue",
            money(
                base.pipValue
            )
        );


        setText(
            "build004BaseRisk",
            money(
                base.plannedRisk
            )
        );


        setText(
            "build004BaseTarget",
            pips(
                base.targetPips
            )
        );


        setText(
            "build004BaseReward",
            money(
                base.potentialReward
            )
        );


        /* =========================================
           CURRENT
        ========================================== */

        setText(
            "build004NewStop",
            pips(
                current.stopPips
            )
        );


        setText(
            "build004NewPosition",
            lots(
                current.positionLots
            )
        );


        setText(
            "build004NewPipValue",
            money(
                current.pipValue
            )
        );


        setText(
            "build004NewRisk",
            money(
                current.plannedRisk
            )
        );


        setText(
            "build004NewTarget",
            pips(
                current.targetPips
            )
        );


        setText(
            "build004NewReward",
            money(
                current.potentialReward
            )
        );


        /* =========================================
           DIFFERENCE
        ========================================== */

        const positionDifference =
            current.positionLots -
            base.positionLots;


        const riskDifference =
            current.plannedRisk -
            base.plannedRisk;


        const rewardDifference =
            current.potentialReward -
            base.potentialReward;


        setText(
            "build004PositionDifference",
            (
                positionDifference >= 0
                    ? "+"
                    : ""
            ) +
            positionDifference.toFixed(2) +
            " lot"
        );


        setText(
            "build004RiskDifference",
            (
                riskDifference >= 0
                    ? "+"
                    : ""
            ) +
            money(
                riskDifference
            )
        );


        setText(
            "build004RewardDifference",
            (
                rewardDifference >= 0
                    ? "+"
                    : ""
            ) +
            money(
                rewardDifference
            )
        );


        setText(
            "build004RRDifference",
            "1 : " +
            current.rr.toFixed(2)
        );


        /* =========================================
           DETERMINE WHAT CHANGED
        ========================================== */

        const stopChanged =
            current.stopPips !==
            base.stopPips;


        const targetChanged =
            current.targetPips !==
            base.targetPips;


        const balanceChanged =
            current.balance !==
            base.balance;


        const riskChanged =
            current.riskPercent !==
            base.riskPercent;


        let changeText =
            "Scenario";


        if (
            stopChanged &&
            !targetChanged &&
            !balanceChanged &&
            !riskChanged
        ) {

            if (
                current.stopPips >
                base.stopPips
            ) {

                changeText =
                    "Stop widened";

            }
            else {

                changeText =
                    "Stop tightened";

            }

        }
        else if (
            targetChanged &&
            !stopChanged &&
            !balanceChanged &&
            !riskChanged
        ) {

            if (
                current.targetPips >
                base.targetPips
            ) {

                changeText =
                    "Target increased";

            }
            else {

                changeText =
                    "Target reduced";

            }

        }
        else if (
            balanceChanged &&
            !stopChanged &&
            !targetChanged &&
            !riskChanged
        ) {

            changeText =
                "Account changed";

        }
        else if (
            riskChanged &&
            !stopChanged &&
            !targetChanged &&
            !balanceChanged
        ) {

            changeText =
                "Risk changed";

        }
        else {

            changeText =
                "Multiple changes";

        }


        setText(
            "build004ChangeText",
            changeText
        );


        /* =========================================
           EDUCATIONAL MESSAGE
        ========================================== */

        let lessonTitle =
            "Your trade has not changed yet.";


        let lessonText =
            "Change one value at a time and observe how the numbers react.";


        if (
            stopChanged &&
            current.stopPips >
            base.stopPips &&
            !targetChanged
        ) {

            lessonTitle =
                "The stop became wider.";


            lessonText =
                "With the planned monetary risk kept in the same framework, " +
                "a wider stop generally requires a smaller position. " +
                "This helps keep the planned risk from increasing simply " +
                "because the stop is farther away.";

        }
        else if (
            stopChanged &&
            current.stopPips <
            base.stopPips &&
            !targetChanged
        ) {

            lessonTitle =
                "The stop became tighter.";


            lessonText =
                "A tighter stop generally allows a larger position " +
                "when the planned monetary risk stays fixed. " +
                "The stop distance and position size are connected.";

        }
        else if (
            targetChanged &&
            current.targetPips >
            base.targetPips &&
            !stopChanged
        ) {

            lessonTitle =
                "The target became larger.";


            lessonText =
                "A larger target increases the potential reward " +
                "when the position size and pip value remain unchanged. " +
                "A larger target does not guarantee a winning trade.";

        }
        else if (
            targetChanged &&
            current.targetPips <
            base.targetPips &&
            !stopChanged
        ) {

            lessonTitle =
                "The target became smaller.";


            lessonText =
                "A smaller target reduces the potential reward " +
                "when the position size and pip value remain unchanged.";

        }
        else if (
            balanceChanged &&
            !stopChanged &&
            !targetChanged
        ) {

            lessonTitle =
                "The account balance changed.";


            lessonText =
                "Changing the account balance changes the amount " +
                "represented by the selected risk percentage.";

        }
        else if (
            riskChanged &&
            !stopChanged &&
            !targetChanged
        ) {

            lessonTitle =
                "The risk percentage changed.";


            lessonText =
                "A higher selected risk percentage increases the " +
                "maximum planned monetary risk, while a lower percentage " +
                "reduces it.";

        }
        else if (
            stopChanged ||
            targetChanged ||
            balanceChanged ||
            riskChanged
        ) {

            lessonTitle =
                "Several trade variables changed.";


            lessonText =
                "Look at the difference section and identify which " +
                "number changed first and which numbers reacted afterward.";

        }


        setText(
            "build004LessonTitle",
            lessonTitle
        );


        setText(
            "build004LessonText",
            lessonText
        );


        /* =========================================
           FINAL SUMMARY
        ========================================== */

        let finalTitle =
            "Ready to experiment";


        let finalText =
            "Change the values above and observe what happens to the trade.";


        if (
            current.stopPips !==
            base.stopPips
        ) {

            finalTitle =
                "You changed the stop-loss distance.";


            finalText =
                "Notice how position size and planned risk respond " +
                "to the new stop distance.";

        }
        else if (
            current.targetPips !==
            base.targetPips
        ) {

            finalTitle =
                "You changed the take-profit distance.";


            finalText =
                "Watch how the potential reward and risk-to-reward " +
                "relationship respond to the new target.";

        }
        else if (
            current.balance !==
            base.balance
        ) {

            finalTitle =
                "You changed the account size.";


            finalText =
                "The selected risk percentage now represents a different " +
                "planned monetary amount.";

        }
        else if (
            current.riskPercent !==
            base.riskPercent
        ) {

            finalTitle =
                "You changed the risk percentage.";


            finalText =
                "The selected risk percentage changes the maximum " +
                "planned monetary risk.";

        }


        setText(
            "build004FinalTitle",
            finalTitle
        );


        setText(
            "build004FinalText",
            finalText
        );

    }


    /* =========================================
       INPUT EVENTS
    ========================================== */

    const inputs = [

        balanceInput,

        riskInput,

        stopInput,

        targetInput

    ];


    inputs.forEach(
        function (input) {

            input.addEventListener(
                "input",
                updateBuild004
            );

            input.addEventListener(
                "change",
                updateBuild004
            );

        }
    );


    /* =========================================
       INITIAL UPDATE
    ========================================== */

    updateBuild004();

}


/* =========================================================
   BUILD 004 AUTO INIT
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initBuild004
    );

}
else {

    initBuild004();

}

/* =========================================================
   BUILD 005
   PREDICT BEFORE CALCULATE
   ========================================================= */

function initBuild005() {

    if (
        document.getElementById(
            "build005PredictionLab"
        )
    ) {
        return;
    }

    const calculator =
        document.getElementById(
            "calculator"
        );

    if (!calculator) {
        return;
    }

    createBuild005Markup(
        calculator
    );

    setupBuild005();
}


/* =========================================================
   BUILD 005 MARKUP
   ========================================================= */

function createBuild005Markup(
    calculator
) {

    const section =
        document.createElement(
            "section"
        );

    section.id =
        "build005PredictionLab";

    section.className =
        "pip-lab-build005";

    section.innerHTML = `

        <!-- =============================================
             HEADER
        ============================================== -->

        <div class="pip-lab-build005-header">

            <span class="pip-lab-build005-badge">

                <i class="fa-solid fa-brain"></i>

                Build 005

            </span>


            <h2>
                Predict Before Calculate
            </h2>


            <p>
                Don't let the calculator do all the thinking.
                Predict what will happen first, then reveal the result.
            </p>

        </div>



        <!-- =============================================
             MAIN PANEL
        ============================================== -->

        <div class="pip-lab-build005-panel">


            <!-- =========================================
                 LEARNING INTRO
            ========================================== -->

            <div class="pip-lab-build005-intro">

                <div class="pip-lab-build005-intro-icon">

                    <i class="fa-solid fa-lightbulb"></i>

                </div>


                <div>

                    <span>
                        HOW THIS WORKS
                    </span>


                    <h3>
                        Think first. Calculate second.
                    </h3>


                    <p>
                        Read each trading scenario, choose what
                        you think will happen, then check your answer.
                        Every question explains the reason behind the result.
                    </p>

                </div>

            </div>



            <!-- =========================================
                 PROGRESS
            ========================================== -->

            <div class="pip-lab-build005-progress-area">

                <div class="pip-lab-build005-progress-top">

                    <span>
                        CHALLENGE PROGRESS
                    </span>


                    <strong id="build005ProgressText">
                        Question 1 of 6
                    </strong>

                </div>


                <div class="pip-lab-build005-progress">

                    <div
                        id="build005ProgressBar"
                    ></div>

                </div>

            </div>



            <!-- =========================================
                 QUESTION
            ========================================== -->

            <div
                class="pip-lab-build005-question"
                id="build005QuestionArea"
            >

                <div class="pip-lab-build005-question-number">

                    <span>
                        QUESTION
                    </span>


                    <strong id="build005QuestionNumber">
                        01
                    </strong>

                </div>


                <div class="pip-lab-build005-question-content">

                    <span
                        class="pip-lab-build005-category"
                        id="build005Category"
                    >
                        STOP LOSS
                    </span>


                    <h3
                        id="build005Question"
                    >
                        Loading question...
                    </h3>


                    <div
                        class="pip-lab-build005-scenario"
                        id="build005Scenario"
                    >
                    </div>


                    <div
                        class="pip-lab-build005-options"
                        id="build005Options"
                    >
                    </div>


                    <div
                        class="pip-lab-build005-answer-status"
                        id="build005AnswerStatus"
                    >
                    </div>


                    <button
                        type="button"
                        id="build005CheckButton"
                        class="pip-lab-build005-check-button"
                    >

                        <i class="fa-solid fa-check"></i>

                        Check Answer

                    </button>


                    <button
                        type="button"
                        id="build005NextButton"
                        class="pip-lab-build005-next-button"
                        disabled
                    >

                        Next Question

                        <i class="fa-solid fa-arrow-right"></i>

                    </button>

                </div>

            </div>



            <!-- =========================================
                 EXPLANATION
            ========================================== -->

            <div
                class="pip-lab-build005-explanation"
                id="build005Explanation"
            >

                <div class="pip-lab-build005-explanation-icon">

                    <i class="fa-solid fa-book-open"></i>

                </div>


                <div>

                    <span>
                        WHY?
                    </span>


                    <h3 id="build005ExplanationTitle">
                        Choose an answer first.
                    </h3>


                    <p id="build005ExplanationText">
                        The explanation will appear after you
                        check your answer.
                    </p>

                </div>

            </div>



            <!-- =========================================
                 SCORE
            ========================================== -->

            <div
                class="pip-lab-build005-score"
                id="build005Score"
            >

                <div class="pip-lab-build005-score-icon">

                    <i class="fa-solid fa-trophy"></i>

                </div>


                <span>
                    YOUR RESULT
                </span>


                <strong id="build005ScoreNumber">
                    0 / 6
                </strong>


                <h3 id="build005ScoreTitle">
                    Keep learning
                </h3>


                <p id="build005ScoreText">
                    Complete all challenges to see your result.
                </p>


                <button
                    type="button"
                    id="build005RestartButton"
                    class="pip-lab-build005-restart-button"
                >

                    <i class="fa-solid fa-rotate-right"></i>

                    Try Again

                </button>

            </div>



            <!-- =========================================
                 CONCEPT REVIEW
            ========================================== -->

            <div
                class="pip-lab-build005-review"
                id="build005Review"
            >

                <div class="pip-lab-build005-review-header">

                    <i class="fa-solid fa-graduation-cap"></i>

                    <div>

                        <span>
                            CONCEPT REVIEW
                        </span>

                        <strong>
                            What you learned
                        </strong>

                    </div>

                </div>


                <div
                    class="pip-lab-build005-review-list"
                    id="build005ReviewList"
                >
                </div>

            </div>

        </div>
    `;


    calculator.insertAdjacentElement(
        "afterend",
        section
    );
}


/* =========================================================
   BUILD 005 LOGIC
   ========================================================= */

function setupBuild005() {

    const questionNumber =
        document.getElementById(
            "build005QuestionNumber"
        );

    const category =
        document.getElementById(
            "build005Category"
        );

    const question =
        document.getElementById(
            "build005Question"
        );

    const scenario =
        document.getElementById(
            "build005Scenario"
        );

    const options =
        document.getElementById(
            "build005Options"
        );

    const progressText =
        document.getElementById(
            "build005ProgressText"
        );

    const progressBar =
        document.getElementById(
            "build005ProgressBar"
        );

    const checkButton =
        document.getElementById(
            "build005CheckButton"
        );

    const nextButton =
        document.getElementById(
            "build005NextButton"
        );

    const answerStatus =
        document.getElementById(
            "build005AnswerStatus"
        );

    const explanationTitle =
        document.getElementById(
            "build005ExplanationTitle"
        );

    const explanationText =
        document.getElementById(
            "build005ExplanationText"
        );

    const explanation =
        document.getElementById(
            "build005Explanation"
        );

    const scoreArea =
        document.getElementById(
            "build005Score"
        );

    const scoreNumber =
        document.getElementById(
            "build005ScoreNumber"
        );

    const scoreTitle =
        document.getElementById(
            "build005ScoreTitle"
        );

    const scoreText =
        document.getElementById(
            "build005ScoreText"
        );

    const restartButton =
        document.getElementById(
            "build005RestartButton"
        );

    const reviewList =
        document.getElementById(
            "build005ReviewList"
        );


    if (
        !questionNumber ||
        !category ||
        !question ||
        !scenario ||
        !options ||
        !checkButton ||
        !nextButton
    ) {
        return;
    }


    /* =====================================================
       QUESTIONS
    ===================================================== */

    const questions = [

        {
            category:
                "STOP LOSS",

            question:
                "If your stop loss becomes wider while your planned monetary risk stays the same, what generally happens to your position size?",

            scenario: `
                <div class="pip-lab-build005-scenario-row">

                    <div>
                        <span>ACCOUNT</span>
                        <strong>$1,000</strong>
                    </div>

                    <div>
                        <span>RISK</span>
                        <strong>1%</strong>
                    </div>

                    <div class="changed">
                        <span>STOP</span>
                        <strong>30 → 60 pips</strong>
                    </div>

                </div>
            `,

            options: [
                "It generally becomes larger",
                "It generally becomes smaller",
                "It always stays exactly the same"
            ],

            answer:
                1,

            explanationTitle:
                "A wider stop generally requires a smaller position.",

            explanation:
                "If you keep the planned monetary risk the same, doubling the stop distance means the position generally needs to become smaller. Otherwise the same position would have more room to create a larger monetary loss.",

            concept:
                "Stop distance ↔ Position size"

        },


        {
            category:
                "RISK PERCENTAGE",

            question:
                "Your account is $1,000. What happens to your maximum planned monetary risk when you change risk from 1% to 2%?",

            scenario: `
                <div class="pip-lab-build005-formula-card">

                    <div>
                        <span>ACCOUNT</span>
                        <strong>$1,000</strong>
                    </div>

                    <div>
                        <span>OLD RISK</span>
                        <strong>1%</strong>
                    </div>

                    <div>
                        <span>NEW RISK</span>
                        <strong>2%</strong>
                    </div>

                </div>
            `,

            options: [
                "It decreases",
                "It stays at exactly $10",
                "It increases"
            ],

            answer:
                2,

            explanationTitle:
                "The selected risk percentage changes the planned monetary amount.",

            explanation:
                "At 1% of a $1,000 account, the planned amount is $10. At 2%, the planned amount becomes $20. The percentage is being applied to the account balance.",

            concept:
                "Account balance × Risk %"

        },


        {
            category:
                "ACCOUNT BALANCE",

            question:
                "Two traders both select 1% risk. Trader A has $1,000 and Trader B has $5,000. Who has the larger planned monetary risk?",

            scenario: `
                <div class="pip-lab-build005-scenario-row">

                    <div>
                        <span>TRADER A</span>
                        <strong>$1,000</strong>
                        <small>1% risk</small>
                    </div>

                    <div>
                        <span>TRADER B</span>
                        <strong>$5,000</strong>
                        <small>1% risk</small>
                    </div>

                </div>
            `,

            options: [
                "Trader A",
                "Trader B",
                "Both are exactly $10"
            ],

            answer:
                1,

            explanationTitle:
                "The same percentage can represent different amounts of money.",

            explanation:
                "1% of $1,000 is $10, while 1% of $5,000 is $50. The percentage is the same, but the account balances are different.",

            concept:
                "Risk percentage depends on account size"

        },


        {
            category:
                "TAKE PROFIT",

            question:
                "If your position size and pip value stay the same, what generally happens to potential reward when your target changes from 40 pips to 80 pips?",

            scenario: `
                <div class="pip-lab-build005-scenario-row">

                    <div>
                        <span>POSITION</span>
                        <strong>Same</strong>
                    </div>

                    <div>
                        <span>PIP VALUE</span>
                        <strong>Same</strong>
                    </div>

                    <div class="changed">
                        <span>TARGET</span>
                        <strong>40 → 80 pips</strong>
                    </div>

                </div>
            `,

            options: [
                "Potential reward generally increases",
                "Potential reward generally decreases",
                "Potential reward must become zero"
            ],

            answer:
                0,

            explanationTitle:
                "A larger target distance generally increases potential reward.",

            explanation:
                "If pip value and position size stay the same, doubling the target from 40 pips to 80 pips doubles the number of pips available for the calculation. This describes potential reward, not a guaranteed profit.",

            concept:
                "Target pips × Pip value"

        },


        {
            category:
                "PIPS & MONEY",

            question:
                "A trader has a 30-pip stop. Does that automatically mean the trader is risking exactly $30?",

            scenario: `
                <div class="pip-lab-build005-concept-card">

                    <div class="big-number">
                        30
                    </div>

                    <span>
                        PIPS
                    </span>

                    <p>
                        Stop-loss distance
                    </p>

                </div>
            `,

            options: [
                "Yes, 30 pips always equals $30",
                "No, the monetary effect also depends on position size and pip value",
                "Yes, but only when the account is $1,000"
            ],

            answer:
                1,

            explanationTitle:
                "Pips describe distance. They do not automatically describe dollars.",

            explanation:
                "A pip tells you how far price moved. The monetary effect depends on the position size and the value of each pip for that position. That is why 30 pips can produce different monetary results for different position sizes.",

            concept:
                "Pips ≠ automatically money"

        },


        {
            category:
                "LOTS & QUANTITY",

            question:
                "Using the educational standard-lot example, what happens when position size changes from 0.10 lot to 0.50 lot?",

            scenario: `
                <div class="pip-lab-build005-scenario-row">

                    <div>
                        <span>OLD</span>
                        <strong>0.10 lot</strong>
                        <small>10,000 units</small>
                    </div>

                    <div class="changed">
                        <span>NEW</span>
                        <strong>0.50 lot</strong>
                        <small>50,000 units</small>
                    </div>

                </div>
            `,

            options: [
                "The position represents more units",
                "The position represents fewer units",
                "Lot size changes but quantity must always stay at 10,000"
            ],

            answer:
                0,

            explanationTitle:
                "A larger lot represents a larger position in the educational example.",

            explanation:
                "Using the standard 100,000-unit lot example, 0.10 lot represents about 10,000 units and 0.50 lot represents about 50,000 units. A larger position generally means the same price movement has a larger monetary effect.",

            concept:
                "Lot ↔ Quantity ↔ Position size"

        }

    ];


    let currentQuestion = 0;

    let score = 0;

    let answered = false;

    let selectedAnswer = null;

    let results = [];


    /* =====================================================
       LOAD QUESTION
    ===================================================== */

    function loadQuestion() {

        const item =
            questions[currentQuestion];


        answered =
            false;

        selectedAnswer =
            null;


        questionNumber.textContent =
            String(
                currentQuestion + 1
            ).padStart(
                2,
                "0"
            );


        category.textContent =
            item.category;


        question.textContent =
            item.question;


        scenario.innerHTML =
            item.scenario;


        progressText.textContent =
            "Question " +
            (
                currentQuestion + 1
            ) +
            " of " +
            questions.length;


        const progress =
            (
                currentQuestion /
                questions.length
            ) *
            100;


        progressBar.style.width =
            Math.max(
                8,
                progress
            ) +
            "%";


        options.innerHTML =
            "";


        answerStatus.innerHTML =
            "";


        explanationTitle.textContent =
            "Choose an answer first.";


        explanationText.textContent =
            "Think about the relationship between the numbers before checking your answer.";


        explanation.classList.remove(
            "correct",
            "incorrect"
        );


        checkButton.disabled =
            false;


        checkButton.style.display =
            "inline-flex";


        nextButton.disabled =
            true;


        nextButton.style.display =
            "none";


        item.options.forEach(
            function (
                optionText,
                index
            ) {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    "pip-lab-build005-option";


                button.dataset.answer =
                    index;


                button.innerHTML = `

                    <span
                        class="pip-lab-build005-option-letter"
                    >
                        ${String.fromCharCode(
                            65 + index
                        )}
                    </span>

                    <span>
                        ${optionText}
                    </span>

                `;


                button.addEventListener(
                    "click",
                    function () {

                        if (answered) {
                            return;
                        }


                        selectedAnswer =
                            index;


                        document
                            .querySelectorAll(
                                ".pip-lab-build005-option"
                            )
                            .forEach(
                                function (
                                    option
                                ) {

                                    option.classList.remove(
                                        "selected"
                                    );

                                }
                            );


                        button.classList.add(
                            "selected"
                        );

                    }
                );


                options.appendChild(
                    button
                );

            }
        );

    }


    /* =====================================================
       CHECK ANSWER
    ===================================================== */

    function checkAnswer() {

        if (
            selectedAnswer ===
            null
        ) {

            answerStatus.innerHTML = `

                <div class="pip-lab-build005-status-warning">

                    <i class="fa-solid fa-circle-exclamation"></i>

                    Please choose an answer first.

                </div>

            `;

            return;

        }


        if (answered) {
            return;
        }


        answered =
            true;


        const item =
            questions[currentQuestion];


        const isCorrect =
            selectedAnswer ===
            item.answer;


        if (isCorrect) {

            score++;

        }


        results.push({

            category:
                item.category,

            correct:
                isCorrect

        });


        const optionButtons =
            document.querySelectorAll(
                ".pip-lab-build005-option"
            );


        optionButtons.forEach(
            function (
                button
            ) {

                const index =
                    Number(
                        button.dataset.answer
                    );


                button.disabled =
                    true;


                if (
                    index ===
                    item.answer
                ) {

                    button.classList.add(
                        "correct"
                    );

                }


                if (
                    index ===
                    selectedAnswer &&
                    !isCorrect
                ) {

                    button.classList.add(
                        "incorrect"
                    );

                }

            }
        );


        if (isCorrect) {

            answerStatus.innerHTML = `

                <div class="pip-lab-build005-status-correct">

                    <i class="fa-solid fa-circle-check"></i>

                    Correct! You understood the relationship.

                </div>

            `;


            explanation.classList.add(
                "correct"
            );

        }
        else {

            answerStatus.innerHTML = `

                <div class="pip-lab-build005-status-incorrect">

                    <i class="fa-solid fa-circle-xmark"></i>

                    Not quite. Read the explanation below.

                </div>

            `;


            explanation.classList.add(
                "incorrect"
            );

        }


        explanationTitle.textContent =
            item.explanationTitle;


        explanationText.textContent =
            item.explanation;


        checkButton.style.display =
            "none";


        if (
            currentQuestion <
            questions.length - 1
        ) {

            nextButton.disabled =
                false;

            nextButton.style.display =
                "inline-flex";

        }
        else {

            finishQuiz();

        }

    }


    /* =====================================================
       NEXT QUESTION
    ===================================================== */

    function nextQuestion() {

        if (!answered) {
            return;
        }


        currentQuestion++;


        if (
            currentQuestion >=
            questions.length
        ) {

            finishQuiz();

            return;

        }


        loadQuestion();


        const section =
            document.getElementById(
                "build005PredictionLab"
            );


        if (section) {

            section.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "start"

            });

        }

    }


    /* =====================================================
       FINISH QUIZ
    ===================================================== */

    function finishQuiz() {

        const percentage =
            Math.round(
                (
                    score /
                    questions.length
                ) *
                100
            );


        scoreNumber.textContent =
            score +
            " / " +
            questions.length;


        scoreArea.classList.add(
            "show"
        );


        if (
            percentage >= 90
        ) {

            scoreTitle.textContent =
                "Excellent foundation!";

            scoreText.textContent =
                "You understand the key relationships between pips, risk, position size, lots and targets.";

        }
        else if (
            percentage >= 70
        ) {

            scoreTitle.textContent =
                "Strong progress!";

            scoreText.textContent =
                "You have a good foundation. Review the concepts you missed and try again.";

        }
        else if (
            percentage >= 50
        ) {

            scoreTitle.textContent =
                "Keep practicing!";

            scoreText.textContent =
                "You understand some of the relationships, but a little more practice will make them clearer.";

        }
        else {

            scoreTitle.textContent =
                "Let's strengthen the basics.";

            scoreText.textContent =
                "Don't worry about the score. Review the explanations and try the challenges again.";

        }


        progressText.textContent =
            "Completed — " +
            questions.length +
            " of " +
            questions.length;


        progressBar.style.width =
            "100%";


        showConceptReview();


        scoreArea.scrollIntoView({

            behavior:
                "smooth",

            block:
                "center"

        });

    }


    /* =====================================================
       CONCEPT REVIEW
    ===================================================== */

    function showConceptReview() {

        if (!reviewList) {
            return;
        }


        reviewList.innerHTML =
            "";


        const concepts = [

            {
                title:
                    "Stop Loss ↔ Position Size",

                text:
                    "A wider stop generally requires a smaller position when planned monetary risk stays fixed."

            },

            {
                title:
                    "Account Balance × Risk %",

                text:
                    "The selected percentage represents a planned monetary amount based on account balance."

            },

            {
                title:
                    "Pips ≠ Money",

                text:
                    "Pips describe price distance. Pip value and position size help determine the monetary effect."

            },

            {
                title:
                    "Target ↔ Potential Reward",

                text:
                    "With the same pip value, a larger target distance generally creates a larger potential reward."

            },

            {
                title:
                    "Lot ↔ Quantity",

                text:
                    "Lot size is a way to express position size. Quantity describes the units represented under the contract specification."

            }

        ];


        concepts.forEach(
            function (
                concept
            ) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "pip-lab-build005-review-item";


                item.innerHTML = `

                    <div>

                        <i class="fa-solid fa-check"></i>

                    </div>


                    <section>

                        <strong>
                            ${concept.title}
                        </strong>

                        <p>
                            ${concept.text}
                        </p>

                    </section>

                `;


                reviewList.appendChild(
                    item
                );

            }
        );

    }


    /* =====================================================
       RESTART
    ===================================================== */

    function restartQuiz() {

        currentQuestion =
            0;

        score =
            0;

        answered =
            false;

        selectedAnswer =
            null;

        results =
            [];


        scoreArea.classList.remove(
            "show"
        );


        explanation.classList.remove(
            "correct",
            "incorrect"
        );


        loadQuestion();


        const section =
            document.getElementById(
                "build005PredictionLab"
            );


        if (section) {

            section.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "start"

            });

        }

    }


    /* =====================================================
       EVENTS
    ===================================================== */

    checkButton.addEventListener(
        "click",
        checkAnswer
    );


    nextButton.addEventListener(
        "click",
        nextQuestion
    );


    if (restartButton) {

        restartButton.addEventListener(
            "click",
            restartQuiz
        );

    }


    /* =====================================================
       START
    ===================================================== */

    loadQuestion();

}


/* =========================================================
   BUILD 005 AUTO INITIALIZATION
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initBuild005
    );

}
else {

    initBuild005();

}

/* =========================================================
   BUILD 006
   RISK & REWARD VISUALIZER
   ========================================================= */

function initBuild006() {

    if (document.getElementById("build006Visualizer")) {
        return;
    }

    const calculator = document.getElementById("calculator");

    if (!calculator) {
        return;
    }

    createBuild006Markup(calculator);
    setupBuild006();
}


/* =========================================================
   BUILD 006 MARKUP
   ========================================================= */

function createBuild006Markup(calculator) {

    const section = document.createElement("section");

    section.id = "build006Visualizer";
    section.className = "pip-lab-build006";

    section.innerHTML = `

        <!-- HEADER -->

        <div class="pip-lab-build006-header">

            <span class="pip-lab-build006-badge">
                <i class="fa-solid fa-crosshairs"></i>
                Build 006
            </span>

            <h2>
                Risk & Reward Visualizer
            </h2>

            <p>
                Build a trade and see the relationship between
                entry, stop loss, take profit, pips, money and risk-to-reward.
            </p>

        </div>


        <!-- MAIN PANEL -->

        <div class="pip-lab-build006-panel">


            <!-- INTRO -->

            <div class="pip-lab-build006-intro">

                <div class="pip-lab-build006-intro-icon">
                    <i class="fa-solid fa-eye"></i>
                </div>

                <div>

                    <span>
                        SEE THE TRADE
                    </span>

                    <h3>
                        Don't just calculate the trade. Visualize it.
                    </h3>

                    <p>
                        Move the entry, stop loss and take profit.
                        The visualizer will immediately show the
                        distance and planned monetary relationship.
                    </p>

                </div>

            </div>


            <!-- CONTROLS -->

            <div class="pip-lab-build006-controls">

                <div class="pip-lab-build006-section-title">

                    <span>
                        TRADE SETUP
                    </span>

                    <strong>
                        Create your scenario
                    </strong>

                </div>


                <!-- DIRECTION -->

                <div class="pip-lab-build006-direction">

                    <button
                        type="button"
                        class="pip-lab-build006-direction-btn active"
                        data-direction="buy"
                        id="build006BuyButton"
                    >
                        <i class="fa-solid fa-arrow-trend-up"></i>
                        BUY
                    </button>

                    <button
                        type="button"
                        class="pip-lab-build006-direction-btn"
                        data-direction="sell"
                        id="build006SellButton"
                    >
                        <i class="fa-solid fa-arrow-trend-down"></i>
                        SELL
                    </button>

                </div>


                <!-- INPUTS -->

                <div class="pip-lab-build006-input-grid">


                    <div class="pip-lab-build006-field">

                        <label for="build006Entry">
                            Entry Price
                        </label>

                        <input
                            id="build006Entry"
                            type="number"
                            step="0.00001"
                            value="1.10000"
                        >

                        <small>
                            Price where the trade begins
                        </small>

                    </div>


                    <div class="pip-lab-build006-field">

                        <label for="build006Stop">
                            Stop Loss
                        </label>

                        <input
                            id="build006Stop"
                            type="number"
                            step="0.00001"
                            value="1.09700"
                        >

                        <small>
                            Price where the planned loss is limited
                        </small>

                    </div>


                    <div class="pip-lab-build006-field">

                        <label for="build006Target">
                            Take Profit
                        </label>

                        <input
                            id="build006Target"
                            type="number"
                            step="0.00001"
                            value="1.10600"
                        >

                        <small>
                            Price where the planned target is reached
                        </small>

                    </div>


                    <div class="pip-lab-build006-field">

                        <label for="build006Lot">
                            Position Size
                        </label>

                        <div class="pip-lab-build006-input-with-unit">

                            <input
                                id="build006Lot"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value="0.10"
                            >

                            <span>
                                lot
                            </span>

                        </div>

                        <small>
                            Used for the educational money calculation
                        </small>

                    </div>

                </div>

            </div>


            <!-- VISUALIZER -->

            <div class="pip-lab-build006-visual-area">

                <div class="pip-lab-build006-visual-header">

                    <div>

                        <span>
                            TRADE MAP
                        </span>

                        <strong id="build006VisualDirection">
                            BUY SCENARIO
                        </strong>

                    </div>

                    <div
                        class="pip-lab-build006-status"
                        id="build006SetupStatus"
                    >
                        Valid setup
                    </div>

                </div>


                <div class="pip-lab-build006-chart">


                    <!-- TP -->

                    <div
                        class="pip-lab-build006-price-row reward"
                        id="build006TPRow"
                    >

                        <div class="pip-lab-build006-price-line">

                            <span class="pip-lab-build006-line"></span>

                            <span class="pip-lab-build006-label">
                                TAKE PROFIT
                            </span>

                            <strong id="build006TPPrice">
                                1.10600
                            </strong>

                        </div>

                        <div class="pip-lab-build006-distance">

                            <strong id="build006TPPips">
                                +60 pips
                            </strong>

                            <span>
                                potential reward distance
                            </span>

                        </div>

                    </div>


                    <!-- ENTRY -->

                    <div
                        class="pip-lab-build006-price-row entry"
                    >

                        <div class="pip-lab-build006-price-line">

                            <span class="pip-lab-build006-line"></span>

                            <span class="pip-lab-build006-label">
                                ENTRY
                            </span>

                            <strong id="build006EntryPrice">
                                1.10000
                            </strong>

                        </div>

                        <div class="pip-lab-build006-distance">

                            <strong>
                                ENTRY
                            </strong>

                            <span>
                                trade starting point
                            </span>

                        </div>

                    </div>


                    <!-- SL -->

                    <div
                        class="pip-lab-build006-price-row risk"
                        id="build006SLRow"
                    >

                        <div class="pip-lab-build006-price-line">

                            <span class="pip-lab-build006-line"></span>

                            <span class="pip-lab-build006-label">
                                STOP LOSS
                            </span>

                            <strong id="build006SLPrice">
                                1.09700
                            </strong>

                        </div>

                        <div class="pip-lab-build006-distance">

                            <strong id="build006SLPips">
                                -30 pips
                            </strong>

                            <span>
                                planned risk distance
                            </span>

                        </div>

                    </div>


                    <!-- CENTER ARROW -->

                    <div
                        class="pip-lab-build006-trade-arrow"
                        id="build006TradeArrow"
                    >

                        <i class="fa-solid fa-arrow-down"></i>

                    </div>

                </div>

            </div>


            <!-- METRICS -->

            <div class="pip-lab-build006-metrics">


                <div class="pip-lab-build006-metric risk">

                    <span>
                        PLANNED RISK
                    </span>

                    <strong id="build006RiskMoney">
                        $30.00
                    </strong>

                    <small>
                        if stop is reached
                    </small>

                </div>


                <div class="pip-lab-build006-metric reward">

                    <span>
                        POTENTIAL REWARD
                    </span>

                    <strong id="build006RewardMoney">
                        $60.00
                    </strong>

                    <small>
                        if target is reached
                    </small>

                </div>


                <div class="pip-lab-build006-metric">

                    <span>
                        RISK : REWARD
                    </span>

                    <strong id="build006RR">
                        1 : 2.00
                    </strong>

                    <small>
                        potential relationship
                    </small>

                </div>


                <div class="pip-lab-build006-metric">

                    <span>
                        POSITION
                    </span>

                    <strong id="build006Quantity">
                        10,000
                    </strong>

                    <small>
                        educational units
                    </small>

                </div>

            </div>


            <!-- EXPLANATION -->

            <div
                class="pip-lab-build006-explanation"
                id="build006Explanation"
            >

                <div class="pip-lab-build006-explanation-icon">

                    <i class="fa-solid fa-graduation-cap"></i>

                </div>

                <div>

                    <span>
                        WHAT THIS TRADE MEANS
                    </span>

                    <h3 id="build006ExplanationTitle">
                        Your potential reward is twice your planned risk.
                    </h3>

                    <p id="build006ExplanationText">
                        The entry-to-stop distance is 30 pips and the
                        entry-to-target distance is 60 pips. That creates
                        a 1:2 risk-to-reward relationship in this scenario.
                    </p>

                </div>

            </div>


            <!-- LESSON CARDS -->

            <div class="pip-lab-build006-lessons">


                <div class="pip-lab-build006-lesson">

                    <div class="pip-lab-build006-lesson-icon risk">

                        <i class="fa-solid fa-shield-halved"></i>

                    </div>

                    <div>

                        <span>
                            RISK
                        </span>

                        <strong>
                            What could be lost
                        </strong>

                        <p>
                            The stop-loss distance describes how far
                            price can move against the trade before
                            the planned exit level is reached.
                        </p>

                    </div>

                </div>


                <div class="pip-lab-build006-lesson">

                    <div class="pip-lab-build006-lesson-icon reward">

                        <i class="fa-solid fa-bullseye"></i>

                    </div>

                    <div>

                        <span>
                            REWARD
                        </span>

                        <strong>
                            What could potentially be gained
                        </strong>

                        <p>
                            The take-profit distance describes the
                            planned target. It is a potential outcome,
                            not a guaranteed profit.
                        </p>

                    </div>

                </div>


                <div class="pip-lab-build006-lesson">

                    <div class="pip-lab-build006-lesson-icon">

                        <i class="fa-solid fa-scale-balanced"></i>

                    </div>

                    <div>

                        <span>
                            RISK : REWARD
                        </span>

                        <strong>
                            Compare the two distances
                        </strong>

                        <p>
                            A 1:2 relationship means the potential
                            reward distance is twice the planned
                            risk distance.
                        </p>

                    </div>

                </div>

            </div>


            <!-- WARNING -->

            <div class="pip-lab-build006-warning">

                <i class="fa-solid fa-circle-info"></i>

                <div>

                    <strong>
                        Important
                    </strong>

                    <p>
                        A higher risk-to-reward ratio does not guarantee
                        that a trade will win. This visualizer describes
                        the planned setup only. Real execution can differ.
                    </p>

                </div>

            </div>

        </div>

    `;

    calculator.insertAdjacentElement(
        "afterend",
        section
    );
}


/* =========================================================
   BUILD 006 LOGIC
   ========================================================= */

function setupBuild006() {

    const buyButton =
        document.getElementById(
            "build006BuyButton"
        );

    const sellButton =
        document.getElementById(
            "build006SellButton"
        );

    const entryInput =
        document.getElementById(
            "build006Entry"
        );

    const stopInput =
        document.getElementById(
            "build006Stop"
        );

    const targetInput =
        document.getElementById(
            "build006Target"
        );

    const lotInput =
        document.getElementById(
            "build006Lot"
        );

    const visualDirection =
        document.getElementById(
            "build006VisualDirection"
        );

    const setupStatus =
        document.getElementById(
            "build006SetupStatus"
        );

    const tpPrice =
        document.getElementById(
            "build006TPPrice"
        );

    const slPrice =
        document.getElementById(
            "build006SLPrice"
        );

    const entryPrice =
        document.getElementById(
            "build006EntryPrice"
        );

    const tpPips =
        document.getElementById(
            "build006TPPips"
        );

    const slPips =
        document.getElementById(
            "build006SLPips"
        );

    const riskMoney =
        document.getElementById(
            "build006RiskMoney"
        );

    const rewardMoney =
        document.getElementById(
            "build006RewardMoney"
        );

    const rr =
        document.getElementById(
            "build006RR"
        );

    const quantity =
        document.getElementById(
            "build006Quantity"
        );

    const explanationTitle =
        document.getElementById(
            "build006ExplanationTitle"
        );

    const explanationText =
        document.getElementById(
            "build006ExplanationText"
        );

    const tradeArrow =
        document.getElementById(
            "build006TradeArrow"
        );


    if (
        !buyButton ||
        !sellButton ||
        !entryInput ||
        !stopInput ||
        !targetInput ||
        !lotInput
    ) {
        return;
    }


    let direction = "buy";


    /* =====================================================
       FORMATTERS
       ===================================================== */

    function formatPrice(value) {

        return Number(value).toFixed(5);

    }


    function formatMoney(value) {

        return (
            "$" +
            Number(value).toFixed(2)
        );

    }


    function formatNumber(value) {

        return Number(value).toLocaleString(
            "en-US"
        );

    }


    function formatPips(value) {

        const rounded =
            Number(value).toFixed(1);

        return (
            rounded +
            " pips"
        );

    }


    /* =====================================================
       DIRECTION
       ===================================================== */

    function setDirection(
        newDirection
    ) {

        direction =
            newDirection;


        buyButton.classList.toggle(
            "active",
            direction === "buy"
        );


        sellButton.classList.toggle(
            "active",
            direction === "sell"
        );


        updateBuild006();

    }


    buyButton.addEventListener(
        "click",
        function () {

            setDirection("buy");

        }
    );


    sellButton.addEventListener(
        "click",
        function () {

            setDirection("sell");

        }
    );


    /* =====================================================
       CALCULATION
       ===================================================== */

    function updateBuild006() {

        const entry =
            Number(
                entryInput.value
            );

        const stop =
            Number(
                stopInput.value
            );

        const target =
            Number(
                targetInput.value
            );

        const lots =
            Number(
                lotInput.value
            );


        if (
            !Number.isFinite(entry) ||
            !Number.isFinite(stop) ||
            !Number.isFinite(target) ||
            !Number.isFinite(lots) ||
            entry <= 0 ||
            stop <= 0 ||
            target <= 0 ||
            lots <= 0
        ) {

            setupStatus.textContent =
                "Enter valid values";

            setupStatus.classList.add(
                "invalid"
            );

            return;

        }


        /*
         * Educational EUR/USD-style calculation.
         *
         * One standard lot =
         * 100,000 units
         *
         * Approximate pip value =
         * $10 per standard lot
         */

        const units =
            lots *
            100000;


        const pipValue =
            lots *
            10;


        let stopDistance;

        let targetDistance;

        let validSetup =
            true;


        if (
            direction === "buy"
        ) {

            stopDistance =
                entry -
                stop;

            targetDistance =
                target -
                entry;


        }
        else {

            stopDistance =
                stop -
                entry;

            targetDistance =
                entry -
                target;

        }


        const stopPips =
            Math.abs(
                stopDistance
            ) *
            10000;


        const targetPips =
            Math.abs(
                targetDistance
            ) *
            10000;


        /*
         * Validate direction.
         */

        if (
            direction === "buy"
        ) {

            if (
                stop >= entry ||
                target <= entry
            ) {

                validSetup =
                    false;

            }

        }
        else {

            if (
                stop <= entry ||
                target >= entry
            ) {

                validSetup =
                    false;

            }

        }


        /*
         * Money calculations.
         */

        const plannedRisk =
            stopPips *
            pipValue;


        const potentialReward =
            targetPips *
            pipValue;


        let riskReward =
            0;


        if (
            stopPips > 0
        ) {

            riskReward =
                targetPips /
                stopPips;

        }


        /* =================================================
           TEXT
        ================================================= */

        entryPrice.textContent =
            formatPrice(
                entry
            );


        slPrice.textContent =
            formatPrice(
                stop
            );


        tpPrice.textContent =
            formatPrice(
                target
            );


        quantity.textContent =
            formatNumber(
                Math.round(
                    units
                )
            );


        if (
            direction === "buy"
        ) {

            slPips.textContent =
                "-" +
                formatPips(
                    stopPips
                );

            tpPips.textContent =
                "+" +
                formatPips(
                    targetPips
                );

        }
        else {

            slPips.textContent =
                "-" +
                formatPips(
                    stopPips
                );

            tpPips.textContent =
                "+" +
                formatPips(
                    targetPips
                );

        }


        riskMoney.textContent =
            formatMoney(
                plannedRisk
            );


        rewardMoney.textContent =
            formatMoney(
                potentialReward
            );


        rr.textContent =
            "1 : " +
            riskReward.toFixed(2);


        visualDirection.textContent =
            direction === "buy"
                ? "BUY SCENARIO"
                : "SELL SCENARIO";


        /* =================================================
           ARROW
        ================================================= */

        if (
            direction === "buy"
        ) {

            tradeArrow.innerHTML =
                `<i class="fa-solid fa-arrow-down"></i>`;

        }
        else {

            tradeArrow.innerHTML =
                `<i class="fa-solid fa-arrow-up"></i>`;

        }


        /* =================================================
           VALIDATION
        ================================================= */

        if (!validSetup) {

            setupStatus.textContent =
                direction === "buy"
                    ? "Check BUY levels"
                    : "Check SELL levels";


            setupStatus.classList.add(
                "invalid"
            );


            explanationTitle.textContent =
                "Your price levels do not match the selected direction.";


            if (
                direction === "buy"
            ) {

                explanationText.textContent =
                    "For this educational BUY example, the stop should be below entry and the target should be above entry.";

            }
            else {

                explanationText.textContent =
                    "For this educational SELL example, the stop should be above entry and the target should be below entry.";

            }


            return;

        }


        setupStatus.textContent =
            "Valid setup";


        setupStatus.classList.remove(
            "invalid"
        );


        /* =================================================
           EXPLANATION
        ================================================= */

        if (
            riskReward >= 2
        ) {

            explanationTitle.textContent =
                "Your potential reward is " +
                riskReward.toFixed(2) +
                " times the planned risk.";


            explanationText.textContent =
                "The trade has " +
                targetPips.toFixed(1) +
                " pips of potential reward distance and " +
                stopPips.toFixed(1) +
                " pips of planned risk distance. This creates a 1:" +
                riskReward.toFixed(2) +
                " relationship. Remember: the ratio does not guarantee the trade will win.";

        }
        else if (
            riskReward >= 1
        ) {

            explanationTitle.textContent =
                "The potential reward is at least as large as the planned risk.";


            explanationText.textContent =
                "This setup has " +
                targetPips.toFixed(1) +
                " pips of potential reward versus " +
                stopPips.toFixed(1) +
                " pips of planned risk. The ratio is 1:" +
                riskReward.toFixed(2) +
                ".";

        }
        else {

            explanationTitle.textContent =
                "The planned risk distance is larger than the reward distance.";


            explanationText.textContent =
                "This setup has " +
                stopPips.toFixed(1) +
                " pips of planned risk versus " +
                targetPips.toFixed(1) +
                " pips of potential reward. That creates a ratio below 1:1.";

        }

    }


    /* =====================================================
       INPUT EVENTS
       ===================================================== */

    [
        entryInput,
        stopInput,
        targetInput,
        lotInput
    ].forEach(
        function (input) {

            input.addEventListener(
                "input",
                updateBuild006
            );

            input.addEventListener(
                "change",
                updateBuild006
            );

        }
    );


    /* =====================================================
       INITIAL UPDATE
       ===================================================== */

    updateBuild006();

}


/* =========================================================
   BUILD 006 AUTO INITIALIZATION
   ========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initBuild006
    );

}
else {

    initBuild006();

}

/* =========================================================
   BUILD 007
   BREAK-EVEN & WIN-RATE LAB
   ========================================================= */

function initBuild007() {

    if (document.getElementById("build007WinRateLab")) {
        return;
    }

    const build006 =
        document.getElementById("build006Visualizer");

    if (!build006) {
        return;
    }

    createBuild007Markup(build006);
    setupBuild007();
}


/* =========================================================
   BUILD 007 MARKUP
========================================================= */

function createBuild007Markup(build006) {

    const section = document.createElement("section");

    section.id = "build007WinRateLab";
    section.className = "pip-lab-build007";

    section.innerHTML = `

        <!-- HEADER -->

        <div class="pip-lab-build007-header">

            <span class="pip-lab-build007-badge">
                <i class="fa-solid fa-chart-pie"></i>
                Build 007
            </span>

            <h2>
                Break-Even & Win-Rate Lab
            </h2>

            <p>
                Learn how your risk-to-reward relationship affects
                the minimum win rate needed to mathematically break even.
            </p>

        </div>


        <!-- MAIN PANEL -->

        <div class="pip-lab-build007-panel">


            <!-- EDUCATION INTRO -->

            <div class="pip-lab-build007-intro">

                <div class="pip-lab-build007-intro-icon">
                    <i class="fa-solid fa-lightbulb"></i>
                </div>

                <div>

                    <span>
                        LEARN THE MATH
                    </span>

                    <h3>
                        You don't need to win every trade.
                    </h3>

                    <p>
                        Your win rate and your average risk-to-reward
                        relationship work together. Change the numbers
                        below and watch the result update instantly.
                    </p>

                </div>

            </div>


            <!-- INPUT AREA -->

            <div class="pip-lab-build007-input-area">

                <div class="pip-lab-build007-section-title">

                    <span>
                        YOUR TRADE MODEL
                    </span>

                    <strong>
                        Create a simple trading scenario
                    </strong>

                </div>


                <div class="pip-lab-build007-input-grid">


                    <!-- RISK -->

                    <div class="pip-lab-build007-field">

                        <label for="build007Risk">

                            Risk Per Trade

                        </label>

                        <div class="pip-lab-build007-money-input">

                            <span>$</span>

                            <input
                                id="build007Risk"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value="30"
                            >

                        </div>

                        <small>
                            Planned amount at risk on one trade
                        </small>

                    </div>


                    <!-- REWARD -->

                    <div class="pip-lab-build007-field">

                        <label for="build007Reward">

                            Reward Per Trade

                        </label>

                        <div class="pip-lab-build007-money-input">

                            <span>$</span>

                            <input
                                id="build007Reward"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value="60"
                            >

                        </div>

                        <small>
                            Potential reward when the target is reached
                        </small>

                    </div>


                    <!-- TRADES -->

                    <div class="pip-lab-build007-field">

                        <label for="build007Trades">

                            Total Trades

                        </label>

                        <input
                            id="build007Trades"
                            type="number"
                            min="1"
                            step="1"
                            value="10"
                        >

                        <small>
                            Number of trades in the experiment
                        </small>

                    </div>


                    <!-- WINS -->

                    <div class="pip-lab-build007-field">

                        <label for="build007Wins">

                            Winning Trades

                        </label>

                        <input
                            id="build007Wins"
                            type="number"
                            min="0"
                            step="1"
                            value="4"
                        >

                        <small>
                            Number of trades that reach the target
                        </small>

                    </div>

                </div>

            </div>


            <!-- LIVE SCORE -->

            <div class="pip-lab-build007-score">


                <div class="pip-lab-build007-score-header">

                    <div>

                        <span>
                            YOUR CURRENT EXPERIMENT
                        </span>

                        <strong id="build007ResultStatus">
                            Positive Result
                        </strong>

                    </div>

                    <div
                        class="pip-lab-build007-status"
                        id="build007Status"
                    >
                        PROFITABLE
                    </div>

                </div>


                <!-- WIN RATE -->

                <div class="pip-lab-build007-progress-box">

                    <div class="pip-lab-build007-progress-header">

                        <span>
                            ACTUAL WIN RATE
                        </span>

                        <strong id="build007WinRate">
                            40.00%
                        </strong>

                    </div>

                    <div class="pip-lab-build007-progress">

                        <div
                            class="pip-lab-build007-progress-fill"
                            id="build007WinRateBar"
                            style="width: 40%;"
                        ></div>

                        <div
                            class="pip-lab-build007-break-even-marker"
                            id="build007BreakEvenMarker"
                            style="left: 33.33%;"
                        >
                            <span>
                                BE
                            </span>
                        </div>

                    </div>

                    <div class="pip-lab-build007-progress-labels">

                        <span>
                            0%
                        </span>

                        <span id="build007BreakEvenLabel">
                            Break-even: 33.33%
                        </span>

                        <span>
                            100%
                        </span>

                    </div>

                </div>


                <!-- RESULT CARDS -->

                <div class="pip-lab-build007-result-grid">


                    <div class="pip-lab-build007-result-card">

                        <span>
                            WIN RATE
                        </span>

                        <strong id="build007WinRateCard">
                            40.00%
                        </strong>

                        <small>
                            actual wins ÷ total trades
                        </small>

                    </div>


                    <div class="pip-lab-build007-result-card">

                        <span>
                            LOSS RATE
                        </span>

                        <strong id="build007LossRate">
                            60.00%
                        </strong>

                        <small>
                            losing trades ÷ total trades
                        </small>

                    </div>


                    <div class="pip-lab-build007-result-card">

                        <span>
                            BREAK-EVEN WIN RATE
                        </span>

                        <strong id="build007BreakEvenRate">
                            33.33%
                        </strong>

                        <small>
                            mathematical minimum
                        </small>

                    </div>


                    <div class="pip-lab-build007-result-card">

                        <span>
                            RISK : REWARD
                        </span>

                        <strong id="build007RR">
                            1 : 2.00
                        </strong>

                        <small>
                            reward compared with risk
                        </small>

                    </div>

                </div>

            </div>


            <!-- MONEY RESULT -->

            <div class="pip-lab-build007-money-result">


                <div class="pip-lab-build007-money-card loss">

                    <span>
                        TOTAL LOSSES
                    </span>

                    <strong id="build007TotalLoss">
                        -$180.00
                    </strong>

                    <small id="build007LossCalculation">
                        6 losses × $30
                    </small>

                </div>


                <div class="pip-lab-build007-money-card win">

                    <span>
                        TOTAL WINNINGS
                    </span>

                    <strong id="build007TotalWin">
                        +$240.00
                    </strong>

                    <small id="build007WinCalculation">
                        4 wins × $60
                    </small>

                </div>


                <div class="pip-lab-build007-money-card net">

                    <span>
                        NET RESULT
                    </span>

                    <strong id="build007NetResult">
                        +$60.00
                    </strong>

                    <small>
                        wins minus losses
                    </small>

                </div>

            </div>


            <!-- BREAK EVEN EXPLANATION -->

            <div class="pip-lab-build007-break-even">


                <div class="pip-lab-build007-break-even-icon">

                    <i class="fa-solid fa-scale-balanced"></i>

                </div>


                <div>

                    <span>
                        BREAK-EVEN EXPLAINED
                    </span>

                    <h3 id="build007BreakEvenTitle">
                        At 1:2 risk-to-reward, you need about 33.33%
                        wins to break even.
                    </h3>

                    <p id="build007BreakEvenText">
                        With $30 of risk and $60 of potential reward,
                        one winning trade can offset two losing trades
                        mathematically.
                    </p>

                </div>

            </div>


            <!-- R:R EXAMPLES -->

            <div class="pip-lab-build007-examples">

                <div class="pip-lab-build007-section-title">

                    <span>
                        EXPERIMENT
                    </span>

                    <strong>
                        See how risk-to-reward changes break-even
                    </strong>

                </div>


                <div class="pip-lab-build007-example-grid">


                    <button
                        type="button"
                        class="pip-lab-build007-example"
                        data-risk="30"
                        data-reward="30"
                    >

                        <span>
                            1 : 1
                        </span>

                        <strong>
                            50%
                        </strong>

                        <small>
                            break-even win rate
                        </small>

                    </button>


                    <button
                        type="button"
                        class="pip-lab-build007-example active"
                        data-risk="30"
                        data-reward="60"
                    >

                        <span>
                            1 : 2
                        </span>

                        <strong>
                            33.33%
                        </strong>

                        <small>
                            break-even win rate
                        </small>

                    </button>


                    <button
                        type="button"
                        class="pip-lab-build007-example"
                        data-risk="30"
                        data-reward="90"
                    >

                        <span>
                            1 : 3
                        </span>

                        <strong>
                            25%
                        </strong>

                        <small>
                            break-even win rate
                        </small>

                    </button>


                    <button
                        type="button"
                        class="pip-lab-build007-example"
                        data-risk="30"
                        data-reward="120"
                    >

                        <span>
                            1 : 4
                        </span>

                        <strong>
                            20%
                        </strong>

                        <small>
                            break-even win rate
                        </small>

                    </button>

                </div>

            </div>


            <!-- EDUCATIONAL CARDS -->

            <div class="pip-lab-build007-lessons">


                <div class="pip-lab-build007-lesson">

                    <div class="pip-lab-build007-lesson-icon">

                        <i class="fa-solid fa-percent"></i>

                    </div>

                    <div>

                        <span>
                            WIN RATE
                        </span>

                        <strong>
                            How often you win
                        </strong>

                        <p>
                            Win rate is the percentage of completed
                            trades that were winners.
                        </p>

                    </div>

                </div>


                <div class="pip-lab-build007-lesson">

                    <div class="pip-lab-build007-lesson-icon">

                        <i class="fa-solid fa-arrow-trend-up"></i>

                    </div>

                    <div>

                        <span>
                            RISK : REWARD
                        </span>

                        <strong>
                            How much you seek compared with risk
                        </strong>

                        <p>
                            A 1:2 relationship means the potential
                            reward is twice the planned risk.
                        </p>

                    </div>

                </div>


                <div class="pip-lab-build007-lesson">

                    <div class="pip-lab-build007-lesson-icon">

                        <i class="fa-solid fa-calculator"></i>

                    </div>

                    <div>

                        <span>
                            BREAK-EVEN
                        </span>

                        <strong>
                            The mathematical balance point
                        </strong>

                        <p>
                            Break-even win rate is the win percentage
                            where wins and losses offset each other
                            before trading costs.
                        </p>

                    </div>

                </div>

            </div>


            <!-- IMPORTANT NOTE -->

            <div class="pip-lab-build007-warning">

                <i class="fa-solid fa-circle-info"></i>

                <div>

                    <strong>
                        Important
                    </strong>

                    <p>
                        Break-even calculations are simplified educational
                        mathematics. They do not include spread, commission,
                        slippage, swaps, execution differences or taxes.
                        A mathematical break-even point does not guarantee
                        real-world profitability.
                    </p>

                </div>

            </div>

        </div>
    `;

    build006.insertAdjacentElement(
        "afterend",
        section
    );
}


/* =========================================================
   BUILD 007 LOGIC
========================================================= */

function setupBuild007() {

    const riskInput =
        document.getElementById(
            "build007Risk"
        );

    const rewardInput =
        document.getElementById(
            "build007Reward"
        );

    const tradesInput =
        document.getElementById(
            "build007Trades"
        );

    const winsInput =
        document.getElementById(
            "build007Wins"
        );

    const winRate =
        document.getElementById(
            "build007WinRate"
        );

    const winRateCard =
        document.getElementById(
            "build007WinRateCard"
        );

    const lossRate =
        document.getElementById(
            "build007LossRate"
        );

    const breakEvenRate =
        document.getElementById(
            "build007BreakEvenRate"
        );

    const rr =
        document.getElementById(
            "build007RR"
        );

    const totalLoss =
        document.getElementById(
            "build007TotalLoss"
        );

    const totalWin =
        document.getElementById(
            "build007TotalWin"
        );

    const netResult =
        document.getElementById(
            "build007NetResult"
        );

    const lossCalculation =
        document.getElementById(
            "build007LossCalculation"
        );

    const winCalculation =
        document.getElementById(
            "build007WinCalculation"
        );

    const winRateBar =
        document.getElementById(
            "build007WinRateBar"
        );

    const breakEvenMarker =
        document.getElementById(
            "build007BreakEvenMarker"
        );

    const breakEvenLabel =
        document.getElementById(
            "build007BreakEvenLabel"
        );

    const resultStatus =
        document.getElementById(
            "build007ResultStatus"
        );

    const status =
        document.getElementById(
            "build007Status"
        );

    const breakEvenTitle =
        document.getElementById(
            "build007BreakEvenTitle"
        );

    const breakEvenText =
        document.getElementById(
            "build007BreakEvenText"
        );


    if (
        !riskInput ||
        !rewardInput ||
        !tradesInput ||
        !winsInput
    ) {
        return;
    }


    /* =====================================================
       FORMATTERS
    ===================================================== */

    function money(value) {

        const absolute =
            Math.abs(value);

        return (
            "$" +
            absolute.toFixed(2)
        );

    }


    function signedMoney(value) {

        if (value > 0) {

            return (
                "+$" +
                value.toFixed(2)
            );

        }

        if (value < 0) {

            return (
                "-$" +
                Math.abs(value).toFixed(2)
            );

        }

        return "$0.00";

    }


    function percent(value) {

        return (
            value.toFixed(2) +
            "%"
        );

    }


    /* =====================================================
       UPDATE
    ===================================================== */

    function updateBuild007() {

        let risk =
            Number(
                riskInput.value
            );

        let reward =
            Number(
                rewardInput.value
            );

        let trades =
            Math.floor(
                Number(
                    tradesInput.value
                )
            );

        let wins =
            Math.floor(
                Number(
                    winsInput.value
                )
            );


        /* -----------------------------------------------
           BASIC VALIDATION
        ----------------------------------------------- */

        if (
            !Number.isFinite(risk) ||
            risk <= 0
        ) {

            risk = 30;

            riskInput.value = 30;

        }


        if (
            !Number.isFinite(reward) ||
            reward <= 0
        ) {

            reward = 60;

            rewardInput.value = 60;

        }


        if (
            !Number.isFinite(trades) ||
            trades < 1
        ) {

            trades = 1;

            tradesInput.value = 1;

        }


        if (
            !Number.isFinite(wins) ||
            wins < 0
        ) {

            wins = 0;

            winsInput.value = 0;

        }


        /* -----------------------------------------------
           WINS CANNOT EXCEED TOTAL TRADES
        ----------------------------------------------- */

        if (
            wins > trades
        ) {

            wins = trades;

            winsInput.value =
                trades;

        }


        /*
         * Risk : Reward
         *
         * Example:
         *
         * Risk   = $30
         * Reward = $60
         *
         * R:R = 1:2
         */

        const riskReward =
            reward / risk;


        /*
         * Break-even win rate:
         *
         * Risk
         * ----------------
         * Risk + Reward
         *
         * Example:
         *
         * 30 / 90 = 33.33%
         */

        const breakEven =
            (
                risk /
                (
                    risk +
                    reward
                )
            ) *
            100;


        /*
         * Actual win rate.
         */

        const actualWinRate =
            (
                wins /
                trades
            ) *
            100;


        /*
         * Losses.
         */

        const losses =
            trades -
            wins;


        const actualLossRate =
            (
                losses /
                trades
            ) *
            100;


        /*
         * Money results.
         */

        const winningMoney =
            wins *
            reward;


        const losingMoney =
            losses *
            risk;


        const net =
            winningMoney -
            losingMoney;


        /* -----------------------------------------------
           RESULT TEXT
        ----------------------------------------------- */

        winRate.textContent =
            percent(
                actualWinRate
            );


        winRateCard.textContent =
            percent(
                actualWinRate
            );


        lossRate.textContent =
            percent(
                actualLossRate
            );


        breakEvenRate.textContent =
            percent(
                breakEven
            );


        rr.textContent =
            "1 : " +
            riskReward.toFixed(2);


        totalWin.textContent =
            "+" +
            money(
                winningMoney
            );


        totalLoss.textContent =
            "-" +
            money(
                losingMoney
            );


        netResult.textContent =
            signedMoney(
                net
            );


        lossCalculation.textContent =
            losses +
            " losses × $" +
            risk.toFixed(2);


        winCalculation.textContent =
            wins +
            " wins × $" +
            reward.toFixed(2);


        /* -----------------------------------------------
           PROGRESS BAR
        ----------------------------------------------- */

        winRateBar.style.width =
            Math.min(
                Math.max(
                    actualWinRate,
                    0
                ),
                100
            ) +
            "%";


        breakEvenMarker.style.left =
            Math.min(
                Math.max(
                    breakEven,
                    0
                ),
                100
            ) +
            "%";


        breakEvenLabel.textContent =
            "Break-even: " +
            percent(
                breakEven
            );


        /* -----------------------------------------------
           RESULT STATE
        ----------------------------------------------- */

        status.classList.remove(
            "profitable",
            "break-even",
            "losing"
        );


        if (
            actualWinRate >
            breakEven
        ) {

            status.textContent =
                "ABOVE BREAK-EVEN";

            status.classList.add(
                "profitable"
            );


            resultStatus.textContent =
                "Positive Mathematical Result";


        }
        else if (
            Math.abs(
                actualWinRate -
                breakEven
            ) < 0.0001
        ) {

            status.textContent =
                "BREAK-EVEN";

            status.classList.add(
                "break-even"
            );


            resultStatus.textContent =
                "Mathematical Break-Even";


        }
        else {

            status.textContent =
                "BELOW BREAK-EVEN";

            status.classList.add(
                "losing"
            );


            resultStatus.textContent =
                "Negative Mathematical Result";

        }


        /* -----------------------------------------------
           BREAK-EVEN EXPLANATION
        ----------------------------------------------- */

        breakEvenTitle.textContent =
            "At 1:" +
            riskReward.toFixed(2) +
            " risk-to-reward, you need about " +
            percent(breakEven) +
            " wins to break even.";


        if (
            riskReward === 1
        ) {

            breakEvenText.textContent =
                "When risk and reward are equal, you mathematically need a 50% win rate to offset the same number of winning and losing trades before trading costs.";

        }
        else if (
            riskReward > 1
        ) {

            breakEvenText.textContent =
                "Because the potential reward is larger than the planned risk, fewer winning trades can mathematically offset losing trades. At this ratio, the break-even point is " +
                percent(breakEven) +
                ".";

        }
        else {

            breakEvenText.textContent =
                "Because the planned risk is larger than the potential reward, a higher win rate is mathematically required to offset losing trades. The break-even point is " +
                percent(breakEven) +
                ".";

        }

    }


    /* =====================================================
       INPUT EVENTS
    ===================================================== */

    [
        riskInput,
        rewardInput,
        tradesInput,
        winsInput
    ].forEach(
        function(input) {

            input.addEventListener(
                "input",
                updateBuild007
            );

            input.addEventListener(
                "change",
                updateBuild007
            );

        }
    );


    /* =====================================================
       QUICK R:R EXAMPLES
    ===================================================== */

    const examples =
        document.querySelectorAll(
            ".pip-lab-build007-example"
        );


    examples.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const risk =
                        Number(
                            button.dataset.risk
                        );

                    const reward =
                        Number(
                            button.dataset.reward
                        );


                    if (
                        Number.isFinite(risk) &&
                        Number.isFinite(reward)
                    ) {

                        riskInput.value =
                            risk;

                        rewardInput.value =
                            reward;

                    }


                    examples.forEach(
                        function(item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    updateBuild007();

                }
            );

        }
    );


    /* =====================================================
       INITIAL CALCULATION
    ===================================================== */

    updateBuild007();

}


/* =========================================================
   BUILD 007 AUTO INITIALIZATION
========================================================= */

function waitForBuild007() {

    if (
        document.getElementById(
            "build006Visualizer"
        )
    ) {

        initBuild007();

        return;

    }


    setTimeout(
        waitForBuild007,
        100
    );

}


if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        waitForBuild007
    );

}
else {

    waitForBuild007();

}

/* =========================================================
   BUILD 008
   TRADE COST & REALITY LAB
   ========================================================= */

function initBuild008() {

    if (document.getElementById("build008RealityLab")) {
        return;
    }

    const build007 =
        document.getElementById("build007WinRateLab");

    if (!build007) {
        return;
    }

    createBuild008Markup(build007);
    setupBuild008();
}


/* =========================================================
   BUILD 008 MARKUP
========================================================= */

function createBuild008Markup(build007) {

    const section = document.createElement("section");

    section.id = "build008RealityLab";
    section.className = "pip-lab-build008";

    section.innerHTML = `

        <!-- HEADER -->

        <div class="pip-lab-build008-header">

            <span class="pip-lab-build008-badge">
                <i class="fa-solid fa-receipt"></i>
                Build 008
            </span>

            <h2>
                Trade Cost & Reality Lab
            </h2>

            <p>
                See how spread, commission, slippage and overnight
                costs can affect the simple risk-and-reward mathematics
                you learned in the previous builds.
            </p>

        </div>


        <!-- MAIN PANEL -->

        <div class="pip-lab-build008-panel">


            <!-- INTRO -->

            <div class="pip-lab-build008-intro">

                <div class="pip-lab-build008-intro-icon">
                    <i class="fa-solid fa-eye"></i>
                </div>

                <div>

                    <span>
                        REAL-WORLD VIEW
                    </span>

                    <h3>
                        The calculator is not the whole trade.
                    </h3>

                    <p>
                        A theoretical $60 reward does not automatically
                        mean $60 reaches your account. Trading costs and
                        execution differences can change the final result.
                    </p>

                </div>

            </div>


            <!-- TRADE INPUTS -->

            <div class="pip-lab-build008-input-area">

                <div class="pip-lab-build008-section-title">

                    <span>
                        TRADE MODEL
                    </span>

                    <strong>
                        Start with your planned trade
                    </strong>

                </div>


                <div class="pip-lab-build008-input-grid">


                    <!-- RISK -->

                    <div class="pip-lab-build008-field">

                        <label for="build008Risk">
                            Planned Risk
                        </label>

                        <div class="pip-lab-build008-money-input">

                            <span>$</span>

                            <input
                                id="build008Risk"
                                type="number"
                                min="0"
                                step="0.01"
                                value="30"
                            >

                        </div>

                        <small>
                            Planned loss before additional costs
                        </small>

                    </div>


                    <!-- REWARD -->

                    <div class="pip-lab-build008-field">

                        <label for="build008Reward">
                            Planned Reward
                        </label>

                        <div class="pip-lab-build008-money-input">

                            <span>$</span>

                            <input
                                id="build008Reward"
                                type="number"
                                min="0"
                                step="0.01"
                                value="60"
                            >

                        </div>

                        <small>
                            Potential reward before additional costs
                        </small>

                    </div>


                    <!-- WIN RATE -->

                    <div class="pip-lab-build008-field">

                        <label for="build008WinRate">
                            Win Rate
                        </label>

                        <div class="pip-lab-build008-percent-input">

                            <input
                                id="build008WinRate"
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value="40"
                            >

                            <span>%</span>

                        </div>

                        <small>
                            Used for the multi-trade experiment
                        </small>

                    </div>


                    <!-- TRADES -->

                    <div class="pip-lab-build008-field">

                        <label for="build008Trades">
                            Number of Trades
                        </label>

                        <input
                            id="build008Trades"
                            type="number"
                            min="1"
                            step="1"
                            value="10"
                        >

                        <small>
                            Number of trades in the experiment
                        </small>

                    </div>

                </div>

            </div>


            <!-- COSTS -->

            <div class="pip-lab-build008-cost-area">

                <div class="pip-lab-build008-section-title">

                    <span>
                        TRADING COSTS
                    </span>

                    <strong>
                        Add the costs that may affect the result
                    </strong>

                </div>


                <div class="pip-lab-build008-cost-grid">


                    <!-- SPREAD -->

                    <div class="pip-lab-build008-cost-card">

                        <div class="pip-lab-build008-cost-icon spread">

                            <i class="fa-solid fa-arrows-left-right"></i>

                        </div>

                        <div class="pip-lab-build008-cost-content">

                            <label for="build008Spread">
                                Spread Cost
                            </label>

                            <div class="pip-lab-build008-money-input">

                                <span>$</span>

                                <input
                                    id="build008Spread"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value="2"
                                >

                            </div>

                            <small>
                                Educational estimate per trade
                            </small>

                        </div>

                    </div>


                    <!-- COMMISSION -->

                    <div class="pip-lab-build008-cost-card">

                        <div class="pip-lab-build008-cost-icon commission">

                            <i class="fa-solid fa-file-invoice-dollar"></i>

                        </div>

                        <div class="pip-lab-build008-cost-content">

                            <label for="build008Commission">
                                Commission
                            </label>

                            <div class="pip-lab-build008-money-input">

                                <span>$</span>

                                <input
                                    id="build008Commission"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value="3"
                                >

                            </div>

                            <small>
                                Educational estimate per trade
                            </small>

                        </div>

                    </div>


                    <!-- SLIPPAGE -->

                    <div class="pip-lab-build008-cost-card">

                        <div class="pip-lab-build008-cost-icon slippage">

                            <i class="fa-solid fa-forward-step"></i>

                        </div>

                        <div class="pip-lab-build008-cost-content">

                            <label for="build008Slippage">
                                Slippage Cost
                            </label>

                            <div class="pip-lab-build008-money-input">

                                <span>$</span>

                                <input
                                    id="build008Slippage"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value="1"
                                >

                            </div>

                            <small>
                                Educational estimate per trade
                            </small>

                        </div>

                    </div>


                    <!-- SWAP -->

                    <div class="pip-lab-build008-cost-card">

                        <div class="pip-lab-build008-cost-icon swap">

                            <i class="fa-solid fa-clock"></i>

                        </div>

                        <div class="pip-lab-build008-cost-content">

                            <label for="build008Swap">
                                Swap / Overnight Cost
                            </label>

                            <div class="pip-lab-build008-money-input">

                                <span>$</span>

                                <input
                                    id="build008Swap"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value="0"
                                >

                            </div>

                            <small>
                                Applied only when relevant
                            </small>

                        </div>

                    </div>

                </div>


                <!-- TOTAL COST -->

                <div class="pip-lab-build008-total-cost">

                    <div>

                        <span>
                            TOTAL ESTIMATED COST / TRADE
                        </span>

                        <strong id="build008TotalCost">
                            $6.00
                        </strong>

                    </div>

                    <small>
                        Spread + commission + slippage + swap
                    </small>

                </div>

            </div>


            <!-- COMPARISON -->

            <div class="pip-lab-build008-comparison">

                <div class="pip-lab-build008-section-title">

                    <span>
                        BEFORE vs AFTER COSTS
                    </span>

                    <strong>
                        See what changes when costs are included
                    </strong>

                </div>


                <div class="pip-lab-build008-comparison-grid">


                    <!-- GROSS -->

                    <div class="pip-lab-build008-comparison-card gross">

                        <div class="pip-lab-build008-comparison-heading">

                            <span>
                                WITHOUT COSTS
                            </span>

                            <i class="fa-solid fa-calculator"></i>

                        </div>


                        <div class="pip-lab-build008-comparison-row">

                            <span>
                                Winning Trade
                            </span>

                            <strong id="build008GrossWin">
                                +$60.00
                            </strong>

                        </div>


                        <div class="pip-lab-build008-comparison-row">

                            <span>
                                Losing Trade
                            </span>

                            <strong id="build008GrossLoss">
                                -$30.00
                            </strong>

                        </div>


                        <div class="pip-lab-build008-comparison-row total">

                            <span>
                                Cost
                            </span>

                            <strong>
                                $0.00
                            </strong>

                        </div>

                    </div>


                    <!-- NET -->

                    <div class="pip-lab-build008-comparison-card net">

                        <div class="pip-lab-build008-comparison-heading">

                            <span>
                                WITH COSTS
                            </span>

                            <i class="fa-solid fa-receipt"></i>

                        </div>


                        <div class="pip-lab-build008-comparison-row">

                            <span>
                                Winning Trade
                            </span>

                            <strong id="build008NetWin">
                                +$54.00
                            </strong>

                        </div>


                        <div class="pip-lab-build008-comparison-row">

                            <span>
                                Losing Trade
                            </span>

                            <strong id="build008NetLoss">
                                -$36.00
                            </strong>

                        </div>


                        <div class="pip-lab-build008-comparison-row total">

                            <span>
                                Cost
                            </span>

                            <strong id="build008CostPerTrade">
                                $6.00
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            <!-- MULTI TRADE RESULT -->

            <div class="pip-lab-build008-result">

                <div class="pip-lab-build008-result-header">

                    <div>

                        <span>
                            MULTI-TRADE EXPERIMENT
                        </span>

                        <strong id="build008ResultTitle">
                            Costs reduce the theoretical result
                        </strong>

                    </div>

                    <div
                        class="pip-lab-build008-result-status"
                        id="build008ResultStatus"
                    >
                        POSITIVE
                    </div>

                </div>


                <div class="pip-lab-build008-result-grid">


                    <div class="pip-lab-build008-result-card">

                        <span>
                            GROSS RESULT
                        </span>

                        <strong id="build008GrossResult">
                            +$60.00
                        </strong>

                        <small>
                            before trading costs
                        </small>

                    </div>


                    <div class="pip-lab-build008-result-card">

                        <span>
                            TOTAL COSTS
                        </span>

                        <strong id="build008TotalCosts">
                            -$60.00
                        </strong>

                        <small>
                            all trades combined
                        </small>

                    </div>


                    <div class="pip-lab-build008-result-card">

                        <span>
                            NET RESULT
                        </span>

                        <strong id="build008NetResult">
                            $0.00
                        </strong>

                        <small>
                            after estimated costs
                        </small>

                    </div>


                    <div class="pip-lab-build008-result-card">

                        <span>
                            COST / TRADE
                        </span>

                        <strong id="build008CostResult">
                            $6.00
                        </strong>

                        <small>
                            estimated average
                        </small>

                    </div>

                </div>

            </div>


            <!-- BREAK EVEN AFTER COSTS -->

            <div class="pip-lab-build008-breakeven">

                <div class="pip-lab-build008-breakeven-icon">

                    <i class="fa-solid fa-scale-balanced"></i>

                </div>

                <div>

                    <span>
                        BREAK-EVEN AFTER COSTS
                    </span>

                    <h3 id="build008BreakEvenTitle">
                        Your required win rate changes when costs are included.
                    </h3>

                    <p id="build008BreakEvenText">
                        The simplified break-even point before costs is
                        33.33%. After the estimated trading cost, the
                        required win rate becomes higher.
                    </p>

                </div>

            </div>


            <!-- EDUCATIONAL CARDS -->

            <div class="pip-lab-build008-lessons">


                <div class="pip-lab-build008-lesson">

                    <div class="pip-lab-build008-lesson-icon">

                        <i class="fa-solid fa-arrows-left-right"></i>

                    </div>

                    <div>

                        <span>
                            SPREAD
                        </span>

                        <strong>
                            The bid/ask difference
                        </strong>

                        <p>
                            Spread is the difference between the bid
                            and ask prices. It can affect the effective
                            entry and exit cost of a trade.
                        </p>

                    </div>

                </div>


                <div class="pip-lab-build008-lesson">

                    <div class="pip-lab-build008-lesson-icon">

                        <i class="fa-solid fa-file-invoice-dollar"></i>

                    </div>

                    <div>

                        <span>
                            COMMISSION
                        </span>

                        <strong>
                            A broker/account fee
                        </strong>

                        <p>
                            Some account types charge a commission.
                            The exact amount and structure depend on
                            the broker and instrument.
                        </p>

                    </div>

                </div>


                <div class="pip-lab-build008-lesson">

                    <div class="pip-lab-build008-lesson-icon">

                        <i class="fa-solid fa-forward-step"></i>

                    </div>

                    <div>

                        <span>
                            SLIPPAGE
                        </span>

                        <strong>
                            Expected price vs actual execution
                        </strong>

                        <p>
                            In real execution, an order can fill at a
                            different price from the expected price.
                            This difference is called slippage.
                        </p>

                    </div>

                </div>


                <div class="pip-lab-build008-lesson">

                    <div class="pip-lab-build008-lesson-icon">

                        <i class="fa-solid fa-clock"></i>

                    </div>

                    <div>

                        <span>
                            SWAP
                        </span>

                        <strong>
                            Overnight financing
                        </strong>

                        <p>
                            Holding some positions overnight can create
                            a financing charge or credit depending on
                            the instrument, direction and account terms.
                        </p>

                    </div>

                </div>

            </div>


            <!-- IMPORTANT -->

            <div class="pip-lab-build008-warning">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <div>

                    <strong>
                        Important
                    </strong>

                    <p>
                        These cost fields are educational estimates.
                        Actual spread, commission, slippage and swap
                        vary by broker, instrument, account type,
                        market conditions and execution. This lab does
                        not provide a quote for any particular broker.
                    </p>

                </div>

            </div>

        </div>
    `;

    build007.insertAdjacentElement(
        "afterend",
        section
    );
}


/* =========================================================
   BUILD 008 LOGIC
========================================================= */

function setupBuild008() {

    const riskInput =
        document.getElementById(
            "build008Risk"
        );

    const rewardInput =
        document.getElementById(
            "build008Reward"
        );

    const winRateInput =
        document.getElementById(
            "build008WinRate"
        );

    const tradesInput =
        document.getElementById(
            "build008Trades"
        );

    const spreadInput =
        document.getElementById(
            "build008Spread"
        );

    const commissionInput =
        document.getElementById(
            "build008Commission"
        );

    const slippageInput =
        document.getElementById(
            "build008Slippage"
        );

    const swapInput =
        document.getElementById(
            "build008Swap"
        );


    if (
        !riskInput ||
        !rewardInput ||
        !winRateInput ||
        !tradesInput
    ) {
        return;
    }


    /* =====================================================
       OUTPUT ELEMENTS
    ===================================================== */

    const totalCost =
        document.getElementById(
            "build008TotalCost"
        );

    const grossWin =
        document.getElementById(
            "build008GrossWin"
        );

    const grossLoss =
        document.getElementById(
            "build008GrossLoss"
        );

    const netWin =
        document.getElementById(
            "build008NetWin"
        );

    const netLoss =
        document.getElementById(
            "build008NetLoss"
        );

    const costPerTrade =
        document.getElementById(
            "build008CostPerTrade"
        );

    const grossResult =
        document.getElementById(
            "build008GrossResult"
        );

    const totalCosts =
        document.getElementById(
            "build008TotalCosts"
        );

    const netResult =
        document.getElementById(
            "build008NetResult"
        );

    const costResult =
        document.getElementById(
            "build008CostResult"
        );

    const resultTitle =
        document.getElementById(
            "build008ResultTitle"
        );

    const resultStatus =
        document.getElementById(
            "build008ResultStatus"
        );

    const breakEvenTitle =
        document.getElementById(
            "build008BreakEvenTitle"
        );

    const breakEvenText =
        document.getElementById(
            "build008BreakEvenText"
        );


    /* =====================================================
       FORMATTERS
    ===================================================== */

    function money(value) {

        return (
            "$" +
            Math.abs(value).toFixed(2)
        );

    }


    function signedMoney(value) {

        if (value > 0) {

            return (
                "+$" +
                value.toFixed(2)
            );

        }

        if (value < 0) {

            return (
                "-$" +
                Math.abs(value).toFixed(2)
            );

        }

        return "$0.00";

    }


    function percentage(value) {

        return (
            value.toFixed(2) +
            "%"
        );

    }


    function getValue(
        input,
        fallback
    ) {

        const value =
            Number(
                input.value
            );

        if (
            !Number.isFinite(value) ||
            value < 0
        ) {

            input.value =
                fallback;

            return fallback;

        }

        return value;

    }


    /* =====================================================
       MAIN CALCULATION
    ===================================================== */

    function updateBuild008() {

        const risk =
            getValue(
                riskInput,
                30
            );

        const reward =
            getValue(
                rewardInput,
                60
            );

        let winRate =
            getValue(
                winRateInput,
                40
            );

        let trades =
            Math.floor(
                getValue(
                    tradesInput,
                    10
                )
            );


        const spread =
            getValue(
                spreadInput,
                2
            );

        const commission =
            getValue(
                commissionInput,
                3
            );

        const slippage =
            getValue(
                slippageInput,
                1
            );

        const swap =
            getValue(
                swapInput,
                0
            );


        /* =================================================
           VALIDATE RANGE
        ================================================= */

        if (
            winRate > 100
        ) {

            winRate = 100;

            winRateInput.value =
                100;

        }


        if (
            trades < 1
        ) {

            trades = 1;

            tradesInput.value =
                1;

        }


        /* =================================================
           COST PER TRADE
        ================================================= */

        const estimatedCost =
            spread +
            commission +
            slippage +
            swap;


        /* =================================================
           PER TRADE RESULTS
        ================================================= */

        const grossWinningTrade =
            reward;

        const grossLosingTrade =
            risk;


        const netWinningTrade =
            Math.max(
                reward -
                estimatedCost,
                0
            );


        const netLosingTrade =
            risk +
            estimatedCost;


        /* =================================================
           WIN / LOSS COUNTS
        ================================================= */

        const winningTrades =
            (
                trades *
                winRate
            ) /
            100;


        const losingTrades =
            trades -
            winningTrades;


        /* =================================================
           MULTI TRADE RESULTS
        ================================================= */

        const grossTotal =
            (
                winningTrades *
                grossWinningTrade
            )
            -
            (
                losingTrades *
                grossLosingTrade
            );


        const allTradeCosts =
            trades *
            estimatedCost;


        const netTotal =
            grossTotal -
            allTradeCosts;


        /* =================================================
           BREAK-EVEN BEFORE COSTS
        ================================================= */

        let breakEvenBeforeCosts =
            0;


        if (
            risk +
            reward >
            0
        ) {

            breakEvenBeforeCosts =
                (
                    risk /
                    (
                        risk +
                        reward
                    )
                ) *
                100;

        }


        /* =================================================
           BREAK-EVEN AFTER COSTS
        ================================================= */

        const effectiveReward =
            Math.max(
                reward -
                estimatedCost,
                0
            );


        const effectiveRisk =
            risk +
            estimatedCost;


        let breakEvenAfterCosts =
            100;


        if (
            effectiveReward >
            0
        ) {

            breakEvenAfterCosts =
                (
                    effectiveRisk /
                    (
                        effectiveRisk +
                        effectiveReward
                    )
                ) *
                100;

        }


        /* =================================================
           UPDATE PER TRADE
        ================================================= */

        totalCost.textContent =
            money(
                estimatedCost
            );


        grossWin.textContent =
            "+" +
            money(
                grossWinningTrade
            );


        grossLoss.textContent =
            "-" +
            money(
                grossLosingTrade
            );


        netWin.textContent =
            "+" +
            money(
                netWinningTrade
            );


        netLoss.textContent =
            "-" +
            money(
                netLosingTrade
            );


        costPerTrade.textContent =
            money(
                estimatedCost
            );


        /* =================================================
           UPDATE MULTI TRADE
        ================================================= */

        grossResult.textContent =
            signedMoney(
                grossTotal
            );


        totalCosts.textContent =
            "-" +
            money(
                allTradeCosts
            );


        netResult.textContent =
            signedMoney(
                netTotal
            );


        costResult.textContent =
            money(
                estimatedCost
            );


        /* =================================================
           RESULT STATUS
        ================================================= */

        resultStatus.classList.remove(
            "positive",
            "neutral",
            "negative"
        );


        if (
            netTotal > 0
        ) {

            resultStatus.textContent =
                "POSITIVE";

            resultStatus.classList.add(
                "positive"
            );


            resultTitle.textContent =
                "The experiment remains positive after estimated costs.";

        }
        else if (
            Math.abs(
                netTotal
            ) < 0.0001
        ) {

            resultStatus.textContent =
                "BREAK-EVEN";

            resultStatus.classList.add(
                "neutral"
            );


            resultTitle.textContent =
                "The experiment reaches mathematical break-even after estimated costs.";

        }
        else {

            resultStatus.textContent =
                "NEGATIVE";

            resultStatus.classList.add(
                "negative"
            );


            resultTitle.textContent =
                "Estimated costs push this experiment below break-even.";

        }


        /* =================================================
           BREAK-EVEN EXPLANATION
        ================================================= */

        breakEvenTitle.textContent =
            "Break-even before costs: " +
            percentage(
                breakEvenBeforeCosts
            ) +
            " | after estimated costs: " +
            percentage(
                breakEvenAfterCosts
            );


        if (
            estimatedCost === 0
        ) {

            breakEvenText.textContent =
                "No additional cost has been entered, so the before-cost and after-cost break-even calculations are the same.";

        }
        else {

            breakEvenText.textContent =
                "With the current estimated cost of " +
                money(estimatedCost) +
                " per trade, the simplified break-even win rate increases from " +
                percentage(breakEvenBeforeCosts) +
                " to about " +
                percentage(breakEvenAfterCosts) +
                ". Actual trading costs can differ.";

        }

    }


    /* =====================================================
       INPUT EVENTS
    ===================================================== */

    [
        riskInput,
        rewardInput,
        winRateInput,
        tradesInput,
        spreadInput,
        commissionInput,
        slippageInput,
        swapInput
    ].forEach(
        function(input) {

            if (!input) {
                return;
            }

            input.addEventListener(
                "input",
                updateBuild008
            );

            input.addEventListener(
                "change",
                updateBuild008
            );

        }
    );


    /* =====================================================
       INITIAL CALCULATION
    ===================================================== */

    updateBuild008();

}


/* =========================================================
   BUILD 008 AUTO INITIALIZATION
========================================================= */

function waitForBuild008() {

    if (
        document.getElementById(
            "build007WinRateLab"
        )
    ) {

        initBuild008();

        return;

    }


    setTimeout(
        waitForBuild008,
        100
    );

}


if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        waitForBuild008
    );

}
else {

    waitForBuild008();

}

/* =========================================================
   BUILD 009
   POSITION SIZE CHALLENGE LAB
========================================================= */

function initBuild009() {

    if (document.getElementById("build009ChallengeLab")) {
        return;
    }

    const build008 =
        document.getElementById("build008RealityLab");

    if (!build008) {
        return;
    }

    createBuild009Markup(build008);
    setupBuild009();
}


/* =========================================================
   BUILD 009 MARKUP
========================================================= */

function createBuild009Markup(build008) {

    const section = document.createElement("section");

    section.id = "build009ChallengeLab";
    section.className = "pip-lab-build009";

    section.innerHTML = `

        <!-- HEADER -->

        <div class="pip-lab-build009-header">

            <span class="pip-lab-build009-badge">
                <i class="fa-solid fa-trophy"></i>
                Build 009
            </span>

            <h2>
                Position Size Challenge Lab
            </h2>

            <p>
                Stop watching the calculator do the work.
                Now you calculate the position size yourself.
            </p>

        </div>


        <!-- MAIN PANEL -->

        <div class="pip-lab-build009-panel">


            <!-- INTRO -->

            <div class="pip-lab-build009-intro">

                <div class="pip-lab-build009-intro-icon">
                    <i class="fa-solid fa-graduation-cap"></i>
                </div>

                <div>

                    <span>
                        PRACTICE WHAT YOU LEARNED
                    </span>

                    <h3>
                        Can you calculate the correct position size?
                    </h3>

                    <p>
                        You already learned about risk, stop-loss distance,
                        lots and position size. Now use those concepts
                        yourself before the lab reveals the answer.
                    </p>

                </div>

            </div>


            <!-- MODE SELECTOR -->

            <div class="pip-lab-build009-mode-area">

                <div class="pip-lab-build009-section-title">

                    <span>
                        CHOOSE YOUR MODE
                    </span>

                    <strong>
                        How much help do you want?
                    </strong>

                </div>


                <div class="pip-lab-build009-mode-grid">


                    <button
                        type="button"
                        class="pip-lab-build009-mode active"
                        data-mode="guided"
                    >

                        <div class="pip-lab-build009-mode-icon guided">
                            <i class="fa-solid fa-route"></i>
                        </div>

                        <div>

                            <span>
                                BEGINNER
                            </span>

                            <strong>
                                Guided
                            </strong>

                            <small>
                                Get step-by-step hints
                            </small>

                        </div>

                    </button>


                    <button
                        type="button"
                        class="pip-lab-build009-mode"
                        data-mode="practice"
                    >

                        <div class="pip-lab-build009-mode-icon practice">
                            <i class="fa-solid fa-pen"></i>
                        </div>

                        <div>

                            <span>
                                INTERMEDIATE
                            </span>

                            <strong>
                                Practice
                            </strong>

                            <small>
                                Calculate without hints
                            </small>

                        </div>

                    </button>


                    <button
                        type="button"
                        class="pip-lab-build009-mode"
                        data-mode="challenge"
                    >

                        <div class="pip-lab-build009-mode-icon challenge">
                            <i class="fa-solid fa-bolt"></i>
                        </div>

                        <div>

                            <span>
                                ADVANCED
                            </span>

                            <strong>
                                Challenge
                            </strong>

                            <small>
                                Solve realistic scenarios
                            </small>

                        </div>

                    </button>

                </div>

            </div>


            <!-- PROGRESS -->

            <div class="pip-lab-build009-progress-area">

                <div class="pip-lab-build009-progress-top">

                    <span>
                        CHALLENGE PROGRESS
                    </span>

                    <strong id="build009ProgressText">
                        Challenge 1 of 5
                    </strong>

                </div>

                <div class="pip-lab-build009-progress">

                    <div
                        id="build009ProgressBar"
                        class="pip-lab-build009-progress-fill"
                        style="width:20%;"
                    ></div>

                </div>

                <div class="pip-lab-build009-score">

                    <span>
                        SCORE
                    </span>

                    <strong id="build009Score">
                        0 / 5
                    </strong>

                </div>

            </div>


            <!-- SCENARIO -->

            <div class="pip-lab-build009-scenario">

                <div class="pip-lab-build009-scenario-header">

                    <div>

                        <span>
                            YOUR TRADING SCENARIO
                        </span>

                        <strong id="build009ScenarioTitle">
                            Beginner Position Size
                        </strong>

                    </div>

                    <div
                        class="pip-lab-build009-difficulty"
                        id="build009Difficulty"
                    >
                        BEGINNER
                    </div>

                </div>


                <!-- SCENARIO VALUES -->

                <div class="pip-lab-build009-values">


                    <div class="pip-lab-build009-value">

                        <span>
                            ACCOUNT BALANCE
                        </span>

                        <strong id="build009Balance">
                            $1,000
                        </strong>

                    </div>


                    <div class="pip-lab-build009-value">

                        <span>
                            RISK
                        </span>

                        <strong id="build009Risk">
                            2%
                        </strong>

                    </div>


                    <div class="pip-lab-build009-value">

                        <span>
                            ENTRY
                        </span>

                        <strong id="build009Entry">
                            1.10000
                        </strong>

                    </div>


                    <div class="pip-lab-build009-value">

                        <span>
                            STOP LOSS
                        </span>

                        <strong id="build009Stop">
                            1.09700
                        </strong>

                    </div>


                    <div class="pip-lab-build009-value">

                        <span>
                            STOP DISTANCE
                        </span>

                        <strong id="build009Pips">
                            30 pips
                        </strong>

                    </div>


                    <div class="pip-lab-build009-value">

                        <span>
                            PIP VALUE
                        </span>

                        <strong id="build009PipValue">
                            $10 / lot
                        </strong>

                    </div>

                </div>


                <!-- RISK EXPLANATION -->

                <div class="pip-lab-build009-risk-box">

                    <div class="pip-lab-build009-risk-icon">

                        <i class="fa-solid fa-shield-halved"></i>

                    </div>

                    <div>

                        <span>
                            MAXIMUM PLANNED RISK
                        </span>

                        <strong id="build009RiskMoney">
                            $20.00
                        </strong>

                        <small>
                            Account balance × risk percentage
                        </small>

                    </div>

                </div>

            </div>


            <!-- GUIDED HINT -->

            <div
                class="pip-lab-build009-hint"
                id="build009HintBox"
            >

                <div class="pip-lab-build009-hint-icon">

                    <i class="fa-solid fa-lightbulb"></i>

                </div>

                <div>

                    <span>
                        GUIDED HINT
                    </span>

                    <p id="build009HintText">
                        First calculate the maximum amount of money
                        you are willing to risk.
                    </p>

                </div>

            </div>


            <!-- ANSWER AREA -->

            <div class="pip-lab-build009-answer-area">

                <div class="pip-lab-build009-section-title">

                    <span>
                        YOUR ANSWER
                    </span>

                    <strong>
                        What position size would you use?
                    </strong>

                </div>


                <div class="pip-lab-build009-answer-row">

                    <div class="pip-lab-build009-answer-input">

                        <input
                            id="build009Answer"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Example: 0.06"
                            autocomplete="off"
                        >

                        <span>
                            lot
                        </span>

                    </div>


                    <button
                        type="button"
                        id="build009CheckButton"
                        class="pip-lab-build009-check"
                    >

                        <i class="fa-solid fa-check"></i>

                        Check Answer

                    </button>

                </div>


                <div
                    id="build009Feedback"
                    class="pip-lab-build009-feedback"
                >

                    <i class="fa-solid fa-circle-info"></i>

                    <span>
                        Enter your answer and check your calculation.
                    </span>

                </div>

            </div>


            <!-- SOLUTION -->

            <div
                id="build009Solution"
                class="pip-lab-build009-solution"
            >

                <div class="pip-lab-build009-solution-header">

                    <div>

                        <span>
                            STEP-BY-STEP SOLUTION
                        </span>

                        <strong>
                            Why this is the answer
                        </strong>

                    </div>

                    <i class="fa-solid fa-lock-open"></i>

                </div>


                <div class="pip-lab-build009-steps">


                    <div class="pip-lab-build009-step">

                        <div class="pip-lab-build009-step-number">
                            1
                        </div>

                        <div>

                            <span>
                                MAXIMUM MONEY RISK
                            </span>

                            <strong id="build009Step1">
                                $1,000 × 2% = $20
                            </strong>

                            <small>
                                This is the maximum planned amount
                                you want to risk on the trade.
                            </small>

                        </div>

                    </div>


                    <div class="pip-lab-build009-step">

                        <div class="pip-lab-build009-step-number">
                            2
                        </div>

                        <div>

                            <span>
                                STOP DISTANCE
                            </span>

                            <strong id="build009Step2">
                                30 pips
                            </strong>

                            <small>
                                This is the distance between entry
                                and the stop-loss level.
                            </small>

                        </div>

                    </div>


                    <div class="pip-lab-build009-step">

                        <div class="pip-lab-build009-step-number">
                            3
                        </div>

                        <div>

                            <span>
                                POSITION SIZE
                            </span>

                            <strong id="build009Step3">
                                $20 ÷ (30 × $10) = 0.0667 lot
                            </strong>

                            <small>
                                For this educational example,
                                pip value is assumed to be $10 per
                                standard lot.
                            </small>

                        </div>

                    </div>


                    <div class="pip-lab-build009-step">

                        <div class="pip-lab-build009-step-number">
                            4
                        </div>

                        <div>

                            <span>
                                PRACTICAL SIZE
                            </span>

                            <strong id="build009Step4">
                                0.06 lot
                            </strong>

                            <small>
                                Rounding down keeps the planned risk
                                within the selected maximum.
                            </small>

                        </div>

                    </div>

                </div>


                <!-- WHY -->

                <div class="pip-lab-build009-why">

                    <i class="fa-solid fa-circle-question"></i>

                    <div>

                        <strong>
                            Why does position size matter?
                        </strong>

                        <p id="build009WhyText">
                            If you keep the same money risk but make
                            the stop-loss wider, the position generally
                            needs to become smaller. If the stop becomes
                            tighter, the position can generally become
                            larger, assuming the same pip value and
                            risk amount.
                        </p>

                    </div>

                </div>

            </div>


            <!-- NEXT BUTTON -->

            <div class="pip-lab-build009-next-area">

                <button
                    type="button"
                    id="build009NextButton"
                    class="pip-lab-build009-next"
                    disabled
                >

                    Next Challenge

                    <i class="fa-solid fa-arrow-right"></i>

                </button>

            </div>


            <!-- LEARNING CARDS -->

            <div class="pip-lab-build009-lessons">


                <div class="pip-lab-build009-lesson">

                    <div class="pip-lab-build009-lesson-icon">

                        <i class="fa-solid fa-wallet"></i>

                    </div>

                    <div>

                        <span>
                            MONEY RISK
                        </span>

                        <strong>
                            How much can you lose?
                        </strong>

                        <p>
                            Risk percentage converts your account
                            balance into a maximum planned money amount.
                        </p>

                    </div>

                </div>


                <div class="pip-lab-build009-lesson">

                    <div class="pip-lab-build009-lesson-icon">

                        <i class="fa-solid fa-ruler"></i>

                    </div>

                    <div>

                        <span>
                            STOP DISTANCE
                        </span>

                        <strong>
                            How far is your stop?
                        </strong>

                        <p>
                            A wider stop generally requires a smaller
                            position when the money risk stays fixed.
                        </p>

                    </div>

                </div>


                <div class="pip-lab-build009-lesson">

                    <div class="pip-lab-build009-lesson-icon">

                        <i class="fa-solid fa-cubes"></i>

                    </div>

                    <div>

                        <span>
                            POSITION SIZE
                        </span>

                        <strong>
                            How much are you trading?
                        </strong>

                        <p>
                            Position size determines how much market
                            exposure the trade has.
                        </p>

                    </div>

                </div>

            </div>


            <!-- IMPORTANT -->

            <div class="pip-lab-build009-warning">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <div>

                    <strong>
                        Educational assumption
                    </strong>

                    <p>
                        These challenges use a simplified pip-value
                        assumption for learning. Actual pip value and
                        position-size calculations can vary with the
                        instrument, contract specifications, quote
                        currency, account currency and broker.
                    </p>

                </div>

            </div>

        </div>
    `;

    build008.insertAdjacentElement(
        "afterend",
        section
    );
}


/* =========================================================
   BUILD 009 LOGIC
========================================================= */

function setupBuild009() {

    const modes =
        document.querySelectorAll(
            ".pip-lab-build009-mode"
        );

    const answerInput =
        document.getElementById(
            "build009Answer"
        );

    const checkButton =
        document.getElementById(
            "build009CheckButton"
        );

    const nextButton =
        document.getElementById(
            "build009NextButton"
        );

    const hintBox =
        document.getElementById(
            "build009HintBox"
        );

    const hintText =
        document.getElementById(
            "build009HintText"
        );

    const feedback =
        document.getElementById(
            "build009Feedback"
        );

    const solution =
        document.getElementById(
            "build009Solution"
        );

    const progressText =
        document.getElementById(
            "build009ProgressText"
        );

    const progressBar =
        document.getElementById(
            "build009ProgressBar"
        );

    const scoreElement =
        document.getElementById(
            "build009Score"
        );

    const scenarioTitle =
        document.getElementById(
            "build009ScenarioTitle"
        );

    const difficulty =
        document.getElementById(
            "build009Difficulty"
        );

    const balance =
        document.getElementById(
            "build009Balance"
        );

    const risk =
        document.getElementById(
            "build009Risk"
        );

    const entry =
        document.getElementById(
            "build009Entry"
        );

    const stop =
        document.getElementById(
            "build009Stop"
        );

    const pips =
        document.getElementById(
            "build009Pips"
        );

    const pipValue =
        document.getElementById(
            "build009PipValue"
        );

    const riskMoney =
        document.getElementById(
            "build009RiskMoney"
        );

    const step1 =
        document.getElementById(
            "build009Step1"
        );

    const step2 =
        document.getElementById(
            "build009Step2"
        );

    const step3 =
        document.getElementById(
            "build009Step3"
        );

    const step4 =
        document.getElementById(
            "build009Step4"
        );

    const whyText =
        document.getElementById(
            "build009WhyText"
        );


    if (
        !answerInput ||
        !checkButton ||
        !nextButton
    ) {
        return;
    }


    /* =====================================================
       SCENARIOS
    ===================================================== */

    const scenarios = {

        guided: [

            {
                title: "Beginner Position Size",
                difficulty: "BEGINNER",
                balance: 1000,
                riskPercent: 2,
                entry: 1.10000,
                stop: 1.09700,
                pipValue: 10
            },

            {
                title: "Beginner Wider Stop",
                difficulty: "BEGINNER",
                balance: 1500,
                riskPercent: 1,
                entry: 1.20000,
                stop: 1.19600,
                pipValue: 10
            },

            {
                title: "Beginner Smaller Account",
                difficulty: "BEGINNER",
                balance: 500,
                riskPercent: 2,
                entry: 1.30000,
                stop: 1.29800,
                pipValue: 10
            },

            {
                title: "Beginner Larger Risk",
                difficulty: "BEGINNER",
                balance: 2000,
                riskPercent: 1.5,
                entry: 1.25000,
                stop: 1.24500,
                pipValue: 10
            },

            {
                title: "Beginner Tight Stop",
                difficulty: "BEGINNER",
                balance: 3000,
                riskPercent: 1,
                entry: 1.15000,
                stop: 1.14750,
                pipValue: 10
            }

        ],


        practice: [

            {
                title: "Practice 1",
                difficulty: "PRACTICE",
                balance: 1000,
                riskPercent: 1,
                entry: 1.10000,
                stop: 1.09500,
                pipValue: 10
            },

            {
                title: "Practice 2",
                difficulty: "PRACTICE",
                balance: 2500,
                riskPercent: 2,
                entry: 1.25000,
                stop: 1.24500,
                pipValue: 10
            },

            {
                title: "Practice 3",
                difficulty: "PRACTICE",
                balance: 5000,
                riskPercent: 1,
                entry: 1.30000,
                stop: 1.29200,
                pipValue: 10
            },

            {
                title: "Practice 4",
                difficulty: "PRACTICE",
                balance: 2000,
                riskPercent: 2,
                entry: 1.18000,
                stop: 1.17600,
                pipValue: 10
            },

            {
                title: "Practice 5",
                difficulty: "PRACTICE",
                balance: 4000,
                riskPercent: 1.5,
                entry: 1.22000,
                stop: 1.21400,
                pipValue: 10
            }

        ],


        challenge: [

            {
                title: "Challenge 1",
                difficulty: "CHALLENGE",
                balance: 750,
                riskPercent: 1,
                entry: 1.10500,
                stop: 1.10150,
                pipValue: 10
            },

            {
                title: "Challenge 2",
                difficulty: "CHALLENGE",
                balance: 3200,
                riskPercent: 1.25,
                entry: 1.28000,
                stop: 1.27300,
                pipValue: 10
            },

            {
                title: "Challenge 3",
                difficulty: "CHALLENGE",
                balance: 1200,
                riskPercent: 2,
                entry: 1.17500,
                stop: 1.16800,
                pipValue: 10
            },

            {
                title: "Challenge 4",
                difficulty: "CHALLENGE",
                balance: 6500,
                riskPercent: 0.75,
                entry: 1.31500,
                stop: 1.30700,
                pipValue: 10
            },

            {
                title: "Challenge 5",
                difficulty: "CHALLENGE",
                balance: 1800,
                riskPercent: 1.5,
                entry: 1.22500,
                stop: 1.21750,
                pipValue: 10
            }

        ]

    };


    /* =====================================================
       STATE
    ===================================================== */

    let currentMode =
        "guided";

    let currentIndex =
        0;

    let score =
        0;

    let answered =
        false;


    /* =====================================================
       HELPERS
    ===================================================== */

    function formatMoney(value) {

        return (
            "$" +
            Number(value).toFixed(2)
        );

    }


    function formatPrice(value) {

        return Number(value).toFixed(5);

    }


    function calculateScenario(
        scenario
    ) {

        const maximumRisk =
            scenario.balance *
            (
                scenario.riskPercent /
                100
            );


        const stopDistance =
            Math.abs(
                scenario.entry -
                scenario.stop
            ) *
            10000;


        const exactLots =
            maximumRisk /
            (
                stopDistance *
                scenario.pipValue
            );


        /*
         * Round down to 0.01 lot so the planned risk
         * does not exceed the selected maximum.
         */

        const practicalLots =
            Math.floor(
                exactLots *
                100
            ) /
            100;


        const practicalRisk =
            practicalLots *
            stopDistance *
            scenario.pipValue;


        return {

            maximumRisk,
            stopDistance,
            exactLots,
            practicalLots,
            practicalRisk

        };

    }


    function getCurrentScenario() {

        return scenarios[
            currentMode
        ][
            currentIndex
        ];

    }


    /* =====================================================
       LOAD SCENARIO
    ===================================================== */

    function loadScenario() {

        const scenario =
            getCurrentScenario();

        const calculation =
            calculateScenario(
                scenario
            );


        answered =
            false;


        answerInput.value =
            "";


        solution.classList.remove(
            "visible"
        );


        feedback.className =
            "pip-lab-build009-feedback";


        feedback.innerHTML =
            `
            <i class="fa-solid fa-circle-info"></i>
            <span>
                Enter your answer and check your calculation.
            </span>
            `;


        nextButton.disabled =
            true;


        /* -----------------------------------------------
           SCENARIO TEXT
        ----------------------------------------------- */

        scenarioTitle.textContent =
            scenario.title;


        difficulty.textContent =
            scenario.difficulty;


        balance.textContent =
            formatMoney(
                scenario.balance
            );


        risk.textContent =
            scenario.riskPercent +
            "%";


        entry.textContent =
            formatPrice(
                scenario.entry
            );


        stop.textContent =
            formatPrice(
                scenario.stop
            );


        pips.textContent =
            calculation.stopDistance.toFixed(1) +
            " pips";


        pipValue.textContent =
            "$" +
            scenario.pipValue.toFixed(2) +
            " / lot";


        riskMoney.textContent =
            formatMoney(
                calculation.maximumRisk
            );


        /* -----------------------------------------------
           PROGRESS
        ----------------------------------------------- */

        progressText.textContent =
            "Challenge " +
            (
                currentIndex +
                1
            ) +
            " of " +
            scenarios[
                currentMode
            ].length;


        progressBar.style.width =
            (
                (
                    currentIndex +
                    1
                ) /
                scenarios[
                    currentMode
                ].length *
                100
            ) +
            "%";


        scoreElement.textContent =
            score +
            " / " +
            scenarios[
                currentMode
            ].length;


        /* -----------------------------------------------
           GUIDED MODE
        ----------------------------------------------- */

        if (
            currentMode ===
            "guided"
        ) {

            hintBox.classList.remove(
                "hidden"
            );


            if (
                currentIndex === 0
            ) {

                hintText.textContent =
                    "First calculate the maximum amount of money you are willing to risk.";

            }
            else if (
                currentIndex === 1
            ) {

                hintText.textContent =
                    "Now calculate your maximum money risk, then divide it by the money value of the stop-loss distance.";

            }
            else if (
                currentIndex === 2
            ) {

                hintText.textContent =
                    "Remember: Account Balance × Risk % gives you the maximum planned money risk.";

            }
            else if (
                currentIndex === 3
            ) {

                hintText.textContent =
                    "A wider stop means more money is at risk for the same lot size, so position size generally needs to become smaller.";

            }
            else {

                hintText.textContent =
                    "Calculate the risk amount first. Then use the stop distance and pip value to determine the lot size.";

            }

        }
        else {

            hintBox.classList.add(
                "hidden"
            );

        }


        /* -----------------------------------------------
           SOLUTION TEXT
        ----------------------------------------------- */

        step1.textContent =
            formatMoney(
                scenario.balance
            ) +
            " × " +
            scenario.riskPercent +
            "% = " +
            formatMoney(
                calculation.maximumRisk
            );


        step2.textContent =
            calculation.stopDistance.toFixed(1) +
            " pips";


        step3.textContent =
            formatMoney(
                calculation.maximumRisk
            ) +
            " ÷ (" +
            calculation.stopDistance.toFixed(1) +
            " × $" +
            scenario.pipValue.toFixed(2) +
            ") = " +
            calculation.exactLots.toFixed(4) +
            " lot";


        step4.textContent =
            calculation.practicalLots.toFixed(2) +
            " lot";


        whyText.textContent =
            "The maximum planned risk is " +
            formatMoney(
                calculation.maximumRisk
            ) +
            ". With a " +
            calculation.stopDistance.toFixed(1) +
            "-pip stop and an assumed $" +
            scenario.pipValue.toFixed(2) +
            " pip value per lot, the practical position size is " +
            calculation.practicalLots.toFixed(2) +
            " lot. A larger stop would generally require a smaller position when the money risk stays fixed.";

    }


    /* =====================================================
       CHECK ANSWER
    ===================================================== */

    function checkAnswer() {

        if (
            answered
        ) {

            return;

        }


        const userAnswer =
            Number(
                answerInput.value
            );


        if (
            !Number.isFinite(
                userAnswer
            ) ||
            userAnswer <= 0
        ) {

            feedback.className =
                "pip-lab-build009-feedback incorrect";

            feedback.innerHTML =
                `
                <i class="fa-solid fa-circle-exclamation"></i>
                <span>
                    Enter a valid position size before checking.
                </span>
                `;

            return;

        }


        const scenario =
            getCurrentScenario();

        const calculation =
            calculateScenario(
                scenario
            );


        /*
         * We accept answers within 0.01 lot of the practical
         * answer. The practical answer is rounded DOWN so the
         * planned risk remains within the selected maximum.
         */

        const difference =
            Math.abs(
                userAnswer -
                calculation.practicalLots
            );


        const tolerance =
            0.005;


        answered =
            true;


        solution.classList.add(
            "visible"
        );


        nextButton.disabled =
            false;


        if (
            difference <=
            tolerance
        ) {

            score++;


            feedback.className =
                "pip-lab-build009-feedback correct";

            feedback.innerHTML =
                `
                <i class="fa-solid fa-circle-check"></i>

                <span>
                    <strong>Correct!</strong>
                    Your answer of
                    ${userAnswer.toFixed(2)} lot
                    is within the expected practical range.
                </span>
                `;

        }
        else {

            feedback.className =
                "pip-lab-build009-feedback incorrect";

            feedback.innerHTML =
                `
                <i class="fa-solid fa-circle-xmark"></i>

                <span>
                    <strong>Not quite.</strong>
                    The practical answer for this scenario is
                    ${calculation.practicalLots.toFixed(2)} lot.
                    Check the step-by-step calculation below.
                </span>
                `;

        }


        scoreElement.textContent =
            score +
            " / " +
            scenarios[
                currentMode
            ].length;

    }


    /* =====================================================
       NEXT CHALLENGE
    ===================================================== */

    function nextChallenge() {

        if (
            !answered
        ) {

            return;

        }


        currentIndex++;


        if (
            currentIndex >=
            scenarios[
                currentMode
            ].length
        ) {

            currentIndex =
                0;

        }


        loadScenario();

    }


    /* =====================================================
       MODE SWITCH
    ===================================================== */

    modes.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    modes.forEach(
                        function(item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    currentMode =
                        button.dataset.mode;


                    currentIndex =
                        0;


                    score =
                        0;


                    loadScenario();

                }
            );

        }
    );


    /* =====================================================
       EVENTS
    ===================================================== */

    checkButton.addEventListener(
        "click",
        checkAnswer
    );


    nextButton.addEventListener(
        "click",
        nextChallenge
    );


    answerInput.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key ===
                "Enter"
            ) {

                checkAnswer();

            }

        }
    );


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    loadScenario();

}


/* =========================================================
   BUILD 009 AUTO INITIALIZATION
========================================================= */

function waitForBuild009() {

    if (
        document.getElementById(
            "build008RealityLab"
        )
    ) {

        initBuild009();

        return;

    }


    setTimeout(
        waitForBuild009,
        100
    );

}


if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        waitForBuild009
    );

}
else {

    waitForBuild009();

}

/* =========================================================
   BUILD 010
   TRADE MANAGEMENT LAB
========================================================= */

function initBuild010() {

    if (document.getElementById("build010TradeManagement")) {
        return;
    }

    const build009 =
        document.getElementById("build009ChallengeLab");

    if (!build009) {
        return;
    }

    createBuild010Markup(build009);
    setupBuild010();
}


/* =========================================================
   BUILD 010 MARKUP
========================================================= */

function createBuild010Markup(build009) {

    const section = document.createElement("section");

    section.id = "build010TradeManagement";
    section.className = "pip-lab-build010";

    section.innerHTML = `

        <!-- HEADER -->

        <div class="pip-lab-build010-header">

            <span class="pip-lab-build010-badge">
                <i class="fa-solid fa-sliders"></i>
                Build 010
            </span>

            <h2>
                Trade Management Lab
            </h2>

            <p>
                Open a trade, set your Stop Loss and Take Profit,
                then experiment with managing the position and see
                exactly how each decision changes the trade.
            </p>

        </div>


        <!-- MAIN PANEL -->

        <div class="pip-lab-build010-panel">


            <!-- INTRO -->

            <div class="pip-lab-build010-intro">

                <div class="pip-lab-build010-intro-icon">
                    <i class="fa-solid fa-chess"></i>
                </div>

                <div>

                    <span>
                        MANAGE THE TRADE
                    </span>

                    <h3>
                        A trade doesn't end when you click Buy or Sell.
                    </h3>

                    <p>
                        Your Entry, Stop Loss and Take Profit define
                        the original plan. What you do after entering
                        can change the risk and reward of that plan.
                    </p>

                </div>

            </div>


            <!-- TRADE SETUP -->

            <div class="pip-lab-build010-setup">

                <div class="pip-lab-build010-section-title">

                    <span>
                        STEP 1
                    </span>

                    <strong>
                        Build your original trade plan
                    </strong>

                </div>


                <div class="pip-lab-build010-input-grid">


                    <!-- DIRECTION -->

                    <div class="pip-lab-build010-field">

                        <label>
                            Trade Direction
                        </label>

                        <div class="pip-lab-build010-direction">

                            <button
                                type="button"
                                id="build010Buy"
                                class="active buy"
                            >
                                <i class="fa-solid fa-arrow-up"></i>
                                BUY
                            </button>

                            <button
                                type="button"
                                id="build010Sell"
                                class="sell"
                            >
                                <i class="fa-solid fa-arrow-down"></i>
                                SELL
                            </button>

                        </div>

                    </div>


                    <!-- ENTRY -->

                    <div class="pip-lab-build010-field">

                        <label for="build010Entry">
                            Entry Price
                        </label>

                        <input
                            id="build010Entry"
                            type="number"
                            value="1.10000"
                            step="0.00001"
                        >

                        <small>
                            Your planned entry price
                        </small>

                    </div>


                    <!-- STOP -->

                    <div class="pip-lab-build010-field">

                        <label for="build010Stop">
                            Stop Loss
                        </label>

                        <input
                            id="build010Stop"
                            type="number"
                            value="1.09700"
                            step="0.00001"
                        >

                        <small>
                            Price level where the trade is planned to exit
                            if the loss limit is reached
                        </small>

                    </div>


                    <!-- TAKE PROFIT -->

                    <div class="pip-lab-build010-field">

                        <label for="build010Target">
                            Take Profit
                        </label>

                        <input
                            id="build010Target"
                            type="number"
                            value="1.10600"
                            step="0.00001"
                        >

                        <small>
                            Planned profit target
                        </small>

                    </div>


                    <!-- POSITION SIZE -->

                    <div class="pip-lab-build010-field">

                        <label for="build010Lot">
                            Position Size
                        </label>

                        <div class="pip-lab-build010-input-unit">

                            <input
                                id="build010Lot"
                                type="number"
                                value="0.10"
                                min="0.01"
                                step="0.01"
                            >

                            <span>
                                lot
                            </span>

                        </div>

                        <small>
                            Educational position size
                        </small>

                    </div>


                    <!-- PIP VALUE -->

                    <div class="pip-lab-build010-field">

                        <label for="build010PipValue">
                            Pip Value / Lot
                        </label>

                        <div class="pip-lab-build010-input-unit">

                            <span class="prefix">
                                $
                            </span>

                            <input
                                id="build010PipValue"
                                type="number"
                                value="10"
                                min="0"
                                step="0.01"
                            >

                            <span>
                                / lot
                            </span>

                        </div>

                        <small>
                            Simplified educational assumption
                        </small>

                    </div>

                </div>

            </div>


            <!-- TRADE VISUAL -->

            <div class="pip-lab-build010-chart-area">

                <div class="pip-lab-build010-chart-header">

                    <div>

                        <span>
                            TRADE MAP
                        </span>

                        <strong>
                            Your current trade structure
                        </strong>

                    </div>

                    <div
                        id="build010TradeStatus"
                        class="pip-lab-build010-status"
                    >
                        BUY TRADE
                    </div>

                </div>


                <div class="pip-lab-build010-chart">

                    <div class="pip-lab-build010-price-label top">

                        <span>
                            TAKE PROFIT
                        </span>

                        <strong id="build010TargetLabel">
                            1.10600
                        </strong>

                    </div>


                    <div
                        id="build010TargetLine"
                        class="pip-lab-build010-line target"
                    >
                        <span>
                            TP
                        </span>
                    </div>


                    <div
                        id="build010EntryLine"
                        class="pip-lab-build010-line entry"
                    >
                        <span>
                            ENTRY
                        </span>
                    </div>


                    <div
                        id="build010StopLine"
                        class="pip-lab-build010-line stop"
                    >
                        <span>
                            SL
                        </span>
                    </div>


                    <div class="pip-lab-build010-price-label bottom">

                        <span>
                            STOP LOSS
                        </span>

                        <strong id="build010StopLabel">
                            1.09700
                        </strong>

                    </div>


                    <div class="pip-lab-build010-current-price">

                        <span>
                            CURRENT PRICE
                        </span>

                        <strong id="build010CurrentPrice">
                            1.10000
                        </strong>

                    </div>

                </div>

            </div>


            <!-- ORIGINAL PLAN -->

            <div class="pip-lab-build010-plan">

                <div class="pip-lab-build010-section-title">

                    <span>
                        ORIGINAL PLAN
                    </span>

                    <strong>
                        What did you decide before entering?
                    </strong>

                </div>


                <div class="pip-lab-build010-plan-grid">


                    <div class="pip-lab-build010-metric">

                        <span>
                            STOP DISTANCE
                        </span>

                        <strong id="build010StopPips">
                            30 pips
                        </strong>

                        <small>
                            Entry → Stop Loss
                        </small>

                    </div>


                    <div class="pip-lab-build010-metric">

                        <span>
                            TARGET DISTANCE
                        </span>

                        <strong id="build010TargetPips">
                            60 pips
                        </strong>

                        <small>
                            Entry → Take Profit
                        </small>

                    </div>


                    <div class="pip-lab-build010-metric">

                        <span>
                            PLANNED RISK
                        </span>

                        <strong id="build010RiskMoney">
                            $30.00
                        </strong>

                        <small>
                            If Stop Loss is reached
                        </small>

                    </div>


                    <div class="pip-lab-build010-metric">

                        <span>
                            POTENTIAL REWARD
                        </span>

                        <strong id="build010RewardMoney">
                            $60.00
                        </strong>

                        <small>
                            If Take Profit is reached
                        </small>

                    </div>


                    <div class="pip-lab-build010-metric highlight">

                        <span>
                            RISK : REWARD
                        </span>

                        <strong id="build010RR">
                            1 : 2
                        </strong>

                        <small>
                            Original trade plan
                        </small>

                    </div>

                </div>

            </div>


            <!-- MANAGEMENT ACTIONS -->

            <div class="pip-lab-build010-management">

                <div class="pip-lab-build010-section-title">

                    <span>
                        STEP 2
                    </span>

                    <strong>
                        Experiment with trade management
                    </strong>

                </div>


                <div class="pip-lab-build010-action-grid">


                    <!-- BREAK EVEN -->

                    <button
                        type="button"
                        id="build010BreakEven"
                        class="pip-lab-build010-action"
                    >

                        <div class="pip-lab-build010-action-icon">

                            <i class="fa-solid fa-scale-balanced"></i>

                        </div>

                        <div>

                            <span>
                                MOVE TO
                            </span>

                            <strong>
                                Break-Even
                            </strong>

                            <small>
                                Move SL to entry
                            </small>

                        </div>

                    </button>


                    <!-- HALF PROFIT -->

                    <button
                        type="button"
                        id="build010Partial"
                        class="pip-lab-build010-action"
                    >

                        <div class="pip-lab-build010-action-icon">

                            <i class="fa-solid fa-chart-pie"></i>

                        </div>

                        <div>

                            <span>
                                TAKE
                            </span>

                            <strong>
                                50% Partial Profit
                            </strong>

                            <small>
                                Simulate taking half off
                            </small>

                        </div>

                    </button>


                    <!-- RESET -->

                    <button
                        type="button"
                        id="build010Reset"
                        class="pip-lab-build010-action reset"
                    >

                        <div class="pip-lab-build010-action-icon">

                            <i class="fa-solid fa-rotate-left"></i>

                        </div>

                        <div>

                            <span>
                                RESTORE
                            </span>

                            <strong>
                                Original Plan
                            </strong>

                            <small>
                                Reset management changes
                            </small>

                        </div>

                    </button>

                </div>


                <!-- MOVE STOP -->

                <div class="pip-lab-build010-move-stop">

                    <div>

                        <span>
                            CUSTOM STOP LOSS
                        </span>

                        <strong>
                            Experiment with moving your stop
                        </strong>

                        <small>
                            Try moving it closer or farther away
                            and observe what happens to planned risk.
                        </small>

                    </div>


                    <div class="pip-lab-build010-custom-stop">

                        <input
                            id="build010CustomStop"
                            type="number"
                            value="1.09700"
                            step="0.00001"
                        >

                        <button
                            type="button"
                            id="build010ApplyStop"
                        >
                            Apply Stop
                        </button>

                    </div>

                </div>

            </div>


            <!-- LIVE MANAGEMENT RESULT -->

            <div class="pip-lab-build010-result">

                <div class="pip-lab-build010-result-header">

                    <div>

                        <span>
                            CURRENT TRADE STATE
                        </span>

                        <strong id="build010StateTitle">
                            Original Plan
                        </strong>

                    </div>

                    <div
                        id="build010StateBadge"
                        class="pip-lab-build010-state-badge normal"
                    >
                        PLANNED
                    </div>

                </div>


                <div class="pip-lab-build010-result-grid">


                    <div class="pip-lab-build010-result-card">

                        <span>
                            CURRENT STOP
                        </span>

                        <strong id="build010CurrentStop">
                            1.09700
                        </strong>

                    </div>


                    <div class="pip-lab-build010-result-card">

                        <span>
                            CURRENT RISK
                        </span>

                        <strong id="build010CurrentRisk">
                            $30.00
                        </strong>

                    </div>


                    <div class="pip-lab-build010-result-card">

                        <span>
                            REMAINING POSITION
                        </span>

                        <strong id="build010Remaining">
                            0.10 lot
                        </strong>

                    </div>


                    <div class="pip-lab-build010-result-card">

                        <span>
                            POTENTIAL REWARD
                        </span>

                        <strong id="build010CurrentReward">
                            $60.00
                        </strong>

                    </div>


                    <div class="pip-lab-build010-result-card">

                        <span>
                            CURRENT R:R
                        </span>

                        <strong id="build010CurrentRR">
                            1 : 2
                        </strong>

                    </div>

                </div>

            </div>


            <!-- EXPLANATION -->

            <div
                id="build010Explanation"
                class="pip-lab-build010-explanation"
            >

                <div class="pip-lab-build010-explanation-icon">

                    <i class="fa-solid fa-lightbulb"></i>

                </div>

                <div>

                    <span>
                        WHAT JUST HAPPENED?
                    </span>

                    <strong id="build010ExplanationTitle">
                        Your original trade plan is still active.
                    </strong>

                    <p id="build010ExplanationText">
                        Your Stop Loss and Take Profit are exactly where
                        you originally planned them. This gives you a
                        defined risk and reward before management changes.
                    </p>

                </div>

            </div>


            <!-- LEARNING RULES -->

            <div class="pip-lab-build010-rules">

                <div class="pip-lab-build010-section-title">

                    <span>
                        LEARN THE RULES
                    </span>

                    <strong>
                        What happens when you manage a trade?
                    </strong>

                </div>


                <div class="pip-lab-build010-rule-grid">


                    <div class="pip-lab-build010-rule">

                        <div class="pip-lab-build010-rule-icon">

                            <i class="fa-solid fa-arrow-right-to-bracket"></i>

                        </div>

                        <div>

                            <strong>
                                Break-Even
                            </strong>

                            <p>
                                Moving the stop to entry can remove the
                                original planned price risk, but execution
                                costs and market gaps can still matter.
                            </p>

                        </div>

                    </div>


                    <div class="pip-lab-build010-rule">

                        <div class="pip-lab-build010-rule-icon">

                            <i class="fa-solid fa-chart-pie"></i>

                        </div>

                        <div>

                            <strong>
                                Partial Profit
                            </strong>

                            <p>
                                Closing part of a position locks in part
                                of the result while leaving a smaller
                                position open.
                            </p>

                        </div>

                    </div>


                    <div class="pip-lab-build010-rule">

                        <div class="pip-lab-build010-rule-icon">

                            <i class="fa-solid fa-arrows-up-down"></i>

                        </div>

                        <div>

                            <strong>
                                Moving the Stop
                            </strong>

                            <p>
                                Moving the stop farther away increases the
                                planned price risk when position size stays
                                unchanged.
                            </p>

                        </div>

                    </div>


                    <div class="pip-lab-build010-rule">

                        <div class="pip-lab-build010-rule-icon">

                            <i class="fa-solid fa-clipboard-check"></i>

                        </div>

                        <div>

                            <strong>
                                Follow the Plan
                            </strong>

                            <p>
                                Trade management should be based on a
                                defined plan rather than changing risk
                                emotionally after entering.
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            <!-- IMPORTANT -->

            <div class="pip-lab-build010-warning">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <div>

                    <strong>
                        Educational simulator
                    </strong>

                    <p>
                        This lab is a simplified learning simulator.
                        It does not execute trades and does not predict
                        whether a trade will reach Stop Loss or Take Profit.
                        Actual execution can differ because of spread,
                        slippage, gaps, liquidity and broker conditions.
                    </p>

                </div>

            </div>

        </div>
    `;

    build009.insertAdjacentElement(
        "afterend",
        section
    );
}


/* =========================================================
   BUILD 010 LOGIC
========================================================= */

function setupBuild010() {

    const buyButton =
        document.getElementById(
            "build010Buy"
        );

    const sellButton =
        document.getElementById(
            "build010Sell"
        );

    const entryInput =
        document.getElementById(
            "build010Entry"
        );

    const stopInput =
        document.getElementById(
            "build010Stop"
        );

    const targetInput =
        document.getElementById(
            "build010Target"
        );

    const lotInput =
        document.getElementById(
            "build010Lot"
        );

    const pipValueInput =
        document.getElementById(
            "build010PipValue"
        );

    const customStopInput =
        document.getElementById(
            "build010CustomStop"
        );

    const applyStopButton =
        document.getElementById(
            "build010ApplyStop"
        );

    const breakEvenButton =
        document.getElementById(
            "build010BreakEven"
        );

    const partialButton =
        document.getElementById(
            "build010Partial"
        );

    const resetButton =
        document.getElementById(
            "build010Reset"
        );


    if (
        !entryInput ||
        !stopInput ||
        !targetInput ||
        !lotInput ||
        !pipValueInput
    ) {
        return;
    }


    /* =====================================================
       OUTPUTS
    ===================================================== */

    const tradeStatus =
        document.getElementById(
            "build010TradeStatus"
        );

    const targetLabel =
        document.getElementById(
            "build010TargetLabel"
        );

    const stopLabel =
        document.getElementById(
            "build010StopLabel"
        );

    const currentPrice =
        document.getElementById(
            "build010CurrentPrice"
        );

    const stopPips =
        document.getElementById(
            "build010StopPips"
        );

    const targetPips =
        document.getElementById(
            "build010TargetPips"
        );

    const riskMoney =
        document.getElementById(
            "build010RiskMoney"
        );

    const rewardMoney =
        document.getElementById(
            "build010RewardMoney"
        );

    const rr =
        document.getElementById(
            "build010RR"
        );

    const currentStop =
        document.getElementById(
            "build010CurrentStop"
        );

    const currentRisk =
        document.getElementById(
            "build010CurrentRisk"
        );

    const remaining =
        document.getElementById(
            "build010Remaining"
        );

    const currentReward =
        document.getElementById(
            "build010CurrentReward"
        );

    const currentRR =
        document.getElementById(
            "build010CurrentRR"
        );

    const stateTitle =
        document.getElementById(
            "build010StateTitle"
        );

    const stateBadge =
        document.getElementById(
            "build010StateBadge"
        );

    const explanationTitle =
        document.getElementById(
            "build010ExplanationTitle"
        );

    const explanationText =
        document.getElementById(
            "build010ExplanationText"
        );


    /* =====================================================
       VISUAL LINES
    ===================================================== */

    const targetLine =
        document.getElementById(
            "build010TargetLine"
        );

    const entryLine =
        document.getElementById(
            "build010EntryLine"
        );

    const stopLine =
        document.getElementById(
            "build010StopLine"
        );


    /* =====================================================
       STATE
    ===================================================== */

    let direction =
        "buy";

    let originalEntry =
        Number(
            entryInput.value
        );

    let originalStop =
        Number(
            stopInput.value
        );

    let originalTarget =
        Number(
            targetInput.value
        );

    let originalLot =
        Number(
            lotInput.value
        );

    let originalPipValue =
        Number(
            pipValueInput.value
        );

    let currentStopPrice =
        originalStop;

    let currentPosition =
        originalLot;

    let partialTaken =
        false;


    /* =====================================================
       HELPERS
    ===================================================== */

    function safeNumber(
        input,
        fallback
    ) {

        const value =
            Number(
                input.value
            );

        if (
            !Number.isFinite(
                value
            )
        ) {

            input.value =
                fallback;

            return fallback;

        }

        return value;

    }


    function formatPrice(
        value
    ) {

        return Number(
            value
        ).toFixed(5);

    }


    function money(
        value
    ) {

        return (
            "$" +
            Math.abs(
                value
            ).toFixed(2)
        );

    }


    function signedMoney(
        value
    ) {

        if (
            value > 0
        ) {

            return (
                "+$" +
                value.toFixed(2)
            );

        }

        if (
            value < 0
        ) {

            return (
                "-$" +
                Math.abs(
                    value
                ).toFixed(2)
            );

        }

        return "$0.00";

    }


    function calculateTrade() {

        const entry =
            safeNumber(
                entryInput,
                originalEntry
            );

        const stop =
            currentStopPrice;

        const target =
            safeNumber(
                targetInput,
                originalTarget
            );

        const lot =
            Math.max(
                safeNumber(
                    lotInput,
                    originalLot
                ),
                0
            );

        const pipValue =
            Math.max(
                safeNumber(
                    pipValueInput,
                    originalPipValue
                ),
                0
            );


        const stopDistance =
            Math.abs(
                entry -
                stop
            ) *
            10000;


        const targetDistance =
            Math.abs(
                target -
                entry
            ) *
            10000;


        const risk =
            stopDistance *
            pipValue *
            lot;


        const reward =
            targetDistance *
            pipValue *
            lot;


        const ratio =
            risk > 0
                ? reward / risk
                : 0;


        return {

            entry,
            stop,
            target,
            lot,
            pipValue,
            stopDistance,
            targetDistance,
            risk,
            reward,
            ratio

        };

    }


    /* =====================================================
       DIRECTION
    ===================================================== */

    function setDirection(
        newDirection
    ) {

        direction =
            newDirection;


        if (
            direction ===
            "buy"
        ) {

            buyButton.classList.add(
                "active"
            );

            sellButton.classList.remove(
                "active"
            );

            tradeStatus.textContent =
                "BUY TRADE";

        }
        else {

            sellButton.classList.add(
                "active"
            );

            buyButton.classList.remove(
                "active"
            );

            tradeStatus.textContent =
                "SELL TRADE";

        }


        updateTrade();

    }


    /* =====================================================
       UPDATE TRADE
    ===================================================== */

    function updateTrade() {

        const data =
            calculateTrade();


        targetLabel.textContent =
            formatPrice(
                data.target
            );


        stopLabel.textContent =
            formatPrice(
                data.stop
            );


        currentPrice.textContent =
            formatPrice(
                data.entry
            );


        stopPips.textContent =
            data.stopDistance.toFixed(
                1
            ) +
            " pips";


        targetPips.textContent =
            data.targetDistance.toFixed(
                1
            ) +
            " pips";


        riskMoney.textContent =
            money(
                data.risk
            );


        rewardMoney.textContent =
            money(
                data.reward
            );


        if (
            data.risk > 0
        ) {

            rr.textContent =
                "1 : " +
                data.ratio.toFixed(
                    2
                );

        }
        else {

            rr.textContent =
                "—";

        }


        currentStop.textContent =
            formatPrice(
                data.stop
            );


        currentRisk.textContent =
            money(
                data.risk
            );


        remaining.textContent =
            data.lot.toFixed(
                2
            ) +
            " lot";


        currentReward.textContent =
            money(
                data.reward
            );


        if (
            data.risk > 0
        ) {

            currentRR.textContent =
                "1 : " +
                data.ratio.toFixed(
                    2
                );

        }
        else {

            currentRR.textContent =
                "—";

        }


        updateState(
            data
        );

        updateVisual(
            data
        );

    }


    /* =====================================================
       UPDATE STATE
    ===================================================== */

    function updateState(
        data
    ) {

        stateBadge.classList.remove(
            "normal",
            "break-even",
            "higher-risk",
            "partial"
        );


        if (
            partialTaken
        ) {

            stateTitle.textContent =
                "50% Partial Profit Simulated";

            stateBadge.textContent =
                "PARTIAL";

            stateBadge.classList.add(
                "partial"
            );


            explanationTitle.textContent =
                "Half of the position has been removed.";

            explanationText.textContent =
                "Taking a partial profit reduces the remaining position size. Any future gain or loss on the remaining position is therefore smaller than it was before the partial close.";

            return;

        }


        const originalRisk =
            Math.abs(
                originalEntry -
                originalStop
            ) *
            10000 *
            originalPipValue *
            originalLot;


        const currentRiskValue =
            data.risk;


        if (
            Math.abs(
                data.stop -
                data.entry
            ) <
            0.000001
        ) {

            stateTitle.textContent =
                "Stop Loss at Break-Even";

            stateBadge.textContent =
                "BREAK-EVEN";

            stateBadge.classList.add(
                "break-even"
            );


            explanationTitle.textContent =
                "Your Stop Loss has been moved to the entry price.";

            explanationText.textContent =
                "At the simplified price level, the original price risk has been removed. This does not guarantee a risk-free outcome because spreads, slippage, gaps and execution costs can still affect a real trade.";

            return;

        }


        if (
            currentRiskValue >
            originalRisk * 1.001
        ) {

            stateTitle.textContent =
                "Risk Increased";

            stateBadge.textContent =
                "HIGHER RISK";

            stateBadge.classList.add(
                "higher-risk"
            );


            explanationTitle.textContent =
                "Moving the Stop Loss farther away increased the planned price risk.";

            explanationText.textContent =
                "Your position size stayed the same while the stop became farther from entry. That means a larger price move against the position would be needed to reach the stop, increasing the planned loss.";

            return;

        }


        if (
            currentRiskValue <
            originalRisk * 0.999
        ) {

            stateTitle.textContent =
                "Risk Reduced";

            stateBadge.textContent =
                "LOWER RISK";

            stateBadge.classList.add(
                "break-even"
            );


            explanationTitle.textContent =
                "Your Stop Loss is closer to entry.";

            explanationText.textContent =
                "With the same position size, moving the Stop Loss closer reduces the planned price risk. However, the trade may have less room to move before reaching the stop.";

            return;

        }


        stateTitle.textContent =
            "Original Plan";

        stateBadge.textContent =
            "PLANNED";

        stateBadge.classList.add(
            "normal"
        );


        explanationTitle.textContent =
            "Your original trade plan is still active.";

        explanationText.textContent =
            "Your Stop Loss and Take Profit are exactly where you originally planned them. This gives you a defined risk and reward before management changes.";

    }


    /* =====================================================
       UPDATE VISUAL
    ===================================================== */

    function updateVisual(
        data
    ) {

        const range =
            Math.abs(
                data.target -
                data.stop
            );


        if (
            range <= 0
        ) {

            return;

        }


        const topPosition =
            (
                Math.abs(
                    data.target -
                    data.stop
                ) /
                range
            ) *
            100;


        /*
         * The visual is intentionally simplified.
         * It is a learning map, not a real price chart.
         */

        targetLine.style.top =
            "18%";


        entryLine.style.top =
            "50%";


        stopLine.style.top =
            "82%";


        if (
            direction ===
            "sell"
        ) {

            targetLine.style.top =
                "82%";

            stopLine.style.top =
                "18%";

        }

    }


    /* =====================================================
       BREAK-EVEN
    ===================================================== */

    function moveToBreakEven() {

        const entry =
            safeNumber(
                entryInput,
                originalEntry
            );


        currentStopPrice =
            entry;


        stopInput.value =
            formatPrice(
                entry
            );


        customStopInput.value =
            formatPrice(
                entry
            );


        partialTaken =
            false;


        updateTrade();

    }


    /* =====================================================
       PARTIAL PROFIT
    ===================================================== */

    function takePartialProfit() {

        if (
            partialTaken
        ) {

            return;

        }


        currentPosition =
            Math.floor(
                (
                    originalLot *
                    0.5
                ) *
                100
            ) /
            100;


        if (
            currentPosition <
            0.01
        ) {

            currentPosition =
                0.01;

        }


        lotInput.value =
            currentPosition.toFixed(
                2
            );


        partialTaken =
            true;


        updateTrade();

    }


    /* =====================================================
       CUSTOM STOP
    ===================================================== */

    function applyCustomStop() {

        const newStop =
            Number(
                customStopInput.value
            );


        if (
            !Number.isFinite(
                newStop
            )
        ) {

            return;

        }


        currentStopPrice =
            newStop;


        stopInput.value =
            formatPrice(
                newStop
            );


        partialTaken =
            false;


        updateTrade();

    }


    /* =====================================================
       RESET
    ===================================================== */

    function resetTrade() {

        entryInput.value =
            formatPrice(
                originalEntry
            );


        stopInput.value =
            formatPrice(
                originalStop
            );


        targetInput.value =
            formatPrice(
                originalTarget
            );


        lotInput.value =
            originalLot.toFixed(
                2
            );


        pipValueInput.value =
            originalPipValue;


        customStopInput.value =
            formatPrice(
                originalStop
            );


        currentStopPrice =
            originalStop;


        currentPosition =
            originalLot;


        partialTaken =
            false;


        updateTrade();

    }


    /* =====================================================
       INPUT EVENTS
    ===================================================== */

    [
        entryInput,
        targetInput,
        lotInput,
        pipValueInput
    ].forEach(
        function(input) {

            input.addEventListener(
                "input",
                function() {

                    if (
                        input ===
                        entryInput
                    ) {

                        currentStopPrice =
                            Number(
                                stopInput.value
                            );

                    }

                    updateTrade();

                }
            );

        }
    );


    stopInput.addEventListener(
        "input",
        function() {

            currentStopPrice =
                Number(
                    stopInput.value
                );


            customStopInput.value =
                stopInput.value;


            partialTaken =
                false;


            updateTrade();

        }
    );


    /* =====================================================
       BUTTON EVENTS
    ===================================================== */

    buyButton.addEventListener(
        "click",
        function() {

            setDirection(
                "buy"
            );

        }
    );


    sellButton.addEventListener(
        "click",
        function() {

            setDirection(
                "sell"
            );

        }
    );


    breakEvenButton.addEventListener(
        "click",
        moveToBreakEven
    );


    partialButton.addEventListener(
        "click",
        takePartialProfit
    );


    resetButton.addEventListener(
        "click",
        resetTrade
    );


    applyStopButton.addEventListener(
        "click",
        applyCustomStop
    );


    customStopInput.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key ===
                "Enter"
            ) {

                applyCustomStop();

            }

        }
    );


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    updateTrade();

}


/* =========================================================
   BUILD 010 AUTO INITIALIZATION
========================================================= */

function waitForBuild010() {

    if (
        document.getElementById(
            "build009ChallengeLab"
        )
    ) {

        initBuild010();

        return;

    }


    setTimeout(
        waitForBuild010,
        100
    );

}


if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        waitForBuild010
    );

}
else {

    waitForBuild010();

}

/* =========================================================
   BUILD 011
   TRADE OUTCOME SIMULATOR
========================================================= */

function initBuild011() {

    if (document.getElementById("build011OutcomeSimulator")) {
        return;
    }

    const build010 =
        document.getElementById("build010TradeManagement");

    if (!build010) {
        return;
    }

    createBuild011Markup(build010);
    setupBuild011();
}


/* =========================================================
   BUILD 011 MARKUP
========================================================= */

function createBuild011Markup(build010) {

    const section = document.createElement("section");

    section.id = "build011OutcomeSimulator";
    section.className = "pip-lab-build011";

    section.innerHTML = `

        <!-- HEADER -->

        <div class="pip-lab-build011-header">

            <span class="pip-lab-build011-badge">
                <i class="fa-solid fa-chart-line"></i>
                Build 011
            </span>

            <h2>
                Trade Outcome Simulator
            </h2>

            <p>
                What actually happens after you enter a trade?
                Move the price and watch the pips, money, R multiple
                and trade status change in real time.
            </p>

        </div>


        <!-- MAIN PANEL -->

        <div class="pip-lab-build011-panel">


            <!-- INTRO -->

            <div class="pip-lab-build011-intro">

                <div class="pip-lab-build011-intro-icon">
                    <i class="fa-solid fa-gamepad"></i>
                </div>

                <div>

                    <span>
                        LEARN BY DOING
                    </span>

                    <h3>
                        You control the price.
                    </h3>

                    <p>
                        Start with a planned trade, then move the simulated
                        market price. See exactly how many pips you gain or
                        lose and how that affects your money and R multiple.
                    </p>

                </div>

            </div>


            <!-- TRADE SETUP -->

            <div class="pip-lab-build011-setup">

                <div class="pip-lab-build011-section-title">

                    <span>
                        STEP 1
                    </span>

                    <strong>
                        Create your simulated trade
                    </strong>

                </div>


                <div class="pip-lab-build011-input-grid">


                    <!-- DIRECTION -->

                    <div class="pip-lab-build011-field">

                        <label>
                            Trade Direction
                        </label>

                        <div class="pip-lab-build011-direction">

                            <button
                                type="button"
                                id="build011Buy"
                                class="active buy"
                            >
                                <i class="fa-solid fa-arrow-up"></i>
                                BUY
                            </button>

                            <button
                                type="button"
                                id="build011Sell"
                                class="sell"
                            >
                                <i class="fa-solid fa-arrow-down"></i>
                                SELL
                            </button>

                        </div>

                    </div>


                    <!-- ENTRY -->

                    <div class="pip-lab-build011-field">

                        <label for="build011Entry">
                            Entry Price
                        </label>

                        <input
                            id="build011Entry"
                            type="number"
                            value="1.10000"
                            step="0.00001"
                        >

                        <small>
                            Price where the simulated trade begins
                        </small>

                    </div>


                    <!-- STOP -->

                    <div class="pip-lab-build011-field">

                        <label for="build011Stop">
                            Stop Loss
                        </label>

                        <input
                            id="build011Stop"
                            type="number"
                            value="1.09700"
                            step="0.00001"
                        >

                        <small>
                            Your maximum planned price distance
                        </small>

                    </div>


                    <!-- TARGET -->

                    <div class="pip-lab-build011-field">

                        <label for="build011Target">
                            Take Profit
                        </label>

                        <input
                            id="build011Target"
                            type="number"
                            value="1.10600"
                            step="0.00001"
                        >

                        <small>
                            Your planned profit target
                        </small>

                    </div>


                    <!-- LOT -->

                    <div class="pip-lab-build011-field">

                        <label for="build011Lot">
                            Position Size
                        </label>

                        <div class="pip-lab-build011-input-unit">

                            <input
                                id="build011Lot"
                                type="number"
                                value="0.10"
                                min="0.01"
                                step="0.01"
                            >

                            <span>
                                lot
                            </span>

                        </div>

                    </div>


                    <!-- PIP VALUE -->

                    <div class="pip-lab-build011-field">

                        <label for="build011PipValue">
                            Pip Value / Lot
                        </label>

                        <div class="pip-lab-build011-input-unit">

                            <span class="prefix">
                                $
                            </span>

                            <input
                                id="build011PipValue"
                                type="number"
                                value="10"
                                min="0"
                                step="0.01"
                            >

                            <span>
                                / lot
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            <!-- MARKET SIMULATOR -->

            <div class="pip-lab-build011-simulator">

                <div class="pip-lab-build011-simulator-header">

                    <div>

                        <span>
                            STEP 2
                        </span>

                        <strong>
                            Move the simulated market price
                        </strong>

                    </div>

                    <div
                        id="build011Status"
                        class="pip-lab-build011-status active"
                    >
                        TRADE ACTIVE
                    </div>

                </div>


                <!-- PRICE DISPLAY -->

                <div class="pip-lab-build011-price-display">

                    <span>
                        SIMULATED MARKET PRICE
                    </span>

                    <strong id="build011CurrentPrice">
                        1.10000
                    </strong>

                    <small id="build011PriceMessage">
                        Price is at your entry.
                    </small>

                </div>


                <!-- PRICE SLIDER -->

                <div class="pip-lab-build011-slider-area">

                    <div class="pip-lab-build011-slider-labels">

                        <span id="build011LowLabel">
                            1.09700
                        </span>

                        <span>
                            PRICE MOVEMENT
                        </span>

                        <span id="build011HighLabel">
                            1.10600
                        </span>

                    </div>


                    <input
                        id="build011PriceSlider"
                        class="pip-lab-build011-slider"
                        type="range"
                        min="109700"
                        max="110600"
                        value="110000"
                        step="1"
                    >


                    <div class="pip-lab-build011-slider-help">

                        <button
                            type="button"
                            id="build011MoveDown"
                        >
                            <i class="fa-solid fa-arrow-down"></i>
                            Move Down
                        </button>

                        <button
                            type="button"
                            id="build011MoveEntry"
                        >
                            <i class="fa-solid fa-bullseye"></i>
                            Entry
                        </button>

                        <button
                            type="button"
                            id="build011MoveUp"
                        >
                            <i class="fa-solid fa-arrow-up"></i>
                            Move Up
                        </button>

                    </div>

                </div>


                <!-- VISUAL MAP -->

                <div class="pip-lab-build011-map">

                    <div
                        id="build011TargetLine"
                        class="pip-lab-build011-map-line target"
                    >

                        <span>
                            TP
                        </span>

                        <strong id="build011TargetMap">
                            1.10600
                        </strong>

                    </div>


                    <div
                        id="build011CurrentLine"
                        class="pip-lab-build011-map-line current"
                    >

                        <span>
                            PRICE
                        </span>

                        <strong id="build011CurrentMap">
                            1.10000
                        </strong>

                    </div>


                    <div
                        id="build011EntryLine"
                        class="pip-lab-build011-map-line entry"
                    >

                        <span>
                            ENTRY
                        </span>

                        <strong id="build011EntryMap">
                            1.10000
                        </strong>

                    </div>


                    <div
                        id="build011StopLine"
                        class="pip-lab-build011-map-line stop"
                    >

                        <span>
                            SL
                        </span>

                        <strong id="build011StopMap">
                            1.09700
                        </strong>

                    </div>

                </div>

            </div>


            <!-- LIVE RESULT -->

            <div class="pip-lab-build011-result">

                <div class="pip-lab-build011-result-header">

                    <div>

                        <span>
                            LIVE TRADE RESULT
                        </span>

                        <strong id="build011ResultTitle">
                            Trade at Entry
                        </strong>

                    </div>

                    <div
                        id="build011OutcomeBadge"
                        class="pip-lab-build011-outcome neutral"
                    >
                        0R
                    </div>

                </div>


                <div class="pip-lab-build011-result-grid">


                    <div class="pip-lab-build011-result-card">

                        <span>
                            PRICE
                        </span>

                        <strong id="build011ResultPrice">
                            1.10000
                        </strong>

                    </div>


                    <div class="pip-lab-build011-result-card">

                        <span>
                            PIPS
                        </span>

                        <strong id="build011ResultPips">
                            0.0 pips
                        </strong>

                    </div>


                    <div class="pip-lab-build011-result-card">

                        <span>
                            P/L
                        </span>

                        <strong id="build011ResultMoney">
                            $0.00
                        </strong>

                    </div>


                    <div class="pip-lab-build011-result-card">

                        <span>
                            R MULTIPLE
                        </span>

                        <strong id="build011ResultR">
                            0.00R
                        </strong>

                    </div>


                    <div class="pip-lab-build011-result-card">

                        <span>
                            POSITION
                        </span>

                        <strong id="build011ResultLot">
                            0.10 lot
                        </strong>

                    </div>

                </div>

            </div>


            <!-- R EXPLANATION -->

            <div class="pip-lab-build011-r-box">

                <div class="pip-lab-build011-r-icon">
                    <i class="fa-solid fa-r"></i>
                </div>

                <div>

                    <span>
                        UNDERSTAND R
                    </span>

                    <strong>
                        1R means your original planned risk.
                    </strong>

                    <p id="build011RExplanation">
                        Your original Stop Loss is 30 pips away.
                        With a 0.10 lot position and a $10 pip value
                        per lot, your planned risk is $30.
                        Therefore, losing $30 = -1R and making $30 = +1R.
                    </p>

                </div>

            </div>


            <!-- SCENARIO BUTTONS -->

            <div class="pip-lab-build011-scenarios">

                <div class="pip-lab-build011-section-title">

                    <span>
                        TRY THESE
                    </span>

                    <strong>
                        See what happens at different outcomes
                    </strong>

                </div>


                <div class="pip-lab-build011-scenario-grid">


                    <button
                        type="button"
                        class="pip-lab-build011-scenario-button"
                        data-scenario="loss"
                    >

                        <i class="fa-solid fa-arrow-down"></i>

                        <span>
                            Hit Stop Loss
                        </span>

                    </button>


                    <button
                        type="button"
                        class="pip-lab-build011-scenario-button"
                        data-scenario="minus-half-r"
                    >

                        <i class="fa-solid fa-minus"></i>

                        <span>
                            -0.5R
                        </span>

                    </button>


                    <button
                        type="button"
                        class="pip-lab-build011-scenario-button"
                        data-scenario="one-r"
                    >

                        <i class="fa-solid fa-1"></i>

                        <span>
                            +1R
                        </span>

                    </button>


                    <button
                        type="button"
                        class="pip-lab-build011-scenario-button"
                        data-scenario="two-r"
                    >

                        <i class="fa-solid fa-2"></i>

                        <span>
                            +2R / TP
                        </span>

                    </button>


                    <button
                        type="button"
                        class="pip-lab-build011-scenario-button"
                        data-scenario="reset"
                    >

                        <i class="fa-solid fa-rotate-left"></i>

                        <span>
                            Reset
                        </span>

                    </button>

                </div>

            </div>


            <!-- EXPLANATION -->

            <div
                id="build011Explanation"
                class="pip-lab-build011-explanation"
            >

                <div class="pip-lab-build011-explanation-icon">

                    <i class="fa-solid fa-lightbulb"></i>

                </div>

                <div>

                    <span>
                        WHAT DOES THIS MEAN?
                    </span>

                    <strong id="build011ExplanationTitle">
                        The trade is currently at entry.
                    </strong>

                    <p id="build011ExplanationText">
                        Nothing has been gained or lost in this simplified
                        example. Move the market price to see how the
                        position changes.
                    </p>

                </div>

            </div>


            <!-- LEARNING CARDS -->

            <div class="pip-lab-build011-learning">

                <div class="pip-lab-build011-section-title">

                    <span>
                        THE CONNECTION
                    </span>

                    <strong>
                        What you should understand
                    </strong>

                </div>


                <div class="pip-lab-build011-learning-grid">


                    <div class="pip-lab-build011-learning-card">

                        <div class="pip-lab-build011-learning-icon">
                            <i class="fa-solid fa-ruler"></i>
                        </div>

                        <strong>
                            Pips
                        </strong>

                        <p>
                            Pips measure how far price has moved
                            from your entry.
                        </p>

                    </div>


                    <div class="pip-lab-build011-learning-card">

                        <div class="pip-lab-build011-learning-icon">
                            <i class="fa-solid fa-dollar-sign"></i>
                        </div>

                        <strong>
                            Money
                        </strong>

                        <p>
                            Position size and pip value convert
                            the price movement into money.
                        </p>

                    </div>


                    <div class="pip-lab-build011-learning-card">

                        <div class="pip-lab-build011-learning-icon">
                            <i class="fa-solid fa-r"></i>
                        </div>

                        <strong>
                            R
                        </strong>

                        <p>
                            R compares the current result with
                            the original amount you planned to risk.
                        </p>

                    </div>


                    <div class="pip-lab-build011-learning-card">

                        <div class="pip-lab-build011-learning-icon">
                            <i class="fa-solid fa-bullseye"></i>
                        </div>

                        <strong>
                            Outcome
                        </strong>

                        <p>
                            Stop Loss and Take Profit turn your
                            plan into a defined outcome.
                        </p>

                    </div>

                </div>

            </div>


            <!-- WARNING -->

            <div class="pip-lab-build011-warning">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <div>

                    <strong>
                        Educational simulator
                    </strong>

                    <p>
                        This is a simplified learning simulator.
                        It does not execute trades or predict future
                        market movement. Real trading can produce
                        different results because of spread, slippage,
                        liquidity, gaps and execution conditions.
                    </p>

                </div>

            </div>

        </div>
    `;

    build010.insertAdjacentElement(
        "afterend",
        section
    );
}


/* =========================================================
   BUILD 011 LOGIC
========================================================= */

function setupBuild011() {

    const buyButton =
        document.getElementById(
            "build011Buy"
        );

    const sellButton =
        document.getElementById(
            "build011Sell"
        );

    const entryInput =
        document.getElementById(
            "build011Entry"
        );

    const stopInput =
        document.getElementById(
            "build011Stop"
        );

    const targetInput =
        document.getElementById(
            "build011Target"
        );

    const lotInput =
        document.getElementById(
            "build011Lot"
        );

    const pipValueInput =
        document.getElementById(
            "build011PipValue"
        );

    const slider =
        document.getElementById(
            "build011PriceSlider"
        );

    const moveDown =
        document.getElementById(
            "build011MoveDown"
        );

    const moveEntry =
        document.getElementById(
            "build011MoveEntry"
        );

    const moveUp =
        document.getElementById(
            "build011MoveUp"
        );


    if (
        !entryInput ||
        !stopInput ||
        !targetInput ||
        !lotInput ||
        !pipValueInput ||
        !slider
    ) {
        return;
    }


    /* =====================================================
       OUTPUT ELEMENTS
    ===================================================== */

    const status =
        document.getElementById(
            "build011Status"
        );

    const currentPrice =
        document.getElementById(
            "build011CurrentPrice"
        );

    const priceMessage =
        document.getElementById(
            "build011PriceMessage"
        );

    const lowLabel =
        document.getElementById(
            "build011LowLabel"
        );

    const highLabel =
        document.getElementById(
            "build011HighLabel"
        );

    const targetMap =
        document.getElementById(
            "build011TargetMap"
        );

    const currentMap =
        document.getElementById(
            "build011CurrentMap"
        );

    const entryMap =
        document.getElementById(
            "build011EntryMap"
        );

    const stopMap =
        document.getElementById(
            "build011StopMap"
        );

    const resultTitle =
        document.getElementById(
            "build011ResultTitle"
        );

    const outcomeBadge =
        document.getElementById(
            "build011OutcomeBadge"
        );

    const resultPrice =
        document.getElementById(
            "build011ResultPrice"
        );

    const resultPips =
        document.getElementById(
            "build011ResultPips"
        );

    const resultMoney =
        document.getElementById(
            "build011ResultMoney"
        );

    const resultR =
        document.getElementById(
            "build011ResultR"
        );

    const resultLot =
        document.getElementById(
            "build011ResultLot"
        );

    const rExplanation =
        document.getElementById(
            "build011RExplanation"
        );

    const explanationTitle =
        document.getElementById(
            "build011ExplanationTitle"
        );

    const explanationText =
        document.getElementById(
            "build011ExplanationText"
        );

    const scenarioButtons =
        document.querySelectorAll(
            ".pip-lab-build011-scenario-button"
        );


    /* =====================================================
       STATE
    ===================================================== */

    let direction =
        "buy";

    let simulatedPrice =
        Number(
            entryInput.value
        );


    /* =====================================================
       HELPERS
    ===================================================== */

    function numberValue(
        input,
        fallback
    ) {

        const value =
            Number(
                input.value
            );

        return Number.isFinite(value)
            ? value
            : fallback;

    }


    function price(
        value
    ) {

        return Number(
            value
        ).toFixed(5);

    }


    function money(
        value
    ) {

        if (
            value > 0
        ) {

            return (
                "+$" +
                value.toFixed(2)
            );

        }

        if (
            value < 0
        ) {

            return (
                "-$" +
                Math.abs(
                    value
                ).toFixed(2)
            );

        }

        return "$0.00";

    }


    function calculateTrade() {

        const entry =
            numberValue(
                entryInput,
                1.10000
            );

        const stop =
            numberValue(
                stopInput,
                1.09700
            );

        const target =
            numberValue(
                targetInput,
                1.10600
            );

        const lot =
            Math.max(
                numberValue(
                    lotInput,
                    0.10
                ),
                0
            );

        const pipValue =
            Math.max(
                numberValue(
                    pipValueInput,
                    10
                ),
                0
            );


        const stopDistance =
            Math.abs(
                entry -
                stop
            ) *
            10000;


        const targetDistance =
            Math.abs(
                target -
                entry
            ) *
            10000;


        const risk =
            stopDistance *
            pipValue *
            lot;


        let pipMovement;


        if (
            direction ===
            "buy"
        ) {

            pipMovement =
                (
                    simulatedPrice -
                    entry
                ) *
                10000;

        }
        else {

            pipMovement =
                (
                    entry -
                    simulatedPrice
                ) *
                10000;

        }


        const pnl =
            pipMovement *
            pipValue *
            lot;


        const r =
            risk > 0
                ? pnl / risk
                : 0;


        return {

            entry,
            stop,
            target,
            lot,
            pipValue,
            stopDistance,
            targetDistance,
            risk,
            pipMovement,
            pnl,
            r

        };

    }


    /* =====================================================
       DIRECTION
    ===================================================== */

    function setDirection(
        newDirection
    ) {

        direction =
            newDirection;


        if (
            direction ===
            "buy"
        ) {

            buyButton.classList.add(
                "active"
            );

            sellButton.classList.remove(
                "active"
            );

        }
        else {

            sellButton.classList.add(
                "active"
            );

            buyButton.classList.remove(
                "active"
            );

        }


        updateSliderRange();

        updateSimulator();

    }


    /* =====================================================
       SLIDER RANGE
    ===================================================== */

    function updateSliderRange() {

        const entry =
            numberValue(
                entryInput,
                1.10000
            );

        const stop =
            numberValue(
                stopInput,
                1.09700
            );

        const target =
            numberValue(
                targetInput,
                1.10600
            );


        const lowest =
            Math.min(
                entry,
                stop,
                target
            );

        const highest =
            Math.max(
                entry,
                stop,
                target
            );


        /*
         * Add extra room beyond SL and TP so the student
         * can move price around both sides of the trade.
         */

        const extra =
            Math.max(
                Math.abs(
                    highest -
                    lowest
                ) * 0.35,
                0.001
            );


        const low =
            lowest -
            extra;

        const high =
            highest +
            extra;


        slider.min =
            Math.round(
                low *
                100000
            );

        slider.max =
            Math.round(
                high *
                100000
            );


        slider.value =
            Math.round(
                simulatedPrice *
                100000
            );


        lowLabel.textContent =
            price(
                low
            );

        highLabel.textContent =
            price(
                high
            );


        return {
            low,
            high
        };

    }


    /* =====================================================
       UPDATE SIMULATOR
    ===================================================== */

    function updateSimulator() {

        const data =
            calculateTrade();


        currentPrice.textContent =
            price(
                simulatedPrice
            );


        currentMap.textContent =
            price(
                simulatedPrice
            );


        entryMap.textContent =
            price(
                data.entry
            );


        targetMap.textContent =
            price(
                data.target
            );


        stopMap.textContent =
            price(
                data.stop
            );


        resultPrice.textContent =
            price(
                simulatedPrice
            );


        resultPips.textContent =
            (
                data.pipMovement >= 0
                    ? "+"
                    : ""
            ) +
            data.pipMovement.toFixed(
                1
            ) +
            " pips";


        resultMoney.textContent =
            money(
                data.pnl
            );


        resultR.textContent =
            (
                data.r >= 0
                    ? "+"
                    : ""
            ) +
            data.r.toFixed(
                2
            ) +
            "R";


        resultLot.textContent =
            data.lot.toFixed(
                2
            ) +
            " lot";


        updateOutcome(
            data
        );


        updateMap(
            data
        );


        updateRExplanation(
            data
        );

    }


    /* =====================================================
       OUTCOME
    ===================================================== */

    function updateOutcome(
        data
    ) {

        outcomeBadge.className =
            "pip-lab-build011-outcome";


        /*
         * Determine TP and SL based on direction.
         */

        let tpHit =
            false;

        let slHit =
            false;


        if (
            direction ===
            "buy"
        ) {

            tpHit =
                simulatedPrice >=
                data.target;

            slHit =
                simulatedPrice <=
                data.stop;

        }
        else {

            tpHit =
                simulatedPrice <=
                data.target;

            slHit =
                simulatedPrice >=
                data.stop;

        }


        if (
            tpHit
        ) {

            status.textContent =
                "TAKE PROFIT HIT";

            status.className =
                "pip-lab-build011-status profit";

            outcomeBadge.textContent =
                "+" +
                (
                    data.targetDistance /
                    data.stopDistance
                ).toFixed(
                    2
                ) +
                "R";

            outcomeBadge.classList.add(
                "profit"
            );


            resultTitle.textContent =
                "Take Profit Reached";


            priceMessage.textContent =
                "The simulated price reached your Take Profit.";


            explanationTitle.textContent =
                "Your Take Profit target has been reached.";

            explanationText.textContent =
                "The simulated price moved far enough in your planned direction to reach the target. In this simplified example, the trade result is based on the target distance and your position size.";

            return;

        }


        if (
            slHit
        ) {

            status.textContent =
                "STOP LOSS HIT";

            status.className =
                "pip-lab-build011-status loss";

            outcomeBadge.textContent =
                "-1.00R";

            outcomeBadge.classList.add(
                "loss"
            );


            resultTitle.textContent =
                "Stop Loss Reached";


            priceMessage.textContent =
                "The simulated price reached your Stop Loss.";


            explanationTitle.textContent =
                "Your Stop Loss has been reached.";

            explanationText.textContent =
                "The planned loss is approximately your original 1R risk in this simplified example. A Stop Loss defines where the trade plan is considered invalid or where the planned loss is limited.";

            return;

        }


        if (
            data.r > 0
        ) {

            status.textContent =
                "TRADE IN PROFIT";

            status.className =
                "pip-lab-build011-status profit";


            outcomeBadge.textContent =
                "+" +
                data.r.toFixed(
                    2
                ) +
                "R";

            outcomeBadge.classList.add(
                "profit"
            );


            resultTitle.textContent =
                "Trade in Profit";


            priceMessage.textContent =
                "Price is currently moving in your planned direction.";


            explanationTitle.textContent =
                "The simulated trade is currently profitable.";

            explanationText.textContent =
                "The price has moved in your favor. Your pips, money result and R multiple all increase as the simulated price moves farther in your favor.";

            return;

        }


        if (
            data.r < 0
        ) {

            status.textContent =
                "TRADE IN LOSS";

            status.className =
                "pip-lab-build011-status loss";


            outcomeBadge.textContent =
                data.r.toFixed(
                    2
                ) +
                "R";

            outcomeBadge.classList.add(
                "loss"
            );


            resultTitle.textContent =
                "Trade in Loss";


            priceMessage.textContent =
                "Price is currently moving against your position.";


            explanationTitle.textContent =
                "The simulated trade is currently losing.";

            explanationText.textContent =
                "The price has moved against your position. The farther it moves toward your Stop Loss, the larger the unrealized loss becomes.";

            return;

        }


        status.textContent =
            "TRADE ACTIVE";

        status.className =
            "pip-lab-build011-status active";


        outcomeBadge.textContent =
            "0R";

        outcomeBadge.classList.add(
            "neutral"
        );


        resultTitle.textContent =
            "Trade at Entry";


        priceMessage.textContent =
            "Price is at your entry.";


        explanationTitle.textContent =
            "The trade is currently at entry.";

        explanationText.textContent =
            "Nothing has been gained or lost in this simplified example. Move the market price to see how the position changes.";

    }


    /* =====================================================
       MAP
    ===================================================== */

    function updateMap(
        data
    ) {

        const range =
            Math.max(
                Math.abs(
                    data.target -
                    data.stop
                ),
                0.00001
            );


        /*
         * Map coordinates:
         *
         * 0% = top
         * 100% = bottom
         *
         * For BUY:
         * target = top
         * stop   = bottom
         *
         * For SELL:
         * stop   = top
         * target = bottom
         */


        let topPrice =
            data.target;

        let bottomPrice =
            data.stop;


        if (
            direction ===
            "sell"
        ) {

            topPrice =
                data.stop;

            bottomPrice =
                data.target;

        }


        const top =
            Math.min(
                topPrice,
                bottomPrice
            );

        const bottom =
            Math.max(
                topPrice,
                bottomPrice
            );


        function position(
            value
        ) {

            let result =
                (
                    (
                        value -
                        top
                    ) /
                    (
                        bottom -
                        top ||
                        range
                    )
                ) *
                100;


            result =
                Math.max(
                    8,
                    Math.min(
                        92,
                        result
                    )
                );


            return result;

        }


        const targetPosition =
            direction ===
            "buy"
                ? position(
                    data.target
                )
                : position(
                    data.target
                );


        const stopPosition =
            position(
                data.stop
            );


        const currentPosition =
            position(
                simulatedPrice
            );


        const targetLine =
            document.getElementById(
                "build011TargetLine"
            );

        const entryLine =
            document.getElementById(
                "build011EntryLine"
            );

        const stopLine =
            document.getElementById(
                "build011StopLine"
            );

        const currentLine =
            document.getElementById(
                "build011CurrentLine"
            );


        targetLine.style.top =
            targetPosition +
            "%";


        stopLine.style.top =
            stopPosition +
            "%";


        entryLine.style.top =
            position(
                data.entry
            ) +
            "%";


        currentLine.style.top =
            currentPosition +
            "%";

    }


    /* =====================================================
       R EXPLANATION
    ===================================================== */

    function updateRExplanation(
        data
    ) {

        if (
            data.risk <= 0
        ) {

            rExplanation.textContent =
                "Set a valid Stop Loss and position size to calculate R.";

            return;

        }


        rExplanation.textContent =
            "Your original planned risk is " +
            money(
                data.risk
            ).replace(
                "+",
                ""
            ) +
            ". Therefore, losing " +
            money(
                data.risk
            ).replace(
                "+",
                ""
            ) +
            " is approximately -1R, making the same amount is +1R, and making twice that amount is +2R.";

    }


    /* =====================================================
       SET SIMULATED PRICE
    ===================================================== */

    function setSimulatedPrice(
        newPrice
    ) {

        if (
            !Number.isFinite(
                newPrice
            )
        ) {

            return;

        }


        simulatedPrice =
            newPrice;


        updateSliderRange();


        slider.value =
            Math.round(
                simulatedPrice *
                100000
            );


        updateSimulator();

    }


    /* =====================================================
       SLIDER
    ===================================================== */

    slider.addEventListener(
        "input",
        function() {

            simulatedPrice =
                Number(
                    slider.value
                ) /
                100000;


            updateSimulator();

        }
    );


    /* =====================================================
       QUICK MOVEMENT
    ===================================================== */

    moveDown.addEventListener(
        "click",
        function() {

            const data =
                calculateTrade();


            const distance =
                Math.max(
                    data.stopDistance /
                    10000 /
                    2,
                    0.0001
                );


            setSimulatedPrice(
                simulatedPrice -
                distance
            );

        }
    );


    moveEntry.addEventListener(
        "click",
        function() {

            setSimulatedPrice(
                numberValue(
                    entryInput,
                    1.10000
                )
            );

        }
    );


    moveUp.addEventListener(
        "click",
        function() {

            const data =
                calculateTrade();


            const distance =
                Math.max(
                    data.targetDistance /
                    10000 /
                    2,
                    0.0001
                );


            setSimulatedPrice(
                simulatedPrice +
                distance
            );

        }
    );


    /* =====================================================
       DIRECTION
    ===================================================== */

    buyButton.addEventListener(
        "click",
        function() {

            setDirection(
                "buy"
            );

        }
    );


    sellButton.addEventListener(
        "click",
        function() {

            setDirection(
                "sell"
            );

        }
    );


    /* =====================================================
       INPUT EVENTS
    ===================================================== */

    [
        entryInput,
        stopInput,
        targetInput,
        lotInput,
        pipValueInput
    ].forEach(
        function(input) {

            input.addEventListener(
                "input",
                function() {

                    if (
                        input ===
                        entryInput
                    ) {

                        simulatedPrice =
                            Number(
                                entryInput.value
                            );

                    }


                    updateSliderRange();

                    updateSimulator();

                }
            );

        }
    );


    /* =====================================================
       SCENARIO BUTTONS
    ===================================================== */

    scenarioButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const scenario =
                        button.dataset.scenario;


                    const data =
                        calculateTrade();


                    if (
                        scenario ===
                        "loss"
                    ) {

                        setSimulatedPrice(
                            data.stop
                        );

                        return;

                    }


                    if (
                        scenario ===
                        "minus-half-r"
                    ) {

                        const halfRiskPips =
                            data.stopDistance /
                            2;


                        const movement =
                            halfRiskPips /
                            10000;


                        if (
                            direction ===
                            "buy"
                        ) {

                            setSimulatedPrice(
                                data.entry -
                                movement
                            );

                        }
                        else {

                            setSimulatedPrice(
                                data.entry +
                                movement
                            );

                        }

                        return;

                    }


                    if (
                        scenario ===
                        "one-r"
                    ) {

                        const movement =
                            data.stopDistance /
                            10000;


                        if (
                            direction ===
                            "buy"
                        ) {

                            setSimulatedPrice(
                                data.entry +
                                movement
                            );

                        }
                        else {

                            setSimulatedPrice(
                                data.entry -
                                movement
                            );

                        }

                        return;

                    }


                    if (
                        scenario ===
                        "two-r"
                    ) {

                        setSimulatedPrice(
                            data.target
                        );

                        return;

                    }


                    if (
                        scenario ===
                        "reset"
                    ) {

                        setSimulatedPrice(
                            data.entry
                        );

                    }

                }
            );

        }
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    updateSliderRange();

    setDirection(
        "buy"
    );

    setSimulatedPrice(
        Number(
            entryInput.value
        )
    );

}


/* =========================================================
   BUILD 011 AUTO INITIALIZATION
========================================================= */

function waitForBuild011() {

    if (
        document.getElementById(
            "build010TradeManagement"
        )
    ) {

        initBuild011();

        return;

    }


    setTimeout(
        waitForBuild011,
        100
    );

}


if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        waitForBuild011
    );

}
else {

    waitForBuild011();

}

/* =========================================================
   BUILD 012
   RISK UNIT (R) LEARNING LAB
========================================================= */

function initBuild012() {

    if (document.getElementById("build012RiskLab")) {
        return;
    }

    const build011 =
        document.getElementById("build011OutcomeSimulator");

    if (!build011) {
        return;
    }

    createBuild012Markup(build011);
    setupBuild012();
}


/* =========================================================
   BUILD 012 MARKUP
========================================================= */

function createBuild012Markup(build011) {

    const section = document.createElement("section");

    section.id = "build012RiskLab";
    section.className = "pip-lab-build012";

    section.innerHTML = `

        <!-- HEADER -->

        <div class="pip-lab-build012-header">

            <span class="pip-lab-build012-badge">
                <i class="fa-solid fa-r"></i>
                Build 012
            </span>

            <h2>
                R Risk Learning Lab
            </h2>

            <p>
                Learn what 1R really means and why professional traders
                often measure trade results in R instead of looking only
                at money.
            </p>

        </div>


        <!-- MAIN PANEL -->

        <div class="pip-lab-build012-panel">


            <!-- INTRO -->

            <div class="pip-lab-build012-intro">

                <div class="pip-lab-build012-intro-icon">
                    <i class="fa-solid fa-lightbulb"></i>
                </div>

                <div>

                    <span>
                        START HERE
                    </span>

                    <h3>
                        R is simply a unit of risk.
                    </h3>

                    <p>
                        Your original planned risk becomes 1R.
                        Once you know 1R, you can easily understand
                        losses, profits, and risk-to-reward results.
                    </p>

                </div>

            </div>


            <!-- CORE CONCEPT -->

            <div class="pip-lab-build012-core">

                <div class="pip-lab-build012-section-title">

                    <span>
                        THE BASIC IDEA
                    </span>

                    <strong>
                        What does 1R mean?
                    </strong>

                </div>


                <div class="pip-lab-build012-core-grid">


                    <!-- R VISUAL -->

                    <div class="pip-lab-build012-r-visual">

                        <div class="pip-lab-build012-big-r">
                            1R
                        </div>

                        <span>
                            YOUR PLANNED RISK
                        </span>

                        <strong id="build012RiskAmount">
                            $30.00
                        </strong>

                        <small>
                            This is the amount you planned
                            to risk before entering the trade.
                        </small>

                    </div>


                    <!-- EXPLANATION -->

                    <div class="pip-lab-build012-core-explanation">

                        <div class="pip-lab-build012-definition">

                            <span>
                                SIMPLE DEFINITION
                            </span>

                            <strong>
                                1R = the amount you planned to lose
                                if your Stop Loss is reached.
                            </strong>

                            <p>
                                If your calculated risk is $30,
                                then $30 is your 1R.
                            </p>

                        </div>


                        <div class="pip-lab-build012-example">

                            <div class="pip-lab-build012-example-row">

                                <span>
                                    -1R
                                </span>

                                <strong>
                                    -$30
                                </strong>

                                <small>
                                    Planned loss
                                </small>

                            </div>


                            <div class="pip-lab-build012-example-row">

                                <span>
                                    +1R
                                </span>

                                <strong>
                                    +$30
                                </strong>

                                <small>
                                    Profit equal to your risk
                                </small>

                            </div>


                            <div class="pip-lab-build012-example-row">

                                <span>
                                    +2R
                                </span>

                                <strong>
                                    +$60
                                </strong>

                                <small>
                                    Twice your planned risk
                                </small>

                            </div>


                            <div class="pip-lab-build012-example-row">

                                <span>
                                    +3R
                                </span>

                                <strong>
                                    +$90
                                </strong>

                                <small>
                                    Three times your planned risk
                                </small>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            <!-- CALCULATOR -->

            <div class="pip-lab-build012-calculator">

                <div class="pip-lab-build012-section-title">

                    <span>
                        STEP 1
                    </span>

                    <strong>
                        Change your planned risk
                    </strong>

                </div>


                <p class="pip-lab-build012-section-description">
                    Change the values below and watch 1R,
                    2R and 3R change automatically.
                </p>


                <div class="pip-lab-build012-input-grid">


                    <div class="pip-lab-build012-field">

                        <label for="build012Account">
                            Account Size
                        </label>

                        <div class="pip-lab-build012-input-unit">

                            <span>
                                $
                            </span>

                            <input
                                id="build012Account"
                                type="number"
                                value="1000"
                                min="0"
                                step="10"
                            >

                        </div>

                    </div>


                    <div class="pip-lab-build012-field">

                        <label for="build012RiskPercent">
                            Risk Per Trade
                        </label>

                        <div class="pip-lab-build012-input-unit">

                            <input
                                id="build012RiskPercent"
                                type="number"
                                value="3"
                                min="0"
                                step="0.1"
                            >

                            <span>
                                %
                            </span>

                        </div>

                    </div>


                    <div class="pip-lab-build012-field">

                        <label for="build012CustomRisk">
                            Or Enter Risk Directly
                        </label>

                        <div class="pip-lab-build012-input-unit">

                            <span>
                                $
                            </span>

                            <input
                                id="build012CustomRisk"
                                type="number"
                                value=""
                                min="0"
                                step="1"
                                placeholder="Optional"
                            >

                        </div>

                    </div>

                </div>


                <!-- R SCALE -->

                <div class="pip-lab-build012-r-scale">

                    <div class="pip-lab-build012-r-scale-card loss">

                        <span>
                            -1R
                        </span>

                        <strong id="build012MinusOne">
                            -$30.00
                        </strong>

                        <small>
                            Planned loss
                        </small>

                    </div>


                    <div class="pip-lab-build012-r-scale-card neutral">

                        <span>
                            0R
                        </span>

                        <strong>
                            $0.00
                        </strong>

                        <small>
                            Break-even
                        </small>

                    </div>


                    <div class="pip-lab-build012-r-scale-card profit">

                        <span>
                            +1R
                        </span>

                        <strong id="build012PlusOne">
                            +$30.00
                        </strong>

                        <small>
                            Equal to risk
                        </small>

                    </div>


                    <div class="pip-lab-build012-r-scale-card profit">

                        <span>
                            +2R
                        </span>

                        <strong id="build012PlusTwo">
                            +$60.00
                        </strong>

                        <small>
                            Twice the risk
                        </small>

                    </div>


                    <div class="pip-lab-build012-r-scale-card profit">

                        <span>
                            +3R
                        </span>

                        <strong id="build012PlusThree">
                            +$90.00
                        </strong>

                        <small>
                            Three times the risk
                        </small>

                    </div>

                </div>

            </div>


            <!-- SAME R DIFFERENT MONEY -->

            <div class="pip-lab-build012-comparison">

                <div class="pip-lab-build012-section-title">

                    <span>
                        STEP 2
                    </span>

                    <strong>
                        Same R, different money
                    </strong>

                </div>

                <p class="pip-lab-build012-section-description">
                    R allows traders with different account sizes
                    to compare performance using the same measurement.
                </p>


                <div class="pip-lab-build012-trader-grid">


                    <!-- TRADER A -->

                    <div class="pip-lab-build012-trader-card">

                        <div class="pip-lab-build012-trader-top">

                            <span>
                                TRADER A
                            </span>

                            <strong>
                                Small Risk
                            </strong>

                        </div>

                        <div class="pip-lab-build012-trader-values">

                            <div>
                                <span>
                                    1R
                                </span>

                                <strong>
                                    $10
                                </strong>
                            </div>

                            <div>
                                <span>
                                    RESULT
                                </span>

                                <strong>
                                    +2R
                                </strong>
                            </div>

                            <div>
                                <span>
                                    PROFIT
                                </span>

                                <strong>
                                    $20
                                </strong>
                            </div>

                        </div>

                    </div>


                    <!-- TRADER B -->

                    <div class="pip-lab-build012-trader-card">

                        <div class="pip-lab-build012-trader-top">

                            <span>
                                TRADER B
                            </span>

                            <strong>
                                Larger Risk
                            </strong>

                        </div>

                        <div class="pip-lab-build012-trader-values">

                            <div>
                                <span>
                                    1R
                                </span>

                                <strong>
                                    $100
                                </strong>
                            </div>

                            <div>
                                <span>
                                    RESULT
                                </span>

                                <strong>
                                    +2R
                                </strong>
                            </div>

                            <div>
                                <span>
                                    PROFIT
                                </span>

                                <strong>
                                    $200
                                </strong>
                            </div>

                        </div>

                    </div>

                </div>


                <div class="pip-lab-build012-comparison-result">

                    <i class="fa-solid fa-scale-balanced"></i>

                    <div>

                        <strong>
                            Both traders made the same R result.
                        </strong>

                        <p>
                            Their money is different because their
                            original risk was different. Their trading
                            performance can still be compared as +2R.
                        </p>

                    </div>

                </div>

            </div>


            <!-- R MULTIPLE BUILDER -->

            <div class="pip-lab-build012-builder">

                <div class="pip-lab-build012-section-title">

                    <span>
                        STEP 3
                    </span>

                    <strong>
                        Build your own R result
                    </strong>

                </div>

                <p class="pip-lab-build012-section-description">
                    Choose a result and see exactly how much money
                    that R multiple represents.
                </p>


                <div class="pip-lab-build012-builder-content">


                    <div class="pip-lab-build012-r-buttons">

                        <button
                            type="button"
                            data-r-value="-1"
                            class="active loss"
                        >
                            -1R
                        </button>

                        <button
                            type="button"
                            data-r-value="-0.5"
                            class="loss"
                        >
                            -0.5R
                        </button>

                        <button
                            type="button"
                            data-r-value="0"
                        >
                            0R
                        </button>

                        <button
                            type="button"
                            data-r-value="0.5"
                        >
                            +0.5R
                        </button>

                        <button
                            type="button"
                            data-r-value="1"
                        >
                            +1R
                        </button>

                        <button
                            type="button"
                            data-r-value="2"
                        >
                            +2R
                        </button>

                        <button
                            type="button"
                            data-r-value="3"
                        >
                            +3R
                        </button>

                        <button
                            type="button"
                            data-r-value="5"
                        >
                            +5R
                        </button>

                    </div>


                    <div class="pip-lab-build012-selected-result">

                        <span>
                            SELECTED RESULT
                        </span>

                        <strong id="build012SelectedR">
                            -1R
                        </strong>

                        <div
                            id="build012SelectedMoney"
                            class="loss"
                        >
                            -$30.00
                        </div>

                        <small id="build012SelectedText">
                            This represents a loss equal to your
                            original planned risk.
                        </small>

                    </div>

                </div>

            </div>


            <!-- R VS RR -->

            <div class="pip-lab-build012-rr">

                <div class="pip-lab-build012-section-title">

                    <span>
                        IMPORTANT
                    </span>

                    <strong>
                        R is not the same as Risk-to-Reward
                    </strong>

                </div>


                <div class="pip-lab-build012-rr-grid">


                    <div class="pip-lab-build012-rr-card">

                        <div class="pip-lab-build012-rr-icon">
                            R
                        </div>

                        <strong>
                            R = Result
                        </strong>

                        <p>
                            R tells you how much the trade actually
                            gained or lost compared with your original
                            planned risk.
                        </p>

                        <div class="pip-lab-build012-rr-example">
                            Example:
                            <strong>
                                +2R
                            </strong>
                        </div>

                    </div>


                    <div class="pip-lab-build012-rr-card">

                        <div class="pip-lab-build012-rr-icon">
                            R:R
                        </div>

                        <strong>
                            R:R = Trade Plan
                        </strong>

                        <p>
                            Risk-to-reward describes the relationship
                            between your planned Stop Loss distance
                            and planned Take Profit distance.
                        </p>

                        <div class="pip-lab-build012-rr-example">
                            Example:
                            <strong>
                                1:2
                            </strong>
                        </div>

                    </div>


                </div>


                <div class="pip-lab-build012-rr-note">

                    <i class="fa-solid fa-circle-info"></i>

                    <p>
                        A trade planned at 1:2 does not automatically
                        produce +2R. Price still has to reach the target
                        for the trade to actually finish at +2R.
                    </p>

                </div>

            </div>


            <!-- PARTIAL PROFIT -->

            <div class="pip-lab-build012-partial">

                <div class="pip-lab-build012-section-title">

                    <span>
                        ADVANCED BUT SIMPLE
                    </span>

                    <strong>
                        What happens with partial profit?
                    </strong>

                </div>


                <div class="pip-lab-build012-partial-grid">

                    <div class="pip-lab-build012-partial-control">

                        <label for="build012PartialPercent">
                            Position Closed
                        </label>

                        <input
                            id="build012PartialPercent"
                            type="range"
                            min="0"
                            max="100"
                            value="50"
                            step="10"
                        >

                        <strong id="build012PartialLabel">
                            50%
                        </strong>

                    </div>


                    <div class="pip-lab-build012-partial-control">

                        <label for="build012PartialR">
                            Result On Closed Portion
                        </label>

                        <input
                            id="build012PartialR"
                            type="range"
                            min="-1"
                            max="5"
                            value="2"
                            step="0.5"
                        >

                        <strong id="build012PartialRLabel">
                            +2R
                        </strong>

                    </div>


                    <div class="pip-lab-build012-partial-result">

                        <span>
                            CONTRIBUTION TO TOTAL TRADE
                        </span>

                        <strong id="build012PartialResult">
                            +1.00R
                        </strong>

                        <small id="build012PartialExplanation">
                            Closing 50% of the position at +2R
                            contributes +1R to the total trade result.
                        </small>

                    </div>

                </div>

            </div>


            <!-- TAKEAWAY -->

            <div class="pip-lab-build012-takeaway">

                <div class="pip-lab-build012-takeaway-icon">
                    <i class="fa-solid fa-check"></i>
                </div>

                <div>

                    <span>
                        REMEMBER THIS
                    </span>

                    <strong>
                        First calculate your risk. Then 1R becomes your
                        measuring unit.
                    </strong>

                    <p>
                        Once you know your 1R, you can understand whether
                        a trade made -1R, +0.5R, +1R, +2R or more without
                        being confused by different account sizes or
                        different dollar amounts.
                    </p>

                </div>

            </div>


            <!-- WARNING -->

            <div class="pip-lab-build012-warning">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <div>

                    <strong>
                        Educational example
                    </strong>

                    <p>
                        R is a measurement framework. It does not guarantee
                        profits or make a trade safer. Real trading results
                        can differ because of spread, slippage, execution,
                        fees and market conditions.
                    </p>

                </div>

            </div>

        </div>
    `;

    build011.insertAdjacentElement(
        "afterend",
        section
    );
}


/* =========================================================
   BUILD 012 LOGIC
========================================================= */

function setupBuild012() {

    const accountInput =
        document.getElementById(
            "build012Account"
        );

    const riskPercentInput =
        document.getElementById(
            "build012RiskPercent"
        );

    const customRiskInput =
        document.getElementById(
            "build012CustomRisk"
        );


    const riskAmount =
        document.getElementById(
            "build012RiskAmount"
        );

    const minusOne =
        document.getElementById(
            "build012MinusOne"
        );

    const plusOne =
        document.getElementById(
            "build012PlusOne"
        );

    const plusTwo =
        document.getElementById(
            "build012PlusTwo"
        );

    const plusThree =
        document.getElementById(
            "build012PlusThree"
        );


    const selectedR =
        document.getElementById(
            "build012SelectedR"
        );

    const selectedMoney =
        document.getElementById(
            "build012SelectedMoney"
        );

    const selectedText =
        document.getElementById(
            "build012SelectedText"
        );


    const partialPercent =
        document.getElementById(
            "build012PartialPercent"
        );

    const partialR =
        document.getElementById(
            "build012PartialR"
        );

    const partialLabel =
        document.getElementById(
            "build012PartialLabel"
        );

    const partialRLabel =
        document.getElementById(
            "build012PartialRLabel"
        );

    const partialResult =
        document.getElementById(
            "build012PartialResult"
        );

    const partialExplanation =
        document.getElementById(
            "build012PartialExplanation"
        );


    if (
        !accountInput ||
        !riskPercentInput ||
        !customRiskInput
    ) {
        return;
    }


    /* =====================================================
       HELPERS
    ===================================================== */

    function getNumber(
        input,
        fallback = 0
    ) {

        const value =
            Number(
                input.value
            );

        return Number.isFinite(
            value
        )
            ? value
            : fallback;

    }


    function money(
        value
    ) {

        if (
            value > 0
        ) {

            return (
                "+$" +
                value.toFixed(2)
            );

        }

        if (
            value < 0
        ) {

            return (
                "-$" +
                Math.abs(
                    value
                ).toFixed(2)
            );

        }

        return "$0.00";

    }


    function calculateRisk() {

        const customRisk =
            getNumber(
                customRiskInput,
                0
            );


        if (
            customRisk > 0
        ) {

            return customRisk;

        }


        const account =
            Math.max(
                getNumber(
                    accountInput,
                    0
                ),
                0
            );


        const riskPercent =
            Math.max(
                getNumber(
                    riskPercentInput,
                    0
                ),
                0
            );


        return (
            account *
            riskPercent /
            100
        );

    }


    /* =====================================================
       UPDATE R SCALE
    ===================================================== */

    function updateRiskScale() {

        const risk =
            calculateRisk();


        riskAmount.textContent =
            money(
                risk
            ).replace(
                "+",
                ""
            );


        minusOne.textContent =
            money(
                -risk
            );


        plusOne.textContent =
            money(
                risk
            );


        plusTwo.textContent =
            money(
                risk * 2
            );


        plusThree.textContent =
            money(
                risk * 3
            );


        updateSelectedResult();

        updatePartialResult();

    }


    /* =====================================================
       SELECTED R
    ===================================================== */

    let selectedRValue =
        -1;


    function updateSelectedResult() {

        const risk =
            calculateRisk();


        const result =
            risk *
            selectedRValue;


        selectedR.textContent =
            (
                selectedRValue > 0
                    ? "+"
                    : ""
            ) +
            selectedRValue.toFixed(
                2
            ) +
            "R";


        selectedMoney.textContent =
            money(
                result
            );


        selectedMoney.classList.remove(
            "profit",
            "loss",
            "neutral"
        );


        if (
            selectedRValue > 0
        ) {

            selectedMoney.classList.add(
                "profit"
            );

        }
        else if (
            selectedRValue < 0
        ) {

            selectedMoney.classList.add(
                "loss"
            );

        }
        else {

            selectedMoney.classList.add(
                "neutral"
            );

        }


        if (
            selectedRValue ===
            -1
        ) {

            selectedText.textContent =
                "This represents a loss equal to your original planned risk.";

        }
        else if (
            selectedRValue ===
            -0.5
        ) {

            selectedText.textContent =
                "The trade lost half of your original planned risk.";

        }
        else if (
            selectedRValue ===
            0
        ) {

            selectedText.textContent =
                "The trade finished at break-even.";

        }
        else if (
            selectedRValue ===
            0.5
        ) {

            selectedText.textContent =
                "The trade made half of your original planned risk.";

        }
        else if (
            selectedRValue ===
            1
        ) {

            selectedText.textContent =
                "The trade made an amount equal to your original planned risk.";

        }
        else if (
            selectedRValue ===
            2
        ) {

            selectedText.textContent =
                "The trade made twice your original planned risk.";

        }
        else if (
            selectedRValue ===
            3
        ) {

            selectedText.textContent =
                "The trade made three times your original planned risk.";

        }
        else if (
            selectedRValue ===
            5
        ) {

            selectedText.textContent =
                "The trade made five times your original planned risk.";

        }

    }


    /* =====================================================
       R BUTTONS
    ===================================================== */

    const rButtons =
        document.querySelectorAll(
            ".pip-lab-build012-r-buttons button"
        );


    rButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    rButtons.forEach(
                        function(item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    selectedRValue =
                        Number(
                            button.dataset.rValue
                        );


                    updateSelectedResult();

                }
            );

        }
    );


    /* =====================================================
       PARTIAL PROFIT
    ===================================================== */

    function updatePartialResult() {

        const risk =
            calculateRisk();


        const percentage =
            getNumber(
                partialPercent,
                50
            );


        const rValue =
            getNumber(
                partialR,
                2
            );


        const contribution =
            (
                percentage /
                100
            ) *
            rValue;


        partialLabel.textContent =
            percentage.toFixed(
                0
            ) +
            "%";


        partialRLabel.textContent =
            (
                rValue > 0
                    ? "+"
                    : ""
            ) +
            rValue.toFixed(
                2
            ) +
            "R";


        partialResult.textContent =
            (
                contribution > 0
                    ? "+"
                    : ""
            ) +
            contribution.toFixed(
                2
            ) +
            "R";


        partialResult.classList.remove(
            "profit",
            "loss",
            "neutral"
        );


        if (
            contribution > 0
        ) {

            partialResult.classList.add(
                "profit"
            );

        }
        else if (
            contribution < 0
        ) {

            partialResult.classList.add(
                "loss"
            );

        }
        else {

            partialResult.classList.add(
                "neutral"
            );

        }


        const moneyContribution =
            risk *
            contribution;


        partialExplanation.textContent =
            "Closing " +
            percentage.toFixed(
                0
            ) +
            "% of the position at " +
            (
                rValue > 0
                    ? "+"
                    : ""
            ) +
            rValue.toFixed(
                2
            ) +
            "R contributes " +
            (
                contribution > 0
                    ? "+"
                    : ""
            ) +
            contribution.toFixed(
                2
            ) +
            "R to the total trade result (" +
            money(
                moneyContribution
            ) +
            ").";

    }


    /* =====================================================
       INPUT EVENTS
    ===================================================== */

    [
        accountInput,
        riskPercentInput,
        customRiskInput
    ].forEach(
        function(input) {

            input.addEventListener(
                "input",
                function() {

                    /*
                     * If the user enters a custom dollar risk,
                     * clear the percentage field visually only
                     * when they actually use custom risk.
                     */

                    updateRiskScale();

                }
            );

        }
    );


    partialPercent.addEventListener(
        "input",
        updatePartialResult
    );


    partialR.addEventListener(
        "input",
        updatePartialResult
    );


    /* =====================================================
       CUSTOM RISK BEHAVIOUR
    ===================================================== */

    customRiskInput.addEventListener(
        "input",
        function() {

            if (
                getNumber(
                    customRiskInput,
                    0
                ) > 0
            ) {

                customRiskInput.classList.add(
                    "active"
                );

            }
            else {

                customRiskInput.classList.remove(
                    "active"
                );

            }


            updateRiskScale();

        }
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    updateRiskScale();

}


/* =========================================================
   BUILD 012 AUTO INITIALIZATION
========================================================= */

function waitForBuild012() {

    if (
        document.getElementById(
            "build011OutcomeSimulator"
        )
    ) {

        initBuild012();

        return;

    }


    setTimeout(
        waitForBuild012,
        100
    );

}


if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        waitForBuild012
    );

}
else {

    waitForBuild012();

}

/* =========================================================
   BUILD 013
   MULTI-TRADE RISK & ACCOUNT IMPACT
========================================================= */

function initBuild013() {

    if (document.getElementById("build013RiskImpact")) {
        return;
    }

    const build012 =
        document.getElementById("build012RiskLab");

    if (!build012) {
        return;
    }

    createBuild013Markup(build012);
    setupBuild013();
}


/* =========================================================
   BUILD 013 MARKUP
========================================================= */

function createBuild013Markup(build012) {

    const section = document.createElement("section");

    section.id = "build013RiskImpact";
    section.className = "pip-lab-build013";

    section.innerHTML = `

        <!-- HEADER -->

        <div class="pip-lab-build013-header">

            <span class="pip-lab-build013-badge">
                <i class="fa-solid fa-chart-line"></i>
                Build 013
            </span>

            <h2>
                Multi-Trade Risk & Account Impact
            </h2>

            <p>
                One trade can look small. Multiple trades can change
                your account quickly. Build a sequence of trades and
                see exactly how risk, R, profit, loss and drawdown
                affect your account.
            </p>

        </div>


        <!-- MAIN PANEL -->

        <div class="pip-lab-build013-panel">


            <!-- INTRO -->

            <div class="pip-lab-build013-intro">

                <div class="pip-lab-build013-intro-icon">
                    <i class="fa-solid fa-layer-group"></i>
                </div>

                <div>

                    <span>
                        THINK BEYOND ONE TRADE
                    </span>

                    <h3>
                        Your account experiences a series of trades,
                        not just one trade.
                    </h3>

                    <p>
                        A trader can have winning and losing trades.
                        The important question is what happens to the
                        account after all of them are combined.
                    </p>

                </div>

            </div>


            <!-- ACCOUNT SETUP -->

            <div class="pip-lab-build013-setup">

                <div class="pip-lab-build013-section-title">

                    <span>
                        STEP 1
                    </span>

                    <strong>
                        Create your account scenario
                    </strong>

                </div>

                <p class="pip-lab-build013-description">
                    Start with an account and choose how much of the
                    account you plan to risk on each trade.
                </p>


                <div class="pip-lab-build013-input-grid">


                    <div class="pip-lab-build013-field">

                        <label for="build013Account">
                            Starting Account
                        </label>

                        <div class="pip-lab-build013-input-unit">

                            <span>
                                $
                            </span>

                            <input
                                id="build013Account"
                                type="number"
                                value="1000"
                                min="0"
                                step="10"
                            >

                        </div>

                    </div>


                    <div class="pip-lab-build013-field">

                        <label for="build013RiskPercent">
                            Risk Per Trade
                        </label>

                        <div class="pip-lab-build013-input-unit">

                            <input
                                id="build013RiskPercent"
                                type="number"
                                value="1"
                                min="0"
                                step="0.1"
                            >

                            <span>
                                %
                            </span>

                        </div>

                    </div>


                    <div class="pip-lab-build013-field">

                        <label for="build013StartingR">
                            Default Trade Result
                        </label>

                        <div class="pip-lab-build013-input-unit">

                            <input
                                id="build013StartingR"
                                type="number"
                                value="1"
                                step="0.5"
                            >

                            <span>
                                R
                            </span>

                        </div>

                    </div>

                </div>


                <!-- ACCOUNT SUMMARY -->

                <div class="pip-lab-build013-account-summary">


                    <div class="pip-lab-build013-summary-card">

                        <span>
                            STARTING BALANCE
                        </span>

                        <strong id="build013StartingBalance">
                            $1,000.00
                        </strong>

                    </div>


                    <div class="pip-lab-build013-summary-card">

                        <span>
                            1R RISK
                        </span>

                        <strong id="build013OneR">
                            $10.00
                        </strong>

                    </div>


                    <div class="pip-lab-build013-summary-card">

                        <span>
                            RISK %
                        </span>

                        <strong id="build013RiskDisplay">
                            1.00%
                        </strong>

                    </div>


                    <div class="pip-lab-build013-summary-card">

                        <span>
                            CURRENT BALANCE
                        </span>

                        <strong id="build013CurrentBalance">
                            $1,000.00
                        </strong>

                    </div>

                </div>

            </div>


            <!-- TRADE BUILDER -->

            <div class="pip-lab-build013-builder">

                <div class="pip-lab-build013-section-title">

                    <span>
                        STEP 2
                    </span>

                    <strong>
                        Build your trade sequence
                    </strong>

                </div>

                <p class="pip-lab-build013-description">
                    Add different trade results. Try winning trades,
                    losing trades, break-even trades and larger R
                    winners to see how the account changes.
                </p>


                <div class="pip-lab-build013-trade-controls">


                    <button
                        type="button"
                        class="pip-lab-build013-trade-button loss"
                        data-trade-r="-1"
                    >
                        <i class="fa-solid fa-arrow-down"></i>
                        <span>
                            -1R Loss
                        </span>
                    </button>


                    <button
                        type="button"
                        class="pip-lab-build013-trade-button loss"
                        data-trade-r="-0.5"
                    >
                        <i class="fa-solid fa-minus"></i>
                        <span>
                            -0.5R
                        </span>
                    </button>


                    <button
                        type="button"
                        class="pip-lab-build013-trade-button neutral"
                        data-trade-r="0"
                    >
                        <i class="fa-solid fa-equals"></i>
                        <span>
                            0R
                        </span>
                    </button>


                    <button
                        type="button"
                        class="pip-lab-build013-trade-button profit"
                        data-trade-r="0.5"
                    >
                        <i class="fa-solid fa-arrow-up"></i>
                        <span>
                            +0.5R
                        </span>
                    </button>


                    <button
                        type="button"
                        class="pip-lab-build013-trade-button profit"
                        data-trade-r="1"
                    >
                        <i class="fa-solid fa-1"></i>
                        <span>
                            +1R
                        </span>
                    </button>


                    <button
                        type="button"
                        class="pip-lab-build013-trade-button profit"
                        data-trade-r="2"
                    >
                        <i class="fa-solid fa-2"></i>
                        <span>
                            +2R
                        </span>
                    </button>


                    <button
                        type="button"
                        class="pip-lab-build013-trade-button profit"
                        data-trade-r="3"
                    >
                        <i class="fa-solid fa-3"></i>
                        <span>
                            +3R
                        </span>
                    </button>


                    <button
                        type="button"
                        id="build013Undo"
                        class="pip-lab-build013-trade-button undo"
                    >
                        <i class="fa-solid fa-rotate-left"></i>
                        <span>
                            Undo
                        </span>
                    </button>


                    <button
                        type="button"
                        id="build013Clear"
                        class="pip-lab-build013-trade-button clear"
                    >
                        <i class="fa-solid fa-trash"></i>
                        <span>
                            Clear All
                        </span>
                    </button>

                </div>


                <!-- QUICK SCENARIOS -->

                <div class="pip-lab-build013-scenarios">

                    <span>
                        QUICK SCENARIOS
                    </span>

                    <button
                        type="button"
                        data-scenario="balanced"
                    >
                        3W / 2L
                    </button>

                    <button
                        type="button"
                        data-scenario="winning"
                    >
                        Winning Run
                    </button>

                    <button
                        type="button"
                        data-scenario="losing"
                    >
                        Losing Run
                    </button>

                    <button
                        type="button"
                        data-scenario="mixed"
                    >
                        Mixed Market
                    </button>

                </div>

            </div>


            <!-- LIVE STATS -->

            <div class="pip-lab-build013-stats">

                <div class="pip-lab-build013-section-title">

                    <span>
                        LIVE ACCOUNT
                    </span>

                    <strong>
                        What is happening to the account?
                    </strong>

                </div>


                <div class="pip-lab-build013-stats-grid">


                    <div class="pip-lab-build013-stat-card">

                        <span>
                            TRADES
                        </span>

                        <strong id="build013TradeCount">
                            0
                        </strong>

                    </div>


                    <div class="pip-lab-build013-stat-card">

                        <span>
                            WINS
                        </span>

                        <strong id="build013Wins">
                            0
                        </strong>

                    </div>


                    <div class="pip-lab-build013-stat-card">

                        <span>
                            LOSSES
                        </span>

                        <strong id="build013Losses">
                            0
                        </strong>

                    </div>


                    <div class="pip-lab-build013-stat-card">

                        <span>
                            WIN RATE
                        </span>

                        <strong id="build013WinRate">
                            0.0%
                        </strong>

                    </div>


                    <div class="pip-lab-build013-stat-card">

                        <span>
                            TOTAL R
                        </span>

                        <strong id="build013TotalR">
                            0.00R
                        </strong>

                    </div>


                    <div class="pip-lab-build013-stat-card">

                        <span>
                            TOTAL P/L
                        </span>

                        <strong id="build013TotalPL">
                            $0.00
                        </strong>

                    </div>


                    <div class="pip-lab-build013-stat-card">

                        <span>
                            DRAWdown
                        </span>

                        <strong id="build013Drawdown">
                            0.00%
                        </strong>

                    </div>


                    <div class="pip-lab-build013-stat-card">

                        <span>
                            CURRENT BALANCE
                        </span>

                        <strong id="build013LiveBalance">
                            $1,000.00
                        </strong>

                    </div>

                </div>

            </div>


            <!-- ACCOUNT CURVE -->

            <div class="pip-lab-build013-curve">

                <div class="pip-lab-build013-curve-header">

                    <div>

                        <span>
                            ACCOUNT CURVE
                        </span>

                        <strong>
                            Watch the account change after every trade
                        </strong>

                    </div>

                    <span
                        id="build013CurveStatus"
                        class="pip-lab-build013-curve-status"
                    >
                        NO TRADES
                    </span>

                </div>


                <div
                    id="build013Chart"
                    class="pip-lab-build013-chart"
                >

                    <div class="pip-lab-build013-chart-empty">

                        <i class="fa-solid fa-chart-area"></i>

                        <span>
                            Add trades to create your account curve.
                        </span>

                    </div>

                </div>

            </div>


            <!-- TRADE HISTORY -->

            <div class="pip-lab-build013-history">

                <div class="pip-lab-build013-history-header">

                    <div>

                        <span>
                            TRADE HISTORY
                        </span>

                        <strong>
                            Every trade affects the account
                        </strong>

                    </div>

                    <span id="build013HistoryCount">
                        0 trades
                    </span>

                </div>


                <div
                    id="build013History"
                    class="pip-lab-build013-history-list"
                >

                    <div class="pip-lab-build013-empty-history">

                        <i class="fa-solid fa-list"></i>

                        <span>
                            Your trades will appear here.
                        </span>

                    </div>

                </div>

            </div>


            <!-- DRAWdown LESSON -->

            <div class="pip-lab-build013-drawdown">

                <div class="pip-lab-build013-section-title">

                    <span>
                        UNDERSTAND DRAWDOWN
                    </span>

                    <strong>
                        Why a losing streak matters
                    </strong>

                </div>


                <div class="pip-lab-build013-drawdown-grid">


                    <div class="pip-lab-build013-streak-card">

                        <span>
                            1% RISK
                        </span>

                        <strong>
                            5 LOSSES
                        </strong>

                        <div>
                            <b>
                                -5R
                            </b>

                            <small>
                                Approximately -5%
                            </small>
                        </div>

                    </div>


                    <div class="pip-lab-build013-streak-card warning">

                        <span>
                            2% RISK
                        </span>

                        <strong>
                            5 LOSSES
                        </strong>

                        <div>
                            <b>
                                -10R
                            </b>

                            <small>
                                Approximately -10%
                            </small>
                        </div>

                    </div>


                    <div class="pip-lab-build013-streak-card danger">

                        <span>
                            5% RISK
                        </span>

                        <strong>
                            5 LOSSES
                        </strong>

                        <div>
                            <b>
                                -25R
                            </b>

                            <small>
                                Approximately -25%
                            </small>
                        </div>

                    </div>

                </div>


                <div class="pip-lab-build013-drawdown-note">

                    <i class="fa-solid fa-circle-info"></i>

                    <p>
                        These examples use a simple fixed-percentage
                        illustration. In real trading, if risk is based
                        on the changing account balance, the dollar amount
                        risked can change after every trade.
                    </p>

                </div>

            </div>


            <!-- WHAT IF -->

            <div class="pip-lab-build013-whatif">

                <div class="pip-lab-build013-section-title">

                    <span>
                        WHAT IF?
                    </span>

                    <strong>
                        See how the same trades behave with different risk
                    </strong>

                </div>

                <p class="pip-lab-build013-description">
                    Keep the exact same trade sequence but change the
                    percentage risk. The R results stay the same while
                    the money impact changes.
                </p>


                <div class="pip-lab-build013-whatif-grid">


                    <div class="pip-lab-build013-whatif-control">

                        <label for="build013WhatIfRisk">
                            Risk Per Trade
                        </label>

                        <input
                            id="build013WhatIfRisk"
                            type="range"
                            min="0.5"
                            max="10"
                            value="1"
                            step="0.5"
                        >

                        <strong id="build013WhatIfRiskLabel">
                            1%
                        </strong>

                    </div>


                    <div class="pip-lab-build013-whatif-result">

                        <div>

                            <span>
                                STARTING ACCOUNT
                            </span>

                            <strong id="build013WhatIfStart">
                                $1,000.00
                            </strong>

                        </div>

                        <div>

                            <span>
                                FINAL ACCOUNT
                            </span>

                            <strong id="build013WhatIfFinal">
                                $1,000.00
                            </strong>

                        </div>

                        <div>

                            <span>
                                TOTAL P/L
                            </span>

                            <strong id="build013WhatIfPL">
                                $0.00
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            <!-- LEARNING CONNECTION -->

            <div class="pip-lab-build013-learning">

                <div class="pip-lab-build013-section-title">

                    <span>
                        THE BIG LESSON
                    </span>

                    <strong>
                        What should you understand?
                    </strong>

                </div>


                <div class="pip-lab-build013-learning-grid">


                    <div class="pip-lab-build013-learning-card">

                        <div>
                            <i class="fa-solid fa-percent"></i>
                        </div>

                        <strong>
                            Risk %
                        </strong>

                        <p>
                            Your chosen risk percentage determines how
                            large 1R is relative to your account.
                        </p>

                    </div>


                    <div class="pip-lab-build013-learning-card">

                        <div>
                            <i class="fa-solid fa-list-ol"></i>
                        </div>

                        <strong>
                            Trade Sequence
                        </strong>

                        <p>
                            One result matters, but a series of results
                            shows the bigger effect on your account.
                        </p>

                    </div>


                    <div class="pip-lab-build013-learning-card">

                        <div>
                            <i class="fa-solid fa-chart-line"></i>
                        </div>

                        <strong>
                            Drawdown
                        </strong>

                        <p>
                            A losing period can reduce your account before
                            a recovery happens.
                        </p>

                    </div>


                    <div class="pip-lab-build013-learning-card">

                        <div>
                            <i class="fa-solid fa-scale-balanced"></i>
                        </div>

                        <strong>
                            Consistency
                        </strong>

                        <p>
                            The same R performance can create very
                            different money results when risk changes.
                        </p>

                    </div>

                </div>

            </div>


            <!-- TAKEAWAY -->

            <div class="pip-lab-build013-takeaway">

                <div class="pip-lab-build013-takeaway-icon">
                    <i class="fa-solid fa-brain"></i>
                </div>

                <div>

                    <span>
                        REMEMBER
                    </span>

                    <strong>
                        Risk management is about surviving the whole
                        sequence, not just one trade.
                    </strong>

                    <p>
                        A strategy can have winning trades and still
                        experience losing streaks. Your risk per trade
                        determines how strongly those streaks affect
                        your account.
                    </p>

                </div>

            </div>


            <!-- WARNING -->

            <div class="pip-lab-build013-warning">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <div>

                    <strong>
                        Educational simulator
                    </strong>

                    <p>
                        This simulator demonstrates mathematical
                        relationships. It does not predict trading
                        performance or guarantee that a particular
                        risk percentage is appropriate for a real trader.
                    </p>

                </div>

            </div>

        </div>
    `;

    build012.insertAdjacentElement(
        "afterend",
        section
    );
}


/* =========================================================
   BUILD 013 LOGIC
========================================================= */

function setupBuild013() {

    const accountInput =
        document.getElementById(
            "build013Account"
        );

    const riskInput =
        document.getElementById(
            "build013RiskPercent"
        );

    const defaultRInput =
        document.getElementById(
            "build013StartingR"
        );


    if (
        !accountInput ||
        !riskInput ||
        !defaultRInput
    ) {
        return;
    }


    /* =====================================================
       OUTPUTS
    ===================================================== */

    const startingBalanceOutput =
        document.getElementById(
            "build013StartingBalance"
        );

    const oneROutput =
        document.getElementById(
            "build013OneR"
        );

    const riskDisplay =
        document.getElementById(
            "build013RiskDisplay"
        );

    const currentBalanceOutput =
        document.getElementById(
            "build013CurrentBalance"
        );

    const tradeCountOutput =
        document.getElementById(
            "build013TradeCount"
        );

    const winsOutput =
        document.getElementById(
            "build013Wins"
        );

    const lossesOutput =
        document.getElementById(
            "build013Losses"
        );

    const winRateOutput =
        document.getElementById(
            "build013WinRate"
        );

    const totalROutput =
        document.getElementById(
            "build013TotalR"
        );

    const totalPLOutput =
        document.getElementById(
            "build013TotalPL"
        );

    const drawdownOutput =
        document.getElementById(
            "build013Drawdown"
        );

    const liveBalanceOutput =
        document.getElementById(
            "build013LiveBalance"
        );

    const chart =
        document.getElementById(
            "build013Chart"
        );

    const curveStatus =
        document.getElementById(
            "build013CurveStatus"
        );

    const history =
        document.getElementById(
            "build013History"
        );

    const historyCount =
        document.getElementById(
            "build013HistoryCount"
        );

    const whatIfRisk =
        document.getElementById(
            "build013WhatIfRisk"
        );

    const whatIfRiskLabel =
        document.getElementById(
            "build013WhatIfRiskLabel"
        );

    const whatIfStart =
        document.getElementById(
            "build013WhatIfStart"
        );

    const whatIfFinal =
        document.getElementById(
            "build013WhatIfFinal"
        );

    const whatIfPL =
        document.getElementById(
            "build013WhatIfPL"
        );


    /* =====================================================
       STATE
    ===================================================== */

    let trades = [];


    /* =====================================================
       HELPERS
    ===================================================== */

    function numberValue(
        input,
        fallback = 0
    ) {

        const value =
            Number(
                input.value
            );

        return Number.isFinite(
            value
        )
            ? value
            : fallback;

    }


    function getAccount() {

        return Math.max(
            numberValue(
                accountInput,
                1000
            ),
            0
        );

    }


    function getRiskPercent() {

        return Math.max(
            numberValue(
                riskInput,
                1
            ),
            0
        );

    }


    function getOneR(
        balance = getAccount(),
        riskPercent = getRiskPercent()
    ) {

        return (
            balance *
            riskPercent /
            100
        );

    }


    function money(
        value
    ) {

        if (
            value > 0
        ) {

            return (
                "+$" +
                value.toFixed(2)
            );

        }

        if (
            value < 0
        ) {

            return (
                "-$" +
                Math.abs(
                    value
                ).toFixed(2)
            );

        }

        return "$0.00";

    }


    function plainMoney(
        value
    ) {

        return (
            "$" +
            Math.abs(
                value
            ).toFixed(2)
        );

    }


    function formatR(
        value
    ) {

        return (
            value > 0
                ? "+"
                : ""
        ) +
        value.toFixed(
            2
        ) +
        "R";

    }


    /* =====================================================
       CALCULATE ACCOUNT
    ===================================================== */

    function calculateAccount(
        riskPercent = getRiskPercent()
    ) {

        const startingBalance =
            getAccount();


        let balance =
            startingBalance;


        let peak =
            startingBalance;


        let maxDrawdownMoney =
            0;


        let totalR =
            0;


        let wins =
            0;


        let losses =
            0;


        const rows = [];


        trades.forEach(
            function(
                trade,
                index
            ) {

                /*
                 * Fixed percentage risk is calculated from the
                 * balance before each trade.
                 *
                 * This teaches the student that if they use
                 * percentage risk, 1R can change as the account
                 * changes.
                 */

                const oneR =
                    getOneR(
                        balance,
                        riskPercent
                    );


                const pnl =
                    oneR *
                    trade.r;


                balance +=
                    pnl;


                totalR +=
                    trade.r;


                if (
                    trade.r > 0
                ) {

                    wins++;

                }
                else if (
                    trade.r < 0
                ) {

                    losses++;

                }


                if (
                    balance >
                    peak
                ) {

                    peak =
                        balance;

                }


                const currentDrawdownMoney =
                    Math.max(
                        peak -
                        balance,
                        0
                    );


                maxDrawdownMoney =
                    Math.max(
                        maxDrawdownMoney,
                        currentDrawdownMoney
                    );


                const drawdownPercent =
                    peak > 0
                        ? (
                            currentDrawdownMoney /
                            peak
                        ) *
                        100
                        : 0;


                rows.push({

                    number:
                        index + 1,

                    r:
                        trade.r,

                    oneR,
                    pnl,
                    balance,
                    drawdownPercent

                });

            }
        );


        const tradeCount =
            trades.length;


        const winRate =
            tradeCount > 0
                ? (
                    wins /
                    tradeCount
                ) *
                100
                : 0;


        const maxDrawdownPercent =
            startingBalance > 0
                ? (
                    maxDrawdownMoney /
                    startingBalance
                ) *
                100
                : 0;


        return {

            startingBalance,
            balance,
            totalR,
            wins,
            losses,
            tradeCount,
            winRate,
            maxDrawdownMoney,
            maxDrawdownPercent,
            rows

        };

    }


    /* =====================================================
       UPDATE ACCOUNT SUMMARY
    ===================================================== */

    function updateAccountSummary() {

        const startingBalance =
            getAccount();


        const riskPercent =
            getRiskPercent();


        const oneR =
            getOneR(
                startingBalance,
                riskPercent
            );


        const result =
            calculateAccount();


        startingBalanceOutput.textContent =
            plainMoney(
                startingBalance
            );


        oneROutput.textContent =
            plainMoney(
                oneR
            );


        riskDisplay.textContent =
            riskPercent.toFixed(
                2
            ) +
            "%";


        currentBalanceOutput.textContent =
            plainMoney(
                result.balance
            );


        liveBalanceOutput.textContent =
            plainMoney(
                result.balance
            );


        tradeCountOutput.textContent =
            result.tradeCount;


        winsOutput.textContent =
            result.wins;


        lossesOutput.textContent =
            result.losses;


        winRateOutput.textContent =
            result.winRate.toFixed(
                1
            ) +
            "%";


        totalROutput.textContent =
            formatR(
                result.totalR
            );


        totalPLOutput.textContent =
            money(
                result.balance -
                result.startingBalance
            );


        drawdownOutput.textContent =
            result.maxDrawdownPercent.toFixed(
                2
            ) +
            "%";


        updateValueClasses(
            totalPLOutput,
            result.balance -
            result.startingBalance
        );


        updateValueClasses(
            totalROutput,
            result.totalR
        );


        updateValueClasses(
            liveBalanceOutput,
            result.balance -
            result.startingBalance
        );


        updateChart(
            result
        );


        updateHistory(
            result
        );


        updateWhatIf();

    }


    /* =====================================================
       VALUE COLOR
    ===================================================== */

    function updateValueClasses(
        element,
        value
    ) {

        element.classList.remove(
            "profit",
            "loss",
            "neutral"
        );


        if (
            value > 0
        ) {

            element.classList.add(
                "profit"
            );

        }
        else if (
            value < 0
        ) {

            element.classList.add(
                "loss"
            );

        }
        else {

            element.classList.add(
                "neutral"
            );

        }

    }


    /* =====================================================
       ADD TRADE
    ===================================================== */

    function addTrade(
        r
    ) {

        const value =
            Number(
                r
            );


        if (
            !Number.isFinite(
                value
            )
        ) {

            return;

        }


        trades.push({

            r:
                value

        });


        updateAccountSummary();

    }


    /* =====================================================
       UNDO
    ===================================================== */

    const undoButton =
        document.getElementById(
            "build013Undo"
        );


    undoButton.addEventListener(
        "click",
        function() {

            if (
                trades.length === 0
            ) {

                return;

            }


            trades.pop();

            updateAccountSummary();

        }
    );


    /* =====================================================
       CLEAR
    ===================================================== */

    const clearButton =
        document.getElementById(
            "build013Clear"
        );


    clearButton.addEventListener(
        "click",
        function() {

            trades = [];

            updateAccountSummary();

        }
    );


    /* =====================================================
       TRADE BUTTONS
    ===================================================== */

    const tradeButtons =
        document.querySelectorAll(
            ".pip-lab-build013-trade-button[data-trade-r]"
        );


    tradeButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    addTrade(
                        Number(
                            button.dataset.tradeR
                        )
                    );

                }
            );

        }
    );


    /* =====================================================
       QUICK SCENARIOS
    ===================================================== */

    const scenarioButtons =
        document.querySelectorAll(
            ".pip-lab-build013-scenarios button[data-scenario]"
        );


    const scenarios = {

        balanced: [
            1,
            -1,
            2,
            -1,
            1
        ],

        winning: [
            1,
            1,
            2,
            1,
            2
        ],

        losing: [
            -1,
            -1,
            -1,
            -1,
            -1
        ],

        mixed: [
            2,
            -1,
            1,
            -0.5,
            3,
            -1,
            1
        ]

    };


    scenarioButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const scenario =
                        button.dataset.scenario;


                    if (
                        !scenarios[
                            scenario
                        ]
                    ) {

                        return;

                    }


                    trades =
                        scenarios[
                            scenario
                        ].map(
                            function(r) {

                                return {
                                    r
                                };

                            }
                        );


                    updateAccountSummary();

                }
            );

        }
    );


    /* =====================================================
       TRADE HISTORY
    ===================================================== */

    function updateHistory(
        result
    ) {

        historyCount.textContent =
            result.tradeCount +
            (
                result.tradeCount === 1
                    ? " trade"
                    : " trades"
            );


        if (
            result.rows.length === 0
        ) {

            history.innerHTML = `

                <div class="pip-lab-build013-empty-history">

                    <i class="fa-solid fa-list"></i>

                    <span>
                        Your trades will appear here.
                    </span>

                </div>

            `;

            return;

        }


        history.innerHTML =
            result.rows.map(
                function(row) {

                    let outcomeClass =
                        "neutral";


                    if (
                        row.r > 0
                    ) {

                        outcomeClass =
                            "profit";

                    }
                    else if (
                        row.r < 0
                    ) {

                        outcomeClass =
                            "loss";

                    }


                    return `

                        <div
                            class="pip-lab-build013-history-row ${outcomeClass}"
                        >

                            <div class="pip-lab-build013-history-number">
                                ${row.number}
                            </div>


                            <div class="pip-lab-build013-history-result">

                                <span>
                                    TRADE ${row.number}
                                </span>

                                <strong>
                                    ${formatR(row.r)}
                                </strong>

                            </div>


                            <div class="pip-lab-build013-history-money">

                                <span>
                                    P/L
                                </span>

                                <strong>
                                    ${money(row.pnl)}
                                </strong>

                            </div>


                            <div class="pip-lab-build013-history-balance">

                                <span>
                                    BALANCE
                                </span>

                                <strong>
                                    ${plainMoney(row.balance)}
                                </strong>

                            </div>

                        </div>

                    `;

                }
            ).join("");

    }


    /* =====================================================
       ACCOUNT CURVE
    ===================================================== */

    function updateChart(
        result
    ) {

        if (
            result.rows.length === 0
        ) {

            curveStatus.textContent =
                "NO TRADES";

            curveStatus.className =
                "pip-lab-build013-curve-status";


            chart.innerHTML = `

                <div class="pip-lab-build013-chart-empty">

                    <i class="fa-solid fa-chart-area"></i>

                    <span>
                        Add trades to create your account curve.
                    </span>

                </div>

            `;

            return;

        }


        curveStatus.textContent =
            result.balance >=
            result.startingBalance
                ? "ACCOUNT UP"
                : "ACCOUNT DOWN";


        curveStatus.className =
            "pip-lab-build013-curve-status " +
            (
                result.balance >=
                result.startingBalance
                    ? "profit"
                    : "loss"
            );


        const balances =
            [
                result.startingBalance
            ].concat(
                result.rows.map(
                    function(row) {

                        return row.balance;

                    }
                )
            );


        let min =
            Math.min(
                ...balances
            );


        let max =
            Math.max(
                ...balances
            );


        const difference =
            max -
            min;


        const padding =
            difference > 0
                ? difference * 0.15
                : Math.max(
                    max * 0.05,
                    10
                );


        min -= padding;
        max += padding;


        const width =
            100;


        const height =
            100;


        const points =
            balances.map(
                function(balance, index) {

                    const x =
                        balances.length === 1
                            ? 0
                            : (
                                index /
                                (
                                    balances.length -
                                    1
                                )
                            ) *
                            width;


                    const y =
                        max === min
                            ? 50
                            : height -
                                (
                                    (
                                        balance -
                                        min
                                    ) /
                                    (
                                        max -
                                        min
                                    )
                                ) *
                                height;


                    return {

                        x,
                        y,
                        balance

                    };

                }
            );


        const pointString =
            points.map(
                function(point) {

                    return (
                        point.x.toFixed(2) +
                        "," +
                        point.y.toFixed(2)
                    );

                }
            ).join(" ");


        chart.innerHTML = `

            <div class="pip-lab-build013-chart-grid"></div>

            <div class="pip-lab-build013-chart-axis top">
                ${plainMoney(max)}
            </div>

            <div class="pip-lab-build013-chart-axis bottom">
                ${plainMoney(min)}
            </div>

            <svg
                class="pip-lab-build013-chart-svg"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >

                <polyline
                    points="${pointString}"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.4"
                    vector-effect="non-scaling-stroke"
                ></polyline>

            </svg>


            <div class="pip-lab-build013-chart-points">

                ${points.map(
                    function(point, index) {

                        return `

                            <span
                                class="pip-lab-build013-chart-point"
                                style="
                                    left:${point.x}%;
                                    top:${point.y}%;
                                "
                                title="
                                    ${
                                        index === 0
                                            ? "Starting balance"
                                            : "Trade " +
                                              index
                                    }
                                    :
                                    ${plainMoney(point.balance)}
                                "
                            ></span>

                        `;

                    }
                ).join("")}

            </div>


            <div class="pip-lab-build013-chart-start">
                START
            </div>

            <div class="pip-lab-build013-chart-end">
                CURRENT
            </div>

        `;

    }


    /* =====================================================
       WHAT IF SIMULATOR
    ===================================================== */

    function updateWhatIf() {

        const startingBalance =
            getAccount();


        const selectedRisk =
            Math.max(
                Number(
                    whatIfRisk.value
                ),
                0
            );


        whatIfRiskLabel.textContent =
            selectedRisk.toFixed(
                1
            ) +
            "%";


        let balance =
            startingBalance;


        trades.forEach(
            function(trade) {

                const oneR =
                    balance *
                    selectedRisk /
                    100;


                balance +=
                    oneR *
                    trade.r;

            }
        );


        const totalPL =
            balance -
            startingBalance;


        whatIfStart.textContent =
            plainMoney(
                startingBalance
            );


        whatIfFinal.textContent =
            plainMoney(
                balance
            );


        whatIfPL.textContent =
            money(
                totalPL
            );


        updateValueClasses(
            whatIfFinal,
            totalPL
        );


        updateValueClasses(
            whatIfPL,
            totalPL
        );

    }


    whatIfRisk.addEventListener(
        "input",
        updateWhatIf
    );


    /* =====================================================
       ACCOUNT INPUT EVENTS
    ===================================================== */

    [
        accountInput,
        riskInput,
        defaultRInput
    ].forEach(
        function(input) {

            input.addEventListener(
                "input",
                function() {

                    /*
                     * defaultR is kept as a learning input.
                     * It is also used when the student presses
                     * the "default" concept button in future builds.
                     */

                    updateAccountSummary();

                }
            );

        }
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    updateAccountSummary();

}


/* =========================================================
   BUILD 013 AUTO INITIALIZATION
========================================================= */

function waitForBuild013() {

    if (
        document.getElementById(
            "build012RiskLab"
        )
    ) {

        initBuild013();

        return;

    }


    setTimeout(
        waitForBuild013,
        100
    );

}


if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        waitForBuild013
    );

}
else {

    waitForBuild013();

}

/* =========================================================
   BUILD 014
   PIP & POSITION LAB — PRACTICE & ASSESSMENT
========================================================= */

function initBuild014() {

    if (document.getElementById("build014Assessment")) {
        return;
    }

    const build013 =
        document.getElementById("build013RiskImpact");

    if (!build013) {
        return;
    }

    createBuild014Markup(build013);
    setupBuild014();
}


/* =========================================================
   BUILD 014 MARKUP
========================================================= */

function createBuild014Markup(build013) {

    const section = document.createElement("section");

    section.id = "build014Assessment";
    section.className = "pip-lab-build014";

    section.innerHTML = `

        <!-- HEADER -->

        <div class="pip-lab-build014-header">

            <span class="pip-lab-build014-badge">
                <i class="fa-solid fa-graduation-cap"></i>
                Build 014
            </span>

            <h2>
                Practice & Assessment
            </h2>

            <p>
                You learned pips, lots, quantity, position size,
                Stop Loss, risk, R and account impact. Now prove
                that you understand them.
            </p>

        </div>


        <!-- MAIN PANEL -->

        <div class="pip-lab-build014-panel">


            <!-- START SCREEN -->

            <div
                id="build014Start"
                class="pip-lab-build014-start"
            >

                <div class="pip-lab-build014-start-icon">
                    <i class="fa-solid fa-brain"></i>
                </div>

                <span>
                    FINAL PRACTICE
                </span>

                <h3>
                    Can you solve the trade?
                </h3>

                <p>
                    This assessment contains different types of
                    questions. Some ask you to choose an answer,
                    while others ask you to calculate the result.
                </p>


                <div class="pip-lab-build014-rules">

                    <div>
                        <i class="fa-solid fa-list-check"></i>
                        <strong>
                            12 Questions
                        </strong>
                        <span>
                            Multiple topics
                        </span>
                    </div>

                    <div>
                        <i class="fa-solid fa-rotate"></i>
                        <strong>
                            Retry Mistakes
                        </strong>
                        <span>
                            Learn from errors
                        </span>
                    </div>

                    <div>
                        <i class="fa-solid fa-chart-simple"></i>
                        <strong>
                            Final Score
                        </strong>
                        <span>
                            See your understanding
                        </span>
                    </div>

                </div>


                <button
                    type="button"
                    id="build014StartButton"
                    class="pip-lab-build014-primary-button"
                >
                    <span>
                        Start Assessment
                    </span>

                    <i class="fa-solid fa-arrow-right"></i>
                </button>

            </div>


            <!-- QUIZ AREA -->

            <div
                id="build014Quiz"
                class="pip-lab-build014-quiz"
                hidden
            >

                <!-- PROGRESS -->

                <div class="pip-lab-build014-progress">

                    <div>

                        <span>
                            QUESTION
                        </span>

                        <strong id="build014QuestionNumber">
                            1 / 12
                        </strong>

                    </div>

                    <div class="pip-lab-build014-progress-track">

                        <div
                            id="build014ProgressBar"
                            class="pip-lab-build014-progress-fill"
                        ></div>

                    </div>

                </div>


                <!-- QUESTION -->

                <div class="pip-lab-build014-question-card">

                    <span
                        id="build014QuestionType"
                        class="pip-lab-build014-question-type"
                    >
                        CONCEPT
                    </span>

                    <h3 id="build014Question">
                        Question
                    </h3>

                    <p id="build014QuestionHint">
                        Choose the best answer.
                    </p>


                    <!-- OPTIONS -->

                    <div
                        id="build014Options"
                        class="pip-lab-build014-options"
                    ></div>


                    <!-- CALCULATION INPUT -->

                    <div
                        id="build014Calculation"
                        class="pip-lab-build014-calculation"
                        hidden
                    >

                        <label
                            id="build014CalculationLabel"
                            for="build014AnswerInput"
                        >
                            Your Answer
                        </label>

                        <div class="pip-lab-build014-answer-input">

                            <input
                                id="build014AnswerInput"
                                type="number"
                                step="any"
                                placeholder="Enter your answer"
                            >

                            <span
                                id="build014AnswerUnit"
                            >
                                $
                            </span>

                        </div>

                    </div>


                    <!-- FEEDBACK -->

                    <div
                        id="build014Feedback"
                        class="pip-lab-build014-feedback"
                        hidden
                    >

                        <div
                            id="build014FeedbackIcon"
                            class="pip-lab-build014-feedback-icon"
                        >
                            <i class="fa-solid fa-check"></i>
                        </div>

                        <div>

                            <strong id="build014FeedbackTitle">
                                Correct
                            </strong>

                            <p id="build014FeedbackText">
                                Explanation.
                            </p>

                        </div>

                    </div>


                    <!-- ACTION -->

                    <div class="pip-lab-build014-actions">

                        <button
                            type="button"
                            id="build014CheckButton"
                            class="pip-lab-build014-primary-button"
                        >
                            Check Answer
                        </button>

                        <button
                            type="button"
                            id="build014NextButton"
                            class="pip-lab-build014-secondary-button"
                            hidden
                        >
                            Next Question
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>

                    </div>

                </div>

            </div>


            <!-- RESULT -->

            <div
                id="build014Result"
                class="pip-lab-build014-result"
                hidden
            >

                <div class="pip-lab-build014-result-icon">
                    <i class="fa-solid fa-trophy"></i>
                </div>

                <span>
                    ASSESSMENT COMPLETE
                </span>

                <h3>
                    Your Learning Result
                </h3>


                <div class="pip-lab-build014-score">

                    <strong id="build014Score">
                        0%
                    </strong>

                    <span>
                        SCORE
                    </span>

                </div>


                <div class="pip-lab-build014-result-stats">

                    <div>
                        <span>
                            CORRECT
                        </span>

                        <strong id="build014Correct">
                            0
                        </strong>
                    </div>

                    <div>
                        <span>
                            INCORRECT
                        </span>

                        <strong id="build014Incorrect">
                            0
                        </strong>
                    </div>

                    <div>
                        <span>
                            QUESTIONS
                        </span>

                        <strong id="build014Total">
                            12
                        </strong>
                    </div>

                </div>


                <!-- PERFORMANCE MESSAGE -->

                <div
                    id="build014Performance"
                    class="pip-lab-build014-performance"
                >

                    <strong>
                        Keep learning.
                    </strong>

                    <p>
                        Review the concepts and try again.
                    </p>

                </div>


                <!-- WEAK AREAS -->

                <div class="pip-lab-build014-weak-area">

                    <div class="pip-lab-build014-section-title">

                        <span>
                            REVIEW AREAS
                        </span>

                        <strong>
                            Topics to revisit
                        </strong>

                    </div>


                    <div
                        id="build014WeakAreas"
                        class="pip-lab-build014-weak-list"
                    ></div>

                </div>


                <!-- RESULT ACTIONS -->

                <div class="pip-lab-build014-result-actions">

                    <button
                        type="button"
                        id="build014RetryButton"
                        class="pip-lab-build014-primary-button"
                    >
                        <i class="fa-solid fa-rotate-right"></i>
                        Try Again
                    </button>

                </div>

            </div>


            <!-- FINAL LEARNING NOTE -->

            <div class="pip-lab-build014-note">

                <i class="fa-solid fa-circle-info"></i>

                <div>

                    <strong>
                        The goal is understanding, not just a score.
                    </strong>

                    <p>
                        If you get an answer wrong, read the explanation
                        carefully. The assessment is designed to help you
                        understand why the answer is correct.
                    </p>

                </div>

            </div>


            <!-- WARNING -->

            <div class="pip-lab-build014-warning">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <div>

                    <strong>
                        Educational assessment
                    </strong>

                    <p>
                        The examples are simplified educational
                        calculations. Real trading can involve spread,
                        commissions, slippage, contract specifications
                        and other costs.
                    </p>

                </div>

            </div>

        </div>
    `;

    build013.insertAdjacentElement(
        "afterend",
        section
    );
}


/* =========================================================
   BUILD 014 LOGIC
========================================================= */

function setupBuild014() {

    const startScreen =
        document.getElementById(
            "build014Start"
        );

    const quiz =
        document.getElementById(
            "build014Quiz"
        );

    const resultScreen =
        document.getElementById(
            "build014Result"
        );

    const startButton =
        document.getElementById(
            "build014StartButton"
        );

    const checkButton =
        document.getElementById(
            "build014CheckButton"
        );

    const nextButton =
        document.getElementById(
            "build014NextButton"
        );

    const retryButton =
        document.getElementById(
            "build014RetryButton"
        );

    const questionNumber =
        document.getElementById(
            "build014QuestionNumber"
        );

    const progressBar =
        document.getElementById(
            "build014ProgressBar"
        );

    const questionType =
        document.getElementById(
            "build014QuestionType"
        );

    const questionText =
        document.getElementById(
            "build014Question"
        );

    const questionHint =
        document.getElementById(
            "build014QuestionHint"
        );

    const optionsContainer =
        document.getElementById(
            "build014Options"
        );

    const calculation =
        document.getElementById(
            "build014Calculation"
        );

    const calculationLabel =
        document.getElementById(
            "build014CalculationLabel"
        );

    const answerInput =
        document.getElementById(
            "build014AnswerInput"
        );

    const answerUnit =
        document.getElementById(
            "build014AnswerUnit"
        );

    const feedback =
        document.getElementById(
            "build014Feedback"
        );

    const feedbackIcon =
        document.getElementById(
            "build014FeedbackIcon"
        );

    const feedbackTitle =
        document.getElementById(
            "build014FeedbackTitle"
        );

    const feedbackText =
        document.getElementById(
            "build014FeedbackText"
        );


    const scoreOutput =
        document.getElementById(
            "build014Score"
        );

    const correctOutput =
        document.getElementById(
            "build014Correct"
        );

    const incorrectOutput =
        document.getElementById(
            "build014Incorrect"
        );

    const totalOutput =
        document.getElementById(
            "build014Total"
        );

    const performance =
        document.getElementById(
            "build014Performance"
        );

    const weakAreas =
        document.getElementById(
            "build014WeakAreas"
        );


    if (
        !startScreen ||
        !quiz ||
        !resultScreen
    ) {
        return;
    }


    /* =====================================================
       QUESTION BANK
    ===================================================== */

    const questions = [

        {
            id: 1,

            topic: "Pips",

            type: "concept",

            question:
                "What is a pip mainly used to describe in forex trading?",

            hint:
                "Think about how traders measure small price movements.",

            options: [
                "A unit used to describe price movement",
                "The amount of money in your account",
                "The number of trades you can take",
                "The percentage of your account risked"
            ],

            answer: 0,

            explanation:
                "A pip is a standard unit used to describe a small movement in a currency pair's price. The money value of that movement depends on the trade size and instrument."
        },


        {
            id: 2,

            topic: "Lots",

            type: "concept",

            question:
                "What does a lot mainly describe?",

            hint:
                "Think about the size of the forex trade.",

            options: [
                "The trading session",
                "The size of the position",
                "The Stop Loss distance",
                "The number of pips"

            ],

            answer: 1,

            explanation:
                "A lot is a way of expressing trade size in forex. Different lot sizes represent different quantities of the underlying currency."
        },


        {
            id: 3,

            topic: "Position Size",

            type: "concept",

            question:
                "Why is position size important?",

            hint:
                "Think about what happens when the same price movement occurs on a small and large trade.",

            options: [
                "It determines the trading session",
                "It controls how large the trade exposure is",
                "It guarantees a winning trade",
                "It removes market risk"

            ],

            answer: 1,

            explanation:
                "Position size controls how much exposure the trade has. A larger position generally means the same price movement can produce a larger monetary gain or loss."
        },


        {
            id: 4,

            topic: "Stop Loss",

            type: "calculation",

            question:
                "You enter at 1.1050 and place your Stop Loss at 1.1020. What is the Stop Loss distance?",

            hint:
                "Count the price movement between entry and Stop Loss.",

            label:
                "Stop Loss Distance",

            unit:
                "pips",

            answer: 30,

            tolerance:
                0,

            explanation:
                "The difference is 0.0030. For a standard five-digit EUR/USD-style quote, that equals 30 pips."
        },


        {
            id: 5,

            topic: "Risk",

            type: "calculation",

            question:
                "Your account is $1,000 and you risk 1% on one trade. How much is 1R?",

            hint:
                "1R is your planned risk for the trade.",

            label:
                "Your 1R",

            unit:
                "$",

            answer:
                10,

            tolerance:
                0.01,

            explanation:
                "1% of $1,000 is $10. Therefore, your planned risk is $10 and $10 becomes 1R for this trade."
        },


        {
            id: 6,

            topic: "R",

            type: "concept",

            question:
                "If your planned risk is $20, what does +2R represent?",

            hint:
                "Multiply your 1R amount by the R multiple.",

            options: [
                "$10 profit",
                "$20 profit",
                "$40 profit",
                "$60 profit"
            ],

            answer: 2,

            explanation:
                "If 1R is $20, then +2R means two times the planned risk: 2 × $20 = $40."
        },


        {
            id: 7,

            topic: "R:R",

            type: "concept",

            question:
                "What is the main difference between R and R:R?",

            hint:
                "One describes a result and the other describes a planned relationship.",

            options: [
                "R is the result measured against risk; R:R describes planned risk versus reward",
                "R and R:R always mean exactly the same thing",
                "R is the lot size and R:R is the pip value",
                "R is the account balance and R:R is the spread"

            ],

            answer: 0,

            explanation:
                "R measures the actual trade result relative to the original risk. R:R describes the planned relationship between the amount you risk and the amount you aim to make."
        },


        {
            id: 8,

            topic: "Account Impact",

            type: "calculation",

            question:
                "Your account is $1,000. You risk 2% per trade. The trade finishes at -1R. What is the approximate account balance?",

            hint:
                "First calculate 1R, then subtract it from the account.",

            label:
                "Account Balance",

            unit:
                "$",

            answer:
                980,

            tolerance:
                0.01,

            explanation:
                "2% of $1,000 is $20. A -1R result loses $20, leaving an account balance of approximately $980."
        },


        {
            id: 9,

            topic: "Multiple Trades",

            type: "concept",

            question:
                "If a trader risks 1% per trade and experiences five consecutive -1R losses, what is the simple approximate loss before considering compounding effects?",

            hint:
                "One -1R loss is approximately 1%. What happens five times?",

            options: [
                "Approximately -1%",
                "Approximately -2%",
                "Approximately -5%",
                "Approximately -10%"
            ],

            answer: 2,

            explanation:
                "With a simple fixed-percentage illustration, five -1R losses at 1% risk represent approximately -5%. If risk is recalculated from the changing balance after every trade, the exact result will differ slightly."
        },


        {
            id: 10,

            topic: "Partial Profit",

            type: "calculation",

            question:
                "You close 50% of a position at +2R. How much does that closed portion contribute to the total trade result?",

            hint:
                "Multiply the closed percentage by the R result.",

            label:
                "Contribution",

            unit:
                "R",

            answer:
                1,

            tolerance:
                0.01,

            explanation:
                "50% × +2R = +1R. So the closed half contributes +1R to the total trade result, before considering what happens to the remaining position."
        },


        {
            id: 11,

            topic: "Position Size",

            type: "concept",

            question:
                "Two traders experience the same +2R result. Trader A risks $10 and Trader B risks $100. What is different?",

            hint:
                "The R result is the same, but the original risk amount is different.",

            options: [
                "Trader A made $20 and Trader B made $200",
                "Trader A made $10 and Trader B made $100",
                "Both made exactly the same dollar profit",
                "Trader B automatically had a better strategy"

            ],

            answer: 0,

            explanation:
                "+2R means two times the original risk. Trader A makes 2 × $10 = $20, while Trader B makes 2 × $100 = $200. Their R result is the same even though their money result is different."
        },


        {
            id: 12,

            topic: "Risk Management",

            type: "concept",

            question:
                "Why should a trader understand losing streaks before deciding how much to risk per trade?",

            hint:
                "Think about account survival over a series of trades.",

            options: [
                "Because losing streaks can reduce the account significantly",
                "Because a higher risk percentage guarantees more wins",
                "Because Stop Losses stop working after losses",
                "Because risk percentage determines the market direction"

            ],

            answer: 0,

            explanation:
                "A strategy can experience several losses in a row. If the risk per trade is too large, a losing streak can create a significant drawdown and make recovery much harder."
        }

    ];


    /* =====================================================
       STATE
    ===================================================== */

    let currentQuestion =
        0;

    let selectedOption =
        null;

    let questionAnswered =
        false;

    let correctCount =
        0;

    let incorrectCount =
        0;

    let topicMistakes = {};


    /* =====================================================
       HELPERS
    ===================================================== */

    function resetState() {

        currentQuestion =
            0;

        selectedOption =
            null;

        questionAnswered =
            false;

        correctCount =
            0;

        incorrectCount =
            0;

        topicMistakes = {};

    }


    function showStart() {

        startScreen.hidden =
            false;

        quiz.hidden =
            true;

        resultScreen.hidden =
            true;

    }


    function startAssessment() {

        resetState();

        startScreen.hidden =
            true;

        quiz.hidden =
            false;

        resultScreen.hidden =
            true;

        renderQuestion();

    }


    function renderQuestion() {

        const question =
            questions[
                currentQuestion
            ];


        selectedOption =
            null;

        questionAnswered =
            false;


        feedback.hidden =
            true;

        nextButton.hidden =
            true;

        checkButton.hidden =
            false;

        checkButton.disabled =
            false;


        answerInput.value =
            "";


        questionNumber.textContent =
            (
                currentQuestion +
                1
            ) +
            " / " +
            questions.length;


        const progress =
            (
                (
                    currentQuestion
                ) /
                questions.length
            ) *
            100;


        progressBar.style.width =
            progress +
            "%";


        questionType.textContent =
            question.type ===
            "calculation"
                ? "CALCULATION"
                : "CONCEPT";


        questionText.textContent =
            question.question;


        questionHint.textContent =
            question.hint;


        optionsContainer.innerHTML =
            "";


        optionsContainer.hidden =
            question.type ===
            "calculation";


        calculation.hidden =
            question.type !==
            "calculation";


        if (
            question.type ===
            "calculation"
        ) {

            calculationLabel.textContent =
                question.label;


            answerUnit.textContent =
                question.unit;


            setTimeout(
                function() {

                    answerInput.focus();

                },
                50
            );

        }


        if (
            question.type ===
            "concept"
        ) {

            question.options.forEach(
                function(
                    option,
                    index
                ) {

                    const button =
                        document.createElement(
                            "button"
                        );


                    button.type =
                        "button";


                    button.className =
                        "pip-lab-build014-option";


                    button.dataset.index =
                        index;


                    button.innerHTML = `

                        <span class="pip-lab-build014-option-letter">
                            ${String.fromCharCode(65 + index)}
                        </span>

                        <span class="pip-lab-build014-option-text">
                            ${option}
                        </span>

                    `;


                    button.addEventListener(
                        "click",
                        function() {

                            if (
                                questionAnswered
                            ) {

                                return;

                            }


                            optionsContainer
                                .querySelectorAll(
                                    "button"
                                )
                                .forEach(
                                    function(
                                        item
                                    ) {

                                        item.classList.remove(
                                            "selected"
                                        );

                                    }
                                );


                            button.classList.add(
                                "selected"
                            );


                            selectedOption =
                                index;

                        }
                    );


                    optionsContainer.appendChild(
                        button
                    );

                }
            );

        }

    }


    /* =====================================================
       CHECK ANSWER
    ===================================================== */

    function checkAnswer() {

        if (
            questionAnswered
        ) {

            return;

        }


        const question =
            questions[
                currentQuestion
            ];


        let isCorrect =
            false;


        if (
            question.type ===
            "concept"
        ) {

            if (
                selectedOption ===
                null
            ) {

                showTemporaryHint(
                    "Please select an answer first."
                );

                return;

            }


            isCorrect =
                selectedOption ===
                question.answer;

        }
        else {

            const userValue =
                Number(
                    answerInput.value
                );


            if (
                answerInput.value.trim() ===
                "" ||
                !Number.isFinite(
                    userValue
                )
            ) {

                showTemporaryHint(
                    "Enter your answer first."
                );

                return;

            }


            isCorrect =
                Math.abs(
                    userValue -
                    question.answer
                ) <=
                question.tolerance;

        }


        questionAnswered =
            true;


        if (
            isCorrect
        ) {

            correctCount++;

            showFeedback(
                true,
                question.explanation
            );


            if (
                currentQuestion ===
                questions.length - 1
            ) {

                checkButton.hidden =
                    true;

                nextButton.hidden =
                    false;

                nextButton.textContent =
                    "View Result";

            }
            else {

                checkButton.hidden =
                    true;

                nextButton.hidden =
                    false;

                nextButton.innerHTML =
                    `
                        Next Question
                        <i class="fa-solid fa-arrow-right"></i>
                    `;

            }

        }
        else {

            incorrectCount++;


            if (
                !topicMistakes[
                    question.topic
                ]
            ) {

                topicMistakes[
                    question.topic
                ] = 0;

            }


            topicMistakes[
                question.topic
            ]++;


            showFeedback(
                false,
                question.explanation
            );


            checkButton.hidden =
                true;


            nextButton.hidden =
                false;


            if (
                currentQuestion ===
                questions.length - 1
            ) {

                nextButton.textContent =
                    "View Result";

            }
            else {

                nextButton.innerHTML =
                    `
                        Continue
                        <i class="fa-solid fa-arrow-right"></i>
                    `;

            }

        }

    }


    /* =====================================================
       FEEDBACK
    ===================================================== */

    function showFeedback(
        correct,
        explanation
    ) {

        feedback.hidden =
            false;


        feedback.classList.remove(
            "correct",
            "incorrect"
        );


        feedback.classList.add(
            correct
                ? "correct"
                : "incorrect"
        );


        if (
            correct
        ) {

            feedbackIcon.innerHTML =
                `<i class="fa-solid fa-check"></i>`;


            feedbackTitle.textContent =
                "Correct!";


            feedbackText.textContent =
                explanation;

        }
        else {

            feedbackIcon.innerHTML =
                `<i class="fa-solid fa-xmark"></i>`;


            feedbackTitle.textContent =
                "Not quite.";


            feedbackText.textContent =
                "Review this explanation: " +
                explanation;

        }

    }


    /* =====================================================
       TEMPORARY HINT
    ===================================================== */

    function showTemporaryHint(
        message
    ) {

        feedback.hidden =
            false;


        feedback.classList.remove(
            "correct",
            "incorrect"
        );


        feedback.classList.add(
            "hint"
        );


        feedbackIcon.innerHTML =
            `<i class="fa-solid fa-circle-info"></i>`;


        feedbackTitle.textContent =
            "One more step";


        feedbackText.textContent =
            message;


        setTimeout(
            function() {

                feedback.hidden =
                    true;

            },
            1800
        );

    }


    /* =====================================================
       NEXT QUESTION
    ===================================================== */

    function nextQuestion() {

        if (
            currentQuestion >=
            questions.length - 1
        ) {

            showResults();

            return;

        }


        currentQuestion++;

        renderQuestion();

    }


    /* =====================================================
       RESULTS
    ===================================================== */

    function showResults() {

        quiz.hidden =
            true;

        resultScreen.hidden =
            false;


        const total =
            questions.length;


        const score =
            Math.round(
                (
                    correctCount /
                    total
                ) *
                100
            );


        scoreOutput.textContent =
            score +
            "%";


        correctOutput.textContent =
            correctCount;


        incorrectOutput.textContent =
            incorrectCount;


        totalOutput.textContent =
            total;


        updatePerformance(
            score
        );


        updateWeakAreas();

        /* =====================================================
   BUILD 015 CONNECTION
===================================================== */

if (
    typeof window.strativoSaveBuild014Result ===
    "function"
) {

    window.strativoSaveBuild014Result(
        score,
        correctCount,
        incorrectCount
    );

}
else {

    window.dispatchEvent(
        new CustomEvent(
            "strativoBuild014Complete",
            {
                detail: {
                    score:
                        score,

                    correct:
                        correctCount,

                    incorrect:
                        incorrectCount
                }
            }
        )
    );

}

    }


    /* =====================================================
       PERFORMANCE
    ===================================================== */

    function updatePerformance(
        score
    ) {

        if (
            score >=
            90
        ) {

            performance.innerHTML = `

                <strong>
                    Excellent understanding! 🎯
                </strong>

                <p>
                    You have demonstrated a strong understanding
                    of the Pip & Position Lab concepts.
                </p>

            `;

            performance.className =
                "pip-lab-build014-performance excellent";

        }
        else if (
            score >=
            75
        ) {

            performance.innerHTML = `

                <strong>
                    Good work! 👍
                </strong>

                <p>
                    You understand most of the concepts. Review
                    the areas you missed before moving forward.
                </p>

            `;

            performance.className =
                "pip-lab-build014-performance good";

        }
        else if (
            score >=
            60
        ) {

            performance.innerHTML = `

                <strong>
                    You're getting there.
                </strong>

                <p>
                    Some important concepts still need practice.
                    Review the highlighted areas and try again.
                </p>

            `;

            performance.className =
                "pip-lab-build014-performance average";

        }
        else {

            performance.innerHTML = `

                <strong>
                    Let's strengthen the basics.
                </strong>

                <p>
                    Don't worry. The assessment is designed for
                    learning. Review the explanations and try again.
                </p>

            `;

            performance.className =
                "pip-lab-build014-performance needs-review";

        }

    }


    /* =====================================================
       WEAK AREAS
    ===================================================== */

    function updateWeakAreas() {

        const entries =
            Object.entries(
                topicMistakes
            );


        if (
            entries.length === 0
        ) {

            weakAreas.innerHTML = `

                <div class="pip-lab-build014-no-mistakes">

                    <i class="fa-solid fa-circle-check"></i>

                    <span>
                        No weak areas detected. Great job!
                    </span>

                </div>

            `;

            return;

        }


        entries.sort(
            function(
                a,
                b
            ) {

                return b[1] -
                    a[1];

            }
        );


        weakAreas.innerHTML =
            entries.map(
                function(
                    entry
                ) {

                    const topic =
                        entry[0];

                    const count =
                        entry[1];


                    return `

                        <div
                            class="pip-lab-build014-weak-item"
                        >

                            <div>

                                <i class="fa-solid fa-book-open"></i>

                                <strong>
                                    ${topic}
                                </strong>

                            </div>

                            <span>
                                ${count}
                                ${
                                    count === 1
                                        ? " mistake"
                                        : " mistakes"
                                }
                            </span>

                        </div>

                    `;

                }
            ).join("");

    }


    /* =====================================================
       EVENTS
    ===================================================== */

    startButton.addEventListener(
        "click",
        startAssessment
    );


    checkButton.addEventListener(
        "click",
        checkAnswer
    );


    nextButton.addEventListener(
        "click",
        nextQuestion
    );


    retryButton.addEventListener(
        "click",
        function() {

            showStart();

        }
    );


    answerInput.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key ===
                "Enter"
            ) {

                checkAnswer();

            }

        }
    );


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    showStart();

}


/* =========================================================
   BUILD 014 AUTO INITIALIZATION
========================================================= */

function waitForBuild014() {

    if (
        document.getElementById(
            "build013RiskImpact"
        )
    ) {

        initBuild014();

        return;

    }


    setTimeout(
        waitForBuild014,
        100
    );

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        waitForBuild014
    );

}
else {

    waitForBuild014();

}

