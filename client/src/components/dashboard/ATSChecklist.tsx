import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface CheckItem {
  labelEn: string;
  labelAr: string;
  status: 'pass' | 'fail' | 'warn';
}

interface ATSChecklistProps {
  data?: CheckItem[];
}

const defaultChecks: CheckItem[] = [
  { labelEn: "File Format (PDF)", labelAr: "تنسيق الملف (PDF)", status: 'pass' },
  { labelEn: "Text Selectable", labelAr: "النص قابل للتحديد", status: 'pass' },
  { labelEn: "Contact Info Found", labelAr: "معلومات الاتصال موجودة", status: 'pass' },
  { labelEn: "Section Headers", labelAr: "عناوين الأقسام", status: 'pass' },
  { labelEn: "No Graphics/Tables", labelAr: "لا توجد رسومات/جداول", status: 'warn' },
  { labelEn: "Date Formatting", labelAr: "تنسيق التاريخ", status: 'fail' },
];

export function ATSChecklist({ data }: ATSChecklistProps) {
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    setIsRtl(document.documentElement.dir === 'rtl');
  }, []);

  const checks = data || defaultChecks;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isRtl ? "توافق ATS" : "ATS Compatibility"}
          <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
            {isRtl ? "تحذير" : "Warning"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {checks.map((check, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium text-foreground/80">
                {isRtl ? check.labelAr : check.labelEn}
              </span>
              {check.status === 'pass' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              {check.status === 'fail' && <XCircle className="h-5 w-5 text-red-500" />}
              {check.status === 'warn' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
