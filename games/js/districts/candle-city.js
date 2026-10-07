/* ==========================================================================
   STRATIVO WORLD — DISTRICT 1: CANDLE CITY SCENE (PHASE 2.3)
   Namespace: StrativoRPG.CandleCityScene
   Description:
   - Canonical Master Candlestick Dataset Integration (games/data/candlesticks.json)
   - Real Game Progression, Mastery & Idempotent XP Rewards Bridge
   - Pattern Familiarity & Exploration Tracking
   - 10-Round Fast Reaction Game Engine & Scorecard
   - Multi-Candle Procedural Diagram Renderer
   ========================================================================== */

"use strict";

(function () {
    window.StrativoRPG = window.StrativoRPG || {};

    const { Rectangle, CollisionSystem } = window.StrativoRPG;
    const World = window.StrativoRPG.World;

    // Master in-memory pattern cache loaded exclusively from games/data/candlesticks.json
    let CANDLE_PATTERNS = [];

    // Sound & Settings Event Hooks Dispatcher
    window.StrativoRPG.emitGameEvent = function (eventName, eventData = {}) {
        if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
            const sfxVol = window.StrativoWorldAudio ? window.StrativoWorldAudio.getSfxVolume() : 0.8;
            const masterVol = window.StrativoWorldAudio ? window.StrativoWorldAudio.getMasterVolume() : 1.0;

            window.dispatchEvent(new CustomEvent("strativo:gameAudioEvent", {
                detail: {
                    event: eventName,
                    data: eventData,
                    sfxVolume: sfxVol,
                    masterVolume: masterVol,
                    timestamp: Date.now()
                }
            }));

            // Delegate haptic vibrations to StrativoWorldHaptics
            if (window.StrativoWorldHaptics && typeof window.StrativoWorldHaptics.triggerHaptic === "function") {
                if (eventName === "correctHit" || eventName === "targetSelect") {
                    window.StrativoWorldHaptics.triggerHaptic("hit");
                } else if (eventName === "wrongHit") {
                    window.StrativoWorldHaptics.triggerHaptic("miss");
                } else if (eventName === "matchComplete" || eventName === "achievementUnlocked") {
                    window.StrativoWorldHaptics.triggerHaptic("reward");
                } else if (eventName === "countdownGo") {
                    window.StrativoWorldHaptics.triggerHaptic("tap");
                }
            }
        }
    };

    // Async loader for canonical dataset (games/data/candlesticks.json)
    async function loadCandlesticksDataset() {
        if (CANDLE_PATTERNS.length > 0 && window.StrativoRPG.CandlePatterns && window.StrativoRPG.CandlePatterns.length === 44) {
            return window.StrativoRPG.CandlePatterns;
        }

        const candidatePaths = [
            "../data/candlesticks.json",
            "/games/data/candlesticks.json",
            "games/data/candlesticks.json",
            "./data/candlesticks.json",
            "./games/data/candlesticks.json"
        ];

        for (const dataPath of candidatePaths) {
            try {
                if (typeof fetch === "function") {
                    const response = await fetch(dataPath);
                    if (response.ok) {
                        const data = await response.json();
                        if (data && Array.isArray(data.patterns) && data.patterns.length > 0) {
                            CANDLE_PATTERNS = data.patterns;
                            window.StrativoRPG.CandlePatterns = CANDLE_PATTERNS;

                            if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
                                window.dispatchEvent(new CustomEvent("strativo:candlesticksLoaded", { detail: data }));
                            }
                            return CANDLE_PATTERNS;
                        }
                    }
                }
            } catch (err) {
                // Try next candidate path
            }
        }

        // Node.js fallback for headless tests
        if (typeof require === "function" && typeof process !== "undefined") {
            try {
                const fs = require("fs");
                const path = require("path");
                const localPaths = [
                    path.join(process.cwd(), "games/data/candlesticks.json"),
                    path.join(__dirname, "../../data/candlesticks.json"),
                    path.join(__dirname, "../data/candlesticks.json")
                ];
                for (const lp of localPaths) {
                    if (fs.existsSync(lp)) {
                        const fileContent = fs.readFileSync(lp, "utf8");
                        const data = JSON.parse(fileContent);
                        if (data && Array.isArray(data.patterns) && data.patterns.length > 0) {
                            CANDLE_PATTERNS = data.patterns;
                            window.StrativoRPG.CandlePatterns = CANDLE_PATTERNS;
                            return CANDLE_PATTERNS;
                        }
                    }
                }
            } catch (e) {
                // Ignore in browser
            }
        }

        return CANDLE_PATTERNS;
    }

    // Auto-invoke dataset loading
    if (typeof window !== "undefined") {
        loadCandlesticksDataset();
    }    /* ======================================================================
       CANDLE CITY WORLD (1600x1000) — PHASE 3.0 REAL 2D RPG ENVIRONMENT
       ====================================================================== */
    class CandleCityWorld extends World {
        constructor(config = {}) {
            super({
                id: "candle-city",
                name: "District 1: Candle City",
                width: 1600,
                height: 1000,
                spawnPoint: { x: 970, y: 640, direction: "up" },
                themeColor: "#00F0FF",
                accentColor: "#00E5A8",
                ...config
            });

            this.pulseTimer = 0;
            this.tickerScroll = 0;
            this.buildingFootprints = [];
            this.patternExhibits = [];
            this.streetProps = [];
            this.activeDetectiveTarget = null;
            this.detectiveCompletedCount = 0;

            // Initialize Phase 2.6 NPC Manager
            this.npcManager = window.StrativoRPG.NPCManager ? new window.StrativoRPG.NPCManager() : null;

            this._refreshDetectiveQuest();
        }

        _refreshDetectiveQuest() {
            const pool = window.StrativoRPG.getPatterns ? window.StrativoRPG.getPatterns() : CANDLE_PATTERNS;
            if (pool && pool.length > 0) {
                this.activeDetectiveTarget = pool[Math.floor(Math.random() * pool.length)];
            }
        }

        buildScene(collisionSystem) {
            this.obstacles = [];
            this.interactiveObjects = [];
            this.buildingFootprints = [];
            this.patternExhibits = [];
            this.streetProps = [];

            const wallThickness = 36;

            // 1. Perimeter City Boundary Fortifications
            const topWall = new Rectangle(0, 0, this.width, wallThickness, "cc_wall_top", "solid");
            const bottomWall = new Rectangle(0, this.height - wallThickness, this.width, wallThickness, "cc_wall_bottom", "solid");
            const leftWall = new Rectangle(0, 0, wallThickness, this.height, "cc_wall_left", "solid");
            const rightWall = new Rectangle(this.width - wallThickness, 0, wallThickness, this.height, "cc_wall_right", "solid");

            this.addObstacle(topWall, { label: "Perimeter Shield North", color: "#0B1426" }, collisionSystem);
            this.addObstacle(bottomWall, { label: "Perimeter Shield South", color: "#0B1426" }, collisionSystem);
            this.addObstacle(leftWall, { label: "Perimeter Shield West", color: "#0B1426" }, collisionSystem);
            this.addObstacle(rightWall, { label: "Perimeter Shield East", color: "#0B1426" }, collisionSystem);

            // ==================================================================
            // 1B. DISTRICT NPCS & DIALOGUE AGENTS (PHASE 2.6 / 3.0 POSITIONS)
            // ==================================================================
            if (this.npcManager) {
                this.npcManager.clear();

                const npcsData = [
                    {
                        id: "mentor_kael",
                        name: "Candle Mentor Kael",
                        role: "Foundational Instructor",
                        x: 480,
                        y: 250,
                        themeColor: "#00E5A8",
                        secondaryColor: "#00F0FF",
                        avatarIcon: "fa-fire-flame-curved",
                        missions: ["first_light", "candle_scholar"],
                        defaultDialogue: "Welcome to Candle City. Study the 44 candlestick formations in our master encyclopedia before stepping into live market ranges."
                    },
                    {
                        id: "instructor_val",
                        name: "Range Instructor Val",
                        role: "Combat Range Instructor",
                        x: 1050,
                        y: 250,
                        themeColor: "#00F0FF",
                        secondaryColor: "#F59E0B",
                        avatarIcon: "fa-crosshairs",
                        missions: ["rapid_eye", "pattern_hunter"],
                        defaultDialogue: "Sharp reflexes and strict discipline keep a trader profitable. Step into Candle Blitz when you're ready for speed trials."
                    },
                    {
                        id: "analyst_soren",
                        name: "Market Analyst Soren",
                        role: "Confluence Analyst",
                        x: 1130,
                        y: 475,
                        themeColor: "#A855F7",
                        secondaryColor: "#FCD34D",
                        avatarIcon: "fa-chart-line",
                        missions: ["context_matters"],
                        defaultDialogue: "Never trade a candle pattern in isolation. A bullish pinbar at resistance is often a bull trap. Context is king."
                    },
                    {
                        id: "coordinator_aria",
                        name: "Coordinator Aria",
                        role: "District Mission Officer",
                        x: 630,
                        y: 690,
                        themeColor: "#F59E0B",
                        secondaryColor: "#00E5A8",
                        avatarIcon: "fa-compass",
                        missions: ["city_explorer"],
                        defaultDialogue: "Welcome to the central gateway of Candle City. Explore all training facilities across the district to earn your explorer badge."
                    }
                ];

                npcsData.forEach(npcConfig => {
                    const npc = this.npcManager.addNPC(npcConfig);
                    this.interactiveObjects.push({
                        id: `trigger_npc_${npc.id}`,
                        rect: new Rectangle(npc.x - 25, npc.y - 25, 50, 50, `trigger_npc_${npc.id}`, "trigger"),
                        name: npc.name.toUpperCase(),
                        category: "NPC_TALK",
                        icon: npc.avatarIcon || "fa-user-astronaut",
                        promptText: `Talk to ${npc.name}`,
                        interactRadius: npc.interactionRadius || 75,
                        npcRef: npc,
                        onInteract: () => {
                            npc.interact();
                            return null;
                        }
                    });
                });
            }

            // ==================================================================
            // 2. MAJOR LANDMARKS & BUILDINGS (1600x1000 City Grid)
            // ==================================================================

            // A. CANDLE ARCHIVE / LIBRARY (North West Scholar Quarter)
            const archiveRect = new Rectangle(80, 60, 330, 190, "bldg_candle_archive", "solid");
            this.addBuilding({
                id: "candle_archive",
                rect: archiveRect,
                name: "CANDLE ARCHIVE",
                subtitle: "44-Pattern Encyclopedia",
                category: "LIBRARY",
                themeColor: "#38BDF8",
                accentColor: "#00E5A8",
                icon: "fa-book-bookmark",
                facadeStyle: "neoclassical_cyber",
                windows: 6,
                interactPoint: { x: 245, y: 255 },
                interactRadius: 85,
                promptText: "Open Candle Archive",
                onInteract: () => {
                    const totalPatterns = window.StrativoRPG.getPatterns ? window.StrativoRPG.getPatterns().length : 44;
                    return {
                        title: "Candle Knowledge Archive",
                        icon: "fa-book-bookmark",
                        badge: `${totalPatterns} PATTERNS ENCYCLOPEDIA`,
                        message: "Explore the comprehensive master encyclopedia of single, double, triple, and multi-candlestick configurations with full OHLC geometry and recognition rules.",
                        type: "ARCHIVE_BROWSER",
                        actionLabel: "Browse All Patterns",
                        actionHandler: () => {
                            if (typeof window.StrativoRPG.openArchiveBrowser === "function") {
                                window.StrativoRPG.openArchiveBrowser();
                            }
                        }
                    };
                }
            }, collisionSystem);

            // B. CANDLE BLITZ ARENA (North East Combat Sector)
            const blitzRect = new Rectangle(870, 60, 420, 190, "bldg_candle_blitz", "solid");
            this.addBuilding({
                id: "candle_blitz_arena",
                rect: blitzRect,
                name: "CANDLE BLITZ",
                subtitle: "10-Round Reaction Arena",
                category: "ARENA",
                themeColor: "#00F0FF",
                accentColor: "#00E5A8",
                icon: "fa-bolt-lightning",
                facadeStyle: "stadium_combat",
                windows: 8,
                interactPoint: { x: 1080, y: 255 },
                interactRadius: 95,
                promptText: "Enter Candle Blitz Arena",
                onInteract: () => ({
                    title: "Candle Blitz Reaction Arena",
                    icon: "fa-bolt-lightning",
                    badge: "10-ROUND REACTION CHALLENGE",
                    message: "Step inside the holographic targeting arena. Identify candlestick formations under rapid countdown timers, chain high combos, and earn Strativo XP!",
                    type: "BLITZ_LAUNCHER",
                    actionLabel: "Enter Arena (10 Rounds)",
                    actionHandler: () => {
                        if (typeof window.StrativoRPG.launchCandleBlitz === "function") {
                            window.StrativoRPG.launchCandleBlitz();
                        }
                    }
                })
            }, collisionSystem);

            // C. CANDLE LAB (West Research Wing)
            const labRect = new Rectangle(80, 380, 330, 190, "bldg_candle_lab", "solid");
            this.addBuilding({
                id: "candle_lab",
                rect: labRect,
                name: "CANDLE LAB",
                subtitle: "OHLC Construction & Anatomy",
                category: "LAB",
                themeColor: "#00E5A8",
                accentColor: "#00F0FF",
                icon: "fa-microscope",
                facadeStyle: "biotech_research",
                windows: 6,
                interactPoint: { x: 415, y: 475 },
                interactRadius: 85,
                promptText: "Open Candle Lab",
                onInteract: () => ({
                    title: "Candle Anatomy & Construction Lab",
                    icon: "fa-microscope",
                    badge: "OHLC ANATOMY",
                    message: "Deconstruct every candlestick into its 4 core data points: Open, High, Low, and Close. Study how real body height and wick extensions expose buyer vs seller control.",
                    type: "LAB_VIEWER",
                    actionLabel: "Explore Anatomy",
                    actionUrl: "../../notes/module1-notes/notes-candlesticks.html#s3"
                })
            }, collisionSystem);

            // D. CONTEXT CHAMBER (East Confluence Facility)
            const contextRect = new Rectangle(1190, 380, 330, 190, "bldg_context_chamber", "solid");
            this.addBuilding({
                id: "context_chamber",
                rect: contextRect,
                name: "CONTEXT CHAMBER",
                subtitle: "Market Confluence Simulator",
                category: "CONTEXT",
                themeColor: "#A855F7",
                accentColor: "#FCD34D",
                icon: "fa-layer-group",
                facadeStyle: "observatory_deck",
                windows: 6,
                interactPoint: { x: 1185, y: 475 },
                interactRadius: 85,
                promptText: "Enter Context Chamber",
                onInteract: () => ({
                    title: "Context Chamber: Confluence Simulation",
                    icon: "fa-layer-group",
                    badge: "PRICE ACTION PRINCIPLE",
                    message: "A candlestick is never a standalone trade signal. Learn how surrounding market structure, support/resistance, and higher timeframe trends determine real follow-through.",
                    type: "INFO",
                    actionLabel: "Study Support/Resistance Confluence",
                    actionUrl: "../../notes/module1-notes/notes-candlesticks.html#s37"
                })
            }, collisionSystem);

            // E. MISTAKE LAB (South West Trap Bunker)
            const mistakeRect = new Rectangle(80, 700, 330, 190, "bldg_mistake_lab", "solid");
            this.addBuilding({
                id: "mistake_lab",
                rect: mistakeRect,
                name: "MISTAKE LAB",
                subtitle: "Common Trader Traps",
                category: "TRAPS",
                themeColor: "#F43F5E",
                accentColor: "#F59E0B",
                icon: "fa-triangle-exclamation",
                facadeStyle: "hazard_bunker",
                windows: 4,
                interactPoint: { x: 245, y: 695 },
                interactRadius: 85,
                promptText: "Analyze Trader Mistakes",
                onInteract: () => ({
                    title: "Mistake Lab: Common Beginner Traps",
                    icon: "fa-triangle-exclamation",
                    badge: "RISK & PSYCHOLOGY",
                    message: "Common traps: 1) Confusing a Hammer with a Hanging Man by ignoring prior trend, 2) Chasing extended Marubozu breakouts without confirmation, 3) Trading Dojis as guaranteed reversals.",
                    type: "INFO",
                    actionLabel: "Review Common Traps",
                    actionUrl: "../../notes/module1-notes/notes-candlesticks.html#s42"
                })
            }, collisionSystem);

            // F. RECOGNITION RANGE (South East Target Drills)
            const rangeRect = new Rectangle(1190, 700, 330, 190, "bldg_recognition_range", "solid");
            this.addBuilding({
                id: "recognition_range",
                rect: rangeRect,
                name: "RECOGNITION RANGE",
                subtitle: "Target Practice Range",
                category: "RANGE",
                themeColor: "#F59E0B",
                accentColor: "#00F0FF",
                icon: "fa-crosshairs",
                facadeStyle: "tactical_range",
                windows: 5,
                interactPoint: { x: 1355, y: 695 },
                interactRadius: 85,
                promptText: "Enter Recognition Range",
                onInteract: () => ({
                    title: "Candle Recognition Range",
                    icon: "fa-crosshairs",
                    badge: "TARGET DRILLS",
                    message: "Test your recognition precision. Identify formations dynamically chosen from the master encyclopedia.",
                    type: "RANGE_LAUNCHER",
                    actionLabel: "Start Target Drills",
                    actionHandler: () => {
                        if (typeof window.StrativoRPG.launchCandleBlitz === "function") {
                            window.StrativoRPG.launchCandleBlitz();
                        }
                    }
                })
            }, collisionSystem);

            // G. MISSION HQ (South Civic Center)
            const missionRect = new Rectangle(530, 720, 200, 170, "bldg_mission_hq", "solid");
            this.addBuilding({
                id: "mission_hq",
                rect: missionRect,
                name: "MISSION HQ",
                subtitle: "District Training & Quests",
                category: "MISSIONS",
                themeColor: "#FCD34D",
                accentColor: "#00E5A8",
                icon: "fa-list-check",
                facadeStyle: "civic_command",
                windows: 4,
                interactPoint: { x: 630, y: 715 },
                interactRadius: 80,
                promptText: "Open Missions HQ",
                onInteract: () => {
                    const missionsModal = document.getElementById("cc-missions-modal");
                    if (missionsModal) {
                        missionsModal.classList.add("active");
                        missionsModal.setAttribute("aria-hidden", "false");
                        if (typeof window.StrativoMissions?.renderModal === "function") {
                            window.StrativoMissions.renderModal();
                        }
                    }
                    return {
                        title: "Candle City Mission Headquarters",
                        icon: "fa-list-check",
                        badge: "ACTIVE MISSIONS",
                        message: "View your active daily objectives, progress milestones, and claim earned Strativo XP rewards.",
                        type: "INFO",
                        actionLabel: "Acknowledge"
                    };
                }
            }, collisionSystem);

            // H. ORBITAL HUB GATEWAY (South Warp Portal)
            const hubGateRect = new Rectangle(870, 740, 200, 150, "gate_return_hub", "solid");
            this.addBuilding({
                id: "gate_return_hub",
                rect: hubGateRect,
                name: "ORBITAL HUB GATEWAY",
                subtitle: "Return to World Hub",
                category: "GATEWAY_HUB",
                themeColor: "#00E5A8",
                accentColor: "#00F0FF",
                icon: "fa-globe",
                facadeStyle: "warp_portal_arch",
                windows: 0,
                interactPoint: { x: 970, y: 735 },
                interactRadius: 60,
                promptText: "Return to World Hub",
                onInteract: (player, core) => {
                    if (core) core.transitionTo("world-hub");
                    setTimeout(() => { window.location.href = "../hub.html"; }, 500);
                    return {
                        title: "Departing Candle City",
                        icon: "fa-globe",
                        message: "Returning to Strativo World Hub...",
                        type: "TRANSITION"
                    };
                }
            }, collisionSystem);

            // I. PIP DISTRICT GATEWAY (East Frontier)
            const pipGateRect = new Rectangle(1520, 420, 50, 150, "gate_pip_locked", "solid");
            this.addBuilding({
                id: "gate_pip_district",
                rect: pipGateRect,
                name: "PIP DISTRICT GATE",
                subtitle: "Locked • Lesson 3",
                category: "GATEWAY_LOCKED",
                themeColor: "#F43F5E",
                accentColor: "#F59E0B",
                icon: "fa-lock",
                facadeStyle: "security_gate",
                windows: 0,
                interactPoint: { x: 1500, y: 495 },
                interactRadius: 80,
                promptText: "Approach Pip Gate",
                onInteract: () => ({
                    title: "Pip District Gate (Locked)",
                    icon: "fa-lock",
                    badge: "REQUIRES LESSON 3",
                    message: "District 2 (Pip District) requires verified completion of Lesson 3: Understanding Pips, Lots, and Leverage in Strativo Academy.",
                    type: "LOCKED",
                    actionLabel: "Open Lesson 3",
                    actionUrl: "../../beginner.html#lesson3"
                })
            }, collisionSystem);

            // ==================================================================
            // 3. PHYSICAL IN-WORLD PATTERN EXHIBITS (Avenue Walkways)
            // ==================================================================
            const exhibitLocations = [
                { x: 470, y: 140, patternId: "hammer" },
                { x: 470, y: 475, patternId: "inverted_hammer" },
                { x: 1070, y: 140, patternId: "shooting_star" },
                { x: 1070, y: 475, patternId: "hanging_man" },
                { x: 470, y: 795, patternId: "bullish_engulfing" },
                { x: 1070, y: 795, patternId: "morning_star" }
            ];

            exhibitLocations.forEach((ex, idx) => {
                const pool = window.StrativoRPG.getPatterns ? window.StrativoRPG.getPatterns() : CANDLE_PATTERNS;
                const pattern = (pool && pool.length > 0) ? (pool.find(p => p.id === ex.patternId) || pool[idx % pool.length]) : null;
                if (!pattern) return;

                const r = new Rectangle(ex.x - 18, ex.y - 18, 36, 36, `exhibit_${pattern.id}`, "solid");
                const isBull = pattern.bias.includes("bullish");
                const isBear = pattern.bias.includes("bearish");
                const podColor = isBull ? "#00E5A8" : isBear ? "#F43F5E" : "#00F0FF";

                this.addObstacle(r, {
                    label: `Exhibit: ${pattern.name}`,
                    type: "pattern_pod",
                    color: "#0F172A",
                    borderColor: podColor
                }, collisionSystem);

                const interactNode = {
                    id: `trigger_exhibit_${pattern.id}`,
                    rect: new Rectangle(ex.x - 20, ex.y - 20, 40, 40, `trigger_ex_${pattern.id}`, "trigger"),
                    name: pattern.name.toUpperCase(),
                    category: "PATTERN_DISPLAY",
                    icon: "fa-chart-candlestick",
                    promptText: `Inspect ${pattern.name}`,
                    interactRadius: 75,
                    patternData: pattern,
                    onInteract: () => {
                        if (typeof window.StrativoRPG.recordPatternViewed === "function") {
                            window.StrativoRPG.recordPatternViewed(pattern.id);
                        }

                        if (this.activeDetectiveTarget && this.activeDetectiveTarget.id === pattern.id) {
                            this.detectiveCompletedCount++;
                            this._refreshDetectiveQuest();
                            if (typeof window.StrativoRPG.notifyDetectiveSuccess === "function") {
                                window.StrativoRPG.notifyDetectiveSuccess(pattern);
                            }
                        }

                        return {
                            title: pattern.name,
                            icon: "fa-chart-candlestick",
                            badge: pattern.bias.replace(/_/g, " ").toUpperCase(),
                            pattern: pattern,
                            type: "CANDLE_VIEWER",
                            actionLabel: "Understood"
                        };
                    }
                };

                this.interactiveObjects.push(interactNode);
                this.patternExhibits.push({ rect: r, pattern: pattern });
            });

            // Street Furniture & Environmental Props
            this.streetProps = [
                { type: "street_lamp", x: 245, y: 365, color: "#00F0FF" },
                { type: "street_lamp", x: 630, y: 365, color: "#00F0FF" },
                { type: "street_lamp", x: 970, y: 365, color: "#00F0FF" },
                { type: "street_lamp", x: 1355, y: 365, color: "#00F0FF" },
                { type: "street_lamp", x: 245, y: 575, color: "#00E5A8" },
                { type: "street_lamp", x: 630, y: 575, color: "#00E5A8" },
                { type: "street_lamp", x: 970, y: 575, color: "#00E5A8" },
                { type: "street_lamp", x: 1355, y: 575, color: "#00E5A8" },
                { type: "cyber_planter", x: 370, y: 365, color: "#00E5A8" },
                { type: "cyber_planter", x: 1230, y: 365, color: "#00E5A8" },
                { type: "cyber_planter", x: 370, y: 575, color: "#00E5A8" },
                { type: "cyber_planter", x: 1230, y: 575, color: "#00E5A8" },
                { type: "holo_ticker", x: 800, y: 315, text: "STRATIVO ACADEMY • CANDLE CITY 24/7 • MASTER PRICE ACTION", color: "#00F0FF" },
                { type: "holo_ticker", x: 800, y: 635, text: "DISCIPLINE > EMOTION • 1:2 R:R RATIO • NEVER RISK > 1%", color: "#00E5A8" },
                { type: "bench", x: 700, y: 365 },
                { type: "bench", x: 900, y: 365 },
                { type: "bench", x: 700, y: 585 },
                { type: "bench", x: 900, y: 585 }
            ];
        }

        addBuilding(data, collisionSystem) {
            this.buildingFootprints.push(data);

            if (collisionSystem) {
                collisionSystem.addCollider(data.rect);
            }

            const interactNode = {
                id: `trigger_${data.id}`,
                rect: new Rectangle(
                    data.interactPoint.x - 20,
                    data.interactPoint.y - 20,
                    40,
                    40,
                    `trigger_${data.id}`,
                    "trigger"
                ),
                name: data.name,
                category: data.category,
                icon: data.icon,
                promptText: data.promptText,
                interactRadius: data.interactRadius || 85,
                buildingRef: data,
                onInteract: data.onInteract
            };

            this.interactiveObjects.push(interactNode);
        }

        update(dt, playerPos) {
            super.update(dt);
            this.pulseTimer += dt;
            this.tickerScroll += dt * 45;
            if (this.npcManager) {
                this.npcManager.updateAll(dt, playerPos);
            }
        }

        render(ctx, camera, debugMode = false) {
            const visible = camera ? camera.getVisibleBounds() : this.bounds;

            ctx.fillStyle = "#02050D";
            ctx.fillRect(0, 0, this.width, this.height);

            this._renderSkylineBackground(ctx, visible);
            this._renderGroundAndRoadways(ctx, visible);
            this._renderCenterPlaza(ctx);
            this._renderBuildings(ctx);
            this._renderStreetProps(ctx, visible);
            this._renderPatternPods(ctx);
            this._renderEntrancePads(ctx);

            if (this.npcManager) {
                this.npcManager.renderAll(ctx, camera);
            }

            this._renderPerimeterFortification(ctx);

            if (debugMode) {
                this._renderDebugColliders(ctx);
            }
        }

        /* ------------------------------------------------------------------
           ATMOSPHERIC CYBERPUNK SKYLINE (Background Horizons)
           ------------------------------------------------------------------ */
        _renderSkylineBackground(ctx, visible) {
            ctx.save();
            const glowEnabled = window.StrativoWorldGraphics ? window.StrativoWorldGraphics.isGraphicsEffectEnabled("glow") : true;

            // Distant skyline buildings along top perimeter
            const towers = [
                { x: 60, w: 120, h: 48, col: "#060D1E" },
                { x: 220, w: 90, h: 54, col: "#091326" },
                { x: 340, w: 140, h: 42, col: "#060D1E" },
                { x: 520, w: 100, h: 58, col: "#0A1730" },
                { x: 660, w: 160, h: 50, col: "#060D1E" },
                { x: 860, w: 120, h: 56, col: "#091326" },
                { x: 1020, w: 150, h: 46, col: "#060D1E" },
                { x: 1210, w: 110, h: 58, col: "#0A1730" },
                { x: 1360, w: 160, h: 44, col: "#060D1E" }
            ];

            towers.forEach(t => {
                ctx.fillStyle = t.col;
                ctx.fillRect(t.x, 0, t.w, t.h);

                // Spire beacon
                ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(t.x + t.w / 2, t.h);
                ctx.lineTo(t.x + t.w / 2, 8);
                ctx.stroke();

                ctx.fillStyle = "#00F0FF";
                ctx.beginPath();
                ctx.arc(t.x + t.w / 2, 8, 2, 0, Math.PI * 2);
                ctx.fill();

                // Window slit lights
                ctx.fillStyle = "rgba(0, 240, 255, 0.15)";
                for (let wx = t.x + 12; wx < t.x + t.w - 12; wx += 16) {
                    ctx.fillRect(wx, 16, 4, 18);
                }
            });

            // Atmospheric sky gradient
            const skyGrad = ctx.createLinearGradient(0, 0, 0, 70);
            skyGrad.addColorStop(0, "rgba(0, 240, 255, 0.08)");
            skyGrad.addColorStop(1, "rgba(2, 5, 13, 0)");
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, this.width, 70);

            ctx.restore();
        }

        /* ------------------------------------------------------------------
           GROUND, ROADS & SIDEWALKS (Grid Pavement & Crossings)
           ------------------------------------------------------------------ */
        _renderGroundAndRoadways(ctx, visible) {
            ctx.save();

            // 1. Base District Ground
            ctx.fillStyle = "#030712";
            ctx.fillRect(36, 36, this.width - 72, this.height - 72);

            // Subtle tile grid texture
            ctx.strokeStyle = "rgba(15, 23, 42, 0.5)";
            ctx.lineWidth = 1;
            for (let x = 40; x < this.width - 40; x += 40) {
                ctx.beginPath(); ctx.moveTo(x, 40); ctx.lineTo(x, this.height - 40); ctx.stroke();
            }
            for (let y = 40; y < this.height - 40; y += 40) {
                ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(this.width - 40, y); ctx.stroke();
            }

            // 2. Paved Sidewalk Zones (Raised Kerb Plates)
            ctx.fillStyle = "#0B1426";
            ctx.strokeStyle = "#1E293B";
            ctx.lineWidth = 1.5;

            // North & South Sidewalk Belts
            ctx.fillRect(40, 250, 1520, 130);
            ctx.strokeRect(40, 250, 1520, 130);
            ctx.fillRect(40, 570, 1520, 130);
            ctx.strokeRect(40, 570, 1520, 130);

            // Vertical Avenue Sidewalk Belts
            ctx.fillRect(410, 40, 120, 920);
            ctx.strokeRect(410, 40, 120, 920);
            ctx.fillRect(1070, 40, 120, 920);
            ctx.strokeRect(1070, 40, 120, 920);
            ctx.fillRect(730, 40, 140, 920);
            ctx.strokeRect(730, 40, 140, 920);

            // 3. Paved Asphalt Roadways
            ctx.fillStyle = "#060C1A";
            // North & South Boulevards
            ctx.fillRect(40, 270, 1520, 90);
            ctx.fillRect(40, 590, 1520, 90);
            // West, East & Center Roads
            ctx.fillRect(430, 40, 80, 920);
            ctx.fillRect(1090, 40, 80, 920);
            ctx.fillRect(750, 40, 100, 920);

            // Kerb edge lines
            ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";
            ctx.lineWidth = 1.5;
            // North Blvd edges
            ctx.beginPath();
            ctx.moveTo(40, 270); ctx.lineTo(1560, 270);
            ctx.moveTo(40, 360); ctx.lineTo(1560, 360);
            // South Blvd edges
            ctx.moveTo(40, 590); ctx.lineTo(1560, 590);
            ctx.moveTo(40, 680); ctx.lineTo(1560, 680);
            ctx.stroke();

            // 4. Center Dashed Lane Divider Stripes
            ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
            ctx.lineWidth = 2;
            ctx.setLineDash([14, 18]);
            ctx.beginPath();
            // North Blvd divider
            ctx.moveTo(40, 315); ctx.lineTo(1560, 315);
            // South Blvd divider
            ctx.moveTo(40, 635); ctx.lineTo(1560, 635);
            // Center Spine divider
            ctx.moveTo(800, 40); ctx.lineTo(800, 960);
            ctx.stroke();
            ctx.setLineDash([]);

            // 5. Pedestrian Zebra Crosswalks at Intersections
            const zebraCrossings = [
                { x: 430, y: 270, w: 80, h: 90 },
                { x: 1090, y: 270, w: 80, h: 90 },
                { x: 430, y: 590, w: 80, h: 90 },
                { x: 1090, y: 590, w: 80, h: 90 },
                { x: 750, y: 270, w: 100, h: 90 },
                { x: 750, y: 590, w: 100, h: 90 }
            ];

            ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
            zebraCrossings.forEach(z => {
                for (let sx = z.x + 6; sx < z.x + z.w - 6; sx += 14) {
                    ctx.fillRect(sx, z.y + 4, 7, z.h - 8);
                }
            });

            // 6. Glowing Wayfinding Arrows & Road Markings
            ctx.fillStyle = "rgba(0, 229, 168, 0.35)";
            ctx.font = "bold 9px 'Inter', sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("◄ ARCHIVE", 320, 318);
            ctx.fillText("BLITZ ARENA ►", 980, 318);
            ctx.fillText("◄ MISTAKE LAB", 320, 638);
            ctx.fillText("RANGE ►", 980, 638);

            ctx.restore();
        }

        /* ------------------------------------------------------------------
           CENTRAL CANDLE CITY PLAZA & CANDLESTICK MONUMENT
           ------------------------------------------------------------------ */
        _renderCenterPlaza(ctx) {
            ctx.save();
            const cx = 800;
            const cy = 475;
            const glowEnabled = window.StrativoWorldGraphics ? window.StrativoWorldGraphics.isGraphicsEffectEnabled("glow") : true;
            const reducedMotion = window.StrativoWorldGraphics ? window.StrativoWorldGraphics.isReducedMotion() : false;
            const pulse = reducedMotion ? 0.6 : (0.5 + Math.sin(this.pulseTimer * 2.8) * 0.25);
            const rot = reducedMotion ? 0 : this.pulseTimer * 0.4;

            // Grand Plaza Dais Base
            const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 140);
            grad.addColorStop(0, "rgba(0, 240, 255, 0.22)");
            grad.addColorStop(0.5, "rgba(0, 229, 168, 0.1)");
            grad.addColorStop(1, "rgba(2, 5, 13, 0)");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(cx, cy, 140, 0, Math.PI * 2);
            ctx.fill();

            // Outer Plaza Stepped Ring
            ctx.strokeStyle = `rgba(0, 240, 255, ${pulse * 0.75})`;
            ctx.lineWidth = 2.5;
            ctx.shadowColor = "#00F0FF";
            ctx.shadowBlur = glowEnabled ? 12 : 0;
            ctx.beginPath();
            ctx.arc(cx, cy, 115, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Inner Dais Ring
            ctx.fillStyle = "#0A1428";
            ctx.strokeStyle = "rgba(0, 229, 168, 0.6)";
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(cx, cy, 75, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Geometric Plaza Quadrants
            ctx.strokeStyle = "rgba(0, 240, 255, 0.2)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx - 75, cy); ctx.lineTo(cx + 75, cy);
            ctx.moveTo(cx, cy - 75); ctx.lineTo(cx, cy + 75);
            ctx.stroke();

            // 2.5D Rotating Holographic Candlestick Obelisk
            ctx.save();
            ctx.translate(cx, cy);

            // Bullish Green Candle (Left)
            ctx.fillStyle = "rgba(0, 229, 168, 0.85)";
            ctx.strokeStyle = "#00E5A8";
            ctx.lineWidth = 2;
            ctx.shadowColor = "#00E5A8";
            ctx.shadowBlur = glowEnabled ? 10 : 0;
            ctx.fillRect(-26, -26, 18, 52);
            ctx.strokeRect(-26, -26, 18, 52);
            ctx.beginPath();
            ctx.moveTo(-17, -42); ctx.lineTo(-17, -26);
            ctx.moveTo(-17, 26); ctx.lineTo(-17, 42);
            ctx.stroke();

            // Bearish Red Candle (Right)
            ctx.fillStyle = "rgba(244, 63, 94, 0.85)";
            ctx.strokeStyle = "#F43F5E";
            ctx.lineWidth = 2;
            ctx.shadowColor = "#F43F5E";
            ctx.shadowBlur = glowEnabled ? 10 : 0;
            ctx.fillRect(8, -18, 18, 38);
            ctx.strokeRect(8, -18, 18, 38);
            ctx.beginPath();
            ctx.moveTo(17, -34); ctx.lineTo(17, -18);
            ctx.moveTo(17, 20); ctx.lineTo(17, 34);
            ctx.stroke();
            ctx.shadowBlur = 0;

            ctx.restore();

            // Plaza Label Plaque
            ctx.fillStyle = "rgba(3, 7, 18, 0.9)";
            ctx.strokeStyle = "#FCD34D";
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.roundRect(cx - 85, cy + 82, 170, 22, 6);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#F8FAFC";
            ctx.font = "800 9.5px 'Inter', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("CANDLE CITY PLAZA", cx, cy + 93);

            ctx.restore();
        }

        /* ------------------------------------------------------------------
           2.5D REAL RPG BUILDINGS (Facades, Windows, Roof Structures & Doors)
           ------------------------------------------------------------------ */
        _renderBuildings(ctx) {
            ctx.save();
            const glowEnabled = window.StrativoWorldGraphics ? window.StrativoWorldGraphics.isGraphicsEffectEnabled("glow") : true;

            for (let i = 0; i < this.buildingFootprints.length; i++) {
                const b = this.buildingFootprints[i];
                const r = b.rect;
                const theme = b.themeColor || "#00F0FF";
                const accent = b.accentColor || "#00E5A8";

                // 1. Building Cast Shadow
                ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
                ctx.beginPath();
                ctx.roundRect(r.x + 8, r.y + 12, r.width, r.height, 12);
                ctx.fill();

                // 2. Lower Facade Wall (2.5D Depth Drop)
                ctx.fillStyle = "#080F1E";
                ctx.strokeStyle = "#1E293B";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(r.x, r.y + 16, r.width, r.height - 16, 10);
                ctx.fill();
                ctx.stroke();

                // 3. Facade Windows with Interior Lighting
                const winCount = b.windows || 6;
                const winW = (r.width - 40) / winCount - 8;
                const winH = 22;
                const winY = r.y + r.height - 40;

                ctx.fillStyle = "rgba(10, 25, 48, 0.9)";
                for (let w = 0; w < winCount; w++) {
                    const winX = r.x + 20 + w * (winW + 8);
                    ctx.fillRect(winX, winY, winW, winH);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${0.2 + (w % 2) * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.strokeRect(winX, winY, winW, winH);

                    // Interior glow pane
                    ctx.fillStyle = `${theme}33`;
                    ctx.fillRect(winX + 2, winY + 2, winW - 4, winH - 4);
                }

                // 4. Physical Entrance Door Alcove
                if (b.interactPoint) {
                    const doorW = 44;
                    const doorH = 34;
                    const doorX = b.interactPoint.x - doorW / 2;
                    const doorY = r.y + r.height - doorH;

                    // Recessed doorway
                    ctx.fillStyle = "#030712";
                    ctx.strokeStyle = theme;
                    ctx.lineWidth = 1.5;
                    ctx.fillRect(doorX, doorY, doorW, doorH);
                    ctx.strokeRect(doorX, doorY, doorW, doorH);

                    // Glowing entrance transom beam
                    ctx.fillStyle = theme;
                    ctx.fillRect(doorX, doorY - 3, doorW, 3);
                }

                // 5. Main Roof Deck Plate
                ctx.fillStyle = "#0D1829";
                ctx.strokeStyle = theme;
                ctx.lineWidth = 2;
                ctx.shadowColor = theme;
                ctx.shadowBlur = glowEnabled ? (b.category === "ARENA" ? 16 : 8) : 0;

                ctx.beginPath();
                ctx.roundRect(r.x, r.y, r.width, r.height - 24, 10);
                ctx.fill();
                ctx.stroke();
                ctx.shadowBlur = 0;

                // 6. Rooftop Architectural Props by Facade Style
                this._renderRooftopProps(ctx, b, r, theme, accent);

                // 7. Facade Marquee Signboard & Title
                const bannerW = Math.min(r.width * 0.82, 320);
                const bannerH = 36;
                const bannerX = r.centerX - bannerW / 2;
                const bannerY = r.y + 20;

                ctx.fillStyle = "rgba(3, 7, 18, 0.94)";
                ctx.strokeStyle = theme;
                ctx.lineWidth = 1.4;
                ctx.beginPath();
                ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 6);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = "#FFFFFF";
                ctx.font = `800 ${b.category === "ARENA" ? "13px" : "11.5px"} 'Inter', sans-serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(b.name, r.centerX, bannerY + 12);

                ctx.fillStyle = accent;
                ctx.font = "bold 8px 'Inter', sans-serif";
                ctx.fillText(b.subtitle.toUpperCase(), r.centerX, bannerY + 25);
            }
            ctx.restore();
        }

        /* ------------------------------------------------------------------
           SPECIALIZED ROOFTOP ARCHITECTURE & 3D PROPS
           ------------------------------------------------------------------ */
        _renderRooftopProps(ctx, b, r, theme, accent) {
            ctx.save();
            const glowEnabled = window.StrativoWorldGraphics ? window.StrativoWorldGraphics.isGraphicsEffectEnabled("glow") : true;

            if (b.id === "candle_archive") {
                // Neoclassical Cyber Columns & Book Hologram
                ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
                ctx.strokeStyle = "#38BDF8";
                ctx.lineWidth = 1.2;
                for (let cx = r.x + 30; cx < r.x + r.width - 30; cx += 50) {
                    ctx.fillRect(cx, r.y + 65, 14, 45);
                    ctx.strokeRect(cx, r.y + 65, 14, 45);
                }
            } else if (b.id === "candle_blitz_arena") {
                // Stadium Floodlight Towers & Target Array
                const pylons = [
                    { x: r.x + 25, y: r.y + 25 },
                    { x: r.x + r.width - 25, y: r.y + 25 },
                    { x: r.x + 25, y: r.y + r.height - 45 },
                    { x: r.x + r.width - 25, y: r.y + r.height - 45 }
                ];
                pylons.forEach(p => {
                    ctx.fillStyle = "#00F0FF";
                    ctx.shadowColor = "#00F0FF";
                    ctx.shadowBlur = glowEnabled ? 8 : 0;
                    ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill();
                    ctx.shadowBlur = 0;
                });

                // Arena Target Matrix Ring
                ctx.strokeStyle = "rgba(0, 240, 255, 0.35)";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(r.centerX, r.y + 90, 28, 0, Math.PI * 2);
                ctx.stroke();
            } else if (b.id === "candle_lab") {
                // Biotech Cleanroom Domes & OHLC Energy Channels
                ctx.fillStyle = "rgba(0, 229, 168, 0.3)";
                ctx.strokeStyle = "#00E5A8";
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.arc(r.centerX - 50, r.y + 85, 20, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.arc(r.centerX + 50, r.y + 85, 20, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            } else if (b.id === "context_chamber") {
                // Observatory Dome & Radar Dish
                ctx.fillStyle = "rgba(168, 85, 247, 0.3)";
                ctx.strokeStyle = "#A855F7";
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.arc(r.centerX, r.y + 85, 26, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            } else if (b.id === "mistake_lab") {
                // Hazard Chevrons & Warning Beacon
                ctx.fillStyle = "rgba(244, 63, 94, 0.4)";
                ctx.strokeStyle = "#F43F5E";
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.arc(r.centerX, r.y + 85, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            } else if (b.id === "gate_return_hub") {
                // Grand Orbital Warp Portal Vortex
                const pulse = 0.5 + Math.sin(this.pulseTimer * 3.5) * 0.3;
                ctx.strokeStyle = `rgba(0, 229, 168, ${pulse})`;
                ctx.lineWidth = 2.5;
                ctx.shadowColor = "#00E5A8";
                ctx.shadowBlur = glowEnabled ? 12 : 0;
                ctx.beginPath();
                ctx.arc(r.centerX, r.y + 70, 32, 0, Math.PI * 2);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }

            ctx.restore();
        }

        /* ------------------------------------------------------------------
           STREET FURNITURE & ENVIRONMENTAL PROPS
           ------------------------------------------------------------------ */
        _renderStreetProps(ctx, visible) {
            ctx.save();
            const glowEnabled = window.StrativoWorldGraphics ? window.StrativoWorldGraphics.isGraphicsEffectEnabled("glow") : true;

            for (let i = 0; i < this.streetProps.length; i++) {
                const prop = this.streetProps[i];

                if (prop.type === "street_lamp") {
                    // Radial Ground Light Cone
                    const lightGrad = ctx.createRadialGradient(prop.x, prop.y, 4, prop.x, prop.y, 38);
                    lightGrad.addColorStop(0, `${prop.color}44`);
                    lightGrad.addColorStop(1, "rgba(2, 5, 13, 0)");
                    ctx.fillStyle = lightGrad;
                    ctx.beginPath();
                    ctx.arc(prop.x, prop.y, 38, 0, Math.PI * 2);
                    ctx.fill();

                    // Metal Post & Head
                    ctx.fillStyle = "#1E293B";
                    ctx.fillRect(prop.x - 3, prop.y - 14, 6, 14);
                    ctx.fillStyle = prop.color;
                    ctx.beginPath();
                    ctx.arc(prop.x, prop.y - 14, 4, 0, Math.PI * 2);
                    ctx.fill();
                } else if (prop.type === "cyber_planter") {
                    // Planter Base
                    ctx.fillStyle = "#0F172A";
                    ctx.strokeStyle = prop.color;
                    ctx.lineWidth = 1.2;
                    ctx.fillRect(prop.x - 12, prop.y - 8, 24, 16);
                    ctx.strokeRect(prop.x - 12, prop.y - 8, 24, 16);

                    // Bioluminescent Shrub
                    ctx.fillStyle = prop.color;
                    ctx.beginPath();
                    ctx.arc(prop.x, prop.y - 12, 7, 0, Math.PI * 2);
                    ctx.fill();
                } else if (prop.type === "bench") {
                    ctx.fillStyle = "#0F172A";
                    ctx.strokeStyle = "#334155";
                    ctx.lineWidth = 1.2;
                    ctx.fillRect(prop.x - 16, prop.y - 6, 32, 12);
                    ctx.strokeRect(prop.x - 16, prop.y - 6, 32, 12);
                } else if (prop.type === "holo_ticker") {
                    // Scrolling Text Billboard
                    ctx.fillStyle = "rgba(3, 7, 18, 0.9)";
                    ctx.strokeStyle = prop.color;
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.roundRect(prop.x - 180, prop.y - 12, 360, 24, 6);
                    ctx.fill();
                    ctx.stroke();

                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(prop.x - 175, prop.y - 10, 350, 20);
                    ctx.clip();

                    ctx.fillStyle = prop.color;
                    ctx.font = "bold 9px 'Inter', sans-serif";
                    ctx.textAlign = "center";
                    ctx.fillText(prop.text, prop.x, prop.y + 4);
                    ctx.restore();
                }
            }
            ctx.restore();
        }

        /* ------------------------------------------------------------------
           IN-WORLD PATTERN PODS (2.5D Pedestals)
           ------------------------------------------------------------------ */
        _renderPatternPods(ctx) {
            ctx.save();
            const glowEnabled = window.StrativoWorldGraphics ? window.StrativoWorldGraphics.isGraphicsEffectEnabled("glow") : true;

            for (let i = 0; i < this.patternExhibits.length; i++) {
                const ex = this.patternExhibits[i];
                const r = ex.rect;
                const p = ex.pattern;
                if (!p) continue;
                const color = p.bias.includes("bullish") ? "#00E5A8" : p.bias.includes("bearish") ? "#F43F5E" : "#00F0FF";

                // Pedestal Base
                ctx.fillStyle = "#0B1426";
                ctx.strokeStyle = color;
                ctx.lineWidth = 1.5;
                ctx.shadowColor = color;
                ctx.shadowBlur = glowEnabled ? 6 : 0;
                ctx.beginPath();
                ctx.roundRect(r.x, r.y, r.width, r.height, 6);
                ctx.fill();
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Candle Hologram
                ctx.fillStyle = color;
                ctx.fillRect(r.centerX - 4, r.centerY - 7, 8, 14);
                ctx.beginPath();
                ctx.moveTo(r.centerX, r.centerY - 12); ctx.lineTo(r.centerX, r.centerY - 7);
                ctx.moveTo(r.centerX, r.centerY + 7); ctx.lineTo(r.centerX, r.centerY + 12);
                ctx.stroke();

                // Name Tag
                ctx.fillStyle = "#F8FAFC";
                ctx.font = "bold 8.5px 'Inter', sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(p.name, r.centerX, r.y - 6);
            }
            ctx.restore();
        }

        /* ------------------------------------------------------------------
           ELEGANT ENTRANCE PADS & ACTION CUES (Replacing giant floating rings)
           ------------------------------------------------------------------ */
        _renderEntrancePads(ctx) {
            ctx.save();
            const glowEnabled = window.StrativoWorldGraphics ? window.StrativoWorldGraphics.isGraphicsEffectEnabled("glow") : true;
            const reducedMotion = window.StrativoWorldGraphics ? window.StrativoWorldGraphics.isReducedMotion() : false;
            const pulse = reducedMotion ? 0.6 : (0.5 + Math.sin(this.pulseTimer * 3.2) * 0.3);

            for (let i = 0; i < this.interactiveObjects.length; i++) {
                const obj = this.interactiveObjects[i];
                if (obj.category === "NPC_TALK") continue; // NPCs render their own indicators

                const color = obj.category === "GATEWAY_LOCKED"
                    ? "#F43F5E"
                    : obj.category === "ARENA"
                        ? "#00F0FF"
                        : obj.category === "PATTERN_DISPLAY"
                            ? "#FCD34D"
                            : "#00E5A8";

                // Glowing Entrance Floor Mat
                ctx.fillStyle = `${color}22`;
                ctx.strokeStyle = `rgba(0, 240, 255, ${pulse * 0.6})`;
                ctx.lineWidth = 1.5;
                ctx.shadowColor = color;
                ctx.shadowBlur = glowEnabled ? 8 : 0;

                ctx.beginPath();
                ctx.roundRect(obj.rect.centerX - 18, obj.rect.centerY - 10, 36, 20, 4);
                ctx.fill();
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Directional Chevron
                ctx.strokeStyle = color;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(obj.rect.centerX - 6, obj.rect.centerY + 3);
                ctx.lineTo(obj.rect.centerX, obj.rect.centerY - 3);
                ctx.lineTo(obj.rect.centerX + 6, obj.rect.centerY + 3);
                ctx.stroke();
            }
            ctx.restore();
        }

        /* ------------------------------------------------------------------
           PERIMETER FORTIFICATION WALLS & BASTIONS
           ------------------------------------------------------------------ */
        _renderPerimeterFortification(ctx) {
            ctx.save();
            const wallThick = 36;
            const glowEnabled = window.StrativoWorldGraphics ? window.StrativoWorldGraphics.isGraphicsEffectEnabled("glow") : true;

            // Heavy Metallic Outer Border
            ctx.fillStyle = "#070E1C";
            ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
            ctx.lineWidth = 2.5;
            ctx.shadowColor = "#00F0FF";
            ctx.shadowBlur = glowEnabled ? 10 : 0;
            ctx.strokeRect(wallThick, wallThick, this.width - wallThick * 2, this.height - wallThick * 2);
            ctx.shadowBlur = 0;

            // Corner Bastion Guard Towers
            const corners = [
                { x: wallThick, y: wallThick },
                { x: this.width - wallThick, y: wallThick },
                { x: wallThick, y: this.height - wallThick },
                { x: this.width - wallThick, y: this.height - wallThick }
            ];

            corners.forEach(c => {
                ctx.fillStyle = "#0B162C";
                ctx.strokeStyle = "#00F0FF";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(c.x, c.y, 22, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = "#00E5A8";
                ctx.beginPath();
                ctx.arc(c.x, c.y, 6, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.restore();
        }
    }

    /* ======================================================================
       CANDLE BLITZ 10-ROUND FAST REACTION GAME ENGINE (PHASE 2.3)
       ====================================================================== */
    class CandleBlitzGame {
        constructor() {
            this.active = false;
            this.currentRound = 0;
            this.totalRounds = 10;
            this.score = 0;
            this.combo = 0;
            this.maxCombo = 0;
            this.correctCount = 0;
            this.incorrectCount = 0;
            this.reactionTimes = [];
            this.patternResults = [];
            this.roundStartTime = 0;
            this.currentQuestion = null;
            this.currentDifficulty = "beginner";
            this.isAnswered = false;
            this.rewardAwarded = false;
            this.countdownTimer = null;
        }

        start() {
            this.active = true;
            this.currentRound = 0;
            this.score = 0;
            this.combo = 0;
            this.maxCombo = 0;
            this.correctCount = 0;
            this.incorrectCount = 0;
            this.reactionTimes = [];
            this.patternResults = [];
            this.rewardAwarded = false;
            this.isAnswered = false;

            if (typeof window.StrativoRPG.triggerBlitzCountdown === "function") {
                window.StrativoRPG.triggerBlitzCountdown(() => {
                    this.nextRound();
                });
            } else {
                this.nextRound();
            }
        }

        nextRound() {
            if (this.currentRound >= this.totalRounds) {
                this.finish();
                return;
            }

            this.currentRound++;
            this.isAnswered = false;

            const pool = window.StrativoRPG.getPatterns ? window.StrativoRPG.getPatterns() : CANDLE_PATTERNS;
            if (!pool || pool.length === 0) return;

            let tierPatterns = [];
            if (this.currentRound <= 3) {
                this.currentDifficulty = "beginner";
                tierPatterns = pool.filter(p => p.difficulty === "beginner");
            } else if (this.currentRound <= 7) {
                this.currentDifficulty = "intermediate";
                tierPatterns = pool.filter(p => p.difficulty === "intermediate" || p.category === "double" || p.category === "triple");
            } else {
                this.currentDifficulty = "advanced";
                tierPatterns = pool.filter(p => p.difficulty === "advanced" || p.category === "multi" || p.candleCount >= 3);
            }

            if (tierPatterns.length === 0) tierPatterns = pool;

            const target = tierPatterns[Math.floor(Math.random() * tierPatterns.length)];

            let distractors = pool.filter(p => p.id !== target.id && p.category === target.category);
            if (distractors.length < 3) {
                distractors = pool.filter(p => p.id !== target.id);
            }
            distractors = distractors.sort(() => 0.5 - Math.random()).slice(0, 3);

            const options = [target, ...distractors].sort(() => 0.5 - Math.random());

            this.currentQuestion = {
                target: target,
                options: options,
                difficulty: this.currentDifficulty
            };

            this.roundStartTime = Date.now();
            window.StrativoRPG.emitGameEvent("targetAim", { round: this.currentRound, target: target.name });

            if (typeof window.StrativoRPG.renderBlitzRoundUI === "function") {
                window.StrativoRPG.renderBlitzRoundUI(this);
            }
        }

        submitAnswer(selectedId, immediate = false) {
            if (this.isAnswered) return; // Anti-spam lock
            this.isAnswered = true;

            const reactionTime = Date.now() - this.roundStartTime;
            this.reactionTimes.push(reactionTime);

            const isCorrect = selectedId === this.currentQuestion.target.id;
            const target = this.currentQuestion.target;

            this.patternResults.push({
                id: target.id,
                name: target.name,
                correct: isCorrect
            });

            window.StrativoRPG.emitGameEvent("targetSelect", { selectedId, isCorrect });

            if (isCorrect) {
                this.correctCount++;
                this.combo++;
                if (this.combo > this.maxCombo) this.maxCombo = this.combo;

                const speedBonus = Math.max(0, Math.min(60, Math.floor((3500 - reactionTime) / 35)));
                const comboBonus = (this.combo - 1) * 25;
                const roundPoints = 100 + comboBonus + speedBonus;
                this.score += roundPoints;

                window.StrativoRPG.emitGameEvent("correctHit", { points: roundPoints, combo: this.combo, speed: reactionTime });
                if (this.combo > 1) {
                    window.StrativoRPG.emitGameEvent("comboUp", { combo: this.combo });
                }

                if (typeof window.StrativoRPG.showBlitzFeedback === "function") {
                    window.StrativoRPG.showBlitzFeedback(
                        true,
                        `CORRECT HIT! ${target.name} (+${roundPoints} pts)`,
                        target.anatomy,
                        target.context,
                        target.recognitionTips ? target.recognitionTips[0] : ""
                    );
                }
            } else {
                this.incorrectCount++;
                this.combo = 0;
                window.StrativoRPG.emitGameEvent("wrongHit", { target: target.name });

                if (typeof window.StrativoRPG.showBlitzFeedback === "function") {
                    window.StrativoRPG.showBlitzFeedback(
                        false,
                        `INCORRECT! This is a ${target.name}`,
                        target.anatomy,
                        target.context,
                        target.commonMistake || "Watch out for trend context and body proportion."
                    );
                }
            }

            if (immediate) {
                if (this.active) this.nextRound();
            } else {
                setTimeout(() => {
                    if (this.active) {
                        this.nextRound();
                    }
                }, 2200);
            }
        }

        finish() {
            this.active = false;
            const avgSpeed = this.reactionTimes.length > 0
                ? Math.round(this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length)
                : 0;

            const accuracy = Math.round((this.correctCount / this.totalRounds) * 100);

            let grade = "C";
            if (accuracy >= 90 && avgSpeed < 2000) grade = "S";
            else if (accuracy >= 80) grade = "A";
            else if (accuracy >= 60) grade = "B";

            let xpGained = 0;
            let newMastery = 0;
            let newAchievements = [];

            // Safe Single-Transaction Idempotent Match Processing
            if (!this.rewardAwarded) {
                this.rewardAwarded = true;
                const matchId = `blitz_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

                if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.recordCandleBlitzResult === "function") {
                    const res = window.StrativoWorldXPEngine.recordCandleBlitzResult({
                        matchId: matchId,
                        score: this.score,
                        accuracy: accuracy,
                        avgReactionMs: avgSpeed,
                        bestCombo: this.maxCombo,
                        correctCount: this.correctCount,
                        incorrectCount: this.incorrectCount,
                        totalRounds: this.totalRounds,
                        grade: grade,
                        patternResults: this.patternResults
                    });

                    if (res) {
                        xpGained = res.xpGained || 0;
                        newMastery = res.newMastery || 0;
                        newAchievements = res.newAchievements || [];
                    }
                }
            }

            window.StrativoRPG.emitGameEvent("matchComplete", { grade, score: this.score, accuracy, xpGained });

            if (typeof window.StrativoRPG.renderBlitzScorecardUI === "function") {
                window.StrativoRPG.renderBlitzScorecardUI({
                    score: this.score,
                    accuracy: accuracy,
                    avgSpeed: avgSpeed,
                    maxCombo: this.maxCombo,
                    correctCount: this.correctCount,
                    incorrectCount: this.incorrectCount,
                    grade: grade,
                    xpGained: xpGained,
                    newMastery: newMastery,
                    newAchievements: newAchievements
                });
            }
        }
    }

    // Pattern Viewing & Progress Tracking API
    window.StrativoRPG.recordPatternViewed = (patternId) => {
        if (!patternId) return;
        window.StrativoRPG.emitGameEvent("candleViewed", { patternId });
        if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.recordPatternView === "function") {
            return window.StrativoWorldXPEngine.recordPatternView(patternId);
        }
    };

    window.StrativoRPG.getCandleCityStats = () => {
        const state = window.StrativoWorldState ? window.StrativoWorldState.get() : null;
        if (!state) {
            return {
                viewedCount: 0,
                totalPatterns: 44,
                recognitionAccuracy: 0,
                bestCombo: 0,
                candleMastery: 0,
                streak: 0
            };
        }

        const viewedCount = (state.viewedPatterns || []).length;
        const totalPatterns = 44;
        const attempts = state.blitzStats ? (state.blitzStats.totalAttempts || 0) : 0;
        const correct = state.blitzStats ? (state.blitzStats.totalCorrect || 0) : 0;
        const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
        const bestCombo = state.blitzStats ? (state.blitzStats.bestCombo || 0) : 0;
        const candleMastery = state.mastery ? (state.mastery.candlesticks || 0) : 0;
        const streak = state.streak || 0;

        return {
            viewedCount,
            totalPatterns,
            recognitionAccuracy: accuracy,
            bestCombo,
            candleMastery,
            streak
        };
    };

    // Expose Classes, Getters & Global Helpers
    window.StrativoRPG.setPatterns = (p) => {
        if (Array.isArray(p) && p.length > 0) {
            CANDLE_PATTERNS = p;
            window.StrativoRPG.CandlePatterns = p;
        }
    };
    window.StrativoRPG.CandlePatterns = CANDLE_PATTERNS;
    window.StrativoRPG.getPatterns = () => (window.StrativoRPG.CandlePatterns && window.StrativoRPG.CandlePatterns.length > 0 ? window.StrativoRPG.CandlePatterns : CANDLE_PATTERNS);

    window.StrativoRPG.filterPatterns = (query = "", category = "all", difficulty = "all", bias = "all") => {
        const pool = window.StrativoRPG.getPatterns();
        const q = (query || "").trim().toLowerCase();

        return pool.filter(p => {
            const matchesQuery = !q ||
                p.name.toLowerCase().includes(q) ||
                (p.id && p.id.toLowerCase().includes(q)) ||
                (p.aliases && p.aliases.some(a => a.toLowerCase().includes(q))) ||
                (p.learningTags && p.learningTags.some(t => t.toLowerCase().includes(q))) ||
                (p.summary && p.summary.toLowerCase().includes(q));

            let matchesCat = true;
            if (category && category !== "all") {
                const cat = category.toLowerCase();
                if (cat === "single") matchesCat = p.category === "single" || p.candleCount === 1;
                else if (cat === "double" || cat === "two" || cat === "two-candle") matchesCat = p.category === "double" || p.candleCount === 2;
                else if (cat === "triple" || cat === "three" || cat === "three-candle") matchesCat = p.category === "triple" || p.candleCount === 3;
                else if (cat === "multi" || cat === "multi-candle") matchesCat = p.category === "multi" || p.candleCount > 3;
                else if (cat === "reversal") matchesCat = p.bias.includes("reversal") || (p.learningTags && p.learningTags.includes("reversal"));
                else if (cat === "continuation") matchesCat = p.bias.includes("continuation") || (p.learningTags && p.learningTags.includes("continuation"));
                else if (cat === "indecision" || cat === "neutral") matchesCat = p.bias.includes("neutral") || p.bias.includes("indecision") || (p.learningTags && p.learningTags.includes("indecision"));
                else matchesCat = p.category === cat || (p.learningTags && p.learningTags.includes(cat));
            }

            const matchesDiff = difficulty === "all" || p.difficulty === difficulty;
            const matchesBias = bias === "all" || p.bias.toLowerCase().includes(bias.toLowerCase());

            return matchesQuery && matchesCat && matchesDiff && matchesBias;
        });
    };

    window.StrativoRPG.CandleCityWorld = CandleCityWorld;
    window.StrativoRPG.CandleBlitzEngine = new CandleBlitzGame();
    window.StrativoRPG.loadCandlesticksDataset = loadCandlesticksDataset;

})();
