import Link from "next/link";
import { Layers, ShieldCheck, Mail, Phone, Lock, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white">
                Edu<span className="text-blue-500">Coach</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              যেকোনো কোচিং সেন্টারের জন্য পূর্ণাঙ্গ আধুনিক ওয়েবসাইট ও ম্যানেজমেন্ট সফটওয়্যার প্ল্যাটফর্ম। প্রতিটি প্রতিষ্ঠানের জন্য রয়েছে নিজস্ব ব্র্যান্ডিং, লাইভ হোস্টিং ও ডেডিকেটেড ক্লাউড পোর্টাল।
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Cloud Systems Operational</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              সিস্টেম মডিউলসমূহ
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>পাবলিক ওয়েবসাইট ও অনলাইন ভর্তি</span>
              </li>
              <li className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>শিক্ষার্থী ও অভিভাবক ড্যাশবোর্ড</span>
              </li>
              <li className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>শিক্ষক পোর্টাল ও ডিজিটাল হাজিরা</span>
              </li>
              <li className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>পরীক্ষার ফলাফল ও মেধা তালিকা (Rank)</span>
              </li>
              <li className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>মাসিক ফি কালেকশন ও রসিদ প্রিন্ট</span>
              </li>
              <li className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>রিয়েল-টাইম লাইভ চ্যাট মেসেঞ্জার</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              নেভিগেশন ও লিংক
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/register" className="hover:text-blue-400 transition-colors">
                  ফ্রি ওয়েবসাইট আবেদন (Free MVP)
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-blue-400 transition-colors">
                  আবেদনের বর্তমান অবস্থা (Track Request)
                </Link>
              </li>
              <li>
                <Link href="/#portfolio" className="hover:text-blue-400 transition-colors">
                  সিস্টেম প্রিভিউ ও পোর্টফোলিও
                </Link>
              </li>
              <li>
                <Link href="/#modules" className="hover:text-blue-400 transition-colors">
                  সকল সুবিধার তালিকা (Capabilities)
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-blue-400 transition-colors">
                  সাবস্ক্রিপশন প্ল্যানসমূহ (Pricing)
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>অ্যাডমিন ও ওনার সাইন-ইন</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Master Admin */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              যোগাযোগ ও সহায়তা
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <p className="leading-relaxed text-xs">
                নতুন কোচিং সাইট তৈরি, ডোমেইন সংযোগ কিংবা কাস্টম রিকোয়ারমেন্টের জন্য আমাদের সাথে যোগাযোগ করুন।
              </p>
              <div className="flex items-center gap-2 pt-1 text-slate-300">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-mono text-xs">support@educoach.com</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-mono text-xs">+880 1700-000000</span>
              </div>
              <div className="pt-2">
                <Link
                  href="/register"
                  className="inline-block px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all"
                >
                  আজই আপনার কোচিং রেজিস্টার করুন →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-12 mt-12 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EduCoach Master Platform. সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>১০০% নিরাপদ ও আধুনিক ক্লাউড আর্কিটেকচার</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
