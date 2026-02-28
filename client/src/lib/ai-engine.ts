/**
 * Khabir AI Engine - Mock Logic for Resume Analysis
 * This script simulates an NLP-based analysis of resume text.
 * In a real-world scenario, this would interface with an LLM (OpenAI/Anthropic)
 * or a specialized NLP library on the backend.
 */

export interface AnalysisResult {
  score: number;
  summaryEn: string;
  summaryAr: string;
  matchRate?: number;
  skills: { subject: string; A: number; fullMark: number; match?: boolean }[];
  checks: { labelEn: string; labelAr: string; status: 'pass' | 'fail' | 'warn' }[];
  suggestions: { id: string; titleEn: string; titleAr: string; descEn: string; descAr: string; impact: 'High' | 'Medium' }[];
}

export const analyzeResume = (fileName: string, jobDescription?: string): AnalysisResult => {
  // Mocking the analysis based on "AI parsing"
  // In a real app, this would be a backend API call
  
  const score = jobDescription ? 76 : 82;
  const matchRate = jobDescription ? Math.floor(Math.random() * 25) + 65 : undefined;

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
      { subject: "Technical / تقني", A: 85, fullMark: 100, match: true },
      { subject: "Soft Skills / مهارات ناعمة", A: 70, fullMark: 100, match: true },
      { subject: "Structure / الهيكلية", A: 90, fullMark: 100, match: true },
      { subject: "Impact / التأثير", A: 60, fullMark: 100, match: jobDescription ? false : true },
      { subject: "Relevance / الملاءمة", A: 75, fullMark: 100, match: true },
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
        titleEn: "Use Action Verbs",
        titleAr: "استخدم أفعال الحركة",
        descEn: "Start your bullet points with strong action verbs like 'Developed', 'Led', or 'Optimized' to show initiative.",
        descAr: "ابدأ نقاط خبرتك بأفعال حركة قوية مثل 'طورت'، 'قدت'، أو 'حسنت' لإظهار المبادرة.",
        impact: "High"
      },
      {
        id: "s-2",
        titleEn: jobDescription ? "Missing Keywords Found" : "Industry Keywords",
        titleAr: jobDescription ? "كلمات مفتاحية مفقودة" : "الكلمات المفتاحية للمجال",
        descEn: jobDescription 
          ? "The job description mentions 'Cloud Architecture' and 'CI/CD' which are missing from your resume."
          : "Add more specific keywords found in the job description to pass ATS filters more effectively.",
        descAr: jobDescription
          ? "يذكر الوصف الوظيفي 'Cloud Architecture' و 'CI/CD' وهي مفقودة في سيرتك الذاتية."
          : "أضف المزيد من الكلمات المفتاحية المحددة الموجودة في وصف الوظيفة لتجاوز فلاتر ATS بفعالية أكبر.",
        impact: "High"
      }
    ]
  };
};
