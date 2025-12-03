class Documentation {
    #sectionId;
    #$section;
    #$sectionBtn;

    /**
     * Updates the section variable in the URL.
     * 
     * @private
     * @returns {void}
     */
    #updateURLSection() {
        // Get the URL
        const url = new URL(window.location.href);

        // Update the section with the current id
        url.searchParams.set('section', this.#sectionId);

        // Update the user page
        history.replaceState({}, '', url);
    }

    /**
     * Controls the visible section change by pressing the corresponding button.
     * This method also show the corresponding aside option as active.
     * 
     * @private
     * @returns {void}
     */
    #handleSwitchSection() {
        // Get the hidden class and the oppen section class
        const hiddenClass = 'main__section--hidden';
        const activeClass = 'aside__option--active';

        // Show the initial section
        this.#$section.classList.remove(hiddenClass);
        this.#$sectionBtn.classList.add(activeClass);

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
                // Hide the last open section and the aside option
                this.#$section.classList.add(hiddenClass);
                this.#$sectionBtn.classList.remove(activeClass);

                // Show the new section
                $section.classList.remove(hiddenClass);

                // Active the corresponding aside option
                $sectionBtn.classList.add(activeClass);

                // Update the last open section and the aside option
                this.#$section = $section;
                this.#$sectionBtn = $sectionBtn;

                // Update the URL section
                this.#sectionId = sectionId;
                this.#updateURLSection();
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
        // Define the valid sections
        const validSections = [
            'getting-started', 'first-request', 'request', 'response',
            'types', 'formats', 'separation', 'language',
            'preserve-zeros', 'order', 'extra-characters',
        ];

        // Get the initial section
        const url = new URL(window.location.href);
        const curSection = url.searchParams.get('section');
        const defSec = 'getting-started';
        this.#sectionId = curSection ?? defSec;

        // Check the initial section is valid
        if (!validSections.includes(this.#sectionId)) this.#sectionId = defSec;

        // Define the current section elements
        this.#$section = document.querySelector(`#${this.#sectionId}`);
        this.#$sectionBtn = document.querySelector(`#btn-${this.#sectionId}`);

        // Update the URL section
        this.#updateURLSection();

        // Start the event to handle when each section changes
        this.#handleSwitchSection();
    }
}

new  Documentation;