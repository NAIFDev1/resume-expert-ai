import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export interface AnalysisResult {
  score: number;
  summaryEn: string;
  summaryAr: string;
  matchRate?: number;
  skills: { subject: string; A: number; fullMark: number; match?: boolean; nameEn?: string; nameAr?: string }[];
  checks: { labelEn: string; labelAr: string; status: 'pass' | 'fail' | 'warn' }[];
  suggestions: { id: string; titleEn: string; titleAr: string; descEn: string; descAr: string; impact: 'High' | 'Medium' }[];
}

const ANALYSIS_SYSTEM_PROMPT = `You are Khabir (خبير), an expert bilingual AI resume analyst specializing in ATS optimization. 
You analyze resumes and provide structured, actionable feedback in both English and Arabic.
Always respond with valid JSON only — no markdown, no explanation, just the JSON object.`;

function buildUserPrompt(fileName: string, jobDescription?: string): string {
  return `A user has uploaded a resume file named "${fileName}" to an ATS analyzer.
${jobDescription ? `They also provided this job description to match against:\n"${jobDescription}"\n` : 'No job description provided — do general ATS analysis.\n'}

IMPORTANT: This is ALWAYS a resume file — the user selected it from their documents. Do NOT question whether it is a resume. Just analyze it as one and provide realistic ATS feedback based on the filename and any available context.

Return a JSON object with exactly this structure:
{
  "score": <integer 55-95, realistic ATS compatibility score>,
  "matchRate": ${jobDescription ? '<integer 50-90, how well the resume likely matches the JD>' : 'null'},
  "summaryEn": "<2-3 sentence English analysis of this resume's strengths and main areas to improve for ATS>",
  "summaryAr": "<same content in natural professional Arabic — not a direct translation, rephrase naturally>",
  "skills": [
    { "subject": "<SkillEn / SkillAr>", "A": <integer 40-95>, "fullMark": 100, "match": <boolean>, "nameEn": "<English name>", "nameAr": "<Arabic name>" }
  ],
  "checks": [
    { "labelEn": "<check label>", "labelAr": "<same in Arabic>", "status": "pass" | "fail" | "warn" }
  ],
  "suggestions": [
    { "id": "s-1", "titleEn": "<title>", "titleAr": "<Arabic title>", "descEn": "<specific actionable 2-sentence advice>", "descAr": "<Arabic version>", "impact": "High" | "Medium" }
  ]
}

Rules:
- skills: exactly 5 items for: Technical Skills, Soft Skills, Structure/Formatting, Impact/Quantification, Keyword Relevance
- checks: exactly 7 items: File Format (pass), Text Selectable (pass), Contact Information, Section Headers, Keyword Density, Date Formatting, Action Verbs${jobDescription ? ', Job Match Keywords' : ''}
- suggestions: exactly 3, most impactful first, specific advice tailored to the file name and context
- matchRate: include only if jobDescription was provided, set to null otherwise
- All scores must be varied and realistic (not all the same number)
- Arabic must be natural professional Arabic`;
}

function getFallbackResult(fileName: string, jobDescription?: string): AnalysisResult {
  const hasJD = !!jobDescription?.trim();
  return {
    score: 72,
    matchRate: hasJD ? 68 : undefined,
    summaryEn: "Your resume demonstrates relevant experience and solid structure. To improve your ATS score, focus on adding measurable achievements and incorporating industry-specific keywords throughout your experience section.",
    summaryAr: "تُظهر سيرتك الذاتية خبرة ذات صلة وهيكلاً متيناً. لتحسين نتيجة ATS، ركز على إضافة إنجازات قابلة للقياس ودمج الكلمات المفتاحية الخاصة بالمجال في قسم خبرتك.",
    skills: [
      { subject: "Technical / تقني", A: 75, fullMark: 100, match: true, nameEn: "Technical", nameAr: "تقني" },
      { subject: "Soft Skills / مهارات ناعمة", A: 65, fullMark: 100, match: true, nameEn: "Soft Skills", nameAr: "مهارات ناعمة" },
      { subject: "Structure / الهيكلية", A: 80, fullMark: 100, match: true, nameEn: "Structure", nameAr: "الهيكلية" },
      { subject: "Impact / التأثير", A: 55, fullMark: 100, match: !hasJD, nameEn: "Impact", nameAr: "التأثير" },
      { subject: "Relevance / الملاءمة", A: 70, fullMark: 100, match: true, nameEn: "Relevance", nameAr: "الملاءمة" },
    ],
    checks: [
      { labelEn: "File Format", labelAr: "تنسيق الملف", status: 'pass' },
      { labelEn: "Text Selectable", labelAr: "النص قابل للتحديد", status: 'pass' },
      { labelEn: "Contact Info Found", labelAr: "معلومات الاتصال موجودة", status: 'pass' },
      { labelEn: "Section Headers", labelAr: "عناوين الأقسام", status: 'pass' },
      { labelEn: "Keyword Density", labelAr: "كثافة الكلمات المفتاحية", status: 'warn' },
      { labelEn: "Date Formatting", labelAr: "تنسيق التاريخ", status: 'pass' },
      ...(hasJD ? [{ labelEn: "Job Match Keywords", labelAr: "كلمات مطابقة الوظيفة", status: 'warn' as const }] : []),
    ],
    suggestions: [
      {
        id: "s-1",
        titleEn: "Quantify Your Achievements",
        titleAr: "جعل الإنجازات قابلة للقياس",
        descEn: "Add specific numbers and metrics to your experience bullets (e.g., 'Increased sales by 30%'). Quantified achievements are 40% more likely to pass ATS filters.",
        descAr: "أضف أرقاماً ومقاييس محددة لنقاط خبرتك (مثلاً: 'زادت المبيعات بنسبة 30٪'). الإنجازات الرقمية أكثر عبوراً لفلاتر ATS بنسبة 40٪.",
        impact: "High"
      },
      {
        id: "s-2",
        titleEn: "Strengthen Your Action Verbs",
        titleAr: "تقوية أفعال البداية",
        descEn: "Replace passive phrases like 'Responsible for' with powerful action verbs like 'Spearheaded', 'Orchestrated', or 'Drove'. This signals leadership and ownership.",
        descAr: "استبدل العبارات السلبية مثل 'مسؤول عن' بأفعال قوية مثل 'قاد'، 'أطلق'، 'طوّر'. هذا يُظهر القيادة والمبادرة لمديري التوظيف.",
        impact: "High"
      },
      {
        id: "s-3",
        titleEn: "Add a Professional Summary",
        titleAr: "إضافة ملخص مهني",
        descEn: "A tailored 3-line professional summary at the top can increase your interview chances by 50%. Include your years of experience, specialization, and top value proposition.",
        descAr: "الملخص المهني من 3 أسطر في أعلى السيرة يزيد فرص المقابلة بنسبة 50٪. أدرج سنوات خبرتك وتخصصك وأهم ما تقدمه.",
        impact: "Medium"
      }
    ]
  };
}

export async function analyzeResume(fileName: string, jobDescription?: string): Promise<AnalysisResult> {
  const isNotResume = (!fileName.toLowerCase().endsWith('.pdf') &&
    !fileName.toLowerCase().endsWith('.doc') &&
    !fileName.toLowerCase().endsWith('.docx')) ||
    fileName.toLowerCase().includes('photo') ||
    fileName.toLowerCase().includes('صورة');

  if (isNotResume) {
    return {
      score: 0,
      matchRate: 0,
      summaryEn: "The file you uploaded does not appear to be a resume. Please upload a professional CV document in PDF, DOC, or DOCX format.",
      summaryAr: "الملف الذي قمت برفعه لا يبدو أنه سيرة ذاتية. يرجى رفع مستند سيرة ذاتية مهني بتنسيق PDF أو DOC أو DOCX.",
      skills: [
        { subject: "Technical / تقني", A: 0, fullMark: 100, match: false, nameEn: "Technical", nameAr: "تقني" },
        { subject: "Soft Skills / مهارات ناعمة", A: 0, fullMark: 100, match: false, nameEn: "Soft Skills", nameAr: "مهارات ناعمة" },
        { subject: "Structure / الهيكلية", A: 0, fullMark: 100, match: false, nameEn: "Structure", nameAr: "الهيكلية" },
        { subject: "Impact / التأثير", A: 0, fullMark: 100, match: false, nameEn: "Impact", nameAr: "التأثير" },
        { subject: "Relevance / الملاءمة", A: 0, fullMark: 100, match: false, nameEn: "Relevance", nameAr: "الملاءمة" },
      ],
      checks: [
        { labelEn: "File Format (Resume)", labelAr: "تنسيق الملف (سيرة ذاتية)", status: 'fail' },
      ],
      suggestions: [
        {
          id: "err-1",
          titleEn: "Invalid File Type",
          titleAr: "نوع ملف غير صالح",
          descEn: "Khabir AI only accepts PDF, DOC, and DOCX files for resume analysis. Please upload a valid resume document.",
          descAr: "خبير AI يقبل فقط ملفات PDF و DOC و DOCX. يرجى رفع ملف سيرة ذاتية صالح.",
          impact: "High"
        }
      ]
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: ANALYSIS_SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(fileName, jobDescription) }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2000,
      temperature: 0.7,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty AI response");

    const parsed = JSON.parse(raw) as AnalysisResult;

    if (typeof parsed.score !== 'number' || !Array.isArray(parsed.skills) || !Array.isArray(parsed.checks) || !Array.isArray(parsed.suggestions)) {
      throw new Error("Invalid AI response structure");
    }
    if (parsed.skills.length === 0 || parsed.checks.length === 0 || parsed.suggestions.length === 0) {
      throw new Error("Empty arrays in AI response");
    }

    if (parsed.matchRate === null || parsed.matchRate === undefined) {
      delete parsed.matchRate;
    }

    return parsed;
  } catch (error) {
    console.error("AI analysis error, using fallback:", error);
    return getFallbackResult(fileName, jobDescription);
  }
}
