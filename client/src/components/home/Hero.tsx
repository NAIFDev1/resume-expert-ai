import { Button } from "@/components/ui/button";
import { UploadZone } from "./UploadZone";
import HeroImage from "@/assets/hero-analysis.png";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
      <div className="container px-4 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-sm text-muted-foreground mb-6 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                Powered by AI V2.0
              </div>
              
              <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Is your resume <br />
                <span className="text-primary">ATS ready?</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Khabir ("The Expert") uses advanced AI to analyze your resume against millions of job descriptions. Get instant feedback on formatting, keywords, and impact.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Instant Scoring</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Keyword Analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Formatting Check</span>
                </div>
              </div>
            </motion.div>

            <div id="upload">
              <UploadZone />
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl opacity-50" />
            <img 
              src={HeroImage} 
              alt="AI Analysis Visualization" 
              className="relative rounded-2xl shadow-2xl border border-white/10 w-full object-cover transform hover:scale-[1.02] transition-transform duration-500"
            />
            
            {/* Floating Elements for depth */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-card p-4 rounded-xl shadow-xl border border-border/50 max-w-[200px]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">92</div>
                <div className="text-sm font-semibold">Excellent Match</div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[92%]" />
              </div>
            </motion.div>

             <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-8 -left-8 bg-card p-4 rounded-xl shadow-xl border border-border/50"
            >
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm font-medium">Scanning keywords...</span>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
