/* =========================================================
   STRATIVO ACADEMY
   RISK MANAGEMENT LAB
   BUILD 003 — RISK-TO-REWARD RATIO
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
       RISK-TO-REWARD CALCULATOR
    ===================================================== */

    const riskInput =
        get("rm3Risk");

    const rewardInput =
        get("rm3Reward");

    const riskResult =
        get("rm3RiskResult");

    const rewardResult =
        get("rm3RewardResult");

    const ratioResult =
        get("rm3RatioResult");

    const formula =
        get("rm3Formula");


    function calculateRatio() {

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

            riskResult.textContent =
                "$0.00";

            rewardResult.textContent =
                "$0.00";

            ratioResult.textContent =
                "1 : 0";

            formula.textContent =
                "Enter valid values to calculate.";

            return;

        }


        const rewardMultiple =
            reward / risk;


        riskResult.textContent =
            `$${risk.toFixed(2)}`;


        rewardResult.textContent =
            `$${reward.toFixed(2)}`;


        ratioResult.textContent =
            `1 : ${rewardMultiple.toFixed(2)}`;


        formula.textContent =
            `Risk $${risk.toFixed(2)} → Reward $${reward.toFixed(2)} = 1 : ${rewardMultiple.toFixed(2)}`;

    }


    riskInput.addEventListener(
        "input",
        calculateRatio
    );


    rewardInput.addEventListener(
        "input",
        calculateRatio
    );



    /* =====================================================
       PRACTICE QUESTIONS
    ===================================================== */

    const practiceQuestions = [

        {
            topic: "RISK-TO-REWARD",

            risk: 10,

            reward: 20,

            answer: 2,

            explanation:
                "$20 ÷ $10 = 2. Therefore the risk-to-reward relationship is 1:2.",

            question:
                "You plan to risk $10 and your potential reward is $20. What is the reward multiple?"

        },


        {
            topic: "RISK-TO-REWARD",

            risk: 20,

            reward: 60,

            answer: 3,

            explanation:
                "$60 ÷ $20 = 3. Therefore the risk-to-reward relationship is 1:3.",

            question:
                "You plan to risk $20 and your potential reward is $60. What is the reward multiple?"

        },


        {
            topic: "RISK-TO-REWARD",

            risk: 25,

            reward: 50,

            answer: 2,

            explanation:
                "$50 ÷ $25 = 2. Therefore the risk-to-reward relationship is 1:2.",

            question:
                "You plan to risk $25 and your potential reward is $50. What is the reward multiple?"

        },


        {
            topic: "RISK-TO-REWARD",

            risk: 15,

            reward: 45,

            answer: 3,

            explanation:
                "$45 ÷ $15 = 3. Therefore the risk-to-reward relationship is 1:3.",

            question:
                "You plan to risk $15 and your potential reward is $45. What is the reward multiple?"

        },


        {
            topic: "RISK-TO-REWARD",

            risk: 30,

            reward: 75,

            answer: 2.5,

            explanation:
                "$75 ÷ $30 = 2.5. Therefore the risk-to-reward relationship is 1:2.5.",

            question:
                "You plan to risk $30 and your potential reward is $75. What is the reward multiple?"

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
        get("rm3PracticeNumber");

    const practiceBar =
        get("rm3PracticeBar");

    const practiceCard =
        get("rm3PracticeCard");

    const practiceBadge =
        get("rm3PracticeBadge");

    const practiceTopic =
        get("rm3PracticeTopic");

    const practiceQuestion =
        get("rm3PracticeQuestion");

    const practiceRisk =
        get("rm3PracticeRisk");

    const practiceReward =
        get("rm3PracticeReward");

    const practiceAnswer =
        get("rm3PracticeAnswer");

    const practiceCheck =
        get("rm3PracticeCheck");

    const practiceFeedback =
        get("rm3PracticeFeedback");

    const practiceFeedbackTitle =
        get("rm3PracticeFeedbackTitle");

    const practiceFeedbackText =
        get("rm3PracticeFeedbackText");

    const practiceNext =
        get("rm3PracticeNext");

    const practiceComplete =
        get("rm3PracticeComplete");

    const practiceScoreDisplay =
        get("rm3PracticeScore");


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
            `QUESTION ${String(
                practiceIndex + 1
            ).padStart(2, "0")} / ${practiceQuestions.length}`;


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


        practiceTopic.textContent =
            question.topic;


        practiceQuestion.textContent =
            question.question;


        practiceRisk.textContent =
            `$${question.risk}`;


        practiceReward.textContent =
            `$${question.reward}`;


        practiceAnswer.value =
            "";


        practiceAnswer.disabled =
            false;


        practiceCheck.disabled =
            false;


        practiceCheck.hidden =
            false;


        practiceFeedback.hidden =
            true;


        practiceFeedback.classList.remove(
            "incorrect"
        );


        practiceNext.hidden =
            true;


        practiceNext.classList.remove(
            "retry"
        );


        practiceNext.innerHTML =
            `Next Question <span>→</span>`;


        practiceCard.hidden =
            false;


        practiceComplete.hidden =
            true;

    }



    /* =====================================================
       SHOW PRACTICE FEEDBACK
    ===================================================== */

    function showPracticeFeedback(
        correct,
        title,
        message
    ) {

        practiceFeedback.hidden =
            false;


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

                "Check the risk and reward values and try this question again."

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
         * Wrong answer:
         * clear the answer and retry same question.
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
         * Correct answer:
         * move to next question.
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

        practiceCard.hidden =
            true;


        practiceComplete.hidden =
            false;


        practiceScoreDisplay.textContent =
            `You scored ${practiceScore} / ${practiceQuestions.length}.`;

    }


    /* =====================================================
       PRACTICE EVENTS
    ===================================================== */

    practiceCheck.addEventListener(
        "click",
        checkPracticeAnswer
    );


    practiceNext.addEventListener(
        "click",
        handlePracticeNext
    );


    practiceAnswer.addEventListener(

        "keydown",

        function (event) {

            if (
                event.key !== "Enter"
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



    /* =====================================================
       CHECKPOINT QUESTIONS
    ===================================================== */

    const checkpointQuestions = [

        {
            topic: "CALCULATION",

            question:
                "A trader risks $10 and targets a potential reward of $30. What is the risk-to-reward ratio?",

            options: [

                "1 : 1",

                "1 : 2",

                "1 : 3",

                "3 : 1"

            ],

            answer: 2,

            explanation:
                "$30 ÷ $10 = 3, so the relationship is 1:3."

        },


        {
            topic: "CALCULATION",

            question:
                "A trader risks $25 and targets $50 potential reward. What is the ratio?",

            options: [

                "1 : 1",

                "1 : 2",

                "1 : 3",

                "2 : 1"

            ],

            answer: 1,

            explanation:
                "$50 ÷ $25 = 2, giving a 1:2 relationship."

        },


        {
            topic: "CONCEPT",

            question:
                "Which statement correctly describes a 1:3 risk-to-reward ratio?",

            options: [

                "The trader risks three times the potential reward.",

                "The potential reward is three times the planned risk.",

                "The trader must win three trades.",

                "The trade is guaranteed to win."

            ],

            answer: 1,

            explanation:
                "A 1:3 relationship means the planned potential reward is three times the planned risk."

        },


        {
            topic: "CALCULATION",

            question:
                "A trader risks $40 and targets $80 potential reward. What reward multiple does the trade have?",

            options: [

                "1",

                "1.5",

                "2",

                "4"

            ],

            answer: 2,

            explanation:
                "$80 ÷ $40 = 2, so the trade has a 1:2 relationship."

        },


        {
            topic: "FINAL CHALLENGE",

            question:
                "A trader risks $20 for a potential reward of $60. What is the correct risk-to-reward ratio?",

            options: [

                "1 : 2",

                "1 : 3",

                "2 : 3",

                "3 : 1"

            ],

            answer: 1,

            explanation:
                "$60 ÷ $20 = 3, giving a 1:3 risk-to-reward relationship."

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
        get("rm3CheckpointNumber");

    const checkpointBar =
        get("rm3CheckpointBar");

    const checkpointCard =
        get("rm3CheckpointCard");

    const checkpointBadge =
        get("rm3CheckpointBadge");

    const checkpointTopic =
        get("rm3CheckpointTopic");

    const checkpointQuestion =
        get("rm3CheckpointQuestion");

    const checkpointOptions =
        get("rm3CheckpointOptions");

    const checkpointFeedback =
        get("rm3CheckpointFeedback");

    const checkpointFeedbackTitle =
        get("rm3CheckpointFeedbackTitle");

    const checkpointFeedbackText =
        get("rm3CheckpointFeedbackText");

    const checkpointNext =
        get("rm3CheckpointNext");

    const checkpointComplete =
        get("rm3CheckpointComplete");

    const checkpointResult =
        get("rm3CheckpointResult");

    const checkpointScoreDisplay =
        get("rm3CheckpointScore");


    /* =====================================================
       LOAD CHECKPOINT QUESTION
    ===================================================== */

    function loadCheckpointQuestion() {

        const question =
            checkpointQuestions[
                checkpointIndex
            ];


        checkpointAnswered =
            false;


        checkpointNumber.textContent =
            `QUESTION ${String(
                checkpointIndex + 1
            ).padStart(2, "0")} / ${checkpointQuestions.length}`;


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


        checkpointTopic.textContent =
            question.topic;


        checkpointQuestion.textContent =
            question.question;


        checkpointOptions.innerHTML =
            "";


        checkpointFeedback.hidden =
            true;


        checkpointFeedback.classList.remove(
            "incorrect"
        );


        checkpointNext.hidden =
            true;


        checkpointNext.classList.remove(
            "retry"
        );


        checkpointNext.innerHTML =
            `Next Question <span>→</span>`;


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
                    "rm3-option";


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


        checkpointCard.hidden =
            false;


        checkpointComplete.hidden =
            true;

    }



    /* =====================================================
       CHECKPOINT ANSWER
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
           Student MUST click Try Again first.
        ================================================= */

        if (
            selectedIndex !==
            question.answer
        ) {

            selectedButton.classList.add(
                "incorrect"
            );


            /* =================================================
               LOCK ALL ANSWER OPTIONS
            ================================================= */

            document
                .querySelectorAll(
                    ".rm3-option"
                )
                .forEach(

                    function (button) {

                        button.disabled =
                            true;

                    }

                );


            checkpointFeedback.hidden =
                false;


            checkpointFeedback.classList.add(
                "incorrect"
            );


            checkpointFeedbackTitle.textContent =
                "✗ Not quite.";


            checkpointFeedbackText.textContent =
                "Check this question carefully and try again. You must answer correctly before continuing.";


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


        checkpointFeedback.hidden =
            false;


        checkpointFeedback.classList.remove(
            "incorrect"
        );


        checkpointFeedbackTitle.textContent =
            "✓ Correct!";


        checkpointFeedbackText.textContent =
            question.explanation;


        /* =================================================
           LOCK ALL OPTIONS AFTER CORRECT ANSWER
        ================================================= */

        document
            .querySelectorAll(
                ".rm3-option"
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
         * Wrong answer:
         * stay on the same question.
         */

        if (!checkpointAnswered) {

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
                    ".rm3-option"
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


            return;

        }


        /*
         * Correct answer:
         * move to next question.
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

        checkpointCard.hidden =
            true;


        checkpointComplete.hidden =
            false;


        checkpointScoreDisplay.textContent =
            `You scored ${checkpointScore} / ${checkpointQuestions.length}.`;


        if (
            checkpointScore >= 4
        ) {

            checkpointResult.textContent =
                "🏆 Build 003 Complete";

        }

        else {

            checkpointResult.textContent =
                "📘 Review Required";

        }

    }



    /* =====================================================
       CHECKPOINT EVENT
    ===================================================== */

    checkpointNext.addEventListener(
        "click",
        handleCheckpointNext
    );



    /* =====================================================
       INITIALIZE
    ===================================================== */

    calculateRatio();

    loadPracticeQuestion();

    loadCheckpointQuestion();


    /* =====================================================
       BUILD STATUS
    ===================================================== */

    console.log(
        "Strativo Academy — Risk Management Build 003 loaded."
    );


})();