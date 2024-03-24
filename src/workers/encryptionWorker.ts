import { executeMode, executeModeFile } from "@/lib/blockmodes";

// Define the types for your message data for better type checking
type WorkerMessage = {
  action: "encrypt" | "decrypt";
  mode: string;
  text?: string;
  file?: File;
  key: string;
};

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { action, mode, text, file, key } = event.data;
  // Depending on the action, call your encryption or decryption function
  let result: string;
  switch (action) {
    case "encrypt":
      if (text) {
        result = executeMode(
          mode,
          text,
          key,
          false,
          true,
          false,
          (progress) => {
            self.postMessage({ type: "progress", progress });
          }
        );

        self.postMessage({ type: "result", result });
      } else if (file) {
        const result = await executeModeFile(
          mode,
          file,
          key,
          false,
          (progress) => {
            self.postMessage({ type: "progress", progress });
          }
        );

        self.postMessage({ type: "fileResult", fileResult: result });
      }
      break;
    case "decrypt":
      if (text) {
        result = executeMode(mode, text, key, true, false, true, (progress) => {
          self.postMessage({ type: "progress", progress });
        });

        self.postMessage({ type: "result", result });
      } else if (file) {
        const result = await executeModeFile(
          mode,
          file,
          key,
          true,
          (progress) => {
            self.postMessage({ type: "progress", progress });
          }
        );

        self.postMessage({ type: "fileResult", fileResult: result });
      }
      break;
    default:
      throw new Error("Unsupported action");
  }
};
