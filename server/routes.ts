import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCredentialSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for credentials
  app.get("/api/credentials", async (req, res) => {
    try {
      const credentials = await storage.getAllCredentials();
      res.json(credentials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credentials" });
    }
  });

  app.get("/api/credentials/:credentialId", async (req, res) => {
    try {
      const credential = await storage.getCredentialByCredentialId(req.params.credentialId);
      if (!credential) {
        return res.status(404).json({ message: "Credential not found" });
      }
      res.json(credential);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credential" });
    }
  });

  app.post("/api/credentials", async (req, res) => {
    try {
      const result = insertCredentialSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const credential = await storage.createCredential(result.data);
      res.status(201).json(credential);
    } catch (error) {
      res.status(500).json({ message: "Failed to create credential" });
    }
  });

  // Selective disclosure endpoint
  app.post("/api/verify-disclosure", async (req, res) => {
    try {
      const { credentialId, disclosedFields, proofs, netWorthThreshold } = req.body;
      
      if (!credentialId) {
        return res.status(400).json({ message: "Credential ID is required" });
      }

      // Fetch the original credential
      const credential = await storage.getCredentialByCredentialId(credentialId);
      if (!credential) {
        return res.status(404).json({ message: "Credential not found" });
      }
      
      // Check if the credential is revoked
      const revocationStatus = await storage.checkRevocationStatus(credentialId);
      if (revocationStatus.isRevoked) {
        return res.status(403).json({ 
          message: "Cannot generate proof for a revoked credential",
          revocationStatus
        });
      }

      // Create a verification response with disclosed fields only
      const disclosedCredential: Record<string, any> = {
        credentialId: credential.credentialId,
        issueDate: credential.issueDate,
      };

      // Add only the selected fields
      if (Array.isArray(disclosedFields)) {
        disclosedFields.forEach(field => {
          if (field in credential) {
            disclosedCredential[field] = credential[field as keyof typeof credential];
          }
        });
      }

      // Generate zero-knowledge proofs
      const generatedProofs = [];
      
      if (proofs?.includes('adult') && credential.dob) {
        // Calculate if person is over 18 without revealing DOB
        const birthDate = new Date(credential.dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const isOver18 = age > 18 || (age === 18 && today.getMonth() >= birthDate.getMonth() && today.getDate() >= birthDate.getDate());
        
        generatedProofs.push({
          type: "AgeVerification",
          claim: "Subject is over 18 years old",
          status: isOver18 ? "verified" : "not verified",
          proof: Buffer.from(JSON.stringify({ verified: isOver18 })).toString('base64')
        });
      }
      
      if (proofs?.includes('wealth') && credential.netWorth) {
        // Check if net worth is over dynamic threshold without revealing amount
        const threshold = netWorthThreshold || 500000; // Default to 500,000 if not provided
        const isWealthy = credential.netWorth >= threshold;
        
        generatedProofs.push({
          type: "WealthVerification",
          claim: `Subject net worth exceeds $${threshold.toLocaleString()}`,
          status: isWealthy ? "verified" : "not verified",
          proof: Buffer.from(JSON.stringify({ verified: isWealthy })).toString('base64')
        });
      }
      
      if (proofs?.includes('kyc') && credential.kycStatus) {
        // Verify KYC status without revealing other identity details
        const isVerified = credential.kycStatus === "verified";
        
        generatedProofs.push({
          type: "KYCVerification",
          claim: "Subject has completed KYC verification",
          status: isVerified ? "verified" : "not verified",
          proof: Buffer.from(JSON.stringify({ verified: isVerified })).toString('base64')
        });
      }

      // Return the selective disclosure
      res.json({
        verifiableCredential: {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.w3.org/2018/credentials/examples/v1"
          ],
          id: credential.credentialId,
          type: ["VerifiableCredential", "IdentityCredential"],
          issuer: "https://demo-bank-authority.example",
          issuanceDate: typeof credential.issueDate === 'string' ? credential.issueDate : new Date(credential.issueDate).toISOString().split('T')[0],
          credentialSubject: {
            id: `did:example:${credential.fullName.toLowerCase().replace(/\s+/g, '.')}`,
            ...disclosedCredential
          },
          proof: {
            type: "Ed25519Signature2020",
            created: new Date().toISOString(),
            verificationMethod: "https://demo-bank-authority.example/keys/1",
            proofPurpose: "assertionMethod",
            jws: "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..YtqjEYnFENT7fNW-COD0HAACxeuQxPKAmp4nIl8jYyUx_GZC-X1IaRMm5-Xv__YKRI6i_2cfCIFtkp1swkaYBw"
          }
        },
        zeroKnowledgeProofs: generatedProofs
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate selective disclosure" });
    }
  });

  // Revocation endpoints
  app.post("/api/revoke", async (req, res) => {
    try {
      const { credentialId, reason } = req.body;
      
      if (!credentialId) {
        return res.status(400).json({ message: "Credential ID is required" });
      }
      
      if (!reason) {
        return res.status(400).json({ message: "Revocation reason is required" });
      }
      
      const credential = await storage.revokeCredential(credentialId, reason);
      
      if (!credential) {
        return res.status(404).json({ message: "Credential not found" });
      }
      
      res.json({ 
        message: "Credential successfully revoked", 
        credential 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to revoke credential" });
    }
  });
  
  app.get("/api/revocation-status/:credentialId", async (req, res) => {
    try {
      const { credentialId } = req.params;
      
      if (!credentialId) {
        return res.status(400).json({ message: "Credential ID is required" });
      }
      
      const status = await storage.checkRevocationStatus(credentialId);
      const credential = await storage.getCredentialByCredentialId(credentialId);
      
      res.json({
        ...status,
        credential: status.isRevoked ? credential : undefined
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to check revocation status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
