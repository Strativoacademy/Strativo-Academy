/* ==========================================================================
   STRATIVO WORLD — 2D RPG CORE: CAMERA
   Version: 1.0
   Namespace: StrativoRPG.Camera
   Description:
   - 2D RPG Smooth Tracking Camera
   - Viewport clamping to World Boundaries
   - World-to-Screen coordinate projection
   ========================================================================== */

"use strict";

(function () {
    window.StrativoRPG = window.StrativoRPG || {};

    class Camera {
        constructor(viewportWidth = 800, viewportHeight = 600) {
            this.x = 0;
            this.y = 0;
            this.viewportWidth = viewportWidth;
            this.viewportHeight = viewportHeight;

            // Target to follow (object with x, y, width, height)
            this.target = null;

            // Smoothing factor (1.0 = instant snap, 0.1 = smooth interpolation)
            this.lerpSpeed = 0.12;

            // World bounds { x, y, width, height }
            this.worldBounds = { x: 0, y: 0, width: 2000, height: 1500 };

            // Optional zoom
            this.zoom = 1.0;
        }

        setViewport(width, height) {
            this.viewportWidth = Math.max(100, width);
            this.viewportHeight = Math.max(100, height);
            this.clamp();
        }

        setWorldBounds(bounds) {
            if (bounds) {
                this.worldBounds = {
                    x: Number(bounds.x) || 0,
                    y: Number(bounds.y) || 0,
                    width: Number(bounds.width) || 2000,
                    height: Number(bounds.height) || 1500
                };
                this.clamp();
            }
        }

        follow(target, immediate = false) {
            this.target = target;
            if (immediate && target) {
                this.snapToTarget();
            }
        }

        snapToTarget() {
            if (!this.target) return;
            const targetCenterX = this.target.x + (this.target.width ? this.target.width / 2 : 0);
            const targetCenterY = this.target.y + (this.target.height ? this.target.height / 2 : 0);

            this.x = targetCenterX - this.viewportWidth / 2;
            this.y = targetCenterY - this.viewportHeight / 2;
            this.clamp();
        }

        update(deltaTime = 0.016) {
            if (!this.target) return;

            const targetCenterX = this.target.x + (this.target.width ? this.target.width / 2 : 0);
            const targetCenterY = this.target.y + (this.target.height ? this.target.height / 2 : 0);

            const desiredX = targetCenterX - this.viewportWidth / 2;
            const desiredY = targetCenterY - this.viewportHeight / 2;

            // Smooth interpolation
            const factor = Math.min(1.0, this.lerpSpeed * (deltaTime / 0.016));
            this.x += (desiredX - this.x) * factor;
            this.y += (desiredY - this.y) * factor;

            this.clamp();
        }

        clamp() {
            if (!this.worldBounds) return;

            const minX = this.worldBounds.x;
            const minY = this.worldBounds.y;
            const maxX = this.worldBounds.x + this.worldBounds.width - this.viewportWidth;
            const maxY = this.worldBounds.y + this.worldBounds.height - this.viewportHeight;

            // If world is smaller than viewport, center world in viewport
            if (maxX < minX) {
                this.x = minX - (this.viewportWidth - this.worldBounds.width) / 2;
            } else {
                this.x = Math.max(minX, Math.min(maxX, this.x));
            }

            if (maxY < minY) {
                this.y = minY - (this.viewportHeight - this.worldBounds.height) / 2;
            } else {
                this.y = Math.max(minY, Math.min(maxY, this.y));
            }
        }

        worldToScreen(wx, wy) {
            return {
                x: wx - this.x,
                y: wy - this.y
            };
        }

        screenToWorld(sx, sy) {
            return {
                x: sx + this.x,
                y: sy + this.y
            };
        }

        isVisible(rect) {
            if (!rect) return true;
            const rx = rect.x !== undefined ? rect.x : 0;
            const ry = rect.y !== undefined ? rect.y : 0;
            const rw = rect.width !== undefined ? rect.width : 0;
            const rh = rect.height !== undefined ? rect.height : 0;
            return (
                rx + rw >= this.x &&
                rx <= this.x + this.viewportWidth &&
                ry + rh >= this.y &&
                ry <= this.y + this.viewportHeight
            );
        }

        getVisibleBounds() {
            return {
                x: this.x,
                y: this.y,
                width: this.viewportWidth,
                height: this.viewportHeight,
                left: this.x,
                right: this.x + this.viewportWidth,
                top: this.y,
                bottom: this.y + this.viewportHeight
            };
        }

        applyTransform(ctx) {
            ctx.save();
            ctx.translate(-Math.round(this.x), -Math.round(this.y));
        }

        restoreTransform(ctx) {
            ctx.restore();
        }
    }

    // Expose to StrativoRPG namespace
    window.StrativoRPG.Camera = Camera;

})();
