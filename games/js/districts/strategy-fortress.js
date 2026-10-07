/* ==========================================================================
   STRATIVO WORLD — DISTRICT 7: STRATEGY FORTRESS WORLD ENGINE (V2 RPG REBUILD)
   Namespace: StrativoRPG.StrategyFortressWorld
   Description:
   - 3600x2800 2D Citadel RPG Environment with 2.5D architecture
   - 8 Quarters, 14 Real Buildings with Facades, Windows, Roofs, and Doorways
   - Cobblestone Paving, Raised Sidewalks, Asphalt Roads, Crossings, Markings
   - Fortress Gates, Twin Towers, Confluence Plaza Obelisk, Fountains, Braziers
   - 2.5D Character Avatars with Robes, Armor, Idle Bob, and [E] Quest Markers
   - Single Authoritative Reset Lifecycle & Modal Physics Freeze Guard
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

    let MAP_CONFIG = {
        id: "strategy_fortress",
        districtId: "strategy_fortress",
        width: 3600,
        height: 2800,
        bounds: { minX: 0, minY: 0, maxX: 3600, maxY: 2800, width: 3600, height: 2800 },
        spawn: { x: 1800, y: 2550, direction: "up" },
        theme: {
            primary: "#FCD34D",
            secondary: "#F59E0B",
            accent: "#EF4444",
            darkBg: "#020617",
            roadBg: "#0B1120",
            sidewalkBg: "#0F172A",
            wallColor: "#1E293B",
            roofColor: "#0F172A"
        },
        quarters: [],
        roads: [],
        sidewalks: [],
        buildings: [],
        landmarks: [],
        explorationPoints: [],
        npcs: [],
        ambientNpcs: [],
        streetProps: [],
        marketBoards: [],
        interiors: {}
    };

    class StrategyFortressWorld {
        constructor(config = {}) {
            this.mapConfig = Object.keys(MAP_CONFIG.buildings).length > 0 ? MAP_CONFIG : config;
            this.width = 3600;
            this.height = 2800;
            this.mapWidth = 3600;
            this.mapHeight = 2800;
            this.bounds = { x: 0, y: 0, width: this.width, height: this.height };
            this.spawn = { x: 1800, y: 2550, direction: "up" };
            this.quarters = this.mapConfig.quarters || [];
            this.roads = this.mapConfig.roads || [];
            this.sidewalks = this.mapConfig.sidewalks || [];
            this.buildings = this.mapConfig.buildings || [];
            this.landmarks = this.mapConfig.landmarks || [];
            this.explorationPoints = this.mapConfig.explorationPoints || [];
            this.marketBoards = this.mapConfig.marketBoards || [];
            this.npcs = this.mapConfig.npcs || [];
            this.ambientNpcs = this.mapConfig.ambientNpcs || [];
            this.streetProps = this.mapConfig.streetProps || [];
            this.interiors = Object.values(this.mapConfig.interiors || {});
            this.currentInterior = null;
            this.returnCoords = { x: 1800, y: 2550 };
            this.activePrompt = null;
            this.exploredPoints = new Set();
            this.colliders = [];
            this.interactiveObjects = [];
            this.animTimer = 0;

            this.initColliders();
            this.loadExploredState();
        }

        setMapData(data) {
            if (!data) return;
            MAP_CONFIG = data;
            this.mapConfig = data;
            this.quarters = data.quarters || [];
            this.roads = data.roads || [];
            this.sidewalks = data.sidewalks || [];
            this.buildings = data.buildings || [];
            this.landmarks = data.landmarks || [];
            this.explorationPoints = data.explorationPoints || [];
            this.marketBoards = data.marketBoards || [];
            this.npcs = data.npcs || [];
            this.ambientNpcs = data.ambientNpcs || [];
            this.streetProps = data.streetProps || [];
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
                        name: "Exit to Citadel",
                        x: int.exit.x + int.exit.w / 2,
                        y: int.exit.y + int.exit.h / 2,
                        radius: 65,
                        action: () => this.exitInterior(),
                        prompt: "Press [E] to Exit Citadel"
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
                        radius: 75,
                        action: () => {
                            if (window.StrativoRPG && window.StrativoRPG[st.action]) {
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
                        radius: 80,
                        action: () => {
                            if (window.StrativoRPG.DialogueManager) {
                                window.StrativoRPG.DialogueManager.startDialogue({
                                    speaker: int.npc.name,
                                    role: int.npc.role,
                                    avatarIcon: int.npc.avatarIcon || "fa-crown",
                                    themeColor: int.npc.themeColor || "#FCD34D",
                                    text: int.npc.dialogue
                                });
                            }
                        },
                        prompt: `Speak with ${int.npc.name} [E]`
                    });
                }
                return;
            }

            // OUTDOOR 3600x2800 CITADEL MAP

            // 1. Boundary Perimeter Wall Colliders
            this.colliders.push(new Rectangle(0, 0, this.width, 50, "border_top"));
            this.colliders.push(new Rectangle(0, this.height - 50, this.width, 50, "border_bottom"));
            this.colliders.push(new Rectangle(0, 0, 50, this.height, "border_left"));
            this.colliders.push(new Rectangle(this.width - 50, 0, 50, this.height, "border_right"));

            // 2. Buildings & Physical Entrances
            (this.mapConfig.buildings || []).forEach(bld => {
                this.colliders.push(new Rectangle(bld.x, bld.y, bld.w, bld.h, "bld_col_" + bld.id));
                if (bld.entrance) {
                    this.interactiveObjects.push({
                        id: "ent_" + bld.id,
                        name: bld.name,
                        category: "BUILDING",
                        x: bld.entrance.x + bld.entrance.w / 2,
                        y: bld.entrance.y + bld.entrance.h / 2,
                        radius: 85,
                        action: () => {
                            this.enterInterior(bld.interiorId, { x: bld.entrance.x + bld.entrance.w / 2, y: bld.entrance.y + 60 });
                        },
                        prompt: bld.promptText || `Enter ${bld.name} [E]`
                    });
                }
            });

            // 3. Landmarks
            (this.mapConfig.landmarks || []).forEach(lm => {
                const lw = lm.w || 60;
                const lh = lm.h || 60;
                this.colliders.push(new Rectangle(lm.x - lw / 2, lm.y - lh / 2, lw, lh, "lm_col_" + lm.id));
                this.interactiveObjects.push({
                    id: lm.id,
                    name: lm.name,
                    category: "LANDMARK",
                    x: lm.x,
                    y: lm.y,
                    radius: 90,
                    action: () => {
                        if (window.StrativoRPG.DialogueManager) {
                            window.StrativoRPG.DialogueManager.startDialogue({
                                speaker: lm.name,
                                role: "Citadel Landmark",
                                avatarIcon: lm.icon || "fa-crown",
                                themeColor: lm.color || "#FCD34D",
                                text: lm.lore
                            });
                        }
                    },
                    prompt: `Inspect ${lm.name} [E]`
                });
            });

            // 4. Primary NPCs
            (this.mapConfig.npcs || []).forEach(npc => {
                this.colliders.push(new Rectangle(npc.x - 22, npc.y - 22, 44, 44, "npc_col_" + npc.id));
                this.interactiveObjects.push({
                    id: npc.id,
                    name: npc.name,
                    category: "NPC_TALK",
                    x: npc.x,
                    y: npc.y,
                    radius: 85,
                    action: () => {
                        if (window.StrativoRPG.DialogueManager) {
                            window.StrativoRPG.DialogueManager.startDialogue({
                                speaker: npc.name,
                                role: npc.role,
                                avatarIcon: npc.avatarIcon || "fa-crown",
                                themeColor: npc.themeColor || "#FCD34D",
                                text: npc.dialogue
                            });
                        }
                    },
                    prompt: `Speak with ${npc.name.split(" - ")[0]} [E]`
                });
            });

            // 5. Exploration Nodes
            (this.mapConfig.explorationPoints || []).forEach(exp => {
                this.interactiveObjects.push({
                    id: exp.id,
                    name: exp.name,
                    category: "EXPLORATION",
                    x: exp.x,
                    y: exp.y,
                    radius: 65,
                    action: () => this.claimExploration(exp),
                    prompt: `Study ${exp.name} [E]`
                });
            });
        }

        getNearestInteractable(px, py, maxDist = 85) {
            let closest = null;
            let minDist = maxDist;

            this.interactiveObjects.forEach(obj => {
                const dist = Math.hypot(obj.x - px, obj.y - py);
                const reqRadius = obj.radius || maxDist;
                if (dist < reqRadius && dist < minDist) {
                    minDist = dist;
                    closest = obj;
                }
            });

            return closest;
        }

        enterInterior(interiorId, returnPoint) {
            const int = this.mapConfig.interiors && this.mapConfig.interiors[interiorId];
            if (!int) {
                console.warn(`[StrategyFortress] Interior not found: ${interiorId}`);
                return;
            }

            if (returnPoint) {
                this.returnCoords = returnPoint;
            }

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
            this.width = 3600;
            this.height = 2800;
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
                const saved = localStorage.getItem("strativo_strategy_explored");
                if (saved) {
                    this.exploredPoints = new Set(JSON.parse(saved));
                }
            } catch {}
            this.updateExploredUI();
        }

        saveExploredState() {
            try {
                localStorage.setItem("strativo_strategy_explored", JSON.stringify(Array.from(this.exploredPoints)));
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
                    window.StrativoWorldXPEngine.addWorldXP(exp.xp || 20, `Explored: ${exp.name}`, "strat_exp_" + exp.id);
                }
                window.StrativoRPG.emitGameEvent("explorationFound");
            }

            const modal = document.getElementById("fortress-discovery-modal");
            if (modal) {
                const hEl = document.getElementById("fortress-discovery-heading");
                const lEl = document.getElementById("fortress-discovery-lore");
                const xEl = document.getElementById("fortress-discovery-xp");
                if (hEl) hEl.textContent = exp.name;
                if (lEl) lEl.textContent = exp.lore;
                if (xEl) xEl.textContent = isNew ? `+${exp.xp || 20} World XP (Discovered!)` : `Explored (+${exp.xp || 20} XP Claimed)`;
                modal.classList.add("active");
                modal.setAttribute("aria-hidden", "false");
            }
        }

        update(dt) {
            this.animTimer += dt;

            // Ambient NPC Waypoint Patrol
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

            const nearest = this.getNearestInteractable(player.x, player.y, 85);
            this.activePrompt = nearest;
            this.updatePromptUI(nearest);
        }

        updatePromptUI(closest) {
            const banner = document.getElementById("fortress-prompt-banner");
            const textEl = document.getElementById("fortress-prompt-text");
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
                    console.error("Strativo RPG Strategy Fortress: Interaction exception", err);
                    return false;
                }
            }
            return false;
        }

        render(ctx, camera) {
            if (this.currentInterior) {
                this.renderInterior(ctx, camera);
            } else {
                this.renderCitadel(ctx, camera);
            }
        }

        renderCitadel(ctx, camera) {
            const vx = camera.x;
            const vy = camera.y;
            const vw = camera.viewportWidth;
            const vh = camera.viewportHeight;

            // 1. Base Dark Ground
            ctx.fillStyle = MAP_CONFIG.theme.darkBg;
            ctx.fillRect(vx, vy, vw, vh);

            // 2. Cobblestone Paving Grid Texture
            ctx.strokeStyle = "rgba(252, 211, 77, 0.04)";
            ctx.lineWidth = 1;
            const tileSize = 60;
            const startX = Math.floor(vx / tileSize) * tileSize;
            const startY = Math.floor(vy / tileSize) * tileSize;

            for (let x = startX; x < vx + vw; x += tileSize) {
                ctx.beginPath();
                ctx.moveTo(x, vy);
                ctx.lineTo(x, vy + vh);
                ctx.stroke();
            }
            for (let y = startY; y < vy + vh; y += tileSize) {
                ctx.beginPath();
                ctx.moveTo(vx, y);
                ctx.lineTo(vx + vw, y);
                ctx.stroke();
            }

            // 3. Quarters Ground Tint
            (this.mapConfig.quarters || []).forEach(q => {
                ctx.fillStyle = (q.color || "#FCD34D") + "08";
                ctx.fillRect(q.bounds.x, q.bounds.y, q.bounds.w, q.bounds.h);

                ctx.strokeStyle = (q.color || "#FCD34D") + "20";
                ctx.lineWidth = 2;
                ctx.strokeRect(q.bounds.x, q.bounds.y, q.bounds.w, q.bounds.h);

                ctx.fillStyle = (q.color || "#FCD34D") + "50";
                ctx.font = "bold 14px Inter, sans-serif";
                ctx.fillText(`🏰 ${q.name.toUpperCase()}`, q.bounds.x + 30, q.bounds.y + 45);
            });

            // 4. Sidewalks (Raised Slate Kerbs)
            (this.mapConfig.sidewalks || []).forEach(sw => {
                ctx.fillStyle = MAP_CONFIG.theme.sidewalkBg;
                ctx.fillRect(sw.x, sw.y, sw.w, sw.h);
                ctx.strokeStyle = "rgba(252, 211, 77, 0.15)";
                ctx.lineWidth = 1;
                ctx.strokeRect(sw.x, sw.y, sw.w, sw.h);
            });

            // 5. Roads & Imperial Avenues
            (this.mapConfig.roads || []).forEach(r => {
                ctx.fillStyle = MAP_CONFIG.theme.roadBg;
                ctx.fillRect(r.x, r.y, r.w, r.h);

                // Golden Kerb Line
                ctx.strokeStyle = "rgba(252, 211, 77, 0.35)";
                ctx.lineWidth = 2;
                ctx.strokeRect(r.x, r.y, r.w, r.h);

                // Center Lane Divider
                ctx.strokeStyle = "rgba(252, 211, 77, 0.4)";
                ctx.lineWidth = 2;
                ctx.setLineDash([16, 20]);
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

            // 6. Courtyards, Plazas & Landmarks
            this._renderCourtyards(ctx);

            // 7. 2.5D Buildings & Facades
            this._renderBuildings(ctx);

            // 8. Street Props, Braziers & Greenery
            this._renderStreetProps(ctx);

            // 9. Telemetry Boards
            this._renderTelemetryBoards(ctx);

            // 10. Exploration Beacons
            this._renderExplorationNodes(ctx);

            // 11. NPCs (2.5D Avatars)
            this._renderNPCs(ctx);

            // 12. Outer Fortress Perimeter Walls & Ramparts
            this._renderPerimeterFortifications(ctx);
        }

        _renderCourtyards(ctx) {
            // A. Grand Confluence Plaza (1800, 1420)
            const cx = 1800;
            const cy = 1420;
            const pulse = 0.5 + Math.sin(this.animTimer * 2.5) * 0.25;

            // Radial Glow Dais
            const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 220);
            grad.addColorStop(0, "rgba(252, 211, 77, 0.3)");
            grad.addColorStop(0.5, "rgba(245, 158, 11, 0.15)");
            grad.addColorStop(1, "rgba(2, 6, 23, 0)");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(cx, cy, 220, 0, Math.PI * 2);
            ctx.fill();

            // Outer Concentric Flagstone Paver Rings
            ctx.fillStyle = "#111827";
            ctx.strokeStyle = "rgba(252, 211, 77, 0.6)";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(cx, cy, 180, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Geometric Radial Paving Spokes
            ctx.strokeStyle = "rgba(252, 211, 77, 0.25)";
            ctx.lineWidth = 1.5;
            for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
                ctx.beginPath();
                ctx.moveTo(cx + Math.cos(a) * 70, cy + Math.sin(a) * 70);
                ctx.lineTo(cx + Math.cos(a) * 175, cy + Math.sin(a) * 175);
                ctx.stroke();
            }

            // Intermediate Stone Terrace Ring
            ctx.fillStyle = "#1E293B";
            ctx.strokeStyle = "#F59E0B";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(cx, cy, 120, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Inner Central Stone Dais
            ctx.fillStyle = "#0F172A";
            ctx.strokeStyle = "#FCD34D";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(cx, cy, 75, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Four Corner Plaza Water Fountains (North, South, East, West)
            const fountainDist = 145;
            const fountainAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
            fountainAngles.forEach(fa => {
                const fx = cx + Math.cos(fa) * fountainDist;
                const fy = cy + Math.sin(fa) * fountainDist;

                // Basin
                ctx.fillStyle = "#0284C7";
                ctx.strokeStyle = "#38BDF8";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(fx, fy, 16, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Animated Ripple
                const rip = Math.max(0.5, (((this.animTimer * 1.5 + fa) % 1 + 1) % 1) * 14);
                ctx.strokeStyle = "rgba(224, 242, 254, 0.6)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(fx, fy, rip, 0, Math.PI * 2);
                ctx.stroke();

                // Spout core
                ctx.fillStyle = "#BAE6FD";
                ctx.beginPath();
                ctx.arc(fx, fy, 4, 0, Math.PI * 2);
                ctx.fill();
            });

            // Confluence Obelisk Monolith
            ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            ctx.fillRect(cx - 24, cy - 40, 48, 80);

            // Obelisk Base & Shaft
            const obGrad = ctx.createLinearGradient(cx - 18, cy - 35, cx + 18, cy + 35);
            obGrad.addColorStop(0, "#FDE68A");
            obGrad.addColorStop(0.5, "#F59E0B");
            obGrad.addColorStop(1, "#B45309");
            ctx.fillStyle = obGrad;
            ctx.strokeStyle = "#FEF08A";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cx - 18, cy + 35);
            ctx.lineTo(cx - 12, cy - 35);
            ctx.lineTo(cx, cy - 50);
            ctx.lineTo(cx + 12, cy - 35);
            ctx.lineTo(cx + 18, cy + 35);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Glowing Inscription Runes
            ctx.fillStyle = "#030712";
            ctx.font = "bold 9px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("CONFLUENCE", cx, cy + 5);

            // Plaza Label Marquee
            ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
            ctx.strokeStyle = "#FCD34D";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(cx - 110, cy + 95, 220, 26, 6);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 11px Inter, sans-serif";
            ctx.fillText("GRAND CONFLUENCE PLAZA", cx, cy + 112);

            // B. Southern Fortress Gate Courtyard (1800, 2550)
            const gx = 1800;
            const gy = 2550;

            // Stone Moat Bridge Wooden Planks
            ctx.fillStyle = "#78350F";
            ctx.fillRect(gx - 80, gy - 200, 160, 240);
            ctx.strokeStyle = "#451A03";
            ctx.lineWidth = 1.5;
            for (let py = gy - 190; py < gy + 30; py += 16) {
                ctx.beginPath();
                ctx.moveTo(gx - 78, py);
                ctx.lineTo(gx + 78, py);
                ctx.stroke();
            }

            // Stone Balustrades on sides of Bridge
            ctx.fillStyle = "#334155";
            ctx.strokeStyle = "#FCD34D";
            ctx.lineWidth = 2;
            ctx.fillRect(gx - 90, gy - 200, 12, 240);
            ctx.strokeRect(gx - 90, gy - 200, 12, 240);
            ctx.fillRect(gx + 78, gy - 200, 12, 240);
            ctx.strokeRect(gx + 78, gy - 200, 12, 240);

            // Gate Stone Archway Base
            ctx.fillStyle = "#1E293B";
            ctx.strokeStyle = "#F59E0B";
            ctx.lineWidth = 3;
            ctx.fillRect(gx - 220, gy - 130, 440, 50);
            ctx.strokeRect(gx - 220, gy - 130, 440, 50);

            // Twin Heavy Barbican Guard Towers
            [-260, 180].forEach(tx => {
                // Tower Body
                ctx.fillStyle = "#0F172A";
                ctx.strokeStyle = "#FCD34D";
                ctx.lineWidth = 2;
                ctx.fillRect(gx + tx, gy - 180, 80, 110);
                ctx.strokeRect(gx + tx, gy - 180, 80, 110);

                // Tower Roof Crenellations
                ctx.fillStyle = "#1E293B";
                for (let k = 0; k < 4; k++) {
                    ctx.fillRect(gx + tx + 4 + k * 19, gy - 192, 12, 14);
                    ctx.strokeRect(gx + tx + 4 + k * 19, gy - 192, 12, 14);
                }

                // Tower Arrow Slits
                ctx.fillStyle = "#F59E0B";
                ctx.fillRect(gx + tx + 36, gy - 150, 8, 22);
            });

            // Heraldic Lion Banners
            [-240, 200].forEach(bx => {
                ctx.fillStyle = "#DC2626";
                ctx.fillRect(gx + bx, gy - 140, 40, 65);
                ctx.strokeStyle = "#FCD34D";
                ctx.lineWidth = 1.5;
                ctx.strokeRect(gx + bx, gy - 140, 40, 65);

                // Gold Lion/Crown Emblem
                ctx.fillStyle = "#FCD34D";
                ctx.beginPath();
                ctx.arc(gx + bx + 20, gy - 110, 10, 0, Math.PI * 2);
                ctx.fill();
            });

            // Portcullis Iron Grate in center gateway
            ctx.strokeStyle = "#94A3B8";
            ctx.lineWidth = 2;
            for (let px = gx - 60; px <= gx + 60; px += 15) {
                ctx.beginPath();
                ctx.moveTo(px, gy - 125);
                ctx.lineTo(px, gy - 85);
                ctx.stroke();
            }

            ctx.fillStyle = "#FCD34D";
            ctx.font = "bold 13px Inter, sans-serif";
            ctx.fillText("FORTRESS ENTRY GATEWAY", gx, gy - 95);
            ctx.textAlign = "left";
        }

        _renderBuildings(ctx) {
            (this.mapConfig.buildings || []).forEach(b => {
                const theme = b.themeColor || "#FCD34D";
                const accent = b.accentColor || "#F59E0B";

                // 1. Drop Shadow with 2.5D Depth
                ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
                ctx.beginPath();
                ctx.roundRect(b.x + 12, b.y + 16, b.w, b.h, 12);
                ctx.fill();

                // 2. Solid Stone Fortress Wall Base (Textured Gradient)
                const wallGrad = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.h);
                wallGrad.addColorStop(0, "#1E293B");
                wallGrad.addColorStop(0.4, "#111827");
                wallGrad.addColorStop(1, "#030712");
                ctx.fillStyle = wallGrad;
                ctx.strokeStyle = theme;
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.roundRect(b.x, b.y, b.w, b.h, 10);
                ctx.fill();
                ctx.stroke();

                // 3. Stone Brick Masonry Courses
                ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
                ctx.lineWidth = 1;
                const brickH = 20;
                const brickW = 40;
                for (let by = b.y + 10; by < b.y + b.h - 15; by += brickH) {
                    ctx.beginPath();
                    ctx.moveTo(b.x + 8, by);
                    ctx.lineTo(b.x + b.w - 8, by);
                    ctx.stroke();

                    const offset = ((by / brickH) % 2) * (brickW / 2);
                    for (let bx = b.x + 8 + offset; bx < b.x + b.w - 8; bx += brickW) {
                        ctx.beginPath();
                        ctx.moveTo(bx, by);
                        ctx.lineTo(bx, by + brickH);
                        ctx.stroke();
                    }
                }

                // 4. Four Corner Bastion Turrets
                const turretSize = 26;
                const corners = [
                    { x: b.x - 8, y: b.y - 8 },
                    { x: b.x + b.w - turretSize + 8, y: b.y - 8 },
                    { x: b.x - 8, y: b.y + b.h - turretSize + 8 },
                    { x: b.x + b.w - turretSize + 8, y: b.y + b.h - turretSize + 8 }
                ];
                corners.forEach(c => {
                    ctx.fillStyle = "#0F172A";
                    ctx.strokeStyle = theme;
                    ctx.lineWidth = 2;
                    ctx.fillRect(c.x, c.y, turretSize, turretSize);
                    ctx.strokeRect(c.x, c.y, turretSize, turretSize);

                    // Inner Turret Accent
                    ctx.fillStyle = accent;
                    ctx.fillRect(c.x + 6, c.y + 6, turretSize - 12, turretSize - 12);
                });

                // 5. Arched Medieval Windows with Glowing Amber/Gold Interior Light
                const winCount = Math.max(3, b.windows || 5);
                const winW = (b.w - 80) / winCount - 10;
                const winH = 34;
                const winY = b.y + 70;

                for (let w = 0; w < winCount; w++) {
                    const winX = b.x + 40 + w * (winW + 10);

                    // Window Frame & Sill
                    ctx.fillStyle = "#020617";
                    ctx.fillRect(winX - 2, winY - 4, winW + 4, winH + 8);

                    // Arched Glowing Stained Glass Pane
                    const winGrad = ctx.createLinearGradient(winX, winY, winX, winY + winH);
                    winGrad.addColorStop(0, "#FEF08A");
                    winGrad.addColorStop(0.5, theme);
                    winGrad.addColorStop(1, "#B45309");
                    ctx.fillStyle = winGrad;
                    ctx.beginPath();
                    ctx.roundRect(winX, winY, winW, winH, [10, 10, 2, 2]);
                    ctx.fill();

                    // Gothic Cross Mullions
                    ctx.strokeStyle = "#0F172A";
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(winX + winW / 2, winY);
                    ctx.lineTo(winX + winW / 2, winY + winH);
                    ctx.moveTo(winX, winY + winH * 0.45);
                    ctx.lineTo(winX + winW, winY + winH * 0.45);
                    ctx.stroke();

                    // Exterior Glow Aura
                    ctx.fillStyle = theme + "20";
                    ctx.beginPath();
                    ctx.arc(winX + winW / 2, winY + winH / 2, winW * 0.9, 0, Math.PI * 2);
                    ctx.fill();
                }

                // 6. Physical Recessed Fortress Portal with Sconces & Stepping Pad
                if (b.entrance) {
                    const dw = b.entrance.w || 90;
                    const dh = 44;
                    const dx = b.entrance.x;
                    const dy = b.y + b.h - dh;

                    // Arched Stone Portal Frame
                    ctx.fillStyle = "#020617";
                    ctx.strokeStyle = theme;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.roundRect(dx - 6, dy - 6, dw + 12, dh + 8, [12, 12, 0, 0]);
                    ctx.fill();
                    ctx.stroke();

                    // Wooden Reinforced Double Doors with Iron Studs
                    ctx.fillStyle = "#3B1E08";
                    ctx.fillRect(dx, dy, dw / 2 - 1, dh);
                    ctx.fillRect(dx + dw / 2 + 1, dy, dw / 2 - 1, dh);

                    // Iron Straps
                    ctx.fillStyle = "#64748B";
                    ctx.fillRect(dx, dy + 10, dw, 4);
                    ctx.fillRect(dx, dy + 28, dw, 4);

                    // Wall Torch Sconces on both sides of entrance
                    [-18, dw + 6].forEach(sx => {
                        const tx = dx + sx;
                        const ty = dy + 12;
                        // Sconce Bracket
                        ctx.fillStyle = "#1E293B";
                        ctx.fillRect(tx, ty, 6, 14);

                        // Animated Torch Flame Glow
                        const fGlow = 8 + Math.sin(this.animTimer * 6 + tx) * 2;
                        const tGrad = ctx.createRadialGradient(tx + 3, ty - 2, 1, tx + 3, ty - 2, fGlow);
                        tGrad.addColorStop(0, "#FEF08A");
                        tGrad.addColorStop(0.6, "#F59E0B");
                        tGrad.addColorStop(1, "rgba(245, 158, 11, 0)");
                        ctx.fillStyle = tGrad;
                        ctx.beginPath();
                        ctx.arc(tx + 3, ty - 2, fGlow, 0, Math.PI * 2);
                        ctx.fill();
                    });

                    // Pulsing Entrance Stepping Pad
                    ctx.fillStyle = theme + "35";
                    ctx.strokeStyle = theme;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.roundRect(dx + 6, dy + dh - 2, dw - 12, 20, 5);
                    ctx.fill();
                    ctx.stroke();

                    // Door Action Label
                    ctx.fillStyle = "#FFFFFF";
                    ctx.font = "bold 10px Inter, sans-serif";
                    ctx.textAlign = "center";
                    ctx.fillText("ENTER [E]", dx + dw / 2, dy + 24);
                }

                // 7. Roof Battlements & Parapet Teeth
                ctx.fillStyle = "#334155";
                ctx.strokeStyle = theme;
                ctx.lineWidth = 1.5;
                for (let tx = b.x + 8; tx < b.x + b.w - 20; tx += 28) {
                    ctx.fillRect(tx, b.y - 10, 16, 12);
                    ctx.strokeRect(tx, b.y - 10, 16, 12);
                }

                // 8. Rooftop Architectural Feature Ornament
                this._renderRooftopDecorations(ctx, b, theme, accent);

                // 9. Facade Marquee Plaque
                const bannerW = Math.min(b.w * 0.85, 340);
                const bannerH = 44;
                const bannerX = b.x + (b.w - bannerW) / 2;
                const bannerY = b.y + 14;

                ctx.fillStyle = "rgba(10, 15, 30, 0.96)";
                ctx.strokeStyle = theme;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 8);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 13px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(b.name, b.x + b.w / 2, bannerY + 18);

                ctx.fillStyle = accent;
                ctx.font = "bold 9.5px Inter, sans-serif";
                ctx.fillText(b.subtitle.toUpperCase(), b.x + b.w / 2, bannerY + 34);
                ctx.textAlign = "left";
            });
        }

        _renderRooftopDecorations(ctx, b, theme, accent) {
            const cx = b.x + b.w / 2;
            const cy = b.y + b.h / 2 + 10;

            if (b.category === "THRONE") {
                // Golden Imperial Crown & Twin Spires
                ctx.fillStyle = "#FCD34D";
                ctx.beginPath();
                ctx.moveTo(cx - 35, cy);
                ctx.lineTo(cx - 25, cy - 30);
                ctx.lineTo(cx, cy - 12);
                ctx.lineTo(cx + 25, cy - 30);
                ctx.lineTo(cx + 35, cy);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = "#EF4444";
                ctx.lineWidth = 2;
                ctx.stroke();
            } else if (b.category === "FORGE") {
                // Forge Anvil & Energy Pillar
                ctx.fillStyle = "#F59E0B";
                ctx.fillRect(cx - 24, cy - 12, 48, 24);
                ctx.fillRect(cx - 14, cy - 24, 28, 12);
            } else if (b.category === "WAR_ROOM") {
                // Burning Torch Array
                ctx.fillStyle = "#EF4444";
                ctx.beginPath();
                ctx.arc(cx, cy - 10, 14, 0, Math.PI * 2);
                ctx.fill();
            } else if (b.category === "TOWER") {
                // Spire Tower Monolith
                ctx.fillStyle = "#3B82F6";
                ctx.fillRect(cx - 12, cy - 28, 24, 42);
            } else if (b.category === "OBSERVATORY") {
                // Observatory Radar Dish
                ctx.strokeStyle = "#06B6D4";
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(cx, cy, 22, Math.PI, Math.PI * 2);
                ctx.stroke();
            }
        }

        _renderStreetProps(ctx) {
            (this.mapConfig.streetProps || []).forEach(p => {
                if (p.type === "brazier") {
                    // Stone Brazier Base
                    ctx.fillStyle = "#1E293B";
                    ctx.fillRect(p.x - 14, p.y - 14, 28, 28);
                    ctx.strokeStyle = p.color || "#F59E0B";
                    ctx.lineWidth = 1.5;
                    ctx.strokeRect(p.x - 14, p.y - 14, 28, 28);

                    // Animated Flame Glow
                    const fSize = 10 + Math.sin(this.animTimer * 6 + p.x) * 3;
                    const fGrad = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, fSize);
                    fGrad.addColorStop(0, "#FEF08A");
                    fGrad.addColorStop(0.5, p.color || "#F59E0B");
                    fGrad.addColorStop(1, "rgba(245, 158, 11, 0)");
                    ctx.fillStyle = fGrad;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, fSize, 0, Math.PI * 2);
                    ctx.fill();
                } else if (p.type === "banner") {
                    ctx.fillStyle = p.color || "#FCD34D";
                    ctx.fillRect(p.x - 10, p.y - 30, 20, 50);
                    ctx.strokeStyle = "#020617";
                    ctx.lineWidth = 1.5;
                    ctx.strokeRect(p.x - 10, p.y - 30, 20, 50);
                } else if (p.type === "tree") {
                    ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius || 24, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = "#065F46";
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, (p.radius || 24) * 0.7, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = "#10B981";
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                } else if (p.type === "bench") {
                    ctx.fillStyle = "#334155";
                    ctx.fillRect(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h);
                    ctx.strokeStyle = "#94A3B8";
                    ctx.lineWidth = 1;
                    ctx.strokeRect(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h);
                }
            });
        }

        _renderTelemetryBoards(ctx) {
            (this.mapConfig.marketBoards || []).forEach(mb => {
                ctx.fillStyle = "#0B1120";
                ctx.fillRect(mb.x - mb.w / 2, mb.y - mb.h / 2, mb.w, mb.h);
                ctx.strokeStyle = "#FCD34D";
                ctx.lineWidth = 1.5;
                ctx.strokeRect(mb.x - mb.w / 2, mb.y - mb.h / 2, mb.w, mb.h);

                ctx.fillStyle = "#FCD34D";
                ctx.font = "bold 10px Inter, sans-serif";
                ctx.fillText(mb.title, mb.x - mb.w / 2 + 8, mb.y - mb.h / 2 + 16);

                ctx.fillStyle = "#A5F3FC";
                ctx.font = "9px Inter, sans-serif";
                ctx.fillText(mb.value, mb.x - mb.w / 2 + 8, mb.y - mb.h / 2 + 34);
            });
        }

        _renderExplorationNodes(ctx) {
            (this.mapConfig.explorationPoints || []).forEach(exp => {
                const isFound = this.exploredPoints.has(exp.id);
                const pulse = Math.sin(this.animTimer * 4 + exp.x) * 3;

                ctx.fillStyle = isFound ? "#10B981" : "#F59E0B";
                ctx.shadowColor = isFound ? "#10B981" : "#F59E0B";
                ctx.shadowBlur = isFound ? 4 : 14;

                ctx.beginPath();
                ctx.arc(exp.x, exp.y, 9 + pulse * 0.4, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                ctx.fillStyle = isFound ? "#A7F3D0" : "#FEF08A";
                ctx.font = "bold 10px Inter, sans-serif";
                ctx.fillText(exp.name, exp.x + 14, exp.y + 4);
            });
        }

        _renderNPCs(ctx) {
            const idleBob = Math.sin(this.animTimer * 3) * 2;

            // Primary NPCs (2.5D Styled Avatars)
            (this.mapConfig.npcs || []).forEach(npc => {
                const x = npc.x;
                const y = npc.y + idleBob;
                const theme = npc.themeColor || "#FCD34D";

                // Shadow
                ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                ctx.beginPath();
                ctx.ellipse(x, npc.y + 18, 16, 6, 0, 0, Math.PI * 2);
                ctx.fill();

                // Robe / Body
                ctx.fillStyle = theme;
                ctx.beginPath();
                ctx.moveTo(x - 14, y + 16);
                ctx.lineTo(x - 10, y - 6);
                ctx.lineTo(x + 10, y - 6);
                ctx.lineTo(x + 14, y + 16);
                ctx.closePath();
                ctx.fill();

                // Cloak trim
                ctx.fillStyle = npc.secondaryColor || "#0F172A";
                ctx.fillRect(x - 6, y - 6, 12, 22);

                // Head / Hood
                ctx.fillStyle = "#F8FAFC";
                ctx.beginPath();
                ctx.arc(x, y - 14, 10, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = theme;
                ctx.beginPath();
                ctx.arc(x, y - 16, 11, Math.PI, Math.PI * 2);
                ctx.fill();

                // Floating Action Badge [E]
                const badgePulse = Math.sin(this.animTimer * 4) * 3;
                ctx.fillStyle = "#FCD34D";
                ctx.shadowColor = "#FCD34D";
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.roundRect(x - 14, y - 42 + badgePulse, 28, 15, 4);
                ctx.fill();
                ctx.shadowBlur = 0;

                ctx.fillStyle = "#020617";
                ctx.font = "bold 9px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("[E]", x, y - 31 + badgePulse);

                // Nameplate
                ctx.fillStyle = "rgba(2, 6, 23, 0.9)";
                ctx.strokeStyle = theme;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.roundRect(x - 45, y + 22, 90, 18, 4);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 9.5px Inter, sans-serif";
                ctx.fillText(npc.name.split(" - ")[0], x, y + 34);
                ctx.textAlign = "left";
            });

            // Ambient Patrol NPCs
            (this.mapConfig.ambientNpcs || []).forEach(amb => {
                const x = amb.x;
                const y = amb.y + idleBob * 0.5;

                ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
                ctx.beginPath();
                ctx.ellipse(x, amb.y + 12, 12, 4, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = amb.themeColor || "#94A3B8";
                ctx.beginPath();
                ctx.arc(x, y - 6, 8, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = "#64748B";
                ctx.fillRect(x - 8, y, 16, 12);

                ctx.fillStyle = "#E2E8F0";
                ctx.font = "9px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(amb.name.split(" ")[0], x, y + 20);
                ctx.textAlign = "left";
            });
        }

        _renderPerimeterFortifications(ctx) {
            // Perimeter Stone Fortress Wall (50px border)
            ctx.strokeStyle = "rgba(252, 211, 77, 0.35)";
            ctx.lineWidth = 6;
            ctx.strokeRect(25, 25, this.width - 50, this.height - 50);

            // Bastion Battlements along edges
            ctx.fillStyle = "#1E293B";
            for (let bx = 50; bx < this.width - 50; bx += 80) {
                ctx.fillRect(bx, 10, 30, 20);
                ctx.fillRect(bx, this.height - 30, 30, 20);
            }
            for (let by = 50; by < this.height - 50; by += 80) {
                ctx.fillRect(10, by, 20, 30);
                ctx.fillRect(this.width - 30, by, 20, 30);
            }
        }

        renderInterior(ctx, camera) {
            const int = (this.mapConfig.interiors && this.mapConfig.interiors[this.currentInterior]) || {};
            const intW = int.width || 1200;
            const intH = int.height || 800;

            // 1. Interior Floor
            ctx.fillStyle = "#0B1120";
            ctx.fillRect(0, 0, intW, intH);

            // 2. Interior Floor Grid
            ctx.strokeStyle = "rgba(252, 211, 77, 0.08)";
            ctx.lineWidth = 1;
            for (let x = 40; x < intW; x += 40) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, intH); ctx.stroke();
            }
            for (let y = 40; y < intH; y += 40) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(intW, y); ctx.stroke();
            }

            // 3. Perimeter Interior Walls
            ctx.fillStyle = "#020617";
            ctx.fillRect(0, 0, intW, 40);
            ctx.fillRect(0, intH - 40, intW, 40);
            ctx.fillRect(0, 0, 40, intH);
            ctx.fillRect(intW - 40, 0, 40, intH);

            ctx.strokeStyle = int.themeColor || "#FCD34D";
            ctx.lineWidth = 3;
            ctx.strokeRect(30, 30, intW - 60, intH - 60);

            // 4. Interior Title Banner
            ctx.fillStyle = "rgba(2, 6, 23, 0.95)";
            ctx.strokeStyle = int.themeColor || "#FCD34D";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(intW / 2 - 200, 15, 400, 36, 6);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 15px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(int.name || "Citadel Interior", intW / 2, 38);

            // 5. Exit Door
            if (int.exit) {
                ctx.fillStyle = "#EF4444";
                ctx.fillRect(int.exit.x, int.exit.y, int.exit.w, int.exit.h);
                ctx.strokeStyle = "#FECACA";
                ctx.lineWidth = 2;
                ctx.strokeRect(int.exit.x, int.exit.y, int.exit.w, int.exit.h);

                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 11px Inter, sans-serif";
                ctx.fillText("EXIT DOOR [E]", int.exit.x + int.exit.w / 2, int.exit.y + 24);
            }

            // 6. Interactive Stations
            (int.stations || []).forEach(st => {
                ctx.fillStyle = "#1E293B";
                ctx.fillRect(st.x, st.y, st.w, st.h);
                ctx.strokeStyle = int.themeColor || "#FCD34D";
                ctx.lineWidth = 2;
                ctx.strokeRect(st.x, st.y, st.w, st.h);

                ctx.fillStyle = "#FCD34D";
                ctx.fillRect(st.x, st.y, st.w, 8);

                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 12px Inter, sans-serif";
                ctx.fillText(st.name, st.x + st.w / 2, st.y + 36);

                ctx.fillStyle = "#FCD34D";
                ctx.font = "bold 10px Inter, sans-serif";
                ctx.fillText("[E] ACTIVATE", st.x + st.w / 2, st.y + 54);
            });

            // 7. Interior NPC
            if (int.npc) {
                const nx = int.npc.x;
                const ny = int.npc.y;
                const theme = int.npc.themeColor || "#FCD34D";

                ctx.fillStyle = theme;
                ctx.beginPath();
                ctx.arc(nx, ny - 10, 12, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = "#1E293B";
                ctx.fillRect(nx - 14, ny + 2, 28, 20);

                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 11px Inter, sans-serif";
                ctx.fillText(int.npc.name, nx, ny + 36);
            }
            ctx.textAlign = "left";
        }
    }

    function resetActivityState(prefix) {
        if (prefix && typeof document !== "undefined") {
            const textEl = document.getElementById(`${prefix}-q-text`);
            const gridEl = document.getElementById(`${prefix}-options-grid`);
            const fbEl = document.getElementById(`${prefix}-feedback-box`);
            if (textEl) textEl.textContent = "";
            if (gridEl) gridEl.innerHTML = "";
            if (fbEl) { fbEl.style.display = "none"; fbEl.innerHTML = ""; fbEl.className = "fortress-feedback-box"; }
        }
    }

    function hasActiveModal() {
        if (typeof window !== "undefined") {
            if (window.StrativoRPG && window.StrativoRPG.DialogueManager && window.StrativoRPG.DialogueManager.isOpen) {
                return true;
            }
            if (typeof document !== "undefined") {
                const activeEl = document.querySelector(".fortress-modal-backdrop.active, .strativo-dialogue-overlay.active");
                return Boolean(activeEl);
            }
        }
        return false;
    }

    window.StrativoRPG.StrategyFortressWorld = StrategyFortressWorld;
    window.StrativoRPG.resetActivityState = resetActivityState;
    window.StrativoRPG.hasActiveModal = hasActiveModal;

    if (typeof module !== "undefined" && module.exports) {
        module.exports = { StrategyFortressWorld, resetActivityState, hasActiveModal };
    }
})();
