import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Button } from "./components/ui/button";
import { ChangeEvent, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { executeMode, executeModeFile } from "./lib/blockmodes";
import { downloadFile } from "./lib/utils";
import { encrypt, decrypt } from "./lib/block-cipher";

function App() {
  const [inputType, setInputType] = useState("text");
  const [inputText, setInputText] = useState("");
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [mode, setMode] = useState("ecb");
  const [key, setKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [placeholder, setPlaceholder] = useState("Result will be shown here...");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setInputFile(event.target.files[0]);
    }
  };

  const isDisabled = () => {
    if (isLoading) return true;
    if (inputType === "text") {
      return inputText.length === 0 || mode.length === 0 || key.length === 0;
    } else if (inputType === "file") {
      return inputFile === null || mode.length === 0 || key.length === 0;
    } else {
      return false;
    }
  };

  const encryptClicked = () => {
    setIsLoading(true);
    if (inputType === "text") {
      const result = executeMode(mode, inputText, key, encrypt, false, true, false);
      setResult(result);
      setIsLoading(false);
    } else if (inputType === "file") {
      if (!inputFile) return;
      executeModeFile(mode, inputFile, key, encrypt, false).then((result) => {
        downloadFile(result);
        setPlaceholder("Encrypted file downloaded...")
        setIsLoading(false);
      });
    }
  };

  const decryptClicked= () => {
    setIsLoading(true);
    if (inputType === "text") {
      if (mode === "ecb" || mode === "cbc") {
        const result = executeMode(mode, inputText, key, decrypt, true, false, true);
        setResult(result);
      } else {
        const result = executeMode(mode, inputText, key, decrypt, true, false, true);
        setResult(result);
      }
      setIsLoading(false);
    } else if (inputType === "file") {
      if (!inputFile) return;
      executeModeFile(mode, inputFile, key, decrypt, true).then((result) => {
        downloadFile(result);
        setPlaceholder("Decrypted file downloaded...")
        setIsLoading(false);
      });
    }
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <main className="flex flex-col p-8 gap-4 min-h-screen items-center overflow-auto">
        <div className="flex w-full justify-between items-end lg:items-start">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
            <h1 className="text-3xl lg:text-4xl font-bold">
              Ribondung Block Cipher
            </h1>
            <p>Riau - Bogor - Bandung Cipher</p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://github.com/YakobusIP/ribondung-cipher"
              target="_blank"
            >
              <Button variant="outline" size="icon">
                <svg
                  width="16"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
                    fill="currentColor"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </Button>
            </a>
            <ModeToggle />
          </div>
        </div>
        <Separator />
        <div className="flex lg:flex-1 flex-col lg:flex-row w-full items-center justify-around">
          <Card className="w-full h-fit m-4">
            <CardHeader>
              <CardTitle>Encrypt / Decrypt</CardTitle>
              <CardDescription>
                Lakukan enkripsi atau dekripsi menggunakan Ribondung Block
                Cipher
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="grid w-full items-center gap-2">
                    <Label>Input type</Label>
                    <Select
                      value={inputType}
                      defaultValue="text"
                      onValueChange={(e) => setInputType(e)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="file">File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {inputType === "text" ? (
                    <div className="grid w-full items-center gap-2">
                      <Label htmlFor="input">Input text</Label>
                      <Textarea
                        id="input"
                        placeholder="Insert your input text here"
                        rows={5}
                        className="resize-none"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="grid w-full items-center gap-2">
                      <Label htmlFor="input-file">Input File</Label>
                      <Input
                        id="input-file"
                        type="file"
                        onChange={handleFileChange}
                      />
                    </div>
                  )}

                  <div className="grid w-full items-center gap-2">
                    <Label>Mode</Label>
                    <Select
                      value={mode}
                      defaultValue="ecb"
                      onValueChange={(e) => setMode(e)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ecb">
                          ECB (Electronic Codebook)
                        </SelectItem>
                        <SelectItem value="cbc">
                          CBC (Cipher Block Chaining)
                        </SelectItem>
                        <SelectItem value="cfb">
                          CFB (Cipher-Feedback)
                        </SelectItem>
                        <SelectItem value="ofb">
                          OFB (Output-Feedback)
                        </SelectItem>
                        <SelectItem value="ctr">Counter Mode</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="key">Key</Label>
                    <Input
                      type="text"
                      id="key"
                      placeholder="Insert your key here"
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
            <div className="flex flex-col w-full gap-4">
                <div className="flex gap-4">
                  <Button onClick={encryptClicked} variant="outline" disabled={isDisabled()}>
                    <LockKeyhole className="mr-2 h-4 w-4" />
                    Encrypt
                  </Button>
                  <Button onClick={decryptClicked} variant="outline" disabled={isDisabled()}>
                    <LockKeyholeOpen className="mr-2 h-4 w-4" />
                    Decrypt
                  </Button>
                </div>
                <div>
                  <Label>Result</Label>
                  <Textarea
                    className="w-full"
                    rows={5}
                    placeholder={placeholder}
                    value={result}
                    readOnly
                  />
                </div>
              </div>
            </CardFooter>
          </Card>
          <div className="w-full p-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  Bagaimana desain algoritma cipher ini?
                </AccordionTrigger>
                <AccordionContent>Work in progress</AccordionContent>
              </AccordionItem>
              <AccordionItem value="how-to-use">
                <AccordionTrigger>
                  Bagaimana cara menggunakan kakas ini?
                </AccordionTrigger>
                <AccordionContent>
                  <p>1. Pilih jenis masukan antara teks biasa atau file</p>
                  <p>2. Masukan teks atau file</p>
                  <p>3. Pilih mode yang diinginkan</p>
                  <p>4. Masukan key untuk melakukan enkripsi atau dekripsi</p>
                  <p>5. Tekan tombol encrypt atau decrypt untuk memulai</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
