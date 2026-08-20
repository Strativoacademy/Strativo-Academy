/* ==========================================
   STRATIVO ACADEMY
   Course Unlock System v2.2 (Unified Shared Layout)
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const courseMap = [
    // --- BEGINNER COURSE (Lessons 1-10) ---
    { 
        id: "lesson1Btn", 
        altId: "start-btn-l1",
        url: "lesson1.html", 
        storageKey: "lesson1_completed", 
        title: "Lesson 1" 
    },
    { 
        id: "lesson2Btn", 
        altId: "start-btn-l2",
        url: "lesson2.html", 
        storageKey: "lesson2_completed", 
        title: "Lesson 2", 
        prereqKey: "lesson1_completed", 
        prereqTitle: "Lesson 1" 
    },
    { 
        id: "lesson3Btn", 
        altId: "start-btn-l3",
        url: "lesson3.html", 
        storageKey: "lesson3_completed", 
        title: "Lesson 3", 
        prereqKey: "lesson2_completed", 
        prereqTitle: "Lesson 2" 
    },
    { 
        id: "lesson4Btn", 
        altId: "start-btn-l4",
        url: "lesson4.html", 
        storageKey: "lesson4_completed", 
        title: "Lesson 4", 
        prereqKey: "lesson3_completed", 
        prereqTitle: "Lesson 3" 
    },
    { 
        id: "lesson5Btn", 
        altId: "start-btn-l5",
        url: "lesson5.html", 
        storageKey: "lesson5_completed", 
        title: "Lesson 5", 
        prereqKey: "lesson4_completed", 
        prereqTitle: "Lesson 4" 
    },
    { 
        id: "lesson6Btn", 
        altId: "start-btn-l6",
        url: "lesson6.html", 
        storageKey: "lesson6_completed", 
        title: "Lesson 6", 
        prereqKey: "lesson5_completed", 
        prereqTitle: "Lesson 5" 
    },
    // --- LESSON 7 (COMING SOON) ---
    { 
        id: "lesson7Btn", 
        altId: "start-btn-l7",
        url: "lesson7.html", 
        storageKey: "lesson7_completed", 
        title: "Lesson 7 (Coming Soon)", 
        prereqKey: "lesson6_completed", 
        prereqTitle: "Lesson 6" 
    },
    // --- FUTURE LESSONS (Comment out until ready) ---
    /*
    { 
        id: "lesson8Btn", 
        altId: "start-btn-l8",
        url: "lesson8.html", 
        storageKey: "lesson8_completed", 
        title: "Lesson 8", 
        prereqKey: "lesson7_completed", 
        prereqTitle: "Lesson 7" 
    },
    { 
        id: "lesson9Btn", 
        altId: "start-btn-l9",
        url: "lesson9.html", 
        storageKey: "lesson9_completed", 
        title: "Lesson 9", 
        prereqKey: "lesson8_completed", 
        prereqTitle: "Lesson 8" 
    },
    { 
        id: "lesson10Btn", 
        altId: "start-btn-l10",
        url: "lesson10.html", 
        storageKey: "lesson10_completed", 
        title: "Lesson 10", 
        prereqKey: "lesson9_completed", 
        prereqTitle: "Lesson 9" 
    }
    */
];

    let completedLessonsCount = 0;

    // Loop through each item in the course map dynamically
    courseMap.forEach((lesson) => {
        // Look for either the desktop element ID or the mobile alternate ID
        const btn = document.getElementById(lesson.id) || document.getElementById(lesson.altId);
        const statusBadge = document.getElementById(`status-badge-l${lesson.storageKey.match(/\d+/)[0]}`);
        
        // Safety check to ensure the button element exists on the current viewport markup
        if (!btn) return;

        const isCompleted = localStorage.getItem(lesson.storageKey) === "true";
        const isUnlocked = !lesson.prereqKey || localStorage.getItem(lesson.prereqKey) === "true";

        if (isUnlocked) {
            btn.classList.remove("locked");
            btn.removeAttribute("disabled");
            btn.href = lesson.url;
            btn.onclick = null; // Clear out old blocking click alerts completely

            if (isCompleted) {
                completedLessonsCount++;
                btn.innerHTML = "✅ Completed (Review)";
                if (statusBadge) {
                    statusBadge.innerText = "✅ Completed";
                    statusBadge.style.color = "#00e5a8";
                }
            } else {
                btn.innerHTML = "▶ Start Lesson";
                if (statusBadge) {
                    statusBadge.innerText = "▶ Available";
                    statusBadge.style.color = "#38bdf8";
                }
            }
        } else {
            // Enforce Locked State
            btn.innerHTML = "🔒 Locked";
            btn.href = "#";
            btn.classList.add("locked"); // Adds structural class for CSS rule safety
            btn.setAttribute("disabled", "true");

            if (statusBadge) {
                statusBadge.innerText = "🔒 Locked";
                statusBadge.style.color = "#64748b";
            }

            // Intercept click attempts without breaking page scroll positions
            btn.onclick = (e) => {
                e.preventDefault();
                alert(`Complete ${lesson.prereqTitle} with at least 70% to unlock ${lesson.title}.`);
                return false;
            };
        }
    });

    // Compute progress metric percentage fields natively for shared UI wrappers
    const overallProgressPercent = Math.round((completedLessonsCount / 5) * 100);
    
    const progressFill = document.getElementById("roadmap-progress-fill");
    const progressText = document.getElementById("roadmap-progress-percentage");
    const fractionText = document.getElementById("roadmap-fraction-text");

    if (progressFill) progressFill.style.width = `${overallProgressPercent}%`;
    if (progressText) progressText.innerText = `${overallProgressPercent}%`;
    if (fractionText) fractionText.innerText = `${completedLessonsCount} / 5 Lessons Completed`;
});