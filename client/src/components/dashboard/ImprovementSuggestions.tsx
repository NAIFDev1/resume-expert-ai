import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sparkles, ArrowUpRight } from "lucide-react";

const suggestions = [
  {
    id: "item-1",
    title: "Quantify your impact",
    description: "Your 'Experience' section lists duties but lacks measurable results. Instead of 'Managed a team', try 'Managed a team of 5 developers, increasing sprint velocity by 20%'.",
    impact: "High"
  },
  {
    id: "item-2",
    title: "Optimize Section Headers",
    description: "Use standard headers like 'Experience', 'Education', and 'Skills' instead of creative ones like 'My Journey' so ATS can parse them correctly.",
    impact: "Medium"
  },
  {
    id: "item-3",
    title: "Add Soft Skills",
    description: "You have strong technical keywords, but miss soft skills like 'Communication', 'Leadership', or 'Agile Methodology' which are present in the job description.",
    impact: "Medium"
  }
];

export function ImprovementSuggestions() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {suggestions.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <span className={`h-2 w-2 rounded-full ${
                    item.impact === 'High' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  <span className="font-semibold">{item.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {item.description}
                <div className="mt-3 flex justify-end">
                   <button className="text-xs font-medium text-primary flex items-center gap-1 hover:underline">
                     Apply Fix <ArrowUpRight className="h-3 w-3" />
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
