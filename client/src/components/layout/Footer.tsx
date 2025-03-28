import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-neutral-100 border-t border-neutral-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="text-sm text-neutral-400">
              Verifiable Credentials Demo | <span className="text-primary">Simulation Mode</span>
            </div>
          </div>
          <div className="flex items-center">
            <Link href="/">
              <a className="text-neutral-400 hover:text-primary mx-2 text-sm">
                Documentation
              </a>
            </Link>
            <Link href="/">
              <a className="text-neutral-400 hover:text-primary mx-2 text-sm">
                GitHub Repository
              </a>
            </Link>
            <Link href="/">
              <a className="text-neutral-400 hover:text-primary mx-2 text-sm">
                Privacy Policy
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
