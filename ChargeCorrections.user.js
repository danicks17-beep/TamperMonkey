// ==UserScript==
// @name         OTC Product Selection
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Performs a REAL selection of shortcuts strictly inside Product/Charge/Code dropdowns.
// @author       Assistant
// @match        *://*.modmedapp.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const shortcuts = [
        { label: "⭐ Pedi C", code: "NOTCPediC", price: "75.00", desc: "Pedi-C" },
        { label: "⭐ Pedi A", code: "NOTCPecliA", price: "54.00", desc: "Pedi-A" },
        { label: "⭐ Tip (for Salon or Laser)", code: "NOTCTIP", desc: "Tip" },
        { label: "⭐ Laser Package (6)", code: "NC-NOTCLS6PKG", price: "745.00", desc: "6 Laser Package" },
        { label: "⭐ Maintenance Laser Individual", code: "NC-NOTCLS50", price: "75.00", desc: "Maintenance Laser Individual" },
        { label: "⭐ Individual Laser Treatment", code: "NC-NOTCLSIND", price: "155.00", desc: "Individual Laser Treatment" },
        { label: "⭐ Selfpay Orthotic", code: "OTC-1258", price: "625.00", desc: "Selfpay Orthotic" },
        { label: "⭐ 2nd Pair Orthotics", code: "OTC-1259", price: "415.00", desc: "2nd Pair Orthotics" },
        { label: "⭐ Post-Op Kit", code: "OTC-0010", price: "19.50", desc: "Amerigel Post-Op" },
        { label: "⭐ Clarus Antifungal Solution", code: "OTC-0071", price: "41.83", desc: "Clarus Antifungal Solution" },
        { label: "⭐ Kera Nail Gel", code: "OTC-0216", price: "53.63", desc: "Kera Nail Gel" },
        { label: "⭐ VerruStat", code: "OTC-0404", price: "34.27", desc: "VerruStat Liquid Wart Solution" },
        { label: "⭐ Tolcylen Nail Solution", code: "OTC-0028", price: "75.00", desc: "Tolcylen Nail Solution" },
        { label: "⭐ Tolcylen Soak (5 pack)", code: "OTC-0368", price: "63.28", desc: "Tolcylen Soak (5 pack)" },
        { label: "⭐ Tolcylen Soak (Small bag / 7 soaks)", code: "OTC-0369", price: "74.25", desc: "Tolcylen Soak (Small bag / 7 soaks)" },
        { label: "⭐ Tolcylen Soak (Large bag)", code: "OTC-0370", price: "97.60", desc: "Tolcylen Soak (Large bag)" },
        { label: "⭐ Kera-42 Cream", code: "OTC-0390", price: "48.26", desc: "Kera-42 Cream" },
        { label: "⭐ Clean Sweep", code: "OTC-0338", price: "17.16", desc: "Clean Sweep" },
        { label: "⭐ Kamea 20", code: "OTC-0191", price: "28.96", desc: "Kamea 20" },
        { label: "⭐ Kamea G", code: "OTC-1257", price: "28.96", desc: "Kamea G" },
        { label: "⭐ Fungi Foam", code: "OTC-0027", price: "46.12", desc: "Fungi Foam 2.5 oz" },
        { label: "⭐ CN-U Clear Nail Polish", code: "OTC-0217", price: "40.76", desc: "CN-U Clear Nail Polish" },
        { label: "⭐ Clarus Tolnaftate Cream", code: "OTC-0025", price: "46.00", desc: "Clarus Tolnaftate Cream 1%" },
        { label: "⭐ Redi-Thotics Comfort", code: "OTC-0282", price: "56.84", desc: "Redi-Thotics Comfort" },
        { label: "⭐ Redi-Thotics Max", code: "OTC-0282", price: "56.84", desc: "Redi-Thotics Max" },
        { label: "⭐ Redi-Thotics Flex", code: "OTC-0282", price: "56.84", desc: "Redi-Thotics Flex" },
        { label: "⭐ Redi-thotics Freedom", code: "OTC-0282", price: "56.84", desc: "Redi-thotics Freedom" },
        { label: "⭐ Redi-Thotics 3/4", code: "OTC-0282", price: "45.05", desc: "Redi-Thotics 3/4" },
        { label: "⭐ Compression Socks", code: "OTC-0078", price: "39.68", desc: "Compression Socks" },
        { label: "⭐ Jills Hammer Toe Regulator Single", code: "OTC-0053", price: "12.87", desc: "Jill's Hammer Toe Regulator Single Toe" },
        { label: "⭐ Jills Hammer Toe Regulator Double", code: "OTC-0113", price: "13.94", desc: "Jill's Hammer Toe Regulator Double Toe" },
        { label: "⭐ Jills Gels Corn Pads", code: "OTC-0084", price: "8.58", desc: "Jills Gels Corn Pads Felt 20/Bx" },
        { label: "⭐ Jills Gel Dancer Pads", code: "OTC-0292", price: "15.02", desc: "Jills Gel Dancer Pads 2/Bx" },
        { label: "⭐ Jills Gel Bunion Cushion", code: "OTC-0055", price: "12.87", desc: "Jill's Gel Bunion Cushion" },
        { label: "⭐ Jills Felt 1/4 Heel Pad J-22", code: "OTC-1256", price: "2.15", desc: "Jill's Felt Heel Pad 1/4\" J-22" },
        { label: "⭐ Jills Ball of Foot Gel Cushions", code: "OTC-0042", price: "6.44", desc: "Jill's Ball of Foot Gel Cushions" },
        { label: "⭐ Jills U-shaped Gel Callus", code: "OTC-0062", price: "12.87", desc: "Jill's U-shaped Gel Callus Cushions" },
        { label: "⭐ Jills Callus Pads 12/Bx", code: "OTC-0063", price: "7.51", desc: "Jill's Callus Pads 12/Bx" },
        { label: "⭐ Jills Gel Tailor's bunion", code: "OTC-0054", price: "12.87", desc: "Jill's Gel Tailor's bunion Pad" },
        { label: "⭐ Jills Wrap Strap 2/pkg", code: "OTC-0366", price: "12.87", desc: "Jill's Wrap Strap 2/pkg" },
        { label: "⭐ Jills Achilles Heel Pad", code: "OTC-0002", price: "46.12", desc: "Jill's Achilles Heel Pad" },
        { label: "⭐ Jills Arch Binder", code: "OTC-0037", price: "12.87", desc: "Jill's Arch Binder" },
        { label: "⭐ Jills Gel Bunion Sleeve", code: "OTC-0145", price: "33.25", desc: "Jill's Gel Bunion Sleeve" },
        { label: "⭐ Jills Large Ribbed Tubing", code: "OTC-0152", price: "30.03", desc: "Jill's Large Ribbed Tubing 2/pkg" },
        { label: "⭐ Jills Toe Buddy", code: "OTC-0345", price: "7.51", desc: "Jill's Gel Buddy Splint" },
        { label: "⭐ Jills U shaped Heel Spur", code: "OTC-0179", price: "2.15", desc: "Jill's U shaped Heel Spur" },
        { label: "⭐ Jills Felt Dancer's Pads", code: "OTC-0099", price: "2.15", desc: "Jill's Felt 1/8\" Dancer's Pads" },
        { label: "⭐ Jills U-Shaped Lesion Pads", code: "OTC-0195", price: "5.36", desc: "Jill's U-Shaped Lesion Pads" },
        { label: "⭐ Jills Kidney Moleskin", code: "OTC-0215", price: "1.77", desc: "Jill's 3 1/2 Kidney Moleskin" },
        { label: "⭐ Jills All Gel Toe Cap", code: "OTC-0006", price: "16.09", desc: "Jill's All Gel Toe Cap" },
        { label: "⭐ Curad Band Aids", code: "OTC-0045", price: "10.73", desc: "Curad Band Aids Box" },
        { label: "⭐ Medline Felt Roll", code: "OTC-0120", price: "7.51", desc: "Medline Felt Roll 1/4\"" },
        { label: "⭐ Foam Tubing", code: "OTC-0376", price: "3.75", desc: "Foam Tubing" },
        { label: "⭐ Podiatrists Choice", code: "OTC-0043", price: "5.79", desc: "Podiatrists Choice Cushion" },
        { label: "⭐ WonderZorb Gel", code: "OTC-0092", price: "42.90", desc: "WonderZorb Gel Heel Cushion" },
        { label: "⭐ Medline PF Sleeve", code: "OTC-0257", price: "33.25", desc: "Medline Plantar Fasciitis Sleeve" },
        { label: "⭐ Wrymark Carbon Plate", code: "OTC-0435", price: "78.29", desc: "Carbon Graphite Plate" },
        { label: "⭐ TAS Toe Splint Darco", code: "OTC-0107", price: "28.96", desc: "TAS Toe Alignment Splint" },
        { label: "⭐ PRP Injection", code: "PRPINJ2", price: "950.00", desc: "PRP Injection" },
        { label: "⭐ Post Op Shoe", code: "OTC-0302", price: "30.00", desc: "Post Op Shoe" }
    ];

    function isProductSelector(selectElem) {
        if (!selectElem) return false;

        // Check 1: Dedicated Product Selector component tag
        if (selectElem.closest('mmpm-charge-product-selector')) return true;

        // Check 2: Preceding label or column context
        const parentContainer = selectElem.parentElement || selectElem.closest('.form-group, td, th, div');
        if (parentContainer) {
            const labelText = parentContainer.innerText || '';
            if (labelText.includes('Product') || labelText.includes('Charge') || labelText.includes('Code')) {
                return true;
            }
        }

        // Check 3: FormControlName / Data attributes
        const input = selectElem.querySelector('input');
        if (input) {
            const attr = (input.getAttribute('formcontrolname') || input.getAttribute('data-identifier') || '').toLowerCase();
            if (attr.includes('product') || attr.includes('charge') || attr.includes('code')) return true;
        }

        return false;
    }

    function injectShortcuts() {
        const panel = document.querySelector('ng-dropdown-panel');
        if (!panel || panel.dataset.shortcutsAdded) return;

        const activeSelect = document.querySelector('ng-select.ng-select-opened');

        // Strict Check: Only run injection if active select is a Product/Charge selector
        if (!activeSelect || !isProductSelector(activeSelect)) return;

        const currentRow = activeSelect.closest('tr') || activeSelect.closest('.ema-form-row') || activeSelect.closest('.charge-row');
        const scrollHost = panel.querySelector('.scroll-host');
        if (!scrollHost) return;
                if (scrollHost) {
            scrollHost.style.maxHeight = '120px';
            scrollHost.style.overflowY = 'auto';
        }

        // Inside injectShortcuts() function:

        // 1. Make OTC list longer (e.g., 300px)
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'max-height: 300px; overflow-y: auto; border-bottom: 1px solid #ccc; background: transparent;';

        // ... (rest of your shortcut injection code)

        const header = document.createElement('div');
        // Matches .ng-optgroup and the purple label inside
        header.className = 'ng-option-disabled ng-optgroup';
        header.style.cssText = 'color: rgb(80, 45, 127); font-weight: 700; padding: 8px 10px; font-size: 13px; cursor: default; user-select: none;';
        header.innerText = 'OTC Shortcuts';
        wrapper.appendChild(header);

        shortcuts.forEach(item => {
            const div = document.createElement('div');
            div.className = 'ng-option custom-shortcut-option';
            div.style.cssText = 'border-bottom: 1px solid #f0f0f0; cursor: pointer; padding: 8px 12px; font-size: 13px;';
            div.innerHTML = `<span style="font-weight: 500; color: #1565c0;">${item.label}</span>`;

            div.onmousedown = (e) => {
                e.preventDefault();
                e.stopPropagation();

                const input = activeSelect.querySelector('input[type="text"]');
                if (input) {
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                    nativeInputValueSetter.call(input, item.code);

                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));

                    // --- IMPROVED SELECTION LOGIC ---
                    const startTime = Date.now();
                    const maxWait = 2000; // Wait up to 2 seconds for search results

                    const attemptSelection = () => {
                        // Find native options (excluding our custom shortcuts)
                        const options = Array.from(scrollHost.querySelectorAll('.ng-option:not(.custom-shortcut-option)'));
                        // Look for a match on the code or description
                        const target = options.find(opt =>
                            opt.innerText.trim().includes(item.code) ||
                            opt.innerText.trim().includes(item.desc)
                        );

                        if (target) {
                            target.click();
                            // Final sync: ensure description/charge are set after selection completes
                            setTimeout(() => {
                                if (currentRow) {
                                    updateInputInRow(currentRow, 'description', item.desc);
                                    updateInputInRow(currentRow, 'actual-amount', item.price);
                                    updateInputInRow(currentRow, 'original-amount', item.price);
                                    updateInputInRow(currentRow, 'unit-charge', item.price);
                                }
                            }, 100);
                        } else if (Date.now() - startTime < maxWait) {
                            // If not found yet, wait 50ms and try again
                            setTimeout(attemptSelection, 50);
                        } else {
                            // Fallback if search fails entirely
                            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
                        }
                    };

                    attemptSelection();
                }
            };
            wrapper.appendChild(div);
        });

        panel.insertBefore(wrapper, scrollHost);
        panel.dataset.shortcutsAdded = "true";
    }

    function updateInputInRow(rowElement, identifier, val) {
        if (!val || !rowElement) return;

        const el = rowElement.querySelector(`input[data-identifier="${identifier}"], input[formcontrolname="${identifier}"], input[name*="${identifier}"]`);
        if (el) {
            const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeSetter.call(el, val);
            ['input', 'change', 'blur'].forEach(ev => el.dispatchEvent(new Event(ev, { bubbles: true })));
        }
    }

    setInterval(injectShortcuts, 350);
})();
