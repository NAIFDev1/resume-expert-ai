import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FileText, Layout, Zap, Check, Eye } from "lucide-react";

const templates = [
  {
    id: "classic",
    nameEn: "Classic Professional",
    nameAr: "الاحترافي الكلاسيكي",
    descEn: "Clean, traditional layout perfect for corporate and conservative industries.",
    descAr: "تنسيق تقليدي ونظيف، مثالي للقطاعات الشركاتية والصناعات المحافظة.",
    type: "Classic",
    typeAr: "كلاسيكي",
    icon: FileText,
    color: "bg-blue-500",
  },
  {
    id: "modern",
    nameEn: "Modern Minimalist",
    nameAr: "عصري مبسط",
    descEn: "Sleek and creative design for tech, startups, and creative roles.",
    descAr: "تصميم أنيق وإبداعي للتقنية، الشركات الناشئة، والأدوار الإبداعية.",
    type: "Modern",
    typeAr: "عصري",
    icon: Layout,
    color: "bg-purple-500",
  },
  {
    id: "tech",
    nameEn: "Tech Focused",
    nameAr: "المسار التقني",
    descEn: "Designed to highlight technical skills and project-based experience.",
    descAr: "مصمم لإبراز المهارات التقنية والخبرات القائمة على المشاريع.",
    type: "Technical",
    typeAr: "تقني",
    icon: Zap,
    color: "bg-emerald-500",
  }
];

export default function Templates() {
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    const checkLang = () => setIsRtl(document.documentElement.dir === 'rtl');
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-muted/20 font-sans">
      <Navbar />
      <main className="container px-4 mx-auto py-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge className="mb-4 px-4 py-1 rounded-full bg-primary/10 text-primary border-primary/20">
            {isRtl ? "نماذج معتمدة" : "Verified Templates"}
          </Badge>
          <h1 className="text-4xl font-heading font-bold mb-4">
            {isRtl ? "اختر القالب المثالي لمسارك" : "Choose the Perfect Template"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isRtl 
              ? "قوالب مصممة بدقة لتتوافق مع أنظمة ATS وتبرز مهاراتك أمام مديري التوظيف."
              : "Precision-engineered templates designed to pass ATS filters and stand out to recruiters."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden border-primary/10 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-2 flex flex-col h-full bg-card">
                <div className={`h-48 ${template.color} relative overflow-hidden flex items-center justify-center bg-opacity-90`}>
                  <div className="absolute inset-0 bg-grid-white/10" />
                  <template.icon className="h-20 w-20 text-white/40 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <Badge variant="secondary" className="bg-white/20 text-white border-none backdrop-blur-md">
                      {isRtl ? template.typeAr : template.type}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-2xl font-heading">
                    {isRtl ? template.nameAr : template.nameEn}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <p className="text-muted-foreground leading-relaxed">
                    {isRtl ? template.descAr : template.descEn}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {[1, 2, 3].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-foreground/80">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        <span>
                          {isRtl 
                            ? (item === 1 ? "متوافق 100% مع ATS" : item === 2 ? "تنسيق نظيف ومنظم" : "سهل التخصيص")
                            : (item === 1 ? "100% ATS Compatible" : item === 2 ? "Clean & Organized" : "Easy to Customize")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="grid grid-cols-2 gap-4 pt-0">
                  <Button variant="outline" className="w-full group/btn">
                    <Eye className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                    {isRtl ? "معاينة" : "Preview"}
                  </Button>
                  <Button className="w-full">
                    {isRtl ? "استخدام" : "Use This"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 bg-primary/5 rounded-3xl p-10 border border-primary/10 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-heading font-bold mb-4">
            {isRtl ? "هل تبحث عن شيء مخصص؟" : "Looking for something custom?"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isRtl 
              ? "خبير AI يمكنه مساعدتك في بناء قالب فريد يناسب تخصصك النادر."
              : "Khabir AI can help you build a unique template tailored to your specific niche."}
          </p>
          <Button size="lg" className="rounded-full px-8">
            {isRtl ? "تحدث مع خبير AI" : "Chat with Khabir AI"}
          </Button>
        </div>
      </main>
    </div>
  );
}
