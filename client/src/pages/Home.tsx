import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  FileSearch, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  Eye, 
  History,
  ShieldCheck,
  Globe,
  Award,
  Star,
  Target,
  FileCheck,
  Upload,
  File,
  X,
  Loader2
} from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

const stats = [
  { id: 1, labelEn: "Total Visitors", labelAr: "إجمالي الزيارات", value: "1.2M+", icon: Eye, color: "text-blue-500" },
  { id: 2, labelEn: "Users Helped", labelAr: "مستخدمين تم مساعدتهم", value: "850K+", icon: Users, color: "text-green-500" },
  { id: 3, labelEn: "AI Corrections", labelAr: "تصحيحات الذكاء الاصطناعي", value: "3.4M+", icon: Sparkles, color: "text-purple-500" },
  { id: 4, labelEn: "Success Rate", labelAr: "نسبة النجاح", value: "98%", icon: Award, color: "text-orange-500" },
];

const testimonials = [
  { nameAr: "سارة أحمد", nameEn: "Sarah Ahmed", roleAr: "مهندسة برمجيات", roleEn: "Software Engineer", contentAr: "بفضل خبير، استطعت تحسين سيرتي الذاتية والحصول على وظيفة في شركة أحلامي!", contentEn: "Thanks to Khabir, I was able to improve my resume and land a job at my dream company!" },
  { nameAr: "خالد منصور", nameEn: "Khalid Mansour", roleAr: "مدير مشاريع", roleEn: "Project Manager", contentAr: "التحليل دقيق جداً وساعدني في اكتشاف ثغرات لم أكن أراها.", contentEn: "The analysis is very accurate and helped me discover gaps I hadn't seen before." },
];

export default function Home() {
  const [isRtl, setIsRtl] = useState(false);
  const [, setLocation] = useLocation();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef(null);

  const handleUpload = useCallback((file: File) => {
    setSelectedFile(file);
    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLocation(`/analysis?jd=${encodeURIComponent(jobDescription)}`);
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
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
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

  useEffect(() => {
    const checkLang = () => setIsRtl(document.documentElement.dir === 'rtl');
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-background font-sans overflow-x-hidden selection:bg-primary/20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[140px]" />
        </div>

        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">
                {isRtl ? "مستقبلك المهني يبدأ من هنا" : "Your career future starts here"}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-6 tracking-tight leading-tight">
              {isRtl ? "حلل سيرتك الذاتية بذكاء" : "Analyze Your Resume"}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-primary bg-300% animate-gradient">
                {isRtl ? "مع خبير AI" : "with Khabir AI"}
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              {isRtl 
                ? "احصل على تحليل فوري وتوصيات ذكية لتحسين سيرتك الذاتية وتجاوز أنظمة الـ ATS بسهولة."
                : "Get instant analysis and smart recommendations to optimize your resume and bypass ATS systems effortlessly."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="h-14 px-8 text-lg rounded-2xl shadow-xl shadow-primary/20 group" onClick={() => fileInputRef.current?.click()}>
                <Upload className={`h-5 w-5 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                {isRtl ? "ارفع سيرتك الذاتية" : "Upload Your Resume"}
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-2xl backdrop-blur-md border-primary/20 hover:bg-primary/5" asChild>
                <Link href="/templates">
                  {isRtl ? "استكشف النماذج" : "Explore Templates"}
                </Link>
              </Button>
            </div>

            {/* Drag & Drop Zone */}
            <div className="max-w-3xl mx-auto mt-16 space-y-8">
              {!uploading && (
                <div className="space-y-4 text-right" dir={isRtl ? "rtl" : "ltr"}>
                  <label className="text-lg font-bold block">
                    {isRtl ? "اختياري: الصق الوصف الوظيفي للمقارنة" : "Optional: Paste Job Description for Comparison"}
                  </label>
                  <Textarea 
                    placeholder={isRtl ? "مثلاً: مطلوب مطور ويب بمهارات React و Node.js..." : "e.g., Looking for a Web Developer with React and Node.js skills..."}
                    className="min-h-[120px] rounded-2xl bg-card/50 backdrop-blur-sm border-primary/20 focus:border-primary/50 transition-all text-right"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    dir={isRtl ? "rtl" : "ltr"}
                  />
                </div>
              )}

              <div 
                className={`relative group rounded-[2.5rem] border-2 border-dashed transition-all duration-300 p-12 bg-card/30 backdrop-blur-sm ${
                  dragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-primary/20 hover:border-primary/40"
                } ${uploading ? "pointer-events-none" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                />

                <AnimatePresence mode="wait">
                  {uploading ? (
                    <motion.div 
                      key="uploading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="flex flex-col items-center">
                        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                        <h3 className="text-xl font-bold mb-2">
                          {isRtl ? "جاري التحليل..." : "Analyzing..."}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          {selectedFile?.name}
                        </p>
                      </div>
                      <div className="w-full max-w-md mx-auto space-y-2">
                        <Progress value={uploadProgress} className="h-2" />
                        <div className="flex justify-between text-xs font-medium text-muted-foreground">
                          <span>{uploadProgress}%</span>
                          <span>{isRtl ? "جارٍ الفحص الذكي" : "Smart Scanning"}</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Upload className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">
                        {isRtl ? "اسحب وأفلت ملفك هنا" : "Drag & drop your file here"}
                      </h3>
                      <p className="text-muted-foreground mb-8 max-w-sm">
                        {isRtl 
                          ? "يدعم ملفات PDF و Word. سيتم تحليل بياناتك بأمان تام."
                          : "Supports PDF and Word files. Your data will be analyzed securely."}
                      </p>
                      <Button variant="secondary" className="rounded-xl px-8" onClick={() => fileInputRef.current?.click()}>
                        {isRtl ? "اختيار ملف" : "Choose File"}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-8 flex justify-center items-center gap-8 text-sm text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  {isRtl ? "فحص ATS كامل" : "Full ATS Scan"}
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  {isRtl ? "خصوصية مضمونة" : "Privacy Guaranteed"}
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  {isRtl ? "تحليل بذكاء 2026" : "2026 AI Analysis"}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-card border border-primary/5 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 text-center group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`h-7 w-7 ${stat.color}`} />
                </div>
                <h3 className="text-4xl font-bold mb-2 tracking-tight">{stat.value}</h3>
                <p className="text-muted-foreground font-medium">
                  {isRtl ? stat.labelAr : stat.labelEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 border-y border-primary/5 overflow-hidden">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-10">
            {isRtl ? "موثوق من قبل المئات من الشركات" : "Trusted by hundreds of companies"}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <Globe className="h-10 w-10" />
            <ShieldCheck className="h-10 w-10" />
            <Award className="h-10 w-10" />
            <History className="h-10 w-10" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold mb-6">
              {isRtl ? "لماذا تختار خبير؟" : "Why Choose Khabir?"}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {isRtl 
                ? "توقف عن التخمين. يقوم ذكاؤنا الاصطناعي بتحليل سيرتك الذاتية تماماً مثل خبراء التوظيف المعتمدين."
                : "Stop guessing. Our AI analyzes your resume exactly like certified hiring experts."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="h-8 w-8 text-blue-500" />}
              title={isRtl ? "تغذية راجعة فورية" : "Instant Feedback"}
              description={isRtl 
                ? "احصل على نتيجة مفصلة ونصائح قابلة للتنفيذ في ثوانٍ معدودة."
                : "Get a detailed score and actionable feedback in seconds, not days."}
              isRtl={isRtl}
            />
            <FeatureCard 
              icon={<Target className="h-8 w-8 text-teal-500" />}
              title={isRtl ? "تحسين للـ ATS" : "ATS Optimization"}
              description={isRtl 
                ? "تأكد من تجاوز سيرتك الذاتية للفلاتر الآلية التي تستخدمها 99% من الشركات الكبرى."
                : "Ensure your resume passes the automated filters used by 99% of Fortune 500 companies."}
              isRtl={isRtl}
            />
            <FeatureCard 
              icon={<FileCheck className="h-8 w-8 text-purple-500" />}
              title={isRtl ? "اقتراحات ذكية" : "Smart Suggestions"}
              description={isRtl 
                ? "يعيد ذكاؤنا الاصطناعي صياغة نقاط خبرتك لتحقيق أقصى قدر من التأثير."
                : "Our AI rewrites your bullet points to maximize impact and highlight your achievements."}
              isRtl={isRtl}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{isRtl ? "قالوا عن خبير" : "What They Say"}</h2>
            <p className="text-muted-foreground">{isRtl ? "قصص نجاح حقيقية من مستخدمينا" : "Real success stories from our users"}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-card p-8 rounded-3xl border border-primary/10 shadow-lg relative"
              >
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-primary text-primary" />)}
                </div>
                <p className="text-lg italic mb-6">"{isRtl ? t.contentAr : t.contentEn}"</p>
                <div>
                  <h4 className="font-bold">{isRtl ? t.nameAr : t.nameEn}</h4>
                  <p className="text-sm text-muted-foreground">{isRtl ? t.roleAr : t.roleEn}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-primary-foreground text-center relative overflow-hidden shadow-2xl shadow-primary/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                {isRtl ? "هل أنت مستعد للخطوة التالية؟" : "Ready for your next step?"}
              </h2>
              <p className="text-primary-foreground/80 mb-10 text-lg max-w-xl mx-auto">
                {isRtl 
                  ? "انضم إلى آلاف المحترفين الذين طوروا مسارهم المهني باستخدام خبير AI."
                  : "Join thousands of professionals who boosted their careers with Khabir AI."}
              </p>
              <Button size="lg" variant="secondary" className="h-16 px-10 text-xl rounded-2xl font-bold hover:scale-105 transition-all shadow-lg" asChild>
                <Link href="/analysis">
                  {isRtl ? "ابدأ الآن مجاناً" : "Start Now for Free"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 border-t border-primary/5 bg-muted/10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="text-2xl font-bold text-primary">خبير / Khabir</div>
            <p className="text-muted-foreground text-sm max-w-xs text-center md:text-left">
              {isRtl ? "مساعدك الشخصي المدعوم بالذكاء الاصطناعي للنجاح المهني." : "Your AI-powered personal assistant for career success."}
            </p>
          </div>
          <div className="flex gap-8 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">{isRtl ? "الخصوصية" : "Privacy"}</a>
            <a href="#" className="hover:text-primary transition-colors">{isRtl ? "الشروط" : "Terms"}</a>
            <a href="#" className="hover:text-primary transition-colors">{isRtl ? "اتصل بنا" : "Contact"}</a>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Khabir AI. {isRtl ? "جميع الحقوق محفوظة." : "All rights reserved."}</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, isRtl }: any) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-10 rounded-[2.5rem] bg-card border border-primary/5 shadow-sm hover:shadow-2xl transition-all duration-300"
    >
      <div className="mb-6 p-4 bg-muted w-fit rounded-2xl group-hover:bg-primary/10 transition-colors">{icon}</div>
      <h3 className="text-2xl font-bold mb-4 tracking-tight">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}
