/* ==========================================================
   STRATIVO ACADEMY
   Quiz Engine v1.0
   Shared Quiz / Progress / Achievement Bridge
========================================================== */

"use strict";


/* ==========================================================
   LESSON DETECTION
========================================================== */

function getQuizLessonPrefix() {

    const path =
        window.location.pathname;

    const pageName =
        path.substring(
            path.lastIndexOf("/") + 1
        );

    const match =
        pageName.match(/lesson\d+/i);

    if (match) {
        return match[0].toLowerCase();
    }


    /*
     * Some quiz pages may use quiz1.html,
     * quiz2.html, etc.
     */

    const quizMatch =
        pageName.match(/quiz(\d+)/i);

    if (quizMatch) {
        return `lesson${quizMatch[1]}`;
    }


    return "general_lesson";
}


const QUIZ_LESSON_PREFIX =
    getQuizLessonPrefix();


/* ==========================================================
   STORAGE KEYS
========================================================== */

const QUIZ_SCORE_KEY =
    `${QUIZ_LESSON_PREFIX}_quizScore`;

const QUIZ_TOTAL_KEY =
    `${QUIZ_LESSON_PREFIX}_quizTotal`;

const QUIZ_PERCENTAGE_KEY =
    `${QUIZ_LESSON_PREFIX}_quizPercentage`;

const QUIZ_PASSED_KEY =
    `${QUIZ_LESSON_PREFIX}_quizPassed`;

const QUIZ_COMPLETED_KEY =
    `${QUIZ_LESSON_PREFIX}_quizCompleted`;


/* ==========================================================
   SAFE NUMBER
========================================================== */

function quizNumber(value) {

    const result =
        Number(value);

    return Number.isFinite(result)
        ? result
        : 0;
}


/* ==========================================================
   SAVE QUIZ RESULT
   ----------------------------------------------------------
   This is the main bridge used by existing quiz pages.
========================================================== */

function saveQuizResult(
    score,
    total,
    passed = null
) {

    score =
        Math.max(
            0,
            quizNumber(score)
        );


    total =
        Math.max(
            0,
            quizNumber(total)
        );


    if (total <= 0) {

        console.warn(
            "Strativo Quiz Engine: Invalid quiz total."
        );

        return null;
    }


    const percentage =
        Math.min(
            100,
            Math.max(
                0,
                Math.round(
                    (score / total) * 100
                )
            )
        );


    /*
     * If the quiz page already knows whether
     * the student passed, preserve that result.
     *
     * Otherwise do not invent a pass rule.
     */

    const hasPassedValue =
        typeof passed === "boolean";


    if (hasPassedValue) {

        localStorage.setItem(
            QUIZ_PASSED_KEY,
            passed
                ? "true"
                : "false"
        );
    }


    localStorage.setItem(
        QUIZ_SCORE_KEY,
        String(score)
    );


    localStorage.setItem(
        QUIZ_TOTAL_KEY,
        String(total)
    );


    localStorage.setItem(
        QUIZ_PERCENTAGE_KEY,
        String(percentage)
    );


    localStorage.setItem(
        QUIZ_COMPLETED_KEY,
        "true"
    );


    /*
     * Compatibility with the newer naming format.
     */

    localStorage.setItem(
        `${QUIZ_LESSON_PREFIX}_quiz_score`,
        String(score)
    );


    localStorage.setItem(
        `${QUIZ_LESSON_PREFIX}_quiz_percentage`,
        String(percentage)
    );


    if (hasPassedValue) {

        localStorage.setItem(
            `${QUIZ_LESSON_PREFIX}_quiz_passed`,
            passed
                ? "true"
                : "false"
        );
    }


    /*
     * Notify the rest of the Academy.
     */

    window.dispatchEvent(
        new CustomEvent(
            "strativo:quizCompleted",
            {
                detail: {

                    lesson:
                        QUIZ_LESSON_PREFIX,

                    score,

                    total,

                    percentage,

                    passed:
                        hasPassedValue
                            ? passed
                            : null
                }
            }
        )
    );


    /*
     * Refresh Dashboard if it is available.
     */

    if (
        window.StrativoDashboard &&
        typeof
        window.StrativoDashboard.refresh ===
        "function"
    ) {

        try {

            window.StrativoDashboard.refresh();

        } catch (error) {

            console.warn(
                "Strativo Quiz Engine: Dashboard refresh failed.",
                error
            );
        }
    }


    return {

        score,

        total,

        percentage,

        passed:
            hasPassedValue
                ? passed
                : null
    };
}


/* ==========================================================
   READ QUIZ RESULT
========================================================== */

function getQuizResult() {

    const score =
        localStorage.getItem(
            QUIZ_SCORE_KEY
        );

    const total =
        localStorage.getItem(
            QUIZ_TOTAL_KEY
        );

    const percentage =
        localStorage.getItem(
            QUIZ_PERCENTAGE_KEY
        );


    if (
        score === null &&
        total === null &&
        percentage === null
    ) {

        return null;
    }


    return {

        score:
            quizNumber(score),

        total:
            quizNumber(total),

        percentage:
            quizNumber(percentage),

        passed:
            getQuizPassed(),

        completed:
            localStorage.getItem(
                QUIZ_COMPLETED_KEY
            ) === "true"
    };
}


/* ==========================================================
   GET PASS STATUS
========================================================== */

function getQuizPassed() {

    const value =
        localStorage.getItem(
            QUIZ_PASSED_KEY
        );


    if (value === null) {

        const modernValue =
            localStorage.getItem(
                `${QUIZ_LESSON_PREFIX}_quiz_passed`
            );


        if (
            modernValue === null
        ) {

            return null;
        }


        return modernValue === "true";
    }


    return value === "true";
}


/* ==========================================================
   COMPLETE LESSON
   ----------------------------------------------------------
   This function should be called by a quiz only AFTER
   its own pass validation succeeds.
========================================================== */

function completeLessonFromQuiz() {

    const completedKey =
        `${QUIZ_LESSON_PREFIX}_completed`;


    if (
        localStorage.getItem(
            completedKey
        ) === "true"
    ) {

        return false;
    }


    localStorage.setItem(
        completedKey,
        "true"
    );


    /*
     * Existing lesson engine bridge.
     */

    if (
        window.StrativoLessonEngine &&
        typeof
        window.StrativoLessonEngine.complete ===
        "function"
    ) {

        try {

            window.StrativoLessonEngine.complete();

        } catch (error) {

            console.warn(
                "Strativo Quiz Engine: Lesson completion bridge failed.",
                error
            );
        }
    }


    /*
     * Existing Achievement Engine.
     */

    if (
        window.StrativoAchievementEngine
    ) {

        try {

            if (
                typeof
                window.StrativoAchievementEngine
                    .recordLearningActivity ===
                "function"
            ) {

                window.StrativoAchievementEngine
                    .recordLearningActivity();
            }


            if (
                typeof
                window.StrativoAchievementEngine
                    .refresh ===
                "function"
            ) {

                window.StrativoAchievementEngine
                    .refresh();
            }

        } catch (error) {

            console.warn(
                "Strativo Quiz Engine: Achievement update failed.",
                error
            );
        }
    }


    /*
     * Tell the Dashboard and other systems.
     */

    window.dispatchEvent(
        new CustomEvent(
            "strativo:lessonCompleted",
            {
                detail: {

                    lesson:
                        QUIZ_LESSON_PREFIX,

                    lessonNumber:
                        getQuizLessonNumber()
                }
            }
        )
    );


    return true;
}


/* ==========================================================
   LESSON NUMBER
========================================================== */

function getQuizLessonNumber() {

    const match =
        QUIZ_LESSON_PREFIX.match(
            /lesson(\d+)/i
        );


    return match
        ? Number(match[1])
        : null;
}


/* ==========================================================
   CHECK QUIZ COMPLETION
========================================================== */

function isQuizCompleted() {

    return (
        localStorage.getItem(
            QUIZ_COMPLETED_KEY
        ) === "true"
    );
}


/* ==========================================================
   CHECK QUIZ PASS
========================================================== */

function isQuizPassed() {

    return getQuizPassed() === true;
}


/* ==========================================================
   CLEAR QUIZ RESULT
   ----------------------------------------------------------
   Useful for testing only.
========================================================== */

function resetQuizResult() {

    localStorage.removeItem(
        QUIZ_SCORE_KEY
    );

    localStorage.removeItem(
        QUIZ_TOTAL_KEY
    );

    localStorage.removeItem(
        QUIZ_PERCENTAGE_KEY
    );

    localStorage.removeItem(
        QUIZ_PASSED_KEY
    );

    localStorage.removeItem(
        QUIZ_COMPLETED_KEY
    );


    localStorage.removeItem(
        `${QUIZ_LESSON_PREFIX}_quiz_score`
    );

    localStorage.removeItem(
        `${QUIZ_LESSON_PREFIX}_quiz_percentage`
    );

    localStorage.removeItem(
        `${QUIZ_LESSON_PREFIX}_quiz_passed`
    );
}


/* ==========================================================
   PUBLIC API
========================================================== */

window.StrativoQuizEngine = {

    getLessonPrefix:
        () => QUIZ_LESSON_PREFIX,

    getLessonNumber:
        getQuizLessonNumber,

    saveResult:
        saveQuizResult,

    getResult:
        getQuizResult,

    isCompleted:
        isQuizCompleted,

    isPassed:
        isQuizPassed,

    completeLesson:
        completeLessonFromQuiz,

    reset:
        resetQuizResult

};