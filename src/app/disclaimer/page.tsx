"use client";

import Image from "next/image";
import Link from "next/link";
import { Scale, Cpu, Shield, BookOpen, ChevronLeft } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#f6f7f9] text-slate-900 font-sans flex flex-col">
      
      {/* HEADER (Konsisten dengan halaman lain) */}
      <header className="flex justify-between items-center px-8 py-4 bg-[#071B3B] shrink-0 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image src="/icon.png" alt="Logo" width={40} height={40} className="rounded-xl object-cover" />
          </Link>
          <div className="hidden md:block">
            <Link href="/">
              <div className="text-xl font-bold">
                <span className="text-[#F9F7F0]">Pasal</span>
                <span className="text-[#c5a059]">Pintar.id</span>
              </div>
            </Link>
            <div className="text-[10px] text-[#F9F7F0]/70">Asisten Hukum Digital Indonesia</div>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {/* Teks Disclaimer dibuat warna emas untuk menandakan halaman aktif */}
          <Link href="/disclaimer" className="text-[#c5a059] font-bold">Disclaimer</Link>
          <Link href="/mulai" className="inline-block rounded-lg px-5 py-2.5 bg-[#c5a059] text-[#071B3B] hover:bg-[#c5a059]/90 transition-colors font-bold">
            Mulai Gratis
          </Link>
        </nav>
      </header>

      {/* MAIN CONTENT (Persis seperti gambar Anda) */}
      <main className="mx-auto max-w-5xl px-6 py-12 flex-1 w-full">
        

        {/* Judul Halaman (Font Libre Caslon) */}
        <h1 
          className="text-4xl md:text-5xl font-bold text-[#071B3B] text-center mb-10"
          style={{ fontFamily: "var(--font-libre)" }}
        >
          Disclaimer & Ketentuan Penggunaan
        </h1>

        {/* Kotak Peringatan Utama */}
        <div className="bg-[#fcfaf5] border border-[#c5a059]/50 rounded-xl p-6 md:p-8 text-center shadow-sm mb-16">
          <p className="text-sm md:text-[15px] text-gray-700 leading-relaxed font-medium" style={{ color: "#c5a059" }}>
            PasalPintar.id adalah platform edukasi hukum berbasis kecerdasan buatan. Informasi yang tersedia di platform ini bukan merupakan nasihat hukum profesional dan tidak dapat menggantikan konsultasi dengan advokat atau konsultan hukum yang berlisensi.
          </p>
        </div>

        {/* Fitur / Poin Penting */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center mb-16">
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-[#c5a059]/30 flex items-center justify-center mb-4">
              <Scale className="w-6 h-6 text-[#c5a059]" />
            </div>
            <h3 className="font-bold text-[#071B3B] mb-2 text-[15px]">Bukan Pengganti Advokat</h3>
            <p className="text-xs text-gray-500 leading-relaxed" style={{ color: "#c5a059" }}>
              Platform ini bukan merupakan nasihat hukum profesional dan tidak dapat menggantikan konsultasi dengan advokat yang berlisensi.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-[#c5a059]/30 flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6 text-[#c5a059]" />
            </div>
            <h3 className="font-bold text-[#071B3B] mb-2 text-[15px]">Batasan Teknologi AI</h3>
            <p className="text-xs text-gray-500 leading-relaxed" style={{ color: "#c5a059" }}>
              Informasi yang dihasilkan oleh AI memiliki keterbatasan; selalu verifikasi fakta dan peraturan terkini.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-[#c5a059]/30 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-[#c5a059]" />
            </div>
            <h3 className="font-bold text-[#071B3B] mb-2 text-[15px]">Kerahasiaan Data</h3>
            <p className="text-xs text-gray-500 leading-relaxed" style={{ color: "#c5a059" }}>
              Kami berkomitmen menjaga kerahasiaan data; jangan bagikan informasi sensitif tanpa pertimbangan.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-[#c5a059]/30 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-[#c5a059]" />
            </div>
            <h3 className="font-bold text-[#071B3B] mb-2 text-[15px]">Tentang PasalPintar.id</h3>
            <p className="text-xs text-gray-500 leading-relaxed" style={{ color: "#c5a059" }}>
              PasalPintar.id mengumpulkan referensi peraturan untuk membantu masyarakat memahami hak dan kewajiban dalam bahasa sehari-hari.
            </p>
          </div>

        </div>

        {/* Kotak Statistik */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
            <div className="text-2xl md:text-3xl font-bold text-[#c5a059] mb-1">10.000+</div>
            <div className="text-[11px] md:text-xs text-gray-500 font-medium">Pasal & regulasi tersimpan</div>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
            <div className="text-2xl md:text-3xl font-bold text-[#c5a059] mb-1">50+</div>
            <div className="text-[11px] md:text-xs text-gray-500 font-medium">Undang-undang tercakup</div>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
            <div className="text-2xl md:text-3xl font-bold text-[#c5a059] mb-1">Bahasa</div>
            <div className="text-[11px] md:text-xs text-gray-500 font-medium">Indonesia sehari-hari</div>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
            <div className="text-2xl md:text-3xl font-bold text-[#c5a059] mb-1">Gratis</div>
            <div className="text-[11px] md:text-xs text-gray-500 font-medium">Akses dasar untuk semua</div>
          </div>

        </div>

        {/* Footer Kecil */}
        <div className="text-center text-[11px] font-medium text-gray-400 mt-8 pb-8">
          © 2026 PasalPintar.id - Dibuat untuk masyarakat Indonesia
        </div>

      </main>
    </div>
  );
}