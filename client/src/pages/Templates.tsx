import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FileText, Check, Eye } from "lucide-react";

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
    <div className="min-h-screen bg-background font-sans pb-24">
      <Navbar />
      <main className="container px-4 mx-auto py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge className="mb-6 px-4 py-1 rounded-full bg-background text-foreground border font-bold">
            {isRtl ? "قالب موحّد" : "Single Template"}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 tracking-tight">
            {isRtl ? "قالب ATS الوحيد" : "The ATS Template"}
          </h1>
          <p className="text-foreground text-lg font-bold">
            {isRtl 
              ? "تنسيق واحد مصمم بدقة لتجاوز أنظمة ATS مع أقصى دقة قراءة آلية."
              : "A single layout precision-engineered to pass ATS filters with maximum parsing accuracy."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="group overflow-hidden border transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-2 flex flex-col h-full bg-card rounded-[2rem]">
              <div className="h-48 bg-background relative overflow-hidden flex items-center justify-center border-b">
                <FileText className="h-16 w-16 group-hover:scale-110 transition-transform duration-500 text-foreground" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <Badge variant="outline" className="border backdrop-blur-md font-bold bg-background text-foreground">
                    {isRtl ? "متوافق مع ATS" : "ATS"}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pt-8">
                <CardTitle className="text-2xl font-heading font-bold">
                  {isRtl ? "صديق لأنظمة التوظيف" : "ATS Friendly"}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="text-foreground leading-relaxed font-bold text-sm">
                  {isRtl 
                    ? "تنسيق عمود واحد بعناوين قياسية وتواصل نصي واضح — يضمن قراءة دقيقة من قبل أي نظام توظيف."
                    : "Single-column layout with standard headings and plain-text contact info — ensuring accurate parsing by any ATS."}
                </p>
                <ul className="mt-6 space-y-3">
                  {[1, 2, 3].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground font-bold">
                      <Check className="h-4 w-4 shrink-0" />
                      <span>
                        {isRtl 
                          ? (item === 1 ? "متوافق 100% مع ATS" : item === 2 ? "تنسيق نظيف ومنظم" : "سهل التخصيص")
                          : (item === 1 ? "100% ATS Compatible" : item === 2 ? "Clean & Organized" : "Easy to Customize")}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="grid grid-cols-2 gap-4 pb-8">
                <Button variant="outline" className="w-full rounded-xl font-bold border-foreground" asChild>
                  <Link href="/editor">
                    <Eye className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                    {isRtl ? "معاينة" : "Preview"}
                  </Link>
                </Button>
                <Button className="w-full rounded-xl font-bold" asChild>
                  <Link href="/editor">
                    {isRtl ? "استخدام" : "Use This"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        <div className="mt-20 bg-foreground text-background rounded-[3rem] p-12 border text-center max-w-4xl mx-auto shadow-xl">
          <h2 className="text-3xl font-heading font-bold mb-4">
            {isRtl ? "هل تبحث عن شيء مخصص؟" : "Looking for something custom?"}
          </h2>
          <p className="text-background font-bold mb-8 max-w-lg mx-auto">
            {isRtl 
              ? "خبير AI يمكنه مساعدتك في بناء قالب فريد يناسب تخصصك النادر."
              : "Khabir AI can help you build a unique template tailored to your specific niche."}
          </p>
          <Button size="lg" className="rounded-full px-10 bg-background text-foreground hover:bg-background font-bold h-14">
            {isRtl ? "تحدث مع خبير AI" : "Chat with Khabir AI"}
          </Button>
        </div>
      </main>
    </div>
  );
}