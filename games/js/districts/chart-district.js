/* ==========================================================================
   STRATIVO WORLD — DISTRICT 4: CHART DISTRICT WORLD ENGINE
   Version: 1.0.0 (Phase 4.0 Complete Chart Reading World V1)
   Namespace: StrativoRPG.ChartDistrictWorld
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

    // Master Map Configuration ($3200 x 2400)
    const MAP_CONFIG = {
        version: "1.0.0",
        districtId: "chart-district",
        districtName: "Chart District",
        districtSubtitle: "Metropolis of Complete Chart Reading, Structure, Multi-Timeframe & Replay",
        bounds: { width: 3200, height: 2400 },
        spawn: { x: 1600, y: 1350, direction: "up" },
        theme: {
            primary: "#3B82F6",
            secondary: "#8B5CF6",
            accent: "#00F0FF",
            gold: "#FCD34D",
            emerald: "#10B981",
            rose: "#F43F5E",
            darkBg: "#020617",
            roadBg: "#0A1128",
            sidewalkBg: "#0F1E3D",
            buildingWall: "#0B1936",
            buildingRoof: "#071229"
        },
        quarters: [
            { id: "chart_plaza", name: "CHART PLAZA", description: "Central civic plaza and heart of Chart District", bounds: { x: 1250, y: 950, w: 700, h: 500 }, color: "#3B82F6" },
            { id: "school_quarter", name: "CHART SCHOOL QUARTER", description: "Academic academy for complete chart orientation and swings", bounds: { x: 100, y: 100, w: 1050, h: 750 }, color: "#00F0FF" },
            { id: "replay_quarter", name: "REPLAY QUARTER", description: "Candle-by-candle simulated chart development laboratories", bounds: { x: 2050, y: 100, w: 1050, h: 750 }, color: "#10B981" },
            { id: "analysis_quarter", name: "ANALYSIS QUARTER", description: "Deep chart analysis and detective mystery investigation", bounds: { x: 100, y: 950, w: 1050, h: 650 }, color: "#8B5CF6" },
            { id: "annotation_quarter", name: "ANNOTATION QUARTER", description: "Interactive chart marking, levels, trendlines and channels", bounds: { x: 2050, y: 950, w: 1050, h: 650 }, color: "#F59E0B" },
            { id: "timeframe_quarter", name: "TIMEFRAME QUARTER", description: "Multi-timeframe synthesis and comparative chart rooms", bounds: { x: 100, y: 1650, w: 1050, h: 650 }, color: "#EC4899" },
            { id: "arena_quarter", name: "CHART ARENA QUARTER", description: "High-speed chart reading combat and scouting drills", bounds: { x: 2050, y: 1650, w: 1050, h: 650 }, color: "#F43F5E" },
            { id: "outer_observation_quarter", name: "OUTER OBSERVATION QUARTER", description: "Chart Theater, Market History Room & Boss Citadel", bounds: { x: 1200, y: 100, w: 800, h: 750 }, color: "#6366F1" }
        ],
        roads: [
            { id: "main_avenue", name: "Chart Grand Avenue", x: 1520, y: 0, w: 160, h: 2400, orientation: "vertical" },
            { id: "north_boulevard", name: "Structure Boulevard", x: 0, y: 850, w: 3200, h: 100, orientation: "horizontal" },
            { id: "south_boulevard", name: "Timeframe Crossway", x: 0, y: 1550, w: 3200, h: 100, orientation: "horizontal" },
            { id: "west_lane", name: "Academy Way", x: 1150, y: 0, w: 100, h: 2400, orientation: "vertical" },
            { id: "east_lane", name: "Replay Expressway", x: 1950, y: 0, w: 100, h: 2400, orientation: "vertical" }
        ],
        buildings: [
            { id: "bld_chart_academy", name: "Chart Academy", subtitle: "Complete Chart Orientation & Swings", x: 250, y: 220, w: 380, h: 220, quarter: "school_quarter", themeColor: "#00F0FF", icon: "fa-graduation-cap", entrance: { x: 440, y: 440, w: 80, h: 20 }, interiorId: "chart_academy", promptText: "Enter Chart Academy" },
            { id: "bld_replay_lab", name: "Chart Replay Lab", subtitle: "Candle-by-Candle Development Engine", x: 2200, y: 220, w: 380, h: 220, quarter: "replay_quarter", themeColor: "#10B981", icon: "fa-play", entrance: { x: 2390, y: 440, w: 80, h: 20 }, interiorId: "replay_lab", promptText: "Enter Replay Lab" },
            { id: "bld_analysis_lab", name: "Chart Analysis Lab", subtitle: "Full Structure & Regime Identification", x: 250, y: 1050, w: 380, h: 200, quarter: "analysis_quarter", themeColor: "#8B5CF6", icon: "fa-magnifying-glass-chart", entrance: { x: 440, y: 1250, w: 80, h: 20 }, interiorId: "analysis_lab", promptText: "Enter Analysis Lab" },
            { id: "bld_detective_lab", name: "Chart Detective Lab", subtitle: "Partial Chart Mystery Reconstruction", x: 700, y: 1050, w: 380, h: 200, quarter: "analysis_quarter", themeColor: "#A855F7", icon: "fa-user-secret", entrance: { x: 890, y: 1250, w: 80, h: 20 }, interiorId: "detective_lab", promptText: "Enter Detective Lab" },
            { id: "bld_annotation_lab", name: "Chart Annotation Lab", subtitle: "Interactive Levels, Trendlines & Markers", x: 2200, y: 1050, w: 380, h: 200, quarter: "annotation_quarter", themeColor: "#F59E0B", icon: "fa-pen-ruler", entrance: { x: 2390, y: 1250, w: 80, h: 20 }, interiorId: "annotation_lab", promptText: "Enter Annotation Lab" },
            { id: "bld_timeframe_obs", name: "Multi-Timeframe Observatory", subtitle: "HTF vs LTF Contextual Synthesis", x: 250, y: 1750, w: 380, h: 200, quarter: "timeframe_quarter", themeColor: "#EC4899", icon: "fa-binoculars", entrance: { x: 440, y: 1950, w: 80, h: 20 }, interiorId: "timeframe_observatory", promptText: "Enter Observatory" },
            { id: "bld_comparison_room", name: "Chart Comparison Room", subtitle: "Side-by-Side Structural Spotting", x: 700, y: 1750, w: 380, h: 200, quarter: "timeframe_quarter", themeColor: "#F472B6", icon: "fa-code-compare", entrance: { x: 890, y: 1950, w: 80, h: 20 }, interiorId: "comparison_room", promptText: "Enter Comparison Room" },
            { id: "bld_chart_arena", name: "Chart Arena", subtitle: "10-Round Fast Chart Recognition Combat", x: 2200, y: 1750, w: 380, h: 200, quarter: "arena_quarter", themeColor: "#F43F5E", icon: "fa-bolt-lightning", entrance: { x: 2390, y: 1950, w: 80, h: 20 }, interiorId: "chart_arena", promptText: "Enter Chart Arena" },
            { id: "bld_chart_museum", name: "Chart Museum & Library", subtitle: "Complete Multi-Candle Formations Archive", x: 700, y: 220, w: 380, h: 220, quarter: "school_quarter", themeColor: "#38BDF8", icon: "fa-landmark", entrance: { x: 890, y: 440, w: 80, h: 20 }, interiorId: "chart_museum", promptText: "Enter Chart Museum" },
            { id: "bld_chart_theater", name: "Chart Theater", subtitle: "Unfolding Market Stories with Mid-Stops", x: 1350, y: 220, w: 500, h: 240, quarter: "outer_observation_quarter", themeColor: "#6366F1", icon: "fa-masks-theater", entrance: { x: 1600, y: 460, w: 80, h: 20 }, interiorId: "chart_theater", promptText: "Enter Chart Theater" },
            { id: "bld_history_room", name: "Market History Room", subtitle: "4-Phase Historical Timeline Walkthrough", x: 2650, y: 1050, w: 380, h: 200, quarter: "annotation_quarter", themeColor: "#D97706", icon: "fa-clock-rotate-left", entrance: { x: 2840, y: 1250, w: 80, h: 20 }, interiorId: "history_room", promptText: "Enter History Room" },
            { id: "bld_mission_hq", name: "Chart District Mission HQ", subtitle: "District Director & Tactical Journal", x: 1350, y: 1050, w: 500, h: 200, quarter: "chart_plaza", themeColor: "#3B82F6", icon: "fa-compass", entrance: { x: 1600, y: 1250, w: 80, h: 20 }, interiorId: "mission_hq", promptText: "Enter Mission HQ" }
        ],
        landmarks: [
            { id: "lm_chart_spire", name: "Chart Precision Spire", x: 1600, y: 980, w: 100, h: 100, icon: "fa-tower-broadcast", color: "#3B82F6", lore: "A 40-meter holographic spire projecting live simulated candlestick streams across the district." },
            { id: "lm_replay_clock", name: "Replay Epoch Clock", x: 2500, y: 870, w: 80, h: 80, icon: "fa-clock", color: "#10B981", lore: "Chronicles every tick in simulated market history candle by candle." },
            { id: "lm_timeframe_observatory_dome", name: "Multi-Timeframe Celestial Dome", x: 600, y: 1600, w: 90, h: 90, icon: "fa-satellite", color: "#EC4899", lore: "Synchronizes macro daily trends with micro hourly execution." },
            { id: "lm_pattern_bridge", name: "Pattern Arch Bridge", x: 1600, y: 700, w: 160, h: 60, icon: "fa-bridge", color: "#6366F1", lore: "Connecting the educational sector to the outer observation amphitheater." },
            { id: "lm_analysis_monument", name: "Structural Truth Monument", x: 600, y: 900, w: 80, h: 80, icon: "fa-shield", color: "#8B5CF6", lore: "Dedicated to the principle: Price action is context, not guarantees." },
            { id: "lm_timeline_gate", name: "Timeline Archway", x: 1600, y: 1500, w: 120, h: 50, icon: "fa-archway", color: "#00F0FF", lore: "Marks the southern gateway to the Timeframe and Arena sectors." },
            { id: "lm_history_tower", name: "Market Archive Obelisk", x: 2500, y: 1600, w: 70, h: 70, icon: "fa-monument", color: "#F59E0B", lore: "Preserves hundreds of historical market regime transitions." },
            { id: "lm_boss_citadel", name: "Complete Analysis Citadel", x: 1600, y: 180, w: 120, h: 60, icon: "fa-chess-rook", color: "#F43F5E", lore: "The apex evaluation hall for master chart readers." }
        ],
        explorationPoints: [
            { id: "exp_01", name: "Swing Point Origin Archive", x: 180, y: 300, xp: 15, lore: "Every trend begins with a single swing point failure." },
            { id: "exp_02", name: "The First Candle Monument", x: 950, y: 180, xp: 15, lore: "Before candles were charts, they were rice price records in 18th century Dojima." },
            { id: "exp_03", name: "Replay Calibration Terminal", x: 2800, y: 300, xp: 15, lore: "Stepping through charts candle-by-candle eliminates hindsight bias." },
            { id: "exp_04", name: "Fakeout Trap Warning Beacon", x: 2950, y: 1150, xp: 20, lore: "Breakouts without follow-through volume are prime liquidity traps." },
            { id: "exp_05", name: "Support-Resistance Memory Stone", x: 180, y: 1200, xp: 15, lore: "Levels are zones of collective market memory, not rigid single lines." },
            { id: "exp_06", name: "Detective Mystery Vault", x: 1050, y: 1200, xp: 20, lore: "A partial chart contains enough structural clues to deduce the macro state." },
            { id: "exp_07", name: "Trendline Snapping Array", x: 2100, y: 1200, xp: 15, lore: "A valid trendline connects at least 3 genuine swing rejections." },
            { id: "exp_08", name: "Timeframe Synchronization Hub", x: 180, y: 1900, xp: 20, lore: "Never trade a lower timeframe signal against unconfirmed higher timeframe resistance." },
            { id: "exp_09", name: "Chart Comparison Deck", x: 1050, y: 1900, xp: 15, lore: "Comparing range vs trend side-by-side teaches structural discrimination." },
            { id: "exp_10", name: "Arena Reflex Scoreboard", x: 2100, y: 1900, xp: 15, lore: "Chart reading speed develops only through hundreds of deliberate repetitions." },
            { id: "exp_11", name: "Theater Narrative Terrace", x: 1250, y: 180, xp: 20, lore: "A complete chart tells a 4-act story: accumulation, breakout, retest, continuation." },
            { id: "exp_12", name: "South District Gateway", x: 1600, y: 2320, xp: 10, lore: "Gateway connecting Chart District northwards to Strativo World Hub." }
        ],
        npcs: [
            { id: "mentor_alden", name: "Alden - Master Chart Mentor", role: "District Guide & Foundations", x: 440, y: 480, themeColor: "#00F0FF", avatarIcon: "fa-graduation-cap", dialogue: "Welcome to Chart District. Here we don't just stare at single candles—we read the entire developing narrative of the market." },
            { id: "instructor_rhea", name: "Rhea - Replay Specialist", role: "Replay & Stepping Director", x: 2390, y: 480, themeColor: "#10B981", avatarIcon: "fa-play", dialogue: "To master charts, you must see them develop candle by candle. Use the Replay Lab to step forward, pause, and test your understanding." },
            { id: "analyst_marcus", name: "Marcus - Senior Structure Analyst", role: "Analysis Lab Chief", x: 440, y: 1290, themeColor: "#8B5CF6", avatarIcon: "fa-magnifying-glass-chart", dialogue: "Identify swing highs and lows first. Once you know where the market turned, trend and range classification become clear." },
            { id: "detective_vance", name: "Vance - Chart Detective", role: "Mystery Reconstructionist", x: 890, y: 1290, themeColor: "#A855F7", avatarIcon: "fa-user-secret", dialogue: "Give me half a chart and I will show you where the buyers entered. Test your detective skills in our reconstruction chamber." },
            { id: "specialist_tara", name: "Tara - Annotation Specialist", role: "Precision Marking Lead", x: 2390, y: 1290, themeColor: "#F59E0B", avatarIcon: "fa-pen-ruler", dialogue: "Precision in marking levels separates clarity from confusion. Draw your support, resistance, and trendlines with disciplined snapping." },
            { id: "analyst_kai", name: "Kai - Timeframe Synthesizer", role: "Multi-Timeframe Strategist", x: 440, y: 1990, themeColor: "#EC4899", avatarIcon: "fa-binoculars", dialogue: "A pullback on the 1-hour chart is just a breath inside a Daily uptrend. Always anchor your perspective to the macro context." },
            { id: "referee_jax", name: "Jax - Arena Referee", role: "Combat Gauntlet Marshal", x: 2390, y: 1990, themeColor: "#F43F5E", avatarIcon: "fa-bolt-lightning", dialogue: "Step up to the Chart Arena terminal! 10 rapid rounds to test whether you can recognize market regimes under timer pressure." }
        ],
        ambientNpcs: [
            { id: "amb_01", name: "Senior Analyst Liam", x: 1450, y: 1100, role: "Chartist", themeColor: "#3B82F6", waypoints: [{x: 1450, y: 1100}, {x: 1550, y: 1100}] },
            { id: "amb_02", name: "Junior Trader Mia", x: 1750, y: 1100, role: "Student Chartist", themeColor: "#10B981", waypoints: [{x: 1750, y: 1100}, {x: 1650, y: 1100}] },
            { id: "amb_03", name: "Replay Operator Chen", x: 2150, y: 400, role: "Simulator Tech", themeColor: "#00F0FF", waypoints: [{x: 2150, y: 400}, {x: 2250, y: 400}] },
            { id: "amb_04", name: "Technician Maya", x: 350, y: 400, role: "Data Specialist", themeColor: "#8B5CF6", waypoints: [{x: 350, y: 400}, {x: 450, y: 400}] },
            { id: "amb_05", name: "Scout Ethan", x: 350, y: 1200, role: "Chart Scout", themeColor: "#F59E0B", waypoints: [{x: 350, y: 1200}, {x: 450, y: 1200}] },
            { id: "amb_06", name: "Observer Chloe", x: 2150, y: 1200, role: "Level Inspector", themeColor: "#EC4899", waypoints: [{x: 2150, y: 1200}, {x: 2250, y: 1200}] },
            { id: "amb_07", name: "Timeframe Guide Lucas", x: 350, y: 1900, role: "Macro Guide", themeColor: "#6366F1", waypoints: [{x: 350, y: 1900}, {x: 450, y: 1900}] },
            { id: "amb_08", name: "Arena Contender Zoe", x: 2150, y: 1900, role: "Speed Trainee", themeColor: "#F43F5E", waypoints: [{x: 2150, y: 1900}, {x: 2250, y: 1900}] },
            { id: "amb_09", name: "Historian Noah", x: 1550, y: 350, role: "Theater Curator", themeColor: "#D97706", waypoints: [{x: 1550, y: 350}, {x: 1650, y: 350}] },
            { id: "amb_10", name: "Plaza Visitor Ava", x: 1600, y: 1350, role: "District Visitor", themeColor: "#38BDF8", waypoints: [{x: 1600, y: 1350}, {x: 1600, y: 1450}] }
        ],
        marketBoards: [
            { id: "mb_01", name: "EUR/USD 4H Trend", x: 1350, y: 920, w: 110, h: 45, pair: "EUR/USD", regime: "Bullish Trend [SIM]", price: "1.0852", change: "+42 pips" },
            { id: "mb_02", name: "GBP/USD 1D Range", x: 1740, y: 920, w: 110, h: 45, pair: "GBP/USD", regime: "Horizontal Range [SIM]", price: "1.2640", change: "+8 pips" },
            { id: "mb_03", name: "USD/JPY 1H Retest", x: 1350, y: 1450, w: 110, h: 45, pair: "USD/JPY", regime: "Breakout Retest [SIM]", price: "154.20", change: "-18 pips" },
            { id: "mb_04", name: "AUD/USD 4H Pullback", x: 1740, y: 1450, w: 110, h: 45, pair: "AUD/USD", regime: "Pullback Wave [SIM]", price: "0.6580", change: "+14 pips" },
            { id: "mb_05", name: "USD/CAD Daily S/R", x: 1100, y: 880, w: 110, h: 45, pair: "USD/CAD", regime: "Resistance Test [SIM]", price: "1.3720", change: "+5 pips" },
            { id: "mb_06", name: "EUR/JPY Channel", x: 1990, y: 880, w: 110, h: 45, pair: "EUR/JPY", regime: "Ascending Channel [SIM]", price: "167.40", change: "+35 pips" },
            { id: "mb_07", name: "XAU/USD HTF Trend", x: 1100, y: 1580, w: 110, h: 45, pair: "XAU/USD", regime: "Macro Expansion [SIM]", price: "2412.50", change: "+$18.4" },
            { id: "mb_08", name: "BTC/USD Consolidation", x: 1990, y: 1580, w: 110, h: 45, pair: "BTC/USD", regime: "Equilibrium Zone [SIM]", price: "64,200", change: "+0.8%" }
        ],
        interiors: {
            chart_academy: { id: "chart_academy", name: "Chart Academy Lecture Hall", width: 1200, height: 800, spawn: { x: 600, y: 680, direction: "up" }, exit: { x: 600, y: 750, w: 120, h: 40 }, themeColor: "#00F0FF", stations: [ { id: "st_acad_fund", name: "Foundations & Orientation", x: 300, y: 350, w: 100, h: 60, label: "Use Orientation Desk [E]", action: "openAcademyModal", tab: "fund" }, { id: "st_acad_swings", name: "Swing High/Low Calibrator", x: 500, y: 350, w: 100, h: 60, label: "Use Swings Terminal [E]", action: "openAcademyModal", tab: "swings" }, { id: "st_acad_trend", name: "Trend Structure Workshop", x: 700, y: 350, w: 100, h: 60, label: "Use Trend Desk [E]", action: "openAcademyModal", tab: "trend" }, { id: "st_acad_context", name: "Chart Context Synthesizer", x: 900, y: 350, w: 100, h: 60, label: "Use Context Terminal [E]", action: "openAcademyModal", tab: "context" } ], npc: { id: "mentor_alden_in", name: "Alden", role: "Chart Academy Instructor", x: 600, y: 200, themeColor: "#00F0FF", avatarIcon: "fa-graduation-cap", dialogue: "Study the entire structure. A single candle only tells you what happened over one interval; the chart tells you the whole war." } },
            replay_lab: { id: "replay_lab", name: "Chart Replay Development Lab", width: 1200, height: 800, spawn: { x: 600, y: 680, direction: "up" }, exit: { x: 600, y: 750, w: 120, h: 40 }, themeColor: "#10B981", stations: [ { id: "st_replay_trend", name: "Trend Replay Console", x: 350, y: 350, w: 120, h: 60, label: "Use Trend Replay [E]", action: "openReplayModal", tab: "trend" }, { id: "st_replay_breakout", name: "Breakout Replay Console", x: 600, y: 350, w: 120, h: 60, label: "Use Breakout Replay [E]", action: "openReplayModal", tab: "breakout" }, { id: "st_replay_fakeout", name: "Trap & Fakeout Replay", x: 850, y: 350, w: 120, h: 60, label: "Use Fakeout Replay [E]", action: "openReplayModal", tab: "fakeout" } ], npc: { id: "instructor_rhea_in", name: "Rhea", role: "Replay Director", x: 600, y: 200, themeColor: "#10B981", avatarIcon: "fa-play", dialogue: "Step forward candle by candle. Watch how support holds or fails in real time." } },
            analysis_lab: { id: "analysis_lab", name: "Chart Analysis Laboratory", width: 1200, height: 800, spawn: { x: 600, y: 680, direction: "up" }, exit: { x: 600, y: 750, w: 120, h: 40 }, themeColor: "#8B5CF6", stations: [ { id: "st_anal_full", name: "Full Chart Diagnosis", x: 400, y: 350, w: 120, h: 60, label: "Diagnose Chart [E]", action: "openAnalysisModal", tab: "full" }, { id: "st_anal_swings", name: "Swing Point Mapping", x: 800, y: 350, w: 120, h: 60, label: "Map Swings [E]", action: "openAnalysisModal", tab: "swings" } ], npc: { id: "marcus_in", name: "Marcus", role: "Analysis Lead", x: 600, y: 200, themeColor: "#8B5CF6", avatarIcon: "fa-magnifying-glass-chart", dialogue: "Locate the key market levels before forming a directional thesis." } },
            detective_lab: { id: "detective_lab", name: "Chart Detective Mystery Room", width: 1200, height: 800, spawn: { x: 600, y: 680, direction: "up" }, exit: { x: 600, y: 750, w: 120, h: 40 }, themeColor: "#A855F7", stations: [ { id: "st_det_case", name: "Active Investigation Desk", x: 600, y: 350, w: 140, h: 60, label: "Examine Mystery [E]", action: "openDetectiveModal" } ], npc: { id: "vance_in", name: "Vance", role: "Lead Investigator", x: 600, y: 200, themeColor: "#A855F7", avatarIcon: "fa-user-secret", dialogue: "Look at where the wicks rejected. That is where institutional liquidity was absorbed." } },
            annotation_lab: { id: "annotation_lab", name: "Precision Annotation Workshop", width: 1200, height: 800, spawn: { x: 600, y: 680, direction: "up" }, exit: { x: 600, y: 750, w: 120, h: 40 }, themeColor: "#F59E0B", stations: [ { id: "st_annot_workbench", name: "Interactive Drawing Bench", x: 600, y: 350, w: 140, h: 60, label: "Open Annotation Canvas [E]", action: "openAnnotationModal" } ], npc: { id: "tara_in", name: "Tara", role: "Annotation Specialist", x: 600, y: 200, themeColor: "#F59E0B", avatarIcon: "fa-pen-ruler", dialogue: "Snap your markers directly to candle highs and lows. Clean charts create clear decisions." } },
            timeframe_observatory: { id: "timeframe_observatory", name: "Multi-Timeframe Observation Deck", width: 1200, height: 800, spawn: { x: 600, y: 680, direction: "up" }, exit: { x: 600, y: 750, w: 120, h: 40 }, themeColor: "#EC4899", stations: [ { id: "st_mtf_dual", name: "HTF/LTF Dual Telescope", x: 600, y: 350, w: 140, h: 60, label: "Synthesize Timeframes [E]", action: "openTimeframeModal" } ], npc: { id: "kai_in", name: "Kai", role: "Timeframe Synthesizer", x: 600, y: 200, themeColor: "#EC4899", avatarIcon: "fa-binoculars", dialogue: "Always ask: What is the Daily chart doing while this 15-minute pullback unfolds?" } },
            comparison_room: { id: "comparison_room", name: "Side-by-Side Chart Comparison Gallery", width: 1200, height: 800, spawn: { x: 600, y: 680, direction: "up" }, exit: { x: 600, y: 750, w: 120, h: 40 }, themeColor: "#F472B6", stations: [ { id: "st_comp_booth", name: "Chart Comparison Station", x: 600, y: 350, w: 140, h: 60, label: "Compare Charts [E]", action: "openComparisonModal" } ], npc: { id: "comp_guide_in", name: "Gallery Curator", role: "Comparison Guide", x: 600, y: 200, themeColor: "#F472B6", avatarIcon: "fa-code-compare", dialogue: "Spotting subtle differences between range equilibrium and true trend momentum is a master skill." } },
            chart_arena: { id: "chart_arena", name: "Chart Arena Combat Pavilion", width: 1200, height: 800, spawn: { x: 600, y: 680, direction: "up" }, exit: { x: 600, y: 750, w: 120, h: 40 }, themeColor: "#F43F5E", stations: [ { id: "st_arena_launch", name: "Arena Combat Terminal", x: 600, y: 350, w: 140, h: 60, label: "Start 10-Round Arena [E]", action: "launchChartArena" } ], npc: { id: "jax_in", name: "Jax", role: "Combat Marshal", x: 600, y: 200, themeColor: "#F43F5E", avatarIcon: "fa-bolt-lightning", dialogue: "10 rounds, countdown timers, maximum combo points. Let's see your real chart reading reflex." } },
            chart_museum: { id: "chart_museum", name: "Grand Chart Formations Archive", width: 1200, height: 800, spawn: { x: 600, y: 680, direction: "up" }, exit: { x: 600, y: 750, w: 120, h: 40 }, themeColor: "#38BDF8", stations: [ { id: "st_museum_archive", name: "Pattern Library Archive", x: 600, y: 350, w: 140, h: 60, label: "Inspect Formations [E]", action: "openMuseumModal" } ], npc: { id: "curator_in", name: "Curator Emily", role: "Museum Director", x: 600, y: 200, themeColor: "#38BDF8", avatarIcon: "fa-landmark", dialogue: "Our archive preserves complete multi-candle structures: channels, double tops, failed breakouts, and retests." } },
            chart_theater: { id: "chart_theater", name: "Chart Narrative Amphitheater", width: 1200, height: 800, spawn: { x: 600, y: 680, direction: "up" }, exit: { x: 600, y: 750, w: 120, h: 40 }, themeColor: "#6366F1", stations: [ { id: "st_theater_stage", name: "Main Theater Screen", x: 600, y: 350, w: 140, h: 60, label: "Watch Unfolding Story [E]", action: "openTheaterModal" } ], npc: { id: "noah_in", name: "Noah", role: "Theater Storyteller", x: 600, y: 200, themeColor: "#6366F1", avatarIcon: "fa-masks-theater", dialogue: "Every market chart tells an unfolding story. Watch the acts unfold and evaluate the decision points." } },
            history_room: { id: "history_room", name: "Market History Timeline Hall", width: 1200, height: 800, spawn: { x: 600, y: 680, direction: "up" }, exit: { x: 600, y: 750, w: 120, h: 40 }, themeColor: "#D97706", stations: [ { id: "st_hist_timeline", name: "Historical Scrub Terminal", x: 600, y: 350, w: 140, h: 60, label: "Scrub Timeline [E]", action: "openHistoryModal" } ], npc: { id: "historian_in", name: "Historian Samuel", role: "Timeline Archivist", x: 600, y: 200, themeColor: "#D97706", avatarIcon: "fa-clock-rotate-left", dialogue: "Understand what happened before the breakout. Context always precedes price movement." } },
            mission_hq: { id: "mission_hq", name: "District 4 Operations Directorate", width: 1200, height: 800, spawn: { x: 600, y: 680, direction: "up" }, exit: { x: 600, y: 750, w: 120, h: 40 }, themeColor: "#3B82F6", stations: [ { id: "st_hq_journal", name: "District Tactical Journal", x: 450, y: 350, w: 120, h: 60, label: "Open Missions [E]", action: "openMissionsJournal" }, { id: "st_hq_briefing", name: "Strategic Sector Briefing", x: 750, y: 350, w: 120, h: 60, label: "View Briefing [E]", action: "openTacticalBriefingModal" } ], npc: { id: "coordinator_in", name: "Director Evelyn", role: "District Coordinator", x: 600, y: 200, themeColor: "#3B82F6", avatarIcon: "fa-compass", dialogue: "Chart District is divided into 8 sectors. Master Replay in the east, Multi-Timeframe in the south, and complete the Boss Analysis in the north." } }
        }
    };

    class ChartDistrictWorld {
        constructor(config = {}) {
            this.mapConfig = MAP_CONFIG;
            this.width = MAP_CONFIG.bounds.width;
            this.height = MAP_CONFIG.bounds.height;
            this.bounds = { x: 0, y: 0, width: this.width, height: this.height };
            this.spawn = MAP_CONFIG.spawn;
            this.currentInterior = null;
            this.returnCoords = { x: 1600, y: 2250 };
            this.activePrompt = null;
            this.exploredPoints = new Set();
            this.colliders = [];
            this.interactiveObjects = [];

            this.initColliders();
            this.loadExploredState();
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
                        radius: 50,
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
                        radius: 65,
                        action: () => {
                            if (window.StrativoRPG[st.action]) {
                                window.StrativoRPG[st.action](st.tab);
                            }
                        },
                        prompt: st.label || "Interact [E]"
                    });
                });

                // NPC
                if (int.npc) {
                    this.colliders.push(new Rectangle(int.npc.x - 20, int.npc.y - 20, 40, 40, "npc_col_" + int.npc.id));
                    this.interactiveObjects.push({
                        id: int.npc.id,
                        name: int.npc.name,
                        category: "NPC_TALK",
                        x: int.npc.x,
                        y: int.npc.y,
                        radius: 70,
                        action: () => {
                            if (window.StrativoRPG.DialogueManager) {
                                window.StrativoRPG.DialogueManager.startDialogue({
                                    speaker: int.npc.name,
                                    role: int.npc.role || "District Instructor",
                                    avatarIcon: int.npc.avatarIcon || "fa-user",
                                    themeColor: int.npc.themeColor || int.themeColor || "#00F0FF",
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
                        radius: 65,
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

                if (lm.id === "lm_chart_spire") {
                    promptText = "Enter Chart Precision Spire [E]";
                    options = [
                        {
                            label: "Calibrate Precision Annotations",
                            primary: true,
                            icon: "fa-pen-ruler",
                            action: () => {
                                if (window.StrativoRPG.DialogueManager) window.StrativoRPG.DialogueManager.closeDialogue();
                                if (typeof window.StrativoRPG.openAnnotationModal === "function") {
                                    window.StrativoRPG.openAnnotationModal();
                                }
                            }
                        },
                        {
                            label: "Close Spire Interface",
                            secondary: true,
                            action: () => {
                                if (window.StrativoRPG.DialogueManager) window.StrativoRPG.DialogueManager.closeDialogue();
                            }
                        }
                    ];
                } else if (lm.id === "lm_boss_citadel") {
                    promptText = "Enter Grand Citadel [E]";
                    options = [
                        {
                            label: "Enter Boss Challenge",
                            primary: true,
                            icon: "fa-chess-rook",
                            action: () => {
                                if (window.StrativoRPG.DialogueManager) window.StrativoRPG.DialogueManager.closeDialogue();
                                if (typeof window.StrativoRPG.openBossModal === "function") {
                                    window.StrativoRPG.openBossModal();
                                }
                            }
                        },
                        {
                            label: "Close",
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
                                avatarIcon: lm.icon || "fa-monument",
                                themeColor: lm.color || "#3B82F6",
                                text: lm.lore,
                                options
                            });
                        }
                    },
                    prompt: promptText
                });
            });

            // 4. Primary NPCs
            MAP_CONFIG.npcs.forEach(npc => {
                this.colliders.push(new Rectangle(npc.x - 20, npc.y - 20, 40, 40, "npc_" + npc.id));
                this.interactiveObjects.push({
                    id: npc.id,
                    name: npc.name,
                    category: "NPC_TALK",
                    x: npc.x,
                    y: npc.y,
                    radius: 70,
                    action: () => {
                        if (window.StrativoRPG.DialogueManager) {
                            window.StrativoRPG.DialogueManager.startDialogue({
                                speaker: npc.name,
                                role: npc.role,
                                avatarIcon: npc.avatarIcon || "fa-user",
                                themeColor: npc.themeColor || "#00F0FF",
                                text: npc.dialogue
                            });
                        }
                    },
                    prompt: `Talk to ${npc.name.split(" ")[0]} [E]`
                });
            });

            // 4B. Ambient NPCs
            (MAP_CONFIG.ambientNpcs || []).forEach(amb => {
                const ambientLore = amb.role
                    ? `${amb.name} (${amb.role}): "Study every chart structure carefully. Price is market context, not random noise."`
                    : "Analyzing the latest simulated candlesticks...";
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
                                role: amb.role || "District Chartist",
                                avatarIcon: "fa-user-astronaut",
                                themeColor: amb.themeColor || "#3B82F6",
                                text: amb.dialogue || ambientLore
                            });
                        }
                    },
                    prompt: `Talk to ${amb.name.split(" ")[0]} [E]`
                });
            });

            // 5. Exploration Discovery Points
            MAP_CONFIG.explorationPoints.forEach(exp => {
                this.interactiveObjects.push({
                    id: exp.id,
                    name: exp.name,
                    category: "EXPLORATION",
                    x: exp.x,
                    y: exp.y,
                    radius: 55,
                    action: () => this.collectExplorationPoint(exp),
                    prompt: `Discover ${exp.name} [E]`
                });
            });

            // 6. Market Ticker Boards
            MAP_CONFIG.marketBoards.forEach(mb => {
                this.interactiveObjects.push({
                    id: mb.id,
                    name: mb.name,
                    category: "TICKER_BOARD",
                    x: mb.x + mb.w / 2,
                    y: mb.y + mb.h / 2,
                    radius: 60,
                    action: () => {
                        if (window.StrativoRPG.DialogueManager) {
                            window.StrativoRPG.DialogueManager.startDialogue({
                                speaker: `${mb.pair} Simulated Ticker`,
                                role: "Live Market Simulator",
                                avatarIcon: "fa-chart-line",
                                themeColor: "#00F0FF",
                                text: `Active Regime: <strong style="color: #00F0FF;">${mb.regime}</strong><br>Simulated Price: <strong style="color: #10B981;">${mb.price}</strong> (${mb.change})<br><br><em>Notice: This data is fully simulated for chart literacy education.</em>`
                            });
                        }
                    },
                    prompt: `Read ${mb.pair} Ticker [E]`
                });
            });
        }

        enterInterior(interiorId, returnPos) {
            if (!MAP_CONFIG.interiors[interiorId]) return;
            this.currentInterior = interiorId;
            if (returnPos) this.returnCoords = { x: returnPos.x, y: returnPos.y };

            const int = MAP_CONFIG.interiors[interiorId];
            this.width = int.width;
            this.height = int.height;
            this.initColliders();

            const player = window.StrativoRPG.gameCore ? window.StrativoRPG.gameCore.player : null;
            if (player && int.spawn) {
                player.x = int.spawn.x;
                player.y = int.spawn.y;
                player.direction = int.spawn.direction || "up";
            }
            window.StrativoRPG.emitGameEvent("interiorEnter");
        }

        exitInterior() {
            this.currentInterior = null;
            this.width = MAP_CONFIG.bounds.width;
            this.height = MAP_CONFIG.bounds.height;
            this.initColliders();

            const player = window.StrativoRPG.gameCore ? window.StrativoRPG.gameCore.player : null;
            if (player) {
                player.x = this.returnCoords.x;
                player.y = this.returnCoords.y;
                player.direction = "down";
            }
            window.StrativoRPG.emitGameEvent("interiorExit");
        }

        loadExploredState() {
            const state = window.StrativoWorldState ? window.StrativoWorldState.getState() : {};
            const unique = state.uniqueLocations || [];
            unique.forEach(loc => {
                if (typeof loc === "string" && loc.startsWith("cd_exp_")) {
                    this.exploredPoints.add(loc.replace("cd_exp_", ""));
                }
            });
        }

        collectExplorationPoint(exp) {
            const isNew = !this.exploredPoints.has(exp.id);
            if (isNew) {
                this.exploredPoints.add(exp.id);
                if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.addWorldXP === "function") {
                    window.StrativoWorldXPEngine.addWorldXP(exp.xp || 15, `Discovered: ${exp.name}`, "cd_exp_" + exp.id);
                }
                window.StrativoRPG.emitGameEvent("explorationFound");
            }

            const modal = document.getElementById("cd-discovery-modal");
            if (modal) {
                const hEl = document.getElementById("cd-discovery-heading");
                const lEl = document.getElementById("cd-discovery-lore");
                const xEl = document.getElementById("cd-discovery-xp");
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

            // Check nearest interactive object for player prompt with deterministic prioritization
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
                const maxRadius = obj.radius || 60;
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
            const banner = document.getElementById("cd-prompt-banner");
            const textEl = document.getElementById("cd-prompt-text");
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
            // 0. Base Ground & Tactical Grid
            ctx.fillStyle = MAP_CONFIG.theme.ground || "#070b19";
            ctx.fillRect(0, 0, this.width, this.height);

            ctx.strokeStyle = "rgba(59, 130, 246, 0.04)";
            ctx.lineWidth = 1;
            const gridSize = 100;
            for (let x = 0; x < this.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, this.height);
                ctx.stroke();
            }
            for (let y = 0; y < this.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(this.width, y);
                ctx.stroke();
            }

            // 1. Quarters background
            MAP_CONFIG.quarters.forEach(q => {
                ctx.fillStyle = q.color + "18";
                ctx.fillRect(q.bounds.x, q.bounds.y, q.bounds.w, q.bounds.h);
                ctx.strokeStyle = q.color + "50";
                ctx.lineWidth = 2;
                ctx.strokeRect(q.bounds.x, q.bounds.y, q.bounds.w, q.bounds.h);

                ctx.fillStyle = q.color + "40";
                ctx.font = "bold 14px sans-serif";
                ctx.fillText(q.name, q.bounds.x + 15, q.bounds.y + 25);
            });

            // 2. Roads & Crosswalks
            MAP_CONFIG.roads.forEach(r => {
                ctx.fillStyle = "#0B1528";
                ctx.fillRect(r.x, r.y, r.w, r.h);

                // Road borders
                ctx.strokeStyle = "rgba(59, 130, 246, 0.25)";
                ctx.lineWidth = 2;
                ctx.strokeRect(r.x, r.y, r.w, r.h);

                // Dashed center line
                ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
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

            // 3. Buildings & Interactive Facilities
            MAP_CONFIG.buildings.forEach(b => {
                ctx.save();
                // Building Drop Shadow
                ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                ctx.fillRect(b.x + 8, b.y + 8, b.w, b.h);

                // Building Body
                ctx.fillStyle = "rgba(11, 25, 54, 0.95)";
                ctx.fillRect(b.x, b.y, b.w, b.h);

                // Building Neon Border
                const themeCol = b.themeColor || "#3B82F6";
                ctx.strokeStyle = themeCol;
                ctx.lineWidth = 3;
                ctx.shadowColor = themeCol;
                ctx.shadowBlur = 10;
                ctx.strokeRect(b.x, b.y, b.w, b.h);
                ctx.shadowBlur = 0;

                // Name Plate Banner
                ctx.fillStyle = themeCol + "25";
                ctx.fillRect(b.x + 10, b.y + 10, b.w - 20, 48);
                ctx.strokeStyle = themeCol + "60";
                ctx.lineWidth = 1;
                ctx.strokeRect(b.x + 10, b.y + 10, b.w - 20, 48);

                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 14px 'Inter', sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(b.name, b.x + b.w / 2, b.y + 32);

                ctx.fillStyle = themeCol;
                ctx.font = "10px 'Inter', sans-serif";
                ctx.fillText(b.subtitle || "", b.x + b.w / 2, b.y + 48);

                // Entrance Door Badge
                if (b.entrance) {
                    ctx.fillStyle = "rgba(0, 240, 255, 0.25)";
                    ctx.fillRect(b.entrance.x - 40, b.entrance.y - 14, 80, 28);
                    ctx.strokeStyle = themeCol;
                    ctx.lineWidth = 2;
                    ctx.strokeRect(b.entrance.x - 40, b.entrance.y - 14, 80, 28);

                    ctx.fillStyle = "#FFFFFF";
                    ctx.font = "bold 11px 'Inter', sans-serif";
                    ctx.fillText("[E] ENTER", b.entrance.x, b.entrance.y + 5);
                }
                ctx.restore();
            });

            // 4. Landmarks
            MAP_CONFIG.landmarks.forEach(lm => {
                ctx.save();
                const themeCol = lm.color || "#3B82F6";
                ctx.fillStyle = themeCol + "20";
                ctx.beginPath();
                ctx.arc(lm.x, lm.y, lm.w / 2 + 10, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = themeCol + "40";
                ctx.beginPath();
                ctx.arc(lm.x, lm.y, lm.w / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = themeCol;
                ctx.lineWidth = 2.5;
                ctx.shadowColor = themeCol;
                ctx.shadowBlur = 12;
                ctx.stroke();

                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 11px 'Inter', sans-serif";
                ctx.textAlign = "center";
                ctx.shadowBlur = 0;
                ctx.fillText(lm.name, lm.x, lm.y + lm.h / 2 + 18);
                ctx.restore();
            });

            // 5. Exploration Points
            MAP_CONFIG.explorationPoints.forEach(exp => {
                const isFound = this.exploredPoints.has(exp.id);
                ctx.fillStyle = isFound ? "rgba(16, 185, 129, 0.3)" : "rgba(252, 211, 77, 0.4)";
                ctx.beginPath();
                ctx.arc(exp.x, exp.y, 14, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = isFound ? "#10B981" : "#FCD34D";
                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.fillStyle = isFound ? "#10B981" : "#FCD34D";
                ctx.font = "bold 10px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(isFound ? "✓" : "★", exp.x, exp.y + 4);
            });

            // 6. Market Boards
            MAP_CONFIG.marketBoards.forEach(mb => {
                ctx.fillStyle = "rgba(7, 18, 41, 0.9)";
                ctx.fillRect(mb.x, mb.y, mb.w, mb.h);
                ctx.strokeStyle = "#00F0FF";
                ctx.lineWidth = 1;
                ctx.strokeRect(mb.x, mb.y, mb.w, mb.h);

                ctx.fillStyle = "#00F0FF";
                ctx.font = "bold 9px sans-serif";
                ctx.textAlign = "left";
                ctx.fillText(mb.pair, mb.x + 4, mb.y + 12);
                ctx.fillStyle = "#10B981";
                ctx.fillText(mb.price, mb.x + 4, mb.y + 24);
                ctx.fillStyle = "#94A3B8";
                ctx.font = "8px sans-serif";
                ctx.fillText(mb.regime, mb.x + 4, mb.y + 36);
            });

            // 7. NPCs (Primary & Ambient)
            MAP_CONFIG.npcs.forEach(npc => {
                ctx.fillStyle = npc.themeColor || "#00F0FF";
                ctx.beginPath();
                ctx.arc(npc.x, npc.y, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#FFF";
                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.fillStyle = "#FFF";
                ctx.font = "bold 10px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(npc.name.split(" ")[0], npc.x, npc.y - 16);
            });

            MAP_CONFIG.ambientNpcs.forEach(amb => {
                ctx.fillStyle = amb.themeColor || "#64748B";
                ctx.beginPath();
                ctx.arc(amb.x, amb.y, 10, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        renderInterior(ctx, camera) {
            const int = MAP_CONFIG.interiors[this.currentInterior];
            if (!int) return;

            // Room Floor
            ctx.fillStyle = "#050B1E";
            ctx.fillRect(0, 0, int.width, int.height);

            // Floor Grid
            ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
            ctx.lineWidth = 1;
            for (let x = 0; x < int.width; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, int.height);
                ctx.stroke();
            }
            for (let y = 0; y < int.height; y += 40) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(int.width, y);
                ctx.stroke();
            }

            // Room Border Glow
            ctx.strokeStyle = int.themeColor || "#3B82F6";
            ctx.lineWidth = 4;
            ctx.strokeRect(15, 15, int.width - 30, int.height - 30);

            // Title Banner
            ctx.fillStyle = "#FFF";
            ctx.font = "bold 18px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(int.name, int.width / 2, 70);

            // Exit Area
            if (int.exit) {
                ctx.fillStyle = "rgba(244, 63, 94, 0.3)";
                ctx.fillRect(int.exit.x - int.exit.w / 2, int.exit.y - int.exit.h / 2, int.exit.w, int.exit.h);
                ctx.strokeStyle = "#F43F5E";
                ctx.strokeRect(int.exit.x - int.exit.w / 2, int.exit.y - int.exit.h / 2, int.exit.w, int.exit.h);
                ctx.fillStyle = "#FFF";
                ctx.font = "bold 11px sans-serif";
                ctx.fillText("EXIT TO CITY", int.exit.x, int.exit.y + 4);
            }

            // Interactive Stations
            (int.stations || []).forEach(st => {
                ctx.fillStyle = "rgba(11, 25, 54, 0.9)";
                ctx.fillRect(st.x, st.y, st.w, st.h);
                ctx.strokeStyle = int.themeColor || "#00F0FF";
                ctx.lineWidth = 1.5;
                ctx.strokeRect(st.x, st.y, st.w, st.h);

                ctx.fillStyle = "#FFF";
                ctx.font = "bold 11px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(st.name, st.x + st.w / 2, st.y + st.h / 2);
            });

            // Interior NPC
            if (int.npc) {
                ctx.fillStyle = int.npc.themeColor || "#00F0FF";
                ctx.beginPath();
                ctx.arc(int.npc.x, int.npc.y, 14, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#FFF";
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.fillStyle = "#FFF";
                ctx.font = "bold 11px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(int.npc.name, int.npc.x, int.npc.y - 18);
            }
        }
    }

    // World Validator Function
    function validateChartDistrictWorld() {
        const errors = [];
        if (MAP_CONFIG.bounds.width < 3000 || MAP_CONFIG.bounds.height < 2000) {
            errors.push("Map bounds too small: expected >= 3000x2000");
        }
        if (!MAP_CONFIG.quarters || MAP_CONFIG.quarters.length < 8) {
            errors.push("Expected at least 8 quarters");
        }
        if (!MAP_CONFIG.buildings || MAP_CONFIG.buildings.length < 12) {
            errors.push("Expected at least 12 buildings");
        }
        if (!MAP_CONFIG.interiors || Object.keys(MAP_CONFIG.interiors).length < 12) {
            errors.push("Expected at least 12 real building interiors");
        }
        if (!MAP_CONFIG.landmarks || MAP_CONFIG.landmarks.length < 8) {
            errors.push("Expected at least 8 landmarks");
        }
        if (!MAP_CONFIG.explorationPoints || MAP_CONFIG.explorationPoints.length < 12) {
            errors.push("Expected at least 12 exploration discovery points");
        }
        if (!MAP_CONFIG.npcs || MAP_CONFIG.npcs.length < 7) {
            errors.push("Expected at least 7 primary NPCs");
        }
        return {
            isValid: errors.length === 0,
            errors,
            bounds: MAP_CONFIG.bounds,
            quartersCount: MAP_CONFIG.quarters ? MAP_CONFIG.quarters.length : 0,
            buildingsCount: MAP_CONFIG.buildings ? MAP_CONFIG.buildings.length : 0,
            interiorsCount: MAP_CONFIG.interiors ? Object.keys(MAP_CONFIG.interiors).length : 0,
            landmarksCount: MAP_CONFIG.landmarks ? MAP_CONFIG.landmarks.length : 0,
            explorationCount: MAP_CONFIG.explorationPoints ? MAP_CONFIG.explorationPoints.length : 0
        };
    }

    window.StrativoRPG.ChartDistrictWorld = ChartDistrictWorld;
    window.StrativoRPG.validateChartDistrictWorld = validateChartDistrictWorld;
    window.ChartDistrictWorld = ChartDistrictWorld;
    window.validateChartDistrictWorld = validateChartDistrictWorld;
})();
