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
    { input: '0.5', expected: '0.8' },
    { input: '0.25', expected: '0.4' },
    { input: '0.75', expected: '0.C' },
    { input: '2.5', expected: '2.8' },
    { input: '3.25', expected: '3.4' },

    // Negative decimals
    { input: '-0.5', expected: '-0.8' },
    { input: '-2.5', expected: '-2.8' },
    { input: '-3.25', expected: '-3.4' },

    // Rare cases
    { input: '.5', expected: '0.8' },
    { input: '1.', expected: '1.0' },
    { input: '-.25', expected: '-0.4' },
    { input: '-', expected: '0' },
    { input: '.', expected: '0.0' },
    { input: '-.', expected: '0.0' },
    { input: '-000', expected: '0' },
    { input: '0000000005.375', expected: '5.6' },
    { input: 'a', expected: null },
    { input: '12345678A', expected: null },
    { input: '+14242141', expected: null },
    { input: '--1321312312', expected: null },
    { input: '0.5.1', expected: null },

    // Big integers
    { input: '123456', expected: '1E240' },
    { input: '8526945', expected: '821C61' },
    { input: '1048575', expected: 'FFFFF' },
    { input: '1048576', expected: '100000' },
    {
        input: '89789745615648545615109848904894651065489710848974108948604654890',
        expected: 'DA444BBE89FCE14E04C5920FE7AB534913EA4EC8D27E4B9A1C152A'
    },

    // Big negatives
    { input: '-123456', expected: '-1E240' },
    { input: '-987654', expected: '-F1206' },
    { input: '-1048575', expected: '-FFFFF' },
    {
        input: '-99999878989787456456484894231348978156189781654789784561564898798',
        expected: '-F31613D55231EADFA4237F628C83C8EBB886A71F9889FB5DC1D5EE'
    },

    // Big decimals
    { input: '12345.6789', expected: '3039.ADCC63F141205BC01A36E2EB1' },
    { input: '98765.4321', expected: '181CD.6E9E1B089A027525460AA64C2' },
    {
        input: '-.012345678987654321798789789745678976545799999979778899875457897987845456666640',
        expected: '-0.0329161F7FB73C414A7CDA9ED'
    },

    // Big decimals positives and negatives
    { input: '4294967.295', expected: '418937.4B851EB851EB851EB851EB851' },
    { input: '-7694924.592', expected: '-756A4C.978D4FDF3B645A1CAC083126E' },
];