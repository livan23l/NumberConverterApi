// Hexadecimal tests
import { tests as hexTestsDec } from "./hexadecimal/hexadecimal_to_decimal.test.js";
import { tests as hexTestsOct } from "./hexadecimal/hexadecimal_to_octal.test.js";
import { tests as hexTestsBin } from "./hexadecimal/hexadecimal_to_binary.test.js";

// Decimals tests
import { tests as decTestsB62 } from "./decimals/decimals_to_base62.test.js";
import { tests as decTestsHex } from "./decimals/decimals_to_hexadecimal.test.js";
import { tests as decTestsOct } from "./decimals/decimals_to_octal.test.js";
import { tests as decTestsBin } from "./decimals/decimals_to_binary.test.js";
import { tests as decTestsTextEn } from "./decimals/decimals_to_text_en.test.js";
import { tests as decTestsTextEs } from "./decimals/decimals_to_text_es.test.js";

// Octal Tests
import { tests as octTestsHex } from "./octal/octal_to_hexadecimal.test.js";
import { tests as octTestsDec } from "./octal/octal_to_decimal.test.js";
import { tests as octTestsBin } from "./octal/octal_to_binary.test.js";

// Binary Tests
import { tests as binTestsOct } from "./binary/binary_to_octal.test.js";
import { tests as binTestsDec } from "./binary/binary_to_decimal.test.js";
import { tests as binTestsHex } from "./binary/binary_to_hexadecimal.test.js";

// Text Tests
import { tests as textTestsDecEn } from "./Text/text_to_decimals_en.test.js";
import { tests as textTestsDecEs } from "./Text/text_to_decimals_es.test.js";

class Tester {
    static #url = 'http://localhost:3300/api/converter';
    static #body = {
        "from": {},
        "to": {}
    };

    static #executeTest(test) {
        // Set the current value in the body
        const { input, expected } = test;
        this.#body.from.value = input;

        return new Promise((resolve, reject) => {
            fetch(this.#url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.#body)
            })
                .then(response => response.json())
                .then(data => {
                    // Get the current res
                    const res = data.data;
    
                    // Show the corresponding response
                    const response = (res == expected)
                        ? { status: 'OK' }
                        : {
                            status: 'Error',
                            error: `Expected '${expected}' and received ` +
                                   `'${res}' in the input '${input}'.`
                        };
                    resolve(response);
                }).catch(err => {
                    reject(new Error(err.message));
                });
        });
    }

    static async #executeTests(tests, type, title = 'Untitled Tests') {
        // Set the 'to.type' in the body
        this.#body.to.type = type;

        // Show the current title
        console.log(`------------------------${title}------------------------`);

        // Run the tests
        let okTests = 0;
        for (const test of tests) {
            try {
                const response = await this.#executeTest(test);
                if (response.status == 'OK') okTests++;
                else console.log(`Test [Error]: ${response.error}`);
            } catch(err) {
                console.log(err.message);
            }
        }
        if (okTests > 0) console.log(`Test [OK]: ${okTests} tests passed`);
    }

    static async runAllHexadecimalTests() {
        try {
            this.#body.from.type = 'hexadecimal';
            console.log('                        HEXADECIMAL TESTS');
            await this.#executeTests(hexTestsBin, 'binary', 'To Binary');
            await this.#executeTests(hexTestsOct, 'octal', 'To Octal');
            await this.#executeTests(hexTestsDec, 'decimal', 'To Decimal');
        } catch(err) {
            console.log(err.message);
        }
    }

    static async runAllDecimalsTests() {
        try {
            this.#body.from.type = 'decimal';
            console.log('                        DECIMALS TESTS');
            await this.#executeTests(decTestsBin, 'binary', 'To Binary');
            await this.#executeTests(decTestsOct, 'octal', 'To Octal');
            await this.#executeTests(decTestsHex, 'hexadecimal', 'To Hexadecimal');
            await this.#executeTests(decTestsB62, 'base62', 'To Base 62');
            this.#body.to.format = {};
            this.#body.to.format.lang = 'en';
            await this.#executeTests(decTestsTextEn, 'text', 'To Text En');
            this.#body.to.format.lang = 'es';
            await this.#executeTests(decTestsTextEs, 'text', 'To Text Es');
        } catch(err) {
            console.log(err.message);
        }
    }

    static async runAllOctalTests() {
        try {
            this.#body.from.type = 'octal';
            console.log('                        OCTAL TESTS');
            await this.#executeTests(octTestsBin, 'binary', 'To Binary');
            await this.#executeTests(octTestsDec, 'decimal', 'To Decimal');
            await this.#executeTests(octTestsHex, 'hexadecimal', 'To Hexadecimal');
        } catch(err) {
            console.log(err.message);
        }
    }

    static async runAllBinaryTests() {
        try {
            this.#body.from.type = 'binary';
            console.log('                        BINARY TESTS');
            await this.#executeTests(binTestsOct, 'octal', 'To Octal');
            await this.#executeTests(binTestsDec, 'decimal', 'To Decimal');
            await this.#executeTests(binTestsHex, 'hexadecimal', 'To Hexadecimal');
        } catch(err) {
            console.log(err.message);
        }
    }

    static async runAllTextTests() {
        try {
            this.#body.from.type = 'text';
            this.#body.from.format = {};
            console.log('                        TEXT TESTS');
            this.#body.from.format.lang = 'en';
            await this.#executeTests(textTestsDecEn, 'decimal', 'To Decimal En');
            this.#body.from.format.lang = 'es';
            await this.#executeTests(textTestsDecEs, 'decimal', 'To Decimal Es');
        } catch(err) {
            console.log(err.message);
        }
    }

    static async runAllTests() {
        await this.runAllHexadecimalTests();
        console.log('\n');
        await this.runAllDecimalsTests();
        console.log('\n');
        await this.runAllOctalTests();
        console.log('\n');
        await this.runAllBinaryTests();
        console.log('\n');
        await this.runAllTextTests();
    }
}

console.clear();
Tester.runAllTests();