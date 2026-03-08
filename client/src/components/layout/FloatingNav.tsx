import { Link, useLocation } from "wouter";
import { Home, FileText, BarChart2, Layout, Settings, User, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function FloatingNav() {
  const [location] = useLocation();
  const [isRtl, setIsRtl] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

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
    { href: "/editor", icon: FileText, labelAr: "المحرر", labelEn: "Editor" },
    { href: "/dashboard", icon: Layout, labelAr: "لوحتي", labelEn: "Dashboard" },
    { href: "/templates", icon: Settings, labelAr: "النماذج", labelEn: "Templates" },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-fit">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex items-center p-2 rounded-full border border-white/20 bg-background/60 backdrop-blur-2xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] dark:border-white/10"
      >
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <a 
                className="relative flex items-center justify-center px-4 py-3 rounded-full transition-colors outline-none"
                onMouseEnter={() => setHoveredTab(item.href)}
                onMouseLeave={() => setHoveredTab(null)}
              >
                {/* Hover Background */}
                <AnimatePresence>
                  {hoveredTab === item.href && !isActive && (
                    <motion.div
                      layoutId="hover-pill"
                      className="absolute inset-0 bg-secondary/80 rounded-full -z-10"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>

                {/* Active Background */}
                {isActive && (
                  <motion.div
                    layoutId="active-pill-main"
                    className="absolute inset-0 bg-primary rounded-full shadow-sm -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                
                <div className="flex items-center gap-2 relative z-10">
                  <Icon className={cn(
                    "h-[18px] w-[18px] transition-all duration-300", 
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  
                  <motion.span 
                    initial={false}
                    animate={{ 
                      width: isActive ? "auto" : 0, 
                      opacity: isActive ? 1 : 0,
                      marginLeft: isActive && !isRtl ? 4 : 0,
                      marginRight: isActive && isRtl ? 4 : 0
                    }}
                    className={cn(
                      "text-sm font-semibold whitespace-nowrap overflow-hidden",
                      isActive ? "text-primary-foreground block" : "hidden sm:hidden"
                    )}
                  >
                    {isRtl ? item.labelAr : item.labelEn}
                  </motion.span>
                </div>
              </a>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
}
