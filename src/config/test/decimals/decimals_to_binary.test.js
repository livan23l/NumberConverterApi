// Connection test
export const tests = [
    // Positive integers
    { input: '0', expected: '0' },
    { input: '1', expected: '1' },
    { input: '2', expected: '10' },
    { input: '5', expected: '101' },
    { input: '10', expected: '1010' },

    // Negative integers
    { input: '-1', expected: '-1' },
    { input: '-2', expected: '-10' },
    { input: '-5', expected: '-101' },

    // Positive decimals
    { input: '0.5', expected: '0.1' },
    { input: '0.25', expected: '0.01' },
    { input: '0.75', expected: '0.11' },
    { input: '2.5', expected: '10.1' },
    { input: '3.25', expected: '11.01' },

    // Negative decimals
    { input: '-0.5', expected: '-0.1' },
    { input: '-2.5', expected: '-10.1' },
    { input: '-3.25', expected: '-11.01' },

    // Rare cases
    { input: '.5', expected: '0.1' },
    { input: '1.', expected: '1.0' },
    { input: '-.5', expected: '-0.1' },
    { input: '-', expected: '0' },
    { input: '.', expected: '0.0' },
    { input: '-.', expected: '0.0' },
    { input: '-0', expected: '0' },
    { input: '0005.375', expected: '101.011' },
    { input: 'a', expected: null },
    { input: '12345678A', expected: null },
    { input: '+14242141', expected: null },
    { input: '--1321312312', expected: null },
    { input: '0.5.1', expected: null },

    // Big integers
    { input: '123456', expected: '11110001001000000' },
    { input: '987654', expected: '11110001001000000110' },
    { input: '1048575', expected: '11111111111111111111' },
    {
        input: '89789745615648545615109848904894651065489710848974108948604654890',
        expected: '110110100100010001001011101111101000100111111100111000010100111000000100110001011001001000001111111001111010101101010011010010010001001111101010010011101100100011010010011111100100101110011010000111000001010100101010'
    },

    // Big negatives
    { input: '-123456', expected: '-11110001001000000' },
    { input: '-987654', expected: '-11110001001000000110' },
    { input: '-1048575', expected: '-11111111111111111111' },
    {
        input: '-99999878989787456456484894231348978156189781654789784561564898798',
        expected: '-111100110001011000010011110101010101001000110001111010101101111110100100001000110111111101100010100011001000001111001000111010111011100010000110101001110001111110011000100010011111101101011101110000011101010111101110'
    },

    // Big decimals
    { input: '12345.6789', expected: '11000000111001.1010110111001100011000111' },
    { input: '98765.4321', expected: '11000000111001101.0110111010011110000110110' },
    {
        input: '-.012345678987654321798789789745678976545799999979778899875457897987845456666640',
        expected: '-0.0000001100101001000101100'
    },

    // Big decimals positives and negatives
    { input: '4294967.295', expected: '10000011000100100110111.0100101110000101000111101' },
    { input: '-7694924.592', expected: '-11101010110101001001100.1001011110001101010011111' },
];