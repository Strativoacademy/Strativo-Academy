/* ==========================================================================
   STRATIVO WORLD — DISTRICT 6: PSYCHOLOGY ZONE WORLD ENGINE
   Version: 1.0.0 (Phase 6.0 Psychology Zone World Engine V1)
   Namespace: StrativoRPG.PsychologyZoneWorld
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
    let MAP_CONFIG = {
        version: "1.0.0",
        districtId: "psychology-zone",
        districtName: "Psychology Zone",
        bounds: { width: 3200, height: 2400 },
        spawn: { x: 1600, y: 1350, direction: "up" },
        theme: {
            primary: "#8B5CF6",
            secondary: "#06B6D4",
            accent: "#EC4899",
            danger: "#F43F5E",
            emerald: "#10B981",
            amber: "#F59E0B",
            darkBg: "#030712",
            roadBg: "#0B0F19",
            sidewalkBg: "#111827",
            buildingWall: "#1E1B4B",
            buildingRoof: "#0F172A"
        },
        quarters: [],
        roads: [],
        buildings: [],
        landmarks: [],
        explorationPoints: [],
        npcs: [],
        ambientNpcs: [],
        marketBoards: [],
        interiors: {}
    };

    class PsychologyZoneWorld {
        constructor(config = {}) {
            this.mapConfig = Object.keys(MAP_CONFIG.buildings).length > 0 ? MAP_CONFIG : config;
            this.width = 3200;
            this.height = 2400;
            this.mapWidth = 3200;
            this.mapHeight = 2400;
            this.bounds = { x: 0, y: 0, width: this.width, height: this.height };
            this.spawn = { x: 1600, y: 1350, direction: "up" };
            this.quarters = this.mapConfig.quarters || [];
            this.buildings = this.mapConfig.buildings || [];
            this.landmarks = this.mapConfig.landmarks || [];
            this.explorationPoints = this.mapConfig.explorationPoints || [];
            this.marketBoards = this.mapConfig.marketBoards || [];
            this.npcs = this.mapConfig.npcs || [];
            this.interiors = Object.values(this.mapConfig.interiors || {});
            this.currentInterior = null;
            this.returnCoords = { x: 1600, y: 1350 };
            this.activePrompt = null;
            this.exploredPoints = new Set();
            this.colliders = [];
            this.interactiveObjects = [];

            this.initColliders();
            this.loadExploredState();
        }

        setMapData(data) {
            if (!data) return;
            MAP_CONFIG = data;
            this.mapConfig = data;
            this.quarters = data.quarters || [];
            this.buildings = data.buildings || [];
            this.landmarks = data.landmarks || [];
            this.explorationPoints = data.explorationPoints || [];
            this.marketBoards = data.marketBoards || [];
            this.npcs = data.npcs || [];
            this.interiors = Object.values(data.interiors || {});
            this.initColliders();
        }

        initColliders() {
            this.colliders = [];
            this.interactiveObjects = [];

            if (this.currentInterior) {
                const int = (this.mapConfig.interiors && this.mapConfig.interiors[this.currentInterior]) || {};
                const intW = int.width || 1200;
                const intH = int.height || 800;

                // Interior boundary walls
                this.colliders.push(new Rectangle(0, 0, intW, 30, "wall_top"));
                this.colliders.push(new Rectangle(0, intH - 30, intW, 30, "wall_bottom"));
                this.colliders.push(new Rectangle(0, 0, 30, intH, "wall_left"));
                this.colliders.push(new Rectangle(intW - 30, 0, 30, intH, "wall_right"));

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
                        category: "STATION",
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
                    this.colliders.push(new Rectangle(int.npc.x - 20, int.npc.y - 20, 40, 40, "npc_int_col_" + int.npc.id));
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
                                    role: int.npc.role,
                                    avatarIcon: int.npc.avatarIcon || "fa-user",
                                    themeColor: int.npc.themeColor || "#8B5CF6",
                                    text: int.npc.dialogue
                                });
                            }
                        },
                        prompt: `Talk to ${int.npc.name} [E]`
                    });
                }
                return;
            }

            // OUTDOOR 3200x2400 CITY MAP

            // 1. Boundary walls
            this.colliders.push(new Rectangle(0, 0, this.width, 40, "border_top"));
            this.colliders.push(new Rectangle(0, this.height - 40, this.width, 40, "border_bottom"));
            this.colliders.push(new Rectangle(0, 0, 40, this.height, "border_left"));
            this.colliders.push(new Rectangle(this.width - 40, 0, 40, this.height, "border_right"));

            // 2. Buildings & Entrances
            (this.mapConfig.buildings || []).forEach(bld => {
                this.colliders.push(new Rectangle(bld.x, bld.y, bld.w, bld.h, "bld_col_" + bld.id));
                if (bld.entrance) {
                    this.interactiveObjects.push({
                        id: "ent_" + bld.id,
                        name: bld.name,
                        category: "BUILDING",
                        x: bld.entrance.x + bld.entrance.w / 2,
                        y: bld.entrance.y + bld.entrance.h / 2,
                        radius: 75,
                        action: () => {
                            this.enterInterior(bld.interiorId, { x: bld.entrance.x + bld.entrance.w / 2, y: bld.entrance.y + 60 });
                        },
                        prompt: bld.promptText || `Enter ${bld.name} [E]`
                    });
                }
            });

            // 3. Landmarks
            (this.mapConfig.landmarks || []).forEach(lm => {
                this.colliders.push(new Rectangle(lm.x - lm.w / 2, lm.y - lm.h / 2, lm.w, lm.h, "lm_col_" + lm.id));
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
                                avatarIcon: lm.icon || "fa-brain",
                                themeColor: lm.color || "#8B5CF6",
                                text: lm.lore
                            });
                        }
                    },
                    prompt: `Inspect ${lm.name} [E]`
                });
            });

            // 4. Primary NPCs
            (this.mapConfig.npcs || []).forEach(npc => {
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
                                themeColor: npc.themeColor || "#8B5CF6",
                                text: npc.dialogue
                            });
                        }
                    },
                    prompt: `Talk to ${npc.name} [E]`
                });
            });

            // 5. Exploration Points
            (this.mapConfig.explorationPoints || []).forEach(exp => {
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

            // 6. Market & Emotional Data Boards
            (this.mapConfig.marketBoards || []).forEach(mb => {
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
                                role: "Neuro-Trading Telemetry",
                                avatarIcon: "fa-gauge-high",
                                themeColor: "#06B6D4",
                                text: `<strong>${mb.metric}:</strong> ${mb.value}<br>Status: <span style="color:#10B981;">${mb.status}</span>`
                            });
                        }
                    },
                    prompt: `Read ${mb.name} [E]`
                });
            });

            // 7. Ambient NPCs
            (this.mapConfig.ambientNpcs || []).forEach(amb => {
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
                                themeColor: amb.themeColor || "#06B6D4",
                                text: `Stay centered! Emotional discipline is your armor in the Psychology Zone.`
                            });
                        }
                    },
                    prompt: `Talk to ${amb.name} [E]`
                });
            });
        }

        getNearestInteractable(px, py, maxDist = 80) {
            let best = null;
            let bestDist = Infinity;
            this.interactiveObjects.forEach(obj => {
                let ox = obj.x;
                let oy = obj.y;
                if (obj.id && obj.id.startsWith("amb_")) {
                    const liveAmb = (this.mapConfig.ambientNpcs || []).find(a => a.id === obj.id);
                    if (liveAmb) {
                        ox = liveAmb.x;
                        oy = liveAmb.y;
                    }
                }
                const dist = Math.hypot(px - ox, py - oy);
                const maxRadius = obj.radius || maxDist;
                if (dist <= maxRadius) {
                    let effectiveDist = dist;
                    if (obj.category === "NPC_TALK") effectiveDist *= 0.6; // Priority to NPCs
                    else if (obj.category === "STATION") effectiveDist *= 0.7;
                    else if (obj.category === "BUILDING") effectiveDist *= 0.8;
                    if (effectiveDist < bestDist) {
                        bestDist = effectiveDist;
                        best = obj;
                    }
                }
            });
            return best;
        }

        renderMinimap() {
            const miniCanvas = document.getElementById("psych-minimap-canvas");
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
                mctx.fillStyle = b.themeColor || "#8B5CF6";
                mctx.fillRect(b.x * scaleX, b.y * scaleY, b.w * scaleX, b.h * scaleY);
            });

            const player = window.StrativoRPG.gameCore ? window.StrativoRPG.gameCore.player : null;
            if (player) {
                mctx.fillStyle = "#06B6D4";
                mctx.beginPath();
                mctx.arc(player.x * scaleX, player.y * scaleY, 4, 0, Math.PI * 2);
                mctx.fill();
            }
        }

        enterInterior(interiorId, returnCoords = null) {
            const int = (this.mapConfig.interiors && this.mapConfig.interiors[interiorId]) || null;
            if (!int) return;
            if (returnCoords) this.returnCoords = returnCoords;

            this.currentInterior = interiorId;
            this.width = int.width || 1200;
            this.height = int.height || 800;
            this.bounds = { x: 0, y: 0, width: this.width, height: this.height };

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
            this.width = 3200;
            this.height = 2400;
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
                const saved = localStorage.getItem("strativo_psychzone_explored");
                if (saved) {
                    this.exploredPoints = new Set(JSON.parse(saved));
                }
            } catch {}
            this.updateExploredUI();
        }

        saveExploredState() {
            try {
                localStorage.setItem("strativo_psychzone_explored", JSON.stringify(Array.from(this.exploredPoints)));
            } catch {}
            this.updateExploredUI();
        }

        updateExploredUI() {
            const countEl = document.getElementById("minimap-explored-count");
            if (countEl) {
                countEl.textContent = `${this.exploredPoints.size} / ${(this.mapConfig.explorationPoints || []).length}`;
            }
        }

        claimExploration(exp) {
            const isNew = !this.exploredPoints.has(exp.id);
            if (isNew) {
                this.exploredPoints.add(exp.id);
                this.saveExploredState();
                if (window.StrativoWorldXPEngine && typeof window.StrativoWorldXPEngine.addWorldXP === "function") {
                    window.StrativoWorldXPEngine.addWorldXP(exp.xp || 15, `Discovered: ${exp.name}`, "psych_exp_" + exp.id);
                }
                window.StrativoRPG.emitGameEvent("explorationFound");
            }

            const modal = document.getElementById("psych-discovery-modal");
            if (modal) {
                const hEl = document.getElementById("psych-discovery-heading");
                const lEl = document.getElementById("psych-discovery-lore");
                const xEl = document.getElementById("psych-discovery-xp");
                if (hEl) hEl.textContent = exp.name;
                if (lEl) lEl.textContent = exp.lore;
                if (xEl) xEl.textContent = isNew ? `+${exp.xp || 15} World XP (Discovered!)` : `Explored (+${exp.xp || 15} XP Claimed)`;
                modal.classList.add("active");
                modal.setAttribute("aria-hidden", "false");
            }
        }

        update(dt) {
            // Update ambient NPCs with waypoint patrol
            if (!this.currentInterior) {
                (this.mapConfig.ambientNpcs || []).forEach(a => {
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

            const player = window.StrativoRPG.gameCore ? window.StrativoRPG.gameCore.player : null;
            if (!player) return;

            const nearest = this.getNearestInteractable(player.x, player.y, 80);
            this.activePrompt = nearest;
            this.updatePromptUI(nearest);
        }

        updatePromptUI(closest) {
            const banner = document.getElementById("psych-prompt-banner");
            const textEl = document.getElementById("psych-prompt-text");
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
                    console.error("Strativo RPG Psychology: Interaction exception", err);
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

            // Background
            ctx.fillStyle = MAP_CONFIG.theme.darkBg;
            ctx.fillRect(vx, vy, vw, vh);

            // Cyber Neural Grid
            ctx.strokeStyle = "rgba(139, 92, 246, 0.05)";
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

            // Roads
            (this.mapConfig.roads || []).forEach(r => {
                ctx.fillStyle = MAP_CONFIG.theme.roadBg;
                ctx.fillRect(r.x, r.y, r.w, r.h);

                // Road Borders
                ctx.strokeStyle = "rgba(139, 92, 246, 0.25)";
                ctx.lineWidth = 2;
                ctx.strokeRect(r.x, r.y, r.w, r.h);

                // Center dashed lines
                ctx.strokeStyle = "rgba(6, 182, 212, 0.35)";
                ctx.lineWidth = 2;
                ctx.setLineDash([12, 12]);
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

            // Quarters overlay borders
            (this.mapConfig.quarters || []).forEach(q => {
                ctx.strokeStyle = q.color + "30";
                ctx.lineWidth = 2;
                ctx.strokeRect(q.bounds.x, q.bounds.y, q.bounds.w, q.bounds.h);

                ctx.fillStyle = q.color + "70";
                ctx.font = "bold 13px Inter, sans-serif";
                ctx.fillText(q.name, q.bounds.x + 20, q.bounds.y + 30);
            });

            // Buildings
            (this.mapConfig.buildings || []).forEach(b => {
                // Drop shadow
                ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
                ctx.fillRect(b.x + 10, b.y + 10, b.w, b.h);

                // Main Building Wall
                ctx.fillStyle = MAP_CONFIG.theme.buildingWall;
                ctx.fillRect(b.x, b.y, b.w, b.h);

                // Roof Accent
                ctx.fillStyle = MAP_CONFIG.theme.buildingRoof;
                ctx.fillRect(b.x + 10, b.y + 10, b.w - 20, b.h - 20);

                // Border Glow
                ctx.strokeStyle = b.themeColor || "#8B5CF6";
                ctx.lineWidth = 2;
                ctx.strokeRect(b.x, b.y, b.w, b.h);

                // Building Name
                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 13px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(b.name, b.x + b.w / 2, b.y + b.h / 2 - 5);

                ctx.fillStyle = b.themeColor || "#8B5CF6";
                ctx.font = "11px Inter, sans-serif";
                ctx.fillText(b.subtitle || "", b.x + b.w / 2, b.y + b.h / 2 + 15);
                ctx.textAlign = "left";

                // Entrance Door
                if (b.entrance) {
                    ctx.fillStyle = b.themeColor;
                    ctx.fillRect(b.entrance.x, b.entrance.y, b.entrance.w, b.entrance.h);
                    ctx.fillStyle = "#030712";
                    ctx.font = "bold 10px Inter, sans-serif";
                    ctx.fillText("DOOR [E]", b.entrance.x + 15, b.entrance.y + 14);
                }
            });

            // Landmarks
            (this.mapConfig.landmarks || []).forEach(lm => {
                ctx.fillStyle = lm.color + "25";
                ctx.beginPath();
                ctx.arc(lm.x, lm.y, lm.w / 2 + 10, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = lm.color;
                ctx.lineWidth = 3;
                ctx.strokeRect(lm.x - lm.w / 2, lm.y - lm.h / 2, lm.w, lm.h);

                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 11px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(lm.name, lm.x, lm.y + lm.h / 2 + 16);
                ctx.textAlign = "left";
            });

            // Exploration Beacons
            (this.mapConfig.explorationPoints || []).forEach(exp => {
                const isFound = this.exploredPoints.has(exp.id);
                ctx.fillStyle = isFound ? "#10B981" : "#EC4899";
                ctx.shadowColor = isFound ? "#10B981" : "#EC4899";
                ctx.shadowBlur = isFound ? 4 : 12;

                ctx.beginPath();
                ctx.arc(exp.x, exp.y, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                ctx.fillStyle = isFound ? "#A7F3D0" : "#FBCFE8";
                ctx.font = "10px Inter, sans-serif";
                ctx.fillText(exp.name, exp.x + 12, exp.y + 4);
            });

            // Market / Emotional Telemetry Boards
            (this.mapConfig.marketBoards || []).forEach(mb => {
                ctx.fillStyle = "#0B0F19";
                ctx.fillRect(mb.x - mb.w / 2, mb.y - mb.h / 2, mb.w, mb.h);
                ctx.strokeStyle = "#06B6D4";
                ctx.lineWidth = 1.5;
                ctx.strokeRect(mb.x - mb.w / 2, mb.y - mb.h / 2, mb.w, mb.h);

                ctx.fillStyle = "#06B6D4";
                ctx.font = "bold 10px Inter, sans-serif";
                ctx.fillText(mb.title, mb.x - mb.w / 2 + 6, mb.y - mb.h / 2 + 15);

                ctx.fillStyle = "#A5F3FC";
                ctx.font = "9px Inter, sans-serif";
                ctx.fillText(mb.value, mb.x - mb.w / 2 + 6, mb.y - mb.h / 2 + 32);
            });

            // Primary NPCs
            (this.mapConfig.npcs || []).forEach(npc => {
                ctx.fillStyle = npc.themeColor || "#8B5CF6";
                ctx.beginPath();
                ctx.arc(npc.x, npc.y, 14, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = "#FFFFFF";
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.fillStyle = "#F8FAFC";
                ctx.font = "bold 11px Inter, sans-serif";
                ctx.fillText(npc.name.split(" - ")[0], npc.x - 15, npc.y - 20);
            });

            // Ambient NPCs
            (this.mapConfig.ambientNpcs || []).forEach(amb => {
                ctx.fillStyle = amb.themeColor || "#06B6D4";
                ctx.beginPath();
                ctx.arc(amb.x, amb.y, 10, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = "#94A3B8";
                ctx.font = "10px Inter, sans-serif";
                ctx.fillText(amb.name, amb.x - 15, amb.y - 14);
            });
        }

        renderInterior(ctx, camera) {
            const int = (this.mapConfig.interiors && this.mapConfig.interiors[this.currentInterior]) || {};
            const intW = int.width || 1200;
            const intH = int.height || 800;

            // Interior Floor
            ctx.fillStyle = "#0B0F19";
            ctx.fillRect(0, 0, intW, intH);

            // Interior Cyber Floor Grid
            ctx.strokeStyle = "rgba(139, 92, 246, 0.12)";
            ctx.lineWidth = 1;
            for (let x = 0; x < intW; x += 60) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, intH);
                ctx.stroke();
            }
            for (let y = 0; y < intH; y += 60) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(intW, y);
                ctx.stroke();
            }

            // Interior Boundary Wall
            ctx.strokeStyle = int.themeColor || "#8B5CF6";
            ctx.lineWidth = 6;
            ctx.strokeRect(3, 3, intW - 6, intH - 6);

            // Interior Name Banner
            ctx.fillStyle = int.themeColor || "#8B5CF6";
            ctx.font = "bold 18px Inter, sans-serif";
            ctx.fillText(int.name || "Interior", 50, 60);

            // Exit Door
            if (int.exit) {
                ctx.fillStyle = "#F43F5E";
                ctx.fillRect(int.exit.x - int.exit.w / 2, int.exit.y - int.exit.h / 2, int.exit.w, int.exit.h);
                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 12px Inter, sans-serif";
                ctx.fillText("EXIT DOOR [E]", int.exit.x - 45, int.exit.y + 5);
            }

            // Stations
            (int.stations || []).forEach(st => {
                ctx.fillStyle = "#1E1B4B";
                ctx.fillRect(st.x, st.y, st.w, st.h);
                ctx.strokeStyle = int.themeColor || "#8B5CF6";
                ctx.lineWidth = 2;
                ctx.strokeRect(st.x, st.y, st.w, st.h);

                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 12px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(st.name, st.x + st.w / 2, st.y + st.h / 2 - 5);
                ctx.fillStyle = "#06B6D4";
                ctx.font = "11px Inter, sans-serif";
                ctx.fillText("[E] Interact", st.x + st.w / 2, st.y + st.h / 2 + 15);
                ctx.textAlign = "left";
            });

            // Interior NPC
            if (int.npc) {
                ctx.fillStyle = int.npc.themeColor || "#8B5CF6";
                ctx.beginPath();
                ctx.arc(int.npc.x, int.npc.y, 16, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#FFFFFF";
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.fillStyle = "#F8FAFC";
                ctx.font = "bold 13px Inter, sans-serif";
                ctx.fillText(`${int.npc.name} (${int.npc.role})`, int.npc.x - 60, int.npc.y - 24);
            }
        }
    }

    window.StrativoRPG.PsychologyZoneWorld = PsychologyZoneWorld;
    if (typeof module !== "undefined" && module.exports) {
        module.exports = PsychologyZoneWorld;
    }
})();
