// Common types used across the application

export interface Credential {
  id?: number;
  credentialId: string;
  fullName: string;
  dob: string;
  nationality: string;
  idNumber: string;
  kycStatus: string;
  netWorth: number;
  languages: string[];
  additionalInfo?: string;
  issueDate: string;
  revoked?: boolean;
  revocationDate?: string;
  revocationReason?: string;
}

export interface VerifiableCredential {
  "@context": string[];
  id: string;
  type: string[];
  issuer: string;
  issuanceDate: string;
  credentialSubject: {
    id: string;
    [key: string]: any;
  };
  proof: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    jws: string;
  };
}

export interface ZeroKnowledgeProof {
  type: string;
  claim: string;
  status: string;
  proof: string;
}

export interface VerificationResponse {
  verifiableCredential: VerifiableCredential;
  zeroKnowledgeProofs: ZeroKnowledgeProof[];
}

export interface SelectiveDisclosureRequest {
  credentialId: string;
  disclosedFields: string[];
  proofs: string[];
  netWorthThreshold?: number;
}

export interface RevocationRequest {
  credentialId: string;
  reason: string;
}

export interface RevocationStatus {
  isRevoked: boolean;
  revocationDate?: string;
  revocationReason?: string;
  credential?: Credential;
}
