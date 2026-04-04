import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Languages, LogOut, User, LayoutDashboard } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [lang, setLang] = useState("ar");
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";

    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 20);
    });
  }, [scrollY]);

  const toggleLanguage = (newLang: string) => {
    setLang(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: lang === "ar" ? "تم تسجيل الخروج" : "Logged out",
      description: lang === "ar" ? "إلى اللقاء!" : "See you next time!",
    });
    setLocation("/login");
  };

  return (
    <motion.header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background backdrop-blur-xl border-b border-border shadow-sm py-3"
          : "bg-transparent border-foreground py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            <div className="font-heading text-3xl font-bold flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <span className="text-background text-xl">خ</span>
              </div>
              <span className="text-foreground">خبير</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/">
              <span className="text-sm font-bold text-foreground hover:text-primary transition-colors font-sans cursor-pointer">
                {lang === "ar" ? "الرئيسية" : "Home"}
              </span>
            </Link>
            <Link href="/templates">
              <span className="text-sm font-bold text-foreground hover:text-primary transition-colors font-sans cursor-pointer">
                {lang === "ar" ? "النماذج" : "Templates"}
              </span>
            </Link>
            <Link href="/faq">
              <span className="text-sm font-bold text-foreground hover:text-primary transition-colors font-sans cursor-pointer">
                {lang === "ar" ? "الأسئلة الشائعة" : "FAQ"}
              </span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted border border-border">
                <Languages className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl font-sans font-bold">
              <DropdownMenuItem onClick={() => toggleLanguage("en")} className="rounded-lg cursor-pointer">
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleLanguage("ar")} className="rounded-lg cursor-pointer">
                العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-muted hidden sm:flex border border-border"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <motion.div
              initial={false}
              animate={{ rotate: theme === "dark" ? 0 : 90, scale: theme === "dark" ? 1 : 0 }}
              className="absolute"
            >
              <Moon className="h-[1.2rem] w-[1.2rem] opacity-0 dark:opacity-100 transition-opacity" />
            </motion.div>
            <span className="sr-only">Toggle theme</span>
          </Button>

          <div className="h-5 w-[1px] bg-border mx-1 hidden sm:block" />

          {isAuthenticated && user ? (
            /* Logged-in user menu */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full px-4 font-bold font-sans gap-2 h-10 border-border bg-background hover:bg-muted" data-testid="button-user-menu">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-black shrink-0">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl font-sans min-w-[180px] p-2">
                <div className="px-3 py-2 text-sm font-bold text-foreground border-b border-border mb-1 pb-3">
                  <p className="text-xs text-muted-foreground font-medium mb-0.5">
                    {lang === "ar" ? "مسجل دخول كـ" : "Signed in as"}
                  </p>
                  <p className="truncate">{user.username}</p>
                </div>
                <DropdownMenuItem
                  className="rounded-xl cursor-pointer gap-2 font-semibold"
                  onClick={() => setLocation("/dashboard")}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="rounded-xl cursor-pointer gap-2 font-semibold text-destructive focus:text-destructive"
                  onClick={handleLogout}
                  data-testid="button-logout"
                >
                  <LogOut className="h-4 w-4" />
                  {lang === "ar" ? "تسجيل الخروج" : "Sign Out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Guest / logged-out */
            <>
              <Link href="/login">
                <span className="text-sm font-bold text-foreground hover:text-primary transition-colors hidden sm:block px-3 font-sans cursor-pointer" data-testid="link-login">
                  {lang === "ar" ? "تسجيل الدخول" : "Log in"}
                </span>
              </Link>
              <Link href="/#upload-section">
                <Button className="rounded-full px-6 font-bold font-sans" data-testid="button-get-started">
                  {lang === "ar" ? "ابدأ الآن" : "Get Started"}
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
