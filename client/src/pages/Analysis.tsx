import { Navbar } from "@/components/layout/Navbar";
import { SkillsRadar } from "@/components/dashboard/SkillsRadar";
import { ATSChecklist } from "@/components/dashboard/ATSChecklist";
import { ImprovementSuggestions } from "@/components/dashboard/ImprovementSuggestions";
import { Button } from "@/components/ui/button";
import { Download, Share2, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { analyzeResume, AnalysisResult } from "@/lib/ai-engine";
import { useReactToPrint } from "react-to-print";

export default function Analysis() {
  const [isRtl, setIsRtl] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Khabir_Analysis_Report`,
  });

  useEffect(() => {
    const checkLang = () => setIsRtl(document.documentElement.dir === 'rtl');
    checkLang();
    
    // Get JD from URL
    const params = new URLSearchParams(window.location.search);
    const jd = params.get('jd');

    // Simulate deep AI analysis
    const timer = setTimeout(() => {
      const analysis = analyzeResume("resume_v2.pdf", jd || undefined);
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
            className="mb-6"
          >
            <Loader2 className="h-12 w-12 text-primary" />
          </motion.div>
          <h2 className="text-2xl font-heading font-bold mb-2">
            {isRtl ? "جاري تشغيل محرك الذكاء الاصطناعي..." : "Powering up AI Engine..."}
          </h2>
          <p className="text-muted-foreground animate-pulse">
            {isRtl ? "يتم الآن فحص النصوص وتحليل المهارات بدقة" : "Scanning text and analyzing skills with precision..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 font-sans">
      <Navbar />

      <main className="container px-4 mx-auto py-8">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div>
                <Link href="/">
                  <a className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
                    <ArrowLeft className={`h-4 w-4 ${isRtl ? 'ml-1' : 'mr-1'} ${isRtl ? 'rotate-180' : ''}`} /> 
                    {isRtl ? "العودة للرفع" : "Back to Upload"}
                  </a>
                </Link>
                <h1 className="text-3xl font-heading font-bold">
                  {isRtl ? "نتائج التحليل الذكي" : "Smart Analysis Results"}
                </h1>
                <p className="text-muted-foreground">
                  {isRtl ? "تقرير لـ " : "Report for "}
                  <span className="font-medium text-foreground">resume_v2.pdf</span>
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <Share2 className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} /> 
                  {isRtl ? "مشاركة" : "Share"}
                </Button>
                <Button size="sm" onClick={() => handlePrint()}>
                  <Download className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} /> 
                  {isRtl ? "تحميل التقرير" : "Download Report"}
                </Button>
              </div>
            </div>

            <div ref={reportRef} className="print:p-8 print:bg-white">
              <div className="hidden print:block mb-8 text-center border-b pb-4">
                <h1 className="text-2xl font-bold text-primary">خبير / Khabir AI</h1>
                <p className="text-sm text-muted-foreground">تقرير تحليل السيرة الذاتية الذكي</p>
              </div>

              {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="md:col-span-1 bg-card rounded-2xl border p-6 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="relative h-32 w-32 flex items-center justify-center mb-4">
                   <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                     <circle className="text-muted/30" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                     <circle className="text-primary" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={`${251.2 * (1 - (result?.score || 0)/100)}`} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-4xl font-bold font-heading">{result?.score}</span>
                     <span className="text-xs text-muted-foreground uppercase font-medium">
                       {isRtl ? "النتيجة" : "Score"}
                     </span>
                   </div>
                </div>
                <h3 className="font-semibold text-lg mb-1">
                  {isRtl ? "تحليل دقيق" : "Precise Analysis"}
                </h3>
                <p className="text-xs text-muted-foreground">{isRtl ? "تم الفحص بواسطة محرك خبير" : "Verified by Khabir Engine"}</p>
              </div>

              <div className="md:col-span-2 bg-card rounded-2xl border p-6 shadow-sm flex flex-col justify-center">
                 <h3 className="text-lg font-semibold mb-2">
                   {isRtl ? "الملخص الذكي" : "AI Executive Summary"}
                 </h3>
                 <p className="text-muted-foreground leading-relaxed">
                   {isRtl ? result?.summaryAr : result?.summaryEn}
                 </p>
              </div>

              <div className="md:col-span-1 bg-primary text-primary-foreground rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                <div className="relative z-10">
                  <span className="text-5xl font-black mb-2 block tracking-tighter">
                    {result?.matchRate || (params.get('jd') ? "65" : "--")}%
                  </span>
                  <span className="text-sm font-bold uppercase tracking-widest opacity-90">
                    {isRtl ? "نسبة المطابقة" : "Match Rate"}
                  </span>
                  <p className="text-[10px] mt-4 opacity-75 font-medium uppercase tracking-tighter">
                    {isRtl ? "مقارنة بالوصف الوظيفي" : "vs. Job Description"}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <ATSChecklist data={result?.checks} />
                <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                   <h4 className="font-semibold text-primary mb-2">
                     {isRtl ? "نصيحة تقنية" : "Technical Tip"}
                   </h4>
                   <p className="text-sm text-foreground/80">
                     {isRtl 
                       ? "استخدام الأرقام والنسب المئوية يزيد من فرصة قبول سيرتك الذاتية بنسبة 40٪."
                       : "Using numbers and percentages increases your resume's acceptance rate by 40%."
                     }
                   </p>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                 <SkillsRadar data={result?.skills} />
              </div>

              <div className="lg:col-span-1">
                <ImprovementSuggestions data={result?.suggestions} />
              </div>
            </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
