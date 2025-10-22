// Connection test
export const tests = [
    // Positive integers
    { input: '0', expected: 'cero' },
    { input: '1', expected: 'uno' },
    { input: '2', expected: 'dos' },
    { input: '5', expected: 'cinco' },
    { input: '10', expected: 'diez' },

    // Negative integers
    { input: '-1', expected: 'menos uno' },
    { input: '-2', expected: 'menos dos' },
    { input: '-5', expected: 'menos cinco' },

    // Positive decimals
    { input: '0.5', expected: 'cero punto cinco' },
    { input: '0.25', expected: 'cero punto veinticinco' },
    { input: '0.75', expected: 'cero punto setenta y cinco' },
    { input: '2.5', expected: 'dos punto cinco' },
    { input: '3.25', expected: 'tres punto veinticinco' },

    // Negative decimals
    { input: '-0.5', expected: 'menos cero punto cinco' },
    { input: '-2.5', expected: 'menos dos punto cinco' },
    { input: '-3.25', expected: 'menos tres punto veinticinco' },

    // Rare cases
    { input: '.5', expected: 'cero punto cinco' },
    { input: '1.', expected: 'uno punto cero' },
    { input: '-.5', expected: 'menos cero punto cinco' },
    { input: '-', expected: 'cero' },
    { input: '.', expected: 'cero punto cero' },
    { input: '-.', expected: 'cero punto cero' },
    { input: '-0', expected: 'cero' },
    { input: '0005.371000000', expected: 'cinco punto trescientos setenta y uno' },
    { input: 'a', expected: null },
    { input: '12345678A', expected: null },
    { input: '+14242141', expected: null },
    { input: '--1321312312', expected: null },
    { input: '0.5.1', expected: null },

    // Big integers
    { input: '123456', expected: 'ciento veintitrés mil cuatrocientos cincuenta y seis' },
    { input: '8526945', expected: 'ocho millones quinientos veintiséis mil novecientos cuarenta y cinco' },
    { input: '1048575', expected: 'un millón cuarenta y ocho mil quinientos setenta y cinco' },
    { input: '61048576', expected: 'sesenta y un millones cuarenta y ocho mil quinientos setenta y seis' },
    {
        input: '89789745615648545615109848904894651065489710848974108948604654890',
        expected: 'ochenta y nueve mil setecientos ochenta y nueve decillones setecientos cuarenta y cinco mil seiscientos quince nonillones seiscientos cuarenta y ocho mil quinientos cuarenta y cinco octillones seiscientos quince mil ciento nueve septillones ochocientos cuarenta y ocho mil novecientos cuatro sextillones ochocientos noventa y cuatro mil seiscientos cincuenta y un quintillones sesenta y cinco mil cuatrocientos ochenta y nueve cuatrillones setecientos diez mil ochocientos cuarenta y ocho trillones novecientos setenta y cuatro mil ciento ocho billones novecientos cuarenta y ocho mil seiscientos cuatro millones seiscientos cincuenta y cuatro mil ochocientos noventa'
    },

    // Big negatives
    { input: '-21121021121421', expected: 'menos veintiún billones ciento veintiún mil veintiún millones ciento veintiún mil cuatrocientos veintiuno' },
    { input: '-981654', expected: 'menos novecientos ochenta y un mil seiscientos cincuenta y cuatro' },
    { input: '-9831556', expected: 'menos nueve millones ochocientos treinta y un mil quinientos cincuenta y seis' },
    {
        input: '-89561564865416548974891564489748614567897848978948948911984',
        expected: 'menos ochenta y nueve mil quinientos sesenta y un nonillones quinientos sesenta y cuatro mil ochocientos sesenta y cinco octillones cuatrocientos dieciséis mil quinientos cuarenta y ocho septillones novecientos setenta y cuatro mil ochocientos noventa y un sextillones quinientos sesenta y cuatro mil cuatrocientos ochenta y nueve quintillones setecientos cuarenta y ocho mil seiscientos catorce cuatrillones quinientos sesenta y siete mil ochocientos noventa y siete trillones ochocientos cuarenta y ocho mil novecientos setenta y ocho billones novecientos cuarenta y ocho mil novecientos cuarenta y ocho millones novecientos once mil novecientos ochenta y cuatro'
    },
    {
        input: '-99999878989787456456484894231348978156189781654789784561564898798',
        expected: 'menos noventa y nueve mil novecientos noventa y nueve decillones ochocientos setenta y ocho mil novecientos ochenta y nueve nonillones setecientos ochenta y siete mil cuatrocientos cincuenta y seis octillones cuatrocientos cincuenta y seis mil cuatrocientos ochenta y cuatro septillones ochocientos noventa y cuatro mil doscientos treinta y un sextillones trescientos cuarenta y ocho mil novecientos setenta y ocho quintillones ciento cincuenta y seis mil ciento ochenta y nueve cuatrillones setecientos ochenta y un mil seiscientos cincuenta y cuatro trillones setecientos ochenta y nueve mil setecientos ochenta y cuatro billones quinientos sesenta y un mil quinientos sesenta y cuatro millones ochocientos noventa y ocho mil setecientos noventa y ocho'
    },

    // Big decimals
    { input: '12345.6789', expected: 'doce mil trescientos cuarenta y cinco punto seis siete ocho nueve' },
    { input: '98765.4321', expected: 'noventa y ocho mil setecientos sesenta y cinco punto cuatro tres dos uno' },
    {
        input: '-.0123456789876543217987897897456789765457999999797788998754578979878454566666410',
        expected: 'menos cero punto cero uno dos tres cuatro cinco seis siete ocho nueve ocho siete seis cinco cuatro tres dos uno siete nueve ocho siete ocho nueve siete ocho nueve siete cuatro cinco seis siete ocho nueve siete seis cinco cuatro cinco siete nueve nueve nueve nueve nueve nueve siete nueve siete siete ocho ocho nueve nueve ocho siete cinco cuatro cinco siete ocho nueve siete nueve ocho siete ocho cuatro cinco cuatro cinco seis seis seis seis seis cuatro uno'
    },

    // Big decimals positives and negatives
    { input: '4294967.295', expected: 'cuatro millones doscientos noventa y cuatro mil novecientos sesenta y siete punto doscientos noventa y cinco' },
    { input: '-7694924.592', expected: 'menos siete millones seiscientos noventa y cuatro mil novecientos veinticuatro punto quinientos noventa y dos' },
];