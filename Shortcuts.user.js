// ==UserScript==
// @name         Shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds quick shortcuts
// @author       Assistant
// @match        *://*.modmedapp.com/*
// @grant        none
// ==/UserScript==

///
/// Raleigh office
///


(function() {
    'use strict';

    const locationShortcuts = [
        { label: "👤 Raleigh", search: "Raleigh, NC (3801)" }
    ];

    function injectlocationShortcuts() {
        // Find the dropdown panel (ng-select creates this globally when opened)
        const panel = document.querySelector('ng-dropdown-panel');
        if (!panel || panel.dataset.locationShortcutsAdded) return;

        // 1. Identify the active ng-select element
        const activeSelect = document.querySelector('ng-select.ng-select-opened');
        if (!activeSelect) return;

        // 2. Identify the field by Placeholder OR Label (Label is safer if a value is already picked)
        const placeholderEl = activeSelect.querySelector('.ng-placeholder');
        const placeholderText = placeholderEl ? placeholderEl.innerText.trim() : '';
        const labelText = activeSelect.closest('.form-group')?.querySelector('label')?.innerText || '';

        const isProviderField = placeholderText === "Search Location" || labelText.includes("Location");

        // 3. Exit if this isn't the "Search Provider" field
        if (!isProviderField) return;

        const scrollHost = panel.querySelector('.scroll-host');
        if (!scrollHost) return;

        // Create the shortcut container
        const shortcutWrapper = document.createElement('div');
        shortcutWrapper.className = 'custom-location-shortcuts';
        shortcutWrapper.style.cssText = `
            max-height: 200px;
            overflow-y: auto;
            border-bottom: 2px solid #673AB7;
            background: #fff;
        `;

        const header = document.createElement('div');
        header.style.cssText = 'color: #673AB7; font-weight: bold; padding: 8px; background: #f3e5f5; border-bottom: 1px solid #d1c4e9; position: sticky; top: 0; z-index: 10; font-size: 10px;';
        header.innerText = 'QUICK LOCATION';
        shortcutWrapper.appendChild(header);

        locationShortcuts.forEach(item => {
            const div = document.createElement('div');
            div.className = 'ng-option';
            div.style.cssText = 'background-color: #ffffff; border-bottom: 1px solid #eee; cursor: pointer; padding: 10px 15px;';
            div.innerHTML = `<span class="ng-option-label" style="font-weight: 500; color: #512DA8;">${item.label}</span>`;

            div.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();

                const input = activeSelect.querySelector('input[type="text"]');
                if (input) {
                    // 1. Reset and Focus
                    input.focus();
                    input.value = '';
                    input.dispatchEvent(new Event('input', { bubbles: true }));

                    // 2. Set the search value
                    input.value = item.search;
                    input.dispatchEvent(new Event('input', { bubbles: true }));

                    // 3. Poll for the result in the actual scroll-host
                    let attempts = 0;
                    const maxAttempts = 30; // 3 seconds total
                    const checkExist = setInterval(() => {
                        const currentPanel = document.querySelector('ng-dropdown-panel');
                        if (!currentPanel) {
                            clearInterval(checkExist);
                            return;
                        }

                        // Target ONLY the real options inside the scroll-host
                        const resultsContainer = currentPanel.querySelector('.scroll-host');
                        if (!resultsContainer) return;

                        const options = Array.from(resultsContainer.querySelectorAll('.ng-option'));
                        const target = options.find(opt =>
                            opt.innerText.toLowerCase().includes(item.search.toLowerCase())
                        );

                        if (target) {
                            clearInterval(checkExist);
                            // Angular ng-select listens for mousedown to handle selection
                            target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
                            target.click();
                        }

                        attempts++;
                        if (attempts >= maxAttempts) {
                            clearInterval(checkExist);
                            console.warn('Location shortcut: Could not find result for ' + item.search);
                        }
                    }, 100);
                }
            };
            shortcutWrapper.appendChild(div);
        });

        panel.insertBefore(shortcutWrapper, scrollHost);
        panel.dataset.locationShortcutsAdded = "true";
    }

    // Polling to detect when the dropdown opens
    setInterval(injectlocationShortcuts, 300);

///
/// Staff shortcuts for tasks
///
  
  (function() {
    'use strict';

    const staffShortcuts = [
        { label: "👤 Skylar Pritchett", search: "Pritchett, Skylar" },
        { label: "👤 Paige Barnes", search: "Barnes, Paige" },
        { label: "👤 Paige Kirk", search: "Kirk, Paige" },
        { label: "👤 Jimmy Ngo", search: "Ngo, Jimmy" },
        { label: "👤 Anjali Shah", search: "Shah, Anjali" },
        { label: "👤 Robbie Leonardo", search: "Leonardo, Robert" },
        { label: "👤 Madison Moraja", search: "Moraja, Madison" },
        { label: "👤 Jessica Richardson", search: "Richardson, Jessica" },
        { label: "👤 Joshua Robison", search: "Robison, Joshua" },
        { label: "👤 Grace Patel", search: "Patel, Grace" },
        { label: "👤 Sudhanshu Deshpande", search: "Deshpande, Sudhanshu" },
        { label: "👤 Ashton Andrews", search: "Andrews, Ashton" },
        { label: "👤 Sharon Higgs", search: "Higgs, Sharon" },
        { label: "👤 Meg Risinger", search: "Risinger, Meg" },
        { label: "👤 Sade Dennis", search: "Dennis, Sade" },
        { label: "👤 Shelia Hackley", search: "Hackley, Shelia" },
        { label: "👤 Deon Croom", search: "Croom, Deon" }
    ];

    function injectStaffShortcuts() {
        const panel = document.querySelector('ng-dropdown-panel');
        if (!panel || panel.dataset.staffShortcutsAdded) return;

        const activeSelect = document.querySelector('ng-select.ng-select-opened');
        if (!activeSelect || !activeSelect.closest('ema-staff-or-group-tasks-select')) return;

        const scrollHost = panel.querySelector('.scroll-host');
        if (!scrollHost) return;

        const shortcutWrapper = document.createElement('div');
        shortcutWrapper.className = 'custom-staff-shortcuts';
        shortcutWrapper.style.cssText = `
            max-height: 300px;
            overflow-y: auto;
            border-bottom: 2px solid #673AB7;
            background: #fff;
        `;

        const header = document.createElement('div');
        header.style.cssText = 'color: #673AB7; font-weight: bold; padding: 8px; background: #f3e5f5; border-bottom: 1px solid #d1c4e9; position: sticky; top: 0; z-index: 10; font-size: 10px;';
        header.innerText = 'QUICK STAFF SELECTION';
        shortcutWrapper.appendChild(header);

        staffShortcuts.forEach(item => {
            const div = document.createElement('div');
            // We use a custom class to avoid ng-select finding these as selectable options
            div.className = 'custom-shortcut-item';
            div.style.cssText = 'background-color: #ffffff; border-bottom: 1px solid #eee; cursor: pointer; padding: 8px 15px; transition: background 0.2s;';
            div.innerHTML = `<span style="font-weight: 500; color: #512DA8; font-size: 13px;">${item.label}</span>`;

            div.onmouseover = () => div.style.backgroundColor = '#f3e5f5';
            div.onmouseout = () => div.style.backgroundColor = '#ffffff';

            div.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();

                const input = activeSelect.querySelector('input[type="text"]');
                if (input) {
                    // 1. Reset and Focus
                    input.focus();
                    input.value = '';
                    input.dispatchEvent(new Event('input', { bubbles: true }));

                    // 2. Set the search value
                    input.value = item.search;
                    input.dispatchEvent(new Event('input', { bubbles: true }));

                    // 3. Poll for the result in the actual scroll-host
                    let attempts = 0;
                    const maxAttempts = 30; // 3 seconds total
                    const checkExist = setInterval(() => {
                        const currentPanel = document.querySelector('ng-dropdown-panel');
                        if (!currentPanel) {
                            clearInterval(checkExist);
                            return;
                        }

                        // Target ONLY the real options inside the scroll-host
                        const resultsContainer = currentPanel.querySelector('.scroll-host');
                        if (!resultsContainer) return;

                        const options = Array.from(resultsContainer.querySelectorAll('.ng-option'));
                        const target = options.find(opt =>
                            opt.innerText.toLowerCase().includes(item.search.toLowerCase())
                        );

                        if (target) {
                            clearInterval(checkExist);
                            // Angular ng-select listens for mousedown to handle selection
                            target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
                            target.click();
                        }

                        attempts++;
                        if (attempts >= maxAttempts) {
                            clearInterval(checkExist);
                            console.warn('Staff shortcut: Could not find result for ' + item.search);
                        }
                    }, 100);
                }
            };
            shortcutWrapper.appendChild(div);
        });

        panel.insertBefore(shortcutWrapper, scrollHost);
        panel.dataset.staffShortcutsAdded = "true";
    }

    // Polling to detect when the dropdown opens
    setInterval(injectStaffShortcuts, 300);

})();

})();


///
/// Staff shortcuts 
///

(function() {
    'use strict';

    const staffShortcuts = [
        { label: "👤 Lyndsye Sellars", search: "Sellars, Lyndsye" },
        { label: "👤 Skylar Pritchett", search: "Pritchett, Skylar" },
        { label: "👤 Paige Barnes", search: "Barnes, Paige" },
        { label: "👤 Paige Kirk", search: "Kirk, Paige" },
        { label: "👤 Jimmy Ngo", search: "Ngo, Jimmy" },
        { label: "👤 Anjali Shah", search: "Shah, Anjali" },
        { label: "👤 Robbie Leonardo", search: "Leonardo, Robert" },
        { label: "👤 Madison Moraja", search: "Moraja, Madison" },
        { label: "👤 Jessica Richardson", search: "Richardson, Jessica" },
        { label: "👤 Joshua Robison", search: "Robison, Joshua" },
        { label: "👤 Grace Patel", search: "Patel, Grace" },
        { label: "👤 Sudhanshu Deshpande", search: "Deshpande, Sudhanshu" },
        { label: "👤 Ashton Andrews", search: "Andrews, Ashton" },
        { label: "👤 Sharon Higgs", search: "Higgs, Sharon" },
        { label: "👤 Meg Risinger", search: "Risinger, Meg" },
        { label: "👤 Dan Nicks", search: "Nicks, Dan" },
        { label: "👤 Sade Dennis", search: "Dennis, Sade" },
        { label: "👤 Shelia Hackley", search: "Hackley, Shelia" },
        { label: "👤 Deon Croom", search: "Croom, Deon" }
    ];

    function injectStaffShortcuts() {
        const panel = document.querySelector('ng-dropdown-panel');
        if (!panel || panel.dataset.staffShortcutsAdded) return;

        const activeSelect = document.querySelector('ng-select.ng-select-opened');
        if (!activeSelect || !activeSelect.closest('ema-staff-or-group-select')) return;

        const scrollHost = panel.querySelector('.scroll-host');
        if (!scrollHost) return;

        const shortcutWrapper = document.createElement('div');
        shortcutWrapper.className = 'custom-staff-shortcuts';
        shortcutWrapper.style.cssText = `
            max-height: 300px;
            overflow-y: auto;
            border-bottom: 2px solid #673AB7;
            background: #fff;
        `;

        const header = document.createElement('div');
        header.style.cssText = 'color: #673AB7; font-weight: bold; padding: 8px; background: #f3e5f5; border-bottom: 1px solid #d1c4e9; position: sticky; top: 0; z-index: 10; font-size: 10px;';
        header.innerText = 'QUICK STAFF SELECTION';
        shortcutWrapper.appendChild(header);

        staffShortcuts.forEach(item => {
            const div = document.createElement('div');
            // We use a custom class to avoid ng-select finding these as selectable options
            div.className = 'custom-shortcut-item';
            div.style.cssText = 'background-color: #ffffff; border-bottom: 1px solid #eee; cursor: pointer; padding: 8px 15px; transition: background 0.2s;';
            div.innerHTML = `<span style="font-weight: 500; color: #512DA8; font-size: 13px;">${item.label}</span>`;

            div.onmouseover = () => div.style.backgroundColor = '#f3e5f5';
            div.onmouseout = () => div.style.backgroundColor = '#ffffff';

            div.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();

                const input = activeSelect.querySelector('input[type="text"]');
                if (input) {
                    // 1. Reset and Focus
                    input.focus();
                    input.value = '';
                    input.dispatchEvent(new Event('input', { bubbles: true }));

                    // 2. Set the search value
                    input.value = item.search;
                    input.dispatchEvent(new Event('input', { bubbles: true }));

                    // 3. Poll for the result in the actual scroll-host
                    let attempts = 0;
                    const maxAttempts = 30; // 3 seconds total
                    const checkExist = setInterval(() => {
                        const currentPanel = document.querySelector('ng-dropdown-panel');
                        if (!currentPanel) {
                            clearInterval(checkExist);
                            return;
                        }

                        // Target ONLY the real options inside the scroll-host
                        const resultsContainer = currentPanel.querySelector('.scroll-host');
                        if (!resultsContainer) return;

                        const options = Array.from(resultsContainer.querySelectorAll('.ng-option'));
                        const target = options.find(opt =>
                            opt.innerText.toLowerCase().includes(item.search.toLowerCase())
                        );

                        if (target) {
                            clearInterval(checkExist);
                            // Angular ng-select listens for mousedown to handle selection
                            target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
                            target.click();
                        }

                        attempts++;
                        if (attempts >= maxAttempts) {
                            clearInterval(checkExist);
                            console.warn('Staff shortcut: Could not find result for ' + item.search);
                        }
                    }, 100);
                }
            };
            shortcutWrapper.appendChild(div);
        });

        panel.insertBefore(shortcutWrapper, scrollHost);
        panel.dataset.staffShortcutsAdded = "true";
    }

    // Polling to detect when the dropdown opens
    setInterval(injectStaffShortcuts, 300);

})();


///
/// Providers
///

(function() {
    'use strict';

    const staffShortcuts = [
        { label: "👤 Patrick Dougherty", search: "Dougherty, Patrick" },
        { label: "👤 Kirk Woelffer", search: "Woelffer, Kirk" },
        { label: "👤 Douglas Smith", search: "Smith, Douglas" },
        { label: "👤 Jordan Meyers", search: "Meyers, Jordan" },
        { label: "👤 Alan Boehm", search: "Boehm, Alan" },
        { label: "👤 Charles Korba", search: "Korba, Charles" },
        { label: "👤 Daniel Narowitz", search: "Narowitz, Daniel" },
        { label: "👤 Amanda Arnold", search: "Arnold, Amanda" },
        { label: "👤 Stacey Batts", search: "Batts, Stacey" },
        { label: "👤 Asia Hall", search: "Hall, Asia" },
        { label: "👤 Mariah McFadden", search: "McFadden, Mariah" },
        { label: "👤 Tamara Volkonska", search: "Volkonska, Tamara" },
        { label: "👤 Lataijha Thomas", search: "Thomas, Lataijha" }
    ];

    function injectStaffShortcuts() {
        // Find the dropdown panel (ng-select creates this globally when opened)
        const panel = document.querySelector('ng-dropdown-panel');
        if (!panel || panel.dataset.staffShortcutsAdded) return;

        // 1. Identify the active ng-select element
        const activeSelect = document.querySelector('ng-select.ng-select-opened');
        if (!activeSelect) return;

        // 2. Identify the field by Placeholder OR Label (Label is safer if a value is already picked)
        const placeholderEl = activeSelect.querySelector('.ng-placeholder');
        const placeholderText = placeholderEl ? placeholderEl.innerText.trim() : '';
        const labelText = activeSelect.closest('.form-group')?.querySelector('label')?.innerText || '';

        const isProviderField = placeholderText === "Search Provider" || labelText.includes("Provider");

        // 3. Exit if this isn't the "Search Provider" field
        if (!isProviderField) return;

        const scrollHost = panel.querySelector('.scroll-host');
        if (!scrollHost) return;

        // Create the shortcut container
        const shortcutWrapper = document.createElement('div');
        shortcutWrapper.className = 'custom-staff-shortcuts';
        shortcutWrapper.style.cssText = `
            max-height: 200px;
            overflow-y: auto;
            border-bottom: 2px solid #673AB7;
            background: #fff;
        `;

        const header = document.createElement('div');
        header.style.cssText = 'color: #673AB7; font-weight: bold; padding: 10px; background: #f3e5f5; border-bottom: 1px solid #d1c4e9; position: sticky; top: 0; z-index: 10; font-size: 12px;';
        header.innerText = 'QUICK PROVIDERS';
        shortcutWrapper.appendChild(header);

        staffShortcuts.forEach(item => {
            const div = document.createElement('div');
            div.className = 'ng-option';
            div.style.cssText = 'background-color: #ffffff; border-bottom: 1px solid #eee; cursor: pointer; padding: 10px 15px;';
            div.innerHTML = `<span class="ng-option-label" style="font-weight: 500; color: #512DA8;">${item.label}</span>`;

            div.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();

                const input = activeSelect.querySelector('input[type="text"]');
                if (input) {
                    // 1. Reset and Focus
                    input.focus();
                    input.value = '';
                    input.dispatchEvent(new Event('input', { bubbles: true }));

                    // 2. Set the search value
                    input.value = item.search;
                    input.dispatchEvent(new Event('input', { bubbles: true }));

                    // 3. Poll for the result in the actual scroll-host
                    let attempts = 0;
                    const maxAttempts = 30; // 3 seconds total
                    const checkExist = setInterval(() => {
                        const currentPanel = document.querySelector('ng-dropdown-panel');
                        if (!currentPanel) {
                            clearInterval(checkExist);
                            return;
                        }

                        // Target ONLY the real options inside the scroll-host
                        const resultsContainer = currentPanel.querySelector('.scroll-host');
                        if (!resultsContainer) return;

                        const options = Array.from(resultsContainer.querySelectorAll('.ng-option'));
                        const target = options.find(opt =>
                            opt.innerText.toLowerCase().includes(item.search.toLowerCase())
                        );

                        if (target) {
                            clearInterval(checkExist);
                            // Angular ng-select listens for mousedown to handle selection
                            target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
                            target.click();
                        }

                        attempts++;
                        if (attempts >= maxAttempts) {
                            clearInterval(checkExist);
                            console.warn('Staff shortcut: Could not find result for ' + item.search);
                        }
                    }, 100);
                }
            };
            shortcutWrapper.appendChild(div);
        });

        panel.insertBefore(shortcutWrapper, scrollHost);
        panel.dataset.staffShortcutsAdded = "true";
    }

    // Polling to detect when the dropdown opens
    setInterval(injectStaffShortcuts, 300);

})();


///
/// Fax Options
///

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        // 1. Target container by tag name (more stable than ID)
        const container = document.querySelector('typeahead-container');
        if (!container) return;

        // 2. Find the target span
        const spans = container.querySelectorAll('li span');

        spans.forEach(span => {
            if (span.textContent.trim() === "Additional Testing") {
                // Change the visual text
                span.textContent = "Referral";

                // 3. Handle the click logic
                const parentLink = span.closest('a');
                if (parentLink && !parentLink.dataset.hooked) {
                    parentLink.addEventListener('mousedown', () => {
                        // Use the stable data-identifier for the input
                        const input = document.querySelector('input[data-identifier="create-task-details"]');
                        if (input) {
                            setTimeout(() => {
                                // Force the new value into the input
                                input.value = "Referral";
                                // Dispatch events so Angular detects the change
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                                // Blur to close the dropdown if it stays open
                                input.blur();
                            }, 10);
                        }
                    }, true);
                    parentLink.dataset.hooked = "true";
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        // 1. Target container by tag name (more stable than ID)
        const container = document.querySelector('typeahead-container');
        if (!container) return;

        // 2. Find the target span
        const spans = container.querySelectorAll('li span');

        spans.forEach(span => {
            if (span.textContent.trim() === "Benign") {
                // Change the visual text
                span.textContent = "Vascular";

                // 3. Handle the click logic
                const parentLink = span.closest('a');
                if (parentLink && !parentLink.dataset.hooked) {
                    parentLink.addEventListener('mousedown', () => {
                        // Use the stable data-identifier for the input
                        const input = document.querySelector('input[data-identifier="create-task-details"]');
                        if (input) {
                            setTimeout(() => {
                                // Force the new value into the input
                                input.value = "Vascular";
                                // Dispatch events so Angular detects the change
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                                // Blur to close the dropdown if it stays open
                                input.blur();
                            }, 10);
                        }
                    }, true);
                    parentLink.dataset.hooked = "true";
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        // 1. Target container by tag name (more stable than ID)
        const container = document.querySelector('typeahead-container');
        if (!container) return;

        // 2. Find the target span
        const spans = container.querySelectorAll('li span');

        spans.forEach(span => {
            if (span.textContent.trim() === "Discuss at Follow-up") {
                // Change the visual text
                span.textContent = "Records Request";

                // 3. Handle the click logic
                const parentLink = span.closest('a');
                if (parentLink && !parentLink.dataset.hooked) {
                    parentLink.addEventListener('mousedown', () => {
                        // Use the stable data-identifier for the input
                        const input = document.querySelector('input[data-identifier="create-task-details"]');
                        if (input) {
                            setTimeout(() => {
                                // Force the new value into the input
                                input.value = "Records Request";
                                // Dispatch events so Angular detects the change
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                                // Blur to close the dropdown if it stays open
                                input.blur();
                            }, 10);
                        }
                    }, true);
                    parentLink.dataset.hooked = "true";
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        // 1. Target container by tag name (more stable than ID)
        const container = document.querySelector('typeahead-container');
        if (!container) return;

        // 2. Find the target span
        const spans = container.querySelectorAll('li span');

        spans.forEach(span => {
            if (span.textContent.trim() === "Follow-up Appt") {
                // Change the visual text
                span.textContent = "PT Plan of Care";

                // 3. Handle the click logic
                const parentLink = span.closest('a');
                if (parentLink && !parentLink.dataset.hooked) {
                    parentLink.addEventListener('mousedown', () => {
                        // Use the stable data-identifier for the input
                        const input = document.querySelector('input[data-identifier="create-task-details"]');
                        if (input) {
                            setTimeout(() => {
                                // Force the new value into the input
                                input.value = "PT Plan of Care";
                                // Dispatch events so Angular detects the change
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                                // Blur to close the dropdown if it stays open
                                input.blur();
                            }, 10);
                        }
                    }, true);
                    parentLink.dataset.hooked = "true";
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        // 1. Target container by tag name (more stable than ID)
        const container = document.querySelector('typeahead-container');
        if (!container) return;

        // 2. Find the target span
        const spans = container.querySelectorAll('li span');

        spans.forEach(span => {
            if (span.textContent.trim() === "Normal") {
                // Change the visual text
                span.textContent = "Care Considerations";

                // 3. Handle the click logic
                const parentLink = span.closest('a');
                if (parentLink && !parentLink.dataset.hooked) {
                    parentLink.addEventListener('mousedown', () => {
                        // Use the stable data-identifier for the input
                        const input = document.querySelector('input[data-identifier="create-task-details"]');
                        if (input) {
                            setTimeout(() => {
                                // Force the new value into the input
                                input.value = "Care Considerations";
                                // Dispatch events so Angular detects the change
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                                // Blur to close the dropdown if it stays open
                                input.blur();
                            }, 10);
                        }
                    }, true);
                    parentLink.dataset.hooked = "true";
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();


(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        // 1. Target container by tag name (more stable than ID)
        const container = document.querySelector('typeahead-container');
        if (!container) return;

        // 2. Find the target span
        const spans = container.querySelectorAll('li span');

        spans.forEach(span => {
            if (span.textContent.trim() === "No Further Treatment") {
                // Change the visual text
                span.textContent = "Disability Paperwork";

                // 3. Handle the click logic
                const parentLink = span.closest('a');
                if (parentLink && !parentLink.dataset.hooked) {
                    parentLink.addEventListener('mousedown', () => {
                        // Use the stable data-identifier for the input
                        const input = document.querySelector('input[data-identifier="create-task-details"]');
                        if (input) {
                            setTimeout(() => {
                                // Force the new value into the input
                                input.value = "Disability Paperwork";
                                // Dispatch events so Angular detects the change
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                                // Blur to close the dropdown if it stays open
                                input.blur();
                            }, 10);
                        }
                    }, true);
                    parentLink.dataset.hooked = "true";
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        // 1. Target container by tag name (more stable than ID)
        const container = document.querySelector('typeahead-container');
        if (!container) return;

        // 2. Find the target span
        const spans = container.querySelectorAll('li span');

        spans.forEach(span => {
            if (span.textContent.trim() === "PCP") {
                // Change the visual text
                span.textContent = "History & Physical";

                // 3. Handle the click logic
                const parentLink = span.closest('a');
                if (parentLink && !parentLink.dataset.hooked) {
                    parentLink.addEventListener('mousedown', () => {
                        // Use the stable data-identifier for the input
                        const input = document.querySelector('input[data-identifier="create-task-details"]');
                        if (input) {
                            setTimeout(() => {
                                // Force the new value into the input
                                input.value = "History & Physical";
                                // Dispatch events so Angular detects the change
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                                // Blur to close the dropdown if it stays open
                                input.blur();
                            }, 10);
                        }
                    }, true);
                    parentLink.dataset.hooked = "true";
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        // 1. Target container by tag name (more stable than ID)
        const container = document.querySelector('typeahead-container');
        if (!container) return;

        // 2. Find the target span
        const spans = container.querySelectorAll('li span');

        spans.forEach(span => {
            if (span.textContent.trim() === "Procedure") {
                // Change the visual text
                span.textContent = "Radiology";

                // 3. Handle the click logic
                const parentLink = span.closest('a');
                if (parentLink && !parentLink.dataset.hooked) {
                    parentLink.addEventListener('mousedown', () => {
                        // Use the stable data-identifier for the input
                        const input = document.querySelector('input[data-identifier="create-task-details"]');
                        if (input) {
                            setTimeout(() => {
                                // Force the new value into the input
                                input.value = "Radiology";
                                // Dispatch events so Angular detects the change
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                                // Blur to close the dropdown if it stays open
                                input.blur();
                            }, 10);
                        }
                    }, true);
                    parentLink.dataset.hooked = "true";
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        // 1. Target container by tag name (more stable than ID)
        const container = document.querySelector('typeahead-container');
        if (!container) return;

        // 2. Find the target span
        const spans = container.querySelectorAll('li span');

        spans.forEach(span => {
            if (span.textContent.trim() === "Referring Provider") {
                // Change the visual text
                span.textContent = "Progress Report";

                // 3. Handle the click logic
                const parentLink = span.closest('a');
                if (parentLink && !parentLink.dataset.hooked) {
                    parentLink.addEventListener('mousedown', () => {
                        // Use the stable data-identifier for the input
                        const input = document.querySelector('input[data-identifier="create-task-details"]');
                        if (input) {
                            setTimeout(() => {
                                // Force the new value into the input
                                input.value = "Progress Report";
                                // Dispatch events so Angular detects the change
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                                // Blur to close the dropdown if it stays open
                                input.blur();
                            }, 10);
                        }
                    }, true);
                    parentLink.dataset.hooked = "true";
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();


(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        // 1. Target container by tag name (more stable than ID)
        const container = document.querySelector('typeahead-container');
        if (!container) return;

        // 2. Find the target span
        const spans = container.querySelectorAll('li span');

        spans.forEach(span => {
            if (span.textContent.trim() === "Results") {
                // Change the visual text
                span.textContent = "Pathology Report";

                // 3. Handle the click logic
                const parentLink = span.closest('a');
                if (parentLink && !parentLink.dataset.hooked) {
                    parentLink.addEventListener('mousedown', () => {
                        // Use the stable data-identifier for the input
                        const input = document.querySelector('input[data-identifier="create-task-details"]');
                        if (input) {
                            setTimeout(() => {
                                // Force the new value into the input
                                input.value = "Pathology Report";
                                // Dispatch events so Angular detects the change
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                                // Blur to close the dropdown if it stays open
                                input.blur();
                            }, 10);
                        }
                    }, true);
                    parentLink.dataset.hooked = "true";
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
