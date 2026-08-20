/* =========================================================
   STRATIVO ACADEMY
   RISK MANAGEMENT LAB
   BUILD 008
   DRAWDOWN & LOSS RECOVERY
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       WAIT UNTIL HTML IS READY
    ===================================================== */

    document.addEventListener("DOMContentLoaded", function () {


        /* =================================================
           HELPER
        ================================================= */

        function get(id) {
            return document.getElementById(id);
        }


        /* =================================================
           01 — DRAWDOWN & RECOVERY CALCULATOR
        ================================================= */

        const peakInput =
            get("rm8Peak");

        const currentInput =
            get("rm8Current");

        const drawdownInput =
            get("rm8Drawdown");

        const lossResult =
            get("rm8LossResult");

        const drawdownResult =
            get("rm8DrawdownResult");

        const recoveryResult =
            get("rm8RecoveryResult");

        const formulaLive =
            get("rm8FormulaLive");


        function calculateDrawdown() {

            if (
                !peakInput ||
                !currentInput
            ) {
                return;
            }


            const peak =
                Number(peakInput.value);

            const current =
                Number(currentInput.value);


            if (
                !Number.isFinite(peak) ||
                !Number.isFinite(current) ||
                peak <= 0 ||
                current < 0 ||
                current > peak
            ) {

                if (drawdownInput) {
                    drawdownInput.value = "—";
                }

                if (lossResult) {
                    lossResult.textContent = "$0.00";
                }

                if (drawdownResult) {
                    drawdownResult.textContent = "—";
                }

                if (recoveryResult) {
                    recoveryResult.textContent = "—";
                }

                if (formulaLive) {
                    formulaLive.textContent =
                        "Enter a valid peak and a current value at or below the peak.";
                }

                return;
            }


            const loss =
                peak - current;


            const drawdown =
                (loss / peak) * 100;


            let recovery = 0;


            if (current > 0) {

                recovery =
                    (loss / current) * 100;

            }


            if (drawdownInput) {

                drawdownInput.value =
                    `${drawdown.toFixed(2)}%`;

            }


            if (lossResult) {

                lossResult.textContent =
                    `$${loss.toFixed(2)}`;

            }


            if (drawdownResult) {

                drawdownResult.textContent =
                    `${drawdown.toFixed(2)}%`;

            }


            if (recoveryResult) {

                recoveryResult.textContent =
                    `${recovery.toFixed(2)}%`;

            }


            if (formulaLive) {

                formulaLive.textContent =
                    `Loss = $${loss.toFixed(2)} • Drawdown = ${drawdown.toFixed(2)}% • Recovery needed = ${recovery.toFixed(2)}%`;

            }

        }


        /* =================================================
           CALCULATOR EVENTS
        ================================================= */

        if (peakInput) {

            peakInput.addEventListener(
                "input",
                calculateDrawdown
            );

        }


        if (currentInput) {

            currentInput.addEventListener(
                "input",
                calculateDrawdown
            );

        }


        /* =================================================
           02 — PRACTICE QUESTIONS
        ================================================= */

        const practiceQuestions = [

            {
                topic: "RECOVERY",

                peak: 1000,

                current: 900,

                answer: 11.11,

                question:
                    "An account falls from a $1,000 peak to $900. What percentage gain is approximately required to recover back to $1,000?",

                explanation:
                    "The loss is $100. $100 ÷ $900 × 100 = approximately 11.11% recovery required."
            },


            {
                topic: "RECOVERY",

                peak: 1000,

                current: 800,

                answer: 25,

                question:
                    "An account falls from a $1,000 peak to $800. What percentage gain is required to recover back to $1,000?",

                explanation:
                    "The loss is $200. $200 ÷ $800 × 100 = 25% recovery required."
            },


            {
                topic: "RECOVERY",

                peak: 2000,

                current: 1800,

                answer: 11.11,

                question:
                    "An account falls from a $2,000 peak to $1,800. What percentage gain is approximately required to recover?",

                explanation:
                    "The loss is $200. $200 ÷ $1,800 × 100 = approximately 11.11%."
            },


            {
                topic: "RECOVERY",

                peak: 5000,

                current: 4500,

                answer: 11.11,

                question:
                    "An account falls from a $5,000 peak to $4,500. What percentage gain is approximately required to recover?",

                explanation:
                    "The loss is $500. $500 ÷ $4,500 × 100 = approximately 11.11%."
            },


            {
                topic: "RECOVERY",

                peak: 1000,

                current: 750,

                answer: 33.33,

                question:
                    "An account falls from a $1,000 peak to $750. What percentage gain is approximately required to recover?",

                explanation:
                    "The loss is $250. $250 ÷ $750 × 100 = approximately 33.33%."
            }

        ];


        /* =================================================
           PRACTICE STATE
        ================================================= */

        let practiceIndex = 0;

        let practiceScore = 0;

        let practiceAnswered = false;


        /* =================================================
           PRACTICE ELEMENTS
        ================================================= */

        const practiceNumber =
            get("rm8PracticeNumber");

        const practiceBar =
            get("rm8PracticeBar");

        const practiceCard =
            get("rm8PracticeCard");

        const practiceBadge =
            get("rm8PracticeBadge");

        const practiceTopic =
            get("rm8PracticeTopic");

        const practiceQuestion =
            get("rm8PracticeQuestion");

        const practicePeak =
            get("rm8PracticePeak");

        const practiceCurrent =
            get("rm8PracticeCurrent");

        const practiceAnswer =
            get("rm8PracticeAnswer");

        const practiceCheck =
            get("rm8PracticeCheck");

        const practiceFeedback =
            get("rm8PracticeFeedback");

        const practiceFeedbackTitle =
            get("rm8PracticeFeedbackTitle");

        const practiceFeedbackText =
            get("rm8PracticeFeedbackText");

        const practiceNext =
            get("rm8PracticeNext");

        const practiceComplete =
            get("rm8PracticeComplete");

        const practiceScoreDisplay =
            get("rm8PracticeScore");


        /* =================================================
           LOAD PRACTICE QUESTION
        ================================================= */

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


            if (practiceQuestion) {

                practiceQuestion.textContent =
                    question.question;

            }


            if (practicePeak) {

                practicePeak.textContent =
                    `$${question.peak.toLocaleString()}`;

            }


            if (practiceCurrent) {

                practiceCurrent.textContent =
                    `$${question.current.toLocaleString()}`;

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


        /* =================================================
           PRACTICE FEEDBACK
        ================================================= */

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


        /* =================================================
           CHECK PRACTICE ANSWER
        ================================================= */

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

                    "Enter the recovery percentage before checking."

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
                ) <= 0.05;


            /* =============================================
               WRONG ANSWER
            ============================================= */

            if (!isCorrect) {

                showPracticeFeedback(

                    false,

                    "✗ Not quite.",

                    "Remember: recovery percentage is calculated from the current account value. Try the same question again."

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


            /* =============================================
               CORRECT ANSWER
            ============================================= */

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


        /* =================================================
           PRACTICE NEXT / RETRY
        ================================================= */

        function handlePracticeNext() {

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


            if (
                practiceIndex <
                practiceQuestions.length - 1
            ) {

                practiceIndex++;

                loadPracticeQuestion();

                return;

            }


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


        /* =================================================
           PRACTICE EVENTS
        ================================================= */

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


        /* =================================================
           03 — CHECKPOINT QUESTIONS
        ================================================= */

        const checkpointQuestions = [

            {
                topic: "DRAWDOWN",

                question:
                    "An account falls from a $1,000 peak to $900. What is the drawdown percentage?",

                options: [
                    "5%",
                    "10%",
                    "11.11%",
                    "20%"
                ],

                answer: 1,

                explanation:
                    "($1,000 − $900) ÷ $1,000 × 100 = 10% drawdown."
            },


            {
                topic: "RECOVERY",

                question:
                    "After a 20% loss, approximately what gain is required to recover the account to its previous value?",

                options: [
                    "20%",
                    "22.5%",
                    "25%",
                    "40%"
                ],

                answer: 2,

                explanation:
                    "After losing 20%, only 80% of the original capital remains. A 25% gain on 80% returns the account to 100%."
            },


            {
                topic: "CONCEPT",

                question:
                    "Why is the recovery percentage larger than the original loss percentage?",

                options: [
                    "Because the remaining account value is smaller after the loss.",
                    "Because brokers increase the account balance.",
                    "Because every loss automatically doubles.",
                    "Because drawdown is always calculated incorrectly."
                ],

                answer: 0,

                explanation:
                    "The recovery gain is calculated from the reduced current account value, not the original peak."
            },


            {
                topic: "DRAWDOWN",

                question:
                    "An account falls from $2,000 to $1,600. What is the drawdown percentage?",

                options: [
                    "10%",
                    "15%",
                    "20%",
                    "25%"
                ],

                answer: 2,

                explanation:
                    "The loss is $400. $400 ÷ $2,000 × 100 = 20% drawdown."
            },


            {
                topic: "FINAL CHALLENGE",

                question:
                    "An account falls from $1,000 to $750. Approximately what percentage gain is needed to recover to $1,000?",

                options: [
                    "25%",
                    "30%",
                    "33.33%",
                    "40%"
                ],

                answer: 2,

                explanation:
                    "The loss is $250. $250 ÷ $750 × 100 = approximately 33.33% recovery required."
            }

        ];


        /* =================================================
           CHECKPOINT STATE
        ================================================= */

        let checkpointIndex = 0;

        let checkpointScore = 0;

        let checkpointAnswered = false;


        /* =================================================
           CHECKPOINT ELEMENTS
        ================================================= */

        const checkpointNumber =
            get("rm8CheckpointNumber");

        const checkpointBar =
            get("rm8CheckpointBar");

        const checkpointCard =
            get("rm8CheckpointCard");

        const checkpointBadge =
            get("rm8CheckpointBadge");

        const checkpointTopic =
            get("rm8CheckpointTopic");

        const checkpointQuestion =
            get("rm8CheckpointQuestion");

        const checkpointOptions =
            get("rm8CheckpointOptions");

        const checkpointFeedback =
            get("rm8CheckpointFeedback");

        const checkpointFeedbackTitle =
            get("rm8CheckpointFeedbackTitle");

        const checkpointFeedbackText =
            get("rm8CheckpointFeedbackText");

        const checkpointNext =
            get("rm8CheckpointNext");

        const checkpointComplete =
            get("rm8CheckpointComplete");

        const checkpointResult =
            get("rm8CheckpointResult");

        const checkpointScoreDisplay =
            get("rm8CheckpointScore");


        /* =================================================
           LOAD CHECKPOINT QUESTION
        ================================================= */

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

                console.error(
                    "Build 008: rm8CheckpointOptions not found."
                );

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


            /* =============================================
               CREATE OPTIONS
            ============================================= */

            question.options.forEach(
                function (option, index) {

                    const button =
                        document.createElement(
                            "button"
                        );


                    button.type = "button";

                    button.className =
                        "rm8-option";


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


        /* =================================================
           CHECKPOINT FEEDBACK
        ================================================= */

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


        /* =================================================
           CHECK CHECKPOINT ANSWER
        ================================================= */

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


            /* =============================================
               WRONG ANSWER
            ============================================= */

            if (
                selectedIndex !==
                question.answer
            ) {

                if (selectedButton) {

                    selectedButton.classList.add(
                        "incorrect"
                    );

                }


                /*
                 * IMPORTANT FIX:
                 * LOCK EVERY OPTION AFTER WRONG ANSWER.
                 */

                checkpointOptions
                    .querySelectorAll(
                        ".rm8-option"
                    )
                    .forEach(
                        function (button) {

                            button.disabled = true;

                        }
                    );


                showCheckpointFeedback(

                    false,

                    "✗ Not quite.",

                    "That answer is incorrect. Review the concept and try the question again."

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


            /* =============================================
               CORRECT ANSWER
            ============================================= */

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


            /*
             * LOCK EVERY OPTION AFTER CORRECT ANSWER.
             */

            checkpointOptions
                .querySelectorAll(
                    ".rm8-option"
                )
                .forEach(
                    function (button) {

                        button.disabled = true;

                    }
                );


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


        /* =================================================
           CHECKPOINT NEXT / RETRY
        ================================================= */

        function handleCheckpointNext() {

            /*
             * WRONG ANSWER:
             * UNLOCK SAME QUESTION.
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


                checkpointOptions
                    .querySelectorAll(
                        ".rm8-option"
                    )
                    .forEach(
                        function (button) {

                            button.disabled = false;

                            button.classList.remove(
                                "incorrect"
                            );

                        }
                    );


                return;

            }


            /*
             * CORRECT ANSWER:
             * MOVE TO NEXT QUESTION.
             */

            if (
                checkpointIndex <
                checkpointQuestions.length - 1
            ) {

                checkpointIndex++;

                loadCheckpointQuestion();

                return;

            }


            /* =============================================
               CHECKPOINT COMPLETE
            ============================================= */

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
                        "🏆 Build 008 Complete";

                }

                else {

                    checkpointResult.textContent =
                        "📘 Review Required";

                }

            }

        }


        /* =================================================
           CHECKPOINT EVENT
        ================================================= */

        if (checkpointNext) {

            checkpointNext.addEventListener(
                "click",
                handleCheckpointNext
            );

        }


        /* =================================================
           INITIALIZE BUILD 008
        ================================================= */

        calculateDrawdown();

        loadPracticeQuestion();

        loadCheckpointQuestion();


        /* =================================================
           DEBUG
        ================================================= */

        console.log(
            "========================================"
        );

        console.log(
            "Strativo Academy — Risk Management Build 008"
        );

        console.log(
            "Build 008 JavaScript loaded successfully."
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
            "========================================"
        );

    });

})();