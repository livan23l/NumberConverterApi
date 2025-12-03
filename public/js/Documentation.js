class Documentation {
    /**
     * Controls the visible section change by pressing the corresponding button.
     * This method also show the corresponding aside option as active.
     * 
     * @private
     * @returns {void}
     */
    #handleSwitchSection() {
        // Get the hidden class and the oppen section
        const hiddenClass = 'main__section--hidden';
        const activeClass = 'aside__option--active';
        let $oppenSection = document.querySelector('#getting-started');
        let $oppenSectionBtn = document.querySelector(`.${activeClass}`);

        // Get all the sections buttons
        const $btns = document.querySelectorAll('[data-button-for]');

        // Add the click event for each button
        $btns.forEach($btn => {
            // Get the corresponding section
            const sectionId = $btn.dataset.buttonFor;
            const $section = document.querySelector(`#${sectionId}`);
            const $sectionBtn = document.querySelector(`#btn-${sectionId}`);

            // Add the click event
            $btn.addEventListener('click', () => {
                // Hide the last open section and the corresponding aside option
                $oppenSection.classList.add(hiddenClass);
                $oppenSectionBtn.classList.remove(activeClass);

                // Show the new section
                $section.classList.remove(hiddenClass);

                // Active the corresponding aside option
                $sectionBtn.classList.add(activeClass);

                // Update the last open section and the aside option
                $oppenSection = $section;
                $oppenSectionBtn = $sectionBtn;
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