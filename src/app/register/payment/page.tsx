'use client';

// Payment step is currently disabled — registration is FREE for this event.
// This page auto-sets the payment as FREE and redirects to review.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRegistrationStore } from '@/store/registrationStore';
import { Gift, Loader2 } from 'lucide-react';

export default function PaymentPage() {
  const router = useRouter();
  const { setPayment, setCurrentStep } = useRegistrationStore();

  useEffect(() => {
    // Auto-confirm as free and move to review
    setPayment({ method: 'FREE', status: 'CONFIRMED' });
    setCurrentStep(4);
    router.replace('/register/review');
  }, [setPayment, setCurrentStep, router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-[#4A1078]">
      <div className="w-16 h-16 bg-[#EDE0F5] rounded-full flex items-center justify-center">
        <Gift className="w-8 h-8" />
      </div>
      <p className="font-semibold text-lg">Signup is Free!</p>
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Taking you to review…
      </div>
    </div>
  );
}
