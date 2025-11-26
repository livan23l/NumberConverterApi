class Home {
    /**
     * Manages the animation of the demo.
     * 
     * @private
     * @returns {void}
     */
    #handleDemoAnimation() {
        // Get the DOM elements
        const $demoConnector = document.querySelector('#demo-connector');
        const $dinamycInput = document.querySelector('#demo-dinamyc-input');
        const $dinamycBase = $dinamycInput.querySelector('.demo__base');
        const $dinamycValue = $dinamycInput.querySelector('.demo__value');

        // Set the list of bases and values
        const cicles = [
            ['Binary:', '1010'],
            ['Octal:', '12'],
            ['Hexadecimal:', 'A'],
            ['Base 64:', 'K'],
            ['Text:', 'ten'],
        ];
        let current_cicle = 1;

        $demoConnector.addEventListener('animationend', () => {
            // Stop the animation
            $demoConnector.classList.remove('demo__connector--animated');

            // Add an animation for the dynamic input
            $dinamycInput.classList.add('demo__input--animated');
        });

        $dinamycInput.addEventListener('animationend', () => {
            // Get the current base and value
            const [base, value] = cicles[current_cicle++];
            if (current_cicle == cicles.length) current_cicle = 0;

            // Update the base and the value
            $dinamycBase.innerText = base;
            $dinamycValue.innerText = value;

            // Restart the animation of the input and the connector
            $dinamycInput.classList.remove('demo__input--animated');
            $demoConnector.classList.add('demo__connector--animated');
        });
    }

    /**
     * Initializes the animations on the home page.
     * 
     * @constructor
     * @returns {void}
     */
    constructor() {
        this.#handleDemoAnimation();
    }
}


new Home;