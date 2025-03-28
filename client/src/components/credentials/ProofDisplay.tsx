import { VerificationResponse } from "@/lib/types";

interface ProofDisplayProps {
  verificationResult: VerificationResponse;
}

export function ProofDisplay({ verificationResult }: ProofDisplayProps) {
  return (
    <div className="bg-neutral-100 rounded p-4 mb-4 overflow-auto font-mono text-xs">
      <pre className="whitespace-pre">
        {JSON.stringify(verificationResult, null, 2)}
      </pre>
    </div>
  );
}
