// Connection test
export const tests = [
    // Positive integers
    { input: '0', expected: 'zero' },
    { input: '1', expected: 'one' },
    { input: '2', expected: 'two' },
    { input: '5', expected: 'five' },
    { input: '10', expected: 'ten' },

    // Negative integers
    { input: '-1', expected: 'minus one' },
    { input: '-2', expected: 'minus two' },
    { input: '-5', expected: 'minus five' },

    // Positive decimals
    { input: '0.5', expected: 'zero point five' },
    { input: '0.25', expected: 'zero point two five' },
    { input: '0.75', expected: 'zero point seven five' },
    { input: '2.5', expected: 'two point five' },
    { input: '3.25', expected: 'three point two five' },

    // Negative decimals
    { input: '-0.5', expected: 'minus zero point five' },
    { input: '-2.5', expected: 'minus two point five' },
    { input: '-3.25', expected: 'minus three point two five' },

    // Rare cases
    { input: '.5', expected: 'zero point five' },
    { input: '1.', expected: 'one point zero' },
    { input: '-.5', expected: 'minus zero point five' },
    { input: '-', expected: 'zero' },
    { input: '.', expected: 'zero point zero' },
    { input: '-.', expected: 'zero point zero' },
    { input: '-0', expected: 'zero' },
    { input: '0005.371000000', expected: 'five point three seven one' },
    { input: 'a', expected: null },
    { input: '12345678A', expected: null },
    { input: '+14242141', expected: null },
    { input: '--1321312312', expected: null },
    { input: '0.5.1', expected: null },
    { input: '1234567890123456789012345678901234567890123456789012345678901234567', expected: 'NTL' },

    // Big integers
    { input: '123456', expected: 'one hundred twenty-three thousand four hundred fifty-six' },
    { input: '8526945', expected: 'eight million five hundred twenty-six thousand nine hundred forty-five' },
    { input: '1048575', expected: 'one million forty-eight thousand five hundred seventy-five' },
    { input: '61048576', expected: 'sixty-one million forty-eight thousand five hundred seventy-six' },
    {
        input: '89789745615648545615109848904894651065489710848974108948604654890',
        expected: 'eighty-nine vigintillion seven hundred eighty-nine novemdecillion seven hundred forty-five octodecillion six hundred fifteen septendecillion six hundred forty-eight sexdecillion five hundred forty-five quindecillion six hundred fifteen quattuordecillion one hundred nine tredecillion eight hundred forty-eight duodecillion nine hundred four undecillion eight hundred ninety-four decillion six hundred fifty-one nonillion sixty-five octillion four hundred eighty-nine septillion seven hundred ten sextillion eight hundred forty-eight quintillion nine hundred seventy-four quadrillion one hundred eight trillion nine hundred forty-eight billion six hundred four million six hundred fifty-four thousand eight hundred ninety'
    },

    // Big negatives
    { input: '-125479', expected: 'minus one hundred twenty-five thousand four hundred seventy-nine' },
    { input: '-981654', expected: 'minus nine hundred eighty-one thousand six hundred fifty-four' },
    { input: '-9874556', expected: 'minus nine million eight hundred seventy-four thousand five hundred fifty-six' },
    {
        input: '-89561564865416548974891564489748614567897848978948948977984',
        expected: 'minus eighty-nine octodecillion five hundred sixty-one septendecillion five hundred sixty-four sexdecillion eight hundred sixty-five quindecillion four hundred sixteen quattuordecillion five hundred forty-eight tredecillion nine hundred seventy-four duodecillion eight hundred ninety-one undecillion five hundred sixty-four decillion four hundred eighty-nine nonillion seven hundred forty-eight octillion six hundred fourteen septillion five hundred sixty-seven sextillion eight hundred ninety-seven quintillion eight hundred forty-eight quadrillion nine hundred seventy-eight trillion nine hundred forty-eight billion nine hundred forty-eight million nine hundred seventy-seven thousand nine hundred eighty-four'
    },
    {
        input: '-99999878989787456456484894231348978156189781654789784561564898798',
        expected: 'minus ninety-nine vigintillion nine hundred ninety-nine novemdecillion eight hundred seventy-eight octodecillion nine hundred eighty-nine septendecillion seven hundred eighty-seven sexdecillion four hundred fifty-six quindecillion four hundred fifty-six quattuordecillion four hundred eighty-four tredecillion eight hundred ninety-four duodecillion two hundred thirty-one undecillion three hundred forty-eight decillion nine hundred seventy-eight nonillion one hundred fifty-six octillion one hundred eighty-nine septillion seven hundred eighty-one sextillion six hundred fifty-four quintillion seven hundred eighty-nine quadrillion seven hundred eighty-four trillion five hundred sixty-one billion five hundred sixty-four million eight hundred ninety-eight thousand seven hundred ninety-eight'
    },

    // Big decimals
    { input: '12345.6789', expected: 'twelve thousand three hundred forty-five point six seven eight nine' },
    { input: '98765.4321', expected: 'ninety-eight thousand seven hundred sixty-five point four three two one' },
    {
        input: '-.0123456789876543217987897897456789765457999999797788998754578979878454566666410',
        expected: 'minus zero point zero one two three four five six seven eight nine eight seven six five four three two one seven nine eight seven eight nine seven eight nine seven four five six seven eight nine seven six five four five seven nine nine nine nine nine nine seven nine seven seven eight eight nine nine eight seven five four five seven eight nine seven nine eight seven eight four five four five six six six six six four one'
    },

    // Big decimals positives and negatives
    { input: '4294967.295', expected: 'four million two hundred ninety-four thousand nine hundred sixty-seven point two nine five' },
    { input: '-7694924.592', expected: 'minus seven million six hundred ninety-four thousand nine hundred twenty-four point five nine two' },
];