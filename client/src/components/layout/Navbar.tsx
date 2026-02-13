import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/">
          <a className="flex items-center gap-2 font-heading font-bold text-xl text-primary tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileText className="h-5 w-5" />
            </div>
            Khabir
          </a>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/"><a className="hover:text-foreground transition-colors">Home</a></Link>
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
          <a href="#about" className="hover:text-foreground transition-colors">About</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <a className="text-sm font-medium text-muted-foreground hover:text-foreground hidden sm:block">
              Log in
            </a>
          </Link>
          <Link href="/#upload">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
