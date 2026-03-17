import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Save, User, Briefcase, GraduationCap, Sparkles, Layout, Wand2, Loader2, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useReactToPrint } from "react-to-print";

export default function Editor() {
  const [isRtl, setIsRtl] = useState(false);
  const { toast } = useToast();
  const [activeTemplate, setActiveTemplate] = useState("classic");
  const componentRef = useRef<HTMLDivElement>(null);
  const [isImproving, setIsImproving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [resumeData, setResumeData] = useState({
    fullName: "أحمد محمد",
    jobTitle: "مطور برمجيات",
    email: "ahmed@example.com",
    phone: "+966 50 000 0000",
    summary: "مطور برمجيات شغوف ببناء تطبيقات ويب عالية الجودة وتجربة مستخدم مميزة.",
    experience: "• مطور واجهات أمامية في شركة تقنية (2022 - الحالي)\n• تطوير تطبيقات باستخدام React و Tailwind CSS\n• تحسين أداء المواقع بنسبة 30%",
    education: "بكالوريوس علوم الحاسب - جامعة الملك سعود (2021)",
  });

  const translateResume = () => {
    setIsTranslating(true);
    setTimeout(() => {
      const isCurrentlyAr = /[\u0600-\u06FF]/.test(resumeData.fullName);
      
      if (isCurrentlyAr) {
        setResumeData({
          fullName: "Ahmed Mohamed",
          jobTitle: "Software Developer",
          email: "ahmed@example.com",
          phone: "+966 50 000 0000",
          summary: "Passionate software developer focused on building high-quality web applications and exceptional user experiences.",
          experience: "• Frontend Developer at Tech Corp (2022 - Present)\n• Developing applications using React and Tailwind CSS\n• Optimizing website performance by 30%",
          education: "Bachelor of Computer Science - King Saud University (2021)",
        });
      } else {
        setResumeData({
          fullName: "أحمد محمد",
          jobTitle: "مطور برمجيات",
          email: "ahmed@example.com",
          phone: "+966 50 000 0000",
          summary: "مطور برمجيات شغوف ببناء تطبيقات ويب عالية الجودة وتجربة مستخدم مميزة.",
          experience: "• مطور واجهات أمامية في شركة تقنية (2022 - الحالي)\n• تطوير تطبيقات باستخدام React و Tailwind CSS\n• تحسين أداء المواقع بنسبة 30%",
          education: "بكالوريوس علوم الحاسب - جامعة الملك سعود (2021)",
        });
      }
      
      setIsTranslating(false);
      toast({
        title: isRtl ? "تمت الترجمة!" : "Translated!",
        description: isRtl ? "تمت ترجمة محتوى السيرة الذاتية بذكاء." : "Resume content has been intelligently translated.",
      });
    }, 1500);
  };

  const improveContent = () => {
    setIsImproving(true);
    setTimeout(() => {
      setResumeData(prev => ({
        ...prev,
        summary: isRtl 
          ? "خبير في تطوير البرمجيات بخلفية قوية في بناء حلول ويب متكاملة، متميز في تحسين تجربة المستخدم وتحقيق أعلى معايير الأداء والجودة."
          : "Senior Software Engineer with a proven track record of architecting scalable web solutions, specializing in UX optimization and high-performance system delivery.",
        experience: isRtl
          ? "• مهندس برمجيات أول (2022 - الحالي)\n• قيادة وتطوير منصات ويب معقدة باستخدام React و Node.js مع ضمان توافقية الأنظمة.\n• تحقيق قفزة نوعية في أداء التطبيقات بنسبة 35٪ من خلال تحسين هيكلية الكود البرمجي."
          : "• Senior Software Engineer (2022 - Present)\n• Spearheaded the development of complex web platforms using React/Node.js ecosystem.\n• Engineered performance optimizations resulting in a 35% reduction in page load times."
      }));
      setIsImproving(false);
      toast({
        title: isRtl ? "تم التحسين بالسحر!" : "Magic Improvement Done!",
        description: isRtl ? "قام الذكاء الاصطناعي بإعادة صياغة سيرتك الذاتية باحترافية." : "AI has professionally rewritten your resume content.",
      });
    }, 1500);
  };

  useEffect(() => {
    const checkLang = () => setIsRtl(document.documentElement.dir === 'rtl');
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    
    const params = new URLSearchParams(window.location.search);
    const templateId = params.get('template');
    if (templateId && templates.some(t => t.id === templateId)) {
      setActiveTemplate(templateId);
    }

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    toast({
      title: isRtl ? "تم الحفظ" : "Saved",
      description: isRtl ? "تم حفظ التغييرات بنجاح" : "Changes saved successfully",
    });
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Resume_${resumeData.fullName}`,
  });

  const templates = [
    { id: "classic", name: isRtl ? "كلاسيكي" : "Classic" },
    { id: "modern", name: isRtl ? "عصري" : "Modern" },
    { id: "minimal", name: isRtl ? "بسيط" : "Minimal" },
  ];

  return (
    <div className="min-h-screen bg-secondary/10 font-sans flex flex-col pt-24 pb-12">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-6 h-full flex flex-col">
        <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[calc(100vh-140px)]">
          
          {/* Editor Side */}
          <div className="w-full lg:w-1/3 flex flex-col h-[800px] lg:h-full shrink-0">
            <Card className="h-full flex flex-col shadow-soft-lg border-0 rounded-3xl overflow-hidden bg-card">
              <CardHeader className="border-b bg-background/95 backdrop-blur-md px-6 py-5 z-10 shrink-0">
                <CardTitle className="flex flex-col gap-5 text-xl font-bold font-heading">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 text-primary">
                      <Sparkles className="h-6 w-6 text-blue-500" />
                      {isRtl ? "محرر خبير" : "Khabir Editor"}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <Button 
                      variant="outline" 
                      className="rounded-xl border-border font-semibold shadow-sm hover:bg-secondary/50 flex gap-2 h-11"
                      onClick={translateResume}
                      disabled={isTranslating}
                    >
                      {isTranslating ? <Loader2 className="h-4 w-4 animate-spin shrink-0" /> : <Languages className="h-4 w-4 shrink-0" />}
                      <span className="truncate">{isRtl ? "ترجمة للإنجليزية" : "Translate"}</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-semibold shadow-sm flex gap-2 h-11"
                      onClick={improveContent}
                      disabled={isImproving}
                    >
                      {isImproving ? <Loader2 className="h-4 w-4 animate-spin shrink-0" /> : <Wand2 className="h-4 w-4 shrink-0" />}
                      <span className="truncate">{isRtl ? "تحسين بالذكاء" : "AI Improve"}</span>
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-5 md:p-6 custom-scrollbar bg-background">
                <div className="mb-8 space-y-3">
                  <label className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                    <Layout className="h-4 w-4" />
                    {isRtl ? "اختر القالب" : "Choose Template"}
                  </label>
                  <div className="grid grid-cols-3 gap-2 p-1.5 bg-secondary/50 rounded-2xl border border-border/50">
                    {templates.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setActiveTemplate(t.id)}
                        className={`py-2 px-1 text-sm font-semibold rounded-xl transition-all ${
                          activeTemplate === t.id 
                            ? "bg-background text-foreground shadow-sm border border-border" 
                            : "hover:bg-background/50 text-muted-foreground border border-transparent"
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6 bg-secondary/50 p-1.5 rounded-2xl h-auto border border-border/50">
                    <TabsTrigger value="personal" className="rounded-xl py-2.5 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex items-center justify-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{isRtl ? "الشخصية" : "Personal"}</span>
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="rounded-xl py-2.5 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex items-center justify-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span className="hidden sm:inline">{isRtl ? "الخبرة" : "Experience"}</span>
                    </TabsTrigger>
                    <TabsTrigger value="education" className="rounded-xl py-2.5 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex items-center justify-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      <span className="hidden sm:inline">{isRtl ? "التعليم" : "Education"}</span>
                    </TabsTrigger>
                  </TabsList>

                  <div className="min-h-[420px]">
                    <AnimatePresence mode="wait">
                      <TabsContent value="personal" className="space-y-5 mt-0 outline-none">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">{isRtl ? "الاسم الكامل" : "Full Name"}</label>
                            <Input name="fullName" value={resumeData.fullName} onChange={handleInputChange} className="bg-secondary/30 border-border/50 rounded-xl h-11 font-medium focus-visible:ring-primary/20" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">{isRtl ? "المسمى الوظيفي" : "Job Title"}</label>
                            <Input name="jobTitle" value={resumeData.jobTitle} onChange={handleInputChange} className="bg-secondary/30 border-border/50 rounded-xl h-11 font-medium focus-visible:ring-primary/20" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-foreground">{isRtl ? "البريد الإلكتروني" : "Email"}</label>
                              <Input name="email" value={resumeData.email} onChange={handleInputChange} className="bg-secondary/30 border-border/50 rounded-xl h-11 font-medium text-left focus-visible:ring-primary/20" dir="ltr" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-foreground">{isRtl ? "رقم الجوال" : "Phone"}</label>
                              <Input name="phone" value={resumeData.phone} onChange={handleInputChange} className="bg-secondary/30 border-border/50 rounded-xl h-11 font-medium text-left focus-visible:ring-primary/20" dir="ltr" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">{isRtl ? "نبذة تعريفية" : "Summary"}</label>
                            <Textarea name="summary" value={resumeData.summary} onChange={handleInputChange} className="min-h-[140px] bg-secondary/30 border-border/50 rounded-xl resize-none font-medium leading-relaxed p-4 focus-visible:ring-primary/20" />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="experience" className="space-y-5 mt-0 outline-none">
                        <div className="space-y-2 flex flex-col h-full">
                          <label className="text-sm font-semibold text-foreground flex flex-col sm:flex-row justify-between gap-1 shrink-0 mb-1">
                            <span>{isRtl ? "تفاصيل الخبرة المهنية" : "Professional Experience"}</span>
                            <span className="text-xs text-muted-foreground font-normal">
                              {isRtl ? "* استخدم النقاط (-) للتنظيم" : "* Use bullet points (-)"}
                            </span>
                          </label>
                          <Textarea name="experience" value={resumeData.experience} onChange={handleInputChange} className="min-h-[380px] flex-1 bg-secondary/30 border-border/50 rounded-xl resize-none font-medium text-sm leading-relaxed p-4 focus-visible:ring-primary/20" dir={isRtl ? "rtl" : "ltr"} />
                        </div>
                      </TabsContent>

                      <TabsContent value="education" className="space-y-5 mt-0 outline-none">
                        <div className="space-y-2 flex flex-col h-full">
                          <label className="text-sm font-semibold text-foreground shrink-0 mb-1">{isRtl ? "المؤهلات العلمية" : "Education"}</label>
                          <Textarea name="education" value={resumeData.education} onChange={handleInputChange} className="min-h-[280px] flex-1 bg-secondary/30 border-border/50 rounded-xl resize-none font-medium p-4 leading-relaxed focus-visible:ring-primary/20" />
                        </div>
                      </TabsContent>
                    </AnimatePresence>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row gap-3">
                    <Button onClick={handleSave} className="flex-1 h-12 rounded-xl font-bold shadow-sm hover:shadow-md transition-all">
                      <Save className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                      {isRtl ? "حفظ التعديلات" : "Save Changes"}
                    </Button>
                    <Button onClick={() => handlePrint()} variant="outline" className="flex-1 h-12 rounded-xl border-border font-bold hover:bg-secondary/50 transition-all bg-background shadow-sm">
                      <Download className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                      {isRtl ? "تحميل PDF" : "Download PDF"}
                    </Button>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Preview Side */}
          <div className="flex-1 flex flex-col h-[800px] lg:h-full bg-background/50 backdrop-blur-sm rounded-3xl border shadow-soft p-4 md:p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4 px-2 shrink-0">
              <h3 className="text-sm font-bold flex items-center gap-2 text-muted-foreground tracking-widest uppercase">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                {isRtl ? "معاينة حية" : "Live Preview"}
              </h3>
              <div className="h-7 px-3 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold uppercase tracking-wider">{activeTemplate}</div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar flex justify-center items-start py-6 w-full rounded-2xl bg-secondary/30 shadow-inner relative">
              <div className="w-[210mm] max-w-full px-4 sm:px-8 transform origin-top mx-auto shrink-0 mb-8">
                <div ref={componentRef} className="w-full bg-white print:shadow-none shadow-soft-lg transition-all duration-300 rounded-sm">
                  <div className={`min-h-[297mm] w-full bg-white text-black ${
                    activeTemplate === 'modern' ? 'p-0 flex overflow-hidden' : 'p-10 sm:p-14'
                  } ${activeTemplate === 'minimal' ? 'font-sans border-t-[12px] border-black' : 'font-heading'}`}>
                  
                  {activeTemplate === 'classic' && (
                    <div className="space-y-8 text-left h-full w-full" dir="ltr">
                      <header className="border-b-2 border-black pb-8 mb-8 text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-widest text-black mb-3 font-heading">{resumeData.fullName}</h1>
                        <p className="font-bold tracking-widest uppercase text-lg sm:text-xl mb-5 text-gray-700">{resumeData.jobTitle}</p>
                        <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-sm text-black font-semibold font-sans">
                          <span className="flex items-center gap-1">✉ {resumeData.email}</span>
                          <span className="flex items-center gap-1">📞 {resumeData.phone}</span>
                        </div>
                      </header>
                      <div className="space-y-10 w-full">
                        <ResumeSections data={resumeData} />
                      </div>
                    </div>
                  )}

                  {activeTemplate === 'modern' && (
                    <div className="flex h-full min-h-[297mm] w-full" dir="ltr">
                      <div className="w-[35%] bg-black text-white p-8 shrink-0">
                        <div className="w-28 h-28 bg-white text-black rounded-full mb-10 flex items-center justify-center text-5xl font-black mx-auto font-heading shadow-lg">
                          {resumeData.fullName.charAt(0)}
                        </div>
                        <div className="space-y-10">
                          <section>
                            <h3 className="text-xs font-black uppercase mb-4 tracking-widest border-b border-white/30 pb-2 text-white/90">Contact</h3>
                            <div className="text-sm space-y-4 font-semibold font-sans text-white/80">
                              <p className="break-all">{resumeData.email}</p>
                              <p>{resumeData.phone}</p>
                            </div>
                          </section>
                          <section>
                            <h3 className="text-xs font-black uppercase mb-4 tracking-widest border-b border-white/30 pb-2 text-white/90">Education</h3>
                            <p className="text-sm font-semibold leading-relaxed whitespace-pre-line text-white/80">{resumeData.education}</p>
                          </section>
                        </div>
                      </div>
                      <div className="flex-1 p-10 sm:p-12 text-left bg-white">
                        <header className="mb-12">
                          <h1 className="text-4xl sm:text-5xl font-black text-black mb-3 font-heading tracking-tight">{resumeData.fullName}</h1>
                          <p className="text-xl font-bold text-gray-600 uppercase tracking-wider">{resumeData.jobTitle}</p>
                        </header>
                        <div className="space-y-10">
                          <section>
                            <h2 className="text-sm font-black border-b-2 border-black pb-2 mb-5 uppercase tracking-widest text-black">Summary</h2>
                            <p className="text-sm font-semibold leading-relaxed text-gray-800">{resumeData.summary}</p>
                          </section>
                          <section>
                            <h2 className="text-sm font-black border-b-2 border-black pb-2 mb-5 uppercase tracking-widest text-black">Experience</h2>
                            <div className="text-sm font-semibold leading-relaxed text-gray-800 whitespace-pre-line font-sans">
                              {resumeData.experience}
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTemplate === 'minimal' && (
                    <div className="space-y-12 text-left h-full w-full" dir="ltr">
                      <header className="mb-12">
                        <h1 className="text-5xl sm:text-6xl font-black text-black mb-5 tracking-tighter font-heading">{resumeData.fullName}</h1>
                        <div className="flex flex-wrap gap-4 text-sm font-bold font-sans text-gray-600">
                          <span className="text-black uppercase tracking-wider">{resumeData.jobTitle}</span>
                          <span>•</span>
                          <span>{resumeData.email}</span>
                          <span>•</span>
                          <span>{resumeData.phone}</span>
                        </div>
                      </header>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
                        <div className="sm:col-span-1 border-t-2 border-black pt-4">
                          <h2 className="text-xs font-black uppercase tracking-widest text-black mb-2">About</h2>
                        </div>
                        <div className="sm:col-span-3 border-t-2 border-black pt-4">
                          <p className="text-sm font-medium leading-relaxed text-black">{resumeData.summary}</p>
                        </div>
                        
                        <div className="sm:col-span-1 border-t-2 border-black pt-4">
                          <h2 className="text-xs font-black uppercase tracking-widest text-black mb-2">Work</h2>
                        </div>
                        <div className="sm:col-span-3 border-t-2 border-black pt-4">
                          <div className="text-sm font-medium leading-relaxed text-black whitespace-pre-line font-sans">
                            {resumeData.experience}
                          </div>
                        </div>

                        <div className="sm:col-span-1 border-t-2 border-black pt-4">
                          <h2 className="text-xs font-black uppercase tracking-widest text-black mb-2">Study</h2>
                        </div>
                        <div className="sm:col-span-3 border-t-2 border-black pt-4">
                          <p className="text-sm font-medium leading-relaxed text-black whitespace-pre-line">{resumeData.education}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTemplate !== 'modern' && (
                    <footer className="mt-20 pt-8 border-t border-gray-200 text-[10px] text-center font-bold text-gray-400 font-sans uppercase tracking-widest">
                      Generated by Khabir
                    </footer>
                  )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
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

function ResumeSections({ data }: { data: any }) {
  return (
    <>
      <section className="w-full">
        <h2 className="text-xs font-black bg-black text-white px-4 py-1.5 inline-block mb-4 uppercase tracking-widest rounded-sm">Summary</h2>
        <p className="text-sm font-semibold leading-relaxed text-gray-800 text-justify">{data.summary}</p>
      </section>

      <section className="w-full">
        <h2 className="text-xs font-black bg-black text-white px-4 py-1.5 inline-block mb-4 uppercase tracking-widest rounded-sm">Experience</h2>
        <div className="text-sm font-semibold leading-relaxed text-gray-800 whitespace-pre-line space-y-3 font-sans">
          {data.experience}
        </div>
      </section>

      <section className="w-full">
        <h2 className="text-xs font-black bg-black text-white px-4 py-1.5 inline-block mb-4 uppercase tracking-widest rounded-sm">Education</h2>
        <p className="text-sm font-semibold leading-relaxed text-gray-800">{data.education}</p>
      </section>
    </>
  );
}
