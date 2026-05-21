import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isRegistrationOpen } from '@/lib/registration-deadline';

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  if (!isRegistrationOpen()) {
    redirect('/?closed=1');
  }

  return (
    <div className="min-h-screen bg-[#FEFCF8]">
      <header className="bg-[#4A1078] sticky top-0 z-50 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0 hover:opacity-80 transition-opacity">
            <Image
              src="/logo-color.png"
              alt="Hamro Event Solutions"
              width={140}
              height={42}
              className="h-9 w-auto object-contain brightness-0 invert"
              priority
            />
          </Link>
          <div className="text-right">
            <p className="text-white font-semibold text-sm leading-tight">Child Signup</p>
            <p className="text-purple-300 text-xs">May 30, 2026 · 8 AM – 9 PM · Free</p>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
