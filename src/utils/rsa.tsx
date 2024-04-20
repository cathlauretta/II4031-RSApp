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

function encrypt(message: bigint, key: [bigint, bigint]): bigint {
    return (bigIntPow(BigInt(message), BigInt(key[0])) % BigInt(key[1]));
}


const p = BigInt(47);
const q = BigInt(71);

const n = p * q;

const totient = (p - BigInt(1)) * (q - BigInt(1));
const e = chooseE(totient);
console.log(`The public key is: (${e}, ${n})`);

const d = searchD(e, totient);
console.log(`The private key is: (${d}, ${n})`);

const message = BigInt(72);
const encryptedMessage = encrypt(message, [e, n]);
const decryptedMessage = encrypt(encryptedMessage, [d, n]);
console.log(`The message is: ${message}`);
console.log(`The encrypted message is: ${encryptedMessage}`);
console.log(`The decrypted message is: ${decryptedMessage}`);