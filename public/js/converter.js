class Converter {
    #lang;
    #request;

    /**
     * Set a custom message based on the error or warning message received from
     * the API. This message is more concise and user-friendly.
     * 
     * @private
     * @param {string} alertKey - The key of the error/warning in the object.
     * @param {object} alertObject - The object with the errors/warnings.
     * @returns {string} The final custom message.
     */
    #getAlertMessage(alertKey, alertObject) {
        const curMessage = alertObject[alertKey];
        let finalMessage = '';
        const messages =  {
            en: {
                emp: 'No value has been sent.',
                inv: 'The current value is not valid on the selected base.',
                dec: 'The result had too many decimals. These were truncated ' +
                     'to only twenty-five characters.',
                sepInv: 'The value sent does not meet the selected separation.',
                fromOrd: "The order entered in the 'from' section is not " +
                         'valid.',
                toOrd: "The order entered in the 'to' section is not valid.",
                fromExt: "The extra characters entered in the 'from' field " +
                         'are not valid.',
                toExt: "The extra characters entered in the 'to' field " +
                       'are not valid.',
                NotAN: 'Invalid number. Check the language and punctuation.',
                NTL: 'The number is too long. The maximum supported scale is ' +
                     'vigintillion.',
                int: 'Internal error, please try again later.',
                unk: 'An unknown error has occurred. Refresh the page or try ' +
                     'again in a few minutes.',
            },
            es: {
                emp: 'No se ha enviado ningún valor.',
                inv: 'El valor actual no es válido en la base seleccionada.',
                dec: 'El resultado tenía demasiados decimales. Estos fueron ' +
                     'truncados a solo veinticinco caracteres.',
                sepInv: 'El valor enviado no cumple con la separación '+
                        'seleccioanda.',
                fromOrd: "El orden ingresado en el apartado 'desde' no es " +
                         'válido.',
                toOrd: "El orden ingresado en el apartado 'hacia' no es " +
                       'válido.',
                fromExt: 'Los caracteres extra ingresados en el apartado ' +
                         "'desde' no son válidos.",
                toExt: 'Los caracteres extra ingresados en el apartado ' +
                       "'hacia' no son válidos.",
                NotAN: 'Número inválido. Verifica el idioma y la puntuación.',
                NTL: 'El número es demasiado largo. La escala máxima ' +
                     'admitida es vigintillón.',
                int: 'Error interno, inténtelo de nuevo más tarde.',
                unk: 'Ha sucedido un error desconocido. Recarga la página ' +
                     'o inténtalo en unos minutos.',
            }
        };
        const curMessages = messages[this.#lang];

        switch (alertKey) {
            case 'internal':
                finalMessage = curMessages.int;
                break;
            case 'data':
                if (curMessage.startsWith('The number is too long.')) {
                    finalMessage = curMessages.NTL;
                } else if (curMessage.startsWith('The text you sent')) {
                    finalMessage = curMessages.NotAN;
                } else if (curMessage.startsWith('The result had too many')) {
                    finalMessage = curMessages.dec;
                } else {
                    finalMessage = curMessages.unk;
                }
                break;
            case 'validation':
                finalMessage = curMessages.inv;
                break;
            case 'from.value':
                finalMessage = curMessages.emp;
                break;
            case 'from.format.separation':
                finalMessage = curMessages.sepInv;
                break;
            case 'from.format.order':
                finalMessage = curMessages.fromOrd;
                break;
            case 'to.format.order':
                finalMessage = curMessages.toOrd;
                break;
            default:
                if (alertKey.startsWith('from.format.extraCharacters')) {
                    finalMessage = curMessages.fromExt;
                } else if (alertKey.startsWith('to.format.extraCharacters')) {
                    finalMessage = curMessages.toExt;
                } else {
                    finalMessage = curMessages.unk;
                }
        }

        return finalMessage;
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
     * Make the HTTP petition to the API with the current internal request.
     * 
     * @private
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
                    console.log('Response:', response);

                    // Check if the response has errors
                    if (response.errors != undefined) {
                        const firstError = Object.keys(response.errors)[0];
                        $alert.dispatchEvent(new CustomEvent('showAlert', {
                            detail: {
                                type: 'error',
                                message: this.#getAlertMessage(
                                    firstError, response.errors
                                )
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
                                message: this.#getAlertMessage(
                                    firstWarning, response.warnings
                                )
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
                            message: this.#getAlertMessage('internal', {})
                        }
                    }));
                });
        });
    }

    /**
     * Shows or hides the corresponding settings modal depending on the user
     * action.
     * 
     * @private
     * @returns {void}
     */
    #handleConfiguration() {
        // Get the DOM elements
        const configButtons = {
            from: document.querySelector('#from-settings-button'),
            to: document.querySelector('#to-settings-button'),
            close: document.querySelector('#modal-close'),
            backdrop: document.querySelector('#modal-backdrop')
        };
        const $modal = document.querySelector('#modal');
        const $modalBackdrop = configButtons.backdrop;
        const modEl = {
            fromItem: document.querySelector('#from-settings'),
            fromOpt: {
                empty: document.querySelector('#from-empty-configurations'),
                sep: document.querySelector('#from-separation-option'),
                ord62: document.querySelector('#from-order62-option'),
                ord64: document.querySelector('#from-order64-option'),
                extra: document.querySelector('#from-extra-option')
            },
            toItem: document.querySelector('#to-settings'),
            toOpt: {
                empty: document.querySelector('#to-empty-configurations'),
                sep: document.querySelector('#to-separation-option'),
                ord62: document.querySelector('#to-order62-option'),
                ord64: document.querySelector('#to-order64-option'),
                extra: document.querySelector('#to-extra-option'),
                presZer: document.querySelector('#to-preserve-option')
            }
        };

        // Functions to handle the opening and closing of the modal
        const itemClass = 'modal__item--hidden';
        const optClass = 'modal__option--hidden';

        /**
         * Handles the opening of the settings. This method shows the
         * corresponding options depending on the request type.
         * 
         * @param {"from"|"to"} type - The type of settings to show.
         * @returns {void}
         */
        const handleOpening = type => {
            // Show the current item
            modEl[`${type}Item`].classList.remove(itemClass);

            // Show the corresponding options
            //--If request type is text only show the empty option
            if (this.#request[type].type == 'text') {
                modEl[`${type}Opt`].empty.classList.remove(optClass);
                return;
            }

            //--Show the separation
            modEl[`${type}Opt`].sep.classList.remove(optClass);

            //--If type is 'to' show the preserve zeros
            if (type == 'to') {
                modEl[`${type}Opt`].presZer.classList.remove(optClass);
            }

            //--If request type is base 62 show the order option
            if (this.#request[type].type == 'base62') {
                modEl[`${type}Opt`].ord62.classList.remove(optClass);
                return;
            }

            //--If request type is base 64 show the order and extra options
            if (this.#request[type].type == 'base64') {
                modEl[`${type}Opt`].ord64.classList.remove(optClass);
                modEl[`${type}Opt`].extra.classList.remove(optClass);
                return;
            }
        };

        /**
         * Handles the closing of the modal. This method hides all the options
         * and items in the modal.
         * 
         * @return {void}
         */
        const handleClosing = () => {
            // Hide the items
            modEl.fromItem.classList.add(itemClass);
            modEl.toItem.classList.add(itemClass);

            // Hide all the options
            Object.keys(modEl.fromOpt).forEach(key => {
                const $opt = modEl.fromOpt[key];
                $opt.classList.add(optClass);
            });
            Object.keys(modEl.toOpt).forEach(key => {
                const $opt = modEl.toOpt[key];
                $opt.classList.add(optClass);
            });
        }

        // Add the 'open' and 'close' events for all the buttons
        const modalClass = 'main__modal--hidden';
        const backClass = 'main__backdrop--hidden';
        Object.keys(configButtons).forEach(key => {
            const type = (key == 'from')
                ? 'from'
                : (
                    (key == 'to')
                    ? 'to'
                    : 'close'
            );
            const $btn = configButtons[key];

            $btn.addEventListener('click', () => {
                // Check if the modal is opening
                if ($modal.classList.contains(modalClass)) handleOpening(type);

                // Show or hide
                $modal.classList.toggle(modalClass);
                $modalBackdrop.classList.toggle(backClass);
            });
        });

        // Handle the closing after the modal transition
        $modal.addEventListener('transitionend', e => {
            // Check if the property is the last one
            if (e.propertyName != 'scale') return;

            // Check if the modal is closed to handle the closing
            if ($modalBackdrop.classList.contains(backClass)) handleClosing();
        });
    }

    /**
     * This method updates the real-time DOM request with the corresponding
     * types, values and formats.
     * 
     * @private
     * @returns {void}
     */
    #updateDOMRequest() {
        // Get the real time DOM request
        const $request = document.querySelector('#code-request');

        // Define the current formats to show
        const formats = { from: {}, to: {} };

        // Add separation or language depending on the type
        if (this.#request.from.type != 'text') {
            formats.from.separation = this.#request.from.format.separation;
        } else {
            formats.from.lang = this.#request.from.format.lang;
        }

        // Add separation and preserve zeros or language depending on the type
        if (this.#request.to.type != 'text') {
            formats.to.separation = this.#request.to.format.separation;
            formats.to.preserveZeros = this.#request.to.format.preserveZeros;
        } else {
            formats.to.lang = this.#request.to.format.lang;
        }

        /**
         * Establishes the formats that the 'from' or 'to' elements will have in
         * case the type is 'base62' or 'base64'.
         * 
         * @param {"from"|"to"} type - The type to which formats will be added.
         * @returns {void}
         */
        const addBaseFormats = (type) => {
            // Get the default order
            const defOrd = (this.#request[type]['type'] == 'base62')
                ? 'num-upper-lower'
                : 'upper-lower-num-extra';

            // Define the order
            const order = this.#request[type].format.order ?? defOrd;

            // Add the order
            formats[type].order = order;

            // Check if base is base 64 to add the extra characters
            if (this.#request[type]['type'] == 'base64') {
                const extra = this.#request[type].format.extraCharacters;
                formats[type].extraCharacters = extra;
            }
        };

        // Add the order and extra characters if type is 'base 62' or 'base 64'
        if (this.#request.from.type.startsWith('base')) addBaseFormats('from');
        if (this.#request.to.type.startsWith('base')) addBaseFormats('to');

        // Generate the request to show
        const rtRequest = {
            from: {
                value: this.#request.from.value,
                type: this.#request.from.type,
                format: { ...formats.from },
            },
            to: {
                type: this.#request.to.type,
                format: {...formats.to },
            }
        };

        $request.innerHTML = JSON.stringify(rtRequest, null, 2);
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
         * Handles all the change events for the types, languages, separations,
         * orders, and zero preservations in the 'from' and the 'to' types.
         * 
         * @param {Event} e - The custom event.
         * @param {"type"|"lang"|"separation"|"order"|"preserve"} eventType - 
         * The corresponding type of event that will be handled.
         * @param {"from"|"to"} type - The type to which the event belongs.
         * @returns {void}
         */
        const handleChange = (e, eventType, type) => {
            const value = e.detail.value;

            // Clean the textearea of the 'to' part
            $toTextarea.value = '';

            // Make the corresponding actions based on the event type
            switch(eventType) {
                case 'type':
                    this.#request[type].type = value;

                    // Get the corresponding language dropdown
                    const langId = `#${type}-languages-dropdown`
                    const langClass = 'element__select--hidden';
                    const $langs = document.querySelector(langId);

                    // Show or hide the language menu based on the value
                    if (value == 'text') $langs.classList.remove(langClass);
                    else $langs.classList.add(langClass);

                    // Change the current order if type is base 62 or base 64
                    if (value == 'base62' || value == 'base64') {
                        const ord = this.#request[type].extra.lastOrder[value];
                        this.#request[type].format.order = ord;
                    }

                    break;
                case 'lang':
                    this.#request[type].format.lang = value;
                    break;
                case 'separation':
                    this.#request[type].format.separation = value;
                    break;
                case 'order':
                    // Set the default order depending on the type
                    const curType = this.#request[type].type;
                    const defOrd = (curType == 'base62')
                        ? 'num-upper-lower'  // Base 62
                        : 'upper-lower-num-extra';  // Base 64

                    // Get the separated current order
                    const curOrd = this.#request[type].format.order ?? defOrd;
                    const sepOrd = curOrd.split('-');

                    // Change the corresponding order
                    const idx = Number(value[0]) - 1;
                    sepOrd[idx] = value.replace(`${value[0]}-`, '');

                    // Update the order and the last order
                    const newOrd = sepOrd.join('-');
                    this.#request[type].format.order = newOrd;
                    this.#request[type].extra.lastOrder[curType] = newOrd;

                    break;
                case 'preserve':
                    this.#request[type].format.preserveZeros = value;
                    break;
            }

            // Update the real time request
            this.#updateDOMRequest();
        };

        // Add the event listeners
        //--Types
        document.addEventListener('changeFromType', e => {
            handleChange(e, 'type', 'from')
        });
        document.addEventListener('changeToType', e => {
            handleChange(e, 'type', 'to')
        });

        //--Languages
        document.addEventListener('changeFromLanguage', e => {
            handleChange(e, 'lang', 'from')
        });
        document.addEventListener('changeToLanguage', e => {
            handleChange(e, 'lang', 'to')
        });

        //--Separations
        document.addEventListener('changeFromSeparation', e => {
            handleChange(e, 'separation', 'from')
        });
        document.addEventListener('changeToSeparation', e => {
            handleChange(e, 'separation', 'to')
        });

        //--Orders
        document.addEventListener('changeFromOrder', e => {
            handleChange(e, 'order', 'from')
        });
        document.addEventListener('changeToOrder', e => {
            handleChange(e, 'order', 'to')
        });

        //--Preserve zeros
        document.addEventListener('changeToPreserve', e => {
            handleChange(e, 'preserve', 'to')
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
                [
                    document.querySelector('#from-separation-default'),
                    document.querySelector('#from-separation')
                ],
                [
                    document.querySelector('#from-base62-order1-default'),
                    document.querySelector('#from-base62-order1')
                ],
                [
                    document.querySelector('#from-base62-order2-default'),
                    document.querySelector('#from-base62-order2')
                ],
                [
                    document.querySelector('#from-base62-order3-default'),
                    document.querySelector('#from-base62-order3')
                ],
                [
                    document.querySelector('#from-base64-order1-default'),
                    document.querySelector('#from-base64-order1')
                ],
                [
                    document.querySelector('#from-base64-order2-default'),
                    document.querySelector('#from-base64-order2')
                ],
                [
                    document.querySelector('#from-base64-order3-default'),
                    document.querySelector('#from-base64-order3')
                ],
                [
                    document.querySelector('#from-base64-order4-default'),
                    document.querySelector('#from-base64-order4')
                ],
            ],
            '$extra1': document.querySelector('#from-extra1'),
            '$extra2': document.querySelector('#from-extra2'),
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
                [
                    document.querySelector('#to-separation-default'),
                    document.querySelector('#to-separation')
                ],
                [
                    document.querySelector('#to-base62-order1-default'),
                    document.querySelector('#to-base62-order1')
                ],
                [
                    document.querySelector('#to-base62-order2-default'),
                    document.querySelector('#to-base62-order2')
                ],
                [
                    document.querySelector('#to-base62-order3-default'),
                    document.querySelector('#to-base62-order3')
                ],
                [
                    document.querySelector('#to-base64-order1-default'),
                    document.querySelector('#to-base64-order1')
                ],
                [
                    document.querySelector('#to-base64-order2-default'),
                    document.querySelector('#to-base64-order2')
                ],
                [
                    document.querySelector('#to-base64-order3-default'),
                    document.querySelector('#to-base64-order3')
                ],
                [
                    document.querySelector('#to-base64-order4-default'),
                    document.querySelector('#to-base64-order4')
                ],
            ],
            '$extra1': document.querySelector('#to-extra1'),
            '$extra2': document.querySelector('#to-extra2'),
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

            // Orders
            [
                this.#request.from.format.order,
                this.#request.to.format.order
            ] = [
                this.#request.to.format.order,
                this.#request.from.format.order
            ];

            // Extra characters
            [
                this.#request.from.format.extraCharacters,
                this.#request.to.format.extraCharacters
            ] = [
                this.#request.to.format.extraCharacters,
                this.#request.from.format.extraCharacters
            ];

            // Extra information
            [
                this.#request.from.extra,
                this.#request.to.extra
            ] = [
                this.#request.to.extra,
                this.#request.from.extra
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

            // Switch the content in the extra characters
            [
                fromElements['$extra1'].value, fromElements['$extra2'].value,
                toElements['$extra1'].value, toElements['$extra2'].value
            ] = [
                toElements['$extra1'].value, toElements['$extra2'].value,
                fromElements['$extra1'].value, fromElements['$extra2'].value
            ];

            // Switch the values in the request
            switchRequestValues();

            // Update the DOM real-time request
            this.#updateDOMRequest();
        });
    }

    /**
     * Handle the writing action, either in the 'from' text area or in the
     * inputs for extra characters. This method adds the written text in the
     * request.
     * 
     * @private
     * @returns {void}
     */
    #handleWritting() {
        // Get the writing elements
        const from = {
            '$textarea': document.querySelector('#from-textarea'),
            '$extra1': document.querySelector('#from-extra1'),
            '$extra2': document.querySelector('#from-extra2'),
        };
        const to = {
            '$textarea': document.querySelector('#to-textarea'),
            '$extra1': document.querySelector('#to-extra1'),
            '$extra2': document.querySelector('#to-extra2'),
        };

        // Clear the initial text areas
        from['$textarea'].value = '';
        to['$textarea'].value = '';

        // Add the event for writting in the text area
        from['$textarea'].addEventListener('change', e => {
            const newValue = e.target.value;
            this.#request.from.value = newValue;

            // Clear the 'to' textarea after each change
            to['$textarea'].value = '';

            // Update the real time request
            this.#updateDOMRequest();
        });

        /**
         * Hanldes the change in the value of all the extra characters.
         * 
         * @param {"from"|"to"} type - The corresponding type of the object.
         * @param {number} id - The identifier of the extra character.
         * @returns {void}
         */
        const changeExtraChar = (type, id) => {
            // Get the current object
            const curObj = (type == 'from') ? from : to;

            // Get the value of the character
            const value = curObj[`$extra${id}`].value;

            // Set the new value
            this.#request[type].format.extraCharacters[id - 1] = value;

            // Update the real time request
            this.#updateDOMRequest();
        };

        // Set the events for changing the extra characters
        //--From
        from['$extra1'].addEventListener('change', () => {
            changeExtraChar('from', 1);
        });
        from['$extra2'].addEventListener('change', () => {
            changeExtraChar('from', 2);
        });

        //--To
        to['$extra1'].addEventListener('change', () => {
            changeExtraChar('to', 1);
        });
        to['$extra2'].addEventListener('change', () => {
            changeExtraChar('to', 2);
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
        this.#lang = (window.location.pathname.includes('en'))
            ? 'en'
            : 'es';

        this.#request = {
            from: {
                value: '',
                type: 'decimal',
                format: {
                    lang: this.#lang,
                    separation: 'none',
                    order: null,
                    extraCharacters: ['+', '/']
                },
                extra: {
                    lastOrder: {
                        base62: null,
                        base64: null
                    }
                }
            },
            to: {
                value: '',
                type: 'binary',
                format: {
                    lang: this.#lang,
                    separation: 'none',
                    preserveZeros: 'none',
                    order: null,
                    extraCharacters: ['+', '/']
                },
                extra: {
                    lastOrder: {
                        base62: null,
                        base64: null
                    }
                }
            }
        };

        // Set custom events
        this.#handleWritting();
        this.#handleSwitch();
        this.#handleChangeEvents();
        this.#handleConfiguration();
        this.#handleConversion();
        this.#handleAlert();
    }
}

new Converter();