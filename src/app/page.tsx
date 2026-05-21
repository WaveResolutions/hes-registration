'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import {
  Shield,
  Users,
  Clock,
  MapPin,
  Utensils,
  Activity,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  CalendarDays,
  CheckCircle2,
  Gift,
  AlertCircle,
} from 'lucide-react';
import { STAFF, ORGANIZERS } from '@/constants/staff';
import { isRegistrationOpen, EVENT_DATE, EVENT_START, EVENT_END } from '@/lib/registration-deadline';

const faqs = [
  {
    q: 'What ages are accepted?',
    a: 'We welcome children of all ages. Our childcare staff are experienced with a wide range of ages and will ensure every child has a safe, fun, and engaging day.',
  },
  {
    q: 'What should my child bring?',
    a: 'Please bring any required medications (clearly labeled), a comfort item if needed, and any special dietary items your child requires. We provide all activities, snacks, lunch (during parent lunch time), and dinner.',
  },
  {
    q: 'Who can pick up my child?',
    a: 'Only individuals listed as authorized pickups on your signup form may collect your child. Valid government-issued photo ID will be required at pick-up. No exceptions.',
  },
  {
    q: 'Is signup really free?',
    a: 'Yes! Signup for this event is completely free. Simply fill out the signup form, sign the waiver, and you are confirmed. No payment required.',
  },
  {
    q: 'What happens if there is a medical emergency?',
    a: 'Our staff is trained in first aid. In case of emergency, we will call 911 immediately and transport your child to Endeavor Health Glenbrook Hospital — the nearest facility to the venue. We will contact you at the emergency number provided during signup.',
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const registrationOpen = isRegistrationOpen();

  return (
    <div className="min-h-screen bg-[#FEFCF8]">
      {/* Navbar */}
      <nav className="bg-white sticky top-0 z-50 border-b border-purple-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Image
            src="/logo-color.png"
            alt="Hamro Event Solutions"
            width={160}
            height={48}
            className="h-10 w-auto object-contain"
            priority
          />
          {registrationOpen ? (
            <Link
              href="/register"
              className="bg-[#4A1078] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-900 transition-colors whitespace-nowrap"
            >
              Sign Up Free →
            </Link>
          ) : (
            <span className="bg-gray-200 text-gray-500 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap cursor-not-allowed">
              Signup Closed
            </span>
          )}
        </div>
      </nav>

      {/* Registration Closed Banner */}
      {!registrationOpen && (
        <div className="bg-red-600 text-white text-center py-3 px-4 text-sm font-medium">
          <AlertCircle className="inline w-4 h-4 mr-2 mb-0.5" />
          Signup is now closed. Thank you to all who signed up!
        </div>
      )}

      {/* Free Registration Banner */}
      {registrationOpen && (
        <div className="bg-[#4A1078] text-white text-center py-2 px-4 text-sm font-medium">
          <Gift className="inline w-4 h-4 mr-2 mb-0.5" />
          Free Signup — No payment required
        </div>
      )}

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#4A1078] via-[#6B21A8] to-[#3B0764] text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-amber-400 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium mb-6">
            <CalendarDays className="w-4 h-4" />
            {EVENT_DATE}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Childcare for<br />
            <span className="text-[#F59E0B]">Your Little Ones</span>
          </h1>
          <p className="text-lg md:text-xl text-purple-200 mb-4">
            {EVENT_DATE} &bull; {EVENT_START} &ndash; {EVENT_END}
          </p>
          <p className="text-purple-300 mb-4 max-w-2xl mx-auto">
            Hamro Event Solutions LLC is providing full-day childcare so you can enjoy the event worry-free. Structured activities, meals, and caring staff — all included.
          </p>
          <div className="inline-flex items-center gap-2 bg-[#F59E0B]/20 border border-[#F59E0B]/40 rounded-full px-5 py-2 text-[#F59E0B] font-bold text-lg mb-8">
            <Gift className="w-5 h-5" /> FREE Signup
          </div>
          <br />
          {registrationOpen ? (
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-amber-500 text-black font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg hover:scale-105"
            >
              Sign Up Your Child &rarr;
            </Link>
          ) : (
            <div className="inline-flex items-center gap-2 bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-lg">
              Signup Closed
            </div>
          )}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm">
            {[
              { icon: Shield, label: 'Safe Environment' },
              { icon: CheckCircle2, label: 'Caring Staff' },
              { icon: Gift, label: 'Free to Sign Up' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <Icon className="w-4 h-4 text-[#F59E0B]" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Details Cards — Date/Time + Capacity only */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#4A1078] mb-10">Event Details</h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {[
            {
              icon: CalendarDays,
              title: 'Date & Time',
              lines: [EVENT_DATE, `${EVENT_START} – ${EVENT_END}`, '13 Hours of Care'],
            },
            {
              icon: Users,
              title: 'Capacity',
              lines: ['Maximum 30 Children', 'All Ages Welcome', '3 Childcare Staff'],
            },
          ].map(({ icon: Icon, title, lines }) => (
            <div key={title} className="bg-white rounded-2xl border border-purple-100 p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#EDE0F5] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-[#4A1078]" />
              </div>
              <h3 className="font-bold text-[#4A1078] text-lg mb-3">{title}</h3>
              {lines.map((l) => (
                <p key={l} className="text-gray-600 text-sm leading-relaxed">{l}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-[#EDE0F5]/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#4A1078] mb-4">What&apos;s Included</h2>
          <p className="text-center text-gray-600 mb-10 max-w-xl mx-auto">Everything your child needs for a fun, safe, and memorable day.</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Clock, title: 'All-Day Care', desc: `${EVENT_START} to ${EVENT_END} continuous childcare with attentive staff` },
              { icon: Activity, title: 'Structured Activities', desc: 'Morning, afternoon, and evening activity blocks for all ages' },
              { icon: Utensils, title: 'Lunch & Dinner', desc: 'Kids join parents for lunch; staff-supervised buffet dinner at 6:30 PM' },
              { icon: Shield, title: 'Safe Environment', desc: 'Secure check-in/out, ID verification, and first-aid trained staff on site' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50 hover:border-purple-200 transition-colors">
                <div className="w-10 h-10 bg-[#4A1078] rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-16 bg-[#4A1078]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-4">Meet Your Childcare Team</h2>
          <p className="text-center text-purple-300 mb-10">Caring, attentive, and passionate about child safety.</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {STAFF.map((s) => (
              <div key={s.name} className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center border border-white/20">
                <div className="w-16 h-16 rounded-full bg-[#EDE0F5] flex items-center justify-center mx-auto mb-4 text-[#4A1078] text-2xl font-bold">
                  {s.name.charAt(0)}
                </div>
                <h3 className="font-bold text-white text-lg">{s.name}</h3>
                <p className="text-purple-300 text-sm mt-1">{s.role}</p>
                <a href={`tel:${s.phone}`} className="inline-flex items-center gap-1 text-[#F59E0B] text-sm mt-3 hover:underline">
                  <Phone className="w-3 h-3" />
                  {s.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Registration CTA */}
      <section className="py-16 max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-[#4A1078] mb-4">Sign Up Today — It&apos;s Free!</h2>
        <p className="text-gray-600 mb-8">Secure your child&apos;s spot for our May 30 childcare event.</p>
        <div className="bg-white rounded-3xl border-2 border-[#4A1078] p-10 shadow-lg">
          <div className="w-16 h-16 bg-[#EDE0F5] rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-[#4A1078]" />
          </div>
          <div className="text-5xl font-bold text-[#4A1078] mb-2">FREE</div>
          <p className="text-gray-500 text-lg mb-1">No signup fee</p>
          <p className="text-sm text-gray-400 mb-8">Includes all activities, supervision, lunch &amp; dinner</p>
          <ul className="text-left space-y-3 mb-8 max-w-xs mx-auto">
            {[
              'Full-day childcare supervision',
              'All structured activity materials',
              'Lunch & dinner included',
              'First-aid trained staff',
              'Secure sign-in/sign-out',
              'Signed waiver & confirmation email',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-[#4A1078] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          {registrationOpen ? (
            <>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#4A1078] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-900 transition-colors w-full justify-center"
              >
                Sign Up Now — Free &rarr;
              </Link>
            </>
          ) : (
            <div className="bg-gray-100 text-gray-500 px-8 py-4 rounded-xl font-bold text-lg w-full text-center">
              Signup Closed
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#EDE0F5]/30">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#4A1078] mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-purple-100 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-purple-50/50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-[#4A1078] shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 ml-4" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-purple-50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="mb-3">
                <Image
                  src="/logo-color.png"
                  alt="Hamro Event Solutions"
                  width={140}
                  height={42}
                  className="h-9 w-auto object-contain brightness-0 invert opacity-90"
                />
              </div>
              <p className="text-gray-400 text-sm">Childcare services for private events.</p>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-sm uppercase tracking-wide text-gray-300">Organizers</h4>
              {ORGANIZERS.map((o) => (
                <div key={o.name} className="mb-2">
                  <p className="text-sm font-medium">{o.name}</p>
                  <p className="text-xs text-gray-400">{o.role}</p>
                  <a href={`tel:${o.phone}`} className="text-xs text-[#F59E0B] hover:underline flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" />
                    {o.phone}
                  </a>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-bold mb-3 text-sm uppercase tracking-wide text-gray-300">Contact</h4>
              <a href="mailto:info@hamroeventsolutions.com" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white mb-2">
                <Mail className="w-4 h-4" />
                info@hamroeventsolutions.com
              </a>
              {registrationOpen && (
                <Link href="/register" className="inline-flex items-center gap-1 bg-[#4A1078] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-900 mt-2">
                  Sign Up Free
                </Link>
              )}
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-xs">
            <p>&copy; 2026 Hamro Event Solutions LLC. All rights reserved.</p>
            <p className="mt-1">Childcare Service &mdash; May 30, 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
