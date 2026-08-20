/* =========================================================
   STRATIVO ACADEMY
   RISK MANAGEMENT LAB
   BUILD 004
   STOP LOSS & POSITION SIZE
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
       
       Simplified educational formula:
       Position Size = Planned Risk ÷ Stop Loss Distance
    ===================================================== */

    const riskInput = get("rm4Risk");
    const distanceInput = get("rm4Distance");
    const positionSizeInput = get("rm4PositionSize");

    const riskResult = get("rm4RiskResult");
    const distanceResult = get("rm4DistanceResult");
    const sizeResult = get("rm4SizeResult");
    const formula = get("rm4Formula");


    function calculatePositionSize() {

        if (
            !riskInput ||
            !distanceInput
        ) {
            return;
        }


        const risk = Number(riskInput.value);
        const distance = Number(distanceInput.value);


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
                distanceResult.textContent = "0.00";
            }

            if (sizeResult) {
                sizeResult.textContent = "—";
            }

            if (formula) {
                formula.textContent =
                    "Enter a valid risk amount and Stop Loss distance.";
            }

            return;
        }


        const positionSize = risk / distance;


        if (positionSizeInput) {

            positionSizeInput.value =
                positionSize.toFixed(2);

        }


        if (riskResult) {

            riskResult.textContent =
                `$${risk.toFixed(2)}`;

        }


        if (distanceResult) {

            distanceResult.textContent =
                distance.toFixed(2);

        }


        if (sizeResult) {

            sizeResult.textContent =
                positionSize.toFixed(2);

        }


        if (formula) {

            formula.textContent =
                `$${risk.toFixed(2)} ÷ ${distance.toFixed(2)} = ${positionSize.toFixed(2)} position-size units`;

        }

    }


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

            risk: 20,

            distance: 5,

            answer: 4,

            question:
                "A trader plans to risk $20 and has a Stop Loss distance of 5 units. What is the simplified position size?",

            explanation:
                "$20 ÷ 5 = 4. The simplified position size is 4 units."
        },


        {
            topic: "POSITION SIZE",

            risk: 30,

            distance: 10,

            answer: 3,

            question:
                "A trader plans to risk $30 and has a Stop Loss distance of 10 units. What is the simplified position size?",

            explanation:
                "$30 ÷ 10 = 3. The simplified position size is 3 units."
        },


        {
            topic: "POSITION SIZE",

            risk: 50,

            distance: 5,

            answer: 10,

            question:
                "A trader plans to risk $50 and has a Stop Loss distance of 5 units. What is the simplified position size?",

            explanation:
                "$50 ÷ 5 = 10. The simplified position size is 10 units."
        },


        {
            topic: "POSITION SIZE",

            risk: 24,

            distance: 6,

            answer: 4,

            question:
                "A trader plans to risk $24 and has a Stop Loss distance of 6 units. What is the simplified position size?",

            explanation:
                "$24 ÷ 6 = 4. The simplified position size is 4 units."
        },


        {
            topic: "POSITION SIZE",

            risk: 45,

            distance: 9,

            answer: 5,

            question:
                "A trader plans to risk $45 and has a Stop Loss distance of 9 units. What is the simplified position size?",

            explanation:
                "$45 ÷ 9 = 5. The simplified position size is 5 units."
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
        get("rm4PracticeNumber");

    const practiceBar =
        get("rm4PracticeBar");

    const practiceCard =
        get("rm4PracticeCard");

    const practiceBadge =
        get("rm4PracticeBadge");

    const practiceTopic =
        get("rm4PracticeTopic");

    const practiceQuestion =
        get("rm4PracticeQuestion");

    const practiceRisk =
        get("rm4PracticeRisk");

    const practiceDistance =
        get("rm4PracticeDistance");

    const practiceAnswer =
        get("rm4PracticeAnswer");

    const practiceCheck =
        get("rm4PracticeCheck");

    const practiceFeedback =
        get("rm4PracticeFeedback");

    const practiceFeedbackTitle =
        get("rm4PracticeFeedbackTitle");

    const practiceFeedbackText =
        get("rm4PracticeFeedbackText");

    const practiceNext =
        get("rm4PracticeNext");

    const practiceComplete =
        get("rm4PracticeComplete");

    const practiceScoreDisplay =
        get("rm4PracticeScore");


    /* =====================================================
       LOAD PRACTICE QUESTION
    ===================================================== */

    function loadPracticeQuestion() {

        const question =
            practiceQuestions[practiceIndex];


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
                question.distance;

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


        if (
            !Number.isFinite(userAnswer)
        ) {

            showPracticeFeedback(

                false,

                "Enter an answer.",

                "Enter your calculated position size before checking."

            );

            return;

        }


        const question =
            practiceQuestions[practiceIndex];


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

                "Review the risk amount and Stop Loss distance, then try the same question again."

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
         * stay on the same question.
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
         * go to next question.
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

    }



    /* =====================================================
       03 — CHECKPOINT QUESTIONS
    ===================================================== */

    const checkpointQuestions = [

        {
            topic: "STOP LOSS",

            question:
                "What is the main purpose of a Stop Loss in a trading plan?",

            options: [

                "To guarantee that the trade will win.",

                "To define a planned exit if the trade idea is invalidated.",

                "To increase position size automatically.",

                "To guarantee a fixed profit."

            ],

            answer: 1,

            explanation:
                "A Stop Loss defines a planned exit level if the trade moves against the trade idea."

        },


        {
            topic: "POSITION SIZE",

            question:
                "If planned risk stays the same and the Stop Loss distance becomes wider, what generally happens to the position size?",

            options: [

                "It generally becomes smaller.",

                "It always becomes larger.",

                "It becomes zero.",

                "It guarantees a larger profit."

            ],

            answer: 0,

            explanation:
                "With the simplified formula, a larger Stop Loss distance requires a smaller position size when planned risk remains unchanged."

        },


        {
            topic: "CALCULATION",

            question:
                "A trader plans to risk $30 with a Stop Loss distance of 6 units. What is the simplified position size?",

            options: [

                "3 units.",

                "4 units.",

                "5 units.",

                "6 units."

            ],

            answer: 2,

            explanation:
                "$30 ÷ 6 = 5. The simplified position size is 5 units."

        },


        {
            topic: "RISK CONTROL",

            question:
                "Why should Stop Loss placement be connected to the trade setup?",

            options: [

                "Because it helps define where the trade idea is invalidated.",

                "Because every Stop Loss must have the same distance.",

                "Because a Stop Loss guarantees no losing trades.",

                "Because it automatically predicts market direction."

            ],

            answer: 0,

            explanation:
                "Stop Loss placement should relate to the trade setup and the point where the original trade idea is considered invalid."

        },


        {
            topic: "CALCULATION",

            question:
                "A trader plans to risk $40 and uses a Stop Loss distance of 8 units. What is the simplified position size?",

            options: [

                "4 units.",

                "5 units.",

                "8 units.",

                "10 units."

            ],

            answer: 1,

            explanation:
                "$40 ÷ 8 = 5. The simplified position size is 5 units."

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
        get("rm4CheckpointNumber");

    const checkpointBar =
        get("rm4CheckpointBar");

    const checkpointCard =
        get("rm4CheckpointCard");

    const checkpointBadge =
        get("rm4CheckpointBadge");

    const checkpointTopic =
        get("rm4CheckpointTopic");

    const checkpointQuestion =
        get("rm4CheckpointQuestion");

    const checkpointOptions =
        get("rm4CheckpointOptions");

    const checkpointFeedback =
        get("rm4CheckpointFeedback");

    const checkpointFeedbackTitle =
        get("rm4CheckpointFeedbackTitle");

    const checkpointFeedbackText =
        get("rm4CheckpointFeedbackText");

    const checkpointNext =
        get("rm4CheckpointNext");

    const checkpointComplete =
        get("rm4CheckpointComplete");

    const checkpointResult =
        get("rm4CheckpointResult");

    const checkpointScoreDisplay =
        get("rm4CheckpointScore");


    /* =====================================================
       LOAD CHECKPOINT QUESTION
    ===================================================== */

    function loadCheckpointQuestion() {

        const question =
            checkpointQuestions[
                checkpointIndex
            ];


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
                    "rm4-option";


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
           Lock ALL options after a wrong answer.
           Student must click Try Again first.
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
               LOCK ALL OPTIONS
            ================================================= */

            if (checkpointOptions) {

                checkpointOptions
                    .querySelectorAll(
                        ".rm4-option"
                    )
                    .forEach(
                        function (button) {

                            button.disabled = true;

                        }
                    );

            }


            showCheckpointFeedback(

                false,

                "✗ Not quite.",

                "That answer is not correct. Review the question and try again."

            );


            if (checkpointNext) {

                checkpointNext.hidden = false;

                checkpointNext.classList.add(
                    "retry"
                );

                checkpointNext.innerHTML =
                    `Try Again <span>↻</span>`;

            }


            return;

        }


        /* =================================================
           CORRECT
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
                    ".rm4-option"
                )
                .forEach(
                    function (button) {

                        button.disabled = true;

                    }
                );

        }


        if (checkpointNext) {

            checkpointNext.hidden = false;

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
       CHECKPOINT NEXT / RETRY
    ===================================================== */

    function handleCheckpointNext() {

        /*
         * Wrong answer:
         * reset the current question.
         */

        if (!checkpointAnswered) {

            if (checkpointFeedback) {

                checkpointFeedback.hidden = true;

            }


            if (checkpointNext) {

                checkpointNext.hidden = true;

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
                        ".rm4-option"
                    )
                    .forEach(
                        function (button) {

                            button.disabled = false;

                            button.classList.remove(
                                "incorrect"
                            );

                        }
                    );

            }


            return;

        }


        /*
         * Correct answer:
         * move forward.
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
           COMPLETE
        ================================================= */

        if (checkpointCard) {

            checkpointCard.hidden = true;

        }


        if (checkpointComplete) {

            checkpointComplete.hidden = false;

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
                    "🏆 Build 004 Complete";

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
       INITIALIZE
    ===================================================== */

    calculatePositionSize();

    loadPracticeQuestion();

    loadCheckpointQuestion();


    /* =====================================================
       BUILD STATUS
    ===================================================== */

    console.log(
        "Strativo Academy — Risk Management Build 004 loaded successfully."
    );


})();