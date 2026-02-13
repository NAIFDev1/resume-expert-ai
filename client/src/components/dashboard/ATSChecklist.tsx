import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface CheckItem {
  label: string;
  status: 'pass' | 'fail' | 'warn';
}

const checks: CheckItem[] = [
  { label: "File Format (PDF)", status: 'pass' },
  { label: "Text Selectable", status: 'pass' },
  { label: "Contact Info Found", status: 'pass' },
  { label: "Section Headers", status: 'pass' },
  { label: "No Graphics/Tables", status: 'warn' },
  { label: "Date Formatting", status: 'fail' },
];

export function ATSChecklist() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ATS Compatibility
          <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Warning</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {checks.map((check, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium text-foreground/80">{check.label}</span>
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
