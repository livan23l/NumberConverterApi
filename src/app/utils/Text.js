import { Base } from "./Base.js";
import { Decimal } from "./Decimal.js";

export class Text extends Base {
    static validChars = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Á',
        'É', 'Í', 'Ó', 'Ú', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
        'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
        'x', 'y', 'z', 'á', 'é', 'í', 'ó', 'ú', '-', ' '
    ];
    static _removeAllWhiteSpaces = false;
    static _canContainMinus = false;
    static _canContainPeriod = false;

    /**
     * Converts one written number into base 62 format. The number can be in two
     * languages: English and Spanish. The written number can be negative and
     * contain a decimal written part. This method will make two conversions,
     * one from text to decimal and the second one from decimal to base 62.
     * 
     * @static
     * @param {string} number - The written number.
     * @param {"es"|"en"} lang - The language of the number.
     * @param {string[]} customChars - The custom initial character order.
     * @returns {string} The number in base 62 format.
     */
    static tobase62(number, lang, customChars) {
        const decimalNumber = this.todecimal(number, lang);
        if (decimalNumber == 'NaN') return decimalNumber;

        return Decimal.tobase62(decimalNumber, customChars);
    }

    /**
     * Converts one written number into hexadecimal format. The number can be in
     * two languages: English and Spanish. The written number can be negative
     * and contain a decimal written part. This method will make two conversions,
     * one from text to decimal and the second one from decimal to hexadecimal.
     * 
     * @static
     * @param {string} number - The written number.
     * @param {"es"|"en"} lang - The language of the number.
     * @returns {string} The number in hexadecimal format.
     */
    static tohexadecimal(number, lang) {
        const decimalNumber = this.todecimal(number, lang);
        if (decimalNumber == 'NaN') return decimalNumber;

        return Decimal.tohexadecimal(decimalNumber);
    }

    /**
     * Converts one written number into decimal format. The number can be in two
     * languages: English and Spanish. The written number can be negative and
     * contain a decimal written part.
     * 
     * @static
     * @param {string} number - The written number.
     * @param {"es"|"en"} lang - The language of the number.
     * @return {string} The number in decimal format.
     */
    static todecimal(number, lang) {
        // Generate relationships between names and numbers in units
        const unitsNext = {
            es: 'illions|thousands|point',
            en: 'illions|thousands|hundreds|point'
        };
        const units = {
            es: {
                cero: { num: '0', next: 'point', dec: true },
                uno: { num: '1', next: 'point', dec: true },
                un: { num: '1', next: 'illion|illions|thousands', dec: false },
                dos: { num: '2', next: unitsNext.es, dec: true },
                tres: { num: '3', next: unitsNext.es, dec: true },
                cuatro: { num: '4', next: unitsNext.es, dec: true },
                cinco: { num: '5', next: unitsNext.es, dec: true },
                seis: { num: '6', next: unitsNext.es, dec: true },
                siete: { num: '7', next: unitsNext.es, dec: true },
                ocho: { num: '8', next: unitsNext.es, dec: true },
                nueve: { num: '9', next: unitsNext.es, dec: true },
            },
            en: {
                zero: { num: '0', next: 'point', dec: true },
                one: { num: '1', next: unitsNext.en, dec: true },
                two: { num: '2', next: unitsNext.en, dec: true },
                three: { num: '3', next: unitsNext.en, dec: true },
                four: { num: '4', next: unitsNext.en, dec: true },
                five: { num: '5', next: unitsNext.en, dec: true },
                six: { num: '6', next: unitsNext.en, dec: true },
                seven: { num: '7', next: unitsNext.en, dec: true },
                eight: { num: '8', next: unitsNext.en, dec: true },
                nine: { num: '9', next: unitsNext.en, dec: true },
            }
        };
        const unitsForScale = {
            es: [
                'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho',
                'nueve'
            ],
            en: [
                'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
                'nine'
            ],
        };

        // Generate relationships between names and numbers in tens
        const tensNext = {
            es: ['illions|thousands|point', 'illions|thousands|conn|point'],
            en: ['illions|thousands|point', 'illions|thousands|conn|point']
        };
        const tens = {
            es: {
                diez: { num: '10', next: tensNext.es[0], dec: true },
                once: { num: '11', next: tensNext.es[0], dec: true },
                doce: { num: '12', next: tensNext.es[0], dec: true },
                trece: { num: '13', next: tensNext.es[0], dec: true },
                catorce: { num: '14', next: tensNext.es[0], dec: true },
                quince: { num: '15', next: tensNext.es[0], dec: true },
                'dieciséis': { num: '16', next: tensNext.es[0], dec: true },
                diecisiete: { num: '17', next: tensNext.es[0], dec: true },
                dieciocho: { num: '18', next: tensNext.es[0], dec: true },
                diecinueve: { num: '19', next: tensNext.es[0], dec: true },
                veinte: { num: '20', next: tensNext.es[0], dec: true },
                'veintiún': { num: '21', next: tensNext.es[0], dec: true },
                veintiuno: { num: '21', next: 'point', dec: true },
                'veintidós': { num: '22', next: tensNext.es[0], dec: true },
                'veintitrés': { num: '23', next: tensNext.es[0], dec: true },
                veinticuatro: { num: '24', next: tensNext.es[0], dec: true },
                veinticinco: { num: '25', next: tensNext.es[0], dec: true },
                'veintiséis': { num: '26', next: tensNext.es[0], dec: true },
                veintisiete: { num: '27', next: tensNext.es[0], dec: true },
                veintiocho: { num: '28', next: tensNext.es[0], dec: true },
                veintinueve: { num: '29', next: tensNext.es[0], dec: true },

                treinta: { num: '30', next: tensNext.es[1], dec: true },
                cuarenta: { num: '40', next: tensNext.es[1], dec: true },
                cincuenta: { num: '50', next: tensNext.es[1], dec: true },
                sesenta: { num: '60', next: tensNext.es[1], dec: true },
                setenta: { num: '70', next: tensNext.es[1], dec: true },
                ochenta: { num: '80', next: tensNext.es[1], dec: true },
                noventa: { num: '90', next: tensNext.es[1], dec: true }
            },
            en: {
                ten: { num: '10', next: tensNext.en[0], dec: false },
                eleven: { num: '11', next: tensNext.en[0], dec: false },
                twelve: { num: '12', next: tensNext.en[0], dec: false },
                thirteen: { num: '13', next: tensNext.en[0], dec: false },
                fourteen: { num: '14', next: tensNext.en[0], dec: false },
                fifteen: { num: '15', next: tensNext.en[0], dec: false },
                sixteen: { num: '16', next: tensNext.en[0], dec: false },
                seventeen: { num: '17', next: tensNext.en[0], dec: false },
                eighteen: { num: '18', next: tensNext.en[0], dec: false },
                nineteen: { num: '19', next: tensNext.en[0], dec: false },

                twenty: { num: '20', next: tensNext.en[1], dec: false },
                thirty: { num: '30', next: tensNext.en[1], dec: false },
                forty: { num: '40', next: tensNext.en[1], dec: false },
                fifty: { num: '50', next: tensNext.en[1], dec: false },
                sixty: { num: '60', next: tensNext.en[1], dec: false },
                seventy: { num: '70', next: tensNext.en[1], dec: false },
                eighty: { num: '80', next: tensNext.en[1], dec: false },
                ninety: { num: '90', next: tensNext.en[1], dec: false }
            }
        };

        // Generate relationships between names and numbers in hundreds
        const hundredsNext = {
            es: 'illions|thousands|tens|unitsForS|:uno|point',
            en: 'illions|thousands|tens|unitsForS|point'
        };
        const hundreds = {
            es: {
                cien: { num: '100', next: 'illions|thousands|point', dec: true },
                ciento: { num: '100', next: hundredsNext.es, dec: true },
                doscientos: { num: '200', next: hundredsNext.es, dec: true },
                trescientos: { num: '300', next: hundredsNext.es, dec: true },
                cuatrocientos: { num: '400', next: hundredsNext.es, dec: true },
                quinientos: { num: '500', next: hundredsNext.es, dec: true },
                seiscientos: { num: '600', next: hundredsNext.es, dec: true },
                setecientos: { num: '700', next: hundredsNext.es, dec: true },
                ochocientos: { num: '800', next: hundredsNext.es, dec: true },
                novecientos: { num: '900', next: hundredsNext.es, dec: true }
            },
            en: {
                hundred: { num: '100', next: hundredsNext.en, dec: true }
            }
        };

        // Generate relationships between names and numbers in thousands
        const thousandsNext = {
            es: 'illions|hundreds|tens|unitsForS|:uno|point',
            en: 'tens|unitsForS|point'
        };
        const thousands = {
            es: {
                mil: { num: '1000', next: thousandsNext.es, dec: false }
            },
            en: {
                thousand: { num: '1000', next: thousandsNext.en, dec: false }
            }
        };

        // Generate relationships between names and numbers in 'illions'
        const illionsNext = {
            es: 'illions|thousands|hundreds|tens|unitsForS|:uno|point',
            en: 'tens|unitsForS|point'
        };
        const illions = {
            es: {
                'millón': {
                    num: '1000000',
                    next: illionsNext.es,
                    dec: false
                },
                millones: {
                    num: '1000000',
                    next: illionsNext.es,
                    dec: false
                },
                'billón': {
                    num: '1000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                billones: {
                    num: '1000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                'trillón': {
                    num: '1000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                trillones: {
                    num: '1000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                'cuatrillón': {
                    num: '1000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                cuatrillones: {
                    num: '1000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                'quintillón': {
                    num: '1000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                quintillones: {
                    num: '1000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                'sextillón': {
                    num: '1000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                sextillones: {
                    num: '1000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                'septillón': {
                    num: '1000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                septillones: {
                    num: '1000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                'octillón': {
                    num: '1000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                octillones: {
                    num: '1000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                'nonillón': {
                    num: '1000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                nonillones: {
                    num: '1000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                'decillón': {
                    num: '1000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                decillones: {
                    num: '1000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                'undecillón': {
                    num: '1000000000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                undecillones: {
                    num: '1000000000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                'duodecillón': {
                    num: '1000000000000000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                duodecillones: {
                    num: '1000000000000000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                'tredecillón': {
                    num: '1000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                tredecillones: {
                    num: '1000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                'cuatordecillón': {
                    num: '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                cuatordecillones: {
                    num: '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                'quindecillón': {
                    num: '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                quindecillones: {
                    num: '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                'sexdecillón': {
                    num: '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                sexdecillones: {
                    num: '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                'septendecillón': {
                    num: '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                septendecillones: {
                    num: '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                'octodecillón': {
                    num: '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                octodecillones: {
                    num: '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                'novendecillón': {
                    num: '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                novendecillones: {
                    num: '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                'vigintillón': {
                    num: '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                },
                vigintillones: {
                    num: '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.es,
                    dec: false
                }
            },
            en: {
                million: {
                    num: '1000000',
                    next: illionsNext.en,
                    dec: false
                },
                billion: {
                    num: '1000000000',
                    next: illionsNext.en,
                    dec: false
                },
                trillion: {
                    num: '1000000000000',
                    next: illionsNext.en,
                    dec: false
                },
                quadrillion: {
                    num: '1000000000000000',
                    next: illionsNext.en,
                    dec: false
                },
                quintillion: {
                    num: '1000000000000000000',
                    next: illionsNext.en,
                    dec: false
                },
                sextillion: {
                    num: '1000000000000000000000',
                    next: illionsNext.en,
                    dec: false
                },
                septillion: {
                    num: '1000000000000000000000000',
                    next: illionsNext.en,
                    dec: false
                },
                octillion: {
                    num: '1000000000000000000000000000',
                    next: illionsNext.en,
                    dec: false
                },
                nonillion: {
                    num: '1000000000000000000000000000000',
                    next: illionsNext.en,
                    dec: false
                },
                decillion: {
                    num: '1000000000000000000000000000000000',
                    next: illionsNext.en,
                    dec: false
                },
                undecillion: {
                    num: '1000000000000000000000000000000000000',
                    next: illionsNext.en,
                    dec: false
                },
                duodecillion: {
                    num: '1000000000000000000000000000000000000000',
                    next: illionsNext.en,
                    dec: false
                },
                tredecillion: {
                    num: '1000000000000000000000000000000000000000000',
                    next: illionsNext.en,
                    dec: false
                },
                quattuordecillion: {
                    num: '1000000000000000000000000000000000000000000000',
                    next: illionsNext.en,
                    dec: false
                },
                quindecillion: {
                    num: '1000000000000000000000000000000000000000000000000',
                    next: illionsNext.en,
                    dec: false
                },
                sexdecillion: {
                    num: '1000000000000000000000000000000000000000000000000000',
                    next: illionsNext.en,
                    dec: false
                },
                septendecillion: {
                    num: '1000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.en,
                    dec: false
                },
                octodecillion: {
                    num: '1000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.en,
                    dec: false
                },
                novemdecillion: {
                    num: '1000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.en,
                    dec: false
                },
                vigintillion: {
                    num: '1000000000000000000000000000000000000000000000000000000000000000',
                    next: illionsNext.en,
                    dec: false
                }
            }
        };

        // Set the name of the additional things (points and connectors)
        const additionals = {
            es: {
                minus: { symbol: '-', name: 'menos' },
                punto: {
                    symbol: '.',
                    next: 'hundreds|tens|unitsForS|units',
                    dec: false
                },
                conn: { symbol: 'y', next: 'unitsForS|:uno', dec: true },
                firstWordTypes: 'thousands|hundreds|tens|unitsForS|units',
                illionsOrder: [
                    'millón', 'millones', 'billón', 'billones', 'trillón',
                    'trillones', 'cuatrillón', 'cuatrillones', 'quintillón',
                    'quintillones', 'sextillón', 'sextillones', 'septillón',
                    'septillones', 'octillón', 'octillones', 'nonillón',
                    'nonillones', 'decillón', 'decillones', 'undecillón',
                    'undecillones', 'duodecillón', 'duodecillones',
                    'tredecillón', 'tredecillones', 'cuatordecillón',
                    'cuatordecillones', 'quindecillón', 'quindecillones',
                    'sexdecillón', 'sexdecillones', 'septendecillón',
                    'septendecillones', 'octodecillón', 'octodecillones',
                    'novendecillón', 'novendecillones', 'vigintillón',
                    'vigintillones'
                ]
            },
            en: {
                minus: { symbol: '-', name: 'minus' },
                point: { symbol: '.', next: 'unitsForS|units', dec: false },
                conn: { symbol: '-', next: 'unitsForS', dec: false },
                firstWordTypes: 'tens|unitsForS|units',
                illionsOrder: [
                    'million', 'billion', 'trillion', 'quadrillion',
                    'quintillion', 'sextillion', 'septillion', 'octillion',
                    'nonillion', 'decillion', 'undecillion', 'duodecillion',
                    'tredecillion', 'quattuordecillion', 'quindecillion',
                    'sexdecillion', 'septendecillion', 'octodecillion',
                    'novemdecillion', 'vigintillion'
                ]
            }
        };

        // Get the objects based on the language
        const Units = units[lang];
        const UnitsForScale = unitsForScale[lang];
        const Tens = tens[lang];
        const Hundreds = hundreds[lang];
        const Thousands = thousands[lang];
        const Illions = illions[lang];
        const Additionals = additionals[lang];
        const UnitsKeys = Object.keys(Units);
        const TensKeys = Object.keys(Tens);
        const HundredsKeys = Object.keys(Hundreds);
        const ThousandsKeys = Object.keys(Thousands);
        const IllionsKeys = Object.keys(Illions);
        const AdditionalsKeys = Object.keys(Additionals);

        /**
         * Gets the type of the sent word (units, tens, hundreds, etc.) and its
         * value. It returns both attributes in a single object.
         * 
         * @param {string} word - The current word to get its attributes.
         * @returns {{ type: string, obj: object }} The attributes of the word.
         */
        const getWordAttributes = (word) => {
            // Define the word attributes
            const wordAttributes = { type: null, obj: null };

            // Obtain the attributes
            if (AdditionalsKeys.includes(word)) {  // Point
                wordAttributes.type = 'point';
                wordAttributes.obj = Additionals[word];
            }
            else if (Additionals.conn.symbol == word) {  // Spanish connector
                wordAttributes.type = 'conn';
                wordAttributes.obj = Additionals.conn;
            }
            else if (UnitsKeys.includes(word)) {
                // Validate if the unit is one unit for scale
                if (UnitsForScale.includes(word)) {
                    wordAttributes.type = 'unitsForS';
                } else {
                    wordAttributes.type = 'units';
                }

                wordAttributes.obj = Units[word];
            }
            else if (TensKeys.includes(word)) {
                wordAttributes.type = 'tens';
                wordAttributes.obj = Tens[word];
            }
            else if (HundredsKeys.includes(word)) {
                wordAttributes.type = 'hundreds';
                wordAttributes.obj = Hundreds[word];
            }
            else if (ThousandsKeys.includes(word)) {
                wordAttributes.type = 'thousands';
                wordAttributes.obj = Thousands[word];
            }
            else if (IllionsKeys.includes(word)) {
                // Validate the spanish singular of the '-illions'
                if (word.endsWith('ón')) wordAttributes.type = 'illion';
                else wordAttributes.type = 'illions';

                wordAttributes.obj = Illions[word];
            }

            return wordAttributes;
        };

        /**
         * Gets the value of the sent word, validating whether it has the
         * expected data type. It returns an object containing the current
         * value, the expected data types for the next word, the current type of
         * the word and whether the value can be in the decimal part.
         * 
         * @param {string} word - The current word to obtain its value.
         * @param {string} lastNext - The expected types of the current word.
         * @returns {object} The result.
         */
        const getWordResult = (word, lastNext) => {
            // Define the result structure
            const result = { val: 'NaN', next: '', type: '', dec: false };

            // Get the attributes of the current word and set the type
            const wordAttributes = getWordAttributes(word);
            if (wordAttributes.type == null) return result;
            result.type = wordAttributes.type;

            // Get all the expected types for the current word
            const expectedTypes = lastNext.split('|');

            // Check if the last word expected the current one
            if (
                !expectedTypes.includes(wordAttributes.type) &&
                !expectedTypes.includes(`:${word}`)
            ) return result;

            // Set the 'dec' propety
            result.dec = wordAttributes.obj.dec;

            // Set the val checking if the type of the word is 'point' or 'conn'
            result.val = wordAttributes.obj.num;  // Default result
            if (wordAttributes.type == 'point') result.val = '.';
            if (wordAttributes.type == 'conn') result.val = '0';

            // Set the result.next
            result.next = wordAttributes.obj.next;

            // Return the result
            return result;
        };

        // Make the conversion for all the words
        number = number.toLowerCase();  // Convert the number into lower case
        const numberSplited = number.split(' ');
        let isDecimalPart = false;
        let spanishDecimalAdd = false;
        let thousandBefore = false;
        let lastIllionIdx = Additionals.illionsOrder.length;
        let lastResult = { next: Additionals.firstWordTypes };
        let currentValue = '0';
        let finalValue = '0';

        // Validate if the number is negative
        const isNegative = (numberSplited[0] == Additionals.minus.name);
        if (isNegative) numberSplited.shift();

        /**
         * Updates the final value, the current value and the thousand before
         * flag.
         * 
         * @returns {void}
         */
        const updateFinalValue = () => {
            // Update values based on the decimal flag
            if (isDecimalPart) {
                finalValue += currentValue;
                currentValue = '';
            } else {
                finalValue = this._strIntAddition(finalValue, currentValue);
                currentValue = '0';
            }

            // Update the thousand flag
            thousandBefore = false;
        };

        /**
         * Gets the result of the sent word and validates its value. It also
         * updates the last result and the current value.
         * 
         * @param {string} word - The word to be validated.
         * @returns {boolean} The result of the validation.
         */
        const getAndValidate = (word) => {
            const wordRes = getWordResult(word, lastResult.next);

            // Check the value of the result
            if (wordRes.val == 'NaN') return false;

            // Make the validations for the decimal part
            if (isDecimalPart && !wordRes.dec) return false;

            // Update the last result
            lastResult = wordRes;

            // Update the current value
            if (wordRes.type.includes('illion')) {  // illions or illion
                // Validation for spanish plural
                if (
                    lang == 'es' && currentValue == '1' &&
                    wordRes.type.endsWith('s')
                ) return false;

                // Check that the current illion is less than the previous one
                let illionIdx = Additionals.illionsOrder.indexOf(word);
                if (word.endsWith('ón')) illionIdx++;  // Pluralize in Spanish
                if (lastIllionIdx <= illionIdx) return false;  // Validation
                lastIllionIdx = illionIdx;

                currentValue = this._strMultiplication(
                    wordRes.val, Number(currentValue)
                ).intPart;
                updateFinalValue();
            } else if (wordRes.type == 'thousands') {
                // Validation for spanish loop in thousands
                if (thousandBefore) return false;
                thousandBefore = true;

                // Validation for spanish in 'one thousand'
                if (currentValue == '0') currentValue = '1';
                currentValue = this._strMultiplication(
                    wordRes.val, Number(currentValue)
                ).intPart;

                // Update the final value if the language is not spanish
                if (lang != 'es') updateFinalValue();
            } else if (wordRes.type == 'hundreds' && lang == 'en') {
                // Multiply the current value by houndred only for English
                currentValue = this._strMultiplication(
                    wordRes.val, Number(currentValue)
                ).intPart;
            } else if (isDecimalPart) {
                // Check if the language is English for a quick return
                if (lang == 'en') {
                    lastResult.next = 'unitsForS|units';
                    currentValue += wordRes.val;
                    return true;
                }

                // Make the validations for spanish decimals
                const spanishAddTypes = ['hundreds', 'tens', 'conn'];
                if (spanishAddTypes.includes(wordRes.type)) {
                    // Fix the current value for the first addition
                    if (currentValue == '') currentValue = '0';

                    spanishDecimalAdd = true;
                    currentValue = this._strIntAddition(
                        currentValue, wordRes.val
                    );
                }
                else if (spanishDecimalAdd) {
                    currentValue = this._strIntAddition(
                        currentValue, wordRes.val
                    );
                } else {
                    lastResult.next = 'unitsForS|units';
                    currentValue += wordRes.val;
                }
            } else if (wordRes.type == 'point') {
                // Add the current value to the final if it's different from '0'
                if (currentValue != '0') updateFinalValue();

                // Add the point to the final value
                currentValue = '.';
                isDecimalPart = true;
                updateFinalValue();
            } else {  // Is not one scale
                currentValue = this._strIntAddition(currentValue, wordRes.val);
            }

            return true;
        };

        for (let i = 0; i < numberSplited.length; i++) {
            const word = numberSplited[i];

            // Check if the word has the current connector
            const connSymb = Additionals.conn.symbol;
            const connIdx = word.indexOf(connSymb);

            // Validate the words joined by the connector only for English
            if (lang == 'en' && connIdx != -1) {
                // Get the words before and after the connector
                const wordBef = word.slice(0, connIdx);
                const wordAft = word.slice(connIdx + 1);

                // Get and validate the result of the word before
                if (!getAndValidate(wordBef)) return 'NaN';

                // Get and validate the result of the connector
                if (!getAndValidate(connSymb)) return 'NaN';

                // Get and validate the result of the word after
                if (!getAndValidate(wordAft)) return 'NaN';

                continue;
            }

            // Get and validate the result of the current word
            if (!getAndValidate(word)) return 'NaN';
        }

        // Check if the current value has content
        if (!isDecimalPart && currentValue != '0') updateFinalValue();
        else if (currentValue != '') updateFinalValue();

        // Check if the last word can be the last one
        if (!isDecimalPart && !lastResult.next.split('|').includes('point')) {
            return 'NaN';
        }

        // Check if the number is negative
        if (isNegative) finalValue = '-' + finalValue;

        return finalValue;
    }

    /**
     * Converts one written number into octal format. The number can be in two
     * languages: English and Spanish. The written number can be negative and
     * contain a decimal written part. This method will make two conversions,
     * one from text to decimal and the second one from decimal to octal.
     * 
     * @static
     * @param {string} number - The written number.
     * @param {"es"|"en"} lang - The language of the number.
     * @returns {string} The number in octal format.
     */
    static tooctal(number, lang) {
        const decimalNumber = this.todecimal(number, lang);
        if (decimalNumber == 'NaN') return decimalNumber;

        return Decimal.tooctal(decimalNumber);
    }

    /**
     * Converts one written number into binary format. The number can be in two
     * languages: English and Spanish. The written number can be negative and
     * contain a decimal written part. This method will make two conversions,
     * one from text to decimal and the second one from decimal to binary.
     * 
     * @static
     * @param {string} number - The written number.
     * @param {"es"|"en"} lang - The language of the number.
     * @returns {string} The number in binary format.
     */
    static tobinary(number, lang) {
        const decimalNumber = this.todecimal(number, lang);
        if (decimalNumber == 'NaN') return decimalNumber;

        return Decimal.tobinary(decimalNumber);
    }

    /**
     * Converts one written number into text format. The number can be in two
     * languages: English and Spanish. The written number can be negative and
     * contain a decimal written part. This method is intended to be able to
     * change the language of one number. This method will make two conversions,
     * one from text to decimal and the second one from decimal to text.
     * 
     * @static
     * @param {string} number - The written number.
     * @param {"es"|"en"} langOrigin - The language of the number.
     * @param {"es"|"en"} langDestiny - The language of the number.
     * @returns {string} The written number in the destiny language.
     */
    static totext(number, langOrigin, langDestiny) {
        const decimalNumber = this.todecimal(number, langOrigin);
        if (decimalNumber == 'NaN') return decimalNumber;

        return Decimal.totext(decimalNumber, langDestiny);
    }
}