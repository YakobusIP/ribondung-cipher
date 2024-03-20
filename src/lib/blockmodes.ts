
import * as utils from './blockmaniputils';

export function ecb(uint8bytes: Uint8Array, key_bytes: Uint8Array, encryptdecrypt: (bits128: Uint8Array, key:Uint8Array) => Uint8Array): Uint8Array {
    const blockSize = 16; // Assuming each block is 128 bits (16 bytes)
    const blocks = new Uint8Array(Math.ceil(uint8bytes.length / blockSize) * blockSize);

    for (let i = 0; i < uint8bytes.length; i += blockSize) {
        const block = uint8bytes.slice(i, i + blockSize);
        const encryptedBlock = encryptdecrypt(block, key_bytes); // Assuming encryptdecrypt is defined elsewhere
        blocks.set(encryptedBlock, i);
    }

    return blocks;
}

export function cbc(uint8bytes: Uint8Array, key_bytes: Uint8Array, encryptdecrypt: (bits128: Uint8Array, key:Uint8Array) => Uint8Array, decrypt = false): Uint8Array {
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


export function cfb(uint8bytes: Uint8Array, key_bytes: Uint8Array, encryptdecrypt: (bits128: Uint8Array, key:Uint8Array) => Uint8Array, decrypt = false): Uint8Array {
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

export function ofb(uint8bytes: Uint8Array, key_bytes: Uint8Array, encryptdecrypt: (bits128: Uint8Array, key:Uint8Array) => Uint8Array): Uint8Array {
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

// example use of ecb, cbc

/*
var plaintext="lets see if this is correct okay?"
plaintext = utils.checkAndModifyPlaintext(plaintext)
var key="THIS IS THE KEY"
key = utils.checkAndModifyKey(key)

var bytes = utils.stringTo128BitUint8Array(plaintext)
var key_in_bytes = utils.stringTo128BitUint8Array(key)

const encrypt = (bits128: Uint8Array, key: Uint8Array) => {
    return utils.tempEncryption(bits128, key)
}

const decrypt = (bits128: Uint8Array, key: Uint8Array) => {
    return utils.tempDecryption(bits128, key)
}

var ciphertext = ecb(bytes, key_in_bytes, encrypt)
var ciphertext = cbc(bytes, key_in_bytes, encrypt, false)
var ciphertext = cfb(bytes, key_in_bytes, encrypt, false)
var ciphertext = ofb(bytes, key_in_bytes, encrypt)
var ciphertext = counter(bytes, key_in_bytes, encrypt)

var ciphertext_bin_string = utils.uint8ArrayToBinaryOrString(ciphertext, true)
const bytes_d = utils.binaryStringToUint8Array(ciphertext_bin_string) 

var plaintextd = ecb(bytes_d, key_in_bytes, decrypt)
var plaintextd = cbc(bytes_d, key_in_bytes, decrypt, true)
var plaintextd = cfb(bytes_d, key_in_bytes, encrypt, true)
var plaintextd = ofb(bytes_d, key_in_bytes, encrypt)
var plaintextd = counter(bytes_d, key_in_bytes, encrypt)

console.log(utils.uint8ArrayToBinaryOrString(plaintextd, false))
*/