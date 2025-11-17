// Connection test
export const tests = [
    // Positive integers
    { input: '0', expected: '0' },
    { input: '1', expected: '1' },
    { input: '2', expected: '2' },
    { input: '5', expected: '5' },
    { input: 'A', expected: '10' },

    // Negative integers
    { input: '-1', expected: '-1' },
    { input: '-2', expected: '-2' },
    { input: '-5', expected: '-5' },

    // Positive decimals
    { input: '0.5', expected: '0.3125' },
    { input: '0.E', expected: '0.875' },
    { input: '0.75', expected: '0.45703125' },
    { input: '2.5', expected: '2.3125' },
    { input: '3.F2', expected: '3.9453125' },

    // Negative decimals
    { input: '-0.5', expected: '-0.3125' },
    { input: '-2.5', expected: '-2.3125' },
    { input: '-3.E', expected: '-3.875' },

    // Rare cases
    { input: '.5', expected: '0.3125' },
    { input: '1.', expected: '1.0' },
    { input: '-.5', expected: '-0.3125' },
    { input: '-', expected: '0' },
    { input: '.', expected: '0.0' },
    { input: '-.', expected: '0.0' },
    { input: '-0', expected: '0' },
    { input: '0005.3A', expected: '5.2265625' },
    { input: 'a', expected: null },
    { input: '12345671A-', expected: null },
    { input: '+14242141', expected: null },
    { input: '--1321312312', expected: null },
    { input: '0.5.1', expected: null },

    // Big integers
    { input: '29CBB8AE49756', expected: '735279256475478' },
    { input: 'CBC47C667511EE2FB8ACA', expected: '15396238749469011984747210' },
    { input: '98AEFB4C6751EEFCA789423FCC', expected: '12096834895063587899742785519564' },
    {
        input: 'AB17621BABEEF87912BF872198FB10ACEFFC09210F70721B89724A0912784FECC',
        expected: '1238188987318331350669522730131838033087748156373001310347621942887202379071180'
    },

    // Big negatives
    { input: '-19828764FEA', expected: '-1753025499114' },
    { input: '-3A9AB7845EC62132167EFE', expected: '-70848327268454813037657854' },
    { input: '-ADC4654AB7848EC4BAC4B89C489AC4DCB89CE', expected: '-242196087201452026822530347497852731776534990' },
    {
        input: '-3C8239F2E974308899708E4DC48E4EB391CCB8DD083C1897EFA9C45646E1F684CA894BEC9',
        expected: '-1880773805533168825494220065439671525476574209253169598214830237066497793897756114599625'
    },

    // Big decimals
    { input: '489EBA.6B71A0', expected: '4759226.4197025299072265625' },
    { input: '017BB98E76A765.4E32EC987631C', expected: '417511866017637.30546454164704694989040945074521005153656005859375' },
    {
        input: '-.89ACDBE897DEB4DBE4DCEBC5646A5CB56E4AC564A65456CA46EC894CA64A9C4894CEAECAB489',
        expected: '-0.5377938692907900505713175962456275053978183024137932689864701928886454562470342741414755182575278939046304874334404336949285432181715588269067852520854848542952906913671407917773887305880562235892153375232918147568991223582469226958917426753088332993575797878076961977544812043561250902712345123291015625'
    },

    // Big decimals positives and negatives
    { input: 'A67E894CB89EA64.15E787A81', expected: '749823588748094052.085564116030582226812839508056640625' },
    { input: '-E789C489A7F3C4.EA789C4E67', expected: '-65172196836242372.9159028712665531202219426631927490234375' },
];