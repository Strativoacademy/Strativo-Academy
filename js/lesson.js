/* ==========================================
   STRATIVO ACADEMY
   Lesson Engine v3.0
   Dynamic, Adaptive & Achievement Connected
========================================== */

"use strict";


/* ==========================================================
   GLOBAL LESSON STATE
========================================================== */

let currentStep = 1;
let unlockedStep = 1;

let totalSteps = 0;

function detectTotalSteps() {
    return document.querySelectorAll(".lesson-step").length || 1;
}

function getQuizStep() {
    const steps = document.querySelectorAll(".lesson-step");

    for (const step of steps) {
        if (
            step.classList.contains("quiz-step") ||
            step.dataset.stepType === "quiz" ||
            step.querySelector("#quiz-container, #quiz-box, #quiz-question")
        ) {
            const match = /^step(\d+)$/i.exec(step.id || "");
            if (match) {
                return Number(match[1]);
            }
        }
    }

    return null;
}


/* ==========================================================
   DYNAMIC LESSON PREFIX
   ----------------------------------------------------------
   Example:
   lesson5.html
   → lesson5
========================================================== */

const getLessonPrefix = () => {

    const path =
        window.location.pathname;

    const pageName =
        path.substring(
            path.lastIndexOf("/") + 1
        );

    const match =
        pageName.match(/lesson\d+/i);

    return match
        ? match[0].toLowerCase()
        : "general_lesson";
};


/* ==========================================================
   STORAGE KEYS
========================================================== */

const LESSON_PREFIX =
    getLessonPrefix();


const STORAGE_STEP_KEY =
    `${LESSON_PREFIX}_currentStep`;


const STORAGE_UNLOCKED_KEY =
    `${LESSON_PREFIX}_unlockedStep`;


const STORAGE_COMPLETED_KEY =
    `${LESSON_PREFIX}_completed`;


/* ==========================================================
   SHOW TOAST
========================================================== */

function lessonToast(
    message,
    type = "warning"
) {

    if (
        typeof window.showToast ===
        "function"
    ) {

        window.showToast(
            message,
            type
        );

        return;
    }


    let notice =
        document.getElementById(
            "strat-toast"
        );


    if (!notice) {

        notice =
            document.createElement(
                "div"
            );

        notice.id =
            "strat-toast";

        notice.setAttribute(
            "role",
            "status"
        );

        notice.style.cssText =
            "position:fixed;" +
            "bottom:30px;" +
            "right:30px;" +
            "background:#ef4444;" +
            "color:#fff;" +
            "padding:15px 25px;" +
            "border-radius:8px;" +
            "font-weight:700;" +
            "box-shadow:0 10px 30px rgba(0,0,0,.5);" +
            "z-index:10000;" +
            "transition:opacity .3s ease,transform .3s ease;" +
            "font-size:14px;" +
            "transform:translateY(20px);" +
            "opacity:0;";

        document.body.appendChild(
            notice
        );
    }


    notice.textContent =
        message;

    notice.style.opacity =
        "1";

    notice.style.transform =
        "translateY(0)";


    setTimeout(() => {

        notice.style.opacity =
            "0";

        notice.style.transform =
            "translateY(20px)";

    }, 3000);
}


/* ==========================================================
   SAVE CURRENT STATE
========================================================== */

function saveLessonState() {

    localStorage.setItem(
        STORAGE_STEP_KEY,
        currentStep.toString()
    );


    localStorage.setItem(
        STORAGE_UNLOCKED_KEY,
        unlockedStep.toString()
    );
}


/* ==========================================================
   MARK LESSON COMPLETED
   ----------------------------------------------------------
   This is the course-level completion flag.

   Quiz validation should still happen inside the
   quiz system. This function is only responsible for
   recording completion once the lesson reaches its
   final step.
========================================================== */

function completeCurrentLesson() {

    const alreadyCompleted =
        localStorage.getItem(
            STORAGE_COMPLETED_KEY
        ) === "true";


    if (alreadyCompleted) {
        return;
    }


    localStorage.setItem(
        STORAGE_COMPLETED_KEY,
        "true"
    );


    /*
     * Record learning activity through the existing
     * Achievement Engine when available.
     */

    if (
        window.StrativoAchievementEngine &&
        typeof
        window.StrativoAchievementEngine
            .recordLearningActivity ===
        "function"
    ) {

        try {

            window.StrativoAchievementEngine
                .recordLearningActivity();

        } catch (error) {

            console.warn(
                "Strativo Academy: Could not record learning activity.",
                error
            );
        }
    }


    /*
     * Refresh Achievement Engine so XP/achievements
     * can react to the newly completed lesson.
     */

    if (
        window.StrativoAchievementEngine &&
        typeof
        window.StrativoAchievementEngine
            .refresh ===
        "function"
    ) {

        try {

            window.StrativoAchievementEngine
                .refresh();

        } catch (error) {

            console.warn(
                "Strativo Academy: Achievement refresh failed.",
                error
            );
        }
    }


    /*
     * Notify other open Academy components.
     */

    window.dispatchEvent(
        new CustomEvent(
            "strativo:lessonCompleted",
            {
                detail: {
                    lesson:
                        LESSON_PREFIX,

                    lessonNumber:
                        getLessonNumber()
                }
            }
        )
    );
}


/* ==========================================================
   GET NUMERIC LESSON NUMBER
========================================================== */

function getLessonNumber() {

    const match =
        LESSON_PREFIX.match(
            /lesson(\d+)/i
        );


    if (!match) {
        return null;
    }


    return parseInt(
        match[1],
        10
    );
}


/* ==========================================================
   CHECK COMPLETION
========================================================== */

function isCurrentLessonCompleted() {

    return (
        localStorage.getItem(
            STORAGE_COMPLETED_KEY
        ) === "true"
    );
}


/* ==========================================================
   SHOW STEP
========================================================== */

function showStep(step) {

    /* ----------------------------------------------
       STEP BOUNDARY
    ---------------------------------------------- */

    if (step < 1) {
        step = 1;
    }


    if (step > totalSteps) {
        step = totalSteps;
    }


    /* ----------------------------------------------
       LOCKED STEP
    ---------------------------------------------- */

    if (
        step > unlockedStep
    ) {

        lessonToast(
            "🔒 Complete the previous lesson step first.",
            "warning"
        );

        return;
    }


    /* ----------------------------------------------
       UPDATE CURRENT STEP
    ---------------------------------------------- */

    currentStep =
        step;


    /* ----------------------------------------------
       HIDE ALL STEPS
    ---------------------------------------------- */

    document
        .querySelectorAll(
            ".lesson-step"
        )
        .forEach(
            section => {

                section.classList.remove(
                    "active-step"
                );

                section.classList.remove(
                    "active"
                );
            }
        );


    /* ----------------------------------------------
       SHOW ACTIVE STEP
    ---------------------------------------------- */

    const activeSection =
        document.getElementById(
            "step" + step
        );


    if (activeSection) {

        activeSection.classList.add(
            "active-step"
        );
    }


    /* ----------------------------------------------
       UPDATE UI
    ---------------------------------------------- */

    updateProgressBar();

    updateSidebar();


    /* ----------------------------------------------
       QUIZ HANDOFF
       ------------------------------------------------
       Existing architecture uses step 9 for quiz.
    ---------------------------------------------- */

    const quizStep = getQuizStep();

    if (
        quizStep !== null &&
        step === quizStep &&
        typeof loadQuestion ===
        "function"
    ) {

        try {

            loadQuestion();

        } catch (error) {

            console.error(
                "Strativo Academy: Quiz failed to load.",
                error
            );
        }
    }


    /* ----------------------------------------------
       FINAL STEP
       ------------------------------------------------
       Reaching the final lesson step means the
       lesson content has reached its completion
       state.

       Actual quiz validation remains owned by the
       quiz system.
    ---------------------------------------------- */

    if (
        step === totalSteps
    ) {

        completeCurrentLesson();
    }


    /* ----------------------------------------------
       SAVE STATE
    ---------------------------------------------- */

    saveLessonState();
}


/* ==========================================================
   NEXT STEP
========================================================== */

function nextStep() {

    if (
        currentStep >=
        totalSteps
    ) {

        completeCurrentLesson();

        return;
    }


    const nextStepNumber =
        currentStep + 1;


    /*
     * Unlock the next step.
     */

    if (
        unlockedStep <
        nextStepNumber
    ) {

        unlockedStep =
            nextStepNumber;
    }


    showStep(
        nextStepNumber
    );
}


/* ==========================================================
   PREVIOUS STEP
========================================================== */

function previousStep() {

    if (
        currentStep > 1
    ) {

        showStep(
            currentStep - 1
        );
    }
}


/* ==========================================================
   PROGRESS BAR
========================================================== */

function updateProgressBar() {

    const percent =
        (
            currentStep /
            totalSteps
        ) * 100;


    /* ----------------------------------------------
       ALL PROGRESS INDICATORS
    ---------------------------------------------- */

    const indicators =
        document.querySelectorAll(
            ".progress-bar, " +
            ".lesson-progress-fill, " +
            ".continue-progress-fill, " +
            ".dash-progress-fill"
        );


    indicators.forEach(
        bar => {

            if (bar) {

                bar.style.width =
                    percent + "%";
            }
        }
    );


    /* ----------------------------------------------
       STEP TEXT
    ---------------------------------------------- */

    const stepText =
        document.querySelector(
            ".step-text"
        );


    if (stepText) {

        stepText.innerHTML =
            `Step ${currentStep} of ${totalSteps}`;
    }


    /* ----------------------------------------------
       CONTINUE WIDGET
    ---------------------------------------------- */

    const continueStepText =
        document.getElementById(
            "continue-step-text"
        );


    const continuePercentText =
        document.getElementById(
            "continue-percent-text"
        );


    if (
        continueStepText
    ) {

        continueStepText.innerHTML =
            `Step ${currentStep} of ${totalSteps}`;
    }


    if (
        continuePercentText
    ) {

        continuePercentText.innerHTML =
            Math.round(
                percent
            ) + "%";
    }


    /* ----------------------------------------------
       DASHBOARD METRICS
    ---------------------------------------------- */

    updateDashboardMetrics(
        percent
    );
}


/* ==========================================================
   DASHBOARD METRICS
========================================================== */

function updateDashboardMetrics(
    percent
) {

    const dashStepText =
        document.getElementById(
            "dash-step-text"
        );


    const dashPercentText =
        document.getElementById(
            "dash-percent-text"
        );


    const dashXpText =
        document.getElementById(
            "dash-xp-text"
        );


    const dashQuizStatus =
        document.getElementById(
            "dash-quiz-status"
        );


    const dashLessonStatus =
        document.getElementById(
            "dash-lesson-status"
        );


    if (
        dashStepText
    ) {

        dashStepText.innerHTML =
            `Step ${currentStep} of ${totalSteps}`;
    }


    if (
        dashPercentText
    ) {

        dashPercentText.innerHTML =
            Math.round(
                percent
            ) + "%";
    }


    /*
     * Preserve the existing lesson dashboard
     * calculation.
     */

    let calculatedXp =
        (
            currentStep - 1
        ) * 20;


    if (
        currentStep ===
        totalSteps
    ) {

        calculatedXp =
            200;
    }


    if (
        dashXpText
    ) {

        dashXpText.innerHTML =
            `${calculatedXp} XP`;
    }


    /* ----------------------------------------------
       QUIZ STATUS
    ---------------------------------------------- */

    if (
        dashQuizStatus
    ) {

        const quizStep = getQuizStep();

        if (
            quizStep !== null &&
            currentStep === quizStep
        ) {

            dashQuizStatus.innerHTML =
                "In Progress";

            dashQuizStatus.className =
                "dash-value highlight-blue";

        } else if (
            (quizStep !== null && currentStep > quizStep) ||
            unlockedStep > (quizStep || 0)
        ) {

            dashQuizStatus.innerHTML =
                "Completed";

            dashQuizStatus.className =
                "dash-value highlight-green";

        } else {

            dashQuizStatus.innerHTML =
                "Not Started";

            dashQuizStatus.className =
                "dash-value";
        }
    }


    /* ----------------------------------------------
       LESSON STATUS
    ---------------------------------------------- */

    if (
        dashLessonStatus
    ) {

        if (
            isCurrentLessonCompleted()
        ) {

            dashLessonStatus.innerHTML =
                "Completed";

            dashLessonStatus.className =
                "dash-value highlight-green";

        } else if (
            currentStep > 1
        ) {

            dashLessonStatus.innerHTML =
                "In Progress";

            dashLessonStatus.className =
                "dash-value highlight-blue";

        } else {

            dashLessonStatus.innerHTML =
                "Not Started";

            dashLessonStatus.className =
                "dash-value";
        }
    }
}


/* ==========================================================
   RESUME LEARNING
========================================================== */

function resumeLearning() {

    showStep(
        currentStep
    );


    const lessonContent =
        document.querySelector(
            ".lesson-layout"
        );


    if (
        lessonContent
    ) {

        lessonContent.scrollIntoView(
            {
                behavior: "smooth",
                block: "start"
            }
        );
    }
}


/* ==========================================================
   SIDEBAR SYNC
========================================================== */

function updateSidebar() {

    const items =
        document.querySelectorAll(
            "#lesson-sidebar-list li, " +
            "#lessonMenu li"
        );


    items.forEach(
        (item, index) => {

            item.classList.remove(
                "active"
            );


            const step =
                Number(item.dataset.step) || index + 1;


            /*
             * Remove previously generated badges.
             */

            const cleanText =
                item.textContent
                    .replace(
                        /^👋\s|^⚡\s|^🏦\s|^⚖️\s|^📊\s|^🧮\s|^⚠️\s|^💡\s|^🧠\s|^🏁\s|^✅\s|^🟢\s|^🔓\s|^🔒\s/,
                        ""
                    )
                    .trim();


            /* ------------------------------------------
               COMPLETED STEP
            ------------------------------------------ */

            if (
                step <
                currentStep
            ) {

                item.innerHTML =
                    "✅ " +
                    cleanText;

            }


            /* ------------------------------------------
               CURRENT STEP
            ------------------------------------------ */

            else if (
                step ===
                currentStep
            ) {

                item.classList.add(
                    "active"
                );

                item.innerHTML =
                    "🟢 " +
                    cleanText;

            }


            /* ------------------------------------------
               UNLOCKED STEP
            ------------------------------------------ */

            else if (
                step <=
                unlockedStep
            ) {

                item.innerHTML =
                    "🔓 " +
                    cleanText;

            }


            /* ------------------------------------------
               LOCKED STEP
            ------------------------------------------ */

            else {

                item.innerHTML =
                    "🔒 " +
                    cleanText;
            }
        }
    );
}


/* ==========================================================
   LESSON ENGINE INITIALIZER
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        totalSteps = detectTotalSteps();

        const savedStep =
            parseInt(
                localStorage.getItem(
                    STORAGE_STEP_KEY
                ),
                10
            );


        const savedUnlocked =
            parseInt(
                localStorage.getItem(
                    STORAGE_UNLOCKED_KEY
                ),
                10
            );


        /* ------------------------------------------
           RESTORE UNLOCKED STEP
        ------------------------------------------ */

        if (
            !isNaN(
                savedUnlocked
            )
        ) {

            unlockedStep =
                Math.min(
                    totalSteps,
                    Math.max(
                        1,
                        savedUnlocked
                    )
                );

        } else {

            unlockedStep =
                1;
        }


        /* ------------------------------------------
           RESTORE CURRENT STEP
        ------------------------------------------ */

        if (
            unlockedStep >=
            totalSteps
        ) {

            /*
             * Completed lessons open from Step 1
             * for review.
             */

            showStep(1);

        } else if (
            !isNaN(
                savedStep
            )
        ) {

            currentStep =
                Math.min(
                    unlockedStep,
                    Math.max(
                        1,
                        savedStep
                    )
                );


            showStep(
                currentStep
            );

        } else {

            showStep(1);
        }
    }
);


/* ==========================================================
   SMART STUDY TOOLKIT
========================================================== */


/* ----------------------------------------------
   STORAGE KEYS
---------------------------------------------- */

const STORAGE_BOOKMARK_KEY =
    `${LESSON_PREFIX}_bookmark`;


const STORAGE_NOTES_KEY =
    `${LESSON_PREFIX}_notes`;


const STORAGE_TIMER_KEY =
    `${LESSON_PREFIX}_timer`;


let studySeconds = 0;

let studyTimerInterval = null;


/* ==========================================================
   TOOLKIT INITIALIZER
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initBookmark();

        initNotes();

        initStudyTimer();
    }
);


/* ==========================================================
   BOOKMARK
========================================================== */

function initBookmark() {

    const isBookmarked =
        localStorage.getItem(
            STORAGE_BOOKMARK_KEY
        ) === "true";


    const btn =
        document.getElementById(
            "btn-bookmark"
        );


    if (
        btn &&
        isBookmarked
    ) {

        btn.innerHTML =
            "Bookmarked ✓";

        btn.classList.add(
            "bookmarked-active"
        );
    }
}


function toggleBookmark() {

    const btn =
        document.getElementById(
            "btn-bookmark"
        );


    if (!btn) {
        return;
    }


    const isBookmarked =
        localStorage.getItem(
            STORAGE_BOOKMARK_KEY
        ) === "true";


    if (
        isBookmarked
    ) {

        localStorage.setItem(
            STORAGE_BOOKMARK_KEY,
            "false"
        );


        btn.innerHTML =
            "Save Bookmark";


        btn.classList.remove(
            "bookmarked-active"
        );

    } else {

        localStorage.setItem(
            STORAGE_BOOKMARK_KEY,
            "true"
        );


        btn.innerHTML =
            "Bookmarked ✓";


        btn.classList.add(
            "bookmarked-active"
        );
    }
}


/* ==========================================================
   PERSONAL NOTES
========================================================== */

function initNotes() {

    const textarea =
        document.getElementById(
            "personal-notes"
        );


    const saveStatus =
        document.getElementById(
            "save-status"
        );


    if (!textarea) {
        return;
    }


    /* ----------------------------------------------
       RESTORE NOTES
    ---------------------------------------------- */

    textarea.value =
        localStorage.getItem(
            STORAGE_NOTES_KEY
        ) || "";


    /* ----------------------------------------------
       AUTO SAVE
    ---------------------------------------------- */

    let timeout;


    textarea.addEventListener(
        "input",
        () => {

            if (
                saveStatus
            ) {

                saveStatus.innerHTML =
                    "Saving...";
            }


            clearTimeout(
                timeout
            );


            timeout =
                setTimeout(
                    () => {

                        localStorage.setItem(
                            STORAGE_NOTES_KEY,
                            textarea.value
                        );


                        if (
                            saveStatus
                        ) {

                            saveStatus.innerHTML =
                                "All changes saved ✓";
                        }

                    },
                    1200
                );
        }
    );
}


/* ==========================================================
   QUICK REVISION
========================================================== */

function toggleRevision() {

    const panel =
        document.getElementById(
            "revision-panel"
        );


    if (!panel) {
        return;
    }


    panel.style.display =
        panel.style.display === "none"
            ? "block"
            : "none";
}


/* ==========================================================
   STUDY TIMER
========================================================== */

function initStudyTimer() {

    const timerDisplay =
        document.getElementById(
            "study-timer"
        );


    if (!timerDisplay) {
        return;
    }


    /* ----------------------------------------------
       RESTORE SAVED TIME
    ---------------------------------------------- */

    const savedTime =
        parseInt(
            localStorage.getItem(
                STORAGE_TIMER_KEY
            ),
            10
        );


    if (
        !isNaN(
            savedTime
        )
    ) {

        studySeconds =
            savedTime;


        renderTimerDisplay(
            timerDisplay
        );
    }


    /* ----------------------------------------------
       TIMER
    ---------------------------------------------- */

    studyTimerInterval =
        setInterval(
            () => {

                /*
                 * Only count time while the page
                 * is visible.
                 */

                if (
                    !document.hidden
                ) {

                    studySeconds++;


                    renderTimerDisplay(
                        timerDisplay
                    );


                    /*
                     * Save every 5 seconds.
                     */

                    if (
                        studySeconds % 5 ===
                        0
                    ) {

                        localStorage.setItem(
                            STORAGE_TIMER_KEY,
                            studySeconds.toString()
                        );
                    }
                }

            },
            1000
        );
}


/* ==========================================================
   RENDER TIMER
========================================================== */

function renderTimerDisplay(
    el
) {

    const minutes =
        Math.floor(
            studySeconds / 60
        )
            .toString()
            .padStart(
                2,
                "0"
            );


    const seconds =
        (
            studySeconds % 60
        )
            .toString()
            .padStart(
                2,
                "0"
            );


    el.innerHTML =
        `${minutes}:${seconds}`;
}


/* ==========================================================
   PUBLIC LESSON API
   ----------------------------------------------------------
   Makes useful lesson functions available to other
   Academy systems without exposing internal storage
   implementation details.
========================================================== */

window.StrativoLessonEngine = {

    getLessonPrefix:
        () => LESSON_PREFIX,

    getLessonNumber:
        getLessonNumber,

    getCurrentStep:
        () => currentStep,

    getUnlockedStep:
        () => unlockedStep,

    getTotalSteps:
        () => totalSteps || detectTotalSteps(),

    getQuizStep:
        getQuizStep,

    isCompleted:
        isCurrentLessonCompleted,

    complete:
        completeCurrentLesson,

    next:
        nextStep,

    previous:
        previousStep,

    showStep:
        showStep,

    resume:
        resumeLearning

};