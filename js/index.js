// Reset Progress Logic
function confirmReset() {
    if(confirm("Are you sure you want to reset all your progress? This action cannot be undone.")) {
        for (let i = 1; i <= 80; i++) {
            localStorage.removeItem(`lesson${i}_quizScore`);
            localStorage.removeItem(`lesson${i}_quizTotal`);
            localStorage.removeItem(`lesson${i}_completed`);
        }
        localStorage.removeItem(`trader_quick_notes`);
        localStorage.removeItem(`trader_bias`);
        localStorage.removeItem(`ws_quick_notes`);
        alert("Progress successfully reset!");
        window.location.reload();
    }
}

// TRADINGVIEW ENGINE (PRESERVED EXACTLY AS IS)
const TVManager = {
    symbol: "OANDA:EURUSD",
    interval: "15",
    advancedInterval: "15",
    container: "",
    widget: null
};

let candleCountdown;

function startCandleTimer(interval) {
    clearInterval(candleCountdown);

    function updateTimer() {
        const now = new Date();
        let totalSeconds = 0;

        switch(interval){
            case "1": totalSeconds = 60 - now.getSeconds(); break;
            case "5": totalSeconds = ((5 - (now.getMinutes() % 5)) * 60) - now.getSeconds(); break;
            case "15": totalSeconds = ((15 - (now.getMinutes() % 15)) * 60) - now.getSeconds(); break;
            case "30": totalSeconds = ((30 - (now.getMinutes() % 30)) * 60) - now.getSeconds(); break;
            case "60": totalSeconds = ((60 - now.getMinutes()) * 60) - now.getSeconds(); break;
            default: totalSeconds = 0;
        }

        if(totalSeconds < 0) totalSeconds = 0;

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const timerText = String(minutes).padStart(2,"0") + ":" + String(seconds).padStart(2,"0");

        const practiceTimer = document.getElementById("candleTimer");
        if(practiceTimer) practiceTimer.textContent = timerText;

        const advancedTimer = document.getElementById("advancedTimer");
        if(advancedTimer) advancedTimer.textContent = timerText;
    }

    updateTimer();
    candleCountdown = setInterval(updateTimer, 1000);
}

function updateMarketStatus(){
    const now = new Date();
    const utcHour = now.getUTCHours();
    const marketStatus = document.getElementById("marketStatus");
    const cockpitSessionVal = document.getElementById("cockpit-session-val");
    
    let sessionName = "";

    if(now.getUTCDay() === 6 || now.getUTCDay() === 0){
        sessionName = "🔴 Market Closed";
    } else if(utcHour >= 0 && utcHour < 7) {
        sessionName = "🟢 Asia Session Open";
    } else if(utcHour >= 7 && utcHour < 12) {
        sessionName = "🟢 London Session Open";
    } else if(utcHour >= 12 && utcHour < 16) {
        sessionName = "🟢 London + NY Overlap";
    } else if(utcHour >= 16 && utcHour < 21) {
        sessionName = "🟢 New York Session Open";
    } else {
        sessionName = "🟡 Low Volume Period";
    }

    if(marketStatus) marketStatus.textContent = sessionName;
    if(cockpitSessionVal) cockpitSessionVal.textContent = sessionName;

    // Live UTC Clock update for Workspace Clock
    const wsUtc = document.getElementById("ws-utc-time");
    if(wsUtc) {
        wsUtc.textContent = now.toUTCString().split(" ")[4] + " UTC";
    }
}
    
function createTradingViewChart() {
    document.getElementById(TVManager.container).innerHTML = "";
    TVManager.widget = new TradingView.widget({
        autosize: true,
        symbol: TVManager.symbol,
        interval: TVManager.interval, 
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        enable_publishing: false,
        hide_side_toolbar: true,
        hide_top_toolbar: false,
        studies: [],
        container_id: TVManager.container
    });
    startCandleTimer(TVManager.interval);
}

function changeChart(symbol, btnElement) {
    TVManager.symbol = symbol;
    TVManager.interval = TVManager.interval || "15";
    TVManager.container = "practice-chart-container";

    if(btnElement) {
        const buttons = document.querySelectorAll('.practice-tabs button');
        buttons.forEach(btn => btn.classList.remove('active'));
        btnElement.classList.add('active');
    }
    createTradingViewChart();
}

function changeTimeframe(interval, btn){
    TVManager.interval = interval;
    document.getElementById("tvInterval").textContent =
        interval === "60" ? "1H" : interval === "240" ? "4H" : interval === "D" ? "1D" : interval + "m";

    document.querySelectorAll(".tf-btn").forEach(b => b.classList.remove("active"));
    if(btn) btn.classList.add("active");

    createTradingViewChart();
}

function refreshChart(){
    createTradingViewChart();
}

function changeAdvancedTimeframe(interval, btnElement) {
    TVManager.advancedInterval = interval;
    document.querySelectorAll(".advanced-tf-btn").forEach(btn => btn.classList.remove("active"));
    btnElement.classList.add("active");

    loadAdvancedChart();
    startAdvancedCandleTimer(interval);
}

function loadAdvancedChart() {
    TVManager.container = "advanced_modal_container";
    document.getElementById(TVManager.container).innerHTML = "";

    TVManager.widget = new TradingView.widget({
        autosize: true,
        symbol: TVManager.symbol,
        interval: TVManager.advancedInterval || "15",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        enable_publishing: false,
        allow_symbol_change: true,
        hide_side_toolbar: false,
        studies: [],
        container_id: TVManager.container
    });

    document.getElementById("advancedInterval").textContent =
        TVManager.advancedInterval === "60" ? "1H" : TVManager.advancedInterval === "240" ? "4H" : TVManager.advancedInterval === "D" ? "1D" : TVManager.advancedInterval + "m";
}

let advancedCandleCountdown;

function startAdvancedCandleTimer(interval) {
    clearInterval(advancedCandleCountdown);

    function updateTimer() {
        const now = new Date();
        let totalSeconds = 0;

        switch(interval){
            case "1": totalSeconds = 60 - now.getSeconds(); break;
            case "5": totalSeconds = ((5 - (now.getMinutes() % 5)) * 60) - now.getSeconds(); break;
            case "15": totalSeconds = ((15 - (now.getMinutes() % 15)) * 60) - now.getSeconds(); break;
            case "30": totalSeconds = ((30 - (now.getMinutes() % 30)) * 60) - now.getSeconds(); break;
            case "60": totalSeconds = ((60 - now.getMinutes()) * 60) - now.getSeconds(); break;
            default: totalSeconds = 0;
        }

        if(totalSeconds < 0) totalSeconds = 0;

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const timer = document.getElementById("advancedTimer");

        if(timer) {
            timer.textContent = String(minutes).padStart(2,"0") + ":" + String(seconds).padStart(2,"0");
        }
    }

    updateTimer();
    advancedCandleCountdown = setInterval(updateTimer, 1000);
}

function openChartModal(symbolTicker) {
    document.getElementById("modalChartTitle").innerText = "📊 Advanced Trading Workspace"; 
    const modal = document.getElementById("chartOverlayModal");
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    TVManager.symbol = symbolTicker;
    TVManager.container = "advanced_modal_container";
    loadAdvancedChart();
    startAdvancedCandleTimer(TVManager.advancedInterval || TVManager.interval);
}

function closeChartModal() {
    document.getElementById("chartOverlayModal").classList.remove("active");
    document.body.style.overflow = "auto";
    document.getElementById("advanced_modal_container").innerHTML = "";
}

/* TRADER'S COCKPIT & WORKSPACE UTILITIES */
function saveBiasPreference() {
    const sel = document.getElementById("cockpit-bias-select");
    if(sel) localStorage.setItem("trader_bias", sel.value);
}

function autoSaveNotes() {
    const txt = document.getElementById("trader-quick-notes");
    if(txt) localStorage.setItem("trader_quick_notes", txt.value);
    
    const status = document.getElementById("notes-save-status");
    if(status) {
        status.style.opacity = "1";
        setTimeout(() => { status.style.opacity = "0"; }, 1200);
    }
}

function autoSaveWpNotes() {
    const txt = document.getElementById("ws-quick-scratchpad");
    if(txt) localStorage.setItem("ws_quick_notes", txt.value);
}

function calculatePipValue() {
    const target = document.getElementById("pip-calculator");
    if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function calculatePositionSize() {
    const balance = prompt("Enter Account Balance ($):", "1000");
    const riskPct = prompt("Enter Risk Percentage (%):", "1");
    const stopLossPips = prompt("Enter Stop Loss (in Pips):", "20");

    if(balance && riskPct && stopLossPips) {
        const riskAmount = (parseFloat(balance) * (parseFloat(riskPct) / 100));
        const lotSize = (riskAmount / (parseFloat(stopLossPips) * 10)).toFixed(2);
        alert(`⚖️ Position Size Result:\n• Max Risk Amount: $${riskAmount.toFixed(2)}\n• Recommended Lot Size: ${lotSize} Lots`);
    }
}

function openJournal() {
    const savedNotes = localStorage.getItem("trader_quick_notes") || localStorage.getItem("ws_quick_notes") || "No trade observations logged yet.";
    alert(`📖 Active Journal Summary:\n\n${savedNotes}`);
}

/* DYNAMIC STUDENT DASHBOARD & PROGRESS ENGINE */
function updateDynamicProgress() {
    let completedLessons = 0;
    let totalQuizScore = 0;
    let totalQuizQuestions = 0;
    let quizzesTaken = 0;
    const totalLessons = 80;

    for(let i = 1; i <= totalLessons; i++) {
        const isPassed = localStorage.getItem(`lesson${i}_completed`) === "true";
        const score = localStorage.getItem(`lesson${i}_quizScore`);
        const total = localStorage.getItem(`lesson${i}_quizTotal`);

        if(isPassed) completedLessons++;

        if(score !== null && total !== null) {
            totalQuizScore += parseInt(score, 10);
            totalQuizQuestions += parseInt(total, 10);
            quizzesTaken++;
        }

        // Update Lesson Buttons for Lessons 1 through 5
        const btn = document.getElementById(`btn-lesson-${i}`);
        if(btn) {
            if(isPassed) {
                btn.className = "btn btn-primary btn-sm";
                btn.innerHTML = `✅ Completed (Review)`;
            } else if(i === 1 || localStorage.getItem(`lesson${i-1}_completed`) === "true") {
                btn.className = "btn btn-primary btn-sm";
                btn.innerHTML = `▶ Start Lesson`;
            } else {
                btn.className = "btn btn-outline btn-sm";
                btn.innerHTML = `🔒 Locked`;
            }
        }
    }

    const overallPercent = Math.round((completedLessons / totalLessons) * 100);
    const userXP = completedLessons * 100;
    
    // Dashboard Elements
    const circleFill = document.getElementById("dashboard-circle-fill");
    const dashPercentText = document.getElementById("dash-percentage-text");
    const dashHeading = document.getElementById("dash-status-heading");
    const dashDesc = document.getElementById("dash-status-desc");
    const dashLessons = document.getElementById("dash-lessons-count");
    const dashGrade = document.getElementById("dash-average-grade");

    if(dashPercentText) dashPercentText.innerText = `${overallPercent}%`;
    if(circleFill) {
        const dashOffset = 251 - (251 * overallPercent) / 100;
        circleFill.style.strokeDashoffset = dashOffset;
    }
    if(dashLessons) dashLessons.innerText = `${completedLessons} / ${totalLessons}`;

    if(quizzesTaken > 0 && totalQuizQuestions > 0 && dashGrade) {
        const avgGrade = Math.round((totalQuizScore / totalQuizQuestions) * 100);
        dashGrade.innerText = `${avgGrade}%`;
    }

    if(completedLessons > 0 && dashHeading) {
        dashHeading.innerText = `Lesson ${completedLessons + 1} Ready`;
        dashDesc.innerText = `Great momentum! Continue your study roadmap.`;
    }

    // Metrics Strip Updates
    const metricLessons = document.getElementById("stat-lessons-completed");
    const metricQuizzes = document.getElementById("stat-quizzes-taken");
    const userXpDisplay = document.getElementById("user-xp-display");

    if(metricLessons) metricLessons.innerText = `${completedLessons} / ${totalLessons}`;
    if(metricQuizzes) metricQuizzes.innerText = `${quizzesTaken} / ${totalLessons}`;
    if(userXpDisplay) userXpDisplay.innerText = `${userXP} XP`;
}

// Load Saved Data
function loadControlCenterData() {
    const savedBias = localStorage.getItem("trader_bias");
    if(savedBias) {
        const sel = document.getElementById("cockpit-bias-select");
        if(sel) sel.value = savedBias;
    }

    const savedNotes = localStorage.getItem("trader_quick_notes");
    if(savedNotes) {
        const txt = document.getElementById("trader-quick-notes");
        if(txt) txt.value = savedNotes;
    }

    const savedWpNotes = localStorage.getItem("ws_quick_notes");
    if(savedWpNotes) {
        const txtWp = document.getElementById("ws-quick-scratchpad");
        if(txtWp) txtWp.value = savedWpNotes;
    }
}

// Initialize Page Engines
document.addEventListener("DOMContentLoaded", () => {
    
    const defaultBtn = document.querySelector('.practice-tabs button.active');
    if(defaultBtn) {
        changeChart('OANDA:EURUSD', defaultBtn);
    }
    
    updateMarketStatus();
    setInterval(updateMarketStatus, 1000); // 1-second refresh for live clock
    updateDynamicProgress();
    loadControlCenterData();

    // EmailJS Initialization
    if(typeof emailjs !== "undefined") {
        emailjs.init({ publicKey: "UzmjQSq52HxcDuQTh" });
        
        const contactForm = document.getElementById("contact-form");
        const sendBtn = document.getElementById("sendBtn");

        if(contactForm) {
            contactForm.addEventListener("submit", function (e) {
                e.preventDefault();
                sendBtn.disabled = true;
                sendBtn.innerHTML = "Sending...";

                emailjs.sendForm("service_zq15cjw", "template_c3z3zpk", this)
                .then(() => {
                    if (typeof window.showToast === "function") {
                        window.showToast(
                            "Thank you for contacting Strativo Academy. We'll reply within 24 hours.",
                            "success",
                            { duration: 3500 }
                        );
                    } else {
                        const toast = document.getElementById("successToast");
                        if (toast) {
                            toast.classList.add("show");
                            setTimeout(() => {
                                toast.classList.remove("show");
                            }, 3500);
                        }
                    }
                    contactForm.reset();
                    sendBtn.disabled = false;
                    sendBtn.innerHTML = "Send Message";
                })
                .catch((error) => {
                    console.error(error);
                    alert("❌ Failed to send message. Please try again.");
                    sendBtn.disabled = false;
                    sendBtn.innerHTML = "Send Message";
                });
            });
        }
    }
});