import { Navbar } from "@/components/layout/Navbar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HelpCircle, ShieldCheck, Zap, Cpu, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    id: "item-1",
    questionEn: "How does Khabir AI analyze my resume?",
    questionAr: "كيف يقوم خبير AI بتحليل سيرتي الذاتية؟",
    answerEn: "Our AI uses advanced Natural Language Processing (NLP) to scan your resume just like an Applicant Tracking System (ATS). It identifies keywords, experience patterns, and structural issues to give you a realistic score.",
    answerAr: "يستخدم ذكاؤنا الاصطناعي معالجة اللغات الطبيعية (NLP) المتقدمة لمسح سيرتك الذاتية تماماً كما يفعل نظام تتبع المتقدمين (ATS). يحدد الكلمات المفتاحية، أنماط الخبرة، والمشاكل الهيكلية ليعطيك نتيجة واقعية.",
    icon: Cpu
  },
  {
    id: "item-2",
    questionEn: "Is my personal data safe?",
    questionAr: "هل بياناتي الشخصية آمنة؟",
    answerEn: "Absolutely. We prioritize your privacy. Your uploaded files are processed in real-time and are not stored permanently unless you choose to save them to your profile. We never share your data with third parties.",
    answerAr: "بكل تأكيد. نحن نضع خصوصيتك كأولوية قصوى. يتم معالجة ملفاتك المرفوعة في الوقت الفعلي ولا يتم تخزينها بشكل دائم إلا إذا اخترت حفظها في ملفك الشخصي. نحن لا نشارك بياناتك مع أي طرف ثالث.",
    icon: ShieldCheck
  },
  {
    id: "item-3",
    questionEn: "What is an ATS score?",
    questionAr: "ما هي درجة الـ ATS؟",
    answerEn: "ATS stands for Applicant Tracking System. Most companies use this software to filter resumes. A higher score means your resume is more likely to be seen by a human recruiter because it matches the formatting and keyword requirements.",
    answerAr: "ATS هو اختصار لنظام تتبع المتقدمين. تستخدم معظم الشركات هذه البرامج لتصفية السير الذاتية. النتيجة العالية تعني أن سيرتك الذاتية أكثر عرضة للمراجعة من قبل مسؤول توظيف بشري لأنها تطابق متطلبات التنسيق والكلمات المفتاحية.",
    icon: Search
  },
  {
    id: "item-4",
    questionEn: "How can I improve my score quickly?",
    questionAr: "كيف يمكنني تحسين درجتي بسرعة؟",
    answerEn: "Use our 'AI Smart Fix' feature! It identifies specific areas for improvement and suggests precise wording changes that are more likely to pass through automated filters.",
    answerAr: "استخدم ميزة 'الإصلاح الذكي' الخاصة بنا! فهي تحدد مجالات معينة للتحسين وتقترح تغييرات دقيقة في الصياغة من المرجح أن تمر عبر الفلاتر الآلية.",
    icon: Zap
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
    <div className="min-h-screen bg-muted/20 font-sans pb-24">
      <Navbar />
      <main className="container px-4 mx-auto py-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge className="mb-4 px-4 py-1 rounded-full bg-primary/10 text-primary border-primary/20">
            {isRtl ? "مركز المساعدة" : "Help Center"}
          </Badge>
          <h1 className="text-4xl font-heading font-bold mb-4 flex items-center justify-center gap-3">
            <HelpCircle className="h-10 w-10 text-primary" />
            {isRtl ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isRtl 
              ? "كل ما تحتاج معرفته عن كيفية عمل خبير AI وتطوير مسارك المهني."
              : "Everything you need to know about how Khabir AI works and boosts your career path."}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AccordionItem value={faq.id} className="bg-card border border-primary/10 rounded-2xl overflow-hidden px-6 shadow-sm hover:shadow-md transition-shadow">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className={`flex items-center gap-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                      <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                        <faq.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-lg font-semibold">
                        {isRtl ? faq.questionAr : faq.questionEn}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6 pt-2">
                    {isRtl ? faq.answerAr : faq.answerEn}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>

        <div className="mt-20 text-center">
          <p className="text-muted-foreground mb-4">
            {isRtl ? "هل لديك سؤال آخر؟" : "Have more questions?"}
          </p>
          <a href="mailto:support@khabir.ai" className="text-primary font-bold hover:underline">
            support@khabir.ai
          </a>
        </div>
      </main>
    </div>
  );
}
