import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

export function Header() {
  const [location] = useLocation();

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          <h1 className="text-xl font-medium">Verifiable Credentials Demo</h1>
        </div>
        <div className="text-sm bg-white/10 px-3 py-1 rounded-full">
          Simulation Mode
        </div>
      </div>
      <div className="container mx-auto flex border-b border-white/20">
        <Link href="/issue">
          <div
            className={cn(
              "px-6 py-4 text-white/70 hover:text-white flex items-center relative cursor-pointer",
              location === "/issue" && "text-white active"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
            Issue Credential
          </div>
        </Link>
        <Link href="/selective-disclosure">
          <div
            className={cn(
              "px-6 py-4 text-white/70 hover:text-white flex items-center relative cursor-pointer",
              location === "/selective-disclosure" && "text-white active"
            )}
          >
            <Shield className="mr-2 h-5 w-5" />
            Selective Disclosure
          </div>
        </Link>
        <Link href="/revocation">
          <div
            className={cn(
              "px-6 py-4 text-white/70 hover:text-white flex items-center relative cursor-pointer",
              location === "/revocation" && "text-white active"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
            Revocation
          </div>
        </Link>
        <Link href="/explanation">
          <div
            className={cn(
              "px-6 py-4 text-white/70 hover:text-white flex items-center relative cursor-pointer",
              location === "/explanation" && "text-white active"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Explanation
          </div>
        </Link>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
          .active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background-color: #f50057;
          }
        `
      }} />
    </header>
  );
}
