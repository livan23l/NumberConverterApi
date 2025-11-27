class Converter {
    #request;

    #makeRequest() {
        // const url = 'https://www.numberconverterapi.kodexiv.com/api/converter';
        const url = 'http://localhost:3300/api/converter';

        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: this.#request
            })
                .then(response => response.json())
                .then(data => {
                    resolve(data.data);
                }).catch(err => {
                    reject(new Error(err.message));
                });
        });
    }

    #handleConversion() {
        const $convertBtn = document.querySelector('#converter-button');

        $convertBtn.addEventListener('click', () => {
            console.log(this.#request);
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
            [this.#request.from.value, this.#request.to.value] = [
                this.#request.to.value, this.#request.from.value
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
            [fromElements['$textArea'].value, toElements['$textArea'].value] = [
                toElements['$textArea'].value,
                fromElements['$textArea'].value
            ];

            // Switch all the dropdown menus
            for (let i = 0; i < fromElements.dropdowns.length; i++) {
                const [$fromDefault, $fromList] = fromElements.dropdowns[i];
                const [$toDefault, $toList] = toElements.dropdowns[i];

                // Switch the default options
                [$fromDefault.innerText, $toDefault.innerText] = [
                    $toDefault.innerText, $fromDefault.innerText
                ];

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
            const value = e.detail.value;
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
                    extraCharacters: ['', '']
                }
            },
            to: {
                value: '',
                type: 'binary',
                format: {
                    lang: currentLang,
                    separation: 'none',
                    extraCharacters: ['', ''],
                    preserveZeros: 'none'
                }
            }
        };

        // Set custom events
        this.#handleWritting();
        this.#handleChangeEvents();
        this.#handleSwitch();
        this.#handleConversion();
    }
}

new Converter();