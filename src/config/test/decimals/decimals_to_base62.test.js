// Connection test
export const tests = [
    // Positive integers
    { input: '0', expected: '0' },
    { input: '1', expected: '1' },
    { input: '2', expected: '2' },
    { input: '5', expected: '5' },
    { input: '10', expected: 'A' },

    // Negative integers
    { input: '-1', expected: '-1' },
    { input: '-2', expected: '-2' },
    { input: '-13', expected: '-D' },

    // Positive decimals
    { input: '0.5', expected: '0.V' },
    { input: '0.25', expected: '0.FV' },
    { input: '0.75', expected: '0.kV' },
    { input: '2.5', expected: '2.V' },
    { input: '3.25', expected: '3.FV' },

    // Negative decimals
    { input: '-0.5', expected: '-0.V' },
    { input: '-2.5', expected: '-2.V' },
    { input: '-3.25', expected: '-3.FV' },

    // Rare cases
    { input: '.5', expected: '0.V' },
    { input: '1.', expected: '1.0' },
    { input: '-.25', expected: '-0.FV' },
    { input: '-', expected: '0' },
    { input: '.', expected: '0.0' },
    { input: '-.', expected: '0.0' },
    { input: '-000', expected: '0' },
    { input: '0000000005.375', expected: '5.NFV' },
    { input: 'a', expected: null },
    { input: '12345678A', expected: null },
    { input: '+14242141', expected: null },
    { input: '--1321312312', expected: null },
    { input: '0.5.1', expected: null },

    // Big integers
    { input: '123456', expected: 'W7E' },
    { input: '8526945', expected: 'ZmFN' },
    { input: '1048575', expected: '4OmV' },
    { input: '1048576', expected: '4OmW' },
    {
        input: '89789745615648545615109848904894651065489710848974108948604654890',
        expected: '2fm10IpiL63jzBrPOawGadDFoTZodNnP1T7Lm'
    },

    // Big negatives
    { input: '-123456', expected: '-W7E' },
    { input: '-987654', expected: '-48vu' },
    { input: '-1048575', expected: '-4OmV' },
    {
        input: '-99999878989787456456484894231348978156189781654789784561564898798',
        expected: '-2yckE9MalFuN052vLUYPoxyi4vNpjLlHSIsNq'
    },

    // Big decimals
    { input: '12345.6789', expected: '3D7.g5gsVdybtS4YuwKQyuLQU9ijp' },
    { input: '98765.4321', expected: 'Pgz.QmzWmhqTYon0IRyPannV34f4G' },
    {
        input: '-.012345678987654321798789789745678976545799999979778899875457897987845456666640',
        expected: '-0.0lSJtqwTfwmX5a3KAO3T5iO2i'
    },

    // Big decimals positives and negatives
    { input: '4294967.295', expected: 'I1Jf.IHyl7RHMJq4xWEsYidg9v2Tl7' },
    { input: '-7694924.592', expected: '-WHng.aheAuXj8Qmbh9QHr4SlcBu2yV' },
];