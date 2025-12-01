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

        /**
         * Close all the menus in the page.
         * 
         * @returns {void}
         */
        const closeMenus = () => {
            menus.forEach(([$menu, hiddenClass]) => {
                $menu.classList.add(hiddenClass);
            });
        };

        // Add the events for all the menu buttons
        $menuBtns.forEach($btn => {
            // Get the corresponding menu
            const $menu = document.querySelector(`#${$btn.dataset.menu}`);

            // Get the hidden class of the current menu
            const hiddenClass = $menu.dataset.hiddenClass;

            // Add the menu and its hidden class to the menus array
            menus.push([$menu, hiddenClass]);

            // Toggle the visivility of the menu when the button is clicked
            $btn.addEventListener('click', () => {
                const action = $menu.classList.contains(hiddenClass)
                    ? 'open'
                    : 'hidde';
                closeMenus();
                if (action == 'open') $menu.classList.remove(hiddenClass);
                else $menu.classList.add(hiddenClass);
            });

            // Add the click event to the menu if it has 'selected' class
            if ($menu.hasAttribute('data-selected-class')) {
                // Get the classes and attributes
                const selectedClass = $menu.dataset.selectedClass;
                const optionClass = selectedClass.replace(/--selected$/, '');
                const changeEvent = $menu.dataset.changeEvent;

                // Get the current default option
                const $defaultOption = document.querySelector(
                    `#${$btn.dataset.menuDefault}`
                );

                $menu.addEventListener('click', e => {
                    // Get the clicked option
                    const $option = e.target;

                    // Check if the option is selected
                    if ($option.classList.contains(selectedClass)) return;

                    // Check the clicked element is an option
                    if (!$option.classList.contains(optionClass)) return;

                    // Get the selected option
                    const $selOpt = $menu.querySelector(`.${selectedClass}`);

                    // Switch the 'selected' classes
                    $selOpt.classList.remove(selectedClass);
                    $option.classList.add(selectedClass);

                    // Change the text in the default option label
                    $defaultOption.innerText = $option.innerText;

                    // Hide the menu
                    $menu.classList.add(hiddenClass);

                    // Check if exists one event when the option changes
                    if (changeEvent) {
                        // Get the change value of the selected option
                        const value = $option.dataset.changeValue;

                        // Dispatch the change event
                        document.dispatchEvent(new CustomEvent(changeEvent, {
                            detail: { value }
                        }));
                    }
                });
            }
        });

        // Add a general event when the user clicks outside of a menu
        document.addEventListener('click', e => {
            const target = e.target;

            // Check if the target is a menu button
            if (target.closest('[data-menu]')) return;

            // Check if the clicked element is a menu
            if (menus.some(([$menu]) => $menu.contains(target))) return;

            // Close all the menus
            closeMenus();
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