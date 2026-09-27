import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts";
import { useState, useEffect } from "react";

interface SkillData {
  subject: string;
  A: number;
  fullMark: number;
  match?: boolean;
  nameEn?: string;
  nameAr?: string;
}

interface SkillsRadarProps {
  data?: SkillData[];
}

export function SkillsRadar({ data }: SkillsRadarProps) {
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    const checkLang = () => setIsRtl(document.documentElement.dir === 'rtl');
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    return () => observer.disconnect();
  }, []);

  const defaultData: SkillData[] = [
    { subject: "Frontend", nameEn: "Frontend", nameAr: "تطوير الواجهات", A: 90, fullMark: 100 },
    { subject: "Backend", nameEn: "Backend", nameAr: "تطوير الخوادم", A: 75, fullMark: 100 },
    { subject: "Database", nameEn: "Database", nameAr: "قواعد البيانات", A: 60, fullMark: 100 },
    { subject: "DevOps", nameEn: "DevOps", nameAr: "العمليات", A: 40, fullMark: 100 },
    { subject: "Testing", nameEn: "Testing", nameAr: "الاختبار", A: 85, fullMark: 100 },
    { subject: "UI/UX", nameEn: "UI/UX", nameAr: "تصميم الواجهات", A: 70, fullMark: 100 },
  ];

  const chartData = (data || defaultData).map(item => ({
    subject: isRtl ? (item.nameAr ?? item.subject) : (item.nameEn ?? item.subject),
    score: item.A,
    fullMark: item.fullMark,
  }));

  return (
    <div className="w-full h-full min-h-[250px] max-h-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: "hsl(var(--foreground))", fontSize: 12, fontWeight: 600 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Skills"
            dataKey="score"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.2}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '1rem', 
              border: '1px solid hsl(var(--border))',
              backgroundColor: 'hsl(var(--card))',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.05)',
              fontWeight: 600
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
