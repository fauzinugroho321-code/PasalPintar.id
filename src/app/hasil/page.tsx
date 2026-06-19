"use client";

import { useEffect, Suspense, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, MessageSquare, ArrowRight } from "lucide-react";
import ReactMarkdown from 'react-markdown';

function ChatContent() {
  const params = useSearchParams();
  const q = params?.get("q") ?? "";

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [rujukan, setRujukan] = useState<any[]>([]);

  const hasAutoSent = useRef(false);

  const sendToAPI = async (text: string) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { id: Date.now(), role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal menghubungi AI");

      setMessages(prev => [...prev, { id: Date.now() + 1, role: "assistant", content: data.text }]);
      
      if (data.pasals) {
        setRujukan(data.pasals);
      } else {
        setRujukan([]);
      }
      
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (q && !hasAutoSent.current) {
      hasAutoSent.current = true;
      sendToAPI(q);
    }
  }, [q]);

  const onSubmitManual = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendToAPI(input);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F0] text-slate-900 font-sans flex flex-col">
      
      {/* HEADER BARU */}
      <header className="flex justify-between items-center px-8 py-4 bg-[#071B3B] shrink-0 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image src="/icon.png" alt="Logo" width={40} height={40} className="rounded-xl object-cover" />
          </Link>
          <div className="hidden md:block">
            <Link href="/">
              <div className="text-xl font-bold">
                <span className="text-[#F9F7F0]">Pasal</span>
                <span className="text-[#B8964F]">Pintar.id</span>
              </div>
            </Link>
            <div className="text-[10px] text-[#F9F7F0]/70">Asisten Hukum Digital Indonesia</div>
          </div>
        </div>

        <form onSubmit={onSubmitManual} className="flex items-center gap-3 flex-1 max-w-xl mx-4 lg:mx-8">
          <div className="flex w-full items-center gap-2 rounded-lg bg-[#0A294F] px-3 py-2 border border-white/10 shadow-inner">
            <Search className="h-4 w-4 text-[#c5a059]" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pertanyaan hukum lainnya..."
              className="w-full bg-transparent px-2 text-sm text-[#c5a059] placeholder:text-[#c5a059]/70 outline-none"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading} 
            className="rounded-lg bg-[#c5a059] hover:bg-[#c5a059]/90 px-5 py-2 text-sm font-bold text-[#071B3B] shadow disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {isLoading ? "Loading..." : "Kirim"}
          </button>
        </form>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <Link href="/disclaimer" className="text-[#F9F7F0] hover:text-[#B8964F] transition-colors">Disclaimer</Link>
          <Link href="/mulai" className="inline-block rounded-lg px-5 py-2.5 bg-[#B8964F] text-[#071B3B] hover:bg-[#B8964F]/90 transition-colors font-bold">
            Mulai Gratis
          </Link>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-7xl px-4 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* KOLOM KIRI (KARTU CHAT) */}
          <section className="lg:col-span-8 lg:pr-4">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              
              <div className="border border-[#c5a059] rounded-xl p-5 mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-5 h-5 text-[#c5a059]" />
                  <div className="text-xs font-bold text-gray-500 tracking-wider">PERTANYAAN ANDA</div>
                </div>
                <div className="text-[15px] text-gray-800 font-medium">
                  {q || "Belum ada pertanyaan"}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center rounded-md bg-[#071B3B] px-3 py-1 text-[10px] font-bold text-white tracking-widest shadow-sm">
                  PASALPINTAR AI
                </span>
                <div className="text-xs text-gray-500 font-medium">
                  Jawaban bersifat edukatif, bukan nasihat hukum formal
                </div>
              </div>

              <div className="text-[15px] text-gray-800 leading-relaxed">
                {errorMsg && (
                  <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
                    <strong>Error:</strong> <br/>{errorMsg}
                  </div>
                )}

                {messages.length === 0 && !isLoading && !errorMsg && (
                   <div className="mt-4 text-gray-400 italic">
                     Silakan ketik pertanyaan di kotak pencarian atas, lalu tekan <strong>"Kirim"</strong>.
                   </div>
                )}

                {messages.map((m: any, index: number) => {
                  if (m.role === "user" && index === 0) return null;

                  return (
                    <div key={m.id} className="mb-6">
                      {m.role === "user" ? (
                         <div className="bg-gray-50 p-4 rounded-xl text-gray-700 border border-gray-100 mt-8 mb-4">
                           <span className="text-xs font-bold text-gray-400 block mb-2">PERTANYAAN LANJUTAN</span>
                           {m.content}
                         </div>
                      ) : (
                         <div className="prose prose-slate max-w-none prose-p:mb-5 prose-strong:bg-[#f3ead1] prose-strong:text-gray-900 prose-strong:font-medium prose-strong:px-1.5 prose-strong:py-0.5 prose-strong:rounded-sm">
                           <ReactMarkdown>
                             {m.content ?? ""}
                           </ReactMarkdown>
                         </div>
                      )}
                    </div>
                  )
                })}

                {isLoading && (
                  <div className="mt-4 italic text-gray-400 flex items-center gap-2">
                    <span className="h-2 w-2 bg-[#c5a059] rounded-full animate-bounce"></span>
                    Sedang merumuskan jawaban hukum...
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* KOLOM KANAN (RUJUKAN PASAL PREMIUM) */}
          <aside className="lg:col-span-4">
            <div className="bg-[#f4ecd8] p-6 rounded-2xl sticky top-6 border border-[#e8dcc4] shadow-inner">
              <h3 className="text-[13px] font-bold text-[#c5a059] tracking-widest uppercase mb-6">
                Rujukan Pasal
              </h3>
              
              {rujukan.length === 0 ? (
                <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-white">
                  <p className="text-sm text-gray-400 font-medium">Belum ada rujukan pasal spesifik untuk pertanyaan ini.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 mb-6">
                  {rujukan.map((pasal: any, idx: number) => (
                    <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-white hover:border-[#c5a059]/40 transition-colors">
                      {/* Judul Pasal */}
                      <div className="text-lg font-bold text-[#071B3B] mb-0.5" style={{ fontFamily: "var(--font-libre)" }}>
                        {pasal.nomor_pasal}
                      </div>
                      {/* Sumber UU */}
                      <div className="text-[10px] font-bold text-[#c5a059] uppercase tracking-wide mb-3">
                        {pasal.sumber_regulasi}
                      </div>
                      {/* Isi Teks */}
                      <div className="text-[13px] text-gray-700 leading-relaxed font-medium mb-4 line-clamp-4">
                        {pasal.isi_teks}
                      </div>
                      {/* Tautan Fiktif (Lihat Teks Asli) */}
                      <button className="text-[11px] font-bold text-[#071B3B] hover:text-[#c5a059] transition-colors flex items-center gap-1 underline decoration-[#c5a059]/40 underline-offset-4">
                        Lihat teks asli <ArrowRight className="w-3 h-3 text-[#c5a059]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* AREA BAWAH: Teks Peringatan & Tombol Disclaimer */}
              <div className="pt-5 border-t border-[#e8dcc4]">
                <p className="text-[11px] text-gray-600 mb-5 leading-relaxed font-medium">
                  Pasal-pasal di atas adalah sumber hukum faktual. Selalu verifikasi dengan versi resmi melalui JDIH atau konsultasi advokat.
                </p>
                <Link href="/disclaimer" className="block">
                  <button className="w-full bg-[#c5a059] text-[#071B3B] text-xs font-bold py-3.5 rounded-xl hover:bg-[#c5a059]/90 transition-colors flex justify-center items-center gap-2 shadow-sm">
                    Baca Disclaimer <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}

export default function HasilPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-600">Memuat asisten hukum...</div>}>
      <ChatContent />
    </Suspense>
  );
}