export const stringToByte = (str: string) => {
  const textEncoder = new TextEncoder()
  return textEncoder.encode(str)
}

export const byteToHex = (bytes: Uint8Array) => {
  return Array.from(bytes)
  .map((byte) => {
    // Convert byte to hexadecimal string with leading zero padding
    const hexString = byte.toString(16).padStart(2, "0");
    return `0x${hexString}`; // Prepend "0x" to each hexadecimal string (e.g 0x6c)
  });
}

export const hexToByte = (hexArray: ArrayBufferLike) => {
  return new Uint8Array(hexArray)
}

export const byteToString = (bytes: AllowSharedBufferSource) => {
  const textDecoder = new TextDecoder()
  return textDecoder.decode(bytes)
}

export const padBytes = (byteArray: Uint8Array, blockSize: number) => {
  const paddingLength = blockSize - (byteArray.length % blockSize);
  const padding = new Uint8Array(paddingLength).fill(0);  // pad with 0
  return new Uint8Array([...byteArray, ...padding]);
}

export const splitBytesIntoBlock = (byteArray: Uint8Array, blockSize: number) => {
  const blocks = [];
  for (let i = 0; i < byteArray.length; i += blockSize) {
    const block = byteArray.slice(i, Math.min(i + blockSize, byteArray.length));
    blocks.push(block);
  }
  return blocks;
}

export const bytesToBit = (bytes: Uint8Array) => {
  let binaryString = "";
  for (const byte of bytes) {
    binaryString += byte.toString(2).padStart(8, "0") + " ";
  }
  return binaryString.trim();
}

export const bitToBytes = (bit: string) => {
  const bitString = bit.replace(/\s+/g, "")
  const byteArr = [];
  for (let i = 0; i < bitString.length; i += 8) {
    const byteString = bitString.slice(i, i + 8);
    const byteValue = parseInt(byteString, 2);
    byteArr.push(byteValue);
  }
  return new Uint8Array(byteArr);
}