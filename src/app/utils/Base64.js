import { Base } from "./Base.js";
import { Decimal } from "./Decimal.js";

export class Base64 extends Base {
    static validChars = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b',
        'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
        'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3',
        '4', '5', '6', '7', '8', '9', '+', '/'
    ];
    static validCharsWithoutExtra = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b',
        'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
        'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3',
        '4', '5', '6', '7', '8', '9'
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
    static extraCharacters = ['+', '/'];

    static binaryDigits = {
        0: '000000', 1: '000001', 2: '000010', 3: '000011', 4: '000100',
        5: '000101', 6: '000110', 7: '000111', 8: '001000', 9: '001001',
        10: '001010', 11: '001011', 12: '001100', 13: '001101', 14: '001110',
        15: '001111', 16: '010000', 17: '010001', 18: '010010', 19: '010011',
        20: '010100', 21: '010101', 22: '010110', 23: '010111', 24: '011000',
        25: '011001', 26: '011010', 27: '011011', 28: '011100', 29: '011101',
        30: '011110', 31: '011111', 32: '100000', 33: '100001', 34: '100010',
        35: '100011', 36: '100100', 37: '100101', 38: '100110', 39: '100111',
        40: '101000', 41: '101001', 42: '101010', 43: '101011', 44: '101100',
        45: '101101', 46: '101110', 47: '101111', 48: '110000', 49: '110001',
        50: '110010', 51: '110011', 52: '110100', 53: '110101', 54: '110110',
        55: '110111', 56: '111000', 57: '111001', 58: '111010', 59: '111011',
        60: '111100', 61: '111101', 62: '111110', 63: '111111'
    };

    /**
     * Returns the character that represents zero in the current base.
     * 
     * @static
     * @param {string|undefined} order - The custom order in the characters.
     * @param {string[]|undefined} extraChars - Custom extra characters.
     * @returns The character that represents zero.
     */
    static getCurrentZero(order, extraChars) {
        if (order == undefined || order.startsWith('num')) return '0';
        else if (order.startsWith('upper')) return 'A';
        else if (order.startsWith('lower')) return 'a';
        else if (extraChars == undefined) return '+';
        else return extraChars[0];
    }

    /**
     * Converts the decimal part of one base 64 number in binary representation.
     * 
     * @static
     * @private
     * @param {string} number - The decimal part of a base 64 number.
     * @returns {string} The number in binary representation.
     */
    static #getBinaryDecimals(number) {
        return this._base2GeneralTemplate(
            number,
            'decimal',
            this.binaryDigits,
            this.validChars
        );
    }

    /**
     * Converts the integer part of one base 64 number in binary representation.
     * 
     * @static
     * @private
     * @param {string} number - The integer part of a base 64 number.
     * @returns {string} The number in binary representation.
     */
    static #getBinaryIntegers(number) {
        return this._base2GeneralTemplate(
            number,
            'integer',
            this.binaryDigits,
            this.validChars
        );
    }

    /**
     * Converts the decimal part of a base 64 number to its base-decimal
     * representation.
     * 
     * @static
     * @private
     * @param {string} number - The decimal part of a base 64 number.
     * @param {string[]} numberChars - The valid characters of the number base.
     * @returns {string} The decimal part in decimal base.
     */
    static #getBase10Decimals(number, numberChars) {
        return this._base10DecimalsTemplate(number, numberChars);
    }

    /**
     * converts the integer part of a base 64 number to its base-decimal
     * representation.
     * 
     * @static
     * @private
     * @param {string} number - The integer part of a base 64 number.
     * @param {string[]} numberChars - The valid characters of the number base.
     * @returns {string} The integer part in decimal base.
     */
    static #getBase10Integers(number, numberChars) {
        return this._base10IntegersTemplate(number, numberChars);
    }

    /**
     * Converts a base 64 number to another base 64 number. This method is
     * intended to be able to change the order of the characters in a base 64
     * number.
     * 
     * @static
     * @param {string} number - The original base 64 number.
     * @param {string[]} initialCharsOrder - The initial character order.
     * @param {string[]} finalCharsOrder - The final character order.
     * @returns {string} The base 64 number with the final character order.
     */
    static tobase64(number, initialCharsOrder, finalCharsOrder) {
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
     * Makes the conversion from one base 64 number to the corresponding number
     * in base 62. The base 64 number can be negative and can contain a decimal
     * part. In this method it's possible to send the original custom order in
     * the valid characters and the final characters order in the new base. This
     * method will make two conversions, one from base 64 to decimal and the
     * second one from decimal to base 62.
     * 
     * @static
     * @param {string} number - The original base 64 number.
     * @param {string[]} base64order - The initial character order.
     * @param {string[]} base62order - The final character order.
     * @returns {string} The base 62 number with the final character order.
     */
    static tobase62(number, base64order, base62order) {
        const decimalNumber = this.todecimal(number, base64order);
        return Decimal.tobase62(decimalNumber, base62order);
    }

    /**
     * Makes the conversion from one base 64 number to the corresponding number
     * in hexadecimal. The base 64 number can be negative and can contain a
     * decimal part. In this method it's possible to send the original custom
     * order in the valid characters. This method will make two conversions, one
     * from base 64 to binary and the second one from binary to hexadecimal.
     * 
     * @static
     * @param {string} number - The base 64 number to convert in hexadecimal.
     * @param {string[]} customChars - The custom initial character order.
     * @returns {string} The number in hexadecimal format.
     */
    static tohexadecimal(number, customChars) {
        const binaryNumber = this.tobinary(number, customChars);
        return Binary.tohexadecimal(binaryNumber);
    }

    /**
     * Makes the conversion from one base 64 number to the corresponding number
     * in decimal. The base 64 number can be negative and can contain a decimal
     * part. In this method it's possible to send the original custom order in
     * the valid characters.
     * 
     * @static
     * @param {string} number - The base 64 number to convert in decimal.
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
     * Makes the conversion from one base 64 number to the corresponding number
     * in octal. The base 64 number can be negative and can contain a decimal
     * part. In this method it's possible to send the original custom order in
     * the valid characters. This method will make two conversions, one from
     * base 64 to binary and the second one from binary to octal.
     * 
     * @static
     * @param {string} number - The base 64 number to convert in octal.
     * @param {string[]} customChars - The custom initial character order.
     * @returns {string} The number in octal format.
     */
    static tooctal(number, customChars) {
        const binaryNumber = this.tobinary(number, customChars);
        return Binary.tooctal(binaryNumber);
    }

    /**
     * Makes the conversion from one base 64 number to the corresponding number
     * in binary. The base 64 number can be negative and can contain a decimal
     * part. In this method it's possible to send the original custom order in
     * the valid characters.
     * 
     * @static
     * @param {string} number - The base 64 number to convert in binary.
     * @param {string[]} customChars - The custom initial character order.
     * @returns {string} The number in binary format.
     */
    static tobinary(number, customChars) {
        const initialChars = (customChars.length > 0)
            ? customChars
            : this.validChars;

        return this._conversion(
            number,
            initialChars,
            Binary.validChars,
            this.#getBinaryDecimals,
            this.#getBinaryIntegers
        );
    }

    /**
     * Converts one base 64 number to the corresponding text (as if the number
     * were written). The translation can be in two languages: English and
     * Spanish. The decimal number can be negative and contain a decimal part.
     * This method will make two conversions, one from base 64 to decimal and
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