import { Link, useLocation } from "wouter";
import { Home, FileText, BarChart2, Layout, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function FloatingNav() {
  const [location] = useLocation();
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    setIsRtl(document.documentElement.dir === "rtl");
    const observer = new MutationObserver(() => {
      setIsRtl(document.documentElement.dir === "rtl");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["dir"] });
    return () => observer.disconnect();
  }, []);

  const navItems = [
    { href: "/", icon: Home, labelAr: "الرئيسية", labelEn: "Home" },
    { href: "/analysis", icon: BarChart2, labelAr: "التحليل", labelEn: "Analysis" },
    { href: "/templates", icon: Layout, labelAr: "النماذج", labelEn: "Templates" },
    { href: "/auth", icon: User, labelAr: "حسابي", labelEn: "Profile" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-fit">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-1 p-2 rounded-2xl border border-white/20 bg-background/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]"
      >
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <a className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 group",
                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}>
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={cn("h-5 w-5 relative z-10", isActive ? "scale-110" : "group-hover:scale-110 transition-transform")} />
                <span className={cn(
                  "text-sm font-medium relative z-10 hidden sm:inline-block",
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300"
                )}>
                  {isRtl ? item.labelAr : item.labelEn}
                </span>
              </a>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
}
