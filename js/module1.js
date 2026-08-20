/**
 * ==========================================
 * Strativo Academy Learning Engine (Phase 2)
 * Modular, Scalable, Production-Ready JS
 * ==========================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------
    // 1. DATA STORE (Single Source of Truth)
    // --------------------------------------------------
    const LESSONS_DATABASE = [
        {
            id: 1,
            module: 1,
            title: 'Introduction to Forex',
            description: 'Understand what the foreign exchange market is, how it works, and why currencies are traded.',
            image: '🌍',
            difficulty: 'Beginner',
            category: 'Foundation',
            readingTime: 15,
            xpReward: 50,
            quizQuestions: 10,
            htmlFile: '../lessons/module1/lesson1.html'
        },

        {
            id: 2,
            module: 1,
            title: 'Currency Pairs & Exchange Rates',
            description: 'Learn how currency pairs work, how exchange rates are quoted, and the difference between base and quote currencies.',
            image: '💱',
            difficulty: 'Beginner',
            category: 'Foundation',
            readingTime: 20,
            xpReward: 50,
            quizQuestions: 10,
            htmlFile: '../lessons/module1/lesson2.html'
        },

        {
            id: 3,
            module: 1,
            title: 'Market Sessions & Trading Hours',
            description: 'Understand the major Forex trading sessions, their characteristics, and when the market is most active.',
            image: '🕐',
            difficulty: 'Beginner',
            category: 'Timing',
            readingTime: 20,
            xpReward: 50,
            quizQuestions: 10,
            htmlFile: '../lessons/module1/lesson3.html'
        },

        {
            id: 4,
            module: 1,
            title: 'Who Trades Forex?',
            description: 'Discover the major participants in the Forex market, including central banks, institutions, corporations, and retail traders.',
            image: '🏦',
            difficulty: 'Beginner',
            category: 'Market Structure',
            readingTime: 15,
            xpReward: 50,
            quizQuestions: 10,
            htmlFile: '../lessons/module1/lesson4.html'
        },

        {
            id: 5,
            module: 1,
            title: 'What Is a Pip?',
            description: 'Learn what a pip is, how pips measure price movement, and why they are important in Forex trading.',
            image: '📏',
            difficulty: 'Beginner',
            category: 'Math',
            readingTime: 20,
            xpReward: 50,
            quizQuestions: 15,
            htmlFile: '../lessons/module1/lesson5.html'
        },

        {
            id: 6,
            module: 1,
            title: 'Lot Sizes & Position Sizing',
            description: 'Understand standard, mini, micro, and nano lots and learn the basics of calculating position size.',
            image: '📊',
            difficulty: 'Intermediate',
            category: 'Position Sizing',
            readingTime: 25,
            xpReward: 50,
            quizQuestions: 15,
            htmlFile: '../lessons/module1/lesson6.html'
        },

        {
            id: 7,
            module: 1,
            title: 'Leverage & Margin Explained',
            description: 'Understand leverage, margin requirements, margin levels, and the risks of controlling larger positions.',
            image: '⚖️',
            difficulty: 'Intermediate',
            category: 'Risk & Money',
            readingTime: 25,
            xpReward: 50,
            quizQuestions: 15,
            htmlFile: '../lessons/module1/lesson7.html'
        },

        {
            id: 8,
            module: 1,
            title: 'Bid, Ask & The Spread',
            description: 'Learn how bid and ask prices work, what the spread represents, and how trading costs affect your entries.',
            image: '↔️',
            difficulty: 'Intermediate',
            category: 'Market Mechanics',
            readingTime: 20,
            xpReward: 50,
            quizQuestions: 10,
            htmlFile: '../lessons/module1/lesson8.html'
        },

        {
            id: 9,
            module: 1,
            title: 'Types of Forex Orders',
            description: 'Learn the difference between market orders, limit orders, stop orders, and other basic order types.',
            image: '📝',
            difficulty: 'Intermediate',
            category: 'Order Types',
            readingTime: 25,
            xpReward: 50,
            quizQuestions: 15,
            htmlFile: '../lessons/module1/lesson9.html'
        },

        {
            id: 10,
            module: 1,
            title: 'Introduction to MetaTrader',
            description: 'Get familiar with the basic MetaTrader interface, charts, symbols, orders, and essential platform functions.',
            image: '💻',
            difficulty: 'Beginner',
            category: 'Platform',
            readingTime: 30,
            xpReward: 50,
            quizQuestions: 15,
            htmlFile: '../lessons/module1/lesson10.html'
        }
    ];


    const ACHIEVEMENTS_DATABASE = [
        {
            id: 'first_lesson',
            title: 'First Steps',
            condition: (p) => p.completedLessons.length >= 1
        },

        {
            id: 'xp_100',
            title: 'Century Mark',
            condition: (p) => p.totalXP >= 100
        },

        {
            id: 'streak_7',
            title: 'Consistency',
            condition: (p) => p.streak >= 7
        },

        {
            id: 'mod1_complete',
            title: 'Module 1 Master',
            condition: (p) => p.completedModules.includes(1)
        }
    ];


    const DEFAULT_PROFILE = {
        studentName: "Alex Trader",
        avatar: null,
        currentLevel: 1,
        totalXP: 0,
        currentXP: 0,
        currentModule: 1,
        currentLesson: 1,
        completedLessons: [],
        unlockedLessons: [1],
        completedModules: [],
        badges: ["🥉 Forex Rookie"],
        streak: 0,
        studyMinutes: 0,
        quizScores: {},
        bookmarks: [],
        notes: {},
        lastVisitedLesson: null,
        lastVisitDate: null,
        dailyGoal: {
            type: 'lessons',
            target: 2,
            current: 0
        },
        achievements: [],
        studyDays: []
    };


    // --------------------------------------------------
    // 2. STORAGE MANAGER
    // --------------------------------------------------

    class StorageManager {

        static KEY =
            'strativo_student_profile';


        static loadProfile() {

            try {

                const stored =
                    localStorage.getItem(
                        this.KEY
                    );


                if (stored) {

                    const parsed =
                        JSON.parse(
                            stored
                        );


                    return {
                        ...DEFAULT_PROFILE,
                        ...parsed
                    };

                }

            } catch (e) {

                console.error(
                    "Failed to load profile:",
                    e
                );

            }


            return {
                ...DEFAULT_PROFILE
            };

        }


        static saveProfile(profile) {

            localStorage.setItem(
                this.KEY,
                JSON.stringify(profile)
            );

        }

    }


    // --------------------------------------------------
    // 3. STUDENT MANAGER
    // --------------------------------------------------

    class StudentManager {

        static profile =
            StorageManager.loadProfile();


        static save() {

            StorageManager.saveProfile(
                this.profile
            );

        }


        static get() {

            return this.profile;

        }


        static updateProfileDetails(
            newName,
            newAvatarUrl
        ) {

            if (newName) {

                this.profile.studentName =
                    newName;

            }


            if (
                newAvatarUrl !==
                undefined
            ) {

                this.profile.avatar =
                    newAvatarUrl;

            }


            this.save();


            StrativoApp.initAvatar();


            UIManager.renderAll();

        }


        static checkDailyReset() {

            const todayStr =
                new Date()
                    .toISOString()
                    .split('T')[0];


            if (
                !this.profile.studyDays
            ) {

                this.profile.studyDays =
                    [];

            }


            if (
                !this.profile.lastVisitDate
            ) {

                this.profile.lastVisitDate =
                    todayStr;

                this.profile.streak =
                    1;

                this.profile.studyDays.push(
                    todayStr
                );

                this.save();

                return;

            }


            if (
                this.profile.lastVisitDate !==
                todayStr
            ) {

                const lastDate =
                    new Date(
                        this.profile.lastVisitDate
                    );


                const currentDate =
                    new Date(
                        todayStr
                    );


                lastDate.setHours(
                    0,
                    0,
                    0,
                    0
                );


                currentDate.setHours(
                    0,
                    0,
                    0,
                    0
                );


                const diffDays =
                    Math.round(
                        (
                            currentDate -
                            lastDate
                        ) /
                        (
                            1000 *
                            60 *
                            60 *
                            24
                        )
                    );


                if (
                    diffDays === 1
                ) {

                    this.profile.streak +=
                        1;

                }
                else if (
                    diffDays > 1
                ) {

                    this.profile.streak =
                        1;

                }


                if (
                    !this.profile.studyDays.includes(
                        todayStr
                    )
                ) {

                    this.profile.studyDays.push(
                        todayStr
                    );

                }


                this.profile.dailyGoal.current =
                    0;


                this.profile.lastVisitDate =
                    todayStr;


                this.save();

            }

        }

    }


    // --------------------------------------------------
    // 4. XP MANAGER
    // --------------------------------------------------

    class XPManager {

        static thresholds = [
            0,
            100,
            250,
            500,
            1000,
            2000,
            3500,
            5000,
            7500,
            10000
        ];


        static calculateLevelInfo(
            totalXP
        ) {

            let level =
                1;


            for (
                let i = 0;
                i < this.thresholds.length;
                i++
            ) {

                if (
                    totalXP >=
                    this.thresholds[i]
                ) {

                    level =
                        i + 1;

                }
                else {

                    break;

                }

            }


            const currentLevelBaseXP =
                this.thresholds[
                    level - 1
                ];


            const nextLevelBaseXP =
                this.thresholds[level] ||
                this.thresholds[
                    this.thresholds.length - 1
                ];


            const xpIntoLevel =
                totalXP -
                currentLevelBaseXP;


            const xpRequiredForNext =
                nextLevelBaseXP -
                currentLevelBaseXP;


            const remainingXP =
                nextLevelBaseXP -
                totalXP;


            let progressPct =
                100;


            if (
                xpRequiredForNext > 0
            ) {

                progressPct =
                    Math.round(
                        (
                            xpIntoLevel /
                            xpRequiredForNext
                        ) * 100
                    );

            }


            return {
                level,
                remainingXP,
                progressPct,
                nextLevelBaseXP
            };

        }


        static getBadge(level) {

            if (level >= 10) {

                return "👑 Strativo Legend";

            }


            if (level >= 7) {

                return "💎 Elite Trader";

            }


            if (level >= 4) {

                return "🥇 Chart Master";

            }


            if (level >= 2) {

                return "🥈 Market Explorer";

            }


            return "🥉 Forex Rookie";

        }


        static addXP(amount) {

            const profile =
                StudentManager.get();


            profile.totalXP +=
                amount;


            const lvlInfo =
                this.calculateLevelInfo(
                    profile.totalXP
                );


            profile.currentLevel =
                lvlInfo.level;


            profile.badge =
                this.getBadge(
                    lvlInfo.level
                );


            StudentManager.save();

        }

    }


    // --------------------------------------------------
    // 5. LESSON MANAGER
    // --------------------------------------------------

    class LessonManager {

        static get lessons() {

            return LESSONS_DATABASE;

        }


        static getEnrichedLessons() {

            const profile =
                StudentManager.get();


            const completedIds =
                profile.completedLessons ||
                [];


            const lastVisitedId =
                profile.lastVisitedLesson ||
                1;


            let nextIncompleteId =
                1;


            for (
                let i = 0;
                i < this.lessons.length;
                i++
            ) {

                if (
                    !completedIds.includes(
                        this.lessons[i].id
                    )
                ) {

                    nextIncompleteId =
                        this.lessons[i].id;

                    break;

                }

            }


            return this.lessons.map(
                lesson => {

                    const isCompleted =
                        completedIds.includes(
                            lesson.id
                        );


                    const isActive =
                        lesson.id ===
                            nextIncompleteId ||
                        (
                            lesson.id ===
                                lastVisitedId &&
                            !isCompleted
                        );


                    const isLocked =
                        !isCompleted &&
                        lesson.id >
                            nextIncompleteId;


                    let status =
                        'available';


                    if (
                        isCompleted
                    ) {

                        status =
                            'completed';

                    }
                    else if (
                        isLocked
                    ) {

                        status =
                            'locked';

                    }
                    else if (
                        isActive
                    ) {

                        status =
                            'active';

                    }


                    let progress =
                        0;


                    if (
                        isCompleted
                    ) {

                        progress =
                            100;

                    }
                    else if (
                        status ===
                            'active' &&
                        profile.lastVisitedLesson ===
                            lesson.id
                    ) {

                        progress =
                            45;

                    }


                    return {
                        ...lesson,
                        status,
                        progress
                    };

                }
            );

        }


        static getContinueLesson() {

            const enriched =
                this.getEnrichedLessons();


            return (
                enriched.find(
                    l =>
                        l.status ===
                        'active'
                ) ||

                enriched.find(
                    l =>
                        l.status ===
                        'available'
                ) ||

                null
            );

        }

    }


    // --------------------------------------------------
    // 6. ACHIEVEMENT MANAGER
    // --------------------------------------------------

    class AchievementManager {

        static toastTimer =
            null;


        static checkAchievements() {

            const profile =
                StudentManager.get();


            ACHIEVEMENTS_DATABASE.forEach(
                ach => {

                    if (
                        !profile.achievements.includes(
                            ach.id
                        )
                    ) {

                        if (
                            ach.condition(
                                profile
                            )
                        ) {

                            profile.achievements.push(
                                ach.id
                            );


                            this.showToast(
                                '🏆 Achievement Unlocked',
                                ach.title
                            );

                        }

                    }

                }
            );


            StudentManager.save();

        }


        static showToast(
            title,
            message
        ) {

            const popup =
                document.getElementById(
                    'achievement-popup'
                );


            if (!popup) {
                return;
            }


            popup.setAttribute(
                'role',
                'status'
            );


            popup.setAttribute(
                'aria-live',
                'polite'
            );


            const titleEl =
                popup.querySelector(
                    'h4'
                );


            const messageEl =
                popup.querySelector(
                    'p'
                );


            if (titleEl) {

                titleEl.textContent =
                    title;

            }


            if (messageEl) {

                messageEl.textContent =
                    message;

            }


            popup.classList.add(
                'show'
            );


            if (this.toastTimer) {

                clearTimeout(
                    this.toastTimer
                );

            }


            this.toastTimer =
                setTimeout(
                    () =>
                        popup.classList.remove(
                            'show'
                        ),
                    4500
                );

        }

    }


    // --------------------------------------------------
    // 7. PROGRESS MANAGER
    // --------------------------------------------------

    class ProgressManager {

        static completeLesson(
            lessonId
        ) {

            const profile =
                StudentManager.get();


            const lesson =
                LessonManager.lessons.find(
                    l =>
                        l.id ===
                        lessonId
                );


            if (
                !lesson ||
                profile.completedLessons.includes(
                    lessonId
                )
            ) {

                return;

            }


            profile.completedLessons.push(
                lessonId
            );


            profile.completedLessons.sort(
                (a, b) =>
                    a - b
            );


            if (
                !profile.unlockedLessons.includes(
                    lessonId + 1
                ) &&
                lessonId <
                    LessonManager.lessons.length
            ) {

                profile.unlockedLessons.push(
                    lessonId + 1
                );

            }


            const todayStr =
                new Date()
                    .toISOString()
                    .split('T')[0];


            if (
                profile.lastVisitDate ===
                todayStr
            ) {

                profile.dailyGoal.current +=
                    1;

            }


            StudentManager.save();


            XPManager.addXP(
                lesson.xpReward
            );


            AchievementManager.checkAchievements();


            AchievementManager.showToast(
                'Lesson Complete',
                `+${lesson.xpReward} XP Earned | 🔥 ${profile.streak} Day Streak`
            );


            if (
                profile.completedLessons.length ===
                LessonManager.lessons.length
            ) {

                if (
                    !profile.completedModules.includes(
                        1
                    )
                ) {

                    profile.completedModules.push(
                        1
                    );


                    StudentManager.save();


                    setTimeout(
                        () =>
                            UIManager.showModuleCompletion(),
                        1000
                    );

                }

            }


            UIManager.renderAll();

        }


        static navigateToLesson(
            lessonId
        ) {

            const lessons =
                LessonManager.getEnrichedLessons();


            const target =
                lessons.find(
                    l =>
                        l.id ===
                        lessonId
                );


            if (
                !target ||
                target.status ===
                    'locked'
            ) {

                console.warn(
                    'Navigation blocked: Lesson is locked.'
                );


                return;

            }


            const profile =
                StudentManager.get();


            profile.lastVisitedLesson =
                lessonId;


            StudentManager.save();


            window.location.href =
                target.htmlFile;

        }


        static toggleBookmark(
            lessonId
        ) {

            const profile =
                StudentManager.get();


            const index =
                profile.bookmarks.indexOf(
                    lessonId
                );


            if (index > -1) {

                profile.bookmarks.splice(
                    index,
                    1
                );


                AchievementManager.showToast(
                    'Removed',
                    'Lesson removed from bookmarks.'
                );

            }
            else {

                profile.bookmarks.push(
                    lessonId
                );


                AchievementManager.showToast(
                    'Bookmarked',
                    'Lesson saved for later.'
                );

            }


            StudentManager.save();

        }

    }


    // Expose globally for HTML onclick handlers

    window.strativoNavigateToLesson =
        ProgressManager.navigateToLesson;


    window.strativoCompleteLesson =
        ProgressManager.completeLesson;


    window.strativoToggleBookmark =
        ProgressManager.toggleBookmark;


    // --------------------------------------------------
    // 8. STATISTICS MANAGER
    // --------------------------------------------------

    class StatisticsManager {

        static getStats() {

            const profile =
                StudentManager.get();


            const totalLessons =
                LessonManager.lessons.length;


            const completedCount =
                profile.completedLessons.length;


            const completionPct =
                Math.round(
                    (
                        completedCount /
                        totalLessons
                    ) * 100
                );


            const moduleXP =
                profile.completedLessons.reduce(
                    (
                        sum,
                        id
                    ) => {

                        const l =
                            LessonManager.lessons.find(
                                les =>
                                    les.id ===
                                    id
                            );


                        return sum +
                            (
                                l
                                    ? l.xpReward
                                    : 0
                            );

                    },
                    0
                );


            return {

                completedCount,

                remainingCount:
                    totalLessons -
                    completedCount,

                completionPct,

                moduleXP,

                streak:
                    profile.streak,

                levelInfo:
                    XPManager.calculateLevelInfo(
                        profile.totalXP
                    )

            };

        }

    }


    // --------------------------------------------------
    // 9. UI MANAGER
    // --------------------------------------------------

    class UIManager {

        static renderState = {
            xp: -1,
            completed: -1,
            streak: -1
        };


        static scrollObserver =
            null;


        static initInteractivity() {

            // Global Search Logic

            const searchInput =
                document.getElementById(
                    'global-search'
                );


            const searchBar =
                document.getElementById(
                    'search-bar-cont'
                );


            const searchResults =
                document.getElementById(
                    'global-search-results'
                );


            if (
                searchInput
            ) {

                searchInput.addEventListener(
                    'focus',
                    () => {

                        if (searchBar) {

                            searchBar.classList.add(
                                'active'
                            );

                        }


                        this.renderSearch(
                            searchInput.value,
                            searchResults
                        );

                    }
                );


                searchInput.addEventListener(
                    'blur',
                    () => {

                        setTimeout(
                            () => {

                                if (searchBar) {

                                    searchBar.classList.remove(
                                        'active'
                                    );

                                }

                            },
                            200
                        );

                    }
                );


                searchInput.addEventListener(
                    'input',
                    e => {

                        this.renderSearch(
                            e.target.value,
                            searchResults
                        );

                    }
                );


                searchInput.addEventListener(
                    'keydown',
                    e => {

                        if (
                            e.key ===
                            'Escape'
                        ) {

                            if (searchBar) {

                                searchBar.classList.remove(
                                    'active'
                                );

                            }


                            searchInput.blur();


                            return;

                        }


                        if (!searchResults) {
                            return;
                        }


                        const items =
                            searchResults.querySelectorAll(
                                '.search-result-item'
                            );


                        if (
                            items.length ===
                            0
                        ) {

                            return;

                        }


                        let activeIndex =
                            Array
                                .from(items)
                                .findIndex(
                                    item =>
                                        item.classList.contains(
                                            'selected'
                                        )
                                );


                        if (
                            e.key ===
                            'ArrowDown'
                        ) {

                            e.preventDefault();


                            activeIndex =
                                activeIndex <
                                items.length - 1
                                    ? activeIndex + 1
                                    : 0;


                            this.updateSearchSelection(
                                items,
                                activeIndex
                            );

                        }
                        else if (
                            e.key ===
                            'ArrowUp'
                        ) {

                            e.preventDefault();


                            activeIndex =
                                activeIndex >
                                0
                                    ? activeIndex - 1
                                    : items.length - 1;


                            this.updateSearchSelection(
                                items,
                                activeIndex
                            );

                        }
                        else if (
                            e.key ===
                            'Enter'
                        ) {

                            e.preventDefault();


                            if (
                                activeIndex >=
                                0
                            ) {

                                items[
                                    activeIndex
                                ].click();

                            }

                        }

                    }
                );

            }


            // Global Shortcut Ctrl+K

            document.addEventListener(
                'keydown',
                e => {

                    if (
                        (
                            e.ctrlKey ||
                            e.metaKey
                        ) &&
                        e.key ===
                        'k'
                    ) {

                        e.preventDefault();


                        if (
                            searchInput
                        ) {

                            searchInput.focus();

                        }

                    }

                }
            );


            // FAQ Accordion & Filter Logic

            const faqContainer =
                document.getElementById(
                    'faq-container'
                );


            const faqInput =
                document.getElementById(
                    'faq-search-input'
                );


            const faqCounter =
                document.getElementById(
                    'faq-counter'
                );


            if (
                faqContainer
            ) {

                const faqs =
                    Array.from(
                        faqContainer.querySelectorAll(
                            'details.faq-item'
                        )
                    );


                faqs.forEach(
                    faq => {

                        faq.addEventListener(
                            'toggle',
                            () => {

                                if (
                                    faq.open
                                ) {

                                    faqs.forEach(
                                        otherFaq => {

                                            if (
                                                otherFaq !==
                                                faq
                                            ) {

                                                otherFaq.removeAttribute(
                                                    'open'
                                                );

                                            }

                                        }
                                    );

                                }

                            }
                        );

                    }
                );


                if (
                    faqInput
                ) {

                    faqInput.addEventListener(
                        'input',
                        e => {

                            const term =
                                e.target.value
                                    .toLowerCase()
                                    .trim();


                            let visibleCount =
                                0;


                            faqs.forEach(
                                faq => {

                                    const summary =
                                        faq.querySelector(
                                            'summary'
                                        );


                                    if (
                                        !summary
                                    ) {

                                        return;

                                    }


                                    const originalText =
                                        (
                                            summary
                                                .childNodes[0]
                                                ?.textContent ||
                                            ''
                                        ).trim();


                                    const contentText =
                                        faq.textContent
                                            .toLowerCase();


                                    if (
                                        contentText.includes(
                                            term
                                        )
                                    ) {

                                        faq.style.display =
                                            'block';


                                        visibleCount++;


                                        if (
                                            term.length >
                                                0 &&
                                            originalText
                                                .toLowerCase()
                                                .includes(
                                                    term
                                                )
                                        ) {

                                            const regex =
                                                new RegExp(
                                                    `(${term})`,
                                                    'gi'
                                                );


                                            summary.innerHTML =
                                                originalText.replace(
                                                    regex,
                                                    '<span style="background: rgba(59,130,246,0.3); color: white; padding:0 2px; border-radius:2px;">$1</span>'
                                                ) +
                                                '<span class="faq-icon">+</span>';

                                        }
                                        else {

                                            summary.innerHTML =
                                                originalText +
                                                '<span class="faq-icon">+</span>';

                                        }

                                    }
                                    else {

                                        faq.style.display =
                                            'none';


                                        summary.innerHTML =
                                            originalText +
                                            '<span class="faq-icon">+</span>';

                                    }

                                }
                            );


                            if (
                                faqCounter
                            ) {

                                faqCounter.style.display =
                                    term.length >
                                    0
                                        ? 'block'
                                        : 'none';


                                faqCounter.textContent =
                                    `Showing ${visibleCount} Results`;

                            }

                        }
                    );

                }

            }


            this.attachRipple();


            this.attachScrollReveal();

        }


        static updateSearchSelection(
            items,
            index
        ) {

            items.forEach(
                i =>
                    i.classList.remove(
                        'selected'
                    )
            );


            if (
                index >= 0 &&
                items[index]
            ) {

                items[index].classList.add(
                    'selected'
                );


                items[
                    index
                ].scrollIntoView({
                    block:
                        'nearest'
                });

            }

        }


        static renderSearch(
            query,
            container
        ) {

            if (!container) {
                return;
            }


            const term =
                query
                    .toLowerCase()
                    .trim();


            let html =
                '';


            if (!term) {

                html = `

                    <div class="search-history">
                        Recent Searches
                    </div>

                    <div
                        class="search-result-item"
                        onclick="window.location.href='../pip-calculator.html'"
                    >
                        <span class="search-highlight">
                            Pip Value
                        </span>
                        Calculator
                    </div>

                    <div
                        class="search-result-item"
                        onclick="window.location.href='lessons/module1/lesson5.html'"
                    >
                        Understanding
                        <span class="search-highlight">
                            Margin
                        </span>
                    </div>

                `;

            }
            else {

                const matches =
                    LessonManager.lessons.filter(
                        l =>
                            l.title
                                .toLowerCase()
                                .includes(
                                    term
                                ) ||

                            l.description
                                .toLowerCase()
                                .includes(
                                    term
                                )
                    );


                html += `

                    <div class="search-history">
                        Lessons
                    </div>

                `;


                if (
                    matches.length >
                    0
                ) {

                    matches.forEach(
                        m => {

                            const regex =
                                new RegExp(
                                    `(${term})`,
                                    'gi'
                                );


                            const highlightedTitle =
                                m.title.replace(
                                    regex,
                                    '<span class="search-highlight">$1</span>'
                                );


                            html += `

                                <div
                                    class="search-result-item"
                                    onclick="window.strativoNavigateToLesson(${m.id})"
                                >
                                    L${m.id}: ${highlightedTitle}
                                </div>

                            `;

                        }
                    );

                }
                else {

                    html += `

                        <div class="no-results">

                            <div class="nr-icon">
                                🔍
                            </div>

                            <div>
                                No lessons found matching "${term}"
                            </div>

                        </div>

                    `;

                }

            }


            container.innerHTML =
                html;

        }


        static animateValue(
            obj,
            start,
            end,
            duration
        ) {

            if (!obj) {
                return;
            }


            if (
                start === end
            ) {

                obj.textContent =
                    end.toLocaleString();


                return;

            }


            let startTimestamp =
                null;


            const step =
                timestamp => {

                    if (
                        !startTimestamp
                    ) {

                        startTimestamp =
                            timestamp;

                    }


                    const progress =
                        Math.min(
                            (
                                timestamp -
                                startTimestamp
                            ) /
                            duration,
                            1
                        );


                    const current =
                        Math.floor(
                            progress *
                            (
                                end -
                                start
                            ) +
                            start
                        );


                    obj.textContent =
                        current.toLocaleString();


                    if (
                        progress <
                        1
                    ) {

                        window.requestAnimationFrame(
                            step
                        );

                    }
                    else {

                        obj.textContent =
                            end.toLocaleString();

                    }

                };


            window.requestAnimationFrame(
                step
            );

        }


        static renderAll() {

            const profile =
                StudentManager.get();


            const stats =
                StatisticsManager.getStats();


            const enrichedLessons =
                LessonManager.getEnrichedLessons();


            const targetLesson =
                LessonManager.getContinueLesson();


            this.renderGlobalStatsUI(
                profile,
                stats
            );


            this.renderSidebar(
                profile,
                enrichedLessons
            );


            this.renderContinueLearning(
                targetLesson,
                profile,
                stats
            );


            this.renderLessonCards(
                enrichedLessons
            );


            this.renderPracticeAndRewards(
                profile,
                stats
            );


            this.attachRipple();


            setTimeout(
                () =>
                    this.attachScrollReveal(),
                50
            );

        }


        static renderGlobalStatsUI(
            profile,
            stats
        ) {

            const els = {

                headerXp:
                    document.getElementById(
                        'header-xp-val'
                    ),

                heroValXp:
                    document.getElementById(
                        'hero-val-xp'
                    ),

                statXp:
                    document.getElementById(
                        'stat-card-xp'
                    ),

                rewardLifetime:
                    document.getElementById(
                        'reward-val-lifetime'
                    ),

                statCompleted:
                    document.getElementById(
                        'stat-card-completed'
                    ),

                statRemaining:
                    document.getElementById(
                        'stat-card-remaining'
                    ),

                rewardStreak:
                    document.getElementById(
                        'reward-val-streak'
                    ),

                heroValProg:
                    document.getElementById(
                        'hero-val-prog'
                    ),

                heroValProgFill:
                    document.getElementById(
                        'hero-val-prog-fill'
                    ),

                heroProgressText:
                    document.getElementById(
                        'hero-progress-text'
                    ),

                heroProgressFill:
                    document.getElementById(
                        'hero-progress-fill'
                    ),

                statCircular:
                    document.getElementById(
                        'stat-circular'
                    ),

                statProgress:
                    document.getElementById(
                        'stat-card-progress'
                    ),

                heroValLevel:
                    document.getElementById(
                        'hero-val-level'
                    ),

                heroValNextXp:
                    document.getElementById(
                        'hero-val-next-xp'
                    ),

                heroWelcomeMsg:
                    document.getElementById(
                        'hero-welcome-msg'
                    ),

                heroLastUpdated:
                    document.getElementById(
                        'hero-last-updated'
                    ),

                headerStreak:
                    document.getElementById(
                        'header-streak-val'
                    ),

                heroValStreak:
                    document.getElementById(
                        'hero-val-streak'
                    ),

                statHoverTime:
                    document.getElementById(
                        'stat-hover-time'
                    ),

                statHoverComp:
                    document.getElementById(
                        'stat-hover-comp'
                    ),

                statHoverXp:
                    document.getElementById(
                        'stat-hover-xp'
                    ),

                sidebarSummaryCount:
                    document.getElementById(
                        'sidebar-summary-count'
                    ),

                sidebarSummaryXp:
                    document.getElementById(
                        'sidebar-summary-xp'
                    )

            };


            if (
                this.renderState.xp !==
                profile.totalXP
            ) {

                this.animateValue(
                    els.headerXp,
                    Math.max(
                        0,
                        this.renderState.xp
                    ),
                    profile.totalXP,
                    1000
                );


                this.animateValue(
                    els.heroValXp,
                    Math.max(
                        0,
                        this.renderState.xp
                    ),
                    profile.totalXP,
                    1000
                );


                this.animateValue(
                    els.statXp,
                    Math.max(
                        0,
                        this.renderState.xp
                    ),
                    profile.totalXP,
                    1000
                );


                this.animateValue(
                    els.rewardLifetime,
                    Math.max(
                        0,
                        this.renderState.xp
                    ),
                    profile.totalXP,
                    1000
                );


                this.renderState.xp =
                    profile.totalXP;

            }


            if (
                this.renderState.completed !==
                stats.completedCount
            ) {

                this.animateValue(
                    els.statCompleted,
                    Math.max(
                        0,
                        this.renderState.completed
                    ),
                    stats.completedCount,
                    800
                );


                this.animateValue(
                    els.statRemaining,
                    10 -
                        Math.max(
                            0,
                            this.renderState.completed
                        ),
                    stats.remainingCount,
                    800
                );


                this.renderState.completed =
                    stats.completedCount;

            }


            if (
                this.renderState.streak !==
                profile.streak
            ) {

                this.animateValue(
                    els.rewardStreak,
                    Math.max(
                        0,
                        this.renderState.streak
                    ),
                    profile.streak,
                    800
                );


                this.renderState.streak =
                    profile.streak;

            }


            if (
                els.heroValProg
            ) {

                this.animateValue(
                    els.heroValProg,
                    0,
                    stats.completionPct,
                    1000
                );

            }


            if (
                els.heroValProgFill
            ) {

                els.heroValProgFill.style.width =
                    `${stats.completionPct}%`;

            }


            if (
                els.heroProgressText
            ) {

                els.heroProgressText.textContent =
                    `${stats.completionPct}%`;

            }


            if (
                els.heroProgressFill
            ) {

                els.heroProgressFill.style.width =
                    `${stats.completionPct}%`;

            }


            if (
                els.statProgress
            ) {

                els.statProgress.textContent =
                    stats.completionPct;

            }


            if (
                els.statCircular
            ) {

                els.statCircular.style.background =
                    `conic-gradient(
                        var(--color-primary)
                        ${stats.completionPct}%,
                        rgba(255,255,255,0.05)
                        ${stats.completionPct}%
                    )`;

            }


            if (
                els.headerStreak
            ) {

                els.headerStreak.textContent =
                    profile.streak;

            }


            if (
                els.heroValStreak
            ) {

                els.heroValStreak.textContent =
                    `${profile.streak} Days`;

            }


            if (
                els.heroValLevel
            ) {

                els.heroValLevel.textContent =
                    profile.badge;

            }


            if (
                els.heroValNextXp
            ) {

                els.heroValNextXp.textContent =
                    `${stats.levelInfo.remainingXP} XP Remaining`;

            }


            if (
                els.statHoverTime
            ) {

                els.statHoverTime.textContent =
                    `~${stats.remainingCount * 20} mins left`;

            }


            if (
                els.statHoverXp
            ) {

                els.statHoverXp.textContent =
                    `Needs ${stats.levelInfo.remainingXP} XP for Lvl ${stats.levelInfo.level + 1}`;

            }


            const todayStr =
                new Date()
                    .toISOString()
                    .split('T')[0];


            if (
                els.statHoverComp
            ) {

                els.statHoverComp.textContent =
                    `Completed Today: ${
                        profile.lastVisitDate ===
                        todayStr

                            ? (
                                profile.dailyGoal.current > 0
                                    ? profile.dailyGoal.current
                                    : '0'
                            )

                            : '0'
                    }`;

            }


            if (
                els.sidebarSummaryCount
            ) {

                els.sidebarSummaryCount.textContent =
                    `${stats.completedCount}/${LessonManager.lessons.length}`;

            }


            if (
                els.sidebarSummaryXp
            ) {

                els.sidebarSummaryXp.textContent =
                    `${stats.moduleXP} / 500`;

            }


            if (
                els.heroLastUpdated
            ) {

                const dateStr =
                    profile.lastStudyDate

                        ? new Date(
                            profile.lastStudyDate
                        ).toLocaleDateString(
                            undefined,
                            {
                                month:
                                    'short',
                                day:
                                    'numeric'
                            }
                        )

                        : 'Today';


                els.heroLastUpdated.innerHTML =
                    `🔄 Last activity: ${dateStr}`;

            }


            if (
                els.heroWelcomeMsg
            ) {

                const firstName =
                    profile.studentName
                        .split(' ')[0] ||
                    "Trader";


                if (
                    stats.completionPct ===
                    0
                ) {

                    els.heroWelcomeMsg.innerHTML =
                        `Welcome, <strong style="color:var(--color-primary);">${firstName}</strong>. Lay the foundation of your trading career. Understand the market structure, currency pairs, and the fundamental mechanics of placing a trade.`;

                }
                else if (
                    stats.completionPct <
                    100
                ) {

                    els.heroWelcomeMsg.innerHTML =
                        `Welcome back, <strong style="color:var(--color-primary);">${firstName}</strong>. Continue building your Forex foundation. You are making great progress!`;

                }
                else {

                    els.heroWelcomeMsg.innerHTML =
                        `Congratulations, <strong style="color:var(--color-accent);">${firstName}!</strong> You have successfully completed this module. Test your skills in the Practice Zone below.`;

                }

            }

        }


        static renderSidebar(
            profile,
            enrichedLessons
        ) {

            const sidebarList =
                document.getElementById(
                    'sidebar-lesson-list'
                );


            if (
                sidebarList
            ) {

                sidebarList.innerHTML =
                    '';


                enrichedLessons.forEach(
                    lesson => {

                        const padNum =
                            String(
                                lesson.id
                            ).padStart(
                                2,
                                '0'
                            );


                        const icon =

                            lesson.status ===
                            'completed'

                                ? '✅'

                                : lesson.status ===
                                  'locked'

                                    ? '🔒'

                                    : lesson.status ===
                                      'active'

                                        ? '<span class="pulse-dot"></span>'

                                        : lesson.image;


                        const li =
                            document.createElement(
                                'li'
                            );


                        li.className =
                            `nav-item ${
                                lesson.status ===
                                'completed'

                                    ? 'completed'

                                    : lesson.status ===
                                      'active'

                                        ? 'active'

                                        : lesson.status ===
                                          'locked'

                                            ? 'locked'

                                            : ''
                            }`;


                        const clickHandler =
                            lesson.status ===
                            'locked'

                                ? ''

                                : `onclick="window.strativoNavigateToLesson(${lesson.id}); return false;"`;


                        const tooltipText =

                            lesson.status ===
                            'locked'

                                ? `Locked\nComplete Lesson ${lesson.id - 1} first.`

                                : `${lesson.title}\n${lesson.readingTime} mins | +${lesson.xpReward} XP | ${lesson.difficulty}`;


                        li.innerHTML =
                            `

                                <a
                                    href="${
                                        lesson.status ===
                                        'locked'
                                            ? '#'
                                            : lesson.htmlFile
                                    }"
                                    ${clickHandler}
                                    data-tooltip="${tooltipText}"
                                >

                                    <div class="nav-left">

                                        <span class="nav-num">
                                            ${padNum}
                                        </span>

                                        <span class="nav-title">
                                            ${lesson.title}
                                        </span>

                                    </div>

                                    <span class="nav-icon">
                                        ${icon}
                                    </span>

                                </a>

                            `;


                        sidebarList.appendChild(
                            li
                        );

                    }
                );

            }


            const dgCounter =
                document.getElementById(
                    'dg-counter'
                );


            const dgCheck1 =
                document.getElementById(
                    'dg-check-1'
                );


            const dgCheck2 =
                document.getElementById(
                    'dg-check-2'
                );


            const dgTask1 =
                document.getElementById(
                    'dg-task-1'
                );


            const dgTask2 =
                document.getElementById(
                    'dg-task-2'
                );


            const todayStr =
                new Date()
                    .toISOString()
                    .split('T')[0];


            const studiedToday =
                profile.lastVisitDate ===
                todayStr;


            let goalsMet =
                0;


            if (
                studiedToday &&
                dgCheck1 &&
                dgTask1
            ) {

                dgCheck1.checked =
                    true;


                dgTask1.classList.add(
                    'done'
                );


                goalsMet++;

            }


            if (
                profile.dailyGoal.current >
                    0 &&
                dgCheck2 &&
                dgTask2
            ) {

                dgCheck2.checked =
                    true;


                dgTask2.classList.add(
                    'done'
                );


                goalsMet++;

            }


            if (
                dgCounter
            ) {

                dgCounter.textContent =
                    `${goalsMet}/2`;

            }


            const heatmapGrid =
                document.getElementById(
                    'heatmap-grid'
                );


            if (
                heatmapGrid
            ) {

                heatmapGrid.innerHTML =
                    '';


                const today =
                    new Date();


                const studyDays =
                    profile.studyDays ||
                    [];


                for (
                    let i = 13;
                    i >= 0;
                    i--
                ) {

                    const d =
                        new Date(
                            today
                        );


                    d.setDate(
                        today.getDate() -
                        i
                    );


                    const dStr =
                        d.toISOString()
                            .split('T')[0];


                    const displayDate =
                        d.toLocaleDateString(
                            undefined,
                            {
                                month:
                                    'short',
                                day:
                                    'numeric'
                            }
                        );


                    const sq =
                        document.createElement(
                            'div'
                        );


                    if (
                        studyDays.includes(
                            dStr
                        )
                    ) {

                        const rand =
                            Math.random();


                        sq.className =
                            `hm-square ${
                                rand > 0.7
                                    ? 'active-high'
                                    : rand > 0.3
                                        ? 'active-med'
                                        : 'active-low'
                            }`;


                        sq.setAttribute(
                            'data-tooltip',
                            `${displayDate}: Studied`
                        );

                    }
                    else {

                        sq.className =
                            'hm-square';


                        sq.setAttribute(
                            'data-tooltip',
                            `${displayDate}: No Activity`
                        );

                    }


                    heatmapGrid.appendChild(
                        sq
                    );

                }

            }

        }


        static renderContinueLearning(
            targetLesson,
            profile,
            stats
        ) {

            const continueSection =
                document.getElementById(
                    'continue-learning-section'
                );


            const heroContinueBtn =
                document.getElementById(
                    'hero-continue-btn'
                );


            if (
                !targetLesson
            ) {

                if (
                    continueSection
                ) {

                    continueSection.style.display =
                        'none';

                }


                if (
                    heroContinueBtn
                ) {

                    heroContinueBtn.innerHTML =
                        'Module Complete ✅';


                    heroContinueBtn.className =
                        'btn btn-secondary';


                    heroContinueBtn.style.pointerEvents =
                        'none';

                }


                return;

            }


            if (
                continueSection
            ) {

                continueSection.style.display =
                    'block';

            }


            const els = {

                tag:
                    document.getElementById(
                        'continue-tag'
                    ),

                title:
                    document.getElementById(
                        'continue-title'
                    ),

                excerpt:
                    document.getElementById(
                        'continue-excerpt'
                    ),

                timeLeft:
                    document.getElementById(
                        'continue-time'
                    ),

                lastOpen:
                    document.getElementById(
                        'continue-last-date'
                    ),

                progFill:
                    document.getElementById(
                        'continue-prog-fill'
                    ),

                progText:
                    document.getElementById(
                        'continue-prog-text'
                    ),

                btn:
                    document.getElementById(
                        'continue-btn'
                    )

            };


            if (
                els.tag
            ) {

                els.tag.textContent =
                    `Lesson ${targetLesson.id}`;

            }


            if (
                els.title
            ) {

                els.title.textContent =
                    targetLesson.title;

            }


            if (
                els.excerpt
            ) {

                els.excerpt.textContent =
                    targetLesson.description;

            }


            if (
                els.timeLeft
            ) {

                els.timeLeft.innerHTML =
                    `
                        <svg
                            viewBox="0 0 24 24"
                            width="14"
                            height="14"
                            fill="currentColor"
                        >
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                        </svg>

                        ~${stats.remainingCount * 20} mins left
                    `;

            }


            let dateStr =
                'Today';


            if (
                profile.lastVisitedLesson ===
                    targetLesson.id &&
                profile.lastVisitDate
            ) {

                const studyDate =
                    new Date(
                        profile.lastVisitDate
                    );


                if (
                    studyDate.toDateString() !==
                    new Date().toDateString()
                ) {

                    dateStr =
                        studyDate.toLocaleDateString(
                            undefined,
                            {
                                month:
                                    'short',
                                day:
                                    'numeric'
                            }
                        );

                }
                else {

                    dateStr =
                        'Today 6:30 PM';

                }

            }


            if (
                els.lastOpen
            ) {

                els.lastOpen.innerHTML =
                    `
                        <svg
                            viewBox="0 0 24 24"
                            width="14"
                            height="14"
                            fill="currentColor"
                        >
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/>
                        </svg>

                        Active ${dateStr}
                    `;

            }


            if (
                els.progFill
            ) {

                els.progFill.style.width =
                    `${targetLesson.progress}%`;

            }


            if (
                els.progText
            ) {

                els.progText.textContent =
                    `${targetLesson.progress}% Complete`;

            }


            if (
                els.btn
            ) {

                els.btn.href =
                    targetLesson.htmlFile;


                els.btn.onclick =
                    e => {

                        e.preventDefault();


                        ProgressManager.navigateToLesson(
                            targetLesson.id
                        );

                    };

            }


            if (
                heroContinueBtn
            ) {

                heroContinueBtn.href =
                    targetLesson.htmlFile;


                heroContinueBtn.style.display =
                    'inline-flex';


                heroContinueBtn.onclick =
                    e => {

                        e.preventDefault();


                        ProgressManager.navigateToLesson(
                            targetLesson.id
                        );

                    };

            }

        }


        static renderLessonCards(
            enrichedLessons
        ) {

            const grid =
                document.getElementById(
                    'main-lessons-grid'
                );


            if (!grid) {

                return;

            }


            grid.innerHTML =
                '';


            enrichedLessons.forEach(
                (
                    lesson,
                    index
                ) => {

                    const isCompleted =
                        lesson.status ===
                        'completed';


                    const isLocked =
                        lesson.status ===
                        'locked';


                    const isCurrent =
                        lesson.status ===
                        'active';


                    const article =
                        document.createElement(
                            'article'
                        );


                    article.className =
                        `lesson-card ${
                            isCompleted
                                ? 'completed'
                                : isCurrent
                                    ? 'active'
                                    : isLocked
                                        ? 'locked'
                                        : ''
                        } reveal-on-scroll`;


                    article.style.transitionDelay =
                        `${(
                            index %
                            3
                        ) * 0.1}s`;


                    const statusLabel =
                        isCompleted
                            ? 'Completed'
                            : isCurrent
                                ? 'In Progress'
                                : isLocked
                                    ? 'Locked'
                                    : 'Available';


                    const statusIcon =
                        isCompleted
                            ? '✅'
                            : isCurrent
                                ? '▶️'
                                : isLocked
                                    ? '🔒'
                                    : '⭕';


                    let buttonHtml =
                        '';


                    if (
                        isCompleted
                    ) {

                        buttonHtml =
                            `
                                <a
                                    href="${lesson.htmlFile}"
                                    class="btn btn-outline"
                                    onclick="window.strativoNavigateToLesson(${lesson.id}); return false;"
                                >
                                    Review Lesson
                                </a>
                            `;

                    }
                    else if (
                        isLocked
                    ) {

                        buttonHtml =
                            `
                                <button
                                    class="btn btn-secondary disabled"
                                    type="button"
                                >
                                    Locked Soon
                                </button>
                            `;

                    }
                    else {

                        buttonHtml =
                            `
                                <a
                                    href="${lesson.htmlFile}"
                                    class="btn btn-primary"
                                    onclick="window.strativoNavigateToLesson(${lesson.id}); return false;"
                                >
                                    Start Lesson
                                </a>
                            `;

                    }


                    const circularProgHTML =
                        !isCompleted

                            ? `

                                <div
                                    class="lc-circular-prog"
                                    style="
                                        background:
                                        conic-gradient(
                                            var(--color-primary)
                                            ${lesson.progress}%,
                                            rgba(255,255,255,0.1)
                                            0
                                        );
                                    "
                                >

                                    <span>
                                        ${lesson.progress}%
                                    </span>

                                </div>

                            `

                            : '';


                    article.innerHTML =
                        `

                            <div class="lc-ribbon">
                                Completed
                            </div>


                            <div class="lc-thumb">

                                <div
                                    class="emoji-icon"
                                    style="
                                        position:
                                            relative;
                                        z-index:
                                            2;
                                    "
                                >
                                    ${lesson.image}
                                </div>


                                ${circularProgHTML}


                                ${
                                    isLocked

                                        ? `

                                            <div
                                                class="lesson-overlay-lock"
                                            >

                                                <div
                                                    class="lock-circle"
                                                    style="
                                                        width:
                                                            48px;
                                                        height:
                                                            48px;
                                                        font-size:
                                                            1.2rem;
                                                    "
                                                >
                                                    🔒
                                                </div>


                                                <span
                                                    class="lock-text"
                                                    style="
                                                        font-size:
                                                            var(--fs-sm);
                                                    "
                                                >
                                                    Complete previous
                                                </span>

                                            </div>

                                        `

                                        : ''
                                }

                            </div>


                            <div class="lc-content">

                                <div
                                    class="lc-badges"
                                    style="
                                        margin-bottom:
                                            0.75rem;
                                        justify-content:
                                            space-between;
                                    "
                                >

                                    <span
                                        class="lc-status"
                                        style="
                                            font-size:
                                                0.75rem;
                                            font-weight:
                                                600;
                                            color:
                                                var(--color-text-muted);
                                            display:
                                                flex;
                                            align-items:
                                                center;
                                            gap:
                                                0.25rem;
                                        "
                                    >

                                        <i>
                                            ${statusIcon}
                                        </i>

                                        ${statusLabel}

                                    </span>


                                    <span
                                        class="badge badge-cat"
                                        style="
                                            padding:
                                                0.25rem
                                                0.6rem;
                                            font-size:
                                                0.65rem;
                                        "
                                    >
                                        ${lesson.category}
                                    </span>

                                </div>


                                <h3 class="lc-title">

                                    <span class="lc-num">
                                        ${lesson.id}.
                                    </span>

                                    ${lesson.title}

                                </h3>


                                <p class="lc-desc">
                                    ${lesson.description}
                                </p>


                                <div class="lc-prog-container">

                                    <div
                                        class="lc-prog-header"
                                    >
                                        <span>
                                            Reading Progress
                                        </span>
                                    </div>


                                    <div
                                        class="lc-prog-track-wrapper"
                                    >

                                        <div
                                            class="lc-prog-track"
                                        >

                                            <div
                                                class="lc-prog-fill"
                                                style="
                                                    width:
                                                        ${lesson.progress}%;
                                                "
                                            ></div>

                                        </div>


                                        <span class="lc-prog-pct">
                                            ${lesson.progress}%
                                        </span>

                                    </div>

                                </div>


                                <div
                                    class="lc-metrics-grid"
                                >

                                    <div class="metric">

                                        <span
                                            style="
                                                font-size:
                                                    1rem;
                                            "
                                        >
                                            ⏱️
                                        </span>

                                        <strong>
                                            ${lesson.readingTime}
                                            min
                                        </strong>

                                    </div>


                                    <div class="metric">

                                        <span
                                            style="
                                                font-size:
                                                    1rem;
                                            "
                                        >
                                            ⭐
                                        </span>

                                        <strong
                                            style="
                                                color:
                                                    var(--color-warning);
                                            "
                                        >
                                            +${lesson.xpReward}
                                            XP
                                        </strong>

                                    </div>


                                    <div class="metric">

                                        <span
                                            style="
                                                font-size:
                                                    1rem;
                                            "
                                        >
                                            📝
                                        </span>

                                        <strong>
                                            ${lesson.quizQuestions}
                                            Qs
                                        </strong>

                                    </div>


                                    <div class="metric">

                                        <span
                                            style="
                                                font-size:
                                                    1rem;
                                            "
                                        >

                                            ${
                                                lesson.difficulty ===
                                                'Hard'

                                                    ? '🔥'

                                                    : lesson.difficulty ===
                                                      'Intermediate'

                                                        ? '⚡'

                                                        : '🟢'
                                            }

                                        </span>


                                        <strong>
                                            ${lesson.difficulty}
                                        </strong>

                                    </div>

                                </div>


                                <div class="lc-footer">

                                    ${buttonHtml}

                                </div>

                            </div>

                        `;


                    grid.appendChild(
                        article
                    );

                }
            );

        }


        static renderPracticeAndRewards(
            profile,
            stats
        ) {

            const isComplete =
                stats.completionPct ===
                100;


            const practiceQuizBtn =
                document.getElementById(
                    'practice-quiz-btn'
                );


            const practiceCardQuiz =
                document.getElementById(
                    'practice-card-quiz'
                );


            const quizLockText =
                document.getElementById(
                    'quiz-lock-text'
                );


            const practiceExercisesBtn =
                document.getElementById(
                    'practice-exercises-btn'
                );


            const practiceCardExe =
                document.getElementById(
                    'practice-card-exe'
                );


            const exeLockText =
                document.getElementById(
                    'exe-lock-text'
                );


            if (
                isComplete
            ) {

                if (
                    practiceQuizBtn
                ) {

                    practiceQuizBtn.classList.remove(
                        'disabled',
                        'btn-secondary'
                    );


                    practiceQuizBtn.classList.add(
                        'btn-primary'
                    );


                    practiceQuizBtn.textContent =
                        'Start Quiz';


                    if (
                        practiceCardQuiz
                    ) {

                        practiceCardQuiz.classList.remove(
                            'locked'
                        );

                    }


                    if (
                        quizLockText
                    ) {

                        quizLockText.style.display =
                            'none';

                    }

                }


                if (
                    practiceExercisesBtn
                ) {

                    practiceExercisesBtn.classList.remove(
                        'disabled',
                        'btn-secondary'
                    );


                    practiceExercisesBtn.classList.add(
                        'btn-primary'
                    );


                    practiceExercisesBtn.textContent =
                        'Start Exercises';


                    if (
                        practiceCardExe
                    ) {

                        practiceCardExe.classList.remove(
                            'locked'
                        );

                    }


                    if (
                        exeLockText
                    ) {

                        exeLockText.style.display =
                            'none';

                    }

                }

            }


            const rewardBadge =
                document.getElementById(
                    'reward-val-badge'
                );


            const rewardLevel =
                document.getElementById(
                    'reward-val-level'
                );


            const rewardLevelFill =
                document.getElementById(
                    'reward-level-fill'
                );


            const rewardNext =
                document.getElementById(
                    'reward-val-next'
                );


            if (
                rewardBadge
            ) {

                rewardBadge.textContent =
                    profile.badge;

            }


            if (
                rewardLevel
            ) {

                rewardLevel.textContent =
                    stats.levelInfo.level;

            }


            if (
                rewardLevelFill
            ) {

                rewardLevelFill.style.width =
                    `${stats.levelInfo.progressPct}%`;

            }


            if (
                rewardNext
            ) {

                rewardNext.textContent =
                    `Needs ${stats.levelInfo.remainingXP} XP for Lvl ${stats.levelInfo.level + 1}`;

            }

        }


        static showModuleCompletion() {

            const modal =
                document.getElementById(
                    'completion-modal'
                );


            if (!modal) {

                return;

            }


            const hasShown =
                localStorage.getItem(
                    'strativo_mod1_completed_shown'
                );


            if (
                !hasShown
            ) {

                modal.classList.add(
                    'show'
                );


                localStorage.setItem(
                    'strativo_mod1_completed_shown',
                    'true'
                );

            }

        }


        static attachRipple() {

            document
                .querySelectorAll(
                    '.btn, .social-icon'
                )
                .forEach(
                    btn => {

                        btn.removeEventListener(
                            'click',
                            this.createRipple
                        );


                        btn.addEventListener(
                            'click',
                            this.createRipple
                        );

                    }
                );

        }


        static createRipple(
            e
        ) {

            const btn =
                e.currentTarget;


            if (
                btn.classList.contains(
                    'disabled'
                )
            ) {

                return;

            }


            const rect =
                btn.getBoundingClientRect();


            const x =
                e.clientX -
                rect.left;


            const y =
                e.clientY -
                rect.top;


            const ripple =
                document.createElement(
                    'span'
                );


            ripple.className =
                'ripple';


            ripple.style.left =
                `${x}px`;


            ripple.style.top =
                `${y}px`;


            btn.appendChild(
                ripple
            );


            setTimeout(
                () =>
                    ripple.remove(),
                600
            );

        }


        static attachScrollReveal() {

            if (
                !this.scrollObserver
            ) {

                this.scrollObserver =
                    new IntersectionObserver(
                        (
                            entries,
                            obs
                        ) => {

                            entries.forEach(
                                entry => {

                                    if (
                                        entry.isIntersecting
                                    ) {

                                        entry.target.classList.add(
                                            'is-visible'
                                        );


                                        obs.unobserve(
                                            entry.target
                                        );

                                    }

                                }
                            );

                        },
                        {
                            root:
                                null,

                            rootMargin:
                                '0px',

                            threshold:
                                0.1
                        }
                    );

            }


            document
                .querySelectorAll(
                    '.reveal-on-scroll:not(.is-visible)'
                )
                .forEach(
                    el =>
                        this.scrollObserver.observe(
                            el
                        )
                );

        }

    }


    // --------------------------------------------------
    // 10. APP INITIALIZATION
    // --------------------------------------------------

    class StrativoApp {

        /*
         * =========================================================
         * LEGACY / QUIZ COMPLETION SYNCHRONIZATION
         * =========================================================
         *
         * Lesson quiz files save their own quiz result.
         *
         * Module 1 uses the central:
         *     strativo_student_profile
         *
         * This bridge makes sure a completed Lesson 1 quiz is
         * reflected in the central learning system.
         *
         * IMPORTANT:
         * ProgressManager.completeLesson() already protects
         * against duplicate completion and duplicate XP.
         */

        static syncQuizCompletion() {

            const profile =
                StudentManager.get();


            /*
             * -----------------------------------------------------
             * LESSON 1
             * -----------------------------------------------------
             *
             * Support both the current quiz key and older
             * Lesson 1 completion keys so existing V1 progress
             * is not lost.
             */

            const quiz1Completed =
                localStorage.getItem(
                    "quiz1_completed"
                ) ===
                "true";


            const quiz1Passed =
                localStorage.getItem(
                    "quiz1_quizPassed"
                ) ===
                "true";


            const legacyQuiz1Completed =
                localStorage.getItem(
                    "lesson1_quiz_passed"
                ) ===
                "true";


            const legacyLesson1Completed =
                localStorage.getItem(
                    "lesson1_completed"
                ) ===
                "true";


            const lesson1ShouldBeCompleted =
                quiz1Completed ||
                quiz1Passed ||
                legacyQuiz1Completed ||
                legacyLesson1Completed;


            /*
             * Only synchronize when the quiz says Lesson 1
             * was actually passed/completed.
             */

            if (
                lesson1ShouldBeCompleted &&
                !profile.completedLessons.includes(
                    1
                )
            ) {

                console.info(
                    "Strativo Learning Engine: syncing Lesson 1 completion."
                );


                /*
                 * Use the official progress manager.
                 *
                 * This automatically:
                 * - marks Lesson 1 completed
                 * - unlocks Lesson 2
                 * - awards +50 XP
                 * - checks achievements
                 * - refreshes the UI
                 */

                ProgressManager.completeLesson(
                    1
                );


                /*
                 * Re-read the profile because
                 * ProgressManager may have changed it.
                 */

                const updatedProfile =
                    StudentManager.get();


                /*
                 * Lesson 2 should become the student's
                 * current lesson after completing Lesson 1.
                 */

                updatedProfile.currentModule =
                    1;


                updatedProfile.currentLesson =
                    2;


                updatedProfile.lastVisitedLesson =
                    2;


                /*
                 * Make absolutely sure Lesson 2 is unlocked.
                 * This is idempotent and does not award XP.
                 */

                if (
                    !updatedProfile.unlockedLessons.includes(
                        2
                    )
                ) {

                    updatedProfile.unlockedLessons.push(
                        2
                    );

                }


                /*
                 * Keep arrays clean.
                 */

                updatedProfile.completedLessons =
                    [
                        ...new Set(
                            updatedProfile.completedLessons
                        )
                    ]
                    .sort(
                        (a, b) =>
                            a - b
                    );


                updatedProfile.unlockedLessons =
                    [
                        ...new Set(
                            updatedProfile.unlockedLessons
                        )
                    ]
                    .sort(
                        (a, b) =>
                            a - b
                    );


                StudentManager.save();


                /*
                 * Re-render immediately.
                 */

                UIManager.renderAll();

            }

        }


        /*
         * =========================================================
         * NORMAL APPLICATION INITIALIZATION
         * =========================================================
         */

        static init() {

            /*
             * FIRST:
             * Sync completed quiz progress into the
             * central learning system.
             */

            this.syncQuizCompletion();


            /*
             * Existing daily system.
             */

            StudentManager.checkDailyReset();


            /*
             * Existing UI system.
             */

            UIManager.initInteractivity();


            UIManager.renderAll();


            /*
             * Existing avatar system.
             */

            this.initAvatar();


            /*
             * Existing Escape-key modal handling.
             */

            document.addEventListener(
                'keydown',
                e => {

                    if (
                        e.key ===
                        'Escape'
                    ) {

                        const modal =
                            document.getElementById(
                                'completion-modal'
                            );


                        if (
                            modal &&
                            modal.classList.contains(
                                'show'
                            )
                        ) {

                            modal.classList.remove(
                                'show'
                            );

                        }

                    }

                }
            );


            /*
             * Existing modal overlay handling.
             */

            const modalOverlay =
                document.getElementById(
                    'completion-modal'
                );


            if (
                modalOverlay
            ) {

                modalOverlay.addEventListener(
                    'click',
                    e => {

                        if (
                            e.target ===
                            modalOverlay
                        ) {

                            modalOverlay.classList.remove(
                                'show'
                            );

                        }

                    }
                );

            }


            /*
             * =====================================================
             * CROSS-TAB SYNCHRONIZATION
             * =====================================================
             *
             * If another page changes the central student profile,
             * Module 1 updates automatically.
             */

            window.addEventListener(
                'storage',
                e => {

                    if (
                        e.key ===
                        StorageManager.KEY
                    ) {

                        StudentManager.profile =
                            StorageManager.loadProfile();


                        this.initAvatar();


                        UIManager.renderAll();

                    }

                }
            );


            /*
             * =====================================================
             * QUIZ STORAGE SYNCHRONIZATION
             * =====================================================
             *
             * This catches the case where the student completes
             * Lesson 1 in another browser tab.
             */

            window.addEventListener(
                'storage',
                e => {

                    const quizKeys = [

                        'quiz1_completed',

                        'quiz1_quizPassed',

                        'lesson1_quiz_passed',

                        'lesson1_completed'

                    ];


                    if (
                        quizKeys.includes(
                            e.key
                        )
                    ) {

                        /*
                         * Run the bridge again.
                         */

                        this.syncQuizCompletion();

                    }

                }
            );

        }


        /*
         * =========================================================
         * AVATAR
         * =========================================================
         */

        static initAvatar() {

            const avatarContainer =
                document.getElementById(
                    'user-avatar-container'
                );


            if (
                !avatarContainer
            ) {

                return;

            }


            const profile =
                StudentManager.get();


            if (
                profile.avatar
            ) {

                avatarContainer.innerHTML =

                    `
                        <img
                            src="${profile.avatar}"
                            alt="${profile.studentName} Avatar"
                        >
                    `;

            }
            else {

                const initials =
                    profile.studentName
                        .split(' ')
                        .map(
                            n =>
                                n[0]
                        )
                        .join('')
                        .substring(
                            0,
                            2
                        )
                        .toUpperCase();


                avatarContainer.innerHTML =

                    `
                        <span>
                            ${initials}
                        </span>
                    `;

            }

        }

    }


    /*
     * ============================================================
     * BOOT THE LEARNING ENGINE
     * ============================================================
     */

    StrativoApp.init();

});