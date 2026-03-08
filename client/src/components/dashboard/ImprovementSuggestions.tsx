import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface Suggestion {
  id: string;
  categoryEn: string;
  categoryAr: string;
  currentEn: string;
  currentAr: string;
  suggestionEn: string;
  suggestionAr: string;
  impact: "high" | "medium" | "low";
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
      categoryEn: "Experience",
      categoryAr: "الخبرة",
      currentEn: "Developed web applications",
      currentAr: "تطوير تطبيقات الويب",
      suggestionEn: "Developed scalable web applications using React, resulting in 30% faster load times.",
      suggestionAr: "تطوير تطبيقات ويب قابلة للتوسع باستخدام React، مما أدى لزيادة سرعة التحميل بنسبة 30٪.",
      impact: "high"
    },
    {
      id: "2",
      categoryEn: "Summary",
      categoryAr: "الملخص",
      currentEn: "Hardworking software engineer looking for a job.",
      currentAr: "مهندس برمجيات مجتهد يبحث عن عمل.",
      suggestionEn: "Results-driven Software Engineer with 5+ years of experience in full-stack development.",
      suggestionAr: "مهندس برمجيات يركز على النتائج بخبرة تزيد عن 5 سنوات في تطوير الأنظمة المتكاملة.",
      impact: "medium"
    }
  ];

  const suggestions = data || defaultSuggestions;

  return (
    <Card className="border-0 shadow-none bg-transparent h-full flex flex-col">
      <CardHeader className="px-8 pt-8 pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          {isRtl ? "اقتراحات التحسين المدعومة بالذكاء الاصطناعي" : "AI Improvement Suggestions"}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-8 pb-8 flex-1">
        <div className="space-y-6">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="relative group">
              <div className="absolute left-0 top-4 bottom-4 w-1 bg-border rounded-full" />
              <div className="pl-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    {isRtl ? suggestion.categoryAr : suggestion.categoryEn}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-md font-bold ${
                    suggestion.impact === 'high' ? 'bg-green-500/10 text-green-600' :
                    suggestion.impact === 'medium' ? 'bg-amber-500/10 text-amber-600' :
                    'bg-blue-500/10 text-blue-600'
                  }`}>
                    {suggestion.impact.toUpperCase()} IMPACT
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="p-4 bg-destructive/5 rounded-2xl border border-destructive/10">
                    <p className="text-sm text-foreground/70 line-through decoration-destructive/40 font-medium">
                      {isRtl ? suggestion.currentAr : suggestion.currentEn}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                      {isRtl ? suggestion.suggestionAr : suggestion.suggestionEn}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
