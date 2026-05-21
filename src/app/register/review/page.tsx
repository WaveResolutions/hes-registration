'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StepIndicator } from '@/components/registration/StepIndicator';
import { useRegistrationStore } from '@/store/registrationStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, User, Baby, UserCheck, FileText, CreditCard, Loader2, AlertCircle } from 'lucide-react';

export default function ReviewPage() {
  const router = useRouter();
  const { parent, children, authorizedPickups, waiver, payment, setCurrentStep, reset } = useRegistrationStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parent, children, authorizedPickups, waiver, payment }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      reset();
      router.push(`/register/success?conf=${data.confirmationNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
      setLoading(false);
    }
  };

  const paymentBadge = payment.method === 'FREE' || !payment.method
    ? <Badge className="bg-green-100 text-green-700 border-green-200">Free — No charge</Badge>
    : payment.method === 'STRIPE'
      ? <Badge className="bg-green-100 text-green-700 border-green-200">Paid via Card</Badge>
      : <Badge className="bg-amber-100 text-amber-700 border-amber-200">Pending Zelle Verification</Badge>;

  return (
    <div className="max-w-2xl mx-auto px-4 pb-16">
      <StepIndicator current={5} />

      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#4A1078]">Review Your Registration</h2>
        <p className="text-gray-500 text-sm mt-1">Please review all details before submitting.</p>
      </div>

      <div className="space-y-4">
        {/* Parent Info */}
        <Card className="border-purple-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-[#4A1078] flex items-center gap-2">
              <User className="w-4 h-4" /> Parent / Guardian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div><span className="text-gray-500">Name: </span><span className="font-medium">{parent.parentFirstName} {parent.parentLastName}</span></div>
              <div><span className="text-gray-500">Relationship: </span><span className="font-medium">{parent.relationship}</span></div>
              <div className="break-all"><span className="text-gray-500">Email: </span><span className="font-medium">{parent.email}</span></div>
              <div><span className="text-gray-500">Phone: </span><span className="font-medium">{parent.phone}</span></div>
            </div>
            {parent.address && (
              <div><span className="text-gray-500">Address: </span><span className="font-medium">{parent.address}</span></div>
            )}
            <div className="border-t border-gray-100 pt-2 mt-2">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Emergency Contact</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div><span className="font-medium">{parent.emergencyContactName}</span></div>
                <div><span className="font-medium">{parent.emergencyContactPhone}</span></div>
                <div className="sm:col-span-2"><span className="text-gray-500">Relationship: </span><span className="font-medium">{parent.emergencyContactRel}</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Children */}
        <Card className="border-purple-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-[#4A1078] flex items-center gap-2">
              <Baby className="w-4 h-4" /> Children ({children.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {children.map((child, i) => (
              <div key={i} className="p-3 bg-[#EDE0F5]/30 rounded-xl text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-900">{child.childFirstName} {child.childLastName}</span>
                  <Badge variant="outline" className="text-[#4A1078] border-purple-200 text-xs">Age {child.age}</Badge>
                </div>
                {child.allergies && <p className="text-gray-600 text-xs"><span className="font-medium">Allergies:</span> {child.allergies}</p>}
                {child.medicalConditions && <p className="text-gray-600 text-xs"><span className="font-medium">Medical:</span> {child.medicalConditions}</p>}
                {child.specialNotes && <p className="text-gray-600 text-xs"><span className="font-medium">Notes:</span> {child.specialNotes}</p>}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Authorized Pickups */}
        <Card className="border-purple-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-[#4A1078] flex items-center gap-2">
              <UserCheck className="w-4 h-4" /> Authorized Pick-Ups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {authorizedPickups.map((p, i) => (
                <div key={i} className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 text-sm p-2 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{p.pickupName}</span>
                    <span className="text-gray-500 ml-2">({p.pickupRelationship})</span>
                  </div>
                  <span className="text-gray-400 xs:text-gray-500">{p.pickupPhone}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Waiver */}
        <Card className="border-purple-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-[#4A1078] flex items-center gap-2">
              <FileText className="w-4 h-4" /> Waiver & Consent
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-gray-700">Waiver signed electronically</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-gray-700">
                Signature type: <span className="font-medium capitalize">{waiver.signatureType}</span>
              </span>
            </div>
            {waiver.signatureType === 'drawn' && waiver.signatureData && (
              <div className="mt-2">
                <p className="text-gray-500 text-xs mb-1">Signature preview:</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={waiver.signatureData} alt="Signature" className="border border-gray-200 rounded-lg max-h-16 bg-gray-50" />
              </div>
            )}
            {waiver.signatureType === 'typed' && (
              <div className="mt-2">
                <p className="text-gray-500 text-xs mb-1">Typed name:</p>
                <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '18px' }} className="text-gray-900">{waiver.signatureData}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              {waiver.photoConsent
                ? <><CheckCircle2 className="w-4 h-4 text-green-500" /><span className="text-gray-700">Photo consent granted</span></>
                : <><CheckCircle2 className="w-4 h-4 text-gray-400" /><span className="text-gray-500">Photo consent declined</span></>
              }
            </div>
          </CardContent>
        </Card>

        {/* Payment */}
        <Card className="border-purple-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-[#4A1078] flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Method</span>
              {paymentBadge}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total</span>
              <span className="font-bold text-green-600">$0.00 — Free</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        <Button
          type="button"
          variant="outline"
          className="flex-1 border-[#4A1078] text-[#4A1078]"
          onClick={() => { setCurrentStep(3); router.push('/register/waiver'); }}
          disabled={loading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Waiver
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex-[2] bg-[#4A1078] hover:bg-purple-900 text-white py-6 text-lg font-semibold rounded-xl"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</>
          ) : (
            <><CheckCircle2 className="w-5 h-5 mr-2" /> Submit Registration</>
          )}
        </Button>
      </div>
    </div>
  );
}
