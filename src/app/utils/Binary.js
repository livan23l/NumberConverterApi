import { Base } from './Base.js';
import { Decimal } from './Decimal.js';
import { Hexadecimal } from './Hexadecimal.js';
import { Octal } from './Octal.js';

export class Binary extends Base {
    static validChars = ['0', '1'];

    /**
     * This method is a template to get the decimal part and the integer part
     * when the new base is an exponent of two (4, 8, 16, 32...). This works
     * with the 'append' param because the generation is backward when the
     * result is the integer part and forward when it's the decimal part.
     * 
     * @static
     * @private
     * @param {string} number - The binary number to be converted.
     * @param {string[]} baseChars - The characters of the new base.
     * @param {boolean} [isInteger=true] - If the number is the integer part.
     * @returns {string} The resulting number in the new base.
     */
    static #getBase2Template(number, baseChars, isInteger = true) {
        // Get the cycles depending on the current base
        const cyclesPerBase = {
            8: 3,
            16: 4
        };
        const base = baseChars.length;
        const cycles = cyclesPerBase[base];

        // Define the variables to generate the integer part of the value
        let result = '';
        let value = 0;
        let exp = (isInteger) ? 0 : cycles - 1;

        // Define if the value will be append or pushed
        const addToResult = (isInteger)
            ? (val) => { result = baseChars[val] + result; }
            : (val) => { result += baseChars[val] };

        // Make the conversion
        const numberOrder = (isInteger) ? number.split('').reverse() : number;
        for (const dig of numberOrder) {
            // Check if it's the end of the current cycle
            if (exp >= cycles || exp < 0) {
                addToResult(value);
                value = 0;
                exp = (isInteger) ? 0 : cycles - 1;
            }

            // Check if the current value will be added
            if (dig == '1') value += (2 ** exp);

            if (isInteger) exp++; else exp--;
        }

        // Check if the cycle was not finish to add the remaining
        if (value != 0) addToResult(value);

        // Set '0' if the result is empty
        if (result == '') result = '0';

        return result;
    }

    /**
     * Generates the decimal part of one binary number that will be converted
     * into another base. This method is This method is only for bases that are
     * exponents of two (4, 8, 16, 32...).
     * 
     * @static
     * @private
     * @param {string} decimals - The decimals that will be converted.
     * @param {string[]} _ignored - Ignored parameter.
     * @param {string[]} baseChars - The characters of the new base.
     * @returns {string} The converted decimals in the new base.
     */
    static #getBase2Decimals(decimals, _ignored, baseChars) {
        return this.#getBase2Template(decimals, baseChars, false);
    }

    /**
     * Generates the integer part of one binary number that will be converted
     * into another base. This method is This method is only for bases that are
     * exponents of two (4, 8, 16, 32...).
     * 
     * @static
     * @private
     * @param {string} number - The number that will be converted.
     * @param {string[]} _ignored - Ignored parameter.
     * @param {string[]} baseChars - The characters of the new base.
     * @returns {string} The converted number in the new base.
     */
    static #getBase2Integers(number, _ignored, baseChars) {
        return this.#getBase2Template(number, baseChars);
    }

    /**
     * Converts the decimal part of a binary number to its base-decimal
     * representation.
     * 
     * @static
     * @private
     * @param {string} number - The decimal part of a binary number.
     * @param {string[]} numberChars - The valid characters of the number base.
     * @returns {string} The decimal part in decimal base.
     */
    static #getBase10Decimals(number, numberChars) {
        return this._base10DecimalsTemplate(number, numberChars);
    }

    /**
     * converts the integer part of a binery number to its base-decimal
     * representation.
     * 
     * @static
     * @private
     * @param {string} number - The integer part of a binary number.
     * @param {string[]} numberChars - The valid characters of the number base.
     * @returns {string} The integer part in decimal base.
     */
    static #getBase10Integers(number, numberChars) {
        return this._base10IntegersTemplate(number, numberChars);
    }

    /**
     * Makes the conversion from one binary number to the corresponding number
     * in base 62. The binary number can be negative and can contain a decimal
     * part. In this method it's possible to send one custom order in the valid
     * characters. This method will make two conversions, one from binary to
     * decimal and the second one from decimal to base 62.
     * 
     * @static
     * @param {string} number - The binary number to convert in base 62.
     * @param {string[]} customChars - A custom character order.
     * @returns {string} The number in base 62 format.
     */
    static tobase62(number, customChars) {
        const decimalNumber = this.todecimal(number);
        return Decimal.tobase62(decimalNumber, customChars);
    }

    /**
     * Makes the conversion from one binary number to the corresponding number
     * in hexadecimal. The binary number can be negative and can contain a
     * decimal part.
     * 
     * @static
     * @param {string} number - The binary number to convert in hexadecimal.
     * @returns {string} The number in hexadecimal format.
     */
    static tohexadecimal(number) {
        return this._conversion(
            number,
            this.validChars,
            Hexadecimal.validChars,
            this.#getBase2Decimals,
            this.#getBase2Integers
        );
    }

    /**
     * Makes the conversion from one binary number to the corresponding number
     * in decimal. The binary number can be negative and can contain a decimal
     * part.
     * 
     * @static
     * @param {string} number - The binary number to convert in decimal.
     * @returns {string} The number in decimal format.
     */
    static todecimal(number) {
        return this._conversion(
            number,
            this.validChars,
            Decimal.validChars,
            this.#getBase10Decimals,
            this.#getBase10Integers
        );
    }

    /**
     * Makes the conversion from one binary number to the corresponding number
     * in octal. The binary number can be negative and can contain a decimal
     * part.
     * 
     * @static
     * @param {string} number - The binary number to convert in octal.
     * @returns {string} The number in octal format.
     */
    static tooctal(number) {
        return this._conversion(
            number,
            this.validChars,
            Octal.validChars,
            this.#getBase2Decimals,
            this.#getBase2Integers
        );
    }

    /**
     * Converts a binary number to the corresponding text (as if the number were
     * written). The translation can be in two languages: English and Spanish.
     * The decimal number can be negative and contain a decimal part. This
     * method will make two conversions, one from binary to decimal and the
     * second one from decimal to text.
     * 
     * @static
     * @param {string} number - The number to 'translate' in text format.
     * @param {'en'|'es'} lang - The language to 'translate' the number.
     * @returns The number in text format in the sent language.
     */
    static totext(number, lang) {
        const decimalNumber = this.todecimal(number);
        return Decimal.totext(decimalNumber, lang);
    }
}