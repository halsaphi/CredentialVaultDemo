import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import Home from "@/pages/Home";
import IssueCredential from "@/pages/IssueCredential";
import SelectiveDisclosure from "@/pages/SelectiveDisclosure";
import Explanation from "@/pages/Explanation";
import RevocationCheck from "@/pages/RevocationCheck";
import NotFound from "@/pages/not-found";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "./components/ui/theme-provider";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/issue" component={IssueCredential} />
          <Route path="/selective-disclosure" component={SelectiveDisclosure} />
          <Route path="/explanation" component={Explanation} />
          <Route path="/revocation" component={RevocationCheck} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
