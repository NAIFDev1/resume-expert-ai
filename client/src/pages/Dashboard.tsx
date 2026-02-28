import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  History, 
  Download, 
  Trash2, 
  ExternalLink, 
  Plus, 
  Search,
  Layout,
  BarChart2
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "wouter";

const mockSavedFiles = [
  {
    id: "1",
    name: "Software_Engineer_Resume.pdf",
    date: "2026-02-28",
    score: 85,
    template: "Modern",
    type: "Analysis"
  },
  {
    id: "2",
    name: "Product_Manager_Draft.pdf",
    date: "2026-02-25",
    score: 72,
    template: "Classic",
    type: "Editor"
  },
  {
    id: "3",
    name: "Marketing_Lead_Final.pdf",
    date: "2026-02-20",
    score: 94,
    template: "Minimal",
    type: "Analysis"
  }
];

export default function Dashboard() {
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    const checkLang = () => setIsRtl(document.documentElement.dir === 'rtl');
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-muted/20 font-sans pb-24">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold">
              {isRtl ? "لوحة التحكم" : "Dashboard"}
            </h1>
            <p className="text-muted-foreground">
              {isRtl ? "إدارة ملفاتك وتحليلاتك السابقة" : "Manage your previous files and analyses"}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/editor">
              <Button className="rounded-xl shadow-lg shadow-primary/20">
                <Plus className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                {isRtl ? "إنشاء جديد" : "Create New"}
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            title={isRtl ? "إجمالي الملفات" : "Total Files"} 
            value="12" 
            icon={<FileText className="h-5 w-5 text-blue-500" />}
            isRtl={isRtl}
          />
          <StatCard 
            title={isRtl ? "متوسط النتيجة" : "Average Score"} 
            value="78%" 
            icon={<BarChart2 className="h-5 w-5 text-green-500" />}
            isRtl={isRtl}
          />
          <StatCard 
            title={isRtl ? "النماذج المستخدمة" : "Templates Used"} 
            value="3" 
            icon={<Layout className="h-5 w-5 text-purple-500" />}
            isRtl={isRtl}
          />
        </div>

        <Card className="border-primary/5 shadow-xl bg-card/50 backdrop-blur-sm rounded-[2rem] overflow-hidden">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              {isRtl ? "السجلات الأخيرة" : "Recent Records"}
            </CardTitle>
            <CardDescription>
              {isRtl ? "قائمة بجميع العمليات السابقة" : "A list of all your previous operations"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-right" dir={isRtl ? "rtl" : "ltr"}>
                <thead className="bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">{isRtl ? "الملف" : "File"}</th>
                    <th className="px-6 py-4">{isRtl ? "التاريخ" : "Date"}</th>
                    <th className="px-6 py-4">{isRtl ? "النتيجة" : "Score"}</th>
                    <th className="px-6 py-4">{isRtl ? "النوع" : "Type"}</th>
                    <th className="px-6 py-4 text-center">{isRtl ? "إجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockSavedFiles.map((file) => (
                    <motion.tr 
                      key={file.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-primary/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 text-right">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.template}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {file.date}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={file.score > 80 ? "default" : "secondary"} className="rounded-lg">
                          {file.score}%
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="rounded-lg">
                          {file.type === "Analysis" ? (isRtl ? "تحليل" : "Analysis") : (isRtl ? "محرر" : "Editor")}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, isRtl }: any) {
  return (
    <Card className="border-primary/5 bg-card/50 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-6 flex items-center justify-between">
        <div className={isRtl ? "text-right" : "text-left"}>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className="p-3 bg-muted rounded-xl">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}