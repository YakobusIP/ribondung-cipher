
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



// example use of ecb

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

var ciphertext_bin_string = utils.uint8ArrayToBinaryOrString(ciphertext, true)
const bytes_d = utils.binaryStringToUint8Array(ciphertext_bin_string) 

var plaintextd = ecb(bytes_d, key_in_bytes, decrypt)
console.log(utils.uint8ArrayToBinaryOrString(plaintextd, false))
*/