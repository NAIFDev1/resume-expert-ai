import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { User, Mail, Lock } from "lucide-react";

export default function Auth() {
  const [location, setLocation] = useLocation();
  const isLogin = location === "/login";
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    const checkLang = () => {
      setIsRtl(document.documentElement.dir === "rtl");
    };
    
    // Initial check
    checkLang();

    // Listen for changes (for the language toggle in Navbar)
    const observer = new MutationObserver(checkLang);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-muted/20 font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-1 container flex items-center justify-center py-12">
        <motion.div
          key={isRtl ? 'ar' : 'en'} // Re-animate on language change
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[450px]"
        >
          <Card className="border-2 shadow-2xl bg-card/80 backdrop-blur-xl">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-3xl font-heading font-bold tracking-tight">
                {isLogin 
                  ? (isRtl ? "تسجيل الدخول" : "Welcome Back") 
                  : (isRtl ? "إنشاء حساب جديد" : "Create Account")
                }
              </CardTitle>
              <CardDescription className="text-balance">
                {isLogin 
                  ? (isRtl ? "ادخل بياناتك للوصول إلى حسابك" : "Enter your credentials to access your account")
                  : (isRtl ? "انضم إلى خبير وابدأ في تحسين سيرتك الذاتية" : "Join Khabir and start optimizing your career")
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">
                    {isRtl ? "الاسم الكامل" : "Full Name"}
                  </Label>
                  <div className="relative group">
                    <User className={`absolute top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary ${isRtl ? 'right-3' : 'left-3'}`} />
                    <Input 
                      id="name" 
                      placeholder={isRtl ? "نايف الغامدي" : "Naif Alghamdi"} 
                      className={`h-11 transition-all focus:ring-2 focus:ring-primary/20 ${isRtl ? "pr-10 text-right" : "pl-10 text-left"}`} 
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  {isRtl ? "البريد الإلكتروني" : "Email"}
                </Label>
                <div className="relative group">
                  <Mail className={`absolute top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary ${isRtl ? 'right-3' : 'left-3'}`} />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className={`h-11 transition-all focus:ring-2 focus:ring-primary/20 ${isRtl ? "pr-10 text-right" : "pl-10 text-left"}`} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Label htmlFor="password" className="text-sm font-semibold">
                    {isRtl ? "كلمة المرور" : "Password"}
                  </Label>
                  {isLogin && (
                    <a href="#" className="text-xs text-primary hover:underline font-medium">
                      {isRtl ? "نسيت كلمة المرور؟" : "Forgot password?"}
                    </a>
                  )}
                </div>
                <div className="relative group">
                  <Lock className={`absolute top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary ${isRtl ? 'right-3' : 'left-3'}`} />
                  <Input 
                    id="password" 
                    type="password" 
                    className={`h-11 transition-all focus:ring-2 focus:ring-primary/20 ${isRtl ? "pr-10 text-right" : "pl-10 text-left"}`} 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pb-8">
              <Button className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform" onClick={() => setLocation('/')}>
                {isLogin ? (isRtl ? "دخول" : "Login") : (isRtl ? "تسجيل" : "Sign Up")}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground font-medium">
                {isLogin ? (
                  <>
                    {isRtl ? "ليس لديك حساب؟ " : "Don't have an account? "}
                    <Link href="/register">
                      <a className="text-primary font-bold hover:underline">{isRtl ? "سجل الآن" : "Sign up"}</a>
                    </Link>
                  </>
                ) : (
                  <>
                    {isRtl ? "لديك حساب بالفعل؟ " : "Already have an account? "}
                    <Link href="/login">
                      <a className="text-primary font-bold hover:underline">{isRtl ? "تسجيل الدخول" : "Login"}</a>
                    </Link>
                  </>
                )}
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
