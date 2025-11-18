import { Base } from "./Base.js";
import { Decimal } from "./Decimal.js";
import { Binary } from "./Binary.js";

export class Octal extends Base {
    static validChars = ['0', '1', '2', '3', '4', '5', '6', '7'];

    static binaryDigits = {
        0: '000', 1: '001', 2: '010', 3: '011',
        4: '100', 5: '101', 6: '110', 7: '111'
    };

    /**
     * Converts the decimal part of one octal number in binary representation.
     * 
     * @static
     * @private
     * @param {string} number - The decimal part of an octal number.
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
     * Converts the integer part of one octal number in binary representation.
     * 
     * @static
     * @private
     * @param {string} number - The integer part of an octal number.
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
     * Converts the decimal part of an octal number to its base-decimal
     * representation.
     * 
     * @static
     * @private
     * @param {string} number - The decimal part of an octal number.
     * @param {string[]} numberChars - The valid characters of the number base.
     * @returns {string} The decimal part in decimal base.
     */
    static #getBase10Decimals(number, numberChars) {
        return this._base10DecimalsTemplate(number, numberChars);
    }

    /**
     * converts the integer part of an octal number to its base-decimal
     * representation.
     * 
     * @static
     * @private
     * @param {string} number - The integer part of an octal number.
     * @param {string[]} numberChars - The valid characters of the number base.
     * @returns {string} The integer part in decimal base.
     */
    static #getBase10Integers(number, numberChars) {
        return this._base10IntegersTemplate(number, numberChars);
    }

    /**
     * Makes the conversion from one octal number to the corresponding number in
     * base 62. The octal number can be negative and can contain a decimal part.
     * In this method it's possible to send one custom order in the valid
     * characters. This method will make two conversions, one from octal to
     * decimal and the second one from decimal to base 62.
     * 
     * @static
     * @param {string} number - The octal number to convert in base 62.
     * @param {string[]} customChars - A custom character order.
     * @returns {string} The number in base 62 format.
     */
    static tobase62(number, customChars) {
        const decimalNumber = this.todecimal(number);
        return Decimal.tobase62(decimalNumber, customChars);
    }

    /**
     * Makes the conversion from one octal number to the corresponding number in
     * hexadecimal. The octal number can be negative and can contain a decimal
     * part. This method will make two conversions, one from octal to binary and
     * the second one from binary to hexadecimal.
     * 
     * @static
     * @param {string} number - The octal number to convert in hexadecimal.
     * @returns {string} The number in hexadecimal format.
     */
    static tohexadecimal(number) {
        const binaryNumber = this.tobinary(number);
        return Binary.tohexadecimal(binaryNumber);
    }

    /**
     * Makes the conversion from one octal number to the corresponding number in
     * decimal. The octal number can be negative and can contain a decimal part.
     * 
     * @static
     * @param {string} number - The octal number to convert in decimal.
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
     * Makes the conversion from one octal number to the corresponding number in
     * binary. The octal number can be negative and can contain a decimal part.
     * 
     * @static
     * @param {string} number - The octal number to convert in binary.
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
     * Converts an octal number to the corresponding text (as if the number were
     * written). The translation can be in two languages: English and Spanish.
     * The decimal number can be negative and contain a decimal part. This
     * method will make two conversions, one from octal to decimal and the
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