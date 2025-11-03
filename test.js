class Test {
    /**
     * 
     * @param {string} number - The written number.
     * @param {string} lang - The language of the number.
     * @return {string} The number in decimal format.
     */
    todecimal(number, lang) {
        // Generate relationships between names and numbers in units
        const unitsNext = {
            'es': 'illions|thousands|point',
            'en': 'illions|thousands|hundreds|point'
        };
        const units = {
            'es': {
                'cero': { 'num': '0', 'next': 'point', 'dec': true },
                'uno': { 'num': '1', 'next': 'point', 'dec': true },
                'un': { 'num': '1', 'next': 'illion|illions', 'dec': false },
                'dos': { 'num': '2', 'next': unitsNext.es, 'dec': true },
                'tres': { 'num': '3', 'next': unitsNext.es, 'dec': true },
                'cuatro': { 'num': '4', 'next': unitsNext.es, 'dec': true },
                'cinco': { 'num': '5', 'next': unitsNext.es, 'dec': true },
                'seis': { 'num': '6', 'next': unitsNext.es, 'dec': true },
                'siete': { 'num': '7', 'next': unitsNext.es, 'dec': true },
                'ocho': { 'num': '8', 'next': unitsNext.es, 'dec': true },
                'nueve': { 'num': '9', 'next': unitsNext.es, 'dec': true },
            },
            'en': {
                'zero': { 'number': '0', 'next': 'point', 'decimal': true },
                'one': { 'num': '1', 'next': unitsNext.en, 'dec': true },
                'two': { 'num': '2', 'next': unitsNext.en, 'dec': true },
                'three': { 'num': '3', 'next': unitsNext.en, 'dec': true },
                'four': { 'num': '4', 'next': unitsNext.en, 'dec': true },
                'five': { 'num': '5', 'next': unitsNext.en, 'dec': true },
                'six': { 'num': '6', 'next': unitsNext.en, 'dec': true },
                'seven': { 'num': '7', 'next': unitsNext.en, 'dec': true },
                'eight': { 'num': '8', 'next': unitsNext.en, 'dec': true },
                'nine': { 'num': '9', 'next': unitsNext.en, 'dec': true },
            }
        };
        const unitsForScale = {
            'es': [
                'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho',
                'nueve'
            ],
            'en': [
                'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
                'nine'
            ],
        };

        // Generate relationships between names and numbers in tens
        const tensNext = {
            'es': ['illions|thousands|point', 'illions|thousands|conn|point'],
            'en': ['illions|thousands|point', 'illions|thousands|conn|point']
        };
        const tens = {
            'es': {
                'diez': { 'num': '10', 'next': tensNext.es[0], 'dec': true },
                'once': { 'num': '11', 'next': tensNext.es[0], 'dec': true },
                'doce': { 'num': '12', 'next': tensNext.es[0], 'dec': true },
                'trece': { 'num': '13', 'next': tensNext.es[0], 'dec': true },
                'catorce': { 'num': '14', 'next': tensNext.es[0], 'dec': true },
                'quince': { 'num': '15', 'next': tensNext.es[0], 'dec': true },
                'dieciséis': { 'num': '16', 'next': tensNext.es[0], 'dec': true },
                'diecisiete': { 'num': '17', 'next': tensNext.es[0], 'dec': true },
                'diecicho': { 'num': '18', 'next': tensNext.es[0], 'dec': true },
                'diecinueve': { 'num': '19', 'next': tensNext.es[0], 'dec': true },
                'veinte': { 'num': '20', 'next': tensNext.es[0], 'dec': true },
                'veintiún': { 'num': '21', 'next': tensNext.es[0], 'dec': true },
                'veintiuno': { 'num': '21', 'next': 'point', 'dec': true },
                'veintidós': { 'num': '22', 'next': tensNext.es[0], 'dec': true },
                'veintitrés': { 'num': '23', 'next': tensNext.es[0], 'dec': true },
                'veinticuatro': { 'num': '24', 'next': tensNext.es[0], 'dec': true },
                'veinticinco': { 'num': '25', 'next': tensNext.es[0], 'dec': true },
                'veintiséis': { 'num': '26', 'next': tensNext.es[0], 'dec': true },
                'veintisiete': { 'num': '27', 'next': tensNext.es[0], 'dec': true },
                'veintiocho': { 'num': '28', 'next': tensNext.es[0], 'dec': true },
                'veintinueve': { 'num': '29', 'next': tensNext.es[0], 'dec': true },

                'treinta': { 'num': '30', 'next': tensNext.es[1], 'dec': true },
                'cuarenta': { 'num': '40', 'next': tensNext.es[1], 'dec': true },
                'cincuenta': { 'num': '50', 'next': tensNext.es[1], 'dec': true },
                'sesenta': { 'num': '60', 'next': tensNext.es[1], 'dec': true },
                'setenta': { 'num': '70', 'next': tensNext.es[1], 'dec': true },
                'ochenta': { 'num': '80', 'next': tensNext.es[1], 'dec': true },
                'noventa': { 'num': '90', 'next': tensNext.es[1], 'dec': true }
            },
            'en': {
                'ten': { 'num': '10', 'next': tensNext.en[0], 'dec': false },
                'eleven': { 'num': '11', 'next': tensNext.en[0], 'dec': false },
                'twelve': { 'num': '12', 'next': tensNext.en[0], 'dec': false },
                'thirteen': { 'num': '13', 'next': tensNext.en[0], 'dec': false },
                'fourteen': { 'num': '14', 'next': tensNext.en[0], 'dec': false },
                'fifteen': { 'num': '15', 'next': tensNext.en[0], 'dec': false },
                'sixteen': { 'num': '16', 'next': tensNext.en[0], 'dec': false },
                'seventeen': { 'num': '17', 'next': tensNext.en[0], 'dec': false },
                'eighteen': { 'num': '18', 'next': tensNext.en[0], 'dec': false },
                'nineteen': { 'num': '19', 'next': tensNext.en[0], 'dec': false },

                'twenty': { 'num': '20', 'next': tensNext.en[1], 'dec': false },
                'thirty': { 'num': '30', 'next': tensNext.en[1], 'dec': false },
                'forty': { 'num': '40', 'next': tensNext.en[1], 'dec': false },
                'fifty': { 'num': '50', 'next': tensNext.en[1], 'dec': false },
                'sixty': { 'num': '60', 'next': tensNext.en[1], 'dec': false },
                'seventy': { 'num': '70', 'next': tensNext.en[1], 'dec': false },
                'eighty': { 'num': '80', 'next': tensNext.en[1], 'dec': false },
                'ninety': { 'num': '90', 'next': tensNext.en[1], 'dec': false }
            }
        };

        // Generate relationships between names and numbers in hundreds
        const hundredsNext = {
            'es': 'illlions|thousands|tens|units|point',
            'en': 'illlions|thousands|tens|units|point'
        };
        const hundreds = {
            'es': {
                'cien': { 'num': '100', 'next': 'illions|thousands|point', 'dec': true },
                'ciento': { 'num': '100', 'next': hundredsNext.es, 'dec': true },
                'doscientos': { 'num': '200', 'next': hundredsNext.es, 'dec': true },
                'trescientos': { 'num': '300', 'next': hundredsNext.es, 'dec': true },
                'cuatrocientos': { 'num': '400', 'next': hundredsNext.es, 'dec': true },
                'quinientos': { 'num': '500', 'next': hundredsNext.es, 'dec': true },
                'seiscientos': { 'num': '600', 'next': hundredsNext.es, 'dec': true },
                'setecientos': { 'num': '700', 'next': hundredsNext.es, 'dec': true },
                'ochocientos': { 'num': '800', 'next': hundredsNext.es, 'dec': true },
                'novecientos': { 'num': '900', 'next': hundredsNext.es, 'dec': true }
            },
            'en': {
                'hundred': { 'num': '100', 'next': hundredsNext.en, 'dec': true }
            }
        };

        // Generate relationships between names and numbers in thousands
        const thousandsNext = {
            'es': 'illlions|hundreds|tens|units|point',
            'en': 'illlions|hundreds|tens|units|point'
        };
        const thousands = {
            'es': {
                'mil': { 'num': '1000', 'next': thousandsNext.es, 'dec': false }
            },
            'en': {
                'thousand': { 'num': '1000', 'next': thousandsNext.en, 'dec': false }
            }
        };

        // Generate relationships between names and numbers in 'illions'
        const illionsNext = {
            'es': 'illlions|thousands|hundreds|tens|units|point',
            'en': 'illlions|hundreds|tens|units|point'
        };
        const illions = {
            'es': {
                'millón': {
                    'num': '1000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'millones': {
                    'num': '1000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'billón': {
                    'num': '1000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'billones': {
                    'num': '1000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'trillón': {
                    'num': '1000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'trillones': {
                    'num': '1000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'cuatrillón': {
                    'num': '1000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'cuatrillones': {
                    'num': '1000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'quintillón': {
                    'num': '1000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'quintillones': {
                    'num': '1000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'sextillón': {
                    'num': '1000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'sextillones': {
                    'num': '1000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'septillón': {
                    'num': '1000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'septillones': {
                    'num': '1000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'octillón': {
                    'num': '1000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'octillones': {
                    'num': '1000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'nonillón': {
                    'num': '1000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'nonillones': {
                    'num': '1000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'decillón': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'decillones': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'undecillón': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'undecillones': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'duodecillón': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'duodecillones': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'tredecillón': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'tredecillones': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'cuatordecillón': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'cuatordecillones': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'quindecillón': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'quindecillones': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'sexdecillón': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'sexdecillones': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'septendecillón': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'septendecillones': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'octodecillón': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'octodecillones': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'novendecillón': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'novendecillones': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'vigintillón': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                },
                'vigintillones': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.es,
                    'dec': false
                }
            },
            'en': {
                'million': {
                    'num': '1000000',
                    'next': illionsNext.en,
                    'dec': false
                },
                'billion': {
                    'num': '1000000000',
                    'next': illionsNext.en,
                    'dec': false
                },
                'trillion': {
                    'num': '1000000000000',
                    'next': illionsNext.en,
                    'dec': false
                },
                'quadrillion': {
                    'num': '1000000000000000',
                    'next': illionsNext.en,
                    'dec': false
                },
                'quintillion': {
                    'num': '1000000000000000000',
                    'next': illionsNext.en,
                    'dec': false
                },
                'sextillion': {
                    'num': '1000000000000000000000',
                    'next': illionsNext.en,
                    'dec': false
                },
                'septillion': {
                    'num': '1000000000000000000000000',
                    'next': illionsNext.en,
                    'dec': false
                },
                'octillion': {
                    'num': '1000000000000000000000000000',
                    'next': illionsNext.en,
                    'dec': false
                },
                'nonillion': {
                    'num': '1000000000000000000000000000000',
                    'next': illionsNext.en,
                    'dec': false
                },
                'decillion': {
                    'num': '1000000000000000000000000000000000',
                    'next': illionsNext.en,
                    'dec': false
                },
                'undecillion': {
                    'num': '1000000000000000000000000000000000000',
                    'next': illionsNext.en,
                    'dec': false
                },
                'duodecillion': {
                    'num': '1000000000000000000000000000000000000000',
                    'next': illionsNext.en,
                    'dec': false
                },
                'tredecillion': {
                    'num': '1000000000000000000000000000000000000000000',
                    'next': illionsNext.en,
                    'dec': false
                },
                'quattuordecillion': {
                    'num': '1000000000000000000000000000000000000000000000',
                    'next': illionsNext.en,
                    'dec': false
                },
                'quindecillion': {
                    'num': '1000000000000000000000000000000000000000000000000',
                    'next': illionsNext.en,
                    'dec': false
                },
                'sexdecillion': {
                    'num': '1000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.en,
                    'dec': false
                },
                'septendecillion': {
                    'num': '1000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.en,
                    'dec': false
                },
                'octodecillion': {
                    'num': '1000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.en,
                    'dec': false
                },
                'novemdecillion': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.en,
                    'dec': false
                },
                'vigintillion': {
                    'num': '1000000000000000000000000000000000000000000000000000000000000000',
                    'next': illionsNext.en,
                    'dec': false
                }
            }
        };

        // Set the name of the additional things (points and connectors)
        const additionals = {
            'es': {
                'punto': { 'symbol': '.', 'dec': true },
                'conn': { 'symbol': 'y', 'next': 'unitsForS|:uno', 'dec': true },
                'firstWordTypes': 'thousands|hundreds|tens|units'
            },
            'en': {
                'point': { 'symbol': '.', 'dec': true },
                'conn': { 'symbol': '-', 'next': 'unitsForS', 'dec': false },
                'firstWordTypes': 'tens|units'
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
        const UnitsForScaleKeys = Object.keys(UnitsForScale);
        const TensKeys = Object.keys(Tens);
        const HundredsKeys = Object.keys(Hundreds);
        const ThousandsKeys = Object.keys(Thousands);
        const IllionsKeys = Object.keys(Illions);
        const AdditionalsKeys = Object.keys(Additionals);

        const getWordAttributes = (word) => {
            // Define the word attributes
            const wordAttributes = { 'type': null, 'obj': null };

            // Obtain the attributes
            if (AdditionalsKeys.includes(word)) {
                wordAttributes.type = 'point';
                wordAttributes.obj = Additionals[word];
            }
            else if (Additionals.conn.symbol == word) {  // Spanish connector
                wordAttributes.type = 'conn';
                wordAttributes.obj = Additionals.conn;
            }
            else if (UnitsKeys.includes(word)) {
                // Validate if the unit is one unit for scale
                if (UnitsForScaleKeys.includes(word)) {
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
                if (word.endsWith('llón')) wordAttributes.type = 'illion';
                else wordAttributes.type = 'illions';

                wordAttributes.obj = Illions[word];
            }
            else {
                wordAttributes.type = 'NAN';
                wordAttributes.obj = {};
            }

            return wordAttributes;
        };

        const getWordValue = (word, lastNext) => {
            // Define the value structure
            const value = { 'val': 'NAN', 'next': '', 'dec': false };

            // Get the attributes of the current word
            const wordAttributes = getWordAttributes(word);
            if (wordAttributes.type == 'NAN') return value;

            // Get all the expected types
            const expectedTypes = lastNext.split('|');

            // Check if the last word expected the current type
            if (!expectedTypes.includes(wordAttributes.type)) return value;

            // Set the 'dec' propety
            value.dec = wordAttributes.dec;

            // Set the val checking if the type of the word is 'point' or 'conn'
            value.val = wordAttributes.obj.num;
            if (wordAttributes.type == 'point') value.val = '.';
            if (wordAttributes.type == 'conn') value.val = '0';

            // Set the value.next
            value.next = wordAttributes.obj.next;

            // Return the value
            return value;
        };

        // Generate the first word with its types
        const numberSplited = number.split(' ');
        const firstWord = numberSplited[0];
        const firstWordTypes = Additionals.firstWordTypes;

        // Get the value of the first word
        const firstWordValue = getWordValue(firstWord, firstWordTypes);

        // Validate the value of the first word
        if (firstWordValue.val == 'NAN') return 'NAN';

        // Make the conversion for the rest of the words
        let thousandBefore = false;
        let isDecimalPart = false;
        let lastValue = firstWordValue;
        let finalValue = firstWordValue.val;

        for (let i = 1; i < numberSplited.length; i++) {
            const word = numberSplited[i];
            let curValue = '';

            // Check if the word has a connector
            const connSymb = Additionals.conn.symbol;
            const connIdx = word.indexOf(connSymb);

            // Validate the words joined by the connector only for english
            if (lang == 'en' && connIdx != -1) {
                // Get the words before and after the connector
                const wordBef = word.slice(0, connIdx);
                const wordAft = word.slice(connIdx + 1);

                // Get and validate the value of the word before
                const wordBefVal = getWordValue(wordBef, lastValue.next);
                if (wordBefVal.val == 'NAN') return 'NAN';
                curValue += wordBefVal.val;
                lastValue.next = wordBefVal.next;

                // Get and validate the value of the connector
                const connVal = getWordValue(connSymb, lastValue.next);
                if (connVal.val == 'NAN') return 'NAN';
                lastValue.next = connVal.next;

                // Get and validate the value of the word after
                const wordAftVal = getWordValue(wordAft, lastValue.next);
                if (wordAftVal.val == 'NAN') return 'NAN';
                curValue += ' + ' + wordAftVal.val;
                lastValue.next = wordAftVal.next;
                finalValue += curValue;

                continue;
            }

            // Continue the normal validation when the word has no connector
            const wordVal = getWordValue(word, lastValue.next);
            if (wordVal.val == 'NAN') return 'NAN';
            finalValue += ' + ' + wordVal.val;
            lastValue.next = wordVal.next;
        }

        // Check if the last word can be the last one
        if (
            (!isDecimalPart && !lastValue.next.split('|').includes('point')) ||
            (isDecimalPart && !lastValue.dec)
        ) {
            return 'NAN';
        }

        return finalValue;
    }
}

const test = new Test;
console.log(test.todecimal('dos mil', 'es'));