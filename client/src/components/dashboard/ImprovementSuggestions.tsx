import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

interface Suggestion {
  id: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  impact: 'High' | 'Medium';
}

interface ImprovementSuggestionsProps {
  data?: Suggestion[];
}

const defaultSuggestions: Suggestion[] = [
  {
    id: "item-1",
    titleEn: "Quantify your impact",
    titleAr: "قياس تأثيرك بالأرقام",
    descEn: "Your 'Experience' section lists duties but lacks measurable results. Instead of 'Managed a team', try 'Managed a team of 5 developers, increasing sprint velocity by 20%'.",
    descAr: "قسم 'الخبرة' يسرد المهام ولكنه يفتقر إلى نتائج ملموسة. بدلاً من 'إدارة فريق'، جرب 'إدارة فريق من 5 مطورين، مما أدى لزيادة سرعة الإنجاز بنسبة 20٪'.",
    impact: "High"
  },
  {
    id: "item-2",
    titleEn: "Optimize Section Headers",
    titleAr: "تحسين عناوين الأقسام",
    descEn: "Use standard headers like 'Experience', 'Education', and 'Skills' instead of creative ones like 'My Journey' so ATS can parse them correctly.",
    descAr: "استخدم عناوين قياسية مثل 'الخبرة' و'التعليم' و'المهارات' بدلاً من العناوين الإبداعية مثل 'رحلتي' لكي يتمكن نظام ATS من قراءتها بشكل صحيح.",
    impact: "Medium"
  }
];

export function ImprovementSuggestions({ data }: ImprovementSuggestionsProps) {
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    setIsRtl(document.documentElement.dir === 'rtl');
  }, []);

  const suggestions = data || defaultSuggestions;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {isRtl ? "اقتراحات الذكاء الاصطناعي" : "AI Suggestions"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {suggestions.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className={`flex items-center gap-3 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <span className={`h-2 w-2 rounded-full ${
                    item.impact === 'High' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  <span className="font-semibold">{isRtl ? item.titleAr : item.titleEn}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {isRtl ? item.descAr : item.descEn}
                <div className={`mt-3 flex ${isRtl ? 'justify-start' : 'justify-end'}`}>
                   <button className="text-xs font-medium text-primary flex items-center gap-1 hover:underline">
                     {isRtl ? "تطبيق التعديل" : "Apply Fix"} 
                     <ArrowUpRight className={`h-3 w-3 ${isRtl ? 'rotate-[-90deg]' : ''}`} />
                   </button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
