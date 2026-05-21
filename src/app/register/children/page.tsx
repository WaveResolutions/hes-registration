'use client';

import { useForm, useFieldArray } from 'react-hook-form';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Plus, Trash2, Baby, UserCheck, AlertCircle } from 'lucide-react';
import { differenceInYears } from 'date-fns';

const childSchema = z.object({
  childFirstName: z.string().min(1, 'First name required'),
  childLastName: z.string().min(1, 'Last name required'),
  dateOfBirth: z.string().min(1, 'Date of birth required'),
  gender: z.string().optional(),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
  specialNotes: z.string().optional(),
});

const pickupSchema = z.object({
  pickupName: z.string().min(1, 'Name required'),
  pickupRelationship: z.string().min(1, 'Relationship required'),
  pickupPhone: z.string().min(10, 'Valid phone required'),
  pickupIDType: z.string().optional(),
});

const schema = z.object({
  children: z.array(childSchema).min(1, 'At least one child required'),
  authorizedPickups: z.array(pickupSchema).min(1, 'At least one authorized pickup required'),
});

type FormData = z.infer<typeof schema>;

export default function ChildrenPage() {
  const router = useRouter();
  const { children: savedChildren, authorizedPickups: savedPickups, setChildren, setAuthorizedPickups, setCurrentStep } = useRegistrationStore();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      children: savedChildren.length > 0 ? savedChildren.map(c => ({
        childFirstName: c.childFirstName,
        childLastName: c.childLastName,
        dateOfBirth: c.dateOfBirth,
        gender: c.gender || '',
        allergies: c.allergies || '',
        medicalConditions: c.medicalConditions || '',
        specialNotes: c.specialNotes || '',
      })) : [{ childFirstName: '', childLastName: '', dateOfBirth: '', gender: '', allergies: '', medicalConditions: '', specialNotes: '' }],
      authorizedPickups: savedPickups.length > 0 ? savedPickups.map(p => ({
        pickupName: p.pickupName,
        pickupRelationship: p.pickupRelationship,
        pickupPhone: p.pickupPhone,
        pickupIDType: p.pickupIDType || '',
      })) : [{ pickupName: '', pickupRelationship: '', pickupPhone: '', pickupIDType: '' }],
    },
  });

  const { fields: childFields, append: addChild, remove: removeChild } = useFieldArray({ control, name: 'children' });
  const { fields: pickupFields, append: addPickup, remove: removePickup } = useFieldArray({ control, name: 'authorizedPickups' });

  const watchChildren = watch('children');

  const getAge = (dob: string) => {
    if (!dob) return null;
    try {
      const age = differenceInYears(new Date(), new Date(dob));
      return age >= 0 ? age : null;
    } catch {
      return null;
    }
  };

  const onSubmit = (data: FormData) => {
    setChildren(data.children.map(c => ({
      ...c,
      age: getAge(c.dateOfBirth) || 0,
    })));
    setAuthorizedPickups(data.authorizedPickups);
    setCurrentStep(3);
    router.push('/register/waiver');
  };

  const childrenErrors = errors.children as { message?: string } | undefined;

  return (
    <div className="max-w-3xl mx-auto px-4 pb-16">
      <StepIndicator current={2} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Children Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#4A1078] flex items-center gap-2">
              <Baby className="w-5 h-5" />
              Children ({childFields.length})
            </h2>
            {childFields.length < 5 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addChild({ childFirstName: '', childLastName: '', dateOfBirth: '', gender: '', allergies: '', medicalConditions: '', specialNotes: '' })}
                className="border-[#4A1078] text-[#4A1078] hover:bg-purple-50"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Child
              </Button>
            )}
          </div>

          {childrenErrors?.message && (
            <p className="text-red-500 text-sm mb-4 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />{childrenErrors.message}
            </p>
          )}

          <div className="space-y-4">
            {childFields.map((field, index) => {
              const age = getAge(watchChildren?.[index]?.dateOfBirth || '');
              const childErrors = errors.children?.[index];
              return (
                <Card key={field.id} className="border-purple-100 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-[#4A1078]">
                        Child {index + 1}
                        {age !== null && (
                          <span className="ml-2 bg-[#EDE0F5] text-[#4A1078] text-xs px-2 py-0.5 rounded-full font-medium">
                            Age {age}
                          </span>
                        )}
                      </CardTitle>
                      {childFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeChild(index)}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label>First Name *</Label>
                        <Input {...register(`children.${index}.childFirstName`)} placeholder="Emma" />
                        {childErrors?.childFirstName && (
                          <p className="text-red-500 text-xs">{childErrors.childFirstName.message}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <Label>Last Name *</Label>
                        <Input {...register(`children.${index}.childLastName`)} placeholder="Smith" />
                        {childErrors?.childLastName && (
                          <p className="text-red-500 text-xs">{childErrors.childLastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label>Date of Birth *</Label>
                        <Input type="date" {...register(`children.${index}.dateOfBirth`)} />
                        {childErrors?.dateOfBirth && (
                          <p className="text-red-500 text-xs">{childErrors.dateOfBirth.message}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <Label>Gender (optional)</Label>
                        <Select
                          defaultValue=""
                          onValueChange={(v) => setValue(`children.${index}.gender`, v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Boy">Boy</SelectItem>
                            <SelectItem value="Girl">Girl</SelectItem>
                            <SelectItem value="Non-binary">Non-binary</SelectItem>
                            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label>Allergies (food, medication, environmental)</Label>
                      <Textarea
                        {...register(`children.${index}.allergies`)}
                        placeholder="List any allergies — e.g., peanuts, bee stings, penicillin. Write 'None' if none."
                        rows={2}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Medical Conditions / Diagnoses</Label>
                      <Textarea
                        {...register(`children.${index}.medicalConditions`)}
                        placeholder="e.g., asthma, ADHD, diabetes. Write 'None' if none."
                        rows={2}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Special Notes for Staff</Label>
                      <Textarea
                        {...register(`children.${index}.specialNotes`)}
                        placeholder="Anything staff should know — comfort items, behavioral notes, medications to administer, etc."
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Authorized Pickups Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#4A1078] flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Authorized Pick-Ups
            </h2>
            {pickupFields.length < 3 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addPickup({ pickupName: '', pickupRelationship: '', pickupPhone: '', pickupIDType: '' })}
                className="border-[#4A1078] text-[#4A1078] hover:bg-purple-50"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Person
              </Button>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm text-amber-800">
            <strong>Important:</strong> Only people listed here may pick up your child. Valid government-issued photo ID will be required.
          </div>

          <div className="space-y-4">
            {pickupFields.map((field, index) => {
              const pickupErrors = errors.authorizedPickups?.[index];
              return (
                <Card key={field.id} className="border-purple-100 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-[#4A1078]">
                        Authorized Person {index + 1}
                      </CardTitle>
                      {pickupFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePickup(index)}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label>Full Name *</Label>
                        <Input {...register(`authorizedPickups.${index}.pickupName`)} placeholder="John Smith" />
                        {pickupErrors?.pickupName && (
                          <p className="text-red-500 text-xs">{pickupErrors.pickupName.message}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <Label>Relationship *</Label>
                        <Input {...register(`authorizedPickups.${index}.pickupRelationship`)} placeholder="Father, Aunt, etc." />
                        {pickupErrors?.pickupRelationship && (
                          <p className="text-red-500 text-xs">{pickupErrors.pickupRelationship.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label>Phone Number *</Label>
                        <Input type="tel" {...register(`authorizedPickups.${index}.pickupPhone`)} placeholder="(555) 000-0000" />
                        {pickupErrors?.pickupPhone && (
                          <p className="text-red-500 text-xs">{pickupErrors.pickupPhone.message}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <Label>Expected ID Type</Label>
                        <Select
                          defaultValue=""
                          onValueChange={(v) => setValue(`authorizedPickups.${index}.pickupIDType`, v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select ID type..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Driver's License">Driver&apos;s License</SelectItem>
                            <SelectItem value="Passport">Passport</SelectItem>
                            <SelectItem value="State ID">State ID</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 py-6 border-[#4A1078] text-[#4A1078]"
            onClick={() => { setCurrentStep(1); router.push('/register'); }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button
            type="submit"
            className="flex-[2] bg-[#4A1078] hover:bg-purple-900 text-white py-6 text-lg font-semibold rounded-xl"
          >
            Next: Waiver <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );
}
