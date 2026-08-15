export const APP_NAME = "Bharat Pass";
export const APP_TAGLINE = "Next-Generation Passport Issuance & Verification Infrastructure";

export const PSK_CENTERS = [
  { id: "blr-psk-1", name: "PSK Bengaluru (Lalbagh)", city: "Bengaluru", state: "Karnataka", code: "BLR-01", dailySlots: 450 },
  { id: "blr-psk-2", name: "PSK Bengaluru (Marathahalli)", city: "Bengaluru", state: "Karnataka", code: "BLR-02", dailySlots: 350 },
  { id: "mum-psk-1", name: "PSK Mumbai (BKC)", city: "Mumbai", state: "Maharashtra", code: "MUM-01", dailySlots: 600 },
  { id: "del-psk-1", name: "PSK Delhi (Herald House)", city: "New Delhi", state: "Delhi", code: "DEL-01", dailySlots: 700 },
  { id: "chn-psk-1", name: "PSK Chennai (Saligramam)", city: "Chennai", state: "Tamil Nadu", code: "CHN-01", dailySlots: 400 },
  { id: "hyd-psk-1", name: "PSK Hyderabad (Begumpet)", city: "Hyderabad", state: "Telangana", code: "HYD-01", dailySlots: 500 },
  { id: "kol-psk-1", name: "PSK Kolkata (Ruby)", city: "Kolkata", state: "West Bengal", code: "KOL-01", dailySlots: 380 },
  { id: "pun-psk-1", name: "PSK Pune (Mundhwa)", city: "Pune", state: "Maharashtra", code: "PUN-01", dailySlots: 320 },
  { id: "amd-psk-1", name: "PSK Ahmedabad (Mithakhali)", city: "Ahmedabad", state: "Gujarat", code: "AMD-01", dailySlots: 340 },
  { id: "lko-psk-1", name: "PSK Lucknow (Vipin Khand)", city: "Lucknow", state: "Uttar Pradesh", code: "LKO-01", dailySlots: 300 },
];

export const TIME_SLOTS = [
  { window: "SLOT_0900", label: "09:00 AM - 09:30 AM" },
  { window: "SLOT_0930", label: "09:30 AM - 10:00 AM" },
  { window: "SLOT_1000", label: "10:00 AM - 10:30 AM" },
  { window: "SLOT_1030", label: "10:30 AM - 11:00 AM" },
  { window: "SLOT_1100", label: "11:00 AM - 11:30 AM" },
  { window: "SLOT_1130", label: "11:30 AM - 12:00 PM" },
  { window: "SLOT_1200", label: "12:00 PM - 12:30 PM" },
  { window: "SLOT_1230", label: "12:30 PM - 01:00 PM" },
  { window: "SLOT_1330", label: "01:30 PM - 02:00 PM" },
  { window: "SLOT_1400", label: "02:00 PM - 02:30 PM" },
  { window: "SLOT_1430", label: "02:30 PM - 03:00 PM" },
  { window: "SLOT_1500", label: "03:00 PM - 03:30 PM" },
  { window: "SLOT_1530", label: "03:30 PM - 04:00 PM" },
];

export const DOCUMENT_REQUIREMENTS: Record<string, { name: string; description: string; required: boolean }> = {
  PHOTO: { name: "Biometric Passport Photo", description: "White background, 35x45mm, neutral expression, 80% facial coverage", required: true },
  AADHAAR_EKYC: { name: "Aadhaar e-KYC Record", description: "Digitally signed paperless offline XML record with share code", required: true },
  PAN_CARD: { name: "PAN Card / Form 60", description: "Proof of national identity and non-ECR verification", required: true },
  BIRTH_CERTIFICATE: { name: "Birth Certificate", description: "Municipal corporation birth certificate for age verification", required: true },
  ELECTRICITY_BILL: { name: "Proof of Present Address", description: "Recent utility bill (Electricity/Water/Gas) under applicant's name", required: false },
  VOTER_ID: { name: "Election Commission Voter ID", description: "Secondary photo ID & address verification", required: false },
};
