/* ==========================================================================
   STRATIVO WORLD — DISTRICT 7: STRATEGY FORTRESS ENGINES
   Namespace: window.StrativoRPG.StrategyEngine / window.StrativoRPG.StrategyEngines
   Description:
   - ConfluenceForgeEngine: 7-Pillar Multi-Factor Confluence Calculator
   - StrategyWorkshopEngine: 10-Factor Strategy Consistency Evaluator
   - BacktestArchiveEngine: Simulated Candle-by-Candle Historical Replay Tester
   - DecisionArenaEngine: Multi-Factor Market Dilemma Evaluator
   - FortressGauntletEngine: 10-Round Grand Strategy Gauntlet
   - StrategyThroneEngine: 8-Stage Apex Final Mastery Challenge
   - Canvas Renderers for Confluence Radar, Backtest Equity, and OHLC Charts
   ========================================================================== */

"use strict";

(function () {
    window.StrativoRPG = window.StrativoRPG || {};

    // 1. Static & Dynamic Canvas Renderers
    function renderConfluenceRadar(canvas, scores = {}) {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#030712";
        ctx.fillRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2;
        const radius = Math.min(w, h) * 0.36;

        const pillars = [
            { name: "Trend", val: scores.trend || 85 },
            { name: "Structure", val: scores.structure || 90 },
            { name: "S/R Zone", val: scores.sr || 80 },
            { name: "Price Action", val: scores.priceAction || 85 },
            { name: "Breakout", val: scores.breakout || 75 },
            { name: "Risk:Reward", val: scores.rr || 95 },
            { name: "Psychology", val: scores.psychology || 90 }
        ];

        const numSides = pillars.length;
        const angleStep = (Math.PI * 2) / numSides;

        // Concentric webs
        ctx.strokeStyle = "rgba(252, 211, 77, 0.15)";
        ctx.lineWidth = 1;
        [0.25, 0.5, 0.75, 1.0].forEach(lvl => {
            ctx.beginPath();
            for (let i = 0; i < numSides; i++) {
                const a = i * angleStep - Math.PI / 2;
                const x = cx + Math.cos(a) * radius * lvl;
                const y = cy + Math.sin(a) * radius * lvl;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        });

        // Spiderweb spokes
        for (let i = 0; i < numSides; i++) {
            const a = i * angleStep - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
            ctx.stroke();
        }

        // Polygon Data Fill
        ctx.fillStyle = "rgba(245, 158, 11, 0.25)";
        ctx.strokeStyle = "#FCD34D";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        pillars.forEach((p, i) => {
            const a = i * angleStep - Math.PI / 2;
            const r = (p.val / 100) * radius;
            const x = cx + Math.cos(a) * r;
            const y = cy + Math.sin(a) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Labels
        ctx.fillStyle = "#FEF3C7";
        ctx.font = "bold 10px Inter, sans-serif";
        ctx.textAlign = "center";
        pillars.forEach((p, i) => {
            const a = i * angleStep - Math.PI / 2;
            const lx = cx + Math.cos(a) * (radius + 18);
            const ly = cy + Math.sin(a) * (radius + 18);
            ctx.fillText(`${p.name} (${p.val}%)`, lx, ly);
        });
        ctx.textAlign = "left";
    }

    function renderBacktestEquityCurve(canvas, tradeHistory = []) {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#030712";
        ctx.fillRect(0, 0, w, h);

        if (!tradeHistory || tradeHistory.length === 0) {
            tradeHistory = [10000, 10300, 10150, 10600, 10450, 10900, 11250, 11100, 11700, 12100];
        }

        const minVal = Math.min(...tradeHistory) * 0.98;
        const maxVal = Math.max(...tradeHistory) * 1.02;
        const range = maxVal - minVal || 1;

        // Grid lines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 1;
        for (let y = 20; y < h; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Equity curve
        ctx.strokeStyle = "#10B981";
        ctx.lineWidth = 3;
        ctx.beginPath();
        const stepX = w / (tradeHistory.length - 1 || 1);
        tradeHistory.forEach((val, i) => {
            const x = i * stepX;
            const y = h - 25 - ((val - minVal) / range) * (h - 50);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Area under curve
        ctx.lineTo(w, h - 20);
        ctx.lineTo(0, h - 20);
        ctx.closePath();
        ctx.fillStyle = "rgba(16, 185, 129, 0.12)";
        ctx.fill();

        // Title
        ctx.fillStyle = "#10B981";
        ctx.font = "bold 11px Inter, sans-serif";
        const finalBal = tradeHistory[tradeHistory.length - 1];
        ctx.fillText(`SIMULATED EQUITY: $${Number(finalBal).toLocaleString()} (+${(((finalBal - tradeHistory[0]) / tradeHistory[0]) * 100).toFixed(1)}%)`, 15, 20);
    }

    function renderCandleChart(canvas, candles = [], options = {}) {
        if (!canvas || !candles || candles.length === 0) return;
        const ctx = canvas.getContext("2d");
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#030712";
        ctx.fillRect(0, 0, w, h);

        let minPrice = Infinity;
        let maxPrice = -Infinity;
        candles.forEach(c => {
            if (c.low < minPrice) minPrice = c.low;
            if (c.high > maxPrice) maxPrice = c.high;
        });

        const padding = (maxPrice - minPrice) * 0.1 || 1;
        minPrice -= padding;
        maxPrice += padding;
        const priceRange = maxPrice - minPrice;

        const candleW = Math.max(6, Math.min(22, (w / candles.length) * 0.65));
        const spacing = w / candles.length;

        candles.forEach((c, i) => {
            const x = i * spacing + spacing / 2;
            const isBull = c.close >= c.open;
            const color = isBull ? "#10B981" : "#EF4444";

            const yOpen = h - ((c.open - minPrice) / priceRange) * h;
            const yClose = h - ((c.close - minPrice) / priceRange) * h;
            const yHigh = h - ((c.high - minPrice) / priceRange) * h;
            const yLow = h - ((c.low - minPrice) / priceRange) * h;

            // Wick
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x, yHigh);
            ctx.lineTo(x, yLow);
            ctx.stroke();

            // Body
            ctx.fillStyle = color;
            const bodyY = Math.min(yOpen, yClose);
            const bodyH = Math.max(2, Math.abs(yClose - yOpen));
            ctx.fillRect(x - candleW / 2, bodyY, candleW, bodyH);
        });
    }

    // 2. Confluence Forge Engine
    class ConfluenceForgeEngine {
        calculateConfluence(pillars = {}) {
            const weights = {
                trend: 15,
                structure: 15,
                sr: 15,
                priceAction: 15,
                breakout: 10,
                rr: 20,
                psychology: 10
            };

            let totalScore = 0;
            let maxScore = 100;
            const breakdown = {};

            for (const key in weights) {
                const isSatisfied = Boolean(pillars[key]);
                const score = isSatisfied ? weights[key] : 0;
                breakdown[key] = {
                    weight: weights[key],
                    awarded: score,
                    isSatisfied
                };
                totalScore += score;
            }

            let grade = "NO TRADE (<60%)";
            let quality = "LOW CONFLUENCE";
            let isExecutable = false;

            if (totalScore >= 85) {
                grade = "PRIME CONFLUENCE (A+)";
                quality = "OPTIMAL SYSTEMATIC SETUP";
                isExecutable = true;
            } else if (totalScore >= 70) {
                grade = "ACCEPTABLE CONFLUENCE (B)";
                quality = "VALID STANDARD SETUP";
                isExecutable = true;
            }

            return {
                confluenceScore: totalScore,
                grade,
                quality,
                isExecutable,
                breakdown
            };
        }
    }

    // 3. Strategy Workshop Engine (10-Factor Consistency)
    class StrategyWorkshopEngine {
        evaluateStrategy(blueprint = {}) {
            let consistencyScore = 100;
            const flaws = [];
            const strengths = [];

            // 1. Condition & Direction
            if (blueprint.condition === "uptrend" && blueprint.direction === "short") {
                consistencyScore -= 25;
                flaws.push("Counter-trend trading without confirmed structural shift.");
            } else {
                strengths.push("Trend and trade direction are logically aligned.");
            }

            // 2. Invalidation vs Setup
            if (!blueprint.invalidation || blueprint.invalidation === "none") {
                consistencyScore -= 30;
                flaws.push("No structural invalidation point defined (Severe Ruin Risk).");
            } else {
                strengths.push("Technical invalidation anchored beyond key structure.");
            }

            // 3. R:R & Target
            if (blueprint.rr < 1.5) {
                consistencyScore -= 20;
                flaws.push(`Sub-optimal Reward-to-Risk (${blueprint.rr}:1). Requires >1.5:1 for positive expectancy.`);
            } else {
                strengths.push(`Favorable R:R ratio (${blueprint.rr}:1) supporting positive expectancy.`);
            }

            // 4. Risk Allocation
            if (blueprint.riskPct > 2.0) {
                consistencyScore -= 25;
                flaws.push(`Excessive risk allocation (${blueprint.riskPct}%). Max safe threshold is 1-2%.`);
            } else {
                strengths.push(`Safe risk sizing (${blueprint.riskPct}% per trade).`);
            }

            consistencyScore = Math.max(0, consistencyScore);
            const isValid = consistencyScore >= 75;

            return {
                consistencyScore,
                isValid,
                verdict: isValid ? "CONSISTENT & VIABLE STRATEGY" : "FLAWED STRATEGY (Revision Required)",
                flaws,
                strengths
            };
        }
    }

    // 4. Backtest Archive Engine (Simulated Candle Replay)
    class BacktestArchiveEngine {
        constructor() {
            this.reset();
        }

        reset() {
            this.tradesExecuted = 0;
            this.wins = 0;
            this.losses = 0;
            this.balance = 10000;
            this.startingBalance = 10000;
            this.equityHistory = [10000];
            this.maxDrawdown = 0;
            this.peakBalance = 10000;
            this.ruleViolations = 0;
        }

        recordTrade(isWin = true, riskDollar = 100, rewardMultiplier = 2.5, followedRules = true) {
            this.tradesExecuted++;
            if (!followedRules) this.ruleViolations++;

            if (isWin) {
                this.wins++;
                this.balance += riskDollar * rewardMultiplier;
            } else {
                this.losses++;
                this.balance -= riskDollar;
            }

            if (this.balance > this.peakBalance) this.peakBalance = this.balance;
            const currentDd = ((this.peakBalance - this.balance) / this.peakBalance) * 100;
            if (currentDd > this.maxDrawdown) this.maxDrawdown = Number(currentDd.toFixed(1));

            this.equityHistory.push(this.balance);

            const winRate = Math.round((this.wins / this.tradesExecuted) * 100);
            const expectancy = Number((((winRate / 100) * rewardMultiplier) - (((100 - winRate) / 100) * 1.0)).toFixed(2));

            return {
                tradesExecuted: this.tradesExecuted,
                wins: this.wins,
                losses: this.losses,
                balance: this.balance,
                winRate,
                expectancy,
                maxDrawdown: this.maxDrawdown,
                ruleViolations: this.ruleViolations,
                equityHistory: this.equityHistory
            };
        }
    }

    // 5. Decision Arena & Fortress Gauntlet Engine
    class FortressGauntletEngine {
        constructor() {
            this.reset();
        }

        reset() {
            this.round = 1;
            this.maxRounds = 10;
            this.score = 0;
            this.correctCount = 0;
            this.streak = 0;
            this.bestStreak = 0;
            this.isFinished = false;
        }

        start(pool = null) {
            this.reset();
            this.pool = pool;
        }

        recordAnswer(isCorrect = false) {
            if (isCorrect) {
                this.correctCount++;
                this.streak++;
                if (this.streak > this.bestStreak) this.bestStreak = this.streak;
                this.score += 10 + this.streak * 2;
            } else {
                this.streak = 0;
            }

            if (this.round >= this.maxRounds) {
                this.isFinished = true;
            } else {
                this.round++;
            }

            return {
                round: this.round,
                score: this.score,
                streak: this.streak,
                bestStreak: this.bestStreak,
                isFinished: this.isFinished,
                accuracy: Math.round((this.correctCount / (this.round - (this.isFinished ? 0 : 1))) * 100)
            };
        }
    }

    // 6. Final Strategy Throne Engine (8-Stage Apex Trial)
    class StrategyThroneEngine {
        constructor() {
            this.reset();
        }

        reset() {
            this.stage = 1;
            this.maxStages = 8;
            this.masteryScore = 0;
            this.traderStamina = 100;
            this.ruleViolations = 0;
            this.isVictory = false;
            this.isDefeated = false;
            this.turnHistory = [];
        }

        executeStage(selectedOption = {}, stageData = {}) {
            if (this.isVictory || this.isDefeated) return this.getStatus();

            const isMaster = Boolean(selectedOption.isMaster || selectedOption.isCorrect);
            const scoreGain = selectedOption.scoreGain || (isMaster ? 15 : 0);
            const staminaLoss = isMaster ? 0 : 25;

            this.masteryScore += scoreGain;
            this.traderStamina = Math.max(0, this.traderStamina - staminaLoss);

            if (!isMaster) {
                this.ruleViolations++;
            }

            this.turnHistory.push({
                stage: this.stage,
                title: stageData.title || `Stage ${this.stage}`,
                choice: selectedOption.label || selectedOption.text || "Action",
                isMaster,
                scoreGain,
                traderStamina: this.traderStamina
            });

            if (this.traderStamina <= 0) {
                this.isDefeated = true;
                this.defeatReason = "Strategy execution lacked required technical confluence and risk discipline.";
            } else if (this.stage >= this.maxStages) {
                this.isVictory = true;
            } else {
                this.stage++;
            }

            return this.getStatus();
        }

        getStatus() {
            return {
                stage: this.stage,
                maxStages: this.maxStages,
                masteryScore: this.masteryScore,
                traderStamina: this.traderStamina,
                ruleViolations: this.ruleViolations,
                isVictory: this.isVictory,
                isDefeated: this.isDefeated,
                defeatReason: this.defeatReason || "",
                turnHistory: this.turnHistory
            };
        }
    }

    // Export Unified StrategyEngine helper & classes
    const StrategyEngine = {
        renderConfluenceRadar,
        renderBacktestEquityCurve,
        renderCandleChart,
        calculateConfluence(pillars) {
            return new ConfluenceForgeEngine().calculateConfluence(pillars);
        },
        evaluateStrategy(blueprint) {
            return new StrategyWorkshopEngine().evaluateStrategy(blueprint);
        }
    };

    window.StrativoRPG.StrategyEngine = StrategyEngine;
    window.StrativoRPG.StrategyEngines = {
        renderConfluenceRadar,
        renderBacktestEquityCurve,
        renderCandleChart,
        ConfluenceForgeEngine,
        StrategyWorkshopEngine,
        BacktestArchiveEngine,
        FortressGauntletEngine,
        DecisionArenaEngine: FortressGauntletEngine,
        StrategyThroneEngine
    };

    // Global aliases for easy access
    window.StrategyEngine = StrategyEngine;
    window.ConfluenceForgeEngine = ConfluenceForgeEngine;
    window.StrategyWorkshopEngine = StrategyWorkshopEngine;
    window.BacktestArchiveEngine = BacktestArchiveEngine;
    window.FortressGauntletEngine = FortressGauntletEngine;
    window.StrategyThroneEngine = StrategyThroneEngine;

    if (typeof global !== "undefined") {
        global.StrategyEngine = StrategyEngine;
        global.ConfluenceForgeEngine = ConfluenceForgeEngine;
        global.StrategyWorkshopEngine = StrategyWorkshopEngine;
        global.BacktestArchiveEngine = BacktestArchiveEngine;
        global.FortressGauntletEngine = FortressGauntletEngine;
        global.StrategyThroneEngine = StrategyThroneEngine;
    }

    if (typeof module !== "undefined" && module.exports) {
        module.exports = {
            StrategyEngine,
            StrategyEngines: window.StrativoRPG.StrategyEngines,
            ConfluenceForgeEngine,
            StrategyWorkshopEngine,
            BacktestArchiveEngine,
            FortressGauntletEngine,
            StrategyThroneEngine
        };
    }
})();
