import { Base } from "./Base.js";
import { Decimal } from "./Decimal.js";
import { Binary } from "./Binary.js";

export class Hexadecimal extends Base {
    static validChars = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D',
        'E', 'F'
    ];

    static binaryDigits = {
        0: '0000', 1: '0001', 2: '0010', 3: '0011', 4: '0100',
        5: '0101', 6: '0110', 7: '0111', 8: '1000', 9: '1001',
        10: '1010', 11: '1011', 12: '1100', 13: '1101', 14: '1110',
        15: '1111'
    };

    /**
     * Converts the decimal part of one hexadecimal number in binary
     * representation.
     * 
     * @static
     * @private
     * @param {string} number - The decimal part of a hexadecimal number.
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
     * Converts the integer part of one hexadecimal number in binary
     * representation.
     * 
     * @static
     * @private
     * @param {string} number - The integer part of a hexadecimal number.
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
     * Converts the decimal part of a hexadecimal number to its base-decimal
     * representation.
     * 
     * @static
     * @private
     * @param {string} number - The decimal part of a hexadecimal number.
     * @param {string[]} numberChars - The valid characters of the number base.
     * @returns {string} The decimal part in decimal base.
     */
    static #getBase10Decimals(number, numberChars) {
        return this._base10DecimalsTemplate(number, numberChars);
    }

    /**
     * converts the integer part of a hexadecimal number to its base-decimal
     * representation.
     * 
     * @static
     * @private
     * @param {string} number - The integer part of a hexadecimal number.
     * @param {string[]} numberChars - The valid characters of the number base.
     * @returns {string} The integer part in decimal base.
     */
    static #getBase10Integers(number, numberChars) {
        return this._base10IntegersTemplate(number, numberChars);
    }

    /**
     * Makes the conversion from one hexadecimal number to the corresponding
     * number in base 62. The hexadecimal number can be negative and can contain
     * a decimal part. In this method it's possible to send one custom order in
     * the valid characters. This method will make two conversions, one from
     * hexadecimal to decimal and the second one from decimal to base 62.
     * 
     * @static
     * @param {string} number - The hexadecimal number to convert in base 62.
     * @param {string[]} customChars - A custom character order.
     * @returns {string} The number in base 62 format.
     */
    static tobase62(number, customChars) {
        const decimalNumber = this.todecimal(number);
        return Decimal.tobase62(decimalNumber, customChars);
    }

    /**
     * Makes the conversion from one hexadecimal number to the corresponding
     * number in octal. The hexadecimal number can be negative and can contain a
     * decimal part. This method will make two conversions, one from hexadecimal
     * to binary and the second one from binary to octal.
     * 
     * @static
     * @param {string} number - The hexadecimal number to convert in octal.
     * @returns {string} The number in octal format.
     */
    static tooctal(number) {
        const binaryNumber = this.tobinary(number);
        return Binary.tooctal(binaryNumber);
    }

    /**
     * Makes the conversion from one hexadecimal number to the corresponding
     * number in decimal. The hexadecimal number can be negative and can contain
     * a decimal part.
     * 
     * @static
     * @param {string} number - The hexadecimal number to convert in decimal.
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
     * Makes the conversion from one hexadecimal number to the corresponding
     * number in binary. The hexadecimal number can be negative and can contain
     * a decimal part.
     * 
     * @static
     * @param {string} number - The hexadecimal number to convert in binary.
     * @returns {string} The number in binary format.
     */
    static tobinary(number) {
        return this._conversion(
            number,
            this.validChars,
            Binary.validChars,
            this.#getBinaryDecimals,
            this.#getBinaryIntegers
        );
    }

    /**
     * Converts a hexadecimal number to the corresponding text (as if the number
     * were written). The translation can be in two languages: English and
     * Spanish. The decimal number can be negative and contain a decimal part.
     * This method will make two conversions, one from hexadecimal to decimal
     * and the second one from decimal to text.
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