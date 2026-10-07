/* ==========================================================================
   STRATIVO WORLD — DISTRICT 6: PSYCHOLOGY ZONE SPECIALIZED ENGINES
   Namespace: window.StrativoRPG.PsychEngine / window.StrativoRPG.PsychEngines
   Description:
   - TiltBarometerEngine: Dynamic emotional stress & cooldown calculation + barometer canvas
   - FOMOResistanceEngine: Risk:Reward degradation on chase calculations + visual canvas
   - JournalAuditorEngine: Discipline compliance scoring vs outcome metrics + radar canvas
   - PsychArenaEngine: 10-round fast cognitive defense gauntlet
   - MindFortressBossEngine: Multi-turn Apex Final Boss battle state machine
   ========================================================================== */

"use strict";

(function () {
    window.StrativoRPG = window.StrativoRPG || {};

    // 1. Static/Dynamic Neural & Equilibrium Waveform Canvas Renderer
    function renderEquilibriumWave(canvas, stressLevel = 0.2, options = {}) {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#030712";
        ctx.fillRect(0, 0, w, h);

        // Cyber Grid Lines
        ctx.strokeStyle = "rgba(139, 92, 246, 0.08)";
        ctx.lineWidth = 1;
        for (let y = 20; y < h; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
        for (let x = 20; x < w; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }

        // Draw Center Baseline
        ctx.strokeStyle = "rgba(6, 182, 212, 0.3)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Brainwave / Pulse curve
        const waveColor = stressLevel > 0.6 ? "#F43F5E" : stressLevel > 0.3 ? "#F59E0B" : "#8B5CF6";
        ctx.strokeStyle = waveColor;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = waveColor;
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const freq = 0.03 + stressLevel * 0.05;
        const amp = (h / 4) * (0.3 + stressLevel * 0.7);

        for (let x = 0; x < w; x++) {
            const y = h / 2 + Math.sin(x * freq) * amp * Math.cos(x * 0.01);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Overlay status text
        ctx.fillStyle = waveColor;
        ctx.font = "bold 11px Inter, sans-serif";
        const label = stressLevel > 0.6 ? "STATE: ACUTE TILT / HIGH STRESS" : stressLevel > 0.3 ? "STATE: ELEVATED PULSE / CAUTION" : "STATE: ZEN EQUILIBRIUM (OPTIMAL)";
        ctx.fillText(label, 15, 20);
    }

    // 2. Tilt Barometer & Stress Level Calculator
    class TiltBarometerEngine {
        constructor() {
            this.reset();
        }

        reset() {
            this.consecutiveLosses = 0;
            this.lotMultiplier = 1.0;
            this.timeSinceLastLossMin = 0;
        }

        calculateTiltScore(consecutiveLosses = 0, lotMultiplier = 1.0, timeSinceLossMin = 0, isAngry = false) {
            let score = consecutiveLosses * 0.2;
            if (lotMultiplier > 1.0) score += (lotMultiplier - 1.0) * 0.35;
            if (timeSinceLossMin < 15 && consecutiveLosses > 0) score += 0.2;
            if (isAngry) score += 0.15;

            score = Math.max(0, Math.min(1.0, score));
            let recommendation = "Clear for trading. Mental state is calm and objective.";
            let cooldownMinutes = 0;
            let tiltLevel = "CALM / EQUILIBRIUM";
            let lockoutRequired = false;

            if (score >= 0.7) {
                recommendation = "MANDATORY CIRCUIT BREAKER: Lock platform for the remainder of the session (24h cooldown).";
                cooldownMinutes = 1440;
                tiltLevel = "SEVERE TILT";
                lockoutRequired = true;
            } else if (score >= 0.45) {
                recommendation = "HIGH TILT HAZARD: Step away from screen for 60 minutes. Complete breathing exercise.";
                cooldownMinutes = 60;
                tiltLevel = "MODERATE TILT";
                lockoutRequired = true;
            } else if (score >= 0.25) {
                recommendation = "MILD STRESS DETECTED: Take a 15-minute walk before taking any new trades.";
                cooldownMinutes = 15;
                tiltLevel = "MILD STRAIN";
                lockoutRequired = false;
            }

            return {
                tiltIndex: Number(score.toFixed(2)),
                tiltScore: Number(score.toFixed(2)),
                percentage: Math.round(score * 100),
                tiltLevel,
                recommendation,
                cooldownMinutes,
                lockoutRequired,
                isCompromised: score >= 0.45
            };
        }

        renderBarometer(canvas, tiltScore = 0.5) {
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            const w = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = "#030712";
            ctx.fillRect(0, 0, w, h);

            // Barometer Arc / Gauge
            const cx = w / 2;
            const cy = h * 0.85;
            const radius = Math.min(w * 0.38, h * 0.7);

            ctx.lineWidth = 18;
            ctx.strokeStyle = "#1E293B";
            ctx.beginPath();
            ctx.arc(cx, cy, radius, Math.PI, Math.PI * 2);
            ctx.stroke();

            // Gradient Arc (Green -> Amber -> Red)
            const grad = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
            grad.addColorStop(0, "#10B981");
            grad.addColorStop(0.5, "#F59E0B");
            grad.addColorStop(1, "#F43F5E");

            const endAngle = Math.PI + Math.PI * Math.min(1, Math.max(0, tiltScore));
            ctx.strokeStyle = grad;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, Math.PI, endAngle);
            ctx.stroke();

            // Center needle
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(endAngle);
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(0, 0, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Labels
            ctx.fillStyle = "#94A3B8";
            ctx.font = "bold 10px Inter, sans-serif";
            ctx.fillText("OPTIMAL (0.0)", cx - radius - 10, cy + 18);
            ctx.fillText("MODERATE (0.5)", cx - 35, cy - radius - 10);
            ctx.fillText("DANGER (1.0)", cx + radius - 40, cy + 18);
        }
    }

    // 3. FOMO Resistance & R:R Degradation Engine
    class FOMOResistanceEngine {
        calculateDegradation(plannedEntry = 100, stopLoss = 95, takeProfit = 115, currentPrice = 107) {
            const plannedRisk = Math.abs(plannedEntry - stopLoss);
            const plannedReward = Math.abs(takeProfit - plannedEntry);
            const initialRR = plannedRisk > 0 ? plannedReward / plannedRisk : 0;

            const chasedRisk = Math.abs(currentPrice - stopLoss);
            const chasedReward = Math.abs(takeProfit - currentPrice);
            const chasedRR = chasedRisk > 0 ? chasedReward / chasedRisk : 0;

            const degradationPct = initialRR > 0 ? ((initialRR - chasedRR) / initialRR) * 100 : 0;

            return {
                initialRR: Number(initialRR.toFixed(2)),
                plannedRR: Number(initialRR.toFixed(2)),
                chasedRR: Number(chasedRR.toFixed(2)),
                degradationPct: Number(Math.max(0, degradationPct).toFixed(1)),
                isSevere: degradationPct > 50,
                verdict: degradationPct > 50 ? "REJECT CHASE: Critical edge destruction" : "ACCEPTABLE PULLBACK ENTRY"
            };
        }

        calculateChaseDegradation(plannedEntry, currentPrice, stopLoss, takeProfit) {
            return this.calculateDegradation(plannedEntry, stopLoss, takeProfit, currentPrice);
        }

        renderDegradationComparison(canvas, plannedEntry = 100, stopLoss = 95, takeProfit = 115, currentPrice = 107) {
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            const w = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = "#030712";
            ctx.fillRect(0, 0, w, h);

            const deg = this.calculateDegradation(plannedEntry, stopLoss, takeProfit, currentPrice);

            // Bar 1: Initial R:R
            const barW = 120;
            const x1 = w * 0.25 - barW / 2;
            const x2 = w * 0.75 - barW / 2;
            const maxH = h * 0.6;

            ctx.fillStyle = "#10B981";
            const h1 = Math.min(maxH, (deg.initialRR / 4) * maxH);
            ctx.fillRect(x1, h - 35 - h1, barW, h1);

            ctx.fillStyle = "#F43F5E";
            const h2 = Math.min(maxH, (deg.chasedRR / 4) * maxH);
            ctx.fillRect(x2, h - 35 - h2, barW, h2);

            // Text Labels
            ctx.fillStyle = "#FFF";
            ctx.font = "bold 12px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`Planned Setup (${deg.initialRR.toFixed(2)}:1)`, x1 + barW / 2, h - 15);
            ctx.fillText(`Chased Late (${deg.chasedRR.toFixed(2)}:1)`, x2 + barW / 2, h - 15);

            ctx.fillStyle = "#10B981";
            ctx.fillText(`${deg.initialRR.toFixed(2)} : 1`, x1 + barW / 2, h - 45 - h1);

            ctx.fillStyle = "#F43F5E";
            ctx.fillText(`${deg.chasedRR.toFixed(2)} : 1 (-${deg.degradationPct.toFixed(0)}%)`, x2 + barW / 2, h - 45 - h2);
            ctx.textAlign = "left";
        }
    }

    // 4. Performance & Journal Compliance Auditor
    class JournalAuditorEngine {
        auditTrade(checklistPassed, emotionalScore, pnlDollar, isStopRespected) {
            let score = 100;
            const violations = [];

            if (!checklistPassed) {
                score -= 35;
                violations.push("Executed trade without completing pre-flight checklist");
            }
            if (emotionalScore > 6) {
                score -= 25;
                violations.push("Entered trade in high emotional excitement/anxiety (>6/10)");
            }
            if (!isStopRespected) {
                score -= 40;
                violations.push("Moved or ignored technical stop-loss");
            }

            score = Math.max(0, score);
            let grade = "A+";
            if (score < 60) grade = "F";
            else if (score < 75) grade = "C";
            else if (score < 90) grade = "B";

            return {
                complianceScore: score,
                compositeScore: score,
                disciplineGrade: grade,
                grade,
                isProcessGood: score >= 85,
                keyStrength: score >= 85 ? "Disciplined Execution" : "Requires Protocol Adherence",
                violations,
                pnlDollar
            };
        }

        auditTradeLogs(logs = []) {
            if (!logs || logs.length === 0) {
                return { compositeScore: 100, disciplineGrade: "A+", keyStrength: "Clean Slate" };
            }
            let total = 0;
            logs.forEach(l => {
                const res = this.auditTrade(l.prePlanCompliance > 70, l.emotionalScore || 3, 100, l.followedExit !== false);
                total += res.complianceScore;
            });
            const avg = Math.round(total / logs.length);
            let grade = avg >= 90 ? "A+" : avg >= 80 ? "A" : avg >= 70 ? "B" : "C";
            return {
                compositeScore: avg,
                disciplineGrade: grade,
                keyStrength: avg >= 80 ? "High Rule Compliance" : "Inconsistent Execution"
            };
        }

        renderRadar(canvas, metrics = {}) {
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            const w = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = "#030712";
            ctx.fillRect(0, 0, w, h);

            const cx = w / 2;
            const cy = h / 2;
            const radius = Math.min(w, h) * 0.38;

            const categories = [
                { name: "Pre-Plan", val: metrics.prePlanCompliance || 90 },
                { name: "Risk Rules", val: metrics.riskDiscipline || 85 },
                { name: "Detachment", val: metrics.emotionalDetachment || 75 },
                { name: "Stop Adherence", val: metrics.exitExecution || 95 },
                { name: "Post Review", val: metrics.postTradeReview || 80 }
            ];

            const numSides = categories.length;
            const angleStep = (Math.PI * 2) / numSides;

            // Concentric rings
            ctx.strokeStyle = "rgba(139, 92, 246, 0.15)";
            ctx.lineWidth = 1;
            [0.25, 0.5, 0.75, 1.0].forEach(level => {
                ctx.beginPath();
                for (let i = 0; i < numSides; i++) {
                    const a = i * angleStep - Math.PI / 2;
                    const x = cx + Math.cos(a) * radius * level;
                    const y = cy + Math.sin(a) * radius * level;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.stroke();
            });

            // Data Polygon
            ctx.fillStyle = "rgba(6, 182, 212, 0.25)";
            ctx.strokeStyle = "#06B6D4";
            ctx.lineWidth = 2;
            ctx.beginPath();
            categories.forEach((cat, i) => {
                const a = i * angleStep - Math.PI / 2;
                const r = (cat.val / 100) * radius;
                const x = cx + Math.cos(a) * r;
                const y = cy + Math.sin(a) * r;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Corner labels
            ctx.fillStyle = "#DDD6FE";
            ctx.font = "bold 10px Inter, sans-serif";
            ctx.textAlign = "center";
            categories.forEach((cat, i) => {
                const a = i * angleStep - Math.PI / 2;
                const lx = cx + Math.cos(a) * (radius + 18);
                const ly = cy + Math.sin(a) * (radius + 18);
                ctx.fillText(`${cat.name} (${cat.val}%)`, lx, ly);
            });
            ctx.textAlign = "left";
        }
    }

    // 5. Mental Fortitude Arena Engine (10-Round Gauntlet)
    class PsychArenaEngine {
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

        recordAnswer(isCorrect) {
            if (isCorrect) {
                this.correctCount++;
                this.streak++;
                if (this.streak > this.bestStreak) this.bestStreak = this.streak;
                this.score += 10;
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
                isFinished: this.isFinished,
                accuracy: Math.round((this.correctCount / (this.round - (this.isFinished ? 0 : 1))) * 100)
            };
        }
    }

    // 6. Mind Fortress Final Boss Engine
    class MindFortressBossEngine {
        constructor() {
            this.reset();
        }

        reset() {
            this.currentStageIndex = 0;
            this.stage = 1;
            this.maxStages = 8;
            this.playerStamina = 100;
            this.mentalStamina = 100;
            this.bossResistance = 100;
            this.bossHp = 100;
            this.violations = 0;
            this.ruleViolations = 0;
            this.turnHistory = [];
            this.battleLog = [];
            this.isVictory = false;
            this.isDefeated = false;
            this.currentPhaseName = "Phase 1: Greed Surge";
        }

        executeTurn(selectedOption = {}, stageData = {}) {
            if (this.isVictory || this.isDefeated) return this.getStatus();

            const isDisciplined = Boolean(selectedOption.isDisciplined || selectedOption.isSafe);
            const dmg = selectedOption.damage || (isDisciplined ? 15 : 0);
            const cost = selectedOption.staminaCost || (isDisciplined ? 0 : 25);

            this.bossResistance = Math.max(0, this.bossResistance - dmg);
            this.bossHp = this.bossResistance;
            this.playerStamina = Math.max(0, this.playerStamina - cost);
            this.mentalStamina = this.playerStamina;

            if (!isDisciplined) {
                this.violations++;
                this.ruleViolations++;
            }

            const turnInfo = {
                stage: this.currentStageIndex + 1,
                choice: selectedOption.label || selectedOption.text || "Action",
                isDisciplined,
                damageDealt: dmg,
                staminaLost: cost,
                staminaRemaining: this.playerStamina,
                bossResistanceRemaining: this.bossResistance
            };
            this.turnHistory.push(turnInfo);
            this.battleLog.push(turnInfo);

            if (this.playerStamina <= 0) {
                this.isDefeated = true;
                this.defeatReason = "Emotional impulses overrode trading discipline.";
            } else if (this.bossResistance <= 0 || this.currentStageIndex >= this.maxStages - 1) {
                this.isVictory = true;
            } else {
                this.currentStageIndex++;
                this.stage = this.currentStageIndex + 1;
                const phases = [
                    "Greed Surge", "Panic Sellout", "Revenge Chasing", "Euphoric Overconfidence",
                    "Hesitation Trap", "Sunk Cost Delusion", "Recency Bias Flood", "Apex Fortitude"
                ];
                this.currentPhaseName = phases[this.currentStageIndex] || `Phase ${this.stage}`;
            }

            return this.getStatus();
        }

        getStatus() {
            return {
                currentStageIndex: this.currentStageIndex,
                stage: this.stage,
                maxStages: this.maxStages,
                playerStamina: this.playerStamina,
                mentalStamina: this.mentalStamina,
                bossResistance: this.bossResistance,
                bossHp: this.bossHp,
                violations: this.violations,
                ruleViolations: this.ruleViolations,
                isVictory: this.isVictory,
                isDefeated: this.isDefeated,
                defeatReason: this.defeatReason || "",
                currentPhaseName: this.currentPhaseName,
                turnHistory: this.turnHistory,
                battleLog: this.battleLog
            };
        }
    }

    // Unified PsychEngine helper object
    const PsychEngine = {
        renderEquilibriumWave,
        calculateTiltScore(losses, mult, timeMin, isAngry) {
            return new TiltBarometerEngine().calculateTiltScore(losses, mult, timeMin, isAngry);
        },
        calculateChaseDegradation(entry, current, stop, target) {
            return new FOMOResistanceEngine().calculateDegradation(entry, stop, target, current);
        },
        auditTrade(passed, emotion, pnl, stopRespected) {
            return new JournalAuditorEngine().auditTrade(passed, emotion, pnl, stopRespected);
        },
        openPsychAcademy() { if (window.StrativoRPG.openAcademyModal) window.StrativoRPG.openAcademyModal(); },
        openDisciplineDojo() { if (window.StrativoRPG.openDojoModal) window.StrativoRPG.openDojoModal(); },
        openBiasObservatory() { if (window.StrativoRPG.openBiasModal) window.StrativoRPG.openBiasModal(); },
        openFOMOChamber() { if (window.StrativoRPG.openFOMOModal) window.StrativoRPG.openFOMOModal(); },
        openPatiencePavilion() { if (window.StrativoRPG.openPatienceModal) window.StrativoRPG.openPatienceModal(); },
        openTiltLab() { if (window.StrativoRPG.openTiltModal) window.StrativoRPG.openTiltModal(); },
        openRevengeDefense() { if (window.StrativoRPG.openRevengeModal) window.StrativoRPG.openRevengeModal(); },
        openJournalSanctuary() { if (window.StrativoRPG.openJournalModal) window.StrativoRPG.openJournalModal(); },
        openEgoChamber() { if (window.StrativoRPG.openEgoModal) window.StrativoRPG.openEgoModal(); },
        openStreakCenter() { if (window.StrativoRPG.openStreakModal) window.StrativoRPG.openStreakModal(); },
        openScenarioTheater() { if (window.StrativoRPG.openTheaterModal) window.StrativoRPG.openTheaterModal(); },
        launchPsychArena() { if (window.StrativoRPG.launchPsychArena) window.StrativoRPG.launchPsychArena(); },
        openMindFortress() { if (window.StrativoRPG.openMindFortressModal) window.StrativoRPG.openMindFortressModal(); }
    };

    // Export Namespaces & Aliases
    window.StrativoRPG.PsychEngine = PsychEngine;
    window.StrativoRPG.PsychEngines = {
        renderEquilibriumWave,
        TiltBarometerEngine,
        FOMOResistanceEngine,
        FomoDegradationEngine: FOMOResistanceEngine,
        JournalAuditorEngine,
        PsychArenaEngine,
        MindFortressBossEngine
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = { PsychEngine, PsychEngines: window.StrativoRPG.PsychEngines };
    }
})();
