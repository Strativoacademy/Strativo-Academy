/* ==========================================================================
   STRATIVO WORLD — 2D RPG CORE ENGINE
   Version: 1.0
   Namespace: window.StrativoRPG
   Description:
   - Central game loop & lifecycle manager (requestAnimationFrame)
   - HiDPI Retina canvas scaling & resize handler
   - Interaction abstraction & proximity detection
   - District transition abstraction
   - Debug metrics & inspector overlay (?debug=1 or F3)
   - Read-only bridge to StrativoWorldState
   ========================================================================== */

"use strict";

(function () {
    window.StrativoRPG = window.StrativoRPG || {};

    const { Rectangle, CollisionSystem } = window.StrativoRPG;
    const InputManager = window.StrativoRPG.InputManager;
    const Camera = window.StrativoRPG.Camera;
    const Player = window.StrativoRPG.Player;
    const World = window.StrativoRPG.World;

    class RPGCore {
        constructor(options = {}) {
            this.canvas = options.canvas || null;
            this.container = options.container || (this.canvas ? this.canvas.parentElement : document.body);
            this.ctx = null;

            // Engine state
            this.isRunning = false;
            this.isPaused = false;
            this.lastFrameTime = 0;
            this.fps = 60;
            this.frameCount = 0;
            this.fpsTimer = 0;

            // Debug mode
            this.debug = Boolean(options.debug || new URLSearchParams(window.location.search).get("debug") === "1");

            // Subsystems
            this.collision = new CollisionSystem();
            this.input = new InputManager({ container: this.container });
            this.camera = new Camera(800, 600);
            this.world = options.world || new World(options.worldConfig || {});
            this.player = new Player(options.playerConfig || {});

            // Interaction state
            this.nearbyInteractable = null;
            this.onInteractionPrompt = options.onInteractionPrompt || options.onInteractPrompt || null;
            this.onInteractionTrigger = options.onInteractionTrigger || options.onInteractTrigger || null;
            this.onDistrictTransition = options.onDistrictTransition || null;

            // Transition state
            this.isTransitioning = false;
            this.fadeAlpha = 0;

            // Bind loop
            this._loop = this._gameLoop.bind(this);
            this._onResize = this._handleResize.bind(this);

            if (this.canvas) {
                this.init(null, options);
            }
        }

        init(canvas = null, options = {}) {
            if (canvas) this.canvas = canvas;
            if (!this.canvas) {
                console.error("Strativo RPG Core: Canvas element required.");
                return;
            }

            this.ctx = this.canvas.getContext("2d", { alpha: false });
            this.input.attach(this.container || this.canvas);

            // Build world scene & colliders
            if (typeof this.world.buildScene === "function") {
                this.world.buildScene(this.collision);
            } else if (typeof this.world.buildDefaultScene === "function") {
                this.world.buildDefaultScene(this.collision);
            }

            // Set world bounds on camera
            this.camera.setWorldBounds(this.world.bounds);

            // Set initial player spawn from options or world
            if (this.world && this.world.spawnPoint) {
                if (options.playerConfig && options.playerConfig.x !== undefined) {
                    this.player.x = Number(options.playerConfig.x);
                    this.player.y = Number(options.playerConfig.y);
                } else {
                    this.player.x = this.world.spawnPoint.x;
                    this.player.y = this.world.spawnPoint.y;
                }
                if (this.world.spawnPoint.direction && (!options.playerConfig || !options.playerConfig.facing)) {
                    this.player.facing = this.world.spawnPoint.direction;
                }
            }

            // Clamping assertion & boundary guarantee
            if (this.world && this.world.bounds) {
                const wallPad = 36;
                const minX = wallPad;
                const maxX = Math.max(minX, this.world.bounds.width - this.player.width - wallPad);
                const minY = wallPad;
                const maxY = Math.max(minY, this.world.bounds.height - this.player.height - wallPad);
                this.player.x = Math.max(minX, Math.min(maxX, this.player.x));
                this.player.y = Math.max(minY, Math.min(maxY, this.player.y));
            }

            // Follow player with camera immediately (snap to spawn)
            this.camera.follow(this.player, true);

            // Handle responsive canvas sizing
            window.addEventListener("resize", this._onResize, { passive: true });
            this._handleResize();

            console.info(`Strativo RPG Core: Initialized successfully at (${this.player.x}, ${this.player.y}) facing ${this.player.facing}. [Debug: ${this.debug ? "ON" : "OFF"}]`);
        }

        setWorld(world, preservePlayerPos = false) {
            if (!world) return;
            this.world = world;
            this.collision.clear();
            if (typeof this.world.buildScene === "function") {
                this.world.buildScene(this.collision);
            } else if (typeof this.world.buildDefaultScene === "function") {
                this.world.buildDefaultScene(this.collision);
            }
            this.camera.setWorldBounds(this.world.bounds);
            if (!preservePlayerPos && this.world.spawnPoint) {
                this.player.x = this.world.spawnPoint.x;
                this.player.y = this.world.spawnPoint.y;
                if (this.world.spawnPoint.direction) {
                    this.player.facing = this.world.spawnPoint.direction;
                }
            }
            this.camera.follow(this.player, true);
        }

        _handleResize() {
            if (!this.canvas || !this.container) return;

            const rect = this.container.getBoundingClientRect();
            const width = Math.floor(rect.width || 800);
            const height = Math.floor(rect.height || 600);
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            this.canvas.width = width * dpr;
            this.canvas.height = height * dpr;
            this.canvas.style.width = `${width}px`;
            this.canvas.style.height = `${height}px`;

            if (this.ctx) {
                this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }

            this.camera.setViewport(width, height);
        }

        start() {
            if (this.isRunning) return;
            this.isRunning = true;
            this.isPaused = false;
            this.lastFrameTime = performance.now();
            requestAnimationFrame(this._loop);
        }

        pause() {
            this.isPaused = true;
        }

        resume() {
            if (!this.isRunning) {
                this.start();
                return;
            }
            if (this.isPaused) {
                this.isPaused = false;
                this.lastFrameTime = performance.now();
                requestAnimationFrame(this._loop);
            }
        }

        stop() {
            this.isRunning = false;
            this.input.detach();
            window.removeEventListener("resize", this._onResize);
        }

        toggleDebug() {
            this.debug = !this.debug;
            return this.debug;
        }

        hasActiveModal() {
            if (typeof document === "undefined") return false;
            return Boolean(
                document.querySelector(".cc-modal.active, .dialog-overlay.active, .cc-dialog-overlay.active, .rpg-dialog.active, #cc-dialog.active, #cc-archive-modal.active, #cc-missions-modal.active, .pd-dialog-backdrop.active, .pd-blitz-overlay.active, .pd-missions-modal-overlay.active, #pd-dialog.active, .ma-modal.active, [role='dialog'][aria-modal='true'].active, .strativo-dialogue-overlay.active")
            );
        }

        /* ==================================================================
           MAIN ENGINE LOOP
           ================================================================== */
        _gameLoop(timestamp) {
            if (!this.isRunning) return;

            const dt = Math.min(0.1, (timestamp - this.lastFrameTime) / 1000);
            this.lastFrameTime = timestamp;

            // Calculate FPS
            this.frameCount++;
            this.fpsTimer += dt;
            if (this.fpsTimer >= 0.5) {
                this.fps = Math.round(this.frameCount / this.fpsTimer);
                this.frameCount = 0;
                this.fpsTimer = 0;
            }

            if (!this.isPaused) {
                this._update(dt);
                this._render();
            }

            requestAnimationFrame(this._loop);
        }

        /* ==================================================================
           UPDATE PHASE
           ================================================================== */
        _update(dt) {
            // Check debug toggle request from input
            if (this.input.consumeDebugToggle()) {
                this.toggleDebug();
            }

            // If a modal or dialogue overlay is currently active, pause in-world movement & interaction
            const hasActiveModal = this.hasActiveModal();
            if (hasActiveModal) {
                if (this.input && typeof this.input.reset === "function") {
                    this.input.reset();
                }
                return;
            }

            // 1. Get Normalized Movement Input Vector
            const inputVector = this.input.getVector();

            // 2. Update Player Avatar Position & Movement
            this.player.update(dt, inputVector, this.collision, this.world.bounds);

            // 3. Update Camera Target Following
            this.camera.update(dt);

            // 4. Update World Ambient Elements & NPCs
            this.world.update(dt, this.player ? this.player.getPosition() : null);

            // 5. Check Proximity Interactions
            this._checkInteractions();

            // 6. Handle Interact Action Trigger
            if (this.input.consumeInteract()) {
                this.triggerNearbyInteraction();
            }
        }

        /* ==================================================================
           INTERACTION SUBSYSTEM (ATOMIC & EXCEPTION-SAFE)
           ================================================================== */
        _checkInteractions() {
            if (!this.world || !Array.isArray(this.world.interactiveObjects) || !this.player) {
                this.nearbyInteractable = null;
                return;
            }

            const playerPos = this.player.getPosition();
            let closestObj = null;
            let closestDist = Infinity;

            for (let i = 0; i < this.world.interactiveObjects.length; i++) {
                const obj = this.world.interactiveObjects[i];
                if (!obj || obj.enabled === false || !obj.rect) continue;

                const dx = playerPos.centerX - obj.rect.centerX;
                const dy = playerPos.centerY - obj.rect.centerY;
                const dist = Math.hypot(dx, dy);

                if (dist <= obj.interactRadius) {
                    // Priority weighting: NPC talk (10% closer effective dist) > Station > Discovery
                    let effectiveDist = dist;
                    if (obj.category === "NPC_TALK") effectiveDist *= 0.9;
                    if (effectiveDist < closestDist) {
                        closestDist = effectiveDist;
                        closestObj = obj;
                    }
                }
            }

            const prev = this.nearbyInteractable;
            this.nearbyInteractable = closestObj;

            if (this.onInteractionPrompt) {
                if (closestObj) {
                    this.onInteractionPrompt({
                        active: true,
                        object: closestObj,
                        name: closestObj.name,
                        promptText: closestObj.promptText,
                        category: closestObj.category,
                        districtId: closestObj.districtId
                    });
                } else if (prev) {
                    this.onInteractionPrompt({ active: false });
                }
            }
        }

        /**
         * Triggers an interaction with strict validation and exception safety.
         * Interaction is atomic: never locks player movement unless an activity/modal successfully opens.
         * @param {Object} obj Target interactive object
         * @returns {string} Status code: 'SUCCESS' | 'NO_TARGET' | 'FAILED_INVALID_TARGET' | 'FAILED_OUT_OF_RANGE' | 'FAILED_CALLBACK'
         */
        _triggerInteraction(obj) {
            // 1. Target Existence & Active Scene Validation
            if (!obj || typeof obj !== "object") {
                return "NO_TARGET";
            }
            if (obj.enabled === false) {
                return "FAILED_INVALID_TARGET";
            }
            if (!this.world || !Array.isArray(this.world.interactiveObjects) || !this.world.interactiveObjects.includes(obj)) {
                this.nearbyInteractable = null;
                if (this.onInteractionPrompt) this.onInteractionPrompt({ active: false });
                return "FAILED_INVALID_TARGET";
            }

            // 2. Real-time Distance Validation
            if (this.player && obj.rect) {
                const playerPos = this.player.getPosition();
                const dx = playerPos.centerX - obj.rect.centerX;
                const dy = playerPos.centerY - obj.rect.centerY;
                const dist = Math.hypot(dx, dy);
                if (dist > obj.interactRadius) {
                    this.nearbyInteractable = null;
                    if (this.onInteractionPrompt) this.onInteractionPrompt({ active: false });
                    return "FAILED_OUT_OF_RANGE";
                }
            }

            // 3. Callback Validation & Execution
            let result = null;
            try {
                if (typeof obj.onInteract === "function") {
                    result = obj.onInteract(this.player, this);
                }
            } catch (err) {
                console.error("Strativo RPG: Exception executing onInteract for target:", obj.name || obj.id, err);
                if (this.input) {
                    this.input.keys.interact = false;
                    this.input._interactConsumed = false;
                    this.input.touchInteract = false;
                }
                if (this.player) {
                    this.player.state = "idle";
                }
                return "FAILED_CALLBACK";
            }

            // 4. Gateway Transition Support
            if (obj.districtId) {
                this.transitionTo(obj.districtId, result);
            }

            // 5. Global Event Dispatch
            try {
                if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
                    window.dispatchEvent(new CustomEvent("strativo:rpgInteraction", {
                        detail: {
                            object: obj,
                            player: this.player ? this.player.getPosition() : null,
                            result
                        }
                    }));
                }
            } catch (e) {
                // Non-critical event dispatch
            }

            // 6. Component Callback
            if (this.onInteractionTrigger) {
                try {
                    this.onInteractionTrigger(obj, result);
                } catch (err) {
                    console.error("Strativo RPG: onInteractionTrigger handler error:", err);
                }
            }

            return "SUCCESS";
        }

        /**
         * Trigger interaction with currently detected nearby object.
         * @returns {string} Status code
         */
        triggerNearbyInteraction() {
            if (this.nearbyInteractable) {
                return this._triggerInteraction(this.nearbyInteractable);
            }
            return "NO_TARGET";
        }

        interactWithNearest() {
            return this.triggerNearbyInteraction();
        }

        /* ==================================================================
           WORLD TRANSITION SUBSYSTEM
           ================================================================== */
        transitionTo(districtId, options = {}) {
            if (this.isTransitioning) return;
            this.isTransitioning = true;

            console.info(`Strativo RPG: Initiating world transition to [${districtId}]...`);

            // Dispatch transition event
            try {
                window.dispatchEvent(new CustomEvent("strativo:rpgDistrictTransition", {
                    detail: {
                        districtId,
                        options
                    }
                }));
            } catch (e) {
                // Ignore
            }

            if (this.onDistrictTransition) {
                this.onDistrictTransition(districtId, options);
            }

            // Transition completion cooldown
            setTimeout(() => {
                this.isTransitioning = false;
            }, 1200);
        }

        /* ==================================================================
           RENDER PHASE
           ================================================================== */
        _render() {
            if (!this.ctx || !this.canvas) return;

            const ctx = this.ctx;
            const width = this.camera.viewportWidth;
            const height = this.camera.viewportHeight;

            // Clear Screen
            ctx.clearRect(0, 0, width, height);

            // Apply Camera Translation
            this.camera.applyTransform(ctx);

            // 1. Render World Environment (Backdrop, Grid, Obstacles, Gateways)
            this.world.render(ctx, this.camera, this.debug);

            // 2. Render Player Character (Shadow, Aura, Sprite, Nameplate)
            this.player.render(ctx, this.debug);

            // Restore Camera Transform
            this.camera.restoreTransform(ctx);

            // 3. Render In-Game HUD Elements / Virtual Joystick
            this._renderHUDOverlay(ctx);

            // 4. Render Debug Stats Overlay (if debug mode active)
            if (this.debug) {
                this._renderDebugOverlay(ctx);
            }
        }

        _renderHUDOverlay(ctx) {
            // Render touch joystick if active
            const joy = this.input.getJoystickVisualState();
            if (joy.active) {
                ctx.save();
                // Base Ring
                ctx.beginPath();
                ctx.arc(joy.startX, joy.startY, joy.maxRadius, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(15, 23, 42, 0.4)";
                ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
                ctx.lineWidth = 2;
                ctx.fill();
                ctx.stroke();

                // Thumb Knob
                ctx.beginPath();
                ctx.arc(joy.currentX, joy.currentY, joy.maxRadius * 0.4, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(0, 240, 255, 0.75)";
                ctx.shadowColor = "#00F0FF";
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.restore();
            }
        }

        _renderDebugOverlay(ctx) {
            ctx.save();
            const playerPos = this.player.getPosition();
            const colCount = this.collision.getColliders().length;
            const trigCount = this.collision.getTriggers().length;

            const metrics = [
                `FPS: ${this.fps}`,
                `Player Pos: (${playerPos.x}, ${playerPos.y})`,
                `Center: (${playerPos.centerX}, ${playerPos.centerY})`,
                `Facing: ${playerPos.facing.toUpperCase()} | State: ${playerPos.state.toUpperCase()}`,
                `Speed: ${this.player.speed} px/s`,
                `Colliders: ${colCount} | Triggers: ${trigCount}`,
                `Camera: (${Math.round(this.camera.x)}, ${Math.round(this.camera.y)})`,
                `Viewport: ${this.camera.viewportWidth}x${this.camera.viewportHeight}`,
                `Interact: ${this.nearbyInteractable ? this.nearbyInteractable.name : "None"}`
            ];

            const boxWidth = 230;
            const boxHeight = metrics.length * 16 + 18;
            const x = 12;
            const y = 12;

            ctx.fillStyle = "rgba(3, 7, 18, 0.88)";
            ctx.strokeStyle = "rgba(0, 240, 255, 0.6)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(x, y, boxWidth, boxHeight, 8);
            ctx.fill();
            ctx.stroke();

            ctx.font = "bold 11px 'Courier New', monospace";
            ctx.fillStyle = "#00F0FF";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";

            for (let i = 0; i < metrics.length; i++) {
                ctx.fillText(metrics[i], x + 10, y + 8 + i * 16);
            }

            ctx.restore();
        }

        getPublicState() {
            return {
                player: this.player.getPosition(),
                camera: { x: Math.round(this.camera.x), y: Math.round(this.camera.y) },
                fps: this.fps,
                debug: this.debug,
                nearbyInteractable: this.nearbyInteractable ? this.nearbyInteractable.name : null
            };
        }
    }

    // Expose to StrativoRPG namespace
    window.StrativoRPG.RPGCore = RPGCore;

})();
