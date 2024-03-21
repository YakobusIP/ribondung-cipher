import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to convert a file to Uint8Array
export function fileToUint8Array (file: File, callback: (uint8Array: Uint8Array) => void) {
  const reader = new FileReader();

  // Callback function for when the file is read
  reader.onload = (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      callback(uint8Array);
  };

  // Read the file as an ArrayBuffer
  reader.readAsArrayBuffer(file);
};

export function downloadFile (file: File) {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();
}