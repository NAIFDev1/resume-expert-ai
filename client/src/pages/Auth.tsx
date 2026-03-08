import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [isRtl, setIsRtl] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkLang = () => setIsRtl(document.documentElement.dir === 'rtl');
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    return () => observer.disconnect();
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: isRtl ? "غير متوفر في النسخة التجريبية" : "Not available in Mockup",
      description: isRtl ? "هذه واجهة تجريبية فقط بدون قاعدة بيانات حقيقية." : "This is a mockup UI without a real database connection.",
    });
  };

  return (
    <div className="min-h-screen bg-muted/20 font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-4 py-20 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-lg shadow-primary/20">خ</div>
            <h1 className="text-3xl font-heading font-black mb-2">
              {isRtl ? "مرحباً بك في خبير" : "Welcome to Khabir"}
            </h1>
            <p className="text-muted-foreground">
              {isRtl ? "سجل دخولك للوصول إلى تقاريرك وقوالبك" : "Sign in to access your reports and templates"}
            </p>
          </div>

          <Card className="border shadow-2xl rounded-[2rem] overflow-hidden">
            <Tabs defaultValue="login" className="w-full">
              <div className="px-6 pt-6 pb-2">
                <TabsList className="grid w-full grid-cols-2 bg-secondary/50 p-1.5 rounded-xl h-12">
                  <TabsTrigger value="login" className="rounded-lg font-bold data-[state=active]:shadow-sm">
                    {isRtl ? "تسجيل الدخول" : "Login"}
                  </TabsTrigger>
                  <TabsTrigger value="register" className="rounded-lg font-bold data-[state=active]:shadow-sm">
                    {isRtl ? "إنشاء حساب" : "Register"}
                  </TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="p-6 md:p-8 pt-4">
                <TabsContent value="login" className="mt-0">
                  <form onSubmit={handleAuth} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">{isRtl ? "البريد الإلكتروني" : "Email"}</Label>
                        <Input id="email" type="email" placeholder="name@example.com" className="h-12 rounded-xl bg-background border-border" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">{isRtl ? "كلمة المرور" : "Password"}</Label>
                          <a href="#" className="text-xs font-semibold text-primary hover:underline">
                            {isRtl ? "نسيت كلمة المرور؟" : "Forgot password?"}
                          </a>
                        </div>
                        <Input id="password" type="password" className="h-12 rounded-xl bg-background border-border" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20">
                      {isRtl ? "تسجيل الدخول" : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="mt-0">
                  <form onSubmit={handleAuth} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{isRtl ? "الاسم الكامل" : "Full Name"}</Label>
                        <Input id="name" placeholder={isRtl ? "أحمد محمد" : "John Doe"} className="h-12 rounded-xl bg-background border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-email">{isRtl ? "البريد الإلكتروني" : "Email"}</Label>
                        <Input id="reg-email" type="email" placeholder="name@example.com" className="h-12 rounded-xl bg-background border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-password">{isRtl ? "كلمة المرور" : "Password"}</Label>
                        <Input id="reg-password" type="password" className="h-12 rounded-xl bg-background border-border" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20">
                      {isRtl ? "إنشاء حساب جديد" : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>

                <div className="mt-8 flex items-center justify-center gap-4">
                  <div className="h-px bg-border flex-1" />
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    {isRtl ? "أو المتابعة عبر" : "Or continue with"}
                  </span>
                  <div className="h-px bg-border flex-1" />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-12 rounded-xl bg-background border-border font-bold">
                    Google
                  </Button>
                  <Button variant="outline" className="h-12 rounded-xl bg-background border-border font-bold">
                    LinkedIn
                  </Button>
                </div>
              </CardContent>
            </Tabs>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
