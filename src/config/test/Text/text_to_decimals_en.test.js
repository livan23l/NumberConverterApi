// Connection test
export const tests = [
    // Positive integers
    { input: 'zero', expected: '0' },
    { input: 'one', expected: '1' },
    { input: 'two', expected: '2' },
    { input: 'five', expected: '5' },
    { input: 'ten', expected: '10' },

    // Negative integers
    { input: 'minus one', expected: '-1' },
    { input: 'minus two', expected: '-2' },
    { input: 'minus five', expected: '-5' },

    // Positive decimals
    { input: 'zero point five', expected: '0.5' },
    { input: 'zero point two five', expected: '0.25' },
    { input: 'zero point seven five', expected: '0.75' },
    { input: 'two point five', expected: '2.5' },
    { input: 'three point two five', expected: '3.25' },

    // Negative decimals
    { input: 'minus zero point five', expected: '-0.5' },
    { input: 'minus two point five', expected: '-2.5' },
    { input: 'minus three point two five', expected: '-3.25' },

    // Rare cases
    { input: 'a', expected: 'NAN' },
    { input: '15', expected: null },
    { input: 'tres', expected: 'NAN' },
    { input: 'one million two billion', expected: 'NAN' },
    { input: 'one trillion two billion one billion five', expected: 'NAN' },
    { input: '   OnE       mILLIon       siX       hUnDRed   fIfTy-FoUr     thOUSaNd  SIXty-fIvE      ', expected: '1654065' },
    { input: 'million', expected: 'NAN' },
    { input: 'thousand', expected: 'NAN' },
    { input: 'hundred', expected: 'NAN' },
    { input: 'fifty-fifty', expected: 'NAN' },
    { input: 'one thousand zero', expected: 'NAN' },
    { input: 'minus one thousand fifty-five point eleven', expected: 'NAN' },
    { input: 'minus one thousand fifty-five point one hundred', expected: 'NAN' },
    { input: 'minus one thousand fifty-five point one thousand', expected: 'NAN' },
    { input: 'minus one thousand fifty-five point one million', expected: 'NAN' },

    // Big integers
    { input: 'one hundred twenty-three thousand four hundred fifty-six', expected: '123456' },
    { input: 'eight million five hundred twenty-six thousand nine hundred forty-five', expected: '8526945' },
    { input: 'one million forty-eight thousand five hundred seventy-five', expected: '1048575' },
    { input: 'sixty-one million forty-eight thousand five hundred seventy-six', expected: '61048576' },
    {
        input: 'eighty-nine vigintillion seven hundred eighty-nine novemdecillion seven hundred forty-five octodecillion six hundred fifteen septendecillion six hundred forty-eight sexdecillion five hundred forty-five quindecillion six hundred fifteen quattuordecillion one hundred nine tredecillion eight hundred forty-eight duodecillion nine hundred four undecillion eight hundred ninety-four decillion six hundred fifty-one nonillion sixty-five octillion four hundred eighty-nine septillion seven hundred ten sextillion eight hundred forty-eight quintillion nine hundred seventy-four quadrillion one hundred eight trillion nine hundred forty-eight billion six hundred four million six hundred fifty-four thousand eight hundred ninety',
        expected: '89789745615648545615109848904894651065489710848974108948604654890'
    },

    // Big negatives
    { input: 'minus one hundred twenty-five thousand four hundred seventy-nine', expected: '-125479' },
    { input: 'minus nine hundred eighty-one thousand six hundred fifty-four', expected: '-981654' },
    { input: 'minus nine million eight hundred seventy-four thousand five hundred fifty-six', expected: '-9874556' },
    {
        input: 'minus eighty-nine octodecillion five hundred sixty-one septendecillion five hundred sixty-four sexdecillion eight hundred sixty-five quindecillion four hundred sixteen quattuordecillion five hundred forty-eight tredecillion nine hundred seventy-four duodecillion eight hundred ninety-one undecillion five hundred sixty-four decillion four hundred eighty-nine nonillion seven hundred forty-eight octillion six hundred fourteen septillion five hundred sixty-seven sextillion eight hundred ninety-seven quintillion eight hundred forty-eight quadrillion nine hundred seventy-eight trillion nine hundred forty-eight billion nine hundred forty-eight million nine hundred seventy-seven thousand nine hundred eighty-four',
        expected: '-89561564865416548974891564489748614567897848978948948977984'
    },
    {
        input: 'minus ninety-nine vigintillion nine hundred ninety-nine novemdecillion eight hundred seventy-eight octodecillion nine hundred eighty-nine septendecillion seven hundred eighty-seven sexdecillion four hundred fifty-six quindecillion four hundred fifty-six quattuordecillion four hundred eighty-four tredecillion eight hundred ninety-four duodecillion two hundred thirty-one undecillion three hundred forty-eight decillion nine hundred seventy-eight nonillion one hundred fifty-six octillion one hundred eighty-nine septillion seven hundred eighty-one sextillion six hundred fifty-four quintillion seven hundred eighty-nine quadrillion seven hundred eighty-four trillion five hundred sixty-one billion five hundred sixty-four million eight hundred ninety-eight thousand seven hundred ninety-eight',
        expected: '-99999878989787456456484894231348978156189781654789784561564898798'
    },

    // Big decimals
    { input: 'twelve thousand three hundred forty-five point six seven eight nine', expected: '12345.6789' },
    { input: 'ninety-eight thousand seven hundred sixty-five point four three two one', expected: '98765.4321' },
    {
        input: 'minus zero point zero one two three four five six seven eight nine eight seven six five four three two one seven nine eight seven eight nine seven eight nine seven four five six seven eight nine seven six five four five seven nine nine nine nine nine nine seven nine seven seven eight eight nine nine eight seven five four five seven eight nine seven nine eight seven eight four five four five six six six six six four one',
        expected: '-0.012345678987654321798789789745678976545799999979778899875457897987845456666641'
    },

    // Big decimals positives and negatives
    { input: 'four million two hundred ninety-four thousand nine hundred sixty-seven point two nine five', expected: '4294967.295' },
    { input: 'minus seven million six hundred ninety-four thousand nine hundred twenty-four point five nine two', expected: '-7694924.592' },
];