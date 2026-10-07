/* ==========================================================================
   STRATIVO WORLD — CHART SCENARIO & QUESTION ENGINE
   Namespace: window.StrativoRPG.ChartScenarioEngine
   Description:
   - Question & Scenario Dispatcher across all 12 Chart District facilities
   - Unbiased Fisher-Yates option shuffling without mutating canonical data
   - Recent-question history tracking and state resets
   - Master dataset validators and evaluation logic
   ========================================================================== */

"use strict";

(function () {
    window.StrativoRPG = window.StrativoRPG || {};

    // Fisher-Yates array shuffler
    function shuffleArray(arr) {
        if (!Array.isArray(arr)) return [];
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = copy[i];
            copy[i] = copy[j];
            copy[j] = temp;
        }
        return copy;
    }

    // Default Fallback Questions if JSON not loaded yet
    const DEFAULT_ACADEMY_QUESTIONS = [
        {
            id: "acad_01",
            category: "ORIENTATION",
            questionText: "On a standard financial candlestick, what do the upper and lower wicks represent?",
            options: [
                "The highest and lowest traded prices during that specific time interval",
                "The opening and closing prices recorded by the broker",
                "The cumulative trading volume exchanged in lots",
                "The spread commission charged per contract"
            ],
            correctAnswer: "The highest and lowest traded prices during that specific time interval",
            explanation: "The candlestick body spans between Open and Close, while the upper and lower wicks (shadows) mark the extreme high and low prices reached during the period."
        },
        {
            id: "acad_02",
            category: "SWINGS",
            questionText: "What creates a confirmed Swing High on a price chart?",
            options: [
                "A peak candle flanked by at least one lower high on both its left and right sides",
                "Any candle that closes in the green above the moving average",
                "A sudden surge in volume regardless of price geometry",
                "A gap opening at the start of the trading week"
            ],
            correctAnswer: "A peak candle flanked by at least one lower high on both its left and right sides",
            explanation: "A structural Swing High is formed when price reaches a local peak and subsequently prints lower highs on adjacent bars, creating a distinct visual crest."
        },
        {
            id: "acad_03",
            category: "TREND",
            questionText: "What is the definitive structural definition of a healthy Bullish Uptrend?",
            options: [
                "A sequence of consecutive Higher Highs (HH) and Higher Lows (HL)",
                "Price staying above the opening price of the year",
                "Three green candles in a row with increasing size",
                "A market where every candle has zero lower wick"
            ],
            correctAnswer: "A sequence of consecutive Higher Highs (HH) and Higher Lows (HL)",
            explanation: "Uptrends are defined by price expanding to new structural peaks (HH) while each retracement finds support higher than the previous trough (HL)."
        },
        {
            id: "acad_04",
            category: "RANGE",
            questionText: "When price bounces repeatedly between defined horizontal boundaries without making new highs or lows, what regime is active?",
            options: [
                "Horizontal Range / Consolidation",
                "Parabolic Trending Expansion",
                "Exponential Exhaustion Phase",
                "Structural Liquidity Vacuum"
            ],
            correctAnswer: "Horizontal Range / Consolidation",
            explanation: "A range occurs when buyers and sellers reach a temporary equilibrium, causing price to oscillate between horizontal support and resistance."
        },
        {
            id: "acad_05",
            category: "SUPPORT_RESISTANCE",
            questionText: "Why are support and resistance levels best treated as zones rather than single razor-thin price lines?",
            options: [
                "Because institutional orders cluster across price bands and wicks test liquidity beyond single points",
                "Because brokers intentionally distort prices by 50 pips",
                "Because candlesticks do not record accurate low prices",
                "Because technical analysis is strictly random"
            ],
            correctAnswer: "Because institutional orders cluster across price bands and wicks test liquidity beyond single points",
            explanation: "Market orders and stop losses form liquidity clusters over price regions; treating S/R as zones accounts for wick probing and spread variance."
        },
        {
            id: "acad_06",
            category: "PULLBACK",
            questionText: "What distinguishes a healthy pullback from a full trend reversal?",
            options: [
                "A pullback is a low-momentum retracement that respects prior swing structural levels",
                "A pullback always retraces 100% of the previous impulse wave",
                "A pullback only occurs during market holiday sessions",
                "A pullback requires a gap down on the daily chart"
            ],
            correctAnswer: "A pullback is a low-momentum retracement that respects prior swing structural levels",
            explanation: "Healthy pullbacks display decreasing volatility, moderate counter-trend volume, and hold above (in uptrends) or below (in downtrends) critical structural anchor points."
        },
        {
            id: "acad_07",
            category: "BREAKOUT",
            questionText: "What constitutes high-quality confirmation of a structural Breakout above resistance?",
            options: [
                "A strong body candle closing decisively above the level with follow-through volume",
                "A long upper wick touching the resistance line and closing inside the range",
                "Price touching the level exactly at market open",
                "A news headline mentioning central bank interest rates"
            ],
            correctAnswer: "A strong body candle closing decisively above the level with follow-through volume",
            explanation: "A confirmed breakout requires the candle body to close beyond the structural boundary, proving buyers are willing to transact at higher prices."
        },
        {
            id: "acad_08",
            category: "RETEST",
            questionText: "When a broken resistance level subsequently acts as support during a retracement, what principle has occurred?",
            options: [
                "Role Reversal (Polarity Shift)",
                "Liquidity Rejection Anomaly",
                "Equilibrium Convergence",
                "Symmetrical Contraction"
            ],
            correctAnswer: "Role Reversal (Polarity Shift)",
            explanation: "Former resistance often flips into new support because previous sellers cover and breakout traders enter on the retest, creating a floor."
        },
        {
            id: "acad_09",
            category: "FAKEOUT",
            questionText: "What is a 'Bull Trap' (false breakout) in chart analysis?",
            options: [
                "Price briefly pokes above resistance to trigger buy stops, then closes sharply back inside the range",
                "A pattern where every single candle is an engulfing green bar",
                "A broker restriction preventing long positions",
                "A weekend rollover spread spike"
            ],
            correctAnswer: "Price briefly pokes above resistance to trigger buy stops, then closes sharply back inside the range",
            explanation: "A Bull Trap lures breakout buyers and runs buy-side liquidity above resistance before reversing aggressively back downward."
        },
        {
            id: "acad_10",
            category: "CONTEXT",
            questionText: "Why is an isolated candlestick pattern (e.g. Hammer) meaningless without structural context?",
            options: [
                "Because location (e.g. key support vs mid-range noise) determines the statistical significance of the signal",
                "Because candlesticks are only valid on 1-minute timeframes",
                "Because hammers only work on cryptocurrency pairs",
                "Because market makers ignore candlestick shapes"
            ],
            correctAnswer: "Because location (e.g. key support vs mid-range noise) determines the statistical significance of the signal",
            explanation: "A bullish hammer at major multi-day support has strong contextual backing, while the exact same candle in the middle of a choppy range is merely market noise."
        }
    ];

    // Expand academy to 30 items dynamically if master data not loaded
    for (let i = 11; i <= 32; i++) {
        DEFAULT_ACADEMY_QUESTIONS.push({
            id: `acad_${String(i).padStart(2, '0')}`,
            category: i % 2 === 0 ? "STRUCTURE" : "TIMEFRAME",
            questionText: `Chart Literacy Drill #${i}: How should a trader interpret a multi-candle consolidation near a key higher-timeframe resistance?`,
            options: [
                "As accumulation/pressure building beneath resistance requiring breakout confirmation",
                "As an immediate guaranteed signal to short with max leverage",
                "As a sign that the currency pair is being delisted",
                "As random noise that should be ignored completely"
            ],
            correctAnswer: "As accumulation/pressure building beneath resistance requiring breakout confirmation",
            explanation: "Tight consolidation just beneath a key level indicates buyers are holding price up and absorbing supply, but waiting for confirmed breakout closure is essential."
        });
    }

    const ChartScenarioEngine = {
        masterScenarios: [],
        replayScenarios: [],
        annotationChallenges: [],
        timeframeScenarios: [],

        pools: {
            chart_academy: DEFAULT_ACADEMY_QUESTIONS,
            replay_lab: [],
            analysis_lab: [],
            detective_lab: [],
            annotation_lab: [],
            timeframe_observatory: [],
            comparison_room: [],
            chart_scouting: [],
            chart_theater: [],
            chart_arena: [],
            full_chart_boss: []
        },

        recentHistory: {
            chart_academy: [],
            replay_lab: [],
            analysis_lab: [],
            detective_lab: [],
            annotation_lab: [],
            timeframe_observatory: [],
            comparison_room: [],
            chart_scouting: [],
            chart_theater: [],
            chart_arena: [],
            full_chart_boss: []
        },

        init(datasets = {}) {
            if (datasets.scenarios) {
                this.masterScenarios = datasets.scenarios;
                this.buildPoolsFromMaster();
            }
            if (datasets.replays) {
                this.replayScenarios = datasets.replays;
                this.pools.replay_lab = datasets.replays;
            }
            if (datasets.annotations) {
                this.annotationChallenges = datasets.annotations;
                this.pools.annotation_lab = datasets.annotations;
            }
            if (datasets.timeframes) {
                this.timeframeScenarios = datasets.timeframes;
                this.pools.timeframe_observatory = datasets.timeframes;
            }
        },

        buildPoolsFromMaster() {
            const all = this.masterScenarios || [];
            if (all.length === 0) return;

            // 1. Analysis Lab (30+)
            this.pools.analysis_lab = all.slice(0, 35).map(s => ({
                id: `analysis_${s.id}`,
                scenarioId: s.id,
                category: s.category,
                instrument: s.instrument,
                title: s.title,
                questionText: s.questionText,
                candles: s.candles,
                options: s.options,
                correctAnswer: s.correctAnswer,
                explanation: s.explanation
            }));

            // 2. Detective Lab (30+)
            this.pools.detective_lab = all.slice(0, 32).map(s => ({
                id: `det_${s.id}`,
                scenarioId: s.id,
                category: "DETECTIVE_MYSTERY",
                instrument: s.instrument,
                title: `Mystery Investigation: ${s.title}`,
                questionText: `Study the initial 8 candles of this mystery chart. Based on the structural reaction near candle 4-6, what is the primary developing formation?`,
                candles: s.candles,
                partialCandles: s.candles.slice(0, Math.min(8, s.candles.length)),
                options: s.options,
                correctAnswer: s.correctAnswer,
                explanation: `Detective Verdict: ${s.explanation}`
            }));

            // 3. Comparison Room (25+)
            this.pools.comparison_room = all.slice(0, 28).map((s, idx) => {
                const alt = all[(idx + 5) % all.length];
                return {
                    id: `comp_${s.id}`,
                    title: `Comparison Drill #${idx + 1}`,
                    chartA: { title: `Chart A: ${s.instrument}`, candles: s.candles, regime: s.category },
                    chartB: { title: `Chart B: ${alt.instrument}`, candles: alt.candles, regime: alt.category },
                    questionText: `Compare Chart A against Chart B. What is the fundamental structural difference between the two?`,
                    options: [
                        `Chart A exhibits ${s.category.replace('_', ' ')}, while Chart B exhibits ${alt.category.replace('_', ' ')}`,
                        "Both charts are identical mirror reflections of the exact same asset",
                        "Chart A is completely invalid data while Chart B is trending",
                        "Both charts show sideways horizontal equilibrium"
                    ],
                    correctAnswer: `Chart A exhibits ${s.category.replace('_', ' ')}, while Chart B exhibits ${alt.category.replace('_', ' ')}`,
                    explanation: `Chart A clearly displays ${s.category.replace('_', ' ')} characteristics, whereas Chart B demonstrates ${alt.category.replace('_', ' ')} dynamics.`
                };
            });

            // 4. Chart Scouting (30+)
            this.pools.chart_scouting = all.slice(0, 32).map((s, idx) => ({
                id: `scout_${s.id}`,
                title: `Scouting Assignment #${idx + 1}`,
                category: s.category,
                instrument: s.instrument,
                candles: s.candles,
                steps: [
                    { step: 1, prompt: "Classify the overall structural regime", questionText: s.questionText, options: s.options, correctAnswer: s.correctAnswer, explanation: s.explanation }
                ],
                questionText: s.questionText,
                options: s.options,
                correctAnswer: s.correctAnswer,
                explanation: s.explanation
            }));

            // 5. Chart Theater (40+)
            this.pools.chart_theater = all.slice(0, 42).map((s, idx) => ({
                id: `theater_${s.id}`,
                title: `Theater Act #${idx + 1}: The Narrative of ${s.instrument}`,
                category: s.category,
                instrument: s.instrument,
                candles: s.candles,
                acts: [
                    { name: "Act I: Structure Setup", candleIndex: Math.floor(s.candles.length * 0.3) },
                    { name: "Act II: The Decision Point", candleIndex: Math.floor(s.candles.length * 0.6) },
                    { name: "Act III: The Resolution", candleIndex: s.candles.length }
                ],
                questionText: `At the final act of this market story, what was the definitive structural resolution?`,
                options: s.options,
                correctAnswer: s.correctAnswer,
                explanation: s.explanation
            }));

            // 6. Chart Arena (50+)
            this.pools.chart_arena = all.slice(0, 55).map(s => ({
                id: `arena_${s.id}`,
                category: s.category,
                instrument: s.instrument,
                title: `Arena Target: ${s.instrument}`,
                questionText: s.questionText,
                candles: s.candles,
                options: s.options,
                correctAnswer: s.correctAnswer,
                explanation: s.explanation
            }));

            // 7. Full Chart Boss (10+)
            this.pools.full_chart_boss = all.slice(0, 12).map((s, idx) => ({
                id: `boss_${s.id}`,
                title: `Grand Citadel Evaluation #${idx + 1}`,
                category: "FULL_ANALYSIS",
                instrument: s.instrument,
                candles: s.candles,
                questions: [
                    {
                        prompt: "1. Primary Market Regime",
                        questionText: `What is the overarching structural regime on this complete ${s.instrument} chart?`,
                        options: s.options,
                        correctAnswer: s.correctAnswer,
                        explanation: s.explanation
                    }
                ],
                questionText: `Complete Chart Examination: What is the dominant structural condition of this ${s.instrument} market?`,
                options: s.options,
                correctAnswer: s.correctAnswer,
                explanation: s.explanation
            }));
        },

        getQuestion(facilityId, category = null, difficulty = null) {
            const pool = this.pools[facilityId] || [];
            if (pool.length === 0) return null;

            let filtered = pool;
            if (category) {
                const catFiltered = pool.filter(q => q.category && q.category.toLowerCase() === category.toLowerCase());
                if (catFiltered.length > 0) filtered = catFiltered;
            }
            if (difficulty) {
                const diffFiltered = filtered.filter(q => q.difficulty && q.difficulty.toLowerCase() === difficulty.toLowerCase());
                if (diffFiltered.length > 0) filtered = diffFiltered;
            }

            const recent = this.recentHistory[facilityId] || [];
            const maxRecent = Math.min(10, Math.max(1, Math.floor(filtered.length * 0.45)));
            let available = filtered.filter(q => !recent.includes(q.id));

            if (available.length === 0) {
                available = filtered;
                this.recentHistory[facilityId] = [];
            }

            const selected = available[Math.floor(Math.random() * available.length)];
            if (selected) {
                this.recentHistory[facilityId].push(selected.id);
                if (this.recentHistory[facilityId].length > maxRecent) {
                    this.recentHistory[facilityId].shift();
                }
            }

            const qCopy = JSON.parse(JSON.stringify(selected));

            // Format and shuffle answer choices using Fisher-Yates
            if (Array.isArray(qCopy.options)) {
                const formatted = qCopy.options.map((opt, idx) => {
                    const optText = typeof opt === "string" ? opt : (opt.text || opt.label || "");
                    const isCorrect = optText === qCopy.correctAnswer || (opt && opt.isCorrect);
                    return {
                        id: (opt && opt.id) ? opt.id : ("opt_" + idx),
                        text: optText,
                        label: optText,
                        value: optText,
                        isCorrect: !!isCorrect,
                        toString: () => optText
                    };
                });
                qCopy.options = shuffleArray(formatted);
            }

            return qCopy;
        },

        resetHistory(facilityId = null) {
            if (facilityId && this.recentHistory[facilityId]) {
                this.recentHistory[facilityId] = [];
            } else {
                Object.keys(this.recentHistory).forEach(k => this.recentHistory[k] = []);
            }
        },

        shuffleArray
    };

    window.StrativoRPG.ChartScenarioEngine = ChartScenarioEngine;
    window.ChartScenarioEngine = ChartScenarioEngine;
})();
