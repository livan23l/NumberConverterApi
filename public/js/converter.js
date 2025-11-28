class Converter {
    #request;

    /**
     * Make the HTTP petition to the API with the current internal request.
     * 
     * @returns {Promise} The promise of the API response
     */
    #makeRequest() {
        // const url = 'https://www.numberconverterapi.kodexiv.com/api/converter';
        const url = 'http://localhost:3300/api/converter';

        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.#request)
            })
                .then(response => response.json())
                .then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(new Error(err.message));
                });
        });
    }

    /**
     * This method sets the events for the conversion alert to show or hide it
     * with a specific message and type. Internally, it handles the sampling of
     * multiple alerts, hiding and then showing it again.
     * 
     * @private
     * @returns {void}
     */
    #handleAlert() {
        // Get the alert and define the name of the classes
        const $alert = document.querySelector('#alert');
        const alertErrorClass = 'main__alert--error';
        const alertWarningClass = 'main__alert--warning';
        const alertHiddenClass = 'main__alert--hidden';
        let alertVisible = false;
        let showAlertAgain = false;
        let lastTimeoutId = null;
        const lastAttributes = {
            type: '',
            message: ''
        };

        // Define the custom event listener to show the alert
        $alert.addEventListener('showAlert', e => {
            lastAttributes.type = e.detail.type;
            lastAttributes.message = e.detail.message;

            // Check if the alert is visible to hide the alert and show it again
            if (alertVisible) {
                showAlertAgain = true;
                $alert.dispatchEvent(new CustomEvent('hideAlert'));
                return;
            }

            // Get the corresponding class
            const alertClass = (e.detail.type == 'error')
                ? alertErrorClass
                : alertWarningClass;

            // Set the class and the message
            $alert.classList.add(alertClass);
            $alert.innerText = e.detail.message;

            // Show the alert
            alertVisible = true;
            $alert.classList.remove(alertHiddenClass);

            // Set a time out to hide the alert
            lastTimeoutId = setTimeout(() => {
                $alert.dispatchEvent(new CustomEvent('hideAlert'));
            }, 5000);
        });

        // Define the custom event listener to hide the alert
        $alert.addEventListener('hideAlert', () => {
            // Clear the last timeout
            clearTimeout(lastTimeoutId);

            // Hide the alert
            alertVisible = false;
            $alert.classList.add(alertHiddenClass);
        });

        // Define the custom event to show the alert after it has been hidden
        $alert.addEventListener('transitionend', e => {
            // Check the transition end when it's the 'top' property (the end)
            if (e.propertyName != 'top') return;

            // Check if the transition is the 'show' transition
            if (alertVisible) return;

            // Remove the danger and warning classes
            $alert.classList.remove(alertErrorClass);
            $alert.classList.remove(alertWarningClass);

            // Check if the alert is not specified to be shown
            if (!showAlertAgain) return;

            // Dispatch the event to show the alert
            showAlertAgain = false;
            $alert.dispatchEvent(new CustomEvent('showAlert', {
                detail: lastAttributes
            }));
        });
    }

    /**
     * Performs the conversion depending on the internal request and show the
     * warnings and errors.
     * 
     * @private
     * @returns {void}
     */
    #handleConversion() {
        // Get the DOM elements
        const $convertBtn = document.querySelector('#converter-button');
        const $toTextarea = document.querySelector('#to-textarea');
        const $alert = document.querySelector('#alert');

        $convertBtn.addEventListener('click', () => {
            this.#makeRequest()
                .then(response => {
                    console.log(response);

                    // Check if the response has errors
                    if (response.errors != undefined) {
                        const firstError = Object.keys(response.errors)[0];
                        $alert.dispatchEvent(new CustomEvent('showAlert', {
                            detail: {
                                type: 'error',
                                message: response.errors[firstError]
                            }
                        }));
                        return;
                    }

                    // Check if the response has warnings
                    if (response.warnings) {
                        const firstWarning = Object.keys(response.warnings)[0];
                        $alert.dispatchEvent(new CustomEvent('showAlert', {
                            detail: {
                                type: 'warning',
                                message: response.warnings[firstWarning]
                            }
                        }));
                    } else $alert.dispatchEvent(new CustomEvent('hideAlert'));

                    // Update the data if is valid
                    const data = response.data;
                    const badData = ['NTL', 'NaN'];
                    if (typeof data == 'string' && !badData.includes(data)) {
                        this.#request.to.value = data;
                        $toTextarea.value = data;
                    }
                })
                .catch(() => {
                    $alert.dispatchEvent(new CustomEvent('showAlert', {
                        detail: {
                            type: 'error',
                            message: 'Internal error, please try again later.'
                        }
                    }));
                });
        });
    }

    /**
     * Handle the global changes events in the dropdowns for the inputs 'from'
     * and 'to'. This method changes the following attributes:
     * - type.
     * - value.
     * - language.
     * - separation.
     * - extra characters.
     * - preserve zeros.
     * 
     * @private
     * @returns {void}
     */
    #handleChangeEvents() {
        const $toTextarea = document.querySelector('#to-textarea');

        /**
         * Handles the change event for the types in the 'from' and the 'to'
         * lists.
         * 
         * @param {Event} e - The custom event.
         * @param {"from"|"to"} type - The type to which the event belongs.
         * @returns {void}
         */
        const handleTypeChange = (e, type) => {
            const value = e.detail.value;

            // Get the corresponding language dropdown
            const langId = `#${type}-languages-dropdown`
            const langHiddenClass = 'element__select--hidden';
            const $langs = document.querySelector(langId);

            // Show or hide the language menu based on the value
            if (value == 'text') $langs.classList.remove(langHiddenClass);
            else $langs.classList.add(langHiddenClass);

            // Change the type in the request
            this.#request[type].type = value;

            // Clean the textearea of the 'to' part
            $toTextarea.value = '';
        };

        /**
         * Handles the change event for the languages in the 'from' and the 'to'
         * lists.
         * 
         * @param {Event} e - The custom event.
         * @param {"from"|"to"} type - The type to which the event belongs.
         * @returns {void}
         */
        const handleLangChange = (e, type) => {
            const language = e.detail.value;

            // Change the language in the request
            this.#request[type].format.lang = language;

            // Clean the textearea of the 'to' part
            $toTextarea.value = '';
        }

        // Add the event listeners
        //--Types
        document.addEventListener('changeFromType', e => {
            handleTypeChange(e, 'from')
        });
        document.addEventListener('changeToType', e => {
            handleTypeChange(e, 'to')
        });

        //--Languages
        document.addEventListener('changeFromLanguage', e => {
            handleLangChange(e, 'from')
        });

        document.addEventListener('changeToLanguage', e => {
            handleLangChange(e, 'to')
        });
    }

    /**
     * Handle the switch action, exchanging the content in the textareas and
     * all the values in the dropdowns. This method also exchanges the internal
     * request.
     * 
     * @private
     * @returns {void}
     */
    #handleSwitch() {
        // Get the switch button
        const $switchBtn = document.querySelector('#converter-switch');

        // Get the content to switch
        const fromElements = {
            '$textArea': document.querySelector('#from-textarea'),
            dropdowns: [
                [
                    document.querySelector('#from-options-default'),
                    document.querySelector('#from-options')
                ],
                [
                    document.querySelector('#from-languages-default'),
                    document.querySelector('#from-languages')
                ],
            ],
        }
        const toElements = {
            '$textArea': document.querySelector('#to-textarea'),
            dropdowns: [
                [
                    document.querySelector('#to-options-default'),
                    document.querySelector('#to-options')
                ],
                [
                    document.querySelector('#to-languages-default'),
                    document.querySelector('#to-languages')
                ],
            ],
        }

        /**
         * Switch all the attributes in the interal request.
         * 
         * @returns {void}
         */
        const switchRequestValues = () => {
            // Values
            const newToValue = (this.#request.to.value != '')
                ? this.#request.from.value
                : '';
            [this.#request.from.value, this.#request.to.value] = [
                this.#request.to.value, newToValue
            ];

            // Types
            [this.#request.from.type, this.#request.to.type] = [
                this.#request.to.type, this.#request.from.type
            ];

            // Languages
            [this.#request.from.format.lang, this.#request.to.format.lang] = [
                this.#request.to.format.lang, this.#request.from.format.lang
            ];

            // Separations
            [
                this.#request.from.format.separation,
                this.#request.to.format.separation
            ] = [
                this.#request.to.format.separation,
                this.#request.from.format.separation
            ];

            // Extra characters
            [
                this.#request.from.format.extraCharacters,
                this.#request.to.format.extraCharacters
            ] = [
                this.#request.to.format.extraCharacters,
                this.#request.from.format.extraCharacters
            ];
        };

        // Switch all the elements
        $switchBtn.addEventListener('click', () => {
            // Switch the content in the textareas
            const newToValue = (toElements['$textArea'].value != '')
                ? fromElements['$textArea'].value
                : '';
            [fromElements['$textArea'].value, toElements['$textArea'].value] = [
                toElements['$textArea'].value, newToValue
            ];

            // Switch all the dropdown menus
            for (let i = 0; i < fromElements.dropdowns.length; i++) {
                const [$fromDefault, $fromList] = fromElements.dropdowns[i];
                const [$toDefault, $toList] = toElements.dropdowns[i];

                // Switch the default options
                [$fromDefault.innerText, $toDefault.innerText] = [
                    $toDefault.innerText, $fromDefault.innerText
                ];

                // Change the visibility of the parent dropdown menus
                //--Get the parents
                const $fromParent = $fromDefault.parentElement;
                const $toParent = $toDefault.parentElement;

                //--Check if the parents are hidden
                const hideClass = $fromParent.dataset.hiddenClass;
                const fromIsHidden = $fromParent.classList.contains(hideClass);
                const toIsHidden = $toParent.classList.contains(hideClass);

                //--If one is hidden and the other visible, the change
                if (fromIsHidden != toIsHidden) {
                    $fromParent.classList.toggle(hideClass);
                    $toParent.classList.toggle(hideClass);
                }

                // Switch the 'selected' option
                //--Get the 'selected' class
                const selClass = $fromList.dataset.selectedClass;

                //--Get the selected elements
                const $fromSelected = $fromList.querySelector(`.${selClass}`);
                const $toSelected = $toList.querySelector(`.${selClass}`);

                //--Get the corresponding elements in the other dropdown
                const $fromNewSel = $fromList.querySelector(
                    `#from-${$toSelected.id.replace(/^to-/, '')}`
                );
                const $toNewSel = $toList.querySelector(
                    `#to-${$fromSelected.id.replace(/^from-/, '')}`
                );

                //--Switch the 'selected' class in the from
                $fromSelected.classList.remove(selClass);
                $fromNewSel.classList.add(selClass);

                //--Switch the 'selected' class in the to
                $toSelected.classList.remove(selClass);
                $toNewSel.classList.add(selClass);
            }

            // Switch the values in the request
            switchRequestValues();
        });
    }

    /**
     * Handle the action of writting in the 'from' textarea. This method adds
     * the written text in the `request.from.value`.
     * 
     * @private
     * @returns {void}
     */
    #handleWritting() {
        // Get the textareas
        const $fromTextarea = document.querySelector('#from-textarea');
        const $toTextarea = document.querySelector('#to-textarea');

        // Clear the initial values
        $fromTextarea.value = '';
        $toTextarea.value = '';

        $fromTextarea.addEventListener('change', e => {
            const newValue = e.target.value;
            this.#request.from.value = newValue;

            // Clear the 'to' textarea after each change
            $toTextarea.value = '';
        });
    }

    /**
     * Initializes the Converter class.
     * 
     * @constructor
     * @returns {void}
     */
    constructor() {
        // Set attributes
        const currentLang = (window.location.pathname.includes('en'))
            ? 'en'
            : 'es';

        this.#request = {
            from: {
                value: '',
                type: 'decimal',
                format: {
                    lang: currentLang,
                    separation: 'none',
                    extraCharacters: null
                }
            },
            to: {
                value: '',
                type: 'binary',
                format: {
                    lang: currentLang,
                    separation: 'none',
                    extraCharacters: null,
                    preserveZeros: 'none'
                }
            }
        };

        // Set custom events
        this.#handleWritting();
        this.#handleSwitch();
        this.#handleChangeEvents();
        this.#handleConversion();
        this.#handleAlert()
    }
}

new Converter();