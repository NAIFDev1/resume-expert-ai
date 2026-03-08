import { Navbar } from "@/components/layout/Navbar";
import { SkillsRadar } from "@/components/dashboard/SkillsRadar";
import { ATSChecklist } from "@/components/dashboard/ATSChecklist";
import { ImprovementSuggestions } from "@/components/dashboard/ImprovementSuggestions";
import { Button } from "@/components/ui/button";
import { Download, Share2, ArrowLeft, Loader2, Sparkles, Target, Zap, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { analyzeResume, AnalysisResult } from "@/lib/ai-engine";
import { useReactToPrint } from "react-to-print";

export default function Analysis() {
  const [isRtl, setIsRtl] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasJD, setHasJD] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Khabir_Analysis_Report`,
  });

  useEffect(() => {
    const checkLang = () => setIsRtl(document.documentElement.dir === 'rtl');
    checkLang();
    
    // Get JD and FileName from URL
    const params = new URLSearchParams(window.location.search);
    const jd = params.get('jd');
    const fileName = params.get('name') || "resume.pdf";
    setHasJD(!!jd);

    // Simulate deep AI analysis
    const timer = setTimeout(() => {
      const analysis = analyzeResume(fileName, jd || undefined);
      // Ensure matchRate is set if JD exists even if it was undefined in mock
      if (jd && !analysis.matchRate) {
        analysis.matchRate = 72; // Default fallback for visual consistency
      }
      setResult(analysis);
      setIsLoading(false);
    }, 2000);

    const observer = new MutationObserver(checkLang);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="mb-8 w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center shadow-soft"
          >
            <Loader2 className="h-10 w-10 text-primary" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-3 text-foreground">
            {isRtl ? "جاري تشغيل خبير..." : "Powering up Khabir..."}
          </h2>
          <p className="text-muted-foreground animate-pulse font-medium text-lg">
            {isRtl ? "يتم الآن فحص النصوص وتحليل المهارات بدقة" : "Scanning text and analyzing skills with precision..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/20 font-sans selection:bg-primary selection:text-primary-foreground pb-20">
      <Navbar />

      <main className="max-w-7xl px-6 mx-auto pt-32">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 bg-background p-6 rounded-3xl border shadow-soft">
              <div>
                <Link href="/">
                  <div className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary mb-2 transition-colors cursor-pointer">
                    <ArrowLeft className={`h-4 w-4 ${isRtl ? 'ml-1.5' : 'mr-1.5'} ${isRtl ? 'rotate-180' : ''}`} /> 
                    {isRtl ? "العودة للرفع" : "Back to Upload"}
                  </div>
                </Link>
                <h1 className="text-3xl font-bold mb-1 tracking-tight text-foreground flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                  {isRtl ? "نتائج التحليل الذكي" : "Smart Analysis Results"}
                </h1>
                <p className="text-muted-foreground text-sm font-medium">
                  {isRtl ? "تقرير لـ " : "Report for "}
                  <span className="font-semibold text-foreground">
                    {new URLSearchParams(window.location.search).get('name') || "resume.pdf"}
                  </span>
                </p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <Button variant="outline" className="flex-1 md:flex-none rounded-full font-semibold h-11 px-6 bg-background shadow-sm hover:shadow-md transition-all">
                  <Share2 className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} /> 
                  {isRtl ? "مشاركة" : "Share"}
                </Button>
                <Button onClick={() => handlePrint()} className="flex-1 md:flex-none rounded-full font-semibold h-11 px-6 shadow-soft hover:shadow-soft-lg transition-all">
                  <Download className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} /> 
                  {isRtl ? "تحميل" : "Download"}
                </Button>
              </div>
            </div>

            <div ref={reportRef} className="print:p-8 print:bg-white space-y-8">
              <div className="hidden print:block mb-8 text-center border-b-2 border-border pb-6">
                <h1 className="text-4xl font-black text-primary font-handwritten mb-2">خبير / Khabir</h1>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">تقرير تحليل السيرة الذاتية الذكي</p>
              </div>

              {/* 1. Top Overview Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Main ATS Score Card */}
                <motion.div whileHover={{ y: -2 }} className="md:col-span-4 bg-card rounded-3xl border p-8 flex flex-col items-center justify-center text-center shadow-soft relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />
                  <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    {isRtl ? "درجة التوافق" : "ATS Score"}
                  </h3>
                  
                  <div className="relative h-40 w-40 flex items-center justify-center mb-6">
                    <svg className="h-full w-full -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                      <circle className="text-secondary" strokeWidth="8" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
                      <circle 
                        className="text-primary" 
                        strokeWidth="8" 
                        strokeDasharray="264" 
                        strokeDashoffset={`${264 * (1 - (result?.score || 0)/100)}`} 
                        strokeLinecap="round" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="42" 
                        cx="50" 
                        cy="50" 
                        style={{ transition: "stroke-dashoffset 1.5s ease-in-out" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-bold tracking-tighter text-foreground">{result?.score}</span>
                      <span className="text-sm text-muted-foreground font-semibold mt-1">/ 100</span>
                    </div>
                  </div>
                  
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    {isRtl ? "مستوى ممتاز" : "Excellent"}
                  </div>
                </motion.div>

                {/* Summary & Match Rate */}
                <div className="md:col-span-8 flex flex-col gap-6">
                  
                  {/* Executive Summary */}
                  <div className="flex-1 bg-primary text-primary-foreground rounded-3xl p-8 flex flex-col justify-center shadow-soft-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 opacity-90">
                      <Sparkles className="h-5 w-5" />
                      {isRtl ? "الملخص الذكي" : "Executive Summary"}
                    </h3>
                    <p className="text-lg leading-relaxed font-medium text-primary-foreground/90">
                      {isRtl ? result?.summaryAr : result?.summaryEn}
                    </p>
                  </div>

                  {/* Match Rate Card (Horizontal) */}
                  <div className="bg-card rounded-3xl border p-6 flex items-center justify-between shadow-soft">
                    <div>
                      <h3 className="text-lg font-bold mb-1">{isRtl ? "نسبة المطابقة للوظيفة" : "Job Match Rate"}</h3>
                      <p className="text-sm text-muted-foreground font-medium">
                        {hasJD 
                          ? (isRtl ? "بناءً على الوصف الوظيفي المدخل" : "Based on provided Job Description")
                          : (isRtl ? "لم يتم إدخال وصف وظيفي" : "No Job Description provided")
                        }
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-4xl font-bold block">{result?.matchRate || (hasJD ? "65" : "--")}<span className="text-xl text-muted-foreground">%</span></span>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                        <Target className={`h-6 w-6 ${hasJD ? 'text-blue-500' : 'text-muted-foreground'}`} />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* 2. Detected Skills vs Missing Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Detected Skills */}
                <div className="bg-card rounded-3xl border p-8 shadow-soft">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold">{isRtl ? "المهارات المكتشفة" : "Detected Skills"}</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {result?.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg border">
                        {isRtl ? skill.nameAr : skill.nameEn}
                      </span>
                    ))}
                    {!result?.skills.length && (
                      <span className="text-muted-foreground text-sm">No skills detected.</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills (Simulated based on JD) */}
                <div className="bg-card rounded-3xl border p-8 shadow-soft">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-destructive" />
                    </div>
                    <h3 className="text-xl font-bold">{isRtl ? "مهارات مفقودة" : "Missing Skills"}</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {hasJD ? (
                      <>
                        <span className="px-3 py-1.5 bg-destructive/5 text-destructive border border-destructive/20 text-sm font-medium rounded-lg">Docker</span>
                        <span className="px-3 py-1.5 bg-destructive/5 text-destructive border border-destructive/20 text-sm font-medium rounded-lg">Kubernetes</span>
                        <span className="px-3 py-1.5 bg-destructive/5 text-destructive border border-destructive/20 text-sm font-medium rounded-lg">GraphQL</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground text-sm font-medium">
                        {isRtl ? "قم بإضافة وصف وظيفي لاكتشاف المهارات المفقودة." : "Add a Job Description to detect missing skills."}
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* 3. Detailed Checklists and Radar */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 h-full">
                  <div className="h-full bg-card rounded-3xl border shadow-soft overflow-hidden">
                    <ATSChecklist data={result?.checks} />
                  </div>
                </div>
                
                <div className="lg:col-span-1 h-full">
                  <div className="h-full bg-card rounded-3xl border shadow-soft overflow-hidden">
                    <SkillsRadar data={result?.skills} />
                  </div>
                </div>

                <div className="lg:col-span-1 h-full">
                  <div className="h-full bg-card rounded-3xl border shadow-soft overflow-hidden">
                    <ImprovementSuggestions data={result?.suggestions} />
                  </div>
                </div>
              </div>
              
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
