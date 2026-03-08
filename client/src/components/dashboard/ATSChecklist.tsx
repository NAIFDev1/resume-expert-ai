import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ATSChecklist({ data }: { data?: any[] }) {
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

  const getIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle2 className="h-5 w-5 text-foreground shrink-0" />;
      case 'fail': return <XCircle className="h-5 w-5 text-foreground shrink-0 opacity-50" />;
      case 'warn': return <AlertCircle className="h-5 w-5 text-foreground shrink-0 opacity-70" />;
      default: return null;
    }
  };

  return (
    <Card className="border shadow-sm rounded-[2rem] overflow-hidden bg-card">
      <CardHeader className="bg-secondary border-b pb-4">
        <CardTitle className="text-xl font-bold font-heading">
          {isRtl ? "فحص التوافق مع ATS" : "ATS Compatibility Check"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={i} 
              className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/50 border hover:bg-secondary transition-colors"
            >
              {getIcon(item.status)}
              <span className="text-sm font-bold">
                {isRtl ? item.labelAr : item.labelEn}
              </span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
