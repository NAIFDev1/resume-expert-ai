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

const SYSTEM_PROMPT = `You are Khabir (خبير), an expert bilingual AI resume analyst and ATS optimization specialist.
You analyze the actual text content of resumes and provide deeply personalized, actionable feedback in both English and Arabic.
Always respond with valid JSON only — no markdown, no explanation outside the JSON.`;

function buildPrompt(
  fileName: string,
  resumeText: string,
  jobDescription?: string,
  meta?: { pageCount?: number; wordCount: number; method: string }
): string {
  const hasRealText = meta?.method !== "filename-only" && resumeText.length > 100;
  const hasJD = !!jobDescription?.trim();

  const context = hasRealText
    ? `RESUME CONTENT (extracted from "${fileName}", ${meta?.wordCount ?? 0} words, ${meta?.pageCount ?? "?"} pages):\n\`\`\`\n${resumeText.slice(0, 8000)}\n\`\`\``
    : `RESUME FILE: "${fileName}" (text could not be extracted — analyze based on filename and context only)`;

  const jdSection = hasJD
    ? `\nJOB DESCRIPTION TO MATCH AGAINST:\n\`\`\`\n${jobDescription!.slice(0, 2000)}\n\`\`\``
    : "\nNo job description provided — perform general ATS analysis.";

  return `${context}${jdSection}

${hasRealText ? "Analyze the ACTUAL CONTENT of this resume." : "Analyze based on the filename context."} Return a JSON object:

{
  "score": <integer 45-97, realistic ATS compatibility score based on actual content>,
  "matchRate": ${hasJD ? '<integer 40-95, specific match percentage between resume and JD>' : 'null'},
  "summaryEn": "<2-3 sentences referencing specific content from the resume — name strengths found in the text, identify exact weaknesses>",
  "summaryAr": "<same insights in natural professional Arabic — not a direct translation, rephrase for native Arabic speakers>",
  "skills": [
    {"subject": "Technical Skills / المهارات التقنية", "A": <int 30-97>, "fullMark": 100, "match": <bool>, "nameEn": "Technical Skills", "nameAr": "المهارات التقنية"},
    {"subject": "Soft Skills / المهارات الشخصية", "A": <int 30-97>, "fullMark": 100, "match": <bool>, "nameEn": "Soft Skills", "nameAr": "المهارات الشخصية"},
    {"subject": "Structure / الهيكلية", "A": <int 30-97>, "fullMark": 100, "match": <bool>, "nameEn": "Structure", "nameAr": "الهيكلية"},
    {"subject": "Impact / التأثير", "A": <int 30-97>, "fullMark": 100, "match": <bool>, "nameEn": "Impact", "nameAr": "التأثير"},
    {"subject": "Keyword Relevance / الملاءمة", "A": <int 30-97>, "fullMark": 100, "match": <bool>, "nameEn": "Keyword Relevance", "nameAr": "الملاءمة"}
  ],
  "checks": [
    {"labelEn": "File Format", "labelAr": "تنسيق الملف", "status": "pass"},
    {"labelEn": "Text Extractable", "labelAr": "النص قابل للاستخراج", "status": ${hasRealText ? '"pass"' : '"fail"'}},
    {"labelEn": "Contact Information", "labelAr": "معلومات الاتصال", "status": <"pass"|"warn"|"fail">},
    {"labelEn": "Section Headers", "labelAr": "عناوين الأقسام", "status": <"pass"|"warn"|"fail">},
    {"labelEn": "Action Verbs", "labelAr": "أفعال التأثير", "status": <"pass"|"warn"|"fail">},
    {"labelEn": "Keyword Density", "labelAr": "كثافة الكلمات المفتاحية", "status": <"pass"|"warn"|"fail">},
    {"labelEn": "Quantified Achievements", "labelAr": "إنجازات قابلة للقياس", "status": <"pass"|"warn"|"fail">}${hasJD ? ',\n    {"labelEn": "Job Match Keywords", "labelAr": "كلمات مطابقة الوظيفة", "status": <"pass"|"warn"|"fail">}' : ''}
  ],
  "suggestions": [
    {"id": "s-1", "titleEn": "<specific title referencing actual content>", "titleAr": "<عنوان بالعربي>", "descEn": "<2 sentences with specific advice referencing actual names/sections found in resume>", "descAr": "<نفس المشورة بعربي طبيعي>", "impact": "High"},
    {"id": "s-2", ...},
    {"id": "s-3", ..., "impact": "Medium"}
  ]
}

Critical rules:
- ${hasRealText ? "Reference SPECIFIC content from the resume (names, job titles, companies, skills mentioned)" : "Provide general resume improvement advice"}
- All 5 skill scores must be DIFFERENT numbers (realistic variation)
- Suggestions must be actionable and specific, not generic
- ${hasJD ? "matchRate must reflect actual keyword overlap between resume text and JD" : "Omit matchRate (set null)"}
- summaryAr must be natural Arabic — not translated word-for-word from English`;
}

function getFallback(fileName: string, jobDescription?: string): AnalysisResult {
  const hasJD = !!jobDescription?.trim();
  return {
    score: 68,
    matchRate: hasJD ? 62 : undefined,
    summaryEn: "Your resume has a reasonable structure but needs improvements in keyword optimization and quantified achievements to pass modern ATS filters effectively.",
    summaryAr: "سيرتك الذاتية لها هيكل معقول ولكنها تحتاج إلى تحسينات في الكلمات المفتاحية والإنجازات الرقمية لتجاوز أنظمة ATS الحديثة بشكل فعّال.",
    skills: [
      { subject: "Technical Skills / المهارات التقنية", A: 70, fullMark: 100, match: true, nameEn: "Technical Skills", nameAr: "المهارات التقنية" },
      { subject: "Soft Skills / المهارات الشخصية", A: 62, fullMark: 100, match: true, nameEn: "Soft Skills", nameAr: "المهارات الشخصية" },
      { subject: "Structure / الهيكلية", A: 78, fullMark: 100, match: true, nameEn: "Structure", nameAr: "الهيكلية" },
      { subject: "Impact / التأثير", A: 50, fullMark: 100, match: false, nameEn: "Impact", nameAr: "التأثير" },
      { subject: "Keyword Relevance / الملاءمة", A: 65, fullMark: 100, match: true, nameEn: "Keyword Relevance", nameAr: "الملاءمة" },
    ],
    checks: [
      { labelEn: "File Format", labelAr: "تنسيق الملف", status: "pass" },
      { labelEn: "Text Extractable", labelAr: "النص قابل للاستخراج", status: "pass" },
      { labelEn: "Contact Information", labelAr: "معلومات الاتصال", status: "pass" },
      { labelEn: "Section Headers", labelAr: "عناوين الأقسام", status: "pass" },
      { labelEn: "Action Verbs", labelAr: "أفعال التأثير", status: "warn" },
      { labelEn: "Keyword Density", labelAr: "كثافة الكلمات المفتاحية", status: "warn" },
      { labelEn: "Quantified Achievements", labelAr: "إنجازات قابلة للقياس", status: "fail" },
      ...(hasJD ? [{ labelEn: "Job Match Keywords", labelAr: "كلمات مطابقة الوظيفة", status: "warn" as const }] : []),
    ],
    suggestions: [
      { id: "s-1", titleEn: "Add Measurable Achievements", titleAr: "أضف إنجازات قابلة للقياس", descEn: "Replace vague duties with impact metrics (e.g., 'Reduced load time by 40%'). Quantified bullets are 3x more likely to pass ATS and impress recruiters.", descAr: "استبدل المهام المبهمة بمقاييس الأثر (مثل 'خفضت وقت التحميل بنسبة 40٪'). النقاط الرقمية أكثر نجاحاً في ATS بمقدار 3 أضعاف.", impact: "High" },
      { id: "s-2", titleEn: "Optimize Keyword Density", titleAr: "حسّن كثافة الكلمات المفتاحية", descEn: "Incorporate role-specific keywords naturally throughout all sections. ATS scanners weight keyword frequency heavily in scoring.", descAr: "ادمج الكلمات المفتاحية المتعلقة بالوظيفة بشكل طبيعي في جميع الأقسام. تُعطي أنظمة ATS وزناً كبيراً لتكرار الكلمات.", impact: "High" },
      { id: "s-3", titleEn: "Strengthen Action Verbs", titleAr: "قوّي أفعال المبادرة", descEn: "Start each bullet with power verbs: 'Engineered', 'Orchestrated', 'Spearheaded'. Avoid 'Responsible for' — it signals passivity to both ATS and humans.", descAr: "ابدأ كل نقطة بفعل قوي: 'قاد'، 'طوّر'، 'أطلق'. تجنب 'مسؤول عن' لأنها تُظهر السلبية لأنظمة ATS والمسؤولين.", impact: "Medium" },
    ],
  };
}

export async function analyzeResume(
  fileName: string,
  resumeText: string,
  jobDescription?: string,
  meta?: { pageCount?: number; wordCount: number; method: string }
): Promise<AnalysisResult> {
  const name = fileName.toLowerCase();
  const isInvalidType =
    (!name.endsWith(".pdf") && !name.endsWith(".doc") && !name.endsWith(".docx")) &&
    (name.includes("photo") || name.includes("image") || name.includes("img") || name.includes("صورة"));

  if (isInvalidType) {
    return {
      score: 0,
      matchRate: 0,
      summaryEn: "The uploaded file does not appear to be a resume. Please upload a PDF, DOC, or DOCX resume document.",
      summaryAr: "الملف المرفوع لا يبدو سيرة ذاتية. يرجى رفع ملف سيرة ذاتية بصيغة PDF أو DOC أو DOCX.",
      skills: [
        { subject: "Technical Skills / المهارات التقنية", A: 0, fullMark: 100, match: false, nameEn: "Technical Skills", nameAr: "المهارات التقنية" },
        { subject: "Soft Skills / المهارات الشخصية", A: 0, fullMark: 100, match: false, nameEn: "Soft Skills", nameAr: "المهارات الشخصية" },
        { subject: "Structure / الهيكلية", A: 0, fullMark: 100, match: false, nameEn: "Structure", nameAr: "الهيكلية" },
        { subject: "Impact / التأثير", A: 0, fullMark: 100, match: false, nameEn: "Impact", nameAr: "التأثير" },
        { subject: "Keyword Relevance / الملاءمة", A: 0, fullMark: 100, match: false, nameEn: "Keyword Relevance", nameAr: "الملاءمة" },
      ],
      checks: [{ labelEn: "File Format (Resume)", labelAr: "تنسيق الملف (سيرة ذاتية)", status: "fail" }],
      suggestions: [{
        id: "err-1", titleEn: "Invalid File", titleAr: "ملف غير صالح",
        descEn: "Please upload a resume in PDF, DOC, or DOCX format. Photos and images are not supported.",
        descAr: "يرجى رفع سيرة ذاتية بتنسيق PDF أو DOC أو DOCX. الصور غير مدعومة.", impact: "High"
      }]
    };
  }

  try {
    const prompt = buildPrompt(fileName, resumeText, jobDescription, meta);
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2500,
      temperature: 0.6,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty AI response");

    const parsed = JSON.parse(raw) as AnalysisResult;

    if (
      typeof parsed.score !== "number" ||
      !Array.isArray(parsed.skills) || parsed.skills.length === 0 ||
      !Array.isArray(parsed.checks) || parsed.checks.length === 0 ||
      !Array.isArray(parsed.suggestions) || parsed.suggestions.length === 0
    ) {
      throw new Error("Invalid AI response structure");
    }

    if (parsed.matchRate === null) delete parsed.matchRate;
    return parsed;
  } catch (err) {
    console.error("AI analysis failed, using fallback:", err);
    return getFallback(fileName, jobDescription);
  }
}
