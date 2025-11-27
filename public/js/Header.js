class Header {
    /**
     * Manages the action to show or hide the language menu.
     * 
     * @private
     * @returns {void}
     */
    #handleLanguageMenu() {
        // Get the DOM elements
        const $menu = document.querySelector('#languages-menu');
        const $menuBtn = document.querySelector('#btn-languages-menu');

        // Add the click event to the menu button
        $menuBtn.addEventListener('click', () => {
            $menu.classList.toggle('header__languages--hidden');
        });
    }

    /**
     * Initializes the Header class.
     * 
     * @constructor
     * @returns {void}
     */
    constructor() {
        this.#handleLanguageMenu();
    }
}

new Header;