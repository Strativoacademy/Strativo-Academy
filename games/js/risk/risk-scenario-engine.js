/* ==========================================================================
   STRATIVO WORLD — RISK SCENARIO & QUESTION ENGINE (DISTRICT 5)
   Namespace: window.StrativoRPG.RiskScenarioEngine
   Description:
   - Scenario & Question Dispatcher across all 14 Risk Lab facilities
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
        risk_academy: [],
        position_forge: [],
        stoploss_workshop: [],
        rr_table: [],
        expectancy_lab: [],
        leverage_tower: [],
        margin_center: [],
        drawdown_observatory: [],
        recovery_lab: [],
        mistake_gallery: [],
        decision_lab: [],
        scenario_theater: [],
        risk_arena: [],
        survival_vault: []
    };

    const history = {
        risk_academy: [],
        position_forge: [],
        stoploss_workshop: [],
        rr_table: [],
        expectancy_lab: [],
        leverage_tower: [],
        margin_center: [],
        drawdown_observatory: [],
        recovery_lab: [],
        mistake_gallery: [],
        decision_lab: [],
        scenario_theater: [],
        risk_arena: [],
        survival_vault: []
    };

    function init(data = {}) {
        const scenarios = Array.isArray(data.scenarios) ? data.scenarios : [];
        const vault = Array.isArray(data.survivalVault) ? data.survivalVault : [];

        // Distribute scenarios to pools
        pools.risk_academy = scenarios.filter(s => s.category === "position_sizing" || s.category === "risk_reward" || s.category === "drawdown_recovery");
        pools.position_forge = scenarios.filter(s => s.category === "position_sizing");
        pools.stoploss_workshop = scenarios.filter(s => s.category === "stop_loss");
        pools.rr_table = scenarios.filter(s => s.category === "risk_reward");
        pools.expectancy_lab = scenarios.filter(s => s.category === "risk_reward" || s.category === "risk_of_ruin");
        pools.leverage_tower = scenarios.filter(s => s.category === "leverage_margin");
        pools.margin_center = scenarios.filter(s => s.category === "leverage_margin");
        pools.drawdown_observatory = scenarios.filter(s => s.category === "drawdown_recovery" || s.category === "risk_of_ruin");
        pools.recovery_lab = scenarios.filter(s => s.category === "drawdown_recovery");
        pools.mistake_gallery = scenarios.filter(s => s.category === "risk_psychology" || s.category === "leverage_margin");
        pools.decision_lab = scenarios.filter(s => s.category === "risk_psychology");
        pools.scenario_theater = scenarios.filter(s => s.category === "risk_psychology" || s.category === "position_sizing" || s.category === "stop_loss");
        pools.risk_arena = scenarios.filter(s => s.category === "risk_arena" || s.category === "position_sizing" || s.category === "stop_loss" || s.category === "drawdown_recovery");
        pools.survival_vault = vault.length > 0 ? vault : scenarios.filter(s => s.category === "survival_vault");
        RiskScenarioEngine.scenarios = scenarios;
        RiskScenarioEngine.rawVault = vault;
        console.log(`RiskScenarioEngine: Loaded ${scenarios.length} scenarios across pools.`);
    }

    function getQuestion(facilityId, tab = null) {
        const pool = pools[facilityId] || pools.risk_academy || [];
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

        const picked = available[Math.floor(Math.random() * available.length)];
        if (!picked) return null;

        history[facilityId].push(picked.id);

        // Deep clone & shuffle options
        const cloned = JSON.parse(JSON.stringify(picked));
        if (Array.isArray(cloned.options) && typeof cloned.options[0] === "string") {
            cloned.options = shuffleArray(cloned.options);
        } else if (Array.isArray(cloned.options) && typeof cloned.options[0] === "object") {
            cloned.options = shuffleArray(cloned.options);
        }

        return cloned;
    }

    function resetSessionHistory() {
        Object.keys(history).forEach(k => history[k] = []);
    }

    function validateDataset() {
        let issues = 0;
        Object.keys(pools).forEach(k => {
            pools[k].forEach(item => {
                if (!item.id || (!item.questionText && !item.prompt)) {
                    console.warn(`RiskScenarioEngine validation warning in ${k}: missing id/text`, item);
                    issues++;
                }
            });
        });
        return { valid: issues === 0, issuesCount: issues };
    }

    const RiskScenarioEngine = {
        pools,
        history,
        init,
        getQuestion,
        resetSessionHistory,
        validateDataset,
        shuffleArray
    };

    window.StrativoRPG.RiskScenarioEngine = RiskScenarioEngine;
    if (typeof module !== "undefined" && module.exports) {
        module.exports = RiskScenarioEngine;
    }
})();
