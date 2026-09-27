import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Save, User, Briefcase, GraduationCap, Sparkles, Layout, Wand2, Loader2, Languages, LogIn, Plus, Trash2, Link2, X, FolderOpen, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useReactToPrint } from "react-to-print";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

interface ExperienceEntry {
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  bullets: string;
}

interface ResumeLink {
  label: string;
  url: string;
}

interface ResumeData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  summary: string;
  experience: string;
  education: string;
  skills: string[];
  links: ResumeLink[];
  experiences: ExperienceEntry[];
}

interface SavedResumeRecord {
  id: string;
  fileName: string;
  type: string;
  template: string | null;
  createdAt: string;
}

function normalizeResumeData(value: any): ResumeData {
  const base: ResumeData = {
    fullName: value?.fullName ?? "أحمد محمد",
    jobTitle: value?.jobTitle ?? "مطور برمجيات",
    email: value?.email ?? "ahmed@example.com",
    phone: value?.phone ?? "+966 50 000 0000",
    summary: value?.summary ?? "مطور برمجيات شغوف ببناء تطبيقات ويب عالية الجودة وتجربة مستخدم مميزة.",
    experience: value?.experience ?? "",
    education: value?.education ?? "بكالوريوس علوم الحاسب - جامعة الملك سعود (2021)",
    skills: Array.isArray(value?.skills) ? value.skills.map((s: any) => String(s)) : [],
    links: Array.isArray(value?.links) ? value.links.map((l: any) => ({ label: String(l?.label ?? ""), url: String(l?.url ?? "") })) : [],
    experiences: Array.isArray(value?.experiences)
      ? value.experiences.map((e: any) => ({
          role: String(e?.role ?? ""),
          company: String(e?.company ?? ""),
          startDate: String(e?.startDate ?? ""),
          endDate: String(e?.endDate ?? ""),
          bullets: String(e?.bullets ?? ""),
        }))
      : [],
  };
  return base;
}

function serializeExperiences(experiences: ExperienceEntry[]): string {
  return experiences
    .filter((e) => e.role.trim() || e.company.trim() || e.bullets.trim())
    .map((e) => {
      const line = [e.role, e.company].filter(Boolean).join(" - ");
      const dates = [e.startDate, e.endDate].filter(Boolean).join(" إلى ");
      const head = [line, dates].filter(Boolean).join(" (") + (dates ? ")" : "");
      return [head, e.bullets.trim()].filter(Boolean).join("\n");
    })
    .join("\n\n");
}

const emptyExperience = (): ExperienceEntry => ({
  role: "",
  company: "",
  startDate: "",
  endDate: "",
  bullets: "",
});

export default function Editor() {
  const [isRtl, setIsRtl] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const activeTemplate = "ats";
  const componentRef = useRef<HTMLDivElement>(null);
  const [isImproving, setIsImproving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const savingRef = useRef(false);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData>(() =>
    normalizeResumeData({
      fullName: "أحمد محمد",
      jobTitle: "مطور برمجيات",
      email: "ahmed@example.com",
      phone: "+966 50 000 0000",
      summary: "مطور برمجيات شغوف ببناء تطبيقات ويب عالية الجودة وتجربة مستخدم مميزة.",
      experience: "• مطور واجهات أمامية في شركة تقنية (2022 - الحالي)\n• تطوير تطبيقات باستخدام React و Tailwind CSS\n• تحسين أداء المواقع بنسبة 30%",
      education: "بكالوريوس علوم الحاسب - جامعة الملك سعود (2021)",
      skills: ["React", "TypeScript", "Tailwind CSS"],
      links: [],
      experiences: [
        {
          role: "مطور واجهات أمامية",
          company: "شركة تقنية",
          startDate: "2022",
          endDate: "الحالي",
          bullets: "تطوير تطبيقات باستخدام React و Tailwind CSS\nتحسين أداء المواقع بنسبة 30%",
        },
      ],
    })
  );

  const { data: savedEditorResumes = [] } = useQuery<SavedResumeRecord[]>({
    queryKey: ["/api/resumes", "editor-list"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await fetch("/api/resumes", { credentials: "include" });
      if (!res.ok) return [];
      const all = (await res.json()) as SavedResumeRecord[];
      return all.filter((r) => r.type === "editor");
    },
  });

  const hasArabicChars = (text: string) => /[\u0600-\u06FF]/.test(text);

  const translateResume = async () => {
    const targetLang = isRtl ? "en" : "ar";
    const sourceText = [
      resumeData.fullName,
      resumeData.jobTitle,
      resumeData.summary,
      resumeData.experience,
      resumeData.education,
      ...resumeData.experiences.flatMap((e) => [e.role, e.company, e.bullets]),
    ].join(" ");

    const needsArabicSource = targetLang === "en";
    const hasSourceContent = needsArabicSource
      ? hasArabicChars(sourceText)
      : /[a-zA-Z]{2,}/.test(sourceText);

    if (!hasSourceContent) {
      toast({
        title: isRtl ? "لا حاجة للترجمة" : "Nothing to translate",
        description: isRtl
          ? `المحتوى الحالي بالفعل باللغة ${targetLang === "en" ? "الإنجليزية" : "العربية"}.`
          : `Content is already in ${targetLang === "en" ? "English" : "Arabic"}.`,
      });
      return;
    }

    setIsTranslating(true);

    try {
      const response = await fetch("/api/resumes/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          targetLang,
          resumeData: {
            ...resumeData,
            experience: resumeData.experience || serializeExperiences(resumeData.experiences),
          },
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || "Translate failed");
      }

      if (!result?.resumeData) {
        throw new Error("Invalid translate response");
      }

      const translated = normalizeResumeData(result.resumeData);

      const unchanged =
        translated.fullName === resumeData.fullName &&
        translated.jobTitle === resumeData.jobTitle &&
        translated.summary === resumeData.summary &&
        translated.experience === resumeData.experience &&
        translated.education === resumeData.education;

      if (unchanged) {
        toast({
          title: isRtl ? "لم تتغير البيانات" : "No changes applied",
          description: isRtl
            ? "تعذرت ترجمة النص الحالي. جرّب تعديل المحتوى أو تفعيل مفتاح الذكاء الاصطناعي."
            : "Could not translate the current text. Try editing content or enabling the AI API key.",
          variant: "destructive",
        });
        return;
      }

      setResumeData(translated);

      const descriptionBySource: Record<string, { ar: string; en: string }> = {
        ai: {
          ar: "تمت ترجمة محتوى السيرة الذاتية بذكاء.",
          en: "Resume content has been intelligently translated.",
        },
        free: {
          ar: "تمت الترجمة عبر خدمة الترجمة المجانية.",
          en: "Translated using the free translation service.",
        },
        fallback: {
          ar: "تمت ترجمة جزئية فقط. للحصول على دقة أعلى فعّل مفتاح AI.",
          en: "Partial translation only. Enable the AI API key for higher accuracy.",
        },
      };
      const sourceKey = (result.source as string) || "free";
      const copy = descriptionBySource[sourceKey] ?? descriptionBySource.free;

      toast({
        title: isRtl ? "تمت الترجمة!" : "Translated!",
        description: isRtl ? copy.ar : copy.en,
      });
    } catch (err) {
      toast({
        title: isRtl ? "تعذرت الترجمة" : "Translation failed",
        description:
          err instanceof Error
            ? err.message
            : isRtl
              ? "حدث خطأ أثناء الترجمة. حاول مرة أخرى."
              : "An error occurred while translating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const improveContent = async () => {
    setIsImproving(true);
    try {
      const response = await fetch("/api/resumes/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          targetLang: isRtl ? "ar" : "en",
          resumeData: {
            ...resumeData,
            experience: resumeData.experience || serializeExperiences(resumeData.experiences),
          },
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || "Improve failed");
      }

      if (!result?.resumeData) {
        throw new Error("Invalid improve response");
      }

      setResumeData(normalizeResumeData(result.resumeData));

      toast({
        title: isRtl ? "تم التحسين بالذكاء!" : "AI Improvement Done!",
        description: isRtl
          ? "قام الذكاء الاصطناعي بإعادة صياغة سيرتك الذاتية باحترافية."
          : "AI has professionally rewritten your resume content.",
      });
    } catch (err) {
      toast({
        title: isRtl ? "تعذر التحسين" : "Improvement failed",
        description:
          err instanceof Error
            ? err.message
            : isRtl
              ? "حدث خطأ أثناء التحسين. حاول مرة أخرى."
              : "An error occurred while improving. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImproving(false);
    }
  };

  useEffect(() => {
    const checkLang = () => setIsRtl(document.documentElement.dir === 'rtl');
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });

    const params = new URLSearchParams(window.location.search);

    const resumeId = params.get('id');
    if (resumeId) {
      fetch(`/api/resumes/${resumeId}`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (data?.resumeData) {
            setResumeData(normalizeResumeData(data.resumeData));
            setEditingId(resumeId);
          }
        })
        .catch(() => {});
    }

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (index: number, field: keyof ExperienceEntry, value: string) => {
    setResumeData((prev) => {
      const experiences = prev.experiences.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      );
      return {
        ...prev,
        experiences,
        experience: prev.experience || serializeExperiences(experiences),
      };
    });
  };

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, emptyExperience()],
    }));
  };

  const removeExperience = (index: number) => {
    setResumeData((prev) => {
      const experiences = prev.experiences.filter((_, i) => i !== index);
      return {
        ...prev,
        experiences,
        experience: prev.experience || serializeExperiences(experiences),
      };
    });
  };

  const addSkill = () => {
    const skill = skillInput.trim().replace(/,$/, "");
    if (!skill) return;
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills : [...prev.skills, skill],
    }));
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setResumeData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  const addLink = () => {
    setResumeData((prev) => ({
      ...prev,
      links: [...prev.links, { label: "", url: "" }],
    }));
  };

  const updateLink = (index: number, field: keyof ResumeLink, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      links: prev.links.map((link, i) => (i === index ? { ...link, [field]: value } : link)),
    }));
  };

  const removeLink = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const saveResume = async (silent = false) => {
    if (!isAuthenticated) {
      if (!silent) {
        toast({
          title: isRtl ? "يجب تسجيل الدخول" : "Login Required",
          description: isRtl ? "سجل دخولك لحفظ السيرة الذاتية" : "Sign in to save your resume",
          variant: "destructive",
        });
        setTimeout(() => setLocation("/login"), 1200);
      }
      return;
    }

    if (savingRef.current) return;
    savingRef.current = true;
    setIsSaving(true);
    if (!silent) setSaveState("saving");

    const payload = {
      fileName: resumeData.fullName ? `${resumeData.fullName}_Resume` : "Untitled Resume",
      template: activeTemplate,
      resumeData: {
        ...resumeData,
        experience: serializeExperiences(resumeData.experiences),
      },
    };

    try {
      const url = editingId ? `/api/resumes/editor/${editingId}` : "/api/resumes/editor";
      const method = editingId ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Save failed");

      const saved = await response.json();
      if (!editingId && saved?.id) {
        setEditingId(saved.id);
      }

      setSaveState("saved");
      if (!silent) {
        toast({
          title: isRtl ? "تم الحفظ" : "Saved",
          description: isRtl ? "تم حفظ السيرة الذاتية في لوحة التحكم" : "Resume saved to your dashboard",
        });
      }
    } catch {
      setSaveState("error");
      if (!silent) {
        toast({
          title: isRtl ? "خطأ" : "Error",
          description: isRtl ? "فشل حفظ السيرة الذاتية" : "Failed to save resume",
          variant: "destructive",
        });
      }
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      saveResume(true);
    }, 2000);
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [resumeData, activeTemplate, isAuthenticated]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Resume_${resumeData.fullName}`,
  });

  const openSavedResume = (id: string) => {
    setLocation(`/editor?id=${id}`);
  };

  return (
    <div className="min-h-screen bg-secondary/10 font-sans flex flex-col pt-40 lg:pt-48 pb-12">
      <Navbar />

      {/* Guest save banner */}
      {!isAuthenticated && (
        <div className="fixed top-[70px] left-0 right-0 z-40 bg-amber-500 text-white px-4 py-3 shadow-lg">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 font-medium text-sm">
              <LogIn className="h-4 w-4 shrink-0" />
              <span>
                {isRtl
                  ? "أنت تتصفح كمضيف — سجل دخولك لحفظ سيرتك الذاتية."
                  : "You're browsing as a guest — sign in to save your resume."
                }
              </span>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 rounded-lg font-bold text-xs bg-white/20 hover:bg-white/30 text-white border-0 shrink-0"
              onClick={() => setLocation("/login")}
              data-testid="button-editor-signin"
            >
              {isRtl ? "تسجيل الدخول" : "Sign In"}
            </Button>
          </div>
        </div>
      )}
      
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-6 h-full flex flex-col">
        <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[calc(100vh-140px)]">
          
          {/* Editor Side */}
          <div className="w-full lg:w-1/3 flex flex-col h-[800px] lg:h-full shrink-0">
            <Card className="h-full flex flex-col shadow-soft-lg border-0 rounded-3xl overflow-hidden bg-card">
              <CardHeader className="border-b bg-background/95 backdrop-blur-md px-6 py-5 z-10 shrink-0">
                <CardTitle className="flex flex-col gap-4 text-xl font-bold font-heading">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 text-primary">
                      <Sparkles className="h-6 w-6 text-blue-500" />
                      {isRtl ? "محرر خبير" : "Khabir Editor"}
                    </div>
                    {isAuthenticated && (
                      <div className="flex items-center gap-2">
                        {isSaving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                        {!isSaving && saveState === "saved" && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            {isRtl ? "تم الحفظ" : "Saved"}
                          </span>
                        )}
                        {!isSaving && saveState === "error" && (
                          <span className="text-xs font-semibold text-destructive">
                            {isRtl ? "خطأ بالحفظ" : "Save error"}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {isAuthenticated && savedEditorResumes.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start gap-2 text-xs h-8 text-muted-foreground font-semibold hover:text-primary"
                      onClick={() => {
                        const sel = document.createElement("select");
                        sel.style.display = "none";
                        savedEditorResumes.forEach((r) => {
                          const opt = document.createElement("option");
                          opt.value = r.id;
                          opt.textContent = `${r.fileName} (${new Date(r.createdAt).toLocaleDateString()})`;
                          sel.appendChild(opt);
                        });
                        const onChange = (e: Event) => {
                          const target = e.target as HTMLSelectElement;
                          if (target.value) openSavedResume(target.value);
                        };
                        sel.addEventListener("change", onChange);
                        document.body.appendChild(sel);
                        sel.focus();
                      }}
                    >
                      <FolderOpen className="h-4 w-4 shrink-0" />
                      {isRtl ? "فتح سيرة محفوظة" : "Open Saved Resume"}
                    </Button>
                  )}
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <Button 
                      variant="outline" 
                      className="rounded-xl border-border font-semibold shadow-sm hover:bg-secondary/50 flex gap-2 h-11"
                      onClick={translateResume}
                      disabled={isTranslating}
                    >
                      {isTranslating ? <Loader2 className="h-4 w-4 animate-spin shrink-0" /> : <Languages className="h-4 w-4 shrink-0" />}
                      <span className="truncate">{isRtl ? "ترجمة للإنجليزية" : "Translate to Arabic"}</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-semibold shadow-sm flex gap-2 h-11"
                      onClick={improveContent}
                      disabled={isImproving}
                    >
                      {isImproving ? <Loader2 className="h-4 w-4 animate-spin shrink-0" /> : <Wand2 className="h-4 w-4 shrink-0" />}
                      <span className="truncate">{isRtl ? "تحسين بالذكاء" : "AI Improve"}</span>
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-5 md:p-6 custom-scrollbar bg-background">
                <div className="mb-8 flex items-center justify-between gap-3 bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3">
                  <label className="text-sm font-bold flex items-center gap-2 text-foreground">
                    <Layout className="h-4 w-4 text-primary" />
                    {isRtl ? "القالب: ATS" : "Template: ATS"}
                  </label>
                  <Badge variant="outline" className="rounded-lg text-xs font-bold text-primary border-primary/30">{isRtl ? "متوافق مع أنظمة التوظيف" : "ATS Friendly"}</Badge>
                </div>

                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6 bg-secondary/50 p-1.5 rounded-2xl h-auto border border-border/50">
                    <TabsTrigger value="personal" className="rounded-xl py-2.5 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex items-center justify-center gap-1">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{isRtl ? "الشخصية" : "Personal"}</span>
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="rounded-xl py-2.5 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex items-center justify-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span className="hidden sm:inline">{isRtl ? "الخبرة" : "Experience"}</span>
                    </TabsTrigger>
                    <TabsTrigger value="education" className="rounded-xl py-2.5 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex items-center justify-center gap-1">
                      <GraduationCap className="h-4 w-4" />
                      <span className="hidden sm:inline">{isRtl ? "التعليم" : "Education"}</span>
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="rounded-xl py-2.5 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex items-center justify-center gap-1">
                      <Sparkles className="h-4 w-4" />
                      <span className="hidden sm:inline">{isRtl ? "المهارات" : "Skills"}</span>
                    </TabsTrigger>
                  </TabsList>

                  <div className="min-h-[420px]">
                      <TabsContent value="personal" className="space-y-5 mt-0 outline-none">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">{isRtl ? "الاسم الكامل" : "Full Name"}</label>
                            <Input name="fullName" value={resumeData.fullName} onChange={handleInputChange} className="bg-secondary/30 border-border/50 rounded-xl h-11 font-medium focus-visible:ring-primary/20" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">{isRtl ? "المسمى الوظيفي" : "Job Title"}</label>
                            <Input name="jobTitle" value={resumeData.jobTitle} onChange={handleInputChange} className="bg-secondary/30 border-border/50 rounded-xl h-11 font-medium focus-visible:ring-primary/20" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-foreground">{isRtl ? "البريد الإلكتروني" : "Email"}</label>
                              <Input name="email" value={resumeData.email} onChange={handleInputChange} className="bg-secondary/30 border-border/50 rounded-xl h-11 font-medium text-left focus-visible:ring-primary/20" dir="ltr" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-foreground">{isRtl ? "رقم الجوال" : "Phone"}</label>
                              <Input name="phone" value={resumeData.phone} onChange={handleInputChange} className="bg-secondary/30 border-border/50 rounded-xl h-11 font-medium text-left focus-visible:ring-primary/20" dir="ltr" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">{isRtl ? "نبذة تعريفية" : "Summary"}</label>
                            <Textarea name="summary" value={resumeData.summary} onChange={handleInputChange} className="min-h-[140px] bg-secondary/30 border-border/50 rounded-xl resize-none font-medium leading-relaxed p-4 focus-visible:ring-primary/20" />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="experience" className="space-y-5 mt-0 outline-none">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-semibold text-foreground">
                            {isRtl ? "الخبرات المهنية" : "Professional Experience"}
                          </label>
                          <Button variant="outline" size="sm" className="h-8 gap-1 text-xs font-bold rounded-xl" onClick={addExperience}>
                            <Plus className="h-4 w-4" />
                            {isRtl ? "إضافة خبرة" : "Add Entry"}
                          </Button>
                        </div>
                        {resumeData.experiences.length === 0 && (
                          <div className="text-sm text-muted-foreground text-center py-10 bg-secondary/20 rounded-2xl font-medium">
                            {isRtl ? "لا توجد خبرات بعد — أضف أول خبرة لك." : "No experience entries yet — add your first one."}
                          </div>
                        )}
                        {resumeData.experiences.map((entry, index) => (
                          <div key={index} className="space-y-3 p-4 rounded-2xl border border-border/50 bg-secondary/10">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="rounded-lg text-xs font-bold">
                                {isRtl ? `خبرة ${index + 1}` : `Entry ${index + 1}`}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                onClick={() => removeExperience(index)}
                                data-testid={`button-remove-exp-${index}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground">{isRtl ? "المسمى" : "Title"}</label>
                                <Input
                                  value={entry.role}
                                  onChange={(e) => handleExperienceChange(index, "role", e.target.value)}
                                  className="bg-background/60 border-border/50 rounded-xl h-10 text-sm font-medium"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground">{isRtl ? "الجهة" : "Company"}</label>
                                <Input
                                  value={entry.company}
                                  onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                                  className="bg-background/60 border-border/50 rounded-xl h-10 text-sm font-medium"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground">{isRtl ? "من تاريخ" : "Start"}</label>
                                <Input
                                  value={entry.startDate}
                                  onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                                  placeholder="2022"
                                  className="bg-background/60 border-border/50 rounded-xl h-10 text-sm font-medium"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground">{isRtl ? "إلى تاريخ" : "End"}</label>
                                <Input
                                  value={entry.endDate}
                                  onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                                  placeholder={isRtl ? "الحالي" : "Present"}
                                  className="bg-background/60 border-border/50 rounded-xl h-10 text-sm font-medium"
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-muted-foreground">
                                {isRtl ? "الإنجازات (نقطة لكل سطر)" : "Achievements (one bullet per line)"}
                              </label>
                              <Textarea
                                value={entry.bullets}
                                onChange={(e) => handleExperienceChange(index, "bullets", e.target.value)}
                                className="min-h-[120px] bg-background/60 border-border/50 rounded-xl resize-none text-sm font-medium p-3"
                              />
                            </div>
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent value="education" className="space-y-5 mt-0 outline-none">
                        <div className="space-y-2 flex flex-col h-full">
                          <label className="text-sm font-semibold text-foreground shrink-0 mb-1">{isRtl ? "المؤهلات العلمية" : "Education"}</label>
                          <Textarea name="education" value={resumeData.education} onChange={handleInputChange} className="min-h-[280px] flex-1 bg-secondary/30 border-border/50 rounded-xl resize-none font-medium p-4 leading-relaxed focus-visible:ring-primary/20" />
                        </div>
                      </TabsContent>

                      <TabsContent value="skills" className="space-y-5 mt-0 outline-none">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">{isRtl ? "المهارات" : "Skills"}</label>
                            <div className="flex gap-2">
                              <Input
                                value={skillInput}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSkillInput(e.target.value)}
                                onKeyDown={handleSkillKeyDown}
                                placeholder={isRtl ? "اكتب مهارة ثم Enter" : "Type a skill and press Enter"}
                                className="bg-secondary/30 border-border/50 rounded-xl h-11 font-medium flex-1 focus-visible:ring-primary/20"
                              />
                              <Button variant="outline" className="rounded-xl h-11 px-4 font-bold" onClick={addSkill}>
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-1">
                              {resumeData.skills.map((skill) => (
                                <span key={skill} className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-sm font-bold px-3 py-1.5 rounded-full">
                                  {skill}
                                  <button onClick={() => removeSkill(skill)} className="text-primary/60 hover:text-primary" aria-label={`Remove ${skill}`}>
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </span>
                              ))}
                              {resumeData.skills.length === 0 && (
                                <span className="text-sm text-muted-foreground font-medium">
                                  {isRtl ? "أضف مهاراتك لتحسين التوافق مع ATS." : "Add your skills to improve ATS compatibility."}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 pt-2">
                            <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                              <Link2 className="h-4 w-4" />
                              {isRtl ? "الروابط (LinkedIn / GitHub / موقع شخصي)" : "Links (LinkedIn / GitHub / Portfolio)"}
                            </label>
                            {resumeData.links.map((link, index) => (
                              <div key={index} className="flex gap-2 items-start">
                                <Input
                                  value={link.label}
                                  onChange={(e) => updateLink(index, "label", e.target.value)}
                                  placeholder={isRtl ? "الاسم (مثال: LinkedIn)" : "Label (e.g. LinkedIn)"}
                                  className="bg-secondary/30 border-border/50 rounded-xl h-11 font-medium w-1/3 focus-visible:ring-primary/20"
                                />
                                <Input
                                  value={link.url}
                                  onChange={(e) => updateLink(index, "url", e.target.value)}
                                  placeholder="https://..."
                                  dir="ltr"
                                  className="bg-secondary/30 border-border/50 rounded-xl h-11 font-medium flex-1 text-left focus-visible:ring-primary/20"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-11 w-11 shrink-0 text-destructive hover:bg-destructive/10 rounded-xl"
                                  onClick={() => removeLink(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button variant="outline" size="sm" className="gap-1 text-xs font-bold rounded-xl" onClick={addLink}>
                              <Plus className="h-4 w-4" />
                              {isRtl ? "إضافة رابط" : "Add Link"}
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row gap-3">
                    <Button onClick={() => saveResume()} className="flex-1 h-12 rounded-xl font-bold shadow-sm hover:shadow-md transition-all">
                      <Save className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                      {isRtl ? "حفظ التعديلات" : "Save Changes"}
                    </Button>
                    <Button onClick={() => handlePrint()} variant="outline" className="flex-1 h-12 rounded-xl border-border font-bold hover:bg-secondary/50 transition-all bg-background shadow-sm">
                      <Download className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                      {isRtl ? "تحميل PDF" : "Download PDF"}
                    </Button>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Preview Side */}
          <div className="flex-1 flex flex-col h-[800px] lg:h-full bg-background/50 backdrop-blur-sm rounded-3xl border shadow-soft p-4 md:p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4 px-2 shrink-0">
              <h3 className="text-sm font-bold flex items-center gap-2 text-muted-foreground tracking-widest uppercase">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                {isRtl ? "معاينة حية" : "Live Preview"}
              </h3>
              <div className="h-7 px-3 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold uppercase tracking-wider">{activeTemplate}</div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar flex justify-center items-start py-6 w-full rounded-2xl bg-secondary/30 shadow-inner relative">
              <div className="w-[210mm] max-w-full px-4 sm:px-8 transform origin-top mx-auto shrink-0 mb-8">
                <div ref={componentRef} className="w-full bg-white print:shadow-none shadow-soft-lg transition-all duration-300 rounded-sm">
                  <div className={`min-h-[297mm] w-full bg-white text-black p-10 sm:p-14 font-sans`}>
                  <ResumeATS data={resumeData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--border) / 0.8);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}

function ResumeATS({ data }: { data: ResumeData }) {
  return (
    <div className="p-10 sm:p-14 text-left h-full w-full font-sans" dir="ltr">
      <header className="mb-8">
        <h1 className="text-3xl font-bold uppercase tracking-wide text-black mb-2">{data.fullName}</h1>
        <p className="text-base font-semibold text-black mb-2">{data.jobTitle}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-medium text-black">
          {data.email && <span>Email: {data.email}</span>}
          {data.phone && <span>Phone: {data.phone}</span>}
          {data.links.filter(l => l.label && l.url).map((l, i) => (
            <span key={i}>{l.label}: {l.url}</span>
          ))}
        </div>
      </header>

      {data.summary && (
        <section className="mb-7">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 mb-3 text-black">Summary</h2>
          <p className="text-sm leading-relaxed text-black">{data.summary}</p>
        </section>
      )}

      <section className="mb-7">
        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 mb-3 text-black">Experience</h2>
        {data.experiences.length > 0 ? (
          data.experiences.filter(e => e.role.trim() || e.company.trim() || e.bullets.trim()).map((entry, i) => (
            <div key={i} className="mb-5">
              <div className="flex flex-wrap justify-between items-baseline gap-x-6">
                <h3 className="font-bold text-sm text-black">
                  {[entry.role, entry.company].filter(Boolean).join(" — ")}
                </h3>
                {[entry.startDate, entry.endDate].filter(Boolean).length > 0 && (
                  <span className="text-sm font-semibold text-black">
                    {[entry.startDate, entry.endDate].filter(Boolean).join(" – ")}
                  </span>
                )}
              </div>
              {entry.bullets.split("\n").filter(Boolean).length > 0 && (
                <ul className="mt-1.5 space-y-1">
                  {entry.bullets.split("\n").filter(Boolean).map((b, j) => (
                    <li key={j} className="text-sm leading-relaxed text-black flex gap-2">
                      <span className="shrink-0">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm whitespace-pre-line text-black">{data.experience}</p>
        )}
      </section>

      {data.skills.length > 0 && (
        <section className="mb-7">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 mb-3 text-black">Skills</h2>
          <p className="text-sm font-medium text-black">{data.skills.join(", ")}</p>
        </section>
      )}

      {data.education && (
        <section className="mb-7">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 mb-3 text-black">Education</h2>
          <p className="text-sm text-black whitespace-pre-line">{data.education}</p>
        </section>
      )}
    </div>
  );
}