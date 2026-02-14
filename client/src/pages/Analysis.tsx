import { Navbar } from "@/components/layout/Navbar";
import { SkillsRadar } from "@/components/dashboard/SkillsRadar";
import { ATSChecklist } from "@/components/dashboard/ATSChecklist";
import { ImprovementSuggestions } from "@/components/dashboard/ImprovementSuggestions";
import { Button } from "@/components/ui/button";
import { Download, Share2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Analysis() {
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'dir') {
          setIsRtl(document.documentElement.dir === 'rtl');
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    setIsRtl(document.documentElement.dir === 'rtl');
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-muted/20 font-sans">
      <Navbar />

      <main className="container px-4 mx-auto py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/">
              <a className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
                <ArrowLeft className={`h-4 w-4 ${isRtl ? 'ml-1' : 'mr-1'} ${isRtl ? 'rotate-180' : ''}`} /> 
                {isRtl ? "العودة للرفع" : "Back to Upload"}
              </a>
            </Link>
            <h1 className="text-3xl font-heading font-bold">
              {isRtl ? "نتائج التحليل" : "Analysis Results"}
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
            <Button size="sm">
              <Download className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} /> 
              {isRtl ? "تحميل التقرير" : "Download Report"}
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-1 bg-card rounded-2xl border p-6 flex flex-col items-center justify-center text-center shadow-sm"
          >
            <div className="relative h-32 w-32 flex items-center justify-center mb-4">
               <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                 <circle className="text-muted/30" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                 <circle className="text-primary" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="50.24" strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-4xl font-bold font-heading">78</span>
                 <span className="text-xs text-muted-foreground uppercase font-medium">
                   {isRtl ? "النتيجة" : "Score"}
                 </span>
               </div>
            </div>
            <h3 className="font-semibold text-lg mb-1">
              {isRtl ? "بداية جيدة" : "Good Start"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isRtl ? "أفضل 25٪ من المرشحين" : "Top 25% of candidates"}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-3 bg-card rounded-2xl border p-6 shadow-sm flex flex-col justify-center"
          >
             <h3 className="text-lg font-semibold mb-2">
               {isRtl ? "ملخص تنفيذي" : "Executive Summary"}
             </h3>
             <p className="text-muted-foreground leading-relaxed">
               {isRtl ? (
                 <>
                   تظهر سيرتك الذاتية خلفية تقنية قوية، خاصة في <strong className="text-foreground">تطوير الويب المتكامل</strong>. 
                   ومع ذلك، فهي تفتقر إلى إنجازات قابلة للقياس في دورك الأخير. 
                   التنسيق نظيف، ولكن قسم <strong className="text-foreground">المهارات</strong> يمكن تحسينه بشكل أفضل للكلمات المفتاحية المتعلقة بـ "القيادة".
                 </>
               ) : (
                 <>
                   Your resume demonstrates a strong technical background, particularly in <strong className="text-foreground">Full Stack Development</strong>. 
                   However, it lacks quantifiable achievements in your most recent role. 
                   The formatting is clean, but the <strong className="text-foreground">Skills</strong> section could be better optimized for ATS keywords related to "Leadership".
                 </>
               )}
             </p>
          </motion.div>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            <ATSChecklist />
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
               <h4 className="font-semibold text-primary mb-2">
                 {isRtl ? "نصيحة الخبراء" : "Pro Tip"}
               </h4>
               <p className="text-sm text-foreground/80">
                 {isRtl 
                   ? "يقضي مسؤولو التوظيف في المتوسط 7 ثوانٍ في مسح السيرة الذاتية. اجعل عناوينك بارزة وواضحة."
                   : "Recruiters spend an average of 7 seconds scanning a resume. Make your headings bold and clear."
                 }
               </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
             <SkillsRadar />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <ImprovementSuggestions />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
