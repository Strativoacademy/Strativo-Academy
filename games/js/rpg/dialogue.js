/* ==========================================================================
   STRATIVO WORLD — 2D RPG REUSABLE DIALOGUE ENGINE
   Namespace: window.StrativoRPG.DialogueManager (alias StrativoDialogue)
   Description:
   - In-world cyberpunk dialogue modal & branching conversation manager
   - Supports NPC speaker metadata, custom avatars/themes, multi-choice actions
   - Event-driven with audio & haptic integrations
   - Fully responsive on mobile (360px+) and desktop with keyboard navigation
   ========================================================================== */

"use strict";

(function () {
    window.StrativoRPG = window.StrativoRPG || {};

    let activeModal = null;
    let isOpen = false;

    function ensureDialogueDOM() {
        if (activeModal && document.body.contains(activeModal)) {
            if (activeModal.querySelector("#strativo-speaker-name") && activeModal.querySelector("#strativo-dialogue-text")) {
                return activeModal;
            }
        }

        let overlay = document.getElementById("strativo-dialogue-overlay");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "strativo-dialogue-overlay";
            overlay.className = "strativo-dialogue-overlay";
            overlay.setAttribute("role", "dialog");
            overlay.setAttribute("aria-modal", "true");
            overlay.setAttribute("aria-hidden", "true");
            document.body.appendChild(overlay);
        }

        if (!overlay.querySelector("#strativo-speaker-name") || !overlay.querySelector("#strativo-dialogue-text")) {
            overlay.className = "strativo-dialogue-overlay";
            overlay.setAttribute("role", "dialog");
            overlay.setAttribute("aria-modal", "true");
            overlay.setAttribute("aria-hidden", "true");
            overlay.innerHTML = `
                <div class="strativo-dialogue-card" id="strativo-dialogue-card">
                    <div class="strativo-dialogue-header">
                        <div class="strativo-speaker-avatar" id="strativo-speaker-avatar">
                            <i class="fas fa-user-astronaut" id="strativo-speaker-icon"></i>
                        </div>
                        <div class="strativo-speaker-meta">
                            <h3 class="strativo-speaker-name" id="strativo-speaker-name">Speaker Name</h3>
                            <span class="strativo-speaker-role" id="strativo-speaker-role">District Instructor</span>
                        </div>
                        <button type="button" class="strativo-dialogue-close-btn" id="strativo-dialogue-close-btn" aria-label="Close Dialogue">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="strativo-dialogue-body">
                        <p class="strativo-dialogue-text" id="strativo-dialogue-text">Dialogue text...</p>
                    </div>
                    <div class="strativo-dialogue-actions" id="strativo-dialogue-actions">
                        <!-- Dynamic choice buttons inserted here -->
                    </div>
                </div>
            `;
        }

        // Close on backdrop or close button
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                closeDialogue();
            }
        };

        const closeBtn = overlay.querySelector("#strativo-dialogue-close-btn");
        if (closeBtn) {
            closeBtn.onclick = () => closeDialogue();
        }

        // Global Escape key
        if (!window._strativoDialogueEscBound) {
            window._strativoDialogueEscBound = true;
            window.addEventListener("keydown", (e) => {
                if (isOpen && (e.key === "Escape" || e.code === "Escape")) {
                    closeDialogue();
                }
            });
        }

        activeModal = overlay;
        return activeModal;
    }

    let currentSteps = null;
    let currentStepIndex = 0;
    let currentConfig = null;

    function renderDialogueStep(config = {}) {
        const overlay = ensureDialogueDOM();
        if (!overlay) return;

        const card = overlay.querySelector("#strativo-dialogue-card");
        const avatarBox = overlay.querySelector("#strativo-speaker-avatar");
        const iconEl = overlay.querySelector("#strativo-speaker-icon");
        const nameEl = overlay.querySelector("#strativo-speaker-name");
        const roleEl = overlay.querySelector("#strativo-speaker-role");
        const textEl = overlay.querySelector("#strativo-dialogue-text");
        const actionsEl = overlay.querySelector("#strativo-dialogue-actions");

        const themeColor = config.themeColor || "#00E5A8";
        const speakerName = config.speaker || config.title || config.name || "District Inhabitant";
        const speakerRole = config.role || config.speakerRole || "Strativo World Entity";
        const iconClass = config.avatarIcon || config.icon || "fa-user-astronaut";
        const text = config.text || config.dialogue || config.message || "...";
        const options = Array.isArray(config.options) && config.options.length > 0
            ? config.options
            : [{ label: "Close", action: () => closeDialogue(), secondary: true }];

        // Populate fields safely
        if (nameEl) nameEl.textContent = speakerName;
        if (roleEl) roleEl.textContent = speakerRole;
        if (textEl) textEl.innerHTML = text;

        if (avatarBox) {
            avatarBox.style.borderColor = themeColor;
            avatarBox.style.boxShadow = `0 0 15px ${themeColor}40`;
        }
        if (iconEl) {
            iconEl.className = `fas ${iconClass.startsWith("fa-") ? iconClass : "fa-" + iconClass}`;
            iconEl.style.color = themeColor;
        }
        if (card) {
            card.style.borderTop = `3px solid ${themeColor}`;
        }

        // Render Action Buttons
        actionsEl.innerHTML = "";
        options.forEach(opt => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = `strativo-dialogue-btn ${opt.primary ? "primary" : opt.secondary ? "secondary" : "default"}`;
            if (opt.primary) {
                btn.style.background = `linear-gradient(135deg, ${themeColor}, #009688)`;
                btn.style.color = "#030712";
                btn.style.boxShadow = `0 0 12px ${themeColor}50`;
            }

            const iconHtml = opt.icon ? `<i class="fas ${opt.icon}" style="margin-right: 6px;"></i>` : "";
            btn.innerHTML = `${iconHtml}${opt.label}`;

            btn.addEventListener("click", () => {
                if (window.StrativoWorldAudio && typeof window.StrativoWorldAudio.playSFX === "function") {
                    window.StrativoWorldAudio.playSFX("button");
                }
                if (window.StrativoWorldHaptics && typeof window.StrativoWorldHaptics.triggerHaptic === "function") {
                    window.StrativoWorldHaptics.triggerHaptic("select");
                }
                if (typeof opt.action === "function") {
                    opt.action();
                } else {
                    closeDialogue();
                }
            });

            actionsEl.appendChild(btn);
        });

        overlay.classList.add("active");
        overlay.setAttribute("aria-hidden", "false");
        overlay.style.display = "flex";
        isOpen = true;

        // Sound hook on open
        if (window.StrativoWorldAudio && typeof window.StrativoWorldAudio.playSFX === "function") {
            window.StrativoWorldAudio.playSFX("interaction");
        }

        // Emit global event
        if (typeof window.dispatchEvent === "function") {
            window.dispatchEvent(new CustomEvent("strativo:dialogueOpened", {
                detail: { speaker: speakerName, role: speakerRole, timestamp: Date.now() }
            }));
        }
    }

    function showDialogue(config = {}) {
        currentConfig = config;
        if (Array.isArray(config.steps) && config.steps.length > 0) {
            currentSteps = config.steps;
            currentStepIndex = 0;
            renderCurrentStep();
        } else {
            currentSteps = null;
            currentStepIndex = 0;
            renderDialogueStep(config);
        }
    }

    function renderCurrentStep() {
        if (!currentSteps || currentStepIndex >= currentSteps.length) {
            closeDialogue();
            return;
        }
        const step = currentSteps[currentStepIndex];
        const isLast = currentStepIndex === currentSteps.length - 1;
        const stepConfig = {
            ...currentConfig,
            speaker: step.speaker || step.title || step.name || currentConfig?.speaker || currentConfig?.title || currentConfig?.name || "District Inhabitant",
            role: step.role || step.speakerRole || currentConfig?.role || currentConfig?.speakerRole || "Strativo World Entity",
            avatarIcon: step.avatarIcon || step.icon || currentConfig?.avatarIcon || currentConfig?.icon || "fa-user-astronaut",
            themeColor: step.themeColor || currentConfig?.themeColor || "#00E5A8",
            text: step.text || step.dialogue || step.message || "...",
            options: step.options || (isLast
                ? [{ label: "Close", action: () => closeDialogue(), secondary: true }]
                : [{ label: "Next", action: () => advanceDialogue(), primary: true }])
        };
        renderDialogueStep(stepConfig);
    }

    function advanceDialogue() {
        if (currentSteps && currentStepIndex < currentSteps.length - 1) {
            currentStepIndex++;
            renderCurrentStep();
        } else {
            closeDialogue();
        }
    }

    function closeDialogue() {
        if (!activeModal) return;
        activeModal.classList.remove("active");
        activeModal.setAttribute("aria-hidden", "true");
        activeModal.style.display = "none";
        isOpen = false;
        currentSteps = null;
        currentStepIndex = 0;
        currentConfig = null;

        // Clean up DOM focus and reset input state
        if (typeof document !== "undefined" && document.activeElement && typeof document.activeElement.blur === "function") {
            document.activeElement.blur();
        }
        if (typeof window !== "undefined" && window.StrativoRPG && window.StrativoRPG.gameCore && window.StrativoRPG.gameCore.input) {
            window.StrativoRPG.gameCore.input.reset();
        }

        if (typeof window.dispatchEvent === "function") {
            window.dispatchEvent(new CustomEvent("strativo:dialogueClosed", {
                detail: { timestamp: Date.now() }
            }));
        }
    }

    function isDialogueOpen() {
        return isOpen;
    }

    const DialogueManager = {
        showDialogue,
        startDialogue: showDialogue,
        advanceDialogue,
        closeDialogue,
        close: closeDialogue,
        isDialogueOpen,
        get isOpen() { return isOpen; },
        ensureDialogueDOM
    };

    window.StrativoRPG.DialogueManager = DialogueManager;
    window.StrativoDialogue = DialogueManager;

    if (typeof module !== "undefined" && module.exports) {
        module.exports = DialogueManager;
    }
})();
