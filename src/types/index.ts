export interface ParentInfo {
  parentFirstName: string;
  parentLastName: string;
  relationship: string;
  email: string;
  phone: string;
  address?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRel: string;
}

export interface ChildInfo {
  childFirstName: string;
  childLastName: string;
  dateOfBirth: string;
  age?: number;
  gender?: string;
  allergies?: string;
  medicalConditions?: string;
  specialNotes?: string;
}

export interface AuthorizedPickup {
  pickupName: string;
  pickupRelationship: string;
  pickupPhone: string;
  pickupIDType?: string;
}

export interface WaiverData {
  agreed: boolean;
  signatureType: 'drawn' | 'typed';
  signatureData: string; // base64 or typed name
  signedAt: string;
  photoConsent: boolean;
}

export interface PaymentData {
  method: 'STRIPE' | 'ZELLE' | 'FREE';
  status?: string;
  stripePaymentIntentId?: string;
  zelleScreenshotBase64?: string;
}

export interface RegistrationState {
  parent: Partial<ParentInfo>;
  children: ChildInfo[];
  authorizedPickups: AuthorizedPickup[];
  waiver: Partial<WaiverData>;
  payment: Partial<PaymentData>;
  currentStep: number;
  setParent: (data: Partial<ParentInfo>) => void;
  setChildren: (children: ChildInfo[]) => void;
  setAuthorizedPickups: (pickups: AuthorizedPickup[]) => void;
  setWaiver: (data: Partial<WaiverData>) => void;
  setPayment: (data: Partial<PaymentData>) => void;
  setCurrentStep: (step: number) => void;
  reset: () => void;
}
