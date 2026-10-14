// ==UserScript==
// @name         Highlight Appointment by type
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Highlight specific appointment types (salon, laser, new patient)
// @author       Assistant
// @match        *://*/*
// @grant        none
// ==/UserScript==

// New patient

(function() {
    'use strict';
    const targetColor = '#e6e7ff';
    const selector = '.col-md-8.appt-row-center';

    const applyRule = () => {
        document.querySelectorAll(selector).forEach(el => {
            const divs = Array.from(el.querySelectorAll('div.ng-star-inserted'));
            const hasNewPatient = divs.some(div => {
                const span = div.querySelector('span');
                return span && span.textContent.trim() === 'New Patient';
            });

            if (hasNewPatient) {
                el.style.setProperty('background-color', targetColor, 'important');
            } else if (el.style.backgroundColor === 'rgb(230, 231, 255)') {
                el.style.removeProperty('background-color');
            }
        });
    };

    // Initial run
    applyRule();

    // Use a MutationObserver to handle dynamic content
    const observer = new MutationObserver(applyRule);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
})();


// Salon & Laser


(function() {
    'use strict';

    const YELLOW_COLOR = '#fcf1d2';
    const TARGET_TYPES = ['Salon', 'Laser 30'];

    function applyStyles() {
        const rows = document.querySelectorAll('.col-md-8.appt-row-center');

        rows.forEach(row => {
            // Check the text of the entire row (including the parent if needed)
            const parentRow = row.closest('.row.appt-row') || row.parentElement;
            const rowText = parentRow ? parentRow.innerText : row.innerText;

            // If any of our target types are found in the row text
            const isMatch = TARGET_TYPES.some(type => rowText.includes(type));

            if (isMatch) {
                row.style.backgroundColor = YELLOW_COLOR;
            } else if (row.style.backgroundColor === 'rgb(252, 241, 210)') {
                // Optional: remove styling if the type changes (e.g., in a single-page app)
                row.style.backgroundColor = '';
            }
        });
    }

    // Run once on load
    applyStyles();

    // Set up a MutationObserver to watch for changes as the page loads new data
    const observer = new MutationObserver(() => {
        applyStyles();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
