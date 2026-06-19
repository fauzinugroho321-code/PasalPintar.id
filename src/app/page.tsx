"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

export default function Home() {
  const [value, setValue] = useState("");
  const router = useRouter();
  const maxChars = 2000;
  const suggestions = [
    "Sengketa kontrak kerja",
    "Hak konsumen ditipu penjual online",
    "Proses cerai di pengadilan",
    "Kena PHK tanpa pesangon",
    "Sengketa tanah warisan",
    "Hak atas BPJS tidak dibayar",
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* HEADER */}
      <header className="flex justify-between items-center px-8 py-4 bg-[#071B3B] shrink-0 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Image 
            src="/icon.png" 
            alt="Logo PasalPintar" 
            width={40} 
            height={40} 
            className="rounded-xl object-cover" 
          />
          <div>
            <div className="text-xl font-bold">
              <span className="text-[#F9F7F0]">Pasal</span>
              <span className="text-[#B8964F]">Pintar.id</span>
            </div>
            <div className="text-xs text-[#F9F7F0]/70">Asisten Hukum Digital Indonesia</div>
          </div>
        </div>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/disclaimer" className="text-[#F9F7F0] hover:text-[#B8964F] transition-colors">
            Disclaimer
          </Link>
          <Link href="/mulai" className="inline-block rounded-lg px-5 py-2.5 bg-[#B8964F] text-[#071B3B] hover:bg-[#B8964F]/90 transition-colors font-bold">
            Mulai Gratis
          </Link>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        
        {/* Kolom Kiri */}
        <section className="flex items-center justify-center bg-gradient-to-br from-[#071B3B] via-[#041126] to-[#020610] px-10 py-20 lg:px-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-[#F9F7F0]">
              <span className="h-2 w-2 rounded-full bg-[#B8964F]" />
              AI Hukum - Berbasis Peraturan Indonesia
            </div>

            {/* FONT SERIF PREMIUM (LIBRE CASLON TEXT) DISEMATKAN DI SINI */}
            <h1 
              className="mt-8 text-4xl sm:text-5xl lg:text-[54px] font-bold leading-tight text-[#B8964F]"
              style={{ fontFamily: "var(--font-libre)" }}
            >
              Pahami Hak dan Kewajiban Anda, Lebih Mudah
            </h1>

            <p className="mt-6 text-lg text-[#F9F7F0]/80 leading-relaxed">
              Ceritakan masalah hukum Anda dalam bahasa sehari-hari. PasalPintar akan
              mencari pasal dan regulasi yang relevan untuk Anda.
            </p>
          </div>
        </section>

        {/* Kolom Kanan */}
        <aside className="flex items-center justify-center bg-[#E4E2DC] px-6 py-16 lg:px-12">
          <div className="w-full max-w-xl">
            
            {/* Kotak Input */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <label className="block text-xs font-bold tracking-wider text-[#333333]/50 uppercase">
                Ceritakan Masalah Hukum Anda
              </label>

              <textarea
                className="mt-4 w-full h-32 resize-none bg-transparent text-[#333333] placeholder:text-[#333333]/30 outline-none text-lg"
                placeholder="Contoh: Majikan saya belum membayar gaji selama 2 bulan, apa yang bisa saya lakukan?"
                value={value}
                maxLength={maxChars}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (value.trim()) router.push(`/hasil?q=${encodeURIComponent(value.trim())}`);
                  }
                }}
              />

              <p className="text-sm text-[#333333]/50 mt-2">
                Semakin detail cerita Anda, semakin akurat jawaban yang diberikan...
              </p>

              <hr className="my-6 border-gray-100" />

              <div className="flex items-center justify-between">
                {/* 1. Counter Karakter (0 / 2000) */}
                <div className="text-sm font-medium text-[#c5a059]">
                  {value.length} / {maxChars}
                </div>

                {/* 2. Tombol Cari Jawaban */}
                <button
                  type="button"
                  onClick={() => {
                    if (value.trim()) router.push(`/hasil?q=${encodeURIComponent(value.trim())}`);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1A2B4C] px-6 py-3 text-sm font-medium text-[#c5a059] hover:bg-[#1A2B4C]/90 transition-colors"
                >
                  <Search className="h-4 w-4" />
                  Cari Jawaban
                </button>
              </div>
            </div>

{/* 3. Chips Saran */}
            <div className="mt-6 flex flex-wrap gap-3">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setValue(s);
                    router.push(`/hasil?q=${encodeURIComponent(s)}`);
                  }}
                  className="rounded-full bg-[#c5a059] px-4 py-2 text-sm font-medium text-[#071B3B] shadow-sm hover:bg-[#c5a059]/80 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
            
          </div>
        </aside>
      </main>
      {/* FOOTER */}
      <footer className="bg-[#071B3B] py-5 px-8 text-center text-xs text-[#c5a059] shrink-0 font-medium">
        <p>
          PasalPintar.id adalah platform <strong className="font-bold">edukasi hukum</strong>, bukan pengganti konsultasi dengan pengacara berlisensi. 
          {" "} &middot; {" "}
          <Link href="/disclaimer" className="underline hover:text-white transition-colors">
            Baca Disclaimer Lengkap
          </Link>
          {" "} &middot; {" "}
        </p>
      </footer>
      
    </div>
  );
}