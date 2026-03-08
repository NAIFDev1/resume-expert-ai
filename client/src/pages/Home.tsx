import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Sparkles, Target, Zap, Upload, 
  CheckCircle2, PlayCircle, BarChart, FileCheck,
  ArrowRight, Loader2, Layout, Languages
} from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  const [isRtl, setIsRtl] = useState(false);
  const [, setLocation] = useLocation();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkLang = () => setIsRtl(document.documentElement.dir === 'rtl');
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    return () => observer.disconnect();
  }, []);

  const handleUpload = useCallback((file: File) => {
    setSelectedFile(file);
    setUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const url = new URL(window.location.origin + '/analysis');
            if (jobDescription) url.searchParams.set('jd', jobDescription);
            url.searchParams.set('name', file.name);
            setLocation(url.pathname + url.search);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  }, [setLocation, jobDescription]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-foreground selection:text-background pb-32">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="pt-36 pb-20 px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[600px] bg-background rounded-full blur-3xl -z-10" />
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background text-foreground text-sm font-bold mb-8 border border-foreground">
              <Sparkles className="h-4 w-4" />
              <span>{isRtl ? "مستقبلك المهني يبدأ من هنا" : "Your career future starts here"}</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-heading font-bold leading-[1.2] mb-6">
              {isRtl ? "حلل سيرتك الذاتية وتجاوز أنظمة التوظيف" : "Analyze your resume and pass ATS systems"}
              <br />
              <span className="text-foreground">{isRtl ? "مع خبير" : "with Khabir"}</span>
            </h1>
            
            <p className="text-xl text-foreground leading-relaxed mb-10 max-w-lg">
              {isRtl 
                ? "احصل على تحليل فوري، اكتشف المهارات المفقودة، وحسّن سيرتك الذاتية لتطابق متطلبات الوظيفة بدقة."
                : "Get instant analysis, detect missing skills, and optimize your resume to match job descriptions perfectly."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 px-8 rounded-full text-base font-bold transition-all" onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth'})}>
                {isRtl ? "حلل سيرتك الآن" : "Upload Your Resume"}
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-base font-bold hover:bg-background transition-colors">
                <PlayCircle className={`h-5 w-5 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                {isRtl ? "كيف يعمل النظام؟" : "See How It Works"}
              </Button>
            </div>
            
            <p className="mt-8 text-sm text-foreground flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4" />
              {isRtl ? "يدعم PDF و Word • عربي وإنجليزي • تحليل فوري" : "Supports PDF & DOCX • Arabic & English • Instant analysis"}
            </p>
          </motion.div>
          
          {/* Mockup Right Side */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-card border shadow-xl rounded-[2rem] p-8 relative z-10">
              <div className="absolute top-0 left-0 w-full h-2 bg-foreground" />
              
              <div className="flex items-center justify-between mb-8 pb-6 border-b">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center border">
                    <FileText className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground font-heading">Naif_Resume_2026.pdf</h3>
                    <p className="text-sm text-foreground font-sans">Scanned 2 mins ago</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-background rounded-2xl p-5 border">
                  <p className="text-sm text-foreground mb-1 font-bold font-sans">ATS Score</p>
                  <p className="text-4xl font-bold text-foreground font-sans">82<span className="text-xl text-foreground">%</span></p>
                </div>
                <div className="bg-foreground text-background rounded-2xl p-5 border border-foreground">
                  <p className="text-sm mb-1 font-bold font-sans opacity-80">Job Match</p>
                  <p className="text-4xl font-bold font-sans">76<span className="text-xl opacity-50">%</span></p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-bold font-sans">Excellent structure and parsable text format</p>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-bold font-sans">Keywords detected: <span className="font-mono text-xs bg-background px-1.5 py-0.5 rounded border">React</span>, <span className="font-mono text-xs bg-background px-1.5 py-0.5 rounded border">Node.js</span></p>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-bold font-sans">Missing core skills: <span className="font-mono text-xs bg-background px-1.5 py-0.5 rounded border">Docker</span></p>
                </div>
              </div>
            </div>
            
            <div className="absolute -inset-0.5 bg-background rounded-[2rem] blur-xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* 2. TRUST BAR */}
      <section className="py-12 border-y bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 text-sm font-bold text-foreground font-sans uppercase tracking-widest">
            <span className="flex items-center gap-2"><Target className="h-4 w-4" /> ATS Optimized</span>
            <span className="flex items-center gap-2"><Languages className="h-4 w-4" /> Arabic & English</span>
            <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> AI Suggestions</span>
            <span className="flex items-center gap-2"><Layout className="h-4 w-4" /> Pro Templates</span>
          </div>
        </div>
      </section>

      {/* 3. UPLOAD SECTION */}
      <section id="upload-section" className="py-24 px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold mb-4">{isRtl ? "ابدأ التحليل الآن" : "Start Your Analysis"}</h2>
          <p className="text-lg text-foreground">{isRtl ? "ارفع سيرتك الذاتية وسنقوم بالباقي بدقة متناهية" : "Upload your resume and we'll handle the rest with precision"}</p>
        </div>
        
        <div className="bg-card border shadow-xl rounded-[2.5rem] p-8 md:p-12 transition-all">
          {!uploading && (
            <div className="mb-8" dir={isRtl ? "rtl" : "ltr"}>
              <label className="text-sm font-bold mb-3 block flex items-center gap-2">
                <Target className="h-4 w-4" />
                {isRtl ? "اختياري: الوصف الوظيفي للمطابقة (Job Description)" : "Optional: Job Description for matching"}
              </label>
              <Textarea 
                placeholder={isRtl ? "الصق الوصف الوظيفي هنا لمقارنة مدى تطابق سيرتك الذاتية..." : "Paste the job description here to check your match rate..."}
                className="min-h-[120px] rounded-2xl bg-background border resize-none focus:border-foreground transition-colors text-base p-4 font-sans"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          )}

          <div 
            className={`relative rounded-3xl border-2 border-dashed transition-all duration-300 p-12 text-center flex flex-col items-center justify-center min-h-[300px] bg-background
              ${dragActive ? "border-foreground bg-background scale-[1.02]" : "hover:border-foreground hover:bg-background"} 
              ${uploading ? "pointer-events-none border-foreground bg-background" : "cursor-pointer"}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleChange} />

            <AnimatePresence mode="wait">
              {uploading ? (
                <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-sm mx-auto">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6" />
                  <h3 className="text-xl font-bold mb-2">{isRtl ? "جاري تحليل المستند..." : "Analyzing Document..."}</h3>
                  <p className="text-sm text-foreground mb-8 truncate px-4 font-sans font-medium">{selectedFile?.name}</p>
                  <div className="space-y-3">
                    <Progress value={uploadProgress} className="h-2.5 rounded-full bg-background" />
                    <div className="flex justify-between text-xs font-bold text-foreground font-sans uppercase tracking-wider">
                      <span>{uploadProgress}%</span>
                      <span>{isRtl ? "فحص ATS" : "ATS Scanning"}</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="w-20 h-20 rounded-full bg-background shadow-sm border flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{isRtl ? "اسحب وأفلت السيرة الذاتية هنا" : "Drag and drop your resume here"}</h3>
                  <p className="text-foreground mb-8 font-sans font-medium">{isRtl ? "يدعم PDF, DOC, DOCX (الحد الأقصى 5MB)" : "Supports PDF, DOC, DOCX (Max 5MB)"}</p>
                  <Button size="lg" variant="outline" className="rounded-full px-8 font-bold h-12 bg-background">
                    {isRtl ? "أو اضغط لاختيار ملف" : "Or Click to Select File"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 4. DEMO RESULTS SECTION */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{isRtl ? "رؤى قابلة للتنفيذ" : "Actionable Insights"}</h2>
            <p className="text-lg text-foreground">{isRtl ? "اكتشف بالضبط ما يراه مديرو التوظيف وأنظمة ATS." : "Discover exactly what recruiters and ATS systems see."}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-[2rem] border shadow-sm flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center border mb-6">
                <span className="text-3xl font-bold font-sans">82<span className="text-lg">%</span></span>
              </div>
              <h3 className="text-xl font-bold mb-2">{isRtl ? "درجة التوافق (ATS Score)" : "ATS Score"}</h3>
              <p className="text-foreground text-sm font-sans font-medium leading-relaxed">{isRtl ? "تقييم شامل بناءً على التنسيق والوضوح والكلمات المفتاحية." : "Comprehensive evaluation based on format, clarity, and keywords."}</p>
            </div>
            
            <div className="bg-card p-8 rounded-[2rem] border shadow-sm flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center border mb-6">
                <span className="text-3xl font-bold font-sans">76<span className="text-lg">%</span></span>
              </div>
              <h3 className="text-xl font-bold mb-2">{isRtl ? "مطابقة الوظيفة (Job Match)" : "Job Match"}</h3>
              <p className="text-foreground text-sm font-sans font-medium leading-relaxed">{isRtl ? "مدى تطابق مهاراتك مع متطلبات الوصف الوظيفي المحدد." : "How well your skills align with the specific job description requirements."}</p>
            </div>

            <div className="bg-card p-8 rounded-[2rem] border shadow-sm flex flex-col">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                {isRtl ? "اقتراحات التحسين" : "AI Suggestions"}
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center border shrink-0 mt-0.5"><span className="text-xs font-bold font-sans">1</span></div>
                  <p className="text-sm font-bold font-sans">{isRtl ? "إضافة إنجازات قابلة للقياس (أرقام/نسب)" : "Add measurable achievements (numbers/metrics)"}</p>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center border shrink-0 mt-0.5"><span className="text-xs font-bold font-sans">2</span></div>
                  <p className="text-sm font-bold font-sans">{isRtl ? "استخدام أفعال حركة قوية في قسم الخبرة" : "Use stronger action verbs in experience section"}</p>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center border shrink-0 mt-0.5"><span className="text-xs font-bold font-sans">3</span></div>
                  <p className="text-sm font-bold font-sans">{isRtl ? "تضمين مهارات الحوسبة السحابية المفقودة" : "Include missing cloud computing skills"}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURES SECTION */}
      <section className="py-24 border-y">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{isRtl ? "كل ما تحتاجه للنجاح" : "Everything you need to succeed"}</h2>
            <p className="text-lg text-foreground">{isRtl ? "أدوات متقدمة صممت خصيصاً لتجاوز أنظمة التوظيف" : "Advanced tools specifically built to bypass hiring filters."}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<BarChart className="h-6 w-6" />}
              title={isRtl ? "تحليل دقيق" : "AI Analysis"}
              desc={isRtl ? "فحص شامل يماثل أنظمة ATS للشركات الكبرى." : "Comprehensive scanning matching Fortune 500 ATS logic."}
            />
            <FeatureCard 
              icon={<Target className="h-6 w-6" />}
              title={isRtl ? "مطابقة الوظيفة" : "Job Matching"}
              desc={isRtl ? "اكتشف فجوة المهارات بين سيرتك والوصف الوظيفي." : "Discover the skill gap between your CV and the JD."}
            />
            <FeatureCard 
              icon={<Sparkles className="h-6 w-6" />}
              title={isRtl ? "تحسين ذكي" : "Smart Rewrite"}
              desc={isRtl ? "إعادة صياغة قوية للملخص والخبرات بضغطة زر." : "Powerful rewriting of summaries and experiences instantly."}
            />
            <FeatureCard 
              icon={<Layout className="h-6 w-6" />}
              title={isRtl ? "محرر متكامل" : "Built-in Editor"}
              desc={isRtl ? "عدل، حسن، واستخرج سيرتك كملف PDF فوري." : "Edit, optimize, and export your CV as a clean PDF."}
            />
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS SECTION */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold">{isRtl ? "كيف يعمل خبير؟" : "How It Works"}</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border -z-10" />
            
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-card shadow-sm flex items-center justify-center mb-6 text-2xl font-bold font-sans">1</div>
              <h3 className="text-xl font-bold mb-3">{isRtl ? "ارفع سيرتك الذاتية" : "Upload your resume"}</h3>
              <p className="text-foreground font-sans font-medium">{isRtl ? "قم برفع ملفك بصيغة PDF أو Word بأمان تام." : "Securely upload your current PDF or Word document."}</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-foreground border-4 border-background shadow-sm flex items-center justify-center mb-6 text-2xl font-bold font-sans text-background">2</div>
              <h3 className="text-xl font-bold mb-3">{isRtl ? "احصل على التحليل الذكي" : "Get AI analysis"}</h3>
              <p className="text-foreground font-sans font-medium">{isRtl ? "نظامنا يفحص الكلمات المفتاحية والهيكلية في ثوانٍ." : "Our system scans for keywords and structure in seconds."}</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-card shadow-sm flex items-center justify-center mb-6 text-2xl font-bold font-sans">3</div>
              <h3 className="text-xl font-bold mb-3">{isRtl ? "حسن وحمل" : "Improve and download"}</h3>
              <p className="text-foreground font-sans font-medium">{isRtl ? "طبق التوصيات وحمل النسخة الاحترافية الجاهزة للتقديم." : "Apply recommendations and download the optimized version."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TEMPLATES PREVIEW */}
      <section className="py-24 border-y">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{isRtl ? "قوالب احترافية معتمدة" : "Professional Templates"}</h2>
              <p className="text-lg text-foreground">{isRtl ? "مصممة خصيصاً لتجاوز الفلاتر الآلية" : "Specifically designed to pass automated filters."}</p>
            </div>
            <Button variant="outline" className="rounded-full font-bold" asChild>
              <Link href="/templates">{isRtl ? "عرض كل القوالب" : "View All Templates"}</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TemplateCard 
              name={isRtl ? "الكلاسيكي" : "Classic"} 
              desc={isRtl ? "مثالي للقطاعات الرسمية والشركات." : "Perfect for corporate and traditional roles."}
            />
            <TemplateCard 
              name={isRtl ? "العصري" : "Modern"} 
              desc={isRtl ? "تصميم أنيق للأدوار التقنية والإبداعية." : "Sleek design for tech and creative roles."}
            />
            <TemplateCard 
              name={isRtl ? "البسيط" : "Minimal"} 
              desc={isRtl ? "نظيف ومباشر يركز على المحتوى." : "Clean and direct, focusing entirely on content."}
            />
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-foreground text-background border shadow-xl rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-background rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
              {isRtl ? "طور سيرتك الذاتية في دقائق" : "Improve your resume in minutes"}
            </h2>
            <p className="text-xl text-background mb-10 max-w-2xl mx-auto font-sans font-medium">
              {isRtl 
                ? "احصل على تحليل فوري، واقتراحات ذكية، وقوالب احترافية تبدأ بها مسيرتك المهنية."
                : "Get instant analysis, smart suggestions, and professional templates."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-14 px-10 rounded-full text-base font-bold bg-background text-foreground hover:bg-background" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                {isRtl ? "حلل سيرتك الآن" : "Upload Resume"}
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-full text-base font-bold border-background hover:bg-background text-background" asChild>
                <Link href="/templates">{isRtl ? "استكشف النماذج" : "Explore Templates"}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="border-t pt-16 pb-8 px-6 lg:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center text-background font-bold text-lg">خ</div>
                <span className="font-heading font-bold text-2xl">خبير</span>
              </div>
              <p className="text-foreground max-w-sm font-sans font-medium">
                {isRtl ? "المحرك الذكي الأول لتحليل وتحسين السير الذاتية باللغتين العربية والإنجليزية." : "The premier AI engine for analyzing and optimizing resumes in Arabic and English."}
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-sans uppercase tracking-widest">{isRtl ? "الروابط" : "Links"}</h4>
              <ul className="space-y-3 text-foreground text-sm font-bold font-sans">
                <li><Link href="/"><a className="hover:text-foreground transition-colors">{isRtl ? "الرئيسية" : "Home"}</a></Link></li>
                <li><Link href="/templates"><a className="hover:text-foreground transition-colors">{isRtl ? "النماذج" : "Templates"}</a></Link></li>
                <li><Link href="/faq"><a className="hover:text-foreground transition-colors">{isRtl ? "الأسئلة الشائعة" : "FAQ"}</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-sans uppercase tracking-widest">{isRtl ? "قانوني" : "Legal"}</h4>
              <ul className="space-y-3 text-foreground text-sm font-bold font-sans">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-foreground font-bold font-sans">
            <p>© {new Date().getFullYear()} Khabir</p>
            <p>Designed with <span>♥</span> for professionals</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="bg-card p-8 rounded-[2rem] border hover:shadow-xl transition-all duration-300 group">
      <div className="w-14 h-14 rounded-2xl bg-background border flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-foreground font-sans font-medium leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

function TemplateCard({ name, desc }: any) {
  return (
    <div className="bg-card rounded-[2rem] border overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="h-48 bg-background flex items-center justify-center p-6 border-b transition-colors">
        <div className="w-32 h-40 bg-background shadow-md rounded border flex flex-col p-3 gap-2">
          <div className="w-1/2 h-2 bg-foreground rounded-full" />
          <div className="w-3/4 h-2 bg-foreground rounded-full mb-2" />
          <div className="w-full h-1.5 bg-foreground rounded-full" />
          <div className="w-full h-1.5 bg-foreground rounded-full" />
          <div className="w-4/5 h-1.5 bg-foreground rounded-full" />
        </div>
      </div>
      <div className="p-8 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2 font-heading">{name}</h3>
        <p className="text-foreground text-sm mb-6 flex-1 font-sans font-medium">{desc}</p>
        <Button variant="outline" className="w-full rounded-xl font-bold" asChild>
          <Link href="/templates">Use Template</Link>
        </Button>
      </div>
    </div>
  );
}
