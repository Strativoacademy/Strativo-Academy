/* ============================================================
   STRATIVO ACADEMY
   MODULE 1 FINAL QUIZ
   Forex Basics - Final Assessment
   ============================================================ */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       CONFIGURATION
    ======================================================== */

    const QUIZ_CONFIG = {
        totalQuestions: 20,
        timeLimitSeconds: 15 * 60,
        passingScore: 80,
        storagePrefix: "strativo_module1_final_quiz"
    };


    /* ========================================================
       STORAGE KEYS
    ======================================================== */

    const STORAGE = {
        started: `${QUIZ_CONFIG.storagePrefix}_started`,
        completed: `${QUIZ_CONFIG.storagePrefix}_completed`,
        passed: `${QUIZ_CONFIG.storagePrefix}_passed`,
        score: `${QUIZ_CONFIG.storagePrefix}_score`,
        total: `${QUIZ_CONFIG.storagePrefix}_total`,
        percentage: `${QUIZ_CONFIG.storagePrefix}_percentage`,
        answers: `${QUIZ_CONFIG.storagePrefix}_answers`,
        currentQuestion: `${QUIZ_CONFIG.storagePrefix}_current_question`,
        remainingTime: `${QUIZ_CONFIG.storagePrefix}_remaining_time`,
        shuffledQuestions: `${QUIZ_CONFIG.storagePrefix}_question_order`,
        insightUnlocked: `${QUIZ_CONFIG.storagePrefix}_insight_unlocked`
    };


    /* ========================================================
       MODULE 1 FINAL QUIZ QUESTIONS
       20 QUESTIONS
       2 QUESTIONS FROM EACH LESSON
    ======================================================== */

    const QUESTIONS = [

        /* ====================================================
           LESSON 1
           INTRODUCTION TO FOREX
        ==================================================== */

        {
            id: "m1q1",
            lesson: 1,

            question:
                "What does the foreign exchange market primarily allow participants to do?",

            options: [
                {
                    value: "A",
                    label: "Exchange one currency for another",
                    feedback:
                        "The Forex market facilitates the exchange of one currency against another."
                },
                {
                    value: "B",
                    label: "Trade company ownership only",
                    feedback:
                        "Company ownership is associated with equity markets rather than being the primary function of Forex."
                },
                {
                    value: "C",
                    label: "Purchase physical commodities only",
                    feedback:
                        "Commodities can be traded in financial markets, but purchasing physical commodities is not the primary function of Forex."
                },
                {
                    value: "D",
                    label: "Set fixed prices for every global currency",
                    feedback:
                        "Forex does not set one permanent fixed price for every currency."
                }
            ],

            correct: "A",

            hint:
                "Think about what happens when one country's currency is converted into another country's currency."
        },


        {
            id: "m1q2",
            lesson: 1,

            question:
                "Why is the Forex market different from a traditional centralized stock exchange?",

            options: [
                {
                    value: "A",
                    label: "Forex operates through a global network rather than one central exchange",
                    feedback:
                        "The global foreign exchange market operates through a decentralized over-the-counter network."
                },
                {
                    value: "B",
                    label: "Forex has no buyers or sellers",
                    feedback:
                        "Forex depends on buyers and sellers interacting throughout the market."
                },
                {
                    value: "C",
                    label: "Forex trades only during one country's business hours",
                    feedback:
                        "Forex trading occurs across major financial centers around the world."
                },
                {
                    value: "D",
                    label: "Forex prices are permanently fixed by one institution",
                    feedback:
                        "Currency prices change as market participants buy and sell currencies."
                }
            ],

            correct: "A",

            hint:
                "Consider whether global currency trading is controlled by one physical exchange."
        },


        /* ====================================================
           LESSON 2
           CURRENCY PAIRS & EXCHANGE RATES
        ==================================================== */

        {
            id: "m1q3",
            lesson: 2,

            question:
                "In EUR/USD, which currency is the base currency?",

            options: [
                {
                    value: "A",
                    label: "EUR",
                    feedback:
                        "The currency written first in a currency pair is the base currency."
                },
                {
                    value: "B",
                    label: "USD",
                    feedback:
                        "USD is the quote currency in EUR/USD."
                },
                {
                    value: "C",
                    label: "Both EUR and USD equally",
                    feedback:
                        "A currency pair has one base currency and one quote currency."
                },
                {
                    value: "D",
                    label: "Neither currency",
                    feedback:
                        "The first currency in the pair is specifically designated as the base currency."
                }
            ],

            correct: "A",

            hint:
                "Look at the currency that appears on the left side of the pair."
        },


        {
            id: "m1q4",
            lesson: 2,

            question:
                "If EUR/USD is quoted at 1.1000, what does the quote indicate?",

            options: [
                {
                    value: "A",
                    label: "1 EUR is worth 1.1000 USD",
                    feedback:
                        "The quote expresses the value of one unit of the base currency in the quote currency."
                },
                {
                    value: "B",
                    label: "1 USD is worth 1.1000 EUR",
                    feedback:
                        "That would represent the inverse relationship rather than the direct EUR/USD quote."
                },
                {
                    value: "C",
                    label: "100 EUR is worth 1.1000 USD",
                    feedback:
                        "The quote applies to one unit of the base currency, not 100 units."
                },
                {
                    value: "D",
                    label: "EUR and USD have exactly the same value",
                    feedback:
                        "A quote of 1.1000 means one euro is valued at 1.1000 US dollars, not equal currency values."
                }
            ],

            correct: "A",

            hint:
                "Read the pair from left to right and interpret the number as the value of one unit of the first currency."
        },


        /* ====================================================
           LESSON 3
           MARKET SESSIONS
        ==================================================== */

        {
            id: "m1q5",
            lesson: 3,

            question:
                "Which major Forex session is centered around the United Kingdom and European financial markets?",

            options: [
                {
                    value: "A",
                    label: "London session",
                    feedback:
                        "The London session is centered around the United Kingdom and is a major European trading session."
                },
                {
                    value: "B",
                    label: "Sydney session",
                    feedback:
                        "Sydney is associated with the Asia-Pacific market rather than the European session."
                },
                {
                    value: "C",
                    label: "New York session",
                    feedback:
                        "New York is the major North American session."
                },
                {
                    value: "D",
                    label: "Tokyo session",
                    feedback:
                        "Tokyo represents a major Asian trading center."
                }
            ],

            correct: "A",

            hint:
                "Think of the major financial center located in the United Kingdom."
        },


        {
            id: "m1q6",
            lesson: 3,

            question:
                "Why can overlapping major Forex sessions be important to traders?",

            options: [
                {
                    value: "A",
                    label: "They can bring greater market activity and liquidity",
                    feedback:
                        "When major financial centers are active at the same time, trading activity and available liquidity can increase."
                },
                {
                    value: "B",
                    label: "They guarantee profitable trades",
                    feedback:
                        "Higher activity does not guarantee that a trade will be profitable."
                },
                {
                    value: "C",
                    label: "They eliminate market risk",
                    feedback:
                        "Market risk remains present regardless of the trading session."
                },
                {
                    value: "D",
                    label: "They permanently stop price movement",
                    feedback:
                        "Session overlaps do not stop price movement."
                }
            ],

            correct: "A",

            hint:
                "Think about what happens when more major market participants are active simultaneously."
        },


        /* ====================================================
           LESSON 4
           WHO TRADES FOREX
        ==================================================== */

        {
            id: "m1q7",
            lesson: 4,

            question:
                "Which participant may use Forex markets to manage currency exposure from international business activities?",

            options: [
                {
                    value: "A",
                    label: "A multinational corporation",
                    feedback:
                        "Multinational corporations may use currency markets to manage exposure created by international transactions."
                },
                {
                    value: "B",
                    label: "Only a retail trader",
                    feedback:
                        "Retail traders participate in Forex, but they are not the only participants."
                },
                {
                    value: "C",
                    label: "Only a stock exchange",
                    feedback:
                        "A stock exchange is a marketplace rather than a currency-trading participant managing business exposure."
                },
                {
                    value: "D",
                    label: "Only a charting application",
                    feedback:
                        "A charting application displays information but is not itself a currency-market participant."
                }
            ],

            correct: "A",

            hint:
                "Think about a company that earns revenue or pays expenses in multiple currencies."
        },


        {
            id: "m1q8",
            lesson: 4,

            question:
                "Which group is one of the major institutional participants in the global Forex market?",

            options: [
                {
                    value: "A",
                    label: "Commercial and investment banks",
                    feedback:
                        "Banks are major participants in global foreign exchange activity."
                },
                {
                    value: "B",
                    label: "Only individual hobbyists",
                    feedback:
                        "Retail individuals participate, but institutional Forex activity is much broader."
                },
                {
                    value: "C",
                    label: "Only chart developers",
                    feedback:
                        "Chart developers provide software and tools but are not the only major market participants."
                },
                {
                    value: "D",
                    label: "Only social media users",
                    feedback:
                        "Social media users are not a defined major institutional Forex participant group."
                }
            ],

            correct: "A",

            hint:
                "Think about financial institutions that handle large currency transactions."
        },


        /* ====================================================
           LESSON 5
           PIPS
        ==================================================== */

        {
            id: "m1q9",
            lesson: 5,

            question:
                "For a standard four-decimal EUR/USD quote, how much is one pip?",

            options: [
                {
                    value: "A",
                    label: "0.0001",
                    feedback:
                        "For most non-JPY major currency pairs quoted to four decimal places, one pip is 0.0001."
                },
                {
                    value: "B",
                    label: "0.0010",
                    feedback:
                        "0.0010 represents ten pips under a four-decimal quote."
                },
                {
                    value: "C",
                    label: "0.0100",
                    feedback:
                        "0.0100 represents a much larger price movement than one pip."
                },
                {
                    value: "D",
                    label: "1.0000",
                    feedback:
                        "A movement of 1.0000 is far larger than one pip."
                }
            ],

            correct: "A",

            hint:
                "For this question, use the standard four-decimal convention for EUR/USD."
        },


        {
            id: "m1q10",
            lesson: 5,

            question:
                "EUR/USD moves from 1.1000 to 1.1050. How many pips is the movement?",

            options: [
                {
                    value: "A",
                    label: "5 pips",
                    feedback:
                        "The price difference is 0.0050. Dividing by 0.0001 gives 50 pips, so 5 pips is too small."
                },
                {
                    value: "B",
                    label: "50 pips",
                    feedback:
                        "The difference is 1.1050 − 1.1000 = 0.0050. Dividing 0.0050 by 0.0001 gives 50 pips."
                },
                {
                    value: "C",
                    label: "500 pips",
                    feedback:
                        "A 500-pip movement would require a price difference of 0.0500 under this convention."
                },
                {
                    value: "D",
                    label: "5000 pips",
                    feedback:
                        "A 5000-pip movement would require a much larger price difference than 0.0050."
                }
            ],

            correct: "B",

            hint:
                "First calculate the price difference, then divide it by 0.0001."
        },


        /* ====================================================
           LESSON 6
           LOT SIZES & POSITION SIZING
        ==================================================== */

        {
            id: "m1q11",
            lesson: 6,

            question:
                "In the commonly used Forex lot-size convention, what does one standard lot represent for a currency pair?",

            options: [
                {
                    value: "A",
                    label: "100,000 units of the base currency",
                    feedback:
                        "A standard Forex lot is commonly defined as 100,000 units of the base currency."
                },
                {
                    value: "B",
                    label: "10,000 units of the base currency",
                    feedback:
                        "10,000 units is commonly associated with a mini lot."
                },
                {
                    value: "C",
                    label: "1,000 units of the base currency",
                    feedback:
                        "1,000 units is commonly associated with a micro lot."
                },
                {
                    value: "D",
                    label: "100 units of the base currency",
                    feedback:
                        "100 units is smaller than the commonly defined micro-lot size."
                }
            ],

            correct: "A",

            hint:
                "Recall the standard lot hierarchy: standard, mini, micro, and nano."
        },


        {
            id: "m1q12",
            lesson: 6,

            question:
                "Why is position sizing important in Forex trading?",

            options: [
                {
                    value: "A",
                    label: "It determines how much market exposure a trade has",
                    feedback:
                        "Position size directly affects the amount of market exposure and therefore the potential gain or loss."
                },
                {
                    value: "B",
                    label: "It guarantees a winning trade",
                    feedback:
                        "Position sizing cannot guarantee that a trade will win."
                },
                {
                    value: "C",
                    label: "It removes the need for risk management",
                    feedback:
                        "Position sizing is itself an important part of risk management."
                },
                {
                    value: "D",
                    label: "It determines the direction of the currency market",
                    feedback:
                        "A trader's position size does not determine the overall direction of the currency market."
                }
            ],

            correct: "A",

            hint:
                "Think about how changing trade size changes the amount gained or lost when price moves."
        },


        /* ====================================================
           LESSON 7
           LEVERAGE & MARGIN
        ==================================================== */

        {
            id: "m1q13",
            lesson: 7,

            question:
                "What does leverage primarily allow a trader to do?",

            options: [
                {
                    value: "A",
                    label: "Control a larger position relative to their available capital",
                    feedback:
                        "Leverage allows a trader to obtain greater market exposure relative to the capital committed."
                },
                {
                    value: "B",
                    label: "Guarantee larger profits",
                    feedback:
                        "Leverage does not guarantee profits."
                },
                {
                    value: "C",
                    label: "Eliminate losses",
                    feedback:
                        "Leverage does not eliminate losses and can increase the impact of losses."
                },
                {
                    value: "D",
                    label: "Predict the next candle with certainty",
                    feedback:
                        "Leverage has no ability to predict future price movement."
                }
            ],

            correct: "A",

            hint:
                "Leverage changes the amount of exposure available relative to the capital used."
        },


        {
            id: "m1q14",
            lesson: 7,

            question:
                "Why can high leverage increase risk?",

            options: [
                {
                    value: "A",
                    label: "A given price movement can have a larger effect on account equity",
                    feedback:
                        "Greater exposure means the same market movement can produce a larger gain or loss relative to the account."
                },
                {
                    value: "B",
                    label: "High leverage prevents price movement",
                    feedback:
                        "Leverage does not prevent or control market price movement."
                },
                {
                    value: "C",
                    label: "High leverage removes the spread",
                    feedback:
                        "Leverage does not remove the bid-ask spread."
                },
                {
                    value: "D",
                    label: "High leverage guarantees that margin is never required",
                    feedback:
                        "Leverage does not remove margin requirements."
                }
            ],

            correct: "A",

            hint:
                "Consider what happens when a larger position is exposed to the same price movement."
        },


        /* ====================================================
           LESSON 8
           BID, ASK & SPREAD
        ==================================================== */

        {
            id: "m1q15",
            lesson: 8,

            question:
                "What is the spread in a Forex quote?",

            options: [
                {
                    value: "A",
                    label: "The difference between the ask price and the bid price",
                    feedback:
                        "The spread is the difference between the ask and bid prices."
                },
                {
                    value: "B",
                    label: "The total account balance",
                    feedback:
                        "Account balance is unrelated to the definition of the spread."
                },
                {
                    value: "C",
                    label: "The distance between two trading sessions",
                    feedback:
                        "Trading sessions are time periods and are not the definition of the bid-ask spread."
                },
                {
                    value: "D",
                    label: "The difference between two currency pairs",
                    feedback:
                        "The spread is calculated within a quoted market by comparing its ask and bid prices."
                }
            ],

            correct: "A",

            hint:
                "Look at the two prices a broker commonly displays for the same currency pair."
        },


        {
            id: "m1q16",
            lesson: 8,

            question:
                "A EUR/USD quote shows Bid 1.1050 and Ask 1.1052. What is the spread?",

            options: [
                {
                    value: "A",
                    label: "0.0001",
                    feedback:
                        "The difference is 1.1052 − 1.1050 = 0.0002, so 0.0001 is half the spread."
                },
                {
                    value: "B",
                    label: "0.0002",
                    feedback:
                        "The spread is 1.1052 − 1.1050 = 0.0002."
                },
                {
                    value: "C",
                    label: "0.0020",
                    feedback:
                        "0.0020 is ten times larger than the displayed 0.0002 difference."
                },
                {
                    value: "D",
                    label: "0.0200",
                    feedback:
                        "0.0200 is much larger than the difference between the displayed bid and ask prices."
                }
            ],

            correct: "B",

            hint:
                "Subtract the bid price from the ask price."
        },


        /* ====================================================
           LESSON 9
           TYPES OF ORDERS
        ==================================================== */

        {
            id: "m1q17",
            lesson: 9,

            question:
                "Which order type is generally used to enter a trade immediately at the available market price?",

            options: [
                {
                    value: "A",
                    label: "Market order",
                    feedback:
                        "A market order is designed to execute at the available market price."
                },
                {
                    value: "B",
                    label: "Limit order",
                    feedback:
                        "A limit order specifies a price condition rather than simply requesting immediate execution at the available market price."
                },
                {
                    value: "C",
                    label: "Stop-limit cancellation",
                    feedback:
                        "This is not the standard order type used simply for immediate market execution."
                },
                {
                    value: "D",
                    label: "Pending-free order",
                    feedback:
                        "This is not a standard Forex order type."
                }
            ],

            correct: "A",

            hint:
                "Think of the order used when the trader wants execution at the currently available market price."
        },


        {
            id: "m1q18",
            lesson: 9,

            question:
                "What is a key characteristic of a limit order?",

            options: [
                {
                    value: "A",
                    label: "It specifies a desired price or better",
                    feedback:
                        "A limit order is placed at a specified price or a more favorable price, subject to market availability."
                },
                {
                    value: "B",
                    label: "It guarantees execution regardless of price",
                    feedback:
                        "A limit order does not guarantee execution if the specified price is not reached or available."
                },
                {
                    value: "C",
                    label: "It removes all trading costs",
                    feedback:
                        "A limit order does not remove trading costs such as spread or other applicable costs."
                },
                {
                    value: "D",
                    label: "It guarantees a profitable trade",
                    feedback:
                        "An order type cannot guarantee that the resulting trade will be profitable."
                }
            ],

            correct: "A",

            hint:
                "The important feature is the price condition attached to the order."
        },


        /* ====================================================
           LESSON 10
           INTRODUCTION TO METATRADER
        ==================================================== */

        {
            id: "m1q19",
            lesson: 10,

            question:
                "What is MetaTrader primarily used for by Forex traders?",

            options: [
                {
                    value: "A",
                    label: "Analyzing charts and placing trading orders",
                    feedback:
                        "MetaTrader is a trading platform commonly used for chart analysis, order execution, and account management."
                },
                {
                    value: "B",
                    label: "Replacing the global banking system",
                    feedback:
                        "MetaTrader is trading software, not a replacement for the global banking system."
                },
                {
                    value: "C",
                    label: "Guaranteeing profitable trades",
                    feedback:
                        "A trading platform cannot guarantee profitable trades."
                },
                {
                    value: "D",
                    label: "Setting the global exchange rate",
                    feedback:
                        "MetaTrader does not set global currency exchange rates."
                }
            ],

            correct: "A",

            hint:
                "Think about the tools a trader needs to view prices and send orders."
        },


        {
            id: "m1q20",
            lesson: 10,

            question:
                "Why is learning the MetaTrader interface useful before placing live trades?",

            options: [
                {
                    value: "A",
                    label: "It helps the trader understand the platform before risking real money",
                    feedback:
                        "Learning the interface first reduces avoidable platform-use mistakes before trading with real funds."
                },
                {
                    value: "B",
                    label: "It guarantees that every order will be profitable",
                    feedback:
                        "Platform familiarity does not guarantee profitable trades."
                },
                {
                    value: "C",
                    label: "It eliminates market volatility",
                    feedback:
                        "Learning the platform does not change market volatility."
                },
                {
                    value: "D",
                    label: "It removes the need to understand risk",
                    feedback:
                        "Platform knowledge does not replace risk management."
                }
            ],

            correct: "A",

            hint:
                "Consider why traders should become familiar with a tool before using it with real money."
        }

    ];


    /* ========================================================
       STRATIVO INSIGHT
    ======================================================== */

    const STRATIVO_INSIGHTS = [

        {
            number: "01",
            title: "Forex Has No Single Central Exchange",
            text:
                "Unlike a centralized stock exchange, the global foreign exchange market operates through a decentralized over-the-counter network of participants."
        },

        {
            number: "02",
            title: "The Price You See Has Two Sides",
            text:
                "A Forex quote normally contains a bid and an ask. Understanding both sides helps explain why a new position can begin with a small negative result."
        },

        {
            number: "03",
            title: "Institutions Have Different Reasons to Trade",
            text:
                "Banks, corporations, asset managers and other institutions may participate for payments, hedging, liquidity, investment and other purposes—not simply speculation."
        },

        {
            number: "04",
            title: "Liquidity Can Change",
            text:
                "The amount of available buying and selling interest is not constant. Market conditions can change around major sessions, news and periods of reduced participation."
        },

        {
            number: "05",
            title: "Leverage Is Exposure, Not Skill",
            text:
                "Leverage can increase the amount of market exposure controlled by a trader, but it does not improve the quality of the trading decision."
        },

        {
            number: "06",
            title: "Execution Is Not the Same as Prediction",
            text:
                "Knowing how to place an order correctly and predicting where price will move are two different skills. A perfect platform setup cannot make an uncertain prediction certain."
        },

        {
            number: "07",
            title: "A Bigger Position Is Not a Better Trade",
            text:
                "Increasing position size increases exposure. A larger position does not automatically mean a better opportunity or a higher-quality setup."
        }

    ];


    /* ========================================================
       DOM ELEMENTS
    ======================================================== */

    const introSection =
        document.getElementById("quiz-intro");

    const activeSection =
        document.getElementById("quiz-active");

    const resultSection =
        document.getElementById("quiz-result");

    const insightSection =
        document.getElementById("strativo-insight");


    const startButton =
        document.getElementById("start-quiz-btn");

    const previousButton =
        document.getElementById("previous-question-btn");

    const nextButton =
        document.getElementById("next-question-btn");

    const submitButton =
        document.getElementById("submit-quiz-btn");

    const retryButton =
        document.getElementById("retry-quiz-btn");

    const hintToggle =
        document.getElementById("hint-toggle");

    const hintBox =
        document.getElementById("quiz-hint");

    const answerOptions =
        document.getElementById("answer-options");

    const questionText =
        document.getElementById("question-text");

    const questionCounter =
        document.getElementById("question-counter");

    const currentQuestionNumber =
        document.getElementById("current-question-number");

    const percentageDisplay =
        document.getElementById("quiz-percentage");

    const progressFill =
        document.getElementById("quiz-progress-fill");

    const timerDisplay =
        document.getElementById("timer-display");


    const resultScore =
        document.getElementById("result-score");

    const resultPercentage =
        document.getElementById("result-percentage");

    const resultCorrect =
        document.getElementById("result-correct");

    const resultIncorrect =
        document.getElementById("result-incorrect");

    const resultTitle =
        document.getElementById("result-title");

    const resultDescription =
        document.getElementById("result-description");

    const resultIcon =
        document.getElementById("result-icon");

    const resultEyebrow =
        document.getElementById("result-eyebrow");

    const passMessage =
        document.getElementById("result-pass-message");

    const failMessage =
        document.getElementById("result-fail-message");

    const insightButton =
        document.getElementById("open-insight-btn");

    const insightList =
        document.getElementById("insight-list");


    /* ========================================================
       QUIZ STATE
    ======================================================== */

    let currentQuestion = 0;

    let selectedAnswers = {};

    let remainingSeconds =
        QUIZ_CONFIG.timeLimitSeconds;

    let timerInterval = null;

    let quizStarted = false;

    let quizFinished = false;

    let shuffledQuestions = [];


    /* ========================================================
       SAFE LOCAL STORAGE
    ======================================================== */

    function storageGet(key) {

        try {

            return localStorage.getItem(key);

        }

        catch (error) {

            console.warn(
                "Strativo Module 1 Quiz: localStorage read failed.",
                error
            );

            return null;

        }

    }


    function storageSet(key, value) {

        try {

            localStorage.setItem(
                key,
                value
            );

        }

        catch (error) {

            console.warn(
                "Strativo Module 1 Quiz: localStorage write failed.",
                error
            );

        }

    }


    function storageRemove(key) {

        try {

            localStorage.removeItem(key);

        }

        catch (error) {

            console.warn(
                "Strativo Module 1 Quiz: localStorage remove failed.",
                error
            );

        }

    }


    /* ========================================================
       SHUFFLE
    ======================================================== */

    function shuffleArray(array) {

        const result =
            [...array];


        for (
            let i = result.length - 1;
            i > 0;
            i--
        ) {

            const randomIndex =
                Math.floor(
                    Math.random() * (i + 1)
                );


            [
                result[i],
                result[randomIndex]
            ] = [
                result[randomIndex],
                result[i]
            ];

        }


        return result;

    }


    function createQuestionOrder() {

        return shuffleArray(
            QUESTIONS.map(
                question => question.id
            )
        );

    }


    function getQuestionById(id) {

        return QUESTIONS.find(
            question =>
                question.id === id
        );

    }


    /* ========================================================
       SAVE QUIZ STATE
    ======================================================== */

    function saveQuizState() {

        if (quizFinished) {
            return;
        }


        storageSet(
            STORAGE.started,
            "true"
        );


        storageSet(
            STORAGE.answers,
            JSON.stringify(
                selectedAnswers
            )
        );


        storageSet(
            STORAGE.currentQuestion,
            String(
                currentQuestion
            )
        );


        storageSet(
            STORAGE.remainingTime,
            String(
                remainingSeconds
            )
        );


        storageSet(
            STORAGE.shuffledQuestions,
            JSON.stringify(
                shuffledQuestions
            )
        );

    }


    /* ========================================================
       LOAD QUIZ STATE
    ======================================================== */

    function loadQuizState() {

        const savedAnswers =
            storageGet(
                STORAGE.answers
            );

        const savedQuestion =
            storageGet(
                STORAGE.currentQuestion
            );

        const savedTime =
            storageGet(
                STORAGE.remainingTime
            );

        const savedOrder =
            storageGet(
                STORAGE.shuffledQuestions
            );


        if (savedAnswers) {

            try {

                selectedAnswers =
                    JSON.parse(
                        savedAnswers
                    ) || {};

            }

            catch {

                selectedAnswers = {};

            }

        }


        if (savedQuestion !== null) {

            const parsedQuestion =
                Number(
                    savedQuestion
                );


            if (
                Number.isInteger(
                    parsedQuestion
                ) &&
                parsedQuestion >= 0 &&
                parsedQuestion < QUESTIONS.length
            ) {

                currentQuestion =
                    parsedQuestion;

            }

        }


        if (savedTime !== null) {

            const parsedTime =
                Number(
                    savedTime
                );


            if (
                Number.isFinite(
                    parsedTime
                ) &&
                parsedTime >= 0
            ) {

                remainingSeconds =
                    Math.min(
                        parsedTime,
                        QUIZ_CONFIG.timeLimitSeconds
                    );

            }

        }


        if (savedOrder) {

            try {

                const parsedOrder =
                    JSON.parse(
                        savedOrder
                    );


                if (
                    Array.isArray(
                        parsedOrder
                    ) &&
                    parsedOrder.length ===
                        QUESTIONS.length
                ) {

                    shuffledQuestions =
                        parsedOrder;

                }

            }

            catch {

                shuffledQuestions = [];

            }

        }


        if (
            shuffledQuestions.length !==
            QUESTIONS.length
        ) {

            shuffledQuestions =
                createQuestionOrder();

        }

    }


    /* ========================================================
       FORMAT TIMER
    ======================================================== */

    function formatTime(seconds) {

        const safeSeconds =
            Math.max(
                0,
                Math.floor(
                    seconds
                )
            );


        const minutes =
            Math.floor(
                safeSeconds / 60
            );


        const secondsPart =
            safeSeconds % 60;


        return (
            `${String(minutes).padStart(2, "0")}:` +
            `${String(secondsPart).padStart(2, "0")}`
        );

    }


    /* ========================================================
       TIMER DISPLAY
    ======================================================== */

    function updateTimerDisplay() {

        if (!timerDisplay) {
            return;
        }


        timerDisplay.textContent =
            formatTime(
                remainingSeconds
            );


        const timer =
            document.getElementById(
                "quiz-timer"
            );


        if (!timer) {
            return;
        }


        timer.classList.remove(
            "warning",
            "danger"
        );


        if (
            remainingSeconds <= 60
        ) {

            timer.classList.add(
                "danger"
            );

        }

        else if (
            remainingSeconds <= 300
        ) {

            timer.classList.add(
                "warning"
            );

        }

    }


    /* ========================================================
       START TIMER
    ======================================================== */

    function startTimer() {

        stopTimer();

        updateTimerDisplay();


        timerInterval =
            setInterval(
                () => {

                    if (
                        !quizStarted ||
                        quizFinished
                    ) {
                        return;
                    }


                    remainingSeconds--;


                    updateTimerDisplay();

                    saveQuizState();


                    if (
                        remainingSeconds <= 0
                    ) {

                        remainingSeconds = 0;

                        stopTimer();

                        submitQuiz(
                            true
                        );

                    }

                },
                1000
            );

    }


    /* ========================================================
       STOP TIMER
    ======================================================== */

    function stopTimer() {

        if (timerInterval) {

            clearInterval(
                timerInterval
            );

            timerInterval = null;

        }

    }


    /* ========================================================
       SHOW ONLY ONE QUIZ SECTION
    ======================================================== */

    function showSection(section) {

        const sections = [
            introSection,
            activeSection,
            resultSection,
            insightSection
        ];


        sections.forEach(
            element => {

                if (!element) {
                    return;
                }


                const isActive =
                    element === section;


                element.hidden =
                    !isActive;


                element.setAttribute(
                    "aria-hidden",
                    String(
                        !isActive
                    )
                );


                /*
                 * Extra protection against
                 * multiple quiz screens appearing.
                 */

                element.style.display =
                    isActive
                        ? ""
                        : "none";

            }
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* ========================================================
       ESCAPE HTML
    ======================================================== */

    function escapeHTML(value) {

        return String(value)

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* ========================================================
       RENDER QUESTION
    ======================================================== */

    function renderQuestion() {

        if (
            !shuffledQuestions.length
        ) {
            return;
        }


        const questionId =
            shuffledQuestions[
                currentQuestion
            ];


        const question =
            getQuestionById(
                questionId
            );


        if (!question) {
            return;
        }


        /* ================================================
           QUESTION TEXT
        ================================================= */

        questionText.textContent =
            question.question;


        currentQuestionNumber.textContent =
            String(
                currentQuestion + 1
            );


        questionCounter.textContent =
            `Question ${currentQuestion + 1} of ${QUESTIONS.length}`;


        /* ================================================
           PROGRESS
        ================================================= */

        const percentage =
            Math.round(
                (
                    (currentQuestion + 1) /
                    QUESTIONS.length
                ) * 100
            );


        percentageDisplay.textContent =
            `${percentage}%`;


        progressFill.style.width =
            `${percentage}%`;


        /* ================================================
           HINT
        ================================================= */

        hintBox.textContent =
            question.hint;


        hintBox.hidden =
            true;


        const hintLabel =
            hintToggle?.querySelector(
                "span"
            );


        if (hintLabel) {

            hintLabel.textContent =
                "Show Hint";

        }


        /* ================================================
           ANSWERS
        ================================================= */

        answerOptions.innerHTML =
            "";


        const shuffledOptions =
            shuffleArray(
                question.options
            );


        shuffledOptions.forEach(
            option => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    "answer-option";


                button.dataset.value =
                    option.value;


                button.innerHTML = `

                    <span class="answer-letter">
                        ${escapeHTML(option.value)}
                    </span>

                    <span class="answer-text">
                        ${escapeHTML(option.label)}
                    </span>

                    <span class="answer-check">
                        <i class="fa-solid fa-check"></i>
                    </span>

                `;


                if (
                    selectedAnswers[
                        question.id
                    ] === option.value
                ) {

                    button.classList.add(
                        "selected"
                    );

                }


                button.addEventListener(
                    "click",
                    () => {

                        selectAnswer(
                            question,
                            option.value
                        );

                    }
                );


                answerOptions.appendChild(
                    button
                );

            }
        );


        /* ================================================
           NAVIGATION
        ================================================= */

        previousButton.disabled =
            currentQuestion === 0;


        const isLastQuestion =
            currentQuestion ===
            QUESTIONS.length - 1;


        nextButton.hidden =
            isLastQuestion;


        submitButton.hidden =
            !isLastQuestion;


        updateTimerDisplay();

    }


    /* ========================================================
       SELECT ANSWER
    ======================================================== */

    function selectAnswer(
        question,
        answerValue
    ) {

        selectedAnswers[
            question.id
        ] = answerValue;


        const buttons =
            answerOptions.querySelectorAll(
                ".answer-option"
            );


        buttons.forEach(
            button => {

                button.classList.toggle(
                    "selected",
                    button.dataset.value ===
                        answerValue
                );

            }
        );


        saveQuizState();

    }


    /* ========================================================
       CHECK CURRENT ANSWER
    ======================================================== */

    function hasCurrentAnswer() {

        if (
            !shuffledQuestions.length
        ) {
            return false;
        }


        const questionId =
            shuffledQuestions[
                currentQuestion
            ];


        return Boolean(
            selectedAnswers[
                questionId
            ]
        );

    }


    /* ========================================================
       NEXT QUESTION
    ======================================================== */

    function goToNextQuestion() {

        if (
            !hasCurrentAnswer()
        ) {

            showQuestionWarning(
                "Please select an answer before continuing."
            );

            return;

        }


        if (
            currentQuestion <
            QUESTIONS.length - 1
        ) {

            currentQuestion++;


            saveQuizState();


            renderQuestion();

        }

    }


    /* ========================================================
       PREVIOUS QUESTION
    ======================================================== */

    function goToPreviousQuestion() {

        if (
            currentQuestion <= 0
        ) {
            return;
        }


        currentQuestion--;


        saveQuizState();


        renderQuestion();

    }


    /* ========================================================
       QUESTION WARNING
    ======================================================== */

    function showQuestionWarning(
        message
    ) {

        const card =
            document.getElementById(
                "question-card"
            );


        if (!card) {
            return;
        }


        card.classList.remove(
            "quiz-warning-shake"
        );


        void card.offsetWidth;


        card.classList.add(
            "quiz-warning-shake"
        );


        let warning =
            card.querySelector(
                ".quiz-inline-warning"
            );


        if (!warning) {

            warning =
                document.createElement(
                    "div"
                );


            warning.className =
                "quiz-inline-warning";


            const navigation =
                card.querySelector(
                    ".question-navigation"
                );


            if (navigation) {

                navigation.before(
                    warning
                );

            }

            else {

                card.appendChild(
                    warning
                );

            }

        }


        warning.textContent =
            message;


        clearTimeout(
            warning._hideTimer
        );


        warning._hideTimer =
            setTimeout(
                () => {

                    if (warning) {

                        warning.remove();

                    }

                },
                3000
            );

    }


    /* ========================================================
       START / CONTINUE / RETAKE QUIZ
    ======================================================== */

    function startQuiz() {

        const existingAttempt =
            storageGet(
                STORAGE.started
            ) === "true" &&
            storageGet(
                STORAGE.completed
            ) !== "true";


        const previousResult =
            storageGet(
                STORAGE.completed
            ) === "true";


        /*
         * Continue existing unfinished quiz.
         */

        if (
            existingAttempt
        ) {

            loadQuizState();

        }


        /*
         * Start a fresh quiz.
         */

        else {

            selectedAnswers = {};

            currentQuestion = 0;

            remainingSeconds =
                QUIZ_CONFIG.timeLimitSeconds;

            shuffledQuestions =
                createQuestionOrder();


            /*
             * Clear previous result
             * when starting a retake.
             */

            if (
                previousResult
            ) {

                storageRemove(
                    STORAGE.completed
                );

                storageRemove(
                    STORAGE.passed
                );

                storageRemove(
                    STORAGE.score
                );

                storageRemove(
                    STORAGE.total
                );

                storageRemove(
                    STORAGE.percentage
                );

                storageRemove(
                    STORAGE.insightUnlocked
                );

            }


            storageSet(
                STORAGE.started,
                "true"
            );

        }


        quizStarted = true;

        quizFinished = false;


        showSection(
            activeSection
        );


        renderQuestion();


        startTimer();


        saveQuizState();

    }


    /* ========================================================
       SUBMIT QUIZ
    ======================================================== */

    function submitQuiz(
        timedOut = false
    ) {

        if (
            quizFinished
        ) {
            return;
        }


        /* ================================================
           CHECK UNANSWERED QUESTIONS
        ================================================= */

        const unanswered =
            QUESTIONS.filter(
                question =>
                    !selectedAnswers[
                        question.id
                    ]
            );


        if (
            !timedOut &&
            unanswered.length > 0
        ) {

            showQuestionWarning(
                `Please answer all questions before submitting. ${unanswered.length} question${unanswered.length === 1 ? "" : "s"} remaining.`
            );


            return;

        }


        /* ================================================
           STOP TIMER
        ================================================= */

        stopTimer();


        /* ================================================
           CALCULATE SCORE
        ================================================= */

        let score = 0;


        QUESTIONS.forEach(
            question => {

                if (
                    selectedAnswers[
                        question.id
                    ] === question.correct
                ) {

                    score++;

                }

            }
        );


        const percentage =
            Math.round(
                (
                    score /
                    QUESTIONS.length
                ) * 100
            );


        const passed =
            percentage >=
            QUIZ_CONFIG.passingScore;


        quizFinished = true;

        quizStarted = false;


        /* ================================================
           SAVE FINAL RESULT
        ================================================= */

        storageSet(
            STORAGE.completed,
            "true"
        );


        storageSet(
            STORAGE.started,
            "false"
        );


        storageSet(
            STORAGE.passed,
            passed
                ? "true"
                : "false"
        );


        storageSet(
            STORAGE.score,
            String(score)
        );


        storageSet(
            STORAGE.total,
            String(
                QUESTIONS.length
            )
        );


        storageSet(
            STORAGE.percentage,
            String(
                percentage
            )
        );


        /*
         * Active attempt data is no longer needed.
         */

        storageRemove(
            STORAGE.answers
        );

        storageRemove(
            STORAGE.currentQuestion
        );

        storageRemove(
            STORAGE.remainingTime
        );

        storageRemove(
            STORAGE.shuffledQuestions
        );


        if (passed) {

            storageSet(
                STORAGE.insightUnlocked,
                "true"
            );

        }

        else {

            storageRemove(
                STORAGE.insightUnlocked
            );

        }


        /* ================================================
           NOTIFY SHARED SYSTEMS
        ================================================= */

        window.dispatchEvent(
            new CustomEvent(
                "strativo:moduleQuizCompleted",
                {
                    detail: {
                        module: 1,
                        score,
                        total:
                            QUESTIONS.length,
                        percentage,
                        passed
                    }
                }
            )
        );


        /* ================================================
           SHOW RESULT
        ================================================= */

        showResult(
            score,
            percentage,
            passed,
            timedOut
        );

    }


    /* ========================================================
       SHOW RESULT
    ======================================================== */

    function showResult(
        score,
        percentage,
        passed,
        timedOut
    ) {

        showSection(
            resultSection
        );


        resultScore.textContent =
            String(score);


        resultPercentage.textContent =
            `${percentage}%`;


        resultCorrect.textContent =
            String(score);


        resultIncorrect.textContent =
            String(
                QUESTIONS.length -
                score
            );


        passMessage.hidden =
            !passed;


        failMessage.hidden =
            passed;


        insightButton.hidden =
            !passed;


        if (passed) {

            resultIcon.innerHTML =
                `<i class="fa-solid fa-trophy"></i>`;


            resultEyebrow.textContent =
                "MODULE 1 COMPLETED";


            resultTitle.textContent =
                "Congratulations!";


            resultDescription.textContent =
                timedOut
                    ? "Time expired, but you reached the required passing score."
                    : "You successfully passed the Module 1 Final Assessment.";


            resultTitle.classList.add(
                "passed"
            );

        }


        else {

            resultIcon.innerHTML =
                `<i class="fa-solid fa-rotate-right"></i>`;


            resultEyebrow.textContent =
                "ASSESSMENT COMPLETE";


            resultTitle.textContent =
                "Keep Learning";


            resultDescription.textContent =
                timedOut
                    ? "Time expired before you reached the required passing score."
                    : "Review Module 1 and try the final assessment again.";


            resultTitle.classList.remove(
                "passed"
            );

        }


        retryButton.hidden =
            false;

    }


    /* ========================================================
       SHOW STRATIVO INSIGHT
    ======================================================== */

    function showStrativoInsight() {

        if (
            storageGet(
                STORAGE.passed
            ) !== "true"
        ) {

            return;

        }


        renderInsights();


        showSection(
            insightSection
        );

    }


    /* ========================================================
       RENDER STRATIVO INSIGHTS
    ======================================================== */

    function renderInsights() {

        if (!insightList) {
            return;
        }


        insightList.innerHTML =
            "";


        STRATIVO_INSIGHTS.forEach(
            insight => {

                const article =
                    document.createElement(
                        "article"
                    );


                article.className =
                    "insight-item";


                article.innerHTML = `

                    <div class="insight-number">
                        ${escapeHTML(insight.number)}
                    </div>

                    <div class="insight-content">

                        <h3>
                            ${escapeHTML(insight.title)}
                        </h3>

                        <p>
                            ${escapeHTML(insight.text)}
                        </p>

                    </div>

                `;


                insightList.appendChild(
                    article
                );

            }
        );

    }


    /* ========================================================
       CLEAR QUIZ STORAGE
    ======================================================== */

    function clearAttemptStorage() {

        Object.values(
            STORAGE
        ).forEach(
            storageKey => {

                storageRemove(
                    storageKey
                );

            }
        );

    }


    /* ========================================================
       RETRY QUIZ
    ======================================================== */

    function retryQuiz() {

        stopTimer();


        clearAttemptStorage();


        selectedAnswers = {};

        currentQuestion = 0;

        remainingSeconds =
            QUIZ_CONFIG.timeLimitSeconds;

        shuffledQuestions =
            createQuestionOrder();


        quizStarted = true;

        quizFinished = false;


        storageSet(
            STORAGE.started,
            "true"
        );


        showSection(
            activeSection
        );


        renderQuestion();


        startTimer();


        saveQuizState();

    }


    /* ========================================================
       TOGGLE HINT
    ======================================================== */

    function toggleHint() {

        if (!hintBox) {
            return;
        }


        const wasHidden =
            hintBox.hidden;


        hintBox.hidden =
            !wasHidden;


        const label =
            hintToggle?.querySelector(
                "span"
            );


        if (label) {

            label.textContent =
                wasHidden
                    ? "Hide Hint"
                    : "Show Hint";

        }

    }


    /* ========================================================
       EXISTING ATTEMPT
    ======================================================== */

    function hasExistingAttempt() {

        return (
            storageGet(
                STORAGE.started
            ) === "true" &&

            storageGet(
                STORAGE.completed
            ) !== "true"
        );

    }


    /* ========================================================
       PREVIOUS RESULT
    ======================================================== */

    function hasPreviousResult() {

        return (
            storageGet(
                STORAGE.completed
            ) === "true"
        );

    }


    /* ========================================================
       UPDATE START BUTTON
    ======================================================== */

    function updateStartButton() {

        if (!startButton) {
            return;
        }


        const label =
            startButton.querySelector(
                "span"
            );


        if (!label) {
            return;
        }


        if (
            hasExistingAttempt()
        ) {

            label.textContent =
                "Continue Quiz";

        }


        else if (
            hasPreviousResult()
        ) {

            label.textContent =
                "Retake Quiz";

        }


        else {

            label.textContent =
                "Start Final Quiz";

        }

    }


    /* ========================================================
       SAVE BEFORE LEAVING PAGE
    ======================================================== */

    window.addEventListener(
        "beforeunload",
        () => {

            if (
                quizStarted &&
                !quizFinished
            ) {

                saveQuizState();

            }

        }
    );


    /* ========================================================
       EVENT LISTENERS
    ======================================================== */

    if (startButton) {

        startButton.addEventListener(
            "click",
            startQuiz
        );

    }


    if (previousButton) {

        previousButton.addEventListener(
            "click",
            goToPreviousQuestion
        );

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            goToNextQuestion
        );

    }


    if (submitButton) {

        submitButton.addEventListener(
            "click",
            () => {

                submitQuiz(
                    false
                );

            }
        );

    }


    if (retryButton) {

        retryButton.addEventListener(
            "click",
            retryQuiz
        );

    }


    if (hintToggle) {

        hintToggle.addEventListener(
            "click",
            toggleHint
        );

    }


    if (insightButton) {

        insightButton.addEventListener(
            "click",
            showStrativoInsight
        );

    }


    /* ========================================================
       INITIALIZATION
    ======================================================== */

    function initialize() {

        updateStartButton();

        updateTimerDisplay();

        /*
         * Always begin on the single intro screen.
         * An unfinished attempt is resumed only when
         * the student clicks Continue Quiz.
         */

        showSection(
            introSection
        );

    }


    initialize();

});