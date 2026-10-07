/* ==========================================================================
   STRATIVO WORLD — 2D RPG CORE: WORLD / DISTRICT SCENE
   Version: 1.0
   Namespace: StrativoRPG.World
   Description:
   - 2D RPG District Environment & Scene Manager
   - Cybernetic Floor Grid & Boundary Walls Rendering
   - Obstacle Blocks, Interactive Tech Hubs, District Gateways
   - Reusable foundation across all 7 Strativo Districts
   ========================================================================== */

"use strict";

(function () {
    window.StrativoRPG = window.StrativoRPG || {};

    const Rectangle = window.StrativoRPG.Rectangle;

    class World {
        constructor(config = {}) {
            this.id = config.id || "prototype-hub";
            this.name = config.name || "Strativo Core Testing Realm";
            this.width = Number(config.width) || 1600;
            this.height = Number(config.height) || 1200;
            this.spawnPoint = config.spawnPoint || { x: 800, y: 600 };
            this.themeColor = config.themeColor || "#00F0FF";
            this.accentColor = config.accentColor || "#00E5A8";

            // Grid configuration
            this.tileSize = 64;

            // Environmental objects
            this.obstacles = [];
            this.interactiveObjects = [];
            this.zones = [];

            // Boundary rectangle
            this.bounds = new Rectangle(0, 0, this.width, this.height, "world_boundary", "boundary");

            // Animation timer for ambient world pulses
            this.ambientTimer = 0;
        }

        /**
         * Initializes a default rich test district with obstacles and interactive stations
         */
        buildDefaultScene(collisionSystem) {
            this.obstacles = [];
            this.interactiveObjects = [];

            // 1. Boundary Perimeter Walls (4 sides)
            const wallThickness = 32;
            const topWall = new Rectangle(0, 0, this.width, wallThickness, "wall_top", "solid");
            const bottomWall = new Rectangle(0, this.height - wallThickness, this.width, wallThickness, "wall_bottom", "solid");
            const leftWall = new Rectangle(0, 0, wallThickness, this.height, "wall_left", "solid");
            const rightWall = new Rectangle(this.width - wallThickness, 0, wallThickness, this.height, "wall_right", "solid");

            this.addObstacle(topWall, { label: "Perimeter Barrier North", color: "#0F172A" }, collisionSystem);
            this.addObstacle(bottomWall, { label: "Perimeter Barrier South", color: "#0F172A" }, collisionSystem);
            this.addObstacle(leftWall, { label: "Perimeter Barrier West", color: "#0F172A" }, collisionSystem);
            this.addObstacle(rightWall, { label: "Perimeter Barrier East", color: "#0F172A" }, collisionSystem);

            // 2. Central Hub Island Obstacles (Terminal Desks & Monoliths)
            // Central Data Terminal (Interactive)
            this.addInteractiveObject({
                id: "terminal_central",
                x: 736,
                y: 480,
                width: 128,
                height: 64,
                interactRadius: 110,
                name: "Academy Data Terminal",
                category: "LEARNING_NODE",
                icon: "fa-desktop",
                promptText: "Access Market Intel",
                onInteract: (player, core) => {
                    return {
                        title: "Strativo Academy Data Hub",
                        message: "Real-time market feeds, candlestick theory archives, and execution engine connected.",
                        type: "INFO"
                    };
                }
            }, collisionSystem);

            // Tech Monoliths (North-West & North-East Pillars)
            this.addObstacle(new Rectangle(320, 240, 96, 96, "pillar_nw", "solid"), {
                label: "Quantum Server NW",
                type: "monolith",
                color: "#1E293B",
                borderColor: "#00F0FF"
            }, collisionSystem);

            this.addObstacle(new Rectangle(1184, 240, 96, 96, "pillar_ne", "solid"), {
                label: "Quantum Server NE",
                type: "monolith",
                color: "#1E293B",
                borderColor: "#00F0FF"
            }, collisionSystem);

            // South-West & South-East Risk Barriers
            this.addObstacle(new Rectangle(320, 864, 128, 48, "barrier_sw", "solid"), {
                label: "Risk Vault Barrier SW",
                type: "barrier",
                color: "#1E293B",
                borderColor: "#A855F7"
            }, collisionSystem);

            this.addObstacle(new Rectangle(1152, 864, 128, 48, "barrier_se", "solid"), {
                label: "Risk Vault Barrier SE",
                type: "barrier",
                color: "#1E293B",
                borderColor: "#A855F7"
            }, collisionSystem);

            // 3. District Gateways (Interactive Gate Portals)
            // Candle City Gate (North)
            this.addInteractiveObject({
                id: "gate_candle_city",
                x: 736,
                y: 96,
                width: 128,
                height: 56,
                interactRadius: 120,
                name: "Candle City Gateway",
                category: "GATEWAY",
                districtId: "candle-city",
                icon: "fa-fire-flame-curved",
                promptText: "Approach Candle City Gate",
                onInteract: (player, core) => {
                    return {
                        title: "District 1: Candle City",
                        message: "The starting zone for price action & candlestick mastery. District integration ready.",
                        type: "DISTRICT_GATE"
                    };
                }
            }, collisionSystem);

            // Pip District Gate (East)
            this.addInteractiveObject({
                id: "gate_pip_district",
                x: 1400,
                y: 560,
                width: 64,
                height: 128,
                interactRadius: 120,
                name: "Pip District Gateway",
                category: "GATEWAY",
                districtId: "pip-district",
                icon: "fa-bolt",
                promptText: "Approach Pip District",
                onInteract: (player, core) => {
                    return {
                        title: "District 2: Pip District",
                        message: "High-speed pip calculations and position sizing sector.",
                        type: "DISTRICT_GATE"
                    };
                }
            }, collisionSystem);

            // Market Arena Gate (West)
            this.addInteractiveObject({
                id: "gate_market_arena",
                x: 136,
                y: 560,
                width: 64,
                height: 128,
                interactRadius: 120,
                name: "Market Arena Gateway",
                category: "GATEWAY",
                districtId: "market-arena",
                icon: "fa-chart-line",
                promptText: "Approach Market Arena",
                onInteract: (player, core) => {
                    return {
                        title: "District 3: Market Arena",
                        message: "Live simulation duel ring & market structure challenges.",
                        type: "DISTRICT_GATE"
                    };
                }
            }, collisionSystem);
        }

        addObstacle(rect, metadata = {}, collisionSystem = null) {
            const obstacle = {
                rect,
                metadata
            };
            this.obstacles.push(obstacle);
            if (collisionSystem) {
                collisionSystem.addCollider(rect);
            }
            return obstacle;
        }

        addInteractiveObject(config, collisionSystem = null) {
            const rect = new Rectangle(config.x, config.y, config.width, config.height, config.id, "solid");
            const obj = {
                id: config.id,
                rect,
                name: config.name || "Interactive Node",
                category: config.category || "OBJECT",
                icon: config.icon || "fa-circle-info",
                promptText: config.promptText || "Interact",
                interactRadius: config.interactRadius || 100,
                districtId: config.districtId || null,
                onInteract: config.onInteract || null
            };

            this.interactiveObjects.push(obj);
            if (collisionSystem) {
                collisionSystem.addCollider(rect);
            }
            return obj;
        }

        update(deltaTime) {
            this.ambientTimer += Math.min(0.1, deltaTime);
        }

        /**
         * Renders the complete world backdrop, grid, obstacles, and portals
         */
        render(ctx, camera, debugMode = false) {
            const visible = camera ? camera.getVisibleBounds() : this.bounds;

            // 1. Base Dark Cyber Canvas
            ctx.fillStyle = "#030712";
            ctx.fillRect(0, 0, this.width, this.height);

            // 2. Render Tech Grid
            this._renderGrid(ctx, visible);

            // 3. Render Center Quantum Hub Floor Ring
            this._renderCenterHubPlate(ctx);

            // 4. Render Interactive Objects & Portals
            this._renderInteractiveObjects(ctx);

            // 5. Render Solid Obstacle Blocks
            this._renderObstacles(ctx);

            // 6. Render Boundary Walls
            this._renderPerimeterBarrier(ctx);

            // 7. Debug Render Colliders if enabled
            if (debugMode) {
                this._renderDebugColliders(ctx);
            }
        }

        _renderGrid(ctx, visible) {
            ctx.save();
            const startX = Math.floor(Math.max(0, visible.left) / this.tileSize) * this.tileSize;
            const endX = Math.min(this.width, visible.right + this.tileSize);
            const startY = Math.floor(Math.max(0, visible.top) / this.tileSize) * this.tileSize;
            const endY = Math.min(this.height, visible.bottom + this.tileSize);

            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";

            ctx.beginPath();
            for (let x = startX; x <= endX; x += this.tileSize) {
                ctx.moveTo(x, startY);
                ctx.lineTo(x, endY);
            }
            for (let y = startY; y <= endY; y += this.tileSize) {
                ctx.moveTo(startX, y);
                ctx.lineTo(endX, y);
            }
            ctx.stroke();

            // Highlight Major Grid Intersections (every 4 tiles = 256px)
            const majorSize = this.tileSize * 4;
            const majorStartX = Math.floor(Math.max(0, visible.left) / majorSize) * majorSize;
            const majorStartY = Math.floor(Math.max(0, visible.top) / majorSize) * majorSize;

            ctx.strokeStyle = "rgba(0, 240, 255, 0.08)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            for (let x = majorStartX; x <= endX; x += majorSize) {
                ctx.moveTo(x, startY);
                ctx.lineTo(x, endY);
            }
            for (let y = majorStartY; y <= endY; y += majorSize) {
                ctx.moveTo(startX, y);
                ctx.lineTo(endX, y);
            }
            ctx.stroke();

            ctx.restore();
        }

        _renderCenterHubPlate(ctx) {
            ctx.save();
            const cx = this.width / 2;
            const cy = this.height / 2;
            const pulse = 0.6 + Math.sin(this.ambientTimer * 2) * 0.2;

            // Outer Orbit Ring
            ctx.strokeStyle = "rgba(0, 229, 168, 0.25)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, cy, 220, 0, Math.PI * 2);
            ctx.stroke();

            // Glowing Inner Ring
            ctx.strokeStyle = `rgba(0, 240, 255, ${pulse * 0.5})`;
            ctx.lineWidth = 3;
            ctx.shadowColor = "#00F0FF";
            ctx.shadowBlur = 16;
            ctx.beginPath();
            ctx.arc(cx, cy, 140, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Center Compass Cross
            ctx.strokeStyle = "rgba(0, 240, 255, 0.15)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx - 240, cy);
            ctx.lineTo(cx + 240, cy);
            ctx.moveTo(cx, cy - 240);
            ctx.lineTo(cx, cy + 240);
            ctx.stroke();

            ctx.restore();
        }

        _renderObstacles(ctx) {
            ctx.save();
            for (let i = 0; i < this.obstacles.length; i++) {
                const obs = this.obstacles[i];
                const r = obs.rect;
                if (r.id.startsWith("wall_")) continue; // Skip perimeter walls rendered separately

                const meta = obs.metadata || {};
                const baseColor = meta.color || "#1E293B";
                const borderColor = meta.borderColor || "rgba(0, 240, 255, 0.3)";

                // Obstacle Body
                ctx.fillStyle = baseColor;
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = 2;

                ctx.beginPath();
                ctx.roundRect(r.x, r.y, r.width, r.height, 8);
                ctx.fill();
                ctx.stroke();

                // Tech accents
                ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
                ctx.fillRect(r.x + 4, r.y + 4, r.width - 8, r.height * 0.3);

                // Label
                if (meta.label) {
                    ctx.fillStyle = "#94A3B8";
                    ctx.font = "bold 10px 'Inter', sans-serif";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(meta.label, r.centerX, r.centerY);
                }
            }
            ctx.restore();
        }

        _renderInteractiveObjects(ctx) {
            ctx.save();
            const pulse = 0.5 + Math.sin(this.ambientTimer * 3) * 0.3;

            for (let i = 0; i < this.interactiveObjects.length; i++) {
                const obj = this.interactiveObjects[i];
                const r = obj.rect;

                // Portal / Station Base Glow
                ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
                ctx.strokeStyle = obj.category === "GATEWAY" ? "#00E5A8" : "#00F0FF";
                ctx.lineWidth = 2;
                ctx.shadowColor = ctx.strokeStyle;
                ctx.shadowBlur = 10;

                ctx.beginPath();
                ctx.roundRect(r.x, r.y, r.width, r.height, 10);
                ctx.fill();
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Proximity Pulse Ring on Floor
                ctx.strokeStyle = obj.category === "GATEWAY"
                    ? `rgba(0, 229, 168, ${pulse * 0.3})`
                    : `rgba(0, 240, 255, ${pulse * 0.3})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(r.centerX, r.centerY, obj.interactRadius, 0, Math.PI * 2);
                ctx.stroke();

                // Text Header & Icon
                ctx.fillStyle = "#F8FAFC";
                ctx.font = "bold 11px 'Inter', sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(obj.name, r.centerX, r.centerY - 6);

                // Subtitle
                ctx.fillStyle = obj.category === "GATEWAY" ? "#00E5A8" : "#38BDF8";
                ctx.font = "600 9px 'Inter', sans-serif";
                ctx.fillText(obj.promptText, r.centerX, r.centerY + 10);
            }
            ctx.restore();
        }

        _renderPerimeterBarrier(ctx) {
            ctx.save();
            const wallThick = 32;

            // Outer barrier neon outline
            ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
            ctx.lineWidth = 3;
            ctx.shadowColor = "#00F0FF";
            ctx.shadowBlur = 8;
            ctx.strokeRect(wallThick, wallThick, this.width - wallThick * 2, this.height - wallThick * 2);
            ctx.shadowBlur = 0;

            // Striped hazard corners
            ctx.fillStyle = "rgba(245, 158, 11, 0.25)";
            const cornerSize = 64;
            // NW
            ctx.fillRect(wallThick, wallThick, cornerSize, cornerSize);
            // NE
            ctx.fillRect(this.width - wallThick - cornerSize, wallThick, cornerSize, cornerSize);
            // SW
            ctx.fillRect(wallThick, this.height - wallThick - cornerSize, cornerSize, cornerSize);
            // SE
            ctx.fillRect(this.width - wallThick - cornerSize, this.height - wallThick - cornerSize, cornerSize, cornerSize);

            ctx.restore();
        }

        _renderDebugColliders(ctx) {
            ctx.save();
            ctx.strokeStyle = "rgba(244, 63, 94, 0.8)";
            ctx.lineWidth = 1.5;

            for (let i = 0; i < this.obstacles.length; i++) {
                const r = this.obstacles[i].rect;
                ctx.strokeRect(r.x, r.y, r.width, r.height);
            }

            for (let i = 0; i < this.interactiveObjects.length; i++) {
                const obj = this.interactiveObjects[i];
                ctx.strokeStyle = "rgba(0, 229, 168, 0.8)";
                ctx.strokeRect(obj.rect.x, obj.rect.y, obj.rect.width, obj.rect.height);
            }

            ctx.restore();
        }
    }

    // Expose to StrativoRPG namespace
    window.StrativoRPG.World = World;

})();
