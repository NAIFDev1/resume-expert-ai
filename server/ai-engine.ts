import OpenAI from "openai";

function getOpenAIClient(): OpenAI | null {
  const apiKey =
    process.env.AI_INTEGRATIONS_OPENAI_API_KEY?.trim() ||
    process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;
  const baseURL =
    process.env.AI_INTEGRATIONS_OPENAI_BASE_URL?.trim() ||
    process.env.OPENAI_BASE_URL?.trim();
  return baseURL ? new OpenAI({ apiKey, baseURL }) : new OpenAI({ apiKey });
}

export interface AnalysisResult {
  score: number;
  summaryEn: string;
  summaryAr: string;
  matchRate?: number;
  missingKeywords?: string[];
  skills: { subject: string; A: number; fullMark: number; match?: boolean; nameEn?: string; nameAr?: string }[];
  checks: { labelEn: string; labelAr: string; status: 'pass' | 'fail' | 'warn' }[];
  suggestions: { id: string; titleEn: string; titleAr: string; descEn: string; descAr: string; impact: 'High' | 'Medium' }[];
}

export interface ExperienceEntry {
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  bullets: string;
}

export interface ResumeLink {
  label: string;
  url: string;
}

export interface ResumeEditorData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  summary: string;
  experience: string;
  education: string;
  skills?: string[];
  links?: ResumeLink[];
  experiences?: ExperienceEntry[];
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
  "missingKeywords": ${hasJD ? '<array of 3-6 specific skill/keyword strings that appear in the JD but are absent from the resume, e.g. ["Docker","GraphQL","CI/CD"]>' : 'null'},
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
- ${hasJD ? "matchRate must reflect actual keyword overlap between resume text and JD" : "Omit matchRate and missingKeywords (set null)"}
- ${hasJD ? "missingKeywords must be REAL skills/tools from the JD that are absent from the resume" : ""}
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

function buildPhraseMap(targetLang: "en" | "ar"): Array<[string, string]> {
  if (targetLang === "en") {
    return [
      ["الاسم الكامل", "Full Name"],
      ["المسمى الوظيفي", "Job Title"],
      ["مطور واجهات أمامية", "Frontend Developer"],
      ["مطور واجهات", "Frontend Developer"],
      ["مطور برمجيات", "Software Developer"],
      ["مهندس برمجيات أول", "Senior Software Engineer"],
      ["مهندس برمجيات", "Software Engineer"],
      ["شركة تقنية", "Tech Company"],
      ["الحالي", "Present"],
      ["جامعة", "University"],
      ["بكالوريوس", "Bachelor"],
      ["علوم الحاسب", "Computer Science"],
      ["نبذة تعريفية", "Summary"],
      ["الخبرة", "Experience"],
      ["التعليم", "Education"],
      ["تطوير تطبيقات", "Developing applications"],
      ["تحسين أداء", "Performance optimization"],
      ["باستخدام", "using"],
      ["إلى", "to"],
      ["من", "from"],
      ["في", "at"],
      ["نسبة", "rate"],
      ["٪", "%"],
      ["أحمد", "Ahmed"],
      ["محمد", "Mohamed"],
      ["خالد", "Khaled"],
      ["عبدالله", "Abdullah"],
      ["سعود", "Saud"],
      ["الملك", "King"],
    ];
  }

  return [
    ["Full Name", "الاسم الكامل"],
    ["Job Title", "المسمى الوظيفي"],
    ["Frontend Developer", "مطور واجهات أمامية"],
    ["Senior Software Engineer", "مهندس برمجيات أول"],
    ["Software Engineer", "مهندس برمجيات"],
    ["Software Developer", "مطور برمجيات"],
    ["Tech Company", "شركة تقنية"],
    ["Present", "الحالي"],
    ["University", "جامعة"],
    ["Bachelor", "بكالوريوس"],
    ["Computer Science", "علوم الحاسب"],
    ["Summary", "نبذة تعريفية"],
    ["Experience", "الخبرة"],
    ["Education", "التعليم"],
    ["Developing applications", "تطوير تطبيقات"],
    ["Performance optimization", "تحسين أداء"],
    ["using", "باستخدام"],
    ["from", "من"],
    ["to", "إلى"],
    ["at", "في"],
    ["rate", "نسبة"],
    ["%", "٪"],
    ["Ahmed", "أحمد"],
    ["Mohamed", "محمد"],
    ["Khaled", "خالد"],
    ["Abdullah", "عبدالله"],
    ["Saud", "سعود"],
    ["King", "الملك"],
  ];
}

function translateByPhrases(text: string, targetLang: "en" | "ar"): string {
  const phraseMap = buildPhraseMap(targetLang).sort((a, b) => b[0].length - a[0].length);
  let translated = text;
  for (const [needle, replacement] of phraseMap) {
    translated = translated.split(needle).join(replacement);
  }
  return translated;
}

function getTranslationFallback(data: ResumeEditorData, targetLang: "en" | "ar"): ResumeEditorData {
  return {
    ...data,
    fullName: translateByPhrases(data.fullName, targetLang),
    jobTitle: translateByPhrases(data.jobTitle, targetLang),
    summary: translateByPhrases(data.summary, targetLang),
    experience: translateByPhrases(data.experience, targetLang),
    education: translateByPhrases(data.education, targetLang),
    experiences: data.experiences?.map((entry) => ({
      ...entry,
      role: translateByPhrases(entry.role, targetLang),
      company: translateByPhrases(entry.company, targetLang),
      bullets: translateByPhrases(entry.bullets, targetLang),
    })),
  };
}

export type TranslationSource = "ai" | "free" | "fallback";

function resumeTranslatableFieldsChanged(
  before: ResumeEditorData,
  after: ResumeEditorData
): boolean {
  const fields: (keyof ResumeEditorData)[] = [
    "fullName",
    "jobTitle",
    "summary",
    "experience",
    "education",
  ];
  return fields.some((field) => String(before[field] ?? "").trim() !== String(after[field] ?? "").trim());
}

function needsTranslation(text: string, targetLang: "en" | "ar"): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  const hasArabic = /[\u0600-\u06FF]/.test(trimmed);
  const hasLatin = /[a-zA-Z]/.test(trimmed);
  if (targetLang === "en") return hasArabic;
  return hasLatin;
}

async function fetchMyMemoryChunk(text: string, langpair: string): Promise<string> {
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", text);
  url.searchParams.set("langpair", langpair);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Translation API HTTP ${res.status}`);

  const payload = (await res.json()) as {
    responseData?: { translatedText?: string };
    responseStatus?: number;
  };

  let translated = payload.responseData?.translatedText?.trim();
  if (!translated) throw new Error("Empty translation response");

  // MyMemory sometimes returns placeholder tags for unmatched segments
  translated = translated.replace(/<x id="\d+"\/>/g, "").trim();

  return translated;
}

async function translateTextFree(text: string, targetLang: "en" | "ar"): Promise<string> {
  if (!text.trim() || !needsTranslation(text, targetLang)) return text;

  const from = targetLang === "en" ? "ar" : "en";
  const langpair = `${from}|${targetLang}`;
  const maxChunk = 450;
  const lines = text.split("\n");
  const translatedLines: string[] = [];

  for (const line of lines) {
    if (!line.trim()) {
      translatedLines.push(line);
      continue;
    }

    let remaining = line;
    let translatedLine = "";

    while (remaining.length > 0) {
      const chunk = remaining.slice(0, maxChunk);
      remaining = remaining.slice(maxChunk);
      translatedLine += await fetchMyMemoryChunk(chunk, langpair);
      if (remaining.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }

    translatedLines.push(translatedLine);
  }

  return translatedLines.join("\n");
}

async function translateResumeDataFree(
  data: ResumeEditorData,
  targetLang: "en" | "ar"
): Promise<ResumeEditorData> {
  const [fullName, jobTitle, summary, experience, education] = await Promise.all([
    translateTextFree(data.fullName, targetLang),
    translateTextFree(data.jobTitle, targetLang),
    translateTextFree(data.summary, targetLang),
    translateTextFree(data.experience, targetLang),
    translateTextFree(data.education, targetLang),
  ]);

  const experiences = (data.experiences ?? []).length > 0
    ? await Promise.all(
        (data.experiences ?? []).map(async (entry) => ({
          ...entry,
          role: await translateTextFree(entry.role, targetLang),
          company: await translateTextFree(entry.company, targetLang),
          bullets: await translateTextFree(entry.bullets, targetLang),
        }))
      )
    : data.experiences;

  return {
    ...data,
    fullName,
    jobTitle,
    summary,
    experience,
    education,
    experiences,
  };
}

async function translateWithFreeApi(
  data: ResumeEditorData,
  targetLang: "en" | "ar"
): Promise<ResumeEditorData | null> {
  try {
    const translated = await translateResumeDataFree(data, targetLang);
    if (!resumeTranslatableFieldsChanged(data, translated)) return null;
    return { ...translated, email: data.email, phone: data.phone };
  } catch (err) {
    console.warn("Free translation API failed:", err);
    return null;
  }
}

export async function translateResumeData(
  data: ResumeEditorData,
  targetLang: "en" | "ar"
): Promise<{ resumeData: ResumeEditorData; source: TranslationSource }> {
  const openai = getOpenAIClient();

  if (!openai) {
    console.warn("No OpenAI API key for translation; trying free translation API.");
    const free = await translateWithFreeApi(data, targetLang);
    if (free) return { resumeData: free, source: "free" };
    return { resumeData: getTranslationFallback(data, targetLang), source: "fallback" };
  }

  try {
    const translationPrompt = `
Translate the following resume fields to ${targetLang === "en" ? "English" : "Arabic"}.
Rules:
- Keep email, phone, skills, and links unchanged.
- Preserve meaning and professional tone.
- "experiences" is an array of objects; translate each role, company, and bullets (keep startDate and endDate unchanged).
- Return JSON only with same exact keys:
{
  "fullName": "...",
  "jobTitle": "...",
  "email": "...",
  "phone": "...",
  "summary": "...",
  "experience": "...",
  "education": "...",
  "skills": ["..."],
  "links": [{"label": "...", "url": "..."}],
  "experiences": [{"role": "...", "company": "...", "startDate": "...", "endDate": "...", "bullets": "..."}]
}

Input JSON:
${JSON.stringify(data)}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a professional bilingual resume translator. Return valid JSON only." },
        { role: "user", content: translationPrompt },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1200,
      temperature: 0.2,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty translation response");
    const parsed = JSON.parse(raw) as ResumeEditorData;

    if (
      typeof parsed.fullName !== "string" ||
      typeof parsed.jobTitle !== "string" ||
      typeof parsed.email !== "string" ||
      typeof parsed.phone !== "string" ||
      typeof parsed.summary !== "string" ||
      typeof parsed.experience !== "string" ||
      typeof parsed.education !== "string" ||
      (parsed.skills !== undefined && !Array.isArray(parsed.skills)) ||
      (parsed.links !== undefined && !Array.isArray(parsed.links)) ||
      (parsed.experiences !== undefined && !Array.isArray(parsed.experiences))
    ) {
      throw new Error("Invalid translation response structure");
    }

    return {
      resumeData: {
        ...parsed,
        email: data.email,
        phone: data.phone,
        skills: parsed.skills ?? data.skills,
        links: parsed.links ?? data.links,
      },
      source: "ai",
    };
  } catch (err) {
    console.error("AI translation failed:", err);
    const free = await translateWithFreeApi(data, targetLang);
    if (free) return { resumeData: free, source: "free" };
    return { resumeData: getTranslationFallback(data, targetLang), source: "fallback" };
  }
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

  const openai = getOpenAIClient();
  if (!openai) {
    console.warn("No OpenAI API key (OPENAI_API_KEY or AI_INTEGRATIONS_OPENAI_API_KEY); using fallback analysis.");
    return getFallback(fileName, jobDescription);
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
    if (parsed.missingKeywords === null) delete parsed.missingKeywords;
    return parsed;
  } catch (err) {
    console.error("AI analysis failed, using fallback:", err);
    return getFallback(fileName, jobDescription);
  }
}

// ─── [H-2] AI-powered resume content improvement ─────────────────────────────

function improveBullets(text: string): string {
  return text
    .replace(/مسؤول عن/g, "قاد")
    .replace(/عمل على/g, "أنجز")
    .replace(/ساعد في/g, "أسهم في تحقيق")
    .replace(/Responsible for/gi, "Spearheaded")
    .replace(/Worked on/gi, "Delivered")
    .replace(/Helped with/gi, "Contributed to");
}

function getImproveFallback(data: ResumeEditorData, targetLang: "en" | "ar"): ResumeEditorData {
  if (targetLang === "ar") {
    return {
      ...data,
      summary: "محترف متميز يتمتع بخبرة واسعة في المجال، مع سجل حافل بالإنجازات القابلة للقياس وقدرة على قيادة الفرق وحل التحديات المعقدة بكفاءة عالية.",
      experience: improveBullets(data.experience),
      experiences: data.experiences?.map((entry) => ({
        ...entry,
        bullets: improveBullets(entry.bullets),
      })),
    };
  }
  return {
    ...data,
    summary: "Dynamic professional with a proven track record of delivering measurable results. Expertise in cross-functional collaboration, problem-solving, and driving impactful outcomes across complex projects.",
    experience: improveBullets(data.experience),
    experiences: data.experiences?.map((entry) => ({
      ...entry,
      bullets: improveBullets(entry.bullets),
    })),
  };
}

export async function improveResumeContent(
  data: ResumeEditorData,
  targetLang: "en" | "ar"
): Promise<ResumeEditorData> {
  const openai = getOpenAIClient();

  if (!openai) {
    console.warn("No OpenAI API key for improve; using local fallback.");
    return getImproveFallback(data, targetLang);
  }

  const langName = targetLang === "ar" ? "Arabic" : "English";

  const prompt = `You are a professional resume writer and career coach. Improve the following resume content to be more impactful, ATS-optimized, and professionally compelling.

Rules:
- Write in ${langName}
- Replace weak/passive phrases with strong action verbs (e.g. "Responsible for" → "Spearheaded", "مسؤول عن" → "قاد")
- Add quantifiable metrics where natural and plausible
- Make the summary more compelling and specific
- Keep the same structure but greatly improve wording
- Do NOT change the fullName, email, or phone
- "experiences" is an array of objects; improve the role, company, startDate, endDate, and bullets wording but keep the same array shape
- Keep skills and links unchanged
- Return JSON only with the EXACT same keys

Input JSON:
${JSON.stringify(data, null, 2)}

Return the improved version with the same JSON structure.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a professional resume writer. Return valid JSON only, no markdown." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1500,
      temperature: 0.7,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty improve response");

    const parsed = JSON.parse(raw) as ResumeEditorData;

    if (
      typeof parsed.summary !== "string" ||
      typeof parsed.experience !== "string" ||
      (parsed.skills !== undefined && !Array.isArray(parsed.skills)) ||
      (parsed.links !== undefined && !Array.isArray(parsed.links)) ||
      (parsed.experiences !== undefined && !Array.isArray(parsed.experiences))
    ) {
      throw new Error("Invalid improve response structure");
    }

    // Always preserve contact info and identity fields from original
    return {
      ...parsed,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      skills: parsed.skills ?? data.skills,
      links: parsed.links ?? data.links,
      experiences: parsed.experiences ?? data.experiences,
    };
  } catch (err) {
    console.error("AI improve failed, using fallback:", err);
    return getImproveFallback(data, targetLang);
  }
}
