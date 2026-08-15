# Security Policy

## Supported Versions

Security updates are actively applied to the latest main branch:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The BharatPass project takes security and data privacy with utmost priority, especially with regard to identity isolation and cryptographic standards.

If you discover a security vulnerability or credential leak:
1. **Do not open a public GitHub issue.**
2. Send a detailed report describing the vulnerability, proof of concept, and affected components to the repository maintainers or via GitHub Private Vulnerability Reporting.
3. We will acknowledge receipt of your vulnerability report within 48 hours and coordinate a coordinated disclosure timeline.

## Security Guarantees & Architecture Highlights
- **UIDAI Data Vault Compliance**: Raw 12-digit Aadhaar numbers are never stored in plain-text relational tables; they are encrypted using AES-256-GCM and referenced only by immutable UUIDv4 tokens.
- **Race Condition Prevention**: Distributed locks via Redisson prevent double allocation of appointment quotas.
- **Stateless Authentication**: Role-based access control (RBAC) enforced via RS256 JWT tokens.
