import { Controller } from './Controller.js';
import { CHexadecimal, CDecimal, COctal, CBinary, CBase62, CText } from '../utils/converter.js';
import { WarningsEnum } from '../enums/WarningsEnum.js';
import { ErrorsEnum } from '../enums/ErrorsEnum.js';

export class ApiController extends Controller {
    /**
     * Gets the corresponding characters according to the separation format in
     * the sent object.
     * 
     * @param {object} dataObj - The object with the format and separtions.
     * @returns {object} The object with the characters for the separations.
     */
    #getSeparationsChars(dataObj) {
        const separations = {};

        // Check if the result will be separated
        if (dataObj.type == 'text') return separations;
        if (dataObj.format?.separation == null) return separations;

        // Get the type of separation
        const separationType = dataObj.format.separation;
        if (separationType == 'none') return separations;

        // Define the characters of the separation
        separations.int = ',';
        separations.dec = '.';
        if (separationType == 'period') {
            separations.int = '.';
            separations.dec = ',';
        }

        return separations;
    }

    /**
     * Performs the initial deseparation of the sent value according to the
     * specified format. This method receives the object with warnings to be
     * added if the value does not contain the specified separation. If it
     * does, the separation is removed from the 'from' object.
     * 
     * @param {object} warnings - The object with the warnings.
     * @param {object} from - The object with the data 'from' with the formater.
     * @returns {void}
     */
    #unseparateValue(warnings, from) {
        // Get the separation characters
        const separations = this.#getSeparationsChars(from);
        if (Object.keys(separations).length == 0) return;

        // Separate the current value into integer and decimal parts
        let [intPart, ...rest] = from.value.split(separations.dec);
        const decPart = rest.join(separations.dec);

        // Check if the integer part is separated
        let isSeparated = false;
        if (intPart.includes(separations.int)) {
            // Remove the separation characters from the value
            intPart = intPart.replaceAll(separations.int, '');
            isSeparated = true;
        }

        // Check if the value contains a decimal part
        if (decPart && separations.dec != '.') isSeparated = true;

        // Check if the original value is separated
        if (!isSeparated) {
            warnings['from.format.separation'] = WarningsEnum.SEPARATION();
            return;
        }

        // Unseparate the original value
        from.value = intPart;
        if (decPart) from.value += '.' + decPart;
    }

    /**
     * Performs the final separation of the result of a conversion if this is
     * specified in the format. This method receives the object with the result
     * and changes its value. If no separation is defined, this method will
     * return void.
     * 
     * @param {object} result - The object that contains the result.
     * @param {object} to - The object with the data 'to' with the formater.
     * @returns {void}
     */
    #separateResult(result, to) {
        // Check if the result of the conversion is not null
        if (result.data == null) return;

        // Get the separation characters
        const separations = this.#getSeparationsChars(to);
        if (Object.keys(separations).length == 0) return;

        // Separate the current result into integer and decimal parts
        let [intPart, decPart] = result.data.split('.');

        // Check if the integer part is negative to remove the negative sign
        const isNegative = intPart.startsWith('-');
        if (isNegative) intPart = intPart.slice(1);

        // Define the separation digits and the index to add the separation
        const sepDigits = 3;
        let sepIdx = sepDigits - (intPart.length % sepDigits);
        if (sepIdx == sepDigits) sepIdx = 0;

        // Perform the separation
        let separatedResult = '';
        for (const dig of intPart) {
            // Validate to add the separation character
            if (sepIdx == sepDigits) {
                separatedResult += separations.int;
                sepIdx = 0;
            }
            sepIdx++;

            // Add the current digit to the new value
            separatedResult += dig;
        }

        // Check if the result was negative
        if (isNegative) separatedResult = '-' + separatedResult;

        // Check if the result has a decimal part
        if (decPart != null) {
            separatedResult += separations.dec;
            separatedResult += decPart;
        }

        // Change the data of the result by the new result
        result.data = separatedResult;
    }

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

        // Add the warning if the type of the value is integer
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

        // Remove the separation of the from value
        this.#unseparateValue(warnings, data.from);

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

        // Add the final separation to the result
        this.#separateResult(result, data.to);

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