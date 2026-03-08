import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Lightbulb, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function ImprovementSuggestions({ data }: { data?: any[] }) {
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    setIsRtl(document.documentElement.dir === 'rtl');
    const observer = new MutationObserver(() => {
      setIsRtl(document.documentElement.dir === 'rtl');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    return () => observer.disconnect();
  }, []);

  if (!data) return null;

  return (
    <Card className="h-full border shadow-sm rounded-[2rem] overflow-hidden bg-card">
      <CardHeader className="bg-secondary border-b pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold font-heading">
          <Lightbulb className="h-5 w-5 text-foreground" />
          {isRtl ? "اقتراحات التحسين" : "Improvement Suggestions"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {data.map((suggestion, index) => (
            <motion.div 
              initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={suggestion.id} 
              className="p-6 hover:bg-secondary/50 transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-base flex items-center gap-2">
                  <ArrowRight className={`h-4 w-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all ${isRtl ? 'rotate-180 -mr-6 group-hover:-mr-0' : ''}`} />
                  {isRtl ? suggestion.titleAr : suggestion.titleEn}
                </h4>
                <Badge variant="outline" className={`rounded-full px-3 font-bold border-2 ${suggestion.impact === 'High' ? 'border-foreground text-foreground' : 'border-border'}`}>
                  {suggestion.impact === 'High' && isRtl ? 'تأثير عالي' : 
                   suggestion.impact === 'Medium' && isRtl ? 'تأثير متوسط' : 
                   suggestion.impact}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-6 font-bold">
                {isRtl ? suggestion.descAr : suggestion.descEn}
              </p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
