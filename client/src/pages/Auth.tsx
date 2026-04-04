import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Loader2, UserCheck, AlertCircle } from "lucide-react";

export default function Auth() {
  const [isRtl, setIsRtl] = useState(false);
  const [, setLocation] = useLocation();
  const { login, register, isLoginPending, isRegisterPending, user } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ username: "", password: "", confirm: "" });
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  useEffect(() => {
    const checkLang = () => setIsRtl(document.documentElement.dir === 'rtl');
    checkLang();
    const observer = new MutationObserver(checkLang);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (user) setLocation("/dashboard");
  }, [user, setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginForm.username || !loginForm.password) {
      return setLoginError(isRtl ? "يرجى ملء جميع الحقول" : "Please fill all fields");
    }
    try {
      await login({ username: loginForm.username, password: loginForm.password });
      setLocation("/dashboard");
    } catch (err: any) {
      setLoginError(isRtl ? "اسم المستخدم أو كلمة المرور غير صحيحة" : "Invalid username or password");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    if (!registerForm.username || !registerForm.password) {
      return setRegisterError(isRtl ? "يرجى ملء جميع الحقول" : "Please fill all fields");
    }
    if (registerForm.password.length < 6) {
      return setRegisterError(isRtl ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters");
    }
    if (registerForm.password !== registerForm.confirm) {
      return setRegisterError(isRtl ? "كلمتا المرور غير متطابقتين" : "Passwords do not match");
    }
    try {
      await register({ username: registerForm.username, password: registerForm.password });
      setLocation("/dashboard");
    } catch (err: any) {
      setRegisterError(isRtl ? "اسم المستخدم مأخوذ مسبقاً" : "Username is already taken");
    }
  };

  const handleGuest = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-muted/20 font-sans flex flex-col" dir={isRtl ? "rtl" : "ltr"}>
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-20 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center text-background font-bold text-3xl mx-auto mb-6 shadow-lg">
              <span className="font-handwritten">خ</span>
            </div>
            <h1 className="text-3xl font-heading font-black mb-2">
              {isRtl ? "مرحباً بك في خبير" : "Welcome to Khabir"}
            </h1>
            <p className="text-muted-foreground font-medium">
              {isRtl ? "سجل دخولك للوصول إلى تقاريرك المحفوظة" : "Sign in to access your saved reports"}
            </p>
          </div>

          <Card className="border shadow-2xl rounded-[2rem] overflow-hidden bg-card">
            <Tabs defaultValue="login" className="w-full">
              <div className="px-6 pt-6 pb-2">
                <TabsList className="grid w-full grid-cols-2 bg-secondary/50 p-1.5 rounded-xl h-12">
                  <TabsTrigger value="login" className="rounded-lg font-bold data-[state=active]:shadow-sm data-[state=active]:bg-background">
                    {isRtl ? "تسجيل الدخول" : "Login"}
                  </TabsTrigger>
                  <TabsTrigger value="register" className="rounded-lg font-bold data-[state=active]:shadow-sm data-[state=active]:bg-background">
                    {isRtl ? "إنشاء حساب" : "Register"}
                  </TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="p-6 md:p-8 pt-4">

                {/* ── Login Tab ── */}
                <TabsContent value="login" className="mt-0">
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="login-username" className="font-semibold">
                        {isRtl ? "اسم المستخدم" : "Username"}
                      </Label>
                      <Input
                        id="login-username"
                        value={loginForm.username}
                        onChange={e => setLoginForm(p => ({ ...p, username: e.target.value }))}
                        placeholder={isRtl ? "أحمد123" : "john_doe"}
                        className="h-12 rounded-xl bg-background border-border font-medium"
                        data-testid="input-login-username"
                        autoComplete="username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="font-semibold">
                        {isRtl ? "كلمة المرور" : "Password"}
                      </Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPass ? "text" : "password"}
                          value={loginForm.password}
                          onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                          className="h-12 rounded-xl bg-background border-border pr-12 font-medium"
                          data-testid="input-login-password"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                        >
                          {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {loginError && (
                      <div className="flex items-center gap-2 text-destructive text-sm font-medium bg-destructive/10 px-4 py-3 rounded-xl">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {loginError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20"
                      disabled={isLoginPending}
                      data-testid="button-login-submit"
                    >
                      {isLoginPending ? <Loader2 className="h-5 w-5 animate-spin" /> : (isRtl ? "تسجيل الدخول" : "Sign In")}
                    </Button>
                  </form>
                </TabsContent>

                {/* ── Register Tab ── */}
                <TabsContent value="register" className="mt-0">
                  <form onSubmit={handleRegister} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="reg-username" className="font-semibold">
                        {isRtl ? "اسم المستخدم" : "Username"}
                      </Label>
                      <Input
                        id="reg-username"
                        value={registerForm.username}
                        onChange={e => setRegisterForm(p => ({ ...p, username: e.target.value }))}
                        placeholder={isRtl ? "أحمد123" : "john_doe"}
                        className="h-12 rounded-xl bg-background border-border font-medium"
                        data-testid="input-register-username"
                        autoComplete="username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password" className="font-semibold">
                        {isRtl ? "كلمة المرور" : "Password"}
                      </Label>
                      <div className="relative">
                        <Input
                          id="reg-password"
                          type={showRegPass ? "text" : "password"}
                          value={registerForm.password}
                          onChange={e => setRegisterForm(p => ({ ...p, password: e.target.value }))}
                          placeholder={isRtl ? "6 أحرف على الأقل" : "At least 6 characters"}
                          className="h-12 rounded-xl bg-background border-border pr-12 font-medium"
                          data-testid="input-register-password"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPass(!showRegPass)}
                          className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                        >
                          {showRegPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-confirm" className="font-semibold">
                        {isRtl ? "تأكيد كلمة المرور" : "Confirm Password"}
                      </Label>
                      <Input
                        id="reg-confirm"
                        type="password"
                        value={registerForm.confirm}
                        onChange={e => setRegisterForm(p => ({ ...p, confirm: e.target.value }))}
                        className="h-12 rounded-xl bg-background border-border font-medium"
                        data-testid="input-register-confirm"
                        autoComplete="new-password"
                      />
                    </div>

                    {registerError && (
                      <div className="flex items-center gap-2 text-destructive text-sm font-medium bg-destructive/10 px-4 py-3 rounded-xl">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {registerError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20"
                      disabled={isRegisterPending}
                      data-testid="button-register-submit"
                    >
                      {isRegisterPending ? <Loader2 className="h-5 w-5 animate-spin" /> : (isRtl ? "إنشاء حساب جديد" : "Create Account")}
                    </Button>
                  </form>
                </TabsContent>

                {/* ── Guest Divider ── */}
                <div className="mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px bg-border flex-1" />
                    <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider shrink-0">
                      {isRtl ? "أو" : "or"}
                    </span>
                    <div className="h-px bg-border flex-1" />
                  </div>

                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-xl border-border font-bold hover:bg-secondary/50 transition-all gap-2"
                    onClick={handleGuest}
                    data-testid="button-guest-browse"
                  >
                    <UserCheck className="h-4 w-4" />
                    {isRtl ? "تصفح كمضيف (ميزات محدودة)" : "Browse as Guest (Limited)"}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground mt-3 px-4 leading-relaxed font-medium">
                    {isRtl
                      ? "كمضيف يمكنك تحليل سيرة ذاتية واحدة فقط بدون حفظ السجلات"
                      : "As a guest you can analyze one resume without saving records"
                    }
                  </p>
                </div>

              </CardContent>
            </Tabs>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
