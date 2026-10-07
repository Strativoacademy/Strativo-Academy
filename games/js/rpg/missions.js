/* ==========================================================================
   STRATIVO WORLD — REUSABLE MISSION & QUEST ENGINE (PHASE 2.6)
   Namespace: window.StrativoRPG.MissionEngine (alias StrativoWorldMissions)
   Description:
   - Canonical mission dataset ingestion (games/data/missions.json)
   - Real progression tracking based exclusively on genuine player actions
   - Idempotent reward transactions (single-claim guarantee)
   - Active tracked mission for in-world HUD
   - NPC interaction dialogue routing with audio & haptic feedback
   ========================================================================== */

"use strict";

(function () {
    window.StrativoRPG = window.StrativoRPG || {};

    const DEFAULT_MISSIONS = [
        {
            id: "first_light",
            title: "First Light",
            giver: "mentor_kael",
            giverName: "Candle Mentor Kael",
            description: "Inspect three different candlestick formations in the Archive or exhibit pods.",
            category: "exploration",
            objective: { type: "pattern_view", target: 3, label: "Patterns Inspected" },
            reward: { xp: 25, masteryBoost: 5, title: "Foundational Reader" },
            dialogue: {
                offered: "Welcome to Candle City, initiate. Price charts speak in candles. Inspect at least 3 distinct patterns in our Archive or exhibit pods to begin.",
                in_progress: "You are making progress. Continue inspecting candle formations across the district. Return to me once you have examined 3 distinct patterns.",
                ready_to_claim: "Outstanding work! You have begun deciphering the language of the market. Claim your reward!",
                completed: "You have mastered the First Light drill. Check with Instructor Val at the Blitz Arena when you're ready for speed drills."
            }
        },
        {
            id: "rapid_eye",
            title: "Rapid Eye",
            giver: "instructor_val",
            giverName: "Range Instructor Val",
            description: "Complete one full 10-round match in the Candle Blitz Arena under time pressure.",
            category: "gameplay",
            objective: { type: "blitz_complete", target: 1, label: "Blitz Matches Completed" },
            reward: { xp: 30, masteryBoost: 8, title: "Rapid Reflexes" },
            dialogue: {
                offered: "Speed and precision separate real traders from amateurs. Enter the Candle Blitz Arena and complete a full 10-round match.",
                in_progress: "The arena is waiting. Head to the Candle Blitz Terminal and finish all 10 rounds of recognition targets.",
                ready_to_claim: "Impressive reaction times! You held your focus under the countdown timer. Claim your combat drill reward.",
                completed: "Your reflexes are sharp. Keep practicing in Blitz mode to push your recognition accuracy and combo multipliers even higher."
            }
        },
        {
            id: "pattern_hunter",
            title: "Pattern Hunter",
            giver: "instructor_val",
            giverName: "Range Instructor Val",
            description: "Correctly identify 10 candlestick patterns across your training drills and arena target sessions.",
            category: "recognition",
            objective: { type: "recognition", target: 10, label: "Correct Identifications" },
            reward: { xp: 35, masteryBoost: 10, title: "Pattern Hunter" },
            dialogue: {
                offered: "A true hunter never misidentifies their target. Correctly recognize 10 distinct formations during your drills to prove your pattern recall.",
                in_progress: "Keep hunting! Lock onto the key features—wicks, bodies, and color biases. Reach 10 correct identifications.",
                ready_to_claim: "Target confirmed! 10 accurate identifications locked in. You are developing a disciplined trading eye.",
                completed: "10 confirmed targets down! You're ready to tackle more complex multi-candle formations."
            }
        },
        {
            id: "candle_scholar",
            title: "Candle Scholar",
            giver: "mentor_kael",
            giverName: "Candle Mentor Kael",
            description: "Expand your chart vocabulary by exploring at least 20 unique candlestick patterns in the Master Candlestick Archive.",
            category: "mastery",
            objective: { type: "unique_pattern_view", target: 20, label: "Unique Formations Explored" },
            reward: { xp: 50, masteryBoost: 15, title: "Candle Scholar" },
            dialogue: {
                offered: "There are 44 canonical candlestick formations in our master encyclopedia. Single candles, dual tweezers, and triple star patterns. Expand your knowledge by studying at least 20 unique formations.",
                in_progress: "Knowledge is leverage. Open the Candle Archive and examine setups until you reach 20 patterns.",
                ready_to_claim: "Exceptional scholarly dedication! 20 unique patterns committed to memory. Take your World XP and mastery bonus.",
                completed: "You are now a recognized Candle Scholar in this district. Continue towards full 44-pattern mastery!"
            }
        },
        {
            id: "context_matters",
            title: "Context Matters",
            giver: "analyst_soren",
            giverName: "Market Analyst Soren",
            description: "Visit the Context Chamber or Mistake Lab and complete an interactive analysis challenge on trend location and fakeouts.",
            category: "analysis",
            objective: { type: "challenge_complete", target: 1, label: "Context Analysis Completed" },
            reward: { xp: 30, masteryBoost: 8, title: "Context Analyst" },
            dialogue: {
                offered: "A hammer at resistance is not a buy signal—it's a trap. Patterns only have meaning when read inside macro trend context. Complete a session at the Context Chamber to learn proper confirmation rules.",
                in_progress: "Head to the Context Chamber in the southwest sector. Test your ability to separate valid setups from market fakeouts.",
                ready_to_claim: "Superb analysis! You understand that location and confluence validate the pattern. Claim your reward.",
                completed: "Always check the prevailing trend before pulling the trigger. Context is king."
            }
        },
        {
            id: "city_explorer",
            title: "City Explorer",
            giver: "coordinator_aria",
            giverName: "Coordinator Aria",
            description: "Physically navigate Candle City and interact with 5 distinct district stations, pods, or arena terminals.",
            category: "exploration",
            objective: { type: "interact_locations", target: 5, label: "Locations Visited" },
            reward: { xp: 40, masteryBoost: 10, title: "District Scout" },
            dialogue: {
                offered: "Welcome to Strativo World's premier candlestick training ground. Get your bearings by visiting at least 5 different facilities across Candle City.",
                in_progress: "Walk the district avenues! Visit the Archive, Recognition Range, Blitz Arena, Context Chamber, and Mistake Lab.",
                ready_to_claim: "District mapped! You know every corner of Candle City. Take your Explorer commendation.",
                completed: "You know the layout like the back of your hand. Use all facilities to hone your trading edge."
            }
        }
    ];

    let CANONICAL_MISSIONS = DEFAULT_MISSIONS;
    let trackedMissionId = "first_light";

    // Async loader for missions dataset
    async function loadMissionsDataset(customPath = null) {
        try {
            const isPipDistrict = (typeof window !== "undefined" && window.location && window.location.pathname.includes("pip-district")) || (typeof window !== "undefined" && window.__STRATIVO_DISTRICT__ === "pip-district");
            const isMarketArena = (typeof window !== "undefined" && window.location && window.location.pathname.includes("market-arena")) || (typeof window !== "undefined" && window.__STRATIVO_DISTRICT__ === "market-arena");

            const candidatePaths = customPath ? [customPath] : isMarketArena ? [
                "../data/market-missions.json",
                "data/market-missions.json",
                "games/data/market-missions.json",
                "/games/data/market-missions.json"
            ] : isPipDistrict ? [
                "../data/pip-missions.json",
                "data/pip-missions.json",
                "games/data/pip-missions.json",
                "/games/data/pip-missions.json"
            ] : [
                "../data/missions.json",
                "data/missions.json",
                "games/data/missions.json",
                "/games/data/missions.json"
            ];
            for (const p of candidatePaths) {
                try {
                    const res = await fetch(p);
                    if (res.ok) {
                        const json = await res.json();
                        if (json && Array.isArray(json.missions)) {
                            CANONICAL_MISSIONS = json.missions;
                            if (CANONICAL_MISSIONS.length > 0 && !getMission(trackedMissionId)) {
                                trackedMissionId = CANONICAL_MISSIONS[0].id;
                            }
                            return CANONICAL_MISSIONS;
                        }
                    }
                } catch {}
            }
        } catch {}
        return CANONICAL_MISSIONS;
    }

    function getState() {
        if (typeof window !== "undefined" && window.StrativoWorldState) {
            if (typeof window.StrativoWorldState.get === "function") return window.StrativoWorldState.get();
            if (typeof window.StrativoWorldState.getState === "function") return window.StrativoWorldState.getState();
        }
        return {
            viewedPatterns: [],
            blitzStats: { matchesPlayed: 0, totalCorrect: 0 },
            missions: {},
            uniqueLocations: []
        };
    }

    function saveState(patch) {
        if (typeof window !== "undefined" && window.StrativoWorldState) {
            if (typeof window.StrativoWorldState.patch === "function") return window.StrativoWorldState.patch(patch);
            if (typeof window.StrativoWorldState.updateState === "function") return window.StrativoWorldState.updateState(patch);
        }
    }

    function getMissions() {
        return CANONICAL_MISSIONS;
    }

    function getMission(id) {
        return CANONICAL_MISSIONS.find(m => m.id === id) || null;
    }

    /**
     * Calculate true dynamic progress from real world state
     */
    function getMissionProgress(id) {
        const mission = getMission(id);
        if (!mission) return { current: 0, target: 1, percent: 0, completed: false };

        const state = getState();
        const missionState = (state.missions && state.missions[id]) || {};

        if (missionState.completed) {
            return {
                current: mission.objective.target,
                target: mission.objective.target,
                percent: 100,
                completed: true
            };
        }

        let currentVal = 0;
        const targetVal = mission.objective.target;

        switch (mission.objective.type) {
            case "pattern_view":
            case "unique_pattern_view":
                currentVal = (state.viewedPatterns || []).length;
                break;
            case "blitz_complete":
                currentVal = (state.blitzStats && state.blitzStats.matchesPlayed) || 0;
                break;
            case "pip_blitz_complete":
                currentVal = (state.pipStats && state.pipStats.blitzMatches) || (missionState.progress || 0);
                break;
            case "recognition":
                currentVal = (state.blitzStats && state.blitzStats.totalCorrect) || 0;
                break;
            case "precision_quiz":
                currentVal = (state.pipStats && state.pipStats.blitzCorrect) || (missionState.progress || 0);
                break;
            case "pip_measurement":
                currentVal = (state.pipStats && state.pipStats.measurementsSolved) || (missionState.progress || 0);
                break;
            case "jpy_challenge":
                currentVal = (state.pipStats && state.pipStats.jpySolved) ? 1 : (missionState.progress || 0);
                break;
            case "fractional_challenge":
                currentVal = (state.pipStats && state.pipStats.fractionalSolved) || (missionState.progress || 0);
                break;
            case "instrument_rules":
                currentVal = (state.pipStats && state.pipStats.rulesCompleted) ? 1 : (missionState.progress || 0);
                break;
            case "risk_forge_complete":
                currentVal = (state.pipStats && state.pipStats.forgeCompleted) || (missionState.progress || 0);
                break;
            case "leverage_tower_complete":
                currentVal = (state.pipStats && state.pipStats.leverageCompleted) ? 1 : (missionState.progress || 0);
                break;
            case "precision_master_complete":
                currentVal = (state.pipStats && state.pipStats.arenaCompleted) ? 1 : (missionState.progress || 0);
                break;
            case "structure_swings":
                currentVal = (state.marketStats && state.marketStats.swingsSolved) || (missionState.progress || 0);
                break;
            case "trend_classification":
                currentVal = (state.marketStats && state.marketStats.trendsSolved) || (missionState.progress || 0);
                break;
            case "structure_sequence":
                currentVal = (state.marketStats && state.marketStats.sequencesSolved) || (missionState.progress || 0);
                break;
            case "range_recognition":
                currentVal = (state.marketStats && state.marketStats.rangesSolved) || (missionState.progress || 0);
                break;
            case "breakout_scenarios":
                currentVal = (state.marketStats && state.marketStats.breakoutsSolved) || (missionState.progress || 0);
                break;
            case "fakeout_scenarios":
                currentVal = (state.marketStats && state.marketStats.fakeoutsSolved) || (missionState.progress || 0);
                break;
            case "chart_theater_complete":
                currentVal = (state.marketStats && state.marketStats.theaterCompleted) ? 1 : (missionState.progress || 0);
                break;
            case "market_blitz_complete":
                currentVal = (state.marketStats && state.marketStats.blitzMatches) || (missionState.progress || 0);
                break;
            case "market_master_complete":
                currentVal = (state.marketStats && state.marketStats.arenaCompleted) ? 1 : (missionState.progress || 0);
                break;
            case "challenge_complete":
                currentVal = missionState.progress || 0;
                break;
            case "interact_locations":
                currentVal = (state.uniqueLocations || []).length;
                break;
            default:
                currentVal = missionState.progress || 0;
                break;
        }

        const capped = Math.min(targetVal, currentVal);
        const percent = Math.min(100, Math.round((capped / targetVal) * 100));

        return {
            current: capped,
            target: targetVal,
            percent,
            completed: capped >= targetVal
        };
    }

    /**
     * Get mission status: "available" | "active" | "ready_to_claim" | "completed"
     */
    function getMissionStatus(id) {
        const state = getState();
        const missionState = (state.missions && state.missions[id]) || {};

        if (missionState.completed) {
            return "completed";
        }

        const prog = getMissionProgress(id);

        if (!missionState.active) {
            // Check if objective was achieved even before talking to NPC
            if (prog.completed) return "ready_to_claim";
            return "available";
        }

        if (prog.completed) {
            return "ready_to_claim";
        }

        return "active";
    }

    function acceptMission(id) {
        const mission = getMission(id);
        if (!mission) return false;

        const state = getState();
        state.missions = state.missions || {};
        state.missions[id] = state.missions[id] || {};
        state.missions[id].id = id;
        state.missions[id].title = mission.title;
        state.missions[id].active = true;
        state.missions[id].acceptedAt = Date.now();

        saveState({ missions: state.missions });
        setTrackedMission(id);

        if (window.StrativoWorldAudio && typeof window.StrativoWorldAudio.playSFX === "function") {
            window.StrativoWorldAudio.playSFX("button");
        }
        if (window.StrativoWorldHaptics && typeof window.StrativoWorldHaptics.triggerHaptic === "function") {
            window.StrativoWorldHaptics.triggerHaptic("select");
        }

        if (typeof window.dispatchEvent === "function") {
            window.dispatchEvent(new CustomEvent("strativo:missionAccepted", {
                detail: { missionId: id, mission }
            }));
        }

        return true;
    }

    /**
     * Claim reward exactly once via idempotent transaction
     */
    function claimReward(id) {
        const mission = getMission(id);
        if (!mission) return { success: false, reason: "mission_not_found" };

        const state = getState();
        state.missions = state.missions || {};
        const missionState = state.missions[id] || {};

        if (missionState.completed) {
            return { success: false, claimed: false, reason: "already_completed", alreadyClaimed: true };
        }

        const prog = getMissionProgress(id);
        if (!prog.completed) {
            return { success: false, claimed: false, reason: "objective_not_met", alreadyClaimed: false };
        }

        // 1. Mark as completed in state
        missionState.id = id;
        missionState.title = mission.title;
        missionState.active = false;
        missionState.completed = true;
        missionState.completedAt = Date.now();
        state.missions[id] = missionState;

        saveState({ missions: state.missions });

        // 2. Grant World XP through idempotent transaction
        const xpEventKey = `mission_reward_${id}`;
        let xpResult = null;
        if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.addWorldXP === "function") {
            xpResult = window.StrativoWorldXPEngine.addWorldXP(mission.reward.xp, `Completed Mission: ${mission.title}`, xpEventKey);
        }

        // 3. Trigger Reward Audio & Haptics
        if (window.StrativoWorldAudio && typeof window.StrativoWorldAudio.playSFX === "function") {
            window.StrativoWorldAudio.playSFX("xpReward");
        }
        if (window.StrativoWorldHaptics && typeof window.StrativoWorldHaptics.triggerHaptic === "function") {
            window.StrativoWorldHaptics.triggerHaptic("reward");
        }

        // 4. Dispatch global event
        if (typeof window.dispatchEvent === "function") {
            window.dispatchEvent(new CustomEvent("strativo:missionClaimed", {
                detail: { missionId: id, mission, reward: mission.reward, xpResult }
            }));
        }

        return { success: true, claimed: true, mission, reward: mission.reward, xpResult, xpGained: mission.reward.xp, alreadyClaimed: false };
    }

    function recordLocationInteraction(locationId) {
        if (!locationId || typeof locationId !== "string") return;
        const state = getState();
        state.uniqueLocations = state.uniqueLocations || [];

        if (!state.uniqueLocations.includes(locationId)) {
            state.uniqueLocations.push(locationId);
            saveState({ uniqueLocations: state.uniqueLocations });

            if (typeof window.dispatchEvent === "function") {
                window.dispatchEvent(new CustomEvent("strativo:locationInteracted", {
                    detail: { locationId, total: state.uniqueLocations.length }
                }));
            }
        }
    }

    function recordContextChallengeComplete() {
        const state = getState();
        state.missions = state.missions || {};
        state.missions.context_matters = state.missions.context_matters || {};
        state.missions.context_matters.progress = (state.missions.context_matters.progress || 0) + 1;

        saveState({ missions: state.missions });

        if (typeof window.dispatchEvent === "function") {
            window.dispatchEvent(new CustomEvent("strativo:contextChallengeCompleted", {
                detail: { count: state.missions.context_matters.progress }
            }));
        }
    }

    function getTrackedMission() {
        const m = getMission(trackedMissionId);
        if (!m) return CANONICAL_MISSIONS[0];
        return m;
    }

    function setTrackedMission(id) {
        if (getMission(id)) {
            trackedMissionId = id;
            if (typeof window.dispatchEvent === "function") {
                window.dispatchEvent(new CustomEvent("strativo:trackedMissionChanged", {
                    detail: { missionId: id }
                }));
            }
            return true;
        }
        return false;
    }

    /**
     * NPC Dialogue Router
     */
    function handleNPCInteraction(npc) {
        if (!npc) return;

        // Find primary mission for this NPC
        const missionId = (npc.missions && npc.missions[0]) || null;
        const mission = missionId ? getMission(missionId) : null;

        if (!mission) {
            // General conversation
            if (window.StrativoRPG.DialogueManager) {
                window.StrativoRPG.DialogueManager.showDialogue({
                    speaker: npc.name,
                    role: npc.role,
                    themeColor: npc.themeColor,
                    avatarIcon: npc.avatarIcon,
                    text: npc.defaultDialogue,
                    options: [
                        { label: "Understood", action: () => window.StrativoRPG.DialogueManager.closeDialogue(), primary: true }
                    ]
                });
            }
            return;
        }

        const status = getMissionStatus(mission.id);
        const prog = getMissionProgress(mission.id);

        let dialogText = "";
        let options = [];

        if (status === "completed") {
            dialogText = mission.dialogue?.completed || "You have completed all current tasks for this sector.";
            options = [
                { label: "Close", action: () => window.StrativoRPG.DialogueManager.closeDialogue(), secondary: true }
            ];
        } else if (status === "ready_to_claim") {
            dialogText = `${mission.dialogue?.ready_to_claim || "Objective met!"}<br><br><strong style="color: #FCD34D;">Reward: +${mission.reward.xp} World XP</strong>`;
            options = [
                {
                    label: `Claim Reward (+${mission.reward.xp} XP)`,
                    icon: "fa-gift",
                    primary: true,
                    action: () => {
                        claimReward(mission.id);
                        window.StrativoRPG.DialogueManager.closeDialogue();
                    }
                },
                { label: "Later", action: () => window.StrativoRPG.DialogueManager.closeDialogue(), secondary: true }
            ];
        } else if (status === "active") {
            dialogText = `${mission.dialogue?.in_progress || "Continue your objective."}<br><br><span style="color: #00F0FF; font-weight: bold;">Current Progress: ${prog.current} / ${prog.target} ${mission.objective.label || ""}</span>`;
            options = [
                {
                    label: "Track Quest",
                    icon: "fa-crosshairs",
                    primary: true,
                    action: () => {
                        setTrackedMission(mission.id);
                        window.StrativoRPG.DialogueManager.closeDialogue();
                    }
                },
                { label: "Resume Drills", action: () => window.StrativoRPG.DialogueManager.closeDialogue(), secondary: true }
            ];
        } else {
            // Available
            dialogText = `${mission.dialogue?.offered || mission.description}<br><br><strong style="color: #00E5A8;">Objective: ${mission.description}</strong><br><span style="color: #FCD34D;">Reward: +${mission.reward.xp} World XP</span>`;
            options = [
                {
                    label: "Accept Mission",
                    icon: "fa-check",
                    primary: true,
                    action: () => {
                        acceptMission(mission.id);
                        window.StrativoRPG.DialogueManager.closeDialogue();
                    }
                },
                { label: "Decline", action: () => window.StrativoRPG.DialogueManager.closeDialogue(), secondary: true }
            ];
        }

        if (window.StrativoRPG.DialogueManager) {
            window.StrativoRPG.DialogueManager.showDialogue({
                speaker: npc.name,
                role: npc.role,
                themeColor: npc.themeColor,
                avatarIcon: npc.avatarIcon,
                text: dialogText,
                options
            });
        }
    }

    function recordMissionProgress(missionId, amount = 1) {
        if (!missionId) return;
        const state = getState();
        state.missions = state.missions || {};
        state.missions[missionId] = state.missions[missionId] || {};
        state.missions[missionId].progress = (state.missions[missionId].progress || 0) + amount;
        saveState({ missions: state.missions });

        if (typeof window.dispatchEvent === "function") {
            window.dispatchEvent(new CustomEvent("strativo:missionProgressUpdated", {
                detail: { missionId, progress: state.missions[missionId].progress }
            }));
        }
    }

    function recordPipMeasurement(count = 1) {
        const state = getState();
        state.pipStats = state.pipStats || {};
        state.pipStats.measurementsSolved = (state.pipStats.measurementsSolved || 0) + count;
        saveState({ pipStats: state.pipStats });
        if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.recalculatePipPositionMastery === "function") {
            window.StrativoWorldXPEngine.recalculatePipPositionMastery(state);
        }
        recordMissionProgress("first_measurement", count);
    }

    function recordPrecisionQuiz(correctCount = 1) {
        const state = getState();
        state.pipStats = state.pipStats || {};
        state.pipStats.blitzCorrect = (state.pipStats.blitzCorrect || 0) + correctCount;
        saveState({ pipStats: state.pipStats });
        if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.recalculatePipPositionMastery === "function") {
            window.StrativoWorldXPEngine.recalculatePipPositionMastery(state);
        }
        recordMissionProgress("precision_test", correctCount);
    }

    function recordJpyChallengeComplete() {
        const state = getState();
        state.pipStats = state.pipStats || {};
        state.pipStats.jpySolved = 1;
        saveState({ pipStats: state.pipStats });
        if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.recalculatePipPositionMastery === "function") {
            window.StrativoWorldXPEngine.recalculatePipPositionMastery(state);
        }
        recordMissionProgress("jpy_zone", 1);
    }

    function recordFractionalChallenge(count = 1) {
        const state = getState();
        state.pipStats = state.pipStats || {};
        state.pipStats.fractionalSolved = (state.pipStats.fractionalSolved || 0) + count;
        saveState({ pipStats: state.pipStats });
        if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.recalculatePipPositionMastery === "function") {
            window.StrativoWorldXPEngine.recalculatePipPositionMastery(state);
        }
        recordMissionProgress("fractional_precision", count);
    }

    function recordInstrumentRulesComplete() {
        const state = getState();
        state.pipStats = state.pipStats || {};
        state.pipStats.rulesCompleted = 1;
        saveState({ pipStats: state.pipStats });
        if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.recalculatePipPositionMastery === "function") {
            window.StrativoWorldXPEngine.recalculatePipPositionMastery(state);
        }
        recordMissionProgress("know_your_instrument", 1);
    }

    function recordRiskForgeComplete(count = 1) {
        const state = getState();
        state.pipStats = state.pipStats || {};
        state.pipStats.forgeCompleted = (state.pipStats.forgeCompleted || 0) + count;
        saveState({ pipStats: state.pipStats });
        if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.recalculatePipPositionMastery === "function") {
            window.StrativoWorldXPEngine.recalculatePipPositionMastery(state);
        }
        recordMissionProgress("risk_engineer", count);
    }

    function recordLeverageTowerComplete() {
        const state = getState();
        state.pipStats = state.pipStats || {};
        state.pipStats.leverageCompleted = 1;
        saveState({ pipStats: state.pipStats });
        if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.recalculatePipPositionMastery === "function") {
            window.StrativoWorldXPEngine.recalculatePipPositionMastery(state);
        }
        recordMissionProgress("leverage_check", 1);
    }

    function recordPipBlitzComplete() {
        const state = getState();
        state.pipStats = state.pipStats || {};
        state.pipStats.blitzMatches = (state.pipStats.blitzMatches || 0) + 1;
        saveState({ pipStats: state.pipStats });
        if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.recalculatePipPositionMastery === "function") {
            window.StrativoWorldXPEngine.recalculatePipPositionMastery(state);
        }
        recordMissionProgress("pip_blitz", 1);
    }

    function recordPrecisionMasterComplete() {
        const state = getState();
        state.pipStats = state.pipStats || {};
        state.pipStats.arenaCompleted = 1;
        saveState({ pipStats: state.pipStats });
        if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.recalculatePipPositionMastery === "function") {
            window.StrativoWorldXPEngine.recalculatePipPositionMastery(state);
        }
        recordMissionProgress("precision_master", 1);
    }

    /* ======================================================================
       MARKET ARENA SPECIFIC MISSION HELPERS
       ====================================================================== */

    function recordStructureSwing(count = 1) {
        const state = getState();
        state.marketStats = state.marketStats || {};
        state.marketStats.swingsSolved = (state.marketStats.swingsSolved || 0) + count;
        saveState({ marketStats: state.marketStats });
        if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.recalculateMarketStructureMastery === "function") {
            window.StrativoWorldXPEngine.recalculateMarketStructureMastery(state);
        }
        recordMissionProgress("read_the_structure", count);
    }

    function recordTrendClassification(count = 1) {
        const state = getState();
        state.marketStats = state.marketStats || {};
        state.marketStats.trendsSolved = (state.marketStats.trendsSolved || 0) + count;
        saveState({ marketStats: state.marketStats });
        if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.recalculateMarketStructureMastery === "function") {
            window.StrativoWorldXPEngine.recalculateMarketStructureMastery(state);
        }
        recordMissionProgress("find_the_trend", count);
    }

    function recordStructureSequence(count = 1) {
        const state = getState();
        state.marketStats = state.marketStats || {};
        state.marketStats.sequencesSolved = (state.marketStats.sequencesSolved || 0) + count;
        saveState({ marketStats: state.marketStats });
        if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.recalculateMarketStructureMastery === "function") {
            window.StrativoWorldXPEngine.recalculateMarketStructureMastery(state);
        }
        recordMissionProgress("structure_sequence", count);
    }

    function recordRangeRecognition(count = 1) {
        const state = getState();
        state.marketStats = state.marketStats || {};
        state.marketStats.rangesSolved = (state.marketStats.rangesSolved || 0) + count;
        saveState({ marketStats: state.marketStats });
        if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.recalculateMarketStructureMastery === "function") {
            window.StrativoWorldXPEngine.recalculateMarketStructureMastery(state);
        }
        recordMissionProgress("range_detector", count);
    }

    function recordBreakoutScenario(count = 1) {
        const state = getState();
        state.marketStats = state.marketStats || {};
        state.marketStats.breakoutsSolved = (state.marketStats.breakoutsSolved || 0) + count;
        saveState({ marketStats: state.marketStats });
        if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.recalculateMarketStructureMastery === "function") {
            window.StrativoWorldXPEngine.recalculateMarketStructureMastery(state);
        }
        recordMissionProgress("breakout_test", count);
    }

    function recordFakeoutScenario(count = 1) {
        const state = getState();
        state.marketStats = state.marketStats || {};
        state.marketStats.fakeoutsSolved = (state.marketStats.fakeoutsSolved || 0) + count;
        saveState({ marketStats: state.marketStats });
        if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.recalculateMarketStructureMastery === "function") {
            window.StrativoWorldXPEngine.recalculateMarketStructureMastery(state);
        }
        recordMissionProgress("fakeout_hunter", count);
    }

    function recordChartTheaterComplete() {
        const state = getState();
        state.marketStats = state.marketStats || {};
        state.marketStats.theaterCompleted = 1;
        saveState({ marketStats: state.marketStats });
        if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.recalculateMarketStructureMastery === "function") {
            window.StrativoWorldXPEngine.recalculateMarketStructureMastery(state);
        }
        recordMissionProgress("chart_theater", 1);
    }

    function recordMarketBlitzComplete() {
        const state = getState();
        state.marketStats = state.marketStats || {};
        state.marketStats.blitzMatches = (state.marketStats.blitzMatches || 0) + 1;
        saveState({ marketStats: state.marketStats });
        if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.recalculateMarketStructureMastery === "function") {
            window.StrativoWorldXPEngine.recalculateMarketStructureMastery(state);
        }
        recordMissionProgress("market_blitz", 1);
    }

    function recordMarketMasterComplete() {
        const state = getState();
        state.marketStats = state.marketStats || {};
        state.marketStats.arenaCompleted = 1;
        saveState({ marketStats: state.marketStats });
        if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.recalculateMarketStructureMastery === "function") {
            window.StrativoWorldXPEngine.recalculateMarketStructureMastery(state);
        }
        recordMissionProgress("market_structure_master", 1);
    }

    function recordSupportRecognition(count = 1) {
        recordStructureSwing(count);
    }

    function recordResistanceRecognition(count = 1) {
        recordStructureSwing(count);
    }

    function recordLevelFlipRecognition(count = 1) {
        recordStructureSequence(count);
    }

    function recordConfluenceRecognition(count = 1) {
        recordStructureSequence(count);
    }

    const MissionEngine = {
        loadMissionsDataset,
        getMissions,
        getMission,
        getMissionProgress,
        getMissionStatus,
        acceptMission,
        claimReward,
        getTrackedMission,
        setTrackedMission,
        recordLocationInteraction,
        recordContextChallengeComplete,
        recordMissionProgress,
        recordPipMeasurement,
        recordPrecisionQuiz,
        recordJpyChallengeComplete,
        recordFractionalChallenge,
        recordInstrumentRulesComplete,
        recordRiskForgeComplete,
        recordLeverageTowerComplete,
        recordPipBlitzComplete,
        recordPrecisionMasterComplete,
        recordStructureSwing,
        recordTrendClassification,
        recordStructureSequence,
        recordRangeRecognition,
        recordBreakoutScenario,
        recordFakeoutScenario,
        recordChartTheaterComplete,
        recordMarketBlitzComplete,
        recordMarketMasterComplete,
        recordSupportRecognition,
        recordResistanceRecognition,
        recordLevelFlipRecognition,
        recordConfluenceRecognition,
        handleNPCInteraction,
        DEFAULT_MISSIONS
    };

    window.StrativoRPG.MissionEngine = MissionEngine;
    window.StrativoWorldMissions = MissionEngine;

    if (typeof module !== "undefined" && module.exports) {
        module.exports = MissionEngine;
    }
})();
