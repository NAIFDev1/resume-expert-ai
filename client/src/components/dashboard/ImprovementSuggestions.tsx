import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface Suggestion {
  id: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  impact: "High" | "Medium";
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
      titleEn: "Add Measurable Achievements",
      titleAr: "أضف إنجازات قابلة للقياس",
      descEn: "Replace vague duties with impact metrics (e.g., 'Reduced load time by 40%').",
      descAr: "استبدل المهام المبهمة بمقاييس الأثر (مثل خفض وقت التحميل بنسبة 40٪).",
      impact: "High",
    },
    {
      id: "2",
      titleEn: "Optimize Keywords",
      titleAr: "حسّن الكلمات المفتاحية",
      descEn: "Incorporate role-specific keywords naturally throughout all sections.",
      descAr: "ادمج الكلمات المفتاحية المتعلقة بالوظيفة بشكل طبيعي في جميع الأقسام.",
      impact: "High",
    },
    {
      id: "3",
      titleEn: "Strengthen Action Verbs",
      titleAr: "قوّي أفعال المبادرة",
      descEn: "Start each bullet with power verbs instead of passive phrases like 'Responsible for'.",
      descAr: "ابدأ كل نقطة بفعل قوي بدلاً من عبارات سلبية مثل 'مسؤول عن'.",
      impact: "Medium",
    },
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
            <div className="flex items-start justify-between gap-3">
              <h4 className="font-semibold text-foreground text-sm leading-snug">
                {isRtl ? suggestion.titleAr : suggestion.titleEn}
              </h4>
              <span
                className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                  suggestion.impact === "High"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-amber-500/10 text-amber-600"
                }`}
              >
                {suggestion.impact}
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              {isRtl ? suggestion.descAr : suggestion.descEn}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
