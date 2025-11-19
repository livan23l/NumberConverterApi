export class Base {
    static validChars = [];
    static _removeAllWhiteSpaces = true;
    static _canContainMinus = true;
    static _canContainPeriod = true;

    /**
     * Returns a regular expression that removes leading and trailing zeros from
     * a string. This function takes the character that identifies zero in a
     * given base and escapes it if it's a special regular expression character.
     * 
     * @private
     * @static
     * @param {string} cur0 - The character that is the zero in the base.
     * @param {"leading"|"trailing"} type - The type of regular expresion.
     * @returns {RegExp} The regular expression to remove the 'type' zeros.
     */
    static _getRegexForZeros(cur0, type) {
        const safe0 = cur0.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        if (type == 'leading') return new RegExp(`^${safe0}+`);
        else if (type == 'trailing') return new RegExp(`${safe0}+$`);
    }

    /**
     * Standardize the value following this rules:
     * - Removes the leading zeros for the integer part.
     * - Removes the trailing zeros for the decimal part.
     * - Removes all whitespace if the property is true. Otherwise, it only
     * removes leading and trailing spaces, keeping one for intermediate spaces.
     * 
     * @static
     * @param {string} value - The value to be standardized.
     * @param {string} cur0 - The current character that represents zero.
     * @returns {string} The standardized value.
     */
    static standardizeValue(value, cur0) {
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
        value = value.replace(this._getRegexForZeros(cur0, 'leading'), '');

        // Check if the value contains '.' to remove the trailing zeros
        if (value.includes('.')) {
            value = value.replace(this._getRegexForZeros(cur0, 'trailing'), '');
        }

        // Check if the start or/and the end of the value is empty
        if (value == '') value = cur0;
        if (value.startsWith('.')) value = cur0 + value;
        if (value.endsWith('.')) value += cur0;

        // Add the negative sign if the value is not '0'
        const zeros = [cur0, `${cur0}.${cur0}`];
        if (hasNegSign && !zeros.includes(value)) value = '-' + value;

        return value;
    }

    /**
     * Check whether the value is valid or not depending on the following flags:
     * - `_canContainMinus`: Set if the value can starts with '-'.
     * - `_canContainPeriod`: Set if the value can contian one '.'.
     * 
     * @static
     * @param {string} value - The string with the current value
     * @param {string[]} validChars - The characters that are considered valid.
     * @returns {boolean} The result of the validation
     */
    static validate(value, validChars) {
        // Make the necessary validations if the number is negative
        if (value.startsWith('-')) {
            if (!this._canContainMinus) return false;
            value = value.slice(1);  // Remove the 'minus' sign
        }

        // Make the necessary validations if the number is decimal
        if (value.includes('.')) {
            if (!this._canContainPeriod) return false;

            // Remove the period
            const idxPeriod = value.indexOf('.');
            value = value.slice(0, idxPeriod) + value.slice(idxPeriod + 1);
        }

        // Validate the rest of the characters
        for (let i = 0; i < value.length; i++) {
            const character = value[i];
            if (!validChars.includes(character)) return false;
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
     * @static
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
     * @static
     * @param {string} number - The number with a power of two base.
     * @param {'integer'|'decimal'} typeOfNumber - The sent part of the number.
     * @param {object} binDigits - The binary representation of the base.
     * @param {string[]} baseChars - The valid characters of the number base.
     * @returns {string} The binary conversion of the number.
     */
    static _base2GeneralTemplate(number, typeOfNumber, binDigits, baseChars) {
        // Make the conversion for each digit
        let res = '';
        for (const dig of number) {
            const digIdx = baseChars.indexOf(dig);
            res += binDigits[digIdx];
        }

        // Remove the leading or trailing zeros
        if (typeOfNumber == 'integer') {
            res = res.replace(this._getRegexForZeros('0', 'leading'), '');
        } else {
            res = res.replace(this._getRegexForZeros('0', 'trailing'), '');
        }

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
        const zeroRegex = this._getRegexForZeros(cur0, 'trailing');
        result = result.replace(zeroRegex, '');
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
        const zeroRegex = this._getRegexForZeros(cur0, 'leading');
        result = result.replace(zeroRegex, '');
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
        const cur0 = curChars[0]
        if (intPart == cur0 || intPart == `-${cur0}`) {
            // Set the corresponding new zero in the final value
            const new0 = newChars[0];
            const joinedNumber = new0 + result.join('');
            const finalNumber = ((isNegative) ? '-' : '') + joinedNumber;

            // Return the final number with one correction for '-0.0'
            if (finalNumber == `-${new0}.${new0}`) return `${new0}.${new0}`;
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

    /**
     * Returns the character that represents zero in the current base. This
     * method acts as a template for bases that don't have variable character
     * orders.
     * 
     * @static
     * @returns {"0"} The character that represents zero in most bases.
     */
    static getCurrentZero() { return '0'; }
}