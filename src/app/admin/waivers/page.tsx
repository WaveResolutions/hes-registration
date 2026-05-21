'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Loader2, Download, FileText, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
}

interface Registration {
  id: string;
  confirmationNumber: string;
  parentFirstName: string;
  parentLastName: string;
  email: string;
  waiverSignedAt: string | null;
  waiverSignatureType: string | null;
  waiverPdfUrl: string | null;
  children: Child[];
  createdAt: string;
}

export default function WaiversPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/children');
      const data = await res.json();
      setRegistrations(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load waivers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const signedCount = registrations.filter((r) => r.waiverSignedAt).length;
  const pendingCount = registrations.filter((r) => !r.waiverSignedAt).length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Waiver Manager</h1>
          <p className="text-gray-500 text-sm mt-1">
            {signedCount} signed &bull; {pendingCount} pending
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData}>
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading waivers...
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No registrations yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Parent</TableHead>
                  <TableHead>Children</TableHead>
                  <TableHead>Signed At</TableHead>
                  <TableHead>Signature Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>PDF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((reg) => (
                  <TableRow key={reg.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="font-medium text-sm">{reg.parentFirstName} {reg.parentLastName}</div>
                      <div className="text-xs text-gray-400">{reg.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {reg.children.map((c) => (
                          <span key={c.id} className="block">{c.firstName} {c.lastName} (Age {c.age})</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {reg.waiverSignedAt
                        ? new Date(reg.waiverSignedAt).toLocaleString()
                        : <span className="text-gray-400">—</span>
                      }
                    </TableCell>
                    <TableCell>
                      {reg.waiverSignatureType ? (
                        <Badge variant="outline" className="text-xs capitalize">
                          {reg.waiverSignatureType}
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {reg.waiverSignedAt ? (
                        <div className="flex items-center gap-1 text-green-600 text-xs">
                          <CheckCircle2 className="w-3 h-3" /> Signed
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-amber-600 text-xs">
                          <Clock className="w-3 h-3" /> Pending
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {reg.waiverPdfUrl ? (
                        <a
                          href={reg.waiverPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#4A1078] hover:underline text-xs font-medium"
                        >
                          <Download className="w-3 h-3" /> Download
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">No PDF</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
