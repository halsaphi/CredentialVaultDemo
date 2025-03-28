import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VerificationResponse } from "@/lib/types";
import { CheckCircle, Shield } from "lucide-react";
import { format } from "date-fns";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  verificationResult: VerificationResponse | null;
}

export function VerificationModal({ isOpen, onClose, verificationResult }: VerificationModalProps) {
  if (!verificationResult) return null;

  // Count verified proofs
  const verifiedProofsCount = verificationResult.zeroKnowledgeProofs.filter(
    proof => proof.status === "verified"
  ).length;
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg font-medium">
            <Shield className="h-5 w-5 text-primary mr-2" />
            Verifying Credential Proof
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-4">
          <div className="mb-4">
            <Shield className="h-16 w-16 text-primary animate-pulse" />
          </div>
          <h4 className="text-xl font-medium mb-2 text-center">Verification Complete</h4>
          <p className="text-neutral-500 text-center mb-6">
            The credential proof has been successfully verified.
          </p>
          
          <div className="w-full bg-neutral-100 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-neutral-400">Issuer</div>
                <div className="font-medium">Demo Bank Authority</div>
              </div>
              <div>
                <div className="text-neutral-400">Issue Date</div>
                <div>
                  {formatDate(verificationResult.verifiableCredential.issuanceDate)}
                </div>
              </div>
              <div>
                <div className="text-neutral-400">Verification Status</div>
                <div className="flex items-center text-success">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Valid
                </div>
              </div>
              <div>
                <div className="text-neutral-400">ZK Proofs</div>
                <div className="flex items-center text-success">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Verified ({verifiedProofsCount})
                </div>
              </div>
            </div>
          </div>
          
          <Button className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
