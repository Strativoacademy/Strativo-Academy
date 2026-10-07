/* ==========================================================================
   STRATIVO WORLD — DISTRICT 6: PSYCHOLOGY ZONE SCENARIO ENGINE
   Namespace: window.StrativoRPG.PsychScenarioEngine
   Description:
   - Scenario & Question Dispatcher across all 14 Psychology Zone facilities
   - Unbiased Fisher-Yates option shuffling without mutating canonical data
   - Recent-question history tracking and single authoritative state resets
   - Master dataset validators and calculation evaluation logic
   ========================================================================== */

"use strict";

(function () {
    window.StrativoRPG = window.StrativoRPG || {};

    // Fisher-Yates array shuffler
    function shuffleArray(arr) {
        if (!Array.isArray(arr)) return [];
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = copy[i];
            copy[i] = copy[j];
            copy[j] = temp;
        }
        return copy;
    }

    const pools = {
        psych_academy: [],
        discipline_dojo: [],
        bias_observatory: [],
        fomo_chamber: [],
        patience_pavilion: [],
        tilt_recovery_lab: [],
        revenge_station: [],
        journal_sanctuary: [],
        ego_chamber: [],
        streak_center: [],
        scenario_theater: [],
        psych_arena: [],
        mind_fortress: []
    };

    const history = {
        psych_academy: [],
        discipline_dojo: [],
        bias_observatory: [],
        fomo_chamber: [],
        patience_pavilion: [],
        tilt_recovery_lab: [],
        revenge_station: [],
        journal_sanctuary: [],
        ego_chamber: [],
        streak_center: [],
        scenario_theater: [],
        psych_arena: [],
        mind_fortress: []
    };

    function init(data = {}) {
        const scenarios = Array.isArray(data.scenarios) ? data.scenarios : [];
        const bossStages = Array.isArray(data.mindFortressStages) ? data.mindFortressStages : [];

        // Distribute scenarios to pools
        pools.psych_academy = scenarios.filter(s => s.category === "emotional_discipline" || s.category === "cognitive_biases" || s.category === "fomo_resistance");
        pools.discipline_dojo = scenarios.filter(s => s.category === "emotional_discipline");
        pools.bias_observatory = scenarios.filter(s => s.category === "cognitive_biases");
        pools.fomo_chamber = scenarios.filter(s => s.category === "fomo_resistance");
        pools.patience_pavilion = scenarios.filter(s => s.category === "patience_cash");
        pools.tilt_recovery_lab = scenarios.filter(s => s.category === "tilt_management");
        pools.revenge_station = scenarios.filter(s => s.category === "revenge_defense");
        pools.journal_sanctuary = scenarios.filter(s => s.category === "trade_journaling");
        pools.ego_chamber = scenarios.filter(s => s.category === "emotional_discipline" || s.category === "patience_cash");
        pools.streak_center = scenarios.filter(s => s.category === "streak_psychology");
        pools.scenario_theater = scenarios.filter(s => s.category === "emotional_discipline" || s.category === "cognitive_biases" || s.category === "tilt_management" || s.category === "fomo_resistance");
        pools.psych_arena = scenarios.filter(s => s.category !== "mind_fortress");
        pools.mind_fortress = bossStages.length > 0 ? bossStages : scenarios.filter(s => s.category === "mind_fortress");

        PsychScenarioEngine.scenarios = scenarios;
        PsychScenarioEngine.rawBossStages = bossStages;
        console.log(`PsychScenarioEngine: Loaded ${scenarios.length} scenarios across ${Object.keys(pools).length} pools.`);
    }

    function getQuestion(facilityId, tab = null) {
        const pool = pools[facilityId] || pools.psych_academy || [];
        if (pool.length === 0) return null;

        // Filter by tab if provided
        let filtered = pool;
        if (tab) {
            const tabFiltered = pool.filter(q => q.category === tab || q.tab === tab || (q.difficulty && q.difficulty.toLowerCase() === tab.toLowerCase()));
            if (tabFiltered.length > 0) filtered = tabFiltered;
        }

        // Anti-repetition tracking
        history[facilityId] = history[facilityId] || [];
        let available = filtered.filter(q => !history[facilityId].includes(q.id));
        if (available.length === 0) {
            history[facilityId] = [];
            available = filtered;
        }

        const chosen = available[Math.floor(Math.random() * available.length)];
        if (chosen && chosen.id) {
            history[facilityId].push(chosen.id);
        }

        if (!chosen) return null;
        return {
            ...chosen,
            options: Array.isArray(chosen.options) ? [...chosen.options] : []
        };
    }

    function resetSessionHistory() {
        Object.keys(history).forEach(k => history[k] = []);
    }

    function validateDataset() {
        let issues = 0;
        Object.keys(pools).forEach(k => {
            pools[k].forEach(item => {
                if (!item.id || (!item.questionText && !item.prompt)) {
                    console.warn(`PsychScenarioEngine validation warning in ${k}: missing id/text`, item);
                    issues++;
                }
            });
        });
        return { valid: issues === 0, issuesCount: issues };
    }

    const PsychScenarioEngine = {
        pools,
        history,
        scenarios: [],
        init,
        getQuestion,
        resetSessionHistory,
        validateDataset,
        shuffleArray
    };

    window.StrativoRPG.PsychScenarioEngine = PsychScenarioEngine;
    if (typeof module !== "undefined" && module.exports) {
        module.exports = PsychScenarioEngine;
    }
})();
