'use client';
import { cn } from '@/lib/utils';

const steps = ['Parent', 'Children', 'Waiver', 'Payment', 'Review'];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="w-full py-5">
      <div className="flex items-center justify-between max-w-2xl mx-auto px-3 sm:px-4">
        {steps.map((label, i) => {
          const step = i + 1;
          const done = step < current;
          const active = step === current;
          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div className={cn(
                  'w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold border-2 transition-all shrink-0',
                  done && 'bg-[#4A1078] border-[#4A1078] text-white',
                  active && 'bg-white border-[#4A1078] text-[#4A1078]',
                  !done && !active && 'bg-white border-gray-300 text-gray-400'
                )}>
                  {done ? '✓' : step}
                </div>
                <span className={cn(
                  'hidden sm:block text-xs leading-tight text-center',
                  active ? 'text-[#4A1078] font-semibold' : 'text-gray-400'
                )}>
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn('flex-1 h-0.5 mx-1 sm:mx-2', done ? 'bg-[#4A1078]' : 'bg-gray-200')} />
              )}
            </div>
          );
        })}
      </div>
      {/* Active step label on mobile */}
      <p className="sm:hidden text-center text-xs text-[#4A1078] font-semibold mt-2">
        Step {current} of {steps.length}: {steps[current - 1]}
      </p>
    </div>
  );
}
