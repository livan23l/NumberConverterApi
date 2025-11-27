class Menu {
    /**
     * Manages the action to show or hide the custom menus. This method adds an
     * event listener for each button to show or hide the corresponding menu and
     * adds another custom method to hide all menus when the user clicks
     * elsewhere.
     * 
     * @private
     * @returns {void}
     */
    #handleMenuVisibility() {
        // Get the menu buttons
        const $menuBtns = document.querySelectorAll('[data-menu]');
        const menus = [];

        // Add the events for all the menu buttons
        $menuBtns.forEach($btn => {
            // Get the corresponding menu
            const $menu = document.querySelector(`#${$btn.dataset.menu}`);

            // Get the hidden class of the current menu
            const hiddenClass = [...$menu.classList].find(
                c => c.endsWith('--hidden')
            );

            console.log('Hidden class', hiddenClass)

            // Add the menu and its hidden class to the menus array
            menus.push([$menu, hiddenClass]);

            // Toggle the visivility of the menu when the button is clicked
            $btn.addEventListener('click', () => {
                $menu.classList.toggle(hiddenClass);
            });
        });

        // Add a general event when the user clicks outside of a menu
        document.addEventListener('click', e => {
            const target = e.target;

            // Check if the target is a menu button
            if (target.closest('[data-menu]')) return;

            // Check if the clicked element is a menu
            if (menus.some(([$menu]) => $menu.contains(target))) return;

            // Close all the menus
            menus.forEach(([$menu, hiddenClass]) => {
                $menu.classList.add(hiddenClass);
            });
        });
    }

    /**
     * Initializes the Menu class.
     * 
     * @constructor
     * @returns {void}
     */
    constructor() {
        this.#handleMenuVisibility();
    }
}

new Menu;