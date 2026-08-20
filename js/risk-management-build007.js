/* =========================================================
   STRATIVO ACADEMY
   RISK MANAGEMENT LAB
   BUILD 007
   POSITION SIZING & STOP-LOSS DISTANCE
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       HELPER
    ===================================================== */

    function get(id) {
        return document.getElementById(id);
    }


    /* =====================================================
       01 — POSITION SIZE CALCULATOR

       Simplified formula:

       Position Size =
       Planned Risk ÷ Stop-Loss Distance
    ===================================================== */

    const riskInput =
        get("rm7Risk");

    const distanceInput =
        get("rm7Distance");

    const positionSizeInput =
        get("rm7PositionSize");

    const riskResult =
        get("rm7RiskResult");

    const distanceResult =
        get("rm7DistanceResult");

    const sizeResult =
        get("rm7SizeResult");

    const formulaLive =
        get("rm7FormulaLive");


    function calculatePositionSize() {

        if (
            !riskInput ||
            !distanceInput
        ) {
            return;
        }


        const risk =
            Number(riskInput.value);

        const distance =
            Number(distanceInput.value);


        if (
            !Number.isFinite(risk) ||
            !Number.isFinite(distance) ||
            risk <= 0 ||
            distance <= 0
        ) {

            if (positionSizeInput) {
                positionSizeInput.value = "—";
            }

            if (riskResult) {
                riskResult.textContent = "$0.00";
            }

            if (distanceResult) {
                distanceResult.textContent = "$0.00";
            }

            if (sizeResult) {
                sizeResult.textContent = "—";
            }

            if (formulaLive) {
                formulaLive.textContent =
                    "Enter a valid planned risk and Stop-Loss distance.";
            }

            return;
        }


        const positionSize =
            risk / distance;


        if (positionSizeInput) {

            positionSizeInput.value =
                `${positionSize.toFixed(2)} units`;

        }


        if (riskResult) {

            riskResult.textContent =
                `$${risk.toFixed(2)}`;

        }


        if (distanceResult) {

            distanceResult.textContent =
                `$${distance.toFixed(2)}`;

        }


        if (sizeResult) {

            sizeResult.textContent =
                `${positionSize.toFixed(2)} units`;

        }


        if (formulaLive) {

            formulaLive.textContent =
                `$${risk.toFixed(2)} ÷ $${distance.toFixed(2)} = ${positionSize.toFixed(2)} units`;

        }

    }


    /* =====================================================
       CALCULATOR EVENTS
    ===================================================== */

    if (riskInput) {

        riskInput.addEventListener(
            "input",
            calculatePositionSize
        );

    }


    if (distanceInput) {

        distanceInput.addEventListener(
            "input",
            calculatePositionSize
        );

    }


    /* =====================================================
       02 — PRACTICE QUESTIONS
    ===================================================== */

    const practiceQuestions = [

        {
            topic: "POSITION SIZE",

            risk: 100,

            distance: 10,

            answer: 10,

            question:
                "You plan to risk $100 and the simplified Stop-Loss distance is $10 per unit. What is the position size?",

            explanation:
                "$100 ÷ $10 = 10 units."
        },


        {
            topic: "POSITION SIZE",

            risk: 200,

            distance: 20,

            answer: 10,

            question:
                "You plan to risk $200 and the simplified Stop-Loss distance is $20 per unit. What is the position size?",

            explanation:
                "$200 ÷ $20 = 10 units."
        },


        {
            topic: "POSITION SIZE",

            risk: 150,

            distance: 15,

            answer: 10,

            question:
                "You plan to risk $150 and the simplified Stop-Loss distance is $15 per unit. What is the position size?",

            explanation:
                "$150 ÷ $15 = 10 units."
        },


        {
            topic: "POSITION SIZE",

            risk: 100,

            distance: 5,

            answer: 20,

            question:
                "You plan to risk $100 and the simplified Stop-Loss distance is $5 per unit. What is the position size?",

            explanation:
                "$100 ÷ $5 = 20 units."
        },


        {
            topic: "POSITION SIZE",

            risk: 300,

            distance: 30,

            answer: 10,

            question:
                "You plan to risk $300 and the simplified Stop-Loss distance is $30 per unit. What is the position size?",

            explanation:
                "$300 ÷ $30 = 10 units."
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
        get("rm7PracticeNumber");

    const practiceBar =
        get("rm7PracticeBar");

    const practiceCard =
        get("rm7PracticeCard");

    const practiceBadge =
        get("rm7PracticeBadge");

    const practiceTopic =
        get("rm7PracticeTopic");

    const practiceQuestion =
        get("rm7PracticeQuestion");

    const practiceRisk =
        get("rm7PracticeRisk");

    const practiceDistance =
        get("rm7PracticeDistance");

    const practiceAnswer =
        get("rm7PracticeAnswer");

    const practiceCheck =
        get("rm7PracticeCheck");

    const practiceFeedback =
        get("rm7PracticeFeedback");

    const practiceFeedbackTitle =
        get("rm7PracticeFeedbackTitle");

    const practiceFeedbackText =
        get("rm7PracticeFeedbackText");

    const practiceNext =
        get("rm7PracticeNext");

    const practiceComplete =
        get("rm7PracticeComplete");

    const practiceScoreDisplay =
        get("rm7PracticeScore");


    /* =====================================================
       LOAD PRACTICE QUESTION
    ===================================================== */

    function loadPracticeQuestion() {

        const question =
            practiceQuestions[
                practiceIndex
            ];


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


        if (practiceQuestion) {

            practiceQuestion.textContent =
                question.question;

        }


        if (practiceRisk) {

            practiceRisk.textContent =
                `$${question.risk}`;

        }


        if (practiceDistance) {

            practiceDistance.textContent =
                `$${question.distance} / Unit`;

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

                "Enter the position size before checking."

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
            ) <= 0.01;


        /* =================================================
           WRONG ANSWER
        ================================================= */

        if (!isCorrect) {

            showPracticeFeedback(

                false,

                "✗ Not quite.",

                "Divide the planned risk by the Stop-Loss distance, then try the same question again."

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

            practiceAnswer.disabled = true;

        }


        if (practiceCheck) {

            practiceCheck.disabled = true;

        }


        if (practiceNext) {

            practiceNext.hidden = false;

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
         * retry same question.
         */

        if (!practiceAnswered) {

            if (practiceAnswer) {

                practiceAnswer.value = "";

                practiceAnswer.focus();

            }


            if (practiceFeedback) {

                practiceFeedback.hidden = true;

            }


            if (practiceNext) {

                practiceNext.hidden = true;

                practiceNext.classList.remove(
                    "retry"
                );

            }


            return;

        }


        /*
         * Correct answer:
         * move forward.
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

            practiceCard.hidden = true;

        }


        if (practiceComplete) {

            practiceComplete.hidden = false;

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
            topic: "POSITION SIZING",

            question:
                "In the simplified model, what happens to position size when the Stop-Loss distance becomes wider while planned risk stays the same?",

            options: [
                "Position size generally becomes smaller.",
                "Position size always doubles.",
                "Position size becomes unlimited.",
                "Stop-Loss distance has no relationship to position size."
            ],

            answer: 0,

            explanation:
                "With planned risk fixed, a wider Stop-Loss distance generally requires a smaller position size."
        },


        {
            topic: "CALCULATION",

            question:
                "Planned risk is $200 and the simplified Stop-Loss distance is $20 per unit. What is the position size?",

            options: [
                "5 units",
                "10 units",
                "20 units",
                "40 units"
            ],

            answer: 1,

            explanation:
                "$200 ÷ $20 = 10 units."
        },


        {
            topic: "CONCEPT",

            question:
                "Why is position sizing important in risk management?",

            options: [
                "It guarantees every trade will win.",
                "It helps keep the planned monetary risk within the defined limit.",
                "It removes market volatility.",
                "It guarantees a specific profit."
            ],

            answer: 1,

            explanation:
                "Position sizing helps determine how large a trade can be while keeping planned risk within the defined limit."
        },


        {
            topic: "CALCULATION",

            question:
                "Planned risk is $100 and the simplified Stop-Loss distance is $5 per unit. What is the position size?",

            options: [
                "5 units",
                "10 units",
                "20 units",
                "25 units"
            ],

            answer: 2,

            explanation:
                "$100 ÷ $5 = 20 units."
        },


        {
            topic: "FINAL CHALLENGE",

            question:
                "Which statement is correct about the simplified position-sizing formula?",

            options: [
                "Position Size = Stop-Loss Distance ÷ Planned Risk",
                "Position Size = Planned Risk × Stop-Loss Distance",
                "Position Size = Planned Risk ÷ Stop-Loss Distance",
                "Position Size = Planned Risk + Stop-Loss Distance"
            ],

            answer: 2,

            explanation:
                "In this simplified educational model, Position Size = Planned Risk ÷ Stop-Loss Distance."
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
        get("rm7CheckpointNumber");

    const checkpointBar =
        get("rm7CheckpointBar");

    const checkpointCard =
        get("rm7CheckpointCard");

    const checkpointBadge =
        get("rm7CheckpointBadge");

    const checkpointTopic =
        get("rm7CheckpointTopic");

    const checkpointQuestion =
        get("rm7CheckpointQuestion");

    const checkpointOptions =
        get("rm7CheckpointOptions");

    const checkpointFeedback =
        get("rm7CheckpointFeedback");

    const checkpointFeedbackTitle =
        get("rm7CheckpointFeedbackTitle");

    const checkpointFeedbackText =
        get("rm7CheckpointFeedbackText");

    const checkpointNext =
        get("rm7CheckpointNext");

    const checkpointComplete =
        get("rm7CheckpointComplete");

    const checkpointResult =
        get("rm7CheckpointResult");

    const checkpointScoreDisplay =
        get("rm7CheckpointScore");


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


        checkpointAnswered = false;


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


        if (checkpointQuestion) {

            checkpointQuestion.textContent =
                question.question;

        }


        if (!checkpointOptions) {
            return;
        }


        /* =================================================
           CLEAR OLD OPTIONS
        ================================================= */

        checkpointOptions.innerHTML = "";


        if (checkpointFeedback) {

            checkpointFeedback.hidden = true;

            checkpointFeedback.classList.remove(
                "incorrect"
            );

        }


        if (checkpointNext) {

            checkpointNext.hidden = true;

            checkpointNext.classList.remove(
                "retry"
            );

            checkpointNext.innerHTML =
                `Next Question <span>→</span>`;

        }


        /* =================================================
           CREATE OPTIONS
        ================================================= */

        question.options.forEach(
            function (
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
                    "rm7-option";


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


        if (checkpointCard) {

            checkpointCard.hidden = false;

        }


        if (checkpointComplete) {

            checkpointComplete.hidden = true;

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


        checkpointFeedback.hidden = false;


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
           
           IMPORTANT:
           LOCK ALL OPTIONS.
           
           Student must click TRY AGAIN before
           selecting another answer.
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
               FIX:
               LOCK ALL ANSWER BUTTONS
            ================================================= */

            if (checkpointOptions) {

                checkpointOptions
                    .querySelectorAll(
                        ".rm7-option"
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

                "That answer is incorrect. Review the concept and try again."

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

        checkpointAnswered = true;

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
           LOCK ALL OPTIONS AFTER CORRECT ANSWER
        ================================================= */

        if (checkpointOptions) {

            checkpointOptions
                .querySelectorAll(
                    ".rm7-option"
                )
                .forEach(
                    function (button) {

                        button.disabled =
                            true;

                    }
                );

        }


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
         * WRONG ANSWER:
         *
         * Unlock the SAME question.
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
               UNLOCK ALL OPTIONS AFTER TRY AGAIN
            ================================================= */

            if (checkpointOptions) {

                checkpointOptions
                    .querySelectorAll(
                        ".rm7-option"
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
         * CORRECT ANSWER:
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
                    "🏆 Build 007 Complete";

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
       INITIALIZE BUILD 007
    ===================================================== */

    function initializeBuild007() {

        calculatePositionSize();

        loadPracticeQuestion();

        loadCheckpointQuestion();


        console.log(
            "Strativo Academy — Risk Management Build 007 loaded successfully."
        );

    }


    /*
     * This supports both:
     * - script loaded with defer
     * - script loaded normally
     */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeBuild007
        );

    }

    else {

        initializeBuild007();

    }


})();