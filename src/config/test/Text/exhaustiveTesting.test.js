import { Decimal } from "../../../app/utils/Decimal.js";
import { Text } from "../../../app/utils/Text.js";

const maxDecimals = 5;

const randomDig = (dig) => Math.floor(Math.random() * dig).toString();
const getRandomNumber = (digits) => {
    // Generate a random number with the corresponding digits
    let number = '';
    for (let k = 0; k < digits; k++) {
        let random = randomDig(10);

        // Validation for zero in the first position
        while (random == '0' && k == 0 && digits > 1) random = randomDig(10);

        number += random;
    }

    // Randomly choose if the number will be negative or positive
    if (randomDig(2) == '1') number = '-' + number;

    // Randomly choose if the number will have decimals
    if (randomDig(2) == '1') {
        number += '.';
        const decimals = Number(randomDig(maxDecimals)) + 1;

        for (let k = 0; k < decimals; k++) number += randomDig(10);
    }

    return number;
};
const testing = (lang) => {
    const maxDigits = (lang == 'en') ? 66 : 126;
    const validations = 10000;
    for (let i = 0; i < validations; i++) {
        for (let j = 0; j < maxDigits; j++) {
            const number = getRandomNumber(j + 1);

            // Transform the number to text
            const numberInText = Decimal.totext(number, lang);

            // Transform the number in text to decimal
            const numberInDec = Text.todecimal(numberInText, lang);

            // Check if both numbers are different to show the error
            if (number != numberInDec) console.log(`Error with: ${number}`);
        }
    }
}

console.clear();

console.log("--------Starting the exahustive testing for numbers in english--------");
testing('en');
console.log("--------------------------Finish the testing--------------------------\n\n");

console.log("--------Starting the exahustive testing for numbers in spanish--------");
testing('es');
console.log("--------------------------Finish the testing--------------------------\n\n");
