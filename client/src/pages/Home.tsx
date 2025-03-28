import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileText, Lock, XCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
          Verifiable Credentials Demo
        </h1>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
          Experience the power of verifiable credentials with this interactive
          simulation for issuing and selectively disclosing digital credentials.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
          <CardContent className="pt-6 flex flex-col justify-between h-[340px]">
            <div>
              <div className="flex items-start mb-4">
                <div className="p-3 rounded-full bg-primary/10 mr-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Issue Credentials</h2>
                  <p className="text-neutral-600">
                    Create verifiable credentials with personal information like KYC
                    status, date of birth, nationality, and more.
                  </p>
                </div>
              </div>
            </div>
            <Link href="/issue">
              <Button className="w-full mt-4">
                Issue New Credential
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
          <CardContent className="pt-6 flex flex-col justify-between h-[340px]">
            <div>
              <div className="flex items-start mb-4">
                <div className="p-3 rounded-full bg-primary/10 mr-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Selective Disclosure</h2>
                  <p className="text-neutral-600">
                    Choose which credential fields to reveal and create zero-knowledge
                    proofs without exposing sensitive information.
                  </p>
                </div>
              </div>
            </div>
            <Link href="/selective-disclosure">
              <Button className="w-full mt-4">
                Verify & Disclose
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
          <CardContent className="pt-6 flex flex-col justify-between h-[340px]">
            <div>
              <div className="flex items-start mb-4">
                <div className="p-3 rounded-full bg-primary/10 mr-4">
                  <XCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Revocation Check</h2>
                  <p className="text-neutral-600">
                    Check revocation status of credentials and revoke them if needed to
                    manage the full credential lifecycle.
                  </p>
                </div>
              </div>
            </div>
            <Link href="/revocation">
              <Button className="w-full mt-4">
                Check Revocation
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="flex items-center mb-4">
          <Lock className="h-5 w-5 text-primary mr-2" />
          <h2 className="text-lg font-semibold">About This Demo</h2>
        </div>
        <p className="text-neutral-600 mb-4">
          This application demonstrates how verifiable credentials can enable
          selective disclosure of personal information, allowing individuals to
          prove claims about themselves without revealing unnecessary data.
        </p>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-medium mb-2">Privacy Preservation</h3>
            <p className="text-neutral-500">
              Disclose only the specific information needed for verification, keeping
              other details private.
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-medium mb-2">Zero-Knowledge Proofs</h3>
            <p className="text-neutral-500">
              Cryptographically prove facts about your data without revealing the
              underlying information.
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-medium mb-2">Compliance & KYC</h3>
            <p className="text-neutral-500">
              Streamline verification processes while maintaining regulatory
              compliance and data minimization.
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-medium mb-2">Credential Lifecycle</h3>
            <p className="text-neutral-500">
              Manage the complete credential lifecycle including issuance,
              verification, and revocation for trust maintenance.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
