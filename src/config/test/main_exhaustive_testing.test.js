function makeApiRequest(body) {
    const url = 'http://localhost:3300/api/converter';

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(response => response.json())
            .then(data => {
                resolve(data.data);
            }).catch(err => {
                reject(new Error(err.message));
            });
    });
}

function getRandomInt(digits) {
    return Math.floor(Math.random() * digits);
}

function getRandomNumber(min, max) {
    const digits = getRandomInt(max - min + 1) + min;
    let number = getRandomInt(10).toString();
    while (number == '0') number = getRandomInt(10).toString();

    for (let i = 1; i < digits; i++) {
        number += getRandomInt(10).toString();
    }

    return number;
}

function getRandomBaseName() {
    const base = getRandomInt(7);

    switch (base) {
        case 0: return 'base64';
        case 1: return 'base62';
        case 2: return 'hexadecimal';
        case 3: return 'decimal';
        case 4: return 'octal';
        case 5: return 'binary';
        case 6: return 'text';
    }
}

function addRandomToFormats(baseName, request) {
    // Check if the new base is text to add the language and return
    if (baseName == 'text') {
        const lang = (getRandomInt(2) == 0)
            ? 'en'
            : 'es';
        request.to.format['lang'] = lang;
        return;
    }

    // Check if the new base is base62 or base64 and try to add specific formats
    if (baseName.startsWith('base')) {
        // Randomly try to add order
        if (getRandomInt(2) == 1) {
            const validOrders = (baseName == 'base62')
                ? ['num', 'upper', 'lower']
                : ['upper', 'lower', 'num', 'extra'];
            const initalLen = validOrders.length;
            let order = '';

            for (let i = 0; i < initalLen - 1; i++) {
                order += validOrders.splice(
                    getRandomInt(validOrders.length),
                    1
                )[0] + '-';
            }
            order += validOrders[0];

            request.to.format['order'] = order;
        }

        // Randomly try to add extra characters
        if (baseName == 'base64' && getRandomInt(2) == 1) {
            const validCharacters = [
                '+', '*', '/', '!', '#', '$', '%', '&', '(', ')', '=', '?',
                '¿', '¡', '~', '^', 'ñ', 'Ñ', '_', ':', ';', '[', ']', '{',
                '}'
            ];
            const first = getRandomInt(validCharacters.length);
            let sec = getRandomInt(validCharacters.length);
            while (first == sec) sec = getRandomInt(validCharacters.length);

            request.to.format['extraCharacters'] = [
                validCharacters[first],
                validCharacters[sec]
            ];
        }
    }

    // Randomly try to add separation
    if (getRandomInt(2) == 1) {
        let separation = getRandomInt(3);

        switch (separation) {
            case 0:
                separation = 'comma';
                break;
            case 1:
                separation = 'period';
                break;
            case 2:
                separation = 'none';
                break;
        }

        request.to.format['separation'] = separation;
    }
}

async function makeRandomConversion(request) {
    const newBaseName = getRandomBaseName();

    // Update the request
    request.to.type = newBaseName;
    addRandomToFormats(newBaseName, request);

    // Return the response of the api
    return await makeApiRequest(request);
}

async function numberAfterRandomConversions(num) {
    const request = {
        from: {
            type: 'decimal',
            value: '',
            format: {}
        },
        to: {
            format: {}
        }
    };
    let lastReq = structuredClone(request);
    lastReq.to.type = 'decimal';
    const history = [];
    let convertedNum = num;
    let earlyReturn = false;

    const generateNewRequest = (value) => {
        const newRequest = structuredClone(request);
        newRequest.from.value = value;
        newRequest.from.type = lastReq.to.type;
        newRequest.from.format = lastReq.to.format;
        return newRequest;
    }

    const updateHistory = (req) => {
        let resume = `${req.from.type}: ${req.from.value} ===> ` +
                     `${req.to.type}: ${convertedNum}`;

        const badValues = [undefined, 'undefined', 'NTL', 'NAN'];
        if (badValues.includes(convertedNum)) {
            // Let only the last five elements
            history.splice(0, history.length - 5);
            history.push([resume, JSON.stringify(req)]);
            earlyReturn = true;
            return;
        }

        if (req.to.type.startsWith('base')) {
            const order = req.to.format.order;
            const extra = req.to.format.extraCharacters;
            if (order != undefined) {
                resume += ` --- order: ${order}`;
            }
            if (extra != undefined) {
                resume += ` --- extra: '${extra[0]}', '${extra[1]}'`;
            }
        }

        history.push(resume);
    }

    for (let i = 0; i < 1000; i++) {
        const newReq = generateNewRequest(convertedNum);
        lastReq = newReq;

        convertedNum = await makeRandomConversion(newReq);
        updateHistory(newReq);

        if (earlyReturn) return [convertedNum, history];
    }

    // Return the last conversion into decimal
    const newReq = generateNewRequest(convertedNum);
    newReq.to.type = 'decimal';
    convertedNum = await makeApiRequest(newReq);
    updateHistory(newReq);
    return [convertedNum, history];
}

async function testing() {
    console.clear();

    try {
        console.log("--------Starting the exahustive testing--------");
        for (let i = 0; i < 1000; i++) {
            const decimals = getRandomNumber(5, 15);
            const isNegative = getRandomInt(2) == 1;
            const iNumber = (isNegative)
                ? '-' + getRandomNumber(1, 66) + '.' + decimals
                : getRandomNumber(1, 66) + '.' + decimals;
            const conversions = await numberAfterRandomConversions(iNumber);
            const fNumber = conversions[0];
            const history = conversions[1];

            const numLen = iNumber.length - (decimals.length + 1);
            if (iNumber.slice(0, numLen + 2) != fNumber.slice(0, numLen + 2)) {
                console.log('Test failed');
                console.log(`Initial number: ${iNumber}`);
                console.log(`Final   number: ${fNumber}`);
                console.log(history);
                console.log('\n\n\n');
                break;
            }
        }
        console.log("--------------Finish the testing---------------");
    } catch (err) {
        console.log(err.message);
    }
}

testing();