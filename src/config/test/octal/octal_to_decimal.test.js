// Connection test
export const tests = [
    // Positive integers
    { input: '0', expected: '0' },
    { input: '1', expected: '1' },
    { input: '2', expected: '2' },
    { input: '5', expected: '5' },
    { input: '10', expected: '8' },

    // Negative integers
    { input: '-1', expected: '-1' },
    { input: '-2', expected: '-2' },
    { input: '-5', expected: '-5' },

    // Positive decimals
    { input: '0.5', expected: '0.625' },
    { input: '0.25', expected: '0.328125' },
    { input: '0.75', expected: '0.953125' },
    { input: '2.5', expected: '2.625' },
    { input: '3.25', expected: '3.328125' },

    // Negative decimals
    { input: '-0.5', expected: '-0.625' },
    { input: '-2.5', expected: '-2.625' },
    { input: '-3.25', expected: '-3.328125' },

    // Rare cases
    { input: '.5', expected: '0.625' },
    { input: '1.', expected: '1.0' },
    { input: '-.5', expected: '-0.625' },
    { input: '-', expected: '0' },
    { input: '.', expected: '0.0' },
    { input: '-.', expected: '0.0' },
    { input: '-0', expected: '0' },
    { input: '0005.375', expected: '5.494140625' },
    { input: 'a', expected: null },
    { input: '12345671A', expected: null },
    { input: '+14242141', expected: null },
    { input: '--1321312312', expected: null },
    { input: '0.5.1', expected: null },

    // Big integers
    { input: '12345670', expected: '2739128' },
    { input: '764723106757560', expected: '34422436650864' },
    { input: '1041575', expected: '279421' },
    {
        input: '10710745615641545615100141004104651065410710141074101041604654100',
        expected: '6977373708001731170123974283075788262823785604372818516032'
    },

    // Big negatives
    { input: '-123456', expected: '-42798' },
    { input: '-017654', expected: '-8108' },
    { input: '-1041575', expected: '-279421' },
    {
        input: '-00000171010717456456414104231341071156110711654710714561564101701',
        expected: '-362223859069546577521760362099053635248668122132022209'
    },

    // Big decimals
    { input: '12345.6710', expected: '5349.861328125' },
    { input: '01765.4321', expected: '1013.551025390625' },
    {
        input: '-.012345671017654321701710710745671076545700000070771100175457107017145456666640',
        expected: '-0.0204081016103262390779544404092203588106893743027290684642701932546951540297406429100153651973278185145761497477392445743549746316390177473068174423268178967540040530464446161565981045283614536689498208943405188620090484619140625'
    },

    // Big decimals positives and negatives
    { input: '4204067.205', expected: '1116215.259765625' },
    { input: '-7604024.502', expected: '-2033684.62890625' },
];