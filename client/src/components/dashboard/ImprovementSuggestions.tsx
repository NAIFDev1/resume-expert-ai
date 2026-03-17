import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Suggestion {
  id: string;
  sectionEn: string;
  sectionAr: string;
  originalEn: string;
  originalAr: string;
  improvedEn: string;
  improvedAr: string;
}

interface ImprovementSuggestionsProps {
  data?: Suggestion[];
}

export function ImprovementSuggestions({ data }: ImprovementSuggestionsProps) {
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    const checkLang = () => setIsRtl(document.documentElement.dir === 'rtl');
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    return () => observer.disconnect();
  }, []);

  const defaultSuggestions: Suggestion[] = [
    {
      id: "1",
      sectionEn: "Summary",
      sectionAr: "الملخص",
      originalEn: "Hardworking developer looking for a job.",
      originalAr: "مطور مجتهد يبحث عن عمل.",
      improvedEn: "Results-driven Software Engineer with 3+ years of experience building scalable web applications.",
      improvedAr: "مهندس برمجيات موجه نحو النتائج بخبرة تزيد عن 3 سنوات في بناء تطبيقات ويب قابلة للتوسع."
    },
    {
      id: "2",
      sectionEn: "Experience",
      sectionAr: "الخبرة",
      originalEn: "Made the website faster.",
      originalAr: "قمت بجعل الموقع أسرع.",
      improvedEn: "Optimized frontend assets reducing page load time by 40% and increasing conversion rate.",
      improvedAr: "تحسين أصول الواجهة الأمامية مما أدى لتقليل وقت تحميل الصفحة بنسبة 40٪ وزيادة معدل التحويل."
    },
    {
      id: "3",
      sectionEn: "Education",
      sectionAr: "التعليم",
      originalEn: "Finished college with good grades.",
      originalAr: "أنهيت الجامعة بدرجات جيدة.",
      improvedEn: "Graduated with Honors, consistently maintaining top 10% academic standing in cohort.",
      improvedAr: "تخرجت بمرتبة الشرف، مع الحفاظ باستمرار على التواجد ضمن أفضل 10٪ في الدفعة أكاديمياً."
    }
  ];

  const suggestions = data || defaultSuggestions;

  return (
    <Card className="border-0 shadow-none bg-transparent flex flex-col h-full max-h-full overflow-hidden w-full">
      <CardHeader className="px-6 pt-6 pb-4 border-b border-border/50 shrink-0">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500 shrink-0" />
          <span className="truncate">{isRtl ? "تحسينات الذكاء الاصطناعي" : "AI Improvements"}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-6 flex-1 overflow-y-auto custom-scrollbar min-h-0 space-y-6">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="space-y-3 p-5 rounded-2xl bg-secondary/30 border border-transparent hover:border-border transition-colors">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {isRtl ? suggestion.sectionAr : suggestion.sectionEn}
            </h4>
            
            <div className="space-y-3">
              <div className="bg-destructive/5 border border-destructive/10 p-3 rounded-xl">
                <p className="text-sm font-medium text-destructive/80 line-through decoration-destructive/30 leading-relaxed">
                  {isRtl ? suggestion.originalAr : suggestion.originalEn}
                </p>
              </div>
              
              <div className="flex justify-center">
                <div className="bg-background rounded-full p-1.5 border shadow-sm shrink-0">
                  <ArrowRight className={`h-3.5 w-3.5 text-muted-foreground ${isRtl ? 'rotate-180' : ''}`} />
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/10 p-3 rounded-xl">
                <p className="text-sm font-bold text-primary leading-relaxed">
                  {isRtl ? suggestion.improvedAr : suggestion.improvedEn}
                </p>
              </div>
            </div>
            
            <div className="pt-2 flex justify-end">
              <Button size="sm" variant="outline" className="rounded-lg text-xs font-bold h-8 border-border hover:bg-background shadow-sm">
                {isRtl ? "تطبيق التعديل" : "Apply Change"}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
