'use client';

import { useEffect, useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RefreshCw, Loader2, Search, LogIn, LogOut, Phone, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const STAFF_NAMES = ['Adriane Diaz', 'Riya Dev', 'Sol Moure Moreno'];

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  allergies: string | null;
  medicalConditions: string | null;
  specialNotes: string | null;
  checkedIn: boolean;
  checkedInAt: string | null;
  checkedInBy: string | null;
  checkedOut: boolean;
  checkedOutAt: string | null;
  checkedOutBy: string | null;
}

interface AuthorizedPickup {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

interface Registration {
  id: string;
  parentFirstName: string;
  parentLastName: string;
  phone: string;
  paymentStatus: string;
  children: Child[];
  authorizedPickups: AuthorizedPickup[];
}

export default function AdminSignInPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(STAFF_NAMES[0]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/children');
      const data = await res.json();
      setRegistrations(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAction = async (childId: string, action: 'checkin' | 'checkout') => {
    setActionLoading(childId + action);
    try {
      const res = await fetch('/api/admin/signin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId, action, staffName: selectedStaff }),
      });
      if (!res.ok) throw new Error('Action failed');
      const label = action === 'checkin' ? 'checked in' : 'checked out';
      toast.success(`Child ${label} by ${selectedStaff}`);
      await fetchData();
    } catch {
      toast.error('Action failed. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const allChildren = registrations.flatMap((r) =>
    r.children.map((c) => ({ ...c, parent: r }))
  );

  const filtered = search.trim()
    ? allChildren.filter((c) => {
        const q = search.toLowerCase();
        return (
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          c.parent.parentFirstName.toLowerCase().includes(q) ||
          c.parent.parentLastName.toLowerCase().includes(q)
        );
      })
    : allChildren;

  const getCardBorder = (child: Child) => {
    if (child.checkedOut) return 'border-purple-400 bg-purple-50';
    if (child.checkedIn) return 'border-green-400 bg-green-50';
    return 'border-gray-200 bg-white';
  };

  const getStatusBadge = (child: Child) => {
    if (child.checkedOut) return <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">Checked Out</Badge>;
    if (child.checkedIn) return <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Checked In</Badge>;
    return <Badge variant="outline" className="text-gray-400 text-xs">Not Arrived</Badge>;
  };

  const arrived = allChildren.filter((c) => c.checkedIn).length;
  const checkedOut = allChildren.filter((c) => c.checkedOut).length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Day-Of Sign In/Out Tracker</h1>
          <p className="text-gray-500 text-sm mt-1">May 30, 2026 &mdash; {allChildren.length} children total &bull; {arrived} arrived &bull; {checkedOut} departed</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
        </div>
      </div>

      {/* Staff Selector & Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-2 px-3">
          <span className="text-xs text-gray-500 font-medium">Staff:</span>
          <Select value={selectedStaff} onValueChange={setSelectedStaff}>
            <SelectTrigger className="border-0 shadow-none p-0 h-auto text-sm font-semibold text-[#4A1078] min-w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STAFF_NAMES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by child or parent name..."
            className="pl-9 bg-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((child) => {
            const isLoadingCheckIn = actionLoading === child.id + 'checkin';
            const isLoadingCheckOut = actionLoading === child.id + 'checkout';
            const hasAlerts = child.allergies || child.medicalConditions;

            return (
              <div
                key={child.id}
                className={cn('rounded-2xl border-2 p-4 transition-all shadow-sm', getCardBorder(child))}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {child.firstName} {child.lastName}
                    </h3>
                    <p className="text-gray-500 text-sm">Age {child.age}</p>
                  </div>
                  {getStatusBadge(child)}
                </div>

                {/* Alerts */}
                {hasAlerts && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-3 text-xs text-amber-800">
                    <div className="flex items-center gap-1 font-semibold mb-1">
                      <AlertTriangle className="w-3 h-3" /> Medical Info
                    </div>
                    {child.allergies && <p><span className="font-medium">Allergies:</span> {child.allergies}</p>}
                    {child.medicalConditions && <p><span className="font-medium">Conditions:</span> {child.medicalConditions}</p>}
                  </div>
                )}

                {child.specialNotes && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 mb-3 text-xs text-blue-800">
                    <span className="font-medium">Notes:</span> {child.specialNotes}
                  </div>
                )}

                {/* Parent */}
                <div className="text-xs text-gray-500 mb-2">
                  <span className="font-medium">Parent:</span> {child.parent.parentFirstName} {child.parent.parentLastName}
                  <a href={`tel:${child.parent.phone}`} className="ml-2 text-[#4A1078] hover:underline inline-flex items-center gap-0.5">
                    <Phone className="w-3 h-3" />{child.parent.phone}
                  </a>
                </div>

                {/* Authorized Pickups */}
                {child.parent.authorizedPickups.length > 0 && (
                  <div className="text-xs text-gray-500 mb-3">
                    <span className="font-medium">Pickups:</span>{' '}
                    {child.parent.authorizedPickups.map((p) => p.name).join(', ')}
                  </div>
                )}

                {/* Check-in status */}
                {child.checkedIn && child.checkedInAt && (
                  <p className="text-xs text-green-600 mb-2">
                    In: {new Date(child.checkedInAt).toLocaleTimeString()} by {child.checkedInBy}
                  </p>
                )}
                {child.checkedOut && child.checkedOutAt && (
                  <p className="text-xs text-purple-600 mb-2">
                    Out: {new Date(child.checkedOutAt).toLocaleTimeString()} by {child.checkedOutBy}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  {!child.checkedIn && !child.checkedOut && (
                    <Button
                      size="sm"
                      onClick={() => handleAction(child.id, 'checkin')}
                      disabled={!!actionLoading}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs"
                    >
                      {isLoadingCheckIn ? <Loader2 className="w-3 h-3 animate-spin" /> : <><LogIn className="w-3 h-3 mr-1" /> Check In</>}
                    </Button>
                  )}
                  {child.checkedIn && !child.checkedOut && (
                    <Button
                      size="sm"
                      onClick={() => handleAction(child.id, 'checkout')}
                      disabled={!!actionLoading}
                      className="flex-1 bg-[#4A1078] hover:bg-purple-900 text-white text-xs"
                    >
                      {isLoadingCheckOut ? <Loader2 className="w-3 h-3 animate-spin" /> : <><LogOut className="w-3 h-3 mr-1" /> Check Out</>}
                    </Button>
                  )}
                  {child.checkedOut && (
                    <div className="flex-1 text-center text-xs text-purple-600 font-medium py-2">
                      Released
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && !loading && (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No children found matching &ldquo;{search}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
