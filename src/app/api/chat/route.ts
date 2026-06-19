export const dynamic = "force-dynamic";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// 1. SETUP KONEKSI PRISMA 
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
let prisma = globalForPrisma.prisma;

if (!prisma) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    // Membersihkan pesan agar rapi
    const coreMessages = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: String(m.content || " ")
    }));

    const lastUserMessage = [...coreMessages].reverse().find((m: any) => m.role === "user");
    const userText = lastUserMessage?.content || "";

    if (!userText) {
      return new Response(JSON.stringify({ error: "Pesan tidak boleh kosong" }), { status: 400 });
    }

    // 2. LOGIKA PENCARIAN PASAL DI SUPABASE
    const stopWords = ["apa", "siapa", "kapan", "dimana", "kenapa", "bagaimana", "hukumnya", "hukum", "jika", "kalau", "dan", "atau", "yang", "di", "ke", "dari", "buat", "hal", "itu", "ini", "ada", "adalah", "masalah", "kena"];
    
    const keywords = userText
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .split(/\s+/)
      .filter((word: string) => word.length >= 3 && !stopWords.includes(word));

    let pasals: any[] = [];
    if (keywords.length > 0) {
      try {
        pasals = await prisma.undangUndang.findMany({
          where: {
            OR: keywords.map((word: string) => ({
              isi_teks: { contains: word, mode: "insensitive" }
            }))
          },
          take: 3,
        });
      } catch (prismaErr: any) {
        console.warn("Prisma Gagal Mencari:", prismaErr.message);
      }
    }

    const contextText = pasals.length > 0
      ? pasals.map((p: any) => `[${p.nomor_pasal} - ${p.sumber_regulasi}]: ${p.isi_teks}`).join(" | ")
      : "Belum ada rujukan spesifik dari database Anda.";

    const systemPrompt = `Kamu adalah PasalPintar, asisten hukum di Indonesia. Jawab pertanyaan pengguna berdasarkan konteks ini jika relevan: ${contextText}. Jelaskan dengan bahasa sehari-hari.`;

    // 3. VERCEL AI SDK: RESMI MEMAKAI GEMINI 2.5 FLASH! 🚀
    const result = await generateText({
      model: google("gemini-2.5-flash"), 
      system: systemPrompt,
      messages: coreMessages as any,
    });

    // Mengembalikan jawaban AI beserta data pasal ke layar UI
    return new Response(JSON.stringify({ text: result.text, pasals: pasals }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err: any) {
    console.error("💥 ERROR TERTANGKAP:", err.message);
    return new Response(JSON.stringify({ error: err.message || "Terjadi kesalahan internal." }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}