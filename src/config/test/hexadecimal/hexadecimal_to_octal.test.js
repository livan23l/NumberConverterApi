// Connection test
export const tests = [
    // Positive integers
    { input: '0', expected: '0' },
    { input: '1', expected: '1' },
    { input: '2', expected: '2' },
    { input: '5', expected: '5' },
    { input: 'A', expected: '12' },

    // Negative integers
    { input: '-1', expected: '-1' },
    { input: '-2', expected: '-2' },
    { input: '-5', expected: '-5' },

    // Positive decimals
    { input: '0.5', expected: '0.24' },
    { input: '0.E', expected: '0.7' },
    { input: '0.75', expected: '0.352' },
    { input: '2.5', expected: '2.24' },
    { input: '3.F2', expected: '3.744' },

    // Negative decimals
    { input: '-0.5', expected: '-0.24' },
    { input: '-2.5', expected: '-2.24' },
    { input: '-3.E', expected: '-3.7' },

    // Rare cases
    { input: '.5', expected: '0.24' },
    { input: '1.', expected: '1.0' },
    { input: '-.5', expected: '-0.24' },
    { input: '-', expected: '0' },
    { input: '.', expected: '0.0' },
    { input: '-.', expected: '0.0' },
    { input: '-0', expected: '0' },
    { input: '0005.3A', expected: '5.164' },
    { input: 'a', expected: null },
    { input: '12345671A-', expected: null },
    { input: '+14242141', expected: null },
    { input: '--1321312312', expected: null },
    { input: '0.5.1', expected: null },

    // Big integers
    { input: '29CBB8AE49756', expected: '24713561271113526' },
    { input: 'CBC47C667511EE2FB8ACA', expected: '6274217431472421734276705312' },
    { input: '98AEFB4C6751EEFCA789423FCC', expected: '23053575514316507567712361120437714' },
    {
        input: 'AB17621BABEEF87912BF872198FB10ACEFFC09210F70721B89724A0912784FECC',
        expected: '253056610335276737036211277416206307661025473776011102075603441561134445011044741177314'
    },

    // Big negatives
    { input: '-19828764FEA', expected: '-31405035447752' },
    { input: '-3A9AB7845EC62132167EFE', expected: '-35232557021366142046205477376' },
    { input: '-ADC4654AB7848EC4BAC4B89C489AC4DCB89CE', expected: '-12670431245267411073045654227047044232611562704716' },
    {
        input: '-3C8239F2E974308899708E4DC48E4EB391CCB8DD083C1897EFA9C45646E1F684CA894BEC9',
        expected: '-3620216371351350302104627021623342216235316216313433502036030457676516105310670373204625045137311'
    },

    // Big decimals
    { input: '489EBA.6B71A0', expected: '22117272.3267064' },
    { input: '017BB98E76A765.4E32EC987631C', expected: '13673461635523545.23431354460730616' },
    {
        input: '-.89ACDBE897DEB4DBE4DCEBC5646A5CB56E4AC564A65456CA46EC894CA64A9C4894CEAECAB489',
        expected: '-0.423263337211373655155744671657053106513455267112612622462505331221566211231231124704422463527312551044'
    },

    // Big decimals positives and negatives
    { input: 'A67E894CB89EA64.15E787A81', expected: '51477211231342365144.053636075201' },
    { input: '-E789C489A7F3C4.EA789C4E67', expected: '-3474234221151771704.72474234234634' },
];