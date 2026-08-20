/* =========================================================
   STRATIVO ACADEMY
   RISK MANAGEMENT LAB
   BUILD 006
   RISK-REWARD RATIO
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
       01 — RISK-REWARD CALCULATOR
    ===================================================== */

    const riskInput =
        get("rm6Risk");

    const rewardInput =
        get("rm6Reward");

    const ratioInput =
        get("rm6Ratio");

    const riskResult =
        get("rm6RiskResult");

    const rewardResult =
        get("rm6RewardResult");

    const ratioResult =
        get("rm6RatioResult");

    const formulaLive =
        get("rm6FormulaLive");


    function calculateRatio() {

        if (
            !riskInput ||
            !rewardInput
        ) {
            return;
        }


        const risk =
            Number(riskInput.value);

        const reward =
            Number(rewardInput.value);


        if (
            !Number.isFinite(risk) ||
            !Number.isFinite(reward) ||
            risk <= 0 ||
            reward < 0
        ) {

            if (ratioInput) {
                ratioInput.value = "—";
            }

            if (riskResult) {
                riskResult.textContent = "$0.00";
            }

            if (rewardResult) {
                rewardResult.textContent = "$0.00";
            }

            if (ratioResult) {
                ratioResult.textContent = "—";
            }

            if (formulaLive) {
                formulaLive.textContent =
                    "Enter a valid planned risk and potential reward.";
            }

            return;
        }


        const multiple =
            reward / risk;


        const ratioText =
            `1 : ${multiple.toFixed(2)}`;


        if (ratioInput) {

            ratioInput.value =
                ratioText;

        }


        if (riskResult) {

            riskResult.textContent =
                `$${risk.toFixed(2)}`;

        }


        if (rewardResult) {

            rewardResult.textContent =
                `$${reward.toFixed(2)}`;

        }


        if (ratioResult) {

            ratioResult.textContent =
                ratioText;

        }


        /* =================================================
           FIXED FORMULA DISPLAY
        ================================================= */

        if (formulaLive) {

            formulaLive.textContent =
                `$${reward.toFixed(2)} ÷ $${risk.toFixed(2)} = ${multiple.toFixed(2)} reward multiple → ${ratioText}`;

        }

    }


    /* =====================================================
       CALCULATOR EVENTS
    ===================================================== */

    if (riskInput) {

        riskInput.addEventListener(
            "input",
            calculateRatio
        );

    }


    if (rewardInput) {

        rewardInput.addEventListener(
            "input",
            calculateRatio
        );

    }


    /* =====================================================
       02 — PRACTICE QUESTIONS
    ===================================================== */

    const practiceQuestions = [

        {
            topic: "R:R RATIO",

            risk: 10,

            reward: 20,

            answer: 2,

            question:
                "A trade has $10 of planned risk and $20 of potential reward. What is the reward multiple?",

            explanation:
                "$20 ÷ $10 = 2. The Risk-Reward Ratio is 1:2."
        },


        {
            topic: "R:R RATIO",

            risk: 10,

            reward: 30,

            answer: 3,

            question:
                "A trade has $10 of planned risk and $30 of potential reward. What is the reward multiple?",

            explanation:
                "$30 ÷ $10 = 3. The Risk-Reward Ratio is 1:3."
        },


        {
            topic: "R:R RATIO",

            risk: 20,

            reward: 40,

            answer: 2,

            question:
                "A trade has $20 of planned risk and $40 of potential reward. What is the reward multiple?",

            explanation:
                "$40 ÷ $20 = 2. The Risk-Reward Ratio is 1:2."
        },


        {
            topic: "R:R RATIO",

            risk: 25,

            reward: 75,

            answer: 3,

            question:
                "A trade has $25 of planned risk and $75 of potential reward. What is the reward multiple?",

            explanation:
                "$75 ÷ $25 = 3. The Risk-Reward Ratio is 1:3."
        },


        {
            topic: "R:R RATIO",

            risk: 50,

            reward: 100,

            answer: 2,

            question:
                "A trade has $50 of planned risk and $100 of potential reward. What is the reward multiple?",

            explanation:
                "$100 ÷ $50 = 2. The Risk-Reward Ratio is 1:2."
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
        get("rm6PracticeNumber");

    const practiceBar =
        get("rm6PracticeBar");

    const practiceCard =
        get("rm6PracticeCard");

    const practiceBadge =
        get("rm6PracticeBadge");

    const practiceTopic =
        get("rm6PracticeTopic");

    const practiceQuestion =
        get("rm6PracticeQuestion");

    const practiceRisk =
        get("rm6PracticeRisk");

    const practiceReward =
        get("rm6PracticeReward");

    const practiceAnswer =
        get("rm6PracticeAnswer");

    const practiceCheck =
        get("rm6PracticeCheck");

    const practiceFeedback =
        get("rm6PracticeFeedback");

    const practiceFeedbackTitle =
        get("rm6PracticeFeedbackTitle");

    const practiceFeedbackText =
        get("rm6PracticeFeedbackText");

    const practiceNext =
        get("rm6PracticeNext");

    const practiceComplete =
        get("rm6PracticeComplete");

    const practiceScoreDisplay =
        get("rm6PracticeScore");


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


        practiceAnswered =
            false;


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


        if (practiceReward) {

            practiceReward.textContent =
                `$${question.reward}`;

        }


        if (practiceAnswer) {

            practiceAnswer.value =
                "";

            practiceAnswer.disabled =
                false;

        }


        if (practiceCheck) {

            practiceCheck.disabled =
                false;

            practiceCheck.hidden =
                false;

        }


        if (practiceFeedback) {

            practiceFeedback.hidden =
                true;

            practiceFeedback.classList.remove(
                "incorrect"
            );

        }


        if (practiceNext) {

            practiceNext.hidden =
                true;

            practiceNext.classList.remove(
                "retry"
            );

            practiceNext.innerHTML =
                `Next Question <span>→</span>`;

        }


        if (practiceCard) {

            practiceCard.hidden =
                false;

        }


        if (practiceComplete) {

            practiceComplete.hidden =
                true;

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


        practiceFeedback.hidden =
            false;


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


        if (
            !Number.isFinite(userAnswer)
        ) {

            showPracticeFeedback(

                false,

                "Enter an answer.",

                "Enter the reward multiple before checking."

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

                "Divide the potential reward by the planned risk, then try the same question again."

            );


            if (practiceNext) {

                practiceNext.hidden =
                    false;

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

        practiceAnswered =
            true;


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
         * retry same question.
         */

        if (!practiceAnswered) {

            if (practiceAnswer) {

                practiceAnswer.value =
                    "";

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

                if (
                    event.key !==
                    "Enter"
                ) {

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
            topic: "R:R BASICS",

            question:
                "What does a 1:2 Risk-Reward Ratio mean?",

            options: [

                "The potential reward is two times the planned risk.",

                "The planned risk is two times the reward.",

                "The trade has a guaranteed 2% profit.",

                "The trade must win twice."

            ],

            answer: 0,

            explanation:
                "A 1:2 ratio means the potential reward is two times the amount planned at risk."
        },


        {
            topic: "CALCULATION",

            question:
                "A trade has $20 of planned risk and $60 of potential reward. What is the Risk-Reward Ratio?",

            options: [

                "1:1",

                "1:2",

                "1:3",

                "1:4"

            ],

            answer: 2,

            explanation:
                "$60 ÷ $20 = 3, so the ratio is 1:3."
        },


        {
            topic: "CONCEPT",

            question:
                "Does a higher Risk-Reward Ratio guarantee that a trade will win?",

            options: [

                "Yes, always.",

                "No. A ratio describes risk versus potential reward but does not guarantee the outcome.",

                "Yes, if the ratio is above 1:2.",

                "Only during the London session."

            ],

            answer: 1,

            explanation:
                "Risk-Reward Ratio describes the relationship between planned risk and potential reward. It does not guarantee the trade outcome."
        },


        {
            topic: "CALCULATION",

            question:
                "A trade has $25 of planned risk and $50 of potential reward. What is the Risk-Reward Ratio?",

            options: [

                "1:1",

                "1:2",

                "1:3",

                "1:4"

            ],

            answer: 1,

            explanation:
                "$50 ÷ $25 = 2, so the ratio is 1:2."
        },


        {
            topic: "FINAL CHALLENGE",

            question:
                "A trade has $40 of planned risk and $120 of potential reward. What is the Risk-Reward Ratio?",

            options: [

                "1:1",

                "1:2",

                "1:3",

                "1:4"

            ],

            answer: 2,

            explanation:
                "$120 ÷ $40 = 3, so the ratio is 1:3."
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
        get("rm6CheckpointNumber");

    const checkpointBar =
        get("rm6CheckpointBar");

    const checkpointCard =
        get("rm6CheckpointCard");

    const checkpointBadge =
        get("rm6CheckpointBadge");

    const checkpointTopic =
        get("rm6CheckpointTopic");

    const checkpointQuestion =
        get("rm6CheckpointQuestion");

    const checkpointOptions =
        get("rm6CheckpointOptions");

    const checkpointFeedback =
        get("rm6CheckpointFeedback");

    const checkpointFeedbackTitle =
        get("rm6CheckpointFeedbackTitle");

    const checkpointFeedbackText =
        get("rm6CheckpointFeedbackText");

    const checkpointNext =
        get("rm6CheckpointNext");

    const checkpointComplete =
        get("rm6CheckpointComplete");

    const checkpointResult =
        get("rm6CheckpointResult");

    const checkpointScoreDisplay =
        get("rm6CheckpointScore");


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


        if (checkpointQuestion) {

            checkpointQuestion.textContent =
                question.question;

        }


        if (!checkpointOptions) {

            return;

        }


        checkpointOptions.innerHTML =
            "";


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


        /* =================================================
           CREATE ANSWER BUTTONS
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
                    "rm6-option";


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

            checkpointCard.hidden =
                false;

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

           FIX:
           LOCK ALL OPTIONS AFTER WRONG ANSWER.
           
           Student must press Try Again before
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
               LOCK ALL ANSWER BUTTONS
            ================================================= */

            if (checkpointOptions) {

                checkpointOptions
                    .querySelectorAll(
                        ".rm6-option"
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

                "That answer is incorrect. Review the question and try again."

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

        if (checkpointOptions) {

            checkpointOptions
                .querySelectorAll(
                    ".rm6-option"
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
         * Unlock the same question.
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
                        ".rm6-option"
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
                    "🏆 Build 006 Complete";

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
       INITIALIZE BUILD 006
    ===================================================== */

    calculateRatio();

    loadPracticeQuestion();

    loadCheckpointQuestion();


    /* =====================================================
       BUILD STATUS
    ===================================================== */

    console.log(
        "Strativo Academy — Risk Management Build 006 loaded successfully."
    );


})();