import { createRequire } from "module";
const require = (import.meta as { url?: string })?.url
  ? createRequire(import.meta.url)
  : createRequire(process.cwd() + "/");
const _pdfMod = require("pdf-parse");
const pdfParse = (typeof _pdfMod === "function" ? _pdfMod : _pdfMod.default) as (buffer: Buffer) => Promise<{ text: string; numpages: number }>;
import mammoth from "mammoth";

export interface ExtractionResult {
  text: string;
  pageCount?: number;
  wordCount: number;
  method: "pdf" | "docx" | "doc" | "filename-only";
}

export async function extractTextFromFile(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<ExtractionResult> {
  const name = fileName.toLowerCase();

  // ── PDF ──────────────────────────────────────────────────────
  if (name.endsWith(".pdf") || mimeType === "application/pdf") {
    try {
      const data = await pdfParse(buffer);
      const text = data.text.trim();
      if (text.length < 50) {
        return {
          text: `[Scanned PDF — text not extractable] File: ${fileName}`,
          pageCount: data.numpages,
          wordCount: 0,
          method: "filename-only",
        };
      }
      return {
        text,
        pageCount: data.numpages,
        wordCount: text.split(/\s+/).filter(Boolean).length,
        method: "pdf",
      };
    } catch (err) {
      console.error("PDF extraction error:", err);
      return { text: `File: ${fileName}`, wordCount: 0, method: "filename-only" };
    }
  }

  // ── DOCX ─────────────────────────────────────────────────────
  if (
    name.endsWith(".docx") ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value.trim();
      return {
        text,
        wordCount: text.split(/\s+/).filter(Boolean).length,
        method: "docx",
      };
    } catch (err) {
      console.error("DOCX extraction error:", err);
      return { text: `File: ${fileName}`, wordCount: 0, method: "filename-only" };
    }
  }

  // ── DOC (old binary format — limited support) ─────────────────
  if (name.endsWith(".doc") || mimeType === "application/msword") {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value.trim();
      if (text.length > 50) {
        return {
          text,
          wordCount: text.split(/\s+/).filter(Boolean).length,
          method: "doc" as const,
        };
      }
    } catch {}
    return {
      text: `[Legacy DOC format] File: ${fileName}`,
      wordCount: 0,
      method: "filename-only",
    };
  }

  return { text: `File: ${fileName}`, wordCount: 0, method: "filename-only" };
}
