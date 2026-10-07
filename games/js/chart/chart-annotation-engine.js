/* ==========================================================================
   STRATIVO WORLD — CHART ANNOTATION ENGINE
   Namespace: window.StrativoRPG.ChartAnnotationEngine
   Description:
   - Interactive chart marking: Swings, Support/Resistance Zones, Trendlines
   - Smart candle snapping to high/low/open/close
   - Expected region tolerance validation
   - Canvas overlay rendering and state reset
   ========================================================================== */

"use strict";

(function () {
    window.StrativoRPG = window.StrativoRPG || {};

    class ChartAnnotationEngine {
        constructor(config = {}) {
            this.activeChallenge = null;
            this.annotations = [];
            this.activeTool = "SWING_HIGH"; // SWING_HIGH, SWING_LOW, SUPPORT_ZONE, RESISTANCE_ZONE, TRENDLINE
            this.canvas = null;
            this.ctx = null;
            this.isDrawing = false;
            this.startPoint = null;
            this.onFeedbackCallback = null;
        }

        attachCanvas(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d");
            this.setupListeners();
        }

        loadChallenge(challenge) {
            this.annotations = [];
            this.isDrawing = false;
            this.startPoint = null;
            this.activeChallenge = challenge ? JSON.parse(JSON.stringify(challenge)) : null;
            this.activeTool = (this.activeChallenge && this.activeChallenge.targetType) ? this.activeChallenge.targetType : "SWING_HIGH";
            if (this.ctx && this.canvas) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            this.render();
        }

        reset() {
            this.annotations = [];
            this.startPoint = null;
            this.isDrawing = false;
            if (this.ctx && this.canvas) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            if (this.activeChallenge) {
                this.render();
            }
        }

        setTool(tool) {
            this.activeTool = tool;
            this.startPoint = null;
            this.isDrawing = false;
            this.render();
        }

        clear() {
            this.reset();
            window.StrativoRPG.emitGameEvent("chartClear");
        }

        setupListeners() {
            if (!this.canvas) return;

            const getPos = (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.canvas.width / rect.width;
                const scaleY = this.canvas.height / rect.height;
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                return {
                    x: (clientX - rect.left) * scaleX,
                    y: (clientY - rect.top) * scaleY
                };
            };

            const onStart = (e) => {
                if (!this.activeChallenge) return;
                const pos = getPos(e);
                const snapped = this.snapToCandle(pos.x, pos.y);

                if (this.activeTool === "TRENDLINE") {
                    this.isDrawing = true;
                    this.startPoint = snapped;
                } else {
                    // Single point / zone placement
                    this.addAnnotation({
                        type: this.activeTool,
                        x: snapped.x,
                        y: snapped.y,
                        price: snapped.price,
                        candleIndex: snapped.candleIndex
                    });
                }
            };

            const onEnd = (e) => {
                if (this.isDrawing && this.startPoint && this.activeTool === "TRENDLINE") {
                    const pos = getPos(e.changedTouches ? e.changedTouches[0] : e);
                    const snapped = this.snapToCandle(pos.x, pos.y);
                    this.addAnnotation({
                        type: "TRENDLINE",
                        x1: this.startPoint.x,
                        y1: this.startPoint.y,
                        x2: snapped.x,
                        y2: snapped.y,
                        price1: this.startPoint.price,
                        price2: snapped.price
                    });
                    this.isDrawing = false;
                    this.startPoint = null;
                }
            };

            this.canvas.onmousedown = onStart;
            this.canvas.onmouseup = onEnd;
            this.canvas.ontouchstart = (e) => { e.preventDefault(); onStart(e); };
            this.canvas.ontouchend = (e) => { e.preventDefault(); onEnd(e); };
        }

        snapToCandle(pixelX, pixelY) {
            if (!this.activeChallenge) return { x: pixelX, y: pixelY, price: 0, candleIndex: 0 };
            const candles = this.activeChallenge.candles || [];
            const padding = { top: 30, right: 65, bottom: 35, left: 15 };
            const plotW = this.canvas.width - padding.left - padding.right;
            const plotH = this.canvas.height - padding.top - padding.bottom;

            let minP = Infinity, maxP = -Infinity;
            candles.forEach(c => {
                if (c.low < minP) minP = c.low;
                if (c.high > maxP) maxP = c.high;
            });
            const pRange = (maxP - minP) || 0.0010;
            minP -= pRange * 0.08;
            maxP += pRange * 0.08;
            const totalRange = maxP - minP;

            const candleSlot = plotW / candles.length;
            const candleIdx = Math.max(0, Math.min(candles.length - 1, Math.floor((pixelX - padding.left) / candleSlot)));
            const candle = candles[candleIdx];

            const snappedX = padding.left + candleIdx * candleSlot + candleSlot / 2;
            const price = minP + ((padding.top + plotH - pixelY) / plotH) * totalRange;

            // Snap price to either high, low, or close
            const distHigh = Math.abs(candle.high - price);
            const distLow = Math.abs(candle.low - price);
            const distClose = Math.abs(candle.close - price);
            let snappedPrice = price;

            if (distHigh <= distLow && distHigh <= distClose) snappedPrice = candle.high;
            else if (distLow <= distHigh && distLow <= distClose) snappedPrice = candle.low;
            else snappedPrice = candle.close;

            const snappedY = padding.top + plotH - ((snappedPrice - minP) / totalRange) * plotH;

            return {
                x: snappedX,
                y: snappedY,
                price: Number(snappedPrice.toFixed(4)),
                candleIndex: candleIdx
            };
        }

        addAnnotation(annot) {
            this.annotations.push(annot);
            window.StrativoRPG.emitGameEvent("annotationPlaced");
            this.render();
        }

        checkAccuracy() {
            if (!this.activeChallenge || this.annotations.length === 0) {
                return { isCorrect: false, score: 0, message: "No annotations placed." };
            }

            const exp = this.activeChallenge;
            const targetType = exp.targetType;
            const matchedAnnot = this.annotations.find(a => a.type === targetType);

            if (!matchedAnnot) {
                return {
                    isCorrect: false,
                    score: 0,
                    message: `Expected a ${targetType.replace('_', ' ')} marker, but found none.`
                };
            }

            // Check candle index and price tolerance
            const indexDiff = Math.abs(matchedAnnot.candleIndex - exp.expectedCandleIndex);
            const isIndexValid = indexDiff <= (exp.toleranceCandles || 2);
            const isPriceValid = matchedAnnot.price >= exp.expectedPriceRange.min && matchedAnnot.price <= exp.expectedPriceRange.max;

            const isCorrect = isIndexValid && isPriceValid;
            const score = isCorrect ? 100 : (isIndexValid || isPriceValid) ? 50 : 20;

            if (isCorrect) {
                window.StrativoRPG.emitGameEvent("correctHit");
            } else {
                window.StrativoRPG.emitGameEvent("wrongHit");
            }

            return {
                isCorrect,
                score,
                message: isCorrect
                    ? `Outstanding! Target ${targetType.replace('_', ' ')} placed accurately within tolerance.`
                    : `Placement off. Expected near candle ${exp.expectedCandleIndex + 1} (${exp.expectedPriceRange.min.toFixed(4)} - ${exp.expectedPriceRange.max.toFixed(4)}). ${exp.explanation}`
            };
        }

        render() {
            if (!this.canvas || !this.ctx || !this.activeChallenge) return;
            const ctx = this.ctx;
            const w = this.canvas.width;
            const h = this.canvas.height;
            const padding = { top: 30, right: 65, bottom: 35, left: 15 };
            const plotW = w - padding.left - padding.right;
            const plotH = h - padding.top - padding.bottom;

            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = "#070F2B";
            ctx.fillRect(0, 0, w, h);

            const candles = this.activeChallenge.candles || [];
            if (candles.length === 0) return;

            let minP = Infinity, maxP = -Infinity;
            candles.forEach(c => {
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

            // Grid
            ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
            ctx.lineWidth = 1;
            ctx.font = "10px monospace";
            ctx.fillStyle = "#64748B";
            ctx.textAlign = "left";

            for (let i = 0; i <= 5; i++) {
                const p = minP + (totalRange / 5) * i;
                const y = getY(p);
                ctx.beginPath();
                ctx.moveTo(padding.left, y);
                ctx.lineTo(w - padding.right, y);
                ctx.stroke();
                ctx.fillText(p.toFixed(4), w - padding.right + 6, y + 3);
            }

            // Candlesticks
            const candleSlot = plotW / candles.length;
            const candleW = Math.max(4, Math.min(18, candleSlot * 0.7));

            candles.forEach((c, i) => {
                const x = padding.left + i * candleSlot + candleSlot / 2;
                const yOpen = getY(c.open);
                const yClose = getY(c.close);
                const yHigh = getY(c.high);
                const yLow = getY(c.low);
                const isBull = c.close >= c.open;
                const color = isBull ? "#10B981" : "#F43F5E";

                ctx.strokeStyle = color;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(x, yHigh);
                ctx.lineTo(x, yLow);
                ctx.stroke();

                ctx.fillStyle = color;
                const bodyY = Math.min(yOpen, yClose);
                const bodyH = Math.max(2, Math.abs(yClose - yOpen));
                ctx.fillRect(x - candleW / 2, bodyY, candleW, bodyH);
            });

            // Annotations Overlay
            this.annotations.forEach(a => {
                if (a.type === "SWING_HIGH") {
                    ctx.fillStyle = "#00F0FF";
                    ctx.beginPath();
                    ctx.arc(a.x, a.y - 12, 6, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.font = "bold 9px sans-serif";
                    ctx.fillStyle = "#00F0FF";
                    ctx.textAlign = "center";
                    ctx.fillText("SH", a.x, a.y - 22);
                } else if (a.type === "SWING_LOW") {
                    ctx.fillStyle = "#F59E0B";
                    ctx.beginPath();
                    ctx.arc(a.x, a.y + 12, 6, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.font = "bold 9px sans-serif";
                    ctx.fillStyle = "#F59E0B";
                    ctx.textAlign = "center";
                    ctx.fillText("SL", a.x, a.y + 26);
                } else if (a.type === "SUPPORT_ZONE") {
                    ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
                    ctx.strokeStyle = "#10B981";
                    ctx.lineWidth = 1.5;
                    ctx.fillRect(padding.left, a.y - 8, plotW, 16);
                    ctx.strokeRect(padding.left, a.y - 8, plotW, 16);
                    ctx.fillStyle = "#A7F3D0";
                    ctx.font = "bold 9px sans-serif";
                    ctx.textAlign = "left";
                    ctx.fillText("SUPPORT ZONE", padding.left + 8, a.y + 3);
                } else if (a.type === "RESISTANCE_ZONE") {
                    ctx.fillStyle = "rgba(244, 63, 94, 0.25)";
                    ctx.strokeStyle = "#F43F5E";
                    ctx.lineWidth = 1.5;
                    ctx.fillRect(padding.left, a.y - 8, plotW, 16);
                    ctx.strokeRect(padding.left, a.y - 8, plotW, 16);
                    ctx.fillStyle = "#FECDD3";
                    ctx.font = "bold 9px sans-serif";
                    ctx.textAlign = "left";
                    ctx.fillText("RESISTANCE ZONE", padding.left + 8, a.y + 3);
                } else if (a.type === "TRENDLINE") {
                    ctx.strokeStyle = "#FCD34D";
                    ctx.lineWidth = 2;
                    ctx.setLineDash([6, 3]);
                    ctx.beginPath();
                    ctx.moveTo(a.x1, a.y1);
                    ctx.lineTo(a.x2, a.y2);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
            });

            // Header watermark
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            ctx.font = "bold 11px sans-serif";
            ctx.textAlign = "left";
            ctx.fillText(`TOOL: ${this.activeTool.replace('_', ' ')} • Tap or Drag to mark chart`, padding.left + 5, padding.top - 10);
        }
    }

    window.StrativoRPG.ChartAnnotationEngine = ChartAnnotationEngine;
    window.ChartAnnotationEngine = ChartAnnotationEngine;
})();
