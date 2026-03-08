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
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 pb-32">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="pt-36 pb-20 px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-8 border shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>{isRtl ? "مستقبلك المهني يبدأ من هنا" : "Your career future starts here"}</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-heading font-black tracking-tight leading-[1.1] mb-6">
              {isRtl ? "حلل سيرتك الذاتية وتجاوز " : "Analyze your resume and pass "}
              <span className="text-primary">{isRtl ? "أنظمة ATS" : "ATS systems"}</span>
              <br />
              {isRtl ? "مع خبير AI" : "with Khabir AI"}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg">
              {isRtl 
                ? "احصل على تحليل فوري، اكتشف المهارات المفقودة، وحسّن سيرتك الذاتية لتطابق متطلبات الوظيفة بدقة باستخدام الذكاء الاصطناعي."
                : "Get instant analysis, detect missing skills, and optimize your resume to match job descriptions perfectly using advanced AI."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 px-8 rounded-full text-base font-semibold shadow-lg hover:shadow-xl transition-all" onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth'})}>
                {isRtl ? "حلل سيرتك الآن" : "Upload Your Resume"}
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-base font-semibold bg-background border-border hover:bg-secondary transition-colors">
                <PlayCircle className={`h-5 w-5 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                {isRtl ? "كيف يعمل النظام؟" : "See How It Works"}
              </Button>
            </div>
            
            <p className="mt-6 text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
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
            <div className="bg-card border shadow-2xl rounded-[2rem] p-8 relative z-10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
              
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground font-heading">Naif_Resume_2026.pdf</h3>
                    <p className="text-sm text-muted-foreground">Scanned 2 mins ago</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-secondary/50 rounded-2xl p-5 border border-border/50">
                  <p className="text-sm text-muted-foreground mb-1 font-medium">ATS Score</p>
                  <p className="text-4xl font-black text-foreground font-heading">82<span className="text-xl text-muted-foreground">%</span></p>
                </div>
                <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
                  <p className="text-sm text-primary mb-1 font-medium">Job Match</p>
                  <p className="text-4xl font-black text-primary font-heading">76<span className="text-xl opacity-50">%</span></p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80 font-medium">Excellent structure and parsable text format</p>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80 font-medium">Keywords detected: <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">React</span>, <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">Node.js</span></p>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80 font-medium">Missing core skills: <span className="font-mono text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded">Docker</span></p>
                </div>
              </div>
            </div>
            
            {/* Decorative background elements */}
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-primary/10 to-transparent rounded-[2rem] blur-xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* 2. TRUST BAR */}
      <section className="py-12 border-y border-border bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 text-sm font-bold text-muted-foreground uppercase tracking-widest">
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
          <h2 className="text-4xl font-heading font-black mb-4 tracking-tight">{isRtl ? "ابدأ التحليل الآن" : "Start Your Analysis"}</h2>
          <p className="text-lg text-muted-foreground">{isRtl ? "ارفع سيرتك الذاتية وسنقوم بالباقي بدقة متناهية" : "Upload your resume and we'll handle the rest with precision"}</p>
        </div>
        
        <div className="bg-card border shadow-xl shadow-primary/5 rounded-[2.5rem] p-8 md:p-12 transition-all hover:shadow-2xl hover:shadow-primary/5">
          {!uploading && (
            <div className="mb-8" dir={isRtl ? "rtl" : "ltr"}>
              <label className="text-sm font-bold mb-3 block text-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                {isRtl ? "اختياري: الوصف الوظيفي للمطابقة (Job Description)" : "Optional: Job Description for matching"}
              </label>
              <Textarea 
                placeholder={isRtl ? "الصق الوصف الوظيفي هنا لمقارنة مدى تطابق سيرتك الذاتية..." : "Paste the job description here to check your match rate..."}
                className="min-h-[120px] rounded-2xl bg-secondary/30 border-border resize-none focus:border-primary/50 transition-colors text-base p-4"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          )}

          <div 
            className={`relative rounded-3xl border-2 border-dashed transition-all duration-300 p-12 text-center flex flex-col items-center justify-center min-h-[300px] bg-secondary/20
              ${dragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/30 hover:bg-secondary/40"} 
              ${uploading ? "pointer-events-none border-transparent bg-secondary/10" : "cursor-pointer"}`}
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
                  <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-6" />
                  <h3 className="text-xl font-bold mb-2">{isRtl ? "جاري تحليل المستند..." : "Analyzing Document..."}</h3>
                  <p className="text-sm text-muted-foreground mb-8 truncate px-4 font-medium">{selectedFile?.name}</p>
                  <div className="space-y-3">
                    <Progress value={uploadProgress} className="h-2.5 rounded-full" />
                    <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      <span>{uploadProgress}%</span>
                      <span>{isRtl ? "فحص ATS" : "ATS Scanning"}</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="w-20 h-20 rounded-full bg-background shadow-sm border flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">{isRtl ? "اسحب وأفلت السيرة الذاتية هنا" : "Drag and drop your resume here"}</h3>
                  <p className="text-muted-foreground mb-8 font-medium">{isRtl ? "يدعم PDF, DOC, DOCX (الحد الأقصى 5MB)" : "Supports PDF, DOC, DOCX (Max 5MB)"}</p>
                  <Button size="lg" variant="secondary" className="rounded-full px-8 border shadow-sm font-bold h-12">
                    {isRtl ? "أو اضغط لاختيار ملف" : "Or Click to Select File"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 4. DEMO RESULTS SECTION */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-black mb-4 tracking-tight">{isRtl ? "رؤى قابلة للتنفيذ" : "Actionable Insights"}</h2>
            <p className="text-lg text-muted-foreground">{isRtl ? "اكتشف بالضبط ما يراه مديرو التوظيف وأنظمة ATS." : "Discover exactly what recruiters and ATS systems see."}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-[2rem] border shadow-sm flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="text-3xl font-black text-primary font-heading">82<span className="text-lg">%</span></span>
              </div>
              <h3 className="text-xl font-bold mb-2">{isRtl ? "درجة التوافق (ATS Score)" : "ATS Score"}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{isRtl ? "تقييم شامل بناءً على التنسيق والوضوح والكلمات المفتاحية." : "Comprehensive evaluation based on format, clarity, and keywords."}</p>
            </div>
            
            <div className="bg-card p-8 rounded-[2rem] border shadow-sm flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="text-3xl font-black text-primary font-heading">76<span className="text-lg">%</span></span>
              </div>
              <h3 className="text-xl font-bold mb-2">{isRtl ? "مطابقة الوظيفة (Job Match)" : "Job Match"}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{isRtl ? "مدى تطابق مهاراتك مع متطلبات الوصف الوظيفي المحدد." : "How well your skills align with the specific job description requirements."}</p>
            </div>

            <div className="bg-card p-8 rounded-[2rem] border shadow-sm flex flex-col">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {isRtl ? "اقتراحات الذكاء الاصطناعي" : "AI Suggestions"}
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs font-bold">1</span></div>
                  <p className="text-sm font-medium">{isRtl ? "إضافة إنجازات قابلة للقياس (أرقام/نسب)" : "Add measurable achievements (numbers/metrics)"}</p>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs font-bold">2</span></div>
                  <p className="text-sm font-medium">{isRtl ? "استخدام أفعال حركة قوية في قسم الخبرة" : "Use stronger action verbs in experience section"}</p>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs font-bold">3</span></div>
                  <p className="text-sm font-medium">{isRtl ? "تضمين مهارات الحوسبة السحابية المفقودة" : "Include missing cloud computing skills"}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURES SECTION */}
      <section className="py-24 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-black mb-4 tracking-tight">{isRtl ? "كل ما تحتاجه للنجاح" : "Everything you need to succeed"}</h2>
            <p className="text-lg text-muted-foreground">{isRtl ? "أدوات متقدمة صممت خصيصاً لتجاوز أنظمة التوظيف" : "Advanced tools specifically built to bypass hiring filters."}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<BarChart className="h-6 w-6 text-foreground" />}
              title={isRtl ? "تحليل دقيق" : "AI Analysis"}
              desc={isRtl ? "فحص شامل يماثل أنظمة ATS للشركات الكبرى." : "Comprehensive scanning matching Fortune 500 ATS logic."}
            />
            <FeatureCard 
              icon={<Target className="h-6 w-6 text-foreground" />}
              title={isRtl ? "مطابقة الوظيفة" : "Job Matching"}
              desc={isRtl ? "اكتشف فجوة المهارات بين سيرتك والوصف الوظيفي." : "Discover the skill gap between your CV and the JD."}
            />
            <FeatureCard 
              icon={<Sparkles className="h-6 w-6 text-foreground" />}
              title={isRtl ? "تحسين ذكي" : "Smart Rewrite"}
              desc={isRtl ? "إعادة صياغة قوية للملخص والخبرات بضغطة زر." : "Powerful rewriting of summaries and experiences instantly."}
            />
            <FeatureCard 
              icon={<Layout className="h-6 w-6 text-foreground" />}
              title={isRtl ? "محرر متكامل" : "Built-in Editor"}
              desc={isRtl ? "عدل، حسن، واستخرج سيرتك كملف PDF فوري." : "Edit, optimize, and export your CV as a clean PDF."}
            />
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS SECTION */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tight">{isRtl ? "كيف يعمل خبير؟" : "How It Works"}</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border -z-10" />
            
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-card shadow-sm flex items-center justify-center mb-6 text-2xl font-black font-heading">1</div>
              <h3 className="text-xl font-bold mb-3">{isRtl ? "ارفع سيرتك الذاتية" : "Upload your resume"}</h3>
              <p className="text-muted-foreground">{isRtl ? "قم برفع ملفك بصيغة PDF أو Word بأمان تام." : "Securely upload your current PDF or Word document."}</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-card shadow-sm flex items-center justify-center mb-6 text-2xl font-black font-heading text-primary border-primary/20">2</div>
              <h3 className="text-xl font-bold mb-3">{isRtl ? "احصل على التحليل الذكي" : "Get AI analysis"}</h3>
              <p className="text-muted-foreground">{isRtl ? "نظامنا يفحص الكلمات المفتاحية والهيكلية في ثوانٍ." : "Our system scans for keywords and structure in seconds."}</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-card shadow-sm flex items-center justify-center mb-6 text-2xl font-black font-heading">3</div>
              <h3 className="text-xl font-bold mb-3">{isRtl ? "حسن وحمل" : "Improve and download"}</h3>
              <p className="text-muted-foreground">{isRtl ? "طبق التوصيات وحمل النسخة الاحترافية الجاهزة للتقديم." : "Apply recommendations and download the optimized version."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TEMPLATES PREVIEW */}
      <section className="py-24 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tight mb-4">{isRtl ? "قوالب احترافية معتمدة" : "Professional Templates"}</h2>
              <p className="text-lg text-muted-foreground">{isRtl ? "مصممة خصيصاً لتجاوز الفلاتر الآلية" : "Specifically designed to pass automated filters."}</p>
            </div>
            <Button variant="outline" className="rounded-full" asChild>
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

      {/* 8. FAQ PREVIEW SECTION */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-black tracking-tight mb-4">{isRtl ? "أسئلة شائعة" : "Frequently Asked Questions"}</h2>
          </div>
          
          <div className="bg-card border rounded-[2rem] p-6 shadow-sm mb-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="hover:no-underline font-bold text-lg py-4">
                  {isRtl ? "ما هو نظام الـ ATS وكيف يعمل؟" : "What is an ATS and how does it work?"}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-base">
                  {isRtl 
                    ? "نظام ATS هو برنامج تستخدمه الشركات لفرز السير الذاتية آلياً بناءً على الكلمات المفتاحية والمهارات المحددة في الوصف الوظيفي قبل أن يراها إنسان." 
                    : "An ATS is software used by companies to sort resumes automatically based on keywords and skills defined in the job description before a human sees them."}
                </AccordionContent>
              </AccordionItem>
              <div className="h-px w-full bg-border my-2" />
              <AccordionItem value="item-2" className="border-b-0">
                <AccordionTrigger className="hover:no-underline font-bold text-lg py-4">
                  {isRtl ? "لماذا ترفض الشركات سيرتي الذاتية؟" : "Why do companies reject resumes?"}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-base">
                  {isRtl 
                    ? "غالباً بسبب عدم التوافق مع ATS (تنسيق معقد، صور، جداول) أو عدم وجود الكلمات المفتاحية التي يبحث عنها النظام للوظيفة المحددة." 
                    : "Often due to poor ATS compatibility (complex formatting, images, tables) or lacking the exact keywords the system is searching for."}
                </AccordionContent>
              </AccordionItem>
              <div className="h-px w-full bg-border my-2" />
              <AccordionItem value="item-3" className="border-b-0">
                <AccordionTrigger className="hover:no-underline font-bold text-lg py-4">
                  {isRtl ? "كيف يمكنني تحسين الكلمات المفتاحية؟" : "How can I improve resume keywords?"}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-base">
                  {isRtl 
                    ? "استخدم أداة 'مطابقة الوظيفة' في خبير لمعرفة المهارات المطلوبة في الإعلان الوظيفي وإضافتها بشكل طبيعي في قسم الخبرات." 
                    : "Use Khabir's 'Job Match' tool to discover required skills from the job posting and integrate them naturally into your experience section."}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div className="text-center">
            <Link href="/faq">
              <a className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                {isRtl ? "عرض كل الأسئلة الشائعة" : "View all FAQs"}
                <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-card border shadow-2xl rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-5xl font-heading font-black tracking-tight mb-6">
              {isRtl ? "طور سيرتك الذاتية في دقائق" : "Improve your resume in minutes with Khabir AI"}
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              {isRtl 
                ? "احصل على تحليل فوري، واقتراحات ذكية، وقوالب احترافية تبدأ بها مسيرتك المهنية."
                : "Get instant analysis, smart suggestions, and professional templates."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-14 px-10 rounded-full text-base font-bold shadow-lg" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                {isRtl ? "حلل سيرتك الآن" : "Upload Resume"}
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-full text-base font-bold bg-background" asChild>
                <Link href="/templates">{isRtl ? "استكشف النماذج" : "Explore Templates"}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="border-t border-border pt-16 pb-8 px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">خ</div>
                <span className="font-heading font-black text-2xl tracking-tighter">خبير</span>
              </div>
              <p className="text-muted-foreground max-w-sm">
                {isRtl ? "المحرك الذكي الأول لتحليل وتحسين السير الذاتية باللغتين العربية والإنجليزية." : "The premier AI engine for analyzing and optimizing resumes in Arabic and English."}
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">{isRtl ? "الروابط" : "Links"}</h4>
              <ul className="space-y-3 text-muted-foreground text-sm font-medium">
                <li><Link href="/"><a className="hover:text-foreground transition-colors">{isRtl ? "الرئيسية" : "Home"}</a></Link></li>
                <li><Link href="/templates"><a className="hover:text-foreground transition-colors">{isRtl ? "النماذج" : "Templates"}</a></Link></li>
                <li><Link href="/faq"><a className="hover:text-foreground transition-colors">{isRtl ? "الأسئلة الشائعة" : "FAQ"}</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{isRtl ? "قانوني" : "Legal"}</h4>
              <ul className="space-y-3 text-muted-foreground text-sm font-medium">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-medium">
            <p>© {new Date().getFullYear()} Khabir – Graduation Project</p>
            <p>Designed with <span className="text-primary">♥</span> for professionals</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="bg-card p-8 rounded-[2rem] border shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/5 transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 tracking-tight">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

function TemplateCard({ name, desc }: any) {
  return (
    <div className="bg-card rounded-[2rem] border shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="h-48 bg-secondary/50 flex items-center justify-center p-6 border-b border-border/50 group-hover:bg-secondary transition-colors">
        <div className="w-32 h-40 bg-background shadow-md rounded border border-border/50 flex flex-col p-3 gap-2">
          <div className="w-1/2 h-2 bg-muted rounded-full" />
          <div className="w-3/4 h-2 bg-muted rounded-full mb-2" />
          <div className="w-full h-1.5 bg-secondary rounded-full" />
          <div className="w-full h-1.5 bg-secondary rounded-full" />
          <div className="w-4/5 h-1.5 bg-secondary rounded-full" />
        </div>
      </div>
      <div className="p-8 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2 font-heading">{name}</h3>
        <p className="text-muted-foreground text-sm mb-6 flex-1">{desc}</p>
        <Button variant="outline" className="w-full rounded-xl font-bold" asChild>
          <Link href="/templates">Use Template</Link>
        </Button>
      </div>
    </div>
  );
}
