import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

type CheckStatus = "pass" | "fail" | "warn";

interface ATSCheck {
  labelEn: string;
  labelAr: string;
  status: CheckStatus;
}

const STATUS_MESSAGES: Record<CheckStatus, { en: string; ar: string }> = {
  pass: { en: "Passed", ar: "ناجح" },
  fail: { en: "Needs attention", ar: "يحتاج تحسين" },
  warn: { en: "Could be improved", ar: "يمكن تحسينه" },
};

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
    { labelEn: "File Format", labelAr: "صيغة الملف", status: "pass" },
    { labelEn: "Contact Info", labelAr: "معلومات التواصل", status: "pass" },
    { labelEn: "Keywords", labelAr: "الكلمات المفتاحية", status: "warn" },
    { labelEn: "Formatting", labelAr: "التنسيق", status: "fail" },
    { labelEn: "Fonts", labelAr: "الخطوط", status: "pass" },
    { labelEn: "Length", labelAr: "الطول", status: "warn" },
  ];

  const checks = data || defaultChecks;

  return (
    <Card className="border-0 shadow-none bg-transparent flex flex-col h-full max-h-full overflow-hidden w-full">
      <CardHeader className="px-6 pt-6 pb-4 border-b border-border/50 shrink-0">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          {isRtl ? "فحص التوافقية (ATS)" : "ATS Compatibility"}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-6 flex-1 overflow-y-auto custom-scrollbar min-h-0">
        <div className="space-y-4">
          {checks.map((check, index) => (
            <div key={`${check.labelEn}-${index}`} className="flex items-start gap-3.5 p-4 rounded-2xl bg-secondary/30 border border-transparent hover:border-border transition-colors">
              <div className="mt-0.5 shrink-0">
                {check.status === "pass" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                {check.status === "fail" && <XCircle className="h-5 w-5 text-destructive" />}
                {check.status === "warn" && <AlertTriangle className="h-5 w-5 text-amber-500" />}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-foreground text-sm truncate">
                  {isRtl ? check.labelAr : check.labelEn}
                </h4>
                <p className="text-sm text-muted-foreground mt-1 font-medium leading-relaxed">
                  {isRtl ? STATUS_MESSAGES[check.status].ar : STATUS_MESSAGES[check.status].en}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
