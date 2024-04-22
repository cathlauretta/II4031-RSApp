function randomBigIntFromInterval(min: bigint, max: bigint): bigint {
    const range = max - min + BigInt(1);
    const randomNumber = BigInt(Math.floor(Number(range) * Math.random()));
    return min + randomNumber;
}

function gcd(a: bigint, b: bigint): bigint {
    if (b === BigInt(0)) {
        return a;
    } else { // Otherwise, recursively compute the GCD
        return gcd(b, a % b);
    }
}

function chooseE(totient: bigint): bigint {
    let e: bigint = BigInt(0);
    do {
        e = randomBigIntFromInterval(BigInt(2), totient - BigInt(1)) as bigint;
    } while (gcd(e, totient) !== BigInt(1));
    return e;
}

function searchD(e: bigint, totient: bigint): bigint {
    var k = BigInt(1);
    var numerator = (k * totient) + BigInt(1);

    while (numerator % e !== BigInt(0)) {
        k += BigInt(1);
        numerator = (k * totient) + BigInt(1);
    }

    const d = numerator / e;
    return d;
}

function bigIntPow(base: bigint, exponent: bigint): bigint {
    let result = BigInt(1);
    while (exponent > BigInt(0)) {
        if (exponent % BigInt(2) === BigInt(1)) {
            result *= base;
        }
        base *= base;
        exponent /= BigInt(2);
    }
    return result;
}

function encrypt(message: bigint[], key: [bigint, bigint]): bigint[] {
    let encryptedMessage: bigint[] = [];
    let res = BigInt(0);

    for (const num of message) {
        res = bigIntPow(BigInt(num), BigInt(key[0])) % BigInt(key[1]);
        encryptedMessage.push(res);
    }
    return encryptedMessage;
}

const encodeBase64 = (data: any) => {
    return Buffer.from(data).toString("base64");
};

const decodeBase64 = (data: any) => {
    return Buffer.from(data, "base64").toString("utf8");
}

function base64StringToIntegerArray(base64String: string): number[] {
    const base64Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    const integerArray: number[] = [];

    for (let i = 0; i < base64String.length; i++) {
        const base64Char = base64String[i];
        
        if (base64Char === "=") { // Padding character
            continue;
        }

        const index = base64Alphabet.indexOf(base64Char);
        if (index === -1) {
            throw new Error("Invalid base64 character");
        }

        integerArray.push(index);
    }

    return integerArray;
}

function integerArrayToBase64String(integerArray: number[]): string {
    const base64Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let base64String = "";

    for (const intValue of integerArray) {
        if (intValue < 0 || intValue >= base64Alphabet.length) {
            throw new Error("Integer value out of range for base64 encoding");
        }

        base64String += base64Alphabet.charAt(intValue);
    }

    return base64String;
}

function integerArrayToString(integerArray: number[]): string {
    let string = "";
    
    for (const intValue of integerArray) {
        if (intValue < 10) {
            string += "0";
        }
        string += intValue.toString();
    }

    return string;
}

function stringToIntegerArray(string: string): number[] {
    const integerArray: number[] = [];

    for (let i = 0; i < string.length; i += 2) {
        const int = parseInt(string.slice(i, i+2));
        if (int < 0 || int >= 100) {
            throw new Error("Character code out of range for encoding");
        }

        integerArray.push(int);
    }

    return integerArray;
}

function numberToBigInt(numbers: number[]): bigint[] {
    const bigInts: bigint[] = [];
    for (const number of numbers) {
        bigInts.push(BigInt(number));
    }
    return bigInts;
}

function bigIntToNumber(bigInts: bigint[]): number[] {
    const numbers: number[] = [];
    for (const bigInt of bigInts) {
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

export function generateKeys(): bigint[] {
    const p = BigInt(47);
    const q = BigInt(71);
    const n = p * q;
    const totient = (p - BigInt(1)) * (q - BigInt(1));
    
    const e = chooseE(totient);
    const d = searchD(e, totient);

    return [e, d, n];
}

export function encryption(text: string, e: bigint, n: bigint): number[] {
    const base64_text = (encodeBase64(text));
    const base64_int = (base64StringToIntegerArray(base64_text));
    const message = numberToBigInt(base64_int);
    const encryptedResult = encrypt(message, [e, n]);
    const encryptedInt = bigIntToNumber(encryptedResult);

    return encryptedInt;
}

export function decryption(arrInt: number[], d: bigint, n: bigint): string {
    const cipher = numberToBigInt(arrInt);
    const decryptedResult = encrypt(cipher, [d, n]);
    const result = bigIntToNumber(decryptedResult);
    const base64result = integerArrayToBase64String(result);
    const message = decodeBase64(base64result);

    return message;
}

const generator = generateKeys();
const e = generator[0];
const d = generator[1];
const n = generator[2];

const message = "Hello World!";
const encRes = encryption(message, e, n);
const messageBase64 = encodeBase64(encRes);
console.log(`The base64 encrypted message is: ${messageBase64}`);

const decRes = decryption(encRes, d, n);
console.log(`The decrypted message is: ${decRes}`);