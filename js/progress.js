/* ==========================================
   STRATIVO ACADEMY
   Progress Engine v3.0
   Course Progress & Lesson Unlock System
========================================== */

"use strict";


/* ==========================================================
   CURRENT LESSON DETECTION
========================================================== */

function getModulePrefix() {

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
}


/* ==========================================================
   CURRENT LESSON STORAGE
========================================================== */

const CURRENT_LESSON_PREFIX =
    getModulePrefix();


const STEP_KEY =
    `${CURRENT_LESSON_PREFIX}_currentStep`;


const COMPLETED_KEY =
    `${CURRENT_LESSON_PREFIX}_completed`;


const UNLOCKED_KEY =
    `${CURRENT_LESSON_PREFIX}_unlockedStep`;


/* ==========================================================
   COURSE CONFIGURATION
========================================================== */

const STRATIVO_TOTAL_LESSONS = 10;


/* ==========================================================
   GET LESSON COMPLETION
========================================================== */

function isLessonCompleted(
    lessonNumber = null
) {

    /*
     * If no lesson number is supplied,
     * check the current lesson.
     */

    if (
        lessonNumber === null
    ) {

        return (
            localStorage.getItem(
                COMPLETED_KEY
            ) === "true"
        );
    }


    return (
        localStorage.getItem(
            `lesson${lessonNumber}_completed`
        ) === "true"
    );
}


/* ==========================================================
   GET COMPLETED LESSONS
========================================================== */

function getCompletedLessons() {

    const completed = [];


    for (
        let lesson = 1;
        lesson <= STRATIVO_TOTAL_LESSONS;
        lesson++
    ) {

        if (
            isLessonCompleted(
                lesson
            )
        ) {

            completed.push(
                lesson
            );
        }
    }


    return completed;
}


/* ==========================================================
   GET COMPLETED LESSON COUNT
========================================================== */

function getCompletedLessonCount() {

    return getCompletedLessons().length;
}


/* ==========================================================
   GET NEXT INCOMPLETE LESSON
========================================================== */

function getNextIncompleteLesson() {

    for (
        let lesson = 1;
        lesson <= STRATIVO_TOTAL_LESSONS;
        lesson++
    ) {

        if (
            !isLessonCompleted(
                lesson
            )
        ) {

            return lesson;
        }
    }


    return null;
}


/* ==========================================================
   CHECK COURSE COMPLETION
========================================================== */

function isCourseCompleted() {

    return (
        getCompletedLessonCount() >=
        STRATIVO_TOTAL_LESSONS
    );
}


/* ==========================================================
   COURSE PROGRESS PERCENTAGE
========================================================== */

function getCourseProgressPercentage() {

    return Math.round(
        (
            getCompletedLessonCount() /
            STRATIVO_TOTAL_LESSONS
        ) * 100
    );
}


/* ==========================================================
   LESSON UNLOCK SYSTEM
   ----------------------------------------------------------
   Lesson 1 is always available.

   Every following lesson requires the previous
   lesson to be completed.
========================================================== */

function isLessonUnlocked(
    lessonNumber
) {

    lessonNumber =
        Number(lessonNumber);


    if (
        !Number.isInteger(
            lessonNumber
        )
    ) {

        return false;
    }


    if (
        lessonNumber < 1 ||
        lessonNumber >
        STRATIVO_TOTAL_LESSONS
    ) {

        return false;
    }


    /*
     * Lesson 1 is always unlocked.
     */

    if (
        lessonNumber === 1
    ) {

        return true;
    }


    /*
     * Every later lesson requires
     * the previous lesson.
     */

    return isLessonCompleted(
        lessonNumber - 1
    );
}


/* ==========================================================
   GET ALL UNLOCKED LESSONS
========================================================== */

function getUnlockedLessons() {

    const unlocked = [];


    for (
        let lesson = 1;
        lesson <= STRATIVO_TOTAL_LESSONS;
        lesson++
    ) {

        if (
            isLessonUnlocked(
                lesson
            )
        ) {

            unlocked.push(
                lesson
            );

        } else {

            /*
             * Because lessons are sequential,
             * stop at the first locked lesson.
             */

            break;
        }
    }


    return unlocked;
}


/* ==========================================================
   GET NEXT UNLOCKED LESSON
========================================================== */

function getNextUnlockedLesson() {

    const next =
        getNextIncompleteLesson();


    if (
        next === null
    ) {

        return null;
    }


    return isLessonUnlocked(
        next
    )
        ? next
        : null;
}


/* ==========================================================
   GET LESSON PATH
========================================================== */

function getLessonPath(
    lessonNumber
) {

    lessonNumber =
        Number(lessonNumber);


    if (
        !Number.isInteger(
            lessonNumber
        ) ||
        lessonNumber < 1 ||
        lessonNumber >
        STRATIVO_TOTAL_LESSONS
    ) {

        return null;
    }


    return (
        `lessons/module1/lesson${lessonNumber}.html`
    );
}


/* ==========================================================
   MANUALLY SAVE CURRENT LESSON STEP
========================================================== */

function saveProgress(
    step
) {

    const numericStep =
        Number.parseInt(
            step,
            10
        );


    if (
        !Number.isFinite(
            numericStep
        )
    ) {

        return;
    }


    localStorage.setItem(
        STEP_KEY,
        numericStep.toString()
    );
}


/* ==========================================================
   LOAD CURRENT LESSON PROGRESS
========================================================== */

function loadProgress() {

    const savedStep =
        localStorage.getItem(
            STEP_KEY
        );


    if (
        savedStep &&
        typeof showStep ===
        "function"
    ) {

        const parsedStep =
            Number.parseInt(
                savedStep,
                10
            );


        if (
            Number.isFinite(
                parsedStep
            )
        ) {

            currentStep =
                parsedStep;


            showStep(
                currentStep
            );

            return;
        }
    }


    if (
        typeof showStep ===
        "function"
    ) {

        showStep(1);
    }
}


/* ==========================================================
   COMPLETE CURRENT LESSON
========================================================== */

function completeLesson() {

    /*
     * Mark the current lesson completed.
     */

    localStorage.setItem(
        COMPLETED_KEY,
        "true"
    );


    /*
     * Keep the current lesson state
     * synchronized.
     */

    if (
        typeof currentStep !==
        "undefined"
    ) {

        localStorage.setItem(
            STEP_KEY,
            String(
                currentStep
            )
        );
    }


    if (
        typeof unlockedStep !==
        "undefined"
    ) {

        localStorage.setItem(
            UNLOCKED_KEY,
            String(
                unlockedStep
            )
        );
    }


    /*
     * Notify the rest of Strativo Academy.
     */

    window.dispatchEvent(
        new CustomEvent(
            "strativo:lessonCompleted",
            {
                detail: {

                    lesson:
                        CURRENT_LESSON_PREFIX,

                    lessonNumber:
                        getCurrentLessonNumber(),

                    completedLessons:
                        getCompletedLessons(),

                    completedCount:
                        getCompletedLessonCount(),

                    progress:
                        getCourseProgressPercentage()
                }
            }
        )
    );
}


/* ==========================================================
   GET CURRENT LESSON NUMBER
========================================================== */

function getCurrentLessonNumber() {

    const match =
        CURRENT_LESSON_PREFIX.match(
            /lesson(\d+)/i
        );


    return match
        ? Number(match[1])
        : null;
}


/* ==========================================================
   RESET CURRENT LESSON PROGRESS
========================================================== */

function resetLessonProgress() {

    localStorage.removeItem(
        STEP_KEY
    );


    localStorage.removeItem(
        COMPLETED_KEY
    );


    localStorage.removeItem(
        UNLOCKED_KEY
    );


    /*
     * Do not delete quiz data here.
     *
     * Quiz data belongs to the quiz engine.
     */


    window.location.reload();
}


/* ==========================================================
   RESET ENTIRE COURSE
   ----------------------------------------------------------
   TESTING ONLY.
========================================================== */

function resetEntireCourseProgress() {

    for (
        let lesson = 1;
        lesson <= STRATIVO_TOTAL_LESSONS;
        lesson++
    ) {

        localStorage.removeItem(
            `lesson${lesson}_currentStep`
        );

        localStorage.removeItem(
            `lesson${lesson}_completed`
        );

        localStorage.removeItem(
            `lesson${lesson}_unlockedStep`
        );
    }


    window.location.reload();
}


/* ==========================================================
   COURSE PROGRESS STATE
========================================================== */

function getCourseProgressState() {

    const completedLessons =
        getCompletedLessons();


    const unlockedLessons =
        getUnlockedLessons();


    const nextLesson =
        getNextIncompleteLesson();


    return {

        totalLessons:
            STRATIVO_TOTAL_LESSONS,

        completedLessons,

        completedCount:
            completedLessons.length,

        unlockedLessons,

        unlockedCount:
            unlockedLessons.length,

        nextLesson,

        courseCompleted:
            isCourseCompleted(),

        percentage:
            getCourseProgressPercentage()
    };
}


/* ==========================================================
   PUBLIC PROGRESS API
========================================================== */

window.StrativoProgressEngine = {

    getCurrentLesson:
        () =>
            CURRENT_LESSON_PREFIX,

    getCurrentLessonNumber:
        getCurrentLessonNumber,

    saveProgress:
        saveProgress,

    loadProgress:
        loadProgress,

    completeLesson:
        completeLesson,

    isLessonCompleted:
        isLessonCompleted,

    resetLessonProgress:
        resetLessonProgress,

    resetEntireCourseProgress:
        resetEntireCourseProgress,

    getCompletedLessons:
        getCompletedLessons,

    getCompletedLessonCount:
        getCompletedLessonCount,

    getNextIncompleteLesson:
        getNextIncompleteLesson,

    isCourseCompleted:
        isCourseCompleted,

    getCourseProgressPercentage:
        getCourseProgressPercentage,

    isLessonUnlocked:
        isLessonUnlocked,

    getUnlockedLessons:
        getUnlockedLessons,

    getNextUnlockedLesson:
        getNextUnlockedLesson,

    getLessonPath:
        getLessonPath,

    getCourseProgressState:
        getCourseProgressState

};