import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";

const dataEn = [
  { subject: "Technical", A: 90, fullMark: 100 },
  { subject: "Soft Skills", A: 65, fullMark: 100 },
  { subject: "Structure", A: 85, fullMark: 100 },
  { subject: "Impact", A: 50, fullMark: 100 },
  { subject: "Relevance", A: 80, fullMark: 100 },
];

const dataAr = [
  { subject: "تقنية", A: 90, fullMark: 100 },
  { subject: "مهارات ناعمة", A: 65, fullMark: 100 },
  { subject: "الهيكلية", A: 85, fullMark: 100 },
  { subject: "التأثير", A: 50, fullMark: 100 },
  { subject: "الملاءمة", A: 80, fullMark: 100 },
];

export function SkillsRadar() {
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    setIsRtl(document.documentElement.dir === 'rtl');
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{isRtl ? "تحليل فجوة المهارات" : "Skill Gap Analysis"}</CardTitle>
        <CardDescription>
          {isRtl ? "توزيع مرئي لنقاط القوة في سيرتك الذاتية" : "Visual breakdown of your resume's strengths"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={isRtl ? dataAr : dataEn}>
              <PolarGrid stroke="hsl(var(--muted-foreground)/0.2)" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
              />
              <Radar
                name="My Resume"
                dataKey="A"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
