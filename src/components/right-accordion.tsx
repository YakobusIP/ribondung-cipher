import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

export function RightAccordion() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          Bagaimana desain algoritma cipher ini?
        </AccordionTrigger>
        <AccordionContent>
          <p>
            Algoritma Ribondung Cipher didasarkan oleh DES, dengan beberapa
            perubahan pada komponen
          </p>
          <br />
          <p>
            <strong>Round key generation</strong>
          </p>
          <p>1. Jumlah key yang digunakan berukuran 128-bit</p>
          <p>
            2. Kunci dibagi menjadi dua sisi sama besar dan masing - masing sisi
            mengalami permutasi menggunakan 2 buah straight P-box
          </p>
          <p>
            3. Kompresi kunci dilakukan dengan melakukan operasi XOR pada sisi
            kiri dan kanan kunci untuk menghasilkan kunci berukuran 64-bit
          </p>
          <br />
          <p>
            <strong>Feistel Network</strong>
          </p>
          <p>
            1. Melakukan pembagian 128-bit plaintext menjadi 4 bagian yang sama
            besar (32-bit)
          </p>
          <p>
            2. Membentuk sebuah network yang menyerupai anak tangga untuk setiap
            round
          </p>
          <p>3. Jumlah round yang digunakan adalah 16</p>
          <br />
          <p>
            <strong>Feistel F-function</strong>
          </p>
          <p>
            1. Melakukan ekspansi bit dari 32-bit menjadi 64-bit agar sesuai
            dengan ukuran key
          </p>
          <p>
            2. Menggunakan 8 buah S-box untuk melakukan substitusi dan kompresi
            dari 8-bit menjadi 4-bit
          </p>
        </AccordionContent>
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
  );
}
