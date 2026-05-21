'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { StepIndicator } from '@/components/registration/StepIndicator';
import { useRegistrationStore } from '@/store/registrationStore';
import { WAIVER_SECTIONS } from '@/constants/waiver';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, ArrowLeft, PenLine, Type, X, CheckCircle2, AlertCircle } from 'lucide-react';
import type SignatureCanvas from 'react-signature-canvas';

// Dynamic import for SignatureCanvas — no SSR
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SignatureCanvasComponent = dynamic(
  () => import('react-signature-canvas'),
  { ssr: false }
) as React.ComponentType<{
  ref?: React.Ref<SignatureCanvas | null>;
  canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement> & { height?: number };
  backgroundColor?: string;
}>;

export default function WaiverPage() {
  const router = useRouter();
  const { waiver, setWaiver, setPayment, setCurrentStep, parent, children } = useRegistrationStore();

  const [scrolled, setScrolled] = useState(false);
  const [agreed, setAgreed] = useState(waiver.agreed || false);
  const [signatureTab, setSignatureTab] = useState<'drawn' | 'typed'>('drawn');
  const [typedName, setTypedName] = useState(waiver.signatureType === 'typed' ? waiver.signatureData || '' : '');
  const [photoConsent, setPhotoConsent] = useState(waiver.photoConsent !== false);
  const [error, setError] = useState('');

  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const waiverScrollRef = useRef<HTMLDivElement>(null);

  const handleWaiverScroll = useCallback(() => {
    const el = waiverScrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 50;
    if (atBottom) setScrolled(true);
  }, []);

  useEffect(() => {
    const el = waiverScrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleWaiverScroll);
      // Check if content is short enough to not need scrolling
      if (el.scrollHeight <= el.clientHeight + 10) setScrolled(true);
    }
    return () => el?.removeEventListener('scroll', handleWaiverScroll);
  }, [handleWaiverScroll]);

  const handleSubmit = () => {
    setError('');

    if (!agreed) {
      setError('You must read the waiver and check the agreement checkbox.');
      return;
    }

    let signatureData = '';
    if (signatureTab === 'drawn') {
      if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
        setError('Please draw your signature.');
        return;
      }
      signatureData = sigCanvasRef.current.toDataURL('image/png');
    } else {
      if (!typedName.trim() || typedName.trim().length < 3) {
        setError('Please type your full legal name as signature.');
        return;
      }
      signatureData = typedName.trim();
    }

    setWaiver({
      agreed: true,
      signatureType: signatureTab,
      signatureData,
      signedAt: new Date().toISOString(),
      photoConsent,
    });
    // Payment is free — skip payment step, go straight to review
    setPayment({ method: 'FREE', status: 'CONFIRMED' });
    setCurrentStep(5);
    router.push('/register/review');
  };

  const clearSignature = () => {
    sigCanvasRef.current?.clear();
  };

  const parentName = `${parent.parentFirstName || ''} ${parent.parentLastName || ''}`.trim();

  return (
    <div className="max-w-6xl mx-auto px-4 pb-16">
      <StepIndicator current={3} />

      <div className="mb-4">
        <h2 className="text-xl font-bold text-[#4A1078]">Liability Waiver & Release</h2>
        <p className="text-gray-500 text-sm mt-1">Please read the full waiver and sign below to proceed.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Waiver Text - Left Panel */}
        <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-[#4A1078] px-4 py-3 flex items-center justify-between">
            <h3 className="text-white font-semibold text-sm">Hamro Event Solutions LLC — Liability Waiver</h3>
            <span className="text-purple-300 text-xs">Scroll to read all</span>
          </div>
          <div
            ref={waiverScrollRef}
            className="overflow-y-auto p-5 space-y-6"
            style={{ maxHeight: '55vh', minHeight: '200px' }}
          >
            <div className="text-center pb-4 border-b border-gray-100">
              <h4 className="font-bold text-[#4A1078] text-base">BABYSITTING SERVICES</h4>
              <p className="text-[#4A1078] font-semibold">LIABILITY WAIVER & RELEASE OF CLAIMS</p>
              <p className="text-gray-500 text-sm mt-1">Saturday, May 30, 2026 | 8:00 AM – 9:00 PM</p>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              This Liability Waiver and Release of Claims (&ldquo;Agreement&rdquo;) is entered into by the undersigned parent or legal guardian on behalf of themselves and their minor child(ren) in favor of Hamro Event Solutions LLC, its members, officers, employees, agents, and contracted staff.
            </p>
            {WAIVER_SECTIONS.map((section) => (
              <div key={section.id}>
                <h5 className="font-bold text-[#4A1078] text-sm mb-2">{section.title}</h5>
                <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}
            <div className="bg-[#EDE0F5] rounded-lg p-4 text-center">
              <CheckCircle2 className="w-6 h-6 text-[#4A1078] mx-auto mb-2" />
              <p className="text-[#4A1078] font-semibold text-sm">You have reached the end of the waiver.</p>
              <p className="text-gray-600 text-xs mt-1 lg:hidden">Please complete the signature section below.</p>
              <p className="text-gray-600 text-xs mt-1 hidden lg:block">Please complete the signature panel on the right.</p>
            </div>
          </div>
          {!scrolled && (
            <div className="bg-amber-50 border-t border-amber-200 px-4 py-2 text-amber-800 text-xs text-center">
              Please scroll to the bottom to read the full waiver before agreeing.
            </div>
          )}
        </div>

        {/* Signature Panel - Right */}
        <div className="lg:sticky lg:top-20 space-y-5">
          {/* Agreement Checkbox */}
          <div className={`bg-white rounded-2xl border p-5 shadow-sm transition-colors ${scrolled ? 'border-purple-200' : 'border-gray-200 opacity-60'}`}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                disabled={!scrolled}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 accent-[#4A1078] cursor-pointer"
              />
              <span className="text-sm text-gray-700 leading-relaxed">
                I, <strong>{parentName || 'parent/guardian'}</strong>, have read and fully understand the Liability Waiver above. I agree to all terms on behalf of myself and my child(ren) listed in this registration.
              </span>
            </label>
            {!scrolled && (
              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Scroll through the waiver above to enable this checkbox.
              </p>
            )}
          </div>

          {/* Signature Tabs */}
          <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Your Signature</h4>
            <Tabs value={signatureTab} onValueChange={(v) => setSignatureTab(v as 'drawn' | 'typed')}>
              <TabsList className="w-full mb-4">
                <TabsTrigger value="drawn" className="flex-1">
                  <PenLine className="w-4 h-4 mr-1" /> Draw Signature
                </TabsTrigger>
                <TabsTrigger value="typed" className="flex-1">
                  <Type className="w-4 h-4 mr-1" /> Type Name
                </TabsTrigger>
              </TabsList>
              <TabsContent value="drawn">
                <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                  <SignatureCanvasComponent
                    ref={sigCanvasRef}
                    canvasProps={{
                      className: 'w-full',
                      height: 150,
                      style: { width: '100%', touchAction: 'none' },
                    }}
                    backgroundColor="rgb(249, 250, 251)"
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearSignature}
                    className="text-gray-500 hover:text-red-500 text-xs"
                  >
                    <X className="w-3 h-3 mr-1" /> Clear
                  </Button>
                </div>
                <p className="text-xs text-gray-400 text-center">Draw your signature using mouse or touch</p>
              </TabsContent>
              <TabsContent value="typed">
                <div className="space-y-3">
                  <Input
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    placeholder="Type your full legal name"
                    className="text-center"
                    style={{ fontFamily: 'Georgia, serif', fontSize: '18px' }}
                  />
                  {typedName && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-center">
                      <span style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontStyle: 'italic' }}>
                        {typedName}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 text-center">Your typed name serves as your legal signature</p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Signature Date */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Signature Date:</span>
                <span className="font-medium text-gray-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Photo Consent */}
          <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={photoConsent}
                onChange={(e) => setPhotoConsent(e.target.checked)}
                className="mt-1 w-4 h-4 accent-[#4A1078] cursor-pointer"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">Photo & Video Consent</p>
                <p className="text-xs text-gray-500 mt-1">I consent to HES photographing/recording my child(ren) for event documentation and promotional purposes. Uncheck to opt out.</p>
              </div>
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 py-6 border-[#4A1078] text-[#4A1078]"
              onClick={() => { setCurrentStep(2); router.push('/register/children'); }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!agreed}
              className="flex-[2] bg-[#4A1078] hover:bg-purple-900 text-white py-6 text-lg font-semibold rounded-xl disabled:opacity-50"
            >
              Next: Review <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
