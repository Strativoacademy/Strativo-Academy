/* ==========================================================================
   STRATIVO WORLD — DISTRICT 5: RISK LAB WORLD ENGINE
   Version: 1.0.0 (Phase 5.0 Risk Lab World Engine V1)
   Namespace: StrativoRPG.RiskLabWorld
   ========================================================================== */

"use strict";

(function () {
    window.StrativoRPG = window.StrativoRPG || {};

    // Safe Event Emitter
    window.StrativoRPG.emitGameEvent = window.StrativoRPG.emitGameEvent || function (eventName, eventData = {}) {
        if (window.StrativoWorldAudio && typeof window.StrativoWorldAudio.playEvent === "function") {
            window.StrativoWorldAudio.playEvent(eventName, eventData);
        }
        if (window.StrativoWorldHaptics && typeof window.StrativoWorldHaptics.triggerForEvent === "function") {
            window.StrativoWorldHaptics.triggerForEvent(eventName, eventData);
        }
        try {
            window.dispatchEvent(new CustomEvent("strativo:gameEvent", { detail: { eventName, eventData } }));
        } catch {}
    };

    const Rectangle = window.StrativoRPG.Rectangle || class {
        constructor(x, y, w, h, id, type) {
            this.x = Number(x) || 0;
            this.y = Number(y) || 0;
            this.width = Number(w) || 0;
            this.height = Number(h) || 0;
            this.id = id || "rect_" + Math.random().toString(36).slice(2, 7);
            this.type = type || "solid";
        }
        get left() { return this.x; }
        get right() { return this.x + this.width; }
        get top() { return this.y; }
        get bottom() { return this.y + this.height; }
        get centerX() { return this.x + this.width / 2; }
        get centerY() { return this.y + this.height / 2; }
        intersects(o) {
            if (!o) return false;
            return this.left < o.right && this.right > o.left && this.top < o.bottom && this.bottom > o.top;
        }
    };

    // Master Map Configuration (3200 x 2400)
    const MAP_CONFIG = {
        version: "1.0.0",
        districtId: "risk-lab",
        districtName: "Risk Lab",
        districtSubtitle: "Metropolis of Capital Preservation, Mathematical Sizing, Probability & Survival",
        bounds: { width: 3200, height: 2400 },
        spawn: { x: 1600, y: 1350, direction: "up" },
        theme: {
            primary: "#10B981",    // Neon Emerald
            secondary: "#00F0FF",  // Neon Cyan
            accent: "#F59E0B",     // Neon Amber
            danger: "#F43F5E",     // Neon Rose
            purple: "#8B5CF6",
            darkBg: "#020617",
            roadBg: "#0A1128",
            sidewalkBg: "#0D1F3C",
            buildingWall: "#0A1E3F",
            buildingRoof: "#07132B"
        },
        quarters: [
            { id: "risk_plaza", name: "RISK PLAZA", description: "Central civic plaza and heart of Risk Management Research", bounds: { x: 1250, y: 950, w: 700, h: 500 }, color: "#10B981" },
            { id: "position_sizing_quarter", name: "POSITION SIZING QUARTER", description: "Mathematical lot sizing, capital allocation and risk percentages", bounds: { x: 100, y: 100, w: 1050, h: 750 }, color: "#00F0FF" },
            { id: "stop_loss_quarter", name: "STOP-LOSS QUARTER", description: "Structural invalidation, volatility buffers and technical stops", bounds: { x: 2050, y: 100, w: 1050, h: 750 }, color: "#F59E0B" },
            { id: "risk_reward_quarter", name: "RISK/REWARD QUARTER", description: "Mathematical expectancy, payoff asymmetry and trade quality", bounds: { x: 100, y: 950, w: 1050, h: 650 }, color: "#8B5CF6" },
            { id: "leverage_quarter", name: "LEVERAGE QUARTER", description: "Margin mechanics, leverage exposure and liquidation defense", bounds: { x: 2050, y: 950, w: 1050, h: 650 }, color: "#EC4899" },
            { id: "drawdown_quarter", name: "DRAWDOWN QUARTER", description: "Asymmetric recovery math, consecutive loss survival and equity defense", bounds: { x: 100, y: 1650, w: 1050, h: 650 }, color: "#3B82F6" },
            { id: "risk_psychology_quarter", name: "RISK PSYCHOLOGY QUARTER", description: "Emotional discipline, revenge trading defense and rule adherence", bounds: { x: 2050, y: 1650, w: 1050, h: 650 }, color: "#10B981" },
            { id: "risk_arena_quarter", name: "RISK ARENA & SURVIVAL VAULT", description: "10-Round combat evaluation and Apex Survival Vault challenge", bounds: { x: 1200, y: 100, w: 800, h: 750 }, color: "#F43F5E" }
        ],
        roads: [
            { id: "main_avenue", name: "Risk Grand Boulevard", x: 1520, y: 0, w: 160, h: 2400, orientation: "vertical" },
            { id: "north_boulevard", name: "Preservation Expressway", x: 0, y: 850, w: 3200, h: 100, orientation: "horizontal" },
            { id: "south_boulevard", name: "Expectancy Crossway", x: 0, y: 1550, w: 3200, h: 100, orientation: "horizontal" },
            { id: "west_lane", name: "Sizing Way", x: 1150, y: 0, w: 100, h: 2400, orientation: "vertical" },
            { id: "east_lane", name: "Margin Corridor", x: 1950, y: 0, w: 100, h: 2400, orientation: "vertical" }
        ],
        buildings: [
            { id: "bld_risk_academy", name: "Risk Academy", subtitle: "Capital Preservation & Risk Foundations", x: 250, y: 220, w: 380, h: 220, quarter: "position_sizing_quarter", themeColor: "#00F0FF", icon: "fa-graduation-cap", entrance: { x: 440, y: 440, w: 80, h: 20 }, interiorId: "risk_academy", promptText: "Enter Risk Academy" },
            { id: "bld_position_forge", name: "Position Size Forge", subtitle: "Precision Lot Sizing & Exposure Engine", x: 700, y: 220, w: 380, h: 220, quarter: "position_sizing_quarter", themeColor: "#10B981", icon: "fa-calculator", entrance: { x: 890, y: 440, w: 80, h: 20 }, interiorId: "position_forge", promptText: "Enter Position Forge" },
            { id: "bld_stoploss_workshop", name: "Stop-Loss Workshop", subtitle: "Structural Invalidation & Technical Stops", x: 2200, y: 220, w: 380, h: 220, quarter: "stop_loss_quarter", themeColor: "#F59E0B", icon: "fa-shield-halved", entrance: { x: 2390, y: 440, w: 80, h: 20 }, interiorId: "stoploss_workshop", promptText: "Enter Stop-Loss Workshop" },
            { id: "bld_rr_table", name: "Risk/Reward Trading Table", subtitle: "Payoff Asymmetry & Quality Evaluation", x: 250, y: 1050, w: 380, h: 200, quarter: "risk_reward_quarter", themeColor: "#8B5CF6", icon: "fa-scale-balanced", entrance: { x: 440, y: 1250, w: 80, h: 20 }, interiorId: "rr_table", promptText: "Enter R:R Trading Table" },
            { id: "bld_expectancy_lab", name: "Expectancy Laboratory", subtitle: "Mathematical Edge & Win-Rate Synthesis", x: 700, y: 1050, w: 380, h: 200, quarter: "risk_reward_quarter", themeColor: "#A855F7", icon: "fa-chart-pie", entrance: { x: 890, y: 1250, w: 80, h: 20 }, interiorId: "expectancy_lab", promptText: "Enter Expectancy Lab" },
            { id: "bld_leverage_tower", name: "Leverage Control Tower", subtitle: "Margin Pressure & Liquidation Modeling", x: 2200, y: 1050, w: 380, h: 200, quarter: "leverage_quarter", themeColor: "#EC4899", icon: "fa-tower-observation", entrance: { x: 2390, y: 1250, w: 80, h: 20 }, interiorId: "leverage_tower", promptText: "Enter Leverage Tower" },
            { id: "bld_drawdown_obs", name: "Drawdown Observatory", subtitle: "Equity Curve Survival & Streak Defense", x: 250, y: 1750, w: 380, h: 200, quarter: "drawdown_quarter", themeColor: "#3B82F6", icon: "fa-water", entrance: { x: 440, y: 1950, w: 80, h: 20 }, interiorId: "drawdown_observatory", promptText: "Enter Drawdown Observatory" },
            { id: "bld_recovery_lab", name: "Recovery Laboratory", subtitle: "Asymmetric Gain Mathematics & Recovery", x: 700, y: 1750, w: 380, h: 200, quarter: "drawdown_quarter", themeColor: "#60A5FA", icon: "fa-arrow-trend-up", entrance: { x: 890, y: 1950, w: 80, h: 20 }, interiorId: "recovery_lab", promptText: "Enter Recovery Lab" },
            { id: "bld_mistake_gallery", name: "Risk Mistake Gallery", subtitle: "Museum of Account-Fatal Trading Errors", x: 2200, y: 1750, w: 380, h: 200, quarter: "risk_psychology_quarter", themeColor: "#F43F5E", icon: "fa-triangle-exclamation", entrance: { x: 2390, y: 1950, w: 80, h: 20 }, interiorId: "mistake_gallery", promptText: "Enter Mistake Gallery" },
            { id: "bld_decision_lab", name: "Decision Psychology Lab", subtitle: "Anti-Tilt & Revenge Trading Defense", x: 2650, y: 1750, w: 380, h: 200, quarter: "risk_psychology_quarter", themeColor: "#10B981", icon: "fa-brain", entrance: { x: 2840, y: 1950, w: 80, h: 20 }, interiorId: "decision_lab", promptText: "Enter Decision Lab" },
            { id: "bld_scenario_theater", name: "Risk Scenario Theater", subtitle: "Branching Risk Narrative Decisions", x: 2650, y: 1050, w: 380, h: 200, quarter: "leverage_quarter", themeColor: "#F59E0B", icon: "fa-masks-theater", entrance: { x: 2840, y: 1250, w: 80, h: 20 }, interiorId: "scenario_theater", promptText: "Enter Scenario Theater" },
            { id: "bld_mission_hq", name: "Risk District Mission HQ", subtitle: "District Director & Tactical Risk Journal", x: 1350, y: 1050, w: 500, h: 200, quarter: "risk_plaza", themeColor: "#10B981", icon: "fa-compass", entrance: { x: 1600, y: 1250, w: 80, h: 20 }, interiorId: "mission_hq", promptText: "Enter Mission HQ" }
        ],
        landmarks: [
            { id: "lm_risk_central_tower", name: "Risk Central Tower", x: 1600, y: 980, w: 120, h: 120, icon: "fa-shield-halved", color: "#10B981", lore: "The nerve center of Risk Lab projecting live simulated risk telemetry across the district." },
            { id: "lm_position_forge", name: "Position Size Forge Landmark", x: 600, y: 400, w: 90, h: 90, icon: "fa-calculator", color: "#00F0FF", lore: "Where lot sizes are hammered out with mathematical precision." },
            { id: "lm_stoploss_workshop", name: "Structural Invalidation Spire", x: 2500, y: 400, w: 90, h: 90, icon: "fa-shield", color: "#F59E0B", lore: "Dedicated to the principle: Stops belong at structural invalidation, never arbitrary points." },
            { id: "lm_rr_trading_table", name: "Expectancy Monolith", x: 600, y: 1150, w: 80, h: 80, icon: "fa-scale-balanced", color: "#8B5CF6", lore: "A monument showing how positive expectancy turns small edges into fortunes." },
            { id: "lm_leverage_tower", name: "Margin Pressure Beacon", x: 2500, y: 1150, w: 80, h: 80, icon: "fa-tower-observation", color: "#EC4899", lore: "Emits warning pulses when leverage exposure exceeds safe account thresholds." },
            { id: "lm_drawdown_observatory", name: "Drawdown Depth Gauge", x: 600, y: 1900, w: 80, h: 80, icon: "fa-water", color: "#3B82F6", lore: "Visually illustrates the asymmetric hill required to recover from deep losses." },
            { id: "lm_risk_mistake_gallery", name: "Account Ruin Memorial", x: 2500, y: 1900, w: 80, h: 80, icon: "fa-triangle-exclamation", color: "#F43F5E", lore: "Chronicles the downfall of traders who ignored stops, overleveraged, or revenge traded." },
            { id: "lm_survival_vault", name: "Apex Survival Vault", x: 1600, y: 220, w: 140, h: 70, icon: "fa-vault", color: "#F43F5E", lore: "The ultimate trial testing whether you can protect capital and survive uncertain market sequences." }
        ],
        explorationPoints: [
            { id: "exp_01", name: "Position Calibration Terminal", x: 180, y: 300, xp: 15, lore: "Position size must be the dependent variable, derived from your stop distance and risk dollar." },
            { id: "exp_02", name: "Invalidation Anchor Stone", x: 950, y: 180, xp: 15, lore: "If price reaches your stop, your hypothesis was incorrect. Never argue with the tape." },
            { id: "exp_03", name: "Expectancy Constant Relic", x: 2800, y: 300, xp: 20, lore: "A 40% win rate with a 1:2 R:R beats an 80% win rate with an unchecked negative tail." },
            { id: "exp_04", name: "Margin Warning Beacon", x: 2950, y: 1150, xp: 15, lore: "Usable margin is your oxygen tank in volatile markets." },
            { id: "exp_05", name: "Drawdown Cliff Marker", x: 180, y: 1200, xp: 20, lore: "A 50% loss requires a 100% gain to recover. Protect capital at all costs." },
            { id: "exp_06", name: "Asymmetric Recovery Matrix", x: 1050, y: 1200, xp: 15, lore: "The math of recovery is non-linear; deep holes require exponential climb." },
            { id: "exp_07", name: "Anti-Tilt Monolith", x: 2100, y: 1200, xp: 20, lore: "Frustration after a loss is an emotional signal to halt trading, not to increase risk." },
            { id: "exp_08", name: "Risk-of-Ruin Calculation Matrix", x: 180, y: 1900, xp: 25, lore: "Risking >5% per trade makes mathematical ruin statistically inevitable over time." },
            { id: "exp_09", name: "Capital Preservation Vault", x: 1050, y: 1900, xp: 15, lore: "Your primary job as a trader is risk management; profit is simply the byproduct." },
            { id: "exp_10", name: "Emergency Stop Terminal", x: 2100, y: 1900, xp: 15, lore: "A stop-loss is not an admission of defeat; it is an active insurance contract." },
            { id: "exp_11", name: "Discipline Benchmark Post", x: 1250, y: 180, xp: 20, lore: "Consistency is not about never losing; it is about keeping losses strictly controlled." },
            { id: "exp_12", name: "Risk Lab South Portal", x: 1600, y: 2320, xp: 10, lore: "Southbound portal connecting Risk Lab back to the Strativo World Hub." }
        ],
        npcs: [
            { id: "mentor_vance", name: "Vance - Master Risk Director", role: "District Guide & Capital Preservation", x: 440, y: 480, themeColor: "#00F0FF", avatarIcon: "fa-graduation-cap", dialogue: "Welcome to Risk Lab. In this district, you will learn the one skill that separates surviving professionals from wiped-out amateurs: ruthless capital protection." },
            { id: "engineer_sloan", name: "Sloan - Position Sizing Engineer", role: "Lot Size & Exposure Specialist", x: 890, y: 480, themeColor: "#10B981", avatarIcon: "fa-calculator", dialogue: "Never guess your lot size. Calculate your exact dollar risk, measure your stop distance, and let mathematics dictate your exposure." },
            { id: "specialist_kora", name: "Kora - Invalidation Specialist", role: "Technical Stop Director", x: 2390, y: 480, themeColor: "#F59E0B", avatarIcon: "fa-shield-halved", dialogue: "A stop-loss belongs where your trading idea is disproven, not where your emotions feel comfortable. Always anchor stops to structure." },
            { id: "analyst_dax", name: "Dax - Expectancy Analyst", role: "R:R & Probability Strategist", x: 440, y: 1290, themeColor: "#8B5CF6", avatarIcon: "fa-scale-balanced", dialogue: "High win rates are meaningless without positive payoff asymmetry. Learn how a 40% win rate can generate consistent wealth." },
            { id: "controller_valen", name: "Valen - Margin Controller", role: "Leverage & Liquidation Marshal", x: 2390, y: 1290, themeColor: "#EC4899", avatarIcon: "fa-tower-observation", dialogue: "Leverage is a double-edged sword. Used properly, it gives capital efficiency; abused, it guarantees swift liquidation." },
            { id: "coach_selene", name: "Selene - Drawdown Coach", role: "Recovery & Survival Lead", x: 440, y: 1990, themeColor: "#3B82F6", avatarIcon: "fa-water", dialogue: "Lose 50% of your account, and you must make 100% just to get back to zero. Defend your equity with every single trade." },
            { id: "psychologist_orion", name: "Orion - Risk Psychologist", role: "Behavioral Discipline Lead", x: 2390, y: 1990, themeColor: "#10B981", avatarIcon: "fa-brain", dialogue: "When you lose, your brain screams to revenge trade. Master the emotional cooldown and stick to predefined rules." },
            { id: "commander_kane", name: "Kane - Survival Commander", role: "Vault & Arena Marshal", x: 1600, y: 320, themeColor: "#F43F5E", avatarIcon: "fa-vault", dialogue: "Step up to the Survival Vault! Manage an account through unpredictable market cycles. Your goal is not maximum profit—your goal is survival." }
        ],
        ambientNpcs: [
            { id: "amb_01", name: "Risk Officer Leo", x: 1450, y: 1100, role: "Risk Monitor", themeColor: "#10B981", waypoints: [{x: 1450, y: 1100}, {x: 1550, y: 1100}] },
            { id: "amb_02", name: "Trader Elena", x: 1750, y: 1100, role: "Junior Sizer", themeColor: "#00F0FF", waypoints: [{x: 1750, y: 1100}, {x: 1650, y: 1100}] },
            { id: "amb_03", name: "Simulator Tech Aaron", x: 2150, y: 400, role: "Margin Tech", themeColor: "#EC4899", waypoints: [{x: 2150, y: 400}, {x: 2250, y: 400}] },
            { id: "amb_04", name: "Analyst Tara", x: 350, y: 400, role: "Formula Tech", themeColor: "#8B5CF6", waypoints: [{x: 350, y: 400}, {x: 450, y: 400}] },
            { id: "amb_05", name: "Scout Lucas", x: 350, y: 1200, role: "Drawdown Scout", themeColor: "#3B82F6", waypoints: [{x: 350, y: 1200}, {x: 450, y: 1200}] },
            { id: "amb_06", name: "Inspector Maya", x: 2150, y: 1200, role: "Stop Inspector", themeColor: "#F59E0B", waypoints: [{x: 2150, y: 1200}, {x: 2250, y: 1200}] },
            { id: "amb_07", name: "Guide Felix", x: 350, y: 1900, role: "Equity Guide", themeColor: "#60A5FA", waypoints: [{x: 350, y: 1900}, {x: 450, y: 1900}] },
            { id: "amb_08", name: "Arena Contender Chloe", x: 2150, y: 1900, role: "Speed Trainee", themeColor: "#F43F5E", waypoints: [{x: 2150, y: 1900}, {x: 2250, y: 1900}] },
            { id: "amb_09", name: "Curator Marcus", x: 1550, y: 350, role: "Gallery Curator", themeColor: "#F43F5E", waypoints: [{x: 1550, y: 350}, {x: 1650, y: 350}] },
            { id: "amb_10", name: "Vault Guard Nina", x: 1650, y: 200, role: "Vault Guard", themeColor: "#10B981", waypoints: [{x: 1650, y: 200}, {x: 1550, y: 200}] }
        ],
        marketBoards: [
            { id: "mb_01", name: "Account Health Index", x: 1350, y: 920, w: 120, h: 50, title: "Account Health", metric: "Capital Status", value: "$10,000 [NORMAL]", status: "Safe" },
            { id: "mb_02", name: "Risk Per Trade Gauge", x: 1730, y: 920, w: 120, h: 50, title: "Max Risk Rule", metric: "Per Trade Limit", value: "1.00% ($100)", status: "Optimal" },
            { id: "mb_03", name: "Stop Invalidation Monitor", x: 2150, y: 800, w: 120, h: 50, title: "Stop Discipline", metric: "Invalidation Check", value: "100% Technical", status: "Active" },
            { id: "mb_04", name: "Expectancy Curve", x: 350, y: 800, w: 120, h: 50, title: "Edge Status", metric: "Math Expectancy", value: "+$65 / Trade", status: "Positive" },
            { id: "mb_05", name: "Leverage Pressure", x: 2150, y: 1500, w: 120, h: 50, title: "Margin Stress", metric: "Margin Level", value: "650% [HEALTHY]", status: "Safe" },
            { id: "mb_06", name: "Drawdown Asymmetry", x: 350, y: 1500, w: 120, h: 50, title: "Drawdown Math", metric: "-50% Recovery", value: "Requires +100%", status: "Warning" },
            { id: "mb_07", name: "Tilt & Revenge Monitor", x: 1100, y: 1580, w: 120, h: 50, title: "Emotional State", metric: "Discipline Index", value: "Calm / Rules First", status: "Protected" },
            { id: "mb_08", name: "Survival Vault Records", x: 1990, y: 1580, w: 120, h: 50, title: "Survival Trial", metric: "Max Drawdown Cap", value: "20.00% Limit", status: "Armed" }
        ],
        interiors: {
            risk_academy: {
                id: "risk_academy",
                name: "Risk Academy Research Hall",
                width: 1200,
                height: 800,
                spawn: { x: 600, y: 680, direction: "up" },
                exit: { x: 600, y: 750, w: 120, h: 40 },
                themeColor: "#00F0FF",
                stations: [
                    { id: "st_acad_foundations", name: "Risk Foundations Desk", x: 300, y: 350, w: 120, h: 60, label: "Learn Foundations [E]", action: "openAcademyModal", tab: "fund" },
                    { id: "st_acad_capital", name: "Capital Allocation Console", x: 600, y: 350, w: 120, h: 60, label: "Study Capital Rules [E]", action: "openAcademyModal", tab: "capital" },
                    { id: "st_acad_survival", name: "Survival Principles Deck", x: 900, y: 350, w: 120, h: 60, label: "Study Survival [E]", action: "openAcademyModal", tab: "survival" }
                ],
                npc: { id: "mentor_vance_in", name: "Vance", role: "Risk Academy Director", x: 600, y: 200, themeColor: "#00F0FF", avatarIcon: "fa-graduation-cap", dialogue: "Capital preservation is rule #1, #2, and #3. Without trading capital, your strategy has zero value." }
            },
            position_forge: {
                id: "position_forge",
                name: "Position Sizing Forge",
                width: 1200,
                height: 800,
                spawn: { x: 600, y: 680, direction: "up" },
                exit: { x: 600, y: 750, w: 120, h: 40 },
                themeColor: "#10B981",
                stations: [
                    { id: "st_forge_calc", name: "Precision Position Calculator", x: 400, y: 350, w: 140, h: 60, label: "Open Position Forge [E]", action: "openPositionForgeModal" },
                    { id: "st_forge_drills", name: "Lot Sizing Drills Console", x: 800, y: 350, w: 140, h: 60, label: "Start Sizing Drills [E]", action: "openPositionForgeModal" }
                ],
                npc: { id: "engineer_sloan_in", name: "Sloan", role: "Sizing Engineer", x: 600, y: 200, themeColor: "#10B981", avatarIcon: "fa-calculator", dialogue: "Every position must be mathematically customized to your stop distance. Never use fixed lot sizes across different setups." }
            },
            stoploss_workshop: {
                id: "stoploss_workshop",
                name: "Stop-Loss Calibration Workshop",
                width: 1200,
                height: 800,
                spawn: { x: 600, y: 680, direction: "up" },
                exit: { x: 600, y: 750, w: 120, h: 40 },
                themeColor: "#F59E0B",
                stations: [
                    { id: "st_sl_structure", name: "Structural Invalidation Bench", x: 400, y: 350, w: 140, h: 60, label: "Calibrate Stops [E]", action: "openStopLossModal" },
                    { id: "st_sl_volatility", name: "Volatility Buffer Terminal", x: 800, y: 350, w: 140, h: 60, label: "Test Volatility Stops [E]", action: "openStopLossModal" }
                ],
                npc: { id: "specialist_kora_in", name: "Kora", role: "Invalidation Specialist", x: 600, y: 200, themeColor: "#F59E0B", avatarIcon: "fa-shield-halved", dialogue: "Always ask: Where is this trade idea dead? Place your stop there plus a small buffer, never a single tick inside." }
            },
            rr_table: {
                id: "rr_table",
                name: "Risk/Reward Trading Table",
                width: 1200,
                height: 800,
                spawn: { x: 600, y: 680, direction: "up" },
                exit: { x: 600, y: 750, w: 120, h: 40 },
                themeColor: "#8B5CF6",
                stations: [
                    { id: "st_rr_evaluator", name: "Trade R:R Evaluation Table", x: 600, y: 350, w: 140, h: 60, label: "Evaluate Trade R:R [E]", action: "openRRTableModal" }
                ],
                npc: { id: "analyst_dax_in", name: "Dax", role: "Expectancy Analyst", x: 600, y: 200, themeColor: "#8B5CF6", avatarIcon: "fa-scale-balanced", dialogue: "Do not just hunt high R:R setups with unrealistic targets. Focus on high quality with achievable structural targets." }
            },
            expectancy_lab: {
                id: "expectancy_lab",
                name: "Expectancy Research Laboratory",
                width: 1200,
                height: 800,
                spawn: { x: 600, y: 680, direction: "up" },
                exit: { x: 600, y: 750, w: 120, h: 40 },
                themeColor: "#A855F7",
                stations: [
                    { id: "st_exp_simulator", name: "Mathematical Expectancy Console", x: 600, y: 350, w: 140, h: 60, label: "Open Expectancy Lab [E]", action: "openExpectancyModal" }
                ],
                npc: { id: "exp_guide_in", name: "Dr. Aris", role: "Expectancy Mathematician", x: 600, y: 200, themeColor: "#A855F7", avatarIcon: "fa-chart-pie", dialogue: "Expectancy = (Win% × Avg Win) - (Loss% × Avg Loss). As long as this number is positive over a 100-trade sample, you have an edge." }
            },
            leverage_tower: {
                id: "leverage_tower",
                name: "Leverage Control Tower",
                width: 1200,
                height: 800,
                spawn: { x: 600, y: 680, direction: "up" },
                exit: { x: 600, y: 750, w: 120, h: 40 },
                themeColor: "#EC4899",
                stations: [
                    { id: "st_lev_console", name: "Leverage Simulator Console", x: 600, y: 350, w: 140, h: 60, label: "Simulate Leverage [E]", action: "openLeverageModal" }
                ],
                npc: { id: "controller_valen_in", name: "Valen", role: "Margin Controller", x: 600, y: 200, themeColor: "#EC4899", avatarIcon: "fa-tower-observation", dialogue: "High leverage turns a tiny adverse market twitch into a total liquidation. Never let your position size outstrip your balance." }
            },
            margin_center: {
                id: "margin_center",
                name: "Margin Control Center",
                width: 1200,
                height: 800,
                spawn: { x: 600, y: 680, direction: "up" },
                exit: { x: 600, y: 750, w: 120, h: 40 },
                themeColor: "#F472B6",
                stations: [
                    { id: "st_margin_stress", name: "Margin Stress Terminal", x: 600, y: 350, w: 140, h: 60, label: "Test Margin Stress [E]", action: "openMarginModal" }
                ],
                npc: { id: "margin_tech_in", name: "Tech Chloe", role: "Margin Specialist", x: 600, y: 200, themeColor: "#F472B6", avatarIcon: "fa-gauge-high", dialogue: "Keep your margin level well above 500% to ensure market spikes never trigger forced stop-outs." }
            },
            drawdown_observatory: {
                id: "drawdown_observatory",
                name: "Drawdown Observation Deck",
                width: 1200,
                height: 800,
                spawn: { x: 600, y: 680, direction: "up" },
                exit: { x: 600, y: 750, w: 120, h: 40 },
                themeColor: "#3B82F6",
                stations: [
                    { id: "st_dd_curve", name: "Equity Curve Simulator", x: 600, y: 350, w: 140, h: 60, label: "Simulate Drawdown [E]", action: "openDrawdownModal" }
                ],
                npc: { id: "coach_selene_in", name: "Selene", role: "Drawdown Coach", x: 600, y: 200, themeColor: "#3B82F6", avatarIcon: "fa-water", dialogue: "Watch what happens during a 7-trade losing streak when risking 1% versus 5%. 1% is a minor scratch; 5% is a near-fatal wound." }
            },
            recovery_lab: {
                id: "recovery_lab",
                name: "Asymmetric Recovery Laboratory",
                width: 1200,
                height: 800,
                spawn: { x: 600, y: 680, direction: "up" },
                exit: { x: 600, y: 750, w: 120, h: 40 },
                themeColor: "#60A5FA",
                stations: [
                    { id: "st_rec_calc", name: "Recovery Math Challenge Terminal", x: 600, y: 350, w: 140, h: 60, label: "Calculate Recovery [E]", action: "openRecoveryModal" }
                ],
                npc: { id: "rec_specialist_in", name: "Felix", role: "Recovery Specialist", x: 600, y: 200, themeColor: "#60A5FA", avatarIcon: "fa-arrow-trend-up", dialogue: "The deeper the drawdown, the higher the recovery hill. Never let yourself fall into the 30%+ danger zone." }
            },
            mistake_gallery: {
                id: "mistake_gallery",
                name: "Risk Mistake Gallery",
                width: 1200,
                height: 800,
                spawn: { x: 600, y: 680, direction: "up" },
                exit: { x: 600, y: 750, w: 120, h: 40 },
                themeColor: "#F43F5E",
                stations: [
                    { id: "st_mistake_archive", name: "Interactive Mistake Exhibits", x: 600, y: 350, w: 140, h: 60, label: "Examine Mistakes [E]", action: "openMistakeGalleryModal" }
                ],
                npc: { id: "curator_marcus_in", name: "Marcus", role: "Museum Curator", x: 600, y: 200, themeColor: "#F43F5E", avatarIcon: "fa-triangle-exclamation", dialogue: "Study the fatal mistakes of those who came before you: moving stops, overleveraging, revenge trading, and adding to losers." }
            },
            decision_lab: {
                id: "decision_lab",
                name: "Risk Decision Psychology Lab",
                width: 1200,
                height: 800,
                spawn: { x: 600, y: 680, direction: "up" },
                exit: { x: 600, y: 750, w: 120, h: 40 },
                themeColor: "#10B981",
                stations: [
                    { id: "st_psych_decision", name: "Psychological Pressure Terminal", x: 600, y: 350, w: 140, h: 60, label: "Test Psychology [E]", action: "openPsychologyModal" }
                ],
                npc: { id: "psychologist_orion_in", name: "Orion", role: "Risk Psychologist", x: 600, y: 200, themeColor: "#10B981", avatarIcon: "fa-brain", dialogue: "When emotions flare, rules must take over. Discipline is the ability to execute your plan regardless of emotional discomfort." }
            },
            scenario_theater: {
                id: "scenario_theater",
                name: "Risk Scenario Theater",
                width: 1200,
                height: 800,
                spawn: { x: 600, y: 680, direction: "up" },
                exit: { x: 600, y: 750, w: 120, h: 40 },
                themeColor: "#F59E0B",
                stations: [
                    { id: "st_theater_screen", name: "Cinematic Scenario Screen", x: 600, y: 350, w: 140, h: 60, label: "Play Scenario [E]", action: "openTheaterModal" }
                ],
                npc: { id: "theater_curator_in", name: "Curator Lucas", role: "Scenario Narrator", x: 600, y: 200, themeColor: "#F59E0B", avatarIcon: "fa-masks-theater", dialogue: "Step inside realistic trading scenarios. Make risk decisions and watch how account balance and survival evolve." }
            },
            risk_arena: {
                id: "risk_arena",
                name: "Risk Arena Combat Pavilion",
                width: 1200,
                height: 800,
                spawn: { x: 600, y: 680, direction: "up" },
                exit: { x: 600, y: 750, w: 120, h: 40 },
                themeColor: "#F43F5E",
                stations: [
                    { id: "st_arena_terminal", name: "Risk Arena Terminal", x: 600, y: 350, w: 140, h: 60, label: "Launch 10-Round Arena [E]", action: "launchRiskArena" }
                ],
                npc: { id: "kane_arena_in", name: "Kane", role: "Arena Marshal", x: 600, y: 200, themeColor: "#F43F5E", avatarIcon: "fa-bolt-lightning", dialogue: "10 rapid rounds testing position sizing, stop placement, R:R calculation, and emotional control under timer pressure!" }
            },
            mission_hq: {
                id: "mission_hq",
                name: "District 5 Operations Directorate",
                width: 1200,
                height: 800,
                spawn: { x: 600, y: 680, direction: "up" },
                exit: { x: 600, y: 750, w: 120, h: 40 },
                themeColor: "#10B981",
                stations: [
                    { id: "st_hq_journal", name: "District Tactical Risk Journal", x: 450, y: 350, w: 120, h: 60, label: "Open Missions [E]", action: "openMissionsJournal" },
                    { id: "st_hq_briefing", name: "Strategic Sector Briefing", x: 750, y: 350, w: 120, h: 60, label: "View Briefing [E]", action: "openTacticalBriefingModal" }
                ],
                npc: { id: "director_in", name: "Director Vance", role: "Operations Lead", x: 600, y: 200, themeColor: "#10B981", avatarIcon: "fa-compass", dialogue: "Complete all 8 sector missions to earn your Master Risk Certification and unlock access to the Apex Survival Vault." }
            },
            survival_vault: {
                id: "survival_vault",
                name: "Apex Survival Vault",
                width: 1200,
                height: 800,
                spawn: { x: 600, y: 680, direction: "up" },
                exit: { x: 600, y: 750, w: 120, h: 40 },
                themeColor: "#F43F5E",
                stations: [
                    { id: "st_vault_console", name: "Survival Simulation Console", x: 600, y: 350, w: 140, h: 60, label: "Enter Survival Trial [E]", action: "openSurvivalVaultModal" }
                ],
                npc: { id: "kane_vault_in", name: "Kane", role: "Vault Commander", x: 600, y: 200, themeColor: "#F43F5E", avatarIcon: "fa-vault", dialogue: "This is the final test of District 5. Can you manage an account through a sequence of uncertain trades without breaching the 20% drawdown limit?" }
            }
        }
    };

    class RiskLabWorld {
        constructor(config = {}) {
            this.mapConfig = MAP_CONFIG;
            this.width = MAP_CONFIG.bounds.width;
            this.height = MAP_CONFIG.bounds.height;
            this.mapWidth = MAP_CONFIG.bounds.width;
            this.mapHeight = MAP_CONFIG.bounds.height;
            this.bounds = { x: 0, y: 0, width: this.width, height: this.height };
            this.spawn = MAP_CONFIG.spawn;
            this.quarters = MAP_CONFIG.quarters;
            this.buildings = MAP_CONFIG.buildings;
            this.landmarks = MAP_CONFIG.landmarks;
            this.explorationPoints = MAP_CONFIG.explorationPoints;
            this.marketBoards = MAP_CONFIG.marketBoards;
            this.npcs = MAP_CONFIG.npcs;
            this.interiors = Object.values(MAP_CONFIG.interiors);
            this.currentInterior = null;
            this.returnCoords = { x: 1600, y: 1350 };
            this.activePrompt = null;
            this.exploredPoints = new Set();
            this.colliders = [];
            this.interactiveObjects = [];

            this.initColliders();
            this.loadExploredState();
        }

        getNearestInteractable(px, py, maxDist = 80) {
            let best = null;
            let bestDist = Infinity;
            this.interactiveObjects.forEach(obj => {
                let ox = obj.x;
                let oy = obj.y;
                if (obj.id && obj.id.startsWith("amb_")) {
                    const liveAmb = MAP_CONFIG.ambientNpcs.find(a => a.id === obj.id);
                    if (liveAmb) {
                        ox = liveAmb.x;
                        oy = liveAmb.y;
                    }
                }
                const dist = Math.hypot(px - ox, py - oy);
                const maxRadius = obj.radius || maxDist;
                if (dist <= maxRadius) {
                    let effectiveDist = dist;
                    if (obj.category === "NPC_TALK") effectiveDist *= 0.7;
                    if (effectiveDist < bestDist) {
                        bestDist = effectiveDist;
                        best = obj;
                    }
                }
            });
            return best;
        }

        renderMinimap() {
            const miniCanvas = document.getElementById("rl-minimap-canvas");
            if (!miniCanvas) return;
            const mctx = miniCanvas.getContext("2d");
            mctx.fillStyle = "#030712";
            mctx.fillRect(0, 0, miniCanvas.width, miniCanvas.height);

            const scaleX = miniCanvas.width / this.width;
            const scaleY = miniCanvas.height / this.height;

            (this.mapConfig.quarters || []).forEach(q => {
                mctx.fillStyle = q.color + "45";
                mctx.fillRect(q.bounds.x * scaleX, q.bounds.y * scaleY, q.bounds.w * scaleX, q.bounds.h * scaleY);
                mctx.strokeStyle = q.color + "90";
                mctx.lineWidth = 1;
                mctx.strokeRect(q.bounds.x * scaleX, q.bounds.y * scaleY, q.bounds.w * scaleX, q.bounds.h * scaleY);
            });

            (this.mapConfig.buildings || []).forEach(b => {
                mctx.fillStyle = b.themeColor || "#10B981";
                mctx.fillRect(b.x * scaleX, b.y * scaleY, b.w * scaleX, b.h * scaleY);
            });

            const player = window.StrativoRPG.gameCore ? window.StrativoRPG.gameCore.player : null;
            if (player) {
                mctx.fillStyle = "#00F0FF";
                mctx.beginPath();
                mctx.arc(player.x * scaleX, player.y * scaleY, 4, 0, Math.PI * 2);
                mctx.fill();
            }
        }

        initColliders() {
            this.colliders = [];
            this.interactiveObjects = [];

            if (this.currentInterior) {
                const int = MAP_CONFIG.interiors[this.currentInterior];
                if (!int) return;

                // Boundary walls
                this.colliders.push(new Rectangle(0, 0, int.width, 30, "wall_top"));
                this.colliders.push(new Rectangle(0, int.height - 30, int.width, 30, "wall_bottom"));
                this.colliders.push(new Rectangle(0, 0, 30, int.height, "wall_left"));
                this.colliders.push(new Rectangle(int.width - 30, 0, 30, int.height, "wall_right"));

                // Exit door trigger
                if (int.exit) {
                    this.interactiveObjects.push({
                        id: "int_exit",
                        name: "Exit to City",
                        x: int.exit.x,
                        y: int.exit.y,
                        w: int.exit.w,
                        h: int.exit.h,
                        radius: 60,
                        action: () => this.exitInterior(),
                        prompt: "Press [E] to Exit"
                    });
                }

                // Interactive Stations
                (int.stations || []).forEach(st => {
                    this.colliders.push(new Rectangle(st.x, st.y, st.w, st.h, "st_col_" + st.id));
                    this.interactiveObjects.push({
                        id: st.id,
                        name: st.name,
                        x: st.x + st.w / 2,
                        y: st.y + st.h / 2,
                        radius: 70,
                        action: () => {
                            if (window.StrativoRPG[st.action]) {
                                window.StrativoRPG[st.action](st.tab);
                            }
                        },
                        prompt: st.label || "Interact [E]"
                    });
                });

                // Interior NPC
                if (int.npc) {
                    this.colliders.push(new Rectangle(int.npc.x - 20, int.npc.y - 20, 40, 40, "npc_col_" + int.npc.id));
                    this.interactiveObjects.push({
                        id: int.npc.id,
                        name: int.npc.name,
                        category: "NPC_TALK",
                        x: int.npc.x,
                        y: int.npc.y,
                        radius: 75,
                        action: () => {
                            if (window.StrativoRPG.DialogueManager) {
                                window.StrativoRPG.DialogueManager.startDialogue({
                                    speaker: int.npc.name,
                                    role: int.npc.role || "Risk Lab Instructor",
                                    avatarIcon: int.npc.avatarIcon || "fa-user",
                                    themeColor: int.npc.themeColor || int.themeColor || "#10B981",
                                    text: int.npc.dialogue
                                });
                            }
                        },
                        prompt: `Talk to ${int.npc.name} [E]`
                    });
                }
                return;
            }

            // Outside World Colliders
            // 1. World Perimeter Walls
            this.colliders.push(new Rectangle(0, 0, this.width, 40, "world_top"));
            this.colliders.push(new Rectangle(0, this.height - 40, this.width, 40, "world_bottom"));
            this.colliders.push(new Rectangle(0, 0, 40, this.height, "world_left"));
            this.colliders.push(new Rectangle(this.width - 40, 0, 40, this.height, "world_right"));

            // 2. Buildings & Entrances
            MAP_CONFIG.buildings.forEach(b => {
                this.colliders.push(new Rectangle(b.x, b.y, b.w, b.h, "bld_" + b.id));
                if (b.entrance) {
                    this.interactiveObjects.push({
                        id: "enter_" + b.id,
                        name: b.name,
                        category: "BUILDING_ENTRANCE",
                        x: b.entrance.x,
                        y: b.entrance.y,
                        radius: 70,
                        action: () => this.enterInterior(b.interiorId, { x: b.entrance.x, y: b.entrance.y + 35 }),
                        prompt: b.promptText || `Enter ${b.name} [E]`
                    });
                }
            });

            // 3. Landmarks
            MAP_CONFIG.landmarks.forEach(lm => {
                this.colliders.push(new Rectangle(lm.x - lm.w / 2, lm.y - lm.h / 2, lm.w, lm.h, "lm_" + lm.id));

                let promptText = `Inspect ${lm.name} [E]`;
                let options = null;

                if (lm.id === "lm_survival_vault") {
                    promptText = "Enter Survival Vault [E]";
                    options = [
                        {
                            label: "Enter Survival Trial",
                            primary: true,
                            icon: "fa-vault",
                            action: () => {
                                if (window.StrativoRPG.DialogueManager) window.StrativoRPG.DialogueManager.closeDialogue();
                                if (typeof window.StrativoRPG.openSurvivalVaultModal === "function") {
                                    window.StrativoRPG.openSurvivalVaultModal();
                                }
                            }
                        },
                        {
                            label: "Close Interface",
                            secondary: true,
                            action: () => {
                                if (window.StrativoRPG.DialogueManager) window.StrativoRPG.DialogueManager.closeDialogue();
                            }
                        }
                    ];
                }

                this.interactiveObjects.push({
                    id: lm.id,
                    name: lm.name,
                    category: "LANDMARK",
                    x: lm.x,
                    y: lm.y,
                    radius: 85,
                    action: () => {
                        if (window.StrativoRPG.DialogueManager) {
                            window.StrativoRPG.DialogueManager.startDialogue({
                                speaker: lm.name,
                                role: "District Landmark",
                                avatarIcon: lm.icon || "fa-shield-halved",
                                themeColor: lm.color || "#10B981",
                                text: lm.lore,
                                options
                            });
                        }
                    },
                    prompt: promptText
                });
            });

            // 4. Primary AI/NPCs
            MAP_CONFIG.npcs.forEach(npc => {
                this.colliders.push(new Rectangle(npc.x - 20, npc.y - 20, 40, 40, "npc_col_" + npc.id));
                this.interactiveObjects.push({
                    id: npc.id,
                    name: npc.name,
                    category: "NPC_TALK",
                    x: npc.x,
                    y: npc.y,
                    radius: 75,
                    action: () => {
                        if (window.StrativoRPG.DialogueManager) {
                            window.StrativoRPG.DialogueManager.startDialogue({
                                speaker: npc.name,
                                role: npc.role,
                                avatarIcon: npc.avatarIcon || "fa-user-tie",
                                themeColor: npc.themeColor || "#10B981",
                                text: npc.dialogue
                            });
                        }
                    },
                    prompt: `Talk to ${npc.name} [E]`
                });
            });

            // 5. Exploration Points
            MAP_CONFIG.explorationPoints.forEach(exp => {
                this.interactiveObjects.push({
                    id: exp.id,
                    name: exp.name,
                    category: "EXPLORATION",
                    x: exp.x,
                    y: exp.y,
                    radius: 65,
                    action: () => this.claimExploration(exp),
                    prompt: `Inspect ${exp.name} [E]`
                });
            });

            // 6. Market/Risk Data Boards
            MAP_CONFIG.marketBoards.forEach(mb => {
                this.colliders.push(new Rectangle(mb.x - mb.w / 2, mb.y - mb.h / 2, mb.w, mb.h, "mb_col_" + mb.id));
                this.interactiveObjects.push({
                    id: mb.id,
                    name: mb.name,
                    category: "MARKET_BOARD",
                    x: mb.x,
                    y: mb.y,
                    radius: 65,
                    action: () => {
                        if (window.StrativoRPG.DialogueManager) {
                            window.StrativoRPG.DialogueManager.startDialogue({
                                speaker: mb.title,
                                role: "Live Risk Telemetry",
                                avatarIcon: "fa-gauge-high",
                                themeColor: "#00F0FF",
                                text: `<strong>${mb.metric}:</strong> ${mb.value}<br>Status: <span style="color:#10B981;">${mb.status}</span>`
                            });
                        }
                    },
                    prompt: `Read ${mb.name} [E]`
                });
            });

            // 7. Ambient NPCs
            MAP_CONFIG.ambientNpcs.forEach(amb => {
                this.interactiveObjects.push({
                    id: amb.id,
                    name: amb.name,
                    category: "NPC_TALK",
                    x: amb.x,
                    y: amb.y,
                    radius: 65,
                    action: () => {
                        if (window.StrativoRPG.DialogueManager) {
                            window.StrativoRPG.DialogueManager.startDialogue({
                                speaker: amb.name,
                                role: amb.role,
                                avatarIcon: "fa-user",
                                themeColor: amb.themeColor || "#00F0FF",
                                text: `Stay alert! Capital preservation is your shield in Risk Lab.`
                            });
                        }
                    },
                    prompt: `Talk to ${amb.name} [E]`
                });
            });
        }

        enterInterior(interiorId, returnCoords = null) {
            if (!MAP_CONFIG.interiors[interiorId]) return;
            if (returnCoords) this.returnCoords = returnCoords;

            this.currentInterior = interiorId;
            const int = MAP_CONFIG.interiors[interiorId];
            this.width = int.width;
            this.height = int.height;
            this.bounds = { x: 0, y: 0, width: int.width, height: int.height };

            this.initColliders();

            const player = window.StrativoRPG.gameCore ? window.StrativoRPG.gameCore.player : null;
            const camera = window.StrativoRPG.gameCore ? window.StrativoRPG.gameCore.camera : null;
            if (player && int.spawn) {
                player.x = int.spawn.x;
                player.y = int.spawn.y;
                player.vx = 0;
                player.vy = 0;
            }
            if (camera) {
                camera.setWorldBounds(this.bounds);
                camera.clamp();
            }

            window.StrativoRPG.emitGameEvent("enterBuilding", { interiorId });
        }

        exitInterior() {
            this.currentInterior = null;
            this.width = MAP_CONFIG.bounds.width;
            this.height = MAP_CONFIG.bounds.height;
            this.bounds = { x: 0, y: 0, width: this.width, height: this.height };

            this.initColliders();

            const player = window.StrativoRPG.gameCore ? window.StrativoRPG.gameCore.player : null;
            const camera = window.StrativoRPG.gameCore ? window.StrativoRPG.gameCore.camera : null;
            if (player && this.returnCoords) {
                player.x = this.returnCoords.x;
                player.y = this.returnCoords.y;
                player.vx = 0;
                player.vy = 0;
            }
            if (camera) {
                camera.setWorldBounds(this.bounds);
                camera.clamp();
            }

            window.StrativoRPG.emitGameEvent("exitBuilding");
        }

        loadExploredState() {
            try {
                const saved = localStorage.getItem("strativo_risklab_explored");
                if (saved) {
                    this.exploredPoints = new Set(JSON.parse(saved));
                }
            } catch {}
            this.updateExploredUI();
        }

        saveExploredState() {
            try {
                localStorage.setItem("strativo_risklab_explored", JSON.stringify(Array.from(this.exploredPoints)));
            } catch {}
            this.updateExploredUI();
        }

        updateExploredUI() {
            const countEl = document.getElementById("minimap-explored-count");
            if (countEl) {
                countEl.textContent = `${this.exploredPoints.size} / ${MAP_CONFIG.explorationPoints.length}`;
            }
        }

        claimExploration(exp) {
            const isNew = !this.exploredPoints.has(exp.id);
            if (isNew) {
                this.exploredPoints.add(exp.id);
                this.saveExploredState();
                if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.addWorldXP === "function") {
                    window.StrativoWorldXPEngine.addWorldXP(exp.xp || 15, `Discovered: ${exp.name}`, "rl_exp_" + exp.id);
                }
                window.StrativoRPG.emitGameEvent("explorationFound");
            }

            const modal = document.getElementById("rl-discovery-modal");
            if (modal) {
                const hEl = document.getElementById("rl-discovery-heading");
                const lEl = document.getElementById("rl-discovery-lore");
                const xEl = document.getElementById("rl-discovery-xp");
                if (hEl) hEl.textContent = exp.name;
                if (lEl) lEl.textContent = exp.lore;
                if (xEl) xEl.textContent = isNew ? `+${exp.xp || 15} World XP (Logged!)` : `Explored (+${exp.xp || 15} XP Claimed)`;
                modal.classList.add("active");
            }
        }

        update(dt) {
            // Update ambient NPCs with simple waypoint patrol
            if (!this.currentInterior) {
                MAP_CONFIG.ambientNpcs.forEach(a => {
                    if (a.waypoints && a.waypoints.length > 1) {
                        const target = a.waypoints[1];
                        const origin = a.waypoints[0];
                        a._t = (a._t || 0) + dt * 0.4;
                        const pingPong = (Math.sin(a._t) + 1) / 2;
                        a.x = origin.x + (target.x - origin.x) * pingPong;
                        a.y = origin.y + (target.y - origin.y) * pingPong;
                    }
                });
            }

            // Proximity target selection with deterministic prioritization
            const player = window.StrativoRPG.gameCore ? window.StrativoRPG.gameCore.player : null;
            if (!player) return;

            let closest = null;
            let closestDist = Infinity;

            this.interactiveObjects.forEach(obj => {
                let ox = obj.x;
                let oy = obj.y;
                if (obj.id && obj.id.startsWith("amb_")) {
                    const liveAmb = MAP_CONFIG.ambientNpcs.find(a => a.id === obj.id);
                    if (liveAmb) {
                        ox = liveAmb.x;
                        oy = liveAmb.y;
                    }
                }

                const dist = Math.hypot(player.x - ox, player.y - oy);
                const maxRadius = obj.radius || 65;
                if (dist <= maxRadius) {
                    let effectiveDist = dist;
                    if (obj.category === "NPC_TALK") effectiveDist *= 0.9;
                    if (effectiveDist < closestDist) {
                        closestDist = effectiveDist;
                        closest = obj;
                    }
                }
            });

            this.activePrompt = closest;
            this.updatePromptUI(closest);
        }

        updatePromptUI(closest) {
            const banner = document.getElementById("rl-prompt-banner");
            const textEl = document.getElementById("rl-prompt-text");
            if (!banner || !textEl) return;

            if (closest) {
                textEl.textContent = closest.prompt || "Interact [E]";
                banner.classList.remove("hidden");
            } else {
                banner.classList.add("hidden");
            }
        }

        interact() {
            if (this.activePrompt && typeof this.activePrompt.action === "function") {
                try {
                    this.activePrompt.action();
                    return true;
                } catch (err) {
                    console.error("Strativo RPG: Exception in interaction handler for", this.activePrompt.name || this.activePrompt.id, err);
                    return false;
                }
            }
            return false;
        }

        render(ctx, camera) {
            if (this.currentInterior) {
                this.renderInterior(ctx, camera);
            } else {
                this.renderCity(ctx, camera);
            }
        }

        renderCity(ctx, camera) {
            const vx = camera.x;
            const vy = camera.y;
            const vw = camera.viewportWidth;
            const vh = camera.viewportHeight;

            // 1. Dark Cybernetic Background
            ctx.fillStyle = MAP_CONFIG.theme.darkBg;
            ctx.fillRect(vx, vy, vw, vh);

            // 2. Cyber Grid
            ctx.strokeStyle = "rgba(16, 185, 129, 0.05)";
            ctx.lineWidth = 1;
            const gridSize = 80;
            const startX = Math.floor(vx / gridSize) * gridSize;
            const startY = Math.floor(vy / gridSize) * gridSize;

            for (let x = startX; x < vx + vw; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, vy);
                ctx.lineTo(x, vy + vh);
                ctx.stroke();
            }
            for (let y = startY; y < vy + vh; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(vx, y);
                ctx.lineTo(vx + vw, y);
                ctx.stroke();
            }

            // 3. Quarters Ground Tint
            MAP_CONFIG.quarters.forEach(q => {
                ctx.fillStyle = q.color + "08";
                ctx.fillRect(q.bounds.x, q.bounds.y, q.bounds.w, q.bounds.h);
                ctx.strokeStyle = q.color + "25";
                ctx.lineWidth = 2;
                ctx.strokeRect(q.bounds.x, q.bounds.y, q.bounds.w, q.bounds.h);

                // Quarter Title watermark
                ctx.fillStyle = q.color + "30";
                ctx.font = "bold 26px Inter, sans-serif";
                ctx.fillText(q.name, q.bounds.x + 30, q.bounds.y + 50);
            });

            // 4. Roads & Sidewalks
            MAP_CONFIG.roads.forEach(r => {
                // Sidewalk
                ctx.fillStyle = MAP_CONFIG.theme.sidewalkBg;
                ctx.fillRect(r.x - 10, r.y - 10, r.w + 20, r.h + 20);

                // Road asphalt
                ctx.fillStyle = MAP_CONFIG.theme.roadBg;
                ctx.fillRect(r.x, r.y, r.w, r.h);

                // Center neon dash
                ctx.strokeStyle = "rgba(16, 185, 129, 0.35)";
                ctx.lineWidth = 2;
                ctx.setLineDash([16, 16]);
                ctx.beginPath();
                if (r.orientation === "vertical") {
                    ctx.moveTo(r.x + r.w / 2, r.y);
                    ctx.lineTo(r.x + r.w / 2, r.y + r.h);
                } else {
                    ctx.moveTo(r.x, r.y + r.h / 2);
                    ctx.lineTo(r.x + r.w, r.y + r.h / 2);
                }
                ctx.stroke();
                ctx.setLineDash([]);
            });

            // 5. Buildings
            MAP_CONFIG.buildings.forEach(b => {
                // Outer glow shadow
                ctx.fillStyle = "rgba(0,0,0,0.6)";
                ctx.fillRect(b.x + 10, b.y + 10, b.w, b.h);

                // Main structure
                ctx.fillStyle = MAP_CONFIG.theme.buildingWall;
                ctx.fillRect(b.x, b.y, b.w, b.h);

                // Roof tier
                ctx.fillStyle = MAP_CONFIG.theme.buildingRoof;
                ctx.fillRect(b.x + 15, b.y + 15, b.w - 30, b.h - 30);

                // Neon Trim
                ctx.strokeStyle = b.themeColor || "#10B981";
                ctx.lineWidth = 3;
                ctx.strokeRect(b.x, b.y, b.w, b.h);

                // Building Name Banner
                ctx.fillStyle = b.themeColor || "#10B981";
                ctx.font = "bold 16px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(b.name, b.x + b.w / 2, b.y + 40);

                ctx.fillStyle = "#94A3B8";
                ctx.font = "11px Inter, sans-serif";
                ctx.fillText(b.subtitle || "", b.x + b.w / 2, b.y + 60);

                // Entrance Door
                if (b.entrance) {
                    ctx.fillStyle = b.themeColor + "50";
                    ctx.fillRect(b.entrance.x - 30, b.entrance.y - 15, 60, 20);
                    ctx.strokeStyle = b.themeColor;
                    ctx.lineWidth = 2;
                    ctx.strokeRect(b.entrance.x - 30, b.entrance.y - 15, 60, 20);
                    ctx.fillStyle = "#FFF";
                    ctx.font = "bold 10px Inter, sans-serif";
                    ctx.fillText("ENTER [E]", b.entrance.x, b.entrance.y - 2);
                }
                ctx.textAlign = "left";
            });

            // 6. Landmarks
            MAP_CONFIG.landmarks.forEach(lm => {
                ctx.fillStyle = (lm.color || "#10B981") + "20";
                ctx.beginPath();
                ctx.arc(lm.x, lm.y, lm.w / 2 + 10, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = "#07132B";
                ctx.beginPath();
                ctx.arc(lm.x, lm.y, lm.w / 2, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = lm.color || "#10B981";
                ctx.lineWidth = 3;
                ctx.stroke();

                ctx.fillStyle = lm.color || "#10B981";
                ctx.font = "bold 13px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(lm.name, lm.x, lm.y + lm.w / 2 + 20);
                ctx.textAlign = "left";
            });

            // 7. Exploration Points
            MAP_CONFIG.explorationPoints.forEach(exp => {
                const isClaimed = this.exploredPoints.has(exp.id);
                ctx.fillStyle = isClaimed ? "rgba(16, 185, 129, 0.4)" : "rgba(245, 158, 11, 0.7)";
                ctx.beginPath();
                ctx.arc(exp.x, exp.y, 8, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = isClaimed ? "#10B981" : "#FCD34D";
                ctx.lineWidth = 2;
                ctx.stroke();
            });

            // 8. Market Boards
            MAP_CONFIG.marketBoards.forEach(mb => {
                ctx.fillStyle = "#0A1733";
                ctx.fillRect(mb.x - mb.w / 2, mb.y - mb.h / 2, mb.w, mb.h);
                ctx.strokeStyle = "#00F0FF";
                ctx.lineWidth = 2;
                ctx.strokeRect(mb.x - mb.w / 2, mb.y - mb.h / 2, mb.w, mb.h);

                ctx.fillStyle = "#00F0FF";
                ctx.font = "bold 10px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(mb.title, mb.x, mb.y - 8);
                ctx.fillStyle = "#FFF";
                ctx.font = "bold 9px monospace";
                ctx.fillText(mb.value, mb.x, mb.y + 12);
                ctx.textAlign = "left";
            });

            // 9. NPCs & Ambient NPCs
            MAP_CONFIG.npcs.forEach(npc => {
                this.renderNPC(ctx, npc.x, npc.y, npc.name, npc.themeColor || "#00F0FF");
            });

            MAP_CONFIG.ambientNpcs.forEach(amb => {
                this.renderNPC(ctx, amb.x, amb.y, amb.name, amb.themeColor || "#10B981", true);
            });
        }

        renderInterior(ctx, camera) {
            const int = MAP_CONFIG.interiors[this.currentInterior];
            if (!int) return;

            // Room Floor
            ctx.fillStyle = "#030712";
            ctx.fillRect(0, 0, int.width, int.height);

            // Grid Pattern
            ctx.strokeStyle = (int.themeColor || "#10B981") + "15";
            ctx.lineWidth = 1;
            for (let x = 0; x < int.width; x += 50) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, int.height);
                ctx.stroke();
            }
            for (let y = 0; y < int.height; y += 50) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(int.width, y);
                ctx.stroke();
            }

            // Walls
            ctx.strokeStyle = int.themeColor || "#10B981";
            ctx.lineWidth = 4;
            ctx.strokeRect(20, 20, int.width - 40, int.height - 40);

            // Title Banner
            ctx.fillStyle = int.themeColor || "#10B981";
            ctx.font = "bold 24px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(int.name, int.width / 2, 70);

            // Stations
            (int.stations || []).forEach(st => {
                ctx.fillStyle = "#0F1E3D";
                ctx.fillRect(st.x, st.y, st.w, st.h);
                ctx.strokeStyle = int.themeColor || "#10B981";
                ctx.lineWidth = 2;
                ctx.strokeRect(st.x, st.y, st.w, st.h);

                ctx.fillStyle = "#FFF";
                ctx.font = "bold 12px Inter, sans-serif";
                ctx.fillText(st.name, st.x + st.w / 2, st.y + st.h / 2 + 4);
            });

            // Interior NPC
            if (int.npc) {
                this.renderNPC(ctx, int.npc.x, int.npc.y, int.npc.name, int.npc.themeColor || int.themeColor);
            }

            // Exit Portal
            if (int.exit) {
                ctx.fillStyle = "rgba(244, 63, 94, 0.3)";
                ctx.fillRect(int.exit.x - int.exit.w / 2, int.exit.y - int.exit.h / 2, int.exit.w, int.exit.h);
                ctx.strokeStyle = "#F43F5E";
                ctx.lineWidth = 2;
                ctx.strokeRect(int.exit.x - int.exit.w / 2, int.exit.y - int.exit.h / 2, int.exit.w, int.exit.h);

                ctx.fillStyle = "#FFF";
                ctx.font = "bold 12px Inter, sans-serif";
                ctx.fillText("EXIT DOOR [E]", int.exit.x, int.exit.y + 4);
            }
            ctx.textAlign = "left";
        }

        renderNPC(ctx, x, y, name, color = "#00F0FF", isAmbient = false) {
            ctx.save();
            // Shadow
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.beginPath();
            ctx.ellipse(x, y + 16, 12, 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Body Capsule
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y - 6, 10, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#1E293B";
            ctx.fillRect(x - 8, y - 4, 16, 18);

            // Name Tag
            ctx.fillStyle = "#FFF";
            ctx.font = isAmbient ? "9px Inter, sans-serif" : "bold 11px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(name, x, y - 20);
            ctx.restore();
        }
    }

    function validateRiskLabWorld() {
        return {
            mapConfigValid: !!MAP_CONFIG && MAP_CONFIG.bounds.width === 3200,
            interiorsCount: Object.keys(MAP_CONFIG.interiors).length,
            landmarksCount: MAP_CONFIG.landmarks.length,
            npcsCount: MAP_CONFIG.npcs.length,
            ambientCount: MAP_CONFIG.ambientNpcs.length,
            explorationCount: MAP_CONFIG.explorationPoints.length,
            quartersCount: MAP_CONFIG.quarters.length
        };
    }

    window.StrativoRPG.RiskLabWorld = RiskLabWorld;
    window.StrativoRPG.validateRiskLabWorld = validateRiskLabWorld;
    window.RiskLabWorld = RiskLabWorld;
    window.validateRiskLabWorld = validateRiskLabWorld;

    if (typeof module !== "undefined" && module.exports) {
        module.exports = { RiskLabWorld, validateRiskLabWorld };
    }
})();
