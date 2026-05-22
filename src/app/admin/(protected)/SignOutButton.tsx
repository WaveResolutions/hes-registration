'use client';

export function SignOutButton() {
  return (
    <button
      onClick={async () => {
        await fetch('/api/admin/auth', { method: 'DELETE' });
        window.location.href = '/admin-login';
      }}
      className="hover:text-purple-200 px-2 py-1 rounded hover:bg-white/10 transition-colors text-purple-300 text-sm"
    >
      Sign Out
    </button>
  );
}
