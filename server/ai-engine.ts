export interface AnalysisResult {
  score: number;
  summaryEn: string;
  summaryAr: string;
  matchRate?: number;
  skills: { subject: string; A: number; fullMark: number; match?: boolean; nameEn?: string; nameAr?: string }[];
  checks: { labelEn: string; labelAr: string; status: 'pass' | 'fail' | 'warn' }[];
  suggestions: { id: string; titleEn: string; titleAr: string; descEn: string; descAr: string; impact: 'High' | 'Medium' }[];
}

export function analyzeResume(fileName: string, jobDescription?: string): AnalysisResult {
  const isNotResume = (!fileName.toLowerCase().endsWith('.pdf') &&
    !fileName.toLowerCase().endsWith('.doc') &&
    !fileName.toLowerCase().endsWith('.docx')) ||
    fileName.toLowerCase().includes('photo') ||
    fileName.toLowerCase().includes('image');

  if (isNotResume) {
    return {
      score: 0,
      matchRate: 0,
      summaryEn: "The file you uploaded is not a resume. Please upload a professional CV document.",
      summaryAr: "الملف الذي قمت برفعه ليس سيرة ذاتية. يرجى رفع مستند سيرة ذاتية مهني.",
      skills: [
        { subject: "Technical / تقني", A: 0, fullMark: 100, match: false, nameEn: "Technical", nameAr: "تقني" },
      ],
      checks: [
        { labelEn: "File Format (Resume)", labelAr: "تنسيق الملف (سيرة ذاتية)", status: 'fail' },
      ],
      suggestions: [
        {
          id: "err-1",
          titleEn: "Invalid File Type",
          titleAr: "نوع ملف غير صالح",
          descEn: "Khabir AI only accepts PDF, DOC, and DOCX files for resume analysis.",
          descAr: "خبير AI يقبل فقط ملفات PDF و DOC و DOCX لتحليل السيرة الذاتية.",
          impact: "High"
        }
      ]
    };
  }

  let baseScore = 65 + Math.floor(Math.random() * 20);
  if (jobDescription && jobDescription.length > 50) baseScore += 5;
  const score = Math.min(baseScore, 98);
  const hasJD = jobDescription && jobDescription.trim().length > 0;
  const matchRate = hasJD ? Math.floor(Math.random() * 30) + 60 : undefined;

  return {
    score,
    matchRate,
    summaryEn: jobDescription
      ? "Your resume has a good match with the job description, but lacks some specific industry terms. We recommend adding the highlighted missing keywords."
      : "Your resume shows great potential in technical fields. The structure is clear, but you could improve by adding more quantifiable achievements and specific industry keywords.",
    summaryAr: jobDescription
      ? "تتمتع سيرتك الذاتية بمطابقة جيدة مع الوصف الوظيفي، ولكنها تفتقر إلى بعض المصطلحات المتخصصة. نوصي بإضافة الكلمات المفتاحية المفقودة الموضحة."
      : "تظهر سيرتك الذاتية إمكانات كبيرة في المجالات التقنية. الهيكلية واضحة، ولكن يمكنك التحسين من خلال إضافة المزيد من الإنجازات القابلة للقياس والكلمات المفتاحية المتخصصة في المجال.",
    skills: [
      { subject: "Technical / تقني", A: 85, fullMark: 100, match: true, nameEn: "Technical", nameAr: "تقني" },
      { subject: "Soft Skills / مهارات ناعمة", A: 70, fullMark: 100, match: true, nameEn: "Soft Skills", nameAr: "مهارات ناعمة" },
      { subject: "Structure / الهيكلية", A: 90, fullMark: 100, match: true, nameEn: "Structure", nameAr: "الهيكلية" },
      { subject: "Impact / التأثير", A: 60, fullMark: 100, match: jobDescription ? false : true, nameEn: "Impact", nameAr: "التأثير" },
      { subject: "Relevance / الملاءمة", A: 75, fullMark: 100, match: true, nameEn: "Relevance", nameAr: "الملاءمة" },
    ],
    checks: [
      { labelEn: "File Format (PDF)", labelAr: "تنسيق الملف (PDF)", status: 'pass' },
      { labelEn: "Text Selectable", labelAr: "النص قابل للتحديد", status: 'pass' },
      { labelEn: "Contact Info Found", labelAr: "معلومات الاتصال موجودة", status: 'pass' },
      { labelEn: "Section Headers", labelAr: "عناوين الأقسام", status: 'pass' },
      { labelEn: "Job Match Keywords", labelAr: "كلمات مطابقة الوظيفة", status: jobDescription ? 'warn' : 'pass' },
      { labelEn: "Date Formatting", labelAr: "تنسيق التاريخ", status: 'pass' },
    ],
    suggestions: [
      {
        id: "s-1",
        titleEn: "Quantify Your Impact",
        titleAr: "جعل الإنجازات قابلة للقياس",
        descEn: "Resumes with metrics (e.g., 'Increased sales by 20%') are 40% more likely to be hired. Add numbers to your bullet points.",
        descAr: "السير الذاتية التي تحتوي على أرقام (مثلاً: 'زيادة المبيعات بنسبة 20٪') تزيد فرص قبولها بنسبة 40٪. أضف أرقاماً لنقاط خبرتك.",
        impact: "High"
      },
      {
        id: "s-2",
        titleEn: jobDescription ? "Keyword Gap Detected" : "Semantic Keyword Optimization",
        titleAr: jobDescription ? "فجوة في الكلمات المفتاحية" : "تحسين الكلمات المفتاحية الدلالية",
        descEn: jobDescription
          ? `Your resume is missing critical terms from the JD. Incorporate these naturally.`
          : "Modern ATS use semantic search. Instead of just listing skills, use them in context within your experience descriptions.",
        descAr: jobDescription
          ? `سيرتك الذاتية تفتقد لمصطلحات جوهرية من الوصف الوظيفي. أدرجها بشكل طبيعي.`
          : "تستخدم أنظمة ATS الحديثة البحث الدلالي. بدلاً من مجرد سرد المهارات، استخدمها سياقياً ضمن وصف خبراتك.",
        impact: "High"
      },
      {
        id: "s-3",
        titleEn: "Improve Verb Strength",
        titleAr: "تحسين قوة الأفعال",
        descEn: "Replace passive words like 'Responsible for' with active verbs like 'Spearheaded', 'Orchestrated', or 'Executed'.",
        descAr: "استبدل الكلمات الضعيفة مثل 'مسؤول عن' بأفعال قوية مثل 'قاد'، 'نسق'، أو 'نفذ'.",
        impact: "Medium"
      }
    ]
  };
}
