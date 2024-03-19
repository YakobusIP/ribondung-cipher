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
import { Label } from "@/components/ui/label";
import { Button } from "./components/ui/button";
import { ChangeEvent, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";

function App() {
  const [inputType, setInputType] = useState("text");
  const [inputText, setInputText] = useState("");
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [mode, setMode] = useState("ecb");
  const [key, setKey] = useState("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setInputFile(event.target.files[0]);
    }
  };

  const isDisabled = () => {
    if (inputType === "text") {
      return inputText.length === 0 || mode.length === 0 || key.length === 0;
    } else if (inputType === "file") {
      return inputFile === null || mode.length === 0 || key.length === 0;
    } else {
      return false;
    }
  };

  const encrypt = () => {};

  const decrypt = () => {};

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <main className="flex flex-col p-8 gap-4 min-h-screen items-center">
        <div className="flex w-full justify-between">
          <div className="flex gap-4 items-end">
            <h1 className="text-4xl font-bold">Ribondung Block Cipher</h1>
            <p>Riau - Bogor - Bandung Cipher</p>
          </div>
          <ModeToggle />
        </div>
        <Separator />
        <div className="flex flex-1 w-1/2 items-center">
          <Card className="w-full h-fit">
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
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <Button variant="outline" disabled={isDisabled()}>
                    <LockKeyhole className="mr-2 h-4 w-4" />
                    Encrypt
                  </Button>
                  <Button variant="outline" disabled={isDisabled()}>
                    <LockKeyholeOpen className="mr-2 h-4 w-4" />
                    Decrypt
                  </Button>
                </div>
                <div>
                  <Label>Result</Label>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
