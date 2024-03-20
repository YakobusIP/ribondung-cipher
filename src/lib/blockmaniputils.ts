/* Convert String to Uint8Array*/
export function stringTo128BitUint8Array(str: string): Uint8Array {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    
    // Calculate the number of 16-byte (128-bit) elements needed
    const numElements = Math.ceil(bytes.length / 16);
    
    // Create a Uint8Array with the required length
    const uint8Array = new Uint8Array(numElements * 16);

    uint8Array.set(bytes);
    
    return uint8Array;
}

/* Convert Binary String to Uint8Array */
export function binaryStringToUint8Array(binaryString: string) {
    const numElements = Math.ceil(binaryString.length / 8);
    const uint8Array = new Uint8Array(numElements);
    for (let i = 0; i < numElements; i++) {
        uint8Array[i] = parseInt(binaryString.slice(i * 8, (i + 1) * 8), 2);
    }
    return uint8Array;
}

/* Pads the plaintext to be a multiple of 16 bytes (128 bits each block) */
export function checkAndModifyPlaintext(plaintext: string): string {
    var endPlaintext = plaintext
    if (plaintext.length % 16 != 0) {
        // pad the plaintext
        for (let i = plaintext.length; i % 16 != 0; i++) {
            endPlaintext += " "
        }
    }
    return endPlaintext
}

/* Repeats or truncates the key to 16 bytes (128 bits each block) */
export function checkAndModifyKey(key: string) {
    var endKey = key
    if (key.length < 16) {
        // repeat the key
        for (let i = key.length; i < 16; i++) {
            endKey += key[i % key.length]
        }
    } else if (key.length > 16) {
        // truncate the key
        endKey = key.slice(0, 16)
    } 
    return endKey
}

/* Shifts the bits of a 128-bit block to the left */
export function shiftLeft128(bits128: Uint8Array): Uint8Array{
    const carry = bits128[0] & 0x80 ? 1 : 0; // Capture the carry bit from the leftmost byte
    for (let i = 0; i < bits128.length - 1; i++) {
        bits128[i] = (bits128[i] << 1) | (bits128[i + 1] & 0x80 ? 1 : 0); // Shift left and add the carry bit from the next byte
    }
    bits128[bits128.length - 1] = (bits128[bits128.length - 1] << 1) | carry; // Shift left and add the captured carry bit
    return bits128;
}

/* Shifts the bits of a 128-bit block to the right */
export function shiftRight128(bits128: Uint8Array): Uint8Array{
    const n = bits128.length;
    const carry = bits128[n - 1] & 0x01; // Capture the carry bit from the rightmost bit of the last byte
    for (let i = n - 1; i > 0; i--) {
        bits128[i] = (bits128[i] >> 1) | ((bits128[i - 1] & 0x01) << 7); // Shift right and add the carry bit from the previous byte
    }
    bits128[0] = bits128[0] >> 1; // Shift right the leftmost byte
    bits128[0] |= carry << 7; // Add the captured carry bit to the rightmost bit of the leftmost byte
    return bits128;
}

/* Encrypts a 128-bit block using a 128-bit key */
export function tempEncryption(block: Uint8Array, key: Uint8Array): Uint8Array {
    for (let i = 0; i < block.length; i++) {
        block[i] = block[i] ^ key[i]
    }
    return shiftLeft128(block)
}

/* Decrypts a 128-bit block using a 128-bit key */
export function tempDecryption(block: Uint8Array, key: Uint8Array): Uint8Array {
    block = shiftRight128(block)
    for (let i = 0; i < block.length; i++) {
        block[i] = block[i] ^ key[i]
    }
    return block
}

/* Converts a Uint8Array to a binary string or a regular string */
export function uint8ArrayToBinaryOrString(uint8Array: Uint8Array, isBinaryString: Boolean) {
    if (isBinaryString) {
        return uint8Array.reduce((acc, byte) => acc + byte.toString(2).padStart(8, '0'), '');
    } else {
        console.log(uint8Array)
        console.log(Array.from(uint8Array))
        return String.fromCharCode.apply(null, Array.from(uint8Array));
    }
}



