
import * as utils from './blockmaniputils';

function ecb(uint8bytes: Uint8Array, key_bytes: Uint8Array, encryptdecrypt: (bits128: Uint8Array, key:Uint8Array) => Uint8Array): Uint8Array {
    const blockSize = 16; // Assuming each block is 128 bits (16 bytes)
    const blocks = new Uint8Array(Math.ceil(uint8bytes.length / blockSize) * blockSize);

    for (let i = 0; i < uint8bytes.length; i += blockSize) {
        const block = uint8bytes.slice(i, i + blockSize);
        const encryptedBlock = encryptdecrypt(block, key_bytes); // Assuming encryptdecrypt is defined elsewhere
        blocks.set(encryptedBlock, i);
    }
    return blocks;
}

function cbc(uint8bytes: Uint8Array, key_bytes: Uint8Array, encryptdecrypt: (bits128: Uint8Array, key:Uint8Array) => Uint8Array, decrypt = false): Uint8Array {
    const random="THISISASECRETOKA"
    const blockSize = 16; // Assuming each block is 128 bits (16 bytes)
    const blocks = new Uint8Array(Math.ceil(uint8bytes.length / blockSize) * blockSize);
    let iv = utils.stringTo128BitUint8Array(utils.checkAndModifyPlaintext(random))
    
    // the algorithm
    for (let i = 0; i < uint8bytes.length; i+= blockSize) {
        const block = uint8bytes.slice(i, i + blockSize);
        if (!decrypt) {
            var result = utils.xor(block, iv)
            const encrypted_block = encryptdecrypt(result, key_bytes); // Assuming encryptdecrypt is defined elsewhere
            iv.set(encrypted_block)
            blocks.set(encrypted_block, i);
        } else {
            const decrypted_block = encryptdecrypt(block, key_bytes); // Assuming encryptdecrypt is defined elsewhere
            var result = utils.xor(decrypted_block, iv)
            iv.set(block, 0)
            blocks.set(result, i)
        }
    }
    return blocks
}

function cfb(uint8bytes: Uint8Array, key_bytes: Uint8Array, encryptdecrypt: (bits128: Uint8Array, key:Uint8Array) => Uint8Array, decrypt = false): Uint8Array {
    const random="THISISASECRETOKA"
    const blockSize = 16; // Assuming each block is 128 bits (16 bytes)
    const blocks = new Uint8Array(Math.ceil(uint8bytes.length / blockSize) * blockSize);
    let iv = utils.stringTo128BitUint8Array(utils.checkAndModifyPlaintext(random))
    const n = iv.length
    
    // the algorithm (setiap 8 bits)
    for (let i = 0; i < uint8bytes.length; i++) {
        const encrypted_block = encryptdecrypt(iv, key_bytes)
        const ci = uint8bytes[i] ^ encrypted_block[0]
        iv.set(iv.slice(1, n),0)
        if (!decrypt) {
            iv[n-1] = ci
        } else {
            iv[n-1] = uint8bytes[i]
        }
        blocks[i] = ci
    }
    return blocks
}

function ofb(uint8bytes: Uint8Array, key_bytes: Uint8Array, encryptdecrypt: (bits128: Uint8Array, key:Uint8Array) => Uint8Array): Uint8Array {
    const random="THISISASECRETOKA"
    const blockSize = 16; // Assuming each block is 128 bits (16 bytes)
    const blocks = new Uint8Array(Math.ceil(uint8bytes.length / blockSize) * blockSize);
    let iv = utils.stringTo128BitUint8Array(utils.checkAndModifyPlaintext(random))
    const n = iv.length
    
    // the algorithm (setiap 8 bits)
    for (let i = 0; i < uint8bytes.length; i++) {
        const encrypted_block = encryptdecrypt(iv, key_bytes)
        const ci = uint8bytes[i] ^ encrypted_block[0]
        iv.set(iv.slice(1, n),0)
        iv[n-1] = encrypted_block[0]
        blocks[i] = ci
    }
    return blocks
}

function counter(uint8bytes: Uint8Array, key_bytes: Uint8Array, encryptdecrypt: (bits128: Uint8Array, key:Uint8Array) => Uint8Array): Uint8Array {
    const blockSize = 16; // Assuming each block is 128 bits (16 bytes)
    const blocks = new Uint8Array(Math.ceil(uint8bytes.length / blockSize) * blockSize);
    var counter = utils.stringTo128BitUint8Array("AAAAAAAAAAAAAAAA")

    for (let i = 0; i < uint8bytes.length; i += blockSize) {
        const block = uint8bytes.slice(i, i + blockSize);
        const encrypted = encryptdecrypt(counter, key_bytes)
        const cipher = utils.xor(block, encrypted)
        blocks.set(cipher, i);
        utils.incrementCounter(counter)
    }
    return blocks;
}


export function executeMode(mode: string, text: string, key: string, encryptdecrypt: (bits128: Uint8Array, key:Uint8Array) => Uint8Array, fromBinary = false, toBinary = false, decrypt = false): string {
    var text_bytes: Uint8Array
    var result_bytes: Uint8Array
    if (fromBinary) {
        text_bytes = utils.binaryStringToUint8Array(text)
    } else {
        text_bytes = utils.stringTo128BitUint8Array(text)
    }
    const key_bytes = utils.stringTo128BitUint8Array(utils.checkAndModifyKey(key))

    switch (mode) {
        case "ECB":
            result_bytes = ecb(text_bytes, key_bytes, encryptdecrypt)
            break;
        case "CBC":
            result_bytes = cbc(text_bytes, key_bytes, encryptdecrypt, decrypt)
            break;
        case "CFB":
            result_bytes = cfb(text_bytes, key_bytes, encryptdecrypt, decrypt)
            break;
        case "OFB":
            result_bytes = ofb(text_bytes, key_bytes, encryptdecrypt)
            break;
        case "counter":
            result_bytes = counter(text_bytes, key_bytes, encryptdecrypt)
            break;
        default:
            return "Invalid mode"
    }
    if (toBinary) {
        return utils.uint8ArrayToBinaryOrString(result_bytes, true)
    } else {
        return utils.uint8ArrayToBinaryOrString(result_bytes, false)
    }
}


const encrypt = (bits128: Uint8Array, key: Uint8Array) => {
    return utils.tempEncryption(bits128, key)
}

const decrypt = (bits128: Uint8Array, key: Uint8Array) => {
    return utils.tempDecryption(bits128, key)
}

var plaintext="This is correct rigth? hopefylly it's rightt"
var key="THIS IS THE KEY"

// var ciphertext = executeMode("ECB", plaintext, key, encrypt, false, true, false)
// var plaintextd = executeMode("ECB", ciphertext, key, decrypt, true, false, true)

// var ciphertext = executeMode("CBC", plaintext, key, encrypt, false, true, false)
// var plaintextd = executeMode("CBC", ciphertext, key, decrypt, true, false, true)

// var ciphertext = executeMode("CFB", plaintext, key, encrypt, false, true, false)
// var plaintextd = executeMode("CFB", ciphertext, key, encrypt, true, false, true)

// var ciphertext = executeMode("OFB", plaintext, key, encrypt, false, true, false)
// var plaintextd = executeMode("OFB", ciphertext, key, encrypt, true, false, true)

var ciphertext = executeMode("counter", plaintext, key, encrypt, false, true, false)
var plaintextd = executeMode("counter", ciphertext, key, encrypt, true, false, true)
console.log(ciphertext)
console.log(plaintextd)