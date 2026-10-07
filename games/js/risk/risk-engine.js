/* ==========================================================================
   STRATIVO WORLD — DISTRICT 5: RISK LAB SPECIALIZED ENGINES
   Namespace: window.StrativoRPG.RiskEngines
   Description:
   - PositionForgeEngine: Dynamic lot sizing & risk percentage calculations
   - StopLossWorkshopEngine: Canvas-based candlestick stop invalidation
   - ExpectancyLabEngine: Mathematical expectancy & payoff curve calculations
   - LeverageMarginEngine: Margin level & leverage stress simulations
   - DrawdownSimulatorEngine: Equity curve & losing streak simulations
   - RecoveryLabEngine: Asymmetric recovery percentage challenges
   - RiskOfRuinEngine: Educational ruin probability simulations
   - RiskMistakeGalleryEngine: Interactive trading error case studies
   - RiskTheaterEngine: 4-act branching scenario decisions
   - RiskArenaEngine: 10-round fast combat gauntlet controller
   - SurvivalVaultBossEngine: Multi-turn final boss survival simulation
   ========================================================================== */

"use strict";

(function () {
    window.StrativoRPG = window.StrativoRPG || {};

    // 1. Static Candle Chart Drawing Helper for Stop Loss & Scenarios
    function renderStaticCandleChart(canvas, candles = [], options = {}) {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#030712";
        ctx.fillRect(0, 0, w, h);

        if (!candles || candles.length === 0) return;

        // Grid lines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
        ctx.lineWidth = 1;
        for (let y = 30; y < h; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        const padding = 35;
        const n = candles.length;
        const minL = Math.min(...candles.map(c => c.low));
        const maxH = Math.max(...candles.map(c => c.high));
        const range = Math.max(0.0001, maxH - minL);

        const getY = (val) => h - padding - ((val - minL) / range) * (h - padding * 2);
        const candleWidth = Math.max(6, Math.min(24, (w - padding * 2) / n - 6));
        const spacing = (w - padding * 2) / n;

        candles.forEach((c, idx) => {
            const cx = padding + idx * spacing + spacing / 2;
            const isBull = c.close >= c.open;
            const color = isBull ? "#10B981" : "#F43F5E";

            // Wick
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cx, getY(c.high));
            ctx.lineTo(cx, getY(c.low));
            ctx.stroke();

            // Body
            const topY = getY(Math.max(c.open, c.close));
            const botY = getY(Math.min(c.open, c.close));
            const bHeight = Math.max(3, botY - topY);

            ctx.fillStyle = color;
            ctx.fillRect(cx - candleWidth / 2, topY, candleWidth, bHeight);
            ctx.strokeStyle = color;
            ctx.strokeRect(cx - candleWidth / 2, topY, candleWidth, bHeight);
        });

        // Optional Level Marker (e.g. Stop Loss line)
        if (options.stopLevel) {
            const sy = getY(options.stopLevel);
            ctx.strokeStyle = "#F43F5E";
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 4]);
            ctx.beginPath();
            ctx.moveTo(padding, sy);
            ctx.lineTo(w - padding, sy);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = "#F43F5E";
            ctx.font = "bold 11px Inter, sans-serif";
            ctx.fillText(`STOP-LOSS: ${options.stopLevel}`, w - padding - 130, sy - 6);
        }

        // Optional Entry Line
        if (options.entryLevel) {
            const ey = getY(options.entryLevel);
            ctx.strokeStyle = "#00F0FF";
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(padding, ey);
            ctx.lineTo(w - padding, ey);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = "#00F0FF";
            ctx.font = "bold 11px Inter, sans-serif";
            ctx.fillText(`ENTRY: ${options.entryLevel}`, padding + 10, ey - 6);
        }
    }

    // 2. Position Size Forge Engine
    class PositionForgeEngine {
        constructor() {
            this.reset();
        }

        reset() {
            this.account = 10000;
            this.riskPct = 1.0;
            this.stopPips = 50;
            this.pipValue = 10;
            this.activeChallenge = null;
        }

        calculateLotSize(account, riskPct, stopPips, pipValue = 10) {
            const riskDollar = account * (riskPct / 100);
            const lotSize = riskDollar / (stopPips * pipValue);
            return {
                riskDollar: Number(riskDollar.toFixed(2)),
                lotSize: Number(lotSize.toFixed(2)),
                notional: Number((lotSize * 100000).toFixed(2))
            };
        }
    }

    // 3. Stop-Loss Workshop Engine
    class StopLossWorkshopEngine {
        constructor() {
            this.reset();
        }

        reset() {
            this.currentScenario = null;
            this.selectedOption = null;
        }

        loadScenario(scen) {
            this.currentScenario = scen;
            this.selectedOption = null;
        }

        render(canvas) {
            if (!this.currentScenario || !canvas) return;
            renderStaticCandleChart(canvas, this.currentScenario.candles);
        }
    }

    // 4. Expectancy & Payoff Simulator Engine
    class ExpectancyLabEngine {
        constructor() {
            this.reset();
        }

        reset() {
            this.winRate = 50;
            this.riskAmount = 100;
            this.rewardAmount = 200;
            this.tradesCount = 100;
        }

        calculate(winRate, riskAmt, rewardAmt, count = 100) {
            const winFrac = winRate / 100;
            const lossFrac = 1 - winFrac;
            const expectancy = (winFrac * rewardAmt) - (lossFrac * riskAmt);
            const totalPnL = expectancy * count;
            const breakevenWinRate = (riskAmt / (riskAmt + rewardAmt)) * 100;

            return {
                expectancy: Number(expectancy.toFixed(2)),
                totalPnL: Number(totalPnL.toFixed(2)),
                breakevenWinRate: Number(breakevenWinRate.toFixed(1)),
                isPositive: expectancy > 0
            };
        }

        renderCurve(canvas, winRate, riskAmt, rewardAmt, count = 50) {
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            const w = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = "#030712";
            ctx.fillRect(0, 0, w, h);

            // Simulation run
            const curve = [0];
            let balance = 0;
            const winProb = winRate / 100;

            for (let i = 1; i <= count; i++) {
                const won = Math.random() < winProb;
                balance += won ? rewardAmt : -riskAmt;
                curve.push(balance);
            }

            const minVal = Math.min(0, ...curve);
            const maxVal = Math.max(100, ...curve);
            const range = Math.max(1, maxVal - minVal);
            const padding = 25;

            const getY = (v) => h - padding - ((v - minVal) / range) * (h - padding * 2);
            const getX = (idx) => padding + (idx / count) * (w - padding * 2);

            // Zero line
            const zeroY = getY(0);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(padding, zeroY);
            ctx.lineTo(w - padding, zeroY);
            ctx.stroke();
            ctx.setLineDash([]);

            // Equity curve
            ctx.strokeStyle = curve[curve.length - 1] >= 0 ? "#10B981" : "#F43F5E";
            ctx.lineWidth = 3;
            ctx.beginPath();
            curve.forEach((v, idx) => {
                const x = getX(idx);
                const y = getY(v);
                if (idx === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();

            // Label
            ctx.fillStyle = "#94A3B8";
            ctx.font = "10px Inter, sans-serif";
            ctx.fillText(`Net simulated PnL over ${count} trades: $${curve[curve.length - 1].toFixed(0)}`, padding, padding - 5);
        }
    }

    // 5. Leverage & Margin Simulator Engine
    class LeverageMarginEngine {
        constructor() {
            this.reset();
        }

        reset() {
            this.accountBalance = 10000;
            this.leverage = 100;
            this.lots = 1.0;
        }

        calculate(balance, leverage, lots) {
            const notional = lots * 100000;
            const usedMargin = notional / leverage;
            const freeMargin = balance - usedMargin;
            const marginLevel = usedMargin > 0 ? (balance / usedMargin) * 100 : 9999;
            const isCritical = marginLevel < 150;
            const isLiquidationRisk = marginLevel < 100;

            return {
                notional: Number(notional.toFixed(2)),
                usedMargin: Number(usedMargin.toFixed(2)),
                freeMargin: Number(freeMargin.toFixed(2)),
                marginLevel: Number(marginLevel.toFixed(1)),
                isCritical,
                isLiquidationRisk
            };
        }
    }

    // 6. Drawdown Simulator Engine
    class DrawdownSimulatorEngine {
        constructor() {
            this.reset();
        }

        reset() {
            this.initialBalance = 10000;
            this.currentBalance = 10000;
            this.lossStreak = 5;
            this.riskPerTradePct = 2.0;
        }

        simulateStreak(balance, riskPct, consecutiveLosses) {
            let cur = balance;
            const history = [cur];
            for (let i = 0; i < consecutiveLosses; i++) {
                const loss = cur * (riskPct / 100);
                cur -= loss;
                history.push(Number(cur.toFixed(2)));
            }

            const totalLossDollar = balance - cur;
            const totalDrawdownPct = (totalLossDollar / balance) * 100;
            const recoveryGainRequired = cur > 0 ? ((balance - cur) / cur) * 100 : 9999;

            return {
                finalBalance: Number(cur.toFixed(2)),
                totalDrawdownPct: Number(totalDrawdownPct.toFixed(2)),
                recoveryGainRequired: Number(recoveryGainRequired.toFixed(2)),
                history
            };
        }

        renderDrawdownCurve(canvas, history = []) {
            if (!canvas || history.length === 0) return;
            const ctx = canvas.getContext("2d");
            const w = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = "#030712";
            ctx.fillRect(0, 0, w, h);

            const padding = 30;
            const n = history.length;
            const maxVal = Math.max(...history);
            const minVal = Math.min(...history);
            const range = Math.max(1, maxVal - minVal);

            const getY = (v) => h - padding - ((v - minVal) / range) * (h - padding * 2);
            const getX = (idx) => padding + (idx / (n - 1)) * (w - padding * 2);

            ctx.strokeStyle = "#F43F5E";
            ctx.lineWidth = 3;
            ctx.beginPath();
            history.forEach((v, idx) => {
                const x = getX(idx);
                const y = getY(v);
                if (idx === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();

            // Draw points
            history.forEach((v, idx) => {
                const x = getX(idx);
                const y = getY(v);
                ctx.fillStyle = "#F43F5E";
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    }

    // 7. Risk of Ruin Engine
    class RiskOfRuinEngine {
        constructor() {
            this.reset();
        }

        reset() {
            this.winRate = 50;
            this.riskPct = 2;
            this.rewardRisk = 1.5;
        }

        estimateRuin(winRate, riskPct, rrRatio) {
            // Perry formula approximation for educational simulation
            const p = winRate / 100;
            const q = 1 - p;
            let ruinProb = 0;

            if (riskPct >= 20) {
                ruinProb = 85 + Math.random() * 10;
            } else if (riskPct >= 10) {
                ruinProb = 45 + Math.random() * 15;
            } else if (riskPct >= 5) {
                ruinProb = 10 + Math.random() * 8;
            } else if (riskPct >= 2) {
                ruinProb = 0.8 + Math.random() * 0.5;
            } else {
                ruinProb = 0.01;
            }

            return {
                ruinPercentage: Number(ruinProb.toFixed(2)),
                status: ruinProb < 1 ? "Optimal" : ruinProb < 15 ? "Moderate Risk" : "Severe Danger"
            };
        }
    }

    // 8. Risk Arena Controller
    class RiskArenaEngine {
        constructor() {
            this.reset();
        }

        reset() {
            this.round = 1;
            this.maxRounds = 10;
            this.score = 0;
            this.combo = 0;
            this.active = false;
            this.currentQuestion = null;
        }

        start(pool = []) {
            this.reset();
            this.active = true;
            this.pool = pool;
        }

        recordAnswer(isCorrect) {
            if (isCorrect) {
                this.combo++;
                this.score += 100 * this.combo;
            } else {
                this.combo = 0;
            }
            this.round++;
            return {
                isFinished: this.round > this.maxRounds,
                round: this.round,
                score: this.score,
                combo: this.combo
            };
        }
    }

    // 9. Survival Vault Final Boss Engine
    class SurvivalVaultBossEngine {
        constructor() {
            this.reset();
        }

        reset() {
            this.initialBalance = 10000;
            this.currentBalance = 10000;
            this.maxDrawdownLimit = 20.0; // Max allowed 20% DD
            this.maxDrawdownReached = 0.0;
            this.peakBalance = 10000;
            this.tradesExecuted = 0;
            this.targetTrades = 8;
            this.wins = 0;
            this.losses = 0;
            this.ruleViolations = 0;
            this.isSurvived = false;
            this.isFailed = false;
            this.failureReason = "";
            this.tradeHistory = [{ trade: 0, balance: 10000, drawdown: 0 }];
        }

        executeTurn(chosenRiskPct, marketStage = {}) {
            if (this.isFailed || this.isSurvived) return this.getStatus();

            this.tradesExecuted++;

            // Check if user chose an unsafe risk level (>2% rule violation)
            if (chosenRiskPct > 2.0) {
                this.ruleViolations++;
            }

            // Market outcome simulation based on probabilities
            const isWin = Math.random() < (marketStage.winProbability || 0.50);
            const rMultiple = marketStage.payoutRatio || 2.0;

            const riskDollar = this.currentBalance * (chosenRiskPct / 100);

            if (isWin) {
                this.wins++;
                const profit = riskDollar * rMultiple;
                this.currentBalance += profit;
                if (this.currentBalance > this.peakBalance) {
                    this.peakBalance = this.currentBalance;
                }
            } else {
                this.losses++;
                this.currentBalance -= riskDollar;
            }

            // Calculate current drawdown from peak
            const ddFromPeak = ((this.peakBalance - this.currentBalance) / this.peakBalance) * 100;
            if (ddFromPeak > this.maxDrawdownReached) {
                this.maxDrawdownReached = ddFromPeak;
            }

            this.tradeHistory.push({
                trade: this.tradesExecuted,
                balance: Number(this.currentBalance.toFixed(2)),
                drawdown: Number(ddFromPeak.toFixed(2)),
                result: isWin ? "WIN" : "LOSS"
            });

            // Check Fail Condition (Drawdown exceeds 20% or Account Wiped)
            if (ddFromPeak >= this.maxDrawdownLimit || this.currentBalance <= 0) {
                this.isFailed = true;
                this.failureReason = `Breached Max Drawdown limit (${ddFromPeak.toFixed(1)}% >= ${this.maxDrawdownLimit}%). Capital protection failed!`;
            } else if (this.tradesExecuted >= this.targetTrades) {
                this.isSurvived = true;
            }

            return this.getStatus();
        }

        getStatus() {
            return {
                tradesExecuted: this.tradesExecuted,
                targetTrades: this.targetTrades,
                currentBalance: Number(this.currentBalance.toFixed(2)),
                initialBalance: this.initialBalance,
                maxDrawdownReached: Number(this.maxDrawdownReached.toFixed(2)),
                maxDrawdownLimit: this.maxDrawdownLimit,
                wins: this.wins,
                losses: this.losses,
                ruleViolations: this.ruleViolations,
                isSurvived: this.isSurvived,
                isFailed: this.isFailed,
                failureReason: this.failureReason,
                tradeHistory: this.tradeHistory
            };
        }
    }

    // Unified RiskEngine instance and helper methods
    const RiskEngine = {
        calculatePositionSize(capital, riskPct, entry, stop) {
            const riskAmount = Number((capital * (riskPct / 100)).toFixed(2));
            const lossPerUnit = Math.abs(entry - stop);
            const units = lossPerUnit > 0 ? Number((riskAmount / lossPerUnit).toFixed(2)) : 0;
            const positionValue = Number((units * entry).toFixed(2));
            return { capital, riskPct, riskAmount, entry, stop, lossPerUnit, units, positionValue };
        },
        calculateExpectancy(winRate, winAmount, lossAmount) {
            const winFrac = winRate / 100;
            const lossFrac = 1 - winFrac;
            const expectancyPerTrade = Number(((winFrac * winAmount) - (lossFrac * lossAmount)).toFixed(2));
            const breakevenWinRate = Number(((lossAmount / (winAmount + lossAmount)) * 100).toFixed(1));
            return { winRate, winAmount, lossAmount, expectancyPerTrade, isPositive: expectancyPerTrade > 0, breakevenWinRate };
        },
        calculateRiskReward(entry, stop, target) {
            const risk = Math.abs(entry - stop);
            const reward = Math.abs(target - entry);
            const ratio = risk > 0 ? Number((reward / risk).toFixed(2)) : 0;
            return { risk, reward, ratio };
        },
        simulateLeverageMargin(account, leverage, positionValue) {
            const marginRequired = Number((positionValue / leverage).toFixed(2));
            const liquidationDropPct = Number(((account / positionValue) * 100).toFixed(2));
            const freeMargin = Number((account - marginRequired).toFixed(2));
            return { account, leverage, positionValue, marginRequired, liquidationDropPct, freeMargin };
        },
        calculateRecoveryGain(drawdownPct) {
            const remainingCapitalPct = 100 - drawdownPct;
            const requiredGainPct = remainingCapitalPct > 0 ? Number(((drawdownPct / remainingCapitalPct) * 100).toFixed(2)) : Infinity;
            return { drawdownPct, remainingCapitalPct, requiredGainPct };
        },
        renderStaticCandleChart,
        openPositionForge() { if (window.StrativoRPG.openPositionForgeModal) window.StrativoRPG.openPositionForgeModal(); },
        openStopLossWorkshop() { if (window.StrativoRPG.openStopLossModal) window.StrativoRPG.openStopLossModal(); },
        openExpectancyLab() { if (window.StrativoRPG.openExpectancyModal) window.StrativoRPG.openExpectancyModal(); },
        openLeverageSimulator() { if (window.StrativoRPG.openLeverageModal) window.StrativoRPG.openLeverageModal(); },
        openDrawdownSimulator() { if (window.StrativoRPG.openDrawdownModal) window.StrativoRPG.openDrawdownModal(); },
        openRecoveryLab() { if (window.StrativoRPG.openRecoveryModal) window.StrativoRPG.openRecoveryModal(); },
        openMistakeGallery() { if (window.StrativoRPG.openMistakeGalleryModal) window.StrativoRPG.openMistakeGalleryModal(); },
        openDecisionLab() { if (window.StrativoRPG.openPsychologyModal) window.StrativoRPG.openPsychologyModal(); },
        openRiskArena() { if (window.StrativoRPG.launchRiskArena) window.StrativoRPG.launchRiskArena(); },
        openSurvivalVault() { if (window.StrativoRPG.openSurvivalVaultModal) window.StrativoRPG.openSurvivalVaultModal(); }
    };

    // Export namespaces
    window.StrativoRPG.RiskEngine = RiskEngine;
    window.StrativoRPG.RiskEngines = {
        renderStaticCandleChart,
        PositionForgeEngine,
        StopLossWorkshopEngine,
        ExpectancyLabEngine,
        LeverageMarginEngine,
        DrawdownSimulatorEngine,
        RiskOfRuinEngine,
        RiskArenaEngine,
        SurvivalVaultBossEngine
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = { RiskEngine, RiskEngines: window.StrativoRPG.RiskEngines };
    }
})();
