import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useLocation } from 'wouter';
import { Upload, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

function isAllowedFile(file: File): boolean {
  const n = file.name.toLowerCase();
  if (!n.endsWith(".pdf") && !n.endsWith(".doc") && !n.endsWith(".docx")) return false;
  const allowed = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/octet-stream", // Windows sometimes sends this
    "application/zip",          // Some browsers report .docx as zip
    "",                          // Empty MIME is also possible
  ]);
  return allowed.has(file.type) || file.type === "";
}

export function UploadZone() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isRtl, setIsRtl] = useState(document.documentElement.dir === "rtl");

  useEffect(() => {
    const checkDir = () => setIsRtl(document.documentElement.dir === "rtl");
    const observer = new MutationObserver(checkDir);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["dir"] });
    return () => observer.disconnect();
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!isAllowedFile(file)) {
      toast({
        title: isRtl ? "ظ†ظˆط¹ ظ…ظ„ظپ ط؛ظٹط± طµط§ظ„ط­" : "Invalid file type",
        description: isRtl ? "ظٹط±ط¬ظ‰ ط±ظپط¹ ظ…ظ„ظپ PDF ط£ظˆ DOC ط£ظˆ DOCX." : "Please upload a PDF, DOC, or DOCX file.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: isRtl ? "ط§ظ„ظ…ظ„ظپ ظƒط¨ظٹط± ط¬ط¯ط§ظ‹" : "File too large",
        description: isRtl ? "ط§ظ„ط­ط¯ ط§ظ„ط£ظ‚طµظ‰ 10 ظ…ظٹط¬ط§ط¨ط§ظٹطھ." : "Maximum size is 10 MB.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 3;
      setUploadProgress(Math.min(progress, 90));
    }, 100);

    try {
      const jdInput = document.querySelector<HTMLTextAreaElement>('[data-testid="input-job-description"]');
      const jobDescription = jdInput?.value || "";

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("fileType", file.type || "application/pdf");
      if (jobDescription.trim()) formData.append("jobDescription", jobDescription.trim());

      const response = await fetch("/api/resumes/analyze", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const text = (await response.text()) || response.statusText;
        throw new Error(text || "Analysis failed");
      }

      const result = await response.json() as { id: string; saved?: boolean };

      clearInterval(interval);
      setUploadProgress(100);

      if (result.saved === false) {
        toast({
          title: isRtl ? "طھظ… ط§ظ„طھط­ظ„ظٹظ„" : "Analysis complete",
          description: isRtl
            ? "ط³ط¬ظ‘ظ„ ط§ظ„ط¯ط®ظˆظ„ ظ„ط­ظپط¸ ط§ظ„ط³ظٹط±ط© ظپظٹ ظ„ظˆط­ط© ط§ظ„طھط­ظƒظ…."
            : "Sign in to save this resume to your dashboard.",
        });
      }

      setTimeout(() => {
        setIsUploading(false);
        setLocation(`/analysis?id=${result.id}`);
      }, 600);
    } catch (error: any) {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(0);
      toast({
        title: isRtl ? "ط®ط·ط£ ظپظٹ ط§ظ„طھط­ظ„ظٹظ„" : "Analysis Error",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    }
  }, [setLocation, toast, isRtl]);

  // Handle files rejected by react-dropzone due to MIME mismatch (common on Windows)
  const onDropRejected = useCallback((rejectedFiles: { file: File }[]) => {
    const file = rejectedFiles[0]?.file;
    if (file && isAllowedFile(file)) {
      // Extension is valid but MIME was wrong â€” process it anyway
      onDrop([file]);
      return;
    }
    toast({
      title: isRtl ? "ظ†ظˆط¹ ظ…ظ„ظپ ط؛ظٹط± طµط§ظ„ط­" : "Invalid file type",
      description: isRtl ? "ظٹط±ط¬ظ‰ ط±ظپط¹ ظ…ظ„ظپ PDF ط£ظˆ DOC ط£ظˆ DOCX." : "Please upload a PDF, DOC, or DOCX file.",
      variant: "destructive",
    });
  }, [onDrop, isRtl, toast]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      // Allow generic types with correct extensions (Windows compatibility)
      "application/octet-stream": [".pdf", ".doc", ".docx"],
      "application/zip": [".docx"],
    },
    maxFiles: 1,
    disabled: isUploading,
    // Validate by extension as fallback
    validator: (file) => {
      const n = file.name.toLowerCase();
      if (n.endsWith(".pdf") || n.endsWith(".doc") || n.endsWith(".docx")) return null;
      return { code: "file-invalid-type", message: "Only PDF, DOC, DOCX are allowed" };
    },
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!isUploading ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div
              {...getRootProps()}
              className={`
                relative overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 cursor-pointer
                ${isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary/50 hover:bg-muted/30'}
              `}
            >
              <input {...getInputProps()} data-testid="input-resume-file" />

              <div className="flex flex-col items-center gap-4">
                <div className={`p-4 rounded-full ${isDragActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <Upload className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-heading font-semibold">
                    {isDragActive
                      ? (isRtl ? "ط¶ط¹ ط³ظٹط±طھظƒ ط§ظ„ط°ط§طھظٹط© ظ‡ظ†ط§" : "Drop your resume here")
                      : (isRtl ? "ط§ط±ظپط¹ ط³ظٹط±طھظƒ ط§ظ„ط°ط§طھظٹط©" : "Upload your resume")
                    }
                  </h3>
                  <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                    {isRtl
                      ? "ط§ط³ط­ط¨ ظˆط£ط³ظ‚ط· ظ…ظ„ظپ PDF ط£ظˆ DOC ط£ظˆ DOCX ظ‡ظ†ط§طŒ ط£ظˆ ط§ظ†ظ‚ط± ظ„ظ„طھطµظپط­."
                      : "Drag and drop your PDF, DOC, or DOCX file here, or click to browse."
                    }
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  <span className="bg-muted px-2 py-1 rounded">PDF</span>
                  <span className="bg-muted px-2 py-1 rounded">DOCX</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border bg-card p-8 shadow-lg text-left"
            dir="ltr"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold truncate">{acceptedFiles[0]?.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {isRtl ? "ط¬ط§ط±ظٹ طھط­ظ„ظٹظ„ ط§ظ„ظ‡ظٹظƒظ„ ظˆط§ظ„ظƒظ„ظ…ط§طھ..." : "Analyzing structure & keywords..."}
                </p>
              </div>
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-muted-foreground">
                <span>{isRtl ? "ط¬ط§ط±ظٹ ط§ظ„ظ…ط¹ط§ظ„ط¬ط©" : "Processing"}</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
               {[(isRtl ? 'طھط­ظ„ظٹظ„ ط§ظ„ظ†طµ' : 'Parsing Text'), (isRtl ? 'ظپط­طµ ATS' : 'ATS Check'), (isRtl ? 'طھط­ظ„ظٹظ„ ط§ظ„ظ…ظ‡ط§ط±ط§طھ' : 'Skill Gap Analysis')].map((step, i) => (
                 <div key={step} className="flex flex-col items-center gap-2 text-center">
                   <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-500 ${
                     uploadProgress > (i * 30 + 30) ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'
                   }`}>
                     {uploadProgress > (i * 30 + 30) ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-current" />}
                   </div>
                   <span className={`text-xs font-medium transition-colors ${
                     uploadProgress > (i * 30 + 30) ? 'text-foreground' : 'text-muted-foreground'
                   }`}>{step}</span>
                 </div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

