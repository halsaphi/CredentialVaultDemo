import { 
  users, type User, type InsertUser, 
  credentials, type Credential, type InsertCredential 
} from "@shared/schema";
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCredential(id: number): Promise<Credential | undefined>;
  getCredentialByCredentialId(credentialId: string): Promise<Credential | undefined>;
  getAllCredentials(): Promise<Credential[]>;
  createCredential(credential: InsertCredential): Promise<Credential>;
  revokeCredential(credentialId: string, reason: string): Promise<Credential | undefined>;
  checkRevocationStatus(credentialId: string): Promise<{
    isRevoked: boolean;
    revocationDate?: string;
    revocationReason?: string;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private credentials: Map<number, Credential>;
  userCurrentId: number;
  credentialCurrentId: number;

  constructor() {
    this.users = new Map();
    this.credentials = new Map();
    this.userCurrentId = 1;
    this.credentialCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCredential(id: number): Promise<Credential | undefined> {
    return this.credentials.get(id);
  }

  async getCredentialByCredentialId(credentialId: string): Promise<Credential | undefined> {
    return Array.from(this.credentials.values()).find(
      (credential) => credential.credentialId === credentialId,
    );
  }

  async getAllCredentials(): Promise<Credential[]> {
    return Array.from(this.credentials.values());
  }

  async createCredential(insertCredential: InsertCredential): Promise<Credential> {
    const id = this.credentialCurrentId++;
    
    // Format dates as YYYY-MM-DD strings to ensure consistency - just pass the strings as-is
    // as they're already handled properly through the schema validation
    const formattedIssueDate = insertCredential.issueDate;
    const formattedDob = insertCredential.dob;
    
    // Create a new object with all properties explicitly defined
    const credential: Credential = {
      id,
      credentialId: insertCredential.credentialId,
      fullName: insertCredential.fullName,
      dob: formattedDob,
      nationality: insertCredential.nationality,
      idNumber: insertCredential.idNumber,
      kycStatus: insertCredential.kycStatus,
      netWorth: insertCredential.netWorth,
      languages: insertCredential.languages,
      additionalInfo: insertCredential.additionalInfo || null,
      issueDate: formattedIssueDate,
      revoked: false,
      revocationDate: null,
      revocationReason: null
    };
    
    this.credentials.set(id, credential);
    return credential;
  }

  async revokeCredential(credentialId: string, reason: string): Promise<Credential | undefined> {
    // Find the credential
    const credential = await this.getCredentialByCredentialId(credentialId);
    
    if (!credential) {
      return undefined;
    }
    
    // Create today's date as a string in YYYY-MM-DD format
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    // Update it with revocation information
    const updatedCredential: Credential = {
      ...credential,
      revoked: true,
      revocationDate: formattedDate,
      revocationReason: reason
    };
    
    // Save the updated credential
    this.credentials.set(credential.id, updatedCredential);
    
    return updatedCredential;
  }

  async checkRevocationStatus(credentialId: string): Promise<{
    isRevoked: boolean;
    revocationDate?: string;
    revocationReason?: string;
  }> {
    const credential = await this.getCredentialByCredentialId(credentialId);
    
    if (!credential) {
      // Return a placeholder result if credential doesn't exist
      return { isRevoked: false };
    }
    
    return {
      isRevoked: credential.revoked || false,
      revocationDate: credential.revocationDate || undefined,
      revocationReason: credential.revocationReason || undefined
    };
  }
}

export class FileStorage implements IStorage {
  private dataDir: string;
  private usersFile: string;
  private credentialsFile: string;
  private counterFile: string;
  
  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
    this.usersFile = path.join(this.dataDir, 'users.json');
    this.credentialsFile = path.join(this.dataDir, 'credentials.json');
    this.counterFile = path.join(this.dataDir, 'counters.json');
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    
    // Initialize files if they don't exist
    this.initializeFiles();
  }
  
  private async initializeFiles() {
    // Create users file if it doesn't exist
    if (!fs.existsSync(this.usersFile)) {
      await fsPromises.writeFile(this.usersFile, JSON.stringify([]));
    }
    
    // Create credentials file if it doesn't exist
    if (!fs.existsSync(this.credentialsFile)) {
      await fsPromises.writeFile(this.credentialsFile, JSON.stringify([]));
    }
    
    // Create counters file if it doesn't exist
    if (!fs.existsSync(this.counterFile)) {
      await fsPromises.writeFile(this.counterFile, JSON.stringify({
        userCurrentId: 1,
        credentialCurrentId: 1
      }));
    }
  }
  
  private async readUsers(): Promise<User[]> {
    const data = await fsPromises.readFile(this.usersFile, 'utf8');
    return JSON.parse(data);
  }
  
  private async writeUsers(users: User[]): Promise<void> {
    await fsPromises.writeFile(this.usersFile, JSON.stringify(users, null, 2));
  }
  
  private async readCredentials(): Promise<Credential[]> {
    const data = await fsPromises.readFile(this.credentialsFile, 'utf8');
    return JSON.parse(data);
  }
  
  private async writeCredentials(credentials: Credential[]): Promise<void> {
    await fsPromises.writeFile(this.credentialsFile, JSON.stringify(credentials, null, 2));
  }
  
  private async readCounters(): Promise<{ userCurrentId: number; credentialCurrentId: number }> {
    const data = await fsPromises.readFile(this.counterFile, 'utf8');
    return JSON.parse(data);
  }
  
  private async writeCounters(counters: { userCurrentId: number; credentialCurrentId: number }): Promise<void> {
    await fsPromises.writeFile(this.counterFile, JSON.stringify(counters, null, 2));
  }
  
  async getUser(id: number): Promise<User | undefined> {
    const users = await this.readUsers();
    return users.find(user => user.id === id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await this.readUsers();
    return users.find(user => user.username === username);
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const users = await this.readUsers();
    const counters = await this.readCounters();
    
    const id = counters.userCurrentId++;
    const user: User = { ...insertUser, id };
    
    users.push(user);
    
    await this.writeUsers(users);
    await this.writeCounters(counters);
    
    return user;
  }
  
  async getCredential(id: number): Promise<Credential | undefined> {
    const credentials = await this.readCredentials();
    return credentials.find(cred => cred.id === id);
  }
  
  async getCredentialByCredentialId(credentialId: string): Promise<Credential | undefined> {
    const credentials = await this.readCredentials();
    return credentials.find(cred => cred.credentialId === credentialId);
  }
  
  async getAllCredentials(): Promise<Credential[]> {
    return this.readCredentials();
  }
  
  async createCredential(insertCredential: InsertCredential): Promise<Credential> {
    const credentials = await this.readCredentials();
    const counters = await this.readCounters();
    
    const id = counters.credentialCurrentId++;
    
    // Format dates as YYYY-MM-DD strings to ensure consistency
    const formattedIssueDate = insertCredential.issueDate;
    const formattedDob = insertCredential.dob;
    
    // Create a new object with all properties explicitly defined
    const credential: Credential = {
      id,
      credentialId: insertCredential.credentialId,
      fullName: insertCredential.fullName,
      dob: formattedDob,
      nationality: insertCredential.nationality,
      idNumber: insertCredential.idNumber,
      kycStatus: insertCredential.kycStatus,
      netWorth: insertCredential.netWorth,
      languages: insertCredential.languages,
      additionalInfo: insertCredential.additionalInfo || null,
      issueDate: formattedIssueDate,
      revoked: false,
      revocationDate: null,
      revocationReason: null
    };
    
    credentials.push(credential);
    
    await this.writeCredentials(credentials);
    await this.writeCounters(counters);
    
    return credential;
  }
  
  async revokeCredential(credentialId: string, reason: string): Promise<Credential | undefined> {
    // Find the credential
    const credential = await this.getCredentialByCredentialId(credentialId);
    
    if (!credential) {
      return undefined;
    }
    
    const credentials = await this.readCredentials();
    
    // Create today's date as a string in YYYY-MM-DD format
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    // Find the credential in the array and update it
    const index = credentials.findIndex(cred => cred.credentialId === credentialId);
    
    if (index !== -1) {
      credentials[index] = {
        ...credential,
        revoked: true,
        revocationDate: formattedDate,
        revocationReason: reason
      };
      
      await this.writeCredentials(credentials);
      return credentials[index];
    }
    
    return undefined;
  }
  
  async checkRevocationStatus(credentialId: string): Promise<{
    isRevoked: boolean;
    revocationDate?: string;
    revocationReason?: string;
  }> {
    const credential = await this.getCredentialByCredentialId(credentialId);
    
    if (!credential) {
      // Return a placeholder result if credential doesn't exist
      return { isRevoked: false };
    }
    
    return {
      isRevoked: credential.revoked || false,
      revocationDate: credential.revocationDate || undefined,
      revocationReason: credential.revocationReason || undefined
    };
  }
}

// Choose which storage implementation to use
// Using file-based storage
export const storage = new FileStorage();
