/* ==========================================================================
   STRATIVO WORLD — CHART REPLAY ENGINE
   Namespace: window.StrativoRPG.ChartReplayEngine
   Description:
   - Reusable candle-by-candle simulated chart progression engine
   - Play, pause, step forward, step back, reset, reveal, next scenario
   - Procedural Canvas 2D OHLC renderer with high-contrast styling
   - State reset and event callbacks
   ========================================================================== */

"use strict";

(function () {
    window.StrativoRPG = window.StrativoRPG || {};

    class ChartReplayEngine {
        constructor(config = {}) {
            this.scenarios = config.scenarios || [];
            this.currentScenarioIndex = 0;
            this.activeScenario = null;
            this.currentCandleIndex = 0;
            this.isPlaying = false;
            this.playInterval = null;
            this.speedMs = config.speedMs || 700; // ms per candle
            this.onStepCallback = null;
            this.onCompleteCallback = null;
            this.onStateChangeCallback = null;

            if (this.scenarios.length > 0) {
                this.loadScenario(this.scenarios[0]);
            }
        }

        loadScenario(scenOrId) {
            this.pause();
            let scenario = null;
            if (typeof scenOrId === "string") {
                scenario = this.scenarios.find(s => s.id === scenOrId || s.scenarioId === scenOrId);
            } else if (typeof scenOrId === "number") {
                this.currentScenarioIndex = (scenOrId + this.scenarios.length) % this.scenarios.length;
                scenario = this.scenarios[this.currentScenarioIndex];
            } else {
                scenario = scenOrId;
            }

            if (!scenario) return false;

            this.activeScenario = JSON.parse(JSON.stringify(scenario));
            // Start by displaying the first 3 candles or 25% of the chart
            this.currentCandleIndex = Math.min(3, this.activeScenario.candles.length);
            this.triggerStateChange();
            return true;
        }

        nextScenario() {
            this.currentScenarioIndex = (this.currentScenarioIndex + 1) % this.scenarios.length;
            return this.loadScenario(this.currentScenarioIndex);
        }

        previousScenario() {
            this.currentScenarioIndex = (this.currentScenarioIndex - 1 + this.scenarios.length) % this.scenarios.length;
            return this.loadScenario(this.currentScenarioIndex);
        }

        play() {
            if (this.isPlaying || !this.activeScenario) return;
            this.isPlaying = true;
            this.triggerStateChange();

            this.playInterval = setInterval(() => {
                if (!this.stepForward()) {
                    this.pause();
                    if (this.onCompleteCallback) this.onCompleteCallback(this.activeScenario);
                }
            }, this.speedMs);
        }

        pause() {
            if (this.playInterval) {
                clearInterval(this.playInterval);
                this.playInterval = null;
            }
            this.isPlaying = false;
            this.triggerStateChange();
        }

        stepForward() {
            if (!this.activeScenario) return false;
            if (this.currentCandleIndex < this.activeScenario.candles.length) {
                this.currentCandleIndex++;
                window.StrativoRPG.emitGameEvent("chartStep");
                this.triggerStateChange();
                return true;
            }
            return false;
        }

        stepBack() {
            if (!this.activeScenario) return false;
            if (this.currentCandleIndex > 1) {
                this.currentCandleIndex--;
                window.StrativoRPG.emitGameEvent("chartStep");
                this.triggerStateChange();
                return true;
            }
            return false;
        }

        reset() {
            this.pause();
            if (!this.activeScenario) return;
            this.currentCandleIndex = Math.min(3, this.activeScenario.candles.length);
            this.triggerStateChange();
        }

        reveal() {
            this.pause();
            if (!this.activeScenario) return;
            this.currentCandleIndex = this.activeScenario.candles.length;
            window.StrativoRPG.emitGameEvent("chartReveal");
            this.triggerStateChange();
            if (this.onCompleteCallback) this.onCompleteCallback(this.activeScenario);
        }

        setSpeed(ms) {
            this.speedMs = Math.max(200, Math.min(2500, ms));
            if (this.isPlaying) {
                this.pause();
                this.play();
            }
        }

        triggerStateChange() {
            if (this.onStepCallback) {
                this.onStepCallback(this.currentCandleIndex, this.activeScenario ? this.activeScenario.candles.length : 0);
            }
            if (this.onStateChangeCallback) {
                this.onStateChangeCallback({
                    isPlaying: this.isPlaying,
                    currentIndex: this.currentCandleIndex,
                    totalCandles: this.activeScenario ? this.activeScenario.candles.length : 0,
                    scenario: this.activeScenario
                });
            }
        }

        render(canvas, options = {}) {
            if (!canvas || !this.activeScenario) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const w = canvas.width;
            const h = canvas.height;
            const padding = { top: 30, right: 65, bottom: 35, left: 15 };
            const plotW = w - padding.left - padding.right;
            const plotH = h - padding.top - padding.bottom;

            // Background
            ctx.fillStyle = options.bg || "#070F2B";
            ctx.fillRect(0, 0, w, h);

            const allCandles = this.activeScenario.candles || [];
            const visibleCandles = allCandles.slice(0, this.currentCandleIndex);
            if (visibleCandles.length === 0) return;

            // Compute price min/max across all candles (or visible plus buffer)
            let minP = Infinity;
            let maxP = -Infinity;
            allCandles.forEach(c => {
                if (c.low < minP) minP = c.low;
                if (c.high > maxP) maxP = c.high;
            });
            const pRange = (maxP - minP) || 0.0010;
            minP -= pRange * 0.08;
            maxP += pRange * 0.08;
            const totalRange = maxP - minP;

            function getY(price) {
                return padding.top + plotH - ((price - minP) / totalRange) * plotH;
            }

            // Grid lines & Price Axis
            ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
            ctx.lineWidth = 1;
            ctx.font = "10px monospace";
            ctx.fillStyle = "#64748B";
            ctx.textAlign = "left";

            const gridSteps = 5;
            for (let i = 0; i <= gridSteps; i++) {
                const p = minP + (totalRange / gridSteps) * i;
                const y = getY(p);
                ctx.beginPath();
                ctx.moveTo(padding.left, y);
                ctx.lineTo(w - padding.right, y);
                ctx.stroke();
                ctx.fillText(p.toFixed(4), w - padding.right + 6, y + 3);
            }

            // Candlestick rendering
            const candleSlot = plotW / allCandles.length;
            const candleW = Math.max(4, Math.min(18, candleSlot * 0.7));

            visibleCandles.forEach((c, i) => {
                const x = padding.left + i * candleSlot + candleSlot / 2;
                const yOpen = getY(c.open);
                const yClose = getY(c.close);
                const yHigh = getY(c.high);
                const yLow = getY(c.low);
                const isBull = c.close >= c.open;
                const candleColor = isBull ? "#10B981" : "#F43F5E";

                // Wick
                ctx.strokeStyle = candleColor;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(x, yHigh);
                ctx.lineTo(x, yLow);
                ctx.stroke();

                // Body
                ctx.fillStyle = candleColor;
                const bodyY = Math.min(yOpen, yClose);
                const bodyH = Math.max(2, Math.abs(yClose - yOpen));
                ctx.fillRect(x - candleW / 2, bodyY, candleW, bodyH);

                // Highlight the latest moving candle
                if (i === visibleCandles.length - 1) {
                    ctx.strokeStyle = "#00F0FF";
                    ctx.lineWidth = 1.5;
                    ctx.strokeRect(x - candleW / 2 - 2, bodyY - 2, candleW + 4, bodyH + 4);

                    // Price Line
                    ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
                    ctx.setLineDash([4, 4]);
                    ctx.beginPath();
                    ctx.moveTo(padding.left, yClose);
                    ctx.lineTo(w - padding.right, yClose);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // Price Tag
                    ctx.fillStyle = "#00F0FF";
                    ctx.fillRect(w - padding.right + 2, yClose - 8, 55, 16);
                    ctx.fillStyle = "#000";
                    ctx.font = "bold 9px monospace";
                    ctx.fillText(c.close.toFixed(4), w - padding.right + 6, yClose + 4);
                }
            });

            // Future shadow outline for remaining candles
            if (options.showGhost && visibleCandles.length < allCandles.length) {
                ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
                ctx.lineWidth = 1;
                for (let i = visibleCandles.length; i < allCandles.length; i++) {
                    const c = allCandles[i];
                    const x = padding.left + i * candleSlot + candleSlot / 2;
                    const yHigh = getY(c.high);
                    const yLow = getY(c.low);
                    ctx.beginPath();
                    ctx.moveTo(x, yHigh);
                    ctx.lineTo(x, yLow);
                    ctx.stroke();
                }
            }

            // Watermark info
            ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
            ctx.font = "bold 11px sans-serif";
            ctx.textAlign = "left";
            ctx.fillText(`${this.activeScenario.instrument || "EUR/USD"} [SIM] • Candle ${this.currentCandleIndex} / ${allCandles.length}`, padding.left + 5, padding.top - 10);
        }
    }

    window.StrativoRPG.ChartReplayEngine = ChartReplayEngine;
    window.ChartReplayEngine = ChartReplayEngine;
})();
