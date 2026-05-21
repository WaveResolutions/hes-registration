import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RegistrationState, ParentInfo, ChildInfo, AuthorizedPickup, WaiverData, PaymentData } from '@/types';

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set) => ({
      parent: {},
      children: [],
      authorizedPickups: [],
      waiver: {},
      payment: {},
      currentStep: 1,
      setParent: (data: Partial<ParentInfo>) => set((s) => ({ parent: { ...s.parent, ...data } })),
      setChildren: (children: ChildInfo[]) => set({ children }),
      setAuthorizedPickups: (authorizedPickups: AuthorizedPickup[]) => set({ authorizedPickups }),
      setWaiver: (data: Partial<WaiverData>) => set((s) => ({ waiver: { ...s.waiver, ...data } })),
      setPayment: (data: Partial<PaymentData>) => set((s) => ({ payment: { ...s.payment, ...data } })),
      setCurrentStep: (currentStep: number) => set({ currentStep }),
      reset: () => set({ parent: {}, children: [], authorizedPickups: [], waiver: {}, payment: {}, currentStep: 1 }),
    }),
    { name: 'hes-registration' }
  )
);
