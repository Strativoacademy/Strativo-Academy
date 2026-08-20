/* =========================================================
   STRATIVO ACADEMY
   RISK MANAGEMENT LAB
   BUILD 001
   RISK CALCULATOR + PRACTICE ENGINE
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CALCULATOR ELEMENTS
    ===================================================== */

    const accountBalanceInput =
        document.getElementById("accountBalance");

    const riskPercentInput =
        document.getElementById("riskPercent");

    const riskAmountResult =
        document.getElementById("riskAmountResult");


    /* =====================================================
       PRACTICE ELEMENTS
    ===================================================== */

    const practiceQuestionNumber =
        document.getElementById("practiceQuestionNumber");

    const practiceProgressBar =
        document.getElementById("practiceProgressBar");

    const practiceCard =
        document.getElementById("practiceCard");

    const practiceQuestion =
        document.getElementById("practiceQuestion");

    const practiceBalance =
        document.getElementById("practiceBalance");

    const practiceRisk =
        document.getElementById("practiceRisk");

    const practiceAnswerInput =
        document.getElementById("practiceAnswer");

    const checkPracticeButton =
        document.getElementById("checkPracticeButton");

    const practiceFeedback =
        document.getElementById("practiceFeedback");

    const practiceFeedbackIcon =
        document.getElementById("practiceFeedbackIcon");

    const practiceFeedbackTitle =
        document.getElementById("practiceFeedbackTitle");

    const practiceFeedbackText =
        document.getElementById("practiceFeedbackText");

    const practiceNextButton =
        document.getElementById("practiceNextButton");

    const practiceScore =
        document.getElementById("practiceScore");

    const practiceScoreText =
        document.getElementById("practiceScoreText");

    const practiceScoreMessage =
        document.getElementById("practiceScoreMessage");


    /* =====================================================
       FORMAT MONEY
    ===================================================== */

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


    /* =====================================================
       CALCULATOR
    ===================================================== */

    function calculateRisk() {

        if (
            !accountBalanceInput ||
            !riskPercentInput ||
            !riskAmountResult
        ) {
            return;
        }


        const accountBalance =
            Number(
                accountBalanceInput.value
            );


        const riskPercent =
            Number(
                riskPercentInput.value
            );


        if (
            !Number.isFinite(accountBalance) ||
            !Number.isFinite(riskPercent) ||
            accountBalance < 0 ||
            riskPercent < 0
        ) {

            riskAmountResult.textContent =
                "$0.00";

            return;

        }


        const riskAmount =
            accountBalance *
            (
                riskPercent / 100
            );


        riskAmountResult.textContent =
            formatMoney(riskAmount);

    }


    if (accountBalanceInput) {

        accountBalanceInput.addEventListener(
            "input",
            calculateRisk
        );

    }


    if (riskPercentInput) {

        riskPercentInput.addEventListener(
            "input",
            calculateRisk
        );

    }


    /* =====================================================
       PRACTICE QUESTIONS
    ===================================================== */

    const practiceQuestions = [

        {
            number: 1,

            topic: "RISK AMOUNT",

            question:
                "A trader has a $1,000 account and plans to risk 1% on a trade. How much is the planned risk amount?",

            balance: 1000,

            risk: 1,

            answer: 10,

            explanation:
                "1% of $1,000 is $10. The planned risk amount is therefore $10."
        },


        {
            number: 2,

            topic: "RISK AMOUNT",

            question:
                "A trader has a $2,500 account and plans to risk 2% on a trade. How much is the planned risk amount?",

            balance: 2500,

            risk: 2,

            answer: 50,

            explanation:
                "2% of $2,500 is $50. The planned risk amount is therefore $50."
        },


        {
            number: 3,

            topic: "DECIMAL RISK",

            question:
                "A trader has a $5,000 account and plans to risk 0.5% on a trade. How much is the planned risk amount?",

            balance: 5000,

            risk: 0.5,

            answer: 25,

            explanation:
                "0.5% of $5,000 is $25. The planned risk amount is therefore $25."
        },


        {
            number: 4,

            topic: "CONCEPT",

            question:
                "Two traders both have $1,000 accounts. Trader A plans to risk 1%, while Trader B plans to risk 5%. Who has the larger planned risk amount?",

            balance: 1000,

            risk: 5,

            answer: 50,

            explanation:
                "Trader B has the larger planned risk because 5% of $1,000 is $50, while 1% is only $10."
        },


        {
            number: 5,

            topic: "FINAL CHALLENGE",

            question:
                "A trader has a $3,000 account and plans to risk 1.5% on a trade. How much is the planned risk amount?",

            balance: 3000,

            risk: 1.5,

            answer: 45,

            explanation:
                "1.5% of $3,000 is $45. The planned risk amount is therefore $45."
        }

    ];


    /* =====================================================
       PRACTICE STATE
    ===================================================== */

    let currentQuestionIndex = 0;

    let practiceScoreValue = 0;

    let questionAnswered = false;


    /* =====================================================
       LOAD PRACTICE QUESTION
    ===================================================== */

    function loadPracticeQuestion() {

        const question =
            practiceQuestions[
                currentQuestionIndex
            ];


        questionAnswered =
            false;


        if (practiceQuestionNumber) {

            practiceQuestionNumber.textContent =
                `${question.number} / ${practiceQuestions.length}`;

        }


        if (practiceProgressBar) {

            const progress =
                (
                    question.number /
                    practiceQuestions.length
                ) * 100;


            practiceProgressBar.style.width =
                `${progress}%`;

        }


        const badge =
            document.querySelector(
                ".risk-practice-badge"
            );


        if (badge) {

            badge.textContent =
                `QUESTION ${String(
                    question.number
                ).padStart(2, "0")}`;

        }


        const topic =
            document.querySelector(
                ".risk-practice-topic"
            );


        if (topic) {

            topic.textContent =
                question.topic;

        }


        if (practiceQuestion) {

            practiceQuestion.textContent =
                question.question;

        }


        if (practiceBalance) {

            practiceBalance.textContent =
                formatMoney(
                    question.balance
                );

        }


        if (practiceRisk) {

            practiceRisk.textContent =
                `${question.risk}%`;

        }


        if (practiceAnswerInput) {

            practiceAnswerInput.value =
                "";

            practiceAnswerInput.disabled =
                false;

        }


        if (practiceFeedback) {

            practiceFeedback.hidden =
                true;

            practiceFeedback.classList.remove(
                "correct",
                "incorrect"
            );

        }


        if (checkPracticeButton) {

            checkPracticeButton.hidden =
                false;

            checkPracticeButton.disabled =
                false;

            checkPracticeButton.textContent =
                "Check Answer";

        }


        if (practiceNextButton) {

            practiceNextButton.hidden =
                true;

            practiceNextButton.classList.remove(
                "retry"
            );

            practiceNextButton.innerHTML =
                `Next Question <span>→</span>`;

        }


        if (practiceCard) {

            practiceCard.hidden =
                false;

        }


        if (practiceScore) {

            practiceScore.hidden =
                true;

        }


        setTimeout(
            function () {

                if (practiceAnswerInput) {

                    practiceAnswerInput.focus();

                }

            },
            100
        );

    }


    /* =====================================================
       PRACTICE FEEDBACK
    ===================================================== */

    function showFeedback(
        isCorrect,
        title,
        message
    ) {

        if (!practiceFeedback) {

            return;

        }


        practiceFeedback.hidden =
            false;


        practiceFeedback.classList.remove(
            "correct",
            "incorrect"
        );


        practiceFeedback.classList.add(
            isCorrect
                ? "correct"
                : "incorrect"
        );


        if (practiceFeedbackIcon) {

            practiceFeedbackIcon.textContent =
                isCorrect
                    ? "✓"
                    : "✗";

        }


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

        if (questionAnswered) {

            return;

        }


        if (!practiceAnswerInput) {

            return;

        }


        const value =
            practiceAnswerInput.value.trim();


        if (value === "") {

            showFeedback(

                false,

                "Please enter an answer.",

                "Enter your answer before checking it."

            );

            return;

        }


        const userAnswer =
            Number(value);


        if (!Number.isFinite(userAnswer)) {

            showFeedback(

                false,

                "Invalid answer.",

                "Please enter a valid number."

            );

            return;

        }


        const question =
            practiceQuestions[
                currentQuestionIndex
            ];


        const tolerance =
            0.01;


        const isCorrect =
            Math.abs(
                userAnswer -
                question.answer
            ) <= tolerance;


        /* =================================================
           CORRECT
        ================================================= */

        if (isCorrect) {

            questionAnswered =
                true;


            practiceScoreValue++;


            showFeedback(

                true,

                "✓ Correct!",

                question.explanation

            );


            practiceAnswerInput.disabled =
                true;


            if (checkPracticeButton) {

                checkPracticeButton.disabled =
                    true;

            }


            if (practiceNextButton) {

                practiceNextButton.hidden =
                    false;


                practiceNextButton.classList.remove(
                    "retry"
                );


                if (
                    currentQuestionIndex ===
                    practiceQuestions.length - 1
                ) {

                    practiceNextButton.innerHTML =
                        `Finish Practice <span>✓</span>`;

                }

                else {

                    practiceNextButton.innerHTML =
                        `Next Question <span>→</span>`;

                }

            }

        }


        /* =================================================
           INCORRECT — RETRY
        ================================================= */

        else {

            /*
             * Keep question active.
             */

            questionAnswered =
                false;


            showFeedback(

                false,

                "✗ Not quite.",

                "Your answer is not correct yet. Review the numbers and try the same question again."

            );


            /*
             * Input remains enabled.
             */

            practiceAnswerInput.disabled =
                false;


            /*
             * Check button remains enabled.
             */

            if (checkPracticeButton) {

                checkPracticeButton.disabled =
                    false;

            }


            /*
             * Show Try Again.
             */

            if (practiceNextButton) {

                practiceNextButton.hidden =
                    false;


                practiceNextButton.classList.add(
                    "retry"
                );


                practiceNextButton.innerHTML =
                    `Try Again <span>↻</span>`;

            }

        }

    }


    /* =====================================================
       NEXT / RETRY
    ===================================================== */

    function handlePracticeNext() {

        /*
         * Wrong answer:
         * retry same question.
         */

        if (!questionAnswered) {

            if (practiceAnswerInput) {

                practiceAnswerInput.value =
                    "";

                practiceAnswerInput.focus();

            }


            if (practiceFeedback) {

                practiceFeedback.hidden =
                    true;

            }


            if (practiceNextButton) {

                practiceNextButton.hidden =
                    true;

                practiceNextButton.classList.remove(
                    "retry"
                );

            }


            return;

        }


        /*
         * Correct answer:
         * move to next question.
         */

        if (
            currentQuestionIndex <
            practiceQuestions.length - 1
        ) {

            currentQuestionIndex++;

            loadPracticeQuestion();

            return;

        }


        finishPractice();

    }


    /* =====================================================
       FINISH PRACTICE
    ===================================================== */

    function finishPractice() {

        if (practiceCard) {

            practiceCard.hidden =
                true;

        }


        if (practiceProgressBar) {

            practiceProgressBar.style.width =
                "100%";

        }


        if (practiceScore) {

            practiceScore.hidden =
                false;

        }


        if (practiceQuestionNumber) {

            practiceQuestionNumber.textContent =
                `${practiceQuestions.length} / ${practiceQuestions.length}`;

        }


        if (practiceScoreText) {

            practiceScoreText.textContent =
                `${practiceScoreValue} / ${practiceQuestions.length}`;

        }


        if (practiceScoreMessage) {

            if (
                practiceScoreValue ===
                practiceQuestions.length
            ) {

                practiceScoreMessage.textContent =
                    "Excellent work. You have a strong understanding of the basic risk amount calculation.";

            }

            else if (
                practiceScoreValue >= 4
            ) {

                practiceScoreMessage.textContent =
                    "Very good. Review the questions you found difficult before continuing.";

            }

            else if (
                practiceScoreValue >= 3
            ) {

                practiceScoreMessage.textContent =
                    "Good progress. Review the risk amount formula before continuing.";

            }

            else {

                practiceScoreMessage.textContent =
                    "Take your time and review the calculator section before continuing.";

            }

        }

    }


    /* =====================================================
       RESTART PRACTICE
    ===================================================== */

    function restartPractice() {

        currentQuestionIndex =
            0;


        practiceScoreValue =
            0;


        questionAnswered =
            false;


        if (practiceScore) {

            practiceScore.hidden =
                true;

        }


        loadPracticeQuestion();

    }


    /* =====================================================
       PRACTICE EVENTS
    ===================================================== */

    if (checkPracticeButton) {

        checkPracticeButton.addEventListener(
            "click",
            checkPracticeAnswer
        );

    }


    if (practiceNextButton) {

        practiceNextButton.addEventListener(
            "click",
            handlePracticeNext
        );

    }


    if (practiceAnswerInput) {

        practiceAnswerInput.addEventListener(

            "keydown",

            function (event) {

                if (
                    event.key !== "Enter"
                ) {

                    return;

                }


                event.preventDefault();


                if (questionAnswered) {

                    handlePracticeNext();

                }

                else {

                    checkPracticeAnswer();

                }

            }

        );

    }


    /* =====================================================
       CHECKPOINT ELEMENTS
    ===================================================== */

    const checkpointQuestionNumber =
        document.getElementById(
            "checkpointQuestionNumber"
        );

    const checkpointProgressBar =
        document.getElementById(
            "checkpointProgressBar"
        );

    const checkpointCard =
        document.getElementById(
            "checkpointCard"
        );

    const checkpointQuestionBadge =
        document.getElementById(
            "checkpointQuestionBadge"
        );

    const checkpointQuestionTopic =
        document.getElementById(
            "checkpointQuestionTopic"
        );

    const checkpointQuestion =
        document.getElementById(
            "checkpointQuestion"
        );

    const checkpointOptions =
        document.getElementById(
            "checkpointOptions"
        );

    const checkpointFeedback =
        document.getElementById(
            "checkpointFeedback"
        );

    const checkpointFeedbackIcon =
        document.getElementById(
            "checkpointFeedbackIcon"
        );

    const checkpointFeedbackTitle =
        document.getElementById(
            "checkpointFeedbackTitle"
        );

    const checkpointFeedbackText =
        document.getElementById(
            "checkpointFeedbackText"
        );

    const checkpointNextButton =
        document.getElementById(
            "checkpointNextButton"
        );

    const checkpointResult =
        document.getElementById(
            "checkpointResult"
        );

    const checkpointResultIcon =
        document.getElementById(
            "checkpointResultIcon"
        );

    const checkpointScore =
        document.getElementById(
            "checkpointScore"
        );

    const checkpointResultTitle =
        document.getElementById(
            "checkpointResultTitle"
        );

    const checkpointResultMessage =
        document.getElementById(
            "checkpointResultMessage"
        );

    const riskBuildComplete =
        document.getElementById(
            "riskBuildComplete"
        );


    /* =====================================================
       CHECKPOINT QUESTIONS
    ===================================================== */

    const checkpointQuestions = [

        {
            number: 1,

            topic: "RISK PERCENTAGE",

            question:
                "A trader has a $4,000 account and wants to limit the planned risk to $80. What risk percentage are they using?",

            options: [
                "0.5%",
                "1%",
                "2%",
                "4%"
            ],

            correctAnswer: 2,

            explanation:
                "$80 ÷ $4,000 × 100 = 2%. The trader is planning to risk 2% of the account."

        },


        {
            number: 2,

            topic: "RISK AMOUNT",

            question:
                "A trader has a $2,500 account and plans to risk 1.5% on a trade. What is the planned risk amount?",

            options: [
                "$25",
                "$30",
                "$37.50",
                "$50"
            ],

            correctAnswer: 2,

            explanation:
                "$2,500 × 1.5% = $37.50. The planned risk amount is $37.50."

        },


        {
            number: 3,

            topic: "LOSS IMPACT",

            question:
                "Two traders both start with $1,000. Trader A risks 1% per trade while Trader B risks 5% per trade. After several consecutive losses, which trader experiences the smaller percentage drawdown?",

            options: [
                "Trader A",
                "Trader B",
                "Both experience exactly the same drawdown",
                "It cannot be determined"
            ],

            correctAnswer: 0,

            explanation:
                "Trader A risks less per trade, so the same losing streak has a smaller percentage impact on the account."

        },


        {
            number: 4,

            topic: "RECOVERY",

            question:
                "A trading account loses 25% of its value. Approximately what percentage gain is required to recover back to the original account balance?",

            options: [
                "25%",
                "30%",
                "33.3%",
                "50%"
            ],

            correctAnswer: 2,

            explanation:
                "After a 25% loss, the account is at 75% of its original value. A gain of 25 ÷ 75 × 100 ≈ 33.3% is required to recover."

        },


        {
            number: 5,

            topic: "RISK MANAGEMENT",

            question:
                "A trader wants to keep planned risk under control during a losing streak. Which approach best follows the principles of risk management?",

            options: [
                "Increase position size after every loss to recover faster.",
                "Use a defined risk amount and keep exposure within the planned limit.",
                "Remove the stop loss so the trade has more room.",
                "Risk the maximum possible amount when confidence is high."
            ],

            correctAnswer: 1,

            explanation:
                "Risk management is about defining and controlling planned exposure before entering a trade, especially when losses occur."

        }

    ];


    /* =====================================================
       CHECKPOINT STATE
    ===================================================== */

    let checkpointCurrentIndex =
        0;

    let checkpointScoreValue =
        0;

    let checkpointAnswered =
        false;


    /* =====================================================
       LOAD CHECKPOINT QUESTION
    ===================================================== */

    function loadCheckpointQuestion() {

        const question =
            checkpointQuestions[
                checkpointCurrentIndex
            ];


        checkpointAnswered =
            false;


        if (checkpointQuestionNumber) {

            checkpointQuestionNumber.textContent =
                `${question.number} / ${checkpointQuestions.length}`;

        }


        if (checkpointProgressBar) {

            const progress =
                (
                    question.number /
                    checkpointQuestions.length
                ) * 100;


            checkpointProgressBar.style.width =
                `${progress}%`;

        }


        if (checkpointQuestionBadge) {

            checkpointQuestionBadge.textContent =
                `QUESTION ${String(
                    question.number
                ).padStart(2, "0")}`;

        }


        if (checkpointQuestionTopic) {

            checkpointQuestionTopic.textContent =
                question.topic;

        }


        if (checkpointQuestion) {

            checkpointQuestion.textContent =
                question.question;

        }


        if (checkpointOptions) {

            checkpointOptions.innerHTML =
                "";


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
                        "risk-checkpoint-option";


                    button.dataset.index =
                        index;


                    button.innerHTML = `

                        <span class="risk-checkpoint-option-number">
                            ${String.fromCharCode(
                                65 + index
                            )}
                        </span>

                        <span>
                            ${option}
                        </span>

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

        }


        if (checkpointFeedback) {

            checkpointFeedback.hidden =
                true;

            checkpointFeedback.classList.remove(
                "correct",
                "incorrect"
            );

        }


        if (checkpointNextButton) {

            /*
             * IMPORTANT:
             * Hidden until an answer is checked.
             */

            checkpointNextButton.hidden =
                true;


            checkpointNextButton.classList.remove(
                "retry"
            );


            checkpointNextButton.innerHTML =
                `Next Question <span>→</span>`;

        }


        if (
            checkpointCurrentIndex ===
            checkpointQuestions.length - 1
        ) {

            if (checkpointNextButton) {

                checkpointNextButton.innerHTML =
                    `Finish Checkpoint <span>✓</span>`;

            }

        }


        if (checkpointCard) {

            checkpointCard.hidden =
                false;

        }


        if (checkpointResult) {

            checkpointResult.hidden =
                true;

        }


        if (riskBuildComplete) {

            riskBuildComplete.hidden =
                true;

        }

    }


    /* =====================================================
       CHECKPOINT FEEDBACK
    ===================================================== */

    function showCheckpointFeedback(
        isCorrect,
        title,
        message
    ) {

        if (!checkpointFeedback) {

            return;

        }


        checkpointFeedback.hidden =
            false;


        checkpointFeedback.classList.remove(
            "correct",
            "incorrect"
        );


        checkpointFeedback.classList.add(
            isCorrect
                ? "correct"
                : "incorrect"
        );


        if (checkpointFeedbackIcon) {

            checkpointFeedbackIcon.textContent =
                isCorrect
                    ? "✓"
                    : "✗";

        }


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
       DISABLE CHECKPOINT OPTIONS
    ===================================================== */

    function disableCheckpointOptions() {

        if (!checkpointOptions) {

            return;

        }


        checkpointOptions
            .querySelectorAll(
                ".risk-checkpoint-option"
            )
            .forEach(

                function (button) {

                    button.disabled =
                        true;

                }

            );

    }


    /* =====================================================
       UNLOCK CHECKPOINT OPTIONS
    ===================================================== */

    function unlockCheckpointOptions() {

        if (!checkpointOptions) {

            return;

        }


        checkpointOptions
            .querySelectorAll(
                ".risk-checkpoint-option"
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

    }


    /* =====================================================
       SELECT CHECKPOINT ANSWER
       
       IMPORTANT FIX:
       
       WRONG ANSWER:
       ALL OPTIONS LOCK.
       
       TRY AGAIN:
       ALL OPTIONS UNLOCK.
       
       CORRECT ANSWER:
       ALL OPTIONS LOCK.
    ===================================================== */

    function selectCheckpointAnswer(
        selectedIndex,
        selectedButton
    ) {

        if (checkpointAnswered) {

            return;

        }


        const question =
            checkpointQuestions[
                checkpointCurrentIndex
            ];


        if (!selectedButton) {

            return;

        }


        /*
         * Remove previous visual states.
         */

        if (checkpointOptions) {

            checkpointOptions
                .querySelectorAll(
                    ".risk-checkpoint-option"
                )
                .forEach(

                    function (button) {

                        button.classList.remove(
                            "selected",
                            "incorrect"
                        );

                    }

                );

        }


        selectedButton.classList.add(
            "selected"
        );


        const isCorrect =
            selectedIndex ===
            question.correctAnswer;


        /* =================================================
           CORRECT ANSWER
        ================================================= */

        if (isCorrect) {

            checkpointAnswered =
                true;


            checkpointScoreValue++;


            selectedButton.classList.add(
                "correct"
            );


            showCheckpointFeedback(

                true,

                "✓ Correct!",

                question.explanation

            );


            /*
             * LOCK ALL OPTIONS.
             */

            disableCheckpointOptions();


            if (checkpointNextButton) {

                checkpointNextButton.hidden =
                    false;


                checkpointNextButton.classList.remove(
                    "retry"
                );


                if (
                    checkpointCurrentIndex ===
                    checkpointQuestions.length - 1
                ) {

                    checkpointNextButton.innerHTML =
                        `Finish Checkpoint <span>✓</span>`;

                }

                else {

                    checkpointNextButton.innerHTML =
                        `Next Question <span>→</span>`;

                }

            }


            return;

        }


        /* =================================================
           WRONG ANSWER
           
           THIS IS THE IMPORTANT FIX.
           
           The student cannot simply click another
           answer after choosing a wrong one.
        ================================================= */

        checkpointAnswered =
            false;


        selectedButton.classList.add(
            "incorrect"
        );


        /*
         * LOCK EVERY ANSWER OPTION.
         */

        disableCheckpointOptions();


        showCheckpointFeedback(

            false,

            "✗ Not quite.",

            "That answer is incorrect. Review the question and try again."

        );


        /*
         * Show Try Again.
         */

        if (checkpointNextButton) {

            checkpointNextButton.hidden =
                false;


            checkpointNextButton.classList.add(
                "retry"
            );


            checkpointNextButton.innerHTML =
                `Try Again <span>↻</span>`;

        }

    }


    /* =====================================================
       NEXT / RETRY
    ===================================================== */

    function handleCheckpointNext() {

        /*
         * WRONG ANSWER:
         *
         * Stay on the same question.
         * Unlock all options.
         */

        if (!checkpointAnswered) {

            if (checkpointFeedback) {

                checkpointFeedback.hidden =
                    true;

            }


            if (checkpointNextButton) {

                checkpointNextButton.hidden =
                    true;


                checkpointNextButton.classList.remove(
                    "retry"
                );

            }


            /*
             * UNLOCK ALL OPTIONS.
             */

            unlockCheckpointOptions();


            return;

        }


        /*
         * CORRECT ANSWER:
         *
         * Move to next question.
         */

        if (
            checkpointCurrentIndex <
            checkpointQuestions.length - 1
        ) {

            checkpointCurrentIndex++;


            loadCheckpointQuestion();


            return;

        }


        /*
         * FINAL QUESTION.
         */

        finishCheckpoint();

    }


    /* =====================================================
       FINISH CHECKPOINT
    ===================================================== */

    function finishCheckpoint() {

        if (checkpointCard) {

            checkpointCard.hidden =
                true;

        }


        if (checkpointProgressBar) {

            checkpointProgressBar.style.width =
                "100%";

        }


        if (checkpointQuestionNumber) {

            checkpointQuestionNumber.textContent =
                `${checkpointQuestions.length} / ${checkpointQuestions.length}`;

        }


        const passed =
            checkpointScoreValue >= 4;


        if (checkpointResult) {

            checkpointResult.hidden =
                false;


            checkpointResult.classList.toggle(
                "failed",
                !passed
            );

        }


        if (checkpointScore) {

            checkpointScore.textContent =
                `${checkpointScoreValue} / ${checkpointQuestions.length}`;

        }


        if (passed) {

            if (checkpointResultIcon) {

                checkpointResultIcon.textContent =
                    "🏆";

            }


            if (checkpointResultTitle) {

                checkpointResultTitle.textContent =
                    "Risk Management Build 001 Complete";

            }


            if (checkpointResultMessage) {

                checkpointResultMessage.textContent =
                    "Excellent work. You passed the Risk Management checkpoint and completed Build 001.";

            }


            if (riskBuildComplete) {

                riskBuildComplete.hidden =
                    false;

            }

        }

        else {

            if (checkpointResultIcon) {

                checkpointResultIcon.textContent =
                    "📘";

            }


            if (checkpointResultTitle) {

                checkpointResultTitle.textContent =
                    "Review Required";

            }


            if (checkpointResultMessage) {

                checkpointResultMessage.textContent =
                    "You need at least 4 out of 5 correct answers to pass. Review the Risk Management Lab and try the checkpoint again.";

            }

        }

    }


    /* =====================================================
       CHECKPOINT EVENT
    ===================================================== */

    if (checkpointNextButton) {

        checkpointNextButton.addEventListener(
            "click",
            handleCheckpointNext
        );

    }


    /* =====================================================
       CHECKPOINT INITIALIZATION
    ===================================================== */

    if (checkpointCard) {

        loadCheckpointQuestion();

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    calculateRisk();

    loadPracticeQuestion();


    /* =====================================================
       BUILD STATUS
    ===================================================== */

    console.log(
        "Strativo Academy — Risk Management Build 001 loaded."
    );

    console.log(
        "Risk Calculator + Practice Retry Engine loaded."
    );

    console.log(
        "Checkpoint wrong-answer lock system loaded."
    );


})();