import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#4A1078] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg">HES Admin</span>
          <span className="text-purple-300 text-sm hidden md:block">May 30, 2026</span>
        </div>
        <div className="flex items-center gap-1 md:gap-4 text-sm">
          <Link href="/admin" className="hover:text-purple-200 px-2 py-1 rounded hover:bg-white/10 transition-colors">
            Overview
          </Link>
          <Link href="/admin/signin" className="hover:text-purple-200 px-2 py-1 rounded hover:bg-white/10 transition-colors">
            Sign In/Out
          </Link>
          <Link href="/admin/waivers" className="hover:text-purple-200 px-2 py-1 rounded hover:bg-white/10 transition-colors">
            Waivers
          </Link>
          <Link href="/api/auth/signout" className="hover:text-purple-200 px-2 py-1 rounded hover:bg-white/10 transition-colors text-purple-300">
            Sign Out
          </Link>
        </div>
      </nav>
      <main className="p-4 md:p-6">{children}</main>
    </div>
  );
}
