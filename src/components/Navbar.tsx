"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowRight, Layers, Sparkles, LogIn } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/90 text-white transition-all w-full">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative flex items-center justify-between h-20 w-full">
          {/* Brand Logo (Left) */}
          <Link href="/" className="flex items-center gap-3 shrink-0 z-10 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">
                  Edu<span className="text-blue-500">Coach</span>
                </span>
                {/* <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 border border-blue-400/30 text-blue-300 px-2 py-0.5 rounded-full leading-none">
                  মাস্টার
                </span> */}
              </div>
              <span className="text-[11px] text-slate-400 font-medium tracking-tight mt-1 hidden sm:inline-block">
                কোচিং ম্যানেজমেন্ট প্ল্যাটফর্ম
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Mathematically Centered in Navbar) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 absolute left-1/2 -translate-x-1/2">
            <Link
              href="/#portfolio"
              className="text-sm font-bold text-slate-300 hover:text-blue-400 transition-colors whitespace-nowrap py-1 px-1.5"
            >
              সিস্টেম পোর্টফোলিও
            </Link>
            <Link
              href="/#modules"
              className="text-sm font-bold text-slate-300 hover:text-blue-400 transition-colors whitespace-nowrap py-1 px-1.5"
            >
              ফিচার ও মডিউল
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-bold text-slate-300 hover:text-blue-400 transition-colors whitespace-nowrap py-1 px-1.5"
            >
              সাবস্ক্রিপশন প্ল্যান
            </Link>
            <Link
              href="/track"
              className="text-sm font-bold text-slate-300 hover:text-blue-400 transition-colors whitespace-nowrap py-1 px-1.5"
            >
              আবেদন ট্র্যাকিং
            </Link>
          </nav>

          {/* Right Action CTAs (Bangla Only) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0 z-10">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-400" />
              <span>লগইন</span>
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-4.5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md shadow-blue-500/25 transition-all hover:-translate-y-0.5 whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>কোচিং ওয়েবসাইট তৈরি</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>

          {/* Mobile/Tablet Menu Button */}
          <div className="lg:hidden flex items-center gap-2 z-10">
            <Link
              href="/login"
              className="px-3 py-1.5 text-xs font-bold text-slate-200 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
            >
              লগইন
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 shadow-2xl">
          <div className="space-y-1">
            <Link
              href="/#portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-bold text-slate-300 hover:bg-slate-800 hover:text-blue-400 rounded-xl transition-colors"
            >
              সিস্টেম পোর্টফোলিও
            </Link>
            <Link
              href="/#modules"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-bold text-slate-300 hover:bg-slate-800 hover:text-blue-400 rounded-xl transition-colors"
            >
              ফিচার ও মডিউল
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-bold text-slate-300 hover:bg-slate-800 hover:text-blue-400 rounded-xl transition-colors"
            >
              সাবস্ক্রিপশন প্ল্যান
            </Link>
            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-bold text-slate-300 hover:bg-slate-800 hover:text-blue-400 rounded-xl transition-colors"
            >
              আবেদন ট্র্যাকিং
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors"
            >
              <LogIn className="w-4 h-4 text-slate-400" />
              <span>লগইন প্যানেল</span>
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>কোচিং ওয়েবসাইটের আবেদন (ফ্রি)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
