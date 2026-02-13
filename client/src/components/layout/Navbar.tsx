import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, Moon, Sun, Languages } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [lang, setLang] = useState("en");

  // Basic language toggle simulation
  const toggleLanguage = (newLang: string) => {
    setLang(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
    // In a real app, we'd use i18n, but for mockup we just toggle the attribute
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/">
          <a className="flex items-center gap-2 font-heading font-bold text-xl text-primary tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileText className="h-5 w-5" />
            </div>
            {lang === "ar" ? "خبير" : "Khabir"}
          </a>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/"><a className="hover:text-foreground transition-colors">{lang === "ar" ? "الرئيسية" : "Home"}</a></Link>
          <a href="#features" className="hover:text-foreground transition-colors">{lang === "ar" ? "المميزات" : "Features"}</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">{lang === "ar" ? "كيف يعمل" : "How it Works"}</a>
          <a href="#about" className="hover:text-foreground transition-colors">{lang === "ar" ? "عن المشروع" : "About"}</a>
        </nav>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Languages className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toggleLanguage("en")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleLanguage("ar")}>
                العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <div className="h-4 w-[1px] bg-border mx-2 hidden sm:block" />

          <Link href="/login">
            <a className="text-sm font-medium text-muted-foreground hover:text-foreground hidden sm:block px-2">
              {lang === "ar" ? "دخول" : "Log in"}
            </a>
          </Link>
          <Link href="/#upload">
            <Button size="sm">{lang === "ar" ? "ابدأ الآن" : "Get Started"}</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
