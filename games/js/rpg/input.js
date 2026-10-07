/* ==========================================================================
   STRATIVO WORLD — 2D RPG CORE: INPUT MANAGER
   Version: 1.0
   Namespace: StrativoRPG.InputManager
   Description:
   - Desktop Keyboard (WASD, Arrow Keys, E, Space, Enter, F3)
   - Mobile Touch Virtual Joystick & Action Button
   - Direction vector normalization & deadzone handling
   - Page scroll lock prevention on game canvas
   ========================================================================== */

"use strict";

(function () {
    window.StrativoRPG = window.StrativoRPG || {};

    class InputManager {
        constructor(options = {}) {
            this.container = options.container || document.body;
            this.keys = {
                up: false,
                down: false,
                left: false,
                right: false,
                interact: false,
                debug: false
            };

            // Raw touch joystick vector
            this.touchVector = { x: 0, y: 0 };
            this.touchActive = false;
            this.touchInteract = false;

            // Single-frame interact trigger
            this._interactConsumed = false;
            this._debugToggleRequested = false;

            // Virtual Joystick configuration
            this.joystick = {
                active: false,
                pointerId: null,
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0,
                maxRadius: options.joystickMaxRadius || 45,
                deadzone: options.joystickDeadzone || 0.12
            };

            // Bound handlers for cleanup
            this._onKeyDown = this._handleKeyDown.bind(this);
            this._onKeyUp = this._handleKeyUp.bind(this);
            this._onPointerDown = this._handlePointerDown.bind(this);
            this._onPointerMove = this._handlePointerMove.bind(this);
            this._onPointerUp = this._handlePointerUp.bind(this);

            this.isAttached = false;
        }

        attach(container = null) {
            if (this.isAttached) return;
            if (container) this.container = container;

            window.addEventListener("keydown", this._onKeyDown, { passive: false });
            window.addEventListener("keyup", this._onKeyUp, { passive: true });

            if (this.container) {
                this.container.addEventListener("pointerdown", this._onPointerDown, { passive: false });
                window.addEventListener("pointermove", this._onPointerMove, { passive: false });
                window.addEventListener("pointerup", this._onPointerUp, { passive: true });
                window.addEventListener("pointercancel", this._onPointerUp, { passive: true });
            }

            this.isAttached = true;
        }

        detach() {
            if (!this.isAttached) return;

            window.removeEventListener("keydown", this._onKeyDown);
            window.removeEventListener("keyup", this._onKeyUp);

            if (this.container) {
                this.container.removeEventListener("pointerdown", this._onPointerDown);
                window.removeEventListener("pointermove", this._onPointerMove);
                window.removeEventListener("pointerup", this._onPointerUp);
                window.removeEventListener("pointercancel", this._onPointerUp);
            }

            this.reset();
            this.isAttached = false;
        }

        reset() {
            this.keys.up = false;
            this.keys.down = false;
            this.keys.left = false;
            this.keys.right = false;
            this.keys.interact = false;
            this.touchVector = { x: 0, y: 0 };
            this.joystick.active = false;
            this.joystick.pointerId = null;
            this.touchInteract = false;
            this._interactConsumed = false;
            this._debugToggleRequested = false;
        }

        /* ==================================================================
           KEYBOARD EVENT HANDLERS
           ================================================================== */
        _handleKeyDown(e) {
            // Ignore if typing in text inputs or textareas that are actually in an active visible modal
            const activeEl = document.activeElement;
            const activeTag = activeEl ? activeEl.tagName.toLowerCase() : "";
            if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") {
                const inHiddenModal = activeEl.closest("[aria-hidden='true'], [style*='display: none'], [style*='display:none']");
                const inActiveModal = activeEl.closest(".active, [role='dialog']:not([aria-hidden='true'])");
                if (!inHiddenModal && inActiveModal) {
                    return;
                } else if (activeEl && typeof activeEl.blur === "function") {
                    activeEl.blur();
                }
            }

            let captured = false;
            const code = e.code;
            const key = e.key ? e.key.toLowerCase() : "";

            if (code === "KeyW" || code === "ArrowUp" || key === "w" || key === "arrowup") {
                this.keys.up = true;
                captured = true;
            }
            if (code === "KeyS" || code === "ArrowDown" || key === "s" || key === "arrowdown") {
                this.keys.down = true;
                captured = true;
            }
            if (code === "KeyA" || code === "ArrowLeft" || key === "a" || key === "arrowleft") {
                this.keys.left = true;
                captured = true;
            }
            if (code === "KeyD" || code === "ArrowRight" || key === "d" || key === "arrowright") {
                this.keys.right = true;
                captured = true;
            }

            // Interact (E, Space, Enter)
            if (code === "KeyE" || code === "Space" || code === "Enter" || key === "e" || key === " ") {
                if (!this.keys.interact) {
                    this._interactConsumed = false;
                }
                this.keys.interact = true;
                captured = true;
            }

            // Prevent page scrolling on Arrow keys and Space
            if (captured && e.cancelable) {
                e.preventDefault();
            }
        }

        _handleKeyUp(e) {
            const code = e.code;
            const key = e.key ? e.key.toLowerCase() : "";

            if (code === "KeyW" || code === "ArrowUp" || key === "w" || key === "arrowup") {
                this.keys.up = false;
            }
            if (code === "KeyS" || code === "ArrowDown" || key === "s" || key === "arrowdown") {
                this.keys.down = false;
            }
            if (code === "KeyA" || code === "ArrowLeft" || key === "a" || key === "arrowleft") {
                this.keys.left = false;
            }
            if (code === "KeyD" || code === "ArrowRight" || key === "d" || key === "arrowright") {
                this.keys.right = false;
            }
            if (code === "KeyE" || code === "Space" || code === "Enter" || key === "e" || key === " ") {
                this.keys.interact = false;
                this._interactConsumed = false;
            }
        }

        /* ==================================================================
           TOUCH / POINTER JOYSTICK HANDLERS
           ================================================================== */
        _handlePointerDown(e) {
            // Check if the target is an interact button or custom UI element
            if (e.target && e.target.closest(".rpg-touch-action-btn, .pd-touch-action-btn, #pd-touch-action, [data-action-btn]")) {
                this.touchInteract = true;
                this._interactConsumed = false;
                if (e.cancelable) e.preventDefault();
                return;
            }

            // Check if target is a specific UI button (e.g. settings/debug button)
            if (e.target && e.target.closest("button, a, input, select, textarea, [data-no-joystick]")) {
                return;
            }

            // If joystick is not yet active, start joystick on touch/pointer down
            if (!this.joystick.active) {
                const rect = this.container.getBoundingClientRect();
                const clientX = e.clientX - rect.left;
                const clientY = e.clientY - rect.top;

                this.joystick.active = true;
                this.joystick.pointerId = e.pointerId;
                this.joystick.startX = clientX;
                this.joystick.startY = clientY;
                this.joystick.currentX = clientX;
                this.joystick.currentY = clientY;

                this._updateJoystickVector();
                if (e.cancelable) e.preventDefault();
            }
        }

        _handlePointerMove(e) {
            if (this.joystick.active && e.pointerId === this.joystick.pointerId) {
                const rect = this.container.getBoundingClientRect();
                this.joystick.currentX = e.clientX - rect.left;
                this.joystick.currentY = e.clientY - rect.top;

                this._updateJoystickVector();
                if (e.cancelable) e.preventDefault();
            }
        }

        _handlePointerUp(e) {
            if (this.joystick.active && e.pointerId === this.joystick.pointerId) {
                this.joystick.active = false;
                this.joystick.pointerId = null;
                this.touchVector = { x: 0, y: 0 };
            }
            if (this.touchInteract) {
                this.touchInteract = false;
                this._interactConsumed = false;
            }
        }

        _updateJoystickVector() {
            const dx = this.joystick.currentX - this.joystick.startX;
            const dy = this.joystick.currentY - this.joystick.startY;
            const distance = Math.hypot(dx, dy);

            if (distance < this.joystick.deadzone * this.joystick.maxRadius) {
                this.touchVector = { x: 0, y: 0 };
                return;
            }

            const clampedDist = Math.min(distance, this.joystick.maxRadius);
            const intensity = clampedDist / this.joystick.maxRadius;
            const angle = Math.atan2(dy, dx);

            this.touchVector = {
                x: Math.cos(angle) * intensity,
                y: Math.sin(angle) * intensity
            };
        }

        /* ==================================================================
           PUBLIC VECTOR & STATE QUERIES
           ================================================================== */
        /**
         * Returns normalized movement vector { x: -1..1, y: -1..1, length: 0..1 }
         */
        getVector() {
            let vx = 0;
            let vy = 0;

            // Keyboard input
            if (this.keys.left) vx -= 1;
            if (this.keys.right) vx += 1;
            if (this.keys.up) vy -= 1;
            if (this.keys.down) vy += 1;

            // Normalize diagonal keyboard vectors
            if (vx !== 0 && vy !== 0) {
                const invLen = 1 / Math.SQRT2;
                vx *= invLen;
                vy *= invLen;
            }

            // Combine with touch vector if active
            if (this.touchVector.x !== 0 || this.touchVector.y !== 0) {
                vx = this.touchVector.x;
                vy = this.touchVector.y;
            }

            const length = Math.min(1, Math.hypot(vx, vy));

            return {
                x: vx,
                y: vy,
                length: length,
                isMoving: length > 0.05
            };
        }

        getMovementVector() {
            return this.getVector();
        }

        update() {
            // No-op for input state polling compatibility
        }

        /**
         * Checks if interact is triggered and consumes the single-frame action.
         * @returns {boolean}
         */
        consumeInteract() {
            const isDown = this.keys.interact || this.touchInteract;
            if (isDown && !this._interactConsumed) {
                this._interactConsumed = true;
                return true;
            }
            return false;
        }

        /**
         * Checks if debug toggle was requested and consumes the request.
         * @returns {boolean}
         */
        consumeDebugToggle() {
            if (this._debugToggleRequested) {
                this._debugToggleRequested = false;
                return true;
            }
            return false;
        }

        /**
         * Returns current virtual joystick visual info for rendering if desired.
         */
        getJoystickVisualState() {
            return {
                active: this.joystick.active,
                startX: this.joystick.startX,
                startY: this.joystick.startY,
                currentX: this.joystick.currentX,
                currentY: this.joystick.currentY,
                maxRadius: this.joystick.maxRadius
            };
        }
    }

    // Expose to StrativoRPG namespace
    window.StrativoRPG.InputManager = InputManager;

})();
