# 🇮🇳 PassportSeva NextGen — Master Blueprint v1.0

> **Codename**: Bharat Pass  
> **Version**: 1.0-DRAFT  
> **Date**: 2026-08-15  
> **Status**: ⏳ AWAITING APPROVAL

---

# PART I — BUSINESS REQUIREMENTS DOCUMENT (BRD)

## 1. Executive Summary

**PassportSeva NextGen** is an enterprise-grade, high-concurrency digital platform that modernizes India's passport application, verification, and issuance workflow. It replaces the legacy `passportindia.gov.in/psp` experience with a zero-friction, mobile-first, Aadhaar-integrated pipeline that supports 50,000+ concurrent users during peak slot-release windows.

The platform serves three distinct user classes: **Citizens** (applicants), **Government Officers** (PSK staff, police verification officers, RPO administrators), and **System Operators** (MEA super-admins). It unifies the end-to-end lifecycle — from e-KYC identity binding through biometric appointment scheduling, AI-powered document pre-verification, real-time police verification tracking, to final passport dispatch with Speed Post integration.

### Key Differentiators
- **Passwordless Aadhaar-First Authentication** — No username/password. OTP + Offline e-KYC XML + Data Vault compliance.
- **Zero Double-Booking Guarantee** — Redis-backed distributed lock engine handling 50K+ concurrent slot requests.
- **AI Document Pre-Check** — OCR + image quality analysis rejects invalid uploads *before* the PSK appointment, eliminating wasted visits.
- **Real-Time Police Verification Streaming** — SSE-powered live milestone tracker with GPS-tagged field officer updates.

---

## 2. User Personas

### 2.1 Citizen Applicant (`ROLE_CITIZEN`)
- **Demographics**: Indian residents aged 18-65 with Aadhaar, tech-savvy enough for smartphone/desktop browser use.
- **Goals**: Apply for passport (Fresh/Renewal/Tatkaal/Minor/Diplomatic/Lost), book PSK appointment, track application status in real-time.
- **Pain Points**: Current portal crashes during slot release, unclear rejection reasons, no visibility into police verification status.

### 2.2 Passport Seva Kendra (PSK) Officer (`ROLE_PSK_OFFICER`)
- **Demographics**: Government staff at regional Passport Seva Kendras.
- **Goals**: Process walk-in appointments, verify documents against e-KYC data, grant biometric capture approvals, manage daily slot capacity.
- **Pain Points**: Manual document cross-referencing, no automated OCR assist, paper-based checklists.

### 2.3 Police Verification Officer (`ROLE_POLICE_OFFICER`)
- **Demographics**: Field beat officers assigned by SP/DCP offices for address and identity verification.
- **Goals**: Receive dispatch assignments, log GPS-tagged visit reports, digitally sign inspection checklists, submit verification verdicts.
- **Pain Points**: WhatsApp-based coordination, no structured digital reporting, zero integration with passport system.

### 2.4 Regional Passport Officer / Admin (`ROLE_RPO_ADMIN`)
- **Demographics**: Senior MEA officials managing RPO-level operations.
- **Goals**: Monitor application pipelines, manage PSK capacity, override stuck workflows, generate compliance reports, configure slot quotas.
- **Pain Points**: No real-time dashboards, manual Excel-based reporting.

### 2.5 System Super Admin (`ROLE_SUPER_ADMIN`)
- **Demographics**: Platform administrators managing system configuration.
- **Goals**: Manage user roles, configure feature flags, monitor system health, manage encryption keys and audit logs.

---

## 3. User Stories & Acceptance Criteria

### 3.1 Authentication & Identity (Module 1)

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|---------------------|----------|
| US-101 | As a Citizen, I want to authenticate via Aadhaar OTP so that I don't need to remember a password. | OTP sent to Aadhaar-linked mobile within 3s; valid for 10 minutes; rate-limited to 5 attempts/hour. | P0 |
| US-102 | As a Citizen, I want to upload my Aadhaar Offline e-KYC ZIP file so that my identity is verified without sharing my Aadhaar number. | System accepts `.zip` + 4-digit share code, decrypts XML, verifies digital signature, extracts Name/DOB/Gender/Address/Photo. | P0 |
| US-103 | As the System, I must never store raw Aadhaar numbers in any relational table per UIDAI Data Vault mandate. | Aadhaar numbers encrypted with AES-256-GCM; only `Reference_Key (UUIDv4)` stored in application tables; UI always shows `XXXXXXXX1234`. | P0 |
| US-104 | As a Citizen, I want to see my DigiLocker verification status on my dashboard so I know my documents are linked. | Dashboard shows verified/unverified badge for each document type with DigiLocker integration status. | P1 |

### 3.2 Appointment Booking (Module 2)

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|---------------------|----------|
| US-201 | As a Citizen, I want to see real-time PSK slot availability so I can book an appointment without the page crashing. | Slot availability displayed as an interactive heatmap; updates every 5s via SSE; shows capacity % per time window. | P0 |
| US-202 | As a Citizen, I want my selected slot to be held for 5 minutes while I complete payment so that no one else takes it. | Redisson distributed lock acquired on `SLOT:{rpo_id}:{date}:{time_window}`; auto-releases after 5-min TTL if unpaid. | P0 |
| US-203 | As the System, I must handle 50,000 concurrent slot requests without double-booking or database exhaustion. | Token Bucket rate limiter (1000 req/s per PSK); Virtual Waiting Room queue; distributed lock contention resolved within 200ms p99. | P0 |
| US-204 | As a Citizen, I want to reschedule my appointment from my dashboard without calling the helpline. | One free reschedule within 48h of appointment; rescheduled slot goes back to pool immediately. | P1 |

### 3.3 Application Form & Document Verification (Module 3)

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|---------------------|----------|
| US-301 | As a Citizen, I want the form to auto-fill my details from e-KYC so I don't have to type everything again. | Name, DOB, Gender, Address auto-populated from e-KYC XML; verified fields are read-only with a lock icon. | P0 |
| US-302 | As a Citizen, I want the form to adapt based on my application type (Fresh/Renewal/Tatkaal/etc.) | Dynamic form schema engine switches required fields, annexures, and fee structure based on selected category. | P0 |
| US-303 | As a Citizen, I want my uploaded documents checked instantly for quality issues so I don't get rejected at the PSK. | OCR + image quality analysis (blur detection, glare detection, resolution check) returns a readiness score (0-100) with specific failure reasons within 10s. | P0 |
| US-304 | As a PSK Officer, I want to see the AI pre-check results alongside the applicant's file so I can fast-track verified applications. | Officer dashboard shows readiness score, OCR-extracted text vs. e-KYC comparison, and flagged mismatches. | P1 |

### 3.4 Police Verification (Module 4)

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|---------------------|----------|
| US-401 | As a Police Officer, I want to receive verification dispatch assignments on my mobile dashboard. | Push notification + dashboard card with applicant details, address, and required checklist items. | P0 |
| US-402 | As a Police Officer, I want to log my visit with GPS coordinates and submit a digital inspection report. | GPS capture accurate to 50m; digital checklist with mandatory fields; report digitally signed and timestamped. | P0 |
| US-403 | As a Citizen, I want to see real-time updates as my police verification progresses. | SSE-powered milestone tracker showing: Dispatched > Officer Assigned > Visit Scheduled > Visit Completed > Report Submitted > Verified/Escalated. | P0 |
| US-404 | As an RPO Admin, I want to see police verification SLA compliance across all pending applications. | Dashboard widget showing average verification time, overdue cases (>21 days), and officer-level performance metrics. | P1 |

### 3.5 Application Tracking & Passport Dispatch

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|---------------------|----------|
| US-501 | As a Citizen, I want to track my entire application lifecycle from submission to passport delivery on a single dashboard. | Full state machine visualization: `INITIATED > EKYC_VERIFIED > PSK_APPOINTMENT_COMPLETED > PVS_DISPATCHED > POLICE_VERIFIED > PRINTING_QUEUED > DISPATCHED_SPEED_POST > DELIVERED`. | P0 |
| US-502 | As a Citizen, I want to see the SLA countdown timer for each stage so I know expected timelines. | Each stage shows estimated/guaranteed completion date with countdown timer; overdue stages highlighted in red. | P1 |

---

## 4. Non-Functional Requirements (NFRs)

| Category | Requirement | Target |
|----------|------------|--------|
| **Performance** | Slot booking API p99 latency | < 500ms under 50K concurrent users |
| **Performance** | Dashboard page load (LCP) | < 2.5s on 4G mobile |
| **Performance** | Document OCR processing | < 10s per document |
| **Availability** | System uptime SLA | 99.9% (excludes planned maintenance) |
| **Concurrency** | Peak concurrent slot requests | 50,000+ without double-booking |
| **Security** | Aadhaar data storage | UIDAI Data Vault compliant — AES-256-GCM encryption, zero raw storage |
| **Security** | Authentication | Passwordless Aadhaar OTP + Offline e-KYC; JWT (RS256) with 15-min access + 7-day refresh |
| **Security** | API rate limiting | Token Bucket — 1000 req/s per PSK, 10 req/min per user for auth endpoints |
| **Compliance** | Data residency | All PII stored within Indian jurisdiction only |
| **Accessibility** | WCAG compliance | Level AA minimum |
| **Scalability** | Horizontal scaling | Stateless backend services; Redis Cluster for session/lock state |

---

# PART II — SYSTEMS ARCHITECTURE

## 5. Technology Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Runtime** | Java 21 LTS (Virtual Threads) | Project Loom enables massive concurrency without thread pool exhaustion |
| **Backend Framework** | Spring Boot 3.3+ | Mature, battle-tested, full ecosystem for enterprise Java |
| **Security** | Spring Security 6 + Nimbus JOSE JWT | RS256 JWT with key rotation, method-level security |
| **ORM / Data** | Spring Data JPA + Hibernate 6 | Type-safe queries, entity lifecycle management |
| **Database** | PostgreSQL 16 | Partitioned schemas, JSONB for dynamic form data, Row-Level Security |
| **Cache & Locks** | Redis 7.x Cluster + Redisson | Distributed lease locks, token bucket rate limiting, session store |
| **Document Store** | MinIO (S3-compatible) | On-prem/self-hosted encrypted document storage |
| **OCR Engine** | Tesseract OCR + Apache Tika | Open-source document text extraction and format detection |
| **Event Streaming** | Spring WebFlux SSE | Real-time status updates without WebSocket complexity |
| **Frontend** | Next.js 15 (App Router) + React 19 | Server Components, Server Actions, streaming SSR |
| **Styling** | Tailwind CSS 4 | Utility-first, tree-shakeable, design-token-driven |
| **UI Components** | Lucide React + Framer Motion | Consistent iconography + premium animation system |
| **Crypto** | Bouncy Castle (XML-DSig) | Aadhaar e-KYC XML digital signature verification |
| **Containerization** | Docker + Docker Compose | Local dev + production parity |
| **DB Migrations** | Flyway | Versioned, repeatable SQL migrations |

---

## 6. Entity-Relationship Model

### 6.1 Core Entities

```
+---------------------+      +--------------------------+
|   aadhaar_vault      |      |       citizens            |
+---------------------+      +--------------------------+
| vault_id (PK, UUID) |<-----| citizen_id (PK, UUID)    |
| encrypted_aadhaar   |      | vault_ref_key (FK->vault) |
| reference_key (UQ)  |      | full_name (VARCHAR 200)   |
| encryption_key_id   |      | date_of_birth (DATE)      |
| created_at (TSTZ)   |      | gender (ENUM: M/F/O)      |
| rotated_at (TSTZ)   |      | mobile_hash (VARCHAR 64)  |
+---------------------+      | email (VARCHAR 255)       |
                              | address_json (JSONB)      |
                              | photo_url (VARCHAR 500)   |
                              | ekyc_verified (BOOLEAN)   |
                              | digilocker_linked(BOOLEAN)|
                              | created_at (TSTZ)         |
                              | updated_at (TSTZ)         |
                              +--------------------------+
                                          |
                    +---------------------+
                    v                     v
+-------------------------+  +-------------------------------+
|   passport_applications  |  |        appointments            |
+-------------------------+  +-------------------------------+
| app_id (PK, UUID)       |  | appointment_id (PK, UUID)     |
| citizen_id (FK->citizens)|  | app_id (FK->applications)     |
| application_type (ENUM) |  | psk_id (FK->psk_centers)      |
| category (ENUM)         |  | slot_date (DATE)              |
| status (ENUM)           |  | time_window (ENUM)            |
| form_data (JSONB)       |  | status (ENUM: BOOKED/         |
| file_number (VARCHAR)   |  |   COMPLETED/CANCELLED/        |
| fee_amount (DECIMAL)    |  |   NO_SHOW/RESCHEDULED)        |
| fee_paid (BOOLEAN)      |  | booked_at (TSTZ)              |
| tatkaal (BOOLEAN)       |  | lock_expiry (TSTZ)            |
| submitted_at (TSTZ)     |  +-------------------------------+
| current_stage (ENUM)    |
| sla_deadline (TSTZ)     |     +-----------------------------+
| created_at (TSTZ)       |     |   police_verifications       |
| updated_at (TSTZ)       |     +-----------------------------+
+-------------------------+     | pv_id (PK, UUID)            |
          |                     | app_id (FK->applications)   |
          |                     | officer_id (FK->officers)   |
          v                     | dispatch_date (TSTZ)        |
+-------------------------+     | visit_date (TSTZ)           |
|    documents             |     | gps_latitude (DECIMAL 9,6) |
+-------------------------+     | gps_longitude (DECIMAL 9,6) |
| doc_id (PK, UUID)       |     | checklist_json (JSONB)      |
| app_id (FK->applications)|     | verdict (ENUM: CLEAR/       |
| doc_type (ENUM)         |     |   ADVERSE/INCOMPLETE)       |
| file_path (VARCHAR 500) |     | digital_signature (TEXT)    |
| ocr_score (INT 0-100)   |     | remarks (TEXT)              |
| ocr_result_json (JSONB) |     | submitted_at (TSTZ)        |
| quality_passed (BOOLEAN)|     +-----------------------------+
| uploaded_at (TSTZ)      |
+-------------------------+     +-----------------------------+
                                |   psk_centers                |
+-------------------------+     +-----------------------------+
|   slot_inventory         |     | psk_id (PK, UUID)           |
+-------------------------+     | name (VARCHAR 200)          |
| slot_id (PK, UUID)      |     | city (VARCHAR 100)          |
| psk_id (FK->psk_centers) |     | state (VARCHAR 100)         |
| slot_date (DATE)        |     | address (TEXT)              |
| time_window (ENUM)      |     | daily_capacity (INT)        |
| total_capacity (INT)    |     | rpo_code (VARCHAR 10)       |
| booked_count (INT)      |     | active (BOOLEAN)            |
| locked_count (INT)      |     +-----------------------------+
| version (BIGINT)        |
+-------------------------+     +-----------------------------+
                                |   application_timeline       |
+-------------------------+     +-----------------------------+
|   officers               |     | event_id (PK, UUID)         |
+-------------------------+     | app_id (FK->applications)   |
| officer_id (PK, UUID)   |     | stage (ENUM)                |
| name (VARCHAR 200)      |     | status (ENUM)               |
| badge_number (VARCHAR)  |     | actor_id (UUID)             |
| designation (VARCHAR)   |     | actor_role (ENUM)           |
| station (VARCHAR 200)   |     | metadata_json (JSONB)       |
| jurisdiction_json(JSONB)|     | created_at (TSTZ)           |
| mobile_hash (VARCHAR 64)|     +-----------------------------+
| active (BOOLEAN)        |
+-------------------------+
```

### 6.2 ENUM Definitions

```sql
-- Application Types
CREATE TYPE application_type AS ENUM (
  'FRESH', 'RENEWAL', 'REISSUE', 'DIPLOMATIC', 'OFFICIAL'
);

-- Application Categories
CREATE TYPE application_category AS ENUM (
  'NORMAL', 'TATKAAL', 'SUPER_TATKAAL'
);

-- Application Lifecycle Stages
CREATE TYPE application_stage AS ENUM (
  'INITIATED',
  'EKYC_VERIFIED',
  'FORM_SUBMITTED',
  'DOCUMENTS_UPLOADED',
  'PAYMENT_COMPLETED',
  'APPOINTMENT_BOOKED',
  'PSK_APPOINTMENT_COMPLETED',
  'PVS_DISPATCHED',
  'POLICE_VERIFIED',
  'GRANTED',
  'PRINTING_QUEUED',
  'DISPATCHED_SPEED_POST',
  'DELIVERED',
  'REJECTED',
  'ON_HOLD'
);

-- Time Windows (30-min slots from 9:00 AM to 4:00 PM)
CREATE TYPE time_window AS ENUM (
  'SLOT_0900', 'SLOT_0930', 'SLOT_1000', 'SLOT_1030',
  'SLOT_1100', 'SLOT_1130', 'SLOT_1200', 'SLOT_1230',
  'SLOT_1300', 'SLOT_1330', 'SLOT_1400', 'SLOT_1430',
  'SLOT_1500', 'SLOT_1530'
);

-- Document Types
CREATE TYPE document_type AS ENUM (
  'PHOTO', 'AADHAAR_EKYC', 'PAN_CARD', 'BIRTH_CERTIFICATE',
  'SCHOOL_LEAVING', 'VOTER_ID', 'ELECTRICITY_BILL',
  'BANK_STATEMENT', 'MARRIAGE_CERTIFICATE', 'AFFIDAVIT',
  'ANNEXURE_A', 'ANNEXURE_D', 'ANNEXURE_E', 'ANNEXURE_F',
  'ANNEXURE_H', 'ANNEXURE_I', 'NOC_EMPLOYER'
);
```

---

## 7. API Contracts (RESTful — `/api/v1`)

### 7.1 Authentication & e-KYC

| Method | Endpoint | Request Body | Response | Codes |
|--------|----------|-------------|----------|-------|
| `POST` | `/api/v1/auth/aadhaar/otp/generate` | `{ "aadhaarNumber": "999999999999" }` | `{ "txnId": "uuid", "message": "OTP sent" }` | 200, 429 |
| `POST` | `/api/v1/auth/aadhaar/otp/verify` | `{ "txnId": "uuid", "otp": "123456" }` | `{ "accessToken": "jwt", "refreshToken": "jwt", "citizenId": "uuid" }` | 200, 401, 429 |
| `POST` | `/api/v1/auth/ekyc/offline` | `multipart: file=.zip, shareCode=1234` | `{ "citizenId": "uuid", "name": "...", "maskedAadhaar": "XXXXXXXX1234", "verified": true }` | 200, 400, 422 |
| `POST` | `/api/v1/auth/token/refresh` | `{ "refreshToken": "jwt" }` | `{ "accessToken": "jwt" }` | 200, 401 |

### 7.2 Passport Applications

| Method | Endpoint | Request Body | Response | Codes |
|--------|----------|-------------|----------|-------|
| `POST` | `/api/v1/applications` | `{ "applicationType": "FRESH", "category": "NORMAL", "formData": {...} }` | `{ "appId": "uuid", "fileNumber": "BLR-2026-XXXXXX", "status": "INITIATED" }` | 201, 400, 422 |
| `GET` | `/api/v1/applications/{appId}` | — | Full application object with current stage | 200, 404 |
| `GET` | `/api/v1/applications/{appId}/timeline` | — | Array of timeline events | 200, 404 |
| `PATCH` | `/api/v1/applications/{appId}/stage` | `{ "stage": "PSK_APPOINTMENT_COMPLETED", "metadata": {...} }` | Updated application | 200, 400, 403 |

### 7.3 Document Upload & OCR

| Method | Endpoint | Request Body | Response | Codes |
|--------|----------|-------------|----------|-------|
| `POST` | `/api/v1/applications/{appId}/documents` | `multipart: file, docType` | `{ "docId": "uuid", "ocrScore": 87, "qualityPassed": true, "issues": [] }` | 201, 400, 413 |
| `GET` | `/api/v1/applications/{appId}/documents` | — | Array of document metadata with OCR results | 200 |

### 7.4 Slot Booking

| Method | Endpoint | Request Body | Response | Codes |
|--------|----------|-------------|----------|-------|
| `GET` | `/api/v1/slots/availability` | `?pskId=uuid&date=2026-08-20` | `{ "slots": [{ "timeWindow": "SLOT_0900", "available": 15, "total": 50 }] }` | 200 |
| `POST` | `/api/v1/slots/reserve` | `{ "appId": "uuid", "pskId": "uuid", "date": "2026-08-20", "timeWindow": "SLOT_0900" }` | `{ "appointmentId": "uuid", "lockExpiry": "2026-08-15T10:05:00Z", "status": "RESERVED" }` | 200, 409, 429 |
| `POST` | `/api/v1/slots/confirm` | `{ "appointmentId": "uuid", "paymentRef": "..." }` | `{ "appointmentId": "uuid", "status": "BOOKED" }` | 200, 400, 410 |
| `DELETE` | `/api/v1/slots/release/{appointmentId}` | — | `{ "released": true }` | 200, 404 |

### 7.5 Police Verification

| Method | Endpoint | Request Body | Response | Codes |
|--------|----------|-------------|----------|-------|
| `GET` | `/api/v1/police/assignments` | `?officerId=uuid` | Array of pending verification assignments | 200 |
| `POST` | `/api/v1/police/reports` | `{ "pvId": "uuid", "gpsLat": 12.97, "gpsLng": 77.59, "checklist": {...}, "verdict": "CLEAR", "signature": "..." }` | `{ "reportId": "uuid", "status": "SUBMITTED" }` | 201, 400 |

### 7.6 Real-Time Events (SSE)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/events/application/{appId}` | SSE stream — emits `stage_changed`, `document_verified`, `pv_update`, `sla_warning` events |
| `GET` | `/api/v1/events/slots/{pskId}/{date}` | SSE stream — real-time slot availability updates |

### 7.7 Admin / RPO Dashboard

| Method | Endpoint | Request Body | Response | Codes |
|--------|----------|-------------|----------|-------|
| `GET` | `/api/v1/admin/dashboard/stats` | `?rpoCode=BLR` | `{ "totalApplications": 5000, "pendingPV": 120, "avgProcessingDays": 12, ... }` | 200 |
| `GET` | `/api/v1/admin/applications` | `?status=PVS_DISPATCHED&page=0&size=20` | Paginated application list with filters | 200 |
| `PATCH` | `/api/v1/admin/slots/{pskId}/capacity` | `{ "date": "...", "timeWindow": "...", "newCapacity": 60 }` | Updated slot inventory | 200, 400 |

---

## 8. System Folder Structure

```
Bharat_Pass/
├── .agents/                          # AI agent config (existing)
│   ├── agents.md
│   ├── skills/
│   └── workflows/
│
├── backend/                          # Java 21 / Spring Boot 3.3+
│   ├── pom.xml                       # Maven build (parent POM)
│   ├── src/main/java/com/bharatpass/
│   │   ├── BharatPassApplication.java
│   │   ├── config/
│   │   │   ├── SecurityConfig.java
│   │   │   ├── RedisConfig.java
│   │   │   ├── MinioConfig.java
│   │   │   ├── CorsConfig.java
│   │   │   └── JwtConfig.java
│   │   ├── auth/
│   │   │   ├── controller/AuthController.java
│   │   │   ├── service/AadhaarOtpService.java
│   │   │   ├── service/OfflineEkycService.java
│   │   │   ├── service/JwtTokenService.java
│   │   │   ├── dto/OtpRequest.java
│   │   │   ├── dto/OtpVerifyRequest.java
│   │   │   └── dto/AuthResponse.java
│   │   ├── vault/
│   │   │   ├── service/AadhaarVaultService.java
│   │   │   ├── entity/AadhaarVaultEntry.java
│   │   │   └── repository/AadhaarVaultRepository.java
│   │   ├── application/
│   │   │   ├── controller/ApplicationController.java
│   │   │   ├── service/ApplicationService.java
│   │   │   ├── service/FormSchemaEngine.java
│   │   │   ├── entity/PassportApplication.java
│   │   │   ├── entity/ApplicationTimeline.java
│   │   │   ├── repository/ApplicationRepository.java
│   │   │   ├── dto/ApplicationRequest.java
│   │   │   └── dto/ApplicationResponse.java
│   │   ├── document/
│   │   │   ├── controller/DocumentController.java
│   │   │   ├── service/DocumentService.java
│   │   │   ├── service/OcrPreCheckService.java
│   │   │   ├── entity/Document.java
│   │   │   ├── repository/DocumentRepository.java
│   │   │   └── dto/DocumentUploadResponse.java
│   │   ├── booking/
│   │   │   ├── controller/SlotBookingController.java
│   │   │   ├── service/SlotBookingService.java
│   │   │   ├── service/WaitingRoomService.java
│   │   │   ├── service/RateLimiterService.java
│   │   │   ├── entity/SlotInventory.java
│   │   │   ├── entity/Appointment.java
│   │   │   ├── entity/PskCenter.java
│   │   │   ├── repository/SlotInventoryRepository.java
│   │   │   ├── repository/AppointmentRepository.java
│   │   │   ├── dto/SlotAvailabilityResponse.java
│   │   │   ├── dto/SlotReserveRequest.java
│   │   │   └── dto/SlotReserveResponse.java
│   │   ├── police/
│   │   │   ├── controller/PoliceVerificationController.java
│   │   │   ├── service/PoliceVerificationService.java
│   │   │   ├── entity/PoliceVerification.java
│   │   │   ├── entity/Officer.java
│   │   │   ├── repository/PoliceVerificationRepository.java
│   │   │   ├── repository/OfficerRepository.java
│   │   │   └── dto/VerificationReportRequest.java
│   │   ├── events/
│   │   │   ├── controller/SseController.java
│   │   │   └── service/EventPublisherService.java
│   │   ├── admin/
│   │   │   ├── controller/AdminDashboardController.java
│   │   │   └── service/AdminService.java
│   │   └── common/
│   │       ├── exception/GlobalExceptionHandler.java
│   │       ├── exception/SlotUnavailableException.java
│   │       ├── exception/EkycValidationException.java
│   │       ├── enums/ApplicationStage.java
│   │       ├── enums/ApplicationType.java
│   │       ├── enums/ApplicationCategory.java
│   │       ├── enums/TimeWindow.java
│   │       ├── enums/DocumentType.java
│   │       ├── enums/Gender.java
│   │       └── util/MaskingUtil.java
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   ├── application-dev.yml
│   │   ├── application-prod.yml
│   │   └── db/migration/
│   │       ├── V1__create_enums.sql
│   │       ├── V2__create_aadhaar_vault.sql
│   │       ├── V3__create_citizens.sql
│   │       ├── V4__create_applications.sql
│   │       ├── V5__create_documents.sql
│   │       ├── V6__create_slots_and_appointments.sql
│   │       ├── V7__create_police_verification.sql
│   │       └── V8__create_timeline.sql
│   └── src/test/java/com/bharatpass/
│       └── ...
│
├── frontend/                             # Next.js 15 / React 19
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── public/
│   │   └── assets/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── globals.css
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── ekyc/page.tsx
│   │   │   ├── (citizen)/
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── apply/page.tsx
│   │   │   │   ├── documents/page.tsx
│   │   │   │   ├── book-slot/page.tsx
│   │   │   │   └── track/page.tsx
│   │   │   ├── (officer)/
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   └── verify/[appId]/page.tsx
│   │   │   ├── (police)/
│   │   │   │   ├── assignments/page.tsx
│   │   │   │   └── report/[pvId]/page.tsx
│   │   │   └── (admin)/
│   │   │       ├── dashboard/page.tsx
│   │   │       └── slots/page.tsx
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── GlassCard.tsx
│   │   │   │   ├── NeuButton.tsx
│   │   │   │   ├── NeuInput.tsx
│   │   │   │   ├── NeuToggle.tsx
│   │   │   │   ├── BentoGrid.tsx
│   │   │   │   ├── ProgressBar.tsx
│   │   │   │   ├── StatusBadge.tsx
│   │   │   │   ├── CountdownTimer.tsx
│   │   │   │   └── HeatmapGrid.tsx
│   │   │   ├── auth/
│   │   │   │   ├── AadhaarOtpForm.tsx
│   │   │   │   └── EkycUpload.tsx
│   │   │   ├── application/
│   │   │   │   ├── DynamicForm.tsx
│   │   │   │   ├── ApplicationHero.tsx
│   │   │   │   └── TimelineTracker.tsx
│   │   │   ├── booking/
│   │   │   │   ├── SlotHeatmap.tsx
│   │   │   │   └── BookingConfirmation.tsx
│   │   │   ├── documents/
│   │   │   │   ├── DocumentUploader.tsx
│   │   │   │   └── OcrScoreCard.tsx
│   │   │   ├── police/
│   │   │   │   ├── VerificationCard.tsx
│   │   │   │   └── GpsReportForm.tsx
│   │   │   └── dashboard/
│   │   │       ├── CitizenCommandCenter.tsx
│   │   │       ├── AdminStatsGrid.tsx
│   │   │       └── PvStreamWidget.tsx
│   │   ├── hooks/
│   │   │   ├── useSSE.ts
│   │   │   ├── useAuth.ts
│   │   │   └── useCountdown.ts
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   └── constants.ts
│   │   └── types/
│   │       ├── application.ts
│   │       ├── auth.ts
│   │       ├── booking.ts
│   │       └── police.ts
│   └── .env.local
│
├── database/
├── docs/
│   ├── UI_UX_Style_Guide.md
│   └── Images/
├── artifacts/
│   └── task_lists/
│       └── Master_Blueprint.md          # THIS FILE
├── docker-compose.yml
└── README.md
```

---

# PART III — UI/UX STRATEGY & DESIGN SYSTEM

## 9. Design System: Glass-Neumorphism Hybrid

### 9.1 Color Palette & Tokens

```css
/* Core Background Gradient (Dark Mode Default) */
--bg-primary: linear-gradient(135deg, #0f172a, #1e1b4b, #0f172a);

/* Glass Surface Tokens */
--glass-bg-light: rgba(255, 255, 255, 0.10);
--glass-bg-dark: rgba(15, 23, 42, 0.40);
--glass-border: rgba(255, 255, 255, 0.20);
--glass-blur: 24px;

/* Neumorphic Shadow Tokens */
--neu-shadow-extruded: 6px 6px 16px rgba(0,0,0,0.3), -6px -6px 16px rgba(255,255,255,0.05);
--neu-shadow-inset: inset 4px 4px 8px rgba(0,0,0,0.4), inset -4px -4px 8px rgba(255,255,255,0.05);

/* Accent Colors */
--accent-primary: #6366f1;     /* Indigo — primary interactions */
--accent-success: #10b981;     /* Emerald — verified / success */
--accent-warning: #f59e0b;     /* Amber — in-process / pending */
--accent-danger: #ef4444;      /* Red — errors / overdue */
--accent-info: #06b6d4;        /* Cyan — informational */

/* Text Colors */
--text-primary: #f1f5f9;       /* Slate 100 */
--text-secondary: #94a3b8;     /* Slate 400 */
--text-muted: #64748b;         /* Slate 500 */
```

### 9.2 Typography

| Usage | Font | Weight | Size |
|-------|------|--------|------|
| Headings (H1-H3) | Inter / Geist Sans | 700 (Bold) | 2rem / 1.5rem / 1.25rem |
| Body text | Inter | 400 (Regular) | 1rem |
| Labels & captions | Inter | 500 (Medium) | 0.875rem |
| Tracking codes & IDs | JetBrains Mono | 500 | 0.875rem |
| Status badges | Inter | 600 (Semi-bold) | 0.75rem |

### 9.3 Component Primitives

| Component | Style System | Description |
|-----------|-------------|-------------|
| `<GlassCard>` | Glassmorphism | Frosted translucent container with `backdrop-blur-xl`, subtle border glow |
| `<NeuButton>` | Neumorphism | Tactile button with extruded -> inset state on press |
| `<NeuInput>` | Neumorphism | Inset text input with soft inner shadow |
| `<NeuToggle>` | Neumorphism | Sliding toggle with extruded track and inset knob |
| `<BentoGrid>` | CSS Grid | Asymmetric responsive grid container (12-col base) |
| `<ProgressBar>` | Hybrid | Glass track with animated gradient fill |
| `<StatusBadge>` | Glassmorphism | Colored pill with glow effect (Emerald/Amber/Red) |
| `<CountdownTimer>` | Mono + Glow | JetBrains Mono digits with subtle pulse animation |
| `<HeatmapGrid>` | Custom | Color-coded slot availability grid (green->yellow->red) |

### 9.4 Bento Grid Layout — Citizen Dashboard

```
+----------------------------------------------------+---------------+
|                                                    |               |
|  APPLICATION HERO WIDGET (Col 1-8, Row 1)          |  IDENTITY     |
|  +- Glass Card --------------------------------+   |  VAULT &      |
|  | SVG Passport Visualization                  |   |  e-KYC STATUS |
|  | * Stage Progress Bar                        |   |  (Col 9-12)   |
|  | * SLA Countdown Timer                       |   |               |
|  +---------------------------------------------+   |  Aadhaar: OK  |
|                                                    |  DigiLocker:OK|
|                                                    |  Biometric: L |
+--------------+-----------------+-------------------+---------------+
|              |                 |                   |
| APPOINTMENT  | mPOLICE         |  AI DOCUMENT      |
| RADAR        | VERIFICATION    |  READINESS        |
| (Col 1-4)    | STREAM          |  HEALTHCHECK      |
|              | (Col 5-8)       |  (Col 9-12)       |
| PSK Heatmap  | Live Tracker    |  Score: 87/100    |
| * Book Now   | * GPS Status    |  ! Missing: PAN   |
|              | * Signed        |  OK Photo OK      |
+--------------+-----------------+-------------------+
```

### 9.5 Animation Strategy (Framer Motion)

| Trigger | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Page mount | Stagger fade-in from bottom | 600ms per card, 100ms stagger | `easeOut` |
| Card hover | Scale 1.02 + glow intensify | 200ms | `spring` |
| Button press | Neumorphic extruded -> inset | 150ms | `easeInOut` |
| Stage advance | Progress bar fill + confetti burst | 800ms | `spring` |
| Status change | Badge color morph + pulse | 400ms | `easeInOut` |
| SSE event | Slide-in notification toast | 300ms | `anticipate` |

### 9.6 Responsive Breakpoints

| Breakpoint | Columns | Adaptation |
|------------|---------|------------|
| >=1280px (xl) | 12 columns | Full Bento layout |
| >=1024px (lg) | 8 columns | Hero spans full width; sidebar stacks below |
| >=768px (md) | 4 columns | 2x2 card grid |
| <768px (sm) | 1 column | Full-width stacked cards |

### 9.7 State Management Strategy

| Scope | Technology | Usage |
|-------|-----------|-------|
| Server state (API data) | React Query (TanStack Query) v5 | Caching, background refetch, optimistic updates |
| Auth state | React Context + `useAuth` hook | JWT tokens, user profile, role-based access |
| Real-time events | Custom `useSSE` hook | SSE subscriptions with auto-reconnect |
| Form state | React Hook Form + Zod validation | Dynamic passport application forms |
| UI state | Local `useState` / `useReducer` | Modals, toggles, accordion states |

---

## 10. Security Architecture Summary

| Concern | Implementation |
|---------|---------------|
| Authentication | Passwordless: Aadhaar OTP + Offline e-KYC |
| Authorization | Spring Security 6 method-level `@PreAuthorize` with role hierarchy |
| Token format | RS256 JWT -- 15-min access token, 7-day refresh token (httpOnly cookie) |
| Aadhaar storage | AES-256-GCM encrypted vault; UUIDv4 reference keys only in app tables |
| API rate limiting | Redis Token Bucket: 1000 req/s per PSK, 10 req/min per user on auth |
| Document encryption | AES-256 at-rest in MinIO; TLS 1.3 in-transit |
| Input validation | Jakarta Bean Validation + custom sanitizers |
| CORS | Whitelist-only for Next.js origin |
| Audit logging | Immutable `application_timeline` table; structured JSON logs |

---

## 11. Verification Plan

### 11.1 Automated Tests
- `mvn test` — Unit tests for all service classes (JUnit 5 + Mockito)
- `mvn verify` — Integration tests with Testcontainers (PostgreSQL + Redis)
- `npm run test` — Jest + React Testing Library for frontend components
- `npm run lint` — ESLint + Prettier compliance

### 11.2 Manual Verification
- Full slot booking flow under simulated concurrent load (JMeter / k6)
- e-KYC ZIP upload -> form auto-fill -> document upload -> OCR score display
- SSE real-time updates visible across multiple browser tabs
- Police officer mobile report submission with GPS capture
- Admin dashboard data accuracy verification

---

> **END OF MASTER BLUEPRINT v1.0**
