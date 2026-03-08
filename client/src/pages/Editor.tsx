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
        // Translate to EN
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
        // Translate to AR
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
    
    // Check for template in URL
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
    { id: "modern", name: isRtl ? "مودرن" : "Modern" },
    { id: "minimal", name: isRtl ? "مينيمال" : "Minimal" },
  ];

  return (
    <div className="min-h-screen bg-background font-sans pb-24">
      <Navbar />
      <main className="container px-4 mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-160px)]">
          {/* Editor Side */}
          <div className="w-full lg:w-2/5 overflow-y-auto pr-2 custom-scrollbar">
            <Card className="border shadow-xl bg-card rounded-[2rem] sticky top-0">
              <CardHeader className="border-b pb-4">
                <CardTitle className="flex items-center justify-between text-xl font-bold font-heading">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    {isRtl ? "محرر خبير الذكي" : "Khabir Smart Editor"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl border font-bold gap-2"
                      onClick={translateResume}
                      disabled={isTranslating}
                    >
                      {isTranslating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
                      {isRtl ? "ترجمة" : "Translate"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl border font-bold gap-2"
                      onClick={improveContent}
                      disabled={isImproving}
                    >
                      {isImproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                      {isRtl ? "تحسين" : "Improve"}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6 space-y-3">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <Layout className="h-4 w-4" />
                    {isRtl ? "اختر القالب" : "Choose Template"}
                  </label>
                  <div className="flex gap-2 p-1 bg-background rounded-xl border">
                    {templates.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setActiveTemplate(t.id)}
                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                          activeTemplate === t.id 
                            ? "bg-foreground text-background shadow-sm" 
                            : "hover:bg-background text-foreground"
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6 bg-background p-1 rounded-xl h-12 border">
                    <TabsTrigger value="personal" className="rounded-lg font-bold data-[state=active]:bg-foreground data-[state=active]:text-background">
                      <User className="h-4 w-4 md:mr-2" />
                      <span className="hidden md:inline">{isRtl ? "الشخصية" : "Personal"}</span>
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="rounded-lg font-bold data-[state=active]:bg-foreground data-[state=active]:text-background">
                      <Briefcase className="h-4 w-4 md:mr-2" />
                      <span className="hidden md:inline">{isRtl ? "الخبرة" : "Experience"}</span>
                    </TabsTrigger>
                    <TabsTrigger value="education" className="rounded-lg font-bold data-[state=active]:bg-foreground data-[state=active]:text-background">
                      <GraduationCap className="h-4 w-4 md:mr-2" />
                      <span className="hidden md:inline">{isRtl ? "التعليم" : "Education"}</span>
                    </TabsTrigger>
                  </TabsList>

                  <AnimatePresence mode="wait">
                    <TabsContent value="personal" className="space-y-4 mt-0">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold">{isRtl ? "الاسم الكامل" : "Full Name"}</label>
                          <Input name="fullName" value={resumeData.fullName} onChange={handleInputChange} className="bg-background rounded-xl h-12 font-bold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold">{isRtl ? "المسمى الوظيفي" : "Job Title"}</label>
                          <Input name="jobTitle" value={resumeData.jobTitle} onChange={handleInputChange} className="bg-background rounded-xl h-12 font-bold" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-bold">{isRtl ? "البريد الإلكتروني" : "Email"}</label>
                            <Input name="email" value={resumeData.email} onChange={handleInputChange} className="bg-background rounded-xl h-12 font-bold font-sans" dir="ltr" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold">{isRtl ? "رقم الجوال" : "Phone"}</label>
                            <Input name="phone" value={resumeData.phone} onChange={handleInputChange} className="bg-background rounded-xl h-12 font-bold font-sans" dir="ltr" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold">{isRtl ? "نبذة تعريفية" : "Summary"}</label>
                          <Textarea name="summary" value={resumeData.summary} onChange={handleInputChange} className="min-h-[120px] bg-background rounded-xl resize-none font-bold leading-relaxed p-4" />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="experience" className="space-y-4 mt-0">
                      <div className="space-y-2">
                        <label className="text-sm font-bold">{isRtl ? "تفاصيل الخبرة المهنية" : "Professional Experience"}</label>
                        <Textarea name="experience" value={resumeData.experience} onChange={handleInputChange} className="min-h-[300px] bg-background rounded-xl resize-none font-bold text-sm leading-relaxed p-4 font-sans" dir={isRtl ? "rtl" : "ltr"} />
                        <p className="text-xs text-foreground font-bold">
                          {isRtl ? "* استخدم النقاط (-) لتنظيم مهامك" : "* Use bullet points (-) to organize tasks"}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="education" className="space-y-4 mt-0">
                      <div className="space-y-2">
                        <label className="text-sm font-bold">{isRtl ? "المؤهلات العلمية" : "Education"}</label>
                        <Textarea name="education" value={resumeData.education} onChange={handleInputChange} className="min-h-[200px] bg-background rounded-xl resize-none font-bold p-4 leading-relaxed" />
                      </div>
                    </TabsContent>
                  </AnimatePresence>

                  <div className="mt-8 flex gap-3 pt-6 border-t">
                    <Button onClick={handleSave} className="flex-1 h-12 rounded-xl font-bold">
                      <Save className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                      {isRtl ? "حفظ السيرة" : "Save Resume"}
                    </Button>
                    <Button onClick={() => handlePrint()} variant="outline" className="flex-1 h-12 rounded-xl border font-bold">
                      <Download className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                      {isRtl ? "تحميل PDF" : "Download PDF"}
                    </Button>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Preview Side */}
          <div className="w-full lg:w-3/5 h-full overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
                {isRtl ? "معاينة حية" : "Live Preview"}
              </h3>
              <div className="flex gap-2">
                <div className="h-8 px-3 rounded-full bg-background border flex items-center justify-center text-xs font-bold uppercase">{activeTemplate}</div>
              </div>
            </div>
            
            <div className="flex-1 bg-background rounded-[2rem] p-4 md:p-8 overflow-y-auto border shadow-inner custom-scrollbar">
              <div ref={componentRef}>
                <Card className={`bg-white text-black shadow-2xl min-h-[842px] w-full max-w-[595px] mx-auto transition-all duration-300 transform origin-top ${
                  activeTemplate === 'modern' ? 'p-0 flex overflow-hidden' : 'p-12'
                } ${activeTemplate === 'minimal' ? 'font-sans border-t-8 border-black' : 'font-heading'}`}>
                
                {activeTemplate === 'classic' && (
                  <div className="space-y-8 text-left h-full" dir="ltr">
                    <header className="border-b-2 border-black pb-6 mb-8 text-center">
                      <h1 className="text-4xl font-bold uppercase tracking-widest text-black mb-2 font-heading">{resumeData.fullName}</h1>
                      <p className="font-bold tracking-wide text-lg mb-4 text-black">{resumeData.jobTitle}</p>
                      <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-sm text-black font-bold font-sans">
                        <span className="flex items-center gap-1">✉ {resumeData.email}</span>
                        <span className="flex items-center gap-1">📞 {resumeData.phone}</span>
                      </div>
                    </header>
                    <div className="space-y-8">
                      <ResumeSections data={resumeData} />
                    </div>
                  </div>
                )}

                {activeTemplate === 'modern' && (
                  <div className="flex h-full min-h-[842px]" dir="ltr">
                    <div className="w-1/3 bg-black text-white p-8">
                      <div className="w-24 h-24 bg-white text-black rounded-full mb-8 flex items-center justify-center text-4xl font-black mx-auto font-heading">
                        {resumeData.fullName.charAt(0)}
                      </div>
                      <div className="space-y-8">
                        <section>
                          <h3 className="text-xs font-black uppercase mb-4 tracking-wider border-b border-white pb-2">Contact</h3>
                          <div className="text-xs space-y-3 font-bold font-sans opacity-80">
                            <p className="break-all">{resumeData.email}</p>
                            <p>{resumeData.phone}</p>
                          </div>
                        </section>
                        <section>
                          <h3 className="text-xs font-black uppercase mb-4 tracking-wider border-b border-white pb-2">Education</h3>
                          <p className="text-xs font-bold leading-relaxed whitespace-pre-line opacity-80">{resumeData.education}</p>
                        </section>
                      </div>
                    </div>
                    <div className="flex-1 p-10 text-left bg-white">
                      <header className="mb-10">
                        <h1 className="text-4xl font-black text-black mb-2 font-heading">{resumeData.fullName}</h1>
                        <p className="text-xl font-bold text-black">{resumeData.jobTitle}</p>
                      </header>
                      <div className="space-y-8">
                        <section>
                          <h2 className="text-sm font-black border-b-2 border-black pb-2 mb-4 uppercase tracking-widest">Summary</h2>
                          <p className="text-sm font-bold leading-relaxed text-black">{resumeData.summary}</p>
                        </section>
                        <section>
                          <h2 className="text-sm font-black border-b-2 border-black pb-2 mb-4 uppercase tracking-widest">Experience</h2>
                          <div className="text-sm font-bold leading-relaxed text-black whitespace-pre-line font-sans">
                            {resumeData.experience}
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                )}

                {activeTemplate === 'minimal' && (
                  <div className="space-y-10 text-left h-full p-12" dir="ltr">
                    <header>
                      <h1 className="text-5xl font-black text-black mb-4 tracking-tighter font-heading">{resumeData.fullName}</h1>
                      <div className="flex flex-wrap gap-4 text-sm font-bold font-sans text-black">
                        <span className="text-black">{resumeData.jobTitle}</span>
                        <span>•</span>
                        <span>{resumeData.email}</span>
                        <span>•</span>
                        <span>{resumeData.phone}</span>
                      </div>
                    </header>
                    <div className="grid grid-cols-4 gap-8">
                      <div className="col-span-1 border-t-2 border-black pt-4">
                        <h2 className="text-xs font-black uppercase tracking-widest text-black mb-2">About</h2>
                      </div>
                      <div className="col-span-3 border-t-2 border-black pt-4">
                        <p className="text-sm font-bold leading-relaxed text-black">{resumeData.summary}</p>
                      </div>
                      
                      <div className="col-span-1 border-t-2 border-black pt-4">
                        <h2 className="text-xs font-black uppercase tracking-widest text-black mb-2">Work</h2>
                      </div>
                      <div className="col-span-3 border-t-2 border-black pt-4">
                        <div className="text-sm font-bold leading-relaxed text-black whitespace-pre-line font-sans">
                          {resumeData.experience}
                        </div>
                      </div>

                      <div className="col-span-1 border-t-2 border-black pt-4">
                        <h2 className="text-xs font-black uppercase tracking-widest text-black mb-2">Study</h2>
                      </div>
                      <div className="col-span-3 border-t-2 border-black pt-4">
                        <p className="text-sm font-bold leading-relaxed text-black whitespace-pre-line">{resumeData.education}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTemplate !== 'modern' && (
                  <footer className="mt-20 pt-8 border-t border-black text-[10px] text-center font-bold text-black font-sans uppercase tracking-widest">
                    Generated by Khabir
                  </footer>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
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
      <section>
        <h2 className="text-xs font-black bg-black text-white px-3 py-1 inline-block mb-3 uppercase tracking-widest">Summary</h2>
        <p className="text-sm font-bold leading-relaxed text-black text-justify">{data.summary}</p>
      </section>

      <section>
        <h2 className="text-xs font-black bg-black text-white px-3 py-1 inline-block mb-3 uppercase tracking-widest">Experience</h2>
        <div className="text-sm font-bold leading-relaxed text-black whitespace-pre-line space-y-2 font-sans">
          {data.experience}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-black bg-black text-white px-3 py-1 inline-block mb-3 uppercase tracking-widest">Education</h2>
        <p className="text-sm font-bold leading-relaxed text-black">{data.education}</p>
      </section>
    </>
  );
}
