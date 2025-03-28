import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { VerificationResponse, SelectiveDisclosureRequest, Credential } from "@/lib/types";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CredentialCard } from "@/components/credentials/CredentialCard";
import { ProofDisplay } from "@/components/credentials/ProofDisplay";
import { VerificationModal } from "@/components/dialogs/VerificationModal";
import { Shield, Info, Copy, ArrowRight, DollarSign, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function SelectiveDisclosure() {
  const { toast } = useToast();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResponse | null>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "fullName", "nationality", "kycStatus", "languages"
  ]);
  const [selectedProofs, setSelectedProofs] = useState<string[]>([
    "adult", "kyc"
  ]);
  const [showProofDisplay, setShowProofDisplay] = useState(false);
  const [netWorthThreshold, setNetWorthThreshold] = useState<number>(500000);
  
  // Get last issued credential ID from localStorage
  const lastCredentialId = localStorage.getItem("lastIssuedCredentialId");
  
  // Fetch all credentials
  const { data: allCredentials } = useQuery<Credential[]>({
    queryKey: ['/api/credentials']
  });
  
  // Use the last issued credential or the first available credential
  const credentials = lastCredentialId 
    ? allCredentials?.find(cred => cred.credentialId === lastCredentialId) 
    : allCredentials?.[0];
    
  // Check revocation status
  const { data: revocationStatus } = useQuery<{
    isRevoked: boolean;
    revocationDate?: string;
    revocationReason?: string;
  }>({
    queryKey: ['/api/revocation-status', credentials?.credentialId],
    enabled: !!credentials?.credentialId,
  });
  
  // Create selective disclosure request
  const disclosureMutation = useMutation({
    mutationFn: async (request: SelectiveDisclosureRequest) => {
      const response = await apiRequest("POST", "/api/verify-disclosure", request);
      if (!response.ok) {
        const errorData = await response.json();
        // Check if this is a revocation error
        if (response.status === 403 && errorData.message && errorData.message.includes("revoked")) {
          throw new Error(`This credential has been revoked and cannot be used for verification. Reason: ${errorData.revocationStatus?.revocationReason || 'Unknown'}`);
        }
        throw new Error(errorData.message || "Failed to verify credential");
      }
      return response.json() as Promise<VerificationResponse>;
    },
    onSuccess: (data) => {
      setVerificationResult(data);
      setShowProofDisplay(true);
      
      toast({
        title: "Success",
        description: "Credential proof generated successfully",
      });
    },
    onError: (error: any) => {
      // Reset the proof display when there's an error
      setShowProofDisplay(false);
      
      toast({
        title: "Error",
        description: error.message || "Failed to create selective disclosure",
        variant: "destructive",
      });
    }
  });
  
  // Generate credential proof based on current selections
  const handleGenerateProof = () => {
    if (credentials?.credentialId) {
      // Create request object
      const request: SelectiveDisclosureRequest = {
        credentialId: credentials.credentialId,
        disclosedFields: selectedFields,
        proofs: selectedProofs
      };
      
      // Only add netWorthThreshold if wealth proof is selected
      if (selectedProofs.includes('wealth')) {
        request.netWorthThreshold = netWorthThreshold;
      }
      
      // Let the mutation handle success/error states
      disclosureMutation.mutate(request);
    }
  };
  
  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field)
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
    // Hide proof display when options are changed
    setShowProofDisplay(false);
  };
  
  const handleProofToggle = (proof: string) => {
    setSelectedProofs(prev => 
      prev.includes(proof)
        ? prev.filter(p => p !== proof)
        : [...prev, proof]
    );
    // Hide proof display when options are changed
    setShowProofDisplay(false);
  };
  
  const handleVerifyCredential = () => {
    setIsVerificationModalOpen(true);
  };
  
  const handleCopyToClipboard = () => {
    if (verificationResult) {
      navigator.clipboard.writeText(JSON.stringify(verificationResult, null, 2));
      toast({
        title: "Copied!",
        description: "Credential proof copied to clipboard",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-md mb-8">
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <Shield className="h-6 w-6 text-primary mr-3" />
            <h2 className="text-xl font-medium">Credential Selective Disclosure</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2 h-6 w-6">
                    <Info className="h-4 w-4 text-neutral-300" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Choose which credential fields to disclose and create proofs without revealing sensitive data.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {credentials ? (
            <>
              <CredentialCard 
                credential={credentials} 
                revocationStatus={revocationStatus}
              />
              
              {/* Show revocation warning if credential is revoked */}
              {revocationStatus?.isRevoked && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4 mb-4">
                  <div className="flex">
                    <XCircle className="h-5 w-5 text-red-400 mr-2" />
                    <div>
                      <h3 className="font-medium">Credential Revoked</h3>
                      <p className="text-sm text-red-600 mt-1">
                        This credential has been revoked and cannot be used to generate proofs.
                        {revocationStatus.revocationReason && (
                          <span className="block mt-1">
                            Reason: {revocationStatus.revocationReason}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Selective Disclosure Options */}
              <div className={`bg-neutral-100 rounded-lg p-5 my-6 ${revocationStatus?.isRevoked ? 'opacity-50 pointer-events-none' : ''}`}>
                <h3 className="text-lg font-medium mb-4">Selective Disclosure Options</h3>
                
                <div className="space-y-5">
                  <div>
                    <h4 className="font-medium mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-1"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="m17 20.66-1-1.73"/><path d="M11 10.27 7 3.34"/><path d="m20.66 17-1.73-1"/><path d="m3.34 7 1.73 1"/><path d="M14 12h8"/><path d="M2 12h2"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m17 3.34-1 1.73"/><path d="m11 13.73-4 6.93"/></svg>
                      Choose fields to disclose
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="field-fullName" 
                          checked={selectedFields.includes('fullName')}
                          onCheckedChange={() => handleFieldToggle('fullName')}
                        />
                        <Label htmlFor="field-fullName">Full Name</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="field-dob" 
                          checked={selectedFields.includes('dob')}
                          onCheckedChange={() => handleFieldToggle('dob')}
                        />
                        <Label htmlFor="field-dob">Date of Birth</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="field-nationality" 
                          checked={selectedFields.includes('nationality')}
                          onCheckedChange={() => handleFieldToggle('nationality')}
                        />
                        <Label htmlFor="field-nationality">Nationality</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="field-kycStatus" 
                          checked={selectedFields.includes('kycStatus')}
                          onCheckedChange={() => handleFieldToggle('kycStatus')}
                        />
                        <Label htmlFor="field-kycStatus">KYC Status</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="field-netWorth" 
                          checked={selectedFields.includes('netWorth')}
                          onCheckedChange={() => handleFieldToggle('netWorth')}
                        />
                        <Label htmlFor="field-netWorth">Net Worth</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="field-languages" 
                          checked={selectedFields.includes('languages')}
                          onCheckedChange={() => handleFieldToggle('languages')}
                        />
                        <Label htmlFor="field-languages">Languages</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="field-idNumber" 
                          checked={selectedFields.includes('idNumber')}
                          onCheckedChange={() => handleFieldToggle('idNumber')}
                        />
                        <Label htmlFor="field-idNumber">ID Number</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-1"><path d="m12 4-10 8.5c-.3.3-.5.7-.5 1.2V20a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-6.3c0-.5-.2-.9-.5-1.2L12 4Z"/><path d="M4 17h.01"/><path d="M9 17h.01"/><path d="M14 17h.01"/><path d="M19 17h.01"/></svg>
                      Zero-knowledge proofs
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="proof-adult" 
                          checked={selectedProofs.includes('adult')}
                          onCheckedChange={() => handleProofToggle('adult')}
                        />
                        <div className="flex items-center">
                          <Label htmlFor="proof-adult" className="mr-1">
                            Prove age is 18+ without revealing DOB
                          </Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-neutral-300" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p className="text-xs">
                                  Creates a cryptographic proof that the person is over 18 years old without disclosing their actual date of birth.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="proof-wealth" 
                            checked={selectedProofs.includes('wealth')}
                            onCheckedChange={() => handleProofToggle('wealth')}
                          />
                          <div className="flex items-center">
                            <Label htmlFor="proof-wealth" className="mr-1">
                              Prove net worth exceeds threshold without revealing amount
                            </Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-neutral-300" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="text-xs">
                                    Creates a cryptographic proof that net worth exceeds the specified threshold without revealing the actual amount.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        
                        {selectedProofs.includes('wealth') && (
                          <div className="flex items-center pl-8 space-x-2">
                            <DollarSign className="h-4 w-4 text-neutral-500" />
                            <div className="flex items-center w-full max-w-xs">
                              <Input 
                                type="number" 
                                value={netWorthThreshold}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (!isNaN(value) && value > 0) {
                                    setNetWorthThreshold(value);
                                    setShowProofDisplay(false);
                                  }
                                }}
                                min={0}
                                step={10000}
                                className="w-40"
                              />
                              <span className="ml-2 text-sm text-neutral-600">USD threshold</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="proof-kyc" 
                          checked={selectedProofs.includes('kyc')}
                          onCheckedChange={() => handleProofToggle('kyc')}
                        />
                        <div className="flex items-center">
                          <Label htmlFor="proof-kyc" className="mr-1">
                            Prove KYC is verified without revealing identity details
                          </Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-neutral-300" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p className="text-xs">
                                  Proves KYC verification status without exposing personal identification data.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Generate Proof Button */}
              <div className="flex justify-center mt-6">
                <Button 
                  onClick={handleGenerateProof}
                  size="lg"
                  disabled={disclosureMutation.isPending || revocationStatus?.isRevoked}
                  className="bg-primary hover:bg-primary-dark"
                >
                  {disclosureMutation.isPending ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Generate Credential Proof
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>
              </div>
              
              {/* Generated Proof Display */}
              {showProofDisplay && verificationResult && (
                <div className="border-2 border-dashed border-primary/30 rounded-lg p-5 mt-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <Shield className="h-5 w-5 text-primary mr-2" />
                      Generated Credential Proof
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary hover:text-primary-dark font-medium"
                      onClick={handleCopyToClipboard}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  
                  <ProofDisplay verificationResult={verificationResult} />
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-end mt-4">
                    <Button 
                      variant="outline" 
                      className="border-primary text-primary hover:bg-primary/5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                      Share Credential
                    </Button>
                    <Button 
                      onClick={handleVerifyCredential}
                      className="bg-secondary hover:bg-secondary-dark"
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Verify Proof
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-neutral-600 mb-4">No credential found. Please issue a credential first.</p>
              <Button asChild>
                <a href="/issue">Issue Credential</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Verification Modal */}
      <VerificationModal 
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        verificationResult={verificationResult}
      />
    </div>
  );
}
