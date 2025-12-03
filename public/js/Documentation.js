class Documentation {
    /**
     * Controls the visible section change by pressing the corresponding button.
     * 
     * @private
     * @returns {void}
     */
    #handleSwitchSection() {
        // Get the hidden class and the oppen section
        const hiddenClass = 'main__section--hidden';
        let $oppenSection = document.querySelector('#getting-started');

        // Get all the sections buttons
        const $btns = document.querySelectorAll('[data-button-for]');

        // Add the click event for each button
        $btns.forEach($btn => {
            // Get the corresponding section
            const sectionId = $btn.dataset.buttonFor;
            const $section = document.querySelector(`#${sectionId}`);

            // Add the click event
            $btn.addEventListener('click', () => {
                // Hide the last open section
                $oppenSection.classList.add(hiddenClass);

                // Show the new section
                $section.classList.remove(hiddenClass);

                // Update the last open section
                $oppenSection = $section;
            });
        });
    }

    /**
     * Initializes the Documentation class.
     * 
     * @constructor
     * @returns {void}
     */
    constructor() {
        // Handle the click events to switch sections
        this.#handleSwitchSection();
    }
}

new  Documentation;