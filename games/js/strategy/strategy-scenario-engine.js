/* ==========================================================================
   STRATIVO WORLD — DISTRICT 7: STRATEGY FORTRESS SCENARIO ENGINE
   Namespace: window.StrativoRPG.StrategyScenarioEngine
   Description:
   - Manages, filters, dispatches, and tracks 220+ curated strategy scenarios
   - Anti-repetition question selection across 11 facility pools
   - Fisher-Yates deterministic option shuffling
   - Single authoritative reset lifecycle support
   ========================================================================== */

"use strict";

(function () {
    window.StrativoRPG = window.StrativoRPG || {};

    class StrategyScenarioEngineManager {
        constructor() {
            this.scenarios = [];
            this.pools = {
                strategy_academy: [],
                confluence_forge: [],
                candlestick_chamber: [],
                structure_tower: [],
                sr_vault: [],
                breakout_vault: [],
                risk_command: [],
                psych_chamber: [],
                decision_arena: [],
                fortress_arena: [],
                strategy_throne: []
            };
            this.history = new Map();
            this.currentIndex = new Map();
        }

        init(dataset) {
            if (!dataset || !dataset.scenarios) {
                console.warn("[StrategyScenarioEngine] Invalid or empty scenario dataset provided.");
                return;
            }

            this.scenarios = dataset.scenarios;
            this.resetPools();

            // Populate Pools
            this.scenarios.forEach(scen => {
                const cat = scen.category;
                if (this.pools[cat]) {
                    this.pools[cat].push(scen);
                } else if (cat === "strategy_foundations" && this.pools.strategy_academy) {
                    this.pools.strategy_academy.push(scen);
                } else {
                    if (!this.pools[cat]) this.pools[cat] = [];
                    this.pools[cat].push(scen);
                }
            });

            console.log(`[StrategyScenarioEngine] Initialized with ${this.scenarios.length} scenarios across ${Object.keys(this.pools).length} facility pools.`);
        }

        resetPools() {
            for (const key in this.pools) {
                this.pools[key] = [];
                this.history.set(key, []);
                this.currentIndex.set(key, 0);
            }
        }

        getQuestion(facilityKey, subcategory = null) {
            const pool = this.pools[facilityKey] || this.scenarios;
            if (!pool || pool.length === 0) {
                return {
                    id: "fallback_strat_01",
                    title: "Strategy Confluence Drill",
                    questionText: "Which technical combination represents highest confluence for a long trade?",
                    options: [
                        "HTF Uptrend + Key Support Retest + Bullish Pinbar Rejection + 3:1 R:R",
                        "Chop Range + High Impact News + 50x Leverage Gamble",
                        "Counter-trend Short into Major Support Zone",
                        "Trading without a Stop-Loss"
                    ],
                    correctAnswer: "HTF Uptrend + Key Support Retest + Bullish Pinbar Rejection + 3:1 R:R",
                    explanation: "True technical confluence requires multiple independent factors to align before risk is committed."
                };
            }

            let idx = this.currentIndex.get(facilityKey) || 0;
            const scenario = pool[idx % pool.length];
            this.currentIndex.set(facilityKey, idx + 1);

            // Return deep copy with Fisher-Yates shuffled options
            const clone = JSON.parse(JSON.stringify(scenario));
            if (clone.options && Array.isArray(clone.options) && clone.category !== "strategy_throne") {
                clone.options = this.shuffleArray(clone.options);
            }
            return clone;
        }

        getNextScenario(facilityKey, subcategory = null) {
            return this.getQuestion(facilityKey, subcategory);
        }

        getCategories() {
            return Object.keys(this.pools);
        }

        shuffleArray(arr) {
            const a = [...arr];
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }
    }

    const instance = new StrategyScenarioEngineManager();
    window.StrativoRPG.StrategyScenarioEngine = instance;
    window.StrategyScenarioEngine = StrategyScenarioEngineManager;

    if (typeof global !== "undefined") {
        global.StrategyScenarioEngine = StrategyScenarioEngineManager;
    }

    if (typeof module !== "undefined" && module.exports) {
        module.exports = {
            StrategyScenarioEngine: instance,
            StrategyScenarioEngineManager
        };
    }
})();
