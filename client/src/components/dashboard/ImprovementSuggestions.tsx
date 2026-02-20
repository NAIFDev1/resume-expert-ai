import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sparkles, ArrowUpRight, Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setIsRtl(document.documentElement.dir === 'rtl');
  }, []);

  const suggestions = data || defaultSuggestions;

  const handleApplyFix = (id: string) => {
    setApplyingId(id);
    
    // Simulate AI rewriting the content
    setTimeout(() => {
      setApplyingId(null);
      setAppliedIds(prev => [...prev, id]);
      
      toast({
        title: isRtl ? "تم تطبيق التعديل بنجاح" : "Fix applied successfully",
        description: isRtl 
          ? "قام خبير AI بإعادة صياغة القسم لتحسين توافقه مع أنظمة ATS."
          : "Khabir AI has rewritten the section to improve ATS compatibility.",
      });
    }, 1500);
  };

  return (
    <Card className="h-full border-primary/20 shadow-lg shadow-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl font-heading">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          {isRtl ? "إصلاحات الذكاء الاصطناعي" : "AI Smart Fixes"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {isRtl 
            ? "انقر على 'تطبيق التعديل' ليقوم خبير AI بإعادة صياغة سيرتك الذاتية فوراً."
            : "Click 'Apply Fix' to let Khabir AI rewrite your resume sections instantly."}
        </p>
        <Accordion type="single" collapsible className="w-full">
          {suggestions.map((item) => {
            const isApplied = appliedIds.includes(item.id);
            const isApplying = applyingId === item.id;
            
            return (
              <AccordionItem key={item.id} value={item.id} className="border-b-primary/10">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className={`flex items-center gap-3 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <span className={`h-2 w-2 rounded-full shrink-0 ${
                      isApplied ? 'bg-green-500' : (item.impact === 'High' ? 'bg-red-500' : 'bg-yellow-500')
                    }`} />
                    <span className={`font-semibold ${isApplied ? 'text-green-600 line-through opacity-70' : ''}`}>
                      {isRtl ? item.titleAr : item.titleEn}
                    </span>
                    {isApplied && (
                      <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full uppercase font-bold">
                        {isRtl ? "تم الإصلاح" : "Fixed"}
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  <div className="bg-muted/30 p-3 rounded-lg border mb-3 italic text-sm">
                    {isRtl ? item.descAr : item.descEn}
                  </div>
                  
                  <div className={`flex ${isRtl ? 'justify-start' : 'justify-end'}`}>
                     <button 
                       disabled={isApplied || isApplying}
                       onClick={(e) => {
                         e.stopPropagation();
                         handleApplyFix(item.id);
                       }}
                       className={`text-xs font-bold py-2 px-4 rounded-full flex items-center gap-2 transition-all ${
                         isApplied 
                           ? 'bg-green-50 text-green-600 cursor-default' 
                           : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg active:scale-95'
                       }`}
                     >
                       {isApplying ? (
                         <>
                           <Loader2 className="h-3 w-3 animate-spin" />
                           {isRtl ? "جاري المعالجة..." : "Processing..."}
                         </>
                       ) : isApplied ? (
                         <>
                           <Check className="h-3 w-3" />
                           {isRtl ? "تم التعديل" : "Applied"}
                         </>
                       ) : (
                         <>
                           {isRtl ? "تطبيق التعديل الذكي" : "Apply AI Fix"} 
                           <ArrowUpRight className={`h-3 w-3 ${isRtl ? 'rotate-[-90deg]' : ''}`} />
                         </>
                       )}
                     </button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
