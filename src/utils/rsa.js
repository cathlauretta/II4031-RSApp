"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryption = exports.encryption = exports.generateKeys = void 0;
function randomBigIntFromInterval(min, max) {
    var range = max - min + BigInt(1);
    var randomNumber = BigInt(Math.floor(Number(range) * Math.random()));
    return min + randomNumber;
}
function gcd(a, b) {
    if (b === BigInt(0)) {
        return a;
    }
    else { // Otherwise, recursively compute the GCD
        return gcd(b, a % b);
    }
}
function chooseE(totient) {
    var e = BigInt(0);
    do {
        e = randomBigIntFromInterval(BigInt(2), totient - BigInt(1));
    } while (gcd(e, totient) !== BigInt(1));
    return e;
}
function searchD(e, totient) {
    var k = BigInt(1);
    var numerator = (k * totient) + BigInt(1);
    while (numerator % e !== BigInt(0)) {
        k += BigInt(1);
        numerator = (k * totient) + BigInt(1);
    }
    var d = numerator / e;
    return d;
}
function bigIntPow(base, exponent) {
    var result = BigInt(1);
    while (exponent > BigInt(0)) {
        if (exponent % BigInt(2) === BigInt(1)) {
            result *= base;
        }
        base *= base;
        exponent /= BigInt(2);
    }
    return result;
}
function encrypt(message, key) {
    var encryptedMessage = [];
    var res = BigInt(0);
    for (var _i = 0, message_1 = message; _i < message_1.length; _i++) {
        var num = message_1[_i];
        res = bigIntPow(BigInt(num), BigInt(key[0])) % BigInt(key[1]);
        encryptedMessage.push(res);
    }
    return encryptedMessage;
}
var encodeBase64 = function (data) {
    return Buffer.from(data).toString("base64");
};
var decodeBase64 = function (data) {
    return Buffer.from(data, "base64").toString("utf8");
};
function base64StringToIntegerArray(base64String) {
    var base64Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var integerArray = [];
    for (var i = 0; i < base64String.length; i++) {
        var base64Char = base64String[i];
        if (base64Char === "=") { // Padding character
            continue;
        }
        var index = base64Alphabet.indexOf(base64Char);
        if (index === -1) {
            throw new Error("Invalid base64 character");
        }
        integerArray.push(index);
    }
    return integerArray;
}
function integerArrayToBase64String(integerArray) {
    var base64Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var base64String = "";
    for (var _i = 0, integerArray_1 = integerArray; _i < integerArray_1.length; _i++) {
        var intValue = integerArray_1[_i];
        if (intValue < 0 || intValue >= base64Alphabet.length) {
            throw new Error("Integer value out of range for base64 encoding");
        }
        base64String += base64Alphabet.charAt(intValue);
    }
    return base64String;
}
function integerArrayToString(integerArray) {
    var string = "";
    for (var _i = 0, integerArray_2 = integerArray; _i < integerArray_2.length; _i++) {
        var intValue = integerArray_2[_i];
        if (intValue < 10) {
            string += "0";
        }
        string += intValue.toString();
    }
    return string;
}
function stringToIntegerArray(string) {
    var integerArray = [];
    for (var i = 0; i < string.length; i += 2) {
        var int = parseInt(string.slice(i, i + 2));
        if (int < 0 || int >= 100) {
            throw new Error("Character code out of range for encoding");
        }
        integerArray.push(int);
    }
    return integerArray;
}
function numberToBigInt(numbers) {
    var bigInts = [];
    for (var _i = 0, numbers_1 = numbers; _i < numbers_1.length; _i++) {
        var number = numbers_1[_i];
        bigInts.push(BigInt(number));
    }
    return bigInts;
}
function bigIntToNumber(bigInts) {
    var numbers = [];
    for (var _i = 0, bigInts_1 = bigInts; _i < bigInts_1.length; _i++) {
        var bigInt = bigInts_1[_i];
        numbers.push(Number(bigInt));
    }
    return numbers;
}
// const intString = (integerArrayToString(base64int));
// console.log(`The integer to String is: ${intString}`);
// const stringInt = (stringToIntegerArray(intString));
// console.log(`The string to integer is: ${stringInt}`);
// const base64cipher = (integerArrayToBase64String(stringInt));
// console.log(`The decoded base64 message is: ${base64cipher}`);
// const decode_base64 = (decodeBase64(base64cipher));
// console.log(`The decoded message is: ${decode_base64}`);
function generateKeys() {
    var p = BigInt(47);
    var q = BigInt(71);
    var n = p * q;
    var totient = (p - BigInt(1)) * (q - BigInt(1));
    var e = chooseE(totient);
    var d = searchD(e, totient);
    return [e, d, n];
}
exports.generateKeys = generateKeys;
function encryption(text, e, n) {
    var base64_text = (encodeBase64(text));
    var base64_int = (base64StringToIntegerArray(base64_text));
    var message = numberToBigInt(base64_int);
    var encryptedResult = encrypt(message, [e, n]);
    var encryptedInt = bigIntToNumber(encryptedResult);
    return encryptedInt;
}
exports.encryption = encryption;
function decryption(arrInt, d, n) {
    var cipher = numberToBigInt(arrInt);
    var decryptedResult = encrypt(cipher, [d, n]);
    var result = bigIntToNumber(decryptedResult);
    var base64result = integerArrayToBase64String(result);
    var message = decodeBase64(base64result);
    return message;
}
exports.decryption = decryption;
var generator = generateKeys();
var e = generator[0];
var d = generator[1];
var n = generator[2];
var message = "Hello World!";
var encRes = encryption(message, e, n);
var messageBase64 = encodeBase64(encRes);
console.log("The base64 encrypted message is: ".concat(messageBase64));
var decRes = decryption(encRes, d, n);
console.log("The decrypted message is: ".concat(decRes));
