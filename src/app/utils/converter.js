class CBase {
    static validChars = [];
    static _removeAllWhiteSpaces = true;
    static _canContainMinus = true;
    static _canContainPeriod = true;

    /**
     * Standardize the value following this rules:
     * - Removes the leading zeros for the integer part.
     * - Removes the trailing zeros for the decimal part.
     * - Removes all whitespace if the property is true. Otherwise, it only
     * removes leading and trailing spaces, keeping one for intermediate spaces.
     * 
     * @static
     * @param {string} value - The value to be standardized.
     * @returns {string} The standardized value.
     */
    static standardizeValue(value) {
        // Remove the leading and trailing white spaces
        value = value.trim();

        // Check if the value will remove all the white spaces
        value = (this._removeAllWhiteSpaces)
            ? value.replace(/\s+/g, '')
            : value.replace(/\s+/g, ' ');

        // Check if the value starts with '-' to remove the leading zeros
        const hasNegSign = value.startsWith('-');
        if (hasNegSign) value = value.slice(1);

        // Remove the leading zeros
        value = value.replace(/^0+/, '');

        // Check if the value contains '.' to remove the trailing zeros
        if (value.includes('.')) value = value.replace(/0+$/, '');

        // Check if the start or/and the end of the value is empty
        if (value == '') value = '0';
        if (value.startsWith('.')) value = '0' + value;
        if (value.endsWith('.')) value += '0';

        // Add the negative sign if the value is not '0'
        if (hasNegSign && value != '0' && value != '0.0') value = '-' + value;

        return value;
    }

    /**
     * Check whether the value is valid or not depending on the following flags:
     * - `validChars`: Set the characters that are considered valid.
     * - `_canContainMinus`: Set if the value can starts with '-'.
     * - `_canContainPeriod`: Set if the value can contian one '.'.
     * 
     * @static
     * @param {string} value - The string with the current value
     * @returns {boolean} The result of the validation
     */
    static validate(value) {
        // Make the necessary validations if the number is negative
        if (value.startsWith('-')) {
            if (!this._canContainMinus) return false;

            // Remove the 'minus' sign
            value = value.slice(1);

            // Check if there is antoher 'minus'
            if (value.includes('-')) return false;
        }

        // Make the necessary validations if the number is decimal
        if (value.includes('.')) {
            if (!this._canContainPeriod) return false;

            // Remove the period
            const idxPeriod = value.indexOf('.');
            value = value.slice(0, idxPeriod) + value.slice(idxPeriod + 1);

            // Check if there is another period
            if (value.includes('.')) return false;
        }

        // Validate the rest of the characters
        for (let i = 0; i < value.length; i++) {
            const character = value[i];
            if (!this.validChars.includes(character)) return false;
        }

        return true;
    }

    /**
     * Performs a sum between two integers numbers in string format. This method
     * uses numbers of any size, which is why they must be in string format.
     * 
     * @static
     * @param {string} number1 - The first number in string format.
     * @param {string} number2 - The second number in string format.
     * @returns {string} The sum of both numbers.
     */
    static _strIntAddition(number1, number2) {
        // Get the maximum and minimum number according on their dimensions
        const [maxN, minN] = (number1.length > number2.length)
            ? [number1, number2]
            : [number2, number1];

        // Invert both numbers
        const maxNRev = maxN.split('').reverse();
        const minNRev = minN.split('').reverse();

        let result = '';

        // Make the addition
        let remainder = 0;
        for (let i = 0; i < maxN.length; i++) {
            const num1 = Number(maxNRev[i]);
            const num2 = Number(minNRev[i] ?? 0);

            // Make the current addition and set the remainder
            const curRes = (remainder + num1 + num2).toString();
            const has2digits = (curRes.length == 2);
            remainder = (has2digits) ? Number(curRes[0]) : 0;

            // Add the last digit to the final result
            result = curRes.at(-1) + result;
        };

        // Add the remainder
        if (remainder != 0) result = remainder.toString() + result;

        // Return the addition
        return result;
    }

    /**
     * Performs a multiplication between a value in string format and an
     * integer. The value can contain a decimal part. This method will return
     * an object with the integer part and the decimal part.
     * 
     * @static
     * @param {string} value - The number in string format.
     * @param {number} multiplier - The int number to multiply the value.
     * @returns {{intPart: string, decimalPart: string}} The multiplication
     * result with the integer and decimal parts.
     */
    static _strMultiplication(value, multiplier) {
        const result = {
            intPart: '',
            decimalPart: ''
        };

        // Make the multiplication from back to from
        let isDecimal = value.includes('.');
        let remainder = 0;
        for (let i = value.length - 1; i >= 0; i--) {
            // Check if the current digit is the period
            if (value[i] == '.') {
                isDecimal = false;
                continue;
            }

            // Get the curreng digit
            const dig = Number(value[i]);

            // Make the current multiplication
            const mult = ((dig * multiplier) + remainder).toString();

            // Check if the multiplication result has more than one digit
            const hasMoreDigits = (mult.length > 1);

            // Set the new remainder
            remainder = (hasMoreDigits)
                ? Number(mult.slice(0, mult.length - 1))
                : 0;

            // Get the last digit
            const lastDig = mult.at(-1).toString();

            // Add the last digit to the corresponding part
            if (isDecimal) result.decimalPart = lastDig + result.decimalPart;
            else result.intPart = lastDig + result.intPart;
        }

        // Add the remainder
        if (remainder > 0) {
            result.intPart = remainder.toString() + result.intPart;
        }

        // Check if the decimal part is empty
        if (result.decimalPart == '') result.decimalPart = '0';

        return result;
    }

    /**
     * This method is a template to perform one division at a time for the
     * methods `_strIntDivision` and `strFullDivision`. This returns an object
     * with the result and the remainder.
     * 
     * @private
     * @param {number} divisor - The divisor number.
     * @param {number} lastRemainder - The remainder of the previous divisions.
     * @param {number} currentValue - The current value of the current division.
     * @returns {{result: string, remainder: number}} The division result and
     * the remainder.
     */
    static __divisionTemplate(divisor, lastRemainder, currentValue) {
        const division = {
            result: '',
            remainder: 0,
        };

        // Make the mathematical evaluations
        const value = (lastRemainder * 10) + currentValue;
        division.result = Math.floor(value / divisor).toString();
        division.remainder = value % divisor;

        return division;
    }

    /**
     * Performs a division between an integer dividend (no decimal part) in
     * string format and an integer divisor. This method will return the integer
     * division result and the remainder as an object.
     * 
     * @static
     * @param {string} dividend - The integer number in string format to divide.
     * @param {number} divisor - The int number that will divide the dividend.
     * @returns {{result: string, remainder: number}} The division result.
    */
    static _strIntDivision(dividend, divisor) {
        const division = {
            result: '',
            remainder: 0
        };

        for (const d of dividend) {
            const { result, remainder } = this.__divisionTemplate(
                divisor,
                division.remainder,
                Number(d)
            );

            // Update the current values of the division
            if (result != '0' || division.result != '') {
                division.result += result;
            }
            division.remainder = remainder;
        }

        if (division.result == '') division.result = '0';
        return division;
    }

    /**
     * Performs full division between a string (which may contain a decimal) and
     * an integer. Returns the final division result in string format. If the
     * division enters a loop (such as when dividing 1/3), it will perform a
     * maximum of 25 iterations.
     * 
     * @static
     * @param {string} dividend - The dividend number in string format.
     * @param {number} divisor - The integer number to divide the dividend.
     * @returns {string} The division result.
     */
    static _strFullDivision(dividend, divisor) {
        let result = '';

        // Make the division for all the digits in the dividend
        let isDecimalPart = false;
        let remainder = 0;
        for (const dig of dividend) {
            // Check if the current digit is the '.'
            if (dig == '.') {
                isDecimalPart = true;
                result += '.';
                continue;
            }

            // Make the current division
            const div = this.__divisionTemplate(divisor, remainder, Number(dig));

            // Update the result and the remainder
            if (div.result != '0' || result != '') result += div.result;
            remainder = div.remainder;
        }

        // Add the final remainder
        if (remainder != 0) {
            const maxDecimals = 25;

            // Check if the result has the decimal part to add '.' to the result
            if (!isDecimalPart) result += '.';

            for (let i = 0; i < maxDecimals; i++) {
                const div = this.__divisionTemplate(divisor, remainder, 0);

                result += div.result;
                remainder = div.remainder;

                if (remainder == 0) break;
            }
        }

        // Fix the result if is empty or starts with '.'
        if (result == '') result = '0';
        else if (result.startsWith('.')) result = '0' + result;

        return result;
    }

    /**
     * This method provides a general template for converting the integer and
     * decimal parts of a number with a power of two base, based on the binary
     * representation of the original base.
     * 
     * @param {string} number - The number with a power of two base.
     * @param {'integer'|'decimal'} typeOfNumber - The sent part of the number.
     * @param {object} binaryDigits - The binary representation of the base.
     * @returns {string} The binary conversion of the number.
     */
    static _base2GeneralTemplate(number, typeOfNumber, binaryDigits) {
        // Make the conversion for each digit
        let res = '';
        for (const dig of number) {
            res += binaryDigits[dig];
        }

        // Remove the leading or trailing zeros
        if (typeOfNumber == 'integer') res = res.replace(/^0+/, '');
        else res = res.replace(/0+$/, '');

        // Check if the result is empty
        if (res == '') res = '0';

        return res;
    }

    /**
     * Generates the conversion into decimal base of one decimal part in another
     * base. This method multiplies each digit of the original number by the
     * original base raised to the relative position exponent
     * 
     * @static
     * @param {string} number - The decimal part in another base.
     * @param {string[]} baseChars - The valid characters of the number base.
     * @returns {string} The decimal part in decimal base.
     */
    static _base10DecimalsTemplate(number, baseChars) {
        let result = '0';

        // Get the current base of the number
        const base = baseChars.length;

        // Get the current zero value based on the characters of the base
        const cur0 = baseChars[0];

        // Make the conversion
        let currentMult = this._strFullDivision('1', base);
        for (const dig of number) {
            // Add the corresponding value to the result if the digit is not '0'
            if (dig != cur0) {
                // Multiply the current multiplier by the current digit
                const digNum = baseChars.indexOf(dig);
                const value = this._strMultiplication(currentMult, digNum);

                // Get the decimal part of the current value
                const decimalPart = value.decimalPart;

                // Fill the current result with zeros
                let resultWithZeros = result;
                for (let i = result.length; i < decimalPart.length; i++) {
                    resultWithZeros += '0';
                }

                // Add the sum of both parts to the result
                result = this._strIntAddition(resultWithZeros, decimalPart);
            }

            // Decrease the exponent of the multiple by one
            currentMult = this._strFullDivision(currentMult, base);
        }

        // Remove the trailing zeros
        result = result.replace(/0+$/, '');
        if (result == '') result = '0';

        return result;
    }

    /**
     * Generates the conversion into decimal base of one integer part in another
     * base. This method multiplies each digit of the original number by the
     * original base raised to the relative position exponent.
     * 
     * @static
     * @param {string} number - The integer part in another base.
     * @param {string[]} baseChars - The valid characters of the number base.
     * @returns {string} The integer part in decimal base.
     */
    static _base10IntegersTemplate(number, baseChars) {
        let result = '0';

        // Get the current base of the number
        const base = baseChars.length;

        // Get the current zero value based on the characters of the base
        const cur0 = baseChars[0];

        // Make the conversion from back to from
        let currentMult = '1';
        for (const dig of number.split('').reverse()) {
            // Add the corresponding value to the result
            if (dig != cur0) {
                // Multiply the current multiplier by the current digit value
                const digNum = baseChars.indexOf(dig);
                const value = this._strMultiplication(currentMult, digNum);

                // Add the product to the result
                result = this._strIntAddition(value.intPart, result);
            }

            // Increase the exponent of the multiple by one
            const nextMult = this._strMultiplication(currentMult, base);
            currentMult = nextMult.intPart;
        }

        // Remove the leading zeros
        result = result.replace(/^0+/, '');
        if (result == '') result = '0';

        return result;
    }

    /**
     * This method provides the basic structure for generating a conversion from
     * one number to another base. Here all the conversion classes will pass the
     * static methods to generate the decimal and integer parts in the new base.
     * This method will return the new number as a string depending on the valid
     * characters of the new base.
     * 
     * @static
     * @param {string} number - The number to convert into another base.
     * @param {string[]} curChars - The valid characters of the current base.
     * @param {string[]} newChars - The valid characters of the new base.
     * @param {function} decMethod - The callback to get the decimal part.
     * This callback will receive the following attributes:
     * - (string) The decimal part of the number in string format.
     * - (string[]) The valid characters of the current base.
     * - (string[]) The valid characters of the new base.
     * @param {function} intMethod - The callback to get the integer part.
     * This callback will receive the following attributes:
     * - (string) The integer part of the number in string format.
     * - (string[]) The valid characters of the current base.
     * - (string[]) The valid characters of the new base.
     * @returns {string} The new value in the specified base.
     */
    static _conversion(number, curChars, newChars, decMethod, intMethod) {
        // Define the number characteristics
        const isNegative = number.startsWith('-');
        const isDecimal = number.includes('.');

        const result = [];  // The result with the integer and decimal parts.

        // Divide the integer and decimal parts from the number
        let [intPart, decimalPart] = number.split('.');

        // Add the new decimal digits to the final result
        if (isDecimal) {
            result.push('.');
            result.push(decMethod.call(this, decimalPart, curChars, newChars));
        }

        // Check if the integer part is basically zero to return the result
        if (intPart == '0' || intPart == '-0') {
            // Set the corresponding zero in the final value
            const cur0 = newChars[0];
            const joinedNumber = cur0 + result.join('');
            const finalNumber = ((isNegative) ? '-' : '') + joinedNumber;

            // Return the final number with one correction for '-0.0'
            if (finalNumber == `-${cur0}.${cur0}`) return `${cur0}.${cur0}`;
            else return finalNumber;
        }

        // Remove the '-' from the integer part if it's a negative number
        if (isNegative) intPart = intPart.slice(1);

        // Generate the integer part and add it to the result
        result.unshift(intMethod.call(this, intPart, curChars, newChars));

        // Add the negative sign if it's negative
        if (isNegative) result.unshift('-');

        return result.join('');
    }
}

export class CHexadecimal extends CBase {
    static validChars = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D',
        'E', 'F'
    ];

    static binaryDigits = {
        '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100',
        '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001',
        'A': '1010', 'B': '1011', 'C': '1100', 'D': '1101', 'E': '1110',
        'F': '1111'
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
        return this._base2GeneralTemplate(number, 'decimal', this.binaryDigits);
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
        return this._base2GeneralTemplate(number, 'integer', this.binaryDigits);
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
        return CDecimal.tobase62(decimalNumber, customChars);
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
        return CBinary.tooctal(binaryNumber);
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
            CDecimal.validChars,
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
            CBinary.validChars,
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
     * @param {string} number - The number to 'translate' in text format.
     * @param {'en'|'es'} lang - The language to 'translate' the number.
     * @returns The number in text format in the sent language.
     */
    static totext(number, lang) {
        const decimalNumber = this.todecimal(number);
        return CDecimal.totext(decimalNumber, lang);
    }
}

export class CDecimal extends CBase {
    static validChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    /**
     * Gets the digits from the decimal part in one conversion from one decimal
     * number to another base depending on the valid characters in the new base.
     * 
     * Returns the new decimal part with up to 25 digits. If the conversion
     * reaches the maximum number of digits and has not yet completed, this
     * method appends a '...' to the end.
     * 
     * @static
     * @private
     * @param {string} decimal - The decimal part to be converted.
     * @param {string[]} _ignored - Ignored parameter.
     * @param {string[]} baseChars - The valid characters of the new base.
     * @returns {string} The decimal part in decimal base.
     */
    static #getDecimals(decimal, _ignored, baseChars) {
        const maxDecimals = 25;
        let finalVal = '';

        // Get the destination base
        const base = baseChars.length;

        // Generate the new decimal value
        let isComplete = false;
        for (let decimals = 0; decimals < maxDecimals; decimals++) {
            // Multiply the current decimal part by the new base value
            const mult = this._strMultiplication(`0.${decimal}`, base);

            // Update the new decimal part with the resulting decimal part
            decimal = mult.decimalPart;

            // Push the corresponding int part to the final value
            finalVal += baseChars[mult.intPart];

            // Chekc if the conversion has ended
            if (Number(decimal) == 0) {
                isComplete = true;
                break;
            }
        }

        // Check if the number could complete the decimal conversion
        if (!isComplete) finalVal += '...';

        return finalVal;
    }

    /**
     * Gets the digits from the integer part in one conversion from one decimal
     * number to another base depending on the valid characters in the new
     * base. Returns the final value reached until get zero in the divisions.
     * 
     * @static
     * @private
     * @param {string} number - The decimal number to be converted.
     * @param {string[]} _ignored - Ignored parameter.
     * @param {string[]} baseChars - The valid characters of the new base.
     * @returns {string} The integer part in decimal base.
     */
    static #getIntegers(number, _ignored, baseChars) {
        // Get the destination base
        const base = baseChars.length;

        // Generate the integer part until reach the expected coefficient
        const expectedCoefficient = '0';
        let finalValue = '';
        while (number != expectedCoefficient) {
            // Divide the number into the new base value
            const division = this._strIntDivision(number, base);

            // Update the new number with the division result
            number = division.result;

            // Append the corresponding value to the final value
            finalValue = baseChars[division.remainder] + finalValue;
        }

        return finalValue;
    }

    /**
     * Makes the conversion from one decimal number to the corresponding number
     * in base 62. The decimal number can be negative and can contain a decimal
     * part. In this method it's possible to send one custom order in the valid
     * characters.
     * 
     * @static
     * @param {string} number - The decimal number to convert in base 62.
     * @param {string[]} customChars - A custom character order.
     * @returns {string} The number in base 62 format.
     */
    static tobase62(number, customChars) {
        const validChars = (customChars.length > 0)
            ? customChars
            : CBase62.validChars;

        return this._conversion(
            number,
            this.validChars,
            validChars,
            this.#getDecimals,
            this.#getIntegers,
        );
    }

    /**
     * Makes the conversion from one decimal number to the corresponding number
     * in hexadecimal. The decimal number can be negative and can contain a
     * decimal part.
     * 
     * @static
     * @param {string} number - The decimal number to convert in hexadecimal.
     * @returns {string} The number in hexadecimal format.
     */
    static tohexadecimal(number) {
        return this._conversion(
            number,
            this.validChars,
            CHexadecimal.validChars,
            this.#getDecimals,
            this.#getIntegers,
        );
    }

    /**
     * Makes the conversion from one decimal number to the corresponding number
     * in octal. The decimal number can be negative and can contain a decimal
     * part.
     * 
     * @static
     * @param {string} number - The decimal number to convert in octal.
     * @returns {string} The number in octal format.
     */
    static tooctal(number) {
        return this._conversion(
            number,
            this.validChars,
            COctal.validChars,
            this.#getDecimals,
            this.#getIntegers,
        );
    }

    /**
     * Makes the conversion from one decimal number to the corresponding number
     * in binary. The decimal number can be negative and can contain a decimal
     * part.
     * 
     * @static
     * @param {string} number - The decimal number to convert in binary.
     * @returns {string} The number in binary format.
     */
    static tobinary(number) {
        return this._conversion(
            number,
            this.validChars,
            CBinary.validChars,
            this.#getDecimals,
            this.#getIntegers,
        );
    }

    /**
     * Converts a decimal number to the corresponding text (as if the number
     * were written). The translation can be in two languages: English and
     * Spanish. The decimal number can be negative and contain a decimal part.
     * 
     * @param {string} number - The number to 'translate' in text format.
     * @param {'en'|'es'} lang - The language to 'translate' the number.
     * @returns The number in text format in the sent language.
     */
    static totext(number, lang) {
        // Define the names according to the number of digits
        const units = {
            'es': {
                '0': 'cero', '1': 'un', '2': 'dos', '3': 'tres', '4': 'cuatro',
                '5': 'cinco', '6': 'seis', '7': 'siete', '8': 'ocho',
                '9': 'nueve'
            },
            'en': {
                '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four',
                '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine'
            }
        };
        const tens = {
            'es': {
                breakpoint: '30',
                union: ' y ',
                numbers: {
                    '10': 'diez', '11': 'once', '12': 'doce', '13': 'trece',
                    '14': 'catorce', '15': 'quince', '16': 'dieciséis',
                    '17': 'diecisiete', '18': 'dieciocho', '19': 'diecinueve',
                    '20': 'veinte', '21': 'veintiún', '22': 'veintidós',
                    '23': 'veintitrés', '24': 'veinticuatro',
                    '25': 'veinticinco', '26': 'veintiséis',
                    '27': 'veintisiete', '28': 'veintiocho',
                    '29': 'veintinueve', '30': 'treinta', '40': 'cuarenta',
                    '50': 'cincuenta', '60': 'sesenta', '70': 'setenta',
                    '80': 'ochenta', '90': 'noventa'
                }
            },
            'en': {
                breakpoint: '20',
                union: '-',
                numbers: {
                    '10': 'ten', '11': 'eleven', '12': 'twelve',
                    '13': 'thirteen', '14': 'fourteen', '15': 'fifteen',
                    '16': 'sixteen', '17': 'seventeen', '18': 'eighteen',
                    '19': 'nineteen', '20': 'twenty', '30': 'thirty',
                    '40': 'forty', '50': 'fifty', '60': 'sixty',
                    '70': 'seventy', '80': 'eighty', '90': 'ninety'
                }
            }
        };
        const hundreds = {
            'es': {
                '100': 'cien', '100x': 'ciento ',
                '200': 'doscientos', '200x': 'doscientos ',
                '300': 'trescientos', '300x': 'trescientos ',
                '400': 'cuatrocientos', '400x': 'cuatrocientos ',
                '500': 'quinientos', '500x': 'quinientos ',
                '600': 'seiscientos', '600x': 'seiscientos ',
                '700': 'setecientos', '700x': 'setecientos ',
                '800': 'ochocientos', '800x': 'ochocientos ',
                '900': 'novecientos', '900x': 'novecientos '
            },
            'en': {
                '100': 'one hundred', '100x': 'one hundred ',
                '200': 'two hundred', '200x': 'two hundred ',
                '300': 'three hundred', '300x': 'three hundred ',
                '400': 'four hundred', '400x': 'four hundred ',
                '500': 'five hundred', '500x': 'five hundred ',
                '600': 'six hundred', '600x': 'six hundred ',
                '700': 'seven hundred', '700x': 'seven hundred ',
                '800': 'eight hundred', '800x': 'eight hundred ',
                '900': 'nine hundred', '900x': 'nine hundred '
            }
        };
        const remaining = {
            'orderKeys': [
                'thousand', 'million', 'billion', 'trillion', 'quadrillion',
                'quintillion', 'sextillion', 'septillion', 'octillion',
                'nonillion', 'decillion', 'undecillion', 'duodecillion',
                'tredecillion', 'quattuordecillion', 'quindecillion',
                'sexdecillion', 'septendecillion', 'octodecillion',
                'novemdecillion', 'vigintillion'
            ],
            'es': {
                scale: {
                    'digitsPerScale': 6, 'minimumDigits': 4,
                    'maximumDigits': 126, 'thousand': 3, 'million': 6,
                    'billion': 12, 'trillion': 18, 'quadrillion': 24,
                    'quintillion': 30, 'sextillion': 36, 'septillion': 42,
                    'octillion': 48, 'nonillion': 54, 'decillion': 60,
                    'undecillion': 66, 'duodecillion': 72, 'tredecillion': 78,
                    'quattuordecillion': 84, 'quindecillion': 90,
                    'sexdecillion': 96, 'septendecillion': 102,
                    'octodecillion': 108, 'novemdecillion': 114,
                    'vigintillion': 120
                },
                numbers: {
                    'thousand': 'mil', 'thousandx': 'mil',
                    'million': 'millón', 'millionx': 'millones',
                    'billion': 'billón', 'billionx': 'billones',
                    'trillion': 'trillón', 'trillionx': 'trillones',
                    'quadrillion': 'cuatrillón', 'quadrillionx': 'cuatrillones',
                    'quintillion': 'quintillón', 'quintillionx': 'quintillones',
                    'sextillion': 'sextillón', 'sextillionx': 'sextillones',
                    'septillion': 'septillón', 'septillionx': 'septillones',
                    'octillion': 'octillón', 'octillionx': 'octillones',
                    'nonillion': 'nonillón', 'nonillionx': 'nonillones',
                    'decillion': 'decillón', 'decillionx': 'decillones',
                    'undecillion': 'undecillón', 'undecillionx': 'undecillones',
                    'duodecillion': 'duodecillón',
                    'duodecillionx': 'duodecillones',
                    'tredecillion': 'tredecillón',
                    'tredecillionx': 'tredecillones',
                    'quattuordecillion': 'cuatordecillón',
                    'quattuordecillionx': 'cuatordecillones',
                    'quindecillion': 'quindecillón',
                    'quindecillionx': 'quindecillones',
                    'sexdecillion': 'sexdecillón',
                    'sexdecillionx': 'sexdecillones',
                    'septendecillion': 'septendecillón',
                    'septendecillionx': 'septendecillones',
                    'octodecillion': 'octodecillón',
                    'octodecillionx': 'octodecillones',
                    'novemdecillion': 'novendecillón',
                    'novemdecillionx': 'novendecillones',
                    'vigintillion': 'vigintillón',
                    'vigintillionx': 'vigintillones'
                }
            },
            'en': {
                scale: {
                    'digitsPerScale': 3, 'minimumDigits': 4,
                    'maximumDigits': 66, 'thousand': 3, 'million': 6,
                    'billion': 9, 'trillion': 12, 'quadrillion': 15,
                    'quintillion': 18, 'sextillion': 21, 'septillion': 24,
                    'octillion': 27, 'nonillion': 30, 'decillion': 33,
                    'undecillion': 36, 'duodecillion': 39, 'tredecillion': 42,
                    'quattuordecillion': 45, 'quindecillion': 48,
                    'sexdecillion': 51, 'septendecillion': 54,
                    'octodecillion': 57, 'novemdecillion': 60,
                    'vigintillion': 63
                },
                numbers: {
                    'thousand': 'thousand', 'thousandx': 'thousand',
                    'million': 'million', 'millionx': 'million',
                    'billion': 'billion', 'billionx': 'billion',
                    'trillion': 'trillion', 'trillionx': 'trillion',
                    'quadrillion': 'quadrillion', 'quadrillionx': 'quadrillion',
                    'quintillion': 'quintillion', 'quintillionx': 'quintillion',
                    'sextillion': 'sextillion', 'sextillionx': 'sextillion',
                    'septillion': 'septillion', 'septillionx': 'septillion',
                    'octillion': 'octillion', 'octillionx': 'octillion',
                    'nonillion': 'nonillion', 'nonillionx': 'nonillion',
                    'decillion': 'decillion', 'decillionx': 'decillion',
                    'undecillion': 'undecillion', 'undecillionx': 'undecillion',
                    'duodecillion': 'duodecillion',
                    'duodecillionx': 'duodecillion',
                    'tredecillion': 'tredecillion',
                    'tredecillionx': 'tredecillion',
                    'quattuordecillion': 'quattuordecillion',
                    'quattuordecillionx': 'quattuordecillion',
                    'quindecillion': 'quindecillion',
                    'quindecillionx': 'quindecillion',
                    'sexdecillion': 'sexdecillion',
                    'sexdecillionx': 'sexdecillion',
                    'septendecillion': 'septendecillion',
                    'septendecillionx': 'septendecillion',
                    'octodecillion': 'octodecillion',
                    'octodecillionx': 'octodecillion',
                    'novemdecillion': 'novemdecillion',
                    'novemdecillionx': 'novemdecillion',
                    'vigintillion': 'vigintillion',
                    'vigintillionx': 'vigintillion'
                }
            }
        };
        const signs = {
            'es': {
                'point': 'punto', 'minus': 'menos'
            },
            'en': {
                'point': 'point', 'minus': 'minus'
            }
        }

        /**
         * Gets the corresponding name using the current language of a number
         * with two digits. The number can start with '0'.
         * 
         * @param {string} number - The number with two digits.
         * @returns {string} The name of the number in the current language.
         */
        const getTwoDigitsName = (number) => {
            // Get the current units and tens
            const Units = units[lang];
            const Tens = tens[lang];

            // Check if there is only one digit to name
            if (number.startsWith('0')) return Units[number[1]];

            // Check if the number is a multiple of 10
            if (number.endsWith('0')) return Tens.numbers[number];

            // Check if the name is direct
            if (number < Tens.breakpoint) return Tens.numbers[number];

            // Generate the name of the number
            const tensName = Tens.numbers[number[0] + '0'];
            const unitsName = Units[number[1]];
            return tensName + Tens.union + unitsName;
        }

        /**
         * Gets the corresponding name using the current language of a number
         * with up to three digits.
         * 
         * @param {string} number - The number with up to three digits.
         * @returns {string} The name of the number in the current language.
         */
        const getDigitsName = (number) => {
            // Get the number of digits
            const digits = number.length;

            // Get the name based on the number of digits
            let name = '';
            switch (digits) {
                case 1:
                    name = units[lang][number];
                    break;
                case 2:
                    name = getTwoDigitsName(number);
                    break;
                case 3:
                    // Get the current hundreds
                    const Hundreds = hundreds[lang];

                    // Check if the number is a multiple of 100
                    if (number.endsWith('00')) name = Hundreds[number];
                    else {
                        // Get the base of the number
                        name = Hundreds[number[0] + '00x'] || '';
                        // Add the rest of the number
                        name += getTwoDigitsName(number[1] + number[2]);
                    }
                    break;
            }

            return name;
        }

        /**
         * Names the integer part of a number by separating all its digits into
         * groups of three digits. Returns the name.
         * 
         * @param {string} intPart - The integer part of the number.
         * @returns {string} The name of the integer part.
         */
        const getIntegerPartName = (intPart) => {
            // Get the properties of the number
            const isNegative = intPart.startsWith('-');
            const digits = (isNegative) ? intPart.length - 1 : intPart.length;
            let name = '';

            // Get the 'remaining' objects to name the number.
            const numbers = remaining[lang].numbers;
            const scaleObj = remaining[lang].scale;
            const orderKeys = remaining.orderKeys;
            const lastOrderKeysIdx = orderKeys.length - 1;
            const dPS = scaleObj.digitsPerScale;

            /**
             * Updates the scale sent with the operation sent (decrease or
             * increase).
             * 
             * @param {object} scale - The scale to update.
             * @param {'decrease'|'increase'} op - The operation to be applied.
             * @returns {void}
             */
            const updateScale = (scale, op) => {
                if (op == 'decrease') scale.idx--;
                else if (op == 'increase') scale.idx++;
                else return;

                // Validate the new index of the scale
                if (scale.idx >= 0 && scale.idx <= lastOrderKeysIdx) {
                    scale.key = orderKeys[scale.idx];
                    scale.power = scaleObj[scale.key];
                }
            }

            /**
             * Generates and returns the current scale based on the digits sent.
             * If the number of digits is not enough to get one scale returns
             * null.
             * 
             * @param {number} digits - The digits to obtain the scale.
             * @returns {object|null} The corresponding scale if exists.
             */
            const getScale = (digits) => {
                // Check if there are enough digits to get a scale
                if (digits < scaleObj.minimumDigits) return null;

                // Set the first scale (thousand)
                const scale = { idx: 0 };
                scale.key = orderKeys[scale.idx];
                scale.power = scaleObj[scale.key];

                // Check if the 'thousand' scale is correct
                if (digits <= scale.power + 3) return scale;

                // Increase to a 'illion' scale
                updateScale(scale, 'increase');

                // Keep increasing until get the correct one
                while (digits > scale.power + dPS) {
                    updateScale(scale, 'increase');
                }

                return scale;
            }

            /**
             * Generates the name of a three-digit group in a sent scale.
             * Returns the generated name.
             * 
             * @param {object} scale - The current scale of the group.
             * @param {string} threeDigitsGroup - The current three-digit group.
             * @returns {string} The name of the group in the sent scale.
             */
            const getScaleName = (scale, threeDigitsGroup) => {
                // Validate the scale and the three digits group
                if (scale.idx < 0) return '';
                if (threeDigitsGroup == '000') return '';

                // Generate the name of the group with the scale
                //--The number
                let name = getDigitsName(threeDigitsGroup) + ' ';
                //--The scale
                name += (threeDigitsGroup == '001') ?
                    numbers[scale.key] :  // Singular
                    numbers[scale.key + 'x'];  // Plural

                // Fix the gramatical error in Spanish with 'one thousand'
                if (lang == 'es' && name == 'un mil') name = 'mil';

                return name + ' ';
            }

            /**
             * Gets the name of a group of digits (the number of digits depends
             * on the language) with the corresponding scale.
             * 
             * @param {string} digitsGroup - The group of digits.
             * @param {object} curScale - The current scale of the group.
             * @returns {string} The name of the current group with the scale.
             */
            const getGroupName = (digitsGroup, curScale) => {
                // Split the current group into three-digit subgroups
                const subGroups = [];
                for (let i = 0; i < digitsGroup.length; i++) {
                    // Add the subgroup
                    if (i % 3 == 0) subGroups.push('');

                    // Add the digis to the corresponding subgroup
                    const lastIdx = subGroups.length - 1;
                    subGroups[lastIdx] += digitsGroup[i];
                }

                // Name all the subgroups except the last one.
                let name = '';
                let hadAtLeastOne = false;
                const subScale = getScale(dPS);
                for (let i = 0; i < subGroups.length - 1; i++) {
                    const curSubGroup = subGroups[i];

                    // Add the name of the current scale
                    name += getScaleName(subScale, curSubGroup);

                    // Change the value of the flag
                    if (name != '') hadAtLeastOne = true;

                    // Decrease the scale
                    updateScale(subScale, 'decrease');
                }

                // Get the last subgroup to name it
                const lastSubGroup = subGroups.at(-1);

                // Check if the last group will not be named
                if (lastSubGroup == '000' && (dPS == 3 || !hadAtLeastOne)) {
                    // Decrease the scale
                    updateScale(curScale, 'decrease');

                    // Add a final space in the name if exists
                    if (name != '') name += ' ';
                    return name;
                }

                // Create the name of the last subgroup
                //--The number
                let lastSubGroupName = (lastSubGroup != '000') ?
                    getDigitsName(lastSubGroup) + ' ' :
                    '';

                // Fix the final gramatical errors in Spanish
                if (lang == 'es' && curScale.idx <= 0) {
                    const fixs = [['un ', 'uno '], ['veintiún ', 'veintiuno ']];

                    // Correct all the fixes
                    for (const fix of fixs) {
                        if (lastSubGroupName.endsWith(fix[0])) {
                            lastSubGroupName = lastSubGroupName.replace(
                                fix[0], fix[1]
                            );
                        }
                    }
                }

                //--The scale
                const isThousandInBigDPS = curScale.idx == 0 && dPS > 3;
                const isLessThanThousandInLowDPS = curScale.idx < 0 && dPS == 3;
                if (!isThousandInBigDPS && !isLessThanThousandInLowDPS) {
                    if (lastSubGroup == '001') {  // Singular
                        // Fix the gramatical error '001' plural in spanish
                        if (lang == 'es' && hadAtLeastOne) {
                            lastSubGroupName += numbers[curScale.key + 'x'];
                        } else {
                            lastSubGroupName += numbers[curScale.key];
                        }
                    } else {  // Plural
                        lastSubGroupName += numbers[curScale.key + 'x'];
                    }
                }

                // Decrease the scale
                updateScale(curScale, 'decrease');

                // Return the name
                name += lastSubGroupName + ' ';
                return name;
            }

            // Start naming of the number checking if the number is negative
            if (isNegative) {
                name += signs[lang].minus + ' ';
                intPart = intPart.slice(1);
            }

            // Check if the number is short
            if (digits <= 3) {
                // Get the name of all the integer part
                name += getDigitsName(intPart);

                // Fix the final gramatical errors in Spanish
                if (lang == 'es') {
                    const fixs = [['un', 'uno'], ['veintiún', 'veintiuno']];

                    // Correct all the fixes
                    for (const fix of fixs) {
                        if (name.endsWith(fix[0])) {
                            name = name.replace(fix[0], fix[1]);
                        }
                    }
                }

                return name;
            }

            // Generate the scale of the number
            const scale = getScale(digits);

            // Checks if the beginning of the number doesn't have the separation
            const start = digits % dPS;
            let i = 0;
            if (start) {
                // Get the begining number
                let begNumber = '';
                for (let j = 0; j < start; j++) begNumber += intPart[i++];

                // Fill the current group with '0'
                for (let j = start; j < dPS; j++) begNumber = '0' + begNumber;

                // Name the begining number with the current scale
                name += getGroupName(begNumber, scale);
            }

            // Start the cycle to name the number
            while (i < digits) {
                // Set the current group with three digits
                let currentGroup = '';
                for (let j = 0; j < dPS; j++) currentGroup += intPart[i++];

                // Add the current group to the name
                name += getGroupName(currentGroup, scale,);
            }

            return name.trimEnd();
        }

        /**
         * Names the decimal part of a number by adding the word 'period' and
         * naming each digit one by one. Returns the name.
         * 
         * @param {string} decPart - The decimal part of the number.
         * @returns {string} The name of the decimal part.
         */
        const getDecimalPartName = (decPart) => {
            // Check if the decimal part exists
            if (!decPart) return '';

            // Set the 'point' word in the name
            let signName = ' ' + signs[lang].point;
            let name = '';

            // Check if the language is Spanish and the digits are three or less
            if (lang == 'es' && decPart.length <= 3) {
                name += ' ' + getDigitsName(decPart);
            } else {
                // Name each digit one by one
                for (const dig of decPart) name += ' ' + getDigitsName(dig);
            }

            // Fix the final gramatical errors in Spanish
            if (lang == 'es') {
                const fixs = [[' un', ' uno'], ['veintiún', 'veintiuno']];

                // Correct all the fixes
                for (const fix of fixs) name = name.replaceAll(fix[0], fix[1]);
            }

            return signName + name;
        }

        // Generate the number
        const [intPart, decPart] = number.split('.');
        return getIntegerPartName(intPart) + getDecimalPartName(decPart);
    }
}

export class COctal extends CBase {
    static validChars = ['0', '1', '2', '3', '4', '5', '6', '7'];

    static binaryDigits = {
        '0': '000', '1': '001', '2': '010', '3': '011',
        '4': '100', '5': '101', '6': '110', '7': '111'
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
        return this._base2GeneralTemplate(number, 'decimal', this.binaryDigits);
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
        return this._base2GeneralTemplate(number, 'integer', this.binaryDigits);
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
        return CDecimal.tobase62(decimalNumber, customChars);
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
        return CBinary.tohexadecimal(binaryNumber);
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
            CDecimal.validChars,
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
            CBinary.validChars,
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
     * @param {string} number - The number to 'translate' in text format.
     * @param {'en'|'es'} lang - The language to 'translate' the number.
     * @returns The number in text format in the sent language.
     */
    static totext(number, lang) {
        const decimalNumber = this.todecimal(number);
        return CDecimal.totext(decimalNumber, lang);
    }
}

export class CBinary extends CBase {
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
        return CDecimal.tobase62(decimalNumber, customChars);
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
            CHexadecimal.validChars,
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
            CDecimal.validChars,
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
            COctal.validChars,
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
     * @param {string} number - The number to 'translate' in text format.
     * @param {'en'|'es'} lang - The language to 'translate' the number.
     * @returns The number in text format in the sent language.
     */
    static totext(number, lang) {
        const decimalNumber = this.todecimal(number);
        return CDecimal.totext(decimalNumber, lang);
    }
}

export class CBase62 extends CBase {
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

        // Change each digit of the number for the new digits order
        let newNumber = '';
        for (const dig of number) {
            // Find the index of the current digit
            const idx = initialCharsOrder.indexOf(dig);

            // Add the corresponding digit to the new number
            newNumber += finalCharsOrder[idx];
        }

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
        return CDecimal.tohexadecimal(decimalNumber);
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
            CDecimal.validChars,
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
        return CDecimal.tooctal(decimalNumber);
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
        return CDecimal.tobinary(decimalNumber);
    }

    /**
     * Converts one base 62 number to the corresponding text (as if the number
     * were written). The translation can be in two languages: English and
     * Spanish. The decimal number can be negative and contain a decimal part.
     * This method will make two conversions, one from base 62 to decimal and
     * the second one from decimal to text.
     * 
     * @param {string} number - The number to 'translate' in text format.
     * @param {'en'|'es'} lang - The language to 'translate' the number.
     * @returns The number in text format in the sent language.
     */
    static totext(number, customChars, lang) {
        const decimalNumber = this.todecimal(number, customChars);
        return CDecimal.totext(decimalNumber, lang);
    }
}

export class CText extends CBase {
    static validChars = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Á',
        'É', 'Í', 'Ó', 'Ú', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
        'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
        'x', 'y', 'z', 'á', 'é', 'í', 'ó', 'ú'
    ];
    static _removeAllWhiteSpaces = false;
    static _canContainMinus = false;
    static _canContainPeriod = false;
}