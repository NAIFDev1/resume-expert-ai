import { Navbar } from "@/components/layout/Navbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HelpCircle, Zap, ShieldCheck, Target, FileText, Sparkles } from "lucide-react";

const faqData = [
  {
    id: "item-1",
    questionAr: "ما هو نظام الـ ATS وكيف يعمل؟",
    questionEn: "What is an ATS and how does it work?",
    answerAr: "نظام ATS هو برنامج تستخدمه الشركات لفرز السير الذاتية آلياً. يعمل عن طريق البحث عن كلمات مفتاحية محددة، مهارات، وتواريخ خبرة معينة. إذا لم تكن سيرتك الذاتية منسقة بشكل صحيح لهذا النظام، فقد يتم استبعادها حتى لو كنت مؤهلاً.",
    answerEn: "An ATS is software used by companies to sort resumes automatically. It works by searching for specific keywords, skills, and experience dates. If your resume isn't formatted correctly for this system, it might be filtered out even if you're qualified.",
    icon: Target
  },
  {
    id: "item-2",
    questionAr: "كيف يمكنني تحسين نسبة المطابقة (Match Rate)؟",
    questionEn: "How can I improve my Match Rate?",
    answerAr: "لرفع نسبة المطابقة، تأكد من تضمين الكلمات المفتاحية الموجودة في 'الوصف الوظيفي' داخل خبراتك ومهاراتك. استخدم ميزة 'تحسين بالذكاء' في المحرر لضبط صياغتك تلقائياً.",
    answerEn: "To improve your Match Rate, ensure you include keywords from the 'Job Description' within your experience and skills sections. Use the 'AI Improve' feature in the editor to automatically adjust your phrasing.",
    icon: Sparkles
  },
  {
    id: "item-3",
    questionAr: "هل يدعم 'خبير' السير الذاتية باللغة العربية؟",
    questionEn: "Does Khabir support Arabic resumes?",
    answerAr: "نعم، 'خبير' مصمم خصيصاً لدعم اللغة العربية والإنجليزية بذكاء، مع مراعاة اتجاهات الكتابة (RTL) والمصطلحات المهنية المستخدمة في السوق العربي والعالمي.",
    answerEn: "Yes, Khabir is specifically designed to support both Arabic and English intelligently, handling RTL layouts and professional terminology used in both regional and international markets.",
    icon: FileText
  },
  {
    id: "item-4",
    questionAr: "كيف أجعل سيرتي الذاتية متوافقة مع الـ ATS؟",
    questionEn: "How do I make my resume ATS-friendly?",
    answerAr: "لجعلها متوافقة: 1. استخدم تنسيقاً بسيطاً وعموداً واحداً. 2. تجنب الجداول والرسومات المعقدة. 3. استخدم كلمات مفتاحية مطابقة للوصف الوظيفي. 4. احفظ الملف بصيغة PDF نصية. قوالب 'خبير' تضمن لك كل هذه المعايير تلقائياً.",
    answerEn: "To make it friendly: 1. Use a simple, single-column layout. 2. Avoid tables and complex graphics. 3. Use keywords that match the job description. 4. Save as a text-based PDF. Khabir templates ensure all these standards automatically.",
    icon: ShieldCheck
  },
  {
    id: "item-5",
    questionAr: "هل بياناتي آمنة وسرية؟",
    questionEn: "Is my data safe and private?",
    answerAr: "بكل تأكيد. نحن نستخدم تقنيات تشفير متطورة ولا نقوم بمشاركة بياناتك الشخصية مع أي أطراف خارجية. خصوصيتك هي أولويتنا القصوى.",
    answerEn: "Absolutely. We use advanced encryption technologies and do not share your personal data with third parties. Your privacy is our top priority.",
    icon: ShieldCheck
  }
];

export default function FAQ() {
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
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6">
            <HelpCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              {isRtl ? "مركز المساعدة" : "Help Center"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            {isRtl ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {isRtl 
              ? "كل ما تحتاج معرفته عن أنظمة الـ ATS وكيفية استخدام خبير للنجاح المهني."
              : "Everything you need to know about ATS systems and how to use Khabir for career success."}
          </p>
        </motion.div>

        <Card className="border-primary/5 shadow-2xl bg-card/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((item, index) => {
              const Icon = item.icon;
              return (
                <AccordionItem 
                  key={item.id} 
                  value={item.id}
                  className="border-b border-primary/5 last:border-0 pb-2"
                >
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-right">
                      <div className="p-3 bg-primary/5 rounded-2xl group-hover:bg-primary/10 transition-colors">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-lg font-bold">
                        {isRtl ? item.questionAr : item.questionEn}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-lg leading-relaxed pt-2 pb-6 px-16">
                    {isRtl ? item.answerAr : item.answerEn}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </Card>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 p-8 rounded-[2rem] bg-primary/5 border border-primary/10 text-center"
        >
          <h3 className="text-xl font-bold mb-4">
            {isRtl ? "لم تجد إجابتك؟" : "Didn't find your answer?"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {isRtl 
              ? "فريق الدعم لدينا متاح دائماً لمساعدتك في رحلتك المهنية."
              : "Our support team is always available to help you on your career journey."}
          </p>
          <Button variant="outline" className="rounded-xl px-8 border-primary/20 hover:bg-primary/10">
            {isRtl ? "تواصل معنا" : "Contact Support"}
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
