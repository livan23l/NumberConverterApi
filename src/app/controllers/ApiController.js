import { Controller } from './Controller.js';
import { CHexadecimal, CDecimal, COctal, CBinary, CBase62, CText, CBase64 } from '../utils/converter.js';
import { WarningsEnum } from '../enums/WarningsEnum.js';
import { ErrorsEnum } from '../enums/ErrorsEnum.js';

export class ApiController extends Controller {
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
            case 'base64': return CBase64;
            case 'text': return CText;
        }
    }

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
     * @param {object} result - The final result of the conversion.
     * @param {object} warnings - The warnings object to add the new keys.
     * @returns {void}
     */
    #addFinalWarnings(result, warnings) {
        // Check if the data has the '...' warning
        if (result.data.endsWith('...')) {
            warnings['data'] = WarningsEnum.TOOMANYDECIMALS();
            result.data = result.data.replace(/\.\.\.$/, '');
        }
        // Check if the data has the 'NTL' (Number too long) warning
        else if (result.data == 'NTL') {
            warnings['data'] = WarningsEnum.NTL();
        }
        // Check if the data has the 'NaN' (Not a Number) warning
        else if (result.data == 'NaN') {
            warnings['data'] = WarningsEnum.NaN();
        }
    }

    /**
     * Remove leading and trailing zeros from the final conversion result. Then
     * add back any zeros that were initially in the number, if indicated.
     * 
     * @private
     * @param {object} result - The final result of the conversion.
     * @param {object} data - The request of the conversion.
     * @returns {void}
     */
    #addFinalZeros(result, data) {
        // Get the current class depending on the type of the destination
        const to = data.to;
        const currentClass = this.#getClassByType(to.type);

        // Get the character that represents the zero in the destination base
        const cur0 = currentClass.getCurrentZero(
            to.format?.order,
            to.format?.extraCharacters
        );

        // Remove the leading and trailing zeros in the result
        result.data = currentClass.removeZeros(result.data, cur0);

        // Check if the request indicates that the zeros must be preserved
        const preserveZeros = to.format?.preserveZeros;
        if (preserveZeros != undefined) {
            const [leading, trailing] = data.from.extra.zeros;
            const isNegative = result.data.startsWith('-');
            let leadZerosStr = '';
            let trailZerosStr = '';

            // Add the leading zeros
            if (preserveZeros == 'leading' || preserveZeros == 'both') {
                for (let i = 0; i < leading; i++) leadZerosStr += cur0;
            }

            // Add the trailing zeros
            if (preserveZeros == 'trailing' || preserveZeros == 'both') {
                for (let i = 0; i < trailing; i++) trailZerosStr += cur0;
            }

            // Add the lading and trailing zeros
            result.data = (isNegative)
                ? '-' + leadZerosStr + result.data.slice(1) + trailZerosStr
                : leadZerosStr + result.data + trailZerosStr;
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
         * Get the characters order when `from.type` or `to.type` is `base62` or
         * `base64` depending on the `format.order`. If the format order is not
         * defined this function will return an empty array.
         * 
         * @param {object} obj - The object `from` or `to`.
         * @param {CBase62|CBase64} baseClass - The current corresponding class.
         * @returns {string[]} The array with the new characters order.
         */
        const getOrd = (obj, baseClass) => {
            // Check if the format 'order' is defined
            const order = obj.format?.order;

            // Create the new valid chars in the sended order
            const newValidChars = [];
            const orderList = order ? order.split('-') : [];
            const extraChars = obj.format?.extraCharacters;
            for (const ord of orderList) {
                switch(ord) {
                    case 'num':
                        newValidChars.push(...baseClass.validNumbers);
                        break;
                    case 'upper':
                        newValidChars.push(...baseClass.validUppers);
                        break;
                    case 'lower':
                        newValidChars.push(...baseClass.validLowers);
                        break;
                    case 'extra':
                        if (extraChars) newValidChars.push(...extraChars);
                        else newValidChars.push(...baseClass.extraCharacters);

                        break;
                }
            }

            // Validate if there is extra chars defined and no custom order
            if (
                extraChars && newValidChars.length == 0 &&
                baseClass.name == 'Base64'
            ) {
                newValidChars.push(...baseClass.validCharsWithoutExtra);
                newValidChars.push(...extraChars);
            }

            return newValidChars;
        };

        // Add additional parameters depending on the formats
        //--From formats
        if (from.type == 'base64') parameters.push(getOrd(from, CBase64));
        else if (from.type == 'base62') parameters.push(getOrd(from, CBase62));
        else if (from.type == 'text') parameters.push(from.format.lang);

        //--To formats
        if (to.type == 'base64') parameters.push(getOrd(to, CBase64));
        else if (to.type == 'base62') parameters.push(getOrd(to, CBase62));
        else if (to.type == 'text') parameters.push(to.format.lang);

        // Return the conversion
        return currentClass[`to${to.type}`](...parameters);
    }

    /**
     * Validate and standardize `from.value` depending on `from.type` and return
     * the final value with warnings if there are some.
     * 
     * @private
     * @param {object} from - The from object with the type and the value.
     * @param {string|undefined} preserveZeros - Indicates to preserve zeros.
     * @returns {object} The resulting value and warnings if any.
     */
    #validateFrom(from, preserveZeros) {
        // Get the current class depending on the type
        const currentClass = this.#getClassByType(from.type);

        // Get the character that represents the zero
        const cur0 = currentClass.getCurrentZero(
            from.format?.order,
            from.format?.extraCharacters
        );

        // Get the standardized value
        const value = currentClass.standardizeValue(from, cur0, preserveZeros);

        // Get the valid characters order based on the type
        const extraChars = from.format?.extraCharacters;
        const validChars = (from.type == 'base64' && extraChars)
            ? [...currentClass.validCharsWithoutExtra, ...extraChars]
            : [...currentClass.validChars];

        // Make the validation
        const validation = {
            warning: {},
            value
        };
        if (currentClass.validate(value, validChars)) {
            // Remove zeros from the value and return the validation
            validation.value = currentClass.removeZeros(validation.value, cur0);
            return validation;
        }

        const key = `C${currentClass.name.toUpperCase()}VAL`;
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
                           '"base62", "base64", "text"]';
        const orders62 = '["num-lower-upper", "num-upper-lower", ' +
                         '"lower-num-upper", "upper-num-lower", ' +
                         '"lower-upper-num", "upper-lower-num"]';
        const orders64 = '["upper-lower-num-extra", "upper-lower-extra-num", ' +
                         '"upper-num-lower-extra", "upper-num-extra-lower", ' +
                         '"upper-extra-lower-num", "upper-extra-num-lower", ' +
                         '"lower-upper-num-extra", "lower-upper-extra-num", ' +
                         '"lower-num-upper-extra", "lower-num-extra-upper", ' +
                         '"lower-extra-upper-num", "lower-extra-num-upper", ' +
                         '"num-upper-lower-extra", "num-upper-extra-lower", ' +
                         '"num-lower-upper-extra", "num-lower-extra-upper", ' +
                         '"num-extra-upper-lower", "num-extra-lower-upper", ' +
                         '"extra-upper-lower-num", "extra-upper-num-lower", ' +
                         '"extra-lower-upper-num", "extra-lower-num-upper", ' +
                         '"extra-num-upper-lower", "extra-num-lower-upper"]';
        const validLangs = '["en", "es"]';
        const validSeparations = '["comma", "period", "none"]';
        const validPresZeros = '["leading", "trailing", "both", "none"]';

        // Validate the data
        const errors = this._validate(data, {
            'from':            'required|obj',
            'from.type':       'required|str|in:' + validTypes,
            'from.value':      'required|strnumber',
            'from.format.lang': 'condition:data.from.type=="text"|required|' +
                                'str|in:' + validLangs,
            'from.format.separation': 'condition:data.from.type!="text"|' +
                                      'nullable|str|in:' + validSeparations,
            'from.format.extraCharacters': 'condition:data.from.type==' +
                                           '"base64"|nullable|array|len:2|' +
                                           'content:[unique-str-len:1-' +
                                           'noAlNum-noPeriod-noComma-noMinus]',
            'to':              'required|obj',
            'to.type':         'required|str|in:' + validTypes,
            'to.format.lang':  'condition:data.to.type=="text"|required|str|' +
                               'in:' + validLangs,
            'to.format.separation': 'condition:data.to.type!="text"|nullable|' +
                                    'str|in:' + validSeparations,
            'to.format.extraCharacters': 'condition:data.to.type=="base64"|' +
                                         'nullable|array|len:2|content:[' +
                                         'unique-str-len:1-noAlNum-noPeriod-' +
                                         'noComma-noMinus]',
            'to.format.preserveZeros': 'condition:data.to.type!="text"|' +
                                       'nullable|str|in:' + validPresZeros,
        });

        // Validate the corresponding orders for base 62 and base 64
        const highBases = ['base62', 'base64'];
        if (highBases.includes(data?.from?.type)) {
            const order = (data.from.type == 'base62') ? orders62 : orders64;
            Object.assign(errors, this._validate(data, {
                'from.format.order': 'nullable|str|in:' + order
            }));
        }
        if (highBases.includes(data?.to?.type)) {
            const order = (data.to.type == 'base62') ? orders62 : orders64;
            Object.assign(errors, this._validate(data, {
                'to.format.order': 'nullable|str|in:' + order
            }));
        }

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

        // Make the validations of the request 'from'
        const preserveZeros = data.to.format?.preserveZeros;
        const fromValidation = this.#validateFrom(data.from, preserveZeros);

        // Create the result object with the standardized value
        const result = { data: fromValidation.value };

        // Change the original data value to the standardized value
        data.from.value = fromValidation.value;

        // Check if the data value is valid
        if (fromValidation.value == null) {
            warnings['validation'] = fromValidation.warning;
        }
        // Make the conversion if the types of from and to are different or
        // both are base62, base64 or text (to change the language or the order)
        else if (data.from.type != data.to.type || (
            data.from.type == data.to.type &&
            ['base62', 'base64', 'text'].includes(data.from.type)
        )) {
            result.data = this.#makeConversion(data.from, data.to);

            // Add all the possible final warnings
            this.#addFinalWarnings(result, warnings);
        }

        // Add the final zeros to the result if the 'to.type' is not text
        if (result.data != null && data.to.type != 'text') {
            this.#addFinalZeros(result, data);
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