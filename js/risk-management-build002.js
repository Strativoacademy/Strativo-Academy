/* =========================================================
   STRATIVO ACADEMY
   RISK MANAGEMENT LAB — BUILD 002
   POSITION SIZING
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       HELPERS
    ===================================================== */

    function get(id) {

        return document.getElementById(id);

    }


    function formatMoney(value) {

        return new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        ).format(value);

    }


    function formatLots(value) {

        return `${value.toFixed(2)} lots`;

    }


    /* =====================================================
       POSITION SIZE CALCULATOR
    ===================================================== */

    const balanceInput =
        get("rm2Balance");

    const riskPercentInput =
        get("rm2RiskPercent");

    const stopLossInput =
        get("rm2StopLoss");

    const pipValueInput =
        get("rm2PipValue");


    const riskAmountResult =
        get("rm2RiskAmount");

    const positionSizeResult =
        get("rm2PositionSize");

    const formulaResult =
        get("rm2FormulaLive");


    function calculatePositionSize() {

        const balance =
            Number(
                balanceInput?.value
            );

        const riskPercent =
            Number(
                riskPercentInput?.value
            );

        const stopLoss =
            Number(
                stopLossInput?.value
            );

        const pipValue =
            Number(
                pipValueInput?.value
            );


        if (

            !Number.isFinite(balance) ||

            !Number.isFinite(riskPercent) ||

            !Number.isFinite(stopLoss) ||

            !Number.isFinite(pipValue) ||

            balance < 0 ||

            riskPercent < 0 ||

            stopLoss <= 0 ||

            pipValue <= 0

        ) {

            if (riskAmountResult) {

                riskAmountResult.textContent =
                    "$0.00";

            }


            if (positionSizeResult) {

                positionSizeResult.textContent =
                    "0.00 lots";

            }


            if (formulaResult) {

                formulaResult.textContent =
                    "Enter valid values to calculate.";

            }


            return;

        }


        const riskAmount =
            balance *
            (
                riskPercent / 100
            );


        const positionSize =
            riskAmount /
            (
                stopLoss *
                pipValue
            );


        if (riskAmountResult) {

            riskAmountResult.textContent =
                formatMoney(
                    riskAmount
                );

        }


        if (positionSizeResult) {

            positionSizeResult.textContent =
                formatLots(
                    positionSize
                );

        }


        if (formulaResult) {

            formulaResult.textContent =
                `${formatMoney(riskAmount)} ÷ ` +
                `(${stopLoss} × ${formatMoney(pipValue)}) = ` +
                `${positionSize.toFixed(2)} lots`;

        }

    }


    [

        balanceInput,

        riskPercentInput,

        stopLossInput,

        pipValueInput

    ].forEach(function (input) {

        if (input) {

            input.addEventListener(
                "input",
                calculatePositionSize
            );

        }

    });


    /* =====================================================
       PRACTICE QUESTIONS
    ===================================================== */

    const practiceQuestions = [

        {

            topic: "POSITION SIZE",

            question:
                "You plan to risk $10 with a 20-pip Stop Loss and a $10 pip value per standard lot. What position size does the simplified formula give?",

            risk: 10,

            stopLoss: 20,

            pipValue: 10,

            answer: 0.05,

            explanation:
                "$10 ÷ (20 × $10) = 0.05 lots."

        },


        {

            topic: "POSITION SIZE",

            question:
                "You plan to risk $20 with a 20-pip Stop Loss and a $10 pip value per standard lot. What position size is calculated?",

            risk: 20,

            stopLoss: 20,

            pipValue: 10,

            answer: 0.10,

            explanation:
                "$20 ÷ (20 × $10) = 0.10 lots."

        },


        {

            topic: "WIDER STOP",

            question:
                "You plan to risk $20 with a 40-pip Stop Loss and a $10 pip value. What position size is calculated?",

            risk: 20,

            stopLoss: 40,

            pipValue: 10,

            answer: 0.05,

            explanation:
                "$20 ÷ (40 × $10) = 0.05 lots."

        },


        {

            topic: "SMALLER RISK",

            question:
                "You plan to risk $15 with a 30-pip Stop Loss and a $10 pip value. What position size is calculated?",

            risk: 15,

            stopLoss: 30,

            pipValue: 10,

            answer: 0.05,

            explanation:
                "$15 ÷ (30 × $10) = 0.05 lots."

        },


        {

            topic: "FINAL PRACTICE",

            question:
                "You plan to risk $30 with a 50-pip Stop Loss and a $10 pip value. What position size is calculated?",

            risk: 30,

            stopLoss: 50,

            pipValue: 10,

            answer: 0.06,

            explanation:
                "$30 ÷ (50 × $10) = 0.06 lots."

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
        get("rm2PracticeNumber");

    const practiceBar =
        get("rm2PracticeBar");

    const practiceCard =
        get("rm2PracticeCard");

    const practiceBadge =
        get("rm2PracticeBadge");

    const practiceTopic =
        get("rm2PracticeTopic");

    const practiceQuestion =
        get("rm2PracticeQuestion");

    const practiceRisk =
        get("rm2PracticeRisk");

    const practiceStopLoss =
        get("rm2PracticeSL");

    const practicePipValue =
        get("rm2PracticePV");

    const practiceAnswer =
        get("rm2PracticeAnswer");

    const practiceCheck =
        get("rm2PracticeCheck");

    const practiceFeedback =
        get("rm2PracticeFeedback");

    const practiceFeedbackTitle =
        get("rm2PracticeFeedbackTitle");

    const practiceFeedbackText =
        get("rm2PracticeFeedbackText");

    const practiceNext =
        get("rm2PracticeNext");

    const practiceResult =
        get("rm2PracticeResult");

    const practiceScoreDisplay =
        get("rm2PracticeScore");

    const practiceMessage =
        get("rm2PracticeMessage");


    /* =====================================================
       LOAD PRACTICE QUESTION
    ===================================================== */

    function loadPracticeQuestion() {

        const question =
            practiceQuestions[
                practiceIndex
            ];


        practiceAnswered =
            false;


        practiceNumber.textContent =
            `${practiceIndex + 1} / ${practiceQuestions.length}`;


        practiceBar.style.width =
            `${(
                (practiceIndex + 1) /
                practiceQuestions.length
            ) * 100}%`;


        practiceBadge.textContent =
            `QUESTION ${String(
                practiceIndex + 1
            ).padStart(2, "0")}`;


        practiceTopic.textContent =
            question.topic;


        practiceQuestion.textContent =
            question.question;


        practiceRisk.textContent =
            formatMoney(
                question.risk
            );


        practiceStopLoss.textContent =
            `${question.stopLoss} pips`;


        practicePipValue.textContent =
            formatMoney(
                question.pipValue
            );


        practiceAnswer.value =
            "";


        practiceAnswer.disabled =
            false;


        practiceCheck.disabled =
            false;


        practiceCheck.hidden =
            false;


        practiceNext.hidden =
            true;


        practiceNext.classList.remove(
            "retry"
        );


        practiceNext.innerHTML =
            `Next Question <span>→</span>`;


        practiceFeedback.hidden =
            true;


        practiceFeedback.classList.remove(
            "correct",
            "incorrect"
        );


        practiceCard.hidden =
            false;


        practiceResult.hidden =
            true;

    }


    /* =====================================================
       PRACTICE FEEDBACK
    ===================================================== */

    function showPracticeFeedback(
        correct,
        title,
        message
    ) {

        practiceFeedback.hidden =
            false;


        practiceFeedback.classList.toggle(
            "correct",
            correct
        );


        practiceFeedback.classList.toggle(
            "incorrect",
            !correct
        );


        practiceFeedbackTitle.textContent =
            title;


        practiceFeedbackText.textContent =
            message;

    }


    /* =====================================================
       CHECK PRACTICE ANSWER
    ===================================================== */

    function checkPracticeAnswer() {

        if (practiceAnswered) {

            return;

        }


        const userAnswer =
            Number(
                practiceAnswer.value
            );


        if (
            !Number.isFinite(
                userAnswer
            )
        ) {

            showPracticeFeedback(

                false,

                "Enter an answer.",

                "Enter a valid position size before checking."

            );


            return;

        }


        const question =
            practiceQuestions[
                practiceIndex
            ];


        const correct =
            Math.abs(
                userAnswer -
                question.answer
            ) <= 0.001;


        /* =================================================
           WRONG ANSWER
        ================================================= */

        if (!correct) {

            showPracticeFeedback(

                false,

                "✗ Not quite.",

                "Check the formula and try the same question again."

            );


            practiceNext.hidden =
                false;


            practiceNext.classList.add(
                "retry"
            );


            practiceNext.innerHTML =
                `Try Again <span>↻</span>`;


            return;

        }


        /* =================================================
           CORRECT ANSWER
        ================================================= */

        practiceAnswered =
            true;


        practiceScore++;


        showPracticeFeedback(

            true,

            "✓ Correct!",

            question.explanation

        );


        practiceAnswer.disabled =
            true;


        practiceCheck.disabled =
            true;


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


    /* =====================================================
       PRACTICE NEXT / RETRY
    ===================================================== */

    function handlePracticeNext() {

        /*
         * Wrong answer = retry.
         */

        if (!practiceAnswered) {

            practiceAnswer.value =
                "";


            practiceFeedback.hidden =
                true;


            practiceNext.hidden =
                true;


            practiceNext.classList.remove(
                "retry"
            );


            practiceAnswer.focus();


            return;

        }


        /*
         * Correct answer = next question.
         */

        if (
            practiceIndex <
            practiceQuestions.length - 1
        ) {

            practiceIndex++;

            loadPracticeQuestion();

            return;

        }


        /*
         * Practice complete.
         */

        finishPractice();

    }


    /* =====================================================
       FINISH PRACTICE
    ===================================================== */

    function finishPractice() {

        practiceCard.hidden =
            true;


        practiceResult.hidden =
            false;


        practiceScoreDisplay.textContent =
            `${practiceScore} / ${practiceQuestions.length}`;


        if (
            practiceScore ===
            practiceQuestions.length
        ) {

            practiceMessage.textContent =
                "Excellent. You are ready for the Build 002 checkpoint.";

        }

        else {

            practiceMessage.textContent =
                "Good work. Review any difficult questions before moving to the checkpoint.";

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

                if (
                    event.key !== "Enter"
                ) {

                    return;

                }


                event.preventDefault();


                if (
                    practiceAnswered
                ) {

                    handlePracticeNext();

                }

                else {

                    checkPracticeAnswer();

                }

            }

        );

    }


    /* =====================================================
       CHECKPOINT QUESTIONS
    ===================================================== */

    const checkpointQuestions = [

        {

            topic: "CONCEPT",

            question:
                "If the Stop Loss distance becomes wider while planned dollar risk stays the same, what generally happens to the calculated position size?",

            options: [

                "It becomes larger.",

                "It becomes smaller.",

                "It always stays exactly the same.",

                "It becomes zero."

            ],

            answer: 1,

            explanation:
                "With the same planned risk, a wider Stop Loss means a smaller position is needed."

        },


        {

            topic: "CALCULATION",

            question:
                "Risk is $25, the Stop Loss is 25 pips, and pip value is $10 per standard lot. What position size is calculated?",

            options: [

                "0.05 lots",

                "0.10 lots",

                "0.25 lots",

                "1.00 lot"

            ],

            answer: 1,

            explanation:
                "$25 ÷ (25 × $10) = 0.10 lots."

        },


        {

            topic: "CALCULATION",

            question:
                "Risk is $12, the Stop Loss is 30 pips, and pip value is $10. What position size is calculated?",

            options: [

                "0.02 lots",

                "0.04 lots",

                "0.12 lots",

                "0.40 lots"

            ],

            answer: 1,

            explanation:
                "$12 ÷ (30 × $10) = 0.04 lots."

        },


        {

            topic: "DECISION",

            question:
                "Two setups have the same $20 planned risk. Setup A has a 20-pip Stop Loss and Setup B has a 40-pip Stop Loss. Which requires the smaller position size?",

            options: [

                "Setup A",

                "Setup B",

                "Both require the same size",

                "Neither can be calculated"

            ],

            answer: 1,

            explanation:
                "Setup B has the wider Stop Loss, so the position size must be smaller to keep planned dollar risk at $20."

        },


        {

            topic: "FINAL CHALLENGE",

            question:
                "A trader plans to risk $30. The Stop Loss is 60 pips and pip value is $10. What position size is calculated?",

            options: [

                "0.03 lots",

                "0.05 lots",

                "0.10 lots",

                "0.50 lots"

            ],

            answer: 1,

            explanation:
                "$30 ÷ (60 × $10) = 0.05 lots."

        }

    ];


    /* =====================================================
       CHECKPOINT STATE
    ===================================================== */

    let checkpointIndex =
        0;

    let checkpointScore =
        0;

    let checkpointAnswered =
        false;


    /* =====================================================
       CHECKPOINT ELEMENTS
    ===================================================== */

    const checkpointNumber =
        get("rm2CheckpointNumber");

    const checkpointBar =
        get("rm2CheckpointBar");

    const checkpointCard =
        get("rm2CheckpointCard");

    const checkpointBadge =
        get("rm2CheckpointBadge");

    const checkpointTopic =
        get("rm2CheckpointTopic");

    const checkpointQuestion =
        get("rm2CheckpointQuestion");

    const checkpointOptions =
        get("rm2CheckpointOptions");

    const checkpointFeedback =
        get("rm2CheckpointFeedback");

    const checkpointFeedbackTitle =
        get("rm2CheckpointFeedbackTitle");

    const checkpointFeedbackText =
        get("rm2CheckpointFeedbackText");

    const checkpointNext =
        get("rm2CheckpointNext");

    const checkpointResult =
        get("rm2CheckpointResult");

    const checkpointIcon =
        get("rm2CheckpointIcon");

    const checkpointScoreDisplay =
        get("rm2CheckpointScore");

    const checkpointResultTitle =
        get("rm2CheckpointTitle");

    const checkpointResultMessage =
        get("rm2CheckpointMessage");


    /* =====================================================
       LOAD CHECKPOINT
    ===================================================== */

    function loadCheckpointQuestion() {

        const question =
            checkpointQuestions[
                checkpointIndex
            ];


        checkpointAnswered =
            false;


        checkpointNumber.textContent =
            `${checkpointIndex + 1} / ${checkpointQuestions.length}`;


        checkpointBar.style.width =
            `${(
                (checkpointIndex + 1) /
                checkpointQuestions.length
            ) * 100}%`;


        checkpointBadge.textContent =
            `QUESTION ${String(
                checkpointIndex + 1
            ).padStart(2, "0")}`;


        checkpointTopic.textContent =
            question.topic;


        checkpointQuestion.textContent =
            question.question;


        checkpointOptions.innerHTML =
            "";


        checkpointFeedback.hidden =
            true;


        checkpointFeedback.classList.remove(
            "correct",
            "incorrect"
        );


        checkpointNext.hidden =
            true;


        checkpointNext.classList.remove(
            "retry"
        );


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
                    "rm2-option";


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

                        selectCheckpointAnswer(
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


        checkpointCard.hidden =
            false;


        checkpointResult.hidden =
            true;

    }


    /* =====================================================
       CHECKPOINT FEEDBACK
    ===================================================== */

    function showCheckpointFeedback(

        correct,

        title,

        message

    ) {

        checkpointFeedback.hidden =
            false;


        checkpointFeedback.classList.toggle(
            "correct",
            correct
        );


        checkpointFeedback.classList.toggle(
            "incorrect",
            !correct
        );


        checkpointFeedbackTitle.textContent =
            title;


        checkpointFeedbackText.textContent =
            message;

    }


    /* =====================================================
       SELECT CHECKPOINT ANSWER
    ===================================================== */

    function selectCheckpointAnswer(

        selectedIndex,

        selectedButton

    ) {

        if (
            checkpointAnswered
        ) {

            return;

        }


        const question =
            checkpointQuestions[
                checkpointIndex
            ];


        /*
         * Clear previous visual state.
         */

        document
            .querySelectorAll(
                ".rm2-option"
            )
            .forEach(

                function (button) {

                    button.classList.remove(
                        "selected",
                        "incorrect"
                    );

                }

            );


        selectedButton.classList.add(
            "selected"
        );


        /* =================================================
           WRONG ANSWER

           FIX:
           LOCK ALL OPTIONS AFTER WRONG ANSWER.
           Student MUST press Try Again.
        ================================================= */

        if (
            selectedIndex !==
            question.answer
        ) {

            selectedButton.classList.add(
                "incorrect"
            );


            /* =================================================
               LOCK EVERY OPTION
            ================================================= */

            document
                .querySelectorAll(
                    ".rm2-option"
                )
                .forEach(

                    function (button) {

                        button.disabled =
                            true;

                    }

                );


            showCheckpointFeedback(

                false,

                "✗ Not quite.",

                "Check this question carefully and try again. You must answer correctly before continuing."

            );


            checkpointNext.hidden =
                false;


            checkpointNext.classList.add(
                "retry"
            );


            checkpointNext.innerHTML =
                `Try Again <span>↻</span>`;


            return;

        }


        /* =================================================
           CORRECT ANSWER
        ================================================= */

        checkpointAnswered =
            true;


        checkpointScore++;


        selectedButton.classList.add(
            "correct"
        );


        showCheckpointFeedback(

            true,

            "✓ Correct!",

            question.explanation

        );


        /* =================================================
           LOCK ALL OPTIONS AFTER CORRECT ANSWER
        ================================================= */

        document
            .querySelectorAll(
                ".rm2-option"
            )
            .forEach(

                function (button) {

                    button.disabled =
                        true;

                }

            );


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


    /* =====================================================
       CHECKPOINT NEXT / RETRY
    ===================================================== */

    function handleCheckpointNext() {

        /*
         * Wrong answer.
         * Stay on the same question.
         */

        if (
            !checkpointAnswered
        ) {

            checkpointFeedback.hidden =
                true;


            checkpointNext.hidden =
                true;


            checkpointNext.classList.remove(
                "retry"
            );


            /* =================================================
               UNLOCK ALL OPTIONS AFTER TRY AGAIN
            ================================================= */

            document
                .querySelectorAll(
                    ".rm2-option"
                )
                .forEach(

                    function (button) {

                        button.disabled =
                            false;


                        button.classList.remove(
                            "selected",
                            "incorrect"
                        );

                    }

                );


            return;

        }


        /*
         * Correct answer.
         * Go to next question.
         */

        if (
            checkpointIndex <
            checkpointQuestions.length - 1
        ) {

            checkpointIndex++;

            loadCheckpointQuestion();

            return;

        }


        /*
         * Checkpoint complete.
         */

        finishCheckpoint();

    }


    /* =====================================================
       FINISH CHECKPOINT
    ===================================================== */

    function finishCheckpoint() {

        checkpointCard.hidden =
            true;


        checkpointResult.hidden =
            false;


        checkpointScoreDisplay.textContent =
            `${checkpointScore} / ${checkpointQuestions.length}`;


        const passed =
            checkpointScore >= 4;


        if (passed) {

            checkpointIcon.textContent =
                "🏆";


            checkpointResultTitle.textContent =
                "Risk Management Build 002 Complete";


            checkpointResultMessage.textContent =
                "Excellent work. You passed the Position Sizing checkpoint.";

        }

        else {

            checkpointIcon.textContent =
                "📘";


            checkpointResultTitle.textContent =
                "Review Required";


            checkpointResultMessage.textContent =
                "Review Position Sizing and try the checkpoint again.";


            checkpointResult.classList.add(
                "failed"
            );

        }

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    calculatePositionSize();

    loadPracticeQuestion();

    loadCheckpointQuestion();


    /* =====================================================
       BUILD STATUS
    ===================================================== */

    console.log(
        "Strativo Academy — Risk Management Build 002 loaded."
    );

})();