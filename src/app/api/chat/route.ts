import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1].content;

    // ====================================================================
    // TAHAP 1: QUERY REFORMULATION (Translator Awam ke Bahasa Hukum)
    // ====================================================================
    const keywordRes = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: `Ubah keluhan atau pertanyaan hukum berikut menjadi 2 hingga 4 kata kunci spesifik untuk mesin pencari database peraturan hukum Indonesia.
Fokuskan pada: bidang hukum, objek/subjek hukum, tindak pidana, pelanggaran, atau hak/kewajiban utama yang dipersengketakan.
Contoh 1: "ditipu penjual online" -> "penipuan transaksi elektronik"
Contoh 2: "telat bayar gaji" -> "keterlambatan pembayaran upah"
Contoh 3: "kena phk tanpa pesangon" -> "pemutusan hubungan kerja pesangon"
Contoh 4: "hak atas bpjs tidak dibayar" -> "iuran jaminan sosial ketenagakerjaan"
Contoh 5: "sewa rumah tidak dikembalikan" -> "perjanjian sewa menyewa"
Contoh 6: "anak saya dilecehkan di sekolah" -> "perlindungan anak kekerasan"
Hanya berikan kata kuncinya saja, tanpa tanda kutip, tanpa pengantar, dan tanpa penjelasan. 
Kalimat pengguna: "${latestMessage}"`
    });
    
    // Membersihkan sisa tanda kutip agar API tidak bingung
    const searchQuery = keywordRes.text.trim().replace(/['"]/g, '');
    console.log("Kata kunci ajaib untuk API:", searchQuery); 

    // ====================================================================
    // TAHAP 2: RETRIEVAL (Mencari dokumen di pasal.id)
    // ====================================================================
    let legalContext = "";
    let rawReferences: any[] = [];
    const pasalApiKey = process.env.PASAL_ID_API_KEY;

    if (pasalApiKey) {
      // LIMIT DITINGKATKAN JADI 5 agar AI mendapat konteks (misal: UU ITE & UU Perlindungan Konsumen sekaligus)
      const searchUrl = `https://pasal.id/api/v1/search?q=${encodeURIComponent(searchQuery)}&limit=5`;
      
      const searchRes = await fetch(searchUrl, {
        headers: {
          'Authorization': `Bearer ${pasalApiKey}`
        }
      });

      if (searchRes.ok) {
        const data = await searchRes.json();
        
        if (data.results && data.results.length > 0) {
          // Filter pertama: buang hasil dengan skor relevansi terlalu rendah
          const scoreFiltered = data.results.filter((item: any) => (item.score ?? 0) >= 0.2);

          if (scoreFiltered.length > 0) {
            // ==================================================================
            // TAHAP 2.5: AI RELEVANCE FILTER
            // Verifikasi setiap hasil apakah benar-benar relevan dengan pertanyaan asli.
            // Ini mencegah pasal dari bidang hukum yang tidak berkaitan ikut ditampilkan.
            // ==================================================================
            const candidateList = scoreFiltered
              .map((item: any, idx: number) =>
                `[${idx}] ${item.work.type} No. ${item.work.number} Tahun ${item.work.year} tentang ${item.work.title}\nIsi: "${(item.snippet ?? '').substring(0, 200)}"`
              )
              .join('\n\n');

            const filterRes = await generateText({
              model: google('gemini-2.5-flash'),
              prompt: `Pertanyaan pengguna: "${latestMessage}"

Berikut daftar peraturan hukum dari hasil pencarian. Pilih HANYA indeks peraturan yang RELEVAN dengan pertanyaan di atas.

Kriteria RELEVAN: peraturan mengatur topik, bidang hukum, subjek, atau peristiwa yang sama dengan pertanyaan.
Kriteria TIDAK RELEVAN: peraturan mengatur topik yang sama sekali berbeda dari pertanyaan.

${candidateList}

Jawab HANYA dengan indeks yang relevan dipisah koma (contoh: "0,2,4"), atau jawab "kosong" jika tidak ada yang relevan.
JANGAN tambahkan penjelasan atau kata lain apapun.`,
            });

            const filterText = filterRes.text.trim().toLowerCase().replace(/\s/g, '');
            console.log("Hasil filter relevansi AI:", filterText);

            if (filterText !== 'kosong' && filterText.length > 0) {
              const indices = filterText
                .replace(/[^0-9,]/g, '')
                .split(',')
                .map((s: string) => parseInt(s.trim()))
                .filter((n: number) => !isNaN(n) && n >= 0 && n < scoreFiltered.length);

              rawReferences = indices.map((i: number) => scoreFiltered[i]).filter(Boolean);
            }
            // Jika filterText === 'kosong', rawReferences tetap [] → sidebar tampil "Tidak ditemukan"
          }
        }
      }
    }

    // Build legalContext hanya dari referensi yang sudah lolos filter relevansi
    if (rawReferences.length > 0) {
      legalContext = rawReferences.map((item: any) => {
        const ruleName = `${item.work.type} Nomor ${item.work.number} Tahun ${item.work.year} tentang ${item.work.title}`;
        const section = item.metadata?.node_type === 'pasal' ? `Pasal ${item.metadata.node_number}` : '';
        return `Sumber: ${ruleName} ${section}\nIsi Regulasi: "${item.snippet}"`;
      }).join('\n\n');
    }

    // ====================================================================
    // TAHAP 3: AUGMENTATION (System Prompt Super Power)
    // ====================================================================
    const systemPrompt = `Anda adalah PasalPintar.id — asisten hukum AI yang berpikir sistematis dan presisi seperti praktisi hukum senior di Indonesia, namun menjelaskan dengan bahasa sehari-hari yang mudah dipahami orang awam.

=== REFERENSI HUKUM (hasil pencarian real-time dari database nasional) ===
${legalContext ? legalContext : "Tidak ditemukan pasal/peraturan spesifik untuk pertanyaan ini di database."}
=== AKHIR REFERENSI ===

CARA BERPIKIR (lakukan secara internal sebelum menjawab, jangan ditampilkan ke pengguna):
1. Identifikasi inti pertanyaan: peristiwa hukum apa yang terjadi, dan bidang hukum apa yang relevan (pidana, perdata, ketenagakerjaan, dll).
2. Periksa REFERENSI HUKUM di atas — apakah relevan langsung, relevan sebagian, atau tidak relevan sama sekali dengan pertanyaan?
3. Jika ada lebih dari satu pasal/peraturan dalam referensi, urutkan berdasarkan:
   a. Hierarki peraturan (UUD 1945 > UU/Perppu > PP > Perpres > Perda).
   b. Asas "lex specialis derogat legi generali" (aturan khusus mengalahkan aturan umum).
   c. Asas "lex posterior derogat legi priori" (aturan yang lebih baru mengalahkan yang lebih lama).
   Gunakan yang paling spesifik & paling baru sebagai acuan utama, sebut sisanya sebagai pendukung/konteks.
4. Jika referensi tidak menyebutkan status terkini suatu pasal, JANGAN berasumsi — sampaikan sebagai catatan kehati-hatian.
5. Susun jawaban yang konkret dan actionable untuk situasi pengguna, bukan sekadar menyalin ulang bunyi pasal.

ATURAN MUTLAK (tidak boleh dilanggar):
1. JANGAN PERNAH mengarang nomor undang-undang, nomor pasal/ayat, atau isi norma yang tidak ada di REFERENSI HUKUM. Jika informasi yang dibutuhkan tidak ada di referensi dan Anda tidak yakin, katakan dengan jelas bahwa Anda tidak memiliki dasar hukum spesifik untuk hal itu.
2. Jika REFERENSI HUKUM relevan → jawaban WAJIB berpijak pada referensi tersebut, sebutkan dasar hukum secara spesifik.
3. Jika REFERENSI HUKUM kosong/tidak relevan → berikan penjelasan konsep hukum secara umum, beri label jelas bahwa ini penjelasan umum, dan sarankan konsultasi.
4. Jangan menebak skenario spesifik jika pertanyaan ambigu.
5. Anda BUKAN pengganti advokat. Selalu tegaskan untuk konsultasi sebelum bertindak.

FORMAT JAWABAN:
- **Ringkasan singkat**: 1-2 kalimat jawaban inti.
- **Dasar Hukum**: pasal/UU relevan dari referensi.
- **Penjelasan**: uraian bahasa sehari-hari.
- **Yang Perlu Dilakukan**: langkah praktis berikutnya.
- **Catatan**: ketidakpastian atau saran konsultasi lanjutan.

GAYA BAHASA: hangat, jelas, minim jargon.

PENTING: Jangan cetak proses "CARA BERPIKIR" Anda di output akhir. Hanya cetak FORMAT JAWABAN.`;

    // ====================================================================
    // TAHAP 4: GENERATION (Merumuskan jawaban akhir)
    // ====================================================================
    const result = await generateText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages,
    });

    return Response.json({
      text: result.text,
      message: result.text,
      response: result.text,
      references: rawReferences
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json({ error: "Terjadi kesalahan pada sistem server." }, { status: 500 });
  }
}