// Connection test
export const tests = [
    // Positive integers
    { input: 'cero', expected: '0' },
    { input: 'uno', expected: '1' },
    { input: 'dos', expected: '2' },
    { input: 'cinco', expected: '5' },
    { input: 'diez', expected: '10' },
    { input: 'veintiuno', expected: '21' },

    // Negative integers
    { input: 'menos uno', expected: '-1' },
    { input: 'menos dos', expected: '-2' },
    { input: 'menos cinco', expected: '-5' },

    // Positive decimals
    { input: 'cero punto cinco', expected: '0.5' },
    { input: 'cero punto veinticinco', expected: '0.25' },
    { input: 'cero punto setenta y cinco', expected: '0.75' },
    { input: 'dos punto cinco', expected: '2.5' },
    { input: 'tres punto veinticinco', expected: '3.25' },

    // Negative decimals
    { input: 'menos cero punto cinco', expected: '-0.5' },
    { input: 'menos dos punto cinco', expected: '-2.5' },
    { input: 'menos tres punto veinticinco', expected: '-3.25' },

    // Rare cases
    { input: 'a', expected: 'NAN' },
    { input: '15', expected: null },
    { input: 'four', expected: 'NAN' },
    { input: 'un billón dos billones', expected: 'NAN' },
    { input: 'cien mil cuarenta y cinco mil', expected: 'NAN' },
    { input: '   uN   mIlLÓn      sEiScIenToS     cIncUeNTA Y cUaTrO mIL sEsEntA y      CiNco      ', expected: '1654065' },
    { input: 'millón', expected: 'NAN' },
    { input: 'cincuenta y cincuenta', expected: 'NAN' },
    { input: 'mil zero', expected: 'NAN' },

    // Big integers
    { input: 'mil', expected: '1000' },
    { input: 'veintiún mil doscientos uno', expected: '21201' },
    { input: 'cien mil cuarenta y cinco', expected: '100045' },
    { input: 'ciento veintitrés mil cuatrocientos cincuenta y seis', expected: '123456' },
    { input: 'ocho millones quinientos veintiséis mil novecientos cuarenta y cinco', expected: '8526945' },
    { input: 'un millón cuarenta y ocho mil quinientos setenta y cinco', expected: '1048575' },
    { input: 'sesenta y un millones cuarenta y ocho mil quinientos setenta y seis', expected: '61048576' },
    {
        input: 'ochenta y nueve mil setecientos ochenta y nueve decillones setecientos cuarenta y cinco mil seiscientos quince nonillones seiscientos cuarenta y ocho mil quinientos cuarenta y cinco octillones seiscientos quince mil ciento nueve septillones ochocientos cuarenta y ocho mil novecientos cuatro sextillones ochocientos noventa y cuatro mil seiscientos cincuenta y un quintillones sesenta y cinco mil cuatrocientos ochenta y nueve cuatrillones setecientos diez mil ochocientos cuarenta y ocho trillones novecientos setenta y cuatro mil ciento ocho billones novecientos cuarenta y ocho mil seiscientos cuatro millones seiscientos cincuenta y cuatro mil ochocientos noventa',
        expected: '89789745615648545615109848904894651065489710848974108948604654890'
    },

    // Big negatives
    { input: 'menos veintiún billones ciento veintiún mil veintiún millones ciento veintiún mil cuatrocientos veintiuno', expected: '-21121021121421' },
    { input: 'menos novecientos ochenta y un mil seiscientos cincuenta y cuatro', expected: '-981654' },
    { input: 'menos nueve millones ochocientos treinta y un mil quinientos cincuenta y seis', expected: '-9831556' },
    {
        input: 'menos ochenta y nueve mil quinientos sesenta y un nonillones quinientos sesenta y cuatro mil ochocientos sesenta y cinco octillones cuatrocientos dieciséis mil quinientos cuarenta y ocho septillones novecientos setenta y cuatro mil ochocientos noventa y un sextillones quinientos sesenta y cuatro mil cuatrocientos ochenta y nueve quintillones setecientos cuarenta y ocho mil seiscientos catorce cuatrillones quinientos sesenta y siete mil ochocientos noventa y siete trillones ochocientos cuarenta y ocho mil novecientos setenta y ocho billones novecientos cuarenta y ocho mil novecientos cuarenta y ocho millones novecientos once mil novecientos ochenta y cuatro',
        expected: '-89561564865416548974891564489748614567897848978948948911984'
    },
    {
        input: 'menos noventa y nueve mil novecientos noventa y nueve decillones ochocientos setenta y ocho mil novecientos ochenta y nueve nonillones setecientos ochenta y siete mil cuatrocientos cincuenta y seis octillones cuatrocientos cincuenta y seis mil cuatrocientos ochenta y cuatro septillones ochocientos noventa y cuatro mil doscientos treinta y un sextillones trescientos cuarenta y ocho mil novecientos setenta y ocho quintillones ciento cincuenta y seis mil ciento ochenta y nueve cuatrillones setecientos ochenta y un mil seiscientos cincuenta y cuatro trillones setecientos ochenta y nueve mil setecientos ochenta y cuatro billones quinientos sesenta y un mil quinientos sesenta y cuatro millones ochocientos noventa y ocho mil setecientos noventa y ocho',
        expected: '-99999878989787456456484894231348978156189781654789784561564898798'
    },

    // Big decimals
    { input: 'mil uno punto veintiuno', expected: '1001.21' },
    { input: 'mil veintiuno punto uno', expected: '1021.1' },
    { input: 'doce mil trescientos cuarenta y cinco punto seis siete ocho nueve', expected: '12345.6789' },
    { input: 'noventa y ocho mil setecientos sesenta y cinco punto trescientos veintiuno', expected: '98765.321' },
    { input: 'mil un cuatrillones un trillón mil un billones ciento veintiún mil un millones quinientos un mil uno punto uno', expected: '1001000001001001121001501001.1' },
    {
        input: 'menos cero punto cero uno dos tres cuatro cinco seis siete ocho nueve ocho siete seis cinco cuatro tres dos uno siete nueve ocho siete ocho nueve siete ocho nueve siete cuatro cinco seis siete ocho nueve siete seis cinco cuatro cinco siete nueve nueve nueve nueve nueve nueve siete nueve siete siete ocho ocho nueve nueve ocho siete cinco cuatro cinco siete ocho nueve siete nueve ocho siete ocho cuatro cinco cuatro cinco seis seis seis seis seis cuatro uno',
        expected: '-0.0123456789876543217987897897456789765457999999797788998754578979878454566666410'
    },

    // Big decimals positives and negatives
    { input: 'cuatro millones doscientos noventa y cuatro mil novecientos sesenta y siete punto doscientos noventa y cinco', expected: '4294967.295' },
    { input: 'menos siete millones seiscientos noventa y cuatro mil novecientos veinticuatro punto quinientos noventa y dos', expected: '-7694924.592' },
];