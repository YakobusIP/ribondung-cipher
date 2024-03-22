const stringToByte = (str) => {
  const textEncoder = new TextEncoder()
  return textEncoder.encode(str)
}

const byteToHex = (bytes) => {
  return Array.from(bytes)
  .map((byte) => {
    // Convert byte to hexadecimal string with leading zero padding
    const hexString = byte.toString(16).padStart(2, "0");
    return `0x${hexString}`; // Prepend "0x" for clarity
  });
}

const hexToByte = (hexArray) => {
  return new Uint8Array(hexArray)
}

const byteToString = (bytes) => {
  const textDecoder = new TextDecoder()
  return textDecoder.decode(bytes)
}

const padBytes = (byteArray, blockSize) => {
  const paddingLength = blockSize - (byteArray.length % blockSize);
  const padding = new Uint8Array(paddingLength).fill(0);  // Zero-fill padding
  return new Uint8Array([...byteArray, ...padding]);
}

const splitBytesIntoBlock = (byteArray, blockSize) => {
  const blocks = [];
  for (let i = 0; i < byteArray.length; i += blockSize) {
    const block = byteArray.slice(i, Math.min(i + blockSize, byteArray.length));
    blocks.push(block);
  }
  return blocks;
}

function bytesToBit(bytes) {
  let binaryString = "";
  for (let byte of bytes) {
    binaryString += byte.toString(2).padStart(8, "0") + " ";
  }
  binaryString = binaryString.trim();
  const binaryArray = binaryString.split(' ')
  return binaryArray
}

function bitToBytes(bit) {
  let bitString = bit.join('')
  const byteArr = [];
  for (let i = 0; i < bitString.length; i += 8) {
    const byteString = bitString.slice(i, i + 8);
    const byteValue = parseInt(byteString, 2);
    byteArr.push(byteValue);
  }
  return new Uint8Array(byteArr);
}

const sample = 'hello world'
const bytes = stringToByte(sample)

const hex = byteToHex(bytes)
// console.log(hexToByte(hex))

const bit = bytesToBit(bytes)
const byte = bitToBytes(bit)

// console.log(bit)
// console.log(bytes)
// console.log(byte)

// console.log(byteToString(byte))
// const paddedBytes = padBytes(bytes, 16)
// console.log(paddedBytes)
// console.log(splitBytesIntoBlock(paddedBytes, 16))

function xorBit(block, element) {
  let result = []
  for (let i = 0; i < block.length; i++) {
    result[i] = Number(block[i]) ^ Number(element[i])
  }

  return result
}

const SBoxSubstitution = () => {
  const sbox = [
    [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76],
    [0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0],
    [0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15],
    [0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75],
    [0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84],
    [0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf],
    [0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8],
    [0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2],
    [0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73],
    [0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb],
    [0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79],
    [0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08],
    [0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a],
    [0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e],
    [0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf],
    [0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16]
  ]

  return sbox
}

function inverseSBox(sBox) {
  // Flatten the S-box for easier indexing
  const flatSBox = sBox.flat();
  
  // Initialize the inverse S-box with all zeros
  const invSBox = Array(256).fill(0);
  
  // Populate the inverse S-box by reversing the mappings
  for (let i = 0; i < 256; i++) {
      invSBox[flatSBox[i]] = i;
  }
  
  // Convert the inverse S-box back into a 16x16 format
  const invSBox16x16 = [];
  for (let i = 0; i < 256; i += 16) {
      invSBox16x16.push(invSBox.slice(i, i + 16));
  }
  
  return invSBox16x16;
}

const sbox_inverse = inverseSBox(SBoxSubstitution())

console.log(parseInt('1', 16))


const key = 'hello world'

const keyByte = padBytes(stringToByte(key), 16)

const splitBytes = splitBytesIntoBlock(keyByte, 16 / 2)

// console.log(splitBytes)


// Kunci putaran

const splitIntoByte = (bits) => {
  const bitArray = []
  for (let i = 0; i < bits.length; i += 8) {
    bitArray.push(bits.slice(i, i + 8))
  }
  return bitArray
}

function checkAndModifyKey(key) {
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

function checkAndModifyPlaintext(plaintext) {
  var endPlaintext = plaintext
  if (plaintext.length % 16 != 0) {
      // pad the plaintext
      for (let i = plaintext.length; i % 16 != 0; i++) {
          endPlaintext += " "
      }
  }
  return endPlaintext
}


// shift by 1
function shiftLeft128ByOne(bits128) {
  const carry = bits128[0] & 0x80 ? 1 : 0; // Capture the carry bit from the leftmost byte
  for (let i = 0; i < bits128.length - 1; i++) {
      bits128[i] = (bits128[i] << 1) | (bits128[i + 1] & 0x80 ? 1 : 0); // Shift left and add the carry bit from the next byte
  }
  bits128[bits128.length - 1] = (bits128[bits128.length - 1] << 1) | carry; // Shift left and add the captured carry bit

  return bits128
}

// shift by 2
function shiftLeft128ByTwo(bits128) {
  for (let i = 0; i < 2; i++) {
    bits128 = shiftLeft128ByOne(bits128)
  }
  return bits128
}

const straightPermutationLeft = (bit) => {
  const pbox = [
    [ 3, 29, 55, 32, 10, 63, 57,  8, 27, 46, 36, 61, 23, 42, 39, 49],
    [41, 38, 14,  7, 16, 44, 11,  6, 48, 19, 53, 60, 15, 56, 35, 54],
    [33, 20, 50, 31, 24, 52, 28, 58, 21, 59, 12, 30,  5, 17,  4, 62],
    [40, 47, 37, 34, 51,  2,  0,  9, 45, 22, 43, 26, 18,  1, 13, 25]
  ]

  let permutatedBit = ''

  for (let i = 0; i < pbox.length; i++) {
    for (let j = 0; j < pbox[0].length; j++) {
      permutatedBit += bit[pbox[i][j]]
    }
  }

  return permutatedBit
}

const straightPermutationRight = (bit) => {
  const pbox = [
    [50,  3, 18, 15, 45, 38, 62, 30, 37, 31, 34, 21, 29, 58, 27, 44],
    [25, 42,  9, 13, 61, 32, 47, 26, 56, 54, 59, 55, 35, 20,  8, 22],
    [43, 53, 16, 10,  4, 24, 63, 36, 19,  0, 28, 33,  1, 14,  2, 60],
    [49, 46, 52, 48,  5, 23,  7, 17, 41,  6, 11, 51, 40, 39, 57, 12]
  ]

  let permutatedBit = ''

  for (let i = 0; i < pbox.length; i++) {
    for (let j = 0; j < pbox[0].length; j++) {
      permutatedBit += bit[pbox[i][j]]
    }
  }

  return permutatedBit
}

const expansionPermutation = (bit) => {
  const pbox = [
    [24, 15, 21, 26,  5, 60, 42, 35, 53, 50, 55, 41, 28, 36, 37, 10],
    [20, 52, 44, 22, 39, 17,  8, 32, 56, 49, 13,  7, 40, 34,  3, 19],
    [54, 16, 57, 47, 23, 62, 59,  1, 43, 61, 18, 14, 33, 48,  9, 45],
    [63, 46, 31, 30, 29,  2, 11, 27, 51, 38, 12,  4,  0, 58,  6, 25],
    [21, 52,  2, 20,  7, 48, 18, 22,  8, 61, 31, 17, 54, 53, 23,  6],
    [46, 33, 58,  4, 55, 60,  9, 35, 47, 29, 37, 14, 13, 19, 41,  3],
    [ 0, 25, 63, 56,  1, 10, 45, 40, 39, 62, 42, 26, 28, 24, 27, 12],
    [15, 11,  5, 57, 30, 51, 36, 59, 50, 34, 49, 38, 16, 43, 32, 44]
  ]

  let permutatedBitFirst = ''
  let permutatedBitSecond = ''

  for (let i = 0; i < pbox.length; i++) {
    for (let j = 0; j < pbox[0].length; j++) {
      if (i < 4) {
        permutatedBitFirst += bit[pbox[i][j]]
      } else {
        permutatedBitSecond += bit[pbox[i][j]]
      }
    }
  }

  return permutatedBitFirst + permutatedBitSecond
}

const roundKey = (key, iter) => {
  const splittedKey = splitBytesIntoBlock(key, key.length / 2)

  const bitLeft = bytesToBit(splittedKey[0]).join('')
  const bitRight = bytesToBit(splittedKey[1]).join('')

  const permutatedBitLeft = straightPermutationLeft(bitLeft)
  const permutatedBitRight = straightPermutationRight(bitRight)

  let byteArrayLeft = bitToBytes(splitIntoByte(permutatedBitLeft))
  let byteArrayRight = bitToBytes(splitIntoByte(permutatedBitRight))

  if (iter % 2 === 1) {
    byteArrayLeft = shiftLeft128ByOne(byteArrayLeft)
    byteArrayRight = shiftLeft128ByOne(byteArrayRight)
  } else {
    byteArrayLeft = shiftLeft128ByTwo(byteArrayLeft)
    byteArrayRight = shiftLeft128ByTwo(byteArrayRight)
  }

  return new Uint8Array([...byteArrayLeft, ...byteArrayRight])
}

const feistel = (plaintext, key) => {
  const splittedPlaintext = splitBytesIntoBlock(plaintext, plaintext.length / 2)
  let leftPlaintext = splittedPlaintext[0]
  let rightPlaintext = splittedPlaintext[1]

  

  return new Uint8Array([...rightPlaintext, ])
}

const encrypt = (plaintext, key, iter) => {
  const checkedKey = checkAndModifyKey(key)
  const checkedPlaintext = checkAndModifyPlaintext(plaintext)

  let byteKey = stringToByte(checkedKey)
  let plaintextByte = stringToByte(checkedPlaintext)

  // feistel
  for (let i = 0; i < iter; i++) {
    byteKey = roundKey(byteKey, iter)
    console.log(byteKey)
    // feistel
  }

}

encrypt('hello world', 16)