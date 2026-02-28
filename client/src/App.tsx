import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { FloatingNav } from "@/components/layout/FloatingNav";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Analysis from "@/pages/Analysis";
import Auth from "@/pages/Auth";
import Templates from "@/pages/Templates";
import FAQ from "@/pages/FAQ";
import Editor from "@/pages/Editor";
import Dashboard from "@/pages/Dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/analysis" component={Analysis} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/templates" component={Templates} />
      <Route path="/editor" component={Editor} />
      <Route path="/faq" component={FAQ} />
      <Route path="/login" component={Auth} />
      <Route path="/register" component={Auth} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
          <FloatingNav />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
