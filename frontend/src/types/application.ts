export type ApplicationStage =
  | 'INITIATED'
  | 'EKYC_VERIFIED'
  | 'FORM_SUBMITTED'
  | 'DOCUMENTS_UPLOADED'
  | 'PAYMENT_COMPLETED'
  | 'APPOINTMENT_BOOKED'
  | 'PSK_APPOINTMENT_COMPLETED'
  | 'PVS_DISPATCHED'
  | 'POLICE_VERIFIED'
  | 'GRANTED'
  | 'PRINTING_QUEUED'
  | 'DISPATCHED_SPEED_POST'
  | 'DELIVERED'
  | 'REJECTED'
  | 'ON_HOLD';

export type ApplicationType = 'FRESH' | 'RENEWAL' | 'REISSUE' | 'DIPLOMATIC' | 'OFFICIAL';
export type ApplicationCategory = 'NORMAL' | 'TATKAAL' | 'SUPER_TATKAAL';

export interface PassportApplication {
  appId: string;
  citizenId: string;
  applicationType: ApplicationType;
  category: ApplicationCategory;
  currentStage: ApplicationStage;
  formData: Record<string, unknown>;
  fileNumber: string;
  feeAmount: number;
  feePaid: boolean;
  tatkaal: boolean;
  submittedAt: string | null;
  slaDeadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  eventId: string;
  appId: string;
  stage: ApplicationStage;
  status: string;
  actorId: string | null;
  actorRole: string | null;
  metadataJson: Record<string, unknown> | null;
  createdAt: string;
}

export interface DocumentInfo {
  docId: string;
  appId: string;
  docType: string;
  filePath: string;
  ocrScore: number | null;
  ocrResultJson: Record<string, unknown> | null;
  qualityPassed: boolean | null;
  uploadedAt: string;
}

export const STAGE_LABELS: Record<ApplicationStage, string> = {
  INITIATED: 'Application Initiated',
  EKYC_VERIFIED: 'e-KYC Verified',
  FORM_SUBMITTED: 'Form Submitted',
  DOCUMENTS_UPLOADED: 'Documents Uploaded',
  PAYMENT_COMPLETED: 'Payment Completed',
  APPOINTMENT_BOOKED: 'Appointment Booked',
  PSK_APPOINTMENT_COMPLETED: 'PSK Appointment Done',
  PVS_DISPATCHED: 'Police Verification Dispatched',
  POLICE_VERIFIED: 'Police Verified',
  GRANTED: 'Passport Granted',
  PRINTING_QUEUED: 'Printing Queued',
  DISPATCHED_SPEED_POST: 'Dispatched via Speed Post',
  DELIVERED: 'Delivered',
  REJECTED: 'Rejected',
  ON_HOLD: 'On Hold',
};

export const STAGE_ORDER: ApplicationStage[] = [
  'INITIATED', 'EKYC_VERIFIED', 'FORM_SUBMITTED', 'DOCUMENTS_UPLOADED',
  'PAYMENT_COMPLETED', 'APPOINTMENT_BOOKED', 'PSK_APPOINTMENT_COMPLETED',
  'PVS_DISPATCHED', 'POLICE_VERIFIED', 'GRANTED', 'PRINTING_QUEUED',
  'DISPATCHED_SPEED_POST', 'DELIVERED',
];
