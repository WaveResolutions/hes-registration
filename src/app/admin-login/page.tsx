'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Baby, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin');
    } else {
      setError('Invalid password.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFCF8] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#4A1078] rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Baby className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#4A1078]">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Hamro Event Solutions LLC</p>
        </div>

        <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-5 text-center">Staff Access</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4A1078] hover:bg-purple-900 text-white py-5 font-semibold"
            >
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</> : 'Sign In'}
            </Button>
          </form>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          Staff access only. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
