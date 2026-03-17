import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts";
import { useState, useEffect } from "react";

interface SkillData {
  nameEn: string;
  nameAr: string;
  score: number;
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
    { nameEn: "Frontend", nameAr: "تطوير الواجهات", score: 90 },
    { nameEn: "Backend", nameAr: "تطوير الخوادم", score: 75 },
    { nameEn: "Database", nameAr: "قواعد البيانات", score: 60 },
    { nameEn: "DevOps", nameAr: "العمليات", score: 40 },
    { nameEn: "Testing", nameAr: "الاختبار", score: 85 },
    { nameEn: "UI/UX", nameAr: "تصميم الواجهات", score: 70 },
  ];

  const chartData = (data || defaultData).map(item => ({
    subject: isRtl ? item.nameAr : item.nameEn,
    score: item.score,
    fullMark: 100,
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
