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

function xor(block, element) {
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

function shiftRight128ByOne(bits128) {
  const n = bits128.length;
  const carry = bits128[n - 1] & 0x01; // Capture the carry bit from the rightmost bit of the last byte
  for (let i = n - 1; i > 0; i--) {
      bits128[i] = (bits128[i] >> 1) | ((bits128[i - 1] & 0x01) << 7); // Shift right and add the carry bit from the previous byte
  }
  bits128[0] = bits128[0] >> 1; // Shift right the leftmost byte
  bits128[0] |= carry << 7; // Add the captured carry bit to the rightmost bit of the leftmost byte

  return bits128
}

function shiftRight128ByTwo(bits128) {
  for (let i = 0; i < 2; i++) {
    bits128 = shiftRight128ByOne(bits128)
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
    [19,  8,  9, 25,  0,  6,  5, 20, 24,  2, 13, 17, 15,  7, 23,  1],
    [21,  3, 12, 31, 10, 18, 30, 26,  4, 11, 29, 14, 27, 16, 28, 22],
    [16, 10, 13, 24,  1,  7, 26, 27,  6, 12, 22,  0, 23, 14, 30,  3],
    [17, 28,  8,  2,  5, 31, 29, 11, 25,  9,  4, 15, 21, 20, 19, 18],
  ]

  let permutatedBitFirst = ''
  let permutatedBitSecond = ''

  for (let i = 0; i < pbox.length; i++) {
    for (let j = 0; j < pbox[0].length; j++) {
      if (i < 2) {
        permutatedBitFirst += bit[pbox[i][j]]
      } else {
        permutatedBitSecond += bit[pbox[i][j]]
      }
    }
  }

  return permutatedBitFirst + permutatedBitSecond
}

// const roundKey = (key, iter) => {
//   const splittedKey = splitBytesIntoBlock(key, key.length / 2)

//   const bitLeft = bytesToBit(splittedKey[0]).join('')
//   const bitRight = bytesToBit(splittedKey[1]).join('')

//   const permutatedBitLeft = straightPermutationLeft(bitLeft)
//   const permutatedBitRight = straightPermutationRight(bitRight)

//   let byteArrayLeft = bitToBytes(splitIntoByte(permutatedBitLeft))
//   let byteArrayRight = bitToBytes(splitIntoByte(permutatedBitRight))

//   if (iter % 2 === 1) {
//     byteArrayLeft = shiftLeft128ByOne(byteArrayLeft)
//     byteArrayRight = shiftLeft128ByOne(byteArrayRight)
//   } else {
//     byteArrayLeft = shiftLeft128ByTwo(byteArrayLeft)
//     byteArrayRight = shiftLeft128ByTwo(byteArrayRight)
//   }

//   return new Uint8Array([...byteArrayLeft, ...byteArrayRight])
// }

// const feistel = (plaintext, key) => {
//   const splittedPlaintext = splitBytesIntoBlock(plaintext, plaintext.length / 2)
//   let leftPlaintext = splittedPlaintext[0]
//   let rightPlaintext = splittedPlaintext[1]



//   return new Uint8Array([...rightPlaintext, ])
// }

// const encrypt = (plaintext, key, iter) => {
//   const checkedKey = checkAndModifyKey(key)
//   const checkedPlaintext = checkAndModifyPlaintext(plaintext)

//   let byteKey = stringToByte(checkedKey)
//   let plaintextByte = stringToByte(checkedPlaintext)

//   // feistel
//   for (let i = 0; i < iter; i++) {
//     byteKey = roundKey(byteKey, iter)
//     console.log(byteKey)
//     // feistel
//   }

// }

const roundKeyV2 = (bitLeft, bitRight, iter) => {
  const permutatedBitLeft = straightPermutationLeft(bitLeft)
  const permutatedBitRight = straightPermutationRight(bitRight)

  let byteArrayLeft = bitToBytes(splitIntoByte(permutatedBitLeft))
  let byteArrayRight = bitToBytes(splitIntoByte(permutatedBitRight))

  if (iter % 2 === 1) {
    byteArrayLeft = shiftLeft128ByOne(byteArrayLeft)
    byteArrayRight = shiftRight128ByOne(byteArrayRight)
  } else {
    byteArrayLeft = shiftLeft128ByTwo(byteArrayLeft)
    byteArrayRight = shiftRight128ByTwo(byteArrayRight)
  }

  const xorKey = xor(byteArrayLeft, byteArrayRight)

  return new Uint8Array(xorKey)
}

const substitution1 = (bit) => {
  const sbox = [
    [13, 10,  9,  8,  3,  6, 12, 14,  7,  2,  5,  4, 11,  1, 15,  0],
    [14, 15,  7,  4,  0,  6, 11,  8, 10, 13,  1,  2, 12,  3,  9,  5],
    [ 4, 12, 13, 14, 15,  3,  5,  8,  9,  7, 11,  2,  6, 10,  1,  0],
    [15,  3, 13,  1,  7,  6, 12,  9,  4,  2,  5, 14,  8,  0, 10, 11],
    [14, 10,  8,  4, 15,  3,  0,  6,  1,  2, 13,  9, 11,  7,  5, 12],
    [ 6, 12, 15,  3, 10, 14,  9,  7,  4,  2,  8, 13,  5, 11,  0,  1],
    [15,  5, 10, 14,  1, 11,  4,  3,  8, 12,  0,  2,  6, 13,  7,  9],
    [ 8,  5, 11,  6,  7, 10,  3, 13, 14,  1, 12,  4, 15,  0,  9,  2],
    [13,  5,  1, 11, 14,  7, 15,  6, 10,  2,  3,  0, 12,  8,  9,  4],
    [10, 11, 13,  9, 15,  4,  1,  6,  5, 12,  8,  0, 14,  2,  7,  3],
    [ 7,  3, 12, 14,  0,  9, 10, 11,  4,  6, 15,  1, 13,  2,  5,  8],
    [11,  9, 10,  8,  4,  3, 13,  0, 15,  1,  2,  7,  5, 14, 12,  6],
    [12,  3,  0,  2,  8,  7,  1,  6,  9, 10,  5, 14, 13,  4, 15, 11],
    [13, 10,  3, 11, 12,  8,  4,  6,  7,  0, 15, 14,  2,  1,  5,  9],
    [15,  1, 11, 12,  4,  2,  8,  6,  5, 10,  0, 13,  7,  3,  9, 14],
    [ 2, 12, 13,  9,  5,  0,  7,  6, 15, 14,  1,  3, 10,  8, 11,  4]
  ]

  const row = parseInt(bit.slice(0, 2) + bit.slice(bit.length - 2, bit.length), 2)
  const col = parseInt(bit.slice(2, bit.length - 2), 2)

  const substitutedResult = sbox[row][col]

  return substitutedResult.toString(2).padStart(4, '0')
}

const substitution2 = (bit) => {
  const sbox = [[ 7, 13,  5,  6,  2, 11, 10, 12,  1, 14,  9, 15,  8,  0,  4,  3],
  [ 7,  0,  8, 12,  1,  6, 10,  5, 14,  4,  3, 15,  2,  9, 11, 13],
  [10,  9, 11,  2,  7,  5, 15,  1,  4,  3, 12, 13,  6,  0,  8, 14],
  [10,  9, 14,  7,  2,  1, 12,  5,  4, 13,  0,  3,  8, 11,  6, 15],
  [13,  7,  3, 14,  5,  2,  0, 11, 10,  1,  6,  9,  4, 12,  8, 15],
  [ 8,  5,  3, 12,  1, 13,  6, 14, 10, 15,  9,  2,  7,  4,  0, 11],
  [15,  4,  9,  1,  7,  6, 13, 14,  0,  5,  8, 12,  2, 10,  3, 11],
  [ 6,  1,  8,  5,  7, 12,  3,  4, 14,  9,  2, 10, 11, 13, 15,  0],
  [ 3,  0, 12,  8, 11,  5,  6, 15, 14,  1,  2, 13,  4,  7, 10,  9],
  [ 0, 12,  7,  9,  5,  6,  8, 14,  2,  4, 15,  1, 11,  3, 10, 13],
  [ 4, 12, 15, 10, 13,  5,  9,  6,  1, 14,  3,  7,  0, 11,  2,  8],
  [ 9, 13,  0,  1,  2,  7, 10, 12,  8, 14,  4,  3, 15,  6,  5, 11],
  [ 2,  9,  6, 10,  5,  7, 12, 13, 11,  3, 15,  8,  0, 14,  4,  1],
  [ 4, 14,  2,  8,  3, 11,  5,  1,  9,  0,  6, 12, 13, 15, 10,  7],
  [ 5,  8, 14, 11,  6, 10,  2,  0,  4,  1,  3,  7,  9, 15, 12, 13],
  [ 8,  1, 13, 15,  4,  5,  3, 14,  0,  9,  6,  7, 12, 11,  2, 10]]

  const row = parseInt(bit.slice(0, 2) + bit.slice(bit.length - 2, bit.length), 2)
  const col = parseInt(bit.slice(2, bit.length - 2), 2)
  
  const substitutedResult = sbox[row][col]

  return substitutedResult.toString(2).padStart(4, '0')
}

const substitution3 = (bit) => {
  const sbox = [[10, 14, 13,  1,  5,  7,  4, 15,  3,  0,  9,  8,  2, 11,  6, 12],
  [ 8, 12,  5, 15, 10,  2,  3,  0,  7, 11,  4, 14, 13,  9,  1,  6],
  [ 3,  0, 10, 15,  8,  2,  1,  6, 12, 11,  5,  7, 14, 13,  4,  9],
  [ 4, 15, 10,  1,  2,  7,  5,  3, 13,  8, 12,  0,  9,  6, 11, 14],
  [ 9,  5,  7,  0, 11,  6, 15,  2, 13, 14,  4,  1, 12,  8, 10,  3],
  [15, 10, 11,  3,  4,  6, 13,  0,  7,  9,  5, 12,  1,  8, 14,  2],
  [ 6,  9, 13,  8, 15,  4, 12, 10, 11,  7,  5,  3,  1, 14,  2,  0],
  [15,  0,  8, 11,  5,  2, 12,  7, 14, 13,  9,  1,  6,  4,  3, 10],
  [ 4, 15,  2,  9,  3, 12, 11, 10,  6,  0, 14,  5,  1,  8, 13,  7],
  [10,  3,  7, 11,  4,  0, 12,  5, 15,  9, 13,  1,  2,  6,  8, 14],
  [ 0,  3,  4,  1,  2,  5, 11,  8,  9, 12,  6, 15, 13,  7, 10, 14],
  [11,  0, 15,  8, 14,  4,  3,  6, 12,  1,  5, 10,  7, 13,  9,  2],
  [ 5,  4,  6, 12, 13,  1, 14,  9,  2,  3, 10, 15,  8, 11,  0,  7],
  [ 4,  5,  9, 11,  6,  3, 15,  2,  7, 13, 14,  8,  0, 12, 10,  1],
  [ 4, 12,  7, 11, 13, 15,  6,  2,  8, 10, 14,  9,  1,  0,  3,  5],
  [ 6, 10,  9, 15, 13,  7,  3,  0, 11,  1,  8,  4,  2, 12, 14,  5]]

  const row = parseInt(bit.slice(0, 2) + bit.slice(bit.length - 2, bit.length), 2)
  const col = parseInt(bit.slice(2, bit.length - 2), 2)
  
  const substitutedResult = sbox[row][col]

  return substitutedResult.toString(2).padStart(4, '0')
}

const substitution4 = (bit) => {
  const sbox = [[ 8,  3,  9, 12,  6,  5,  7, 10, 11, 14,  0, 15,  4, 13,  1,  2],
  [13,  0,  5,  9,  7,  8, 15, 10, 11,  1, 14,  3,  2,  6, 12,  4],
  [ 2,  3,  4,  7,  5, 12,  8, 11, 13,  9, 10,  1, 15,  0, 14,  6],
  [10,  8, 13, 12,  3,  2, 15,  9, 14,  1, 11,  5,  6,  4,  7,  0],
  [ 4,  7, 11, 14,  2,  1, 15,  3, 13,  9,  8,  6,  0, 12, 10,  5],
  [ 4,  0, 15,  2,  3,  7, 13, 11,  1, 12,  5,  6,  8, 14,  9, 10],
  [10,  1,  0,  2,  5,  8,  7, 13,  9, 15, 11, 14,  6,  4, 12,  3],
  [ 3, 11,  7,  5,  1,  6, 15,  9,  8, 12,  2, 14,  4, 10, 13,  0],
  [10,  4, 14, 11,  6, 15,  3,  7,  8,  5,  9,  2, 13, 12,  0,  1],
  [ 7, 15,  3, 13, 10,  8,  1,  6,  2, 12, 11,  9,  5, 14,  0,  4],
  [ 6, 14, 12,  7,  8, 15, 11, 10,  1,  4,  0,  5,  9,  3,  2, 13],
  [ 9,  2, 10,  6,  4,  3, 15, 13,  0, 14, 11,  8, 12,  1,  5,  7],
  [ 1,  9,  8,  5,  6, 14,  0, 11,  4,  2, 12, 10, 13, 15,  7,  3],
  [10,  1,  7,  6, 11,  8, 12, 15, 13, 14,  4,  2,  3,  5,  0,  9],
  [13,  9,  2,  3, 11,  4, 14, 15,  8,  7,  1, 12,  0, 10,  5,  6],
  [ 1, 11,  8,  6,  5, 14,  0,  9,  4, 10,  7,  2, 15, 13, 12,  3]]

  const row = parseInt(bit.slice(0, 2) + bit.slice(bit.length - 2, bit.length), 2)
  const col = parseInt(bit.slice(2, bit.length - 2), 2)
  
  const substitutedResult = sbox[row][col]

  return substitutedResult.toString(2).padStart(4, '0')
}

const substitution5 = (bit) => {
  const sbox = [[11,  5,  3, 10,  8,  0, 14,  4,  1,  7,  9,  2,  6, 15, 13, 12],
  [14, 12, 10,  7, 15,  3,  0, 13,  5, 11,  9,  6,  8,  2,  1,  4],
  [ 5,  6,  1,  9, 12, 15, 13,  0,  8, 10,  2,  3, 14,  4,  7, 11],
  [ 6,  3,  0,  7, 11, 13, 15,  1,  5, 14, 10, 12,  2,  9,  4,  8],
  [ 4,  8, 11,  7, 12,  2, 15, 14,  9,  3,  5,  0, 10,  6,  1, 13],
  [10,  1, 11,  2,  0,  7, 15,  3,  5,  6,  9,  8, 13, 12, 14,  4],
  [ 2,  7, 12,  4, 13,  9, 10, 11,  1,  3, 15,  8, 14,  6,  0,  5],
  [15,  7, 11,  9, 13,  4, 10,  8,  1,  2,  3, 12,  5, 14,  6,  0],
  [ 3, 12, 13,  6, 15,  0, 11,  9,  2,  4,  5, 10,  8,  7, 14,  1],
  [10,  2, 14, 15,  0,  9,  1,  8, 12,  7, 11, 13,  4,  6,  5,  3],
  [15, 11,  2, 13,  9,  8, 12,  1,  3,  6,  7,  5, 14,  0,  4, 10],
  [ 0,  6, 12, 15,  7,  2,  5, 13,  8, 11,  3,  4, 10,  9, 14,  1],
  [14, 10,  7,  0, 12,  4, 13,  1,  5,  6,  3, 15,  9,  2, 11,  8],
  [ 3,  9, 13, 14,  1,  0, 11,  5,  4, 15, 10, 12,  6,  8,  2,  7],
  [ 5,  6, 12,  9, 15,  8,  7,  3,  1, 10, 13, 11, 14,  4,  0,  2],
  [ 5,  1,  8,  0,  7, 11,  6,  2,  3, 13,  4, 12, 15, 14,  9, 10]]

  const row = parseInt(bit.slice(0, 2) + bit.slice(bit.length - 2, bit.length), 2)
  const col = parseInt(bit.slice(2, bit.length - 2), 2)
  
  const substitutedResult = sbox[row][col]

  return substitutedResult.toString(2).padStart(4, '0')
}

const substitution6 = (bit) => {
  const sbox = [[ 7,  1, 10,  4,  2,  8,  9, 13,  5,  6, 12,  0,  3, 15, 11, 14],
  [ 3,  2, 11, 12,  4,  1,  7,  8, 15, 10, 13, 14,  9,  5,  6,  0],
  [ 8,  6,  2,  9,  0, 10, 13, 12, 15, 11,  4,  3,  7,  5, 14,  1],
  [15,  6, 13, 11,  3,  4,  7,  5, 10,  1,  2,  9,  0, 12,  8, 14],
  [15, 10,  0, 12,  5, 13,  1,  6, 14,  3,  7,  9,  2,  8,  4, 11],
  [10, 14, 12,  5,  2,  9,  8,  4,  7, 11,  6,  0,  3, 15, 13,  1],
  [11,  7, 14,  3,  0, 10, 15,  6, 13,  9,  5,  4, 12,  1,  8,  2],
  [15, 10,  4,  3, 14,  2,  7,  5, 11,  6, 13,  0, 12,  9,  1,  8],
  [ 4,  1, 13,  9,  6,  2,  0,  8, 10,  7, 11, 15, 12,  3,  5, 14],
  [13,  7,  3, 14,  2,  0,  4,  8,  9,  5,  6, 11,  1, 12, 15, 10],
  [ 7, 10, 13,  5,  9,  1, 12,  0, 14,  3, 15,  8,  2, 11,  6,  4],
  [ 3, 15, 14,  5,  2,  1,  9, 12, 11,  8,  0,  7, 13, 10,  6,  4],
  [11,  3,  6, 15,  4,  0,  2, 13,  5, 12, 14, 10,  1,  7,  8,  9],
  [ 3, 10,  2, 14, 15,  6,  1, 11,  0, 12,  8,  9,  4, 13,  7,  5],
  [12,  9, 13,  3, 14, 10,  5,  4,  7,  6, 11,  8,  2,  1,  0, 15],
  [13,  0, 12,  2,  5,  3, 14,  4,  6, 11,  9, 15, 10,  8,  7,  1]]

  const row = parseInt(bit.slice(0, 2) + bit.slice(bit.length - 2, bit.length), 2)
  const col = parseInt(bit.slice(2, bit.length - 2), 2)
  
  const substitutedResult = sbox[row][col]

  return substitutedResult.toString(2).padStart(4, '0')
}

const substitution7 = (bit) => {
  const sbox = [[ 0, 10,  3, 12,  7,  9, 11,  2,  1, 13, 14,  8,  4, 15,  5,  6],
  [14, 12,  1,  2,  3,  0, 15,  5,  4,  7,  6,  9, 13, 11, 10,  8],
  [14,  4, 11,  6,  1,  9,  8, 10,  7, 12,  3, 13,  5,  0,  2, 15],
  [11,  6,  0, 10,  2,  7,  4, 15,  3,  8, 12,  1,  9, 14, 13,  5],
  [ 2, 14, 10, 15, 12,  9, 13,  8, 11,  5,  6,  1,  0,  7,  3,  4],
  [ 7, 15,  3, 12,  8,  9, 10,  0,  2, 13,  6, 14,  5,  1,  4, 11],
  [ 1,  7,  2,  9,  3,  8,  5, 12, 13,  6, 11,  0, 14, 10,  4, 15],
  [ 1,  7, 12,  3,  5,  2,  0,  8, 13, 11, 15,  9,  6, 10,  4, 14],
  [ 3,  6,  9, 12, 15,  4,  7,  1, 13,  2, 14,  5,  0, 10,  8, 11],
  [ 2, 14, 12,  9, 11,  0,  8,  6,  3, 13,  1,  4,  7,  5, 15, 10],
  [ 8,  5, 11,  6,  7,  2,  3,  0, 14, 13, 12, 10,  1,  4,  9, 15],
  [ 0,  5, 12,  3, 13,  2,  9, 14,  6,  8,  7,  4, 15, 10,  1, 11],
  [ 5,  7, 12,  2,  9, 15, 13,  0,  8, 11,  3, 10,  1,  6,  4, 14],
  [ 5,  9, 14, 15,  8, 11,  7, 12, 13,  4, 10,  1,  0,  3,  2,  6],
  [ 5,  9, 12,  3, 10,  0,  7, 11,  6, 13,  4, 15,  8,  1, 14,  2],
  [14,  3,  4,  0,  5,  1,  2, 15, 11, 13,  9, 12,  7,  8,  6, 10]]

  const row = parseInt(bit.slice(0, 2) + bit.slice(bit.length - 2, bit.length), 2)
  const col = parseInt(bit.slice(2, bit.length - 2), 2)
  
  const substitutedResult = sbox[row][col]

  return substitutedResult.toString(2).padStart(4, '0')
}

const substitution8 = (bit) => {
  const sbox = [[ 8,  7,  2,  5, 12,  0, 10,  1, 13,  6, 15,  9,  3, 14, 11,  4],
  [ 7,  8,  0,  3, 11,  1, 12,  5, 15,  4, 10,  9,  2, 14,  6, 13],
  [ 3,  1, 12, 13,  4,  2,  5,  7,  9,  0, 15, 11,  6, 10, 14,  8],
  [ 5, 13, 12, 10, 15,  2,  0,  7,  8,  4,  6, 14,  9,  3, 11,  1],
  [ 2,  8,  6, 11,  1,  5,  7, 12,  9, 13, 14,  3,  4, 15, 10,  0],
  [ 1, 12,  9,  2,  4,  3,  6,  7,  0, 15,  5,  8, 14, 10, 11, 13],
  [13,  0,  7,  4, 11, 15,  8,  6,  9,  3,  5, 14,  1, 10, 12,  2],
  [ 5,  1, 10,  2,  8,  7,  3, 11, 13,  0,  9, 14,  6, 15, 12,  4],
  [15,  3,  4, 11,  8, 10,  6, 12,  2, 13,  0,  9,  7, 14,  1,  5],
  [10,  5,  3,  0,  6,  1, 14, 13,  4, 12, 11,  7,  9,  8,  2, 15],
  [ 4,  5, 11,  7,  6,  2, 13,  8,  0,  9, 14, 12, 10, 15,  1,  3],
  [15,  7,  1,  4,  5, 14, 13,  3, 11,  2, 10,  6,  0,  9,  8, 12],
  [ 5, 10, 11,  6,  9,  8, 13,  0,  3, 12, 15, 14,  7,  4,  1,  2],
  [11,  3, 12,  6, 14,  7, 15,  5,  4,  9,  0,  8, 13,  2, 10,  1],
  [11,  6, 15,  4,  5,  7,  0, 12,  3,  8, 13,  2, 10,  9,  1, 14],
  [12, 11,  1, 13, 14,  9,  0,  5,  3, 15, 10,  7,  2,  6,  8,  4]]

  const row = parseInt(bit.slice(0, 2) + bit.slice(bit.length - 2, bit.length), 2)
  const col = parseInt(bit.slice(2, bit.length - 2), 2)
  
  const substitutedResult = sbox[row][col]

  return substitutedResult.toString(2).padStart(4, '0')
}

const substitutionHashFunc = {
  'substitution1': substitution1,
  'substitution2': substitution2,
  'substitution3': substitution3,
  'substitution4': substitution4,
  'substitution5': substitution5,
  'substitution6': substitution6,
  'substitution7': substitution7,
  'substitution8': substitution8,
}

const innerFeistelFunction = (splittedPlaintext, key) => {
  const bit = bytesToBit(splittedPlaintext).join('')

  const expandedBit = expansionPermutation(bit)

  const expandedByte = bitToBytes(splitIntoByte(expandedBit))

  const xorProduct = xor(expandedByte, key)

  const xorBit = bytesToBit(xorProduct).join('')

  const splittedBits = splitIntoByte(xorBit)

  const substitutionResults = [];
  for (let i = 0; i < splittedBits.length; i++) {
    const key = `substitution${i + 1}`; // Assuming function names start from 1
    if (Object.prototype.hasOwnProperty.call(substitutionHashFunc, key)) {
      substitutionResults.push(substitutionHashFunc[key](splittedBits[i]));
    }
  }

  const concatSubstitutedResult = substitutionResults.join('')

  return concatSubstitutedResult
}

const feistelV2 = (plaintextA, plaintextB, plaintextC, plaintextD, key) => {
  const innerFeistelResultD = innerFeistelFunction(plaintextD, key)
  const productOfXorDC = xor(bitToBytes(splitIntoByte(innerFeistelResultD)), plaintextC)

  const innerFeistelResultDC = innerFeistelFunction(productOfXorDC, key)
  const productOfXorDCB = xor(bitToBytes(splitIntoByte(innerFeistelResultDC)), plaintextB)

  const innerFeistelResultDCB = innerFeistelFunction(productOfXorDCB, key)
  const productOfXorDCBA = xor(bitToBytes(splitIntoByte(innerFeistelResultDCB)), plaintextA)

  return [new Uint8Array(productOfXorDCB), new Uint8Array(productOfXorDC), new Uint8Array(plaintextD), new Uint8Array(productOfXorDCBA)]
}

const splitPlaintextTo128Bit = (plaintext) => {
  const splittedPlaintext = []

  for (let i = 0; i < plaintext.length; i += 16) {
    splittedPlaintext.push(plaintext.slice(i, i + 16))
  }
  return splittedPlaintext
}

const encryptV2 = (plaintext, key, iter) => {
  const checkedKey = checkAndModifyKey(key)
  const checkedPlaintext = checkAndModifyPlaintext(plaintext)

  const splitPlaintext = splitPlaintextTo128Bit(checkedPlaintext)

  let byteKey = stringToByte(checkedKey)
  
  const encryptionResults = []
  for (let i = 0; i < splitPlaintext.length; i++) {
    let plaintextByte = stringToByte(splitPlaintext[i])
    
    const splittedPlaintext = splitBytesIntoBlock(plaintextByte, plaintextByte.length / 4)
    let plaintextA = splittedPlaintext[0]
    let plaintextB = splittedPlaintext[1]
    let plaintextC = splittedPlaintext[2]
    let plaintextD = splittedPlaintext[3]
  
    const splittedKey = splitBytesIntoBlock(byteKey, byteKey.length / 2)
  
    const bitLeft = bytesToBit(splittedKey[0]).join('')
    const bitRight = bytesToBit(splittedKey[1]).join('')
  
    // feistel
    for (let i = 0; i < iter; i++) {
      byteKey = roundKeyV2(bitLeft, bitRight, iter)
      // feistel
      const feistelResult = feistelV2(plaintextA, plaintextB, plaintextC, plaintextD, byteKey)
      plaintextA = feistelResult[0]
      plaintextB = feistelResult[1]
      plaintextC = feistelResult[2]
      plaintextD = feistelResult[3]
    }
  
    const encryptionResult = new Uint8Array([...plaintextA, ...plaintextB, ...plaintextC, ...plaintextD])
  
    encryptionResults.push(encryptionResult)
  }

  // Get the total length of all arrays.
  let length = 0;
  encryptionResults.forEach(item => {
    length += item.length;
  });

  // Create a new array with total length and merge all source arrays.
  let mergedArray = new Uint8Array(length);
  let offset = 0;
  encryptionResults.forEach(item => {
    mergedArray.set(item, offset);
    offset += item.length;
  });

  return mergedArray
}

const encryptionResult = encryptV2('this is a plaintext, i want to test this encryption result', 'hello world', 16)

console.log(encryptionResult)
console.log(byteToString(encryptionResult))