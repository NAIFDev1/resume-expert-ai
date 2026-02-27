import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Save, User, Briefcase, GraduationCap, Sparkles, Layout } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useReactToPrint } from "react-to-print";

export default function Editor() {
  const [isRtl, setIsRtl] = useState(false);
  const { toast } = useToast();
  const [activeTemplate, setActiveTemplate] = useState("classic");
  const componentRef = useRef<HTMLDivElement>(null);
  const [resumeData, setResumeData] = useState({
    fullName: "أحمد محمد",
    jobTitle: "مطور برمجيات",
    email: "ahmed@example.com",
    phone: "+966 50 000 0000",
    summary: "مطور برمجيات شغوف ببناء تطبيقات ويب عالية الجودة وتجربة مستخدم مميزة.",
    experience: "• مطور واجهات أمامية في شركة تقنية (2022 - الحالي)\n• تطوير تطبيقات باستخدام React و Tailwind CSS\n• تحسين أداء المواقع بنسبة 30%",
    education: "بكالوريوس علوم الحاسب - جامعة الملك سعود (2021)",
  });

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
            <Card className="border-primary/10 shadow-xl bg-card/50 backdrop-blur-sm sticky top-0">
              <CardHeader className="border-b bg-muted/30 pb-4">
                <CardTitle className="flex items-center justify-between text-xl">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    {isRtl ? "محرر خبير الذكي" : "Khabir Smart Editor"}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6 space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    <Layout className="h-4 w-4" />
                    {isRtl ? "اختر القالب" : "Choose Template"}
                  </label>
                  <div className="flex gap-2 p-1 bg-muted/50 rounded-xl">
                    {templates.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setActiveTemplate(t.id)}
                        className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-all ${
                          activeTemplate === t.id 
                            ? "bg-primary text-primary-foreground shadow-sm" 
                            : "hover:bg-primary/10 text-muted-foreground"
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger value="personal" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <User className="h-4 w-4 md:mr-2" />
                      <span className="hidden md:inline">{isRtl ? "الشخصية" : "Personal"}</span>
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <Briefcase className="h-4 w-4 md:mr-2" />
                      <span className="hidden md:inline">{isRtl ? "الخبرة" : "Experience"}</span>
                    </TabsTrigger>
                    <TabsTrigger value="education" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <GraduationCap className="h-4 w-4 md:mr-2" />
                      <span className="hidden md:inline">{isRtl ? "التعليم" : "Education"}</span>
                    </TabsTrigger>
                  </TabsList>

                  <AnimatePresence mode="wait">
                    <TabsContent value="personal" className="space-y-4 mt-0">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-muted-foreground">{isRtl ? "الاسم الكامل" : "Full Name"}</label>
                          <Input name="fullName" value={resumeData.fullName} onChange={handleInputChange} className="bg-background/50 focus-visible:ring-primary/30" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-muted-foreground">{isRtl ? "المسمى الوظيفي" : "Job Title"}</label>
                          <Input name="jobTitle" value={resumeData.jobTitle} onChange={handleInputChange} className="bg-background/50 focus-visible:ring-primary/30" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground">{isRtl ? "البريد الإلكتروني" : "Email"}</label>
                            <Input name="email" value={resumeData.email} onChange={handleInputChange} className="bg-background/50 focus-visible:ring-primary/30" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground">{isRtl ? "رقم الجوال" : "Phone"}</label>
                            <Input name="phone" value={resumeData.phone} onChange={handleInputChange} className="bg-background/50 focus-visible:ring-primary/30" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-muted-foreground">{isRtl ? "نبذة تعريفية" : "Summary"}</label>
                          <Textarea name="summary" value={resumeData.summary} onChange={handleInputChange} className="min-h-[120px] bg-background/50 focus-visible:ring-primary/30 resize-none" />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="experience" className="space-y-4 mt-0">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">{isRtl ? "تفاصيل الخبرة المهنية" : "Professional Experience"}</label>
                        <Textarea name="experience" value={resumeData.experience} onChange={handleInputChange} className="min-h-[300px] bg-background/50 focus-visible:ring-primary/30 resize-none font-mono text-sm" />
                        <p className="text-xs text-muted-foreground italic">
                          {isRtl ? "* استخدم النقاط لتنظيم مهامك" : "* Use bullet points to organize tasks"}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="education" className="space-y-4 mt-0">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">{isRtl ? "المؤهلات العلمية" : "Education"}</label>
                        <Textarea name="education" value={resumeData.education} onChange={handleInputChange} className="min-h-[200px] bg-background/50 focus-visible:ring-primary/30 resize-none" />
                      </div>
                    </TabsContent>
                  </AnimatePresence>

                  <div className="mt-8 flex gap-3 pt-6 border-t">
                    <Button onClick={handleSave} className="flex-1 h-12 rounded-xl shadow-lg shadow-primary/20">
                      <Save className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                      {isRtl ? "حفظ السيرة" : "Save Resume"}
                    </Button>
                    <Button onClick={() => handlePrint()} variant="outline" className="flex-1 h-12 rounded-xl border-primary/20 hover:bg-primary/5">
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
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {isRtl ? "معاينة حية" : "Live Preview"}
              </h3>
              <div className="flex gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold uppercase">{activeTemplate}</div>
              </div>
            </div>
            
            <div className="flex-1 bg-muted/30 rounded-2xl p-4 md:p-8 overflow-y-auto border shadow-inner custom-scrollbar">
              <div ref={componentRef}>
                <Card className={`bg-white text-slate-900 shadow-2xl min-h-[842px] w-full max-w-[595px] mx-auto transition-all duration-300 transform origin-top ${
                  activeTemplate === 'modern' ? 'p-0 flex overflow-hidden' : 'p-12'
                } ${activeTemplate === 'minimal' ? 'font-sans border-t-8 border-primary' : 'font-serif'}`}>
                
                {activeTemplate === 'classic' && (
                  <>
                    <header className="border-b-2 border-slate-900 pb-6 mb-8 text-center">
                      <h1 className="text-4xl font-bold uppercase tracking-widest text-slate-900 mb-2">{resumeData.fullName}</h1>
                      <p className="text-primary font-medium tracking-wide text-lg mb-4">{resumeData.jobTitle}</p>
                      <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 italic">
                        <span className="flex items-center gap-1">✉ {resumeData.email}</span>
                        <span className="flex items-center gap-1">📞 {resumeData.phone}</span>
                      </div>
                    </header>
                    <div className="space-y-8 text-left" dir="ltr">
                      <ResumeSections data={resumeData} />
                    </div>
                  </>
                )}

                {activeTemplate === 'modern' && (
                  <>
                    <div className="w-1/3 bg-slate-900 text-white p-8">
                      <div className="w-24 h-24 bg-primary/20 rounded-full mb-8 flex items-center justify-center text-3xl font-bold border-2 border-primary/50">
                        {resumeData.fullName.charAt(0)}
                      </div>
                      <div className="space-y-6">
                        <section>
                          <h3 className="text-xs font-bold uppercase text-primary mb-4 tracking-wider">Contact</h3>
                          <div className="text-[11px] space-y-2 text-slate-300">
                            <p>✉ {resumeData.email}</p>
                            <p>📞 {resumeData.phone}</p>
                          </div>
                        </section>
                        <section>
                          <h3 className="text-xs font-bold uppercase text-primary mb-4 tracking-wider">Education</h3>
                          <p className="text-[11px] text-slate-300 leading-relaxed">{resumeData.education}</p>
                        </section>
                      </div>
                    </div>
                    <div className="flex-1 p-10 text-left" dir="ltr">
                      <header className="mb-10">
                        <h1 className="text-4xl font-bold text-slate-900 mb-1">{resumeData.fullName}</h1>
                        <p className="text-xl text-primary font-medium">{resumeData.jobTitle}</p>
                      </header>
                      <div className="space-y-8">
                        <section>
                          <h2 className="text-sm font-bold border-b-2 border-slate-100 pb-2 mb-4 uppercase tracking-widest">Summary</h2>
                          <p className="text-[13px] leading-relaxed text-slate-600">{resumeData.summary}</p>
                        </section>
                        <section>
                          <h2 className="text-sm font-bold border-b-2 border-slate-100 pb-2 mb-4 uppercase tracking-widest">Experience</h2>
                          <div className="text-[13px] leading-relaxed text-slate-600 whitespace-pre-line">
                            {resumeData.experience}
                          </div>
                        </section>
                      </div>
                    </div>
                  </>
                )}

                {activeTemplate === 'minimal' && (
                  <div className="space-y-10 text-left" dir="ltr">
                    <header>
                      <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">{resumeData.fullName}</h1>
                      <div className="flex gap-4 text-sm font-medium text-primary">
                        <span>{resumeData.jobTitle}</span>
                        <span className="text-slate-300">•</span>
                        <span>{resumeData.email}</span>
                        <span className="text-slate-300">•</span>
                        <span>{resumeData.phone}</span>
                      </div>
                    </header>
                    <div className="grid grid-cols-4 gap-8">
                      <div className="col-span-1">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">About</h2>
                      </div>
                      <div className="col-span-3">
                        <p className="text-sm leading-relaxed text-slate-600">{resumeData.summary}</p>
                      </div>
                      
                      <div className="col-span-1">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Work</h2>
                      </div>
                      <div className="col-span-3">
                        <div className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                          {resumeData.experience}
                        </div>
                      </div>

                      <div className="col-span-1">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Study</h2>
                      </div>
                      <div className="col-span-3">
                        <p className="text-sm leading-relaxed text-slate-600">{resumeData.education}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTemplate !== 'modern' && (
                  <footer className="mt-20 pt-8 border-t border-slate-100 text-[10px] text-center text-slate-400">
                    Generated by Khabir AI - khabir.ai
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
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--primary), 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--primary), 0.2);
        }
      `}} />
    </div>
  );
}

function ResumeSections({ data }: { data: any }) {
  return (
    <>
      <section>
        <h2 className="text-xs font-black bg-slate-100 px-3 py-1 inline-block mb-3 uppercase tracking-[0.2em] text-slate-900">Summary</h2>
        <p className="text-[13px] leading-relaxed text-slate-700 text-justify">{data.summary}</p>
      </section>

      <section>
        <h2 className="text-xs font-black bg-slate-100 px-3 py-1 inline-block mb-3 uppercase tracking-[0.2em] text-slate-900">Experience</h2>
        <div className="text-[13px] leading-relaxed text-slate-700 whitespace-pre-line space-y-2">
          {data.experience}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-black bg-slate-100 px-3 py-1 inline-block mb-3 uppercase tracking-[0.2em] text-slate-900">Education</h2>
        <p className="text-[13px] leading-relaxed text-slate-700">{data.education}</p>
      </section>
    </>
  );
}
