/* ==========================================================================
   STRATIVO ACADEMY
   Beginner Dashboard Renderer v1.0

   PURPOSE
   --------------------------------------------------------------------------
   This file ONLY controls the Beginner Dashboard UI.

   Course completion/unlocking is controlled by:
       js/progress.js

   Individual lesson steps are controlled by:
       js/lesson.js

   beginner.js reads the Progress Engine and renders the dashboard.
   ========================================================================== */

"use strict";


/* ==========================================================================
   COURSE CONFIGURATION
   ========================================================================== */

const BEGINNER_COURSE = {
    totalLessons: 10,

    lessons: [
        {
            id: 1,
            title: "What is Forex?",
            time: 15,
            difficulty: "Beginner"
        },
        {
            id: 2,
            title: "Currency Pairs & Exchange Rates",
            time: 20,
            difficulty: "Beginner"
        },
        {
            id: 3,
            title: "Market Sessions & Trading Hours",
            time: 25,
            difficulty: "Beginner"
        },
        {
            id: 4,
            title: "Who Trades Forex?",
            time: 15,
            difficulty: "Beginner"
        },
        {
            id: 5,
            title: "What is a Pip?",
            time: 30,
            difficulty: "Beginner"
        },
        {
            id: 6,
            title: "Lot Sizes & Position Sizing",
            time: 35,
            difficulty: "Beginner"
        },
        {
            id: 7,
            title: "Leverage & Margin Explained",
            time: 40,
            difficulty: "Beginner"
        },
        {
            id: 8,
            title: "Bid, Ask & The Spread",
            time: 20,
            difficulty: "Beginner"
        },
        {
            id: 9,
            title: "Types of Orders",
            time: 25,
            difficulty: "Beginner"
        },
        {
            id: 10,
            title: "Introduction to MetaTrader",
            time: 30,
            difficulty: "Beginner"
        }
    ]
};


/* ==========================================================================
   DASHBOARD STORAGE
   --------------------------------------------------------------------------
   IMPORTANT:
   This does NOT store lesson completion.

   Lesson completion remains inside progress.js.

   This storage is only for dashboard-specific information such as:
       - student name
       - streak
       - study activity
   ========================================================================== */

const BeginnerDashboardStorage = {

    key: "strativo_beginner_dashboard",

    get() {

        try {

            const saved =
                localStorage.getItem(this.key);

            if (!saved) {
                return this.defaultState();
            }

            const parsed =
                JSON.parse(saved);

            return {
                ...this.defaultState(),
                ...parsed,
                streak: {
                    ...this.defaultState().streak,
                    ...(parsed.streak || {})
                }
            };

        } catch (error) {

            console.warn(
                "Strativo Academy: Dashboard storage could not be loaded.",
                error
            );

            return this.defaultState();
        }
    },


    set(data) {

        try {

            localStorage.setItem(
                this.key,
                JSON.stringify(data)
            );

        } catch (error) {

            console.warn(
                "Strativo Academy: Dashboard storage could not be saved.",
                error
            );
        }
    },


    defaultState() {

        return {

            studentName: "Eric",

            streak: {
                current: 0,
                longest: 0,
                lastStudyDate: null
            },

            recentActivity: [
                {
                    title: "Welcome to Strativo!",
                    time: "Just now",
                    type: "lesson"
                }
            ]
        };
    }
};


/* ==========================================================================
   DASHBOARD STATE
   ========================================================================== */

const BeginnerDashboard = {

    state: BeginnerDashboardStorage.get(),


    save() {

        BeginnerDashboardStorage.set(
            this.state
        );
    },


    /* ----------------------------------------------------------------------
       GET LESSON DATA
       ---------------------------------------------------------------------- */

    getLesson(lessonNumber) {

        return (
            BEGINNER_COURSE.lessons.find(
                lesson =>
                    lesson.id === Number(lessonNumber)
            )
            ||
            BEGINNER_COURSE.lessons[0]
        );
    },


    /* ----------------------------------------------------------------------
       GET PROGRESS ENGINE
       ---------------------------------------------------------------------- */

    getProgressEngine() {

        if (
            window.StrativoProgressEngine &&
            typeof window.StrativoProgressEngine
                .getCourseProgressState === "function"
        ) {

            return window.StrativoProgressEngine;
        }

        return null;
    },


    /* ----------------------------------------------------------------------
       GET CURRENT COURSE STATE
       ---------------------------------------------------------------------- */

    getCourseState() {

        const engine =
            this.getProgressEngine();


        if (!engine) {

            console.warn(
                "Strativo Academy: StrativoProgressEngine is not available."
            );

            return {
                totalLessons:
                    BEGINNER_COURSE.totalLessons,

                completedLessons: [],

                completedCount: 0,

                unlockedLessons: [1],

                unlockedCount: 1,

                nextLesson: 1,

                courseCompleted: false,

                percentage: 0
            };
        }


        try {

            return engine.getCourseProgressState();

        } catch (error) {

            console.error(
                "Strativo Academy: Could not read Progress Engine.",
                error
            );

            return {
                totalLessons:
                    BEGINNER_COURSE.totalLessons,

                completedLessons: [],

                completedCount: 0,

                unlockedLessons: [1],

                unlockedCount: 1,

                nextLesson: 1,

                courseCompleted: false,

                percentage: 0
            };
        }
    },


    /* ----------------------------------------------------------------------
       CURRENT / NEXT LESSON
       ---------------------------------------------------------------------- */

    getCurrentLessonNumber() {

        const courseState =
            this.getCourseState();


        /*
         * The Progress Engine gives us the first incomplete lesson.
         * That becomes the dashboard's Continue Learning lesson.
         */

        if (
            courseState.nextLesson !== null &&
            courseState.nextLesson !== undefined
        ) {

            return Number(
                courseState.nextLesson
            );
        }


        /*
         * If the whole course is completed,
         * keep the final lesson as the displayed lesson.
         */

        return BEGINNER_COURSE.totalLessons;
    },


    /* ==========================================================================
       STREAK SYSTEM
       --------------------------------------------------------------------------
       This is dashboard activity data.
       It does NOT control lesson completion.
       ========================================================================== */

    updateStreak() {

        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        const lastDate =
            this.state.streak.lastStudyDate;


        /*
         * Already counted today.
         */

        if (lastDate === today) {
            return;
        }


        /*
         * First study day.
         */

        if (!lastDate) {

            this.state.streak.current = 1;

        } else {

            const last =
                new Date(lastDate);

            const current =
                new Date(today);


            const difference =
                Math.round(
                    (
                        current.getTime() -
                        last.getTime()
                    ) /
                    (1000 * 60 * 60 * 24)
                );


            if (difference === 1) {

                this.state.streak.current += 1;

            } else if (difference > 1) {

                this.state.streak.current = 1;
            }
        }


        if (
            this.state.streak.current >
            this.state.streak.longest
        ) {

            this.state.streak.longest =
                this.state.streak.current;
        }


        this.state.streak.lastStudyDate =
            today;


        this.save();
    },


    /* ==========================================================================
       ACTIVITY
       ========================================================================== */

    addActivity(
        title,
        type = "lesson"
    ) {

        if (
            !Array.isArray(
                this.state.recentActivity
            )
        ) {

            this.state.recentActivity = [];
        }


        this.state.recentActivity.unshift({

            title: title,

            time: "Just now",

            type: type
        });


        /*
         * Keep dashboard activity small.
         */

        this.state.recentActivity =
            this.state.recentActivity.slice(
                0,
                5
            );


        this.save();
    },


    /* ==========================================================================
       XP
       --------------------------------------------------------------------------
       XP is calculated from completed lessons for now.

       20 XP per completed lesson.

       Example:
       0 lessons  = 0 XP
       1 lesson   = 20 XP
       5 lessons  = 100 XP
       10 lessons = 200 XP

       This can later be replaced by a dedicated achievement/XP engine.
       ========================================================================== */

    getXP() {

        const courseState =
            this.getCourseState();


        return (
            courseState.completedCount * 20
        );
    },


    /* ==========================================================================
       RENDER HELPERS
       ========================================================================== */

    setText(
        selector,
        value
    ) {

        document
            .querySelectorAll(selector)
            .forEach(element => {

                element.textContent =
                    value;
            });
    },


    setWidth(
        selector,
        percentage
    ) {

        const safePercentage =
            Math.min(
                100,
                Math.max(
                    0,
                    Number(percentage) || 0
                )
            );


        document
            .querySelectorAll(selector)
            .forEach(element => {

                element.style.width =
                    `${safePercentage}%`;
            });
    },


    /* ==========================================================================
       RENDER GLOBAL DASHBOARD DATA
       ========================================================================== */

    renderGlobalStats(
        courseState
    ) {

        const xp =
            this.getXP();


        const streak =
            this.state.streak.current;


        /*
         * XP
         */

        this.setText(
            ".js-val-xp",
            `${xp.toLocaleString()} XP`
        );


        /*
         * Streak
         */

        this.setText(
            ".js-val-streak",
            `${streak} Days`
        );


        /*
         * Course completion count
         */

        this.setText(
            ".js-course-completed-count",
            `${courseState.completedCount} / ${BEGINNER_COURSE.totalLessons}`
        );


        /*
         * Course percentage
         */

        this.setText(
            ".js-course-progress-percent",
            `${courseState.percentage}%`
        );


        /*
         * Generic progress bars
         */

        this.setWidth(
            ".js-course-progress-bar",
            courseState.percentage
        );


        this.setWidth(
            ".js-progress-bar",
            courseState.percentage
        );


        this.setWidth(
            ".js-dashboard-progress-bar",
            courseState.percentage
        );
    },


    /* ==========================================================================
       RENDER CONTINUE LEARNING
       ========================================================================== */

    renderContinueLearning(
        courseState
    ) {

        const lessonNumber =
            this.getCurrentLessonNumber();


        const lesson =
            this.getLesson(
                lessonNumber
            );


        /*
         * Lesson title
         */

        this.setText(
            ".js-cl-lesson-title",
            lesson.title
        );


        /*
         * Module number
         */

        this.setText(
            ".js-cl-module",
            "Module 1"
        );


        /*
         * Lesson number
         */

        this.setText(
            ".js-cl-progress-text",
            `Lesson ${lessonNumber} of ${BEGINNER_COURSE.totalLessons}`
        );


        /*
         * Estimated lesson time
         */

        this.setText(
            ".js-cl-time-left",
            `${lesson.time} mins`
        );


        /*
         * Continue progress
         */

        this.setWidth(
            ".js-cl-progress-bar",
            courseState.percentage
        );


        /*
         * Other dashboard progress bars
         */

        this.setWidth(
            ".continue-progress-fill",
            courseState.percentage
        );


        this.setWidth(
            ".dash-progress-fill",
            courseState.percentage
        );
    },


    /* ==========================================================================
       RENDER DASHBOARD
       ========================================================================== */

    updateAll() {

        const courseState =
            this.getCourseState();


        this.renderGlobalStats(
            courseState
        );


        this.renderContinueLearning(
            courseState
        );


        /*
         * Student name
         */

        this.setText(
            ".js-student-name",
            this.state.studentName
        );


        /*
         * Alternative selectors that may exist
         * in the dashboard.
         */

        this.setText(
            ".dashboard-student-name",
            this.state.studentName
        );


        this.setText(
            ".student-name",
            this.state.studentName
        );


        /*
         * Course completion status.
         */

        this.setText(
            ".js-course-status",
            courseState.courseCompleted
                ? "Completed"
                : "In Progress"
        );
    },


    /* ==========================================================================
       RESUME LEARNING
       ========================================================================== */

    resumeLearning() {

        const lessonNumber =
            this.getCurrentLessonNumber();


        /*
         * Ask the Progress Engine for
         * the correct lesson path.
         */

        const engine =
            this.getProgressEngine();


        let lessonPath;


        if (
            engine &&
            typeof engine.getLessonPath === "function"
        ) {

            lessonPath =
                engine.getLessonPath(
                    lessonNumber
                );

        } else {

            lessonPath =
                `lessons/module1/lesson${lessonNumber}.html`;
        }


        if (!lessonPath) {

            console.warn(
                "Strativo Academy: Lesson path could not be determined."
            );

            return;
        }


        window.location.href =
            lessonPath;
    },


    /* ==========================================================================
       HANDLE LESSON COMPLETION
       ========================================================================== */

    handleLessonCompleted(
        event
    ) {

        const detail =
            event && event.detail
                ? event.detail
                : null;


        let lessonNumber =
            null;


        if (detail) {

            if (
                detail.lessonNumber !== undefined &&
                detail.lessonNumber !== null
            ) {

                lessonNumber =
                    Number(
                        detail.lessonNumber
                    );
            }
        }


        if (lessonNumber) {

            const lesson =
                this.getLesson(
                    lessonNumber
                );


            this.addActivity(
                `Completed: ${lesson.title}`,
                "lesson"
            );
        }


        /*
         * Update dashboard streak.
         */

        this.updateStreak();


        /*
         * Re-render using Progress Engine.
         */

        this.updateAll();
    },


    /* ==========================================================================
       INITIALIZE
       ========================================================================== */

    init() {

        console.log(
            "Strativo Academy: Beginner Dashboard initialized."
        );


        /*
         * Update streak only when the student
         * actually has course activity.
         */

        const courseState =
            this.getCourseState();


        if (
            courseState.completedCount > 0 ||
            courseState.unlockedCount > 1
        ) {

            this.updateStreak();
        }


        /*
         * Initial dashboard render.
         */

        this.updateAll();


        /*
         * Listen for lesson completion from lesson.js
         * / progress.js.
         */

        window.addEventListener(
            "strativo:lessonCompleted",
            event => {

                this.handleLessonCompleted(
                    event
                );
            }
        );


        /*
         * Optional global resume buttons.
         *
         * This allows the dashboard to work whether
         * the button uses an ID or a class.
         */

        document
            .querySelectorAll(
                "#continue-learning, " +
                ".continue-learning-btn, " +
                ".js-resume-learning"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        this.resumeLearning();
                    }
                );
            });


        /*
         * Developer reset.
         *
         * Double-clicking the Strativo logo
         * clears dashboard-only data.
         *
         * It does NOT delete lesson progress.
         */

        const logo =
            document.querySelector(
                ".brand-logo-img"
            );


        if (logo) {

            logo.addEventListener(
                "dblclick",
                () => {

                    const confirmed =
                        window.confirm(
                            "Developer Reset: Clear dashboard data?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    localStorage.removeItem(
                        BeginnerDashboardStorage.key
                    );


                    window.location.reload();
                }
            );
        }
    }
};


/* ==========================================================================
   PUBLIC DASHBOARD API
   --------------------------------------------------------------------------
   Other Strativo systems can refresh the dashboard without knowing
   the internal implementation.
   ========================================================================== */

window.StrativoBeginnerDashboard = {

    refresh: () => {

        BeginnerDashboard.updateAll();
    },


    getCourseState: () => {

        return BeginnerDashboard.getCourseState();
    },


    getCurrentLesson: () => {

        return BeginnerDashboard.getCurrentLessonNumber();
    },


    resumeLearning: () => {

        BeginnerDashboard.resumeLearning();
    }
};


/* ==========================================================================
   DOM READY
   ========================================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        BeginnerDashboard.init();
    }
);