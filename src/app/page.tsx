"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Layers,
  Database,
  Globe,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  CreditCard,
  Lock,
  Zap,
  Sliders,
  Calendar,
  MessageSquare,
  Award,
  Building2,
  Check,
  FileText,
  Printer,
  TrendingUp,
  ShieldAlert,
  Clock,
  Laptop,
  Smartphone,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const portfolioModules = [
    {
      id: "website",
      badge: "মডিউল ০১",
      tabLabel: "ওয়েবসাইট ও ভর্তি",
      title: "পাবলিক ওয়েবসাইট ও অনলাইন ভর্তি",
      shortDesc: "আপনার প্রতিষ্ঠানের নিজস্ব ব্র্যান্ডিংয়ে আধুনিক ওয়েবসাইট ও অনলাইন ফর্ম।",
      icon: Globe,
      color: "from-blue-600 to-sky-500",
      content: {
        headline: "আধুনিক পাবলিক ওয়েবসাইট ও ডিজিটাল ভর্তি কার্যক্রম",
        description:
          "প্রতিটি কোচিং সেন্টার পাবে দৃষ্টিনন্দন পাবলিক ওয়েবসাইট। যেখানে প্রতিষ্ঠানের পরিচিতি, কোর্সসমূহ, শিক্ষক তালিকা, পাবলিক নোটিশবোর্ড এবং সরাসরি অনলাইন ভর্তির আবেদন ফর্ম অন্তর্ভুক্ত থাকবে।",
        features: [
          "কাস্টম ব্র্যান্ডিং: নিজস্ব লোগো, নাম, স্লোগান ও ছবি ব্যবহারের সুবিধা",
          "অনলাইন ভর্তি ফর্ম: শিক্ষার্থী সরাসরি ফর্ম পূরণ করে আবেদন করতে পারে",
          "স্বয়ংক্রিয় স্টুডেন্ট আইডি: আবেদন অনুমোদনের পর স্বয়ংক্রিয় আইডি জেনারেট (যেমন: STU-2026-0042)",
          "নোটিশবোর্ড ও ইভেন্ট: যেকোনো জরুরি নোটিশ বা ছুটির বার্তা তাৎক্ষণিক প্রকাশ",
          "হোয়াটসঅ্যাপ ও ফোন যোগাযোগ: সরাসরি অভিভাবক ও শিক্ষার্থীদের সাথে কানেক্ট হওয়ার সুবিধা",
        ],
        previewType: "website",
      },
    },
    {
      id: "student-portal",
      badge: "মডিউল ০২",
      tabLabel: "শিক্ষার্থী পোর্টাল",
      title: "শিক্ষার্থী ও অভিভাবক পোর্টাল",
      shortDesc: "ক্লাস রুটিন, উপস্থিতি, রেজাল্ট ও ফি দেখার জন্য ডেডিকেটেড স্টুডেন্ট ড্যাশবোর্ড।",
      icon: Users,
      color: "from-indigo-600 to-purple-600",
      content: {
        headline: "শিক্ষার্থী ও অভিভাবকদের জন্য নিরাপদ নিজস্ব ড্যাশবোর্ড",
        description:
          "শিক্ষার্থী ও অভিভাবকরা তাদের ইউনিক আইডি ও পাসওয়ার্ড দিয়ে লগইন করে তাদের সার্বিক অগ্রগতি ও পরীক্ষার মার্কশিট যেকোনো সময় অনলাইনে দেখতে পারবেন।",
        features: [
          "ডিজিটাল প্রোফাইল: ছবি, ব্যাচ, রোল, রক্তের গ্রুপ ও জরুরি অভিভাবক যোগাযোগ তথ্য",
          "লাইভ হাজিরা শতাংশ: মাসিক উপস্থিতির পার্সেন্টেজ বার ও বিগত দিনের হাজিরার হিসাব",
          "অনলাইন পরীক্ষার ফলাফল: বিষয়ভিত্তিক নম্বর, লেটার গ্রেড ও মেধা তালিকা (Rank)",
          "ক্লাস শিডিউল ও রুটিন: সপ্তাহের কোন দিন কোন বিষয়ে কার ক্লাস তার সার্বিক সূচি",
          "ফি স্ট্যাটাস: মাসিক ফি বকেয়া বা পরিশোধের অবস্থা ও পূর্ববর্তী রসিদ ডাউনলোড",
        ],
        previewType: "student",
      },
    },
    {
      id: "attendance",
      badge: "মডিউল ০৩",
      tabLabel: "ডিজিটাল হাজিরা",
      title: "শিক্ষক প্যানেল ও ডিজিটাল হাজিরা",
      shortDesc: "১-ক্লিকে ব্যাচভিত্তিক হাজিরা গ্রহণ ও স্বয়ংক্রিয় অনুপস্থিতি রিপোর্ট।",
      icon: CheckCircle2,
      color: "from-emerald-600 to-teal-500",
      content: {
        headline: "কাগজের খাতা ছাড়াই এক ক্লিকে ডিজিটাল উপস্থিতি",
        description:
          "শিক্ষক বা অ্যাডমিন সরাসরি মোবাইল বা ল্যাপটপ থেকে তারিখ ও ব্যাচ নির্বাচন করে মুহূর্তে পুরো ক্লাসের হাজিরা নিতে পারেন। অনুপস্থিত শিক্ষার্থীদের স্বয়ংক্রিয় তালিকা তৈরি হয়।",
        features: [
          "১-ক্লিকে অল-প্রেজেন্ট: এক ক্লিকে সবাইকে উপস্থিত করে শুধু অনুপস্থিতদের মার্ক করার সুবিধা",
          "উপস্থিতি স্ট্যাটাস: উপস্থিত (Present), অনুপস্থিত (Absent) এবং বিলম্বিত (Late)",
          "মাসিক উপস্থিতি অ্যানালিটিক্স: প্রতিটি শিক্ষার্থীর শতকরা উপস্থিতির স্বয়ংক্রিয় হিসাব",
          "ব্যাচভিত্তিক ফিল্টারিং: সেশন, শ্রেণি ও ব্যাচ অনুযায়ী নির্ভুল রেকর্ড সংরক্ষণ",
          "অ্যাক্সেস কন্ট্রোল: শিক্ষকরা কেবল তাদের নিজস্ব নির্ধারিত ব্যাচের হাজিরা নিতে পারেন",
        ],
        previewType: "attendance",
      },
    },
    {
      id: "exams",
      badge: "মডিউল ০৪",
      tabLabel: "পরীক্ষা ও রেজাল্ট",
      title: "পরীক্ষা, গ্রেডিং ও মেধা তালিকা",
      shortDesc: "নম্বর এন্ট্রি করলেই লেটার গ্রেড (A+, A, B...) ও ব্যাচের মেধা তালিকা প্রকাশ।",
      icon: Award,
      color: "from-amber-500 to-orange-500",
      content: {
        headline: "স্বয়ংক্রিয় ফলাফল প্রকাশ ও ব্যাচ মেধা তালিকা (Rank)",
        description:
          "সাপ্তাহিক মডেল টেস্ট কিংবা চূড়ান্ত পরীক্ষা—নম্বর ইনপুট দিলেই সিস্টেম স্বয়ংক্রিয়ভাবে জিপিএ, লেটার গ্রেড এবং ব্যাচের ১ম, ২য়, ৩য় মেধা তালিকা তাৎক্ষণিক তৈরি করে।",
        features: [
          "লিখিত ও এমসিকিউ নম্বর: বিষয়ভিত্তিক মোট নম্বর ও প্রাপ্ত নম্বরের সহজ এন্ট্রি",
          "স্ট্যান্ডার্ড গ্রেডিং সিস্টেম: বাংলাদেশের শিক্ষাবোর্ড অনুযায়ী A+, A, A-, B, C, F নির্ধারণ",
          "অটো-র‍্যাংক জেনারেশন: সর্বোচ্চ নম্বরের ভিত্তিতে ব্যাচের মেধা তালিকা (Rank #1, #2...)",
          "রেজাল্ট কার্ড প্রিন্ট: প্রতিটি শিক্ষার্থীর নিজস্ব মার্কশিট এক ক্লিকে ডাউনলোড ও প্রিন্ট",
          "অভিভাবক নোটিফিকেশন: ফলাফল প্রকাশিত হওয়ামাত্র শিক্ষার্থী পোর্টালে দৃশ্যমান",
        ],
        previewType: "exam",
      },
    },
    {
      id: "fees",
      badge: "মডিউল ০৫",
      tabLabel: "ফি ও রসিদ",
      title: "ফি হিসাব ও ডিজিটাল রসিদ প্রিন্ট",
      shortDesc: "ব্যাচভিত্তিক মাসিক ফি ডিউ জেনারেট, ছাড় হিসাব ও প্রিন্ট উপযোগী রসিদ।",
      icon: CreditCard,
      color: "from-sky-600 to-blue-700",
      content: {
        headline: "কোচিংয়ের মাসিক ফি ও অ্যাকাউন্টিং এখন সম্পূর্ণ নির্ভুল",
        description:
          "মাসের শুরুতে এক ক্লিকে পুরো ব্যাচের সকল শিক্ষার্থীর মাসিক ফি ডিউ তৈরি করুন। বিশেষ ছাড় (Waiver), বকেয়া হিসাব এবং নগদ/বিকাশ রসিদ প্রস্তুত হয় নিমিষে।",
        features: [
          "১-ক্লিকে ব্যাচ ডিউ: সম্পূর্ণ ব্যাচের শিক্ষার্থীদের জন্য একযোগে মাসিক ফি বিল জেনারেট",
          "বিশেষ ছাড় (Waiver/Scholarship): দরিদ্র বা মেধাবী শিক্ষার্থীদের জন্য কাস্টম ডিসকাউন্ট",
          "২-পার্ট প্রিন্ট রসিদ: ব্যাংকের আদলে 'অফিস কপি' ও 'শিক্ষার্থী কপি' সমন্বিত ভাউচার",
          "পেমেন্ট মেথড ট্র্যাকিং: ক্যাশ, বিকাশ, নগদ বা ব্যাংক ট্রান্সফারের ট্রানজেকশন আইডি নোট",
          "আদায় ও বকেয়া রিপোর্ট: কত টাকা আদায় হয়েছে আর কত বকেয়া রয়েছে তার মাসিক বিবরণী",
        ],
        previewType: "fees",
      },
    },
    {
      id: "messenger",
      badge: "মডিউল ০৬",
      tabLabel: "লাইভ মেসেঞ্জার",
      title: "লাইভ চ্যাট ও নোটিফিকেশন সিস্টেম",
      shortDesc: "শিক্ষক ও শিক্ষার্থীর সরাসরি যোগাযোগ, সিন/আনসিন ডাবল-টিক (✓✓)।",
      icon: MessageSquare,
      color: "from-rose-600 to-pink-500",
      content: {
        headline: "শিক্ষক ও শিক্ষার্থীর সরাসরি নিরাপদ যোগাযোগ",
        description:
          "হোয়াটসঅ্যাপের বিকল্প হিসেবে সিস্টেমের ভেতরেই রয়েছে ইন-অ্যাপ মেসেঞ্জার। পড়ালেখা সংক্রান্ত জিজ্ঞাসা, হোমওয়ার্ক আপডেট কিংবা ক্লাসের বার্তা সরাসরি আদান-প্রদান করা যায়।",
        features: [
          "ইন-অ্যাপ চ্যাট: শিক্ষক ও শিক্ষার্থীর মধ্যে সরাসরি টেক্সট মেসেজিং",
          "সিন/আনসিন স্ট্যাটাস: মেসেজ পাঠানো হলে সিঙ্গেল টিক এবং দেখা হলে ডাবল টিক (✓✓)",
          "আনরিড কাউন্টার: না-পড়া মেসেজের সংখ্যা ও নোটিফিকেশন বেল অ্যালার্ট",
          "নিরাপদ ও নিয়ন্ত্রিত: শুধুমাত্র সেন্টারের অনুমোদিত শিক্ষক ও শিক্ষার্থীরাই চ্যাট করতে পারে",
          "জরুরি ব্রডকাস্ট: পুরো ব্যাচের উদ্দেশ্যে একসাথে শিক্ষকের দিকনির্দেশনা প্রদান",
        ],
        previewType: "messenger",
      },
    },
  ];

  const allCapabilities = [
    {
      icon: Database,
      color: "blue",
      title: "১০০% স্বতন্ত্র ক্লাউড ডেটাবেজ",
      desc: "প্রতিটি কোচিং সেন্টারের তথ্যের জন্য সম্পূর্ণ আলাদা ক্লাউড ডেটাবেজ। এক প্রতিষ্ঠানের ডেটার সাথে অন্য প্রতিষ্ঠানের কোনো মিশ্রণ বা শেয়ারিং থাকে না।",
    },
    {
      icon: Users,
      color: "indigo",
      title: "৩টি ডেডিকেটেড পোর্টাল",
      desc: "পাবলিক ওয়েবসাইট ছাড়াও রয়েছে শিক্ষার্থী/অভিভাবক পোর্টাল, শিক্ষক পোর্টাল এবং সমগ্র সেন্টার পরিচালনার কেন্দ্রীয় অ্যাডমিন ড্যাশবোর্ড।",
    },
    {
      icon: Calendar,
      color: "emerald",
      title: "ব্যাচ সিট ক্যাপাসিটি ও ক্লাসরুটিন",
      desc: "শ্রেণিভিত্তিক ব্যাচ তৈরি, সর্বোচ্চ আসন সংখ্যা সীমা (যেমন: ৪০ জন) নির্ধারণ, বিষয়ভিত্তিক শিক্ষক অ্যাসাইন এবং সাপ্তাহিক রুটিন সমন্বয়।",
    },
    {
      icon: CheckCircle2,
      color: "teal",
      title: "ডিজিটাল উপস্থিতি ও পার্সেন্টেজ",
      desc: "এক ক্লিকে সম্পূর্ণ ব্যাচের উপস্থিতি গ্রহণ। অনুপস্থিতির জন্য স্বয়ংক্রিয় তালিকা ও উপস্থিতি অনুযায়ী মাসিক পার্সেন্টেজ এনালিটিক্স।",
    },
    {
      icon: Award,
      color: "purple",
      title: "পরীক্ষার অটো-গ্রেডিং ও মেরিট লিস্ট",
      desc: "লিখিত ও এমসিকিউ পরীক্ষার নম্বর এন্ট্রি করলে স্বয়ংক্রিয় জিপিএ, লেটার গ্রেড এবং পুরো ব্যাচের ১ম, ২য়, ৩য় মেধা তালিকা প্রকাশ।",
    },
    {
      icon: CreditCard,
      color: "amber",
      title: "ফি কালেকশন ও ২-পার্ট রসিদ প্রিন্ট",
      desc: "মাসিক টিউশন ফি ডিউ তৈরি, স্কলারশিপ ছাড় হিসাব, নগদ/বিকাশ পেমেন্ট রেকর্ড এবং অফিস ও স্টুডেন্ট কপিযুক্ত মানি রিসিট প্রিন্ট।",
    },
    {
      icon: MessageSquare,
      color: "rose",
      title: "রিয়েল-টাইম লাইভ চ্যাট মেসেঞ্জার",
      desc: "সিস্টেমের ভেতরেই শিক্ষক ও শিক্ষার্থীর সরাসরি প্রশ্নোত্তর, মেসেজ সিন ডাবল-টিক (✓✓) ও জরুরি নোটিফিকেশন অ্যালার্ট।",
    },
    {
      icon: Sliders,
      color: "sky",
      title: "এডুকোচ সেন্ট্রাল ক্লাউড কন্ট্রোল",
      desc: "মাস্টার প্ল্যাটফর্ম থেকে লাইসেন্স পর্যবেক্ষণ, মেইনটেন্যান্স নিয়ন্ত্রণ ও সার্বক্ষণিক ক্লাউড আপটাইম নিশ্চয়তা।",
    },
  ];

  const currentMod = portfolioModules[activeTab];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 w-full max-w-full overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-24 pb-28 border-b border-slate-800/80">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>EduCoach Master — All-in-One Coaching SaaS Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              আপনার কোচিং সেন্টারের জন্য{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                আধুনিক ওয়েবসাইট ও সফটওয়্যার
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              পাবলিক ওয়েবসাইট, শিক্ষার্থী ও শিক্ষক পোর্টাল, ডিজিটাল হাজিরা, পরীক্ষার ফলাফল, মাসিক ফি কালেকশন ও মেসেঞ্জার—সবকিছুই পাবেন আপনার নিজস্ব ব্র্যান্ড ও সম্পূর্ণ স্বাধীন ক্লাউড ডেটাবেজে। বর্তমানে আমাদের <strong>ফ্রি MVP প্যাকেজে</strong> যুক্ত হতে এখনই রেজিস্ট্রেশন করুন।
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl shadow-xl shadow-blue-500/25 transition-all hover:-translate-y-0.5"
              >
                <span>কোচিং ওয়েবসাইটের আবেদন করুন (ফ্রি MVP)</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#portfolio"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-2xl transition-all"
              >
                <span>সিস্টেমের সুবিধা ও পোর্টফোলিও দেখুন</span>
              </a>
            </div>

            {/* MVP Core Highlights Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-12 border-t border-slate-800/80 max-w-4xl mx-auto text-left">
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-emerald-400">১০০% ফ্রি MVP</div>
                <div className="text-xs text-slate-300 font-medium mt-1">২০০ শিক্ষার্থী ও ১০ ব্যাচ অন্তর্ভুক্ত</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-blue-400">স্বতন্ত্র ডেটাবেজ</div>
                <div className="text-xs text-slate-300 font-medium mt-1">সম্পূর্ণ পৃথক ও এনক্রিপ্টেড ক্লাউড</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-sky-400">৩টি পোর্টাল</div>
                <div className="text-xs text-slate-300 font-medium mt-1">পাবলিক, শিক্ষার্থী ও শিক্ষক প্যানেল</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-purple-400">প্রস্তুত ক্লাউড</div>
                <div className="text-xs text-slate-300 font-medium mt-1">উচ্চগতির সার্বক্ষণিক হোস্টিং সেবা</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive System Portfolio Showcase */}
      <section id="portfolio" className="py-24 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full inline-block">
              কোচিং ম্যানেজমেন্ট সিস্টেম পোর্টফোলিও
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mt-4">
              আপনার সেন্টারে যেসব মডিউল ও সুবিধা থাকবে
            </h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
              এডুকোচ প্ল্যাটফর্মে রেজিস্ট্রেশন করলে আপনার কোচিং সেন্টার পাবে একটি স্বয়ংসম্পূর্ণ আধুনিক ওয়েবসাইট ও ম্যানেজমেন্ট সফটওয়্যার। নিচের মডিউলগুলোতে ক্লিক করে কার্যপদ্ধতি পরখ করুন:
            </p>
          </div>

          {/* Module Selector Tabs - Compact, Centered Segmented Control */}
          <div className="flex justify-center mb-10 px-2">
            <div className="inline-flex items-center p-1 sm:p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md gap-1 sm:gap-1.5 flex-wrap justify-center max-w-full">
              {portfolioModules.map((mod, index) => {
                const Icon = mod.icon;
                const isSelected = activeTab === index;
                return (
                  <button
                    key={mod.id}
                    onClick={() => setActiveTab(index)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-400"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-white" : "text-slate-400"}`} />
                    <span className="leading-none">{mod.tabLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Feature Display Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Feature Description */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 border border-blue-800/80 px-3 py-1 rounded-full">
                    {currentMod.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mt-3">
                    {currentMod.content.headline}
                  </h3>
                  <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                    {currentMod.content.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    প্রধান সুবিধাসমূহ:
                  </h4>
                  <ul className="space-y-2.5">
                    {currentMod.content.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
                  >
                    <span>এই সিস্টেমটির জন্য আবেদন করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <span className="text-xs text-slate-400">
                    • সম্পূর্ণ ফ্রি MVP প্যাকেজে
                  </span>
                </div>
              </div>

              {/* Right Column: Visual Simulated UI Mockup Preview */}
              <div className="lg:col-span-6">
                <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-inner relative overflow-hidden">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                      <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                      <span className="ml-2 font-mono text-xs text-slate-500">
                        portal.yourcoaching.com
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                      Live Preview Mockup
                    </span>
                  </div>

                  {/* Render Visual Mockup Based on Tab */}
                  {currentMod.id === "website" && (
                    <div className="space-y-4 text-xs">
                      <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 p-4 rounded-xl border border-blue-800/40">
                        <div className="text-lg font-black text-white">আপনার কোচিং সেন্টার</div>
                        <p className="text-[11px] text-blue-200 mt-1">সেরা শিক্ষক ও আধুনিক ডিজিটাল পাঠদান পদ্ধতি</p>
                        <div className="mt-3 flex gap-2">
                          <span className="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg text-[10px]">অনলাইন ভর্তি ফর্ম</span>
                          <span className="px-3 py-1 bg-slate-800 text-slate-300 font-bold rounded-lg text-[10px]">কোর্স তালিকা</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                          <span className="text-slate-400 font-bold block mb-1">📢 নোটিশবোর্ড</span>
                          <p className="text-[11px] text-slate-300">আগামীকাল থেকে নতুন ব্যাচের ক্লাস শুরু হবে।</p>
                        </div>
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                          <span className="text-slate-400 font-bold block mb-1">📞 জরুরি যোগাযোগ</span>
                          <p className="text-[11px] text-slate-300">হোয়াটসঅ্যাপ: +880 1700-000000</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentMod.id === "student-portal" && (
                    <div className="space-y-3.5 text-xs">
                      <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center font-bold text-blue-400 text-sm">
                            তা
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">তানভীর আহমেদ</div>
                            <div className="font-mono text-[10px] text-slate-400">আইডি: STU-2026-0042 • শ্রেণি: ১০ম</div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold text-[10px] rounded">নিয়মিত</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                          <div className="text-[11px] text-slate-400 font-medium">মাসিক উপস্থিতি</div>
                          <div className="text-lg font-black text-emerald-400 mt-0.5">৯৬.৫%</div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[96.5%]"></div>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                          <div className="text-[11px] text-slate-400 font-medium">সর্বশেষ জিপিএ</div>
                          <div className="text-lg font-black text-blue-400 mt-0.5">৫.০০ (A+)</div>
                          <div className="text-[10px] text-slate-400 mt-1">মেধা স্থান: ১ম (Rank #1)</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentMod.id === "attendance" && (
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px]">
                        <span className="font-bold text-slate-300">ব্যাচ: বিজ্ঞান শাখা (সন্ধ্যা)</span>
                        <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded font-mono font-bold">তারিখ: আজকের ক্লাস</span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between p-2 bg-slate-900/80 rounded-lg border border-slate-800/80">
                          <span className="font-semibold text-slate-200">১. তানভীর আহমেদ (STU-001)</span>
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold text-[10px] rounded">উপস্থিত</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-900/80 rounded-lg border border-slate-800/80">
                          <span className="font-semibold text-slate-200">২. সাদিয়া আক্তার (STU-002)</span>
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold text-[10px] rounded">উপস্থিত</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-900/80 rounded-lg border border-slate-800/80">
                          <span className="font-semibold text-slate-200">৩. রাফসান মাহমুদ (STU-003)</span>
                          <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 font-bold text-[10px] rounded">অনুপস্থিত (SMS Sent)</span>
                        </div>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                        <span>মোট শিক্ষার্থী: ৩০ জন</span>
                        <span className="font-bold text-emerald-400">উপস্থিত: ২৯ জন (৯৬.৬%)</span>
                      </div>
                    </div>
                  )}

                  {currentMod.id === "exams" && (
                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="flex items-center justify-between text-[11px] mb-2 font-bold text-slate-300">
                          <span>১ম সাময়িক মডেল টেস্ট ২০২৬</span>
                          <span className="text-amber-400">ব্যাচ মেধা স্থান: ১ম</span>
                        </div>
                        <div className="space-y-1 text-[11px]">
                          <div className="flex justify-between text-slate-400">
                            <span>পদার্থবিজ্ঞান (১০০)</span>
                            <span className="font-bold text-white">৯২ (A+)</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>রসায়ন (১০০)</span>
                            <span className="font-bold text-white">৮৯ (A+)</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>উচ্চতর গণিত (১০০)</span>
                            <span className="font-bold text-white">৯৫ (A+)</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between font-bold text-xs text-emerald-400">
                          <span>চূড়ান্ত ফলাফল:</span>
                          <span>GPA 5.00 (A+)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentMod.id === "fees" && (
                    <div className="space-y-3 text-xs font-mono">
                      <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800 text-[11px]">
                          <span className="font-bold text-white">মানি রিসিট (Voucher #INV-2026-089)</span>
                          <span className="text-emerald-400 font-bold">[পরিশোধিত]</span>
                        </div>
                        <div className="space-y-1 text-[11px] text-slate-300">
                          <div className="flex justify-between">
                            <span>শিক্ষার্থী: তানভীর আহমেদ</span>
                            <span>ব্যাচ: বিজ্ঞান</span>
                          </div>
                          <div className="flex justify-between">
                            <span>মাসিক টিউশন ফি:</span>
                            <span>৳২,৫০০</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>মেধা বৃত্তি ওয়েভার:</span>
                            <span>- ৳৫০০</span>
                          </div>
                          <div className="flex justify-between font-bold text-white pt-1 border-t border-slate-800">
                            <span>পরিশোধিত পরিমাণ:</span>
                            <span className="text-emerald-400">৳২,০০০ (bKash)</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-slate-500 font-sans">
                          * অফিস কপি ও শিক্ষার্থী কপি উভয়ই এক ক্লিকে প্রিন্ট করা যায়
                        </span>
                      </div>
                    </div>
                  )}

                  {currentMod.id === "messenger" && (
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-[10px]">
                          শি
                        </div>
                        <div>
                          <div className="font-bold text-white text-[11px]">বিষয় শিক্ষক: মো. আসাদুল করিম</div>
                          <div className="text-[9px] text-emerald-400">● সক্রিয় আছেন (Online)</div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1 font-sans text-[11px]">
                        <div className="bg-slate-900 p-2.5 rounded-xl rounded-tl-none border border-slate-800 max-w-[85%] text-slate-200">
                          আজকের ফিজিক্স ক্লাসের ৪ নং চ্যাপ্টারের নোটস শিক্ষার্থী পোর্টালে আপলোড করা হয়েছে।
                        </div>
                        <div className="bg-blue-600/30 border border-blue-500/40 p-2.5 rounded-xl rounded-tr-none max-w-[85%] ml-auto text-blue-100">
                          ধন্যবাদ স্যার, আমি ডাউনলোড করে নিয়েছি। <span className="text-blue-300 text-[10px]">✓✓</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Capabilities Section */}
      <section id="modules" className="py-24 bg-slate-900 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
              পূর্ণাঙ্গ সক্ষমতা ও প্রযুক্তি
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3">
              একটি আধুনিক কোচিং সিস্টেমের সকল উপাদান
            </h2>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              প্রতিটি ক্লায়েন্ট ওয়েবসাইট আমাদের প্ল্যাটফর্মের সমন্বিত মডিউল ও নিরাপত্তা নির্দেশিকা মেনে স্বয়ংক্রিয়ভাবে তৈরি হয়।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allCapabilities.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-950 rounded-3xl p-6 border border-slate-800/80 hover:border-blue-500/40 hover:-translate-y-1 transition-all flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section id="pricing" className="py-24 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              সহজ ও উন্মুক্ত সাবস্ক্রিপশন
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3">
              বর্তমানে সবার জন্য সম্পূর্ণ ফ্রি MVP
            </h2>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              যেকোনো নতুন কোচিং সেন্টারকে কোনো অগ্রিম ফি ছাড়া ফ্রি প্যাকেজে অন্তর্ভুক্ত করে সাইট চালু করা হচ্ছে।
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {/* Free MVP Tier Card */}
            <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-8 border-2 border-blue-500 shadow-2xl flex flex-col justify-between">
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                বর্তমানে সক্রিয় (Active MVP)
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  সবার জন্য উন্মুক্ত
                </span>
                <h3 className="text-2xl font-black text-white mt-1">ফ্রি MVP প্যাকেজ</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  যেকোনো নতুন কোচিং সেন্টারের জন্য সবকটি কোর ফিচারসহ সম্পূর্ণ ফ্রি টিয়ার।
                </p>

                <div className="mt-6 mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white">৳০</span>
                    <span className="text-slate-400 text-sm font-semibold">/আজীবন (MVP)</span>
                  </div>
                  <span className="inline-block mt-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                    কোনো ক্রেডিট কার্ড বা অগ্রিম ফি প্রয়োজন নেই
                  </span>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-800 text-xs sm:text-sm">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    অন্তর্ভুক্ত কোটা ও সুবিধাসমূহ:
                  </div>

                  <div className="flex items-center gap-2.5 font-bold text-white">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>সর্বোচ্চ ২০০ শিক্ষার্থী নিবন্ধন</span>
                  </div>

                  <div className="flex items-center gap-2.5 font-bold text-white">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>সর্বোচ্চ ১০টি সক্রিয় ব্যাচ</span>
                  </div>

                  <div className="flex items-center gap-2.5 font-bold text-white">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>সর্বোচ্চ ১৫ জন শিক্ষক অ্যাকাউন্ট</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>১০০% আলাদা ক্লাউড ডেটাবেজ</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>পাবলিক ওয়েবসাইট + শিক্ষার্থী/শিক্ষক পোর্টাল</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>ডিজিটাল হাজিরা ও স্বয়ংক্রিয় রেজাল্ট শিট</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>এডুকোচ উচ্চগতির ক্লাউড হোস্টিং</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Link
                  href="/register"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-blue-500/25 transition-all"
                >
                  <span>ফ্রি প্যাকেজে রেজিস্ট্রেশন করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Standard Growth (Planned) */}
            <div className="bg-slate-900/60 rounded-3xl p-8 border border-slate-800 flex flex-col justify-between opacity-80">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                  পরিকল্পিত (Planned Future Tier)
                </span>
                <h3 className="text-2xl font-black text-white mt-2">স্ট্যান্ডার্ড গ্রোথ</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  মাঝারি আকারের এবং দ্রুত বর্ধনশীল কোচিং সেন্টারের জন্য অতিরিক্ত ক্যাপাসিটি ও এসএমএস নোটিফিকেশন।
                </p>

                <div className="mt-6 mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">৳২,৯৯৯</span>
                    <span className="text-slate-400 text-sm font-semibold">/মাস (পরিকল্পিত)</span>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-800 text-xs sm:text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-500" />
                    <span>সর্বোচ্চ ৬০০ শিক্ষার্থী</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-500" />
                    <span>সর্বোচ্চ ৩০টি ব্যাচ ও ৩০ জন শিক্ষক</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-500" />
                    <span>স্বয়ংক্রিয় এসএমএস অ্যালার্ট ও নোটিফিকেশন</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-500" />
                    <span>কাস্টম ডোমেইন সংযোগ (coaching.com)</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  disabled
                  className="w-full py-3 text-xs font-bold text-slate-500 bg-slate-800/80 rounded-xl cursor-not-allowed"
                >
                  ভবিষ্যতে উন্মুক্ত হবে
                </button>
              </div>
            </div>

            {/* Institutional Pro (Planned) */}
            <div className="bg-slate-900/60 rounded-3xl p-8 border border-slate-800 flex flex-col justify-between opacity-80">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                  পরিকল্পিত (Planned Future Tier)
                </span>
                <h3 className="text-2xl font-black text-white mt-2">ইনস্টিটিউশনাল প্রো</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  একাধিক শাখা ও বড় একাডেমি প্রতিষ্ঠানের জন্য সমন্বিত ক্যাম্পাস ব্যবস্থাপনা ও প্রায়োরিটি সাপোর্ট।
                </p>

                <div className="mt-6 mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">৳৫,৯৯৯</span>
                    <span className="text-slate-400 text-sm font-semibold">/মাস (পরিকল্পিত)</span>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-800 text-xs sm:text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-500" />
                    <span>সর্বোচ্চ ২,০০০ শিক্ষার্থী ও ৮০টি ব্যাচ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-500" />
                    <span>সর্বোচ্চ ৫টি শাখা (Multi-Branch)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-500" />
                    <span>২৪/৭ ডেডিকেটেড ক্লাউড ব্যাকআপ ও প্রায়োরিটি সাপোর্ট</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  disabled
                  className="w-full py-3 text-xs font-bold text-slate-500 bg-slate-800/80 rounded-xl cursor-not-allowed"
                >
                  ভবিষ্যতে উন্মুক্ত হবে
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            আজই আপনার কোচিং সেন্টারকে ডিজিটাল করুন
          </h2>
          <p className="text-blue-100 text-base max-w-2xl mx-auto leading-relaxed">
            কোনো জটিলতা ছাড়াই মাত্র কয়েক মিনিটে রেজিস্ট্রেশন আবেদন করুন। আমাদের ফ্রি MVP প্যাকেজে যুক্ত হয়ে পেয়ে যান সম্পূর্ণ প্রস্তুত কোচিং ওয়েবসাইট।
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-blue-700 hover:bg-blue-50 font-black rounded-2xl shadow-xl transition-all"
            >
              ফ্রি ওয়েবসাইট রেজিস্ট্রেশন করুন →
            </Link>
            <Link
              href="/track"
              className="px-8 py-4 bg-blue-800/60 hover:bg-blue-800/80 border border-blue-400/30 text-white font-bold rounded-2xl transition-all"
            >
              আবেদনের স্ট্যাটাস দেখুন
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
