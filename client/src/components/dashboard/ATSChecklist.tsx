import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

type CheckStatus = "pass" | "fail" | "warning";

interface ATSCheck {
  id: string;
  nameEn: string;
  nameAr: string;
  status: CheckStatus;
  messageEn: string;
  messageAr: string;
}

interface ATSChecklistProps {
  data?: ATSCheck[];
}

export function ATSChecklist({ data }: ATSChecklistProps) {
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    const checkLang = () => setIsRtl(document.documentElement.dir === 'rtl');
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    return () => observer.disconnect();
  }, []);

  const defaultChecks: ATSCheck[] = [
    { id: "1", nameEn: "File Format", nameAr: "صيغة الملف", status: "pass", messageEn: "PDF is readable", messageAr: "ملف PDF قابل للقراءة" },
    { id: "2", nameEn: "Contact Info", nameAr: "معلومات التواصل", status: "pass", messageEn: "All required info found", messageAr: "تم العثور على كافة المعلومات" },
    { id: "3", nameEn: "Keywords", nameAr: "الكلمات المفتاحية", status: "warning", messageEn: "Low keyword density", messageAr: "كثافة الكلمات المفتاحية منخفضة" },
    { id: "4", nameEn: "Formatting", nameAr: "التنسيق", status: "fail", messageEn: "Complex tables detected", messageAr: "تم اكتشاف جداول معقدة" },
    { id: "5", nameEn: "Fonts", nameAr: "الخطوط", status: "pass", messageEn: "Standard fonts used", messageAr: "استخدام خطوط قياسية" },
    { id: "6", nameEn: "Length", nameAr: "الطول", status: "warning", messageEn: "Resume is slightly long", messageAr: "السيرة الذاتية طويلة نوعاً ما" },
  ];

  const checks = data || defaultChecks;

  return (
    <Card className="border-0 shadow-none bg-transparent h-full flex flex-col overflow-hidden">
      <CardHeader className="px-6 pt-6 pb-4 shrink-0 border-b border-border/50">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          {isRtl ? "فحص التوافقية (ATS)" : "ATS Compatibility"}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-4 flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          {checks.map((check) => (
            <div key={check.id} className="flex items-start gap-3.5 p-4 rounded-2xl bg-secondary/30 border border-transparent hover:border-border transition-colors">
              <div className="mt-0.5 shrink-0">
                {check.status === "pass" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                {check.status === "fail" && <XCircle className="h-5 w-5 text-destructive" />}
                {check.status === "warning" && <AlertTriangle className="h-5 w-5 text-amber-500" />}
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-foreground text-sm truncate">
                  {isRtl ? check.nameAr : check.nameEn}
                </h4>
                <p className="text-sm text-muted-foreground mt-1 font-medium leading-relaxed">
                  {isRtl ? check.messageAr : check.messageEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
