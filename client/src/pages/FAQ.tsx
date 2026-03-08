import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HelpCircle, Mail, MessageSquare } from "lucide-react";

export default function FAQ() {
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    const checkLang = () => setIsRtl(document.documentElement.dir === 'rtl');
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    return () => observer.disconnect();
  }, []);

  const faqs = [
    {
      qAr: "ما هو نظام خبير وكيف يعمل؟",
      qEn: "What is Khabir and how does it work?",
      aAr: "خبير هو منصة ذكية لتحليل وتحسين السير الذاتية باستخدام الذكاء الاصطناعي. يقوم النظام بمقارنة سيرتك الذاتية مع متطلبات الوظيفة (ATS) وتقديم اقتراحات دقيقة لزيادة فرص قبولك.",
      aEn: "Khabir is an AI-powered resume analysis and improvement platform. It compares your resume against Applicant Tracking Systems (ATS) requirements and provides precise suggestions to increase your chances of being hired."
    },
    {
      qAr: "هل السير الذاتية آمنة ومحمية؟",
      qEn: "Are resumes safe and secure?",
      aAr: "نعم، نحن نولي خصوصيتك أولوية قصوى. لا يتم مشاركة سيرتك الذاتية مع أي طرف ثالث ويتم حذف الملفات من خوادمنا بعد انتهاء التحليل.",
      aEn: "Yes, we prioritize your privacy. Your resume is never shared with third parties and files are deleted from our servers after analysis."
    },
    {
      qAr: "هل يدعم النظام اللغتين العربية والإنجليزية؟",
      qEn: "Does the system support Arabic and English?",
      aAr: "بالتأكيد. خبير مصمم خصيصاً للتعامل مع السير الذاتية باللغتين العربية والإنجليزية بكفاءة عالية، مع القدرة على الترجمة الفورية بينهما.",
      aEn: "Absolutely. Khabir is specifically designed to handle both Arabic and English resumes with high accuracy, including instant translation capabilities."
    },
    {
      qAr: "ما هي نسبة التوافق (ATS Match Rate)؟",
      qEn: "What is the ATS Match Rate?",
      aAr: "هي نسبة مئوية توضح مدى تطابق المهارات والخبرات المكتوبة في سيرتك الذاتية مع الكلمات المفتاحية الموجودة في الوصف الوظيفي للمنصب الذي تتقدم إليه.",
      aEn: "It is a percentage that shows how well the skills and experiences in your resume match the keywords found in the job description of the position you're applying for."
    },
    {
      qAr: "هل يمكنني تصدير السيرة الذاتية بتنسيق PDF؟",
      qEn: "Can I export the resume in PDF format?",
      aAr: "نعم، يمكنك استخدام المحرر المدمج لتعديل سيرتك الذاتية واختيار أحد القوالب الاحترافية ثم تصديرها كملف PDF جاهز للتقديم.",
      aEn: "Yes, you can use the built-in editor to modify your resume, choose a professional template, and export it as a ready-to-submit PDF."
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans pb-24">
      <Navbar />
      <main className="container px-4 mx-auto py-12 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 pt-12"
        >
          <div className="w-20 h-20 bg-foreground rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
            <HelpCircle className="w-10 h-10 text-foreground -rotate-3" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black mb-6 tracking-tight">
            {isRtl ? "كيف يمكننا مساعدتك؟" : "How can we help you?"}
          </h1>
          <p className="text-xl text-foreground max-w-2xl mx-auto">
            {isRtl 
              ? "إجابات على الأسئلة الأكثر شيوعاً حول خبير وكيفية الاستفادة القصوى من خدماتنا."
              : "Answers to the most frequently asked questions about Khabir and how to make the most of our services."}
          </p>
        </motion.div>

        <div className="bg-card border shadow-xl shadow-primary/5 rounded-[2.5rem] p-8 md:p-12 mb-12">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-2xl px-6 bg-background data-[state=open]:border-primary data-[state=open]:shadow-sm transition-all">
                <AccordionTrigger className="hover:no-underline font-bold text-lg py-6 text-left [&[data-state=open]]:text-foreground transition-colors">
                  {isRtl ? faq.qAr : faq.qEn}
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed text-base pb-6 pt-0">
                  {isRtl ? faq.aAr : faq.aEn}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-foreground/5 border border-primary rounded-[2rem] p-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center shadow-sm mb-4">
              <MessageSquare className="w-5 h-5 text-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">{isRtl ? "تحتاج مساعدة إضافية؟" : "Need more help?"}</h3>
            <p className="text-foreground text-sm mb-6 flex-1">
              {isRtl ? "تحدث مع خبير الذكاء الاصطناعي للحصول على نصائح مخصصة." : "Talk to our AI expert for personalized advice."}
            </p>
            <Button variant="outline" className="rounded-full w-full font-bold border-primary hover:bg-foreground">
              {isRtl ? "ابدأ المحادثة" : "Start Chat"}
            </Button>
          </div>
          
          <div className="bg-background border rounded-[2rem] p-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center shadow-sm mb-4">
              <Mail className="w-5 h-5 text-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">{isRtl ? "تواصل معنا" : "Contact Us"}</h3>
            <p className="text-foreground text-sm mb-6 flex-1">
              {isRtl ? "فريق الدعم متاح للرد على استفساراتك عبر البريد الإلكتروني." : "Our support team is available to answer your email inquiries."}
            </p>
            <Button variant="secondary" className="rounded-full w-full font-bold shadow-sm">
              {isRtl ? "إرسال بريد" : "Send Email"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
