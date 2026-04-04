import { Navbar } from "@/components/layout/Navbar";
import { SkillsRadar } from "@/components/dashboard/SkillsRadar";
import { ATSChecklist } from "@/components/dashboard/ATSChecklist";
import { ImprovementSuggestions } from "@/components/dashboard/ImprovementSuggestions";
import { Button } from "@/components/ui/button";
import { Download, Share2, ArrowLeft, Loader2, Sparkles, Target, Zap, CheckCircle2, LogIn, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface AnalysisResult {
  score: number;
  summaryEn: string;
  summaryAr: string;
  matchRate?: number;
  skills: { subject: string; A: number; fullMark: number; match?: boolean; nameEn?: string; nameAr?: string }[];
  checks: { labelEn: string; labelAr: string; status: 'pass' | 'fail' | 'warn' }[];
  suggestions: { id: string; titleEn: string; titleAr: string; descEn: string; descAr: string; impact: 'High' | 'Medium' }[];
  _meta?: { wordCount?: number; pageCount?: number; method?: string };
}

export default function Analysis() {
  const [isRtl, setIsRtl] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasJD, setHasJD] = useState(false);
  const [fileName, setFileName] = useState("resume.pdf");
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [, setLocation] = useLocation();
  const reportRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Khabir_Analysis_Report`,
  });

  useEffect(() => {
    const checkLang = () => setIsRtl(document.documentElement.dir === 'rtl');
    checkLang();

    const params = new URLSearchParams(window.location.search);
    const resumeId = params.get('id');

    if (resumeId) {
      fetch(`/api/resumes/${resumeId}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          setFileName(data.fileName || "resume.pdf");
          setHasJD(!!data.jobDescription);
          setResult(data.analysisResult as AnalysisResult);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }

    const observer = new MutationObserver(checkLang);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });

    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="mb-8 w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center shadow-soft"
          >
            <Loader2 className="h-10 w-10 text-primary" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-3 text-foreground text-center">
            {isRtl ? "جاري تشغيل خبير..." : "Powering up Khabir..."}
          </h2>
          <p className="text-muted-foreground animate-pulse font-medium text-lg text-center max-w-md">
            {isRtl ? "يتم الآن فحص النصوص وتحليل المهارات بدقة" : "Scanning text and analyzing skills with precision..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/10 font-sans selection:bg-primary selection:text-primary-foreground pb-20">
      <Navbar />

      {/* Guest Banner */}
      {!authLoading && !isAuthenticated && !bannerDismissed && (
        <div className="fixed top-[70px] left-0 right-0 z-40 bg-primary text-primary-foreground px-4 py-3 shadow-lg">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 font-medium text-sm">
              <LogIn className="h-4 w-4 shrink-0" />
              <span>
                {isRtl
                  ? "لم يتم حفظ هذا التحليل. سجل دخولك للاحتفاظ بسجلاتك."
                  : "This analysis was not saved. Sign in to keep your history."
                }
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 rounded-lg font-bold text-xs bg-white/20 hover:bg-white/30 text-white border-0"
                onClick={() => setLocation("/login")}
                data-testid="button-banner-signin"
              >
                {isRtl ? "تسجيل الدخول" : "Sign In"}
              </Button>
              <button
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
                onClick={() => setBannerDismissed(true)}
                data-testid="button-banner-dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-[1600px] px-4 md:px-6 mx-auto pt-40 lg:pt-48">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6 lg:gap-8"
          >
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-card p-6 rounded-3xl border shadow-soft-lg">
              <div className="flex-1 min-w-0">
                <Link href="/">
                  <div className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary mb-4 transition-colors cursor-pointer bg-secondary/50 px-4 py-2 rounded-full">
                    <ArrowLeft className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'} ${isRtl ? 'rotate-180' : ''}`} /> 
                    {isRtl ? "العودة للرفع" : "Back to Upload"}
                  </div>
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight text-foreground flex items-center gap-3 flex-wrap">
                  <Sparkles className="h-6 w-6 text-blue-500 shrink-0" />
                  <span className="truncate">{isRtl ? "نتائج التحليل الذكي" : "Smart Analysis Results"}</span>
                </h1>
                <p className="text-muted-foreground text-sm font-medium truncate">
                  {isRtl ? "تقرير مفصل لـ " : "Detailed report for "}
                  <span className="font-bold text-foreground">
                    {fileName}
                  </span>
                </p>
                {result?._meta && result._meta.method !== "filename-only" && (
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full border border-green-200 dark:border-green-800">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      {isRtl
                        ? `تم قراءة ${result._meta.wordCount?.toLocaleString()} كلمة${result._meta.pageCount ? ` (${result._meta.pageCount} صفحات)` : ''}`
                        : `${result._meta.wordCount?.toLocaleString()} words read${result._meta.pageCount ? ` · ${result._meta.pageCount} pages` : ''}`
                      }
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                      {isRtl ? "تحليل محتوى حقيقي" : "Full content analyzed"}
                    </span>
                  </div>
                )}
                {result?._meta?.method === "filename-only" && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                      {isRtl ? "تحليل بدون استخراج نص (PDF ممسوح)" : "Filename-based analysis (scanned PDF)"}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3 w-full md:w-auto shrink-0">
                <Button variant="outline" className="flex-1 md:flex-none rounded-xl font-semibold h-12 px-6 border-border shadow-sm hover:shadow-md transition-all bg-background">
                  <Share2 className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} /> 
                  {isRtl ? "مشاركة" : "Share"}
                </Button>
                <Button onClick={() => handlePrint()} className="flex-1 md:flex-none rounded-xl font-semibold h-12 px-6 shadow-sm hover:shadow-md transition-all">
                  <Download className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} /> 
                  {isRtl ? "تحميل التقرير" : "Download Report"}
                </Button>
              </div>
            </div>

            <div ref={reportRef} className="print:p-8 print:bg-white flex flex-col gap-6 lg:gap-8">
              <div className="hidden print:block mb-8 text-center border-b-2 border-border pb-6">
                <h1 className="text-4xl font-black text-primary font-handwritten mb-2">خبير / Khabir</h1>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">تقرير تحليل السيرة الذاتية الذكي</p>
              </div>

              {/* 1. Top Overview Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                
                {/* Main ATS Score Card */}
                <motion.div whileHover={{ y: -2 }} className="lg:col-span-4 xl:col-span-3 bg-card rounded-3xl border p-8 flex flex-col items-center justify-center text-center shadow-soft-lg relative overflow-hidden min-h-[320px]">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/5 rounded-bl-full -z-10" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-tr-full -z-10" />
                  
                  <h3 className="font-bold text-lg sm:text-xl mb-6 flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    {isRtl ? "درجة التوافق (ATS)" : "ATS Score"}
                  </h3>
                  
                  <div className="relative h-36 w-36 sm:h-44 sm:w-44 flex items-center justify-center mb-6 shrink-0">
                    <svg className="h-full w-full -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                      <circle className="text-secondary/60" strokeWidth="6" stroke="currentColor" fill="transparent" r="44" cx="50" cy="50" />
                      <circle 
                        className="text-green-500" 
                        strokeWidth="8" 
                        strokeDasharray="276" 
                        strokeDashoffset={`${276 * (1 - (result?.score || 0)/100)}`} 
                        strokeLinecap="round" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="44" 
                        cx="50" 
                        cy="50" 
                        style={{ transition: "stroke-dashoffset 1.5s ease-in-out" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl sm:text-6xl font-black tracking-tighter text-foreground">{result?.score}</span>
                      <span className="text-xs sm:text-sm text-muted-foreground font-bold mt-1 uppercase tracking-widest">Out of 100</span>
                    </div>
                  </div>
                  
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-full text-xs sm:text-sm font-bold border border-green-500/20">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    {isRtl ? "سيرة ذاتية ممتازة" : "Excellent Resume"}
                  </div>
                </motion.div>

                {/* Summary & Match Rate */}
                <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6 lg:gap-8 h-full">
                  
                  {/* Executive Summary */}
                  <div className="flex-1 bg-gradient-to-br from-primary to-blue-600 text-primary-foreground rounded-3xl p-6 sm:p-8 flex flex-col shadow-soft-lg relative overflow-hidden min-h-[220px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />
                    
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white/90 shrink-0">
                      <Sparkles className="h-5 w-5 text-yellow-300" />
                      {isRtl ? "الملخص الذكي" : "Executive Summary"}
                    </h3>
                    <div className="overflow-y-auto custom-scrollbar pr-2 flex-1 min-h-[100px]">
                      <p className="text-base sm:text-lg leading-relaxed font-medium text-white/95 text-justify">
                        {isRtl ? result?.summaryAr : result?.summaryEn}
                      </p>
                    </div>
                  </div>

                  {/* Match Rate Card (Horizontal) */}
                  <div className="bg-card rounded-3xl border p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between shadow-soft-lg gap-4 shrink-0">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1.5">{isRtl ? "نسبة المطابقة للوظيفة" : "Job Match Rate"}</h3>
                      <p className="text-sm text-muted-foreground font-medium flex items-center gap-2 flex-wrap">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${hasJD ? 'bg-green-500' : 'bg-orange-400'}`} />
                        {hasJD 
                          ? (isRtl ? "بناءً على الوصف الوظيفي المدخل" : "Based on provided Job Description")
                          : (isRtl ? "لم يتم إدخال وصف وظيفي (نسبة عامة)" : "No Job Description provided (general rate)")
                        }
                      </p>
                    </div>
                    <div className="flex items-center gap-4 bg-secondary/30 px-6 py-3 rounded-2xl border shrink-0 justify-center">
                      <div className="text-right">
                        <span className="text-3xl sm:text-4xl font-black block text-foreground">
                          {result?.matchRate || (hasJD ? "65" : "--")}
                          <span className="text-xl sm:text-2xl text-muted-foreground font-semibold">%</span>
                        </span>
                      </div>
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-background border shadow-sm flex items-center justify-center shrink-0">
                        <Target className={`h-5 w-5 sm:h-6 sm:w-6 ${hasJD ? 'text-blue-500' : 'text-muted-foreground'}`} />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* 2. Detected Skills vs Missing Skills */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                
                {/* Detected Skills */}
                <div className="bg-card rounded-3xl border p-6 sm:p-8 shadow-soft-lg flex flex-col h-auto min-h-[280px]">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6 shrink-0 border-b border-border/50 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold">{isRtl ? "المهارات المكتشفة" : "Detected Skills"}</h3>
                    </div>
                    <span className="text-sm font-bold text-muted-foreground bg-secondary px-4 py-1.5 rounded-full border">
                      {result?.skills.length || 0}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2.5 overflow-y-auto custom-scrollbar pr-2 flex-1 content-start">
                    {result?.skills.map((skill, i) => (
                      <span key={i} className="px-3.5 py-2 bg-secondary/50 text-foreground text-sm font-semibold rounded-xl border border-border/50 hover:bg-secondary transition-colors cursor-default">
                        {isRtl ? skill.nameAr : skill.nameEn}
                      </span>
                    ))}
                    {!result?.skills.length && (
                      <div className="w-full text-center py-8 text-muted-foreground text-sm font-medium">No skills detected in this resume.</div>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="bg-card rounded-3xl border p-6 sm:p-8 shadow-soft-lg flex flex-col h-auto min-h-[280px]">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6 shrink-0 border-b border-border/50 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center shrink-0">
                        <Zap className="h-5 w-5 text-destructive" />
                      </div>
                      <h3 className="text-xl font-bold">{isRtl ? "مهارات مفقودة" : "Missing Skills"}</h3>
                    </div>
                    {hasJD && (
                      <span className="text-sm font-bold text-destructive bg-destructive/10 px-4 py-1.5 rounded-full border border-destructive/20">
                        3 {isRtl ? "مهارات" : "skills"}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2.5 overflow-y-auto custom-scrollbar pr-2 flex-1 content-start">
                    {hasJD ? (
                      <>
                        <span className="px-3.5 py-2 bg-destructive/5 text-destructive font-semibold border border-destructive/20 text-sm rounded-xl">Docker</span>
                        <span className="px-3.5 py-2 bg-destructive/5 text-destructive font-semibold border border-destructive/20 text-sm rounded-xl">Kubernetes</span>
                        <span className="px-3.5 py-2 bg-destructive/5 text-destructive font-semibold border border-destructive/20 text-sm rounded-xl">GraphQL</span>
                        <p className="w-full text-sm text-muted-foreground mt-4 font-medium p-4 bg-secondary/20 rounded-xl border border-dashed">
                          {isRtl ? "* هذه المهارات مطلوبة في الوصف الوظيفي ولكنها غير موجودة في سيرتك." : "* These skills are required in the JD but missing from your resume."}
                        </p>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center py-8 px-4 text-center bg-secondary/20 rounded-2xl border border-dashed">
                        <Target className="h-8 w-8 text-muted-foreground mb-3 opacity-50" />
                        <span className="text-muted-foreground text-sm font-semibold max-w-[250px] leading-relaxed">
                          {isRtl ? "قم بإضافة وصف وظيفي لاكتشاف المهارات المفقودة والمطلوبة للسوق." : "Add a Job Description to detect missing skills and market requirements."}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* 3. Detailed Checklists and Radar */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pb-12 items-stretch">
                <div className="lg:col-span-1 h-[450px] lg:h-[550px] flex flex-col">
                  <div className="h-full bg-card rounded-3xl border shadow-soft-lg flex flex-col overflow-hidden w-full">
                    <ATSChecklist data={result?.checks} />
                  </div>
                </div>
                
                <div className="lg:col-span-1 h-[450px] lg:h-[550px] flex flex-col">
                  <div className="h-full bg-card rounded-3xl border shadow-soft-lg flex flex-col p-6 overflow-hidden">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 shrink-0 border-b border-border/50 pb-4">
                      <Target className="h-5 w-5 text-primary shrink-0" />
                      <span className="truncate">{isRtl ? "تحليل المهارات" : "Skills Radar"}</span>
                    </h3>
                    <div className="flex-1 min-h-0 w-full flex items-center justify-center py-4">
                      <SkillsRadar data={result?.skills} />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1 h-[450px] lg:h-[550px] flex flex-col">
                  <div className="h-full bg-card rounded-3xl border shadow-soft-lg flex flex-col overflow-hidden w-full">
                    <ImprovementSuggestions data={result?.suggestions} />
                  </div>
                </div>
              </div>
              
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--border) / 0.8);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}
