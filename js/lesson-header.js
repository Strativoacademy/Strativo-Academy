"use strict";

(function () {

    const LESSON_TITLE_LABELS = {
        1: "What is Forex?",
        2: "Currency Pairs & Exchange Rates",
        3: "Market Sessions & Trading Hours",
        4: "Who Trades Forex?",
        5: "What is a Pip?",
        6: "Lot Sizes & Position Sizing",
        7: "Leverage & Margin Explained",
        8: "Support & Resistance",
        9: "Trendlines & Channels",
        10: "Introduction to MetaTrader"
    };

    function getRootPath() {
        if (typeof window.getProjectRootPath === "function") {
            return window.getProjectRootPath();
        }

        const path = window.location.pathname.replace(/\\/g, "/");
        const parts = path.split("/").filter(Boolean);
        const lastPart = parts[parts.length - 1] || "";
        const directoryDepth = /\.[a-z0-9]+$/i.test(lastPart)
            ? parts.length - 1
            : parts.length;

        return "../".repeat(directoryDepth);
    }

    function getCurrentLesson() {
        const path = window.location.pathname.replace(/\\/g, "/");
        const match = path.match(/\/lessons\/module(\d+)\/lesson(\d+)\.html$/i);

        if (!match) {
            return null;
        }

        return {
            moduleNumber: Number(match[1]),
            lessonNumber: Number(match[2])
        };
    }

    function getLessonTitle(lessonNumber) {
        return LESSON_TITLE_LABELS[lessonNumber] || `Lesson ${lessonNumber}`;
    }

    function getLessonPath(moduleNumber, lessonNumber) {
        return `lessons/module${moduleNumber}/lesson${lessonNumber}.html`;
    }

    function getModulePath(moduleNumber) {
        return `modules/module${moduleNumber}.html`;
    }

    function setLink(link, path, label) {
        if (!link) {
            return;
        }

        link.href = `${getRootPath()}${path}`;

        if (label) {
            link.textContent = label;
        }
    }

    function initializeLessonHeader() {
        const root = document.querySelector(
            '[data-component="lesson-header"]'
        );
        const lesson = getCurrentLesson();

        if (!root || !lesson || root.dataset.lessonHeaderInitialized === "true") {
            return;
        }

        root.dataset.lessonHeaderInitialized = "true";

        const moduleLabel = `Module ${lesson.moduleNumber}`;
        const lessonLabel = `Lesson ${lesson.lessonNumber}`;
        const lessonTitle = getLessonTitle(lesson.lessonNumber);
        const modulePath = getModulePath(lesson.moduleNumber);
        const beginnerPath = "beginner.html";
        const previousLink = root.querySelector("#lesson-previous-link");
        const nextLink = root.querySelector("#lesson-next-link");
        const saveButton = root.querySelector("#saveExitBtn");

        setLink(root.querySelector("#lesson-breadcrumb-home"), "index.html");
        setLink(root.querySelector("#lesson-breadcrumb-course"), beginnerPath);
        setLink(root.querySelector("#lesson-breadcrumb-module"), modulePath, moduleLabel);

        const currentBreadcrumb = root.querySelector("#lesson-breadcrumb-current");
        if (currentBreadcrumb) {
            currentBreadcrumb.textContent = lessonLabel;
            currentBreadcrumb.title = lessonTitle;
        }

        if (lesson.lessonNumber <= 1) {
            setLink(previousLink, modulePath, "← Back to Module");
        } else {
            setLink(
                previousLink,
                getLessonPath(lesson.moduleNumber, lesson.lessonNumber - 1),
                "← Previous Lesson"
            );
        }

        const currentLabel = root.querySelector("#lesson-current-label");
        const moduleInfo = root.querySelector("#lesson-module-label");
        const statusLabel = root.querySelector("#lesson-status-label");

        if (currentLabel) {
            currentLabel.textContent = lessonLabel;
            currentLabel.title = lessonTitle;
        }
        if (moduleInfo) {
            moduleInfo.textContent = moduleLabel;
        }
        if (statusLabel) {
            statusLabel.textContent = "In Progress";
        }

        if (lesson.lessonNumber >= 10) {
            nextLink.removeAttribute("href");
            nextLink.textContent = "Course Complete";
            nextLink.setAttribute("aria-disabled", "true");
            nextLink.setAttribute("tabindex", "-1");
        } else {
            setLink(
                nextLink,
                getLessonPath(lesson.moduleNumber, lesson.lessonNumber + 1),
                "Next Lesson →"
            );
        }

        if (saveButton) {
            saveButton.addEventListener("click", function () {
                if (typeof window.saveLessonState === "function") {
                    window.saveLessonState();
                }
                if (typeof window.saveState === "function") {
                    window.saveState();
                }
                if (typeof window.saveNotes === "function") {
                    window.saveNotes();
                }
                if (typeof window.refreshFromDOM === "function") {
                    window.refreshFromDOM();
                }
                if (typeof window.updateProgress === "function") {
                    window.updateProgress();
                }

                window.location.href = `${getRootPath()}${modulePath}`;
            });
        }
    }

    document.addEventListener("strativo:component-loaded", function (event) {
        if (event.detail && event.detail.name === "lesson-header") {
            initializeLessonHeader();
        }
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeLessonHeader);
    } else {
        initializeLessonHeader();
    }

    window.StrativoLessonHeader = {
        initialize: initializeLessonHeader,
        getCurrentLesson: getCurrentLesson
    };

})();
