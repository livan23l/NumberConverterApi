import { Base } from "./Base.js";
import { Decimal } from "./Decimal.js";

export class Base62 extends Base {
    static validChars = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D',
        'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
        'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z'
    ];
    static validNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    static validUppers = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];
    static validLowers = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
    ];

    /**
     * Returns the character that represents zero in the current base.
     * 
     * @static
     * @param {string|undefined} order - The custom order in the characters.
     * @returns The character that represents zero.
     */
    static getCurrentZero(order) {
        if (order == undefined || order.startsWith('num')) return '0';
        else if (order.startsWith('upper')) return 'A';
        else return 'a';
    }

    /**
     * Converts the decimal part of a base 62 number to its base-decimal
     * representation.
     * 
     * @static
     * @private
     * @param {string} number - The decimal part of a base 62 number.
     * @param {string[]} numberChars - The valid characters of the number base.
     * @returns {string} The decimal part in decimal base.
     */
    static #getBase10Decimals(number, numberChars) {
        return this._base10DecimalsTemplate(number, numberChars);
    }

    /**
     * converts the integer part of a base 62 number to its base-decimal
     * representation.
     * 
     * @static
     * @private
     * @param {string} number - The integer part of a base 62 number.
     * @param {string[]} numberChars - The valid characters of the number base.
     * @returns {string} The integer part in decimal base.
     */
    static #getBase10Integers(number, numberChars) {
        return this._base10IntegersTemplate(number, numberChars);
    }

    /**
     * Converts a base 62 number to another base 62 number. This method is
     * intended to be able to change the order of the characters in a base 62
     * number.
     * 
     * @static
     * @param {string} number - The original base 62 number.
     * @param {string[]} initialCharsOrder - The initial character order.
     * @param {string[]} finalCharsOrder - The final character order.
     * @returns {string} The base 62 number with the final character order.
     */
    static tobase62(number, initialCharsOrder, finalCharsOrder) {
        // Set the default character order
        if (initialCharsOrder.length == 0) initialCharsOrder = this.validChars;
        if (finalCharsOrder.length == 0) finalCharsOrder = this.validChars;

        // Check if the number is negative
        const isNegative = number.startsWith('-');

        // Change each digit of the number for the new digits order
        let newNumber = '';
        for (const dig of number) {
            // Check if the character is one special char
            if (dig == '-') continue;
            else if (dig == '.') {
                newNumber += dig;
                continue;
            }

            // Find the index of the current digit
            const idx = initialCharsOrder.indexOf(dig);

            // Add the corresponding digit to the new number
            newNumber += finalCharsOrder[idx];
        }

        // Add the negative sign if the number is negative
        if (isNegative) newNumber = '-' + newNumber;

        return newNumber;
    }

    /**
     * Makes the conversion from one base 62 number to the corresponding number
     * in hexadecimal. The base 62 number can be negative and can contain a
     * decimal part. In this method it's possible to send the original custom
     * order in the valid characters. This method will make two conversions, one
     * from base 62 to decimal and the second one from decimal to hexadecimal.
     * 
     * @static
     * @param {string} number - The base 62 number to convert in hexadecimal.
     * @param {string[]} customChars - The custom initial character order.
     * @returns {string} The number in hexadecimal format.
     */
    static tohexadecimal(number, customChars) {
        const decimalNumber = this.todecimal(number, customChars);
        return Decimal.tohexadecimal(decimalNumber);
    }

    /**
     * Makes the conversion from one base 62 number to the corresponding number
     * in decimal. The base 62 number can be negative and can contain a decimal
     * part. In this method it's possible to send the original custom order in
     * the valid characters.
     * 
     * @static
     * @param {string} number - The base 62 number to convert in decimal.
     * @param {string[]} customChars - The custom initial character order.
     * @returns {string} The number in decimal format.
     */
    static todecimal(number, customChars) {
        const initialChars = (customChars.length > 0)
            ? customChars
            : this.validChars;

        return this._conversion(
            number,
            initialChars,
            Decimal.validChars,
            this.#getBase10Decimals,
            this.#getBase10Integers
        );
    }

    /**
     * Makes the conversion from one base 62 number to the corresponding number
     * in octal. The base 62 number can be negative and can contain a decimal
     * part. In this method it's possible to send the original custom order in
     * the valid characters. This method will make two conversions, one from
     * base 62 to decimal and the second one from decimal to octal.
     * 
     * @static
     * @param {string} number - The base 62 number to convert in octal.
     * @param {string[]} customChars - The custom initial character order.
     * @returns {string} The number in octal format.
     */
    static tooctal(number, customChars) {
        const decimalNumber = this.todecimal(number, customChars);
        return Decimal.tooctal(decimalNumber);
    }

    /**
     * Makes the conversion from one base 62 number to the corresponding number
     * in binary. The base 62 number can be negative and can contain a decimal
     * part. In this method it's possible to send the original custom order in
     * the valid characters. This method will make two conversions, one from
     * base 62 to decimal and the second one from decimal to binary.
     * 
     * @static
     * @param {string} number - The base 62 number to convert in binary.
     * @param {string[]} customChars - The custom initial character order.
     * @returns {string} The number in binary format.
     */
    static tobinary(number, customChars) {
        const decimalNumber = this.todecimal(number, customChars);
        return Decimal.tobinary(decimalNumber);
    }

    /**
     * Converts one base 62 number to the corresponding text (as if the number
     * were written). The translation can be in two languages: English and
     * Spanish. The decimal number can be negative and contain a decimal part.
     * This method will make two conversions, one from base 62 to decimal and
     * the second one from decimal to text.
     * 
     * @static
     * @param {string} number - The number to 'translate' in text format.
     * @param {string[]} customChars - The custom initial character order.
     * @param {'en'|'es'} lang - The language to 'translate' the number.
     * @returns The number in text format in the sent language.
     */
    static totext(number, customChars, lang) {
        const decimalNumber = this.todecimal(number, customChars);
        return Decimal.totext(decimalNumber, lang);
    }
}