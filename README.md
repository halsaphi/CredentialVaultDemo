# Verifiable Credentials Demo Application

A TypeScript-based demo application that simulates verifiable credentials issuance and selective disclosure for banking and financial services. This application demonstrates how verifiable credentials can be used to enhance privacy and security in digital identity verification.

## Overview

The demo showcases:

- Credential issuance by a trusted authority
- Selective disclosure of credential fields
- Zero-knowledge proofs for privacy-preserving verification
- A comprehensive explanation of verifiable credentials technology

## Features

### Issue Credential

- Create verifiable credentials with personal and financial information
- KYC status verification
- Multi-language support
- Net worth certification

### Selective Disclosure

- Choose which credential fields to disclose
- Generate zero-knowledge proofs without revealing actual data:
  - Age verification (18+) without revealing birth date
  - Net worth verification with customizable thresholds
  - KYC status verification without exposing personal data

### Educational Content

- Explanation of verifiable credentials concepts
- Core components (issuers, holders, verifiers)
- Real-world applications across industries

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Uses local file storage for easy demo'ing rather than postgres - data is stored as json in /data directory

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/halsaphi/CredentialVaultDemo
   cd verifiable-credentials-demo
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running the Application

Start the development server:
```
npm run dev
```

The application will be available at http://localhost:5111

## Usage Guide

### Issuing a Credential

1. Navigate to the "Issue Credential" tab
2. Fill in the required fields (full name, date of birth, etc.)
3. Click "Issue Credential"

### Using Selective Disclosure

1. Navigate to the "Selective Disclosure" tab
2. Select which credential fields you want to disclose
3. Choose which zero-knowledge proofs to generate
4. For wealth verification, you can set a custom threshold
5. Click "Generate Credential Proof"
6. View the result and optionally copy to clipboard

### Learning About Verifiable Credentials

1. Navigate to the "Explanation" tab
2. Read through the educational content to understand the technology

## Technical Details

This application is built using:

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express
- **Database**: Local files, data stored in JSON so it's easy to use
- **State Management**: TanStack Query
- **Routing**: wouter

## Development

### Project Structure

- `/client` - Frontend React application
- `/server` - Backend Express server
- `/shared` - Shared types and schemas
- `/drizzle` - Database migrations and schema

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production

## Demo Limitations

This is a simulation for demonstration purposes only:

- Cryptographic operations are simulated
- No actual blockchain or DID registry is used
- The demo uses simplified versions of W3C Verifiable Credentials

## License

[MIT License](LICENSE)