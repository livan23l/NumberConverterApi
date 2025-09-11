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
    { input: '0.5', expected: '0.A' },
    { input: '0.25', expected: '0.54' },
    { input: '0.75', expected: '0.F4' },
    { input: '2.5', expected: '2.A' },
    { input: '3.25', expected: '3.54' },

    // Negative decimals
    { input: '-0.5', expected: '-0.A' },
    { input: '-2.5', expected: '-2.A' },
    { input: '-3.25', expected: '-3.54' },

    // Rare cases
    { input: '.5', expected: '0.A' },
    { input: '1.', expected: '1.0' },
    { input: '-.5', expected: '-0.A' },
    { input: '-', expected: '0' },
    { input: '.', expected: '0.0' },
    { input: '-.', expected: '0.0' },
    { input: '-0', expected: '0' },
    { input: '0005.375', expected: '5.7E8' },
    { input: 'a', expected: null },
    { input: '12345671A', expected: null },
    { input: '+14242141', expected: null },
    { input: '--1321312312', expected: null },
    { input: '0.5.1', expected: null },

    // Big integers
    { input: '12345670', expected: '29CBB8' },
    { input: '764723106757560', expected: '1F4E991BDF70' },
    { input: '1041575', expected: '4437D' },
    {
        input: '10710745615641545615100141004104651065410710141074101041604654100',
        expected: '11C8F2E374365C6900C204226A46B08E4184784110E135840'
    },

    // Big negatives
    { input: '-123456', expected: '-A72E' },
    { input: '-017654', expected: '-1FAC' },
    { input: '-1041575', expected: '-4437D' },
    {
        input: '-00000171010717456456414104231341071156110711654710714561564101701',
        expected: '-3C8239F2E974308899708E4DC48E4EB391CCB8DD083C1'
    },

    // Big decimals
    { input: '12345.6710', expected: '14E5.DC8' },
    { input: '01765.4321', expected: '3F5.8D1' },
    {
        input: '-.012345671017654321701710710745671076545700000070771100175457107017145456666640',
        expected: '-0.05397720FD634783C8E4797723EB2F000038FC900FB2F2383CCB2EDB68'
    },

    // Big decimals positives and negatives
    { input: '4204067.205', expected: '110837.428' },
    { input: '-7604024.502', expected: '-1F0814.A1' },
];