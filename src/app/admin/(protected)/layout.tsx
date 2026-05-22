import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('hes_admin')?.value;
  if (!token || token !== process.env.ADMIN_TOKEN) {
    redirect('/admin-login');
  }

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
          <button
            onClick={async () => { await fetch('/api/admin/auth', { method: 'DELETE' }); window.location.href = '/admin-login'; }}
            className="hover:text-purple-200 px-2 py-1 rounded hover:bg-white/10 transition-colors text-purple-300 text-sm"
          >
            Sign Out
          </button>
        </div>
      </nav>
      <main className="p-4 md:p-6">{children}</main>
    </div>
  );
}
