import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  History, 
  Trash2, 
  ExternalLink, 
  Plus, 
  Layout,
  BarChart2,
  Loader2,
  Inbox,
  Sparkles,
  Pencil
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface ResumeRecord {
  id: string;
  fileName: string;
  fileType: string;
  type: string;
  score: number | null;
  template: string | null;
  createdAt: string;
}

interface Stats {
  totalFiles: number;
  avgScore: number;
  templatesUsed: number;
}

export default function Dashboard() {
  const [isRtl, setIsRtl] = useState(false);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const checkLang = () => setIsRtl(document.documentElement.dir === 'rtl');
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    return () => observer.disconnect();
  }, []);

  const { data: resumes = [], isLoading: resumesLoading } = useQuery<ResumeRecord[]>({
    queryKey: ["/api/resumes"],
  });

  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/resumes/stats"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/resumes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/resumes/stats"] });
      toast({
        title: isRtl ? "تم الحذف" : "Deleted",
        description: isRtl ? "تم حذف السجل بنجاح" : "Record deleted successfully",
      });
    },
    // [L-3] Handle delete errors — show user feedback instead of silently failing
    onError: () => {
      toast({
        title: isRtl ? "فشل الحذف" : "Delete failed",
        description: isRtl ? "تعذر حذف السجل. حاول مرة أخرى." : "Could not delete the record. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-muted/20 font-sans pb-32">
      <Navbar />
      
      <main className="container max-w-[1200px] mx-auto px-4 pt-40 lg:pt-48 pb-12" dir={isRtl ? "rtl" : "ltr"}>
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 mt-4">
          <div className={isRtl ? "text-right w-full" : "text-left w-full"}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-bold text-primary uppercase tracking-wide">
                {isRtl ? "مرحباً بعودتك" : "Welcome back"}
                {user && `, ${user.username}`}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 text-foreground" data-testid="text-dashboard-title">
              {isRtl ? "لوحة التحكم" : "Dashboard"}
            </h1>
            <p className="text-muted-foreground font-medium">
              {isRtl ? "إدارة ملفاتك وتحليلاتك السابقة" : "Manage your previous files and analyses"}
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0 shrink-0">
            <Link href="/editor">
              <Button className="rounded-xl shadow-lg shadow-primary/20 h-12 px-6 font-bold" data-testid="button-create-new">
                <Plus className={`h-5 w-5 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                {isRtl ? "إنشاء جديد" : "Create New"}
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            title={isRtl ? "إجمالي الملفات" : "Total Files"} 
            value={String(stats?.totalFiles ?? 0)} 
            icon={<FileText className="h-5 w-5 text-blue-500" />}
            isRtl={isRtl}
          />
          <StatCard 
            title={isRtl ? "متوسط النتيجة" : "Average Score"} 
            value={stats?.avgScore ? `${stats.avgScore}%` : "—"} 
            icon={<BarChart2 className="h-5 w-5 text-green-500" />}
            isRtl={isRtl}
          />
          <StatCard 
            title={isRtl ? "النماذج المستخدمة" : "Templates Used"} 
            value={String(stats?.templatesUsed ?? 0)} 
            icon={<Layout className="h-5 w-5 text-purple-500" />}
            isRtl={isRtl}
          />
        </div>

        <Card className="border-primary/5 shadow-xl bg-card/50 backdrop-blur-sm rounded-[2rem] overflow-hidden">
          <CardHeader className="border-b bg-muted/30" dir={isRtl ? "rtl" : "ltr"}>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              {isRtl ? "السجلات الأخيرة" : "Recent Records"}
            </CardTitle>
            <CardDescription>
              {isRtl ? "قائمة بجميع العمليات السابقة" : "A list of all your previous operations"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {resumesLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : resumes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <Inbox className="h-12 w-12 text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-bold mb-2">{isRtl ? "لا توجد سجلات بعد" : "No records yet"}</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md">
                  {isRtl ? "ابدأ بتحليل سيرتك الذاتية أو إنشاء واحدة جديدة باستخدام المحرر" : "Start by analyzing a resume or creating one with the editor"}
                </p>
                <div className="flex gap-3">
                  <Link href="/#upload-section">
                    <Button variant="outline" className="rounded-xl font-bold">
                      {isRtl ? "تحليل سيرة ذاتية" : "Analyze Resume"}
                    </Button>
                  </Link>
                  <Link href="/editor">
                    <Button className="rounded-xl font-bold">
                      {isRtl ? "إنشاء جديد" : "Create New"}
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right" dir={isRtl ? "rtl" : "ltr"} data-testid="table-resumes">
                  <thead className="bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className={`px-6 py-4 ${isRtl ? 'text-right' : 'text-left'}`}>{isRtl ? "الملف" : "File"}</th>
                      <th className={`px-6 py-4 ${isRtl ? 'text-right' : 'text-left'}`}>{isRtl ? "التاريخ" : "Date"}</th>
                      <th className={`px-6 py-4 ${isRtl ? 'text-right' : 'text-left'}`}>{isRtl ? "النتيجة" : "Score"}</th>
                      <th className={`px-6 py-4 ${isRtl ? 'text-right' : 'text-left'}`}>{isRtl ? "النوع" : "Type"}</th>
                      <th className="px-6 py-4 text-center">{isRtl ? "إجراءات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {resumes.map((file) => (
                      <motion.tr 
                        key={file.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-primary/5 transition-colors group"
                        data-testid={`row-resume-${file.id}`}
                      >
                        <td className="px-6 py-4">
                          <div className={`flex items-center gap-3 ${isRtl ? 'text-right' : 'text-left'}`}>
                            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-bold text-sm">{file.fileName}</p>
                              <p className="text-xs text-muted-foreground">{file.template || "—"}</p>
                            </div>
                          </div>
                        </td>
                        <td className={`px-6 py-4 text-sm text-muted-foreground ${isRtl ? 'text-right' : 'text-left'}`}>
                          {new Date(file.createdAt).toLocaleDateString()}
                        </td>
                        <td className={`px-6 py-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                          {file.score != null ? (
                            <Badge variant={file.score > 80 ? "default" : "secondary"} className="rounded-lg">
                              {file.score}%
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className={`px-6 py-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                          <Badge variant="outline" className="rounded-lg">
                            {file.type === "analysis" ? (isRtl ? "تحليل" : "Analysis") : (isRtl ? "محرر" : "Editor")}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {file.type === "analysis" && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                                onClick={() => setLocation(`/analysis?id=${file.id}`)}
                                data-testid={`button-view-${file.id}`}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                            {file.type === "editor" && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                                onClick={() => setLocation(`/editor?id=${file.id}`)}
                                data-testid={`button-edit-${file.id}`}
                                title={isRtl ? "فتح في المحرر" : "Open in editor"}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => deleteMutation.mutate(file.id)}
                              data-testid={`button-delete-${file.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
        <div className="p-3 bg-muted rounded-xl shrink-0">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
