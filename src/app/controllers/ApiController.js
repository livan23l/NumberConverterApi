import { Controller } from './Controller.js';
import { CHexadecimal, CDecimal, COctal, CBinary, CBase62, CText } from '../utils/converter.js';
import { WarningsEnum } from '../enums/WarningsEnum.js';
import { ErrorsEnum } from '../enums/ErrorsEnum.js';

export class ApiController extends Controller {
    /**
     * This method will add all possible final warnings so that these can later
     * be added to the final response.
     * 
     * @private
     * @param {object} result - The final result of the conversion-
     * @param {object} warnings - The warnings object to add the new keys.
     */
    #addFinalWarnings(result, warnings) {
        // Check if the data has '...' and add a warning
        if (result.data.endsWith('...')) {
            warnings['data'] = WarningsEnum.TOOMANYDECIMALS();
            result.data = result.data.replace(/\.\.\.$/, '');
        }
    }

    /**
     * Returns the correspongin class depending on the type of value.
     * 
     * @private
     * @param {string} typeClass - The type of the value.
     * @returns {CHexadecimal|CDecimal|COctal|CBinary|CBase62|CText}
     */
    #getClassByType(typeClass) {
        switch (typeClass) {
            case 'hexadecimal': return CHexadecimal;
            case 'decimal': return CDecimal;
            case 'octal': return COctal;
            case 'binary': return CBinary;
            case 'base62': return CBase62;
            case 'text': return CText;
        }
    }

    /**
     * Make the conversion of `from.value` in `from.type` to `to.type`.
     * 
     * @private
     * @param {object} from - The `from` object with value, type and formats.
     * @param {object} to - The `to` object with the type and formats.
     * @returns {string} The converted value.
     */
    #makeConversion(from, to) {
        // Get the current origin class
        const currentClass = this.#getClassByType(from.type);

        // Define all the parameters for the conversion
        const parameters = [from.value];

        /**
         * Get the characters order when `from.type` or `to.type` is `base62`
         * depending on the `format.order`. If the format order is not defined
         * this function will return an empty array.
         * 
         * @param {object} obj - The object `from` or `to`.
         * @returns {string[]} The array with the new characters order.
         */
        const getCharsOrder = (obj) => {
            // Check if the format 'order' is defined
            const order = obj.format?.order;

            // Create the new valid chars in the sended order
            const newValidChars = [];
            const orderList = order ? order.split('-') : [];
            for (const ord of orderList) {
                switch(ord) {
                    case 'int':
                        newValidChars.push(...CBase62.validNumbers);
                        break;
                    case 'upper':
                        newValidChars.push(...CBase62.validUppers);
                        break;
                    case 'lower':
                        newValidChars.push(...CBase62.validLowers);
                        break;
                }
            }

            return newValidChars;
        };

        // Add additional parameters depending on the formats
        //--From formats
        if (from.type == 'base62') parameters.push(getCharsOrder(from));

        //--To formats
        if (to.type == 'base62') parameters.push(getCharsOrder(to));

        // Return the conversion
        return currentClass[`to${to.type}`](...parameters);
    }

    /**
     * Validate and standardize `from.value` depending on `from.type` and return
     * the final value with warnings if there are some.
     * 
     * @private
     * @param {object} from - The from object with the type and the value.
     * @returns {object} The resulting value and warnings if any.
     */
    #validateFrom(from) {
        // Get the current class depending on the type
        const currentClass = this.#getClassByType(from.type)

        // Get the standardized value
        const value = currentClass.standardizeValue(from.value);

        // Make the validation
        const validation = {
            warning: {},
            value
        };
        if (currentClass.validate(value)) return validation;

        const key = `${currentClass.name.toUpperCase()}VAL`;
        validation.warning = WarningsEnum[key](from.value);
        validation.value = null;
        return validation;
    }

    /**
     * Makes the general validations of the data. This method will return an
     * object with all the founded errors.
     * 
     * @private
     * @param {object} data - The request data.
     * @returns {object} An object with all the founded errors.
     */
    #validateData(data) {
        // Define the valid values
        const validTypes = '["hexadecimal", "decimal", "octal", "binary", ' +
                           '"base62", "text"]';
        const validLangs = '["en", "es"]';
        const validOrders = '["int-lower-upper", "int-upper-lower", ' +
                            '"lower-int-upper", "lower-upper-int", ' +
                            '"upper-int-lower", "upper-lower-int"]';
        const validSeparations = '["comma", "period", "none"]';

        // Validate the data
        const errors = this._validate(data, {
            'from':            'required|obj',
            'from.type':       'required|str|in:' + validTypes,
            'from.value':      'required|strnumber',
            'from.format.lang': 'condition:data.from.type=="text"|required|' +
                                'str|in:' + validLangs,
            'from.format.order': 'condition:data.from.type=="base62"|' +
                                 'nullable|str|in:' + validOrders,
            'from.format.separation': 'condition:data.from.type!="text"|' +
                                      'nullable|str|in:' + validSeparations,
            'to':              'required|obj',
            'to.type':         'required|str|in:' + validTypes,
            'to.format.lang':  'condition:data.to.type=="text"|nullable|str|' +
                               'in:' + validLangs,
            'to.format.order': 'condition:data.to.type=="base62"|nullable|' +
                               'str|in:' + validOrders,
            'to.format.separation': 'condition:data.to.type!="text"|nullable|' +
                                    'str|in:' + validSeparations
        });

        // Return the errors
        return errors;
    }

    /**
     * Handles the conversion by performing validations and returning the
     * expected result.
     * 
     * @private
     * @param {object} data - The request data.
     * @returns {object} The final response.
     */
    #handleConversion(data) {
        // Validate the data
        const dataErrors = this.#validateData(data);

        // Check if there is at least one error
        if (Object.keys(dataErrors).length > 0) {
            return this._object({ errors: dataErrors });
        }

        // Add the warnings
        const warnings = {};
        if (typeof data.from.value == 'number') {
            data.from.value = data.from.value.toString();
            warnings['from.value'] = WarningsEnum.USESTRING(data.from.value);
        }

        // Check if the value has at least one character
        if (data.from.value == '') {
            return this._object({ errors: {
                'from.value': ErrorsEnum.MINLEN('from.value', 1)
            }});
        }

        // Validate the `from.value` depending on `from.type`
        const fromValidation = this.#validateFrom(data.from);

        // Create the result object with the standardized value
        const result = { data: fromValidation.value };

        // Change the original data value to the standardized value
        data.from.value = fromValidation.value;

        // Check if the data value is valid
        if (fromValidation.value == null) {
            warnings['validation'] = fromValidation.warning;
        }
        // Make the conversion if the types of from and to are different or
        // both are base62 or text (to change the language or the order)
        else if (data.from.type != data.to.type || (
            data.from.type == data.to.type &&
            ['base62', 'text'].includes(data.from.type)
        )) {
            result.data = this.#makeConversion(data.from, data.to);

            // Add all the possible final warnings
            this.#addFinalWarnings(result, warnings);
        }

        // Add the separation if this is defined
        // --------

        // Define the response
        const response = (Object.keys(warnings).length > 0)
            ? { warnings, data: result.data }
            : { data: result.data };

        return this._object(response);
    }

    /**
     * Starts the conversion process.
     * 
     * @returns {void}
     */
    converter() {
        this._getRequest()
            .then((data) => {
                return this.#handleConversion(data);
            })
            .catch((error) => {
                return this._object(error);
            });
    }
}