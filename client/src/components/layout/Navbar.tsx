import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Languages } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [lang, setLang] = useState("ar");
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
    
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 20);
    });
  }, [scrollY]);

  const toggleLanguage = (newLang: string) => {
    setLang(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  return (
    <motion.header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-background backdrop-blur-xl border-b border-foreground shadow-sm py-3" 
          : "bg-transparent border-foreground py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            <a className="font-heading text-3xl font-bold flex items-center gap-2">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <span className="text-background text-xl">خ</span>
              </div>
              <span className="text-foreground">خبير</span>
            </a>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/">
              <a className="text-sm font-bold text-foreground hover:text-foreground transition-colors font-sans">
                {lang === "ar" ? "الرئيسية" : "Home"}
              </a>
            </Link>
            <Link href="/templates">
              <a className="text-sm font-bold text-foreground hover:text-foreground transition-colors font-sans">
                {lang === "ar" ? "النماذج" : "Templates"}
              </a>
            </Link>
            <Link href="/faq">
              <a className="text-sm font-bold text-foreground hover:text-foreground transition-colors font-sans">
                {lang === "ar" ? "الأسئلة الشائعة" : "FAQ"}
              </a>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-background border border-foreground">
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

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-background hidden sm:flex border border-foreground"
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

          <Link href="/login">
            <a className="text-sm font-bold text-foreground hover:text-foreground transition-colors hidden sm:block px-3 font-sans">
              {lang === "ar" ? "تسجيل الدخول" : "Log in"}
            </a>
          </Link>
          
          <Link href="/#upload">
            <Button className="rounded-full px-6 font-bold font-sans">
              {lang === "ar" ? "ابدأ الآن" : "Get Started"}
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
