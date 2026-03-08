import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis, Tooltip } from "recharts";
import { useEffect, useState } from "react";

export function SkillsRadar({ data }: { data?: any[] }) {
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

  // Clean data for radar chart based on language
  const chartData = data.map(item => ({
    subject: item.subject.split(' / ')[isRtl ? 1 : 0],
    A: item.A,
    fullMark: item.fullMark
  }));

  return (
    <Card className="h-full border shadow-sm rounded-[2rem] overflow-hidden bg-card">
      <CardHeader className="bg-secondary border-b pb-4">
        <CardTitle className="text-xl font-bold font-heading">
          {isRtl ? "تحليل المهارات" : "Skills Analysis"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontWeight: "bold", fontFamily: "sans-serif" }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Score"
                dataKey="A"
                stroke="hsl(var(--foreground))"
                strokeWidth={3}
                fill="hsl(var(--foreground))"
                fillOpacity={0.1}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "1rem",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  fontWeight: "bold"
                }}
                itemStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
