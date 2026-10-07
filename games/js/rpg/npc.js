/* ==========================================================================
   STRATIVO WORLD — 2D RPG REUSABLE NPC ENGINE (PHASE 2.6)
   Namespace: window.StrativoRPG.NPC / window.StrativoRPG.NPCManager
   Description:
   - Physical in-world NPC entities with proximity interaction rings
   - Dynamic directional facing, idle bobbing, and high-tech hologram rendering
   - Reactive Quest Markers (! for available, ? for claimable, ... for active)
   - Integrated with DialogueManager, MissionEngine, Audio, and Haptics
   - Fully reusable across all 7 Strativo World districts
   ========================================================================== */

"use strict";

(function () {
    window.StrativoRPG = window.StrativoRPG || {};

    class NPC {
        constructor(config = {}) {
            this.id = config.id || `npc_${Date.now()}`;
            this.name = config.name || "District Guide";
            this.role = config.role || "Instructor";
            this.district = config.district || "candle-city";
            this.x = Number(config.x) || 800;
            this.y = Number(config.y) || 600;
            this.width = 36;
            this.height = 48;
            this.interactionRadius = Number(config.interactionRadius) || 65;
            this.themeColor = config.themeColor || "#00E5A8";
            this.secondaryColor = config.secondaryColor || "#00F0FF";
            this.avatarIcon = config.avatarIcon || "fa-user-astronaut";
            this.missions = Array.isArray(config.missions) ? config.missions : [];
            this.defaultDialogue = config.defaultDialogue || "Welcome to the district. Explore the sector and test your trading skills.";

            // Animation & Proximity State
            this.isNearby = false;
            this.distanceToPlayer = Infinity;
            this.facingAngle = 0;
            this.bobTimer = Math.random() * Math.PI * 2;
            this.pulseTimer = 0;

            // Optional custom onInteract handler
            this.customInteract = typeof config.onInteract === "function" ? config.onInteract : null;
        }

        update(dt, playerPos) {
            this.bobTimer += dt * 3.0;
            this.pulseTimer += dt * 2.0;

            if (!playerPos) {
                this.isNearby = false;
                this.distanceToPlayer = Infinity;
                return;
            }

            const dx = playerPos.x - this.x;
            const dy = playerPos.y - this.y;
            this.distanceToPlayer = Math.hypot(dx, dy);
            this.isNearby = this.distanceToPlayer <= this.interactionRadius;

            // Face toward player when in proximity range
            if (this.isNearby) {
                this.facingAngle = Math.atan2(dy, dx);
            }
        }

        getQuestStatus() {
            if (typeof window === "undefined" || !window.StrativoRPG.MissionEngine) return null;
            const MissionEngine = window.StrativoRPG.MissionEngine;

            // Check missions offered by this NPC
            for (let i = 0; i < this.missions.length; i++) {
                const missionId = this.missions[i];
                const status = MissionEngine.getMissionStatus(missionId);
                if (status === "ready_to_claim") return "ready_to_claim";
            }
            for (let i = 0; i < this.missions.length; i++) {
                const missionId = this.missions[i];
                const status = MissionEngine.getMissionStatus(missionId);
                if (status === "available") return "available";
            }
            for (let i = 0; i < this.missions.length; i++) {
                const missionId = this.missions[i];
                const status = MissionEngine.getMissionStatus(missionId);
                if (status === "active") return "in_progress";
            }
            return null;
        }

        render(ctx, camera) {
            if (camera) {
                const rx = this.x - 50;
                const ry = this.y - 60;
                const rw = 100;
                const rh = 120;
                if (typeof camera.isVisible === "function") {
                    if (!camera.isVisible({ x: rx, y: ry, width: rw, height: rh })) return;
                } else if (camera.getVisibleBounds) {
                    const vb = camera.getVisibleBounds();
                    if (vb && (rx + rw < vb.left || rx > vb.right || ry + rh < vb.top || ry > vb.bottom)) {
                        return;
                    }
                }
            }

            const reducedMotion = window.StrativoWorldGraphics ? window.StrativoWorldGraphics.isReducedMotion() : false;
            const glowEnabled = window.StrativoWorldGraphics ? window.StrativoWorldGraphics.isGraphicsEffectEnabled("glow") : true;
            const showQuestMarkers = window.StrativoWorldSettings ? window.StrativoWorldSettings.getSetting("gameplay.showQuestMarkers", true) : true;

            const bobOffset = reducedMotion ? 0 : Math.sin(this.bobTimer) * 4;

            ctx.save();
            ctx.translate(this.x, this.y);

            // 1. Holographic Base Pedestal
            ctx.save();
            ctx.scale(1, 0.45);
            ctx.beginPath();
            ctx.arc(0, 30, 24, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
            ctx.fill();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = this.themeColor;
            if (glowEnabled) {
                ctx.shadowColor = this.themeColor;
                ctx.shadowBlur = 12;
            }
            ctx.stroke();

            // Inner Rotating Ring
            ctx.beginPath();
            ctx.arc(0, 30, 15, 0, Math.PI * 2);
            ctx.strokeStyle = this.secondaryColor;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();

            // 2. Interaction Range Halo (when player is near)
            if (this.isNearby) {
                ctx.save();
                ctx.scale(1, 0.45);
                ctx.beginPath();
                ctx.arc(0, 30, this.interactionRadius, 0, Math.PI * 2);
                ctx.strokeStyle = this.themeColor;
                ctx.lineWidth = 1.5;
                ctx.setLineDash([6, 6]);
                ctx.stroke();
                ctx.restore();
            }

            // 3. Stylized Cybernetic Avatar Silhouette
            ctx.save();
            ctx.translate(0, bobOffset);

            // Aura glow
            if (glowEnabled) {
                ctx.shadowColor = this.themeColor;
                ctx.shadowBlur = 14;
            }

            // Outer Cloak/Armor Body
            ctx.beginPath();
            ctx.roundRect(-14, -28, 28, 38, 8);
            ctx.fillStyle = "#0F172A";
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = this.themeColor;
            ctx.stroke();

            // Cyber Visor / Core Emblem
            ctx.beginPath();
            ctx.arc(0, -38, 12, 0, Math.PI * 2);
            ctx.fillStyle = "#1E293B";
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = this.secondaryColor;
            ctx.stroke();

            // Glowing Visor Eye line
            ctx.beginPath();
            ctx.roundRect(-7, -40, 14, 4, 2);
            ctx.fillStyle = this.themeColor;
            ctx.fill();

            // Chest Core Pulse
            ctx.beginPath();
            ctx.arc(0, -14, 4.5, 0, Math.PI * 2);
            ctx.fillStyle = this.secondaryColor;
            ctx.fill();

            ctx.restore();

            // 4. Floating Holographic Quest Marker
            if (showQuestMarkers) {
                const qStatus = this.getQuestStatus();
                if (qStatus) {
                    ctx.save();
                    const markerY = -64 + (reducedMotion ? 0 : Math.sin(this.pulseTimer * 2) * 3);
                    ctx.translate(0, markerY);

                    let markerChar = "!";
                    let markerBg = this.themeColor;
                    let markerTextCol = "#030712";

                    if (qStatus === "ready_to_claim") {
                        markerChar = "?";
                        markerBg = "#FCD34D"; // Gold
                        markerTextCol = "#030712";
                    } else if (qStatus === "in_progress") {
                        markerChar = "…";
                        markerBg = "rgba(30, 41, 59, 0.9)";
                        markerTextCol = this.themeColor;
                    }

                    // Diamond / Circle Marker Badge
                    ctx.beginPath();
                    ctx.arc(0, 0, 12, 0, Math.PI * 2);
                    ctx.fillStyle = markerBg;
                    ctx.fill();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = "#FFFFFF";
                    if (glowEnabled) {
                        ctx.shadowColor = markerBg;
                        ctx.shadowBlur = 10;
                    }
                    ctx.stroke();

                    // Text
                    ctx.fillStyle = markerTextCol;
                    ctx.font = "bold 13px system-ui, sans-serif";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(markerChar, 0, 0);

                    ctx.restore();
                }
            }

            // 5. Floating Nameplate & Role Badge
            ctx.save();
            ctx.font = "bold 11px system-ui, sans-serif";
            ctx.textAlign = "center";

            // Name background pill
            const nameWidth = ctx.measureText(this.name).width + 16;
            ctx.beginPath();
            ctx.roundRect(-nameWidth / 2, -18, nameWidth, 16, 4);
            ctx.fillStyle = "rgba(3, 7, 18, 0.85)";
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
            ctx.stroke();

            // Name text
            ctx.fillStyle = "#F8FAFC";
            ctx.fillText(this.name, 0, -6);

            // Proximity Talk Prompt [E] TALK
            if (this.isNearby) {
                const promptY = 28;
                ctx.font = "bold 10px system-ui, sans-serif";
                const promptText = "[E] TALK";
                const promptWidth = ctx.measureText(promptText).width + 12;

                ctx.beginPath();
                ctx.roundRect(-promptWidth / 2, promptY, promptWidth, 16, 4);
                ctx.fillStyle = this.themeColor;
                ctx.fill();

                ctx.fillStyle = "#030712";
                ctx.fillText(promptText, 0, promptY + 12);
            }

            ctx.restore();
            ctx.restore();
        }

        interact() {
            if (this.customInteract) {
                return this.customInteract(this);
            }

            if (typeof window !== "undefined" && window.StrativoRPG.MissionEngine) {
                return window.StrativoRPG.MissionEngine.handleNPCInteraction(this);
            }
        }
    }

    class NPCManager {
        constructor() {
            this.npcs = new Map();
        }

        addNPC(config) {
            const npc = new NPC(config);
            this.npcs.set(npc.id, npc);
            return npc;
        }

        getNPC(id) {
            return this.npcs.get(id) || null;
        }

        getAllNPCs() {
            return Array.from(this.npcs.values());
        }

        clear() {
            this.npcs.clear();
        }

        updateAll(dt, playerPos) {
            this.npcs.forEach(npc => npc.update(dt, playerPos));
        }

        renderAll(ctx, camera) {
            this.npcs.forEach(npc => npc.render(ctx, camera));
        }

        getNearbyNPC() {
            let closest = null;
            let minDist = Infinity;
            this.npcs.forEach(npc => {
                if (npc.isNearby && npc.distanceToPlayer < minDist) {
                    minDist = npc.distanceToPlayer;
                    closest = npc;
                }
            });
            return closest;
        }
    }

    window.StrativoRPG.NPC = NPC;
    window.StrativoRPG.NPCManager = NPCManager;

    if (typeof module !== "undefined" && module.exports) {
        module.exports = { NPC, NPCManager };
    }
})();
