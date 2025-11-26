class Code {
    /**
     * Manages the action to copy one code.
     * 
     * @private
     * @returns {void}
     */
    #handleCopyCode() {
        // Get the DOM elements
        const $copyBtns = document.querySelectorAll('[data-code-copy]');

        // Set the flags to bock the click event
        const btnBlockFlags = {};

        $copyBtns.forEach(($btn) => {
            // Get the id of the code container
            const codeId = $btn.dataset.codeCopy;

            // Set the flag to block the code on false
            btnBlockFlags[codeId] = false;

            $btn.addEventListener('click', () => {
                // Check the action of copy is not block
                if (btnBlockFlags[codeId]) return;

                // Get the corresponding elements
                const $codeContainer = document.querySelector(`#${codeId}`);
                const $copyIcon = $btn.querySelector('svg');
                const hiddenClass = $copyIcon.classList[0] + '--hidden';
                const $checkIcon = $btn.querySelector(`svg.${hiddenClass}`)

                // Copy the code in the clipboard
                navigator.clipboard.writeText($codeContainer.innerText);

                // Block the click event and show the check icon
                btnBlockFlags[codeId] = true;
                $btn.style.cursor = 'default';
                $copyIcon.classList.toggle(hiddenClass);
                $checkIcon.classList.toggle(hiddenClass);

                // Set a timeout to unlock the copy button
                setTimeout(() => {
                    btnBlockFlags[codeId] = false;
                    $btn.style.cssText = '';
                    $copyIcon.classList.toggle(hiddenClass);
                    $checkIcon.classList.toggle(hiddenClass);
                }, 2000);
            });
        });
    }

    /**
     * Initializes the Code class.
     * 
     * @constructor
     * @returns {void}
     */
    constructor() {
        this.#handleCopyCode();
    }
}


new Code;