import { Card, CardContent } from "@/components/ui/card";
import { Shield, Key, Lock, Eye, FileText, Cpu, XCircle } from "lucide-react";

export default function Explanation() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-md mb-8">
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <FileText className="h-6 w-6 text-primary mr-3" />
            <h2 className="text-xl font-medium">Understanding Verifiable Credentials</h2>
          </div>
          
          <div className="space-y-8">
            {/* Introduction */}
            <section>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Shield className="text-primary mr-2 h-5 w-5" />
                What are Verifiable Credentials?
              </h3>
              <p className="text-neutral-700 mb-3">
                Verifiable Credentials (VCs) are the digital equivalent of physical credentials
                that we use in our daily lives, such as driver's licenses, passports, and diplomas.
                They provide a standard way to express credentials on the web that are cryptographically
                secure, privacy-respecting, and machine-verifiable.
              </p>
              <p className="text-neutral-700">
                Unlike traditional digital certificates, verifiable credentials can be verified without
                contacting the original issuer, allowing for greater privacy and control for the credential holder.
              </p>
            </section>
            
            {/* Core Concepts */}
            <section>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Key className="text-primary mr-2 h-5 w-5" />
                Core Concepts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neutral-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Issuers</h4>
                  <p className="text-sm text-neutral-700">
                    Organizations or entities that create and sign credentials.
                    In our demo, the banking institution acts as the issuer.
                  </p>
                </div>
                <div className="bg-neutral-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Holders</h4>
                  <p className="text-sm text-neutral-700">
                    Individuals or organizations that receive and store credentials.
                    The holder controls when and how to share credential information.
                  </p>
                </div>
                <div className="bg-neutral-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Verifiers</h4>
                  <p className="text-sm text-neutral-700">
                    Entities that request and verify credential proofs without needing
                    to contact the original issuer directly.
                  </p>
                </div>
                <div className="bg-neutral-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Verification Registry</h4>
                  <p className="text-sm text-neutral-700">
                    A tamper-evident system (often blockchain-based) that enables the checking of credential status
                    (whether it's valid, revoked, etc.).
                  </p>
                </div>
              </div>
            </section>
            
            {/* How This Demo Works */}
            <section>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Cpu className="text-primary mr-2 h-5 w-5" />
                How This Demo Works
              </h3>
              <div className="border-l-4 border-primary pl-4 mb-4">
                <p className="text-sm italic text-neutral-600">
                  This is a simulation of a verifiable credentials system for demonstration purposes.
                  In a production environment, these operations would use cryptographic signatures and
                  decentralized identifiers (DIDs).
                </p>
              </div>
              
              <ol className="space-y-4 list-decimal pl-5">
                <li>
                  <strong>Credential Issuance:</strong> On the "Issue Credential" page, a banking institution
                  issues a verifiable credential containing identity and financial information.
                </li>
                <li>
                  <strong>Credential Storage:</strong> The credential is stored and can be accessed by the holder
                  (in a real system, this would be in a secure digital wallet).
                </li>
                <li>
                  <strong>Selective Disclosure:</strong> On the "Selective Disclosure" page, the credential holder
                  chooses which information to share with a verifier, without revealing the entire credential.
                </li>
                <li>
                  <strong>Zero-Knowledge Proofs:</strong> The system can generate proofs about credential data
                  without revealing the actual data (e.g., proving someone is over 18 without revealing their birth date).
                </li>
                <li>
                  <strong>Verification:</strong> A verifier can check the proofs are valid without needing to contact
                  the original issuer.
                </li>
                <li>
                  <strong>Revocation:</strong> On the "Revocation" page, credentials can be checked for their 
                  current status and revoked if necessary, ensuring the credential lifecycle can be fully managed.
                </li>
              </ol>
            </section>
            
            {/* Credential Revocation */}
            <section>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <XCircle className="text-primary mr-2 h-5 w-5" />
                Credential Revocation Explained
              </h3>
              <p className="text-neutral-700 mb-3">
                Credential revocation is an essential part of the verifiable credentials ecosystem that allows
                issuers to invalidate credentials that should no longer be trusted.
              </p>
              
              <div className="bg-neutral-50 p-4 rounded-md mb-4">
                <h4 className="font-medium mb-2">Why Revocation Matters</h4>
                <p className="text-sm text-neutral-700">
                  Credentials may need to be revoked for various reasons:
                </p>
                <ul className="list-disc pl-5 mt-1 text-sm text-neutral-700">
                  <li>The credential contains errors or outdated information</li>
                  <li>The holder's status has changed (e.g., a license suspension)</li>
                  <li>The credential has been compromised or misused</li>
                  <li>Compliance requirements necessitate invalidation</li>
                </ul>
              </div>
              
              <div className="bg-neutral-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Revocation Process</h4>
                <p className="text-sm text-neutral-700">
                  In our demo, the revocation process works as follows:
                </p>
                <ol className="list-decimal pl-5 mt-1 text-sm text-neutral-700">
                  <li>The credential issuer identifies a credential that needs to be revoked</li>
                  <li>The issuer enters the credential ID and a reason for revocation</li>
                  <li>The credential status is updated in the verification registry</li>
                  <li>Any subsequent verification attempts will check this status</li>
                  <li>Verifiers can see that a credential has been revoked and the reason why</li>
                </ol>
                <p className="text-sm text-neutral-700 mt-2">
                  In production systems, revocation information is typically stored in tamper-evident
                  registries (often using distributed ledgers) to ensure integrity and availability.
                </p>
              </div>
            </section>
            
            {/* Selective Disclosure */}
            <section>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Eye className="text-primary mr-2 h-5 w-5" />
                Selective Disclosure Explained
              </h3>
              <p className="text-neutral-700 mb-3">
                Selective disclosure is a privacy-enhancing feature that allows credential holders
                to reveal only specific parts of a credential while keeping other information private.
              </p>
              
              <div className="bg-neutral-50 p-4 rounded-md mb-4">
                <h4 className="font-medium mb-2">Field Selection</h4>
                <p className="text-sm text-neutral-700">
                  The holder can choose which specific fields from their credential to share.
                  For example, they might share their nationality but not their date of birth.
                </p>
              </div>
              
              <div className="bg-neutral-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Zero-Knowledge Proofs</h4>
                <p className="text-sm text-neutral-700">
                  These are cryptographic methods that allow one party to prove to another that a statement is true,
                  without revealing any information beyond the validity of the statement itself.
                </p>
                <p className="text-sm text-neutral-700 mt-2">
                  In our demo, this allows proving:
                </p>
                <ul className="list-disc pl-5 mt-1 text-sm text-neutral-700">
                  <li>A person is over 18 without revealing their actual birth date</li>
                  <li>A person's net worth exceeds a specified threshold without revealing the exact amount</li>
                  <li>KYC verification status without revealing personal identification details</li>
                </ul>
              </div>
            </section>
            
            {/* Real-World Applications */}
            <section>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Lock className="text-primary mr-2 h-5 w-5" />
                Real-World Applications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neutral-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Financial Services</h4>
                  <ul className="list-disc pl-5 text-sm text-neutral-700">
                    <li>KYC/AML verification without duplicating sensitive data</li>
                    <li>Proof of funds or credit worthiness</li>
                    <li>Regulatory compliance reporting</li>
                  </ul>
                </div>
                
                <div className="bg-neutral-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Healthcare</h4>
                  <ul className="list-disc pl-5 text-sm text-neutral-700">
                    <li>Verifiable medical credentials</li>
                    <li>Insurance verification</li>
                    <li>Secure sharing of medical history</li>
                  </ul>
                </div>
                
                <div className="bg-neutral-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Education</h4>
                  <ul className="list-disc pl-5 text-sm text-neutral-700">
                    <li>Verifiable diplomas and certificates</li>
                    <li>Portable academic transcripts</li>
                    <li>Professional qualifications</li>
                  </ul>
                </div>
                
                <div className="bg-neutral-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Government</h4>
                  <ul className="list-disc pl-5 text-sm text-neutral-700">
                    <li>Digital identity documents</li>
                    <li>Benefits eligibility verification</li>
                    <li>Cross-border identity verification</li>
                  </ul>
                </div>
              </div>
            </section>
            
            {/* Standards and Further Reading */}
            <section>
              <h3 className="text-lg font-medium mb-3">Standards and Further Reading</h3>
              <p className="text-neutral-700 mb-3">
                Verifiable Credentials are built on open standards that ensure interoperability:
              </p>
              <ul className="list-disc pl-5 text-neutral-700 space-y-2">
                <li>
                  <strong>W3C Verifiable Credentials Data Model:</strong> The core specification defining
                  how credentials are structured and verified.
                </li>
                <li>
                  <strong>Decentralized Identifiers (DIDs):</strong> A new type of identifier that enables
                  verifiable, decentralized digital identity.
                </li>
                <li>
                  <strong>JSON-LD:</strong> A method of encoding linked data using JSON, which provides
                  a way to express verifiable credentials.
                </li>
              </ul>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}