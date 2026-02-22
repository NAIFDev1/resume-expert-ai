import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Save, User, Briefcase, GraduationCap, Sparkles, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Editor() {
  const [isRtl, setIsRtl] = useState(false);
  const { toast } = useToast();
  const [resumeData, setResumeData] = useState({
    fullName: "أحمد محمد / Ahmed Mohamed",
    jobTitle: "مطور برمجيات / Software Developer",
    email: "ahmed@example.com",
    phone: "+966 50 000 0000",
    summary: "مطور برمجيات شغوف ببناء تطبيقات ويب عالية الجودة وتجربة مستخدم مميزة. / Passionate software developer focused on building high-quality web applications and exceptional user experiences.",
    experience: "خبرة في React, Node.js و Tailwind CSS. / Experience in React, Node.js, and Tailwind CSS.",
    education: "بكالوريوس علوم الحاسب / BS in Computer Science",
  });

  useEffect(() => {
    const checkLang = () => setIsRtl(document.documentElement.dir === 'rtl');
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    toast({
      title: isRtl ? "تم الحفظ بنجاح" : "Saved Successfully",
      description: isRtl ? "تم حفظ تغييرات سيرتك الذاتية." : "Your resume changes have been saved.",
    });
  };

  return (
    <div className="min-h-screen bg-muted/20 font-sans pb-24">
      <Navbar />
      <main className="container px-4 mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Editor Side */}
          <div className="w-full lg:w-1/2 space-y-6">
            <Card className="border-primary/10 shadow-lg">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {isRtl ? "محرر خبير الذكي" : "Khabir Smart Editor"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="personal" className="gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{isRtl ? "الشخصية" : "Personal"}</span>
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span className="hidden sm:inline">{isRtl ? "الخبرة" : "Experience"}</span>
                    </TabsTrigger>
                    <TabsTrigger value="education" className="gap-2">
                      <GraduationCap className="h-4 w-4" />
                      <span className="hidden sm:inline">{isRtl ? "التعليم" : "Education"}</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{isRtl ? "الاسم الكامل" : "Full Name"}</label>
                        <Input name="fullName" value={resumeData.fullName} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{isRtl ? "المسمى الوظيفي" : "Job Title"}</label>
                        <Input name="jobTitle" value={resumeData.jobTitle} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{isRtl ? "البريد الإلكتروني" : "Email"}</label>
                        <Input name="email" value={resumeData.email} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{isRtl ? "رقم الجوال" : "Phone"}</label>
                        <Input name="phone" value={resumeData.phone} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{isRtl ? "نبذة تعريفية" : "Summary"}</label>
                      <Textarea name="summary" value={resumeData.summary} onChange={handleInputChange} className="min-h-[100px]" />
                    </div>
                  </TabsContent>

                  <TabsContent value="experience" className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{isRtl ? "تفاصيل الخبرة" : "Experience Details"}</label>
                      <Textarea name="experience" value={resumeData.experience} onChange={handleInputChange} className="min-h-[200px]" />
                    </div>
                  </TabsContent>

                  <TabsContent value="education" className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{isRtl ? "المؤهلات العلمية" : "Education Details"}</label>
                      <Textarea name="education" value={resumeData.education} onChange={handleInputChange} className="min-h-[150px]" />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-8 flex gap-3">
                  <Button onClick={handleSave} className="flex-1">
                    <Save className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                    {isRtl ? "حفظ التغييرات" : "Save Changes"}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                    {isRtl ? "تحميل PDF" : "Download PDF"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Side */}
          <div className="w-full lg:w-1/2">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">{isRtl ? "معاينة حية" : "Live Preview"}</h3>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  {isRtl ? "تنسيق كلاسيكي" : "Classic Layout"}
                </Badge>
              </div>
              <Card className="bg-white text-black shadow-2xl min-h-[600px] p-8 font-serif overflow-hidden border-none rounded-none shadow-primary/10">
                <motion.div 
                  layout
                  className="space-y-6 text-center border-b pb-6"
                >
                  <h1 className="text-3xl font-bold uppercase tracking-tight">{resumeData.fullName}</h1>
                  <p className="text-primary font-medium">{resumeData.jobTitle}</p>
                  <div className="flex justify-center gap-4 text-xs text-gray-500">
                    <span>{resumeData.email}</span>
                    <span>•</span>
                    <span>{resumeData.phone}</span>
                  </div>
                </motion.div>

                <div className="mt-8 space-y-8 text-left" dir="ltr">
                  <section>
                    <h2 className="text-sm font-bold border-b-2 border-black pb-1 mb-3 uppercase tracking-wider">Professional Summary</h2>
                    <p className="text-sm leading-relaxed text-gray-700">{resumeData.summary}</p>
                  </section>

                  <section>
                    <h2 className="text-sm font-bold border-b-2 border-black pb-1 mb-3 uppercase tracking-wider">Experience</h2>
                    <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">{resumeData.experience}</p>
                  </section>

                  <section>
                    <h2 className="text-sm font-bold border-b-2 border-black pb-1 mb-3 uppercase tracking-wider">Education</h2>
                    <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">{resumeData.education}</p>
                  </section>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Badge({ children, variant = "default", className = "" }: any) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${variant === "outline" ? "border" : "bg-primary text-primary-foreground"} ${className}`}>
      {children}
    </span>
  );
}
