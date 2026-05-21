'use client';

import { useEffect, useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle2, Clock, Users, Baby, CreditCard, Download, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
}

interface AuthorizedPickup {
  id: string;
  name: string;
}

interface Registration {
  id: string;
  confirmationNumber: string;
  createdAt: string;
  parentFirstName: string;
  parentLastName: string;
  email: string;
  phone: string;
  paymentMethod: string;
  paymentStatus: string;
  amountCents: number;
  waiverSignedAt: string | null;
  waiverPdfUrl: string | null;
  children: Child[];
  authorizedPickups: AuthorizedPickup[];
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PAID: { label: 'Paid', className: 'bg-green-100 text-green-700 border-green-200' },
  CONFIRMED: { label: 'Confirmed', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  PENDING_ZELLE: { label: 'Pending Zelle', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  PENDING: { label: 'Pending', className: 'bg-gray-100 text-gray-600 border-gray-200' },
  FAILED: { label: 'Failed', className: 'bg-red-100 text-red-700 border-red-200' },
};

export default function AdminOverviewPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/children');
      const data = await res.json();
      setRegistrations(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const confirmZelle = async (registrationId: string) => {
    setConfirmingId(registrationId);
    try {
      const res = await fetch('/api/admin/zelle/confirm', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId }),
      });
      if (!res.ok) throw new Error('Confirmation failed');
      toast.success('Zelle payment confirmed!');
      await fetchData();
    } catch {
      toast.error('Failed to confirm payment');
    } finally {
      setConfirmingId(null);
    }
  };

  const exportCsv = () => {
    const headers = ['Confirmation', 'Parent Name', 'Email', 'Phone', 'Children', '# Children', 'Payment Method', 'Payment Status', 'Amount', 'Registered At'];
    const rows = registrations.map((r) => [
      r.confirmationNumber,
      `${r.parentFirstName} ${r.parentLastName}`,
      r.email,
      r.phone,
      r.children.map((c) => `${c.firstName} ${c.lastName} (${c.age})`).join('; '),
      r.children.length,
      r.paymentMethod,
      r.paymentStatus,
      `$${(r.amountCents / 100).toFixed(2)}`,
      new Date(r.createdAt).toLocaleString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hes-registrations.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalChildren = registrations.reduce((acc, r) => acc + r.children.length, 0);
  const paidCount = registrations.filter((r) => r.paymentStatus === 'PAID' || r.paymentStatus === 'CONFIRMED').length;
  const pendingZelleCount = registrations.filter((r) => r.paymentStatus === 'PENDING_ZELLE').length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registration Overview</h1>
          <p className="text-gray-500 text-sm mt-1">HES Babysitting — May 30, 2026</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download className="w-4 h-4 mr-1" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Children', value: totalChildren, icon: Baby, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Families', value: registrations.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Paid (Card)', value: paidCount, icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Pending Zelle', value: pendingZelleCount, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="border-0 shadow-sm">
            <CardContent className="pt-5 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No registrations yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Parent</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-center">Children</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Waiver</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((reg) => {
                  const statusInfo = statusConfig[reg.paymentStatus] || statusConfig['PENDING'];
                  return (
                    <TableRow key={reg.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div>{reg.parentFirstName} {reg.parentLastName}</div>
                        <div className="text-xs text-gray-400 font-mono">{reg.confirmationNumber.slice(0, 8)}...</div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{reg.email}</TableCell>
                      <TableCell className="text-sm text-gray-600">{reg.phone}</TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center gap-1 text-sm font-medium">
                          {reg.children.length}
                          <span className="text-gray-400 text-xs">({reg.children.map(c => c.firstName).join(', ')})</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusInfo.className} text-xs`}>{statusInfo.label}</Badge>
                        <div className="text-xs text-gray-400 mt-0.5">${(reg.amountCents / 100).toFixed(2)}</div>
                      </TableCell>
                      <TableCell>
                        {reg.waiverSignedAt ? (
                          <div className="flex items-center gap-1 text-green-600 text-xs">
                            <CheckCircle2 className="w-3 h-3" /> Signed
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">Pending</span>
                        )}
                        {reg.waiverPdfUrl && (
                          <a href={reg.waiverPdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#4A1078] hover:underline block mt-0.5">
                            PDF
                          </a>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-gray-500">
                        {new Date(reg.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {reg.paymentStatus === 'PENDING_ZELLE' && (
                          <Button
                            size="sm"
                            onClick={() => confirmZelle(reg.id)}
                            disabled={confirmingId === reg.id}
                            className="bg-[#4A1078] hover:bg-purple-900 text-white text-xs"
                          >
                            {confirmingId === reg.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              'Confirm Zelle'
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
