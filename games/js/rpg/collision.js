/* ==========================================================================
   STRATIVO WORLD — 2D RPG CORE: COLLISION SYSTEM
   Version: 1.0
   Namespace: StrativoRPG.Collision
   Description:
   - Axis-Aligned Bounding Box (AABB) collision detection
   - Rectangular obstacle & boundary management
   - Axis-separated movement resolution (smooth wall sliding)
   ========================================================================== */

"use strict";

(function () {
    window.StrativoRPG = window.StrativoRPG || {};

    /* ======================================================================
       RECTANGLE CLASS
       ====================================================================== */
    class Rectangle {
        constructor(x = 0, y = 0, width = 0, height = 0, id = null, type = "solid") {
            this.x = Number(x) || 0;
            this.y = Number(y) || 0;
            this.width = Math.max(0, Number(width) || 0);
            this.height = Math.max(0, Number(height) || 0);
            this.id = id || `rect_${Math.random().toString(36).slice(2, 9)}`;
            this.type = type; // "solid", "trigger", "boundary", "interaction"
        }

        get left() {
            return this.x;
        }

        get right() {
            return this.x + this.width;
        }

        get top() {
            return this.y;
        }

        get bottom() {
            return this.y + this.height;
        }

        get centerX() {
            return this.x + this.width / 2;
        }

        get centerY() {
            return this.y + this.height / 2;
        }

        intersects(other) {
            if (!other) return false;
            return (
                this.left < other.right &&
                this.right > other.left &&
                this.top < other.bottom &&
                this.bottom > other.top
            );
        }

        contains(px, py) {
            return (
                px >= this.left &&
                px <= this.right &&
                py >= this.top &&
                py <= this.bottom
            );
        }

        clone() {
            return new Rectangle(this.x, this.y, this.width, this.height, this.id, this.type);
        }
    }

    /* ======================================================================
       COLLISION SYSTEM
       ====================================================================== */
    class CollisionSystem {
        constructor() {
            this.colliders = [];
            this.triggers = [];
        }

        addCollider(rect) {
            if (rect instanceof Rectangle) {
                this.colliders.push(rect);
                return rect;
            }
            if (rect && typeof rect === "object") {
                const r = new Rectangle(rect.x, rect.y, rect.width, rect.height, rect.id, rect.type || "solid");
                this.colliders.push(r);
                return r;
            }
            return null;
        }

        addTrigger(rect) {
            if (rect instanceof Rectangle) {
                this.triggers.push(rect);
                return rect;
            }
            if (rect && typeof rect === "object") {
                const r = new Rectangle(rect.x, rect.y, rect.width, rect.height, rect.id, rect.type || "trigger");
                this.triggers.push(r);
                return r;
            }
            return null;
        }

        removeCollider(id) {
            this.colliders = this.colliders.filter(c => c.id !== id);
        }

        removeTrigger(id) {
            this.triggers = this.triggers.filter(t => t.id !== id);
        }

        clear() {
            this.colliders = [];
            this.triggers = [];
        }

        getColliders() {
            return this.colliders;
        }

        getTriggers() {
            return this.triggers;
        }

        /**
         * Checks whether a given bounding box intersects any solid colliders.
         * @param {Rectangle} box
         * @param {string|null} ignoreId
         * @returns {boolean}
         */
        checkCollision(box, ignoreId = null) {
            for (let i = 0; i < this.colliders.length; i++) {
                const collider = this.colliders[i];
                if (ignoreId && collider.id === ignoreId) continue;
                if (collider.type !== "solid") continue;
                if (box.intersects(collider)) {
                    return true;
                }
            }
            return false;
        }

        /**
         * Resolves movement from (currentX, currentY) to (targetX, targetY)
         * with axis-separated sliding so player doesn't get stuck on obstacles.
         * Clamps to world boundaries.
         *
         * @param {number} currentX
         * @param {number} currentY
         * @param {number} targetX
         * @param {number} targetY
         * @param {number} boxWidth
         * @param {number} boxHeight
         * @param {Rectangle|Object} worldBounds
         * @returns {{x: number, y: number, collidedX: boolean, collidedY: boolean}}
         */
        resolveMovement(currentX, currentY, targetX, targetY, boxWidth, boxHeight, worldBounds) {
            let finalX = currentX;
            let finalY = currentY;
            let collidedX = false;
            let collidedY = false;

            const minX = worldBounds ? worldBounds.x : 0;
            const minY = worldBounds ? worldBounds.y : 0;
            const maxX = worldBounds ? worldBounds.x + worldBounds.width - boxWidth : Infinity;
            const maxY = worldBounds ? worldBounds.y + worldBounds.height - boxHeight : Infinity;

            // 1. Test X Movement First
            const testX = Math.max(minX, Math.min(maxX, targetX));
            if (testX !== targetX) {
                collidedX = true;
            }

            const boxX = new Rectangle(testX, currentY, boxWidth, boxHeight);
            if (!this.checkCollision(boxX)) {
                finalX = testX;
            } else {
                collidedX = true;
            }

            // 2. Test Y Movement Second (using updated finalX)
            const testY = Math.max(minY, Math.min(maxY, targetY));
            if (testY !== targetY) {
                collidedY = true;
            }

            const boxY = new Rectangle(finalX, testY, boxWidth, boxHeight);
            if (!this.checkCollision(boxY)) {
                finalY = testY;
            } else {
                collidedY = true;
            }

            return {
                x: finalX,
                y: finalY,
                collidedX,
                collidedY
            };
        }
    }

    // Expose to StrativoRPG namespace
    window.StrativoRPG.Rectangle = Rectangle;
    window.StrativoRPG.CollisionSystem = CollisionSystem;

})();
