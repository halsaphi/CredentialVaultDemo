import { Credential } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { User, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

interface CredentialCardProps {
  credential: Credential;
  revocationStatus?: {
    isRevoked: boolean;
    revocationDate?: string;
    revocationReason?: string;
  };
}

export function CredentialCard({ credential, revocationStatus }: CredentialCardProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Get nationality full name
  const getNationalityName = (code: string): string => {
    const countries: Record<string, string> = {
      UK: "United Kingdom",
      US: "United States",
      CA: "Canada",
      AU: "Australia",
      DE: "Germany",
      FR: "France",
      HK: "Hong Kong"
    };
    return countries[code] || code;
  };
  
  return (
    <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-5 mb-6 relative overflow-hidden">
      <div className={`absolute top-0 right-0 ${revocationStatus?.isRevoked ? 'bg-red-100' : 'bg-primary/10'} px-3 py-1 rounded-bl-lg flex items-center`}>
        {revocationStatus?.isRevoked ? (
          <>
            <XCircle className="text-red-500 h-4 w-4 mr-1" />
            <span className="text-xs font-medium text-red-700">Revoked</span>
          </>
        ) : (
          <>
            <CheckCircle className="text-primary h-4 w-4 mr-1" />
            <span className="text-xs font-medium text-primary-dark">Verified</span>
          </>
        )}
      </div>
      <div className="flex items-start">
        <div className="mr-4 mt-1">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="text-primary h-6 w-6" />
          </div>
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-medium mb-1">{credential.fullName}</h3>
          <div className="text-sm text-neutral-400 mb-3">Credential ID: {credential.credentialId}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm">
            <div>
              <div className="text-neutral-400">Date of Birth</div>
              <div>{formatDate(credential.dob)}</div>
            </div>
            <div>
              <div className="text-neutral-400">Nationality</div>
              <div>{getNationalityName(credential.nationality)}</div>
            </div>
            <div>
              <div className="text-neutral-400">KYC Status</div>
              <div className="flex items-center">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  credential.kycStatus === 'verified' ? 'bg-success' : 
                  credential.kycStatus === 'pending' ? 'bg-warning' : 'bg-error'
                }`}></span>
                <span className="capitalize">{credential.kycStatus}</span>
              </div>
            </div>
            <div>
              <div className="text-neutral-400">Net Worth</div>
              <div>{formatCurrency(credential.netWorth)}</div>
            </div>
            <div>
              <div className="text-neutral-400">Languages</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {credential.languages.map((language) => (
                  <Badge 
                    key={language} 
                    variant="default" 
                    className="bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="text-neutral-400">ID Number</div>
              <div>{credential.idNumber}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-primary/20">
        <div className="flex items-center text-xs text-neutral-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300 mr-1"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Issued by: <strong className="ml-1">Demo Bank Authority</strong>
          <span className="mx-2">•</span>
          <span>Issued on: {formatDate(credential.issueDate)}</span>
        </div>
      </div>
    </div>
  );
}
