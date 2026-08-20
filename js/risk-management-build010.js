/* =========================================================
   STRATIVO ACADEMY
   RISK MANAGEMENT LAB
   BUILD 010
   FINAL RISK MANAGEMENT ASSESSMENT
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
       FINAL ASSESSMENT QUESTIONS
    ===================================================== */

    const questions = [

        {
            topic: "RISK PER TRADE",

            question:
                "A trader has a $1,000 account and decides to risk 1% on one trade. What is the maximum planned loss?",

            options: [
                "$1",
                "$10",
                "$50",
                "$100"
            ],

            answer: 1,

            explanation:
                "1% of $1,000 is $10. Therefore, the planned maximum loss is $10."
        },


        {
            topic: "POSITION SIZE",

            question:
                "Why should position size be adjusted when the stop-loss distance changes?",

            options: [
                "To keep the planned monetary risk under control.",
                "To guarantee the trade will win.",
                "To remove the need for a stop-loss.",
                "To increase every trade's risk."
            ],

            answer: 0,

            explanation:
                "A wider stop generally requires a smaller position size if the trader wants to keep the same monetary risk."
        },


        {
            topic: "RISK-TO-REWARD",

            question:
                "A trade has a potential loss of $20 and a potential profit of $40. What is the reward-to-risk ratio?",

            options: [
                "1:2",
                "2:1",
                "1:1",
                "4:1"
            ],

            answer: 1,

            explanation:
                "$40 reward ÷ $20 risk = 2. The trade offers a 2:1 reward-to-risk ratio."
        },


        {
            topic: "STOP LOSS",

            question:
                "What is the main purpose of a stop-loss in risk management?",

            options: [
                "To guarantee a winning trade.",
                "To automatically increase position size.",
                "To define or limit the planned downside of a trade.",
                "To predict the next market candle."
            ],

            answer: 2,

            explanation:
                "A stop-loss is used to define an exit point when the trade moves against the trader, helping control planned downside."
        },


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
                "The loss is $100. $100 ÷ $1,000 × 100 = 10% drawdown."
        },


        {
            topic: "RECOVERY",

            question:
                "An account falls from $1,000 to $800. What percentage gain is required to return to $1,000?",

            options: [
                "20%",
                "22.5%",
                "25%",
                "30%"
            ],

            answer: 2,

            explanation:
                "The account lost $200 and has $800 remaining. $200 ÷ $800 × 100 = 25% recovery required."
        },


        {
            topic: "CONSECUTIVE LOSSES",

            question:
                "If a trader repeatedly risks 2% of the remaining account, what happens during a losing streak?",

            options: [
                "The account balance decreases after each loss.",
                "The account automatically returns to its peak.",
                "Every loss becomes a profit.",
                "Drawdown becomes impossible."
            ],

            answer: 0,

            explanation:
                "Each loss reduces the remaining account balance, so consecutive losses create cumulative drawdown."
        },


        {
            topic: "CAPITAL PROTECTION",

            question:
                "Which approach is generally more appropriate for protecting trading capital?",

            options: [
                "Increase risk after every loss.",
                "Use controlled risk and keep drawdown manageable.",
                "Risk the entire account on one trade.",
                "Ignore the account balance."
            ],

            answer: 1,

            explanation:
                "Controlled risk helps limit the damage caused by losing trades and losing streaks."
        },


        {
            topic: "LOSS RECOVERY",

            question:
                "Why does a 20% account loss require a 25% gain to recover?",

            options: [
                "Because the remaining account is smaller.",
                "Because brokers add a 5% fee.",
                "Because losses are always doubled.",
                "Because recovery is calculated from the original peak."
            ],

            answer: 0,

            explanation:
                "After a 20% loss, only 80% of the original capital remains. A 25% gain on that 80% returns the account to 100%."
        },


        {
            topic: "FINAL RISK CONTROL",

            question:
                "What is the most important overall principle of risk management?",

            options: [
                "Maximize risk on every trade.",
                "Avoid all losing trades.",
                "Protect capital and keep losses controlled.",
                "Trade as frequently as possible."
            ],

            answer: 2,

            explanation:
                "Risk management cannot eliminate losses, but controlling exposure and downside helps protect capital over a series of trades."
        }

    ];


    /* =====================================================
       STATE
    ===================================================== */

    let currentQuestion =
        0;

    let score =
        0;

    let answered =
        false;


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const questionNumber =
        get("rm10QuestionNumber");

    const scoreDisplay =
        get("rm10Score");

    const progressBar =
        get("rm10ProgressBar");

    const questionCard =
        get("rm10QuestionCard");

    const questionTopic =
        get("rm10QuestionTopic");

    const questionBadge =
        get("rm10QuestionBadge");

    const questionText =
        get("rm10Question");

    const optionsContainer =
        get("rm10Options");

    const feedback =
        get("rm10Feedback");

    const feedbackTitle =
        get("rm10FeedbackTitle");

    const feedbackText =
        get("rm10FeedbackText");

    const nextButton =
        get("rm10Next");

    const assessmentResult =
        get("rm10AssessmentResult");

    const finalTitle =
        get("rm10FinalTitle");

    const finalScore =
        get("rm10FinalScore");

    const finalMessage =
        get("rm10FinalMessage");

    const retryButton =
        get("rm10Retry");


    /* =====================================================
       LOAD QUESTION
    ===================================================== */

    function loadQuestion() {

        const question =
            questions[currentQuestion];


        answered =
            false;


        /* QUESTION NUMBER */

        if (questionNumber) {

            questionNumber.textContent =
                `QUESTION ${String(
                    currentQuestion + 1
                ).padStart(2, "0")} / ${questions.length}`;

        }


        /* SCORE */

        if (scoreDisplay) {

            scoreDisplay.textContent =
                `SCORE: ${score}`;

        }


        /* PROGRESS */

        if (progressBar) {

            progressBar.style.width =
                `${(
                    (currentQuestion + 1) /
                    questions.length
                ) * 100}%`;

        }


        /* TOPIC */

        if (questionTopic) {

            questionTopic.textContent =
                question.topic;

        }


        /* BADGE */

        if (questionBadge) {

            questionBadge.textContent =
                String(
                    currentQuestion + 1
                ).padStart(2, "0");

        }


        /* QUESTION */

        if (questionText) {

            questionText.textContent =
                question.question;

        }


        /* RESET FEEDBACK */

        if (feedback) {

            feedback.hidden =
                true;

            feedback.classList.remove(
                "incorrect"
            );

        }


        /* RESET NEXT BUTTON */

        if (nextButton) {

            nextButton.hidden =
                true;

            nextButton.classList.remove(
                "retry"
            );

            nextButton.innerHTML =
                `Next Question <span>→</span>`;

        }


        /* CREATE OPTIONS */

        if (optionsContainer) {

            optionsContainer.innerHTML =
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
                        "rm10-option";


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

                            checkAnswer(
                                index,
                                button
                            );

                        }

                    );


                    optionsContainer.appendChild(
                        button
                    );

                }

            );

        }


        if (questionCard) {

            questionCard.hidden =
                false;

        }


        if (assessmentResult) {

            assessmentResult.hidden =
                true;

        }

    }


    /* =====================================================
       FEEDBACK
    ===================================================== */

    function showFeedback(
        correct,
        title,
        message
    ) {

        if (!feedback) {

            return;

        }


        feedback.hidden =
            false;


        feedback.classList.toggle(
            "incorrect",
            !correct
        );


        if (feedbackTitle) {

            feedbackTitle.textContent =
                title;

        }


        if (feedbackText) {

            feedbackText.textContent =
                message;

        }

    }


    /* =====================================================
       CHECK ANSWER
    ===================================================== */

    function checkAnswer(
        selectedIndex,
        selectedButton
    ) {

        if (answered) {

            return;

        }


        const question =
            questions[currentQuestion];


        /* =================================================
           WRONG ANSWER
        ================================================== */

        if (
            selectedIndex !==
            question.answer
        ) {
if (selectedButton) {

    selectedButton.classList.add(
        "incorrect"
    );

}


/* LOCK ALL ANSWERS AFTER WRONG ANSWER */

if (optionsContainer) {

    optionsContainer
        .querySelectorAll(".rm10-option")
        .forEach(function (button) {

            button.disabled = true;

        });

}

            showFeedback(

                false,

                "✗ Not quite.",

                "That answer is incorrect. Review the concept and try this question again."

            );


            if (nextButton) {

                nextButton.hidden =
                    false;

                nextButton.classList.add(
                    "retry"
                );

                nextButton.innerHTML =
                    `Try Again <span>↻</span>`;

            }


            return;

        }


        /* =================================================
           CORRECT ANSWER
        ================================================== */

        answered =
            true;

        score++;


        if (selectedButton) {

            selectedButton.classList.add(
                "correct"
            );

        }


        showFeedback(

            true,

            "✓ Correct!",

            question.explanation

        );


        /* DISABLE OPTIONS */

        if (optionsContainer) {

            optionsContainer
                .querySelectorAll(
                    ".rm10-option"
                )
                .forEach(

                    function (button) {

                        button.disabled =
                            true;

                    }

                );

        }


        /* UPDATE SCORE */

        if (scoreDisplay) {

            scoreDisplay.textContent =
                `SCORE: ${score}`;

        }


        /* NEXT BUTTON */

        if (nextButton) {

            nextButton.hidden =
                false;

            nextButton.classList.remove(
                "retry"
            );


            if (
                currentQuestion ===
                questions.length - 1
            ) {

                nextButton.innerHTML =
                    `View Final Result <span>✓</span>`;

            }

            else {

                nextButton.innerHTML =
                    `Next Question <span>→</span>`;

            }

        }

    }


    /* =====================================================
       NEXT / RETRY
    ===================================================== */

    function handleNext() {

        /*
         * Wrong answer:
         * retry the same question.
         */

        if (!answered) {

            if (feedback) {

                feedback.hidden =
                    true;

            }


            if (nextButton) {

                nextButton.hidden =
                    true;

                nextButton.classList.remove(
                    "retry"
                );

            }


            if (optionsContainer) {

                optionsContainer
                    .querySelectorAll(
                        ".rm10-option"
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
         * Correct answer:
         * move to next question.
         */

        if (
            currentQuestion <
            questions.length - 1
        ) {

            currentQuestion++;

            loadQuestion();

            return;

        }


        /* =================================================
           FINAL RESULT
        ================================================== */

        showFinalResult();

    }


    /* =====================================================
       FINAL RESULT
    ===================================================== */

    function showFinalResult() {

        if (questionCard) {

            questionCard.hidden =
                true;

        }


        if (assessmentResult) {

            assessmentResult.hidden =
                false;

        }


        if (finalScore) {

            finalScore.textContent =
                `${score} / ${questions.length}`;

        }


        /*
         * 8/10 or higher = passed.
         */

        if (
            score >= 8
        ) {

            if (finalTitle) {

                finalTitle.textContent =
                    "Risk Management Mastery Achieved";

            }


            if (finalMessage) {

                finalMessage.textContent =
                    `Excellent work. You scored ${score} out of ${questions.length} and passed the final Risk Management assessment.`;

            }

        }

        else {

            if (finalTitle) {

                finalTitle.textContent =
                    "Keep Practicing";

            }


            if (finalMessage) {

                finalMessage.textContent =
                    `You scored ${score} out of ${questions.length}. Review the Risk Management builds and try the assessment again.`;

            }

        }

    }


    /* =====================================================
       RETRY ENTIRE ASSESSMENT
    ===================================================== */

    function retryAssessment() {

        currentQuestion =
            0;

        score =
            0;

        answered =
            false;


        if (assessmentResult) {

            assessmentResult.hidden =
                true;

        }


        if (questionCard) {

            questionCard.hidden =
                false;

        }


        loadQuestion();

    }


    /* =====================================================
       EVENTS
    ===================================================== */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            handleNext
        );

    }


    if (retryButton) {

        retryButton.addEventListener(
            "click",
            retryAssessment
        );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    loadQuestion();


    /* =====================================================
       BUILD STATUS
    ===================================================== */

    console.log(
        "Strativo Academy — Risk Management Build 010 loaded successfully."
    );


})();