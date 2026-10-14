// ==UserScript==
// @name         Insurance Payer Shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Grouped Insurance Shortcuts with Headers
// @author       Assistant
// @match        https://usfas.modmedapp.com/ema/web/practice/staff/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const shortcutGroups = [
        {
            category: "Commercial",
            items: [
                { label: "UHC", search: "United HealthCare of all states" },
                { label: "UMR", search: "UMR formerly Commonwealth Administrators, LLC" },
                { label: "BCBS", search: "Blue Cross Blue Shield of North Carolina" },
                { label: "Aetna", search: "Aetna Health Plans" },
                { label: "Cigna", search: "Cigna", targetIndex: 4},
                { label: "Humana", search: "Humana Health Plan" },
                { label: "Wellcare", search: "Wellcare of NC" },
                { label: "Healthspring", search: "Healthspring" },                

            ]
        },
                {
            category: "Military",
            items: [
                { label: "Tricare East", search: "Tricare East Region" },
                { label: "Tricare Prime", search: "Tricare Prime" },
                { label: "Tricare for Life", search: "Tricare for Life" },
                { label: "VA Community Care", search: "VA Community Care Network VACCN" },
                { label: "CHAMPVA", search: "CHAMPVA" },
            ]
        },
        {
            category: "Medicaid",
            items: [
                { label: "Medicaid", search: "Medicaid of North Carolina" },
                { label: "Healthy Blue", search: "Healthy Blue NC" },
                { label: "UHC Community Plan", search: "United Healthcare Community Plan UHC" },
                { label: "Carolina Complete Health", search: "Carolina Complete Health" },
                { label: "AmeriHealth", search: "AmeriHealth Caritas of NC" },
            ]
        },
        {
            category: "Medicare & Supplements",
            items: [
                { label: "Medicare", search: "Medicare of North Carolina - J11" },
                { label: "UHC AARP Medicare Supplement", search: "AARP Medicare Supplement/Fixed Indemnity by UHC" },
                { label: "Aetna Senior Supplement", search: "Aetna Senior Supplemental Insurance" }
            ]
        }
    ];

    function injectShortcuts() {
        const payerSelector = document.querySelector('payer-selector#payerSelector');
        if (payerSelector && !document.getElementById('payer-shortcuts-container')) {
            payerSelector.style.display = 'block';

            const container = document.createElement('div');
            container.id = 'payer-shortcuts-container';
            container.style.cssText = 'margin-top: 10px; width: 100%;';

            shortcutGroups.forEach(group => {
                // 1. Create Header
                const header = document.createElement('div');
                header.innerText = group.category;
                header.style.cssText = 'font-weight: bold; font-size: 11px; color: #555; text-transform: uppercase; margin-top: 8px; border-bottom: 1px solid #ddd; padding-bottom: 2px; margin-bottom: 6px;';
                container.appendChild(header);

                // 2. Create Button Row
                const row = document.createElement('div');
                row.style.cssText = 'display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px;';

                group.items.forEach(item => {
                    const btn = document.createElement('button');
                    btn.innerText = item.label;
                    btn.className = 'btn btn-xs btn-default';
                    btn.style.cssText = 'border: 1px solid #ccc; cursor: pointer; white-space: nowrap;';
                    btn.type = 'button';

                    btn.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const toggle = payerSelector.querySelector('.ui-select-toggle');
                        if (toggle) toggle.click();

                        setTimeout(() => {
                            const searchInput = payerSelector.querySelector('input[type="search"]');
                            if (searchInput) {
                                searchInput.value = item.search;
                                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                                searchInput.dispatchEvent(new Event('change', { bubbles: true }));

                                let attempts = 0;
                                const check = setInterval(() => {
                                    const choices = payerSelector.querySelectorAll('.ui-select-choices-row');
                                    if (choices.length > 0) {
                                        let targetChoice;
                                        if (item.targetIndex !== undefined) {
                                            targetChoice = choices[item.targetIndex];
                                        } else {
                                            for (let choice of choices) {
                                                if (choice.innerText.includes(item.search)) {
                                                    targetChoice = choice;
                                                    break;
                                                }
                                            }
                                        }
                                        if (targetChoice) {
                                            clearInterval(check);
                                            const inner = targetChoice.querySelector('.ui-select-choices-row-inner') || targetChoice;
                                            ['mousedown', 'mouseup', 'click'].forEach(type => {
                                                inner.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true }));
                                            });
                                            return;
                                        }
                                    }
                                    if (++attempts > 40) clearInterval(check);
                                }, 200);
                            }
                        }, 200);
                    };
                    row.appendChild(btn);
                });
                container.appendChild(row);
            });
            payerSelector.appendChild(container);
        }
    }

    const observer = new MutationObserver(injectShortcuts);
    observer.observe(document.body, { childList: true, subtree: true });
    injectShortcuts();
})();
