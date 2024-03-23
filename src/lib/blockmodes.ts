
import * as utils from './blockmaniputils';
import { fileToUint8Array } from './utils';
import { encrypt, decrypt } from './block-cipher';

async function ecb(uint8bytes: Uint8Array, key_bytes: Uint8Array, isDecrypt = false): Promise<Uint8Array> {
    const blockSize = 16; // Assuming each block is 128 bits (16 bytes)
    const blocks = new Uint8Array(Math.ceil(uint8bytes.length / blockSize) * blockSize);

    if (isDecrypt) {
        for (let i = 0; i < uint8bytes.length; i += blockSize) {
            const block = uint8bytes.slice(i, i + blockSize);
            const decryptedBlock = await decrypt(block, key_bytes); // Assumin is defined elsewhere
            blocks.set(decryptedBlock, i);
        }
        return blocks;
    } else {
        for (let i = 0; i < uint8bytes.length; i += blockSize) {
            const block = uint8bytes.slice(i, i + blockSize);
            const encryptedBlock = await encrypt(block, key_bytes); // Assumin is defined elsewhere
            blocks.set(encryptedBlock, i);
        }
        return blocks;
    }
}

async function cbc(uint8bytes: Uint8Array, key_bytes: Uint8Array, isDecrypt = false): Promise<Uint8Array> {
    const random="THISISASECRETOKA"
    const blockSize = 16; // Assuming each block is 128 bits (16 bytes)
    const blocks = new Uint8Array(Math.ceil(uint8bytes.length / blockSize) * blockSize);
    let iv = utils.stringTo128BitUint8Array(utils.checkAndModifyPlaintext(random))
    
    // the algorithm
    for (let i = 0; i < uint8bytes.length; i+= blockSize) {
        const block = uint8bytes.slice(i, i + blockSize);
        if (!isDecrypt) {
            var result = utils.xor(block, iv)
            const encrypted_block = await encrypt(result, key_bytes); // Assumin is defined elsewhere
            iv.set(encrypted_block)
            blocks.set(encrypted_block, i);
        } else {
            const decrypted_block = await decrypt(block, key_bytes); // Assumin is defined elsewhere
            var result = utils.xor(decrypted_block, iv)
            iv.set(block, 0)
            blocks.set(result, i)
        }
    }
    return blocks
}

async function cfb(uint8bytes: Uint8Array, key_bytes: Uint8Array, isDecrypt = false): Promise<Uint8Array> {
    const random="THISISASECRETOKA"
    const blockSize = 16; // Assuming each block is 128 bits (16 bytes)
    const blocks = new Uint8Array(Math.ceil(uint8bytes.length / blockSize) * blockSize);
    let iv = utils.stringTo128BitUint8Array(utils.checkAndModifyPlaintext(random))
    const n = iv.length
    
    // the algorithm (setiap 8 bits)
    for (let i = 0; i < uint8bytes.length; i++) {
        const encrypted_block = await encrypt(iv, key_bytes)
        const ci = uint8bytes[i] ^ encrypted_block[0]
        iv.set(iv.slice(1, n),0)
        if (!isDecrypt) {
            iv[n-1] = ci
        } else {
            iv[n-1] = uint8bytes[i]
        }
        blocks[i] = ci
    }
    return blocks
}

async function ofb(uint8bytes: Uint8Array, key_bytes: Uint8Array): Promise<Uint8Array> {
    const random="THISISASECRETOKA"
    const blockSize = 16; // Assuming each block is 128 bits (16 bytes)
    const blocks = new Uint8Array(Math.ceil(uint8bytes.length / blockSize) * blockSize);
    let iv = utils.stringTo128BitUint8Array(utils.checkAndModifyPlaintext(random))
    const n = iv.length
    
    // the algorithm (setiap 8 bits)
    for (let i = 0; i < uint8bytes.length; i++) {
        const encrypted_block = await encrypt(iv, key_bytes)
        const ci = uint8bytes[i] ^ encrypted_block[0]
        iv.set(iv.slice(1, n),0)
        iv[n-1] = encrypted_block[0]
        blocks[i] = ci
    }
    return blocks
}

async function counter(uint8bytes: Uint8Array, key_bytes: Uint8Array): Promise<Uint8Array> {
    const blockSize = 16; // Assuming each block is 128 bits (16 bytes)
    const blocks = new Uint8Array(Math.ceil(uint8bytes.length / blockSize) * blockSize);
    var counter = utils.stringTo128BitUint8Array("AAAAAAAAAAAAAAAA")

    for (let i = 0; i < uint8bytes.length; i += blockSize) {
        const block = uint8bytes.slice(i, i + blockSize);
        const encrypted = await encrypt(counter, key_bytes)
        const cipher = utils.xor(block, encrypted)
        blocks.set(cipher, i);
        utils.incrementCounter(counter)
    }
    return blocks;
}


export async function executeMode(mode: string, text: string, key: string, fromBinary = false, toBinary = false, isDecrypt = false): Promise<string> {
    var text_bytes: Uint8Array
    var result_bytes: Uint8Array
    if (fromBinary) {
        text_bytes = utils.binaryStringToUint8Array(text)
    } else {
        text_bytes = utils.stringTo128BitUint8Array(text)
    }
    const key_bytes = utils.stringTo128BitUint8Array(utils.checkAndModifyKey(key))

    switch (mode) {
        case "ecb":
            result_bytes = await ecb(text_bytes, key_bytes, isDecrypt)
            break;
        case "cbc":
            result_bytes = await cbc(text_bytes, key_bytes, isDecrypt)
            break;
        case "cfb":
            result_bytes = await cfb(text_bytes, key_bytes, isDecrypt)
            break;
        case "ofb":
            result_bytes = await ofb(text_bytes, key_bytes)
            break;
        case "ctr":
            result_bytes = await counter(text_bytes, key_bytes)
            break;
        default:
            return "Invalid mode"
    }
    if (toBinary) {
        return Promise.resolve(utils.uint8ArrayToBinaryOrString(result_bytes, true))
    } else {
        return Promise.resolve(utils.uint8ArrayToBinaryOrString(result_bytes, false))
    }
}

export async function executeModeFile(mode: string, file: File, key: string, decrypt = false): Promise<File> {
    return new Promise((resolve, reject) => {
        fileToUint8Array(file, async (uint8Array) => {
            const text_bytes = utils.checkAndModifyBinary(uint8Array);
            const key_bytes = utils.stringTo128BitUint8Array(utils.checkAndModifyKey(key));

            let result_bytes: Uint8Array;
            switch (mode) {
                case "ecb":
                    result_bytes = await ecb(text_bytes, key_bytes);
                    break;
                case "cbc":
                    result_bytes = await cbc(text_bytes, key_bytes, decrypt);
                    break;
                case "cfb":
                    result_bytes = await cfb(text_bytes, key_bytes, decrypt);
                    break;
                case "ofb":
                    result_bytes = await ofb(text_bytes, key_bytes);
                    break;
                case "ctr":
                    result_bytes = await counter(text_bytes, key_bytes);
                    break;
                default:
                    reject("Invalid mode");
                    return;
            }
            
            const filename = file.name.split(".")
            if (decrypt) {
                const resultFile = new File([result_bytes], `${filename[0]}_decrypted_${mode}.${filename[1]||file.type}`, { type: file.type });
                resolve(resultFile);
            } else {
                const resultFile = new File([result_bytes], `${filename[0]}_encrypted_${mode}.${filename[1]||file.type}`, { type: file.type });
                resolve(resultFile);
            }
        });
    });
}