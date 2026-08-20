/* ==========================================================================
   STRATIVO ACADEMY
   FIRST-VISIT RISK DISCLOSURE GATE
   Version 2.0
   ========================================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", function () {

    /* ======================================================================
       CONFIGURATION
       ====================================================================== */

    const ACCEPTANCE_KEY = "strativo_risk_accepted";


    /* ======================================================================
       CURRENT PAGE
       ====================================================================== */

    const currentPath =
        window.location.pathname.toLowerCase();

    const isRiskDisclosurePage =
        currentPath.includes("risk-disclosure.html");

    const isPrivacyPolicyPage =
        currentPath.includes("privacy-policy.html");

        const isTermsPage =
    currentPath.includes("terms.html");

    /* ======================================================================
       CHECK ACCEPTANCE
       ====================================================================== */

    function hasAcceptedRiskDisclosure() {

        return (
            localStorage.getItem(ACCEPTANCE_KEY) === "true"
        );

    }


    /* ======================================================================
       SAVE ACCEPTANCE
       ====================================================================== */

    function acceptRiskDisclosure() {

        localStorage.setItem(
            ACCEPTANCE_KEY,
            "true"
        );

    }


    /* ======================================================================
       RISK DISCLOSURE PAGE
       ====================================================================== */

    const checkbox =
        document.getElementById(
            "risk-disclosure-checkbox"
        );

    const continueBtn =
        document.getElementById(
            "risk-disclosure-continue"
        );


    if (checkbox && continueBtn) {

        /*
         * IMPORTANT:
         * The Continue button starts disabled.
         */

        continueBtn.disabled =
            !checkbox.checked;


        checkbox.addEventListener(
            "change",
            function () {

                continueBtn.disabled =
                    !this.checked;

            }
        );


        continueBtn.addEventListener(
            "click",
            function () {

                if (!checkbox.checked) {

                    return;

                }


                /*
                 * Save acknowledgement
                 */

                acceptRiskDisclosure();


                /*
                 * Return to homepage
                 */

                if (
                    window.StrativoRoutes &&
                    window.StrativoRoutes.home
                ) {

                    window.location.href =
                        "../" +
                        window.StrativoRoutes.home;

                } else {

                    window.location.href =
                        "../index.html";

                }

            }
        );

    }


    /* ======================================================================
       FIRST-VISIT GATE
       ====================================================================== */

    /*
     * Legal pages must remain accessible even before acceptance.
     *
     * This prevents the disclosure page from blocking itself.
     */

   if (
    isRiskDisclosurePage ||
    isPrivacyPolicyPage ||
    isTermsPage
) {

    return;

}

    

    /*
     * Returning visitor:
     *
     * Do nothing.
     * The Academy loads normally.
     */

    if (hasAcceptedRiskDisclosure()) {

        return;

    }


    /*
     * New visitor:
     *
     * Show the mandatory disclosure modal.
     */

    showFirstVisitDisclosure();


    /* ======================================================================
       FIRST-VISIT DISCLOSURE MODAL
       ====================================================================== */

    function showFirstVisitDisclosure() {

        /*
         * Prevent duplicate modal
         */

        if (
            document.getElementById(
                "strativo-first-visit-disclosure"
            )
        ) {

            return;

        }


        /* ==============================================================
           OVERLAY
           ============================================================== */

        const overlay =
            document.createElement("div");

        overlay.id =
            "strativo-first-visit-disclosure";

        overlay.className =
            "strativo-disclaimer-overlay";


        /* ==============================================================
           MODAL
           ============================================================== */

        const modal =
            document.createElement("div");

        modal.className =
            "strativo-disclaimer-modal";


        /* ==============================================================
           ROUTES
           ============================================================== */

        const riskDisclosurePath =
            (
                window.StrativoRoutes &&
                window.StrativoRoutes.legal &&
                window.StrativoRoutes.legal.riskDisclosure
            )
                ? window.StrativoRoutes.legal.riskDisclosure
                : "legal/risk-disclosure.html";


        const privacyPolicyPath =
            (
                window.StrativoRoutes &&
                window.StrativoRoutes.legal &&
                window.StrativoRoutes.legal.privacyPolicy
            )
                ? window.StrativoRoutes.legal.privacyPolicy
                : "legal/privacy-policy.html";


        /* ==============================================================
           MODAL CONTENT
           ============================================================== */

        modal.innerHTML = `

            <div class="strativo-disclaimer-icon">

                <i
                    class="fas fa-triangle-exclamation"
                    aria-hidden="true"
                ></i>

            </div>


            <h2>
                Important Risk Disclosure
            </h2>


            <p>
                Welcome to Strativo Academy.
                Strativo Academy is an educational platform focused
                on Forex and financial-market education.
            </p>


            <p>
                We do not provide personalized financial advice,
                investment recommendations, or guarantees of trading
                results. Trading financial markets involves significant
                risk, and losses are possible.
            </p>


            <p>
                Please read our
                <a
                    href="${riskDisclosurePath}"
                >
                    Risk Disclosure
                </a>

                and

                <a
                    href="${privacyPolicyPath}"
                >
                    Privacy Policy
                </a>

                before continuing.
            </p>


            <button
                type="button"
                id="strativo-open-risk-disclosure"
                class="strativo-disclaimer-accept"
            >

                Read Risk Disclosure

                <i
                    class="fas fa-arrow-right"
                    aria-hidden="true"
                ></i>

            </button>

        `;


        /* ==============================================================
           ADD TO PAGE
           ============================================================== */

        overlay.appendChild(modal);

        document.body.appendChild(overlay);


        /*
         * Prevent background scrolling.
         */

        document.body.style.overflow =
            "hidden";


        /* ==============================================================
           RISK DISCLOSURE BUTTON
           ============================================================== */

        const riskButton =
            document.getElementById(
                "strativo-open-risk-disclosure"
            );


        if (riskButton) {

            riskButton.addEventListener(
                "click",
                function () {

                    window.location.href =
                        riskDisclosurePath;

                }
            );

        }

    }

});