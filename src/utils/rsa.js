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
    return (bigIntPow(BigInt(message), BigInt(key[0])) % BigInt(key[1]));
}
// Test the function
var p = BigInt(47);
var q = BigInt(71);
var n = p * q;
var totient = (p - BigInt(1)) * (q - BigInt(1));
var e = chooseE(totient);
console.log("The public key is: (".concat(e, ", ").concat(n, ")"));
var d = searchD(e, totient);
console.log("The private key is: (".concat(d, ", ").concat(n, ")"));
var message = BigInt(72);
var encryptedMessage = encrypt(message, [e, n]);
var decryptedMessage = encrypt(encryptedMessage, [d, n]);
console.log("The message is: ".concat(message));
console.log("The encrypted message is: ".concat(encryptedMessage));
console.log("The decrypted message is: ".concat(decryptedMessage));
