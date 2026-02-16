import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { User, Mail, Lock, ArrowRight } from "lucide-react";

export default function Auth() {
  const [location, setLocation] = useLocation();
  const isLogin = location === "/login";
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    setIsRtl(document.documentElement.dir === "rtl");
  }, []);

  return (
    <div className="min-h-screen bg-muted/20 font-sans">
      <Navbar />
      
      <main className="container flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[450px]"
        >
          <Card className="border-2 shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-heading font-bold">
                {isLogin 
                  ? (isRtl ? "تسجيل الدخول" : "Welcome Back") 
                  : (isRtl ? "إنشاء حساب جديد" : "Create Account")
                }
              </CardTitle>
              <CardDescription>
                {isLogin 
                  ? (isRtl ? "ادخل بياناتك للوصول إلى حسابك" : "Enter your credentials to access your account")
                  : (isRtl ? "انضم إلى خبير وابدأ في تحسين سيرتك الذاتية" : "Join Khabir and start optimizing your career")
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">{isRtl ? "الاسم الكامل" : "Full Name"}</Label>
                  <div className="relative">
                    <User className={`absolute top-3 h-4 w-4 text-muted-foreground ${isRtl ? 'right-3' : 'left-3'}`} />
                    <Input id="name" placeholder={isRtl ? "نايف الغامدي" : "Naif Alghamdi"} className={isRtl ? "pr-10" : "pl-10"} />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">{isRtl ? "البريد الإلكتروني" : "Email"}</Label>
                <div className="relative">
                  <Mail className={`absolute top-3 h-4 w-4 text-muted-foreground ${isRtl ? 'right-3' : 'left-3'}`} />
                  <Input id="email" type="email" placeholder="name@example.com" className={isRtl ? "pr-10" : "pl-10"} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{isRtl ? "كلمة المرور" : "Password"}</Label>
                  {isLogin && (
                    <a href="#" className="text-xs text-primary hover:underline">
                      {isRtl ? "نسيت كلمة المرور؟" : "Forgot password?"}
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Lock className={`absolute top-3 h-4 w-4 text-muted-foreground ${isRtl ? 'right-3' : 'left-3'}`} />
                  <Input id="password" type="password" className={isRtl ? "pr-10" : "pl-10"} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full h-11 text-base font-semibold" onClick={() => setLocation('/')}>
                {isLogin ? (isRtl ? "دخول" : "Login") : (isRtl ? "تسجيل" : "Sign Up")}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                {isLogin ? (
                  <>
                    {isRtl ? "ليس لديك حساب؟ " : "Don't have an account? "}
                    <Link href="/register">
                      <a className="text-primary font-semibold hover:underline">{isRtl ? "سجل الآن" : "Sign up"}</a>
                    </Link>
                  </>
                ) : (
                  <>
                    {isRtl ? "لديك حساب بالفعل؟ " : "Already have an account? "}
                    <Link href="/login">
                      <a className="text-primary font-semibold hover:underline">{isRtl ? "تسجيل الدخول" : "Login"}</a>
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
