import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useLocation } from 'wouter';
import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

export function UploadZone() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isRtl = document.documentElement.dir === "rtl";

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      toast({
        title: isRtl ? "نوع ملف غير صالح" : "Invalid file type",
        description: isRtl ? "يرجى رفع ملف PDF أو DOCX فقط." : "Please upload a PDF or DOCX file.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setLocation('/analysis');
        }, 800);
      }
    }, 100);

  }, [setLocation, toast, isRtl]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    disabled: isUploading
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
              <input {...getInputProps()} />
              
              <div className="flex flex-col items-center gap-4">
                <div className={`p-4 rounded-full ${isDragActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <Upload className="h-8 w-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-heading font-semibold">
                    {isDragActive 
                      ? (isRtl ? "ضع سيرتك الذاتية هنا" : "Drop your resume here") 
                      : (isRtl ? "ارفع سيرتك الذاتية" : "Upload your resume")
                    }
                  </h3>
                  <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                    {isRtl 
                      ? "اسحب وأسقط ملف PDF أو DOCX هنا، أو انقر للتصفح."
                      : "Drag and drop your PDF or DOCX file here, or click to browse."
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
            dir="ltr" // Keep upload status in LTR for technical consistency or handle RTL specifically
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold truncate">{acceptedFiles[0]?.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {isRtl ? "جاري تحليل الهيكل والكلمات..." : "Analyzing structure & keywords..."}
                </p>
              </div>
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-muted-foreground">
                <span>{isRtl ? "جاري المعالجة" : "Processing"}</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
               {[(isRtl ? 'تحليل النص' : 'Parsing Text'), (isRtl ? 'فحص ATS' : 'ATS Check'), (isRtl ? 'تحليل المهارات' : 'Skill Gap Analysis')].map((step, i) => (
                 <div key={step} className="flex flex-col items-center gap-2 text-center">
                   <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-500 ${
                     uploadProgress > (i * 30 + 30) ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'
                   }`}>
                     {uploadProgress > (i * 30 + 30) ? <CheckCircle className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-current" />}
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
