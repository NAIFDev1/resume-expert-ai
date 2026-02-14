import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { FileCheck, Zap, Target } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [isRtl, setIsRtl] = useState(false);

  // Listen for language changes via document attribute
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'dir') {
          setIsRtl(document.documentElement.dir === 'rtl');
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    setIsRtl(document.documentElement.dir === 'rtl');
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Navbar />
      
      <main>
        <Hero key={isRtl ? 'rtl' : 'ltr'} />
        
        <section id="features" className="py-24 bg-muted/30">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-heading font-bold mb-4">
                {isRtl ? "لماذا تستخدم خبير؟" : "Why use Khabir?"}
              </h2>
              <p className="text-muted-foreground">
                {isRtl 
                  ? "توقف عن التخمين. يقوم ذكاؤنا الاصطناعي بتحليل سيرتك الذاتية تماماً مثل خبراء التوظيف."
                  : "Stop guessing what recruiters want. Our AI analyzes your resume like an expert hiring manager."
                }
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{isRtl ? "تغذية راجعة فورية" : "Instant Feedback"}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {isRtl 
                    ? "احصل على نتيجة مفصلة ونصائح قابلة للتنفيذ في ثوانٍ معدودة."
                    : "Get a detailed score and actionable feedback in seconds, not days."
                  }
                </p>
              </div>

              <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center mb-6">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{isRtl ? "تحسين للـ ATS" : "ATS Optimization"}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {isRtl 
                    ? "تأكد من تجاوز سيرتك الذاتية للفلاتر الآلية التي تستخدمها 99% من الشركات الكبرى."
                    : "Ensure your resume passes the automated filters used by 99% of Fortune 500 companies."
                  }
                </p>
              </div>

              <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
                  <FileCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{isRtl ? "اقتراحات ذكية" : "Smart Suggestions"}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {isRtl 
                    ? "يعيد ذكاؤنا الاصطناعي صياغة نقاط خبرتك لتحقيق أقصى قدر من التأثير."
                    : "Our AI rewrites your bullet points to maximize impact and highlight your achievements."
                  }
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t py-12">
        <div className="container px-4 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-muted-foreground">
            {isRtl ? "© 2026 خبير. جميع الحقوق محفوظة." : "© 2026 Khabir. All rights reserved."}
          </div>
          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground">{isRtl ? "الخصوصية" : "Privacy"}</a>
            <a href="#" className="hover:text-foreground">{isRtl ? "الشروط" : "Terms"}</a>
            <a href="#" className="hover:text-foreground">{isRtl ? "اتصل بنا" : "Contact"}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
