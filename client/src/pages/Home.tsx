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
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-primary-foreground pb-32">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-24 px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[600px] bg-secondary/50 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[500px] bg-secondary/30 rounded-full blur-3xl -z-10" />
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-8 border shadow-sm"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isRtl ? "مستقبلك المهني يبدأ من هنا" : "Your career future starts here"}</span>
            </motion.div>
            
            <h1 className="text-5xl lg:text-7xl font-handwritten leading-[1.3] mb-6 text-foreground">
              {isRtl ? "حلل سيرتك الذاتية وتجاوز أنظمة التوظيف" : "Analyze your resume and pass ATS systems"}
              <br />
              <span className="text-muted-foreground">{isRtl ? "بذكاء" : "smartly"}</span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg">
              {isRtl 
                ? "احصل على تحليل فوري، اكتشف المهارات المفقودة، وحسّن سيرتك الذاتية لتطابق متطلبات الوظيفة بدقة."
                : "Get instant analysis, detect missing skills, and optimize your resume to match job descriptions perfectly."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 px-8 rounded-full text-base font-semibold shadow-soft hover:shadow-soft-lg transition-all duration-300" onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth'})}>
                {isRtl ? "حلل سيرتك الآن" : "Upload Your Resume"}
                <ArrowRight className={`h-5 w-5 ${isRtl ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-base font-semibold hover:bg-secondary transition-colors duration-300 shadow-sm">
                <PlayCircle className={`h-5 w-5 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                {isRtl ? "كيف يعمل النظام؟" : "See How It Works"}
              </Button>
            </div>
            
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground font-medium">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> {isRtl ? "يدعم PDF و Word" : "Supports PDF & Word"}</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> {isRtl ? "عربي وإنجليزي" : "Arabic & English"}</span>
            </div>
          </motion.div>
          
          {/* Mockup Right Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="bg-card border shadow-soft-lg rounded-3xl p-8 relative z-10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
              
              <div className="flex items-center justify-between mb-8 pb-6 border-b">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center border shadow-sm">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Naif_Resume_2026.pdf</h3>
                    <p className="text-sm text-muted-foreground">Scanned 2 mins ago</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-secondary/50 rounded-2xl p-5 border flex flex-col items-center justify-center">
                  <p className="text-sm text-muted-foreground mb-2 font-medium">ATS Score</p>
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path className="text-muted" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path className="text-primary" strokeDasharray="82, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-lg font-bold">82</span>
                  </div>
                </div>
                <div className="bg-primary text-primary-foreground rounded-2xl p-5 shadow-md flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
                  <p className="text-sm mb-2 font-medium opacity-80 z-10">Job Match</p>
                  <p className="text-3xl font-bold z-10">76<span className="text-base opacity-70">%</span></p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-secondary/30 p-3 rounded-xl">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-green-500" />
                  <p className="text-sm font-medium">Excellent structure and parsable text format</p>
                </div>
                <div className="flex items-start gap-3 bg-secondary/30 p-3 rounded-xl">
                  <Target className="h-5 w-5 shrink-0 mt-0.5 text-blue-500" />
                  <p className="text-sm font-medium">Keywords: <span className="font-mono text-xs bg-background px-1.5 py-0.5 rounded border ml-1">React</span> <span className="font-mono text-xs bg-background px-1.5 py-0.5 rounded border">Node.js</span></p>
                </div>
                <div className="flex items-start gap-3 bg-destructive/10 p-3 rounded-xl border border-destructive/20">
                  <Zap className="h-5 w-5 shrink-0 mt-0.5 text-destructive" />
                  <p className="text-sm font-medium text-destructive">Missing skills: <span className="font-mono text-xs bg-background px-1.5 py-0.5 rounded border border-destructive/30 ml-1">Docker</span></p>
                </div>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-tr from-secondary/50 to-background rounded-[3rem] blur-2xl -z-10 transform scale-105" />
          </motion.div>
        </div>
      </section>

      {/* 2. TRUST BAR */}
      <section className="py-10 border-y bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 text-sm font-semibold text-muted-foreground tracking-wide">
            <span className="flex items-center gap-2 hover:text-foreground transition-colors"><Target className="h-5 w-5" /> ATS Optimized</span>
            <span className="flex items-center gap-2 hover:text-foreground transition-colors"><Languages className="h-5 w-5" /> Arabic & English</span>
            <span className="flex items-center gap-2 hover:text-foreground transition-colors"><Sparkles className="h-5 w-5" /> AI Suggestions</span>
            <span className="flex items-center gap-2 hover:text-foreground transition-colors"><Layout className="h-5 w-5" /> Pro Templates</span>
          </div>
        </div>
      </section>

      {/* 3. UPLOAD SECTION */}
      <section id="upload-section" className="py-24 px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.div initial={{opacity: 0, y: 10}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}}>
            <h2 className="text-4xl font-handwritten mb-4">{isRtl ? "ابدأ التحليل الآن" : "Start Your Analysis"}</h2>
            <p className="text-lg text-muted-foreground">{isRtl ? "ارفع سيرتك الذاتية وسنقوم بالباقي بدقة متناهية" : "Upload your resume and we'll handle the rest with precision"}</p>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          className="bg-card border shadow-soft-lg rounded-3xl p-6 md:p-10 transition-all"
        >
          {!uploading && (
            <div className="mb-8" dir={isRtl ? "rtl" : "ltr"}>
              <label className="text-sm font-semibold mb-3 flex items-center gap-2 text-foreground">
                <Target className="h-4 w-4" />
                {isRtl ? "اختياري: الوصف الوظيفي للمطابقة (Job Description)" : "Optional: Job Description for matching"}
              </label>
              <Textarea 
                placeholder={isRtl ? "الصق الوصف الوظيفي هنا لمقارنة مدى تطابق سيرتك الذاتية..." : "Paste the job description here to check your match rate..."}
                className="min-h-[120px] rounded-2xl bg-secondary/30 border-secondary focus:border-primary focus:ring-primary/20 transition-all text-base p-4 font-sans shadow-inner"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          )}

          <div 
            className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 p-12 text-center flex flex-col items-center justify-center min-h-[320px] 
              ${dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-secondary/50"} 
              ${uploading ? "pointer-events-none border-primary/30 bg-secondary/20" : "cursor-pointer"}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleChange} />

            <AnimatePresence mode="wait">
              {uploading ? (
                <motion.div key="uploading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm mx-auto">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{isRtl ? "جاري تحليل المستند..." : "Analyzing Document..."}</h3>
                  <p className="text-sm text-muted-foreground mb-8 truncate px-4 font-medium">{selectedFile?.name}</p>
                  <div className="space-y-3">
                    <Progress value={uploadProgress} className="h-3 rounded-full" />
                    <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <span>{uploadProgress}%</span>
                      <span>{isRtl ? "فحص ATS" : "ATS Scanning"}</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="w-20 h-20 rounded-full bg-secondary shadow-sm border flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{isRtl ? "اسحب وأفلت السيرة الذاتية هنا" : "Drag and drop your resume here"}</h3>
                  <p className="text-muted-foreground mb-8 font-medium">{isRtl ? "يدعم PDF, DOC, DOCX (الحد الأقصى 5MB)" : "Supports PDF, DOC, DOCX (Max 5MB)"}</p>
                  <Button size="lg" className="rounded-full px-8 font-semibold h-12 shadow-sm hover:shadow-md transition-shadow">
                    {isRtl ? "أو اضغط لاختيار ملف" : "Or Click to Select File"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* 4. DEMO RESULTS SECTION */}
      <section className="py-24 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-handwritten mb-4">{isRtl ? "رؤى قابلة للتنفيذ" : "Actionable Insights"}</h2>
            <p className="text-lg text-muted-foreground">{isRtl ? "اكتشف بالضبط ما يراه مديرو التوظيف وأنظمة ATS." : "Discover exactly what recruiters and ATS systems see."}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -5 }} className="bg-card p-8 rounded-3xl border shadow-soft flex flex-col items-center text-center transition-all">
              <div className="relative w-24 h-24 mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-secondary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path className="text-primary" strokeDasharray="82, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">82<span className="text-lg text-muted-foreground">%</span></span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{isRtl ? "درجة التوافق (ATS Score)" : "ATS Score"}</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">{isRtl ? "تقييم شامل بناءً على التنسيق والوضوح والكلمات المفتاحية." : "Comprehensive evaluation based on format, clarity, and keywords."}</p>
            </motion.div>
            
            <motion.div whileHover={{ y: -5 }} className="bg-card p-8 rounded-3xl border shadow-soft flex flex-col items-center text-center transition-all">
              <div className="relative w-24 h-24 mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-secondary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path className="text-blue-500" strokeDasharray="76, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">76<span className="text-lg text-muted-foreground">%</span></span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{isRtl ? "مطابقة الوظيفة (Job Match)" : "Job Match"}</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">{isRtl ? "مدى تطابق مهاراتك مع متطلبات الوصف الوظيفي المحدد." : "How well your skills align with the specific job description requirements."}</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-card p-8 rounded-3xl border shadow-soft flex flex-col transition-all">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                {isRtl ? "اقتراحات التحسين" : "AI Suggestions"}
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start bg-secondary/30 p-3 rounded-xl border border-transparent hover:border-border transition-colors">
                  <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center border shadow-sm shrink-0 mt-0.5"><span className="text-xs font-bold">1</span></div>
                  <p className="text-sm font-medium text-foreground/80">{isRtl ? "إضافة إنجازات قابلة للقياس (أرقام/نسب)" : "Add measurable achievements (numbers/metrics)"}</p>
                </li>
                <li className="flex gap-3 items-start bg-secondary/30 p-3 rounded-xl border border-transparent hover:border-border transition-colors">
                  <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center border shadow-sm shrink-0 mt-0.5"><span className="text-xs font-bold">2</span></div>
                  <p className="text-sm font-medium text-foreground/80">{isRtl ? "استخدام أفعال حركة قوية في قسم الخبرة" : "Use stronger action verbs in experience section"}</p>
                </li>
                <li className="flex gap-3 items-start bg-destructive/5 p-3 rounded-xl border border-destructive/10">
                  <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs font-bold text-destructive">!</span></div>
                  <p className="text-sm font-medium text-destructive/90">{isRtl ? "تضمين مهارات الحوسبة السحابية المفقودة" : "Include missing cloud computing skills"}</p>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. FEATURES SECTION */}
      <section className="py-24 border-t">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-handwritten mb-4">{isRtl ? "كل ما تحتاجه للنجاح" : "Everything you need to succeed"}</h2>
            <p className="text-lg text-muted-foreground">{isRtl ? "أدوات متقدمة صممت خصيصاً لتجاوز أنظمة التوظيف" : "Advanced tools specifically built to bypass hiring filters."}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<BarChart className="h-6 w-6 text-primary" />}
              title={isRtl ? "تحليل دقيق" : "AI Analysis"}
              desc={isRtl ? "فحص شامل يماثل أنظمة ATS للشركات الكبرى." : "Comprehensive scanning matching Fortune 500 ATS logic."}
            />
            <FeatureCard 
              icon={<Target className="h-6 w-6 text-primary" />}
              title={isRtl ? "مطابقة الوظيفة" : "Job Matching"}
              desc={isRtl ? "اكتشف فجوة المهارات بين سيرتك والوصف الوظيفي." : "Discover the skill gap between your CV and the JD."}
            />
            <FeatureCard 
              icon={<Sparkles className="h-6 w-6 text-primary" />}
              title={isRtl ? "تحسين ذكي" : "Smart Rewrite"}
              desc={isRtl ? "إعادة صياغة قوية للملخص والخبرات بضغطة زر." : "Powerful rewriting of summaries and experiences instantly."}
            />
            <FeatureCard 
              icon={<Layout className="h-6 w-6 text-primary" />}
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
            <h2 className="text-3xl md:text-4xl font-handwritten">{isRtl ? "كيف يعمل خبير؟" : "How It Works"}</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border -z-10" />
            
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-card border-[6px] border-secondary shadow-soft flex items-center justify-center mb-6 text-2xl font-bold text-muted-foreground transition-transform hover:scale-105">1</div>
              <h3 className="text-xl font-bold mb-3">{isRtl ? "ارفع سيرتك الذاتية" : "Upload your resume"}</h3>
              <p className="text-muted-foreground font-medium">{isRtl ? "قم برفع ملفك بصيغة PDF أو Word بأمان تام." : "Securely upload your current PDF or Word document."}</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary border-[6px] border-primary/20 shadow-soft-lg flex items-center justify-center mb-6 text-2xl font-bold text-primary-foreground transition-transform hover:scale-105">2</div>
              <h3 className="text-xl font-bold mb-3">{isRtl ? "احصل على التحليل الذكي" : "Get AI analysis"}</h3>
              <p className="text-muted-foreground font-medium">{isRtl ? "نظامنا يفحص الكلمات المفتاحية والهيكلية في ثوانٍ." : "Our system scans for keywords and structure in seconds."}</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-card border-[6px] border-secondary shadow-soft flex items-center justify-center mb-6 text-2xl font-bold text-muted-foreground transition-transform hover:scale-105">3</div>
              <h3 className="text-xl font-bold mb-3">{isRtl ? "حسن وحمل" : "Improve and download"}</h3>
              <p className="text-muted-foreground font-medium">{isRtl ? "طبق التوصيات وحمل النسخة الاحترافية الجاهزة للتقديم." : "Apply recommendations and download the optimized version."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TEMPLATES PREVIEW */}
      <section className="py-24 border-y">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-handwritten mb-4">{isRtl ? "قوالب احترافية معتمدة" : "Professional Templates"}</h2>
              <p className="text-lg text-muted-foreground">{isRtl ? "مصممة خصيصاً لتجاوز الفلاتر الآلية" : "Specifically designed to pass automated filters."}</p>
            </div>
            <Button variant="outline" className="rounded-full font-semibold shadow-sm" asChild>
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-primary text-primary-foreground shadow-soft-lg rounded-3xl p-12 lg:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
          
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-5xl font-handwritten mb-6">
              {isRtl ? "طور سيرتك الذاتية في دقائق" : "Improve your resume in minutes"}
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto font-medium">
              {isRtl 
                ? "انضم لآلاف الباحثين عن عمل الذين ضاعفوا فرصهم في الحصول على مقابلات وظيفية." 
                : "Join thousands of job seekers who doubled their chances of landing interviews."}
            </p>
            <Button size="lg" className="h-14 px-10 rounded-full text-lg font-bold bg-background text-foreground hover:bg-secondary transition-all shadow-lg hover:shadow-xl" onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setTimeout(() => fileInputRef.current?.click(), 800);
            }}>
              {isRtl ? "ابدأ مجاناً الآن" : "Start For Free"}
            </Button>
          </div>
        </motion.div>
      </section>

      {/* 10. FOOTER */}
      <footer className="border-t py-12 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/">
                <span className="font-handwritten text-2xl mb-4 block cursor-pointer">خبير</span>
              </Link>
              <p className="text-sm text-muted-foreground font-medium">
                {isRtl 
                  ? "منصة ذكية لتحليل وتحسين السير الذاتية باللغتين العربية والإنجليزية." 
                  : "Smart platform for analyzing and optimizing resumes in Arabic and English."}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 uppercase tracking-widest text-sm text-muted-foreground">{isRtl ? "الروابط" : "Links"}</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><Link href="/" className="hover:text-primary transition-colors">{isRtl ? "الرئيسية" : "Home"}</Link></li>
                <li><Link href="/templates" className="hover:text-primary transition-colors">{isRtl ? "النماذج" : "Templates"}</Link></li>
                <li><Link href="/faq" className="hover:text-primary transition-colors">{isRtl ? "الأسئلة الشائعة" : "FAQ"}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 uppercase tracking-widest text-sm text-muted-foreground">{isRtl ? "قانوني" : "Legal"}</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><a href="#" className="hover:text-primary transition-colors">{isRtl ? "الشروط والأحكام" : "Terms"}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{isRtl ? "الخصوصية" : "Privacy"}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground font-medium">
            <p>© 2026 Khabir AI. All rights reserved.</p>
            <p>Made with 🖤 for Job Seekers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-card p-6 rounded-3xl border shadow-sm hover:shadow-soft transition-all"
    >
      <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function TemplateCard({ name, desc }: { name: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group rounded-3xl border bg-card overflow-hidden shadow-sm hover:shadow-soft transition-all"
    >
      <div className="aspect-[1/1.4] bg-secondary/30 relative flex items-center justify-center border-b p-6 overflow-hidden">
        <div className="absolute inset-x-8 top-8 bottom-0 bg-background border rounded-t-xl shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
          <div className="w-full h-8 border-b bg-secondary/30 flex items-center px-4 gap-1">
            <div className="w-2 h-2 rounded-full bg-border" />
            <div className="w-2 h-2 rounded-full bg-border" />
            <div className="w-2 h-2 rounded-full bg-border" />
          </div>
          <div className="p-4 space-y-3">
            <div className="w-1/3 h-4 bg-secondary rounded" />
            <div className="w-full h-2 bg-secondary/50 rounded" />
            <div className="w-5/6 h-2 bg-secondary/50 rounded" />
            <div className="w-full h-2 bg-secondary/50 rounded" />
          </div>
        </div>
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
          <Link href="/templates">
            <Button className="rounded-full shadow-lg" size="sm">Use Template</Button>
          </Link>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground font-medium">{desc}</p>
      </div>
    </motion.div>
  );
}
