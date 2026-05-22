'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import Image from 'next/image';
import { CheckCircle2, CalendarDays, Clock, Phone, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

function SuccessContent() {
  const params = useSearchParams();
  const conf = params.get('conf') || 'N/A';

  const googleCalUrl = new URL('https://calendar.google.com/calendar/render');
  googleCalUrl.searchParams.set('action', 'TEMPLATE');
  googleCalUrl.searchParams.set('text', 'HES Babysitting — May 30, 2026');
  googleCalUrl.searchParams.set('dates', '20260530T140000Z/20260531T030000Z');
  googleCalUrl.searchParams.set('details', 'HES Professional Babysitting Service\nConfirmation: ' + conf);
  googleCalUrl.searchParams.set('location', 'TBD');

  return (
    <div className="min-h-screen bg-[#FEFCF8] flex flex-col">
      <header className="bg-[#4A1078] py-3 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-center">
          <Link href="/">
            <Image
              src="/logo-color.png"
              alt="Hamro Event Solutions"
              width={140}
              height={42}
              className="h-9 w-auto object-contain brightness-0 invert"
            />
          </Link>
        </div>
      </header>

      <div className="flex-1 max-w-2xl mx-auto px-4 py-12">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">You&apos;re Signed Up!</h2>
          <p className="text-gray-500 text-lg">Your signup for May 30, 2026 has been received.</p>
        </div>

        {/* Confirmation Number */}
        <div className="bg-[#4A1078] text-white rounded-2xl p-6 text-center mb-6">
          <p className="text-purple-300 text-sm font-medium uppercase tracking-wide mb-2">Confirmation Number</p>
          <p className="font-mono text-2xl font-bold tracking-wider break-all">{conf}</p>
          <p className="text-purple-300 text-xs mt-2">Save this for your records. A confirmation email has been sent.</p>
        </div>

        {/* Event Details */}
        <Card className="border-purple-100 mb-6">
          <CardContent className="pt-5 space-y-3">
            <h3 className="font-semibold text-[#4A1078]">Event Details</h3>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <CalendarDays className="w-4 h-4 text-[#4A1078] shrink-0" />
              <span>Saturday, May 30, 2026</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Clock className="w-4 h-4 text-[#4A1078] shrink-0" />
              <span>8:00 AM &ndash; 9:00 PM (childcare hours)</span>
            </div>
          </CardContent>
        </Card>

        {/* What to Expect */}
        <Card className="border-purple-100 mb-6">
          <CardContent className="pt-5">
            <h3 className="font-semibold text-[#4A1078] mb-3">What to Expect on May 30</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                'Check-in starts at 8:00 AM — bring valid photo ID',
                'Children join parents for lunch 12:00 PM – 2:00 PM',
                'Structured activities throughout the day led by trained staff',
                'Buffet dinner for kids and staff at 6:30 PM',
                'Pick-up begins at 9:00 PM — valid photo ID required for all pickups',
                'Only authorized pickups on your signup may collect your child',
                'Nearest hospital: Endeavor Health Glenbrook Hospital',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4A1078] shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <a
            href={googleCalUrl.toString()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white border-2 border-[#4A1078] text-[#4A1078] px-4 py-3 rounded-xl font-semibold text-sm hover:bg-[#EDE0F5] transition-colors"
          >
            <CalendarDays className="w-4 h-4" /> Add to Google Calendar
          </a>
          <a
            href={`/api/register/waiver-pdf?conf=${conf}`}
            className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-600 px-4 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" /> Download Waiver PDF
          </a>
        </div>

        {/* Contact */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-5">
            <h3 className="font-semibold text-amber-900 mb-3">Questions? Contact Us</h3>
            <div className="space-y-2 text-sm text-amber-800">
              <a href="tel:3126270600" className="flex items-center gap-2 hover:underline">
                <Phone className="w-4 h-4" />
                Kshitiz Shrestha (Main): (312) 627-0600
              </a>
              <a href="tel:8472244156" className="flex items-center gap-2 hover:underline">
                <Phone className="w-4 h-4" />
                Manish Chaudhary (Backup): (847) 224-4156
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link href="/" className="text-[#4A1078] hover:underline text-sm font-medium">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#4A1078]">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
