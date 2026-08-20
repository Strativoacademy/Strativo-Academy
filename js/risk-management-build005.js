/* =========================================================
   STRATIVO ACADEMY
   RISK MANAGEMENT LAB
   BUILD 005
   RISK PER TRADE & ACCOUNT RISK
========================================================= */

(function () {

    "use strict";

    function get(id) {
        return document.getElementById(id);
    }

    /* =====================================================
       01 — RISK PER TRADE CALCULATOR
    ===================================================== */

    const balanceInput = get("rm5Balance");
    const riskPercentInput = get("rm5RiskPercent");
    const riskAmountInput = get("rm5RiskAmount");

    const balanceResult = get("rm5BalanceResult");
    const percentResult = get("rm5PercentResult");
    const amountResult = get("rm5AmountResult");
    const formula = get("rm5Formula");

    function calculateRiskAmount() {

        if (!balanceInput || !riskPercentInput) {
            return;
        }

        const balance =
            Number(balanceInput.value);

        const riskPercent =
            Number(riskPercentInput.value);

        if (
            !Number.isFinite(balance) ||
            !Number.isFinite(riskPercent) ||
            balance <= 0 ||
            riskPercent < 0
        ) {

            if (riskAmountInput) {
                riskAmountInput.value = "—";
            }

            if (balanceResult) {
                balanceResult.textContent = "$0.00";
            }

            if (percentResult) {
                percentResult.textContent = "0.00%";
            }

            if (amountResult) {
                amountResult.textContent = "—";
            }

            if (formula) {
                formula.textContent =
                    "Enter a valid account balance and risk percentage.";
            }

            return;
        }

        const riskAmount =
            balance *
            riskPercent /
            100;

        if (riskAmountInput) {
            riskAmountInput.value =
                riskAmount.toFixed(2);
        }

        if (balanceResult) {
            balanceResult.textContent =
                `$${balance.toFixed(2)}`;
        }

        if (percentResult) {
            percentResult.textContent =
                `${riskPercent.toFixed(2)}%`;
        }

        if (amountResult) {
            amountResult.textContent =
                `$${riskAmount.toFixed(2)}`;
        }

        if (formula) {
            formula.textContent =
                `$${balance.toFixed(2)} × ${riskPercent.toFixed(2)}% = $${riskAmount.toFixed(2)} planned risk`;
        }
    }

    if (balanceInput) {
        balanceInput.addEventListener(
            "input",
            calculateRiskAmount
        );
    }

    if (riskPercentInput) {
        riskPercentInput.addEventListener(
            "input",
            calculateRiskAmount
        );
    }

    /* =====================================================
       02 — PRACTICE QUESTIONS
    ===================================================== */

    const practiceQuestions = [

        {
            topic: "ACCOUNT RISK",
            balance: 1000,
            percent: 1,
            answer: 10,
            question:
                "An account contains $1,000 and the planned risk per trade is 1%. What is the planned monetary risk?",
            explanation:
                "$1,000 × 1% ÷ 100 = $10. The planned risk is $10."
        },

        {
            topic: "ACCOUNT RISK",
            balance: 2000,
            percent: 1,
            answer: 20,
            question:
                "An account contains $2,000 and the planned risk per trade is 1%. What is the planned monetary risk?",
            explanation:
                "$2,000 × 1% ÷ 100 = $20. The planned risk is $20."
        },

        {
            topic: "ACCOUNT RISK",
            balance: 1500,
            percent: 2,
            answer: 30,
            question:
                "An account contains $1,500 and the planned risk per trade is 2%. What is the planned monetary risk?",
            explanation:
                "$1,500 × 2% ÷ 100 = $30. The planned risk is $30."
        },

        {
            topic: "ACCOUNT RISK",
            balance: 500,
            percent: 0.5,
            answer: 2.5,
            question:
                "An account contains $500 and the planned risk per trade is 0.5%. What is the planned monetary risk?",
            explanation:
                "$500 × 0.5% ÷ 100 = $2.50. The planned risk is $2.50."
        },

        {
            topic: "ACCOUNT RISK",
            balance: 3000,
            percent: 1.5,
            answer: 45,
            question:
                "An account contains $3,000 and the planned risk per trade is 1.5%. What is the planned monetary risk?",
            explanation:
                "$3,000 × 1.5% ÷ 100 = $45. The planned risk is $45."
        }

    ];

    let practiceIndex = 0;
    let practiceScore = 0;
    let practiceAnswered = false;

    /* =====================================================
       PRACTICE ELEMENTS
    ===================================================== */

    const practiceNumber =
        get("rm5PracticeNumber");

    const practiceBar =
        get("rm5PracticeBar");

    const practiceCard =
        get("rm5PracticeCard");

    const practiceBadge =
        get("rm5PracticeBadge");

    const practiceTopic =
        get("rm5PracticeTopic");

    const practiceQuestion =
        get("rm5PracticeQuestion");

    const practiceBalance =
        get("rm5PracticeBalance");

    const practicePercent =
        get("rm5PracticePercent");

    const practiceAnswer =
        get("rm5PracticeAnswer");

    const practiceCheck =
        get("rm5PracticeCheck");

    const practiceFeedback =
        get("rm5PracticeFeedback");

    const practiceFeedbackTitle =
        get("rm5PracticeFeedbackTitle");

    const practiceFeedbackText =
        get("rm5PracticeFeedbackText");

    const practiceNext =
        get("rm5PracticeNext");

    const practiceComplete =
        get("rm5PracticeComplete");

    const practiceScoreDisplay =
        get("rm5PracticeScore");

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

        if (practiceBalance) {
            practiceBalance.textContent =
                `$${question.balance.toLocaleString()}`;
        }

        if (practicePercent) {
            practicePercent.textContent =
                `${question.percent}%`;
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
                "Enter the planned risk amount before checking."
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
                "Review the account balance and risk percentage, then try the same question again."
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

            } else {

                practiceNext.innerHTML =
                    `Next Question <span>→</span>`;

            }
        }
    }

    /* =====================================================
       PRACTICE NEXT / RETRY
    ===================================================== */

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
                } else {
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
            topic: "CONCEPT",

            question:
                "What does risk per trade describe?",

            options: [
                "The guaranteed profit from a trade.",
                "The amount of account capital planned to be at risk on one trade.",
                "The number of trades taken in one day.",
                "The maximum possible market price."
            ],

            answer: 1,

            explanation:
                "Risk per trade describes the amount of account capital planned to be exposed to loss on one trade."
        },

        {
            topic: "CALCULATION",

            question:
                "An account has $2,000 and the planned risk is 1%. What is the planned risk amount?",

            options: [
                "$10",
                "$20",
                "$50",
                "$100"
            ],

            answer: 1,

            explanation:
                "$2,000 × 1% ÷ 100 = $20."
        },

        {
            topic: "CALCULATION",

            question:
                "An account has $4,000 and the planned risk is 0.5%. What is the planned risk amount?",

            options: [
                "$10",
                "$20",
                "$40",
                "$50"
            ],

            answer: 1,

            explanation:
                "$4,000 × 0.5% ÷ 100 = $20."
        },

        {
            topic: "RISK CONTROL",

            question:
                "Why can using a consistent risk percentage be useful?",

            options: [
                "It guarantees every trade will win.",
                "It helps keep planned account exposure consistent relative to account size.",
                "It removes all market risk.",
                "It guarantees the same profit on every trade."
            ],

            answer: 1,

            explanation:
                "A consistent percentage helps keep planned risk proportional to the account size."
        },

        {
            topic: "FINAL CHALLENGE",

            question:
                "An account has $5,000 and the planned risk is 2%. What is the planned risk amount?",

            options: [
                "$50",
                "$75",
                "$100",
                "$200"
            ],

            answer: 2,

            explanation:
                "$5,000 × 2% ÷ 100 = $100."
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
        get("rm5CheckpointNumber");

    const checkpointBar =
        get("rm5CheckpointBar");

    const checkpointCard =
        get("rm5CheckpointCard");

    const checkpointBadge =
        get("rm5CheckpointBadge");

    const checkpointTopic =
        get("rm5CheckpointTopic");

    const checkpointQuestion =
        get("rm5CheckpointQuestion");

    const checkpointOptions =
        get("rm5CheckpointOptions");

    const checkpointFeedback =
        get("rm5CheckpointFeedback");

    const checkpointFeedbackTitle =
        get("rm5CheckpointFeedbackTitle");

    const checkpointFeedbackText =
        get("rm5CheckpointFeedbackText");

    const checkpointNext =
        get("rm5CheckpointNext");

    const checkpointComplete =
        get("rm5CheckpointComplete");

    const checkpointResult =
        get("rm5CheckpointResult");

    const checkpointScoreDisplay =
        get("rm5CheckpointScore");

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
                    "rm5-option";

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
       
       FIXED:
       WRONG ANSWER LOCKS ALL OPTIONS
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
               IMPORTANT FIX
               
               LOCK EVERY OPTION AFTER WRONG ANSWER.
               Student MUST click Try Again first.
            ================================================= */

            if (checkpointOptions) {

                checkpointOptions
                    .querySelectorAll(
                        ".rm5-option"
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

                "That answer is not correct. Review the question and try again."

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
                    ".rm5-option"
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

            } else {

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
         * Stay on same question.
         * Unlock all options.
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
                        ".rm5-option"
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
         * Move forward.
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
                    "🏆 Build 005 Complete";

            } else {

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

    calculateRiskAmount();

    loadPracticeQuestion();

    loadCheckpointQuestion();

    /* =====================================================
       BUILD STATUS
    ===================================================== */

    console.log(
        "Strativo Academy — Risk Management Build 005 loaded successfully."
    );

})();