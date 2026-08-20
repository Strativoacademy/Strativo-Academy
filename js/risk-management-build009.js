/* =========================================================
   STRATIVO ACADEMY
   RISK MANAGEMENT LAB
   BUILD 009
   RISK OF RUIN & MAXIMUM DRAWDOWN CONTROL
========================================================= */

(function () {

    "use strict";


    /* =========================================================
       WAIT FOR HTML
    ========================================================= */

    document.addEventListener("DOMContentLoaded", function () {


        /* =====================================================
           HELPER
        ===================================================== */

        function get(id) {
            return document.getElementById(id);
        }


        /* =====================================================
           01 — CONSECUTIVE LOSS CALCULATOR

           Remaining Balance =
           Starting Balance × (1 - Risk %) ^ Losses

           Drawdown =
           (Starting Balance - Remaining Balance)
           ÷ Starting Balance × 100
        ===================================================== */

        const balanceInput =
            get("rm9Balance");

        const riskPercentInput =
            get("rm9RiskPercent");

        const lossesInput =
            get("rm9Losses");

        const balanceResult =
            get("rm9BalanceResult");

        const drawdownResult =
            get("rm9DrawdownResult");

        const lossResult =
            get("rm9LossResult");

        const formulaLive =
            get("rm9FormulaLive");


        function calculateLosses() {

            if (
                !balanceInput ||
                !riskPercentInput ||
                !lossesInput
            ) {
                return;
            }


            const startingBalance =
                Number(balanceInput.value);

            const riskPercent =
                Number(riskPercentInput.value);

            const losses =
                Number(lossesInput.value);


            if (
                !Number.isFinite(startingBalance) ||
                !Number.isFinite(riskPercent) ||
                !Number.isFinite(losses) ||
                startingBalance <= 0 ||
                riskPercent < 0 ||
                riskPercent > 100 ||
                losses < 0
            ) {

                if (balanceResult) {
                    balanceResult.textContent = "—";
                }

                if (drawdownResult) {
                    drawdownResult.textContent = "—";
                }

                if (lossResult) {
                    lossResult.textContent = "—";
                }

                if (formulaLive) {
                    formulaLive.textContent =
                        "Enter valid starting balance, risk percentage and number of losses.";
                }

                return;
            }


            const riskDecimal =
                riskPercent / 100;


            const remainingBalance =
                startingBalance *
                Math.pow(
                    1 - riskDecimal,
                    losses
                );


            const capitalLost =
                startingBalance -
                remainingBalance;


            const drawdown =
                startingBalance > 0
                    ? (capitalLost / startingBalance) * 100
                    : 0;


            if (balanceResult) {

                balanceResult.textContent =
                    `$${remainingBalance.toFixed(2)}`;

            }


            if (drawdownResult) {

                drawdownResult.textContent =
                    `${drawdown.toFixed(2)}%`;

            }


            if (lossResult) {

                lossResult.textContent =
                    `$${capitalLost.toFixed(2)}`;

            }


            if (formulaLive) {

                formulaLive.textContent =
                    `After ${losses} consecutive ${riskPercent.toFixed(2)}% losses, approximately $${remainingBalance.toFixed(2)} remains from $${startingBalance.toFixed(2)}.`;

            }

        }


        /* =====================================================
           CALCULATOR EVENTS
        ===================================================== */

        if (balanceInput) {

            balanceInput.addEventListener(
                "input",
                calculateLosses
            );

        }


        if (riskPercentInput) {

            riskPercentInput.addEventListener(
                "input",
                calculateLosses
            );

        }


        if (lossesInput) {

            lossesInput.addEventListener(
                "input",
                calculateLosses
            );

        }


        /* =====================================================
           02 — PRACTICE QUESTIONS
        ===================================================== */

        const practiceQuestions = [

            {
                topic: "DRAWDOWN",

                balance: 1000,

                risk: 2,

                losses: 5,

                answer: 903.92,

                question:
                    "A $1,000 account experiences 5 consecutive losses while risking 2% of the remaining balance on each loss. What is the approximate remaining balance?",

                explanation:
                    "$1,000 × 0.98⁵ = approximately $903.92."
            },


            {
                topic: "DRAWDOWN",

                balance: 1000,

                risk: 1,

                losses: 10,

                answer: 904.38,

                question:
                    "A $1,000 account experiences 10 consecutive losses while risking 1% of the remaining balance on each loss. What is the approximate remaining balance?",

                explanation:
                    "$1,000 × 0.99¹⁰ = approximately $904.38."
            },


            {
                topic: "DRAWDOWN",

                balance: 2000,

                risk: 2,

                losses: 10,

                answer: 1634.17,

                question:
                    "A $2,000 account experiences 10 consecutive losses while risking 2% of the remaining balance on each loss. What is the approximate remaining balance?",

                explanation:
                    "$2,000 × 0.98¹⁰ = approximately $1,634.17."
            },


            {
                topic: "DRAWDOWN",

                balance: 5000,

                risk: 5,

                losses: 5,

                answer: 3868.90,

                question:
                    "A $5,000 account experiences 5 consecutive losses while risking 5% of the remaining balance on each loss. What is the approximate remaining balance?",

                explanation:
                    "$5,000 × 0.95⁵ = approximately $3,868.90."
            },


            {
                topic: "DRAWDOWN",

                balance: 1000,

                risk: 3,

                losses: 10,

                answer: 737.42,

                question:
                    "A $1,000 account experiences 10 consecutive losses while risking 3% of the remaining balance on each loss. What is the approximate remaining balance?",

                explanation:
                    "$1,000 × 0.97¹⁰ = approximately $737.42."
            }

        ];


        /* =====================================================
           PRACTICE STATE
        ===================================================== */

        let practiceIndex = 0;

        let practiceScore = 0;

        let practiceAnswered = false;


        /* =====================================================
           PRACTICE ELEMENTS
        ===================================================== */

        const practiceNumber =
            get("rm9PracticeNumber");

        const practiceBar =
            get("rm9PracticeBar");

        const practiceCard =
            get("rm9PracticeCard");

        const practiceBadge =
            get("rm9PracticeBadge");

        const practiceTopic =
            get("rm9PracticeTopic");

        const practiceQuestion =
            get("rm9PracticeQuestion");

        const practiceBalance =
            get("rm9PracticeBalance");

        const practiceRisk =
            get("rm9PracticeRisk");

        const practiceLosses =
            get("rm9PracticeLosses");

        const practiceAnswer =
            get("rm9PracticeAnswer");

        const practiceCheck =
            get("rm9PracticeCheck");

        const practiceFeedback =
            get("rm9PracticeFeedback");

        const practiceFeedbackTitle =
            get("rm9PracticeFeedbackTitle");

        const practiceFeedbackText =
            get("rm9PracticeFeedbackText");

        const practiceNext =
            get("rm9PracticeNext");

        const practiceComplete =
            get("rm9PracticeComplete");

        const practiceScoreDisplay =
            get("rm9PracticeScore");


        /* =====================================================
           LOAD PRACTICE QUESTION
        ===================================================== */

        function loadPracticeQuestion() {

            const question =
                practiceQuestions[practiceIndex];


            if (!question) {
                return;
            }


            practiceAnswered = false;


            if (practiceNumber) {

                practiceNumber.textContent =
                    `QUESTION ${String(
                        practiceIndex + 1
                    ).padStart(2, "0")} / ${practiceQuestions.length}`;

            }


            if (practiceBar) {

                practiceBar.style.width =
                    `${(
                        (practiceIndex + 1) /
                        practiceQuestions.length
                    ) * 100}%`;

            }


            if (practiceBadge) {

                practiceBadge.textContent =
                    `QUESTION ${String(
                        practiceIndex + 1
                    ).padStart(2, "0")}`;

            }


            if (practiceTopic) {

                practiceTopic.textContent =
                    question.topic;

            }


            /* =================================================
               IMPORTANT — QUESTION TEXT
            ================================================= */

            if (practiceQuestion) {

                practiceQuestion.textContent =
                    question.question;

                practiceQuestion.style.display =
                    "block";

                practiceQuestion.style.visibility =
                    "visible";

                practiceQuestion.style.opacity =
                    "1";

            }


            if (practiceBalance) {

                practiceBalance.textContent =
                    `$${question.balance.toLocaleString()}`;

            }


            if (practiceRisk) {

                practiceRisk.textContent =
                    `${question.risk}%`;

            }


            if (practiceLosses) {

                practiceLosses.textContent =
                    question.losses;

            }


            if (practiceAnswer) {

                practiceAnswer.value = "";

                practiceAnswer.disabled = false;

            }


            if (practiceCheck) {

                practiceCheck.disabled = false;

                practiceCheck.hidden = false;

            }


            if (practiceFeedback) {

                practiceFeedback.hidden = true;

                practiceFeedback.classList.remove(
                    "incorrect"
                );

            }


            if (practiceNext) {

                practiceNext.hidden = true;

                practiceNext.classList.remove(
                    "retry"
                );

                practiceNext.innerHTML =
                    `Next Question <span>→</span>`;

            }


            if (practiceCard) {

                practiceCard.hidden = false;

                practiceCard.style.display =
                    "block";

            }


            if (practiceComplete) {

                practiceComplete.hidden = true;

            }

        }


        /* =====================================================
           PRACTICE FEEDBACK
        ===================================================== */

        function showPracticeFeedback(
            correct,
            title,
            message
        ) {

            if (!practiceFeedback) {
                return;
            }


            practiceFeedback.hidden = false;


            practiceFeedback.classList.toggle(
                "incorrect",
                !correct
            );


            if (practiceFeedbackTitle) {

                practiceFeedbackTitle.textContent =
                    title;

            }


            if (practiceFeedbackText) {

                practiceFeedbackText.textContent =
                    message;

            }

        }


        /* =====================================================
           CHECK PRACTICE ANSWER
        ===================================================== */

        function checkPracticeAnswer() {

            if (practiceAnswered) {
                return;
            }


            if (!practiceAnswer) {
                return;
            }


            const userAnswer =
                Number(
                    practiceAnswer.value
                );


            if (!Number.isFinite(userAnswer)) {

                showPracticeFeedback(

                    false,

                    "Enter an answer.",

                    "Enter the remaining balance before checking."

                );

                return;

            }


            const question =
                practiceQuestions[
                    practiceIndex
                ];


            const isCorrect =
                Math.abs(
                    userAnswer -
                    question.answer
                ) <= 0.10;


            /* =================================================
               WRONG ANSWER
            ================================================= */

            if (!isCorrect) {

                showPracticeFeedback(

                    false,

                    "✗ Not quite.",

                    "Remember that each percentage loss is applied to the remaining balance. Try the same question again."

                );


                if (practiceNext) {

                    practiceNext.hidden = false;

                    practiceNext.classList.add(
                        "retry"
                    );

                    practiceNext.innerHTML =
                        `Try Again <span>↻</span>`;

                }

                return;

            }


            /* =================================================
               CORRECT ANSWER
            ================================================= */

            practiceAnswered = true;

            practiceScore++;


            showPracticeFeedback(

                true,

                "✓ Correct!",

                question.explanation

            );


            if (practiceAnswer) {

                practiceAnswer.disabled =
                    true;

            }


            if (practiceCheck) {

                practiceCheck.disabled =
                    true;

            }


            if (practiceNext) {

                practiceNext.hidden =
                    false;

                practiceNext.classList.remove(
                    "retry"
                );


                if (
                    practiceIndex ===
                    practiceQuestions.length - 1
                ) {

                    practiceNext.innerHTML =
                        `Finish Practice <span>✓</span>`;

                }

                else {

                    practiceNext.innerHTML =
                        `Next Question <span>→</span>`;

                }

            }

        }


        /* =====================================================
           PRACTICE NEXT / RETRY
        ===================================================== */

        function handlePracticeNext() {

            /*
             * Wrong answer:
             * retry same question
             */

            if (!practiceAnswered) {

                if (practiceAnswer) {

                    practiceAnswer.value = "";

                    practiceAnswer.focus();

                }


                if (practiceFeedback) {

                    practiceFeedback.hidden =
                        true;

                }


                if (practiceNext) {

                    practiceNext.hidden =
                        true;

                    practiceNext.classList.remove(
                        "retry"
                    );

                }


                return;

            }


            /*
             * Correct answer:
             * move forward
             */

            if (
                practiceIndex <
                practiceQuestions.length - 1
            ) {

                practiceIndex++;

                loadPracticeQuestion();

                return;

            }


            /* =================================================
               PRACTICE COMPLETE
            ================================================= */

            if (practiceCard) {

                practiceCard.hidden =
                    true;

            }


            if (practiceComplete) {

                practiceComplete.hidden =
                    false;

            }


            if (practiceScoreDisplay) {

                practiceScoreDisplay.textContent =
                    `You scored ${practiceScore} / ${practiceQuestions.length}.`;

            }

        }


        /* =====================================================
           PRACTICE EVENTS
        ===================================================== */

        if (practiceCheck) {

            practiceCheck.addEventListener(
                "click",
                checkPracticeAnswer
            );

        }


        if (practiceNext) {

            practiceNext.addEventListener(
                "click",
                handlePracticeNext
            );

        }


        if (practiceAnswer) {

            practiceAnswer.addEventListener(
                "keydown",
                function (event) {

                    if (event.key !== "Enter") {
                        return;
                    }


                    event.preventDefault();


                    if (practiceAnswered) {

                        handlePracticeNext();

                    }

                    else {

                        checkPracticeAnswer();

                    }

                }
            );

        }


        /* =====================================================
           03 — CHECKPOINT QUESTIONS
        ===================================================== */

        const checkpointQuestions = [

            {
                topic: "RISK CONTROL",

                question:
                    "What generally happens when risk per trade is increased?",

                options: [
                    "Equity swings and potential drawdowns become larger.",
                    "All losing trades disappear.",
                    "The account becomes guaranteed to grow.",
                    "Market volatility becomes zero."
                ],

                answer: 0,

                explanation:
                    "Higher risk per trade makes each win or loss have a larger effect on account equity."
            },


            {
                topic: "DRAWDOWN",

                question:
                    "If a trader risks 2% of the remaining account on every loss, what happens after repeated consecutive losses?",

                options: [
                    "The account remains exactly the same.",
                    "The account balance decreases and drawdown grows.",
                    "The account automatically doubles.",
                    "The Stop Loss becomes unnecessary."
                ],

                answer: 1,

                explanation:
                    "Each loss reduces the remaining account balance, causing cumulative drawdown."
            },


            {
                topic: "ACCOUNT SURVIVAL",

                question:
                    "Which approach is generally more conservative for protecting trading capital?",

                options: [
                    "Risking a very large percentage on every trade.",
                    "Increasing risk after every loss.",
                    "Using controlled risk and avoiding destructive drawdowns.",
                    "Ignoring account equity."
                ],

                answer: 2,

                explanation:
                    "Controlled risk helps limit the damage caused by losing streaks."
            },


            {
                topic: "CALCULATION",

                question:
                    "A $1,000 account loses 2% of its remaining balance ten times consecutively. Approximately how much remains?",

                options: [
                    "$800.00",
                    "$817.07",
                    "$900.00",
                    "$980.00"
                ],

                answer: 1,

                explanation:
                    "$1,000 × 0.98¹⁰ = approximately $817.07."
            },


            {
                topic: "FINAL CHALLENGE",

                question:
                    "What is the main lesson of maximum drawdown control?",

                options: [
                    "Never accept a losing trade.",
                    "Use larger risk whenever the account loses.",
                    "Keep losses controlled so the account can survive losing periods.",
                    "Guarantee a profit on every trade."
                ],

                answer: 2,

                explanation:
                    "Risk management cannot eliminate losses, but it can help prevent losing periods from becoming destructive."
            }

        ];


        /* =====================================================
           CHECKPOINT STATE
        ===================================================== */

        let checkpointIndex = 0;

        let checkpointScore = 0;

        let checkpointAnswered = false;


        /* =====================================================
           CHECKPOINT ELEMENTS
        ===================================================== */

        const checkpointNumber =
            get("rm9CheckpointNumber");

        const checkpointBar =
            get("rm9CheckpointBar");

        const checkpointCard =
            get("rm9CheckpointCard");

        const checkpointBadge =
            get("rm9CheckpointBadge");

        const checkpointTopic =
            get("rm9CheckpointTopic");

        const checkpointQuestion =
            get("rm9CheckpointQuestion");

        const checkpointOptions =
            get("rm9CheckpointOptions");

        const checkpointFeedback =
            get("rm9CheckpointFeedback");

        const checkpointFeedbackTitle =
            get("rm9CheckpointFeedbackTitle");

        const checkpointFeedbackText =
            get("rm9CheckpointFeedbackText");

        const checkpointNext =
            get("rm9CheckpointNext");

        const checkpointComplete =
            get("rm9CheckpointComplete");

        const checkpointResult =
            get("rm9CheckpointResult");

        const checkpointScoreDisplay =
            get("rm9CheckpointScore");


        /* =====================================================
           LOAD CHECKPOINT QUESTION
        ===================================================== */

        function loadCheckpointQuestion() {

            const question =
                checkpointQuestions[
                    checkpointIndex
                ];


            if (!question) {
                return;
            }


            checkpointAnswered =
                false;


            if (checkpointNumber) {

                checkpointNumber.textContent =
                    `QUESTION ${String(
                        checkpointIndex + 1
                    ).padStart(2, "0")} / ${checkpointQuestions.length}`;

            }


            if (checkpointBar) {

                checkpointBar.style.width =
                    `${(
                        (checkpointIndex + 1) /
                        checkpointQuestions.length
                    ) * 100}%`;

            }


            if (checkpointBadge) {

                checkpointBadge.textContent =
                    `QUESTION ${String(
                        checkpointIndex + 1
                    ).padStart(2, "0")}`;

            }


            if (checkpointTopic) {

                checkpointTopic.textContent =
                    question.topic;

            }


            /* =================================================
               IMPORTANT — CHECKPOINT QUESTION TEXT
            ================================================= */

            if (checkpointQuestion) {

                checkpointQuestion.textContent =
                    question.question;

                checkpointQuestion.style.display =
                    "block";

                checkpointQuestion.style.visibility =
                    "visible";

                checkpointQuestion.style.opacity =
                    "1";

            }


            /* =================================================
               OPTIONS
            ================================================= */

            if (!checkpointOptions) {

                console.error(
                    "Build 009: rm9CheckpointOptions element not found."
                );

                return;

            }


            checkpointOptions.innerHTML =
                "";


            question.options.forEach(
                function (option, index) {

                    const button =
                        document.createElement(
                            "button"
                        );


                    button.type =
                        "button";


                    button.className =
                        "rm9-option";


                    button.dataset.index =
                        index;


                    button.innerHTML = `

                        <span>
                            ${String.fromCharCode(
                                65 + index
                            )}
                        </span>

                        <b>
                            ${option}
                        </b>

                    `;


                    button.addEventListener(
                        "click",
                        function () {

                            checkCheckpointAnswer(
                                index,
                                button
                            );

                        }
                    );


                    checkpointOptions.appendChild(
                        button
                    );

                }
            );


            if (checkpointFeedback) {

                checkpointFeedback.hidden =
                    true;

                checkpointFeedback.classList.remove(
                    "incorrect"
                );

            }


            if (checkpointNext) {

                checkpointNext.hidden =
                    true;

                checkpointNext.classList.remove(
                    "retry"
                );

                checkpointNext.innerHTML =
                    `Next Question <span>→</span>`;

            }


            if (checkpointCard) {

                checkpointCard.hidden =
                    false;

                checkpointCard.style.display =
                    "block";

            }


            if (checkpointComplete) {

                checkpointComplete.hidden =
                    true;

            }

        }


        /* =====================================================
           CHECKPOINT FEEDBACK
        ===================================================== */

        function showCheckpointFeedback(
            correct,
            title,
            message
        ) {

            if (!checkpointFeedback) {
                return;
            }


            checkpointFeedback.hidden =
                false;


            checkpointFeedback.classList.toggle(
                "incorrect",
                !correct
            );


            if (checkpointFeedbackTitle) {

                checkpointFeedbackTitle.textContent =
                    title;

            }


            if (checkpointFeedbackText) {

                checkpointFeedbackText.textContent =
                    message;

            }

        }


        /* =====================================================
           CHECK CHECKPOINT ANSWER
        ===================================================== */

        function checkCheckpointAnswer(
            selectedIndex,
            selectedButton
        ) {

            if (checkpointAnswered) {
                return;
            }


            const question =
                checkpointQuestions[
                    checkpointIndex
                ];


            /* =================================================
               WRONG ANSWER
            ================================================= */

            if (
                selectedIndex !==
                question.answer
            ) {

                if (selectedButton) {

                    selectedButton.classList.add(
                        "incorrect"
                    );

                }


                /* =================================================
                   IMPORTANT FIX — LOCK ALL ANSWERS
                   
                   After a wrong answer, the student cannot
                   immediately select the correct answer.

                   They MUST press "Try Again" first.
                ================================================= */

                if (checkpointOptions) {

                    checkpointOptions
                        .querySelectorAll(
                            ".rm9-option"
                        )
                        .forEach(
                            function (button) {

                                button.disabled =
                                    true;

                            }
                        );

                }


                showCheckpointFeedback(

                    false,

                    "✗ Not quite.",

                    "That answer is incorrect. Review the concept and try the same question again."

                );


                if (checkpointNext) {

                    checkpointNext.hidden =
                        false;

                    checkpointNext.classList.add(
                        "retry"
                    );

                    checkpointNext.innerHTML =
                        `Try Again <span>↻</span>`;

                }


                return;

            }


            /* =================================================
               CORRECT ANSWER
            ================================================= */

            checkpointAnswered =
                true;


            checkpointScore++;


            if (selectedButton) {

                selectedButton.classList.add(
                    "correct"
                );

            }


            showCheckpointFeedback(

                true,

                "✓ Correct!",

                question.explanation

            );


            /* =================================================
               LOCK ALL ANSWERS AFTER CORRECT ANSWER
            ================================================= */

            document
                .querySelectorAll(
                    "#rm9CheckpointOptions .rm9-option"
                )
                .forEach(
                    function (button) {

                        button.disabled =
                            true;

                    }
                );


            if (checkpointNext) {

                checkpointNext.hidden =
                    false;

                checkpointNext.classList.remove(
                    "retry"
                );


                if (
                    checkpointIndex ===
                    checkpointQuestions.length - 1
                ) {

                    checkpointNext.innerHTML =
                        `Finish Checkpoint <span>✓</span>`;

                }

                else {

                    checkpointNext.innerHTML =
                        `Next Question <span>→</span>`;

                }

            }

        }


        /* =====================================================
           CHECKPOINT NEXT / RETRY
        ===================================================== */

        function handleCheckpointNext() {

            /*
             * WRONG ANSWER
             * 
             * Retry the SAME question.
             */

            if (!checkpointAnswered) {

                if (checkpointFeedback) {

                    checkpointFeedback.hidden =
                        true;

                }


                if (checkpointNext) {

                    checkpointNext.hidden =
                        true;

                    checkpointNext.classList.remove(
                        "retry"
                    );

                }


                /* =================================================
                   IMPORTANT FIX — UNLOCK OPTIONS
                   
                   The options were locked after the wrong answer.
                   Pressing Try Again unlocks them.
                ================================================= */

                if (checkpointOptions) {

                    checkpointOptions
                        .querySelectorAll(
                            ".rm9-option"
                        )
                        .forEach(
                            function (button) {

                                button.disabled =
                                    false;

                                button.classList.remove(
                                    "incorrect"
                                );

                            }
                        );

                }


                return;

            }


            /*
             * CORRECT ANSWER
             *
             * Move to next question.
             */

            if (
                checkpointIndex <
                checkpointQuestions.length - 1
            ) {

                checkpointIndex++;

                loadCheckpointQuestion();

                return;

            }


            /* =================================================
               CHECKPOINT COMPLETE
            ================================================= */

            if (checkpointCard) {

                checkpointCard.hidden =
                    true;

            }


            if (checkpointComplete) {

                checkpointComplete.hidden =
                    false;

            }


            if (checkpointScoreDisplay) {

                checkpointScoreDisplay.textContent =
                    `You scored ${checkpointScore} / ${checkpointQuestions.length}.`;

            }


            if (checkpointResult) {

                if (
                    checkpointScore >= 4
                ) {

                    checkpointResult.textContent =
                        "🏆 Build 009 Complete";

                }

                else {

                    checkpointResult.textContent =
                        "📘 Review Required";

                }

            }

        }


        /* =====================================================
           CHECKPOINT EVENT
        ===================================================== */

        if (checkpointNext) {

            checkpointNext.addEventListener(
                "click",
                handleCheckpointNext
            );

        }


        /* =====================================================
           INITIALIZE BUILD 009
        ===================================================== */

        calculateLosses();

        loadPracticeQuestion();

        loadCheckpointQuestion();


        /* =====================================================
           DEBUG INFORMATION
        ===================================================== */

        console.log(
            "========================================"
        );

        console.log(
            "Strativo Academy — Risk Management Build 009"
        );

        console.log(
            "JavaScript loaded successfully."
        );

        console.log(
            "Practice questions:",
            practiceQuestions.length
        );

        console.log(
            "Checkpoint questions:",
            checkpointQuestions.length
        );

        console.log(
            "Practice question element:",
            practiceQuestion
        );

        console.log(
            "Checkpoint question element:",
            checkpointQuestion
        );

        console.log(
            "========================================"
        );

    });

})();