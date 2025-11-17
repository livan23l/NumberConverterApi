import { Base } from "./Base.js";
import { Base62 } from "./Base62.js";
import { Hexadecimal } from "./Hexadecimal.js";
import { Octal } from "./Octal.js";
import { Binary } from "./Binary.js";

export class Decimal extends Base {
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
            : Base62.validChars;

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
            Hexadecimal.validChars,
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
            Octal.validChars,
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
            Binary.validChars,
            this.#getDecimals,
            this.#getIntegers,
        );
    }

    /**
     * Converts a decimal number to the corresponding text (as if the number
     * were written). The translation can be in two languages: English and
     * Spanish. The decimal number can be negative and contain a decimal part.
     * 
     * @static
     * @param {string} number - The number to 'translate' in text format.
     * @param {'en'|'es'} lang - The language to 'translate' the number.
     * @returns The number in text format in the sent language.
     */
    static totext(number, lang) {
        // Define the names according to the number of digits
        const units = {
            es: {
                0: 'cero', 1: 'un', 2: 'dos', 3: 'tres', 4: 'cuatro',
                5: 'cinco', 6: 'seis', 7: 'siete', 8: 'ocho',
                9: 'nueve'
            },
            en: {
                0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four',
                5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine'
            }
        };
        const tens = {
            es: {
                breakpoint: '30',
                union: ' y ',
                numbers: {
                    10: 'diez', 11: 'once', 12: 'doce', 13: 'trece',
                    14: 'catorce', 15: 'quince', 16: 'dieciséis',
                    17: 'diecisiete', 18: 'dieciocho', 19: 'diecinueve',
                    20: 'veinte', 21: 'veintiún', 22: 'veintidós',
                    23: 'veintitrés', 24: 'veinticuatro',
                    25: 'veinticinco', 26: 'veintiséis',
                    27: 'veintisiete', 28: 'veintiocho',
                    29: 'veintinueve', 30: 'treinta', 40: 'cuarenta',
                    50: 'cincuenta', 60: 'sesenta', 70: 'setenta',
                    80: 'ochenta', 90: 'noventa'
                }
            },
            en: {
                breakpoint: '20',
                union: '-',
                numbers: {
                    10: 'ten', 11: 'eleven', 12: 'twelve',
                    13: 'thirteen', 14: 'fourteen', 15: 'fifteen',
                    16: 'sixteen', 17: 'seventeen', 18: 'eighteen',
                    19: 'nineteen', 20: 'twenty', 30: 'thirty',
                    40: 'forty', 50: 'fifty', 60: 'sixty',
                    70: 'seventy', 80: 'eighty', 90: 'ninety'
                }
            }
        };
        const hundreds = {
            es: {
                100: 'cien', '100x': 'ciento ',
                200: 'doscientos', '200x': 'doscientos ',
                300: 'trescientos', '300x': 'trescientos ',
                400: 'cuatrocientos', '400x': 'cuatrocientos ',
                500: 'quinientos', '500x': 'quinientos ',
                600: 'seiscientos', '600x': 'seiscientos ',
                700: 'setecientos', '700x': 'setecientos ',
                800: 'ochocientos', '800x': 'ochocientos ',
                900: 'novecientos', '900x': 'novecientos '
            },
            en: {
                100: 'one hundred', '100x': 'one hundred ',
                200: 'two hundred', '200x': 'two hundred ',
                300: 'three hundred', '300x': 'three hundred ',
                400: 'four hundred', '400x': 'four hundred ',
                500: 'five hundred', '500x': 'five hundred ',
                600: 'six hundred', '600x': 'six hundred ',
                700: 'seven hundred', '700x': 'seven hundred ',
                800: 'eight hundred', '800x': 'eight hundred ',
                900: 'nine hundred', '900x': 'nine hundred '
            }
        };
        const remaining = {
            orderKeys: [
                'thousand', 'million', 'billion', 'trillion', 'quadrillion',
                'quintillion', 'sextillion', 'septillion', 'octillion',
                'nonillion', 'decillion', 'undecillion', 'duodecillion',
                'tredecillion', 'quattuordecillion', 'quindecillion',
                'sexdecillion', 'septendecillion', 'octodecillion',
                'novemdecillion', 'vigintillion'
            ],
            es: {
                scale: {
                    digitsPerScale: 6, minimumDigits: 4,
                    maximumDigits: 126, thousand: 3, million: 6,
                    billion: 12, trillion: 18, quadrillion: 24,
                    quintillion: 30, sextillion: 36, septillion: 42,
                    octillion: 48, nonillion: 54, decillion: 60,
                    undecillion: 66, duodecillion: 72, tredecillion: 78,
                    quattuordecillion: 84, quindecillion: 90,
                    sexdecillion: 96, septendecillion: 102,
                    octodecillion: 108, novemdecillion: 114,
                    vigintillion: 120
                },
                numbers: {
                    thousand: 'mil', thousandx: 'mil',
                    million: 'millón', millionx: 'millones',
                    billion: 'billón', billionx: 'billones',
                    trillion: 'trillón', trillionx: 'trillones',
                    quadrillion: 'cuatrillón', quadrillionx: 'cuatrillones',
                    quintillion: 'quintillón', quintillionx: 'quintillones',
                    sextillion: 'sextillón', sextillionx: 'sextillones',
                    septillion: 'septillón', septillionx: 'septillones',
                    octillion: 'octillón', octillionx: 'octillones',
                    nonillion: 'nonillón', nonillionx: 'nonillones',
                    decillion: 'decillón', decillionx: 'decillones',
                    undecillion: 'undecillón', undecillionx: 'undecillones',
                    duodecillion: 'duodecillón',
                    duodecillionx: 'duodecillones',
                    tredecillion: 'tredecillón',
                    tredecillionx: 'tredecillones',
                    quattuordecillion: 'cuatordecillón',
                    quattuordecillionx: 'cuatordecillones',
                    quindecillion: 'quindecillón',
                    quindecillionx: 'quindecillones',
                    sexdecillion: 'sexdecillón',
                    sexdecillionx: 'sexdecillones',
                    septendecillion: 'septendecillón',
                    septendecillionx: 'septendecillones',
                    octodecillion: 'octodecillón',
                    octodecillionx: 'octodecillones',
                    novemdecillion: 'novendecillón',
                    novemdecillionx: 'novendecillones',
                    vigintillion: 'vigintillón',
                    vigintillionx: 'vigintillones'
                }
            },
            en: {
                scale: {
                    digitsPerScale: 3, minimumDigits: 4,
                    maximumDigits: 66, thousand: 3, million: 6,
                    billion: 9, trillion: 12, quadrillion: 15,
                    quintillion: 18, sextillion: 21, septillion: 24,
                    octillion: 27, nonillion: 30, decillion: 33,
                    undecillion: 36, duodecillion: 39, tredecillion: 42,
                    quattuordecillion: 45, quindecillion: 48,
                    sexdecillion: 51, septendecillion: 54,
                    octodecillion: 57, novemdecillion: 60,
                    vigintillion: 63
                },
                numbers: {
                    thousand: 'thousand', thousandx: 'thousand',
                    million: 'million', millionx: 'million',
                    billion: 'billion', billionx: 'billion',
                    trillion: 'trillion', trillionx: 'trillion',
                    quadrillion: 'quadrillion', quadrillionx: 'quadrillion',
                    quintillion: 'quintillion', quintillionx: 'quintillion',
                    sextillion: 'sextillion', sextillionx: 'sextillion',
                    septillion: 'septillion', septillionx: 'septillion',
                    octillion: 'octillion', octillionx: 'octillion',
                    nonillion: 'nonillion', nonillionx: 'nonillion',
                    decillion: 'decillion', decillionx: 'decillion',
                    undecillion: 'undecillion', undecillionx: 'undecillion',
                    duodecillion: 'duodecillion',
                    duodecillionx: 'duodecillion',
                    tredecillion: 'tredecillion',
                    tredecillionx: 'tredecillion',
                    quattuordecillion: 'quattuordecillion',
                    quattuordecillionx: 'quattuordecillion',
                    quindecillion: 'quindecillion',
                    quindecillionx: 'quindecillion',
                    sexdecillion: 'sexdecillion',
                    sexdecillionx: 'sexdecillion',
                    septendecillion: 'septendecillion',
                    septendecillionx: 'septendecillion',
                    octodecillion: 'octodecillion',
                    octodecillionx: 'octodecillion',
                    novemdecillion: 'novemdecillion',
                    novemdecillionx: 'novemdecillion',
                    vigintillion: 'vigintillion',
                    vigintillionx: 'vigintillion'
                }
            }
        };
        const signs = {
            es: {
                point: 'punto', minus: 'menos'
            },
            en: {
                point: 'point', minus: 'minus'
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
            if (lang == 'es' && decPart.length <= 3 && decPart[0] != '0') {
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

        // Validate if the integer part of the number is too long
        const isNegative = (intPart.startsWith('-'));
        const langMax = remaining[lang].scale.maximumDigits;
        const maxDigits = (isNegative) ? langMax + 1 : langMax;
        if (intPart.length > maxDigits) return 'NTL';

        // Return the number converted
        return getIntegerPartName(intPart) + getDecimalPartName(decPart);
    }
}