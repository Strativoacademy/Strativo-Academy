/* ==========================================================================
   STRATIVO ACADEMY - GLOBAL CORE NAVIGATION & PROGRESS ENGINE (UNIFIED)
========================================================================== */

// 1. SCANS STORAGE TO AUTOMATICALLY SHOW THE CONTINUE NAVIGATION SHORTCUT
function checkLastActiveProgress() {
    const resumeBtn = document.getElementById('resume-btn');
    if (!resumeBtn) return;

    // Check lessons 5 down to 1 for precise step activity signatures
    for (let i = 5; i >= 1; i--) {
        const savedStep = localStorage.getItem(`lesson${i}_currentStep`);
        
        if (savedStep && parseInt(savedStep, 10) > 1) {
            resumeBtn.style.display = 'inline-flex';
            resumeBtn.innerHTML = `🔄 Continue: Lesson ${i} (Step ${savedStep})`;
            resumeBtn.dataset.targetLesson = `lesson${i}.html`;
            return; // Exit loop early once the most recent step marker is verified
        }
    }

    // Fallback: If no internal step markers exist but a lesson is marked completed
    for (let i = 5; i >= 1; i--) {
        const isCompleted = localStorage.getItem(`lesson${i}_completed`) === "true";
        if (isCompleted && i < 5) {
            const nextLesson = i + 1;
            resumeBtn.style.display = 'inline-flex';
            resumeBtn.innerHTML = `🔄 Continue: Lesson ${nextLesson}`;
            resumeBtn.dataset.targetLesson = `lesson${nextLesson}.html`;
            return;
        }
    }
}

// 2. ROUTES THE STUDENT INSTANTLY BACK INTO THEIR SAVED STEP MATRIX
function resumeLastLesson() {
    const resumeBtn = document.getElementById('resume-btn');
    if (resumeBtn && resumeBtn.dataset.targetLesson) {
        window.location.href = resumeBtn.dataset.targetLesson;
    }
}

// 3. CLEARS LOCALIZED BROWSER SANDBOX ARAYS WITH USER APPROVAL
function resetAllProgress() {
    if (confirm("⚠️ Are you sure you want to wipe out all your course completion data and quiz grades? This cannot be undone.")) {
        
        // Loop and isolate specific lesson keys cleanly without destroying unrelated assets
        for (let i = 1; i <= 6; i++) {
            localStorage.removeItem(`lesson${i}_completed`);
            localStorage.removeItem(`lesson${i}_quizScore`);
            localStorage.removeItem(`lesson${i}_quizTotal`);
            localStorage.removeItem(`lesson${i}_unlockedStep`);
            localStorage.removeItem(`lesson${i}_currentStep`);
        }
        
        localStorage.removeItem("strativo_last_active_lesson");
        
        alert("Progress cleared successfully!");
        window.location.reload();
    }
}

// Fire checks immediately on page load initialization
document.addEventListener("DOMContentLoaded", () => {
    checkLastActiveProgress();
});
/* ==========================
   MOBILE DROPDOWN MENU
========================== */

document.addEventListener("DOMContentLoaded", function () {

    const dropdown = document.querySelector(".dropdown");
    const button = dropdown.querySelector("a");
    const menu = dropdown.querySelector(".dropdown-menu");

    button.addEventListener("click", function(e){

        if(window.innerWidth <= 768){

            e.preventDefault();

            menu.classList.toggle("show");

        }

    });

    document.addEventListener("click", function(e){

        if(!dropdown.contains(e.target)){

            menu.classList.remove("show");

        }

    });

});