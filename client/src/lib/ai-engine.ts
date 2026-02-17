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
  skills: { subject: string; A: number; fullMark: number }[];
  checks: { labelEn: string; labelAr: string; status: 'pass' | 'fail' | 'warn' }[];
  suggestions: { id: string; titleEn: string; titleAr: string; descEn: string; descAr: string; impact: 'High' | 'Medium' }[];
}

export const analyzeResume = (fileName: string): AnalysisResult => {
  // Mocking the analysis based on "AI parsing"
  // In a real app, this would be a backend API call
  
  return {
    score: 82,
    summaryEn: "Your resume shows great potential in technical fields. The structure is clear, but you could improve by adding more quantifiable achievements and specific industry keywords.",
    summaryAr: "تظهر سيرتك الذاتية إمكانات كبيرة في المجالات التقنية. الهيكلية واضحة، ولكن يمكنك التحسين من خلال إضافة المزيد من الإنجازات القابلة للقياس والكلمات المفتاحية المتخصصة في المجال.",
    skills: [
      { subject: "Technical / تقني", A: 85, fullMark: 100 },
      { subject: "Soft Skills / مهارات ناعمة", A: 70, fullMark: 100 },
      { subject: "Structure / الهيكلية", A: 90, fullMark: 100 },
      { subject: "Impact / التأثير", A: 60, fullMark: 100 },
      { subject: "Relevance / الملاءمة", A: 75, fullMark: 100 },
    ],
    checks: [
      { labelEn: "File Format (PDF)", labelAr: "تنسيق الملف (PDF)", status: 'pass' },
      { labelEn: "Text Selectable", labelAr: "النص قابل للتحديد", status: 'pass' },
      { labelEn: "Contact Info Found", labelAr: "معلومات الاتصال موجودة", status: 'pass' },
      { labelEn: "Section Headers", labelAr: "عناوين الأقسام", status: 'pass' },
      { labelEn: "No Graphics/Tables", labelAr: "لا توجد رسومات/جداول", status: 'warn' },
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
        titleEn: "Industry Keywords",
        titleAr: "الكلمات المفتاحية للمجال",
        descEn: "Add more specific keywords found in the job description to pass ATS filters more effectively.",
        descAr: "أضف المزيد من الكلمات المفتاحية المحددة الموجودة في وصف الوظيفة لتجاوز فلاتر ATS بفعالية أكبر.",
        impact: "High"
      }
    ]
  };
};
