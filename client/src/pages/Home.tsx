import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { FileCheck, Zap, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Navbar />
      
      <main>
        <Hero />
        
        <section id="features" className="py-24 bg-muted/30">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-heading font-bold mb-4">Why use Khabir?</h2>
              <p className="text-muted-foreground">Stop guessing what recruiters want. Our AI analyzes your resume like an expert hiring manager.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Instant Feedback</h3>
                <p className="text-muted-foreground leading-relaxed">Get a detailed score and actionable feedback in seconds, not days.</p>
              </div>

              <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center mb-6">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">ATS Optimization</h3>
                <p className="text-muted-foreground leading-relaxed">Ensure your resume passes the automated filters used by 99% of Fortune 500 companies.</p>
              </div>

              <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
                  <FileCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Smart Suggestions</h3>
                <p className="text-muted-foreground leading-relaxed">Our AI rewrites your bullet points to maximize impact and highlight your achievements.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t py-12">
        <div className="container px-4 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-muted-foreground">
            © 2026 Khabir. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
