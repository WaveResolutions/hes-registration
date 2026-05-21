'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { StepIndicator } from '@/components/registration/StepIndicator';
import { useRegistrationStore } from '@/store/registrationStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, User, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';

const schema = z.object({
  parentFirstName: z.string().min(1, 'First name is required'),
  parentLastName: z.string().min(1, 'Last name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone number required'),
  address: z.string().optional(),
  emergencyContactName: z.string().min(1, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().min(10, 'Valid phone number required'),
  emergencyContactRel: z.string().min(1, 'Relationship is required'),
});

type FormData = z.infer<typeof schema>;

export default function ParentInfoPage() {
  const router = useRouter();
  const { parent, setParent, setCurrentStep } = useRegistrationStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      parentFirstName: parent.parentFirstName || '',
      parentLastName: parent.parentLastName || '',
      relationship: parent.relationship || '',
      email: parent.email || '',
      phone: parent.phone || '',
      address: parent.address || '',
      emergencyContactName: parent.emergencyContactName || '',
      emergencyContactPhone: parent.emergencyContactPhone || '',
      emergencyContactRel: parent.emergencyContactRel || '',
    },
  });

  const onSubmit = (data: FormData) => {
    setParent(data);
    setCurrentStep(2);
    router.push('/register/children');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pb-16">
      <StepIndicator current={1} />

      <Card className="shadow-sm border-purple-100">
        <CardHeader className="pb-4">
          <CardTitle className="text-[#4A1078] flex items-center gap-2">
            <User className="w-5 h-5" />
            Parent / Guardian Information
          </CardTitle>
          <CardDescription>
            Please provide your contact details and emergency information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Parent Name */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">Your Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="parentFirstName">First Name *</Label>
                  <Input id="parentFirstName" {...register('parentFirstName')} placeholder="Jane" />
                  {errors.parentFirstName && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{errors.parentFirstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="parentLastName">Last Name *</Label>
                  <Input id="parentLastName" {...register('parentLastName')} placeholder="Smith" />
                  {errors.parentLastName && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{errors.parentLastName.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Relationship */}
            <div className="space-y-1">
              <Label>Relationship to Child *</Label>
              <Select
                defaultValue={parent.relationship || ''}
                onValueChange={(v) => setValue('relationship', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mother">Mother</SelectItem>
                  <SelectItem value="Father">Father</SelectItem>
                  <SelectItem value="Legal Guardian">Legal Guardian</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.relationship && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{errors.relationship.message}
                </p>
              )}
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="email">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> Email *</span>
                </Label>
                <Input id="email" type="email" {...register('email')} placeholder="jane@example.com" />
                {errors.email && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> Phone *</span>
                </Label>
                <Input id="phone" type="tel" {...register('phone')} placeholder="(555) 000-0000" />
                {errors.phone && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1">
              <Label htmlFor="address">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Home Address (optional)</span>
              </Label>
              <Textarea id="address" {...register('address')} placeholder="123 Main St, Chicago, IL 60601" rows={2} />
            </div>

            {/* Emergency Contact */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">Emergency Contact</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="emergencyContactName">Full Name *</Label>
                    <Input id="emergencyContactName" {...register('emergencyContactName')} placeholder="John Smith" />
                    {errors.emergencyContactName && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{errors.emergencyContactName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="emergencyContactPhone">Phone Number *</Label>
                    <Input id="emergencyContactPhone" type="tel" {...register('emergencyContactPhone')} placeholder="(555) 000-0001" />
                    {errors.emergencyContactPhone && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{errors.emergencyContactPhone.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="emergencyContactRel">Relationship to Child *</Label>
                  <Input id="emergencyContactRel" {...register('emergencyContactRel')} placeholder="Grandmother, Uncle, etc." />
                  {errors.emergencyContactRel && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{errors.emergencyContactRel.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#4A1078] hover:bg-purple-900 text-white py-6 text-lg font-semibold rounded-xl"
            >
              Next: Children <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
