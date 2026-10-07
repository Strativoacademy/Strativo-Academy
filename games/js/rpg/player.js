/* ==========================================================================
   STRATIVO WORLD — 2D RPG CORE: PLAYER AVATAR
   Version: 1.0
   Namespace: StrativoRPG.Player
   Description:
   - In-World 2D Player Avatar Character & Controller
   - Direction-aware rendering (4 directions: Down, Up, Left, Right)
   - Dynamic walking bobbing, ground shadow, cyan ambient glow
   - In-world floating nameplate & level badge
   - Extensible sprite-sheet frame structure for future animations
   ========================================================================== */

"use strict";

(function () {
    window.StrativoRPG = window.StrativoRPG || {};

    class Player {
        constructor(options = {}) {
            // Collision bounding box (feet level for 2.5D RPG perspective)
            this.x = Number(options.x) || 200;
            this.y = Number(options.y) || 200;
            this.width = Number(options.width) || 36;
            this.height = Number(options.height) || 24;

            // Visual dimensions
            this.spriteWidth = Number(options.spriteWidth) || 72;
            this.spriteHeight = Number(options.spriteHeight) || 96;
            this.spriteOffsetY = Number(options.spriteOffsetY) || -76; // Offset up from collision box

            // Movement parameters
            this.speed = Number(options.speed) || 220; // Pixels per second
            this.facing = options.facing || "down"; // "down", "up", "left", "right"
            this.state = "idle"; // "idle", "walking"

            // Animation timing
            this.walkTimer = 0;
            this.idleTimer = 0;
            this.animFrame = 0;

            // Visual Asset
            this.assetPath = options.assetPath || "../assets/player/player-avatar.png";
            this.spriteImage = null;
            this.isImageLoaded = false;
            this.loadImage(this.assetPath);

            // In-world Nameplate & Stats
            this.showNameplate = options.showNameplate !== undefined ? options.showNameplate : true;
            this.cachedHandle = "Student";
            this.cachedLevel = 1;
            this.cachedRank = "Novice Chartist";
            this.refreshStateFromWorld();
        }

        loadImage(src) {
            if (!src || typeof Image === "undefined") return;
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                this.spriteImage = img;
                this.isImageLoaded = true;
            };
            img.onerror = () => {
                console.warn(`Strativo RPG: Player sprite failed to load from ${src}, using procedural avatar fallback.`);
                this.isImageLoaded = false;
            };
            img.src = src;
        }

        refreshStateFromWorld() {
            try {
                if (window.StrativoWorldState && typeof window.StrativoWorldState.get === "function") {
                    const ws = window.StrativoWorldState.get();
                    if (ws) {
                        this.cachedHandle = ws.handle || "Student";
                        this.cachedLevel = ws.level || 1;
                        this.cachedRank = ws.rank || "Novice Chartist";
                    }
                }
            } catch (e) {
                // Graceful fallback
            }
        }

        /**
         * Updates player physics, movement, and animation states
         */
        update(deltaTime, inputVector, collisionSystem, worldBounds) {
            this.refreshStateFromWorld();

            const dt = Math.min(0.1, Math.max(0.001, deltaTime));

            if (inputVector && inputVector.isMoving) {
                this.state = "walking";
                this.walkTimer += dt;
                this.animFrame = Math.floor(this.walkTimer * 8) % 4;

                // Determine dominant facing direction
                const absX = Math.abs(inputVector.x);
                const absY = Math.abs(inputVector.y);

                if (absX > absY) {
                    this.facing = inputVector.x < 0 ? "left" : "right";
                } else {
                    this.facing = inputVector.y < 0 ? "up" : "down";
                }

                // Compute movement delta
                const targetX = this.x + inputVector.x * this.speed * dt;
                const targetY = this.y + inputVector.y * this.speed * dt;

                // Resolve movement with collision system & world bounds
                if (collisionSystem) {
                    const resolved = collisionSystem.resolveMovement(
                        this.x,
                        this.y,
                        targetX,
                        targetY,
                        this.width,
                        this.height,
                        worldBounds
                    );
                    this.x = resolved.x;
                    this.y = resolved.y;
                } else {
                    this.x = targetX;
                    this.y = targetY;
                }
            } else {
                this.state = "idle";
                this.walkTimer = 0;
                this.idleTimer += dt;
                this.animFrame = 0;
            }
        }

        /**
         * Renders the player character, shadow, glow, and nameplate
         */
        render(ctx, debugMode = false) {
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;

            // 1. Render Ground Shadow
            this._renderShadow(ctx, centerX, centerY);

            // 2. Render Cyan Ambient Glow (Idle / Walking aura)
            this._renderAura(ctx, centerX, centerY);

            // 3. Render Character Sprite / Procedural Fallback
            this._renderSprite(ctx, centerX, centerY);

            // 4. Render Floating Nameplate & Level Badge
            if (this.showNameplate) {
                this._renderNameplate(ctx, centerX, centerY);
            }

            // 5. Render Debug Hitbox if debug mode enabled
            if (debugMode) {
                this._renderDebugHitbox(ctx);
            }
        }

        _renderShadow(ctx, cx, cy) {
            ctx.save();
            ctx.beginPath();
            const shadowRadiusX = this.width * 0.7;
            const shadowRadiusY = this.height * 0.45;
            ctx.ellipse(cx, cy + 4, shadowRadiusX, shadowRadiusY, 0, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
            ctx.fill();
            ctx.restore();
        }

        _renderAura(ctx, cx, cy) {
            ctx.save();
            ctx.beginPath();
            const pulse = this.state === "walking"
                ? 0.25 + Math.sin(this.walkTimer * 12) * 0.08
                : 0.15 + Math.sin(this.idleTimer * 3) * 0.05;
            const auraRadius = (this.width + 12) * 0.8;
            ctx.ellipse(cx, cy + 4, auraRadius, auraRadius * 0.5, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 240, 255, ${pulse})`;
            ctx.shadowColor = "#00F0FF";
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.restore();
        }

        _renderSprite(ctx, cx, cy) {
            ctx.save();

            // Calculate walking bounce and tilt
            let bobY = 0;
            let tilt = 0;
            if (this.state === "walking") {
                bobY = Math.abs(Math.sin(this.walkTimer * 14)) * -4;
                tilt = Math.sin(this.walkTimer * 14) * 0.035;
                if (this.facing === "left") tilt = -tilt;
            } else {
                bobY = Math.sin(this.idleTimer * 2.5) * -1.5;
            }

            const drawX = cx;
            const drawY = this.y + this.spriteOffsetY + bobY;

            ctx.translate(drawX, drawY + this.spriteHeight / 2);
            ctx.rotate(tilt);

            // Horizontal flip for facing Left
            if (this.facing === "left") {
                ctx.scale(-1, 1);
            }

            if (this.isImageLoaded && this.spriteImage) {
                // Render sprite image centered horizontally
                const halfW = this.spriteWidth / 2;
                const halfH = this.spriteHeight / 2;

                // Subtle tint/shade if facing Up (showing back)
                if (this.facing === "up") {
                    ctx.globalAlpha = 0.92;
                }

                ctx.drawImage(
                    this.spriteImage,
                    -halfW,
                    -halfH,
                    this.spriteWidth,
                    this.spriteHeight
                );
            } else {
                // Procedural stylized futuristic student/trader fallback
                this._renderProceduralAvatar(ctx);
            }

            ctx.restore();
        }

        _renderProceduralAvatar(ctx) {
            const halfW = this.spriteWidth / 2;
            const halfH = this.spriteHeight / 2;

            // Body / Coat (Dark futuristic outfit with cyan accents)
            ctx.fillStyle = "#0F172A";
            ctx.strokeStyle = "#00E5A8";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(-halfW * 0.5, -halfH * 0.2, halfW, halfH * 0.8, 6);
            ctx.fill();
            ctx.stroke();

            // Cyan Collar / Lapel
            ctx.fillStyle = "#00F0FF";
            ctx.fillRect(-halfW * 0.2, -halfH * 0.15, halfW * 0.4, 4);

            // Head / Visor
            ctx.fillStyle = "#1E293B";
            ctx.beginPath();
            ctx.arc(0, -halfH * 0.5, halfW * 0.35, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#38BDF8";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Glowing Visor
            ctx.fillStyle = "#00F0FF";
            ctx.shadowColor = "#00F0FF";
            ctx.shadowBlur = 6;
            ctx.fillRect(-halfW * 0.25, -halfH * 0.55, halfW * 0.5, 6);
            ctx.shadowBlur = 0;
        }

        _renderNameplate(ctx, cx, cy) {
            ctx.save();
            const tagY = this.y + this.spriteOffsetY - 16;

            // Badge text
            const handleText = this.cachedHandle || "Student";
            const lvlText = `LVL ${this.cachedLevel}`;

            ctx.font = "bold 11px 'Inter', sans-serif";
            const handleWidth = ctx.measureText(handleText).width;

            ctx.font = "bold 9px 'Inter', sans-serif";
            const lvlWidth = ctx.measureText(lvlText).width;

            const totalWidth = handleWidth + lvlWidth + 24;
            const badgeHeight = 18;
            const badgeX = cx - totalWidth / 2;
            const badgeY = tagY - badgeHeight / 2;

            // Background pill
            ctx.fillStyle = "rgba(3, 7, 18, 0.85)";
            ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(badgeX, badgeY, totalWidth, badgeHeight, 9);
            ctx.fill();
            ctx.stroke();

            // Level sub-pill (Cyan/Emerald accent)
            const lvlPillW = lvlWidth + 10;
            ctx.fillStyle = "rgba(0, 229, 168, 0.25)";
            ctx.beginPath();
            ctx.roundRect(badgeX + 2, badgeY + 2, lvlPillW, badgeHeight - 4, 6);
            ctx.fill();

            // Level text
            ctx.fillStyle = "#00E5A8";
            ctx.font = "bold 9px 'Inter', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(lvlText, badgeX + 2 + lvlPillW / 2, badgeY + badgeHeight / 2);

            // Handle text
            ctx.fillStyle = "#F8FAFC";
            ctx.font = "600 11px 'Inter', sans-serif";
            ctx.textAlign = "left";
            ctx.fillText(handleText, badgeX + lvlPillW + 6, badgeY + badgeHeight / 2 + 0.5);

            ctx.restore();
        }

        _renderDebugHitbox(ctx) {
            ctx.save();
            ctx.strokeStyle = "#00FF66";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(this.x, this.y, this.width, this.height);

            // Center crosshair
            const cx = this.x + this.width / 2;
            const cy = this.y + this.height / 2;
            ctx.strokeStyle = "rgba(0, 255, 100, 0.6)";
            ctx.beginPath();
            ctx.moveTo(cx - 6, cy);
            ctx.lineTo(cx + 6, cy);
            ctx.moveTo(cx, cy - 6);
            ctx.lineTo(cx, cy + 6);
            ctx.stroke();

            // Facing direction indicator
            ctx.strokeStyle = "#00F0FF";
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            if (this.facing === "up") ctx.lineTo(cx, cy - 20);
            if (this.facing === "down") ctx.lineTo(cx, cy + 20);
            if (this.facing === "left") ctx.lineTo(cx - 20, cy);
            if (this.facing === "right") ctx.lineTo(cx + 20, cy);
            ctx.stroke();

            ctx.restore();
        }

        getPosition() {
            return {
                x: Math.round(this.x),
                y: Math.round(this.y),
                centerX: Math.round(this.x + this.width / 2),
                centerY: Math.round(this.y + this.height / 2),
                facing: this.facing,
                state: this.state
            };
        }

        setPosition(x, y) {
            this.x = Number(x) || this.x;
            this.y = Number(y) || this.y;
        }
    }

    // Expose to StrativoRPG namespace
    window.StrativoRPG.Player = Player;

})();
